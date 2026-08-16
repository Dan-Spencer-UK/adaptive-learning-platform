# CC-05C Native Learner-Session Integration Proving Slice — Evidence

Implementation evidence for CC-05C — proving the governed CC-05A pedagogical model and the CC-05B deterministic calculation/question engine inside the actual native mobile learner product (`apps/mobile`), end-to-end: governed assertion family → representation → question blueprint → deterministic instance → native learner interaction → marking → learner evidence.

This is a **proving slice**, not a full course UI. It demonstrates the path for four representative governed families (Ohm's law, series resistance, parallel resistance, magnetism/electromagnetism), not the full 84-blueprint Unit 202 inventory CC-05B already proves executable at the engine layer. CC-05A and CC-05B are unmodified by this work — `packages/content-schema`, `packages/calculation-engine` and `scripts/content/data/cc05a-pedagogy-unit202.ts` have zero diffs (confirmed by `content:pedagogy:check`, `engine:prove:check`, `engine:dimensions:check` all remaining green and unchanged in this task).

**Status: implementation-complete, review-ready.** Not yet reviewed or approved by Product Owner / Project Architect. Nothing staged, committed or pushed as part of this task, per its explicit instructions.

## 0. CC-05C-DIAGRAM-FIX: instructional imagery fidelity correction pass

A manual Android emulator review by the Product Owner (§13's runtime evidence made this review possible) found two imagery defects, both corrected in this pass without altering CC-05B, CC-05A or the deterministic engine boundary:

1. **Right-hand grip rule was not a hand-based visual.** The magnetism lesson's "right-hand grip rule" caption previously labelled `MagneticForceDiagram` (poles + a uniform field + a force arrow — the motor-principle/Fleming's-left-hand-rule diagram), which never drew a hand and is a genuinely different physical rule. Fixed by (a) adding the governed `magnetism.interpret_field_direction` question blueprint and its `magnetic.field_conductor_direction` diagram blueprint — both real, pre-existing CC-05A/CC-05B content this proving slice had not yet exercised — to the proving-content fixture, and (b) building a new `RightHandGripRuleDiagram` component: a genuine stylised right hand (palm, one distinctly-coloured thumb, four curled fingers), with the thumb always shown pointing along the given current direction and the fingers' curl direction (the assessed answer) revealed only in teaching contexts, mirroring the existing reveal/withhold pattern. The motor-principle diagram is now in its own correctly-titled lesson section ("Motor principle (force on a current-carrying conductor)"), separate from the grip-rule section.
2. **Series-circuit current-direction indicator did not point along the wire.** The triangle marking current direction sat on the horizontal return wire but pointed straight down, perpendicular to the conductor it was meant to label. Fixed by extracting shared, unit-tested arrowhead/arc geometry helpers (`components/diagrams/arc-geometry.ts` — `arrowheadPoints`, `lineArrowheadPoints`, `arcPath`, all direction-derived-from-the-path-itself, never a fixed shape) and redrawing the indicator as a short arrow lying on and pointing along the wire.
3. **Found during real-device verification of fix (1), not in the original PO report:** the new right-hand-grip-rule diagram's text labels initially collided ("Field: counterclockwise" overlapping "(current direction)") when actually rendered on the Android emulator — a layout defect Jest's structural tests could not have caught (no real text-metrics/collision layout in the RN test renderer). Corrected by re-spacing the label bands and re-verified visually on-device.

Applying the required review standard: *"Would a learner actually understand the rule from this image?"* — yes, the thumb/fingers are individually labelled and the thumb visually touches the same current-direction symbol (⊗/⊙) used consistently elsewhere. *"Is the displayed direction truly the displayed direction?"* — yes, proven both geometrically (`arc-geometry.test.ts` asserts arrowheads are derived from, and therefore always aligned with, the line/arc they label — the exact defect class found is now a regression-tested impossibility) and visually (Android emulator screenshots, this pass). *"Is this the correct teaching visual for the named concept?"* — yes, the grip rule and the motor principle are now two distinct, correctly-attributed diagrams and lesson sections, not one diagram serving both captions.

See §1, §7, §8, §12, §13 below for the updated detail this correction pass produced.

## 1. Families demonstrated and why

Per design doc §39's recommended proving slice:

| Family | Representative blueprints in this slice | Why chosen |
|---|---|---|
| `electrical.ohms_law` | `solve_for_voltage`, `solve_for_current`, `solve_for_resistance` | Proves the "teach the whole family, assess one target per question" distinction (§11) — all three governed forms are taught together; each question independently assesses one. |
| `electrical.series_circuits` | `calculate_total_resistance`, `solve_missing_component` | Proves formula + diagram representation together, and a variant-dimension (`component_count`) driving both. |
| `electrical.parallel_circuits` | `calculate_total`, `solve_missing_branch` | Proves the same shape with a different governed formula structure (`reciprocal_of_sum_of_reciprocals`), exercising the same generic formula renderer against different operations. |
| `electrical.magnetism_and_electromagnetism` | `interpret_field_direction`, `interpret_force_direction` | The required "one directional/diagram-heavy family" — proves dynamic direction/field/current/force parameterisation, the right-hand grip rule as a genuine hand-based teaching visual, and a declared (suggestive-strength) misconception target. `interpret_field_direction` was added in the CC-05C-DIAGRAM-FIX correction pass (§0) — it is the blueprint whose concept the grip rule actually is; it was real, engine-supported CC-05A/CC-05B content this proving slice had not yet exercised. |

Nine question blueprints total, all real, unmodified `QuestionBlueprint` records from the governed CC-05A corpus (see §2 below) — not invented for this task.

## 2. Governed-content boundary: the proving-content fixture

`apps/mobile` depends only on published `@alp/*` packages, never on content-authoring tooling (`scripts/content/*`) — the same rule `@alp/calculation-engine`'s own `engine-proof.ts` establishes for a single fixture blueprint. The full published learner-runtime content-projection pipeline (governed content → validated versioned release → device) is explicit future work (`MOBILE-ARCHITECTURE.md` §2: "This projection is a new artefact to design and build, not an existing one to expose") and out of scope here (task brief §18).

`apps/mobile/src/lib/proving-content/unit202-proving-fixture.ts` is the smallest honest stand-in: a **literal, field-for-field mirror** of the real governed records (3 formula families, 1 mnemonic, 4 diagram blueprints, 5 worked-example blueprints, 9 question blueprints) for the four proving families — copied verbatim from `scripts/content/data/cc05a-pedagogy-unit202.ts`, never reworded or reinvented. `magnetic.field_conductor_direction` (the grip-rule diagram blueprint) and `magnetism.interpret_field_direction` (the grip-rule question blueprint) were added in the CC-05C-DIAGRAM-FIX correction pass (§0).

This is not merely asserted: `scripts/content/check-cc05c-proving-fixture.test.ts` (content-authoring tooling, which is allowed to import both the real corpus and the mobile fixture to cross-check them — the dependency direction it guards is the other one) imports every mirrored record from the real corpus and the fixture and asserts deep equality. **5/5 tests pass** — the fixture cannot silently drift from governed content; a future CC-05A edit fails this test until the mirror is updated.

`PROVING_CONTENT_RELEASE = "cc05c-proving-slice-fixture-v1"` stands in for a real content-release identity (`MOBILE-ARCHITECTURE.md` §2) and is carried on every generated instance's identity tuple.

## 3. Deterministic engine binding

`apps/mobile/src/lib/proving-engine/proving-engine.ts` is a thin binding of the real, unmodified `@alp/calculation-engine` (CC-05B) to the proving-content fixture — `generateProvingQuestion`, `markProvingAnswer`, `emitProvingEvidence` call straight through to `generateQuestionInstance`/`evaluateAnswer`/`emitEvidence`. It contains no calculation, marking or evidence logic of its own.

Determinism is mechanically proven (`proving-engine.test.ts`, 8 tests): the same `(familyId, blueprintId, seed)` always regenerates a byte-identical instance; a different seed produces a different (still valid) instance; every one of the 8 proving-slice blueprints generates, grades correctly, and emits evidence correctly across a 5-seed sweep (40 generate/mark/emit cycles); JSON round-trip is lossless; an unsupported family/blueprint throws explicitly (never silently falls back).

## 4. Formula-family teaching vs. assessment

Design doc §11/§42.1-2's required distinction is proven on the lesson screen (`apps/mobile/src/app/(app)/learn/[family]/index.tsx`): the "Relationship taught as a family" section renders **every** governed form (`FormulaFamily.forms`, not a filtered subset) via `VariableKey` + `FormulaEquation`. The practice screen (`.../[family]/practice.tsx`) then independently assesses one target per question, driven entirely by which blueprint is next in the queue — never derived from, or leaking, the family list above it.

For Ohm's law specifically: the lesson shows `V = I × R`, `I = V / R`, `R = V / I` together (all three, always), while practice questions ask for V, I, or R independently depending on which blueprint the deterministic queue selected.

## 5. Formula rendering

`apps/mobile/src/lib/formula-rendering/format-formula.ts` and `apps/mobile/src/components/formula/FormulaExpressionView.tsx` render CC-05A's structured `FormulaExpression` tree (never a parsed display string) as:

- visually rich notation: fraction bars for `divide`/`reciprocal`/`reciprocal_of_sum_of_reciprocals`/`ratio_percentage`, superscripts for `square`/`power`, a root sign for `sqrt`, `×`/`+`/`−` for `multiply`/`add`/`subtract` — covering all 9 governed operation types the formula schema defines (only 4 are exercised by this proving slice's 3 formula families; `format-formula.test.ts` additionally exercises `sqrt`/`square`/`power` against a real `formula.ac_waveform_relationships`-shaped expression to prove the renderer isn't scoped only to what the proving slice happens to use);
- a parallel plain-English `accessibilityLabel`, built from the identical expression tree via `describeExpression`, so the visual and spoken forms can never disagree;
- a `resolve` function parameter (`symbolicResolver` | `substitutionResolver`) that switches between showing bare variable symbols (teaching) and substituted numbers (worked examples) — the same expression tree drives both.

`VariableKey.tsx` renders each formula family's governed variable definitions (symbol, name, unit) as an accessible legend.

**Worked substitutions** (`WorkedSubstitution.tsx`) reproduce the task brief's required deterministic sequence exactly:

```text
I = V / R
I = 24 / 6
I = 4 A
```

driven by `WorkedExampleInstance` data (`formulaFamilyId`, `target`, `knownVariables`, `steps`, `result`, `unitSymbol`), never presentation-only arithmetic. `@alp/calculation-engine`'s own `buildWorkedExampleInstance` is internal to its executors (not re-exported by the package's public `index.ts`), so lesson-screen teaching examples use `lib/formula-rendering/build-worked-example.ts`, a ~15-line reassembly that calls the *same public* `evaluateFormulaExpression` the engine itself uses — no calculation logic is duplicated, only plumbing. Practice-screen worked examples for assessed questions instead come directly from the real generated `GeneratedQuestionInstance.representation`, produced entirely inside CC-05B.

