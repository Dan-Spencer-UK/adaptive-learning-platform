# Architecture Reset Integration Matrix

**Purpose:** mechanical checklist for reconciling all current authoritative ALP documentation with ADR-0005 **and ADR-0006**. This exists specifically to prevent old and new development models co-existing as apparently valid guidance.

## 1. Authority order for this reset

For learning-package production after 2026-08-29:

1. Product Owner decisions recorded in ADR-0005 and ADR-0006 and the new architecture documents;
2. updated current architecture/governance/product documents;
3. historical package/evidence reports as history only.

Historical reports are not rewritten merely because they describe the old state. Current-looking guidance must be reconciled.

The V1 learner model is:

> **one canonical premium lesson route + dedicated completed/submitted formative/mock assessment + deterministic Guided Revision using full canonical lessons.**

Richer within-lesson/cross-lesson adaptation remains implemented platform capability and post-V1 direction, not a V1 ordinary-lesson production requirement.

## 2. Existing documents requiring semantic update

### `docs/architecture/ARCHITECTURE-OVERVIEW.md`

Must state explicitly that the production architecture now includes:
- source/syllabus → knowledge → canonical storyboard → visual plan → lesson checks → formative/mock assessment mapping → reference governance → production → publication gates → runtime → submitted-assessment Guided Revision;
- learning-package quality is upstream-governed, not repaired at runtime;
- visuals are first-class governed content;
- runtime compatibility is one publication gate, not the overall definition of learner readiness;
- V1 ordinary lessons follow one canonical route;
- V1 adaptation is revision prioritisation after submitted assessment, not mastery-driven lesson assembly.

Add direct links to ADR-0005, ADR-0006 and the new architecture documents.

### `docs/architecture/CC-05-PEDAGOGICAL-KNOWLEDGE-AND-QUESTION-ARCHITECTURE.md`

Amend current authoritative sections to add:
- taught-before-tested invariant;
- explicit question prerequisite contract;
- canonical storyboard-before-prose rule;
- rich scrollable teaching rule;
- visual-opportunity analysis as part of pedagogical authoring;
- teaching/lesson-check state separation and answer-leak prevention;
- assessment-to-capability-to-lesson mapping;
- V1 distinction between embedded lesson checks and dedicated formative/mock assessment;
- publication quality gates.

Where historical/current sections describe diagnostic/remediation richness, preserve them as platform capability while explicitly stating that V1 ordinary lesson authoring does not require dynamic diagnostic/remediation branches.

Do not delete historical CC-05 implementation evidence.

### `docs/architecture/LESSON-PLAYER-AND-LESSON-PLAN-ARCHITECTURE.md`

This is a high-risk mismatch point and must be reconciled carefully.

Add/clarify:
- a learner step is a semantic teaching experience, not a viewport/slide;
- scrolling is allowed/preferred when it preserves coherent explanation;
- the floating continuation affordance makes hidden content discoverable;
- one-sentence → Continue fragmentation is not the V1 target;
- V1 uses one canonical route through each ordinary lesson;
- mastery/evidence/prerequisite state does not skip/insert/reorder ordinary V1 teaching sections;
- no redundant pre-completion summary duplicating terminal completion;
- teaching content must not remain answer-bearing when an embedded check is active;
- learner-facing renderer hides all internal step/engine metadata;
- visual requirement/asset state is part of lesson-plan completeness.

Existing richer adaptive assembly/branching sections must be marked:
- implemented/proven platform capability where true;
- post-V1/future learner-experience option;
- not mandatory V1 lesson behaviour.

Do not delete the implementation; correct the current product contract.

### Evidence/mastery and diagnostic architecture/current docs

Current evidence/mastery architecture remains valid.

Reconcile any current-facing wording that implies:
- mastery must directly drive V1 ordinary lesson route;
- ordinary lesson checks must trigger remediation;
- course orchestrator must decide the next V1 lesson automatically as the primary learner experience.

State instead:
- evidence/mastery history remains governed and auditable;
- lesson checks may create evidence but do not alter V1 Guided Revision;
- the current Guided Revision plan is triggered by the latest completed/submitted formative/mock assessment;
- richer orchestration remains post-V1 capability.

Historical CC-07/CC-08/CC-12 evidence reports remain historical evidence and should not be rewritten.

### `docs/architecture/PREMIUM-INSTRUCTIONAL-VISUAL-PRODUCTION-PIPELINE.md`

