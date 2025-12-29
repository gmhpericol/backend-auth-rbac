import { Router } from "express";
import { getAuditLogs } from "../controllers/audit.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/requireRole.middleware.js";
import { Role } from "../constants/role.js";

const router = Router();

router.get(
    "/",
    authMiddleware,
    requireRole(Role.ADMIN, Role.MANAGER),
    getAuditLogs
);

export default router;