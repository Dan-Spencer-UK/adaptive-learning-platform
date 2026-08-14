# Phase 1 — WP1.8: Content Production & Governance Pipeline

**Status:** Draft v0.2 for Product Owner review  
**Date:** 14 August 2026  
**Phase:** Phase 1 — Architecture & End-to-End Proving Slice  
**Depends on:** Approved WP1.1–WP1.7  
**Purpose:** Define the operational pipeline by which source material becomes governed knowledge assertions, curriculum mappings, lessons, question families, diagnostic content, remediation content and published learner-facing material while preserving provenance, rights, reviewability, versioning, quality and scalable production economics.

---

# 1. Purpose

WP1.8 answers:

> **How do we turn source material into safe, accurate, original, governed learning content at useful scale?**

The architecture already defines:

- assertions;
- provenance;
- learner evidence;
- diagnostic hypotheses;
- lessons;
- questions;
- remediation;
- UX.

WP1.8 defines the **production system** that creates and maintains those things.

The governing principle is:

> **AI may generate and verify content at scale, but generation, verification and publication remain separate governed stages.**

A fast generation pipeline that produces unverified or legally risky material is not a scalable content system.

---

# 2. Pipeline overview

The target pipeline is:

```text
SOURCE ACQUISITION
      ↓
RIGHTS / USE CLASSIFICATION
      ↓
SOURCE VERSIONING + LOCATORS
      ↓
CURRICULUM DECOMPOSITION
      ↓
CANDIDATE ASSERTION EXTRACTION
      ↓
NORMALISATION / DEDUPLICATION
      ↓
PREREQUISITE + RELATIONSHIP MODELLING
      ↓
MISCONCEPTION MODELLING
      ↓
ASSERTION VERIFICATION
      ↓
LESSON / LEARNING-UNIT AUTHORING
      ↓
QUESTION-FAMILY AUTHORING
      ↓
DETERMINISTIC VARIANT RULES
      ↓
REMEDIATION + RETEST + TRANSFER CONTENT
      ↓
TECHNICAL VALIDATION
      ↓
PEDAGOGICAL / SUBJECT REVIEW
      ↓
APPROVAL
      ↓
PUBLICATION
      ↓
MONITORING / UPDATE PROPAGATION
```

Not every source passes through every stage in exactly the same way.

The governance states must remain explicit.

---

# 3. Source intake

Every source used materially in the content pipeline should be registered.

Minimum source metadata:

- source identity;
- title;
- publisher/issuer;
- source type;
- jurisdiction;
- subject/domain;
- URL or controlled location where lawful;
- access date;
- current rights classification;
- notes.

Examples:

- official qualification handbook;
- legislation;
- HSE guidance;
- official public guidance;
- textbook;
- proprietary standard;
- licensed source;
- original internal material.

---

# 4. Source version

A source is not enough.

The system must record the exact version used.

Possible version dimensions:

- edition;
- publication date;
- revision;
- amendment;
- corrigendum;
- qualification-version number;
- effective date.

Example:

```text
Source:
City & Guilds 2365 Level 2 Qualification Handbook

Version:
v1.12 — April 2026
```

This matters because learner-facing content may remain valid only for a specific qualification or standard version.

---

# 5. Source locator

The pipeline should capture precise source location.

Preferred locator hierarchy:

1. semantic locator;
2. page number where useful;
3. section/subsection;
4. table/figure identifier where relevant.

Example:

```text
Unit 202
Learning Outcome 4
Assessment Criterion 4.5
Page 123
```

Semantic locator is more durable than page alone.

---

# 6. Rights classification

Every source must have a machine-readable rights status.

Initial classifications remain:

- **OPEN**
- **OFFICIAL_OGL**
- **PUBLIC_RESTRICTED**
- **PROPRIETARY_REFERENCE**
- **LICENSED**
- **ORIGINAL**

If rights are unknown:

> **UNKNOWN = NOT PERMITTED FOR LEARNER REPRODUCTION**

until reviewed.

---

# 7. Rights govern allowed pipeline actions

Rights classification must influence what the system is allowed to do.

Example:

## OPEN / OFFICIAL_OGL

May generally support broader reuse subject to licence terms.

## PROPRIETARY_REFERENCE

May support:

- human review;
- provenance;
- independently authored assertions;
- independent content development.

Must not automatically permit:

- learner-facing quotation;
- source chunk storage in production;
- proprietary RAG;
- reproduction of tables/figures;
- question paraphrase at scale.

## LICENSED

Use depends on actual licence terms.

The pipeline should record permitted uses rather than assuming "licensed" means unrestricted.

---

# 8. Development-reference boundary

Reference material may exist temporarily in a controlled content-development environment.

It must not automatically cross into:

- production repository;
- learner database;
- learner-facing retrieval system;
- production embeddings/vector store;
- public object storage.

The publication pipeline should output governed derived objects, not raw reference material.

---

# 9. Temporary proprietary-processing rule

Where the founder lawfully accesses proprietary source material for content development, AI-assisted processing may be used only within the project's approved risk posture.

Required safeguards:

- controlled temporary storage;
- access limited to content-development work;
- no public serving;
- no automatic production ingestion;
- outputs treated as candidates;
- independently worded published content;
- source-reference traceability;
- temporary copies deleted/segregated where appropriate.

A focused legal/IP review remains a gate before production-scale proprietary-source AI processing or commercial reliance where risk justifies it.

---

# 10. Source authority role

A source's relationship to an assertion must be explicit.

Possible provenance roles include:

- AUTHORITATIVE_REQUIREMENT;
- CURRICULUM_REQUIRES;
- LEGAL_BASIS;
- DEFINES;
- SUPPORTS;
- INTERPRETS;
- EXEMPLIFIES.

Do not treat all citations as equivalent.

---

# 11. Curriculum intake

Qualification/course structure should be captured separately from knowledge.

For a qualification:

```text
QUALIFICATION
  ↓
VERSION
  ↓
UNIT
  ↓
LEARNING OUTCOME
  ↓
ASSESSMENT CRITERION
```

Assessment metadata may include:

- assessment type;
- number of questions;
- duration;
- weighting;
- permitted aids;
- approximate pass boundary where supported.

---

# 12. Broad curriculum mapping first

For a new qualification/unit:

1. capture the full curriculum skeleton;
2. identify major topic families;
3. identify obvious cross-domain foundations;
4. identify assessment weighting;
5. choose the first deep slice.

Do not deep-author every assertion before validating the architecture.

This preserves the WP1.1 strategy.

---

# 13. Assertion candidate generation

Candidate assertions may be created by:

- founder/manual authoring;
- AI-assisted extraction;
- structured transformation of official curriculum;
- combination of sources.

Every generated assertion begins as:

> **CANDIDATE**

AI output does not bypass verification.

---

# 13.1 AI verification is expected to do most first-pass verification

The project does **not** assume that every assertion, question or lesson
will be manually checked line-by-line by a human forever.

That would undermine the bootstrap economics and could become the main
scaling bottleneck.

The intended model is:

```text
AI GENERATION
     ↓
INDEPENDENT AI VERIFICATION
     ↓
DETERMINISTIC / STRUCTURAL VALIDATION
     ↓
RISK-BASED HUMAN REVIEW / SAMPLING
     ↓
GOVERNED APPROVAL / PUBLICATION
```

AI verification is therefore a first-class part of the production
pipeline.

The important requirement is separation of roles.

The verifier should not merely be:

> the same generation prompt asking "is this correct?"

Verification should independently check the candidate against:

- the cited source/version;
- the cited source locator;
- existing approved assertions;
- curriculum mappings;
- terminology;
- duplication;
- contradiction;
- rights/use rules;
- expected granularity.

Where practical, generation and verification should use:

- different prompts;
- different context windows;
- independent passes;
- potentially different models/providers for selected high-risk or
  ambiguous material.

The goal is **independent evidence**, not ceremonial self-review.

---

# 13.2 Verification output must be evidence-bearing

An AI verifier should not return only:

```text
PASS
```

It should return structured verification evidence such as:

```text
source support:
PASS

source locator:
Unit 202 / LO4 / AC4.5

meaning preserved:
PASS

wording independence:
PASS

atomicity:
PASS

canonical domain:
Foundational Maths

duplicate candidate:
possible match FM-ALG-TRANSPOSE-004

curriculum mapping:
supported

confidence:
high

issues:
none
```

Where the verifier is uncertain, it must surface the uncertainty.

An unsupported assertion should not become approved merely because the
verifier assigns a high confidence score.

---

# 13.3 Generation and verification models are fallible

AI verification is still AI output.

Therefore:

> **AI verification is evidence, not absolute proof.**

Controls include:

- direct source grounding;
- source-locator checks;
- deterministic validators;
- duplicate/relationship checks;
- contradiction checks;
- risk-based human review;
- post-publication learner/content analytics;
- ability to withdraw/recompute affected content and evidence.

The architecture should expect occasional verification failures and make
them recoverable.

---

# 13.4 Human review should be risk-based, not universal forever

During early Phase 1, the founder should manually inspect a high
proportion of outputs because the pipeline itself is still being
validated.

As the pipeline demonstrates reliability, human review can move toward:

```text
HIGH-RISK / AMBIGUOUS
→ direct human review

STANDARD-RISK
→ AI verification + targeted human review

LOW-RISK / HIGHLY DETERMINISTIC
→ AI verification + automated validation + human sampling
```

Examples likely to justify direct human review include:

- safety-critical technical requirements;
- ambiguous source interpretation;
- legal/regulatory assertions;
- conflicting sources;
- high-impact diagnostic rules;
- content relying heavily on proprietary references.

Examples more suitable for automated verification plus sampling may
include:

- straightforward SI-unit assertions;
- mathematically deterministic formula relationships;
- routine generated numerical variants;
- obvious curriculum mappings after the mapping process is validated.

No reduction in human review should occur merely to increase throughput.

It should be earned through measured pipeline accuracy.

---

# 13.5 Human sampling must be measured

If low-risk content moves to sampling-based review, record:

- sample size;
- error rate;
- error severity;
- source/model/prompt batch;
- reviewer findings.

If the observed error rate rises beyond the accepted threshold:

- increase review proportion;
- investigate prompt/model/tooling;
- re-check affected batches.

Sampling therefore becomes a quality-control mechanism, not an excuse
to stop checking content.

---

# 13.6 Publication authority is governed, not necessarily manually clicked

The important publication rule is:

> **No single generation model call may create learner-visible approved
> content directly.**

Publication may eventually be automatically permitted for a narrowly
defined low-risk class **only if**:

- verification stages have passed;
- deterministic checks have passed;
- applicable rights rules have passed;
- the class has been explicitly approved for automated publication;
- audit evidence is retained;
- rollback/withdrawal remains possible.

Phase 1 should begin more conservatively.

This distinction allows the system to scale without making permanent
human line-by-line review an architectural requirement.

---

# 14. Candidate assertion format

A candidate assertion should include enough structure for review:

