/**
 * Deterministic learner-specific lesson assembly -- turns a governed,
 * canonical `LessonPlan` (@alp/content-schema, CC-06) plus a normalized
 * learner evidence snapshot into a `LessonInstance`: the deterministic,
 * immutable, executable step sequence one learner receives.
 *
 * Design authority: docs/architecture/LESSON-PLAYER-AND-LESSON-PLAN-
 * ARCHITECTURE.md (ARCH-003) §6/§7, and
 * docs/research/phase-1/PHASE-1-WP1.3-LEARNER-EVIDENCE-AND-MASTERY-
 * ARCHITECTURE.md (approved WP1.3) for the evidence/mastery vocabulary
 * this module adopts rather than reinvents.
 *
 * Scope boundary (do not blur): this package decides PRE-SESSION
 * assembly (which governed steps a learner instance starts with, and
 * why) from an already-normalized evidence snapshot supplied by its
 * caller. It does not compute that snapshot from raw attempts (that
 * transformation is @alp/evidence-engine's reserved job, CC-07), does
 * not persist anything, does not call a network, and does not implement
 * within-session UI/runtime -- see ./branching.ts for the separate,
 * narrower "given a governed branch trigger just fired mid-session,
 * where does it lead" concern (ARCH-003 §17).
 */

import type { LessonPlan, LessonStep, LessonCompletionCriteria } from "@alp/content-schema";

// ---------------------------------------------------------------------
// Learner evidence input -- WP1.3's own vocabulary, adopted verbatim
// (not a second mastery model). WP1.3 §12 defines the 7-state mastery
// classification; §5 defines evidence direction; neither has been
// encoded in TypeScript anywhere in the repo before this file, so this
// is the first encoding of that already-approved vocabulary, not an
// invention of a new one. Only the narrow input surface this assembler
// actually needs is normalized here -- confidence/transfer-distance/
// assistance-category etc. from WP1.3 are real but not needed for
// pre-session step selection, so they are deliberately not modelled.
// ---------------------------------------------------------------------

/** WP1.3 §12's seven mastery states, verbatim. */
export const MASTERY_STATES = [
  "NOT_ASSESSED",
  "INSUFFICIENT_EVIDENCE",
  "EMERGING",
  "PROVISIONALLY_SECURE",
  "TRANSFER_SECURE",
  "WEAK",
  "CONFLICTING",
] as const;
export type MasteryState = (typeof MASTERY_STATES)[number];

/** Stable id of a governed Capability (@alp/content-schema pedagogy layer). Documentation alias -- the namespace separation below is what actually prevents cross-keyspace queries. */
export type CapabilityId = string;
/** Stable id of a governed AssertionFamily (@alp/content-schema pedagogy layer). */
export type AssertionFamilyId = string;
/** A free-form retrieval hook tag (LessonPlan.retrievalTags). */
export type RetrievalTag = string;

/**
 * A status not present in its map is treated as `NOT_ASSESSED` (WP1.3
 * §39.1: "NOT_ASSESSED is ... a valid starting state for teaching" -- a
 * learner with zero evidence must still be assembled a complete lesson,
 * never an assembly failure).
 *
 * NAMESPACES (CC-06D, Correction F): capability-level and
 * assertion-family-level mastery state are conceptually distinct
 * keyspaces and are carried in SEPARATE maps -- it must never again be
 * possible to ask "what is the capability status of assertion-family id
 * X?" by silently sharing one map. Likewise retrieval dueness is split
 * into its two real keyspaces (lesson retrieval tags vs capability ids)
 * rather than one conflated Set.
 */
export interface LearnerEvidenceSnapshot {
  readonly learnerId: string;
  /** Capability-keyed mastery state (WP1.3 §12) -- capability ids ONLY. */
  readonly capabilityStatus: ReadonlyMap<CapabilityId, MasteryState>;
  /** Assertion-family-keyed prerequisite/mastery state -- family ids ONLY. Prerequisite gating consumes this map, never `capabilityStatus`. */
  readonly familyStatus: ReadonlyMap<AssertionFamilyId, MasteryState>;
  /** Misconception identifiers with direct or suggestive supporting evidence (WP1.3 §5's SUPPORTS_MISCONCEPTION direction), per QuestionEvidenceRecord.misconceptionIdentifier already emitted by the calculation engine. */
  readonly misconceptionsEvidenced: ReadonlySet<string>;
  /** Retrieval hook tags (LessonPlan.retrievalTags) currently due, as decided by an external scheduler this package never implements. Tags ONLY -- never capability ids. */
  readonly retrievalDueTags: ReadonlySet<RetrievalTag>;
  /** Capability ids whose retrieval practice is currently due. Capability ids ONLY -- never tags. */
  readonly retrievalDueCapabilityIds: ReadonlySet<CapabilityId>;
}

/** Mastery states strong enough to justify omitting a `conditional_skip_if_mastered` step -- WP1.3 §12's two "secure" tiers, both meaning reliable, not merely emerging, capability. */
export const MASTERED_STATES: ReadonlySet<MasteryState> = new Set(["PROVISIONALLY_SECURE", "TRANSFER_SECURE"]);

// ---------------------------------------------------------------------
// Assembly context / policy
// ---------------------------------------------------------------------

