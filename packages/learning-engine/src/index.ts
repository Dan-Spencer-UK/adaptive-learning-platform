/**
 * Framework-independent package boundary.
 *
 * CC-01 established this package's boundary/build wiring, reserved for
 * "lesson sequencing, remediation/return flow and next-activity
 * selection ... from CC-06 onward." The Lesson Plan / deterministic
 * assembly package (following CC-06's governed LessonPlan schema in
 * @alp/content-schema) fills that in: given a canonical LessonPlan and
 * a normalized learner evidence snapshot, deterministically assembles
 * the learner-specific LessonInstance -- which governed steps this
 * learner receives, and why (./assembler.ts) -- plus the separate,
 * narrower within-session branch-resolution concern (./branching.ts).
 * It does not implement the production Lesson Player, does not persist
 * anything, does not call a network, and does not compute evidence from
 * raw attempts (that transformation remains @alp/evidence-engine's
 * reserved job).
 */

export const packageId = "learning-engine" as const;

export type PackageId = typeof packageId;

export * from "./types.ts";
export * from "./identity.ts";
export * from "./prerequisite-resolution.ts";
export * from "./assembler.ts";
export * from "./branching.ts";
export * from "./content-dependencies.ts";
