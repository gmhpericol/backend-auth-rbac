import { Resend } from "resend";
import { EmailService } from "./EmailService.js";

export class ResendEmailService implements EmailService {
  private resend: Resend;
  private from: string;

  constructor() {
    if (!process.env.RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not configured");
    }

    this.resend = new Resend(process.env.RESEND_API_KEY);
    this.from = process.env.EMAIL_FROM ?? "onboarding@resend.dev";
  }

  async sendEmail(input: {
    to: string;
    subject: string;
    html: string;
  }): Promise<void> {
    await this.resend.emails.send({
      from: this.from,
      to: input.to,
      subject: input.subject,
      html: input.html,
    });
  }
}
