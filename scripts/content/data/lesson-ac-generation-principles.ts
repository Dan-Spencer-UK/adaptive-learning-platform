/**
 * CC-11 Workstream B: third of a four-lesson LO5 sequence. Scope: AC5.4's
 * generation-principle obligations -- electromagnetic induction as the
 * causal principle, the single-loop A.C. generator, its sine-wave output,
 * the flux-change EMF calculation, and (from AC5.3's own family) the
 * motor-vs-generator comparison, which depends on both the motor
 * principle (lesson-magnetic-effects-of-current.ts) and the generator
 * principle taught here. AC5.4's own "distinguish A.C. from D.C."
 * obligation is deliberately taught in the NEXT lesson instead
 * (lesson-ac-dc-and-sine-wave-quantities.ts), alongside the rest of the
 * sine-wave-characteristic content it naturally belongs with -- splitting
 * AC5.4+AC5.5 into two lessons rather than the task brief's single
 * suggested "Lesson 3" avoids an oversized, high-load lesson (see that
 * file's own header for the full grouping rationale).
 *
 * Every assertion/family/capability/formula/diagram/question-blueprint id
 * below is a real, live reference into cc05a-pedagogy-unit202.ts /
 * cc04-unit202-electrical-science.ts, cross-checked mechanically by
 * scripts/content/validate-lesson-plan.ts. No new knowledge, capability
 * or blueprint was authored.
 *
 * CC-11.1: closes the worked-example gap CC-11 flagged --
 * formula.flux_change_emf marks both of its practised targets (e,
 * deltaPhi) `requiresWorkedExample: true`; worked.emf.calculate_flux_
 * change_e / worked.emf.calculate_flux_change_deltaPhi now exist and are
 * taught directly (worked_flux_change_emf, below) before the learner
 * practises the calculation unaided.
 *
 * CC-11.3: fixes an active misrepresentation the whole-course visual-
 * completeness audit found -- `concept_electromagnetic_induction_and_
 * generator` and `guided_describe_ac_generation` both wrongly reused
 * `motor.force_field_current` (a STATIC conductor + force-arrow diagram,
 * scoped by its own contract to the motor principle) to illustrate a
 * ROTATING loop producing changing flux, a different concept entirely.
 * Both now use the new, dedicated `generator.rotating_loop`
 * (ACGeneratorDiagram.tsx). `contentRelease` moved to
 * `release.unit202.v7`; see lesson-cc11-3-historical-snapshot.ts for how
 * v5/v6's own immutable membership remains resolvable against this
 * lesson's pre-CC-11.3 content.
 */

import type { LessonPlan } from "@alp/content-schema";

