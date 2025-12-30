import { BillingCycle } from "@prisma/client"


export interface CreateSubscriptionInput {
  contractId: string
  planId: string
}

export interface SubscriptionBillingContext {
  id: string
  billingCycle: BillingCycle
  startDate: Date
  lastBilledAt: Date | null
  nextBillingAt: Date
  plan: {
    priceCents: number
    currency: string
  }
  contract: {
    customerId: string
  }
}

