import { subscriptionService } from "../services/subscription/subscription.service"

let lastRun: number | null = null
const MIN_INTERVAL_MS = 5 * 60 * 1000 // 5 minute

export async function billingTriggerMiddleware(
  _req: any,
  _res: any,
  next: any
) {
  const now = Date.now()

  if (!lastRun || now - lastRun > MIN_INTERVAL_MS) {
    lastRun = now

    // fire-and-forget
    subscriptionService
      .billDueSubscriptions(new Date())
      .catch(err =>
        console.error("[BillingTrigger]", err)
      )
  }

  next()
}
