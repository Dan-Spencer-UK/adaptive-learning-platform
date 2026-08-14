# Phase 1 — WP1.4: Diagnostic & Remediation Engine

**Status:** Approved with post-approval clarification v0.2  
**Date:** 14 August 2026  
**Phase:** Phase 1 — Architecture & End-to-End Proving Slice  
**Depends on:** Approved WP1.1, WP1.2 and WP1.3  
**Purpose:** Define how the platform turns accumulated learner evidence into competing diagnostic hypotheses, selects informative probes, decides when to intervene, chooses remediation, verifies foundational repair, and tests transfer back into vocational application.

---

# 1. Purpose

WP1.4 defines the engine that answers:

> **What is the learner most likely struggling with, what should we test next, and what should we do about it?**

The engine must not:

- equate one wrong answer with one cause;
- jump directly from topic failure to remediation;
- treat all prerequisites as equally likely;
- use an LLM to improvise diagnosis from scratch;
- force deep remediation on every learner;
- confuse exam strategy with deep mastery;
- pretend certainty where evidence remains ambiguous.

The engine must:

- generate plausible competing root-cause hypotheses;
- use the knowledge/prerequisite graph from WP1.2;
- use evidence and uncertainty from WP1.3;
- choose high-information diagnostic probes where needed;
- stop probing when additional diagnosis is not worth the learner friction;
- select the smallest useful remediation;
- distinguish pass-focused and understanding-focused interventions;
- retest the repaired foundational capability;
- verify transfer back into Electrical;
- update learner state and next-best activity.

The governing principle is:

> **Diagnosis exists to improve learner outcomes, not to produce the most elaborate explanation of the learner.**

---

# 1.1 Diagnostic/remediation is not the only route into teaching

The Diagnostic & Remediation Engine is one consumer of the Teaching
Engine defined in WP1.5.

A learner may also enter teaching directly through:

- Learning Mode;
- qualification/unit lesson selection;
- foundational Maths/Physics browsing;
- return to an unfinished lesson.

Therefore:

> **diagnosis decides when targeted repair is useful; it does not control access to learning.**

A normal syllabus lesson can occur with no preceding failure.

Where weakness is detected during that lesson, the diagnostic engine may
temporarily branch into targeted remediation and then return the learner
to the original lesson.

---

# 2. End-to-end diagnostic loop

The Phase 1 engine should implement this conceptual loop:

```text
LEARNER INTERACTION
        ↓
EVIDENCE EXTRACTION
        ↓
CURRENT LEARNER STATE
        ↓
FAILURE / UNCERTAINTY DETECTED
        ↓
GENERATE PLAUSIBLE CAUSES
        ↓
RANK HYPOTHESES
        ↓
IS EVIDENCE SUFFICIENT?
      /       \
    YES        NO
     |          |
     |      SELECT HIGH-
     |      INFORMATION PROBE
     |          |
     |      NEW EVIDENCE
     |__________|
        ↓
CHOOSE INTERVENTION
        ↓
REMEDIATION OR PRACTICE
        ↓
FOUNDATIONAL RETEST
        ↓
VOCATIONAL TRANSFER TEST
        ↓
UPDATE LEARNER STATE
        ↓
SELECT NEXT BEST ACTIVITY
```

The engine should be deterministic-first and auditable.

---

# 3. Diagnostic hypothesis

A **diagnostic hypothesis** is a candidate explanation for an observed pattern of learner evidence.

Example:

```text
Observed:
- wrong current calculation
- correct arithmetic when isolated
- correct unit conversion
- correct relationship selection
- failed transposition probe

Hypothesis:
General formula transposition weakness
```

A hypothesis should reference one or more:

- assertions/capabilities;
- misconceptions;
- strategies;
- contextual failures;
- evidence records.

It should also carry:

- current support level;
- competing hypotheses;
- confidence;
- what evidence would strengthen/weaken it.

---

# 4. Root-cause hierarchy

The engine should reason across several cause families.

## 4.1 Domain-concept cause

Example:

- learner misunderstands resistance;
- learner thinks current is consumed in series.

## 4.2 Relationship-selection cause

Example:

- learner knows V, I and R individually but selects the wrong governing relationship.

