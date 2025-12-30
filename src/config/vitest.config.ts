import { defineConfig } from "vitest/config.js";

export default defineConfig({
  test: {
    environment: "node",
    include: ["src/tests/**/*.test.ts"],
    exclude: ["dist/**", "node_modules/**"],
    //globals: true,
    setupFiles: ["./tests/setup.ts"],
  },
})
