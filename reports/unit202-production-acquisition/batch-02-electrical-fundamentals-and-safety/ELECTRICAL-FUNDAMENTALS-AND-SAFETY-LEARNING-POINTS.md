# Electrical Fundamentals and Safety — Accepted Learning-Point Inventory

**Status:** Accepted by the Product Architect. This is a curriculum-review artifact, not finished lesson prose — no full lessons, storyboards, assessment questions, or app content have been generated.

**Closure note (this revision):** the Product Architect reviewed the corrected 20-learning-point inventory and accepted it in principle, at the appropriate early-stage depth. Two remaining corrections were applied before closure: (1) `EFS-LP-19`'s (thermal effect of electric current) qualifier is corrected from "for a fixed resistance and time" to "for a fixed resistance" only — the rate of heat generation (power, P=I²R) is proportional to the square of the current for a fixed resistance; time governs the total heat energy produced over an interval, not the instantaneous rate, so it is no longer conflated with the rate itself; (2) `EFS-LP-06`'s (resistivity: meaning, symbol and unit) cross-domain prerequisites `FM-LP-18`/`FM-LP-19` (scientific/engineering notation) are removed, since that learning point is purely conceptual and does not itself require notation skills — those two prerequisites are moved to `EFS-LP-07` (using R=ρL/A), the calculation learning point that genuinely requires them. Following these corrections, **`EFS-LP-01` through `EFS-LP-20` are now frozen** as the approved Batch 02 learning-point identity baseline — see "Identity policy (frozen)" below.

