import { Request, Response, NextFunction } from "express";
import { Role } from "../constants/role.js";

export const requireRole =
  (...allowedRoles: Role[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!allowedRoles.includes(user.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    next();
  };
