import { Role } from "../constants/role.js";
import { prisma } from "../config/prisma.js";

function mapUser(user: any) {
  return {
    ...user,
    role: user.role as Role,
  };
}

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
    const user = await prisma.user.findUnique({
      where: { id }
    });

    return user ? mapUser(user) : null;

  },

  async findByEmail(email: string) {
    const user = await prisma.user.findUnique({
      where: { email }
    });

    return user ? mapUser(user) : null;

  },

  async deleteById(id: string) {
    return prisma.user.delete({
      where: { id }
    });
  },

  async updateRoleById(id: string, role: Role) {
    const user = await prisma.user.update({
      where: { id },
      data: { role }
    });

    return mapUser(user);

  },


  async createWithPassword(
    email: string,
    name: string,
    password: string
  ) {
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password
      }
    });

    return mapUser(user);

  }
};
