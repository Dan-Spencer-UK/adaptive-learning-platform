/**
 * Multi-lesson genericity proof (CC-06D §20/§21): the last-mile content
 * registry no longer assumes one lesson. Two lessons sharing one
 * release are both discoverable by stable identity, dependency manifests
 * are computable for both, resolution chooses exactly the requested one,
 * and unknown identity fails explicitly -- never a first/default lesson.
 *
 * The two-lesson projection here is a SYNTHETIC test fixture (the real
 * bundled release currently has one lesson); it is deliberately not
 * fake product content.
 */
import { computeLessonContentDependencies } from "@alp/learning-engine";
import type { LessonPlan, LessonStep, MobileContentProjection } from "@alp/content-schema";

import { MOBILE_CONTENT_PROJECTION } from "./generated/mobile-content-projection";
import {
  bundledContentReleaseId,
  getLocalLesson,
  getLocalLessonFrom,
  getLocalReleaseLessonsFrom,
  getQuestionBlueprintFrom,
  UnknownLessonError,
} from "./local-content-registry";

const SYNTH_RELEASE = "release.synthetic-registry-test.v1";

function step(id: string, overrides: Partial<LessonStep> = {}): LessonStep {
  return {
    id,
    type: "exit_completion",
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

function lesson(id: string): LessonPlan {
  return {
    id,
    schemaVersion: 1,
    version: 1,
    title: `Synthetic lesson ${id}`,
    learnerFacingDescription: "Synthetic registry-test lesson.",
    curriculumUnit: "synthetic.fixtures",
    prerequisiteKnowledge: [],
    targetAssertionFamilyIds: ["synth.family"],
    targetAssertionIdentifiers: [],
    targetCapabilityIds: ["cap.synth.core"],
    remediationEligibility: [],
    estimatedDurationMinutes: 5,
    instructionalStrategy: "synthetic",
    steps: [step("only_step")],
    misconceptionTargets: [],
    retrievalTags: [],
    completionCriteria: { requiredStepIds: ["only_step"], requiredCapabilityEvidence: ["cap.synth.core"], requiresRemediationClearance: true, exitSummary: "done" },
    presentationModes: ["learn"],
    contentRelease: SYNTH_RELEASE,
  };
}

const twoLessonProjection: MobileContentProjection = {
  schemaVersion: 2,
  contentRelease: { id: SYNTH_RELEASE, questionBlueprintVersion: 1 },
  lessons: [lesson("lesson.synth.alpha"), lesson("lesson.synth.beta")],
  assertionFamilies: [{ id: "synth.family", requiredCapabilityIds: ["cap.synth.core"], assessmentRequirement: "assessable" }],
  questionBlueprints: [],
  formulaFamilies: [],
  workedExampleBlueprints: [],
  visualAidBlueprints: [],
  diagramBlueprints: [],
  assertionStatements: {},
  misconceptionDescriptions: {},
};

describe("local content registry -- multi-lesson genericity (CC-06D §20)", () => {
  it("two lessons share one release and both resolve by their own stable identity", () => {
    const alpha = getLocalLessonFrom(twoLessonProjection, { lessonId: "lesson.synth.alpha", contentRelease: SYNTH_RELEASE });
    const beta = getLocalLessonFrom(twoLessonProjection, { lessonId: "lesson.synth.beta", contentRelease: SYNTH_RELEASE });
    expect(alpha.lesson.id).toBe("lesson.synth.alpha");
    expect(beta.lesson.id).toBe("lesson.synth.beta");
    expect(alpha.contentRelease).toBe(SYNTH_RELEASE);
    expect(beta.contentRelease).toBe(SYNTH_RELEASE);
  });

  it("both lessons can generate dependency manifests", () => {
    for (const l of getLocalReleaseLessonsFrom(twoLessonProjection, SYNTH_RELEASE)) {
      const manifest = computeLessonContentDependencies(l);
      expect(manifest.lessonId).toBe(l.id);
      expect(manifest.contentRelease).toBe(SYNTH_RELEASE);
    }
  });

  it("resolution returns exactly the requested lesson, never the first one", () => {
    const beta = getLocalLessonFrom(twoLessonProjection, { lessonId: "lesson.synth.beta", contentRelease: SYNTH_RELEASE });
    expect(beta.lesson.id).not.toBe(twoLessonProjection.lessons[0]!.id);
  });

  it("an unknown lesson id fails explicitly -- no first/default lesson fallback", () => {
    expect(() => getLocalLessonFrom(twoLessonProjection, { lessonId: "lesson.synth.gamma", contentRelease: SYNTH_RELEASE })).toThrow(UnknownLessonError);
  });

  it("a release mismatch fails explicitly, never cross-resolving", () => {
    expect(() => getLocalLessonFrom(twoLessonProjection, { lessonId: "lesson.synth.alpha", contentRelease: "release.other.v9" })).toThrow(UnknownLessonError);
  });

  it("a version mismatch fails explicitly", () => {
    expect(() => getLocalLessonFrom(twoLessonProjection, { lessonId: "lesson.synth.alpha", contentRelease: SYNTH_RELEASE, version: 2 })).toThrow(UnknownLessonError);
  });
});

describe("local content registry -- real bundled projection", () => {
  it("resolves the real Ohm's Law lesson by identity from the generated projection", () => {
    const record = getLocalLesson({ lessonId: "lesson.electrical.ohms-law", contentRelease: bundledContentReleaseId() });
    expect(record.lesson.id).toBe("lesson.electrical.ohms-law");
    expect(record.contentRelease).toBe("release.unit202.v1");
    expect(record.questionBlueprintVersion).toBe(1);
    // CC-08: the lookup carries the whole bundled release's question
    // blueprints (23, across all four real lessons), not just this one
    // lesson's own 8 -- getLocalLesson's `lookup` is release-scoped.
    expect(record.lookup.questionBlueprints).toHaveLength(23);
  });

  it("the generated projection records its release identity, and every lesson in it matches that release", () => {
    expect(MOBILE_CONTENT_PROJECTION.contentRelease.id).toBe("release.unit202.v1");
    for (const l of MOBILE_CONTENT_PROJECTION.lessons) {
      expect(l.contentRelease).toBe(MOBILE_CONTENT_PROJECTION.contentRelease.id);
    }
  });

  it("an unknown lesson id fails explicitly against the real projection too", () => {
    expect(() => getLocalLesson({ lessonId: "lesson.does.not.exist", contentRelease: bundledContentReleaseId() })).toThrow(UnknownLessonError);
  });

  it("an unknown question blueprint fails explicitly", () => {
    expect(() => getQuestionBlueprintFrom(MOBILE_CONTENT_PROJECTION, "nope.blueprint")).toThrow(UnknownLessonError);
  });
});
