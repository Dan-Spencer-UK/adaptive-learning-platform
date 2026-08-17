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
} from "./types.ts";

/** WP1.3 §12 states treated as genuine evidence of weakness -- NOT_ASSESSED/INSUFFICIENT_EVIDENCE/EMERGING never trigger mandatory prerequisite remediation (WP1.3 §39.1: teaching must not be gated behind a diagnostic). */
const WEAK_PREREQUISITE_STATES = new Set(["WEAK", "CONFLICTING"]);

function primaryCapabilityFor(step: LessonStep): string | undefined {
  return step.evidenceEmitted[0] ?? step.capabilityIds[0];
}

function stepRetrievalKeys(lesson: LessonPlan, step: LessonStep): readonly string[] {
  return [...lesson.retrievalTags, ...step.capabilityIds];
}

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
    const due = stepRetrievalKeys(lesson, step).some((key) => evidence.retrievalDue.has(key));
    return due
      ? { stepId: step.id, included: true, reason: "retrieval_due", detail: "A retrieval tag/capability relevant to this step is currently due." }
      : { stepId: step.id, included: false, reason: "retrieval_not_due", detail: "No retrieval tag/capability relevant to this step is currently due." };
  }

  const capabilityId = primaryCapabilityFor(step);
  const status = capabilityId ? evidence.capabilityStatus.get(capabilityId) : undefined;
  const mastered = status !== undefined && MASTERED_STATES.has(status);
  return mastered
    ? { stepId: step.id, included: false, reason: "capability_mastered_skip", detail: `Capability '${capabilityId}' status is '${status}' -- skip permitted.` }
    : {
        stepId: step.id,
        included: true,
        reason: "capability_not_yet_mastered",
        detail: capabilityId ? `Capability '${capabilityId}' status is '${status ?? "NOT_ASSESSED"}' -- not yet strong enough to skip.` : "Step has no capability to evaluate mastery against -- included by default.",
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

function findUnmetPrerequisite(lesson: LessonPlan, evidence: LearnerEvidenceSnapshot): string | undefined {
  for (const familyId of lesson.prerequisiteKnowledge) {
    const status = evidence.capabilityStatus.get(familyId);
    if (status !== undefined && WEAK_PREREQUISITE_STATES.has(status)) {
      return familyId;
    }
  }
  return undefined;
}

/**
 * Assembles the deterministic, learner-specific instance for one
 * canonical lesson. If a prerequisite family has direct evidence of
 * weakness (WP1.3 WEAK/CONFLICTING), and the manifest resolves a unique
 * remediation candidate for it, returns `prerequisite_required` with
 * that remediation lesson's own assembled instance instead of the main
 * lesson -- the caller completes the prerequisite lesson first, then
 * calls this function again once its evidence has improved. If no
 * remediation candidate exists, returns `prerequisite_unresolved`
 * rather than silently proceeding as if the weakness did not exist.
 */
export function assembleLessonInstance(lesson: LessonPlan, evidence: LearnerEvidenceSnapshot, context: AssemblyContext): LessonAssemblyResult {
  const unmetFamilyId = findUnmetPrerequisite(lesson, evidence);
  if (unmetFamilyId) {
    const resolution = resolvePrerequisiteCandidate(unmetFamilyId, context.allLessons, lesson);
    if (resolution.status === "unresolved") {
      return { status: "prerequisite_unresolved", unresolved: [{ assertionFamilyId: unmetFamilyId, reason: "no_candidate_lesson" }] };
    }
    const prerequisiteInstance = assembleOwnSequence(resolution.lesson, evidence, context);
    return { status: "prerequisite_required", prerequisiteInstance, unmetFamilyId, mainLessonPending: lesson };
  }

  return { status: "ready", instance: assembleOwnSequence(lesson, evidence, context) };
}
