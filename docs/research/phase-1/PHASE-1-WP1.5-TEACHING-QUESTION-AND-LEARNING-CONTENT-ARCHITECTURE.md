# Phase 1 — WP1.5: Teaching, Question & Learning-Content Architecture

**Status:** Draft v0.2 for Product Owner review  
**Date:** 14 August 2026  
**Phase:** Phase 1 — Architecture & End-to-End Proving Slice  
**Depends on:** Approved WP1.1, WP1.2, WP1.3 and WP1.4  
**Purpose:** Define the governed teaching and content model used to learn a syllabus deliberately, assess, diagnose, demonstrate, practise, remediate and retest while preserving provenance, versioning, deterministic behaviour and assessment authenticity.

---

# 1. Purpose

WP1.5 defines **what a learning-content object is and how it connects to knowledge, evidence and diagnosis**.

This work package covers:

- question objects;
- question families;
- parameterised/deterministic variants;
- multiple-choice items;
- free-response items;
- worked-step items;
- diagnostic probes;
- misconception-linked distractors;
- answer representations;
- marking;
- explanations;
- worked examples;
- remediation units;
- retests;
- transfer items;
- provenance;
- validation;
- difficulty;
- versioning;
- content lifecycle.

It does not yet choose the final UI or database technology.

The governing principle is:

> **Content exists to generate reliable evidence and useful learning, not merely to increase question count.**

---

# 1.1 Learning is a first-class entry path

The platform must not assume that learning begins with assessment.

A learner may legitimately choose:

> **LEARNING MODE**

and work systematically through the syllabus from the beginning, lesson by lesson, without first taking a diagnostic test.

Other entry paths may include:

- diagnostic assessment;
- targeted weakness repair;
- quick revision;
- mock/assessment practice;
- return to an unfinished lesson;
- direct selection of a topic or lesson.

These entry paths must converge on the same governed knowledge, learner-evidence and teaching architecture.

The architecture must therefore support both:

```text
ASSESS FIRST
    ↓
diagnose
    ↓
teach what is needed
```

and:

```text
LEARN FIRST
    ↓
work through syllabus
    ↓
check understanding continuously
```

Neither path is secondary.

---

# 1.2 Learning Mode

**Learning Mode** is a deliberate product mode in which the learner can browse and work through a structured learning programme.

The learner should be able to:

- choose a qualification;
- choose a unit/module;
- see the ordered lessons within that unit;
- work through lessons sequentially;
- resume where they left off;
- skip ahead where permitted;
- revisit completed lessons;
- see which lessons are complete, secure, weak or not yet studied;
- optionally enter deeper foundational learning where needed.

Learning Mode should still use the learner model.

For example, if the learner reaches an Ohm's-law lesson and already has strong evidence for the prerequisite Maths, the lesson can be shorter.

If they have never been assessed, the lesson should still function normally.

The system must **not require prior mastery data in order to teach**.

---

# 1.3 Learning units and lessons

Atomic assertions are not the learner-facing lesson structure.

The platform needs a separate **LEARNING_UNIT / LESSON** layer.

A lesson is a coherent instructional unit built from multiple assertions/capabilities.

Example:

```text
Lesson:
Ohm's Law — voltage, current and resistance

Contains:
- current concept
- voltage concept
- resistance concept
- V = IR relationship
- proportionality
- calculating V
- calculating I
- calculating R
```

Assertions remain fine-grained for diagnosis and evidence.

Lessons remain coherent for teaching.

The same assertion may contribute to more than one lesson where justified, but canonical teaching content should be reused rather than copied unnecessarily.

---

# 1.4 Lesson classification must be multi-dimensional

Lessons must be classifiable along more than one axis.

The same lesson may belong simultaneously to:

- a qualification/unit pathway;
- a canonical domain/fundamental-principle pathway;
- one or more topics;
- one or more learner goals.

For example:

```text
Lesson:
Formula transposition for electrical relationships

Qualification pathway:
C&G 2365-02
  → Unit 202
  → Mathematical principles / supporting Electrical science

Canonical domain:
Foundational Maths
  → Algebra
  → Formula transposition

Applied domain:
Electrical
  → Electrical calculations

Used by:
Ohm's law
Electrical power
Resistivity
Voltage drop
```

This is essential because the platform must support both:

> **"I'm studying Unit 202 — teach me the lessons in order."**

and:

> **"My algebra is weak — show me the foundational Maths lessons."**

without duplicating the lesson content into separate silos.

---

# 1.5 Curriculum pathway versus fundamental-principle pathway

The platform must preserve two complementary navigation structures.

## Curriculum pathway

Organised around what the learner is studying.

Example:

```text
City & Guilds 2365-02
  ↓
Unit 202 — Principles of Electrical Science
  ↓
Lessons
```

This answers:

> "What do I need to learn for my qualification?"

## Fundamental-principle pathway

Organised around reusable canonical knowledge.

Example:

```text
Foundational Maths
  ↓
Algebra
  ↓
Formula transposition
```

or:

```text
Foundational Physics
  ↓
Energy and power
```

This answers:

> "What underlying skill/concept do I need to understand?"

A lesson can be surfaced through both pathways while remaining one governed instructional asset or one reusable instructional family.

---

# 1.6 Ordered syllabus learning

Where a qualification/unit has a sensible teaching order, the platform should support an explicit lesson sequence.

That sequence may come from:

- curriculum structure;
- prerequisite structure;
- approved instructional design;
- source teaching sequence such as the City & Guilds SmartScreen scheme of work.

Teaching order is not identical to prerequisite causality.

The product should preserve both:

```text
CURRICULUM / TEACHING SEQUENCE
```

and:

```text
KNOWLEDGE PREREQUISITE GRAPH
```

The former controls how a learner can work through a syllabus.

The latter supports diagnosis and adaptive teaching.

---

# 1.7 Learning engine

WP1.5 therefore introduces an explicit **Learning Engine**.

