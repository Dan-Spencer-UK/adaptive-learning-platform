# CC-05A Pedagogical Blueprint Backfill — Evidence

**Status: APPROVED / COMPLETE** (Product Owner / Project Architect, 2026-08-16). Implementation commit `9133c4fc2665114193fa1363baff90e0b25ac5e8`, GitHub Actions CI run [`31946117054`](https://github.com/Dan-Spencer-UK/adaptive-learning-platform/actions/runs/31946117054) passed fully green, including the `content:pedagogy:check` CI gate. See `PROJECT-STATUS.md`'s CC-05A section for full detail.

Implementation evidence for CC-05A — Pedagogical Knowledge Structure & Blueprint Backfill, the first bounded sub-package of CC-05, built on the approved design specification [`docs/architecture/CC-05-PEDAGOGICAL-KNOWLEDGE-AND-QUESTION-ARCHITECTURE.md`](../CC-05-PEDAGOGICAL-KNOWLEDGE-AND-QUESTION-ARCHITECTURE.md).

CC-05A adds a governed pedagogical layer *around* the existing CC-04/CC-04A/CC-04B Unit 202 corpus (176 assertions: 146 Electrical, 17 Foundational Maths, 13 Foundational Physics). It does **not** implement the deterministic calculation/question engine (CC-05B) or native learner-session integration (CC-05C), and it does **not** modify a single existing assertion's wording, provenance, rights classification, curriculum mapping, relationship or identifier.

## 1. Schema choices

New module: [`packages/content-schema/src/pedagogy.ts`](../../../packages/content-schema/src/pedagogy.ts), re-exported from the package's public `index.ts` alongside the existing `knowledge-graph.ts` schema, following the identical pattern (Zod object schemas + a top-level manifest schema with a `.superRefine()` cross-reference-integrity pass).

Formalises all 17 objects named in the design doc's §30 core-schema list (`AssertionFamily`, `AssertionFamilyMembership`, `Capability`, `FormulaFamily`, `FormulaForm`, `VariableDefinition`, `TeachingRepresentation` [as `FamilyTeachingRepresentation`], `WorkedExampleBlueprint`, `VisualAidBlueprint`, `DiagramBlueprint`, `QuestionBlueprint`, `VariantDimension`, `ParameterGenerator`, `AnswerContract`, `MarkingContract`, `MisconceptionMapping`, `EvidenceTarget`), plus `GeneratedQuestionInstance` as a shape-only schema (§43 explicitly permits this; no generation runtime is implemented).

Notable design decisions, resolved from repository constraints per §43's "open implementation decisions" list rather than guessed:

- **Formula expression representation**: a recursive, discriminated `FormulaExpression` tree (`operation` + `operands`/`operand`/`numerator`/`denominator`, each itself either a variable-symbol string, a numeric-literal constant, or a nested `FormulaExpression`) rather than a flat single-operation shape. This was necessary, not decorative: two proving-slice formulas (`P = I² × R`, `P = V² / R`) and the RMS↔peak conversion (`rms = peak / √2`) genuinely need nested structure (a `square`/`sqrt` sub-expression inside a `multiply`/`divide`). A flat representation would have forced either a fake extra "variable" for `√2` (misrepresenting a constant as a physical quantity) or string-parsing at the CC-05B consumption boundary — both of which §7.1/§35 rule out. Every `FormulaExpression` is validated recursively for variable-symbol resolution in `pedagogyManifestSchema`'s `superRefine`.
- **`requiredTargets` on `FormulaFamily`** (not in the design doc's illustrative shape, added deliberately): the "every variable must be a teachable target" reading of §2.3/§7.2 breaks down for series/parallel resistance, whose branch-count is variable (there is no single "solve for R1" leaf assertion — only the total is a required teaching target, and per §18 an individual-branch solve is a *normalised, generator-level* capability, not a distinct formula form). `requiredTargets` makes each formula family's authored teaching-completeness claim explicit and mechanically checked, instead of over-constraining every variable.
- **`assessmentRequirement`/`teachingOnlyReason` on `AssertionFamily`** (formalising design doc §6's "assessment requirement" family field and the exception explicitly permitted by §21/§29): a family can be legitimately `teaching_only` — exempt from the "must have ≥1 question blueprint" gate — but only with a mandatory, Zod-enforced documented reason. Used for 6 of 23 families (see §3 below), never left implicit.
- **Cross-manifest integrity is deliberately split**: `pedagogyManifestSchema`'s own `superRefine` only checks internal consistency *within* the pedagogy layer (family/capability/formula/diagram/question cross-references) — it does not and structurally cannot know whether a referenced assertion identifier exists in a particular domain corpus, exactly as `knowledgeGraphManifestSchema` does not know about Unit 202. That corpus-specific check lives in the content-authoring script (`scripts/content/validate-pedagogy.ts`), which imports and cross-checks both manifests independently — mirroring how `generate-seed.ts`/`generate-corpus-review.ts` already relate to `knowledge-graph.ts`.

## 2. Backfill methodology

Every one of the 176 corpus assertion identifiers was read directly from `scripts/content/data/cc04-unit202-electrical-science.ts` (cross-checked against `scripts/content/evidence/cc04-unit202-corpus-review.md`, the CC-04B-generated per-assertion inventory) — never assumed or reconstructed from memory. Family groupings follow the corpus's own existing topic clustering (identifier prefixes, source-file ordering, and the already-governed `PREREQUISITE_OF`/`SUPPORTS` relationship graph) rather than inventing a new taxonomy layered on top.

Coverage was **not** hand-counted and trusted. `scripts/content/validate-pedagogy.ts` independently recomputes, from the live corpus manifest, the exact set of assertion identifiers with no family membership and no standalone classification — the same "never trust a record's own claim, recompute from source" discipline the CC-04N-S/S1 security audit gate uses for dependency-path drift. That computed set is empty (see §7).

## 3. Family inventory summary

23 assertion families total: **17 assessable**, **6 teaching-only** (each with a mandatory documented reason, never a silent gap).

| Family | Assertions | Assessment |
|---|---|---|
| `electrical.si_units` | 8 | assessable |
| `electrical.core_quantities` | 3 | assessable |
| `electrical.ohms_law` | 7 | assessable |
| `electrical.resistivity` | 6 | assessable |
| `electrical.series_circuits` | 15 | assessable |
| `electrical.parallel_circuits` | 14 | assessable |
| `electrical.series_vs_parallel_comparison` | 9 | assessable |
| `electrical.power_relationships` | 10 | assessable |
| `electrical.energy_and_efficiency` | 8 | assessable |
| `electrical.charge_and_current` | 4 | assessable |
| `electrical.thermal_and_chemical_effects` | 4 | assessable |
| `electrical.conductors_and_insulators` | 5 | assessable |
| `electrical.instrumentation` | 10 | assessable |
| `electrical.fault_conditions_protection` | 8 | assessable |
| `electrical.magnetism_and_electromagnetism` | 9 | assessable |
| `electrical.emf_and_generation` | 4 | assessable |
| `electrical.ac_dc_waveforms` | 15 | assessable |
| `electrical.ac_reactive_quantities` | 7 | **teaching-only** |
| `foundational.algebraic_technique` | 7 | **teaching-only** |
| `foundational.arithmetic_technique` | 5 | **teaching-only** |
| `foundational.proportion_and_units` | 5 | **teaching-only** |
| `foundational.mechanics_work_energy_power` | 7 | **teaching-only** |
| `foundational.mass_weight` | 2 | **teaching-only** |

**Teaching-only reasons** (each recorded verbatim on the family record, `scripts/content/data/cc05a-pedagogy-unit202.ts`):

- `electrical.ac_reactive_quantities` (reactance, impedance, inductance, capacitance, power factor): per the corpus's own documented design decision (`cc04-unit202-electrical-science.ts` lines 43-49), AC reactive-quantity calculation was deliberately never decomposed into calculation capabilities — only conceptual/definitional knowledge is modelled, consistent with LO2's framing rather than LO4's "calculate" framing. No numeric AC-reactive calculation engine exists or is planned.
- The 5 Foundational Maths/Physics families: reusable horizontal technique/concept knowledge (GCSE Maths subject content; general mechanics), not Unit 202 syllabus statements. Their skills are assessed *in context* by the Electrical question blueprints that consume them (e.g. every Ohm's-law solve blueprint inherently exercises substitution/transposition technique; the parallel-resistance `calculate_total`/`solve_missing_branch` blueprints inherently exercise reciprocal-sum/invert technique). A standalone abstract-algebra or general-mechanics question blueprint would fall outside the Electrical proving-slice scope this backfill targets.

Membership roles used: `canonical_form`, `rearranged_form`, `prerequisite_concept`, `consequence`, `sanity_check`\* (folded into `misconception_guard` where the assertion explicitly guards against a specific error — e.g. `EL-INTERPRET-SERIES-RESULT-001`, `EL-INTERPRET-PARALLEL-RESULT-001`), `misconception_guard`, `contextual_application`. No assertion was force-fit into a single-family bucket merely to satisfy validation — several assertions (e.g. `EL-RESISTIVITY-COMPARE-MATERIALS-001`, prerequisite-supporting Foundational assertions) are referenced from multiple places in the pedagogical layer without duplication.

## 4. Formula-family summary

9 formula families, all structurally validated (every `requiredTargets` entry has a corresponding `FormulaForm`; every expression's leaf variable symbols resolve to a defined `VariableDefinition`):

| Formula family | Required teaching targets | Mnemonic |
|---|---|---|
| `formula.ohms_law` | V, I, R | `mnemonic.vir_triangle` |
| `formula.series_resistance` | Rt | — |
| `formula.parallel_resistance` | Rt | — |
| `formula.electrical_power` | P, V, I | `mnemonic.power_triangle` |
| `formula.electrical_energy` | E, P, t | — |
| `formula.electrical_efficiency` | η | — |
| `formula.charge_current` | I, Q | — |
| `formula.resistivity` | R | — |
| `formula.ac_waveform_relationships` | rms, peak, f, T | — |

`formula.electrical_power` and `formula.ac_waveform_relationships` are the two families that require the recursive expression tree (§1) — e.g. `P = I² × R` is `{operation: "multiply", operands: [{operation: "square", operand: "I"}, "R"]}`, never a parsed display string. 13 `WorkedExampleBlueprint` records exist across these families (every `requiresWorkedExample: true` form has at least one), and both mnemonic visual aids (`mnemonic.vir_triangle`, `mnemonic.power_triangle`) carry an `accessibleDescription` and reference their authoritative formula family rather than defining calculation semantics themselves (design doc §10).

## 5. Diagram/visual inventory

7 governed diagram blueprints (schema/parameter inventory only — no renderer implemented, per this task's explicit non-goals):

| Diagram blueprint | Type | Used by (representative) |
|---|---|---|
| `circuit.series_resistors` | electrical_circuit | series-circuit family + blueprints |
| `circuit.parallel_resistors` | electrical_circuit | parallel-circuit family + blueprints |
| `circuit.series_parallel_mixed` | electrical_circuit | series-vs-parallel comparison family |
| `magnetic.field_conductor_direction` | magnetic_field | magnetism family (field-direction blueprint) |
| `motor.force_field_current` | magnetic_field | magnetism family (force-direction blueprint); optional for EMF/generation |
| `graph.waveform_sine` | waveform | AC/DC waveform family |
| `instrument.measurement_connection` | instrument_connection | instrumentation family |

All 7 default to `valueEmbedding: "symbolic_only"` (R1/R2/R3-style labels, values supplied in question text — design doc §14) except `graph.waveform_sine`, which uses `values_when_assessed` because reading values off a waveform graph is itself part of the assessed skill in that family. Every blueprint's `accessibility` object mandates a semantic description, prohibits colour-only encoding, and defines an identifier-label pattern (design doc §15) — enforced structurally by the Zod schema (`z.literal(true)` on the two boolean accessibility flags), not left as an aspiration.

6 of 23 families declare a `required` technical-diagram teaching representation; all 6 resolve to one of the 7 diagram blueprints above (0 unresolved references — see §7).

## 6. Question-blueprint coverage

**84 question blueprints** across the 17 assessable families — genuinely exhaustive per family (matching or closely following the design doc's own worked examples in §17.1-17.3 for the three families it names explicitly), never padded to hit a round number and never one-blueprint-per-numeric-variation:

| Family | Blueprints | Family | Blueprints |
|---|---|---|---|
| `ohms_law` | 10 | `charge_and_current` | 2 |
| `parallel_circuits` | 11 | `thermal_and_chemical_effects` | 2 |
| `series_circuits` | 10 | `conductors_and_insulators` | 2 |
| `series_vs_parallel_comparison` | 6 | `instrumentation` | 4 |
| `power_relationships` | 6 | `fault_conditions_protection` | 4 |
| `energy_and_efficiency` | 4 | `magnetism_and_electromagnetism` | 5 |
| `resistivity` | 5 | `emf_and_generation` | 2 |
| `si_units` | 3 | `ac_dc_waveforms` | 6 |
| `core_quantities` | 2 | | |

**Normalisation** (design doc §18): symmetric branch/component permutations are collapsed into a single blueprint with the unknown chosen by the generator — `series.solve_missing_component` and `parallel.solve_missing_branch` each carry an explicit `normalisationNote`, and no `find_R1_given_.../find_R2_given_...`-style duplicate blueprint exists anywhere in the inventory (mechanically asserted by test).

**Misconception grounding**: every `misconceptionTargets` entry across all 84 blueprints references one of the corpus's real 20 governed `MIS-*` identifiers (mechanically asserted by test against the live corpus manifest, not a hardcoded list) — e.g. `parallel.diagnose_reciprocal_error` → `MIS-EL-PARALLEL-RESISTANCE-ADDITION-001` (direct), `parallel.diagnose_missing_final_inversion` → `MIS-EL-RECIPROCAL-FORGOTTEN-INVERT-001` (direct), three distinct Ohm's-law diagnostic blueprints → the three distinct real Ohm's-law misconceptions in the corpus (`MIS-EL-OHM-REARRANGE-ERROR-001`, `MIS-EL-OHM-WRONG-OPERATION-001`, `MIS-EL-OHM-UNRELATED-SYMBOLS-001`). Evidence strength is distinguished (`direct`/`suggestive`/`generic`) — a wrong answer is never automatically treated as proof of a specific misconception (design doc §26).

## 7. Mechanical counts (live, `npm run content:pedagogy:report`)

```text
Total assertion families: 23 (17 assessable, 6 teaching-only)
Total family memberships: 172
Corpus assertions: 176
  - with family membership: 172
  - standalone by design: 4
  - UNCLASSIFIED (target 0): 0
Formula families: 9
  - missing required forms (target 0): 0
Families requiring a diagram: 6
Diagram blueprints: 7
  - unresolved required diagram references (target 0): 0
Question blueprints: 84
  - assessable families with zero blueprints (target 0): 0
  - required capabilities without assessment coverage (target 0): 0

PASS: all coverage gates are zero.
```

`npm run content:pedagogy:check` runs the same computation and exits non-zero if any gate metric is non-zero (CI-suitable; not yet wired into `.github/workflows/ci.yml` — see §10 "Deferred items").

## 8. Explicitly standalone assertions

4 assertions are classified `standalone_assertion` with a documented reason — all 4 are Foundational Physics assertions that do not currently reach an Electrical assertion via `PREREQUISITE_OF` in this slice (confirmed against `cc04-unit202-corpus-review.md`'s "Foundational Maths/Physics: used vs currently-unused-but-retained" section, which independently lists the same 4 assertions among its 7 currently-unused-but-retained set — the other 3 of that set, `FP-CONCEPT-MASS-001`, `FP-CONCEPT-WEIGHT-001`, `FP-REL-WEIGHT-MASS-001`, are instead grouped as `prerequisite_concept`/`canonical_form` members of `foundational.mass_weight`, since they *do* form a coherent taught relationship with each other even though that relationship doesn't currently reach Electrical):

- `FP-CALC-POWER-001`
- `FP-CALC-EFFICIENCY-001`
- `FP-REL-WEIGHT-MASS-001`
- `FP-CALC-WEIGHT-001`

Each reason states explicitly that this is retained reusable horizontal knowledge per existing Product Owner direction (CC-04B), not a defect.

## 9. Deferred items

- **CC-05B (deterministic engine)**: not implemented. `GeneratedQuestionInstance` exists as a schema shape only; no PRNG, no calculation execution, no marking execution.
- **CC-05C (native integration)**: not implemented. No renderer (SVG or otherwise) for any diagram/formula/mnemonic blueprint exists; no mobile UI.
- **Diagram/formula rendering libraries**: left as an open CC-05B/C decision per design doc §43 (React Native SVG vs Skia vs another approach) — out of CC-05A's schema/content scope.
- **`electrical.ac_reactive_quantities` and the 5 Foundational families**: deliberately teaching-only in this pass, each with a documented reason (§3) — not a coverage gap.
- **CI wiring**: `npm run content:pedagogy:check` is wired into `.github/workflows/ci.yml`'s `checks` job (runs on every push/PR to `main`, alongside typecheck/lint/unit tests).

## 10. Corpus integrity confirmation

Mechanically and manually confirmed: **no assertion statement, provenance link, rights classification, curriculum mapping, relationship, or identifier in `scripts/content/data/cc04-unit202-electrical-science.ts` was modified.** `git diff --stat` for this task's change set (see the completion report) shows zero lines changed in that file. A dedicated test (`scripts/content/data/cc05a-pedagogy-unit202.test.ts`, "never rewrites CC-04 assertion identifiers") asserts the new pedagogy manifest carries no `assertions`/`assertionVersions`/`assertionProvenanceLinks` fields of its own — it can only ever *reference* governed assertion identifiers by string, never redefine them. No corpus defect was discovered during this backfill; none was silently corrected.
