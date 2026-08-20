/**
 * CC-07: deterministic learner-state derivation -- mastery policy v1.
 *
 * raw attempts + governed content context
 *   -> eligibility (dedupe / ownership / content resolution / reveal)
 *   -> step outcomes (one interpreted outcome per step visit)
 *   -> capability states (WP1.3 §12's seven states, explicit rules below)
 *   -> family states (governed required-capability sets, task brief §17)
 *   -> misconception evidence (explicit governed basis only, task brief §7)
 *
 * DETERMINISM CONTRACT: same attempt set (any insertion order, duplicates
 * included) + same content context + same MASTERY_POLICY_VERSION produce a
 * byte-identical `DerivedLearnerState`. No Date.now, no Math.random, no
 * Map/Set iteration-order dependence in any output.
 *
 * CAPABILITY RULES (policy v1) -- evaluated strictly in this order; the
 * first match wins. All counts are step-visit outcomes, never raw attempt
 * counts (retries within one visit are one outcome -- WP1.3 §23/§34):
 *
 *   not_assessed.v1            no evidence touching the capability at all.
 *   conflicting.v1             >=2 independent successes AND >=2 meaningful
 *                              failures AND >=1 failure after the first
 *                              independent success -- strong evidence in
 *                              both directions (WP1.3 §12/§45).
 *   weak.v1                    >=2 meaningful failures, 0 independent
 *                              successes -- repeated meaningful weakness
 *                              (one wrong answer is never weakness, §10).
 *   transfer_secure.v1         >=2 independent successes of which >=1 on a
 *                              governed transfer_application step, and no
 *                              failure after the first independent success
 *                              (§29 -- transfer beyond narrow repetition).
 *   provisionally_secure.v1    >=2 independent successes, no failure after
 *                              the first (§12 -- secure in the practised
 *                              context; one correct answer never suffices,
 *                              §9).
 *   emerging.v1                >=1 independent success, or >=2 weaker
 *                              genuine successes (scaffolded/retry).
 *   insufficient_evidence.v1   some evidence exists but none of the above
 *                              can honestly be claimed (single scaffolded
 *                              success, single failure, supporting-only or
 *                              revealed-only evidence).
 *
 * FAMILY RULES (policy v1) -- over the union of the family's governed
 * required capabilities and its observed member capabilities:
 *
 *   family_not_assessed.v1           nothing assessed.
 *   family_conflicting.v1            any member CONFLICTING.
 *   family_weak.v1                   any member WEAK.
 *   family_transfer_secure.v1        every required capability TRANSFER_SECURE.
 *   family_provisionally_secure.v1   every required capability at least
 *                                    PROVISIONALLY_SECURE. A family is never
 *                                    secure because one narrow member passed
 *                                    (task brief §17).
 *   family_emerging.v1               any member at least EMERGING.
 *   family_insufficient.v1           otherwise.
 *   family_unknown_completeness.v1   family absent from the governed context:
 *                                    negative states propagate, but the state
 *                                    is capped at EMERGING -- never secure
 *                                    without a known completeness set.
 *
 * MISCONCEPTION RULES (policy v1, task brief §7/§33): specific
 * misconception evidence exists ONLY when a governed discriminating
 * instrument was answered incorrectly (answer never pre-revealed):
 *   - `worked_error_classification` contract + `direct`-strength target, or
 *   - `multiple_choice` with exactly TWO options + `direct`-strength target
 *     (the sole wrong option is the misconception-mapped distractor).
 * A wrong answer on any other instrument -- including numeric questions
 * that merely DECLARE a misconception target (`suggestive` strength) --
 * contributes generic incorrect evidence to the capability only. It never
 * names a misconception. False negatives are preferred over false
 * diagnostic claims (task brief §7.3). A misconception stays "currently
 * evidenced" until the learner's most recent eligible discriminating
 * interaction for it is correct.
 */

import type { LessonPlan, LessonStep, QuestionBlueprint } from "@alp/content-schema";
import type { MasteryState } from "@alp/learning-engine";

