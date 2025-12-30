import { Router } from "express"
import { contractController } from "../controllers/contract.controller.js"
import { authMiddleware } from "../middlewares/auth.middleware.js"

const router = Router()

router.post("/", authMiddleware, contractController.create)
router.post("/:id/activate", authMiddleware, contractController.activate)
router.post("/:id/terminate", authMiddleware, contractController.terminate)

export default router
