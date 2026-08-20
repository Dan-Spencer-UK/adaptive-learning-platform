# Lesson Plan review

Generated from `@alp/content-schema`'s governed `LessonPlan` manifest and the live CC-05A/CC-04 corpus. Not hand-edited -- regenerate with `node scripts/content/generate-lesson-review.ts`.

Lessons: 1

## Ohm's Law (`lesson.electrical.ohms-law`, v1)

Understand how voltage, current and resistance relate through V = I x R, and use that relationship confidently in either direction.

- **Curriculum unit:** City & Guilds 2365-02 Unit 202 -- Principles of Electrical Science
- **Estimated duration:** 20 minutes
- **Instructional strategy:** Concept introduced once, then practised immediately through calculation, flexible rearrangement and plausibility judgement; two governed misconceptions are actively discriminated for (not merely hoped not to occur), each routing to the same explicit remediation step before the learner is allowed to exit; independent-question and transfer steps prove the skill generalises rather than being memorised for one direction only.
- **Prerequisite knowledge (assertion families):** foundational.algebraic_technique, foundational.arithmetic_technique, foundational.proportion_and_units, electrical.si_units, electrical.core_quantities
- **Target assertion families:** electrical.ohms_law
- **Target assertions:** **EL-OHM-RELATIONSHIP-001**: For a component obeying Ohm's law, potential difference, current and resistance are related by V = I times R.; **EL-OHM-PROPORTIONALITY-001**: At constant resistance, current is directly proportional to voltage; at constant voltage, current is inversely proportional to resistance.; **EL-OHM-REARRANGE-001**: Rearrange V = I times R algebraically to make voltage, current or resistance the subject.; **EL-OHM-SOLVE-V-001**: Calculate an unknown voltage from known current and resistance using V = I times R.; **EL-OHM-SOLVE-I-001**: Calculate an unknown current from known voltage and resistance by rearranging and applying V = I times R.; **EL-OHM-SOLVE-R-001**: Calculate an unknown resistance from known voltage and current by rearranging and applying V = I times R.; **EL-OHM-SELECT-RELATIONSHIP-001**: Select the correct arrangement of V = I times R to use, based on which two quantities are known and which quantity is required.
- **Target capabilities:** **cap.ohms_law.recognise_relationship**: Recognise that V, I and R are related by V = I x R.; **cap.ohms_law.solve_for_voltage**: Calculate voltage from known current and resistance.; **cap.ohms_law.solve_for_current**: Calculate current from known voltage and resistance.; **cap.ohms_law.solve_for_resistance**: Calculate resistance from known voltage and current.; **cap.ohms_law.select_rearrangement**: Select the correct rearrangement of V = I x R for the quantity being solved.; **cap.ohms_law.apply_correct_unit**: Match each Ohm's-law variable to its correct SI unit.; **cap.ohms_law.apply_substitution**: Substitute known values into a chosen Ohm's-law rearrangement and show intermediate working.; **cap.ohms_law.check_plausibility**: Judge whether a calculated Ohm's-law result is physically plausible.; **cap.ohms_law.diagnose_rearrangement_error**: Diagnose an incorrect algebraic rearrangement of V = I x R.; **cap.ohms_law.diagnose_wrong_operation**: Diagnose use of the wrong arithmetic operation (multiply instead of divide, or vice versa) when applying V = I x R.
- **Misconceptions actively targeted by this lesson:** **MIS-EL-OHM-UNRELATED-SYMBOLS-001** (generic): Treats V, I and R as three unrelated symbols to memorise rather than as a single relationship connecting voltage, current and resistance (V = I times R).; **MIS-EL-OHM-WRONG-OPERATION-001** (direct): Selects the wrong arithmetic operation when calculating an unknown quantity from V = I times R (for example multiplying instead of dividing when solving for current or resistance, or dividing the two known quantities in the wrong order).; **MIS-EL-OHM-REARRANGE-ERROR-001** (direct): Incorrectly rearranges a multiplicative relationship such as V = I times R or P = V times I (for example moving a variable to the wrong side, or inverting the wrong pair of variables) when isolating a different subject.
- **Presentation modes:** learn, review
- **Content release:** `release.unit202.v1`

### Canonical step sequence (16 steps)

