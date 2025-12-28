import { z } from "zod";
import { Role } from "@prisma/client";

export const changeUserRoleSchema = z.object({
  role: z.enum(Role)
});
