/**
 * CC-07 outbox-sync test matrix (task brief §34), run against the
 * in-memory SQLite Jest mock and a controlled mock Supabase client (no
 * real network -- the server contract itself is proven separately by
 * pgTAP in supabase/tests/database/11_learner_attempt_events.sql).
 */
import type { Database } from "@alp/domain";
import type { SupabaseClient } from "@supabase/supabase-js";

import * as mockExpoSqlite from "../storage/__mocks__/expo-sqlite-jest-mock";
import { resetFoundationDbHandleForTests } from "../storage/db";
import { enqueueOutboxEvent, listPendingOutboxEvents } from "../storage/outbox";
import { startSession } from "../lesson-session/lesson-session-controller";
import { EVIDENCE_EVENT_TYPE, recordLessonEvidence } from "../lesson-session/lesson-session-store";
import { syncPendingLessonEvidence } from "./evidence-sync";

jest.mock("expo-sqlite", () => mockExpoSqlite);

const LEARNER_A = "aaaaaaaa-0000-0000-0000-000000000001";
const LEARNER_B = "bbbbbbbb-0000-0000-0000-000000000002";

interface UpsertCall {
  readonly table: string;
  readonly rows: readonly Record<string, unknown>[];
  readonly options: Record<string, unknown> | undefined;
}

function mockSupabase(behaviour: { error?: { code: string; message: string } } = {}) {
  const calls: UpsertCall[] = [];
  const client = {
    from: (table: string) => ({
      upsert: (rows: readonly Record<string, unknown>[], options?: Record<string, unknown>) => {
        calls.push({ table, rows, options });
        return Promise.resolve({ error: behaviour.error ?? null });
      },
    }),
  } as unknown as SupabaseClient<Database>;
  return { client, calls };
}

function session(learnerId: string, sessionKey = "sess-jest-1") {
  return startSession(
    {
      instanceId: "li1_jest_instance",
      lessonId: "lesson.electrical.ohms-law",
      lessonVersion: 1,
      contentRelease: "release.unit202.v1",
      assemblyPolicyVersion: 1,
      learnerId,
      stepDecisions: [],
      includedStepIds: ["independent_question_resistance"],
      completionCriteria: { requiredStepIds: ["independent_question_resistance"], requiredCapabilityEvidence: ["cap.ohms_law.solve_for_resistance"], masteryGateCapabilityIds: ["cap.ohms_law.solve_for_resistance"], requiresRemediationClearance: true, exitSummary: "s" },
      evidenceDigest: "digest",
    },
    learnerId,
    "t0",
    sessionKey,
  );
}

async function recordRealShapedEvidence(learnerId: string, options: { attemptIndex?: number; sessionKey?: string; correct?: boolean } = {}) {
  return recordLessonEvidence({
    evidence: {
      assertionFamilyId: "electrical.ohms_law",
      capabilityId: "cap.ohms_law.solve_for_resistance",
      assertionIdentifiers: ["EL-OHM-SOLVE-R-001"],
      supportingCapabilityIds: ["cap.ohms_law.apply_substitution"],
      questionBlueprintId: "ohms_law.solve_for_resistance",
      generatedInstanceIdentity: { blueprintId: "ohms_law.solve_for_resistance", blueprintVersion: 1, contentRelease: "release.unit202.v1", seed: 42 },
      correct: options.correct ?? true,
      representationDependency: [],
    },
    givenAnswer: 6,
    session: session(learnerId, options.sessionKey ?? "sess-jest-1"),
    stepId: "independent_question_resistance",
    attemptIndex: options.attemptIndex ?? 1,
    answerRevealedBeforeAttempt: false,
  });
}

async function pendingEvidenceCount(): Promise<number> {
  return (await listPendingOutboxEvents()).filter((e) => e.eventType === EVIDENCE_EVENT_TYPE).length;
}

