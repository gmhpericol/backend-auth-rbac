import nodemailer from "nodemailer";
import { EmailService, SendEmailInput } from "./EmailService";

export class NodemailerEmailService implements EmailService {
  private transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  async sendEmail(input: SendEmailInput): Promise<void> {
    await this.transporter.sendMail({
      from: `"Learning Project" <${process.env.SMTP_FROM}>`,
      to: input.to,
      subject: input.subject,
      html: input.html,
    });
  }
}
