/**
 * SYNTHETIC test-only fixtures for this package's own unit tests.
 *
 * Deliberately does NOT import scripts/content/data/lesson-ohms-law.ts
 * or any other real governed content -- established repo convention
 * (see packages/calculation-engine/src/families/new-families.test.ts's
 * header comment) is that an engine package's own tests never import
 * scripts/content/data (content -> engine only, never the reverse); a
 * separate proof script under scripts/content/ is responsible for
 * proving this engine against real governed content. These fixtures
 * exist purely to exercise engine MECHANISMS (skip-if-mastered,
 * prerequisite 0/1/many-candidate resolution, retrieval participation)
 * that the real Ohm's Law lesson does not happen to exercise -- they
 * are not, and must never be mistaken for, real production content.
 */

import type { LessonCompletionCriteria, LessonPlan, LessonStep } from "@alp/content-schema";

export function buildStep(overrides: Partial<LessonStep> & Pick<LessonStep, "id" | "type">): LessonStep {
  return {
    purpose: "synthetic fixture step",
    requirement: "required",
    teaches: [],
    reinforces: [],
    tests: [],
    capabilityIds: [],
    misconceptionTargets: [],
    representation: {},
    presentation: {
      interactionRequired: false,
      answerReveal: "not_applicable",
      contentMayScroll: false,
      progressiveReveal: false,
    },
    scaffoldingLevel: "standard",
    cognitiveDemand: "introductory",
    feedback: { mode: "immediate", explainWhy: true },
    completionCondition: "view_acknowledged",
    branchRoutes: [],
    evidenceEmitted: [],
    ...overrides,
  };
}

function buildCompletionCriteria(overrides: Partial<LessonCompletionCriteria> & Pick<LessonCompletionCriteria, "requiredStepIds" | "requiredCapabilityEvidence">): LessonCompletionCriteria {
  return {
    requiresRemediationClearance: true,
    exitSummary: "synthetic fixture completion summary",
    ...overrides,
  };
}

export function buildLesson(overrides: Partial<LessonPlan> & Pick<LessonPlan, "id" | "steps" | "completionCriteria" | "targetAssertionFamilyIds" | "targetCapabilityIds">): LessonPlan {
  return {
    schemaVersion: 1,
    version: 1,
    title: "Synthetic fixture lesson",
    learnerFacingDescription: "Synthetic fixture lesson for engine unit tests.",
    curriculumUnit: "synthetic.fixtures",
    prerequisiteKnowledge: [],
    targetAssertionIdentifiers: [],
    estimatedDurationMinutes: 10,
    instructionalStrategy: "synthetic fixture strategy",
    misconceptionTargets: [],
    retrievalTags: [],
    presentationModes: ["learn"],
    contentRelease: "synthetic-content-release.1",
    ...overrides,
  };
}

/**
 * A minimal, otherwise-empty lesson -- used as a prerequisite/remediation
 * candidate where the test only cares about resolution, not its content.
 */
export function buildMinimalLesson(id: string, overrides: Partial<LessonPlan> = {}): LessonPlan {
  return buildLesson({
    id,
    steps: [buildStep({ id: "start", type: "orientation" }), buildStep({ id: "end", type: "exit_completion" })],
    completionCriteria: buildCompletionCriteria({ requiredStepIds: ["start", "end"], requiredCapabilityEvidence: ["cap.synth.minimal"] }),
    targetAssertionFamilyIds: ["synth.minimal_family"],
    targetCapabilityIds: ["cap.synth.minimal"],
    ...overrides,
  });
}

/** Prerequisite family this suite's "unmet prerequisite" scenarios target. */
export const SYNTH_PREREQ_FAMILY = "synth.prereq_skill";
/** Core capability the main synthetic lesson teaches/skips/retrieves. */
export const SYNTH_CORE_CAPABILITY = "cap.synth.core";
export const SYNTH_MISCONCEPTION_ID = "MIS-SYNTH-WRONG-APPROACH-001";

