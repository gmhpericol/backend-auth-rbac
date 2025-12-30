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
