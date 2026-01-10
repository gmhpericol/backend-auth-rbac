import { JobService } from "../application/services/JobService.js";
import { JobExecutor } from "./JobExecutor.js";

export class Worker {
  private isRunning = false;

  constructor(
    private readonly jobService: JobService,
    private readonly executor: JobExecutor,
    private readonly intervalMs = 2_000
  ) {}

  start(): void {
    setInterval(() => this.tick(), this.intervalMs);
  }

  async tick(): Promise<void> {
    if (this.isRunning) {
      return;
    }

    this.isRunning = true;

    try {
      const now = new Date();
      const job = await this.jobService.startNextJob(now);

      if (!job) {
        return;
      }

      try {
        await this.executor.execute(job);
        await this.jobService.completeJob(job.id, new Date());
      } catch (err) {
        await this.jobService.failJob(
          job.id,
          new Date(),
          (err as Error).message
        );

        await this.jobService.scheduleRetry(job.id, new Date());
      }
    } finally {
      this.isRunning = false;
    }
  }
}
