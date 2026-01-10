import { PrismaJobRepository } from "./infrastructure/repositories/PrismaJobRepository.js";
import { JobService } from "./application/services/JobService.js";
import { JobExecutor } from "./worker/JobExecutor.js";
import { Worker } from "./worker/Worker.js";
import { NodemailerEmailService } from "../services/email/NodemailerEmailService.js";

const jobRepository = new PrismaJobRepository();
export const jobService = new JobService(jobRepository);
const emailService = new NodemailerEmailService();

const executor = new JobExecutor(emailService);
const worker = new Worker(jobService, executor);

export function startScheduler(): void {
  worker.start();
}