**Prior narrow-correction revision:** before this closure, the Product Architect returned a verdict of **HOLD — NARROW CORRECTION** on the original 20-learning-point inventory: the acquisition itself was sound (all 28 requirements processed, the 14-source evidence set sufficient, the inventory broadly at the correct depth), but several semantic claims, mastery-granularity decisions, and prerequisite mappings needed correcting. A one-time, pre-freeze renumbering was authorized and applied: (1) the original combined resistivity/`R=ρL/A` learning point was **split** into two independently-diagnosable outcomes (`EFS-LP-06`, resistivity's meaning/symbol/unit; `EFS-LP-07`, using the formula); (2) the standalone fuse-operation learning point was **removed**, with its evidence requirement remapped to the thermal-effect learning point (`EFS-LP-19`), since fuse operation is an application of the thermal effect, not its own mastery outcome. The split and the removal net to the same total of 20 learning points. See `EVIDENCE-RESULTS.json`'s own `paCorrectionNote` and `paClosureNote` for the underlying evidence-level corrections (voltage drop, `P=V²/R`, parallel-resistance claim, conductors/insulators, conventional current, thermal effect).

**Total learning points: 20**, covering all 28 electrical-fundamentals-and-safety evidence requirements (batch 02 of six planned Unit 202 production domains; batch 01, foundational mathematics, is already accepted).

## Instructional sequence

Sequenced pedagogically (electron theory/current → conductors/resistance → Ohm's law → voltage drop → series circuits → parallel circuits → power → thermal effect/fuse → chemical effect), not alphabetically.

| Order | ID | Title | Learner outcome | Prerequisites (within-domain) | Cross-domain prerequisites | Evidence status |
|---|---|---|---|---|---|---|
| 1 | EFS-LP-01 | Basic electron theory | Describe atomic structure and explain conduction via free electrons | — | — | READY |
| 2 | EFS-LP-02 | Current as the rate of flow of electric charge | State I=charge/time and use it | EFS-LP-01 | FM-LP-04, FM-LP-13 | READY |
| 3 | EFS-LP-03 | Conventional current and electron flow | Distinguish the two directional conventions | EFS-LP-01, EFS-LP-02 | — | READY |
| 4 | EFS-LP-04 | Conductors and insulators | Explain the conductor/insulator distinction via resistivity | EFS-LP-01 | — | READY |
| 5 | EFS-LP-05 | Resistance | State the definition and unit of resistance | — | — | READY |
| 6 | EFS-LP-06 | Resistivity: meaning, symbol and unit | Explain resistivity as a material property and state ρ/Ω·m | EFS-LP-05 | — | READY |
| 7 | EFS-LP-07 | Using R = ρL/A | Identify R, ρ, L, A and calculate/rearrange R=ρL/A, including with scientific/engineering-notation values | EFS-LP-06 | FM-LP-04, FM-LP-13, FM-LP-16, FM-LP-18, FM-LP-19 | READY |
| 8 | EFS-LP-08 | Ohm's law: V = IR and rearrangements | State Ohm's law and use V=IR, I=V/R, R=V/I | EFS-LP-05 | FM-LP-04, FM-LP-13, FM-LP-16 | READY |
| 9 | EFS-LP-09 | Voltage drop across resistance | Explain voltage drop and use Vdrop=IR | EFS-LP-08 | — | READY |
| 10 | EFS-LP-10 | Calculating voltage drop | Calculate cable voltage drop and compare against the applicable design criterion | EFS-LP-09 | FM-LP-04, FM-LP-13, FM-LP-19 | READY |
| 11 | EFS-LP-11 | Series circuit: current | State current is common throughout a series circuit | EFS-LP-02 | — | READY |
| 12 | EFS-LP-12 | Series circuit: total resistance | Calculate total series resistance | EFS-LP-05, EFS-LP-11 | FM-LP-04 | READY |
| 13 | EFS-LP-13 | Series circuit: voltage sharing | Calculate voltage shared across series resistors | EFS-LP-11, EFS-LP-12, EFS-LP-09 | FM-LP-04, FM-LP-10 | READY |
| 14 | EFS-LP-14 | Parallel circuit: voltage | State voltage is common across parallel branches | EFS-LP-08 | — | READY |
| 15 | EFS-LP-15 | Parallel circuit: current | State current divides/sums across parallel branches | EFS-LP-14 | FM-LP-04 | READY |
| 16 | EFS-LP-16 | Parallel circuit: equivalent resistance | Calculate parallel equivalent resistance | EFS-LP-05, EFS-LP-15 | FM-LP-01, FM-LP-02, FM-LP-04 | READY |
| 17 | EFS-LP-17 | Electrical power formulas | State and select the appropriate power formula | EFS-LP-08 | FM-LP-04, FM-LP-13, FM-LP-14 | READY |
| 18 | EFS-LP-18 | Calculating power in a DC circuit | Reduce a network and calculate its power | EFS-LP-17, EFS-LP-12, EFS-LP-16 | FM-LP-04, FM-LP-16 | READY |
| 19 | EFS-LP-19 | Thermal effect of electric current | State that, for a fixed resistance, heating power is proportional to I², and explain fuse operation | EFS-LP-17 | — | READY |
| 20 | EFS-LP-20 | Chemical effect and electrolysis | Explain electrolysis and anode/cathode roles | EFS-LP-02 | — | READY |

**All 20 learning points are READY and accepted. None are HELD or partially evidenced.**

## Design rationale: why 20 learning points, not 28

Two combining decisions, one splitting decision, and one contextualisation decision drove the reduction from 28 evidence requirements to 20 learning points:

- **Combined (evidence-requirement-per-topic, one teachable outcome):** conductors+insulators (EFS-LP-04, always taught/assessed as one comparison); Ohm's law+V=IR-and-rearrangements (EFS-LP-08, one relationship viewed as concept and formula); voltage-drop-definition+Vdrop=IR (EFS-LP-09, same logic as Ohm's law); the three power formulas P=VI/P=I²R/P=V²/R (EFS-LP-17, algebraically equivalent forms of one relationship, exactly as the frozen requirement plan itself frames the concern).
- **Split (independently diagnosable, previously over-combined):** resistivity's meaning/symbol/unit (EFS-LP-06) is now separate from using the formula R=ρL/A (EFS-LP-07) — a learner can know that resistivity is a shape-independent material property with symbol ρ and unit Ω·m without yet being able to apply R=ρL/A, and the reverse is equally possible.
- **Kept separate (independently diagnosable, a common point of distinct confusion):** the three series-circuit relationships (current/resistance/voltage) and the three parallel-circuit relationships (voltage/current/resistance) are each their own learning point, mirroring the frozen plan's own three-way split for each — a learner can master one and still misapply another, which is the precise false-green risk this batch's acquisition brief named for series/parallel relationships. Voltage-drop-as-concept is kept separate from voltage-drop-as-calculation-procedure (EFS-LP-09 vs EFS-LP-10), and power-formulas-as-concept is kept separate from the DC-circuit power-calculation procedure (EFS-LP-17 vs EFS-LP-18), for the same reason.
- **Contextualised, not given independent mastery (previously mis-split):** fuse operation is folded into the thermal-effect learning point (EFS-LP-19) as a practical application/example, not a standalone outcome — a learner is expected to connect Joule heating to how a fuse works, but independent mastery of fuse construction, types, selection, coordination, regulations, or fault-protection design is out of scope for this batch.

## Mandatory reuse of Batch 01 foundational-mathematics prerequisites

Every cross-domain prerequisite below is a genuine dependency, checked against the accepted Batch 01 inventory — no mathematics learning point was duplicated under an electrical name, and no `FM-LP-*` ID was edited or renumbered.

| Foundational-mathematics ID | Reused as prerequisite for |
|---|---|
| FM-LP-01 (equivalent fractions/simplifying) | EFS-LP-16 (parallel equivalent resistance — reciprocal-fraction addition) |
| FM-LP-02 (four operations on fractions) | EFS-LP-16 (parallel equivalent resistance) |
| FM-LP-04 (the four operations on decimals) | EFS-LP-02, EFS-LP-07, EFS-LP-08, EFS-LP-10, EFS-LP-12, EFS-LP-13, EFS-LP-15, EFS-LP-16, EFS-LP-17, EFS-LP-18 — every learning point with an explicit numerical calculation outcome |
| FM-LP-10 (direct proportion/unit-value method) | EFS-LP-13 (series voltage sharing — a direct-proportion relationship) |
| FM-LP-13 (substitution and order of operations) | EFS-LP-02, EFS-LP-07, EFS-LP-08, EFS-LP-10, EFS-LP-17 |
| FM-LP-14 (laws of indices, positive powers) | EFS-LP-17 (power formulas — I² and V² are powers) |
| FM-LP-16 (simple formula rearrangement) | EFS-LP-07, EFS-LP-08, EFS-LP-18 |
| FM-LP-18 (standard/scientific form) | EFS-LP-07 (using R=ρL/A with resistivity values in scientific notation, e.g. 1.7×10⁻⁸ Ω·m) |
| FM-LP-19 (engineering notation/SI prefixes) | EFS-LP-07 (SI-prefixed dimensions, e.g. a cross-sectional area given in mm²), EFS-LP-10 (mV/A/m cable tables) |

Batch 01's own `FOUNDATIONAL-MATHEMATICS-LEARNING-POINTS.json` had already flagged `FM-LP-01`/`FM-LP-02` as foundational for "parallel-resistance-style formulae (1/R = 1/R₁ + 1/R₂)" before this batch existed — that anticipated prerequisite is confirmed and used here (EFS-LP-16), not invented after the fact.

**Correction applied in the prior pass:** `FM-LP-13` (substitution/order of operations) is removed from `EFS-LP-05` (resistance), which is purely definitional (states what resistance is and its unit, with no calculation outcome of its own) — arithmetic prerequisites are not attached to purely conceptual or definitional learning points. `FM-LP-04` (decimal arithmetic) is attached to every learning point with an explicit numerical calculation outcome, listed in the table above.

**Correction applied in this closure pass:** `FM-LP-18`/`FM-LP-19` (scientific/engineering notation) are moved from `EFS-LP-06` to `EFS-LP-07` — `EFS-LP-06` is purely conceptual (resistivity's meaning, symbol, unit) and does not itself require notation skills to understand; `EFS-LP-07` is the calculation learning point that genuinely requires reading resistivity values in scientific notation and handling SI-prefixed dimensions consistently. This does not create a separate unit-conversion learning point — notation/prefix handling remains reused foundational mathematics knowledge, applied within EFS-LP-07, not retaught.

Not every mathematically-adjacent `FM-LP-*` ID was added "just in case" — for example, indices' second half (FM-LP-15, negative indices) is not listed as a prerequisite anywhere in this batch, since no electrical-fundamentals learning point in this batch requires it.

## Learning points by group

### Electron theory and current (EFS-LP-01 to EFS-LP-03)

- **EFS-LP-01 — Basic electron theory.** Atomic structure (protons/neutrons/electrons, neutral atom) and free-electron mobility as the basis of conduction. *Exclusions:* electron shells/orbitals, band theory, ionisation.
- **EFS-LP-02 — Current as the rate of flow of electric charge.** I=charge/time, ampere=coulomb/second. Deliberately worded to teach current as charge flow as the correct definition (not electron flow as an equivalent restatement) — the false-green risk this batch's brief explicitly named. *Exclusions:* drift velocity, charge-carrier density.
- **EFS-LP-03 — Conventional current and electron flow.** Conventional current is defined as the direction positive charge would move; in the external circuit of a DC source this is commonly described as positive-to-negative, but this is scoped to that specific case, not presented as an unqualified universal rule. Electrons drift in the opposite direction; both give identical circuit-analysis results. *Exclusions:* semiconductor hole flow.

### Conductors, resistance, resistivity (EFS-LP-04 to EFS-LP-07)

- **EFS-LP-04 — Conductors and insulators.** Combined as one comparison. Conductors allow charge to move relatively readily (comparatively low resistance/resistivity), rather than "flow freely"; insulators strongly oppose charge movement and carry negligible/extremely small current at ordinary voltages, rather than an absolute "cannot flow". *Exclusions:* semiconductors, superconductivity.
- **EFS-LP-05 — Resistance.** R=V/I, unit ohms. Definitional only — no calculation prerequisite attached.
- **EFS-LP-06 — Resistivity: meaning, symbol and unit.** Resistivity as a shape-independent material property; symbol ρ; unit ohm-metre (Ω·m). Split from a previously combined learning point that also included the formula — a learner can know what resistivity is without yet applying R=ρL/A. Purely conceptual: carries no cross-domain (mathematics) prerequisite of its own — notation skills belong to EFS-LP-07, the calculation learning point (**corrected this closure pass**). *Exclusions:* temperature dependence, semiconductor/superconductor resistivity, the formula itself (see EFS-LP-07).
- **EFS-LP-07 — Using R = ρL/A.** Identifying R, ρ, L, A; qualitative reasoning about how R changes with each; calculating or rearranging for an unknown, including where resistivity is given in scientific notation or a dimension is given with an SI prefix (**corrected this closure pass**: FM-LP-18/FM-LP-19 moved here from EFS-LP-06). *Exclusions:* anisotropic conductors, first-principles derivation.

### Ohm's law and voltage drop (EFS-LP-08 to EFS-LP-10)

- **EFS-LP-08 — Ohm's law: V = IR and rearrangements.** Stated as a conditional (ohmic-material) relationship, not a universal law. Concept and formula combined — the same single skill. *Exclusions:* non-ohmic devices, AC impedance.
- **EFS-LP-09 — Voltage drop across resistance.** What a voltage drop is, and Vdrop=IR. Kept separate from EFS-LP-10 (calculation procedure) — concept vs. procedure are different skills.
- **EFS-LP-10 — Calculating voltage drop.** The (mV/A/m)×Ib×L/1000 procedure. The outcome directs the learner to calculate the voltage drop and compare it with the stated or applicable design criterion for the problem, rather than checking against a universal "permitted maximum" — BS 7671 Table 4Ab's 5% figure is a recommended, informative value for one specific context (non-lighting loads from a public LV distribution system), not a statutory limit applying to every design. No separate mastery point is created for the 5% example. *Exclusions:* cable correction factors, three-phase/AC voltage drop, treating 5% as universal.

### Series circuits (EFS-LP-11 to EFS-LP-13)

- **EFS-LP-11 — Series circuit: current.** Current common throughout.
- **EFS-LP-12 — Series circuit: total resistance.** Req=R1+R2+...
- **EFS-LP-13 — Series circuit: voltage sharing.** Supply voltage divides in proportion to resistance; drops sum to the supply. Kept as three separate learning points (mirroring the frozen plan's own three-way split) because each is independently diagnosable.

### Parallel circuits (EFS-LP-14 to EFS-LP-16)

- **EFS-LP-14 — Parallel circuit: voltage.** Voltage common across branches.
- **EFS-LP-15 — Parallel circuit: current.** Current divides and sums.
- **EFS-LP-16 — Parallel circuit: equivalent resistance.** 1/Req=1/R1+1/R2+... States only the reciprocal relationship the evidence actually establishes (no "always less than the smallest branch" assertion). Requires fraction arithmetic (FM-LP-01/FM-LP-02), as Batch 01's own inventory anticipated.

### Power and thermal effect (EFS-LP-17 to EFS-LP-19)

- **EFS-LP-17 — Electrical power formulas.** Three equivalent forms of one relationship, combined as the frozen plan itself frames them. P=V²/R applies whenever V is the actual voltage across the resistance in question; negligible internal resistance is relevant only when a source's emf is substituted for the load's actual terminal voltage — a distinct step, not a property of the formula. Learners must choose V, I and R values that refer to the same component or equivalent load. *Exclusions:* AC power/power factor, energy (kWh) calculations.
- **EFS-LP-18 — Calculating power in a DC circuit.** Network reduction to Req, then formula application. Kept separate from EFS-LP-17 — knowing the formulas and executing a multi-resistor calculation are different skills.
- **EFS-LP-19 — Thermal effect of electric current.** For a fixed resistance, the rate of heat generation (power, P=I²R) is proportional to the square of the current — doubling the current quadruples the heating power (**corrected this closure pass**: "and time" removed; time governs the total heat energy produced over an interval, not the instantaneous rate, so it is not part of the rate qualifier). Also covers fuse operation as a practical application/example of this same thermal effect (excessive current → heating in the fuse element → melting → circuit interruption) — the previously standalone fuse-operation learning point was removed and its evidence requirement remapped here. Independent mastery of fuse construction, types, selection, coordination, regulations, or fault-protection design remains out of scope.

### Chemical effect (EFS-LP-20)

- **EFS-LP-20 — Chemical effect and electrolysis.** Electrolyte, anode oxidation, cathode reduction, decomposition, via the electrolysis-of-water example. *Exclusions:* Faraday's laws of electrolysis, electrode potentials, industrial-scale processes.

## Coverage matrix — every requirement maps to at least one learning point

| Evidence requirement | Learning point(s) |
|---|---|
| Basic electron theory | EFS-LP-01 |
| Current as charge/electron-flow concept | EFS-LP-02 |
| Conventional current vs. electron flow | EFS-LP-03 |
| Conductors | EFS-LP-04 |
| Insulators | EFS-LP-04 |
| Resistance | EFS-LP-05 |
| Resistivity | EFS-LP-06 |
| Rho (resistivity symbol) | EFS-LP-06 |
| Ohm-metre (resistivity unit) | EFS-LP-06 |
| R = ρL/A and rearrangement | EFS-LP-07 |
| Ohm's law | EFS-LP-08 |
| V=IR and rearrangements | EFS-LP-08 |
| Voltage drop (definition) | EFS-LP-09 |
| Vdrop = IR | EFS-LP-09 |
| Appropriate voltage-drop calculation | EFS-LP-10 |
| Series circuit: current common | EFS-LP-11 |
| Series circuit: resistance sums | EFS-LP-12 |
| Series circuit: voltage shares/sums | EFS-LP-13 |
| Parallel circuit: voltage common | EFS-LP-14 |
| Parallel circuit: current divides/sums | EFS-LP-15 |
| Parallel circuit: equivalent resistance | EFS-LP-16 |
| P = VI | EFS-LP-17 |
| P = I²R | EFS-LP-17 |
| P = V²/R (where appropriate) | EFS-LP-17 |
| Suitable DC-circuit power calculations | EFS-LP-18 |
| Thermal effect of current | EFS-LP-19 |
| Fuse operation (thermal-effect example) | EFS-LP-19 |
| Chemical effect / electrolysis | EFS-LP-20 |

No orphaned learning points: every one of the 20 traces to at least one evidence-requirement claim recorded in `EVIDENCE-RESULTS.json`. Note that `EFS-LP-06` and `EFS-LP-19` each trace to more than one evidence requirement (three and two respectively) — evidence-requirement count and learning-point count are not required to match one-to-one.

## Held learning points

None. Every learning point is `READY` and accepted.

## Identity policy (frozen)

`EFS-LP-01` through `EFS-LP-20` are now the **approved Batch 02 learning-point identity baseline**, mirroring the discipline already applied to the accepted Batch 01 `FM-LP-*` inventory. Future revisions to this inventory must:

1. **Preserve every existing ID exactly** — an ID is never reassigned to a different learning point.
2. **Append new IDs** (`EFS-LP-21` onward) for genuinely new learning points, rather than inserting into the existing numeric sequence.
3. **Deprecate rather than silently reuse** a removed ID — if a learning point is retired, its ID is recorded as deprecated (see `deprecatedLearningPointIds` in the JSON), not recycled.
4. **Never renumber** the inventory merely because the taught/instructional sequence changes.

Instructional order is tracked separately via the `instructionalSequence` field, which may be freely reordered without affecting any learning point's stable `id`. No further renumbering of the kind applied during the prior correction pass (the resistivity split, the fuse removal) is authorized.