/**
 * The main synthetic lesson: exercises required steps, a
 * conditional_skip_if_mastered practice step, a misconception-triggered
 * conditional_remediation_only step (with a remediation_cleared exit
 * route), a conditional_skip_if_mastered retrieval_check step, and a
 * declared prerequisite family -- every mechanism the real Ohm's Law
 * lesson does not, by itself, exercise.
 */
export const SYNTHETIC_MAIN_LESSON: LessonPlan = buildLesson({
  id: "lesson.synthetic.main",
  prerequisiteKnowledge: [SYNTH_PREREQ_FAMILY],
  targetAssertionFamilyIds: ["synth.target_skill"],
  targetCapabilityIds: [SYNTH_CORE_CAPABILITY],
  retrievalTags: ["synth.retrieval_tag"],
  steps: [
    buildStep({ id: "orientation", type: "orientation" }),
    buildStep({ id: "core_concept", type: "concept_explanation", capabilityIds: [SYNTH_CORE_CAPABILITY] }),
    buildStep({
      id: "skip_if_mastered_practice",
      type: "guided_interaction",
      requirement: "conditional_skip_if_mastered",
      capabilityIds: [SYNTH_CORE_CAPABILITY],
      evidenceEmitted: [SYNTH_CORE_CAPABILITY],
      completionCondition: "correct_answer_required",
    }),
    buildStep({
      id: "misconception_check",
      type: "misconception_discrimination",
      capabilityIds: [SYNTH_CORE_CAPABILITY],
      evidenceEmitted: [SYNTH_CORE_CAPABILITY],
      completionCondition: "correct_answer_required",
      branchRoutes: [
        {
          trigger: "misconception_detected",
          misconceptionIdentifier: SYNTH_MISCONCEPTION_ID,
          destinationStepId: "remediation_step",
          description: "Route to remediation on evidence of the specific synthetic misconception.",
        },
      ],
    }),
    buildStep({
      id: "remediation_step",
      type: "remediation",
      requirement: "conditional_remediation_only",
      branchRoutes: [
        {
          trigger: "remediation_cleared",
          destinationStepId: "transfer_step",
          description: "Return to the main sequence once remediation is cleared.",
        },
      ],
    }),
    buildStep({ id: "transfer_step", type: "transfer_application" }),
    buildStep({
      id: "retrieval_step",
      type: "retrieval_check",
      requirement: "conditional_skip_if_mastered",
      capabilityIds: [SYNTH_CORE_CAPABILITY],
    }),
    buildStep({ id: "recap", type: "recap" }),
    buildStep({ id: "exit_completion", type: "exit_completion" }),
  ],
  completionCriteria: buildCompletionCriteria({
    requiredStepIds: ["orientation", "core_concept", "misconception_check", "transfer_step", "recap", "exit_completion"],
    requiredCapabilityEvidence: [SYNTH_CORE_CAPABILITY],
  }),
});

/** The sole valid remediation candidate for SYNTH_PREREQ_FAMILY in the "exactly one candidate" scenario. */
export const SYNTHETIC_PREREQ_LESSON: LessonPlan = buildMinimalLesson("lesson.synthetic.prereq", {
  targetAssertionFamilyIds: [SYNTH_PREREQ_FAMILY],
  targetCapabilityIds: ["cap.synth.prereq"],
});

/** A second lesson also targeting SYNTH_PREREQ_FAMILY -- used only in the ambiguous-candidates scenario. */
export const SYNTHETIC_PREREQ_LESSON_DUPLICATE: LessonPlan = buildMinimalLesson("lesson.synthetic.prereq-duplicate", {
  targetAssertionFamilyIds: [SYNTH_PREREQ_FAMILY],
  targetCapabilityIds: ["cap.synth.prereq"],
});

/** Same family, but a different content release -- must never be treated as a candidate for a lesson in a different release. */
export const SYNTHETIC_PREREQ_LESSON_OTHER_RELEASE: LessonPlan = buildMinimalLesson("lesson.synthetic.prereq-other-release", {
  targetAssertionFamilyIds: [SYNTH_PREREQ_FAMILY],
  targetCapabilityIds: ["cap.synth.prereq"],
  contentRelease: "synthetic-content-release.2",
});
