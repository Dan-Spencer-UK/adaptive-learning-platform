/**
 * Session position/restoration and evidence persistence for the native
 * Lesson Player, built entirely on the existing local persistence
 * foundation (lib/storage/foundation-state.ts, lib/storage/outbox.ts) --
 * no new SQLite table, no new sync mechanism.
 *
 * CC-06D (Corrections E/G) hardening:
 *
 * LEARNER SCOPING -- every durable read/write is learner-scoped. The
 * active-session pointer is stored per learner, a persisted session
 * carries its owning learnerId, and `loadLessonSession` refuses to
 * return a session to any other learner (returning null, never deleting
 * -- learner A's offline data remains intact and available to learner A;
 * it is simply invisible to learner B). There is no "unknown-learner"
 * fallback anywhere in this module: callers must supply a real learner
 * id, and the Lesson Player fails closed when identity is unavailable.
 *
 * VERSIONED SESSION ENVELOPE -- persisted state is wrapped in
 * { schemaVersion: 1, state } and structurally validated on read.
 * Malformed/incompatible persisted state fails safely to null (a fresh
 * session) instead of being cast blindly back into the TypeScript type.
 * (Deliberately not a general migration framework -- see PROJECT-STATUS.)
 *
 * EVIDENCE ATTRIBUTION -- lesson evidence events are written through the
 * existing outbox as `lesson.evidence` events WITH stable learner
 * ownership (both on the outbox row and inside the payload), full lesson
 * identity (lessonId/version/contentRelease), and deterministic attempt
 * identity (attemptIndex, answerRevealedBeforeAttempt) so future CC-07
 * sync can build an idempotent natural key and can never confuse a
 * post-reveal retry with independent first-attempt evidence. Events are
 * never reassigned to another learner and are never marked synced here
 * (no real sync target exists yet -- CC-07+ scope).
 */
import type { AnswerValue, QuestionEvidenceRecord } from "@alp/calculation-engine";

import { getFoundationState, setFoundationState } from "../storage/foundation-state.ts";
import { enqueueOutboxEvent, listOutboxEventsByLearner, type OutboxRecord } from "../storage/outbox.ts";
import type { LessonSessionState } from "./lesson-session-controller.ts";

const SESSION_STATE_KEY_PREFIX = "lesson_session.";
const ACTIVE_SESSION_POINTER_KEY_PREFIX = "lesson_session.active_instance_id.";
export const EVIDENCE_EVENT_TYPE = "lesson.evidence";

/**
 * Version of the persisted-session envelope written by this module.
 * v2 (CC-07): session state gained the required `sessionKey` occurrence
 * id -- a v1 envelope without it fails safe to a fresh session (same
 * deliberate no-migration-framework policy as CC-06D; no production
 * learner data existed).
 */
export const SESSION_ENVELOPE_SCHEMA_VERSION = 2;

interface PersistedSessionEnvelope {
  readonly schemaVersion: typeof SESSION_ENVELOPE_SCHEMA_VERSION;
  readonly state: LessonSessionState;
}

function sessionKey(instanceId: string): string {
  return `${SESSION_STATE_KEY_PREFIX}${instanceId}`;
}

function activePointerKey(learnerId: string): string {
  return `${ACTIVE_SESSION_POINTER_KEY_PREFIX}${learnerId}`;
}

function isStringArray(value: unknown): value is readonly string[] {
  return Array.isArray(value) && value.every((v) => typeof v === "string");
}

/**
 * Structural validation of a parsed persisted session. Not a full zod
 * schema (this package keeps its persistence layer dependency-light) --
 * a deliberate field-by-field guard over exactly the shape this module
 * wrote. Anything unexpected is rejected, never silently accepted.
 */
function isValidSessionState(value: unknown): value is LessonSessionState {
  if (!value || typeof value !== "object") return false;
  const s = value as Record<string, unknown>;
  return (
    typeof s.instanceId === "string" &&
    typeof s.sessionKey === "string" &&
    s.sessionKey.length > 0 &&
    typeof s.lessonId === "string" &&
    typeof s.lessonVersion === "number" &&
    typeof s.contentRelease === "string" &&
    typeof s.assemblyPolicyVersion === "number" &&
    typeof s.learnerId === "string" &&
    s.learnerId.length > 0 &&
    isStringArray(s.stepSequence) &&
    typeof s.currentIndex === "number" &&
    isStringArray(s.completedStepIds) &&
    typeof s.attemptCounts === "object" &&
    s.attemptCounts !== null &&
    Object.values(s.attemptCounts as Record<string, unknown>).every((v) => typeof v === "number") &&
    isStringArray(s.revealedAnswerStepIds) &&
    typeof s.startedAt === "string" &&
    typeof s.updatedAt === "string" &&
    (s.completedAt === null || typeof s.completedAt === "string")
  );
}

