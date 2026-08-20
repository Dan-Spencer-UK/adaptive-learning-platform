/**
 * CC-07: durable, idempotent background sync of locally-recorded lesson
 * evidence to the learner's server-owned append-only history
 * (public.learner_attempt_events).
 *
 * Contract (task brief §13):
 *  - NEVER blocks lesson progression: callers fire-and-forget; every
 *    failure path leaves events pending for a future retry.
 *  - Idempotent: the server's natural event key (learner, instance,
 *    session occurrence, step, attempt index) + ON CONFLICT DO NOTHING
 *    (`ignoreDuplicates`) collapse safe retries onto one canonical row; a
 *    local event is marked synced only after server acceptance.
 *  - Ownership: an event recorded for learner A is NEVER uploaded while
 *    learner B is authenticated -- it is skipped (retained locally for
 *    its owner), never reassigned (§13.2).
 *  - Auth: expired access tokens are the Supabase client's own silent
 *    refresh concern; if no authenticated session exists, nothing is
 *    uploaded and nothing is lost (§13.3).
 *
 * This module is the ONLY place lesson evidence meets the network. The
 * Lesson Player itself stays network-free (CC-06C proof) -- sync is
 * triggered from the Learn context and dev QA tooling, not from player
 * code.
 */
import type { Database } from "@alp/domain";
import type { SupabaseClient } from "@supabase/supabase-js";

import { EVIDENCE_EVENT_TYPE, type RecordedLessonEvidence } from "../lesson-session/lesson-session-store.ts";
import { listPendingOutboxEvents, markOutboxEventSynced, type OutboxRecord } from "../storage/outbox.ts";

type AttemptEventInsert = Database["public"]["Tables"]["learner_attempt_events"]["Insert"];

export interface EvidenceSyncResult {
  /** Events accepted by the server this run (including server-side duplicates treated as success). */
  readonly uploaded: number;
  /** Events belonging to a different learner than the authenticated one -- retained locally, never uploaded or reassigned. */
  readonly skippedOtherLearner: number;
  /** Events whose payload cannot form the canonical identity (pre-CC-07 legacy/malformed) -- retained locally, reported, never guessed at. */
  readonly skippedUnsyncable: number;
  /** True when a network/server/auth failure left events pending for a future retry. */
  readonly failed: boolean;
  readonly errorDetail?: string;
}

function parsePayload(event: OutboxRecord): RecordedLessonEvidence | null {
  try {
    const parsed = JSON.parse(event.payload) as Partial<RecordedLessonEvidence>;
    if (
      typeof parsed.learnerId === "string" &&
      typeof parsed.instanceId === "string" &&
      typeof parsed.sessionKey === "string" &&
      parsed.sessionKey.length > 0 &&
      typeof parsed.lessonId === "string" &&
      typeof parsed.lessonVersion === "number" &&
      typeof parsed.contentRelease === "string" &&
      typeof parsed.stepId === "string" &&
      typeof parsed.attemptIndex === "number" &&
      typeof parsed.answerRevealedBeforeAttempt === "boolean" &&
      typeof parsed.recordedAt === "string" &&
      parsed.evidence &&
      typeof parsed.evidence.questionBlueprintId === "string" &&
      typeof parsed.evidence.correct === "boolean" &&
      parsed.evidence.generatedInstanceIdentity &&
      typeof parsed.evidence.generatedInstanceIdentity.blueprintVersion === "number" &&
      typeof parsed.evidence.generatedInstanceIdentity.seed === "number" &&
      parsed.givenAnswer !== undefined
    ) {
      return parsed as RecordedLessonEvidence;
    }
    return null;
  } catch {
    return null;
  }
}

