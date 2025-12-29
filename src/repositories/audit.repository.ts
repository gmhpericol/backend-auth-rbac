import { prisma } from "../config/prisma.js";

export const auditRepository = {
  async log(params: {
    actorUserId: string;
    targetUserId: string;
    action: string;
    oldValue?: string;
    newValue?: string;
  }) {
    return prisma.auditLog.create({
      data: params,
    });
  },

  async findAll(params?: { take?: number; skip?: number }) {
    return prisma.auditLog.findMany({
        orderBy: { createdAt: "desc" },
        take: params?.take ?? 50,
        skip: params?.skip ?? 0,
    });
  }

};
