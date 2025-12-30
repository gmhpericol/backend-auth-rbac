import { prisma } from "../config/prisma.js";

export const invoiceRepository = {
  async create(data: {
    subscriptionId: string
    periodStart: Date
    periodEnd: Date
    amountCents: number
    currency: string
    billingKey: string
  }) {
    return prisma.invoice.create({ data })
  },

  async findByBillingKey(billingKey: string) {
    return prisma.invoice.findUnique({
      where: { billingKey },
    })
  },
}
