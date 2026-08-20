/**
 * CC-07: evidence/mastery types -- the deterministic middle between raw
 * learner attempts and the `LearnerEvidenceSnapshot` the lesson assembler
 * consumes.
 *
 * Design authority: docs/research/phase-1/PHASE-1-WP1.3-LEARNER-EVIDENCE-
 * AND-MASTERY-ARCHITECTURE.md (approved WP1.3). Three layers are kept
 * explicit and never collapsed (task brief §5):
 *
 *   ATTEMPT (what happened)          -> LearnerAttemptRecord
 *   EVIDENCE INTERPRETATION           -> StepOutcome / eligibility /
 *   (what it legitimately tells us)      MisconceptionEvidenceEvent
 *   DERIVED STATE (what we believe)   -> CapabilityDerivation /
 *                                        FamilyDerivation / DerivedLearnerState
 *
 * Everything here is plain, JSON-serialisable data. No network, no
 * clock, no RNG, no UI -- the engine is pure batch derivation.
 */

import type { LessonPlan, QuestionBlueprint } from "@alp/content-schema";
import type { MasteryState } from "@alp/learning-engine";

// ---------------------------------------------------------------------
// Mastery policy version (task brief §15). NOT a timestamp: a stable
// integer identifying the exact deterministic ruleset in ./derivation.ts.
// Same attempts + same policy version => same derived state; a future
// policy v2 re-derives from the same untouched raw history.
// ---------------------------------------------------------------------

export const MASTERY_POLICY_VERSION = 1;

// ---------------------------------------------------------------------
// 1. ATTEMPT -- a raw learner interaction that occurred (WP1.3 §3.1).
// ---------------------------------------------------------------------

/**
 * One raw graded interaction, provenance-complete and uninterpreted.
 * Field-compatible with the mobile outbox's `lesson.evidence` payload and
 * with a `learner_attempt_events` server row.
 *
 * TRUST BOUNDARY: `correct` is a CLIENT-OBSERVED evaluation (the
 * deterministic engine ran on-device). Capability/family/misconception
 * attribution is NOT taken from the client at all -- the derivation
 * re-resolves what the attempt legitimately says from the GOVERNED
 * content identified by `questionBlueprintId` + lesson identity, so a
 * client cannot spoof "this attempt evidences capability X" (task brief
 * §3.C/§3.D). Full re-marking of `correct` itself is the future server
 * revalidation seam (the row keeps blueprint id/version/seed/release +
 * givenAnswer precisely so that stays possible).
 */
export interface LearnerAttemptRecord {
  readonly learnerId: string;
  /** Deterministic assembled-instance identity (@alp/learning-engine). */
  readonly instanceId: string;
  /**
   * Unique id of the SESSION OCCURRENCE that produced this attempt.
   * Required because `instanceId` is deliberately deterministic (same
   * lesson + same evidence digest => same id), so a replayed lesson can
   * legitimately reuse an instanceId; attempt identity must not collide
   * across those replays (task brief §8's "any additional component
   * genuinely required for uniqueness").
   */
  readonly sessionKey: string;
  readonly lessonId: string;
  readonly lessonVersion: number;
  readonly contentRelease: string;
  readonly stepId: string;
  /** Deterministic attempt identity within (sessionKey, stepId): 1 = first attempt. */
  readonly attemptIndex: number;
  /** True when the correct answer had been shown to the learner for this step before this attempt (CC-06D Correction G). */
  readonly answerRevealedBeforeAttempt: boolean;
  /** Governed instrument identity -- interpretation is re-resolved from this, never from client-supplied capability claims. */
  readonly questionBlueprintId: string;
  /** Client-observed deterministic marking result. */
  readonly correct: boolean;
  /** Client-clock provenance timestamp (ISO 8601). Used only for deterministic ordering among a learner's own attempts, never as identity. */
  readonly recordedAt: string;
}

