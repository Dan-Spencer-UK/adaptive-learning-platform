/**
 * Framework-independent package boundary.
 *
 * This package will own attempt-to-evidence transformation and
 * learner assertion state updates in a later CC package (CC-07).
 * CC-01 establishes only the package boundary and its build/test
 * wiring; no mastery or evidence-weighting logic exists yet.
 */

export const packageId = "evidence-engine" as const;

export type PackageId = typeof packageId;
