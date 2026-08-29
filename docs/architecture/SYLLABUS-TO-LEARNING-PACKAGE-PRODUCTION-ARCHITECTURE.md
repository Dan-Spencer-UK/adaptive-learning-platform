# Syllabus-to-Learning-Package Production Architecture

**Status:** Approved architecture direction — implementation required before further syllabus-scale expansion.

**V1 learner-model authority:** [`V1-LEARNING-ASSESSMENT-AND-GUIDED-REVISION-ARCHITECTURE.md`](V1-LEARNING-ASSESSMENT-AND-GUIDED-REVISION-ARCHITECTURE.md) and ADR-0006.

## 1. Purpose

This document defines the mandatory production architecture for turning an authoritative syllabus into learner-ready teaching, practice and assessment experiences in ALP. It supersedes any earlier implicit workflow in which lesson text, questions or imagery could be authored independently and reconciled later.

The governing principle is:

> **Correctness, pedagogy, assessment integrity, visual direction and runtime compatibility are designed together from the ground up. Downstream optimisation may never compensate for an upstream omission.**

A learning package is not complete because it runs. It is complete only when its curriculum, knowledge, teaching sequence, visuals, interactions, assessment mapping, learner presentation and runtime are mutually consistent.

For V1, this architecture deliberately optimises for **one excellent canonical lesson route plus assessment-driven Guided Revision**, not rich adaptive branching inside every lesson.

## 2. Canonical production sequence

Every new qualification/unit/topic/lesson must progress through these stages in order:

1. **Source and syllabus authority**
2. **Curriculum decomposition and traceability**
3. **Governed knowledge/capability model**
4. **Learning dependency map**
5. **Canonical lesson architecture / storyboard**
6. **Visual opportunity analysis and Visual Requirements Catalogue**
7. **Lesson-check plan**
8. **Formative/mock assessment plan and assessment-to-lesson mapping**
9. **Reference research and approval**
10. **Visual production brief and design-system binding**
11. **Lesson content implementation**
12. **Visual production and integration**
13. **Assessment implementation**
14. **Automated quality gates**
15. **Runtime qualification**
16. **Assessment → Guided Revision qualification**
17. **Human Product Owner review**
18. **Release readiness**

A later stage may send work back to an earlier stage, but it may not silently patch around an earlier-stage defect.

## 3. Syllabus authority and curriculum boundaries

### 3.1 Source-first rule

All learner-facing teaching and assessed capabilities must be traceable to an approved curriculum/source authority. A lesson may include enabling explanation or foundational knowledge only when the dependency is explicit and justified.

### 3.2 Off-syllabus drift is prohibited

A useful fact is not automatically valid course content. Content that is not required by the governing syllabus and is not explicitly approved as enabling/prerequisite material must not be introduced merely because it is related to the topic.

### 3.3 Taught-before-tested invariant

For every evidence-bearing question, the system must prove one of the following:

- the required assertion/capability was taught earlier in the same canonical lesson or preceding governed course material;
- it is an explicitly declared prerequisite capability that the learner is entitled to be assumed to know in that assessment context;
- it is a deliberate retrieval item and its prerequisite origin is traceable.

A question must never depend on knowledge that only appears in another lesson unless that dependency is explicitly governed.

No lesson-completion hard gate is implied. Access remains open. For V1, prerequisite relationships inform authoring, assessment interpretation and future extension; they do **not** dynamically redirect the learner during an ordinary lesson.

## 4. Knowledge, capabilities and dependencies

The canonical factual layer remains atomic governed assertions. Learning packages build on top of that layer with explicit capabilities and dependencies.

Each lesson must declare:

- assertions introduced;
- assertions reinforced;
- capabilities taught;
- prerequisite assertions/capabilities;
- embedded lesson-check targets;
- formative/mock assessment relationships;
- canonical assessment-to-lesson revision mapping;
- visual requirements.