## 4.3 Foundational Maths cause

Examples:

- transposition;
- reciprocal arithmetic;
- fraction handling;
- proportional reasoning;
- powers of ten;
- scientific notation;
- unit conversion.

## 4.4 Foundational Physics cause

Examples:

- power versus energy;
- rate concept;
- proportionality;
- quantity/unit distinction.

## 4.5 Procedural/strategy cause

Examples:

- formula triangle used incorrectly;
- reciprocal method applied incorrectly;
- shortcut used outside its valid scope.

## 4.6 Interpretation cause

Example:

- learner answers for total circuit current when branch current was requested.

## 4.7 Execution/slip cause

Examples:

- arithmetic slip;
- calculator-entry error;
- accidental option selection.

The engine should avoid escalating a one-off execution error into a deep remediation path.

---

# 5. Candidate hypothesis generation

Hypotheses should be generated from:

1. the target assertion/capability;
2. required/strong prerequisites;
3. mapped misconceptions;
4. observed error signature;
5. known strategy;
6. recent learner state;
7. similar failures in other contexts.

Conceptually:

```text
FAILED TARGET
   ↓
TARGET MISCONCEPTIONS
   ↓
REQUIRED PREREQUISITES
   ↓
STRONG PREREQUISITES
   ↓
RECENT CROSS-CONTEXT FAILURES
   ↓
ERROR-SIGNATURE MATCHES
```

The engine should not traverse the entire knowledge graph blindly.

It should restrict candidate causes to a bounded **diagnostic neighbourhood**.

---

# 6. Diagnostic neighbourhood

A diagnostic neighbourhood is the small subgraph around the failed capability that contains plausible causes.

Phase 1 should begin with:

- target capability;
- direct prerequisite layer;
- one deeper prerequisite layer where justified;
- mapped misconceptions;
- known strategy dependencies.

Deeper traversal should occur only if:

- evidence points downward;
- direct causes are ruled out;
- remediation requires it.

This prevents the engine from blaming extremely remote foundations.

---

# 7. Hypothesis ranking

Hypotheses should be ranked using explicit deterministic factors.

Possible factors include:

- direct negative evidence;
- repeated failure;
- cross-context failure;
- misconception-linked response;
- prerequisite centrality;
- recent successful evidence against the hypothesis;
- direct successful probe against the hypothesis;
- strategy evidence;
- error-signature fit.

Example conceptual score:

```text
hypothesis support
= direct evidence
+ repeated consistency
+ cross-context support
+ error-signature support
- contradictory evidence
- successful direct probes
```

Exact numeric weights are deferred to implementation/testing.

WP1.4 requires explainable ranking logic, not arbitrary black-box scoring.

---

# 8. Competing hypotheses must remain visible

The engine should be able to hold:

```text
H1 formula transposition weakness — medium support
H2 wrong Electrical relationship selection — medium support
H3 arithmetic weakness — low support
```

rather than forcing one winner too early.

This is critical for honest diagnosis.

---

# 9. Confidence thresholds

Phase 1 should define three practical diagnostic confidence bands:

## LOW

Evidence is too weak/ambiguous.

Action:

- do not state a firm diagnosis;
- gather more evidence if worthwhile.

## MODERATE

One explanation is leading but competing explanations remain plausible.

Action:

- use a targeted probe or low-cost remediation;
- learner-facing language remains tentative.

## HIGH

Evidence strongly supports one cause and contradicts alternatives.

Action:

- targeted remediation can be recommended confidently.

The implementation may later use numeric thresholds internally.

---

# 10. When to probe

A diagnostic probe is justified when:

- the error matters enough;
- plausible causes differ materially in remediation;
- current evidence cannot distinguish them;
- one short probe can produce useful information.

Example:

```text
Wrong Ohm's-law calculation
Possible causes:
A. doesn't know relationship
B. can't transpose
```

High-value probe:

> Select the correct relationship for V, I and R.

Then, if correct:

> Rearrange a simple equation.

This is more efficient than sending the learner through a full lesson.

---

# 11. When not to probe

Do not probe when:

- the learner made one low-stakes mistake;
- evidence already strongly identifies the cause;
- the learner is in rapid pass-focused flow and the weakness is low-value;
- the diagnostic cost exceeds likely benefit;
- the same evidence can be gathered naturally in upcoming practice.

The engine should minimise interruption.

---

# 12. Information-gain objective

The preferred diagnostic probe should maximise:

> **useful reduction in uncertainty per unit of learner friction.**

This is the practical definition of information gain for Phase 1.

A probe should ideally distinguish two or more live hypotheses.

---

# 13. Diagnostic probe types

Phase 1 should support several probe families.

## 13.1 Concept probe

Example:

> If resistance stays constant and voltage increases, what happens to current?

## 13.2 Relationship-selection probe

Example:

> Which relationship would you use to find current from voltage and resistance?

## 13.3 Rearrangement probe

Example:

> Rearrange `x = yz` to make `z` the subject.

## 13.4 Arithmetic probe

Example:

> Calculate `230 ÷ 46`.

## 13.5 Unit/prefix probe

Example:

> Convert `2.2 kΩ` to ohms.

## 13.6 Reciprocal probe

Example:

> Find the reciprocal of 20.

## 13.7 Plausibility probe

Example:

> Can total resistance of this parallel network be greater than the smallest branch resistance?

## 13.8 Transfer probe

Example:

> Apply the same transposition skill in a mechanical-power formula.

Different probe types isolate different capabilities.

---

# 14. Probe difficulty

Diagnostic probes should be:

- as simple as possible;
- difficult enough to discriminate;
- free of unnecessary cognitive load.

A transposition probe should not also require awkward arithmetic if the purpose is to test transposition.

This is essential for clean evidence.

---

# 15. Probe sequencing

The engine should prefer:

> **broad discriminator first, narrow discriminator second**

Example:

```text
1. relationship-selection probe
   ↓
2. transposition probe
   ↓
3. pure Maths transposition
```

Only go deeper if needed.

---

# 16. Stopping rule for diagnosis

The engine must know when to stop investigating.

Stop when:

- one cause reaches sufficiently high confidence;
- remaining causes would lead to the same remediation;
- the learner declines deeper diagnosis;
- the issue is low-value for current intent;
- additional probing would create excessive friction.

This prevents "diagnostic overfitting".

---

# 17. Diagnostic overfitting

Diagnostic overfitting means spending too much learner effort trying to identify an extremely precise cause when a simpler intervention would work.

Example:

If two plausible causes both benefit from the same five-minute prefix/unit refresher, there may be no value in distinguishing them further.

The system should optimise outcomes, not diagnostic elegance.

---

# 18. Remediation object

A remediation should be a governed content object mapped to:

- target assertion/capability;
- prerequisite;
- misconception where relevant;
- intended depth;
- estimated learner time;
- retest requirement;
- learner intent suitability.

Example:

```text
Remediation:
Formula transposition — multiplicative equations

Target:
FM-ALG-TRANSPOSE-MULT

Duration:
~5 minutes

Depth:
pass-focused / foundational

Includes:
brief explanation
2 worked examples
3 guided questions
1 independent retest
```

Full content architecture belongs to WP1.5.

WP1.4 defines how remediation is selected.

---

# 19. Smallest useful remediation

The engine should select:

> **the smallest intervention likely to resolve the identified obstacle.**

Do not send a learner to a 30-minute Maths module because they made a single prefix error.

Examples:

- one factor-of-1000 error → short prefix refresher;
- repeated transposition failure → targeted algebra remediation;
- broad Electrical misconception → conceptual explanation + worked Electrical examples.

---

# 20. Pass-focused remediation

For learner intent:

> **MAKE ME PASS QUICKLY**

remediation should prioritise:

- assessed impact;
- high-frequency/high-weight weaknesses;
- valid shortcuts/strategies;
- minimal time;
- rapid re-entry to assessment-style questions.

Example:

If the learner can safely use a formula triangle to answer the target exam family, the engine may recommend that first.

Underlying general algebra can remain flagged for later deeper work.

---

# 21. Understanding-focused remediation

For learner intent:

> **MAKE ME UNDERSTAND**

the engine can go deeper:

- explain concept;
- address prerequisite;
- show derivation;
- give worked examples;
- test generalisation;
- use cross-domain transfer.