Teaching-example known values (`lib/proving-content/teaching-examples.ts`) are fixed, illustrative, deterministic-by-construction constants (V=24, I=4, R=6 reused across all three Ohm's-law worked-example views, per design doc §9's suggestion; R1=10/R2=20/R3=30 for series; R1=6/R2=12/R3=4 for parallel, chosen for an exact Rt=2Ω result) — never randomly generated, since a lesson's worked example is meant to be a stable, memorable reference case, distinct from the randomly-seeded assessed questions.

## 6. VIR triangle mnemonic

`apps/mobile/src/components/mnemonic/VirTriangle.tsx` renders the approved VIR triangle (design doc §10, §42.5) as a scalable `react-native-svg` vector shape (outline + two dividing lines + V/I/R labels), with three tappable regions positioned to match the SVG geometry (touch-target ≥44dp per platform accessibility guidance).

Tapping a region reveals the relationship you get by covering that variable — **derived from governed content, never hardcoded**: `formulaFamily.forms.find(f => f.target === region).expression`, rendered through the same `FormulaExpressionView` used everywhere else. `VirTriangle.test.tsx` proves this by asserting the exact revealed relationship for all three regions comes from `formula.ohms_law`'s real forms, and that re-tapping the same region deselects it (returns to the hint state). The component's own accessible description text is CC-05A's governed `accessibleDescription` field, not authored copy. The canonical relationship remains `formula.ohms_law`; the triangle is never treated as calculation authority (design doc §2.5).

