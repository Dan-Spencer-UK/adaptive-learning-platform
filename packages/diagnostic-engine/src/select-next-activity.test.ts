/**
 * SYNTHETIC unit tests for selectNextActivity's own mechanism.
 * Deliberately does NOT import scripts/content/data (established repo
 * convention -- an engine package's own tests never import governed
 * content; the real-content proof lives in
 * scripts/content/prove-course-orchestration.ts). These fixtures exist
 * purely to exercise the orchestration MECHANISM in isolation.
 */
import { describe, expect, it } from "vitest";
import type { LessonCompletionCriteria, LessonPlan, LessonStep, RemediationEligibility } from "@alp/content-schema";
import type { LearnerEvidenceSnapshot, MasteryState } from "@alp/learning-engine";
import { AmbiguousPrerequisiteCandidatesError } from "@alp/learning-engine";

import { selectNextActivity } from "./select-next-activity.ts";
import type { CourseDefinition } from "./types.ts";

function step(overrides: Partial<LessonStep> & Pick<LessonStep, "id" | "type">): LessonStep {
  return {
    purpose: "synthetic fixture step",
    requirement: "required",
    teaches: [],
    reinforces: [],
    tests: [],
    capabilityIds: [],
    misconceptionTargets: [],
    representation: {},
    presentation: { interactionRequired: false, answerReveal: "not_applicable", contentMayScroll: false, progressiveReveal: false },
    scaffoldingLevel: "standard",
    cognitiveDemand: "introductory",
    feedback: { mode: "immediate", explainWhy: true },
    completionCondition: "view_acknowledged",
    branchRoutes: [],
    evidenceEmitted: [],
    ...overrides,
  };
}

function completion(requiredCapabilityEvidence: string[], masteryGateCapabilityIds: string[]): LessonCompletionCriteria {
  return {
    requiredStepIds: ["start", "end"],
    requiredCapabilityEvidence,
    masteryGateCapabilityIds,
    requiresRemediationClearance: true,
    exitSummary: "synthetic fixture completion summary",
  };
}

function lesson(
  id: string,
  overrides: Partial<LessonPlan> & {
    readonly requiredCapabilityEvidence: string[];
    /** Defaults to the same as requiredCapabilityEvidence when omitted -- most fixtures don't care about the completion/mastery-gate distinction. */
    readonly masteryGateCapabilityIds?: string[];
    readonly prerequisiteKnowledge?: string[];
    readonly remediationEligibility?: RemediationEligibility[];
    readonly contentRelease?: string;
  },
): LessonPlan {
  return {
    id,
    schemaVersion: 1,
    version: 1,
    title: `Synthetic ${id}`,
    learnerFacingDescription: "synthetic fixture lesson",
    curriculumUnit: "synthetic.fixtures",
    prerequisiteKnowledge: overrides.prerequisiteKnowledge ?? [],
    targetAssertionFamilyIds: ["synthetic.family.target"],
    targetAssertionIdentifiers: [],
    targetCapabilityIds: overrides.requiredCapabilityEvidence,
    remediationEligibility: overrides.remediationEligibility ?? [],
    estimatedDurationMinutes: 10,
    instructionalStrategy: "synthetic fixture strategy",
    steps: [step({ id: "start", type: "orientation" }), step({ id: "end", type: "exit_completion" })],
    misconceptionTargets: [],
    retrievalTags: [],
    completionCriteria: completion(overrides.requiredCapabilityEvidence, overrides.masteryGateCapabilityIds ?? overrides.requiredCapabilityEvidence),
    presentationModes: ["learn"],
    contentRelease: overrides.contentRelease ?? "synthetic.release.1",
  };
}

function snapshot(overrides: Partial<LearnerEvidenceSnapshot> = {}): LearnerEvidenceSnapshot {
  return {
    learnerId: "learner.synthetic",
    capabilityStatus: new Map(),
    familyStatus: new Map(),
    misconceptionsEvidenced: new Set(),
    retrievalDueTags: new Set(),
    retrievalDueCapabilityIds: new Set(),
    ...overrides,
  };
}

// Two vocational nodes (V1 depends on foundational family F, V2 depends on nothing),
// one remediation lesson (R) eligible for F.
const V1 = lesson("lesson.v1", { requiredCapabilityEvidence: ["cap.v1"], prerequisiteKnowledge: ["family.f"] });
const V2 = lesson("lesson.v2", { requiredCapabilityEvidence: ["cap.v2"] });
const R = lesson("lesson.remediation", {
  requiredCapabilityEvidence: ["cap.remediation"],
  remediationEligibility: [{ assertionFamilyId: "family.f", isDefaultRemediation: true }],
});

