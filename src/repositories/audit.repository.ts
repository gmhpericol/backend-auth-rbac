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
};