## 7. Circuit diagrams (series/parallel)

`apps/mobile/src/components/diagrams/SeriesCircuitDiagram.tsx` and `ParallelCircuitDiagram.tsx` render CC-05B's real, dynamically-parameterised `DiagramInstance` (blueprint id, `parameters`, `labels`) as deterministic `react-native-svg` vector diagrams — a resistor zigzag symbol (`resistor-path.ts`, pure path-string generation, unit-testable without RN) repeated `component_count`/`branch_count` times, connected by wire `Line`s, labelled from the instance's own `labels` array (`R1`, `R2`, ...).

**Symbolic-labels-only, per design doc §2.8/§14 and task brief §8** ("For resistor networks default to R1 R2 R3 in the visual and put numeric values in question text"): the diagrams never embed numeric resistance values regardless of the `show_values` diagram parameter; numeric values are surfaced separately, in the question prompt text (`lib/proving-content/prompt-text.ts`). `SeriesCircuitDiagram.test.tsx` explicitly asserts this — the rendered accessibility label never matches a `Ω`-suffixed number even when `show_values: true`.

Both diagrams scale via SVG `viewBox` + a computed width clamped to the window size (`useWindowDimensions`), so they remain sharp and un-clipped from small phones to tablets. `component_count`/`branch_count` genuinely vary the rendered diagram (2/3/4 components exercised in tests) — proving CC-05B's diagram parameterisation is dynamic, not a static per-value image asset.

