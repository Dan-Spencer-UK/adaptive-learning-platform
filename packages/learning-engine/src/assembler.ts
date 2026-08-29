/**
 * PRE-SESSION deterministic lesson assembly (ARCH-003 §6/§7, task brief
 * §1-§14). Pure function: same canonical `LessonPlan` + same normalized
 * `LearnerEvidenceSnapshot` + same `AssemblyContext` always produces the
 * same `LessonAssemblyResult`. Never mutates its inputs, never touches
 * the network/clock/RNG, never calls an LLM, never invents a question --
 * it only selects/orchestrates already-governed content (task brief §1).
 *
 * See ./branching.ts for the separate, WITHIN-session concern this
 * function deliberately does not decide.
 *
 * ADR-0006 / CC-13A status: this mastery-driven conditional-skip/
 * remediation assembly is real, implemented, RETAINED platform
 * capability -- not deleted, and it remains available to any lesson that
 * does not declare `LessonPlan.routePolicy: "CANONICAL_FIXED_ROUTE"`. It
 * is explicitly a POST-V1 direction, not a V1 ordinary-lesson production
 * requirement: a V1 canonical-route lesson's steps are all
 * `requirement: "required"` (enforced by `lessonPlanSchema`'s own
 * validation once `routePolicy` is declared), so `decideStep` below
 * degenerates to unconditionally including every step for such a lesson
 * -- its conditional-skip/remediation branches simply never activate.
 * See docs/architecture/LESSON-PLAYER-AND-LESSON-PLAN-ARCHITECTURE.md's
 * ADR-0006 reconciliation section for the full product-contract
 * correction this implementation was already consistent with.
 */

import type { LessonPlan, LessonStep } from "@alp/content-schema";
import { computeEvidenceDigest, computeInstanceIdentity } from "./identity.ts";
import { resolvePrerequisiteCandidate } from "./prerequisite-resolution.ts";
import {
  MASTERED_STATES,
  type AssembledStepDecision,
  type AssemblyContext,
  type LearnerEvidenceSnapshot,
  type LessonAssemblyResult,
  type LessonInstance,
  type PrerequisiteAdvisory,
} from "./types.ts";

/** WP1.3 §12 states treated as genuine evidence of weakness -- NOT_ASSESSED/INSUFFICIENT_EVIDENCE/EMERGING never trigger mandatory prerequisite remediation (WP1.3 §39.1: teaching must not be gated behind a diagnostic). */
const WEAK_PREREQUISITE_STATES = new Set(["WEAK", "CONFLICTING"]);

function decideStep(lesson: LessonPlan, step: LessonStep, evidence: LearnerEvidenceSnapshot): AssembledStepDecision {
  if (step.requirement === "required") {
    return { stepId: step.id, included: true, reason: "required", detail: "Step is unconditionally required by the canonical plan." };
  }

  if (step.requirement === "conditional_remediation_only") {
    return {
      stepId: step.id,
      included: false,
      reason: "conditional_remediation_not_entered",
      detail: "Remediation-only step; entered only via within-session branching, never part of the initial pre-session sequence.",
    };
  }

  // conditional_skip_if_mastered
  if (step.type === "retrieval_check") {
    // The two retrieval keyspaces are consulted separately and explicitly
    // (CC-06D §10.4) -- a lesson retrieval TAG is only ever looked up in
    // the tag due-set, a step CAPABILITY id only in the capability due-set.
    const due =
      lesson.retrievalTags.some((tag) => evidence.retrievalDueTags.has(tag)) ||
      step.capabilityIds.some((capabilityId) => evidence.retrievalDueCapabilityIds.has(capabilityId));
    return due
      ? { stepId: step.id, included: true, reason: "retrieval_due", detail: "A retrieval tag/capability relevant to this step is currently due." }
      : { stepId: step.id, included: false, reason: "retrieval_not_due", detail: "No retrieval tag/capability relevant to this step is currently due." };
  }

  // The skip-controlling capability is the step's EXPLICIT governed
  // masteryGateCapabilityId (CC-06D §10.3) -- never inferred from
  // evidenceEmitted[0]/capabilityIds[0] array position. The schema
  // requires the field on every non-retrieval conditional_skip_if_mastered
  // step; a plan missing it is invalid content and fails loudly here.
  const capabilityId = step.masteryGateCapabilityId;
  if (!capabilityId) {
    throw new Error(
      `Lesson '${lesson.id}' step '${step.id}' is conditional_skip_if_mastered but declares no masteryGateCapabilityId -- the skip-controlling capability must be explicit (invalid governed content; the lesson-plan schema enforces this at authoring time).`,
    );
  }
  const status = evidence.capabilityStatus.get(capabilityId);
  const mastered = status !== undefined && MASTERED_STATES.has(status);
  return mastered
    ? { stepId: step.id, included: false, reason: "capability_mastered_skip", detail: `Capability '${capabilityId}' status is '${status}' -- skip permitted.` }
    : {
        stepId: step.id,
        included: true,
        reason: "capability_not_yet_mastered",
        detail: `Capability '${capabilityId}' status is '${status ?? "NOT_ASSESSED"}' -- not yet strong enough to skip.`,
      };
}

