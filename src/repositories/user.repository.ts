import { Role } from "../constants/role.js";
import { prisma } from "../config/prisma.js";

export const userRepository = {
  async findAll() {
    return prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        active: true
      }
    });
  },
  
  async findById(id: string) {
    return prisma.user.findUnique({
      where: { id }
    });
  },

  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email }
    });
  },

  async deleteById(id: string) {
    return prisma.user.delete({
      where: { id }
    });
  },

  async updateRoleById(id: string, role: Role) {
    return prisma.user.update({
      where: { id },
      data: { role }
    });
  },


  async createWithPassword(
    email: string,
    name: string,
    password: string
  ) {
    return prisma.user.create({
      data: {
        email,
        name,
        password
      }
    });
  }
};
