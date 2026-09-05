# Electrical Fundamentals and Safety — Proposed Learning-Point Inventory

**Status:** Proposed for Product Architect review. This is a curriculum-review artifact, not finished lesson prose — no full lessons, storyboards, assessment questions, or app content have been generated. No learning point here is Product-Architect-approved.

**Total learning points: 20**, covering all 28 electrical-fundamentals-and-safety evidence requirements (batch 02 of six planned Unit 202 production domains; batch 01, foundational mathematics, is already accepted).

## Proposed instructional sequence

Sequenced pedagogically (electron theory/current → conductors/resistance → Ohm's law → voltage drop → series circuits → parallel circuits → power → thermal effect/fuse → chemical effect), not alphabetically.

| Order | ID | Title | Learner outcome | Prerequisites (within-domain) | Cross-domain prerequisites | Evidence status |
|---|---|---|---|---|---|---|
| 1 | EFS-LP-01 | Basic electron theory | Describe atomic structure and explain conduction via free electrons | — | — | READY |
| 2 | EFS-LP-02 | Current as the rate of flow of electric charge | State I=charge/time and use it | EFS-LP-01 | FM-LP-13 | READY |
| 3 | EFS-LP-03 | Conventional current versus electron flow | Distinguish the two directional conventions | EFS-LP-01, EFS-LP-02 | — | READY |
| 4 | EFS-LP-04 | Conductors and insulators | Explain the conductor/insulator distinction via resistivity | EFS-LP-01 | — | READY |
| 5 | EFS-LP-05 | Resistance | State the definition and unit of resistance | — | FM-LP-13 | READY |
| 6 | EFS-LP-06 | Resistivity, its symbol/unit, and R = ρL/A | Explain resistivity and use R=ρL/A | EFS-LP-05 | FM-LP-16, FM-LP-18, FM-LP-19 | READY |
| 7 | EFS-LP-07 | Ohm's law (V = IR and its rearrangements) | State Ohm's law and use V=IR, I=V/R, R=V/I | EFS-LP-05 | FM-LP-13, FM-LP-16 | READY |
| 8 | EFS-LP-08 | Voltage drop (concept and Vdrop = IR) | Explain voltage drop and use Vdrop=IR | EFS-LP-07 | — | READY |
| 9 | EFS-LP-09 | Calculating voltage drop in a circuit/cable | Calculate cable voltage drop and check against a limit | EFS-LP-08 | FM-LP-13, FM-LP-19 | READY |
| 10 | EFS-LP-10 | Series circuit: current | State current is common throughout a series circuit | EFS-LP-02 | — | READY |
| 11 | EFS-LP-11 | Series circuit: resistance | Calculate total series resistance | EFS-LP-05, EFS-LP-10 | — | READY |
| 12 | EFS-LP-12 | Series circuit: voltage sharing | Calculate voltage shared across series resistors | EFS-LP-10, EFS-LP-11, EFS-LP-08 | FM-LP-10 | READY |
| 13 | EFS-LP-13 | Parallel circuit: voltage | State voltage is common across parallel branches | EFS-LP-07 | — | READY |
| 14 | EFS-LP-14 | Parallel circuit: current | State current divides/sums across parallel branches | EFS-LP-13 | — | READY |
| 15 | EFS-LP-15 | Parallel circuit: equivalent resistance | Calculate parallel equivalent resistance | EFS-LP-05, EFS-LP-14 | FM-LP-01, FM-LP-02 | READY |
| 16 | EFS-LP-16 | Electrical power formulas (P=VI, P=I²R, P=V²/R) | State and select the appropriate power formula | EFS-LP-07 | FM-LP-13, FM-LP-14 | READY |
| 17 | EFS-LP-17 | Calculating power in a DC circuit | Reduce a network and calculate its power | EFS-LP-16, EFS-LP-11, EFS-LP-15 | FM-LP-16 | READY |
| 18 | EFS-LP-18 | Thermal effect of current (Joule heating) | State that current generates heat via P=I²R | EFS-LP-16 | — | READY |
| 19 | EFS-LP-19 | Fuse operation as an application of the thermal effect | Explain how a fuse uses the thermal effect | EFS-LP-18 | — | READY |
| 20 | EFS-LP-20 | Chemical effect of current (electrolysis) | Explain electrolysis and anode/cathode roles | EFS-LP-02 | — | READY |

**All 20 learning points are READY and proposed. None are HELD or partially evidenced.**

## Design rationale: why 20 learning points, not 28

Two combining decisions and one splitting-preservation decision drove the reduction from 28 evidence requirements to 20 learning points:

- **Combined (evidence-requirement-per-topic, one teachable outcome):** conductors+insulators (EFS-LP-04, always taught/assessed as one comparison); resistivity+its symbol+its unit+R=ρL/A (EFS-LP-06, four facets of one material-property concept); Ohm's law+V=IR-and-rearrangements (EFS-LP-07, one relationship viewed as concept and formula); voltage-drop-definition+Vdrop=IR (EFS-LP-08, same logic as Ohm's law); the three power formulas P=VI/P=I²R/P=V²/R (EFS-LP-16, algebraically equivalent forms of one relationship, exactly as the frozen requirement plan itself frames the concern).
- **Kept separate (independently diagnosable, a common point of distinct confusion):** the three series-circuit relationships (current/resistance/voltage) and the three parallel-circuit relationships (voltage/current/resistance) are each their own learning point, mirroring the frozen plan's own three-way split for each — a learner can master one and still misapply another, which is the precise false-green risk this batch's acquisition brief named for series/parallel relationships. Voltage-drop-as-concept is kept separate from voltage-drop-as-calculation-procedure (EFS-LP-08 vs EFS-LP-09), and power-formulas-as-concept is kept separate from the DC-circuit power-calculation procedure (EFS-LP-16 vs EFS-LP-17), for the same reason: knowing a relationship and being able to execute its calculation procedure are different, separately-assessable skills.
- **Not combined merely for brevity:** thermal effect of current (EFS-LP-18) and fuse operation (EFS-LP-19) are kept separate — a learner can understand Joule heating in the abstract without yet connecting it to a specific protective device's operation.

