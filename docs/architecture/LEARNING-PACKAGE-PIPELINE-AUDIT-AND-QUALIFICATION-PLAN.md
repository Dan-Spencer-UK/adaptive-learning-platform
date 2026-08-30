# Learning Package Pipeline Audit & End-to-End Qualification Plan

## 1. Objective

After the new syllabus-to-learning-package, V1 learner-model and visual-planning architectures are implemented, audit the existing repository pipeline for structural drift, then prove the revised pipeline end-to-end before using it for further syllabus-scale production.

This audit must test the **actual V1 product contract**, not the richer proving-slice adaptive architecture as though every lesson must use it.

## 2. Audit question

For every learner-ready V1 lesson/package, can the repository prove — from authoritative source to runtime — that:

- curriculum and teaching are correct;
- the canonical lesson is substantial, coherent and visually complete;
- dedicated formative/mock assessment is valid;
- only completed/submitted assessment updates Guided Revision;
- Guided Revision maps demonstrated weaknesses to full canonical lessons;
- runtime supports all required contracts?

## 3. Audit layers

### A. Source/curriculum

Trace source version → curriculum node → assertion/capability → canonical lesson membership → assessment relationship.

### B. Canonical lesson authoring

Trace capability → storyboard semantic section → learner copy → visuals → embedded lesson check.

Audit specifically for:
- one-sentence/viewport fragmentation;
- unnecessary Continue boundaries;
- insufficient teaching depth;
- coherent sections that should scroll instead;
- old mastery-driven branching accidentally active in V1 route.

### C. Visual planning

Trace lesson concept → visual-opportunity analysis → VRR entry → reference dossier → design-system version → asset production → approved asset.

### D. Embedded lesson checks

Trace taught capability → lesson-check blueprint → prerequisites → answer isolation → marking/feedback.

Prove lesson-check outcome does not alter V1 canonical lesson route or current Guided Revision plan.

### E. Formative/mock assessment

Trace assessment scope/coverage → question/archetype → capability → canonical revision lesson → stable assessment instance → explicit completion/submission state.

Prove:
- attempt is stable through resume;
- incomplete/unsubmitted assessment is plan-side-effect free;
- assessment route does not adapt mid-attempt in V1.

### F. Weakness analysis / Guided Revision

Trace submitted assessment → item results → capabilities → lesson weakness aggregation → deterministic rank → current Guided Revision plan → canonical lesson link.

Prove:
- latest submitted assessment in scope is the current plan source;
- duplicate lesson mappings collapse;
- completing revision lessons does not claim repair or regenerate priority;
- later submitted assessment rebuilds the plan.

### G. Evidence/mastery compatibility

Trace raw evidence/history separately from current V1 plan state.

Confirm existing CC-07/CC-08/CC-12 capabilities:
- remain valid/available where implemented;
- are not duplicated;
- do not silently drive V1 ordinary lesson route;
- are clearly classified as retained platform/post-V1 capability where appropriate.

### H. Runtime projection

Trace governed lesson/asset/question/assessment records → generated projection → mobile renderer → supported input/diagram/formula/navigation contracts.

### I. Publication

Trace gate results → release membership → normal Learn catalogue → canonical Lesson Player → assessment entry → submission → Guided Revision.

## 4. Required audit outputs

Produce:
- source-of-truth map;
- mismatch register;
- bypass-path register;
- duplicate-source-of-truth register;
- stale-document register;
- missing-validator register;
- visual-gap register;
- lesson-fragmentation/depth register;
- V1-adaptation-drift register;
- assessment/submission-integrity register;
- Guided Revision mapping/register;
- architecture remediation plan ranked P0/P1/P2.

## 5. Specific failure modes to search for

### Curriculum/content
- lesson questions requiring knowledge not taught/declared prior;
- off-syllabus content introduced by broad related-topic generation;
- assessment items without precise canonical lesson mapping.

### Lesson quality
- lesson plan steps produced without pedagogical ownership;
- one-sentence Continue fragmentation;
- no-scroll assumptions still forcing weak structure;
- recap/completion duplication;
- teaching text visible during checks and leaking answers;
- raw engine/debug strings reaching learner UI;
- V1 lesson assembly that skips/inserts/reorders teaching from mastery/evidence.

### Visuals
- visuals added after lesson completion rather than planned before authoring;
- text-only conceptual lessons with no explicit visual justification;
- token imagery that does not materially teach;
- reference selection performed automatically by Claude/Gemini;
- reference records without usage annotations;
- generated imagery used as technical authority;
- obsolete asset manifests still production-addressable;
- visual style constants duplicated in prompts rather than sourced from design tokens.

### Assessment / Guided Revision
- ordinary lesson check updates revision plan;
- started/partial/suspended assessment updates revision plan;
- completed-but-unsubmitted assessment updates revision plan;
- result-screen render causes duplicate plan generation;
- assessment questions reorder/regenerate unexpectedly on resume;
- assessment changes route based on answer in V1;
- plan uses stale/older assessment when a newer submitted one exists;
- weak capability has no revision lesson mapping;
- multiple weak capabilities duplicate the same lesson in plan;
- Guided Revision links to a hidden remediation copy rather than canonical lesson;
- completing revision lesson is incorrectly treated as demonstrated repair.

