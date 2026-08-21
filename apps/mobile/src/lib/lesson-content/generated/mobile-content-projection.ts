/**
 * GENERATED FILE -- DO NOT EDIT.
 *
 * Deterministic mobile learner-runtime content projection for governed
 * content release "release.unit202.v2".
 *
 * Source of truth: the governed content under scripts/content/data.
 * Regenerate with:  npm run content:mobile:generate
 * CI currency gate: npm run content:mobile:check
 *
 * Factual learner-facing content must NEVER be edited here -- edit the
 * governed authoring content and regenerate (CC-06D, Correction B).
 */
import type { MobileContentProjection } from "@alp/content-schema";

export const MOBILE_CONTENT_PROJECTION: MobileContentProjection = {
  "schemaVersion": 2,
  "contentRelease": {
    "id": "release.unit202.v2",
    "questionBlueprintVersion": 1
  },
  "lessons": [
    {
      "id": "lesson.electrical.ohms-law",
      "schemaVersion": 1,
      "version": 1,
      "title": "Ohm's Law",
      "learnerFacingDescription": "Understand how voltage, current and resistance relate through V = I x R, and use that relationship confidently in either direction.",
      "curriculumUnit": "City & Guilds 2365-02 Unit 202 -- Principles of Electrical Science",
      "prerequisiteKnowledge": [
        "foundational.algebraic_technique",
        "foundational.arithmetic_technique",
        "foundational.proportion_and_units",
        "electrical.si_units",
        "electrical.core_quantities"
      ],
      "targetAssertionFamilyIds": [
        "electrical.ohms_law"
      ],
      "targetAssertionIdentifiers": [
        "EL-OHM-RELATIONSHIP-001",
        "EL-OHM-PROPORTIONALITY-001",
        "EL-OHM-REARRANGE-001",
        "EL-OHM-SOLVE-V-001",
        "EL-OHM-SOLVE-I-001",
        "EL-OHM-SOLVE-R-001",
        "EL-OHM-SELECT-RELATIONSHIP-001"
      ],
      "targetCapabilityIds": [
        "cap.ohms_law.recognise_relationship",
        "cap.ohms_law.solve_for_voltage",
        "cap.ohms_law.solve_for_current",
        "cap.ohms_law.solve_for_resistance",
        "cap.ohms_law.select_rearrangement",
        "cap.ohms_law.apply_correct_unit",
        "cap.ohms_law.apply_substitution",
        "cap.ohms_law.check_plausibility",
        "cap.ohms_law.diagnose_rearrangement_error",
        "cap.ohms_law.diagnose_wrong_operation"
      ],
      "remediationEligibility": [],
      "estimatedDurationMinutes": 20,
      "instructionalStrategy": "Concept introduced once, then practised immediately through calculation, flexible rearrangement and plausibility judgement; two governed misconceptions are actively discriminated for (not merely hoped not to occur), each routing to the same explicit remediation step before the learner is allowed to exit; independent-question and transfer steps prove the skill generalises rather than being memorised for one direction only.",
      "steps": [
        {
          "id": "orientation",
          "type": "orientation",
          "purpose": "Frame why the V/I/R relationship matters for real electrical work, not just as an abstract formula.",
          "requirement": "required",
          "teaches": [],
          "reinforces": [],
          "tests": [],
          "capabilityIds": [],
          "misconceptionTargets": [],
          "representation": {},
          "presentation": {
            "interactionRequired": false,
            "answerReveal": "not_applicable",
            "contentMayScroll": false,
            "progressiveReveal": false
          },
          "scaffoldingLevel": "guided",
          "cognitiveDemand": "introductory",
          "feedback": {
            "mode": "immediate",
            "explainWhy": false
          },
          "completionCondition": "view_acknowledged",
          "branchRoutes": [],
          "evidenceEmitted": []
        },
        {
          "id": "activate_prior_knowledge",
          "type": "guided_interaction",
          "purpose": "Activate prior knowledge of voltage/current/resistance as distinct, related quantities before the formal relationship is stated -- a predictive DO, not a re-explanation.",
          "requirement": "required",
          "teaches": [],
          "reinforces": [
            "EL-CONCEPT-VOLTAGE-001",
            "EL-CONCEPT-CURRENT-001",
            "EL-CONCEPT-RESISTANCE-001"
          ],
          "tests": [],
          "assertionFamilyId": "electrical.core_quantities",
          "capabilityIds": [],
          "misconceptionTargets": [],
          "representation": {},
          "presentation": {
            "interactionRequired": true,
            "interactionRole": "predict",
            "answerReveal": "after_submission",
            "contentMayScroll": false,
            "progressiveReveal": false
          },
          "scaffoldingLevel": "guided",
          "cognitiveDemand": "introductory",
          "feedback": {
            "mode": "immediate",
            "explainWhy": true
          },
          "completionCondition": "answer_submitted",
          "branchRoutes": [],
          "evidenceEmitted": []
        },
        {
          "id": "introduce_relationship",
          "type": "concept_explanation",
          "purpose": "State the canonical relationship V = I x R and what it means physically.",
          "requirement": "required",
          "teaches": [
            "EL-OHM-RELATIONSHIP-001"
          ],
          "reinforces": [],
          "tests": [],
          "assertionFamilyId": "electrical.ohms_law",
          "capabilityIds": [
            "cap.ohms_law.recognise_relationship"
          ],
          "misconceptionTargets": [
            {
              "misconceptionIdentifier": "MIS-EL-OHM-UNRELATED-SYMBOLS-001",
              "evidenceStrength": "generic"
            }
          ],
          "representation": {
            "formulaFamilyId": "formula.ohms_law"
          },
          "presentation": {
            "interactionRequired": false,
            "answerReveal": "not_applicable",
            "contentMayScroll": true,
            "progressiveReveal": false
          },
          "scaffoldingLevel": "guided",
          "cognitiveDemand": "introductory",
          "feedback": {
            "mode": "immediate",
            "explainWhy": false
          },
          "completionCondition": "view_acknowledged",
          "branchRoutes": [],
          "evidenceEmitted": []
        },
        {
          "id": "formula_and_mnemonic_representation",
          "type": "visual_explanation",
          "purpose": "Show every rearrangement of V = I x R and the VIR-triangle mnemonic as a memory aid only -- the mnemonic is never the mathematical authority; formula.ohms_law's own forms are.",
          "requirement": "required",
          "teaches": [
            "EL-OHM-REARRANGE-001"
          ],
          "reinforces": [
            "EL-OHM-PROPORTIONALITY-001"
          ],
          "tests": [],
          "assertionFamilyId": "electrical.ohms_law",
          "capabilityIds": [
            "cap.ohms_law.select_rearrangement"
          ],
          "misconceptionTargets": [],
          "representation": {
            "formulaFamilyId": "formula.ohms_law",
            "visualAidBlueprintId": "mnemonic.vir_triangle"
          },
          "presentation": {
            "interactionRequired": true,
            "interactionRole": "interpret",
            "answerReveal": "on_request",
            "contentMayScroll": true,
            "progressiveReveal": true
          },
          "scaffoldingLevel": "guided",
          "cognitiveDemand": "introductory",
          "feedback": {
            "mode": "immediate",
            "explainWhy": true
          },
          "completionCondition": "view_acknowledged",
          "branchRoutes": [],
          "evidenceEmitted": []
        },
        {
          "id": "interpret_variables_and_units",
          "type": "guided_interaction",
          "purpose": "Match each variable in V = I x R to its correct SI unit before calculating with it.",
          "requirement": "required",
          "teaches": [],
          "reinforces": [
            "EL-OHM-RELATIONSHIP-001"
          ],
          "tests": [
            "EL-OHM-RELATIONSHIP-001"
          ],
          "assertionFamilyId": "electrical.ohms_law",
          "capabilityIds": [
            "cap.ohms_law.apply_correct_unit"
          ],
          "misconceptionTargets": [],
          "representation": {
            "formulaFamilyId": "formula.ohms_law"
          },
          "questionBlueprintId": "ohms_law.match_variables_units",
          "presentation": {
            "interactionRequired": true,
            "interactionRole": "identify",
            "answerReveal": "after_submission",
            "contentMayScroll": false,
            "progressiveReveal": false
          },
          "scaffoldingLevel": "guided",
          "cognitiveDemand": "introductory",
          "feedback": {
            "mode": "immediate",
            "explainWhy": true
          },
          "completionCondition": "correct_answer_required",
          "branchRoutes": [],
          "evidenceEmitted": [
            "cap.ohms_law.apply_correct_unit"
          ]
        },
        {
          "id": "worked_example_solve_voltage",
          "type": "worked_example",
          "purpose": "Model substitution and calculation for the canonical target (V) step by step before asking the learner to do it unaided.",
          "requirement": "required",
          "teaches": [],
          "reinforces": [
            "EL-OHM-SOLVE-V-001"
          ],
          "tests": [],
          "assertionFamilyId": "electrical.ohms_law",
          "capabilityIds": [
            "cap.ohms_law.apply_substitution",
            "cap.ohms_law.solve_for_voltage"
          ],
          "misconceptionTargets": [],
          "representation": {
            "formulaFamilyId": "formula.ohms_law",
            "workedExampleBlueprintId": "worked.ohms_law.solve_voltage"
          },
          "presentation": {
            "interactionRequired": true,
            "interactionRole": "predict",
            "answerReveal": "after_submission",
            "contentMayScroll": true,
            "progressiveReveal": true
          },
          "scaffoldingLevel": "guided",
          "cognitiveDemand": "introductory",
          "feedback": {
            "mode": "immediate",
            "explainWhy": true
          },
          "completionCondition": "view_acknowledged",
          "branchRoutes": [],
          "evidenceEmitted": []
        },
        {
          "id": "guided_calculation_current",
          "type": "guided_interaction",
          "purpose": "First learner-performed calculation: solve for current, with scaffolding still present.",
          "requirement": "required",
          "teaches": [],
          "reinforces": [],
          "tests": [
            "EL-OHM-SOLVE-I-001"
          ],
          "assertionFamilyId": "electrical.ohms_law",
          "capabilityIds": [
            "cap.ohms_law.solve_for_current",
            "cap.ohms_law.apply_substitution"
          ],
          "misconceptionTargets": [],
          "representation": {
            "formulaFamilyId": "formula.ohms_law",
            "workedExampleBlueprintId": "worked.ohms_law.solve_current"
          },
          "questionBlueprintId": "ohms_law.solve_for_current",
          "presentation": {
            "interactionRequired": true,
            "interactionRole": "calculate",
            "answerReveal": "after_submission",
            "contentMayScroll": false,
            "progressiveReveal": false
          },
          "scaffoldingLevel": "guided",
          "cognitiveDemand": "introductory",
          "feedback": {
            "mode": "immediate",
            "explainWhy": true
          },
          "completionCondition": "correct_answer_required",
          "branchRoutes": [],
          "evidenceEmitted": [
            "cap.ohms_law.solve_for_current"
          ]
        },
        {
          "id": "misconception_check_wrong_operation",
          "type": "misconception_discrimination",
          "purpose": "Directly test for the specific, governed wrong-operation misconception rather than assuming its absence.",
          "requirement": "required",
          "teaches": [],
          "reinforces": [],
          "tests": [
            "EL-OHM-RELATIONSHIP-001"
          ],
          "assertionFamilyId": "electrical.ohms_law",
          "capabilityIds": [
            "cap.ohms_law.diagnose_wrong_operation"
          ],
          "misconceptionTargets": [
            {
              "misconceptionIdentifier": "MIS-EL-OHM-WRONG-OPERATION-001",
              "evidenceStrength": "direct"
            }
          ],
          "representation": {},
          "questionBlueprintId": "ohms_law.diagnose_wrong_operation",
          "presentation": {
            "interactionRequired": true,
            "interactionRole": "correct_misconception",
            "answerReveal": "after_submission",
            "contentMayScroll": false,
            "progressiveReveal": false
          },
          "scaffoldingLevel": "standard",
          "cognitiveDemand": "diagnostic",
          "feedback": {
            "mode": "immediate",
            "explainWhy": true
          },
          "completionCondition": "correct_answer_required",
          "branchRoutes": [
            {
              "trigger": "misconception_detected",
              "misconceptionIdentifier": "MIS-EL-OHM-WRONG-OPERATION-001",
              "destinationStepId": "remediation_rearrangement",
              "description": "Route to explicit rearrangement/operation-selection remediation before continuing."
            }
          ],
          "evidenceEmitted": [
            "cap.ohms_law.diagnose_wrong_operation"
          ]
        },
        {
          "id": "independent_question_resistance",
          "type": "independent_question",
          "purpose": "Unscaffolded calculation: solve for resistance with no worked example immediately before it.",
          "requirement": "required",
          "teaches": [],
          "reinforces": [],
          "tests": [
            "EL-OHM-SOLVE-R-001"
          ],
          "assertionFamilyId": "electrical.ohms_law",
          "capabilityIds": [
            "cap.ohms_law.solve_for_resistance"
          ],
          "misconceptionTargets": [],
          "representation": {
            "formulaFamilyId": "formula.ohms_law"
          },
          "questionBlueprintId": "ohms_law.solve_for_resistance",
          "presentation": {
            "interactionRequired": true,
            "interactionRole": "calculate",
            "answerReveal": "after_submission",
            "contentMayScroll": false,
            "progressiveReveal": false
          },
          "scaffoldingLevel": "independent",
          "cognitiveDemand": "intermediate",
          "feedback": {
            "mode": "immediate",
            "explainWhy": true
          },
          "completionCondition": "correct_answer_required",
          "branchRoutes": [],
          "evidenceEmitted": [
            "cap.ohms_law.solve_for_resistance"
          ]
        },
        {
          "id": "select_rearrangement_transfer",
          "type": "transfer_application",
          "purpose": "Prove the skill generalises: select the correct rearrangement for whichever quantity is unknown, not just the one direction already practised.",
          "requirement": "required",
          "teaches": [],
          "reinforces": [],
          "tests": [
            "EL-OHM-SELECT-RELATIONSHIP-001"
          ],
          "assertionFamilyId": "electrical.ohms_law",
          "capabilityIds": [
            "cap.ohms_law.select_rearrangement"
          ],
          "misconceptionTargets": [],
          "representation": {
            "formulaFamilyId": "formula.ohms_law"
          },
          "questionBlueprintId": "ohms_law.select_rearrangement",
          "presentation": {
            "interactionRequired": true,
            "interactionRole": "select",
            "answerReveal": "after_submission",
            "contentMayScroll": false,
            "progressiveReveal": false
          },
          "scaffoldingLevel": "independent",
          "cognitiveDemand": "intermediate",
          "feedback": {
            "mode": "immediate",
            "explainWhy": true
          },
          "completionCondition": "correct_answer_required",
          "branchRoutes": [],
          "evidenceEmitted": [
            "cap.ohms_law.select_rearrangement"
          ]
        },
        {
          "id": "misconception_check_rearrangement",
          "type": "misconception_discrimination",
          "purpose": "Directly test for the specific, governed algebraic-rearrangement misconception.",
          "requirement": "required",
          "teaches": [],
          "reinforces": [],
          "tests": [
            "EL-OHM-REARRANGE-001"
          ],
          "assertionFamilyId": "electrical.ohms_law",
          "capabilityIds": [
            "cap.ohms_law.diagnose_rearrangement_error"
          ],
          "misconceptionTargets": [
            {
              "misconceptionIdentifier": "MIS-EL-OHM-REARRANGE-ERROR-001",
              "evidenceStrength": "direct"
            }
          ],
          "representation": {},
          "questionBlueprintId": "ohms_law.diagnose_rearrangement_error",
          "presentation": {
            "interactionRequired": true,
            "interactionRole": "correct_misconception",
            "answerReveal": "after_submission",
            "contentMayScroll": false,
            "progressiveReveal": false
          },
          "scaffoldingLevel": "standard",
          "cognitiveDemand": "diagnostic",
          "feedback": {
            "mode": "immediate",
            "explainWhy": true
          },
          "completionCondition": "correct_answer_required",
          "branchRoutes": [
            {
              "trigger": "misconception_detected",
              "misconceptionIdentifier": "MIS-EL-OHM-REARRANGE-ERROR-001",
              "destinationStepId": "remediation_rearrangement",
              "description": "Route to the same explicit rearrangement remediation as the wrong-operation check."
            }
          ],
          "evidenceEmitted": [
            "cap.ohms_law.diagnose_rearrangement_error"
          ]
        },
        {
          "id": "remediation_rearrangement",
          "type": "remediation",
          "purpose": "Reteach algebraic rearrangement of V = I x R using the worked-example machinery again, then require a fresh correct rearrangement/calculation before returning to the main sequence. Entered only via a branch route -- never part of the default linear path.",
          "requirement": "conditional_remediation_only",
          "teaches": [
            "EL-OHM-REARRANGE-001"
          ],
          "reinforces": [],
          "tests": [
            "EL-OHM-SOLVE-I-001",
            "EL-OHM-SOLVE-R-001"
          ],
          "assertionFamilyId": "electrical.ohms_law",
          "capabilityIds": [
            "cap.ohms_law.diagnose_rearrangement_error",
            "cap.ohms_law.diagnose_wrong_operation"
          ],
          "misconceptionTargets": [
            {
              "misconceptionIdentifier": "MIS-EL-OHM-REARRANGE-ERROR-001",
              "evidenceStrength": "direct"
            },
            {
              "misconceptionIdentifier": "MIS-EL-OHM-WRONG-OPERATION-001",
              "evidenceStrength": "direct"
            }
          ],
          "representation": {
            "formulaFamilyId": "formula.ohms_law",
            "workedExampleBlueprintId": "worked.ohms_law.solve_resistance",
            "visualAidBlueprintId": "mnemonic.vir_triangle"
          },
          "questionBlueprintId": "ohms_law.solve_for_resistance",
          "presentation": {
            "interactionRequired": true,
            "interactionRole": "calculate",
            "answerReveal": "after_submission",
            "contentMayScroll": true,
            "progressiveReveal": true
          },
          "scaffoldingLevel": "guided",
          "cognitiveDemand": "intermediate",
          "feedback": {
            "mode": "immediate",
            "explainWhy": true
          },
          "completionCondition": "correct_answer_required",
          "branchRoutes": [
            {
              "trigger": "remediation_cleared",
              "destinationStepId": "plausibility_check_transfer",
              "description": "Remediation cleared -- resume the main sequence at the plausibility/transfer step."
            }
          ],
          "evidenceEmitted": [
            "cap.ohms_law.diagnose_rearrangement_error",
            "cap.ohms_law.diagnose_wrong_operation"
          ]
        },
        {
          "id": "plausibility_check_transfer",
          "type": "transfer_application",
          "purpose": "Vocational-judgement transfer: decide whether a calculated result is physically plausible, not merely arithmetically correct.",
          "requirement": "required",
          "teaches": [],
          "reinforces": [
            "EL-OHM-RELATIONSHIP-001"
          ],
          "tests": [
            "EL-OHM-RELATIONSHIP-001"
          ],
          "assertionFamilyId": "electrical.ohms_law",
          "capabilityIds": [
            "cap.ohms_law.check_plausibility"
          ],
          "misconceptionTargets": [],
          "representation": {},
          "questionBlueprintId": "ohms_law.plausibility_check",
          "presentation": {
            "interactionRequired": true,
            "interactionRole": "apply",
            "answerReveal": "after_submission",
            "contentMayScroll": false,
            "progressiveReveal": false
          },
          "scaffoldingLevel": "independent",
          "cognitiveDemand": "advanced",
          "feedback": {
            "mode": "immediate",
            "explainWhy": true
          },
          "completionCondition": "correct_answer_required",
          "branchRoutes": [],
          "evidenceEmitted": [
            "cap.ohms_law.check_plausibility"
          ]
        },
        {
          "id": "retrieval_check",
          "type": "retrieval_check",
          "purpose": "Short delayed retrieval of the earliest-practised skill (solving for voltage) to strengthen long-term retention before the lesson ends.",
          "requirement": "required",
          "teaches": [],
          "reinforces": [],
          "tests": [
            "EL-OHM-SOLVE-V-001"
          ],
          "assertionFamilyId": "electrical.ohms_law",
          "capabilityIds": [
            "cap.ohms_law.solve_for_voltage"
          ],
          "misconceptionTargets": [],
          "representation": {
            "formulaFamilyId": "formula.ohms_law"
          },
          "questionBlueprintId": "ohms_law.solve_for_voltage",
          "presentation": {
            "interactionRequired": true,
            "interactionRole": "calculate",
            "answerReveal": "after_submission",
            "contentMayScroll": false,
            "progressiveReveal": false
          },
          "scaffoldingLevel": "independent",
          "cognitiveDemand": "introductory",
          "feedback": {
            "mode": "immediate",
            "explainWhy": true
          },
          "completionCondition": "correct_answer_required",
          "branchRoutes": [],
          "evidenceEmitted": [
            "cap.ohms_law.solve_for_voltage"
          ]
        },
        {
          "id": "recap",
          "type": "recap",
          "purpose": "Summarise the relationship, its rearrangements and the two misconceptions actively checked for in this lesson.",
          "requirement": "required",
          "teaches": [],
          "reinforces": [
            "EL-OHM-RELATIONSHIP-001",
            "EL-OHM-REARRANGE-001"
          ],
          "tests": [],
          "assertionFamilyId": "electrical.ohms_law",
          "capabilityIds": [],
          "misconceptionTargets": [],
          "representation": {
            "formulaFamilyId": "formula.ohms_law"
          },
          "presentation": {
            "interactionRequired": false,
            "answerReveal": "not_applicable",
            "contentMayScroll": true,
            "progressiveReveal": false
          },
          "scaffoldingLevel": "independent",
          "cognitiveDemand": "introductory",
          "feedback": {
            "mode": "immediate",
            "explainWhy": false
          },
          "completionCondition": "view_acknowledged",
          "branchRoutes": [],
          "evidenceEmitted": []
        },
        {
          "id": "exit_completion",
          "type": "exit_completion",
          "purpose": "Confirm lesson completion against the governed completion criteria and surface what was strengthened.",
          "requirement": "required",
          "teaches": [],
          "reinforces": [],
          "tests": [],
          "capabilityIds": [],
          "misconceptionTargets": [],
          "representation": {},
          "presentation": {
            "interactionRequired": false,
            "answerReveal": "not_applicable",
            "contentMayScroll": false,
            "progressiveReveal": false
          },
          "scaffoldingLevel": "independent",
          "cognitiveDemand": "introductory",
          "feedback": {
            "mode": "immediate",
            "explainWhy": false
          },
          "completionCondition": "view_acknowledged",
          "branchRoutes": [],
          "evidenceEmitted": []
        }
      ],
      "misconceptionTargets": [
        {
          "misconceptionIdentifier": "MIS-EL-OHM-UNRELATED-SYMBOLS-001",
          "evidenceStrength": "generic"
        },
        {
          "misconceptionIdentifier": "MIS-EL-OHM-WRONG-OPERATION-001",
          "evidenceStrength": "direct"
        },
        {
          "misconceptionIdentifier": "MIS-EL-OHM-REARRANGE-ERROR-001",
          "evidenceStrength": "direct"
        }
      ],
      "retrievalTags": [
        "electrical.ohms_law",
        "formula.ohms_law"
      ],
      "completionCriteria": {
        "requiredStepIds": [
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
          "exit_completion"
        ],
        "requiredCapabilityEvidence": [
          "cap.ohms_law.solve_for_voltage",
          "cap.ohms_law.solve_for_current",
          "cap.ohms_law.solve_for_resistance",
          "cap.ohms_law.select_rearrangement",
          "cap.ohms_law.check_plausibility"
        ],
        "masteryGateCapabilityIds": [
          "cap.ohms_law.solve_for_voltage",
          "cap.ohms_law.solve_for_resistance",
          "cap.ohms_law.select_rearrangement",
          "cap.ohms_law.check_plausibility"
        ],
        "requiresRemediationClearance": true,
        "exitSummary": "The learner has calculated voltage, current and resistance from V = I x R, selected the correct rearrangement for an unknown quantity, judged the plausibility of a result, and -- if either governed misconception was detected -- cleared the remediation route before completion."
      },
      "presentationModes": [
        "learn",
        "review"
      ],
      "contentRelease": "release.unit202.v2"
    },
    {
      "id": "lesson.electrical.resistors-parallel",
      "schemaVersion": 1,
      "version": 1,
      "title": "Resistors in Parallel",
      "learnerFacingDescription": "Understand how voltage, current and total resistance behave in a parallel circuit, calculate total resistance and branch current, and avoid the two most common parallel-resistance calculation errors.",
      "curriculumUnit": "City & Guilds 2365-02 Unit 202 -- Principles of Electrical Science",
      "prerequisiteKnowledge": [
        "foundational.algebraic_technique",
        "foundational.arithmetic_technique",
        "electrical.ohms_law",
        "electrical.series_circuits"
      ],
      "targetAssertionFamilyIds": [
        "electrical.parallel_circuits"
      ],
      "targetAssertionIdentifiers": [
        "EL-CIRCUIT-PARALLEL-STRUCTURE-001",
        "EL-PARALLEL-VOLTAGE-001",
        "EL-PARALLEL-CURRENT-001",
        "EL-PARALLEL-RESISTANCE-001",
        "EL-PARALLEL-RESISTANCE-CALC-001",
        "EL-PARALLEL-CURRENT-CALC-001",
        "EL-INTERPRET-PARALLEL-RESULT-001"
      ],
      "targetCapabilityIds": [
        "cap.parallel.recognise_structure",
        "cap.parallel.calculate_total_resistance",
        "cap.parallel.calculate_branch_current",
        "cap.parallel.solve_missing_branch",
        "cap.parallel.check_plausibility",
        "cap.parallel.diagnose_reciprocal_error",
        "cap.parallel.diagnose_missing_final_inversion"
      ],
      "remediationEligibility": [],
      "estimatedDurationMinutes": 25,
      "instructionalStrategy": "Two governed misconceptions are actively discriminated for (not merely hoped not to occur), each routing to the same explicit reciprocal-technique remediation step before the learner is allowed to continue -- mirroring lesson.electrical.ohms-law's own pattern. Solving for a missing branch (transfer_application) requires the same algebraic-rearrangement technique as foundational.algebraic_technique, giving series and parallel a shared foundational dependency.",
      "steps": [
        {
          "id": "orientation",
          "type": "orientation",
          "purpose": "Frame why parallel-circuit behaviour matters for real electrical work, and that it behaves differently from series in ways that are easy to get wrong.",
          "requirement": "required",
          "teaches": [],
          "reinforces": [],
          "tests": [],
          "capabilityIds": [],
          "misconceptionTargets": [],
          "representation": {},
          "presentation": {
            "interactionRequired": false,
            "answerReveal": "not_applicable",
            "contentMayScroll": false,
            "progressiveReveal": false
          },
          "scaffoldingLevel": "guided",
          "cognitiveDemand": "introductory",
          "feedback": {
            "mode": "immediate",
            "explainWhy": false
          },
          "completionCondition": "view_acknowledged",
          "branchRoutes": [],
          "evidenceEmitted": []
        },
        {
          "id": "concept_parallel_structure",
          "type": "concept_explanation",
          "purpose": "State what makes a circuit parallel (multiple branches across the same two points) and its consequences: shared voltage, divided current.",
          "requirement": "required",
          "teaches": [
            "EL-CIRCUIT-PARALLEL-STRUCTURE-001",
            "EL-PARALLEL-VOLTAGE-001",
            "EL-PARALLEL-CURRENT-001"
          ],
          "reinforces": [],
          "tests": [],
          "assertionFamilyId": "electrical.parallel_circuits",
          "capabilityIds": [],
          "misconceptionTargets": [],
          "representation": {
            "diagramBlueprintId": "circuit.parallel_resistors"
          },
          "presentation": {
            "interactionRequired": false,
            "answerReveal": "not_applicable",
            "contentMayScroll": true,
            "progressiveReveal": false
          },
          "scaffoldingLevel": "guided",
          "cognitiveDemand": "introductory",
          "feedback": {
            "mode": "immediate",
            "explainWhy": false
          },
          "completionCondition": "view_acknowledged",
          "branchRoutes": [],
          "evidenceEmitted": []
        },
        {
          "id": "guided_identify_topology",
          "type": "guided_interaction",
          "purpose": "Recognise a parallel circuit from a diagram before calculating anything about it.",
          "requirement": "required",
          "teaches": [],
          "reinforces": [
            "EL-CIRCUIT-PARALLEL-STRUCTURE-001"
          ],
          "tests": [
            "EL-CIRCUIT-PARALLEL-STRUCTURE-001"
          ],
          "assertionFamilyId": "electrical.parallel_circuits",
          "capabilityIds": [
            "cap.parallel.recognise_structure"
          ],
          "misconceptionTargets": [],
          "representation": {
            "diagramBlueprintId": "circuit.parallel_resistors"
          },
          "questionBlueprintId": "parallel.identify_topology",
          "presentation": {
            "interactionRequired": true,
            "interactionRole": "identify",
            "answerReveal": "after_submission",
            "contentMayScroll": false,
            "progressiveReveal": false
          },
          "scaffoldingLevel": "guided",
          "cognitiveDemand": "introductory",
          "feedback": {
            "mode": "immediate",
            "explainWhy": true
          },
          "completionCondition": "correct_answer_required",
          "branchRoutes": [],
          "evidenceEmitted": [
            "cap.parallel.recognise_structure"
          ]
        },
        {
          "id": "worked_example_total_resistance",
          "type": "worked_example",
          "purpose": "Model the reciprocal-of-sum-of-reciprocals technique for total parallel resistance step by step, since this is exactly where the two governed misconceptions arise.",
          "requirement": "required",
          "teaches": [
            "EL-PARALLEL-RESISTANCE-001"
          ],
          "reinforces": [],
          "tests": [],
          "assertionFamilyId": "electrical.parallel_circuits",
          "capabilityIds": [
            "cap.parallel.calculate_total_resistance"
          ],
          "misconceptionTargets": [],
          "representation": {
            "formulaFamilyId": "formula.parallel_resistance",
            "diagramBlueprintId": "circuit.parallel_resistors",
            "workedExampleBlueprintId": "worked.parallel_resistance.calculate_total"
          },
          "presentation": {
            "interactionRequired": true,
            "interactionRole": "predict",
            "answerReveal": "after_submission",
            "contentMayScroll": true,
            "progressiveReveal": true
          },
          "scaffoldingLevel": "guided",
          "cognitiveDemand": "introductory",
          "feedback": {
            "mode": "immediate",
            "explainWhy": true
          },
          "completionCondition": "view_acknowledged",
          "branchRoutes": [],
          "evidenceEmitted": []
        },
        {
          "id": "guided_calculate_total_resistance",
          "type": "guided_interaction",
          "purpose": "First learner-performed total-resistance calculation, with scaffolding still present.",
          "requirement": "required",
          "teaches": [],
          "reinforces": [],
          "tests": [
            "EL-PARALLEL-RESISTANCE-CALC-001"
          ],
          "assertionFamilyId": "electrical.parallel_circuits",
          "capabilityIds": [
            "cap.parallel.calculate_total_resistance"
          ],
          "misconceptionTargets": [],
          "representation": {
            "formulaFamilyId": "formula.parallel_resistance",
            "diagramBlueprintId": "circuit.parallel_resistors"
          },
          "questionBlueprintId": "parallel.calculate_total",
          "presentation": {
            "interactionRequired": true,
            "interactionRole": "calculate",
            "answerReveal": "after_submission",
            "contentMayScroll": false,
            "progressiveReveal": false
          },
          "scaffoldingLevel": "guided",
          "cognitiveDemand": "intermediate",
          "feedback": {
            "mode": "immediate",
            "explainWhy": true
          },
          "completionCondition": "correct_answer_required",
          "branchRoutes": [],
          "evidenceEmitted": [
            "cap.parallel.calculate_total_resistance"
          ]
        },
        {
          "id": "guided_calculate_branch_current",
          "type": "guided_interaction",
          "purpose": "Transfer Ohm's law into a parallel-circuit context: find one branch's current from the shared supply voltage and its own resistance.",
          "requirement": "required",
          "teaches": [],
          "reinforces": [],
          "tests": [
            "EL-PARALLEL-CURRENT-CALC-001"
          ],
          "assertionFamilyId": "electrical.parallel_circuits",
          "capabilityIds": [
            "cap.parallel.calculate_branch_current"
          ],
          "misconceptionTargets": [],
          "representation": {
            "formulaFamilyId": "formula.ohms_law",
            "diagramBlueprintId": "circuit.parallel_resistors"
          },
          "questionBlueprintId": "parallel.calculate_branch_current",
          "presentation": {
            "interactionRequired": true,
            "interactionRole": "calculate",
            "answerReveal": "after_submission",
            "contentMayScroll": false,
            "progressiveReveal": false
          },
          "scaffoldingLevel": "guided",
          "cognitiveDemand": "intermediate",
          "feedback": {
            "mode": "immediate",
            "explainWhy": true
          },
          "completionCondition": "correct_answer_required",
          "branchRoutes": [],
          "evidenceEmitted": [
            "cap.parallel.calculate_branch_current"
          ]
        },
        {
          "id": "misconception_check_reciprocal_error",
          "type": "misconception_discrimination",
          "purpose": "Directly test for the specific, governed reciprocal-addition misconception (adding branch resistances directly, as if in series) rather than assuming its absence.",
          "requirement": "required",
          "teaches": [],
          "reinforces": [],
          "tests": [
            "EL-PARALLEL-RESISTANCE-001"
          ],
          "assertionFamilyId": "electrical.parallel_circuits",
          "capabilityIds": [
            "cap.parallel.diagnose_reciprocal_error"
          ],
          "misconceptionTargets": [
            {
              "misconceptionIdentifier": "MIS-EL-PARALLEL-RESISTANCE-ADDITION-001",
              "evidenceStrength": "direct"
            }
          ],
          "representation": {},
          "questionBlueprintId": "parallel.diagnose_reciprocal_error",
          "presentation": {
            "interactionRequired": true,
            "interactionRole": "correct_misconception",
            "answerReveal": "after_submission",
            "contentMayScroll": false,
            "progressiveReveal": false
          },
          "scaffoldingLevel": "standard",
          "cognitiveDemand": "diagnostic",
          "feedback": {
            "mode": "immediate",
            "explainWhy": true
          },
          "completionCondition": "correct_answer_required",
          "branchRoutes": [
            {
              "trigger": "misconception_detected",
              "misconceptionIdentifier": "MIS-EL-PARALLEL-RESISTANCE-ADDITION-001",
              "destinationStepId": "remediation_reciprocal_technique",
              "description": "Route to explicit reciprocal-technique remediation before continuing."
            }
          ],
          "evidenceEmitted": [
            "cap.parallel.diagnose_reciprocal_error"
          ]
        },
        {
          "id": "misconception_check_missing_inversion",
          "type": "misconception_discrimination",
          "purpose": "Directly test for the specific, governed missing-final-inversion misconception (summing reciprocals correctly but forgetting to invert the sum back).",
          "requirement": "required",
          "teaches": [],
          "reinforces": [],
          "tests": [
            "EL-PARALLEL-RESISTANCE-CALC-001"
          ],
          "assertionFamilyId": "electrical.parallel_circuits",
          "capabilityIds": [
            "cap.parallel.diagnose_missing_final_inversion"
          ],
          "misconceptionTargets": [
            {
              "misconceptionIdentifier": "MIS-EL-RECIPROCAL-FORGOTTEN-INVERT-001",
              "evidenceStrength": "direct"
            }
          ],
          "representation": {},
          "questionBlueprintId": "parallel.diagnose_missing_final_inversion",
          "presentation": {
            "interactionRequired": true,
            "interactionRole": "correct_misconception",
            "answerReveal": "after_submission",
            "contentMayScroll": false,
            "progressiveReveal": false
          },
          "scaffoldingLevel": "standard",
          "cognitiveDemand": "diagnostic",
          "feedback": {
            "mode": "immediate",
            "explainWhy": true
          },
          "completionCondition": "correct_answer_required",
          "branchRoutes": [
            {
              "trigger": "misconception_detected",
              "misconceptionIdentifier": "MIS-EL-RECIPROCAL-FORGOTTEN-INVERT-001",
              "destinationStepId": "remediation_reciprocal_technique",
              "description": "Route to the same explicit reciprocal-technique remediation as the addition-error check."
            }
          ],
          "evidenceEmitted": [
            "cap.parallel.diagnose_missing_final_inversion"
          ]
        },
        {
          "id": "remediation_reciprocal_technique",
          "type": "remediation",
          "purpose": "Reteach the reciprocal-of-sum-of-reciprocals technique using the worked-example machinery again, then require a fresh correct calculation before returning to the main sequence. Entered only via a branch route -- never part of the default linear path.",
          "requirement": "conditional_remediation_only",
          "teaches": [
            "EL-PARALLEL-RESISTANCE-001"
          ],
          "reinforces": [],
          "tests": [
            "EL-PARALLEL-RESISTANCE-CALC-001"
          ],
          "assertionFamilyId": "electrical.parallel_circuits",
          "capabilityIds": [
            "cap.parallel.diagnose_reciprocal_error",
            "cap.parallel.diagnose_missing_final_inversion"
          ],
          "misconceptionTargets": [
            {
              "misconceptionIdentifier": "MIS-EL-PARALLEL-RESISTANCE-ADDITION-001",
              "evidenceStrength": "direct"
            },
            {
              "misconceptionIdentifier": "MIS-EL-RECIPROCAL-FORGOTTEN-INVERT-001",
              "evidenceStrength": "direct"
            }
          ],
          "representation": {
            "formulaFamilyId": "formula.parallel_resistance",
            "diagramBlueprintId": "circuit.parallel_resistors",
            "workedExampleBlueprintId": "worked.parallel_resistance.calculate_total"
          },
          "questionBlueprintId": "parallel.calculate_total",
          "presentation": {
            "interactionRequired": true,
            "interactionRole": "calculate",
            "answerReveal": "after_submission",
            "contentMayScroll": true,
            "progressiveReveal": true
          },
          "scaffoldingLevel": "guided",
          "cognitiveDemand": "intermediate",
          "feedback": {
            "mode": "immediate",
            "explainWhy": true
          },
          "completionCondition": "correct_answer_required",
          "branchRoutes": [
            {
              "trigger": "remediation_cleared",
              "destinationStepId": "transfer_solve_missing_branch",
              "description": "Remediation cleared -- resume the main sequence at the missing-branch transfer step."
            }
          ],
          "evidenceEmitted": [
            "cap.parallel.diagnose_reciprocal_error",
            "cap.parallel.diagnose_missing_final_inversion"
          ]
        },
        {
          "id": "transfer_solve_missing_branch",
          "type": "transfer_application",
          "purpose": "Prove the rearrangement technique genuinely transfers: given the total and all-but-one branch, find the missing branch resistance -- the same algebraic-rearrangement technique taught in lesson.foundation.maths.formula-rearrangement, applied through reciprocal arithmetic.",
          "requirement": "required",
          "teaches": [],
          "reinforces": [],
          "tests": [
            "EL-PARALLEL-RESISTANCE-001"
          ],
          "assertionFamilyId": "electrical.parallel_circuits",
          "capabilityIds": [
            "cap.parallel.solve_missing_branch"
          ],
          "misconceptionTargets": [],
          "representation": {
            "diagramBlueprintId": "circuit.parallel_resistors"
          },
          "questionBlueprintId": "parallel.solve_missing_branch",
          "presentation": {
            "interactionRequired": true,
            "interactionRole": "calculate",
            "answerReveal": "after_submission",
            "contentMayScroll": false,
            "progressiveReveal": false
          },
          "scaffoldingLevel": "independent",
          "cognitiveDemand": "advanced",
          "feedback": {
            "mode": "immediate",
            "explainWhy": true
          },
          "completionCondition": "correct_answer_required",
          "branchRoutes": [],
          "evidenceEmitted": [
            "cap.parallel.solve_missing_branch"
          ]
        },
        {
          "id": "transfer_plausibility_check",
          "type": "transfer_application",
          "purpose": "Vocational-judgement transfer: decide whether a reported parallel total-resistance result is physically possible.",
          "requirement": "required",
          "teaches": [],
          "reinforces": [
            "EL-PARALLEL-RESISTANCE-001"
          ],
          "tests": [
            "EL-INTERPRET-PARALLEL-RESULT-001"
          ],
          "assertionFamilyId": "electrical.parallel_circuits",
          "capabilityIds": [
            "cap.parallel.check_plausibility"
          ],
          "misconceptionTargets": [
            {
              "misconceptionIdentifier": "MIS-EL-PARALLEL-RESISTANCE-ADDITION-001",
              "evidenceStrength": "suggestive"
            }
          ],
          "representation": {},
          "questionBlueprintId": "parallel.detect_impossible_total",
          "presentation": {
            "interactionRequired": true,
            "interactionRole": "apply",
            "answerReveal": "after_submission",
            "contentMayScroll": false,
            "progressiveReveal": false
          },
          "scaffoldingLevel": "independent",
          "cognitiveDemand": "advanced",
          "feedback": {
            "mode": "immediate",
            "explainWhy": true
          },
          "completionCondition": "correct_answer_required",
          "branchRoutes": [],
          "evidenceEmitted": [
            "cap.parallel.check_plausibility"
          ]
        },
        {
          "id": "retrieval_check",
          "type": "retrieval_check",
          "purpose": "Short delayed retrieval of total-resistance calculation to strengthen retention before the lesson ends.",
          "requirement": "required",
          "teaches": [],
          "reinforces": [],
          "tests": [
            "EL-PARALLEL-RESISTANCE-CALC-001"
          ],
          "assertionFamilyId": "electrical.parallel_circuits",
          "capabilityIds": [
            "cap.parallel.calculate_total_resistance"
          ],
          "misconceptionTargets": [],
          "representation": {
            "formulaFamilyId": "formula.parallel_resistance",
            "diagramBlueprintId": "circuit.parallel_resistors"
          },
          "questionBlueprintId": "parallel.calculate_total",
          "presentation": {
            "interactionRequired": true,
            "interactionRole": "calculate",
            "answerReveal": "after_submission",
            "contentMayScroll": false,
            "progressiveReveal": false
          },
          "scaffoldingLevel": "independent",
          "cognitiveDemand": "introductory",
          "feedback": {
            "mode": "immediate",
            "explainWhy": true
          },
          "completionCondition": "correct_answer_required",
          "branchRoutes": [],
          "evidenceEmitted": [
            "cap.parallel.calculate_total_resistance"
          ]
        },
        {
          "id": "recap",
          "type": "recap",
          "purpose": "Summarise parallel-circuit behaviour, the two misconceptions actively checked for in this lesson, and how the technique transfers from series and from foundational rearrangement.",
          "requirement": "required",
          "teaches": [],
          "reinforces": [
            "EL-PARALLEL-RESISTANCE-001",
            "EL-PARALLEL-CURRENT-001"
          ],
          "tests": [],
          "assertionFamilyId": "electrical.parallel_circuits",
          "capabilityIds": [],
          "misconceptionTargets": [],
          "representation": {
            "formulaFamilyId": "formula.parallel_resistance"
          },
          "presentation": {
            "interactionRequired": false,
            "answerReveal": "not_applicable",
            "contentMayScroll": true,
            "progressiveReveal": false
          },
          "scaffoldingLevel": "independent",
          "cognitiveDemand": "introductory",
          "feedback": {
            "mode": "immediate",
            "explainWhy": false
          },
          "completionCondition": "view_acknowledged",
          "branchRoutes": [],
          "evidenceEmitted": []
        },
        {
          "id": "exit_completion",
          "type": "exit_completion",
          "purpose": "Confirm lesson completion against the governed completion criteria and surface what was strengthened.",
          "requirement": "required",
          "teaches": [],
          "reinforces": [],
          "tests": [],
          "capabilityIds": [],
          "misconceptionTargets": [],
          "representation": {},
          "presentation": {
            "interactionRequired": false,
            "answerReveal": "not_applicable",
            "contentMayScroll": false,
            "progressiveReveal": false
          },
          "scaffoldingLevel": "independent",
          "cognitiveDemand": "introductory",
          "feedback": {
            "mode": "immediate",
            "explainWhy": false
          },
          "completionCondition": "view_acknowledged",
          "branchRoutes": [],
          "evidenceEmitted": []
        }
      ],
      "misconceptionTargets": [
        {
          "misconceptionIdentifier": "MIS-EL-PARALLEL-RESISTANCE-ADDITION-001",
          "evidenceStrength": "direct"
        },
        {
          "misconceptionIdentifier": "MIS-EL-RECIPROCAL-FORGOTTEN-INVERT-001",
          "evidenceStrength": "direct"
        }
      ],
      "retrievalTags": [
        "electrical.parallel_circuits",
        "formula.parallel_resistance"
      ],
      "completionCriteria": {
        "requiredStepIds": [
          "orientation",
          "concept_parallel_structure",
          "guided_identify_topology",
          "worked_example_total_resistance",
          "guided_calculate_total_resistance",
          "guided_calculate_branch_current",
          "misconception_check_reciprocal_error",
          "misconception_check_missing_inversion",
          "transfer_solve_missing_branch",
          "transfer_plausibility_check",
          "retrieval_check",
          "recap",
          "exit_completion"
        ],
        "requiredCapabilityEvidence": [
          "cap.parallel.recognise_structure",
          "cap.parallel.calculate_total_resistance",
          "cap.parallel.calculate_branch_current",
          "cap.parallel.solve_missing_branch",
          "cap.parallel.check_plausibility"
        ],
        "masteryGateCapabilityIds": [
          "cap.parallel.calculate_total_resistance",
          "cap.parallel.solve_missing_branch",
          "cap.parallel.check_plausibility"
        ],
        "requiresRemediationClearance": true,
        "exitSummary": "The learner has recognised a parallel circuit, calculated total resistance and an individual branch current, solved for a missing branch by rearranging the reciprocal relationship, judged the plausibility of a result, and -- if either governed misconception was detected -- cleared the remediation route before completion."
      },
      "presentationModes": [
        "learn",
        "review"
      ],
      "contentRelease": "release.unit202.v2"
    },
    {
      "id": "lesson.electrical.resistors-series",
      "schemaVersion": 1,
      "version": 1,
      "title": "Resistors in Series",
      "learnerFacingDescription": "Understand how current, voltage and total resistance behave in a series circuit, calculate total resistance and voltage drops, and transfer Ohm's law to find supply current.",
      "curriculumUnit": "City & Guilds 2365-02 Unit 202 -- Principles of Electrical Science",
      "prerequisiteKnowledge": [
        "foundational.algebraic_technique",
        "electrical.ohms_law",
        "electrical.core_quantities"
      ],
      "targetAssertionFamilyIds": [
        "electrical.series_circuits"
      ],
      "targetAssertionIdentifiers": [
        "EL-CIRCUIT-SERIES-STRUCTURE-001",
        "EL-SERIES-CURRENT-001",
        "EL-SERIES-RESISTANCE-001",
        "EL-SERIES-RESISTANCE-CALC-001",
        "EL-CIRCUIT-SUPPLY-CURRENT-SERIES-001",
        "EL-SERIES-VOLTAGE-001",
        "EL-SERIES-VOLTAGE-CALC-001",
        "EL-INTERPRET-SERIES-RESULT-001"
      ],
      "targetCapabilityIds": [
        "cap.series.recognise_structure",
        "cap.series.calculate_total_resistance",
        "cap.series.calculate_supply_current",
        "cap.series.calculate_voltage_drop",
        "cap.series.solve_missing_component",
        "cap.series.check_plausibility"
      ],
      "remediationEligibility": [],
      "estimatedDurationMinutes": 20,
      "instructionalStrategy": "Structure recognised first, then total resistance calculated and immediately transferred into Ohm's law to find supply current -- proving the two families genuinely connect rather than being taught as isolated facts. Solving for a missing component (transfer_application) requires the same algebraic-rearrangement technique as foundational.algebraic_technique, making the foundational prerequisite genuine rather than declared and unused.",
      "steps": [
        {
          "id": "orientation",
          "type": "orientation",
          "purpose": "Frame why series-circuit behaviour matters for real electrical work.",
          "requirement": "required",
          "teaches": [],
          "reinforces": [],
          "tests": [],
          "capabilityIds": [],
          "misconceptionTargets": [],
          "representation": {},
          "presentation": {
            "interactionRequired": false,
            "answerReveal": "not_applicable",
            "contentMayScroll": false,
            "progressiveReveal": false
          },
          "scaffoldingLevel": "guided",
          "cognitiveDemand": "introductory",
          "feedback": {
            "mode": "immediate",
            "explainWhy": false
          },
          "completionCondition": "view_acknowledged",
          "branchRoutes": [],
          "evidenceEmitted": []
        },
        {
          "id": "concept_series_structure",
          "type": "concept_explanation",
          "purpose": "State what makes a circuit series (one loop) and its consequence: the same current flows through every component.",
          "requirement": "required",
          "teaches": [
            "EL-CIRCUIT-SERIES-STRUCTURE-001",
            "EL-SERIES-CURRENT-001"
          ],
          "reinforces": [],
          "tests": [],
          "assertionFamilyId": "electrical.series_circuits",
          "capabilityIds": [],
          "misconceptionTargets": [],
          "representation": {
            "diagramBlueprintId": "circuit.series_resistors"
          },
          "presentation": {
            "interactionRequired": false,
            "answerReveal": "not_applicable",
            "contentMayScroll": true,
            "progressiveReveal": false
          },
          "scaffoldingLevel": "guided",
          "cognitiveDemand": "introductory",
          "feedback": {
            "mode": "immediate",
            "explainWhy": false
          },
          "completionCondition": "view_acknowledged",
          "branchRoutes": [],
          "evidenceEmitted": []
        },
        {
          "id": "guided_interpret_diagram",
          "type": "guided_interaction",
          "purpose": "Recognise a series circuit from a diagram before calculating anything about it.",
          "requirement": "required",
          "teaches": [],
          "reinforces": [
            "EL-CIRCUIT-SERIES-STRUCTURE-001"
          ],
          "tests": [
            "EL-CIRCUIT-SERIES-STRUCTURE-001"
          ],
          "assertionFamilyId": "electrical.series_circuits",
          "capabilityIds": [
            "cap.series.recognise_structure"
          ],
          "misconceptionTargets": [],
          "representation": {
            "diagramBlueprintId": "circuit.series_resistors"
          },
          "questionBlueprintId": "series.interpret_diagram",
          "presentation": {
            "interactionRequired": true,
            "interactionRole": "identify",
            "answerReveal": "after_submission",
            "contentMayScroll": false,
            "progressiveReveal": false
          },
          "scaffoldingLevel": "guided",
          "cognitiveDemand": "introductory",
          "feedback": {
            "mode": "immediate",
            "explainWhy": true
          },
          "completionCondition": "correct_answer_required",
          "branchRoutes": [],
          "evidenceEmitted": [
            "cap.series.recognise_structure"
          ]
        },
        {
          "id": "worked_example_total_resistance",
          "type": "worked_example",
          "purpose": "Model adding component resistances to find total series resistance before asking the learner to do it unaided.",
          "requirement": "required",
          "teaches": [
            "EL-SERIES-RESISTANCE-001"
          ],
          "reinforces": [],
          "tests": [],
          "assertionFamilyId": "electrical.series_circuits",
          "capabilityIds": [
            "cap.series.calculate_total_resistance"
          ],
          "misconceptionTargets": [],
          "representation": {
            "formulaFamilyId": "formula.series_resistance",
            "diagramBlueprintId": "circuit.series_resistors",
            "workedExampleBlueprintId": "worked.series_resistance.calculate_total"
          },
          "presentation": {
            "interactionRequired": true,
            "interactionRole": "predict",
            "answerReveal": "after_submission",
            "contentMayScroll": true,
            "progressiveReveal": true
          },
          "scaffoldingLevel": "guided",
          "cognitiveDemand": "introductory",
          "feedback": {
            "mode": "immediate",
            "explainWhy": true
          },
          "completionCondition": "view_acknowledged",
          "branchRoutes": [],
          "evidenceEmitted": []
        },
        {
          "id": "guided_calculate_total_resistance",
          "type": "guided_interaction",
          "purpose": "First learner-performed total-resistance calculation, with scaffolding still present.",
          "requirement": "required",
          "teaches": [],
          "reinforces": [],
          "tests": [
            "EL-SERIES-RESISTANCE-CALC-001"
          ],
          "assertionFamilyId": "electrical.series_circuits",
          "capabilityIds": [
            "cap.series.calculate_total_resistance"
          ],
          "misconceptionTargets": [],
          "representation": {
            "formulaFamilyId": "formula.series_resistance",
            "diagramBlueprintId": "circuit.series_resistors"
          },
          "questionBlueprintId": "series.calculate_total_resistance",
          "presentation": {
            "interactionRequired": true,
            "interactionRole": "calculate",
            "answerReveal": "after_submission",
            "contentMayScroll": false,
            "progressiveReveal": false
          },
          "scaffoldingLevel": "guided",
          "cognitiveDemand": "introductory",
          "feedback": {
            "mode": "immediate",
            "explainWhy": true
          },
          "completionCondition": "correct_answer_required",
          "branchRoutes": [],
          "evidenceEmitted": [
            "cap.series.calculate_total_resistance"
          ]
        },
        {
          "id": "guided_calculate_supply_current",
          "type": "guided_interaction",
          "purpose": "Transfer Ohm's law into a series-circuit context: find supply current from supply voltage and total resistance.",
          "requirement": "required",
          "teaches": [],
          "reinforces": [],
          "tests": [
            "EL-CIRCUIT-SUPPLY-CURRENT-SERIES-001"
          ],
          "assertionFamilyId": "electrical.series_circuits",
          "capabilityIds": [
            "cap.series.calculate_supply_current"
          ],
          "misconceptionTargets": [],
          "representation": {
            "formulaFamilyId": "formula.ohms_law"
          },
          "questionBlueprintId": "series.calculate_supply_current",
          "presentation": {
            "interactionRequired": true,
            "interactionRole": "calculate",
            "answerReveal": "after_submission",
            "contentMayScroll": false,
            "progressiveReveal": false
          },
          "scaffoldingLevel": "guided",
          "cognitiveDemand": "intermediate",
          "feedback": {
            "mode": "immediate",
            "explainWhy": true
          },
          "completionCondition": "correct_answer_required",
          "branchRoutes": [],
          "evidenceEmitted": [
            "cap.series.calculate_supply_current"
          ]
        },
        {
          "id": "independent_calculate_voltage_drop",
          "type": "independent_question",
          "purpose": "Unscaffolded calculation: find the voltage drop across one named component.",
          "requirement": "required",
          "teaches": [],
          "reinforces": [],
          "tests": [
            "EL-SERIES-VOLTAGE-CALC-001"
          ],
          "assertionFamilyId": "electrical.series_circuits",
          "capabilityIds": [
            "cap.series.calculate_voltage_drop"
          ],
          "misconceptionTargets": [],
          "representation": {
            "diagramBlueprintId": "circuit.series_resistors"
          },
          "questionBlueprintId": "series.calculate_voltage_drop",
          "presentation": {
            "interactionRequired": true,
            "interactionRole": "calculate",
            "answerReveal": "after_submission",
            "contentMayScroll": false,
            "progressiveReveal": false
          },
          "scaffoldingLevel": "independent",
          "cognitiveDemand": "intermediate",
          "feedback": {
            "mode": "immediate",
            "explainWhy": true
          },
          "completionCondition": "correct_answer_required",
          "branchRoutes": [],
          "evidenceEmitted": [
            "cap.series.calculate_voltage_drop"
          ]
        },
        {
          "id": "transfer_solve_missing_component",
          "type": "transfer_application",
          "purpose": "Prove the rearrangement technique genuinely transfers: given the total and all-but-one component, find the missing one by rearranging RT = R1 + R2 + ... -- the same technique taught in lesson.foundation.maths.formula-rearrangement.",
          "requirement": "required",
          "teaches": [],
          "reinforces": [],
          "tests": [
            "EL-SERIES-RESISTANCE-001"
          ],
          "assertionFamilyId": "electrical.series_circuits",
          "capabilityIds": [
            "cap.series.solve_missing_component"
          ],
          "misconceptionTargets": [],
          "representation": {
            "diagramBlueprintId": "circuit.series_resistors"
          },
          "questionBlueprintId": "series.solve_missing_component",
          "presentation": {
            "interactionRequired": true,
            "interactionRole": "calculate",
            "answerReveal": "after_submission",
            "contentMayScroll": false,
            "progressiveReveal": false
          },
          "scaffoldingLevel": "independent",
          "cognitiveDemand": "advanced",
          "feedback": {
            "mode": "immediate",
            "explainWhy": true
          },
          "completionCondition": "correct_answer_required",
          "branchRoutes": [],
          "evidenceEmitted": [
            "cap.series.solve_missing_component"
          ]
        },
        {
          "id": "transfer_plausibility_check",
          "type": "transfer_application",
          "purpose": "Vocational-judgement transfer: decide whether a reported series total-resistance result is physically plausible.",
          "requirement": "required",
          "teaches": [],
          "reinforces": [
            "EL-SERIES-RESISTANCE-001"
          ],
          "tests": [
            "EL-INTERPRET-SERIES-RESULT-001"
          ],
          "assertionFamilyId": "electrical.series_circuits",
          "capabilityIds": [
            "cap.series.check_plausibility"
          ],
          "misconceptionTargets": [
            {
              "misconceptionIdentifier": "MIS-EL-SERIES-PARALLEL-CONFUSION-001",
              "evidenceStrength": "suggestive"
            }
          ],
          "representation": {},
          "questionBlueprintId": "series.detect_incorrect_total",
          "presentation": {
            "interactionRequired": true,
            "interactionRole": "apply",
            "answerReveal": "after_submission",
            "contentMayScroll": false,
            "progressiveReveal": false
          },
          "scaffoldingLevel": "independent",
          "cognitiveDemand": "advanced",
          "feedback": {
            "mode": "immediate",
            "explainWhy": true
          },
          "completionCondition": "correct_answer_required",
          "branchRoutes": [],
          "evidenceEmitted": [
            "cap.series.check_plausibility"
          ]
        },
        {
          "id": "retrieval_check",
          "type": "retrieval_check",
          "purpose": "Short delayed retrieval of total-resistance calculation to strengthen retention before the lesson ends.",
          "requirement": "required",
          "teaches": [],
          "reinforces": [],
          "tests": [
            "EL-SERIES-RESISTANCE-CALC-001"
          ],
          "assertionFamilyId": "electrical.series_circuits",
          "capabilityIds": [
            "cap.series.calculate_total_resistance"
          ],
          "misconceptionTargets": [],
          "representation": {
            "formulaFamilyId": "formula.series_resistance",
            "diagramBlueprintId": "circuit.series_resistors"
          },
          "questionBlueprintId": "series.calculate_total_resistance",
          "presentation": {
            "interactionRequired": true,
            "interactionRole": "calculate",
            "answerReveal": "after_submission",
            "contentMayScroll": false,
            "progressiveReveal": false
          },
          "scaffoldingLevel": "independent",
          "cognitiveDemand": "introductory",
          "feedback": {
            "mode": "immediate",
            "explainWhy": true
          },
          "completionCondition": "correct_answer_required",
          "branchRoutes": [],
          "evidenceEmitted": [
            "cap.series.calculate_total_resistance"
          ]
        },
        {
          "id": "recap",
          "type": "recap",
          "purpose": "Summarise series-circuit behaviour: shared current, additive resistance, and how it transfers into Ohm's law.",
          "requirement": "required",
          "teaches": [],
          "reinforces": [
            "EL-SERIES-RESISTANCE-001",
            "EL-SERIES-CURRENT-001"
          ],
          "tests": [],
          "assertionFamilyId": "electrical.series_circuits",
          "capabilityIds": [],
          "misconceptionTargets": [],
          "representation": {
            "formulaFamilyId": "formula.series_resistance"
          },
          "presentation": {
            "interactionRequired": false,
            "answerReveal": "not_applicable",
            "contentMayScroll": true,
            "progressiveReveal": false
          },
          "scaffoldingLevel": "independent",
          "cognitiveDemand": "introductory",
          "feedback": {
            "mode": "immediate",
            "explainWhy": false
          },
          "completionCondition": "view_acknowledged",
          "branchRoutes": [],
          "evidenceEmitted": []
        },
        {
          "id": "exit_completion",
          "type": "exit_completion",
          "purpose": "Confirm lesson completion against the governed completion criteria.",
          "requirement": "required",
          "teaches": [],
          "reinforces": [],
          "tests": [],
          "capabilityIds": [],
          "misconceptionTargets": [],
          "representation": {},
          "presentation": {
            "interactionRequired": false,
            "answerReveal": "not_applicable",
            "contentMayScroll": false,
            "progressiveReveal": false
          },
          "scaffoldingLevel": "independent",
          "cognitiveDemand": "introductory",
          "feedback": {
            "mode": "immediate",
            "explainWhy": false
          },
          "completionCondition": "view_acknowledged",
          "branchRoutes": [],
          "evidenceEmitted": []
        }
      ],
      "misconceptionTargets": [
        {
          "misconceptionIdentifier": "MIS-EL-SERIES-PARALLEL-CONFUSION-001",
          "evidenceStrength": "suggestive"
        }
      ],
      "retrievalTags": [
        "electrical.series_circuits",
        "formula.series_resistance"
      ],
      "completionCriteria": {
        "requiredStepIds": [
          "orientation",
          "concept_series_structure",
          "guided_interpret_diagram",
          "worked_example_total_resistance",
          "guided_calculate_total_resistance",
          "guided_calculate_supply_current",
          "independent_calculate_voltage_drop",
          "transfer_solve_missing_component",
          "transfer_plausibility_check",
          "retrieval_check",
          "recap",
          "exit_completion"
        ],
        "requiredCapabilityEvidence": [
          "cap.series.recognise_structure",
          "cap.series.calculate_total_resistance",
          "cap.series.calculate_supply_current",
          "cap.series.solve_missing_component",
          "cap.series.check_plausibility"
        ],
        "masteryGateCapabilityIds": [
          "cap.series.calculate_total_resistance",
          "cap.series.solve_missing_component",
          "cap.series.check_plausibility"
        ],
        "requiresRemediationClearance": true,
        "exitSummary": "The learner has recognised a series circuit, calculated total resistance and an individual voltage drop, transferred Ohm's law to find supply current, solved for a missing component by rearranging the total-resistance relationship, and judged the plausibility of a result."
      },
      "presentationModes": [
        "learn",
        "review"
      ],
      "contentRelease": "release.unit202.v2"
    },
    {
      "id": "lesson.foundation.maths.formula-rearrangement",
      "schemaVersion": 1,
      "version": 1,
      "title": "Rearranging Formulas",
      "learnerFacingDescription": "Learn the algebraic technique behind rearranging any simple formula of the form a = b x c or a = b + c to find a different unknown -- the same technique every vocational formula (including V = I x R) relies on.",
      "curriculumUnit": "Foundational Maths -- reusable across vocational subjects",
      "prerequisiteKnowledge": [],
      "targetAssertionFamilyIds": [
        "foundational.algebraic_technique"
      ],
      "targetAssertionIdentifiers": [
        "FM-ALG-EQUALITY-MULT-001",
        "FM-ALG-EQUALITY-ADD-001",
        "FM-ALG-INVERSE-OPS-MULT-001",
        "FM-ALG-INVERSE-OPS-ADD-001",
        "FM-ALG-TRANSPOSE-MULT-001",
        "FM-ALG-TRANSPOSE-ADD-001"
      ],
      "targetCapabilityIds": [
        "cap.foundational.algebraic_technique.apply"
      ],
      "remediationEligibility": [
        {
          "assertionFamilyId": "foundational.algebraic_technique",
          "isDefaultRemediation": true
        }
      ],
      "estimatedDurationMinutes": 15,
      "instructionalStrategy": "Two structurally identical rearrangement patterns (multiplicative, then additive) are each taught once via a worked example, practised guided, then practised independently, so the technique is proven to generalise across BOTH relationship shapes rather than memorised for one. Deliberately abstract (a/b/c, no physical quantity) so the skill transfers to any vocational formula that shares this structure, not only the one that triggered remediation.",
      "steps": [
        {
          "id": "orientation",
          "type": "orientation",
          "purpose": "Frame rearrangement as one reusable technique that underpins many different vocational formulas, not a one-off electrical trick.",
          "requirement": "required",
          "teaches": [],
          "reinforces": [],
          "tests": [],
          "capabilityIds": [],
          "misconceptionTargets": [],
          "representation": {},
          "presentation": {
            "interactionRequired": false,
            "answerReveal": "not_applicable",
            "contentMayScroll": false,
            "progressiveReveal": false
          },
          "scaffoldingLevel": "guided",
          "cognitiveDemand": "introductory",
          "feedback": {
            "mode": "immediate",
            "explainWhy": false
          },
          "completionCondition": "view_acknowledged",
          "branchRoutes": [],
          "evidenceEmitted": []
        },
        {
          "id": "concept_equality_and_inverse_operations",
          "type": "concept_explanation",
          "purpose": "State the two governed foundational ideas rearrangement relies on: an equation stays true if you do the same thing to both sides, and multiplication/division (and addition/subtraction) are inverse operations that undo each other.",
          "requirement": "required",
          "teaches": [
            "FM-ALG-EQUALITY-MULT-001",
            "FM-ALG-EQUALITY-ADD-001",
            "FM-ALG-INVERSE-OPS-MULT-001",
            "FM-ALG-INVERSE-OPS-ADD-001"
          ],
          "reinforces": [],
          "tests": [],
          "assertionFamilyId": "foundational.algebraic_technique",
          "capabilityIds": [],
          "misconceptionTargets": [],
          "representation": {
            "formulaFamilyId": "formula.algebraic_rearrangement_multiplicative"
          },
          "presentation": {
            "interactionRequired": false,
            "answerReveal": "not_applicable",
            "contentMayScroll": true,
            "progressiveReveal": false
          },
          "scaffoldingLevel": "guided",
          "cognitiveDemand": "introductory",
          "feedback": {
            "mode": "immediate",
            "explainWhy": false
          },
          "completionCondition": "view_acknowledged",
          "branchRoutes": [],
          "evidenceEmitted": []
        },
        {
          "id": "worked_example_multiplicative",
          "type": "worked_example",
          "purpose": "Model rearranging a = b x c to find b step by step -- the same shape as V = I x R -- before asking the learner to do it unaided.",
          "requirement": "required",
          "teaches": [
            "FM-ALG-TRANSPOSE-MULT-001"
          ],
          "reinforces": [],
          "tests": [],
          "assertionFamilyId": "foundational.algebraic_technique",
          "capabilityIds": [
            "cap.foundational.algebraic_technique.apply"
          ],
          "misconceptionTargets": [],
          "representation": {
            "formulaFamilyId": "formula.algebraic_rearrangement_multiplicative",
            "workedExampleBlueprintId": "worked.algebraic_rearrangement_multiplicative.solve_for_factor"
          },
          "presentation": {
            "interactionRequired": true,
            "interactionRole": "predict",
            "answerReveal": "after_submission",
            "contentMayScroll": true,
            "progressiveReveal": true
          },
          "scaffoldingLevel": "guided",
          "cognitiveDemand": "introductory",
          "feedback": {
            "mode": "immediate",
            "explainWhy": true
          },
          "completionCondition": "view_acknowledged",
          "branchRoutes": [],
          "evidenceEmitted": []
        },
        {
          "id": "guided_rearrange_multiplicative",
          "type": "guided_interaction",
          "purpose": "First learner-performed multiplicative rearrangement, with scaffolding still present.",
          "requirement": "required",
          "teaches": [],
          "reinforces": [
            "FM-ALG-TRANSPOSE-MULT-001"
          ],
          "tests": [],
          "assertionFamilyId": "foundational.algebraic_technique",
          "capabilityIds": [
            "cap.foundational.algebraic_technique.apply"
          ],
          "misconceptionTargets": [],
          "representation": {
            "formulaFamilyId": "formula.algebraic_rearrangement_multiplicative"
          },
          "questionBlueprintId": "foundational.rearrange_multiplicative",
          "presentation": {
            "interactionRequired": true,
            "interactionRole": "calculate",
            "answerReveal": "after_submission",
            "contentMayScroll": false,
            "progressiveReveal": false
          },
          "scaffoldingLevel": "guided",
          "cognitiveDemand": "introductory",
          "feedback": {
            "mode": "immediate",
            "explainWhy": true
          },
          "completionCondition": "correct_answer_required",
          "branchRoutes": [],
          "evidenceEmitted": [
            "cap.foundational.algebraic_technique.apply"
          ]
        },
        {
          "id": "independent_rearrange_multiplicative",
          "type": "independent_question",
          "purpose": "Unscaffolded multiplicative rearrangement -- the first independent evidence point for this capability.",
          "requirement": "required",
          "teaches": [],
          "reinforces": [],
          "tests": [
            "FM-ALG-TRANSPOSE-MULT-001"
          ],
          "assertionFamilyId": "foundational.algebraic_technique",
          "capabilityIds": [
            "cap.foundational.algebraic_technique.apply"
          ],
          "misconceptionTargets": [],
          "representation": {
            "formulaFamilyId": "formula.algebraic_rearrangement_multiplicative"
          },
          "questionBlueprintId": "foundational.rearrange_multiplicative",
          "presentation": {
            "interactionRequired": true,
            "interactionRole": "calculate",
            "answerReveal": "after_submission",
            "contentMayScroll": false,
            "progressiveReveal": false
          },
          "scaffoldingLevel": "independent",
          "cognitiveDemand": "intermediate",
          "feedback": {
            "mode": "immediate",
            "explainWhy": true
          },
          "completionCondition": "correct_answer_required",
          "branchRoutes": [],
          "evidenceEmitted": [
            "cap.foundational.algebraic_technique.apply"
          ]
        },
        {
          "id": "worked_example_additive",
          "type": "worked_example",
          "purpose": "Model rearranging a = b + c to find b -- the same shape as RT = R1 + R2 + ... -- proving the technique generalises beyond the multiplicative case.",
          "requirement": "required",
          "teaches": [
            "FM-ALG-TRANSPOSE-ADD-001"
          ],
          "reinforces": [],
          "tests": [],
          "assertionFamilyId": "foundational.algebraic_technique",
          "capabilityIds": [
            "cap.foundational.algebraic_technique.apply"
          ],
          "misconceptionTargets": [],
          "representation": {
            "formulaFamilyId": "formula.algebraic_rearrangement_additive",
            "workedExampleBlueprintId": "worked.algebraic_rearrangement_additive.solve_for_term"
          },
          "presentation": {
            "interactionRequired": true,
            "interactionRole": "predict",
            "answerReveal": "after_submission",
            "contentMayScroll": true,
            "progressiveReveal": true
          },
          "scaffoldingLevel": "guided",
          "cognitiveDemand": "introductory",
          "feedback": {
            "mode": "immediate",
            "explainWhy": true
          },
          "completionCondition": "view_acknowledged",
          "branchRoutes": [],
          "evidenceEmitted": []
        },
        {
          "id": "guided_rearrange_additive",
          "type": "guided_interaction",
          "purpose": "First learner-performed additive rearrangement, with scaffolding still present.",
          "requirement": "required",
          "teaches": [],
          "reinforces": [
            "FM-ALG-TRANSPOSE-ADD-001"
          ],
          "tests": [],
          "assertionFamilyId": "foundational.algebraic_technique",
          "capabilityIds": [
            "cap.foundational.algebraic_technique.apply"
          ],
          "misconceptionTargets": [],
          "representation": {
            "formulaFamilyId": "formula.algebraic_rearrangement_additive"
          },
          "questionBlueprintId": "foundational.rearrange_additive",
          "presentation": {
            "interactionRequired": true,
            "interactionRole": "calculate",
            "answerReveal": "after_submission",
            "contentMayScroll": false,
            "progressiveReveal": false
          },
          "scaffoldingLevel": "guided",
          "cognitiveDemand": "introductory",
          "feedback": {
            "mode": "immediate",
            "explainWhy": true
          },
          "completionCondition": "correct_answer_required",
          "branchRoutes": [],
          "evidenceEmitted": [
            "cap.foundational.algebraic_technique.apply"
          ]
        },
        {
          "id": "independent_rearrange_additive",
          "type": "independent_question",
          "purpose": "Unscaffolded additive rearrangement -- the second independent evidence point for this capability, across a structurally different relationship than the multiplicative case.",
          "requirement": "required",
          "teaches": [],
          "reinforces": [],
          "tests": [
            "FM-ALG-TRANSPOSE-ADD-001"
          ],
          "assertionFamilyId": "foundational.algebraic_technique",
          "capabilityIds": [
            "cap.foundational.algebraic_technique.apply"
          ],
          "misconceptionTargets": [],
          "representation": {
            "formulaFamilyId": "formula.algebraic_rearrangement_additive"
          },
          "questionBlueprintId": "foundational.rearrange_additive",
          "presentation": {
            "interactionRequired": true,
            "interactionRole": "calculate",
            "answerReveal": "after_submission",
            "contentMayScroll": false,
            "progressiveReveal": false
          },
          "scaffoldingLevel": "independent",
          "cognitiveDemand": "intermediate",
          "feedback": {
            "mode": "immediate",
            "explainWhy": true
          },
          "completionCondition": "correct_answer_required",
          "branchRoutes": [],
          "evidenceEmitted": [
            "cap.foundational.algebraic_technique.apply"
          ]
        },
        {
          "id": "retrieval_check",
          "type": "retrieval_check",
          "purpose": "Short delayed retrieval of the multiplicative case, strengthening retention and adding a third independent evidence point before the lesson ends.",
          "requirement": "required",
          "teaches": [],
          "reinforces": [],
          "tests": [
            "FM-ALG-TRANSPOSE-MULT-001"
          ],
          "assertionFamilyId": "foundational.algebraic_technique",
          "capabilityIds": [
            "cap.foundational.algebraic_technique.apply"
          ],
          "misconceptionTargets": [],
          "representation": {
            "formulaFamilyId": "formula.algebraic_rearrangement_multiplicative"
          },
          "questionBlueprintId": "foundational.rearrange_multiplicative",
          "presentation": {
            "interactionRequired": true,
            "interactionRole": "calculate",
            "answerReveal": "after_submission",
            "contentMayScroll": false,
            "progressiveReveal": false
          },
          "scaffoldingLevel": "independent",
          "cognitiveDemand": "introductory",
          "feedback": {
            "mode": "immediate",
            "explainWhy": true
          },
          "completionCondition": "correct_answer_required",
          "branchRoutes": [],
          "evidenceEmitted": [
            "cap.foundational.algebraic_technique.apply"
          ]
        },
        {
          "id": "recap",
          "type": "recap",
          "purpose": "Summarise the two rearrangement patterns and how they generalise to any vocational formula with the same shape.",
          "requirement": "required",
          "teaches": [],
          "reinforces": [
            "FM-ALG-TRANSPOSE-MULT-001",
            "FM-ALG-TRANSPOSE-ADD-001"
          ],
          "tests": [],
          "assertionFamilyId": "foundational.algebraic_technique",
          "capabilityIds": [],
          "misconceptionTargets": [],
          "representation": {},
          "presentation": {
            "interactionRequired": false,
            "answerReveal": "not_applicable",
            "contentMayScroll": true,
            "progressiveReveal": false
          },
          "scaffoldingLevel": "independent",
          "cognitiveDemand": "introductory",
          "feedback": {
            "mode": "immediate",
            "explainWhy": false
          },
          "completionCondition": "view_acknowledged",
          "branchRoutes": [],
          "evidenceEmitted": []
        },
        {
          "id": "exit_completion",
          "type": "exit_completion",
          "purpose": "Confirm lesson completion against the governed completion criteria.",
          "requirement": "required",
          "teaches": [],
          "reinforces": [],
          "tests": [],
          "capabilityIds": [],
          "misconceptionTargets": [],
          "representation": {},
          "presentation": {
            "interactionRequired": false,
            "answerReveal": "not_applicable",
            "contentMayScroll": false,
            "progressiveReveal": false
          },
          "scaffoldingLevel": "independent",
          "cognitiveDemand": "introductory",
          "feedback": {
            "mode": "immediate",
            "explainWhy": false
          },
          "completionCondition": "view_acknowledged",
          "branchRoutes": [],
          "evidenceEmitted": []
        }
      ],
      "misconceptionTargets": [],
      "retrievalTags": [
        "foundational.algebraic_technique",
        "formula.algebraic_rearrangement_multiplicative",
        "formula.algebraic_rearrangement_additive"
      ],
      "completionCriteria": {
        "requiredStepIds": [
          "orientation",
          "concept_equality_and_inverse_operations",
          "worked_example_multiplicative",
          "guided_rearrange_multiplicative",
          "independent_rearrange_multiplicative",
          "worked_example_additive",
          "guided_rearrange_additive",
          "independent_rearrange_additive",
          "retrieval_check",
          "recap",
          "exit_completion"
        ],
        "requiredCapabilityEvidence": [
          "cap.foundational.algebraic_technique.apply"
        ],
        "masteryGateCapabilityIds": [
          "cap.foundational.algebraic_technique.apply"
        ],
        "requiresRemediationClearance": true,
        "exitSummary": "The learner has rearranged both a = b x c and a = b + c to find an unknown factor or term, practised each independently, and retrieved the multiplicative case again -- the same technique needed to rearrange V = I x R and other vocational formulas."
      },
      "presentationModes": [
        "learn",
        "review"
      ],
      "contentRelease": "release.unit202.v2"
    }
  ],
  "questionBlueprints": [
    {
      "id": "foundational.rearrange_additive",
      "assertionFamilyId": "foundational.algebraic_technique",
      "capabilityId": "cap.foundational.algebraic_technique.apply",
      "title": "Rearrange a = b + c to find b",
      "representation": {
        "formula": {
          "required": true,
          "formulaFamilyId": "formula.algebraic_rearrangement_additive"
        }
      },
      "variantDimensions": {},
      "parameterGenerators": [],
      "answer": {
        "type": "quantity",
        "quantity": "value",
        "canonicalUnit": "unit"
      },
      "marking": {
        "type": "numeric_tolerance",
        "tolerancePercent": 1
      },
      "evidence": {
        "primaryCapabilityId": "cap.foundational.algebraic_technique.apply",
        "familyId": "foundational.algebraic_technique",
        "assertionIdentifiers": [
          "FM-ALG-TRANSPOSE-ADD-001"
        ],
        "supportingCapabilityIds": [],
        "representationDependency": [],
        "misconceptionTargets": []
      },
      "difficultyBand": "introductory",
      "presentation": {
        "promptLines": [
          "a = {a}",
          "c = {c}",
          "Given a = b + c, find b."
        ]
      }
    },
    {
      "id": "foundational.rearrange_multiplicative",
      "assertionFamilyId": "foundational.algebraic_technique",
      "capabilityId": "cap.foundational.algebraic_technique.apply",
      "title": "Rearrange a = b x c to find b",
      "representation": {
        "formula": {
          "required": true,
          "formulaFamilyId": "formula.algebraic_rearrangement_multiplicative"
        }
      },
      "variantDimensions": {},
      "parameterGenerators": [],
      "answer": {
        "type": "quantity",
        "quantity": "value",
        "canonicalUnit": "unit"
      },
      "marking": {
        "type": "numeric_tolerance",
        "tolerancePercent": 1
      },
      "evidence": {
        "primaryCapabilityId": "cap.foundational.algebraic_technique.apply",
        "familyId": "foundational.algebraic_technique",
        "assertionIdentifiers": [
          "FM-ALG-TRANSPOSE-MULT-001"
        ],
        "supportingCapabilityIds": [],
        "representationDependency": [],
        "misconceptionTargets": []
      },
      "difficultyBand": "introductory",
      "presentation": {
        "promptLines": [
          "a = {a}",
          "c = {c}",
          "Given a = b x c, find b."
        ]
      }
    },
    {
      "id": "ohms_law.diagnose_rearrangement_error",
      "assertionFamilyId": "electrical.ohms_law",
      "capabilityId": "cap.ohms_law.diagnose_rearrangement_error",
      "title": "Diagnose an incorrect algebraic rearrangement of V = I x R",
      "representation": {},
      "variantDimensions": {},
      "parameterGenerators": [],
      "answer": {
        "type": "worked_error_classification",
        "options": [
          "wrong_operation",
          "rearrangement_error",
          "unrelated_symbols",
          "no_error"
        ]
      },
      "marking": {
        "type": "enum"
      },
      "evidence": {
        "primaryCapabilityId": "cap.ohms_law.diagnose_rearrangement_error",
        "familyId": "electrical.ohms_law",
        "assertionIdentifiers": [
          "EL-OHM-REARRANGE-001"
        ],
        "supportingCapabilityIds": [],
        "representationDependency": [],
        "misconceptionTargets": [
          {
            "misconceptionIdentifier": "MIS-EL-OHM-REARRANGE-ERROR-001",
            "evidenceStrength": "direct"
          }
        ]
      },
      "difficultyBand": "diagnostic",
      "presentation": {
        "promptLines": [
          "A learner was asked to find resistance (R) from a known voltage and current:",
          "V = {V} V",
          "I = {I} A"
        ],
        "shownWorkingLines": [
          "V = {V} V, I = {I} A",
          "R = I / V = {shown_R} Ω"
        ],
        "answerOptionLabels": {
          "wrong_operation": "Used the wrong operation (multiplied instead of divided, or vice versa)",
          "rearrangement_error": "Rearranged the formula incorrectly",
          "unrelated_symbols": "Substituted an unrelated value",
          "no_error": "The working shown is actually correct"
        }
      }
    },
    {
      "id": "ohms_law.diagnose_wrong_operation",
      "assertionFamilyId": "electrical.ohms_law",
      "capabilityId": "cap.ohms_law.diagnose_wrong_operation",
      "title": "Diagnose use of the wrong arithmetic operation when applying V = I x R",
      "representation": {},
      "variantDimensions": {},
      "parameterGenerators": [],
      "answer": {
        "type": "worked_error_classification",
        "options": [
          "wrong_operation",
          "rearrangement_error",
          "unrelated_symbols",
          "no_error"
        ]
      },
      "marking": {
        "type": "enum"
      },
      "evidence": {
        "primaryCapabilityId": "cap.ohms_law.diagnose_wrong_operation",
        "familyId": "electrical.ohms_law",
        "assertionIdentifiers": [
          "EL-OHM-RELATIONSHIP-001"
        ],
        "supportingCapabilityIds": [],
        "representationDependency": [],
        "misconceptionTargets": [
          {
            "misconceptionIdentifier": "MIS-EL-OHM-WRONG-OPERATION-001",
            "evidenceStrength": "direct"
          }
        ]
      },
      "difficultyBand": "diagnostic",
      "presentation": {
        "promptLines": [
          "A learner was asked to find current (I) from a known voltage and resistance:",
          "V = {V} V",
          "R = {R} Ω"
        ],
        "shownWorkingLines": [
          "V = {V} V, R = {R} Ω",
          "I = V x R = {shown_I} A"
        ],
        "answerOptionLabels": {
          "wrong_operation": "Used the wrong operation (multiplied instead of divided, or vice versa)",
          "rearrangement_error": "Rearranged the formula incorrectly",
          "unrelated_symbols": "Substituted an unrelated value",
          "no_error": "The working shown is actually correct"
        }
      }
    },
    {
      "id": "ohms_law.match_variables_units",
      "assertionFamilyId": "electrical.ohms_law",
      "capabilityId": "cap.ohms_law.apply_correct_unit",
      "title": "Match each Ohm's-law variable to its correct SI unit",
      "representation": {},
      "variantDimensions": {},
      "parameterGenerators": [],
      "answer": {
        "type": "multi_select"
      },
      "marking": {
        "type": "set_equality"
      },
      "evidence": {
        "primaryCapabilityId": "cap.ohms_law.apply_correct_unit",
        "familyId": "electrical.ohms_law",
        "assertionIdentifiers": [
          "EL-OHM-RELATIONSHIP-001"
        ],
        "supportingCapabilityIds": [
          "cap.si_units.identify_unit"
        ],
        "representationDependency": [],
        "misconceptionTargets": []
      },
      "difficultyBand": "introductory",
      "presentation": {
        "promptLines": [
          "V = {V} V",
          "I = {I} A",
          "R = {R} Ω"
        ]
      }
    },
    {
      "id": "ohms_law.plausibility_check",
      "assertionFamilyId": "electrical.ohms_law",
      "capabilityId": "cap.ohms_law.check_plausibility",
      "title": "Judge whether a calculated Ohm's-law result is physically plausible",
      "representation": {},
      "variantDimensions": {},
      "parameterGenerators": [],
      "answer": {
        "type": "multiple_choice",
        "options": [
          "plausible",
          "too_high",
          "too_low"
        ]
      },
      "marking": {
        "type": "exact"
      },
      "evidence": {
        "primaryCapabilityId": "cap.ohms_law.check_plausibility",
        "familyId": "electrical.ohms_law",
        "assertionIdentifiers": [
          "EL-OHM-RELATIONSHIP-001"
        ],
        "supportingCapabilityIds": [],
        "representationDependency": [],
        "misconceptionTargets": []
      },
      "difficultyBand": "advanced",
      "presentation": {
        "promptLines": [
          "I = {I} A",
          "R = {R} Ω",
          "A calculated voltage of {shown_V} V was reported."
        ],
        "answerOptionLabels": {
          "plausible": "Plausible",
          "too_high": "Too high",
          "too_low": "Too low"
        }
      }
    },
    {
      "id": "ohms_law.select_rearrangement",
      "assertionFamilyId": "electrical.ohms_law",
      "capabilityId": "cap.ohms_law.select_rearrangement",
      "title": "Select the correct rearrangement of V = I x R for the target quantity",
      "representation": {},
      "variantDimensions": {
        "target_variable": {
          "allowed": [
            "V",
            "I",
            "R"
          ]
        }
      },
      "parameterGenerators": [],
      "answer": {
        "type": "formula_selection"
      },
      "marking": {
        "type": "enum"
      },
      "evidence": {
        "primaryCapabilityId": "cap.ohms_law.select_rearrangement",
        "familyId": "electrical.ohms_law",
        "assertionIdentifiers": [
          "EL-OHM-SELECT-RELATIONSHIP-001"
        ],
        "supportingCapabilityIds": [
          "cap.ohms_law.recognise_relationship"
        ],
        "representationDependency": [],
        "misconceptionTargets": []
      },
      "difficultyBand": "intermediate",
      "normalisationNote": "One blueprint with target_variable as a variant dimension, rather than three separate select-rearrangement blueprints, since the selection skill being assessed is identical regardless of which variable is unknown.",
      "presentation": {
        "promptLines": [
          "V = {V} V",
          "I = {I} A",
          "R = {R} Ω"
        ]
      }
    },
    {
      "id": "ohms_law.solve_for_current",
      "assertionFamilyId": "electrical.ohms_law",
      "capabilityId": "cap.ohms_law.solve_for_current",
      "title": "Solve for current given voltage and resistance",
      "representation": {
        "formula": {
          "required": true,
          "formulaFamilyId": "formula.ohms_law"
        }
      },
      "variantDimensions": {},
      "parameterGenerators": [],
      "answer": {
        "type": "quantity",
        "quantity": "current",
        "canonicalUnit": "ampere"
      },
      "marking": {
        "type": "numeric_tolerance",
        "tolerancePercent": 1
      },
      "evidence": {
        "primaryCapabilityId": "cap.ohms_law.solve_for_current",
        "familyId": "electrical.ohms_law",
        "assertionIdentifiers": [
          "EL-OHM-SOLVE-I-001"
        ],
        "supportingCapabilityIds": [
          "cap.ohms_law.apply_substitution"
        ],
        "representationDependency": [],
        "misconceptionTargets": []
      },
      "difficultyBand": "introductory",
      "presentation": {
        "promptLines": [
          "V = {V} V",
          "R = {R} Ω"
        ]
      }
    },
    {
      "id": "ohms_law.solve_for_resistance",
      "assertionFamilyId": "electrical.ohms_law",
      "capabilityId": "cap.ohms_law.solve_for_resistance",
      "title": "Solve for resistance given voltage and current",
      "representation": {
        "formula": {
          "required": true,
          "formulaFamilyId": "formula.ohms_law"
        }
      },
      "variantDimensions": {},
      "parameterGenerators": [],
      "answer": {
        "type": "quantity",
        "quantity": "resistance",
        "canonicalUnit": "ohm"
      },
      "marking": {
        "type": "numeric_tolerance",
        "tolerancePercent": 1
      },
      "evidence": {
        "primaryCapabilityId": "cap.ohms_law.solve_for_resistance",
        "familyId": "electrical.ohms_law",
        "assertionIdentifiers": [
          "EL-OHM-SOLVE-R-001"
        ],
        "supportingCapabilityIds": [
          "cap.ohms_law.apply_substitution"
        ],
        "representationDependency": [],
        "misconceptionTargets": []
      },
      "difficultyBand": "intermediate",
      "presentation": {
        "promptLines": [
          "V = {V} V",
          "I = {I} A"
        ]
      }
    },
    {
      "id": "ohms_law.solve_for_voltage",
      "assertionFamilyId": "electrical.ohms_law",
      "capabilityId": "cap.ohms_law.solve_for_voltage",
      "title": "Solve for voltage given current and resistance",
      "representation": {
        "formula": {
          "required": true,
          "formulaFamilyId": "formula.ohms_law"
        }
      },
      "variantDimensions": {},
      "parameterGenerators": [],
      "answer": {
        "type": "quantity",
        "quantity": "voltage",
        "canonicalUnit": "volt"
      },
      "marking": {
        "type": "numeric_tolerance",
        "tolerancePercent": 1
      },
      "evidence": {
        "primaryCapabilityId": "cap.ohms_law.solve_for_voltage",
        "familyId": "electrical.ohms_law",
        "assertionIdentifiers": [
          "EL-OHM-SOLVE-V-001"
        ],
        "supportingCapabilityIds": [
          "cap.ohms_law.apply_substitution"
        ],
        "representationDependency": [],
        "misconceptionTargets": []
      },
      "difficultyBand": "introductory",
      "presentation": {
        "promptLines": [
          "I = {I} A",
          "R = {R} Ω"
        ]
      }
    },
    {
      "id": "parallel.calculate_branch_current",
      "assertionFamilyId": "electrical.parallel_circuits",
      "capabilityId": "cap.parallel.calculate_branch_current",
      "title": "Calculate an individual branch current in a parallel circuit",
      "representation": {
        "diagram": {
          "required": true,
          "blueprintId": "circuit.parallel_resistors"
        },
        "formula": {
          "required": true,
          "formulaFamilyId": "formula.ohms_law"
        }
      },
      "variantDimensions": {},
      "parameterGenerators": [],
      "answer": {
        "type": "quantity",
        "quantity": "current",
        "canonicalUnit": "ampere"
      },
      "marking": {
        "type": "numeric_tolerance",
        "tolerancePercent": 1
      },
      "evidence": {
        "primaryCapabilityId": "cap.parallel.calculate_branch_current",
        "familyId": "electrical.parallel_circuits",
        "assertionIdentifiers": [
          "EL-PARALLEL-CURRENT-CALC-001"
        ],
        "supportingCapabilityIds": [],
        "representationDependency": [],
        "misconceptionTargets": []
      },
      "difficultyBand": "intermediate",
      "presentation": {
        "promptLines": [
          "The parallel circuit's supply voltage is {V} V.",
          "Using the diagram, find the current in branch {target}."
        ]
      }
    },
    {
      "id": "parallel.calculate_total",
      "assertionFamilyId": "electrical.parallel_circuits",
      "capabilityId": "cap.parallel.calculate_total_resistance",
      "title": "Calculate total resistance of resistors connected in parallel",
      "representation": {
        "diagram": {
          "required": true,
          "blueprintId": "circuit.parallel_resistors"
        },
        "formula": {
          "required": true,
          "formulaFamilyId": "formula.parallel_resistance"
        }
      },
      "variantDimensions": {
        "branch_count": {
          "allowed": [
            2,
            3,
            4
          ]
        }
      },
      "parameterGenerators": [
        {
          "variable": "R1",
          "min": 1,
          "max": 100,
          "constraints": [
            "positive",
            "pedagogically_sensible"
          ]
        }
      ],
      "answer": {
        "type": "quantity",
        "quantity": "resistance",
        "canonicalUnit": "ohm"
      },
      "marking": {
        "type": "numeric_tolerance",
        "tolerancePercent": 2
      },
      "evidence": {
        "primaryCapabilityId": "cap.parallel.calculate_total_resistance",
        "familyId": "electrical.parallel_circuits",
        "assertionIdentifiers": [
          "EL-PARALLEL-RESISTANCE-CALC-001"
        ],
        "supportingCapabilityIds": [],
        "representationDependency": [],
        "misconceptionTargets": []
      },
      "difficultyBand": "intermediate",
      "presentation": {
        "promptLines": [
          "The parallel circuit shown has {branch_count} branches."
        ]
      }
    },
    {
      "id": "parallel.detect_impossible_total",
      "assertionFamilyId": "electrical.parallel_circuits",
      "capabilityId": "cap.parallel.check_plausibility",
      "title": "Detect an impossible parallel total-resistance result",
      "representation": {},
      "variantDimensions": {},
      "parameterGenerators": [],
      "answer": {
        "type": "multiple_choice",
        "options": [
          "plausible",
          "impossible"
        ]
      },
      "marking": {
        "type": "exact"
      },
      "evidence": {
        "primaryCapabilityId": "cap.parallel.check_plausibility",
        "familyId": "electrical.parallel_circuits",
        "assertionIdentifiers": [
          "EL-INTERPRET-PARALLEL-RESULT-001"
        ],
        "supportingCapabilityIds": [],
        "representationDependency": [],
        "misconceptionTargets": [
          {
            "misconceptionIdentifier": "MIS-EL-PARALLEL-RESISTANCE-ADDITION-001",
            "evidenceStrength": "suggestive"
          }
        ]
      },
      "difficultyBand": "diagnostic",
      "presentation": {
        "promptLines": [
          "This parallel circuit has {branch_count} branches (see diagram).",
          "A calculated total resistance of {shown_total} Ω was reported. Is this possible?"
        ],
        "answerOptionLabels": {
          "plausible": "Possible",
          "impossible": "Impossible"
        }
      }
    },
    {
      "id": "parallel.diagnose_missing_final_inversion",
      "assertionFamilyId": "electrical.parallel_circuits",
      "capabilityId": "cap.parallel.diagnose_missing_final_inversion",
      "title": "Diagnose the error of leaving the parallel-resistance result as a reciprocal instead of inverting it back",
      "representation": {},
      "variantDimensions": {},
      "parameterGenerators": [],
      "answer": {
        "type": "worked_error_classification"
      },
      "marking": {
        "type": "enum"
      },
      "evidence": {
        "primaryCapabilityId": "cap.parallel.diagnose_missing_final_inversion",
        "familyId": "electrical.parallel_circuits",
        "assertionIdentifiers": [
          "EL-PARALLEL-RESISTANCE-CALC-001",
          "FM-ARITH-RECIPROCAL-INVERT-001"
        ],
        "supportingCapabilityIds": [],
        "representationDependency": [],
        "misconceptionTargets": [
          {
            "misconceptionIdentifier": "MIS-EL-RECIPROCAL-FORGOTTEN-INVERT-001",
            "evidenceStrength": "direct"
          }
        ]
      },
      "difficultyBand": "diagnostic",
      "presentation": {
        "promptLines": [
          "A learner calculated the total resistance of this {branch_count}-branch parallel circuit (see diagram)."
        ],
        "shownWorkingLines": [
          "1/Rt = 1/R1 + 1/R2 + ... = {shown_total} (left un-inverted)"
        ]
      }
    },
    {
      "id": "parallel.diagnose_reciprocal_error",
      "assertionFamilyId": "electrical.parallel_circuits",
      "capabilityId": "cap.parallel.diagnose_reciprocal_error",
      "title": "Diagnose the error of adding parallel branch resistances directly",
      "representation": {},
      "variantDimensions": {},
      "parameterGenerators": [],
      "answer": {
        "type": "worked_error_classification"
      },
      "marking": {
        "type": "enum"
      },
      "evidence": {
        "primaryCapabilityId": "cap.parallel.diagnose_reciprocal_error",
        "familyId": "electrical.parallel_circuits",
        "assertionIdentifiers": [
          "EL-PARALLEL-RESISTANCE-001"
        ],
        "supportingCapabilityIds": [],
        "representationDependency": [],
        "misconceptionTargets": [
          {
            "misconceptionIdentifier": "MIS-EL-PARALLEL-RESISTANCE-ADDITION-001",
            "evidenceStrength": "direct"
          }
        ]
      },
      "difficultyBand": "diagnostic",
      "presentation": {
        "promptLines": [
          "A learner calculated the total resistance of this {branch_count}-branch parallel circuit (see diagram)."
        ],
        "shownWorkingLines": [
          "Rt = R1 + R2 + ... = {shown_total} Ω"
        ]
      }
    },
    {
      "id": "parallel.identify_topology",
      "assertionFamilyId": "electrical.parallel_circuits",
      "capabilityId": "cap.parallel.recognise_structure",
      "title": "Recognise a parallel circuit from a circuit diagram",
      "representation": {
        "diagram": {
          "required": true,
          "blueprintId": "circuit.parallel_resistors"
        }
      },
      "variantDimensions": {},
      "parameterGenerators": [],
      "answer": {
        "type": "diagram_region"
      },
      "marking": {
        "type": "exact"
      },
      "evidence": {
        "primaryCapabilityId": "cap.parallel.recognise_structure",
        "familyId": "electrical.parallel_circuits",
        "assertionIdentifiers": [
          "EL-CIRCUIT-PARALLEL-STRUCTURE-001"
        ],
        "supportingCapabilityIds": [],
        "representationDependency": [],
        "misconceptionTargets": []
      },
      "difficultyBand": "introductory",
      "presentation": {
        "promptLines": [
          "Look at the circuit diagram.",
          "Select the part that shows multiple branches connected across the same two points (parallel)."
        ]
      }
    },
    {
      "id": "parallel.solve_missing_branch",
      "assertionFamilyId": "electrical.parallel_circuits",
      "capabilityId": "cap.parallel.solve_missing_branch",
      "title": "Solve for a missing parallel branch resistance given the total and the other branches",
      "representation": {
        "diagram": {
          "required": true,
          "blueprintId": "circuit.parallel_resistors"
        }
      },
      "variantDimensions": {
        "branch_count": {
          "allowed": [
            2,
            3
          ]
        },
        "target": {
          "allowed": [
            "choose_from_branches"
          ]
        }
      },
      "parameterGenerators": [],
      "answer": {
        "type": "quantity",
        "quantity": "resistance",
        "canonicalUnit": "ohm"
      },
      "marking": {
        "type": "numeric_tolerance",
        "tolerancePercent": 2
      },
      "evidence": {
        "primaryCapabilityId": "cap.parallel.solve_missing_branch",
        "familyId": "electrical.parallel_circuits",
        "assertionIdentifiers": [
          "EL-PARALLEL-RESISTANCE-001",
          "FM-ARITH-RECIPROCAL-SUM-001",
          "FM-ARITH-RECIPROCAL-INVERT-001",
          "FM-ALG-TRANSPOSE-ADD-001"
        ],
        "supportingCapabilityIds": [],
        "representationDependency": [],
        "misconceptionTargets": []
      },
      "difficultyBand": "advanced",
      "normalisationNote": "A single blueprint with the unknown branch chosen by the generator (design doc §18), rather than a separate find_R1_given_Rt_R2 / find_R2_given_Rt_R1 blueprint pair -- the assessed skill is identical regardless of which branch is unknown.",
      "presentation": {
        "promptLines": [
          "This parallel circuit has {branch_count} branches with a total resistance of {Rt} Ω.",
          "Find the resistance of {target}."
        ]
      }
    },
    {
      "id": "series.calculate_supply_current",
      "assertionFamilyId": "electrical.series_circuits",
      "capabilityId": "cap.series.calculate_supply_current",
      "title": "Calculate supply current in a series circuit from supply voltage and total resistance",
      "representation": {
        "formula": {
          "required": true,
          "formulaFamilyId": "formula.ohms_law"
        }
      },
      "variantDimensions": {},
      "parameterGenerators": [],
      "answer": {
        "type": "quantity",
        "quantity": "current",
        "canonicalUnit": "ampere"
      },
      "marking": {
        "type": "numeric_tolerance",
        "tolerancePercent": 1
      },
      "evidence": {
        "primaryCapabilityId": "cap.series.calculate_supply_current",
        "familyId": "electrical.series_circuits",
        "assertionIdentifiers": [
          "EL-CIRCUIT-SUPPLY-CURRENT-SERIES-001"
        ],
        "supportingCapabilityIds": [],
        "representationDependency": [],
        "misconceptionTargets": []
      },
      "difficultyBand": "intermediate",
      "presentation": {
        "promptLines": [
          "V = {V} V",
          "Rt = {Rt} Ω"
        ]
      }
    },
    {
      "id": "series.calculate_total_resistance",
      "assertionFamilyId": "electrical.series_circuits",
      "capabilityId": "cap.series.calculate_total_resistance",
      "title": "Calculate total resistance of resistors connected in series",
      "representation": {
        "diagram": {
          "required": true,
          "blueprintId": "circuit.series_resistors"
        },
        "formula": {
          "required": true,
          "formulaFamilyId": "formula.series_resistance"
        }
      },
      "variantDimensions": {
        "component_count": {
          "allowed": [
            2,
            3,
            4
          ]
        }
      },
      "parameterGenerators": [
        {
          "variable": "R1",
          "min": 1,
          "max": 100,
          "constraints": [
            "positive",
            "pedagogically_sensible"
          ]
        }
      ],
      "answer": {
        "type": "quantity",
        "quantity": "resistance",
        "canonicalUnit": "ohm"
      },
      "marking": {
        "type": "numeric_tolerance",
        "tolerancePercent": 1
      },
      "evidence": {
        "primaryCapabilityId": "cap.series.calculate_total_resistance",
        "familyId": "electrical.series_circuits",
        "assertionIdentifiers": [
          "EL-SERIES-RESISTANCE-CALC-001"
        ],
        "supportingCapabilityIds": [],
        "representationDependency": [],
        "misconceptionTargets": []
      },
      "difficultyBand": "introductory",
      "presentation": {
        "promptLines": [
          "The series circuit shown has {component_count} resistors."
        ]
      }
    },
    {
      "id": "series.calculate_voltage_drop",
      "assertionFamilyId": "electrical.series_circuits",
      "capabilityId": "cap.series.calculate_voltage_drop",
      "title": "Calculate an individual voltage drop across a component in a series circuit",
      "representation": {
        "diagram": {
          "required": true,
          "blueprintId": "circuit.series_resistors"
        }
      },
      "variantDimensions": {},
      "parameterGenerators": [],
      "answer": {
        "type": "quantity",
        "quantity": "voltage",
        "canonicalUnit": "volt"
      },
      "marking": {
        "type": "numeric_tolerance",
        "tolerancePercent": 1
      },
      "evidence": {
        "primaryCapabilityId": "cap.series.calculate_voltage_drop",
        "familyId": "electrical.series_circuits",
        "assertionIdentifiers": [
          "EL-SERIES-VOLTAGE-CALC-001"
        ],
        "supportingCapabilityIds": [],
        "representationDependency": [],
        "misconceptionTargets": []
      },
      "difficultyBand": "intermediate",
      "presentation": {
        "promptLines": [
          "This series circuit carries {I} A throughout.",
          "Using the diagram, find the voltage drop across {target}."
        ]
      }
    },
    {
      "id": "series.detect_incorrect_total",
      "assertionFamilyId": "electrical.series_circuits",
      "capabilityId": "cap.series.check_plausibility",
      "title": "Detect an implausible series total-resistance result",
      "representation": {},
      "variantDimensions": {},
      "parameterGenerators": [],
      "answer": {
        "type": "multiple_choice",
        "options": [
          "plausible",
          "implausible"
        ]
      },
      "marking": {
        "type": "exact"
      },
      "evidence": {
        "primaryCapabilityId": "cap.series.check_plausibility",
        "familyId": "electrical.series_circuits",
        "assertionIdentifiers": [
          "EL-INTERPRET-SERIES-RESULT-001"
        ],
        "supportingCapabilityIds": [],
        "representationDependency": [],
        "misconceptionTargets": [
          {
            "misconceptionIdentifier": "MIS-EL-SERIES-PARALLEL-CONFUSION-001",
            "evidenceStrength": "suggestive"
          }
        ]
      },
      "difficultyBand": "diagnostic",
      "presentation": {
        "promptLines": [
          "This series circuit has {component_count} resistors (see diagram).",
          "A calculated total resistance of {shown_total} Ω was reported. Is this plausible?"
        ],
        "answerOptionLabels": {
          "plausible": "Plausible",
          "implausible": "Implausible"
        }
      }
    },
    {
      "id": "series.interpret_diagram",
      "assertionFamilyId": "electrical.series_circuits",
      "capabilityId": "cap.series.recognise_structure",
      "title": "Recognise a series circuit from a circuit diagram",
      "representation": {
        "diagram": {
          "required": true,
          "blueprintId": "circuit.series_resistors"
        }
      },
      "variantDimensions": {},
      "parameterGenerators": [],
      "answer": {
        "type": "diagram_region"
      },
      "marking": {
        "type": "exact"
      },
      "evidence": {
        "primaryCapabilityId": "cap.series.recognise_structure",
        "familyId": "electrical.series_circuits",
        "assertionIdentifiers": [
          "EL-CIRCUIT-SERIES-STRUCTURE-001"
        ],
        "supportingCapabilityIds": [],
        "representationDependency": [],
        "misconceptionTargets": []
      },
      "difficultyBand": "introductory",
      "presentation": {
        "promptLines": [
          "Look at the circuit diagram.",
          "Select the part that shows every component connected in one single loop (series)."
        ]
      }
    },
    {
      "id": "series.solve_missing_component",
      "assertionFamilyId": "electrical.series_circuits",
      "capabilityId": "cap.series.solve_missing_component",
      "title": "Solve for a missing series component resistance given the total and the other components",
      "representation": {
        "diagram": {
          "required": true,
          "blueprintId": "circuit.series_resistors"
        }
      },
      "variantDimensions": {
        "component_count": {
          "allowed": [
            2,
            3,
            4
          ]
        },
        "target": {
          "allowed": [
            "choose_from_components"
          ]
        }
      },
      "parameterGenerators": [],
      "answer": {
        "type": "quantity",
        "quantity": "resistance",
        "canonicalUnit": "ohm"
      },
      "marking": {
        "type": "numeric_tolerance",
        "tolerancePercent": 1
      },
      "evidence": {
        "primaryCapabilityId": "cap.series.solve_missing_component",
        "familyId": "electrical.series_circuits",
        "assertionIdentifiers": [
          "EL-SERIES-RESISTANCE-001",
          "FM-ALG-TRANSPOSE-ADD-001"
        ],
        "supportingCapabilityIds": [],
        "representationDependency": [],
        "misconceptionTargets": []
      },
      "difficultyBand": "advanced",
      "normalisationNote": "A single blueprint with the unknown component chosen by the generator, rather than a separate find_R1/find_R2/find_R3 blueprint per component -- the assessed skill is identical regardless of which component is unknown.",
      "presentation": {
        "promptLines": [
          "This series circuit has {component_count} resistors with a total resistance of {Rt} Ω.",
          "Find the resistance of {target} (rearrange RT = R1 + R2 + ... to isolate it)."
        ]
      }
    }
  ],
  "formulaFamilies": [
    {
      "id": "formula.algebraic_rearrangement_additive",
      "assertionFamilyId": "foundational.algebraic_technique",
      "canonicalTarget": "a",
      "variables": [
        {
          "symbol": "a",
          "name": "a",
          "quantity": "value",
          "unitName": "unit",
          "unitSymbol": "u"
        },
        {
          "symbol": "b",
          "name": "b",
          "quantity": "value",
          "unitName": "unit",
          "unitSymbol": "u"
        },
        {
          "symbol": "c",
          "name": "c",
          "quantity": "value",
          "unitName": "unit",
          "unitSymbol": "u"
        }
      ],
      "forms": [
        {
          "target": "a",
          "expression": {
            "operation": "add",
            "operands": [
              "b",
              "c"
            ]
          },
          "instruction": "a is b plus c.",
          "requiresWorkedExample": false
        },
        {
          "target": "b",
          "expression": {
            "operation": "subtract",
            "operands": [
              "a",
              "c"
            ]
          },
          "instruction": "To find b, subtract c from a.",
          "requiresWorkedExample": true
        },
        {
          "target": "c",
          "expression": {
            "operation": "subtract",
            "operands": [
              "a",
              "b"
            ]
          },
          "instruction": "To find c, subtract b from a.",
          "requiresWorkedExample": true
        }
      ],
      "requiredTargets": [
        "b"
      ]
    },
    {
      "id": "formula.algebraic_rearrangement_multiplicative",
      "assertionFamilyId": "foundational.algebraic_technique",
      "canonicalTarget": "a",
      "variables": [
        {
          "symbol": "a",
          "name": "a",
          "quantity": "value",
          "unitName": "unit",
          "unitSymbol": "u"
        },
        {
          "symbol": "b",
          "name": "b",
          "quantity": "value",
          "unitName": "unit",
          "unitSymbol": "u"
        },
        {
          "symbol": "c",
          "name": "c",
          "quantity": "value",
          "unitName": "unit",
          "unitSymbol": "u"
        }
      ],
      "forms": [
        {
          "target": "a",
          "expression": {
            "operation": "multiply",
            "operands": [
              "b",
              "c"
            ]
          },
          "instruction": "a is b multiplied by c.",
          "requiresWorkedExample": false
        },
        {
          "target": "b",
          "expression": {
            "operation": "divide",
            "numerator": "a",
            "denominator": "c"
          },
          "instruction": "To find b, divide a by c.",
          "requiresWorkedExample": true
        },
        {
          "target": "c",
          "expression": {
            "operation": "divide",
            "numerator": "a",
            "denominator": "b"
          },
          "instruction": "To find c, divide a by b.",
          "requiresWorkedExample": true
        }
      ],
      "requiredTargets": [
        "b"
      ]
    },
    {
      "id": "formula.ohms_law",
      "assertionFamilyId": "electrical.ohms_law",
      "canonicalTarget": "V",
      "variables": [
        {
          "symbol": "V",
          "name": "voltage",
          "quantity": "voltage",
          "unitName": "volt",
          "unitSymbol": "V"
        },
        {
          "symbol": "I",
          "name": "current",
          "quantity": "current",
          "unitName": "ampere",
          "unitSymbol": "A"
        },
        {
          "symbol": "R",
          "name": "resistance",
          "quantity": "resistance",
          "unitName": "ohm",
          "unitSymbol": "Ω"
        }
      ],
      "forms": [
        {
          "target": "V",
          "expression": {
            "operation": "multiply",
            "operands": [
              "I",
              "R"
            ]
          },
          "instruction": "To find voltage, multiply current by resistance.",
          "requiresWorkedExample": true
        },
        {
          "target": "I",
          "expression": {
            "operation": "divide",
            "numerator": "V",
            "denominator": "R"
          },
          "instruction": "To find current, divide voltage by resistance.",
          "requiresWorkedExample": true
        },
        {
          "target": "R",
          "expression": {
            "operation": "divide",
            "numerator": "V",
            "denominator": "I"
          },
          "instruction": "To find resistance, divide voltage by current.",
          "requiresWorkedExample": true
        }
      ],
      "requiredTargets": [
        "V",
        "I",
        "R"
      ],
      "mnemonicId": "mnemonic.vir_triangle"
    },
    {
      "id": "formula.parallel_resistance",
      "assertionFamilyId": "electrical.parallel_circuits",
      "canonicalTarget": "Rt",
      "variables": [
        {
          "symbol": "Rt",
          "name": "total resistance",
          "quantity": "resistance",
          "unitName": "ohm",
          "unitSymbol": "Ω"
        },
        {
          "symbol": "R1",
          "name": "resistance of branch 1",
          "quantity": "resistance",
          "unitName": "ohm",
          "unitSymbol": "Ω"
        },
        {
          "symbol": "R2",
          "name": "resistance of branch 2",
          "quantity": "resistance",
          "unitName": "ohm",
          "unitSymbol": "Ω"
        },
        {
          "symbol": "R3",
          "name": "resistance of branch 3",
          "quantity": "resistance",
          "unitName": "ohm",
          "unitSymbol": "Ω"
        },
        {
          "symbol": "R4",
          "name": "resistance of branch 4",
          "quantity": "resistance",
          "unitName": "ohm",
          "unitSymbol": "Ω"
        }
      ],
      "forms": [
        {
          "target": "Rt",
          "expression": {
            "operation": "reciprocal_of_sum_of_reciprocals",
            "operands": [
              "R1",
              "R2",
              "R3",
              "R4"
            ]
          },
          "instruction": "To find total parallel resistance, sum the reciprocals of the individual branch resistances, then take the reciprocal of that total (using as many of R1..R4 as the circuit actually has).",
          "requiresWorkedExample": true
        }
      ],
      "requiredTargets": [
        "Rt"
      ]
    },
    {
      "id": "formula.series_resistance",
      "assertionFamilyId": "electrical.series_circuits",
      "canonicalTarget": "Rt",
      "variables": [
        {
          "symbol": "Rt",
          "name": "total resistance",
          "quantity": "resistance",
          "unitName": "ohm",
          "unitSymbol": "Ω"
        },
        {
          "symbol": "R1",
          "name": "resistance of component 1",
          "quantity": "resistance",
          "unitName": "ohm",
          "unitSymbol": "Ω"
        },
        {
          "symbol": "R2",
          "name": "resistance of component 2",
          "quantity": "resistance",
          "unitName": "ohm",
          "unitSymbol": "Ω"
        },
        {
          "symbol": "R3",
          "name": "resistance of component 3",
          "quantity": "resistance",
          "unitName": "ohm",
          "unitSymbol": "Ω"
        },
        {
          "symbol": "R4",
          "name": "resistance of component 4",
          "quantity": "resistance",
          "unitName": "ohm",
          "unitSymbol": "Ω"
        }
      ],
      "forms": [
        {
          "target": "Rt",
          "expression": {
            "operation": "add",
            "operands": [
              "R1",
              "R2",
              "R3",
              "R4"
            ]
          },
          "instruction": "To find total series resistance, add the individual component resistances (using as many of R1..R4 as the circuit actually has).",
          "requiresWorkedExample": true
        }
      ],
      "requiredTargets": [
        "Rt"
      ]
    }
  ],
  "workedExampleBlueprints": [
    {
      "id": "worked.algebraic_rearrangement_additive.solve_for_term",
      "formulaFamilyId": "formula.algebraic_rearrangement_additive",
      "target": "b",
      "knownVariables": [
        "a",
        "c"
      ],
      "steps": [
        "show_formula",
        "show_rearrangement",
        "substitute_values",
        "calculate",
        "show_answer_with_unit"
      ],
      "teachingValues": {
        "a": 15,
        "c": 9
      }
    },
    {
      "id": "worked.algebraic_rearrangement_multiplicative.solve_for_factor",
      "formulaFamilyId": "formula.algebraic_rearrangement_multiplicative",
      "target": "b",
      "knownVariables": [
        "a",
        "c"
      ],
      "steps": [
        "show_formula",
        "show_rearrangement",
        "substitute_values",
        "calculate",
        "show_answer_with_unit"
      ],
      "teachingValues": {
        "a": 12,
        "c": 4
      }
    },
    {
      "id": "worked.ohms_law.solve_current",
      "formulaFamilyId": "formula.ohms_law",
      "target": "I",
      "knownVariables": [
        "V",
        "R"
      ],
      "steps": [
        "show_formula",
        "show_rearrangement",
        "substitute_values",
        "calculate",
        "show_answer_with_unit"
      ],
      "teachingValues": {
        "V": 24,
        "R": 6
      }
    },
    {
      "id": "worked.ohms_law.solve_resistance",
      "formulaFamilyId": "formula.ohms_law",
      "target": "R",
      "knownVariables": [
        "V",
        "I"
      ],
      "steps": [
        "show_formula",
        "show_rearrangement",
        "substitute_values",
        "calculate",
        "show_answer_with_unit"
      ],
      "teachingValues": {
        "V": 24,
        "I": 4
      }
    },
    {
      "id": "worked.ohms_law.solve_voltage",
      "formulaFamilyId": "formula.ohms_law",
      "target": "V",
      "knownVariables": [
        "I",
        "R"
      ],
      "steps": [
        "show_formula",
        "substitute_values",
        "calculate",
        "show_answer_with_unit"
      ],
      "teachingValues": {
        "I": 4,
        "R": 6
      }
    },
    {
      "id": "worked.parallel_resistance.calculate_total",
      "formulaFamilyId": "formula.parallel_resistance",
      "target": "Rt",
      "knownVariables": [
        "R1",
        "R2",
        "R3"
      ],
      "steps": [
        "show_formula",
        "substitute_values",
        "calculate",
        "show_answer_with_unit",
        "sanity_check_result"
      ]
    },
    {
      "id": "worked.series_resistance.calculate_total",
      "formulaFamilyId": "formula.series_resistance",
      "target": "Rt",
      "knownVariables": [
        "R1",
        "R2",
        "R3"
      ],
      "steps": [
        "show_formula",
        "substitute_values",
        "calculate",
        "show_answer_with_unit",
        "sanity_check_result"
      ]
    }
  ],
  "visualAidBlueprints": [
    {
      "id": "mnemonic.vir_triangle",
      "type": "mnemonic",
      "formulaFamilyId": "formula.ohms_law",
      "renderer": "svg",
      "regions": {
        "top": "V",
        "bottom_left": "I",
        "bottom_right": "R"
      },
      "accessibleDescription": "A triangle divided into three regions labelled V (top), I (bottom left) and R (bottom right). Covering V shows I x R; covering I shows V / R; covering R shows V / I. The triangle is a learning aid only -- the authoritative relationship is formula.ohms_law."
    }
  ],
  "diagramBlueprints": [
    {
      "id": "circuit.parallel_resistors",
      "type": "electrical_circuit",
      "renderer": "svg",
      "parameters": [
        {
          "name": "branch_count",
          "kind": "enum",
          "allowed": [
            2,
            3,
            4
          ]
        },
        {
          "name": "show_values",
          "kind": "boolean"
        },
        {
          "name": "show_branch_current_arrows",
          "kind": "boolean"
        }
      ],
      "accessibility": {
        "semanticDescriptionRequired": true,
        "colourOnlyEncodingProhibited": true,
        "identifierLabelPattern": "R{index}"
      },
      "valueEmbedding": "symbolic_only"
    },
    {
      "id": "circuit.series_resistors",
      "type": "electrical_circuit",
      "renderer": "svg",
      "parameters": [
        {
          "name": "component_count",
          "kind": "enum",
          "allowed": [
            2,
            3,
            4
          ]
        },
        {
          "name": "show_values",
          "kind": "boolean"
        },
        {
          "name": "show_current_arrow",
          "kind": "boolean"
        }
      ],
      "accessibility": {
        "semanticDescriptionRequired": true,
        "colourOnlyEncodingProhibited": true,
        "identifierLabelPattern": "R{index}"
      },
      "valueEmbedding": "symbolic_only"
    }
  ],
  "assertionFamilies": [
    {
      "id": "electrical.core_quantities",
      "requiredCapabilityIds": [
        "cap.core_quantities.recognise",
        "cap.core_quantities.distinguish"
      ],
      "assessmentRequirement": "assessable"
    },
    {
      "id": "electrical.ohms_law",
      "requiredCapabilityIds": [
        "cap.ohms_law.recognise_relationship",
        "cap.ohms_law.solve_for_voltage",
        "cap.ohms_law.solve_for_current",
        "cap.ohms_law.solve_for_resistance",
        "cap.ohms_law.select_rearrangement",
        "cap.ohms_law.apply_correct_unit",
        "cap.ohms_law.check_plausibility",
        "cap.ohms_law.diagnose_rearrangement_error",
        "cap.ohms_law.diagnose_wrong_operation",
        "cap.ohms_law.diagnose_unrelated_symbols",
        "cap.ohms_law.apply_substitution"
      ],
      "assessmentRequirement": "assessable"
    },
    {
      "id": "electrical.parallel_circuits",
      "requiredCapabilityIds": [
        "cap.parallel.recognise_structure",
        "cap.parallel.calculate_total_resistance",
        "cap.parallel.solve_missing_branch",
        "cap.parallel.calculate_branch_current",
        "cap.parallel.calculate_power",
        "cap.parallel.predict_add_branch",
        "cap.parallel.predict_open_branch",
        "cap.parallel.check_plausibility",
        "cap.parallel.diagnose_reciprocal_error",
        "cap.parallel.diagnose_missing_final_inversion",
        "cap.parallel.identify_dominant_branch"
      ],
      "assessmentRequirement": "assessable"
    },
    {
      "id": "electrical.series_circuits",
      "requiredCapabilityIds": [
        "cap.series.recognise_structure",
        "cap.series.calculate_total_resistance",
        "cap.series.calculate_supply_current",
        "cap.series.calculate_voltage_drop",
        "cap.series.calculate_power",
        "cap.series.predict_add_component",
        "cap.series.predict_open_circuit",
        "cap.series.check_plausibility",
        "cap.series.identify_dominant_component",
        "cap.series.solve_missing_component"
      ],
      "assessmentRequirement": "assessable"
    },
    {
      "id": "electrical.si_units",
      "requiredCapabilityIds": [
        "cap.si_units.identify_unit",
        "cap.si_units.distinguish_base_derived",
        "cap.si_units.diagnose_unit_confusion"
      ],
      "assessmentRequirement": "assessable"
    },
    {
      "id": "foundational.algebraic_technique",
      "requiredCapabilityIds": [
        "cap.foundational.algebraic_technique.apply"
      ],
      "assessmentRequirement": "assessable"
    },
    {
      "id": "foundational.arithmetic_technique",
      "requiredCapabilityIds": [
        "cap.foundational.arithmetic_technique.apply"
      ],
      "assessmentRequirement": "teaching_only"
    },
    {
      "id": "foundational.proportion_and_units",
      "requiredCapabilityIds": [
        "cap.foundational.proportion_and_units.apply"
      ],
      "assessmentRequirement": "teaching_only"
    }
  ],
  "assertionStatements": {
    "EL-CIRCUIT-PARALLEL-STRUCTURE-001": "In a parallel circuit, components are connected between the same two points, providing more than one path for current to flow.",
    "EL-CIRCUIT-SERIES-STRUCTURE-001": "In a series circuit, components are connected end-to-end so that there is only one path for current to flow.",
    "EL-CIRCUIT-SUPPLY-CURRENT-SERIES-001": "Calculate the supply current in a series circuit from the supply voltage and the total resistance of the circuit.",
    "EL-CONCEPT-CURRENT-001": "Electric current is the rate of flow of electric charge through a conductor.",
    "EL-CONCEPT-RESISTANCE-001": "Electrical resistance is the opposition a component presents to the flow of electric current.",
    "EL-CONCEPT-VOLTAGE-001": "Potential difference (voltage) is the electrical energy transferred per unit charge between two points in a circuit.",
    "EL-INTERPRET-PARALLEL-RESULT-001": "A calculated total resistance for resistors in parallel that is greater than the smallest branch resistance indicates a calculation error, since total parallel resistance is always less than the smallest branch resistance.",
    "EL-INTERPRET-SERIES-RESULT-001": "A calculated total resistance for resistors in series that is less than the largest individual resistance indicates a calculation error, since total series resistance is always at least as great as the largest individual resistance.",
    "EL-OHM-PROPORTIONALITY-001": "At constant resistance, current is directly proportional to voltage; at constant voltage, current is inversely proportional to resistance.",
    "EL-OHM-REARRANGE-001": "Rearrange V = I times R algebraically to make voltage, current or resistance the subject.",
    "EL-OHM-RELATIONSHIP-001": "For a component obeying Ohm's law, potential difference, current and resistance are related by V = I times R.",
    "EL-OHM-SELECT-RELATIONSHIP-001": "Select the correct arrangement of V = I times R to use, based on which two quantities are known and which quantity is required.",
    "EL-OHM-SOLVE-I-001": "Calculate an unknown current from known voltage and resistance by rearranging and applying V = I times R.",
    "EL-OHM-SOLVE-R-001": "Calculate an unknown resistance from known voltage and current by rearranging and applying V = I times R.",
    "EL-OHM-SOLVE-V-001": "Calculate an unknown voltage from known current and resistance using V = I times R.",
    "EL-PARALLEL-CURRENT-001": "In a parallel circuit, the supply current divides between the branches, and the branch currents sum to the total current.",
    "EL-PARALLEL-CURRENT-CALC-001": "Calculate an individual branch current in a parallel circuit.",
    "EL-PARALLEL-RESISTANCE-001": "The reciprocal of the total resistance of resistors connected in parallel equals the sum of the reciprocals of the individual branch resistances.",
    "EL-PARALLEL-RESISTANCE-CALC-001": "Calculate the total resistance of resistors connected in parallel.",
    "EL-PARALLEL-VOLTAGE-001": "In a parallel circuit, the potential difference is the same across every branch.",
    "EL-SERIES-CURRENT-001": "In a series circuit, the same current flows through every component.",
    "EL-SERIES-RESISTANCE-001": "The total resistance of resistors connected in series is the sum of the individual resistances: RT = R1 + R2 + ...",
    "EL-SERIES-RESISTANCE-CALC-001": "Calculate the total resistance of resistors connected in series.",
    "EL-SERIES-VOLTAGE-001": "In a series circuit, the supply voltage is shared between the components as individual voltage drops that sum to the supply voltage.",
    "EL-SERIES-VOLTAGE-CALC-001": "Calculate an individual voltage drop across a component in a series circuit.",
    "FM-ALG-EQUALITY-ADD-001": "In an equation, adding or subtracting the same value from both sides preserves the equality between the two sides.",
    "FM-ALG-EQUALITY-MULT-001": "In an equation, multiplying or dividing both sides by the same non-zero value preserves the equality between the two sides.",
    "FM-ALG-INVERSE-OPS-ADD-001": "Addition and subtraction are inverse operations: subtracting a number undoes adding that number, and vice versa.",
    "FM-ALG-INVERSE-OPS-MULT-001": "Multiplication and division are inverse operations: dividing by a non-zero number undoes multiplying by that number, and vice versa.",
    "FM-ALG-TRANSPOSE-ADD-001": "Given a relationship of the form a = b + c, rearrange it algebraically to make b or c the subject.",
    "FM-ALG-TRANSPOSE-MULT-001": "Given a relationship of the form a = b times c, rearrange it algebraically to make b or c the subject."
  },
  "misconceptionDescriptions": {
    "MIS-EL-OHM-REARRANGE-ERROR-001": "Incorrectly rearranges a multiplicative relationship such as V = I times R or P = V times I (for example moving a variable to the wrong side, or inverting the wrong pair of variables) when isolating a different subject.",
    "MIS-EL-OHM-UNRELATED-SYMBOLS-001": "Treats V, I and R as three unrelated symbols to memorise rather than as a single relationship connecting voltage, current and resistance (V = I times R).",
    "MIS-EL-OHM-WRONG-OPERATION-001": "Selects the wrong arithmetic operation when calculating an unknown quantity from V = I times R (for example multiplying instead of dividing when solving for current or resistance, or dividing the two known quantities in the wrong order).",
    "MIS-EL-PARALLEL-RESISTANCE-ADDITION-001": "Calculates the total resistance of a parallel circuit by simply adding the branch resistances, as if they were in series, instead of using the reciprocal-of-sum-of-reciprocals relationship.",
    "MIS-EL-RECIPROCAL-FORGOTTEN-INVERT-001": "Correctly sums the reciprocals of the branch resistances in a parallel circuit but forgets to take the reciprocal of the result, giving an answer that is the reciprocal of the correct total resistance rather than the total resistance itself.",
    "MIS-EL-SERIES-PARALLEL-CONFUSION-001": "Confuses series and parallel circuit structure, for example treating components wired in parallel as if they were in series (or vice versa) when identifying current and voltage relationships."
  }
};
