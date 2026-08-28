/**
 * GENERATED FILE -- DO NOT EDIT.
 *
 * Deterministic mobile learner-runtime content projection for governed
 * content release "release.unit202.v8".
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
    "id": "release.unit202.v8",
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
      "contentRelease": "release.unit202.v8"
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
        "cap.conductors.recognise_breakdown",
        "cap.conductors.recognise_electron_theory"
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
          "id": "guided_recognise_electron_theory",
          "type": "guided_interaction",
          "purpose": "Recognise electron theory: what actually moves to create current in a metallic conductor.",
          "requirement": "required",
          "teaches": [],
          "reinforces": [],
          "tests": [
            "EL-CONCEPT-ELECTRON-THEORY-001"
          ],
          "assertionFamilyId": "electrical.conductors_and_insulators",
          "capabilityIds": [
            "cap.conductors.recognise_electron_theory"
          ],
          "misconceptionTargets": [
            {
              "misconceptionIdentifier": "MIS-EL-ELECTRON-CURRENT-DIRECTION-CONFUSION-001",
              "evidenceStrength": "suggestive"
            }
          ],
          "representation": {},
          "questionBlueprintId": "conductors.recognise_electron_theory",
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
            "cap.conductors.recognise_electron_theory"
          ]
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
            "EL-CONCEPT-ELECTRON-THEORY-001",
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
          "guided_recognise_electron_theory",
          "concept_conductor_insulator",
          "guided_classify_material",
          "independent_recognise_breakdown",
          "recap",
          "exit_completion"
        ],
        "requiredCapabilityEvidence": [
          "cap.conductors.classify_material",
          "cap.conductors.recognise_breakdown",
          "cap.conductors.recognise_electron_theory"
        ],
        "masteryGateCapabilityIds": [
          "cap.conductors.classify_material"
        ],
        "requiresRemediationClearance": true,
        "exitSummary": "The learner has stated and recognised electron theory for a metallic conductor, distinguished conductors from insulators, classified real materials, and recognised insulation breakdown."
      },
      "presentationModes": [
        "learn",
        "review"
      ],
      "contentRelease": "release.unit202.v8"
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
      "contentRelease": "release.unit202.v8"
    },
    {
      "id": "lesson.electrical.electronic-components-passive",
      "schemaVersion": 1,
      "version": 1,
      "title": "Electronic Components: Capacitors, Rectification and Diodes",
      "learnerFacingDescription": "Recognise the basic operating principle of capacitors, rectifiers (half-wave and full-wave) and the diode family (diode, Zener diode, LED, photodiode), and identify the components used in a traditional UK master telephone socket.",
      "curriculumUnit": "City & Guilds 2365-02 Unit 202 -- Principles of Electrical Science",
      "prerequisiteKnowledge": [
        "electrical.core_quantities",
        "electrical.ac_dc_waveforms"
      ],
      "targetAssertionFamilyIds": [
        "electrical.electronic_components"
      ],
      "targetAssertionIdentifiers": [
        "EL-COMPONENT-RESISTOR-001",
        "EL-COMPONENT-CAPACITOR-001",
        "EL-COMPONENT-CAPACITOR-TRANSIENT-001",
        "EL-COMPONENT-RECTIFIER-001",
        "EL-COMPONENT-RECTIFIER-HALF-WAVE-001",
        "EL-COMPONENT-RECTIFIER-FULL-WAVE-001",
        "EL-COMPONENT-INVERTER-001",
        "EL-COMPONENT-DIODE-001",
        "EL-COMPONENT-ZENER-DIODE-001",
        "EL-COMPONENT-LED-001",
        "EL-COMPONENT-PHOTODIODE-001",
        "EL-APPLICATION-TELEPHONE-MASTER-SOCKET-001"
      ],
      "targetCapabilityIds": [
        "cap.electronic_components.recognise_principle",
        "cap.electronic_components.identify_application"
      ],
      "remediationEligibility": [],
      "estimatedDurationMinutes": 20,
      "instructionalStrategy": "Passive components (resistor, capacitor) first, since they are the most familiar; the capacitor's transient charge/discharge behaviour is taught as a direct contrast to a plausible 'changes instantly' misconception, since the governed statement itself names both. Rectification is then taught alongside its DC-to-AC opposite (the inverter) as a compare-and-contrast pair rather than three unrelated facts. The diode family (diode, Zener, LED, photodiode) is taught as one family sharing the same underlying diode behaviour with one distinguishing feature each. The lesson closes with one real application (the UK master telephone socket) to show component recognition applied to something identifiable.",
      "steps": [
        {
          "id": "orientation",
          "type": "orientation",
          "purpose": "Frame why an electrician/electrical technician needs to recognise common electronic components and their basic operating principle -- Level 2 recognition, not circuit design or internal semiconductor physics.",
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
          "id": "concept_passive_components",
          "type": "concept_explanation",
          "purpose": "Introduce the resistor (a component manufactured to provide a stable resistance, limiting current or dividing voltage) and the capacitor (stores charge/energy in an electric field between two plates), then its transient behaviour: a capacitor opposes a sudden change in voltage across it, charging/discharging exponentially over time (time constant tau = R x C) rather than changing instantly.",
          "requirement": "required",
          "teaches": [
            "EL-COMPONENT-RESISTOR-001",
            "EL-COMPONENT-CAPACITOR-001",
            "EL-COMPONENT-CAPACITOR-TRANSIENT-001"
          ],
          "reinforces": [],
          "tests": [],
          "assertionFamilyId": "electrical.electronic_components",
          "capabilityIds": [
            "cap.electronic_components.recognise_principle"
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
          "id": "guided_recognise_capacitor_transient",
          "type": "guided_interaction",
          "purpose": "Recognise that a charging or discharging capacitor's voltage changes gradually (exponentially), not instantly.",
          "requirement": "required",
          "teaches": [],
          "reinforces": [
            "EL-COMPONENT-CAPACITOR-TRANSIENT-001"
          ],
          "tests": [
            "EL-COMPONENT-CAPACITOR-TRANSIENT-001"
          ],
          "assertionFamilyId": "electrical.electronic_components",
          "capabilityIds": [
            "cap.electronic_components.recognise_principle"
          ],
          "misconceptionTargets": [],
          "representation": {
            "diagramBlueprintId": "electronics.component_symbol_card",
            "diagramParameters": {
              "component_type": "capacitor"
            }
          },
          "questionBlueprintId": "electronics.recognise_capacitor_behaviour",
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
            "cap.electronic_components.recognise_principle"
          ]
        },
        {
          "id": "concept_rectification_and_inversion",
          "type": "concept_explanation",
          "purpose": "Introduce rectification (a diode-based circuit converting AC to DC), its two forms -- half-wave (one diode, blocks one half-cycle) and full-wave bridge (four diodes, both half-cycles converted to the same polarity, less ripple) -- and contrast it with the inverter, which converts DC to AC using controlled electronic switching.",
          "requirement": "required",
          "teaches": [
            "EL-COMPONENT-RECTIFIER-001",
            "EL-COMPONENT-RECTIFIER-HALF-WAVE-001",
            "EL-COMPONENT-RECTIFIER-FULL-WAVE-001",
            "EL-COMPONENT-INVERTER-001"
          ],
          "reinforces": [],
          "tests": [],
          "assertionFamilyId": "electrical.electronic_components",
          "capabilityIds": [
            "cap.electronic_components.recognise_principle"
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
          "id": "guided_recognise_rectifier_type",
          "type": "guided_interaction",
          "purpose": "Distinguish half-wave rectification, full-wave bridge rectification and the inverter from a description of their behaviour.",
          "requirement": "required",
          "teaches": [],
          "reinforces": [
            "EL-COMPONENT-RECTIFIER-HALF-WAVE-001",
            "EL-COMPONENT-RECTIFIER-FULL-WAVE-001"
          ],
          "tests": [
            "EL-COMPONENT-RECTIFIER-HALF-WAVE-001",
            "EL-COMPONENT-RECTIFIER-FULL-WAVE-001",
            "EL-COMPONENT-INVERTER-001"
          ],
          "assertionFamilyId": "electrical.electronic_components",
          "capabilityIds": [
            "cap.electronic_components.recognise_principle"
          ],
          "misconceptionTargets": [],
          "representation": {},
          "questionBlueprintId": "electronics.recognise_rectifier_type",
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
            "cap.electronic_components.recognise_principle"
          ]
        },
        {
          "id": "concept_diode_family",
          "type": "concept_explanation",
          "purpose": "Introduce the diode family: the diode (conducts one way, blocks the other), the Zener diode (operated in reverse breakdown at a defined voltage to regulate voltage), the LED (produces light by electroluminescence when forward-biased) and the photodiode (generates a photocurrent in response to light, for detection/measurement).",
          "requirement": "required",
          "teaches": [
            "EL-COMPONENT-DIODE-001",
            "EL-COMPONENT-ZENER-DIODE-001",
            "EL-COMPONENT-LED-001",
            "EL-COMPONENT-PHOTODIODE-001"
          ],
          "reinforces": [],
          "tests": [],
          "assertionFamilyId": "electrical.electronic_components",
          "capabilityIds": [
            "cap.electronic_components.recognise_principle"
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
          "id": "independent_recognise_diode_family",
          "type": "independent_question",
          "purpose": "Recognise which diode-family member (diode, Zener diode, LED, photodiode) a description matches, unscaffolded.",
          "requirement": "required",
          "teaches": [],
          "reinforces": [],
          "tests": [
            "EL-COMPONENT-DIODE-001",
            "EL-COMPONENT-ZENER-DIODE-001",
            "EL-COMPONENT-LED-001",
            "EL-COMPONENT-PHOTODIODE-001"
          ],
          "assertionFamilyId": "electrical.electronic_components",
          "capabilityIds": [
            "cap.electronic_components.recognise_principle"
          ],
          "misconceptionTargets": [
            {
              "misconceptionIdentifier": "MIS-EL-DIODE-DIRECTION-CONFUSION-001",
              "evidenceStrength": "suggestive"
            }
          ],
          "representation": {},
          "questionBlueprintId": "electronics.recognise_diode_family",
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
            "cap.electronic_components.recognise_principle"
          ]
        },
        {
          "id": "concept_telephone_application",
          "type": "concept_explanation",
          "purpose": "Show component recognition applied: the traditional UK master telephone socket contains a capacitor (couples the AC ringing signal to the line while blocking DC) and a resistor (provides a defined test load for line testing when no telephone is connected).",
          "requirement": "required",
          "teaches": [
            "EL-APPLICATION-TELEPHONE-MASTER-SOCKET-001"
          ],
          "reinforces": [
            "EL-COMPONENT-CAPACITOR-001",
            "EL-COMPONENT-RESISTOR-001"
          ],
          "tests": [],
          "assertionFamilyId": "electrical.electronic_components",
          "capabilityIds": [
            "cap.electronic_components.identify_application"
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
          "id": "independent_identify_telephone_application",
          "type": "independent_question",
          "purpose": "Identify which component fulfils a specific named role (ringing-signal coupling, or line test-load) in the master telephone socket.",
          "requirement": "required",
          "teaches": [],
          "reinforces": [],
          "tests": [
            "EL-APPLICATION-TELEPHONE-MASTER-SOCKET-001"
          ],
          "assertionFamilyId": "electrical.electronic_components",
          "capabilityIds": [
            "cap.electronic_components.identify_application"
          ],
          "misconceptionTargets": [],
          "representation": {},
          "questionBlueprintId": "electronics.identify_application",
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
            "cap.electronic_components.identify_application"
          ]
        },
        {
          "id": "retrieval_check",
          "type": "retrieval_check",
          "purpose": "Short delayed retrieval of diode-family recognition to strengthen retention before the lesson ends.",
          "requirement": "required",
          "teaches": [],
          "reinforces": [],
          "tests": [
            "EL-COMPONENT-DIODE-001",
            "EL-COMPONENT-ZENER-DIODE-001",
            "EL-COMPONENT-LED-001",
            "EL-COMPONENT-PHOTODIODE-001"
          ],
          "assertionFamilyId": "electrical.electronic_components",
          "capabilityIds": [
            "cap.electronic_components.recognise_principle"
          ],
          "misconceptionTargets": [],
          "representation": {},
          "questionBlueprintId": "electronics.recognise_diode_family",
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
            "cap.electronic_components.recognise_principle"
          ]
        },
        {
          "id": "recap",
          "type": "recap",
          "purpose": "Summarise resistors/capacitors, capacitor transient behaviour, rectification vs inversion, the diode family, and the telephone-socket application.",
          "requirement": "required",
          "teaches": [],
          "reinforces": [
            "EL-COMPONENT-CAPACITOR-TRANSIENT-001",
            "EL-COMPONENT-RECTIFIER-001",
            "EL-COMPONENT-DIODE-001"
          ],
          "tests": [],
          "assertionFamilyId": "electrical.electronic_components",
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
          "misconceptionIdentifier": "MIS-EL-DIODE-DIRECTION-CONFUSION-001",
          "evidenceStrength": "suggestive"
        }
      ],
      "retrievalTags": [
        "electrical.electronic_components",
        "electrical.ac_dc_waveforms"
      ],
      "completionCriteria": {
        "requiredStepIds": [
          "orientation",
          "concept_passive_components",
          "guided_recognise_capacitor_transient",
          "concept_rectification_and_inversion",
          "guided_recognise_rectifier_type",
          "concept_diode_family",
          "independent_recognise_diode_family",
          "concept_telephone_application",
          "independent_identify_telephone_application",
          "retrieval_check",
          "recap",
          "exit_completion"
        ],
        "requiredCapabilityEvidence": [
          "cap.electronic_components.recognise_principle",
          "cap.electronic_components.identify_application"
        ],
        "masteryGateCapabilityIds": [
          "cap.electronic_components.recognise_principle",
          "cap.electronic_components.identify_application"
        ],
        "requiresRemediationClearance": true,
        "exitSummary": "The learner has recognised capacitor transient (charge/discharge) behaviour, distinguished half-wave and full-wave rectification from the inverter, recognised the diode family (diode, Zener diode, LED, photodiode), and identified the components used in a traditional UK master telephone socket."
      },
      "presentationModes": [
        "learn",
        "review"
      ],
      "contentRelease": "release.unit202.v8"
    },
    {
      "id": "lesson.electrical.electronic-components-switching-control",
      "schemaVersion": 1,
      "version": 1,
      "title": "Electronic Components: Thermistors and Switching/Control Devices",
      "learnerFacingDescription": "Recognise the basic operating principle of thermistors (NTC and PTC), the DIAC/TRIAC/thyristor/transistor switching family, and identify which of these components is used in a dimmer switch, motor control, heating/boiler control and a security-alarm circuit.",
      "curriculumUnit": "City & Guilds 2365-02 Unit 202 -- Principles of Electrical Science",
      "prerequisiteKnowledge": [
        "electrical.ac_dc_waveforms"
      ],
      "targetAssertionFamilyIds": [
        "electrical.electronic_components"
      ],
      "targetAssertionIdentifiers": [
        "EL-COMPONENT-THERMISTOR-001",
        "EL-COMPONENT-THERMISTOR-PTC-001",
        "EL-COMPONENT-DIAC-001",
        "EL-COMPONENT-TRIAC-001",
        "EL-COMPONENT-THYRISTOR-SCR-001",
        "EL-COMPONENT-TRANSISTOR-001",
        "EL-APPLICATION-DIMMER-SWITCH-001",
        "EL-APPLICATION-MOTOR-CONTROL-001",
        "EL-APPLICATION-HEATING-BOILER-CONTROL-001",
        "EL-APPLICATION-SECURITY-ALARM-TRANSISTOR-THYRISTOR-001"
      ],
      "targetCapabilityIds": [
        "cap.electronic_components.recognise_principle",
        "cap.electronic_components.identify_application"
      ],
      "remediationEligibility": [],
      "estimatedDurationMinutes": 22,
      "instructionalStrategy": "Thermistors (temperature-controlled resistance) are taught first and immediately connected to their real heating/boiler-control application, since that pairing is the most concrete. The DIAC/TRIAC/thyristor/transistor cluster is taught as one related family (DIAC triggers other thyristor devices; TRIAC and thyristor both latch/conduct once triggered, TRIAC bidirectionally; the transistor is the odd one out, a proportional/switching amplifier rather than a latching device) before three further applications (dimmer switch, motor control, security alarm) show each device recognised in context. The security-alarm application is deliberately taught as two separate roles (the transistor's break-detection role and the thyristor's latching role), never as one combined fact, since a single answer must never certify recognition of both components at once.",
      "steps": [
        {
          "id": "orientation",
          "type": "orientation",
          "purpose": "Frame this lesson as the second half of electronic-component recognition: components that switch, control or respond to temperature, rather than simply store or convert.",
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
          "id": "concept_thermistors",
          "type": "concept_explanation",
          "purpose": "Introduce the NTC thermistor (resistance decreases as temperature increases) and the PTC thermistor (resistance increases as temperature increases), then their use in heating/boiler control: providing a temperature feedback signal so a thermostat can switch the heating load on or off.",
          "requirement": "required",
          "teaches": [
            "EL-COMPONENT-THERMISTOR-001",
            "EL-COMPONENT-THERMISTOR-PTC-001",
            "EL-APPLICATION-HEATING-BOILER-CONTROL-001"
          ],
          "reinforces": [],
          "tests": [],
          "assertionFamilyId": "electrical.electronic_components",
          "capabilityIds": [
            "cap.electronic_components.recognise_principle",
            "cap.electronic_components.identify_application"
          ],
          "misconceptionTargets": [],
          "representation": {
            "diagramBlueprintId": "electronics.component_symbol_card",
            "diagramParameters": {
              "component_type": "thermistor"
            }
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
          "id": "guided_recognise_thermistor_type",
          "type": "guided_interaction",
          "purpose": "Distinguish an NTC thermistor from a PTC thermistor from a description of how its resistance responds to temperature.",
          "requirement": "required",
          "teaches": [],
          "reinforces": [
            "EL-COMPONENT-THERMISTOR-001",
            "EL-COMPONENT-THERMISTOR-PTC-001"
          ],
          "tests": [
            "EL-COMPONENT-THERMISTOR-001",
            "EL-COMPONENT-THERMISTOR-PTC-001"
          ],
          "assertionFamilyId": "electrical.electronic_components",
          "capabilityIds": [
            "cap.electronic_components.recognise_principle"
          ],
          "misconceptionTargets": [],
          "representation": {
            "diagramBlueprintId": "electronics.component_symbol_card",
            "diagramParameters": {
              "component_type": "thermistor"
            }
          },
          "questionBlueprintId": "electronics.recognise_thermistor_type",
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
            "cap.electronic_components.recognise_principle"
          ]
        },
        {
          "id": "independent_identify_heating_application",
          "type": "independent_question",
          "purpose": "Identify the thermistor as the component providing the temperature feedback signal in a heating/boiler control circuit.",
          "requirement": "required",
          "teaches": [],
          "reinforces": [],
          "tests": [
            "EL-APPLICATION-HEATING-BOILER-CONTROL-001"
          ],
          "assertionFamilyId": "electrical.electronic_components",
          "capabilityIds": [
            "cap.electronic_components.identify_application"
          ],
          "misconceptionTargets": [],
          "representation": {},
          "questionBlueprintId": "electronics.identify_application",
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
            "cap.electronic_components.identify_application"
          ]
        },
        {
          "id": "concept_switching_family",
          "type": "concept_explanation",
          "purpose": "Introduce the DIAC (a bidirectional trigger device, almost never used alone), the thyristor/SCR (conducts one way once triggered by gate current, latches until current falls below its holding current), the TRIAC (like two SCRs back-to-back, conducts both directions once triggered -- suited to controlling AC), and the transistor (a three-terminal device whose collector-emitter current is controlled by a much smaller base current, acting as a switch or amplifier).",
          "requirement": "required",
          "teaches": [
            "EL-COMPONENT-DIAC-001",
            "EL-COMPONENT-THYRISTOR-SCR-001",
            "EL-COMPONENT-TRIAC-001",
            "EL-COMPONENT-TRANSISTOR-001"
          ],
          "reinforces": [],
          "tests": [],
          "assertionFamilyId": "electrical.electronic_components",
          "capabilityIds": [
            "cap.electronic_components.recognise_principle"
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
          "id": "independent_recognise_switching_family",
          "type": "independent_question",
          "purpose": "Recognise which switching device (DIAC, TRIAC, thyristor/SCR, transistor) a description matches, unscaffolded.",
          "requirement": "required",
          "teaches": [],
          "reinforces": [],
          "tests": [
            "EL-COMPONENT-DIAC-001",
            "EL-COMPONENT-THYRISTOR-SCR-001",
            "EL-COMPONENT-TRIAC-001",
            "EL-COMPONENT-TRANSISTOR-001"
          ],
          "assertionFamilyId": "electrical.electronic_components",
          "capabilityIds": [
            "cap.electronic_components.recognise_principle"
          ],
          "misconceptionTargets": [],
          "representation": {},
          "questionBlueprintId": "electronics.recognise_switching_family",
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
            "cap.electronic_components.recognise_principle"
          ]
        },
        {
          "id": "concept_switching_applications",
          "type": "concept_explanation",
          "purpose": "Show the switching family recognised in context: a household dimmer switch typically uses a TRIAC (controlling average lamp power via phase-angle switching); a motor-control circuit typically uses a thyristor/SCR; a simple security-alarm circuit uses a transistor to detect a break in a normally-closed sensor loop, which then triggers a thyristor that latches on to keep a sounder powered until the circuit is deliberately reset.",
          "requirement": "required",
          "teaches": [
            "EL-APPLICATION-DIMMER-SWITCH-001",
            "EL-APPLICATION-MOTOR-CONTROL-001",
            "EL-APPLICATION-SECURITY-ALARM-TRANSISTOR-THYRISTOR-001"
          ],
          "reinforces": [
            "EL-COMPONENT-TRIAC-001",
            "EL-COMPONENT-THYRISTOR-SCR-001",
            "EL-COMPONENT-TRANSISTOR-001"
          ],
          "tests": [],
          "assertionFamilyId": "electrical.electronic_components",
          "capabilityIds": [
            "cap.electronic_components.identify_application"
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
          "id": "independent_identify_dimmer_and_motor_application",
          "type": "independent_question",
          "purpose": "Identify the component used in a dimmer switch or a motor-control circuit from a description of the application's need.",
          "requirement": "required",
          "teaches": [],
          "reinforces": [],
          "tests": [
            "EL-APPLICATION-DIMMER-SWITCH-001",
            "EL-APPLICATION-MOTOR-CONTROL-001"
          ],
          "assertionFamilyId": "electrical.electronic_components",
          "capabilityIds": [
            "cap.electronic_components.identify_application"
          ],
          "misconceptionTargets": [],
          "representation": {},
          "questionBlueprintId": "electronics.identify_application",
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
            "cap.electronic_components.identify_application"
          ]
        },
        {
          "id": "transfer_identify_security_alarm_roles",
          "type": "transfer_application",
          "purpose": "Transfer to a two-component application: identify which component fulfils each of the two distinct, independent roles in a security-alarm circuit (break-detection versus latching) -- never both at once from a single answer.",
          "requirement": "required",
          "teaches": [],
          "reinforces": [],
          "tests": [
            "EL-APPLICATION-SECURITY-ALARM-TRANSISTOR-THYRISTOR-001"
          ],
          "assertionFamilyId": "electrical.electronic_components",
          "capabilityIds": [
            "cap.electronic_components.identify_application"
          ],
          "misconceptionTargets": [],
          "representation": {},
          "questionBlueprintId": "electronics.identify_application",
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
            "cap.electronic_components.identify_application"
          ]
        },
        {
          "id": "retrieval_check",
          "type": "retrieval_check",
          "purpose": "Short delayed retrieval of the DIAC/TRIAC/thyristor/transistor switching-family recognition to strengthen retention before the lesson ends.",
          "requirement": "required",
          "teaches": [],
          "reinforces": [],
          "tests": [
            "EL-COMPONENT-DIAC-001",
            "EL-COMPONENT-THYRISTOR-SCR-001",
            "EL-COMPONENT-TRIAC-001",
            "EL-COMPONENT-TRANSISTOR-001"
          ],
          "assertionFamilyId": "electrical.electronic_components",
          "capabilityIds": [
            "cap.electronic_components.recognise_principle"
          ],
          "misconceptionTargets": [],
          "representation": {},
          "questionBlueprintId": "electronics.recognise_switching_family",
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
            "cap.electronic_components.recognise_principle"
          ]
        },
        {
          "id": "recap",
          "type": "recap",
          "purpose": "Summarise thermistors (NTC/PTC), the DIAC/TRIAC/thyristor/transistor switching family, and their four applications (dimmer switch, motor control, heating/boiler control, security alarm).",
          "requirement": "required",
          "teaches": [],
          "reinforces": [
            "EL-COMPONENT-THERMISTOR-001",
            "EL-COMPONENT-THYRISTOR-SCR-001",
            "EL-COMPONENT-TRIAC-001",
            "EL-COMPONENT-TRANSISTOR-001"
          ],
          "tests": [],
          "assertionFamilyId": "electrical.electronic_components",
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
        "electrical.electronic_components",
        "electrical.ac_dc_waveforms"
      ],
      "completionCriteria": {
        "requiredStepIds": [
          "orientation",
          "concept_thermistors",
          "guided_recognise_thermistor_type",
          "independent_identify_heating_application",
          "concept_switching_family",
          "independent_recognise_switching_family",
          "concept_switching_applications",
          "independent_identify_dimmer_and_motor_application",
          "transfer_identify_security_alarm_roles",
          "retrieval_check",
          "recap",
          "exit_completion"
        ],
        "requiredCapabilityEvidence": [
          "cap.electronic_components.recognise_principle",
          "cap.electronic_components.identify_application"
        ],
        "masteryGateCapabilityIds": [
          "cap.electronic_components.recognise_principle",
          "cap.electronic_components.identify_application"
        ],
        "requiresRemediationClearance": true,
        "exitSummary": "The learner has distinguished NTC from PTC thermistors, recognised the DIAC/TRIAC/thyristor/transistor switching family, and identified the correct component for a dimmer switch, motor control, heating/boiler control and each of the two independent roles in a security-alarm circuit."
      },
      "presentationModes": [
        "learn",
        "review"
      ],
      "contentRelease": "release.unit202.v8"
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
      "contentRelease": "release.unit202.v8"
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
      "contentRelease": "release.unit202.v8"
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
      "contentRelease": "release.unit202.v8"
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
      "contentRelease": "release.unit202.v8"
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
      "contentRelease": "release.unit202.v8"
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
          "representation": {
            "diagramBlueprintId": "mechanical.resistivity_dimensions",
            "diagramParameters": {
              "comparison": "length"
            }
          },
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
          "representation": {
            "diagramBlueprintId": "mechanical.resistivity_dimensions",
            "diagramParameters": {
              "comparison": "area"
            }
          },
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
      "contentRelease": "release.unit202.v8"
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
      "contentRelease": "release.unit202.v8"
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
      "contentRelease": "release.unit202.v8"
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
      "contentRelease": "release.unit202.v8"
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
      "contentRelease": "release.unit202.v8"
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
      "contentRelease": "release.unit202.v8"
    },
    {
      "id": "lesson.emf.ac-generation-principles",
      "schemaVersion": 1,
      "version": 1,
      "title": "A.C. Generation Principles",
      "learnerFacingDescription": "Understand how a rotating single-loop generator produces alternating EMF, calculate the EMF induced by a changing magnetic flux, and compare the motor principle with the generator principle.",
      "curriculumUnit": "City & Guilds 2365-02 Unit 202 -- Principles of Electrical Science",
      "prerequisiteKnowledge": [
        "electrical.ohms_law",
        "electrical.magnetism_and_electromagnetism",
        "electrical.emf_and_generation"
      ],
      "targetAssertionFamilyIds": [
        "electrical.emf_and_generation",
        "electrical.magnetism_and_electromagnetism"
      ],
      "targetAssertionIdentifiers": [
        "EL-CONCEPT-ELECTROMAGNETIC-INDUCTION-001",
        "EL-CONCEPT-AC-GENERATOR-001",
        "EL-CONCEPT-SINE-WAVE-001",
        "EL-REL-FLUX-CHANGE-EMF-001",
        "EL-MOTOR-GENERATOR-COMPARE-001"
      ],
      "targetCapabilityIds": [
        "cap.emf.describe_ac_generation",
        "cap.emf.calculate_flux_change",
        "cap.magnetism.compare_motor_generator"
      ],
      "remediationEligibility": [],
      "estimatedDurationMinutes": 15,
      "instructionalStrategy": "Electromagnetic induction is introduced first as the single causal principle that explains generation (a changing flux induces an EMF), then the rotating-loop A.C. generator and its sine-wave output are taught as a direct consequence of that principle -- not a separate fact to memorise. The flux-change EMF calculation is practised immediately after as the quantitative form of the same causal principle. Motor-vs-generator comparison closes the lesson, deliberately positioned last so the learner has both principles (force-from-current from the previous lesson, EMF-from-changing-flux from this one) available to contrast.",
      "steps": [
        {
          "id": "orientation",
          "type": "orientation",
          "purpose": "Frame this lesson as answering the reverse question to the last one: instead of current producing force, how does a CHANGING field produce EMF -- the principle behind every generator.",
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
          "id": "concept_electromagnetic_induction_and_generator",
          "type": "concept_explanation",
          "purpose": "State that a changing magnetic flux induces an EMF (electromagnetic induction), and describe how a single loop rotating within a field uses this to produce an alternating, sine-wave EMF.",
          "requirement": "required",
          "teaches": [
            "EL-CONCEPT-ELECTROMAGNETIC-INDUCTION-001",
            "EL-CONCEPT-AC-GENERATOR-001",
            "EL-CONCEPT-SINE-WAVE-001"
          ],
          "reinforces": [
            "EL-CONCEPT-ELECTROMAGNETISM-001"
          ],
          "tests": [],
          "assertionFamilyId": "electrical.emf_and_generation",
          "capabilityIds": [],
          "misconceptionTargets": [],
          "representation": {
            "diagramBlueprintId": "generator.rotating_loop"
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
          "id": "guided_describe_ac_generation",
          "type": "guided_interaction",
          "purpose": "Describe the basic principle of a rotating-loop A.C. generator.",
          "requirement": "required",
          "teaches": [],
          "reinforces": [],
          "tests": [
            "EL-CONCEPT-AC-GENERATOR-001",
            "EL-CONCEPT-SINE-WAVE-001"
          ],
          "assertionFamilyId": "electrical.emf_and_generation",
          "capabilityIds": [
            "cap.emf.describe_ac_generation"
          ],
          "misconceptionTargets": [],
          "representation": {
            "diagramBlueprintId": "generator.rotating_loop"
          },
          "questionBlueprintId": "emf.describe_ac_generation",
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
            "cap.emf.describe_ac_generation"
          ]
        },
        {
          "id": "concept_flux_change_emf",
          "type": "concept_explanation",
          "purpose": "State the quantitative form of electromagnetic induction for a single loop: induced EMF equals the change in flux divided by the time taken.",
          "requirement": "required",
          "teaches": [
            "EL-REL-FLUX-CHANGE-EMF-001"
          ],
          "reinforces": [
            "EL-CONCEPT-ELECTROMAGNETIC-INDUCTION-001"
          ],
          "tests": [],
          "assertionFamilyId": "electrical.emf_and_generation",
          "capabilityIds": [],
          "misconceptionTargets": [],
          "representation": {
            "formulaFamilyId": "formula.flux_change_emf"
          },
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
          "id": "worked_flux_change_emf",
          "type": "worked_example",
          "purpose": "Model calculating the induced EMF from a changing magnetic flux, before the learner practises it unaided.",
          "requirement": "required",
          "teaches": [],
          "reinforces": [],
          "tests": [],
          "assertionFamilyId": "electrical.emf_and_generation",
          "capabilityIds": [
            "cap.emf.calculate_flux_change"
          ],
          "misconceptionTargets": [],
          "representation": {
            "formulaFamilyId": "formula.flux_change_emf",
            "workedExampleBlueprintId": "worked.emf.calculate_flux_change_e"
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
          "id": "guided_calculate_flux_change_emf",
          "type": "guided_interaction",
          "purpose": "First learner-performed flux-change EMF calculation.",
          "requirement": "required",
          "teaches": [],
          "reinforces": [],
          "tests": [
            "EL-REL-FLUX-CHANGE-EMF-001"
          ],
          "assertionFamilyId": "electrical.emf_and_generation",
          "capabilityIds": [
            "cap.emf.calculate_flux_change"
          ],
          "misconceptionTargets": [],
          "representation": {
            "formulaFamilyId": "formula.flux_change_emf"
          },
          "questionBlueprintId": "emf.calculate_flux_change",
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
            "cap.emf.calculate_flux_change"
          ]
        },
        {
          "id": "independent_calculate_flux_change_emf",
          "type": "independent_question",
          "purpose": "Unscaffolded flux-change EMF calculation, potentially solving for a different unknown than the guided attempt.",
          "requirement": "required",
          "teaches": [],
          "reinforces": [],
          "tests": [
            "EL-REL-FLUX-CHANGE-EMF-001"
          ],
          "assertionFamilyId": "electrical.emf_and_generation",
          "capabilityIds": [
            "cap.emf.calculate_flux_change"
          ],
          "misconceptionTargets": [],
          "representation": {
            "formulaFamilyId": "formula.flux_change_emf"
          },
          "questionBlueprintId": "emf.calculate_flux_change",
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
            "cap.emf.calculate_flux_change"
          ]
        },
        {
          "id": "concept_motor_vs_generator",
          "type": "concept_explanation",
          "purpose": "Compare the motor principle (current + field -> force) with the generator principle (changing flux -> EMF) just taught, as two directions of the same electromagnetic relationship.",
          "requirement": "required",
          "teaches": [
            "EL-MOTOR-GENERATOR-COMPARE-001"
          ],
          "reinforces": [
            "EL-CONCEPT-MOTOR-PRINCIPLE-001",
            "EL-CONCEPT-AC-GENERATOR-001"
          ],
          "tests": [],
          "assertionFamilyId": "electrical.magnetism_and_electromagnetism",
          "capabilityIds": [
            "cap.magnetism.compare_motor_generator"
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
          "cognitiveDemand": "advanced",
          "feedback": {
            "mode": "immediate",
            "explainWhy": false
          },
          "completionCondition": "view_acknowledged",
          "branchRoutes": [],
          "evidenceEmitted": []
        },
        {
          "id": "guided_compare_motor_generator",
          "type": "guided_interaction",
          "purpose": "Compare the motor principle with the generator principle.",
          "requirement": "required",
          "teaches": [],
          "reinforces": [],
          "tests": [
            "EL-MOTOR-GENERATOR-COMPARE-001"
          ],
          "assertionFamilyId": "electrical.magnetism_and_electromagnetism",
          "capabilityIds": [
            "cap.magnetism.compare_motor_generator"
          ],
          "misconceptionTargets": [
            {
              "misconceptionIdentifier": "MIS-EL-EMF-VOLTAGE-CONFUSION-001",
              "evidenceStrength": "suggestive"
            }
          ],
          "representation": {},
          "questionBlueprintId": "magnetism.compare_motor_generator",
          "presentation": {
            "interactionRequired": true,
            "interactionRole": "compare",
            "answerReveal": "after_submission",
            "contentMayScroll": false,
            "progressiveReveal": false
          },
          "scaffoldingLevel": "guided",
          "cognitiveDemand": "advanced",
          "feedback": {
            "mode": "immediate",
            "explainWhy": true
          },
          "completionCondition": "correct_answer_required",
          "branchRoutes": [],
          "evidenceEmitted": [
            "cap.magnetism.compare_motor_generator"
          ]
        },
        {
          "id": "retrieval_check",
          "type": "retrieval_check",
          "purpose": "Short delayed retrieval of the flux-change EMF calculation to strengthen retention before the lesson ends.",
          "requirement": "required",
          "teaches": [],
          "reinforces": [],
          "tests": [
            "EL-REL-FLUX-CHANGE-EMF-001"
          ],
          "assertionFamilyId": "electrical.emf_and_generation",
          "capabilityIds": [
            "cap.emf.calculate_flux_change"
          ],
          "misconceptionTargets": [],
          "representation": {
            "formulaFamilyId": "formula.flux_change_emf"
          },
          "questionBlueprintId": "emf.calculate_flux_change",
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
            "cap.emf.calculate_flux_change"
          ]
        },
        {
          "id": "recap",
          "type": "recap",
          "purpose": "Summarise electromagnetic induction, the A.C. generator's sine-wave output, the flux-change EMF calculation, and motor-vs-generator comparison.",
          "requirement": "required",
          "teaches": [],
          "reinforces": [
            "EL-CONCEPT-ELECTROMAGNETIC-INDUCTION-001",
            "EL-CONCEPT-AC-GENERATOR-001",
            "EL-REL-FLUX-CHANGE-EMF-001",
            "EL-MOTOR-GENERATOR-COMPARE-001"
          ],
          "tests": [],
          "assertionFamilyId": "electrical.emf_and_generation",
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
          "misconceptionIdentifier": "MIS-EL-EMF-VOLTAGE-CONFUSION-001",
          "evidenceStrength": "suggestive"
        }
      ],
      "retrievalTags": [
        "electrical.emf_and_generation",
        "formula.flux_change_emf",
        "electrical.magnetism_and_electromagnetism"
      ],
      "completionCriteria": {
        "requiredStepIds": [
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
          "exit_completion"
        ],
        "requiredCapabilityEvidence": [
          "cap.emf.describe_ac_generation",
          "cap.emf.calculate_flux_change",
          "cap.magnetism.compare_motor_generator"
        ],
        "masteryGateCapabilityIds": [
          "cap.emf.calculate_flux_change"
        ],
        "requiresRemediationClearance": true,
        "exitSummary": "The learner has described the rotating-loop A.C. generator principle, calculated the EMF induced by a changing magnetic flux, and compared the motor principle with the generator principle."
      },
      "presentationModes": [
        "learn",
        "review"
      ],
      "contentRelease": "release.unit202.v8"
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
      "contentRelease": "release.unit202.v8"
    },
    {
      "id": "lesson.foundation.physics.mass-and-weight",
      "schemaVersion": 1,
      "version": 1,
      "title": "Mass and Weight",
      "learnerFacingDescription": "Understand what mass and weight are, how they differ, and how weight relates to mass and gravitational field strength (W = m x g).",
      "curriculumUnit": "City & Guilds 2365-02 Unit 202 -- Principles of Electrical Science",
      "prerequisiteKnowledge": [],
      "targetAssertionFamilyIds": [
        "foundational.mass_weight"
      ],
      "targetAssertionIdentifiers": [
        "FP-CONCEPT-MASS-001",
        "FP-CONCEPT-WEIGHT-001",
        "FP-REL-WEIGHT-MASS-001"
      ],
      "targetCapabilityIds": [
        "cap.foundational.mass_weight.recognise"
      ],
      "remediationEligibility": [],
      "estimatedDurationMinutes": 8,
      "instructionalStrategy": "Mass and weight are taught as a genuinely distinct pair (amount of matter vs. the force of gravity acting on it), immediately connected by their governed relationship (W = m x g), then practised with the lesson's single recognition capability at guided, independent and retrieval scaffolding.",
      "steps": [
        {
          "id": "orientation",
          "type": "orientation",
          "purpose": "Frame why an electrician needs to distinguish mass from weight -- e.g. safe manual handling and lifting-equipment ratings depend on weight (a force in newtons), not mass alone.",
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
          "id": "concept_mass_and_weight",
          "type": "concept_explanation",
          "purpose": "Define mass (the amount of matter an object contains, in kilograms, unchanged by location) and weight (the force of gravity acting on that mass, in newtons, dependent on location), then state W = m x g.",
          "requirement": "required",
          "teaches": [
            "FP-CONCEPT-MASS-001",
            "FP-CONCEPT-WEIGHT-001",
            "FP-REL-WEIGHT-MASS-001"
          ],
          "reinforces": [],
          "tests": [],
          "assertionFamilyId": "foundational.mass_weight",
          "capabilityIds": [
            "cap.foundational.mass_weight.recognise"
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
          "id": "guided_recognise_mass_weight",
          "type": "guided_interaction",
          "purpose": "Recognise mass or weight from its definition, with immediate feedback.",
          "requirement": "required",
          "teaches": [],
          "reinforces": [
            "FP-CONCEPT-MASS-001",
            "FP-CONCEPT-WEIGHT-001"
          ],
          "tests": [
            "FP-CONCEPT-MASS-001",
            "FP-CONCEPT-WEIGHT-001",
            "FP-REL-WEIGHT-MASS-001"
          ],
          "assertionFamilyId": "foundational.mass_weight",
          "capabilityIds": [
            "cap.foundational.mass_weight.recognise"
          ],
          "misconceptionTargets": [],
          "representation": {},
          "questionBlueprintId": "mass_weight.recognise_relationship",
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
            "cap.foundational.mass_weight.recognise"
          ]
        },
        {
          "id": "independent_recognise_mass_weight",
          "type": "independent_question",
          "purpose": "Unscaffolded recognition of mass or weight from its definition.",
          "requirement": "required",
          "teaches": [],
          "reinforces": [],
          "tests": [
            "FP-CONCEPT-MASS-001",
            "FP-CONCEPT-WEIGHT-001",
            "FP-REL-WEIGHT-MASS-001"
          ],
          "assertionFamilyId": "foundational.mass_weight",
          "capabilityIds": [
            "cap.foundational.mass_weight.recognise"
          ],
          "misconceptionTargets": [],
          "representation": {},
          "questionBlueprintId": "mass_weight.recognise_relationship",
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
            "cap.foundational.mass_weight.recognise"
          ]
        },
        {
          "id": "retrieval_check",
          "type": "retrieval_check",
          "purpose": "Short delayed retrieval of the mass/weight distinction before the lesson ends.",
          "requirement": "required",
          "teaches": [],
          "reinforces": [],
          "tests": [
            "FP-CONCEPT-MASS-001",
            "FP-CONCEPT-WEIGHT-001",
            "FP-REL-WEIGHT-MASS-001"
          ],
          "assertionFamilyId": "foundational.mass_weight",
          "capabilityIds": [
            "cap.foundational.mass_weight.recognise"
          ],
          "misconceptionTargets": [],
          "representation": {},
          "questionBlueprintId": "mass_weight.recognise_relationship",
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
            "cap.foundational.mass_weight.recognise"
          ]
        },
        {
          "id": "recap",
          "type": "recap",
          "purpose": "Summarise the mass/weight distinction and W = m x g.",
          "requirement": "required",
          "teaches": [],
          "reinforces": [
            "FP-CONCEPT-MASS-001",
            "FP-CONCEPT-WEIGHT-001",
            "FP-REL-WEIGHT-MASS-001"
          ],
          "tests": [],
          "assertionFamilyId": "foundational.mass_weight",
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
        "foundational.mass_weight"
      ],
      "completionCriteria": {
        "requiredStepIds": [
          "orientation",
          "concept_mass_and_weight",
          "guided_recognise_mass_weight",
          "independent_recognise_mass_weight",
          "retrieval_check",
          "recap",
          "exit_completion"
        ],
        "requiredCapabilityEvidence": [
          "cap.foundational.mass_weight.recognise"
        ],
        "masteryGateCapabilityIds": [
          "cap.foundational.mass_weight.recognise"
        ],
        "requiresRemediationClearance": true,
        "exitSummary": "The learner has distinguished mass from weight and recognised their governed relationship (W = m x g)."
      },
      "presentationModes": [
        "learn",
        "review"
      ],
      "contentRelease": "release.unit202.v8"
    },
    {
      "id": "lesson.foundation.physics.mechanics-force-work-energy-power",
      "schemaVersion": 1,
      "version": 1,
      "title": "Mechanics: Force, Work, Energy, Power and Efficiency",
      "learnerFacingDescription": "Understand force, work, energy, power and efficiency as general mechanical principles, and calculate work done, kinetic energy, gravitational potential energy, power and efficiency.",
      "curriculumUnit": "City & Guilds 2365-02 Unit 202 -- Principles of Electrical Science",
      "prerequisiteKnowledge": [],
      "targetAssertionFamilyIds": [
        "foundational.mechanics_work_energy_power"
      ],
      "targetAssertionIdentifiers": [
        "FP-CONCEPT-FORCE-001",
        "FP-CONCEPT-WORK-001",
        "FP-REL-WORK-FORCE-DISTANCE-001",
        "FP-CALC-WORK-001",
        "FP-CONCEPT-ENERGY-001",
        "FP-CONCEPT-KINETIC-ENERGY-001",
        "FP-REL-KINETIC-ENERGY-001",
        "FP-CALC-KINETIC-ENERGY-001",
        "FP-CONCEPT-POTENTIAL-ENERGY-001",
        "FP-REL-POTENTIAL-ENERGY-001",
        "FP-CALC-POTENTIAL-ENERGY-001",
        "FP-CONCEPT-POWER-001",
        "FP-REL-POWER-WORK-TIME-001",
        "FP-CALC-POWER-001",
        "FP-CONCEPT-EFFICIENCY-001",
        "FP-CALC-EFFICIENCY-001"
      ],
      "targetCapabilityIds": [
        "cap.foundational.mechanics.recognise",
        "cap.foundational.mechanics.calculate"
      ],
      "remediationEligibility": [],
      "estimatedDurationMinutes": 24,
      "instructionalStrategy": "Concepts are taught first, in two steps (force/work/energy, then power/efficiency), then practised together as a single recognition capability -- then each of the five AC3.4 calculation forms is taught with its own worked example immediately followed by practice, closing with a transfer-application efficiency question that ties the whole family together (mirrors lesson-electrical-power.ts's own teach -> practise -> transfer structure).",
      "steps": [
        {
          "id": "orientation",
          "type": "orientation",
          "purpose": "Frame force, work, energy, power and efficiency as the general mechanics every electrician's later electrical-power/energy/efficiency work specialises.",
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
          "id": "concept_force_work_energy",
          "type": "concept_explanation",
          "purpose": "Describe force, work (W = F x d), energy in general, and its kinetic (KE = 1/2 m v^2) and gravitational potential (PE = m g h) forms.",
          "requirement": "required",
          "teaches": [
            "FP-CONCEPT-FORCE-001",
            "FP-CONCEPT-WORK-001",
            "FP-REL-WORK-FORCE-DISTANCE-001",
            "FP-CONCEPT-ENERGY-001",
            "FP-CONCEPT-KINETIC-ENERGY-001",
            "FP-REL-KINETIC-ENERGY-001",
            "FP-CONCEPT-POTENTIAL-ENERGY-001",
            "FP-REL-POTENTIAL-ENERGY-001"
          ],
          "reinforces": [],
          "tests": [],
          "assertionFamilyId": "foundational.mechanics_work_energy_power",
          "capabilityIds": [
            "cap.foundational.mechanics.recognise"
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
          "id": "concept_power_efficiency",
          "type": "concept_explanation",
          "purpose": "Describe power (P = W / t) as the rate of doing work, and efficiency as useful output over total input.",
          "requirement": "required",
          "teaches": [
            "FP-CONCEPT-POWER-001",
            "FP-REL-POWER-WORK-TIME-001",
            "FP-CONCEPT-EFFICIENCY-001"
          ],
          "reinforces": [
            "FP-CONCEPT-WORK-001",
            "FP-CONCEPT-ENERGY-001"
          ],
          "tests": [],
          "assertionFamilyId": "foundational.mechanics_work_energy_power",
          "capabilityIds": [
            "cap.foundational.mechanics.recognise"
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
          "id": "guided_recognise_mechanics_concept",
          "type": "guided_interaction",
          "purpose": "Recognise force, work, energy, power or efficiency from its definition, with immediate feedback.",
          "requirement": "required",
          "teaches": [],
          "reinforces": [
            "FP-CONCEPT-FORCE-001",
            "FP-CONCEPT-WORK-001",
            "FP-CONCEPT-ENERGY-001",
            "FP-CONCEPT-POWER-001",
            "FP-CONCEPT-EFFICIENCY-001"
          ],
          "tests": [
            "FP-CONCEPT-FORCE-001",
            "FP-CONCEPT-WORK-001",
            "FP-CONCEPT-ENERGY-001",
            "FP-CONCEPT-POWER-001",
            "FP-CONCEPT-EFFICIENCY-001"
          ],
          "assertionFamilyId": "foundational.mechanics_work_energy_power",
          "capabilityIds": [
            "cap.foundational.mechanics.recognise"
          ],
          "misconceptionTargets": [],
          "representation": {},
          "questionBlueprintId": "mechanics.recognise_concept",
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
            "cap.foundational.mechanics.recognise"
          ]
        },
        {
          "id": "worked_example_calculate_work",
          "type": "worked_example",
          "purpose": "Model W = F x d before asking the learner to calculate work done unaided.",
          "requirement": "required",
          "teaches": [],
          "reinforces": [],
          "tests": [],
          "assertionFamilyId": "foundational.mechanics_work_energy_power",
          "capabilityIds": [
            "cap.foundational.mechanics.calculate"
          ],
          "misconceptionTargets": [],
          "representation": {
            "formulaFamilyId": "formula.mechanics_work",
            "workedExampleBlueprintId": "worked.mechanics_work.calculate"
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
          "id": "guided_calculate_work",
          "type": "guided_interaction",
          "purpose": "First learner-performed work calculation (W = F x d).",
          "requirement": "required",
          "teaches": [],
          "reinforces": [],
          "tests": [
            "FP-REL-WORK-FORCE-DISTANCE-001",
            "FP-CALC-WORK-001"
          ],
          "assertionFamilyId": "foundational.mechanics_work_energy_power",
          "capabilityIds": [
            "cap.foundational.mechanics.calculate"
          ],
          "misconceptionTargets": [],
          "representation": {
            "formulaFamilyId": "formula.mechanics_work"
          },
          "questionBlueprintId": "mechanics.calculate_work",
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
            "cap.foundational.mechanics.calculate"
          ]
        },
        {
          "id": "worked_example_calculate_kinetic_energy",
          "type": "worked_example",
          "purpose": "Model KE = 1/2 m v^2 before the learner practises it.",
          "requirement": "required",
          "teaches": [],
          "reinforces": [],
          "tests": [],
          "assertionFamilyId": "foundational.mechanics_work_energy_power",
          "capabilityIds": [
            "cap.foundational.mechanics.calculate"
          ],
          "misconceptionTargets": [],
          "representation": {
            "formulaFamilyId": "formula.mechanics_kinetic_energy",
            "workedExampleBlueprintId": "worked.mechanics_kinetic_energy.calculate"
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
          "id": "independent_calculate_kinetic_energy",
          "type": "independent_question",
          "purpose": "Unscaffolded kinetic energy calculation.",
          "requirement": "required",
          "teaches": [],
          "reinforces": [],
          "tests": [
            "FP-REL-KINETIC-ENERGY-001",
            "FP-CALC-KINETIC-ENERGY-001"
          ],
          "assertionFamilyId": "foundational.mechanics_work_energy_power",
          "capabilityIds": [
            "cap.foundational.mechanics.calculate"
          ],
          "misconceptionTargets": [],
          "representation": {
            "formulaFamilyId": "formula.mechanics_kinetic_energy"
          },
          "questionBlueprintId": "mechanics.calculate_kinetic_energy",
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
            "cap.foundational.mechanics.calculate"
          ]
        },
        {
          "id": "worked_example_calculate_potential_energy",
          "type": "worked_example",
          "purpose": "Model GPE = m g h before the learner practises it.",
          "requirement": "required",
          "teaches": [],
          "reinforces": [],
          "tests": [],
          "assertionFamilyId": "foundational.mechanics_work_energy_power",
          "capabilityIds": [
            "cap.foundational.mechanics.calculate"
          ],
          "misconceptionTargets": [],
          "representation": {
            "formulaFamilyId": "formula.mechanics_potential_energy",
            "workedExampleBlueprintId": "worked.mechanics_potential_energy.calculate"
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
          "id": "independent_calculate_potential_energy",
          "type": "independent_question",
          "purpose": "Unscaffolded gravitational potential energy calculation.",
          "requirement": "required",
          "teaches": [],
          "reinforces": [],
          "tests": [
            "FP-REL-POTENTIAL-ENERGY-001",
            "FP-CALC-POTENTIAL-ENERGY-001"
          ],
          "assertionFamilyId": "foundational.mechanics_work_energy_power",
          "capabilityIds": [
            "cap.foundational.mechanics.calculate"
          ],
          "misconceptionTargets": [],
          "representation": {
            "formulaFamilyId": "formula.mechanics_potential_energy"
          },
          "questionBlueprintId": "mechanics.calculate_potential_energy",
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
            "cap.foundational.mechanics.calculate"
          ]
        },
        {
          "id": "worked_example_calculate_power",
          "type": "worked_example",
          "purpose": "Model P = W / t before the learner practises it.",
          "requirement": "required",
          "teaches": [],
          "reinforces": [],
          "tests": [],
          "assertionFamilyId": "foundational.mechanics_work_energy_power",
          "capabilityIds": [
            "cap.foundational.mechanics.calculate"
          ],
          "misconceptionTargets": [],
          "representation": {
            "formulaFamilyId": "formula.mechanics_power",
            "workedExampleBlueprintId": "worked.mechanics_power.calculate"
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
          "id": "independent_calculate_power",
          "type": "independent_question",
          "purpose": "Unscaffolded power calculation.",
          "requirement": "required",
          "teaches": [],
          "reinforces": [],
          "tests": [
            "FP-REL-POWER-WORK-TIME-001",
            "FP-CALC-POWER-001"
          ],
          "assertionFamilyId": "foundational.mechanics_work_energy_power",
          "capabilityIds": [
            "cap.foundational.mechanics.calculate"
          ],
          "misconceptionTargets": [],
          "representation": {
            "formulaFamilyId": "formula.mechanics_power"
          },
          "questionBlueprintId": "mechanics.calculate_power",
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
            "cap.foundational.mechanics.calculate"
          ]
        },
        {
          "id": "worked_example_calculate_efficiency",
          "type": "worked_example",
          "purpose": "Model efficiency as a percentage of useful output over total input before the learner practises it.",
          "requirement": "required",
          "teaches": [],
          "reinforces": [],
          "tests": [],
          "assertionFamilyId": "foundational.mechanics_work_energy_power",
          "capabilityIds": [
            "cap.foundational.mechanics.calculate"
          ],
          "misconceptionTargets": [],
          "representation": {
            "formulaFamilyId": "formula.mechanics_efficiency",
            "workedExampleBlueprintId": "worked.mechanics_efficiency.calculate"
          },
          "presentation": {
            "interactionRequired": true,
            "interactionRole": "predict",
            "answerReveal": "after_submission",
            "contentMayScroll": true,
            "progressiveReveal": true
          },
          "scaffoldingLevel": "guided",
          "cognitiveDemand": "advanced",
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
          "purpose": "Transfer to a full efficiency calculation, tying together the family's concept of useful output vs. total input introduced earlier in the lesson.",
          "requirement": "required",
          "teaches": [],
          "reinforces": [
            "FP-CONCEPT-EFFICIENCY-001"
          ],
          "tests": [
            "FP-CALC-EFFICIENCY-001"
          ],
          "assertionFamilyId": "foundational.mechanics_work_energy_power",
          "capabilityIds": [
            "cap.foundational.mechanics.calculate"
          ],
          "misconceptionTargets": [],
          "representation": {
            "formulaFamilyId": "formula.mechanics_efficiency"
          },
          "questionBlueprintId": "mechanics.calculate_efficiency",
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
            "cap.foundational.mechanics.calculate"
          ]
        },
        {
          "id": "retrieval_check",
          "type": "retrieval_check",
          "purpose": "Short delayed retrieval of the work calculation to strengthen retention before the lesson ends.",
          "requirement": "required",
          "teaches": [],
          "reinforces": [],
          "tests": [
            "FP-CALC-WORK-001"
          ],
          "assertionFamilyId": "foundational.mechanics_work_energy_power",
          "capabilityIds": [
            "cap.foundational.mechanics.calculate"
          ],
          "misconceptionTargets": [],
          "representation": {
            "formulaFamilyId": "formula.mechanics_work"
          },
          "questionBlueprintId": "mechanics.calculate_work",
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
            "cap.foundational.mechanics.calculate"
          ]
        },
        {
          "id": "recap",
          "type": "recap",
          "purpose": "Summarise force, work, energy (kinetic and potential), power and efficiency, and their five governed calculation forms.",
          "requirement": "required",
          "teaches": [],
          "reinforces": [
            "FP-CONCEPT-ENERGY-001",
            "FP-CONCEPT-POWER-001",
            "FP-CONCEPT-EFFICIENCY-001"
          ],
          "tests": [],
          "assertionFamilyId": "foundational.mechanics_work_energy_power",
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
        "foundational.mechanics_work_energy_power"
      ],
      "completionCriteria": {
        "requiredStepIds": [
          "orientation",
          "concept_force_work_energy",
          "concept_power_efficiency",
          "guided_recognise_mechanics_concept",
          "worked_example_calculate_work",
          "guided_calculate_work",
          "worked_example_calculate_kinetic_energy",
          "independent_calculate_kinetic_energy",
          "worked_example_calculate_potential_energy",
          "independent_calculate_potential_energy",
          "worked_example_calculate_power",
          "independent_calculate_power",
          "worked_example_calculate_efficiency",
          "transfer_calculate_efficiency",
          "retrieval_check",
          "recap",
          "exit_completion"
        ],
        "requiredCapabilityEvidence": [
          "cap.foundational.mechanics.recognise",
          "cap.foundational.mechanics.calculate"
        ],
        "masteryGateCapabilityIds": [
          "cap.foundational.mechanics.recognise",
          "cap.foundational.mechanics.calculate"
        ],
        "requiresRemediationClearance": true,
        "exitSummary": "The learner has recognised force, work, energy, power and efficiency, and calculated work done, kinetic energy, gravitational potential energy, power and efficiency."
      },
      "presentationModes": [
        "learn",
        "review"
      ],
      "contentRelease": "release.unit202.v8"
    },
    {
      "id": "lesson.foundation.physics.simple-machines",
      "schemaVersion": 1,
      "version": 1,
      "title": "Simple Machines: Levers, Gears and Pulleys",
      "learnerFacingDescription": "Understand how levers, gears and pulleys each provide mechanical advantage, identify lever classes, and calculate the effort or load in a balanced lever.",
      "curriculumUnit": "City & Guilds 2365-02 Unit 202 -- Principles of Electrical Science",
      "prerequisiteKnowledge": [],
      "targetAssertionFamilyIds": [
        "foundational.levers_mechanical_advantage"
      ],
      "targetAssertionIdentifiers": [
        "FP-CONCEPT-MECHANICAL-ADVANTAGE-001",
        "FP-CONCEPT-LEVER-PRINCIPLE-001",
        "FP-LEVER-CLASS-I-001",
        "FP-LEVER-CLASS-II-001",
        "FP-LEVER-CLASS-III-001",
        "FP-REL-LEVER-BALANCE-001",
        "FP-CONCEPT-GEAR-001",
        "FP-REL-GEAR-RATIO-001",
        "FP-CONCEPT-PULLEY-001",
        "FP-PULLEY-FIXED-VS-MOVABLE-001",
        "FP-REL-PULLEY-MECHANICAL-ADVANTAGE-001",
        "FP-REL-PULLEY-FORCE-DISTANCE-TRADEOFF-001"
      ],
      "targetCapabilityIds": [
        "cap.foundational.levers.recognise",
        "cap.foundational.levers.calculate",
        "cap.foundational.gears.recognise",
        "cap.foundational.pulleys.recognise"
      ],
      "remediationEligibility": [],
      "estimatedDurationMinutes": 16,
      "instructionalStrategy": "Levers are taught first and in most depth (three classes, then a worked moment-balance calculation before guided and independent practice), since they carry the family's only calculation capability. Gears and pulleys follow the same teach-then-practise pattern at recognition depth only, each ending with an independent question so all four capabilities are demonstrated unaided at least once, not only under guidance.",
      "steps": [
        {
          "id": "orientation",
          "type": "orientation",
          "purpose": "Frame mechanical advantage as the common idea behind levers, gears and pulleys -- getting more output force, torque or motion than the effort put in.",
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
          "id": "concept_levers",
          "type": "concept_explanation",
          "purpose": "Explain the lever principle (pivot, effort, load) and the three lever classes, distinguished by the relative arrangement of pivot/effort/load.",
          "requirement": "required",
          "teaches": [
            "FP-CONCEPT-MECHANICAL-ADVANTAGE-001",
            "FP-CONCEPT-LEVER-PRINCIPLE-001",
            "FP-LEVER-CLASS-I-001",
            "FP-LEVER-CLASS-II-001",
            "FP-LEVER-CLASS-III-001"
          ],
          "reinforces": [],
          "tests": [],
          "assertionFamilyId": "foundational.levers_mechanical_advantage",
          "capabilityIds": [
            "cap.foundational.levers.recognise"
          ],
          "misconceptionTargets": [],
          "representation": {
            "diagramBlueprintId": "mechanical.lever_arrangement"
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
          "id": "guided_identify_lever_class",
          "type": "guided_interaction",
          "purpose": "Identify a lever's class from the arrangement of pivot, effort and load, with immediate feedback.",
          "requirement": "required",
          "teaches": [],
          "reinforces": [
            "FP-CONCEPT-LEVER-PRINCIPLE-001"
          ],
          "tests": [
            "FP-CONCEPT-LEVER-PRINCIPLE-001",
            "FP-LEVER-CLASS-I-001",
            "FP-LEVER-CLASS-II-001",
            "FP-LEVER-CLASS-III-001"
          ],
          "assertionFamilyId": "foundational.levers_mechanical_advantage",
          "capabilityIds": [
            "cap.foundational.levers.recognise"
          ],
          "misconceptionTargets": [],
          "representation": {
            "diagramBlueprintId": "mechanical.lever_arrangement"
          },
          "questionBlueprintId": "levers.identify_class",
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
            "cap.foundational.levers.recognise"
          ]
        },
        {
          "id": "worked_example_lever_balance",
          "type": "worked_example",
          "purpose": "Model the moment-balance calculation (effort x effort-arm = load x load-arm) before asking the learner to do it unaided.",
          "requirement": "required",
          "teaches": [],
          "reinforces": [],
          "tests": [],
          "assertionFamilyId": "foundational.levers_mechanical_advantage",
          "capabilityIds": [
            "cap.foundational.levers.calculate"
          ],
          "misconceptionTargets": [],
          "representation": {
            "formulaFamilyId": "formula.lever_balance",
            "diagramBlueprintId": "mechanical.lever_arrangement",
            "workedExampleBlueprintId": "worked.lever_balance.calculate_effort",
            "diagramParameters": {
              "show_distances": true
            }
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
          "id": "guided_calculate_lever_balance",
          "type": "guided_interaction",
          "purpose": "First learner-performed lever moment-balance calculation.",
          "requirement": "required",
          "teaches": [],
          "reinforces": [],
          "tests": [
            "FP-REL-LEVER-BALANCE-001"
          ],
          "assertionFamilyId": "foundational.levers_mechanical_advantage",
          "capabilityIds": [
            "cap.foundational.levers.calculate"
          ],
          "misconceptionTargets": [],
          "representation": {
            "formulaFamilyId": "formula.lever_balance",
            "diagramBlueprintId": "mechanical.lever_arrangement",
            "diagramParameters": {
              "show_distances": true
            }
          },
          "questionBlueprintId": "levers.calculate_effort_or_load",
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
            "cap.foundational.levers.calculate"
          ]
        },
        {
          "id": "concept_gears",
          "type": "concept_explanation",
          "purpose": "Explain how meshed gears transmit rotary motion and torque, and that mechanical advantage is the ratio of driven to driving radius (or tooth count).",
          "requirement": "required",
          "teaches": [
            "FP-CONCEPT-GEAR-001",
            "FP-REL-GEAR-RATIO-001"
          ],
          "reinforces": [
            "FP-CONCEPT-MECHANICAL-ADVANTAGE-001"
          ],
          "tests": [],
          "assertionFamilyId": "foundational.levers_mechanical_advantage",
          "capabilityIds": [
            "cap.foundational.gears.recognise"
          ],
          "misconceptionTargets": [],
          "representation": {
            "diagramBlueprintId": "mechanical.gear_mesh"
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
          "id": "guided_recognise_gear_tradeoff",
          "type": "guided_interaction",
          "purpose": "Recognise whether a gear pair's arrangement increases output torque or output speed, with immediate feedback.",
          "requirement": "required",
          "teaches": [],
          "reinforces": [
            "FP-REL-GEAR-RATIO-001"
          ],
          "tests": [
            "FP-CONCEPT-GEAR-001",
            "FP-REL-GEAR-RATIO-001"
          ],
          "assertionFamilyId": "foundational.levers_mechanical_advantage",
          "capabilityIds": [
            "cap.foundational.gears.recognise"
          ],
          "misconceptionTargets": [],
          "representation": {
            "diagramBlueprintId": "mechanical.gear_mesh"
          },
          "questionBlueprintId": "gears.recognise_ratio_tradeoff",
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
            "cap.foundational.gears.recognise"
          ]
        },
        {
          "id": "independent_recognise_gear_tradeoff",
          "type": "independent_question",
          "purpose": "Unscaffolded gear torque/speed trade-off recognition.",
          "requirement": "required",
          "teaches": [],
          "reinforces": [],
          "tests": [
            "FP-CONCEPT-GEAR-001",
            "FP-REL-GEAR-RATIO-001"
          ],
          "assertionFamilyId": "foundational.levers_mechanical_advantage",
          "capabilityIds": [
            "cap.foundational.gears.recognise"
          ],
          "misconceptionTargets": [],
          "representation": {
            "diagramBlueprintId": "mechanical.gear_mesh"
          },
          "questionBlueprintId": "gears.recognise_ratio_tradeoff",
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
            "cap.foundational.gears.recognise"
          ]
        },
        {
          "id": "concept_pulleys",
          "type": "concept_explanation",
          "purpose": "Explain how a pulley changes the direction of an applied force and/or provides mechanical advantage, and the fixed-vs-movable distinction.",
          "requirement": "required",
          "teaches": [
            "FP-CONCEPT-PULLEY-001",
            "FP-PULLEY-FIXED-VS-MOVABLE-001",
            "FP-REL-PULLEY-MECHANICAL-ADVANTAGE-001"
          ],
          "reinforces": [
            "FP-CONCEPT-MECHANICAL-ADVANTAGE-001"
          ],
          "tests": [],
          "assertionFamilyId": "foundational.levers_mechanical_advantage",
          "capabilityIds": [
            "cap.foundational.pulleys.recognise"
          ],
          "misconceptionTargets": [],
          "representation": {
            "diagramBlueprintId": "mechanical.pulley_arrangement"
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
          "id": "independent_recognise_pulley_tradeoff",
          "type": "independent_question",
          "purpose": "Unscaffolded recognition of the pulley effort-force/distance trade-off.",
          "requirement": "required",
          "teaches": [],
          "reinforces": [],
          "tests": [
            "FP-CONCEPT-PULLEY-001",
            "FP-PULLEY-FIXED-VS-MOVABLE-001",
            "FP-REL-PULLEY-MECHANICAL-ADVANTAGE-001",
            "FP-REL-PULLEY-FORCE-DISTANCE-TRADEOFF-001"
          ],
          "assertionFamilyId": "foundational.levers_mechanical_advantage",
          "capabilityIds": [
            "cap.foundational.pulleys.recognise"
          ],
          "misconceptionTargets": [],
          "representation": {
            "diagramBlueprintId": "mechanical.pulley_arrangement"
          },
          "questionBlueprintId": "pulleys.recognise_force_distance_tradeoff",
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
            "cap.foundational.pulleys.recognise"
          ]
        },
        {
          "id": "independent_calculate_lever_balance",
          "type": "independent_question",
          "purpose": "Unscaffolded lever moment-balance calculation.",
          "requirement": "required",
          "teaches": [],
          "reinforces": [],
          "tests": [
            "FP-REL-LEVER-BALANCE-001"
          ],
          "assertionFamilyId": "foundational.levers_mechanical_advantage",
          "capabilityIds": [
            "cap.foundational.levers.calculate"
          ],
          "misconceptionTargets": [],
          "representation": {
            "formulaFamilyId": "formula.lever_balance",
            "diagramBlueprintId": "mechanical.lever_arrangement",
            "diagramParameters": {
              "show_distances": true
            }
          },
          "questionBlueprintId": "levers.calculate_effort_or_load",
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
            "cap.foundational.levers.calculate"
          ]
        },
        {
          "id": "retrieval_check",
          "type": "retrieval_check",
          "purpose": "Short delayed retrieval of lever class identification before the lesson ends.",
          "requirement": "required",
          "teaches": [],
          "reinforces": [],
          "tests": [
            "FP-LEVER-CLASS-I-001",
            "FP-LEVER-CLASS-II-001",
            "FP-LEVER-CLASS-III-001"
          ],
          "assertionFamilyId": "foundational.levers_mechanical_advantage",
          "capabilityIds": [
            "cap.foundational.levers.recognise"
          ],
          "misconceptionTargets": [],
          "representation": {
            "diagramBlueprintId": "mechanical.lever_arrangement"
          },
          "questionBlueprintId": "levers.identify_class",
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
            "cap.foundational.levers.recognise"
          ]
        },
        {
          "id": "recap",
          "type": "recap",
          "purpose": "Summarise how levers, gears and pulleys each provide mechanical advantage, and the lever moment-balance calculation.",
          "requirement": "required",
          "teaches": [],
          "reinforces": [
            "FP-CONCEPT-MECHANICAL-ADVANTAGE-001",
            "FP-REL-LEVER-BALANCE-001"
          ],
          "tests": [],
          "assertionFamilyId": "foundational.levers_mechanical_advantage",
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
        "foundational.levers_mechanical_advantage"
      ],
      "completionCriteria": {
        "requiredStepIds": [
          "orientation",
          "concept_levers",
          "guided_identify_lever_class",
          "worked_example_lever_balance",
          "guided_calculate_lever_balance",
          "concept_gears",
          "guided_recognise_gear_tradeoff",
          "independent_recognise_gear_tradeoff",
          "concept_pulleys",
          "independent_recognise_pulley_tradeoff",
          "independent_calculate_lever_balance",
          "retrieval_check",
          "recap",
          "exit_completion"
        ],
        "requiredCapabilityEvidence": [
          "cap.foundational.levers.recognise",
          "cap.foundational.levers.calculate",
          "cap.foundational.gears.recognise",
          "cap.foundational.pulleys.recognise"
        ],
        "masteryGateCapabilityIds": [
          "cap.foundational.levers.recognise",
          "cap.foundational.levers.calculate",
          "cap.foundational.gears.recognise",
          "cap.foundational.pulleys.recognise"
        ],
        "requiresRemediationClearance": true,
        "exitSummary": "The learner has identified lever classes, calculated the effort or load in a balanced lever, and recognised how gears and pulleys each provide mechanical advantage."
      },
      "presentationModes": [
        "learn",
        "review"
      ],
      "contentRelease": "release.unit202.v8"
    },
    {
      "id": "lesson.magnetism.effects-of-current",
      "schemaVersion": 1,
      "version": 1,
      "title": "Magnetic Effects of Current",
      "learnerFacingDescription": "Understand the magnetic field a current-carrying conductor produces and its direction, the force on a conductor in a field, electromagnetism, and the difference between EMF and terminal voltage.",
      "curriculumUnit": "City & Guilds 2365-02 Unit 202 -- Principles of Electrical Science",
      "prerequisiteKnowledge": [
        "electrical.ohms_law",
        "electrical.magnetism_and_electromagnetism"
      ],
      "targetAssertionFamilyIds": [
        "electrical.magnetism_and_electromagnetism",
        "electrical.emf_and_generation"
      ],
      "targetAssertionIdentifiers": [
        "EL-CONCEPT-MAGNETIC-FIELD-CURRENT-001",
        "EL-CONCEPT-FIELD-DIRECTION-RULE-001",
        "EL-CONCEPT-FORCE-ON-CONDUCTOR-001",
        "EL-REL-FORCE-ON-CONDUCTOR-001",
        "EL-CONCEPT-FLEMING-LEFT-HAND-001",
        "EL-CONCEPT-ELECTROMAGNETISM-001",
        "EL-CONCEPT-EMF-001",
        "EL-CONCEPT-TERMINAL-VOLTAGE-001",
        "EL-REL-INDUCED-EMF-001",
        "EL-CONCEPT-FLEMING-RIGHT-HAND-001"
      ],
      "targetCapabilityIds": [
        "cap.magnetism.interpret_field_direction",
        "cap.magnetism.interpret_force_direction",
        "cap.magnetism.calculate_force_on_conductor",
        "cap.magnetism.recognise_concept",
        "cap.emf.recognise_emf_terminal_voltage",
        "cap.emf.calculate_motional_emf"
      ],
      "remediationEligibility": [],
      "estimatedDurationMinutes": 18,
      "instructionalStrategy": "Field production and direction come first (the direct consequence of a current existing at all), then force on a conductor in a field (what that field, once produced, can DO -- the motor principle's foundation), then electromagnetism is named explicitly as the umbrella term for everything just covered. EMF vs. terminal voltage closes the lesson as a distinct, commonly-confused pair, checked directly against its governed misconception (MIS-EL-EMF-VOLTAGE-CONFUSION-001) with an explicit remediation route rather than assuming the distinction has landed.",
      "steps": [
        {
          "id": "orientation",
          "type": "orientation",
          "purpose": "Frame this lesson as answering: what does a current actually DO magnetically -- and why does that let us build motors and generators?",
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
          "id": "concept_field_from_current",
          "type": "concept_explanation",
          "purpose": "State that a current-carrying conductor produces a magnetic field, and how to find that field's direction (Maxwell's screw rule / right-hand grip rule).",
          "requirement": "required",
          "teaches": [
            "EL-CONCEPT-MAGNETIC-FIELD-CURRENT-001",
            "EL-CONCEPT-FIELD-DIRECTION-RULE-001"
          ],
          "reinforces": [],
          "tests": [],
          "assertionFamilyId": "electrical.magnetism_and_electromagnetism",
          "capabilityIds": [],
          "misconceptionTargets": [],
          "representation": {
            "diagramBlueprintId": "magnetic.field_conductor_direction"
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
          "id": "guided_interpret_field_direction",
          "type": "guided_interaction",
          "purpose": "Interpret the direction of the magnetic field produced by a current-carrying conductor from a diagram.",
          "requirement": "required",
          "teaches": [],
          "reinforces": [
            "EL-CONCEPT-FIELD-DIRECTION-RULE-001"
          ],
          "tests": [
            "EL-CONCEPT-MAGNETIC-FIELD-CURRENT-001"
          ],
          "assertionFamilyId": "electrical.magnetism_and_electromagnetism",
          "capabilityIds": [
            "cap.magnetism.interpret_field_direction"
          ],
          "misconceptionTargets": [],
          "representation": {
            "diagramBlueprintId": "magnetic.field_conductor_direction"
          },
          "questionBlueprintId": "magnetism.interpret_field_direction",
          "presentation": {
            "interactionRequired": true,
            "interactionRole": "interpret",
            "answerReveal": "after_submission",
            "contentMayScroll": false,
            "progressiveReveal": false
          },
          "scaffoldingLevel": "guided",
          "cognitiveDemand": "advanced",
          "feedback": {
            "mode": "immediate",
            "explainWhy": true
          },
          "completionCondition": "correct_answer_required",
          "branchRoutes": [],
          "evidenceEmitted": [
            "cap.magnetism.interpret_field_direction"
          ]
        },
        {
          "id": "concept_force_on_conductor",
          "type": "concept_explanation",
          "purpose": "Describe the force a current-carrying conductor experiences in a magnetic field (F = B I l) and its direction (Fleming's left-hand rule) -- the motor principle's foundation.",
          "requirement": "required",
          "teaches": [
            "EL-CONCEPT-FORCE-ON-CONDUCTOR-001",
            "EL-REL-FORCE-ON-CONDUCTOR-001",
            "EL-CONCEPT-FLEMING-LEFT-HAND-001"
          ],
          "reinforces": [
            "EL-CONCEPT-MAGNETIC-FIELD-CURRENT-001"
          ],
          "tests": [],
          "assertionFamilyId": "electrical.magnetism_and_electromagnetism",
          "capabilityIds": [],
          "misconceptionTargets": [],
          "representation": {
            "diagramBlueprintId": "motor.force_field_current"
          },
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
          "id": "worked_force_on_conductor",
          "type": "worked_example",
          "purpose": "Model calculating the force on a current-carrying conductor using F = B I l, before the learner practises it unaided.",
          "requirement": "required",
          "teaches": [],
          "reinforces": [],
          "tests": [],
          "assertionFamilyId": "electrical.magnetism_and_electromagnetism",
          "capabilityIds": [
            "cap.magnetism.calculate_force_on_conductor"
          ],
          "misconceptionTargets": [],
          "representation": {
            "formulaFamilyId": "formula.force_on_conductor",
            "workedExampleBlueprintId": "worked.force_on_conductor.calculate"
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
          "id": "guided_calculate_force_on_conductor",
          "type": "guided_interaction",
          "purpose": "Calculate the force on a straight current-carrying conductor at right angles to a magnetic field, using F = B I l.",
          "requirement": "required",
          "teaches": [],
          "reinforces": [],
          "tests": [
            "EL-REL-FORCE-ON-CONDUCTOR-001"
          ],
          "assertionFamilyId": "electrical.magnetism_and_electromagnetism",
          "capabilityIds": [
            "cap.magnetism.calculate_force_on_conductor"
          ],
          "misconceptionTargets": [],
          "representation": {
            "formulaFamilyId": "formula.force_on_conductor"
          },
          "questionBlueprintId": "magnetism.calculate_force_on_conductor",
          "presentation": {
            "interactionRequired": true,
            "interactionRole": "calculate",
            "answerReveal": "after_submission",
            "contentMayScroll": false,
            "progressiveReveal": false
          },
          "scaffoldingLevel": "guided",
          "cognitiveDemand": "advanced",
          "feedback": {
            "mode": "immediate",
            "explainWhy": true
          },
          "completionCondition": "correct_answer_required",
          "branchRoutes": [],
          "evidenceEmitted": [
            "cap.magnetism.calculate_force_on_conductor"
          ]
        },
        {
          "id": "guided_interpret_force_direction",
          "type": "guided_interaction",
          "purpose": "Interpret the direction of the force on a current-carrying conductor in a magnetic field from a diagram.",
          "requirement": "required",
          "teaches": [],
          "reinforces": [],
          "tests": [
            "EL-CONCEPT-FORCE-ON-CONDUCTOR-001"
          ],
          "assertionFamilyId": "electrical.magnetism_and_electromagnetism",
          "capabilityIds": [
            "cap.magnetism.interpret_force_direction"
          ],
          "misconceptionTargets": [
            {
              "misconceptionIdentifier": "MIS-EL-ELECTRON-CURRENT-DIRECTION-CONFUSION-001",
              "evidenceStrength": "suggestive"
            }
          ],
          "representation": {
            "diagramBlueprintId": "motor.force_field_current"
          },
          "questionBlueprintId": "magnetism.interpret_force_direction",
          "presentation": {
            "interactionRequired": true,
            "interactionRole": "interpret",
            "answerReveal": "after_submission",
            "contentMayScroll": false,
            "progressiveReveal": true
          },
          "scaffoldingLevel": "guided",
          "cognitiveDemand": "advanced",
          "feedback": {
            "mode": "immediate",
            "explainWhy": true
          },
          "completionCondition": "correct_answer_required",
          "branchRoutes": [
            {
              "trigger": "incorrect_answer",
              "destinationStepId": "diagnose_force_direction_error",
              "description": "Ambiguous wrong answer -- run a targeted diagnostic before assuming which cause, if any, applies (task brief §11)."
            }
          ],
          "evidenceEmitted": [
            "cap.magnetism.interpret_force_direction"
          ]
        },
        {
          "id": "diagnose_force_direction_error",
          "type": "misconception_discrimination",
          "purpose": "Discriminate whether an ambiguous wrong force-direction answer traces to current-convention confusion, before assuming it does or does not.",
          "requirement": "conditional_remediation_only",
          "teaches": [],
          "reinforces": [
            "EL-CONCEPT-FLEMING-LEFT-HAND-001"
          ],
          "tests": [],
          "assertionFamilyId": "electrical.magnetism_and_electromagnetism",
          "capabilityIds": [
            "cap.magnetism.interpret_force_direction"
          ],
          "misconceptionTargets": [
            {
              "misconceptionIdentifier": "MIS-EL-ELECTRON-CURRENT-DIRECTION-CONFUSION-001",
              "evidenceStrength": "direct"
            },
            {
              "misconceptionIdentifier": "MIS-EL-FLEMING-FINGER-ASSIGNMENT-CONFUSION-001",
              "evidenceStrength": "suggestive"
            }
          ],
          "representation": {},
          "questionBlueprintId": "magnetism.diagnose_current_convention",
          "presentation": {
            "interactionRequired": true,
            "interactionRole": "compare",
            "answerReveal": "after_submission",
            "contentMayScroll": false,
            "progressiveReveal": true
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
              "misconceptionIdentifier": "MIS-EL-ELECTRON-CURRENT-DIRECTION-CONFUSION-001",
              "destinationStepId": "remediation_current_convention",
              "description": "Current-convention confusion confirmed by a direct discriminating check -- reteach before rechecking."
            },
            {
              "trigger": "remediation_cleared",
              "destinationStepId": "recheck_force_direction",
              "description": "Current-convention hypothesis ruled out (answered correctly) -- proceed straight to the fresh recheck; the residual Fleming's-rule finger-assignment hypothesis is surfaced in this step's own deeper feedback layer, not asserted as confirmed evidence."
            }
          ],
          "evidenceEmitted": [
            "cap.magnetism.interpret_force_direction"
          ]
        },
        {
          "id": "remediation_current_convention",
          "type": "remediation",
          "purpose": "Reteach that Fleming's left-hand rule always uses conventional current, then require a fresh correct discrimination before rechecking force direction. Entered only via a branch route -- never part of the default linear path.",
          "requirement": "conditional_remediation_only",
          "teaches": [
            "EL-CONCEPT-FLEMING-LEFT-HAND-001"
          ],
          "reinforces": [],
          "tests": [],
          "assertionFamilyId": "electrical.magnetism_and_electromagnetism",
          "capabilityIds": [
            "cap.magnetism.interpret_force_direction"
          ],
          "misconceptionTargets": [
            {
              "misconceptionIdentifier": "MIS-EL-ELECTRON-CURRENT-DIRECTION-CONFUSION-001",
              "evidenceStrength": "direct"
            }
          ],
          "representation": {},
          "questionBlueprintId": "magnetism.diagnose_current_convention",
          "presentation": {
            "interactionRequired": true,
            "interactionRole": "compare",
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
              "destinationStepId": "recheck_force_direction",
              "description": "Remediation cleared -- proceed to the fresh recheck of force direction."
            }
          ],
          "evidenceEmitted": [
            "cap.magnetism.interpret_force_direction"
          ]
        },
        {
          "id": "recheck_force_direction",
          "type": "retrieval_check",
          "purpose": "Ask a fresh, equivalent force-direction question (never a repeat of the original) to check whether the weakness identified above has actually been repaired.",
          "requirement": "conditional_remediation_only",
          "teaches": [],
          "reinforces": [],
          "tests": [
            "EL-CONCEPT-FORCE-ON-CONDUCTOR-001"
          ],
          "assertionFamilyId": "electrical.magnetism_and_electromagnetism",
          "capabilityIds": [
            "cap.magnetism.interpret_force_direction"
          ],
          "misconceptionTargets": [],
          "representation": {
            "diagramBlueprintId": "motor.force_field_current"
          },
          "questionBlueprintId": "magnetism.interpret_force_direction",
          "presentation": {
            "interactionRequired": true,
            "interactionRole": "interpret",
            "answerReveal": "after_submission",
            "contentMayScroll": false,
            "progressiveReveal": true
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
            "cap.magnetism.interpret_force_direction"
          ]
        },
        {
          "id": "concept_electromagnetism",
          "type": "concept_explanation",
          "purpose": "Name electromagnetism as the umbrella relationship covering everything just seen: current produces a field, and a field exerts force on current.",
          "requirement": "required",
          "teaches": [
            "EL-CONCEPT-ELECTROMAGNETISM-001"
          ],
          "reinforces": [
            "EL-CONCEPT-MAGNETIC-FIELD-CURRENT-001",
            "EL-CONCEPT-FORCE-ON-CONDUCTOR-001"
          ],
          "tests": [],
          "assertionFamilyId": "electrical.magnetism_and_electromagnetism",
          "capabilityIds": [
            "cap.magnetism.recognise_concept"
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
          "id": "guided_recognise_electromagnetism",
          "type": "guided_interaction",
          "purpose": "Recognise electromagnetism from its definition.",
          "requirement": "required",
          "teaches": [],
          "reinforces": [],
          "tests": [
            "EL-CONCEPT-ELECTROMAGNETISM-001"
          ],
          "assertionFamilyId": "electrical.magnetism_and_electromagnetism",
          "capabilityIds": [
            "cap.magnetism.recognise_concept"
          ],
          "misconceptionTargets": [],
          "representation": {},
          "questionBlueprintId": "magnetism.recognise_concept",
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
            "cap.magnetism.recognise_concept"
          ]
        },
        {
          "id": "concept_emf_and_terminal_voltage",
          "type": "concept_explanation",
          "purpose": "Describe electromotive force (EMF) and distinguish it from terminal voltage, and introduce induced EMF (e = B l v via Fleming's right-hand rule) as the mechanism a moving conductor uses to generate it.",
          "requirement": "required",
          "teaches": [
            "EL-CONCEPT-EMF-001",
            "EL-CONCEPT-TERMINAL-VOLTAGE-001",
            "EL-REL-INDUCED-EMF-001",
            "EL-CONCEPT-FLEMING-RIGHT-HAND-001"
          ],
          "reinforces": [
            "EL-CONCEPT-ELECTROMAGNETISM-001"
          ],
          "tests": [],
          "assertionFamilyId": "electrical.emf_and_generation",
          "capabilityIds": [
            "cap.emf.recognise_emf_terminal_voltage"
          ],
          "misconceptionTargets": [],
          "representation": {
            "diagramBlueprintId": "emf.motional_emf_geometry"
          },
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
          "id": "worked_motional_emf",
          "type": "worked_example",
          "purpose": "Model calculating the EMF induced in a conductor moving through a magnetic field using e = B l v, before the learner practises it unaided.",
          "requirement": "required",
          "teaches": [],
          "reinforces": [],
          "tests": [],
          "assertionFamilyId": "electrical.emf_and_generation",
          "capabilityIds": [
            "cap.emf.calculate_motional_emf"
          ],
          "misconceptionTargets": [],
          "representation": {
            "formulaFamilyId": "formula.motional_emf",
            "diagramBlueprintId": "emf.motional_emf_geometry",
            "workedExampleBlueprintId": "worked.motional_emf.calculate"
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
          "id": "guided_calculate_motional_emf",
          "type": "guided_interaction",
          "purpose": "Calculate the EMF induced in a straight conductor moving through a magnetic field, using e = B l v.",
          "requirement": "required",
          "teaches": [],
          "reinforces": [],
          "tests": [
            "EL-REL-INDUCED-EMF-001"
          ],
          "assertionFamilyId": "electrical.emf_and_generation",
          "capabilityIds": [
            "cap.emf.calculate_motional_emf"
          ],
          "misconceptionTargets": [],
          "representation": {
            "formulaFamilyId": "formula.motional_emf",
            "diagramBlueprintId": "emf.motional_emf_geometry"
          },
          "questionBlueprintId": "emf.calculate_motional_emf",
          "presentation": {
            "interactionRequired": true,
            "interactionRole": "calculate",
            "answerReveal": "after_submission",
            "contentMayScroll": false,
            "progressiveReveal": false
          },
          "scaffoldingLevel": "guided",
          "cognitiveDemand": "advanced",
          "feedback": {
            "mode": "immediate",
            "explainWhy": true
          },
          "completionCondition": "correct_answer_required",
          "branchRoutes": [],
          "evidenceEmitted": [
            "cap.emf.calculate_motional_emf"
          ]
        },
        {
          "id": "misconception_check_emf_terminal_voltage",
          "type": "misconception_discrimination",
          "purpose": "Directly test for the specific, governed EMF/terminal-voltage confusion rather than assuming its absence.",
          "requirement": "required",
          "teaches": [],
          "reinforces": [],
          "tests": [
            "EL-CONCEPT-EMF-001",
            "EL-CONCEPT-TERMINAL-VOLTAGE-001"
          ],
          "assertionFamilyId": "electrical.emf_and_generation",
          "capabilityIds": [
            "cap.emf.recognise_emf_terminal_voltage"
          ],
          "misconceptionTargets": [
            {
              "misconceptionIdentifier": "MIS-EL-EMF-VOLTAGE-CONFUSION-001",
              "evidenceStrength": "direct"
            }
          ],
          "representation": {},
          "questionBlueprintId": "emf.distinguish_emf_terminal_voltage",
          "presentation": {
            "interactionRequired": true,
            "interactionRole": "compare",
            "answerReveal": "after_submission",
            "contentMayScroll": false,
            "progressiveReveal": false
          },
          "scaffoldingLevel": "standard",
          "cognitiveDemand": "advanced",
          "feedback": {
            "mode": "immediate",
            "explainWhy": true
          },
          "completionCondition": "correct_answer_required",
          "branchRoutes": [
            {
              "trigger": "misconception_detected",
              "misconceptionIdentifier": "MIS-EL-EMF-VOLTAGE-CONFUSION-001",
              "destinationStepId": "remediation_emf_terminal_voltage",
              "description": "Route to explicit EMF-vs-terminal-voltage remediation before continuing."
            }
          ],
          "evidenceEmitted": [
            "cap.emf.recognise_emf_terminal_voltage"
          ]
        },
        {
          "id": "remediation_emf_terminal_voltage",
          "type": "remediation",
          "purpose": "Reteach the EMF/terminal-voltage distinction, then require a fresh correct discrimination before returning to the main sequence. Entered only via a branch route -- never part of the default linear path.",
          "requirement": "conditional_remediation_only",
          "teaches": [
            "EL-CONCEPT-EMF-001",
            "EL-CONCEPT-TERMINAL-VOLTAGE-001"
          ],
          "reinforces": [],
          "tests": [
            "EL-CONCEPT-EMF-001",
            "EL-CONCEPT-TERMINAL-VOLTAGE-001"
          ],
          "assertionFamilyId": "electrical.emf_and_generation",
          "capabilityIds": [
            "cap.emf.recognise_emf_terminal_voltage"
          ],
          "misconceptionTargets": [
            {
              "misconceptionIdentifier": "MIS-EL-EMF-VOLTAGE-CONFUSION-001",
              "evidenceStrength": "direct"
            }
          ],
          "representation": {},
          "questionBlueprintId": "emf.distinguish_emf_terminal_voltage",
          "presentation": {
            "interactionRequired": true,
            "interactionRole": "compare",
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
              "destinationStepId": "retrieval_check",
              "description": "Remediation cleared -- resume the main sequence at the retrieval check."
            }
          ],
          "evidenceEmitted": [
            "cap.emf.recognise_emf_terminal_voltage"
          ]
        },
        {
          "id": "retrieval_check",
          "type": "retrieval_check",
          "purpose": "Short delayed retrieval of the EMF/terminal-voltage distinction to strengthen retention before the lesson ends.",
          "requirement": "required",
          "teaches": [],
          "reinforces": [],
          "tests": [
            "EL-CONCEPT-EMF-001",
            "EL-CONCEPT-TERMINAL-VOLTAGE-001"
          ],
          "assertionFamilyId": "electrical.emf_and_generation",
          "capabilityIds": [
            "cap.emf.recognise_emf_terminal_voltage"
          ],
          "misconceptionTargets": [],
          "representation": {},
          "questionBlueprintId": "emf.distinguish_emf_terminal_voltage",
          "presentation": {
            "interactionRequired": true,
            "interactionRole": "compare",
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
            "cap.emf.recognise_emf_terminal_voltage"
          ]
        },
        {
          "id": "recap",
          "type": "recap",
          "purpose": "Summarise field production/direction, force on a conductor, electromagnetism, and EMF vs. terminal voltage.",
          "requirement": "required",
          "teaches": [],
          "reinforces": [
            "EL-CONCEPT-MAGNETIC-FIELD-CURRENT-001",
            "EL-CONCEPT-FORCE-ON-CONDUCTOR-001",
            "EL-CONCEPT-ELECTROMAGNETISM-001",
            "EL-CONCEPT-EMF-001",
            "EL-CONCEPT-TERMINAL-VOLTAGE-001"
          ],
          "tests": [],
          "assertionFamilyId": "electrical.magnetism_and_electromagnetism",
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
          "misconceptionIdentifier": "MIS-EL-EMF-VOLTAGE-CONFUSION-001",
          "evidenceStrength": "direct"
        }
      ],
      "retrievalTags": [
        "electrical.magnetism_and_electromagnetism",
        "electrical.emf_and_generation"
      ],
      "completionCriteria": {
        "requiredStepIds": [
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
          "exit_completion"
        ],
        "requiredCapabilityEvidence": [
          "cap.magnetism.interpret_field_direction",
          "cap.magnetism.interpret_force_direction",
          "cap.magnetism.calculate_force_on_conductor",
          "cap.magnetism.recognise_concept",
          "cap.emf.recognise_emf_terminal_voltage",
          "cap.emf.calculate_motional_emf"
        ],
        "masteryGateCapabilityIds": [
          "cap.emf.recognise_emf_terminal_voltage"
        ],
        "requiresRemediationClearance": true,
        "exitSummary": "The learner has interpreted the direction of the magnetic field around a current-carrying conductor, calculated the force on a conductor in a field, recognised electromagnetism, calculated induced EMF from a moving conductor, and distinguished EMF from terminal voltage -- clearing remediation if that misconception was detected."
      },
      "presentationModes": [
        "learn",
        "review"
      ],
      "contentRelease": "release.unit202.v8"
    },
    {
      "id": "lesson.magnetism.fundamentals",
      "schemaVersion": 1,
      "version": 1,
      "title": "Magnetism Fundamentals",
      "learnerFacingDescription": "Understand magnetic attraction and repulsion, the difference between magnetic flux and flux density (and their SI units), and how a permanent magnet differs from an electromagnet.",
      "curriculumUnit": "City & Guilds 2365-02 Unit 202 -- Principles of Electrical Science",
      "prerequisiteKnowledge": [
        "electrical.ohms_law"
      ],
      "targetAssertionFamilyIds": [
        "electrical.magnetism_and_electromagnetism"
      ],
      "targetAssertionIdentifiers": [
        "EL-CONCEPT-MAGNETISM-001",
        "EL-CONCEPT-MAGNETIC-FLUX-001",
        "EL-UNIT-WEBER-001",
        "EL-CONCEPT-MAGNETIC-FLUX-DENSITY-001",
        "EL-UNIT-TESLA-001",
        "EL-MAGNETISM-COMPARE-PERMANENT-ELECTROMAGNET-001"
      ],
      "targetCapabilityIds": [
        "cap.magnetism.recognise_attraction_repulsion",
        "cap.magnetism.recognise_concept",
        "cap.magnetism.identify_unit",
        "cap.magnetism.compare_permanent_electromagnet"
      ],
      "remediationEligibility": [
        {
          "assertionFamilyId": "electrical.magnetism_and_electromagnetism",
          "isDefaultRemediation": true
        }
      ],
      "estimatedDurationMinutes": 16,
      "instructionalStrategy": "Attraction/repulsion is introduced first as the intuitive, everyday phenomenon underlying everything else in LO5. Flux and flux density are then taught as a deliberately paired distinction (what exists vs. how concentrated it is), immediately followed by their SI units so the quantity and its unit are never learned apart. Permanent magnet vs. electromagnet closes the lesson, explicitly reinforcing attraction/repulsion as the shared underlying mechanism and previewing that the NEXT lesson explains exactly how a current produces that magnetism.",
      "steps": [
        {
          "id": "orientation",
          "type": "orientation",
          "purpose": "Frame magnetism as the foundation for motors, generators and instruments the learner will meet throughout the rest of Unit 202.",
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
          "id": "concept_magnetism_attraction_repulsion",
          "type": "concept_explanation",
          "purpose": "Describe magnetic attraction and repulsion between poles as the basic behaviour all magnetism -- permanent or electromagnetic -- exhibits.",
          "requirement": "required",
          "teaches": [
            "EL-CONCEPT-MAGNETISM-001"
          ],
          "reinforces": [],
          "tests": [],
          "assertionFamilyId": "electrical.magnetism_and_electromagnetism",
          "capabilityIds": [
            "cap.magnetism.recognise_attraction_repulsion"
          ],
          "misconceptionTargets": [],
          "representation": {
            "diagramBlueprintId": "magnetic.pole_interaction"
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
          "id": "guided_recognise_attraction_repulsion",
          "type": "guided_interaction",
          "purpose": "Recognise magnetic attraction and repulsion between poles.",
          "requirement": "required",
          "teaches": [],
          "reinforces": [],
          "tests": [
            "EL-CONCEPT-MAGNETISM-001"
          ],
          "assertionFamilyId": "electrical.magnetism_and_electromagnetism",
          "capabilityIds": [
            "cap.magnetism.recognise_attraction_repulsion"
          ],
          "misconceptionTargets": [],
          "representation": {
            "diagramBlueprintId": "magnetic.pole_interaction"
          },
          "questionBlueprintId": "magnetism.recognise_attraction_repulsion",
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
          "completionCondition": "correct_answer_required",
          "branchRoutes": [],
          "evidenceEmitted": [
            "cap.magnetism.recognise_attraction_repulsion"
          ]
        },
        {
          "id": "concept_flux_and_flux_density",
          "type": "concept_explanation",
          "purpose": "Distinguish magnetic flux (the total magnetic field produced) from magnetic flux density (how concentrated that field is).",
          "requirement": "required",
          "teaches": [
            "EL-CONCEPT-MAGNETIC-FLUX-001",
            "EL-CONCEPT-MAGNETIC-FLUX-DENSITY-001"
          ],
          "reinforces": [],
          "tests": [],
          "assertionFamilyId": "electrical.magnetism_and_electromagnetism",
          "capabilityIds": [
            "cap.magnetism.recognise_concept"
          ],
          "misconceptionTargets": [],
          "representation": {
            "diagramBlueprintId": "magnetic.flux_field_lines",
            "diagramParameters": {
              "density_comparison": true
            }
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
          "id": "guided_recognise_flux_concepts",
          "type": "guided_interaction",
          "purpose": "Recognise magnetic flux or flux density from its definition.",
          "requirement": "required",
          "teaches": [],
          "reinforces": [],
          "tests": [
            "EL-CONCEPT-MAGNETIC-FLUX-001",
            "EL-CONCEPT-MAGNETIC-FLUX-DENSITY-001"
          ],
          "assertionFamilyId": "electrical.magnetism_and_electromagnetism",
          "capabilityIds": [
            "cap.magnetism.recognise_concept"
          ],
          "misconceptionTargets": [],
          "representation": {},
          "questionBlueprintId": "magnetism.recognise_concept",
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
            "cap.magnetism.recognise_concept"
          ]
        },
        {
          "id": "concept_flux_and_flux_density_units",
          "type": "concept_explanation",
          "purpose": "Name the SI units of magnetic flux (weber) and magnetic flux density (tesla), paired directly with the quantities they measure.",
          "requirement": "required",
          "teaches": [
            "EL-UNIT-WEBER-001",
            "EL-UNIT-TESLA-001"
          ],
          "reinforces": [
            "EL-CONCEPT-MAGNETIC-FLUX-001",
            "EL-CONCEPT-MAGNETIC-FLUX-DENSITY-001"
          ],
          "tests": [],
          "assertionFamilyId": "electrical.magnetism_and_electromagnetism",
          "capabilityIds": [
            "cap.magnetism.identify_unit"
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
          "id": "guided_identify_flux_density_unit",
          "type": "guided_interaction",
          "purpose": "Identify the SI unit of magnetic flux density among plausible related-unit distractors (weber, henry, farad).",
          "requirement": "required",
          "teaches": [],
          "reinforces": [],
          "tests": [
            "EL-UNIT-TESLA-001"
          ],
          "assertionFamilyId": "electrical.magnetism_and_electromagnetism",
          "capabilityIds": [
            "cap.magnetism.identify_unit"
          ],
          "misconceptionTargets": [],
          "representation": {},
          "questionBlueprintId": "magnetism.identify_flux_density_unit",
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
            "cap.magnetism.identify_unit"
          ]
        },
        {
          "id": "independent_identify_flux_unit",
          "type": "independent_question",
          "purpose": "Unscaffolded transfer: identify the SI unit of magnetic flux itself, using the same recognition skill just practised for flux density.",
          "requirement": "required",
          "teaches": [],
          "reinforces": [],
          "tests": [
            "EL-UNIT-WEBER-001"
          ],
          "assertionFamilyId": "electrical.magnetism_and_electromagnetism",
          "capabilityIds": [
            "cap.magnetism.identify_unit"
          ],
          "misconceptionTargets": [],
          "representation": {},
          "questionBlueprintId": "magnetism.identify_flux_unit",
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
            "cap.magnetism.identify_unit"
          ]
        },
        {
          "id": "concept_permanent_vs_electromagnet",
          "type": "concept_explanation",
          "purpose": "Compare a permanent magnet with an electromagnet, explicitly reinforcing that both exhibit the same attraction/repulsion behaviour.",
          "requirement": "required",
          "teaches": [
            "EL-MAGNETISM-COMPARE-PERMANENT-ELECTROMAGNET-001"
          ],
          "reinforces": [
            "EL-CONCEPT-MAGNETISM-001"
          ],
          "tests": [],
          "assertionFamilyId": "electrical.magnetism_and_electromagnetism",
          "capabilityIds": [
            "cap.magnetism.compare_permanent_electromagnet"
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
          "id": "guided_compare_permanent_electromagnet",
          "type": "guided_interaction",
          "purpose": "Compare a permanent magnet with an electromagnet.",
          "requirement": "required",
          "teaches": [],
          "reinforces": [
            "EL-CONCEPT-MAGNETISM-001"
          ],
          "tests": [
            "EL-MAGNETISM-COMPARE-PERMANENT-ELECTROMAGNET-001"
          ],
          "assertionFamilyId": "electrical.magnetism_and_electromagnetism",
          "capabilityIds": [
            "cap.magnetism.compare_permanent_electromagnet"
          ],
          "misconceptionTargets": [],
          "representation": {},
          "questionBlueprintId": "magnetism.compare_permanent_electromagnet",
          "presentation": {
            "interactionRequired": true,
            "interactionRole": "compare",
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
            "cap.magnetism.compare_permanent_electromagnet"
          ]
        },
        {
          "id": "retrieval_check",
          "type": "retrieval_check",
          "purpose": "Short delayed retrieval of flux/flux-density recognition to strengthen retention before the lesson ends.",
          "requirement": "required",
          "teaches": [],
          "reinforces": [],
          "tests": [
            "EL-CONCEPT-MAGNETIC-FLUX-001",
            "EL-CONCEPT-MAGNETIC-FLUX-DENSITY-001"
          ],
          "assertionFamilyId": "electrical.magnetism_and_electromagnetism",
          "capabilityIds": [
            "cap.magnetism.recognise_concept"
          ],
          "misconceptionTargets": [],
          "representation": {},
          "questionBlueprintId": "magnetism.recognise_concept",
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
            "cap.magnetism.recognise_concept"
          ]
        },
        {
          "id": "recap",
          "type": "recap",
          "purpose": "Summarise attraction/repulsion, the flux vs. flux-density distinction with their SI units, and permanent magnet vs. electromagnet.",
          "requirement": "required",
          "teaches": [],
          "reinforces": [
            "EL-CONCEPT-MAGNETISM-001",
            "EL-CONCEPT-MAGNETIC-FLUX-001",
            "EL-CONCEPT-MAGNETIC-FLUX-DENSITY-001",
            "EL-MAGNETISM-COMPARE-PERMANENT-ELECTROMAGNET-001"
          ],
          "tests": [],
          "assertionFamilyId": "electrical.magnetism_and_electromagnetism",
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
        "electrical.magnetism_and_electromagnetism"
      ],
      "completionCriteria": {
        "requiredStepIds": [
          "orientation",
          "concept_magnetism_attraction_repulsion",
          "guided_recognise_attraction_repulsion",
          "concept_flux_and_flux_density",
          "guided_recognise_flux_concepts",
          "concept_flux_and_flux_density_units",
          "guided_identify_flux_density_unit",
          "independent_identify_flux_unit",
          "concept_permanent_vs_electromagnet",
          "guided_compare_permanent_electromagnet",
          "retrieval_check",
          "recap",
          "exit_completion"
        ],
        "requiredCapabilityEvidence": [
          "cap.magnetism.recognise_attraction_repulsion",
          "cap.magnetism.recognise_concept",
          "cap.magnetism.identify_unit",
          "cap.magnetism.compare_permanent_electromagnet"
        ],
        "masteryGateCapabilityIds": [
          "cap.magnetism.recognise_concept",
          "cap.magnetism.identify_unit"
        ],
        "requiresRemediationClearance": true,
        "exitSummary": "The learner has described magnetic attraction and repulsion, distinguished magnetic flux from flux density with their SI units, and compared a permanent magnet with an electromagnet."
      },
      "presentationModes": [
        "learn",
        "review"
      ],
      "contentRelease": "release.unit202.v8"
    },
    {
      "id": "lesson.waveforms.ac-dc-and-sine-wave-quantities",
      "schemaVersion": 1,
      "version": 1,
      "title": "A.C./D.C. and Sine-Wave Quantities",
      "learnerFacingDescription": "Distinguish A.C. from D.C., identify sine-wave characteristics (periodic time, amplitude, peak-to-peak, RMS, average value, frequency) from a waveform, calculate RMS from peak and frequency from periodic time, and compare how components behave under A.C. versus D.C.",
      "curriculumUnit": "City & Guilds 2365-02 Unit 202 -- Principles of Electrical Science",
      "prerequisiteKnowledge": [
        "electrical.ohms_law",
        "electrical.magnetism_and_electromagnetism",
        "electrical.emf_and_generation"
      ],
      "targetAssertionFamilyIds": [
        "electrical.ac_dc_waveforms"
      ],
      "targetAssertionIdentifiers": [
        "EL-CONCEPT-AC-DC-DISTINCTION-001",
        "EL-CIRCUIT-AC-SUPPLY-RECOGNITION-001",
        "EL-CONCEPT-FREQUENCY-001",
        "EL-WAVEFORM-PERIODIC-TIME-001",
        "EL-WAVEFORM-AMPLITUDE-001",
        "EL-WAVEFORM-PEAK-TO-PEAK-001",
        "EL-WAVEFORM-RMS-001",
        "EL-WAVEFORM-AVERAGE-VALUE-001",
        "EL-WAVEFORM-AVERAGE-ZERO-INTERPRETATION-001",
        "EL-WAVEFORM-RMS-CALC-001",
        "EL-WAVEFORM-RMS-PEAK-RELATIONSHIP-001",
        "EL-WAVEFORM-FREQUENCY-CALC-001",
        "EL-WAVEFORM-FREQUENCY-PERIOD-RELATIONSHIP-001",
        "EL-CONCEPT-PEAK-VS-RMS-SUPPLY-INTERPRETATION-001",
        "EL-CIRCUIT-COMPARE-AC-DC-BEHAVIOUR-001"
      ],
      "targetCapabilityIds": [
        "cap.waveform.recognise_ac_dc",
        "cap.waveform.identify_characteristic",
        "cap.waveform.calculate_rms_peak",
        "cap.waveform.calculate_frequency_period",
        "cap.waveform.interpret_rated_value",
        "cap.waveform.compare_ac_dc_behaviour"
      ],
      "remediationEligibility": [],
      "estimatedDurationMinutes": 20,
      "instructionalStrategy": "A.C./D.C. distinction opens the lesson (the categorical distinction the rest of the lesson's quantities apply to). Sine-wave characteristics are taught as one connected set read off a single waveform diagram, then practised together with one recognition question before splitting into the two genuinely separate NUMERIC skills -- RMS/peak and frequency/period -- each given its own worked example before practice, mirroring lesson-electrical-power.ts's worked-example-before-calculation pattern. The peak-vs-RMS supply-rating interpretation is checked directly against its governed misconception (MIS-EL-PEAK-RMS-CONFUSION-001) with an explicit remediation route, since it is the single most examinable real-world confusion in this family. AC-vs-DC component behaviour closes the lesson as a transfer-application synthesis of everything before it.",
      "steps": [
        {
          "id": "orientation",
          "type": "orientation",
          "purpose": "Frame this lesson as answering: now that we know how A.C. is generated, how do we describe and measure it precisely?",
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
          "id": "concept_ac_dc_distinction",
          "type": "concept_explanation",
          "purpose": "Distinguish A.C. (alternating, reverses direction periodically) from D.C. (constant direction), and recognise an A.C. supply in context.",
          "requirement": "required",
          "teaches": [
            "EL-CONCEPT-AC-DC-DISTINCTION-001",
            "EL-CIRCUIT-AC-SUPPLY-RECOGNITION-001"
          ],
          "reinforces": [],
          "tests": [],
          "assertionFamilyId": "electrical.ac_dc_waveforms",
          "capabilityIds": [
            "cap.waveform.recognise_ac_dc"
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
          "id": "guided_recognise_ac_dc",
          "type": "guided_interaction",
          "purpose": "Distinguish A.C. from D.C. supply behaviour.",
          "requirement": "required",
          "teaches": [],
          "reinforces": [],
          "tests": [
            "EL-CONCEPT-AC-DC-DISTINCTION-001",
            "EL-CIRCUIT-AC-SUPPLY-RECOGNITION-001"
          ],
          "assertionFamilyId": "electrical.ac_dc_waveforms",
          "capabilityIds": [
            "cap.waveform.recognise_ac_dc"
          ],
          "misconceptionTargets": [
            {
              "misconceptionIdentifier": "MIS-EL-AC-DC-CONFUSION-001",
              "evidenceStrength": "suggestive"
            }
          ],
          "representation": {},
          "questionBlueprintId": "waveform.recognise_ac_dc",
          "presentation": {
            "interactionRequired": true,
            "interactionRole": "compare",
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
            "cap.waveform.recognise_ac_dc"
          ]
        },
        {
          "id": "concept_sine_wave_characteristics",
          "type": "concept_explanation",
          "purpose": "Define frequency, periodic time, amplitude, peak-to-peak value, RMS value and average value, read together from one sine-wave diagram.",
          "requirement": "required",
          "teaches": [
            "EL-CONCEPT-FREQUENCY-001",
            "EL-WAVEFORM-PERIODIC-TIME-001",
            "EL-WAVEFORM-AMPLITUDE-001",
            "EL-WAVEFORM-PEAK-TO-PEAK-001",
            "EL-WAVEFORM-RMS-001",
            "EL-WAVEFORM-AVERAGE-VALUE-001",
            "EL-WAVEFORM-AVERAGE-ZERO-INTERPRETATION-001"
          ],
          "reinforces": [
            "EL-CONCEPT-AC-DC-DISTINCTION-001"
          ],
          "tests": [],
          "assertionFamilyId": "electrical.ac_dc_waveforms",
          "capabilityIds": [],
          "misconceptionTargets": [],
          "representation": {
            "diagramBlueprintId": "graph.waveform_sine"
          },
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
          "id": "guided_identify_characteristic",
          "type": "guided_interaction",
          "purpose": "Identify a named sine-wave characteristic from a waveform diagram.",
          "requirement": "required",
          "teaches": [],
          "reinforces": [],
          "tests": [
            "EL-WAVEFORM-PERIODIC-TIME-001",
            "EL-WAVEFORM-AMPLITUDE-001",
            "EL-WAVEFORM-PEAK-TO-PEAK-001",
            "EL-WAVEFORM-RMS-001",
            "EL-WAVEFORM-AVERAGE-VALUE-001",
            "EL-WAVEFORM-AVERAGE-ZERO-INTERPRETATION-001"
          ],
          "assertionFamilyId": "electrical.ac_dc_waveforms",
          "capabilityIds": [
            "cap.waveform.identify_characteristic"
          ],
          "misconceptionTargets": [],
          "representation": {
            "diagramBlueprintId": "graph.waveform_sine"
          },
          "questionBlueprintId": "waveform.identify_characteristic",
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
            "cap.waveform.identify_characteristic"
          ]
        },
        {
          "id": "worked_example_calculate_rms",
          "type": "worked_example",
          "purpose": "Model calculating RMS value from peak value before the learner practises it.",
          "requirement": "required",
          "teaches": [],
          "reinforces": [],
          "tests": [],
          "assertionFamilyId": "electrical.ac_dc_waveforms",
          "capabilityIds": [
            "cap.waveform.calculate_rms_peak"
          ],
          "misconceptionTargets": [],
          "representation": {
            "formulaFamilyId": "formula.ac_waveform_relationships",
            "workedExampleBlueprintId": "worked.waveform.calculate_rms"
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
          "id": "guided_calculate_rms_from_peak",
          "type": "guided_interaction",
          "purpose": "Calculate RMS value from peak value, or peak value from RMS value.",
          "requirement": "required",
          "teaches": [],
          "reinforces": [],
          "tests": [
            "EL-WAVEFORM-RMS-CALC-001",
            "EL-WAVEFORM-RMS-PEAK-RELATIONSHIP-001"
          ],
          "assertionFamilyId": "electrical.ac_dc_waveforms",
          "capabilityIds": [
            "cap.waveform.calculate_rms_peak"
          ],
          "misconceptionTargets": [],
          "representation": {
            "formulaFamilyId": "formula.ac_waveform_relationships"
          },
          "questionBlueprintId": "waveform.calculate_rms_from_peak",
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
            "cap.waveform.calculate_rms_peak"
          ]
        },
        {
          "id": "worked_example_calculate_frequency",
          "type": "worked_example",
          "purpose": "Model calculating frequency from periodic time before the learner practises it.",
          "requirement": "required",
          "teaches": [],
          "reinforces": [],
          "tests": [],
          "assertionFamilyId": "electrical.ac_dc_waveforms",
          "capabilityIds": [
            "cap.waveform.calculate_frequency_period"
          ],
          "misconceptionTargets": [],
          "representation": {
            "formulaFamilyId": "formula.ac_waveform_relationships",
            "workedExampleBlueprintId": "worked.waveform.calculate_frequency"
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
          "id": "independent_calculate_frequency_from_period",
          "type": "independent_question",
          "purpose": "Unscaffolded calculation of frequency from periodic time, or periodic time from frequency.",
          "requirement": "required",
          "teaches": [],
          "reinforces": [],
          "tests": [
            "EL-WAVEFORM-FREQUENCY-CALC-001",
            "EL-WAVEFORM-FREQUENCY-PERIOD-RELATIONSHIP-001"
          ],
          "assertionFamilyId": "electrical.ac_dc_waveforms",
          "capabilityIds": [
            "cap.waveform.calculate_frequency_period"
          ],
          "misconceptionTargets": [],
          "representation": {
            "formulaFamilyId": "formula.ac_waveform_relationships"
          },
          "questionBlueprintId": "waveform.calculate_frequency_from_period",
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
            "cap.waveform.calculate_frequency_period"
          ]
        },
        {
          "id": "misconception_check_rated_value",
          "type": "misconception_discrimination",
          "purpose": "Directly test for the specific, governed peak-vs-RMS confusion in quoted A.C. supply ratings (e.g. 230 V) rather than assuming its absence.",
          "requirement": "required",
          "teaches": [],
          "reinforces": [],
          "tests": [
            "EL-CONCEPT-PEAK-VS-RMS-SUPPLY-INTERPRETATION-001"
          ],
          "assertionFamilyId": "electrical.ac_dc_waveforms",
          "capabilityIds": [
            "cap.waveform.interpret_rated_value"
          ],
          "misconceptionTargets": [
            {
              "misconceptionIdentifier": "MIS-EL-PEAK-RMS-CONFUSION-001",
              "evidenceStrength": "direct"
            }
          ],
          "representation": {},
          "questionBlueprintId": "waveform.interpret_rated_value",
          "presentation": {
            "interactionRequired": true,
            "interactionRole": "interpret",
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
              "misconceptionIdentifier": "MIS-EL-PEAK-RMS-CONFUSION-001",
              "destinationStepId": "remediation_peak_rms",
              "description": "Route to explicit peak-vs-RMS remediation before continuing."
            }
          ],
          "evidenceEmitted": [
            "cap.waveform.interpret_rated_value"
          ]
        },
        {
          "id": "remediation_peak_rms",
          "type": "remediation",
          "purpose": "Reteach the RMS/peak relationship using the formula representation again, then require a fresh correct interpretation before returning to the main sequence. Entered only via a branch route -- never part of the default linear path.",
          "requirement": "conditional_remediation_only",
          "teaches": [
            "EL-WAVEFORM-RMS-PEAK-RELATIONSHIP-001"
          ],
          "reinforces": [],
          "tests": [
            "EL-CONCEPT-PEAK-VS-RMS-SUPPLY-INTERPRETATION-001"
          ],
          "assertionFamilyId": "electrical.ac_dc_waveforms",
          "capabilityIds": [
            "cap.waveform.interpret_rated_value"
          ],
          "misconceptionTargets": [
            {
              "misconceptionIdentifier": "MIS-EL-PEAK-RMS-CONFUSION-001",
              "evidenceStrength": "direct"
            }
          ],
          "representation": {
            "formulaFamilyId": "formula.ac_waveform_relationships"
          },
          "questionBlueprintId": "waveform.interpret_rated_value",
          "presentation": {
            "interactionRequired": true,
            "interactionRole": "interpret",
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
              "destinationStepId": "transfer_compare_ac_dc_behaviour",
              "description": "Remediation cleared -- resume the main sequence at the AC-vs-DC behaviour transfer step."
            }
          ],
          "evidenceEmitted": [
            "cap.waveform.interpret_rated_value"
          ]
        },
        {
          "id": "transfer_compare_ac_dc_behaviour",
          "type": "transfer_application",
          "purpose": "Transfer everything covered so far: compare how a resistor, inductor and capacitor behave under A.C. versus D.C. supply.",
          "requirement": "required",
          "teaches": [],
          "reinforces": [
            "EL-CONCEPT-AC-DC-DISTINCTION-001"
          ],
          "tests": [
            "EL-CIRCUIT-COMPARE-AC-DC-BEHAVIOUR-001"
          ],
          "assertionFamilyId": "electrical.ac_dc_waveforms",
          "capabilityIds": [
            "cap.waveform.compare_ac_dc_behaviour"
          ],
          "misconceptionTargets": [],
          "representation": {},
          "questionBlueprintId": "waveform.compare_ac_dc_behaviour",
          "presentation": {
            "interactionRequired": true,
            "interactionRole": "compare",
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
            "cap.waveform.compare_ac_dc_behaviour"
          ]
        },
        {
          "id": "retrieval_check",
          "type": "retrieval_check",
          "purpose": "Short delayed retrieval of the RMS/peak calculation to strengthen retention before the lesson ends.",
          "requirement": "required",
          "teaches": [],
          "reinforces": [],
          "tests": [
            "EL-WAVEFORM-RMS-CALC-001"
          ],
          "assertionFamilyId": "electrical.ac_dc_waveforms",
          "capabilityIds": [
            "cap.waveform.calculate_rms_peak"
          ],
          "misconceptionTargets": [],
          "representation": {
            "formulaFamilyId": "formula.ac_waveform_relationships"
          },
          "questionBlueprintId": "waveform.calculate_rms_from_peak",
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
            "cap.waveform.calculate_rms_peak"
          ]
        },
        {
          "id": "recap",
          "type": "recap",
          "purpose": "Summarise A.C./D.C. distinction, the six sine-wave characteristics, RMS/peak and frequency/period calculations, and AC-vs-DC component behaviour.",
          "requirement": "required",
          "teaches": [],
          "reinforces": [
            "EL-CONCEPT-AC-DC-DISTINCTION-001",
            "EL-WAVEFORM-RMS-001",
            "EL-WAVEFORM-RMS-PEAK-RELATIONSHIP-001",
            "EL-WAVEFORM-FREQUENCY-PERIOD-RELATIONSHIP-001",
            "EL-CIRCUIT-COMPARE-AC-DC-BEHAVIOUR-001"
          ],
          "tests": [],
          "assertionFamilyId": "electrical.ac_dc_waveforms",
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
          "misconceptionIdentifier": "MIS-EL-AC-DC-CONFUSION-001",
          "evidenceStrength": "suggestive"
        },
        {
          "misconceptionIdentifier": "MIS-EL-PEAK-RMS-CONFUSION-001",
          "evidenceStrength": "direct"
        }
      ],
      "retrievalTags": [
        "electrical.ac_dc_waveforms",
        "formula.ac_waveform_relationships"
      ],
      "completionCriteria": {
        "requiredStepIds": [
          "orientation",
          "concept_ac_dc_distinction",
          "guided_recognise_ac_dc",
          "concept_sine_wave_characteristics",
          "guided_identify_characteristic",
          "worked_example_calculate_rms",
          "guided_calculate_rms_from_peak",
          "worked_example_calculate_frequency",
          "independent_calculate_frequency_from_period",
          "misconception_check_rated_value",
          "transfer_compare_ac_dc_behaviour",
          "retrieval_check",
          "recap",
          "exit_completion"
        ],
        "requiredCapabilityEvidence": [
          "cap.waveform.recognise_ac_dc",
          "cap.waveform.identify_characteristic",
          "cap.waveform.calculate_rms_peak",
          "cap.waveform.calculate_frequency_period",
          "cap.waveform.interpret_rated_value",
          "cap.waveform.compare_ac_dc_behaviour"
        ],
        "masteryGateCapabilityIds": [
          "cap.waveform.calculate_rms_peak",
          "cap.waveform.calculate_frequency_period",
          "cap.waveform.compare_ac_dc_behaviour"
        ],
        "requiresRemediationClearance": true,
        "exitSummary": "The learner has distinguished A.C. from D.C., identified the six sine-wave characteristics from a waveform, calculated RMS from peak and frequency from periodic time, correctly interpreted a quoted A.C. supply rating -- clearing remediation if the peak/RMS misconception was detected -- and compared component behaviour under A.C. versus D.C."
      },
      "presentationModes": [
        "learn",
        "review"
      ],
      "contentRelease": "release.unit202.v8"
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
          "EL-MATERIAL-CONDUCTOR-INSULATOR-EXAMPLES-001",
          "EL-CONCEPT-CONDUCTOR-001",
          "EL-CONCEPT-INSULATOR-001"
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
      "id": "conductors.recognise_electron_theory",
      "assertionFamilyId": "electrical.conductors_and_insulators",
      "capabilityId": "cap.conductors.recognise_electron_theory",
      "title": "Recognise electron theory of current in a metallic conductor",
      "representation": {},
      "variantDimensions": {},
      "parameterGenerators": [],
      "answer": {
        "type": "multiple_choice",
        "options": [
          "free_electrons",
          "protons"
        ]
      },
      "marking": {
        "type": "exact"
      },
      "evidence": {
        "primaryCapabilityId": "cap.conductors.recognise_electron_theory",
        "familyId": "electrical.conductors_and_insulators",
        "assertionIdentifiers": [
          "EL-CONCEPT-ELECTRON-THEORY-001",
          "EL-CONCEPT-ATOMIC-CHARGE-STRUCTURE-001"
        ],
        "supportingCapabilityIds": [],
        "representationDependency": [],
        "misconceptionTargets": []
      },
      "difficultyBand": "introductory",
      "presentation": {
        "promptLines": [
          "In a metallic conductor, a potential difference is applied across it.",
          "What actually moves through the conductor to create the electric current?"
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
      "id": "electronics.identify_application",
      "assertionFamilyId": "electrical.electronic_components",
      "capabilityId": "cap.electronic_components.identify_application",
      "title": "Identify which electronic component is used for a described electrical-system application",
      "representation": {},
      "variantDimensions": {},
      "parameterGenerators": [],
      "answer": {
        "type": "multiple_choice",
        "options": [
          "triac",
          "thyristor_scr",
          "thermistor",
          "transistor",
          "capacitor",
          "resistor"
        ]
      },
      "marking": {
        "type": "exact"
      },
      "evidence": {
        "primaryCapabilityId": "cap.electronic_components.identify_application",
        "familyId": "electrical.electronic_components",
        "assertionIdentifiers": [
          "EL-APPLICATION-DIMMER-SWITCH-001",
          "EL-APPLICATION-MOTOR-CONTROL-001",
          "EL-APPLICATION-HEATING-BOILER-CONTROL-001",
          "EL-APPLICATION-SECURITY-ALARM-TRANSISTOR-THYRISTOR-001",
          "EL-APPLICATION-TELEPHONE-MASTER-SOCKET-001"
        ],
        "supportingCapabilityIds": [],
        "representationDependency": [],
        "misconceptionTargets": []
      },
      "difficultyBand": "intermediate",
      "presentation": {
        "promptLines": [
          "{application_clue}"
        ],
        "answerOptionLabels": {
          "triac": "TRIAC",
          "thyristor_scr": "Thyristor (SCR)",
          "thermistor": "Thermistor",
          "transistor": "Transistor",
          "capacitor": "Capacitor",
          "resistor": "Resistor"
        }
      }
    },
    {
      "id": "electronics.recognise_capacitor_behaviour",
      "assertionFamilyId": "electrical.electronic_components",
      "capabilityId": "cap.electronic_components.recognise_principle",
      "title": "Recognise a capacitor's charge/discharge transient behaviour",
      "representation": {},
      "variantDimensions": {},
      "parameterGenerators": [],
      "answer": {
        "type": "multiple_choice",
        "options": [
          "gradual_exponential_change",
          "instant_step_change"
        ]
      },
      "marking": {
        "type": "exact"
      },
      "evidence": {
        "primaryCapabilityId": "cap.electronic_components.recognise_principle",
        "familyId": "electrical.electronic_components",
        "assertionIdentifiers": [
          "EL-COMPONENT-CAPACITOR-TRANSIENT-001"
        ],
        "supportingCapabilityIds": [],
        "representationDependency": [],
        "misconceptionTargets": []
      },
      "difficultyBand": "introductory",
      "presentation": {
        "promptLines": [
          "A capacitor is {scenario} through a resistor in a circuit.",
          "How does the voltage across the capacitor change over time?"
        ],
        "answerOptionLabels": {
          "gradual_exponential_change": "Gradually, following an exponential curve (governed by the time constant tau = R x C)",
          "instant_step_change": "Instantly, as a sudden step change"
        }
      }
    },
    {
      "id": "electronics.recognise_diode_family",
      "assertionFamilyId": "electrical.electronic_components",
      "capabilityId": "cap.electronic_components.recognise_principle",
      "title": "Recognise a member of the diode family from its behaviour",
      "representation": {},
      "variantDimensions": {},
      "parameterGenerators": [],
      "answer": {
        "type": "multiple_choice",
        "options": [
          "diode",
          "zener_diode",
          "led",
          "photodiode"
        ]
      },
      "marking": {
        "type": "exact"
      },
      "evidence": {
        "primaryCapabilityId": "cap.electronic_components.recognise_principle",
        "familyId": "electrical.electronic_components",
        "assertionIdentifiers": [
          "EL-COMPONENT-DIODE-001",
          "EL-COMPONENT-ZENER-DIODE-001",
          "EL-COMPONENT-LED-001",
          "EL-COMPONENT-PHOTODIODE-001"
        ],
        "supportingCapabilityIds": [],
        "representationDependency": [],
        "misconceptionTargets": [
          {
            "misconceptionIdentifier": "MIS-EL-DIODE-DIRECTION-CONFUSION-001",
            "evidenceStrength": "suggestive"
          }
        ]
      },
      "difficultyBand": "intermediate",
      "presentation": {
        "promptLines": [
          "A component {diode_family_clue}.",
          "Which component is this?"
        ],
        "answerOptionLabels": {
          "diode": "Diode",
          "zener_diode": "Zener diode",
          "led": "LED (light-emitting diode)",
          "photodiode": "Photodiode"
        }
      }
    },
    {
      "id": "electronics.recognise_rectifier_type",
      "assertionFamilyId": "electrical.electronic_components",
      "capabilityId": "cap.electronic_components.recognise_principle",
      "title": "Distinguish half-wave rectification, full-wave rectification and the inverter",
      "representation": {},
      "variantDimensions": {},
      "parameterGenerators": [],
      "answer": {
        "type": "multiple_choice",
        "options": [
          "half_wave_rectifier",
          "full_wave_rectifier",
          "inverter"
        ]
      },
      "marking": {
        "type": "exact"
      },
      "evidence": {
        "primaryCapabilityId": "cap.electronic_components.recognise_principle",
        "familyId": "electrical.electronic_components",
        "assertionIdentifiers": [
          "EL-COMPONENT-RECTIFIER-001",
          "EL-COMPONENT-RECTIFIER-HALF-WAVE-001",
          "EL-COMPONENT-RECTIFIER-FULL-WAVE-001",
          "EL-COMPONENT-INVERTER-001"
        ],
        "supportingCapabilityIds": [],
        "representationDependency": [],
        "misconceptionTargets": []
      },
      "difficultyBand": "intermediate",
      "presentation": {
        "promptLines": [
          "A circuit {rectifier_type_clue}.",
          "Which of these does this describe?"
        ],
        "answerOptionLabels": {
          "half_wave_rectifier": "Half-wave rectifier",
          "full_wave_rectifier": "Full-wave bridge rectifier",
          "inverter": "Inverter"
        }
      }
    },
    {
      "id": "electronics.recognise_switching_family",
      "assertionFamilyId": "electrical.electronic_components",
      "capabilityId": "cap.electronic_components.recognise_principle",
      "title": "Recognise a DIAC, TRIAC, thyristor (SCR) or transistor from its behaviour",
      "representation": {},
      "variantDimensions": {},
      "parameterGenerators": [],
      "answer": {
        "type": "multiple_choice",
        "options": [
          "diac",
          "triac",
          "thyristor_scr",
          "transistor"
        ]
      },
      "marking": {
        "type": "exact"
      },
      "evidence": {
        "primaryCapabilityId": "cap.electronic_components.recognise_principle",
        "familyId": "electrical.electronic_components",
        "assertionIdentifiers": [
          "EL-COMPONENT-DIAC-001",
          "EL-COMPONENT-TRIAC-001",
          "EL-COMPONENT-THYRISTOR-SCR-001",
          "EL-COMPONENT-TRANSISTOR-001"
        ],
        "supportingCapabilityIds": [],
        "representationDependency": [],
        "misconceptionTargets": []
      },
      "difficultyBand": "advanced",
      "presentation": {
        "promptLines": [
          "A component {switching_family_clue}.",
          "Which component is this?"
        ],
        "answerOptionLabels": {
          "diac": "DIAC",
          "triac": "TRIAC",
          "thyristor_scr": "Thyristor (silicon-controlled rectifier, SCR)",
          "transistor": "Transistor"
        }
      }
    },
    {
      "id": "electronics.recognise_thermistor_type",
      "assertionFamilyId": "electrical.electronic_components",
      "capabilityId": "cap.electronic_components.recognise_principle",
      "title": "Distinguish an NTC thermistor from a PTC thermistor",
      "representation": {},
      "variantDimensions": {},
      "parameterGenerators": [],
      "answer": {
        "type": "multiple_choice",
        "options": [
          "ntc_thermistor",
          "ptc_thermistor"
        ]
      },
      "marking": {
        "type": "exact"
      },
      "evidence": {
        "primaryCapabilityId": "cap.electronic_components.recognise_principle",
        "familyId": "electrical.electronic_components",
        "assertionIdentifiers": [
          "EL-COMPONENT-THERMISTOR-001",
          "EL-COMPONENT-THERMISTOR-PTC-001"
        ],
        "supportingCapabilityIds": [],
        "representationDependency": [],
        "misconceptionTargets": []
      },
      "difficultyBand": "introductory",
      "presentation": {
        "promptLines": [
          "A thermistor is described as follows: {thermistor_type_clue}.",
          "Which type of thermistor is this?"
        ],
        "answerOptionLabels": {
          "ntc_thermistor": "NTC (negative-temperature-coefficient) thermistor",
          "ptc_thermistor": "PTC (positive-temperature-coefficient) thermistor"
        }
      }
    },
    {
      "id": "emf.calculate_flux_change",
      "assertionFamilyId": "electrical.emf_and_generation",
      "capabilityId": "cap.emf.calculate_flux_change",
      "title": "Calculate the EMF induced in a single loop from a changing magnetic flux",
      "representation": {
        "formula": {
          "required": true,
          "formulaFamilyId": "formula.flux_change_emf"
        }
      },
      "variantDimensions": {
        "target_variable": {
          "allowed": [
            "e",
            "deltaPhi",
            "deltaT"
          ]
        }
      },
      "parameterGenerators": [
        {
          "variable": "deltaPhi",
          "min": 1,
          "max": 20,
          "constraints": [
            "positive",
            "pedagogically_sensible"
          ]
        },
        {
          "variable": "deltaT",
          "min": 1,
          "max": 60,
          "constraints": [
            "positive",
            "pedagogically_sensible"
          ]
        }
      ],
      "answer": {
        "type": "quantity",
        "quantity": "emf",
        "canonicalUnit": "volt"
      },
      "marking": {
        "type": "numeric_tolerance",
        "tolerancePercent": 2
      },
      "evidence": {
        "primaryCapabilityId": "cap.emf.calculate_flux_change",
        "familyId": "electrical.emf_and_generation",
        "assertionIdentifiers": [
          "EL-REL-FLUX-CHANGE-EMF-001"
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
      "id": "emf.calculate_motional_emf",
      "assertionFamilyId": "electrical.emf_and_generation",
      "capabilityId": "cap.emf.calculate_motional_emf",
      "title": "Calculate the EMF induced in a conductor moving through a magnetic field",
      "representation": {
        "diagram": {
          "required": false,
          "blueprintId": "emf.motional_emf_geometry"
        },
        "formula": {
          "required": true,
          "formulaFamilyId": "formula.motional_emf"
        }
      },
      "variantDimensions": {},
      "parameterGenerators": [],
      "answer": {
        "type": "quantity",
        "quantity": "emf",
        "canonicalUnit": "volt"
      },
      "marking": {
        "type": "numeric_tolerance",
        "tolerancePercent": 2
      },
      "evidence": {
        "primaryCapabilityId": "cap.emf.calculate_motional_emf",
        "familyId": "electrical.emf_and_generation",
        "assertionIdentifiers": [
          "EL-REL-INDUCED-EMF-001"
        ],
        "supportingCapabilityIds": [],
        "representationDependency": [],
        "misconceptionTargets": []
      },
      "difficultyBand": "advanced",
      "presentation": {
        "promptLines": [
          "B = {B} T",
          "l = {l} m",
          "v = {v} m/s",
          "The conductor's length, its velocity and the magnetic field are mutually perpendicular.",
          "Find the induced EMF."
        ]
      }
    },
    {
      "id": "emf.describe_ac_generation",
      "assertionFamilyId": "electrical.emf_and_generation",
      "capabilityId": "cap.emf.describe_ac_generation",
      "title": "Describe the basic principle of a rotating-loop A.C. generator",
      "representation": {
        "diagram": {
          "required": false,
          "blueprintId": "generator.rotating_loop"
        }
      },
      "variantDimensions": {},
      "parameterGenerators": [],
      "answer": {
        "type": "multiple_choice",
        "options": [
          "sine_wave",
          "constant_dc",
          "square_wave"
        ]
      },
      "marking": {
        "type": "exact"
      },
      "evidence": {
        "primaryCapabilityId": "cap.emf.describe_ac_generation",
        "familyId": "electrical.emf_and_generation",
        "assertionIdentifiers": [
          "EL-CONCEPT-AC-GENERATOR-001",
          "EL-CONCEPT-SINE-WAVE-001"
        ],
        "supportingCapabilityIds": [],
        "representationDependency": [],
        "misconceptionTargets": []
      },
      "difficultyBand": "intermediate",
      "presentation": {
        "promptLines": [
          "A single loop of wire is rotated at a constant speed inside a uniform magnetic field.",
          "What shape is the resulting EMF waveform?"
        ]
      }
    },
    {
      "id": "emf.distinguish_emf_terminal_voltage",
      "assertionFamilyId": "electrical.emf_and_generation",
      "capabilityId": "cap.emf.recognise_emf_terminal_voltage",
      "title": "Distinguish EMF from terminal voltage",
      "representation": {},
      "variantDimensions": {},
      "parameterGenerators": [],
      "answer": {
        "type": "multiple_choice",
        "options": [
          "emf",
          "terminal_voltage"
        ]
      },
      "marking": {
        "type": "exact"
      },
      "evidence": {
        "primaryCapabilityId": "cap.emf.recognise_emf_terminal_voltage",
        "familyId": "electrical.emf_and_generation",
        "assertionIdentifiers": [
          "EL-CONCEPT-EMF-001",
          "EL-CONCEPT-TERMINAL-VOLTAGE-001"
        ],
        "supportingCapabilityIds": [],
        "representationDependency": [],
        "misconceptionTargets": [
          {
            "misconceptionIdentifier": "MIS-EL-EMF-VOLTAGE-CONFUSION-001",
            "evidenceStrength": "direct"
          }
        ]
      },
      "difficultyBand": "advanced",
      "presentation": {
        "promptLines": [
          "A source's potential difference is measured {reading_context}.",
          "Is this its EMF or its terminal voltage?"
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
      "id": "gears.recognise_ratio_tradeoff",
      "assertionFamilyId": "foundational.levers_mechanical_advantage",
      "capabilityId": "cap.foundational.gears.recognise",
      "title": "Recognise the torque/speed trade-off a gear ratio produces",
      "representation": {},
      "variantDimensions": {},
      "parameterGenerators": [],
      "answer": {
        "type": "multiple_choice",
        "options": [
          "torque_increases",
          "speed_increases"
        ]
      },
      "marking": {
        "type": "exact"
      },
      "evidence": {
        "primaryCapabilityId": "cap.foundational.gears.recognise",
        "familyId": "foundational.levers_mechanical_advantage",
        "assertionIdentifiers": [
          "FP-CONCEPT-GEAR-001",
          "FP-REL-GEAR-RATIO-001",
          "FP-GEAR-SPEED-TORQUE-TRADEOFF-001"
        ],
        "supportingCapabilityIds": [],
        "representationDependency": [],
        "misconceptionTargets": []
      },
      "difficultyBand": "intermediate",
      "presentation": {
        "promptLines": [
          "{scenario_clue}",
          "Compared with the driving gear, does the driven gear's output torque increase, or does its output speed increase?"
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
      "id": "levers.calculate_effort_or_load",
      "assertionFamilyId": "foundational.levers_mechanical_advantage",
      "capabilityId": "cap.foundational.levers.calculate",
      "title": "Calculate the effort or load in a balanced lever using the moment-balance relationship",
      "representation": {
        "formula": {
          "required": true,
          "formulaFamilyId": "formula.lever_balance"
        }
      },
      "variantDimensions": {
        "target_variable": {
          "allowed": [
            "Fe",
            "Fl"
          ]
        }
      },
      "parameterGenerators": [],
      "answer": {
        "type": "quantity",
        "quantity": "force",
        "canonicalUnit": "newton"
      },
      "marking": {
        "type": "numeric_tolerance",
        "tolerancePercent": 2
      },
      "evidence": {
        "primaryCapabilityId": "cap.foundational.levers.calculate",
        "familyId": "foundational.levers_mechanical_advantage",
        "assertionIdentifiers": [
          "FP-REL-LEVER-BALANCE-001"
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
      "id": "levers.identify_class",
      "assertionFamilyId": "foundational.levers_mechanical_advantage",
      "capabilityId": "cap.foundational.levers.recognise",
      "title": "Identify a lever's class from the arrangement of pivot, effort and load",
      "representation": {},
      "variantDimensions": {},
      "parameterGenerators": [],
      "answer": {
        "type": "multiple_choice",
        "options": [
          "class_I",
          "class_II",
          "class_III"
        ]
      },
      "marking": {
        "type": "exact"
      },
      "evidence": {
        "primaryCapabilityId": "cap.foundational.levers.recognise",
        "familyId": "foundational.levers_mechanical_advantage",
        "assertionIdentifiers": [
          "FP-CONCEPT-LEVER-PRINCIPLE-001",
          "FP-LEVER-CLASS-I-001",
          "FP-LEVER-CLASS-II-001",
          "FP-LEVER-CLASS-III-001"
        ],
        "supportingCapabilityIds": [],
        "representationDependency": [],
        "misconceptionTargets": []
      },
      "difficultyBand": "introductory",
      "presentation": {
        "promptLines": [
          "A lever is arranged so that {arrangement_clue}.",
          "Which class of lever is this?"
        ]
      }
    },
    {
      "id": "magnetism.calculate_force_on_conductor",
      "assertionFamilyId": "electrical.magnetism_and_electromagnetism",
      "capabilityId": "cap.magnetism.calculate_force_on_conductor",
      "title": "Calculate the force on a current-carrying conductor at right angles to a magnetic field",
      "representation": {
        "formula": {
          "required": true,
          "formulaFamilyId": "formula.force_on_conductor"
        }
      },
      "variantDimensions": {},
      "parameterGenerators": [],
      "answer": {
        "type": "quantity",
        "quantity": "force",
        "canonicalUnit": "newton"
      },
      "marking": {
        "type": "numeric_tolerance",
        "tolerancePercent": 2
      },
      "evidence": {
        "primaryCapabilityId": "cap.magnetism.calculate_force_on_conductor",
        "familyId": "electrical.magnetism_and_electromagnetism",
        "assertionIdentifiers": [
          "EL-REL-FORCE-ON-CONDUCTOR-001"
        ],
        "supportingCapabilityIds": [],
        "representationDependency": [],
        "misconceptionTargets": []
      },
      "difficultyBand": "advanced",
      "presentation": {
        "promptLines": [
          "B = {B} T",
          "I = {I} A (current)",
          "l = {l} m (conductor length)",
          "The conductor is at right angles to the field.",
          "Find the force on the conductor."
        ]
      }
    },
    {
      "id": "magnetism.compare_motor_generator",
      "assertionFamilyId": "electrical.magnetism_and_electromagnetism",
      "capabilityId": "cap.magnetism.compare_motor_generator",
      "title": "Compare the motor principle with the generator principle",
      "representation": {},
      "variantDimensions": {},
      "parameterGenerators": [],
      "answer": {
        "type": "multiple_choice",
        "options": [
          "motor",
          "generator"
        ]
      },
      "marking": {
        "type": "exact"
      },
      "evidence": {
        "primaryCapabilityId": "cap.magnetism.compare_motor_generator",
        "familyId": "electrical.magnetism_and_electromagnetism",
        "assertionIdentifiers": [
          "EL-MOTOR-GENERATOR-COMPARE-001"
        ],
        "supportingCapabilityIds": [],
        "representationDependency": [],
        "misconceptionTargets": [
          {
            "misconceptionIdentifier": "MIS-EL-EMF-VOLTAGE-CONFUSION-001",
            "evidenceStrength": "suggestive"
          }
        ]
      },
      "difficultyBand": "advanced",
      "presentation": {
        "promptLines": [
          "Which principle is being described: it {principle_clue}?"
        ]
      }
    },
    {
      "id": "magnetism.compare_permanent_electromagnet",
      "assertionFamilyId": "electrical.magnetism_and_electromagnetism",
      "capabilityId": "cap.magnetism.compare_permanent_electromagnet",
      "title": "Compare a permanent magnet with an electromagnet",
      "representation": {},
      "variantDimensions": {},
      "parameterGenerators": [],
      "answer": {
        "type": "multiple_choice",
        "options": [
          "permanent_magnet",
          "electromagnet"
        ]
      },
      "marking": {
        "type": "exact"
      },
      "evidence": {
        "primaryCapabilityId": "cap.magnetism.compare_permanent_electromagnet",
        "familyId": "electrical.magnetism_and_electromagnetism",
        "assertionIdentifiers": [
          "EL-MAGNETISM-COMPARE-PERMANENT-ELECTROMAGNET-001"
        ],
        "supportingCapabilityIds": [],
        "representationDependency": [],
        "misconceptionTargets": []
      },
      "difficultyBand": "intermediate",
      "presentation": {
        "promptLines": [
          "Which type of magnet is being described: it {scenario_clue}?"
        ]
      }
    },
    {
      "id": "magnetism.diagnose_current_convention",
      "assertionFamilyId": "electrical.magnetism_and_electromagnetism",
      "capabilityId": "cap.magnetism.interpret_force_direction",
      "title": "Diagnose which current convention was used for Fleming's left-hand rule",
      "representation": {},
      "variantDimensions": {},
      "parameterGenerators": [],
      "answer": {
        "type": "multiple_choice",
        "options": [
          "conventional_current",
          "electron_flow"
        ]
      },
      "marking": {
        "type": "exact"
      },
      "evidence": {
        "primaryCapabilityId": "cap.magnetism.interpret_force_direction",
        "familyId": "electrical.magnetism_and_electromagnetism",
        "assertionIdentifiers": [
          "EL-CONCEPT-FLEMING-LEFT-HAND-001"
        ],
        "supportingCapabilityIds": [],
        "representationDependency": [],
        "misconceptionTargets": [
          {
            "misconceptionIdentifier": "MIS-EL-ELECTRON-CURRENT-DIRECTION-CONFUSION-001",
            "evidenceStrength": "direct"
          }
        ]
      },
      "difficultyBand": "diagnostic",
      "presentation": {
        "promptLines": [
          "Fleming's left-hand rule's seCond finger represents the direction of CONVENTIONAL current (positive to negative), never electron flow.",
          "Which direction convention did you use when you last answered a force-direction question?"
        ],
        "answerOptionLabels": {
          "conventional_current": "Conventional current (positive to negative)",
          "electron_flow": "Electron flow (negative to positive)"
        }
      }
    },
    {
      "id": "magnetism.identify_flux_density_unit",
      "assertionFamilyId": "electrical.magnetism_and_electromagnetism",
      "capabilityId": "cap.magnetism.identify_unit",
      "title": "Identify the SI unit of magnetic flux density",
      "representation": {},
      "variantDimensions": {},
      "parameterGenerators": [],
      "answer": {
        "type": "multiple_choice",
        "options": [
          "tesla",
          "weber",
          "henry",
          "farad"
        ]
      },
      "marking": {
        "type": "exact"
      },
      "evidence": {
        "primaryCapabilityId": "cap.magnetism.identify_unit",
        "familyId": "electrical.magnetism_and_electromagnetism",
        "assertionIdentifiers": [
          "EL-UNIT-TESLA-001"
        ],
        "supportingCapabilityIds": [],
        "representationDependency": [],
        "misconceptionTargets": []
      },
      "difficultyBand": "introductory",
      "presentation": {
        "promptLines": [
          "What is the SI unit of magnetic flux density?"
        ]
      }
    },
    {
      "id": "magnetism.identify_flux_unit",
      "assertionFamilyId": "electrical.magnetism_and_electromagnetism",
      "capabilityId": "cap.magnetism.identify_unit",
      "title": "Identify the SI unit of magnetic flux",
      "representation": {},
      "variantDimensions": {},
      "parameterGenerators": [],
      "answer": {
        "type": "multiple_choice",
        "options": [
          "weber",
          "tesla",
          "henry",
          "farad"
        ]
      },
      "marking": {
        "type": "exact"
      },
      "evidence": {
        "primaryCapabilityId": "cap.magnetism.identify_unit",
        "familyId": "electrical.magnetism_and_electromagnetism",
        "assertionIdentifiers": [
          "EL-UNIT-WEBER-001"
        ],
        "supportingCapabilityIds": [],
        "representationDependency": [],
        "misconceptionTargets": []
      },
      "difficultyBand": "introductory",
      "presentation": {
        "promptLines": [
          "What is the SI unit of magnetic flux?"
        ]
      }
    },
    {
      "id": "magnetism.interpret_field_direction",
      "assertionFamilyId": "electrical.magnetism_and_electromagnetism",
      "capabilityId": "cap.magnetism.interpret_field_direction",
      "title": "Interpret the direction of the magnetic field produced by a current-carrying conductor",
      "representation": {
        "diagram": {
          "required": true,
          "blueprintId": "magnetic.field_conductor_direction"
        }
      },
      "variantDimensions": {},
      "parameterGenerators": [],
      "answer": {
        "type": "direction"
      },
      "marking": {
        "type": "direction_match"
      },
      "evidence": {
        "primaryCapabilityId": "cap.magnetism.interpret_field_direction",
        "familyId": "electrical.magnetism_and_electromagnetism",
        "assertionIdentifiers": [
          "EL-CONCEPT-MAGNETIC-FIELD-CURRENT-001",
          "EL-CONCEPT-FIELD-DIRECTION-RULE-001"
        ],
        "supportingCapabilityIds": [],
        "representationDependency": [],
        "misconceptionTargets": []
      },
      "difficultyBand": "advanced",
      "presentation": {
        "promptLines": [
          "A straight conductor carries current as shown. In which direction does the magnetic field circulate around it?"
        ]
      }
    },
    {
      "id": "magnetism.interpret_force_direction",
      "assertionFamilyId": "electrical.magnetism_and_electromagnetism",
      "capabilityId": "cap.magnetism.interpret_force_direction",
      "title": "Interpret the direction of the force on a current-carrying conductor in a magnetic field",
      "representation": {
        "diagram": {
          "required": true,
          "blueprintId": "motor.force_field_current"
        }
      },
      "variantDimensions": {},
      "parameterGenerators": [],
      "answer": {
        "type": "direction"
      },
      "marking": {
        "type": "direction_match"
      },
      "evidence": {
        "primaryCapabilityId": "cap.magnetism.interpret_force_direction",
        "familyId": "electrical.magnetism_and_electromagnetism",
        "assertionIdentifiers": [
          "EL-CONCEPT-FORCE-ON-CONDUCTOR-001",
          "EL-CONCEPT-MOTOR-PRINCIPLE-001"
        ],
        "supportingCapabilityIds": [],
        "representationDependency": [],
        "misconceptionTargets": [
          {
            "misconceptionIdentifier": "MIS-EL-ELECTRON-CURRENT-DIRECTION-CONFUSION-001",
            "evidenceStrength": "suggestive"
          }
        ]
      },
      "difficultyBand": "advanced",
      "presentation": {
        "promptLines": [
          "A current-carrying conductor sits in the magnetic field shown. In which direction does the force act on it?"
        ]
      }
    },
    {
      "id": "magnetism.recognise_attraction_repulsion",
      "assertionFamilyId": "electrical.magnetism_and_electromagnetism",
      "capabilityId": "cap.magnetism.recognise_attraction_repulsion",
      "title": "Recognise the effects of magnetism in terms of attraction and repulsion",
      "representation": {
        "diagram": {
          "required": true,
          "blueprintId": "magnetic.pole_interaction"
        }
      },
      "variantDimensions": {},
      "parameterGenerators": [],
      "answer": {
        "type": "multiple_choice",
        "options": [
          "attract",
          "repel"
        ]
      },
      "marking": {
        "type": "exact"
      },
      "evidence": {
        "primaryCapabilityId": "cap.magnetism.recognise_attraction_repulsion",
        "familyId": "electrical.magnetism_and_electromagnetism",
        "assertionIdentifiers": [
          "EL-CONCEPT-MAGNETISM-001"
        ],
        "supportingCapabilityIds": [],
        "representationDependency": [],
        "misconceptionTargets": []
      },
      "difficultyBand": "introductory",
      "presentation": {
        "promptLines": [
          "Two magnetic poles are brought close together: {pole_scenario_clue}.",
          "What happens?"
        ]
      }
    },
    {
      "id": "magnetism.recognise_concept",
      "assertionFamilyId": "electrical.magnetism_and_electromagnetism",
      "capabilityId": "cap.magnetism.recognise_concept",
      "title": "Recognise magnetic flux or flux density from its definition",
      "representation": {},
      "variantDimensions": {},
      "parameterGenerators": [],
      "answer": {
        "type": "multiple_choice",
        "options": [
          "flux",
          "flux_density"
        ]
      },
      "marking": {
        "type": "exact"
      },
      "evidence": {
        "primaryCapabilityId": "cap.magnetism.recognise_concept",
        "familyId": "electrical.magnetism_and_electromagnetism",
        "assertionIdentifiers": [
          "EL-CONCEPT-MAGNETIC-FLUX-001",
          "EL-CONCEPT-MAGNETIC-FLUX-DENSITY-001",
          "EL-CONCEPT-ELECTROMAGNETISM-001"
        ],
        "supportingCapabilityIds": [],
        "representationDependency": [],
        "misconceptionTargets": []
      },
      "difficultyBand": "introductory",
      "presentation": {
        "promptLines": [
          "Which quantity is described as: {definition_clue}?"
        ],
        "answerOptionLabels": {
          "flux": "Magnetic flux",
          "flux_density": "Magnetic flux density"
        }
      }
    },
    {
      "id": "mass_weight.recognise_relationship",
      "assertionFamilyId": "foundational.mass_weight",
      "capabilityId": "cap.foundational.mass_weight.recognise",
      "title": "Recognise mass or weight from its definition, and their relationship (W = mg)",
      "representation": {},
      "variantDimensions": {},
      "parameterGenerators": [],
      "answer": {
        "type": "multiple_choice",
        "options": [
          "mass",
          "weight"
        ]
      },
      "marking": {
        "type": "exact"
      },
      "evidence": {
        "primaryCapabilityId": "cap.foundational.mass_weight.recognise",
        "familyId": "foundational.mass_weight",
        "assertionIdentifiers": [
          "FP-CONCEPT-MASS-001",
          "FP-CONCEPT-WEIGHT-001",
          "FP-REL-WEIGHT-MASS-001"
        ],
        "supportingCapabilityIds": [],
        "representationDependency": [],
        "misconceptionTargets": []
      },
      "difficultyBand": "introductory",
      "presentation": {
        "promptLines": [
          "Which quantity is described as: {concept_clue}?"
        ]
      }
    },
    {
      "id": "mechanics.calculate_efficiency",
      "assertionFamilyId": "foundational.mechanics_work_energy_power",
      "capabilityId": "cap.foundational.mechanics.calculate",
      "title": "Calculate efficiency as a percentage from useful output and total input",
      "representation": {
        "formula": {
          "required": true,
          "formulaFamilyId": "formula.mechanics_efficiency"
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
        "primaryCapabilityId": "cap.foundational.mechanics.calculate",
        "familyId": "foundational.mechanics_work_energy_power",
        "assertionIdentifiers": [
          "FP-CONCEPT-EFFICIENCY-001",
          "FP-CALC-EFFICIENCY-001"
        ],
        "supportingCapabilityIds": [],
        "representationDependency": [],
        "misconceptionTargets": []
      },
      "difficultyBand": "advanced",
      "presentation": {
        "promptLines": [
          "Useful output: {Eout} J",
          "Total input: {Ein} J"
        ]
      }
    },
    {
      "id": "mechanics.calculate_kinetic_energy",
      "assertionFamilyId": "foundational.mechanics_work_energy_power",
      "capabilityId": "cap.foundational.mechanics.calculate",
      "title": "Calculate kinetic energy from mass and speed",
      "representation": {
        "formula": {
          "required": true,
          "formulaFamilyId": "formula.mechanics_kinetic_energy"
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
        "tolerancePercent": 2
      },
      "evidence": {
        "primaryCapabilityId": "cap.foundational.mechanics.calculate",
        "familyId": "foundational.mechanics_work_energy_power",
        "assertionIdentifiers": [
          "FP-REL-KINETIC-ENERGY-001",
          "FP-CALC-KINETIC-ENERGY-001"
        ],
        "supportingCapabilityIds": [],
        "representationDependency": [],
        "misconceptionTargets": []
      },
      "difficultyBand": "intermediate",
      "presentation": {
        "promptLines": [
          "m = {m} kg",
          "v = {v} m/s"
        ]
      }
    },
    {
      "id": "mechanics.calculate_potential_energy",
      "assertionFamilyId": "foundational.mechanics_work_energy_power",
      "capabilityId": "cap.foundational.mechanics.calculate",
      "title": "Calculate gravitational potential energy from mass and height",
      "representation": {
        "formula": {
          "required": true,
          "formulaFamilyId": "formula.mechanics_potential_energy"
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
        "tolerancePercent": 2
      },
      "evidence": {
        "primaryCapabilityId": "cap.foundational.mechanics.calculate",
        "familyId": "foundational.mechanics_work_energy_power",
        "assertionIdentifiers": [
          "FP-REL-POTENTIAL-ENERGY-001",
          "FP-CALC-POTENTIAL-ENERGY-001"
        ],
        "supportingCapabilityIds": [],
        "representationDependency": [],
        "misconceptionTargets": []
      },
      "difficultyBand": "intermediate",
      "presentation": {
        "promptLines": [
          "m = {m} kg",
          "h = {h} m",
          "(use g = 9.81 N/kg)"
        ]
      }
    },
    {
      "id": "mechanics.calculate_power",
      "assertionFamilyId": "foundational.mechanics_work_energy_power",
      "capabilityId": "cap.foundational.mechanics.calculate",
      "title": "Calculate power from work done (or energy transferred) and time taken",
      "representation": {
        "formula": {
          "required": true,
          "formulaFamilyId": "formula.mechanics_power"
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
        "tolerancePercent": 2
      },
      "evidence": {
        "primaryCapabilityId": "cap.foundational.mechanics.calculate",
        "familyId": "foundational.mechanics_work_energy_power",
        "assertionIdentifiers": [
          "FP-REL-POWER-WORK-TIME-001",
          "FP-CALC-POWER-001"
        ],
        "supportingCapabilityIds": [],
        "representationDependency": [],
        "misconceptionTargets": []
      },
      "difficultyBand": "intermediate",
      "presentation": {
        "promptLines": [
          "W = {W} J",
          "t = {t} s"
        ]
      }
    },
    {
      "id": "mechanics.calculate_work",
      "assertionFamilyId": "foundational.mechanics_work_energy_power",
      "capabilityId": "cap.foundational.mechanics.calculate",
      "title": "Calculate work done from force and distance",
      "representation": {
        "formula": {
          "required": true,
          "formulaFamilyId": "formula.mechanics_work"
        }
      },
      "variantDimensions": {},
      "parameterGenerators": [],
      "answer": {
        "type": "quantity",
        "quantity": "work",
        "canonicalUnit": "joule"
      },
      "marking": {
        "type": "numeric_tolerance",
        "tolerancePercent": 2
      },
      "evidence": {
        "primaryCapabilityId": "cap.foundational.mechanics.calculate",
        "familyId": "foundational.mechanics_work_energy_power",
        "assertionIdentifiers": [
          "FP-REL-WORK-FORCE-DISTANCE-001",
          "FP-CALC-WORK-001"
        ],
        "supportingCapabilityIds": [],
        "representationDependency": [],
        "misconceptionTargets": []
      },
      "difficultyBand": "introductory",
      "presentation": {
        "promptLines": [
          "F = {F} N",
          "d = {d} m"
        ]
      }
    },
    {
      "id": "mechanics.recognise_concept",
      "assertionFamilyId": "foundational.mechanics_work_energy_power",
      "capabilityId": "cap.foundational.mechanics.recognise",
      "title": "Recognise force, work, energy, power or efficiency from its definition",
      "representation": {},
      "variantDimensions": {},
      "parameterGenerators": [],
      "answer": {
        "type": "multiple_choice",
        "options": [
          "force",
          "work",
          "energy",
          "power",
          "efficiency"
        ]
      },
      "marking": {
        "type": "exact"
      },
      "evidence": {
        "primaryCapabilityId": "cap.foundational.mechanics.recognise",
        "familyId": "foundational.mechanics_work_energy_power",
        "assertionIdentifiers": [
          "FP-CONCEPT-FORCE-001",
          "FP-CONCEPT-WORK-001",
          "FP-CONCEPT-ENERGY-001",
          "FP-CONCEPT-POWER-001",
          "FP-CONCEPT-EFFICIENCY-001"
        ],
        "supportingCapabilityIds": [],
        "representationDependency": [],
        "misconceptionTargets": []
      },
      "difficultyBand": "introductory",
      "presentation": {
        "promptLines": [
          "Which mechanical quantity is described as: {concept_clue}?"
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
          "wrong_operation": "Multiplied instead of dividing",
          "rearrangement_error": "Divided, but the wrong way round -- I ÷ V instead of V ÷ I",
          "unrelated_symbols": "Substituted a value that isn't V or I",
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
          "wrong_operation": "Multiplied V and R instead of dividing V by R",
          "rearrangement_error": "Divided, but the wrong way round (numerator and denominator swapped)",
          "unrelated_symbols": "Substituted a value that isn't V or R",
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
          "Match each quantity to its correct SI unit."
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
      "id": "pulleys.recognise_force_distance_tradeoff",
      "assertionFamilyId": "foundational.levers_mechanical_advantage",
      "capabilityId": "cap.foundational.pulleys.recognise",
      "title": "Recognise the effort force/distance trade-off a pulley system's mechanical advantage produces",
      "representation": {},
      "variantDimensions": {},
      "parameterGenerators": [],
      "answer": {
        "type": "multiple_choice",
        "options": [
          "effort_force_decreases",
          "effort_force_increases"
        ]
      },
      "marking": {
        "type": "exact"
      },
      "evidence": {
        "primaryCapabilityId": "cap.foundational.pulleys.recognise",
        "familyId": "foundational.levers_mechanical_advantage",
        "assertionIdentifiers": [
          "FP-CONCEPT-PULLEY-001",
          "FP-PULLEY-FIXED-VS-MOVABLE-001",
          "FP-REL-PULLEY-MECHANICAL-ADVANTAGE-001",
          "FP-REL-PULLEY-FORCE-DISTANCE-TRADEOFF-001"
        ],
        "supportingCapabilityIds": [],
        "representationDependency": [],
        "misconceptionTargets": []
      },
      "difficultyBand": "intermediate",
      "presentation": {
        "promptLines": [
          "{scenario_clue}",
          "Compared with a single fixed pulley, does the effort force needed to lift the load decrease, or increase?"
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
          "EL-SERIES-VOLTAGE-CALC-001",
          "EL-VOLTAGE-DROP-001"
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
    },
    {
      "id": "waveform.calculate_frequency_from_period",
      "assertionFamilyId": "electrical.ac_dc_waveforms",
      "capabilityId": "cap.waveform.calculate_frequency_period",
      "title": "Calculate frequency from periodic time, or periodic time from frequency",
      "representation": {
        "formula": {
          "required": true,
          "formulaFamilyId": "formula.ac_waveform_relationships"
        }
      },
      "variantDimensions": {
        "target_variable": {
          "allowed": [
            "f",
            "T"
          ]
        }
      },
      "parameterGenerators": [],
      "answer": {
        "type": "quantity",
        "quantity": "frequency_or_time",
        "canonicalUnit": "hertz_or_second"
      },
      "marking": {
        "type": "numeric_tolerance",
        "tolerancePercent": 1
      },
      "evidence": {
        "primaryCapabilityId": "cap.waveform.calculate_frequency_period",
        "familyId": "electrical.ac_dc_waveforms",
        "assertionIdentifiers": [
          "EL-WAVEFORM-FREQUENCY-CALC-001",
          "EL-WAVEFORM-FREQUENCY-PERIOD-RELATIONSHIP-001"
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
      "id": "waveform.calculate_rms_from_peak",
      "assertionFamilyId": "electrical.ac_dc_waveforms",
      "capabilityId": "cap.waveform.calculate_rms_peak",
      "title": "Calculate RMS value from peak value, or peak value from RMS value",
      "representation": {
        "diagram": {
          "required": false,
          "blueprintId": "graph.waveform_sine"
        },
        "formula": {
          "required": true,
          "formulaFamilyId": "formula.ac_waveform_relationships"
        }
      },
      "variantDimensions": {
        "target_variable": {
          "allowed": [
            "rms",
            "peak"
          ]
        }
      },
      "parameterGenerators": [],
      "answer": {
        "type": "quantity",
        "quantity": "voltage_or_current",
        "canonicalUnit": "volt_or_ampere"
      },
      "marking": {
        "type": "numeric_tolerance",
        "tolerancePercent": 1
      },
      "evidence": {
        "primaryCapabilityId": "cap.waveform.calculate_rms_peak",
        "familyId": "electrical.ac_dc_waveforms",
        "assertionIdentifiers": [
          "EL-WAVEFORM-RMS-CALC-001",
          "EL-WAVEFORM-RMS-PEAK-RELATIONSHIP-001"
        ],
        "supportingCapabilityIds": [],
        "representationDependency": [],
        "misconceptionTargets": []
      },
      "difficultyBand": "intermediate",
      "presentation": {
        "promptLines": [
          "{given_summary}",
          "Find the {target_variable} value."
        ]
      }
    },
    {
      "id": "waveform.compare_ac_dc_behaviour",
      "assertionFamilyId": "electrical.ac_dc_waveforms",
      "capabilityId": "cap.waveform.compare_ac_dc_behaviour",
      "title": "Compare how a resistor, inductor and capacitor behave under AC versus DC supply",
      "representation": {},
      "variantDimensions": {},
      "parameterGenerators": [],
      "answer": {
        "type": "multiple_choice",
        "options": [
          "same_both",
          "differs_by_frequency"
        ]
      },
      "marking": {
        "type": "exact"
      },
      "evidence": {
        "primaryCapabilityId": "cap.waveform.compare_ac_dc_behaviour",
        "familyId": "electrical.ac_dc_waveforms",
        "assertionIdentifiers": [
          "EL-CIRCUIT-COMPARE-AC-DC-BEHAVIOUR-001"
        ],
        "supportingCapabilityIds": [],
        "representationDependency": [],
        "misconceptionTargets": []
      },
      "difficultyBand": "advanced",
      "presentation": {
        "promptLines": [
          "How does a {component} behave under an AC supply compared with a DC supply?"
        ]
      }
    },
    {
      "id": "waveform.identify_characteristic",
      "assertionFamilyId": "electrical.ac_dc_waveforms",
      "capabilityId": "cap.waveform.identify_characteristic",
      "title": "Identify a named sine-wave characteristic from a waveform graph",
      "representation": {
        "diagram": {
          "required": true,
          "blueprintId": "graph.waveform_sine"
        }
      },
      "variantDimensions": {},
      "parameterGenerators": [],
      "answer": {
        "type": "multiple_choice",
        "options": [
          "periodic_time",
          "amplitude",
          "peak_to_peak",
          "rms",
          "average_value"
        ]
      },
      "marking": {
        "type": "exact"
      },
      "evidence": {
        "primaryCapabilityId": "cap.waveform.identify_characteristic",
        "familyId": "electrical.ac_dc_waveforms",
        "assertionIdentifiers": [
          "EL-WAVEFORM-PERIODIC-TIME-001",
          "EL-WAVEFORM-AMPLITUDE-001",
          "EL-WAVEFORM-PEAK-TO-PEAK-001",
          "EL-WAVEFORM-RMS-001",
          "EL-WAVEFORM-AVERAGE-VALUE-001",
          "EL-WAVEFORM-AVERAGE-ZERO-INTERPRETATION-001"
        ],
        "supportingCapabilityIds": [],
        "representationDependency": [],
        "misconceptionTargets": []
      },
      "difficultyBand": "intermediate",
      "presentation": {
        "promptLines": [
          "Which characteristic of this waveform is highlighted by the marked reference line(s) on the graph?"
        ]
      }
    },
    {
      "id": "waveform.interpret_rated_value",
      "assertionFamilyId": "electrical.ac_dc_waveforms",
      "capabilityId": "cap.waveform.interpret_rated_value",
      "title": "Interpret whether a quoted AC supply rating (e.g. 230 V) refers to RMS or peak value",
      "representation": {},
      "variantDimensions": {},
      "parameterGenerators": [],
      "answer": {
        "type": "multiple_choice",
        "options": [
          "rms",
          "peak"
        ]
      },
      "marking": {
        "type": "exact"
      },
      "evidence": {
        "primaryCapabilityId": "cap.waveform.interpret_rated_value",
        "familyId": "electrical.ac_dc_waveforms",
        "assertionIdentifiers": [
          "EL-CONCEPT-PEAK-VS-RMS-SUPPLY-INTERPRETATION-001"
        ],
        "supportingCapabilityIds": [],
        "representationDependency": [],
        "misconceptionTargets": [
          {
            "misconceptionIdentifier": "MIS-EL-PEAK-RMS-CONFUSION-001",
            "evidenceStrength": "direct"
          }
        ]
      },
      "difficultyBand": "diagnostic",
      "presentation": {
        "promptLines": [
          "A supply is rated at a stated voltage (for example, '230 V').",
          "Does this rated value refer to the RMS value or the peak value?"
        ]
      }
    },
    {
      "id": "waveform.recognise_ac_dc",
      "assertionFamilyId": "electrical.ac_dc_waveforms",
      "capabilityId": "cap.waveform.recognise_ac_dc",
      "title": "Distinguish A.C. from D.C. supply behaviour",
      "representation": {},
      "variantDimensions": {},
      "parameterGenerators": [],
      "answer": {
        "type": "multiple_choice",
        "options": [
          "ac",
          "dc"
        ]
      },
      "marking": {
        "type": "exact"
      },
      "evidence": {
        "primaryCapabilityId": "cap.waveform.recognise_ac_dc",
        "familyId": "electrical.ac_dc_waveforms",
        "assertionIdentifiers": [
          "EL-CONCEPT-AC-DC-DISTINCTION-001",
          "EL-CIRCUIT-AC-SUPPLY-RECOGNITION-001"
        ],
        "supportingCapabilityIds": [],
        "representationDependency": [],
        "misconceptionTargets": [
          {
            "misconceptionIdentifier": "MIS-EL-AC-DC-CONFUSION-001",
            "evidenceStrength": "suggestive"
          }
        ]
      },
      "difficultyBand": "introductory",
      "presentation": {
        "promptLines": [
          "Which type of supply is being described: {supply_clue}?"
        ]
      }
    }
  ],
  "formulaFamilies": [
    {
      "id": "formula.ac_waveform_relationships",
      "assertionFamilyId": "electrical.ac_dc_waveforms",
      "canonicalTarget": "rms",
      "variables": [
        {
          "symbol": "rms",
          "name": "RMS value",
          "quantity": "voltage_or_current",
          "unitName": "volt or ampere",
          "unitSymbol": "V/A"
        },
        {
          "symbol": "peak",
          "name": "peak value",
          "quantity": "voltage_or_current",
          "unitName": "volt or ampere",
          "unitSymbol": "V/A"
        },
        {
          "symbol": "f",
          "name": "frequency",
          "quantity": "frequency",
          "unitName": "hertz",
          "unitSymbol": "Hz"
        },
        {
          "symbol": "T",
          "name": "periodic time",
          "quantity": "time",
          "unitName": "second",
          "unitSymbol": "s"
        }
      ],
      "forms": [
        {
          "target": "rms",
          "expression": {
            "operation": "divide",
            "numerator": "peak",
            "denominator": {
              "operation": "sqrt",
              "operand": 2
            }
          },
          "instruction": "To find the RMS value, divide the peak value by the square root of two.",
          "requiresWorkedExample": true
        },
        {
          "target": "peak",
          "expression": {
            "operation": "multiply",
            "operands": [
              "rms",
              {
                "operation": "sqrt",
                "operand": 2
              }
            ]
          },
          "instruction": "To find the peak value, multiply the RMS value by the square root of two.",
          "requiresWorkedExample": true
        },
        {
          "target": "f",
          "expression": {
            "operation": "divide",
            "numerator": 1,
            "denominator": "T"
          },
          "instruction": "To find frequency, divide one by the periodic time.",
          "requiresWorkedExample": true
        },
        {
          "target": "T",
          "expression": {
            "operation": "divide",
            "numerator": 1,
            "denominator": "f"
          },
          "instruction": "To find periodic time, divide one by the frequency.",
          "requiresWorkedExample": true
        }
      ],
      "requiredTargets": [
        "rms",
        "peak",
        "f",
        "T"
      ]
    },
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
      "id": "formula.flux_change_emf",
      "assertionFamilyId": "electrical.emf_and_generation",
      "canonicalTarget": "e",
      "variables": [
        {
          "symbol": "e",
          "name": "induced EMF",
          "quantity": "emf",
          "unitName": "volt",
          "unitSymbol": "V"
        },
        {
          "symbol": "deltaPhi",
          "name": "change in magnetic flux",
          "quantity": "magnetic flux",
          "unitName": "weber",
          "unitSymbol": "Wb"
        },
        {
          "symbol": "deltaT",
          "name": "time taken",
          "quantity": "time",
          "unitName": "second",
          "unitSymbol": "s"
        }
      ],
      "forms": [
        {
          "target": "e",
          "expression": {
            "operation": "divide",
            "numerator": "deltaPhi",
            "denominator": "deltaT"
          },
          "instruction": "To find the induced EMF, divide the change in flux by the time taken.",
          "requiresWorkedExample": true
        },
        {
          "target": "deltaPhi",
          "expression": {
            "operation": "multiply",
            "operands": [
              "e",
              "deltaT"
            ]
          },
          "instruction": "To find the change in flux, multiply the induced EMF by the time taken.",
          "requiresWorkedExample": true
        },
        {
          "target": "deltaT",
          "expression": {
            "operation": "divide",
            "numerator": "deltaPhi",
            "denominator": "e"
          },
          "instruction": "To find the time taken, divide the change in flux by the induced EMF.",
          "requiresWorkedExample": false
        }
      ],
      "requiredTargets": [
        "e",
        "deltaPhi"
      ]
    },
    {
      "id": "formula.force_on_conductor",
      "assertionFamilyId": "electrical.magnetism_and_electromagnetism",
      "canonicalTarget": "F",
      "variables": [
        {
          "symbol": "F",
          "name": "force",
          "quantity": "force",
          "unitName": "newton",
          "unitSymbol": "N"
        },
        {
          "symbol": "B",
          "name": "magnetic flux density",
          "quantity": "magnetic flux density",
          "unitName": "tesla",
          "unitSymbol": "T"
        },
        {
          "symbol": "I",
          "name": "current",
          "quantity": "current",
          "unitName": "ampere",
          "unitSymbol": "A"
        },
        {
          "symbol": "l",
          "name": "conductor length in the field",
          "quantity": "length",
          "unitName": "metre",
          "unitSymbol": "m"
        }
      ],
      "forms": [
        {
          "target": "F",
          "expression": {
            "operation": "multiply",
            "operands": [
              "B",
              "I",
              "l"
            ]
          },
          "instruction": "To find the force on the conductor, multiply the magnetic flux density by the current, by the length of conductor in the field: F = B x I x l.",
          "requiresWorkedExample": true
        }
      ],
      "requiredTargets": [
        "F"
      ]
    },
    {
      "id": "formula.lever_balance",
      "assertionFamilyId": "foundational.levers_mechanical_advantage",
      "canonicalTarget": "Fe",
      "variables": [
        {
          "symbol": "Fe",
          "name": "effort force",
          "quantity": "force",
          "unitName": "newton",
          "unitSymbol": "N"
        },
        {
          "symbol": "de",
          "name": "effort-to-pivot distance",
          "quantity": "length",
          "unitName": "metre",
          "unitSymbol": "m"
        },
        {
          "symbol": "Fl",
          "name": "load force",
          "quantity": "force",
          "unitName": "newton",
          "unitSymbol": "N"
        },
        {
          "symbol": "dl",
          "name": "load-to-pivot distance",
          "quantity": "length",
          "unitName": "metre",
          "unitSymbol": "m"
        }
      ],
      "forms": [
        {
          "target": "Fe",
          "expression": {
            "operation": "divide",
            "numerator": {
              "operation": "multiply",
              "operands": [
                "Fl",
                "dl"
              ]
            },
            "denominator": "de"
          },
          "instruction": "To find the effort force, multiply the load by its distance from the pivot, then divide by the effort's distance from the pivot.",
          "requiresWorkedExample": true
        },
        {
          "target": "Fl",
          "expression": {
            "operation": "divide",
            "numerator": {
              "operation": "multiply",
              "operands": [
                "Fe",
                "de"
              ]
            },
            "denominator": "dl"
          },
          "instruction": "To find the load, multiply the effort by its distance from the pivot, then divide by the load's distance from the pivot.",
          "requiresWorkedExample": true
        }
      ],
      "requiredTargets": [
        "Fe",
        "Fl"
      ]
    },
    {
      "id": "formula.mechanics_efficiency",
      "assertionFamilyId": "foundational.mechanics_work_energy_power",
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
          "symbol": "Eout",
          "name": "useful output",
          "quantity": "energy_or_power",
          "unitName": "joule or watt",
          "unitSymbol": "J/W"
        },
        {
          "symbol": "Ein",
          "name": "total input",
          "quantity": "energy_or_power",
          "unitName": "joule or watt",
          "unitSymbol": "J/W"
        }
      ],
      "forms": [
        {
          "target": "eta",
          "expression": {
            "operation": "ratio_percentage",
            "numerator": "Eout",
            "denominator": "Ein"
          },
          "instruction": "To find efficiency, divide the useful output by the total input and express as a percentage.",
          "requiresWorkedExample": true
        }
      ],
      "requiredTargets": [
        "eta"
      ]
    },
    {
      "id": "formula.mechanics_kinetic_energy",
      "assertionFamilyId": "foundational.mechanics_work_energy_power",
      "canonicalTarget": "KE",
      "variables": [
        {
          "symbol": "KE",
          "name": "kinetic energy",
          "quantity": "energy",
          "unitName": "joule",
          "unitSymbol": "J"
        },
        {
          "symbol": "m",
          "name": "mass",
          "quantity": "mass",
          "unitName": "kilogram",
          "unitSymbol": "kg"
        },
        {
          "symbol": "v",
          "name": "speed",
          "quantity": "speed",
          "unitName": "metre per second",
          "unitSymbol": "m/s"
        }
      ],
      "forms": [
        {
          "target": "KE",
          "expression": {
            "operation": "multiply",
            "operands": [
              0.5,
              "m",
              {
                "operation": "square",
                "operand": "v"
              }
            ]
          },
          "instruction": "To find kinetic energy, multiply one half by the mass, by the speed squared: KE = 1/2 x m x v^2.",
          "requiresWorkedExample": true
        }
      ],
      "requiredTargets": [
        "KE"
      ]
    },
    {
      "id": "formula.mechanics_potential_energy",
      "assertionFamilyId": "foundational.mechanics_work_energy_power",
      "canonicalTarget": "PE",
      "variables": [
        {
          "symbol": "PE",
          "name": "gravitational potential energy",
          "quantity": "energy",
          "unitName": "joule",
          "unitSymbol": "J"
        },
        {
          "symbol": "m",
          "name": "mass",
          "quantity": "mass",
          "unitName": "kilogram",
          "unitSymbol": "kg"
        },
        {
          "symbol": "h",
          "name": "height",
          "quantity": "length",
          "unitName": "metre",
          "unitSymbol": "m"
        }
      ],
      "forms": [
        {
          "target": "PE",
          "expression": {
            "operation": "multiply",
            "operands": [
              "m",
              9.81,
              "h"
            ]
          },
          "instruction": "To find gravitational potential energy, multiply the mass by the gravitational field strength (9.81 N/kg) by the height.",
          "requiresWorkedExample": true
        }
      ],
      "requiredTargets": [
        "PE"
      ]
    },
    {
      "id": "formula.mechanics_power",
      "assertionFamilyId": "foundational.mechanics_work_energy_power",
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
          "symbol": "W",
          "name": "work done (or energy transferred)",
          "quantity": "work_or_energy",
          "unitName": "joule",
          "unitSymbol": "J"
        },
        {
          "symbol": "t",
          "name": "time taken",
          "quantity": "time",
          "unitName": "second",
          "unitSymbol": "s"
        }
      ],
      "forms": [
        {
          "target": "P",
          "expression": {
            "operation": "divide",
            "numerator": "W",
            "denominator": "t"
          },
          "instruction": "To find power, divide the work done (or energy transferred) by the time taken.",
          "requiresWorkedExample": true
        }
      ],
      "requiredTargets": [
        "P"
      ]
    },
    {
      "id": "formula.mechanics_work",
      "assertionFamilyId": "foundational.mechanics_work_energy_power",
      "canonicalTarget": "W",
      "variables": [
        {
          "symbol": "W",
          "name": "work done",
          "quantity": "work",
          "unitName": "joule",
          "unitSymbol": "J"
        },
        {
          "symbol": "F",
          "name": "force",
          "quantity": "force",
          "unitName": "newton",
          "unitSymbol": "N"
        },
        {
          "symbol": "d",
          "name": "distance moved",
          "quantity": "length",
          "unitName": "metre",
          "unitSymbol": "m"
        }
      ],
      "forms": [
        {
          "target": "W",
          "expression": {
            "operation": "multiply",
            "operands": [
              "F",
              "d"
            ]
          },
          "instruction": "To find work done, multiply the force by the distance moved in the direction of that force.",
          "requiresWorkedExample": true
        }
      ],
      "requiredTargets": [
        "W"
      ]
    },
    {
      "id": "formula.motional_emf",
      "assertionFamilyId": "electrical.emf_and_generation",
      "canonicalTarget": "e",
      "variables": [
        {
          "symbol": "e",
          "name": "induced EMF",
          "quantity": "emf",
          "unitName": "volt",
          "unitSymbol": "V"
        },
        {
          "symbol": "B",
          "name": "magnetic flux density",
          "quantity": "magnetic flux density",
          "unitName": "tesla",
          "unitSymbol": "T"
        },
        {
          "symbol": "l",
          "name": "conductor length",
          "quantity": "length",
          "unitName": "metre",
          "unitSymbol": "m"
        },
        {
          "symbol": "v",
          "name": "conductor velocity",
          "quantity": "speed",
          "unitName": "metre per second",
          "unitSymbol": "m/s"
        }
      ],
      "forms": [
        {
          "target": "e",
          "expression": {
            "operation": "multiply",
            "operands": [
              "B",
              "l",
              "v"
            ]
          },
          "instruction": "To find the induced EMF, multiply the magnetic flux density by the conductor length, by its velocity: e = B x l x v.",
          "requiresWorkedExample": true
        }
      ],
      "requiredTargets": [
        "e"
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
      "id": "worked.emf.calculate_flux_change_e",
      "formulaFamilyId": "formula.flux_change_emf",
      "target": "e",
      "knownVariables": [
        "deltaPhi",
        "deltaT"
      ],
      "steps": [
        "show_formula",
        "substitute_values",
        "calculate",
        "show_answer_with_unit"
      ],
      "teachingValues": {
        "deltaPhi": 6,
        "deltaT": 3
      }
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
      "id": "worked.force_on_conductor.calculate",
      "formulaFamilyId": "formula.force_on_conductor",
      "target": "F",
      "knownVariables": [
        "B",
        "I",
        "l"
      ],
      "steps": [
        "show_formula",
        "substitute_values",
        "calculate",
        "show_answer_with_unit"
      ],
      "teachingValues": {
        "B": 0.5,
        "I": 4,
        "l": 0.3
      }
    },
    {
      "id": "worked.lever_balance.calculate_effort",
      "formulaFamilyId": "formula.lever_balance",
      "target": "Fe",
      "knownVariables": [
        "Fl",
        "dl",
        "de"
      ],
      "steps": [
        "show_formula",
        "substitute_values",
        "calculate",
        "show_answer_with_unit"
      ],
      "teachingValues": {
        "Fl": 100,
        "dl": 2,
        "de": 1
      }
    },
    {
      "id": "worked.mechanics_efficiency.calculate",
      "formulaFamilyId": "formula.mechanics_efficiency",
      "target": "eta",
      "knownVariables": [
        "Eout",
        "Ein"
      ],
      "steps": [
        "show_formula",
        "substitute_values",
        "calculate",
        "show_answer_with_unit"
      ],
      "teachingValues": {
        "Eout": 80,
        "Ein": 100
      }
    },
    {
      "id": "worked.mechanics_kinetic_energy.calculate",
      "formulaFamilyId": "formula.mechanics_kinetic_energy",
      "target": "KE",
      "knownVariables": [
        "m",
        "v"
      ],
      "steps": [
        "show_formula",
        "substitute_values",
        "calculate",
        "show_answer_with_unit"
      ],
      "teachingValues": {
        "m": 4,
        "v": 5
      }
    },
    {
      "id": "worked.mechanics_potential_energy.calculate",
      "formulaFamilyId": "formula.mechanics_potential_energy",
      "target": "PE",
      "knownVariables": [
        "m",
        "h"
      ],
      "steps": [
        "show_formula",
        "substitute_values",
        "calculate",
        "show_answer_with_unit"
      ],
      "teachingValues": {
        "m": 4,
        "h": 3
      }
    },
    {
      "id": "worked.mechanics_power.calculate",
      "formulaFamilyId": "formula.mechanics_power",
      "target": "P",
      "knownVariables": [
        "W",
        "t"
      ],
      "steps": [
        "show_formula",
        "substitute_values",
        "calculate",
        "show_answer_with_unit"
      ],
      "teachingValues": {
        "W": 200,
        "t": 10
      }
    },
    {
      "id": "worked.mechanics_work.calculate",
      "formulaFamilyId": "formula.mechanics_work",
      "target": "W",
      "knownVariables": [
        "F",
        "d"
      ],
      "steps": [
        "show_formula",
        "substitute_values",
        "calculate",
        "show_answer_with_unit"
      ],
      "teachingValues": {
        "F": 20,
        "d": 5
      }
    },
    {
      "id": "worked.motional_emf.calculate",
      "formulaFamilyId": "formula.motional_emf",
      "target": "e",
      "knownVariables": [
        "B",
        "l",
        "v"
      ],
      "steps": [
        "show_formula",
        "substitute_values",
        "calculate",
        "show_answer_with_unit"
      ],
      "teachingValues": {
        "B": 0.5,
        "l": 0.3,
        "v": 2
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
    },
    {
      "id": "worked.waveform.calculate_frequency",
      "formulaFamilyId": "formula.ac_waveform_relationships",
      "target": "f",
      "knownVariables": [
        "T"
      ],
      "steps": [
        "show_formula",
        "substitute_values",
        "calculate",
        "show_answer_with_unit"
      ]
    },
    {
      "id": "worked.waveform.calculate_rms",
      "formulaFamilyId": "formula.ac_waveform_relationships",
      "target": "rms",
      "knownVariables": [
        "peak"
      ],
      "steps": [
        "show_formula",
        "substitute_values",
        "calculate",
        "show_answer_with_unit"
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
      "id": "electronics.component_symbol_card",
      "type": "component_symbol",
      "renderer": "svg",
      "parameters": [
        {
          "name": "component_type",
          "kind": "enum",
          "allowed": [
            "resistor",
            "capacitor",
            "diode",
            "zener_diode",
            "led",
            "photodiode",
            "thermistor",
            "diac",
            "triac",
            "transistor",
            "thyristor_scr",
            "rectifier",
            "inverter"
          ]
        }
      ],
      "accessibility": {
        "semanticDescriptionRequired": true,
        "colourOnlyEncodingProhibited": true,
        "identifierLabelPattern": "component-{index}"
      },
      "valueEmbedding": "symbolic_only"
    },
    {
      "id": "emf.motional_emf_geometry",
      "type": "magnetic_field",
      "renderer": "svg",
      "parameters": [],
      "accessibility": {
        "semanticDescriptionRequired": true,
        "colourOnlyEncodingProhibited": true,
        "identifierLabelPattern": "vector-{index}"
      },
      "valueEmbedding": "symbolic_only"
    },
    {
      "id": "generator.rotating_loop",
      "type": "magnetic_field",
      "renderer": "svg",
      "parameters": [
        {
          "name": "rotation_phase",
          "kind": "enum",
          "allowed": [
            "vertical",
            "horizontal"
          ]
        }
      ],
      "accessibility": {
        "semanticDescriptionRequired": true,
        "colourOnlyEncodingProhibited": true,
        "identifierLabelPattern": "loop-{index}"
      },
      "valueEmbedding": "symbolic_only"
    },
    {
      "id": "graph.waveform_sine",
      "type": "waveform",
      "renderer": "svg",
      "parameters": [
        {
          "name": "show_peak_line",
          "kind": "boolean"
        },
        {
          "name": "show_rms_line",
          "kind": "boolean"
        },
        {
          "name": "show_period_marker",
          "kind": "boolean"
        },
        {
          "name": "cycles_shown",
          "kind": "number_range",
          "min": 1,
          "max": 3
        }
      ],
      "accessibility": {
        "semanticDescriptionRequired": true,
        "colourOnlyEncodingProhibited": true,
        "identifierLabelPattern": "marker-{index}"
      },
      "valueEmbedding": "values_when_assessed"
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
            "parallel",
            "isolated"
          ]
        }
      ],
      "accessibility": {
        "semanticDescriptionRequired": true,
        "colourOnlyEncodingProhibited": true,
        "identifierLabelPattern": "instrument-{index}"
      },
      "valueEmbedding": "symbolic_only"
    },
    {
      "id": "magnetic.field_conductor_direction",
      "type": "magnetic_field",
      "renderer": "svg",
      "parameters": [
        {
          "name": "current_direction",
          "kind": "enum",
          "allowed": [
            "into_page",
            "out_of_page",
            "left_to_right"
          ]
        },
        {
          "name": "show_field_arrows",
          "kind": "boolean"
        }
      ],
      "accessibility": {
        "semanticDescriptionRequired": true,
        "colourOnlyEncodingProhibited": true,
        "identifierLabelPattern": "arrow-{index}"
      },
      "valueEmbedding": "symbolic_only"
    },
    {
      "id": "magnetic.flux_field_lines",
      "type": "magnetic_field",
      "renderer": "svg",
      "parameters": [
        {
          "name": "density_comparison",
          "kind": "boolean"
        }
      ],
      "accessibility": {
        "semanticDescriptionRequired": true,
        "colourOnlyEncodingProhibited": true,
        "identifierLabelPattern": "flux-line-{index}"
      },
      "valueEmbedding": "symbolic_only"
    },
    {
      "id": "magnetic.pole_interaction",
      "type": "magnetic_field",
      "renderer": "svg",
      "parameters": [
        {
          "name": "pole_pairing",
          "kind": "enum",
          "allowed": [
            "like_poles_facing",
            "unlike_poles_facing"
          ]
        }
      ],
      "accessibility": {
        "semanticDescriptionRequired": true,
        "colourOnlyEncodingProhibited": true,
        "identifierLabelPattern": "pole-{index}"
      },
      "valueEmbedding": "symbolic_only"
    },
    {
      "id": "mechanical.gear_mesh",
      "type": "mechanical",
      "renderer": "svg",
      "parameters": [
        {
          "name": "size_ratio",
          "kind": "enum",
          "allowed": [
            "driven_larger",
            "driven_smaller",
            "equal"
          ]
        }
      ],
      "accessibility": {
        "semanticDescriptionRequired": true,
        "colourOnlyEncodingProhibited": true,
        "identifierLabelPattern": "gear-{index}"
      },
      "valueEmbedding": "symbolic_only"
    },
    {
      "id": "mechanical.lever_arrangement",
      "type": "mechanical",
      "renderer": "svg",
      "parameters": [
        {
          "name": "lever_class",
          "kind": "enum",
          "allowed": [
            "class_1",
            "class_2",
            "class_3"
          ]
        },
        {
          "name": "show_distances",
          "kind": "boolean"
        }
      ],
      "accessibility": {
        "semanticDescriptionRequired": true,
        "colourOnlyEncodingProhibited": true,
        "identifierLabelPattern": "lever-{index}"
      },
      "valueEmbedding": "symbolic_only"
    },
    {
      "id": "mechanical.pulley_arrangement",
      "type": "mechanical",
      "renderer": "svg",
      "parameters": [
        {
          "name": "arrangement",
          "kind": "enum",
          "allowed": [
            "fixed",
            "movable"
          ]
        }
      ],
      "accessibility": {
        "semanticDescriptionRequired": true,
        "colourOnlyEncodingProhibited": true,
        "identifierLabelPattern": "pulley-{index}"
      },
      "valueEmbedding": "symbolic_only"
    },
    {
      "id": "mechanical.resistivity_dimensions",
      "type": "mechanical",
      "renderer": "svg",
      "parameters": [
        {
          "name": "comparison",
          "kind": "enum",
          "allowed": [
            "length",
            "area"
          ]
        }
      ],
      "accessibility": {
        "semanticDescriptionRequired": true,
        "colourOnlyEncodingProhibited": true,
        "identifierLabelPattern": "rod-{index}"
      },
      "valueEmbedding": "symbolic_only"
    },
    {
      "id": "motor.force_field_current",
      "type": "magnetic_field",
      "renderer": "svg",
      "parameters": [
        {
          "name": "pole_labels",
          "kind": "enum",
          "allowed": [
            "N_S_horizontal",
            "N_S_vertical"
          ]
        },
        {
          "name": "current_direction",
          "kind": "enum",
          "allowed": [
            "into_page",
            "out_of_page"
          ]
        },
        {
          "name": "show_force_arrow",
          "kind": "boolean"
        }
      ],
      "accessibility": {
        "semanticDescriptionRequired": true,
        "colourOnlyEncodingProhibited": true,
        "identifierLabelPattern": "arrow-{index}"
      },
      "valueEmbedding": "symbolic_only"
    }
  ],
  "assertionFamilies": [
    {
      "id": "electrical.ac_dc_waveforms",
      "requiredCapabilityIds": [
        "cap.waveform.recognise_ac_dc",
        "cap.waveform.identify_characteristic",
        "cap.waveform.calculate_rms_peak",
        "cap.waveform.calculate_frequency_period",
        "cap.waveform.interpret_rated_value",
        "cap.waveform.compare_ac_dc_behaviour"
      ],
      "assessmentRequirement": "assessable"
    },
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
        "cap.conductors.recognise_breakdown",
        "cap.conductors.recognise_electron_theory"
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
      "id": "electrical.electronic_components",
      "requiredCapabilityIds": [
        "cap.electronic_components.recognise_principle",
        "cap.electronic_components.identify_application"
      ],
      "assessmentRequirement": "assessable"
    },
    {
      "id": "electrical.emf_and_generation",
      "requiredCapabilityIds": [
        "cap.emf.recognise_emf_terminal_voltage",
        "cap.emf.describe_ac_generation",
        "cap.emf.calculate_flux_change",
        "cap.emf.calculate_motional_emf"
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
      "id": "electrical.magnetism_and_electromagnetism",
      "requiredCapabilityIds": [
        "cap.magnetism.recognise_attraction_repulsion",
        "cap.magnetism.recognise_concept",
        "cap.magnetism.interpret_field_direction",
        "cap.magnetism.interpret_force_direction",
        "cap.magnetism.compare_permanent_electromagnet",
        "cap.magnetism.compare_motor_generator",
        "cap.magnetism.identify_unit",
        "cap.magnetism.calculate_force_on_conductor"
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
      "id": "foundational.levers_mechanical_advantage",
      "requiredCapabilityIds": [
        "cap.foundational.levers.recognise",
        "cap.foundational.gears.recognise",
        "cap.foundational.pulleys.recognise",
        "cap.foundational.levers.calculate"
      ],
      "assessmentRequirement": "assessable"
    },
    {
      "id": "foundational.mass_weight",
      "requiredCapabilityIds": [
        "cap.foundational.mass_weight.recognise"
      ],
      "assessmentRequirement": "assessable"
    },
    {
      "id": "foundational.mechanics_work_energy_power",
      "requiredCapabilityIds": [
        "cap.foundational.mechanics.recognise",
        "cap.foundational.mechanics.calculate"
      ],
      "assessmentRequirement": "assessable"
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
    "EL-APPLICATION-DIMMER-SWITCH-001": "A household dimmer switch typically uses a TRIAC to control the average power delivered to a lamp, by switching on at a controlled phase angle within each AC half-cycle.",
    "EL-APPLICATION-HEATING-BOILER-CONTROL-001": "Thermistors are used for temperature sensing in heating and ventilation systems, including central-heating and boiler controls, providing a feedback signal a control circuit (such as a thermostat) uses to switch a heating load on or off at set temperatures.",
    "EL-APPLICATION-MOTOR-CONTROL-001": "Silicon-controlled rectifiers are commonly used in motor-control circuits to control the electrical power delivered to a motor.",
    "EL-APPLICATION-SECURITY-ALARM-TRANSISTOR-THYRISTOR-001": "A simple electronic security-alarm circuit uses a transistor to detect a break in a normally-closed sensor loop; the transistor then triggers a thyristor, which latches on and continues to power a sounder even if the loop is reclosed, until the circuit is deliberately reset.",
    "EL-APPLICATION-TELEPHONE-MASTER-SOCKET-001": "The traditional UK master telephone socket arrangement contains a capacitor that couples the AC ringing signal to the line while blocking the line's DC, and a resistor that provides a defined test load for line testing when no telephone is connected; older master sockets also included a surge protector to suppress transient overvoltages on the line. Secondary (extension) sockets, wired in parallel from the master socket, contain none of these components.",
    "EL-CALC-ELECTRICAL-EFFICIENCY-001": "Calculate the efficiency of an electrical device as a percentage from its useful power output and its power input.",
    "EL-CIRCUIT-AC-SUPPLY-RECOGNITION-001": "UK domestic and industrial electrical supplies are alternating current, with a standard frequency of 50 Hz.",
    "EL-CIRCUIT-BREAKER-VS-FUSE-001": "Compare a fuse, which must be replaced after operating, with a circuit breaker, which can be reset and reused after tripping.",
    "EL-CIRCUIT-COMPARE-AC-DC-BEHAVIOUR-001": "Compare how a resistor behaves the same way under AC or DC supply (Ohm's law applies using RMS values), while an inductor or capacitor's opposition to current depends on whether the supply is AC or DC.",
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
    "EL-COMPONENT-CAPACITOR-001": "A capacitor is a component that stores electrical charge and energy by separating charge in an electric field between two conductive plates; a charged capacitor stores this energy in the electric field between its plates.",
    "EL-COMPONENT-CAPACITOR-TRANSIENT-001": "A capacitor opposes a sudden change in the voltage across it: connected in a circuit with resistance, it charges and discharges exponentially over time (governed by the time constant tau = R times C) rather than the voltage across it changing instantaneously.",
    "EL-COMPONENT-DIAC-001": "A DIAC is a bidirectional thyristor that remains a high-impedance, non-conducting device until the voltage across it exceeds its breakover voltage, at which point it switches into conduction in either direction; it is almost never used alone, but to trigger other thyristor devices.",
    "EL-COMPONENT-DIODE-001": "A diode is a semiconductor device formed at a p-n junction that conducts current easily in one direction (forward bias, depletion layer narrows) and blocks current in the other direction (reverse bias, depletion layer widens).",
    "EL-COMPONENT-INVERTER-001": "An inverter converts a direct-current supply into an alternating-current output, by using electronic switching circuits to switch the DC input in a controlled sequence and generate the AC voltage or current waveform.",
    "EL-COMPONENT-LED-001": "A light-emitting diode (LED) produces light by electroluminescence: when forward-biased, recombination of electrons and holes at the junction releases energy as photons.",
    "EL-COMPONENT-PHOTODIODE-001": "A photodiode is a diode optimised to generate a photocurrent in response to incident light falling on its junction, allowing it to detect or measure light.",
    "EL-COMPONENT-RECTIFIER-001": "A rectifier circuit uses one or more diodes to convert an alternating-current supply into a direct-current (or pulsating direct-current) output.",
    "EL-COMPONENT-RECTIFIER-FULL-WAVE-001": "A full-wave bridge rectifier uses four diodes arranged so that both half-cycles of an AC waveform are converted to the same output polarity, producing a pulsating DC output with less ripple than a half-wave rectifier.",
    "EL-COMPONENT-RECTIFIER-HALF-WAVE-001": "A half-wave rectifier uses a single diode to allow only one half-cycle of an AC waveform through to the load, blocking the other half-cycle, producing a pulsating DC output.",
    "EL-COMPONENT-RESISTOR-001": "A resistor is a component manufactured to provide a specific, stable value of resistance, used in circuits to limit current or to divide voltage.",
    "EL-COMPONENT-THERMISTOR-001": "An NTC (negative-temperature-coefficient) thermistor's electrical resistance decreases as its temperature increases, allowing it to be used as a temperature-sensing component.",
    "EL-COMPONENT-THERMISTOR-PTC-001": "A PTC (positive-temperature-coefficient) thermistor's electrical resistance increases as its temperature increases, in contrast to an NTC thermistor's resistance, which decreases as temperature increases.",
    "EL-COMPONENT-THYRISTOR-SCR-001": "A silicon-controlled rectifier (SCR) conducts current in one direction only once a sufficient gate current triggers it into conduction, and continues conducting until the current through it falls below the device's holding current.",
    "EL-COMPONENT-TRANSISTOR-001": "A bipolar junction transistor is a three-terminal semiconductor device whose collector-emitter current is controlled by a much smaller base current, allowing it to act as an electrically controlled switch (fully off with no base current, fully on/saturated with sufficient base current) or as an amplifier.",
    "EL-COMPONENT-TRIAC-001": "A TRIAC acts much like two silicon-controlled rectifiers connected back-to-back, allowing it to conduct current in both directions once triggered by gate current, making it suitable for controlling alternating current.",
    "EL-COMPONENT-ZENER-DIODE-001": "A Zener diode is a special-purpose diode designed to be operated in reverse breakdown at a well-defined breakdown voltage without damage, so it maintains a substantially constant voltage across itself and can be used to regulate voltage.",
    "EL-CONCEPT-AC-DC-DISTINCTION-001": "Direct current (D.C.) flows in one direction, and its magnitude may be steady or may vary (as with pulsating D.C.); alternating current (A.C.) periodically reverses direction and ordinarily varies in magnitude, typically following a sine wave.",
    "EL-CONCEPT-AC-GENERATOR-001": "A simple AC generator produces an alternating EMF by rotating a single loop of wire at constant speed within a magnetic field, continuously changing the flux linking the loop.",
    "EL-CONCEPT-CONDUCTOR-001": "A metallic conductor is a material containing many free electrons, which allows electric current (the flow of those electrons) to pass through it easily.",
    "EL-CONCEPT-CURRENT-001": "Electric current is the rate of flow of electric charge through a conductor.",
    "EL-CONCEPT-ELECTROMAGNETIC-INDUCTION-001": "A changing magnetic flux through a circuit or coil induces an electromotive force (EMF) in that circuit -- the principle of electromagnetic induction.",
    "EL-CONCEPT-ELECTROMAGNETISM-001": "Electromagnetism is the branch of physics concerned with the relationship between electric current and magnetic fields, including how one can produce the other.",
    "EL-CONCEPT-ELECTRON-THEORY-001": "In a metallic conductor, electric current is the flow of free electrons, driven by a potential difference across the conductor.",
    "EL-CONCEPT-EMF-001": "Electromotive force (EMF) is the electrical energy per unit charge supplied by a source, which drives current around a circuit.",
    "EL-CONCEPT-FIELD-DIRECTION-RULE-001": "The direction of the magnetic field around a straight current-carrying conductor is given by Maxwell's screw rule (equivalently, the right-hand rule): grip the conductor with the RIGHT hand so the thumb points in the direction of conventional current flow -- the curled fingers then give the direction of the circular field around the conductor.",
    "EL-CONCEPT-FLEMING-LEFT-HAND-001": "Fleming's left-hand rule gives the direction of the force on a current-carrying conductor in a magnetic field: with the First finger, seCond finger and thuMb of the left hand mutually at right angles, the First finger points along the Field, the seCond finger along the Current, and the thuMb gives the direction of Motion (force).",
    "EL-CONCEPT-FLEMING-RIGHT-HAND-001": "Fleming's right-hand rule gives the direction of the current induced in a conductor moving through a magnetic field: with the thumb, First finger and seCond finger of the right hand mutually at right angles, the thumb points in the direction of Motion, the First finger along the Field, and the seCond finger gives the direction of the induced Current.",
    "EL-CONCEPT-FORCE-ON-CONDUCTOR-001": "A current-carrying conductor placed in a magnetic field experiences a mechanical force.",
    "EL-CONCEPT-FREQUENCY-001": "Frequency is the number of complete cycles of a repeating waveform that occur in one second.",
    "EL-CONCEPT-INSULATOR-001": "Compared to a metallic conductor, an insulator is a material with very few free electrons available to move, which strongly opposes the flow of electric current through it.",
    "EL-CONCEPT-MAGNETIC-FIELD-CURRENT-001": "A current-carrying conductor produces a magnetic field around it.",
    "EL-CONCEPT-MAGNETIC-FLUX-001": "Magnetic flux is a measure of the total amount of magnetic field passing through a given area.",
    "EL-CONCEPT-MAGNETIC-FLUX-DENSITY-001": "Magnetic flux density is the amount of magnetic flux passing through a unit area, describing how concentrated a magnetic field is.",
    "EL-CONCEPT-MAGNETISM-001": "Magnetic poles exert forces on one another: like poles repel and unlike poles attract.",
    "EL-CONCEPT-MOTOR-PRINCIPLE-001": "An electric motor uses the force on a current-carrying conductor in a magnetic field to produce rotational motion.",
    "EL-CONCEPT-PEAK-VS-RMS-SUPPLY-INTERPRETATION-001": "The rated voltage of an AC supply refers to its RMS value, not its peak value, which is higher.",
    "EL-CONCEPT-RESISTANCE-001": "Electrical resistance is the opposition a component presents to the flow of electric current.",
    "EL-CONCEPT-RESISTIVITY-001": "Resistivity is a material property describing how strongly a material opposes current flow, independent of the conductor's length or cross-sectional area.",
    "EL-CONCEPT-SINE-WAVE-001": "The EMF produced by a simple rotating-loop AC generator varies with time as a sine wave.",
    "EL-CONCEPT-TERMINAL-VOLTAGE-001": "Terminal voltage is the potential difference measured across the terminals of a source while it is supplying current, which is less than its EMF due to the source's own internal resistance.",
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
    "EL-MAGNETISM-COMPARE-PERMANENT-ELECTROMAGNET-001": "Compare a permanent magnet, which retains its magnetism without a current, with an electromagnet, whose magnetic field depends on a current flowing through a coil.",
    "EL-MATERIAL-CONDUCTOR-INSULATOR-EXAMPLES-001": "Common conductors used in electrical installation work include copper and aluminium; common insulators include PVC and rubber.",
    "EL-MOTOR-GENERATOR-COMPARE-001": "Compare an electric motor, which converts electrical energy into mechanical motion using force on a current-carrying conductor, with a generator, which converts mechanical motion into electrical energy using electromagnetic induction.",
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
    "EL-REL-FLUX-CHANGE-EMF-001": "The magnitude of the EMF induced in a single loop equals the rate of change of the magnetic flux through it: e = (change in flux) / (time taken).",
    "EL-REL-FORCE-ON-CONDUCTOR-001": "The magnitude of the force on a straight current-carrying conductor at right angles to a magnetic field is given by F = B I l, where B is the magnetic flux density, I is the current and l is the length of the conductor in the field.",
    "EL-REL-INDUCED-EMF-001": "For a straight conductor of effective length l moving through a magnetic field of flux density B, the magnitude of the induced EMF is given by e = B l v (where v is the conductor's velocity) when the conductor's length, its velocity and the magnetic field are all mutually perpendicular (at right angles) to one another.",
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
    "EL-UNIT-TESLA-001": "The tesla (T) is the SI derived unit of magnetic flux density.",
    "EL-UNIT-VOLT-001": "The volt (V) is the SI derived unit of electric potential difference (voltage).",
    "EL-UNIT-WATT-001": "The watt (W) is the SI derived unit of power.",
    "EL-UNIT-WEBER-001": "The weber (Wb) is the SI derived unit of magnetic flux.",
    "EL-WAVEFORM-AMPLITUDE-001": "Amplitude is the maximum displacement of a waveform from its zero (mean) value.",
    "EL-WAVEFORM-AVERAGE-VALUE-001": "The conventional (non-zero) average value quoted for an alternating waveform in AC calculations is the average taken over one half-cycle of the waveform; this is equivalent to averaging the full-wave-rectified waveform over a complete cycle, since rectification makes every half-cycle the same shape.",
    "EL-WAVEFORM-AVERAGE-ZERO-INTERPRETATION-001": "The average value of a symmetrical sine wave taken over a full cycle is zero, because the positive and negative half-cycles cancel; the conventional non-zero 'average value' quoted for AC calculations is instead taken over one half-cycle, equivalently the average of the full-wave-rectified waveform over a full cycle.",
    "EL-WAVEFORM-FREQUENCY-CALC-001": "Calculate frequency from periodic time, or periodic time from frequency, using their reciprocal relationship.",
    "EL-WAVEFORM-FREQUENCY-PERIOD-RELATIONSHIP-001": "Frequency and periodic time are reciprocals of each other: frequency equals one divided by periodic time.",
    "EL-WAVEFORM-PEAK-TO-PEAK-001": "The peak-to-peak value of a waveform is the difference between its maximum positive and maximum negative values.",
    "EL-WAVEFORM-PERIODIC-TIME-001": "Periodic time is the time taken to complete one full cycle of a repeating waveform.",
    "EL-WAVEFORM-RMS-001": "The RMS (root mean square) value of an alternating quantity is the value of direct current or voltage that would produce the same heating effect in a resistor.",
    "EL-WAVEFORM-RMS-CALC-001": "Calculate the RMS value of a sine wave from its peak value, or the peak value from its RMS value.",
    "EL-WAVEFORM-RMS-PEAK-RELATIONSHIP-001": "For a pure sine wave, the RMS value equals the peak value divided by the square root of two.",
    "FM-ALG-EQUALITY-ADD-001": "In an equation, adding or subtracting the same value from both sides preserves the equality between the two sides.",
    "FM-ALG-EQUALITY-MULT-001": "In an equation, multiplying or dividing both sides by the same non-zero value preserves the equality between the two sides.",
    "FM-ALG-INVERSE-OPS-ADD-001": "Addition and subtraction are inverse operations: subtracting a number undoes adding that number, and vice versa.",
    "FM-ALG-INVERSE-OPS-MULT-001": "Multiplication and division are inverse operations: dividing by a non-zero number undoes multiplying by that number, and vice versa.",
    "FM-ALG-TRANSPOSE-ADD-001": "Given a relationship of the form a = b + c, rearrange it algebraically to make b or c the subject.",
    "FM-ALG-TRANSPOSE-MULT-001": "Given a relationship of the form a = b times c, rearrange it algebraically to make b or c the subject.",
    "FP-CALC-EFFICIENCY-001": "Calculate the efficiency of a process as a percentage from its useful output and total input.",
    "FP-CALC-KINETIC-ENERGY-001": "Calculate the kinetic energy of an object from its mass and speed, using KE = one half times m times v squared.",
    "FP-CALC-POTENTIAL-ENERGY-001": "Calculate the gravitational potential energy of an object from its mass, gravitational field strength and height, using GPE = m times g times h.",
    "FP-CALC-POWER-001": "Calculate power from known work done (or energy transferred) and time taken, using P = W / t.",
    "FP-CALC-WORK-001": "Calculate the work done by a force from its magnitude and the distance moved in its direction, using W = F times d.",
    "FP-CONCEPT-EFFICIENCY-001": "Efficiency is the ratio of useful energy or power output to total energy or power input, usually expressed as a percentage.",
    "FP-CONCEPT-ENERGY-001": "Energy is the capacity to do work, and exists in different forms including kinetic energy (due to motion) and potential energy (due to position or state).",
    "FP-CONCEPT-FORCE-001": "A force is a push or a pull that can change the motion, shape or state of rest of an object.",
    "FP-CONCEPT-GEAR-001": "A gear is a toothed wheel; when two gears mesh, their teeth engage so that one gear (the driving gear) transmits rotary motion and torque to the other (the driven gear) from one shaft to another.",
    "FP-CONCEPT-KINETIC-ENERGY-001": "Kinetic energy is the energy an object possesses because of its motion.",
    "FP-CONCEPT-LEVER-PRINCIPLE-001": "A lever is a rigid bar that rotates about a fixed pivot (fulcrum); the mechanical advantage it provides depends on the ratio of the effort's distance from the pivot to the load's distance from the pivot.",
    "FP-CONCEPT-MASS-001": "Mass is the amount of matter in an object, measured in kilograms.",
    "FP-CONCEPT-MECHANICAL-ADVANTAGE-001": "A simple machine such as a lever, gear or pulley provides mechanical advantage: the ratio of the output (load) effect it produces to the input (effort) applied -- commonly output force divided by input force for a lever or pulley, or the corresponding output torque divided by input torque for a gear.",
    "FP-CONCEPT-POTENTIAL-ENERGY-001": "Gravitational potential energy is the energy an object possesses because of its position (height) within a gravitational field.",
    "FP-CONCEPT-POWER-001": "Power is the rate at which work is done or energy is transferred.",
    "FP-CONCEPT-PULLEY-001": "A pulley is a wheel with a grooved rim, used with a rope or cable running over it to change the direction of an applied force and/or to provide mechanical advantage.",
    "FP-CONCEPT-WEIGHT-001": "Weight is the force of gravity acting on an object's mass, measured in newtons.",
    "FP-CONCEPT-WORK-001": "Work is done when a force causes its point of application to move through a distance in the direction of the force.",
    "FP-LEVER-CLASS-I-001": "In a class I lever, the pivot is positioned between the effort and the load (for example a see-saw or a pair of pliers).",
    "FP-LEVER-CLASS-II-001": "In a class II lever, the load is positioned between the pivot and the effort (for example a wheelbarrow).",
    "FP-LEVER-CLASS-III-001": "In a class III lever, the effort is positioned between the pivot and the load (for example a pair of tweezers or the human forearm).",
    "FP-PULLEY-FIXED-VS-MOVABLE-001": "A single fixed pulley has a mechanical advantage of one -- it changes the direction of the effort but does not reduce the force needed; a movable pulley, or a combination of pulleys, can provide a mechanical advantage greater than one.",
    "FP-REL-GEAR-RATIO-001": "For two meshed gears, mechanical advantage (the ratio of output torque to input torque) equals the ratio of their radii (the driven gear's radius to the driving gear's radius); because gear teeth are evenly spaced and shared between meshed gears, a gear's radius is proportional to its number of teeth, so this same mechanical advantage can equivalently be expressed as the ratio of their tooth counts (driven tooth count to driving tooth count).",
    "FP-REL-KINETIC-ENERGY-001": "Kinetic energy is calculated from an object's mass and speed using KE = one half times m times v squared.",
    "FP-REL-LEVER-BALANCE-001": "A lever is in balance (equilibrium) when the effort multiplied by its distance from the pivot equals the load multiplied by its distance from the pivot; this relationship can be used to calculate the effort needed to balance a known load, or vice versa.",
    "FP-REL-POTENTIAL-ENERGY-001": "Gravitational potential energy near the Earth's surface is calculated from an object's mass, gravitational field strength and height using GPE = m times g times h.",
    "FP-REL-POWER-WORK-TIME-001": "Power is calculated by dividing the work done (or energy transferred) by the time taken: P = W / t.",
    "FP-REL-PULLEY-FORCE-DISTANCE-TRADEOFF-001": "The mechanical advantage a pulley system provides in reduced effort force is accompanied by a proportional increase in the distance the effort must move to lift the load.",
    "FP-REL-PULLEY-MECHANICAL-ADVANTAGE-001": "For a movable or combination pulley system, the mechanical advantage is approximately equal to the number of rope or cable sections that directly support the load.",
    "FP-REL-WEIGHT-MASS-001": "Weight is calculated from mass and gravitational field strength using W = m times g.",
    "FP-REL-WORK-FORCE-DISTANCE-001": "Work done is calculated by multiplying the force applied by the distance moved in the direction of that force: W = F times d."
  },
  "misconceptionDescriptions": {
    "MIS-EL-AC-DC-CONFUSION-001": "Treats alternating current and direct current as the same, or believes an AC supply has a single constant unchanging value like a DC supply.",
    "MIS-EL-CONDUCTOR-INSULATOR-CONFUSION-001": "Confuses which materials are good conductors versus insulators, or believes conductivity and resistance are unrelated properties.",
    "MIS-EL-CURRENT-VOLTAGE-CONFUSION-001": "Confuses current and voltage as concepts, for example treating current as something a source 'has' independent of the circuit rather than voltage driving current through resistance.",
    "MIS-EL-DIODE-DIRECTION-CONFUSION-001": "Confuses which direction a diode allows current to flow (forward bias) versus blocks it (reverse bias), or assumes a diode conducts equally in both directions like a plain resistor.",
    "MIS-EL-ELECTRON-CURRENT-DIRECTION-CONFUSION-001": "Confuses conventional current direction (positive to negative) with the actual direction of electron flow (negative to positive) in a conductor.",
    "MIS-EL-EMF-VOLTAGE-CONFUSION-001": "Confuses EMF (the source's own electrical energy per unit charge) with terminal voltage, treating them as always identical rather than recognising terminal voltage is reduced by the source's internal resistance when supplying current.",
    "MIS-EL-ENERGY-UNIT-CONFUSION-001": "Confuses the joule and the kilowatt-hour as interchangeable without converting between them, or is unaware that they measure the same quantity (energy) at different scales.",
    "MIS-EL-FLEMING-FINGER-ASSIGNMENT-CONFUSION-001": "Mixes up which finger in Fleming's left-hand rule represents Field, Current and Motion (force) -- e.g. treating the thumb as current or the first finger as motion -- rather than the governed First finger=Field, seCond finger=Current, thuMb=Motion mapping.",
    "MIS-EL-INSTRUMENT-CONNECTION-CONFUSION-001": "Connects a voltmeter in series or an ammeter in parallel, swapping the correct connection method for the two instruments.",
    "MIS-EL-OHM-REARRANGE-ERROR-001": "Incorrectly rearranges a multiplicative relationship such as V = I times R or P = V times I (for example moving a variable to the wrong side, or inverting the wrong pair of variables) when isolating a different subject.",
    "MIS-EL-OHM-UNRELATED-SYMBOLS-001": "Treats V, I and R as three unrelated symbols to memorise rather than as a single relationship connecting voltage, current and resistance (V = I times R).",
    "MIS-EL-OHM-WRONG-OPERATION-001": "Selects the wrong arithmetic operation when calculating an unknown quantity from V = I times R (for example multiplying instead of dividing when solving for current or resistance, or dividing the two known quantities in the wrong order).",
    "MIS-EL-PARALLEL-RESISTANCE-ADDITION-001": "Calculates the total resistance of a parallel circuit by simply adding the branch resistances, as if they were in series, instead of using the reciprocal-of-sum-of-reciprocals relationship.",
    "MIS-EL-PEAK-RMS-CONFUSION-001": "Confuses the peak value of an AC waveform with its RMS value, for example assuming a stated AC supply voltage (such as 230 V) is a peak value rather than an RMS value.",
    "MIS-EL-RECIPROCAL-FORGOTTEN-INVERT-001": "Correctly sums the reciprocals of the branch resistances in a parallel circuit but forgets to take the reciprocal of the result, giving an answer that is the reciprocal of the correct total resistance rather than the total resistance itself.",
    "MIS-EL-SERIES-PARALLEL-CONFUSION-001": "Confuses series and parallel circuit structure, for example treating components wired in parallel as if they were in series (or vice versa) when identifying current and voltage relationships.",
    "MIS-EL-SI-PREFIX-ERROR-001": "Confuses SI-prefix magnitudes when converting between units (for example treating milliamps and amps as numerically equal, or converting in the wrong direction, such as multiplying instead of dividing by the scale factor).",
    "MIS-EL-UNIT-CONFUSION-001": "Confuses the electrical quantities voltage, current, resistance, power and energy with their SI units (volt, ampere, ohm, watt, joule), or attaches the wrong unit to the wrong quantity."
  }
};