Misconception/hypothesis metadata may remain where already governed and may support future/post-V1 adaptive use, but it is not a mandatory V1 lesson-authoring burden unless directly needed for question validity or learner feedback.

Dependencies are machine-readable and must be checked before publication.

## 5. One canonical V1 lesson route

A V1 lesson is designed as a pedagogical storyboard before final learner copy is written.

The released teaching sequence is canonical. It does not vary because of mastery, prerequisite state or ordinary lesson-check performance.

A lesson may contain, where pedagogically justified:

- orientation / hook;
- rich concept explanation;
- visual explanation;
- interactive teaching model;
- worked example;
- reinforcing example/comparison;
- short embedded knowledge/formative check;
- application/practice;
- recap;
- completion state.

Dynamic diagnostic/remediation/recheck branches are **not required V1 lesson roles**. Existing engine support remains available for post-V1 use and must not be deleted merely because V1 does not depend on it.

### 5.1 A step is a semantic teaching experience, not a viewport

The lesson must not be authored as PowerPoint-like fragments merely to fit one phone screen.

A substantial teaching step may include several coordinated content blocks and may require scrolling. It can contain:
- concise explanatory paragraphs;
- one or more high-quality visuals;
- labels/callouts;
- reinforcing information;
- a physical or vocational example;
- a worked example;
- an interaction;
- a key takeaway.

The preferred unit of authoring is the **coherent teaching idea**.

### 5.2 One-sentence fragmentation is a quality failure

A sequence such as:

```text
one sentence
→ Continue
→ one sentence
→ Continue
```

should fail pedagogy review unless each screen is independently purposeful (for example a focused question or deliberate interaction).

Avoid the opposite extreme too: a long unbroken text article is not premium teaching simply because scrolling is allowed.

Preferred pattern:

> **chunked explanation + strong visuals + reinforcement + examples/interactions + concise check**

### 5.3 Scrolling is allowed

Scrolling is a normal V1 lesson behaviour when it keeps related information together.

The learner must know when more content exists below. The floating continuation/down-arrow behaviour remains the product standard.

Do not shrink images, omit reinforcing explanation or split a coherent concept purely to make the step fit one viewport.

### 5.4 Completion is not a duplicate recap

A terminal completion state may summarise what was achieved and suggest next actions. A separate immediately preceding step that says substantially the same thing is normally redundant and should fail lesson-structure review.

## 6. Teaching, lesson checks and dedicated assessment

The platform must preserve the distinction between:

- **teaching/worked-example state** — may reveal relationships and worked answers;
- **embedded lesson check** — short evidence/retrieval interaction used to reinforce learning; must not expose its answer before response;
- **dedicated formative/mock assessment** — separate assessment experience used to identify V1 weaknesses and generate Guided Revision;
- **summative/exam-practice state** — may later have separate stakes/rules but shares strict answer-isolation principles.

Visible teaching content must not accidentally give away an answer to an embedded check occupying the same learner state. The renderer or lesson plan must deliberately separate, replace, cover, collapse or otherwise make answer-bearing material unavailable during the attempt.

### 6.1 Embedded lesson checks do not adapt V1 lesson routing

For V1, ordinary lesson checks:
- reinforce learning;
- provide immediate feedback;
- may be retained as evidence/analytics;
- do not remove, insert or reorder teaching;
- do not rebuild Guided Revision;
- do not automatically launch bespoke remediation.

## 7. Dedicated formative/mock assessment contract

The V1 adaptive loop depends on a dedicated formative/mock assessment.

Each assessment must have:
- governed scope (unit/course);
- governed coverage/archetype plan;
- stable generated question instances for the attempt;
- explicit capability/assertion mappings;
- lesson ownership/revision mappings;
- answer/marking contracts;
- answer-option randomisation where appropriate;
- assessment-safe visual requirements where applicable;
- a clear `COMPLETED_AND_SUBMITTED` boundary.

