/**
 * Logic-level test for lesson session persistence, run against the
 * in-memory Jest mock (see storage/db.test.ts's header comment).
 * CC-06D: covers learner scoping (Correction E), the versioned persisted
 * envelope (§17), and evidence ownership/attempt identity (Correction G).
 */
import * as mockExpoSqlite from "../storage/__mocks__/expo-sqlite-jest-mock";
import { resetFoundationDbHandleForTests } from "../storage/db";
import { getFoundationState, setFoundationState } from "../storage/foundation-state";
import { startSession, type LessonSessionState } from "./lesson-session-controller";
import {
  clearLessonSession,
  getActiveLessonInstanceId,
  listLessonEvidence,
  loadLessonSession,
  recordLessonEvidence,
  saveLessonSession,
} from "./lesson-session-store";

jest.mock("expo-sqlite", () => mockExpoSqlite);

const LEARNER_A = "learner.aaa";
const LEARNER_B = "learner.bbb";

function evidence() {
  return {
    assertionFamilyId: "family.x",
    capabilityId: "cap.x",
    assertionIdentifiers: ["ASSERT-001"],
    supportingCapabilityIds: [],
    questionBlueprintId: "qb.x",
    generatedInstanceIdentity: { blueprintId: "qb.x", blueprintVersion: 1, contentRelease: "release.1", seed: 1 },
    correct: true,
    representationDependency: [],
  };
}

function session(learnerId: string, instanceId = "li1_a", overrides: Partial<LessonSessionState> = {}): LessonSessionState {
  const base = startSession(
    {
      instanceId,
      lessonId: "lesson.a",
      lessonVersion: 1,
      contentRelease: "release.1",
      assemblyPolicyVersion: 1,
      learnerId,
      stepDecisions: [],
      includedStepIds: ["a", "b"],
      completionCriteria: { requiredStepIds: ["a", "b"], requiredCapabilityEvidence: [], requiresRemediationClearance: true, exitSummary: "s" },
      evidenceDigest: "digest",
    },
    learnerId,
    "t0",
    "sess-test",
  );
  return { ...base, ...overrides };
}

