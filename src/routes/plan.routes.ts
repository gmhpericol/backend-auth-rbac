import { Router } from "express";
import { planController } from "../controllers/plan.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/", authMiddleware, planController.create);
router.get("/", authMiddleware, planController.list);

export default router;