/** The canonical, replay-safe natural identity of one attempt (task brief §8). */
export function attemptEventKey(a: {
  readonly learnerId: string;
  readonly instanceId: string;
  readonly sessionKey: string;
  readonly stepId: string;
  readonly attemptIndex: number;
}): string {
  return `${a.learnerId}|${a.instanceId}|${a.sessionKey}|${a.stepId}|${a.attemptIndex}`;
}

// ---------------------------------------------------------------------
// Governed content context -- what the derivation interprets against.
// Same governed content identity + same ordered evidence set + same
// policy version => same derived state (task brief §3.F).
// ---------------------------------------------------------------------

/** Minimal governed family metadata (mirror of the mobile projection's `assertionFamilies` entry). */
export interface EvidenceAssertionFamilyContext {
  readonly id: string;
  readonly requiredCapabilityIds: readonly string[];
}

export interface EvidenceContentContext {
  /** Canonical lesson plans, keyed internally by (id, version, contentRelease). */
  readonly lessons: readonly LessonPlan[];
  /** Governed question blueprints for the releases the attempts reference. */
  readonly questionBlueprints: readonly QuestionBlueprint[];
  /** Governed family -> required-capability relationships (family-level derivation input). */
  readonly assertionFamilies: readonly EvidenceAssertionFamilyContext[];
}

// ---------------------------------------------------------------------
// 2. EVIDENCE INTERPRETATION (WP1.3 §3.2) -- eligibility, step outcomes,
//    misconception evidence basis.
// ---------------------------------------------------------------------

export type IgnoredAttemptReason =
  /** Attempt belongs to a different learner than the derivation subject -- never contaminates state (task brief §31.P). */
  | "different_learner"
  /** A second record with the same canonical event identity -- sync replay artefact, not a second real attempt (task brief §31.N). */
  | "duplicate_event_identity"
  /** The lesson/step/blueprint this attempt references is not resolvable in the provided governed content context. An old attempt is never silently reinterpreted against different content (task brief §26). */
  | "content_unresolved";

export interface IgnoredAttempt {
  readonly eventKey: string;
  readonly reason: IgnoredAttemptReason;
  readonly detail: string;
}

/**
 * The interpreted outcome of one step visit (all attempts a learner made
 * on one step within one session occurrence). Grouping attempts into a
 * step outcome is what stops five retries counting as five independent
 * evidence events (WP1.3 §23/§34).
 */
export type StepOutcomeKind =
  /** Correct on the first attempt, answer never revealed beforehand. */
  | "passed_first_attempt"
  /** Correct on a later attempt, answer never revealed beforehand -- genuine but weaker evidence (WP1.3 §34). */
  | "passed_retry"
  /** At least one un-revealed incorrect attempt and no un-revealed correct attempt -- a meaningful failure. */
  | "failed"
  /** Every attempt happened after the answer was revealed -- discounted entirely for mastery (WP1.3 §33). */
  | "revealed_only";

export interface StepOutcome {
  readonly instanceId: string;
  readonly sessionKey: string;
  readonly stepId: string;
  readonly lessonId: string;
  readonly contentRelease: string;
  /** Governed pedagogical step semantics (from the canonical LessonPlan, never client-asserted). */
  readonly stepType: string;
  readonly scaffoldingLevel: "guided" | "standard" | "independent";
  /** Governed instrument targets (from the QuestionBlueprint's evidence contract). */
  readonly questionBlueprintId: string;
  readonly primaryCapabilityId: string;
  readonly assertionFamilyId: string;
  readonly supportingCapabilityIds: readonly string[];
  readonly kind: StepOutcomeKind;
  readonly attemptsConsidered: number;
  /** How many of the visit's attempts were discounted because the answer had been revealed. */
  readonly revealedAttemptsDiscounted: number;
  /** Deterministic ordering anchor: the visit's earliest (recordedAt, eventKey). */
  readonly orderKey: string;
}

/**
 * Governed misconception-evidence basis (task brief §7.2) -- a closed,
 * deterministic category stating WHY the system is entitled to claim
 * specific misconception evidence. A generic wrong answer never appears
 * here (task brief §7.1.A / §33).
 */
