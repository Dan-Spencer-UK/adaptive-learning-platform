/**
 * Framework-independent package boundary.
 *
 * This package will own shared deterministic test fixtures/builders
 * (synthetic learner personas, seeded question variants) consumed by
 * later CC packages' test suites. CC-01 proves the package boundary
 * with a small deterministic id helper only.
 */

export const packageId = "test-fixtures" as const;

export type PackageId = typeof packageId;

export function createFixtureId(prefix: string, seed: number): string {
  return `${prefix}-${seed.toString().padStart(4, "0")}`;
}
