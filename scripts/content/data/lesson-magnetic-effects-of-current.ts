/**
 * CC-11 Workstream B: second of a four-lesson LO5 sequence. Scope: AC5.3
 * (the magnetic effects of current -- field production, force on a
 * conductor, electromagnetism, and EMF vs. terminal voltage). Follows
 * lesson-magnetism-fundamentals.ts, which taught static-magnet
 * fundamentals (attraction/repulsion, flux/flux-density); this lesson
 * moves to what a CURRENT does magnetically. Every assertion/family/
 * capability/formula/diagram/question-blueprint id below is a real, live
 * reference into cc05a-pedagogy-unit202.ts / cc04-unit202-electrical-
 * science.ts, cross-checked mechanically by
 * scripts/content/validate-lesson-plan.ts. No new knowledge, capability
 * or blueprint was authored.
 *
 * Diagram wiring (task instruction 2): the field-direction teaching step
 * and its guided question both carry
 * representation.diagramBlueprintId: "magnetic.field_conductor_direction"
 * (rendered by RightHandGripRuleDiagram); the force-direction teaching
 * step and its guided question both carry "motor.force_field_current"
 * (rendered by MagneticForceDiagram). Both renderers already exist; the
 * Lesson Player's generic diagram-rendering gap (PROJECT-STATUS.md CC-10
 * §5a) is a separate, parallel workstream's concern, not this one's.
 *
 * CC-11.1: closes the two gaps CC-11 flagged -- AC5.3's
 * OFFICIAL_TEACHING_INTERPRETATION calculation obligations
 * "force-on-conductor-calculation" (F = B I L, Fleming's left-hand rule)
 * and "induced-emf-calculation" (e = B L v, Fleming's right-hand rule)
 * previously had no formula family, worked example, question blueprint
 * or capability anywhere. Both now exist
 * (cap.magnetism.calculate_force_on_conductor /
 * magnetism.calculate_force_on_conductor;
 * cap.emf.calculate_motional_emf / emf.calculate_motional_emf) and are
 * taught + practised directly in this lesson
 * (worked_force_on_conductor / guided_calculate_force_on_conductor;
 * worked_motional_emf / guided_calculate_motional_emf).
 *
 * CC-11.3: e = B L v's own governing "mutually perpendicular" geometry
 * (B, L and v) had a formula card but zero visual support -- closed
 * with `emf.motional_emf_geometry` (MotionalEmfDiagram.tsx), wired into
 * the EMF concept step and both the worked example and guided
 * calculation. `contentRelease` moved to `release.unit202.v7`; see
 * lesson-cc11-3-historical-snapshot.ts for how v5/v6's own immutable
 * membership remains resolvable against this lesson's pre-CC-11.3
 * content.
 *
 * CC-12: adds a genuine root-cause diagnostic chain after
 * `guided_interpret_force_direction` (task brief §11) -- an incorrect
 * force-direction answer is ambiguous (could trace to current-convention
 * confusion, general Fleming's-rule finger-assignment confusion, or a
 * simple slip), so it is never assumed to BE
 * MIS-EL-ELECTRON-CURRENT-DIRECTION-CONFUSION-001 merely because that is
 * the blueprint's own suggestive target. The new `incorrect_answer`
 * branch trigger (content-schema) routes any such ambiguous wrong answer
 * to `diagnose_force_direction_error`, a real, separate, governed
 * discriminating check (`magnetism.diagnose_current_convention`) -- wrong
 * there is DIRECT evidence of the current-convention misconception
 * (-> `remediation_current_convention`, re-teach + re-check); right there
 * rules that hypothesis out, converging by elimination on Fleming's-rule
 * finger-assignment as the more likely residual cause (surfaced in that
 * step's own layered feedback, never asserted as confirmed evidence).
 * Both paths converge at `recheck_force_direction` -- a FRESH equivalent
 * question (the same reused `magnetism.interpret_force_direction`
 * blueprint, deterministically reseeded by its own new step id, never a
 * repeat of the original question) proving whether the weakness was
 * actually repaired. `progressiveReveal: true` is set on every step in
 * this chain plus the original guided question, demonstrating the new
 * layered (Quick/Explain/Deeper) feedback panel end-to-end. See
 * `packages/learning-engine/src/branching.ts` and
 * `apps/mobile/src/lib/lesson-session/lesson-controller.ts`'s
 * `resolveBranchDestination` for exactly how the chain resolves; neither
 * needed structural change beyond the one new trigger. `contentRelease`
 * moved to `release.unit202.v8`; see
 * lesson-cc12-v7-historical-snapshot.ts for how v7's own immutable
 * membership remains resolvable against this lesson's pre-CC-12 content.
 */

