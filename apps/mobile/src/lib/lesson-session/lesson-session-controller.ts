/**
 * Pure Lesson session state machine (task brief §23/§24): once a learner
 * begins a `LessonInstance`, this module governs how the session's
 * position moves forward, including within-session branch jumps
 * (@alp/learning-engine's `resolveWithinSessionBranch`) -- never a
 * silent whole-lesson reassembly (ARCH-003 §17). No React, no SQLite, no
 * I/O -- session/controller tests (task brief §39.C) exercise this
 * directly; ../lesson-session-store.ts is the thin persistence wrapper
 * around it.
 *
 * Branch-jump semantics: `advanceSession`'s optional
 * `branchDestinationStepId` (the real `destinationStepId` a governed
 * `branchRoute` names) is honoured literally. If that step is not yet in
 * `stepSequence` (true of every `conditional_remediation_only` step,
 * since the pre-session assembler never includes them), it is spliced in
 * immediately after the current position. If it is already present (true
 * of a `remediation_cleared` route's destination, always a `required`
 * step the assembler already included), the pointer jumps directly to
 * its existing position -- steps between the jump origin and destination
 * are not visited on this path. This is a deliberate, literal reading of
 * the governed branch route's own authored intent (its `description`
 * field states exactly where it resumes); the Lesson Player does not
 * second-guess or reinterpret it. See this package's completion-report
 * notes on why `completionCriteria.requiredStepIds` is therefore treated
 * as descriptive completion-summary input, not a hard step-visitation
 * gate blocking `exit_completion` -- @alp/learning-engine's own
 * `LessonInstance.completionCriteria` is carried through unmodified and
 * this package does not redefine completion/mastery semantics.
 */
import type { LessonInstance } from "@alp/learning-engine";

export interface LessonSessionState {
  readonly instanceId: string;
  /**
   * Unique id of THIS session occurrence (CC-07). `instanceId` is
   * deliberately deterministic (same lesson + same evidence digest =>
   * same id), so a replayed lesson can legitimately reuse an instanceId;
   * durable attempt-event identity therefore includes this key so
   * replayed sessions can never collide with (and silently drop) each
   * other's evidence. Generated once at startSession, stable across
   * restore.
   */
  readonly sessionKey: string;
  readonly lessonId: string;
  readonly lessonVersion: number;
  readonly contentRelease: string;
  readonly assemblyPolicyVersion: number;
  readonly learnerId: string;
  /** The step sequence the learner actually walks -- starts as the assembled instance's includedStepIds, may grow via branch-insertions. Immutable content-release/lesson identity; only this ordering/position mutates. */
  readonly stepSequence: readonly string[];
  /** Index into stepSequence of the step currently being shown. */
  readonly currentIndex: number;
  /** Step ids completed so far, in completion order (never contains duplicates). */
  readonly completedStepIds: readonly string[];
  /**
   * Graded-answer attempts submitted per step id (CC-06D, Correction G):
   * deterministic attempt identity so evidence can distinguish a first
   * attempt from a retry. First attempt is 1.
   */
  readonly attemptCounts: Readonly<Record<string, number>>;
  /**
   * Step ids whose correct answer has been REVEALED to the learner
   * (shown in feedback). Under the current retry policy this only happens
   * when the step simultaneously advances (so the same question is never
   * re-asked after reveal), but the state is recorded rather than assumed
   * so evidence attribution stays honest by construction.
   */
  readonly revealedAnswerStepIds: readonly string[];
  readonly startedAt: string;
  readonly updatedAt: string;
  readonly completedAt: string | null;
}

