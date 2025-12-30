import { BillingCycle } from "@prisma/client"

export function addBillingCycle(
  date: Date,
  cycle: BillingCycle
): Date {
  const d = new Date(date)
  if (cycle === "MONTHLY") d.setMonth(d.getMonth() + 1)
  if (cycle === "YEARLY") d.setFullYear(d.getFullYear() + 1)
  return d
}

export function generateBillingKey(
  subscriptionId: string,
  periodStart: Date
): string {
  return `${subscriptionId}_${periodStart.toISOString()}`
}

export function getBillingPeriodStartForNow(
  now: Date,
  billingCycle: BillingCycle
): Date {
  const date = new Date(now)

  if (billingCycle === "MONTHLY") {
    date.setUTCDate(1)
    date.setUTCHours(0, 0, 0, 0)
  }

  if (billingCycle === "YEARLY") {
    date.setUTCMonth(0, 1)
    date.setUTCHours(0, 0, 0, 0)
  }

  return date
}
