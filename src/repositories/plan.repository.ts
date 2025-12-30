import { prisma } from "../config/prisma.js";

export const planRepository = {
  findActiveById(id: string) {
    return prisma.plan.findFirst({
      where: {
        id,
        isActive: true,
      },
    })
  },
}
