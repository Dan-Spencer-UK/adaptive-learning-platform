/**
 * Session/controller-layer tests (task brief §39.C) for the orchestrator
 * tying evaluation, evidence recording, branch resolution and session
 * advancement together. Uses small synthetic LessonPlan/question-instance
 * fixtures defined locally (mirrors the discipline established in
 * @alp/learning-engine's own test-fixtures.ts: never distort real
 * governed content just to exercise a mechanism) -- run against the
 * in-memory SQLite Jest mock for the persistence half.
 */
import type { GeneratedQuestionInstance } from "@alp/calculation-engine";
import type { LessonPlan, LessonStep } from "@alp/content-schema";

import * as mockExpoSqlite from "../storage/__mocks__/expo-sqlite-jest-mock";
import { resetFoundationDbHandleForTests } from "../storage/db";
import { acknowledgeStep, submitStepAnswer } from "./lesson-controller";
import { currentStepId, isSessionComplete, startSession } from "./lesson-session-controller";
import { listLessonEvidence, loadLessonSession } from "./lesson-session-store";

jest.mock("expo-sqlite", () => mockExpoSqlite);

function buildStep(overrides: Partial<LessonStep> & Pick<LessonStep, "id" | "type">): LessonStep {
  return {
    purpose: "test",
    requirement: "required",
    teaches: [],
    reinforces: [],
    tests: [],
    capabilityIds: [],
    misconceptionTargets: [],
    representation: {},
    presentation: { interactionRequired: true, answerReveal: "after_submission", contentMayScroll: false, progressiveReveal: false },
    scaffoldingLevel: "standard",
    cognitiveDemand: "introductory",
    feedback: { mode: "immediate", explainWhy: true },
    completionCondition: "correct_answer_required",
    branchRoutes: [],
    evidenceEmitted: [],
    ...overrides,
  };
}

const MISCONCEPTION_CHECK: LessonStep = buildStep({
  id: "misconception_check",
  type: "misconception_discrimination",
  questionBlueprintId: "qb.diagnose",
  branchRoutes: [
    { trigger: "misconception_detected", misconceptionIdentifier: "MIS-TEST-001", destinationStepId: "remediation", description: "route" },
  ],
});
const REMEDIATION: LessonStep = buildStep({
  id: "remediation",
  type: "remediation",
  requirement: "conditional_remediation_only",
  questionBlueprintId: "qb.remediate",
  branchRoutes: [{ trigger: "remediation_cleared", destinationStepId: "transfer", description: "resume" }],
});
const NEXT_QUESTION: LessonStep = buildStep({ id: "next_question", type: "independent_question", questionBlueprintId: "qb.next" });
const TRANSFER: LessonStep = buildStep({ id: "transfer", type: "transfer_application", questionBlueprintId: "qb.transfer" });
const ACKNOWLEDGE_ONLY: LessonStep = buildStep({ id: "intro", type: "orientation", completionCondition: "view_acknowledged", presentation: { interactionRequired: false, answerReveal: "not_applicable", contentMayScroll: false, progressiveReveal: false } });

const LESSON: LessonPlan = {
  id: "lesson.test.controller",
  schemaVersion: 1,
  version: 1,
  title: "Test lesson",
  learnerFacingDescription: "test",
  curriculumUnit: "test",
  prerequisiteKnowledge: [],
  targetAssertionFamilyIds: ["test.family"],
  remediationEligibility: [],
  targetAssertionIdentifiers: [],
  targetCapabilityIds: ["cap.test"],
  estimatedDurationMinutes: 5,
  instructionalStrategy: "test",
  steps: [ACKNOWLEDGE_ONLY, MISCONCEPTION_CHECK, NEXT_QUESTION, TRANSFER],
  misconceptionTargets: [],
  retrievalTags: [],
  completionCriteria: { requiredStepIds: ["intro", "misconception_check", "next_question", "transfer"], requiredCapabilityEvidence: ["cap.test"], requiresRemediationClearance: true, exitSummary: "done" },
  presentationModes: ["learn"],
  contentRelease: "release.test",
};