The assessment must not change question route/content in response to answers during the attempt in V1.

### 7.1 Only completed + submitted assessment updates Guided Revision

The plan-update trigger is exact:

- started / in progress / suspended / abandoned / completed-but-not-submitted → **no plan update**;
- completed + explicitly submitted → finalise marking, derive weakness analysis, rebuild Guided Revision.

This must be enforced at the state/data layer, not merely by UI convention.

## 8. Assessment-to-lesson revision mapping

For every capability that can be exposed as weak by a submitted assessment, the content architecture must know which canonical lesson(s) teach it.

The mapping must support:

```text
assessment question
→ capability/assertion
→ lesson(s)
→ revision priority
```

A mapping that can only say "revise Unit 202" is too coarse if the platform already has lessons capable of addressing the specific weakness.

Multiple weak capabilities may map to the same lesson; Guided Revision deduplicates them.

## 9. Guided Revision is the V1 adaptive remediation model

V1 does not require bespoke remediation lessons.

After a submitted formative/mock assessment, the system creates a deterministic Guided Revision plan consisting of the **same full canonical lessons** available in normal Learn navigation.

The plan:
- orders lessons from greatest demonstrated weakness to smallest;
- uses only lessons within the submitted assessment's governed scope;
- gives understandable priority labels/reasons;
- links directly to canonical lessons;
- does not hard-gate access to other lessons;
- does not fork lesson content into a second hidden remediation version.

Opening or completing a Guided Revision lesson does not itself prove that the weakness is repaired and does not recalculate the plan.

A later completed and submitted assessment is the event that rebuilds the plan.

## 10. Question authoring contract

Every embedded lesson-check or assessment question must declare:

- target capability;
- required prior knowledge;
- pedagogical/evidential role;
- answer domain;
- marking contract;
- distractor rationale where applicable;
- answer-leak risk;
- visual requirement/state if applicable;
- assessment-to-lesson revision mapping where the item participates in Guided Revision evidence.

Questions must test the learner's capability, not accidentally test awkward wording.

Complex misconception-diagnostic question design is only required where it adds real V1 learner value or is needed for valid scoring. Do not manufacture diagnostic complexity merely because the platform has a misconception model.

## 11. Visuals are first-class learning content

Instructional visuals are not decoration and are not an optional post-production enhancement.

Every lesson must undergo an explicit **visual opportunity analysis** before it can be considered authored.

For each concept/step, the authoring process must ask:

- What would a skilled teacher draw, point to, manipulate or show?
- Is the concept spatial, physical, relational, directional or comparative?
- Would a diagram, realistic component image, symbol, animation, interaction or comparison reduce cognitive load?
- Would an additional reinforcing visual improve understanding?
- Does an assessment-safe visual variant need to exist?

A concept-heavy or physical-recognition lesson with no meaningful visuals must fail visual-completeness review unless an explicit pedagogical justification is recorded.

There is no crude quota such as one image per screen. Visual demand is pedagogically determined. However:
- text-only conceptual lessons are not acceptable by default;
- richer scrollable teaching is preferred to under-explained visual-light fragments;
- V1 production effort should prioritise exceptional canonical lesson imagery and required assessment-safe variants rather than bespoke remediation-art branches.

## 12. Visual requirements are authored before assets

Each lesson produces a machine-readable Visual Requirements Catalogue before production imagery is requested. Required fields are defined in the Visual Planning and Reference Governance architecture.

A required visual may not be replaced by an improvised fallback simply because production is incomplete.

## 13. Human-readable learner copy boundary

Learner-facing UI must never expose internal implementation language such as:

- step type names;
- blueprint IDs;
- diagnostic IDs;
- raw tolerance/delta calculations;
- internal evidence strings;
- engine reason codes;
- debug metadata.

The engine may produce technical diagnostics internally. A pedagogical presentation layer must translate those into learner-appropriate feedback.