/** Persists session position (learner-scoped) so an interrupted session is resumable -- Mobile UX Engineering Standard §6. Also updates the OWNING learner's active-session pointer: cleared once the session completes. */
export async function saveLessonSession(state: LessonSessionState): Promise<void> {
  if (!state.learnerId) {
    throw new Error("Refusing to persist a lesson session without a learner id (no durable unknown-learner state -- CC-06D Correction E).");
  }
  const envelope: PersistedSessionEnvelope = { schemaVersion: SESSION_ENVELOPE_SCHEMA_VERSION, state };
  await setFoundationState(sessionKey(state.instanceId), JSON.stringify(envelope));
  await setFoundationState(activePointerKey(state.learnerId), JSON.stringify(state.completedAt ? null : state.instanceId));
}

/**
 * Loads a persisted session FOR THE GIVEN LEARNER. Returns null when the
 * record does not exist, is malformed/incompatible, or belongs to a
 * different learner (ownership mismatch never deletes the other
 * learner's data -- it is simply not readable in this learner's context).
 */
export async function loadLessonSession(instanceId: string, learnerId: string): Promise<LessonSessionState | null> {
  const raw = await getFoundationState(sessionKey(instanceId));
  if (!raw) return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    const envelope = parsed as Partial<PersistedSessionEnvelope>;
    if (envelope.schemaVersion !== SESSION_ENVELOPE_SCHEMA_VERSION) return null;
    if (!isValidSessionState(envelope.state)) return null;
    if (envelope.state.learnerId !== learnerId) return null;
    return envelope.state;
  } catch {
    return null;
  }
}

/** The given learner's own active (in-progress) lesson instance id, if any. */
export async function getActiveLessonInstanceId(learnerId: string): Promise<string | null> {
  const raw = await getFoundationState(activePointerKey(learnerId));
  if (!raw) return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    return typeof parsed === "string" ? parsed : null;
  } catch {
    return null;
  }
}

export async function clearLessonSession(instanceId: string, learnerId: string): Promise<void> {
  await setFoundationState(sessionKey(instanceId), JSON.stringify(null));
  if ((await getActiveLessonInstanceId(learnerId)) === instanceId) {
    await setFoundationState(activePointerKey(learnerId), JSON.stringify(null));
  }
}

export interface RecordedLessonEvidence {
  readonly evidence: QuestionEvidenceRecord;
  readonly givenAnswer: AnswerValue;
  /** Stable owning learner -- recorded at write time, never inferred at sync time, never reassigned (CC-06D §9.3/§9.4). */
  readonly learnerId: string;
  readonly instanceId: string;
  /** Unique session-occurrence id (CC-07): part of the durable canonical attempt identity, because deterministic instanceIds legitimately recur across replays. */
  readonly sessionKey: string;
  /** Immutable lesson identity of the session that produced this evidence. */
  readonly lessonId: string;
  readonly lessonVersion: number;
  readonly contentRelease: string;
  readonly stepId: string;
  /** Deterministic attempt identity within (instanceId, stepId): 1 = first attempt, >1 = retry (CC-06D Correction G §11.2). */
  readonly attemptIndex: number;
  /** True when the correct answer had already been shown to the learner for this step before this attempt -- such an attempt must never later count as independent first-attempt mastery evidence. */
  readonly answerRevealedBeforeAttempt: boolean;
  readonly recordedAt: string;
}

/** Writes a graded lesson-step interaction's evidence to the durable outbox queue -- local-first, optimistic, never blocking on network (Mobile UX Engineering Standard §1). */
export async function recordLessonEvidence(args: {
  readonly evidence: QuestionEvidenceRecord;
  readonly givenAnswer: AnswerValue;
  readonly session: LessonSessionState;
  readonly stepId: string;
  readonly attemptIndex: number;
  readonly answerRevealedBeforeAttempt: boolean;
}): Promise<OutboxRecord> {
  const { session } = args;
  if (!session.learnerId) {
    throw new Error("Refusing to record lesson evidence without a learner id (no durable unknown-learner evidence -- CC-06D Correction E).");
  }
  const payload: RecordedLessonEvidence = {
    evidence: args.evidence,
    givenAnswer: args.givenAnswer,
    learnerId: session.learnerId,
    instanceId: session.instanceId,
    sessionKey: session.sessionKey,
    lessonId: session.lessonId,
    lessonVersion: session.lessonVersion,
    contentRelease: session.contentRelease,
    stepId: args.stepId,
    attemptIndex: args.attemptIndex,
    answerRevealedBeforeAttempt: args.answerRevealedBeforeAttempt,
    recordedAt: new Date().toISOString(),
  };
  return enqueueOutboxEvent(EVIDENCE_EVENT_TYPE, payload as unknown as Record<string, unknown>, session.learnerId);
}

/** Lists the GIVEN LEARNER's locally-recorded lesson-evidence events (pending AND synced -- synced events remain durable local history, CC-07), most recent first. Another learner's events are never returned. */
export async function listLessonEvidence(learnerId: string): Promise<readonly RecordedLessonEvidence[]> {
  const events = await listOutboxEventsByLearner(learnerId, EVIDENCE_EVENT_TYPE);
  const parsed: RecordedLessonEvidence[] = [];
  for (const event of events) {
    try {
      parsed.push(JSON.parse(event.payload) as RecordedLessonEvidence);
    } catch {
      // Skip a malformed payload rather than fail the whole listing.
    }
  }
  return parsed.slice().reverse();
}
