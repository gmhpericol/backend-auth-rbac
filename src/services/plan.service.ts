import { AuthUser } from "../types/auth.js";
import { planRepository } from "../repositories/plan.repository.js";

export const planService = {
  async create(actor: AuthUser, data: any) {
    if (actor.role !== "MANAGER") {
      throw new Error("Forbidden");
    }

    return planRepository.create({
      name: data.name,
      description: data.description,
      priceCents: data.priceCents,
      currency: data.currency ?? "EUR",
      billingCycle: data.billingCycle,
      features: data.features ?? {},
    });
  },

  async listActive() {
    return planRepository.findActive();
  }
};
