import { describe, it, expect } from "vitest"
import { subscriptionService } from "../services/subscription/subscription.service.js"
import { prisma } from "../config/prisma.js"

describe("Billing", () => {
  it("should bill subscription only once per period", async () => {
    const plan = await prisma.plan.create({
      data: {
        name: `Basic-${crypto.randomUUID()}`,
        priceCents: 1000,
        currency: "EUR",
        billingCycle: "MONTHLY",
        features: {},
      },
    })

    const user = await prisma.user.create({
      data: {
        email: `test-${Date.now()}@test.com`,
        name: "Test",
        password: "x",
      },
    })


    const contract = await prisma.contract.create({
      data: {
        customerId: user.id,
        createdBy: "admin",
        status: "ACTIVE",
        signedAt: new Date(),
        startDate: new Date(),
      },
    })

    const sub = await prisma.subscription.create({
      data: {
        billingCycle: "MONTHLY",
        startDate: new Date("2024-01-01"),
        nextBillingAt: new Date("2024-01-01"),
        contract: { connect: { id: contract.id } },
        plan: { connect: { id: plan.id } },
      },
    })

    const now = new Date("2024-01-02")

    await subscriptionService.billDueSubscriptions(now)
    await subscriptionService.billDueSubscriptions(now)

    const invoices = await prisma.invoice.findMany()
    expect(invoices.length).toBe(1)
  })
})
