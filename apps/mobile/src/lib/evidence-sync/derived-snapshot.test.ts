/**
 * CC-07: local offline evidence -> derived snapshot integration, run
 * against the in-memory SQLite Jest mock, the REAL bundled content
 * projection, and the REAL evidence engine. Proves the on-device half of
 * the evidence chain: durable local events (pending AND synced) ->
 * deterministic derivation -> LearnerEvidenceSnapshot, with no network.
 */
import * as mockExpoSqlite from "../storage/__mocks__/expo-sqlite-jest-mock";
import { resetFoundationDbHandleForTests } from "../storage/db";
import { enqueueOutboxEvent, listPendingOutboxEvents, markOutboxEventSynced } from "../storage/outbox";
import { startSession } from "../lesson-session/lesson-session-controller";
import { EVIDENCE_EVENT_TYPE, recordLessonEvidence } from "../lesson-session/lesson-session-store";
import { deriveLocalLearnerEvidence } from "./derived-snapshot";

jest.mock("expo-sqlite", () => mockExpoSqlite);

const LEARNER_A = "aaaaaaaa-0000-0000-0000-000000000001";
const LEARNER_B = "bbbbbbbb-0000-0000-0000-000000000002";

const REAL_LESSON = "lesson.electrical.ohms-law";
const REAL_RELEASE = "release.unit202.v2";

function session(learnerId: string, sessionKey: string) {
  return startSession(
    {
      instanceId: "li1_jest_instance",
      lessonId: REAL_LESSON,
      lessonVersion: 1,
      contentRelease: REAL_RELEASE,
      assemblyPolicyVersion: 1,
      learnerId,
      stepDecisions: [],
      includedStepIds: ["independent_question_resistance", "misconception_check_wrong_operation"],
      completionCriteria: { requiredStepIds: ["independent_question_resistance"], requiredCapabilityEvidence: ["cap.ohms_law.solve_for_resistance"], masteryGateCapabilityIds: ["cap.ohms_law.solve_for_resistance"], requiresRemediationClearance: true, exitSummary: "s" },
      evidenceDigest: "digest",
    },
    learnerId,
    "t0",
    sessionKey,
  );
}

async function record(args: {
  learnerId: string;
  sessionKey: string;
  stepId: "independent_question_resistance" | "misconception_check_wrong_operation";
  blueprintId: string;
  capabilityId: string;
  correct: boolean;
  attemptIndex?: number;
  revealed?: boolean;
}) {
  return recordLessonEvidence({
    evidence: {
      assertionFamilyId: "electrical.ohms_law",
      capabilityId: args.capabilityId,
      assertionIdentifiers: ["EL-OHM-SOLVE-R-001"],
      supportingCapabilityIds: [],
      questionBlueprintId: args.blueprintId,
      generatedInstanceIdentity: { blueprintId: args.blueprintId, blueprintVersion: 1, contentRelease: REAL_RELEASE, seed: 42 },
      correct: args.correct,
      representationDependency: [],
    },
    givenAnswer: args.correct ? 6 : 999,
    session: session(args.learnerId, args.sessionKey),
    stepId: args.stepId,
    attemptIndex: args.attemptIndex ?? 1,
    answerRevealedBeforeAttempt: args.revealed ?? false,
  });
}

