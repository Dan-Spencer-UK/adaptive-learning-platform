/**
 * SYNTHETIC test-only fixtures for this package's own unit tests.
 *
 * Established repo convention (packages/learning-engine/src/
 * test-fixtures.ts, packages/calculation-engine/src/families/
 * new-families.test.ts): an engine package's own tests never import
 * scripts/content/data -- real-content proof lives in
 * scripts/content/prove-evidence-derivation.ts. These fixtures exist to
 * exercise every policy MECHANISM (eligibility tiers, reveal discounting,
 * retry distinction, transfer recognition, conflict, misconception
 * discrimination bases) in isolation.
 */

import type { LessonPlan, LessonStep, QuestionBlueprint } from "@alp/content-schema";

import type { EvidenceAssertionFamilyContext, EvidenceContentContext, LearnerAttemptRecord } from "./types.ts";

export const SYNTH_RELEASE = "synthetic-evidence-release.1";
export const SYNTH_LESSON_ID = "lesson.synth.evidence";
export const SYNTH_LEARNER = "learner-1";

export const CAP_A = "cap.synth.a";
export const CAP_B = "cap.synth.b";
export const CAP_DIAG = "cap.synth.diagnose";
export const CAP_BIN = "cap.synth.binary";
export const CAP_MCQ3 = "cap.synth.mcq3";
export const CAP_SUPPORTING = "cap.synth.supporting";

export const FAMILY_TARGET = "synthfam.target";
export const FAMILY_UNKNOWN = "synthfam.not_in_context";

export const MIS_SUGGESTIVE = "MIS-SYNTH-SUGGESTIVE-001";
export const MIS_DIRECT_CLASSIFY = "MIS-SYNTH-CLASSIFY-001";
export const MIS_DIRECT_BINARY = "MIS-SYNTH-BINARY-001";
export const MIS_DIRECT_MCQ3 = "MIS-SYNTH-MCQ3-001";

function blueprint(args: {
  readonly id: string;
  readonly capabilityId: string;
  readonly familyId: string;
  readonly answer: QuestionBlueprint["answer"];
  readonly misconceptionTargets?: QuestionBlueprint["evidence"]["misconceptionTargets"];
  readonly supportingCapabilityIds?: readonly string[];
}): QuestionBlueprint {
  return {
    id: args.id,
    assertionFamilyId: args.familyId,
    capabilityId: args.capabilityId,
    title: `Synthetic blueprint ${args.id}`,
    representation: {},
    variantDimensions: {},
    parameterGenerators: [],
    answer: args.answer,
    marking: { type: args.answer.type === "quantity" ? "numeric_tolerance" : "exact", ...(args.answer.type === "quantity" ? { tolerancePercent: 1 } : {}) },
    evidence: {
      primaryCapabilityId: args.capabilityId,
      familyId: args.familyId,
      assertionIdentifiers: ["SYNTH-ASSERTION-001"],
      supportingCapabilityIds: [...(args.supportingCapabilityIds ?? [])],
      representationDependency: [],
      misconceptionTargets: [...(args.misconceptionTargets ?? [])],
    },
    difficultyBand: "intermediate",
  };
}

/** Numeric instrument that merely DECLARES a suggestive misconception target -- a wrong answer here must stay generic incorrect evidence. */
export const BP_CALC_A = blueprint({
  id: "bp.synth.calc_a",
  capabilityId: CAP_A,
  familyId: FAMILY_TARGET,
  answer: { type: "quantity", quantity: "voltage", canonicalUnit: "volt" },
  misconceptionTargets: [{ misconceptionIdentifier: MIS_SUGGESTIVE, evidenceStrength: "suggestive" }],
  supportingCapabilityIds: [CAP_SUPPORTING],
});

export const BP_TRANSFER_A = blueprint({
  id: "bp.synth.transfer_a",
  capabilityId: CAP_A,
  familyId: FAMILY_TARGET,
  answer: { type: "quantity", quantity: "voltage", canonicalUnit: "volt" },
});

export const BP_CALC_B = blueprint({
  id: "bp.synth.calc_b",
  capabilityId: CAP_B,
  familyId: FAMILY_TARGET,
  answer: { type: "quantity", quantity: "current", canonicalUnit: "ampere" },
});

