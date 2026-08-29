# Phase 1 — WP1.3: Learner Evidence & Mastery Architecture

**Status:** Approved with post-approval clarification v0.2  
**Date:** 14 August 2026  
**Phase:** Phase 1 — Architecture & End-to-End Proving Slice  
**Depends on:** Approved WP1.1 and WP1.2  
**Purpose:** Define how learner interactions create evidence, how evidence updates learner state, how uncertainty is represented, and how the platform distinguishes performance, strategy, transferable mastery and probable weakness.

---

**V1 status note (CC-13A, 2026-08-29, added without altering anything below):** this document's evidence/mastery model remains current and authoritative — evidence/mastery history stays governed and auditable exactly as designed here. [`ADR-0006`](../../architecture/adr/ADR-0006-v1-canonical-lessons-and-assessment-driven-guided-revision.md) narrows *how* this evidence model is exposed to a V1 learner: mastery/evidence does not directly drive V1 ordinary-lesson routing (no per-learner skip/branch/reorder), and an ordinary embedded lesson check does not itself trigger remediation or update the V1 revision plan. The current V1-facing consumer of this evidence model is a deterministic Guided Revision plan, triggered only by a completed/submitted formative/mock assessment — see [`V1-LEARNING-ASSESSMENT-AND-GUIDED-REVISION-ARCHITECTURE.md`](../../architecture/V1-LEARNING-ASSESSMENT-AND-GUIDED-REVISION-ARCHITECTURE.md). The richer within-lesson/cross-lesson orchestration this document's model supports (and `LESSON-PLAYER-AND-LESSON-PLAN-ARCHITECTURE.md` §6/§7/§20 discusses at implementation level) remains retained implemented platform capability / post-V1 option — not deleted, but not a V1 requirement.

# 1. Purpose

WP1.3 defines the platform's learner-state model.

The central question is:

> **What can we legitimately infer from what the learner just did?**

This work package deliberately comes before the diagnostic/remediation engine.

WP1.4 will decide how to use learner evidence to select likely causes and interventions.

WP1.3 first defines:

- what evidence is;
- what one response can and cannot prove;
- how positive and negative evidence differ;
- how context affects interpretation;
- how learner strategies affect interpretation;
- how repeated evidence accumulates;
- how uncertainty is represented;
- how recency matters;
- how mastery differs from readiness;
- how mastery differs from performance;
- how foundational and contextual mastery interact;
- what should be persisted for later diagnosis.

The governing principle is:

> **A learner answer is evidence about knowledge and capability. It is not itself mastery.**

---

# 2. Why this architecture matters

A conventional question bank can record:

```text
Question 14: incorrect
Topic: Ohm's law
Score: 68%
```

That is insufficient for this product.

The platform needs to reason more carefully.

An incorrect answer may arise because the learner:

- does not understand voltage/current/resistance;
- chose the wrong relationship;
- cannot rearrange the formula;
- substituted incorrectly;
- mishandled a prefix;
- made an arithmetic slip;
- misread the question;
- used a valid strategy incorrectly;
- guessed;
- knew the answer but made an accidental input error.

Similarly, a correct answer may arise because the learner:

- genuinely understands the concept;
- successfully applies a transferable capability;
- uses a valid memorised strategy;
- eliminates distractors;
- guesses correctly;
- recognises a familiar item without deeper mastery.

Therefore:

> **Correctness is one evidence signal, not the learner model.**

---

# 3. Core separation of concerns

The architecture must keep five things separate.

## 3.1 Interaction outcome

What happened on this attempt?

Examples:

- correct;
- incorrect;
- partially correct;
- skipped;
- timed out;
- changed answer;
- requested hint;
- viewed explanation;
- used calculator if relevant;
- selected a specific distractor.

## 3.2 Evidence

What does that outcome suggest about one or more assertions/capabilities/misconceptions?

## 3.3 Learner state

What does the accumulated evidence currently support about the learner?

## 3.4 Diagnosis

What probable underlying cause best explains a pattern of evidence?

This belongs primarily to WP1.4.

## 3.5 Intervention

What should the system do next?

Also primarily WP1.4.

Do not collapse these into one "mastery score".

---

# 4. Evidence object

Each meaningful learner interaction should create one or more **evidence records**.

Conceptually:

```text
LEARNER
   │
   ▼
INTERACTION ATTEMPT
   │
   ├── target assertion evidence
   ├── prerequisite evidence
   ├── misconception evidence
   ├── strategy evidence
   └── contextual-transfer evidence
```

An evidence record should identify at least:

- learner;
- interaction/attempt;
- assertion/capability or misconception concerned;
- evidence direction;
- evidence strength;
- context;
- strategy if known;
- timestamp;
- source question/content version;
- whether evidence was directly observed or inferred.

The exact database representation belongs to implementation.

---

# 5. Evidence direction

Evidence should not be stored merely as "right/wrong".

At minimum, support:

## SUPPORTS_MASTERY

The interaction provides evidence in favour of the learner possessing the target knowledge/capability.

