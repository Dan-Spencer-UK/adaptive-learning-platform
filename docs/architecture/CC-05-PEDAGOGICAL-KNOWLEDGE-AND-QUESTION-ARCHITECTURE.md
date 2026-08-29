# CC-05 Pedagogical Knowledge Structure, Question Blueprinting, Formula Rendering, and Diagram Architecture

**Project:** Adaptive Learning Platform  
**Status:** Approved durable design specification (Product Owner / Project Architect). CC-05A implements this document's §37 deliverables and is **APPROVED / COMPLETE** (2026-08-16); see [`docs/architecture/evidence/CC-05A-PEDAGOGICAL-BLUEPRINT-BACKFILL.md`](evidence/CC-05A-PEDAGOGICAL-BLUEPRINT-BACKFILL.md). CC-05B (§38) implements the deterministic engine against the full 84/84 governed Unit 202 question-blueprint inventory and is **APPROVED / COMPLETE** (2026-08-16); see [`docs/architecture/evidence/CC-05B-DETERMINISTIC-QUESTION-ENGINE.md`](evidence/CC-05B-DETERMINISTIC-QUESTION-ENGINE.md). CC-05C (§39) is **APPROVED / COMPLETE** (2026-08-17); see [`docs/architecture/evidence/CC-05C-NATIVE-LEARNER-PROVING-SLICE.md`](evidence/CC-05C-NATIVE-LEARNER-PROVING-SLICE.md). CC-05D (§45) is a visual-governance/semantic-QA layer on top of CC-05A/B/C's instructional visuals, specified in its own dedicated document; see [`docs/architecture/CC-05D-INSTRUCTIONAL-VISUAL-GOVERNANCE-AND-SEMANTIC-QA.md`](CC-05D-INSTRUCTIONAL-VISUAL-GOVERNANCE-AND-SEMANTIC-QA.md).  
**Applies to:** CC-05A, CC-05B, CC-05C, CC-05D and future corpus-ingestion / learner-runtime work  
**Primary learner client:** Native mobile app (`apps/mobile`)  
**Secondary client:** Web  
**Design intent:** Convert governed atomic knowledge into a deterministic, visually rich, diagnostically useful learning and assessment system without introducing learner-runtime AI dependency.

---

## 1. Purpose

The current governed corpus contains atomic assertions, relationships, prerequisite structure, curriculum mappings, misconceptions, and provenance. That is the correct knowledge foundation, but an atomic assertion is not yet a lesson, question, diagram, formula presentation, worked example, or diagnostic capability.

CC-05 therefore needs an explicit pedagogical layer between governed assertions and generated learner interactions.

The core model is:

```text
Source
  ↓
Atomic Assertion
  ↓
Assertion Family
  ↓
Capability / Evidence Target
  ↓
Teaching Representation
  ↓
Question Blueprint
  ↓
Deterministic Variant
  ↓
Rendered Question / Lesson Interaction
  ↓
Answer Evaluation
  ↓
Learner Evidence
```

This document defines that layer.

The goal is not to create a conventional question bank containing hundreds of hard-coded questions. The goal is to create a governed set of **pedagogically exhaustive question blueprints** and **representation blueprints** from which deterministic, reproducible learner interactions can be generated.

---

## 2. Core principles

### 2.1 Atomic assertions remain the canonical factual layer

Atomic assertions remain the smallest governed knowledge claims. They retain provenance, curriculum mappings, relationships, prerequisites, and rights metadata.

Do not collapse or rewrite them simply because a pedagogical grouping is added.

### 2.2 Assertion families are a new pedagogical layer

An assertion family groups assertions that describe one relationship, concept, skill, or tightly coupled set of ideas that should normally be learned together.

Example:

```text
Ohm's Law family
├── V = I × R
├── I = V / R
└── R = V / I
```

The learner should not be taught one rearrangement as though it were unrelated to the others.

### 2.3 Teach formula families together

If a lesson is teaching a formula family, the lesson should ordinarily present the entire family together.

For Ohm's Law:

- To find voltage, multiply current by resistance.
- To find current, divide voltage by resistance.
- To find resistance, divide voltage by current.

The lesson should show:

- canonical relationship;
- all required rearrangements;
- variable meanings and units;
- a visual formula presentation;
- any appropriate mnemonic;
- worked examples covering every required target variable.

An individual assessment question may target only one member of the family.

### 2.4 Formulae are visual learning objects

Formulae should not normally appear only as inline prose.

Preferred presentation includes:

- display-rendered formula;
- formula card;
- variable key;
- rearrangement set;
- worked substitution;
- result with units;
- optional mnemonic visual.

Example progression:

```text
I = V / R
I = 24 / 6
I = 4 A
```

The visual layer must be derived from structured formula semantics. Rendering must never be the source of calculation truth.

### 2.5 Mnemonics are learning aids, not formula authority

A VIR triangle is useful, but it is a mnemonic representation, not the mathematical source of truth.

The system must distinguish:

- canonical formula;
- derived formula forms;
- mnemonic or learning aid;
- worked-example representation.

### 2.6 Diagram requirements are governed

Whether a topic or question requires a diagram should not be decided ad hoc by a future UI developer.

Representation requirements must be explicit in content metadata.

### 2.7 Use deterministic vector graphics for core technical imagery

Technical learning graphics should preferably be produced as deterministic SVG or equivalent vector rendering rather than as a large bank of manually created bitmap images.

SVG = Scalable Vector Graphics. An SVG describes lines, shapes, text, arrows, paths, and coordinates rather than storing a fixed grid of pixels. This makes it:

- sharp at different screen sizes;
- appropriate for phone/tablet scaling;
- small and reusable;
- dynamically parameterisable;
- themeable;
- deterministic;
- testable;
- suitable for diagrams, formula triangles, circuits, field arrows, graphs, scales, and other technical visuals.