import type { LessonPlan } from "@alp/content-schema";

export const LESSON_MAGNETIC_EFFECTS_OF_CURRENT: LessonPlan = {
  id: "lesson.magnetism.effects-of-current",
  schemaVersion: 1,
  version: 1,
  title: "Magnetic Effects of Current",
  learnerFacingDescription:
    "Understand the magnetic field a current-carrying conductor produces and its direction, the force on a conductor in a field, electromagnetism, and the difference between EMF and terminal voltage.",
  curriculumUnit: "City & Guilds 2365-02 Unit 202 -- Principles of Electrical Science",
  prerequisiteKnowledge: ["electrical.ohms_law", "electrical.magnetism_and_electromagnetism"],
  targetAssertionFamilyIds: ["electrical.magnetism_and_electromagnetism", "electrical.emf_and_generation"],
  remediationEligibility: [],
  targetAssertionIdentifiers: [
    "EL-CONCEPT-MAGNETIC-FIELD-CURRENT-001",
    "EL-CONCEPT-FIELD-DIRECTION-RULE-001",
    "EL-CONCEPT-FORCE-ON-CONDUCTOR-001",
    "EL-REL-FORCE-ON-CONDUCTOR-001",
    "EL-CONCEPT-PAGE-DIRECTION-NOTATION-001",
    "EL-CONCEPT-FLEMING-LEFT-HAND-001",
    "EL-CONCEPT-ELECTROMAGNETISM-001",
    "EL-CONCEPT-EMF-001",
    "EL-CONCEPT-TERMINAL-VOLTAGE-001",
    "EL-REL-INDUCED-EMF-001",
    "EL-CONCEPT-FLEMING-RIGHT-HAND-001",
  ],
  targetCapabilityIds: [
    "cap.magnetism.interpret_field_direction",
    "cap.magnetism.interpret_force_direction",
    "cap.magnetism.calculate_force_on_conductor",
    "cap.magnetism.recognise_concept",
    "cap.emf.recognise_emf_terminal_voltage",
    "cap.emf.calculate_motional_emf",
  ],
  estimatedDurationMinutes: 18,
  instructionalStrategy:
    "Field production and direction come first (the direct consequence of a current existing at all), then force on a conductor in a field (what that field, once produced, can DO -- the motor principle's foundation), then electromagnetism is named explicitly as the umbrella term for everything just covered. EMF vs. terminal voltage closes the lesson as a distinct, commonly-confused pair, checked directly against its governed misconception (MIS-EL-EMF-VOLTAGE-CONFUSION-001) with an explicit remediation route rather than assuming the distinction has landed.",
  steps: [
    {
      id: "orientation",
      type: "orientation",
      purpose: "Frame this lesson as answering: what does a current actually DO magnetically -- and why does that let us build motors and generators?",
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
      id: "concept_field_from_current",
      type: "concept_explanation",
      purpose:
        "State that a current-carrying conductor produces a magnetic field, and how to find that field's direction (Maxwell's screw rule / right-hand grip rule). Also teaches the ×/• into/out-of-page diagram convention (CC-12G) before the first diagram that uses it, so every later use in this lesson (this diagram and the force-direction diagram) is never unexplained.",
      requirement: "required",
      teaches: ["EL-CONCEPT-MAGNETIC-FIELD-CURRENT-001", "EL-CONCEPT-FIELD-DIRECTION-RULE-001", "EL-CONCEPT-PAGE-DIRECTION-NOTATION-001"],
      reinforces: [],
      tests: [],
      assertionFamilyId: "electrical.magnetism_and_electromagnetism",
      capabilityIds: [],
      misconceptionTargets: [],
      representation: { diagramBlueprintId: "magnetic.field_conductor_direction" },
      presentation: { interactionRequired: false, answerReveal: "not_applicable", contentMayScroll: true, progressiveReveal: false },
      scaffoldingLevel: "guided",
      cognitiveDemand: "introductory",
      feedback: { mode: "immediate", explainWhy: false },
      completionCondition: "view_acknowledged",
      branchRoutes: [],
      evidenceEmitted: [],
    },
    {
      id: "guided_interpret_field_direction",
      type: "guided_interaction",
      purpose: "Interpret the direction of the magnetic field produced by a current-carrying conductor from a diagram.",
      requirement: "required",
      teaches: [],
      reinforces: ["EL-CONCEPT-FIELD-DIRECTION-RULE-001"],
      tests: ["EL-CONCEPT-MAGNETIC-FIELD-CURRENT-001"],
      assertionFamilyId: "electrical.magnetism_and_electromagnetism",
      capabilityIds: ["cap.magnetism.interpret_field_direction"],
      misconceptionTargets: [],
      representation: { diagramBlueprintId: "magnetic.field_conductor_direction" },
      questionBlueprintId: "magnetism.interpret_field_direction",
      presentation: { interactionRequired: true, interactionRole: "interpret", answerReveal: "after_submission", contentMayScroll: false, progressiveReveal: false },
      scaffoldingLevel: "guided",
      cognitiveDemand: "advanced",
      feedback: { mode: "immediate", explainWhy: true },
      completionCondition: "correct_answer_required",
      branchRoutes: [],
      evidenceEmitted: ["cap.magnetism.interpret_field_direction"],
    },
    {
      id: "concept_force_on_conductor",
      type: "concept_explanation",
      purpose: "Describe the force a current-carrying conductor experiences in a magnetic field (F = B I L) and its direction (Fleming's left-hand rule) -- the motor principle's foundation.",
      requirement: "required",
      teaches: ["EL-CONCEPT-FORCE-ON-CONDUCTOR-001", "EL-REL-FORCE-ON-CONDUCTOR-001", "EL-CONCEPT-FLEMING-LEFT-HAND-001"],
      reinforces: ["EL-CONCEPT-MAGNETIC-FIELD-CURRENT-001"],
      tests: [],
      assertionFamilyId: "electrical.magnetism_and_electromagnetism",
      capabilityIds: [],
      misconceptionTargets: [],
      representation: { diagramBlueprintId: "motor.force_field_current" },
      presentation: { interactionRequired: false, answerReveal: "not_applicable", contentMayScroll: true, progressiveReveal: false },
      scaffoldingLevel: "guided",
      cognitiveDemand: "intermediate",
      feedback: { mode: "immediate", explainWhy: false },
      completionCondition: "view_acknowledged",
      branchRoutes: [],
      evidenceEmitted: [],
    },
    {
      id: "worked_force_on_conductor",
      type: "worked_example",
      purpose: "Model calculating the force on a current-carrying conductor using F = B I L, before the learner practises it unaided.",
      requirement: "required",
      teaches: [],
      reinforces: [],
      tests: [],
      assertionFamilyId: "electrical.magnetism_and_electromagnetism",
      capabilityIds: ["cap.magnetism.calculate_force_on_conductor"],
      misconceptionTargets: [],
      representation: { formulaFamilyId: "formula.force_on_conductor", workedExampleBlueprintId: "worked.force_on_conductor.calculate" },
      presentation: { interactionRequired: true, interactionRole: "predict", answerReveal: "after_submission", contentMayScroll: true, progressiveReveal: true },
      scaffoldingLevel: "guided",
      cognitiveDemand: "intermediate",
      feedback: { mode: "immediate", explainWhy: true },
      completionCondition: "view_acknowledged",
      branchRoutes: [],
      evidenceEmitted: [],
    },
    {
      id: "guided_calculate_force_on_conductor",
      type: "guided_interaction",
      purpose: "Calculate the force on a straight current-carrying conductor at right angles to a magnetic field, using F = B I L.",
      requirement: "required",
      teaches: [],
      reinforces: [],
      tests: ["EL-REL-FORCE-ON-CONDUCTOR-001"],
      assertionFamilyId: "electrical.magnetism_and_electromagnetism",
      capabilityIds: ["cap.magnetism.calculate_force_on_conductor"],
      misconceptionTargets: [],
      representation: { formulaFamilyId: "formula.force_on_conductor" },
      questionBlueprintId: "magnetism.calculate_force_on_conductor",
      presentation: { interactionRequired: true, interactionRole: "calculate", answerReveal: "after_submission", contentMayScroll: false, progressiveReveal: false },
      scaffoldingLevel: "guided",
      cognitiveDemand: "advanced",
      feedback: { mode: "immediate", explainWhy: true },
      completionCondition: "correct_answer_required",
      branchRoutes: [],
      evidenceEmitted: ["cap.magnetism.calculate_force_on_conductor"],
    },
    {
      id: "guided_interpret_force_direction",
      type: "guided_interaction",
      purpose: "Interpret the direction of the force on a current-carrying conductor in a magnetic field from a diagram.",
      requirement: "required",
      teaches: [],
      reinforces: [],
      tests: ["EL-CONCEPT-FORCE-ON-CONDUCTOR-001"],
      assertionFamilyId: "electrical.magnetism_and_electromagnetism",
      capabilityIds: ["cap.magnetism.interpret_force_direction"],
      misconceptionTargets: [{ misconceptionIdentifier: "MIS-EL-ELECTRON-CURRENT-DIRECTION-CONFUSION-001", evidenceStrength: "suggestive" }],
      representation: { diagramBlueprintId: "motor.force_field_current" },
      questionBlueprintId: "magnetism.interpret_force_direction",
      presentation: { interactionRequired: true, interactionRole: "interpret", answerReveal: "after_submission", contentMayScroll: false, progressiveReveal: true },
      scaffoldingLevel: "guided",
      cognitiveDemand: "advanced",
      feedback: { mode: "immediate", explainWhy: true },
      completionCondition: "correct_answer_required",
      // CC-12: the declared misconceptionTarget above is only SUGGESTIVE
      // and has no matching misconception_detected route here on purpose
      // -- an ambiguous wrong answer must not be silently treated as
      // confirmed evidence of that one specific misconception. Every
      // incorrect answer instead falls back to a real diagnostic check.
      branchRoutes: [
        {
          trigger: "incorrect_answer",
          destinationStepId: "diagnose_force_direction_error",
          description: "Ambiguous wrong answer -- run a targeted diagnostic before assuming which cause, if any, applies (task brief §11).",
        },
      ],
      evidenceEmitted: ["cap.magnetism.interpret_force_direction"],
    },
    {
      id: "diagnose_force_direction_error",
      type: "misconception_discrimination",
      purpose: "Discriminate whether an ambiguous wrong force-direction answer traces to current-convention confusion, before assuming it does or does not.",
      requirement: "conditional_remediation_only",
      teaches: [],
      reinforces: ["EL-CONCEPT-FLEMING-LEFT-HAND-001"],
      tests: [],
      assertionFamilyId: "electrical.magnetism_and_electromagnetism",
      capabilityIds: ["cap.magnetism.interpret_force_direction"],
      // The FIRST entry is what `evaluateAnswer()` actually attaches on a
      // wrong answer (governed engine behaviour, unaffected by declaring a
      // second entry). The second entry exists so the mobile content
      // generator bundles MIS-EL-FLEMING-FINGER-ASSIGNMENT-CONFUSION-001's
      // governed description at all -- it is never engine-attached here,
      // only surfaced as an explicitly-informational "Deeper" feedback
      // hint on the residual (correct-answer) path, per this lesson's own
      // header comment.
      misconceptionTargets: [
        { misconceptionIdentifier: "MIS-EL-ELECTRON-CURRENT-DIRECTION-CONFUSION-001", evidenceStrength: "direct" },
        { misconceptionIdentifier: "MIS-EL-FLEMING-FINGER-ASSIGNMENT-CONFUSION-001", evidenceStrength: "suggestive" },
      ],
      representation: {},
      questionBlueprintId: "magnetism.diagnose_current_convention",
      presentation: { interactionRequired: true, interactionRole: "compare", answerReveal: "after_submission", contentMayScroll: false, progressiveReveal: true },
      scaffoldingLevel: "standard",
      cognitiveDemand: "diagnostic",
      feedback: { mode: "immediate", explainWhy: true },
      completionCondition: "correct_answer_required",
      branchRoutes: [
        {
          trigger: "misconception_detected",
          misconceptionIdentifier: "MIS-EL-ELECTRON-CURRENT-DIRECTION-CONFUSION-001",
          destinationStepId: "remediation_current_convention",
          description: "Current-convention confusion confirmed by a direct discriminating check -- reteach before rechecking.",
        },
        {
          trigger: "remediation_cleared",
          destinationStepId: "recheck_force_direction",
          description: "Current-convention hypothesis ruled out (answered correctly) -- proceed straight to the fresh recheck; the residual Fleming's-rule finger-assignment hypothesis is surfaced in this step's own deeper feedback layer, not asserted as confirmed evidence.",
        },
      ],
      evidenceEmitted: ["cap.magnetism.interpret_force_direction"],
    },
    {
      id: "remediation_current_convention",
      type: "remediation",
      purpose: "Reteach that Fleming's left-hand rule always uses conventional current, then require a fresh correct discrimination before rechecking force direction. Entered only via a branch route -- never part of the default linear path.",
      requirement: "conditional_remediation_only",
      teaches: ["EL-CONCEPT-FLEMING-LEFT-HAND-001"],
      reinforces: [],
      tests: [],
      assertionFamilyId: "electrical.magnetism_and_electromagnetism",
      capabilityIds: ["cap.magnetism.interpret_force_direction"],
      misconceptionTargets: [{ misconceptionIdentifier: "MIS-EL-ELECTRON-CURRENT-DIRECTION-CONFUSION-001", evidenceStrength: "direct" }],
      representation: {},
      questionBlueprintId: "magnetism.diagnose_current_convention",
      presentation: { interactionRequired: true, interactionRole: "compare", answerReveal: "after_submission", contentMayScroll: true, progressiveReveal: true },
      scaffoldingLevel: "guided",
      cognitiveDemand: "intermediate",
      feedback: { mode: "immediate", explainWhy: true },
      completionCondition: "correct_answer_required",
      branchRoutes: [
        {
          trigger: "remediation_cleared",
          destinationStepId: "recheck_force_direction",
          description: "Remediation cleared -- proceed to the fresh recheck of force direction.",
        },
      ],
      evidenceEmitted: ["cap.magnetism.interpret_force_direction"],
    },
    {
      id: "recheck_force_direction",
      type: "retrieval_check",
      purpose: "Ask a fresh, equivalent force-direction question (never a repeat of the original) to check whether the weakness identified above has actually been repaired.",
      requirement: "conditional_remediation_only",
      teaches: [],
      reinforces: [],
      tests: ["EL-CONCEPT-FORCE-ON-CONDUCTOR-001"],
      assertionFamilyId: "electrical.magnetism_and_electromagnetism",
      capabilityIds: ["cap.magnetism.interpret_force_direction"],
      misconceptionTargets: [],
      representation: { diagramBlueprintId: "motor.force_field_current" },
      // Reusing the SAME blueprint as guided_interpret_force_direction is
      // deliberate: the deterministic engine reseeds from this step's own
      // id, so it generates a genuinely different pole/current-direction
      // combination in the large majority of cases -- a fresh but
      // equivalent question, never a byte-identical repeat (task brief
      // §11: "Do not simply repeat the same question").
      questionBlueprintId: "magnetism.interpret_force_direction",
      presentation: { interactionRequired: true, interactionRole: "interpret", answerReveal: "after_submission", contentMayScroll: false, progressiveReveal: true },
      scaffoldingLevel: "independent",
      cognitiveDemand: "advanced",
      feedback: { mode: "immediate", explainWhy: true },
      completionCondition: "correct_answer_required",
      branchRoutes: [],
      evidenceEmitted: ["cap.magnetism.interpret_force_direction"],
    },
    {
      id: "concept_electromagnetism",
      type: "concept_explanation",
      purpose: "Name electromagnetism as the umbrella relationship covering everything just seen: current produces a field, and a field exerts force on current.",
      requirement: "required",
      teaches: ["EL-CONCEPT-ELECTROMAGNETISM-001"],
      reinforces: ["EL-CONCEPT-MAGNETIC-FIELD-CURRENT-001", "EL-CONCEPT-FORCE-ON-CONDUCTOR-001"],
      tests: [],
      assertionFamilyId: "electrical.magnetism_and_electromagnetism",
      capabilityIds: ["cap.magnetism.recognise_concept"],
      misconceptionTargets: [],
      representation: {},
      presentation: { interactionRequired: false, answerReveal: "not_applicable", contentMayScroll: true, progressiveReveal: false },
      scaffoldingLevel: "guided",
      cognitiveDemand: "introductory",
      feedback: { mode: "immediate", explainWhy: false },
      completionCondition: "view_acknowledged",
      branchRoutes: [],
      evidenceEmitted: [],
    },
    {
      id: "guided_recognise_electromagnetism",
      type: "guided_interaction",
      purpose: "Recognise electromagnetism from its definition.",
      requirement: "required",
      teaches: [],
      reinforces: [],
      tests: ["EL-CONCEPT-ELECTROMAGNETISM-001"],
      assertionFamilyId: "electrical.magnetism_and_electromagnetism",
      capabilityIds: ["cap.magnetism.recognise_concept"],
      misconceptionTargets: [],
      representation: {},
      questionBlueprintId: "magnetism.recognise_concept",
      presentation: { interactionRequired: true, interactionRole: "identify", answerReveal: "after_submission", contentMayScroll: false, progressiveReveal: false },
      scaffoldingLevel: "guided",
      cognitiveDemand: "introductory",
      feedback: { mode: "immediate", explainWhy: true },
      completionCondition: "correct_answer_required",
      branchRoutes: [],
      evidenceEmitted: ["cap.magnetism.recognise_concept"],
    },
    {
      id: "concept_emf_and_terminal_voltage",
      type: "concept_explanation",
      purpose: "Describe electromotive force (EMF) and distinguish it from terminal voltage, and introduce induced EMF (e = B L v via Fleming's right-hand rule) as the mechanism a moving conductor uses to generate it.",
      requirement: "required",
      teaches: ["EL-CONCEPT-EMF-001", "EL-CONCEPT-TERMINAL-VOLTAGE-001", "EL-REL-INDUCED-EMF-001", "EL-CONCEPT-FLEMING-RIGHT-HAND-001"],
      reinforces: ["EL-CONCEPT-ELECTROMAGNETISM-001"],
      tests: [],
      assertionFamilyId: "electrical.emf_and_generation",
      capabilityIds: ["cap.emf.recognise_emf_terminal_voltage"],
      misconceptionTargets: [],
      representation: { diagramBlueprintId: "emf.motional_emf_geometry" },
      presentation: { interactionRequired: false, answerReveal: "not_applicable", contentMayScroll: true, progressiveReveal: false },
      scaffoldingLevel: "guided",
      cognitiveDemand: "intermediate",
      feedback: { mode: "immediate", explainWhy: false },
      completionCondition: "view_acknowledged",
      branchRoutes: [],
      evidenceEmitted: [],
    },
    {
      id: "worked_motional_emf",
      type: "worked_example",
      purpose: "Model calculating the EMF induced in a conductor moving through a magnetic field using e = B L v, before the learner practises it unaided.",
      requirement: "required",
      teaches: [],
      reinforces: [],
      tests: [],
      assertionFamilyId: "electrical.emf_and_generation",
      capabilityIds: ["cap.emf.calculate_motional_emf"],
      misconceptionTargets: [],
      representation: {
        formulaFamilyId: "formula.motional_emf",
        workedExampleBlueprintId: "worked.motional_emf.calculate",
        diagramBlueprintId: "emf.motional_emf_geometry",
      },
      presentation: { interactionRequired: true, interactionRole: "predict", answerReveal: "after_submission", contentMayScroll: true, progressiveReveal: true },
      scaffoldingLevel: "guided",
      cognitiveDemand: "intermediate",
      feedback: { mode: "immediate", explainWhy: true },
      completionCondition: "view_acknowledged",
      branchRoutes: [],
      evidenceEmitted: [],
    },
    {
      id: "guided_calculate_motional_emf",
      type: "guided_interaction",
      purpose: "Calculate the EMF induced in a straight conductor moving through a magnetic field, using e = B L v.",
      requirement: "required",
      teaches: [],
      reinforces: [],
      tests: ["EL-REL-INDUCED-EMF-001"],
      assertionFamilyId: "electrical.emf_and_generation",
      capabilityIds: ["cap.emf.calculate_motional_emf"],
      misconceptionTargets: [],
      representation: { formulaFamilyId: "formula.motional_emf", diagramBlueprintId: "emf.motional_emf_geometry" },
      questionBlueprintId: "emf.calculate_motional_emf",
      presentation: { interactionRequired: true, interactionRole: "calculate", answerReveal: "after_submission", contentMayScroll: false, progressiveReveal: false },
      scaffoldingLevel: "guided",
      cognitiveDemand: "advanced",
      feedback: { mode: "immediate", explainWhy: true },
      completionCondition: "correct_answer_required",
      branchRoutes: [],
      evidenceEmitted: ["cap.emf.calculate_motional_emf"],
    },
    {
      id: "misconception_check_emf_terminal_voltage",
      type: "misconception_discrimination",
      purpose: "Directly test for the specific, governed EMF/terminal-voltage confusion rather than assuming its absence.",
      requirement: "required",
      teaches: [],
      reinforces: [],
      tests: ["EL-CONCEPT-EMF-001", "EL-CONCEPT-TERMINAL-VOLTAGE-001"],
      assertionFamilyId: "electrical.emf_and_generation",
      capabilityIds: ["cap.emf.recognise_emf_terminal_voltage"],
      misconceptionTargets: [{ misconceptionIdentifier: "MIS-EL-EMF-VOLTAGE-CONFUSION-001", evidenceStrength: "direct" }],
      representation: {},
      questionBlueprintId: "emf.distinguish_emf_terminal_voltage",
      presentation: { interactionRequired: true, interactionRole: "compare", answerReveal: "after_submission", contentMayScroll: false, progressiveReveal: false },
      scaffoldingLevel: "standard",
      cognitiveDemand: "advanced",
      feedback: { mode: "immediate", explainWhy: true },
      completionCondition: "correct_answer_required",
      branchRoutes: [
        {
          trigger: "misconception_detected",
          misconceptionIdentifier: "MIS-EL-EMF-VOLTAGE-CONFUSION-001",
          destinationStepId: "remediation_emf_terminal_voltage",
          description: "Route to explicit EMF-vs-terminal-voltage remediation before continuing.",
        },
      ],
      evidenceEmitted: ["cap.emf.recognise_emf_terminal_voltage"],
    },
    {
      id: "remediation_emf_terminal_voltage",
      type: "remediation",
      purpose: "Reteach the EMF/terminal-voltage distinction, then require a fresh correct discrimination before returning to the main sequence. Entered only via a branch route -- never part of the default linear path.",
      requirement: "conditional_remediation_only",
      teaches: ["EL-CONCEPT-EMF-001", "EL-CONCEPT-TERMINAL-VOLTAGE-001"],
      reinforces: [],
      tests: ["EL-CONCEPT-EMF-001", "EL-CONCEPT-TERMINAL-VOLTAGE-001"],
      assertionFamilyId: "electrical.emf_and_generation",
      capabilityIds: ["cap.emf.recognise_emf_terminal_voltage"],
      misconceptionTargets: [{ misconceptionIdentifier: "MIS-EL-EMF-VOLTAGE-CONFUSION-001", evidenceStrength: "direct" }],
      representation: {},
      questionBlueprintId: "emf.distinguish_emf_terminal_voltage",
      presentation: { interactionRequired: true, interactionRole: "compare", answerReveal: "after_submission", contentMayScroll: true, progressiveReveal: true },
      scaffoldingLevel: "guided",
      cognitiveDemand: "intermediate",
      feedback: { mode: "immediate", explainWhy: true },
      completionCondition: "correct_answer_required",
      branchRoutes: [
        {
          trigger: "remediation_cleared",
          destinationStepId: "retrieval_check",
          description: "Remediation cleared -- resume the main sequence at the retrieval check.",
        },
      ],
      evidenceEmitted: ["cap.emf.recognise_emf_terminal_voltage"],
    },
    {
      id: "retrieval_check",
      type: "retrieval_check",
      purpose: "Short delayed retrieval of the EMF/terminal-voltage distinction to strengthen retention before the lesson ends.",
      requirement: "required",
      teaches: [],
      reinforces: [],
      tests: ["EL-CONCEPT-EMF-001", "EL-CONCEPT-TERMINAL-VOLTAGE-001"],
      assertionFamilyId: "electrical.emf_and_generation",
      capabilityIds: ["cap.emf.recognise_emf_terminal_voltage"],
      misconceptionTargets: [],
      representation: {},
      questionBlueprintId: "emf.distinguish_emf_terminal_voltage",
      presentation: { interactionRequired: true, interactionRole: "compare", answerReveal: "after_submission", contentMayScroll: false, progressiveReveal: false },
      scaffoldingLevel: "independent",
      cognitiveDemand: "advanced",
      feedback: { mode: "immediate", explainWhy: true },
      completionCondition: "correct_answer_required",
      branchRoutes: [],
      evidenceEmitted: ["cap.emf.recognise_emf_terminal_voltage"],
    },
    {
      id: "recap",
      type: "recap",
      purpose: "Summarise field production/direction, force on a conductor, electromagnetism, and EMF vs. terminal voltage.",
      requirement: "required",
      teaches: [],
      reinforces: ["EL-CONCEPT-MAGNETIC-FIELD-CURRENT-001", "EL-CONCEPT-FORCE-ON-CONDUCTOR-001", "EL-CONCEPT-ELECTROMAGNETISM-001", "EL-CONCEPT-EMF-001", "EL-CONCEPT-TERMINAL-VOLTAGE-001"],
      tests: [],
      assertionFamilyId: "electrical.magnetism_and_electromagnetism",
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
  misconceptionTargets: [
    { misconceptionIdentifier: "MIS-EL-ELECTRON-CURRENT-DIRECTION-CONFUSION-001", evidenceStrength: "suggestive" },
    { misconceptionIdentifier: "MIS-EL-EMF-VOLTAGE-CONFUSION-001", evidenceStrength: "direct" },
  ],
  retrievalTags: ["electrical.magnetism_and_electromagnetism", "electrical.emf_and_generation"],
  completionCriteria: {
    requiredStepIds: [
      "orientation",
      "concept_field_from_current",
      "guided_interpret_field_direction",
      "concept_force_on_conductor",
      "worked_force_on_conductor",
      "guided_calculate_force_on_conductor",
      "guided_interpret_force_direction",
      "concept_electromagnetism",
      "guided_recognise_electromagnetism",
      "concept_emf_and_terminal_voltage",
      "worked_motional_emf",
      "guided_calculate_motional_emf",
      "misconception_check_emf_terminal_voltage",
      "retrieval_check",
      "recap",
      "exit_completion",
    ],
    requiredCapabilityEvidence: [
      "cap.magnetism.interpret_field_direction",
      "cap.magnetism.interpret_force_direction",
      "cap.magnetism.calculate_force_on_conductor",
      "cap.magnetism.recognise_concept",
      "cap.emf.recognise_emf_terminal_voltage",
      "cap.emf.calculate_motional_emf",
    ],
    // interpret_field_direction, interpret_force_direction,
    // calculate_force_on_conductor, calculate_motional_emf and
    // recognise_concept are each only evidenced through guided steps in
    // THIS lesson's own step design (never independently or via
    // transfer) so cannot structurally reach a secure mastery tier here
    // -- same rationale as lesson-ohms-law.ts's excluded guided-only
    // capability. recognise_emf_terminal_voltage IS independently
    // re-evidenced at the retrieval_check step, so it remains eligible.
    masteryGateCapabilityIds: ["cap.emf.recognise_emf_terminal_voltage"],
    requiresRemediationClearance: true,
    exitSummary:
      "The learner has interpreted the direction of the magnetic field around a current-carrying conductor, calculated the force on a conductor in a field, recognised electromagnetism, calculated induced EMF from a moving conductor, and distinguished EMF from terminal voltage -- clearing remediation if that misconception was detected.",
  },
  presentationModes: ["learn", "review"],
  contentRelease: "release.unit202.v8",
};

export const lessons = [LESSON_MAGNETIC_EFFECTS_OF_CURRENT];