## 8. Directional/magnetic diagrams

Two distinct diagrams cover two distinct physical rules — a defect in the original CC-05C pass (one diagram doing duty for both captions) that CC-05C-DIAGRAM-FIX corrected (§0).

### 8a. Right-hand grip rule — `RightHandGripRuleDiagram`

`apps/mobile/src/components/diagrams/RightHandGripRuleDiagram.tsx` renders CC-05B's real `magnetic.field_conductor_direction` `DiagramInstance` as a genuine hand-based teaching aid, not a generic arrow arrangement:

- a stylised right hand: a palm shape, one distinctly-coloured **thumb** (an SVG line with round line-caps) extending to the conductor, and four separate **finger-curl** paths fanning from the palm over the top of the conductor;
- explicit on-diagram text labels — "Thumb (current direction)" and "Fingers (field direction)" — so the mapping from hand-part to physical quantity never depends on shape recognition alone;
- the conductor cross-section (⊗/⊙ symbol, matching the convention already established by `MagneticForceDiagram`) that the thumb visually touches, plus a text status line ("current into/out of the page");
- a field-rotation arc + arrowhead (`components/diagrams/arc-geometry.ts`'s `arcPath`, `arrowheadPoints`), shown only when `fieldRotation` is supplied.

Same reveal/withhold pattern as §8b's force arrow, for the same reason (the field-curl direction is the assessed answer for `magnetism.interpret_field_direction`): the thumb (given information) is always shown; the fingers' curl direction and the green confirmation arc are drawn only when the caller explicitly passes `fieldRotation` (teaching context — the lesson screen generates a real instance and passes its engine-computed `expected.value`; the practice screen omits it). The component never computes a rotation itself — `RightHandGripRuleDiagram.test.tsx` proves both states, plus a structural assertion (≥5 distinct SVG paths) that a genuine multi-part hand shape is rendered, not a single arrow.

**Real-device-only defect and fix**: manual Android emulator review after the initial implementation found the field-rotation label ("Field: counterclockwise") overlapping the thumb caption ("(current direction)") — both had been positioned at the same y-coordinate in the original layout. Jest's structural (`toJSON()`) snapshot tests do not perform real text-metrics layout, so this could not have been caught without rendering on an actual device. Fixed by re-deriving the label bands with explicit vertical separation (`CURRENT_LABEL_Y`, `FIELD_LABEL_Y`) and re-verified visually on-device (§13).

### 8b. Motor principle — `MagneticForceDiagram`

`apps/mobile/src/components/diagrams/MagneticForceDiagram.tsx` renders CC-05B's real `motor.force_field_current` `DiagramInstance` — pole arrangement (`N_S_horizontal`/`N_S_vertical`), current direction (`into_page`/`out_of_page`, drawn as the standard ⊗/⊙ symbol **plus** a text label, never symbol-alone), and field-direction arrows (N→S) — all genuinely dynamic per instance, not a fixed image. This is the motor principle / Fleming's-left-hand-rule relationship, not the grip rule — now in its own correctly-titled lesson section, separate from §8a.

**Rendering-layer decision on the force arrow** (documented here as the honest resolution of a real cross-layer nuance CC-05C is the first thing to expose, since CC-05B only ever produced non-rendered specs): CC-05B's `interpretForceDirection` executor sets `show_force_arrow: true` on the assessment `DiagramInstance` it builds for `magnetism.interpret_force_direction` — the exact question that asks the learner to determine that direction. Rendering the correct force arrow on that same diagram before the learner answers would hand them the answer. This component therefore takes `forceDirection` as a **separate, optional prop** rather than always honouring the diagram parameter: the practice (assessment) screen omits it; the lesson (teaching) screen generates a real instance via the same engine and passes its already-engine-computed `expected.value`. The component never computes a direction itself — `MagneticForceDiagram.test.tsx` proves both states (`forceDirection` present → revealed in the accessibility description; absent → "Force direction not shown." and no visual arrow). This is a UI-layer presentation decision (design doc §8's "formula/diagram rendering is a visual concern, calculation is an engine concern" applied to withholding, not just showing), not a change to CC-05B, which is not modified anywhere in this task.

### 8c. Series-circuit current-direction arrow (CC-05C-DIAGRAM-FIX)