/**
 * Versioned assembly policy -- the rules this engine applies (which
 * mastery states justify a skip, how prerequisite candidates resolve)
 * are themselves content-adjacent governed decisions, versioned exactly
 * like `LessonPlan.contentRelease`/`schemaVersion` so instance identity
 * changes if the POLICY changes even when the canonical lesson and
 * evidence do not (task brief §15).
 */
export const ASSEMBLY_POLICY_VERSION = 1;

export interface AssemblyContext {
  readonly assemblyPolicyVersion: number;
  /** Every governed lesson, any content release -- prerequisite-candidate resolution (./prerequisite-resolution.ts) filters this to the target lesson's own `contentRelease` internally, so passing the full manifest here is always safe. */
  readonly allLessons: readonly LessonPlan[];
}

// ---------------------------------------------------------------------
// Step assembly decisions -- explainable, per task brief §14.
// ---------------------------------------------------------------------

export type StepDecisionReason =
  | "required"
  | "capability_mastered_skip"
  | "capability_not_yet_mastered"
  | "misconception_not_evidenced"
  | "retrieval_not_due"
  | "retrieval_due"
  | "conditional_remediation_not_entered";

export interface AssembledStepDecision {
  readonly stepId: string;
  readonly included: boolean;
  readonly reason: StepDecisionReason;
  readonly detail: string;
}

// ---------------------------------------------------------------------
// Lesson Instance -- the deterministic, immutable output. Deliberately
// reference-only (stepId, never full LessonStep content) so a future
// player resolves full step content from the canonical LessonPlan by
// (lessonId, lessonVersion, contentRelease) -- never a copy that could
// drift from the governed source (ARCH-003 §13, applied one level up,
// per task brief §2/§3).
// ---------------------------------------------------------------------

export interface LessonInstance {
  /** Deterministic identity -- see ./identity.ts. Same lessonId/version/contentRelease/policyVersion/evidence digest always produces the same id. */
  readonly instanceId: string;
  readonly lessonId: string;
  readonly lessonVersion: number;
  readonly contentRelease: string;
  readonly assemblyPolicyVersion: number;
  readonly learnerId: string;
  /** Every canonical step's decision, in canonical order -- full audit trail, not just the included subset. */
  readonly stepDecisions: readonly AssembledStepDecision[];
  /** Convenience projection: just the step ids the learner will actually receive, in canonical order. */
  readonly includedStepIds: readonly string[];
  /** Carried through unmodified from the canonical plan -- this package does not redefine completion/mastery. */
  readonly completionCriteria: LessonCompletionCriteria;
  /** Stable digest of the evidence snapshot that influenced this assembly, for audit/identity -- never the raw learner evidence values themselves. */
  readonly evidenceDigest: string;
}

// ---------------------------------------------------------------------
// Prerequisite resolution result
// ---------------------------------------------------------------------

/**
 * CC-12G: a Product Owner product-architecture decision -- prerequisite
 * evidence may inform recommendations, readiness warnings, and
 * diagnostic/remediation routing, but must NEVER hard-block a learner
 * from directly opening a lesson (previously `prerequisite_required`/
 * `prerequisite_unresolved` refused to assemble the requested lesson's
 * own instance at all). One entry per unmet prerequisite family (a
 * lesson may have more than one); `instance` on `LessonAssemblyResult`
 * is always the REQUESTED lesson's own playable instance regardless of
 * how many advisories are present.
 */
export interface PrerequisiteAdvisory {
  readonly unmetFamilyId: string;
  readonly remediation:
    | { readonly status: "available"; readonly lesson: LessonPlan; readonly instance: LessonInstance }
    | { readonly status: "unresolved"; readonly reason: "no_candidate_lesson" };
}

export type LessonAssemblyResult =
  | { readonly status: "ready"; readonly instance: LessonInstance }
  | { readonly status: "ready_with_prerequisite_advisory"; readonly instance: LessonInstance; readonly advisories: readonly PrerequisiteAdvisory[] };

/** Thrown, never silently resolved, when more than one lesson is `remediationEligibility`-eligible for the same prerequisite family and no exactly-one of them is marked `isDefaultRemediation` for it (task brief §8, corrected by the Package B remediation-selection correction: "fail assembly deterministically rather than choosing arbitrarily"). A valid manifest cannot reach this -- see scripts/content/validate-lesson-plan.ts's `ambiguousRemediationCandidates` gate -- but the assembler re-verifies defensively rather than trusting that upstream gate ran. */
export class AmbiguousPrerequisiteCandidatesError extends Error {
  readonly assertionFamilyId: string;
  readonly candidateLessonIds: readonly string[];

  constructor(assertionFamilyId: string, candidateLessonIds: readonly string[]) {
    super(`Ambiguous prerequisite remediation candidates for family '${assertionFamilyId}': ${candidateLessonIds.join(", ")}. When more than one lesson is remediation-eligible for a family within a content release, exactly one must be designated the default remediation lesson for deterministic selection.`);
    this.name = "AmbiguousPrerequisiteCandidatesError";
    this.assertionFamilyId = assertionFamilyId;
    this.candidateLessonIds = candidateLessonIds;
  }
}

export type { LessonPlan, LessonStep, LessonCompletionCriteria };
