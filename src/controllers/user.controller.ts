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

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await userService.deleteById(req.params.id);
    res.status(204).send();
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
      req.params.id,
      role
    );

    res.json(updatedUser);
  } catch (err) {
    next(err);
  }
};