| # | Step | Type | Requirement | Purpose |
|---|---|---|---|---|
| 1 | `orientation` | orientation | required | Frame why the V/I/R relationship matters for real electrical work, not just as an abstract formula. |
| 2 | `activate_prior_knowledge` | guided_interaction | required | Activate prior knowledge of voltage/current/resistance as distinct, related quantities before the formal relationship is stated -- a predictive DO, not a re-explanation. |
| 3 | `introduce_relationship` | concept_explanation | required | State the canonical relationship V = I x R and what it means physically. |
| 4 | `formula_and_mnemonic_representation` | visual_explanation | required | Show every rearrangement of V = I x R and the VIR-triangle mnemonic as a memory aid only -- the mnemonic is never the mathematical authority; formula.ohms_law's own forms are. |
| 5 | `interpret_variables_and_units` | guided_interaction | required | Match each variable in V = I x R to its correct SI unit before calculating with it. |
| 6 | `worked_example_solve_voltage` | worked_example | required | Model substitution and calculation for the canonical target (V) step by step before asking the learner to do it unaided. |
| 7 | `guided_calculation_current` | guided_interaction | required | First learner-performed calculation: solve for current, with scaffolding still present. |
| 8 | `misconception_check_wrong_operation` | misconception_discrimination | required | Directly test for the specific, governed wrong-operation misconception rather than assuming its absence. |
| 9 | `independent_question_resistance` | independent_question | required | Unscaffolded calculation: solve for resistance with no worked example immediately before it. |
| 10 | `select_rearrangement_transfer` | transfer_application | required | Prove the skill generalises: select the correct rearrangement for whichever quantity is unknown, not just the one direction already practised. |
| 11 | `misconception_check_rearrangement` | misconception_discrimination | required | Directly test for the specific, governed algebraic-rearrangement misconception. |
| 12 | `remediation_rearrangement` | remediation | conditional_remediation_only | Reteach algebraic rearrangement of V = I x R using the worked-example machinery again, then require a fresh correct rearrangement/calculation before returning to the main sequence. Entered only via a branch route -- never part of the default linear path. |
| 13 | `plausibility_check_transfer` | transfer_application | required | Vocational-judgement transfer: decide whether a calculated result is physically plausible, not merely arithmetically correct. |
| 14 | `retrieval_check` | retrieval_check | required | Short delayed retrieval of the earliest-practised skill (solving for voltage) to strengthen long-term retention before the lesson ends. |
| 15 | `recap` | recap | required | Summarise the relationship, its rearrangements and the two misconceptions actively checked for in this lesson. |
| 16 | `exit_completion` | exit_completion | required | Confirm lesson completion against the governed completion criteria and surface what was strengthened. |

### Step detail

#### `orientation` -- orientation

Frame why the V/I/R relationship matters for real electrical work, not just as an abstract formula.

- **Teaches:** &mdash;
- **Reinforces:** &mdash;
- **Tests:** &mdash;
- **Capabilities:** &mdash;
- **Misconceptions:** &mdash;
- **Representation:** &mdash;
- **Question/interaction:** &mdash;
- **Interaction:** required=false, answerReveal=not_applicable
- **Scaffolding / cognitive demand:** guided / introductory
- **Feedback:** immediate
- **Completion condition:** view_acknowledged

#### `activate_prior_knowledge` -- guided_interaction

Activate prior knowledge of voltage/current/resistance as distinct, related quantities before the formal relationship is stated -- a predictive DO, not a re-explanation.

- **Teaches:** &mdash;
- **Reinforces:** **EL-CONCEPT-VOLTAGE-001**: Potential difference (voltage) is the electrical energy transferred per unit charge between two points in a circuit.; **EL-CONCEPT-CURRENT-001**: Electric current is the rate of flow of electric charge through a conductor.; **EL-CONCEPT-RESISTANCE-001**: Electrical resistance is the opposition a component presents to the flow of electric current.
- **Tests:** &mdash;
- **Capabilities:** &mdash;
- **Misconceptions:** &mdash;
- **Representation:** &mdash;
- **Question/interaction:** &mdash;
- **Interaction:** required=true, role=predict, answerReveal=after_submission
- **Scaffolding / cognitive demand:** guided / introductory
- **Feedback:** immediate (explains why)
- **Completion condition:** answer_submitted

