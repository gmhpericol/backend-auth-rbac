import { PrismaJobRepository } from "./infrastructure/repositories/PrismaJobRepository";
import { JobService } from "./application/services/JobService";
import { JobExecutor } from "./worker/JobExecutor";
import { Worker } from "./worker/Worker";

const jobRepository = new PrismaJobRepository();
export const jobService = new JobService(jobRepository);

const executor = new JobExecutor();
const worker = new Worker(jobService, executor);

export function startScheduler(): void {
  worker.start();
}