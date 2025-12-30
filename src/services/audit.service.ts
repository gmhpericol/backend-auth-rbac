import { auditRepository } from "../repositories/audit.repository.js";
import { prisma } from "../config/prisma.js";

export const auditService = {
  async log(input: {
    actorUserId: string;
    targetUserId: string;
    action: string;
    oldValue?: string;
    newValue?: string;
  }) {
    await prisma.auditLog.create({
      data: input,
    });
  },

  async getAuditLogs(options?: { page?: number; limit?: number }) {
    const page = options?.page ?? 1;
    const limit = options?.limit ?? 50;

    return auditRepository.findAll({
      take: limit,
      skip: (page - 1) * limit,
    });
  },
};
