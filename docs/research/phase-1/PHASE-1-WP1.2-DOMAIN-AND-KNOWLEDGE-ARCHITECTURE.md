# Phase 1 — WP1.2: Domain & Knowledge Architecture

**Status:** Approved with post-approval clarification v0.2  
**Date:** 14 August 2026  
**Phase:** Phase 1 — Architecture & End-to-End Proving Slice  
**Depends on:** Approved WP1.1  
**Initial proving domain:** Foundational Maths + Foundational Physics + Unit 202 Electrical Science  
**Purpose:** Define the durable knowledge model that will represent assertions, domains, prerequisites, misconceptions, provenance, curriculum mappings, lifecycle and reuse before the Phase 1 corpus is populated.

---

# 1. Purpose

WP1.2 defines **what the platform means by knowledge**.

It does not choose the final database product, ORM, API framework or cloud provider.

It defines the conceptual architecture that later technical implementation must preserve.

The knowledge architecture must support the Phase 1 proving slice while remaining suitable for later expansion across:

- complete Electrical qualifications;
- Foundational Maths;
- Foundational Physics;
- Engineering;
- HVAC/Refrigeration;
- Plumbing/Heating;
- Automotive;
- later non-technical vocational domains;
- multiple awarding bodies;
- multiple jurisdictions.

The principal design rule is:

> **Represent knowledge once at the most reusable sensible level, then map it into qualifications, curricula, assessments and vocational contexts.**

The system must avoid creating duplicated copies of the same underlying fact merely because it appears in several qualifications.

---

# 2. What is a knowledge assertion?

A **knowledge assertion** is the smallest governed proposition that the platform needs to:

- teach;
- test;
- relate to prerequisites;
- map to curriculum requirements;
- support with provenance;
- attach misconceptions to;
- collect learner evidence against;
- version independently when necessary.

An assertion is not:

- an entire lesson;
- a curriculum heading;
- a paragraph copied from a book;
- a question;
- an explanation;
- a learning objective;
- a score;
- a topic tag.

Example:

> **In an ideal series DC circuit, the same current flows through each series component.**

This is a plausible assertion.

By contrast:

> **Understand series circuits**

is too broad.

And:

> **The current is the same**

is too context-poor.

The assertion must be independently meaningful enough to survive reuse outside one question or one curriculum document.

---

# 3. Assertion granularity rule

Granularity is one of the most important architectural decisions.

Assertions should be:

> **as atomic as necessary for diagnosis and reuse, but not so microscopic that the graph becomes meaningless administrative noise.**

## Too broad

> Ohm's law describes voltage, current and resistance.

This hides several distinct capabilities:

- knowing what voltage is;
- knowing what current is;
- knowing what resistance is;
- knowing the relationship V = IR;
- recognising direct proportionality of current to voltage at fixed resistance;
- recognising inverse proportionality of current to resistance at fixed voltage;
- selecting the relationship in a problem;
- rearranging it;
- applying units correctly.

## Too narrow

Avoid splitting into artificial fragments such as:

- the symbol V contains one letter;
- the symbol I is written in uppercase;
- resistance is represented by R;
- the unit symbol Ω uses a Greek character;

unless one of those is genuinely something the curriculum requires or the learner can meaningfully fail.

## Practical test

Create a separate assertion when at least one of the following is true:

1. a learner could know one proposition without knowing the other;
2. the propositions have different prerequisites;
3. the propositions have different provenance;
4. the propositions could change independently;
5. they support different misconceptions;
6. they map differently to curriculum requirements;
7. they need different evidence;
8. one is reusable outside the other's context.

If none apply, splitting may be unnecessary.

---

# 4. Assertion identity

Every assertion requires a stable machine identity.

Example conceptual identifier:

```text
FM-ALG-TRANSPOSE-001
FP-POWER-CONCEPT-001
EL-DC-SERIES-CURRENT-001
```

The exact production identifier format remains an implementation decision.

The important rules are:

- identity must not depend on display wording;
- editing wording must not create a new identity if the underlying proposition is unchanged;
- materially changing the proposition must create a new version or successor;
- IDs must not embed a qualification number such as 2365 unless the assertion is genuinely qualification-specific.

The canonical identity should belong to the **knowledge proposition**, not to the curriculum that happens to use it.

---

# 5. Assertion canonical wording

Each assertion should have one governed **canonical proposition** written in clear, independent language.

Example:

> In an ideal parallel DC circuit, the potential difference across each branch is equal to the supply potential difference.

The canonical wording exists for governance and machine/human interpretation.

It is **not necessarily the learner-facing explanation**.

Separate learner-facing representations may later exist for:

- concise explanation;
- detailed explanation;
- worked example;
- diagram;
- exam-focused wording;
- beginner wording;
- advanced wording.

This prevents changing the underlying knowledge object merely because product copy changes.

---

# 6. Assertion type

Assertions should carry a proposition/capability type.

The initial type set should remain deliberately small.

## 6.1 Concept

A statement defining or describing a concept.

Example:

> Electrical power is the rate at which electrical energy is transferred or converted.

## 6.2 Relationship

A relationship between quantities or concepts.

Example:

> At constant resistance, current increases as applied voltage increases.

## 6.3 Rule

A domain rule that can be applied.

Example:

> Total resistance in a series circuit is the sum of the individual series resistances.

## 6.4 Procedure

A sequence or method.

Example:

> To find total resistance for unequal resistors in parallel, sum the reciprocals of the branch resistances and take the reciprocal of the result.

## 6.5 Calculation capability

A capability requiring application of concepts and mathematical operations.

Example:

> Calculate current when voltage and resistance are known.

## 6.6 Recognition/classification

Identifying a valid category, symbol, unit, instrument or property.

Example:

> The SI derived unit of electrical resistance is the ohm.

## 6.7 Interpretation

Interpreting a result, representation or physical meaning.

Example:

> A calculated parallel total resistance greater than the smallest branch resistance indicates an error for an ideal passive resistor network.

The type system may evolve later, but Phase 1 should avoid dozens of assertion classes.

---

# 7. Domains

A **domain** is the canonical home of a knowledge assertion.

Phase 1 begins with:

```text
Foundational Maths
Foundational Physics
Electrical
```

Domains must not be confused with curricula.

For example:

> rearrange `V = IR` to make `I` the subject

is an Electrical-context application.

But:

> rearrange a multiplicative equation to make one factor the subject

belongs in Foundational Maths.

The Electrical application can depend on the Maths assertion.

This is central to root-cause diagnosis.

---

# 8. Domain ownership rule

An assertion belongs to the most general domain in which the proposition remains meaningfully true and useful.

Examples:

### Foundational Maths

> Multiplying or dividing both sides of an equation by the same non-zero value preserves equality.

### Foundational Physics

> Power is the rate of energy transfer or work done.

### Electrical

> Electrical power in a DC circuit may be calculated from voltage and current.

Avoid creating:

> Electrical formula transposition

if the underlying capability is simply general algebraic transposition.

The vocational domain should reference/reuse the horizontal prerequisite.

---

# 9. Contextualised capabilities

Some learner evidence exists only when foundational knowledge is applied in a vocational context.

Therefore the architecture must distinguish:

- **canonical foundational assertion**;
- **contextualised application/capability**.

Example:

```text
FM:
Can rearrange x = yz to make z the subject
        ↓ prerequisite of
EL:
Can rearrange V = IR to make R the subject
```

This allows the learner model later to represent:

- strong general algebra + weak Electrical application;
- weak general algebra + successful Electrical formula-triangle strategy;
- strong Electrical memorisation but uncertain transferable algebra.

The contextual application must not overwrite the foundational mastery state.

---

# 10. Knowledge relationships

Assertions form a graph rather than a flat list.

**Graph** here means knowledge objects connected by typed relationships.

The initial relationship set should be explicit and deliberately constrained.

---

## 10.1 PREREQUISITE_OF

Assertion A is materially required to learn/apply Assertion B.

Example:

```text
Understand reciprocal of a non-zero number
    PREREQUISITE_OF
Calculate total resistance of unequal parallel resistors
```

Prerequisite does not mean "usually taught before".

It means the later capability substantially relies on the earlier one.

---

## 10.2 SUPPORTS

A helps understanding or performance but is not strictly required.

Example:

> Understanding power as a general physical concept SUPPORTS understanding electrical power.

---

## 10.3 APPLIES_IN

A general assertion is applied in a more specific context.

Example:

> General algebraic transposition APPLIES_IN rearranging Ohm's-law relationships.

---

## 10.4 DERIVED_FROM

A proposition can be logically/mathematically obtained from another set.

Example:

```text
P = VI
V = IR
    ↓
P = I²R
```

The derived relationship must still have its own assertion if it is independently taught/tested.

---

## 10.5 CONTRASTS_WITH

Useful when learners commonly confuse two propositions/concepts.

Example:

> power CONTRASTS_WITH energy.

---

## 10.6 EQUIVALENT_TO

Two propositions express the same underlying knowledge in equivalent form.

Use sparingly.

Example:

> 1 kW = 1000 W

may be represented canonically rather than duplicating equivalent statements.

---

## 10.7 PART_OF

Use for conceptual decomposition when useful, but do not turn every curriculum hierarchy into a knowledge relationship.

Example:

> branch-current calculation PART_OF a larger multi-step parallel-circuit calculation capability.

---

## 10.8 CORROBORATES / SUPPORTING SOURCE RELATIONSHIPS

These belong to provenance, not learner knowledge.

Do not mix source relationships with knowledge relationships.

---

# 11. Prerequisite strength

Not every prerequisite is equally strong.

The model should allow at least:

- **required** — normally impossible/unreasonable to perform without it;
- **strong** — substantial dependency;
- **supporting** — useful but not essential.

Example:

For unequal parallel resistance:

```text
reciprocal arithmetic       REQUIRED
addition of fractions       STRONG/REQUIRED depending representation
Ohm concept                 SUPPORTING for calculation procedure
parallel circuit structure  REQUIRED
```

