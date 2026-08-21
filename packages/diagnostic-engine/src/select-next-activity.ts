/**
 * Deterministic course-level next-activity selection (task brief §9).
 * Pure function: same course definition + learner evidence snapshot +
 * recent completion context + available content + policy version always
 * produces the same decision (task brief §11/§30-A). No network, no
 * clock, no RNG, no persistence -- runs identically online or fully
 * offline (task brief §21).
 *
 * This is deterministic POLICY over already-governed course/content/
 * evidence state -- not an AI recommender, not personalization, not an
 * optimization engine, not an analytics platform (task brief §9).
 */

import type { AssemblyContext, LessonPlan, MasteryState } from "@alp/learning-engine";
import { resolvePrerequisiteCandidate, ASSEMBLY_POLICY_VERSION } from "@alp/learning-engine";

import type {
  ActivityDecision,
  ActivityDecisionEvidenceBasis,
  CourseDefinition,
  CourseNode,
  SelectNextActivityArgs,
} from "./types.ts";
import { UnknownCourseActivityError } from "./types.ts";

function ok(
  decisionType: ActivityDecision["decisionType"],
  reason: ActivityDecision["reason"],
  detail: string,
  policyVersion: number,
  evidenceBasis: ActivityDecisionEvidenceBasis,
  lessonId?: string,
): ActivityDecision {
  return { decisionType, lessonId, reason, detail, policyVersion, evidenceBasis };
}

function resolveLesson(allLessons: readonly LessonPlan[], lessonId: string, courseNodeId: string): LessonPlan {
  const lesson = allLessons.find((l) => l.id === lessonId);
  if (!lesson) {
    throw new UnknownCourseActivityError(`course node '${courseNodeId}' targets lesson '${lessonId}', which does not exist in the supplied available content`);
  }
  return lesson;
}

/**
 * A course node is "complete enough to advance" when BOTH:
 *   (a) every capability the lesson's own governed
 *       `completionCriteria.requiredCapabilityEvidence` declares has
 *       been evidenced at all (genuine lesson COMPLETION -- the learner
 *       engaged with every required part; task brief §13/§27 keep this
 *       distinct from mastery); and
 *   (b) at least one of those capabilities has reached TRANSFER_SECURE
 *       specifically (task brief §J "transfer-secure state allows
 *       advancement" -- genuine vocational transfer evidence, not mere
 *       guided/scaffolded engagement, must have been demonstrated).
 * Deliberately NOT "every required capability reaches MASTERED_STATES":
 * several of the real governed lessons' completion capabilities
 * (e.g. Ohm's Law's `apply_correct_unit`, `diagnose_wrong_operation`)
 * are, by governed design, evidenced only through guided/diagnostic
 * steps that structurally never accrue the two independent successes
 * PROVISIONALLY_SECURE/TRANSFER_SECURE require -- requiring uniform
 * secure mastery across every completion capability would make
 * advancement unreachable for real content. Capability-keyed only, per
 * the evidence engine's own namespace separation (task brief §M) --
 * family status is never consulted here.
 */
function isNodeComplete(lesson: LessonPlan, capabilityStatus: ReadonlyMap<string, MasteryState>): boolean {
  const required = lesson.completionCriteria.requiredCapabilityEvidence;
  const allEvidenced = required.every((capabilityId) => {
    const status = capabilityStatus.get(capabilityId);
    return status !== undefined && status !== "NOT_ASSESSED";
  });
  const anyTransferSecure = required.some((capabilityId) => capabilityStatus.get(capabilityId) === "TRANSFER_SECURE");
  return allEvidenced && anyTransferSecure;
}

function hasAnyEvidence(lesson: LessonPlan, capabilityStatus: ReadonlyMap<string, MasteryState>): boolean {
  return lesson.completionCriteria.requiredCapabilityEvidence.some((capabilityId) => capabilityStatus.has(capabilityId));
}

/** True when `candidate` is a lesson somewhere in the course's content that declares itself the resolved remediation lesson for one of `targetLesson`'s prerequisite families -- i.e. the learner's last completed activity WAS a remediation detour for this exact target. */
function isRemediationLessonFor(candidate: LessonPlan, targetLesson: LessonPlan): string | null {
  for (const familyId of targetLesson.prerequisiteKnowledge) {
    if (candidate.remediationEligibility.some((entry) => entry.assertionFamilyId === familyId)) {
      return familyId;
    }
  }
  return null;
}

