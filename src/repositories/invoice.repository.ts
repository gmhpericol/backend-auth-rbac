import { prisma } from "../config/prisma.js";

export const invoiceRepository = {
  create(data: Parameters<typeof prisma.invoice.create>[0]['data']) {
    return prisma.invoice.create({ data })
  },
}
