import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    include: [
      "packages/**/src/**/*.test.{ts,tsx}",
      "apps/**/*.test.{ts,tsx}",
      "scripts/**/*.test.{ts,tsx}",
      "tools/**/*.test.{ts,tsx}",
    ],
    // apps/mobile uses Jest (jest-expo), not Vitest -- see
    // docs/architecture/MOBILE-ARCHITECTURE.md §8 tier distinction. Its
    // *.test.ts(x) files use Jest-only globals/RN Flow syntax that Vitest
    // cannot parse; excluded explicitly rather than narrowing the "apps/**"
    // include pattern, so future apps are picked up by default.
    exclude: ["**/node_modules/**", "**/dist/**", "**/.next/**", "apps/mobile/**"],
    setupFiles: ["./vitest.setup.ts"],
    css: false,
  },
});