function toInsertRow(payload: RecordedLessonEvidence): AttemptEventInsert {
  return {
    learner_id: payload.learnerId,
    lesson_instance_id: payload.instanceId,
    session_key: payload.sessionKey,
    lesson_id: payload.lessonId,
    lesson_version: payload.lessonVersion,
    content_release: payload.contentRelease,
    step_id: payload.stepId,
    attempt_index: payload.attemptIndex,
    answer_revealed_before_attempt: payload.answerRevealedBeforeAttempt,
    question_blueprint_id: payload.evidence.questionBlueprintId,
    question_blueprint_version: payload.evidence.generatedInstanceIdentity.blueprintVersion,
    question_seed: payload.evidence.generatedInstanceIdentity.seed,
    given_answer: payload.givenAnswer as AttemptEventInsert["given_answer"],
    client_correct: payload.evidence.correct,
    client_misconception_identifier: payload.evidence.misconceptionIdentifier ?? null,
    client_evidence_strength: payload.evidence.evidenceStrength ?? null,
    client_recorded_at: payload.recordedAt,
  };
}

/**
 * Uploads the AUTHENTICATED learner's pending lesson-evidence events.
 * `authenticatedLearnerId` must be the id of the currently signed-in
 * learner (from the live auth session) -- never taken from an event.
 */
export async function syncPendingLessonEvidence(args: {
  readonly client: SupabaseClient<Database>;
  readonly authenticatedLearnerId: string;
}): Promise<EvidenceSyncResult> {
  const { client, authenticatedLearnerId } = args;

  const pending = (await listPendingOutboxEvents()).filter((e) => e.eventType === EVIDENCE_EVENT_TYPE);
  let skippedOtherLearner = 0;
  let skippedUnsyncable = 0;
  const uploadable: { event: OutboxRecord; row: AttemptEventInsert }[] = [];

  for (const event of pending) {
    const payload = parsePayload(event);
    if (!payload) {
      skippedUnsyncable += 1;
      continue;
    }
    // Ownership guard (§13.2): both the outbox row's owner AND the payload
    // owner must match the live authenticated learner. Mismatches are
    // preserved locally for their rightful owner's future session.
    if (event.learnerId !== authenticatedLearnerId || payload.learnerId !== authenticatedLearnerId) {
      skippedOtherLearner += 1;
      continue;
    }
    uploadable.push({ event, row: toInsertRow(payload) });
  }

  if (uploadable.length === 0) {
    return { uploaded: 0, skippedOtherLearner, skippedUnsyncable, failed: false };
  }

  // Ensure the learner's application profile row exists before the first
  // evidence upload. CC-03 established learner_profiles as a client-side,
  // RLS-mediated idempotent insert -- but only the WEB sign-in action
  // performed it, so a mobile-only learner would otherwise fail
  // learner_attempt_events' ownership foreign key on every sync (found on
  // real hardware during the CC-07 Android smoke, not in Jest). Same
  // ON CONFLICT DO NOTHING semantics as apps/web/app/sign-in/actions.ts;
  // no UPDATE privilege exists or is needed.
  const profileResult = await client
    .from("learner_profiles")
    .upsert([{ id: authenticatedLearnerId }], { onConflict: "id", ignoreDuplicates: true });
  if (profileResult.error) {
    return {
      uploaded: 0,
      skippedOtherLearner,
      skippedUnsyncable,
      failed: true,
      errorDetail: `learner profile ensure failed -- ${profileResult.error.code ?? "unknown"}: ${profileResult.error.message}`,
    };
  }

  // ignoreDuplicates => ON CONFLICT DO NOTHING on the natural event key:
  // a retried/replayed upload of the same real attempt is a server no-op
  // treated as success (§13.1), and needs no UPDATE privilege on the
  // append-only table.
  const { error } = await client
    .from("learner_attempt_events")
    .upsert(
      uploadable.map((u) => u.row),
      { onConflict: "learner_id,lesson_instance_id,session_key,step_id,attempt_index", ignoreDuplicates: true },
    );

  if (error) {
    // Network/server/auth failure: everything stays pending; the lesson
    // experience is unaffected; a future retry re-sends idempotently.
    return {
      uploaded: 0,
      skippedOtherLearner,
      skippedUnsyncable,
      failed: true,
      errorDetail: `${error.code ?? "unknown"}: ${error.message}`,
    };
  }

  // Server accepted the batch -- only now do local events leave "pending".
  for (const { event } of uploadable) {
    await markOutboxEventSynced(event.id);
  }
  return { uploaded: uploadable.length, skippedOtherLearner, skippedUnsyncable, failed: false };
}
