/**
 * Lesson Player content: the governed `LessonPlan` and every piece of
 * governed content it references, for the real canonical Ohm's Law
 * lesson (`lesson.electrical.ohms-law`).
 *
 * This is a literal, field-for-field mirror of the corresponding records
 * in the real governed corpus (scripts/content/data/lesson-ohms-law.ts,
 * cc05a-pedagogy-unit202.ts, cc04-unit202-electrical-science.ts) --
 * nothing here is invented, reworded or restated with different meaning.
 * A mechanical cross-check (scripts/content/check-lesson-player-content-
 * fixture.test.ts) imports both this file and the real corpus modules and
 * asserts structural/textual equality for every id mirrored here, so this
 * file cannot silently drift from the governed source.
 *
 * Why a mirror and not a direct import: apps/mobile depends only on
 * published `@alp/*` packages, never on content-authoring tooling under
 * scripts/content (see apps/mobile/src/lib/proving-content/unit202-
 * proving-fixture.ts's header comment, which established this exact
 * pattern for CC-05C, and scripts/content/README.md). The full published
 * learner-runtime content-projection pipeline (governed content ->
 * validated versioned release -> device) remains explicitly future work
 * (docs/architecture/MOBILE-ARCHITECTURE.md §2) -- this module is the
 * smallest honest stand-in for that projection, extended from the
 * CC-05C proving fixture to cover a full Lesson Plan rather than a flat
 * per-family question queue.
 *
 * Three of the eight Ohm's-law question blueprints this lesson uses
 * (`solve_for_voltage/current/resistance`) are already mirrored by
 * unit202-proving-fixture.ts and are re-exported from there rather than
 * duplicated; the five the lesson additionally requires
 * (`select_rearrangement`, `match_variables_units`,
 * `diagnose_wrong_operation`, `diagnose_rearrangement_error`,
 * `plausibility_check`) are mirrored here for the first time.
 *
 * `ASSERTION_STATEMENTS`/`MISCONCEPTION_DESCRIPTIONS` are a deliberately
 * minimal plain-string mirror (not a full governed-shape copy) of exactly
 * the CC-04 knowledge-graph text this lesson's learner-facing steps need
 * to resolve `LessonStep.teaches`/`reinforces`/`tests`/
 * `misconceptionTargets` references into real copy -- never
 * `LessonStep.purpose` (an internal pedagogical-design field, not learner
 * copy; see docs handed down with this task's brief §6).
 */
import type { LessonPlan, QuestionBlueprint } from "@alp/content-schema";
import {
  FORMULA_OHMS_LAW,
  MNEMONIC_VIR_TRIANGLE,
  QB_OHMS_LAW_SOLVE_FOR_CURRENT,
  QB_OHMS_LAW_SOLVE_FOR_RESISTANCE,
  QB_OHMS_LAW_SOLVE_FOR_VOLTAGE,
  WORKED_OHMS_LAW_SOLVE_CURRENT,
  WORKED_OHMS_LAW_SOLVE_RESISTANCE,
  WORKED_OHMS_LAW_SOLVE_VOLTAGE,
} from "../proving-content/unit202-proving-fixture.ts";

// =========================================================================
// The five additional question blueprints this lesson needs, beyond the
// three CC-05C already mirrors.
// =========================================================================

export const QB_OHMS_LAW_SELECT_REARRANGEMENT: QuestionBlueprint = {
  id: "ohms_law.select_rearrangement",
  assertionFamilyId: "electrical.ohms_law",
  capabilityId: "cap.ohms_law.select_rearrangement",
  title: "Select the correct rearrangement of V = I x R for the target quantity",
  representation: {},
  variantDimensions: { target_variable: { allowed: ["V", "I", "R"] } },
  parameterGenerators: [],
  answer: { type: "formula_selection" },
  marking: { type: "enum" },
  difficultyBand: "intermediate",
  normalisationNote:
    "One blueprint with target_variable as a variant dimension, rather than three separate select-rearrangement blueprints, since the selection skill being assessed is identical regardless of which variable is unknown.",
  evidence: {
    familyId: "electrical.ohms_law",
    primaryCapabilityId: "cap.ohms_law.select_rearrangement",
    assertionIdentifiers: ["EL-OHM-SELECT-RELATIONSHIP-001"],
    supportingCapabilityIds: ["cap.ohms_law.recognise_relationship"],
    representationDependency: [],
    misconceptionTargets: [],
  },
};

