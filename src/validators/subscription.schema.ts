import { z } from "zod"

export const createSubscriptionSchema = z.object({
  contractId: z.string().uuid(),
  planId: z.string().uuid(),
})

export const changePlanSchema = z.object({
  planId: z.string().uuid(),
})