describe("lesson evidence sync (CC-07 §34)", () => {
  beforeEach(() => resetFoundationDbHandleForTests());

  it("uploads the authenticated learner's pending events with the full canonical identity and marks them synced only after acceptance", async () => {
    await recordRealShapedEvidence(LEARNER_A, { attemptIndex: 1 });
    await recordRealShapedEvidence(LEARNER_A, { attemptIndex: 2, correct: false });
    const { client, calls } = mockSupabase();

    const result = await syncPendingLessonEvidence({ client, authenticatedLearnerId: LEARNER_A });

    expect(result).toEqual({ uploaded: 2, skippedOtherLearner: 0, skippedUnsyncable: 0, failed: false });
    // A first upload idempotently ensures the learner profile (mobile-only
    // learners have no web sign-in to create it), then upserts the events.
    expect(calls.map((c) => c.table)).toEqual(["learner_profiles", "learner_attempt_events"]);
    expect(calls[0]!.rows).toEqual([{ id: LEARNER_A }]);
    expect(calls[0]!.options).toEqual({ onConflict: "id", ignoreDuplicates: true });
    const eventCall = calls[1]!;
    expect(eventCall.options).toEqual({
      onConflict: "learner_id,lesson_instance_id,session_key,step_id,attempt_index",
      ignoreDuplicates: true,
    });
    const row = eventCall.rows[0]!;
    expect(row.learner_id).toBe(LEARNER_A);
    expect(row.lesson_instance_id).toBe("li1_jest_instance");
    expect(row.session_key).toBe("sess-jest-1");
    expect(row.step_id).toBe("independent_question_resistance");
    expect(row.attempt_index).toBe(1);
    expect(row.question_blueprint_id).toBe("ohms_law.solve_for_resistance");
    expect(row.question_blueprint_version).toBe(1);
    expect(row.content_release).toBe("release.unit202.v1");
    expect(row.client_correct).toBe(true);
    expect(await pendingEvidenceCount()).toBe(0);
  });

  it("a synced event is never re-uploaded (duplicate retry run is a no-op)", async () => {
    await recordRealShapedEvidence(LEARNER_A);
    const { client, calls } = mockSupabase();
    await syncPendingLessonEvidence({ client, authenticatedLearnerId: LEARNER_A });
    const second = await syncPendingLessonEvidence({ client, authenticatedLearnerId: LEARNER_A });
    expect(second.uploaded).toBe(0);
    // Nothing pending => no profile-ensure and no event upsert at all.
    expect(calls).toHaveLength(2);
  });

  it("network/server failure leaves every event pending and a later retry succeeds idempotently", async () => {
    await recordRealShapedEvidence(LEARNER_A);
    const failing = mockSupabase({ error: { code: "XX000", message: "network unreachable" } });

    const failed = await syncPendingLessonEvidence({ client: failing.client, authenticatedLearnerId: LEARNER_A });
    expect(failed.failed).toBe(true);
    expect(failed.uploaded).toBe(0);
    expect(await pendingEvidenceCount()).toBe(1);

    const healthy = mockSupabase();
    const retried = await syncPendingLessonEvidence({ client: healthy.client, authenticatedLearnerId: LEARNER_A });
    expect(retried.uploaded).toBe(1);
    expect(await pendingEvidenceCount()).toBe(0);
    // The retry re-sends with ignoreDuplicates so a server-side duplicate
    // (accepted before the failure surfaced) is still treated as success.
    const eventCall = healthy.calls.find((c) => c.table === "learner_attempt_events")!;
    expect(eventCall.options).toMatchObject({ ignoreDuplicates: true });
  });

  it("an event recorded for learner A is NEVER uploaded while learner B is authenticated -- retained locally for its owner", async () => {
    await recordRealShapedEvidence(LEARNER_A);
    const { client, calls } = mockSupabase();

    const asB = await syncPendingLessonEvidence({ client, authenticatedLearnerId: LEARNER_B });
    expect(asB.uploaded).toBe(0);
    expect(asB.skippedOtherLearner).toBe(1);
    expect(calls).toHaveLength(0);
    expect(await pendingEvidenceCount()).toBe(1);

    // The rightful learner's later session syncs it.
    const asA = await syncPendingLessonEvidence({ client, authenticatedLearnerId: LEARNER_A });
    expect(asA.uploaded).toBe(1);
    const eventCall = calls.find((c) => c.table === "learner_attempt_events")!;
    expect(eventCall.rows[0]!.learner_id).toBe(LEARNER_A);
    expect(await pendingEvidenceCount()).toBe(0);
  });

  it("a payload whose owner disagrees with the outbox row owner is never uploaded (defence-in-depth)", async () => {
    // Forge an outbox row owned by A whose payload claims B.
    await enqueueOutboxEvent(
      EVIDENCE_EVENT_TYPE,
      { learnerId: LEARNER_B, instanceId: "li1_x", sessionKey: "s", lessonId: "l", lessonVersion: 1, contentRelease: "r", stepId: "st", attemptIndex: 1, answerRevealedBeforeAttempt: false, recordedAt: "t", givenAnswer: 1, evidence: { questionBlueprintId: "qb", correct: true, generatedInstanceIdentity: { blueprintId: "qb", blueprintVersion: 1, contentRelease: "r", seed: 1 } } },
      LEARNER_A,
    );
    const { client, calls } = mockSupabase();
    const result = await syncPendingLessonEvidence({ client, authenticatedLearnerId: LEARNER_A });
    expect(result.uploaded).toBe(0);
    expect(result.skippedOtherLearner).toBe(1);
    expect(calls).toHaveLength(0);
  });

  it("a legacy/malformed payload that cannot form the canonical identity is retained and reported, never guessed at", async () => {
    await enqueueOutboxEvent(EVIDENCE_EVENT_TYPE, { learnerId: LEARNER_A, instanceId: "li1_old", stepId: "s", attemptIndex: 1 }, LEARNER_A);
    const { client, calls } = mockSupabase();
    const result = await syncPendingLessonEvidence({ client, authenticatedLearnerId: LEARNER_A });
    expect(result.uploaded).toBe(0);
    expect(result.skippedUnsyncable).toBe(1);
    expect(calls).toHaveLength(0);
    expect(await pendingEvidenceCount()).toBe(1);
  });

  it("non-evidence outbox events are never touched by evidence sync", async () => {
    await enqueueOutboxEvent("dev-proof.synthetic-event", { note: "foundation fixture" }, null);
    const { client, calls } = mockSupabase();
    const result = await syncPendingLessonEvidence({ client, authenticatedLearnerId: LEARNER_A });
    expect(result).toEqual({ uploaded: 0, skippedOtherLearner: 0, skippedUnsyncable: 0, failed: false });
    expect(calls).toHaveLength(0);
    expect((await listPendingOutboxEvents()).some((e) => e.eventType === "dev-proof.synthetic-event")).toBe(true);
  });
});