export const QB_OHMS_LAW_MATCH_VARIABLES_UNITS: QuestionBlueprint = {
  id: "ohms_law.match_variables_units",
  assertionFamilyId: "electrical.ohms_law",
  capabilityId: "cap.ohms_law.apply_correct_unit",
  title: "Match each Ohm's-law variable to its correct SI unit",
  representation: {},
  variantDimensions: {},
  parameterGenerators: [],
  answer: { type: "multi_select" },
  marking: { type: "set_equality" },
  difficultyBand: "introductory",
  evidence: {
    familyId: "electrical.ohms_law",
    primaryCapabilityId: "cap.ohms_law.apply_correct_unit",
    assertionIdentifiers: ["EL-OHM-RELATIONSHIP-001"],
    supportingCapabilityIds: ["cap.si_units.identify_unit"],
    representationDependency: [],
    misconceptionTargets: [],
  },
};

export const QB_OHMS_LAW_DIAGNOSE_REARRANGEMENT_ERROR: QuestionBlueprint = {
  id: "ohms_law.diagnose_rearrangement_error",
  assertionFamilyId: "electrical.ohms_law",
  capabilityId: "cap.ohms_law.diagnose_rearrangement_error",
  title: "Diagnose an incorrect algebraic rearrangement of V = I x R",
  representation: {},
  variantDimensions: {},
  parameterGenerators: [],
  answer: { type: "worked_error_classification" },
  marking: { type: "enum" },
  difficultyBand: "diagnostic",
  evidence: {
    familyId: "electrical.ohms_law",
    primaryCapabilityId: "cap.ohms_law.diagnose_rearrangement_error",
    assertionIdentifiers: ["EL-OHM-REARRANGE-001"],
    supportingCapabilityIds: [],
    representationDependency: [],
    misconceptionTargets: [{ misconceptionIdentifier: "MIS-EL-OHM-REARRANGE-ERROR-001", evidenceStrength: "direct" }],
  },
};

export const QB_OHMS_LAW_DIAGNOSE_WRONG_OPERATION: QuestionBlueprint = {
  id: "ohms_law.diagnose_wrong_operation",
  assertionFamilyId: "electrical.ohms_law",
  capabilityId: "cap.ohms_law.diagnose_wrong_operation",
  title: "Diagnose use of the wrong arithmetic operation when applying V = I x R",
  representation: {},
  variantDimensions: {},
  parameterGenerators: [],
  answer: { type: "worked_error_classification" },
  marking: { type: "enum" },
  difficultyBand: "diagnostic",
  evidence: {
    familyId: "electrical.ohms_law",
    primaryCapabilityId: "cap.ohms_law.diagnose_wrong_operation",
    assertionIdentifiers: ["EL-OHM-RELATIONSHIP-001"],
    supportingCapabilityIds: [],
    representationDependency: [],
    misconceptionTargets: [{ misconceptionIdentifier: "MIS-EL-OHM-WRONG-OPERATION-001", evidenceStrength: "direct" }],
  },
};

export const QB_OHMS_LAW_PLAUSIBILITY_CHECK: QuestionBlueprint = {
  id: "ohms_law.plausibility_check",
  assertionFamilyId: "electrical.ohms_law",
  capabilityId: "cap.ohms_law.check_plausibility",
  title: "Judge whether a calculated Ohm's-law result is physically plausible",
  representation: {},
  variantDimensions: {},
  parameterGenerators: [],
  answer: { type: "multiple_choice", options: ["plausible", "too_high", "too_low"] },
  marking: { type: "exact" },
  difficultyBand: "advanced",
  evidence: {
    familyId: "electrical.ohms_law",
    primaryCapabilityId: "cap.ohms_law.check_plausibility",
    assertionIdentifiers: ["EL-OHM-RELATIONSHIP-001"],
    supportingCapabilityIds: [],
    representationDependency: [],
    misconceptionTargets: [],
  },
};

