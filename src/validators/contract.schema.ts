import { z } from "zod"
import { TerminationReason } from "@prisma/client"

export const createContractSchema = z.object({
  customerId: z.string().uuid(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
})

export const terminateContractSchema = z.object({
  reason: z.nativeEnum(TerminationReason),
})

