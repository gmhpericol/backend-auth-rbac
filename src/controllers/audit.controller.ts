import { Request, Response, NextFunction } from "express";
import { auditService } from "../services/audit.service.js";

export async function getAuditLogs(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const page = req.query.page ? Number(req.query.page) : 1;
    const limit = req.query.limit ? Number(req.query.limit) : 50;

    const logs = await auditService.getAuditLogs({ page, limit });

    res.json(logs);
  } catch (err) {
    next(err);
  }
}