import {
  attemptEventKey,
  MASTERY_POLICY_VERSION,
  type CapabilityDerivation,
  type CapabilityEvidenceCounts,
  type DerivedLearnerState,
  type EvidenceContentContext,
  type FamilyCapabilityState,
  type FamilyDerivation,
  type IgnoredAttempt,
  type LearnerAttemptRecord,
  type MisconceptionDerivation,
  type MisconceptionEvidenceBasis,
  type MisconceptionEvidenceEvent,
  type StepOutcome,
} from "./types.ts";

// ---------------------------------------------------------------------
// Resolution helpers
// ---------------------------------------------------------------------

interface ResolvedAttempt {
  readonly attempt: LearnerAttemptRecord;
  readonly eventKey: string;
  readonly step: LessonStep;
  readonly blueprint: QuestionBlueprint;
}

function lessonKey(id: string, version: number, contentRelease: string): string {
  return `${id}@${version}@${contentRelease}`;
}

function orderKeyOf(recordedAt: string, eventKey: string): string {
  return `${recordedAt}|${eventKey}`;
}

/** Deterministic total order: client-recorded chronology first, canonical event key as the tiebreak. */
function compareByOrderKey(a: { readonly orderKey: string }, b: { readonly orderKey: string }): number {
  return a.orderKey < b.orderKey ? -1 : a.orderKey > b.orderKey ? 1 : 0;
}

// ---------------------------------------------------------------------
// Step-outcome interpretation
// ---------------------------------------------------------------------

function interpretStepVisit(visit: readonly ResolvedAttempt[]): StepOutcome {
  const first = visit[0]!;
  const unrevealed = visit.filter((r) => !r.attempt.answerRevealedBeforeAttempt);
  const revealedCount = visit.length - unrevealed.length;

  let kind: StepOutcome["kind"];
  if (unrevealed.length === 0) {
    kind = "revealed_only";
  } else {
    const firstAttempt = unrevealed.find((r) => r.attempt.attemptIndex === 1);
    const anyCorrect = unrevealed.some((r) => r.attempt.correct);
    if (firstAttempt?.attempt.correct) {
      kind = "passed_first_attempt";
    } else if (anyCorrect) {
      kind = "passed_retry";
    } else {
      kind = "failed";
    }
  }

  const orderKey = visit
    .map((r) => orderKeyOf(r.attempt.recordedAt, r.eventKey))
    .sort()[0]!;

  return {
    instanceId: first.attempt.instanceId,
    sessionKey: first.attempt.sessionKey,
    stepId: first.attempt.stepId,
    lessonId: first.attempt.lessonId,
    contentRelease: first.attempt.contentRelease,
    stepType: first.step.type,
    scaffoldingLevel: first.step.scaffoldingLevel,
    questionBlueprintId: first.blueprint.id,
    primaryCapabilityId: first.blueprint.evidence.primaryCapabilityId,
    assertionFamilyId: first.blueprint.evidence.familyId,
    supportingCapabilityIds: first.blueprint.evidence.supportingCapabilityIds,
    kind,
    attemptsConsidered: visit.length,
    revealedAttemptsDiscounted: revealedCount,
    orderKey,
  };
}

// ---------------------------------------------------------------------
// Capability derivation
// ---------------------------------------------------------------------

function isIndependentScaffolding(level: StepOutcome["scaffoldingLevel"]): boolean {
  return level !== "guided";
}

interface CapabilityEvidenceAccumulator {
  outcomes: StepOutcome[];
  supportingSuccesses: number;
  supportingKeys: string[];
}