export type MisconceptionEvidenceBasis =
  /** An explicit governed error-classification instrument (`worked_error_classification` answer contract) carrying a `direct`-strength misconception target was answered incorrectly. */
  | "error_classification_incorrect"
  /** A governed two-option discriminator (`multiple_choice` with exactly 2 options) carrying a `direct`-strength misconception target was answered incorrectly -- the sole wrong option IS the misconception-mapped distractor. */
  | "binary_discriminator_incorrect";

export interface MisconceptionEvidenceEvent {
  readonly misconceptionId: string;
  readonly basis: MisconceptionEvidenceBasis;
  /** Always the governed target's declared strength; only `direct` targets are admissible as specific evidence under policy v1. */
  readonly strength: "direct";
  readonly eventKey: string;
  readonly questionBlueprintId: string;
  readonly recordedAt: string;
}

// ---------------------------------------------------------------------
// 3. DERIVED STATE (WP1.3 §3.3) -- explainable, reproducible.
// ---------------------------------------------------------------------

/** The deterministic evidence tallies a capability state is derived from -- the structured "why" (task brief §22). */
export interface CapabilityEvidenceCounts {
  /** First-attempt passes on non-guided steps (standard/independent scaffolding), answer never revealed. */
  readonly independentSuccesses: number;
  /** Subset of independentSuccesses that occurred on governed `transfer_application` steps (task brief §18). */
  readonly transferSuccesses: number;
  /** First-attempt passes on guided-scaffolding steps. */
  readonly scaffoldedSuccesses: number;
  /** Passed-on-retry outcomes (any scaffolding) -- real evidence, distinguishable from untouched first attempts (task brief §19). */
  readonly retrySuccesses: number;
  /** Independent passes of OTHER instruments that list this capability as supporting -- weak inferred positive evidence only (WP1.3 §47/§48). */
  readonly supportingSuccesses: number;
  /** Step visits that ended without an un-revealed correct answer. */
  readonly meaningfulFailures: number;
  /** Meaningful failures that occurred after this capability's first independent success -- the CONFLICTING/security-blocking signal. */
  readonly failuresAfterFirstIndependentSuccess: number;
  /** Step visits discounted entirely because every attempt followed an answer reveal. */
  readonly discountedRevealedOutcomes: number;
}

export interface CapabilityDerivation {
  readonly capabilityId: string;
  readonly state: MasteryState;
  /** Stable id of the exact policy rule that assigned the state (e.g. "provisionally_secure.v1"). */
  readonly ruleApplied: string;
  readonly counts: CapabilityEvidenceCounts;
  /** Order keys of the step outcomes considered, chronologically -- the audit trail back to evidence. */
  readonly consideredOutcomeKeys: readonly string[];
  readonly explanation: string;
}

export interface FamilyCapabilityState {
  readonly capabilityId: string;
  readonly state: MasteryState;
  readonly required: boolean;
}

export interface FamilyDerivation {
  readonly assertionFamilyId: string;
  readonly state: MasteryState;
  readonly ruleApplied: string;
  /** Null when the family's governed completeness set was not in the content context -- the state is then capped below the secure tiers. */
  readonly requiredCapabilityIds: readonly string[] | null;
  readonly capabilityStates: readonly FamilyCapabilityState[];
  readonly explanation: string;
}

export interface MisconceptionDerivation {
  readonly misconceptionId: string;
  /** True when specific misconception evidence exists AND the learner's most recent eligible discriminating interaction was still incorrect. */
  readonly currentlyEvidenced: boolean;
  readonly events: readonly MisconceptionEvidenceEvent[];
  readonly latestDiscriminatingOutcome: "incorrect" | "correct";
  readonly explanation: string;
}

export interface DerivedLearnerState {
  readonly learnerId: string;
  readonly masteryPolicyVersion: number;
  readonly attemptsConsidered: number;
  readonly ignoredAttempts: readonly IgnoredAttempt[];
  /** Sorted by capabilityId -- byte-stable output for identical input (task brief §31.O). */
  readonly capabilities: readonly CapabilityDerivation[];
  readonly families: readonly FamilyDerivation[];
  readonly misconceptions: readonly MisconceptionDerivation[];
}
