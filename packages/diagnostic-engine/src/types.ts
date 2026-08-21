/**
 * CC-08: course-level adaptive orchestration -- deterministic
 * "what activity/lesson should the learner do next" selection, sitting
 * ABOVE (never duplicating) @alp/learning-engine's pre-session lesson
 * assembly and within-session branching, and consuming (never
 * recomputing) @alp/evidence-engine's derived learner state via
 * @alp/learning-engine's `LearnerEvidenceSnapshot`.
 *
 * Scope boundary (do not blur, task brief §18/§19):
 *   - course orchestration (this package) decides WHICH lesson/activity
 *     happens next, across lesson boundaries;
 *   - lesson assembly (@alp/learning-engine) decides WHICH governed
 *     steps are included in a lesson instance ONCE a lesson has been
 *     chosen;
 *   - within-session branching (@alp/learning-engine/branching.ts)
 *     decides WHERE a single misconception-remediation branch inside
 *     ONE lesson leads;
 *   - the Lesson Player (apps/mobile) executes an assembled instance.
 * This package never reaches into lesson-internal step sequencing or
 * branching, and lesson assembly never decides cross-lesson routing.
 *
 * No second mastery model: `LearnerEvidenceSnapshot`/`MasteryState`/
 * `MASTERED_STATES` are imported verbatim from @alp/learning-engine,
 * never redeclared.
 */

import type { LessonPlan, MasteryState, LearnerEvidenceSnapshot } from "@alp/learning-engine";

export type { LessonPlan, MasteryState, LearnerEvidenceSnapshot };

// ---------------------------------------------------------------------
// Course definition -- the smallest governed course/mini-unit shape
// this proving vertical needs (task brief §12). Deliberately a plain
// typed structure, not a general declarative rules language: sequencing
// is expressed as governed data (which lessons, in what order); the
// POLICY that interprets it against evidence is deterministic code
// (./select-next-activity.ts), not further declarative rules.
// ---------------------------------------------------------------------

/** One vocational target activity in a course's main sequence. */
export interface CourseNode {
  /** Course-local, stable node identity (never re-used across nodes in the same course). */
  readonly id: string;
  /** The real governed LessonPlan id this node targets. */
  readonly lessonId: string;
  /** 1-based position in the intended curriculum path -- course POSITION, never a mastery signal (task brief §13). */
  readonly sequence: number;
}

export interface CourseDefinition {
  readonly id: string;
  readonly schemaVersion: 1;
  /** The governed ContentRelease every node's lesson (and every remediation candidate it may resolve to) must belong to. */
  readonly contentRelease: string;
  /** Main-sequence vocational nodes, in course order. Remediation/foundational lessons are never listed here -- they are discovered dynamically via `remediationEligibility` (task brief §8), never hardcoded into the course definition. */
  readonly nodes: readonly CourseNode[];
}

// ---------------------------------------------------------------------
// Recent completion context -- what the learner just finished, supplied
// by the caller (task brief §9's example API). This is deliberately
// NOT a persisted history: it is the one piece of "what just happened"
// context the pure evidence snapshot cannot express (evidence records
// WHAT was learned, not WHICH lesson the learner is returning from),
// used only to distinguish a first remediation entry from a retest, and
// to recognise a return from remediation. No timestamps, no hidden
// clock input (task brief §11).
// ---------------------------------------------------------------------

export interface RecentCompletionContext {
  readonly lessonId: string;
  readonly lessonInstanceId: string;
}

// ---------------------------------------------------------------------
// Available content -- what the caller can currently resolve locally
// (task brief §21: the offline proving loop must never require a
// network round trip to decide what happens next). Mirrors
// @alp/learning-engine's `AssemblyContext.allLessons` shape exactly so
// callers can pass the same array to both.
// ---------------------------------------------------------------------

export interface AvailableContent {
  readonly allLessons: readonly LessonPlan[];
}

// ---------------------------------------------------------------------
// Activity-selection policy version (task brief §11). Same course
// definition + learner state + completion context + content release +
// policy version must always produce the same decision. No timestamps
// as a hidden decision input.
//
// CC-08A: the advancement rule this module applies changed materially
// (from "some evidence on every completion capability + at least one
// TRANSFER_SECURE" to "every declared masteryGateCapabilityIds capability
// independently reaches a secure tier") without bumping this version.
// That mirrors the precedent already set for @alp/evidence-engine's own
// MASTERY_POLICY_VERSION and instance-identity hashing during CC-06D: no
// production learner evidence existed against the old rule at the time of
// correction (CC-08 was never accepted for Product Owner sign-off before
// this correction landed), so there is nothing a version bump would need
// to keep separable from the corrected semantics. A version bump exists
// to let a future genuine behavioural change coexist with historical
// decisions made under the old rule -- it is not owed to a rule this
// package never shipped as correct.
// ---------------------------------------------------------------------

