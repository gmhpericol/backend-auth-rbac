import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/requireRole.middleware.js";
import { protectManager } from "../middlewares/protectManager.middleware.js";
import { getUsers, updateUserRole } from "../controllers/user.controller.js";
import { Role } from "../constants/role.js";
import { deactivateUser } from "../controllers/user.controller.js";
import { reactivateUser } from "../controllers/user.controller.js";

const router = Router();

router.get(
  "/",
  authMiddleware,
  requireRole(
    Role.USER,
    Role.ADMIN,
    Role.MANAGER
  ),
  getUsers
);

router.patch(
  "/:id/role",
  authMiddleware,
  requireRole(
    Role.ADMIN,
    Role.MANAGER
  ),
  protectManager,
  updateUserRole
);

router.delete(
  "/:id",
  authMiddleware,
  requireRole(Role.ADMIN, Role.MANAGER),
  protectManager,
  deactivateUser
);

router.patch(
  "/:id/reactivate",
  authMiddleware,
  requireRole(Role.ADMIN, Role.MANAGER),
  protectManager,
  reactivateUser
);

export default router;




