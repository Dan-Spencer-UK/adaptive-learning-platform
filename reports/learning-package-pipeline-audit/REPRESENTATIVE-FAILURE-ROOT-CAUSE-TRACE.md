# Representative Failure Root-Cause Trace (CC-13B)

Ten traces: the six Product-Owner-named findings (marked **[PO]**) plus four additional architecture-derived findings this audit found independently, each traced SOURCE → SCHEMA/GOVERNING CONTRACT → AUTHORING/GENERATION STEP → VALIDATION → GENERATED/RELEASE ARTIFACT → RUNTIME CONSUMER → LEARNER-VISIBLE RESULT, per the audit's core principle. Every trace is backed by direct code/content reads and, where applicable, a live (read-only) validator run — see the per-layer registers for full citations.

---

## 1. [PO] Thermistor tested before being taught — NOT reproducible today; regression-guarded

- **SOURCE**: City & Guilds 2365-02 handbook LO6/AC6.2 (thermistor/PTC component recognition).
- **SCHEMA/CONTRACT**: `LessonStep.teaches`/`tests` (assertion-id arrays), taught-before-tested invariant (`SYLLABUS-TO-LEARNING-PACKAGE-PRODUCTION-ARCHITECTURE.md` §3.3).
- **AUTHORING**: `scripts/content/data/lesson-electronic-components-switching-control.ts` — `concept_thermistors` step (line 86) teaches `EL-COMPONENT-THERMISTOR-001`/`EL-COMPONENT-THERMISTOR-PTC-001`; a later step, `guided_recognise_thermistor_type` (line 106), tests the same ids. Correct order, same lesson.
- **VALIDATION**: `scripts/content/validate-v1-learning-package.ts`'s off-syllabus/undeclared-other-lesson gate (new, CC-13A) — live run: **0** off-syllabus, **0** undeclared-other-lesson findings anywhere in the corpus.
- **GENERATED ARTIFACT / RUNTIME / LEARNER-VISIBLE**: not reached — no defect exists to propagate.
- **Root cause**: this defect class was real historically (per the Decision Log's CC-09B.6/CC-09G entries) and was fixed as part of earlier LO6 authoring work. The pre-existing historical-snapshot fixture (`lesson-cc11-3-historical-snapshot.ts`) even preserves an already-correct ordering, suggesting the fix predates that snapshot.
- **Verdict**: **NOT REPRODUCIBLE** in the current corpus. The taught-before-tested gate that would catch a regression is real, live, and currently passing. Severity: **P2 (confirmed non-issue, regression-guarded)** — no fix required; MACHINE-FIXABLE if it ever regresses (the gate already exists).

---

## 2. [PO] UK telephone socket off-syllabus content — reproducible; a governance-layer gap, not a content bug

- **SOURCE**: City & Guilds 2365-02 handbook AC6.1 Range box, which lists "Telephones" as an official mandatory item (`cc04-unit202-electrical-science.ts:555`).
- **SCHEMA/CONTRACT**: `AssertionCurriculumMapping` (`knowledge-graph.ts:386`) with `mappingType: "REQUIRED_FOR"`.
- **AUTHORING**: `scripts/content/data/lesson-electronic-components-passive.ts:218-244` — `concept_telephone_application` teaches `EL-APPLICATION-TELEPHONE-MASTER-SOCKET-001` ("the traditional UK master telephone socket contains a capacitor... and a resistor..."); `independent_identify_telephone_application` tests it. The assertion is mapped `REQUIRED_FOR` both `acNode("6.1")` and `rangeNode("6.1","TELEPHONES")`.
- **VALIDATION**: `report-coverage-matrix.ts`'s syllabus-scope-fidelity check — live run classifies all 247 mapped assertions, **0** `OUT_OF_SCOPE`, **0** `ENRICHMENT_NOT_REQUIRED`. Mechanically **IN_SCOPE_REQUIRED**.
- **GENERATED ARTIFACT / RUNTIME**: projects through the generator like any other governed content; renders in the lesson exactly as authored.
- **LEARNER-VISIBLE RESULT**: a learner studying electrical installation encounters detailed UK telephone-master-socket wiring content that reads as tangential, even though it is officially, narrowly mandated by the awarding body's own Range box.
- **Root cause**: **no validator exists for "is this content proportionate/relevant to the qualification's practical centre of gravity" as distinct from "does this content trace to an official curriculum node."** The architecture's traceability gates (curriculum-mapping, scope-fidelity) are working exactly as designed — they only ever assert official traceability, never relevance/proportion. This is a real gap between what the mechanical gates check and what a human reviewer (the Product Owner) judges. It is not a case of Claude/automation inventing off-syllabus content; the content is genuinely, narrowly, officially in scope.
- **Verdict**: **REPRODUCIBLE.** Severity: **P1 (blocks class-leading quality)** — MISSING VALIDATOR, HUMAN-REVIEW-REQUIRED (this is fundamentally a proportionality/emphasis judgement, not a mechanical defect; the fix is either a Product-Owner-recorded exception/waiver for this specific Range item, or a deliberate depth/emphasis reduction in how the lesson treats it — not deletion, since it is genuinely mandated).

---

## 3. [PO] Missing component symbol imagery — reproducible; a production-to-integration gap, not a missing-production gap

- **SOURCE**: `INSTRUCTIONAL-VISUAL-PLANNING-REFERENCE-AND-PRODUCTION-ARCHITECTURE.md` §8 ("physical component + symbol rule" — physical-recognition image + deterministic standard-symbol companion, paired, for every recognisable component).
- **SCHEMA/CONTRACT**: `productionClass: "PHYSICAL_RECOGNITION"` / `"STANDARD_SYMBOL"` in `VisualRequirement` (new schema, `visual-governance.ts`); the deterministic `electronics.component_symbol_card` SVG blueprint family (13 members: capacitor, diac, diode, inverter, led, photodiode, rectifier, resistor, thermistor, thyristor_scr, transistor, triac, zener_diode).
- **AUTHORING/PRODUCTION**: all 13 deterministic symbol cards are fully rendered and registered (`tools/visual-production-studio/renders/`). Separately, `reports/instructional-visuals/unit202-visual-debt-register.md` §DEFERRED_SCOPE explicitly records the product decision that **every** governed component should have a paired physical-recognition photo, and that this pairing was deliberately deferred for at least the 6 REQUIRED `unit202.components.physical.*` assets (resistor, capacitor, diode, LED, thermistor, transistor) — each individually already produced and QA-`PASS`.
- **VALIDATION**: no gate checks "does every symbol-carrying component also have a shipped physical-recognition companion" — this is a genuine missing validator (see `MISSING-OR-INACTIVE-VALIDATORS.md`).
- **GENERATED ARTIFACT**: the 6 physical-recognition images sit in `tools/visual-production-studio/reference-cache/`/`reports/.../premium-artwork/proof/` only.
- **RUNTIME CONSUMER**: `apps/mobile/src/components/diagrams/DiagramRenderer.tsx` resolves visuals only from 3 hard-coded `require()` tables (`CANONICAL_ASSESSMENT_VISUALS`/`CANONICAL_PARAMETER_VISUALS`/`CANONICAL_TEACHING_VISUALS`), and `apps/mobile/src/assets/instructional/unit202/physical-components/` — the folder the app's own README documents as their home — is confirmed **empty**.
- **LEARNER-VISIBLE RESULT**: every component-recognition lesson shows the correct deterministic schematic symbol but no physical-appearance photo alongside it, despite the product's own stated intent and despite the images already existing, produced and QA-approved.
- **Root cause**: a genuine, already-completed production step (image generation + QA) was never carried through the final integration step (copy into the shipped asset folder + wire into `DiagramRenderer.tsx`/lesson steps). This is the cheapest class of gap in this whole audit to close.
- **Verdict**: **REPRODUCIBLE.** Severity: **P1** — **BOTH** (corrected by CC-13B.2: the assets already exist and their old QA-`PASS` status is reusable evidence, so no *new production* is required, but their old status alone does not authorise shipping — per `REMEDIATION-PLAN.md` Package 6, each must be qualified through the current production authority — a real `VisualRequirement` mapping, reference-governance compliance where required, and a real `PRODUCTION_ELIGIBLE` `ProductionVisualAsset` record — before `DiagramRenderer.tsx`/`CANONICAL_ASSET_LOCK` is extended to reference it. That qualification step is HUMAN-REVIEW-REQUIRED; the mechanical copy/wire step that follows is MACHINE-FIXABLE).

---

## 4. [PO] Internal debug labels visible to learners — historically real; currently gated and test-provably inert

- **SOURCE**: `docs/product/MOBILE-UX-ENGINEERING-STANDARD.md` / `SYLLABUS-TO-LEARNING-PACKAGE-PRODUCTION-ARCHITECTURE.md` §13 ("Human-readable learner copy boundary").
- **SCHEMA/CONTRACT**: none directly — this is a runtime-presentation concern, not a content-schema concern.
- **AUTHORING/RUNTIME**: `apps/mobile/src/app/(app)/learn/lesson-player.tsx` (lines ~478-499) renders a debug badge showing raw `resolved.step.id`/`resolved.step.type` and (via `resolveDevDebugAnswer`) the expected answer — real code, present in the compiled production bundle (not build-time excluded).
- **GATING**: gated by `debugOverlayEnabled` from `useLessonDebugOverlay()` (`apps/mobile/src/lib/lesson-content/dev-debug-overlay.ts`), a persisted flag defaulting to `false`, toggled only from the `__DEV__`-gated `dev-lesson-qa.tsx` screen (itself only linked from `learn/index.tsx` inside an `{__DEV__ ? ... : null}` guard).
- **VALIDATION**: `apps/mobile/src/app/(app)/learn/__tests__/lesson-player-debug-overlay.test.tsx` (new, CC-13A item 6) specifically proves the overlay is off by default and fails closed on any stored value other than the literal string `"true"`.
- **LEARNER-VISIBLE RESULT**: none, for a real learner on a production build — the mechanism exists in the bundle but is behaviourally and test-provenly inert.
- **Root cause**: the underlying capability (a debug overlay reachable in principle from the compiled app) is real, but a specific regression test now exists precisely because this class of defect was found and needed to be pinned shut. No other raw internal identifier was found rendered anywhere else in `LessonStepView.tsx` or other learner-facing components in the code paths examined (though the generated projection file does carry raw ids as internal lookup keys — not observed rendered verbatim as learner text).
- **Verdict**: **NOT CURRENTLY LIVE**, but the class of risk is real and only defended by one specific test on one specific screen. Severity: **P2 (cleanup / defense-in-depth)** — MACHINE-FIXABLE (a broader sweep/lint rule for any `__DEV__`-gated learner-visible string would generalise this single-instance fix); HUMAN-REVIEW-REQUIRED to decide if that generalisation is warranted before further screens are built.

---

## 5. [PO] Duplicated recap/completion — reproducible in 23/24 real lessons

- **SOURCE**: `docs/governance/LEARNING-PACKAGE-QUALITY-GATES.md` §4 ("terminal completion is not redundantly pre-announced by a duplicate prior screen").
- **SCHEMA/CONTRACT**: `lessonStepSchema`'s `recap`/`exit_completion` step types; `completionCriteria.exitSummary`.
- **AUTHORING**: every one of the 24 real lessons except `lesson.electrical.ohms-law` ends its `steps` array `... → recap (view_acknowledged) → exit_completion (view_acknowledged)`. Confirmed mechanically (`scripts/audit/lesson-structure-audit-supplement.ts`'s `consecutiveRecapOrCompletionPairs`): **23/24 lessons**.
- **VALIDATION**: none — no gate checks for this pattern.
- **GENERATED ARTIFACT / RUNTIME**: `resolve-lesson-step.ts` maps `exit_completion` to section label **"Lesson complete"** and body text = `lesson.completionCriteria.exitSummary` (verbatim); `lesson-player.tsx` then shows the separate `LessonCompletionView` (`completionCriteria.exitSummary` again) only after every step — including the literal `exit_completion` step — is complete.
- **LEARNER-VISIBLE RESULT**: a recap screen (distinct pedagogical content — its resolved text differs from the completion screens, confirmed by the worked example in `LESSON-DEPTH-AND-FRAGMENTATION-REGISTER.md` §4), immediately followed by two consecutive Continue-gated screens both labelled "Lesson complete" and both rendering `lesson.completionCriteria.exitSummary` verbatim identically: the authored `exit_completion` step, then the terminal `LessonCompletionView`. The genuine duplication is that pair — the authored `exit_completion` step against the terminal completion screen — not the recap, for 23 of 24 real lessons.
- **Root cause**: **CC-12G already found and root-caused this exact defect**, and fixed it — but scoped the fix to exactly one lesson (`lesson.electrical.ohms-law`), explicitly noting "other lessons' own `exit_completion` steps are unaffected." The fix was never generalised.
- **Verdict**: **REPRODUCIBLE, 95.8% of the corpus.** Severity: **P1** — MACHINE-FIXABLE (delete the trailing `exit_completion` step object from the remaining 23 lessons' `steps`/`completionCriteria.requiredStepIds`, exactly as already done once). Full detail: `LESSON-DEPTH-AND-FRAGMENTATION-REGISTER.md` §4.

---

## 6. [PO] Answer-leaking teaching text — mechanism exists, not adopted; live status inconclusive (needs Product-Owner spot-check, not confirmed clean)

- **SOURCE**: `SYLLABUS-TO-LEARNING-PACKAGE-PRODUCTION-ARCHITECTURE.md` §6 ("Visible teaching content must not accidentally give away an answer to an embedded check occupying the same learner state").
- **SCHEMA/CONTRACT**: `mayRevealTargetAnswer: z.boolean().optional()` (`lesson-plan.ts:293`) plus a `superRefine` (lines 546-569) cross-referencing any step so marked against later graded steps testing overlapping targets.
- **AUTHORING**: **0/270 real steps declare `mayRevealTargetAnswer`** — confirmed independently by both the curriculum-trace agent and the assessment-trace agent.
- **VALIDATION**: the gate is real and correctly implemented but structurally cannot detect leakage that was never declared in the first place — it only catches a step that IS marked `mayRevealTargetAnswer` and precedes an overlapping graded step; it cannot detect a step that reveals an answer in its resolved body text without ever being marked.
- **GENERATED ARTIFACT / RUNTIME / LEARNER-VISIBLE**: not exhaustively checked in this audit. One lesson (`lesson.electrical.resistors-series`) was spot-checked and found not to leak between its `recap`/`exit_completion` `purpose` fields, but `purpose` is an authoring-internal field, not learner copy — a real leak-check would need to compare each graded step's resolved `bodyStatements`/formula/worked-example against every earlier step's resolved output, across all 24 lessons, which this audit did not do exhaustively.
- **Root cause**: unknown/unconfirmed either way. The mechanism to prevent this class of defect is real and correct; whether the defect is currently live anywhere in the 270-step corpus was **not proven clean** by this audit, only spot-checked on one lesson.
- **Verdict**: **UNCONFIRMED — requires further, more exhaustive review before this can be marked resolved or reproducible.** Severity: **P1 (potential, unverified)** — HUMAN-REVIEW-REQUIRED (a full per-lesson content read against the exact instance the Product Owner originally found would settle this; this audit did not have that instance's exact lesson/step identified to verify against).

---

## 7. CANONICAL_FIXED_ROUTE lessons can still branch via `branchRoutes` — architecture-derived, not PO-named

- **SOURCE**: ADR-0006 ("the ordered `required` step sequence never changes for learner mastery/evidence/prerequisite reasons").
- **SCHEMA/CONTRACT**: `lessonPlanSchema`'s `superRefine` (`lesson-plan.ts:534-544`) checks `step.requirement === "required"` for every step in a `CANONICAL_FIXED_ROUTE` lesson, but never checks `step.branchRoutes`.
- **AUTHORING**: not currently exploited — 0/140 real lessons declare `routePolicy` at all.
- **VALIDATION**: no test or gate covers a `required` step with non-empty `branchRoutes` under `CANONICAL_FIXED_ROUTE`.
- **RUNTIME**: `packages/learning-engine/src/branching.ts`'s `resolveWithinSessionBranch` and `apps/mobile/src/lib/lesson-session/lesson-controller.ts`'s `resolveBranchDestination` apply to every lesson unconditionally, with zero `routePolicy` awareness anywhere in the call chain.
- **LEARNER-VISIBLE RESULT**: none today (unexercised), but would be a direct route-invariance violation the moment a `CANONICAL_FIXED_ROUTE` lesson is authored with a branching step.
- **Root cause**: the schema gate covers step inclusion but not branch destination — an incomplete implementation of the intended invariant, found by direct code read, not by observing a live defect.
- **Verdict**: **LATENT BYPASS, not yet exploited.** Severity: **P0** — MACHINE-FIXABLE. Full detail: `V1-ROUTE-DRIFT-REGISTER.md` §2, `BYPASS-PATH-REGISTER.md` BP-1.

---

## 8. Concept-heavy lessons with zero visual coverage and no recorded justification — architecture-derived

- **SOURCE**: `SYLLABUS-TO-LEARNING-PACKAGE-PRODUCTION-ARCHITECTURE.md` §11 ("a concept-heavy... lesson with no meaningful visuals must fail visual-completeness review unless an explicit pedagogical justification is recorded").
- **SCHEMA/CONTRACT**: `VisualOpportunityAnalysis`/`textOnlyJustification` (new, CC-13A).
- **AUTHORING**: 11/24 real lessons (45.8%) have zero diagram/visual-aid references anywhere; 0/24 declare `textOnlyJustification`. Representative example read in full: `lesson.electrical.core-quantities` ("Voltage, Current and Resistance") — three spatial/relational quantities, textbook visual-analogy territory, zero visuals, no justification.
- **VALIDATION**: `docs/governance/LEARNING-PACKAGE-QUALITY-GATES.md` §5 describes this exact gate; no code implements it against real content (the new `VisualOpportunityAnalysis` schema is real but has zero real instances).
- **RUNTIME/LEARNER-VISIBLE**: these 11 lessons render as pure text-and-question sequences today.
- **Root cause**: the upstream visual-planning layer (VOA/VRR) that would catch this was built as schema only and never populated — a direct consequence of the "two disconnected visual-catalogue systems" finding (#10 below).
- **Verdict**: **REPRODUCIBLE, 45.8% of the corpus.** Severity: **P1** — HUMAN-REVIEW-REQUIRED (visual need is a pedagogical judgement). Full detail: `VISUAL-GOVERNANCE-AND-COVERAGE-REGISTER.md` §4, `LESSON-DEPTH-AND-FRAGMENTATION-REGISTER.md` §5.

---

## 9. The V1 product loop's actual adaptive surface (formative assessment → submit → Guided Revision) does not exist as a runtime feature

- **SOURCE**: ADR-0006, `V1-LEARNING-ASSESSMENT-AND-GUIDED-REVISION-ARCHITECTURE.md` (the entire document — this is the V1 product's stated core adaptive proposition).
- **SCHEMA/CONTRACT**: `FormativeAssessmentInstance`/`SubmittedAssessmentResult`/`buildSubmittedAssessmentResult` (`assessment-instance.ts`), `GuidedRevisionPlan`/`buildGuidedRevisionPlan` (`guided-revision.ts`) — all real, well-tested (33/33 tests pass), genuinely deterministic pure functions.
- **AUTHORING**: no Unit 202 formative/mock assessment content exists (0/114 blueprints declare `v1PedagogicalRole: "FORMATIVE_MOCK"`).
- **VALIDATION**: the `superRefine` requiring `FORMATIVE_MOCK` blueprints to have `revisionLessonIds` is real but unexercised (no blueprint triggers it).
- **GENERATED ARTIFACT**: none — nothing generates a real `FormativeAssessmentInstance` or `GuidedRevisionPlan` today.
- **RUNTIME CONSUMER**: **none exists.** Zero references to `buildGuidedRevisionPlan`/`GuidedRevisionPlan` anywhere in `apps/`. No assessment-taking screen exists anywhere in `apps/mobile/src/app/(app)/` (the only related screen, `learn/[family]/practice.tsx`, is explicitly headed `LEGACY_RETIRED (CC-12D)` and has no submission-boundary concept). No persistence layer (no AsyncStorage key, no backend table — there is no backend at all in this repo) exists for any of these objects.
- **LEARNER-VISIBLE RESULT**: a learner today can complete lessons, but cannot take a formative/mock assessment, cannot submit one, and has no Guided Revision entry point at all. Meanwhile the older, richer CC-07/CC-08 evidence/mastery machinery — explicitly designated retained-but-not-V1-required by ADR-0006 — remains the only adaptive machinery actually running (`apps/mobile/src/lib/evidence-sync/derived-snapshot.ts`, consumed by `lesson-player.tsx` and `apps/mobile/src/lib/course/next-activity.ts`).
- **Root cause**: CC-13A's own documented scope explicitly deferred this ("no Unit 202 formative/mock assessment built"). This is not a defect so much as an accurate description of "how much of the V1 product loop exists today: the foundation only."
- **Verdict**: **CONFIRMED MISSING, and the single largest gap in the whole audit relative to the stated V1 product promise.** Severity: **P0** — HUMAN-REVIEW-REQUIRED (a genuinely large feature build: attempt UI, submission boundary wiring, persistence, Guided Revision UI). Full detail: `ASSESSMENT-SUBMISSION-INTEGRITY-REGISTER.md`, `GUIDED-REVISION-INTEGRITY-REGISTER.md`.

---

## 10. Two structurally disconnected visual-catalogue systems — architecture-derived

- **SOURCE**: `INSTRUCTIONAL-VISUAL-PLANNING-REFERENCE-AND-PRODUCTION-ARCHITECTURE.md` §3 (VRR/ARL/AAL as *the* governed catalogue model).
- **SCHEMA/CONTRACT**: `VisualOpportunityAnalysis`/`VisualRequirement`/`ReferenceDossier`/`ProductionVisualAsset` (new, `visual-governance.ts`) — real, well-tested schema (54/54 tests pass), zero real instances anywhere in the repo.
- **AUTHORING/PRODUCTION**: the real, operative pipeline that produced Unit 202's actual 53-asset visual catalogue is `tools/visual-production-studio/catalogue.ts` (an unrelated, older, ad hoc TS module) plus `reports/instructional-visuals/`, genuinely need-classified before production (confirmed by commit chronology) but using none of the new schema's shapes.
- **VALIDATION**: `validateVisualGovernance()` exists and is correctly written, but takes caller-supplied objects rather than reading any real corpus, and is never invoked from its own script's CLI entry point.
- **GENERATED ARTIFACT / RUNTIME**: `DiagramRenderer.tsx` resolves assets from a third, independent, hand-maintained table (`CANONICAL_ASSET_LOCK`), disconnected from both the old catalogue system's own manifest (which itself doesn't exist in the repository — see `REFERENCE-AUTHORITY-REGISTER.md` §5) and the new schema.
- **LEARNER-VISIBLE RESULT**: indirect — this is the structural root cause behind findings #3 and #8 above (assets produced but not integrated; visual need not tracked against a governed catalogue).
- **Root cause**: CC-13A added the new governance schema layer in parallel to, rather than integrated with, the pre-existing ad hoc visual-production tooling. Neither system alone is both operative and conformant.
- **Verdict**: **CONFIRMED, structural.** Severity: **P0** — HUMAN-REVIEW-REQUIRED (a genuine architectural reconciliation/migration decision, not a mechanical fix). Full detail: `VISUAL-GOVERNANCE-AND-COVERAGE-REGISTER.md` §1, `REFERENCE-AUTHORITY-REGISTER.md`.

---

## Summary table

| # | Finding | PO-named | Reproducible today | Severity | Fix type |
|---|---|---|---|---|---|
| 1 | Thermistor tested before taught | Yes | No | P2 (non-issue) | — |
| 2 | UK telephone socket off-syllabus | Yes | Yes | P1 | HUMAN-REVIEW-REQUIRED |
| 3 | Missing component symbol imagery | Yes | Yes | P1 | BOTH |
| 4 | Internal debug labels visible | Yes | No (gated/inert) | P2 | BOTH |
| 5 | Duplicated recap/completion | Yes | Yes (23/24 lessons) | P1 | MACHINE-FIXABLE |
| 6 | Answer-leaking teaching text | Yes | Unconfirmed | P1 (unverified) | HUMAN-REVIEW-REQUIRED |
| 7 | `branchRoutes` bypasses CANONICAL_FIXED_ROUTE gate | No | Latent (unexploited) | P0 | MACHINE-FIXABLE |
| 8 | Zero-visual-coverage concept lessons | No | Yes (45.8% of corpus) | P1 | HUMAN-REVIEW-REQUIRED |
| 9 | Formative assessment/Guided Revision missing entirely | No | Yes | P0 | HUMAN-REVIEW-REQUIRED |
| 10 | Two disconnected visual-catalogue systems | No | Yes (structural) | P0 | HUMAN-REVIEW-REQUIRED |
