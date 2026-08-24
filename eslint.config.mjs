import js from "@eslint/js";
import tseslint from "typescript-eslint";
import globals from "globals";

export default tseslint.config(
  {
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/.next/**",
      "**/out/**",
      "**/coverage/**",
      "**/playwright-report/**",
      "**/test-results/**",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
  {
    // CC-11.5: the ALP Visual Production Studio's client-side page is
    // plain, unbundled browser JavaScript served directly by
    // tools/visual-production-studio/server.ts -- it runs in a browser,
    // not Node, and is not part of any TypeScript project (no tsconfig
    // includes it), so it needs its own globals rather than the
    // repo-wide Node set above.
    files: ["tools/visual-production-studio/public/**/*.js"],
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
  },
  {
    // CC-11.8: same reasoning as tools/visual-production-studio's public
    // client-side page above -- tools/project-dashboard's page also runs
    // in a browser, not Node.
    files: ["tools/project-dashboard/public/**/*.js"],
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
  },
);
