import { EmailService } from "../../services/email/EmailService.js";
import { Job } from "../domain/job/Job.js";

export class JobExecutor {
  constructor(private readonly emailService: EmailService) {}

  async execute(job: Job): Promise<void> {
    switch (job.getType()) {
      case "SEND_EMAIL": {
        const payload = job.getPayload() as {
          to: string;
          name?: string;
        };

        await this.emailService.sendEmail({
          to: payload.to,
          subject: "Welcome to Learning Project",
          html: `<h1>Welcome ${payload.name ?? ""}</h1>`,
        });

        return;
      }

      default:
        throw new Error(`Unknown job type: ${job.getType()}`);
    }
  }
}