```text
candidate wording
proposed type
canonical domain
source/version
source locator
provenance role
curriculum mapping
potential prerequisites
potential misconceptions
notes
```

The candidate does not need all metadata to be correct initially.

It needs enough to be reviewable.

---

# 15. AI extraction prompt discipline

Bulk AI extraction should use constrained prompts/templates.

The model should be told to:

- produce atomic propositions/capabilities;
- preserve source meaning;
- avoid copying unnecessary source prose;
- distinguish direct source claims from inference;
- attach source locators;
- flag ambiguity;
- avoid inventing missing material;
- avoid curriculum assumptions not supported by the source.

Free-form "turn this book into a knowledge base" prompts are unacceptable.

---

# 16. Batch size

Use bounded source sections.

Why:

- easier verification;
- better locator accuracy;
- less source mixing;
- lower hallucination risk;
- easier rollback;
- measurable throughput.

Do not feed an entire large qualification corpus into one opaque generation task and accept the output wholesale.

---

# 17. Extraction evidence preservation

For each candidate batch, record:

- source version;
- source locator range;
- extraction prompt/template version;
- model/tool used where relevant;
- date;
- batch identifier;
- candidate count;
- reviewer outcome.

This allows later investigation if a generation method proves unreliable.

---

# 18. Candidate-normalisation stage

Before approval, candidates should be normalised.

Tasks include:

- remove duplicates;
- merge equivalent assertions;
- split assertions that are too broad;
- move assertion to correct canonical domain;
- standardise terminology;
- distinguish declarative versus capability assertion;
- identify contextual application versus foundational skill.

This is where the graph becomes coherent rather than merely extracted.

---

# 19. Duplicate detection

Duplicate candidates should be detected through:

- stable semantic comparison;
- existing assertion search;
- similarity tooling where useful;
- human review.

Do not create:

```text
Electrical formula rearrangement
Engineering formula rearrangement
HVAC formula rearrangement
```

when the true canonical capability is:

```text
Foundational Maths:
formula transposition
```

---

# 20. Assertion split test

Split an assertion when one part can vary independently in:

- learner mastery;
- prerequisite;
- provenance;
- curriculum mapping;
- misconception;
- version;
- reuse.

Do not split merely because a sentence contains two nouns.

Granularity is diagnostic/pedagogical, not grammatical.

---

# 21. Assertion merge test

Merge candidates when separate objects would create artificial distinctions with no useful difference in:

- evidence;
- prerequisite;
- remediation;
- provenance;
- versioning.

The objective is useful atomicity, not maximum assertion count.

---

# 22. Cross-domain canonicalisation

Every candidate should be reviewed for the most general useful domain.

Example:

```text
Rearrange x = yz
```

belongs to:

> Foundational Maths

The Electrical curriculum maps to it.

This is essential for future vertical reuse.

---

# 23. Relationship modelling

After assertions are stabilised, create explicit relationships.

Examples:

- PREREQUISITE_OF;
- SUPPORTS;
- APPLIES_IN;
- DERIVED_FROM;
- CONTRASTS_WITH;
- EQUIVALENT_TO;
- PART_OF.

Relationship creation should be independently reviewable.

---

# 24. Prerequisite review

Prerequisites must represent plausible causal learning dependency.

Do not simply encode lesson order.

For each prerequisite ask:

> **Could the learner realistically understand/do the target without this?**

Classify strength:

- REQUIRED;
- STRONG;
- SUPPORTING.

---

# 25. Misconception candidate creation

Misconceptions can be identified from:

- subject expertise;
- teaching resources;
- sample assessments;
- repeated distractor patterns;
- learner data later.

A misconception object should include:

- concise description;
- affected assertions;
- expected error signature;
- relevant diagnostic probes;
- candidate remediation.

---

# 26. Misconception caution

Do not invent a named misconception for every wrong answer.

Differentiate:

- misconception;
- procedural weakness;
- arithmetic slip;
- unit/prefix error;
- interpretation error;
- strategy limitation;
- low-information error.

This preserves WP1.3/WP1.4.

---

# 27. Assertion verification

Before approval, each assertion should be checked through independent
AI verification, deterministic validation and risk-appropriate human
review/sampling for:

- truth/correctness;
- independence of wording;
- appropriate granularity;
- correct domain;
- source support;
- locator accuracy;
- rights status;
- curriculum relevance where mapped;
- relationship coherence.

Verification evidence must be retained in structured form.

The verification stage must be distinct from the generation stage even
when both are AI-assisted.

---

# 28. Verification states

Suggested lifecycle:

```text
CANDIDATE
   ↓
SOURCE_LINKED
   ↓
VERIFIED
   ↓
APPROVED
   ↓
PUBLISHED
```

Later:

- SUPERSEDED;
- WITHDRAWN.

Candidate generation and verification must remain separate operations even if the same founder performs both during bootstrap.

---

# 29. Founder as reviewer during bootstrap

During early bootstrap, the founder may perform:

- spot checks of AI verification;
- subject review of ambiguous/high-impact material;
- curriculum review;
- approval-policy decisions;
- direct approval where required.

The founder should **not** be assumed to manually verify every assertion
forever.

The system should record distinct lifecycle actions so that:

- AI generator;
- AI verifier;
- deterministic validator;
- human reviewer;
- publication authority

can remain separate roles even if one person controls the overall
pipeline during bootstrap.

Do not encode:

> creator = approver automatically

or:

> every object requires permanent manual line-by-line approval

as architectural assumptions.

---

# 30. Risk-tiered review

Not all content requires the same level of scrutiny.

Suggested risk dimensions:

- safety implications;
- legal/regulatory dependence;
- proprietary-source dependence;
- mathematical complexity;
- diagnostic importance;
- learner-facing authority;
- cross-domain reuse.

Potential tiers:

- LOW;
- STANDARD;
- HIGH;
- CRITICAL.

Phase 1 can use a simple tiering scheme.

---

# 31. High-risk content

High-risk content may require:

- direct source verification;
- second review later;
- additional deterministic tests;
- explicit professional sign-off.

For Phase 1 Electrical science calculations, most content will not be high clinical/legal risk, but incorrect technical teaching still matters.

---

# 32. Lesson candidate creation

Lessons are authored from approved assertions/capabilities.

A lesson candidate should define:

- lesson title;
- learning objectives;
- target assertions;
- prerequisites;
- curriculum mappings;
- canonical domain;
- teaching sequence;
- explanation blocks;
- demonstrations;
- guided practice;
- independent checks;
- remediation hooks;
- transfer expectations;
- estimated duration.

---

# 33. Lessons are not copied source structure

A proprietary teaching pack can help indicate:

- expected depth;
- sequencing;
- common learner difficulties.

The production lesson must be independently authored.

Do not recreate a proprietary PowerPoint/worksheet structure slide-by-slide in the learner product.

---

# 34. Lesson instructional review

Review a lesson for:

- coherent concept family;
- prerequisite readiness;
- unnecessary repetition;
- explanation clarity;
- demonstration quality;
- suitable guided practice;
- independent check quality;
- transfer;
- mobile readability;
- progressive depth.

The lesson should teach, not merely catalogue assertions.

---

# 35. Canonical lesson and contextual wrapper

For reusable foundational teaching:

```text
CANONICAL LESSON
Formula Transposition
```

may have:

```text
ELECTRICAL CONTEXTUAL WRAPPER
Why this matters for Unit 202
+ Electrical examples
+ Unit 202 transfer
```

Author foundational content once where possible.

Reuse it across qualifications/verticals.

---

# 36. Question-family authoring

Question families are authored against approved assertions/capabilities.

Each family should define:

- purpose;
- primary target;
- prerequisites;
- response type;
- answer model;
- parameter rules;
- difficulty;
- distractors;
- misconception mappings;
- evidence interpretation;
- curriculum mapping.

---

# 37. Assessment-like question authoring

Assessment-style questions should be independently created to test the same capabilities.

Authoring should consider:

- expected level;
- calculation complexity;
- realistic terminology;
- typical question length;
- plausible distractors;
- assessment conditions.

Do not copy sample-question wording.

---

# 38. Diagnostic question authoring

Diagnostic content should prioritise clean discrimination.

A diagnostic probe may intentionally be unlike the final exam.

Examples:

- formula-selection probe;
- transposition-only item;
- pure reciprocal arithmetic;
- unit conversion;
- plausibility judgement.

The purpose must be explicit.

---

# 39. Deterministic numerical-family authoring

For each numerical family, author:

- variable definitions;
- allowed ranges;
- units;
- formula relationship;
- parameter-generation constraints;
- rounding/tolerance;
- excluded values;
- difficulty controls;
- distractor algorithms;
- validation cases.

This is one of the platform's most important content-production accelerators.

---

# 40. Deterministic generation is governed content

Parameter logic is itself a governed content/code asset.

A family is not complete merely because one sample instance works.

The rules must guarantee valid variants across the allowed range.

---

# 41. Numerical-family validation

Automated validation should generate many candidate variants and test:

- formula correctness;
- no divide-by-zero;
- sensible values;
- unique answer options;
- unit equivalence;
- rounding;
- no accidental distractor equality;
- intended difficulty range.

Use property-style testing where useful.

**Property-based testing** means generating many inputs automatically and checking that defined rules/properties always remain true.

---

# 42. Deterministic teaching-example authoring

The same numerical family can support:

- demonstration;
- guided practice;
- independent check;
- transfer.

Authoring should define which parameter regions are appropriate for each stage.

Example:

```text
DEMONSTRATION:
clean integer division

GUIDED:
slightly varied values

INDEPENDENT:
novel but same capability

TRANSFER:
new context / extra unit demand
```

---

# 43. Distractor review

Each informative distractor should be checked for:

- plausibility;
- uniqueness;
- diagnostic interpretation;
- accidental ambiguity.

If a distractor has no meaningful diagnosis:

> mark it low-information rather than inventing one.

---

# 44. Explanation authoring

Explanations should be modular.

Possible layers:

- minimal correction;
- quick explanation;
- deeper explanation;
- misconception-specific explanation.

Each explanation should be mapped to approved assertions.

---

# 45. Worked-example authoring

Worked examples should:

- demonstrate a valid strategy;
- explain step purpose;
- use controlled numbers;
- avoid unnecessary difficulty;
- indicate alternative strategies where relevant.

A worked example should not accidentally become the only method the learner thinks is valid.

---

# 46. Remediation authoring

Remediation content should be created against known weakness families.

Examples:

- unit-prefix micro-remediation;
- formula-transposition short remediation;
- parallel-circuit conceptual remediation.

Each unit defines:

- target;
- duration;
- teaching depth;
- guided practice;
- independent retest;
- transfer route.

---

# 47. Retest authoring

A retest should not be identical to the remediation example.

It should test the same capability independently.

The authoring pipeline should check for excessive similarity.

---

# 48. Transfer authoring

Transfer items should deliberately change relevant surface features.

Examples:

- pure algebra → Ohm's law;
- Ohm's law → electrical power;
- Maths prefix conversion → resistivity.

Transfer distance should be explicit where useful.

