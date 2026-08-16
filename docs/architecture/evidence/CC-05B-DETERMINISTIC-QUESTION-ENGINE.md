# CC-05B Deterministic Calculation / Question Engine — Evidence

Implementation evidence for CC-05B — the deterministic, framework-independent engine that consumes CC-05A's governed pedagogical blueprints ([`docs/architecture/CC-05-PEDAGOGICAL-KNOWLEDGE-AND-QUESTION-ARCHITECTURE.md`](../CC-05-PEDAGOGICAL-KNOWLEDGE-AND-QUESTION-ARCHITECTURE.md), [`CC-05A-PEDAGOGICAL-BLUEPRINT-BACKFILL.md`](CC-05A-PEDAGOGICAL-BLUEPRINT-BACKFILL.md)) and produces reproducible generated question instances, marked answers and structured evidence. Implemented entirely inside `packages/calculation-engine` — the package CC-01 reserved exactly for this purpose ("This package will own quantities, units, formula definitions and deterministic parameter/variant generation in a later CC package (CC-05)").

This is not a redesign of CC-05A's content/schema, and it is not the native learner UI (CC-05C) — see §9 "Non-goals confirmed" below.

**Status: APPROVED / COMPLETE** (Product Owner / Project Architect, 2026-08-16), covering both the original proving slice and the CC-05B2 completion pass to 84/84 governed executable question blueprints. See `PROJECT-STATUS.md` §CC-05B for the implementation commit SHA and CI run.

