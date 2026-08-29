# Remediation Plan (CC-13B, corrected by CC-13B.1 and CC-13B.2)

**This is a plan only.** No remediation work has begun. Every package below requires Product Owner / Project Architect review and sequencing decisions before any implementation starts, per this audit's own constraints. Packages are grouped by root cause, ordered so that the pilot-blocking classes — canonical-route integrity (1), rich teaching-content representation (2), storyboard/visual-planning integration (3), reference-dossier authority (4), canonical visual-eligibility authority (the pilot-blocking portion of 5), formative/mock assessment (7), Guided Revision (8), and learner-ready publication gates (9) — appear in a coherent dependency-respecting sequence. Independent, low-risk cleanup packages (the deferable portion of 5, 6, 10, 11, 12) are interleaved near the pilot-blocking package they relate to, or placed after the blocking chain, but do not themselves gate the pilot and must not be read as displacing it.

**CC-13B.1 correction note**: this plan was corrected after CC-13B's own initial version omitted a remediation package for one of its own confirmed P0 findings (no schema field for extended teaching prose) and used imprecise "triple-redundant" wording for the completion-screen finding (§ Package 10 below). No remediation work was performed by this correction — only the plan document changed.

**CC-13B.2 correction note**: the visual-governance packages (originally Packages 3-6) contained a sequencing contradiction — they would have permitted a legacy-pipeline visual asset to become learner-visible before passing the new ADR-0005 reference-authority and production-eligibility chain, and implied a historical Product Owner reference handover could automatically count as an approved current `ReferenceDossier`. Corrected: Packages 3-6 below now express the dependency-correct order **visual planning mandatory (3) → reference-dossier authority (4) → canonical production-eligibility authority + release-ID fix (5) → qualify/integrate reusable legacy assets (6)**, with an explicit rule that legacy QA-PASS status and legacy reference provenance are reusable *evidence*, never automatic *authorization*, and that no automated/mechanical process may write `reviewedBy: "PROJECT_ARCHITECT"` without actual Project Architect review. Package 9's dependencies were also corrected to include the reference/eligibility authority packages, and Package 7's persistence-layer wording no longer names a specific backend vendor. No remediation work was performed by this correction — only the plan document changed. See `PROJECT-STATUS.md` §CC-13B for the acceptance-status note.

---

## Package 1 — Close the CANONICAL_FIXED_ROUTE `branchRoutes` gap

**Objective**: make it mechanically impossible for a `CANONICAL_FIXED_ROUTE` lesson to declare a branching step, closing the one confirmed live schema bypass found in this audit.

**Root-cause findings addressed**: `V1-ROUTE-DRIFT-REGISTER.md` §2, `BYPASS-PATH-REGISTER.md` BP-1, `REPRESENTATIVE-FAILURE-ROOT-CAUSE-TRACE.md` #7.

**Expected files/layers**: `packages/content-schema/src/lesson-plan.ts` (extend the existing `superRefine`), `packages/content-schema/src/lesson-plan.test.ts` (add the missing test case identified by the audit).

**Dependencies**: none — this is the smallest, most self-contained package in this plan.

**Project Architect review required**: No — this is a direct, narrow closure of an already-specified invariant (ADR-0006), not a new design decision.

**Acceptance criteria**: a `CANONICAL_FIXED_ROUTE` lesson with a `required` step carrying a non-empty `branchRoutes` fails schema validation; a new test proves it; `lesson-plan.test.ts` and `scripts/content` Vitest suites remain green.

**Timing**: **before the V1 pilot.** This is foundational correctness for the exact invariant the pilot is meant to prove.

---

## Package 2 — Extend the canonical teaching-content model for rich scrollable teaching

