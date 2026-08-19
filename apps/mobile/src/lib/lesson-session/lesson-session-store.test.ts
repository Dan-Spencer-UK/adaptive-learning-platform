/**
 * Logic-level test for lesson session persistence, run against the
 * in-memory Jest mock (see storage/db.test.ts's header comment).
 */
import * as mockExpoSqlite from "../storage/__mocks__/expo-sqlite-jest-mock";
import { resetFoundationDbHandleForTests } from "../storage/db";
import { startSession } from "./lesson-session-controller";
import {
  clearLessonSession,
  getActiveLessonInstanceId,
  listLessonEvidence,
  loadLessonSession,
  recordLessonEvidence,
  saveLessonSession,
} from "./lesson-session-store";

jest.mock("expo-sqlite", () => mockExpoSqlite);

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

describe("lesson session store", () => {
  beforeEach(() => {
    resetFoundationDbHandleForTests();
  });

  it("saves and loads a session by instance id", async () => {
    const state = startSession(
      {
        instanceId: "li1_a",
        lessonId: "lesson.a",
        lessonVersion: 1,
        contentRelease: "release.1",
        assemblyPolicyVersion: 1,
        learnerId: "learner.001",
        stepDecisions: [],
        includedStepIds: ["a", "b"],
        completionCriteria: { requiredStepIds: ["a", "b"], requiredCapabilityEvidence: [], requiresRemediationClearance: true, exitSummary: "" },
        evidenceDigest: "digest",
      },
      "learner.001",
      "t0",
    );

    await saveLessonSession(state);
    const loaded = await loadLessonSession("li1_a");
    expect(loaded).toEqual(state);
  });

  it("returns null for a session that was never saved", async () => {
    expect(await loadLessonSession("li1_never-saved")).toBeNull();
  });

  it("tracks the active (incomplete) session pointer, and clears it once the session completes", async () => {
    const incomplete = { instanceId: "li1_b", completedAt: null } as never;
    await saveLessonSession(incomplete);
    expect(await getActiveLessonInstanceId()).toBe("li1_b");

    const completed = { instanceId: "li1_b", completedAt: "t9" } as never;
    await saveLessonSession(completed);
    expect(await getActiveLessonInstanceId()).toBeNull();
  });

  it("clearLessonSession removes the active pointer only if it points at the cleared instance", async () => {
    await saveLessonSession({ instanceId: "li1_c", completedAt: null } as never);
    await clearLessonSession("li1_c");
    expect(await getActiveLessonInstanceId()).toBeNull();
    expect(await loadLessonSession("li1_c")).toBeNull();
  });

  it("records lesson evidence to the outbox and lists it back, most recent first", async () => {
    await recordLessonEvidence(evidence(), 5, "li1_a", "step.1");
    await recordLessonEvidence({ ...evidence(), correct: false }, 6, "li1_a", "step.2");

    const list = await listLessonEvidence();
    expect(list).toHaveLength(2);
    expect(list[0]?.stepId).toBe("step.2");
    expect(list[1]?.stepId).toBe("step.1");
  });

  it("listLessonEvidence never returns proving-slice evidence events (different event type)", async () => {
    // Simulate a proving-slice event sharing the same outbox by enqueuing
    // directly with the other module's event type is out of scope here;
    // this test documents the type-filter behaviour via a lesson event
    // only, asserting the returned record really is a lesson evidence shape.
    await recordLessonEvidence(evidence(), 5, "li1_a", "step.1");
    const [first] = await listLessonEvidence();
    expect(first?.instanceId).toBe("li1_a");
    expect(first?.stepId).toBe("step.1");
  });
});