## SUPPORTS_WEAKNESS

The interaction provides evidence that mastery may be absent or unreliable.

## SUPPORTS_MISCONCEPTION

The response is specifically consistent with a mapped misconception.

## SUPPORTS_STRATEGY

The interaction indicates successful/unsuccessful use of a particular strategy.

## INCONCLUSIVE

The interaction has too little diagnostic value to materially alter learner state.

An interaction may create multiple evidence records in different directions.

---

# 6. Direct versus inferred evidence

The model should distinguish:

## Direct evidence

The interaction directly tests the relevant capability.

Example:

> Rearrange `x = yz` to make `z` the subject.

This directly tests a transposition capability.

## Inferred evidence

The interaction requires the capability as one part of a larger chain.

Example:

> Calculate current from voltage and resistance.

A correct answer may indirectly support:

- formula selection;
- transposition;
- arithmetic;
- units.

But the answer alone may not prove which strategy was used.

Therefore inferred evidence is usually weaker than direct evidence.

---

# 7. Evidence strength

Evidence strength should be explicit.

The Phase 1 model should support at least:

- **weak**
- **moderate**
- **strong**

A numeric internal representation may later support computation, but learner-facing language should remain meaningful.

Examples:

### Weak positive evidence

One correct multiple-choice answer where guessing is plausible.

### Moderate positive evidence

Correct response to a well-targeted free calculation with plausible distractors removed.

### Strong positive evidence

Repeated correct performance across different contexts, including transfer, without hints.

### Weak negative evidence

One wrong answer to a multi-step problem.

### Strong negative evidence

Repeated failure on a direct isolated prerequisite probe.

The system must not assume that positive and negative evidence have identical meaning.

---

# 8. Evidence quality dimensions

Evidence strength should be informed by several dimensions.

## 8.1 Directness

How directly did the item test the assertion?

## 8.2 Discrimination

How well does the interaction distinguish competing explanations?

## 8.3 Guessability

How easy was it to obtain the correct answer without mastery?

## 8.4 Complexity

How many separate capabilities were required?

A failure on a five-step problem is ambiguous.

## 8.5 Assistance

Was the answer obtained:

- unaided;
- after a hint;
- after viewing a formula;
- after seeing an explanation;
- after repeated retries?

## 8.6 Novelty

Was the task:

- identical to recent practice;
- structurally similar;
- meaningfully novel?

## 8.7 Context distance

Was the capability tested:

- in the same context;
- a near-transfer context;
- a substantially different context?

These dimensions can later inform a numeric evidence weight, but Phase 1 should preserve them semantically rather than hiding everything in one number.

---

# 9. One correct answer is not mastery

A single correct answer should almost never promote a learner directly to "mastered".

Reasons include:

- chance;
- pattern recognition;
- memorisation;
- lucky arithmetic;
- clueing from distractors;
- prior exposure to the exact question.

The platform should normally require **multiple sufficiently independent evidence events** before high-confidence mastery.

Exceptions may exist for trivial recognition facts, but should be explicit.

---

# 10. One wrong answer is not weakness

Likewise, one wrong answer should not immediately label a learner weak.

The system should initially ask:

> **What are the plausible causes of this error, and what evidence would discriminate among them?**

This is especially important for multi-step Electrical calculations.

A wrong answer may weaken confidence in the target capability but should usually increase **uncertainty** rather than immediately create a firm diagnosis.

---

# 11. Learner-assertion state

For each learner and assertion/capability, the platform should maintain a persistent state.

Conceptually:

```text
LEARNER_ASSERTION_STATE

status
evidence_strength
confidence
last_evidence_at
positive_evidence_count
negative_evidence_count
direct_evidence_count
transfer_evidence_count
recent_trend
```

The exact persisted fields may be simplified later.

The important requirement is that the system can reconstruct **why** it believes what it believes.

---

# 12. Mastery states

Phase 1 should use interpretable states rather than pretending that a precise percentage is scientifically meaningful before the model is validated.

Recommended initial states:

## NOT_ASSESSED

No useful evidence.

## INSUFFICIENT_EVIDENCE

Some evidence exists, but not enough to classify reliably.

## EMERGING

Evidence suggests partial capability but performance remains inconsistent or narrow.

## PROVISIONALLY_SECURE

Strong recent evidence exists in the learned/practised context.

## TRANSFER_SECURE

The learner has demonstrated the capability across materially different contexts.

## WEAK

Repeated evidence supports lack of reliable mastery.

## CONFLICTING

Strong positive and negative evidence coexist and require further probing.

These names may later be adjusted for learner-facing copy.

Internally they express different epistemic states.

**Epistemic** means relating to what we know and how certain we are. It matters here because the system must distinguish "we do not know yet" from "the learner does not know".

---

# 13. Mastery is not binary

Avoid a simplistic:

```text
mastered = true / false
```

A learner may:

- know the concept but fail under calculation load;
- perform correctly using a narrow strategy;
- succeed in familiar questions but fail transfer;
- have previously mastered something but now show decay;
- have inconsistent evidence.

