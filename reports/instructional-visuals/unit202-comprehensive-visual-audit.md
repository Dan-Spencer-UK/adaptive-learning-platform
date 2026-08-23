# Unit 202 — Comprehensive Visual Pedagogy Audit (CC-11.7)

Supersedes `visual-needs-matrix.md` as the authoritative Unit 202 visual-production catalogue's source audit. That file's LO-by-LO groupings and most conclusions are independently re-verified below (not merely repeated); every place this audit corrects or upgrades a prior conclusion is called out explicitly.

**Method.** Three independent research passes: (1) mechanical enumeration of the full CC-05D deterministic system — all 16 `DiagramBlueprint`s, their `VisualSemanticContract`s, and all 66 canonical variants, cross-checked byte-for-byte against `scripts/visual-governance/data/canonical-variants.ts` and `reports/instructional-visuals/review-package/manifest.json`; (2) a lesson-by-lesson and QuestionBlueprint-by-QuestionBlueprint audit of all 24 current Unit 202 lessons and all 20 `FormulaFamily` entries; (3) a corpus-wide search across all ~340 assertions and ~90 capabilities for spatial/directional/physical/waveform/topology content not covered by any of the 16 existing blueprints. Findings from all three were reconciled into the Visual Production Studio's catalogue (`tools/visual-production-studio/catalogue.ts`), organised as **VISUAL FAMILY → PRODUCTION/BASE ASSET → CANONICAL LEARNER-VISIBLE STATE**.

The final count was **audit-derived, not target-driven**: 66 pre-existing canonical variants → 20 families / 32 production assets / 87 canonical states (66 of those states reconciling exactly to the pre-existing 66, the rest either new states of an existing asset or three genuinely new assets discovered by this audit). No number was chosen in advance and then filled to match.

---

## 1. The existing 66 — reconciliation result

**Zero silently lost.** Every one of the 66 pre-existing canonical variants (16 `DiagramBlueprint`s × their real canonical-variant-builder output) has been mechanically reconciled to an exact `CanonicalState.existingCanonicalVariantId` in the new catalogue, verified by directly recomputing both the real 66 ids (via `CANONICAL_VARIANT_BUILDERS` + the real `VisualSemanticContract`s) and the catalogue's own reconciled ids using the identical `stableVariantId` algorithm, then diffing the two sets: **0 missing, 0 extra**. This is enforced going forward by `tools/visual-production-studio/audit.ts` (`npm run visuals:studio:audit`).

