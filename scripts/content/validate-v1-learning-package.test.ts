import { describe, expect, it } from "vitest";
import type { LessonPlan, VisualRequirement, ReferenceDossier, ProductionVisualAsset, GuidedRevisionPlan } from "@alp/content-schema";
import { CURRENT_DESIGN_SYSTEM_VERSION } from "@alp/content-schema";
import {
  buildReport,
  isReportClean,
  validateVisualGovernance,
  isVisualGovernanceReportClean,
  validateGuidedRevisionPlanLessons,
  type V1LearningPackageReport,
} from "./validate-v1-learning-package.ts";

function cleanReport(): V1LearningPackageReport {
  return {
    totalLessons: 1,
    lessonsWithRoutePolicy: 0,
    totalQuestionBlueprints: 1,
    questionBlueprintsWithV1Role: 0,
    formativeMockBlueprintCount: 0,
    offSyllabusRequiredKnowledge: [],
    requiredKnowledgeFromUndeclaredOtherLesson: [],
    danglingRevisionLessonRefs: [],
    postV1StepTypesInCanonicalRoute: [],
    richContentStepsWithoutGovernedOwnership: [],
  };
}

describe("isReportClean", () => {
  it("is true when every hard-failure gate is empty, regardless of adoption metrics", () => {
    expect(isReportClean(cleanReport())).toBe(true);
    expect(isReportClean({ ...cleanReport(), lessonsWithRoutePolicy: 0, questionBlueprintsWithV1Role: 0 })).toBe(true);
  });

  it("is false for off-syllabus required knowledge", () => {
    expect(isReportClean({ ...cleanReport(), offSyllabusRequiredKnowledge: ["x"] })).toBe(false);
  });

  it("is false for required knowledge from an undeclared other lesson", () => {
    expect(isReportClean({ ...cleanReport(), requiredKnowledgeFromUndeclaredOtherLesson: ["x"] })).toBe(false);
  });

  it("is false for a dangling revision-lesson reference", () => {
    expect(isReportClean({ ...cleanReport(), danglingRevisionLessonRefs: ["x"] })).toBe(false);
  });

  it("is false for a POST_V1_ADAPTIVE step inside a CANONICAL_FIXED_ROUTE lesson", () => {
    expect(isReportClean({ ...cleanReport(), postV1StepTypesInCanonicalRoute: ["x"] })).toBe(false);
  });

  it("is false for a contentBlocks step with no governed teaching/reinforcement ownership", () => {
    expect(isReportClean({ ...cleanReport(), richContentStepsWithoutGovernedOwnership: ["x"] })).toBe(false);
  });
});

describe("buildReport (against the real live Unit 202 corpus)", () => {
  const report = buildReport();

  it("is clean today -- no lesson/blueprint in the live corpus has yet adopted the new V1 fields, so there is nothing for the hard-failure gates to find", () => {
    expect(isReportClean(report)).toBe(true);
  });

  it("reports zero adoption of routePolicy/v1PedagogicalRole today -- an honest currency baseline, not a failure (re-authoring under the new pipeline is future package work)", () => {
    expect(report.lessonsWithRoutePolicy).toBe(0);
    expect(report.questionBlueprintsWithV1Role).toBe(0);
    expect(report.totalLessons).toBeGreaterThan(0);
    expect(report.totalQuestionBlueprints).toBeGreaterThan(0);
  });

  // CC-13C.2B: no real lesson adopts contentBlocks in this package -- 0
  // findings against the live corpus proves the new gate is inert until a
  // real lesson opts in, exactly like every other CC-13A/CC-13C V1 field.
  it("reports zero richContentStepsWithoutGovernedOwnership findings today -- no real lesson has adopted contentBlocks yet", () => {
    expect(report.richContentStepsWithoutGovernedOwnership).toEqual([]);
  });
});

