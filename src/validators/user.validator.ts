import { z } from "zod";
import { Role } from "../constants/role.js";

export const changeUserRoleSchema = z.object({
  role: z.enum(Role)
});