### 2.8 Separate diagram structure from question values by default

For many generated questions, the diagram should use symbolic labels:

```text
R1
R2
R3
```

while the prompt supplies:

```text
R1 = 6 Ω
R2 = 12 Ω
R3 = 4 Ω
```

This avoids creating hundreds of images containing different numeric values.

When reading a value from the diagram is itself part of the skill being assessed, the SVG renderer may embed generated values directly.

### 2.9 Exhaustive means pedagogically exhaustive, not combinatorially exhaustive

We do not need a separate authored question for every numeric combination.

We do need every **meaningfully distinct assessment operation**.

For example, parallel resistance should cover distinct capabilities such as:

- calculate total resistance for two branches;
- calculate total resistance for three branches;
- calculate total resistance for four branches;
- solve for a missing branch resistance;
- select the correct relationship;
- identify a parallel network;
- predict the effect of adding a branch;
- detect an impossible result;
- diagnose a reciprocal error;
- diagnose a missing final inversion;
- interpret a circuit diagram.

Numbers, branch labels, target resistor, wording, and difficulty are variant dimensions.

### 2.10 Mobile runtime must remain deterministic and AI-free

Learner-variable generation, marking, evidence creation, formula rendering, and diagram generation must not require an LLM.

AI may assist authoring or development, but learner runtime behaviour must remain deterministic.

---

## 3. Assertion families

### 3.1 Definition

An `AssertionFamily` is a governed pedagogical object grouping one or more assertions around a coherent learner concept, relationship, or skill.

Illustrative shape:

```yaml
assertion_family:
  id: electrical.ohms_law
  title: Ohm's Law
  learning_intent:
    understand_and_apply_relationship_between:
      - voltage
      - current
      - resistance

  teaching_policy:
    teach_family_together: true
```

### 3.2 Membership should be relational

Do not assume an assertion can belong to only one family.

Use a membership relation:

```text
AssertionFamilyMembership
-------------------------
family_id
assertion_id
role
sequence
```

Possible roles:

- canonical_form;
- rearranged_form;
- prerequisite_concept;
- consequence;
- sanity_check;
- misconception_guard;
- contextual_application.

This allows one atomic assertion to support more than one pedagogical family without duplication.

### 3.3 Standalone assertions

Some assertions may genuinely not need grouping.

Those should be explicitly classified as:

```text
standalone_assertion
```

with a reason.

Unclassified learner-relevant assertions should not silently pass publication.

---

## 4. Existing corpus: one-time assertion-family backfill

The current CC-04 corpus should receive a one-time governed backfill.

This does **not** mean CC-04 was wrong or incomplete. CC-04 correctly created atomic governed knowledge. Assertion families are a new pedagogical layer required by CC-05.

Backfill workflow:

```text
Existing assertion
  ↓
Classify into one or more assertion families
  ↓
Assign membership role
  ↓
Attach capabilities
  ↓
Attach representation requirements
  ↓
Attach question-blueprint coverage
```

The backfill should not modify assertion wording or provenance unless a genuine defect is discovered.

The backfill should produce mechanical coverage evidence, including:

```text
Assertions with family membership: X
Standalone by design: Y
Unclassified learner-relevant assertions: 0
```

---

## 5. Future corpus ingestion policy

For future corpus ingestion, assertion-family assignment should become part of learner-readiness processing.

Recommended pipeline:

```text
Source acquisition
  ↓
Atomic assertion extraction
  ↓
Provenance / rights validation
  ↓
Relationships / prerequisites
  ↓
Curriculum mappings
  ↓
Assertion-family assignment
  ↓
Capabilities
  ↓
Representation requirements
  ↓
Question-blueprint coverage
  ↓
Publication gate
```

An assertion may exist internally before family assignment, but learner-publication should normally fail if:

- it is learner-relevant;
- it is not explicitly standalone;
- and it has no assertion-family placement.

This should eventually become part of the standard corpus-ingestion / publication QA introduced after the proving slice.

---

## 6. Capabilities and evidence targets

Assertions state knowledge. Capabilities state what the learner must be able to **do** with that knowledge.

Example: Ohm's Law

```yaml
required_capabilities:
  - recognise_relationship
  - solve_for_voltage
  - solve_for_current
  - solve_for_resistance
  - choose_correct_rearrangement
  - apply_correct_unit
  - check_plausibility
```

Example: parallel resistance

```yaml
required_capabilities:
  - recognise_parallel_topology
  - select_parallel_relationship
  - calculate_total_two_branch
  - calculate_total_multi_branch
  - solve_missing_branch
  - recognise_total_less_than_smallest_branch
  - diagnose_reciprocal_error
```

Question blueprints should map to capabilities explicitly.

This enables later diagnosis to distinguish:

- lack of relationship knowledge;
- formula-selection error;
- rearrangement error;
- reciprocal error;
- arithmetic error;
- unit error;
- diagram-interpretation error.

---

## 7. Formula families

### 7.1 Structured semantics

A formula family must not rely on arbitrary text such as `"I = V / R"` as the calculation source of truth.

Store formula semantics structurally.

Illustrative model:

```yaml
formula_family:
  id: formula.ohms_law
  assertion_family_id: electrical.ohms_law

  forms:
    - target: V
      expression:
        operation: multiply
        operands: [I, R]

    - target: I
      expression:
        operation: divide
        numerator: V
        denominator: R

    - target: R
      expression:
        operation: divide
        numerator: V
        denominator: I
```

Rendering and calculation both derive from that structure.

### 7.2 Formula presentation contract

Each formula family may define:

- canonical form;
- required derived forms;
- display order;
- variable definitions;
- units;
- teaching instructions;
- mnemonic visual;
- worked-example requirements.