/** Explicit governed error-classification instrument with a direct-strength target -- CAN discriminate its misconception. */
export const BP_CLASSIFY = blueprint({
  id: "bp.synth.classify",
  capabilityId: CAP_DIAG,
  familyId: FAMILY_TARGET,
  answer: { type: "worked_error_classification", options: ["wrong_operation", "rearrangement_error", "no_error"] },
  misconceptionTargets: [{ misconceptionIdentifier: MIS_DIRECT_CLASSIFY, evidenceStrength: "direct" }],
});

/** Two-option discriminator with a direct-strength target -- the sole wrong option IS the misconception distractor. */
export const BP_BINARY = blueprint({
  id: "bp.synth.binary",
  capabilityId: CAP_BIN,
  familyId: FAMILY_TARGET,
  answer: { type: "multiple_choice", options: ["series", "parallel"] },
  misconceptionTargets: [{ misconceptionIdentifier: MIS_DIRECT_BINARY, evidenceStrength: "direct" }],
});

/** THREE-option multiple choice declaring a direct target: NOT an admissible discriminator under policy v1 (a wrong answer is not necessarily the misconception option) -- must stay generic. */
export const BP_MCQ3 = blueprint({
  id: "bp.synth.mcq3",
  capabilityId: CAP_MCQ3,
  familyId: FAMILY_TARGET,
  answer: { type: "multiple_choice", options: ["red", "green", "blue"] },
  misconceptionTargets: [{ misconceptionIdentifier: MIS_DIRECT_MCQ3, evidenceStrength: "direct" }],
});

/** Instrument whose governed family is deliberately absent from the context's family list (unknown completeness). */
export const BP_UNKNOWN_FAMILY = blueprint({
  id: "bp.synth.unknown_family",
  capabilityId: "cap.synth.unknown_family_member",
  familyId: FAMILY_UNKNOWN,
  answer: { type: "quantity", quantity: "resistance", canonicalUnit: "ohm" },
});

function step(args: {
  readonly id: string;
  readonly type: LessonStep["type"];
  readonly scaffoldingLevel: LessonStep["scaffoldingLevel"];
  readonly questionBlueprintId: string;
}): LessonStep {
  return {
    id: args.id,
    type: args.type,
    purpose: "synthetic fixture step",
    requirement: "required",
    teaches: [],
    reinforces: [],
    tests: [],
    capabilityIds: [],
    misconceptionTargets: [],
    representation: {},
    questionBlueprintId: args.questionBlueprintId,
    presentation: { interactionRequired: true, interactionRole: "calculate", answerReveal: "after_submission", contentMayScroll: false, progressiveReveal: false },
    scaffoldingLevel: args.scaffoldingLevel,
    cognitiveDemand: "intermediate",
    feedback: { mode: "immediate", explainWhy: true },
    completionCondition: "answer_submitted",
    branchRoutes: [],
    evidenceEmitted: [],
  };
}

export const STEP_GUIDED_A = "step.guided.a";
export const STEP_INDEPENDENT_A1 = "step.independent.a1";
export const STEP_INDEPENDENT_A2 = "step.independent.a2";
export const STEP_INDEPENDENT_A3 = "step.independent.a3";
export const STEP_INDEPENDENT_A4 = "step.independent.a4";
export const STEP_TRANSFER_A = "step.transfer.a";
export const STEP_INDEPENDENT_B1 = "step.independent.b1";
export const STEP_INDEPENDENT_B2 = "step.independent.b2";
export const STEP_CLASSIFY = "step.classify";
export const STEP_BINARY = "step.binary";
export const STEP_MCQ3 = "step.mcq3";
export const STEP_UNKNOWN_FAMILY = "step.unknown_family";