This should still remain efficient.

"Deep" does not mean "long for the sake of it".

---

# 22. Learner choice

Where both paths are valid, the learner should be able to choose:

- quick fix;
- deeper understanding;
- defer.

The engine should recommend, not coerce.

---

# 23. High-value intervention override

The platform may strongly recommend remediation where:

- weakness is central to many downstream topics;
- assessment impact is high;
- repeated failures show it is blocking progress;
- safety-critical knowledge is involved later.

Even then, learner-facing design should explain why.

---

# 24. Remediation prioritisation

When several weaknesses exist, rank interventions by a combination of:

- expected assessment benefit;
- prerequisite centrality;
- current confidence of diagnosis;
- remediation time;
- likelihood of unlocking multiple topics;
- learner intent;
- recency/severity.

Conceptually:

```text
value of remediation
≈ expected benefit × confidence × breadth unlocked
  ÷ learner time/friction
```

This should remain interpretable.

---

# 25. Foundational remediation should preserve vocational relevance

Even when remediation moves into Foundational Maths or Physics, the learner should understand why it matters.

Example:

> "This algebra step is the reason you're losing marks on several Electrical formula questions."

This maintains motivation.

---

# 26. Remediation sequence

A typical Phase 1 sequence:

```text
diagnosis
   ↓
brief explanation
   ↓
guided example
   ↓
isolated foundational practice
   ↓
foundational retest
   ↓
near transfer
   ↓
Electrical transfer
```

Not every weakness needs every stage.

---

# 27. Foundational retest

After foundational remediation, test the foundational capability directly.

Example:

> pure algebra transposition

This answers:

> **Did the underlying capability improve?**

Without this step, a successful Electrical question might hide continued weakness.

---

# 28. Vocational transfer retest

After foundational retest, test application back in Electrical.

Example:

```text
pure Maths transposition: pass
        ↓
Ohm's-law transfer: pass
        ↓
power-formula transfer: pass
```

This answers:

> **Can the learner apply the repaired foundation where it matters?**

This is one of the defining behaviours of the product.

---

# 29. Failed transfer

If foundational retest passes but Electrical transfer fails:

possible interpretation:

- foundational skill repaired;
- domain application/relationship selection remains weak.

The engine should shift diagnosis upward into Electrical rather than repeating the same Maths remediation.

---

# 30. Failed foundational retest

If remediation is completed but direct foundational retest fails:

- do not claim remediation succeeded;
- offer alternative explanation/strategy;
- reduce confidence in the original intervention;
- consider deeper prerequisite.

This provides feedback on remediation effectiveness itself.

---

# 31. Immediate versus delayed transfer

Immediate transfer is necessary but insufficient for durable mastery.

Phase 1 should support:

- immediate retest;
- later retrieval scheduled by the learning engine.

The delayed scheduling model can remain simple initially.

---

# 32. Remediation effectiveness evidence

The platform should measure:

- pre-remediation state;
- intervention used;
- immediate retest outcome;
- transfer outcome;
- later retrieval outcome.

This creates a dataset for improving remediation selection over time.

---

# 33. Next-best activity

After each meaningful update, the engine should select the next activity from categories such as:

- continue current practice;
- diagnostic probe;
- targeted remediation;
- foundational retest;
- transfer retest;
- spaced retrieval;
- assessment-style question;
- move to another weak area;
- progress to new material.

---

# 34. Next-best activity objective

The engine should optimise:

> **the best expected learner outcome for the learner's current intent, given current evidence and available time.**

Not simply:

> "show the weakest assertion next."

A weak assertion may be low-value or blocked by another prerequisite.

---

# 35. Pass-focused next-best activity

For pass-focused use, prioritise:

- high assessment weighting;
- near-threshold weaknesses;
- quick wins;
- common problem families;
- high-return prerequisites.

Example:

Fixing prefixes may unlock:

- Ohm's law;
- resistivity;
- power;
- voltage drop.

That can outrank an isolated low-frequency concept.

---

# 36. Mastery-focused next-best activity

For deeper learning, prioritise:

- foundational gaps;
- prerequisite chains;
- transfer;
- retention;
- conceptual breadth.

