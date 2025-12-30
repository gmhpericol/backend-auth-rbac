import { Request, Response } from "express"
import { subscriptionService } from "../services/subscription/subscription.service.js"
import {
  createSubscriptionSchema,
  changePlanSchema,
} from "../validators/subscription.schema.js"
import { AuthUser } from "../types/auth"

export const subscriptionController = {
  async create(req: Request, res: Response) {
    const input = createSubscriptionSchema.parse(req.body)

    const subscription =
      await subscriptionService.createSubscription(
        req.user as AuthUser,
        input
      )

    res.status(201).json(subscription)
  },

  async pause(req: Request, res: Response) {
    const { id } = req.params

    await subscriptionService.pauseSubscription(req.user as AuthUser, id)

    res.status(204).send()
  },

  async resume(req: Request, res: Response) {
    const { id } = req.params

    await subscriptionService.resumeSubscription(req.user as AuthUser, id)

    res.status(204).send()
  },

  async changePlan(req: Request, res: Response) {
    const { id } = req.params
    const { planId } = changePlanSchema.parse(req.body)

    await subscriptionService.changePlan(req.user as AuthUser, id, planId)

    res.status(204).send()
  },
}
