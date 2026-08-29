# CC-13B — Whole Learning-Package & V1 Pipeline Integrity Audit: Executive Summary

**Status: AUDIT COMPLETE.** This package audited the real repository against the ADR-0005/ADR-0006 architecture and CC-13A's own foundation work. **It did not remediate anything.** No production logic, content, schema, test, visual asset, or governance-doc claim was changed. All 16 required deliverables were produced under `reports/learning-package-pipeline-audit/`.

## Preconditions

Repo root `D:\Development\adaptive-learning-platform`, branch `main`, HEAD `b049fd1fb4ad4f9dca2a35e5b51a08b71d91e48e` == `origin/main`, clean working tree — confirmed at the start of this audit and unchanged except for this audit's own additions.

## What this audit did

Traced the real, current-state pipeline — not the documented aspiration — across curriculum/knowledge/lesson structure, V1 canonical-route protection, visual planning/reference governance/design system, question authoring/embedded checks/formative assessment/Guided Revision/publication gates, and generated-projection/mobile-runtime/source-of-truth duplication. For every claim, this audit read real code/content and, wherever practical, ran real (read-only) validators/tests against the live corpus rather than inferring from documentation alone. Two new, read-only audit scripts were written (`scripts/audit/lesson-structure-audit.ts`, `scripts/audit/lesson-structure-audit-supplement.ts`) to compute real mechanical statistics against the bundled 24-lesson/270-step Unit 202 corpus (`release.unit202.v8`).

## Source-of-truth map headline

See `SOURCE-OF-TRUTH-MAP.md`. Curriculum, lesson-content, question, and Guided-Revision-plan authority are each held by one genuine source with explicit, validator-enforced derivation elsewhere — sound. **Visual-production authority and release/version identity are the two areas where genuine duplication was found**: at least 4 disconnected trackers for visual-asset production-eligibility (one of which — the documented "authoritative" manifest — does not even exist in the repository), and a release-id field independently hardcoded in `course-definitions.ts` that has already once drifted out of sync with the real bundled release, nearly breaking course-recommendation for every learner.

## Contract-adoption headline

**0% adoption, corpus-wide, across every single ADR-0005/ADR-0006/CC-13A governance field, with no exceptions** — 0/24 lessons, 0/270 steps, 0/114 question blueprints, 0 real visual-governance object instances (`VisualOpportunityAnalysis`/`VisualRequirement`/`ReferenceDossier`/`ProductionVisualAsset`), 0 real `FormativeAssessmentInstance`/`GuidedRevisionPlan`/`LearningPackageGateResult` instances anywhere. This precisely confirms — with real, computed numbers rather than an estimate — CC-13A's own stated expectation that this would be a near-zero baseline, since it deliberately did not re-author content. Full detail and per-field counts: `CONTRACT-ADOPTION-MATRIX.md` + `contract-adoption-matrix.json`/`.csv`.

## Findings by severity

Exact enumeration and full evidence live in each per-layer register; approximate roll-up:

- **P0 (architecture-integrity defects): 5** — (1) no schema field exists anywhere for extended, multi-sentence teaching prose, a structural mismatch with the new "rich scrollable teaching" mandate; (2) `CANONICAL_FIXED_ROUTE` lessons can still branch via `branchRoutes` — a real, unenforced schema gap (currently unexploited only because 0 real lessons adopt `routePolicy` at all); (3) two structurally disconnected visual-catalogue systems (an operative-but-non-conformant old pipeline, and a conformant-but-empty new schema); (4) at least 4 disconnected visual-asset-eligibility trackers, one of which is documented-authoritative but does not exist in the repository; (5) the formative-assessment → submit → Guided-Revision loop — V1's entire stated adaptive product promise — does not exist as a runtime feature at all, only as real, well-tested, but completely unreachable pure functions.
- **P1 (blocks class-leading quality): ~13** — including a mechanically-confirmed, already-once-fixed-but-never-generalised defect (23 of 24 real lessons show triple-redundant "lesson complete" messaging); 45.8% of real lessons (11/24) carry zero visual references with no recorded justification; 6+ REQUIRED visual assets already produced and QA-passed but never integrated into the shipped app; no runtime defense-in-depth beyond build-time schema validation; the new `v1-package:report` validator's "PASS" is real but vacuous (nothing has adopted the fields it checks) and risks being misread as proof of readiness; the UK-telephone-socket content the Product Owner flagged is mechanically in-scope (an official, narrow curriculum Range item) with no validator distinguishing "traceable" from "proportionate"; and more — see each register.
- **P2 (cleanup): ~12** — documentation-accuracy corrections, a few self-acknowledged-but-unreconciled duplicate files, dormant/unwired validator functions, and the already-known, now safely-gated debug-overlay history.