Example:

```yaml
forms:
  - target: V
    instruction: "To find voltage, multiply current by resistance."
  - target: I
    instruction: "To find current, divide voltage by resistance."
  - target: R
    instruction: "To find resistance, divide voltage by current."
```

### 7.3 Variable definitions

```yaml
variables:
  V:
    name: voltage
    quantity: voltage
    unit_name: volt
    unit_symbol: V

  I:
    name: current
    quantity: current
    unit_name: ampere
    unit_symbol: A

  R:
    name: resistance
    quantity: resistance
    unit_name: ohm
    unit_symbol: Ω
```

---

## 8. Formula rendering

Formula rendering is a visual concern. Calculation is an engine concern.

These paths must remain separate:

```text
Structured Formula Semantics
       ↓
Calculation Engine
```

and:

```text
Structured Formula Semantics
       ↓
Formula Renderer
```

The renderer may output visually rich mathematical notation, but rendered strings or images must never be parsed to determine calculation behaviour.

The rendering layer should support:

- display formula;
- rearrangement set;
- variable highlighting;
- substitution;
- intermediate working;
- final answer;
- units;
- accessibility description;
- theme / contrast;
- reduced-motion behaviour if animation is later introduced.

---

## 9. Worked-example blueprints

Worked examples should themselves be deterministic blueprints.

Example:

```yaml
worked_example_blueprint:
  id: worked.ohms_law.solve_current
  formula_family_id: formula.ohms_law

  target: I
  known_variables: [V, R]

  steps:
    - show_formula
    - substitute_values
    - calculate
    - show_answer_with_unit
```

A lesson teaching the Ohm's Law family should ordinarily include worked examples for:

- voltage;
- current;
- resistance.

The same generated values may be reused across the three views where pedagogically useful, helping the learner see the relationship from multiple directions.

---

## 10. Mnemonic and learning-aid visuals

Illustrative VIR triangle:

```yaml
visual_aid:
  id: mnemonic.vir_triangle
  type: mnemonic
  renderer: svg

  regions:
    top: V
    bottom_left: I
    bottom_right: R
```

Potential future behaviour:

- select `V` → reveal `I × R`;
- select `I` → reveal `V / R`;
- select `R` → reveal `V / I`.

Any interaction must remain a learning aid; canonical formula semantics remain authoritative.

---

## 11. Diagram requirement model

Diagram decisions exist at two levels.

### 11.1 Assertion-family teaching requirement

Does proper teaching of this family normally require a technical visual?

Example:

```yaml
family_teaching_representation:
  assertion_family_id: electrical.parallel_resistance
  diagram_requirement: required
  diagram_blueprint_id: circuit.parallel_resistors
```

### 11.2 Question-blueprint requirement

Does this specific assessment require a diagram?

Example:

```yaml
question_representation:
  diagram:
    required: true
    blueprint_id: circuit.parallel_resistors
```

A family can therefore require diagrams during teaching while still permitting some non-diagram assessment questions.

---

## 12. Diagram requirement classification

Suggested values:

```text
none
optional
required
```

Suggested role:

```text
decorative
supporting
essential
```

A technical diagram is likely essential when the learner must interpret:

- spatial arrangement;
- connection/topology;
- direction;
- component position;
- branch structure;
- geometry;
- magnetic field/current/force relationship;
- measurement setup;
- waveform shape;
- graph;
- scale or instrument reading.

Examples likely to require diagrams:

- series/parallel circuit identification;
- resistance network calculations from a shown circuit;
- motor/generator direction questions;
- Fleming's left/right-hand-rule applications;
- conductor movement/current/field relationships;
- solenoid or magnetic field direction;
- measurement/test instrument connections;
- waveforms;
- graphs;
- scales.

---

## 13. Diagram blueprints

A diagram blueprint defines reusable structure.

Example:

```yaml
diagram_blueprint:
  id: circuit.parallel_resistors
  type: electrical_circuit
  renderer: svg

  parameters:
    resistor_count:
      allowed: [2, 3, 4]

    show_values:
      type: boolean

    show_current_arrows:
      type: boolean

    show_voltage_labels:
      type: boolean

    labels:
      pattern: "R{index}"
```

Other likely blueprint families:

```text
circuit.series_resistors
circuit.parallel_resistors
circuit.series_parallel_mixed
magnetic.field_conductor_direction
motor.force_field_current
generator.motion_field_current
mnemonic.vir_triangle
mnemonic.power_triangle
graph.cartesian
instrument.scale
measurement.connection
waveform.basic
```

CC-05A does not need to implement every renderer, but it should establish the blueprint model and inventory required for the proving slice.

---

## 14. Symbolic versus value-embedded diagrams

Default:

```text
Diagram:
R1   R2   R3

Prompt:
R1 = 6 Ω
R2 = 12 Ω
R3 = 4 Ω
```

Use value-embedded diagrams only when the learner must read or interpret the values from the visual.

This avoids a combinatorial image asset explosion.

---

## 15. Accessibility requirements for technical visuals

Every essential technical visual should support:

- semantic description;
- meaningful labels;
- no colour-only encoding;
- sufficient contrast;
- screen-reader-accessible description where technically possible;
- touch targets if interactive;
- reduced-motion alternative if animated;
- equivalent meaning when colour is unavailable.

Example anti-pattern:

> "What does the red arrow show?"

Preferred:

> "What does arrow A show?"

Colour may reinforce meaning, but must not be the only encoding.

---

## 16. Question blueprint model

A `QuestionBlueprint` defines a pedagogically distinct assessment operation.

Illustrative structure:

```yaml
question_blueprint:
  id: parallel.calculate_total
  assertion_family_id: electrical.parallel_resistance

  capability:
    operation: calculate
    target: total_parallel_resistance

  representation:
    diagram:
      required: true
      blueprint_id: circuit.parallel_resistors

  variant_dimensions:
    branch_count:
      allowed: [2, 3, 4]

  answer:
    type: quantity
    quantity: resistance

  marking:
    type: numeric_tolerance

  evidence:
    primary:
      - parallel_resistance.calculate_total
```

---

## 17. Exhaustive normalised question inventories

The inventory should enumerate all pedagogically distinct forms while normalising superficial permutations.

### 17.1 Series resistance example

Potential blueprint inventory:

```text
series.calculate_total
series.solve_missing_component
series.identify_topology
series.select_formula
series.predict_add_component_effect
series.compare_networks
series.detect_incorrect_total
series.diagnose_omitted_component
series.diagnose_arithmetic_error
series.interpret_diagram
```

`branch_count` / `component_count` can be a variant dimension:

```text
2
3
4
```

rather than necessarily producing separate blueprint IDs.

If component count materially changes capability/difficulty or scoring semantics, separate blueprint variants may be justified.

### 17.2 Parallel resistance example

Potential blueprint inventory:

```text
parallel.calculate_total
parallel.solve_missing_branch
parallel.identify_topology
parallel.select_formula
parallel.predict_add_branch_effect
parallel.compare_networks
parallel.detect_impossible_total
parallel.diagnose_added_resistors
parallel.diagnose_reciprocal_error
parallel.diagnose_missing_final_inversion
parallel.interpret_diagram
```

### 17.3 Formula family example

Potential Ohm's Law blueprints:

```text
ohms_law.solve_for_voltage
ohms_law.solve_for_current
ohms_law.solve_for_resistance
ohms_law.select_rearrangement
ohms_law.match_variables_units
ohms_law.substitution
ohms_law.diagnose_rearrangement_error
ohms_law.diagnose_unit_error
ohms_law.plausibility_check
```

---

## 18. Normalise symmetric permutations

Avoid unnecessary duplicate blueprint definitions.

Instead of:

```text
parallel.find_R1_given_Rt_and_R2
parallel.find_R2_given_Rt_and_R1
```

prefer:

```yaml
question_blueprint:
  id: parallel.solve_missing_branch_two_branch

  target:
    choose_from: branch_resistors
```

The deterministic generator chooses which branch is unknown.

This keeps the inventory exhaustive without making it repetitive.

---

## 19. Variant dimensions

Common variant dimensions may include:

```text
component_count
branch_count
target_variable
known_variable_set
diagram_presence
formula_support
mnemonic_support
value_range
number_format
rounding_requirement
unit_scale
answer_type
context_style
misconception_target
difficulty_band
```

The blueprint defines allowed combinations.

---

## 20. Difficulty must reflect cognition, not merely larger numbers

Introductory difficulty may use:

- fewer components;
- clean values;
- formula shown;
- diagram shown;
- no unnecessary rounding;
- worked support or hints.

Intermediate:

- more components;
- mixed values;
- reduced support;
- multiple-step reasoning.

Advanced:

- missing variable;
- multi-branch networks;
- unit conversion;
- contextual wording;
- no supplied formula where appropriate.

Diagnostic:

- worked-answer analysis;
- misconception-targeted distractors;
- plausible wrong answers;
- error classification.

Changing `6 Ω` to `67.3 Ω` alone is not a meaningful difficulty model.

---

## 21. Support-level rendering

A single question family may support multiple presentation modes.

Illustrative:

```yaml
support_levels:
  guided:
    formula: full
    mnemonic: available
    hint: available

  standard:
    formula: optional_or_hidden
    mnemonic: hidden

  exam:
    formula: absent_unless_exam_appropriate
    mnemonic: absent
```

Support must not alter the underlying capability or marking semantics unless explicitly defined.

---

## 22. Parameter generation

Generated numeric values should be governed by parameter constraints.

Example:

```yaml
parameter_generator:
  resistance:
    min: 1
    max: 100

  constraints:
    - positive
    - pedagogically_sensible
    - avoid_pathological_rounding
    - respect_expected_physical_relationships
```

For parallel resistance:

```text
Rt < smallest branch resistance
```

may be used as a mechanical sanity check.

Generators should favour educationally useful values rather than uniformly random values.

---

## 23. Deterministic generated instances

A generated question must be reproducible.

Illustrative instance:

```yaml
generated_question_instance:
  blueprint_id: parallel.calculate_total
  blueprint_version: 3
  seed: 839194
  content_release: 2026.08.001

  parameters:
    resistor_count: 3
    R1: 6
    R2: 12
    R3: 4

  expected:
    Rt: 2
```

The same:

```text
blueprint + blueprint version + seed + content release
```

must reproduce the same learner interaction.

This enables:

- offline generation;
- support/debug reproduction;
- learner evidence traceability;
- regression tests;
- assessment review.

---

## 24. Answer contracts

Answer contracts should be explicit.

Potential answer types:

```text
quantity
integer
decimal
fraction
multiple_choice
multi_select
direction
ordering
formula_selection
diagram_region
worked_error_classification
```

Example:

```yaml
answer:
  type: quantity
  quantity: resistance
  canonical_unit: ohm
```

---

## 25. Marking contracts

Possible marking types:

```text
exact
numeric_tolerance
equivalent_fraction
unit_aware_numeric
enum
set_equality
ordered_sequence
direction_match
structured_expression
```

CC-05B should implement only what is required by the proving-slice families, but the model should be extensible.

---

## 26. Misconception mapping

Question blueprints may declare misconception targets.

Parallel resistance examples:

```text
adds branch resistances
forgets final reciprocal
reciprocal-of-sum misuse
believes total exceeds largest branch
uses series relationship
```