Phase 1 must test whether this added strength information is useful enough to justify retaining it.

---

# 12. Prerequisite direction must be causal, not curricular

Do not infer prerequisite links merely from teaching sequence.

City & Guilds may teach Topic A before Topic B because that is convenient.

The graph should ask:

> **Would weakness in A plausibly cause failure in B?**

If yes, a prerequisite/support relationship may be justified.

This is important because the root-cause engine will later traverse these relationships.

A poor graph will produce poor diagnoses even if the mastery algorithm is sophisticated.

---

# 13. Misconception architecture

A **misconception** is a structured representation of a plausible incorrect belief or reasoning pattern.

Misconceptions should be first-class objects, not merely free-text notes on questions.

Example:

```text
M-EL-PARALLEL-001

Belief:
Total resistance in a parallel network is found by adding branch
resistances.

Conflicts with:
EL-PARALLEL-RT-001

Possible evidence:
- choosing sum-of-resistances distractor;
- explaining that "all resistors add together";
- repeatedly producing totals larger than smallest branch resistance.

Possible competing cause:
learner may know the circuit rule but make a reciprocal arithmetic error.
```

---

# 14. Misconception versus error

Not every wrong answer is a misconception.

The architecture must distinguish:

## Knowledge misconception

A stable incorrect belief.

## Procedural error

The learner knows the concept but follows the wrong process.

## Arithmetic slip

Execution error without evidence of conceptual weakness.

## Interpretation error

Misreads what the problem requests.

## Unit/prefix error

Understands the relationship but mishandles units.

## Strategy limitation

Can solve one form through a memorised/diagrammatic strategy but lacks transferable underlying capability.

This distinction is fundamental to the product thesis.

Questions provide **evidence**, not automatic diagnoses.

---

# 15. Misconception relationships

A misconception should be able to:

- conflict with one or more assertions;
- be elicited by multiple questions;
- have multiple observable indicators;
- have alternative explanations;
- have remediation mappings;
- have severity/importance metadata if useful.

One misconception may span domains.

Example:

> "A larger number always means a larger physical quantity"

could manifest in Maths/unit handling and Electrical contexts.

However, Phase 1 should not attempt a universal misconception taxonomy.

---

# 16. Learner evidence does not live on the assertion itself

The knowledge graph describes governed knowledge.

Learner state is separate.

Do not store:

```text
assertion.mastery = 0.72
```

on the knowledge assertion.

Instead:

```text
KNOWLEDGE ASSERTION
        ↓
LEARNER EVIDENCE
        ↓
LEARNER-ASSERTION STATE
```

This separation allows one canonical assertion to serve millions of learners.

WP1.3 will define learner evidence and mastery architecture in detail.

---

# 17. Curriculum mapping

Curriculum objects must be separate from knowledge assertions.

The initial City & Guilds hierarchy should support at least:

```text
Qualification
  ↓
Unit
  ↓
Learning Outcome
  ↓
Assessment Criterion
```

For the initial case:

```text
2365-02
  ↓
Unit 202 — Principles of Electrical Science
  ↓
LO4
  ↓
AC4.5
```

Then:

```text
one curriculum criterion
        ↕ many-to-many
many knowledge assertions
```

A curriculum criterion may require many assertions.

One assertion may satisfy/support multiple curriculum criteria, qualifications or awarding bodies.

---

# 18. Curriculum mapping relationship types

Mapping should distinguish at least:

## REQUIRED_FOR

The assertion is necessary to satisfy the curriculum requirement.

## SUPPORTS

Helpful but not directly mandated.

## EXEMPLIFIES

An application/example of a broader curriculum requirement.

## ASSESSED_UNDER

The assertion/capability is demonstrably assessed within that criterion.

These relationships must not be inferred solely from a question bank.

---

# 19. Curriculum versioning

Curriculum mappings are version-sensitive.

An assertion may remain unchanged while a qualification:

- changes unit number;
- changes wording;
- changes assessment weighting;
- adds/removes criteria;
- is replaced.

Therefore:

> **Curriculum version changes must not force unnecessary duplication of stable knowledge assertions.**

Instead, update the mappings.

This is one of the main benefits of separating knowledge from qualification structure.

---

# 20. Source architecture

A **source** is an identifiable publication, document, statute, standard, handbook, official web resource or other evidence base.

Source records should include, where applicable:

- title;
- publisher/authority;
- source family;
- source type;
- jurisdiction;
- rights classification;
- canonical reference;
- access location;
- metadata about whether reproduction is permitted.

Do not store a source as merely:

> "City & Guilds"

That is not enough provenance.

---

# 21. Source versions

Source and source-version are separate objects.

Example:

```text
SOURCE FAMILY:
BS 7671

SOURCE VERSION:
BS 7671:2018+A2:2022
```

Another example:

```text
SOURCE:
City & Guilds 2365-02 Qualification Handbook

VERSION:
v1.12 — April 2026
```