Its core instructional loop is:

```text
SELECT LESSON
    ↓
CHECK KNOWN LEARNER STATE
    ↓
SET APPROPRIATE DEPTH
    ↓
EXPLAIN
    ↓
DEMONSTRATE
    ↓
GUIDED PRACTICE
    ↓
INDEPENDENT CHECK
    ↓
UNDERSTOOD?
  /       \
YES        NO
 |          |
 |       DIAGNOSE
 |          |
 |       REMEDIATE
 |          |
 |       RETEST
 |__________|
    ↓
TRANSFER WHERE RELEVANT
    ↓
UPDATE LEARNER STATE
    ↓
COMPLETE / CONTINUE / SCHEDULE RETRIEVAL
```

The lesson can be entered because:

- the learner selected it manually;
- it is next in the syllabus;
- the diagnostic engine recommended it;
- the learner returned to it;
- spaced retrieval triggered it.

Assessment is therefore **one route into learning**, not the gatekeeper for learning.

---

# 1.8 Lesson progression

A lesson may have states such as:

- NOT_STARTED;
- IN_PROGRESS;
- COMPLETED;
- CHECK_PENDING;
- PROVISIONALLY_SECURE;
- NEEDS_REVIEW;
- TRANSFER_SECURE where relevant.

Lesson completion must not automatically equal mastery.

A learner may complete a lesson but still have weak evidence.

Likewise, a learner may already demonstrate mastery and be allowed to shorten or skip instructional content.

---

# 1.9 Teaching sequence depth

A learning unit should support at least:

## Explain

Introduce the concept clearly.

## Demonstrate

Show the concept or method being used.

## Guided practice

Learner applies it with scaffolding.

**Scaffolding** means temporary support such as hints, partial steps or formula prompts while learning.

## Independent check

Learner performs without support.

## Diagnose if needed

Use the approved diagnostic engine where failure is ambiguous.

## Remediate

Repair the identified obstacle.

## Retest

Check the repaired capability directly.

## Transfer

Apply the learning in a new or vocational context where useful.

## Retrieve later

Schedule later recall/practice to strengthen retention.

Not every lesson needs every stage, but the architecture must support them.

---

# 1.10 Teaching components are governed content

The primary teaching path should be composed from approved content objects, such as:

- concise explanation;
- deep explanation;
- demonstration;
- worked example;
- diagram;
- guided example;
- guided-practice item;
- independent check;
- misconception correction;
- remediation branch;
- transfer item;
- reference link.

Routine teaching should not depend on an LLM inventing the lesson live.

AI may later provide bounded alternatives such as:

- "explain another way";
- "give another example";
- "make that simpler";

but the canonical learning pathway remains governed.

---

# 1.11 Deterministic numerical generation in teaching

The deterministic numerical engine should power not only assessment questions but also instructional sequences.

A single validated relationship can generate deliberately controlled stages.

Example:

```text
Demonstration:
12 V / 4 Ω = 3 A

Guided practice:
24 V / 6 Ω = ?

Independent check:
110 V / 22 Ω = ?

Transfer:
230 V heater scenario

Advanced variation:
12 V with 2.4 kΩ
```

The learning engine can deliberately switch on additional knowledge demands such as:

- decimals;
- prefixes;
- transposition;
- multiple steps;

instead of allowing random numbers to make difficulty accidental.

---

# 1.12 Learning without prior assessment

When no learner-state evidence exists, the teaching engine should use a sensible default route.

For example:

```text
explain
→ demonstrate
→ guided practice
→ independent check
```

The independent check then creates the learner's first meaningful evidence.

Therefore:

> **unknown learner state is a normal learning condition, not an error state.**

---

# 1.13 Adaptive shortening and deepening

Where learner evidence exists, Learning Mode can adapt.

Example A — learner already secure:

```text
brief recap
→ independent check
→ move on
```

Example B — learner partially secure:

```text
targeted explanation
→ worked example
→ check
```

Example C — learner weak in prerequisite:

```text
brief lesson entry
→ prerequisite repair
→ return to lesson
→ check
```

The learner should still be able to request the full lesson even when the engine thinks it can be shortened.

---

# 1.14 Lesson catalogue architecture

Every lesson should be indexable by structured metadata including:

- canonical lesson identity;
- title;
- canonical domain;
- topic/subtopic;
- target assertions;
- prerequisites;
- qualification mappings;
- unit/module mappings;
- intended learner level;
- estimated duration;
- learning objectives;
- available teaching depth;
- sequence position(s);
- assessment relevance;
- lesson status/version.

This enables multiple navigational views without duplicating lessons.

---

# 1.15 Multiple qualification mappings

One lesson may support more than one qualification or unit.

Example:

```text
Foundational Maths:
Formula transposition

Mapped into:
- C&G 2365 Unit 202
- future Engineering qualification
- future HVAC qualification
- Functional Skills-related pathway where appropriate
```

Qualification-specific examples can be layered onto reusable foundational teaching.

This is one of the key mechanisms for achieving lower marginal cost when new verticals are added.

---

# 1.16 Qualification-specific wrapper versus canonical lesson

Where a foundational concept is taught inside a vocational course, the platform may use:

```text
CANONICAL LESSON
Formula Transposition
```

plus:

```text
CONTEXTUAL WRAPPER
Formula Transposition for Electrical Calculations
```

The wrapper can provide:

- why it matters in Unit 202;
- Electrical examples;
- targeted transfer items;
- curriculum mapping.

The underlying foundational teaching remains reusable.

This avoids either extreme:

- generic Maths disconnected from the learner's goal;
- duplicated "Electrical Maths", "Engineering Maths", "HVAC Maths" content.

---

# 1.17 User-selected learning pathways

At minimum, the future learner product must support:

## By qualification

> My qualification → unit → lessons.

## By fundamental domain

> Maths / Physics / Electrical → topic → lessons.

## By weakness

> Areas the engine thinks I should repair.

## By revision/readiness