## Representative root-cause findings (of the 6 Product-Owner-named + 4 audit-derived, full detail in `REPRESENTATIVE-FAILURE-ROOT-CAUSE-TRACE.md`)

- **Thermistor tested before taught**: NOT reproducible today — already fixed historically, now regression-guarded by a real, passing validator.
- **UK telephone socket off-syllabus**: reproducible, but mechanically in-scope (the awarding body's own AC6.1 Range box lists "Telephones"); the real gap is that no validator distinguishes official-traceability from practical proportionality — a human-judgement gap, not a content-authoring error.
- **Missing component symbol imagery**: reproducible; the deterministic symbol cards are all shipped correctly, but their paired physical-recognition companion photos were produced, QA-passed, and simply never integrated — the cheapest gap in this whole audit to close.
- **Internal debug labels visible**: one real instance exists in the compiled bundle (a debug overlay on the Lesson Player) but is off by default and has a dedicated regression test proving it fails closed for a real learner.
- **Duplicated recap/completion**: reproducible in 23 of 24 real lessons — CC-12G already found and fixed this exact defect once, for exactly one lesson, and explicitly scoped the fix narrowly.
- **Answer-leaking teaching text**: the prevention mechanism (`mayRevealTargetAnswer`) is real and correct but unexercised (0/270 adoption); whether a live leak currently exists anywhere in the corpus was **not** exhaustively verified by this audit and should not be assumed clean.

## Visual/reference-governance conclusions

The pre-CC-13A visual-production pipeline (`tools/visual-production-studio/`) is genuinely need-classified-before-production within its own discipline, and reference selection is confirmed to trace to a real, named, dated external Product Owner handover — **Claude never autonomously selected a technical reference**, confirmed by direct code read of `reference-acquisition.ts`. But none of this runs through the new ADR-0005 `VisualOpportunityAnalysis`/`VRR`/`ReferenceDossier`/`ProductionVisualAsset` schema, which sits fully built and fully unused. Runtime asset resolution is a third, independent, hand-maintained system (`CANONICAL_ASSET_LOCK`) disconnected from both. The documented "authoritative" artwork manifest does not exist in the repository.

## V1 canonical-route conclusions

The theoretical protection CC-13A described is real but incomplete: the schema correctly forbids non-`required` steps in a `CANONICAL_FIXED_ROUTE` lesson, but never checks `branchRoutes` — a `required` step can still carry a branch. This is currently inert only because 0 real lessons (of any of the 8 historical releases) declare `routePolicy` at all. The 4 known within-lesson-branching lessons are correctly, unambiguously outside the V1-canonical-route contract (none declares `routePolicy`), exactly as ADR-0006 permits.

## Assessment/submission conclusions

No formative/mock assessment runtime feature exists anywhere in the mobile app. The submission-boundary pure function (`buildSubmittedAssessmentResult`) is real, correctly throws for any non-`SUBMITTED` state, and is well-tested — but has zero callers. This is an accurate, honest confirmation of CC-13A's own stated scope, not a surprise finding, but it is the single largest gap between the current repository and the V1 product promise as documented.

## Guided Revision conclusions

Identical shape to the assessment finding: `buildGuidedRevisionPlan()` is a genuinely well-built, deterministic, well-tested pure function with zero callers, zero persistence, and zero UI. Meanwhile the older, richer CC-07/CC-08 evidence/mastery machinery — explicitly retained-but-not-V1-required by ADR-0006 — remains the only adaptive machinery actually running in the shipped app today. V1 currently has neither the adaptive surface it is supposed to have (Guided Revision) nor an absence of adaptive machinery; it has the old machinery still running and the new one not yet built.

## Publication/learner-ready conclusions

There is currently no mechanical way for the repository to determine "is this lesson/package learner-ready." `isPublicationReady()` exists, is correctly written, and is never called outside its own test. No real `LearningPackageGateResult` has ever been produced for any lesson. Runtime-qualified (CC-12H, genuinely proven, still valid) is not the same claim as learner-ready, and the repository currently has no gate that could tell the difference mechanically.

## Proposed remediation packages, in order

Full detail, dependencies, and acceptance criteria: `REMEDIATION-PLAN.md`. Summary order: (1) close the `branchRoutes` gap, (2) fix the 23-lesson duplicate-completion defect, (3) make visual planning mandatory / reconcile the two visual-catalogue systems, (4) integrate already-produced unshipped visual assets, (5) formalise reference authority as real `ReferenceDossier` records, (6) consolidate duplicate visual-eligibility and release-identity sources of truth, (7) implement the formative/mock assessment feature, (8) wire Guided Revision (depends on 7), (9) wire publication gates into real release eligibility, (10) V1/adaptive-engine labelling cleanup, (11) debug-leakage defense-in-depth generalisation, (12) — **only after the V1 pilot passes** — systematically rebuild Unit 202 through the corrected pipeline.

## Recommendation: SAFE TO PROCEED TO REMEDIATION (not to full Unit 202 re-authoring)

This audit's own findings, not merely its own completion, support this conclusion: the repository has a sound, real, well-tested schema/validator foundation (CC-13A's work holds up under direct scrutiny — every claim independently checked in this audit was accurate except one narrow overstatement, MM-1), a genuinely working curriculum/lesson/runtime pipeline through lesson delivery (CC-12H remains valid), and a clearly-enumerated, evidence-backed set of gaps with a concrete, dependency-ordered remediation plan. **It is safe to begin Packages 1-11 of the remediation plan, pending Product Owner / Project Architect review and sequencing.** It is explicitly **not** yet safe or appropriate to begin systematic Unit 202 re-authoring (Package 12) — that step is gated on the V1 pilot passing, which itself depends on Packages 3, 7, 8 and 9 existing first. Qualification of the pipeline is a separate, future determination this audit does not make; this audit establishes the honest starting point for it.

