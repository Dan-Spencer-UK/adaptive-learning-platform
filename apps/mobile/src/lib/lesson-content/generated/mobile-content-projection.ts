/**
 * GENERATED FILE -- DO NOT EDIT.
 *
 * Deterministic mobile learner-runtime content projection for governed
 * content release "release.unit202.v3".
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
    "id": "release.unit202.v3",
    "questionBlueprintVersion": 1
  },
  "lessons": [
    {
      "id": "lesson.electrical.charge-and-current",
      "schemaVersion": 1,
      "version": 1,
      "title": "Charge and Current",
      "learnerFacingDescription": "Understand electric charge, relate it to current, and calculate charge or current using I = Q / t.",
      "curriculumUnit": "City & Guilds 2365-02 Unit 202 -- Principles of Electrical Science",
      "prerequisiteKnowledge": [
        "electrical.core_quantities",
        "foundational.algebraic_technique"
      ],
      "targetAssertionFamilyIds": [
        "electrical.charge_and_current"
      ],
      "targetAssertionIdentifiers": [
        "EL-CURRENT-CHARGE-RELATIONSHIP-001",
        "EL-CURRENT-CHARGE-CALC-001"
      ],
      "targetCapabilityIds": [
        "cap.charge.recognise",
        "cap.charge.calculate"
      ],
      "remediationEligibility": [],
      "estimatedDurationMinutes": 10,
      "instructionalStrategy": "Charge is introduced as the quantity current is a rate of flow of (retrieving electrical.core_quantities' own current definition), then formalised as I = Q/t and immediately calculated in both directions (solve for I, solve for Q) using the same algebraic-rearrangement technique from foundational.algebraic_technique.",
      "steps": [
        {
          "id": "orientation",
          "type": "orientation",
          "purpose": "Frame charge as the quantity current is defined in terms of -- current is charge in motion.",
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
          "id": "concept_charge_current_relationship",
          "type": "concept_explanation",
          "purpose": "State the relationship: current is the rate of flow of charge, I = Q / t.",
          "requirement": "required",
          "teaches": [
            "EL-CURRENT-CHARGE-RELATIONSHIP-001"
          ],
          "reinforces": [],
          "tests": [],
          "assertionFamilyId": "electrical.charge_and_current",
          "capabilityIds": [],
          "misconceptionTargets": [],
          "representation": {
            "formulaFamilyId": "formula.charge_current"
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
          "id": "guided_recognise_relationship",
          "type": "guided_interaction",
          "purpose": "Recognise the I = Q/t relationship among plausible alternative formula forms before calculating with it.",
          "requirement": "required",
          "teaches": [],
          "reinforces": [
            "EL-CURRENT-CHARGE-RELATIONSHIP-001"
          ],
          "tests": [
            "EL-CURRENT-CHARGE-RELATIONSHIP-001"
          ],
          "assertionFamilyId": "electrical.charge_and_current",
          "capabilityIds": [
            "cap.charge.recognise"
          ],
          "misconceptionTargets": [],
          "representation": {
            "formulaFamilyId": "formula.charge_current"
          },
          "questionBlueprintId": "charge.recognise",
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
            "cap.charge.recognise"
          ]
        },
        {
          "id": "independent_calculate_current",
          "type": "independent_question",
          "purpose": "Calculate current from a given charge and time.",
          "requirement": "required",
          "teaches": [],
          "reinforces": [],
          "tests": [
            "EL-CURRENT-CHARGE-CALC-001"
          ],
          "assertionFamilyId": "electrical.charge_and_current",
          "capabilityIds": [
            "cap.charge.calculate"
          ],
          "misconceptionTargets": [],
          "representation": {
            "formulaFamilyId": "formula.charge_current"
          },
          "questionBlueprintId": "charge.calculate",
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
            "cap.charge.calculate"
          ]
        },
        {
          "id": "transfer_calculate_charge",
          "type": "transfer_application",
          "purpose": "Prove the rearrangement transfers: given current and time, find charge by rearranging the same relationship the other way.",
          "requirement": "required",
          "teaches": [],
          "reinforces": [],
          "tests": [
            "EL-CURRENT-CHARGE-CALC-001"
          ],
          "assertionFamilyId": "electrical.charge_and_current",
          "capabilityIds": [
            "cap.charge.calculate"
          ],
          "misconceptionTargets": [],
          "representation": {
            "formulaFamilyId": "formula.charge_current"
          },
          "questionBlueprintId": "charge.calculate",
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
            "cap.charge.calculate"
          ]
        },
        {
          "id": "recap",
          "type": "recap",
          "purpose": "Summarise charge, its relationship to current, and the I = Q/t calculation in both directions.",
          "requirement": "required",
          "teaches": [],
          "reinforces": [
            "EL-CURRENT-CHARGE-RELATIONSHIP-001"
          ],
          "tests": [],
          "assertionFamilyId": "electrical.charge_and_current",
          "capabilityIds": [],
          "misconceptionTargets": [],
          "representation": {
            "formulaFamilyId": "formula.charge_current"
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
      "misconceptionTargets": [],
      "retrievalTags": [
        "electrical.charge_and_current",
        "foundational.algebraic_technique"
      ],
      "completionCriteria": {
        "requiredStepIds": [
          "orientation",
          "concept_charge_current_relationship",
          "guided_recognise_relationship",
          "independent_calculate_current",
          "transfer_calculate_charge",
          "recap",
          "exit_completion"
        ],
        "requiredCapabilityEvidence": [
          "cap.charge.recognise",
          "cap.charge.calculate"
        ],
        "masteryGateCapabilityIds": [
          "cap.charge.calculate"
        ],
        "requiresRemediationClearance": true,
        "exitSummary": "The learner has related current to the rate of flow of charge and calculated both current and charge using I = Q / t."
      },
      "presentationModes": [
        "learn",
        "review"
      ],
      "contentRelease": "release.unit202.v3"
    },
    {
      "id": "lesson.electrical.conductors-and-insulators",
      "schemaVersion": 1,
      "version": 1,
      "title": "Electron Theory, Conductors and Insulators",
      "learnerFacingDescription": "Understand what makes a metallic conductor carry current easily and an insulator resist it, classify common materials, and recognise insulation breakdown.",
      "curriculumUnit": "City & Guilds 2365-02 Unit 202 -- Principles of Electrical Science",
      "prerequisiteKnowledge": [
        "electrical.core_quantities"
      ],
      "targetAssertionFamilyIds": [
        "electrical.conductors_and_insulators"
      ],
      "targetAssertionIdentifiers": [
        "EL-CONCEPT-ELECTRON-THEORY-001",
        "EL-CONCEPT-CONDUCTOR-001",
        "EL-CONCEPT-INSULATOR-001",
        "EL-MATERIAL-CONDUCTOR-INSULATOR-EXAMPLES-001",
        "EL-INSULATOR-BREAKDOWN-001"
      ],
      "targetCapabilityIds": [
        "cap.conductors.classify_material",
        "cap.conductors.recognise_breakdown"
      ],
      "remediationEligibility": [],
      "estimatedDurationMinutes": 12,
      "instructionalStrategy": "Electron theory is taught first as the root-cause explanation (why some materials conduct and others don't), scoped explicitly to metallic conductors, then applied to classify real installation materials, then extended to what happens when an insulator is pushed beyond its limit (breakdown) -- a genuine safety-relevant consequence, not just a definition to memorise.",
      "steps": [
        {
          "id": "orientation",
          "type": "orientation",
          "purpose": "Frame why some materials let current flow easily and others resist it -- the physical basis for every cable and insulator used in electrical work.",
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
          "id": "concept_electron_theory",
          "type": "concept_explanation",
          "purpose": "State electron theory for a metallic conductor: current is the flow of free electrons, driven by a potential difference.",
          "requirement": "required",
          "teaches": [
            "EL-CONCEPT-ELECTRON-THEORY-001"
          ],
          "reinforces": [],
          "tests": [],
          "assertionFamilyId": "electrical.conductors_and_insulators",
          "capabilityIds": [
            "cap.conductors.classify_material"
          ],
          "misconceptionTargets": [
            {
              "misconceptionIdentifier": "MIS-EL-ELECTRON-CURRENT-DIRECTION-CONFUSION-001",
              "evidenceStrength": "suggestive"
            }
          ],
          "representation": {},
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
          "id": "concept_conductor_insulator",
          "type": "concept_explanation",
          "purpose": "Define a metallic conductor (many free electrons) and an insulator (very few free electrons) in contrast to one another.",
          "requirement": "required",
          "teaches": [
            "EL-CONCEPT-CONDUCTOR-001",
            "EL-CONCEPT-INSULATOR-001"
          ],
          "reinforces": [
            "EL-CONCEPT-ELECTRON-THEORY-001"
          ],
          "tests": [],
          "assertionFamilyId": "electrical.conductors_and_insulators",
          "capabilityIds": [
            "cap.conductors.classify_material"
          ],
          "misconceptionTargets": [],
          "representation": {},
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
          "id": "guided_classify_material",
          "type": "guided_interaction",
          "purpose": "Classify a named real material (e.g. copper, PVC, rubber) as a conductor or an insulator.",
          "requirement": "required",
          "teaches": [],
          "reinforces": [
            "EL-CONCEPT-CONDUCTOR-001",
            "EL-CONCEPT-INSULATOR-001"
          ],
          "tests": [
            "EL-MATERIAL-CONDUCTOR-INSULATOR-EXAMPLES-001"
          ],
          "assertionFamilyId": "electrical.conductors_and_insulators",
          "capabilityIds": [
            "cap.conductors.classify_material"
          ],
          "misconceptionTargets": [
            {
              "misconceptionIdentifier": "MIS-EL-CONDUCTOR-INSULATOR-CONFUSION-001",
              "evidenceStrength": "suggestive"
            }
          ],
          "representation": {},
          "questionBlueprintId": "conductors.classify_material",
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
            "cap.conductors.classify_material"
          ]
        },
        {
          "id": "independent_recognise_breakdown",
          "type": "independent_question",
          "purpose": "Recognise that an insulator subjected to excessive voltage can break down and start conducting -- a genuine safety-relevant consequence of insulator limits.",
          "requirement": "required",
          "teaches": [
            "EL-INSULATOR-BREAKDOWN-001"
          ],
          "reinforces": [],
          "tests": [
            "EL-INSULATOR-BREAKDOWN-001"
          ],
          "assertionFamilyId": "electrical.conductors_and_insulators",
          "capabilityIds": [
            "cap.conductors.recognise_breakdown"
          ],
          "misconceptionTargets": [],
          "representation": {},
          "questionBlueprintId": "conductors.recognise_breakdown",
          "presentation": {
            "interactionRequired": true,
            "interactionRole": "identify",
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
            "cap.conductors.recognise_breakdown"
          ]
        },
        {
          "id": "recap",
          "type": "recap",
          "purpose": "Summarise electron theory, the conductor/insulator distinction, and insulation breakdown.",
          "requirement": "required",
          "teaches": [],
          "reinforces": [
            "EL-CONCEPT-CONDUCTOR-001",
            "EL-CONCEPT-INSULATOR-001"
          ],
          "tests": [],
          "assertionFamilyId": "electrical.conductors_and_insulators",
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
      "misconceptionTargets": [
        {
          "misconceptionIdentifier": "MIS-EL-ELECTRON-CURRENT-DIRECTION-CONFUSION-001",
          "evidenceStrength": "suggestive"
        },
        {
          "misconceptionIdentifier": "MIS-EL-CONDUCTOR-INSULATOR-CONFUSION-001",
          "evidenceStrength": "suggestive"
        }
      ],
      "retrievalTags": [
        "electrical.conductors_and_insulators"
      ],
      "completionCriteria": {
        "requiredStepIds": [
          "orientation",
          "concept_electron_theory",
          "concept_conductor_insulator",
          "guided_classify_material",
          "independent_recognise_breakdown",
          "recap",
          "exit_completion"
        ],
        "requiredCapabilityEvidence": [
          "cap.conductors.classify_material",
          "cap.conductors.recognise_breakdown"
        ],
        "masteryGateCapabilityIds": [
          "cap.conductors.classify_material"
        ],
        "requiresRemediationClearance": true,
        "exitSummary": "The learner has stated electron theory for a metallic conductor, distinguished conductors from insulators, classified real materials, and recognised insulation breakdown."
      },
      "presentationModes": [
        "learn",
        "review"
      ],
      "contentRelease": "release.unit202.v3"
    },
    {
      "id": "lesson.electrical.core-quantities",
      "schemaVersion": 1,
      "version": 1,
      "title": "Voltage, Current and Resistance",
      "learnerFacingDescription": "State what voltage, current and resistance are, and stop confusing current with voltage -- the conceptual foundation every later D.C. circuit calculation relies on.",
      "curriculumUnit": "City & Guilds 2365-02 Unit 202 -- Principles of Electrical Science",
      "prerequisiteKnowledge": [],
      "targetAssertionFamilyIds": [
        "electrical.core_quantities"
      ],
      "targetAssertionIdentifiers": [
        "EL-CONCEPT-VOLTAGE-001",
        "EL-CONCEPT-CURRENT-001",
        "EL-CONCEPT-RESISTANCE-001"
      ],
      "targetCapabilityIds": [
        "cap.core_quantities.recognise",
        "cap.core_quantities.distinguish"
      ],
      "remediationEligibility": [],
      "estimatedDurationMinutes": 10,
      "instructionalStrategy": "The three quantities are taught together (they only make sense relative to each other), then immediately contrasted with a diagnostic question targeting the single most common early confusion (current vs. voltage) before the learner moves on to any calculation-based lesson that assumes this distinction is secure.",
      "steps": [
        {
          "id": "orientation",
          "type": "orientation",
          "purpose": "Frame why voltage, current and resistance are the three quantities every electrical calculation in this unit is built from.",
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
          "id": "concept_voltage_current_resistance",
          "type": "concept_explanation",
          "purpose": "State the three core definitions together: voltage as energy transferred per unit charge, current as the rate of flow of charge, resistance as opposition to that flow.",
          "requirement": "required",
          "teaches": [
            "EL-CONCEPT-VOLTAGE-001",
            "EL-CONCEPT-CURRENT-001",
            "EL-CONCEPT-RESISTANCE-001"
          ],
          "reinforces": [],
          "tests": [],
          "assertionFamilyId": "electrical.core_quantities",
          "capabilityIds": [
            "cap.core_quantities.recognise"
          ],
          "misconceptionTargets": [],
          "representation": {},
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
          "id": "guided_recognise_from_definition",
          "type": "guided_interaction",
          "purpose": "First scaffolded recognition check: given a definition, name the quantity it describes.",
          "requirement": "required",
          "teaches": [],
          "reinforces": [
            "EL-CONCEPT-VOLTAGE-001",
            "EL-CONCEPT-CURRENT-001",
            "EL-CONCEPT-RESISTANCE-001"
          ],
          "tests": [
            "EL-CONCEPT-VOLTAGE-001",
            "EL-CONCEPT-CURRENT-001",
            "EL-CONCEPT-RESISTANCE-001"
          ],
          "assertionFamilyId": "electrical.core_quantities",
          "capabilityIds": [
            "cap.core_quantities.recognise"
          ],
          "misconceptionTargets": [],
          "representation": {},
          "questionBlueprintId": "core_quantities.recognise_from_definition",
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
            "cap.core_quantities.recognise"
          ]
        },
        {
          "id": "independent_diagnose_current_voltage_confusion",
          "type": "independent_question",
          "purpose": "Diagnostic check for the single most common early confusion: treating current as something a source 'has' independent of the circuit, rather than voltage as what drives current through resistance.",
          "requirement": "required",
          "teaches": [],
          "reinforces": [],
          "tests": [
            "EL-CONCEPT-VOLTAGE-001",
            "EL-CONCEPT-CURRENT-001"
          ],
          "assertionFamilyId": "electrical.core_quantities",
          "capabilityIds": [
            "cap.core_quantities.distinguish"
          ],
          "misconceptionTargets": [
            {
              "misconceptionIdentifier": "MIS-EL-CURRENT-VOLTAGE-CONFUSION-001",
              "evidenceStrength": "direct"
            }
          ],
          "representation": {},
          "questionBlueprintId": "core_quantities.diagnose_current_voltage_confusion",
          "presentation": {
            "interactionRequired": true,
            "interactionRole": "apply",
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
            "cap.core_quantities.distinguish"
          ]
        },
        {
          "id": "recap",
          "type": "recap",
          "purpose": "Summarise the three quantities and the current/voltage distinction before moving on to Ohm's law, which relates all three.",
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
          "misconceptionIdentifier": "MIS-EL-CURRENT-VOLTAGE-CONFUSION-001",
          "evidenceStrength": "direct"
        }
      ],
      "retrievalTags": [
        "electrical.core_quantities"
      ],
      "completionCriteria": {
        "requiredStepIds": [
          "orientation",
          "concept_voltage_current_resistance",
          "guided_recognise_from_definition",
          "independent_diagnose_current_voltage_confusion",
          "recap",
          "exit_completion"
        ],
        "requiredCapabilityEvidence": [
          "cap.core_quantities.recognise",
          "cap.core_quantities.distinguish"
        ],
        "masteryGateCapabilityIds": [
          "cap.core_quantities.distinguish"
        ],
        "requiresRemediationClearance": true,
        "exitSummary": "The learner has stated what voltage, current and resistance are, recognised each from its definition, and correctly distinguished current from voltage."
      },
      "presentationModes": [
        "learn",
        "review"
      ],
      "contentRelease": "release.unit202.v3"
    },
    {
      "id": "lesson.electrical.energy-and-efficiency",
      "schemaVersion": 1,
      "version": 1,
      "title": "Electrical Energy and Efficiency",
      "learnerFacingDescription": "Calculate electrical energy transferred (in joules and in the kilowatt-hour billing unit), rearrange the energy relationship, and calculate the efficiency of an electrical device.",
      "curriculumUnit": "City & Guilds 2365-02 Unit 202 -- Principles of Electrical Science",
      "prerequisiteKnowledge": [
        "electrical.power_relationships",
        "foundational.algebraic_technique"
      ],
      "targetAssertionFamilyIds": [
        "electrical.energy_and_efficiency"
      ],
      "targetAssertionIdentifiers": [
        "EL-ENERGY-CALC-001",
        "EL-ENERGY-KWH-CALC-001",
        "EL-ENERGY-REARRANGE-001",
        "EL-CALC-ELECTRICAL-EFFICIENCY-001"
      ],
      "targetCapabilityIds": [
        "cap.energy.calculate_energy",
        "cap.energy.calculate_energy_kwh",
        "cap.energy.rearrange",
        "cap.energy.calculate_efficiency"
      ],
      "remediationEligibility": [],
      "estimatedDurationMinutes": 15,
      "instructionalStrategy": "Energy is introduced as power sustained over time (E = Pt), retrieving electrical.power_relationships directly, first in joules and then in the practically-important kWh billing unit before the same relationship is rearranged for power or time. Efficiency closes the lesson as a genuinely distinct calculation (useful output over total input, as a percentage), not a rearrangement of E = Pt.",
      "steps": [
        {
          "id": "orientation",
          "type": "orientation",
          "purpose": "Frame energy as power sustained over time, and why the kilowatt-hour (not the joule) is the unit on a real electricity bill.",
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
          "id": "worked_example_calculate_energy",
          "type": "worked_example",
          "purpose": "Model calculating energy in joules from power and time, E = P x t.",
          "requirement": "required",
          "teaches": [],
          "reinforces": [
            "EL-POWER-RELATIONSHIP-001"
          ],
          "tests": [],
          "assertionFamilyId": "electrical.energy_and_efficiency",
          "capabilityIds": [
            "cap.energy.calculate_energy"
          ],
          "misconceptionTargets": [],
          "representation": {
            "formulaFamilyId": "formula.electrical_energy",
            "workedExampleBlueprintId": "worked.energy.calculate_energy"
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
          "id": "guided_calculate_energy",
          "type": "guided_interaction",
          "purpose": "First learner-performed E = P x t calculation in joules.",
          "requirement": "required",
          "teaches": [
            "EL-ENERGY-CALC-001"
          ],
          "reinforces": [],
          "tests": [
            "EL-ENERGY-CALC-001"
          ],
          "assertionFamilyId": "electrical.energy_and_efficiency",
          "capabilityIds": [
            "cap.energy.calculate_energy"
          ],
          "misconceptionTargets": [],
          "representation": {
            "formulaFamilyId": "formula.electrical_energy"
          },
          "questionBlueprintId": "energy.calculate_energy",
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
            "cap.energy.calculate_energy"
          ]
        },
        {
          "id": "independent_calculate_energy_kwh",
          "type": "independent_question",
          "purpose": "Calculate energy used in kilowatt-hours -- the same relationship, the practically-important billing unit.",
          "requirement": "required",
          "teaches": [
            "EL-ENERGY-KWH-CALC-001"
          ],
          "reinforces": [],
          "tests": [
            "EL-ENERGY-KWH-CALC-001"
          ],
          "assertionFamilyId": "electrical.energy_and_efficiency",
          "capabilityIds": [
            "cap.energy.calculate_energy_kwh"
          ],
          "misconceptionTargets": [
            {
              "misconceptionIdentifier": "MIS-EL-ENERGY-UNIT-CONFUSION-001",
              "evidenceStrength": "suggestive"
            }
          ],
          "representation": {
            "formulaFamilyId": "formula.electrical_energy"
          },
          "questionBlueprintId": "energy.calculate_energy_kwh",
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
            "cap.energy.calculate_energy_kwh"
          ]
        },
        {
          "id": "guided_rearrange",
          "type": "guided_interaction",
          "purpose": "Rearrange E = P x t to make power or time the subject, transferring the algebraic-rearrangement technique.",
          "requirement": "required",
          "teaches": [
            "EL-ENERGY-REARRANGE-001"
          ],
          "reinforces": [],
          "tests": [
            "EL-ENERGY-REARRANGE-001"
          ],
          "assertionFamilyId": "electrical.energy_and_efficiency",
          "capabilityIds": [
            "cap.energy.rearrange"
          ],
          "misconceptionTargets": [],
          "representation": {
            "formulaFamilyId": "formula.electrical_energy"
          },
          "questionBlueprintId": "energy.rearrange",
          "presentation": {
            "interactionRequired": true,
            "interactionRole": "identify",
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
            "cap.energy.rearrange"
          ]
        },
        {
          "id": "worked_example_calculate_efficiency",
          "type": "worked_example",
          "purpose": "Model calculating efficiency as a percentage from useful output and total input -- a genuinely distinct calculation from E = Pt, not a rearrangement of it.",
          "requirement": "required",
          "teaches": [],
          "reinforces": [
            "FP-CONCEPT-EFFICIENCY-001"
          ],
          "tests": [],
          "assertionFamilyId": "electrical.energy_and_efficiency",
          "capabilityIds": [
            "cap.energy.calculate_efficiency"
          ],
          "misconceptionTargets": [],
          "representation": {
            "formulaFamilyId": "formula.electrical_efficiency",
            "workedExampleBlueprintId": "worked.efficiency.calculate"
          },
          "presentation": {
            "interactionRequired": true,
            "interactionRole": "predict",
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
          "completionCondition": "view_acknowledged",
          "branchRoutes": [],
          "evidenceEmitted": []
        },
        {
          "id": "transfer_calculate_efficiency",
          "type": "transfer_application",
          "purpose": "Unscaffolded efficiency calculation for a given electrical device.",
          "requirement": "required",
          "teaches": [],
          "reinforces": [],
          "tests": [
            "EL-CALC-ELECTRICAL-EFFICIENCY-001"
          ],
          "assertionFamilyId": "electrical.energy_and_efficiency",
          "capabilityIds": [
            "cap.energy.calculate_efficiency"
          ],
          "misconceptionTargets": [],
          "representation": {
            "formulaFamilyId": "formula.electrical_efficiency"
          },
          "questionBlueprintId": "energy.calculate_efficiency",
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
            "cap.energy.calculate_efficiency"
          ]
        },
        {
          "id": "recap",
          "type": "recap",
          "purpose": "Summarise energy in joules and kWh, rearranging E = Pt, and calculating device efficiency.",
          "requirement": "required",
          "teaches": [],
          "reinforces": [
            "EL-ENERGY-CALC-001",
            "EL-CALC-ELECTRICAL-EFFICIENCY-001"
          ],
          "tests": [],
          "assertionFamilyId": "electrical.energy_and_efficiency",
          "capabilityIds": [],
          "misconceptionTargets": [],
          "representation": {
            "formulaFamilyId": "formula.electrical_energy"
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
          "misconceptionIdentifier": "MIS-EL-ENERGY-UNIT-CONFUSION-001",
          "evidenceStrength": "suggestive"
        }
      ],
      "retrievalTags": [
        "electrical.energy_and_efficiency",
        "electrical.power_relationships"
      ],
      "completionCriteria": {
        "requiredStepIds": [
          "orientation",
          "worked_example_calculate_energy",
          "guided_calculate_energy",
          "independent_calculate_energy_kwh",
          "guided_rearrange",
          "worked_example_calculate_efficiency",
          "transfer_calculate_efficiency",
          "recap",
          "exit_completion"
        ],
        "requiredCapabilityEvidence": [
          "cap.energy.calculate_energy",
          "cap.energy.calculate_energy_kwh",
          "cap.energy.rearrange",
          "cap.energy.calculate_efficiency"
        ],
        "masteryGateCapabilityIds": [
          "cap.energy.calculate_energy",
          "cap.energy.calculate_efficiency"
        ],
        "requiresRemediationClearance": true,
        "exitSummary": "The learner has calculated electrical energy in joules and kilowatt-hours, rearranged E = P x t, and calculated the efficiency of an electrical device."
      },
      "presentationModes": [
        "learn",
        "review"
      ],
      "contentRelease": "release.unit202.v3"
    },
    {
      "id": "lesson.electrical.fault-conditions-protection",
      "schemaVersion": 1,
      "version": 1,
      "title": "Fault Conditions and Protective Devices",
      "learnerFacingDescription": "Recognise short-circuit and open-circuit conditions, predict what a short circuit does to current, and understand how fuses and circuit breakers protect a circuit.",
      "curriculumUnit": "City & Guilds 2365-02 Unit 202 -- Principles of Electrical Science",
      "prerequisiteKnowledge": [
        "electrical.ohms_law",
        "electrical.core_quantities"
      ],
      "targetAssertionFamilyIds": [
        "electrical.fault_conditions_protection"
      ],
      "targetAssertionIdentifiers": [
        "EL-CIRCUIT-RECOGNISE-SHORT-CIRCUIT-001",
        "EL-CIRCUIT-RECOGNISE-OPEN-CIRCUIT-001",
        "EL-CIRCUIT-ZERO-RESISTANCE-INTERPRETATION-001",
        "EL-CIRCUIT-OPEN-CIRCUIT-RESISTANCE-INTERPRETATION-001",
        "EL-CIRCUIT-PREDICT-SHORT-EFFECT-001",
        "EL-PROTECTIVE-DEVICE-PURPOSE-001",
        "EL-FUSE-OPERATION-001",
        "EL-CIRCUIT-BREAKER-VS-FUSE-001"
      ],
      "targetCapabilityIds": [
        "cap.fault.recognise_condition",
        "cap.fault.predict_effect",
        "cap.fault.select_protective_device",
        "cap.fault.compare_fuse_breaker"
      ],
      "remediationEligibility": [],
      "estimatedDurationMinutes": 15,
      "instructionalStrategy": "Short-circuit (near-zero resistance) and open-circuit (infinite resistance) are taught as the two extreme-resistance interpretations of Ohm's law already known, then Ohm's law is used directly to predict a short circuit's effect on current -- a genuine transfer, not a new formula -- before protective devices are introduced as the practical response to that predicted effect.",
      "steps": [
        {
          "id": "orientation",
          "type": "orientation",
          "purpose": "Frame short and open circuits as the two fault conditions every protective device exists to guard against.",
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
          "id": "concept_fault_conditions",
          "type": "concept_explanation",
          "purpose": "State a short circuit as an unintended near-zero-resistance path, and an open circuit as an unintended break (infinite resistance) -- both interpreted directly from Ohm's law's extreme values.",
          "requirement": "required",
          "teaches": [
            "EL-CIRCUIT-RECOGNISE-SHORT-CIRCUIT-001",
            "EL-CIRCUIT-RECOGNISE-OPEN-CIRCUIT-001",
            "EL-CIRCUIT-ZERO-RESISTANCE-INTERPRETATION-001",
            "EL-CIRCUIT-OPEN-CIRCUIT-RESISTANCE-INTERPRETATION-001"
          ],
          "reinforces": [
            "EL-OHM-RELATIONSHIP-001"
          ],
          "tests": [],
          "assertionFamilyId": "electrical.fault_conditions_protection",
          "capabilityIds": [
            "cap.fault.recognise_condition"
          ],
          "misconceptionTargets": [],
          "representation": {},
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
          "id": "guided_recognise_condition",
          "type": "guided_interaction",
          "purpose": "Recognise a short-circuit or open-circuit condition from a description of a circuit's behaviour.",
          "requirement": "required",
          "teaches": [],
          "reinforces": [
            "EL-CIRCUIT-RECOGNISE-SHORT-CIRCUIT-001",
            "EL-CIRCUIT-RECOGNISE-OPEN-CIRCUIT-001"
          ],
          "tests": [
            "EL-CIRCUIT-RECOGNISE-SHORT-CIRCUIT-001",
            "EL-CIRCUIT-RECOGNISE-OPEN-CIRCUIT-001"
          ],
          "assertionFamilyId": "electrical.fault_conditions_protection",
          "capabilityIds": [
            "cap.fault.recognise_condition"
          ],
          "misconceptionTargets": [],
          "representation": {},
          "questionBlueprintId": "fault.recognise_condition",
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
            "cap.fault.recognise_condition"
          ]
        },
        {
          "id": "transfer_predict_short_effect",
          "type": "transfer_application",
          "purpose": "Transfer Ohm's law to predict what a short circuit does to current -- near-zero resistance drives current sharply upward.",
          "requirement": "required",
          "teaches": [
            "EL-CIRCUIT-PREDICT-SHORT-EFFECT-001"
          ],
          "reinforces": [
            "EL-OHM-RELATIONSHIP-001"
          ],
          "tests": [
            "EL-CIRCUIT-PREDICT-SHORT-EFFECT-001"
          ],
          "assertionFamilyId": "electrical.fault_conditions_protection",
          "capabilityIds": [
            "cap.fault.predict_effect"
          ],
          "misconceptionTargets": [],
          "representation": {},
          "questionBlueprintId": "fault.predict_short_effect",
          "presentation": {
            "interactionRequired": true,
            "interactionRole": "predict",
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
            "cap.fault.predict_effect"
          ]
        },
        {
          "id": "concept_protective_devices",
          "type": "concept_explanation",
          "purpose": "Introduce the fuse and circuit breaker as the practical response to the sharp current rise a short circuit causes.",
          "requirement": "required",
          "teaches": [
            "EL-PROTECTIVE-DEVICE-PURPOSE-001",
            "EL-FUSE-OPERATION-001"
          ],
          "reinforces": [
            "EL-CIRCUIT-PREDICT-SHORT-EFFECT-001"
          ],
          "tests": [],
          "assertionFamilyId": "electrical.fault_conditions_protection",
          "capabilityIds": [
            "cap.fault.select_protective_device"
          ],
          "misconceptionTargets": [],
          "representation": {},
          "presentation": {
            "interactionRequired": false,
            "answerReveal": "not_applicable",
            "contentMayScroll": true,
            "progressiveReveal": false
          },
          "scaffoldingLevel": "independent",
          "cognitiveDemand": "intermediate",
          "feedback": {
            "mode": "immediate",
            "explainWhy": false
          },
          "completionCondition": "view_acknowledged",
          "branchRoutes": [],
          "evidenceEmitted": []
        },
        {
          "id": "independent_select_protective_device",
          "type": "independent_question",
          "purpose": "Select the appropriate protective device for a given fault scenario.",
          "requirement": "required",
          "teaches": [],
          "reinforces": [],
          "tests": [
            "EL-PROTECTIVE-DEVICE-PURPOSE-001",
            "EL-FUSE-OPERATION-001"
          ],
          "assertionFamilyId": "electrical.fault_conditions_protection",
          "capabilityIds": [
            "cap.fault.select_protective_device"
          ],
          "misconceptionTargets": [],
          "representation": {},
          "questionBlueprintId": "fault.select_protective_device",
          "presentation": {
            "interactionRequired": true,
            "interactionRole": "identify",
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
            "cap.fault.select_protective_device"
          ]
        },
        {
          "id": "independent_compare_fuse_breaker",
          "type": "independent_question",
          "purpose": "Compare fuse and circuit-breaker operation and reuse -- a fuse must be replaced after operating, a circuit breaker can be reset.",
          "requirement": "required",
          "teaches": [
            "EL-CIRCUIT-BREAKER-VS-FUSE-001"
          ],
          "reinforces": [],
          "tests": [
            "EL-CIRCUIT-BREAKER-VS-FUSE-001"
          ],
          "assertionFamilyId": "electrical.fault_conditions_protection",
          "capabilityIds": [
            "cap.fault.compare_fuse_breaker"
          ],
          "misconceptionTargets": [],
          "representation": {},
          "questionBlueprintId": "fault.compare_fuse_breaker",
          "presentation": {
            "interactionRequired": true,
            "interactionRole": "identify",
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
            "cap.fault.compare_fuse_breaker"
          ]
        },
        {
          "id": "recap",
          "type": "recap",
          "purpose": "Summarise fault-condition recognition, the Ohm's-law-derived prediction of a short circuit's effect, and protective-device selection.",
          "requirement": "required",
          "teaches": [],
          "reinforces": [
            "EL-CIRCUIT-RECOGNISE-SHORT-CIRCUIT-001",
            "EL-CIRCUIT-BREAKER-VS-FUSE-001"
          ],
          "tests": [],
          "assertionFamilyId": "electrical.fault_conditions_protection",
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
        "electrical.fault_conditions_protection",
        "electrical.ohms_law"
      ],
      "completionCriteria": {
        "requiredStepIds": [
          "orientation",
          "concept_fault_conditions",
          "guided_recognise_condition",
          "transfer_predict_short_effect",
          "concept_protective_devices",
          "independent_select_protective_device",
          "independent_compare_fuse_breaker",
          "recap",
          "exit_completion"
        ],
        "requiredCapabilityEvidence": [
          "cap.fault.recognise_condition",
          "cap.fault.predict_effect",
          "cap.fault.select_protective_device",
          "cap.fault.compare_fuse_breaker"
        ],
        "masteryGateCapabilityIds": [
          "cap.fault.recognise_condition",
          "cap.fault.predict_effect"
        ],
        "requiresRemediationClearance": true,
        "exitSummary": "The learner has recognised short-circuit and open-circuit conditions, predicted a short circuit's effect on current, and selected between and compared fuses and circuit breakers."
      },
      "presentationModes": [
        "learn",
        "review"
      ],
      "contentRelease": "release.unit202.v3"
    },
    {
      "id": "lesson.electrical.instrumentation",
      "schemaVersion": 1,
      "version": 1,
      "title": "Electrical Measuring Instruments",
      "learnerFacingDescription": "Select and correctly connect the right instrument -- voltmeter, ammeter, ohmmeter, multimeter, clamp meter or oscilloscope -- for a given electrical measurement task.",
      "curriculumUnit": "City & Guilds 2365-02 Unit 202 -- Principles of Electrical Science",
      "prerequisiteKnowledge": [
        "electrical.si_units",
        "electrical.core_quantities"
      ],
      "targetAssertionFamilyIds": [
        "electrical.instrumentation"
      ],
      "targetAssertionIdentifiers": [
        "EL-INSTRUMENT-VOLTMETER-001",
        "EL-INSTRUMENT-AMMETER-001",
        "EL-INSTRUMENT-OHMMETER-001",
        "EL-INSTRUMENT-MULTIMETER-001",
        "EL-INSTRUMENT-SELECT-001",
        "EL-INSTRUMENT-VOLTMETER-INTERNAL-RESISTANCE-001",
        "EL-INSTRUMENT-AMMETER-INTERNAL-RESISTANCE-001",
        "EL-INSTRUMENT-CONTINUITY-TEST-001",
        "EL-INSTRUMENT-CLAMP-METER-001",
        "EL-INSTRUMENT-OSCILLOSCOPE-001",
        "EL-INSTRUMENT-WATTMETER-001"
      ],
      "targetCapabilityIds": [
        "cap.instrumentation.select_instrument",
        "cap.instrumentation.recognise_connection",
        "cap.instrumentation.recognise_internal_resistance_property",
        "cap.instrumentation.recognise_purpose"
      ],
      "remediationEligibility": [],
      "estimatedDurationMinutes": 15,
      "instructionalStrategy": "Instruments are introduced in the order a learner reaches for them on a real task (voltmeter/ammeter/ohmmeter/multimeter first, since electrical.instrumentation's own prerequisite chain -- EL-INSTRUMENT-SELECT-001 -- now genuinely depends on all four), then connection method, then why an ideal voltmeter/ammeter has the internal resistance it does, then the specialised instruments (clamp meter, oscilloscope, wattmeter) as purpose-matching content.",
      "steps": [
        {
          "id": "orientation",
          "type": "orientation",
          "purpose": "Frame why choosing and connecting the right instrument matters -- the wrong connection can give a wrong reading or damage the instrument.",
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
          "id": "concept_core_instruments",
          "type": "concept_explanation",
          "purpose": "Introduce the four core instruments: voltmeter (parallel), ammeter (series), ohmmeter (de-energised circuit) and multimeter (a single instrument configurable for several quantities).",
          "requirement": "required",
          "teaches": [
            "EL-INSTRUMENT-VOLTMETER-001",
            "EL-INSTRUMENT-AMMETER-001",
            "EL-INSTRUMENT-OHMMETER-001",
            "EL-INSTRUMENT-MULTIMETER-001"
          ],
          "reinforces": [],
          "tests": [],
          "assertionFamilyId": "electrical.instrumentation",
          "capabilityIds": [
            "cap.instrumentation.select_instrument"
          ],
          "misconceptionTargets": [],
          "representation": {},
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
          "id": "guided_select_instrument",
          "type": "guided_interaction",
          "purpose": "Select the correct instrument for a given electrical quantity.",
          "requirement": "required",
          "teaches": [],
          "reinforces": [
            "EL-INSTRUMENT-SELECT-001"
          ],
          "tests": [
            "EL-INSTRUMENT-SELECT-001"
          ],
          "assertionFamilyId": "electrical.instrumentation",
          "capabilityIds": [
            "cap.instrumentation.select_instrument"
          ],
          "misconceptionTargets": [],
          "representation": {},
          "questionBlueprintId": "instrumentation.select_instrument",
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
            "cap.instrumentation.select_instrument"
          ]
        },
        {
          "id": "independent_recognise_connection",
          "type": "independent_question",
          "purpose": "Recognise whether a voltmeter or ammeter is shown connected in series or parallel -- the connection-method mistake this family's own governed misconception targets directly.",
          "requirement": "required",
          "teaches": [],
          "reinforces": [],
          "tests": [
            "EL-INSTRUMENT-VOLTMETER-001",
            "EL-INSTRUMENT-AMMETER-001"
          ],
          "assertionFamilyId": "electrical.instrumentation",
          "capabilityIds": [
            "cap.instrumentation.recognise_connection"
          ],
          "misconceptionTargets": [
            {
              "misconceptionIdentifier": "MIS-EL-INSTRUMENT-CONNECTION-CONFUSION-001",
              "evidenceStrength": "direct"
            }
          ],
          "representation": {
            "diagramBlueprintId": "instrument.measurement_connection"
          },
          "questionBlueprintId": "instrumentation.recognise_connection",
          "presentation": {
            "interactionRequired": true,
            "interactionRole": "identify",
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
            "cap.instrumentation.recognise_connection"
          ]
        },
        {
          "id": "independent_internal_resistance",
          "type": "independent_question",
          "purpose": "Recognise why an ideal voltmeter has very high internal resistance and an ideal ammeter has very low internal resistance -- so that connecting either does not alter the circuit being measured.",
          "requirement": "required",
          "teaches": [
            "EL-INSTRUMENT-VOLTMETER-INTERNAL-RESISTANCE-001",
            "EL-INSTRUMENT-AMMETER-INTERNAL-RESISTANCE-001"
          ],
          "reinforces": [],
          "tests": [
            "EL-INSTRUMENT-VOLTMETER-INTERNAL-RESISTANCE-001",
            "EL-INSTRUMENT-AMMETER-INTERNAL-RESISTANCE-001"
          ],
          "assertionFamilyId": "electrical.instrumentation",
          "capabilityIds": [
            "cap.instrumentation.recognise_internal_resistance_property"
          ],
          "misconceptionTargets": [],
          "representation": {},
          "questionBlueprintId": "instrumentation.recognise_internal_resistance_property",
          "presentation": {
            "interactionRequired": true,
            "interactionRole": "identify",
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
            "cap.instrumentation.recognise_internal_resistance_property"
          ]
        },
        {
          "id": "concept_specialised_instruments",
          "type": "concept_explanation",
          "purpose": "Introduce the specialised instruments the Range requires: clamp meter (current without breaking the circuit), oscilloscope (waveform display) and wattmeter (power).",
          "requirement": "required",
          "teaches": [
            "EL-INSTRUMENT-CLAMP-METER-001",
            "EL-INSTRUMENT-OSCILLOSCOPE-001",
            "EL-INSTRUMENT-WATTMETER-001",
            "EL-INSTRUMENT-CONTINUITY-TEST-001"
          ],
          "reinforces": [],
          "tests": [],
          "assertionFamilyId": "electrical.instrumentation",
          "capabilityIds": [
            "cap.instrumentation.recognise_purpose"
          ],
          "misconceptionTargets": [],
          "representation": {},
          "presentation": {
            "interactionRequired": false,
            "answerReveal": "not_applicable",
            "contentMayScroll": true,
            "progressiveReveal": false
          },
          "scaffoldingLevel": "independent",
          "cognitiveDemand": "intermediate",
          "feedback": {
            "mode": "immediate",
            "explainWhy": false
          },
          "completionCondition": "view_acknowledged",
          "branchRoutes": [],
          "evidenceEmitted": []
        },
        {
          "id": "independent_recognise_purpose",
          "type": "independent_question",
          "purpose": "Identify the purpose of a specialised instrument from a description of its use.",
          "requirement": "required",
          "teaches": [],
          "reinforces": [],
          "tests": [
            "EL-INSTRUMENT-CLAMP-METER-001",
            "EL-INSTRUMENT-OSCILLOSCOPE-001",
            "EL-INSTRUMENT-CONTINUITY-TEST-001"
          ],
          "assertionFamilyId": "electrical.instrumentation",
          "capabilityIds": [
            "cap.instrumentation.recognise_purpose"
          ],
          "misconceptionTargets": [],
          "representation": {},
          "questionBlueprintId": "instrumentation.recognise_purpose",
          "presentation": {
            "interactionRequired": true,
            "interactionRole": "identify",
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
            "cap.instrumentation.recognise_purpose"
          ]
        },
        {
          "id": "recap",
          "type": "recap",
          "purpose": "Summarise instrument selection, connection method and the internal-resistance reasoning behind it.",
          "requirement": "required",
          "teaches": [],
          "reinforces": [
            "EL-INSTRUMENT-SELECT-001",
            "EL-INSTRUMENT-VOLTMETER-001",
            "EL-INSTRUMENT-AMMETER-001"
          ],
          "tests": [],
          "assertionFamilyId": "electrical.instrumentation",
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
      "misconceptionTargets": [
        {
          "misconceptionIdentifier": "MIS-EL-INSTRUMENT-CONNECTION-CONFUSION-001",
          "evidenceStrength": "direct"
        }
      ],
      "retrievalTags": [
        "electrical.instrumentation",
        "electrical.si_units"
      ],
      "completionCriteria": {
        "requiredStepIds": [
          "orientation",
          "concept_core_instruments",
          "guided_select_instrument",
          "independent_recognise_connection",
          "independent_internal_resistance",
          "concept_specialised_instruments",
          "independent_recognise_purpose",
          "recap",
          "exit_completion"
        ],
        "requiredCapabilityEvidence": [
          "cap.instrumentation.select_instrument",
          "cap.instrumentation.recognise_connection",
          "cap.instrumentation.recognise_internal_resistance_property",
          "cap.instrumentation.recognise_purpose"
        ],
        "masteryGateCapabilityIds": [
          "cap.instrumentation.select_instrument",
          "cap.instrumentation.recognise_connection"
        ],
        "requiresRemediationClearance": true,
        "exitSummary": "The learner has selected the correct instrument for a given quantity, recognised correct voltmeter/ammeter connection, explained the internal-resistance reasoning behind it, and identified the purpose of the specialised instruments."
      },
      "presentationModes": [
        "learn",
        "review"
      ],
      "contentRelease": "release.unit202.v3"
    },
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
      "contentRelease": "release.unit202.v3"
    },
    {
      "id": "lesson.electrical.power",
      "schemaVersion": 1,
      "version": 1,
      "title": "Electrical Power",
      "learnerFacingDescription": "Understand and calculate electrical power from voltage and current, current and resistance, or voltage and resistance, and find total circuit power.",
      "curriculumUnit": "City & Guilds 2365-02 Unit 202 -- Principles of Electrical Science",
      "prerequisiteKnowledge": [
        "electrical.ohms_law"
      ],
      "targetAssertionFamilyIds": [
        "electrical.power_relationships"
      ],
      "targetAssertionIdentifiers": [
        "EL-POWER-RELATIONSHIP-001",
        "EL-POWER-REARRANGE-001",
        "EL-POWER-SOLVE-001",
        "EL-POWER-SOLVE-IR-001",
        "EL-POWER-SOLVE-V2R-001",
        "EL-CIRCUIT-POWER-TOTAL-001"
      ],
      "targetCapabilityIds": [
        "cap.power.recognise_relationship",
        "cap.power.select_form",
        "cap.power.calculate_from_vi",
        "cap.power.calculate_from_ir",
        "cap.power.calculate_from_vr",
        "cap.power.calculate_total"
      ],
      "remediationEligibility": [],
      "estimatedDurationMinutes": 18,
      "instructionalStrategy": "P = VI is taught first as the base relationship, then the two Ohm's-law-substituted forms (P = I^2R, P = V^2/R) are introduced as the SAME relationship viewed through Ohm's law -- directly retrieving electrical.ohms_law -- rather than three unrelated formulas to memorise. Form selection is practised explicitly before each individual calculation, then total circuit power closes the lesson as a transfer application.",
      "steps": [
        {
          "id": "orientation",
          "type": "orientation",
          "purpose": "Frame electrical power as the rate of energy transfer, and why an electrician needs to calculate it (cable/device rating, running cost).",
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
          "id": "concept_power_relationship",
          "type": "concept_explanation",
          "purpose": "State P = V x I, and show how substituting Ohm's law gives the two equivalent forms P = I^2R and P = V^2/R.",
          "requirement": "required",
          "teaches": [
            "EL-POWER-RELATIONSHIP-001",
            "EL-POWER-REARRANGE-001"
          ],
          "reinforces": [
            "EL-OHM-RELATIONSHIP-001"
          ],
          "tests": [],
          "assertionFamilyId": "electrical.power_relationships",
          "capabilityIds": [],
          "misconceptionTargets": [],
          "representation": {
            "formulaFamilyId": "formula.electrical_power"
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
          "id": "guided_recognise_relationship",
          "type": "guided_interaction",
          "purpose": "Recognise P = V x I among plausible alternative formula forms.",
          "requirement": "required",
          "teaches": [],
          "reinforces": [
            "EL-POWER-RELATIONSHIP-001"
          ],
          "tests": [
            "EL-POWER-RELATIONSHIP-001"
          ],
          "assertionFamilyId": "electrical.power_relationships",
          "capabilityIds": [
            "cap.power.recognise_relationship"
          ],
          "misconceptionTargets": [],
          "representation": {
            "formulaFamilyId": "formula.electrical_power"
          },
          "questionBlueprintId": "power.recognise_relationship",
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
            "cap.power.recognise_relationship"
          ]
        },
        {
          "id": "worked_example_calculate_from_vi",
          "type": "worked_example",
          "purpose": "Model the base calculation, P = V x I, before asking the learner to do it unaided.",
          "requirement": "required",
          "teaches": [],
          "reinforces": [],
          "tests": [],
          "assertionFamilyId": "electrical.power_relationships",
          "capabilityIds": [
            "cap.power.calculate_from_vi"
          ],
          "misconceptionTargets": [],
          "representation": {
            "formulaFamilyId": "formula.electrical_power",
            "workedExampleBlueprintId": "worked.power.calculate_from_vi"
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
          "id": "guided_calculate_from_vi",
          "type": "guided_interaction",
          "purpose": "First learner-performed P = V x I calculation.",
          "requirement": "required",
          "teaches": [],
          "reinforces": [],
          "tests": [
            "EL-POWER-SOLVE-001"
          ],
          "assertionFamilyId": "electrical.power_relationships",
          "capabilityIds": [
            "cap.power.calculate_from_vi"
          ],
          "misconceptionTargets": [],
          "representation": {
            "formulaFamilyId": "formula.electrical_power"
          },
          "questionBlueprintId": "power.calculate_from_vi",
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
            "cap.power.calculate_from_vi"
          ]
        },
        {
          "id": "guided_select_form",
          "type": "guided_interaction",
          "purpose": "Select which form of the power relationship to use, based on which two quantities are actually known -- before practising the two substituted forms individually.",
          "requirement": "required",
          "teaches": [],
          "reinforces": [],
          "tests": [
            "EL-POWER-REARRANGE-001"
          ],
          "assertionFamilyId": "electrical.power_relationships",
          "capabilityIds": [
            "cap.power.select_form"
          ],
          "misconceptionTargets": [],
          "representation": {
            "formulaFamilyId": "formula.electrical_power"
          },
          "questionBlueprintId": "power.select_form",
          "presentation": {
            "interactionRequired": true,
            "interactionRole": "identify",
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
            "cap.power.select_form"
          ]
        },
        {
          "id": "worked_example_calculate_from_ir",
          "type": "worked_example",
          "purpose": "Model P = I^2R, the current/resistance form, before the learner practises it.",
          "requirement": "required",
          "teaches": [],
          "reinforces": [],
          "tests": [],
          "assertionFamilyId": "electrical.power_relationships",
          "capabilityIds": [
            "cap.power.calculate_from_ir"
          ],
          "misconceptionTargets": [],
          "representation": {
            "formulaFamilyId": "formula.electrical_power",
            "workedExampleBlueprintId": "worked.power.calculate_from_ir"
          },
          "presentation": {
            "interactionRequired": true,
            "interactionRole": "predict",
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
          "completionCondition": "view_acknowledged",
          "branchRoutes": [],
          "evidenceEmitted": []
        },
        {
          "id": "independent_calculate_from_ir",
          "type": "independent_question",
          "purpose": "Unscaffolded P = I^2R calculation.",
          "requirement": "required",
          "teaches": [],
          "reinforces": [],
          "tests": [
            "EL-POWER-SOLVE-IR-001"
          ],
          "assertionFamilyId": "electrical.power_relationships",
          "capabilityIds": [
            "cap.power.calculate_from_ir"
          ],
          "misconceptionTargets": [],
          "representation": {
            "formulaFamilyId": "formula.electrical_power"
          },
          "questionBlueprintId": "power.calculate_from_ir",
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
            "cap.power.calculate_from_ir"
          ]
        },
        {
          "id": "independent_calculate_from_vr",
          "type": "independent_question",
          "purpose": "Unscaffolded P = V^2/R calculation -- the third form, practised without a preceding worked example since the pattern is now established.",
          "requirement": "required",
          "teaches": [],
          "reinforces": [],
          "tests": [
            "EL-POWER-SOLVE-V2R-001"
          ],
          "assertionFamilyId": "electrical.power_relationships",
          "capabilityIds": [
            "cap.power.calculate_from_vr"
          ],
          "misconceptionTargets": [],
          "representation": {
            "formulaFamilyId": "formula.electrical_power"
          },
          "questionBlueprintId": "power.calculate_from_vr",
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
            "cap.power.calculate_from_vr"
          ]
        },
        {
          "id": "transfer_calculate_total_power",
          "type": "transfer_application",
          "purpose": "Transfer to a multi-component circuit: find total circuit power as the sum of individual component powers.",
          "requirement": "required",
          "teaches": [
            "EL-CIRCUIT-POWER-TOTAL-001"
          ],
          "reinforces": [],
          "tests": [
            "EL-CIRCUIT-POWER-TOTAL-001"
          ],
          "assertionFamilyId": "electrical.power_relationships",
          "capabilityIds": [
            "cap.power.calculate_total"
          ],
          "misconceptionTargets": [],
          "representation": {
            "formulaFamilyId": "formula.electrical_power"
          },
          "questionBlueprintId": "power.calculate_total",
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
            "cap.power.calculate_total"
          ]
        },
        {
          "id": "retrieval_check",
          "type": "retrieval_check",
          "purpose": "Short delayed retrieval of the base P = V x I calculation to strengthen retention before the lesson ends.",
          "requirement": "required",
          "teaches": [],
          "reinforces": [],
          "tests": [
            "EL-POWER-SOLVE-001"
          ],
          "assertionFamilyId": "electrical.power_relationships",
          "capabilityIds": [
            "cap.power.calculate_from_vi"
          ],
          "misconceptionTargets": [],
          "representation": {
            "formulaFamilyId": "formula.electrical_power"
          },
          "questionBlueprintId": "power.calculate_from_vi",
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
            "cap.power.calculate_from_vi"
          ]
        },
        {
          "id": "recap",
          "type": "recap",
          "purpose": "Summarise the three equivalent power forms, how to select between them, and total circuit power.",
          "requirement": "required",
          "teaches": [],
          "reinforces": [
            "EL-POWER-RELATIONSHIP-001",
            "EL-CIRCUIT-POWER-TOTAL-001"
          ],
          "tests": [],
          "assertionFamilyId": "electrical.power_relationships",
          "capabilityIds": [],
          "misconceptionTargets": [],
          "representation": {
            "formulaFamilyId": "formula.electrical_power"
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
      "misconceptionTargets": [],
      "retrievalTags": [
        "electrical.power_relationships",
        "electrical.ohms_law"
      ],
      "completionCriteria": {
        "requiredStepIds": [
          "orientation",
          "concept_power_relationship",
          "guided_recognise_relationship",
          "worked_example_calculate_from_vi",
          "guided_calculate_from_vi",
          "guided_select_form",
          "worked_example_calculate_from_ir",
          "independent_calculate_from_ir",
          "independent_calculate_from_vr",
          "transfer_calculate_total_power",
          "retrieval_check",
          "recap",
          "exit_completion"
        ],
        "requiredCapabilityEvidence": [
          "cap.power.recognise_relationship",
          "cap.power.select_form",
          "cap.power.calculate_from_vi",
          "cap.power.calculate_from_ir",
          "cap.power.calculate_from_vr",
          "cap.power.calculate_total"
        ],
        "masteryGateCapabilityIds": [
          "cap.power.calculate_from_vi",
          "cap.power.select_form",
          "cap.power.calculate_total"
        ],
        "requiresRemediationClearance": true,
        "exitSummary": "The learner has recognised and selected between the three equivalent power relationships, calculated power from each pair of known quantities, and found total circuit power."
      },
      "presentationModes": [
        "learn",
        "review"
      ],
      "contentRelease": "release.unit202.v3"
    },
    {
      "id": "lesson.electrical.resistivity",
      "schemaVersion": 1,
      "version": 1,
      "title": "Resistance and Resistivity",
      "learnerFacingDescription": "Understand resistivity as a material property, predict how conductor length and cross-sectional area affect resistance, compare materials, and calculate resistance using R = rho L / A.",
      "curriculumUnit": "City & Guilds 2365-02 Unit 202 -- Principles of Electrical Science",
      "prerequisiteKnowledge": [
        "electrical.core_quantities",
        "electrical.conductors_and_insulators",
        "foundational.algebraic_technique"
      ],
      "targetAssertionFamilyIds": [
        "electrical.resistivity"
      ],
      "targetAssertionIdentifiers": [
        "EL-CONCEPT-RESISTIVITY-001",
        "EL-RESISTIVITY-COMPARE-MATERIALS-001",
        "EL-RESISTIVITY-LENGTH-EFFECT-001",
        "EL-RESISTIVITY-AREA-EFFECT-001",
        "EL-RESISTIVITY-RELATIONSHIP-001"
      ],
      "targetCapabilityIds": [
        "cap.resistivity.recognise",
        "cap.resistivity.compare_materials",
        "cap.resistivity.predict_length_effect",
        "cap.resistivity.predict_area_effect",
        "cap.resistivity.calculate"
      ],
      "remediationEligibility": [],
      "estimatedDurationMinutes": 15,
      "instructionalStrategy": "Resistivity is introduced as a material property distinct from resistance itself (retrieving electrical.core_quantities' resistance definition and electrical.conductors_and_insulators' conductor/insulator distinction), then the two geometric factors (length, area) are predicted qualitatively via direct/inverse proportion before the full R = rho L / A calculation combines all three factors -- scaffolding the calculation's complexity rather than presenting it cold.",
      "steps": [
        {
          "id": "orientation",
          "type": "orientation",
          "purpose": "Frame why two conductors of the same material can still have different resistance -- length and cross-sectional area matter, not just what the conductor is made of.",
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
          "id": "concept_resistivity",
          "type": "concept_explanation",
          "purpose": "State resistivity as a material property (independent of a specific conductor's dimensions) distinct from resistance itself.",
          "requirement": "required",
          "teaches": [
            "EL-CONCEPT-RESISTIVITY-001"
          ],
          "reinforces": [
            "EL-CONCEPT-RESISTANCE-001"
          ],
          "tests": [],
          "assertionFamilyId": "electrical.resistivity",
          "capabilityIds": [
            "cap.resistivity.recognise"
          ],
          "misconceptionTargets": [],
          "representation": {},
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
          "id": "guided_recognise_resistivity",
          "type": "guided_interaction",
          "purpose": "Distinguish resistivity from resistance in a given scenario.",
          "requirement": "required",
          "teaches": [],
          "reinforces": [
            "EL-CONCEPT-RESISTIVITY-001"
          ],
          "tests": [
            "EL-CONCEPT-RESISTIVITY-001"
          ],
          "assertionFamilyId": "electrical.resistivity",
          "capabilityIds": [
            "cap.resistivity.recognise"
          ],
          "misconceptionTargets": [],
          "representation": {},
          "questionBlueprintId": "resistivity.recognise",
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
            "cap.resistivity.recognise"
          ]
        },
        {
          "id": "independent_compare_materials",
          "type": "independent_question",
          "purpose": "Compare two materials by resistivity to determine which is the better conductor.",
          "requirement": "required",
          "teaches": [
            "EL-RESISTIVITY-COMPARE-MATERIALS-001"
          ],
          "reinforces": [],
          "tests": [
            "EL-RESISTIVITY-COMPARE-MATERIALS-001"
          ],
          "assertionFamilyId": "electrical.resistivity",
          "capabilityIds": [
            "cap.resistivity.compare_materials"
          ],
          "misconceptionTargets": [],
          "representation": {},
          "questionBlueprintId": "resistivity.compare_materials",
          "presentation": {
            "interactionRequired": true,
            "interactionRole": "identify",
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
            "cap.resistivity.compare_materials"
          ]
        },
        {
          "id": "guided_predict_length_area_effects",
          "type": "guided_interaction",
          "purpose": "Predict, qualitatively, that increasing conductor length increases resistance (direct proportion) and increasing cross-sectional area decreases resistance (inverse proportion) -- before combining both into a calculation.",
          "requirement": "required",
          "teaches": [
            "EL-RESISTIVITY-LENGTH-EFFECT-001",
            "EL-RESISTIVITY-AREA-EFFECT-001"
          ],
          "reinforces": [],
          "tests": [
            "EL-RESISTIVITY-LENGTH-EFFECT-001"
          ],
          "assertionFamilyId": "electrical.resistivity",
          "capabilityIds": [
            "cap.resistivity.predict_length_effect"
          ],
          "misconceptionTargets": [],
          "representation": {},
          "questionBlueprintId": "resistivity.predict_length_effect",
          "presentation": {
            "interactionRequired": true,
            "interactionRole": "predict",
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
            "cap.resistivity.predict_length_effect"
          ]
        },
        {
          "id": "independent_predict_area_effect",
          "type": "independent_question",
          "purpose": "Predict the effect of increasing cross-sectional area on resistance, unscaffolded.",
          "requirement": "required",
          "teaches": [],
          "reinforces": [],
          "tests": [
            "EL-RESISTIVITY-AREA-EFFECT-001"
          ],
          "assertionFamilyId": "electrical.resistivity",
          "capabilityIds": [
            "cap.resistivity.predict_area_effect"
          ],
          "misconceptionTargets": [],
          "representation": {},
          "questionBlueprintId": "resistivity.predict_area_effect",
          "presentation": {
            "interactionRequired": true,
            "interactionRole": "predict",
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
            "cap.resistivity.predict_area_effect"
          ]
        },
        {
          "id": "worked_example_calculate_resistance",
          "type": "worked_example",
          "purpose": "Model calculating resistance from resistivity, length and cross-sectional area (R = rho L / A) before asking the learner to do it unaided.",
          "requirement": "required",
          "teaches": [
            "EL-RESISTIVITY-RELATIONSHIP-001"
          ],
          "reinforces": [],
          "tests": [],
          "assertionFamilyId": "electrical.resistivity",
          "capabilityIds": [
            "cap.resistivity.calculate"
          ],
          "misconceptionTargets": [],
          "representation": {
            "formulaFamilyId": "formula.resistivity",
            "workedExampleBlueprintId": "worked.resistivity.calculate_resistance"
          },
          "presentation": {
            "interactionRequired": true,
            "interactionRole": "predict",
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
          "completionCondition": "view_acknowledged",
          "branchRoutes": [],
          "evidenceEmitted": []
        },
        {
          "id": "transfer_calculate_resistance",
          "type": "transfer_application",
          "purpose": "Unscaffolded calculation, combining the material-property and both geometric factors taught separately above into one result.",
          "requirement": "required",
          "teaches": [],
          "reinforces": [],
          "tests": [
            "EL-RESISTIVITY-RELATIONSHIP-001"
          ],
          "assertionFamilyId": "electrical.resistivity",
          "capabilityIds": [
            "cap.resistivity.calculate"
          ],
          "misconceptionTargets": [],
          "representation": {
            "formulaFamilyId": "formula.resistivity"
          },
          "questionBlueprintId": "resistivity.calculate_resistance",
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
            "cap.resistivity.calculate"
          ]
        },
        {
          "id": "recap",
          "type": "recap",
          "purpose": "Summarise resistivity as a material property and how length, area and resistivity together determine a conductor's resistance.",
          "requirement": "required",
          "teaches": [],
          "reinforces": [
            "EL-CONCEPT-RESISTIVITY-001",
            "EL-RESISTIVITY-RELATIONSHIP-001"
          ],
          "tests": [],
          "assertionFamilyId": "electrical.resistivity",
          "capabilityIds": [],
          "misconceptionTargets": [],
          "representation": {
            "formulaFamilyId": "formula.resistivity"
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
      "misconceptionTargets": [],
      "retrievalTags": [
        "electrical.resistivity",
        "electrical.conductors_and_insulators",
        "foundational.algebraic_technique"
      ],
      "completionCriteria": {
        "requiredStepIds": [
          "orientation",
          "concept_resistivity",
          "guided_recognise_resistivity",
          "independent_compare_materials",
          "guided_predict_length_area_effects",
          "independent_predict_area_effect",
          "worked_example_calculate_resistance",
          "transfer_calculate_resistance",
          "recap",
          "exit_completion"
        ],
        "requiredCapabilityEvidence": [
          "cap.resistivity.recognise",
          "cap.resistivity.compare_materials",
          "cap.resistivity.predict_length_effect",
          "cap.resistivity.predict_area_effect",
          "cap.resistivity.calculate"
        ],
        "masteryGateCapabilityIds": [
          "cap.resistivity.calculate"
        ],
        "requiresRemediationClearance": true,
        "exitSummary": "The learner has distinguished resistivity from resistance, compared materials, predicted the effect of length and area on resistance, and calculated resistance from resistivity, length and area."
      },
      "presentationModes": [
        "learn",
        "review"
      ],
      "contentRelease": "release.unit202.v3"
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
      "contentRelease": "release.unit202.v3"
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
      "contentRelease": "release.unit202.v3"
    },
    {
      "id": "lesson.electrical.series-vs-parallel-comparison",
      "schemaVersion": 1,
      "version": 1,
      "title": "Series versus Parallel: Comparison and Mixed Circuits",
      "learnerFacingDescription": "Identify whether a circuit is series, parallel or mixed, trace current paths, and compare resistance, current, voltage, power and energy behaviour between the two topologies.",
      "curriculumUnit": "City & Guilds 2365-02 Unit 202 -- Principles of Electrical Science",
      "prerequisiteKnowledge": [
        "electrical.series_circuits",
        "electrical.parallel_circuits"
      ],
      "targetAssertionFamilyIds": [
        "electrical.series_vs_parallel_comparison"
      ],
      "targetAssertionIdentifiers": [
        "EL-CIRCUIT-SELECT-CONFIGURATION-001",
        "EL-CIRCUIT-MIXED-SERIES-PARALLEL-RECOGNITION-001",
        "EL-CIRCUIT-TRACE-CURRENT-PATH-001",
        "EL-CIRCUIT-COMPARE-RESISTANCE-001",
        "EL-CIRCUIT-COMPARE-CURRENT-001",
        "EL-CIRCUIT-COMPARE-VOLTAGE-001",
        "EL-CIRCUIT-COMPARE-POWER-001",
        "EL-CIRCUIT-COMPARE-ENERGY-001"
      ],
      "targetCapabilityIds": [
        "cap.comparison.identify_topology",
        "cap.comparison.recognise_mixed_circuit",
        "cap.comparison.trace_current_path",
        "cap.comparison.compare_resistance",
        "cap.comparison.compare_current_voltage",
        "cap.comparison.compare_power_energy"
      ],
      "remediationEligibility": [],
      "estimatedDurationMinutes": 18,
      "instructionalStrategy": "Deliberately sequenced after both series and parallel are individually secure: topology identification and current-path tracing come first (the visual-recognition skill), then the same resistor-set-in-both-topologies comparison used throughout electrical.series_circuits/parallel_circuits' own dominant-component reasoning is generalised into a direct resistance/current/voltage/power comparison, and mixed circuits close the lesson as the genuine synthesis of both topologies.",
      "steps": [
        {
          "id": "orientation",
          "type": "orientation",
          "purpose": "Frame this lesson as bringing series and parallel together -- comparing them directly and recognising when a real circuit uses both.",
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
          "id": "guided_identify_topology",
          "type": "guided_interaction",
          "purpose": "Identify whether a given circuit diagram is series or parallel -- retrieval of both prior lessons' own structure-recognition capability.",
          "requirement": "required",
          "teaches": [
            "EL-CIRCUIT-SELECT-CONFIGURATION-001"
          ],
          "reinforces": [
            "EL-CIRCUIT-SERIES-STRUCTURE-001"
          ],
          "tests": [
            "EL-CIRCUIT-SELECT-CONFIGURATION-001"
          ],
          "assertionFamilyId": "electrical.series_vs_parallel_comparison",
          "capabilityIds": [
            "cap.comparison.identify_topology"
          ],
          "misconceptionTargets": [
            {
              "misconceptionIdentifier": "MIS-EL-SERIES-PARALLEL-CONFUSION-001",
              "evidenceStrength": "direct"
            }
          ],
          "representation": {
            "diagramBlueprintId": "circuit.series_parallel_mixed"
          },
          "questionBlueprintId": "comparison.identify_topology",
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
            "cap.comparison.identify_topology"
          ]
        },
        {
          "id": "independent_trace_current_path",
          "type": "independent_question",
          "purpose": "Trace the path(s) current takes through a circuit diagram -- a genuinely visual skill this family adds beyond either topology lesson alone.",
          "requirement": "required",
          "teaches": [
            "EL-CIRCUIT-TRACE-CURRENT-PATH-001"
          ],
          "reinforces": [],
          "tests": [
            "EL-CIRCUIT-TRACE-CURRENT-PATH-001"
          ],
          "assertionFamilyId": "electrical.series_vs_parallel_comparison",
          "capabilityIds": [
            "cap.comparison.trace_current_path"
          ],
          "misconceptionTargets": [],
          "representation": {
            "diagramBlueprintId": "circuit.series_parallel_mixed"
          },
          "questionBlueprintId": "comparison.trace_current_path",
          "presentation": {
            "interactionRequired": true,
            "interactionRole": "identify",
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
            "cap.comparison.trace_current_path"
          ]
        },
        {
          "id": "concept_comparison",
          "type": "concept_explanation",
          "purpose": "Compare, directly, how the same set of resistors behaves differently in series versus parallel: total resistance, current, voltage, power and energy.",
          "requirement": "required",
          "teaches": [
            "EL-CIRCUIT-COMPARE-RESISTANCE-001",
            "EL-CIRCUIT-COMPARE-CURRENT-001",
            "EL-CIRCUIT-COMPARE-VOLTAGE-001"
          ],
          "reinforces": [
            "EL-SERIES-RESISTANCE-001",
            "EL-PARALLEL-RESISTANCE-001"
          ],
          "tests": [],
          "assertionFamilyId": "electrical.series_vs_parallel_comparison",
          "capabilityIds": [
            "cap.comparison.compare_resistance"
          ],
          "misconceptionTargets": [],
          "representation": {},
          "presentation": {
            "interactionRequired": false,
            "answerReveal": "not_applicable",
            "contentMayScroll": true,
            "progressiveReveal": false
          },
          "scaffoldingLevel": "guided",
          "cognitiveDemand": "intermediate",
          "feedback": {
            "mode": "immediate",
            "explainWhy": false
          },
          "completionCondition": "view_acknowledged",
          "branchRoutes": [],
          "evidenceEmitted": []
        },
        {
          "id": "guided_compare_resistance",
          "type": "guided_interaction",
          "purpose": "Compare total resistance of the same resistor set connected in series versus parallel.",
          "requirement": "required",
          "teaches": [],
          "reinforces": [
            "EL-CIRCUIT-COMPARE-RESISTANCE-001"
          ],
          "tests": [
            "EL-CIRCUIT-COMPARE-RESISTANCE-001"
          ],
          "assertionFamilyId": "electrical.series_vs_parallel_comparison",
          "capabilityIds": [
            "cap.comparison.compare_resistance"
          ],
          "misconceptionTargets": [],
          "representation": {},
          "questionBlueprintId": "comparison.compare_resistance",
          "presentation": {
            "interactionRequired": true,
            "interactionRole": "identify",
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
            "cap.comparison.compare_resistance"
          ]
        },
        {
          "id": "independent_compare_current_voltage",
          "type": "independent_question",
          "purpose": "Compare current and voltage behaviour between series and parallel circuits.",
          "requirement": "required",
          "teaches": [],
          "reinforces": [],
          "tests": [
            "EL-CIRCUIT-COMPARE-CURRENT-001",
            "EL-CIRCUIT-COMPARE-VOLTAGE-001"
          ],
          "assertionFamilyId": "electrical.series_vs_parallel_comparison",
          "capabilityIds": [
            "cap.comparison.compare_current_voltage"
          ],
          "misconceptionTargets": [
            {
              "misconceptionIdentifier": "MIS-EL-CURRENT-VOLTAGE-CONFUSION-001",
              "evidenceStrength": "suggestive"
            }
          ],
          "representation": {},
          "questionBlueprintId": "comparison.compare_current_voltage",
          "presentation": {
            "interactionRequired": true,
            "interactionRole": "identify",
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
            "cap.comparison.compare_current_voltage"
          ]
        },
        {
          "id": "independent_compare_power_energy",
          "type": "independent_question",
          "purpose": "Compare total power/energy of the same resistor set connected in series versus parallel.",
          "requirement": "required",
          "teaches": [
            "EL-CIRCUIT-COMPARE-POWER-001",
            "EL-CIRCUIT-COMPARE-ENERGY-001"
          ],
          "reinforces": [],
          "tests": [
            "EL-CIRCUIT-COMPARE-POWER-001",
            "EL-CIRCUIT-COMPARE-ENERGY-001"
          ],
          "assertionFamilyId": "electrical.series_vs_parallel_comparison",
          "capabilityIds": [
            "cap.comparison.compare_power_energy"
          ],
          "misconceptionTargets": [],
          "representation": {},
          "questionBlueprintId": "comparison.compare_power_energy",
          "presentation": {
            "interactionRequired": true,
            "interactionRole": "identify",
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
            "cap.comparison.compare_power_energy"
          ]
        },
        {
          "id": "transfer_recognise_mixed_circuit",
          "type": "transfer_application",
          "purpose": "Synthesise both topologies: recognise a circuit combining series and parallel sections -- the genuine capstone application.",
          "requirement": "required",
          "teaches": [
            "EL-CIRCUIT-MIXED-SERIES-PARALLEL-RECOGNITION-001"
          ],
          "reinforces": [],
          "tests": [
            "EL-CIRCUIT-MIXED-SERIES-PARALLEL-RECOGNITION-001"
          ],
          "assertionFamilyId": "electrical.series_vs_parallel_comparison",
          "capabilityIds": [
            "cap.comparison.recognise_mixed_circuit"
          ],
          "misconceptionTargets": [],
          "representation": {
            "diagramBlueprintId": "circuit.series_parallel_mixed"
          },
          "questionBlueprintId": "comparison.recognise_mixed_circuit",
          "presentation": {
            "interactionRequired": true,
            "interactionRole": "identify",
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
            "cap.comparison.recognise_mixed_circuit"
          ]
        },
        {
          "id": "recap",
          "type": "recap",
          "purpose": "Summarise the series/parallel comparison across resistance, current, voltage, power and energy, and mixed-circuit recognition.",
          "requirement": "required",
          "teaches": [],
          "reinforces": [
            "EL-CIRCUIT-COMPARE-RESISTANCE-001",
            "EL-CIRCUIT-MIXED-SERIES-PARALLEL-RECOGNITION-001"
          ],
          "tests": [],
          "assertionFamilyId": "electrical.series_vs_parallel_comparison",
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
      "misconceptionTargets": [
        {
          "misconceptionIdentifier": "MIS-EL-SERIES-PARALLEL-CONFUSION-001",
          "evidenceStrength": "direct"
        },
        {
          "misconceptionIdentifier": "MIS-EL-CURRENT-VOLTAGE-CONFUSION-001",
          "evidenceStrength": "suggestive"
        }
      ],
      "retrievalTags": [
        "electrical.series_vs_parallel_comparison",
        "electrical.series_circuits",
        "electrical.parallel_circuits"
      ],
      "completionCriteria": {
        "requiredStepIds": [
          "orientation",
          "guided_identify_topology",
          "independent_trace_current_path",
          "concept_comparison",
          "guided_compare_resistance",
          "independent_compare_current_voltage",
          "independent_compare_power_energy",
          "transfer_recognise_mixed_circuit",
          "recap",
          "exit_completion"
        ],
        "requiredCapabilityEvidence": [
          "cap.comparison.identify_topology",
          "cap.comparison.recognise_mixed_circuit",
          "cap.comparison.trace_current_path",
          "cap.comparison.compare_resistance",
          "cap.comparison.compare_current_voltage",
          "cap.comparison.compare_power_energy"
        ],
        "masteryGateCapabilityIds": [
          "cap.comparison.identify_topology",
          "cap.comparison.recognise_mixed_circuit"
        ],
        "requiresRemediationClearance": true,
        "exitSummary": "The learner has identified series/parallel/mixed topology, traced current paths, and compared resistance, current, voltage, power and energy behaviour between series and parallel circuits."
      },
      "presentationModes": [
        "learn",
        "review"
      ],
      "contentRelease": "release.unit202.v3"
    },
    {
      "id": "lesson.electrical.si-units",
      "schemaVersion": 1,
      "version": 1,
      "title": "SI Units for Electrical Quantities",
      "learnerFacingDescription": "Identify the correct SI unit for each core electrical quantity, distinguish base units from derived units, and avoid the most common unit mix-ups.",
      "curriculumUnit": "City & Guilds 2365-02 Unit 202 -- Principles of Electrical Science",
      "prerequisiteKnowledge": [
        "electrical.core_quantities"
      ],
      "targetAssertionFamilyIds": [
        "electrical.si_units"
      ],
      "targetAssertionIdentifiers": [
        "EL-UNIT-VOLT-001",
        "EL-UNIT-AMPERE-001",
        "EL-UNIT-OHM-001",
        "EL-UNIT-WATT-001",
        "EL-UNIT-JOULE-001",
        "EL-UNIT-HERTZ-001",
        "EL-UNIT-OHM-METRE-001",
        "EL-UNIT-BASE-VS-DERIVED-001"
      ],
      "targetCapabilityIds": [
        "cap.si_units.identify_unit",
        "cap.si_units.distinguish_base_derived",
        "cap.si_units.diagnose_unit_confusion"
      ],
      "remediationEligibility": [],
      "estimatedDurationMinutes": 12,
      "instructionalStrategy": "Units are taught immediately after the quantities they measure (retrieval of electrical.core_quantities), practised across several quantities using the same identify_unit grammar with varied seeds, then a base-vs-derived distinction and a targeted unit-confusion diagnostic close the lesson before the learner reaches any calculation lesson that depends on stating an answer with the correct unit.",
      "steps": [
        {
          "id": "orientation",
          "type": "orientation",
          "purpose": "Frame why the correct SI unit matters -- a numerically correct answer with the wrong unit is still wrong on a real electrical task.",
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
          "id": "concept_electrical_units",
          "type": "concept_explanation",
          "purpose": "State the SI unit for each core electrical quantity: volt, ampere, ohm, watt, joule, hertz, and ohm-metre for resistivity.",
          "requirement": "required",
          "teaches": [
            "EL-UNIT-VOLT-001",
            "EL-UNIT-AMPERE-001",
            "EL-UNIT-OHM-001",
            "EL-UNIT-WATT-001",
            "EL-UNIT-JOULE-001",
            "EL-UNIT-HERTZ-001",
            "EL-UNIT-OHM-METRE-001"
          ],
          "reinforces": [],
          "tests": [],
          "assertionFamilyId": "electrical.si_units",
          "capabilityIds": [
            "cap.si_units.identify_unit"
          ],
          "misconceptionTargets": [],
          "representation": {},
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
          "id": "guided_identify_unit_1",
          "type": "guided_interaction",
          "purpose": "First scaffolded unit-identification check.",
          "requirement": "required",
          "teaches": [],
          "reinforces": [
            "EL-UNIT-VOLT-001",
            "EL-UNIT-AMPERE-001",
            "EL-UNIT-OHM-001"
          ],
          "tests": [
            "EL-UNIT-VOLT-001",
            "EL-UNIT-AMPERE-001",
            "EL-UNIT-OHM-001"
          ],
          "assertionFamilyId": "electrical.si_units",
          "capabilityIds": [
            "cap.si_units.identify_unit"
          ],
          "misconceptionTargets": [],
          "representation": {},
          "questionBlueprintId": "si_units.identify_unit",
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
            "cap.si_units.identify_unit"
          ]
        },
        {
          "id": "independent_identify_unit_2",
          "type": "independent_question",
          "purpose": "Unscaffolded repetition across the remaining quantities (power, energy, frequency), varied by seed.",
          "requirement": "required",
          "teaches": [],
          "reinforces": [],
          "tests": [
            "EL-UNIT-WATT-001",
            "EL-UNIT-JOULE-001",
            "EL-UNIT-HERTZ-001"
          ],
          "assertionFamilyId": "electrical.si_units",
          "capabilityIds": [
            "cap.si_units.identify_unit"
          ],
          "misconceptionTargets": [],
          "representation": {},
          "questionBlueprintId": "si_units.identify_unit",
          "presentation": {
            "interactionRequired": true,
            "interactionRole": "identify",
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
            "cap.si_units.identify_unit"
          ]
        },
        {
          "id": "guided_distinguish_base_derived",
          "type": "guided_interaction",
          "purpose": "Distinguish an SI base unit (e.g. the ampere) from an SI derived unit (e.g. the ohm, built from base units).",
          "requirement": "required",
          "teaches": [
            "EL-UNIT-BASE-VS-DERIVED-001"
          ],
          "reinforces": [],
          "tests": [
            "EL-UNIT-BASE-VS-DERIVED-001"
          ],
          "assertionFamilyId": "electrical.si_units",
          "capabilityIds": [
            "cap.si_units.distinguish_base_derived"
          ],
          "misconceptionTargets": [],
          "representation": {},
          "questionBlueprintId": "si_units.distinguish_base_derived",
          "presentation": {
            "interactionRequired": true,
            "interactionRole": "identify",
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
            "cap.si_units.distinguish_base_derived"
          ]
        },
        {
          "id": "independent_diagnose_unit_confusion",
          "type": "independent_question",
          "purpose": "Diagnostic check for the most common electrical unit mix-ups (e.g. volt/ohm) and SI-prefix errors.",
          "requirement": "required",
          "teaches": [],
          "reinforces": [],
          "tests": [
            "EL-UNIT-VOLT-001",
            "EL-UNIT-OHM-001"
          ],
          "assertionFamilyId": "electrical.si_units",
          "capabilityIds": [
            "cap.si_units.diagnose_unit_confusion"
          ],
          "misconceptionTargets": [
            {
              "misconceptionIdentifier": "MIS-EL-UNIT-CONFUSION-001",
              "evidenceStrength": "direct"
            },
            {
              "misconceptionIdentifier": "MIS-EL-SI-PREFIX-ERROR-001",
              "evidenceStrength": "suggestive"
            }
          ],
          "representation": {},
          "questionBlueprintId": "si_units.diagnose_unit_confusion",
          "presentation": {
            "interactionRequired": true,
            "interactionRole": "apply",
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
            "cap.si_units.diagnose_unit_confusion"
          ]
        },
        {
          "id": "retrieval_check",
          "type": "retrieval_check",
          "purpose": "Short delayed retrieval of unit identification to strengthen retention before the lesson ends.",
          "requirement": "required",
          "teaches": [],
          "reinforces": [],
          "tests": [
            "EL-UNIT-VOLT-001",
            "EL-UNIT-AMPERE-001",
            "EL-UNIT-OHM-001"
          ],
          "assertionFamilyId": "electrical.si_units",
          "capabilityIds": [
            "cap.si_units.identify_unit"
          ],
          "misconceptionTargets": [],
          "representation": {},
          "questionBlueprintId": "si_units.identify_unit",
          "presentation": {
            "interactionRequired": true,
            "interactionRole": "identify",
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
            "cap.si_units.identify_unit"
          ]
        },
        {
          "id": "recap",
          "type": "recap",
          "purpose": "Summarise electrical SI units, the base/derived distinction, and the most common confusion pairs.",
          "requirement": "required",
          "teaches": [],
          "reinforces": [
            "EL-UNIT-VOLT-001",
            "EL-UNIT-AMPERE-001",
            "EL-UNIT-OHM-001",
            "EL-UNIT-BASE-VS-DERIVED-001"
          ],
          "tests": [],
          "assertionFamilyId": "electrical.si_units",
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
      "misconceptionTargets": [
        {
          "misconceptionIdentifier": "MIS-EL-UNIT-CONFUSION-001",
          "evidenceStrength": "direct"
        },
        {
          "misconceptionIdentifier": "MIS-EL-SI-PREFIX-ERROR-001",
          "evidenceStrength": "suggestive"
        }
      ],
      "retrievalTags": [
        "electrical.si_units"
      ],
      "completionCriteria": {
        "requiredStepIds": [
          "orientation",
          "concept_electrical_units",
          "guided_identify_unit_1",
          "independent_identify_unit_2",
          "guided_distinguish_base_derived",
          "independent_diagnose_unit_confusion",
          "retrieval_check",
          "recap",
          "exit_completion"
        ],
        "requiredCapabilityEvidence": [
          "cap.si_units.identify_unit",
          "cap.si_units.distinguish_base_derived",
          "cap.si_units.diagnose_unit_confusion"
        ],
        "masteryGateCapabilityIds": [
          "cap.si_units.identify_unit",
          "cap.si_units.diagnose_unit_confusion"
        ],
        "requiresRemediationClearance": true,
        "exitSummary": "The learner has identified the SI unit for each core electrical quantity, distinguished base from derived units, and correctly diagnosed a common unit-confusion error."
      },
      "presentationModes": [
        "learn",
        "review"
      ],
      "contentRelease": "release.unit202.v3"
    },
    {
      "id": "lesson.electrical.thermal-and-chemical-effects",
      "schemaVersion": 1,
      "version": 1,
      "title": "Thermal and Chemical Effects of Current",
      "learnerFacingDescription": "Describe the thermal and chemical effects of current flowing through a circuit, what factors affect the thermal effect, and where each effect is put to practical use.",
      "curriculumUnit": "City & Guilds 2365-02 Unit 202 -- Principles of Electrical Science",
      "prerequisiteKnowledge": [
        "electrical.core_quantities",
        "electrical.conductors_and_insulators"
      ],
      "targetAssertionFamilyIds": [
        "electrical.thermal_and_chemical_effects"
      ],
      "targetAssertionIdentifiers": [
        "EL-CURRENT-THERMAL-EFFECT-001",
        "EL-CURRENT-CHEMICAL-EFFECT-001",
        "EL-THERMAL-EFFECT-APPLICATION-001",
        "EL-THERMAL-EFFECT-FACTORS-001"
      ],
      "targetCapabilityIds": [
        "cap.thermal_chemical.recognise_effect",
        "cap.thermal_chemical.recognise_application"
      ],
      "remediationEligibility": [],
      "estimatedDurationMinutes": 10,
      "instructionalStrategy": "Both effects are taught together as the two genuine non-magnetic consequences of current flow (retrieving the conductor/resistance model from electrical.conductors_and_insulators), then the thermal effect is extended with the factors that control its strength before a practical-application check closes the lesson.",
      "steps": [
        {
          "id": "orientation",
          "type": "orientation",
          "purpose": "Frame heating and electrolysis as two real, useful consequences of current flow -- not just circuit behaviour, but effects electrical installations are built to exploit or guard against.",
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
          "id": "concept_thermal_and_chemical_effects",
          "type": "concept_explanation",
          "purpose": "State the thermal effect (current through resistance generates heat) and the chemical effect (current through certain solutions causes electrolysis).",
          "requirement": "required",
          "teaches": [
            "EL-CURRENT-THERMAL-EFFECT-001",
            "EL-CURRENT-CHEMICAL-EFFECT-001"
          ],
          "reinforces": [],
          "tests": [],
          "assertionFamilyId": "electrical.thermal_and_chemical_effects",
          "capabilityIds": [
            "cap.thermal_chemical.recognise_effect"
          ],
          "misconceptionTargets": [],
          "representation": {},
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
          "id": "guided_recognise_effect",
          "type": "guided_interaction",
          "purpose": "Recognise whether a described scenario demonstrates the thermal or the chemical effect of current, including what factors affect the thermal effect's strength.",
          "requirement": "required",
          "teaches": [
            "EL-THERMAL-EFFECT-FACTORS-001"
          ],
          "reinforces": [
            "EL-CURRENT-THERMAL-EFFECT-001",
            "EL-CURRENT-CHEMICAL-EFFECT-001"
          ],
          "tests": [
            "EL-CURRENT-THERMAL-EFFECT-001",
            "EL-CURRENT-CHEMICAL-EFFECT-001",
            "EL-THERMAL-EFFECT-FACTORS-001"
          ],
          "assertionFamilyId": "electrical.thermal_and_chemical_effects",
          "capabilityIds": [
            "cap.thermal_chemical.recognise_effect"
          ],
          "misconceptionTargets": [],
          "representation": {},
          "questionBlueprintId": "thermal_chemical.recognise_effect",
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
            "cap.thermal_chemical.recognise_effect"
          ]
        },
        {
          "id": "independent_recognise_application",
          "type": "independent_question",
          "purpose": "Identify a practical application of the thermal effect (e.g. a heating element or filament lamp).",
          "requirement": "required",
          "teaches": [
            "EL-THERMAL-EFFECT-APPLICATION-001"
          ],
          "reinforces": [],
          "tests": [
            "EL-THERMAL-EFFECT-APPLICATION-001"
          ],
          "assertionFamilyId": "electrical.thermal_and_chemical_effects",
          "capabilityIds": [
            "cap.thermal_chemical.recognise_application"
          ],
          "misconceptionTargets": [],
          "representation": {},
          "questionBlueprintId": "thermal_chemical.recognise_application",
          "presentation": {
            "interactionRequired": true,
            "interactionRole": "identify",
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
            "cap.thermal_chemical.recognise_application"
          ]
        },
        {
          "id": "recap",
          "type": "recap",
          "purpose": "Summarise the thermal and chemical effects of current and their practical applications.",
          "requirement": "required",
          "teaches": [],
          "reinforces": [
            "EL-CURRENT-THERMAL-EFFECT-001",
            "EL-CURRENT-CHEMICAL-EFFECT-001"
          ],
          "tests": [],
          "assertionFamilyId": "electrical.thermal_and_chemical_effects",
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
        "electrical.thermal_and_chemical_effects",
        "electrical.conductors_and_insulators"
      ],
      "completionCriteria": {
        "requiredStepIds": [
          "orientation",
          "concept_thermal_and_chemical_effects",
          "guided_recognise_effect",
          "independent_recognise_application",
          "recap",
          "exit_completion"
        ],
        "requiredCapabilityEvidence": [
          "cap.thermal_chemical.recognise_effect",
          "cap.thermal_chemical.recognise_application"
        ],
        "masteryGateCapabilityIds": [
          "cap.thermal_chemical.recognise_effect"
        ],
        "requiresRemediationClearance": true,
        "exitSummary": "The learner has described the thermal and chemical effects of current, the factors affecting the thermal effect, and identified a practical application of it."
      },
      "presentationModes": [
        "learn",
        "review"
      ],
      "contentRelease": "release.unit202.v3"
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
      "contentRelease": "release.unit202.v3"
    }
  ],
  "questionBlueprints": [
    {
      "id": "charge.calculate",
      "assertionFamilyId": "electrical.charge_and_current",
      "capabilityId": "cap.charge.calculate",
      "title": "Calculate charge or current using I = Q / t",
      "representation": {
        "formula": {
          "required": true,
          "formulaFamilyId": "formula.charge_current"
        }
      },
      "variantDimensions": {
        "target_variable": {
          "allowed": [
            "I",
            "Q"
          ]
        }
      },
      "parameterGenerators": [],
      "answer": {
        "type": "quantity",
        "quantity": "charge_or_current",
        "canonicalUnit": "coulomb_or_ampere"
      },
      "marking": {
        "type": "numeric_tolerance",
        "tolerancePercent": 1
      },
      "evidence": {
        "primaryCapabilityId": "cap.charge.calculate",
        "familyId": "electrical.charge_and_current",
        "assertionIdentifiers": [
          "EL-CURRENT-CHARGE-CALC-001"
        ],
        "supportingCapabilityIds": [],
        "representationDependency": [],
        "misconceptionTargets": []
      },
      "difficultyBand": "intermediate",
      "presentation": {
        "promptLines": [
          "{given_summary}",
          "Find {target_variable}."
        ]
      }
    },
    {
      "id": "charge.recognise",
      "assertionFamilyId": "electrical.charge_and_current",
      "capabilityId": "cap.charge.recognise",
      "title": "Recognise the relationship between current and the rate of flow of charge",
      "representation": {},
      "variantDimensions": {},
      "parameterGenerators": [],
      "answer": {
        "type": "formula_selection"
      },
      "marking": {
        "type": "enum"
      },
      "evidence": {
        "primaryCapabilityId": "cap.charge.recognise",
        "familyId": "electrical.charge_and_current",
        "assertionIdentifiers": [
          "EL-CURRENT-CHARGE-RELATIONSHIP-001"
        ],
        "supportingCapabilityIds": [],
        "representationDependency": [],
        "misconceptionTargets": []
      },
      "difficultyBand": "introductory",
      "presentation": {
        "promptLines": [
          "Which formula correctly relates current I to charge Q and time t?"
        ]
      }
    },
    {
      "id": "comparison.compare_current_voltage",
      "assertionFamilyId": "electrical.series_vs_parallel_comparison",
      "capabilityId": "cap.comparison.compare_current_voltage",
      "title": "Compare current and voltage behaviour between series and parallel circuits",
      "representation": {},
      "variantDimensions": {},
      "parameterGenerators": [],
      "answer": {
        "type": "multiple_choice",
        "options": [
          "series_behaviour",
          "parallel_behaviour"
        ]
      },
      "marking": {
        "type": "exact"
      },
      "evidence": {
        "primaryCapabilityId": "cap.comparison.compare_current_voltage",
        "familyId": "electrical.series_vs_parallel_comparison",
        "assertionIdentifiers": [
          "EL-CIRCUIT-COMPARE-CURRENT-001",
          "EL-CIRCUIT-COMPARE-VOLTAGE-001"
        ],
        "supportingCapabilityIds": [],
        "representationDependency": [],
        "misconceptionTargets": []
      },
      "difficultyBand": "intermediate",
      "presentation": {
        "promptLines": [
          "{pattern_text}",
          "Is this series behaviour or parallel behaviour?"
        ]
      }
    },
    {
      "id": "comparison.compare_power_energy",
      "assertionFamilyId": "electrical.series_vs_parallel_comparison",
      "capabilityId": "cap.comparison.compare_power_energy",
      "title": "Compare total power/energy of the same resistor set connected in series versus parallel",
      "representation": {},
      "variantDimensions": {},
      "parameterGenerators": [],
      "answer": {
        "type": "multiple_choice",
        "options": [
          "series_higher",
          "parallel_higher",
          "equal"
        ]
      },
      "marking": {
        "type": "exact"
      },
      "evidence": {
        "primaryCapabilityId": "cap.comparison.compare_power_energy",
        "familyId": "electrical.series_vs_parallel_comparison",
        "assertionIdentifiers": [
          "EL-CIRCUIT-COMPARE-POWER-001",
          "EL-CIRCUIT-COMPARE-ENERGY-001"
        ],
        "supportingCapabilityIds": [],
        "representationDependency": [],
        "misconceptionTargets": []
      },
      "difficultyBand": "advanced",
      "presentation": {
        "promptLines": [
          "Take the same set of two or more resistors, connected to the same supply voltage.",
          "Is their total power/energy higher when connected in series, or when connected in parallel?"
        ]
      }
    },
    {
      "id": "comparison.compare_resistance",
      "assertionFamilyId": "electrical.series_vs_parallel_comparison",
      "capabilityId": "cap.comparison.compare_resistance",
      "title": "Compare total resistance of the same resistor set connected in series versus parallel",
      "representation": {},
      "variantDimensions": {},
      "parameterGenerators": [],
      "answer": {
        "type": "multiple_choice",
        "options": [
          "series_higher",
          "parallel_higher",
          "equal"
        ]
      },
      "marking": {
        "type": "exact"
      },
      "evidence": {
        "primaryCapabilityId": "cap.comparison.compare_resistance",
        "familyId": "electrical.series_vs_parallel_comparison",
        "assertionIdentifiers": [
          "EL-CIRCUIT-COMPARE-RESISTANCE-001"
        ],
        "supportingCapabilityIds": [],
        "representationDependency": [],
        "misconceptionTargets": []
      },
      "difficultyBand": "intermediate",
      "presentation": {
        "promptLines": [
          "Take the same set of two or more resistors.",
          "Is their total resistance higher when connected in series, or when connected in parallel?"
        ]
      }
    },
    {
      "id": "comparison.identify_topology",
      "assertionFamilyId": "electrical.series_vs_parallel_comparison",
      "capabilityId": "cap.comparison.identify_topology",
      "title": "Identify whether a given circuit is connected in series or parallel",
      "representation": {
        "diagram": {
          "required": true,
          "blueprintId": "circuit.series_parallel_mixed"
        }
      },
      "variantDimensions": {},
      "parameterGenerators": [],
      "answer": {
        "type": "multiple_choice",
        "options": [
          "series",
          "parallel"
        ]
      },
      "marking": {
        "type": "exact"
      },
      "evidence": {
        "primaryCapabilityId": "cap.comparison.identify_topology",
        "familyId": "electrical.series_vs_parallel_comparison",
        "assertionIdentifiers": [
          "EL-CIRCUIT-SELECT-CONFIGURATION-001"
        ],
        "supportingCapabilityIds": [],
        "representationDependency": [],
        "misconceptionTargets": []
      },
      "difficultyBand": "introductory",
      "presentation": {
        "promptLines": [
          "Look at the circuit diagram.",
          "Is this circuit's overall arrangement series or parallel?"
        ]
      }
    },
    {
      "id": "comparison.recognise_mixed_circuit",
      "assertionFamilyId": "electrical.series_vs_parallel_comparison",
      "capabilityId": "cap.comparison.recognise_mixed_circuit",
      "title": "Recognise a circuit combining both series and parallel sections",
      "representation": {
        "diagram": {
          "required": true,
          "blueprintId": "circuit.series_parallel_mixed"
        }
      },
      "variantDimensions": {},
      "parameterGenerators": [],
      "answer": {
        "type": "multiple_choice",
        "options": [
          "series",
          "parallel",
          "mixed"
        ]
      },
      "marking": {
        "type": "exact"
      },
      "evidence": {
        "primaryCapabilityId": "cap.comparison.recognise_mixed_circuit",
        "familyId": "electrical.series_vs_parallel_comparison",
        "assertionIdentifiers": [
          "EL-CIRCUIT-MIXED-SERIES-PARALLEL-RECOGNITION-001"
        ],
        "supportingCapabilityIds": [],
        "representationDependency": [],
        "misconceptionTargets": []
      },
      "difficultyBand": "advanced",
      "presentation": {
        "promptLines": [
          "Look at the circuit diagram.",
          "Is it wired in series, parallel, or a mix of both?"
        ]
      }
    },
    {
      "id": "comparison.trace_current_path",
      "assertionFamilyId": "electrical.series_vs_parallel_comparison",
      "capabilityId": "cap.comparison.trace_current_path",
      "title": "Trace the path(s) current takes through a circuit diagram",
      "representation": {
        "diagram": {
          "required": true,
          "blueprintId": "circuit.series_parallel_mixed"
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
        "primaryCapabilityId": "cap.comparison.trace_current_path",
        "familyId": "electrical.series_vs_parallel_comparison",
        "assertionIdentifiers": [
          "EL-CIRCUIT-TRACE-CURRENT-PATH-001"
        ],
        "supportingCapabilityIds": [],
        "representationDependency": [],
        "misconceptionTargets": []
      },
      "difficultyBand": "intermediate",
      "presentation": {
        "promptLines": [
          "Look at the circuit diagram.",
          "Trace the path(s) current takes from the supply and back."
        ]
      }
    },
    {
      "id": "conductors.classify_material",
      "assertionFamilyId": "electrical.conductors_and_insulators",
      "capabilityId": "cap.conductors.classify_material",
      "title": "Classify a given material as a conductor or an insulator",
      "representation": {},
      "variantDimensions": {},
      "parameterGenerators": [],
      "answer": {
        "type": "multiple_choice",
        "options": [
          "conductor",
          "insulator"
        ]
      },
      "marking": {
        "type": "exact"
      },
      "evidence": {
        "primaryCapabilityId": "cap.conductors.classify_material",
        "familyId": "electrical.conductors_and_insulators",
        "assertionIdentifiers": [
          "EL-MATERIAL-CONDUCTOR-INSULATOR-EXAMPLES-001"
        ],
        "supportingCapabilityIds": [],
        "representationDependency": [],
        "misconceptionTargets": [
          {
            "misconceptionIdentifier": "MIS-EL-CONDUCTOR-INSULATOR-CONFUSION-001",
            "evidenceStrength": "suggestive"
          }
        ]
      },
      "difficultyBand": "introductory",
      "presentation": {
        "promptLines": [
          "Is {material} a conductor or an insulator?"
        ]
      }
    },
    {
      "id": "conductors.recognise_breakdown",
      "assertionFamilyId": "electrical.conductors_and_insulators",
      "capabilityId": "cap.conductors.recognise_breakdown",
      "title": "Recognise insulation breakdown as a consequence of excessive voltage",
      "representation": {},
      "variantDimensions": {},
      "parameterGenerators": [],
      "answer": {
        "type": "multiple_choice",
        "options": [
          "breaks_down_and_conducts",
          "remains_insulating"
        ]
      },
      "marking": {
        "type": "exact"
      },
      "evidence": {
        "primaryCapabilityId": "cap.conductors.recognise_breakdown",
        "familyId": "electrical.conductors_and_insulators",
        "assertionIdentifiers": [
          "EL-INSULATOR-BREAKDOWN-001"
        ],
        "supportingCapabilityIds": [],
        "representationDependency": [],
        "misconceptionTargets": []
      },
      "difficultyBand": "intermediate",
      "presentation": {
        "promptLines": [
          "A voltage far beyond an insulator's rating is applied across it.",
          "What happens to the insulator?"
        ]
      }
    },
    {
      "id": "core_quantities.diagnose_current_voltage_confusion",
      "assertionFamilyId": "electrical.core_quantities",
      "capabilityId": "cap.core_quantities.distinguish",
      "title": "Diagnose confusion between current and voltage",
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
        "primaryCapabilityId": "cap.core_quantities.distinguish",
        "familyId": "electrical.core_quantities",
        "assertionIdentifiers": [
          "EL-CONCEPT-VOLTAGE-001",
          "EL-CONCEPT-CURRENT-001"
        ],
        "supportingCapabilityIds": [],
        "representationDependency": [],
        "misconceptionTargets": [
          {
            "misconceptionIdentifier": "MIS-EL-CURRENT-VOLTAGE-CONFUSION-001",
            "evidenceStrength": "direct"
          }
        ]
      },
      "difficultyBand": "diagnostic",
      "presentation": {
        "promptLines": [
          "{scenario_text}",
          "Which misconception does this reveal?"
        ]
      }
    },
    {
      "id": "core_quantities.recognise_from_definition",
      "assertionFamilyId": "electrical.core_quantities",
      "capabilityId": "cap.core_quantities.recognise",
      "title": "Recognise voltage, current or resistance from its definition",
      "representation": {},
      "variantDimensions": {},
      "parameterGenerators": [],
      "answer": {
        "type": "multiple_choice",
        "options": [
          "voltage",
          "current",
          "resistance"
        ]
      },
      "marking": {
        "type": "exact"
      },
      "evidence": {
        "primaryCapabilityId": "cap.core_quantities.recognise",
        "familyId": "electrical.core_quantities",
        "assertionIdentifiers": [
          "EL-CONCEPT-VOLTAGE-001",
          "EL-CONCEPT-CURRENT-001",
          "EL-CONCEPT-RESISTANCE-001"
        ],
        "supportingCapabilityIds": [],
        "representationDependency": [],
        "misconceptionTargets": []
      },
      "difficultyBand": "introductory",
      "presentation": {
        "promptLines": [
          "Which quantity is defined as: {definition_clause}?"
        ]
      }
    },
    {
      "id": "energy.calculate_efficiency",
      "assertionFamilyId": "electrical.energy_and_efficiency",
      "capabilityId": "cap.energy.calculate_efficiency",
      "title": "Calculate the efficiency of an electrical device as a percentage",
      "representation": {
        "formula": {
          "required": true,
          "formulaFamilyId": "formula.electrical_efficiency"
        }
      },
      "variantDimensions": {},
      "parameterGenerators": [],
      "answer": {
        "type": "quantity",
        "quantity": "efficiency",
        "canonicalUnit": "percent"
      },
      "marking": {
        "type": "numeric_tolerance",
        "tolerancePercent": 1
      },
      "evidence": {
        "primaryCapabilityId": "cap.energy.calculate_efficiency",
        "familyId": "electrical.energy_and_efficiency",
        "assertionIdentifiers": [
          "EL-CALC-ELECTRICAL-EFFICIENCY-001"
        ],
        "supportingCapabilityIds": [],
        "representationDependency": [],
        "misconceptionTargets": []
      },
      "difficultyBand": "advanced",
      "presentation": {
        "promptLines": [
          "Power input: {Pin} W",
          "Power output: {Pout} W"
        ]
      }
    },
    {
      "id": "energy.calculate_energy",
      "assertionFamilyId": "electrical.energy_and_efficiency",
      "capabilityId": "cap.energy.calculate_energy",
      "title": "Calculate electrical energy transferred from power and time",
      "representation": {
        "formula": {
          "required": true,
          "formulaFamilyId": "formula.electrical_energy"
        }
      },
      "variantDimensions": {},
      "parameterGenerators": [],
      "answer": {
        "type": "quantity",
        "quantity": "energy",
        "canonicalUnit": "joule"
      },
      "marking": {
        "type": "numeric_tolerance",
        "tolerancePercent": 1
      },
      "evidence": {
        "primaryCapabilityId": "cap.energy.calculate_energy",
        "familyId": "electrical.energy_and_efficiency",
        "assertionIdentifiers": [
          "EL-ENERGY-CALC-001"
        ],
        "supportingCapabilityIds": [],
        "representationDependency": [],
        "misconceptionTargets": []
      },
      "difficultyBand": "introductory",
      "presentation": {
        "promptLines": [
          "P = {P} W",
          "t = {t} s"
        ]
      }
    },
    {
      "id": "energy.calculate_energy_kwh",
      "assertionFamilyId": "electrical.energy_and_efficiency",
      "capabilityId": "cap.energy.calculate_energy_kwh",
      "title": "Calculate electrical energy used in kilowatt-hours from power rating and time",
      "representation": {
        "formula": {
          "required": true,
          "formulaFamilyId": "formula.electrical_energy"
        }
      },
      "variantDimensions": {},
      "parameterGenerators": [],
      "answer": {
        "type": "quantity",
        "quantity": "energy",
        "canonicalUnit": "kilowatt-hour"
      },
      "marking": {
        "type": "numeric_tolerance",
        "tolerancePercent": 1
      },
      "evidence": {
        "primaryCapabilityId": "cap.energy.calculate_energy_kwh",
        "familyId": "electrical.energy_and_efficiency",
        "assertionIdentifiers": [
          "EL-ENERGY-KWH-CALC-001"
        ],
        "supportingCapabilityIds": [],
        "representationDependency": [],
        "misconceptionTargets": []
      },
      "difficultyBand": "intermediate",
      "presentation": {
        "promptLines": [
          "P = {P_kW} kW",
          "t = {t_hours} hours"
        ]
      }
    },
    {
      "id": "energy.rearrange",
      "assertionFamilyId": "electrical.energy_and_efficiency",
      "capabilityId": "cap.energy.rearrange",
      "title": "Rearrange E = P x t to make power or time the subject",
      "representation": {
        "formula": {
          "required": true,
          "formulaFamilyId": "formula.electrical_energy"
        }
      },
      "variantDimensions": {},
      "parameterGenerators": [],
      "answer": {
        "type": "formula_selection"
      },
      "marking": {
        "type": "enum"
      },
      "evidence": {
        "primaryCapabilityId": "cap.energy.rearrange",
        "familyId": "electrical.energy_and_efficiency",
        "assertionIdentifiers": [
          "EL-ENERGY-REARRANGE-001"
        ],
        "supportingCapabilityIds": [],
        "representationDependency": [],
        "misconceptionTargets": []
      },
      "difficultyBand": "intermediate",
      "presentation": {
        "promptLines": [
          "The known quantities are: {known}.",
          "Which rearrangement of E = P x t should be used to find the missing quantity?"
        ]
      }
    },
    {
      "id": "fault.compare_fuse_breaker",
      "assertionFamilyId": "electrical.fault_conditions_protection",
      "capabilityId": "cap.fault.compare_fuse_breaker",
      "title": "Compare fuse and circuit-breaker operation and reuse",
      "representation": {},
      "variantDimensions": {},
      "parameterGenerators": [],
      "answer": {
        "type": "multiple_choice",
        "options": [
          "fuse",
          "circuit_breaker"
        ]
      },
      "marking": {
        "type": "exact"
      },
      "evidence": {
        "primaryCapabilityId": "cap.fault.compare_fuse_breaker",
        "familyId": "electrical.fault_conditions_protection",
        "assertionIdentifiers": [
          "EL-CIRCUIT-BREAKER-VS-FUSE-001"
        ],
        "supportingCapabilityIds": [],
        "representationDependency": [],
        "misconceptionTargets": []
      },
      "difficultyBand": "advanced",
      "presentation": {
        "promptLines": [
          "Which protective device {asked_about_text}?"
        ]
      }
    },
    {
      "id": "fault.predict_short_effect",
      "assertionFamilyId": "electrical.fault_conditions_protection",
      "capabilityId": "cap.fault.predict_effect",
      "title": "Predict the effect of a short circuit occurring across a component",
      "representation": {},
      "variantDimensions": {},
      "parameterGenerators": [],
      "answer": {
        "type": "multiple_choice",
        "options": [
          "current_increases_sharply",
          "current_decreases",
          "no_effect"
        ]
      },
      "marking": {
        "type": "exact"
      },
      "evidence": {
        "primaryCapabilityId": "cap.fault.predict_effect",
        "familyId": "electrical.fault_conditions_protection",
        "assertionIdentifiers": [
          "EL-CIRCUIT-PREDICT-SHORT-EFFECT-001"
        ],
        "supportingCapabilityIds": [],
        "representationDependency": [],
        "misconceptionTargets": []
      },
      "difficultyBand": "intermediate",
      "presentation": {
        "promptLines": [
          "A short circuit occurs across a component in an energised circuit.",
          "What happens to the current?"
        ]
      }
    },
    {
      "id": "fault.recognise_condition",
      "assertionFamilyId": "electrical.fault_conditions_protection",
      "capabilityId": "cap.fault.recognise_condition",
      "title": "Recognise a short-circuit or open-circuit condition from its description",
      "representation": {},
      "variantDimensions": {},
      "parameterGenerators": [],
      "answer": {
        "type": "multiple_choice",
        "options": [
          "short_circuit",
          "open_circuit"
        ]
      },
      "marking": {
        "type": "exact"
      },
      "evidence": {
        "primaryCapabilityId": "cap.fault.recognise_condition",
        "familyId": "electrical.fault_conditions_protection",
        "assertionIdentifiers": [
          "EL-CIRCUIT-RECOGNISE-SHORT-CIRCUIT-001",
          "EL-CIRCUIT-RECOGNISE-OPEN-CIRCUIT-001",
          "EL-CIRCUIT-ZERO-RESISTANCE-INTERPRETATION-001",
          "EL-CIRCUIT-OPEN-CIRCUIT-RESISTANCE-INTERPRETATION-001"
        ],
        "supportingCapabilityIds": [],
        "representationDependency": [],
        "misconceptionTargets": []
      },
      "difficultyBand": "introductory",
      "presentation": {
        "promptLines": [
          "{condition_clue}",
          "Which fault condition is this?"
        ]
      }
    },
    {
      "id": "fault.select_protective_device",
      "assertionFamilyId": "electrical.fault_conditions_protection",
      "capabilityId": "cap.fault.select_protective_device",
      "title": "Select a protective device appropriate to a fault scenario",
      "representation": {},
      "variantDimensions": {},
      "parameterGenerators": [],
      "answer": {
        "type": "multiple_choice",
        "options": [
          "fuse",
          "circuit_breaker"
        ]
      },
      "marking": {
        "type": "exact"
      },
      "evidence": {
        "primaryCapabilityId": "cap.fault.select_protective_device",
        "familyId": "electrical.fault_conditions_protection",
        "assertionIdentifiers": [
          "EL-PROTECTIVE-DEVICE-PURPOSE-001",
          "EL-FUSE-OPERATION-001"
        ],
        "supportingCapabilityIds": [],
        "representationDependency": [],
        "misconceptionTargets": []
      },
      "difficultyBand": "intermediate",
      "presentation": {
        "promptLines": [
          "{scenario_text}",
          "Which protective device is most appropriate?"
        ]
      }
    },
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
      "id": "instrumentation.recognise_connection",
      "assertionFamilyId": "electrical.instrumentation",
      "capabilityId": "cap.instrumentation.recognise_connection",
      "title": "Recognise the correct connection method for a voltmeter or ammeter",
      "representation": {
        "diagram": {
          "required": true,
          "blueprintId": "instrument.measurement_connection"
        }
      },
      "variantDimensions": {},
      "parameterGenerators": [],
      "answer": {
        "type": "multiple_choice",
        "options": [
          "series",
          "parallel"
        ]
      },
      "marking": {
        "type": "exact"
      },
      "evidence": {
        "primaryCapabilityId": "cap.instrumentation.recognise_connection",
        "familyId": "electrical.instrumentation",
        "assertionIdentifiers": [
          "EL-INSTRUMENT-VOLTMETER-001",
          "EL-INSTRUMENT-AMMETER-001"
        ],
        "supportingCapabilityIds": [],
        "representationDependency": [],
        "misconceptionTargets": [
          {
            "misconceptionIdentifier": "MIS-EL-INSTRUMENT-CONNECTION-CONFUSION-001",
            "evidenceStrength": "direct"
          }
        ]
      },
      "difficultyBand": "intermediate",
      "presentation": {
        "promptLines": [
          "Look at the circuit diagram.",
          "How should the {instrument_type} be connected to measure correctly?"
        ]
      }
    },
    {
      "id": "instrumentation.recognise_internal_resistance_property",
      "assertionFamilyId": "electrical.instrumentation",
      "capabilityId": "cap.instrumentation.recognise_internal_resistance_property",
      "title": "Recognise the ideal internal-resistance property of a voltmeter or ammeter",
      "representation": {},
      "variantDimensions": {},
      "parameterGenerators": [],
      "answer": {
        "type": "multiple_choice",
        "options": [
          "very_high",
          "very_low"
        ]
      },
      "marking": {
        "type": "exact"
      },
      "evidence": {
        "primaryCapabilityId": "cap.instrumentation.recognise_internal_resistance_property",
        "familyId": "electrical.instrumentation",
        "assertionIdentifiers": [
          "EL-INSTRUMENT-VOLTMETER-INTERNAL-RESISTANCE-001",
          "EL-INSTRUMENT-AMMETER-INTERNAL-RESISTANCE-001"
        ],
        "supportingCapabilityIds": [],
        "representationDependency": [],
        "misconceptionTargets": []
      },
      "difficultyBand": "advanced",
      "presentation": {
        "promptLines": [
          "For accurate measurement without disturbing the circuit, what should the ideal internal resistance of a {instrument_type} be?"
        ]
      }
    },
    {
      "id": "instrumentation.recognise_purpose",
      "assertionFamilyId": "electrical.instrumentation",
      "capabilityId": "cap.instrumentation.recognise_purpose",
      "title": "Identify the purpose of a specialised instrument (clamp meter, oscilloscope, continuity tester)",
      "representation": {},
      "variantDimensions": {},
      "parameterGenerators": [],
      "answer": {
        "type": "multiple_choice",
        "options": [
          "clamp_meter",
          "oscilloscope",
          "continuity_tester"
        ]
      },
      "marking": {
        "type": "exact"
      },
      "evidence": {
        "primaryCapabilityId": "cap.instrumentation.recognise_purpose",
        "familyId": "electrical.instrumentation",
        "assertionIdentifiers": [
          "EL-INSTRUMENT-CLAMP-METER-001",
          "EL-INSTRUMENT-OSCILLOSCOPE-001",
          "EL-INSTRUMENT-CONTINUITY-TEST-001"
        ],
        "supportingCapabilityIds": [],
        "representationDependency": [],
        "misconceptionTargets": []
      },
      "difficultyBand": "intermediate",
      "presentation": {
        "promptLines": [
          "{purpose_clue}",
          "Which instrument is this?"
        ]
      }
    },
    {
      "id": "instrumentation.select_instrument",
      "assertionFamilyId": "electrical.instrumentation",
      "capabilityId": "cap.instrumentation.select_instrument",
      "title": "Select the correct instrument to measure a given electrical quantity",
      "representation": {},
      "variantDimensions": {},
      "parameterGenerators": [],
      "answer": {
        "type": "multiple_choice",
        "options": [
          "voltmeter",
          "ammeter",
          "ohmmeter",
          "multimeter"
        ]
      },
      "marking": {
        "type": "exact"
      },
      "evidence": {
        "primaryCapabilityId": "cap.instrumentation.select_instrument",
        "familyId": "electrical.instrumentation",
        "assertionIdentifiers": [
          "EL-INSTRUMENT-SELECT-001"
        ],
        "supportingCapabilityIds": [],
        "representationDependency": [],
        "misconceptionTargets": []
      },
      "difficultyBand": "introductory",
      "presentation": {
        "promptLines": [
          "Which instrument should be used to measure {quantity}?"
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
      "id": "power.calculate_from_ir",
      "assertionFamilyId": "electrical.power_relationships",
      "capabilityId": "cap.power.calculate_from_ir",
      "title": "Calculate power from known current and resistance",
      "representation": {
        "formula": {
          "required": true,
          "formulaFamilyId": "formula.electrical_power"
        }
      },
      "variantDimensions": {},
      "parameterGenerators": [],
      "answer": {
        "type": "quantity",
        "quantity": "power",
        "canonicalUnit": "watt"
      },
      "marking": {
        "type": "numeric_tolerance",
        "tolerancePercent": 1
      },
      "evidence": {
        "primaryCapabilityId": "cap.power.calculate_from_ir",
        "familyId": "electrical.power_relationships",
        "assertionIdentifiers": [
          "EL-POWER-SOLVE-IR-001"
        ],
        "supportingCapabilityIds": [],
        "representationDependency": [],
        "misconceptionTargets": []
      },
      "difficultyBand": "intermediate",
      "presentation": {
        "promptLines": [
          "I = {I} A",
          "R = {R} Ω"
        ]
      }
    },
    {
      "id": "power.calculate_from_vi",
      "assertionFamilyId": "electrical.power_relationships",
      "capabilityId": "cap.power.calculate_from_vi",
      "title": "Calculate power from known voltage and current",
      "representation": {
        "formula": {
          "required": true,
          "formulaFamilyId": "formula.electrical_power"
        }
      },
      "variantDimensions": {},
      "parameterGenerators": [],
      "answer": {
        "type": "quantity",
        "quantity": "power",
        "canonicalUnit": "watt"
      },
      "marking": {
        "type": "numeric_tolerance",
        "tolerancePercent": 1
      },
      "evidence": {
        "primaryCapabilityId": "cap.power.calculate_from_vi",
        "familyId": "electrical.power_relationships",
        "assertionIdentifiers": [
          "EL-POWER-SOLVE-001"
        ],
        "supportingCapabilityIds": [],
        "representationDependency": [],
        "misconceptionTargets": []
      },
      "difficultyBand": "introductory",
      "presentation": {
        "promptLines": [
          "V = {V} V",
          "I = {I} A"
        ]
      }
    },
    {
      "id": "power.calculate_from_vr",
      "assertionFamilyId": "electrical.power_relationships",
      "capabilityId": "cap.power.calculate_from_vr",
      "title": "Calculate power from known voltage and resistance",
      "representation": {
        "formula": {
          "required": true,
          "formulaFamilyId": "formula.electrical_power"
        }
      },
      "variantDimensions": {},
      "parameterGenerators": [],
      "answer": {
        "type": "quantity",
        "quantity": "power",
        "canonicalUnit": "watt"
      },
      "marking": {
        "type": "numeric_tolerance",
        "tolerancePercent": 1
      },
      "evidence": {
        "primaryCapabilityId": "cap.power.calculate_from_vr",
        "familyId": "electrical.power_relationships",
        "assertionIdentifiers": [
          "EL-POWER-SOLVE-V2R-001"
        ],
        "supportingCapabilityIds": [],
        "representationDependency": [],
        "misconceptionTargets": []
      },
      "difficultyBand": "intermediate",
      "presentation": {
        "promptLines": [
          "V = {V} V",
          "R = {R} Ω"
        ]
      }
    },
    {
      "id": "power.calculate_total",
      "assertionFamilyId": "electrical.power_relationships",
      "capabilityId": "cap.power.calculate_total",
      "title": "Calculate total circuit power as the sum of individual component powers",
      "representation": {},
      "variantDimensions": {},
      "parameterGenerators": [],
      "answer": {
        "type": "quantity",
        "quantity": "power",
        "canonicalUnit": "watt"
      },
      "marking": {
        "type": "numeric_tolerance",
        "tolerancePercent": 2
      },
      "evidence": {
        "primaryCapabilityId": "cap.power.calculate_total",
        "familyId": "electrical.power_relationships",
        "assertionIdentifiers": [
          "EL-CIRCUIT-POWER-TOTAL-001"
        ],
        "supportingCapabilityIds": [],
        "representationDependency": [],
        "misconceptionTargets": []
      },
      "difficultyBand": "advanced",
      "presentation": {
        "promptLines": [
          "This circuit has {component_count} components.",
          "Individual power values: {summary}",
          "Calculate the total power."
        ]
      }
    },
    {
      "id": "power.recognise_relationship",
      "assertionFamilyId": "electrical.power_relationships",
      "capabilityId": "cap.power.recognise_relationship",
      "title": "Recognise that electrical power is related to voltage and current by P = V x I",
      "representation": {},
      "variantDimensions": {},
      "parameterGenerators": [],
      "answer": {
        "type": "formula_selection"
      },
      "marking": {
        "type": "enum"
      },
      "evidence": {
        "primaryCapabilityId": "cap.power.recognise_relationship",
        "familyId": "electrical.power_relationships",
        "assertionIdentifiers": [
          "EL-POWER-RELATIONSHIP-001"
        ],
        "supportingCapabilityIds": [],
        "representationDependency": [],
        "misconceptionTargets": []
      },
      "difficultyBand": "introductory",
      "presentation": {
        "promptLines": [
          "Which formula correctly relates electrical power P to voltage V and current I?"
        ]
      }
    },
    {
      "id": "power.select_form",
      "assertionFamilyId": "electrical.power_relationships",
      "capabilityId": "cap.power.select_form",
      "title": "Select which form of the power relationship to use, based on which quantities are known",
      "representation": {
        "formula": {
          "required": true,
          "formulaFamilyId": "formula.electrical_power"
        }
      },
      "variantDimensions": {},
      "parameterGenerators": [],
      "answer": {
        "type": "formula_selection"
      },
      "marking": {
        "type": "enum"
      },
      "evidence": {
        "primaryCapabilityId": "cap.power.select_form",
        "familyId": "electrical.power_relationships",
        "assertionIdentifiers": [
          "EL-POWER-REARRANGE-001"
        ],
        "supportingCapabilityIds": [],
        "representationDependency": [],
        "misconceptionTargets": []
      },
      "difficultyBand": "intermediate",
      "presentation": {
        "promptLines": [
          "The known quantities are: {known}.",
          "Which form of the power relationship should be used to find the missing quantity?"
        ]
      }
    },
    {
      "id": "resistivity.calculate_resistance",
      "assertionFamilyId": "electrical.resistivity",
      "capabilityId": "cap.resistivity.calculate",
      "title": "Calculate resistance from resistivity, length and cross-sectional area",
      "representation": {
        "formula": {
          "required": true,
          "formulaFamilyId": "formula.resistivity"
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
        "tolerancePercent": 2
      },
      "evidence": {
        "primaryCapabilityId": "cap.resistivity.calculate",
        "familyId": "electrical.resistivity",
        "assertionIdentifiers": [
          "EL-RESISTIVITY-RELATIONSHIP-001"
        ],
        "supportingCapabilityIds": [],
        "representationDependency": [],
        "misconceptionTargets": []
      },
      "difficultyBand": "advanced",
      "presentation": {
        "promptLines": [
          "ρ = {rho} Ω·m",
          "L = {L} m",
          "A = {A} m²"
        ]
      }
    },
    {
      "id": "resistivity.compare_materials",
      "assertionFamilyId": "electrical.resistivity",
      "capabilityId": "cap.resistivity.compare_materials",
      "title": "Compare the resistivity of different materials to determine the better conductor",
      "representation": {},
      "variantDimensions": {},
      "parameterGenerators": [],
      "answer": {
        "type": "multiple_choice",
        "options": [
          "material_a",
          "material_b"
        ]
      },
      "marking": {
        "type": "exact"
      },
      "evidence": {
        "primaryCapabilityId": "cap.resistivity.compare_materials",
        "familyId": "electrical.resistivity",
        "assertionIdentifiers": [
          "EL-RESISTIVITY-COMPARE-MATERIALS-001"
        ],
        "supportingCapabilityIds": [],
        "representationDependency": [],
        "misconceptionTargets": []
      },
      "difficultyBand": "intermediate",
      "presentation": {
        "promptLines": [
          "Material A has a resistivity of {resistivity_a} Ω·m.",
          "Material B has a resistivity of {resistivity_b} Ω·m.",
          "Which material is the better conductor?"
        ]
      }
    },
    {
      "id": "resistivity.predict_area_effect",
      "assertionFamilyId": "electrical.resistivity",
      "capabilityId": "cap.resistivity.predict_area_effect",
      "title": "Predict the effect of increasing conductor cross-sectional area on resistance",
      "representation": {},
      "variantDimensions": {},
      "parameterGenerators": [],
      "answer": {
        "type": "direction"
      },
      "marking": {
        "type": "exact"
      },
      "evidence": {
        "primaryCapabilityId": "cap.resistivity.predict_area_effect",
        "familyId": "electrical.resistivity",
        "assertionIdentifiers": [
          "EL-RESISTIVITY-AREA-EFFECT-001"
        ],
        "supportingCapabilityIds": [],
        "representationDependency": [],
        "misconceptionTargets": []
      },
      "difficultyBand": "intermediate",
      "presentation": {
        "promptLines": [
          "A conductor's cross-sectional area is increased while its material and length stay the same.",
          "What happens to its resistance?"
        ]
      }
    },
    {
      "id": "resistivity.predict_length_effect",
      "assertionFamilyId": "electrical.resistivity",
      "capabilityId": "cap.resistivity.predict_length_effect",
      "title": "Predict the effect of increasing conductor length on resistance",
      "representation": {},
      "variantDimensions": {},
      "parameterGenerators": [],
      "answer": {
        "type": "direction"
      },
      "marking": {
        "type": "exact"
      },
      "evidence": {
        "primaryCapabilityId": "cap.resistivity.predict_length_effect",
        "familyId": "electrical.resistivity",
        "assertionIdentifiers": [
          "EL-RESISTIVITY-LENGTH-EFFECT-001"
        ],
        "supportingCapabilityIds": [],
        "representationDependency": [],
        "misconceptionTargets": []
      },
      "difficultyBand": "intermediate",
      "presentation": {
        "promptLines": [
          "A conductor's length is increased while its material and cross-sectional area stay the same.",
          "What happens to its resistance?"
        ]
      }
    },
    {
      "id": "resistivity.recognise",
      "assertionFamilyId": "electrical.resistivity",
      "capabilityId": "cap.resistivity.recognise",
      "title": "Recognise resistivity as a material property independent of conductor dimensions",
      "representation": {},
      "variantDimensions": {},
      "parameterGenerators": [],
      "answer": {
        "type": "multiple_choice",
        "options": [
          "resistance",
          "resistivity"
        ]
      },
      "marking": {
        "type": "exact"
      },
      "evidence": {
        "primaryCapabilityId": "cap.resistivity.recognise",
        "familyId": "electrical.resistivity",
        "assertionIdentifiers": [
          "EL-CONCEPT-RESISTIVITY-001"
        ],
        "supportingCapabilityIds": [],
        "representationDependency": [],
        "misconceptionTargets": []
      },
      "difficultyBand": "introductory",
      "presentation": {
        "promptLines": [
          "Which term describes this: {recognise_clue}?"
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
    },
    {
      "id": "si_units.diagnose_unit_confusion",
      "assertionFamilyId": "electrical.si_units",
      "capabilityId": "cap.si_units.diagnose_unit_confusion",
      "title": "Diagnose confusion between similarly-presented electrical units",
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
        "primaryCapabilityId": "cap.si_units.diagnose_unit_confusion",
        "familyId": "electrical.si_units",
        "assertionIdentifiers": [
          "EL-UNIT-VOLT-001",
          "EL-UNIT-OHM-001"
        ],
        "supportingCapabilityIds": [],
        "representationDependency": [],
        "misconceptionTargets": [
          {
            "misconceptionIdentifier": "MIS-EL-UNIT-CONFUSION-001",
            "evidenceStrength": "direct"
          },
          {
            "misconceptionIdentifier": "MIS-EL-SI-PREFIX-ERROR-001",
            "evidenceStrength": "suggestive"
          }
        ]
      },
      "difficultyBand": "diagnostic",
      "presentation": {
        "promptLines": [
          "A learner keeps mixing up {confused_pair_label}.",
          "Which kind of unit confusion is this?"
        ]
      }
    },
    {
      "id": "si_units.distinguish_base_derived",
      "assertionFamilyId": "electrical.si_units",
      "capabilityId": "cap.si_units.distinguish_base_derived",
      "title": "Distinguish an SI base unit from an SI derived unit",
      "representation": {},
      "variantDimensions": {},
      "parameterGenerators": [],
      "answer": {
        "type": "multiple_choice",
        "options": [
          "base",
          "derived"
        ]
      },
      "marking": {
        "type": "exact"
      },
      "evidence": {
        "primaryCapabilityId": "cap.si_units.distinguish_base_derived",
        "familyId": "electrical.si_units",
        "assertionIdentifiers": [
          "EL-UNIT-BASE-VS-DERIVED-001"
        ],
        "supportingCapabilityIds": [],
        "representationDependency": [],
        "misconceptionTargets": []
      },
      "difficultyBand": "intermediate",
      "presentation": {
        "promptLines": [
          "Is the {unit} an SI base unit or an SI derived unit?"
        ]
      }
    },
    {
      "id": "si_units.identify_unit",
      "assertionFamilyId": "electrical.si_units",
      "capabilityId": "cap.si_units.identify_unit",
      "title": "Identify the SI unit for a given electrical quantity",
      "representation": {},
      "variantDimensions": {
        "quantity": {
          "allowed": [
            "voltage",
            "current",
            "resistance",
            "power",
            "energy",
            "frequency"
          ]
        }
      },
      "parameterGenerators": [],
      "answer": {
        "type": "multiple_choice",
        "options": [
          "V",
          "A",
          "Ω",
          "W",
          "J",
          "Hz"
        ]
      },
      "marking": {
        "type": "exact"
      },
      "evidence": {
        "primaryCapabilityId": "cap.si_units.identify_unit",
        "familyId": "electrical.si_units",
        "assertionIdentifiers": [
          "EL-UNIT-VOLT-001",
          "EL-UNIT-AMPERE-001",
          "EL-UNIT-OHM-001",
          "EL-UNIT-WATT-001",
          "EL-UNIT-JOULE-001",
          "EL-UNIT-HERTZ-001"
        ],
        "supportingCapabilityIds": [],
        "representationDependency": [],
        "misconceptionTargets": []
      },
      "difficultyBand": "introductory",
      "presentation": {
        "promptLines": [
          "Which SI unit is used to measure {quantity}?"
        ]
      }
    },
    {
      "id": "thermal_chemical.recognise_application",
      "assertionFamilyId": "electrical.thermal_and_chemical_effects",
      "capabilityId": "cap.thermal_chemical.recognise_application",
      "title": "Identify a practical application of the thermal effect of current",
      "representation": {},
      "variantDimensions": {},
      "parameterGenerators": [],
      "answer": {
        "type": "multiple_choice",
        "options": [
          "heating_element",
          "filament_lamp",
          "relay_coil"
        ]
      },
      "marking": {
        "type": "exact"
      },
      "evidence": {
        "primaryCapabilityId": "cap.thermal_chemical.recognise_application",
        "familyId": "electrical.thermal_and_chemical_effects",
        "assertionIdentifiers": [
          "EL-THERMAL-EFFECT-APPLICATION-001"
        ],
        "supportingCapabilityIds": [],
        "representationDependency": [],
        "misconceptionTargets": []
      },
      "difficultyBand": "introductory",
      "presentation": {
        "promptLines": [
          "{application_clue}",
          "Which application of the thermal effect of current is this?"
        ]
      }
    },
    {
      "id": "thermal_chemical.recognise_effect",
      "assertionFamilyId": "electrical.thermal_and_chemical_effects",
      "capabilityId": "cap.thermal_chemical.recognise_effect",
      "title": "Recognise the thermal or chemical effect of current flowing through a circuit",
      "representation": {},
      "variantDimensions": {},
      "parameterGenerators": [],
      "answer": {
        "type": "multiple_choice",
        "options": [
          "thermal",
          "chemical"
        ]
      },
      "marking": {
        "type": "exact"
      },
      "evidence": {
        "primaryCapabilityId": "cap.thermal_chemical.recognise_effect",
        "familyId": "electrical.thermal_and_chemical_effects",
        "assertionIdentifiers": [
          "EL-CURRENT-THERMAL-EFFECT-001",
          "EL-CURRENT-CHEMICAL-EFFECT-001",
          "EL-THERMAL-EFFECT-FACTORS-001"
        ],
        "supportingCapabilityIds": [],
        "representationDependency": [],
        "misconceptionTargets": []
      },
      "difficultyBand": "introductory",
      "presentation": {
        "promptLines": [
          "{effect_clue}",
          "Is this the thermal effect or the chemical effect of current?"
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
      "id": "formula.charge_current",
      "assertionFamilyId": "electrical.charge_and_current",
      "canonicalTarget": "I",
      "variables": [
        {
          "symbol": "I",
          "name": "current",
          "quantity": "current",
          "unitName": "ampere",
          "unitSymbol": "A"
        },
        {
          "symbol": "Q",
          "name": "charge",
          "quantity": "charge",
          "unitName": "coulomb",
          "unitSymbol": "C"
        },
        {
          "symbol": "t",
          "name": "time",
          "quantity": "time",
          "unitName": "second",
          "unitSymbol": "s"
        }
      ],
      "forms": [
        {
          "target": "I",
          "expression": {
            "operation": "divide",
            "numerator": "Q",
            "denominator": "t"
          },
          "instruction": "To find current, divide charge by time.",
          "requiresWorkedExample": true
        },
        {
          "target": "Q",
          "expression": {
            "operation": "multiply",
            "operands": [
              "I",
              "t"
            ]
          },
          "instruction": "To find charge, multiply current by time.",
          "requiresWorkedExample": true
        },
        {
          "target": "t",
          "expression": {
            "operation": "divide",
            "numerator": "Q",
            "denominator": "I"
          },
          "instruction": "To find time, divide charge by current.",
          "requiresWorkedExample": false
        }
      ],
      "requiredTargets": [
        "I",
        "Q"
      ]
    },
    {
      "id": "formula.electrical_efficiency",
      "assertionFamilyId": "electrical.energy_and_efficiency",
      "canonicalTarget": "eta",
      "variables": [
        {
          "symbol": "eta",
          "name": "efficiency",
          "quantity": "efficiency",
          "unitName": "percent",
          "unitSymbol": "%"
        },
        {
          "symbol": "Pout",
          "name": "useful power output",
          "quantity": "power",
          "unitName": "watt",
          "unitSymbol": "W"
        },
        {
          "symbol": "Pin",
          "name": "power input",
          "quantity": "power",
          "unitName": "watt",
          "unitSymbol": "W"
        }
      ],
      "forms": [
        {
          "target": "eta",
          "expression": {
            "operation": "ratio_percentage",
            "numerator": "Pout",
            "denominator": "Pin"
          },
          "instruction": "To find efficiency, divide useful power output by power input and express as a percentage.",
          "requiresWorkedExample": true
        }
      ],
      "requiredTargets": [
        "eta"
      ]
    },
    {
      "id": "formula.electrical_energy",
      "assertionFamilyId": "electrical.energy_and_efficiency",
      "canonicalTarget": "E",
      "variables": [
        {
          "symbol": "E",
          "name": "energy",
          "quantity": "energy",
          "unitName": "joule",
          "unitSymbol": "J"
        },
        {
          "symbol": "P",
          "name": "power",
          "quantity": "power",
          "unitName": "watt",
          "unitSymbol": "W"
        },
        {
          "symbol": "t",
          "name": "time",
          "quantity": "time",
          "unitName": "second",
          "unitSymbol": "s"
        }
      ],
      "forms": [
        {
          "target": "E",
          "expression": {
            "operation": "multiply",
            "operands": [
              "P",
              "t"
            ]
          },
          "instruction": "To find energy transferred, multiply power by time.",
          "requiresWorkedExample": true
        },
        {
          "target": "P",
          "expression": {
            "operation": "divide",
            "numerator": "E",
            "denominator": "t"
          },
          "instruction": "To find power, divide energy by time.",
          "requiresWorkedExample": true
        },
        {
          "target": "t",
          "expression": {
            "operation": "divide",
            "numerator": "E",
            "denominator": "P"
          },
          "instruction": "To find time, divide energy by power.",
          "requiresWorkedExample": true
        }
      ],
      "requiredTargets": [
        "E",
        "P",
        "t"
      ]
    },
    {
      "id": "formula.electrical_power",
      "assertionFamilyId": "electrical.power_relationships",
      "canonicalTarget": "P",
      "variables": [
        {
          "symbol": "P",
          "name": "power",
          "quantity": "power",
          "unitName": "watt",
          "unitSymbol": "W"
        },
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
          "target": "P",
          "expression": {
            "operation": "multiply",
            "operands": [
              "V",
              "I"
            ]
          },
          "instruction": "To find power, multiply voltage by current.",
          "requiresWorkedExample": true
        },
        {
          "target": "V",
          "expression": {
            "operation": "divide",
            "numerator": "P",
            "denominator": "I"
          },
          "instruction": "To find voltage, divide power by current.",
          "requiresWorkedExample": true
        },
        {
          "target": "I",
          "expression": {
            "operation": "divide",
            "numerator": "P",
            "denominator": "V"
          },
          "instruction": "To find current, divide power by voltage.",
          "requiresWorkedExample": true
        },
        {
          "target": "P",
          "expression": {
            "operation": "multiply",
            "operands": [
              {
                "operation": "square",
                "operand": "I"
              },
              "R"
            ]
          },
          "instruction": "Power can also be found by multiplying current squared by resistance: P = I^2 x R.",
          "requiresWorkedExample": true
        },
        {
          "target": "P",
          "expression": {
            "operation": "divide",
            "numerator": {
              "operation": "square",
              "operand": "V"
            },
            "denominator": "R"
          },
          "instruction": "Power can also be found by dividing voltage squared by resistance: P = V^2 / R.",
          "requiresWorkedExample": true
        }
      ],
      "requiredTargets": [
        "P",
        "V",
        "I"
      ],
      "mnemonicId": "mnemonic.power_triangle"
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
      "id": "formula.resistivity",
      "assertionFamilyId": "electrical.resistivity",
      "canonicalTarget": "R",
      "variables": [
        {
          "symbol": "R",
          "name": "resistance",
          "quantity": "resistance",
          "unitName": "ohm",
          "unitSymbol": "Ω"
        },
        {
          "symbol": "rho",
          "name": "resistivity",
          "quantity": "resistivity",
          "unitName": "ohm-metre",
          "unitSymbol": "Ω·m"
        },
        {
          "symbol": "L",
          "name": "conductor length",
          "quantity": "length",
          "unitName": "metre",
          "unitSymbol": "m"
        },
        {
          "symbol": "A",
          "name": "cross-sectional area",
          "quantity": "area",
          "unitName": "square metre",
          "unitSymbol": "m²"
        }
      ],
      "forms": [
        {
          "target": "R",
          "expression": {
            "operation": "divide",
            "numerator": {
              "operation": "multiply",
              "operands": [
                "rho",
                "L"
              ]
            },
            "denominator": "A"
          },
          "instruction": "To find resistance, multiply resistivity by length, then divide by cross-sectional area.",
          "requiresWorkedExample": true
        }
      ],
      "requiredTargets": [
        "R"
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
      "id": "worked.efficiency.calculate",
      "formulaFamilyId": "formula.electrical_efficiency",
      "target": "eta",
      "knownVariables": [
        "Pout",
        "Pin"
      ],
      "steps": [
        "show_formula",
        "substitute_values",
        "calculate",
        "show_answer_with_unit"
      ]
    },
    {
      "id": "worked.energy.calculate_energy",
      "formulaFamilyId": "formula.electrical_energy",
      "target": "E",
      "knownVariables": [
        "P",
        "t"
      ],
      "steps": [
        "show_formula",
        "substitute_values",
        "calculate",
        "show_answer_with_unit"
      ]
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
      "id": "worked.power.calculate_from_ir",
      "formulaFamilyId": "formula.electrical_power",
      "target": "P",
      "knownVariables": [
        "I",
        "R"
      ],
      "steps": [
        "show_formula",
        "substitute_values",
        "calculate",
        "show_answer_with_unit"
      ]
    },
    {
      "id": "worked.power.calculate_from_vi",
      "formulaFamilyId": "formula.electrical_power",
      "target": "P",
      "knownVariables": [
        "V",
        "I"
      ],
      "steps": [
        "show_formula",
        "substitute_values",
        "calculate",
        "show_answer_with_unit"
      ]
    },
    {
      "id": "worked.resistivity.calculate_resistance",
      "formulaFamilyId": "formula.resistivity",
      "target": "R",
      "knownVariables": [
        "rho",
        "L",
        "A"
      ],
      "steps": [
        "show_formula",
        "substitute_values",
        "calculate",
        "show_answer_with_unit"
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
      "id": "circuit.series_parallel_mixed",
      "type": "electrical_circuit",
      "renderer": "svg",
      "parameters": [
        {
          "name": "branch_arrangement",
          "kind": "enum",
          "allowed": [
            "series_of_parallel",
            "parallel_of_series"
          ]
        },
        {
          "name": "show_values",
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
    },
    {
      "id": "instrument.measurement_connection",
      "type": "instrument_connection",
      "renderer": "svg",
      "parameters": [
        {
          "name": "instrument_type",
          "kind": "enum",
          "allowed": [
            "voltmeter",
            "ammeter",
            "ohmmeter"
          ]
        },
        {
          "name": "connection_style",
          "kind": "enum",
          "allowed": [
            "series",
            "parallel"
          ]
        }
      ],
      "accessibility": {
        "semanticDescriptionRequired": true,
        "colourOnlyEncodingProhibited": true,
        "identifierLabelPattern": "instrument-{index}"
      },
      "valueEmbedding": "symbolic_only"
    }
  ],
  "assertionFamilies": [
    {
      "id": "electrical.charge_and_current",
      "requiredCapabilityIds": [
        "cap.charge.recognise",
        "cap.charge.calculate"
      ],
      "assessmentRequirement": "assessable"
    },
    {
      "id": "electrical.conductors_and_insulators",
      "requiredCapabilityIds": [
        "cap.conductors.classify_material",
        "cap.conductors.recognise_breakdown"
      ],
      "assessmentRequirement": "assessable"
    },
    {
      "id": "electrical.core_quantities",
      "requiredCapabilityIds": [
        "cap.core_quantities.recognise",
        "cap.core_quantities.distinguish"
      ],
      "assessmentRequirement": "assessable"
    },
    {
      "id": "electrical.energy_and_efficiency",
      "requiredCapabilityIds": [
        "cap.energy.calculate_energy",
        "cap.energy.calculate_energy_kwh",
        "cap.energy.rearrange",
        "cap.energy.calculate_efficiency"
      ],
      "assessmentRequirement": "assessable"
    },
    {
      "id": "electrical.fault_conditions_protection",
      "requiredCapabilityIds": [
        "cap.fault.recognise_condition",
        "cap.fault.predict_effect",
        "cap.fault.select_protective_device",
        "cap.fault.compare_fuse_breaker"
      ],
      "assessmentRequirement": "assessable"
    },
    {
      "id": "electrical.instrumentation",
      "requiredCapabilityIds": [
        "cap.instrumentation.select_instrument",
        "cap.instrumentation.recognise_connection",
        "cap.instrumentation.recognise_internal_resistance_property",
        "cap.instrumentation.recognise_purpose"
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
      "id": "electrical.power_relationships",
      "requiredCapabilityIds": [
        "cap.power.recognise_relationship",
        "cap.power.select_form",
        "cap.power.calculate_from_vi",
        "cap.power.calculate_from_ir",
        "cap.power.calculate_from_vr",
        "cap.power.calculate_total"
      ],
      "assessmentRequirement": "assessable"
    },
    {
      "id": "electrical.resistivity",
      "requiredCapabilityIds": [
        "cap.resistivity.recognise",
        "cap.resistivity.compare_materials",
        "cap.resistivity.predict_length_effect",
        "cap.resistivity.predict_area_effect",
        "cap.resistivity.calculate"
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
      "id": "electrical.series_vs_parallel_comparison",
      "requiredCapabilityIds": [
        "cap.comparison.identify_topology",
        "cap.comparison.recognise_mixed_circuit",
        "cap.comparison.trace_current_path",
        "cap.comparison.compare_resistance",
        "cap.comparison.compare_current_voltage",
        "cap.comparison.compare_power_energy"
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
      "id": "electrical.thermal_and_chemical_effects",
      "requiredCapabilityIds": [
        "cap.thermal_chemical.recognise_effect",
        "cap.thermal_chemical.recognise_application"
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
    "EL-CALC-ELECTRICAL-EFFICIENCY-001": "Calculate the efficiency of an electrical device as a percentage from its useful power output and its power input.",
    "EL-CIRCUIT-BREAKER-VS-FUSE-001": "Compare a fuse, which must be replaced after operating, with a circuit breaker, which can be reset and reused after tripping.",
    "EL-CIRCUIT-COMPARE-CURRENT-001": "Compare current behaviour in series versus parallel circuits: current is the same throughout a series circuit, but divides between branches in a parallel circuit.",
    "EL-CIRCUIT-COMPARE-ENERGY-001": "Compare the total electrical energy transferred over a given time by the same set of resistors when connected in series versus in parallel at the same supply voltage.",
    "EL-CIRCUIT-COMPARE-POWER-001": "Compare the total power dissipated by the same set of resistors at the same supply voltage when connected in series versus in parallel.",
    "EL-CIRCUIT-COMPARE-RESISTANCE-001": "Compare how the total resistance of the same set of resistors differs when connected in series versus in parallel: the parallel total is always lower than the series total.",
    "EL-CIRCUIT-COMPARE-VOLTAGE-001": "Compare voltage behaviour in series versus parallel circuits: voltage divides between components in a series circuit, but is the same across every branch of a parallel circuit.",
    "EL-CIRCUIT-MIXED-SERIES-PARALLEL-RECOGNITION-001": "Some circuits combine both series-connected and parallel-connected sections within the same network.",
    "EL-CIRCUIT-OPEN-CIRCUIT-RESISTANCE-INTERPRETATION-001": "An open circuit can be modelled as having infinite resistance, since no current can flow through it regardless of the applied voltage.",
    "EL-CIRCUIT-PARALLEL-STRUCTURE-001": "In a parallel circuit, components are connected between the same two points, providing more than one path for current to flow.",
    "EL-CIRCUIT-POWER-TOTAL-001": "The total power dissipated in a circuit is the sum of the power dissipated in each individual component, regardless of whether the components are connected in series or parallel.",
    "EL-CIRCUIT-PREDICT-SHORT-EFFECT-001": "Predict the effect of a short circuit occurring across a component: current increases sharply and may cause damage or operate a protective device.",
    "EL-CIRCUIT-RECOGNISE-OPEN-CIRCUIT-001": "Recognise an open circuit as an unintended break in the current path that prevents current from flowing.",
    "EL-CIRCUIT-RECOGNISE-SHORT-CIRCUIT-001": "Recognise a short circuit as an unintended low-resistance path that causes abnormally high current to flow.",
    "EL-CIRCUIT-SELECT-CONFIGURATION-001": "Identify whether a given circuit diagram or description shows components connected in series or in parallel.",
    "EL-CIRCUIT-SERIES-STRUCTURE-001": "In a series circuit, components are connected end-to-end so that there is only one path for current to flow.",
    "EL-CIRCUIT-SUPPLY-CURRENT-SERIES-001": "Calculate the supply current in a series circuit from the supply voltage and the total resistance of the circuit.",
    "EL-CIRCUIT-TRACE-CURRENT-PATH-001": "Trace the path or paths current takes through a given series or parallel circuit diagram.",
    "EL-CIRCUIT-ZERO-RESISTANCE-INTERPRETATION-001": "An ideal conductor with zero resistance has zero voltage drop across it, regardless of the current flowing through it.",
    "EL-CONCEPT-CONDUCTOR-001": "A metallic conductor is a material containing many free electrons, which allows electric current (the flow of those electrons) to pass through it easily.",
    "EL-CONCEPT-CURRENT-001": "Electric current is the rate of flow of electric charge through a conductor.",
    "EL-CONCEPT-ELECTRON-THEORY-001": "In a metallic conductor, electric current is the flow of free electrons, driven by a potential difference across the conductor.",
    "EL-CONCEPT-INSULATOR-001": "Compared to a metallic conductor, an insulator is a material with very few free electrons available to move, which strongly opposes the flow of electric current through it.",
    "EL-CONCEPT-RESISTANCE-001": "Electrical resistance is the opposition a component presents to the flow of electric current.",
    "EL-CONCEPT-RESISTIVITY-001": "Resistivity is a material property describing how strongly a material opposes current flow, independent of the conductor's length or cross-sectional area.",
    "EL-CONCEPT-VOLTAGE-001": "Potential difference (voltage) is the electrical energy transferred per unit charge between two points in a circuit.",
    "EL-CURRENT-CHARGE-CALC-001": "Calculate charge or current from the relationship I = Q divided by t, given the other two quantities.",
    "EL-CURRENT-CHARGE-RELATIONSHIP-001": "Electric current equals the rate of flow of charge: I = Q divided by t.",
    "EL-CURRENT-CHEMICAL-EFFECT-001": "Current flowing through certain solutions (electrolytes) causes chemical changes, a process known as electrolysis.",
    "EL-CURRENT-THERMAL-EFFECT-001": "Current flowing through a resistance causes heating, because electrical energy is converted into heat energy.",
    "EL-ENERGY-CALC-001": "Calculate the electrical energy transferred by a device from its power rating and its time of use, using E = P times t.",
    "EL-ENERGY-KWH-CALC-001": "Calculate the electrical energy used by a device in kilowatt-hours from its power rating in kilowatts and its time of use in hours.",
    "EL-ENERGY-REARRANGE-001": "Rearrange E = P times t algebraically to make power or time the subject.",
    "EL-FUSE-OPERATION-001": "A fuse protects a circuit by melting and breaking the circuit when current exceeds its rated value, using the thermal effect of current.",
    "EL-INSTRUMENT-AMMETER-001": "An ammeter measures current and is connected in series within the circuit being measured.",
    "EL-INSTRUMENT-AMMETER-INTERNAL-RESISTANCE-001": "An ideal ammeter has very low internal resistance so that connecting it in series does not significantly alter the circuit being measured.",
    "EL-INSTRUMENT-CLAMP-METER-001": "A clamp meter measures current without breaking the circuit, by detecting the magnetic field produced around the current-carrying conductor.",
    "EL-INSTRUMENT-CONTINUITY-TEST-001": "A continuity test uses an ohmmeter or multimeter to confirm that a low-resistance path exists between two points in a de-energised circuit.",
    "EL-INSTRUMENT-MULTIMETER-001": "A multimeter is a single test instrument that can be configured to measure several electrical quantities, commonly including voltage, current and resistance.",
    "EL-INSTRUMENT-OHMMETER-001": "An ohmmeter measures resistance and must never be connected to an energised circuit; to measure an individual component's resistance accurately, other circuit paths may need to be disconnected first.",
    "EL-INSTRUMENT-OSCILLOSCOPE-001": "An oscilloscope displays how a voltage varies with time, allowing the shape, amplitude and periodic time of a waveform to be observed.",
    "EL-INSTRUMENT-SELECT-001": "Select the appropriate instrument (voltmeter, ammeter, ohmmeter or multimeter) to measure a given electrical quantity.",
    "EL-INSTRUMENT-VOLTMETER-001": "A voltmeter measures potential difference and is connected in parallel across the component being measured.",
    "EL-INSTRUMENT-VOLTMETER-INTERNAL-RESISTANCE-001": "An ideal voltmeter has very high internal resistance so that connecting it in parallel does not significantly alter the circuit being measured.",
    "EL-INSTRUMENT-WATTMETER-001": "A wattmeter measures electrical power by combining a measurement of the current through the load with a measurement of the voltage across it; its output is proportional to the product of the two, giving power.",
    "EL-INSULATOR-BREAKDOWN-001": "If the voltage across an insulator becomes too high, the insulator can break down and allow current to flow, which is why insulation has a rated maximum voltage.",
    "EL-INTERPRET-PARALLEL-RESULT-001": "A calculated total resistance for resistors in parallel that is greater than the smallest branch resistance indicates a calculation error, since total parallel resistance is always less than the smallest branch resistance.",
    "EL-INTERPRET-SERIES-RESULT-001": "A calculated total resistance for resistors in series that is less than the largest individual resistance indicates a calculation error, since total series resistance is always at least as great as the largest individual resistance.",
    "EL-MATERIAL-CONDUCTOR-INSULATOR-EXAMPLES-001": "Common conductors used in electrical installation work include copper and aluminium; common insulators include PVC and rubber.",
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
    "EL-POWER-REARRANGE-001": "Rearrange P = V times I algebraically to make voltage or current the subject.",
    "EL-POWER-RELATIONSHIP-001": "Electrical power is related to voltage and current by P = V times I.",
    "EL-POWER-SOLVE-001": "Calculate electrical power from known voltage and current using P = V times I.",
    "EL-POWER-SOLVE-IR-001": "Calculate electrical power from known current and resistance using P = I squared times R.",
    "EL-POWER-SOLVE-V2R-001": "Calculate electrical power from known voltage and resistance using P = V squared divided by R.",
    "EL-PROTECTIVE-DEVICE-PURPOSE-001": "A protective device, such as a fuse or circuit breaker, is designed to automatically disconnect a circuit when current exceeds a safe value.",
    "EL-RESISTIVITY-AREA-EFFECT-001": "Increasing the cross-sectional area of a conductor decreases its resistance, since resistance is inversely proportional to cross-sectional area.",
    "EL-RESISTIVITY-COMPARE-MATERIALS-001": "Compare the resistivity of different materials to determine which is the better conductor: a lower resistivity indicates a better conductor.",
    "EL-RESISTIVITY-LENGTH-EFFECT-001": "Increasing the length of a conductor increases its resistance, since resistance is directly proportional to length.",
    "EL-RESISTIVITY-RELATIONSHIP-001": "The resistance of a conductor is related to its resistivity, length and cross-sectional area by R = rho times L divided by A.",
    "EL-SERIES-CURRENT-001": "In a series circuit, the same current flows through every component.",
    "EL-SERIES-RESISTANCE-001": "The total resistance of resistors connected in series is the sum of the individual resistances: RT = R1 + R2 + ...",
    "EL-SERIES-RESISTANCE-CALC-001": "Calculate the total resistance of resistors connected in series.",
    "EL-SERIES-VOLTAGE-001": "In a series circuit, the supply voltage is shared between the components as individual voltage drops that sum to the supply voltage.",
    "EL-SERIES-VOLTAGE-CALC-001": "Calculate an individual voltage drop across a component in a series circuit.",
    "EL-THERMAL-EFFECT-APPLICATION-001": "Recognise practical applications of the thermal effect of current, such as heating elements and filament lamps.",
    "EL-THERMAL-EFFECT-FACTORS-001": "The amount of heat generated by current flowing through a resistance depends on the current, the resistance and the time for which the current flows.",
    "EL-UNIT-AMPERE-001": "The ampere (A) is the SI base unit of electric current.",
    "EL-UNIT-BASE-VS-DERIVED-001": "The ampere is an SI base unit, while the volt, ohm, watt, joule and hertz are SI derived units formed from combinations of base units.",
    "EL-UNIT-HERTZ-001": "The hertz (Hz) is the SI derived unit of frequency, equal to one cycle per second.",
    "EL-UNIT-JOULE-001": "The joule (J) is the SI derived unit of energy.",
    "EL-UNIT-OHM-001": "The ohm is the SI derived unit of electrical resistance.",
    "EL-UNIT-OHM-METRE-001": "The ohm-metre is the SI derived unit of resistivity.",
    "EL-UNIT-VOLT-001": "The volt (V) is the SI derived unit of electric potential difference (voltage).",
    "EL-UNIT-WATT-001": "The watt (W) is the SI derived unit of power.",
    "FM-ALG-EQUALITY-ADD-001": "In an equation, adding or subtracting the same value from both sides preserves the equality between the two sides.",
    "FM-ALG-EQUALITY-MULT-001": "In an equation, multiplying or dividing both sides by the same non-zero value preserves the equality between the two sides.",
    "FM-ALG-INVERSE-OPS-ADD-001": "Addition and subtraction are inverse operations: subtracting a number undoes adding that number, and vice versa.",
    "FM-ALG-INVERSE-OPS-MULT-001": "Multiplication and division are inverse operations: dividing by a non-zero number undoes multiplying by that number, and vice versa.",
    "FM-ALG-TRANSPOSE-ADD-001": "Given a relationship of the form a = b + c, rearrange it algebraically to make b or c the subject.",
    "FM-ALG-TRANSPOSE-MULT-001": "Given a relationship of the form a = b times c, rearrange it algebraically to make b or c the subject.",
    "FP-CONCEPT-EFFICIENCY-001": "Efficiency is the ratio of useful energy or power output to total energy or power input, usually expressed as a percentage."
  },
  "misconceptionDescriptions": {
    "MIS-EL-CONDUCTOR-INSULATOR-CONFUSION-001": "Confuses which materials are good conductors versus insulators, or believes conductivity and resistance are unrelated properties.",
    "MIS-EL-CURRENT-VOLTAGE-CONFUSION-001": "Confuses current and voltage as concepts, for example treating current as something a source 'has' independent of the circuit rather than voltage driving current through resistance.",
    "MIS-EL-ELECTRON-CURRENT-DIRECTION-CONFUSION-001": "Confuses conventional current direction (positive to negative) with the actual direction of electron flow (negative to positive) in a conductor.",
    "MIS-EL-ENERGY-UNIT-CONFUSION-001": "Confuses the joule and the kilowatt-hour as interchangeable without converting between them, or is unaware that they measure the same quantity (energy) at different scales.",
    "MIS-EL-INSTRUMENT-CONNECTION-CONFUSION-001": "Connects a voltmeter in series or an ammeter in parallel, swapping the correct connection method for the two instruments.",
    "MIS-EL-OHM-REARRANGE-ERROR-001": "Incorrectly rearranges a multiplicative relationship such as V = I times R or P = V times I (for example moving a variable to the wrong side, or inverting the wrong pair of variables) when isolating a different subject.",
    "MIS-EL-OHM-UNRELATED-SYMBOLS-001": "Treats V, I and R as three unrelated symbols to memorise rather than as a single relationship connecting voltage, current and resistance (V = I times R).",
    "MIS-EL-OHM-WRONG-OPERATION-001": "Selects the wrong arithmetic operation when calculating an unknown quantity from V = I times R (for example multiplying instead of dividing when solving for current or resistance, or dividing the two known quantities in the wrong order).",
    "MIS-EL-PARALLEL-RESISTANCE-ADDITION-001": "Calculates the total resistance of a parallel circuit by simply adding the branch resistances, as if they were in series, instead of using the reciprocal-of-sum-of-reciprocals relationship.",
    "MIS-EL-RECIPROCAL-FORGOTTEN-INVERT-001": "Correctly sums the reciprocals of the branch resistances in a parallel circuit but forgets to take the reciprocal of the result, giving an answer that is the reciprocal of the correct total resistance rather than the total resistance itself.",
    "MIS-EL-SERIES-PARALLEL-CONFUSION-001": "Confuses series and parallel circuit structure, for example treating components wired in parallel as if they were in series (or vice versa) when identifying current and voltage relationships.",
    "MIS-EL-SI-PREFIX-ERROR-001": "Confuses SI-prefix magnitudes when converting between units (for example treating milliamps and amps as numerically equal, or converting in the wrong direction, such as multiplying instead of dividing by the scale factor).",
    "MIS-EL-UNIT-CONFUSION-001": "Confuses the electrical quantities voltage, current, resistance, power and energy with their SI units (volt, ampere, ohm, watt, joule), or attaches the wrong unit to the wrong quantity."
  }
};
