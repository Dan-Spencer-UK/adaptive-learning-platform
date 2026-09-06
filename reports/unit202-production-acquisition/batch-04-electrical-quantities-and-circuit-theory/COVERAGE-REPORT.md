# Batch 04 -- Electrical Quantities and Circuit Theory: Coverage Report

## Scope

57 requirements / 57 unique `evidenceRequirementId`s were selected from the frozen
`reports/backtests/unit202-evidence-acquisition-preflight/UNIT202-EVIDENCE-REQUIREMENT-PLAN.json`
(all with `canonicalRequirementKey` containing `::electrical-quantities-and-circuit-theory::`). This selection was
pre-confirmed by the orchestrating session before this pass began; no requirement was added, removed, renamed,
merged or reinterpreted in this pass.

Work proceeded through four internal research clusters, each validated before moving to the next:

| Cluster | Requirements | Status (after the internal audit correction pass) |
|---|---|---|
| 1. SI quantities and practical unit conversion | 9 | 8 VERIFIED, 1 PARTIAL |
| 2. Core electrical quantities (current, voltage, resistance, resistivity, power, energy, power factor) | 26 | 23 VERIFIED, 3 PARTIAL |
| 3. AC quantities (frequency, impedance, capacitance/capacitive reactance, inductance/inductive reactance) | 15 | 14 VERIFIED, 1 PARTIAL |
| 4. Measuring instruments | 7 | 4 VERIFIED, 3 PARTIAL |
| **Total** | **57** | **49 VERIFIED, 8 PARTIAL** |

(Note: the task specification's own narrative described clusters 2 and 3 as "25" and "16" requirements
respectively; the frozen plan's actual per-topic counts are 26 and 15 -- length/area/volume/mass/density/time/
velocity/temperature/practical-conversion = 9 for cluster 1, current/voltage/resistance/resistivity/power/
energy/power-factor = 26 for cluster 2, frequency/impedance/capacitance-and-reactance/inductance-and-reactance =
15 for cluster 3, and the seven named instruments = 7 for cluster 4. All four totals still sum to the
confirmed 57. This is a cosmetic discrepancy in the narrative cluster description, not a scope change --
per-cluster counts are not among this batch's binding validation criteria; the exact 57-ID match against the
frozen plan is, and it holds.)

## Evidence status totals

**49 VERIFIED, 8 PARTIAL, 0 GAP** (see `EVIDENCE-RESULTS.json`, `statusTotals`). See that file's own
`statusVocabulary` block for the exact definitions used throughout this batch.

> **This batch was originally recorded as 57/57 VERIFIED. That was not earned.** An internal adversarial audit
> pass, run after the initial acquisition and before any Product Architect review, downgraded eight results and
> corrected a number of claims. An internal audit is a progression gate, not acceptance — it confers no Product
> Architect approval. The eight PARTIAL results are:
>
> | Requirement | Why it is PARTIAL |
> |---|---|
> | `power...::CONCEPT_DEFINITION::DISTINCTION` | The recorded `SRC-ETW-POWERTRIANGLE` passage **does not appear on the source page** (confirmed by re-fetch). Power factor's dimensionlessness is retained as a disclosed inference from the page's own `P/S = W/VA` identity, not as retrieved text. |
> | `power-factor...::CONCEPT_DEFINITION::DISTINCTION` | Same fabricated passage. **This is the batch's power-factor guardrail, and it now rests on inference rather than an explicit authoritative statement.** |
> | `inductance...::CONCEPT_DEFINITION::DISTINCTION` | The recorded `SRC-ETW-ACINDUCTORS` passage does not appear on the source page. The proposition carrying the DISTINCTION — that inductance is frequency-independent while reactance is not — is **unevidenced** in this batch. (The parallel capacitance DISTINCTION passage was confirmed genuine and is unaffected.) |
> | `ohmmeter-measures-resistance::EXACT_FACT` | No verbatim passage was ever captured — the field held a description of the page's structure. |
> | `ohmmeter-circuit-de-energised-safe-use-principle::PROCEDURE_COVERAGE` | `CALCULATION_METHOD` had been marked satisfied although the evidence contains no calculation; now recorded unresolved. **The safety content itself (de-energisation *and* stored capacitor charge) is fully evidenced and unaffected.** |
> | `energy-meter-measures-integrates-electrical-energy::EXACT_FACT` | The "integrates" half of the requirement is unevidenced by the single quoted NISTIR 8248 sentence. |
> | `practical-unit-conversion-needed-elsewhere-in-unit-202::PROCEDURE_COVERAGE` | `SRC-NIST-SP811-CH4` was cited under an authority class this requirement does not permit, with a passage that did not support its attributed claim; both were removed. The squared/cubed half remains fully evidenced. |
> | `resistivity...::SYMBOL_OR_CONVENTION::UNIT_SYMBOL` | Rests on a disclosed compounding of two NIST passages — which is this batch's own definition of PARTIAL. |
>
> Additionally, one **factually wrong** taught claim was corrected: the temperature requirement and `EQCT-LP-01`
> had asserted that "a temperature INTERVAL or an SI base-unit value uses K". That is incorrect and was
> contradicted by the result's own quoted NIST passage ("One Celsius degree is an interval of 1 K") — a
> temperature interval may be expressed in either °C or K with the same numerical value. Corrected in both places.
> Claims were also corrected for misattribution, dropped operating conditions (`P=V.I` needs its steady-state
> qualification), curriculum policy recorded as if a source asserted it, and a wattmeter claim that contradicted
> the batch's own power-factor teaching.

