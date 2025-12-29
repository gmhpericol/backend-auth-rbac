import { Request, Response, NextFunction } from "express";
import { userService } from "../services/user.service.js";
import { changeUserRoleSchema } from "../validators/user.validator.js";

export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (err) {
    next(err);
  }
};

export const updateUserRole = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { role } = changeUserRoleSchema.parse(req.body);

    const updatedUser = await userService.changeUserRole(
      (req.user as any).id,
      req.params.id,
      role
    );

    res.json(updatedUser);
  } catch (err) {
    next(err);
  }
};

export async function deactivateUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const targetUserId = req.params.id;
    const actorUserId = (req.user as any).id; // din middleware auth

    const user = await userService.deactivateUser(
      actorUserId,
      targetUserId
    );

    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
}
