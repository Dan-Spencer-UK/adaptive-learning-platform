# CC-05D — Instructional Visual Governance, Semantic QA & Human-Readable Audit

**Project:** Adaptive Learning Platform
**Status:** Approved durable design specification — governance/QA workflow and architecture (Product Owner / Project Architect, 2026-08-17). **Not approved**: current instructional-image visual/pedagogical quality; real AI/vision semantic review (not yet run); completeness of renderer coverage across all 7 governed diagram blueprints; native pixel-level visual regression; production learner-facing visual design. See [`docs/architecture/evidence/CC-05D-INSTRUCTIONAL-VISUAL-GOVERNANCE-EVIDENCE.md`](evidence/CC-05D-INSTRUCTIONAL-VISUAL-GOVERNANCE-EVIDENCE.md) §0/§12 for the precise scope.
**Applies to:** every instructional visual currently rendered by `apps/mobile`, and every future one, across every qualification the platform ever governs.
**Follows:** CC-05A (pedagogical knowledge structure), CC-05B (deterministic engine), CC-05C (native learner-session proving slice, APPROVED / COMPLETE).
**Design intent:** make instructional visuals first-class governed pedagogical artefacts with a scalable, mostly-automated, human-escalating QA pipeline — without introducing AI/LLM dependency into the learner runtime.

---

## 0. Why this package exists

CC-05C's own Product-Owner Android-emulator review found three real defects that every existing automated check missed:

1. A lesson named "the right-hand grip rule" while showing a generic magnetic-force diagram — the diagram type was structurally valid, correctly typed, correctly wired to its governed blueprint, and simply the wrong teaching visual for the concept.
2. A current-direction arrow on a circuit diagram that sat on the correct wire but pointed perpendicular to it, not along it — a geometry defect invisible to any check that only inspects props/JSX, because the arrowhead's *shape* was fine; only its *orientation relative to the line it labelled* was wrong.
3. A text-label collision between "Field: counterclockwise" and "(current direction)" that was only visible on the real Android render — Jest's structural `toJSON()` snapshot has no text-layout engine and cannot detect visual overlap.

Every one of these diagrams passed TypeScript, passed structural Jest tests, rendered without throwing, and referenced the correct governed blueprint. None of that was sufficient. The gap is architectural, not incidental: nothing in CC-05A/B/C's model asks *"does the rendered image actually teach the named concept correctly, with nothing missing, nothing wrong, and nothing colliding?"* CC-05D closes that gap.

## 1. Scope

**In scope**: a governed semantic contract for each instructional visual currently rendered in the mobile proving slice; deterministic canonical-variant rendering to a real, inspectable artefact; mechanical (code-provable) QA; a two-pass AI-vision semantic QA architecture with a provider abstraction, mock provider, and Anthropic-vision provider scaffold; hash-bound audit caching; human-review escalation and deterministic sampling; a human-readable HTML audit report and machine-readable JSON evidence; a CI-time governance gate.

**Out of scope** (explicitly not this package): building renderers for the 3 governed diagram blueprints that have no mobile component yet (`circuit.series_parallel_mixed`, `graph.waveform_sine`, `instrument.measurement_connection` — see §S); redesigning any existing diagram's visuals (the correction pass already happened in CC-05C-DIAGRAM-FIX); any change to `packages/calculation-engine` generation logic; any learner-runtime AI; the full CC-06+ published-content projection pipeline; pixel-level Android-native screenshot diffing (a distinct, still-deferred tier — see §D).

## 2. Core architectural principle

An instructional visual is not acceptable merely because it type-checks, renders, and structurally snapshot-matches. The platform must be able to answer, for every governed visual: what concept it teaches, which pedagogical entities it supports, what a learner must see for it to teach that concept correctly, what must never appear, what varies, what is invariant, whether it is currently in teaching or assessment mode, and — critically — whether the *actual rendered image*, not its source, has been checked against that contract by an independent (mechanical or semantic) reviewer, escalating to a human wherever a machine cannot be confident.

## A. Visual semantic contracts

