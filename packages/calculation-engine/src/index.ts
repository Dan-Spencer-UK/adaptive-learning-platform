/**
 * Framework-independent package boundary.
 *
 * This package will own quantities, units, formula definitions and
 * deterministic parameter/variant generation in a later CC package
 * (CC-05). CC-01 establishes only the package boundary and its
 * build/test wiring; no formulas or calculation rules exist yet.
 */

export const packageId = "calculation-engine" as const;

export type PackageId = typeof packageId;
