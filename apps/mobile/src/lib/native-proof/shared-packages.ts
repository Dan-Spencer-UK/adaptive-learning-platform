/**
 * Proves that the repository's framework-independent shared TypeScript
 * packages actually resolve and execute from inside the Expo/React Native
 * application -- not merely that they compile under `tsc` or pass under
 * Node/Vitest (see docs/architecture/MOBILE-ARCHITECTURE.md §8, tier
 * distinction).
 *
 * Every import below is a REAL, EXISTING export. The engine packages
 * (calculation-engine, evidence-engine, diagnostic-engine, learning-engine)
 * are still pre-CC-05 skeletons -- this file does not add or simulate any
 * CC-05 calculation/question/diagnosis logic. It only exercises what
 * already exists: each package's `packageId` constant, and content-schema's
 * real (Zod-backed) `packageManifestSchema`, which is the one shared
 * package with genuine executable validation logic today.
 *
 * The `packageManifestSchema.safeParse(...)` calls demonstrate the
 * architectural CALL SHAPE required by MOBILE-ARCHITECTURE.md §20 (local
 * shared engine -> immediate local result) using this harmless existing
 * validator, not a fabricated question engine.
 */
import { packageId as calculationEngineId } from "@alp/calculation-engine";
import { packageManifestSchema, packageId as contentSchemaId } from "@alp/content-schema";
import { packageId as diagnosticEngineId } from "@alp/diagnostic-engine";
import { packageId as domainId } from "@alp/domain";
import { packageId as evidenceEngineId } from "@alp/evidence-engine";
import { packageId as learningEngineId } from "@alp/learning-engine";

export type SharedPackageProofResult = {
  readonly package: string;
  readonly pass: boolean;
  readonly detail: string;
};

/**
 * Runs every shared-package proof and returns a structured, individually
 * inspectable result per package. Pure function: no I/O, safe to call from
 * a Jest test, a dev-only diagnostics screen, or a startup probe.
 */
export function runSharedPackageProof(): readonly SharedPackageProofResult[] {
  const results: SharedPackageProofResult[] = [];

  results.push(idProof("@alp/domain", domainId, "domain"));
  results.push(idProof("@alp/calculation-engine", calculationEngineId, "calculation-engine"));
  results.push(idProof("@alp/evidence-engine", evidenceEngineId, "evidence-engine"));
  results.push(idProof("@alp/diagnostic-engine", diagnosticEngineId, "diagnostic-engine"));
  results.push(idProof("@alp/learning-engine", learningEngineId, "learning-engine"));
  results.push(idProof("@alp/content-schema", contentSchemaId, "content-schema"));
  results.push(zodValidationProof());

  return results;
}

function idProof(pkg: string, actual: string, expected: string): SharedPackageProofResult {
  const pass = actual === expected;
  return {
    package: pkg,
    pass,
    detail: pass
      ? `packageId export resolved and evaluated to "${actual}"`
      : `packageId export evaluated to "${actual}", expected "${expected}"`,
  };
}

/**
 * Exercises real Zod validation logic (not a trivial constant) so the
 * proof demonstrates actual executable shared-package behaviour, not just
 * module resolution.
 */
function zodValidationProof(): SharedPackageProofResult {
  const valid = packageManifestSchema.safeParse({
    name: "cc-04n-native-proof",
    version: "0.1.0",
  });
  const invalid = packageManifestSchema.safeParse({ name: "", version: "" });

  const pass = valid.success === true && invalid.success === false;
  return {
    package: "@alp/content-schema (packageManifestSchema.safeParse)",
    pass,
    detail: pass
      ? "Valid input accepted and invalid input rejected by the real Zod schema"
      : `Unexpected result: valid.success=${valid.success}, invalid.success=${invalid.success}`,
  };
}