/** Begins a new session from a freshly-assembled `ready` LessonInstance. `sessionKey` must be a fresh unique id for this occurrence (the caller generates it -- this module stays pure). */
export function startSession(instance: LessonInstance, learnerId: string, nowIso: string, sessionKey: string): LessonSessionState {
  if (!sessionKey) {
    throw new Error("Refusing to start a lesson session without a session occurrence key (CC-07 durable attempt identity).");
  }
  return {
    instanceId: instance.instanceId,
    sessionKey,
    lessonId: instance.lessonId,
    lessonVersion: instance.lessonVersion,
    contentRelease: instance.contentRelease,
    assemblyPolicyVersion: instance.assemblyPolicyVersion,
    learnerId,
    stepSequence: instance.includedStepIds,
    currentIndex: 0,
    completedStepIds: [],
    attemptCounts: {},
    revealedAnswerStepIds: [],
    startedAt: nowIso,
    updatedAt: nowIso,
    completedAt: null,
  };
}

/** Records one graded-answer submission for a step, returning the state with its attempt counter advanced. */
export function recordStepAttempt(state: LessonSessionState, stepId: string, nowIso: string): LessonSessionState {
  return {
    ...state,
    attemptCounts: { ...state.attemptCounts, [stepId]: nextAttemptIndex(state, stepId) },
    updatedAt: nowIso,
  };
}

/** The attempt index the NEXT submission on this step will carry (first attempt = 1). */
export function nextAttemptIndex(state: LessonSessionState, stepId: string): number {
  return (state.attemptCounts[stepId] ?? 0) + 1;
}

/** Whether this step's correct answer has already been revealed to the learner in feedback. */
export function wasAnswerRevealed(state: LessonSessionState, stepId: string): boolean {
  return state.revealedAnswerStepIds.includes(stepId);
}

/** Records that the correct answer for a step was displayed to the learner. */
export function markAnswerRevealed(state: LessonSessionState, stepId: string, nowIso: string): LessonSessionState {
  if (state.revealedAnswerStepIds.includes(stepId)) return state;
  return { ...state, revealedAnswerStepIds: [...state.revealedAnswerStepIds, stepId], updatedAt: nowIso };
}

export function currentStepId(state: LessonSessionState): string | null {
  return state.stepSequence[state.currentIndex] ?? null;
}

export function isSessionComplete(state: LessonSessionState): boolean {
  return state.completedAt !== null;
}

/** How far through the (possibly still-growing) step sequence the learner has progressed -- a simple proportional figure, deliberately not a precise denominator (task brief §8: branching means the true count isn't stable in advance). */
export function sessionProgress(state: LessonSessionState): { readonly completed: number; readonly total: number } {
  return { completed: state.completedStepIds.length, total: state.stepSequence.length };
}

/**
 * Marks the current step completed and moves to the next one. If
 * `branchDestinationStepId` is provided, jumps there (inserting it into
 * the sequence if new); otherwise advances linearly. Reaching the end of
 * the sequence marks the session complete.
 */
export function advanceSession(state: LessonSessionState, nowIso: string, branchDestinationStepId?: string | null): LessonSessionState {
  if (isSessionComplete(state)) return state;

  const justCompleted = currentStepId(state);
  const completedStepIds = justCompleted && !state.completedStepIds.includes(justCompleted) ? [...state.completedStepIds, justCompleted] : state.completedStepIds;

  let stepSequence = state.stepSequence;
  let nextIndex: number;

  if (branchDestinationStepId) {
    const existingIndex = stepSequence.indexOf(branchDestinationStepId);
    if (existingIndex >= 0) {
      nextIndex = existingIndex;
    } else {
      const insertAt = state.currentIndex + 1;
      stepSequence = [...stepSequence.slice(0, insertAt), branchDestinationStepId, ...stepSequence.slice(insertAt)];
      nextIndex = insertAt;
    }
  } else {
    nextIndex = state.currentIndex + 1;
  }

  const reachedEnd = nextIndex >= stepSequence.length;
  return {
    ...state,
    stepSequence,
    currentIndex: reachedEnd ? state.currentIndex : nextIndex,
    completedStepIds,
    updatedAt: nowIso,
    completedAt: reachedEnd ? nowIso : null,
  };
}