## Open matter for Product Architect judgment: source authority classification

`electronics-tutorials.ws` (the ten `SRC-ETW-*` sources) is classified `AUTHORITATIVE_TECHNICAL_REFERENCE`, and
that classification is **load-bearing, not cosmetic**. 22 of 57 results depend on an `SRC-ETW-*` source; 16 have
no non-ETW candidate at all. `SYMBOL_OR_CONVENTION` requirements exclude `AUTHORITATIVE_EDUCATIONAL_REFERENCE`,
so if the site were reclassified as educational — the class this same batch assigned to LibreTexts on comparable
reasoning — roughly ten symbol-convention results would fail their authority gate simultaneously. The site is
anonymous and commercial, with no named authors, editorial board, citations or errata process. **This was
deliberately not resolved unilaterally** (resolving it means fresh acquisition, not correction) and is recorded
in full in `SOURCE-REGISTER.json` under `openAuthorityClassificationMatterForProductArchitect`.

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

19 new learning points (`EQCT-LP-01` through `EQCT-LP-19`), all `status: PROPOSED_FOR_PA_REVIEW` (none accepted
or frozen). After the internal audit correction pass: **12 `READY`, 7 `HELD_PENDING_EVIDENCE_CORRECTION`**
(`EQCT-LP-02`, `-05`, `-07`, `-12`, `-15`, `-16`, `-18` — each carries an `evidenceReadinessNote` naming the
downgraded evidence beneath it). Three learning points also had their taught content corrected: `EQCT-LP-01`
(the factually wrong temperature-interval statement), `EQCT-LP-15` (an ohmmeter test-current mechanism that no
retrieved passage supports), and `EQCT-LP-17` (which taught that a wattmeter derives power as voltage × current,
contradicting `EQCT-LP-07`'s own power-factor teaching). See
`ELECTRICAL-QUANTITIES-AND-CIRCUIT-THEORY-LEARNING-POINTS.json` / `.md` for full detail, and their embedded
57-requirement coverage matrix (every requirement maps either to a new `EQCT-LP-*` or, for the 8 reused
resistance/resistivity requirements, to the existing accepted `EFS-LP-05`/`EFS-LP-06`).

## Validation

The batch's original validation run (`validate-batch04.js`) reported that all 27 checks specified in the
acquisition task passed. **That claim was too narrow.** A subsequent deterministic integrity run in the internal
audit pass — covering checks the original script did not perform — found four mechanical defects it had missed:

1. `SRC-NIST-SP811-CH4` was cited on the practical-unit-conversion requirement under an **authority class that
   requirement does not permit** (the original script never checked cited authority classes against each
   requirement's own frozen `sourceAuthorityClasses`).
2–4. Three `supportsRequirementSuffixes` **over-claims** in `SOURCE-REGISTER.json`, where a source asserted it
   supported a requirement on which it was not actually a candidate source (`SRC-ETW-INDUCTOR` on the inductance
   `UNIT_SYMBOL` requirement; `SRC-EOLSS-ELECQUANT` on the capacitance and inductance `DEFINITION` requirements).

All four are corrected. The semantic defects (fabricated passages, false-green dimensions, the incorrect
temperature claim, misattributions) were found by adversarial reading, not by any script, and are listed above.

Current deterministic state: 57/57 requirement IDs match the frozen plan exactly, with no duplicates or
omissions; all JSON parses; every cited source and normalized-claim reference resolves; every cited authority
class is permitted by its own requirement; prerequisite references resolve and the graph is acyclic; and the
Markdown and JSON learning-point inventories agree on all 19 points. One deliberate residual: `SRC-NIST-SP811-CH4`
remains registered but is now cited by no result — retained for the audit trail, with a `registrationNote`
explaining why, rather than deleted.