> High-yield lessons for my assessment.

These are views over the same underlying content/knowledge architecture.

---

# 1.18 Whole-syllabus learning is a product requirement

The platform must be capable of serving a learner who says:

> **"I have never studied this unit. Teach me the entire syllabus."**

This learner should not need to fail questions first in order to unlock explanations.

For the eventual full Unit 202 product, the system should be capable of presenting complete approved lesson coverage for the unit and showing progression through it.

Phase 1 proves this behaviour on the bounded proving slice.

---

# 1.19 Phase 1 teaching proof

The Phase 1 proving slice must include enough actual lessons to demonstrate:

1. manual entry into Learning Mode;
2. syllabus/unit navigation;
3. a coherent lesson built from multiple assertions;
4. explanation;
5. deterministic demonstration;
6. guided practice;
7. independent check;
8. adaptive shortening for a learner with existing mastery;
9. prerequisite remediation for a learner who struggles;
10. return to the original lesson;
11. transfer testing;
12. lesson/progress state persistence.

A backend-only representation is insufficient.

---

# 2. Separation of knowledge and content

A question is not a knowledge assertion.

A knowledge assertion is a governed proposition/capability.

A question is an **interaction that samples one or more assertions/capabilities**.

Example:

Knowledge assertion:

> In an ideal series DC circuit, current is the same through each component.

Question:

> Three resistors are connected in series. If 2 A flows through the first resistor, what current flows through the third?

The same assertion can support many questions.

The same question can require several assertions.

This many-to-many relationship is essential.

---

# 3. Content object family

The minimum Phase 1 content family should include:

```text
LEARNING_PROGRAMME
LEARNING_PATH
LEARNING_UNIT
LESSON_VERSION
LESSON_SEQUENCE_MAPPING
CONTEXTUAL_LESSON_WRAPPER

QUESTION_FAMILY
QUESTION_VERSION
QUESTION_VARIANT

ANSWER_MODEL
DISTRACTOR
EXPLANATION
DEMONSTRATION
WORKED_EXAMPLE
GUIDED_PRACTICE
DIAGNOSTIC_PROBE
REMEDIATION_UNIT
RETEST_ITEM
TRANSFER_ITEM

CONTENT_ASSERTION_MAPPING
CONTENT_CURRICULUM_MAPPING
CONTENT_PROVENANCE
```

The implementation may merge or split some tables/classes later.

The conceptual distinctions must remain.

---

# 4. Question family

A **question family** represents the stable instructional/assessment intent of a question across variants.

Example:

```text
Family:
Calculate current from voltage and resistance.

Target capability:
EL-OHM-CALC-I

Required prerequisites:
- relationship selection
- transposition / formula triangle
- division
- unit handling
```

A family can produce many numerical variants.

The family should own the semantic intent.

---

# 5. Question version

A question family may evolve.

Versioning is required when:

- wording changes materially;
- answer logic changes;
- distractor mappings change;
- difficulty changes materially;
- the target assertion changes;
- a content flaw is corrected.

Historical learner evidence must refer to the exact version used.

---

# 6. Question variant

A **variant** is one instantiated form of a question family.

Example family:

> Calculate current from voltage and resistance.

Possible variants:

- 230 V, 46 Ω;
- 120 V, 30 Ω;
- 24 V, 8 Ω;
- 12 V, 4 Ω.

Variants may be:

- authored manually;
- generated deterministically from validated parameter rules.

The variant must not silently change the capability being tested.

---

# 7. Deterministic parameterisation

Where appropriate, numerical question families should use deterministic parameter generation.

This means:

> values are generated according to explicit rules that guarantee valid, intended questions and predictable answers.

Example:

```text
V ∈ {12, 24, 48, 110, 230}
R chosen so I is within intended learner range
```

The system should avoid uncontrolled AI-generated numbers at runtime.

---

# 8. Why parameterisation matters

Good parameterisation provides:

- more practice without storing thousands of near-identical items;
- lower content-authoring cost;
- reduced memorisation of exact answers;
- controlled difficulty;
- reproducible marking;
- easier regression testing.

But parameterisation must be carefully bounded.

---

# 9. Parameter constraints

Each parameterised family should define:

- permitted ranges;
- units;
- precision;
- rounding;
- excluded edge cases;
- valid relationships;
- expected answer type;
- distractor-generation rules;
- difficulty band where relevant.

Example:

For current from V/R:

```text
Voltage: positive
Resistance: non-zero positive
Result current: 0.1 A to 50 A
Decimal precision: max 2 dp unless intentionally testing rounding
```

---

# 10. Deterministic answer calculation

Numerical answers must be calculated by code from structured relationships wherever practical.

Do not store only:

> "Correct answer: 5 A"

if the engine can derive it from:

```text
V = 230
R = 46
I = V / R
```

This supports:

- validation;
- error-signature analysis;
- parameter generation;
- unit checking.

---

# 11. Formula-aware content

Formula-based questions should map to structured formula relationships defined in WP1.2.

Example:

```text
relationship: V = I * R
unknown: I
known:
  V = 230 V
  R = 46 Ω
```

This helps the engine distinguish:

- formula selection;
- rearrangement;
- substitution;
- calculation.

---

# 12. Question interaction types

Phase 1 should support a deliberately limited but useful set.

---

## 12.1 Multiple choice

Required because Test 602 is multiple choice.

Use for:

- assessment authenticity;
- conceptual recognition;
- formula selection;
- unit selection;
- realistic exam practice.

---

## 12.2 Numerical free response

Use for:

- calculation;
- exact error-pattern capture;
- reduced guessing;
- unit handling.

---

## 12.3 Relationship/formula selection

Example:

> Which relationship would you use?

This isolates knowledge before arithmetic.

---

## 12.4 Rearrangement-only item

Example:

> Rearrange `V = IR` to make `R` the subject.

Useful diagnostic content.

---

## 12.5 Step-selection / worked-step item

Example:

> Which step should come next?