export const LESSON_AC_GENERATION_PRINCIPLES: LessonPlan = {
  id: "lesson.emf.ac-generation-principles",
  schemaVersion: 1,
  version: 1,
  title: "A.C. Generation Principles",
  learnerFacingDescription:
    "Understand how a rotating single-loop generator produces alternating EMF, calculate the EMF induced by a changing magnetic flux, and compare the motor principle with the generator principle.",
  curriculumUnit: "City & Guilds 2365-02 Unit 202 -- Principles of Electrical Science",
  prerequisiteKnowledge: ["electrical.ohms_law", "electrical.magnetism_and_electromagnetism", "electrical.emf_and_generation"],
  targetAssertionFamilyIds: ["electrical.emf_and_generation", "electrical.magnetism_and_electromagnetism"],
  remediationEligibility: [],
  targetAssertionIdentifiers: [
    "EL-CONCEPT-ELECTROMAGNETIC-INDUCTION-001",
    "EL-CONCEPT-AC-GENERATOR-001",
    "EL-CONCEPT-SINE-WAVE-001",
    "EL-REL-FLUX-CHANGE-EMF-001",
    "EL-MOTOR-GENERATOR-COMPARE-001",
  ],
  targetCapabilityIds: ["cap.emf.describe_ac_generation", "cap.emf.calculate_flux_change", "cap.magnetism.compare_motor_generator"],
  estimatedDurationMinutes: 15,
  instructionalStrategy:
    "Electromagnetic induction is introduced first as the single causal principle that explains generation (a changing flux induces an EMF), then the rotating-loop A.C. generator and its sine-wave output are taught as a direct consequence of that principle -- not a separate fact to memorise. The flux-change EMF calculation is practised immediately after as the quantitative form of the same causal principle. Motor-vs-generator comparison closes the lesson, deliberately positioned last so the learner has both principles (force-from-current from the previous lesson, EMF-from-changing-flux from this one) available to contrast.",
  steps: [
    {
      id: "orientation",
      type: "orientation",
      purpose: "Frame this lesson as answering the reverse question to the last one: instead of current producing force, how does a CHANGING field produce EMF -- the principle behind every generator.",
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
      feedback: { mode: "immediate", explainWhy: false },
      completionCondition: "view_acknowledged",
      branchRoutes: [],
      evidenceEmitted: [],
    },
    {
      id: "concept_electromagnetic_induction_and_generator",
      type: "concept_explanation",
      purpose: "State that a changing magnetic flux induces an EMF (electromagnetic induction), and describe how a single loop rotating within a field uses this to produce an alternating, sine-wave EMF.",
      requirement: "required",
      teaches: ["EL-CONCEPT-ELECTROMAGNETIC-INDUCTION-001", "EL-CONCEPT-AC-GENERATOR-001", "EL-CONCEPT-SINE-WAVE-001"],
      reinforces: ["EL-CONCEPT-ELECTROMAGNETISM-001"],
      tests: [],
      assertionFamilyId: "electrical.emf_and_generation",
      capabilityIds: [],
      misconceptionTargets: [],
      representation: { diagramBlueprintId: "generator.rotating_loop" },
      presentation: { interactionRequired: false, answerReveal: "not_applicable", contentMayScroll: true, progressiveReveal: false },
      scaffoldingLevel: "guided",
      cognitiveDemand: "introductory",
      feedback: { mode: "immediate", explainWhy: false },
      completionCondition: "view_acknowledged",
      branchRoutes: [],
      evidenceEmitted: [],
    },
    {
      id: "guided_describe_ac_generation",
      type: "guided_interaction",
      purpose: "Describe the basic principle of a rotating-loop A.C. generator.",
      requirement: "required",
      teaches: [],
      reinforces: [],
      tests: ["EL-CONCEPT-AC-GENERATOR-001", "EL-CONCEPT-SINE-WAVE-001"],
      assertionFamilyId: "electrical.emf_and_generation",
      capabilityIds: ["cap.emf.describe_ac_generation"],
      misconceptionTargets: [],
      representation: { diagramBlueprintId: "generator.rotating_loop" },
      questionBlueprintId: "emf.describe_ac_generation",
      presentation: { interactionRequired: true, interactionRole: "identify", answerReveal: "after_submission", contentMayScroll: false, progressiveReveal: false },
      scaffoldingLevel: "guided",
      cognitiveDemand: "intermediate",
      feedback: { mode: "immediate", explainWhy: true },
      completionCondition: "correct_answer_required",
      branchRoutes: [],
      evidenceEmitted: ["cap.emf.describe_ac_generation"],
    },
    {
      id: "concept_flux_change_emf",
      type: "concept_explanation",
      purpose: "State the quantitative form of electromagnetic induction for a single loop: induced EMF equals the change in flux divided by the time taken.",
      requirement: "required",
      teaches: ["EL-REL-FLUX-CHANGE-EMF-001"],
      reinforces: ["EL-CONCEPT-ELECTROMAGNETIC-INDUCTION-001"],
      tests: [],
      assertionFamilyId: "electrical.emf_and_generation",
      capabilityIds: [],
      misconceptionTargets: [],
      representation: { formulaFamilyId: "formula.flux_change_emf" },
      presentation: { interactionRequired: false, answerReveal: "not_applicable", contentMayScroll: true, progressiveReveal: false },
      scaffoldingLevel: "guided",
      cognitiveDemand: "intermediate",
      feedback: { mode: "immediate", explainWhy: false },
      completionCondition: "view_acknowledged",
      branchRoutes: [],
      evidenceEmitted: [],
    },
    {
      id: "worked_flux_change_emf",
      type: "worked_example",
      purpose: "Model calculating the induced EMF from a changing magnetic flux, before the learner practises it unaided.",
      requirement: "required",
      teaches: [],
      reinforces: [],
      tests: [],
      assertionFamilyId: "electrical.emf_and_generation",
      capabilityIds: ["cap.emf.calculate_flux_change"],
      misconceptionTargets: [],
      representation: { formulaFamilyId: "formula.flux_change_emf", workedExampleBlueprintId: "worked.emf.calculate_flux_change_e" },
      presentation: { interactionRequired: true, interactionRole: "predict", answerReveal: "after_submission", contentMayScroll: true, progressiveReveal: true },
      scaffoldingLevel: "guided",
      cognitiveDemand: "intermediate",
      feedback: { mode: "immediate", explainWhy: true },
      completionCondition: "view_acknowledged",
      branchRoutes: [],
      evidenceEmitted: [],
    },
    {
      id: "guided_calculate_flux_change_emf",
      type: "guided_interaction",
      purpose: "First learner-performed flux-change EMF calculation.",
      requirement: "required",
      teaches: [],
      reinforces: [],
      tests: ["EL-REL-FLUX-CHANGE-EMF-001"],
      assertionFamilyId: "electrical.emf_and_generation",
      capabilityIds: ["cap.emf.calculate_flux_change"],
      misconceptionTargets: [],
      representation: { formulaFamilyId: "formula.flux_change_emf" },
      questionBlueprintId: "emf.calculate_flux_change",
      presentation: { interactionRequired: true, interactionRole: "calculate", answerReveal: "after_submission", contentMayScroll: false, progressiveReveal: false },
      scaffoldingLevel: "guided",
      cognitiveDemand: "intermediate",
      feedback: { mode: "immediate", explainWhy: true },
      completionCondition: "correct_answer_required",
      branchRoutes: [],
      evidenceEmitted: ["cap.emf.calculate_flux_change"],
    },
    {
      id: "independent_calculate_flux_change_emf",
      type: "independent_question",
      purpose: "Unscaffolded flux-change EMF calculation, potentially solving for a different unknown than the guided attempt.",
      requirement: "required",
      teaches: [],
      reinforces: [],
      tests: ["EL-REL-FLUX-CHANGE-EMF-001"],
      assertionFamilyId: "electrical.emf_and_generation",
      capabilityIds: ["cap.emf.calculate_flux_change"],
      misconceptionTargets: [],
      representation: { formulaFamilyId: "formula.flux_change_emf" },
      questionBlueprintId: "emf.calculate_flux_change",
      presentation: { interactionRequired: true, interactionRole: "calculate", answerReveal: "after_submission", contentMayScroll: false, progressiveReveal: false },
      scaffoldingLevel: "independent",
      cognitiveDemand: "intermediate",
      feedback: { mode: "immediate", explainWhy: true },
      completionCondition: "correct_answer_required",
      branchRoutes: [],
      evidenceEmitted: ["cap.emf.calculate_flux_change"],
    },
    {
      id: "concept_motor_vs_generator",
      type: "concept_explanation",
      purpose: "Compare the motor principle (current + field -> force) with the generator principle (changing flux -> EMF) just taught, as two directions of the same electromagnetic relationship.",
      requirement: "required",
      teaches: ["EL-MOTOR-GENERATOR-COMPARE-001"],
      reinforces: ["EL-CONCEPT-MOTOR-PRINCIPLE-001", "EL-CONCEPT-AC-GENERATOR-001"],
      tests: [],
      assertionFamilyId: "electrical.magnetism_and_electromagnetism",
      capabilityIds: ["cap.magnetism.compare_motor_generator"],
      misconceptionTargets: [],
      representation: {},
      presentation: { interactionRequired: false, answerReveal: "not_applicable", contentMayScroll: true, progressiveReveal: false },
      scaffoldingLevel: "guided",
      cognitiveDemand: "advanced",
      feedback: { mode: "immediate", explainWhy: false },
      completionCondition: "view_acknowledged",
      branchRoutes: [],
      evidenceEmitted: [],
    },
    {
      id: "guided_compare_motor_generator",
      type: "guided_interaction",
      purpose: "Compare the motor principle with the generator principle.",
      requirement: "required",
      teaches: [],
      reinforces: [],
      tests: ["EL-MOTOR-GENERATOR-COMPARE-001"],
      assertionFamilyId: "electrical.magnetism_and_electromagnetism",
      capabilityIds: ["cap.magnetism.compare_motor_generator"],
      misconceptionTargets: [{ misconceptionIdentifier: "MIS-EL-EMF-VOLTAGE-CONFUSION-001", evidenceStrength: "suggestive" }],
      representation: {},
      questionBlueprintId: "magnetism.compare_motor_generator",
      presentation: { interactionRequired: true, interactionRole: "compare", answerReveal: "after_submission", contentMayScroll: false, progressiveReveal: false },
      scaffoldingLevel: "guided",
      cognitiveDemand: "advanced",
      feedback: { mode: "immediate", explainWhy: true },
      completionCondition: "correct_answer_required",
      branchRoutes: [],
      evidenceEmitted: ["cap.magnetism.compare_motor_generator"],
    },
    {
      id: "retrieval_check",
      type: "retrieval_check",
      purpose: "Short delayed retrieval of the flux-change EMF calculation to strengthen retention before the lesson ends.",
      requirement: "required",
      teaches: [],
      reinforces: [],
      tests: ["EL-REL-FLUX-CHANGE-EMF-001"],
      assertionFamilyId: "electrical.emf_and_generation",
      capabilityIds: ["cap.emf.calculate_flux_change"],
      misconceptionTargets: [],
      representation: { formulaFamilyId: "formula.flux_change_emf" },
      questionBlueprintId: "emf.calculate_flux_change",
      presentation: { interactionRequired: true, interactionRole: "calculate", answerReveal: "after_submission", contentMayScroll: false, progressiveReveal: false },
      scaffoldingLevel: "independent",
      cognitiveDemand: "intermediate",
      feedback: { mode: "immediate", explainWhy: true },
      completionCondition: "correct_answer_required",
      branchRoutes: [],
      evidenceEmitted: ["cap.emf.calculate_flux_change"],
    },
    {
      id: "recap",
      type: "recap",
      purpose: "Summarise electromagnetic induction, the A.C. generator's sine-wave output, the flux-change EMF calculation, and motor-vs-generator comparison.",
      requirement: "required",
      teaches: [],
      reinforces: ["EL-CONCEPT-ELECTROMAGNETIC-INDUCTION-001", "EL-CONCEPT-AC-GENERATOR-001", "EL-REL-FLUX-CHANGE-EMF-001", "EL-MOTOR-GENERATOR-COMPARE-001"],
      tests: [],
      assertionFamilyId: "electrical.emf_and_generation",
      capabilityIds: [],
      misconceptionTargets: [],
      representation: {},
      presentation: { interactionRequired: false, answerReveal: "not_applicable", contentMayScroll: true, progressiveReveal: false },
      scaffoldingLevel: "independent",
      cognitiveDemand: "introductory",
      feedback: { mode: "immediate", explainWhy: false },
      completionCondition: "view_acknowledged",
      branchRoutes: [],
      evidenceEmitted: [],
    },
    {
      id: "exit_completion",
      type: "exit_completion",
      purpose: "Confirm lesson completion against the governed completion criteria.",
      requirement: "required",
      teaches: [],
      reinforces: [],
      tests: [],
      capabilityIds: [],
      misconceptionTargets: [],
      representation: {},
      presentation: { interactionRequired: false, answerReveal: "not_applicable", contentMayScroll: false, progressiveReveal: false },
      scaffoldingLevel: "independent",
      cognitiveDemand: "introductory",
      feedback: { mode: "immediate", explainWhy: false },
      completionCondition: "view_acknowledged",
      branchRoutes: [],
      evidenceEmitted: [],
    },
  ],
  misconceptionTargets: [{ misconceptionIdentifier: "MIS-EL-EMF-VOLTAGE-CONFUSION-001", evidenceStrength: "suggestive" }],
  retrievalTags: ["electrical.emf_and_generation", "formula.flux_change_emf", "electrical.magnetism_and_electromagnetism"],
  completionCriteria: {
    requiredStepIds: [
      "orientation",
      "concept_electromagnetic_induction_and_generator",
      "guided_describe_ac_generation",
      "concept_flux_change_emf",
      "worked_flux_change_emf",
      "guided_calculate_flux_change_emf",
      "independent_calculate_flux_change_emf",
      "concept_motor_vs_generator",
      "guided_compare_motor_generator",
      "retrieval_check",
      "recap",
      "exit_completion",
    ],
    requiredCapabilityEvidence: ["cap.emf.describe_ac_generation", "cap.emf.calculate_flux_change", "cap.magnetism.compare_motor_generator"],
    // describe_ac_generation and compare_motor_generator are each only
    // evidenced through guided steps in this lesson's own step design
    // (never independently or via transfer), so cannot structurally
    // reach a secure mastery tier here. calculate_flux_change IS
    // independently re-evidenced (independent_calculate_flux_change_emf
    // and the retrieval check), so it remains eligible.
    masteryGateCapabilityIds: ["cap.emf.calculate_flux_change"],
    requiresRemediationClearance: true,
    exitSummary:
      "The learner has described the rotating-loop A.C. generator principle, calculated the EMF induced by a changing magnetic flux, and compared the motor principle with the generator principle.",
  },
  presentationModes: ["learn", "review"],
  contentRelease: "release.unit202.v7",
};

export const lessons = [LESSON_AC_GENERATION_PRINCIPLES];
