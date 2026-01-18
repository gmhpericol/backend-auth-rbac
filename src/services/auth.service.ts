import { userRepository } from "../repositories/user.repository.js";
import { jobService } from "../scheduler/index.js";
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

    await jobService.createJob({
      jobKey: `send-welcome-email-to-${user.id}`,
      type: "SEND_WELCOME_EMAIL",
      payload: { 
        to: user.email, 
        name: user.name ,
        subject: "Welcome!",
        html: `<h1>Welcome ${user.name}!<h1>`,
      },
      maxAttempts: 3,
    });

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