#### `introduce_relationship` -- concept_explanation

State the canonical relationship V = I x R and what it means physically.

- **Teaches:** **EL-OHM-RELATIONSHIP-001**: For a component obeying Ohm's law, potential difference, current and resistance are related by V = I times R.
- **Reinforces:** &mdash;
- **Tests:** &mdash;
- **Capabilities:** **cap.ohms_law.recognise_relationship**: Recognise that V, I and R are related by V = I x R.
- **Misconceptions:** **MIS-EL-OHM-UNRELATED-SYMBOLS-001** (generic): Treats V, I and R as three unrelated symbols to memorise rather than as a single relationship connecting voltage, current and resistance (V = I times R).
- **Representation:** formula family `formula.ohms_law` (canonical target V)
- **Question/interaction:** &mdash;
- **Interaction:** required=false, answerReveal=not_applicable, contentMayScroll
- **Scaffolding / cognitive demand:** guided / introductory
- **Feedback:** immediate
- **Completion condition:** view_acknowledged

#### `formula_and_mnemonic_representation` -- visual_explanation

Show every rearrangement of V = I x R and the VIR-triangle mnemonic as a memory aid only -- the mnemonic is never the mathematical authority; formula.ohms_law's own forms are.

- **Teaches:** **EL-OHM-REARRANGE-001**: Rearrange V = I times R algebraically to make voltage, current or resistance the subject.
- **Reinforces:** **EL-OHM-PROPORTIONALITY-001**: At constant resistance, current is directly proportional to voltage; at constant voltage, current is inversely proportional to resistance.
- **Tests:** &mdash;
- **Capabilities:** **cap.ohms_law.select_rearrangement**: Select the correct rearrangement of V = I x R for the quantity being solved.
- **Misconceptions:** &mdash;
- **Representation:** formula family `formula.ohms_law` (canonical target V), visual aid `mnemonic.vir_triangle`
- **Question/interaction:** &mdash;
- **Interaction:** required=true, role=interpret, answerReveal=on_request, contentMayScroll
- **Scaffolding / cognitive demand:** guided / introductory
- **Feedback:** immediate (explains why)
- **Completion condition:** view_acknowledged

#### `interpret_variables_and_units` -- guided_interaction

Match each variable in V = I x R to its correct SI unit before calculating with it.

- **Teaches:** &mdash;
- **Reinforces:** **EL-OHM-RELATIONSHIP-001**: For a component obeying Ohm's law, potential difference, current and resistance are related by V = I times R.
- **Tests:** **EL-OHM-RELATIONSHIP-001**: For a component obeying Ohm's law, potential difference, current and resistance are related by V = I times R.
- **Capabilities:** **cap.ohms_law.apply_correct_unit**: Match each Ohm's-law variable to its correct SI unit.
- **Misconceptions:** &mdash;
- **Representation:** formula family `formula.ohms_law` (canonical target V)
- **Question/interaction:** `ohms_law.match_variables_units` -- Match each Ohm's-law variable to its correct SI unit
- **Interaction:** required=true, role=identify, answerReveal=after_submission
- **Scaffolding / cognitive demand:** guided / introductory
- **Feedback:** immediate (explains why)
- **Completion condition:** correct_answer_required

#### `worked_example_solve_voltage` -- worked_example

Model substitution and calculation for the canonical target (V) step by step before asking the learner to do it unaided.

- **Teaches:** &mdash;
- **Reinforces:** **EL-OHM-SOLVE-V-001**: Calculate an unknown voltage from known current and resistance using V = I times R.
- **Tests:** &mdash;
- **Capabilities:** **cap.ohms_law.apply_substitution**: Substitute known values into a chosen Ohm's-law rearrangement and show intermediate working.; **cap.ohms_law.solve_for_voltage**: Calculate voltage from known current and resistance.
- **Misconceptions:** &mdash;
- **Representation:** formula family `formula.ohms_law` (canonical target V), worked example `worked.ohms_law.solve_voltage`
- **Question/interaction:** &mdash;
- **Interaction:** required=true, role=predict, answerReveal=after_submission, contentMayScroll
- **Scaffolding / cognitive demand:** guided / introductory
- **Feedback:** immediate (explains why)
- **Completion condition:** view_acknowledged

