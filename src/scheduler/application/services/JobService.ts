import { JobRepository } from "../JobRepository.js";
import { Job } from "../../domain/job/Job.js";
import { randomUUID } from "crypto";
import { exponentialBackoff } from "../policies/BackoffPolicy.js";

interface CreateJobInput {
  jobKey: string;
  type: string;
  payload: unknown;
  maxAttempts: number;
}

export class JobService {
  constructor(private readonly jobRepository: JobRepository) {}

  async createJob(input: CreateJobInput): Promise<Job> {
    // 1️⃣ Idempotency check
    const existing = await this.jobRepository.findByJobKey(input.jobKey);
    if (existing) {
      return existing;
    }

    // 2️⃣ Create new Job aggregate
    const job = new Job({
      id: randomUUID(),
      jobKey: input.jobKey,
      type: input.type,
      payload: input.payload,
      maxAttempts: input.maxAttempts,
      nextRunAt: new Date(),
    });

    // 3️⃣ Persist
    await this.jobRepository.save(job);

    return job;
  }

  async startNextJob(now: Date): Promise<Job | null> {
    const job = await this.jobRepository.findNextRunnable(now);
    if (!job) {
        return null;
    }

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
}
