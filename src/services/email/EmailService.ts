
export interface EmailService {
  sendEmail(input: {
    to: string;
    subject: string;
    html: string;
  }): Promise<void>;
}