Useful for diagnosing procedural errors without requiring full free-text working.

---

## 12.6 Plausibility/interpretation item

Example:

> Which result is possible for two resistors in parallel?

Useful for concept and checking behaviour.

---

## 12.7 Matching/classification

Potentially useful for:

- quantity ↔ unit;
- quantity ↔ instrument;
- conductor ↔ insulator.

Phase 1 should implement only if it materially helps.

---

# 13. Do not overbuild interaction types

Avoid implementing:

- drag-and-drop;
- elaborate simulations;
- drawing tools;
- open-ended essays;
- complex equation editors;

unless the proving slice requires them.

Phase 1 should optimise diagnostic value per implementation effort.

---

# 14. Question purpose

Every question should have one or more explicit purposes.

Initial purpose values:

- **ASSESSMENT**
- **PRACTICE**
- **DIAGNOSTIC**
- **REMEDIATION_CHECK**
- **RETEST**
- **TRANSFER**
- **SPACED_RETRIEVAL**

One question family may support multiple purposes if genuinely appropriate.

---

# 15. Primary target assertion

Each question should identify at least one **primary target assertion/capability**.

This is what the interaction is chiefly intended to sample.

Example:

```text
Primary target:
EL-PARALLEL-RT-CALC
```

---

# 16. Secondary/prerequisite assertions

A question may also require:

- prerequisite assertions;
- supporting assertions;
- strategy capabilities.

These mappings should be explicit.

Example:

```text
Primary:
calculate unequal parallel total resistance

Prerequisites:
- recognise parallel network
- reciprocal arithmetic
- addition
- unit handling
```

This supports evidence interpretation.

---

# 17. Evidence mapping strength

A question's mapping to an assertion should indicate how directly it tests it.

Possible values:

- **DIRECT**
- **STRONG_INFERRED**
- **WEAK_INFERRED**

This implements WP1.3's direct/inferred evidence distinction.

---

# 18. Misconception-linked distractors

Multiple-choice distractors should be designed deliberately.

Example:

Question:

> 10 Ω and 20 Ω are in parallel. Find total resistance.

Distractors might include:

- `30 Ω` — simple-addition misconception;
- `15 Ω` — incorrect averaging;
- `6.67 Ω` — correct;
- `0.067 Ω` — decimal/place-value error.

Each informative distractor should map to:

- misconception;
- procedural error;
- unit/prefix error;
- arithmetic signature;

where justified.

---

# 19. Not every distractor needs a diagnosis

Some distractors may simply be plausible wrong answers.

Do not fabricate a misconception label merely to fill metadata.

Use:

> **LOW_INFORMATION_DISTRACTOR**

where appropriate.

---

# 20. Distractor independence

Avoid distractors that differ only trivially unless they genuinely test a known error pattern.

A well-designed distractor set should distinguish different causes.

---

# 21. Distractor generation

Some numerical distractors can be generated deterministically.

Examples:

- sum instead of reciprocal;
- reciprocal omitted;
- ×1000 prefix error;
- wrong formula orientation;
- squared term omitted.

Generated distractors must be validated so they:

- are distinct;
- are plausible;
- do not accidentally equal the correct answer;
- remain within sensible display range.

---

# 22. Assessment authenticity

Assessment-style content should reflect the characteristics of Test 602:

- multiple choice;
- concise wording;
- Level 2 depth;
- realistic units/values;
- appropriate calculation load;
- no reliance on unavailable references.

But:

> **do not copy City & Guilds sample questions.**

The product should create independently authored questions that reflect the assessed capability.

---

# 23. Diagnostic usefulness versus exam authenticity

A question can be excellent diagnostically but unlike the final exam.

Example:

> rearrangement-only probe.

That is acceptable.

The platform should distinguish:

```text
EXAM-LIKE CONTENT
vs
DIAGNOSTIC CONTENT
```

Both serve different purposes.

---

# 24. Question wording

Question wording should be:

- concise;
- unambiguous;
- level-appropriate;
- free of irrelevant complexity;
- independent;
- professionally realistic where useful.

Diagnostic questions should minimise unrelated reading burden.

Assessment-style questions may intentionally include realistic context.

---

# 25. Reading demand

Where the target is Electrical science rather than literacy, avoid unnecessarily difficult sentence structure.

A learner should not fail a current calculation because the product used obscure prose.

Where question interpretation is itself being tested, that must be deliberate.

---

# 26. Unit handling

Numerical questions should distinguish:

- required unit;
- accepted equivalent units;
- unit omission;
- wrong unit;
- correct unit with wrong scale.

Example:

Correct answer:

```text
2.3 A
```

Potential acceptable equivalent:

```text
2300 mA
```

if the question does not mandate amperes.

The answer model should decide this explicitly.

---

# 27. Precision and rounding

Every numerical family should define:

- exact versus approximate;
- rounding tolerance;
- significant figures/decimal places;
- whether intermediate rounding is acceptable.

Avoid marking a learner wrong for harmless representation differences.

---

# 28. Answer model

The **answer model** should encode what counts as correct.

For numerical questions:

- expected quantity;
- canonical unit;
- acceptable equivalent units;
- tolerance;
- exact expression where useful;
- rounding policy.

For multiple choice:

- correct option;
- distractor semantic mapping.

For classification:

- valid mappings.

---

# 29. Partial correctness

Phase 1 may support partial evidence where the interaction exposes steps.

Example:

- correct formula;
- correct substitution;
- arithmetic wrong.

This should create:

```text
positive evidence:
relationship selection
substitution

negative evidence:
arithmetic execution
```

This is far richer than simply marking the whole item wrong.

---

# 30. Worked-step capture

Some diagnostic items should expose intermediate steps.

Possible UI forms:

- choose formula;
- choose rearranged form;
- enter substituted expression;
- enter final answer.

But this should be used selectively.

Routine practice must remain fast.

---

# 31. Question difficulty

Initial difficulty should be an authored ordinal estimate such as:

- **FOUNDATIONAL**
- **EASY**
- **STANDARD**
- **CHALLENGING**

Do not claim psychometric calibration.

Difficulty may later be revised from real response data.

---

# 32. Difficulty drivers

Difficulty can arise from:

- conceptual complexity;
- number complexity;
- number of steps;
- unit conversion;
- transposition;
- circuit structure;
- unfamiliar context;
- distractor similarity;
- time pressure.

These dimensions can be recorded if useful.

---

# 33. Item difficulty must not equal curriculum importance

A hard question may test a minor area.

A simple question may test a central prerequisite.

Keep difficulty separate from importance.

---

# 33.1 Learning programme

A **learning programme** is an organised body of lessons presented for a
learner goal such as a qualification or a foundational domain.

Examples:

```text
C&G 2365-02
  → Unit 202 learning programme
```

and:

```text
Foundational Maths
  → Algebra learning programme
```

A programme is navigational/instructional structure, not canonical
knowledge.

---

# 33.2 Learning path

A **learning path** is an ordered route through lessons.

Examples:

- approved Unit 202 syllabus route;
- adaptive route through the same lessons;
- foundational Maths route;
- quick-revision route.

A learner may follow the default order or, where allowed, manually
choose lessons.

The path must not duplicate lesson content merely to change order.

---

# 33.3 Learning unit / lesson

A **learning unit** or learner-facing **lesson** is the primary coherent
teaching object.

It should define:

```text
lesson identity
title
target assertions/capabilities
prerequisites
learning objectives
qualification/unit mappings
canonical domain
topic classification
estimated duration
teaching components
entry behaviour
independent checks
exit criteria
transfer requirements
version
```

The exact distinction between `LEARNING_UNIT` and `LESSON` can be
simplified in implementation if one object is sufficient.

The architectural requirement is the existence of a coherent
instructional layer above atomic assertions.

---

# 33.4 Teaching content and mastery evidence

Viewing teaching content should not itself create meaningful mastery
evidence.

Conceptually:

```text
view explanation            ≈ no mastery evidence
view worked example         ≈ very weak evidence
guided success              = weak/moderate evidence
independent success         = stronger evidence
novel transfer success      = stronger evidence
later retrieval success     = stronger still
```

This preserves WP1.3.

---

# 34. Explanation architecture

An explanation is separate from the question and assertion.

A single question may have multiple explanation layers.

Minimum Phase 1 layers:

## 34.1 Minimal correction

Example:

> Use `I = V/R`. `230/46 = 5 A`.

## 34.2 Quick explanation

Explains the step that caused the error.

## 34.3 Deeper explanation

Explains underlying concept/prerequisite.

This implements progressive feedback.

---

# 35. Explanation targeting

Where possible, explanation should adapt to evidence.

Example:

If formula selection was correct but arithmetic wrong:

Do not explain Ohm's law from first principles.

Explain the arithmetic/checking issue.

This is the difference between targeted teaching and generic answer explanations.

---

# 36. Explanation provenance

Explanations should be grounded in approved assertions.

They may cite/provide learner reference navigation to authoritative sources where appropriate.

Do not generate live explanations directly from proprietary source text.

---

# 37. Worked examples

A worked example is a content object showing a complete reasoning path.

It should map to:

- target assertions;
- prerequisite assertions;
- strategy;
- difficulty/context.

Worked examples are useful in remediation.

---

# 38. Multiple valid strategies

A worked example may show:

- algebraic transposition;
- formula triangle;
- shortcut for equal parallel resistors.

The platform should not imply only one valid method exists.

Strategy suitability can depend on learner intent.

---

# 39. Remediation unit architecture

A remediation unit is a targeted instructional object entered because a
specific obstacle has been identified. It is not the same as the
ordinary syllabus lesson.

A remediation unit should include:

```text
target weakness
learner intent suitability
estimated duration
explanation content
worked examples
guided practice
independent retest
transfer requirement
```

Not all units need every component.

---

# 40. Micro-remediation

Examples:

- convert kΩ to Ω;
- remember current is the same in series;
- recognise parallel total resistance must be below smallest branch.

Expected duration:

> roughly 30 seconds to 2 minutes.

---

# 41. Short remediation

Examples:

- formula transposition;
- reciprocal arithmetic;
- Ohm's-law conceptual relationship.

Expected duration:

> roughly 3–8 minutes.

---

# 42. Lesson remediation

Longer concept rebuilding.

Examples:

- parallel circuit foundations;
- work/energy/power relationship.

Phase 1 only needs enough lesson-depth content to prove the architecture.

---

# 43. Guided practice

Guided practice may include:

- hints;
- partially completed steps;
- formula provision;
- immediate feedback.

Evidence from guided practice must be marked as assisted.

---

# 44. Independent retest

After remediation, the learner should receive an unaided item not identical to the worked example.

This tests actual repair.

---

# 45. Transfer item

A transfer item applies the repaired capability in a materially different context.

Example:

After pure Maths transposition remediation:

- V-I-R transfer;
- then power or resistivity transfer.

Transfer items should be explicitly tagged by transfer distance.

---

# 46. Avoid answer memorisation

Immediate retests should vary:

- values;
- unknown variable;
- wording;
- surface context.

Do not present the same question with only a small number change if stronger transfer is required.

---

# 47. Spaced retrieval content

A question family may also be suitable for later retrieval.

Spaced-retrieval items should avoid being too familiar.

Phase 1 need only preserve the content metadata needed for later scheduling.

---

# 48. Content provenance

Questions and explanations require provenance too.

But the relationship differs from assertions.

A question may be:

> independently authored from approved assertions.

Therefore content provenance should identify:

- assertions used;
- curriculum target;
- supporting source/reference where appropriate;
- author;
- AI assistance;
- reviewer;
- version;
- approval.

Avoid attaching proprietary source text to the question record.

---

# 49. Question IP boundary

The product must not:

- copy City & Guilds sample question wording;
- lightly paraphrase proprietary questions at scale;
- reproduce proprietary diagrams/tables without permission;
- reconstruct copyrighted teaching packs.

It may:

- assess the same knowledge/capability;
- create independently worded scenarios;
- use standard technical formulae/facts;
- cite authoritative references appropriately.

---

# 50. AI-assisted question drafting

AI may propose candidate:

- questions;
- distractors;
- explanations;
- remediation content;
- parameter ranges.

But all AI-produced content begins as:

> **CANDIDATE**

It must pass deterministic and human/content validation before publication.

---

# 51. Runtime AI generation

Routine learner questions should **not** be generated live by an LLM in Phase 1.

Reasons:

- reproducibility;
- quality control;
- provenance;
- deterministic marking;
- lower cost;
- easier regression testing.

Runtime AI may later support optional explanations/tutoring.

---

# 52. Content lifecycle

Suggested lifecycle:

```text
DRAFT
  ↓
SOURCE/ASSERTION MAPPED
  ↓
TECHNICALLY VALIDATED
  ↓
PEDAGOGICALLY REVIEWED
  ↓
APPROVED
  ↓
PUBLISHED
```

Later:

```text
RETIRED
SUPERSEDED
INVALIDATED
```

Exact workflow can be simplified for Phase 1.

---

# 53. Technical validation

Numerical content should be automatically validated where possible.

Checks include:

- answer calculation;
- units;
- parameter validity;
- no divide-by-zero;
- distractor uniqueness;
- tolerance;
- impossible results;
- boundary values.

---

# 54. Semantic validation

Automated calculation does not prove the question is pedagogically correct.

Human/structured review should ask:

- does wording test intended capability?
- is more than one answer arguably correct?
- is context realistic?
- do distractors represent plausible errors?
- is difficulty appropriate?
- does the item accidentally require unmodelled knowledge?

---

# 55. Content test cases

Every parameterised family should have automated tests for:

- representative low values;
- representative high values;
- edge values;
- unit conversions;
- distractor generation;
- answer tolerance;
- rendering.

---

# 56. Golden questions

Phase 1 should include a small set of manually approved **golden questions**.

These are fixed high-quality reference items used for:

- regression tests;
- learner-flow demos;
- diagnosis validation;
- UX testing.

They should not be the whole question bank.

---

# 57. Question-family regression

Once a family is approved, changes to:

- formula engine;
- unit conversion;
- parameter generation;
- distractor logic;

must not silently change expected behaviour.

Automated regression tests are required.

---

# 58. Invalid question handling

If a published question is later found flawed:

- mark question version invalid;
- stop serving it;
- identify affected learner evidence;
- invalidate/recompute that evidence where justified;
- preserve audit history.

This implements WP1.3's evidence correction requirement.

---

# 59. Content observability

The system should later track:

- attempt count;
- correctness;
- distractor selection;
- abandonment;
- average response time;
- unusual error distribution;
- remediation success;
- transfer success.

This helps detect bad content and improve difficulty calibration.

---

# 60. Question exposure

Repeatedly showing the same question can bias evidence.

The content engine should track exposure and prefer:

- unseen variants;
- spaced reuse;
- novel transfer items.

Phase 1 may implement simple exposure rules.

---

# 61. Content equivalence

Two questions may look different but test the same exact capability.

The system should know they belong to the same family or evidence cluster.

This helps prevent false evidence independence.

---

# 62. Content diversity

Within one capability, create variation across:

- unknown variable;
- units;
- surface context;
- number structure;
- wording;
- circuit representation;
- strategy opportunity.

This strengthens transfer evidence.

---

# 63. Visual content

Circuit diagrams can add genuine value.

Phase 1 may require simple diagrams for:

- series;
- parallel;
- voltage-drop contexts.

Visuals should be independently created.

Do not reuse proprietary diagrams.

---

# 64. Diagram provenance

If a diagram is generated from structured circuit data, store the underlying data and generation version where useful.

This makes diagrams reproducible and easier to validate.

---

# 65. Content accessibility

Questions and explanations should support:

- keyboard use;
- screen readers;
- readable contrast;
- mobile layout;
- text alternatives for meaningful diagrams.

Detailed UI accessibility belongs to WP1.7.

Content architecture must provide alt text / semantic labels where required.

---

# 66. Learner-language level

The product should match Level 2 learner needs without being patronising.

Technical terminology should be correct.

Explanations can clarify terms without oversimplifying the vocational concept.

---

# 67. Reference navigation

Where useful, learner feedback may show:

```text
Reference:
City & Guilds Unit 202 — AC4.5
Professional reference:
[appropriate authoritative source / locator]
```

This should be generated from provenance mappings, not hand-typed inconsistently into every question.

---

# 68. Curriculum coverage

Content should map back to curriculum requirements.

The engine should later answer:

- which criteria have assessment coverage?
- which have remediation coverage?
- which have no approved questions?
- which are overrepresented?

This is separate from learner mastery.

---

# 69. Assessment weighting

Pass-focused question selection should later use Test 602 weighting.

But Phase 1 content creation should not mirror the assessment distribution exactly if diagnostic proof requires more depth in one area.

The proving slice's purpose is architecture validation.

---

# 70. Content density per assertion

Do not enforce a fixed rule like:

> 3 questions per assertion.

Some assertions need:

- one direct recognition item;
- multiple contextual applications;
- several misconception probes.

Others may be prerequisites sampled indirectly.

Use diagnostic value, not quota.

---

# 71. Interaction count target

WP1.1 estimated approximately:

> **200–400 authored or deterministically generated interactions/variants**

for the proving graph.

WP1.5 retains this as a planning range.

The more useful metric is:

> **Does every important diagnostic hypothesis have enough independent evidence opportunities?**

---

# 72. Minimum content coverage for first three diagnostic paths

The proving slice must provide enough content for:

## Path 1 — transposition vs relationship selection

Needs:

- V-I-R assessment items;
- relationship-selection probes;
- pure algebra transposition probes;
- formula-triangle strategy content;
- transposition remediation;
- V-I-R transfer;
- power/resistivity transfer.

## Path 2 — parallel misconception vs reciprocal weakness

Needs:

- parallel assessment items;
- structural concept probes;
- reciprocal Maths probes;
- parallel conceptual remediation;
- reciprocal remediation;
- transfer items.

## Path 3 — prefix weakness

Needs:

- mixed-prefix Electrical calculations;
- direct conversion probes;
- prefix remediation;
- transfer into multiple Electrical families.

---

# 73. Example question-family specification

```text
ID:
QF-EL-OHM-CURRENT-001

Purpose:
ASSESSMENT / PRACTICE

Primary target:
EL-OHM-CALC-I

Prerequisites:
EL-OHM-RELATIONSHIP
FM-ALG-TRANSPOSE-MULT
FM-ARITH-DIVISION
FM-UNIT-PREFIX

Input parameters:
voltage
resistance

Derived:
current = voltage / resistance

Response:
numerical + unit

Difficulty:
STANDARD

Evidence:
primary target DIRECT
transposition STRONG_INFERRED if strategy observed
division STRONG_INFERRED
unit conversion conditional

Transfer class:
SAME_CONTEXT / NEAR_TRANSFER

Version:
1
```

---

# 74. Example diagnostic probe specification

```text
ID:
DP-FM-TRANSPOSE-001

Purpose:
DIAGNOSTIC

Target:
FM-ALG-TRANSPOSE-MULT

Prompt:
Rearrange x = yz to make z the subject.

Response:
symbolic selection or equivalent structured response

Evidence:
DIRECT

Expected information gain:
distinguishes general transposition weakness from
Electrical relationship-selection weakness.
```

---

# 75. Example misconception-linked MCQ

```text
Question:
Two resistors, 10 Ω and 20 Ω, are connected in parallel.
Which total resistance is possible?

A 30 Ω
B 15 Ω
C 6.67 Ω
D 0.067 Ω

Mappings:
A -> series-addition misconception
B -> averaging misconception
C -> correct
D -> decimal/place-value error candidate
```

The exact values/wording must be independently authored and validated.

---

# 76. Example remediation unit

```text
ID:
REM-FM-PREFIX-001

Target:
FM-SI-PREFIX-KILO

Intent:
PASS_QUICKLY / UNDERSTAND

Duration:
2-4 minutes

Content:
- concise prefix rule
- one worked example
- two guided conversions
- one independent retest

Transfer:
Ohm's-law item using kΩ
Resistivity item using area/prefix conversion
```

---

# 77. Content-authoring tooling requirement

The eventual content tooling should allow an authorised creator/reviewer to see:

- assertion targets;
- prerequisites;
- misconception mappings;
- parameter rules;
- answer model;
- provenance;
- validation status;
- version history.

Do not require editing raw database records.

Detailed admin UX belongs later.

---

# 78. Bulk content generation caution

Even if AI can generate hundreds of questions quickly:

> **publication rate must be governed by validation capacity, not generation capacity.**

The bottleneck may intentionally be review.

This protects quality.

---

# 79. Content quality metrics

Phase 1 should measure:

- candidate questions created/hour;
- approved questions/hour;
- rejection rate;
- correction rate;
- automated validation failures;
- review minutes/item;
- question-family reuse;
- variants/family;
- misconception mapping usefulness;
- learner error/discrimination data when available.

---

# 80. Originality / duplication checks

The content pipeline should eventually flag:

- duplicate internal questions;
- near-duplicate variants;
- suspicious similarity to reference material.

Phase 1 may use manual review plus simple similarity checks.

Do not build an elaborate plagiarism platform yet.

---

# 81. Content source hierarchy

For each content object, distinguish:

1. **knowledge authority** — source proving the assertion;
2. **curriculum authority** — source showing relevance;
3. **content inspiration/reference** — material used to understand expected depth;
4. **original authored interaction** — the production question/explanation.

These are not the same thing.

---

# 82. Source-derived terminology

Where a curriculum uses a recognised term, the product may use that technical terminology.

But source wording should not be copied unnecessarily.

The product should teach correct professional language while remaining independently authored.

---

# 83. Content updates after source change

When a source/assertion changes:

```text
SOURCE VERSION CHANGES
      ↓
AFFECTED ASSERTIONS IDENTIFIED
      ↓
DEPENDENT QUESTIONS/EXPLANATIONS FOUND
      ↓
REVIEW REQUIRED
      ↓
NEW CONTENT VERSION / RETIREMENT
```

This is why mappings must be structured.

---

# 84. Question neutrality

Avoid embedding stereotypes or irrelevant demographic assumptions in vocational scenarios.

Use realistic but neutral names/contexts where context is needed.

---

# 85. Unsafe content boundary

For later safety-critical electrical topics:

- explanations must not encourage unsafe practical action beyond learner competence;
- theory questions must not imply practical certification.

Phase 1 theory content should preserve this principle.

---

# 86. Learner feedback layers

The content architecture must support at least:

```text
RESULT ONLY
QUICK CORRECTION
TARGETED EXPLANATION
DEEP EXPLANATION
REMEDIATION
```

This directly implements the approved design principle.

The same question should not need five duplicate records for five feedback depths.

---

# 87. Personalised feedback assembly

The learner-facing feedback can be assembled from:

- question outcome;
- error signature;
- diagnostic state;
- explanation layer;
- remediation recommendation.

This is preferable to storing one static "wrong answer explanation" per item.

---

# 88. Static versus generated explanation

Phase 1 preference:

- approved static/modular explanation blocks;
- deterministic assembly;
- optional LLM paraphrase only later.

This improves consistency and cost control.

---

# 89. Content modularity

Reusable content blocks may include:

- formula explanation;
- unit-prefix explanation;
- misconception correction;
- worked example;
- plausibility rule.

