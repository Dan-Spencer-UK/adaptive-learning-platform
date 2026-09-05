# Batch 04 -- Electrical Quantities and Circuit Theory: Coverage Report

## Scope

57 requirements / 57 unique `evidenceRequirementId`s were selected from the frozen
`reports/backtests/unit202-evidence-acquisition-preflight/UNIT202-EVIDENCE-REQUIREMENT-PLAN.json`
(all with `canonicalRequirementKey` containing `::electrical-quantities-and-circuit-theory::`). This selection was
pre-confirmed by the orchestrating session before this pass began; no requirement was added, removed, renamed,
merged or reinterpreted in this pass.

Work proceeded through four internal research clusters, each validated before moving to the next:

| Cluster | Requirements | Status |
|---|---|---|
| 1. SI quantities and practical unit conversion | 9 | Complete, all VERIFIED |
| 2. Core electrical quantities (current, voltage, resistance, resistivity, power, energy, power factor) | 26 | Complete, all VERIFIED |
| 3. AC quantities (frequency, impedance, capacitance/capacitive reactance, inductance/inductive reactance) | 15 | Complete, all VERIFIED |
| 4. Measuring instruments | 7 | Complete, all VERIFIED |
| **Total** | **57** | **Complete, all VERIFIED** |

(Note: the task specification's own narrative described clusters 2 and 3 as "25" and "16" requirements
respectively; the frozen plan's actual per-topic counts are 26 and 15 -- length/area/volume/mass/density/time/
velocity/temperature/practical-conversion = 9 for cluster 1, current/voltage/resistance/resistivity/power/
energy/power-factor = 26 for cluster 2, frequency/impedance/capacitance-and-reactance/inductance-and-reactance =
15 for cluster 3, and the seven named instruments = 7 for cluster 4. All four totals still sum to the
confirmed 57. This is a cosmetic discrepancy in the narrative cluster description, not a scope change --
per-cluster counts are not among this batch's binding validation criteria; the exact 57-ID match against the
frozen plan is, and it holds.)

## Evidence status totals

All 57 requirements reached **VERIFIED** status (see `EVIDENCE-RESULTS.json`, `statusTotals`). No requirement
was left PARTIAL or GAP in this pass. See `EVIDENCE-RESULTS.json`'s own `statusVocabulary` block for the exact
definitions of VERIFIED / PARTIAL / GAP used throughout this batch.

## Sources

26 sources are registered in `SOURCE-REGISTER.json`. 22 were freshly acquired in this session; 4 are disclosed
cross-batch reuses (re-fetched and re-read fresh in this session, never assumed from a prior normalized claim):

| Reused source | Originally registered in | Reused here for |
|---|---|---|
| `SRC-NIST-MASS` | Batch 03 (mechanics-and-machines) | mass's SI-unit EXACT_FACT (a different requirement than Batch 03's mass-meaning/weight facts) |
| `SRC-NIST-SP811-B9` | Batch 02 (electrical-fundamentals-and-safety) | area/volume/velocity/density SI units (new facets) + resistivity's ohm-metre unit (same fact, new requirement ID) |
| `SRC-HP-RESIS` | Batch 02 | resistance's and resistivity's CONCEPT_DEFINITION/DISTINCTION facets |
| `SRC-NIST-RESHALL` | Batch 02 | resistivity's QUANTITY_SYMBOL facet (rho) |

Access failures and their workarounds are recorded honestly in `ACQUISITION-LOG.json` (`accessFailuresAndWorkarounds`):
IET's units-and-symbols PDF (bot-blocked), IEC Electropedia (bot-blocked), IEEE Xplore Std 280 abstract
(JS-rendered, empty), All About Circuits (403), eCampusOntario Multimeters 101 (403), and NIST Handbook 44's
full PDF (unreadable/impractically large to page-search). None of these was substituted with a search-summary
or snippet as evidence; each was abandoned in favour of a genuinely retrievable, genuinely read alternative.

## Overlap audit against frozen prior-batch learning points

See the full `overlapAudit` array in `ELECTRICAL-QUANTITIES-AND-CIRCUIT-THEORY-LEARNING-POINTS.json` and its
Markdown twin. Summary:

- **Resistance** (4 evidence requirements) and **resistivity** (4 evidence requirements) -- **reused**: the
  accepted Batch 02 `EFS-LP-05` (Resistance) and `EFS-LP-06` (Resistivity) already teach exactly this mastery
  (meaning, quantity symbol, unit symbol, and the resistance-vs-resistivity distinction). No new `EQCT-LP-*` is
  created for these 8 requirements; each nonetheless has its own genuine, re-verified VERIFIED evidence result
  in `EVIDENCE-RESULTS.json`. A representation question is flagged for Product Architect review: the current
  artifact format has no structured field for "this requirement is satisfied by a prior batch's learning
  point"; it is represented here only as prose (the overlap audit) plus a coverage-matrix row. No schema change
  was made in this pass.