/** LESSON_WITH_REMEDIATION mirrors LESSON but includes the conditional remediation step for the remediation-cleared round trip. */
const LESSON_WITH_REMEDIATION: LessonPlan = { ...LESSON, steps: [ACKNOWLEDGE_ONLY, MISCONCEPTION_CHECK, REMEDIATION, NEXT_QUESTION, TRANSFER] };

function questionInstance(overrides: Partial<GeneratedQuestionInstance> = {}): GeneratedQuestionInstance {
  return {
    identity: { blueprintId: "qb.test", blueprintVersion: 1, contentRelease: "release.test", seed: 1 },
    assertionFamilyId: "test.family",
    capabilityId: "cap.test",
    title: "Test question",
    parameters: {},
    representation: {},
    expected: { answer: { type: "multiple_choice" }, value: "correct" },
    marking: { type: "exact" },
    evidence: {
      primaryCapabilityId: "cap.test",
      familyId: "test.family",
      assertionIdentifiers: ["ASSERT-TEST-001"],
      supportingCapabilityIds: [],
      representationDependency: [],
      misconceptionTargets: [],
    },
    ...overrides,
  };
}

describe("acknowledgeStep", () => {
  beforeEach(() => resetFoundationDbHandleForTests());

  it("advances a view_acknowledged step regardless of any answer", async () => {
    const state = startSession(
      { instanceId: "li1_ack", lessonId: LESSON.id, lessonVersion: 1, contentRelease: LESSON.contentRelease, assemblyPolicyVersion: 1, learnerId: "learner.1", stepDecisions: [], includedStepIds: ["intro", "misconception_check"], completionCriteria: LESSON.completionCriteria, evidenceDigest: "d" },
      "learner.1",
      "t0",
      "sess-test",
    );
    const next = await acknowledgeStep({ state, now: () => "t1" });
    expect(currentStepId(next)).toBe("misconception_check");
  });
});

