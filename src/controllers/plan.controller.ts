import { Request, Response } from "express";
import { planService } from "../services/plan.service.js";

export const planController = {
  async create(req: Request, res: Response) {
    const plan = await planService.create(req.user!, req.body);
    res.status(201).json(plan);
  },

  async list(req: Request, res: Response) {
    const plans = await planService.listActive();
    res.json(plans);
  }
};
