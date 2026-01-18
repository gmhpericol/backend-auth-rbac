import { JobRepository } from "./JobRepository.js";
import { Prisma, PrismaClient } from "@prisma/client";
import { Job } from "../../domain/job/Job.js";
import { JobStatus } from "../../domain/job/JobStatus.js";
import { ExecutionStatus } from "../../domain/job/ExecutionStatus.js";

const prisma = new PrismaClient();

export class PrismaJobRepository implements JobRepository {

  async findRunningJobs(): Promise<Job[]> {
    const records = await prisma.job.findMany({
      where: { status: JobStatus.RUNNING },
      include: { executions: true },
    });
    return records.map((record) => this.mapToDomain(record));
  }

  async create(job: Job): Promise<void> {
    await prisma.job.create({
      data: {
        id: job.id,
        jobKey: job.jobKey,
        type: job.getType(),
        payload: job.getPayload() as Prisma.JsonObject,
        status: JobStatus.PENDING,
        attempt: 0,
        maxAttempts: job.getMaxAttempts(),
        nextRunAt: job.getNextRunAt(),
      },
    });
  }

  async save(job: Job): Promise<void> {
    await prisma.$transaction(async (tx) => {
      await tx.job.update({
        where: { id: job.id },
        data: {
          status: job.getStatus(),
          attempt: job.getAttempt(),
          nextRunAt: job.getNextRunAt(),
        },
      });

      for (const exec of job.getExecutions()) {
        await tx.jobExecution.upsert({
          where: {
            jobId_attempt: {
              jobId: job.id,
              attempt: exec.attempt,
            },
          },
          update: {
            status: exec.status,
            finishedAt: exec.finishedAt,
            error: exec.error,
          },
          create: {
            id: exec.id,
            jobId: job.id,
            attempt: exec.attempt,
            status: exec.status,
            startedAt: exec.startedAt,
            finishedAt: exec.finishedAt,
            error: exec.error,
          },
        });
      }
    });
  }

  async findById(id: string): Promise<Job | null> {
    const record = await prisma.job.findUnique({
      where: { id },
      include: { executions: true },
    });
    return record ? this.mapToDomain(record) : null;
  }

  async findByJobKey(jobKey: string): Promise<Job | null> {
    const record = await prisma.job.findUnique({
      where: { jobKey },
      include: { executions: true },
    });
    return record ? this.mapToDomain(record) : null;
  }

  async findNextRunnable(now: Date): Promise<Job | null> {
    const record = await prisma.job.findFirst({
      where: {
        status: JobStatus.PENDING,
        nextRunAt: { lte: now },
      },
      orderBy: { nextRunAt: "asc" },
      include: { executions: true },
    });

    return record ? this.mapToDomain(record) : null;
  }

  private mapToDomain(record: any): Job {
    const job = new Job({
      id: record.id,
      jobKey: record.jobKey,
      type: record.type,
      payload: record.payload,
      maxAttempts: record.maxAttempts,
      nextRunAt: record.nextRunAt,
    });

    (job as any).status = record.status;
    (job as any).attempt = record.attempt;

    for (const exec of record.executions) {
      (job as any).executions.push({
        id: exec.id,
        attempt: exec.attempt,
        status: exec.status as ExecutionStatus,
        startedAt: exec.startedAt,
        finishedAt: exec.finishedAt ?? undefined,
        error: exec.error ?? undefined,
      });
    }

    return job;
  }
}