`SeriesCircuitDiagram.tsx`'s current-direction indicator previously sat on the horizontal return wire but pointed straight down — perpendicular to, not along, the conductor it labelled (Product Owner finding). Fixed by extracting shared, direction-derived-from-the-path arrowhead geometry (`arc-geometry.ts`'s `lineArrowheadPoints`) and redrawing the indicator as a short horizontal arrow lying on the wire, pointing along it. `arc-geometry.test.ts` proves this class of defect is now geometrically impossible to reintroduce: a horizontal line's arrowhead can never point vertically, and vice versa (asserted numerically, independent of any SVG/RN rendering). `SeriesCircuitDiagram.test.tsx` additionally asserts the accessible description now mentions the current direction when the arrow is shown.

## 9. Question / marking / feedback loop

`apps/mobile/src/app/(app)/learn/[family]/practice.tsx` is the full end-to-end loop: generate (deterministic, local) → present (`QuestionPromptCard` + formula/diagram representation slot) → answer (`NumericAnswerInput` for `quantity` answers — decimal-pad keyboard, no formula-syntax typing required; `DirectionAnswerInput` for the magnetism `direction` answer — four labelled buttons, meaning never colour/glyph-alone) → mark (`markProvingAnswer`, local, zero network round trip, per Mobile UX Engineering Standard §1) → feedback (`FeedbackPanel`: correct/incorrect state, correct-answer value when wrong, `EvaluationResult.detail`, an evidence-strength-hedged misconception message when one is declared) → evidence (`emitProvingEvidence` + `recordProvingEvidence`, local) → continue → next question, or session summary at the end of the queue.