## Files created

All 16 required deliverables plus 3 structured-data companions, under `reports/learning-package-pipeline-audit/`:
`CC-13B-EXECUTIVE-SUMMARY.md`, `SOURCE-OF-TRUTH-MAP.md`, `PIPELINE-TRACE.md`, `CONTRACT-ADOPTION-MATRIX.md` (+ `contract-adoption-matrix.json`/`.csv`), `MISMATCH-REGISTER.md`, `BYPASS-PATH-REGISTER.md`, `DUPLICATE-SOURCE-OF-TRUTH-REGISTER.md`, `MISSING-OR-INACTIVE-VALIDATORS.md`, `LESSON-DEPTH-AND-FRAGMENTATION-REGISTER.md` (+ `lesson-depth-fragmentation-data.json`), `VISUAL-GOVERNANCE-AND-COVERAGE-REGISTER.md` (+ `visual-governance-coverage-data.json`), `REFERENCE-AUTHORITY-REGISTER.md`, `V1-ROUTE-DRIFT-REGISTER.md`, `ASSESSMENT-SUBMISSION-INTEGRITY-REGISTER.md`, `GUIDED-REVISION-INTEGRITY-REGISTER.md`, `REPRESENTATIVE-FAILURE-ROOT-CAUSE-TRACE.md`, `REMEDIATION-PLAN.md`. Plus two new, kept, read-only audit scripts: `scripts/audit/lesson-structure-audit.ts`, `scripts/audit/lesson-structure-audit-supplement.ts`. Plus a `## CC-13B` update to `PROJECT-STATUS.md`.

## Validation performed

Both new audit scripts run successfully, read-only, against the live corpus (verified zero stderr, deterministic output). Real (read-only) validator/test runs were performed by the five parallel research threads that fed this audit, independently re-confirming: `lesson-plan.test.ts` (30/30), `assembler.test.ts`+`branching.test.ts` (34/34), `visual-planning-governance.test.ts`+`visual-governance.test.ts`+`validate-v1-learning-package.test.ts` (54/54 across the three), `guided-revision.test.ts`+`assessment-instance.test.ts`+`learning-package-gate.test.ts` (33/33), `npm run lesson:validate`, `npm run content:pedagogy:report`, `npm run v1-package:report`, `npm run coverage:matrix`, and `npm run typecheck` — all currently green against the real corpus. `git status --short`/`git diff --stat` confirm only this audit's own deliverables changed (see the commit for the exact final diff).

## Confirmation

This audit did **not** push. The commit was made locally, per instructions, for Product Owner / Project Architect review before any remediation begins.
