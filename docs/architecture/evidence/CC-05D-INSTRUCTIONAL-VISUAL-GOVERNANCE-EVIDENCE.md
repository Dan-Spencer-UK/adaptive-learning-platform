# CC-05D — Instructional Visual Governance, Semantic QA & Human-Readable Audit — Evidence

**Status:** **APPROVED / COMPLETE** — governance/QA workflow and architecture only (Product Owner / Project Architect, 2026-08-17), following the truthfulness correction in §0 below. **Explicitly NOT approved**: visual/pedagogical quality of the current instructional images; completeness of renderer coverage for every governed diagram blueprint; real AI/vision semantic approval of any image; native pixel-level visual regression; production learner-facing visual design. See §0 for the exact correction required before approval, and the qualification section at the end of this document for the full, precise approval scope.

**Starting checkpoint:** local `main` = `origin/main` = `9291b199ae421f3ba1fc4302903f477e2c23782b` (the approved CC-05C governance closeout commit; PROJECT-STATUS.md recorded CC-05C as APPROVED/COMPLETE and CC-05D as next, unstarted), working tree clean. Precondition verified before any implementation began.

**Design authority:** [`docs/architecture/CC-05D-INSTRUCTIONAL-VISUAL-GOVERNANCE-AND-SEMANTIC-QA.md`](../CC-05D-INSTRUCTIONAL-VISUAL-GOVERNANCE-AND-SEMANTIC-QA.md) (full normative specification; this document is evidence only, not a duplicate spec).

## 0. Truthfulness correction (Product Owner review addendum, 2026-08-17)

Product Owner / Project Architect review of the initial CC-05D implementation approved the governance/QA **workflow and architecture** (§1-§11 of the original evidence below) but found the human-readable HTML report presented mock-provider semantic results in a way that could be mistaken for a real AI/vision review — a "semantic: PASS (high)" badge looked identical regardless of whether a real model or the deterministic mock had produced it.

**Correction made** (`scripts/visual-governance/generate-report.ts`, `scripts/visual-governance/semantic-review/mock-provider.ts`, `scripts/visual-governance/run-semantic-audit.ts`):

- A single source-of-truth classifier, `isSimulatedReviewerIdentity()` (mock-provider.ts, prefix-matched against `"mock"`, never inferred from a UI label), feeds `classifySemanticEvidence()` (generate-report.ts), which sorts every semantic result into exactly one of `real` / `simulated` / `unreviewed`.
- Every per-card badge now reads **"SIMULATED SEMANTIC (mock pipeline, not a real review): PASS"** (purple-styled, visually distinct from the green "REAL AI REVIEW" style) rather than a bare "semantic: PASS".
- Two unmissable banners were added at the top of the HTML report: (1) that no real AI/vision review has occurred and every visible semantic result is from the mock pipeline; (2) the Product Owner's own current-image-quality finding (§3 below), so a reader cannot see the report without seeing both caveats first.
- The summary statistics row was split into separate **SIMULATED semantic pass/warn/fail** and **REAL AI review pass/warn/fail** counts (the latter reads "0 / 0 / 0 (none run yet)" honestly) instead of one ambiguous "semantic pass/warn/fail" figure.
- A new HTML filter (`filter-evidence`: real / simulated / unreviewed) and `data-semantic-evidence` attribute make the distinction machine-filterable, not just visually present.
- The `MockSemanticReviewProvider` pipeline itself, its schemas, and its identity (`mock-provider-v1`) are unchanged — this was a presentation-layer truthfulness fix, not a rewrite of the underlying evidence, per the review's explicit instruction to preserve the mock pipeline as valid implementation evidence.
- 5 new tests (`generate-report.test.ts`) and 4 new tests (`mock-provider.test.ts`, `isSimulatedReviewerIdentity`) prove the classification is correct and that the corrected wording/banners are actually present in the generated HTML, and that the old ambiguous wording (`badge sem-pass">semantic: PASS`) never appears again.

