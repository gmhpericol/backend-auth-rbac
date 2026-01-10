import { prisma } from "../../../config/prisma.js";
import { JobRepository } from "../../infrastructure/repositories/JobRepository.js";
import { Job } from "../../domain/job/Job.js";
import { JobExecution } from "../../domain/job/JobExecution.js";
import { Prisma } from "@prisma/client";

export class PrismaJobRepository implements JobRepository {
  async findById(id: string): Promise<Job | null> {
    const record = await prisma.job.findUnique({
      where: { id },
      include: { executions: true },
    });

    return record ? this.toDomain(record) : null;
  }

  async findByJobKey(jobKey: string): Promise<Job | null> {
    const record = await prisma.job.findUnique({
      where: { jobKey },
      include: { executions: true },
    });

    return record ? this.toDomain(record) : null;
  }

  async save(job: Job): Promise<void> {
    await prisma.$transaction(async (tx) => {
      await tx.job.upsert({
      where: { jobKey: job.getJobKey() }, 
      update: {
        status: job.getStatus(),
        attempt: job.getAttempt(),
        nextRunAt: job.getNextRunAt(),
      },
      create: {
        id: job.id,
        jobKey: job.getJobKey(),
        type: job.getType(),
        payload: job.getPayload() as Prisma.InputJsonValue,
        status: job.getStatus(),
        attempt: job.getAttempt(),
        maxAttempts: job.getMaxAttempts(),
        nextRunAt: job.getNextRunAt(),
        createdAt: job.getCreatedAt(),
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

  private toDomain(record: any): Job {
    const job = new Job({
      id: record.id,
      jobKey: record.jobKey,
      type: record.type,
      payload: record.payload,
      maxAttempts: record.maxAttempts,
      nextRunAt: record.nextRunAt,
    });

    // Rehidratare controlată (intern repository)
    (job as any).status = record.status;
    (job as any).attempt = record.attempt;

    for (const exec of record.executions) {
      const execution: JobExecution = {
        id: exec.id,
        attempt: exec.attempt,
        status: exec.status,
        startedAt: exec.startedAt,
        finishedAt: exec.finishedAt ?? undefined,
        error: exec.error ?? undefined,
      };

      (job as any).executions.push(execution);
    }

    return job;
  };
  
  async findNextRunnable(now: Date): Promise<Job | null> {
  const record = await prisma.job.findFirst({
    where: {
      status: "PENDING",
      nextRunAt: { lte: now },
    },
    orderBy: { nextRunAt: "asc" },
    include: { executions: true },
  });

  return record ? this.toDomain(record) : null;
}

}
