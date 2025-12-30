import { Request, Response } from "express"
import { contractService } from "../services/contract/contract.service.js"
import {
  createContractSchema,
  terminateContractSchema,
} from "../validators/contract.schema.js"
import { AuthUser } from "../types/auth"

export const contractController = {
  async create(req: Request, res: Response) {
    const input = createContractSchema.parse(req.body)

    const contract = await contractService.createContract(
      req.user as AuthUser,
      input
    )

    res.status(201).json(contract)
  },

  async activate(req: Request, res: Response) {
    const { id } = req.params

    await contractService.activateContract(req.user as AuthUser, id)

    res.status(204).send()
  },

  async terminate(req: Request, res: Response) {
    const { id } = req.params
    const { reason } = terminateContractSchema.parse(req.body)

    await contractService.terminateContract(req.user as AuthUser, id, reason)

    res.status(204).send()
  },
}