A source version may carry:

- edition;
- revision;
- amendment;
- corrigendum;
- publication date;
- effective date;
- withdrawal/supersession date;
- checksum where appropriate;
- status: current / superseded / withdrawn.

This is required for future update impact analysis.

---

# 22. Source locator

Each provenance link should point as precisely as the source allows.

Possible locator fields include:

- part;
- chapter;
- section;
- subsection;
- paragraph;
- regulation;
- clause;
- assessment criterion;
- appendix;
- table;
- figure;
- page/page range;
- web heading/anchor.

The architecture should represent locators structurally where possible rather than storing only a free-text citation.

Example:

```text
source_version: City & Guilds 2365-02 Handbook v1.12
unit: 202
learning_outcome: 4
assessment_criterion: 4.5
page: [relevant page]
```

Semantic locator is primary; page is supplementary.

---

# 23. Assertion-to-source provenance is many-to-many

An assertion may have multiple sources.

A source location may support multiple assertions.

Example:

```text
Assertion:
"In an ideal series circuit the current is the same through each component."

Source A:
City & Guilds curriculum requirement

Source B:
authoritative Electrical reference

Source C:
open educational/physics reference

```

Each provenance link should carry a **role**.

---

# 24. Provenance roles

Initial provenance roles should include:

## AUTHORITATIVE_REQUIREMENT

A source establishes a normative/professional requirement.

## CURRICULUM_REQUIRES

An awarding-body curriculum explicitly requires the knowledge/capability.

## LEGAL_BASIS

Legislation establishes the legal rule.

## SUPPORTS

A reputable source supports the technical proposition.

## INTERPRETS

A source provides an interpretation/explanation of another authority.

## DEFINES

A source supplies an authoritative/accepted definition.

## EXEMPLIFIES

A source contains an example/application but is not the authority for the underlying proposition.

This prevents all citations from being treated as equivalent.

---

# 25. Rights classification

Every source version should carry a rights/access classification.

Initial values:

- **OPEN**
- **OFFICIAL_OGL**
- **PUBLIC_RESTRICTED**
- **PROPRIETARY_REFERENCE**
- **LICENSED**
- **ORIGINAL**
- **UNKNOWN**

Unknown behaves as:

> **not permitted for learner-facing reproduction**

until resolved.

Rights classification belongs to source/version metadata, not to the truth of the assertion.

---

# 26. Production knowledge boundary

The production knowledge asset is:

- independently written assertion;
- provenance links;
- relationship graph;
- curriculum mappings;
- misconception data;
- validation/audit metadata.

It is **not**:

- proprietary source text;
- scans;
- PDFs;
- copied tables;
- copied diagrams;
- large extracted source chunks;
- proprietary embeddings.

This implements the Phase 0 IP decision.

---

# 27. Assertion evidence quality / confidence

Knowledge governance needs a status for how well an assertion has been verified.

Do not confuse this with learner mastery.

Initial assertion verification state:

- **candidate**
- **source-linked**
- **verified**
- **approved**
- **superseded**
- **withdrawn**

Optional verification confidence may later be added if genuinely useful, but Phase 1 should prefer explicit workflow states over invented numeric certainty.

---

# 28. Assertion lifecycle

Suggested lifecycle:

```text
CANDIDATE
    ↓
SOURCE-LINKED
    ↓
VERIFIED
    ↓
APPROVED
    ↓
PUBLISHED
```

Later:

```text
APPROVED/PUBLISHED
    ↓
SUPERSEDED
or
WITHDRAWN
```

The exact distinction between approved and published may depend on implementation.

Conceptually:

- **approved** means governance accepts the knowledge object;
- **published** means it is allowed to influence the live learner product.

---

# 29. No silent destructive editing

Once an assertion has learner evidence or published content attached, materially changing its meaning must not silently overwrite history.

If the proposition changes materially:

- create a successor/new version;
- retain prior identity/history;
- link the supersession;
- determine impact on questions, learner state and curriculum mappings.

Minor wording clarification that does not alter meaning can remain within the same assertion version subject to audit history.

---

# 30. Assertion supersession

A supersession relationship should allow:

```text
OLD ASSERTION
    SUPERSEDED_BY
NEW ASSERTION
```

Potential cases:

- technical standard changes;
- curriculum changes reveal old assertion was too broad;
- scientific/technical understanding changes;
- earlier assertion was wrong;
- one assertion is split into several more precise assertions.

The update system must later be able to ask:

> **Which learner content and mappings depend on the superseded assertion?**

---

# 31. Audit metadata

Governed objects should retain enough metadata to answer:

- who created it;
- whether AI assisted;
- who/what verified it;
- when it was verified;
- which source version was checked;
- who approved it;
- when it changed;
- why it changed.

Do not overcomplicate Phase 1 with enterprise workflow software.

The architecture merely must not make auditability impossible.

---

# 32. AI-generated candidate content

AI may propose:

- candidate assertions;
- candidate relationships;
- candidate misconceptions;
- candidate curriculum mappings;
- candidate provenance locators;
- candidate questions.

