import { EmailService } from "../../services/email/EmailService.js";
import { Job } from "../domain/job/Job.js";

export class JobExecutor {
  constructor(private readonly emailService: EmailService) {}

  async execute(job: Job): Promise<void> {

    switch (job.getType()) {
      case "SEND_EMAIL":
        await this.handleSendEmail(job);
        return;

      case "SEND_WELCOME_EMAIL":
        await this.handleWelcomeEmail(job);
        return;

      default:
        throw new Error(`Unknown job type: ${job.getType()}`);
    }
  }

  private async handleSendEmail(job: Job): Promise<void> {
    const payload = job.getPayload() as { to: string };
    await this.emailService.sendEmail({
      to: payload.to,
      subject: "Test email",
      html: `<h1>Hello from scheduler</h1>`,

    });
  }

  private async handleWelcomeEmail(job: Job): Promise<void> {
    const payload = job.getPayload() as { to: string; name?: string };

    await this.emailService.sendEmail({
      to: payload.to,
      subject: "Welcome!",
      html: `<h1>Welcome ${payload.name ?? ""}!<h1>`,
    });
  }
}