The learner model must preserve these distinctions.

---

# 14. Mastery dimensions

For Phase 1, mastery should be decomposable into at least:

## 14.1 Conceptual understanding

Does the learner understand the proposition/relationship?

## 14.2 Procedural capability

Can the learner carry out the required method?

## 14.3 Contextual application

Can the learner apply it in the Electrical context?

## 14.4 Transfer

Can the learner apply the same underlying capability in a different context?

## 14.5 Fluency

Can the learner perform reliably and efficiently?

Fluency should not dominate Phase 1, but the model should leave room for it.

Not every assertion requires every dimension.

---

# 15. Context-specific versus transferable mastery

This is central to the product thesis.

Example:

A learner repeatedly solves:

> `V = IR`

using a formula triangle.

They may have:

```text
Electrical Ohm's-law application: strong
Formula-triangle strategy: strong
General algebraic transposition: uncertain/weak
```

This is valid.

Do not force the learner model to collapse them into one state.

Likewise, a learner who can solve pure algebra but cannot select the correct Electrical relationship may have:

```text
Foundational Maths: strong
Electrical relationship selection: weak
```

This is the distinction the root-cause engine needs.

---

# 16. Strategy-aware evidence

A correct answer provides different evidence depending on the strategy used.

If strategy is observable or explicitly elicited, store it.

Examples:

- formula triangle;
- formal algebra;
- memorised rearranged equation;
- equal-resistor shortcut;
- reciprocal formula;
- elimination of distractors.

A successful strategy should support:

- exam-task capability;
- strategy-specific capability.

It should support underlying transferable knowledge only to the extent justified.

Example:

> Correctly using a formula triangle is strong evidence of successful Ohm's-law procedural performance, but only weak evidence of general algebraic transposition.

---

# 17. Strategy does not need to be captured every time

The product must not burden learners by continually asking:

> "How did you solve that?"

Strategy can be inferred only when:

- the interaction format reveals it;
- a diagnostic probe isolates it;
- the learner chooses to show work;
- the learner is in a deeper-learning mode where explanation is appropriate.

Unknown strategy is acceptable.

The evidence model must support uncertainty rather than fabricating one.

---

# 18. Misconception evidence

Selecting a misconception-linked distractor should create **evidence for a misconception**, not a definitive diagnosis.

Example:

A learner selects:

> total parallel resistance = sum of branch resistances.

This may support the misconception:

> "parallel resistance is added like series resistance."

But competing causes may include:

- misreading the circuit;
- accidental selection;
- arithmetic/reciprocal confusion;
- test-taking error.

One response should usually create:

```text
misconception evidence: moderate
diagnosis: not yet confirmed
```

Repeated consistent indicators can strengthen it.

---

# 19. Error signature

The system should preserve the **error signature** where useful.

An error signature is structured information about *how* an answer was wrong.

Examples:

- magnitude correct, unit wrong;
- factor-of-1000 error;
- reciprocal omitted;
- series formula used on parallel circuit;
- correct formula but arithmetic wrong;
- wrong variable isolated;
- answer larger than physically plausible range.

This can be much more diagnostically useful than simply storing the selected answer.

---

# 20. Numerical error pattern

For generated numerical questions, deterministic analysis should be used where possible.

Example:

Correct:

```text
2.5 A
```

Learner:

```text
2500 A
```

Possible signal:

> factor-of-1000 prefix error.

Another learner:

```text
0.4 A
```

Possible signal:

> inverted division / reciprocal error.

These are evidence hypotheses, not automatic diagnoses.

The system should record the mathematical relationship between learner answer and expected answer where useful.

---

# 21. Multiple-choice evidence

Multiple-choice items remain important because Test 602 is multiple choice.

But evidence strength depends on distractor design.

A random distractor provides little information.

A misconception-linked distractor may provide useful evidence.

Therefore question design should eventually distinguish:

- correct option;
- plausible misconception distractors;
- procedural-error distractors;
- unit/prefix distractors;
- low-information distractors.

WP1.5 will define this in detail.

---

# 22. Free-response evidence

Short numerical/free-text responses often provide stronger diagnostic evidence because:

- guessing probability is lower;
- exact numerical error patterns can be examined;
- unit selection can be separated;
- distractors do not cue the answer.

Phase 1 should therefore include diagnostic interactions beyond multiple choice even though the real assessment is MCQ.

---

# 23. Evidence independence

Repeated evidence is most valuable when it is meaningfully independent.

Ten near-identical questions immediately after teaching should not equal ten independent proofs of mastery.

Evidence independence increases when:

- numbers change;
- wording changes;
- context changes;
- formula orientation changes;
- time passes;
- surface features differ;
- the learner must transfer rather than repeat.

The mastery model should down-weight highly repetitive evidence.

---

# 24. Recency

Recent evidence should normally influence current mastery more than very old evidence.

However:

> **old evidence should not disappear.**

The system should retain history and derive a current state.

