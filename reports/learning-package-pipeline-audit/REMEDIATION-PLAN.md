# Remediation Plan (CC-13B)

**This is a plan only.** No remediation work has begun. Every package below requires Product Owner / Project Architect review and sequencing decisions before any implementation starts, per this audit's own constraints. Packages are grouped by root cause, in a recommended dependency order — later packages depend on earlier ones being at least decided, if not complete.

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

## Package 2 — Fix the 23-lesson duplicate recap/completion defect

**Objective**: generalise CC-12G's own fix (removing the redundant `exit_completion` step) from the one lesson it was applied to, to the other 23 real lessons that still exhibit the identical, already-root-caused defect.

**Root-cause findings addressed**: `LESSON-DEPTH-AND-FRAGMENTATION-REGISTER.md` §4, `REPRESENTATIVE-FAILURE-ROOT-CAUSE-TRACE.md` #5.

**Expected files/layers**: 23 of the 24 real `scripts/content/data/lesson-*.ts` files (`steps` array + `completionCriteria.requiredStepIds`), regenerate `mobile-content-projection.ts` via `npm run content:mobile:generate`.

**Dependencies**: none.

**Project Architect review required**: No — the fix pattern is already established and approved (CC-12G); this is mechanical replication of a decision already made once, not a new one. A Product Owner spot-check of a couple of regenerated lessons on-device is still worthwhile before merging.