**Current instructional-visual quality — explicit open requirement** (recorded here per the Product Owner's direct finding, not solved in this pass): manual review of `reports/instructional-visuals/index.html` found the current imagery below the required eventual product standard. The CC-05D **workflow** is approved despite this — it governs and audits visuals, it does not itself claim the present proving visuals are production-quality artwork. Future visual work must address pedagogical fidelity, visual clarity, professional illustration quality, label placement, arrow/direction clarity, appropriate teaching-aid choice, visual hierarchy, accessibility, consistency, native mobile legibility and overall polish "appropriate to a premium learning product" — substantially above the current proving-slice diagrams. This requirement is **not** addressed by this closeout and is carried forward as an explicit, open, unimplemented item.

## 1. What CC-05D built

A visual-governance/semantic-QA layer sitting beside (never modifying) CC-05A's pedagogical schema, CC-05B's engine, and CC-05C's renderer components:

- `VisualSemanticContract` and its supporting schemas (`packages/content-schema/src/visual-governance.ts`) — teaching intent, traceability to real governed assertion families/capabilities/question blueprints, must-show/must-not-show, semantic element mappings, directional relationships, answer-disclosure rules, accessibility expectations. 33 Vitest tests.
- 4 governed `VisualSemanticContract` records (`scripts/visual-governance/data/cc05d-visual-contracts-unit202.ts`) — one per diagram blueprint with a real mobile renderer (series circuit, parallel circuit, right-hand grip rule, motor-principle force), every id cross-checked against the live CC-05A corpus.
- Deterministic canonical semantic-variant enumeration (`scripts/visual-governance/data/canonical-variants.ts`) — 18 pedagogically distinct variants (3 series component-counts + 3 parallel branch-counts + 2 grip-rule directions × 2 modes + 2×2 motor pole/current combinations × 2 modes), explicitly excluding the one documented-unreachable parameter value (`current_direction: "left_to_right"` on the grip-rule blueprint — a pre-existing CC-05B scoping decision, not a CC-05D-introduced gap; see that file's header).
- Deterministic SVG render capture (`apps/mobile/src/lib/visual-governance/render-tree-to-svg.ts` — pure, RN-free, 12 Jest tests; `apps/mobile/src/lib/visual-governance/capture-renders.test.tsx`, run via `npm run visuals:render`) — converts the real, computed `react-native-svg` `toJSON()` element tree (the same tree the pre-existing structural snapshots already assert against) into standalone, openable `.svg` documents. This is the actual rendered artefact, not JSX source — see the architecture doc §D for exactly what this tier proves and does not prove.
- Mechanical QA (`scripts/visual-governance/check-visual-governance.ts`, `npm run visuals:check` / `visuals:check:strict`) — orphan/dangling-reference detection, renderer/contract coverage per governed blueprint, canonical variant coverage, answer-leakage detection, plus an independent geometry check operating on the **actual rendered SVG bytes** (`scripts/visual-governance/artifact-geometry-check.ts`) that reproduces and would catch the exact CC-05C-DIAGRAM-FIX defect #2 class (see §3).
- Two-pass semantic QA architecture (`scripts/visual-governance/semantic-review/`) — versioned prompts, a provider boundary (`SemanticReviewProvider`), a fully-tested deterministic `MockSemanticReviewProvider`, and an `AnthropicVisionProvider` scaffold (credential-validated, structurally complete, honestly not-yet-wired to a live call — see §5).
- Audit identity/caching (`scripts/visual-governance/audit-cache.ts`) — SHA-256 contract/image hashing, staleness detection across image/contract/prompt-version/schema-version/reviewer-identity.
- Deterministic human-review sampling (`scripts/visual-governance/sampling.ts`) — reuses `@alp/calculation-engine`'s own mulberry32/FNV-1a generator, seeded by `(contentRelease, sampleSeed)`.
- Human-review workflow (`scripts/visual-governance/human-review.ts`) — hash-bound decisions, a CLI (`npm run visuals:review:record`) that reads the current image/contract hash automatically so a reviewer never types one by hand.
- Orchestration (`scripts/visual-governance/run-semantic-audit.ts`, `npm run visuals:audit:semantic`) — runs Pass A/B for new-or-stale artefacts, reuses cache otherwise, writes `semantic-audit.json` and `human-review-queue.json`.
- HTML + JSON report (`scripts/visual-governance/generate-report.ts`, `npm run visuals:report`) — self-contained `reports/instructional-visuals/index.html`, filterable by family/diagram type/semantic status/mechanical status/human-review/mode, every card showing the actual image first plus full traceability; `mechanical-audit.json` alongside `manifest.json`/`semantic-audit.json`/`human-review-queue.json`.
- CI gate: `.github/workflows/ci.yml` runs `npm run visuals:check:strict` immediately after the existing `engine:dimensions:check` step (deterministic, no rendered-artefact or network dependency required to pass).

## 2. Pilot corpus counts (independently recomputed, not trusted from any record's own claim)

- Real governed diagram blueprints in the live CC-05A corpus: **7**.
- Governed pilot blueprints (have a real `apps/mobile` renderer): **4** — `circuit.series_resistors`, `circuit.parallel_resistors`, `magnetic.field_conductor_direction`, `motor.force_field_current`.
- Ungoverned-renderer blueprints (tracked, non-fatal, explicitly out of CC-05D's scope): **3** — `circuit.series_parallel_mixed`, `graph.waveform_sine`, `instrument.measurement_connection`. This is a pre-existing gap inherited from CC-05C's proving-slice scope (which only implemented renderers for 4 of the 7 governed blueprints), not introduced by CC-05D. Building these renderers is out of scope (would be "broaden into general product UI redesign").
- Visual semantic contracts: **4** (one per governed pilot blueprint — 100% coverage of the pilot set).
- Canonical audit variants: **18**.
- Rendered SVG artefacts: **18** (one per canonical variant), all with unique image hashes (no two distinct variants collapse to the same image).

## 3. Regression coverage — proves it could catch the exact CC-05C defects

**A. Right-hand grip rule.** The `visual-contract.right-hand-grip-rule` contract's `mustShow` requires "a recognisable right hand", "a distinctly labelled thumb", "distinctly labelled curled fingers"; `mustNotShow` explicitly names "a generic force arrow presented as if it were the field direction (the pre-CC-05C-DIAGRAM-FIX defect...)". This is a direct, named regression guard against defect #1, checkable by semantic review (Pass A/B) against the real rendered image.

**B. Current-direction arrow.** `scripts/visual-governance/artifact-geometry-check.ts` independently re-proves, against the **actual rendered SVG bytes** (not the component's internal helper functions), that the current-direction arrowhead's tip is collinear with (dot-product ≥ 0.9 against) the wire line it is attached to. Its own test suite includes a synthetic case reproducing the exact defect #2 shape (arrowhead perpendicular to its line) and proves the check fails on it (`artifact-geometry-check.test.ts`, "FAILS for a hand-constructed arrow whose arrowhead points perpendicular to its line"). Run against the real, currently-rendered series-circuit artefacts: **3/3 arrows checked, 0 failures**.

**C. Label collision / legibility.** `blindObservationSchema` requires `labelsOverlap`/`anyClipping`/`legibilityConcerns` from every Pass A review, and Pass B's `label_collision` issue code exists specifically for this defect class. The mock-provider test suite proves the schema/escalation plumbing works (`mock-provider.test.ts`, "returns a configured fixture observation/verification for a scripted variant id" using a `label_collision` fixture). Honest limitation: this defect class was originally found only by real Android-device rendering (CC-05C-DIAGRAM-FIX #3), and CC-05D's automated tier reviews the deterministic SVG-derived image, not a native device screenshot — see the architecture doc §D/§R for the explicit distinction between what each tier proves.

## 4. Mechanical / semantic / human-review results (current run)

- Mechanical gate (`npm run visuals:check:strict`): **PASS** — 0 orphan contracts, 0 dangling references, 0 missing contracts for governed-pilot blueprints, 0 incomplete variant coverage, 0 answer-leakage failures, 0 rendered-artefact geometry failures (3 arrows checked).
- Semantic audit (`npm run visuals:audit:semantic`, `MockSemanticReviewProvider`): 18/18 variants reviewed, **18 pass / 0 warn / 0 fail** (all mock-provider default results — see §5 for why this is not a real AI review). Reviewer identity recorded as `mock-provider-v1` throughout — mechanically distinguishable from a real provider identity everywhere it appears in evidence.
- Human-review queue: **5 sampled** (deterministic sample from the 18 high-confidence passes, seed 1), **0 mandatory** (nothing failed/warned/required escalation from the mock provider's honest default "pass" behaviour). No human dispositions have been recorded yet (`human-review.json` does not exist — none requested, none performed, per this task's scope).
- Cache behaviour verified: a second `visuals:audit:semantic` run reused all 18 results from cache (0 fresh reviews), confirming staleness detection correctly treats an unchanged image+contract+prompt+schema+reviewer tuple as reusable.

## 5. Was a REAL Claude semantic audit run? No — and exactly why

No `ANTHROPIC_API_KEY` was available in this implementation environment, and no live-network semantic review was attempted (per the task brief's explicit instruction: "DO NOT fabricate live Claude results"). Beyond credential absence, `AnthropicVisionProvider`'s review methods are honestly implemented as **not-yet-wired stubs** (`ProviderNotImplementedError`, tested in `anthropic-provider.test.ts`) because Anthropic's Messages API image blocks require raster formats (PNG/JPEG/GIF/WEBP), and this package's render-capture pipeline produces real, computed **SVG**, not raster — see `anthropic-provider.ts`'s header comment for the full reasoning. Adding an SVG→PNG rasterisation dependency (`sharp`/`resvg`/a headless browser) was deliberately deferred rather than added speculatively in a pass that could not exercise it end-to-end anyway (no credential, and a new native-binary dependency carries its own security-audit-gate and build-environment risk that deserves its own review, not a rushed addition).

**Additional Claude Code manual inspection attempted, and honestly reported as unavailable:** the task brief invites using Claude Code's own image-viewing capability as an additional proving pass if practical. This was attempted directly — the `Read` tool was pointed at a generated `.svg` file. It returned the file's raw XML/text content, not a rendered image; this environment's image-viewing capability does not rasterise SVG. No fabricated "I looked at the image and it's correct" observation was recorded. This is an honest, tested limitation, not a gap papered over.

**What is real, working evidence instead:** the full provider-abstraction architecture, the `MockSemanticReviewProvider`'s deterministic pipeline (genuinely exercised end-to-end — 18 real reviews with real, schema-validated, structured output, real caching, real human-review-queue generation), and every piece of mechanical/geometric evidence in §3-4, which required no AI call at all. The system is provider-ready: setting `VISUAL_GOVERNANCE_PROVIDER=anthropic` plus `ANTHROPIC_API_KEY` and completing the two `throw` bodies in `anthropic-provider.ts` (documented inline, step-by-step) is the entire remaining path to a live review.

## 6. Tests / checks run and results

| Gate | Result |
|---|---|
| Root Vitest (`npm run test:unit`) | **341/341 passed** (up from 235 pre-CC-05D; +106 new tests across visual-governance schema/canonical-variants/mechanical-check/audit-cache/sampling/human-review/semantic-review/geometry/mobile-fixture-cross-check/orchestrator) |
| Mobile Jest (`npm run mobile:test`) | **119/119 passed**, 31 suites (up from 104/29; +15 new tests: render-tree-to-svg 12, capture-renders 3), 8/8 structural snapshots unchanged |
| `npm run typecheck` | PASS, 0 errors, all workspaces + `scripts/content` + `scripts/boundary-checks` + `scripts/security` + `scripts/visual-governance` |
| `npm run lint` | PASS, 0 errors (2 pre-existing, unrelated warnings in `learn/__tests__/*` from CC-05C, untouched by this task) |
| `npm run content:pedagogy:check` | PASS, unchanged (84/84 question blueprints, 0 gaps) |
| `npm run engine:prove:check` | PASS, unchanged (all 84 governed blueprints executable) |
| `npm run engine:dimensions:check` | PASS, unchanged |
| `npm run check:mobile-boundary` | PASS |
| `npm run security:audit` (NORMAL mode) | PASS — same 2 pre-existing accepted exceptions (`SEC-EXC-001`/`SEC-EXC-002`), **no new dependency added by CC-05D, so no new advisory possible** |
| `npm run visuals:check:strict` (new CC-05D gate) | PASS |
| `npm run visuals:render` / `visuals:audit:semantic` / `visuals:report` | All run successfully end-to-end, artefacts verified present and internally consistent |
| `expo-doctor` | **21/21 passed** |
| Metro/Hermes export (Android) | Succeeds, 1989 modules, output confirmed via `file` as "Hermes JavaScript bytecode, version 98" — CC-05D's tooling code is Jest-test-only and does not enter the production bundle |

## 7. Security impact

No new npm dependency was added. No new HIGH/CRITICAL advisory was introduced (confirmed: `security:audit` NORMAL-mode result is byte-identical in coverage to the pre-CC-05D baseline). No secret, API key, or credential is committed anywhere in this change (`ANTHROPIC_API_KEY`, if ever used, is read from the environment only, only inside `AnthropicVisionProvider`'s constructor, never at import time — proven by `anthropic-provider.test.ts`'s "does not require ANTHROPIC_API_KEY merely to import this module" test and by every other test in the suite running without that variable set). No learner data is part of any evidence artefact — every reviewed image is fixed, deterministic, authoring-time instructional content.

## 8. Files added / changed

**New:**
- `docs/architecture/CC-05D-INSTRUCTIONAL-VISUAL-GOVERNANCE-AND-SEMANTIC-QA.md`
- `packages/content-schema/src/visual-governance.ts` (+ `.test.ts`)
- `scripts/visual-governance/` (entire directory: `tsconfig.json`, `data/{cc05d-visual-contracts-unit202.ts, canonical-variants.ts(+test)}`, `check-visual-governance.ts(+test)`, `check-mobile-canonical-variants-fixture.test.ts`, `artifact-geometry-check.ts(+test)`, `audit-cache.ts(+test)`, `sampling.ts(+test)`, `human-review.ts(+test)`, `run-semantic-audit.ts(+test)`, `generate-report.ts`, `semantic-review/{provider.ts, prompts.ts, mock-provider.ts(+test), anthropic-provider.ts(+test)}`)
- `apps/mobile/src/lib/visual-governance/` (`canonical-variants-fixture.ts`, `render-tree-to-svg.ts(+test)`, `capture-renders.test.tsx`)
- `reports/instructional-visuals/` (generated evidence: `manifest.json`, `renders/*.svg` ×18, `semantic-audit.json`, `human-review-queue.json`, `mechanical-audit.json`, `index.html`)
- `docs/architecture/evidence/CC-05D-INSTRUCTIONAL-VISUAL-GOVERNANCE-EVIDENCE.md` (this document)

**Modified (bounded):**
- `docs/architecture/CC-05-PEDAGOGICAL-KNOWLEDGE-AND-QUESTION-ARCHITECTURE.md` — status-line update (CC-05C now APPROVED/COMPLETE; CC-05D referenced) and one new, additive §45 cross-referencing the CC-05D document — no existing section rewritten.
- `packages/content-schema/src/index.ts` — one new barrel export line + one comment update.
- `package.json` — 6 new `visuals:*` scripts; `typecheck`/`lint` extended to cover `scripts/visual-governance`.
- `apps/mobile/package.json` — 1 new `visuals:render` script.
- `.github/workflows/ci.yml` — 1 new step (`visuals:check:strict`), inserted after `engine:dimensions:check`.

## 9. Deferred items (honestly stated, not silently dropped)

- **Live Anthropic semantic review**: not wired (§5) — requires SVG→PNG rasterisation + completing two documented method bodies.
- **Renderers for the 3 non-pilot diagram blueprints** (`circuit.series_parallel_mixed`, `graph.waveform_sine`, `instrument.measurement_connection`): out of scope, tracked and reported by the mechanical check, never silently dropped.
- **CI-wired evidence-staleness gate**: `visuals:check:strict` (mechanical, deterministic, no artefact dependency) is CI-wired; a stronger gate that also validates the *committed* `reports/instructional-visuals/` evidence is current/hash-matching was deliberately not added to CI in this pass, to avoid rushing a fragile cross-runner (Vitest reads what Jest produces) dependency into the default pipeline under time pressure. The command exists and works locally (`npm run visuals:all`); wiring it into CI is a reasonable, bounded follow-up.
- **True pixel-level native visual regression**: remains exactly as deferred in CC-05C's own evidence doc — no image-diffing infrastructure exists in this repository. CC-05D's SVG-artefact tier is a materially stronger automated audit subject than JSX source (§D), but is explicitly not a substitute for native-device rendering verification.
- **Human review**: the workflow/CLI/hash-binding is implemented and tested; no actual Product Owner disposition has been recorded (nothing required it in this run — 0 mandatory items; the 5 sampled items await optional Product Owner spot-check).

## 10. Remaining limitations

The mock-provider evidence in §4 is real, working, schema-validated pipeline evidence — it is **not** evidence that any actual image is pedagogically correct beyond what the mechanical/geometry checks already independently prove. Treat "18/18 pass" from the mock provider as "the pipeline correctly processed 18 artefacts end-to-end", not as "an AI confirmed these are pedagogically sound" — that claim can only be made once a live provider genuinely reviews the images.

## 11. Definition of Done — status against the task brief's own checklist

All items are met except the three explicitly deferred above (live provider path is implemented-as-scaffold, not "implemented and exercised"; renderer coverage for the 3 non-pilot blueprints is out of scope by design; the CI evidence-staleness gate beyond the mechanical check is a documented follow-up). No item was silently skipped without the corresponding note above.

## 12. Approval scope — precise qualification (2026-08-17)

**APPROVED**: the CC-05D instructional-visual governance architecture; the `VisualSemanticContract` model; visual pedagogical traceability; the canonical semantic-variant framework; the deterministic rendering/audit artefact framework; mechanical QA; answer-leakage checks; the two-pass semantic-review architecture; the provider abstraction; mock-provider integration/testing; audit identity/cache/staleness; human escalation; deterministic PASS sampling; hash-bound human-review evidence; the HTML human-readable visual catalogue (including the truthfulness correction in §0); machine-readable visual audit evidence; the deterministic CI visual-governance gate.

**NOT APPROVED / still requires further work**: visual/pedagogical quality of the current instructional images (§0, explicit open requirement); completeness of renderer coverage for every governed diagram blueprint (3 of 7 have no renderer — §9); real AI/vision semantic approval of the current images (none has been run — §5); native pixel-level visual regression (not implemented anywhere in this repository); production learner-facing visual design (the current diagrams are proving content and must not become accidental production visual-design precedent merely because the governance workflow is approved).

## 13. Closeout commit / CI chain

**Implementation commit**: `0d17baa33ecde1bf42d5a8700ea703d1f67f0b1e` ("feat: establish CC-05D instructional visual governance"), pushed to `origin/main`.

That commit's own CI run ([`31993335538`](https://github.com/Dan-Spencer-UK/adaptive-learning-platform/actions/runs/31993335538)) failed — but on the Playwright e2e job's pre-existing "a returning learner can sign in again without a duplicate profile row" test, a timing-sensitive test entirely unrelated to CC-05D (no CC-05D code path touches auth/Playwright/apps/web). Investigated and hardened forward in `80213dded44636b0518e12f6f419c13f2c4bef28` (widened one assertion's wait after ruling out rate-limiting and state-leakage as causes; local reproduction confirmed a fix). That commit's own CI run then failed on an unrelated upstream Expo SDK 57 patch-version drift blocking `expo-doctor` (Expo published new SDK 57 patches mid-session). Fixed forward in `c4a5263e0b1e5c7a9e820231a5ab3ab8b191c139` (`npx expo install --fix`, confined to the Expo package family, plus a narrow, non-broadening `dependencyPath` identity update to the pre-existing accepted `SEC-EXC-001`/`SEC-EXC-002` exceptions, made necessary because the governed audit gate re-derives and exact-matches the live dependency path on every run).

**Current state**: GitHub Actions CI run [`32058475066`](https://github.com/Dan-Spencer-UK/adaptive-learning-platform/actions/runs/32058475066), on `origin/main` HEAD (which includes CC-05D unchanged since `0d17baa`), passed fully green across all four jobs — including `visuals:check:strict`, mobile Jest, `expo-doctor` 21/21, Android + iOS Metro/Hermes export (both confirmed real Hermes bytecode v98), and the full 7/7 Playwright suite (including the now-hardened returning-learner test).