---

# 49. Content review dimensions

Every learner-facing content object should be reviewed across at least:

1. **subject correctness**
2. **curriculum relevance**
3. **pedagogical usefulness**
4. **originality/IP**
5. **technical validity**
6. **diagnostic integrity**
7. **UX/accessibility suitability**

Different objects need different emphasis.

---

# 50. Technical validation before human review

Automate what machines are good at.

Examples:

- formula calculation;
- parameter bounds;
- unit conversions;
- duplicate option detection;
- missing mappings;
- broken references;
- schema validation;
- unsupported states.

Human review time should focus on judgement.

---

# 51. Automated content linting

A **linter** is an automated checker that flags potential problems against defined rules.

Content linting can flag:

- missing primary target;
- missing curriculum mapping;
- missing provenance;
- unpublished assertion target;
- ambiguous answer configuration;
- missing alt text;
- duplicated option;
- unsupported unit;
- unapproved explanation dependency.

This should become part of CI/content validation.

---

# 52. Content validation report

Before publication, a content object should have a validation result.

Example:

```text
Schema checks: PASS
Formula checks: PASS
Unit checks: PASS
Provenance: PASS
Rights: PASS
Curriculum mapping: PASS
Reviewer: approved
```

This makes publication auditable.

---

# 53. Approval gate

Only APPROVED content may become PUBLISHED.

The publication action should reject content with required validation failures.

Do not rely on editorial discipline alone.

---

# 54. Publishing

Publication should:

- record version;
- record approver;
- record timestamp;
- make object learner-visible;
- preserve previous versions;
- update dependent indexes/caches where relevant.

Published state is a governed transition.

---

# 55. Publication bundles

For efficiency, related objects may be reviewed/published as a bundle.

Example:

```text
Ohm's Law lesson v1
+ 4 question families
+ 2 diagnostic probes
+ 1 remediation branch
```

But each underlying object should retain its own identity/version.

---

# 56. Source update monitoring

The system needs a repeatable way to detect source changes.

Potential triggers:

- qualification handbook update;
- standard amendment;
- law/guidance change;
- publisher update;
- scheduled review.

Phase 1 may use manual monitoring.

Automation can be added later.

---

# 57. Update impact analysis

When a source changes:

```text
SOURCE VERSION
      ↓
PROVENANCE LINKS
      ↓
AFFECTED ASSERTIONS
      ↓
DEPENDENT:
relationships
lessons
questions
explanations
remediation
curriculum mappings
```

The system should identify affected objects.

This is a key long-term advantage of structured provenance.

---

# 58. Source-change review states

Affected content can enter:

- REVIEW_REQUIRED;
- UNAFFECTED_CONFIRMED;
- UPDATE_REQUIRED;
- WITHDRAW_PENDING.

Do not automatically rewrite learner content because a source changed.

---

# 59. Emergency withdrawal

If a serious content flaw is discovered:

- stop serving affected version;
- preserve history;
- identify affected learner attempts/evidence;
- invalidate/recompute evidence where justified;
- publish correction.

The pipeline must support this without deleting audit history.

---

# 60. Evidence impact of content correction

If a flawed question produced learner evidence:

```text
question invalidated
    ↓
affected evidence identified
    ↓
evidence invalidated
    ↓
learner state recomputed
```

This implements WP1.3.

Do not silently leave learners labelled weak because of a faulty question.

---

# 61. Content QA from learner data

Post-publication analytics can identify:

- unexpectedly high failure;
- distractor anomalies;
- ambiguous wording;
- excessive abandonment;
- remediation failure;
- transfer failure.

These are review signals.

They do not automatically prove content is wrong.

---

# 62. User-reported content issues

Learner reports should enter a governed review queue.

Possible categories:

- typo;
- unclear wording;
- answer appears wrong;
- diagram issue;
- reference issue.

Do not automatically change content from one report.

Do treat repeated/credible reports seriously.

---

# 63. Throughput measurement

The project needs to know whether content economics are viable.

Measure:

- source sections reviewed/hour;
- candidate assertions/hour;
- approved assertions/hour;
- rejection rate;
- review minutes/assertion;
- question families/hour;
- approved variants/family;
- lesson authoring time;
- remediation authoring time;
- rework rate.

This directly tests a major commercial risk.

---

# 64. Generation versus approval rate

Track separately:

```text
AI CANDIDATE GENERATION RATE
```

```text
AI VERIFICATION RATE
```

```text
HUMAN REVIEW / SAMPLING RATE
```

and:

```text
APPROVED PUBLICATION RATE
```

Also track:

```text
VERIFICATION ERROR / ESCAPE RATE
```

Generation speed can be huge while trusted publication remains
uneconomic.

The business-critical metrics are approved publication throughput,
verification cost and escaped-error rate.

---

# 65. Rejection taxonomy

When candidates are rejected, record why.

Examples:

- duplicate;
- unsupported;
- too broad;
- too narrow;
- wrong domain;
- copied wording risk;
- incorrect;
- poor diagnostic value;
- curriculum irrelevant;
- unsuitable difficulty.

This helps improve prompts and tooling.

---

# 66. Review-time reduction

Automation should progressively reduce low-value review effort.

Examples:

- automatic duplicate suggestions;
- formula checking;
- unit validation;
- source-locator display;
- relationship suggestions;
- curriculum mapping suggestions.

But automation should not hide evidence from the reviewer.

---

# 67. Review interface requirement

The eventual content-authoring/review interface should allow the reviewer to see together:

- candidate object;
- source locator/provenance;
- existing similar assertions;
- relationships;
- curriculum mapping;
- validation results;
- rights classification;
- change history.

