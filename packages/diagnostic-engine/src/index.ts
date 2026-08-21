/**
 * Framework-independent package boundary.
 *
 * CC-01 reserved this package for "bounded competing-hypothesis
 * diagnosis and probe selection in a later CC package (CC-08)". CC-08
 * fills it in with course-level adaptive orchestration: deterministic
 * next-activity selection across lesson boundaries, consuming (never
 * recomputing) @alp/evidence-engine's derived mastery state via
 * @alp/learning-engine's `LearnerEvidenceSnapshot`, and reusing (never
 * duplicating) @alp/learning-engine's `remediationEligibility`
 * resolution. See ./select-next-activity.ts's own header for the exact
 * scope boundary against lesson assembly / within-session branching.
 */

export const packageId = "diagnostic-engine" as const;

export type PackageId = typeof packageId;

export * from "./types.ts";
export * from "./select-next-activity.ts";
export * from "./course-definitions.ts";
