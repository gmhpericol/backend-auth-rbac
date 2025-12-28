import { Role } from "@prisma/client";
import { userRepository } from "../repositories/user.repository.js";

export const userService = {
  async getAllUsers() {
    return userRepository.findAll();
  },

  async deleteById(id: string) {
    return userRepository.deleteById(id);
  },

  async changeUserRole(
    targetUserId: string,
    newRole: Role
  ) {
    return userRepository.updateRoleById(targetUserId, newRole);
  }

};