describe("submitStepAnswer -- correct_answer_required gating", () => {
  beforeEach(() => resetFoundationDbHandleForTests());

  function startAt(stepId: string, includedStepIds: readonly string[], lesson: LessonPlan = LESSON) {
    const full = startSession(
      { instanceId: "li1_x", lessonId: lesson.id, lessonVersion: 1, contentRelease: lesson.contentRelease, assemblyPolicyVersion: 1, learnerId: "learner.1", stepDecisions: [], includedStepIds, completionCriteria: lesson.completionCriteria, evidenceDigest: "d" },
      "learner.1",
      "t0",
      "sess-test",
    );
    const index = includedStepIds.indexOf(stepId);
    return { ...full, currentIndex: index };
  }

  it("holds position on an incorrect answer with no detected misconception, but still records evidence", async () => {
    const state = startAt("next_question", ["next_question", "transfer"]);
    const result = await submitStepAnswer({
      lesson: LESSON,
      state,
      questionInstance: questionInstance({ evidence: { ...questionInstance().evidence, misconceptionTargets: [] } }),
      given: "wrong",
    });
    expect(result.evaluation.correct).toBe(false);
    expect(result.advanced).toBe(false);
    expect(currentStepId(result.nextState)).toBe("next_question");
    expect(await listLessonEvidence("learner.1")).toHaveLength(1);
  });

  it("advances on a correct answer", async () => {
    const state = startAt("next_question", ["next_question", "transfer"]);
    const result = await submitStepAnswer({ lesson: LESSON, state, questionInstance: questionInstance(), given: "correct", now: () => "t1" });
    expect(result.evaluation.correct).toBe(true);
    expect(result.advanced).toBe(true);
    expect(currentStepId(result.nextState)).toBe("transfer");
  });

  it("routes to remediation on a misconception-evidenced wrong answer, even though the step is correct_answer_required", async () => {
    const state = startAt("misconception_check", ["intro", "misconception_check", "next_question", "transfer"], LESSON_WITH_REMEDIATION);
    const result = await submitStepAnswer({
      lesson: LESSON_WITH_REMEDIATION,
      state,
      questionInstance: questionInstance({
        evidence: { ...questionInstance().evidence, misconceptionTargets: [{ misconceptionIdentifier: "MIS-TEST-001", evidenceStrength: "direct" }] },
      }),
      given: "wrong",
      now: () => "t1",
    });
    expect(result.evaluation.correct).toBe(false);
    expect(result.evaluation.misconceptionIdentifier).toBe("MIS-TEST-001");
    expect(result.advanced).toBe(true);
    expect(currentStepId(result.nextState)).toBe("remediation");
    expect(result.nextState.stepSequence).toContain("remediation");
  });

  it("a plain wrong answer on the misconception-check step (no misconception evidenced) holds position instead of routing", async () => {
    const state = startAt("misconception_check", ["intro", "misconception_check", "next_question", "transfer"], LESSON_WITH_REMEDIATION);
    const result = await submitStepAnswer({
      lesson: LESSON_WITH_REMEDIATION,
      state,
      questionInstance: questionInstance({ evidence: { ...questionInstance().evidence, misconceptionTargets: [] } }),
      given: "wrong",
    });
    expect(result.advanced).toBe(false);
    expect(currentStepId(result.nextState)).toBe("misconception_check");
  });

  it("clearing remediation (correct answer on a conditional_remediation_only step) jumps to the governed resume destination", async () => {
    const state = startAt("remediation", ["intro", "misconception_check", "remediation", "next_question", "transfer"], LESSON_WITH_REMEDIATION);
    const result = await submitStepAnswer({ lesson: LESSON_WITH_REMEDIATION, state, questionInstance: questionInstance(), given: "correct", now: () => "t1" });
    expect(result.advanced).toBe(true);
    expect(currentStepId(result.nextState)).toBe("transfer");
  });

  it("a wrong answer on the remediation step itself does not clear it -- holds position", async () => {
    const state = startAt("remediation", ["intro", "misconception_check", "remediation", "next_question", "transfer"], LESSON_WITH_REMEDIATION);
    const result = await submitStepAnswer({
      lesson: LESSON_WITH_REMEDIATION,
      state,
      questionInstance: questionInstance({ evidence: { ...questionInstance().evidence, misconceptionTargets: [] } }),
      given: "wrong",
    });
    expect(result.advanced).toBe(false);
    expect(currentStepId(result.nextState)).toBe("remediation");
  });

  it("reaching the final step and answering correctly marks the session complete", async () => {
    const state = startAt("transfer", ["next_question", "transfer"]);
    const result = await submitStepAnswer({ lesson: LESSON, state, questionInstance: questionInstance(), given: "correct", now: () => "t9" });
    expect(isSessionComplete(result.nextState)).toBe(true);
  });
});