But AI-generated data enters as:

> **candidate, not truth.**

An AI suggestion must not become APPROVED merely because it parses successfully.

This governance boundary should be enforced by the content pipeline later.

---

# 33. Knowledge assertion versus capability

This distinction needs to be explicit.

Some objects describe **what is true**.

Example:

> In an ideal series circuit, current is the same through all series components.

Some describe **what a learner can do**.

Example:

> Calculate an unknown series voltage drop from circuit current and component resistance.

Both are relevant to learner modelling.

Phase 1 should therefore support:

- **declarative assertions** — know that;
- **capability assertions** — can do/apply.

They may have different evidence patterns.

This is preferable to forcing every item into a pure factual-sentence model.

---

# 34. Proposed knowledge-object family

The minimum conceptual object family for Phase 1 is:

```text
DOMAIN
SOURCE
SOURCE_VERSION
SOURCE_LOCATOR

CURRICULUM
CURRICULUM_VERSION
CURRICULUM_NODE

KNOWLEDGE_ASSERTION
ASSERTION_VERSION
ASSERTION_RELATIONSHIP

MISCONCEPTION

PROVENANCE_LINK
CURRICULUM_MAPPING
```

Learner-state objects are deliberately excluded from WP1.2 and belong to WP1.3.

Question/content objects belong primarily to WP1.5.

---

# 35. Why separate assertion and assertion version?

The stable assertion represents the enduring conceptual identity.

The version represents the proposition at a point in time.

Conceptually:

```text
ASSERTION
EL-DC-SERIES-CURRENT-001

VERSION 1
"In an ideal series DC circuit, the same current flows through each component."

VERSION 2
[future materially clarified proposition if required]
```

Whether Phase 1 implementation uses separate physical database tables remains a later technical choice.

The conceptual distinction must exist.

---

# 36. Topic/taxonomy structure

The platform will need topics for:

- navigation;
- curriculum browsing;
- dashboards;
- content authoring;
- reporting.

But topic hierarchy must not substitute for prerequisite relationships.

Example taxonomy:

```text
Electrical
  DC Circuits
    Series Circuits
    Parallel Circuits
```

This helps organisation.

It does **not** tell the diagnostic engine why a learner failed.

Therefore:

> **taxonomy is navigational; relationships are semantic/causal.**

---

# 37. Tags

Use tags sparingly.

Tags are appropriate for flexible descriptors such as:

- numerical;
- conceptual;
- safety-critical;
- formula-based;
- unit-conversion;
- visual;
- high-frequency assessment.

Do not encode important logic only in arbitrary tags.

If the system needs to reason about something, prefer a structured field or relationship.

---

# 38. Importance and risk

Not all knowledge is equally important.

The architecture should allow later metadata for:

- curriculum importance;
- assessment frequency/weight;
- safety criticality;
- downstream prerequisite centrality;
- professional criticality.

For Phase 1, use only what is necessary.

Do not build a single magical "importance score" yet.

Different importance dimensions mean different things.

---

# 39. Safety-critical knowledge

Later vocational domains will contain safety-critical assertions.

The architecture must allow these to be identified so that the learner engine can later apply stricter rules if justified.

Examples might include:

- isolation procedures;
- protective measures;
- safe testing requirements.

The Phase 1 proving slice is mostly theory, so safety-critical behaviour need not be fully implemented yet.

The data model must not prevent it.

---

# 40. Knowledge graph acyclicity

Prerequisite relationships should normally form a directed graph without circular required dependencies.

For example, this is invalid:

```text
A requires B
B requires A
```

unless the relationship types mean something other than prerequisite.

The implementation should later validate against impossible **required-prerequisite cycles**.

Other relationship types may legitimately be reciprocal.

---

# 41. Cross-domain reuse example

Example graph:

```text
FM-ALG-EQUALITY
    ↓ REQUIRED
FM-ALG-INVERSE-OPERATIONS
    ↓ REQUIRED
FM-ALG-TRANSPOSE-MULT
    ↓
    ├───────────────┐
    ↓               ↓
EL-OHM-REARRANGE   FP-POWER-REARRANGE
    ↓               ↓
EL-OHM-CALC        FP-POWER-CALC
    ↓
EL-POWER-CALC
```

This is the behaviour we need for root-cause diagnosis.

If the learner struggles across `EL-OHM-REARRANGE` and `FP-POWER-REARRANGE`,
but also fails a pure Maths transposition probe, the later diagnostic
engine has evidence for a shared root cause.

---

# 42. Strategy representation

WP1.1 established that valid strategy and underlying mastery must be distinguishable.

The knowledge architecture should therefore support **strategy objects or strategy mappings** where useful.

Examples:

- algebraic transposition;
- formula triangle;
- memorised rearranged formula;
- equivalent-resistor shortcut for equal parallel resistors.

A strategy is not necessarily a knowledge assertion.

It is a method by which a capability can be performed.

Phase 1 does not need a complex strategy ontology.

But the model must support:

