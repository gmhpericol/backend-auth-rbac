import { subscriptionService } from "../services/subscription/subscription.service.js";
import { prisma } from "../config/prisma.js";

async function runBilling() {
  const now = new Date()


  try {
    await subscriptionService.billDueSubscriptions(now)
    console.log("[BillingJob] Completed successfully")
  } catch (err) {
    console.error("[BillingJob] Failed", err)
    process.exitCode = 1
  } finally {
    await prisma.$disconnect()
  }
}

runBilling()