Reviewing from disconnected files/screens would become too slow at scale.

---

# 68. Founder workflow

Bootstrap workflow can be:

```text
AI generates bounded candidate batch
↓
Founder reviews/corrects
↓
Automated validators run
↓
Founder approves
↓
Publish
```

This can later evolve to:

```text
Author
↓
Subject reviewer
↓
Governance/approval
```

without changing the content model.

---

# 69. Batch review

Reviewing candidates one-by-one may be inefficient.

The tooling should eventually support bounded batch operations such as:

- approve obvious clean mappings;
- reject duplicates;
- bulk change domain;
- bulk attach source version.

High-risk decisions should remain individual where appropriate.

---

# 70. Human review sampling

The intended long-term model includes sampling-based human review for
suitable low-risk content.

Phase 1 should begin with a high human-review proportion while the AI
generation and verification pipeline is being calibrated.

The proportion may then reduce for proven low-risk content when measured
error rates support it.

High-risk or ambiguous content remains directly reviewed.

The review policy itself must be versioned/governed.

---

# 71. AI model/provider independence

Content-generation prompts/templates should not depend irreversibly on one model vendor.

Record:

- task;
- prompt/template version;
- expected structured output.

Different models can then be evaluated.

This reduces supplier dependence.

---

# 72. Prompt versioning

Important content-generation prompts are production tooling.

Version them.

If a new prompt changes output quality:

- compare;
- evaluate;
- record;
- deliberately adopt.

Do not silently edit a prompt and continue mixing incompatible candidate styles.

---

# 73. AI output schema

Use structured outputs where possible.

Candidate objects should conform to a schema.

Benefits:

- easier validation;
- easier import;
- fewer formatting errors;
- deterministic rejection of malformed output.

---

# 74. Hallucination control

AI-assisted extraction must assume the model can hallucinate.

Controls include:

- source-bounded prompts;
- locator requirement;
- candidate status;
- direct verification;
- missing-information flag;
- no auto-publication;
- automated consistency checks.

Do not treat confidence-sounding prose as evidence.

---

# 75. Source-support rule

If the source does not support a candidate claim:

> reject it or source it elsewhere.

Do not silently fill the gap from general model knowledge when performing source extraction.

If an assertion is intentionally supported by external/general knowledge, attach an appropriate additional source.

---

# 76. Multi-source assertion workflow

Some assertions will have several supporting sources.

The pipeline should permit:

```text
ASSERTION
  ← official curriculum
  ← open technical source
  ← professional standard reference
```

Each link retains its provenance role.

This is stronger than forcing one canonical source.

---

# 77. Conflicting sources

Where credible sources conflict:

- do not silently choose one;
- record conflict;
- determine jurisdiction/version/scope;
- obtain subject/legal review where needed;
- publish only after explicit resolution.

The learner-facing product should not expose unresolved contradictions as settled fact.

---

# 78. Curriculum mapping review

A curriculum mapping should answer:

> Why is this assertion/content relevant to this criterion?

Mapping strength may include:

- REQUIRED_FOR;
- SUPPORTS;
- EXEMPLIFIES;
- ASSESSED_UNDER.

Do not map every related assertion directly to every assessment criterion.

---

# 79. Coverage reports

The pipeline should be able to report:

```text
curriculum criteria
→ mapped assertions
→ approved lessons
→ assessment questions
→ diagnostic coverage
→ remediation coverage
```

This identifies holes before launch.

---

# 80. Coverage does not equal quality

A criterion showing "100% mapped" does not prove:

- good teaching;
- enough independent evidence;
- authentic questions;
- useful remediation.

Coverage reports are governance tools, not quality scores.

---

# 81. Content-completeness gate for a unit

Before a unit is marketed as fully teachable, define required coverage.

Likely minimum:

- every intended curriculum criterion mapped;
- required lessons present;
- appropriate practice;
- assessment-style coverage;
- references/provenance;
- critical misconceptions represented;
- weak-area remediation for important foundations;
- no unresolved high-risk content defects.

Exact thresholds can vary by product promise.

---

# 82. Content depth levels

The pipeline should support differing product depth.

Example:

```text
FOUNDATIONAL COVERAGE
    ↓
TEACHABLE
    ↓
REVISION READY
    ↓
ASSESSMENT READY
    ↓
DIAGNOSTICALLY RICH
```

A qualification can be partially built internally without being marketed as complete.

---

# 83. Minimum publishable lesson

A lesson is not publishable merely because it has prose.

Minimum Phase 1 lesson should generally have:

- objectives;
- approved assertion mapping;
- explanation;
- demonstration where appropriate;
- guided interaction;
- independent check;
- feedback;
- curriculum mapping;
- provenance;
- mobile/accessibility review.

---

# 84. Minimum diagnostic-family completeness

A diagnosis family should not be activated until it has:

- plausible competing causes;
- evidence mappings;
- discriminating probe;
- remediation route;
- retest;
- transfer where required.

Otherwise the system risks surfacing clever-sounding diagnoses it cannot act on.

---

# 85. Feature gating by content maturity

The product should enable features only when supporting content is sufficiently complete.

Examples:

- don't show a "Fix this weakness" button without remediation;
- don't promise a full mock without appropriate blueprint coverage;
- don't label a unit fully taught if lessons are missing;
- don't expose deep diagnosis where evidence content is inadequate.

This prevents UX from outrunning content maturity.

---

# 86. Content environment promotion

Conceptual environments:

```text
DRAFT
  ↓
REVIEW
  ↓
APPROVED
  ↓
PRODUCTION
```

