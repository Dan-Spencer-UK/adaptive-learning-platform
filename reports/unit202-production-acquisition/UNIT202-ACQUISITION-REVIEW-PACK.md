# Unit 202 -- Consolidated Acquisition Review Pack

**Status:** `PROPOSED_FOR_CONSOLIDATED_PRODUCT_ARCHITECT_REVIEW`

> This pack is assembled evidence for one consolidated Product Architect review. Nothing in it is Product Architect-approved. Batches 04-06 are proposals. No authorisation for lesson production exists.

Every count in this pack was computed by a script that reads the frozen requirement plan and all six batch
artifact directories directly. **No count here is hand-asserted.**

---

## 1. The frozen plan

| | |
|---|---|
| Path | `reports/backtests/unit202-evidence-acquisition-preflight/UNIT202-EVIDENCE-REQUIREMENT-PLAN.json` |
| Declared `evidenceRequirementCount` | **213** |
| Actual requirement objects present | **213** |
| Declared matches actual | **YES** |
| Unique requirement IDs | **213** |

Per-domain counts, computed from the plan file:

| Domain | Requirements |
|---|---|
| `electrical-fundamentals-and-safety` | 28 |
| `electrical-quantities-and-circuit-theory` | 57 |
| `electromagnetism-and-induction` | 44 |
| `electronic-devices-and-applications` | 40 |
| `foundational-mathematics` | 16 |
| `mechanics-and-machines` | 28 |
| **Total** | **213** |

**Confirmed: the frozen plan contains 213 evidence requirements.**

## 2. Set-equality validation across all six batches

| Check | Result |
|---|---|
| Frozen-plan requirement IDs | 213 |
| Union of all six batches' requirement IDs | 213 |
| Total result rows across all batches | 213 |
| Duplicate rows across batches | 0 |
| In the plan but missing from every batch | 0 |
| In a batch but not in the plan | 0 |
| **Exact union equals the frozen plan** | **YES** |

**The six batch requirement sets union exactly to the frozen plan's 213 requirements,
with no duplication and no omission.**

## 3. Consolidated verification status

| Status | Count |
|---|---|
| VERIFIED | **180** |
| PARTIAL | **31** |
| GAP | **2** |
| **Total** | **213** |

> **All 213 requirements are NOT verified.** 180 are VERIFIED,
> 31 are PARTIAL and 2 are GAP. This is the honest position and it is stated here
> deliberately, because the acquisition originally reported Batch 04 as 57/57 VERIFIED and that claim did not survive audit.

## 4. Per-batch summary

| Batch | Domain | Reqs | Set equality | VERIFIED | PARTIAL | GAP | Sources | LPs | READY | Held | LP status | Identity |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 01 | `foundational-mathematics` | 16 | EXACT | 16 | 0 | 0 | 17 | 25 | 25 | 0 | `ACCEPTED_BY_PRODUCT_ARCHITECT` | FROZEN |
| 02 | `electrical-fundamentals-and-safety` | 28 | EXACT | 28 | 0 | 0 | 14 | 20 | 20 | 0 | `ACCEPTED_BY_PRODUCT_ARCHITECT` | FROZEN |
| 03 | `mechanics-and-machines` | 28 | EXACT | 28 | 0 | 0 | 18 | 18 | 18 | 0 | `ACCEPTED_BY_PRODUCT_ARCHITECT` | FROZEN |
| 04 | `electrical-quantities-and-circuit-theory` | 57 | EXACT | 49 | 8 | 0 | 26 | 19 | 12 | 7 | `PROPOSED_FOR_PA_REVIEW` | **PROPOSED** |
| 05 | `electromagnetism-and-induction` | 44 | EXACT | 32 | 11 | 1 | 48 | 22 | 13 | 9 | `PROPOSED_FOR_PA_REVIEW` | **PROPOSED** |
| 06 | `electronic-devices-and-applications` | 40 | EXACT | 27 | 12 | 1 | 46 | 29 | 19 | 10 | `PROPOSED_FOR_PA_REVIEW` | **PROPOSED** |

## 5. Which identities are frozen and which are proposed

**FROZEN AND ACCEPTED** (do not edit, renumber or reuse these identities):

- Batch 01: `FM-LP-` x25 -- status `ACCEPTED_BY_PRODUCT_ARCHITECT`, freeze: FROZEN as of this closure pass
- Batch 02: `EFS-LP-` x20 -- status `ACCEPTED_BY_PRODUCT_ARCHITECT`, freeze: FROZEN as of this closure pass
- Batch 03: `MM-LP-` x18 -- status `ACCEPTED_BY_PRODUCT_ARCHITECT`, freeze: FROZEN as of this closure pass

**PROPOSED AND UNFROZEN** (open to correction, addition, merger or withdrawal at this review):

- Batch 04: `EQCT-LP-` x19 -- status `PROPOSED_FOR_PA_REVIEW`, freeze: NOT FROZEN (no identityFreezePolicy block present)
- Batch 05: `EMI-LP-` x22 -- status `PROPOSED_FOR_PA_REVIEW`, freeze: NOT FROZEN (no identityFreezePolicy block present)
- Batch 06: `EDA-LP-` x29 -- status `PROPOSED_FOR_PA_REVIEW`, freeze: NOT FROZEN (no identityFreezePolicy block present)

## 6. Requirement-to-learning-point coverage

| | |
|---|---|
| Requirements mapped to at least one learning point | **213 / 213** |
| Requirements with NO learning-point mapping | **0** |
| Requirements satisfied by a PRIOR batch's frozen learning point | **8** |

The full map is in the JSON pack under `requirementToLearningPointCoverage.map`.

### The Batch 04 EFS-LP-05 / EFS-LP-06 representation issue

**Resistance (meaning, quantity symbol R, unit symbol ohm/Ω, distinction from resistivity)** -- 4 requirements satisfied by the accepted, frozen `EFS-LP-05` rather than by any new Batch 04 identity.

> The current artifact format has no explicit field for 'this evidence requirement is satisfied by a PRIOR BATCH's learning point, not this batch's own inventory' -- it is only representable here as prose disclosure (this overlap-audit entry) plus a coverage-matrix row in COVERAGE-REPORT.md pointing at EFS-LP-05/06. If a future schema revision is undertaken, consider adding a structured 'satisfiedByExistingLearningPointId' field to the evidence-requirement-to-learning-point coverage matrix so this reuse pattern does not have to rely on prose alone.

**Resistivity (meaning, quantity symbol rho, unit symbol ohm-metre, distinction from resistance)** -- 4 requirements satisfied by the accepted, frozen `EFS-LP-06` rather than by any new Batch 04 identity.

> Same representation question as the resistance entry above.

The 8 affected requirements are:

- `resistance-meaning-quantity-symbol-unit-name-symbol-distinction-from-resistivity::CONCEPT_DEFINITION::DEFINITION` -> EFS-LP-05
- `resistance-meaning-quantity-symbol-unit-name-symbol-distinction-from-resistivity::CONCEPT_DEFINITION::DISTINCTION` -> EFS-LP-05
- `resistance-meaning-quantity-symbol-unit-name-symbol-distinction-from-resistivity::SYMBOL_OR_CONVENTION::QUANTITY_SYMBOL` -> EFS-LP-05
- `resistance-meaning-quantity-symbol-unit-name-symbol-distinction-from-resistivity::SYMBOL_OR_CONVENTION::UNIT_SYMBOL` -> EFS-LP-05
- `resistivity-meaning-quantity-symbol-unit-name-symbol-distinction-from-resistance::CONCEPT_DEFINITION::DEFINITION` -> EFS-LP-06
- `resistivity-meaning-quantity-symbol-unit-name-symbol-distinction-from-resistance::CONCEPT_DEFINITION::DISTINCTION` -> EFS-LP-06
- `resistivity-meaning-quantity-symbol-unit-name-symbol-distinction-from-resistance::SYMBOL_OR_CONVENTION::QUANTITY_SYMBOL` -> EFS-LP-06
- `resistivity-meaning-quantity-symbol-unit-name-symbol-distinction-from-resistance::SYMBOL_OR_CONVENTION::UNIT_SYMBOL` -> EFS-LP-06

## 7. Unresolved requirements

### GAPs (2)

- **Batch 05** `dot-cross-page-convention::SYMBOL_OR_CONVENTION` -- Dot/cross page convention.
  - AUTHORITY-CLASS MISMATCH, not a content gap. The convention is stated explicitly and unambiguously in both directions (dot = out of page, cross = into page) in a source that was genuinely opened and read (MIT 8.02 Chapter 8, §8.3). However, MIT OpenCourseWare is ACADEMIC_OR_RESEARCH_INSTITUTION, which is NOT among this requirement's declared sourceAuthorityClasses (PRIMARY_NORMATIVE_OR_STANDARDS_BODY, PROFESSIONAL_BODY, AUTHORITATIVE_TECHNICAL_REFERENCE). No source within the declared classes was obtained: IEC Electropedia / IEV returned HTTP 403 and Encyclopaedia Britannica returned HTTP 403.

- **Batch 06** `security-alarm-exact-nc-contact-bias-topology::EXACT_FACT` -- Security alarm: exact NC/contact/bias topology.
  - No authoritative source was found and read that states an exact normally-closed contact / bias topology for any specific, identified security alarm circuit. Nothing was recorded.

### PARTIALs (31)