#### `guided_calculation_current` -- guided_interaction

First learner-performed calculation: solve for current, with scaffolding still present.

- **Teaches:** &mdash;
- **Reinforces:** &mdash;
- **Tests:** **EL-OHM-SOLVE-I-001**: Calculate an unknown current from known voltage and resistance by rearranging and applying V = I times R.
- **Capabilities:** **cap.ohms_law.solve_for_current**: Calculate current from known voltage and resistance.; **cap.ohms_law.apply_substitution**: Substitute known values into a chosen Ohm's-law rearrangement and show intermediate working.
- **Misconceptions:** &mdash;
- **Representation:** formula family `formula.ohms_law` (canonical target V), worked example `worked.ohms_law.solve_current`
- **Question/interaction:** `ohms_law.solve_for_current` -- Solve for current given voltage and resistance
- **Interaction:** required=true, role=calculate, answerReveal=after_submission
- **Scaffolding / cognitive demand:** guided / introductory
- **Feedback:** immediate (explains why)
- **Completion condition:** correct_answer_required

#### `misconception_check_wrong_operation` -- misconception_discrimination

Directly test for the specific, governed wrong-operation misconception rather than assuming its absence.

- **Teaches:** &mdash;
- **Reinforces:** &mdash;
- **Tests:** **EL-OHM-RELATIONSHIP-001**: For a component obeying Ohm's law, potential difference, current and resistance are related by V = I times R.
- **Capabilities:** **cap.ohms_law.diagnose_wrong_operation**: Diagnose use of the wrong arithmetic operation (multiply instead of divide, or vice versa) when applying V = I x R.
- **Misconceptions:** **MIS-EL-OHM-WRONG-OPERATION-001** (direct): Selects the wrong arithmetic operation when calculating an unknown quantity from V = I times R (for example multiplying instead of dividing when solving for current or resistance, or dividing the two known quantities in the wrong order).
- **Representation:** &mdash;
- **Question/interaction:** `ohms_law.diagnose_wrong_operation` -- Diagnose use of the wrong arithmetic operation when applying V = I x R
- **Interaction:** required=true, role=correct_misconception, answerReveal=after_submission
- **Scaffolding / cognitive demand:** standard / diagnostic
- **Feedback:** immediate (explains why)
- **Completion condition:** correct_answer_required
- **Branch routes:** on `misconception_detected` (`MIS-EL-OHM-WRONG-OPERATION-001`) -> `remediation_rearrangement` -- Route to explicit rearrangement/operation-selection remediation before continuing.

#### `independent_question_resistance` -- independent_question

Unscaffolded calculation: solve for resistance with no worked example immediately before it.

- **Teaches:** &mdash;
- **Reinforces:** &mdash;
- **Tests:** **EL-OHM-SOLVE-R-001**: Calculate an unknown resistance from known voltage and current by rearranging and applying V = I times R.
- **Capabilities:** **cap.ohms_law.solve_for_resistance**: Calculate resistance from known voltage and current.
- **Misconceptions:** &mdash;
- **Representation:** formula family `formula.ohms_law` (canonical target V)
- **Question/interaction:** `ohms_law.solve_for_resistance` -- Solve for resistance given voltage and current
- **Interaction:** required=true, role=calculate, answerReveal=after_submission
- **Scaffolding / cognitive demand:** independent / intermediate
- **Feedback:** immediate (explains why)
- **Completion condition:** correct_answer_required

#### `select_rearrangement_transfer` -- transfer_application

Prove the skill generalises: select the correct rearrangement for whichever quantity is unknown, not just the one direction already practised.

- **Teaches:** &mdash;
- **Reinforces:** &mdash;
- **Tests:** **EL-OHM-SELECT-RELATIONSHIP-001**: Select the correct arrangement of V = I times R to use, based on which two quantities are known and which quantity is required.
- **Capabilities:** **cap.ohms_law.select_rearrangement**: Select the correct rearrangement of V = I x R for the quantity being solved.
- **Misconceptions:** &mdash;
- **Representation:** formula family `formula.ohms_law` (canonical target V)
- **Question/interaction:** `ohms_law.select_rearrangement` -- Select the correct rearrangement of V = I x R for the target quantity
- **Interaction:** required=true, role=select, answerReveal=after_submission
- **Scaffolding / cognitive demand:** independent / intermediate
- **Feedback:** immediate (explains why)
- **Completion condition:** correct_answer_required

