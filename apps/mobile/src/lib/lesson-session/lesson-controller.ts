/**
 * Orchestrates one learner interaction end to end: evaluate ->
 * emit/record evidence -> resolve within-session branch -> advance/hold
 * session position -> persist. Ties together @alp/calculation-engine
 * (marking), @alp/learning-engine (branch resolution), and
 * ./lesson-session-store.ts (persistence) -- the real runtime chain task
 * brief §4 requires, never duplicated or reimplemented here. No React;
 * a thin hook (../../hooks/useLessonSession or the screen component
 * itself) calls this and holds only UI state (submitting lock, etc.).
 *
 * Advancement rule (task brief §13 -- governed `completionCondition`
 * semantics, not a global policy):
 *  - A within-session branch destination (misconception detected, or a
 *    conditional_remediation_only step's own remediation_cleared route)
 *    always advances/jumps, regardless of correctness -- the branch IS
 *    the resolution.
 *  - Otherwise a `correct_answer_required` step only advances on a
 *    correct answer; an incorrect answer holds position so the learner
 *    can retry (evidence is still recorded either way -- evidence is
 *    evidence regardless of what happens next).
 *  - Any other completionCondition (`view_acknowledged`,
 *    `answer_submitted`) advances regardless of correctness, since
 *    correctness isn't the gate for those steps.
 */
import { evaluateAnswer, emitEvidence, type AnswerValue, type EvaluationResult, type GeneratedQuestionInstance, type QuestionEvidenceRecord } from "@alp/calculation-engine";
import { resolveWithinSessionBranch } from "@alp/learning-engine";
import type { LessonPlan, LessonStep } from "@alp/content-schema";

import { advanceSession, currentStepId, type LessonSessionState } from "./lesson-session-controller.ts";
import { recordLessonEvidence, saveLessonSession } from "./lesson-session-store.ts";

function findStep(lesson: LessonPlan, stepId: string): LessonStep {
  const step = lesson.steps.find((s) => s.id === stepId);
  if (!step) throw new Error(`Lesson '${lesson.id}' has no step '${stepId}' -- session/lesson mismatch`);
  return step;
}

function resolveBranchDestination(lesson: LessonPlan, step: LessonStep, evaluation: EvaluationResult): string | null {
  if (!evaluation.correct && evaluation.misconceptionIdentifier) {
    const destination = resolveWithinSessionBranch(lesson, step.id, {
      trigger: "misconception_detected",
      misconceptionIdentifier: evaluation.misconceptionIdentifier,
    });
    if (destination) return destination;
  }
  if (evaluation.correct && step.requirement === "conditional_remediation_only") {
    return resolveWithinSessionBranch(lesson, step.id, { trigger: "remediation_cleared" });
  }
  return null;
}

function shouldAdvance(step: LessonStep, evaluation: EvaluationResult, branchDestination: string | null): boolean {
  if (branchDestination) return true;
  if (step.completionCondition === "correct_answer_required") return evaluation.correct;
  return true;
}

export interface SubmitStepAnswerResult {
  readonly evaluation: EvaluationResult;
  readonly evidence: QuestionEvidenceRecord;
  readonly advanced: boolean;
  readonly nextState: LessonSessionState;
}

/** For a graded step (has a real `GeneratedQuestionInstance`). Always records evidence; advances/holds/branches per the rule above; always persists the resulting state. */
export async function submitStepAnswer(args: {
  readonly lesson: LessonPlan;
  readonly state: LessonSessionState;
  readonly questionInstance: GeneratedQuestionInstance;
  readonly given: AnswerValue;
  readonly now?: () => string;
}): Promise<SubmitStepAnswerResult> {
  const { lesson, state, questionInstance, given } = args;
  const now = args.now ?? (() => new Date().toISOString());

  const stepId = currentStepId(state);
  if (!stepId) throw new Error("Cannot submit an answer: the session has no current step (already complete?)");
  const step = findStep(lesson, stepId);

  const evaluation = evaluateAnswer(questionInstance, given);
  const evidence = emitEvidence(questionInstance, evaluation);
  await recordLessonEvidence(evidence, given, state.instanceId, stepId);

  const branchDestination = resolveBranchDestination(lesson, step, evaluation);
  const advanced = shouldAdvance(step, evaluation, branchDestination);
  const nextState = advanced ? advanceSession(state, now(), branchDestination) : state;

  if (advanced) await saveLessonSession(nextState);

  return { evaluation, evidence, advanced, nextState };
}

/** For a non-graded step (`view_acknowledged`, or an `answer_submitted` step with no machine-marked question, e.g. a predictive DO with no governed question blueprint). Always advances; persists the resulting state. */
export async function acknowledgeStep(args: { readonly state: LessonSessionState; readonly now?: () => string }): Promise<LessonSessionState> {
  const now = args.now ?? (() => new Date().toISOString());
  const nextState = advanceSession(args.state, now());
  await saveLessonSession(nextState);
  return nextState;
}
