
import "dotenv/config";
import { Resend } from "resend";
import { ResendEmailService } from "./services/email/ResendEmailService.js";
// async function main() {
//   console.log("Starting scheduler...");
//   startScheduler();

//   console.log("Creating test job...");

//   await jobService.createJob({
//     jobKey: "dev:test-job-" + uuid(),
//     type: "SEND_WELCOME_EMAIL",
//     payload: { to: "gmhpericol@gmail.com" },
//     maxAttempts: 3,
//   });

//   console.log("Job created.");
// }

// main();



const emailService = new ResendEmailService();

await emailService.sendEmail({
  to: "gmhpericol@gmail.com",
  subject: "EMAIL_FROM test",
  html: "<p>Dacă vezi asta, configul e OK.</p>",
});
