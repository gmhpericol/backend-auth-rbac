import { describe, it, expect } from "vitest"
import { contractService } from "../services/contract/contract.service.js"
import { prisma } from "../config/prisma.js"
import { Role } from "@prisma/client"

const actor = { userId: "admin-id", role: Role.ADMIN }

describe("ContractService", () => {
  it("should not activate contract without subscriptions", async () => {
    const user = await prisma.user.create({
        data: {
        email: `test-${Date.now()}@test.com`,
        name: "Test",
        password: "x",
      },
    })


    const contract = await contractService.createContract(actor, {
      customerId: user.id,
    })

    await expect(
      contractService.activateContract(actor, contract.id)
    ).rejects.toThrow("Cannot activate contract without subscriptions")
  })
})