Objects should not be manually copied between environments in ways that lose IDs/version history.

Promotion should be repeatable.

---

# 87. Production content integrity

Published governed content should not be directly edited in production.

Changes should move through:

```text
new version
→ validation
→ approval
→ publication
```

Emergency withdrawal is separate.

---

# 88. Source material retention

Retention depends on rights and operational need.

For proprietary development material:

- retain only where lawful/needed;
- segregate from product content;
- document deletion/retention decisions;
- do not preserve indefinite shadow copies merely for convenience.

Original provenance metadata can remain even if a temporary processing copy is deleted.

---

# 89. Audit metadata

Important governed objects should record:

- creator;
- creation method;
- AI-assisted flag;
- reviewer;
- approver;
- timestamps;
- change reason;
- source links;
- version;
- status.

This is sufficient for traceability without creating excessive bureaucracy.

---

# 90. Content IDs

Stable object IDs should not encode:

- source edition;
- curriculum version;
- lesson order;
- wording.

Those things can change.

Version/state/mappings carry change.

---

# 91. Naming conventions

Internal IDs/titles should follow consistent conventions.

Example conceptual prefixes:

```text
FM-     Foundational Maths
FP-     Foundational Physics
EL-     Electrical
QF-     Question Family
REM-    Remediation
LESS-   Lesson
MIS-    Misconception
```

Exact conventions can be set during implementation.

Human-readable names remain separate.

---

# 92. Repository separation

The code repository should contain:

- schemas;
- migrations;
- governed seed/config definitions where appropriate;
- content tooling;
- tests;
- approved export/import formats.

It should not contain proprietary source PDFs unless explicitly approved and necessary.

Large source-development assets should remain outside the production repo.

---

# 93. Content-as-data versus content-as-code

Most governed learning content should behave as versioned data rather than requiring code changes to edit a lesson.

But deterministic generators/rules may be executable code or structured formula definitions.

The architecture should support both while preserving governance.

---

# 94. Review reproducibility

A reviewer should be able to reproduce why an object was approved.

For an assertion:

```text
source
version
locator
candidate wording
approved wording
review decision
```

For a numerical family:

```text
formula
parameter constraints
validation tests
sample variants
review
```

This reduces dependence on memory/chat history.

---

# 95. Content pipeline test dataset

Phase 1 should maintain a small controlled dataset containing:

- valid assertions;
- deliberate duplicates;
- over-broad candidates;
- bad source locator;
- copied/too-close wording example;
- invalid numeric family;
- ambiguous distractor;
- broken curriculum mapping.

The pipeline should reliably flag/reject these.

---

# 96. Content pipeline regression tests

Regression tests should confirm that later tooling changes do not:

- lose source provenance;
- silently change mappings;
- publish candidates;
- bypass rights checks;
- produce invalid numerical variants;
- permit duplicate IDs;
- break update impact analysis.

---

# 97. Content pipeline observability

Track operational signals:

- failed imports;
- validator failures;
- publication failures;
- source-update tasks;
- review queue size;
- average review time.

This helps identify where scaling actually becomes difficult.

---

# 98. Content bottleneck principle

The likely bottleneck is not:

> AI generation.

It is:

> **trusted verification and approval.**

The intended response is not simply to add more human reviewers.

Instead, the project should automate as much trustworthy verification
as possible through:

- independent source-grounded AI verification;
- deterministic validation;
- risk classification;
- human review of high-risk/ambiguous cases;
- statistical sampling of proven low-risk outputs.

Architecture and tooling should therefore optimise **verification
throughput and measured error rate**, not only human reviewer throughput.

This is central to commercial feasibility.

---

# 99. Vertical expansion test

Before adding a second full vertical, use the content pipeline to measure:

- foundational assertion reuse;
- lesson reuse;
- generator reuse;
- misconception reuse;
- new content required;
- review time;
- marginal cost.

This operationalises the Marginal Vertical Cost Ratio from Phase 0.

---

# 100. Proving-slice production target

For Phase 1, the pipeline should produce enough approved material to support:

- approximately 80–150 assertions/capabilities;
- the first three polished lessons;
- first 8–12 golden question families;
- diagnostic paths for:
  - transposition;
  - parallel/reciprocal;
  - prefixes;
- micro/short remediation;
- foundational retests;
- transfer items;
- sufficient deterministic variants for robust testing.

The count remains a planning range, not a quota.

---

# 101. Phase 1 pipeline order

Recommended implementation/production order:

1. register authoritative/reference sources;
2. capture curriculum skeleton;
3. deep-map first Ohm's-law cluster;
4. approve assertions;
5. model prerequisites/misconceptions;
6. author first lesson;
7. author golden question families;
8. add deterministic generators;
9. add diagnostic/remediation content;
10. validate/publish;
11. run synthetic learner flows;
12. expand to parallel circuits;
13. expand to electrical power;
14. add bounded resistivity/voltage-drop content.

---

# 102. First pipeline proof

The first full production pipeline proof should start with:

> **Ohm's Law / V-I-R**

because it exercises:

- curriculum mapping;
- Electrical assertions;
- Foundational Maths dependency;
- strategy representation;
- deterministic calculations;
- question families;
- diagnostic probe;
- remediation;
- transfer.

One small cluster should go end-to-end before bulk content authoring.

---

# 103. Second pipeline proof

Next:

> **Parallel circuits**

This tests:

- conceptual misconception;
- reciprocal arithmetic;
- circuit structure;
- deterministic numerical families;
- multiple plausible root causes.

---

# 104. Third pipeline proof

Next:

> **Electrical power**

This tests:

- multiple formulae;
- relationship selection;
- cross-domain Physics;
- transfer.

Only after these work should production volume increase substantially.

---

# 105. Quality gate before scaling content

Do not mass-produce content merely because the pipeline can generate it.

Before scaling, demonstrate:

- acceptable approval throughput;
- low correction rate;
- useful deterministic generation;
- reliable provenance;
- diagnostic usefulness;
- strong learner UX;
- no major IP-process flaw.

Then scale the corpus.

---

# 106. Content-pipeline acceptance criteria

WP1.8 is accepted when the Product Owner agrees that:

1. all material sources are registered with version and rights metadata;
2. source locators are precise and semantic where possible;
3. rights classification controls permitted pipeline use;
4. proprietary reference material remains outside learner production unless licensed/approved;
5. AI extraction output is always candidate material;
6. extraction is performed in bounded, traceable batches;
7. candidate normalisation/deduplication is explicit;
8. assertions are canonicalised into the most reusable domain;
9. prerequisite modelling is causal rather than merely curricular;
10. misconception modelling distinguishes misconceptions from slips/procedural errors;
11. assertion verification covers correctness, granularity, provenance, rights and mappings;
12. bootstrap founder review uses the same lifecycle states needed for future multi-reviewer governance;
13. content can be risk-tiered;
14. lessons are authored from approved assertions rather than copied source structure;
15. canonical foundational lessons can use vocational contextual wrappers;
16. question families are governed objects with structured answer/evidence models;
17. deterministic numerical rules are governed and automatically tested;
18. teaching examples use controlled parameter regions appropriate to instructional stage;
19. distractors are reviewed for diagnostic meaning and ambiguity;
20. explanations/remediation are modular and assertion-grounded;
21. retest content is independent from worked examples;
22. transfer content deliberately changes context/surface features;
23. technical validation is automated before human judgement where possible;
24. content linting is part of the toolchain;
25. publication is impossible without required validation/approval;
26. source updates propagate through explicit impact analysis;
27. serious content flaws can be withdrawn without deleting history;
28. flawed-question evidence can be invalidated/recomputed;
29. learner analytics/reports feed governed QA review;
30. approved-publication throughput is measured separately from AI generation throughput;
31. rejection reasons are recorded to improve tooling/prompts;
32. reviewer tooling must display provenance, rights, mappings and validation together;
33. prompt/template versions are governed;
34. structured AI outputs are preferred;
35. unsupported AI claims are rejected rather than silently filled from model knowledge;
36. multi-source provenance and source conflicts are supported explicitly;
37. curriculum coverage can be reported across assertions, lessons, questions and remediation;
38. marketing/features are gated by content maturity;
39. published content is changed through new versions rather than direct mutation;
40. proprietary development-material retention/deletion is deliberate;
41. object audit metadata is sufficient to reconstruct approval;
42. pipeline regression tests include provenance, rights, deterministic generation and publication controls;
43. reviewer throughput is treated as the likely commercial bottleneck;
44. vertical expansion measures actual reuse/marginal content cost;
45. Phase 1 proves the pipeline end-to-end on Ohm's Law before bulk production;
46. Parallel and Power clusters then test additional architecture;
47. mass content production begins only after quality/economic gates are met;
48. AI verification is a first-class expected pipeline stage, not an exceptional aid;
49. generation and verification are logically independent operations even when both use AI;
50. verifier output is structured and evidence-bearing rather than a bare confidence/pass label;
51. AI verification is treated as fallible evidence and is backed by deterministic checks, sampling and recoverability;
52. human review is risk-based and may reduce for proven low-risk content as measured reliability improves;
53. high-risk/ambiguous content remains eligible for mandatory direct human review;
54. any sampling-based review policy records sample size, error rate and severity and increases scrutiny if reliability degrades;
55. no single generation model call may directly create approved learner-visible content;
56. eventual automated publication, if introduced, is restricted to explicitly approved low-risk classes that have passed independent verification, deterministic validation and rights checks;
57. content economics track generation rate, verification rate, approved publication rate, verification cost and escaped-error rate separately.

---

# 107. Decision recommendation

**APPROVE WP1.8 as the Content Production & Governance Pipeline for Phase 1.**

The central decision is:

> **The platform's content corpus will be produced through a traceable, rights-aware, versioned pipeline in which AI performs both bounded candidate generation and independent source-grounded verification at scale. Generation, verification and publication remain distinct governed stages. Deterministic validation removes mechanical error classes; human review is concentrated on high-risk, ambiguous and sampled content rather than assumed for every object forever; and no single generation model call can directly create learner-visible approved content. Approved assertions are normalised into a reusable canonical knowledge graph, with source/content changes propagating through explicit dependency and evidence-impact analysis.**

The pipeline must prove not only that content can be generated, but that **approved high-quality content can be produced economically and maintained safely**.

---

# 108. Next work package

On approval of WP1.8, proceed to:

> **WP1.9 — Technical Architecture Decision & Implementation Plan**

WP1.9 will convert the approved conceptual architecture into actual technical choices, including:

- frontend framework;
- backend/application architecture;
- relational database/platform;
- authentication provider;
- hosting;
- background jobs;
- AI gateway;
- content-authoring/admin approach;
- deterministic formula engine implementation;
- testing stack;
- CI/CD;
- observability;
- security-standard mapping;
- applicable CIS hardening baseline;
- repository/module structure;
- ADRs;
- implementation order;
- bounded Claude Code work packages.

WP1.9 is the last major architecture/design gate before serious implementation begins.

---

**End of WP1.8**
