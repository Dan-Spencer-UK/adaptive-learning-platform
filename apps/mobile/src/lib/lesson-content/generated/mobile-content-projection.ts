/**
 * GENERATED FILE -- DO NOT EDIT.
 *
 * Deterministic mobile learner-runtime content projection for governed
 * content release "release.unit202.v1".
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
    "id": "release.unit202.v1",
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
        "requiresRemediationClearance": true,
        "exitSummary": "The learner has calculated voltage, current and resistance from V = I x R, selected the correct rearrangement for an unknown quantity, judged the plausibility of a result, and -- if either governed misconception was detected -- cleared the remediation route before completion."
      },
      "presentationModes": [
        "learn",
        "review"
      ],
      "contentRelease": "release.unit202.v1"
    }
  ],
  "questionBlueprints": [
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
    }
  ],
  "formulaFamilies": [
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
    }
  ],
  "workedExampleBlueprints": [
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
  "diagramBlueprints": [],
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
      "assessmentRequirement": "teaching_only"
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
    "EL-CONCEPT-CURRENT-001": "Electric current is the rate of flow of electric charge through a conductor.",
    "EL-CONCEPT-RESISTANCE-001": "Electrical resistance is the opposition a component presents to the flow of electric current.",
    "EL-CONCEPT-VOLTAGE-001": "Potential difference (voltage) is the electrical energy transferred per unit charge between two points in a circuit.",
    "EL-OHM-PROPORTIONALITY-001": "At constant resistance, current is directly proportional to voltage; at constant voltage, current is inversely proportional to resistance.",
    "EL-OHM-REARRANGE-001": "Rearrange V = I times R algebraically to make voltage, current or resistance the subject.",
    "EL-OHM-RELATIONSHIP-001": "For a component obeying Ohm's law, potential difference, current and resistance are related by V = I times R.",
    "EL-OHM-SELECT-RELATIONSHIP-001": "Select the correct arrangement of V = I times R to use, based on which two quantities are known and which quantity is required.",
    "EL-OHM-SOLVE-I-001": "Calculate an unknown current from known voltage and resistance by rearranging and applying V = I times R.",
    "EL-OHM-SOLVE-R-001": "Calculate an unknown resistance from known voltage and current by rearranging and applying V = I times R.",
    "EL-OHM-SOLVE-V-001": "Calculate an unknown voltage from known current and resistance using V = I times R."
  },
  "misconceptionDescriptions": {
    "MIS-EL-OHM-REARRANGE-ERROR-001": "Incorrectly rearranges a multiplicative relationship such as V = I times R or P = V times I (for example moving a variable to the wrong side, or inverting the wrong pair of variables) when isolating a different subject.",
    "MIS-EL-OHM-UNRELATED-SYMBOLS-001": "Treats V, I and R as three unrelated symbols to memorise rather than as a single relationship connecting voltage, current and resistance (V = I times R).",
    "MIS-EL-OHM-WRONG-OPERATION-001": "Selects the wrong arithmetic operation when calculating an unknown quantity from V = I times R (for example multiplying instead of dividing when solving for current or resistance, or dividing the two known quantities in the wrong order)."
  }
};
