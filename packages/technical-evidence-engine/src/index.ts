/**
 * CC-23: generic knowledge-target -> technical-evidence-requirement
 * planning architecture.
 *
 * Transforms an already-APPROVED, qualification-agnostic set of
 * `KnowledgeTarget`s into deduplicated, requirement-mode-typed
 * `EvidenceRequirement`s -- deterministically, and without ever widening,
 * deepening, or inventing qualification scope of its own (see ./types.ts
 * §4/§8 and ./planner.ts).
 *
 * See docs/architecture/qualification-knowledge-construction-pipeline.md
 * §25 for the governing design, and docs/architecture/adr/ADR-0007-*.md
 * for the package-boundary decision this package implements.
 *
 * Independent of any specific qualification -- no real qualification's
 * content lives in this package. A qualification-specific ADAPTER
 * (outside this package, in the relevant back-test harness) translates
 * frozen qualification-specific data into `KnowledgeEvidencePlanningInput`
 * and calls `planEvidenceRequirements`; this package never does so itself.
 *
 * This package also defines (but never implements) the future technical-
 * evidence ACQUISITION contract (§14) and a generic local-input isolation
 * utility (§15/§21) any blind-acquisition experiment can configure.
 */

export const packageId = "technical-evidence-engine" as const;

export type PackageId = typeof packageId;

export * from "./types.ts";
export * from "./planner.ts";
export * from "./access-guard.ts";
export * from "./semantic-handoff.ts";
