/**
 * CC-04N mechanical guard (docs/architecture/MOBILE-ARCHITECTURE.md §1,
 * "Shared vs. native boundaries"): `packages/ui` is the web/DOM-specific
 * component package and must never be imported by the native app.
 *
 * Checks:
 *  1. apps/mobile/package.json does not declare @alp/ui as a dependency.
 *  2. No file under apps/mobile/src imports "@alp/ui" (or a relative path
 *     that resolves into packages/ui).
 *
 * Run via `npm run check:mobile-boundary` from the repository root.
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const repoRoot = join(import.meta.dirname, "..", "..");
const mobileDir = join(repoRoot, "apps", "mobile");
const mobileSrcDir = join(mobileDir, "src");

const FORBIDDEN_IMPORT_PATTERNS = [/@alp\/ui/, /packages\/ui/];

function listSourceFiles(dir: string): string[] {
  const entries = readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    if (entry.name === "node_modules" || entry.name.startsWith(".")) {
      continue;
    }
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...listSourceFiles(fullPath));
    } else if (/\.(ts|tsx|js|jsx)$/.test(entry.name)) {
      files.push(fullPath);
    }
  }

  return files;
}

function main(): void {
  const errors: string[] = [];

  const packageJsonPath = join(mobileDir, "package.json");
  const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8")) as {
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
  };

  if (packageJson.dependencies?.["@alp/ui"] || packageJson.devDependencies?.["@alp/ui"]) {
    errors.push(
      `apps/mobile/package.json declares a dependency on @alp/ui, which is web/DOM-specific ` +
        `(see docs/architecture/MOBILE-ARCHITECTURE.md §1).`,
    );
  }

  if (statSync(mobileSrcDir, { throwIfNoEntry: false })) {
    for (const file of listSourceFiles(mobileSrcDir)) {
      const content = readFileSync(file, "utf8");
      for (const pattern of FORBIDDEN_IMPORT_PATTERNS) {
        if (pattern.test(content)) {
          errors.push(
            `${relative(repoRoot, file)} matches forbidden pattern ${pattern} ` +
              `(apps/mobile must not import packages/ui).`,
          );
        }
      }
    }
  }

  if (errors.length > 0) {
    console.error("Mobile/web UI boundary check FAILED:\n");
    for (const error of errors) {
      console.error(`  - ${error}`);
    }
    process.exitCode = 1;
    return;
  }

  console.log("Mobile/web UI boundary check passed: apps/mobile does not depend on @alp/ui.");
}

main();