/** Assembles a lesson's own step sequence only -- never chases that lesson's own prerequisites (prerequisite chains are resolved one level deep only; see the module header). */
function assembleOwnSequence(lesson: LessonPlan, evidence: LearnerEvidenceSnapshot, context: AssemblyContext): LessonInstance {
  const stepDecisions = lesson.steps.map((step) => decideStep(lesson, step, evidence));
  const includedStepIds = stepDecisions.filter((d) => d.included).map((d) => d.stepId);
  const evidenceDigest = computeEvidenceDigest(evidence);
  const instanceId = computeInstanceIdentity({
    lessonId: lesson.id,
    lessonVersion: lesson.version,
    contentRelease: lesson.contentRelease,
    assemblyPolicyVersion: context.assemblyPolicyVersion,
    learnerId: evidence.learnerId,
    evidenceDigest,
  });

  return {
    instanceId,
    lessonId: lesson.id,
    lessonVersion: lesson.version,
    contentRelease: lesson.contentRelease,
    assemblyPolicyVersion: context.assemblyPolicyVersion,
    learnerId: evidence.learnerId,
    stepDecisions,
    includedStepIds,
    completionCriteria: lesson.completionCriteria,
    evidenceDigest,
  };
}

function findUnmetPrerequisites(lesson: LessonPlan, evidence: LearnerEvidenceSnapshot): readonly string[] {
  const unmet: string[] = [];
  for (const familyId of lesson.prerequisiteKnowledge) {
    // prerequisiteKnowledge holds ASSERTION-FAMILY ids, so family-level
    // state is consulted (CC-06D §10.2) -- never the capability map.
    const status = evidence.familyStatus.get(familyId);
    if (status !== undefined && WEAK_PREREQUISITE_STATES.has(status)) {
      unmet.push(familyId);
    }
  }
  return unmet;
}

/**
 * Assembles the deterministic, learner-specific instance for one
 * canonical lesson. CC-12G (Product Owner product-architecture decision):
 * the requested lesson's own instance is ALWAYS produced and returned --
 * a prerequisite family with direct evidence of weakness (WP1.3 WEAK/
 * CONFLICTING) never blocks assembly, it only adds an advisory entry
 * (with the remediation lesson's own instance already assembled too, if
 * the manifest resolves a unique candidate for that family) so a caller
 * can show a readiness note or offer remediation without refusing to
 * open the lesson. See ./types.ts's `PrerequisiteAdvisory` doc comment
 * for the full rationale -- this replaces the previous hard-blocking
 * `prerequisite_required`/`prerequisite_unresolved` statuses, which
 * refused to assemble the requested lesson at all.
 */
export function assembleLessonInstance(lesson: LessonPlan, evidence: LearnerEvidenceSnapshot, context: AssemblyContext): LessonAssemblyResult {
  const instance = assembleOwnSequence(lesson, evidence, context);
  const unmetFamilyIds = findUnmetPrerequisites(lesson, evidence);
  if (unmetFamilyIds.length === 0) {
    return { status: "ready", instance };
  }

  const advisories: PrerequisiteAdvisory[] = unmetFamilyIds.map((unmetFamilyId) => {
    const resolution = resolvePrerequisiteCandidate(unmetFamilyId, context.allLessons, lesson);
    if (resolution.status === "unresolved") {
      return { unmetFamilyId, remediation: { status: "unresolved", reason: "no_candidate_lesson" } };
    }
    return { unmetFamilyId, remediation: { status: "available", lesson: resolution.lesson, instance: assembleOwnSequence(resolution.lesson, evidence, context) } };
  });
  return { status: "ready_with_prerequisite_advisory", instance, advisories };
}
