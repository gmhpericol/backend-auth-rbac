import { prisma } from "../config/prisma.js";
import { Prisma, ContractStatus } from "@prisma/client"

export const contractRepository = {
  create(data: Prisma.ContractCreateInput) {
    return prisma.contract.create({ data })
  },

  findById(id: string) {
    return prisma.contract.findUnique({
      where: { id },
      include: {
        subscriptions: true,
      },
    })
  },

  update(id: string, data: Prisma.ContractUpdateInput) {
    return prisma.contract.update({
      where: { id },
      data,
    })
  },

  updateStatus(id: string, status: ContractStatus) {
    return prisma.contract.update({
      where: { id },
      data: { status },
    })
  },
}
