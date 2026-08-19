/**
 * Session position/restoration and evidence persistence for the native
 * Lesson Player, built entirely on the existing local persistence
 * foundation (lib/storage/foundation-state.ts, lib/storage/outbox.ts) --
 * no new SQLite table, no new sync mechanism. Mirrors
 * proving-session/session-store.ts's exact pattern (task brief §24:
 * "Use the existing mobile persistence architecture rather than
 * inventing a second database"), scoped to `LessonSessionState`
 * (./lesson-session-controller.ts) instead of a flat practice queue.
 *
 * Evidence records are written through the existing outbox as
 * `lesson.evidence` events -- a distinct event type from the proving
 * slice's `proving.evidence` (different learning context), sharing the
 * same underlying infrastructure. They are never marked synced here --
 * there is no real sync target yet (CC-07+ scope, @alp/evidence-engine
 * remains an empty package boundary) -- correctly remaining "pending".
 */
import type { AnswerValue, QuestionEvidenceRecord } from "@alp/calculation-engine";

import { getFoundationState, setFoundationState } from "../storage/foundation-state.ts";
import { enqueueOutboxEvent, listPendingOutboxEvents, type OutboxRecord } from "../storage/outbox.ts";
import type { LessonSessionState } from "./lesson-session-controller.ts";

const SESSION_STATE_KEY_PREFIX = "lesson_session.";
/** Points at the instance id of the learner's in-progress (not yet completed) lesson session, if any -- powers a minimal Resume entry point (task brief §37) without a course/home-screen redesign. */
const ACTIVE_SESSION_POINTER_KEY = "lesson_session.active_instance_id";
const EVIDENCE_EVENT_TYPE = "lesson.evidence";

function sessionKey(instanceId: string): string {
  return `${SESSION_STATE_KEY_PREFIX}${instanceId}`;
}

/** Persists session position so an interrupted session (backgrounding, restart, process kill) is resumable -- Mobile UX Engineering Standard §6. Also updates the active-session pointer: cleared once the session completes. */
export async function saveLessonSession(state: LessonSessionState): Promise<void> {
  await setFoundationState(sessionKey(state.instanceId), JSON.stringify(state));
  await setFoundationState(ACTIVE_SESSION_POINTER_KEY, JSON.stringify(state.completedAt ? null : state.instanceId));
}

export async function loadLessonSession(instanceId: string): Promise<LessonSessionState | null> {
  const raw = await getFoundationState(sessionKey(instanceId));
  if (!raw) return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    return parsed as LessonSessionState;
  } catch {
    return null;
  }
}

export async function getActiveLessonInstanceId(): Promise<string | null> {
  const raw = await getFoundationState(ACTIVE_SESSION_POINTER_KEY);
  if (!raw) return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    return typeof parsed === "string" ? parsed : null;
  } catch {
    return null;
  }
}

export async function clearLessonSession(instanceId: string): Promise<void> {
  await setFoundationState(sessionKey(instanceId), JSON.stringify(null));
  if ((await getActiveLessonInstanceId()) === instanceId) {
    await setFoundationState(ACTIVE_SESSION_POINTER_KEY, JSON.stringify(null));
  }
}

export interface RecordedLessonEvidence {
  readonly evidence: QuestionEvidenceRecord;
  readonly givenAnswer: AnswerValue;
  readonly instanceId: string;
  readonly stepId: string;
  readonly recordedAt: string;
}

/** Writes a graded lesson-step interaction's evidence to the durable outbox queue -- local-first, optimistic, never blocking on network (Mobile UX Engineering Standard §1). */
export async function recordLessonEvidence(
  evidence: QuestionEvidenceRecord,
  givenAnswer: AnswerValue,
  instanceId: string,
  stepId: string,
): Promise<OutboxRecord> {
  const payload: RecordedLessonEvidence = {
    evidence,
    givenAnswer,
    instanceId,
    stepId,
    recordedAt: new Date().toISOString(),
  };
  return enqueueOutboxEvent(EVIDENCE_EVENT_TYPE, payload as unknown as Record<string, unknown>);
}

/** Lists every locally-recorded lesson-evidence event (all pending -- see module header), most recent first. */
export async function listLessonEvidence(): Promise<readonly RecordedLessonEvidence[]> {
  const events = await listPendingOutboxEvents();
  const parsed: RecordedLessonEvidence[] = [];
  for (const event of events) {
    if (event.eventType !== EVIDENCE_EVENT_TYPE) continue;
    try {
      parsed.push(JSON.parse(event.payload) as RecordedLessonEvidence);
    } catch {
      // Skip a malformed payload rather than fail the whole listing.
    }
  }
  return parsed.slice().reverse();
}