```text
CAPABILITY
can be achieved using
STRATEGY A
STRATEGY B
```

and learner evidence must later be able to show that success with one strategy does not automatically prove mastery of every underlying strategy.

---

# 42.1 Lessons are not assertions

The learner-facing teaching structure must not be derived by treating
each atomic assertion as its own lesson.

Assertions are optimised for:

- governance;
- diagnosis;
- evidence;
- reuse.

Lessons are optimised for coherent instruction.

A **lesson/learning unit** therefore sits above multiple assertions and
capabilities.

Example:

```text
LESSON
Ohm's Law — Voltage, Current and Resistance

composed from:
- voltage concept
- current concept
- resistance concept
- V-I-R relationship
- proportionality assertions
- calculation capabilities
```

The exact lesson/content model is defined in WP1.5.

---

# 42.2 Lessons require multi-dimensional classification

A lesson must be able to map simultaneously to:

- qualification;
- unit/module;
- learning outcome/assessment criterion where relevant;
- canonical domain;
- topic/subtopic;
- foundational knowledge family;
- applied vocational contexts.

This allows the same governed learning asset to be surfaced as:

> Unit 202 lesson

and:

> Foundational Maths/Physics lesson

where appropriate.

Do not force one canonical lesson tree to serve every navigation need.

---

# 42.3 Curriculum sequence versus knowledge dependency

WP1.2 distinguishes:

- **knowledge prerequisite graph** — what genuinely depends on what;
- **learning/curriculum sequence** — the approved order in which lessons
  may be taught.

The two can overlap but are not identical.

The diagnostic engine uses the former.

Learning Mode can use the latter.

---

# 43. Worked examples are not assertions

A worked example is content.

Example:

> A 230 V supply is connected across a 46 Ω resistance. Calculate current.

The knowledge assertions are the concepts/relationships required to solve it.

This separation matters because:

- one assertion supports many examples;
- one example may require many assertions;
- examples can be replaced without changing the knowledge graph.

---

# 44. Questions are not assertions

Similarly, a question maps to:

- target assertions/capabilities;
- prerequisite assertions;
- possible misconception evidence;
- difficulty/context metadata.

A question's existence must not define the knowledge graph.

Otherwise the platform becomes a question bank with tags rather than a knowledge system.

---

# 45. Explanations are not assertions

Learner explanations may be:

- brief;
- detailed;
- pass-focused;
- conceptual;
- worked;
- visual.

All can explain the same governed assertion.

This is essential to the layered feedback principle.

---

# 46. Formula representation

Formulae should not exist only as display text.

Where a relationship is computationally important, Phase 1 should support a structured mathematical representation sufficient for:

- deterministic calculation;
- variable identity;
- unit expectations;
- rearrangement;
- question generation;
- checking.

Example conceptually:

```text
relationship: V = I * R
variables:
  V -> voltage
  I -> current
  R -> resistance
```

The exact expression format belongs to implementation design.

Do not build a full symbolic algebra system in WP1.2.

---

# 47. Quantity and unit model

Because Unit 202 heavily depends on quantity/unit distinction, Phase 1 should treat quantities and units as structured reusable concepts.

Examples:

```text
QUANTITY: electric_current
canonical symbol: I

UNIT: ampere
unit symbol: A
```

Prefix conversion should not be encoded as thousands of unrelated facts such as:

- 1 mA = 0.001 A;
- 2 mA = 0.002 A;
- 3 mA = 0.003 A.

Instead, represent reusable prefix/scale knowledge and generate instances deterministically.

This also supports Engineering later.

---

# 48. Dimensional/semantic checking

The architecture should allow the system eventually to know that:

- current is measured in amperes;
- voltage in volts;
- resistance in ohms;
- power in watts.

This permits diagnostic signals such as:

> learner produced the correct magnitude but selected the wrong unit.

Phase 1 need not implement a full dimensional-analysis engine, but the model should not make it impossible.

---

# 49. Numerical constants and reference values

Constants/reference values should be separate governed data where they are reused or source-sensitive.

Example:

- standard gravitational acceleration for a learning context;
- material resistivity values used in calculations.

Do not silently embed such values in question text or code if the system needs to reason about their provenance or version.

---

# 50. Assertion dependency depth

The graph may have multiple prerequisite levels.

Example:

```text
Calculate parallel total resistance
    ↓
Understand reciprocal
    ↓
Understand division
    ↓
Understand non-zero denominator
```

Do not recursively decompose to primary-school mathematics unless the diagnostic value justifies it.

Phase 1 should define a **support boundary**:

> decompose only far enough that the platform could plausibly remediate the weakness for the target learner population.

The product is not initially a universal mathematics tutor from first principles.

---

# 51. Foundational boundary rule

For the proving slice:

- map Maths prerequisites deeply enough to diagnose likely Level 2 learner difficulties;
- map Physics deeply enough to distinguish concept from Electrical formula memorisation;
- stop where remediation would reasonably be referred to a lower-level foundational learning module rather than decomposed indefinitely.

