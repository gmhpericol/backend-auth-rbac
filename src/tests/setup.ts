import dotenv from "dotenv"
dotenv.config({ path: ".env.test" })

import { beforeAll, beforeEach, afterAll } from "vitest"
import { prisma, resetDatabase } from "../config/prisma.testing.js"

beforeAll(async () => {
  await resetDatabase()
})

beforeEach(async () => {
  await resetDatabase()
})

afterAll(async () => {
  await resetDatabase()
  await prisma.$disconnect()
})