export function selectNextActivity(args: SelectNextActivityArgs): ActivityDecision {
  const { courseDefinition, learnerEvidenceSnapshot, recentCompletionContext, availableContent, policyVersion } = args;
  const { familyStatus, capabilityStatus } = learnerEvidenceSnapshot;
  const allLessons = availableContent.allLessons;

  // 1. Find the first course node (by declared sequence, never insertion
  // order alone -- task brief §L/§Q) that is not yet complete. Every node
  // complete => COMPLETE_SLICE.
  const orderedNodes = [...courseDefinition.nodes].sort((a, b) => a.sequence - b.sequence);
  let targetNode: CourseNode | undefined;
  let targetLesson: LessonPlan | undefined;
  for (const node of orderedNodes) {
    const lesson = resolveLesson(allLessons, node.lessonId, node.id);
    if (!isNodeComplete(lesson, capabilityStatus)) {
      targetNode = node;
      targetLesson = lesson;
      break;
    }
  }

  if (!targetNode || !targetLesson) {
    return ok(
      "COMPLETE_SLICE",
      "no_further_course_nodes",
      "Every course node's governed completion capabilities are mastered -- the proving slice is complete.",
      policyVersion,
      {},
    );
  }

  // 2. Prerequisite gating: only WEAK/CONFLICTING evidence on a family the
  // target lesson explicitly assumes triggers remediation (task brief
  // §15/§18 -- NOT_ASSESSED/INSUFFICIENT_EVIDENCE/EMERGING never gate,
  // mirroring @alp/learning-engine's own prerequisite_required rule).
  // Declared prerequisiteKnowledge order decides which family is
  // addressed first when more than one is weak, so the same evidence
  // always yields the same decision (task brief §30-B).
  for (const familyId of targetLesson.prerequisiteKnowledge) {
    const status = familyStatus.get(familyId);
    if (status !== "WEAK" && status !== "CONFLICTING") continue;

    const resolution = resolvePrerequisiteCandidate(familyId, allLessons, targetLesson);
    if (resolution.status === "unresolved") {
      return ok(
        "BLOCKED",
        "no_eligible_remediation_candidate",
        `Prerequisite family '${familyId}' is evidenced ${status} but no governed lesson is eligible to remediate it -- failing explicitly rather than proceeding.`,
        policyVersion,
        { assertionFamilyId: familyId, familyStatus: status, courseNodeId: targetNode.id },
      );
    }
    // (resolvePrerequisiteCandidate itself throws AmbiguousPrerequisiteCandidatesError,
    // never guessing, when more than one candidate exists with no unique
    // default -- propagated unmodified, task brief §L.)

    const remediationLesson = resolution.lesson;
    const isRetest = recentCompletionContext?.lessonId === remediationLesson.id;
    return ok(
      isRetest ? "RETEST_FOUNDATION" : "REMEDIATE_FOUNDATION",
      isRetest ? "remediation_attempted_evidence_still_insufficient" : status === "WEAK" ? "prerequisite_family_weak" : "prerequisite_family_conflicting",
      isRetest
        ? `The learner just completed '${remediationLesson.id}' but prerequisite family '${familyId}' is still evidenced ${status} -- completion of remediation content alone never clears weakness (task brief §16); routing back for a genuine retest.`
        : `Prerequisite family '${familyId}' (required by '${targetLesson.id}') is evidenced ${status} -- routing to its resolved default remediation lesson '${remediationLesson.id}'.`,
      policyVersion,
      { assertionFamilyId: familyId, familyStatus: status, courseNodeId: targetNode.id },
      remediationLesson.id,
    );
  }

  // 3. No prerequisite currently blocks the target. If the learner's last
  // completed activity WAS a remediation lesson for one of this target's
  // prerequisites, the prerequisite is now clear (step 2 would otherwise
  // have routed back into it) -- send them back to the vocational target
  // for its transfer/application steps (task brief §16/§17/§20).
  if (recentCompletionContext) {
    const completedLesson = allLessons.find((l) => l.id === recentCompletionContext.lessonId);
    const clearedFamilyId = completedLesson ? isRemediationLessonFor(completedLesson, targetLesson) : null;
    if (clearedFamilyId) {
      return ok(
        "RETURN_TO_VOCATIONAL_TRANSFER",
        "prerequisite_cleared_return_to_transfer",
        `Prerequisite family '${clearedFamilyId}' is no longer WEAK/CONFLICTING after remediation -- returning to '${targetLesson.id}' for vocational transfer.`,
        policyVersion,
        { assertionFamilyId: clearedFamilyId, familyStatus: familyStatus.get(clearedFamilyId), courseNodeId: targetNode.id },
        targetLesson.id,
      );
    }
  }

  // 4. No blocking prerequisite, no return-from-remediation to signal --
  // the target itself is the next activity. Distinguish first-ever course
  // entry / advancing into a fresh node the learner has no evidence on
  // yet (course position, never a mastery signal, task brief §Q) from
  // resuming a target already in progress.
  const isFirstNode = targetNode.id === orderedNodes[0]!.id;
  const alreadyStarted = hasAnyEvidence(targetLesson, capabilityStatus);
  if (alreadyStarted) {
    return ok(
      "CONTINUE_TARGET",
      "target_in_progress",
      `'${targetLesson.id}' has evidence but its governed completion capabilities are not all yet mastered.`,
      policyVersion,
      { courseNodeId: targetNode.id },
      targetLesson.id,
    );
  }
  if (isFirstNode) {
    return ok(
      "START_TARGET",
      "course_entry_no_evidence",
      `No evidence exists anywhere in the course -- starting at the first course node, '${targetLesson.id}'.`,
      policyVersion,
      { courseNodeId: targetNode.id },
      targetLesson.id,
    );
  }
  return ok(
    "ADVANCE",
    "target_capabilities_mastered_advance",
    `The previous course node's target capabilities are mastered -- advancing to '${targetLesson.id}'.`,
    policyVersion,
    { courseNodeId: targetNode.id },
    targetLesson.id,
  );
}

/** Convenience: builds an @alp/learning-engine `AssemblyContext` from the same `availableContent` this package consumes, so a caller assembling the CHOSEN lesson via `assembleLessonInstance` never has to re-shape its content array. */
export function toAssemblyContext(availableContent: SelectNextActivityArgs["availableContent"]): AssemblyContext {
  return { assemblyPolicyVersion: ASSEMBLY_POLICY_VERSION, allLessons: availableContent.allLessons };
}

export type { CourseDefinition };