Assessment relevance still matters but is not the only objective.

---

# 37. Time budget

The engine should eventually respect available learner time.

Examples:

> "I have 10 minutes."

> "My exam is tomorrow."

> "I want a 45-minute study session."

Phase 1 should leave room for a simple session-time budget.

Do not build a complex scheduling optimiser yet.

---

# 38. Assessment proximity

As the exam approaches, pass-focused recommendations may legitimately shift toward:

- high-weight topics;
- exam-style practice;
- weakest high-yield capabilities;
- time-efficient strategies;
- confidence/readiness.

Deep foundational work can be deferred if it will not materially help the imminent goal.

---

# 39. Diagnostic persistence across sessions

Live hypotheses should persist where useful.

Example:

```text
Formula transposition weakness:
moderate support
needs direct probe
```

If the learner ends the session, the platform can resume intelligently later.

Do not discard unresolved diagnostic context every logout.

---

# 40. Hypothesis expiry

Diagnostic hypotheses should weaken or be re-evaluated when:

- old;
- contradicted by new evidence;
- affected by content correction;
- superseded by stronger diagnosis.

Do not keep stale labels forever.

---

# 41. Diagnostic explainability

For every intervention, the system should be able to explain internally:

```text
Recommended:
5-minute prefix conversion remediation

Why:
- 3 factor-of-1000 errors
- concepts/formula selection passed
- direct kΩ→Ω probe failed
- same prefix error observed in resistivity and Ohm's-law contexts
```

Learner-facing explanation may be:

> "Unit prefixes are costing you marks in several Electrical calculations."

---

# 42. Remediation explainability

The learner should understand:

- what weakness is being addressed;
- why it matters;
- estimated effort;
- what happens next.

Example:

> "You've got Ohm's law itself right, but kΩ→Ω conversion is causing repeated errors. A 3-minute refresher should fix this."

This is more motivating than:

> "Complete Maths Module 3.2."

---

# 43. Confidence-aware language

Use language appropriate to diagnostic confidence.

## Low confidence

> "This may be a unit-conversion issue."

## Moderate confidence

> "Unit conversion looks like the most likely cause."

## High confidence

> "We've seen repeated evidence that kΩ/Ω conversion is the problem."

Do not overstate.

---

# 44. LLM role

The diagnostic decision itself should not depend on unrestricted LLM reasoning.

LLMs may help with:

- wording explanations;
- generating candidate remediation content;
- interpreting free text in bounded contexts;
- natural-language learner-facing summaries.

But the core:

- hypothesis generation;
- evidence weighting;
- probe selection;
- intervention decision;

should be deterministic in Phase 1.

---

# 45. Why not LLM-first diagnosis?

LLM-first diagnosis would create:

- non-reproducible outcomes;
- harder regression testing;
- higher cost;
- difficult debugging;
- risk of overconfident invented reasoning.

A deterministic engine can still use AI-generated explanations after the decision is made.

---

# 46. Synthetic diagnostic personas

WP1.4 should extend WP1.3 personas into end-to-end diagnosis tests.

## Persona A — Algebra weakness

Expected engine behaviour:

```text
Electrical calculation failure
→ relationship probe passes
→ arithmetic passes
→ transposition probe fails
→ foundational Maths remediation
→ foundational retest
→ Electrical transfer
```

## Persona B — Parallel misconception

Expected behaviour:

```text
parallel question failure
→ reciprocal arithmetic passes
→ circuit-structure probe fails
→ Electrical conceptual remediation
→ parallel transfer retest
```

## Persona C — Prefix weakness

Expected behaviour:

```text
factor-of-1000 errors
→ direct prefix probe fails
→ short unit-prefix remediation
→ resistivity + Ohm's-law transfer
```

## Persona D — Formula-triangle compensator

Expected behaviour:

```text
algebra weak
formula triangle strong
assessment-style V-I-R strong

pass-focused:
continue exam strategy, optional deeper Maths

mastery-focused:
offer transposition remediation
```

## Persona E — Ambiguous failure

Expected behaviour:

```text
single wrong multi-step item
→ do NOT diagnose
→ continue/target one probe
```

---

# 47. False-positive diagnosis test