export const SYNTH_LESSON: LessonPlan = {
  id: SYNTH_LESSON_ID,
  schemaVersion: 1,
  version: 1,
  title: "Synthetic evidence lesson",
  learnerFacingDescription: "Synthetic evidence-engine fixture lesson.",
  curriculumUnit: "synthetic.fixtures",
  prerequisiteKnowledge: [],
  targetAssertionFamilyIds: [FAMILY_TARGET],
  targetAssertionIdentifiers: [],
  targetCapabilityIds: [CAP_A, CAP_B],
  remediationEligibility: [],
  estimatedDurationMinutes: 10,
  instructionalStrategy: "synthetic fixture strategy",
  steps: [
    step({ id: STEP_GUIDED_A, type: "guided_interaction", scaffoldingLevel: "guided", questionBlueprintId: BP_CALC_A.id }),
    step({ id: STEP_INDEPENDENT_A1, type: "independent_question", scaffoldingLevel: "independent", questionBlueprintId: BP_CALC_A.id }),
    step({ id: STEP_INDEPENDENT_A2, type: "independent_question", scaffoldingLevel: "standard", questionBlueprintId: BP_CALC_A.id }),
    step({ id: STEP_INDEPENDENT_A3, type: "independent_question", scaffoldingLevel: "independent", questionBlueprintId: BP_CALC_A.id }),
    step({ id: STEP_INDEPENDENT_A4, type: "independent_question", scaffoldingLevel: "independent", questionBlueprintId: BP_CALC_A.id }),
    step({ id: STEP_TRANSFER_A, type: "transfer_application", scaffoldingLevel: "independent", questionBlueprintId: BP_TRANSFER_A.id }),
    step({ id: STEP_INDEPENDENT_B1, type: "independent_question", scaffoldingLevel: "independent", questionBlueprintId: BP_CALC_B.id }),
    step({ id: STEP_INDEPENDENT_B2, type: "independent_question", scaffoldingLevel: "independent", questionBlueprintId: BP_CALC_B.id }),
    step({ id: STEP_CLASSIFY, type: "misconception_discrimination", scaffoldingLevel: "standard", questionBlueprintId: BP_CLASSIFY.id }),
    step({ id: STEP_BINARY, type: "misconception_discrimination", scaffoldingLevel: "standard", questionBlueprintId: BP_BINARY.id }),
    step({ id: STEP_MCQ3, type: "independent_question", scaffoldingLevel: "standard", questionBlueprintId: BP_MCQ3.id }),
    step({ id: STEP_UNKNOWN_FAMILY, type: "independent_question", scaffoldingLevel: "independent", questionBlueprintId: BP_UNKNOWN_FAMILY.id }),
  ],
  misconceptionTargets: [],
  retrievalTags: [],
  completionCriteria: {
    requiredStepIds: [STEP_INDEPENDENT_A1],
    requiredCapabilityEvidence: [CAP_A],
    requiresRemediationClearance: true,
    exitSummary: "synthetic fixture completion summary",
  },
  presentationModes: ["learn"],
  contentRelease: SYNTH_RELEASE,
};

export const SYNTH_FAMILIES: readonly EvidenceAssertionFamilyContext[] = [
  { id: FAMILY_TARGET, requiredCapabilityIds: [CAP_A, CAP_B] },
];

export const SYNTH_CONTENT: EvidenceContentContext = {
  lessons: [SYNTH_LESSON],
  questionBlueprints: [BP_CALC_A, BP_TRANSFER_A, BP_CALC_B, BP_CLASSIFY, BP_BINARY, BP_MCQ3, BP_UNKNOWN_FAMILY],
  assertionFamilies: SYNTH_FAMILIES,
};

let attemptCounter = 0;

/** Builds one attempt; `recordedAt` defaults to a strictly increasing deterministic clock so authored order is chronological unless a test overrides it. */
export function attempt(
  args: Pick<LearnerAttemptRecord, "stepId" | "correct"> & Partial<LearnerAttemptRecord>,
): LearnerAttemptRecord {
  attemptCounter += 1;
  const stepBlueprint = SYNTH_LESSON.steps.find((s) => s.id === args.stepId)?.questionBlueprintId;
  return {
    learnerId: SYNTH_LEARNER,
    instanceId: "inst-1",
    sessionKey: "sess-1",
    lessonId: SYNTH_LESSON_ID,
    lessonVersion: 1,
    contentRelease: SYNTH_RELEASE,
    attemptIndex: 1,
    answerRevealedBeforeAttempt: false,
    questionBlueprintId: stepBlueprint ?? "bp.synth.calc_a",
    recordedAt: `2026-08-20T10:${String(Math.floor(attemptCounter / 60)).padStart(2, "0")}:${String(attemptCounter % 60).padStart(2, "0")}Z`,
    ...args,
  };
}

export function resetAttemptClock(): void {
  attemptCounter = 0;
}