WP1.2 recommends an initial depth of approximately **2–4 prerequisite layers** for key diagnostic paths, adjusted where needed.

This is a design heuristic, not a hard technical limit.

---

# 52. Assertion reuse across qualifications

An assertion should be reusable without cloning.

Future example:

```text
FM-ALG-TRANSPOSE-001
    mapped to:
    - C&G 2365
    - Engineering qualification A
    - HVAC qualification B
    - Functional Skills Maths content
```

The curriculum mappings differ.

The knowledge assertion remains canonical.

This is where the platform begins to obtain compounding content economics.

---

# 53. Jurisdiction and standards sensitivity

Some assertions are universal.

Example:

> Power is rate of energy transfer.

Some are jurisdiction-specific.

Example:

> a regulatory requirement in UK wiring rules.

Some are source-version specific.

The architecture therefore needs optional applicability metadata such as:

- jurisdiction;
- effective period;
- qualification family;
- standard version.

Do not attach UK jurisdiction to universal Maths/Physics assertions unnecessarily.

---

# 54. Assertions that depend on assumptions

Technical statements may only be true under defined assumptions.

Example:

> Current is the same throughout a series circuit

is normally taught under an ideal/simple circuit model.

Where assumptions materially affect correctness, they should be represented explicitly in the assertion wording or structured conditions.

Avoid teaching overgeneralised statements as universal truths merely because they are adequate for an introductory exercise.

---

# 55. Assertion quality checklist

Before an assertion can become APPROVED, it should pass:

### Meaning

- expresses one coherent proposition/capability;
- understandable without hidden context;
- correct for stated assumptions.

### Granularity

- not excessively broad;
- not artificially microscopic.

### Ownership

- belongs to the most reusable appropriate domain.

### Provenance

- source-linked;
- version identified;
- locator sufficiently precise;
- rights known or treated conservatively.

### Relationships

- prerequisites justified;
- no invented causal links merely from curriculum order.

### Curriculum

- mapping supported where claimed.

### Misconceptions

- candidate misconceptions distinguished from ordinary errors.

### Reuse

- not unnecessarily qualification-specific.

### Lifecycle

- status and audit data present.

---

# 56. Phase 1 knowledge-graph population process

After WP1.2 approval, population should proceed iteratively:

```text
1. Select small concept cluster
2. Draft candidate assertions
3. Assign canonical domain
4. Attach sources/provenance
5. Decompose prerequisites
6. Add relationships
7. Identify candidate misconceptions
8. Map curriculum
9. Review granularity
10. Approve cluster
11. Test with question/evidence design
12. Revise architecture if required
13. Repeat
```

Do **not** generate all 150 assertions first and validate the architecture afterwards.

The schema should be tested against real content continuously.

---

# 57. First assertion clusters recommended

The initial population order should be:

## Cluster 1 — Quantities, units and prefixes

Because these support nearly every later calculation.

## Cluster 2 — Algebra/substitution/transposition strategies

Because these create shared Maths diagnostic roots.

## Cluster 3 — Current, voltage and resistance concepts + V-I-R relationship

This creates the first Electrical application network.

## Cluster 4 — Series circuits

Adds multi-step reasoning and voltage-drop/current rules.

## Cluster 5 — Parallel circuits

Adds reciprocal arithmetic and structural misconceptions.

## Cluster 6 — Electrical power

Creates alternative formula relationships and strategy testing.

## Cluster 7 — Resistivity/conductor voltage drop

Adds proportionality, scientific notation, unit-area conversion and more complex transposition.

## Cluster 8 — Work/energy/power transfer bridge

Tests whether learning transfers outside Electrical surface context.

This order is for architecture validation, not necessarily final learner teaching order.

---

# 58. Expected Phase 1 distribution

The final proving graph remains expected to contain approximately:

> **80–150 approved assertions/capabilities**

A plausible distribution might be:

- Foundational Maths: 25–40;
- Foundational Physics: 10–20;
- Electrical: 45–80.

These are deliberately non-binding.

Actual decomposition should be driven by diagnostic need.

A future review may legitimately conclude, for example, that 170 assertions are required or that 90 are sufficient.

---

# 59. What WP1.2 deliberately does not decide

WP1.2 does not yet define:

- learner mastery scoring;
- Bayesian Knowledge Tracing;
- IRT;
- confidence update algorithms;
- question selection algorithm;
- exact remediation rules;
- database vendor;
- authentication provider;
- API framework;
- UI;
- question authoring schema in full;
- content-generation workflow in full.

Those belong to later work packages.

**IRT — Item Response Theory** is a family of statistical models relating question difficulty and learner ability. It may become useful later, but it is not required to define the knowledge graph.

---

# 60. Technical implementation constraints derived from WP1.2

Whatever technical stack is eventually chosen must support:

1. stable assertion identity;
2. assertion versioning;
3. many-to-many provenance;
4. structured source versions/locators;
5. many-to-many curriculum mappings;
6. typed assertion relationships;
7. prerequisite traversal;
8. misconception objects;
9. cross-domain relationships;
10. reusable quantity/unit concepts;
11. strategy mappings;
12. audit history;
13. non-destructive supersession;
14. efficient retrieval of dependency neighbourhoods;
15. future impact analysis when a source changes.