export const LESSON_QUESTION_BLUEPRINTS: readonly QuestionBlueprint[] = [
  QB_OHMS_LAW_SOLVE_FOR_VOLTAGE,
  QB_OHMS_LAW_SOLVE_FOR_CURRENT,
  QB_OHMS_LAW_SOLVE_FOR_RESISTANCE,
  QB_OHMS_LAW_SELECT_REARRANGEMENT,
  QB_OHMS_LAW_MATCH_VARIABLES_UNITS,
  QB_OHMS_LAW_DIAGNOSE_REARRANGEMENT_ERROR,
  QB_OHMS_LAW_DIAGNOSE_WRONG_OPERATION,
  QB_OHMS_LAW_PLAUSIBILITY_CHECK,
];

// =========================================================================
// Learner-facing text: real assertion statements and misconception
// descriptions this lesson's steps resolve their teaches/reinforces/tests/
// misconceptionTargets references against. Verbatim from the CC-04
// knowledge graph -- never authored fresh here.
// =========================================================================

export const ASSERTION_STATEMENTS: Readonly<Record<string, string>> = {
  "EL-CONCEPT-VOLTAGE-001":
    "Potential difference (voltage) is the electrical energy transferred per unit charge between two points in a circuit.",
  "EL-CONCEPT-CURRENT-001": "Electric current is the rate of flow of electric charge through a conductor.",
  "EL-CONCEPT-RESISTANCE-001": "Electrical resistance is the opposition a component presents to the flow of electric current.",
  "EL-OHM-RELATIONSHIP-001":
    "For a component obeying Ohm's law, potential difference, current and resistance are related by V = I times R.",
  "EL-OHM-PROPORTIONALITY-001":
    "At constant resistance, current is directly proportional to voltage; at constant voltage, current is inversely proportional to resistance.",
  "EL-OHM-REARRANGE-001": "Rearrange V = I times R algebraically to make voltage, current or resistance the subject.",
  "EL-OHM-SOLVE-V-001": "Calculate an unknown voltage from known current and resistance using V = I times R.",
  "EL-OHM-SOLVE-I-001": "Calculate an unknown current from known voltage and resistance by rearranging and applying V = I times R.",
  "EL-OHM-SOLVE-R-001": "Calculate an unknown resistance from known voltage and current by rearranging and applying V = I times R.",
  "EL-OHM-SELECT-RELATIONSHIP-001":
    "Select the correct arrangement of V = I times R to use, based on which two quantities are known and which quantity is required.",
};

export const MISCONCEPTION_DESCRIPTIONS: Readonly<Record<string, string>> = {
  "MIS-EL-OHM-UNRELATED-SYMBOLS-001":
    "Treats V, I and R as three unrelated symbols to memorise rather than as a single relationship connecting voltage, current and resistance (V = I times R).",
  "MIS-EL-OHM-REARRANGE-ERROR-001":
    "Incorrectly rearranges a multiplicative relationship such as V = I times R or P = V times I (for example moving a variable to the wrong side, or inverting the wrong pair of variables) when isolating a different subject.",
  "MIS-EL-OHM-WRONG-OPERATION-001":
    "Selects the wrong arithmetic operation when calculating an unknown quantity from V = I times R (for example multiplying instead of dividing when solving for current or resistance, or dividing the two known quantities in the wrong order).",
};

// =========================================================================
// The canonical Lesson Plan itself -- literal mirror of
// scripts/content/data/lesson-ohms-law.ts's LESSON_OHMS_LAW.
// =========================================================================

