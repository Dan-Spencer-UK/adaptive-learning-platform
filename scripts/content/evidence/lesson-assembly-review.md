# Lesson assembly review

Generated from `@alp/learning-engine`'s deterministic assembler against the live canonical Ohm's Law lesson, plus small clearly-labelled SYNTHETIC fixtures where the real lesson does not exercise a mechanism. Not hand-edited -- regenerate with `node scripts/content/generate-lesson-assembly-review.ts`. See `npm run lesson:assembly:prove` for the machine-checked pass/fail gate this review is drawn from.

## Scenario A -- new learner (REAL content)

No prior evidence at all. Every required real step is included; the misconception-triggered remediation step is correctly excluded from the pre-session sequence (it is only reachable via within-session branching).

Status: **ready** -- instance `5665ca1f` (15/16 steps included)

| Step | Included | Reason | Detail |
|---|---|---|---|
| `orientation` | included | required | Step is unconditionally required by the canonical plan. |
| `activate_prior_knowledge` | included | required | Step is unconditionally required by the canonical plan. |
| `introduce_relationship` | included | required | Step is unconditionally required by the canonical plan. |
| `formula_and_mnemonic_representation` | included | required | Step is unconditionally required by the canonical plan. |
| `interpret_variables_and_units` | included | required | Step is unconditionally required by the canonical plan. |
| `worked_example_solve_voltage` | included | required | Step is unconditionally required by the canonical plan. |
| `guided_calculation_current` | included | required | Step is unconditionally required by the canonical plan. |
| `misconception_check_wrong_operation` | included | required | Step is unconditionally required by the canonical plan. |
| `independent_question_resistance` | included | required | Step is unconditionally required by the canonical plan. |
| `select_rearrangement_transfer` | included | required | Step is unconditionally required by the canonical plan. |
| `misconception_check_rearrangement` | included | required | Step is unconditionally required by the canonical plan. |
| `remediation_rearrangement` | OMITTED | conditional_remediation_not_entered | Remediation-only step; entered only via within-session branching, never part of the initial pre-session sequence. |
| `plausibility_check_transfer` | included | required | Step is unconditionally required by the canonical plan. |
| `retrieval_check` | included | required | Step is unconditionally required by the canonical plan. |
| `recap` | included | required | Step is unconditionally required by the canonical plan. |
| `exit_completion` | included | required | Step is unconditionally required by the canonical plan. |

## Scenarios C & D -- misconception-specific within-session routing (REAL content)

Pre-session assembly is identical to Scenario A (every misconception-check step is `required`; only the resulting *within-session* branch differs). This shows `resolveWithinSessionBranch`'s real routing decisions once a specific governed misconception is evidenced -- not a whole-lesson reassembly.

| Completed step | Observed outcome | Routes to |
|---|---|---|
| `misconception_check_wrong_operation` | misconception `MIS-EL-OHM-WRONG-OPERATION-001` detected | `remediation_rearrangement` |
| `misconception_check_wrong_operation` | plain wrong answer (no specific misconception evidenced) | *(no route -- continues to next step)* |
| `misconception_check_rearrangement` | misconception `MIS-EL-OHM-REARRANGE-ERROR-001` detected | `remediation_rearrangement` |
| `remediation_rearrangement` | remediation cleared | `plausibility_check_transfer` |

## Scenario E -- prerequisite weakness

**[REAL]** With only the live corpus (no governed remediation lesson yet targets any of the real lesson's prerequisite families):

Status: **prerequisite_unresolved** -- `foundational.algebraic_technique` (no_candidate_lesson). The learner is not silently taught as if the weakness did not exist.

**[SYNTHETIC]** With a synthetic remediation lesson added to the manifest (proves the mechanism resolves to an actual remediation lesson's own assembled sequence, not just reports the family id):

Status: **prerequisite_required** -- unmet family `foundational.algebraic_technique`; main lesson `lesson.electrical.ohms-law` deferred until the prerequisite is cleared.

Prerequisite instance `788f79e3` (lesson `lesson.synthetic.prove-lesson-assembly.algebraic-technique-remediation`):

| Step | Included | Reason | Detail |
|---|---|---|---|
| `start` | included | required | Step is unconditionally required by the canonical plan. |
| `end` | included | required | Step is unconditionally required by the canonical plan. |

## Scenario G -- same-input replay (REAL content)

Two independent assemblies of the same lesson with identical evidence: same instance id `bf905a40` both times.

## Scenario B -- skip-if-mastered (SYNTHETIC ONLY)

The real Ohm's Law lesson has no `conditional_skip_if_mastered` step (task brief §7/§20: never distort real content to exercise a mechanism it doesn't have). This uses a small synthetic fixture lesson instead.

Strong returning learner (`TRANSFER_SECURE`):

Status: **ready** -- instance `08c7e416` (1/2 steps included)

| Step | Included | Reason | Detail |
|---|---|---|---|
| `practice` | OMITTED | capability_mastered_skip | Capability 'cap.synthetic.skip_target' status is 'TRANSFER_SECURE' -- skip permitted. |
| `end` | included | required | Step is unconditionally required by the canonical plan. |

Not-yet-mastered learner (`EMERGING`):

Status: **ready** -- instance `58d3e4cf` (2/2 steps included)

| Step | Included | Reason | Detail |
|---|---|---|---|
| `practice` | included | capability_not_yet_mastered | Capability 'cap.synthetic.skip_target' status is 'EMERGING' -- not yet strong enough to skip. |
| `end` | included | required | Step is unconditionally required by the canonical plan. |

## Scenario F -- retrieval due (SYNTHETIC ONLY)

The real lesson's `retrieval_check` step is deliberately `required` (unconditional distributed practice), not conditional on a due schedule. This uses a small synthetic fixture lesson instead.

Retrieval tag due:

Status: **ready** -- instance `de419c27` (2/2 steps included)

| Step | Included | Reason | Detail |
|---|---|---|---|
| `retrieval` | included | retrieval_due | A retrieval tag/capability relevant to this step is currently due. |
| `end` | included | required | Step is unconditionally required by the canonical plan. |

Nothing due:

Status: **ready** -- instance `1de4db83` (1/2 steps included)

| Step | Included | Reason | Detail |
|---|---|---|---|
| `retrieval` | OMITTED | retrieval_not_due | No retrieval tag/capability relevant to this step is currently due. |
| `end` | included | required | Step is unconditionally required by the canonical plan. |

## Real-content gaps (mechanism proven; not yet exercised by real governed content)

- No governed lesson yet targets any of lesson.electrical.ohms-law's real prerequisite families (foundational.algebraic_technique, foundational.arithmetic_technique, foundational.proportion_and_units, electrical.si_units, electrical.core_quantities) -- prerequisite-remediation ROUTING (a WEAK prerequisite resolving to an actual remediation lesson, not just correctly reporting 'unresolved') is proven only against a synthetic remediation lesson below, not real content.
- The real Ohm's Law lesson has no conditional_skip_if_mastered step -- skip-on-mastery is proven only against a synthetic lesson below.
- The real Ohm's Law lesson's retrieval_check step is deliberately `required` (unconditional distributed practice), not conditional_skip_if_mastered -- due/not-due retrieval participation is proven only against a synthetic lesson below.