const COURSE: CourseDefinition = {
  id: "course.synthetic",
  schemaVersion: 1,
  contentRelease: "synthetic.release.1",
  nodes: [
    { id: "node.v1", lessonId: V1.id, sequence: 1 },
    { id: "node.v2", lessonId: V2.id, sequence: 2 },
  ],
};

function select(args: {
  readonly snap?: LearnerEvidenceSnapshot;
  readonly recentCompletionContext?: { lessonId: string; lessonInstanceId: string };
  readonly allLessons?: readonly LessonPlan[];
  readonly course?: CourseDefinition;
}) {
  return selectNextActivity({
    courseDefinition: args.course ?? COURSE,
    learnerEvidenceSnapshot: args.snap ?? snapshot(),
    recentCompletionContext: args.recentCompletionContext,
    availableContent: { allLessons: args.allLessons ?? [V1, V2, R] },
    policyVersion: 1,
  });
}

describe("selectNextActivity", () => {
  it("[C] no evidence => START_TARGET at the first course node", () => {
    const d = select({});
    expect(d.decisionType).toBe("START_TARGET");
    expect(d.lessonId).toBe(V1.id);
    expect(d.reason).toBe("course_entry_no_evidence");
  });

  it("[N/M] an unrelated weak family (not this target's prerequisite) does not hijack the route, and family status (never capability status) drives the check", () => {
    const d = select({ snap: snapshot({ familyStatus: new Map([["some.unrelated.family", "WEAK"]]) }) });
    expect(d.decisionType).toBe("START_TARGET");
  });

  it("[D] WEAK prerequisite family => REMEDIATE_FOUNDATION resolved to the real default remediation lesson", () => {
    const d = select({ snap: snapshot({ familyStatus: new Map([["family.f", "WEAK"]]) }) });
    expect(d.decisionType).toBe("REMEDIATE_FOUNDATION");
    expect(d.lessonId).toBe(R.id);
    expect(d.reason).toBe("prerequisite_family_weak");
    expect(d.evidenceBasis.assertionFamilyId).toBe("family.f");
  });

  it("[E] CONFLICTING prerequisite family => REMEDIATE_FOUNDATION (a deterministic safe route, same mechanism as WEAK)", () => {
    const d = select({ snap: snapshot({ familyStatus: new Map([["family.f", "CONFLICTING"]]) }) });
    expect(d.decisionType).toBe("REMEDIATE_FOUNDATION");
    expect(d.reason).toBe("prerequisite_family_conflicting");
  });

  it("[F] INSUFFICIENT_EVIDENCE/EMERGING/NOT_ASSESSED prerequisite status never falsely implies mastery-gate remediation", () => {
    for (const status of ["NOT_ASSESSED", "INSUFFICIENT_EVIDENCE", "EMERGING"] as MasteryState[]) {
      const d = select({ snap: snapshot({ familyStatus: new Map([["family.f", status]]) }) });
      expect(d.decisionType).not.toBe("REMEDIATE_FOUNDATION");
    }
  });

  it("[G] remediation completion alone does not clear weakness: still WEAK after visiting the remediation lesson => RETEST_FOUNDATION, not RETURN_TO_VOCATIONAL_TRANSFER", () => {
    const d = select({
      snap: snapshot({ familyStatus: new Map([["family.f", "WEAK"]]) }),
      recentCompletionContext: { lessonId: R.id, lessonInstanceId: "instance.1" },
    });
    expect(d.decisionType).toBe("RETEST_FOUNDATION");
    expect(d.lessonId).toBe(R.id);
    expect(d.reason).toBe("remediation_attempted_evidence_still_insufficient");
  });

  it("[H] sufficient foundational evidence (family no longer WEAK/CONFLICTING) after visiting remediation => RETURN_TO_VOCATIONAL_TRANSFER", () => {
    const d = select({
      snap: snapshot({ familyStatus: new Map([["family.f", "EMERGING"]]) }),
      recentCompletionContext: { lessonId: R.id, lessonInstanceId: "instance.1" },
    });
    expect(d.decisionType).toBe("RETURN_TO_VOCATIONAL_TRANSFER");
    expect(d.lessonId).toBe(V1.id);
    expect(d.reason).toBe("prerequisite_cleared_return_to_transfer");
  });

  it("[I] vocational transfer requirement respected: cleared prerequisite with no completion context yet still routes to the target, never straight to ADVANCE", () => {
    const d = select({ snap: snapshot({ familyStatus: new Map([["family.f", "PROVISIONALLY_SECURE"]]) }) });
    expect(d.decisionType).toBe("START_TARGET");
    expect(d.lessonId).toBe(V1.id);
  });

  it("[J] mastery-gate capability secure (TRANSFER_SECURE) => ADVANCE to the next course node", () => {
    const d = select({ snap: snapshot({ capabilityStatus: new Map([["cap.v1", "TRANSFER_SECURE"]]) }) });
    expect(d.decisionType).toBe("ADVANCE");
    expect(d.lessonId).toBe(V2.id);
    expect(d.reason).toBe("target_capabilities_mastered_advance");
  });

  describe("CC-08A: mastery-gate advancement integrity", () => {
    // Node with TWO mastery gates (gate + secondary) plus one non-gate
    // supporting capability that is completion-required but never a
    // mastery gate (mirrors the real Ohm's Law/series/parallel content:
    // a guided-only capability listed for completion but excluded from
    // masteryGateCapabilityIds).
    const twoGateTarget = lesson("lesson.two-gate", {
      requiredCapabilityEvidence: ["cap.gate", "cap.secondary-gate", "cap.supporting"],
      masteryGateCapabilityIds: ["cap.gate", "cap.secondary-gate"],
    });
    // A second course node follows the two-gate node so that clearing its
    // mastery gates has somewhere to ADVANCE to -- a single-node course
    // would correctly resolve to COMPLETE_SLICE instead, which is a
    // different (also-tested-elsewhere) decision, not what these
    // advancement-integrity proofs are isolating.
    const course: CourseDefinition = { ...COURSE, nodes: [{ id: "node.two-gate", lessonId: twoGateTarget.id, sequence: 1 }, { id: "node.v2", lessonId: V2.id, sequence: 2 }] };
    const selectTwoGate = (capabilityStatus: Map<string, MasteryState>) =>
      select({ snap: snapshot({ capabilityStatus }), allLessons: [twoGateTarget, V2], course });

    it("[A] all mastery gates secure (one TRANSFER_SECURE, one PROVISIONALLY_SECURE) + supporting capability with mere evidence => ADVANCE", () => {
      const d = selectTwoGate(
        new Map([
          ["cap.gate", "TRANSFER_SECURE"],
          ["cap.secondary-gate", "PROVISIONALLY_SECURE"],
          ["cap.supporting", "EMERGING"],
        ]),
      );
      expect(d.decisionType).toBe("ADVANCE");
    });

    it("[B] a required mastery gate WEAK => MUST NOT ADVANCE, even though the other gate is TRANSFER_SECURE", () => {
      const d = selectTwoGate(
        new Map([
          ["cap.gate", "TRANSFER_SECURE"],
          ["cap.secondary-gate", "WEAK"],
        ]),
      );
      expect(d.decisionType).not.toBe("ADVANCE");
    });

    it("[C] a required mastery gate CONFLICTING => MUST NOT ADVANCE", () => {
      const d = selectTwoGate(
        new Map([
          ["cap.gate", "TRANSFER_SECURE"],
          ["cap.secondary-gate", "CONFLICTING"],
        ]),
      );
      expect(d.decisionType).not.toBe("ADVANCE");
    });

    it("[D] a required mastery gate INSUFFICIENT_EVIDENCE => MUST NOT ADVANCE", () => {
      const d = selectTwoGate(
        new Map([
          ["cap.gate", "TRANSFER_SECURE"],
          ["cap.secondary-gate", "INSUFFICIENT_EVIDENCE"],
        ]),
      );
      expect(d.decisionType).not.toBe("ADVANCE");
    });

    it("[E] a non-gate supporting capability that can never become secure does not block advancement -- only declared mastery gates are checked", () => {
      const d = selectTwoGate(
        new Map([
          ["cap.gate", "PROVISIONALLY_SECURE"],
          ["cap.secondary-gate", "PROVISIONALLY_SECURE"],
          // cap.supporting deliberately left NOT_ASSESSED/absent -- it is
          // completion-required (requiredCapabilityEvidence) but not a
          // mastery gate, so its absence must never block ADVANCE.
        ]),
      );
      expect(d.decisionType).toBe("ADVANCE");
    });

    it("[F] one TRANSFER_SECURE mastery gate cannot mask another required mastery gate being WEAK", () => {
      const d = selectTwoGate(
        new Map([
          ["cap.gate", "TRANSFER_SECURE"],
          ["cap.secondary-gate", "WEAK"],
          ["cap.supporting", "TRANSFER_SECURE"],
        ]),
      );
      expect(d.decisionType).not.toBe("ADVANCE");
    });

    it("[G] no evidence anywhere => does not advance (START_TARGET instead)", () => {
      const d = selectTwoGate(new Map());
      expect(d.decisionType).toBe("START_TARGET");
    });

    it("[H] genuine satisfying evidence across every governed mastery gate => advances deterministically", () => {
      const d = selectTwoGate(
        new Map([
          ["cap.gate", "PROVISIONALLY_SECURE"],
          ["cap.secondary-gate", "TRANSFER_SECURE"],
          ["cap.supporting", "WEAK"],
        ]),
      );
      expect(d.decisionType).toBe("ADVANCE");
    });

    it("[I] input (Map) ordering does not affect the mastery-gate result", () => {
      const a = new Map<string, MasteryState>([
        ["cap.gate", "TRANSFER_SECURE"],
        ["cap.secondary-gate", "PROVISIONALLY_SECURE"],
      ]);
      const b = new Map<string, MasteryState>([
        ["cap.secondary-gate", "PROVISIONALLY_SECURE"],
        ["cap.gate", "TRANSFER_SECURE"],
      ]);
      expect(selectTwoGate(a)).toEqual(selectTwoGate(b));
    });

    it("[J] same state/policy/content => identical decision", () => {
      const status = new Map<string, MasteryState>([["cap.gate", "WEAK"], ["cap.secondary-gate", "TRANSFER_SECURE"]]);
      expect(selectTwoGate(status)).toEqual(selectTwoGate(status));
    });

    it("PROVISIONALLY_SECURE on every mastery gate is sufficient -- the governed MASTERED_STATES threshold, not an invented stricter one", () => {
      const d = selectTwoGate(new Map([["cap.gate", "PROVISIONALLY_SECURE"], ["cap.secondary-gate", "PROVISIONALLY_SECURE"]]));
      expect(d.decisionType).toBe("ADVANCE");
    });
  });

  describe("CC-08A: release-scoped lesson resolution", () => {
    it("a course only ever resolves lessons declaring its own contentRelease, never a same-id lesson from a different release", () => {
      const v1Lesson = lesson("lesson.shared", { requiredCapabilityEvidence: ["cap.shared"], contentRelease: "release.a" });
      const v2Lesson = lesson("lesson.shared", { requiredCapabilityEvidence: ["cap.shared"], contentRelease: "release.b" });
      const courseA: CourseDefinition = { id: "course.a", schemaVersion: 1, contentRelease: "release.a", nodes: [{ id: "node.shared", lessonId: "lesson.shared", sequence: 1 }] };
      const courseB: CourseDefinition = { id: "course.b", schemaVersion: 1, contentRelease: "release.b", nodes: [{ id: "node.shared", lessonId: "lesson.shared", sequence: 1 }] };
      const both = [v1Lesson, v2Lesson];

      const decisionA = select({ course: courseA, allLessons: both });
      const decisionB = select({ course: courseB, allLessons: both });
      // Both resolve successfully (no UnknownCourseActivityError) and
      // independently -- neither release "sees" the other's member.
      expect(decisionA.decisionType).toBe("START_TARGET");
      expect(decisionB.decisionType).toBe("START_TARGET");
      expect(decisionA.lessonId).toBe("lesson.shared");
      expect(decisionB.lessonId).toBe("lesson.shared");
    });

    it("no first/default release fallback: a lesson that only exists under a DIFFERENT release than the course declares fails explicitly", () => {
      const wrongReleaseLesson = lesson("lesson.only-elsewhere", { requiredCapabilityEvidence: ["cap.x"], contentRelease: "release.other" });
      const course: CourseDefinition = { id: "course.strict", schemaVersion: 1, contentRelease: "release.expected", nodes: [{ id: "node.x", lessonId: "lesson.only-elsewhere", sequence: 1 }] };
      expect(() => select({ course, allLessons: [wrongReleaseLesson] })).toThrow(/Unknown course activity/);
    });
  });

  it("last node mastered => COMPLETE_SLICE with no lessonId", () => {
    const d = select({
      snap: snapshot({ capabilityStatus: new Map([["cap.v1", "TRANSFER_SECURE"], ["cap.v2", "TRANSFER_SECURE"]]) }),
    });
    expect(d.decisionType).toBe("COMPLETE_SLICE");
    expect(d.lessonId).toBeUndefined();
  });

  it("some but not all target capability evidence => CONTINUE_TARGET, not START_TARGET", () => {
    const twoCapTarget = lesson("lesson.v1b", { requiredCapabilityEvidence: ["cap.a", "cap.b"] });
    const course: CourseDefinition = { ...COURSE, nodes: [{ id: "node.v1b", lessonId: twoCapTarget.id, sequence: 1 }] };
    const d = select({
      snap: snapshot({ capabilityStatus: new Map([["cap.a", "EMERGING"]]) }),
      allLessons: [twoCapTarget],
      course,
    });
    expect(d.decisionType).toBe("CONTINUE_TARGET");
    expect(d.lessonId).toBe(twoCapTarget.id);
  });

  it("[K] unknown course-node lesson id fails explicitly", () => {
    const course: CourseDefinition = { ...COURSE, nodes: [{ id: "node.ghost", lessonId: "lesson.does-not-exist", sequence: 1 }] };
    expect(() => select({ course })).toThrow(/Unknown course activity/);
  });

  it("[L] ambiguous remediation candidates (two eligible, no unique default) fails explicitly rather than guessing", () => {
    const r2 = lesson("lesson.remediation-2", {
      requiredCapabilityEvidence: ["cap.remediation2"],
      remediationEligibility: [{ assertionFamilyId: "family.f", isDefaultRemediation: false }],
    });
    const ambiguousR = lesson("lesson.remediation", {
      requiredCapabilityEvidence: ["cap.remediation"],
      remediationEligibility: [{ assertionFamilyId: "family.f", isDefaultRemediation: false }],
    });
    expect(() =>
      select({ snap: snapshot({ familyStatus: new Map([["family.f", "WEAK"]]) }), allLessons: [V1, V2, ambiguousR, r2] }),
    ).toThrow(AmbiguousPrerequisiteCandidatesError);
  });

  it("zero remediation candidates for a weak family => BLOCKED, never silently proceeding", () => {
    const d = select({ snap: snapshot({ familyStatus: new Map([["family.f", "WEAK"]]) }), allLessons: [V1, V2] });
    expect(d.decisionType).toBe("BLOCKED");
    expect(d.reason).toBe("no_eligible_remediation_candidate");
  });

  it("[O/P] misconceptionsEvidenced never influences the decision, however populated -- named-misconception evidence cannot trigger course-level routing on its own", () => {
    const withMisconception = select({ snap: snapshot({ misconceptionsEvidenced: new Set(["MIS-SOME-DIRECT-MISCONCEPTION-001"]) }) });
    const without = select({ snap: snapshot() });
    expect(withMisconception).toEqual(without);
  });

  it("[Q] course position (which node) and mastery state (family/capability maps) remain structurally distinct -- no blended progress score in the decision", () => {
    const d = select({ snap: snapshot({ capabilityStatus: new Map([["cap.v1", "TRANSFER_SECURE"]]) }) });
    expect(d).not.toHaveProperty("progressPercent");
    expect(d).not.toHaveProperty("score");
    expect(d.evidenceBasis.courseNodeId).toBe("node.v2");
  });

  it("[A] same inputs => identical decision (determinism)", () => {
    const snap = snapshot({ familyStatus: new Map([["family.f", "WEAK"]]) });
    const first = select({ snap });
    const second = select({ snap });
    expect(first).toEqual(second);
  });

  it("[B] input (Map) ordering does not affect the decision", () => {
    const a = new Map<string, MasteryState>([["family.f", "WEAK"], ["family.g", "EMERGING"]]);
    const b = new Map<string, MasteryState>([["family.g", "EMERGING"], ["family.f", "WEAK"]]);
    const first = select({ snap: snapshot({ familyStatus: a }) });
    const second = select({ snap: snapshot({ familyStatus: b }) });
    expect(first).toEqual(second);
  });
});
