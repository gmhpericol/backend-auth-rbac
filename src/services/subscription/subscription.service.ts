import { AuthUser } from "../../types/auth"
import { CreateSubscriptionInput } from "../../types/subscription"
import { subscriptionRepository } from "../../repositories/subscription.repository.js"
import { planRepository } from "../../repositories/plan.repository.js"
import { contractRepository } from "../../repositories/contract.repository.js"
import { invoiceRepository } from "../../repositories/invoice.repository.js"
import { addBillingCycle, generateBillingKey } from "./helpers.js"
import { Prisma } from "@prisma/client"

export const subscriptionService = {
  async createSubscription(actor: AuthUser, input: CreateSubscriptionInput) {
    if (!["ADMIN", "MANAGER"].includes(actor.role)) {
      throw new Error("Forbidden")
    }

    const contract = await contractRepository.findById(input.contractId)
    if (!contract) throw new Error("Contract not found")
    if (contract.status !== "ACTIVE") {
      throw new Error("Contract not active")
    }

    const plan = await planRepository.findActiveById(input.planId)
    if (!plan) throw new Error("Invalid plan")

    const startDate = new Date()
    const nextBillingAt = addBillingCycle(startDate, plan.billingCycle)

    return subscriptionRepository.create({
        status: "ACTIVE",
        billingCycle: plan.billingCycle,
        startDate,
        nextBillingAt,

        contract: {
            connect: { id: contract.id },
        },

        plan: {
            connect: { id: plan.id },
        },
        })

  },

  async pauseSubscription(actor: AuthUser, subscriptionId: string) {
    if (!["ADMIN", "MANAGER"].includes(actor.role)) {
      throw new Error("Forbidden")
    }

    const sub = await subscriptionRepository.findById(subscriptionId)
    if (!sub) throw new Error("Subscription not found")
    if (sub.status !== "ACTIVE") {
      throw new Error("Only ACTIVE subscriptions can be paused")
    }

    await subscriptionRepository.updateStatus(sub.id, "PAUSED")
  },

  async resumeSubscription(actor: AuthUser, subscriptionId: string) {
    if (!["ADMIN", "MANAGER"].includes(actor.role)) {
      throw new Error("Forbidden")
    }

    const sub = await subscriptionRepository.findById(subscriptionId)
    if (!sub) throw new Error("Subscription not found")
    if (sub.contract.status !== "ACTIVE") {
      throw new Error("Contract not active")
    }
    if (sub.status !== "PAUSED") {
      throw new Error("Only PAUSED subscriptions can be resumed")
    }

    const nextBillingAt = addBillingCycle(new Date(), sub.billingCycle)

    await subscriptionRepository.update(sub.id, {
      status: "ACTIVE",
      nextBillingAt,
    })
  },

  async changePlan(
    actor: AuthUser,
    subscriptionId: string,
    newPlanId: string
  ) {
    if (!["ADMIN", "MANAGER"].includes(actor.role)) {
      throw new Error("Forbidden")
    }

    const sub = await subscriptionRepository.findById(subscriptionId)
    if (!sub) throw new Error("Subscription not found")
    if (sub.status !== "ACTIVE") {
      throw new Error("Only ACTIVE subscriptions can change plan")
    }

    const newPlan = await planRepository.findActiveById(newPlanId)
    if (!newPlan) throw new Error("Invalid plan")

    const nextBillingAt = addBillingCycle(new Date(), newPlan.billingCycle)

    await subscriptionRepository.update(sub.id, {
        billingCycle: newPlan.billingCycle,
        nextBillingAt,

        plan: {
            connect: { id: newPlan.id },
        },
        })

  },

  async billDueSubscriptions(now: Date) {
    const subs = await subscriptionRepository.findDueForBilling(now)

    for (const sub of subs) {
        if (sub.contract.status !== "ACTIVE") {
            continue
        }
      const periodStart = sub.lastBilledAt ?? sub.startDate
      const periodEnd = addBillingCycle(periodStart, sub.billingCycle)
      const billingKey = generateBillingKey(sub.id, periodStart)

      try {
        await invoiceRepository.create({
          subscriptionId: sub.id,
          periodStart,
          periodEnd,
          amountCents: sub.plan.priceCents,
          currency: sub.plan.currency,
          billingKey,
        })
      } catch (e) {
        if (
          e instanceof Prisma.PrismaClientKnownRequestError &&
          e.code === "P2002"
        ) {
          continue
        }
        throw e
      }

      await subscriptionRepository.update(sub.id, {
        lastBilledAt: periodEnd,
        nextBillingAt: periodEnd,
      })
    }
  },
}