## 14. Visual and content cohesion are product-wide

Visual design, technical drawing rules, formula presentation, labels, colour semantics and component conventions are governed product-wide. A unit may not create its own local visual dialect unless the Product Owner explicitly approves a new global pattern.

## 15. Learning-package publication gates

A lesson/package cannot reach `LEARNER_READY` unless all applicable gates pass.

### Curriculum gate
- source/curriculum traceability complete;
- no unapproved off-syllabus content;
- taught-before-tested dependency check passes;
- assessment capabilities map to canonical lessons.

### Pedagogy gate
- one canonical V1 route is defined;
- storyboard has no redundant/ownerless fragments;
- coherent concepts are not arbitrarily split to fit a viewport;
- richer explanation/reinforcement is present where required;
- embedded checks are sequenced intentionally;
- completion is not duplicated.

### Assessment-integrity gate
- no pre-answer leakage;
- one defensible best answer;
- assessed knowledge has governed prerequisite/teaching provenance;
- assessment-safe visual states are correctly separated;
- submission boundary is explicit.

### Visual gate
- visual-opportunity analysis complete;
- all REQUIRED visuals resolved;
- reference dossiers approved;
- visual design-system compliance passed;
- technical/pedagogical visual QA passed.

### Learner-presentation gate
- no debug/internal language;
- readable, natural, vocational tone;
- screen density is pedagogically intentional;
- scrolling is allowed where beneficial;
- continuation is discoverable.

### Runtime gate
- schema/content/runtime contracts compatible;
- lesson renders and completes on target client;
- canonical route is invariant to mastery/evidence in V1;
- all lessons remain directly accessible;
- evidence persists correctly.

### Assessment/Guided Revision gate
- incomplete/unsubmitted assessments cannot alter the plan;
- a submitted assessment produces one deterministic weakness result;
- each weakness resolves to canonical lesson ownership;
- plan ranks/deduplicates lessons;
- plan is based on the latest submitted assessment in scope;
- later submission rebuilds/replaces the plan;
- revision lesson completion alone does not claim repair.

## 16. Evidence and mastery

Lesson completion and mastery remain separate.

Existing evidence/mastery infrastructure remains authoritative for longitudinal evidence and future platform capability.

For V1:
- embedded lesson-check evidence may be retained;
- submitted formative/mock assessment evidence is the trigger/input for the current Guided Revision plan;
- the plan reflects the latest submitted assessment in scope;
- prior submitted assessments remain auditable history;
- completing a revision lesson is not equivalent to demonstrating repaired mastery.

The implementation must preserve evidence context/versioning so flawed content can later be invalidated and learner state recomputed.

## 17. Existing richer adaptation is retained but deferred

Existing deterministic machinery for within-lesson diagnosis/remediation and cross-lesson orchestration is not discarded.

For V1, it is classified as **implemented platform capability / post-V1 learner experience** unless needed for data integrity or assessment support.

No V1 lesson-production gate should require:
- alternate mastery-driven lesson routes;
- misconception-specific remediation lessons;
- prerequisite detours;
- transfer/retest loops;
- spaced retrieval.

This is a production-scope decision, not a repudiation of the architecture.

## 18. Product Owner review

Automated gates prove structural compliance. They do not prove premium educational quality.

Before a new production pipeline is trusted at scale, the Product Owner must review:
- at least one full canonical lesson;
- teaching depth and readability;
- scroll behaviour;
- visual quality;
- embedded checks;
- a completed/submitted formative assessment;
- resulting Guided Revision plan;
- the full revision/reassessment loop.

## 19. Scale rule

Do not optimise for downstream throughput by weakening upstream gates.

However, do not impose post-V1 adaptive complexity on V1 content production.

The V1 production target is:

> **one excellent lesson route + excellent visuals + valid assessment + explainable Guided Revision.**

Once that loop is proven and commercially useful, richer adaptation can be reintroduced deliberately.
