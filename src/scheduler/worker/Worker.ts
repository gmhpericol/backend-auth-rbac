import { randomUUID } from "crypto";
import { JobService } from "../application/services/JobService.js";
import { JobExecutor } from "./JobExecutor.js";

export class Worker {
  private readonly workerId = randomUUID();

  private isRunning = false;
  private shuttingDown = false;

  private intervalId?: NodeJS.Timeout;

  constructor(
    private readonly jobService: JobService,
    private readonly executor: JobExecutor,
    private readonly intervalMs = 2_000
  ) {}

  start(): void {
    console.log("[WORKER] Started", this.workerId);

    this.intervalId = setInterval(() => {
      if (!this.shuttingDown) {
        this.tick();
      }
    }, this.intervalMs);
  }

  // metodă publică pentru test
  async tickOnce(): Promise<void> {
    await this.tick();
  }

  async shutdown(): Promise<void> {
    console.log("[WORKER] Shutdown requested");
    this.shuttingDown = true;

    if (this.intervalId) {
      clearInterval(this.intervalId);
    }

    // așteaptă jobul curent
    while (this.isRunning) {
      await new Promise(r => setTimeout(r, 100));
    }

    console.log("[WORKER] Shutdown complete");
  }

  private async tick(): Promise<void> {
    if (this.isRunning) return;

    this.isRunning = true;

    try {
      const now = new Date();
      const job = await this.jobService.startNextJob(
        now,
        this.workerId
      );

      if (!job) return;

      try {
        await this.executor.execute(job);
        job.clearLease();
        await this.jobService.completeJob(job.id, new Date());
      } catch (err) {
        job.clearLease();
        await this.jobService.failJob(
          job.id,
          new Date(),
          (err as Error).message
        );
      }
    } finally {
      this.isRunning = false;
    }
  }
}
