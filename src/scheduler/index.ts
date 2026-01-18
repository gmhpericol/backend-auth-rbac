import { PrismaJobRepository } from "./infrastructure/repositories/PrismaJobRepository.js";
import { JobService } from "./application/services/JobService.js";
import { JobExecutor } from "./worker/JobExecutor.js";
import { Worker } from "./worker/Worker.js";
import { ResendEmailService } from "../services/email/ResendEmailService.js";

// Infrastructure
const jobRepository = new PrismaJobRepository();
const emailService = new ResendEmailService();

// Application
export const jobService = new JobService(jobRepository);

// Worker
const executor = new JobExecutor(emailService);
const worker = new Worker(jobService, executor);

// Public API
export async function startScheduler(): Promise<void> {
  console.log("[SCHEDULER] Recovering stuck jobs...");
  await jobService.recoverStuckJobs(new Date());

  console.log("[SCHEDULER] Starting worker...");
  worker.start();
}

