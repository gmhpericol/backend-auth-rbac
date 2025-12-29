import { Role } from "../constants/role.js";
import { userRepository } from "../repositories/user.repository.js";
import { auditRepository } from "../repositories/audit.repository.js";

export const userService = {
  async getAllUsers() {
    return userRepository.findAll();
  },

  async deleteById(id: string) {
    return userRepository.deleteById(id);
  },

  async changeUserRole(
    actorUserId: string,
    targetUserId: string,
    newRole: Role
  ) {
    const targetUser = await userRepository.findById(targetUserId);

    if (!targetUser) {
      throw new Error("User not found");
    }

    const oldRole = targetUser.role;

    // dacă rolul e același, nu facem nimic (opțional, dar corect)
    if (oldRole === newRole) {
      return targetUser;
    }

    const updatedUser = await userRepository.updateRoleById(
      targetUserId,
      newRole
    );

    await auditRepository.log({
      actorUserId,
      targetUserId,
      action: "CHANGE_ROLE",
      oldValue: oldRole,
      newValue: newRole,
    });

    return updatedUser;
  },

  async deactivateUser(
    actorUserId: string,
    targetUserId: string
  ) {
    const targetUser = await userRepository.findById(targetUserId);

    if (!targetUser) {
      throw new Error("User not found");
    }
    if (!targetUser.active) {
      return targetUser;
    }
    const updatedUser = await userRepository.deactivateById(
      targetUserId
    );
    await auditRepository.log({
      actorUserId,
      targetUserId,
      action: "DEACTIVATE_USER",
      oldValue: "active",
      newValue: "inactive",
    });

    return updatedUser;
  } 
}