Motor/generator examples may later include:

```text
reverses field/current relationship
confuses motor and generator rule
misreads arrow direction
```

Wrong answers should not automatically imply a misconception. Evidence rules must distinguish:

- direct diagnostic evidence;
- suggestive evidence;
- generic incorrect evidence.

---

## 27. Evidence produced by questions

A generated question should identify:

- primary capability;
- supporting capabilities;
- assertion family;
- specific assertions involved;
- prerequisite assertions;
- representation dependencies;
- misconception targets.

Example:

```yaml
evidence:
  primary:
    - parallel_resistance.calculate_total

  supporting:
    - reciprocal_operation
    - arithmetic_accuracy
    - resistance_unit

  representation_dependency:
    - circuit_diagram_interpretation
```

This is essential for later adaptive diagnosis.

---

## 28. Teaching representations

Suggested teaching representation types:

```text
display_formula
formula_family
variable_key
worked_example
mnemonic
technical_diagram
concept_card
comparison
step_sequence
sanity_check
misconception_warning
interactive_visual
```

Each assertion family can specify:

```text
required
recommended
optional
none
```

for applicable representation types.

---

## 29. Family completeness rules

Each assertion family should declare what complete learner coverage means.

Example: Ohm's Law

```yaml
completeness:
  required_capabilities:
    - recognise_relationship
    - solve_for_voltage
    - solve_for_current
    - solve_for_resistance
    - choose_correct_rearrangement
    - use_correct_units
```

Example: parallel resistance

```yaml
completeness:
  required_capabilities:
    - recognise_parallel_topology
    - select_parallel_relationship
    - calculate_total_two_branch
    - calculate_total_multi_branch
    - solve_missing_branch
    - recognise_total_less_than_smallest_branch
```

Mechanical QA can then determine whether the question inventory is genuinely complete.

---

## 30. Proposed core schema objects

CC-05A should formalise at least the following concepts in TypeScript/Zod or the repo's equivalent governed schema layer:

```text
AssertionFamily
AssertionFamilyMembership
Capability
FormulaFamily
FormulaForm
VariableDefinition
TeachingRepresentation
WorkedExampleBlueprint
VisualAidBlueprint
DiagramBlueprint
QuestionBlueprint
VariantDimension
ParameterGenerator
AnswerContract
MarkingContract
MisconceptionMapping
EvidenceTarget
GeneratedQuestionInstance
```

Not every future field needs production implementation in CC-05A. The goal is to establish stable boundaries and the subset required by the proving slice.

---

## 31. Content versus engine boundary

The deterministic engine should not own the pedagogical corpus.

Preferred flow:

```text
Governed content
  ↓
Validated / published blueprint
  ↓
CC-05 deterministic engine
  ↓
Generated question instance
```

The engine consumes content contracts.

It should not contain hard-coded Unit 202-specific pedagogy unless a generic engine rule genuinely requires it.

---

## 32. Published learner-runtime projection

The learner app should not consume the full governed provenance/authoring model.

Future publication flow:

```text
Governed authoring/content
  ↓
Validation
  ↓
Published learner-runtime representation
  ↓
Versioned device cache
  ↓
Mobile lesson/question runtime
```

A generated learner instance must carry the content release/version that produced it.

CC-05A/B should remain compatible with this architecture even if the production publication pipeline is not implemented yet.

---

## 33. Mobile runtime boundary

CC-05 engine code must remain:

- framework-independent TypeScript;
- independent of React;
- independent of Next.js;
- independent of the DOM/browser;
- free of Node-only runtime dependencies where code must execute on-device;
- serialisable;
- deterministic;
- runnable under Hermes-compatible mobile execution;
- safe to call offline;
- free of server-round-trip assumptions for ordinary deterministic correctness.

UI rendering remains outside the engine.

---

## 34. Diagram rendering boundary

The engine may output a diagram specification such as:

```yaml
diagram_instance:
  blueprint_id: circuit.parallel_resistors
  parameters:
    resistor_count: 3
    labels: [R1, R2, R3]
```

The renderer turns that into SVG/native visual output.

The engine should not output opaque hand-authored image blobs as the primary representation.

---

## 35. Formula rendering boundary

Likewise:

```yaml
formula_instance:
  formula_family_id: formula.ohms_law
  target: I
  substitution:
    V: 24
    R: 6
```

The renderer determines presentation.

The calculation engine determines:

```text
I = 4 A
```

---

## 36. Backfill QA / publication gates

Future mechanical gates should include at least:

```text
Learner-relevant assertion has family OR explicit standalone classification
Formula family has required forms
Formula teaching family has required worked-example coverage
Family requiring a diagram has a diagram blueprint
Question requiring a diagram has a diagram blueprint
Learner-assessable family has at least one question blueprint
Every required family capability is covered
Every generated blueprint has an answer contract
Every generated blueprint has an evidence target
No invalid formula variable/unit definitions
No unversioned blueprint instances
```

Expected proving-slice coverage:

```text
Unclassified learner-relevant assertions: 0
Learner-assessable families with zero question blueprints: 0
Required diagram references without blueprints: 0
Required formula representations without formula definitions: 0
Required capabilities without assessment coverage: 0
```

---

## 37. CC-05A — Pedagogical Knowledge Structure & Blueprint Backfill

### Objective

Create the governed pedagogical structure that CC-05B can execute.

### Deliverables

1. Formal schema/contracts for the required subset of:
   - assertion families;
   - memberships;
   - capabilities;
   - formula families;
   - representations;
   - worked examples;
   - visual aids;
   - diagram blueprints;
   - question blueprints;
   - variant dimensions;
   - answer/marking contracts;
   - misconception/evidence mappings.

