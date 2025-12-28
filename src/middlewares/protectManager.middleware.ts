import { Request, Response, NextFunction } from "express";
import { userRepository } from "../repositories/user.repository.js";
import { Role } from "@prisma/client";

export const protectManager = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const requester = req.user;
  const targetUserId = req.params.id;
  
  if (!requester) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const targetUser = await userRepository.findById(targetUserId);

  if (!targetUser) {
    return res.status(404).json({ message: "User not found" });
  }

  if (
    targetUser.role === Role.MANAGER &&
    requester.role !== Role.MANAGER
  ) {
    return res.status(403).json({
      message: "Only MANAGER can modify or delete another MANAGER"
    });
  }

  next();
};