export const ACTIVITY_SELECTION_POLICY_VERSION = 1;

// ---------------------------------------------------------------------
// Decision vocabulary (task brief §10) -- only what this proving
// vertical actually needs.
// ---------------------------------------------------------------------

export const ACTIVITY_DECISION_TYPES = [
  /** Course entry: the learner has no evidence anywhere in the course yet. */
  "START_TARGET",
  /** The current target lesson has some evidence but is not yet complete, and no prerequisite is blocking it. */
  "CONTINUE_TARGET",
  /** A prerequisite family the target lesson assumes is evidenced WEAK/CONFLICTING; route into its resolved default remediation lesson. */
  "REMEDIATE_FOUNDATION",
  /** The learner just finished the remediation lesson but the prerequisite family is still not cleared; route back into the SAME remediation lesson for another real attempt (never "completion alone clears weakness", task brief §16). */
  "RETEST_FOUNDATION",
  /** The prerequisite family is now cleared (the learner just came from its remediation lesson); return to the vocational target for its transfer/application steps. */
  "RETURN_TO_VOCATIONAL_TRANSFER",
  /** The current target's governed completion capabilities are all mastered; move on to the next course node. */
  "ADVANCE",
  /** Every course node's completion capabilities are mastered -- the proving slice is complete. */
  "COMPLETE_SLICE",
  /** A prerequisite is evidenced weak/conflicting but no remediation lesson can be resolved for it (zero eligible candidates) -- fails explicitly rather than silently proceeding or guessing (task brief §8/§15). */
  "BLOCKED",
] as const;
export type ActivityDecisionType = (typeof ACTIVITY_DECISION_TYPES)[number];

/** Stable reason ids (task brief §29) -- prefer these over free-text alone so a caller/UI can branch on WHY deterministically. */
export const ACTIVITY_DECISION_REASONS = [
  "course_entry_no_evidence",
  "target_in_progress",
  "prerequisite_family_weak",
  "prerequisite_family_conflicting",
  "remediation_attempted_evidence_still_insufficient",
  "prerequisite_cleared_return_to_transfer",
  "target_capabilities_mastered_advance",
  "no_further_course_nodes",
  "no_eligible_remediation_candidate",
] as const;
export type ActivityDecisionReason = (typeof ACTIVITY_DECISION_REASONS)[number];

/** Structured evidence basis for a decision (task brief §29) -- never only a free-text explanation. */
export interface ActivityDecisionEvidenceBasis {
  /** The assertion-family id this decision was evaluated against, when applicable (prerequisite/target family). */
  readonly assertionFamilyId?: string;
  /** That family's mastery state at decision time, when applicable. */
  readonly familyStatus?: MasteryState;
  /** The course node id this decision concerns, when applicable. */
  readonly courseNodeId?: string;
}

export interface ActivityDecision {
  readonly decisionType: ActivityDecisionType;
  /** The real governed lesson id to launch next; absent only for COMPLETE_SLICE/BLOCKED. */
  readonly lessonId?: string;
  readonly reason: ActivityDecisionReason;
  /** Human-readable explanation, always present alongside the stable `reason` id (task brief §29: prefer stable reason ids plus useful structured data, never free text alone). */
  readonly detail: string;
  readonly policyVersion: number;
  readonly evidenceBasis: ActivityDecisionEvidenceBasis;
}

// ---------------------------------------------------------------------
// selectNextActivity's own input shape.
// ---------------------------------------------------------------------

export interface SelectNextActivityArgs {
  readonly courseDefinition: CourseDefinition;
  readonly learnerEvidenceSnapshot: LearnerEvidenceSnapshot;
  readonly recentCompletionContext?: RecentCompletionContext;
  readonly availableContent: AvailableContent;
  readonly policyVersion: number;
}

/** Thrown when a course node, or a remediation lesson resolvePrerequisiteCandidate resolves to, is not present in `availableContent` -- fails explicitly rather than guessing (task brief §K). Mirrors @alp/learning-engine's `AmbiguousPrerequisiteCandidatesError`/local-content-registry's `UnknownLessonError` convention. */
export class UnknownCourseActivityError extends Error {
  constructor(detail: string) {
    super(`Unknown course activity: ${detail}. Course nodes resolve only against explicitly available content -- there is no fallback.`);
    this.name = "UnknownCourseActivityError";
  }
}