This prevents rewriting the same explanation in dozens of questions.

---

# 90. Explanation conflict prevention

If a canonical assertion changes, reusable explanation blocks linked to it can be reviewed centrally.

This reduces contradictory content.

---

# 91. Data needed for later item analytics

Every attempt should reference:

- question family;
- question version;
- variant;
- target assertions;
- distractor selected;
- response;
- correctness;
- time;
- assistance;
- context.

This supports future calibration and QA.

---

# 92. Phase 1 content build sequence

Recommended order:

1. define 8–12 golden question families;
2. implement deterministic answer/variant engine;
3. add misconception-linked distractors;
4. add direct diagnostic probes;
5. add micro-remediation;
6. add retest/transfer items;
7. validate with synthetic personas;
8. expand toward the 200–400 interaction range.

Do not author hundreds of questions before the first families pass end-to-end tests.

---

# 93. First golden families

Recommended initial families:

1. V-I-R current calculation;
2. V-I-R voltage calculation;
3. V-I-R resistance calculation;
4. series total resistance;
5. series voltage drop;
6. parallel total resistance;
7. branch current in parallel;
8. electrical power from V and I;
9. electrical power from I²R;
10. prefix conversion;
11. resistivity calculation;
12. mechanical/electrical power transfer comparison.

These are sufficient to begin exercising the architecture.

---

# 94. Content acceptance tests

Before a question family is approved, verify:

- target capability is explicit;
- prerequisites are explicit;
- answer model is deterministic;
- units are correct;
- parameter bounds are valid;
- distractors are unique;
- misconception mappings are justified;
- question is independently worded;
- provenance/curriculum mapping exists;
- difficulty is plausible;
- learner evidence interpretation is defined;
- explanation exists at required depth;
- regression tests pass.

---

# 95. Acceptance criteria

WP1.5 is accepted when the Product Owner agrees that:

1. questions are content objects separate from assertions;
2. question families are stable semantic units with versioned implementations;
3. numerical variants are generated deterministically where appropriate;
4. answer models are structured rather than only free-text expected answers;
5. formula relationships are represented structurally enough for marking and generation;
6. Phase 1 supports a deliberately limited set of high-value interaction types;
7. every question has explicit purpose and target assertions;
8. evidence directness is mapped explicitly;
9. misconception-linked distractors are structured;
10. low-information distractors are allowed rather than forcing fake diagnoses;
11. assessment authenticity and diagnostic usefulness are separate concerns;
12. numerical responses support unit/tolerance/rounding rules;
13. partial-step evidence can be captured selectively;
14. difficulty is authored initially and not falsely presented as calibrated;
15. explanations support progressive layers;
16. explanations should target the actual error where evidence allows;
17. worked examples may show multiple valid strategies;
18. remediation units are governed content objects;
19. independent retest follows remediation;
20. transfer items are explicit content objects;
21. routine runtime question generation is deterministic, not LLM-first;
22. AI-produced content remains candidate until validated;
23. content provenance and rights boundaries are explicit;
24. question/version identity is preserved in learner evidence;
25. flawed published questions can be invalidated non-destructively;
26. parameterised families have automated validation and regression tests;
27. content analytics can later identify weak/flawed items;
28. content reuse and modular explanations are preferred over duplication;
29. the first three diagnostic paths have complete supporting content;
30. the initial 8–12 golden families are sufficient to begin implementation before broader content expansion;
31. Learning Mode is a first-class entry path and does not require prior assessment;
32. learners can work systematically through an entire qualification/unit lesson sequence;
33. atomic assertions are not treated as individual learner-facing lessons by default;
34. lessons are coherent instructional families composed from multiple assertions/capabilities;
35. lessons can be classified simultaneously by qualification/unit and by canonical foundational/domain taxonomy;
36. curriculum/teaching sequence is separate from prerequisite causality;
37. the platform supports qualification, foundational-domain, weakness and revision views over the same underlying content;
38. the explicit Learning Engine supports explain → demonstrate → guided practice → independent check → diagnose/remediate where required → retest → transfer → later retrieval;
39. unknown learner state is a normal valid entry condition for teaching;
40. existing learner state can shorten or deepen lessons without preventing manual access to the full lesson;
41. deterministic numerical generation is used for demonstrations and guided teaching as well as questions;
42. canonical foundational lessons can have vocational contextual wrappers rather than being duplicated per vertical;
43. lesson completion is distinct from assertion mastery;
44. Phase 1 must prove manual syllabus-led learning as well as assessment-led/adaptive learning.

---

# 96. Decision recommendation

**APPROVE WP1.5 as the conceptual Question & Learning-Content Architecture for Phase 1.**

The central design decision is:

> **The platform will contain an explicit governed Learning Engine as well as assessment and diagnostic engines. Learners may enter through Learning Mode and work systematically through qualification/unit lessons, or enter adaptively through assessment/weakness detection. Coherent lessons sit above atomic assertions, can be surfaced simultaneously through curriculum and fundamental-domain pathways, and use approved explain → demonstrate → guided practice → independent check → diagnose/remediate → retest → transfer sequences. Question families, teaching components and numerical variants remain governed, versioned and deterministic wherever practical.**

This ensures the content system serves the evidence/diagnostic engine rather than degenerating into a tagged question bank.

---

# 97. Next work package

On approval of WP1.5, proceed to:

> **WP1.6 — Platform, Data & Security Architecture**

WP1.6 will define:

- SaaS boundaries;
- application components;
- database responsibilities;
- authentication;
- passwordless sign-in direction;
- authorisation;
- Row Level Security;
- API boundaries;
- content/admin separation;
- environments;
- secrets;
- rate limiting;
- logging;
- monitoring;
- backups;
- deployment;
- scalability;
- security testing;
- how the knowledge, learner, lesson/path and assessment-content models map into production infrastructure.

No framework/vendor choice should override the conceptual models already approved.

---

**End of WP1.5**
