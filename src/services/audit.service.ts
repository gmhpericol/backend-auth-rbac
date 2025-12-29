import { auditRepository } from "../repositories/audit.repository.js";

export const auditService = {
  async getAuditLogs(options?: { page?: number; limit?: number }) {
    const page = options?.page ?? 1;
    const limit = options?.limit ?? 50;

    return auditRepository.findAll({
      take: limit,
      skip: (page - 1) * limit,
    });
  },
};
