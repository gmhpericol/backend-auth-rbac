import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";

export const errorMiddleware = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // 1️⃣ Zod validation errors
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: "Validation error",
      details: err.issues
    });
  }

  // 2️⃣ Prisma unique constraint
  if (
    err instanceof Prisma.PrismaClientKnownRequestError &&
    err.code === "P2002"
  ) {
    return res.status(409).json({
      error: "Conflict",
      message: "Resource already exists"
    });
  }

  // 3️⃣ Auth errors (invalid credentials)
  if (err instanceof Error && err.message === "Invalid credentials") {
    return res.status(401).json({
      error: "Unauthorized",
      message: err.message
    });
  }

  // 4️⃣ Fallback
  console.error(err);

  return res.status(500).json({
    error: "Internal Server Error"
  });
};