*(New in CC-13B.1 — this package was missing from the original CC-13B remediation plan despite addressing one of that same audit's own confirmed P0 findings. See `LESSON-DEPTH-AND-FRAGMENTATION-REGISTER.md` §3.)*

**Objective**: provide a governed canonical authoring representation capable of expressing substantial teaching within a semantic lesson section — supporting multiple paragraphs / coherent explanatory chunks rather than forcing all teaching body copy to be reconstructed only from atomic assertion `statement` strings — so that mobile rendering can scroll naturally through genuinely rich content. The representation must remain structured and governable (not unrestricted HTML or arbitrary presentation markup), preserve accessibility and runtime determinism, integrate with the lesson storyboard/`semanticUnit` governance CC-13A already added, and be composable with visuals, formulas, worked examples, callouts and embedded checks rather than replacing any of them.

**Root-cause findings addressed**: `LESSON-DEPTH-AND-FRAGMENTATION-REGISTER.md` §3 (the P0 finding itself: *"there is no field anywhere in `lessonStepSchema` for authored multi-sentence/multi-paragraph explanatory prose"*), `CC-13B-EXECUTIVE-SUMMARY.md` P0 item (1).

**Expected files/layers** (illustrative, not a design decision — the exact shape is Project-Architect work, not specified by this plan): `packages/content-schema/src/lesson-plan.ts` (a new governed field or content-block structure on `lessonStepSchema`, alongside the existing `workedExampleBlueprintManifestSchema`/`visualAidBlueprintManifestSchema` structured-content pattern), `apps/mobile/src/lib/lesson-content/resolve-lesson-step.ts` (`resolveBodyStatements()` would need to additionally resolve this new field), `apps/mobile/src/components/lesson/LessonStepView.tsx` (rendering), `scripts/content/generate-mobile-projection.ts` (projection must carry the new field through unchanged, per this audit's own generated-projection-fidelity finding).

**Dependencies**: none as a hard blocker, but benefits from being decided alongside Package 3 (storyboard/visual planning) since rich teaching content and visual placement compose within the same semantic section.

**Project Architect review required**: **Yes — required.** This is an authored-content-contract design decision (what the governed shape of "rich teaching prose" is), not a mechanical patch, and directly affects every future lesson's authoring convention.

**Acceptance criteria** (for the eventual implementation to prove, not specified further at planning level here): one semantic teaching section can contain several coherent paragraphs; content can exceed one viewport and scroll correctly; arbitrary one-sentence fragmentation is not required by the new field; existing formulas/diagrams/worked examples can be composed with the teaching content; assessment-bearing states can still be separated from answer-bearing teaching; the generated mobile projection preserves the new representation without loss; current concise interaction/question steps remain possible (the new field must be optional, not a replacement for short focused-question steps); no unrestricted executable/unsafe markup is introduced; validators can distinguish deliberately concise content (a legitimate short focused question/interaction) from inadequately developed teaching.

**Timing**: **PILOT-BLOCKING.** Should be resolved before the representative V1 pilot lesson is authored (the pilot sequence's own step 4, "author one canonical lesson storyboard," and step 11, "implement lesson + embedded checks," in `LEARNING-PACKAGE-PIPELINE-AUDIT-AND-QUALIFICATION-PLAN.md` §7, cannot meaningfully exercise "rich scrollable teaching" without this), and must precede systematic Unit 202 re-authoring (Package 13).

---

## Package 3 — Make storyboard/visual planning mandatory (wire the VRR/VOA layer to real production)

**Objective**: reconcile the two disconnected visual-catalogue systems (the operative-but-non-conformant old pipeline and the conformant-but-empty new schema) into one, and make a real `VisualOpportunityAnalysis` + `VisualRequirement` a mandatory upstream artefact for any lesson before visual production begins. This package establishes *what visuals are needed*; it does not itself decide reference authority (Package 4) or production eligibility (Package 5) — those depend on this one existing first.

**Root-cause findings addressed**: `VISUAL-GOVERNANCE-AND-COVERAGE-REGISTER.md` §1, `REPRESENTATIVE-FAILURE-ROOT-CAUSE-TRACE.md` #8/#10, `SOURCE-OF-TRUTH-MAP.md` category d/e.

**Expected files/layers**: `packages/content-schema/src/visual-governance.ts` (already built, needs real instances), a new authoring workflow/tool to populate `VisualOpportunityAnalysis`/`VisualRequirement` objects (either migrating `tools/visual-production-studio/catalogue.ts`'s real data into the new shape, or building new tooling around the new shape and retiring the old), `scripts/content/validate-v1-learning-package.ts`'s `validateVisualGovernance()` (wire into the CLI entry point once real data exists to check).

**Dependencies**: none upstream — this is the first visual-governance package. Packages 4, 5 and 6 depend on this one.

**Project Architect review required**: **Yes** — this is exactly the kind of "major visual-family direction" decision `INSTRUCTIONAL-VISUAL-PLANNING-REFERENCE-AND-PRODUCTION-ARCHITECTURE.md` §2.3 reserves for the Product Owner, with Project Architect execution.

**Acceptance criteria**: every lesson entering/re-entering the pipeline has a real `VisualOpportunityAnalysis`; every REQUIRED visual need has a real `VisualRequirement`; `validateVisualGovernance()` runs against real data in CI and can fail; the contract-adoption matrix's visual-governance rows move off 0%.

**Timing**: **before the V1 pilot** for the mechanism/workflow itself (the pilot's own sequence, `LEARNING-PACKAGE-PIPELINE-AUDIT-AND-QUALIFICATION-PLAN.md` §7, explicitly requires this chain to be exercised end-to-end); the full migration of all 53 existing Unit 202 assets' VRR entries **can wait until the systematic Unit 202 rebuild**.

---

## Package 4 — Formalise reference authority as real, Project-Architect-reviewed `ReferenceDossier` records

*(Corrected by CC-13B.2 — this package now states explicitly that legacy reference provenance is reusable evidence, not automatic authorization.)*

**Objective**: express reference selection/annotation as real, schema-validated `ReferenceDossier` objects, each carrying genuine Project Architect review — reference class, exact authoritative role, what must be preserved/changed/removed/added, what must never be inferred, licence/provenance, technical-authority limits, and assessment-state implications, per `docs/governance/VISUAL-REFERENCE-REVIEW-PROTOCOL.md` and `LEARNING-PACKAGE-GOVERNANCE-CONTRACTS.md` §6.

The existing, dated, human-attributed reference-handover discipline currently living in `reference-corrections.ts` is **valuable provenance and may substantially reduce rework** — the underlying source material does not need to be rediscovered from scratch where it remains suitable. But it is **not automatically equivalent** to a current approved `ReferenceDossier`: it predates this schema and this review protocol, and was not produced against today's `preserve`/`change`/`remove`/`add`/`never-infer` annotation requirements. **No automated or mechanical migration script may write `reviewedBy: "PROJECT_ARCHITECT"` on a `ReferenceDossier` without an actual Project Architect performing that review** — migrating an entry means presenting the existing source/provenance to a Project Architect for a real (potentially fast, since the underlying research is already done) review and annotation pass, not copying a field value. The Product Owner remains the final approver of production assets regardless.

**Root-cause findings addressed**: `REFERENCE-AUTHORITY-REGISTER.md`, `BYPASS-PATH-REGISTER.md` BP-3.

**Expected files/layers**: `tools/visual-production-studio/reference-corrections.ts` (source provenance for the review, not an auto-migration input), `packages/content-schema/src/visual-governance.ts` (already has the schema — `ReferenceDossier.reviewedBy` is already a fixed `"PROJECT_ARCHITECT"` literal type, which is correct and must remain the only way to construct an approved record).

**Dependencies**: depends on Package 3 (a `ReferenceDossier` attaches to a `VisualRequirement`, which must exist first).

**Project Architect review required**: **Yes, for every dossier** — both newly researched references and references migrated from the legacy handover require an actual review pass; only the *effort* differs (a migration review can reuse existing provenance and move faster; it cannot skip the review itself).

**Acceptance criteria**: every reference in production use — new or migrated — has a real `ReferenceDossier` record produced by an actual Project Architect review, not a mechanical copy; no code path exists that can construct or mark a dossier `APPROVED`/set `reviewedBy: "PROJECT_ARCHITECT"` without that review having occurred; the representative V1 pilot's own visual asset(s) travel through this real workflow end-to-end.

**Timing**: the **reference-authority mechanism itself is PILOT-BLOCKING** — the pilot must exercise the real workflow, not a temporary legacy bypass. Full migration/review of every one of the ~45 historical Unit 202 references does **not** have to precede the pilot; only the pilot's own asset(s) need a real dossier before the pilot can be considered representative.

---

## Package 5 — Establish one canonical visual-asset production-eligibility authority, and close release-ID drift

*(Corrected by CC-13B.2 — renumbered/reframed from the original CC-13B Package 6's DUP-1/DUP-2, and split into a pilot-blocking mechanism vs. deferable historical cleanup.)*

**Objective**: before the V1 pilot, establish which **single** authority decides whether a visual asset is `DEVELOPMENT_ONLY`, `APPROVED`, `PRODUCTION_ELIGIBLE`, or `SUPERSEDED_ARCHIVE` for any **new or pilot** asset, and make every competing legacy tracker (`studio-state.json`, `unit202-canonical-visual-registry.json`, `CANONICAL_ASSET_LOCK`, and the documented-but-missing `unit202-artwork-manifest.json`) structurally unable to independently authorize a new asset going forward. The pilot cannot meaningfully prove the new visual pipeline if multiple live systems can independently make that decision. Separately and independently, close the release-identity duplication (`course-definitions.ts` vs `content-releases.ts`) that has already once caused a real near-incident.

**Root-cause findings addressed**: `DUPLICATE-SOURCE-OF-TRUTH-REGISTER.md` DUP-1/DUP-2.

### Part A — canonical production-eligibility authority (**PILOT-BLOCKING**)

**Expected files/layers**: `packages/content-schema/src/visual-governance.ts`'s `ProductionVisualAsset.eligibility` as the one canonical authority; a mechanism (code path/process, not just a document) ensuring only this authority can mark a **new or pilot** asset `PRODUCTION_ELIGIBLE` — e.g. runtime asset resolution (`DiagramRenderer.tsx`/`CANONICAL_ASSET_LOCK`) refuses to source a newly-added asset unless a corresponding `ProductionVisualAsset` record exists and states `PRODUCTION_ELIGIBLE`.

**Dependencies**: depends on Packages 3 and 4 (needs a `VisualRequirement` and, where reference governance applies, an approved `ReferenceDossier` to attach `ProductionVisualAsset` to).

**Project Architect review required**: **Yes** — this is the visual-authority consolidation decision itself.

**Acceptance criteria**: a mechanical check/test proves that a new visual asset cannot become runtime-resolvable/`PRODUCTION_ELIGIBLE` through any path except the one canonical authority (e.g. attempting to wire a new diagram via the legacy ad hoc registries alone, without a real `ProductionVisualAsset` record, fails).

**Timing**: **PILOT-BLOCKING** — must exist and be enforced before the V1 pilot's own asset(s) can be considered to have gone through the real production-eligibility path.

### Part B — historical migration/cleanup (**DEFERABLE**)

**Expected files/layers**: reconcile/retire the legacy trackers' entries for the **existing 53** already-produced Unit 202 assets into the Part-A authority (or clearly mark them derived/historical/archive).

**Dependencies**: depends on Part A being decided and built first.

**Project Architect review required**: follows the same authority decision as Part A; execution-only for the historical entries themselves.

**Acceptance criteria**: one documented authority for visual eligibility across the full existing 53-asset corpus, with every other tracker either removed or clearly marked derived/historical.

**Timing**: **can wait for the Unit 202 systematic rebuild**, bundled with Package 6/13.

### Part C — release-ID drift (independent, mechanical)

**Expected files/layers**: `packages/diagnostic-engine/src/course-definitions.ts` should derive its `contentRelease` from `MOBILE_BUNDLED_RELEASE_ID` directly, or a test should assert they match.

**Dependencies**: none — fully independent of Parts A/B.

**Project Architect review required**: No.

**Acceptance criteria**: `course-definitions.ts` and `content-releases.ts` cannot silently drift (either a shared constant or a passing regression test that would fail if they diverged).

**Timing**: **PILOT-BLOCKING** (cheap, prevents a recurrence of an already-real near-incident) — but entirely independent of Parts A/B and can be done first.

---

## Package 6 — Qualify, and where appropriate integrate, reusable legacy visual assets

*(Corrected by CC-13B.2 — renumbered/reframed from the original CC-13B Package 4. These assets are candidate reusable legacy assets, not automatically current production-eligible assets.)*

**Objective**: the 6 REQUIRED physical-component images (and several other REQUIRED assets) that are already produced and passed QA under the **old** system are valuable, reusable work — **do not discard them, and do not assume they need regeneration.** But their old QA-`PASS` status alone must not authorize integration into learner runtime. Before any such legacy asset is newly integrated, it must be **qualified** through the current production authority established by Packages 3-5, establishing: a current `VisualRequirement` mapping; current reference-governance compliance where required (Package 4); current design-system applicability/version; technical QA status; pedagogical QA status; design QA status; Product Owner approval; a current `PRODUCTION_ELIGIBLE` state (Package 5 Part A); and a canonical runtime asset identity. Existing old-system artefacts/QA evidence may satisfy some of these requirements after review and may be imported as supporting evidence — reuse the underlying work, but do not skip the qualification gate.

**Root-cause findings addressed**: `VISUAL-GOVERNANCE-AND-COVERAGE-REGISTER.md` §3, `REPRESENTATIVE-FAILURE-ROOT-CAUSE-TRACE.md` #3.

**Expected files/layers**: `apps/mobile/src/assets/instructional/unit202/physical-components/` (populated only after qualification, not automatically), `apps/mobile/src/components/diagrams/DiagramRenderer.tsx` (extended only for qualified assets, via the Package 5 Part-A authority), relevant lesson steps' `representation.diagramBlueprintId`/`visualAidBlueprintId`.

**Dependencies**: **hard dependency on Packages 3, 4 and 5** — there is no current authority to qualify a legacy asset against until those exist.

**Project Architect review required**: **Yes** — qualifying each candidate legacy asset against the current authority (technical/pedagogical/design QA + reference-governance compliance + approval) is itself a Project Architect review, even though the underlying visual work already exists.

**Acceptance criteria**: each REQUIRED legacy asset that is integrated has a real `VisualRequirement` mapping, passes current reference-governance compliance where required, has a recorded design-system version, has technical/pedagogical/design QA status recorded, has Product Owner approval, and a real `PRODUCTION_ELIGIBLE` `ProductionVisualAsset` record — before `DiagramRenderer.tsx`/`CANONICAL_ASSET_LOCK` is extended to reference it.

**Timing**: **not itself required for the V1 pilot**, unless the pilot deliberately chooses to reuse a specific legacy asset for the representative pilot lesson — in which case that one asset must be qualified through Packages 3-5's mechanism as part of proving that mechanism works end-to-end. For systematic Unit 202 re-authoring (Package 13), **every** reused legacy asset must pass this qualification before reuse.

---

## Package 7 — Implement submitted-assessment provenance (the formative/mock assessment feature itself)

**Objective**: build the actual V1 adaptive-loop trigger — a real formative/mock assessment attempt experience with an enforced `COMPLETED_AND_SUBMITTED` boundary, using the already-real `FormativeAssessmentInstance`/`SubmittedAssessmentResult`/`buildSubmittedAssessmentResult()` pure functions as the foundation.

**Root-cause findings addressed**: `ASSESSMENT-SUBMISSION-INTEGRITY-REGISTER.md`, `REPRESENTATIVE-FAILURE-ROOT-CAUSE-TRACE.md` #9.

**Expected files/layers**: new mobile screens/routes (assessment attempt UI, result screen), a persistence layer providing durable assessment-attempt/submission persistence consistent with the platform's governed persistence/sync architecture (no such layer currently exists anywhere in this repo for this feature; the exact backend/technology is an explicit architecture decision for this package to make during implementation, after tracing the existing storage/sync path — e.g. how `evidence-sync.ts` persists and syncs today — not a decision this audit makes), question-selection/generation wiring against `v1PedagogicalRole: "FORMATIVE_MOCK"` blueprints (0 currently exist — this package likely needs at least a handful of real formative blueprints authored/tagged as a starting point), `packages/content-schema/src/assessment-instance.ts` (already built).

**Dependencies**: benefits from Package 8 (Guided Revision) being designed in parallel, since they share the same submission-boundary contract; requires at least a small set of real `FORMATIVE_MOCK`-tagged question content to exist before it can be meaningfully tested end-to-end (this may be the pilot's own content, per the pilot sequence).

**Project Architect review required**: **Yes** — this is a genuinely new, significant feature build, the largest single package in this plan.

**Acceptance criteria**: a learner can start, suspend/resume, complete, and explicitly submit a formative assessment; `IN_PROGRESS`/`SUSPENDED`/`COMPLETED_AWAITING_SUBMISSION` states are provably side-effect-free with respect to any downstream plan; `SUBMITTED` is the only state that can produce a `SubmittedAssessmentResult`; this matches ADR-0006's runtime invariants (`V1-LEARNING-ASSESSMENT-AND-GUIDED-REVISION-ARCHITECTURE.md` §13) exactly.

**Timing**: **required before the V1 pilot can complete its own defined sequence** (`LEARNING-PACKAGE-PIPELINE-AUDIT-AND-QUALIFICATION-PLAN.md` §7, steps 16-25 all depend on this existing). This is the critical path for declaring the pilot done.

---

## Package 8 — Wire deterministic Guided Revision

**Objective**: connect the already-real, already-well-tested `buildGuidedRevisionPlan()`/`selectLatestSubmittedResultInScope()` pure functions to a real submitted-assessment source (Package 7), real persistence, and a real learner-facing UI.

**Root-cause findings addressed**: `GUIDED-REVISION-INTEGRITY-REGISTER.md`, `REPRESENTATIVE-FAILURE-ROOT-CAUSE-TRACE.md` #9.

**Expected files/layers**: new mobile screen (Guided Revision plan view, linking to the same canonical `lesson-player.tsx` used by ordinary Learn), persistence for `GuidedRevisionPlan` (same pattern decision as Package 7), a trigger point that calls `buildGuidedRevisionPlan()` exactly once per real `SUBMITTED` event.

**Dependencies**: **hard dependency on Package 7** — there is no submitted-assessment source to build a plan from until it exists.

**Project Architect review required**: **Yes** — UI/UX for the plan view, and confirming the "exactly one deterministic rebuild per submission" invariant is correctly enforced at the trigger point (not merely by the pure function's own determinism).

**Acceptance criteria**: matches `LEARNING-PACKAGE-QUALITY-GATES.md` §10 exactly — incomplete/unsubmitted assessments never alter the current plan; a submitted assessment triggers exactly one rebuild; the plan links to real canonical lessons; a later submission replaces the plan; completing a revision lesson does not itself alter the ranking.

**Timing**: **required before the V1 pilot can complete its own defined sequence** (same pilot steps as Package 7).

---

## Package 9 — Wire learner-ready gates into release eligibility

*(Dependencies corrected by CC-13B.2 — a real `VISUAL`/`PRODUCT_OWNER` gate cannot be meaningful while reference authority and production eligibility remain parallel or ambiguous, so this package now explicitly depends on Packages 4 and 5 as well.)*

**Objective**: make `isPublicationReady()` a real, CI-enforced release gate rather than an uncalled function, producing real `LearningPackageGateResult` records for each lesson/package.

**Root-cause findings addressed**: `MISSING-OR-INACTIVE-VALIDATORS.md`, `GUIDED-REVISION-INTEGRITY-REGISTER.md` §3.

**Expected files/layers**: a new validator/report script analogous to `validate-v1-learning-package.ts` that produces real `LearningPackageGateResult` records per gate (`CURRICULUM`/`PEDAGOGY`/`ASSESSMENT_INTEGRITY`/`VISUAL`/`LEARNER_PRESENTATION`/`RUNTIME`/`FORMATIVE_ASSESSMENT`/`GUIDED_REVISION`/`PRODUCT_OWNER`) from the real signals this audit's other packages produce, and a `package.json` script + CI wiring that calls `isPublicationReady()` against them.

**Dependencies**: for the pilot path, meaningfully depends on Package 2 (rich teaching-content mechanism), Package 3 (visual opportunity/requirement mechanism), Package 4 (reference-dossier authority), the pilot-blocking portion of Package 5 (canonical production-eligibility authority), Package 7 (formative assessment) and Package 8 (Guided Revision) existing first — otherwise most gates have nothing real to report against, repeating the "vacuous pass" risk flagged in `MISMATCH-REGISTER.md` MM-4. It does **not** need Package 6's full legacy-asset qualification, or Package 5 Part B's historical migration, unless the representative pilot lesson itself reuses a legacy asset — it does need the pilot's own asset(s) to have travelled through the real Package 4/5 authority path.

**Project Architect review required**: **Yes** — deciding which gates are mandatory-vs-waivable for the pilot vs. for full Unit 202 release is a governance decision.

**Acceptance criteria**: a real lesson can be mechanically shown to be `LEARNER_READY` or not, with evidence, not merely "runtime-qualified."

**Timing**: the mechanism itself — **before the V1 pilot's final steps** (the pilot sequence's own step 18, "run all learning-package quality gates," requires this). Applying it retroactively across all 24 existing Unit 202 lessons **can wait for the systematic rebuild**.

---

## Package 10 — Remove the redundant authored `exit_completion` step (duplicate of the terminal completion screen) from the remaining 23 lessons

*(Renumbered from the original CC-13B Package 2; title and description corrected by CC-13B.1 — see `LESSON-DEPTH-AND-FRAGMENTATION-REGISTER.md` §4 for the precise finding. The redundancy is specifically between the authored `exit_completion` step and the terminal `LessonCompletionView`, both of which render `lesson.completionCriteria.exitSummary` verbatim identically. The preceding `recap` step is a distinct pedagogical step with different resolved text and is not itself part of this fix's scope.)*

**Objective**: generalise CC-12G's own fix (removing the redundant `exit_completion` step) from the one lesson it was applied to, to the other 23 real lessons that still exhibit the identical, already-root-caused defect.

**Root-cause findings addressed**: `LESSON-DEPTH-AND-FRAGMENTATION-REGISTER.md` §4, `REPRESENTATIVE-FAILURE-ROOT-CAUSE-TRACE.md` #5.

**Expected files/layers**: 23 of the 24 real `scripts/content/data/lesson-*.ts` files (`steps` array + `completionCriteria.requiredStepIds`), regenerate `mobile-content-projection.ts` via `npm run content:mobile:generate`.

**Dependencies**: none.

**Project Architect review required**: No — the fix pattern is already established and approved (CC-12G); this is mechanical replication of a decision already made once, not a new one. A Product Owner spot-check of a couple of regenerated lessons on-device is still worthwhile before merging.

**Acceptance criteria**: 0/24 lessons show a consecutive `recap → exit_completion` pair (re-run `scripts/audit/lesson-structure-audit-supplement.ts`'s `consecutiveRecapOrCompletionPairs` check); `content:mobile:check` passes; a manual on-device walk of 2-3 regenerated lessons confirms only one "Lesson complete" screen appears.

**Timing**: **can wait until the Unit 202 systematic rebuild**, but is cheap enough (mechanical, already-approved pattern) that doing it now, independently of the rebuild, is low-risk and immediately improves the live product. Recommend doing it now. This package does not block the V1 pilot.

---

## Package 11 — Separate V1 canonical route from retained adaptive engines (documentation/labelling only)

*(Renumbered from the original CC-13B Package 10.)*

**Objective**: ensure the 4 known branching lessons (and any future retained-adaptive-engine content) remain clearly and mechanically distinguishable from V1 canonical-route content, closing the minor documentation-accuracy gap found in this audit (MM-1) and reinforcing Package 1's schema fix with clear authoring guidance.

**Root-cause findings addressed**: `V1-ROUTE-DRIFT-REGISTER.md` §4/§6, `MISMATCH-REGISTER.md` MM-1.

**Expected files/layers**: `PROJECT-STATUS.md` (correct the MM-1 sentence), a short authoring-guidance note (likely in `LESSON-PLAYER-AND-LESSON-PLAN-ARCHITECTURE.md`, already partially covers this) making explicit that a lesson is either `routePolicy: "CANONICAL_FIXED_ROUTE"` (no `branchRoutes` anywhere, enforced by Package 1) or a retained-adaptive-engine lesson (no `routePolicy` declared) — never ambiguous.

**Dependencies**: benefits from following Package 1 so the guidance can point at a real, complete enforcement mechanism.

**Project Architect review required**: No.

**Acceptance criteria**: PROJECT-STATUS.md's claim about `select-next-activity.ts` accurately describes its content; authoring guidance makes the two categories unambiguous.

**Timing**: **can wait until the Unit 202 systematic rebuild**, low priority/low risk.

---

## Package 12 — Remove learner-facing debug leakage by class (defense-in-depth generalisation)

*(Renumbered from the original CC-13B Package 11.)*

**Objective**: generalise the single confirmed-inert-but-real debug-overlay instance (`lesson-player.tsx`'s dev debug badge) into a repo-wide guarantee — e.g. a lint rule or a test sweep — that no `__DEV__`-gated learner-visible string can exist without an equivalent regression test proving it fails closed.

**Root-cause findings addressed**: `REPRESENTATIVE-FAILURE-ROOT-CAUSE-TRACE.md` #4.

**Expected files/layers**: possibly a new ESLint rule or a repo-wide test sweep pattern; `docs/product/MOBILE-UX-ENGINEERING-STANDARD.md` already documents the underlying principle (per CC-13A's integration matrix work) — this package is about mechanising it, not re-documenting it.

**Dependencies**: none.

**Project Architect review required**: No — this is a tooling/testing-discipline improvement, not a design decision.

**Acceptance criteria**: a mechanical check (lint or test) exists that would catch a future unguarded debug string before merge, not just the one instance already found and pinned.

**Timing**: **can wait until the Unit 202 systematic rebuild**, low priority — the one known instance is already safely gated and tested.

---

## Package 13 — Rebuild Unit 202 through the corrected pipeline (the terminal package)

*(Renumbered from the original CC-13B Package 12.)*

**Objective**: once Packages 1-9 (at minimum) are complete and the end-to-end V1 pilot (per `LEARNING-PACKAGE-PIPELINE-AUDIT-AND-QUALIFICATION-PLAN.md` §7) has passed Product Owner review, systematically re-author the full 24-lesson Unit 202 corpus through the now-corrected pipeline: real `LessonStoryboard` review, real rich-teaching-content authoring (Package 2), real `VisualOpportunityAnalysis`/VRR per lesson, real reference dossiers, real `routePolicy`/`semanticUnit`/`textOnlyJustification`/`mayRevealTargetAnswer` adoption, a real Unit 202 formative/mock assessment with real `assessmentMappingIds`/`revisionLessonIds`, and real `LearningPackageGateResult` records driving `LEARNER_READY` status.

**Root-cause findings addressed**: closes essentially every remaining 0%-adoption row in `CONTRACT-ADOPTION-MATRIX.md`, and directly resolves `REPRESENTATIVE-FAILURE-ROOT-CAUSE-TRACE.md` #2 (telephone-socket proportionality) and #8 (zero-visual-coverage lessons) through genuine content review rather than mechanical patching.

**Expected files/layers**: all 24 `scripts/content/data/lesson-*.ts` files, likely new/extended visual assets, a real Unit 202 formative assessment content set, full re-run of every validator/gate.

**Dependencies**: **hard dependency on the V1 pilot passing** (`LEARNING-PACKAGE-PIPELINE-AUDIT-AND-QUALIFICATION-PLAN.md` §9: "Only after the pilot passes should ALP... re-author/refactor Unit 202 systematically through the new pipeline"). This audit explicitly does not authorise starting this package.

**Project Architect review required**: **Yes, extensively** — this is the core, large-scale content-quality work the whole architecture reset was commissioned to enable.

**Acceptance criteria**: per `LEARNING-PACKAGE-PIPELINE-AUDIT-AND-QUALIFICATION-PLAN.md` §8 in full.

**Timing**: **strictly after the V1 pilot passes.** Not before.

---

## Recommended sequencing summary

*(Table corrected by CC-13B.2 to reflect the dependency-correct visual-governance order — Packages 3-6 titles/blocking status changed; Package 9's blocking status now explicitly reflects its Package 4/5 dependency.)*

| Order | Package | Blocks pilot? | Project Architect review? |
|---|---|---|---|
| 1 | Close `branchRoutes` gap | Yes | No |
| 2 | Extend teaching-content model for rich scrollable teaching | Yes | Yes |
| 3 | Make visual planning mandatory | Yes (mechanism) | Yes |
| 4 | Formalise reference authority as real `ReferenceDossier` records | Yes (mechanism; full historical migration deferable) | Yes |
| 5 | Canonical production-eligibility authority (Part A) + release-ID fix (Part C); historical cleanup (Part B) deferable | Yes (Parts A & C); No (Part B) | Yes (Part A); No (Parts B/C) |
| 6 | Qualify/integrate reusable legacy visual assets | No, unless the pilot reuses a specific legacy asset | Yes |
| 7 | Implement formative assessment | Yes | Yes |
| 8 | Wire Guided Revision | Yes (depends on 7) | Yes |
| 9 | Wire publication gates | Yes (mechanism; depends on 2, 3, 4, 5-A, 7, 8) | Yes |
| 10 | Remove redundant `exit_completion` step (23 lessons) | No (independent, low-risk, do anytime) | No |
| 11 | V1/adaptive-engine labelling cleanup | No | No |
| 12 | Debug-leakage defense-in-depth | No | No |
| 13 | Rebuild Unit 202 | N/A — comes after the pilot | Yes, extensively |

**Pilot prerequisites, restated**: Packages 1, 2, 3, 4, the Part-A/Part-C portion of 5, 7, 8 and 9 are pilot prerequisites. Package 6 is not generally pilot-blocking unless the pilot deliberately reuses a legacy asset. Packages 10-12 are non-blocking cleanup. Package 13 remains strictly gated on successful end-to-end pilot qualification.

**This audit's own recommendation, consistent with its constraints, stops here.** No package above should begin without Product Owner / Project Architect review of this plan first.
