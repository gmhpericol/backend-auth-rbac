import { Router } from "express"
import { subscriptionController } from "../controllers/subscription.controller"
import { authMiddleware } from "../middlewares/auth.middleware"

const router = Router()

router.post("/", authMiddleware, subscriptionController.create)
router.post("/:id/pause", authMiddleware, subscriptionController.pause)
router.post("/:id/resume", authMiddleware, subscriptionController.resume)
router.post("/:id/change-plan", authMiddleware, subscriptionController.changePlan)

export default router