#### `misconception_check_rearrangement` -- misconception_discrimination

Directly test for the specific, governed algebraic-rearrangement misconception.

- **Teaches:** &mdash;
- **Reinforces:** &mdash;
- **Tests:** **EL-OHM-REARRANGE-001**: Rearrange V = I times R algebraically to make voltage, current or resistance the subject.
- **Capabilities:** **cap.ohms_law.diagnose_rearrangement_error**: Diagnose an incorrect algebraic rearrangement of V = I x R.
- **Misconceptions:** **MIS-EL-OHM-REARRANGE-ERROR-001** (direct): Incorrectly rearranges a multiplicative relationship such as V = I times R or P = V times I (for example moving a variable to the wrong side, or inverting the wrong pair of variables) when isolating a different subject.
- **Representation:** &mdash;
- **Question/interaction:** `ohms_law.diagnose_rearrangement_error` -- Diagnose an incorrect algebraic rearrangement of V = I x R
- **Interaction:** required=true, role=correct_misconception, answerReveal=after_submission
- **Scaffolding / cognitive demand:** standard / diagnostic
- **Feedback:** immediate (explains why)
- **Completion condition:** correct_answer_required
- **Branch routes:** on `misconception_detected` (`MIS-EL-OHM-REARRANGE-ERROR-001`) -> `remediation_rearrangement` -- Route to the same explicit rearrangement remediation as the wrong-operation check.

#### `remediation_rearrangement` -- remediation

Reteach algebraic rearrangement of V = I x R using the worked-example machinery again, then require a fresh correct rearrangement/calculation before returning to the main sequence. Entered only via a branch route -- never part of the default linear path.

- **Teaches:** **EL-OHM-REARRANGE-001**: Rearrange V = I times R algebraically to make voltage, current or resistance the subject.
- **Reinforces:** &mdash;
- **Tests:** **EL-OHM-SOLVE-I-001**: Calculate an unknown current from known voltage and resistance by rearranging and applying V = I times R.; **EL-OHM-SOLVE-R-001**: Calculate an unknown resistance from known voltage and current by rearranging and applying V = I times R.
- **Capabilities:** **cap.ohms_law.diagnose_rearrangement_error**: Diagnose an incorrect algebraic rearrangement of V = I x R.; **cap.ohms_law.diagnose_wrong_operation**: Diagnose use of the wrong arithmetic operation (multiply instead of divide, or vice versa) when applying V = I x R.
- **Misconceptions:** **MIS-EL-OHM-REARRANGE-ERROR-001** (direct): Incorrectly rearranges a multiplicative relationship such as V = I times R or P = V times I (for example moving a variable to the wrong side, or inverting the wrong pair of variables) when isolating a different subject.; **MIS-EL-OHM-WRONG-OPERATION-001** (direct): Selects the wrong arithmetic operation when calculating an unknown quantity from V = I times R (for example multiplying instead of dividing when solving for current or resistance, or dividing the two known quantities in the wrong order).
- **Representation:** formula family `formula.ohms_law` (canonical target V), worked example `worked.ohms_law.solve_resistance`, visual aid `mnemonic.vir_triangle`
- **Question/interaction:** `ohms_law.solve_for_resistance` -- Solve for resistance given voltage and current
- **Interaction:** required=true, role=calculate, answerReveal=after_submission, contentMayScroll
- **Scaffolding / cognitive demand:** guided / intermediate
- **Feedback:** immediate (explains why)
- **Completion condition:** correct_answer_required
- **Branch routes:** on `remediation_cleared` -> `plausibility_check_transfer` -- Remediation cleared -- resume the main sequence at the plausibility/transfer step.

#### `plausibility_check_transfer` -- transfer_application

Vocational-judgement transfer: decide whether a calculated result is physically plausible, not merely arithmetically correct.

