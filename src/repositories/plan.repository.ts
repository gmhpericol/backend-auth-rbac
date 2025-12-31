import { prisma } from "../config/prisma.js";
import { Prisma } from "@prisma/client";

export const planRepository = {
  create(data: Prisma.PlanCreateInput) {
    return prisma.plan.create({ data });
  },

  findActive() {
    return prisma.plan.findMany({
      where: { isActive: true }
    });
  },

  findActiveById(id: string) {
    return prisma.plan.findFirst({
      where: { id, isActive: true }
    });
  }
};
