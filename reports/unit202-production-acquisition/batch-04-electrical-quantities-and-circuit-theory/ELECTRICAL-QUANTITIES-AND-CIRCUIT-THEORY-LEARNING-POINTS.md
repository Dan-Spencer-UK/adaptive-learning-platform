# Electrical Quantities and Circuit Theory -- Proposed Learning Points (Batch 04)

**Status: `PROPOSED_FOR_PA_REVIEW`** -- curriculum-review artifact, not finished lesson prose. Not accepted, not frozen. Sequenced pedagogically (see Instructional Sequence below), not by numeric identity. Every learning point traces to at least one evidence-requirement claim in `EVIDENCE-RESULTS.json`.

Learning point count: **19** (`EQCT-LP-01` through `EQCT-LP-19`).

## Instructional sequence

(Pedagogical teaching order -- distinct from each learning point's stable numeric ID.)

1. `EQCT-LP-01` -- SI units for common physical quantities (length, area, volume, mass, density, time, velocity, temperature)
2. `EQCT-LP-02` -- Practical unit conversion, including squared and cubed quantities
3. `EQCT-LP-03` -- Current: meaning, quantity symbol and unit
4. `EQCT-LP-04` -- Voltage: meaning, quantity symbol and unit
5. `EQCT-LP-06` -- Energy: meaning, quantity symbol, unit, and distinction from power
6. `EQCT-LP-07` -- Power factor: meaning, notation, dimensionless nature, and distinction from power
7. `EQCT-LP-05` -- Power: meaning, quantity symbol, unit, and distinction from energy and power factor
8. `EQCT-LP-08` -- Frequency: meaning, quantity symbol and unit
9. `EQCT-LP-09` -- Capacitance: meaning, quantity symbol and unit
10. `EQCT-LP-10` -- Capacitive reactance: meaning, unit, and distinction from capacitance
11. `EQCT-LP-11` -- Inductance: meaning, quantity symbol and unit
12. `EQCT-LP-12` -- Inductive reactance: meaning, unit, and distinction from inductance
13. `EQCT-LP-13` -- Impedance: meaning, quantity symbol, unit, and distinction from resistance and reactance
14. `EQCT-LP-14` -- Ammeter and voltmeter: function and correct connection
15. `EQCT-LP-15` -- Ohmmeter: measures resistance
16. `EQCT-LP-16` -- Ohmmeter safe use: the circuit must be de-energised
17. `EQCT-LP-17` -- Wattmeter: measures power via combined current and voltage sensing
18. `EQCT-LP-18` -- Energy meter: measures and integrates electrical energy over time
19. `EQCT-LP-19` -- Practical meter internal resistance: low for ammeters, high for voltmeters

## Cross-domain prerequisite note

Cross-domain prerequisites reference the accepted, frozen Batch 01 (FM-LP-01..25), Batch 02 (EFS-LP-01..20) and Batch 03 (MM-LP-01..18) inventories. No FM-LP-*, EFS-LP-* or MM-LP-* ID is edited, renumbered, or duplicated here; only genuine prerequisites are recorded where a learning point's own outcome actually uses that prior skill.

## Overlap audit against frozen prior-batch learning points

### Resistance (meaning, quantity symbol R, unit symbol ohm/Ω, distinction from resistivity)

- **Decision:** REUSE_EXISTING_NO_NEW_LP
- **Existing learning point:** `EFS-LP-05`
- **Accompanying existing learning point:** `EFS-LP-06 (resistivity)`
- **Evidence requirements covered by reuse (not by a new EQCT-LP):**
  - `ER::provisional::unit202::electrical-quantities-and-circuit-theory::resistance-meaning-quantity-symbol-unit-name-symbol-distinction-from-resistivity::CONCEPT_DEFINITION::DEFINITION`
  - `ER::provisional::unit202::electrical-quantities-and-circuit-theory::resistance-meaning-quantity-symbol-unit-name-symbol-distinction-from-resistivity::CONCEPT_DEFINITION::DISTINCTION`
  - `ER::provisional::unit202::electrical-quantities-and-circuit-theory::resistance-meaning-quantity-symbol-unit-name-symbol-distinction-from-resistivity::SYMBOL_OR_CONVENTION::QUANTITY_SYMBOL`
  - `ER::provisional::unit202::electrical-quantities-and-circuit-theory::resistance-meaning-quantity-symbol-unit-name-symbol-distinction-from-resistivity::SYMBOL_OR_CONVENTION::UNIT_SYMBOL`
- **Rationale:** The accepted Batch 02 learning point EFS-LP-05 already teaches resistance's meaning (R=V/I) and unit (ohms); EFS-LP-06 already teaches resistivity's meaning, symbol (rho) and unit (ohm-metre) AND the resistance-vs-resistivity distinction explicitly. Batch 04's four resistance evidence requirements ask for exactly this same mastery (meaning, quantity symbol, unit symbol, distinction from resistivity) under new evidence-requirement IDs. Genuinely re-verified evidence for each of the four Batch 04 requirement IDs is recorded in EVIDENCE-RESULTS.json (re-fetched, re-read sources), but no new EQCT-LP identity is created, since doing so would duplicate an already-accepted, already-frozen mastery point purely to give Batch 04 its own identifier.
- **Representation question flagged for Product Architect review:** The current artifact format has no explicit field for 'this evidence requirement is satisfied by a PRIOR BATCH's learning point, not this batch's own inventory' -- it is only representable here as prose disclosure (this overlap-audit entry) plus a coverage-matrix row in COVERAGE-REPORT.md pointing at EFS-LP-05/06. If a future schema revision is undertaken, consider adding a structured 'satisfiedByExistingLearningPointId' field to the evidence-requirement-to-learning-point coverage matrix so this reuse pattern does not have to rely on prose alone.

### Resistivity (meaning, quantity symbol rho, unit symbol ohm-metre, distinction from resistance)

- **Decision:** REUSE_EXISTING_NO_NEW_LP
- **Existing learning point:** `EFS-LP-06`
- **Accompanying existing learning point:** `EFS-LP-05 (resistance)`
- **Evidence requirements covered by reuse (not by a new EQCT-LP):**
  - `ER::provisional::unit202::electrical-quantities-and-circuit-theory::resistivity-meaning-quantity-symbol-unit-name-symbol-distinction-from-resistance::CONCEPT_DEFINITION::DEFINITION`
  - `ER::provisional::unit202::electrical-quantities-and-circuit-theory::resistivity-meaning-quantity-symbol-unit-name-symbol-distinction-from-resistance::CONCEPT_DEFINITION::DISTINCTION`
  - `ER::provisional::unit202::electrical-quantities-and-circuit-theory::resistivity-meaning-quantity-symbol-unit-name-symbol-distinction-from-resistance::SYMBOL_OR_CONVENTION::QUANTITY_SYMBOL`
  - `ER::provisional::unit202::electrical-quantities-and-circuit-theory::resistivity-meaning-quantity-symbol-unit-name-symbol-distinction-from-resistance::SYMBOL_OR_CONVENTION::UNIT_SYMBOL`
- **Rationale:** Same rationale as the resistance entry above, mirrored for resistivity against the accepted EFS-LP-06.
- **Representation question flagged for Product Architect review:** Same representation question as the resistance entry above.

### Current (existence/meaning) vs the accepted charge-flow RELATIONSHIP

- **Decision:** NEW_LP_ADDED
- **Existing learning point:** `EFS-LP-02 (Current as the rate of flow of electric charge)`
- **New learning point:** `EQCT-LP-03`
- **Rationale:** EFS-LP-02 teaches the RELATIONSHIP I=Q/t (current as rate of charge flow) as its own calculation-bearing outcome; it does not itself state current's quantity symbol (I) or unit symbol (A) as an assessed identity fact, and its own evidence requirement is a different evidenceRequirementId (RELATIONSHIP mode) to Batch 04's (CONCEPT_DEFINITION/SYMBOL_OR_CONVENTION modes). Batch 04 therefore needs genuinely additional mastery (the identity/symbol facts), not a duplicate of EFS-LP-02's calculation mastery. EQCT-LP-03 does not re-teach or reference I=Q/t.

### Voltage (existence/meaning) vs the accepted voltage-drop RELATIONSHIP

- **Decision:** NEW_LP_ADDED
- **Existing learning point:** `EFS-LP-09 (Voltage drop across resistance)`
- **New learning point:** `EQCT-LP-04`
- **Rationale:** EFS-LP-09 teaches the specific voltage-DROP concept and formula (Vdrop=IR) across a resistance; it does not itself teach voltage's general meaning/quantity-symbol/unit-symbol as an identity fact independent of the drop context, nor does it address the U-vs-V convention question. Batch 04 needs this genuinely additional, more general identity mastery. EQCT-LP-04 does not re-teach or reference Vdrop=IR.

### Power (existence/meaning/symbols) vs the accepted power-FORMULA calculation mastery

- **Decision:** NEW_LP_ADDED
- **Existing learning point:** `EFS-LP-17 (Electrical power formulas)`
- **New learning point:** `EQCT-LP-05`
- **Rationale:** EFS-LP-17 teaches selecting and using P=VI/I^2R/V^2R as a calculation procedure; it does not itself teach power's quantity symbol/unit symbol as dedicated identity facts, nor the explicit distinction from energy and power factor that Batch 04's own frozen requirement demands. EQCT-LP-05 supplies exactly this additional conceptual/identity mastery and does not re-teach the calculation procedure itself.

## Learning points

### `EQCT-LP-01` -- SI units for common physical quantities (length, area, volume, mass, density, time, velocity, temperature)

**Evidence readiness:** READY

**Correction note (internal audit pass):** CORRECTED in the internal audit pass. This learning point previously taught that 'a temperature INTERVAL or an SI base-unit value uses K'. That was factually wrong and was contradicted by its own evidence result's quoted NIST passage ('One Celsius degree is an interval of 1 K'): intervals may be expressed in either deg C or K with the same numerical value. Only absolute values differ, by the 273.15 offset.

**Learner outcome:** The learner will be able to state the correct SI unit name and unit symbol for length, area, volume, mass, density, time, velocity and temperature.

**Knowledge / procedure:** Length: metre (m). Area: square metre (m^2). Volume: cubic metre (m^3). Mass: kilogram (kg). Density: kilogram per cubic metre (kg/m^3) -- a mass-per-volume compound unit, never a bare mass or bare volume unit. Time: second (s). Velocity: metre per second (m/s). Temperature: kelvin (K) is the SI base unit; degree Celsius (deg C) is a related, permitted everyday scale offset by 273.15 from kelvin, but K and deg C are not interchangeable symbols -- because one Celsius degree is an interval of exactly 1 K, a temperature DIFFERENCE or INTERVAL has the same numerical value in deg C as in K; what differs is the zero point, so an ABSOLUTE temperature is not the same number on the two scales (0 deg C = 273.15 K).

**Within-domain prerequisites:** (none)

**Cross-domain prerequisites:** (none)

**Knowledge-target IDs:** `unit202::ACQ-017`, `unit202::ACQ-018`, `unit202::ACQ-019`, `unit202::ACQ-020`, `unit202::ACQ-021`, `unit202::ACQ-022`, `unit202::ACQ-023`, `unit202::ACQ-024`

**Evidence-requirement IDs:**
- `ER::provisional::unit202::electrical-quantities-and-circuit-theory::length-correct-si-unit-and-unit-symbol::EXACT_FACT`
- `ER::provisional::unit202::electrical-quantities-and-circuit-theory::area-correct-si-unit-and-unit-symbol::EXACT_FACT`
- `ER::provisional::unit202::electrical-quantities-and-circuit-theory::volume-correct-si-unit-and-unit-symbol::EXACT_FACT`
- `ER::provisional::unit202::electrical-quantities-and-circuit-theory::mass-correct-si-unit-and-unit-symbol::EXACT_FACT`
- `ER::provisional::unit202::electrical-quantities-and-circuit-theory::density-correct-si-unit-and-unit-symbol::EXACT_FACT`
- `ER::provisional::unit202::electrical-quantities-and-circuit-theory::time-correct-si-unit-and-unit-symbol::EXACT_FACT`
- `ER::provisional::unit202::electrical-quantities-and-circuit-theory::velocity-correct-si-unit-and-unit-symbol::EXACT_FACT`
- `ER::provisional::unit202::electrical-quantities-and-circuit-theory::temperature-correct-si-unit-and-unit-symbol::EXACT_FACT`

**Normalized claim references:** SRC-NIST-LENGTH: metre/m; SRC-NIST-SP811-B9: square metre/m^2, cubic metre/m^3, metre per second/m/s, kilogram per cubic metre/kg/m^3; SRC-NIST-MASS: kilogram/kg; SRC-NIST-TIME: second/s; SRC-NIST-TEMPERATURE: kelvin/K, Celsius offset

**Depth justification:** These eight EXACT_FACT, single-dimension (DEFINITION-only) requirements are combined into one learning point because they are taught and assessed as one homogeneous recall skill in practice -- correctly stating 'the SI unit and symbol' for a named physical quantity from a shared reference table -- rather than as eight conceptually distinct masteries the way, for example, resistance-vs-resistivity is. Preserving the exponents (m^2, m^3) and the correct compound form for density (kg/m^3, not kg or m^3 alone) is retained explicitly as knowledge content, per this batch's depth guardrail. The K-vs-degC distinction is included because the guardrail explicitly requires establishing what is actually needed at this depth, not treating them as interchangeable symbols.

**Explicit exclusions:**
- Deriving or defining the SI base units themselves (e.g. the caesium-frequency definition of the second) -- only the correct unit name/symbol is mastery content here
- Converting between these units (see EQCT-LP-02)
- Non-SI units (litre, tonne, minute/hour/day) as mastery content, beyond recognising they exist as permitted alternatives

**Representative application types:**
- State the SI unit and symbol for volume.
- Identify which of a list of candidate units (e.g. kg, kg/m^3, m^3) is the correct SI unit for density.
- Explain why 20 degC and 20 K are not the same temperature.

> **Internal audit correction pass.** Corrected during the internal adversarial audit pass. Seven learning points (EQCT-LP-02, 05, 07, 12, 15, 16, 18) were moved from evidenceReadiness READY to HELD_PENDING_EVIDENCE_CORRECTION because the evidence beneath them was downgraded to PARTIALLY_VERIFIED; each carries an evidenceReadinessNote saying why. EQCT-LP-01's temperature-interval statement was factually wrong and has been corrected. EQCT-LP-15 asserted an ohmmeter mechanism that no retrieved passage supports; it has been removed. EQCT-LP-17 taught that a wattmeter derives power as voltage x current, which contradicted EQCT-LP-07's own power-factor teaching; corrected to average/real power, with the idealised-coil-impedance caveat now applied consistently with EQCT-LP-19. No learning point identity was added, removed or renumbered, and none is accepted or frozen.

---

### `EQCT-LP-02` -- Practical unit conversion, including squared and cubed quantities

**Evidence readiness:** HELD_PENDING_EVIDENCE_CORRECTION

**Evidence readiness note (internal audit pass):** Underlying practical-unit-conversion evidence downgraded to PARTIALLY_VERIFIED: the SI-prefix half of the requirement has no in-batch citation (it relies on the accepted Batch 01 FM-LP-19, already carried as a cross-domain prerequisite). The squared/cubed half remains fully evidenced.

**Learner outcome:** The learner will be able to convert a measured value between SI-prefixed multiples/sub-multiples of a unit, and correctly convert values in a squared (area) or cubed (volume) unit by applying the appropriate power of the linear conversion factor.

**Knowledge / procedure:** To convert a linear quantity (e.g. mm to m), multiply or divide by the appropriate power-of-ten prefix factor. When the quantity being converted is itself squared or cubed (area in m^2, volume in m^3), the LINEAR conversion factor must be raised to the same power before use -- squared for area, cubed for volume -- because e.g. cm^3 means cm x cm x cm, and each of the three linear factors must be converted individually (worked example: 18,900,000 cm^3 x (1 m/100 cm)^3 = 18.9 m^3). A linear (length) conversion factor must never be assumed to apply unmodified to an area or volume conversion of the same base unit.

**Within-domain prerequisites:** `EQCT-LP-01`

**Cross-domain prerequisites:** `FM-LP-04`, `FM-LP-14`, `FM-LP-19`

**Knowledge-target IDs:** `unit202::ACQ-025`

**Evidence-requirement IDs:**
- `ER::provisional::unit202::electrical-quantities-and-circuit-theory::practical-unit-conversion-needed-elsewhere-in-unit-202::PROCEDURE_COVERAGE`

**Normalized claim references:** SRC-NIST-SP811-CH4: derived units formed algebraically with exponents; SRC-LIBRETEXTS-SQCUBIC: squaring/cubing the conversion factor, worked example

**Depth justification:** Kept separate from EQCT-LP-01 (which only tests recognising a unit's correct name/symbol) because converting between units -- including correctly handling squared/cubed cases -- is a distinct, separately-diagnosable procedural skill, matching this batch's explicit instruction to distinguish 'basic SI unit recognition vs practical conversion'. Reuses Batch 01's FM-LP-19 (engineering notation/SI prefixes) for the prefix-scaling mechanism and FM-LP-14 (laws of indices) for the squared/cubed-factor reasoning, rather than re-deriving either.

**Explicit exclusions:**
- Deriving prefix factors from first principles (reuses FM-LP-19)
- Assuming a length conversion factor applies unmodified to area/volume -- explicitly taught as an error to avoid
- Conversion of quantities not genuinely used elsewhere in Unit 202

**Representative application types:**
- Convert a cable length given in mm to m.
- Convert a floor area given in cm^2 to m^2.
- Convert a tank volume given in cm^3 to m^3.

---

### `EQCT-LP-03` -- Current: meaning, quantity symbol and unit

**Evidence readiness:** READY

**Learner outcome:** The learner will be able to state what electric current is, its quantity symbol (I), and its SI unit name and symbol (ampere, A).

**Knowledge / procedure:** Electric current is the movement/flow of electric charge (carried by electrons in a conductor) past a point in a circuit. Its quantity symbol is I (lower-case i for an instantaneous/time-varying value) -- distinct from its SI unit symbol, the ampere, A.

**Within-domain prerequisites:** (none)

**Cross-domain prerequisites:** (none)

**Knowledge-target IDs:** `unit202::ACQ-026`

**Evidence-requirement IDs:**
- `ER::provisional::unit202::electrical-quantities-and-circuit-theory::current-meaning-quantity-symbol-unit-name-symbol::CONCEPT_DEFINITION::DEFINITION`
- `ER::provisional::unit202::electrical-quantities-and-circuit-theory::current-meaning-quantity-symbol-unit-name-symbol::SYMBOL_OR_CONVENTION::QUANTITY_SYMBOL`
- `ER::provisional::unit202::electrical-quantities-and-circuit-theory::current-meaning-quantity-symbol-unit-name-symbol::SYMBOL_OR_CONVENTION::UNIT_SYMBOL`

**Normalized claim references:** SRC-ETW-DC1: current definition and symbol I; SRC-EOLSS-ELECQUANT: symbol I/i confirming; SRC-BIPM-BROCHURE: ampere, unit symbol A

**Depth justification:** The definition, quantity symbol and unit symbol are combined into one learning point because they form a single inseparable teachable identity fact at this level -- a learner is not meaningfully diagnosed as knowing current's meaning independently of knowing it is called I and measured in amperes. This is purely vocabulary/identity mastery, distinct from EFS-LP-02 (Batch 02, accepted), which teaches the RELATIONSHIP I=Q/t as its own calculation outcome -- that relationship is not re-taught here.

**Explicit exclusions:**
- The charge/time relationship I=Q/t and its calculation (already accepted as EFS-LP-02; not duplicated here)
- How to measure current with an ammeter (see EQCT-LP-14)

**Representative application types:**
- State the quantity symbol and SI unit for electric current.
- Identify which of a list of symbols (I, A, i, Q) is current's quantity symbol versus its unit symbol.

---

### `EQCT-LP-04` -- Voltage: meaning, quantity symbol and unit

**Evidence readiness:** READY

**Learner outcome:** The learner will be able to state what voltage (potential difference) is, its quantity symbol, and its SI unit name and symbol (volt, V).

**Knowledge / procedure:** Voltage (potential difference) is the electric potential energy per unit charge between two points -- the ability to move charge and do work; a source may also call it electromotive force (EMF) in a particular context. This qualification uses V as voltage's working quantity symbol throughout (matching the accepted Batch 02 Ohm's-law and voltage-drop formulae, V=IR). Authoritative technical references genuinely differ here: U and E are also documented alternative conventions elsewhere (U in IEC/European practice; E specifically for electromotive force in some texts) -- learners are told this variation exists, not taught a second, conflicting formula system. Voltage's SI unit is the volt, unit symbol V (the same letter V is commonly used for both the quantity symbol and the unit symbol; context/formatting distinguishes them).

**Within-domain prerequisites:** (none)

**Cross-domain prerequisites:** (none)

**Knowledge-target IDs:** `unit202::ACQ-027`

**Evidence-requirement IDs:**
- `ER::provisional::unit202::electrical-quantities-and-circuit-theory::voltage-meaning-quantity-symbol-unit-name-symbol::CONCEPT_DEFINITION::DEFINITION`
- `ER::provisional::unit202::electrical-quantities-and-circuit-theory::voltage-meaning-quantity-symbol-unit-name-symbol::SYMBOL_OR_CONVENTION::QUANTITY_SYMBOL`
- `ER::provisional::unit202::electrical-quantities-and-circuit-theory::voltage-meaning-quantity-symbol-unit-name-symbol::SYMBOL_OR_CONVENTION::UNIT_SYMBOL`

**Normalized claim references:** SRC-HP-ELEVOL: voltage as potential energy per charge; SRC-EOLSS-ELECQUANT: voltage definition, symbol V or U; SRC-ETW-DC1: symbol V or E; SRC-BIPM-BROCHURE: volt, unit symbol V

**Depth justification:** Combined for the same reason as EQCT-LP-03 (current): definition, quantity symbol and unit symbol are one inseparable identity fact at this level. The genuine U-vs-V (and E) variation across authoritative sources is disclosed honestly rather than hidden, per this batch's explicit guardrail, while still committing to one working convention (V) consistent with this qualification's own existing formulae.

**Explicit exclusions:**
- Ohm's law and voltage-drop calculations (already accepted as EFS-LP-08/EFS-LP-09; not duplicated here)
- How to measure voltage with a voltmeter (see EQCT-LP-14)
- Teaching U and V as two parallel, simultaneously-used formula systems

**Representative application types:**
- State the quantity symbol and SI unit for voltage.
- Explain why encountering 'U' for voltage in a different textbook does not mean a different quantity is being described.

---

### `EQCT-LP-05` -- Power: meaning, quantity symbol, unit, and distinction from energy and power factor

**Evidence readiness:** HELD_PENDING_EVIDENCE_CORRECTION

**Evidence readiness note (internal audit pass):** Underlying power::DISTINCTION evidence downgraded to PARTIALLY_VERIFIED (fabricated SRC-ETW-POWERTRIANGLE quotation). The P=V.I condition has also been corrected to carry its steady-voltage/current qualification.

**Learner outcome:** The learner will be able to state what electrical power is, its quantity symbol (P) and SI unit (watt, W), and explain how power differs from both energy and power factor.

**Knowledge / procedure:** Electrical power is the rate at which electrical energy is transferred or work is done, P=V.I (equivalently I^2R or V^2/R); its quantity symbol is P and its SI unit is the watt, symbol W. Power is NOT energy: power is a rate (an instantaneous quantity), while energy is the cumulative amount transferred over a time interval (Energy = Power x Time) -- the kilowatt-hour is consequently a unit of energy, never of power, despite containing 'kilowatt' in its name. Power is also NOT power factor: power factor is a separate, dimensionless ratio describing how effectively power is delivered in an AC circuit; it never itself carries a watt value.

**Within-domain prerequisites:** `EQCT-LP-06`, `EQCT-LP-07`

**Cross-domain prerequisites:** (none)

**Knowledge-target IDs:** `unit202::ACQ-030`

**Evidence-requirement IDs:**
- `ER::provisional::unit202::electrical-quantities-and-circuit-theory::power-meaning-quantity-symbol-unit-name-symbol-distinction-from-energy-and-from-power-factor::CONCEPT_DEFINITION::DEFINITION`
- `ER::provisional::unit202::electrical-quantities-and-circuit-theory::power-meaning-quantity-symbol-unit-name-symbol-distinction-from-energy-and-from-power-factor::CONCEPT_DEFINITION::DISTINCTION`
- `ER::provisional::unit202::electrical-quantities-and-circuit-theory::power-meaning-quantity-symbol-unit-name-symbol-distinction-from-energy-and-from-power-factor::SYMBOL_OR_CONVENTION::QUANTITY_SYMBOL`
- `ER::provisional::unit202::electrical-quantities-and-circuit-theory::power-meaning-quantity-symbol-unit-name-symbol-distinction-from-energy-and-from-power-factor::SYMBOL_OR_CONVENTION::UNIT_SYMBOL`

**Normalized claim references:** SRC-ETW-DC3: P=V.I, watt W; SRC-EOLSS-ELECQUANT: P symbol, P=V.I=I^2R=V^2/R; SRC-ETW-ENERGY: power as rate vs energy as cumulative; SRC-ETW-POWERTRIANGLE: power vs power factor; SRC-BIPM-BROCHURE: watt unit symbol W

**Depth justification:** Definition, both distinctions, and both symbol facets are combined into one learning point because the frozen requirement itself frames power's meaning and its two distinctions as one coherent teachable concept, and separating 'what power is' from 'how it differs from energy/power factor' would fragment a single comparison the way Batch 03's MM-LP-01 combined mass/weight/distinction. This learning point is deliberately sequenced (via its own prerequisites) AFTER energy (EQCT-LP-06) and power factor (EQCT-LP-07), since its own distinction outcome requires the learner to already know both of those concepts -- an example of tracking instructional sequence separately from stable numeric identity.

**Explicit exclusions:**
- The three power-formula forms P=VI/I^2R/V^2R and choosing between them as a calculation skill (already accepted as EFS-LP-17; not duplicated here)
- AC power with reactive/apparent power as calculated quantities
- Energy (kWh) calculations from power and time

**Representative application types:**
- State the quantity symbol and unit for electrical power.
- Explain why a 100 W lamp left on for 10 hours is described in kWh, not in watts, when billed.
- Explain why a high power factor is not itself 'more power'.

---

### `EQCT-LP-06` -- Energy: meaning, quantity symbol, unit, and distinction from power

**Evidence readiness:** READY

**Learner outcome:** The learner will be able to state what electrical energy is, its quantity symbol (E) and unit (joule, J, or the practically-used kilowatt-hour, kWh), and explain how energy differs from power.

**Knowledge / procedure:** Electrical energy is the accumulated/transferred capacity of electricity to do work; energy = power x time. Its quantity symbol is E -- deliberately distinct from W, the UNIT symbol for power (the watt); this qualification does not use W as energy's quantity symbol, to avoid conflating it with the watt. Energy's SI unit is the joule (J); in practice, energy consumption is more often expressed in kilowatt-hours (kWh), where 1 kWh = 3.6 megajoules. Energy is NOT power: energy is the cumulative, accumulated quantity (what an energy meter registers over time); power is the instantaneous rate. The kilowatt-hour is a unit of ENERGY, never of power, despite containing the word 'kilowatt'.

**Within-domain prerequisites:** (none)

**Cross-domain prerequisites:** (none)

**Knowledge-target IDs:** `unit202::ACQ-031`

**Evidence-requirement IDs:**
- `ER::provisional::unit202::electrical-quantities-and-circuit-theory::energy-meaning-quantity-symbol-unit-name-symbol-distinction-from-power::CONCEPT_DEFINITION::DEFINITION`
- `ER::provisional::unit202::electrical-quantities-and-circuit-theory::energy-meaning-quantity-symbol-unit-name-symbol-distinction-from-power::CONCEPT_DEFINITION::DISTINCTION`
- `ER::provisional::unit202::electrical-quantities-and-circuit-theory::energy-meaning-quantity-symbol-unit-name-symbol-distinction-from-power::SYMBOL_OR_CONVENTION::QUANTITY_SYMBOL`
- `ER::provisional::unit202::electrical-quantities-and-circuit-theory::energy-meaning-quantity-symbol-unit-name-symbol-distinction-from-power::SYMBOL_OR_CONVENTION::UNIT_SYMBOL`

**Normalized claim references:** SRC-ETW-ENERGY: energy definition, joule, kWh=3.6MJ, distinction from power; SRC-EOLSS-ELECQUANT: energy symbol E, p(t)=dE/dt

**Depth justification:** Definition, distinction, and both symbol facets combined into one learning point for the same reason as power (a single coherent comparison). Deliberately taught with no formal prerequisite on the power learning point (EQCT-LP-05), so the two can be sequenced either way without circularity; EQCT-LP-05 in turn depends on this one, since 'distinguishing power from energy' is a strictly harder synthesis than defining energy alone.

**Explicit exclusions:**
- Calculating energy consumption in kWh from a given power and time (a distinct calculation procedure, not required by this batch's frozen evidence requirement)
- Electricity billing/tariff calculations

**Representative application types:**
- State the quantity symbol and practical unit for electrical energy.
- Explain why 'kilowatt-hour' names a quantity of energy, not a power rating.

---

### `EQCT-LP-07` -- Power factor: meaning, notation, dimensionless nature, and distinction from power

**Evidence readiness:** HELD_PENDING_EVIDENCE_CORRECTION

**Evidence readiness note (internal audit pass):** Underlying power-factor::DISTINCTION evidence downgraded to PARTIALLY_VERIFIED. The dimensionlessness guardrail this learning point teaches currently rests on a disclosed inference from P/S = W/VA, not on an explicit authoritative statement.

**Learner outcome:** The learner will be able to state what power factor is, its conventional notation (cos phi / p.f.), that it is dimensionless with no unit, and explain how it differs from power.

**Knowledge / procedure:** Power factor is the ratio of real (true) power to apparent power in an AC circuit; for a sinusoidal supply where voltage and current differ only in phase angle, this ratio equals cos(phi). Power factor is dimensionless and has NO unit symbol at all -- it is expressed as a plain ratio/decimal (e.g. 0.95) or a percentage; there is no unit such as 'unity' attached to it. Power factor is not power: power (P) is a real, wattage quantity, while power factor is a dimensionless ratio (between 0 and 1, or a percentage) describing how much of the apparent power is actually real/useful power.

**Within-domain prerequisites:** (none)

**Cross-domain prerequisites:** (none)

**Knowledge-target IDs:** `unit202::ACQ-036`

**Evidence-requirement IDs:**
- `ER::provisional::unit202::electrical-quantities-and-circuit-theory::power-factor-meaning-quantity-symbol-unit-name-symbol-dimensionless-distinction-from-power::CONCEPT_DEFINITION::DEFINITION`
- `ER::provisional::unit202::electrical-quantities-and-circuit-theory::power-factor-meaning-quantity-symbol-unit-name-symbol-dimensionless-distinction-from-power::CONCEPT_DEFINITION::DISTINCTION`
- `ER::provisional::unit202::electrical-quantities-and-circuit-theory::power-factor-meaning-quantity-symbol-unit-name-symbol-dimensionless-distinction-from-power::SYMBOL_OR_CONVENTION::QUANTITY_SYMBOL`
- `ER::provisional::unit202::electrical-quantities-and-circuit-theory::power-factor-meaning-quantity-symbol-unit-name-symbol-dimensionless-distinction-from-power::SYMBOL_OR_CONVENTION::UNIT_SYMBOL`

**Normalized claim references:** SRC-ETW-POWERTRIANGLE: cos(phi)=P/S=power factor, dimensionless, distinct from power

**Depth justification:** Definition, distinction, and both symbol facets combined into one learning point (the same single-comparison rationale as power and energy above). Scoped explicitly and narrowly to the sinusoidal displacement-power-factor case (cos phi) that the evidence source actually demonstrates -- distortion/harmonic power-factor components are not addressed by the evidence and are excluded as mastery content, per the guardrail against over-generalising cos phi to all waveforms.

**Explicit exclusions:**
- Power factor under non-sinusoidal/distorted waveforms (distortion power factor) -- out of scope at this depth and unsupported by the evidence
- Power-factor correction methods/equipment
- Treating 'unity' as if it were a unit label for power factor

**Representative application types:**
- State whether power factor has a unit.
- Explain why a power factor of 0.8 does not mean '0.8 watts'.

---

### `EQCT-LP-08` -- Frequency: meaning, quantity symbol and unit

**Evidence readiness:** HELD_PENDING_EVIDENCE_CORRECTION

**Evidence readiness note (Stage 2.2 correction):** Moved from READY: this learning point's QUANTITY_SYMBOL evidence requirement was downgraded to PARTIALLY_VERIFIED after electronics-tutorials.ws (its sole support) was reclassified AUTHORITATIVE_EDUCATIONAL_REFERENCE, which this SYMBOL_OR_CONVENTION-mode requirement does not permit. The concept/definition content is unaffected; only the quantity-symbol-letter (f) sourcing is outstanding.

**Learner outcome:** The learner will be able to state what frequency is, its quantity symbol (f), and its SI unit name and symbol (hertz, Hz).

**Knowledge / procedure:** Frequency is the number of complete cycles of a periodic (e.g. AC) waveform occurring per second. Its quantity symbol is f; its SI unit is the hertz, symbol Hz.

**Within-domain prerequisites:** (none)

**Cross-domain prerequisites:** (none)

**Knowledge-target IDs:** `unit202::ACQ-032`

**Evidence-requirement IDs:**
- `ER::provisional::unit202::electrical-quantities-and-circuit-theory::frequency-meaning-quantity-symbol-unit-name-symbol::CONCEPT_DEFINITION::DEFINITION`
- `ER::provisional::unit202::electrical-quantities-and-circuit-theory::frequency-meaning-quantity-symbol-unit-name-symbol::SYMBOL_OR_CONVENTION::QUANTITY_SYMBOL`
- `ER::provisional::unit202::electrical-quantities-and-circuit-theory::frequency-meaning-quantity-symbol-unit-name-symbol::SYMBOL_OR_CONVENTION::UNIT_SYMBOL`

**Normalized claim references:** SRC-ETW-ACWAVEFORM: frequency, symbol f, Hz; SRC-BIPM-BROCHURE: hertz, unit symbol Hz

**Depth justification:** Definition and both symbol facets combined as one inseparable identity fact, consistent with the other single-quantity identity learning points in this batch (current, voltage). Positioned early in the AC-quantities instructional sequence since capacitive/inductive reactance both depend conceptually on frequency.

**Explicit exclusions:**
- The period-frequency reciprocal relationship (f=1/T) as a calculation outcome
- Harmonics or non-sinusoidal frequency content

**Representative application types:**
- State the quantity symbol and SI unit for frequency.
- State the UK mains supply frequency and its unit.

---

### `EQCT-LP-09` -- Capacitance: meaning, quantity symbol and unit

**Evidence readiness:** HELD_PENDING_EVIDENCE_CORRECTION

**Evidence readiness note (Stage 2.2 correction):** Moved from READY: this learning point's QUANTITY_SYMBOL evidence requirement was downgraded to PARTIALLY_VERIFIED after electronics-tutorials.ws (its sole support) was reclassified AUTHORITATIVE_EDUCATIONAL_REFERENCE, which this SYMBOL_OR_CONVENTION-mode requirement does not permit. The concept/definition content is unaffected; only the quantity-symbol-letter (C) sourcing is outstanding.

**Learner outcome:** The learner will be able to state what capacitance is, its quantity symbol (C), and its SI unit name and symbol (farad, F).

**Knowledge / procedure:** Capacitance is a capacitor's physical ability to store electrical charge on its plates for a given applied voltage. At this level, capacitance is treated as a basic property of the component (set by its construction), in contrast with capacitive reactance, which is explicitly frequency-dependent; this is the ideal/basic-component model appropriate here, not a claim that a real capacitor's capacitance can never be affected by anything (e.g. temperature or applied voltage in a real device) -- that further nuance is out of scope for this qualification. Its quantity symbol is C; its SI unit is the farad, symbol F.

**Within-domain prerequisites:** (none)

**Cross-domain prerequisites:** (none)

**Knowledge-target IDs:** `unit202::ACQ-034`

**Evidence-requirement IDs:**
- `ER::provisional::unit202::electrical-quantities-and-circuit-theory::capacitance-and-capacitive-reactance-meaning-quantity-symbol-unit-name-symbol-distinction-between-the-two::CONCEPT_DEFINITION::DEFINITION`
- `ER::provisional::unit202::electrical-quantities-and-circuit-theory::capacitance-and-capacitive-reactance-meaning-quantity-symbol-unit-name-symbol-distinction-between-the-two::SYMBOL_OR_CONVENTION::QUANTITY_SYMBOL`
- `ER::provisional::unit202::electrical-quantities-and-circuit-theory::capacitance-and-capacitive-reactance-meaning-quantity-symbol-unit-name-symbol-distinction-between-the-two::SYMBOL_OR_CONVENTION::UNIT_SYMBOL`

**Normalized claim references:** SRC-ETW-CAP1: capacitance definition, symbol C, farad F; SRC-BIPM-BROCHURE: farad, unit symbol F

**Depth justification:** Deliberately split from capacitive reactance (EQCT-LP-10) even though the frozen evidence requirement bundles both quantities together in its text, because capacitance and capacitive reactance are independently-diagnosable concepts -- a learner can know what capacitance is (a fixed material/component property, farads) without yet knowing what capacitive reactance is (a frequency-dependent AC opposition, ohms), and vice versa; collapsing them into one point would hide that distinction as a single vocabulary item rather than teaching it as a genuine comparison. The QUANTITY_SYMBOL and UNIT_SYMBOL evidence requirements are shared with EQCT-LP-10 because the single frozen evidence requirement's own passage genuinely establishes both quantities' symbols together (see SOURCE-REGISTER.json); this is disclosed here and at EQCT-LP-10.

**Explicit exclusions:**
- Capacitive reactance itself (see EQCT-LP-10)
- Capacitor charge/voltage calculation (Q=CV) as a calculation outcome
- Capacitor types/construction

**Representative application types:**
- State the quantity symbol and SI unit for capacitance.
- Explain why doubling a capacitor's stored charge for the same voltage means its capacitance has doubled, not its capacitive reactance.

---

### `EQCT-LP-10` -- Capacitive reactance: meaning, unit, and distinction from capacitance

**Evidence readiness:** READY

**Learner outcome:** The learner will be able to state what capacitive reactance is, its unit (ohms), and explain how it differs from capacitance itself.

**Knowledge / procedure:** Capacitive reactance (symbol Xc) is the frequency-dependent opposition a capacitor presents to alternating current, given conceptually by Xc=1/(2.pi.f.C) -- it FALLS as frequency rises. Unlike capacitance (a fixed component property, farads), capacitive reactance is measured in ohms (the same unit symbol as resistance) and varies with both frequency and capacitance. Capacitance and capacitive reactance are related but are not the same quantity, and do not share a unit (farad vs ohms).

**Within-domain prerequisites:** `EQCT-LP-09`, `EQCT-LP-08`

**Cross-domain prerequisites:** (none)

**Knowledge-target IDs:** `unit202::ACQ-034`

**Evidence-requirement IDs:**
- `ER::provisional::unit202::electrical-quantities-and-circuit-theory::capacitance-and-capacitive-reactance-meaning-quantity-symbol-unit-name-symbol-distinction-between-the-two::CONCEPT_DEFINITION::DISTINCTION`
- `ER::provisional::unit202::electrical-quantities-and-circuit-theory::capacitance-and-capacitive-reactance-meaning-quantity-symbol-unit-name-symbol-distinction-between-the-two::SYMBOL_OR_CONVENTION::QUANTITY_SYMBOL`
- `ER::provisional::unit202::electrical-quantities-and-circuit-theory::capacitance-and-capacitive-reactance-meaning-quantity-symbol-unit-name-symbol-distinction-between-the-two::SYMBOL_OR_CONVENTION::UNIT_SYMBOL`

**Normalized claim references:** SRC-ETW-FILTER1: Xc=1/(2 pi f C), ohms, inverse frequency dependence, distinct from fixed capacitance

**Depth justification:** Split from capacitance (EQCT-LP-09) per the guardrail explicitly asking whether capacitance vs capacitive reactance need distinct mastery points -- they do, since a learner can apply Xc's frequency-dependent behaviour conceptually without yet fully grasping capacitance itself, and vice versa. Depends on both EQCT-LP-09 (capacitance, since Xc is defined in terms of C) and EQCT-LP-08 (frequency, since Xc's defining behaviour is its frequency dependence). Deliberately excludes teaching the full Xc formula as a REQUIRED calculation outcome beyond conceptual frequency/capacitance dependence, per this batch's explicit depth guardrail.

**Explicit exclusions:**
- Calculating a numeric Xc value from the formula as a required mastery outcome (only the conceptual frequency/capacitance dependence is required)
- Capacitance itself (see EQCT-LP-09)
- RC circuit time-constant/filter-cutoff calculations

**Representative application types:**
- Explain why a capacitor presents less opposition to a higher-frequency AC signal.
- State the unit in which capacitive reactance is measured.
- Explain why capacitive reactance and capacitance are not simply two names for the same thing.

---

### `EQCT-LP-11` -- Inductance: meaning, quantity symbol and unit

**Evidence readiness:** HELD_PENDING_EVIDENCE_CORRECTION

**Evidence readiness note (Stage 2.2 correction):** Moved from READY: this learning point's QUANTITY_SYMBOL evidence requirement was downgraded to PARTIALLY_VERIFIED after electronics-tutorials.ws (its sole support) was reclassified AUTHORITATIVE_EDUCATIONAL_REFERENCE, which this SYMBOL_OR_CONVENTION-mode requirement does not permit. The concept/definition content is unaffected; only the quantity-symbol-letter (L) sourcing is outstanding.

**Learner outcome:** The learner will be able to state what inductance is, its quantity symbol (L), and its SI unit name and symbol (henry, H).

**Knowledge / procedure:** Inductance is a coil's physical ability to oppose changes in current. At this level, inductance is treated as a basic property of the component (set by its construction, e.g. turns and core), in contrast with inductive reactance, which is explicitly frequency-dependent; this is the ideal/basic-component model appropriate here, not a claim that a real coil's inductance can never be affected by anything (e.g. core saturation in a real device) -- that further nuance is out of scope for this qualification. Its quantity symbol is L; its SI unit is the henry, symbol H.

**Within-domain prerequisites:** (none)

**Cross-domain prerequisites:** (none)

**Knowledge-target IDs:** `unit202::ACQ-035`

**Evidence-requirement IDs:**
- `ER::provisional::unit202::electrical-quantities-and-circuit-theory::inductance-and-inductive-reactance-meaning-quantity-symbol-unit-name-symbol-distinction-between-the-two::CONCEPT_DEFINITION::DEFINITION`
- `ER::provisional::unit202::electrical-quantities-and-circuit-theory::inductance-and-inductive-reactance-meaning-quantity-symbol-unit-name-symbol-distinction-between-the-two::SYMBOL_OR_CONVENTION::QUANTITY_SYMBOL`
- `ER::provisional::unit202::electrical-quantities-and-circuit-theory::inductance-and-inductive-reactance-meaning-quantity-symbol-unit-name-symbol-distinction-between-the-two::SYMBOL_OR_CONVENTION::UNIT_SYMBOL`

**Normalized claim references:** SRC-ETW-INDUCTOR: inductance definition, symbol L, henry H; SRC-BIPM-BROCHURE: henry, unit symbol H

**Depth justification:** Split from inductive reactance (EQCT-LP-12) for the same reason capacitance is split from capacitive reactance -- independently-diagnosable concepts. Shared QUANTITY_SYMBOL/UNIT_SYMBOL evidence with EQCT-LP-12, disclosed, since the single frozen evidence requirement's passage establishes both quantities' symbols together.

**Explicit exclusions:**
- Inductive reactance itself (see EQCT-LP-12)
- EMF-of-self-induction calculations (V=L di/dt) as a calculation outcome
- Inductor construction/core materials

**Representative application types:**
- State the quantity symbol and SI unit for inductance.

---

### `EQCT-LP-12` -- Inductive reactance: meaning, unit, and distinction from inductance

**Evidence readiness:** HELD_PENDING_EVIDENCE_CORRECTION

**Evidence readiness note (internal audit pass):** Underlying inductance::DISTINCTION evidence downgraded to PARTIALLY_VERIFIED (fabricated SRC-ETW-ACINDUCTORS quotation). The specific proposition this learning point teaches -- that inductance is frequency-independent while reactance is not -- is currently UNEVIDENCED in this batch.

**Learner outcome:** The learner will be able to state what inductive reactance is, its unit (ohms), and explain how it differs from inductance itself.

**Knowledge / procedure:** Inductive reactance (symbol XL) is the frequency-dependent opposition an inductor presents to alternating current, given conceptually by XL=2.pi.f.L -- it RISES as frequency rises (the opposite frequency behaviour to capacitive reactance). Unlike inductance (a fixed coil property, henries), inductive reactance is measured in ohms (the same unit symbol as resistance and capacitive reactance) and varies with both frequency and inductance. Inductance and inductive reactance are related but are not the same quantity, and do not share a unit (henry vs ohms).

**Within-domain prerequisites:** `EQCT-LP-11`, `EQCT-LP-08`

**Cross-domain prerequisites:** (none)

**Knowledge-target IDs:** `unit202::ACQ-035`

**Evidence-requirement IDs:**
- `ER::provisional::unit202::electrical-quantities-and-circuit-theory::inductance-and-inductive-reactance-meaning-quantity-symbol-unit-name-symbol-distinction-between-the-two::CONCEPT_DEFINITION::DISTINCTION`
- `ER::provisional::unit202::electrical-quantities-and-circuit-theory::inductance-and-inductive-reactance-meaning-quantity-symbol-unit-name-symbol-distinction-between-the-two::SYMBOL_OR_CONVENTION::QUANTITY_SYMBOL`
- `ER::provisional::unit202::electrical-quantities-and-circuit-theory::inductance-and-inductive-reactance-meaning-quantity-symbol-unit-name-symbol-distinction-between-the-two::SYMBOL_OR_CONVENTION::UNIT_SYMBOL`

**Normalized claim references:** SRC-ETW-ACINDUCTORS: XL=2 pi f L, ohms, inductance constant vs reactance frequency-dependent

**Depth justification:** Split from inductance (EQCT-LP-11) for the same reason capacitive reactance is split from capacitance. Depends on EQCT-LP-11 (inductance) and EQCT-LP-08 (frequency). Deliberately excludes the full XL formula as a required calculation outcome beyond conceptual frequency/inductance dependence, per this batch's depth guardrail.

**Explicit exclusions:**
- Calculating a numeric XL value from the formula as a required mastery outcome
- Inductance itself (see EQCT-LP-11)
- RL circuit time-constant calculations

**Representative application types:**
- Explain why an inductor presents more opposition to a higher-frequency AC signal (the opposite behaviour to a capacitor).
- State the unit in which inductive reactance is measured.

---

### `EQCT-LP-13` -- Impedance: meaning, quantity symbol, unit, and distinction from resistance and reactance

**Evidence readiness:** READY

**Learner outcome:** The learner will be able to state what impedance is, its quantity symbol (Z) and unit (ohms), and explain why it is not simply the arithmetic sum of resistance and reactance.

**Knowledge / procedure:** Impedance is the total opposition an AC circuit presents to current flow, combining resistance and reactance; its quantity symbol is Z and its unit is the ohm (the same unit symbol as resistance and reactance), even though impedance, resistance and reactance are not the same quantity. Impedance is frequency-dependent (because reactance is), unlike plain resistance. Impedance is NOT the simple arithmetic sum of resistance and reactance (R+X does not equal Z): resistance and reactance combine as a vector/complex quantity, because their effects are 90 degrees out of phase with each other, so impedance's magnitude must be found by combining them geometrically (as a vector sum), not by adding their ohm values directly. This qualification teaches this distinction conceptually only; it does not require performing the complex-number/phasor calculation itself.

**Within-domain prerequisites:** `EQCT-LP-10`, `EQCT-LP-12`

**Cross-domain prerequisites:** `EFS-LP-05`

**Knowledge-target IDs:** `unit202::ACQ-033`

**Evidence-requirement IDs:**
- `ER::provisional::unit202::electrical-quantities-and-circuit-theory::impedance-meaning-quantity-symbol-unit-name-symbol-distinction-from-resistance-and-reactance::CONCEPT_DEFINITION::DEFINITION`
- `ER::provisional::unit202::electrical-quantities-and-circuit-theory::impedance-meaning-quantity-symbol-unit-name-symbol-distinction-from-resistance-and-reactance::CONCEPT_DEFINITION::DISTINCTION`
- `ER::provisional::unit202::electrical-quantities-and-circuit-theory::impedance-meaning-quantity-symbol-unit-name-symbol-distinction-from-resistance-and-reactance::SYMBOL_OR_CONVENTION::QUANTITY_SYMBOL`
- `ER::provisional::unit202::electrical-quantities-and-circuit-theory::impedance-meaning-quantity-symbol-unit-name-symbol-distinction-from-resistance-and-reactance::SYMBOL_OR_CONVENTION::UNIT_SYMBOL`

**Normalized claim references:** SRC-ETW-IMPEDANCE: Z, ohms, 'R+X does not equal Z', vector sum; SRC-EOLSS-ELECQUANT: complex impedance R+jX, vector diagram

**Depth justification:** Sequenced (via its own prerequisites) after capacitive reactance (EQCT-LP-10) and inductive reactance (EQCT-LP-12), since impedance's own distinction outcome explicitly presupposes both reactance concepts; also carries a genuine cross-domain prerequisite on the accepted Batch 02 EFS-LP-05 (Resistance), since the distinction explicitly requires already knowing what resistance is. Definition, distinction and both symbol facets are combined into one learning point as a single coherent comparison, consistent with this batch's other combined-comparison points. Deliberately excludes teaching R+jX complex-number arithmetic or phasor calculation as a mastery/calculation outcome, since no frozen requirement demands it beyond DEFINITION/DISTINCTION/QUANTITY_SYMBOL/UNIT_SYMBOL.

**Explicit exclusions:**
- Complex-number or phasor calculation of impedance magnitude/phase angle
- Series/parallel AC impedance-combination calculations
- Presenting impedance magnitude as a simple arithmetic sum of resistance and reactance -- explicitly taught as an error to avoid

**Representative application types:**
- State the quantity symbol and unit for impedance.
- Explain why a circuit with 3 ohms resistance and 4 ohms reactance does not have 7 ohms of impedance.

---

### `EQCT-LP-14` -- Ammeter and voltmeter: function and correct connection

**Evidence readiness:** READY

**Learner outcome:** The learner will be able to state that an ammeter measures current and must be connected in series, and that a voltmeter measures potential difference and must be connected in parallel.

**Knowledge / procedure:** An ammeter measures electric current and must be connected in SERIES with the component/circuit whose current is being measured (so the same current that flows through the component also flows through the meter). A voltmeter measures potential difference (voltage) and must be connected in PARALLEL with the component/circuit whose voltage is being measured (so the meter experiences the same potential difference as the component).

**Within-domain prerequisites:** `EQCT-LP-03`, `EQCT-LP-04`

**Cross-domain prerequisites:** (none)

**Knowledge-target IDs:** `unit202::ACQ-037`, `unit202::ACQ-038`

**Evidence-requirement IDs:**
- `ER::provisional::unit202::electrical-quantities-and-circuit-theory::ammeter-measures-current-series-connection::EXACT_FACT`
- `ER::provisional::unit202::electrical-quantities-and-circuit-theory::voltmeter-measures-potential-difference-parallel-connection::EXACT_FACT`

**Normalized claim references:** SRC-OPENSTAX-METERS: ammeter series, voltmeter parallel

**Depth justification:** Combined into one learning point because ammeter and voltmeter connection rules are taught and diagnosed as a natural contrasting pair (series vs parallel) in exactly the way Batch 03 combined mass/weight -- the contrast IS the teachable content. Genuinely depends on already knowing what current and voltage ARE (EQCT-LP-03, EQCT-LP-04) before learning how to measure them, matching this batch's explicit guardrail distinguishing 'current/voltage quantity knowledge vs measuring them correctly'.

**Explicit exclusions:**
- Ammeter/voltmeter internal resistance (see EQCT-LP-19)
- Multimeter mode-selection procedure or specific model operation
- Clamp-meter (non-invasive) current measurement

**Representative application types:**
- Given a circuit diagram, show the correct placement of an ammeter to measure the current through a named resistor.
- Given a circuit diagram, show the correct placement of a voltmeter to measure the potential difference across a named resistor.

---

### `EQCT-LP-15` -- Ohmmeter: measures resistance

**Evidence readiness:** HELD_PENDING_EVIDENCE_CORRECTION

**Evidence readiness note (internal audit pass):** Underlying ohmmeter-measures-resistance evidence downgraded to PARTIALLY_VERIFIED (no verbatim passage was ever captured). This learning point also asserted a mechanism -- that an ohmmeter applies its own small internal test current/voltage -- that appears in no retrieved passage in this batch; that mechanism has been removed.

**Learner outcome:** The learner will be able to state that an ohmmeter (or a multimeter's resistance/ohms function) measures the resistance of a component or circuit.

**Knowledge / procedure:** An ohmmeter (or a multimeter set to its resistance/ohms function) measures the resistance of a component or circuit.

**Within-domain prerequisites:** (none)

**Cross-domain prerequisites:** `EFS-LP-05`

**Knowledge-target IDs:** `unit202::ACQ-039`

**Evidence-requirement IDs:**
- `ER::provisional::unit202::electrical-quantities-and-circuit-theory::ohmmeter-measures-resistance::EXACT_FACT`

**Normalized claim references:** SRC-FLUKE-RESISTANCE: ohmmeter/multimeter resistance function

**Depth justification:** Deliberately kept separate from the ohmmeter's safe-use principle (EQCT-LP-16), per this batch's explicit guardrail distinguishing 'identifying an instrument's function vs using it safely' -- a learner may correctly identify what an ohmmeter measures without yet knowing the circuit must be de-energised first, and vice versa. Carries a genuine cross-domain prerequisite on the accepted Batch 02 EFS-LP-05 (Resistance), since identifying what an ohmmeter measures presupposes already knowing what resistance is.

**Explicit exclusions:**
- The de-energised safe-use principle (see EQCT-LP-16)
- Continuity-testing mode as a distinct function
- Multi-range/auto-ranging meter operation

**Representative application types:**
- State what physical quantity an ohmmeter measures.

---

### `EQCT-LP-16` -- Ohmmeter safe use: the circuit must be de-energised

**Evidence readiness:** HELD_PENDING_EVIDENCE_CORRECTION

**Evidence readiness note (internal audit pass):** Underlying ohmmeter safe-use evidence downgraded to PARTIALLY_VERIFIED because its CALCULATION_METHOD dimension is unresolved. NOTE: the safety CONTENT of this learning point (de-energisation AND discharging stored capacitor charge) is fully and genuinely evidenced and is unaffected.

**Learner outcome:** The learner will be able to state that a circuit or component must be de-energised (and any capacitor discharged) before measuring its resistance with an ohmmeter, and explain why.

**Knowledge / procedure:** Resistance/ohmmeter measurements must only be made on a de-energised circuit or component: power to the circuit must be switched off first, and any charged capacitor must be discharged before measuring. This matters because an ohmmeter applies its own small internal test current/voltage to make the measurement -- stored energy (e.g. a charged capacitor) or an externally-applied voltage from an energised circuit will produce an incorrect reading, can damage the meter, and presents a safety hazard to the user.

**Within-domain prerequisites:** `EQCT-LP-15`

**Cross-domain prerequisites:** (none)

**Knowledge-target IDs:** `unit202::ACQ-040`

**Evidence-requirement IDs:**
- `ER::provisional::unit202::electrical-quantities-and-circuit-theory::ohmmeter-circuit-de-energised-safe-use-principle::PROCEDURE_COVERAGE`

**Normalized claim references:** SRC-FLUKE-RESISTANCE: turn off power, discharge capacitor before resistance reading

**Depth justification:** Kept separate from EQCT-LP-15 as its own procedural/safety mastery point (see EQCT-LP-15's justification). Explicitly includes the stored-energy (charged capacitor) case named in the evidence and required by this batch's depth guardrail, since a de-energised MAIN supply alone does not address charge already stored in a component.

**Explicit exclusions:**
- General electrical safe-isolation procedure (lock-off/proving-dead sequences) beyond the specific ohmmeter case evidenced here
- Live fault-finding techniques

**Representative application types:**
- Explain why a technician must switch off the supply (and discharge any capacitor) before checking a component's resistance with an ohmmeter.
- Identify the safety/accuracy risk of measuring resistance on an energised circuit.

---

### `EQCT-LP-17` -- Wattmeter: measures power via combined current and voltage sensing

**Evidence readiness:** READY

**Learner outcome:** The learner will be able to state that a wattmeter measures electrical power, using a low-impedance current-sensing element in series with the load together with a high-impedance voltage-sensing element in parallel with the load.

**Knowledge / procedure:** A wattmeter measures electrical power by combining two sensing elements: a low-impedance current coil connected in SERIES with the load (like an ammeter) and a high-impedance voltage coil connected in PARALLEL with the load (like a voltmeter). This combined series-current-sensing plus parallel-voltage-sensing arrangement is what allows the instrument to derive power (the average (real) power of the load) directly, rather than requiring current and voltage to be measured and multiplied separately. A wattmeter reads AVERAGE (real) power. For an AC load whose power factor is below unity, real power is NOT simply voltage multiplied by current (see EQCT-LP-07) -- sensing both quantities together is what lets the instrument register real power. The 'very low' and 'very high' coil impedances are design goals, described by the source as 'ideally zero' and 'ideally infinite'; as with EQCT-LP-19, those limiting values are an idealised model, not literal claims about a real instrument.

**Within-domain prerequisites:** `EQCT-LP-05`, `EQCT-LP-14`

**Cross-domain prerequisites:** (none)

**Knowledge-target IDs:** `unit202::ACQ-041`

**Evidence-requirement IDs:**
- `ER::provisional::unit202::electrical-quantities-and-circuit-theory::wattmeter-measures-electrical-power-appropriate-current-voltage-sensing-arrangement-at-qualification-depth::EXACT_FACT`

**Normalized claim references:** SRC-PHILADELPHIA-WATTMETER: current coil series, voltage coil parallel, single-phase wattmeter

**Depth justification:** Depends on already knowing what power is (EQCT-LP-05) and how ammeters/voltmeters connect (EQCT-LP-14), since a wattmeter's principle is explained as 'an ammeter-like sensing element plus a voltmeter-like sensing element combined'. Bound to single-phase wattmeter operation only, per this batch's explicit depth guardrail.

**Explicit exclusions:**
- Three-phase wattmeter methods (e.g. the two-wattmeter method)
- Instrument transformers (CTs/VTs) used with wattmeters at higher power levels
- Electrodynamometer construction detail or calibration engineering

**Representative application types:**
- State what a wattmeter measures and describe its two sensing connections.
- Explain why a wattmeter's current coil is built with very low impedance.

---

### `EQCT-LP-18` -- Energy meter: measures and integrates electrical energy over time

**Evidence readiness:** HELD_PENDING_EVIDENCE_CORRECTION

**Evidence readiness note (internal audit pass):** Underlying energy-meter evidence downgraded to PARTIALLY_VERIFIED: the "integrates" half of the requirement is unevidenced by the quoted NISTIR 8248 sentence.

**Learner outcome:** The learner will be able to state that an energy meter (watt-hour/kWh meter) measures accumulated electrical energy usage over time, as distinct from an instantaneous power reading.

**Knowledge / procedure:** An energy meter (watt-hour/kWh meter) measures accumulated electrical energy usage over time -- it integrates (accumulates) the power delivered over the period of use to register a total energy quantity, rather than reading out an instantaneous power value the way a wattmeter does.

**Within-domain prerequisites:** `EQCT-LP-06`

**Cross-domain prerequisites:** (none)

**Knowledge-target IDs:** `unit202::ACQ-042`

**Evidence-requirement IDs:**
- `ER::provisional::unit202::electrical-quantities-and-circuit-theory::energy-meter-measures-integrates-electrical-energy::EXACT_FACT`

**Normalized claim references:** SRC-NISTIR-8248: 'electrical energy usage is measured with watt-hour meters'

**Depth justification:** Depends on already knowing what energy is and how it differs from power (EQCT-LP-06), since an energy meter's function is explained precisely as measuring the accumulated (energy) quantity rather than the instantaneous (power) one.

**Explicit exclusions:**
- Electromechanical vs solid-state/smart-meter internal construction detail
- Meter accuracy/calibration classes
- Billing/tariff calculation from a meter reading

**Representative application types:**
- State what physical quantity a domestic electricity (kWh) meter measures.
- Explain why an energy meter's reading keeps increasing even though the instantaneous power drawn varies.

---

### `EQCT-LP-19` -- Practical meter internal resistance: low for ammeters, high for voltmeters

**Evidence readiness:** READY

**Learner outcome:** The learner will be able to explain that a practical ammeter is built with very low internal resistance and a practical voltmeter with very high internal resistance, so as to disturb the circuit being measured as little as possible.

**Knowledge / procedure:** A practical ammeter is built to have a very low internal resistance -- small compared with the resistances of the circuit it is inserted into in series -- so that inserting it disturbs the current being measured as little as possible. A practical voltmeter is built to have a very high internal resistance -- large compared with the circuit it is connected across in parallel -- so that it draws negligible current and does not appreciably load the circuit. 'Zero' and 'infinite' resistance describe only the idealised limiting model used in simplified circuit reasoning; they are not literal claims about any real meter, which always has some small-but-nonzero (ammeter) or large-but-finite (voltmeter) internal resistance.

**Within-domain prerequisites:** `EQCT-LP-14`

**Cross-domain prerequisites:** (none)

**Knowledge-target IDs:** `unit202::ACQ-043`

**Evidence-requirement IDs:**
- `ER::provisional::unit202::electrical-quantities-and-circuit-theory::low-high-meter-internal-resistance::EXACT_FACT`

**Normalized claim references:** SRC-OPENSTAX-METERS: ammeter resistance 'very small', voltmeter resistance 'a few orders of magnitude greater'

**Depth justification:** Depends on already knowing how ammeters/voltmeters connect (EQCT-LP-14), since internal-resistance behaviour is explained in terms of how much each meter disturbs its series/parallel connection. Marked OPTIONAL_CONTEXT priority in the frozen plan; included as a genuine (not merely idealised) explanation, using the evidence's own honest 'very small'/'a few orders of magnitude greater' language rather than teaching real meters as literally zero/infinite resistance.

**Explicit exclusions:**
- Calculating loading error/measurement error introduced by a meter's finite internal resistance
- Specific numeric internal-resistance values for named meter models

**Representative application types:**
- Explain why an ammeter is designed with as low an internal resistance as practical.
- Explain why treating a real voltmeter as having exactly infinite resistance is a simplification, not a literal fact.

---

## Reverse prerequisite map

(Which learning points list each ID as a prerequisite -- must agree with each learning point's own `prerequisiteLearningPointIds` above.)

- `EQCT-LP-01` is a prerequisite of: `EQCT-LP-02`
- `EQCT-LP-02` is a prerequisite of: (no other Batch 04 learning point)
- `EQCT-LP-03` is a prerequisite of: `EQCT-LP-14`
- `EQCT-LP-04` is a prerequisite of: `EQCT-LP-14`
- `EQCT-LP-05` is a prerequisite of: `EQCT-LP-17`
- `EQCT-LP-06` is a prerequisite of: `EQCT-LP-05`, `EQCT-LP-18`
- `EQCT-LP-07` is a prerequisite of: `EQCT-LP-05`
- `EQCT-LP-08` is a prerequisite of: `EQCT-LP-10`, `EQCT-LP-12`
- `EQCT-LP-09` is a prerequisite of: `EQCT-LP-10`
- `EQCT-LP-10` is a prerequisite of: `EQCT-LP-13`
- `EQCT-LP-11` is a prerequisite of: `EQCT-LP-12`
- `EQCT-LP-12` is a prerequisite of: `EQCT-LP-13`
- `EQCT-LP-13` is a prerequisite of: (no other Batch 04 learning point)
- `EQCT-LP-14` is a prerequisite of: `EQCT-LP-17`, `EQCT-LP-19`
- `EQCT-LP-15` is a prerequisite of: `EQCT-LP-16`
- `EQCT-LP-16` is a prerequisite of: (no other Batch 04 learning point)
- `EQCT-LP-17` is a prerequisite of: (no other Batch 04 learning point)
- `EQCT-LP-18` is a prerequisite of: (no other Batch 04 learning point)
- `EQCT-LP-19` is a prerequisite of: (no other Batch 04 learning point)

## Full 57-requirement coverage matrix

| Evidence requirement (suffix) | Mode | Covering learning point |
|---|---|---|
| `length-correct-si-unit-and-unit-symbol::EXACT_FACT` | EXACT_FACT | `EQCT-LP-01` |
| `area-correct-si-unit-and-unit-symbol::EXACT_FACT` | EXACT_FACT | `EQCT-LP-01` |
| `volume-correct-si-unit-and-unit-symbol::EXACT_FACT` | EXACT_FACT | `EQCT-LP-01` |
| `mass-correct-si-unit-and-unit-symbol::EXACT_FACT` | EXACT_FACT | `EQCT-LP-01` |
| `density-correct-si-unit-and-unit-symbol::EXACT_FACT` | EXACT_FACT | `EQCT-LP-01` |
| `time-correct-si-unit-and-unit-symbol::EXACT_FACT` | EXACT_FACT | `EQCT-LP-01` |
| `velocity-correct-si-unit-and-unit-symbol::EXACT_FACT` | EXACT_FACT | `EQCT-LP-01` |
| `temperature-correct-si-unit-and-unit-symbol::EXACT_FACT` | EXACT_FACT | `EQCT-LP-01` |
| `practical-unit-conversion-needed-elsewhere-in-unit-202::PROCEDURE_COVERAGE` | PROCEDURE_COVERAGE | `EQCT-LP-02` |
| `current-meaning-quantity-symbol-unit-name-symbol::CONCEPT_DEFINITION::DEFINITION` | CONCEPT_DEFINITION | `EQCT-LP-03` |
| `current-meaning-quantity-symbol-unit-name-symbol::SYMBOL_OR_CONVENTION::QUANTITY_SYMBOL` | SYMBOL_OR_CONVENTION | `EQCT-LP-03` |
| `current-meaning-quantity-symbol-unit-name-symbol::SYMBOL_OR_CONVENTION::UNIT_SYMBOL` | SYMBOL_OR_CONVENTION | `EQCT-LP-03` |
| `voltage-meaning-quantity-symbol-unit-name-symbol::CONCEPT_DEFINITION::DEFINITION` | CONCEPT_DEFINITION | `EQCT-LP-04` |
| `voltage-meaning-quantity-symbol-unit-name-symbol::SYMBOL_OR_CONVENTION::QUANTITY_SYMBOL` | SYMBOL_OR_CONVENTION | `EQCT-LP-04` |
| `voltage-meaning-quantity-symbol-unit-name-symbol::SYMBOL_OR_CONVENTION::UNIT_SYMBOL` | SYMBOL_OR_CONVENTION | `EQCT-LP-04` |
| `resistance-meaning-quantity-symbol-unit-name-symbol-distinction-from-resistivity::CONCEPT_DEFINITION::DEFINITION` | CONCEPT_DEFINITION | `EFS-LP-05` (reused, accepted prior batch -- see overlap audit) |
| `resistance-meaning-quantity-symbol-unit-name-symbol-distinction-from-resistivity::CONCEPT_DEFINITION::DISTINCTION` | CONCEPT_DEFINITION | `EFS-LP-05` (reused, accepted prior batch -- see overlap audit) |
| `resistance-meaning-quantity-symbol-unit-name-symbol-distinction-from-resistivity::SYMBOL_OR_CONVENTION::QUANTITY_SYMBOL` | SYMBOL_OR_CONVENTION | `EFS-LP-05` (reused, accepted prior batch -- see overlap audit) |
| `resistance-meaning-quantity-symbol-unit-name-symbol-distinction-from-resistivity::SYMBOL_OR_CONVENTION::UNIT_SYMBOL` | SYMBOL_OR_CONVENTION | `EFS-LP-05` (reused, accepted prior batch -- see overlap audit) |
| `resistivity-meaning-quantity-symbol-unit-name-symbol-distinction-from-resistance::CONCEPT_DEFINITION::DEFINITION` | CONCEPT_DEFINITION | `EFS-LP-06` (reused, accepted prior batch -- see overlap audit) |
| `resistivity-meaning-quantity-symbol-unit-name-symbol-distinction-from-resistance::CONCEPT_DEFINITION::DISTINCTION` | CONCEPT_DEFINITION | `EFS-LP-06` (reused, accepted prior batch -- see overlap audit) |
| `resistivity-meaning-quantity-symbol-unit-name-symbol-distinction-from-resistance::SYMBOL_OR_CONVENTION::QUANTITY_SYMBOL` | SYMBOL_OR_CONVENTION | `EFS-LP-06` (reused, accepted prior batch -- see overlap audit) |
| `resistivity-meaning-quantity-symbol-unit-name-symbol-distinction-from-resistance::SYMBOL_OR_CONVENTION::UNIT_SYMBOL` | SYMBOL_OR_CONVENTION | `EFS-LP-06` (reused, accepted prior batch -- see overlap audit) |
| `power-meaning-quantity-symbol-unit-name-symbol-distinction-from-energy-and-from-power-factor::CONCEPT_DEFINITION::DEFINITION` | CONCEPT_DEFINITION | `EQCT-LP-05` |
| `power-meaning-quantity-symbol-unit-name-symbol-distinction-from-energy-and-from-power-factor::CONCEPT_DEFINITION::DISTINCTION` | CONCEPT_DEFINITION | `EQCT-LP-05` |
| `power-meaning-quantity-symbol-unit-name-symbol-distinction-from-energy-and-from-power-factor::SYMBOL_OR_CONVENTION::QUANTITY_SYMBOL` | SYMBOL_OR_CONVENTION | `EQCT-LP-05` |
| `power-meaning-quantity-symbol-unit-name-symbol-distinction-from-energy-and-from-power-factor::SYMBOL_OR_CONVENTION::UNIT_SYMBOL` | SYMBOL_OR_CONVENTION | `EQCT-LP-05` |
| `energy-meaning-quantity-symbol-unit-name-symbol-distinction-from-power::CONCEPT_DEFINITION::DEFINITION` | CONCEPT_DEFINITION | `EQCT-LP-06` |
| `energy-meaning-quantity-symbol-unit-name-symbol-distinction-from-power::CONCEPT_DEFINITION::DISTINCTION` | CONCEPT_DEFINITION | `EQCT-LP-06` |
| `energy-meaning-quantity-symbol-unit-name-symbol-distinction-from-power::SYMBOL_OR_CONVENTION::QUANTITY_SYMBOL` | SYMBOL_OR_CONVENTION | `EQCT-LP-06` |
| `energy-meaning-quantity-symbol-unit-name-symbol-distinction-from-power::SYMBOL_OR_CONVENTION::UNIT_SYMBOL` | SYMBOL_OR_CONVENTION | `EQCT-LP-06` |
| `power-factor-meaning-quantity-symbol-unit-name-symbol-dimensionless-distinction-from-power::CONCEPT_DEFINITION::DEFINITION` | CONCEPT_DEFINITION | `EQCT-LP-07` |
| `power-factor-meaning-quantity-symbol-unit-name-symbol-dimensionless-distinction-from-power::CONCEPT_DEFINITION::DISTINCTION` | CONCEPT_DEFINITION | `EQCT-LP-07` |
| `power-factor-meaning-quantity-symbol-unit-name-symbol-dimensionless-distinction-from-power::SYMBOL_OR_CONVENTION::QUANTITY_SYMBOL` | SYMBOL_OR_CONVENTION | `EQCT-LP-07` |
| `power-factor-meaning-quantity-symbol-unit-name-symbol-dimensionless-distinction-from-power::SYMBOL_OR_CONVENTION::UNIT_SYMBOL` | SYMBOL_OR_CONVENTION | `EQCT-LP-07` |
| `frequency-meaning-quantity-symbol-unit-name-symbol::CONCEPT_DEFINITION::DEFINITION` | CONCEPT_DEFINITION | `EQCT-LP-08` |
| `frequency-meaning-quantity-symbol-unit-name-symbol::SYMBOL_OR_CONVENTION::QUANTITY_SYMBOL` | SYMBOL_OR_CONVENTION | `EQCT-LP-08` |
| `frequency-meaning-quantity-symbol-unit-name-symbol::SYMBOL_OR_CONVENTION::UNIT_SYMBOL` | SYMBOL_OR_CONVENTION | `EQCT-LP-08` |
| `impedance-meaning-quantity-symbol-unit-name-symbol-distinction-from-resistance-and-reactance::CONCEPT_DEFINITION::DEFINITION` | CONCEPT_DEFINITION | `EQCT-LP-13` |
| `impedance-meaning-quantity-symbol-unit-name-symbol-distinction-from-resistance-and-reactance::CONCEPT_DEFINITION::DISTINCTION` | CONCEPT_DEFINITION | `EQCT-LP-13` |
| `impedance-meaning-quantity-symbol-unit-name-symbol-distinction-from-resistance-and-reactance::SYMBOL_OR_CONVENTION::QUANTITY_SYMBOL` | SYMBOL_OR_CONVENTION | `EQCT-LP-13` |
| `impedance-meaning-quantity-symbol-unit-name-symbol-distinction-from-resistance-and-reactance::SYMBOL_OR_CONVENTION::UNIT_SYMBOL` | SYMBOL_OR_CONVENTION | `EQCT-LP-13` |
| `capacitance-and-capacitive-reactance-meaning-quantity-symbol-unit-name-symbol-distinction-between-the-two::CONCEPT_DEFINITION::DEFINITION` | CONCEPT_DEFINITION | `EQCT-LP-09` |
| `capacitance-and-capacitive-reactance-meaning-quantity-symbol-unit-name-symbol-distinction-between-the-two::CONCEPT_DEFINITION::DISTINCTION` | CONCEPT_DEFINITION | `EQCT-LP-10` |
| `capacitance-and-capacitive-reactance-meaning-quantity-symbol-unit-name-symbol-distinction-between-the-two::SYMBOL_OR_CONVENTION::QUANTITY_SYMBOL` | SYMBOL_OR_CONVENTION | `EQCT-LP-09`, `EQCT-LP-10` |
| `capacitance-and-capacitive-reactance-meaning-quantity-symbol-unit-name-symbol-distinction-between-the-two::SYMBOL_OR_CONVENTION::UNIT_SYMBOL` | SYMBOL_OR_CONVENTION | `EQCT-LP-09`, `EQCT-LP-10` |
| `inductance-and-inductive-reactance-meaning-quantity-symbol-unit-name-symbol-distinction-between-the-two::CONCEPT_DEFINITION::DEFINITION` | CONCEPT_DEFINITION | `EQCT-LP-11` |
| `inductance-and-inductive-reactance-meaning-quantity-symbol-unit-name-symbol-distinction-between-the-two::CONCEPT_DEFINITION::DISTINCTION` | CONCEPT_DEFINITION | `EQCT-LP-12` |
| `inductance-and-inductive-reactance-meaning-quantity-symbol-unit-name-symbol-distinction-between-the-two::SYMBOL_OR_CONVENTION::QUANTITY_SYMBOL` | SYMBOL_OR_CONVENTION | `EQCT-LP-11`, `EQCT-LP-12` |
| `inductance-and-inductive-reactance-meaning-quantity-symbol-unit-name-symbol-distinction-between-the-two::SYMBOL_OR_CONVENTION::UNIT_SYMBOL` | SYMBOL_OR_CONVENTION | `EQCT-LP-11`, `EQCT-LP-12` |
| `ammeter-measures-current-series-connection::EXACT_FACT` | EXACT_FACT | `EQCT-LP-14` |
| `voltmeter-measures-potential-difference-parallel-connection::EXACT_FACT` | EXACT_FACT | `EQCT-LP-14` |
| `ohmmeter-measures-resistance::EXACT_FACT` | EXACT_FACT | `EQCT-LP-15` |
| `ohmmeter-circuit-de-energised-safe-use-principle::PROCEDURE_COVERAGE` | PROCEDURE_COVERAGE | `EQCT-LP-16` |
| `wattmeter-measures-electrical-power-appropriate-current-voltage-sensing-arrangement-at-qualification-depth::EXACT_FACT` | EXACT_FACT | `EQCT-LP-17` |
| `energy-meter-measures-integrates-electrical-energy::EXACT_FACT` | EXACT_FACT | `EQCT-LP-18` |
| `low-high-meter-internal-resistance::EXACT_FACT` | EXACT_FACT | `EQCT-LP-19` |