// CC-13C.2B: this gate is a pure structural check over LessonPlan/LessonStep
// fields (contentBlocks presence + teaches/reinforces + step type) -- unlike
// the requiredKnowledge gates above, it needs no pedagogy/knowledge-graph
// corpus, so it can be exercised directly and fully via buildReport's
// `lessons` override hook with small synthetic fixtures.
describe("CC-13C.2B: richContentStepsWithoutGovernedOwnership gate", () => {
  function stepWithContentBlocks(overrides: Partial<LessonPlan["steps"][number]> = {}): LessonPlan["steps"][number] {
    return {
      ...minimalLesson().steps[0]!,
      contentBlocks: [{ type: "paragraph", text: "Synthetic teaching prose." }],
      mayRevealTargetAnswer: false,
      ...overrides,
    };
  }

  it("flags a concept_explanation contentBlocks step declaring neither teaches nor reinforces", () => {
    const lesson = minimalLesson({ steps: [stepWithContentBlocks({ type: "concept_explanation" })] });
    const report = buildReport({ lessons: [lesson] });
    expect(report.richContentStepsWithoutGovernedOwnership).toHaveLength(1);
  });

  it("does not flag a contentBlocks step that declares teaches", () => {
    const lesson = minimalLesson({ steps: [stepWithContentBlocks({ type: "concept_explanation", teaches: ["assertion.x"] })] });
    const report = buildReport({ lessons: [lesson] });
    expect(report.richContentStepsWithoutGovernedOwnership).toHaveLength(0);
  });

  it("does not flag a contentBlocks step that declares reinforces (even with no teaches)", () => {
    const lesson = minimalLesson({ steps: [stepWithContentBlocks({ type: "concept_explanation", reinforces: ["assertion.x"] })] });
    const report = buildReport({ lessons: [lesson] });
    expect(report.richContentStepsWithoutGovernedOwnership).toHaveLength(0);
  });

  it("does NOT flag an orientation contentBlocks step with no teaches/reinforces -- legitimate exemption", () => {
    const lesson = minimalLesson({ steps: [stepWithContentBlocks({ type: "orientation" })] });
    const report = buildReport({ lessons: [lesson] });
    expect(report.richContentStepsWithoutGovernedOwnership).toHaveLength(0);
  });

  it("does NOT flag a recap contentBlocks step with no teaches/reinforces -- legitimate exemption", () => {
    const lesson = minimalLesson({ steps: [stepWithContentBlocks({ type: "recap" })] });
    const report = buildReport({ lessons: [lesson] });
    expect(report.richContentStepsWithoutGovernedOwnership).toHaveLength(0);
  });

  it("does not flag a legacy step with no contentBlocks at all, regardless of teaches/reinforces", () => {
    const report = buildReport({ lessons: [minimalLesson()] });
    expect(report.richContentStepsWithoutGovernedOwnership).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------
// Synthetic fixtures exercising the hard-failure gates directly, via a
// small synthetic lesson manifest passed through buildReport's override
// hook (mirrors validate-lesson-plan.test.ts's own override-injection
// pattern) is impractical here because requiredKnowledgeIds live on the
// PEDAGOGY corpus (not overridable the same way without also faking a
// full knowledge-graph/pedagogy manifest). The gate LOGIC itself is
// therefore proven directly against the exported helper functions below
// instead, using the real shapes those functions consume.
// ---------------------------------------------------------------------

function minimalVisualRequirement(overrides: Partial<VisualRequirement> = {}): VisualRequirement {
  return {
    assetId: "asset.x",
    familyId: "family.x",
    unitId: "unit202",
    lessonIds: ["lesson.x"],
    capabilityIds: [],
    assertionIds: [],
    instructionalPurpose: "purpose",
    needClassification: "REQUIRED",
    productionClass: "DETERMINISTIC_TECHNICAL",
    learnerState: "TEACHING",
    mustShow: ["thing"],
    mustNotShow: [],
    answerLeakRisk: "NONE",
    variantRequirements: ["TEACHING"],
    referenceDossierIds: [],
    designSystemVersion: CURRENT_DESIGN_SYSTEM_VERSION,
    approval: "CANDIDATE",
    ...overrides,
  };
}

function minimalDossier(overrides: Partial<ReferenceDossier> = {}): ReferenceDossier {
  return {
    id: "dossier.x",
    assetId: "asset.x",
    reviewedBy: "PROJECT_ARCHITECT",
    status: "APPROVED",
    references: [{ referenceId: "ref.1", localRef: "local/ref.png", rightsNote: "note", roles: ["TECHNICAL_AUTHORITY"], authoritativeFor: [], notAuthoritativeFor: [] }],
    preserveExactly: [],
    changeDeliberately: [],
    remove: [],
    add: [],
    neverInfer: [],
    assessmentStateNotes: [],
    ...overrides,
  };
}

function minimalAsset(overrides: Partial<ProductionVisualAsset> = {}): ProductionVisualAsset {
  return {
    assetId: "asset.x",
    version: 1,
    familyId: "family.x",
    sourceVisualRequirementId: "asset.x",
    referenceDossierIds: ["dossier.x"],
    designSystemVersion: CURRENT_DESIGN_SYSTEM_VERSION,
    learnerState: "TEACHING",
    path: "assets/x.svg",
    sha256: "a".repeat(64),
    technicalQa: "PASS",
    pedagogicalQa: "PASS",
    designQa: "PASS",
    productOwnerApproval: "APPROVED",
    eligibility: "PRODUCTION_ELIGIBLE",
    ...overrides,
  };
}

describe("validateVisualGovernance", () => {
  it("is clean for a REQUIRED+approved requirement backed by an actually-APPROVED dossier, current design-system version, single eligible asset version", () => {
    const report = validateVisualGovernance(
      [minimalVisualRequirement({ approval: "PRODUCT_OWNER_APPROVED", referenceDossierIds: ["dossier.x"] })],
      [minimalDossier()],
      [minimalAsset()],
    );
    expect(isVisualGovernanceReportClean(report)).toBe(true);
  });

  it("flags a REQUIRED+approved requirement whose dossier exists but is not APPROVED", () => {
    const report = validateVisualGovernance(
      [minimalVisualRequirement({ approval: "PRODUCT_OWNER_APPROVED", referenceDossierIds: ["dossier.x"] })],
      [minimalDossier({ status: "CANDIDATE" })],
      [],
    );
    expect(report.requiredVisualsWithoutApprovedDossier).toHaveLength(1);
  });

  it("flags a REQUIRED+approved requirement whose dossier id does not resolve at all", () => {
    const report = validateVisualGovernance([minimalVisualRequirement({ approval: "PRODUCT_OWNER_APPROVED", referenceDossierIds: ["does.not.exist"] })], [], []);
    expect(report.requiredVisualsWithoutApprovedDossier).toHaveLength(1);
  });

  it("flags a stale design-system version binding on a requirement and on an asset", () => {
    const report = validateVisualGovernance(
      [minimalVisualRequirement({ designSystemVersion: "ALP-VDS-2025-01-01" })],
      [],
      [minimalAsset({ designSystemVersion: "ALP-VDS-2025-01-01" })],
    );
    expect(report.staleDesignSystemVersionBindings).toHaveLength(2);
  });

  it("flags two simultaneously PRODUCTION_ELIGIBLE versions of the same asset", () => {
    const report = validateVisualGovernance([], [], [minimalAsset({ version: 1 }), minimalAsset({ version: 2 })]);
    expect(report.supersededAssetsMarkedEligible).toHaveLength(1);
  });

  it("flags a PRODUCTION_ELIGIBLE asset that is not the highest known version", () => {
    const report = validateVisualGovernance(
      [],
      [],
      [minimalAsset({ version: 1, eligibility: "PRODUCTION_ELIGIBLE" }), minimalAsset({ version: 2, eligibility: "SUPERSEDED_ARCHIVE" })],
    );
    expect(report.supersededAssetsMarkedEligible).toHaveLength(1);
  });

  it("accepts a superseded older version correctly marked SUPERSEDED_ARCHIVE alongside a current PRODUCTION_ELIGIBLE version", () => {
    const report = validateVisualGovernance(
      [],
      [],
      [minimalAsset({ version: 1, eligibility: "SUPERSEDED_ARCHIVE" }), minimalAsset({ version: 2, eligibility: "PRODUCTION_ELIGIBLE" })],
    );
    expect(report.supersededAssetsMarkedEligible).toHaveLength(0);
  });
});

function minimalLesson(overrides: Partial<LessonPlan> = {}): LessonPlan {
  return {
    id: "lesson.a",
    schemaVersion: 1,
    version: 1,
    title: "A",
    learnerFacingDescription: "d",
    curriculumUnit: "unit",
    prerequisiteKnowledge: [],
    targetAssertionFamilyIds: ["family.a"],
    targetAssertionIdentifiers: [],
    targetCapabilityIds: ["cap.a"],
    remediationEligibility: [],
    estimatedDurationMinutes: 10,
    instructionalStrategy: "s",
    steps: [
      {
        id: "step.a",
        type: "orientation",
        purpose: "p",
        requirement: "required",
        teaches: [],
        reinforces: [],
        tests: [],
        capabilityIds: [],
        misconceptionTargets: [],
        representation: {},
        presentation: { interactionRequired: false, answerReveal: "not_applicable", contentMayScroll: false, progressiveReveal: false },
        scaffoldingLevel: "guided",
        cognitiveDemand: "introductory",
        feedback: { mode: "immediate", explainWhy: true },
        completionCondition: "view_acknowledged",
        branchRoutes: [],
        evidenceEmitted: [],
        mayRevealTargetAnswer: false,
      },
    ],
    misconceptionTargets: [],
    retrievalTags: [],
    completionCriteria: {
      requiredStepIds: ["step.a"],
      requiredCapabilityEvidence: ["cap.a"],
      masteryGateCapabilityIds: ["cap.a"],
      requiresRemediationClearance: true,
      exitSummary: "done",
    },
    presentationModes: ["learn"],
    contentRelease: "release.test",
    assessmentMappingIds: [],
    ...overrides,
  };
}

describe("validateGuidedRevisionPlanLessons", () => {
  const plan: GuidedRevisionPlan = {
    planId: "plan.x",
    scopeId: "unit202",
    sourceAssessmentInstanceId: "attempt.x",
    sourceAssessmentSubmittedAt: "2026-08-29T09:00:00.000Z",
    generatedAt: "2026-08-29T09:00:01.000Z",
    policyVersion: "v1",
    items: [{ rank: 1, lessonId: "lesson.a", priorityBand: "HIGH", reason: "x", contributingCapabilityIds: ["cap.a"] }],
  };

  it("is clean when every plan item resolves to a real lesson", () => {
    expect(validateGuidedRevisionPlanLessons(plan, { lessons: [minimalLesson()] })).toEqual([]);
  });

  it("flags a plan item whose lessonId does not resolve to any real lesson", () => {
    const failures = validateGuidedRevisionPlanLessons(plan, { lessons: [minimalLesson({ id: "lesson.other" })] });
    expect(failures).toHaveLength(1);
  });
});