2. One-time backfill of the existing Unit 202 proving corpus:
   - every learner-relevant assertion assigned to one or more families or explicitly standalone;
   - family membership roles recorded;
   - family completeness definitions created.

3. Formula-family inventory:
   - formula semantics;
   - rearrangements;
   - variables/units;
   - teaching instructions;
   - required worked-example coverage;
   - mnemonic metadata.

4. Diagram blueprint inventory:
   - circuit families;
   - magnetic/directional families;
   - mnemonic visuals;
   - any other proving-slice-required graphics.

5. Exhaustive normalised question-blueprint inventory for each proving-slice family.

6. Coverage/consistency report.

### Non-goals

- no full learner UI;
- no production diagram renderer required unless a minimal schema proof needs one;
- no broad content publication pipeline;
- no adaptive scheduler;
- no learner-runtime AI;
- no unrelated corpus rewrite.

---

## 38. CC-05B — Deterministic Calculation / Question Engine

### Objective

Implement the framework-independent deterministic machinery that consumes the blueprints from CC-05A.

### Core responsibilities

- deterministic parameter generation;
- seed/version reproducibility;
- formula calculation;
- question-instance generation;
- answer contract creation;
- marking;
- unit/tolerance handling required by proving slice;
- evidence metadata;
- misconception-aware outputs where explicitly supported;
- diagram-instance specifications;
- formula-instance specifications;
- worked-example calculation outputs.

### Proof families

Recommended proving-slice families:

- Ohm's Law;
- series resistance;
- parallel resistance;
- one diagram-heavy directional/magnetic family.

### Required tests

- deterministic reproduction;
- no invalid parameter generation;
- mathematical correctness;
- tolerance/unit correctness;
- family completeness;
- blueprint coverage;
- formula rendering data contract correctness;
- diagram rendering data contract correctness;
- offline-safe serialisability;
- Hermes/mobile package-boundary compatibility.

### Non-goals

- no full native lesson UI;
- no production adaptive recommendation engine;
- no LLM;
- no server dependency for ordinary question correctness.

---

## 39. CC-05C — Native Learner-Session Integration Proving Slice

### Objective

Prove the CC-05 pedagogical and deterministic model in the actual native mobile product.

### Recommended proving slice

Use representative families:

- Ohm's Law;
- series resistance;
- parallel resistance;
- motor/generator/magnetic direction family.

### Expected presentation proof

Demonstrate:

- formula cards;
- full formula-family teaching;
- variable keys;
- worked substitutions;
- mnemonic triangle;
- circuit SVG rendering;
- dynamic symbolic/value labels;
- direction arrows / magnetic-field diagram;
- generated question instance;
- answer entry;
- deterministic marking;
- immediate local feedback;
- evidence emission;
- repeatable seeded instance;
- accessibility semantics;
- offline-safe active-session behaviour where practical.

### Important acceptance principle

CC-05C is not simply “put a question on a screen”.

It must prove that:

```text
governed assertion family
  → representation
  → question blueprint
  → deterministic instance
  → native learner interaction
  → marking
  → learner evidence
```

works end-to-end.

---

## 40. Recommended sequencing

```text
CC-05A
Pedagogical model + corpus backfill + blueprint inventory
  ↓
CC-05B
Deterministic calculation/question engine
  ↓
CC-05C
Native learner-session integration proving slice
```

Do not collapse these into one large implementation pass.

The conceptual structure, content backfill, engine, and native integration should remain separately reviewable.

---

## 41. Future ingestion evolution

After the proving slice, corpus ingestion should be upgraded so that new domains/units cannot become learner-ready without:

- family assignment;
- capability mapping;
- formula/diagram requirements;
- question-blueprint coverage;
- completeness checks.

This moves the current one-time backfill process into normal corpus production.

---

## 42. Design decisions captured by this document

This document records the following Product Owner / Project Architect direction:

1. Formula families should be taught as families.
2. All required rearrangements should be presented together in a lesson.
3. Worked substitutions are desirable and should be deterministic.
4. Formulae should be visually rendered rather than buried in prose.
5. Mnemonic triangles are legitimate learning aids but not mathematical authority.
6. Technical imagery should preferably use deterministic SVG/vector rendering.
7. Diagram requirements should be explicit and governed.
8. Symbolic labels such as R1/R2/R3 should be the default reusable diagram pattern.
9. Numeric values should normally live outside the image unless reading them from the image is pedagogically meaningful.
10. Question inventories should be pedagogically exhaustive but normalised.
11. 2/3/4 component counts are variant dimensions where appropriate.
12. Difficulty should reflect cognitive demand, not merely awkward numbers.
13. Each question blueprint must map to capabilities/evidence.
14. The existing assertion corpus should receive a one-time backfill.
15. Future corpus ingestion should assign assertion families before learner publication.
16. Formula/diagram rendering must remain separate from calculation authority.
17. The learner runtime remains deterministic and AI-free.

---

## 43. Open implementation decisions for CC-05A/B

The following should be resolved from repository constraints and primary-source technical research where necessary, not guessed:

- exact TypeScript/Zod schema placement;
- exact naming conventions;
- exact content publication object shape;
- exact numeric/unit library strategy;
- exact formula expression representation;
- exact SVG/native rendering library or internal primitive strategy;
- exact accessibility semantics for SVG in React Native;
- exact deterministic PRNG strategy;
- exact precision/rounding policy;
- exact content-version/blueprint-version identity fields;
- whether diagrams render via pure SVG primitives, React Native SVG, Skia, or another accepted approach;
- whether math formula rendering uses a native-compatible math renderer or custom structured layout.

These choices should preserve the architecture in this document rather than altering it.

---

## 44. Final architectural rule

The platform should never reduce to:

```text
assertion → random question
```

The intended system is:

