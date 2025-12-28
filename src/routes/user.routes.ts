import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/requireRole.middleware.js";
import { protectManager } from "../middlewares/protectManager.middleware.js";
import { deleteUser, getUsers, updateUserRole } from "../controllers/user.controller.js";
import { Prisma, Role } from "@prisma/client";

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

router.delete(
  "/:id",
  authMiddleware,
  requireRole(Role.ADMIN, Role.MANAGER),
  protectManager,
  deleteUser
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


export default router;




