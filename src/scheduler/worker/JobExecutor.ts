import { Job } from "../domain/job/Job";

export class JobExecutor {
  async execute(job: Job): Promise<void> {
    switch (job.getType()) {
      case "SEND_EMAIL":
        console.log(
          `[EXECUTOR] Sending email for job ${job.id}`,
          job.payload 
        );
        await this.fakeWork(500);
        return;

      case "GENERATE_REPORT":
        await this.fakeWork(1_000);
        return;

      case "SYNC_EXTERNAL_DATA":
        await this.fakeWork(800);
        throw new Error("External API failed");

      default:
        throw new Error(`Unknown job type: ${job.getType()}`);
    }
  }

  private async fakeWork(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