**Misconception hedging** (task brief §16 — "do not state a learner definitely holds a misconception if evidence is only suggestive"): `magnetism.interpret_force_direction` is the one proving-slice blueprint with a declared `misconceptionTargets` entry (`evidenceStrength: "suggestive"`). Any incorrect direction answer surfaces: *"This may be related to a possible misunderstanding — not certain from a single answer."* (never "you have misconception X"). A `direct`-strength case (none exists in this proving slice's 8 blueprints) would render *"This response is consistent with a known error pattern"* — still not asserted as certain, consistent with Product Principle 3 ("Preserve uncertainty"). Proven in `proving-engine.test.ts` (library layer: correct `misconceptionIdentifier`/`evidenceStrength` attribution) and `practice-screen.test.tsx` (screen layer: the hedged text actually renders after a wrong answer).

## 10. Evidence / offline / session behaviour

Evidence creation reuses the existing CC-04N local persistence foundation exactly, adding nothing new to it (task brief §17):

- `apps/mobile/src/lib/proving-session/session-store.ts`'s `recordProvingEvidence` writes a `proving.evidence` event through the existing `enqueueOutboxEvent` (`lib/storage/outbox.ts`) — the same durable SQLite outbox CC-04N proved. Evidence records are **never** marked synced (no sync target exists in this proving slice) — they correctly remain `pending`, an honest representation of "recorded locally, not yet reconciled with a server" (`MOBILE-ARCHITECTURE.md` §2). Full production sync is explicitly out of scope (§17/§18).
- Session **position** (family, question queue with per-question seeds, current index) is a single JSON blob per family under the existing `foundation_state` key-value table (`lib/storage/foundation-state.ts`) — no new SQLite table was added. `deriveQueueSeed(startedAtMs, index)` gives each queued question a stable seed at session-creation time; because the *seed itself* is persisted (not re-derived on resume), reopening a restored session regenerates a **byte-identical** `GeneratedQuestionInstance` (`session-store.test.ts` proves this directly).
- The active practice loop never makes a network request: generation, marking, evidence creation and session-position writes are all local SQLite/in-memory operations.

## 11. Accessibility

- Every interactive element carries `accessibilityRole` + `accessibilityLabel` (buttons, radiogroup for direction answers, progressbar for lesson/practice progress, alert for feedback panels, header for titles).
- Formula and diagram descriptions are full sentences (`describeExpression`, `MagneticForceDiagram`'s composed label, `SeriesCircuitDiagram`/`ParallelCircuitDiagram`'s composed label), not "see image" placeholders.
- No colour-only meaning anywhere: current direction uses symbol + text; force direction uses arrow + text label; feedback state uses a text label ("Correct"/"Not quite") in addition to panel colour; VIR-triangle selection uses a visible marker + `accessibilityState.selected`, not colour alone.
- Touch targets: `minTouchTarget` (44dp) enforced on all buttons/inputs (`NumericAnswerInput`, `DirectionAnswerInput`, `FeedbackPanel`'s continue button, VIR-triangle regions).
- Font scaling: no component sets `allowFontScaling={false}` anywhere — OS-level Dynamic Type/text-scaling applies by default (confirmed by repository-wide grep).
- Reduced motion: not applicable — this proving slice introduces no material animation (state changes are instant, consistent with immediate local feedback); nothing to degrade under a reduced-motion preference.
- iOS/Android-specific verification: **not performed** — no physical/simulator device available in this environment (see §13). Accessibility semantics are proven via React Native's accessibility prop contract and `@testing-library/react-native` assertions, not a real screen reader; this is the same limitation already recorded for prior mobile-foundation work.

## 12. Tests

104 mobile Jest tests across 29 suites (up from the CC-05B-era baseline of 11/5; up from 87/26 before the CC-05C-DIAGRAM-FIX correction pass), plus 5 Vitest tests in `scripts/content/check-cc05c-proving-fixture.test.ts` (root Vitest total: 235) — CC-05A/CC-05B's own suites are unchanged and still fully green.

| Layer | File(s) | Count |
|---|---|---|
| Content-mirror cross-check | `scripts/content/check-cc05c-proving-fixture.test.ts` | 5 (Vitest) |
| Formula formatting (pure) | `lib/formula-rendering/format-formula.test.ts`, `build-worked-example.test.ts` | 11 |
| Engine binding + determinism | `lib/proving-engine/proving-engine.test.ts` | 8 |
| Session/evidence persistence | `lib/proving-session/session-store.test.ts` | 8 |
| Prompt-text formatting | `lib/proving-content/prompt-text.test.ts` | 5 |
| Formula/mnemonic components | `components/formula/*.test.tsx`, `components/mnemonic/VirTriangle.test.tsx` | 11 |
| Diagram components (incl. arc-geometry, right-hand grip rule) | `components/diagrams/*.test.ts(x)` | 20 |
| Question components (incl. RotationAnswerInput) | `components/question/*.test.tsx` | 13 |
| Structural snapshots | `components/__snapshot-tests__/proving-visuals.snapshot.test.tsx` | 8 (snapshots) |
| Lesson screen (integration) | `app/(app)/learn/__tests__/lesson-screen.test.tsx` | 4 |
| Practice screen (integration) | `app/(app)/learn/__tests__/practice-screen.test.tsx` | 5 |
| Performance | `lib/proving-engine/proving-engine.performance.test.ts` | 1 |
| Pre-existing CC-04N/CC-05B (unchanged) | `lib/native-proof/*`, `lib/storage/*`, `app/__tests__/sign-in.test.tsx` | 11 |

The practice-screen integration tests are the strongest single proof: they mock only `expo-sqlite` (in-memory, existing CC-04N pattern), `expo-haptics` and `expo-router`'s navigation primitives, then render the *real* screen component and drive it through `@testing-library/react-native` — generate → answer → mark → feedback → evidence-persisted → continue → next question → session-complete summary, entirely through the actual app code, not a re-implemented test harness. `Date.now()` is mocked to a fixed value so the session's seed derivation is predictable, and the expected answer is independently computed by calling the same `generateProvingQuestion` the screen calls — no marking/physics logic is duplicated in the tests. The magnetism practice tests now exercise both blueprints in queue order (grip rule, then motor principle).

**New in CC-05C-DIAGRAM-FIX**: `components/diagrams/arc-geometry.test.ts` (6 tests) — pure numeric proof that arrowhead/arc geometry is always derived from the path it labels (the exact defect class found in manual review is now a regression-tested impossibility); `components/diagrams/RightHandGripRuleDiagram.test.tsx` (5 tests) — reveal/withhold behaviour and a structural proof (≥5 distinct SVG paths) that a genuine multi-part hand is rendered; `components/question/RotationAnswerInput.test.tsx` (2 tests).

**Minimal structural screenshot-testing foundation** (task brief §23): `components/__snapshot-tests__/proving-visuals.snapshot.test.tsx` captures Jest structural snapshots (`toJSON()`) of the formula equation, VIR triangle, both circuit diagrams, the right-hand grip rule diagram, the magnetic force diagram, and correct/incorrect feedback panels — deliberately the smallest useful foundation, not pixel-diffing (no Detox/Maestro visual-regression infrastructure exists in this repository yet; see §13). These structural snapshots did **not** catch the text-label collision found in manual review (§0) — `toJSON()` records props/tree structure, not rendered text layout/metrics — which is precisely why §13's real-device verification remains necessary and is not redundant with automated testing.

## 13. Runtime / device evidence

| Tier | Result |
|---|---|
| Node/Vitest (deterministic logic) | 235/235 pass (root `npm run test:unit`) |
| React Native/Jest (component + integration) | 104/104 pass, 29/29 suites (`npm run mobile:test`) |
| Metro/Hermes bytecode export — Android | `expo export --platform android` succeeds; `file` confirms **"Hermes JavaScript bytecode, version 98"** |
| Metro/Hermes bytecode export — iOS | Same export/verification; **"Hermes JavaScript bytecode, version 98"** |
| `expo-doctor` | 21/21 checks pass |
| `check:mobile-boundary` | pass — `apps/mobile` still does not depend on `@alp/ui` |
| **Android emulator — real interactive runtime** | **RUN.** `npx expo run:android` built and installed `dev.alp.mobile.foundation` on a running Android emulator (`emulator-5554`); the real email-OTP sign-in flow was completed against local Supabase (via Mailpit); the Learn → magnetism lesson screen was reached and interactively navigated via `adb input tap`/screenshots. This is genuine on-device/on-emulator execution under real Hermes, not a simulated or fabricated result. |
| iOS Simulator | **NOT_RUN** — not available on Windows |
| Physical device (either platform) | **NOT_RUN** — no physical device available in this environment |

**This is the first CC-05C runtime evidence collected on an actual emulator**, superseding the prior CC-05C evidence document's honest "Android emulator/physical device: NOT_RUN" (no SDK/emulator was available during original CC-05C implementation). It is what surfaced the two Product Owner-reported diagram defects (§0) and, during their correction, the text-label collision defect no automated test could have caught. Emulator-only qualification remains short of `MOBILE-UX-ENGINEERING-STANDARD.md` §8's real-device requirement (a current-generation low/mid-range physical Android device) and §10's screen-reader/gesture verification — those remain outstanding and are not claimed here.

## 14. Performance (dev-machine, informational)

Measured via `lib/proving-engine/proving-engine.performance.test.ts` (Jest, dev-machine, single-threaded — **not** device timing; Mobile UX Engineering Standard §9 explicitly forbids fabricated numeric SLAs, so these are directional measurements only, not budgets):

```text
Blueprints measured: 9
Iterations per blueprint: 50
Total operations: 450
Average generation time: 0.14-0.37ms (varies run to run; dev-machine JIT warm-up noise)
Worst single generation time: single-digit-to-tens of ms on a cold blueprint (e.g. magnetism.interpret_field_direction on first exercise)
Average marking time: 0.02-0.06ms
Average evidence-emission time: ~0.01ms
```

These are the same order of magnitude as CC-05B's own engine-level measurements (avg generation ~0.007ms across all 84 blueprints), confirming the proving-slice binding adds negligible overhead. Diagram/formula *rendering* time (React reconciliation + SVG layout) was not separately isolated — Jest's synchronous test renderer does not reflect real device paint/composite cost. The Android emulator session in §13 confirmed generation/rendering was visually instantaneous for interactive use (no perceptible delay navigating lesson/practice screens or submitting answers), but no numeric on-device timing was captured — a true "answer tap → visible response" budget requires instrumented on-device measurement, which remains outstanding.

## 15. Security

No new security-sensitive surface: no service-role/privileged credential, no new network call, no relaxation of RLS (nothing in this proving slice touches Supabase at all — it is entirely local). The one new dependency, `react-native-svg` (added via `npx expo install` for SDK-version compatibility), does not introduce any new HIGH/CRITICAL advisory — `npm run security:audit` remains covered by the same pre-existing, unexpired `SEC-EXC-001`/`SEC-EXC-002` exceptions.

## 16. Files

New:
- `apps/mobile/src/lib/proving-content/{unit202-proving-fixture,teaching-examples,prompt-text,units}.ts(+.test.ts)`
- `apps/mobile/src/lib/proving-engine/proving-engine.ts` (+`.test.ts`, `.performance.test.ts`)
- `apps/mobile/src/lib/proving-session/session-store.ts` (+`.test.ts`)
- `apps/mobile/src/lib/formula-rendering/{format-formula,build-worked-example}.ts` (+`.test.ts`)
- `apps/mobile/src/components/formula/{FormulaExpressionView,VariableKey,WorkedSubstitution}.tsx` (+`.test.tsx`)
- `apps/mobile/src/components/mnemonic/VirTriangle.tsx` (+`.test.tsx`)
- `apps/mobile/src/components/diagrams/{resistor-path,SeriesCircuitDiagram,ParallelCircuitDiagram,MagneticForceDiagram}.ts(x)` (+`.test.tsx`)
- `apps/mobile/src/components/question/{QuestionPromptCard,NumericAnswerInput,DirectionAnswerInput,FeedbackPanel,ProgressIndicator}.tsx` (+`.test.tsx`)
- `apps/mobile/src/components/__snapshot-tests__/proving-visuals.snapshot.test.tsx` (+`__snapshots__/`)
- `apps/mobile/src/app/(app)/learn/{_layout,index}.tsx`, `learn/[family]/{index,practice}.tsx`, `learn/__tests__/{lesson-screen,practice-screen}.test.tsx`
- `apps/mobile/src/app/(app)/dev-proving-visuals.tsx`
- `scripts/content/check-cc05c-proving-fixture.test.ts`

New in CC-05C-DIAGRAM-FIX (§0):
- `apps/mobile/src/components/diagrams/RightHandGripRuleDiagram.tsx` (+`.test.tsx`) — genuine hand-based grip-rule teaching visual
- `apps/mobile/src/components/diagrams/arc-geometry.ts` (+`.test.ts`) — shared, unit-tested arrowhead/arc geometry
- `apps/mobile/src/components/question/RotationAnswerInput.tsx` (+`.test.tsx`) — clockwise/counterclockwise answer input

Modified:
- `apps/mobile/package.json` (added `react-native-svg`)
- `apps/mobile/src/app/(app)/_layout.tsx` (registered `learn` and `dev-proving-visuals` screens)
- `apps/mobile/src/app/(app)/index.tsx` (added "Learn" entry point; dev-only "Proving-slice visual QA" link)
- `package-lock.json`

Modified in CC-05C-DIAGRAM-FIX (§0):
- `apps/mobile/src/lib/proving-content/unit202-proving-fixture.ts` (added `magnetic.field_conductor_direction` diagram blueprint + `magnetism.interpret_field_direction` question blueprint, verbatim from the real corpus)
- `apps/mobile/src/lib/proving-content/prompt-text.ts` (added the new blueprint's prompt line)
- `apps/mobile/src/components/diagrams/SeriesCircuitDiagram.tsx` (current-direction arrow geometry fix)
- `apps/mobile/src/app/(app)/learn/[family]/index.tsx` (magnetism lesson section split into correctly-attributed grip-rule + motor-principle sections)
- `apps/mobile/src/app/(app)/learn/[family]/practice.tsx` (diagram/answer-input dispatch now keys off the diagram's own blueprint id, not the family id, since magnetism now has two diagram types; added rotation-answer routing)
- `apps/mobile/src/app/(app)/dev-proving-visuals.tsx` (added the right-hand grip rule QA section)
- `scripts/content/check-cc05c-proving-fixture.test.ts` (cross-checks for the two new mirrored records)
- `apps/mobile/src/app/(app)/learn/__tests__/{lesson-screen,practice-screen}.test.tsx` (updated for the two-blueprint magnetism queue)

Unmodified (verified): `packages/content-schema/**`, `packages/calculation-engine/**`, `scripts/content/data/cc05a-pedagogy-unit202.ts`, `.github/workflows/ci.yml`.

## 17. Deferred items

- Full 84-blueprint learner UI coverage — this is a proving slice by design (task brief §3: "Do not attempt to turn all Unit 202 content into production lessons").
- Real physical-device behavioural proof (gesture feel, real VoiceOver/TalkBack verification, low-end-Android performance per Mobile UX Engineering Standard §8) — an Android **emulator** session has now genuinely occurred (§13), but no physical device or iOS environment is available in this Windows environment; still NOT_RUN, not fabricated.
- True pixel-level visual-regression testing (Detox/Maestro image diffing) — only a structural (`toJSON()`) snapshot foundation exists; no image-diffing infrastructure exists elsewhere in this repository to build on yet. (§0/§12 note this is exactly the gap that let the text-collision defect through automated testing.)
- Support-level distinction (task brief §14: guided vs. standard) — this proving slice always renders "guided" support (formula/diagram visible); a reduced-support mode was not built, consistent with "do not build a complete exam-mode product if not required."
- Full production evidence sync (server reconciliation, conflict handling) — evidence is recorded locally and durably queued but never synced; no sync target exists yet (CC-06+/CC-07 scope).
- The full published learner-runtime content-projection pipeline (CC-06+ scope) — this proving slice uses a governed, mechanically-cross-checked *fixture*, not the eventual real publication pipeline.
- Broader manual visual QA of the remaining, unchanged proving-slice diagrams (VIR triangle, parallel-circuit branch arrows) against the same review standard applied in §0 — not exhaustively re-reviewed on-device in this pass, since the Product Owner's findings were scoped to the two specific defects corrected here; the parallel-circuit branch arrow was independently re-verified (§7/§8c) to already be correctly aligned.

CC-05C, including the CC-05C-DIAGRAM-FIX correction pass, is implementation-complete and ready for Product Owner / Project Architect review. The CC-05 proving slice now demonstrates the governed assertion-family → representation → deterministic question → native interaction → marking → evidence path end-to-end, with the right-hand grip rule and current-direction imagery corrected and verified against real Android emulator rendering.