Phase 1 must test that the engine does **not** diagnose weakness where it should not.

Examples:

- one random wrong answer;
- correct novel transfer;
- arithmetic slip followed by repeated success;
- accidental wrong MCQ selection;
- learner declines remediation.

False positives are commercially dangerous because they make the product feel patronising and slow.

---

# 48. False-negative diagnosis test

Also test that the engine detects persistent hidden foundations.

Example:

learner repeatedly passes simple V-I-R using formula triangle but fails:

- resistivity rearrangement;
- mechanical power rearrangement;
- pure algebra.

The engine should preserve:

> exam success + underlying transposition weakness

rather than declaring universal mastery.

---

# 49. Remediation-loop regression tests

For each synthetic persona, automated tests should verify:

- candidate hypotheses generated;
- ranking sensible;
- appropriate probe selected;
- incorrect diagnosis avoided;
- remediation mapped correctly;
- retest sequence correct;
- transfer state updated correctly.

This should become a major Phase 1 regression suite.

---

# 50. Diagnostic success criteria

A successful Phase 1 root-cause engine does not need perfect human-level diagnosis.

It must demonstrate:

1. multiple plausible causes can coexist;
2. the engine avoids immediate topic-level labelling;
3. informative probes reduce uncertainty;
4. foundational versus domain causes can be distinguished in controlled cases;
5. remediation follows the identified cause;
6. transfer is explicitly verified;
7. strategy-aware behaviour works;
8. uncertainty remains visible when unresolved;
9. learner friction stays low enough for pass-focused use.

---

# 51. Diagnostic metrics

Phase 1 should measure:

- proportion of failures that trigger probes;
- average probes per resolved diagnosis;
- diagnosis confidence distribution;
- synthetic-persona classification accuracy;
- false-positive rate;
- false-negative rate;
- remediation completion;
- foundational retest success;
- transfer success;
- learner deferral rate;
- time added by diagnosis/remediation.

With real learners later, add:

- perceived usefulness;
- perceived interruption/friction;
- whether learners agree with diagnosis;
- subsequent performance improvement.

---

# 52. No fake precision

Do not report:

> "Root cause confidence: 87.23%"

unless empirically validated.

Use meaningful categories in Phase 1.

---

# 53. Remediation content hierarchy

Remediation should later exist at several depths.

## Micro-remediation

30 seconds–2 minutes.

Example:

> k / base-unit conversion.

## Short remediation

3–8 minutes.

Example:

> formula transposition refresher.

## Lesson remediation

10–20+ minutes.

Example:

> conceptual parallel-circuit foundations.

Phase 1 should prove at least micro and short remediation.

---

# 54. Repeated failed remediation

If the learner repeatedly fails the same remediation:

possible actions:

- use a different strategy/explanation;
- go one prerequisite deeper;
- reduce cognitive load;
- recommend a longer learning module;
- allow deferment.

Do not loop the same content indefinitely.

---

# 55. Remediation variants

The architecture should later permit multiple remediations for the same assertion:

- visual;
- text;
- worked-example;
- exam shortcut;
- conceptual;
- deeper derivation.

Phase 1 need only implement enough variants to prove the selection model.

---

# 56. Preferred remediation strategy

Where historical evidence later shows one remediation works better for a learner profile/context, the engine may learn preference.

This is future optimisation.

Phase 1 remains rule-based.

---

# 57. Cross-domain diagnosis

The engine must be able to move diagnosis between:

```text
Electrical
   ↓
Foundational Maths
   ↓
Electrical transfer
```

and:

```text
Electrical
   ↓
Foundational Physics
   ↓
Electrical transfer
```

This cross-domain traversal is a core differentiator.

---

# 58. Root cause may be multiple

Some failures have more than one contributing cause.

Example:

- weak transposition;
- weak unit conversion.

The engine should support:

```text
primary cause
secondary contributing cause
```

or multiple moderate hypotheses.

Do not force a single-root worldview.

---

# 59. Intervention batching

If several weaknesses can be efficiently addressed together, batching may be useful.

Example:

prefix conversion + scientific notation.

But avoid broad "Maths remediation" bundles that lose specificity.

---

# 60. Avoid remediation spam

The platform should not interrupt after every weakness.