function deriveCapabilityState(counts: CapabilityEvidenceCounts): { state: MasteryState; ruleApplied: string } {
  const anyEvidence =
    counts.independentSuccesses +
      counts.scaffoldedSuccesses +
      counts.retrySuccesses +
      counts.supportingSuccesses +
      counts.meaningfulFailures +
      counts.discountedRevealedOutcomes >
    0;
  if (!anyEvidence) return { state: "NOT_ASSESSED", ruleApplied: "not_assessed.v1" };

  if (counts.independentSuccesses >= 2 && counts.meaningfulFailures >= 2 && counts.failuresAfterFirstIndependentSuccess >= 1) {
    return { state: "CONFLICTING", ruleApplied: "conflicting.v1" };
  }
  if (counts.meaningfulFailures >= 2 && counts.independentSuccesses === 0) {
    return { state: "WEAK", ruleApplied: "weak.v1" };
  }
  if (counts.independentSuccesses >= 2 && counts.transferSuccesses >= 1 && counts.failuresAfterFirstIndependentSuccess === 0) {
    return { state: "TRANSFER_SECURE", ruleApplied: "transfer_secure.v1" };
  }
  if (counts.independentSuccesses >= 2 && counts.failuresAfterFirstIndependentSuccess === 0) {
    return { state: "PROVISIONALLY_SECURE", ruleApplied: "provisionally_secure.v1" };
  }
  if (counts.independentSuccesses >= 1 || counts.scaffoldedSuccesses + counts.retrySuccesses >= 2) {
    return { state: "EMERGING", ruleApplied: "emerging.v1" };
  }
  return { state: "INSUFFICIENT_EVIDENCE", ruleApplied: "insufficient_evidence.v1" };
}

function explainCapability(counts: CapabilityEvidenceCounts, state: MasteryState, ruleApplied: string): string {
  return (
    `${state} via ${ruleApplied}: ` +
    `${counts.independentSuccesses} independent success(es) (${counts.transferSuccesses} transfer), ` +
    `${counts.scaffoldedSuccesses} scaffolded, ${counts.retrySuccesses} retry, ` +
    `${counts.supportingSuccesses} supporting-only, ` +
    `${counts.meaningfulFailures} meaningful failure(s) (${counts.failuresAfterFirstIndependentSuccess} after first independent success), ` +
    `${counts.discountedRevealedOutcomes} visit(s) discounted (answer revealed before attempt).`
  );
}

// ---------------------------------------------------------------------
// Family derivation
// ---------------------------------------------------------------------

const AT_LEAST_PROVISIONAL: ReadonlySet<MasteryState> = new Set(["PROVISIONALLY_SECURE", "TRANSFER_SECURE"]);
const AT_LEAST_EMERGING: ReadonlySet<MasteryState> = new Set(["EMERGING", "PROVISIONALLY_SECURE", "TRANSFER_SECURE"]);

function deriveFamilyState(args: {
  readonly requiredCapabilityIds: readonly string[] | null;
  readonly memberStates: readonly FamilyCapabilityState[];
}): { state: MasteryState; ruleApplied: string } {
  const { requiredCapabilityIds, memberStates } = args;
  const assessed = memberStates.filter((m) => m.state !== "NOT_ASSESSED");
  if (assessed.length === 0) return { state: "NOT_ASSESSED", ruleApplied: "family_not_assessed.v1" };

  if (assessed.some((m) => m.state === "CONFLICTING")) return { state: "CONFLICTING", ruleApplied: "family_conflicting.v1" };
  if (assessed.some((m) => m.state === "WEAK")) return { state: "WEAK", ruleApplied: "family_weak.v1" };

  if (requiredCapabilityIds === null) {
    // Unknown completeness: negative states propagate above; positive
    // states can never honestly claim family security.
    if (assessed.some((m) => AT_LEAST_EMERGING.has(m.state))) {
      return { state: "EMERGING", ruleApplied: "family_unknown_completeness.v1" };
    }
    return { state: "INSUFFICIENT_EVIDENCE", ruleApplied: "family_unknown_completeness.v1" };
  }

  const required = memberStates.filter((m) => m.required);
  if (required.length > 0 && required.every((m) => m.state === "TRANSFER_SECURE")) {
    return { state: "TRANSFER_SECURE", ruleApplied: "family_transfer_secure.v1" };
  }
  if (required.length > 0 && required.every((m) => AT_LEAST_PROVISIONAL.has(m.state))) {
    return { state: "PROVISIONALLY_SECURE", ruleApplied: "family_provisionally_secure.v1" };
  }
  if (assessed.some((m) => AT_LEAST_EMERGING.has(m.state))) {
    return { state: "EMERGING", ruleApplied: "family_emerging.v1" };
  }
  return { state: "INSUFFICIENT_EVIDENCE", ruleApplied: "family_insufficient.v1" };
}