## Mandatory reuse of Batch 01 foundational-mathematics prerequisites

Every cross-domain prerequisite below is a genuine dependency, checked against the accepted Batch 01 inventory — no mathematics learning point was duplicated under an electrical name, and no `FM-LP-*` ID was edited or renumbered.

| Foundational-mathematics ID | Reused as prerequisite for |
|---|---|
| FM-LP-01 (equivalent fractions/simplifying) | EFS-LP-15 (parallel equivalent resistance — reciprocal-fraction addition) |
| FM-LP-02 (four operations on fractions) | EFS-LP-15 (parallel equivalent resistance) |
| FM-LP-10 (direct proportion/unit-value method) | EFS-LP-12 (series voltage sharing — a direct-proportion relationship) |
| FM-LP-13 (substitution and order of operations) | EFS-LP-02, EFS-LP-05, EFS-LP-07, EFS-LP-09, EFS-LP-16 |
| FM-LP-14 (laws of indices, positive powers) | EFS-LP-16 (power formulas — I² and V² are powers) |
| FM-LP-16 (simple formula rearrangement) | EFS-LP-06, EFS-LP-07, EFS-LP-17 |
| FM-LP-18 (standard/scientific form) | EFS-LP-06 (resistivity values, e.g. 1.7×10⁻⁸ Ω·m) |
| FM-LP-19 (engineering notation/SI prefixes) | EFS-LP-06, EFS-LP-09 (mV/A/m cable tables, µΩ·m-scale resistivity values) |

Batch 01's own `FOUNDATIONAL-MATHEMATICS-LEARNING-POINTS.json` had already flagged `FM-LP-01`/`FM-LP-02` as foundational for "parallel-resistance-style formulae (1/R = 1/R₁ + 1/R₂)" before this batch existed — that anticipated prerequisite is confirmed and used here (EFS-LP-15), not invented after the fact.

Not every mathematically-adjacent `FM-LP-*` ID was added "just in case" — for example, indices' second half (FM-LP-15, negative indices) is not listed as a prerequisite anywhere in this batch, since no electrical-fundamentals learning point in this batch requires it.

## Learning points by group

### Electron theory and current (EFS-LP-01 to EFS-LP-03)

- **EFS-LP-01 — Basic electron theory.** Atomic structure (protons/neutrons/electrons, neutral atom) and free-electron mobility as the basis of conduction. *Exclusions:* electron shells/orbitals, band theory, ionisation.
- **EFS-LP-02 — Current as the rate of flow of electric charge.** I=charge/time, ampere=coulomb/second. Deliberately worded to teach current as charge flow as the correct definition (not electron flow as an equivalent restatement) — the false-green risk this batch's brief explicitly named. *Exclusions:* drift velocity, charge-carrier density.
- **EFS-LP-03 — Conventional current versus electron flow.** The two directional conventions and why both give identical circuit-analysis results. Kept separate from EFS-LP-02 so the two distinct misconceptions (charge-flow definition vs. direction convention) can be diagnosed independently. *Exclusions:* semiconductor hole flow.

### Conductors, resistance, resistivity (EFS-LP-04 to EFS-LP-06)

- **EFS-LP-04 — Conductors and insulators.** Combined as one comparison (loosely bound vs. tightly bound outer electrons; low vs. high resistivity). *Exclusions:* semiconductors, superconductivity.
- **EFS-LP-05 — Resistance.** R=V/I, unit ohms. Definitional only at this point; calculation practice follows once Ohm's law is taught.
- **EFS-LP-06 — Resistivity, its symbol/unit, and R = ρL/A.** Combines resistivity's meaning, symbol (ρ), unit (Ω·m) and the formula connecting it to R, L and A — four facets of one concept. Kept separate from resistance (EFS-LP-05) since resistivity-as-a-shape-independent-material-constant is a genuinely distinct, commonly-confused idea. *Exclusions:* temperature dependence of resistivity, semiconductor/superconductor resistivity.