Possible rule:

- minor/low-confidence issue → log and continue;
- repeated/high-value issue → recommend intervention;
- severe blocker → stronger recommendation.

This is crucial for smooth UX.

---

# 61. Learner autonomy

The learner should generally be able to:

- accept;
- defer;
- choose quick/deep;
- return later.

The engine should remember deferred high-value weaknesses without nagging constantly.

---

# 62. Deferred weakness queue

A learner may accumulate:

```text
deferred:
- formula transposition
- prefixes
```

The platform can later surface:

> "You have 10 minutes. Fixing prefixes is the quickest high-impact improvement."

This supports both autonomy and intelligent planning.

---

# 63. Readiness impact

Each weakness may have a separate estimate of exam/readiness impact based on:

- assessment weighting;
- dependency on many question families;
- current evidence.

This helps prioritise pass-focused remediation.

Do not equate readiness impact with conceptual importance.

---

# 64. High-centrality prerequisite

Some foundational capabilities support many downstream assertions.

Example:

formula transposition.

The engine should recognise that repairing a central prerequisite can unlock multiple Electrical families.

This should influence prioritisation.

---

# 65. Graph-centrality caution

Do not assume a mathematically central node is automatically the best learning target.

The learner may already have an effective compensating strategy.

Use graph structure alongside learner evidence and intent.

---

# 66. Diagnostic state lifecycle

Suggested lifecycle:

```text
OBSERVED_FAILURE
    ↓
HYPOTHESES_GENERATED
    ↓
UNRESOLVED
    ↓
PROBING
    ↓
LIKELY_CAUSE
    ↓
REMEDIATION_OFFERED
    ↓
REMEDIATION_COMPLETED
    ↓
FOUNDATION_RETESTED
    ↓
TRANSFER_RETESTED
    ↓
RESOLVED / PARTIALLY_RESOLVED / UNRESOLVED
```

Not every error needs a persisted lifecycle object.

Use this where the system enters an actual diagnostic episode.

---

# 67. Diagnostic episode

A **diagnostic episode** groups related evidence and interventions around a suspected weakness.

Example:

```text
Episode:
Formula transposition — August 2026

Evidence:
- power failure
- algebra probe failure

Intervention:
5-minute transposition remediation

Outcome:
foundational retest pass
Electrical transfer pass
```

This makes longitudinal analysis easier.

---

# 68. Episode closure

Close a diagnostic episode when:

- resolved;
- deferred long-term;
- disproven;
- superseded by another diagnosis;
- no longer relevant.

Do not leave thousands of perpetually "open" diagnoses.

---

# 69. Content-quality feedback loop

If many strong learners fail the same question in unusual ways, the issue may be the content rather than the learner.

The engine should eventually support signals such as:

> unusually high unexpected failure / distractor pattern

for content QA.

Phase 1 can log this but need not automate content invalidation.

---

# 70. Diagnosis can reveal bad knowledge modelling

If the engine constantly cannot distinguish causes because several assertions are too broad, that is a signal to revise WP1.2 content granularity.

Phase 1 should permit iteration between architecture layers.

Documents are governed, but evidence can justify revision.

---

# 71. Learner-facing progress after remediation

Progress should reflect meaningful outcomes:

> "You fixed a kΩ/Ω conversion weakness that was affecting Ohm's law and resistivity."

This is more valuable than:

> "Completed 8 questions."

---

# 72. Remediation success should influence future recommendations

If a learner repeatedly responds well to short worked examples, the system may later favour that format.

This is future personalisation.

Do not implement speculative learner personality profiling in Phase 1.

---

# 73. Phase 1 implementation order

When implemented, build the engine incrementally:

1. one failure family;
2. two competing hypotheses;
3. one diagnostic probe;
4. one remediation;
5. foundational retest;
6. transfer retest;
7. learner-state update;
8. synthetic regression test.

Then expand to additional families.

Do not implement every diagnostic rule at once.

---

# 74. First recommended diagnostic path

The first end-to-end implemented path should be:

> **formula transposition versus Electrical relationship-selection failure**

because it directly tests the platform's central cross-domain thesis.

Suggested flow:

```text
V-I-R calculation wrong
    ↓
relationship-selection probe
    ↓
if pass:
transposition probe
    ↓
if fail:
pure Maths probe
    ↓
targeted transposition remediation
    ↓
pure Maths retest
    ↓
new V-I-R transfer
    ↓
power/resistivity transfer
```

This should become the first "golden path" regression test.

---

# 75. Second recommended path

> **parallel-circuit misconception versus reciprocal arithmetic weakness**

Flow:

```text
parallel resistance wrong
    ↓
parallel-structure concept probe
    ↓
reciprocal arithmetic probe
    ↓
route to:
Electrical conceptual remediation
or
Maths reciprocal remediation
    ↓
transfer retest
```

---

# 76. Third recommended path

> **unit/prefix conversion weakness**

Flow:

```text
factor-of-1000 error
    ↓
direct prefix probe
    ↓
Foundational Maths/unit remediation
    ↓
Ohm's-law transfer
    ↓
resistivity transfer
```

These three paths provide strong Phase 1 coverage without requiring a universal diagnostic engine.

---

# 77. Acceptance criteria

WP1.4 is accepted when the Product Owner agrees that:

1. diagnosis is hypothesis-based rather than topic-score based;
2. multiple competing hypotheses can coexist;
3. hypotheses are generated from targets, prerequisites, misconceptions, strategies and error signatures;
4. diagnostic traversal is bounded to a relevant neighbourhood;
5. hypothesis ranking is deterministic and explainable in Phase 1;
6. low/moderate/high confidence are sufficient initial diagnostic bands;
7. probes are used only when they materially reduce uncertainty;
8. probe choice should maximise useful information per learner friction;
9. the engine has an explicit stopping rule for diagnosis;
10. the system avoids diagnostic overfitting;
11. remediation is mapped to the diagnosed capability/misconception;
12. the smallest useful remediation is preferred;
13. pass-focused and understanding-focused remediation can differ;
14. learner choice/deferment is preserved;
15. high-centrality/high-impact weaknesses can be prioritised;
16. foundational remediation is followed by direct foundational retest;
17. foundational success is followed by vocational transfer retest;
18. failed transfer redirects diagnosis rather than repeating irrelevant remediation;
19. remediation effectiveness becomes evidence;
20. next-best activity depends on learner intent, evidence, readiness impact and time;
21. unresolved hypotheses can persist across sessions;
22. diagnostic confidence language must not overclaim;
23. the core diagnostic engine remains deterministic-first;
24. LLMs may assist explanation but not invent root-cause decisions;
25. synthetic personas become regression tests;
26. both false-positive and false-negative diagnosis are explicitly tested;
27. cross-domain diagnosis is required;
28. multiple contributing causes are allowed;
29. deferred weaknesses can be surfaced later intelligently;
30. the first three implemented diagnostic paths are transposition, parallel/reciprocal and unit-prefix weakness;
31. diagnostic/remediation flow is only one entry route into the broader Learning Engine;
32. a learner can access lessons directly without first failing an assessment;
33. diagnosis arising inside a lesson can branch to remediation and then return to the original lesson.

---

# 78. Decision recommendation

**APPROVE WP1.4 as the conceptual Diagnostic & Remediation Engine for Phase 1.**

The central design decision is:

> **The platform will diagnose through competing, evidence-backed hypotheses over a bounded prerequisite/misconception graph; gather discriminating evidence only when useful; select the smallest appropriate intervention for the learner's intent; and verify both foundational repair and transfer back into vocational application.**

This is the mechanism that turns the knowledge graph and learner evidence model into the product's core differentiated behaviour.

---

# 79. Next work package

On approval of WP1.4, proceed to:

> **WP1.5 — Question & Learning-Content Architecture**

WP1.5 will define:

- question object structure;
- question types;
- deterministic parameterisation;
- misconception-linked distractors;
- answer/working representation;
- difficulty;
- context;
- diagnostic probes;
- remediation content;
- explanations;
- worked examples;
- question provenance;
- content validation;
- versioning;
- assessment-style versus diagnostic content;
- generation/reuse rules.

WP1.5 must preserve the evidence and diagnostic requirements defined in WP1.3 and WP1.4.

---

**End of WP1.4**
