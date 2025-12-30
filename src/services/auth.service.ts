import { userRepository } from "../repositories/user.repository.js";
import { passwordService } from "./password.service.js";
import { tokenService } from "./token.service.js";

export const authService = {
  async register(email: string, name: string, password: string) {
    const passwordHash = await passwordService.hash(password);

    const user = await userRepository.createWithPassword(
      email,
      name,
      passwordHash
    );

    return user;
  },

    async login(email: string, password: string) {
    const user = await userRepository.findByEmail(email);

    if (!user) {
        throw new Error("Invalid credentials");
    }

    const valid = await passwordService.verify(password, user.password);

    if (!valid) {
        throw new Error("Invalid credentials");
    }

    const token = tokenService.generate({
        userId: user.id,
        role: user.role
    });

    return { token };
    }

};