### Runtime/source-of-truth
- schema-valid content unsupported by the native runtime;
- runtime green despite missing educational-quality gates;
- multiple mutable sources of truth for lesson availability or asset selection.

## 6. Implementation gate before pilot

Do not start the pilot until the audit has been remediated enough that:
- mandatory catalogue/reference records exist in schemas/tooling;
- publication gates are executable;
- new lesson status cannot skip required visual planning;
- canonical V1 route cannot silently vary by mastery/evidence;
- assessment submission boundary exists and is enforceable;
- assessment→capability→lesson mapping is represented;
- Guided Revision plan has one deterministic source-of-truth;
- all production assets resolve from one active source of truth;
- reference-approval authority is enforced by workflow, not convention alone.

## 7. End-to-end V1 pilot

Choose a representative lesson/topic area that contains:
- conceptual teaching;
- meaningful scrollable explanation;
- at least one required technical visual;
- at least one physical/symbol visual if possible;
- a worked example or interactive representation;
- an embedded lesson check;
- at least one assessment-safe visual state if the mock uses imagery;
- formative/mock assessment questions mapped back to the lesson.

Build/qualify it using the revised pipeline.

### Pilot sequence

1. verify syllabus source;
2. map curriculum requirements;
3. define assertions/capabilities/dependencies;
4. author one canonical lesson storyboard;
5. explicitly review teaching depth/semantic sections;
6. run visual-opportunity analysis;
7. generate candidate VRR;
8. STOP for ChatGPT independent VRR/reference review;
9. receive reviewed catalogue + Reference Dossiers;
10. lock family/design-system brief;
11. implement lesson + embedded checks;
12. Claude invokes Gemini only for approved production packets;
13. run technical/pedagogical/design visual QA;
14. STOP for ChatGPT/Product Owner visual review;
15. register approved assets;
16. implement/verify small governed formative/mock assessment coverage for the pilot capabilities;
17. generate learner runtime projection;
18. run all learning-package quality gates;
19. walk canonical lesson on Android emulator and verify scrolling/depth/check;
20. start assessment and abandon/suspend before submission — verify Guided Revision unchanged;
21. resume/complete assessment but stop before submit — verify Guided Revision unchanged;
22. submit assessment — verify exactly one weakness analysis/plan rebuild;
23. open Guided Revision — verify full canonical lesson(s) ranked correctly;
24. complete/review a guided lesson — verify priority does not falsely clear;
25. complete + submit a second assessment instance — verify plan rebuilds from the new submitted result;
26. Product Owner reviews the complete learner experience;
27. record PASS/FAIL and pipeline improvements.

## 8. Success criteria

The pipeline is qualified only when:
- no manual hidden step was needed to reconcile mismatches;
- every downstream artifact is traceable to an upstream governed decision;
- lesson teaching is substantial/coherent rather than viewport-fragmented;
- the learner experience contains the planned visuals and no stale/fallback assets;
- embedded checks cannot see answer-bearing teaching state;
- canonical lesson route is invariant to mastery/evidence in V1;
- incomplete/unsubmitted assessment has no Guided Revision side effect;
- submitted assessment produces a deterministic explainable plan;
- plan links to full canonical lessons;
- later submitted assessment updates the plan;
- lesson/assessment/revision flow completes on-device;
- the Product Owner considers the result representative of the desired premium V1 standard.

## 9. After qualification

Only after the pilot passes should ALP:
- re-author/refactor Unit 202 systematically through the new pipeline;
- complete the Unit 202 formative/mock assessment + Guided Revision mapping;
- build new units/qualifications at scale;
- automate further catalogue generation.

Richer within-lesson/cross-lesson adaptive experiences remain post-V1 roadmap options and must not block this production sequence.

**Two-dimensional qualification requirement (governance addition):** "qualified" here means both technically qualified (§8's success criteria) and pedagogically/product-quality qualified (independent Project Architect + Product Owner review of instructional coherence, depth, sequencing, cognitive load, storyboard quality, visual pedagogy, assessment quality and overall learner experience — see [`docs/governance/LEARNING-PACKAGE-QUALITY-GATES.md`](../governance/LEARNING-PACKAGE-QUALITY-GATES.md) §16). Neither dimension substitutes for the other. If the pilot surfaces meaningful defects, the first question is always whether the defect is isolated or whether the production architecture/rules permitted it — defect classes are corrected upstream before scaling, per [`docs/governance/LEARNING-PACKAGE-QUALITY-GATES.md`](../governance/LEARNING-PACKAGE-QUALITY-GATES.md) §17.

This requirement governs Package 3 (storyboard/visual-opportunity planning, `reports/learning-package-pipeline-audit/REMEDIATION-PLAN.md`) and every later content-production package. A package's own proposed contract — including any architecture-discovery report Claude Code produces — is evidence/proposal only until the Project Architect independently accepts it; it is never self-approving merely because Claude Code produced it. This does not reopen or alter the ADR-0006 V1 canonical-route/Guided-Revision model.