**Acceptance criteria**: 0/24 lessons show a consecutive `recap → exit_completion` pair (re-run `scripts/audit/lesson-structure-audit-supplement.ts`'s `consecutiveRecapOrCompletionPairs` check); `content:mobile:check` passes; a manual on-device walk of 2-3 regenerated lessons confirms only one "Lesson complete" screen appears.

**Timing**: **can wait until the Unit 202 systematic rebuild**, but is cheap enough (mechanical, already-approved pattern) that doing it now, independently of the rebuild, is low-risk and immediately improves the live product. Recommend doing it now.

---

## Package 3 — Make storyboard/visual planning mandatory (wire the VRR/VOA layer to real production)

**Objective**: reconcile the two disconnected visual-catalogue systems (the operative-but-non-conformant old pipeline and the conformant-but-empty new schema) into one, and make a real `VisualOpportunityAnalysis` + `VisualRequirement` a mandatory upstream artefact for any lesson before visual production begins.

**Root-cause findings addressed**: `VISUAL-GOVERNANCE-AND-COVERAGE-REGISTER.md` §1, `REFERENCE-AUTHORITY-REGISTER.md`, `REPRESENTATIVE-FAILURE-ROOT-CAUSE-TRACE.md` #8/#10, `SOURCE-OF-TRUTH-MAP.md` category d/e.

**Expected files/layers**: `packages/content-schema/src/visual-governance.ts` (already built, needs real instances), a new authoring workflow/tool to populate `VisualOpportunityAnalysis`/`VisualRequirement`/`ReferenceDossier` objects (either migrating `tools/visual-production-studio/catalogue.ts`'s real data into the new shape, or building new tooling around the new shape and retiring the old), `scripts/content/validate-v1-learning-package.ts`'s `validateVisualGovernance()` (wire into the CLI entry point once real data exists to check).

**Dependencies**: this is a genuine architectural reconciliation decision, not a mechanical fix — requires a Project Architect decision on migration approach (migrate the 53 existing catalogued assets into the new schema vs. re-plan from scratch against a genuinely re-authored Unit 202).

**Project Architect review required**: **Yes** — this is exactly the kind of "major visual-family direction" decision `INSTRUCTIONAL-VISUAL-PLANNING-REFERENCE-AND-PRODUCTION-ARCHITECTURE.md` §2.3 reserves for the Product Owner, with Project Architect execution.

**Acceptance criteria**: every lesson entering/re-entering the pipeline has a real `VisualOpportunityAnalysis`; every REQUIRED visual need has a real `VisualRequirement`; `validateVisualGovernance()` runs against real data in CI and can fail; the contract-adoption matrix's visual-governance rows move off 0%.

**Timing**: **before the V1 pilot** for the mechanism/workflow itself (the pilot's own sequence, `LEARNING-PACKAGE-PIPELINE-AUDIT-AND-QUALIFICATION-PLAN.md` §7, explicitly requires this chain to be exercised end-to-end); the full migration of all 53 existing Unit 202 assets **can wait until the systematic Unit 202 rebuild**.

---

## Package 4 — Integrate already-produced, QA-passed visual assets that never shipped

**Objective**: close the cheapest, lowest-risk gap found in this audit — 6 REQUIRED physical-component images (and several other REQUIRED assets) are already produced and QA-`PASS` but were never copied into the shipped asset folder or wired into `DiagramRenderer.tsx`/lesson steps.

**Root-cause findings addressed**: `VISUAL-GOVERNANCE-AND-COVERAGE-REGISTER.md` §3, `REPRESENTATIVE-FAILURE-ROOT-CAUSE-TRACE.md` #3.

**Expected files/layers**: `apps/mobile/src/assets/instructional/unit202/physical-components/` (populate from the existing produced files), `apps/mobile/src/components/diagrams/DiagramRenderer.tsx` (add `require()` entries + extend `CANONICAL_ASSET_LOCK`), relevant lesson steps' `representation.diagramBlueprintId`/`visualAidBlueprintId` (wire the 3 built-but-unwired deterministic diagram renderers too, where a Project Architect confirms the target lesson).

**Dependencies**: a Project Architect should re-confirm the existing QA-PASS status is still trusted (these images were audited under the old system) before shipping — a lightweight confirmation, not new production work.

**Project Architect review required**: **Yes, but lightweight** (confirm existing QA holds; does not require new visual planning).

**Acceptance criteria**: `apps/mobile/src/assets/instructional/unit202/physical-components/` is no longer empty; the 6 REQUIRED component-recognition lessons show both symbol and physical-recognition imagery; `CANONICAL_ASSET_LOCK` count grows accordingly with matching hash verification.

**Timing**: **can proceed independently of the pilot, at any time** — this is integration of already-complete work, lowest risk in this plan.

---

## Package 5 — Formalise reference authority as real `ReferenceDossier` records

**Objective**: express the already-sound (human-attributed, dated) reference-handover discipline currently living in `reference-corrections.ts` as real, schema-validated `ReferenceDossier` objects, closing the latent bypass risk (BP-3) of a future entry skipping the discipline.

**Root-cause findings addressed**: `REFERENCE-AUTHORITY-REGISTER.md`, `BYPASS-PATH-REGISTER.md` BP-3.

**Expected files/layers**: `tools/visual-production-studio/reference-corrections.ts` (migrate ~45 entries into `ReferenceDossier` shape, or build a thin adapter), `packages/content-schema/src/visual-governance.ts` (already has the schema).

**Dependencies**: benefits from being sequenced alongside Package 3 (same underlying data).

**Project Architect review required**: No for the migration mechanics; the underlying reference approvals themselves were already Project-Architect/Product-Owner-equivalent (the 2026-08-24 handover) and do not need re-approval, only re-expression.

**Acceptance criteria**: every real reference in production use has a corresponding `ReferenceDossier` object with `reviewedBy: "PROJECT_ARCHITECT"`; a schema validator rejects any future reference addition that doesn't follow the same shape.

**Timing**: **can wait until the Unit 202 systematic rebuild**, but should be done before any *new* visual production begins on new content, to avoid growing the old ad hoc table further.

---

## Package 6 — Consolidate duplicate visual-eligibility and release-identity sources of truth

**Objective**: eliminate the confirmed duplicate-source-of-truth risks — the 3+ disconnected visual-asset-status trackers (DUP-1) and the `course-definitions.ts`/`content-releases.ts` release-id drift risk (DUP-2, which already caused a real near-incident).

**Root-cause findings addressed**: `DUPLICATE-SOURCE-OF-TRUTH-REGISTER.md` DUP-1/DUP-2.

**Expected files/layers**: DUP-1 — reconcile `unit202-artwork-manifest.json` (missing), `studio-state.json`, `unit202-canonical-visual-registry.json`, and `CANONICAL_ASSET_LOCK` into one authority (likely `ProductionVisualAsset.eligibility`, once Package 3 lands). DUP-2 — `packages/diagnostic-engine/src/course-definitions.ts` should derive its `contentRelease` from `MOBILE_BUNDLED_RELEASE_ID` directly, or a test should assert they match.

**Dependencies**: DUP-1 depends on Package 3's schema decision; DUP-2 is fully independent and simple.

**Project Architect review required**: DUP-1 yes (part of the same visual-authority consolidation decision as Package 3); DUP-2 no.

**Acceptance criteria**: DUP-1 — one documented authority for visual eligibility, all others either removed or clearly marked derived/historical. DUP-2 — `course-definitions.ts` and `content-releases.ts` cannot silently drift (either shared constant or a passing regression test that would fail if they diverged).

**Timing**: DUP-2 — **before the V1 pilot** (cheap, prevents a recurrence of an already-real near-incident). DUP-1 — **can wait for the Unit 202 rebuild**, bundled with Package 3.

---

## Package 7 — Implement submitted-assessment provenance (the formative/mock assessment feature itself)

**Objective**: build the actual V1 adaptive-loop trigger — a real formative/mock assessment attempt experience with an enforced `COMPLETED_AND_SUBMITTED` boundary, using the already-real `FormativeAssessmentInstance`/`SubmittedAssessmentResult`/`buildSubmittedAssessmentResult()` pure functions as the foundation.

**Root-cause findings addressed**: `ASSESSMENT-SUBMISSION-INTEGRITY-REGISTER.md`, `REPRESENTATIVE-FAILURE-ROOT-CAUSE-TRACE.md` #9.

**Expected files/layers**: new mobile screens/routes (assessment attempt UI, result screen), a persistence layer (none currently exists anywhere in this repo — this package likely needs to establish the pattern, e.g. a Supabase table + sync mechanism analogous to `evidence-sync.ts`), question-selection/generation wiring against `v1PedagogicalRole: "FORMATIVE_MOCK"` blueprints (0 currently exist — this package likely needs at least a handful of real formative blueprints authored/tagged as a starting point), `packages/content-schema/src/assessment-instance.ts` (already built).

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

**Objective**: make `isPublicationReady()` a real, CI-enforced release gate rather than an uncalled function, producing real `LearningPackageGateResult` records for each lesson/package.

**Root-cause findings addressed**: `MISSING-OR-INACTIVE-VALIDATORS.md`, `GUIDED-REVISION-INTEGRITY-REGISTER.md` §3.

**Expected files/layers**: a new validator/report script analogous to `validate-v1-learning-package.ts` that produces real `LearningPackageGateResult` records per gate (`CURRICULUM`/`PEDAGOGY`/`ASSESSMENT_INTEGRITY`/`VISUAL`/`LEARNER_PRESENTATION`/`RUNTIME`/`FORMATIVE_ASSESSMENT`/`GUIDED_REVISION`/`PRODUCT_OWNER`) from the real signals this audit's other packages produce, and a `package.json` script + CI wiring that calls `isPublicationReady()` against them.

**Dependencies**: meaningfully depends on Packages 3, 7, 8 existing first (otherwise most gates have nothing real to report against, repeating the "vacuous pass" risk flagged in `MISMATCH-REGISTER.md` MM-4).

**Project Architect review required**: **Yes** — deciding which gates are mandatory-vs-waivable for the pilot vs. for full Unit 202 release is a governance decision.

**Acceptance criteria**: a real lesson can be mechanically shown to be `LEARNER_READY` or not, with evidence, not merely "runtime-qualified."

**Timing**: the mechanism itself — **before the V1 pilot's final steps** (the pilot sequence's own step 18, "run all learning-package quality gates," requires this). Applying it retroactively across all 24 existing Unit 202 lessons **can wait for the systematic rebuild**.

---

## Package 10 — Separate V1 canonical route from retained adaptive engines (documentation/labelling only)

**Objective**: ensure the 4 known branching lessons (and any future retained-adaptive-engine content) remain clearly and mechanically distinguishable from V1 canonical-route content, closing the minor documentation-accuracy gap found in this audit (MM-1) and reinforcing Package 1's schema fix with clear authoring guidance.

**Root-cause findings addressed**: `V1-ROUTE-DRIFT-REGISTER.md` §4/§6, `MISMATCH-REGISTER.md` MM-1.

**Expected files/layers**: `PROJECT-STATUS.md` (correct the MM-1 sentence), a short authoring-guidance note (likely in `LESSON-PLAYER-AND-LESSON-PLAN-ARCHITECTURE.md`, already partially covers this) making explicit that a lesson is either `routePolicy: "CANONICAL_FIXED_ROUTE"` (no `branchRoutes` anywhere, enforced by Package 1) or a retained-adaptive-engine lesson (no `routePolicy` declared) — never ambiguous.

**Dependencies**: benefits from following Package 1 so the guidance can point at a real, complete enforcement mechanism.

**Project Architect review required**: No.

**Acceptance criteria**: PROJECT-STATUS.md's claim about `select-next-activity.ts` accurately describes its content; authoring guidance makes the two categories unambiguous.

**Timing**: **can wait until the Unit 202 systematic rebuild**, low priority/low risk.

---

## Package 11 — Remove learner-facing debug leakage by class (defense-in-depth generalisation)

**Objective**: generalise the single confirmed-inert-but-real debug-overlay instance (`lesson-player.tsx`'s dev debug badge) into a repo-wide guarantee — e.g. a lint rule or a test sweep — that no `__DEV__`-gated learner-visible string can exist without an equivalent regression test proving it fails closed.

**Root-cause findings addressed**: `REPRESENTATIVE-FAILURE-ROOT-CAUSE-TRACE.md` #4.

**Expected files/layers**: possibly a new ESLint rule or a repo-wide test sweep pattern; `docs/product/MOBILE-UX-ENGINEERING-STANDARD.md` already documents the underlying principle (per CC-13A's integration matrix work) — this package is about mechanising it, not re-documenting it.

**Dependencies**: none.

**Project Architect review required**: No — this is a tooling/testing-discipline improvement, not a design decision.

**Acceptance criteria**: a mechanical check (lint or test) exists that would catch a future unguarded debug string before merge, not just the one instance already found and pinned.

**Timing**: **can wait until the Unit 202 systematic rebuild**, low priority — the one known instance is already safely gated and tested.

---

## Package 12 — Rebuild Unit 202 through the corrected pipeline (the terminal package)

**Objective**: once Packages 1-9 (at minimum) are complete and the end-to-end V1 pilot (per `LEARNING-PACKAGE-PIPELINE-AUDIT-AND-QUALIFICATION-PLAN.md` §7) has passed Product Owner review, systematically re-author the full 24-lesson Unit 202 corpus through the now-corrected pipeline: real `LessonStoryboard` review, real `VisualOpportunityAnalysis`/VRR per lesson, real reference dossiers, real `routePolicy`/`semanticUnit`/`textOnlyJustification`/`mayRevealTargetAnswer` adoption, a real Unit 202 formative/mock assessment with real `assessmentMappingIds`/`revisionLessonIds`, and real `LearningPackageGateResult` records driving `LEARNER_READY` status.

**Root-cause findings addressed**: closes essentially every remaining 0%-adoption row in `CONTRACT-ADOPTION-MATRIX.md`, and directly resolves `REPRESENTATIVE-FAILURE-ROOT-CAUSE-TRACE.md` #2 (telephone-socket proportionality) and #8 (zero-visual-coverage lessons) through genuine content review rather than mechanical patching.

**Expected files/layers**: all 24 `scripts/content/data/lesson-*.ts` files, likely new/extended visual assets, a real Unit 202 formative assessment content set, full re-run of every validator/gate.

**Dependencies**: **hard dependency on the V1 pilot passing** (`LEARNING-PACKAGE-PIPELINE-AUDIT-AND-QUALIFICATION-PLAN.md` §9: "Only after the pilot passes should ALP... re-author/refactor Unit 202 systematically through the new pipeline"). This audit explicitly does not authorise starting this package.

**Project Architect review required**: **Yes, extensively** — this is the core, large-scale content-quality work the whole architecture reset was commissioned to enable.

**Acceptance criteria**: per `LEARNING-PACKAGE-PIPELINE-AUDIT-AND-QUALIFICATION-PLAN.md` §8 in full.

**Timing**: **strictly after the V1 pilot passes.** Not before.

---

## Recommended sequencing summary

| Order | Package | Blocks pilot? | Project Architect review? |
|---|---|---|---|
| 1 | Close `branchRoutes` gap | Yes | No |
| 2 | Fix 23-lesson duplicate completion | No (independent, low-risk, do anytime) | No |
| 3 | Make visual planning mandatory | Yes (mechanism) | Yes |
| 4 | Integrate already-produced visual assets | No (independent, low-risk) | Yes (lightweight) |
| 5 | Formalise reference authority | No | No |
| 6 | Consolidate duplicate sources of truth | Partial (DUP-2 yes, DUP-1 no) | Partial (DUP-1 yes) |
| 7 | Implement formative assessment | Yes | Yes |
| 8 | Wire Guided Revision | Yes (depends on 7) | Yes |
| 9 | Wire publication gates | Yes (mechanism) | Yes |
| 10 | V1/adaptive-engine labelling cleanup | No | No |
| 11 | Debug-leakage defense-in-depth | No | No |
| 12 | Rebuild Unit 202 | N/A — comes after the pilot | Yes, extensively |

**This audit's own recommendation, consistent with its constraints, stops here.** No package above should begin without Product Owner / Project Architect review of this plan first.