Phase 1 should support recency-aware interpretation without committing yet to a precise decay equation.

---

# 25. Learning decay and retrieval

A capability that was secure three months ago may no longer be equally secure.

The platform should eventually schedule retrieval based on:

- prior evidence strength;
- time since demonstration;
- importance;
- subsequent failures/successes.

WP1.3 only requires the learner-state architecture to preserve enough history for this later scheduling.

---

# 26. Negative evidence after prior mastery

If a previously secure learner later fails:

Do not immediately erase mastery.

Instead, possible states include:

- lapse;
- context-specific failure;
- careless error;
- decay;
- conflicting evidence.

The system should seek discriminating evidence.

This avoids oscillating wildly between "mastered" and "weak".

---

# 27. Positive evidence after remediation

Success immediately after remediation is valuable but often **not enough to establish durable mastery**.

The sequence should distinguish:

```text
remediation success
       ↓
immediate retest
       ↓
near transfer
       ↓
later retrieval
       ↓
stronger mastery evidence
```

Immediate post-teaching success may be classified as provisional.

---

# 28. Transfer evidence

Phase 1 should explicitly record transfer distance.

Suggested initial categories:

## SAME_CONTEXT

Very similar to the original learning/practice context.

## NEAR_TRANSFER

Same underlying knowledge, changed surface/problem structure.

Example:

Ohm's-law current calculation with different wording and unknown variable.

## CROSS_CONTEXT_TRANSFER

Same foundational capability applied in another domain/context.

Example:

formula transposition tested in pure Maths after Electrical failure.

## VOCATIONAL_TRANSFER

Foundational remediation successfully applied back into Electrical.

This is central to proving the product thesis.

---

# 29. Transfer-secure mastery

A learner should only reach **TRANSFER_SECURE** where evidence demonstrates the capability beyond narrow repetition.

Example:

```text
pure algebra probe: correct
Ohm's-law rearrangement: correct
power relationship rearrangement: correct
resistivity rearrangement: correct
```

This is much stronger evidence of transferable transposition capability than four identical Ohm's-law questions.

---

# 30. Difficulty

Question difficulty affects evidence interpretation.

A learner passing a challenging item may provide stronger evidence than passing a trivial recognition item.

However, Phase 1 should not assume a global calibrated difficulty scale exists.

Initial difficulty may be:

- authored estimate;
- later empirically calibrated.

Do not pretend authored difficulty is statistically validated.

---

# 31. Item calibration

Longer term, real learner response data may support empirical item calibration.

Possible future techniques include Item Response Theory.

Phase 1 does not require IRT.

It only requires the data model to retain:

- item identity/version;
- attempts;
- correctness;
- learner state/context;
- timing where appropriate.

This leaves room for later calibration.

---

# 32. Time-on-task

Response time can sometimes provide useful signals.

Examples:

- instant answer may suggest recall or guessing;
- very long answer may suggest struggle;
- repeated rapid guesses may indicate disengagement.

But time is noisy.

It should not be a primary mastery signal in Phase 1.

Use it as supporting context only.

---

# 33. Hints and assistance

Evidence must reflect assistance.

A correct answer after:

- full worked solution;
- formula reveal;
- targeted hint;
- one incorrect attempt;

is not equivalent to an unaided correct answer.

The evidence record should preserve assistance level.

Suggested categories:

- none;
- minor_hint;
- substantial_hint;
- formula_provided;
- worked_example_seen;
- answer_revealed.

Exact names are implementation details.

---

# 34. Retry evidence

Repeated retries on the same item have diminishing diagnostic value.

Example:

```text
Attempt 1: wrong
Attempt 2: wrong
Attempt 3: correct after hint
```

Do not treat this as the same mastery evidence as:

```text
First attempt, novel item: correct
```

The full attempt sequence should be retained.

---

# 35. Confidence and evidence strength are different

Two concepts must remain separate.

## Evidence strength

How informative is this particular observation?

## State confidence

How confident are we in the current learner-state classification after considering all evidence?

Example:

One strong direct probe may be strong evidence but still leave overall state only moderately certain because it is the first observation.

---

# 36. Confidence representation

Phase 1 should support at least:

- low;
- medium;
- high.

A hidden numeric score may later be useful.

The learner-facing product should usually express meaningful language rather than false precision such as:

> "You have 73.4% mastery of algebraic transposition."

Unless later empirical validation justifies that precision.

---

# 37. Readiness versus mastery

This distinction is commercially important.

A learner can be **ready to pass the exam** without mastering every foundational capability deeply.

Example:

- reliably uses formula triangles;
- succeeds on assessment-style items;
- general transposition remains weak.

Therefore maintain separate concepts:

## Mastery

Depth/reliability/transfer of the underlying knowledge/capability.

## Assessment readiness

Probability/strength of performance against a defined assessment blueprint.

WP1.3 defines the separation.

The exact readiness model belongs later.

---

# 38. "Make me pass" must not corrupt mastery

For pass-focused learners, the engine may optimise around:

- assessment weighting;
- high-yield weaknesses;
- valid shortcuts;
- formula-triangle strategies;
- common question families.

But:

> **Successful exam strategy must not falsely mark underlying foundational knowledge as mastered.**

This allows the same learner model to support immediate exam success and future deeper learning.

---

# 39. "Make me understand" must not block progress

Likewise, a learner choosing deeper understanding should receive:

- conceptual explanation;
- prerequisite remediation;
- transfer tests;
- spaced retrieval.

But the product should still acknowledge when they are already assessment-ready.

Do not make mastery depth the only success measure.

---

# 39.1 Learning Mode does not require diagnostic entry

Learner evidence architecture must support a learner who begins with no
assessment history and deliberately works through a syllabus lesson by
lesson.

`NOT_ASSESSED` is therefore a valid starting state for teaching.

The Learning Engine may teach first and use independent checks inside
the lesson to create the first useful evidence.

The system must not require:

```text
diagnostic test
→ weakness
→ lesson unlocked
```

before teaching content becomes available.

---

# 39.2 Lesson progress is separate from mastery

The learner may have lesson-level progress such as:

- not started;
- in progress;
- completed;
- review due.

This is separate from assertion-level mastery.

Examples:

```text
Lesson completed
Assertion mastery uncertain
```

is possible.

Likewise:

```text
Lesson not completed
Assertions already secure from prior evidence
```

is possible.

Dashboards may display both, but neither should silently overwrite the
other.

---

# 40. Learner intent is session/context metadata

Learner intent may change.

The same person can be:

> "teach me this"

today and:

> "I have an exam tomorrow; make me pass"

next week.

Therefore learner intent should not be stored as a permanent personality label.

It should be treated as:

- session preference;
- activity preference;
- possibly learned behavioural preference;
- overridable at any time.

---

# 41. Evidence from skipped remediation

If the learner declines deeper remediation:

Do not interpret this as evidence of knowledge weakness or unwillingness to learn.

It is a product choice.

The system may preserve:

```text
remediation_offered
remediation_deferred
```

for scheduling/UX.

It should not negatively affect mastery.

---

# 42. Evidence from confidence self-rating

The platform may later ask:

> "How confident were you?"

Self-rating can be useful for:

- metacognition;
- identifying overconfidence;
- identifying lucky correct answers;
- personalising review.

But self-reported confidence is not direct mastery evidence.

Treat it as a separate signal.

**Metacognition** means awareness of one's own understanding and uncertainty.

---

# 43. Evidence provenance

Every learner-state update should be traceable to its evidence.

The system should be able to answer:

> **Why do we currently think formula transposition is weak?**

Example response internally:

```text
- failed direct algebra probe
- failed resistivity rearrangement
- selected transposition-linked distractor in power question
- succeeded when formula triangle supplied
```

This explainability is necessary for:

- debugging;
- learner trust;
- content QA;
- diagnostic validation.

---

# 44. State recomputation

Where practical, current mastery state should be recomputable from persisted evidence rather than existing only as opaque mutable state.

That does not mean recalculating the entire learner history on every page load.

It means:

> **the derived state should have an auditable evidence basis.**

A cached/materialised state may exist for performance.

---

# 45. Evidence conflict

Conflicting evidence is expected.

Examples:

- learner passes conceptual questions but fails calculations;
- passes pure Maths but fails Electrical application;
- fails repeatedly then performs strongly after a gap;
- performs well in practice but poorly in mock conditions.

Do not force immediate resolution.

Use the **CONFLICTING** or **INSUFFICIENT_EVIDENCE** state and select a discriminating probe later.

---

# 46. Diagnostic uncertainty

The learner model should allow statements such as:

> "Formula transposition is a plausible weakness, but evidence is currently insufficient to distinguish it from relationship selection."

That is better than confidently wrong diagnosis.

The learner-facing product may simplify this wording, but the engine must preserve the uncertainty.

---

# 47. Evidence propagation through prerequisites

Evidence should not propagate naively.

Example:

If the learner correctly solves a complex power question, it may provide some supporting evidence for arithmetic and transposition.

But it should **not automatically mark every prerequisite mastered**.

Likewise, failure on a complex question should not mark all prerequisites weak.

Propagation must depend on:

- directness;
- necessity of the prerequisite;
- observed strategy;
- alternative explanations.

WP1.4 will define diagnostic traversal.

WP1.3 establishes that propagation is probabilistic/weighted, not binary.

---

# 48. Positive prerequisite inference

Where a task genuinely requires prerequisite A and the learner succeeds unaided, the task can provide **supporting positive evidence** for A.

Example:

If solving a resistivity calculation demonstrably required:

- scientific notation;
- unit conversion;
- transposition;

and the working/interaction format confirms those operations, evidence can flow to them.

If strategy is unknown, inferred prerequisite evidence should be weaker.

---

# 49. Negative prerequisite inference

Failure on a task should create **candidate negative evidence** against required prerequisites only cautiously.

Example:

Wrong parallel resistance answer does not automatically imply reciprocal weakness.

The learner may misunderstand the parallel rule.

The system should use diagnostic probes to discriminate.

---

# 50. Evidence from worked steps

Where the interface captures intermediate steps, diagnostic power increases substantially.

Example:

```text
1/Rt = 1/10 + 1/20      correct
1/Rt = 0.15             correct
Rt = 6.67 Ω             correct
```

versus:

```text
Rt = 10 + 20 = 30 Ω
```

The second directly supports a circuit-rule misconception.

Phase 1 should include some interactions that expose intermediate reasoning without requiring all practice to become laborious step-by-step entry.

---

# 51. Learner burden principle

More diagnostic data is not automatically better.

The system must balance information gain against friction.

Do not turn every question into:

- answer;
- show working;
- explain reasoning;
- confidence rating;
- strategy selection;
- follow-up survey.

The diagnostic engine should ask for extra information when it is valuable enough to justify interrupting flow.

This is especially important for pass-focused learners.

---

# 52. Information-gain principle

A diagnostic probe should be chosen because it can distinguish plausible causes.

Example:

Current evidence leaves two hypotheses:

```text
H1: learner does not know Ohm's law
H2: learner knows Ohm's law but cannot transpose it
```

A pure transposition probe has high information value.

Another general Ohm's-law question may not.

WP1.4 will operationalise this.

WP1.3 requires evidence metadata rich enough to support it.

---

# 53. Learner state should remain sparse

A learner should not be assigned states for thousands of assertions they have never encountered.

Store:

- direct learner states where evidence exists;
- carefully inferred states where justified;
- unknown elsewhere.

This is both computationally efficient and epistemically honest.

---

# 54. Hierarchical summaries

Learner-facing dashboards may later show:

```text
DC Circuits: Strong
Maths for Electrical: Needs attention
Power: Developing
```

These are **derived summaries** over granular assertion states.

They must not replace the assertion-level model.

A learner can be strong overall in "DC circuits" while having one important hidden prerequisite weakness.

---

# 55. Topic score versus assertion evidence

Topic percentages such as:

> "Ohm's Law 78%"

may be useful UX.

But they are product summaries.

They should not be treated as the canonical learner state.

The canonical state remains evidence attached to assertions/capabilities.

---

# 56. Assessment blueprint readiness

A future readiness score should combine:

- assessed knowledge coverage;
- curriculum/assessment weighting;
- recent evidence;
- item difficulty;
- reliability/transfer;
- perhaps time pressure.

It must remain separate from deep mastery.

Phase 1 only needs enough architecture to calculate a basic deterministic readiness estimate later.

---

# 57. Unseen knowledge

The system must distinguish:

> **not assessed**

from:

> **weak**

This seems obvious but is commonly mishandled.

A new learner should not see:

> "You are weak in parallel circuits"

before any evidence exists.

Use:

> "Not yet assessed"

or equivalent.

---

# 58. Learner history

Persist a chronological evidence history.

This enables later questions such as:

- What changed after remediation?
- Is this weakness recurring?
- Is the learner improving?
- Did performance decay?
- Does success persist across contexts?
- Was the current state based only on old evidence?

History is a product asset.

---

# 59. Privacy principle

Learner evidence can become sensitive educational data.

Therefore:

- collect only data useful to the product;
- do not infer unrelated personal traits;
- keep learner data isolated;
- retain auditability;
- allow account-level deletion/export where required later;
- avoid storing unnecessary free-text reasoning indefinitely without purpose.

Detailed implementation belongs to WP1.6 security/privacy architecture.

---

# 60. No psychometric overclaiming

The system must not describe early mastery estimates as scientifically validated psychometric measures unless they actually are.

Phase 1 is a learning-engine proving slice.

Terms such as:

- mastery;
- confidence;
- readiness;

must be defined operationally.

Later empirical validation may strengthen them.

---

# 61. Initial deterministic evidence model

Phase 1 should begin with an understandable deterministic model rather than immediately implementing a black-box statistical learner model.

Conceptually:

```text
interaction
   ↓
evidence extraction
   ↓
evidence weighting
   ↓
assertion-state update
   ↓
confidence/state classification
```

Rules should be explicit enough to test.

If later data supports Bayesian Knowledge Tracing or another statistical model, it can be introduced without replacing the underlying evidence architecture.

---

# 62. Why deterministic first

A deterministic first model provides:

- explainability;
- reproducibility;
- easier debugging;
- lower runtime cost;
- easier content QA;
- clearer evidence when the model is wrong.

This aligns with the Phase 0 deterministic-first operating principle.

---

# 63. Candidate evidence weighting framework

WP1.3 does not freeze exact weights, but recommends that an evidence event can eventually be computed from factors such as:

```text
base item evidence
× directness
× assistance modifier
× guessability modifier
× novelty modifier
× context/transfer modifier
× repetition-independence modifier
```

This is a conceptual framework only.

WP1.3 should not invent arbitrary decimals and pretend they are validated.

