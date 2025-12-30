import { ContractStatus, TerminationReason } from "@prisma/client"
import { AuthUser } from "../../types/auth"
import { CreateContractInput } from "../../types/contract"
import { contractRepository } from "../../repositories/contract.repository.js"
import { auditService } from "../audit.service.js"
import { prisma } from "../../config/prisma.js"

function assertManagerOrAdmin(actor: AuthUser) {
  if (!["ADMIN", "MANAGER"].includes(actor.role)) {
    throw new Error("Forbidden")
  }
}

export const contractService = {
  // -----------------------------
  // CREATE
  // -----------------------------
  async createContract(actor: AuthUser, input: CreateContractInput) {
    assertManagerOrAdmin(actor)

    const contract = await contractRepository.create({
      status: "DRAFT",
      startDate: input.startDate,
      endDate: input.endDate,
      signedAt: null,

      customerId: input.customerId,
      createdBy: actor.userId,
    })

    await auditService.log({
      actorUserId: actor.userId,
      targetUserId: input.customerId,
      action: "CONTRACT_CREATED",
      newValue: contract.id,
    })

    return contract
  },

  // -----------------------------
  // ACTIVATE
  // -----------------------------
  async activateContract(actor: AuthUser, contractId: string) {
    assertManagerOrAdmin(actor)

    const contract = await contractRepository.findById(contractId)
    if (!contract) throw new Error("Contract not found")

    if (contract.status !== "DRAFT") {
      throw new Error("Only DRAFT contracts can be activated")
    }

    if (contract.subscriptions.length === 0) {
      throw new Error("Cannot activate contract without subscriptions")
    }

    await contractRepository.update(contract.id, {
      status: "ACTIVE",
      signedAt: new Date(),
      startDate: contract.startDate ?? new Date(),
    })

    await auditService.log({
      actorUserId: actor.userId,
      targetUserId: contract.customerId,
      action: "CONTRACT_ACTIVATED",
      oldValue: "DRAFT",
      newValue: "ACTIVE",
    })
  },

  // -----------------------------
  // TERMINATE
  // -----------------------------
  async terminateContract(
    actor: AuthUser,
    contractId: string,
    reason: TerminationReason
  ) {
    assertManagerOrAdmin(actor)

    const contract = await contractRepository.findById(contractId)
    if (!contract) throw new Error("Contract not found")

    if (
      contract.status !== "ACTIVE" &&
      contract.status !== "SUSPENDED"
    ) {
      throw new Error("Only ACTIVE or SUSPENDED contracts can be terminated")
    }

    await contractRepository.update(contract.id, {
      status: "TERMINATED",
      terminatedAt: new Date(),
      terminationReason: reason,
    })

    await auditService.log({
      actorUserId: actor.userId,
      targetUserId: contract.customerId,
      action: "CONTRACT_TERMINATED",
      oldValue: contract.status,
      newValue: "TERMINATED",
    })
  },

  // -----------------------------
  // AUTO EXPIRE (cron / worker)
  // -----------------------------
  async expireContracts(now: Date) {
    const expired = await prisma.contract.findMany({
      where: {
        status: "ACTIVE",
        endDate: { lte: now },
      },
    })

    for (const contract of expired) {
      await contractRepository.update(contract.id, {
        status: "EXPIRED",
      })

      await auditService.log({
        actorUserId: "SYSTEM",
        targetUserId: contract.customerId,
        action: "CONTRACT_EXPIRED",
        oldValue: "ACTIVE",
        newValue: "EXPIRED",
      })
    }
  },
}