This document remains authoritative for production execution but must be updated so the new upstream flow is unambiguous:
- visual requirements are generated from canonical lesson storyboard before asset production;
- lesson visual planning assumes rich canonical teaching, not thin one-screen fragments;
- Claude may extract candidate needs but may not approve/select technical references;
- ChatGPT independently reviews the catalogue and selects/annotates references;
- Reference Dossier is mandatory before production;
- VRR/ARL/AAL catalogue model;
- product-wide design-system version required in production packets;
- Gemini is renderer only;
- no production job without approved dossier;
- V1 prioritises canonical teaching assets and assessment-safe variants;
- bespoke adaptive-remediation visual variants are not a V1 requirement.

Where old sections imply Claude can autonomously acquire/select the final technical reference, replace them.

### `docs/architecture/CC-05D-INSTRUCTIONAL-VISUAL-GOVERNANCE-AND-SEMANTIC-QA.md`

Clarify that semantic reference QA happens after independent reference selection and does not substitute for it. Add links to the Reference Review Protocol.

Make clear that V1 visual completeness is judged against the canonical lesson and dedicated assessment visual needs.

### `docs/design/ALP-INSTRUCTIONAL-VISUAL-STYLE-GUIDE.md`

Either:
- merge its still-valid content into `ALP-PRODUCT-WIDE-VISUAL-DESIGN-SYSTEM.md` and mark the old guide superseded; or
- retain it as a concise generated-art subset that explicitly defers product-wide line/stroke/palette/symbol/layout rules to the new design system.

There must not be two competing style authorities.

### `docs/product/PRODUCT-PRINCIPLES.md`

Add permanent product principles:
- premium visual instruction is fundamental to product value;
- text-only conceptual lessons require justification;
- coherent teaching may scroll and must not be fragmented merely for viewport fit;
- learner-ready means educational + visual + runtime quality;
- taught-before-tested and no off-syllabus drift;
- learning packages are authored from syllabus outward;
- V1 ordinary lessons have one canonical route;
- V1 adaptation is assessment-driven Guided Revision using full canonical lessons;
- incomplete assessments never alter the revision plan.

### `docs/product/MOBILE-UX-ENGINEERING-STANDARD.md`

Add:
- internal/debug metadata prohibited in production learner views;
- teaching-to-check transition must prevent answer leakage;
- visual canvas may differ from dark app chrome;
- scroll discoverability requirement remains;
- do not optimise teaching to one viewport;
- component/symbol visuals and interactive visual regions use accessible mobile targets;
- Guided Revision has a clear learner-facing entry point and ordered lesson list;
- assessment submission is explicit.

### `docs/governance/ROLES-AND-AUTHORITY.md`

Add explicit visual authority split:
- Claude candidate extraction/orchestration only;
- ChatGPT catalogue/reference review and technical-reference selection/annotation;
- Product Owner final visual/design approval;
- Gemini renderer only.

Also record that V1 learner-model changes (canonical route vs richer adaptation) are Product Owner/Product Architect decisions, not Implementation Engineer discretion.

### `docs/development/AI-DEVELOPMENT-PROTOCOL.md`

Add:
- Claude must not invent/approve technical visual references;
- must stop when approved reference/brief is missing;
- may not bypass learning-package gates to complete a downstream task;
- cross-layer issues are fixed upstream/root-cause first;
- Claude must not opportunistically re-enable post-V1 adaptive lesson branching as part of V1 content work;
- Guided Revision plan logic is deterministic and not runtime AI.

### `docs/development/DEVELOPMENT-WORKFLOW.md`

Replace any interpretation of "vertical slice" that permits downstream success with upstream incompleteness.

Add:
- build vertically through all new gates;
- no feature package may create a production path around unmet curriculum/visual/pedagogy contracts;
- audit impacted upstream/downstream contracts before accepting a local fix;
- V1 content production optimises for one excellent canonical lesson route;
- do not multiply lesson branches/variants until the V1 loop is proven;
- formative/mock assessment + submit + Guided Revision is a required V1 product vertical.

### `docs/governance/PROJECT-PLAYBOOK.md`

Add a durable section covering:
- syllabus-to-learning-package sequence;
- rich scrollable canonical lesson standard;
- visual-first planning/reference governance;
- independent quality gates;
- V1 assessment-driven Guided Revision;
- pipeline audit + pilot before horizontal expansion.

### `docs/governance/DECISION-LOG.md`

Add:
- ADR-0005 decision summary;
- ADR-0006 V1 simplification decision summary;
- links to both.

### `docs/roadmap/ROADMAP.md`