### Ohm's law and voltage drop (EFS-LP-07 to EFS-LP-09)

- **EFS-LP-07 — Ohm's law (V = IR and its rearrangements).** Stated as a conditional (ohmic-material) relationship, not a universal law. Concept and formula combined — the same single skill. *Exclusions:* non-ohmic devices, AC impedance.
- **EFS-LP-08 — Voltage drop (concept and Vdrop = IR).** What a voltage drop is, and the formula. Kept separate from EFS-LP-09 (calculation procedure) — concept vs. procedure are different skills.
- **EFS-LP-09 — Calculating voltage drop in a circuit or cable run.** The (mV/A/m)×Ib×L/1000 procedure and the permitted-maximum check. *Exclusions:* cable correction factors, three-phase/AC voltage drop.

### Series circuits (EFS-LP-10 to EFS-LP-12)

- **EFS-LP-10 — Series circuit: current.** Current common throughout.
- **EFS-LP-11 — Series circuit: resistance.** Req=R1+R2+...
- **EFS-LP-12 — Series circuit: voltage sharing.** Supply voltage divides in proportion to resistance; drops sum to the supply. Kept as three separate learning points (mirroring the frozen plan's own three-way split) because each is independently diagnosable — the precise false-green risk this batch's brief named for series/parallel relationships.

### Parallel circuits (EFS-LP-13 to EFS-LP-15)

- **EFS-LP-13 — Parallel circuit: voltage.** Voltage common across branches.
- **EFS-LP-14 — Parallel circuit: current.** Current divides and sums.
- **EFS-LP-15 — Parallel circuit: equivalent resistance.** 1/Req=1/R1+1/R2+...; always less than the smallest branch resistance. Requires fraction arithmetic (FM-LP-01/FM-LP-02), as Batch 01's own inventory anticipated.

### Power and thermal effect (EFS-LP-16 to EFS-LP-19)

- **EFS-LP-16 — Electrical power formulas (P=VI, P=I²R, P=V²/R).** Three equivalent forms of one relationship, combined as the frozen plan itself frames them. The P=V²/R form's "where appropriate" condition (negligible internal/source resistance) is stated explicitly. *Exclusions:* AC power/power factor, energy (kWh) calculations.
- **EFS-LP-17 — Calculating power in a DC circuit.** Network reduction to Req, then formula application. Kept separate from EFS-LP-16 — knowing the formulas and executing a multi-resistor calculation are different skills.
- **EFS-LP-18 — Thermal effect of current (Joule heating).** Heat generation proportional to I²R.
- **EFS-LP-19 — Fuse operation as an application of the thermal effect.** How a fuse melts to protect a circuit. Kept separate from EFS-LP-18 — general principle vs. specific device application. This requirement carries `OPTIONAL_CONTEXT` (lower) priority in the frozen plan, though it is fully evidenced here.

### Chemical effect (EFS-LP-20)

- **EFS-LP-20 — Chemical effect of current (electrolysis).** Electrolyte, anode oxidation, cathode reduction, decomposition, via the electrolysis-of-water example. *Exclusions:* Faraday's laws of electrolysis, electrode potentials, industrial-scale processes.

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
| R = ρL/A and rearrangement | EFS-LP-06 |
| Ohm's law | EFS-LP-07 |
| V=IR and rearrangements | EFS-LP-07 |
| Voltage drop (definition) | EFS-LP-08 |
| Vdrop = IR | EFS-LP-08 |
| Appropriate voltage-drop calculation | EFS-LP-09 |
| Series circuit: current common | EFS-LP-10 |
| Series circuit: resistance sums | EFS-LP-11 |
| Series circuit: voltage shares/sums | EFS-LP-12 |
| Parallel circuit: voltage common | EFS-LP-13 |
| Parallel circuit: current divides/sums | EFS-LP-14 |
| Parallel circuit: equivalent resistance | EFS-LP-15 |
| P = VI | EFS-LP-16 |
| P = I²R | EFS-LP-16 |
| P = V²/R (where appropriate) | EFS-LP-16 |
| Suitable DC-circuit power calculations | EFS-LP-17 |
| Thermal effect of current | EFS-LP-18 |
| Fuse operation (thermal-effect example) | EFS-LP-19 |
| Chemical effect / electrolysis | EFS-LP-20 |

No orphaned learning points: every one of the 20 traces to at least one evidence-requirement claim recorded in `EVIDENCE-RESULTS.json`.

## Held learning points

None. Every learning point is `READY` and proposed for review.

## Identity policy (proposed, not yet frozen)

`EFS-LP-01` through `EFS-LP-20` are proposed IDs, not yet an approved identity baseline — unlike `FM-LP-*`, which the Product Architect has already frozen. If accepted, the same discipline Batch 01 now follows would apply: IDs preserved exactly, new learning points appended (`EFS-LP-21` onward) rather than inserted, and instructional order tracked separately from identity via the `instructionalSequence` field.