Initial implementation may use explicit ordinal rules instead.

---

# 64. Example: formula transposition learner

Evidence history:

```text
1. Ohm's-law MCQ correct
   - strategy unknown
   - weak positive evidence for transposition

2. Power calculation wrong
   - wrong rearrangement
   - moderate negative evidence

3. Pure algebra direct probe wrong
   - strong negative evidence

4. Formula triangle provided; Ohm's-law item correct
   - strong positive evidence for formula-triangle strategy
   - little positive evidence for general transposition

5. Maths remediation completed

6. Pure algebra direct retest correct
   - strong positive evidence

7. Novel resistivity rearrangement correct
   - strong transfer evidence
```

Result:

```text
Before remediation:
General transposition: WEAK, high confidence
Ohm's-law task performance: EMERGING
Formula-triangle strategy: PROVISIONALLY_SECURE

After remediation + transfer:
General transposition: PROVISIONALLY_SECURE / moving toward TRANSFER_SECURE
Ohm's-law task performance: PROVISIONALLY_SECURE
```

This is richer than a single topic score.

---

# 65. Example: parallel circuit learner

Evidence:

```text
1. Parallel total resistance MCQ:
   selects sum of resistances

2. Direct conceptual question:
   says parallel total resistance is greater than individual branches

3. Reciprocal arithmetic probe:
   correct

4. Simple circuit-structure probe:
   incorrect
```

Interpretation:

> Strong evidence for Electrical parallel-structure misconception, weak evidence for Maths weakness.

The engine should not send this learner to fractions practice.

---

# 66. Example: unit conversion learner

Evidence:

```text
1. Ohm's-law concept question: correct
2. Formula selection: correct
3. Calculation using kΩ: factor-of-1000 error
4. Direct kΩ→Ω conversion: wrong
5. Same conversion in non-Electrical context: wrong
```

Interpretation:

> Foundational prefix/unit conversion weakness with cross-context evidence.

Remediation should target the foundational capability.

---

# 67. Example: exam-ready but not deeply mastered

Evidence:

```text
- assessment-style V-I-R questions: consistently correct
- formula triangle use: reliable
- pure algebra transposition: weak
- time-to-answer: acceptable
```

Possible state:

```text
Assessment readiness for V-I-R family: HIGH
Electrical procedural performance: SECURE
General formula transposition: WEAK
Deep transferable mastery: NOT SECURE
```

This is not a contradiction.

It is exactly why readiness and mastery must be separate.

---

# 68. Phase 1 minimum evidence scenarios

The proving slice must contain test scenarios that demonstrate at least:

1. one learner with genuine Electrical conceptual weakness;
2. one learner with Foundational Maths weakness;
3. one learner with unit/prefix weakness;
4. one learner using a compensating strategy successfully;
5. one learner with ambiguous evidence requiring a diagnostic probe;
6. one learner with conflicting evidence;
7. one learner who remediates successfully and transfers;
8. one learner who passes immediate retest but fails later/novel transfer;
9. one learner whose prior mastery decays or becomes uncertain;
10. one learner who is exam-ready without deep foundational mastery.

These may initially be synthetic test personas before real learners are available.

---

# 69. Synthetic learner personas

Phase 1 should define deterministic synthetic personas with controlled response patterns.

Example:

## Persona A — Algebra weakness

- Electrical concepts correct;
- formula selection correct;
- transposition frequently wrong;
- pure arithmetic strong;
- formula triangle successful.

## Persona B — Electrical misconception

- Maths strong;
- formula manipulation strong;
- series/parallel rules confused.

## Persona C — Prefix weakness

- formulas correct;
- repeated ×1000/÷1000 errors.

Synthetic personas allow automated regression testing of learner-state logic.

They do not replace real learner validation.

---

# 70. Regression-test requirement

Once the evidence engine correctly handles a persona, later changes must not silently break that behaviour.

Examples:

- improving series-circuit diagnosis must not cause the algebra persona to be misclassified;
- changing evidence weights must not make one MCQ enough for mastery;
- changing question metadata must not erase strategy distinctions.

These become automated tests during implementation.

---

# 71. Learner-state explainability requirement

For every derived learner state, the system should be able to produce an internal explanation:

```text
State: WEAK
Confidence: HIGH

Why:
- 2 direct failed transposition probes
- 1 failed transfer application
- 1 successful formula-triangle application
- arithmetic probes passed
```

The learner-facing version can be much shorter.

This explainability is required for Product Owner review and debugging.

---

# 72. Evidence versioning

Evidence must refer to the exact version of the question/content/assertion used at the time.

If a question is later corrected, historical evidence should not silently pretend the learner answered the corrected version.

This requires:

- question version reference;
- assertion version reference;
- timestamp.

WP1.5 will define question versioning in detail.

---

# 73. Invalidated evidence

If later QA finds a question was flawed:

the system needs a way to:

- mark that evidence invalid or unreliable;
- recompute affected learner state;
- preserve audit history.