| Batch | Requirement | Unresolved dimensions |
|---|---|---|
| 04 | `practical-unit-conversion-needed-elsewhere-in-unit-202::PROCEDURE_COVERAGE` | (breadth/compounding -- see the result's own gaps) |
| 04 | `resistivity-meaning-quantity-symbol-unit-name-symbol-distinction-from-resistance::SYMBOL_OR_CONVENTION::UNIT_SYMBOL` | (breadth/compounding -- see the result's own gaps) |
| 04 | `power-meaning-quantity-symbol-unit-name-symbol-distinction-from-energy-and-from-power-factor::CONCEPT_DEFINITION::DISTINCTION` | (breadth/compounding -- see the result's own gaps) |
| 04 | `power-factor-meaning-quantity-symbol-unit-name-symbol-dimensionless-distinction-from-power::CONCEPT_DEFINITION::DISTINCTION` | (breadth/compounding -- see the result's own gaps) |
| 04 | `inductance-and-inductive-reactance-meaning-quantity-symbol-unit-name-symbol-distinction-between-the-two::CONCEPT_DEFINITION::DISTINCTION` | (breadth/compounding -- see the result's own gaps) |
| 04 | `ohmmeter-measures-resistance::EXACT_FACT` | (breadth/compounding -- see the result's own gaps) |
| 04 | `ohmmeter-circuit-de-energised-safe-use-principle::PROCEDURE_COVERAGE` | CALCULATION_METHOD |
| 04 | `energy-meter-measures-integrates-electrical-energy::EXACT_FACT` | (breadth/compounding -- see the result's own gaps) |
| 05 | `appropriate-simple-ac-generation-calculations::PROCEDURE_COVERAGE` | (breadth/compounding -- see the result's own gaps) |
| 05 | `appropriate-sine-wave-conversions-calculations::PROCEDURE_COVERAGE` | (breadth/compounding -- see the result's own gaps) |
| 05 | `coil::SCHEMATIC_OR_DIAGRAM_RECOGNITION` | RECOGNITION |
| 05 | `equivalent-rpm-relationship-f-n-rpm-x-p-60::RELATIONSHIP` | (breadth/compounding -- see the result's own gaps) |
| 05 | `fleming-right-hand-generator-rule::OPERATIONAL_USE_RULE` | DIRECTIONAL_MAPPING |
| 05 | `magnetic-field-patterns::SCHEMATIC_OR_DIAGRAM_RECOGNITION` | (breadth/compounding -- see the result's own gaps) |
| 05 | `motional-induced-emf-causal-concept::RELATIONSHIP` | (breadth/compounding -- see the result's own gaps) |
| 05 | `motor-effect::EXACT_FACT` | (breadth/compounding -- see the result's own gaps) |
| 05 | `right-hand-grip-rule::OPERATIONAL_USE_RULE` | CORRECT_USE_CONDITIONS |
| 05 | `rotational-frequency-pole-pairs-relationship::FORMULA_OR_RULE` | FORMULA |
| 05 | `single-loop-alternator-generator-parts::SCHEMATIC_OR_DIAGRAM_RECOGNITION` | (breadth/compounding -- see the result's own gaps) |
| 06 | `dimmer-exact-rc-timing-implementation-component-values::EXACT_FACT` | DEFINITION |
| 06 | `heating-exact-transistor-relay-topology::EXACT_FACT` | DEFINITION |
| 06 | `motor-bridge-rectifier-converts-ac-to-dc::EXACT_FACT` | DEFINITION |
| 06 | `physical-photo-appearance-recognition-of-each-component::SCHEMATIC_OR_DIAGRAM_RECOGNITION` | RECOGNITION |
| 06 | `schematic-symbol-recognition-for-each-named-ac6-2-component-device-family-at-qualification-depth::SYMBOL_OR_CONVENTION` | QUANTITY_SYMBOL |
| 06 | `security-alarm-scr-thyristor-latching-sounder-role::EXACT_FACT` | DEFINITION |
| 06 | `security-alarm-transistor-switching::EXACT_FACT` | DEFINITION |
| 06 | `telephone-capacitor-ringer::EXACT_FACT` | DEFINITION |
| 06 | `telephone-master-secondary-socket-details::EXACT_FACT` | DEFINITION |
| 06 | `telephone-resistor-line-testing::EXACT_FACT` | DEFINITION |
| 06 | `telephones-application-category-function::EXACT_FACT` | DEFINITION |
| 06 | `thermistor-basic-operating-principle::EXACT_FACT` | (breadth/compounding -- see the result's own gaps) |

### Held learning points (26)

| Batch | Learning point | Title |
|---|---|---|
| 04 | `EQCT-LP-02` | Practical unit conversion, including squared and cubed quantities |
| 04 | `EQCT-LP-05` | Power: meaning, quantity symbol, unit, and distinction from energy and power factor |
| 04 | `EQCT-LP-07` | Power factor: meaning, notation, dimensionless nature, and distinction from power |
| 04 | `EQCT-LP-12` | Inductive reactance: meaning, unit, and distinction from inductance |
| 04 | `EQCT-LP-15` | Ohmmeter: measures resistance |
| 04 | `EQCT-LP-16` | Ohmmeter safe use: the circuit must be de-energised |
| 04 | `EQCT-LP-18` | Energy meter: measures and integrates electrical energy over time |
| 05 | `EMI-LP-02` | Recognising magnetic field patterns |
| 05 | `EMI-LP-03` | The dot-and-cross page convention for field and current direction |
| 05 | `EMI-LP-05` | The right-hand grip rule for a current-carrying conductor |
| 05 | `EMI-LP-12` | The motor effect and the force on a current-carrying conductor |
| 05 | `EMI-LP-14` | Electromagnetic induction: motion, flux cutting, and when EMF is greatest or zero |
| 05 | `EMI-LP-16` | Fleming's right-hand (generator) rule |
| 05 | `EMI-LP-17` | The simple AC generator: parts and how they work together |
| 05 | `EMI-LP-21` | Carrying out sine-wave conversion calculations |
| 05 | `EMI-LP-22` | Generated frequency, pole pairs and rotational speed |
| 06 | `EDA-LP-09` | Thermistor: basic operating principle, and the NTC/PTC distinction |
| 06 | `EDA-LP-16` | Recognising the schematic symbols for Unit 202 components |
| 06 | `EDA-LP-17` | Recognising components by their physical appearance |
| 06 | `EDA-LP-19` | Dimmer: exact RC timing implementation and component values |
| 06 | `EDA-LP-21` | Heating: exact transistor/relay switching topology |
| 06 | `EDA-LP-23` | Motor drives: the bridge rectifier converting AC to DC |
| 06 | `EDA-LP-25` | Security alarm circuit: NC loop, transistor switching and SCR latching |
| 06 | `EDA-LP-26` | The legacy UK analogue PSTN and what a telephone service is |
| 06 | `EDA-LP-27` | The UK master socket and extension sockets |
| 06 | `EDA-LP-28` | Inside the UK master socket: ringer capacitor, line-test resistor and surge protector |

Each carries an `evidenceReadinessNote` in its own batch artifact naming exactly what is missing.

## 8. Conflicts recorded (not harmonised)

- **Batch 04** `current-meaning-quantity-symbol-unit-name-symbol::CONCEPT_DEFINITION::DEFINITION`: NUMERICALLY FALSE FIGURE IN A QUOTED SOURCE PASSAGE, flagged in the internal audit pass and NOT relied upon. SRC-EOLSS-ELECQUANT's quoted passage states that a current of 1 ampere corresponds to 'approximately 1.602176487x10^19 electrons per second through a surface'. That is wrong by more than an order of magnitude: one ampere is approximately 6.24x10^18 electrons per second (1/e, where the eleme
- **Batch 04** `voltage-meaning-quantity-symbol-unit-name-symbol::SYMBOL_OR_CONVENTION::QUANTITY_SYMBOL`: Authoritative technical references genuinely differ on the letter used for voltage's quantity symbol: SRC-ETW-DC1 gives 'V or E'; SRC-EOLSS-ELECQUANT gives 'V or sometimes U'. Reported rather than harmonised.
- **Batch 04**: {"requirementId":"ER::provisional::unit202::electrical-quantities-and-circuit-theory::practical-unit-conversion-needed-elsewhere-in-unit-202::PROCEDURE_COVERAGE","status":"PARTIAL","summary":"Downgraded from VERIFIED to PARTIAL in the internal audit pass, and the SRC-NIST-SP811-CH4 candidate source and its claim were REMOVED, for two independent defects. (1) AUTHORITY CLASS: SRC-NIST-SP811-CH4 is 
- **Batch 04**: {"requirementId":"ER::provisional::unit202::electrical-quantities-and-circuit-theory::resistivity-meaning-quantity-symbol-unit-name-symbol-distinction-from-resistance::SYMBOL_OR_CONVENTION::UNIT_SYMBOL","status":"PARTIAL","summary":"No single retrieved passage states both that the quantity in question is RESISTIVITY and that its SI unit symbol is the ohm-metre. The claim is established by compound
- **Batch 04**: {"requirementId":"ER::provisional::unit202::electrical-quantities-and-circuit-theory::power-meaning-quantity-symbol-unit-name-symbol-distinction-from-energy-and-from-power-factor::CONCEPT_DEFINITION::DISTINCTION","status":"PARTIAL","summary":"Downgraded from VERIFIED to PARTIAL in the internal audit pass. The previously recorded retrievedPassage for SRC-ETW-POWERTRIANGLE ('Power (P): Measured in w
- **Batch 04**: {"requirementId":"ER::provisional::unit202::electrical-quantities-and-circuit-theory::power-factor-meaning-quantity-symbol-unit-name-symbol-dimensionless-distinction-from-power::CONCEPT_DEFINITION::DISTINCTION","status":"PARTIAL","summary":"Downgraded from VERIFIED to PARTIAL in the internal audit pass, for the same fabricated-quotation defect recorded on the sibling power::DISTINCTION result: the
- **Batch 04**: {"requirementId":"ER::provisional::unit202::electrical-quantities-and-circuit-theory::inductance-and-inductive-reactance-meaning-quantity-symbol-unit-name-symbol-distinction-between-the-two::CONCEPT_DEFINITION::DISTINCTION","status":"PARTIAL","summary":"Downgraded from VERIFIED to PARTIAL in the internal audit pass. The previously recorded retrievedPassage ('inductance is a fixed property of a coi
- **Batch 04**: {"requirementId":"ER::provisional::unit202::electrical-quantities-and-circuit-theory::ohmmeter-measures-resistance::EXACT_FACT","status":"PARTIAL","summary":"Downgraded from VERIFIED to PARTIAL in the internal audit pass: no sentence from the source was ever reproduced for this requirement, so the requirement's own acceptance criterion ('the exact passage must be actually read and cited, never inf
- **Batch 04**: {"requirementId":"ER::provisional::unit202::electrical-quantities-and-circuit-theory::ohmmeter-circuit-de-energised-safe-use-principle::PROCEDURE_COVERAGE","status":"PARTIAL","summary":"Downgraded from VERIFIED to PARTIAL in the internal audit pass. This requirement declares two coverage dimensions, PROCEDURE and CALCULATION_METHOD; the evidence ('Step 1. Turn Off Power to Circuit'; 'If a circuit 
- **Batch 04**: {"requirementId":"ER::provisional::unit202::electrical-quantities-and-circuit-theory::energy-meter-measures-integrates-electrical-energy::EXACT_FACT","status":"PARTIAL","summary":"Downgraded from VERIFIED to PARTIAL in the internal audit pass. The requirement is 'energy meter measures/INTEGRATES electrical energy', but the sole retrieved passage is the single sentence 'Electrical energy usage is m
- **Batch 05** `appropriate-simple-ac-generation-calculations::PROCEDURE_COVERAGE`: Convention: this source expresses the calculation in the TOTAL-POLES convention (P = number of poles, divide by 2 because 'there will always be a set of two poles'), whereas the cluster's own formula requirement is stated in the POLE-PAIRS convention. The two are equivalent only under P_total = 2 × P_pole-pairs. Recorded rather than silently converted.
- **Batch 05** `b-phi-a-and-appropriate-rearrangement-use::FORMULA_OR_RULE`: [object Object]
- **Batch 05** `equivalent-rpm-relationship-f-n-rpm-x-p-60::RELATIONSHIP`: POLE-PAIRS vs TOTAL-POLES CONVENTION CONFLICT. The requirement states f = n_rpm × P / 60 with P = number of POLE PAIRS. Both sources actually read state the relationship with P = TOTAL number of poles and a divisor of 120 (Flinn: f = PN/120; SIU: n_s = 120f/P). These are mathematically equivalent only under the substitution P_total = 2 × P_pole-pairs. This convention difference is recorded rather 
- **Batch 05** `fleming-left-hand-rule::OPERATIONAL_USE_RULE`: Mnemonic-convention difference (not a physical contradiction): HyperPhysics (SRC-HYPERPHYSICS-FORWIR) and OpenStax 22.7 give the direction of the force on a current-carrying wire using the vector cross-product RIGHT-hand rule for F = IL x B, whereas Fleming's LEFT-hand rule reaches the same physical direction using a different finger mnemonic. Teaching material must not present these as competing 
- **Batch 05** `fleming-right-hand-generator-rule::OPERATIONAL_USE_RULE`: Current-flow-convention conflict, reported not harmonised: SRC-LIBRETEXTS-COALINGA-GENERATOR (section 12.5.4) describes generator action with a LEFT-hand rule and electron flow — "the left hand rule indicates that the electron flow will be from the back to the front in that side of the coil". That is the electron-flow (conventional-current-reversed) formulation used in some North American training
- **Batch 05** `magnetic-flux-density-meaning-symbol-unit::EXACT_FACT`: [object Object]
- **Batch 05** `maximum-induced-emf-when-cutting-is-maximum::EXACT_FACT`: Apparent-but-not-real tension to preserve in teaching: Ellingson expresses the maximum condition in terms of the LOOP PLANE being parallel to B (flux Φ = 0, dΦ/dt maximum), whereas Coalinga expresses it in terms of the CONDUCTOR cutting perpendicularly across the field. These are the same instant described from two viewpoints (loop-plane orientation vs. conductor velocity relative to B) and must n
- **Batch 05** `no-minimum-induced-emf-when-motion-does-not-cut-flux-appropriately::EXACT_FACT`: Same viewpoint tension as the maximum-EMF requirement: 'moving parallel to the field / not cutting flux' (conductor viewpoint) and 'plane of the loop perpendicular to B' (loop viewpoint) describe the same zero-EMF instant. Maximum FLUX linkage coincides with ZERO induced EMF; teaching material must not equate maximum flux with maximum EMF.
- **Batch 05** `right-hand-grip-rule::OPERATIONAL_USE_RULE`: [object Object]
- **Batch 05** `rotation-field-cutting-causality::RELATIONSHIP`: SRC-LIBRETEXTS-COALINGA-GENERATOR uses ELECTRON FLOW and a left-hand rule for the direction of the generated current, and its worked example uses a split-ring commutator. Its flux-cutting causality statements are convention-independent and are used here; its directional and hardware statements must NOT be carried across into UK conventional-current material or into slip-ring alternator material.
- **Batch 05** `rotational-frequency-pole-pairs-relationship::FORMULA_OR_RULE`: POLE-PAIRS vs TOTAL-POLES CONVENTION CONFLICT (the principal guardrail tension in this cluster). MIT 6.685 Class Notes 8 explicitly defines p as 'the number of pole-pairs' and states that pω_m is the electrical rotation speed - the pole-pair convention the requirement asks for. Flinn (LibreTexts) and SIU ET 332b both use the TOTAL-poles convention (f = PN/120; n_s = 120f/P) with an explicit diviso
- **Batch 05** `single-loop-alternator-generator-parts::SCHEMATIC_OR_DIAGRAM_RECOGNITION`: Scope caution to preserve: DOE Figure 3 'Simple AC Generator' is a ROTATING-FIELD machine (the rotor carries the field coil and the slip rings feed excitation IN), whereas DOE Figures 1 and 5 show the STATIONARY-FIELD, ROTATING-ARMATURE machine (the slip rings carry the generated output OUT) that matches the classic UK 'single-loop alternator'. The handbook itself flags that both exist. These must
- **Batch 05** `solenoid-polarity::EXACT_FACT`: [object Object]
- **Batch 05** `solenoid-polarity::EXACT_FACT`: [object Object]
- **Batch 05**: {"requirementId":"ER::provisional::unit202::electromagnetism-and-induction::appropriate-simple-ac-generation-calculations::PROCEDURE_COVERAGE","requirementText":"Appropriate simple AC-generation calculations.","status":"PARTIAL","summary":"Downgraded VERIFIED -> PARTIAL during the internal audit pass, on BREADTH. This result's own record states that 'the read passage covers the frequency/speed/pol
- **Batch 05**: {"requirementId":"ER::provisional::unit202::electromagnetism-and-induction::appropriate-sine-wave-conversions-calculations::PROCEDURE_COVERAGE","requirementText":"Appropriate sine-wave conversions/calculations.","status":"PARTIAL","summary":"Downgraded VERIFIED -> PARTIAL during the internal audit pass, on CALCULATION_METHOD breadth. This result's own record states that 'no read source gives a wor
- **Batch 05**: {"requirementId":"ER::provisional::unit202::electromagnetism-and-induction::coil::SCHEMATIC_OR_DIAGRAM_RECOGNITION","requirementText":"Coil.","status":"PARTIAL","summary":"No source within the requirement's permitted authority classes was obtained that shows a coil with an explicit figure callout reading 'coil', nor a standardised graphical symbol for a coil/winding. The DOE figures draw the windi
- **Batch 05**: {"requirementId":"ER::provisional::unit202::electromagnetism-and-induction::dot-cross-page-convention::SYMBOL_OR_CONVENTION","requirementText":"Dot/cross page convention.","status":"GAP","summary":"AUTHORITY-CLASS MISMATCH, not a content gap. The convention is stated explicitly and unambiguously in both directions (dot = out of page, cross = into page) in a source that was genuinely opened and rea
- **Batch 05**: {"requirementId":"ER::provisional::unit202::electromagnetism-and-induction::equivalent-rpm-relationship-f-n-rpm-x-p-60::RELATIONSHIP","requirementText":"Equivalent rpm relationship f = n_rpm x P / 60.","status":"PARTIAL","summary":"The n_rpm-with-pole-pairs form (f = n_rpm × P_pole-pairs / 60) was not directly evidenced by any read passage; four further candidates (IEC Electropedia, Britannica, Sc
- **Batch 05**: {"requirementId":"ER::provisional::unit202::electromagnetism-and-induction::fleming-right-hand-generator-rule::OPERATIONAL_USE_RULE","requirementText":"Fleming right-hand/generator rule.","status":"PARTIAL","summary":"No source within the permitted authority classes was found that states IN TEXT the finger-to-quantity assignment for the right hand (thumb = motion/velocity, first finger = field, se
- **Batch 05**: {"requirementId":"ER::provisional::unit202::electromagnetism-and-induction::magnetic-field-patterns::SCHEMATIC_OR_DIAGRAM_RECOGNITION","requirementText":"Magnetic field patterns.","status":"PARTIAL","summary":"PARTIAL on BREADTH. 'Magnetic field patterns' is plural and open-ended; in-class retrieved figures cover two patterns -- the field around a straight current-carrying conductor, and the field
- **Batch 05**: {"requirementId":"ER::provisional::unit202::electromagnetism-and-induction::motional-induced-emf-causal-concept::RELATIONSHIP","requirementText":"Motional/induced EMF causal concept.","status":"PARTIAL","summary":"Downgraded VERIFIED -> PARTIAL during the internal audit pass. This result's own record states that the claim 'is a disclosed compounding of the Lorentz-force mechanism (LibreTexts 13.4)
- **Batch 05**: {"requirementId":"ER::provisional::unit202::electromagnetism-and-induction::motor-effect::EXACT_FACT","requirementText":"Motor effect.","status":"PARTIAL","summary":"The physical fact is fully evidenced, but no read source within the permitted authority classes uses the UK-syllabus TERM 'motor effect' itself; both sources title the phenomenon 'magnetic force on a current-carrying conductor/wire'. 
- **Batch 05**: {"requirementId":"ER::provisional::unit202::electromagnetism-and-induction::right-hand-grip-rule::OPERATIONAL_USE_RULE","requirementText":"Right-hand grip rule.","status":"PARTIAL","summary":"PARTIAL on AUTHORITY DEPTH and on the CORRECT_USE_CONDITIONS dimension. The thumb-to-conventional-current / curled-fingers-to-field mapping is genuinely retrieved, but from only ONE in-class source, SRC-ARBOR
- **Batch 05**: {"requirementId":"ER::provisional::unit202::electromagnetism-and-induction::rotational-frequency-pole-pairs-relationship::FORMULA_OR_RULE","requirementText":"f = N × P, where f is frequency, N is rotational speed in revolutions per second, and P is the number of pole pairs.","status":"PARTIAL","summary":"No read source states the formula in the requirement's exact units (f in Hz, N in rev/s, P = p
- **Batch 05**: {"requirementId":"ER::provisional::unit202::electromagnetism-and-induction::single-loop-alternator-generator-parts::SCHEMATIC_OR_DIAGRAM_RECOGNITION","requirementText":"Single-loop alternator/generator parts.","status":"PARTIAL","summary":"No source read within the permitted authority classes shows a diagram explicitly captioned as a SINGLE-LOOP (one-turn) alternator with every part labelled. DOE 
- **Batch 06** `4-band-resistor-colour-code::PROCEDURE_COVERAGE`: Orientation cue differs in phrasing between the two academic sources read. Duke PrattWiki instructs the reader to start '(starting from the band on the part of the resistor with the largest radius)', i.e. it keys orientation to the physical body shape of the resistor; Grinnell College keys orientation to the tolerance band instead ('The last, tolerance band is often clearly separated from the valu
- **Batch 06** `4-band-resistor-colour-code::PROCEDURE_COVERAGE`: Multiplier-band framing differs: Duke describes band 3 as telling you 'how many zeros to add' whereas UCF and Grinnell describe it as a multiplier / power-of-ten weight. These are equivalent for whole-number multipliers but the 'add zeros' framing does not extend to the gold (x0.1) and silver (x0.01) fractional multipliers, which Duke nevertheless lists correctly in its table.
- **Batch 06** `dimmer-exact-rc-timing-implementation-component-values::EXACT_FACT`: SPECIFICATION AMBIGUITY (requires human adjudication): the frozen requirement text 'Dimmer: exact RC timing implementation/component values.' does not identify WHICH dimmer circuit is meant. There is no referenced figure, no circuit name and no source document named in the requirement object. The requirement therefore cannot be closed as VERIFIED by any external source, because there is no way to 
- **Batch 06** `dimmer-exact-rc-timing-implementation-component-values::EXACT_FACT`: The values genuinely retrieved are NOT unique: AN1003 alone gives at least four different exact RC sets for phase-control dimmers (Figure 16.9, Figure 16.11, Figure 16.14 and Figure 16.15), which differ by supply voltage, load current, hysteresis behaviour and range of control. ST AN392 Figure 6 describes a fourth, MCU-timed dimmer in which the timing is done in software by the ST6210 timer and th

## 9. Failed-access disclosures

97 access failures are logged across the six batches, with per-candidate
detail in each batch's `ACQUISITION-LOG.json`. The recurring blockers were:

- **IEC Electropedia / std.iec.ch** -- HTTP 403 on every attempt across Batches 04, 05 and 06. This is the single
  biggest reason no normative source appears in the two new batches.
- **Encyclopaedia Britannica** -- HTTP 403 throughout.
- **ScienceDirect, All About Circuits, TDK, RP Photonics** -- 403.
- **BSI (BS EN 50131) and IEC 60062** -- paywalled.
- **IET units-and-symbols PDF** -- bot-protection challenge.
- Several manufacturer sites returned 403/429, so their application notes were read from third-party
  university-hosted mirrors, disclosed on each affected source record.

**No blocked source was ever substituted with a search-result snippet or summary as evidence.** Where a PDF's
text layer could not be extracted, the file was downloaded and read as rendered page images, and every figure
cited was actually viewed.

## 10. Cross-batch source reuse

4 sources are cited in more than one batch:

| Source | Batches | Authority class(es) |
|---|---|---|
| `SRC-HP-RESIS` | 02, 04 | ACADEMIC_OR_RESEARCH_INSTITUTION |
| `SRC-NIST-MASS` | 03, 04 | GOVERNMENT_OR_REGULATOR |
| `SRC-NIST-RESHALL` | 02, 04 | PRIMARY_NORMATIVE_OR_STANDARDS_BODY |
| `SRC-NIST-SP811-B9` | 02, 04 | PRIMARY_NORMATIVE_OR_STANDARDS_BODY |

Every reuse was re-fetched and re-read for the new claim rather than carried over from a prior batch's normalized
claim.

## 11. Cross-batch learning-point reuse and overlap decisions

**Requirements satisfied by a prior batch's learning point** (rather than a new identity):

- Batch 04: **Resistance (meaning, quantity symbol R, unit symbol ohm/Ω, distinction from resistivity)** -> `EFS-LP-05` (with EFS-LP-06 (resistivity)), covering 4 requirements
- Batch 04: **Resistivity (meaning, quantity symbol rho, unit symbol ohm-metre, distinction from resistance)** -> `EFS-LP-06` (with EFS-LP-05 (resistance)), covering 4 requirements

**Cross-domain prerequisites onto frozen inventories** -- 83 declared in total; all point at accepted, frozen `FM-LP-*`, `EFS-LP-*` or `MM-LP-*` identities. **No prerequisite anywhere points at an unfrozen identity.**

**Overlap decisions where a NEW learning point was added rather than reusing an existing one:**

- **Batch 04** -- Current (existence/meaning) vs the accepted charge-flow RELATIONSHIP: `NEW_LP_ADDED`
  - EFS-LP-02 teaches the RELATIONSHIP I=Q/t (current as rate of charge flow) as its own calculation-bearing outcome; it does not itself state current's quantity symbol (I) or unit symbol (A) as an assessed identity fact, and its own evidence requirement is a different evidenceRequirementId (RELATIONSHIP mode) to Batch 04's (CONCEPT_DEFINITION/SYMBOL_OR_CONVENTION modes). Batch 04 therefore needs genuinely additional mastery (the identity/symbol facts), not a duplicate of EFS-LP-02's calculation mas
- **Batch 04** -- Voltage (existence/meaning) vs the accepted voltage-drop RELATIONSHIP: `NEW_LP_ADDED`
  - EFS-LP-09 teaches the specific voltage-DROP concept and formula (Vdrop=IR) across a resistance; it does not itself teach voltage's general meaning/quantity-symbol/unit-symbol as an identity fact independent of the drop context, nor does it address the U-vs-V convention question. Batch 04 needs this genuinely additional, more general identity mastery. EQCT-LP-04 does not re-teach or reference Vdrop=IR.
- **Batch 04** -- Power (existence/meaning/symbols) vs the accepted power-FORMULA calculation mastery: `NEW_LP_ADDED`
  - EFS-LP-17 teaches selecting and using P=VI/I^2R/V^2R as a calculation procedure; it does not itself teach power's quantity symbol/unit symbol as dedicated identity facts, nor the explicit distinction from energy and power factor that Batch 04's own frozen requirement demands. EQCT-LP-05 supplies exactly this additional conceptual/identity mastery and does not re-teach the calculation procedure itself.
- **Batch 05** -- Frequency (meaning, quantity symbol, unit) versus frequency as a property of the generated AC waveform: `NEW_LP_ADDED_DISTINCT_MASTERY`
  - Batch 04's EQCT-LP-08 teaches frequency as an ELECTRICAL QUANTITY -- its meaning, quantity symbol f and unit hertz -- alongside the other quantities of that domain. EMI-LP-18 teaches frequency as a property of the GENERATED AC WAVEFORM, defined in terms of the cycle and tied to periodic time by T = 1/f, in the context of what an alternator actually produces. The two are genuinely different masteries and Batch 05's frequency requirement carries its own distinct evidence-requirement ID. No content
- **Batch 05** -- Inductance and inductive reactance: `NO_OVERLAP_NO_ACTION`
  - Batch 05 contains no inductance requirement. Coils appear here only as machine parts (EMI-LP-17) and as the field-producing element of solenoids and electromagnets (EMI-LP-06, EMI-LP-07); the electrical quantity inductance is entirely Batch 04's. No duplication exists and none was created.
- **Batch 05** -- Conventional current and electron flow: `REUSED_AS_CROSS_DOMAIN_PREREQUISITE`
  - The accepted, frozen Batch 02 EFS-LP-03 already teaches the conventional-current/electron-flow distinction. All three of this batch's directional rules (EMI-LP-05, EMI-LP-13, EMI-LP-16) depend on it absolutely -- each is correct only for the conventional-current convention -- so it is attached as a genuine cross-domain prerequisite rather than re-taught. One retrieved source (LibreTexts Coalinga) describes generator action using a LEFT-hand rule and electron flow, which is flatly incompatible wi
- **Batch 06** -- Capacitance and the capacitor: `NEW_LP_ADDED_DISTINCT_MASTERY`
  - Batch 04's EQCT-LP-09 teaches CAPACITANCE as an electrical quantity -- its meaning, quantity symbol and unit. EDA-LP-03 teaches the CAPACITOR as a component: what it stores, how it is constructed, and that the energy resides in the electric field rather than in the plates. These are different masteries with different evidence requirements, and EDA-LP-03 deliberately does not re-teach the quantity identity.
- **Batch 06** -- Resistance the quantity versus the resistor the component: `REUSED_AS_CROSS_DOMAIN_PREREQUISITE`
  - The accepted, frozen Batch 02 EFS-LP-05 defines RESISTANCE as a quantity (R = V/I, measured in ohms). EDA-LP-01 teaches the RESISTOR as a component -- that it opposes and limits current and deliberately dissipates energy as heat. The quantity is not re-taught; EFS-LP-05 and EFS-LP-08 are attached as genuine cross-domain prerequisites instead.
- **Batch 06** -- Relay: `POTENTIAL_DUPLICATION_FLAGGED_NOT_RESOLVED`
  - Batch 05's EMI-LP-08 teaches the relay and contactor as ELECTROMAGNETICALLY OPERATED SWITCHES, from the electromagnetism side. Batch 06 has no relay PRINCIPLE requirement of its own; the relay appears here only inside the schematic-symbol recognition requirement (EDA-LP-16) and inside the held heating transistor/relay topology (EDA-LP-21). No relay principle content is duplicated in this batch.
- **Batch 06** -- Rectification and the diode: `NO_OVERLAP_WITH_FROZEN_BATCHES`
  - Neither Batch 01, 02 nor 03 contains diode, rectifier or semiconductor content. EDA-LP-04 and EDA-LP-14 introduce this material for the first time in the qualification, and nothing is duplicated from an accepted inventory.

## 12. Likely false-green risks

### [RESOLVED_BUT_INSTRUCTIVE] Batch 04

Batch 04 was originally recorded as 57/57 VERIFIED. The internal adversarial audit found that this was not earned and downgraded 8 results. Two `retrievedPassage` fields contained text that does NOT appear on the cited page (confirmed by re-fetching both pages): SRC-ETW-POWERTRIANGLE on the power and power-factor DISTINCTION results, and SRC-ETW-ACINDUCTORS on the inductance DISTINCTION result. One taught claim (temperature intervals must use K) was factually WRONG and was contradicted by its own quoted NIST passage.

*A 100%-VERIFIED batch across heterogeneous evidence should be treated as a warning sign rather than an achievement. Batches 05 and 06 were assembled with mechanical authority-class enforcement and mechanically-derived learning-point readiness specifically so this class of defect cannot recur silently.*

### [OPEN] Batch 04

The `electronics-tutorials.ws` authority classification is load-bearing for 22 of Batch 04's 57 results, and 16 of those have no non-ETW candidate source at all. `SYMBOL_OR_CONVENTION` requirements exclude AUTHORITATIVE_EDUCATIONAL_REFERENCE, so reclassifying the site as educational -- the class this same batch assigned to LibreTexts on comparable reasoning -- would fail roughly ten symbol-convention requirements at their authority gate simultaneously.

**Disposition in this run:** Deliberately NOT resolved. Resolving it means fresh acquisition, not correction. This is the single largest open false-green risk in the package.

### [OPEN] Batch 04

Batch 04's power-factor dimensionlessness guardrail now rests on a disclosed INFERENCE from the source's own P/S = W/VA identity, not on an explicit authoritative statement, because the passage that appeared to state it was fabricated.

**Disposition in this run:** Recorded honestly as PARTIAL. An in-terms source (IEC 60050 / IEEE) should be acquired before this is treated as settled.

### [OPEN] Batch 05

Batch 05's `fleming-right-hand-generator-rule` has its ROLE and USE CONDITIONS evidenced, but NO in-class source states the thumb/finger DIRECTIONAL MAPPING in text -- the one in-class locator is an unrendered diagram. The mapping written into EMI-LP-16 must not be treated as evidenced.

**Disposition in this run:** Marked PARTIAL, learning point HELD, and the limitation stated in the learning point's own readiness note.

### [OPEN] Batch 05

Batch 05's `right-hand-grip-rule` directional mapping rests on a SINGLE in-class source, a science-equipment vendor's teaching page, with no in-class corroboration. The clearest statements found -- including the warning that electron-flow convention requires the LEFT hand -- are all outside the permitted classes.

**Disposition in this run:** Marked PARTIAL, learning point HELD.

### [OPEN] Batch 06

Batch 06's schematic-symbol evidence traces entirely to the 1975 ANSI Y32.2 / CSA Z99 / IEEE Std 315 standard, read from a third-party university-hosted scan. NOTHING is verified against current BS EN 60617, which is what a UK qualification would be expected to follow. Coverage is 13 of 15 families, with NO LED symbol and NO distinct inverter symbol.

**Disposition in this run:** Marked PARTIAL, EDA-LP-16 HELD, and the LED entry deliberately left ABSENT from the taught content rather than filled in from memory.

### [OPEN] Batch 06

Batch 06's master-socket component FUNCTIONS are unevidenced. Openreach establishes that the 1.8 uF capacitor and 470 kohm resistor are present, their values and their connection, but NOT that the capacitor passes ringing current to the ringer or that the resistor serves line testing. Both attributions are widely repeated and would be easy to assert.

**Disposition in this run:** Both excluded from taught content in EDA-LP-28 and named explicitly as not-evidenced.

### [STRUCTURAL] Batch 05 and 06

Neither new batch contains a single PRIMARY_NORMATIVE_OR_STANDARDS_BODY source. IEC Electropedia returned HTTP 403 on every attempt across both batches; the IEC 60617/60050 databases, IEC 60062, BS EN 50131 (BSI paywall) and Britannica were all unreachable. Every definitional claim in both batches rests on academic, educational, technical-reference or manufacturer sources.

**Disposition in this run:** Logged per-candidate in each batch's ACQUISITION-LOG. This is a systemic constraint on the whole acquisition, not a per-requirement failure.

## 13. Prerequisite and sequencing findings

- All prerequisite graphs are acyclic and all within-batch references resolve, verified deterministically for every batch.
- Batch 04's EQCT-LP-06 (Energy) deliberately omits a prerequisite on EQCT-LP-05 (Power) to avoid a cycle, while teaching 'energy = power x time'. The internal audit flagged this as choosing graph shape over pedagogy; the suggested fix (attach the frozen EFS-LP-17 as a cross-domain prerequisite instead) was NOT applied, because it restructures an inventory awaiting review.
- Batch 05 and Batch 06 cross-domain prerequisites reference ONLY the accepted, frozen Batch 01 and Batch 02 inventories. No prerequisite anywhere points at an unfrozen EQCT-LP-*, EMI-LP-* or EDA-LP-* identity across batch boundaries.
- Batch 05 sequences the three directional rules deliberately: EMI-LP-05 (grip rule) before EMI-LP-13 (Fleming left/motor) before EMI-LP-16 (Fleming right/generator), with EMI-LP-16 prerequisite on EMI-LP-13 so the left/right contrast is available at the point of maximum confusion risk.
- Batch 06 sequences the thyristor family SCR -> TRIAC -> DIAC, because each device's evidenced definition is expressed in terms of the previous one.

## 14. Early-stage depth findings

- No learning point in Batches 05 or 06 was found to overshoot early Level-2 depth. Excluded consistently: Maxwell's equations, vector calculus, advanced phasors, Faraday's law as a quantitative formula, Lenz's law, detailed winding design, three-phase generation, semiconductor physics, bias design, PWM/VFD/field-oriented control, and radio engineering.
- Both new batches carry scope qualifications as TAUGHT CONTENT rather than as hidden caveats, where the qualification is what prevents a wrong belief: F = BIl as the perpendicular case, e = Blv with its perpendicularity conditions, B = phi/A scoped to the uniform normal-field case, 0.707/1.414 restricted to pure sine waves, a rectifier giving pulsating rather than smooth DC, PTC thermistor behaviour only above the Curie point, and photodiode behaviour depending on operating mode.
- Batch 04's internal audit found its exclusions thorough and its depth appropriate, with EQCT-LP-07's scoping to displacement power factor singled out as genuinely good work. The depth problems found in Batch 04 were evidential, not level-related.

## 15. Matters requiring human Product Architect judgment

### PA-01 [HIGHEST] -- Frozen-plan specification ambiguity on exact circuits (Batch 06)

Four requirements demand an EXACT circuit topology or exact component values but name no circuit, figure or source document: dimmer-exact-rc-timing-implementation-component-values, heating-exact-transistor-relay-topology, security-alarm-exact-nc-contact-bias-topology (a GAP), and by propagation security-alarm-scr-thyristor-latching-sounder-role and security-alarm-transistor-switching. No further research can resolve this -- the requirement does not identify its own subject. Decide: supply the specific course circuit, rewrite the requirements in general-behaviour terms, or descope. The dimmer and heating ones are OPTIONAL_CONTEXT priority in the frozen plan, so descoping is legitimate.

### PA-02 [HIGHEST] -- electronics-tutorials.ws authority classification (Batch 04)

Load-bearing for 22 of 57 Batch 04 results; 16 have no other source. Either re-argue the AUTHORITATIVE_TECHNICAL_REFERENCE classification explicitly, or re-source the affected results. Note that SRC-BIPM-BROCHURE -- already registered, already read, its locator already listing 'electric resistance-ohm' -- would resolve the sharpest instance (resistance UNIT_SYMBOL) immediately.

### PA-03 [HIGH] -- Frozen-plan authority classes versus reality (Batch 05)

Several Batch 05 requirements exclude ACADEMIC_OR_RESEARCH_INSTITUTION, which is precisely where the clearest evidence lives (MIT OCW, OpenStax, HyperPhysics, university LibreTexts). This produced one outright GAP (dot-cross-page-convention) on content that is not in dispute, plus PARTIALs on the grip rule and field patterns. Decide whether to acquire in-class sources or revisit those requirements' permitted classes at plan level. NO frozen requirement was widened during this run.

### PA-04 [HIGH] -- The Batch 04 EFS-LP-05/EFS-LP-06 representation gap

Eight Batch 04 requirements are satisfied by the accepted, frozen Batch 02 learning points EFS-LP-05 and EFS-LP-06 rather than by any new EQCT-LP identity. The artifact schema has NO structured field for 'this requirement is satisfied by a prior batch's learning point', so the relationship exists only as prose in the overlap audit plus a coverage-matrix row. This pack's coverage map reconstructs it from the overlapAudit block. Consider adding a `satisfiedByExistingLearningPointId` field. Additional audit observation: EFS-LP-05 conveys resistance's quantity symbol R only IMPLICITLY, inside the formula R = V/I; it never states 'the quantity symbol for resistance is R'. Coverage of the QUANTITY_SYMBOL facet is therefore thin, though defensible.

### PA-05 [HIGH] -- Pole pairs versus total poles (Batch 05)

The frozen requirements are written in the POLE-PAIR convention (f = N x P). Only one retrieved source uses pole pairs, and it states the relationship in angular-frequency form. Both sources giving it in Hz-and-rpm terms use TOTAL POLES (f = P/2 x N/60; n_s = 120f/P). The two conventions differ by a FACTOR OF TWO. EMI-LP-22 records the conflict as explicit taught content rather than harmonising it, but the qualification must choose.

### PA-06 [MEDIUM] -- Recognition material is not fit for learner-facing publication

Batch 05's in-class pole and field-pattern figures are 1895-1917 handbook illustrations (Avery, Atkinson, Hawkins) reproduced by the University of South Florida's ClipArt ETC -- the physics is not time-sensitive but the register may not suit learners. Batch 06 retrieved NO photographs at all for physical-appearance recognition, and only 4 of 15 component families have any appearance evidence. Commissioned or licensed visual material is likely required for both.

### PA-07 [MEDIUM] -- Symbol standard currency (Batch 06)

All symbol evidence is the 1975 ANSI/CSA/IEEE standard, not current BS EN 60617, and covers 13 of 15 families with no LED and no distinct inverter symbol. Decide whether BS EN 60617 must be procured before EDA-LP-16 can be published.

### PA-08 [MEDIUM] -- Legacy PSTN scope and lifespan (Batch 06)

Six requirements concern the UK legacy analogue PSTN, which BT plans to retire by 31 January 2027. Confirm the topic should remain in scope. Also resolve the terminology mismatch (the requirement says 'secondary socket'; Openreach says only 'extension socket'), the currency conflict on the surge arrester, and note the contact-versus-IDC numbering hazard, where the same shunt/bell connection is IDC 3 but master-socket contact 4.

### PA-09 [MEDIUM] -- No normative sources anywhere in Batches 05 and 06

IEC Electropedia returned 403 on every attempt throughout both batches; IEC 60617/60050/60062, BS EN 50131 and Britannica were all unreachable. If the qualification requires normative grounding for definitions, symbols or the resistor colour code, institutional access to IEC and BSI is a prerequisite for further work.

### PA-10 [MEDIUM] -- Third-party mirrors

Several Batch 06 manufacturer application notes (Littelfuse AN1001/1002/1003, ST AN392, onsemi HB214/D) were read from third-party university-hosted mirrors after the publishers returned 403/429. Each self-identifies via front matter and page footers and each source record discloses the host, but these should be re-verified against publisher originals before publication.

### PA-11 [LOW] -- Cross-batch learning-point relationships that could not be encoded

Batches 04, 05 and 06 are all PROPOSED and unfrozen, so genuine relationships between them were deliberately NOT encoded as prerequisites -- encoding a dependency on an unfrozen identity would create exactly the coupling the freeze discipline prevents. They are disclosed in each batch's overlapAudit instead: EMI-LP-18 (frequency of the AC waveform) versus EQCT-LP-08 (frequency the quantity); EDA-LP-03 (the capacitor) versus EQCT-LP-09 (capacitance the quantity); and EDA-LP-21 (held heating relay topology) versus EMI-LP-08 (the relay principle). Once identities are settled, decide which should become real prerequisites.

### PA-12 [LOW] -- Granularity consistency across batches

Batch 04's EQCT-LP-01 bundles eight SI-unit facts into one learning point on the grounds that they are 'one homogeneous recall skill', while five other Batch 04 points each cover a single quantity's meaning/symbol/unit. That inconsistency was noted in the internal audit but NOT corrected, because changing it restructures an inventory that is about to be reviewed. Batches 05 and 06 apply a consistent rule: combine only where the requirements form one interlocking account, split where the failure modes are separately diagnosable.

## 16. Recommended consolidated review order

**1. PA-01 and PA-03 -- the two frozen-plan problems**

These are plan-level decisions, not artifact decisions. Both the Batch 06 exact-circuit ambiguity and the Batch 05 authority-class exclusions produce gaps that no further acquisition can close. Everything downstream depends on how they are resolved, so they should be settled first.

**2. PA-02 -- the electronics-tutorials.ws classification**

The single largest open false-green risk. It determines whether roughly ten Batch 04 symbol-convention results stand or fall, so Batch 04 cannot be sensibly accepted before it is decided.

**3. Batch 04 corrections review**

Verify that the eight downgrades, the corrected temperature claim, and the attribution/qualification fixes are the right calls, and that nothing further in Batch 04 is resting on fabricated or misattributed evidence. Batch 04 has the weakest evidential provenance of the three unfrozen batches and was the only one where fabricated passages were found.

**4. Batch 05 evidence and learning points**

Structurally the cleanest of the three: zero mechanical defects, and its shortfalls are almost entirely authority-tier rather than content. Review is mainly a matter of confirming the PA-03 and PA-05 decisions and the historical-figure provenance question (PA-06).

**5. Batch 06 evidence and learning points**

Largest and most heterogeneous. Once PA-01 is settled, the remaining questions are the symbol-standard currency (PA-07), the missing photographic material (PA-06), and the legacy PSTN scope (PA-08).

**6. Cross-batch consistency: PA-04, PA-11, PA-12**

The representation gap, the unencoded cross-batch relationships, and granularity consistency are only decidable once the individual inventories are settled, because each depends on which identities survive review.

**7. Identity freeze decisions for EQCT-LP-*, EMI-LP-* and EDA-LP-***

Freeze last. Until the above are resolved, learning-point identities may still need to be added, merged or withdrawn, and the freeze discipline used for Batches 01-03 requires that identities be stable before they are locked.

## 17. What this pack does NOT claim

- This pack does NOT claim that all 213 requirements are verified. The generated evidence results show 180 VERIFIED, 31 PARTIAL and 2 GAP, computed by reading the actual artifacts.
- This pack does NOT claim Unit 202 is accepted, complete for lesson production, or identity-frozen.
- Batches 04, 05 and 06 are PROPOSED_FOR_PA_REVIEW and unfrozen. No internal audit performed during this run confers Product Architect approval; an internal audit is a progression gate only.
- No authorisation for lesson production, assessment generation, illustration production or application implementation exists or is implied.
