import { JobRepository } from "../JobRepository.js";
import { Job } from "../../domain/job/Job.js";
import { randomUUID } from "crypto";
import { exponentialBackoff } from "../policies/BackoffPolicy.js";
import { JOB_MAX_RUNTIME_MS } from "../../config.js";
import { WORKER_LEASE_MS } from "../../config.js";


interface CreateJobInput {
  jobKey: string;
  type: string;
  payload: unknown;
  maxAttempts: number;
  runAt?: Date;
}

export class JobService {
  constructor(private readonly jobRepository: JobRepository) {}

  async createJob(input: CreateJobInput): Promise<Job> {
    // 1️⃣ Idempotency check
    const existing = await this.jobRepository.findByJobKey(input.jobKey);
    if (existing) {
      return existing;
    }
    const now = new Date();

    // 2️⃣ Create new Job aggregate
    const job = new Job({
      id: randomUUID(),
      jobKey: input.jobKey,
      type: input.type,
      payload: input.payload,
      maxAttempts: input.maxAttempts,
      nextRunAt: input.runAt ?? now,
    });

    // 3️⃣ Persist
    await this.jobRepository.create(job);

    return job;
  }

  async startNextJob(now: Date, workerId: string): Promise<Job | null> {
    const job = await this.jobRepository.findNextRunnable(now);

    if (!job) return null;

    job.assignLease(workerId, now, WORKER_LEASE_MS);
    job.startExecution(now, randomUUID());

    await this.jobRepository.save(job);
    return job;
  }



  async completeJob(jobId:string, now:Date): Promise<void> {
    const job = await this.jobRepository.findById(jobId);
    if (!job) {
      throw new Error(`Job with id ${jobId} not found`);
    }

    job.completeExecution(now);
    await this.jobRepository.save(job);
  }

  async failJob(
    jobId: string,
    now: Date,
    error: string
  ): Promise<void> {
    const job = await this.jobRepository.findById(jobId);
    if (!job) {
        throw new Error(`Job with id ${jobId} not found`);
    }

    job.failExecution(now, error);
    await this.jobRepository.save(job);
  } 

  async scheduleRetry(jobId: string, now: Date): Promise<void> {
    const job = await this.jobRepository.findById(jobId);
    if (!job) {
        throw new Error(`Job with id ${jobId} not found`);
    }

    if (!job.canRetry()) {
        job.markDead(now);
        await this.jobRepository.save(job);
        return;
    }

    const delayMs = exponentialBackoff(job.getAttempt());
    const nextRunAt = new Date(now.getTime() + delayMs);

    job.scheduleRetry(nextRunAt);
    await this.jobRepository.save(job);
    }

  async recoverStuckJobs(now: Date): Promise<void> {
    const runningJobs = await this.jobRepository.findRunningJobs();

    for (const job of runningJobs) {
      job.failExecution(
        now,
        "Worker crashed or restarted"
      );

      if (job.getStatus() === "FAILED") {
        const delayMs = exponentialBackoff(job.getAttempt());
        const nextRunAt = new Date(now.getTime() + delayMs);

        job.scheduleRetry(nextRunAt);
      }

      await this.jobRepository.save(job);
    }
  }

  async recoverTimedOutJobs(now: Date): Promise<void> {
    const runningJobs = await this.jobRepository.findRunningJobs();

    for (const job of runningJobs) {
      const execution = job.getActiveExecution();
      if (!job.isLeaseExpired(now)) continue;
      
      job.clearLease();
      job.failExecution(
        now,
        "Lease expired (worker likely crashed)"
      );

      if (job.getStatus() === "FAILED") {
        const delayMs = exponentialBackoff(job.getAttempt());
        job.scheduleRetry(new Date(now.getTime() + delayMs));
      }

      await this.jobRepository.save(job);
    }
  }



}