Do not delete the evidence as though the event never happened.

---

# 74. Evidence retention and aggregation

Raw evidence should be retained at least through the proving phase.

Derived aggregates may be maintained for performance.

The architecture must support:

```text
raw attempts
      ↓
evidence events
      ↓
derived learner-assertion state
      ↓
topic/readiness summaries
```

Do not store only the final summary.

---

# 75. Mastery update triggers

Learner state may update after:

- question response;
- diagnostic probe;
- remediation retest;
- mock assessment;
- spaced retrieval;
- manually validated external evidence later.

For Phase 1, focus on platform-generated interactions.

---

# 76. External evidence

Later versions may accept evidence such as:

- tutor assessment;
- verified qualification result;
- practical observation;
- imported provider data.

These should have distinct evidence-source types and reliability assumptions.

Phase 1 does not implement this.

The architecture should not preclude it.

---

# 77. Practical competence boundary

The app must not infer practical competence solely from theory questions.

For example:

> correct knowledge of meter connection

does not prove:

> safe practical competence using the instrument.

Knowledge evidence and observed practical competence are separate.

This preserves the Phase 0 practical-competence boundary.

---

# 78. Learner-facing language

Avoid overclaiming.

Prefer:

> "This looks like a likely weakness in formula transposition."

over:

> "You cannot transpose formulae."

Prefer:

> "We've seen strong evidence that you can apply this in DC circuit questions."

over:

> "Mastery: 93%."

The interface should communicate confidence honestly.

---

# 79. Progress summaries

Progress should show meaningful change such as:

- newly secure knowledge;
- weaknesses repaired;
- transfer demonstrated;
- assessment readiness improved;
- areas still unassessed.

Avoid vanity metrics such as raw question count as the main progress measure.

Question count can still be shown as secondary activity data.

---

# 80. Acceptance criteria

WP1.3 is accepted when the Product Owner agrees that:

1. learner responses create evidence; they do not directly equal mastery;
2. interaction outcome, evidence, learner state, diagnosis and intervention are separate layers;
3. evidence can be direct or inferred;
4. evidence direction and strength are explicit;
5. one correct answer is normally insufficient for mastery;
6. one wrong answer is normally insufficient for weakness;
7. learner-assertion state is persistent and evidence-backed;
8. NOT_ASSESSED is distinct from WEAK;
9. mastery is multi-dimensional rather than binary;
10. contextual application and transferable foundational mastery remain distinct;
11. successful compensating strategies can support exam performance without falsely upgrading underlying mastery;
12. misconception evidence does not automatically equal confirmed misconception;
13. error signatures and numerical error patterns are first-class diagnostic signals;
14. multiple-choice evidence strength depends partly on distractor quality;
15. diagnostic interactions may use free response/step capture even though Test 602 is multiple choice;
16. repeated near-identical questions provide diminishing independent evidence;
17. recency matters, but old evidence remains auditable;
18. immediate post-remediation success is weaker than later transfer/retrieval evidence;
19. transfer distance is explicitly represented;
20. readiness and mastery are separate constructs;
21. learner intent can change and must not corrupt mastery state;
22. skipped remediation is not negative mastery evidence;
23. evidence propagation through prerequisites is cautious and weighted, not binary;
24. state conflict/uncertainty is preserved rather than forced into a confident label;
25. learner state can be explained from its underlying evidence;
26. raw attempts/evidence are retained separately from derived summaries;
27. evidence is version-aware and can later be invalidated if content is flawed;
28. the initial Phase 1 evidence engine should be deterministic and explainable;
29. synthetic learner personas will be used for regression testing;
30. theory evidence must not be represented as proof of practical competence;
31. learners may enter Learning Mode with no prior assessment evidence;
32. lesson completion/progression is stored separately from assertion mastery;
33. independent checks within lessons can create the learner's first mastery evidence.

---

# 81. Decision recommendation

**APPROVE WP1.3 as the conceptual Learner Evidence & Mastery Architecture for Phase 1.**

The central decision is:

> **The platform will maintain an auditable evidence model in which learner interactions contribute weighted, context-aware, strategy-aware evidence to persistent assertion/capability states. Mastery, assessment readiness, transfer, strategy success and diagnostic uncertainty remain separate concepts.**

This prevents the system from becoming a conventional topic-score engine disguised as adaptive learning.

---

# 82. Next work package

On approval of WP1.3, proceed to:

> **WP1.4 — Diagnostic & Remediation Engine**

WP1.4 will define:

- how competing root-cause hypotheses are generated;
- how prerequisite graphs are traversed;
- how diagnostic probes are selected;
- how the engine decides when evidence is sufficient;
- how uncertainty is handled;
- how remediation is chosen;
- when remediation is offered versus deferred;
- how pass-focused and deep-learning paths differ;
- how foundational retest and Electrical transfer retest work;
- how the next-best activity is selected.

WP1.4 must operate on the evidence architecture defined here rather than inventing diagnoses directly from raw question correctness.

---

**End of WP1.3**
