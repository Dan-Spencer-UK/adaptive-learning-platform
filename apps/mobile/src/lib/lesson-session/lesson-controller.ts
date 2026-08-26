/**
 * Orchestrates one learner interaction end to end: evaluate ->
 * emit/record evidence -> resolve within-session branch -> advance/hold
 * session position -> persist. Ties together @alp/calculation-engine
 * (marking), @alp/learning-engine (branch resolution), and
 * ./lesson-session-store.ts (persistence) -- no calculation/marking/
 * branching logic duplicated here.
 *
 * Advancement rule (governed `completionCondition` semantics):
 *  - A within-session branch destination (misconception detected, or a
 *    conditional_remediation_only step's own remediation_cleared route)
 *    always advances/jumps, regardless of correctness -- the branch IS
 *    the resolution.
 *  - Otherwise a `correct_answer_required` step only advances on a
 *    correct answer; an incorrect answer holds position so the learner
 *    can retry (evidence is still recorded either way).
 *  - Any other completionCondition advances regardless of correctness.
 *
 * Retry/reveal evidence integrity (CC-06D, Correction G):
 *  - Every submission carries a deterministic attemptIndex within
 *    (instanceId, stepId): first attempt = 1, retries increment. The
 *    attempt counter is persisted even when the position holds, so a
 *    restored session continues the same attempt sequence.
 *  - The correct answer is REVEALED in feedback only when the step is
 *    advancing (`result.revealCorrectAnswer`); while a retry is pending
 *    it is withheld, so a retried correct answer is a genuine
 *    independent attempt, not transcription of revealed feedback.
 *  - When a reveal does happen it is recorded on the session state, and
 *    every evidence event carries `answerRevealedBeforeAttempt` derived
 *    from that state -- CC-07 can therefore never mistake a post-reveal
 *    answer for independent first-attempt mastery evidence.
 */
import { evaluateAnswer, emitEvidence, type AnswerValue, type EvaluationResult, type GeneratedQuestionInstance, type QuestionEvidenceRecord } from "@alp/calculation-engine";
import { resolveWithinSessionBranch } from "@alp/learning-engine";
import type { LessonPlan, LessonStep } from "@alp/content-schema";

import {
  advanceSession,
  currentStepId,
  markAnswerRevealed,
  nextAttemptIndex,
  recordStepAttempt,
  wasAnswerRevealed,
  type LessonSessionState,
} from "./lesson-session-controller.ts";
import { recordLessonEvidence, saveLessonSession } from "./lesson-session-store.ts";

function findStep(lesson: LessonPlan, stepId: string): LessonStep {
  const step = lesson.steps.find((s) => s.id === stepId);
  if (!step) throw new Error(`Lesson '${lesson.id}' has no step '${stepId}' -- session/lesson mismatch`);
  return step;
}

function resolveBranchDestination(lesson: LessonPlan, step: LessonStep, evaluation: EvaluationResult): string | null {
  if (!evaluation.correct) {
    if (evaluation.misconceptionIdentifier) {
      const destination = resolveWithinSessionBranch(lesson, step.id, {
        trigger: "misconception_detected",
        misconceptionIdentifier: evaluation.misconceptionIdentifier,
      });
      if (destination) return destination;
    }
    // CC-12: no specific misconception route matched (or none was
    // identified at all) -- fall back to the generic "this was wrong,
    // cause not yet known" branch, if the step declares one. Never
    // invents certainty from an ambiguous wrong answer (task brief
    // §11/§16): a suggestive-only misconceptionIdentifier without its own
    // matching route is deliberately NOT treated as confirmed here.
    const fallback = resolveWithinSessionBranch(lesson, step.id, { trigger: "incorrect_answer" });
    if (fallback) return fallback;
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
  /** The attempt index this submission carried (1 = first attempt). */
  readonly attemptIndex: number;
  /** Whether the UI may display the correct answer in this submission's feedback -- false while a retry of the same question is pending (CC-06D, Correction G). */
  readonly revealCorrectAnswer: boolean;
}

/** For a graded step (has a real `GeneratedQuestionInstance`). Always records evidence with attempt identity; advances/holds/branches per the rule above; always persists the resulting state (including held-position attempt counts). */
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

  const attemptIndex = nextAttemptIndex(state, stepId);
  const answerRevealedBeforeAttempt = wasAnswerRevealed(state, stepId);

  const evaluation = evaluateAnswer(questionInstance, given);
  const evidence = emitEvidence(questionInstance, evaluation);

  const branchDestination = resolveBranchDestination(lesson, step, evaluation);
  const advanced = shouldAdvance(step, evaluation, branchDestination);
  // The correct answer may be shown only when this question will not be
  // asked again: an incorrect answer that holds position keeps it hidden.
  const revealCorrectAnswer = advanced;

  let nextState = recordStepAttempt(state, stepId, now());
  if (!evaluation.correct && revealCorrectAnswer) {
    nextState = markAnswerRevealed(nextState, stepId, now());
  }

  await recordLessonEvidence({
    evidence,
    givenAnswer: given,
    session: nextState,
    stepId,
    attemptIndex,
    answerRevealedBeforeAttempt,
  });

  if (advanced) {
    nextState = advanceSession(nextState, now(), branchDestination);
  }
  // Persist attempt/reveal bookkeeping even when holding position, so a
  // restored session continues the same deterministic attempt sequence.
  await saveLessonSession(nextState);

  return { evaluation, evidence, advanced, nextState, attemptIndex, revealCorrectAnswer };
}

/** For a non-graded step (`view_acknowledged`, or an `answer_submitted` step with no machine-marked question). Always advances; persists the resulting state. */
export async function acknowledgeStep(args: { readonly state: LessonSessionState; readonly now?: () => string }): Promise<LessonSessionState> {
  const now = args.now ?? (() => new Date().toISOString());
  const nextState = advanceSession(args.state, now());
  await saveLessonSession(nextState);
  return nextState;
}