- **Teaches:** &mdash;
- **Reinforces:** **EL-OHM-RELATIONSHIP-001**: For a component obeying Ohm's law, potential difference, current and resistance are related by V = I times R.
- **Tests:** **EL-OHM-RELATIONSHIP-001**: For a component obeying Ohm's law, potential difference, current and resistance are related by V = I times R.
- **Capabilities:** **cap.ohms_law.check_plausibility**: Judge whether a calculated Ohm's-law result is physically plausible.
- **Misconceptions:** &mdash;
- **Representation:** &mdash;
- **Question/interaction:** `ohms_law.plausibility_check` -- Judge whether a calculated Ohm's-law result is physically plausible
- **Interaction:** required=true, role=apply, answerReveal=after_submission
- **Scaffolding / cognitive demand:** independent / advanced
- **Feedback:** immediate (explains why)
- **Completion condition:** correct_answer_required

#### `retrieval_check` -- retrieval_check

Short delayed retrieval of the earliest-practised skill (solving for voltage) to strengthen long-term retention before the lesson ends.

- **Teaches:** &mdash;
- **Reinforces:** &mdash;
- **Tests:** **EL-OHM-SOLVE-V-001**: Calculate an unknown voltage from known current and resistance using V = I times R.
- **Capabilities:** **cap.ohms_law.solve_for_voltage**: Calculate voltage from known current and resistance.
- **Misconceptions:** &mdash;
- **Representation:** formula family `formula.ohms_law` (canonical target V)
- **Question/interaction:** `ohms_law.solve_for_voltage` -- Solve for voltage given current and resistance
- **Interaction:** required=true, role=calculate, answerReveal=after_submission
- **Scaffolding / cognitive demand:** independent / introductory
- **Feedback:** immediate (explains why)
- **Completion condition:** correct_answer_required

#### `recap` -- recap

Summarise the relationship, its rearrangements and the two misconceptions actively checked for in this lesson.

- **Teaches:** &mdash;
- **Reinforces:** **EL-OHM-RELATIONSHIP-001**: For a component obeying Ohm's law, potential difference, current and resistance are related by V = I times R.; **EL-OHM-REARRANGE-001**: Rearrange V = I times R algebraically to make voltage, current or resistance the subject.
- **Tests:** &mdash;
- **Capabilities:** &mdash;
- **Misconceptions:** &mdash;
- **Representation:** formula family `formula.ohms_law` (canonical target V)
- **Question/interaction:** &mdash;
- **Interaction:** required=false, answerReveal=not_applicable, contentMayScroll
- **Scaffolding / cognitive demand:** independent / introductory
- **Feedback:** immediate
- **Completion condition:** view_acknowledged

#### `exit_completion` -- exit_completion

Confirm lesson completion against the governed completion criteria and surface what was strengthened.

- **Teaches:** &mdash;
- **Reinforces:** &mdash;
- **Tests:** &mdash;
- **Capabilities:** &mdash;
- **Misconceptions:** &mdash;
- **Representation:** &mdash;
- **Question/interaction:** &mdash;
- **Interaction:** required=false, answerReveal=not_applicable
- **Scaffolding / cognitive demand:** independent / introductory
- **Feedback:** immediate
- **Completion condition:** view_acknowledged

### Completion criteria

- **Required steps:** `orientation`, `activate_prior_knowledge`, `introduce_relationship`, `formula_and_mnemonic_representation`, `interpret_variables_and_units`, `worked_example_solve_voltage`, `guided_calculation_current`, `misconception_check_wrong_operation`, `independent_question_resistance`, `select_rearrangement_transfer`, `misconception_check_rearrangement`, `plausibility_check_transfer`, `retrieval_check`, `recap`, `exit_completion`
- **Required capability evidence:** **cap.ohms_law.solve_for_voltage**: Calculate voltage from known current and resistance.; **cap.ohms_law.solve_for_current**: Calculate current from known voltage and resistance.; **cap.ohms_law.solve_for_resistance**: Calculate resistance from known voltage and current.; **cap.ohms_law.select_rearrangement**: Select the correct rearrangement of V = I x R for the quantity being solved.; **cap.ohms_law.check_plausibility**: Judge whether a calculated Ohm's-law result is physically plausible.
- **Requires remediation clearance:** true
- **Exit summary:** The learner has calculated voltage, current and resistance from V = I x R, selected the correct rearrangement for an unknown quantity, judged the plausibility of a result, and -- if either governed misconception was detected -- cleared the remediation route before completion.

