import { Request, Response, NextFunction } from "express";
import { authService } from "../services/auth.service.js";
import { registerSchema, loginSchema } from "../dto/auth.dto.js";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = registerSchema.parse(req.body);

    const user = await authService.register(
      data.email,
      data.name,
      data.password
    );

    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = loginSchema.parse(req.body);

    const result = await authService.login(
      data.email,
      data.password
    );

    res.json(result);
  } catch (err) {
    next(err);
  }
};