describe("lesson session store", () => {
  beforeEach(() => {
    resetFoundationDbHandleForTests();
  });

  it("saves and loads a session by instance id for its owning learner", async () => {
    const state = session(LEARNER_A);
    await saveLessonSession(state);
    const loaded = await loadLessonSession("li1_a", LEARNER_A);
    expect(loaded).toEqual(state);
  });

  it("returns null for a session that was never saved", async () => {
    expect(await loadLessonSession("li1_never-saved", LEARNER_A)).toBeNull();
  });

  it("LEARNER SCOPING: learner B cannot load learner A's session (and A's data is not deleted)", async () => {
    const state = session(LEARNER_A);
    await saveLessonSession(state);

    expect(await loadLessonSession("li1_a", LEARNER_B)).toBeNull();
    // A's own data remains intact and available to A.
    expect(await loadLessonSession("li1_a", LEARNER_A)).toEqual(state);
  });

  it("LEARNER SCOPING: the active-session pointer is per learner -- B signing in sees no active session while A's persists", async () => {
    await saveLessonSession(session(LEARNER_A));
    expect(await getActiveLessonInstanceId(LEARNER_A)).toBe("li1_a");
    expect(await getActiveLessonInstanceId(LEARNER_B)).toBeNull();
  });

  it("refuses to persist a session without a learner id -- no durable unknown-learner state", async () => {
    const state = { ...session(LEARNER_A), learnerId: "" };
    await expect(saveLessonSession(state)).rejects.toThrow(/learner id/);
  });

  it("clears the active pointer once the session completes", async () => {
    await saveLessonSession(session(LEARNER_A));
    expect(await getActiveLessonInstanceId(LEARNER_A)).toBe("li1_a");
    await saveLessonSession(session(LEARNER_A, "li1_a", { completedAt: "t9" }));
    expect(await getActiveLessonInstanceId(LEARNER_A)).toBeNull();
  });

  it("clearLessonSession removes the active pointer only if it points at the cleared instance", async () => {
    await saveLessonSession(session(LEARNER_A, "li1_c"));
    await clearLessonSession("li1_c", LEARNER_A);
    expect(await getActiveLessonInstanceId(LEARNER_A)).toBeNull();
    expect(await loadLessonSession("li1_c", LEARNER_A)).toBeNull();
  });

  it("SESSION ENVELOPE: persisted state carries schemaVersion 2 (CC-07: sessionKey occurrence identity)", async () => {
    await saveLessonSession(session(LEARNER_A));
    const raw = await getFoundationState("lesson_session.li1_a");
    expect(raw).not.toBeNull();
    const parsed = JSON.parse(raw!) as { schemaVersion: number; state: { sessionKey: string } };
    expect(parsed.schemaVersion).toBe(2);
    expect(parsed.state.sessionKey).toBe("sess-test");
  });

  it("SESSION ENVELOPE: a v1 envelope (pre-CC-07, no sessionKey) fails safely to a fresh session", async () => {
    const legacyState = { ...session(LEARNER_A, "li1_v1"), sessionKey: undefined };
    await setFoundationState("lesson_session.li1_v1", JSON.stringify({ schemaVersion: 1, state: legacyState }));
    expect(await loadLessonSession("li1_v1", LEARNER_A)).toBeNull();
  });

  it("SESSION ENVELOPE: a malformed persisted blob fails safely to null instead of being cast blindly", async () => {
    await setFoundationState("lesson_session.li1_bad", JSON.stringify({ schemaVersion: 2, state: { instanceId: "li1_bad", nonsense: true } }));
    expect(await loadLessonSession("li1_bad", LEARNER_A)).toBeNull();
  });

  it("SESSION ENVELOPE: an unversioned legacy blob (no envelope) fails safely to null", async () => {
    await setFoundationState("lesson_session.li1_legacy", JSON.stringify(session(LEARNER_A, "li1_legacy")));
    expect(await loadLessonSession("li1_legacy", LEARNER_A)).toBeNull();
  });

  it("records lesson evidence with stable learner ownership, lesson identity and attempt identity, and lists it back most recent first", async () => {
    const s = session(LEARNER_A);
    await recordLessonEvidence({ evidence: evidence(), givenAnswer: 5, session: s, stepId: "step.1", attemptIndex: 1, answerRevealedBeforeAttempt: false });
    await recordLessonEvidence({ evidence: { ...evidence(), correct: false }, givenAnswer: 6, session: s, stepId: "step.2", attemptIndex: 2, answerRevealedBeforeAttempt: false });

    const list = await listLessonEvidence(LEARNER_A);
    expect(list).toHaveLength(2);
    expect(list[0]?.stepId).toBe("step.2");
    expect(list[0]?.attemptIndex).toBe(2);
    expect(list[0]?.answerRevealedBeforeAttempt).toBe(false);
    expect(list[1]?.stepId).toBe("step.1");
    for (const record of list) {
      expect(record.learnerId).toBe(LEARNER_A);
      expect(record.lessonId).toBe("lesson.a");
      expect(record.contentRelease).toBe("release.1");
    }
  });

  it("OUTBOX OWNERSHIP: learner A's queued evidence is not visible to (or reassigned to) learner B after a learner switch", async () => {
    await recordLessonEvidence({ evidence: evidence(), givenAnswer: 5, session: session(LEARNER_A), stepId: "step.1", attemptIndex: 1, answerRevealedBeforeAttempt: false });

    // Learner B signs in and records their own event -- A's event must
    // neither appear in B's list nor change ownership.
    await recordLessonEvidence({ evidence: evidence(), givenAnswer: 7, session: session(LEARNER_B, "li1_z"), stepId: "step.9", attemptIndex: 1, answerRevealedBeforeAttempt: false });

    const aList = await listLessonEvidence(LEARNER_A);
    const bList = await listLessonEvidence(LEARNER_B);
    expect(aList).toHaveLength(1);
    expect(aList[0]?.learnerId).toBe(LEARNER_A);
    expect(bList).toHaveLength(1);
    expect(bList[0]?.learnerId).toBe(LEARNER_B);
    expect(bList[0]?.instanceId).toBe("li1_z");
  });

  it("refuses to record evidence for a session without a learner id", async () => {
    const s = { ...session(LEARNER_A), learnerId: "" };
    await expect(
      recordLessonEvidence({ evidence: evidence(), givenAnswer: 1, session: s, stepId: "step.1", attemptIndex: 1, answerRevealedBeforeAttempt: false }),
    ).rejects.toThrow(/learner id/);
  });
});