- **Current** -- Batch 02's `EFS-LP-02` teaches the charge-flow RELATIONSHIP (I=Q/t) as a calculation outcome,
  not current's identity/symbol facts; Batch 04 adds `EQCT-LP-03` for the genuinely additional identity mastery.
- **Voltage** -- Batch 02's `EFS-LP-09` teaches the specific voltage-DROP formula (Vdrop=IR), not voltage's
  general identity/symbol facts or the U-vs-V convention question; Batch 04 adds `EQCT-LP-04`.
- **Power** -- Batch 02's `EFS-LP-17` teaches the power-FORMULA calculation procedure (P=VI/I^2R/V^2R), not
  power's identity/symbol facts or its explicit distinction from energy and power factor; Batch 04 adds
  `EQCT-LP-05`.

No other material overlap with `FM-LP-*`, `EFS-LP-*` or `MM-LP-*` was identified. Cross-domain prerequisites are
attached only where a new learning point's own outcome genuinely uses the prior skill (see each learning
point's own justification): `EQCT-LP-02` (practical unit conversion) reuses `FM-LP-04`, `FM-LP-14`, `FM-LP-19`;
`EQCT-LP-13` (impedance) and `EQCT-LP-15` (ohmmeter) both reuse `EFS-LP-05` (resistance), since their own
outcomes explicitly presuppose knowing what resistance is.

## Depth guardrail compliance

- **Quantity vs unit symbols** kept distinct throughout (I vs A, V vs V-the-unit, R vs Ω, P vs W, E vs J, f vs
  Hz, Z vs Ω, C vs F, L vs H) -- see each learning point's own wording.
- **U vs V for voltage**: the genuine cross-source variation (V, U, E all documented) is disclosed in
  `EQCT-LP-04` rather than hidden; this qualification commits to V as its working convention (matching the
  accepted Batch 02 Ohm's-law/voltage-drop formulae) without teaching a second, conflicting system.
- **SI quantities**: exponents preserved (m^2, m^3); density bound to a valid mass-per-volume unit (kg/m^3);
  K and degC are not treated as interchangeable symbols (`EQCT-LP-01`).
- **Practical unit conversion**: bound to a genuine method (squaring/cubing the linear factor for area/volume),
  not a general maths course; does not assume a length factor applies unmodified to area/volume (`EQCT-LP-02`).
- **Resistance vs resistivity**: not duplicated beyond Batch 02's accepted EFS-LP-05/06 (see overlap audit).
- **Power, energy, power factor**: power is a rate, energy is cumulative (kWh is energy, never power), power
  factor is dimensionless with no unit and is scoped narrowly to the sinusoidal cos-phi case only (`EQCT-LP-05`,
  `EQCT-LP-06`, `EQCT-LP-07`).
- **Impedance, resistance, reactance**: impedance is explicitly taught as NOT the simple arithmetic sum of
  resistance and reactance (R+X does not equal Z; vector/complex combination instead), without introducing
  complex-number/phasor calculation as a mastery/calculation outcome (`EQCT-LP-13`).
- **Capacitance/capacitive reactance** and **inductance/inductive reactance**: each pair is split into two
  independently-diagnosable learning points (per the task's explicit prompt to consider this split), with the
  full reactance formula's frequency/component dependence taught conceptually only, not as a required
  calculation outcome (`EQCT-LP-09`/`10`, `EQCT-LP-11`/`12`).
- **Measuring instruments**: ammeter (series, current), voltmeter (parallel, pd), ohmmeter (resistance,
  de-energised safe use including the charged-capacitor stored-energy case), wattmeter (single-phase,
  current-coil-series + voltage-coil-parallel), energy meter (integrates energy over time) all covered at the
  qualification's depth; three-phase wattmeter methods, instrument transformers, calibration engineering and
  advanced meter circuitry are explicitly excluded (`EQCT-LP-14`--`EQCT-LP-19`). Internal resistance is taught
  as a design goal ("very low"/"very high", per the genuinely-read OpenStax passage), never as a literal
  zero/infinite claim about a real meter (`EQCT-LP-19`).

## Proposed learning-point summary

19 new learning points (`EQCT-LP-01` through `EQCT-LP-19`), all `evidenceReadiness: READY`, all
`status: PROPOSED_FOR_PA_REVIEW` (none accepted or frozen). See
`ELECTRICAL-QUANTITIES-AND-CIRCUIT-THEORY-LEARNING-POINTS.json` / `.md` for full detail, and their embedded
57-requirement coverage matrix (every requirement maps either to a new `EQCT-LP-*` or, for the 8 reused
resistance/resistivity requirements, to the existing accepted `EFS-LP-05`/`EFS-LP-06`).

## Validation

See the Node.js validation script run for this batch (`validate-batch04.js`, run from the repository root before
committing) and its console output, summarised in the final report to the orchestrating session. All 27 checks
specified in the task were run; all passed.
