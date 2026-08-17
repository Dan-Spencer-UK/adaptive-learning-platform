/**
 * WITHIN-SESSION governed branching (ARCH-003 §17) -- deliberately
 * separate from pre-session assembly (./assembler.ts). Once a
 * `LessonInstance` exists, new evidence produced mid-session may steer
 * the learner along a branch route the canonical lesson already
 * declares (misconception detected, capability not evidenced, below
 * tolerance, remediation cleared) -- it must never cause the whole
 * lesson to be silently reassembled from scratch (task brief §16/§17).
 * This module resolves exactly one such decision at a time, using only
 * the governed `LessonStep.branchRoutes` Package A already defines --
 * no new schema, no new triggers invented here.
 */

import type { LessonPlan, StepBranchRoute } from "@alp/content-schema";

export interface BranchOutcomeEvidence {
  readonly trigger: StepBranchRoute["trigger"];
  readonly misconceptionIdentifier?: string;
}

/**
 * Given the step the learner just completed and what was actually
 * observed, resolves the destination step id the canonical plan's own
 * branch routes specify -- or `null` if no route matches (the learner
 * simply continues to the next step in `includedStepIds`, the caller's
 * job, not this function's).
 *
 * `misconception_detected` routes only match when the observed
 * `misconceptionIdentifier` equals the route's own -- a wrong answer
 * alone is never sufficient (task brief §10: "Distinguish wrong answer
 * from evidence of a specific governed misconception").
 */
export function resolveWithinSessionBranch(
  lesson: LessonPlan,
  completedStepId: string,
  outcome: BranchOutcomeEvidence,
): string | null {
  const step = lesson.steps.find((s) => s.id === completedStepId);
  if (!step) return null;

  for (const route of step.branchRoutes) {
    if (route.trigger !== outcome.trigger) continue;
    if (route.trigger === "misconception_detected") {
      if (route.misconceptionIdentifier !== outcome.misconceptionIdentifier) continue;
    }
    return route.destinationStepId;
  }
  return null;
}