// ---------------------------------------------------------------------
// Misconception evidence basis (task brief §7)
// ---------------------------------------------------------------------

/**
 * Returns the governed discriminating basis a blueprint provides for a
 * `direct`-strength misconception target, or null when the instrument
 * cannot legitimately discriminate (in which case a wrong answer stays
 * generic incorrect evidence).
 */
export function misconceptionDiscriminationBasis(blueprint: QuestionBlueprint): MisconceptionEvidenceBasis | null {
  if (blueprint.answer.type === "worked_error_classification") return "error_classification_incorrect";
  if (blueprint.answer.type === "multiple_choice" && blueprint.answer.options?.length === 2) return "binary_discriminator_incorrect";
  return null;
}

// ---------------------------------------------------------------------
// Main derivation
// ---------------------------------------------------------------------

export function deriveLearnerState(args: {
  readonly learnerId: string;
  readonly attempts: readonly LearnerAttemptRecord[];
  readonly content: EvidenceContentContext;
}): DerivedLearnerState {
  const { learnerId, attempts, content } = args;

  const lessonsByKey = new Map<string, LessonPlan>();
  for (const lesson of content.lessons) {
    lessonsByKey.set(lessonKey(lesson.id, lesson.version, lesson.contentRelease), lesson);
  }
  const blueprintsById = new Map(content.questionBlueprints.map((b) => [b.id, b]));
  const familiesById = new Map(content.assertionFamilies.map((f) => [f.id, f]));

  // -------------------------------------------------------------------
  // Eligibility: ownership -> canonical dedupe -> content resolution.
  // Sorted canonically FIRST so insertion order can never influence
  // which of two identical-key records survives or any later output.
  // -------------------------------------------------------------------
  const ignored: IgnoredAttempt[] = [];
  const sorted = [...attempts]
    .map((attempt) => ({ attempt, eventKey: attemptEventKey(attempt), orderKey: orderKeyOf(attempt.recordedAt, attemptEventKey(attempt)) }))
    .sort(compareByOrderKey);

  const seenKeys = new Set<string>();
  const resolved: ResolvedAttempt[] = [];
  for (const { attempt, eventKey } of sorted) {
    if (attempt.learnerId !== learnerId) {
      ignored.push({ eventKey, reason: "different_learner", detail: `attempt belongs to learner '${attempt.learnerId}', derivation subject is '${learnerId}'` });
      continue;
    }
    if (seenKeys.has(eventKey)) {
      ignored.push({ eventKey, reason: "duplicate_event_identity", detail: "a record with this canonical event identity was already considered" });
      continue;
    }
    seenKeys.add(eventKey);

    const lesson = lessonsByKey.get(lessonKey(attempt.lessonId, attempt.lessonVersion, attempt.contentRelease));
    const step = lesson?.steps.find((s) => s.id === attempt.stepId);
    const blueprint = blueprintsById.get(attempt.questionBlueprintId);
    if (!lesson || !step || !blueprint) {
      ignored.push({
        eventKey,
        reason: "content_unresolved",
        detail: !lesson
          ? `lesson '${attempt.lessonId}@${attempt.lessonVersion}' in release '${attempt.contentRelease}' is not in the provided content context`
          : !step
            ? `step '${attempt.stepId}' does not exist in lesson '${attempt.lessonId}@${attempt.lessonVersion}'`
            : `question blueprint '${attempt.questionBlueprintId}' is not in the provided content context`,
      });
      continue;
    }
    resolved.push({ attempt, eventKey, step, blueprint });
  }

  // -------------------------------------------------------------------
  // Group into step visits: (instanceId, sessionKey, stepId).
  // -------------------------------------------------------------------
  const visits = new Map<string, ResolvedAttempt[]>();
  for (const record of resolved) {
    const visitKey = `${record.attempt.instanceId}|${record.attempt.sessionKey}|${record.attempt.stepId}`;
    const existing = visits.get(visitKey);
    if (existing) existing.push(record);
    else visits.set(visitKey, [record]);
  }
  const outcomes = [...visits.values()].map(interpretStepVisit).sort(compareByOrderKey);

  // -------------------------------------------------------------------
  // Capability evidence accumulation (chronological outcome order).
  // -------------------------------------------------------------------
  const accumulators = new Map<string, CapabilityEvidenceAccumulator>();
  const accumulatorFor = (capabilityId: string): CapabilityEvidenceAccumulator => {
    let acc = accumulators.get(capabilityId);
    if (!acc) {
      acc = { outcomes: [], supportingSuccesses: 0, supportingKeys: [] };
      accumulators.set(capabilityId, acc);
    }
    return acc;
  };

  for (const outcome of outcomes) {
    accumulatorFor(outcome.primaryCapabilityId).outcomes.push(outcome);
    if (outcome.kind === "passed_first_attempt" && isIndependentScaffolding(outcome.scaffoldingLevel)) {
      for (const supportingId of outcome.supportingCapabilityIds) {
        const acc = accumulatorFor(supportingId);
        acc.supportingSuccesses += 1;
        acc.supportingKeys.push(outcome.orderKey);
      }
    }
  }

  const capabilities: CapabilityDerivation[] = [...accumulators.entries()]
    .map(([capabilityId, acc]) => {
      let independentSuccesses = 0;
      let transferSuccesses = 0;
      let scaffoldedSuccesses = 0;
      let retrySuccesses = 0;
      let meaningfulFailures = 0;
      let failuresAfterFirstIndependentSuccess = 0;
      let discountedRevealedOutcomes = 0;
      let seenIndependentSuccess = false;

      for (const outcome of acc.outcomes) {
        switch (outcome.kind) {
          case "passed_first_attempt":
            if (isIndependentScaffolding(outcome.scaffoldingLevel)) {
              independentSuccesses += 1;
              if (outcome.stepType === "transfer_application") transferSuccesses += 1;
              seenIndependentSuccess = true;
            } else {
              scaffoldedSuccesses += 1;
            }
            break;
          case "passed_retry":
            retrySuccesses += 1;
            break;
          case "failed":
            meaningfulFailures += 1;
            if (seenIndependentSuccess) failuresAfterFirstIndependentSuccess += 1;
            break;
          case "revealed_only":
            discountedRevealedOutcomes += 1;
            break;
        }
      }

      const counts: CapabilityEvidenceCounts = {
        independentSuccesses,
        transferSuccesses,
        scaffoldedSuccesses,
        retrySuccesses,
        supportingSuccesses: acc.supportingSuccesses,
        meaningfulFailures,
        failuresAfterFirstIndependentSuccess,
        discountedRevealedOutcomes,
      };
      const { state, ruleApplied } = deriveCapabilityState(counts);
      const consideredOutcomeKeys = [...acc.outcomes.map((o) => o.orderKey), ...acc.supportingKeys].sort();
      return {
        capabilityId,
        state,
        ruleApplied,
        counts,
        consideredOutcomeKeys,
        explanation: explainCapability(counts, state, ruleApplied),
      };
    })
    .sort((a, b) => a.capabilityId.localeCompare(b.capabilityId));

  const capabilityStateById = new Map(capabilities.map((c) => [c.capabilityId, c.state]));

  // -------------------------------------------------------------------
  // Family derivation: families observed in evidence, over the union of
  // governed required capabilities and observed member capabilities.
  // -------------------------------------------------------------------
  const observedFamilyMembers = new Map<string, Set<string>>();
  for (const outcome of outcomes) {
    let members = observedFamilyMembers.get(outcome.assertionFamilyId);
    if (!members) {
      members = new Set();
      observedFamilyMembers.set(outcome.assertionFamilyId, members);
    }
    members.add(outcome.primaryCapabilityId);
  }

  const families: FamilyDerivation[] = [...observedFamilyMembers.entries()]
    .map(([familyId, observedMembers]) => {
      const governed = familiesById.get(familyId) ?? null;
      const requiredIds = governed ? [...governed.requiredCapabilityIds].sort((a, b) => a.localeCompare(b)) : null;
      const memberIds = [...new Set([...(requiredIds ?? []), ...observedMembers])].sort((a, b) => a.localeCompare(b));
      const memberStates: FamilyCapabilityState[] = memberIds.map((capabilityId) => ({
        capabilityId,
        state: capabilityStateById.get(capabilityId) ?? "NOT_ASSESSED",
        required: requiredIds?.includes(capabilityId) ?? false,
      }));
      const { state, ruleApplied } = deriveFamilyState({ requiredCapabilityIds: requiredIds, memberStates });
      const assessedSummary = memberStates
        .filter((m) => m.state !== "NOT_ASSESSED")
        .map((m) => `${m.capabilityId}=${m.state}${m.required ? "" : " (non-required)"}`)
        .join(", ");
      return {
        assertionFamilyId: familyId,
        state,
        ruleApplied,
        requiredCapabilityIds: requiredIds,
        capabilityStates: memberStates,
        explanation:
          `${state} via ${ruleApplied}: ` +
          (requiredIds === null
            ? "governed completeness set unknown in this context; "
            : `${requiredIds.length} required capability/ies; `) +
          (assessedSummary.length > 0 ? assessedSummary : "no member capability assessed") +
          ".",
      };
    })
    .sort((a, b) => a.assertionFamilyId.localeCompare(b.assertionFamilyId));

  // -------------------------------------------------------------------
  // Misconception evidence: governed discriminating instruments only.
  // Chronology is over eligible (un-revealed) attempts on those
  // instruments; the most recent eligible attempt decides currency.
  // -------------------------------------------------------------------
  interface DiscriminatingAttempt {
    readonly misconceptionId: string;
    readonly basis: MisconceptionEvidenceBasis;
    readonly record: ResolvedAttempt;
    readonly orderKey: string;
  }
  const discriminating: DiscriminatingAttempt[] = [];
  for (const record of resolved) {
    if (record.attempt.answerRevealedBeforeAttempt) continue;
    const basis = misconceptionDiscriminationBasis(record.blueprint);
    if (!basis) continue;
    for (const target of record.blueprint.evidence.misconceptionTargets) {
      if (target.evidenceStrength !== "direct") continue;
      discriminating.push({
        misconceptionId: target.misconceptionIdentifier,
        basis,
        record,
        orderKey: orderKeyOf(record.attempt.recordedAt, record.eventKey),
      });
    }
  }
  discriminating.sort(compareByOrderKey);

  const byMisconception = new Map<string, DiscriminatingAttempt[]>();
  for (const d of discriminating) {
    const existing = byMisconception.get(d.misconceptionId);
    if (existing) existing.push(d);
    else byMisconception.set(d.misconceptionId, [d]);
  }

  const misconceptions: MisconceptionDerivation[] = [...byMisconception.entries()]
    .map(([misconceptionId, interactions]) => {
      const events: MisconceptionEvidenceEvent[] = interactions
        .filter((d) => !d.record.attempt.correct)
        .map((d) => ({
          misconceptionId,
          basis: d.basis,
          strength: "direct" as const,
          eventKey: d.record.eventKey,
          questionBlueprintId: d.record.blueprint.id,
          recordedAt: d.record.attempt.recordedAt,
        }));
      const latest = interactions[interactions.length - 1]!;
      const latestDiscriminatingOutcome = latest.record.attempt.correct ? ("correct" as const) : ("incorrect" as const);
      const currentlyEvidenced = events.length > 0 && latestDiscriminatingOutcome === "incorrect";
      return {
        misconceptionId,
        currentlyEvidenced,
        events,
        latestDiscriminatingOutcome,
        explanation:
          `${events.length} governed discriminating incorrect interaction(s) across ${interactions.length} eligible discriminating attempt(s); ` +
          `most recent discriminating attempt was ${latestDiscriminatingOutcome} => ${currentlyEvidenced ? "currently evidenced" : "not currently evidenced"}.`,
      };
    })
    .filter((m) => m.events.length > 0)
    .sort((a, b) => a.misconceptionId.localeCompare(b.misconceptionId));

  return {
    learnerId,
    masteryPolicyVersion: MASTERY_POLICY_VERSION,
    attemptsConsidered: resolved.length,
    ignoredAttempts: ignored,
    capabilities,
    families,
    misconceptions,
  };
}
