/**
 * CC-07: locally-derived learner evidence snapshot -- the offline half of
 * the real evidence chain:
 *
 *   local durable attempt events (pending AND synced)
 *     -> @alp/evidence-engine deriveLearnerState (mastery policy vN)
 *     -> LearnerEvidenceSnapshot
 *     -> @alp/learning-engine assembleLessonInstance.
 *
 * Entirely local: no network is required to launch a lesson (task brief
 * §24). The server's synchronized history remains canonical; because
 * attempts are append-only with a stable natural key, a future
 * server-history hydration simply unions into the same derivation
 * (convergence proven in scripts/content/prove-evidence-derivation.ts).
 *
 * Retrieval dueness is deliberately not computed here -- no scheduler
 * exists yet (task brief §36); the snapshot carries empty due-sets.
 */
import { deriveLearnerState, toLearnerEvidenceSnapshot, type DerivedLearnerState, type EvidenceContentContext, type LearnerAttemptRecord } from "@alp/evidence-engine";
import type { LearnerEvidenceSnapshot } from "@alp/learning-engine";

import { MOBILE_CONTENT_PROJECTION } from "../lesson-content/generated/mobile-content-projection.ts";
import { listLessonEvidence, type RecordedLessonEvidence } from "../lesson-session/lesson-session-store.ts";

/** Governed content context for derivation, from the bundled runtime projection. */
export function localEvidenceContentContext(): EvidenceContentContext {
  return {
    lessons: MOBILE_CONTENT_PROJECTION.lessons,
    questionBlueprints: MOBILE_CONTENT_PROJECTION.questionBlueprints,
    assertionFamilies: MOBILE_CONTENT_PROJECTION.assertionFamilies,
  };
}

/**
 * Maps one durable local evidence payload to the engine's attempt record.
 * Returns null for a payload that cannot form the canonical identity
 * (pre-CC-07 legacy events without a sessionKey) -- excluded rather than
 * guessed at, and reported by the caller where visibility matters.
 */
export function toAttemptRecord(payload: RecordedLessonEvidence): LearnerAttemptRecord | null {
  if (typeof payload.sessionKey !== "string" || payload.sessionKey.length === 0) return null;
  if (!payload.evidence?.questionBlueprintId) return null;
  return {
    learnerId: payload.learnerId,
    instanceId: payload.instanceId,
    sessionKey: payload.sessionKey,
    lessonId: payload.lessonId,
    lessonVersion: payload.lessonVersion,
    contentRelease: payload.contentRelease,
    stepId: payload.stepId,
    attemptIndex: payload.attemptIndex,
    answerRevealedBeforeAttempt: payload.answerRevealedBeforeAttempt,
    questionBlueprintId: payload.evidence.questionBlueprintId,
    correct: payload.evidence.correct,
    recordedAt: payload.recordedAt,
  };
}

export interface LocalDerivedEvidence {
  readonly derived: DerivedLearnerState;
  readonly snapshot: LearnerEvidenceSnapshot;
  /** Local events excluded because they predate the CC-07 identity contract (no session occurrence key). */
  readonly excludedLegacyEvents: number;
}

/** Derives the learner's current evidence snapshot from ALL locally available evidence (offline-capable, deterministic). */
export async function deriveLocalLearnerEvidence(learnerId: string): Promise<LocalDerivedEvidence> {
  const payloads = await listLessonEvidence(learnerId);
  const attempts: LearnerAttemptRecord[] = [];
  let excludedLegacyEvents = 0;
  for (const payload of payloads) {
    const record = toAttemptRecord(payload);
    if (record) attempts.push(record);
    else excludedLegacyEvents += 1;
  }
  const derived = deriveLearnerState({ learnerId, attempts, content: localEvidenceContentContext() });
  return { derived, snapshot: toLearnerEvidenceSnapshot(derived), excludedLegacyEvents };
}