Insert a programme checkpoint before further broad content expansion:
- Learning Package Architecture Reset;
- V1 learner-model integration;
- pipeline integration/audit;
- end-to-end pilot including assessment→Guided Revision;
- Unit 202 re-authoring/refactor under new pipeline;
- only then further unit-scale expansion.

Post-V1 richer adaptive lesson routing should be shown as deferred, not as a blocker on V1 release.

### `README.md` and `docs/START-HERE.md`

Update onboarding summary so a new engineer learns:
- the new production sequence;
- one canonical V1 lesson route;
- rich scrollable teaching standard;
- assessment-driven Guided Revision;
- visual/reference authority boundaries;
- which richer adaptive capabilities are retained but deferred.

### `PROJECT-STATUS.md`

As the current-state owner, record:
- CC-12H runtime qualification remains valid;
- Product Owner quality review found authoring/premium-quality architecture gaps;
- Product Owner subsequently simplified V1 learner adaptation;
- current stage is architecture reset / V1 pipeline implementation;
- broad expansion paused;
- existing rich adaptive engines remain implemented but are no longer V1 lesson-production requirements;
- next sequence: integrate → audit → remediate → end-to-end V1 pilot → Product Owner review → Unit 202 systematic re-authoring.

Do not rewrite old historical package entries as though they were wrong at the time; make current-state supersession explicit.

## 3. Existing code/tooling areas requiring implementation audit

After docs integration, inspect at minimum:
- `packages/content-schema`
- `scripts/content`
- lesson-plan/lesson-assembly data and route selection
- question blueprint generation/validation
- evidence/mastery engine interfaces
- course orchestration interfaces
- assessment state/submission model
- assessment coverage/question generation
- assessment→capability→lesson mapping
- Guided Revision plan generation/storage/UI
- `tools/visual-production-studio`
- visual catalogue/reference acquisition/preparation/prompt builder
- runtime visual registries
- generated mobile projection
- release/publication gates
- QA/runtime walker.

## 4. Required new machine-readable concepts

Implement or map existing equivalents for:
- `LessonStoryboard` with `CANONICAL_FIXED_ROUTE`;
- semantic/coherent teaching-section record;
- `VisualOpportunityAnalysis`;
- `VisualRequirement`;
- `ReferenceDossier`;
- `VisualFamilyContract`;
- `LearningPackageGateResult`;
- question `requiredKnowledge` / prerequisite links;
- assessment question → revision lesson mapping;
- formative assessment status with explicit `SUBMITTED`;
- submitted assessment result;
- deterministic `GuidedRevisionPlan`;
- visual design-system version binding;
- active/superseded asset eligibility.

Do not duplicate existing schema objects if they already represent the concept cleanly; extend them.

## 5. Required validators

At minimum:
- syllabus/capability traceability;
- taught-before-tested;
- off-syllabus/enabling-content declaration;
- canonical route invariance to mastery/evidence;
- semantic step/section ownership;
- arbitrary one-sentence fragmentation review;
- no duplicate completion;
- embedded-check answer-leak contract;
- visual-opportunity completed;
- required visuals resolved;
- reference dossier approved before generation;
- design-system version bound;
- production asset source-of-truth/obsolete exclusion;
- native runtime contract readiness;
- learner-facing debug/internal metadata exclusion;
- incomplete/unsubmitted assessment cannot update Guided Revision;
- submitted assessment maps every revision-relevant capability to canonical lesson(s);
- Guided Revision uses latest submitted assessment in scope;
- plan ranking/deduplication deterministic;
- plan links only canonical production lessons;
- completing revision lesson does not itself regenerate plan.

## 6. Definition of reconciled documentation

Documentation reconciliation is complete only when a fresh engineer cannot reasonably conclude any of the following obsolete ideas:

- visuals are an optional downstream polish layer;
- Claude may independently choose technical reference images;
- a lesson may be learner-ready while required visuals are absent;
- runtime PASS equals learning-package quality PASS;
- questions may depend on loosely related content from another lesson without an explicit dependency;
- content can be authored first and pedagogical/visual structure repaired afterward;
- every teaching step should fit one phone viewport;
- one-sentence slides are the preferred mobile lesson style;
- V1 ordinary lessons dynamically adapt/skip/remediate based on mastery;
- CC-08/CC-12 adaptive proving behaviour is a mandatory V1 content-production requirement;
- ordinary lesson checks update Guided Revision;
- starting or partially completing an assessment updates Guided Revision;
- Guided Revision requires separate remediation lesson copies.
