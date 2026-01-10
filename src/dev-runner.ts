import { uuid } from "zod";
import { startScheduler } from "./scheduler/index";
import { jobService } from "./scheduler/index"; 
import "dotenv/config";

async function main() {
  console.log("Starting scheduler...");
  startScheduler();

  console.log("Creating test job...");

  await jobService.createJob({
    jobKey: "dev:test-job-" + uuid(),
    type: "SEND_WELCOME_EMAIL",
    payload: { to: "gmhpericol@gmail.com" },
    maxAttempts: 3,
  });

  console.log("Job created.");
}

main();