A technical design that cannot do these cleanly should be rejected even if it makes simple CRUD screens easy.

**CRUD — Create, Read, Update, Delete** means the basic operations used to manage records in software. A good CRUD interface is useful, but it is not the same thing as a good knowledge architecture.

---

# 61. Phase 1 architecture test cases

Before approving an implementation schema, it should be capable of representing all of the following without awkward exceptions.

## Test case A — Shared Maths prerequisite

One formula-transposition assertion supports Ohm's law, electrical power and mechanical power applications.

## Test case B — Strategy without full mastery

A learner can use a formula triangle successfully while general transposition remains a separate capability.

## Test case C — Parallel circuit misconception

A misconception that total parallel resistance is obtained by simple addition conflicts with the correct rule and can be elicited by several questions.

## Test case D — Source update

A source version is superseded without destroying the assertion's historical provenance.

## Test case E — Curriculum update

A new qualification handbook changes criterion numbering while stable knowledge assertions remain reusable.

## Test case F — Multiple provenance roles

One assertion is curriculum-required by City & Guilds and technically supported by another authoritative reference.

## Test case G — Rights restriction

A proprietary reference can support provenance without its source text becoming learner-facing content.

## Test case H — Cross-vertical reuse

A Foundational Physics power assertion can later map into Engineering without cloning it.

## Test case I — Assertion split

A broad assertion is later split into two precise successor assertions while preserving history and dependent-content impact analysis.

## Test case J — Quantity/unit error

The system can distinguish the concept of current from the ampere unit and later capture evidence of a unit-selection error separately.

---

# 62. Acceptance criteria

WP1.2 is accepted when the Product Owner agrees that:

1. knowledge assertions are the canonical governed unit of reusable knowledge;
2. assertions may represent declarative knowledge or capabilities;
3. assertion identity is stable and independent of display wording/curriculum numbering;
4. assertions are versionable and non-destructively supersedable;
5. canonical knowledge is separate from learner-facing explanations;
6. Foundational Maths, Foundational Physics and Electrical are canonical domains, not curriculum folders;
7. knowledge belongs to the most reusable sensible domain;
8. contextual application can depend on but remain distinct from foundational mastery;
9. prerequisite relationships represent genuine dependency rather than teaching sequence;
10. relationship types are explicit and constrained;
11. misconceptions are first-class structured objects;
12. misconception, procedural error, arithmetic slip, unit error, interpretation error and strategy limitation are not treated as equivalent;
13. curriculum structure is separate from knowledge assertions;
14. curriculum mappings are many-to-many and version-sensitive;
15. source, source version and source locator are separate concepts;
16. provenance is many-to-many and carries a role;
17. rights classification is first-class metadata;
18. proprietary source material is not the production knowledge asset;
19. AI-generated knowledge begins as candidate data;
20. quantity/unit concepts should be reusable structured objects;
21. computational relationships should support structured formula representation;
22. strategies such as formula triangles can be represented without falsely equating them to underlying Maths mastery;
23. taxonomy/navigation does not substitute for causal/prerequisite relationships;
24. learner mastery/evidence remains outside the knowledge objects and is defined in WP1.3;
25. questions and explanations remain separate content objects;
26. the proving graph should be populated iteratively rather than generated wholesale;
27. the initial assertion population order in §57 is suitable for Phase 1;
28. the eventual technical architecture must satisfy the test cases in §61;
29. atomic assertions remain separate from coherent learner-facing lessons;
30. lessons can be mapped simultaneously through curriculum/unit and canonical domain/foundational views;
31. teaching sequence remains separate from prerequisite causality.

---

# 63. Decision recommendation

**APPROVE WP1.2 as the conceptual Domain & Knowledge Architecture for the Phase 1 proving slice.**

The key architectural decision is:

> **The platform's durable knowledge asset is a versioned graph of independently expressed assertions/capabilities, linked through explicit semantic and prerequisite relationships, supported by granular provenance, mapped separately to versioned curricula, and enriched with structured misconceptions — while learner evidence, questions, explanations and presentation remain separate layers.**

This architecture directly supports the product thesis:

> **diagnose why a learner is failing, rather than merely record which topic produced a wrong answer.**

---

# 64. Next work package

On approval of WP1.2, proceed to:

> **WP1.3 — Learner Evidence & Mastery Architecture**

WP1.3 will define:

- what learner evidence is;
- what one response can and cannot prove;
- positive versus negative evidence;
- evidence strength;
- uncertainty;
- recency;
- contextual versus transferable mastery;
- strategy-aware evidence;
- misconception evidence;
- how repeated evidence updates learner state;
- how the system avoids false certainty;
- what "mastered", "weak", "uncertain" and "not yet assessed" should actually mean.

No mastery algorithm should be implemented before that model is approved.

---

**End of WP1.2**