describe("local derived evidence snapshot (CC-07 §24)", () => {
  beforeEach(() => resetFoundationDbHandleForTests());

  it("a new learner derives an empty snapshot (NOT_ASSESSED everywhere) that never blocks teaching", async () => {
    const { derived, snapshot } = await deriveLocalLearnerEvidence(LEARNER_A);
    expect(derived.capabilities).toEqual([]);
    expect(snapshot.capabilityStatus.size).toBe(0);
    expect(snapshot.familyStatus.size).toBe(0);
  });

  it("wrong-then-retry on a real step derives honest weaker evidence against the real governed content", async () => {
    await record({ learnerId: LEARNER_A, sessionKey: "s1", stepId: "independent_question_resistance", blueprintId: "ohms_law.solve_for_resistance", capabilityId: "cap.ohms_law.solve_for_resistance", correct: false, attemptIndex: 1 });
    await record({ learnerId: LEARNER_A, sessionKey: "s1", stepId: "independent_question_resistance", blueprintId: "ohms_law.solve_for_resistance", capabilityId: "cap.ohms_law.solve_for_resistance", correct: true, attemptIndex: 2 });

    const { derived, snapshot } = await deriveLocalLearnerEvidence(LEARNER_A);
    const cap = derived.capabilities.find((c) => c.capabilityId === "cap.ohms_law.solve_for_resistance");
    expect(cap?.state).toBe("INSUFFICIENT_EVIDENCE");
    expect(cap?.counts.retrySuccesses).toBe(1);
    expect(snapshot.capabilityStatus.get("cap.ohms_law.solve_for_resistance")).toBe("INSUFFICIENT_EVIDENCE");
  });

  it("repeated independent success across two session occurrences reaches PROVISIONALLY_SECURE, and synced events still count", async () => {
    await record({ learnerId: LEARNER_A, sessionKey: "s1", stepId: "independent_question_resistance", blueprintId: "ohms_law.solve_for_resistance", capabilityId: "cap.ohms_law.solve_for_resistance", correct: true });
    await record({ learnerId: LEARNER_A, sessionKey: "s2", stepId: "independent_question_resistance", blueprintId: "ohms_law.solve_for_resistance", capabilityId: "cap.ohms_law.solve_for_resistance", correct: true });

    // Mark the first event synced -- durable local history must keep
    // contributing to derivation after upload.
    const pending = await listPendingOutboxEvents();
    await markOutboxEventSynced(pending[0]!.id);

    const { derived } = await deriveLocalLearnerEvidence(LEARNER_A);
    const cap = derived.capabilities.find((c) => c.capabilityId === "cap.ohms_law.solve_for_resistance");
    expect(cap?.state).toBe("PROVISIONALLY_SECURE");
    expect(cap?.counts.independentSuccesses).toBe(2);
  });

  it("a wrong real misconception-discrimination interaction is evidenced in the snapshot; another learner's derivation stays empty", async () => {
    await record({ learnerId: LEARNER_A, sessionKey: "s1", stepId: "misconception_check_wrong_operation", blueprintId: "ohms_law.diagnose_wrong_operation", capabilityId: "cap.ohms_law.diagnose_wrong_operation", correct: false });

    const a = await deriveLocalLearnerEvidence(LEARNER_A);
    expect(a.snapshot.misconceptionsEvidenced.has("MIS-EL-OHM-WRONG-OPERATION-001")).toBe(true);

    const b = await deriveLocalLearnerEvidence(LEARNER_B);
    expect(b.derived.capabilities).toEqual([]);
    expect(b.snapshot.misconceptionsEvidenced.size).toBe(0);
  });

  it("legacy events without a session occurrence key are excluded and reported, never guessed at", async () => {
    await enqueueOutboxEvent(
      EVIDENCE_EVENT_TYPE,
      { learnerId: LEARNER_A, instanceId: "li1_old", lessonId: REAL_LESSON, lessonVersion: 1, contentRelease: REAL_RELEASE, stepId: "independent_question_resistance", attemptIndex: 1, answerRevealedBeforeAttempt: false, recordedAt: "2026-08-01T00:00:00Z", givenAnswer: 6, evidence: { questionBlueprintId: "ohms_law.solve_for_resistance", correct: true, generatedInstanceIdentity: { blueprintId: "ohms_law.solve_for_resistance", blueprintVersion: 1, contentRelease: REAL_RELEASE, seed: 1 } } },
      LEARNER_A,
    );
    const { derived, excludedLegacyEvents } = await deriveLocalLearnerEvidence(LEARNER_A);
    expect(excludedLegacyEvents).toBe(1);
    expect(derived.capabilities).toEqual([]);
  });
});