`VisualSemanticContract` (`packages/content-schema/src/visual-governance.ts`, `visualSemanticContractSchema`) is the governed, Zod-validated, serialisable artefact that answers those questions for one diagram blueprint. It deliberately does **not** extend `DiagramBlueprint` (`pedagogy.ts`) — `DiagramBlueprint` is a rendering *parameter contract* (what values a diagram accepts); `VisualSemanticContract` is a *teaching contract* (what the rendered result must mean). Keeping them separate means CC-05D never has to touch the already-approved CC-05A schema or its 84/84-proven corpus.

A contract states: a stable id/version; the `diagramBlueprintId` it governs; `teachingIntent` (a human sentence); `representationRole` (reusing CC-05A's existing `representationRoleSchema` — decorative/supporting/essential — rather than inventing a parallel enum); the assertion family/families, atomic assertion identifiers, capability/capabilities and question-blueprint ids it supports (§B); `modeApplicability` (teaching/assessment/both); `mustShow`/`mustNotShow` element lists; `semanticMappings` (named visual element → represented concept, e.g. `thumb` → `conventional_current_direction`); `directionalRelationships` (a from/to/relationship triple, e.g. current direction determines field rotation); `variantExpectations` (per-parameter-value expected differences); `invariantExpectations` (what must hold across every variant); `answerDisclosure` (which elements are the assessed answer and whether the current mode may reveal them); `accessibilityExpectations`; and an optional `knownAmbiguity` note flagging a concept a semantic reviewer should treat with extra scrutiny. The schema is intentionally domain-agnostic — no field name mentions electricity, hands, or circuits — so a future plumbing or anatomy diagram uses the identical shape.

## B. Traceability — the real pedagogical chain, not a false 1:1

The HTML report and machine-readable evidence expose the full chain per visual, matching CC-05's own governing model (its §1, quoted in §0 above) extended one link further:

```text
Source / provenance
  ↓
Atomic Assertion(s)
  ↓
Assertion Family
  ↓
Capability
  ↓
Diagram Blueprint (CC-05A)
  ↓
Visual Semantic Contract (CC-05D)
  ↓
Canonical Rendered Variant (CC-05D)
  ↓
Question Blueprint(s) that use it
  ↓
Mechanical + Semantic + Human QA Evidence (CC-05D)
```

A contract's `relevantQuestionBlueprintIds` is a *list*, not a single id, because one diagram routinely supports several question blueprints (`circuit.series_resistors` alone backs `series.calculate_total_resistance`, `series.solve_missing_component`, `series.calculate_voltage_drop`, `series.identify_dominant_component` and `series.interpret_diagram` in the live corpus). Nothing in the schema or tooling assumes a 1:1 image-to-assertion relationship.

## C. Canonical visual variants

`scripts/visual-governance/data/canonical-variants.ts` enumerates, per contract, the finite set of *pedagogically distinct* parameter combinations — never arbitrary random numeric permutations. For an enum-kind `DiagramBlueprint` parameter (e.g. `current_direction: into_page | out_of_page | left_to_right`), every allowed value that actually changes the drawn geometry is one canonical variant. For `component_count`/`branch_count` (2/3/4), every value is included because each produces genuinely different topology. Non-enum numeric parameters that only change scale/spacing, not meaning, are deliberately **not** exploded into variants — that would be arbitrary-permutation coverage, which §9 of the task brief explicitly rejects. Teaching-mode (answer revealed) and assessment-mode (answer withheld) are separate canonical variants wherever a contract declares `answerDisclosure`, because they are semantically different images, not just different parameter values. Every canonical variant has a stable, deterministic id: `{contractId}@{contractVersion}::{sortedParams}::{mode}`.

## D. Deterministic rendering for audit — what is, and is not, proven

The audit subject is the **actual rendered React Native SVG element tree**, not JSX source, not the diagram's TypeScript, not accessibility-label strings alone. `apps/mobile/src/lib/visual-governance/render-tree-to-svg.ts` is a pure function (no RN import) that walks the exact `toJSON()` output `@testing-library/react-native` already produces for these components (the same tree the existing structural-snapshot tests assert against — see the `RNSVGSvgView`/`RNSVGGroup`/`RNSVGPath`/`RNSVGLine`/`RNSVGCircle`/`RNSVGRect`/`RNSVGText`/`RNSVGTSpan` node types visible in `apps/mobile/src/components/__snapshot-tests__/__snapshots__/proving-visuals.snapshot.test.tsx.snap`) and serialises it into a real, standalone, openable `<svg>...</svg>` document — resolving each `react-native-svg` colour prop's internal `{payload: <ARGB32>, type: 0}` `processColor` representation back into a `#RRGGBB`/`#RRGGBBAA` string, and mapping RN-SVG element/prop names onto their standard SVG equivalents (`RNSVGPath`→`path` `d`, `RNSVGLine`→`line` `x1/y1/x2/y2`, `RNSVGText`+`RNSVGTSpan`→`text`, etc.).

This is a genuinely stronger audit subject than JSX source: it reflects the real, computed geometry and text position the component actually produced for that exact prop set, using the identical rendering pipeline (`react-native-svg`'s own React reconciliation) already trusted for the existing structural snapshots. It is **not** a pixel-level native screenshot. The render-capture step (`apps/mobile/src/lib/visual-governance/capture-renders.test.ts`, run via `npm run visuals:render`) must execute under Jest/`jest-expo`, because `react-native-svg`'s components require RN's native-module mock layer to construct their element tree at all — there is no way to render them under a bare Node script, which is why this is implemented as a Jest test (an established pattern in this repository: `scripts/content/check-cc05c-proving-fixture.test.ts` is likewise simultaneously "a test" and "a mechanical check").

**What each rendering tier actually proves, stated precisely (per task-brief §36, "do not overclaim"):**

| Tier | Proves | Does not prove |
|---|---|---|
| Structural Jest snapshot (`toJSON()` diff, pre-existing) | Component tree/props have not silently changed since the last accepted snapshot | Nothing about visual correctness the first time a snapshot is accepted; no text-layout/collision detection |
| CC-05D deterministic SVG capture (this package) | The real computed geometry/text/colour the component produces for a given prop set, openable and inspectable as an actual image | Native font-metrics text wrapping/kerning; native device rendering quirks; multi-device-size behaviour |
| Real Android-emulator render (CC-05C-DIAGRAM-FIX's manual pass) | Genuine on-device rendering in one tested configuration, including real text-layout collision (this is exactly how CC-05C's label-collision defect was found) | Every device size/OS version/accessibility text-scale setting |

Native-render qualification (the third row) remains a distinct, still-manual-until-CI-has-device-access tier — CC-05D does not claim to replace it, and the report explicitly labels which tier each finding came from (see §L).

## E. Mechanical validation

`scripts/visual-governance/check-visual-governance.ts` (`npm run visuals:check` / `visuals:check:strict`) proves, deterministically and without any AI call, everything code can prove more reliably than a vision model:

- every `VisualSemanticContract.diagramBlueprintId` resolves to a real `DiagramBlueprint` in the live CC-05A corpus (no orphan contracts);
- every contract's `assertionFamilyId(s)`, `capabilityId(s)`, `relevantQuestionBlueprintIds` resolve to real corpus records (no dangling references);
- no duplicate contract ids/versions;
- for every one of the 7 governed diagram blueprints, whether a mobile renderer component exists (`renderer_present`) and whether a contract exists (`contract_present`) are reported independently — a **governed pilot blueprint** (one with a real renderer, currently 4 of 7) missing a contract is a hard failure in `--check` mode; a blueprint with no renderer yet is reported as a tracked, non-fatal gap (`renderer_missing`), never silently ignored and never used to justify building a new renderer (out of scope, §1);
- every enum-kind `DiagramBlueprint` parameter's allowed values are covered by at least one canonical variant (§C) for that contract;
- every declared `answerDisclosure` element is mechanically absent from the assessment-mode rendered artefact where structurally knowable (the element simply is not present in the props passed for that mode, not merely styled invisible);
- geometry invariants operate on the **actual captured render artefact**, not the component's internal helper functions in isolation (CC-05C already unit-tests `arc-geometry.ts` directly; CC-05D adds an independent, artefact-level check — parsing the rendered `<line>`/`<path>` coordinates for the series-circuit current arrow out of the real SVG file and proving the arrowhead's tangent direction is collinear with the wire it sits on, reusing no internal component code) — this is the exact regression class from CC-05C's defect #2 (§0), now proven against the shipped artefact rather than only the isolated geometry helper;
- SVG dimension/viewBox sanity, no `NaN`/`Infinity` coordinates, deterministic re-render identity (rendering the same contract+variant twice in the same process yields byte-identical SVG).

## F. Semantic vision-model validation (two-pass) — see §11 for the pass split, this section covers the schema

Semantic review output is never accepted as free-form prose. `packages/content-schema/src/visual-governance.ts` defines `blindObservationSchema` (Pass A) and `semanticVerificationSchema` (Pass B) as strict Zod schemas; any provider response that fails to parse is treated as a hard reviewer failure requiring human escalation, not silently coerced.

`SemanticVerification.status` is `pass | warn | fail`; `confidence` is a discrete `high | medium | low` (never an uncalibrated float used as a publication gate, per task-brief §11) — `medium`/`low` automatically sets `requiresHumanReview: true`. Every verification carries `reviewerIdentity`, `promptVersion`, `schemaVersion`, and the exact `imageHash`/`contractHash` it was run against (§J).

## G. Blind observation / semantic verification separation

**Pass A (blind observation)** receives only the rendered image plus generic context ("this is an instructional visual for a vocational-qualification learning app") — never the contract's `mustShow`/`semanticMappings`/expected answer. It returns structured, schema-validated observations only: visible objects/labels/arrows, arrow directions, apparent topology/relationships, rotation sense if discernible, label overlap/clipping/legibility concerns, and any observed ambiguity. This ordering exists specifically to avoid confirmation bias — a reviewer told "this should show a hand with the thumb pointing X" before looking at the image is far more likely to report seeing exactly that, whether or not it is actually true.

**Pass B (semantic verification)** receives Pass A's observations plus the full `VisualSemanticContract`, the relevant assertion/capability/question-blueprint context, and the variant's mode, and independently judges whether the observed visual satisfies the contract, producing the `SemanticVerification` result (§F). Pass A's output is retained in the evidence artefact alongside Pass B's, so a human reviewer can see exactly what the model actually noticed before being told what to look for.

## H. Human-review escalation

Human review is mandatory (`requiresHumanReview: true`, enqueued into `reports/instructional-visuals/human-review-queue.json`) whenever: Pass B status is `fail`; status is `warn` and not already dispositioned; confidence is `medium` or `low`; the diagram blueprint's `type` has never before had an approved human review recorded (novel-visual-type escalation); the response fails schema validation ("reviewer uncertain"/unparseable); a required semantic contract is missing entirely; or the deterministic SVG capture and any available native-render evidence materially disagree (flagged manually until an automated diff exists). A `pass` result with `high` confidence does **not**, by itself, require review — it instead becomes eligible for the random sample (§I), so the Product Owner sees a rotating cross-section of "everything looked fine" results rather than only ever seeing problems.

## I. Random human sampling

`scripts/visual-governance/sampling.ts` selects a deterministic sample from the current pool of high-confidence `pass` results using a seeded PRNG (mulberry32, the same generator family CC-05B already uses for question generation, for consistency) keyed by `(contentRelease, sampleSeed)` — repeatable, not biased toward the first N items in file order, every selection recorded (which items, which seed, which release) so a rerun with the same inputs reproduces the same sample. Sample size is a configurable policy value (`DEFAULT_SAMPLE_SIZE` in that module, currently a conservative fixed count appropriate to the current small pilot corpus), not a hard-coded percentage claimed to be product-authorised — no such percentage exists in current governance, so the code is written to make that value trivially overridable rather than asserting false authority over it.

## J. Audit caching / identity

An audit result is reusable only while **every** relevant identity input is unchanged: the rendered SVG artefact's own SHA-256 (`imageHash`), the `VisualSemanticContract`'s canonical-JSON SHA-256 (`contractHash`), the Pass A/B prompt template versions, the response schema version, and the reviewing provider/model identity. `scripts/visual-governance/audit-cache.ts` computes these hashes and exposes `isStale(previousEntry, currentInputs)` — if any hash or version differs, the cached result is discarded and the artefact re-enters the review queue. A cached audit for hash `H1` is never treated as evidence for an image whose current hash is `H2`, full stop — this is enforced structurally (the cache is keyed by the full identity tuple, not just a visual id), not by convention.

## K. Publication gating

`npm run visuals:check:strict` (the CI-time entry point) fails when: any governed pilot blueprint lacks a contract; canonical variant coverage is incomplete; any mechanical check fails; any semantic audit is missing or stale for a pilot artefact *and* policy requires a current audit before publication; any unresolved semantic `fail` exists; any unresolved mandatory human-review item exists; or a contract references a governed entity that no longer exists. Deliberately **not** part of this gate: calling a live external vision API on every CI run (§N) — CI validates that current semantic-audit *evidence* is present, current (hash-matching, per §J) and acceptable, it does not itself spend API credits, so ordinary pull requests never trigger non-deterministic external cost or availability dependence.

## L. Human-readable HTML audit report

`reports/instructional-visuals/index.html`, generated (never hand-edited) by `scripts/visual-governance/generate-report.ts` from the canonical JSON evidence (§M) — the report and the JSON are two views of one source of truth, never two independently-maintained copies. Every visual card shows the actual rendered image first (as the central object, not buried under metadata), then human-readable teaching intent, the traceability chain (§B), variant parameters, mode, mechanical result, Pass A observation, Pass B result with any issues, human-review status, and — for transparency about evidence strength — which rendering tier (§D's table) each piece of evidence came from. Filterable by unit, assertion family, capability, diagram/visual type, semantic status, mechanical status, human-review requirement, and mode. Self-contained (inline CSS, no build step, no server required to open locally — a static file a non-developer can double-click).

## M. Machine-readable audit evidence

`reports/instructional-visuals/`:
- `manifest.json` — every canonical variant, its identity, and a relative path to its rendered `.svg` artefact (produced by `visuals:render`);
- `mechanical-audit.json` — §E's results per variant;
- `semantic-audit.json` — §F/G's Pass A + Pass B results per variant, with cache-hit/stale flags;
- `human-review.json` — §H/§25's recorded human dispositions, each hash-bound to the image/contract it was reviewed against.

## N. CI / development responsibilities

CI (`.github/workflows/ci.yml`, `checks` job) runs `npm run mobile:test` (which now also executes the render-capture test, since it lives under `apps/mobile`'s own Jest suite — no separate CI step needed for rendering) and a new `npm run visuals:check:strict` step immediately after the existing `engine:dimensions:check` step (before the mobile-boundary/Jest steps, preserving the existing "content/engine gates first" convention). CI never calls a live external vision provider — see §K. A human developer/content author runs `npm run visuals:audit:semantic` locally (or in an authorised environment with `ANTHROPIC_API_KEY` set) to refresh semantic evidence, then commits the regenerated JSON/HTML, exactly mirroring the existing `content:generate`/`content:check` and `db:types`/`db:types:check` "regenerate deterministically, commit, diff-check in CI" discipline already used elsewhere in this repository.

## O. Cost / privacy / security boundaries

No learner data is ever part of a semantic-review payload — every reviewed image is authoring-time governed instructional content, seeded with fixed demo parameters, never a learner's actual session state. No API credential is committed; `ANTHROPIC_API_KEY` (if used) is read from the environment only, at call time, never at import time, and normal unit tests (mock provider) never require it. No dependency was added for image rasterisation in this pass — see the evidence document's deferred-items section for why, and exactly what remains to wire a live Anthropic-vision call end-to-end. Every existing security/audit gate (`npm run security:audit`) continues to run unmodified.

## P. Versioning / backwards compatibility

`VisualSemanticContract`, `BlindObservation`, `SemanticVerification` and prompt templates are each independently versioned (`contractVersion`, `schemaVersion`, `promptVersion`). Changing a contract's meaning bumps `contractVersion`, which changes `contractHash`, which invalidates cached semantic audits for it (§J) — this is the only invalidation path; nothing depends on remembering to manually clear a cache.

## Q. Future visual types

The schema carries no domain-specific field names. `diagramTypeSchema` (already extensible in `pedagogy.ts`: `electrical_circuit | magnetic_field | mnemonic | graph | instrument_connection | waveform | mechanical | component_symbol` — the latter two added CC-11.3) is the only place a genuinely new *rendering family* (e.g. a raster equipment photograph, an annotated process diagram) would need a new enum value; `VisualSemanticContract` itself needs no change to govern it, since `mustShow`/`semanticMappings`/etc. are already generic strings, not typed per-domain fields. `symbolStandard` (CC-11.3, `visual-governance.ts`) is the one field CC-05D's schema has since gained: an optional enum (currently `UK_IEC` only) recording which schematic-symbol drawing convention a `component_symbol`-type contract is governed against. Video/animation storyboard QA is explicitly not defined here (task-brief §32) — a future package's problem.

**Premium/illustrated (class B/C) visuals** are a distinct future visual-type question this section anticipated but did not answer: [`PREMIUM-INSTRUCTIONAL-VISUAL-PRODUCTION-PIPELINE.md`](PREMIUM-INSTRUCTIONAL-VISUAL-PRODUCTION-PIPELINE.md) (2026-08-23) now governs *how* such a visual would be produced — reference-first grounding, a hard authority boundary between deterministic geometry and generated imagery ([`ADR-0004`](adr/ADR-0004-deterministic-authority-over-generated-instructional-imagery.md)), and a premium quality bar — while this document remains the unchanged authority for *how any visual, once produced, is validated*. No visual in the current corpus is class B or C; every one built through CC-11.3 remains class A (deterministic technical), exactly this document's original scope.

## R. Native-render limitations

Documented plainly in §D's table: this package's automated tier proves computed SVG geometry/text, not native device rendering. It cannot, by itself, have caught CC-05C's label-collision defect (§0 #3) — that required the real Android render. What it *can* do differently going forward: Pass A's blind observation of the SVG-derived image explicitly asks about label overlap/clipping (§G), giving the semantic-QA layer a real (if imperfect, SVG-text-metrics-based rather than native-font-metrics-based) chance to flag collision-shaped defects before they reach a human on real hardware — narrowing, not eliminating, the gap that let defect #3 through undetected until manual review.

## S. Relationship to CC-05A/B/C

CC-05D adds no new field to any CC-05A schema, changes no CC-05B engine logic, and modifies no CC-05C renderer component's behaviour (only new pure helper/test code is added). The 3 CC-05A-governed diagram blueprints with no mobile renderer (`circuit.series_parallel_mixed`, `graph.waveform_sine`, `instrument.measurement_connection`) are a pre-existing gap this package inherited, not introduced — CC-05D's mechanical check reports them (§E) so the gap is tracked and visible rather than invisible, but building those renderers is explicitly out of scope (§1): doing so here would be exactly the "broaden scope into general product UI redesign" the task brief prohibits.

## T. Learner-runtime AI prohibition

Every AI-assisted step defined by this package (Pass A, Pass B, the Anthropic provider) runs only from `scripts/visual-governance/` — content-authoring/CI-time tooling, under the same `scripts/content/README.md` boundary rule already governing this repository ("never imported by the learner-runtime domain engines"). `apps/mobile` imports nothing from `scripts/visual-governance/`; the mobile app continues to consume only deterministic, already-approved renderer components and the `@alp/calculation-engine`'s deterministic `DiagramInstance` output, exactly as before CC-05D. No learner session ever triggers, waits on, or is affected by a semantic-QA call. This satisfies Product Principles 12/19 (deterministic-first runtime, no runtime AI in the launch-critical path) and the Security Baseline's secrets rule (an AI provider key, if ever used, is CI/dev-tooling-only and must never ship inside `apps/mobile`/`apps/web`).

---

*This document is the durable design authority for CC-05D. Implementation evidence — actual counts, actual test results, actual audit output, exactly what was and was not run — lives in [`docs/architecture/evidence/CC-05D-INSTRUCTIONAL-VISUAL-GOVERNANCE-EVIDENCE.md`](evidence/CC-05D-INSTRUCTIONAL-VISUAL-GOVERNANCE-EVIDENCE.md), not here.*
