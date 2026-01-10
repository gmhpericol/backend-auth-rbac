import { PrismaJobRepository } from "./infrastructure/repositories/PrismaJobRepository.js";
import { JobService } from "./application/services/JobService.js";
import { JobExecutor } from "./worker/JobExecutor.js";
import { Worker } from "./worker/Worker.js";
import { ResendEmailService } from "../services/email/ResendEmailService";

// Infrastructure
const jobRepository = new PrismaJobRepository();
const emailService = new ResendEmailService();

// Application
export const jobService = new JobService(jobRepository);

// Worker
const executor = new JobExecutor(emailService);
const worker = new Worker(jobService, executor);

// Public API
export function startScheduler(): void {
  worker.start();
}