describe("submitStepAnswer -- retry/reveal evidence integrity (CC-06D, Correction G)", () => {
  beforeEach(() => resetFoundationDbHandleForTests());

  function startAt(stepId: string, includedStepIds: readonly string[]) {
    const full = startSession(
      { instanceId: "li1_retry", lessonId: LESSON.id, lessonVersion: 1, contentRelease: LESSON.contentRelease, assemblyPolicyVersion: 1, learnerId: "learner.1", stepDecisions: [], includedStepIds, completionCriteria: LESSON.completionCriteria, evidenceDigest: "d" },
      "learner.1",
      "t0",
      "sess-test",
    );
    return { ...full, currentIndex: includedStepIds.indexOf(stepId) };
  }

  const plainWrongInstance = () => questionInstance({ evidence: { ...questionInstance().evidence, misconceptionTargets: [] } });

  it("does NOT reveal the correct answer while a retry of the same question is pending", async () => {
    const state = startAt("next_question", ["next_question", "transfer"]);
    const result = await submitStepAnswer({ lesson: LESSON, state, questionInstance: plainWrongInstance(), given: "wrong" });
    expect(result.advanced).toBe(false);
    expect(result.revealCorrectAnswer).toBe(false);
  });

  it("reveals the correct answer once the step advances (correct answer, or misconception branch)", async () => {
    const state = startAt("next_question", ["next_question", "transfer"]);
    const correct = await submitStepAnswer({ lesson: LESSON, state, questionInstance: questionInstance(), given: "correct" });
    expect(correct.revealCorrectAnswer).toBe(true);
  });

  it("assigns deterministic attempt indices: first attempt 1, retry 2 -- and both are recorded on evidence", async () => {
    const state = startAt("next_question", ["next_question", "transfer"]);
    const first = await submitStepAnswer({ lesson: LESSON, state, questionInstance: plainWrongInstance(), given: "wrong" });
    expect(first.attemptIndex).toBe(1);

    const second = await submitStepAnswer({ lesson: LESSON, state: first.nextState, questionInstance: questionInstance(), given: "correct" });
    expect(second.attemptIndex).toBe(2);

    const evidenceList = await listLessonEvidence("learner.1");
    expect(evidenceList).toHaveLength(2);
    const [latest, earliest] = evidenceList;
    expect(earliest?.attemptIndex).toBe(1);
    expect(earliest?.evidence.correct).toBe(false);
    expect(latest?.attemptIndex).toBe(2);
    expect(latest?.evidence.correct).toBe(true);
    // The retried correct answer is distinguishable from an untouched
    // first attempt: attemptIndex > 1, and the answer was never revealed
    // before it was given.
    expect(latest?.answerRevealedBeforeAttempt).toBe(false);
  });

  it("persists attempt counts even when position holds, so a restored session continues the same attempt sequence", async () => {
    const state = startAt("next_question", ["next_question", "transfer"]);
    const first = await submitStepAnswer({ lesson: LESSON, state, questionInstance: plainWrongInstance(), given: "wrong" });
    expect(first.nextState.attemptCounts["next_question"]).toBe(1);
    const restored = await loadLessonSession("li1_retry", "learner.1");
    expect(restored?.attemptCounts["next_question"]).toBe(1);
  });

  it("marks answerRevealedBeforeAttempt on evidence when the answer HAD been revealed for that step (reveal state is recorded, not assumed)", async () => {
    // Force the recorded-reveal path: a misconception branch reveals the
    // answer while advancing to remediation; if any future flow ever
    // re-submits the same step, the evidence must carry the reveal flag.
    const state = startAt("misconception_check", ["intro", "misconception_check", "next_question", "transfer"]);
    const branched = await submitStepAnswer({
      lesson: LESSON_WITH_REMEDIATION,
      state,
      questionInstance: questionInstance({
        evidence: { ...questionInstance().evidence, misconceptionTargets: [{ misconceptionIdentifier: "MIS-TEST-001", evidenceStrength: "direct" }] },
      }),
      given: "wrong",
    });
    expect(branched.revealCorrectAnswer).toBe(true);
    expect(branched.nextState.revealedAnswerStepIds).toContain("misconception_check");

    // Hypothetical re-submission on the revealed step is tagged.
    const resubmitted = await submitStepAnswer({
      lesson: LESSON_WITH_REMEDIATION,
      state: { ...branched.nextState, currentIndex: branched.nextState.stepSequence.indexOf("misconception_check") },
      questionInstance: questionInstance(),
      given: "correct",
    });
    const evidenceList = await listLessonEvidence("learner.1");
    expect(resubmitted.attemptIndex).toBe(2);
    expect(evidenceList[0]?.answerRevealedBeforeAttempt).toBe(true);
  });
});