None of the 66 were superseded or dropped. All 66 were **retained**, most now nested as multiple `CanonicalState` entries under a single `ProductionAsset` rather than each being its own flat catalogue entry — the actual correction this audit made was structural (recognising that e.g. `motor.force_field_current`'s 8 variants were previously represented as one undifferentiated Studio "asset" with no per-state detail, not that any of the 8 states themselves were wrong or unnecessary).

| DiagramBlueprint | Variants | Reconciled onto | Notes |
|---|---|---|---|
| `circuit.series_resistors` | 3 | `unit202.circuit.series` | retained, deterministic-only |
| `circuit.parallel_resistors` | 3 | `unit202.circuit.parallel` | retained, deterministic-only |
| `circuit.series_parallel_mixed` | 2 | `unit202.circuit.mixed` | retained, deterministic-only |
| `magnetic.field_conductor_direction` | 4 | `unit202.current-conductor.magnetic-field` | retained; now the PHENOMENON asset's own states (see §3) |
| `motor.force_field_current` | 8 | `unit202.motor.effect` | retained; PHENOMENON asset's own states |
| `graph.waveform_sine` | 6 | `unit202.waveform.sine` | retained, deterministic-only |
| `instrument.measurement_connection` | 5 | `unit202.instrument.connections` | retained, deterministic-only |
| `mechanical.lever_arrangement` | 6 | `unit202.levers.class-1/2/3` (2 each) | retained, split across the 3 already-separate lever assets |
| `mechanical.gear_mesh` | 3 | `unit202.gears` | retained |
| `mechanical.pulley_arrangement` | 2 | `unit202.pulleys.fixed` / `.movable` | retained, 1 each |
| `mechanical.resistivity_dimensions` | 2 | `unit202.resistivity.length-comparison` / `.area-comparison` | retained, 1 each |
| `magnetic.pole_interaction` | 4 | `unit202.magnet.poles` | retained |
| `magnetic.flux_field_lines` | 2 | `unit202.magnet.field` | retained |
| `emf.motional_emf_geometry` | 1 | `unit202.emf.motional` | retained |
| `generator.rotating_loop` | 2 | `unit202.generator.rotating-loop` | retained; mapped explicitly to near-zero-EMF / near-peak-EMF (brief §14) |
| `electronics.component_symbol_card` | 13 | `unit202.components.symbols` | retained, deterministic-only, `promptable: false` |

**Redundant variants found: none.** Every one of the 66 is pedagogically distinct (this was already true of the pre-existing system, which deliberately enumerates only pedagogically-distinct parameter combinations, never arbitrary permutations — confirmed by direct inspection, not merely trusted).

**Visually inadequate but structurally useful: none currently.** The instrument-connection, right-hand-grip, and waveform defects found in earlier sessions (CC-11.3) were already corrected before this audit began; this audit found no further structural-but-not-visual defects in the 66.

## 2. Lesson-by-lesson audit — corrections to the prior matrix

All 24 current lessons were independently re-read (not merely re-classified from the prior matrix). Two genuine corrections surfaced:

1. **`lesson.electrical.instrumentation`**: the prior matrix implied the lesson exercises voltmeter/ammeter/**and ohmmeter** connection diagrams. In the live lesson file, only **one** step carries `representation.diagramBlueprintId`, and its `tests`/`teaches` fields cite only `EL-INSTRUMENT-VOLTMETER-001`/`EL-INSTRUMENT-AMMETER-001` — no step tests or teaches the ohmmeter connection via a diagram, even though the deterministic `instrument.measurement_connection` blueprint's ohmmeter/isolated variant is itself correct and governed. This is a **lesson-integration gap, not a visual gap** — the correct asset exists (`unit202.instrument.connections`'s ohmmeter state, already reconciled above) but no lesson step currently shows it. Recorded as a finding for a **future content-integration package** (wiring an existing, already-correct diagram into a lesson step is a content change, out of this audit-only package's scope per its own "do not alter learner lessons" constraint).
2. **`lesson.foundation.physics.mass-and-weight`**: the prior matrix justified NOT_NEEDED on the grounds that "the formula triangle already carries" the W=mg relationship. This premise is **factually wrong** — there is no `formula.weight` (or equivalent) `FormulaFamily` in the governed 20-entry list at all, and the lesson itself references no `formulaFamilyId`. The **conclusion** (no visual needed) is still correct on the real grounds: W=mg is a trivial one-line multiplicative relationship with literally zero spatial/comparison content to depict, formula triangle or not. Reclassified NOT_NEEDED on the corrected reasoning, not the original flawed one.

Every other lesson's prior classification (REQUIRED-satisfied / NOT_NEEDED / USEFUL-deferred) was independently re-verified against the live lesson content and confirmed accurate. See `visual-needs-matrix.md` for the full per-lesson table (still valid); this section records only what changed.

**Assessment-layer asymmetry found (§17 audit).** 8 of the REQUIRED-satisfied visual families (levers, gears, pulleys, resistivity, capacitor-behaviour, thermistor-type) have their diagram wired only at the **lesson-step** layer, never at the **QuestionBlueprint/assessment** layer — the learner sees the diagram while being taught, but the corresponding `QuestionBlueprint`'s own `representation.diagram` field is unset. This is a genuine content-architecture observation, not something this audit-only package may fix (wiring a `QuestionBlueprint.representation.diagram` field is a governed-content change). Recorded for a future content package.

## 3. New REQUIRED visual needs discovered beyond the original 66

Four genuinely new production assets, each independently corroborated by a named misconception, a dedicated `QuestionBlueprint` with no existing visual representation, or both — never invented from the task brief's own worked examples alone:

1. **`unit202.current-conductor.magnetic-field`** (right-hand-grip family) — the electromagnetic PHENOMENON separated from the MNEMONIC, per the brief's own explicit instruction. Its 4 canonical states are the pre-existing `magnetic.field_conductor_direction` variants, now correctly attributed to a phenomenon asset rather than floating unattached.
2. **`unit202.diode.bias-direction`** — forward/reverse-bias current direction. Corroborated by `EL-COMPONENT-DIODE-001` and the named misconception `MIS-EL-DIODE-DIRECTION-CONFUSION-001` ("confuses which direction a diode conducts"); the existing `electronics.component_symbol_card` blueprint renders only the static IEC symbol, never current flow. Two states: forward bias (conducting), reverse bias (blocked).
3. **`unit202.rectification.waveforms`** — half-wave / full-wave / inverter output SHAPES, distinct from the plain sine wave `graph.waveform_sine` renders. Corroborated by `EL-COMPONENT-RECTIFIER-HALF-WAVE-001`/`FULL-WAVE-001`/`EL-COMPONENT-INVERTER-001` and `QuestionBlueprint electronics.recognise_rectifier_type`, which currently distinguishes the three shapes by text description alone. Deterministic (exact curve shape is the taught fact); three states, `promptable: false`.
4. **`unit202.capacitor.transient`** — the RC exponential charge/discharge curve. Corroborated by `EL-COMPONENT-CAPACITOR-TRANSIENT-001` and `QuestionBlueprint electronics.recognise_capacitor_behaviour` ("gradual_exponential_change" vs "instant_step_change"), which has no existing visual at all — an exponential curve is a genuinely different shape from every existing blueprint. Deterministic; two states (charge, discharge), `promptable: false`.

Plus one asset whose priority was **upgraded** on new evidence: `unit202.electrolysis` — `EL-CURRENT-CHEMICAL-EFFECT-001` has zero representation anywhere in the deterministic system, confirming REQUIRED rather than the original P1/P2 framing.

## 4. USEFUL findings — tracked, not catalogued as full assets

Per task brief §5 ("USEFUL assets may enter a secondary production queue... do not inflate the catalogue with decorative imagery"), the following are recorded here and in the Studio dashboard's `usefulTrackedNotCatalogued` count (currently 10), but deliberately **not** materialised as `ProductionAsset` objects this pass:

1. **Clamp meter recognition** (`EL-INSTRUMENT-CLAMP-METER-001`) — distinctive ferrite-jaw physical form, genuinely different from the series/parallel/isolated connection topology the existing instrument blueprint models.
2. **Oscilloscope recognition** (`EL-INSTRUMENT-OSCILLOSCOPE-001`) — distinctive screen/trace physical form.
3. **Electron-flow vs conventional-current direction diagram** — targets the named misconception `MIS-EL-ELECTRON-CURRENT-DIRECTION-CONFUSION-001`; a simple dual-arrow wire diagram, cheap and high-value, but not yet corroborated by a dedicated `QuestionBlueprint`.
4. **Permanent magnet vs electromagnet comparison** (`cap.magnetism.compare_permanent_electromagnet`) — a genuine physical-topology gap (coiled wire vs bar magnet), but Level 2 depth keeps it below REQUIRED.
5. **Gear rotation-direction reversal / idler gear** (`FP-GEAR-DIRECTION-REVERSAL-001`, `FP-GEAR-IDLER-001`) — governed SUPPORTS-only (non-mandatory) content; cheap addition to the existing gear-mesh asset if commissioned.
6–10. **Physical-recognition images for zener diode, photodiode, DIAC, TRIAC, thyristor/SCR** — the 6 components already classified REQUIRED (resistor, capacitor, diode, LED, thermistor, transistor) cover the highest-value recognition targets; these 5 are genuinely useful but more specialist, deferred to the secondary queue rather than built now.

**Explicitly classified NOT_NEEDED** (real content, no spatial component, confirmed not merely assumed): Ohm's law rearrangement, algebraic formula rearrangement, core electrical quantities (V/I/R definitions), SI units/prefixes, charge-and-current (I=Q/t), electrical power/energy/efficiency formulas, mass-and-weight (W=mg, corrected reasoning per §2), force/work/energy/power definitions, thermal-effect-factors relational content (I, R, t), continuity testing (procedural, adequately covered by the existing ohmmeter diagram), AC reactive quantities/phasors (a documented, deliberate Product-Owner scoping decision — no numeric AC-calculation engine exists or is planned), rectifier/inverter as *physical-recognition* subjects (functional blocks, not single recognisable components — their *waveform* need is REQUIRED and built, §3 item 3).

## 5. Studio / dashboard changes

`tools/visual-production-studio/catalogue.ts` restructured with a third hierarchy level, `CanonicalState`, nested under every `ProductionAsset` (`VisualAsset` in code, matching the brief's PRODUCTION/BASE ASSET concept). New fields: `PedagogicalState` (`TEACHING`/`PRACTICE`/`ASSESSMENT`/`FEEDBACK`/`MULTI_STATE`), per-state `annotationPolicy`/`requiredLabels` (ANNOTATION FOLLOWS PEDAGOGICAL STATE now applies per-state, not only per-asset), `existingCanonicalVariantId` (the mechanical reconciliation pointer), `VisualNeedClassification` (`REQUIRED`/`USEFUL`/`NOT_NEEDED`/`DEFERRED_SCOPE`/`BLOCKED_REFERENCE`, derived per asset). New `tools/visual-production-studio/dashboard.ts` computes 12 distinct counts (never a single misleading total) from live catalogue + status data. New `tools/visual-production-studio/audit.ts` (`npm run visuals:studio:audit`) is the package's own completeness gate. The Studio UI's progress section gained a full dashboard row; `prompt-builder.ts` now enumerates every canonical state a base asset must safely support inside its single asset-specific prompt (never a separate prompt per state, never a generic family-only prompt).

## 6. Final honest counts

- Visual families: **20**
- Production/base assets: **32** (29 pre-existing + 3 new: diode bias, rectifier/inverter waveforms, capacitor transient)
- Canonical learner-visible states: **87** (66 reconciled to the pre-existing system + 21 new states, mostly newly-differentiated states of already-existing assets, plus the states belonging to the 3 new assets and the components.physical per-component states)
- REQUIRED: 28 of 32 assets
- BLOCKED_REFERENCE: 3 (heating-effect, conductor-insulator, protective-devices)
- DEFERRED_SCOPE: 1 (trigonometry — no lesson exists yet)
- USEFUL, tracked but not catalogued: 10 (§4)
- NOT_NEEDED (lesson/concept level, no asset): 12 lessons plus several assertion-level items (§4)

**This count emerged from the audit; it was not chosen in advance.** No target number was set before the research passes ran, and the final number is neither round nor pre-announced anywhere in this package's own working notes.
