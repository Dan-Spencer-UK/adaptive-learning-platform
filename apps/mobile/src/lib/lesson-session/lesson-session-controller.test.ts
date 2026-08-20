import type { LessonInstance } from "@alp/learning-engine";
import { advanceSession, currentStepId, isSessionComplete, sessionProgress, startSession } from "./lesson-session-controller";

function instance(overrides: Partial<LessonInstance> = {}): LessonInstance {
  return {
    instanceId: "li1_test",
    lessonId: "lesson.test",
    lessonVersion: 1,
    contentRelease: "release.1",
    assemblyPolicyVersion: 1,
    learnerId: "learner.001",
    stepDecisions: [],
    includedStepIds: ["a", "b", "c"],
    completionCriteria: { requiredStepIds: ["a", "b", "c"], requiredCapabilityEvidence: ["cap.x"], requiresRemediationClearance: true, exitSummary: "done" },
    evidenceDigest: "digest",
    ...overrides,
  };
}

describe("startSession", () => {
  it("begins at index 0 with no completed steps and an unset completedAt", () => {
    const state = startSession(instance(), "learner.001", "2026-01-01T00:00:00.000Z", "sess-test");
    expect(currentStepId(state)).toBe("a");
    expect(state.completedStepIds).toEqual([]);
    expect(state.completedAt).toBeNull();
    expect(isSessionComplete(state)).toBe(false);
  });

  it("carries the instance's identity fields through unchanged", () => {
    const state = startSession(instance(), "learner.001", "2026-01-01T00:00:00.000Z", "sess-test");
    expect(state.instanceId).toBe("li1_test");
    expect(state.lessonId).toBe("lesson.test");
    expect(state.contentRelease).toBe("release.1");
  });
});

describe("advanceSession -- linear progression", () => {
  it("moves to the next step and records the completed one", () => {
    const state = startSession(instance(), "learner.001", "t0", "sess-test");
    const next = advanceSession(state, "t1");
    expect(currentStepId(next)).toBe("b");
    expect(next.completedStepIds).toEqual(["a"]);
  });

  it("reaching the end of the sequence marks the session complete", () => {
    let state = startSession(instance(), "learner.001", "t0", "sess-test");
    state = advanceSession(state, "t1"); // a -> b
    state = advanceSession(state, "t2"); // b -> c
    state = advanceSession(state, "t3"); // c -> end
    expect(isSessionComplete(state)).toBe(true);
    expect(state.completedStepIds).toEqual(["a", "b", "c"]);
    expect(state.completedAt).toBe("t3");
  });

  it("is a no-op once the session is already complete", () => {
    let state = startSession(instance({ includedStepIds: ["a"] }), "learner.001", "t0", "sess-test");
    state = advanceSession(state, "t1");
    expect(isSessionComplete(state)).toBe(true);
    const again = advanceSession(state, "t2");
    expect(again).toEqual(state);
  });

  it("never duplicates a step id in completedStepIds even if advanced from the same position twice", () => {
    // Defensive: advanceSession is idempotent-safe against being called
    // twice for the same current step (e.g. a rapid double-tap upstream
    // that the UI layer failed to guard).
    const state = startSession(instance(), "learner.001", "t0", "sess-test");
    const once = advanceSession(state, "t1");
    expect(once.completedStepIds).toEqual(["a"]);
  });
});

describe("advanceSession -- within-session branch jumps", () => {
  it("inserts a not-yet-present branch destination immediately after the current position (new remediation step)", () => {
    const state = startSession(instance({ includedStepIds: ["a", "b", "c"] }), "learner.001", "t0", "sess-test");
    const next = advanceSession(state, "t1", "remediation_x");
    expect(next.stepSequence).toEqual(["a", "remediation_x", "b", "c"]);
    expect(currentStepId(next)).toBe("remediation_x");
    expect(next.completedStepIds).toEqual(["a"]);
  });

  it("jumps directly to an already-present branch destination without duplicating it", () => {
    const state = startSession(instance({ includedStepIds: ["a", "b", "c", "d"] }), "learner.001", "t0", "sess-test");
    const next = advanceSession(state, "t1", "d");
    expect(next.stepSequence).toEqual(["a", "b", "c", "d"]);
    expect(currentStepId(next)).toBe("d");
  });

  it("a governed misconception-then-remediation-then-cleared round trip lands back on an already-included step", () => {
    let state = startSession(instance({ includedStepIds: ["check", "next_question", "transfer"] }), "learner.001", "t0", "sess-test");
    // misconception detected on "check" -> jump to (new) "remediation"
    state = advanceSession(state, "t1", "remediation");
    expect(currentStepId(state)).toBe("remediation");
    // remediation cleared -> jump to "transfer" (already in the sequence)
    state = advanceSession(state, "t2", "transfer");
    expect(currentStepId(state)).toBe("transfer");
    expect(state.stepSequence).toEqual(["check", "remediation", "next_question", "transfer"]);
    expect(state.completedStepIds).toEqual(["check", "remediation"]);
  });
});

describe("sessionProgress", () => {
  it("reports completed/total against the current (possibly branch-grown) stepSequence length", () => {
    let state = startSession(instance({ includedStepIds: ["a", "b"] }), "learner.001", "t0", "sess-test");
    expect(sessionProgress(state)).toEqual({ completed: 0, total: 2 });
    state = advanceSession(state, "t1", "remediation_x");
    expect(sessionProgress(state)).toEqual({ completed: 1, total: 3 });
  });
});
