import dotenv from "dotenv"
dotenv.config({ path: ".env.test" })

import { PrismaClient } from "@prisma/client"

export const prisma = new PrismaClient()

export async function resetDatabase() {
  await prisma.$executeRawUnsafe(`
    TRUNCATE TABLE
      "Invoice",
      "Subscription",
      "Contract",
      "Plan",
      "User",
      "AuditLog"
    RESTART IDENTITY
    CASCADE;
  `)
}
