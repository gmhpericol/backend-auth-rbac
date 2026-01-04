import { prisma } from "../config/prisma.js";
import { SubscriptionStatus, Prisma } from "@prisma/client"

export const subscriptionRepository = {
  create(data: Prisma.SubscriptionCreateInput) {
    return prisma.subscription.create({ data })
  },

  update(
    id: string,
    data: Prisma.SubscriptionUpdateInput
  ) {
    return prisma.subscription.update({
      where: { id },
      data,
    })
  },

  updateStatus(
    id: string,
    status: SubscriptionStatus
  ) {
    return prisma.subscription.update({
      where: { id },
      data: { status },
    })
  },

  findById(id: string) {
    return prisma.subscription.findUnique({
      where: { id },
      include: {
        contract: true,
        plan: true,
      },
    })
  },

  async findDueForBilling(now: Date) {
    return prisma.subscription.findMany({
        where: {
        status: "ACTIVE",
        nextBillingAt: { lte: now },
        contract: {
            status: "ACTIVE",
        },
        },
        include: {
        plan: true,
        contract: true,
        },
    })
  },

  async findAll() {
    return prisma.subscription.findMany({
      orderBy: { createdAt: "desc" },
    });
  },


}

