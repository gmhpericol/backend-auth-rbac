import { JobService } from "../application/services/JobService.js";
import { JobExecutor } from "./JobExecutor.js";
import { randomUUID } from "crypto";

export class Worker {
  private readonly workerId = randomUUID();
  private isRunning = false;

  constructor(
    private readonly jobService: JobService,
    private readonly executor: JobExecutor,
    private readonly intervalMs = 2_000
  ) {}

  start(): void {
    console.log("[WORKER] Started", this.workerId);
    setInterval(() => this.tick(), this.intervalMs);
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

