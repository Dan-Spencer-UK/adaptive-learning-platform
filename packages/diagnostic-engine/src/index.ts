/**
 * Framework-independent package boundary.
 *
 * This package will own bounded competing-hypothesis diagnosis and
 * probe selection in a later CC package (CC-08). CC-01 establishes
 * only the package boundary and its build/test wiring; no diagnostic
 * rules exist yet.
 */

export const packageId = "diagnostic-engine" as const;

export type PackageId = typeof packageId;
