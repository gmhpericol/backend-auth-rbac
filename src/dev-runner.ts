
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
    jobKey: "manual:crash-test5",
    type: "SEND_EMAIL",
    payload: { to: "gmhpericol@gmail.com" },
    maxAttempts: 3,
  });


  console.log("Job created.");
}

main();
