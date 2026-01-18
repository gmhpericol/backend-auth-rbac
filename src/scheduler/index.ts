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
const TIMEOUT_RECOVERY_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

// Public API
export async function startScheduler(): Promise<void> {
  console.log("[SCHEDULER] Recovering crashed jobs...");
  await jobService.recoverStuckJobs(new Date());

  console.log("[SCHEDULER] Recovering timed-out jobs...");
  await jobService.recoverTimedOutJobs(new Date());

  console.log("[SCHEDULER] Starting worker...");
  worker.start();

  setInterval(() => {
    jobService
      .recoverTimedOutJobs(new Date())
      .catch((err) => 
        console.error(
          "[SCHEDULER] Error recovering timed-out jobs:", err)
        );
      }, TIMEOUT_RECOVERY_INTERVAL_MS );


}


