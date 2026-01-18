
import "dotenv/config";
import { Resend } from "resend";
import { ResendEmailService } from "./services/email/ResendEmailService.js";
import { startScheduler } from "./scheduler/index.js";
import { jobService } from "./scheduler/index.js";

async function main() {
  console.log("Starting scheduler...");
  startScheduler();

  console.log("Creating test job...");

  
  await jobService.createJob({
    jobKey: "delayed:welcome-email",
    type: "SEND_EMAIL",
    payload: { to: "gmhpericol@gmail.com" },
    maxAttempts: 3,
    runAt: new Date(Date.now() + 60_000), // 1 minut
  });

  console.log("Job created.");
}

main();