```text
assertion
  ↓
assertion family
  ↓
capability
  ↓
teaching representation
  ↓
question blueprint
  ↓
deterministic variant
  ↓
answer / diagnosis / evidence
```

That is the learning architecture CC-05 must establish.

---

## 45. CC-05D — Instructional Visual Governance, Semantic QA & Human-Readable Audit (bounded amendment)

CC-05C proved this document's model end-to-end in the native app, and in doing so surfaced a gap the model above does not close: nothing between "diagram blueprint" and "rendered question/lesson interaction" (§1's chain) ever asks whether the *rendered image itself* correctly teaches the concept it claims to. A diagram can satisfy every check this document defines — correct blueprint reference, correct parameters, correct structural render — and still be pedagogically or visually wrong, as CC-05C's own Product-Owner review found twice and its own on-device correction pass found a third time.

CC-05D adds a visual-governance/semantic-QA layer that sits beside, not inside, this document's model:

```text
Diagram Blueprint (this document, §11-13, §34)
  ↓
Visual Semantic Contract (CC-05D)
  ↓
Canonical Rendered Variant (CC-05D)
  ↓
Mechanical + Two-Pass Semantic + Human QA Evidence (CC-05D)
```

This is a bounded amendment, not a rewrite: no field, type, or behaviour defined elsewhere in this document changes. `DiagramBlueprint` (§30) remains exactly what it always was — a rendering parameter contract — and CC-05D's `VisualSemanticContract` is a separate, additively-referenced governed artefact, never a modification to it. Full specification: [`docs/architecture/CC-05D-INSTRUCTIONAL-VISUAL-GOVERNANCE-AND-SEMANTIC-QA.md`](CC-05D-INSTRUCTIONAL-VISUAL-GOVERNANCE-AND-SEMANTIC-QA.md).

## 46. CC-09E — Exam-Style Question Archetypes & Generation Calibration (bounded amendment)

CC-09D calibrated the governed Unit 202 corpus against the complete official public City & Guilds 2365-602 sample assessment (40 items, analysed without ever committing source question text — [`docs/architecture/evidence/CC-09D-UNIT202-ASSESSMENT-CALIBRATION.md`](evidence/CC-09D-UNIT202-ASSESSMENT-CALIBRATION.md)). CC-09E turns that evidence into a reusable question-generation capability, answering the product question "not just what is assessable, but *how* does the awarding body turn knowledge into assessment items."

**A question archetype is not a new concept.** `QuestionBlueprint` (§30) already *is* the "governed blueprint → many original variants" mechanism, via `variantDimensions`/`parameterGenerators` (§22-23). CC-09E adds no parallel system. What it adds is a single new optional field, `assessmentStyleEvidence` (`packages/content-schema/src/pedagogy.ts`), classifying a blueprint's relationship to official assessment evidence:

```text
DIRECT_SAMPLE_ANALOGUE      -- the official sample directly demonstrates this
                                exact question grammar (operation + representation)
                                for this same knowledge target. Requires a
                                sourceItemRef (an opaque, non-reconstructable
                                reference, e.g. "2365-602-sample-v1:item-06" --
                                never source question/option/mark-scheme text).

ASSESSMENT_STYLE_TRANSFER   -- a grammar the sample demonstrated for a DIFFERENT
                                knowledge target has been legitimately carried
                                over to a new one the sample never tested.
                                Requires transferredFromBlueprintId, naming the
                                real DIRECT_SAMPLE_ANALOGUE blueprint whose
                                grammar it transfers -- never asserted without a
                                traceable origin.
```

**Near-archetype variation** (same knowledge/capability, same assessment operation, original values/context/distractors) is exactly what `variantDimensions`/`parameterGenerators` already provide -- no new mechanism needed. **Assessment-style transfer** (§2 of the CC-09E task brief) is the new fact this field records: that a demonstrated grammar was deliberately reapplied to different, already-governed knowledge, never that the sample proved that specific question occurs. Both remain governed, deterministically generated, original content — the sample only ever informs the *grammar*, never supplies the *content*.

**Originality/copyright firebreak** (reaffirming §31's content-vs-engine boundary for this specific evidence source): no `assessmentStyleEvidence.note` or `sourceItemRef` may contain official question stems, answer options, or mark-scheme wording -- mechanically regression-tested (`scripts/content/prove-question-archetypes.test.ts`). `assessmentStyleEvidence` is authoring/governance metadata, deliberately excluded from the published learner-runtime projection (§32) — `generate-mobile-projection.ts` strips it before embedding, the same treatment §32 already gives every other authoring-only field.

**Practice and mock questions draw from the same archetypes.** CC-09E does not model exam style as mock-only: an archetype's blueprint is the same governed object a teaching-context question, a diagnostic question, or a future mock-paper question would all generate from — only the *pool selection* differs (out of scope here; §41's future-work list already tracks a future deterministic mock-paper assembler, `AssessmentBlueprint`, unaffected by this amendment).

**Formal assessment weighting stays separate from archetype metadata.** `AssessmentSpecification`'s per-Learning-Outcome question allocation governs how a *future* mock assembles many questions across topics; `assessmentStyleEvidence` governs how *one* blueprint generates variants of *one* question grammar. Neither field references the other; a blueprint's exam-style classification never implies anything about its selection frequency in a future paper.

## 47. CC-13A — Learning-Package Architecture Reset & V1 Learning Model Integration (bounded amendment)

Following real Product Owner review of Unit 202 after full Android runtime qualification, two decisions were accepted: [`ADR-0005`](adr/ADR-0005-learning-package-production-and-visual-governance.md) (ground-up learning-package production and independent visual governance) and [`ADR-0006`](adr/ADR-0006-v1-canonical-lessons-and-assessment-driven-guided-revision.md) (V1 canonical lessons and assessment-driven Guided Revision). Neither revokes anything in §1-§46 above; both narrow how this document's model is authored and gated going forward. Full detail lives in the dedicated architecture documents this amendment references, not duplicated here, matching this document's own established pattern (§45/§46).

