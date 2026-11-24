import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    globals: true,
    coverage: {
      provider: "v8",
      // Whole-point floors from the production app and library baseline.
      thresholds: { statements: 92, branches: 87, functions: 88, lines: 92 },
      include: ["app/**/*.{ts,tsx}", "lib/**/*.ts"],
      exclude: ["**/*.test.{ts,tsx}"],
      reporter: ["text", "json-summary", "html"],
    },
    exclude: ["**/node_modules/**", "**/.claude/**"],
  },
});