**CC-05B2 completion pass**: the engine originally shipped with a 36-blueprint proving subset (Ohm's law, series/parallel resistance, magnetism/electromagnetism — the four families the initial CC-05B task named as proving data for the generic machinery). A follow-up, narrower completion pass (CC-05B2) extended the SAME architecture — no redesign, no new generic machinery beyond what §3/§4/§6 already describe — to cover every remaining governed, learner-assessable question blueprint in the live CC-05A Unit 202 manifest. **Current state: 84/84 governed question blueprints executable.** This document has been updated throughout to reflect that; historical detail about the original 36-blueprint pass is preserved where it remains accurate (e.g. the bug found and fixed in §3, which predates and is unrelated to the completion pass).

## 1. Engine contract

```text
blueprint + blueprintVersion + contentRelease + seed
  -> generateQuestionInstance()   -> GeneratedQuestionInstance
  -> evaluateAnswer()             -> EvaluationResult
  -> emitEvidence()               -> QuestionEvidenceRecord
```

Public API (`packages/calculation-engine/src/index.ts`, all plain functions/types, no classes with hidden state beyond a single-file PRNG closure):

- `generateQuestionInstance(inputs: GenerationInputs): GeneratedQuestionInstance`
- `evaluateAnswer(instance, given: AnswerValue): EvaluationResult`
- `emitEvidence(instance, evaluation): QuestionEvidenceRecord`
- `isBlueprintSupported(blueprintId)`, `SUPPORTED_BLUEPRINT_IDS` — explicit, mechanically-checkable coverage record
- `evaluateFormulaExpression`, `collectFormulaVariableSymbols`, `selectFormForKnownVariables` — the generic formula evaluator
- `markAnswer` — the generic marking function
- `createRng`, `createRngFromIdentity`, `deriveSeed`, `nextInt`, `pick`, `pickDistinctIndices` — the deterministic PRNG layer
- `cleanInteger`, `nonZeroCleanInteger`, `distinctCleanIntegers` — generic educational parameter-generation helpers

**Callers supply the content.** The engine never imports `scripts/content/data` itself — `GenerationInputs` takes `blueprint`/`formulaFamilies`/`diagramBlueprints`/`workedExampleBlueprints` as plain arguments. This preserves the architecture's `governed content -> engine -> generated instance` direction (design doc §31) and the existing repository rule that content-authoring tooling is "never imported by the learner-runtime domain engines" (`scripts/content/README.md`) — the dependency only ever runs the other way. The proving harness (§6) is what supplies real CC-05A content to the engine for testing.

## 2. Determinism

`packages/calculation-engine/src/seed.ts` is the *only* source of variation anywhere in the engine. `deriveSeed` folds the full `(blueprintId, blueprintVersion, contentRelease, seed)` tuple through FNV-1a into a 32-bit integer, then `createRng` (mulberry32 — public-domain, pure integer bitwise arithmetic, no BigInt, no platform API) turns that into a reproducible float stream. Consequences, all test-proven (§7):

- The same identity tuple always produces a byte-identical `GeneratedQuestionInstance` (`engine.test.ts`, `prove-cc05b-engine.test.ts`).
- Two different blueprints given the *same* raw `seed` number do not derive the same internal PRNG seed (`seed.test.ts`) — folding the full tuple in prevents accidental cross-blueprint pattern coupling.
- Different seeds for the same blueprint produce varied (but each individually valid) parameter sets.
- A mechanical grep-based test (`seed.test.ts`, comment-stripped so this doc's own prose doesn't trip it) proves `Math.random()`/`Date.now()` are never *called* anywhere under `packages/calculation-engine/src`. No locale, network, database-ordering or process/environment state is read anywhere in generation or marking.

## 3. Formula evaluator

`packages/calculation-engine/src/formula-evaluator.ts` is the single place calculation semantics execute. It implements all nine `FormulaOperation` values CC-05A's schema defines (`multiply`, `divide`, `add`, `subtract`, `square`, `sqrt`, `power`, `reciprocal`, `reciprocal_of_sum_of_reciprocals`, `ratio_percentage`), operating on CC-05A's real, structured `FormulaExpression` tree — never a parsed display string.

- **Nested expressions work.** `P = I² × R` (`multiply` wrapping a `square`) and `rms = peak / √2` (`divide` wrapping a `sqrt` of a numeric literal) both evaluate correctly (`formula-evaluator.test.ts`).
- **Numeric precision policy** (documented, not accidental): an internal `evaluateRaw` performs the full recursive computation with *no* intermediate rounding; the public `evaluateFormulaExpression` rounds the result exactly once, to `CALCULATION_PRECISION_DECIMALS = 6`. This was a real bug found and fixed during this task — an earlier version rounded at every recursion level, which compounded float error on nested expressions (a `rms/√2` test failed by ~2×10⁻⁵ before the fix); rounding only once at the top level fixed it and is now the documented, tested policy.
- **Variadic aggregation is explicit, not ad hoc.** `add` and `reciprocal_of_sum_of_reciprocals` are the two operators CC-05A's series/parallel resistance formulas use with a fixed `R1..R4` variable list where only as many as the actual component/branch count are bound; for exactly these two operations, an unbound operand is skipped rather than erroring — every other operation requires all its operands to resolve and throws `FormulaEvaluationError` otherwise.
- **`selectFormForKnownVariables`**: when a formula family declares more than one form for the same target (`formula.electrical_power` has three forms all targeting `P`), the engine selects the form whose required variable symbols exactly match the known bindings — never guesses from array order. Ambiguous or unmatched selections throw explicitly.
- Division/reciprocal by zero, negative `sqrt`, and missing bindings all throw `FormulaEvaluationError` rather than returning `NaN`/`Infinity`/a silently wrong number.

Formula *display* and formula *calculation* remain separate: nothing in this module formats, renders, or parses a string — `FormulaInstance`/`WorkedExampleInstance` (§5) carry substitution/result/unit as plain data for a future CC-05C renderer to consume.

## 4. Parameter generation

`packages/calculation-engine/src/parameter-generation.ts` provides generic, blueprint-agnostic helpers: `cleanInteger` (a "textbook-friendly" integer from a restricted step-multiple set, not an arbitrary uniform random value), `nonZeroCleanInteger`, `distinctCleanIntegers` (guarantees genuinely different values, e.g. so an "identify the dominant component" question has one unambiguous answer). Family executors combine these with the formula evaluator to guarantee **exact, non-pathological results by construction** rather than generating first and rejecting bad results after the fact — e.g. Ohm's-law "solve for current" generates `R` and the target current `I` directly, then derives `V = I × R` via the real formula (never `V/R` first, which could produce an ugly repeating decimal). Every generator throws `ParameterGenerationError` explicitly when a constraint genuinely cannot be satisfied (e.g. requesting more distinct values than a range contains) rather than silently returning an invalid value.

## 5. Question-generation support (full governed inventory)

Sixteen family executor modules under `packages/calculation-engine/src/families/`, all built as thin, blueprint-driven callers of the generic machinery above (§8's coverage report lists every blueprint):

**Original proving-slice families (4 modules, 36 blueprints):**

- **`ohms-law.ts`** (10 blueprints): all three target forms (`V`, `I`, `R`), rearrangement selection, unit matching, guided substitution, three distinct diagnostic error-transform blueprints (rearrangement error, wrong operation, unrelated-symbol substitution — each grounded in the real, distinct CC-04 misconception it targets), plausibility judgement.
- **`series-resistance.ts`** (10 blueprints): total resistance (2–4 components), missing-component solve (generator-selected target, per CC-05A's own normalisation note — no `find_R1`/`find_R2` duplication), supply current and voltage-drop (reusing `formula.ohms_law` generically), power (reusing `formula.electrical_power`), add/open-circuit prediction, plausibility detection, dominant-component identification, diagram-region interpretation.
- **`parallel-resistance.ts`** (11 blueprints): the same shape using `formula.parallel_resistance`'s `reciprocal_of_sum_of_reciprocals`, plus the two reciprocal-specific diagnostics (`diagnose_reciprocal_error`: shows the naive-sum wrong total; `diagnose_missing_final_inversion`: shows the un-inverted reciprocal-of-total).
- **`magnetism.ts`** (5 blueprints, the required diagram-heavy directional family): concept recognition, permanent-magnet/electromagnet and motor/generator comparisons, and the two genuinely directional blueprints (§7's physics note below).

**CC-05B2 completion-pass families (12 modules, 48 blueprints)** — every remaining assessable Unit 202 family, added additively without touching the generic machinery:

- **`units-and-quantities.ts`** (5: `si_units` 3 + `core_quantities` 2): categorical unit/quantity recognition, base-vs-derived classification, two diagnostic blueprints.
- **`resistivity.ts`** (5): `resistivity.calculate_resistance` routes through `formula.resistivity`'s nested `R = (ρ × L) / A`; the other four are categorical/directional.
- **`comparison.ts`** (6, `electrical.series_vs_parallel_comparison`): three use the `circuit.series_parallel_mixed` diagram blueprint (with a documented dominant-topology interpretation of its `branch_arrangement` parameter — see below); `compare_resistance`/`compare_power_energy` are deterministic mathematical certainties (series total always exceeds parallel total for ≥2 positive resistors; parallel always dissipates more power than series at the same supply voltage), not coin flips.
- **`power.ts`** (6): all five `formula.electrical_power` forms exercised (`P=VI`, `V=P/I`, `I=P/V`, `P=I²R`, `P=V²/R`, selected via `selectFormForKnownVariables`); `calculate_total` sums component powers through the generic evaluator's `add` operator (not raw JS addition).
- **`energy.ts`** (4): `formula.electrical_energy` (`E=Pt` and both rearrangements) and `formula.electrical_efficiency` (`η=Pout/Pin×100`, with `Pout` always generated as a genuine fraction of `Pin` so `η<100%`). `calculate_energy_kwh` needs no unit-conversion mechanism — see §6.
- **`charge.ts`** (2): `formula.charge_current` (`I=Q/t`, `Q=It`).
- **`thermal-and-conductors.ts`** (4: `thermal_and_chemical_effects` 2 + `conductors_and_insulators` 2): categorical.
- **`instrumentation.ts`** (4): `recognise_connection` uses the `instrument.measurement_connection` diagram blueprint with a governed voltmeter→parallel/ammeter→series mapping; the rest are categorical.
- **`fault.ts`** (4, `fault_conditions_protection`): categorical.
- **`emf.ts`** (2, `emf_and_generation`): categorical (one blueprint's diagram is optional per CC-05A, so none is emitted for it — nothing was promised).
- **`waveform.ts`** (6, `ac_dc_waveforms`): the two calculation blueprints route through `formula.ac_waveform_relationships` (`rms↔peak` via `sqrt(2)`, `f↔T` via reciprocal); `identify_characteristic` emits a `graph.waveform_sine` diagram instance.

**84 blueprints total** — every governed, learner-assessable question blueprint in the live CC-05A manifest (the 6 CC-05A `teaching_only` families — `electrical.ac_reactive_quantities` and the 5 Foundational Maths/Physics families — declare zero question blueprints by CC-05A's own design, so there is nothing to implement for them; see `CC-05A-PEDAGOGICAL-BLUEPRINT-BACKFILL.md` §3). `SUPPORTED_BLUEPRINT_IDS` is the explicit, exhaustive, mechanically-checkable record of exactly which ones.

**Interpretation note (`comparison.identify_topology`)**: `circuit.series_parallel_mixed`'s only structural parameter, `branch_arrangement`, permits only `"series_of_parallel"`/`"parallel_of_series"` — both genuinely mixed sub-structures — while `identify_topology`'s answer options are the binary `["series", "parallel"]`. This executor reads `branch_arrangement` as the circuit's dominant top-level structure (parallel sub-blocks wired in series = "series"; series sub-blocks wired in parallel = "parallel"), the conventional way compound networks of this shape are named. This is a documented engine-level interpretation, not a CC-05A content change.

### Directional physics note (magnetism family)

CC-05A's diagram blueprints (`magnetic.field_conductor_direction`, `motor.force_field_current`) model the *diagram parameters* (`current_direction`, `pole_labels`) but do not themselves encode a directional rule — there is no formula family for a vector relationship. Per the task brief's instruction not to invent electrical-physics rules that belong in governed content, but *also* not to leave the two directional blueprints unimplemented, `magnetism.ts` implements exactly two small, explicitly-derived lookup tables:

- **Right-hand grip rule** (field rotation around a straight conductor, viewed end-on): current out of the page curls the field anticlockwise; into the page, clockwise. Standard, universally-taught physics, not invented content.
- **F = I L × B** (Fleming's left-hand rule is a mnemonic for this same equation), evaluated via the literal right-hand cross product with an explicit axis convention (x=right, y=up, z=out-of-page) and this module's own documented interpretation of CC-05A's abstract `pole_labels` values (`N_S_horizontal` = field pointing right; `N_S_vertical` = field pointing down — a reasonable interpretation given CC-05A's diagram blueprint does not pin exact pole placement, recorded here as an interpretation decision, not a governed fact).

Every table entry is independently re-derived and cross-checked against the raw cross product in `families/magnetism.test.ts` — the table is not merely "whatever the code says", it is proven correct against first-principles vector arithmetic.

**Scoping decision**: `magnetic.field_conductor_direction`'s `current_direction` parameter also permits `"left_to_right"` (current in the plane of the page). That case has no single well-defined field-rotation answer without an additional "observation point" diagram parameter CC-05A does not yet model, so `interpret_field_direction` generation is deliberately restricted to `into_page`/`out_of_page` (both unambiguous viewed end-on). This is a bounded CC-05B scope decision, not a defect — a natural refinement for whoever next touches this diagram blueprint.

## 6. Marking, units and evidence

`packages/calculation-engine/src/marking.ts` implements exactly the `MarkingContract` subset the proving blueprints use — `exact`, `numeric_tolerance`, `enum`, `set_equality`, `direction_match` — against CC-05A's real contract type. Numeric marking **never uses string equality**: both `exact` and `numeric_tolerance` coerce to `Number` and compare numerically, rounded via the same `CALCULATION_PRECISION_DECIMALS` policy the evaluator uses, with an absolute epsilon floor (`10⁻⁶`) so legitimate float noise at/near zero never fails a correct answer. A marking type outside this scope (`equivalent_fraction`, `unit_aware_numeric`, `ordered_sequence`, `structured_expression`) throws `UnsupportedMarkingTypeError` explicitly rather than silently returning a result.

**Unit handling** is deliberately minimal: every governed answer already carries its `canonicalUnit` from CC-05A's `AnswerContract`; the engine distinguishes numeric correctness (marking) from quantity identity (`answer.quantity`/`answer.canonicalUnit`, carried through unchanged) without building a general unit-conversion framework. `energy.calculate_energy_kwh` (CC-05B2) was the one candidate that superficially looked like it might need W↔kW conversion machinery; on inspection it needs none — the SAME `E = P × t` relationship is evaluated with power already generated in kilowatts and time already generated in hours (exactly how a real "2 kW kettle run for 3 hours" word problem is posed), giving kilowatt-hours directly. No blueprint in the full 84-blueprint governed corpus genuinely requires a numeric unit-scale conversion, so none was built (task brief §16/§17's explicit minimalism guidance).

**Misconception/evidence output** (`evaluateAnswer`/`emitEvidence`, `engine.ts`): an incorrect answer is attributed to a specific misconception **only** when the blueprint's own governed `evidence.misconceptionTargets` declares one for that exact question — never inferred from wrongness alone. When declared, the blueprint's own `evidenceStrength` (`direct`/`suggestive`/`generic` — CC-05A's own enum, not reinvented) is carried straight through; when no misconception is declared, incorrect answers are tagged `generic`. **Known simplification**: if a blueprint ever declared more than one misconception target, only the first would be attached — no proving-slice blueprint currently declares more than one, so this path is untested; flagged here for whoever extends the blueprint set. `emitEvidence` produces a `QuestionEvidenceRecord` (assertion family, capability, assertion IDs, blueprint ID, generated-instance identity, correctness, misconception/evidence strength, representation dependency) for the future CC-07 evidence-engine to consume — CC-05B does not implement mastery/adaptive logic itself.

## 7. Diagram/formula representation specifications

The engine never renders. `FormulaInstance` (formula family ID, target, substitution, result, unit) and `DiagramInstance` (blueprint ID, parameters, symbolic labels) are plain, serialisable specifications a future CC-05C renderer consumes — the same seed always reproduces the same spec. Circuit diagrams default to symbolic `R1`/`R2`/`R3` labels with generated values carried separately in `parameters` (CC-05A's `valueEmbedding: "symbolic_only"` default), matching design doc §14.

## 8. Blueprint coverage (mechanical, never assumed)

`scripts/content/prove-cc05b-engine.ts` — mirroring `validate-pedagogy.ts`'s own "never trust a claim, recompute" pattern — imports the **real** CC-05A content and the **real** engine and, for **every governed question blueprint in the live manifest** (mechanically derived via `pedagogyManifestSchema.parse(...).questionBlueprints`, never a hard-coded count), proves: it is engine-supported; generation succeeds; the instance survives a `JSON.stringify`/`parse` round trip unchanged; the blueprint's own expected value grades `correct`; a deliberately wrong value grades `incorrect`; regenerating from the same identity reproduces an identical instance; the instance satisfies its blueprint's declared representation contract (a required diagram/formula is present and references the exact declared blueprint/formula-family id); and the emitted evidence carries the blueprint's own family/capability/assertion identity through unchanged. Live output (`npm run engine:prove`):

```text
Total governed question blueprints: 84
Engine-supported: 84 (registry total: 84)
Unsupported (target 0): 0
Generation failures (target 0): 0
Correct-answer grading failures (target 0): 0
Incorrect-answer grading failures where applicable (target 0): 0
Serialisation failures (target 0): 0
Determinism failures (target 0): 0
Representation-contract failures (target 0): 0
Evidence-contract failures (target 0): 0

By family: 17/17 assessable families PASS (all governed blueprints per family executable)

PASS: every governed question blueprint has a working execution path.
```

`npm run engine:prove:check` runs the same computation and exits non-zero on any gap (not yet wired into CI in this task — see §11 "Deferred items"; as with CC-05A's own CI-wiring step, that follows a separate approval task, and this task's own instructions are explicit: no staging/commit/push).

**Variant-dimension coverage** (task brief §12/§25): `scripts/content/report-cc05b-dimension-coverage.ts` (`npm run engine:dimensions` / `:check`) sweeps 60 seeds per blueprint against every one of the 9 governed blueprints that declare a `variantDimensions` entry (11 entries total) and confirms every permitted value is actually exercised — not merely assumed likely from a large seed count. All 9/9 non-marker dimensions fully covered: `si_units.identify_unit`'s 6 quantities, `ohms_law.select_rearrangement`'s 3 targets, `series`/`parallel`'s 2/3/4 component/branch counts, `charge.calculate`'s 2 targets, and both `waveform` calculation blueprints' 2 targets each. (Two entries — `series.solve_missing_component`/`parallel.solve_missing_branch`'s `target: ["choose_from_components"/"choose_from_branches"]` — are generator-selection markers, not enumerable value sets, and are reported as such rather than force-fit into the coverage check.)

## 9. Mobile / Hermes / offline proof

- **Tier 1 (Vitest/Node logic proof)**: 140 tests across `packages/calculation-engine/src/**/*.test.ts` and `scripts/content/*.test.ts` (110 from the original CC-05B pass + 30 added by CC-05B2's completion pass: 16 new-family correctness tests, 4 dimension-coverage tests, plus the proving-harness/engine tests growing to cover the full 84-blueprint registry), all passing (§10).
- **Tier 2a (RN/Jest pipeline proof)**: `apps/mobile/src/lib/native-proof/engine-proof.ts` + `.test.ts` (unchanged by CC-05B2 — the fixture already exercises `@alp/calculation-engine`'s shared entry points, which now resolve the expanded 84-blueprint registry as part of the same bundled package), following the exact CC-04N `shared-packages.ts` pattern: imports the real `@alp/calculation-engine` from inside the Expo app and exercises `generateQuestionInstance`/`evaluateAnswer`/`emitEvidence` plus a determinism re-generation and a JSON round trip against a self-contained synthetic Ohm's-law fixture (apps/mobile deliberately never imports `scripts/content/data` — only published `@alp/*` packages). All 5/5 steps still pass under `jest-expo`. Wired into the existing dev-only `dev-proof.tsx` diagnostics screen (a "Deterministic engine proof (CC-05B)" section, following the same pattern as the existing "Shared-package runtime proof" section) so the engine code path is genuinely reachable, not dead code, for the Metro export below.
- **Tier 2b (Metro/Hermes bytecode compilation proof)**: re-run after the CC-05B2 completion pass. `npx expo export --platform android` / `--platform ios` both succeeded and produced real Hermes bytecode confirmed via `file` (`"Hermes JavaScript bytecode, version 98"`) on both platforms (Android bundle grew from 5.1MB to 5.2MB, consistent with the 12 new family modules now being bundled and reachable via the dev-proof screen).
- **Tier 2c (on-device Hermes execution)**: **NOT_RUN** — no Android SDK/emulator or macOS/Xcode exists in this environment, exactly as recorded for CC-04N. Not claimed.
- **`check:mobile-boundary`**: passes — `apps/mobile` still does not depend on `@alp/ui`; the new engine-proof files add no new boundary risk.
- **`expo-doctor`**: 21/21 checks pass, unchanged.
- **Offline safety**: `generateQuestionInstance`/`evaluateAnswer`/`emitEvidence` perform no I/O of any kind (no network call, no database lookup, no file read) — mechanically true by inspection (the modules import nothing but `@alp/content-schema` types and each other) and proven by every test running with no network/DB fixture.

### Non-goals confirmed

No final formula card/SVG renderer, no native lesson screens, no adaptive scheduling, no production sync, no LLM at runtime, no question blueprint invented beyond CC-05A's own governed manifest, no CC-05A schema/content changes, no CC-05C work, no new atomic assertions, and no one-question-per-assertion architecture (coverage remains at the assertion-family → capability → question-blueprint layer CC-05A defined, not the atomic-assertion layer).

## 10. Tests / performance

**Tests** (all passing; full repository `npm run test:unit` at 230/230 Vitest across 19 files, plus 11/11 mobile Jest tests):

| File | Tests |
|---|---|
| `packages/calculation-engine/src/seed.test.ts` | 16 |
| `packages/calculation-engine/src/formula-evaluator.test.ts` | 26 |
| `packages/calculation-engine/src/marking.test.ts` | 10 |
| `packages/calculation-engine/src/parameter-generation.test.ts` | 9 |
| `packages/calculation-engine/src/families/magnetism.test.ts` | 8 |
| `packages/calculation-engine/src/families/new-families.test.ts` (CC-05B2) | 16 |
| `packages/calculation-engine/src/engine.test.ts` | 10 |
| `scripts/content/prove-cc05b-engine.test.ts` | 41 (11 report-level + 30 seeds × stability sweep, full 84-blueprint manifest) |
| `scripts/content/report-cc05b-dimension-coverage.test.ts` (CC-05B2) | 4 |
| `apps/mobile/src/lib/native-proof/engine-proof.test.ts` (Jest, not Vitest) | 2 |

Covers: identical-seed reproduction, cross-blueprint seed independence, controlled variation across seeds, serialisation-then-reuse reproducibility, explicit constraint-failure errors, no-impossible-values (30-seed stability sweep across all 84 governed blueprints), full formula-operation correctness including nested expressions, all three Ohm's-law target forms, series/parallel total and missing-component/branch solves, all five `formula.electrical_power` forms, `formula.electrical_energy`/`formula.electrical_efficiency`/`formula.charge_current`/`formula.resistivity`/`formula.ac_waveform_relationships` correctness, numeric tolerance, unit carry-through, the directional family (cross-product-verified), deterministic physics/maths certainties in the comparison family, diagram-spec generation (including the newly-required `graph.waveform_sine`/`instrument.measurement_connection`/`circuit.series_parallel_mixed` instances), worked-example output, misconception/evidence contracts, representation/evidence-contract checks per blueprint, full variant-dimension coverage (9 blueprints, 11 dimension entries, every permitted value exercised), and a dedicated no-`Math.random()`/no-`Date.now()` mechanical proof.

**Performance** (`npm run engine:perf`, dev-machine Node, honestly labelled — not a device or production claim, per CC-04N's own precedent), now measured against all 84 governed blueprints:

```text
Governed blueprints measured: 84
Iterations per blueprint: 200 (16,800 total generate+evaluate operations)
Average generation time: 0.0066ms
Worst single generation time: 0.6807ms (series.calculate_total_resistance -- first-call JIT warmup)
Average marking time: 0.0003ms
```

No pathological behaviour identified; generation and marking are immediate local operations on this toolchain by a wide margin, and per-operation timing did not measurably degrade as coverage grew from 36 to 84 blueprints. Real device timing remains a future physical-device qualification step, exactly as it does for CC-04N's own performance evidence.

## 11. Limitations / deferred capabilities

- All 84 governed question blueprints in the live CC-05A manifest are executable; `generateQuestionInstance` still throws `UnsupportedBlueprintError` explicitly (never silently pretends) for any blueprint id outside that governed set (e.g. a future CC-05A addition not yet given an executor).
- The 6 CC-05A `teaching_only` families (`electrical.ac_reactive_quantities` and 5 Foundational Maths/Physics families) declare zero question blueprints by CC-05A's own design — there is nothing for CC-05B to execute for them; this is not a coverage gap.
- `magnetism.interpret_field_direction` deliberately does not generate the `"left_to_right"` diagram parameter value (§5's scoping note, unchanged by CC-05B2).
- `comparison.identify_topology`'s dominant-topology reading of `branch_arrangement` (§5) is a documented engine-level interpretation of an ambiguous diagram-blueprint/answer-option pairing, not a CC-05A content change.
- Multi-target misconception attribution (a blueprint declaring more than one `misconceptionTargets` entry) is unimplemented beyond "take the first" — untested, since no governed blueprint currently needs it.
- No unit-conversion framework (mV↔V, kΩ↔Ω, etc.) — every governed answer already uses its formula family's canonical unit, and the one candidate that looked like it might need one (`energy.calculate_energy_kwh`) turned out not to (§6).
- `npm run engine:prove:check` / `npm run engine:dimensions:check` exist and pass but are not wired into `.github/workflows/ci.yml` in this task (no commit/CI changes were made at all, per this task's explicit instructions).
- Tier 2c (on-device Hermes execution) remains NOT_RUN, as for every prior CC-04N/CC-05A/CC-05B mobile-adjacent evidence document in this repository.
- CC-05C (native learner-session integration, real rendering) is entirely unimplemented — this document is deliberately scoped to the engine only.