**Taught-before-tested invariant.** No `QuestionBlueprint` (§16) may target a capability the canonical lesson storyboard has not itself taught. A question's `requiredKnowledge`/prerequisite links (§4's assertion-family/capability chain) must resolve to content the same canonical lesson (or an explicit, governed prerequisite lesson) actually teaches — never to "loosely related content from another lesson" without an explicit dependency. See [`SYLLABUS-TO-LEARNING-PACKAGE-PRODUCTION-ARCHITECTURE.md`](SYLLABUS-TO-LEARNING-PACKAGE-PRODUCTION-ARCHITECTURE.md) §3.3.

**Explicit question prerequisite contract.** Every question blueprint's assumed prerequisite knowledge is a declared, traceable link, not an implicit assumption — see [`LEARNING-PACKAGE-GOVERNANCE-CONTRACTS.md`](LEARNING-PACKAGE-GOVERNANCE-CONTRACTS.md) §8.

**Canonical storyboard-before-prose rule.** A lesson's canonical instructional sequence (its `LessonStoryboard`) is planned — teaching sections, visual needs, check points — before prose/copy authoring begins, not reconstructed from finished prose afterward. See [`SYLLABUS-TO-LEARNING-PACKAGE-PRODUCTION-ARCHITECTURE.md`](SYLLABUS-TO-LEARNING-PACKAGE-PRODUCTION-ARCHITECTURE.md) §2/§5.

**Rich scrollable teaching rule (ADR-0006).** A teaching representation (§28) is not required to fit one device viewport. Scrolling within a coherent teaching section is preferred over splitting one teaching interaction into one-sentence-then-Continue fragments merely to fit a screen. See [`LESSON-PLAYER-AND-LESSON-PLAN-ARCHITECTURE.md`](LESSON-PLAYER-AND-LESSON-PLAN-ARCHITECTURE.md) §4 and [`SYLLABUS-TO-LEARNING-PACKAGE-PRODUCTION-ARCHITECTURE.md`](SYLLABUS-TO-LEARNING-PACKAGE-PRODUCTION-ARCHITECTURE.md) §5.

**Visual-opportunity analysis as part of pedagogical authoring.** Every lesson receives a visual-opportunity analysis before learner-ready status — this is now part of authoring a lesson's teaching representations (§28), not a separate downstream step. See [`INSTRUCTIONAL-VISUAL-PLANNING-REFERENCE-AND-PRODUCTION-ARCHITECTURE.md`](INSTRUCTIONAL-VISUAL-PLANNING-REFERENCE-AND-PRODUCTION-ARCHITECTURE.md).

**Teaching/lesson-check state separation and answer-leak prevention.** Teaching content must not remain answer-bearing while an embedded formative check targeting the same capability is active — the same "answer must not be available before the response that is evidence of it" rule CC-12E's own §17 taxonomy already established for the Lesson Player must never be violated by a teaching representation authored under this document. See [`LESSON-PLAYER-AND-LESSON-PLAN-ARCHITECTURE.md`](LESSON-PLAYER-AND-LESSON-PLAN-ARCHITECTURE.md) §17.

**Assessment-to-capability-to-lesson mapping.** A dedicated formative/mock assessment question maps to the governed capability/capabilities it evidences, which in turn map to the canonical lesson(s) that teach them — an upstream content contract required before Guided Revision can rank lessons by weakness. See [`V1-LEARNING-ASSESSMENT-AND-GUIDED-REVISION-ARCHITECTURE.md`](V1-LEARNING-ASSESSMENT-AND-GUIDED-REVISION-ARCHITECTURE.md) §8/§11.

**V1 distinction: embedded lesson checks vs. dedicated formative/mock assessment.** An embedded lesson check (§16's `guided_interaction`/`independent_question` question blueprints used inside a lesson) produces real evidence (§27) but does not itself update the V1 Guided Revision plan. Only a completed and explicitly submitted dedicated formative/mock assessment does. See [`V1-LEARNING-ASSESSMENT-AND-GUIDED-REVISION-ARCHITECTURE.md`](V1-LEARNING-ASSESSMENT-AND-GUIDED-REVISION-ARCHITECTURE.md) §5-§7.

**Publication quality gates.** A lesson/question package is not learner-ready on runtime PASS alone — curriculum, pedagogy, visual, assessment-integrity, learner-presentation and runtime gates are independently required. See [`docs/governance/LEARNING-PACKAGE-QUALITY-GATES.md`](../governance/LEARNING-PACKAGE-QUALITY-GATES.md).

**Diagnostic/remediation richness preserved as platform capability, not a V1 authoring requirement.** Where this document's model (or CC-05D's) describes diagnostic-check/remediation/recheck representations (§28, §16), those remain retained implemented platform capability / post-V1 option — not deleted, but V1 ordinary-lesson authoring under this document does not require dynamic diagnostic/remediation branches; V1 adaptation is Guided Revision, not in-lesson branching (ADR-0006).

This amendment does not delete any historical CC-05A/B/C/D implementation evidence and does not reopen the Unit 202 knowledge/content gate.

Bounded scope, explicitly not built here: no numeric AC reactive-quantity calculation engine (impedance/reactance arithmetic remains out of scope, per §37's original CC-05A decision — CC-09E's one reclassified family, `electrical.ac_reactive_quantities`, gained only categorical formula/unit *recognition*, never calculation); no mock-paper assembler; no runtime AI; no question bank beyond the bounded proving set (7 archetypes). Full implementation record: `PROJECT-STATUS.md` §CC-09E.