export const LESSON_OHMS_LAW: LessonPlan = {
  id: "lesson.electrical.ohms-law",
  schemaVersion: 1,
  version: 1,
  title: "Ohm's Law",
  learnerFacingDescription:
    "Understand how voltage, current and resistance relate through V = I x R, and use that relationship confidently in either direction.",
  curriculumUnit: "City & Guilds 2365-02 Unit 202 -- Principles of Electrical Science",
  prerequisiteKnowledge: [
    "foundational.algebraic_technique",
    "foundational.arithmetic_technique",
    "foundational.proportion_and_units",
    "electrical.si_units",
    "electrical.core_quantities",
  ],
  targetAssertionFamilyIds: ["electrical.ohms_law"],
  remediationEligibility: [],
  targetAssertionIdentifiers: [
    "EL-OHM-RELATIONSHIP-001",
    "EL-OHM-PROPORTIONALITY-001",
    "EL-OHM-REARRANGE-001",
    "EL-OHM-SOLVE-V-001",
    "EL-OHM-SOLVE-I-001",
    "EL-OHM-SOLVE-R-001",
    "EL-OHM-SELECT-RELATIONSHIP-001",
  ],
  targetCapabilityIds: [
    "cap.ohms_law.recognise_relationship",
    "cap.ohms_law.solve_for_voltage",
    "cap.ohms_law.solve_for_current",
    "cap.ohms_law.solve_for_resistance",
    "cap.ohms_law.select_rearrangement",
    "cap.ohms_law.apply_correct_unit",
    "cap.ohms_law.apply_substitution",
    "cap.ohms_law.check_plausibility",
    "cap.ohms_law.diagnose_rearrangement_error",
    "cap.ohms_law.diagnose_wrong_operation",
  ],
  estimatedDurationMinutes: 20,
  instructionalStrategy:
    "Concept introduced once, then practised immediately through calculation, flexible rearrangement and plausibility judgement; two governed misconceptions are actively discriminated for (not merely hoped not to occur), each routing to the same explicit remediation step before the learner is allowed to exit; independent-question and transfer steps prove the skill generalises rather than being memorised for one direction only.",
  steps: [
    {
      id: "orientation",
      type: "orientation",
      purpose: "Frame why the V/I/R relationship matters for real electrical work, not just as an abstract formula.",
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
      id: "activate_prior_knowledge",
      type: "guided_interaction",
      purpose:
        "Activate prior knowledge of voltage/current/resistance as distinct, related quantities before the formal relationship is stated -- a predictive DO, not a re-explanation.",
      requirement: "required",
      teaches: [],
      reinforces: ["EL-CONCEPT-VOLTAGE-001", "EL-CONCEPT-CURRENT-001", "EL-CONCEPT-RESISTANCE-001"],
      tests: [],
      assertionFamilyId: "electrical.core_quantities",
      capabilityIds: [],
      misconceptionTargets: [],
      representation: {},
      presentation: { interactionRequired: true, interactionRole: "predict", answerReveal: "after_submission", contentMayScroll: false, progressiveReveal: false },
      scaffoldingLevel: "guided",
      cognitiveDemand: "introductory",
      feedback: { mode: "immediate", explainWhy: true },
      completionCondition: "answer_submitted",
      branchRoutes: [],
      evidenceEmitted: [],
    },
    {
      id: "introduce_relationship",
      type: "concept_explanation",
      purpose: "State the canonical relationship V = I x R and what it means physically.",
      requirement: "required",
      teaches: ["EL-OHM-RELATIONSHIP-001"],
      reinforces: [],
      tests: [],
      assertionFamilyId: "electrical.ohms_law",
      capabilityIds: ["cap.ohms_law.recognise_relationship"],
      misconceptionTargets: [{ misconceptionIdentifier: "MIS-EL-OHM-UNRELATED-SYMBOLS-001", evidenceStrength: "generic" }],
      representation: { formulaFamilyId: "formula.ohms_law" },
      presentation: { interactionRequired: false, answerReveal: "not_applicable", contentMayScroll: true, progressiveReveal: false },
      scaffoldingLevel: "guided",
      cognitiveDemand: "introductory",
      feedback: { mode: "immediate", explainWhy: false },
      completionCondition: "view_acknowledged",
      branchRoutes: [],
      evidenceEmitted: [],
    },
    {
      id: "formula_and_mnemonic_representation",
      type: "visual_explanation",
      purpose:
        "Show every rearrangement of V = I x R and the VIR-triangle mnemonic as a memory aid only -- the mnemonic is never the mathematical authority; formula.ohms_law's own forms are.",
      requirement: "required",
      teaches: ["EL-OHM-REARRANGE-001"],
      reinforces: ["EL-OHM-PROPORTIONALITY-001"],
      tests: [],
      assertionFamilyId: "electrical.ohms_law",
      capabilityIds: ["cap.ohms_law.select_rearrangement"],
      misconceptionTargets: [],
      representation: { formulaFamilyId: "formula.ohms_law", visualAidBlueprintId: "mnemonic.vir_triangle" },
      presentation: { interactionRequired: true, interactionRole: "interpret", answerReveal: "on_request", contentMayScroll: true, progressiveReveal: true },
      scaffoldingLevel: "guided",
      cognitiveDemand: "introductory",
      feedback: { mode: "immediate", explainWhy: true },
      completionCondition: "view_acknowledged",
      branchRoutes: [],
      evidenceEmitted: [],
    },
    {
      id: "interpret_variables_and_units",
      type: "guided_interaction",
      purpose: "Match each variable in V = I x R to its correct SI unit before calculating with it.",
      requirement: "required",
      teaches: [],
      reinforces: ["EL-OHM-RELATIONSHIP-001"],
      tests: ["EL-OHM-RELATIONSHIP-001"],
      assertionFamilyId: "electrical.ohms_law",
      capabilityIds: ["cap.ohms_law.apply_correct_unit"],
      misconceptionTargets: [],
      representation: { formulaFamilyId: "formula.ohms_law" },
      questionBlueprintId: "ohms_law.match_variables_units",
      presentation: { interactionRequired: true, interactionRole: "identify", answerReveal: "after_submission", contentMayScroll: false, progressiveReveal: false },
      scaffoldingLevel: "guided",
      cognitiveDemand: "introductory",
      feedback: { mode: "immediate", explainWhy: true },
      completionCondition: "correct_answer_required",
      branchRoutes: [],
      evidenceEmitted: ["cap.ohms_law.apply_correct_unit"],
    },
    {
      id: "worked_example_solve_voltage",
      type: "worked_example",
      purpose: "Model substitution and calculation for the canonical target (V) step by step before asking the learner to do it unaided.",
      requirement: "required",
      teaches: [],
      reinforces: ["EL-OHM-SOLVE-V-001"],
      tests: [],
      assertionFamilyId: "electrical.ohms_law",
      capabilityIds: ["cap.ohms_law.apply_substitution", "cap.ohms_law.solve_for_voltage"],
      misconceptionTargets: [],
      representation: { formulaFamilyId: "formula.ohms_law", workedExampleBlueprintId: "worked.ohms_law.solve_voltage" },
      presentation: { interactionRequired: true, interactionRole: "predict", answerReveal: "after_submission", contentMayScroll: true, progressiveReveal: true },
      scaffoldingLevel: "guided",
      cognitiveDemand: "introductory",
      feedback: { mode: "immediate", explainWhy: true },
      completionCondition: "view_acknowledged",
      branchRoutes: [],
      evidenceEmitted: [],
    },
    {
      id: "guided_calculation_current",
      type: "guided_interaction",
      purpose: "First learner-performed calculation: solve for current, with scaffolding still present.",
      requirement: "required",
      teaches: [],
      reinforces: [],
      tests: ["EL-OHM-SOLVE-I-001"],
      assertionFamilyId: "electrical.ohms_law",
      capabilityIds: ["cap.ohms_law.solve_for_current", "cap.ohms_law.apply_substitution"],
      misconceptionTargets: [],
      representation: { formulaFamilyId: "formula.ohms_law", workedExampleBlueprintId: "worked.ohms_law.solve_current" },
      questionBlueprintId: "ohms_law.solve_for_current",
      presentation: { interactionRequired: true, interactionRole: "calculate", answerReveal: "after_submission", contentMayScroll: false, progressiveReveal: false },
      scaffoldingLevel: "guided",
      cognitiveDemand: "introductory",
      feedback: { mode: "immediate", explainWhy: true },
      completionCondition: "correct_answer_required",
      branchRoutes: [],
      evidenceEmitted: ["cap.ohms_law.solve_for_current"],
    },
    {
      id: "misconception_check_wrong_operation",
      type: "misconception_discrimination",
      purpose: "Directly test for the specific, governed wrong-operation misconception rather than assuming its absence.",
      requirement: "required",
      teaches: [],
      reinforces: [],
      tests: ["EL-OHM-RELATIONSHIP-001"],
      assertionFamilyId: "electrical.ohms_law",
      capabilityIds: ["cap.ohms_law.diagnose_wrong_operation"],
      misconceptionTargets: [{ misconceptionIdentifier: "MIS-EL-OHM-WRONG-OPERATION-001", evidenceStrength: "direct" }],
      representation: {},
      questionBlueprintId: "ohms_law.diagnose_wrong_operation",
      presentation: { interactionRequired: true, interactionRole: "correct_misconception", answerReveal: "after_submission", contentMayScroll: false, progressiveReveal: false },
      scaffoldingLevel: "standard",
      cognitiveDemand: "diagnostic",
      feedback: { mode: "immediate", explainWhy: true },
      completionCondition: "correct_answer_required",
      branchRoutes: [
        {
          trigger: "misconception_detected",
          misconceptionIdentifier: "MIS-EL-OHM-WRONG-OPERATION-001",
          destinationStepId: "remediation_rearrangement",
          description: "Route to explicit rearrangement/operation-selection remediation before continuing.",
        },
      ],
      evidenceEmitted: ["cap.ohms_law.diagnose_wrong_operation"],
    },
    {
      id: "independent_question_resistance",
      type: "independent_question",
      purpose: "Unscaffolded calculation: solve for resistance with no worked example immediately before it.",
      requirement: "required",
      teaches: [],
      reinforces: [],
      tests: ["EL-OHM-SOLVE-R-001"],
      assertionFamilyId: "electrical.ohms_law",
      capabilityIds: ["cap.ohms_law.solve_for_resistance"],
      misconceptionTargets: [],
      representation: { formulaFamilyId: "formula.ohms_law" },
      questionBlueprintId: "ohms_law.solve_for_resistance",
      presentation: { interactionRequired: true, interactionRole: "calculate", answerReveal: "after_submission", contentMayScroll: false, progressiveReveal: false },
      scaffoldingLevel: "independent",
      cognitiveDemand: "intermediate",
      feedback: { mode: "immediate", explainWhy: true },
      completionCondition: "correct_answer_required",
      branchRoutes: [],
      evidenceEmitted: ["cap.ohms_law.solve_for_resistance"],
    },
    {
      id: "select_rearrangement_transfer",
      type: "transfer_application",
      purpose: "Prove the skill generalises: select the correct rearrangement for whichever quantity is unknown, not just the one direction already practised.",
      requirement: "required",
      teaches: [],
      reinforces: [],
      tests: ["EL-OHM-SELECT-RELATIONSHIP-001"],
      assertionFamilyId: "electrical.ohms_law",
      capabilityIds: ["cap.ohms_law.select_rearrangement"],
      misconceptionTargets: [],
      representation: { formulaFamilyId: "formula.ohms_law" },
      questionBlueprintId: "ohms_law.select_rearrangement",
      presentation: { interactionRequired: true, interactionRole: "select", answerReveal: "after_submission", contentMayScroll: false, progressiveReveal: false },
      scaffoldingLevel: "independent",
      cognitiveDemand: "intermediate",
      feedback: { mode: "immediate", explainWhy: true },
      completionCondition: "correct_answer_required",
      branchRoutes: [],
      evidenceEmitted: ["cap.ohms_law.select_rearrangement"],
    },
    {
      id: "misconception_check_rearrangement",
      type: "misconception_discrimination",
      purpose: "Directly test for the specific, governed algebraic-rearrangement misconception.",
      requirement: "required",
      teaches: [],
      reinforces: [],
      tests: ["EL-OHM-REARRANGE-001"],
      assertionFamilyId: "electrical.ohms_law",
      capabilityIds: ["cap.ohms_law.diagnose_rearrangement_error"],
      misconceptionTargets: [{ misconceptionIdentifier: "MIS-EL-OHM-REARRANGE-ERROR-001", evidenceStrength: "direct" }],
      representation: {},
      questionBlueprintId: "ohms_law.diagnose_rearrangement_error",
      presentation: { interactionRequired: true, interactionRole: "correct_misconception", answerReveal: "after_submission", contentMayScroll: false, progressiveReveal: false },
      scaffoldingLevel: "standard",
      cognitiveDemand: "diagnostic",
      feedback: { mode: "immediate", explainWhy: true },
      completionCondition: "correct_answer_required",
      branchRoutes: [
        {
          trigger: "misconception_detected",
          misconceptionIdentifier: "MIS-EL-OHM-REARRANGE-ERROR-001",
          destinationStepId: "remediation_rearrangement",
          description: "Route to the same explicit rearrangement remediation as the wrong-operation check.",
        },
      ],
      evidenceEmitted: ["cap.ohms_law.diagnose_rearrangement_error"],
    },
    {
      id: "remediation_rearrangement",
      type: "remediation",
      purpose:
        "Reteach algebraic rearrangement of V = I x R using the worked-example machinery again, then require a fresh correct rearrangement/calculation before returning to the main sequence. Entered only via a branch route -- never part of the default linear path.",
      requirement: "conditional_remediation_only",
      teaches: ["EL-OHM-REARRANGE-001"],
      reinforces: [],
      tests: ["EL-OHM-SOLVE-I-001", "EL-OHM-SOLVE-R-001"],
      assertionFamilyId: "electrical.ohms_law",
      capabilityIds: ["cap.ohms_law.diagnose_rearrangement_error", "cap.ohms_law.diagnose_wrong_operation"],
      misconceptionTargets: [
        { misconceptionIdentifier: "MIS-EL-OHM-REARRANGE-ERROR-001", evidenceStrength: "direct" },
        { misconceptionIdentifier: "MIS-EL-OHM-WRONG-OPERATION-001", evidenceStrength: "direct" },
      ],
      representation: { formulaFamilyId: "formula.ohms_law", visualAidBlueprintId: "mnemonic.vir_triangle", workedExampleBlueprintId: "worked.ohms_law.solve_resistance" },
      questionBlueprintId: "ohms_law.solve_for_resistance",
      presentation: { interactionRequired: true, interactionRole: "calculate", answerReveal: "after_submission", contentMayScroll: true, progressiveReveal: true },
      scaffoldingLevel: "guided",
      cognitiveDemand: "intermediate",
      feedback: { mode: "immediate", explainWhy: true },
      completionCondition: "correct_answer_required",
      branchRoutes: [
        {
          trigger: "remediation_cleared",
          destinationStepId: "plausibility_check_transfer",
          description: "Remediation cleared -- resume the main sequence at the plausibility/transfer step.",
        },
      ],
      evidenceEmitted: ["cap.ohms_law.diagnose_rearrangement_error", "cap.ohms_law.diagnose_wrong_operation"],
    },
    {
      id: "plausibility_check_transfer",
      type: "transfer_application",
      purpose: "Vocational-judgement transfer: decide whether a calculated result is physically plausible, not merely arithmetically correct.",
      requirement: "required",
      teaches: [],
      reinforces: ["EL-OHM-RELATIONSHIP-001"],
      tests: ["EL-OHM-RELATIONSHIP-001"],
      assertionFamilyId: "electrical.ohms_law",
      capabilityIds: ["cap.ohms_law.check_plausibility"],
      misconceptionTargets: [],
      representation: {},
      questionBlueprintId: "ohms_law.plausibility_check",
      presentation: { interactionRequired: true, interactionRole: "apply", answerReveal: "after_submission", contentMayScroll: false, progressiveReveal: false },
      scaffoldingLevel: "independent",
      cognitiveDemand: "advanced",
      feedback: { mode: "immediate", explainWhy: true },
      completionCondition: "correct_answer_required",
      branchRoutes: [],
      evidenceEmitted: ["cap.ohms_law.check_plausibility"],
    },
    {
      id: "retrieval_check",
      type: "retrieval_check",
      purpose: "Short delayed retrieval of the earliest-practised skill (solving for voltage) to strengthen long-term retention before the lesson ends.",
      requirement: "required",
      teaches: [],
      reinforces: [],
      tests: ["EL-OHM-SOLVE-V-001"],
      assertionFamilyId: "electrical.ohms_law",
      capabilityIds: ["cap.ohms_law.solve_for_voltage"],
      misconceptionTargets: [],
      representation: { formulaFamilyId: "formula.ohms_law" },
      questionBlueprintId: "ohms_law.solve_for_voltage",
      presentation: { interactionRequired: true, interactionRole: "calculate", answerReveal: "after_submission", contentMayScroll: false, progressiveReveal: false },
      scaffoldingLevel: "independent",
      cognitiveDemand: "introductory",
      feedback: { mode: "immediate", explainWhy: true },
      completionCondition: "correct_answer_required",
      branchRoutes: [],
      evidenceEmitted: ["cap.ohms_law.solve_for_voltage"],
    },
    {
      id: "recap",
      type: "recap",
      purpose: "Summarise the relationship, its rearrangements and the two misconceptions actively checked for in this lesson.",
      requirement: "required",
      teaches: [],
      reinforces: ["EL-OHM-RELATIONSHIP-001", "EL-OHM-REARRANGE-001"],
      tests: [],
      assertionFamilyId: "electrical.ohms_law",
      capabilityIds: [],
      misconceptionTargets: [],
      representation: { formulaFamilyId: "formula.ohms_law" },
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
      purpose: "Confirm lesson completion against the governed completion criteria and surface what was strengthened.",
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
  misconceptionTargets: [
    { misconceptionIdentifier: "MIS-EL-OHM-UNRELATED-SYMBOLS-001", evidenceStrength: "generic" },
    { misconceptionIdentifier: "MIS-EL-OHM-WRONG-OPERATION-001", evidenceStrength: "direct" },
    { misconceptionIdentifier: "MIS-EL-OHM-REARRANGE-ERROR-001", evidenceStrength: "direct" },
  ],
  retrievalTags: ["electrical.ohms_law", "formula.ohms_law"],
  completionCriteria: {
    requiredStepIds: [
      "orientation",
      "activate_prior_knowledge",
      "introduce_relationship",
      "formula_and_mnemonic_representation",
      "interpret_variables_and_units",
      "worked_example_solve_voltage",
      "guided_calculation_current",
      "misconception_check_wrong_operation",
      "independent_question_resistance",
      "select_rearrangement_transfer",
      "misconception_check_rearrangement",
      "plausibility_check_transfer",
      "retrieval_check",
      "recap",
      "exit_completion",
    ],
    requiredCapabilityEvidence: [
      "cap.ohms_law.solve_for_voltage",
      "cap.ohms_law.solve_for_current",
      "cap.ohms_law.solve_for_resistance",
      "cap.ohms_law.select_rearrangement",
      "cap.ohms_law.check_plausibility",
    ],
    requiresRemediationClearance: true,
    exitSummary:
      "The learner has calculated voltage, current and resistance from V = I x R, selected the correct rearrangement for an unknown quantity, judged the plausibility of a result, and -- if either governed misconception was detected -- cleared the remediation route before completion.",
  },
  presentationModes: ["learn", "review"],
  contentRelease: "lesson-plan-pilot-v1",
};

export { FORMULA_OHMS_LAW, MNEMONIC_VIR_TRIANGLE, WORKED_OHMS_LAW_SOLVE_CURRENT, WORKED_OHMS_LAW_SOLVE_RESISTANCE, WORKED_OHMS_LAW_SOLVE_VOLTAGE };

// =========================================================================
// What this module bundles locally -- the "PROVING-SLICE LOCAL SEEDING"
// payload (task brief §25B): everything the real Ohm's Law lesson needs,
// bundled directly into the app for this proving slice rather than
// downloaded, but tracked through the same local-content-availability
// contract (./content-availability.ts, ./local-content-store.ts) real
// downloaded content will use later -- so that contract, not "is it
// bundled", is what the Lesson Player actually depends on.
// =========================================================================

export const OHMS_LAW_LOCAL_CONTENT_INVENTORY = {
  questionBlueprintIds: new Set(LESSON_QUESTION_BLUEPRINTS.map((b) => b.id)),
  formulaFamilyIds: new Set([FORMULA_OHMS_LAW.id]),
  workedExampleBlueprintIds: new Set([
    WORKED_OHMS_LAW_SOLVE_VOLTAGE.id,
    WORKED_OHMS_LAW_SOLVE_CURRENT.id,
    WORKED_OHMS_LAW_SOLVE_RESISTANCE.id,
  ]),
  visualAidBlueprintIds: new Set([MNEMONIC_VIR_TRIANGLE.id]),
  diagramBlueprintIds: new Set<string>(),
  assertionIdentifiersWithStatements: new Set(Object.keys(ASSERTION_STATEMENTS)),
  misconceptionIdentifiersWithDescriptions: new Set(Object.keys(MISCONCEPTION_DESCRIPTIONS)),
} as const;
