/**
 * Framework-independent package boundary.
 *
 * This package will own lesson sequencing, remediation/return flow and
 * next-activity selection in later CC packages (from CC-06 onward).
 * CC-01 establishes only the package boundary and its build/test
 * wiring; no sequencing logic exists yet.
 */

export const packageId = "learning-engine" as const;

export type PackageId = typeof packageId;
