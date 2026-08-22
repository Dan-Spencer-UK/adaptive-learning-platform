# CC-04B Unit 202 proving-slice corpus review

Generated deterministically by `scripts/content/generate-corpus-review.ts` from
`scripts/content/data/cc04-unit202-electrical-science.ts` -- the same manifest
`scripts/content/generate-seed.ts` compiles to SQL. Development/review evidence
only, never rendered to learners. Regenerate with:
`node scripts/content/generate-corpus-review.ts`.

Total assertions: 258
- Foundational Maths (FM): 26
- Foundational Physics (FP): 44
- Electrical (EL): 188

The Electrical count is the CC-04B Product-Owner-approved target (140-160, ~150). Foundational Maths/Physics are additional reusable horizontal knowledge and do not count toward that target.

## Electrical coverage per Assessment Criterion

| Assessment Criterion | Mapped Electrical assertions |
|---|---|
| Calculate the values of current, voltage and resistance in parallel and series D.C. circuits | 28 |
| Calculate values of mechanical energy, power and efficiency | 2 |
| Calculate values of power in parallel and series D.C. circuits | 28 |
| Characteristics of a sine-wave: Amplitude | 1 |
| Characteristics of a sine-wave: Average value | 1 |
| Characteristics of a sine-wave: Frequency | 2 |
| Characteristics of a sine-wave: Peak to peak value | 1 |
| Characteristics of a sine-wave: Periodic time | 1 |
| Characteristics of a sine-wave: Root Mean Square (RMS) value | 1 |
| Describe the basic principles of electron theory | 8 |
| Describe the basic principles of generating an A.C. supply in terms of: a single-loop generator, sine-wave, frequency, EMF, magnetic flux | 8 |
| Describe the basic principles of generating an A.C. supply | 8 |
| Describe the chemical and thermal effects of electric currents | 16 |
| Describe the effects of magnetism in terms of attraction and repulsion | 2 |
| Describe the function and application of electronic components that are used in electrical systems | 8 |
| Describe the magnetic effects of electrical currents in terms of: production of a magnetic field, force on a current-carrying conductor in a magnetic field, electromagnetism, electromotive force | 12 |
| Describe the magnetic effects of electrical currents | 12 |
| Describe the main principles of force, work, energy, power and efficiency and their inter-relationships | 1 |
| Describe the main principles of the following and their inter-relationships: force, work, energy (kinetic and potential), power, efficiency | 1 |
| Describe what is meant by resistance and resistivity in relation to electrical circuits | 14 |
| Electrical quantities (SI units): Capacitance and capacitive reactance | 3 |
| Electrical quantities (SI units): Current | 1 |
| Electrical quantities (SI units): Energy | 1 |
| Electrical quantities (SI units): Frequency | 2 |
| Electrical quantities (SI units): Impedance | 2 |
| Electrical quantities (SI units): Inductance and inductive reactance | 3 |
| Electrical quantities (SI units): Power factor | 1 |
| Electrical quantities (SI units): Power | 1 |
| Electrical quantities (SI units): Resistance | 2 |
| Electrical quantities (SI units): Resistivity | 1 |
| Electrical quantities (SI units): Voltage | 1 |
| Electrical quantities (measurement): Current | 1 |
| Electrical quantities (measurement): Energy | 1 |
| Electrical quantities (measurement): Power | 1 |
| Electrical quantities (measurement): Resistance | 1 |
| Electrical quantities (measurement): Voltage | 1 |
| Electrical systems: Dimmer switches | 1 |
| Electrical systems: Heating/boiler controls | 1 |
| Electrical systems: Motor control | 1 |
| Electrical systems: Security alarms | 2 |
| Electrical systems: Telephones | 2 |
| Electrical systems: Wireless control systems | 1 |
| Electronic components and devices: Capacitors | 3 |
| Electronic components and devices: Diacs | 1 |
| Electronic components and devices: Diodes | 1 |
| Electronic components and devices: Invertors | 1 |
| Electronic components and devices: LED | 1 |
| Electronic components and devices: Photo | 1 |
| Electronic components and devices: Rectifiers | 3 |
| Electronic components and devices: Resistors | 2 |
| Electronic components and devices: Thermistors | 2 |
| Electronic components and devices: Thyristors | 1 |
| Electronic components and devices: Transistors | 1 |
| Electronic components and devices: Triacs | 1 |
| Electronic components and devices: Zener | 1 |
| Explain the relationship between current, voltage and resistance in parallel and series D.C. circuits | 60 |
| Identify and apply appropriate mathematical principles which are relevant to electrical work tasks | 32 |
| Identify and determine values of base and derived SI units which apply specifically to electrical quantities | 62 |
| Identify and distinguish between materials which are good conductors and insulators | 8 |
| Identify and use internationally recognised base and derived (SI) units of measurement | 6 |
| Identify appropriate electrical instruments for the measurement of different electrical quantities | 20 |
| Identify the characteristics of sine-waves | 22 |
| State the basic operating principles of electronic components and devices | 17 |
| State the difference between magnetic flux and flux density | 8 |
| State what is meant by the term voltage drop in relation to electrical circuits | 4 |

## Foundational Maths/Physics: used vs currently-unused-but-retained

23 of 70 Foundational assertions currently reach an Electrical target via PREREQUISITE_OF; the remainder are retained as coherent, atomic, properly-sourced, non-speculative reusable horizontal knowledge for future Unit 202 expansion, other electrical qualifications, or other vocational verticals -- per explicit Product Owner direction, this is not treated as a defect.

**Currently used (23):** FM-ALG-EQUALITY-ADD-001, FM-ALG-EQUALITY-MULT-001, FM-ALG-INVERSE-OPS-ADD-001, FM-ALG-INVERSE-OPS-MULT-001, FM-ALG-PROPORTION-DIRECT-001, FM-ALG-PROPORTION-INVERSE-001, FM-ALG-SUBSTITUTION-001, FM-ALG-TRANSPOSE-ADD-001, FM-ALG-TRANSPOSE-MULT-001, FM-ARITH-FRACTION-OPS-001, FM-ARITH-PERCENTAGE-001, FM-ARITH-RECIPROCAL-001, FM-ARITH-RECIPROCAL-INVERT-001, FM-ARITH-RECIPROCAL-SUM-001, FM-NUM-SI-PREFIX-001, FM-NUM-SI-PREFIX-CONVERT-001, FM-NUM-STANDARD-FORM-001, FP-CONCEPT-EFFICIENCY-001, FP-CONCEPT-ENERGY-001, FP-CONCEPT-ENERGY-CONSERVATION-001, FP-CONCEPT-FORCE-001, FP-CONCEPT-POWER-001, FP-CONCEPT-WORK-001

**Currently unused but retained (47):** FM-CALC-PYTHAGORAS-001, FM-CALC-TRIG-RATIO-001, FM-GEOM-PYTHAGORAS-001, FM-GEOM-TRIG-RATIOS-001, FM-NUM-INDICES-LAWS-001, FM-STATS-MEAN-001, FM-STATS-MEDIAN-001, FM-STATS-MODE-001, FM-STATS-RANGE-001, FP-CALC-EFFICIENCY-001, FP-CALC-KINETIC-ENERGY-001, FP-CALC-POTENTIAL-ENERGY-001, FP-CALC-POWER-001, FP-CALC-WEIGHT-001, FP-CALC-WORK-001, FP-CONCEPT-GEAR-001, FP-CONCEPT-KINETIC-ENERGY-001, FP-CONCEPT-LEVER-PRINCIPLE-001, FP-CONCEPT-MASS-001, FP-CONCEPT-MECHANICAL-ADVANTAGE-001, FP-CONCEPT-POTENTIAL-ENERGY-001, FP-CONCEPT-PULLEY-001, FP-CONCEPT-WEIGHT-001, FP-GEAR-DIRECTION-REVERSAL-001, FP-GEAR-IDLER-001, FP-GEAR-SPEED-TORQUE-TRADEOFF-001, FP-LEVER-CLASS-I-001, FP-LEVER-CLASS-II-001, FP-LEVER-CLASS-III-001, FP-PULLEY-FIXED-VS-MOVABLE-001, FP-REL-GEAR-RATIO-001, FP-REL-KINETIC-ENERGY-001, FP-REL-LEVER-BALANCE-001, FP-REL-POTENTIAL-ENERGY-001, FP-REL-POWER-WORK-TIME-001, FP-REL-PULLEY-FORCE-DISTANCE-TRADEOFF-001, FP-REL-PULLEY-MECHANICAL-ADVANTAGE-001, FP-REL-WEIGHT-MASS-001, FP-REL-WORK-FORCE-DISTANCE-001, FP-UNIT-CUBIC-METRE-001, FP-UNIT-DENSITY-001, FP-UNIT-KELVIN-CELSIUS-001, FP-UNIT-KILOGRAM-001, FP-UNIT-METRE-001, FP-UNIT-METRE-PER-SECOND-001, FP-UNIT-SECOND-001, FP-UNIT-SQUARE-METRE-001

## Provenance source / rights distribution

Verification columns per ADR-0002 -- Verified/By/Fingerprint reflect the governed `sourceVersion` record mechanically, never hand-typed here. UNVERIFIED means exactly that: identifiable and usable as an authoring source, but not yet independently confirmed against the actual artefact by a verifier distinct from the authoring model.

Source role (CC-09C) reflects the generic Course Evidence Registry evidential-role classification -- see @alp/content-schema's sourceRoleSchema. (unclassified) means this source has not been narrowly, defensibly classified, never that it is assumed factual or curriculum-authority by default.

| Source | Source role | Rights classification | Verification | Verified by | Fingerprint |
|---|---|---|---|---|---|
| City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook | NORMATIVE_CURRICULUM | PROPRIETARY_REFERENCE | VERIFIED | project-architect | present |
| The International System of Units (SI Brochure) | (unclassified) | OPEN | UNVERIFIED | (none) | absent |
| Mathematics GCSE subject content and assessment objectives | (unclassified) | OFFICIAL_OGL | UNVERIFIED | (none) | absent |
| University Physics Volume 1 | (unclassified) | PUBLIC_RESTRICTED | UNVERIFIED | (none) | absent |
| University Physics Volume 2 | (unclassified) | PUBLIC_RESTRICTED | UNVERIFIED | (none) | absent |
| University Physics Volume 3 | (unclassified) | PUBLIC_RESTRICTED | UNVERIFIED | (none) | absent |
| Electric Circuits III - Semiconductors (Kuphaldt) | (unclassified) | OPEN | UNVERIFIED | (none) | absent |
| NTC Thermistors Application Note | (unclassified) | PROPRIETARY_REFERENCE | UNVERIFIED | (none) | present |
| ELG4139: DC to AC Converters (course material) | (unclassified) | PROPRIETARY_REFERENCE | UNVERIFIED | (none) | present |
| 800 VA Pure Sine Wave Inverter Reference Design (SLAA602A) | (unclassified) | PROPRIETARY_REFERENCE | UNVERIFIED | (none) | present |
| College Physics 2e | (unclassified) | PUBLIC_RESTRICTED | UNVERIFIED | (none) | absent |
| Electric Circuits I - Direct Current (Kuphaldt) | (unclassified) | OPEN | UNVERIFIED | (none) | absent |
| NIST Handbook 44: Specifications, Tolerances, and Other Technical Requirements for Weighing and Measuring Devices -- Section 3.41, Non-Utility Electricity-Measuring Systems (Tentative Code) | (unclassified) | OPEN | UNVERIFIED | (none) | present |
| NIST/SEMATECH e-Handbook of Statistical Methods -- 1.3.5 Measures of Location and Scale | (unclassified) | OPEN | UNVERIFIED | (none) | absent |
| Dynamometer Type Wattmeter | (unclassified) | PROPRIETARY_REFERENCE | UNVERIFIED | (none) | present |
| Machine Design: Gear Ratios | (unclassified) | PROPRIETARY_REFERENCE | UNVERIFIED | (none) | absent |
| ENFORCER E-931-S33PRGQ 33ft Polarized Reflective Photoelectric Beam Sensor -- Installation Manual | (unclassified) | PROPRIETARY_REFERENCE | UNVERIFIED | (none) | present |
| AN347: DAA Design Guide | (unclassified) | PROPRIETARY_REFERENCE | UNVERIFIED | (none) | present |
| HT12D/HT12F 2^12 Series of Decoders | (unclassified) | PROPRIETARY_REFERENCE | UNVERIFIED | (none) | present |
| Chemistry 2e | (unclassified) | PUBLIC_RESTRICTED | UNVERIFIED | (none) | absent |
| The ABCs of Clamp Meters | (unclassified) | PROPRIETARY_REFERENCE | UNVERIFIED | (none) | absent |
| 6242Y PVC Flat Wiring Cable with Bare CPC (BS 6004, 300/500V) -- Datasheet | (unclassified) | PROPRIETARY_REFERENCE | UNVERIFIED | (none) | present |
| PTCEL Series -- PTC Thermistors, Inrush Current Limiter -- Datasheet | (unclassified) | PROPRIETARY_REFERENCE | UNVERIFIED | (none) | absent |
| Gear Train Mechanism Explained: How It Works, Diagram, Formula and Calculator | (unclassified) | PROPRIETARY_REFERENCE | UNVERIFIED | (none) | absent |
| British telephone sockets | (unclassified) | OPEN | UNVERIFIED | (none) | absent |
| Thyristor Based Sensor Alarm System, Working and Applications | (unclassified) | PROPRIETARY_REFERENCE | UNVERIFIED | (none) | absent |
| Fleming's left-hand rule for motors | (unclassified) | OPEN | UNVERIFIED | (none) | absent |
| Fleming's right-hand rule | (unclassified) | OPEN | UNVERIFIED | (none) | absent |
| 5357-003 Electrical Scientific Principles and Technologies / 2365-602 Principles of Electrical Science -- Sample e-volve MC Test (question paper) | OFFICIAL_ASSESSMENT | PROPRIETARY_REFERENCE | UNVERIFIED | (none) | present |
| 5357-003 Electrical Scientific Principles and Technologies / 2365-602 Principles of Electrical Science -- Sample e-volve MC Test (mark scheme / answer keys) | OFFICIAL_ASSESSMENT | PROPRIETARY_REFERENCE | UNVERIFIED | (none) | present |

Rights distribution: PROPRIETARY_REFERENCE: 18, OPEN: 8, OFFICIAL_OGL: 1, PUBLIC_RESTRICTED: 5

## OpenStax exact-book licence evidence (CC-04B hard requirement)

Re-verified directly from each book's own copyright page (not assumed from a generic OpenStax licensing page, a search summary, or the other volume):

| Book | Edition/date | Licence (verbatim, on-page) | Commercial use | ShareAlike | Attribution | Final classification |
|---|---|---|---|---|---|---|
| University Physics Volume 1 (Moebs/Ling/Sanny) | 1st edition, 19 Sept 2016 | "This book uses the Creative Commons Attribution-NonCommercial-ShareAlike License" (licence URL http://creativecommons.org/licenses/by-nc-sa/4.0/ confirmed on-page) | No (NonCommercial) | Yes | Yes | PUBLIC_RESTRICTED |
| University Physics Volume 2 (OpenStax/Rice University) | 1st edition, 6 Oct 2016 | "Creative Commons Attribution-NonCommercial-ShareAlike License" (CC BY-NC-SA 4.0), independently re-confirmed on a second fetch | No (NonCommercial) | Yes | Yes | PUBLIC_RESTRICTED |

## Graph health

- Total relationships: 392
  - CONTRASTS_WITH: 17
  - DERIVED_FROM: 36
  - PREREQUISITE_OF: 329
  - SUPPORTS: 10
- Misconceptions: 21; conflict links: 45
- Curriculum mappings: 504
- Self edges, duplicate edges, unintended prerequisite cycles, broken relationship targets, unmapped Electrical assertions and approved-versions-without-provenance: all mechanically proven 0 -- see supabase/tests/database/10_unit202_knowledge_graph.sql and the CC-04B completion report for the live query evidence.

## Foundational Maths (FM)

### FM-ALG-INVERSE-OPS-MULT-001

**Statement (v1, APPROVED):** Multiplication and division are inverse operations: dividing by a non-zero number undoes multiplying by that number, and vice versa.

**Direct prerequisites:** (none — root assertion)
**Direct dependents:** FM-ALG-TRANSPOSE-MULT-001
**Curriculum mapping(s):** Mathematical principles: Algebra (REQUIRED_FOR)
**Provenance:** Mathematics GCSE subject content and assessment objectives — Number: relationships between operations including inverse operations; conventional notation for priority of operations including brackets, powers, roots and reciprocals [DEFINES, support=DIRECT, verification=UNVERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED

### FM-ALG-INVERSE-OPS-ADD-001

**Statement (v1, APPROVED):** Addition and subtraction are inverse operations: subtracting a number undoes adding that number, and vice versa.

**Direct prerequisites:** (none — root assertion)
**Direct dependents:** FM-ALG-TRANSPOSE-ADD-001
**Curriculum mapping(s):** Mathematical principles: Algebra (REQUIRED_FOR)
**Provenance:** Mathematics GCSE subject content and assessment objectives — Number: relationships between operations including inverse operations; conventional notation for priority of operations including brackets, powers, roots and reciprocals [DEFINES, support=DIRECT, verification=UNVERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED

### FM-ALG-EQUALITY-MULT-001

**Statement (v1, APPROVED):** In an equation, multiplying or dividing both sides by the same non-zero value preserves the equality between the two sides.

**Direct prerequisites:** (none — root assertion)
**Direct dependents:** FM-ALG-TRANSPOSE-MULT-001
**Curriculum mapping(s):** Mathematical principles: Algebra (REQUIRED_FOR)
**Provenance:** Mathematics GCSE subject content and assessment objectives — Algebra: understand and use the concepts and vocabulary of expressions, equations, formulae, identities [DEFINES, support=DIRECT, verification=UNVERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED

### FM-ALG-EQUALITY-ADD-001

**Statement (v1, APPROVED):** In an equation, adding or subtracting the same value from both sides preserves the equality between the two sides.

**Direct prerequisites:** (none — root assertion)
**Direct dependents:** FM-ALG-TRANSPOSE-ADD-001
**Curriculum mapping(s):** Mathematical principles: Algebra (REQUIRED_FOR)
**Provenance:** Mathematics GCSE subject content and assessment objectives — Algebra: understand and use the concepts and vocabulary of expressions, equations, formulae, identities [DEFINES, support=DIRECT, verification=UNVERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED

### FM-ALG-TRANSPOSE-MULT-001

**Statement (v1, APPROVED):** Given a relationship of the form a = b times c, rearrange it algebraically to make b or c the subject.

**Direct prerequisites:** FM-ALG-INVERSE-OPS-MULT-001 (REQUIRED); FM-ALG-EQUALITY-MULT-001 (REQUIRED)
**Direct dependents:** FP-CALC-WEIGHT-001; EL-OHM-REARRANGE-001; EL-POWER-REARRANGE-001; EL-CURRENT-CHARGE-CALC-001; EL-ENERGY-REARRANGE-001
**Curriculum mapping(s):** Mathematical principles: Transposition (REQUIRED_FOR)
**Provenance:** Mathematics GCSE subject content and assessment objectives — Algebra: understand and use standard mathematical formulae; rearrange formulae to change the subject [SUPPORTS, support=DIRECT, verification=UNVERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED

### FM-ALG-TRANSPOSE-ADD-001

**Statement (v1, APPROVED):** Given a relationship of the form a = b + c, rearrange it algebraically to make b or c the subject.

**Direct prerequisites:** FM-ALG-INVERSE-OPS-ADD-001 (REQUIRED); FM-ALG-EQUALITY-ADD-001 (REQUIRED)
**Direct dependents:** EL-SERIES-VOLTAGE-001; EL-PARALLEL-CURRENT-001; EL-PARALLEL-RESISTANCE-CALC-001
**Curriculum mapping(s):** Mathematical principles: Transposition (REQUIRED_FOR)
**Provenance:** Mathematics GCSE subject content and assessment objectives — Algebra: understand and use standard mathematical formulae; rearrange formulae to change the subject [SUPPORTS, support=DIRECT, verification=UNVERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED

### FM-ALG-SUBSTITUTION-001

**Statement (v1, APPROVED):** Substitute known numerical values into a formula to calculate the value of the remaining unknown quantity.

**Direct prerequisites:** (none — root assertion)
**Direct dependents:** FM-CALC-PYTHAGORAS-001; FM-CALC-TRIG-RATIO-001; FP-CALC-WORK-001; FP-CALC-KINETIC-ENERGY-001; FP-CALC-POTENTIAL-ENERGY-001; FP-CALC-POWER-001; FP-CALC-WEIGHT-001; EL-CALC-ELECTRICAL-EFFICIENCY-001; EL-OHM-SOLVE-V-001; EL-OHM-SOLVE-I-001; EL-OHM-SOLVE-R-001; EL-SERIES-RESISTANCE-CALC-001; EL-POWER-SOLVE-001; EL-POWER-SOLVE-IR-001; EL-CURRENT-CHARGE-CALC-001; EL-POWER-SOLVE-V2R-001; EL-ENERGY-CALC-001; EL-WAVEFORM-RMS-CALC-001; EL-WAVEFORM-FREQUENCY-CALC-001
**Curriculum mapping(s):** Mathematical principles: Transposition (SUPPORTS)
**Provenance:** Mathematics GCSE subject content and assessment objectives — Algebra: substitute numerical values into formulae and expressions, including scientific formulae [SUPPORTS, support=DIRECT, verification=UNVERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED

### FM-ARITH-RECIPROCAL-001

**Statement (v1, APPROVED):** The reciprocal of a non-zero number is 1 divided by that number.

**Direct prerequisites:** (none — root assertion)
**Direct dependents:** FM-ARITH-RECIPROCAL-SUM-001; FM-ARITH-RECIPROCAL-INVERT-001; EL-PARALLEL-RESISTANCE-001; EL-WAVEFORM-FREQUENCY-PERIOD-RELATIONSHIP-001
**Provenance:** Mathematics GCSE subject content and assessment objectives — Number: relationships between operations including inverse operations; conventional notation for priority of operations including brackets, powers, roots and reciprocals [DEFINES, support=DIRECT, verification=UNVERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE

### FM-ARITH-FRACTION-OPS-001

**Statement (v1, APPROVED):** Apply the four arithmetic operations (addition, subtraction, multiplication, division) to fractions, including proper and improper fractions.

**Direct prerequisites:** (none — root assertion)
**Direct dependents:** FM-ARITH-RECIPROCAL-SUM-001
**Curriculum mapping(s):** Mathematical principles: Fractions and percentages (REQUIRED_FOR)
**Provenance:** Mathematics GCSE subject content and assessment objectives — Number: apply the four operations, including formal written methods, to integers, decimals and simple fractions (proper and improper), and mixed numbers [DEFINES, support=DIRECT, verification=UNVERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED

### FM-ARITH-RECIPROCAL-SUM-001

**Statement (v1, APPROVED):** When a governed relationship has the form 1/T = 1/a + 1/b + ... , the total T is found by summing the reciprocals of each individual contribution (1/a, 1/b, ...) to give 1/T.

**Direct prerequisites:** FM-ARITH-RECIPROCAL-001 (REQUIRED); FM-ARITH-FRACTION-OPS-001 (STRONG)
**Direct dependents:** EL-PARALLEL-RESISTANCE-CALC-001
**Provenance:** University Physics Volume 2 — University Physics Volume 2, 10.2: equivalent resistance for resistors in series and in parallel [SUPPORTS, support=DIRECT, verification=UNVERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE

### FM-ARITH-RECIPROCAL-INVERT-001

**Statement (v1, APPROVED):** Once the reciprocal of a total quantity has been calculated, take its reciprocal again to find the value of the total quantity itself.

**Direct prerequisites:** FM-ARITH-RECIPROCAL-001 (REQUIRED)
**Direct dependents:** EL-PARALLEL-RESISTANCE-CALC-001
**Provenance:** University Physics Volume 2 — University Physics Volume 2, 10.2: equivalent resistance for resistors in series and in parallel [SUPPORTS, support=DIRECT, verification=UNVERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE

### FM-ARITH-PERCENTAGE-001

**Statement (v1, APPROVED):** A percentage expresses a quantity as a number of parts per hundred, and can be used to express one quantity as a proportion of another.

**Direct prerequisites:** (none — root assertion)
**Direct dependents:** FP-CONCEPT-EFFICIENCY-001; FP-CALC-EFFICIENCY-001; EL-CALC-ELECTRICAL-EFFICIENCY-001
**Curriculum mapping(s):** Mathematical principles: Fractions and percentages (REQUIRED_FOR)
**Provenance:** Mathematics GCSE subject content and assessment objectives — Ratio, proportion and rates of change: define percentage as 'number of parts per hundred'; interpret percentages and percentage changes [DEFINES, support=DIRECT, verification=UNVERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED

### FM-ALG-PROPORTION-DIRECT-001

**Statement (v1, APPROVED):** Two quantities are in direct proportion when one increases in the same ratio as the other.

**Direct prerequisites:** (none — root assertion)
**Direct dependents:** EL-OHM-PROPORTIONALITY-001; EL-RESISTIVITY-LENGTH-EFFECT-001; EL-SERIES-VOLTAGE-DIVIDER-001
**Provenance:** Mathematics GCSE subject content and assessment objectives — Ratio, proportion and rates of change: solve problems involving direct and inverse proportion; X inversely proportional to Y is equivalent to X proportional to 1/Y [DEFINES, support=DIRECT, verification=UNVERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Misconceptions targeting this assertion:** MIS-FM-PROPORTION-DIRECTION-CONFUSION-001

### FM-ALG-PROPORTION-INVERSE-001

**Statement (v1, APPROVED):** Two quantities are in inverse proportion when one increases in the same ratio as the other decreases.

**Direct prerequisites:** (none — root assertion)
**Direct dependents:** EL-OHM-PROPORTIONALITY-001; EL-RESISTIVITY-AREA-EFFECT-001; EL-PARALLEL-CURRENT-DIVIDER-001
**Provenance:** Mathematics GCSE subject content and assessment objectives — Ratio, proportion and rates of change: solve problems involving direct and inverse proportion; X inversely proportional to Y is equivalent to X proportional to 1/Y [DEFINES, support=DIRECT, verification=UNVERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Misconceptions targeting this assertion:** MIS-FM-PROPORTION-DIRECTION-CONFUSION-001

### FM-NUM-SI-PREFIX-001

**Statement (v1, APPROVED):** An SI prefix (such as milli-, kilo- or mega-) represents a fixed power-of-ten scale factor applied to a base or derived unit.

**Direct prerequisites:** (none — root assertion)
**Direct dependents:** FM-NUM-SI-PREFIX-CONVERT-001
**Provenance:** The International System of Units (SI Brochure) — SI Brochure: table of SI derived units with special names, including the volt, ohm, watt and joule, and SI prefixes [SUPPORTS, support=DIRECT, verification=UNVERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE

### FM-NUM-STANDARD-FORM-001

**Statement (v1, APPROVED):** A number can be expressed in standard form as A times 10 to the power n, where 1 <= A < 10 and n is an integer.

**Direct prerequisites:** (none — root assertion)
**Direct dependents:** FM-NUM-SI-PREFIX-CONVERT-001
**Provenance:** Mathematics GCSE subject content and assessment objectives — Number: calculate with and interpret standard form A x 10^n, where 1 <= A < 10 and n is an integer [DEFINES, support=DIRECT, verification=UNVERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE

### FM-NUM-SI-PREFIX-CONVERT-001

**Statement (v1, APPROVED):** Convert a numerical quantity from one SI-prefixed unit to another by applying the appropriate power-of-ten scale factor.

**Direct prerequisites:** FM-NUM-SI-PREFIX-001 (REQUIRED); FM-NUM-STANDARD-FORM-001 (STRONG)
**Direct dependents:** EL-OHM-SOLVE-V-001; EL-OHM-SOLVE-I-001; EL-OHM-SOLVE-R-001
**Provenance:** The International System of Units (SI Brochure) — SI Brochure: table of SI derived units with special names, including the volt, ohm, watt and joule, and SI prefixes [SUPPORTS, support=DIRECT, verification=UNVERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE

### FM-NUM-INDICES-LAWS-001

**Statement (v1, APPROVED):** When multiplying two powers of the same base, add the indices; when dividing, subtract the indices; a fractional index represents a root.

**Direct prerequisites:** (none — root assertion)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Mathematical principles: Indices (REQUIRED_FOR)
**Provenance:** Mathematics GCSE subject content and assessment objectives — Algebra: simplify and manipulate algebraic expressions... simplifying expressions involving sums, products and powers, including the laws of indices [DEFINES, support=PARTIAL, verification=UNVERIFIED] | Mathematics GCSE subject content and assessment objectives — Number: calculate with roots, and with integer and fractional indices [SUPPORTS, support=PARTIAL, verification=UNVERIFIED]
**Entailment result:** FULLY_SUPPORTED_MULTI_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED
**Clause coverage:** "multiplying/dividing powers of the same base adds/subtracts indices (laws of indices)" -> Mathematics GCSE subject content and assessment objectives (loc-dfe-algebra-indices); "a fractional index represents a root" -> Mathematics GCSE subject content and assessment objectives (loc-dfe-number-indices)

### FM-GEOM-PYTHAGORAS-001

**Statement (v1, APPROVED):** In a right-angled triangle, the square of the hypotenuse equals the sum of the squares of the other two sides: a squared plus b squared equals c squared.

**Direct prerequisites:** (none — root assertion)
**Direct dependents:** FM-GEOM-TRIG-RATIOS-001; FM-CALC-PYTHAGORAS-001
**Curriculum mapping(s):** Mathematical principles: Triangles and trigonometry (REQUIRED_FOR)
**Provenance:** Mathematics GCSE subject content and assessment objectives — Geometry and measures: know the formulae for Pythagoras' theorem a^2 + b^2 = c^2, and the trigonometric ratios sin(theta) = opposite/hypotenuse, cos(theta) = adjacent/hypotenuse and tan(theta) = opposite/adjacent; apply them to find angles and lengths in right-angled triangles [DEFINES, support=DIRECT, verification=UNVERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED

### FM-GEOM-TRIG-RATIOS-001

**Statement (v1, APPROVED):** In a right-angled triangle, the sine, cosine and tangent of an angle are defined as the ratios opposite/hypotenuse, adjacent/hypotenuse and opposite/adjacent respectively.

**Direct prerequisites:** FM-GEOM-PYTHAGORAS-001 (SUPPORTING)
**Direct dependents:** FM-CALC-TRIG-RATIO-001
**Curriculum mapping(s):** Mathematical principles: Triangles and trigonometry (REQUIRED_FOR)
**Provenance:** Mathematics GCSE subject content and assessment objectives — Geometry and measures: know the formulae for Pythagoras' theorem a^2 + b^2 = c^2, and the trigonometric ratios sin(theta) = opposite/hypotenuse, cos(theta) = adjacent/hypotenuse and tan(theta) = opposite/adjacent; apply them to find angles and lengths in right-angled triangles [DEFINES, support=DIRECT, verification=UNVERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED

### FM-CALC-PYTHAGORAS-001

**Statement (v1, APPROVED):** Use Pythagoras' theorem to calculate an unknown side length of a right-angled triangle, given the lengths of the other two sides.

**Direct prerequisites:** FM-GEOM-PYTHAGORAS-001 (REQUIRED); FM-ALG-SUBSTITUTION-001 (STRONG)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Mathematical principles: Triangles and trigonometry (REQUIRED_FOR)
**Provenance:** Mathematics GCSE subject content and assessment objectives — Geometry and measures: know the formulae for Pythagoras' theorem a^2 + b^2 = c^2, and the trigonometric ratios sin(theta) = opposite/hypotenuse, cos(theta) = adjacent/hypotenuse and tan(theta) = opposite/adjacent; apply them to find angles and lengths in right-angled triangles [SUPPORTS, support=DIRECT, verification=UNVERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED

### FM-CALC-TRIG-RATIO-001

**Statement (v1, APPROVED):** Use a trigonometric ratio (sine, cosine or tangent) to calculate an unknown side length or angle of a right-angled triangle, given sufficient other side lengths or angles.

**Direct prerequisites:** FM-GEOM-TRIG-RATIOS-001 (REQUIRED); FM-ALG-SUBSTITUTION-001 (STRONG)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Mathematical principles: Triangles and trigonometry (REQUIRED_FOR)
**Provenance:** Mathematics GCSE subject content and assessment objectives — Geometry and measures: know the formulae for Pythagoras' theorem a^2 + b^2 = c^2, and the trigonometric ratios sin(theta) = opposite/hypotenuse, cos(theta) = adjacent/hypotenuse and tan(theta) = opposite/adjacent; apply them to find angles and lengths in right-angled triangles [SUPPORTS, support=DIRECT, verification=UNVERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED

### FM-STATS-MEAN-001

**Statement (v1, APPROVED):** The mean of a set of numerical values is found by dividing their sum by the number of values, and is a measure of the central tendency of the data.

**Direct prerequisites:** (none — root assertion)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Mathematical principles: Statistics (REQUIRED_FOR)
**Provenance:** NIST/SEMATECH e-Handbook of Statistical Methods -- 1.3.5 Measures of Location and Scale — The mean is the sum of the data points divided by the number of data points. The median is the value of the point which has half the data smaller than it and half larger; for an odd number of values N it is the middle ordered value, for an even number of values N it is the mean of the two middle ordered values. The mode is the value that occurs with the greatest frequency, and is not necessarily unique. [DEFINES, support=DIRECT, verification=UNVERIFIED] | Mathematics GCSE subject content and assessment objectives — Statistics: interpret, analyse and compare distributions of data sets through appropriate measures of central tendency (median, mean, mode and modal class) and spread (range, including consideration of outliers, quartiles and inter-quartile range) [CURRICULUM_REQUIRES, support=DIRECT, verification=UNVERIFIED]
**Entailment result:** FULLY_SUPPORTED_MULTI_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED

### FM-STATS-RANGE-001

**Statement (v1, APPROVED):** The range of a set of numerical values is the difference between the largest and smallest values, and is a measure of the spread of the data.

**Direct prerequisites:** (none — root assertion)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Mathematical principles: Statistics (REQUIRED_FOR)
**Provenance:** NIST/SEMATECH e-Handbook of Statistical Methods -- 1.3.5 Measures of Location and Scale — The range is the largest value minus the smallest value in a data set -- a measure of spread based only on the two extreme values. [DEFINES, support=DIRECT, verification=UNVERIFIED] | Mathematics GCSE subject content and assessment objectives — Statistics: interpret, analyse and compare distributions of data sets through appropriate measures of central tendency (median, mean, mode and modal class) and spread (range, including consideration of outliers, quartiles and inter-quartile range) [CURRICULUM_REQUIRES, support=DIRECT, verification=UNVERIFIED]
**Entailment result:** FULLY_SUPPORTED_MULTI_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED

### FM-STATS-MEDIAN-001

**Statement (v1, APPROVED):** The median of a set of numerical values, arranged in numerical order, is the middle value if there is an odd number of values, or the mean (average) of the two middle values if there is an even number of values; it is a measure of the central tendency of the data.

**Direct prerequisites:** (none — root assertion)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Mathematical principles: Statistics (REQUIRED_FOR)
**Provenance:** NIST/SEMATECH e-Handbook of Statistical Methods -- 1.3.5 Measures of Location and Scale — The mean is the sum of the data points divided by the number of data points. The median is the value of the point which has half the data smaller than it and half larger; for an odd number of values N it is the middle ordered value, for an even number of values N it is the mean of the two middle ordered values. The mode is the value that occurs with the greatest frequency, and is not necessarily unique. [DEFINES, support=DIRECT, verification=UNVERIFIED] | Mathematics GCSE subject content and assessment objectives — Statistics: interpret, analyse and compare distributions of data sets through appropriate measures of central tendency (median, mean, mode and modal class) and spread (range, including consideration of outliers, quartiles and inter-quartile range) [CURRICULUM_REQUIRES, support=DIRECT, verification=UNVERIFIED]
**Entailment result:** FULLY_SUPPORTED_MULTI_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED

### FM-STATS-MODE-001

**Statement (v1, APPROVED):** The mode of a set of numerical values is the value that occurs most often; a data set can have more than one mode.

**Direct prerequisites:** (none — root assertion)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Mathematical principles: Statistics (REQUIRED_FOR)
**Provenance:** NIST/SEMATECH e-Handbook of Statistical Methods -- 1.3.5 Measures of Location and Scale — The mean is the sum of the data points divided by the number of data points. The median is the value of the point which has half the data smaller than it and half larger; for an odd number of values N it is the middle ordered value, for an even number of values N it is the mean of the two middle ordered values. The mode is the value that occurs with the greatest frequency, and is not necessarily unique. [DEFINES, support=DIRECT, verification=UNVERIFIED] | Mathematics GCSE subject content and assessment objectives — Statistics: interpret, analyse and compare distributions of data sets through appropriate measures of central tendency (median, mean, mode and modal class) and spread (range, including consideration of outliers, quartiles and inter-quartile range) [CURRICULUM_REQUIRES, support=DIRECT, verification=UNVERIFIED]
**Entailment result:** FULLY_SUPPORTED_MULTI_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED

## Foundational Physics (FP)

### FP-CONCEPT-FORCE-001

**Statement (v1, APPROVED):** A force is a push or a pull that can change the motion, shape or state of rest of an object.

**Direct prerequisites:** (none — root assertion)
**Direct dependents:** FP-CONCEPT-WORK-001; FP-CONCEPT-WEIGHT-001; FP-CONCEPT-MECHANICAL-ADVANTAGE-001; EL-CONCEPT-FORCE-ON-CONDUCTOR-001
**Curriculum mapping(s):** Describe the main principles of the following and their inter-relationships: force, work, energy (kinetic and potential), power, efficiency (REQUIRED_FOR)
**Provenance:** University Physics Volume 1 — University Physics Volume 1, Ch.7: work as a force causing displacement of its point of application; force and mass/weight [DEFINES, support=DIRECT, verification=UNVERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED

### FP-CONCEPT-WORK-001

**Statement (v1, APPROVED):** Work is done when a force causes its point of application to move through a distance in the direction of the force.

**Direct prerequisites:** FP-CONCEPT-FORCE-001 (STRONG)
**Direct dependents:** FP-REL-WORK-FORCE-DISTANCE-001; FP-CONCEPT-ENERGY-001; FP-CONCEPT-POWER-001
**Curriculum mapping(s):** Describe the main principles of the following and their inter-relationships: force, work, energy (kinetic and potential), power, efficiency (REQUIRED_FOR)
**Provenance:** University Physics Volume 1 — University Physics Volume 1, Ch.7: work as a force causing displacement of its point of application; force and mass/weight [DEFINES, support=DIRECT, verification=UNVERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED

### FP-REL-WORK-FORCE-DISTANCE-001

**Statement (v1, APPROVED):** Work done is calculated by multiplying the force applied by the distance moved in the direction of that force: W = F times d.

**Direct prerequisites:** FP-CONCEPT-WORK-001 (REQUIRED)
**Direct dependents:** FP-CALC-WORK-001
**Curriculum mapping(s):** Describe the main principles of the following and their inter-relationships: force, work, energy (kinetic and potential), power, efficiency (REQUIRED_FOR)
**Provenance:** University Physics Volume 1 — University Physics Volume 1, Ch.7: work as a force causing displacement of its point of application; force and mass/weight [SUPPORTS, support=DIRECT, verification=UNVERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED

### FP-CALC-WORK-001

**Statement (v1, APPROVED):** Calculate the work done by a force from its magnitude and the distance moved in its direction, using W = F times d.

**Direct prerequisites:** FP-REL-WORK-FORCE-DISTANCE-001 (REQUIRED); FM-ALG-SUBSTITUTION-001 (REQUIRED)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Calculate values of mechanical energy, power and efficiency (REQUIRED_FOR)
**Provenance:** University Physics Volume 1 — University Physics Volume 1, Ch.7: work as a force causing displacement of its point of application; force and mass/weight [SUPPORTS, support=DIRECT, verification=UNVERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED

### FP-CONCEPT-ENERGY-001

**Statement (v1, APPROVED):** Energy is the capacity to do work, and exists in different forms including kinetic energy (due to motion) and potential energy (due to position or state).

**Direct prerequisites:** FP-CONCEPT-WORK-001 (STRONG)
**Direct dependents:** FP-CONCEPT-ENERGY-CONSERVATION-001; FP-CONCEPT-KINETIC-ENERGY-001; FP-CONCEPT-POTENTIAL-ENERGY-001; FP-CONCEPT-POWER-001; EL-CONCEPT-VOLTAGE-001; EL-CONCEPT-ENERGY-001
**Curriculum mapping(s):** Describe the main principles of the following and their inter-relationships: force, work, energy (kinetic and potential), power, efficiency (REQUIRED_FOR)
**Provenance:** University Physics Volume 1 — University Physics Volume 1, Ch.7.2: kinetic energy and the work-energy relationship; conservation of energy [DEFINES, support=DIRECT, verification=UNVERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED

### FP-CONCEPT-ENERGY-CONSERVATION-001

**Statement (v1, APPROVED):** Energy cannot be created or destroyed, only transferred or converted from one form to another.

**Direct prerequisites:** FP-CONCEPT-ENERGY-001 (REQUIRED)
**Direct dependents:** FP-CONCEPT-EFFICIENCY-001
**Provenance:** University Physics Volume 1 — University Physics Volume 1, Ch.7.2: kinetic energy and the work-energy relationship; conservation of energy [SUPPORTS, support=DIRECT, verification=UNVERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE

### FP-CONCEPT-KINETIC-ENERGY-001

**Statement (v1, APPROVED):** Kinetic energy is the energy an object possesses because of its motion.

**Direct prerequisites:** FP-CONCEPT-ENERGY-001 (REQUIRED)
**Direct dependents:** FP-REL-KINETIC-ENERGY-001
**Curriculum mapping(s):** Describe the main principles of the following and their inter-relationships: force, work, energy (kinetic and potential), power, efficiency (REQUIRED_FOR)
**Provenance:** University Physics Volume 1 — University Physics Volume 1, Ch.7.2: kinetic energy and the work-energy relationship; conservation of energy [DEFINES, support=DIRECT, verification=UNVERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED

### FP-REL-KINETIC-ENERGY-001

**Statement (v1, APPROVED):** Kinetic energy is calculated from an object's mass and speed using KE = one half times m times v squared.

**Direct prerequisites:** FP-CONCEPT-KINETIC-ENERGY-001 (REQUIRED)
**Direct dependents:** FP-CALC-KINETIC-ENERGY-001
**Curriculum mapping(s):** Describe the main principles of the following and their inter-relationships: force, work, energy (kinetic and potential), power, efficiency (REQUIRED_FOR)
**Provenance:** University Physics Volume 1 — University Physics Volume 1, Ch.7.2: kinetic energy and the work-energy relationship; conservation of energy [SUPPORTS, support=DIRECT, verification=UNVERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED

### FP-CALC-KINETIC-ENERGY-001

**Statement (v1, APPROVED):** Calculate the kinetic energy of an object from its mass and speed, using KE = one half times m times v squared.

**Direct prerequisites:** FP-REL-KINETIC-ENERGY-001 (REQUIRED); FM-ALG-SUBSTITUTION-001 (REQUIRED)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Calculate values of mechanical energy, power and efficiency (REQUIRED_FOR)
**Provenance:** University Physics Volume 1 — University Physics Volume 1, Ch.7.2: kinetic energy and the work-energy relationship; conservation of energy [SUPPORTS, support=DIRECT, verification=UNVERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED

### FP-CONCEPT-POTENTIAL-ENERGY-001

**Statement (v1, APPROVED):** Gravitational potential energy is the energy an object possesses because of its position (height) within a gravitational field.

**Direct prerequisites:** FP-CONCEPT-ENERGY-001 (REQUIRED)
**Direct dependents:** FP-REL-POTENTIAL-ENERGY-001
**Curriculum mapping(s):** Describe the main principles of the following and their inter-relationships: force, work, energy (kinetic and potential), power, efficiency (REQUIRED_FOR)
**Provenance:** University Physics Volume 1 — Gravitational potential energy near Earth's surface is calculated as GPE = mgh, where m is mass, g is gravitational field strength and h is height above a reference level [DEFINES, support=DIRECT, verification=UNVERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED

### FP-REL-POTENTIAL-ENERGY-001

**Statement (v1, APPROVED):** Gravitational potential energy near the Earth's surface is calculated from an object's mass, gravitational field strength and height using GPE = m times g times h.

**Direct prerequisites:** FP-CONCEPT-POTENTIAL-ENERGY-001 (REQUIRED); FP-REL-WEIGHT-MASS-001 (STRONG)
**Direct dependents:** FP-CALC-POTENTIAL-ENERGY-001
**Curriculum mapping(s):** Describe the main principles of the following and their inter-relationships: force, work, energy (kinetic and potential), power, efficiency (REQUIRED_FOR)
**Provenance:** University Physics Volume 1 — Gravitational potential energy near Earth's surface is calculated as GPE = mgh, where m is mass, g is gravitational field strength and h is height above a reference level [SUPPORTS, support=DIRECT, verification=UNVERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED

### FP-CALC-POTENTIAL-ENERGY-001

**Statement (v1, APPROVED):** Calculate the gravitational potential energy of an object from its mass, gravitational field strength and height, using GPE = m times g times h.

**Direct prerequisites:** FP-REL-POTENTIAL-ENERGY-001 (REQUIRED); FM-ALG-SUBSTITUTION-001 (REQUIRED)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Calculate values of mechanical energy, power and efficiency (REQUIRED_FOR)
**Provenance:** University Physics Volume 1 — Gravitational potential energy near Earth's surface is calculated as GPE = mgh, where m is mass, g is gravitational field strength and h is height above a reference level [SUPPORTS, support=DIRECT, verification=UNVERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED

### FP-CONCEPT-POWER-001

**Statement (v1, APPROVED):** Power is the rate at which work is done or energy is transferred.

**Direct prerequisites:** FP-CONCEPT-WORK-001 (REQUIRED); FP-CONCEPT-ENERGY-001 (REQUIRED)
**Direct dependents:** FP-REL-POWER-WORK-TIME-001; EL-CONCEPT-POWER-001
**Curriculum mapping(s):** Describe the main principles of the following and their inter-relationships: force, work, energy (kinetic and potential), power, efficiency (REQUIRED_FOR)
**Provenance:** University Physics Volume 1 — University Physics Volume 1, Ch.7.4: power as the rate at which work is done or energy is transferred, P = W / t [DEFINES, support=DIRECT, verification=UNVERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED

### FP-REL-POWER-WORK-TIME-001

**Statement (v1, APPROVED):** Power is calculated by dividing the work done (or energy transferred) by the time taken: P = W / t.

**Direct prerequisites:** FP-CONCEPT-POWER-001 (REQUIRED)
**Direct dependents:** FP-CALC-POWER-001
**Curriculum mapping(s):** Describe the main principles of the following and their inter-relationships: force, work, energy (kinetic and potential), power, efficiency (REQUIRED_FOR)
**Provenance:** University Physics Volume 1 — University Physics Volume 1, Ch.7.4: power as the rate at which work is done or energy is transferred, P = W / t [SUPPORTS, support=DIRECT, verification=UNVERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED

### FP-CALC-POWER-001

**Statement (v1, APPROVED):** Calculate power from known work done (or energy transferred) and time taken, using P = W / t.

**Direct prerequisites:** FP-REL-POWER-WORK-TIME-001 (REQUIRED); FM-ALG-SUBSTITUTION-001 (REQUIRED)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Calculate values of mechanical energy, power and efficiency (REQUIRED_FOR)
**Provenance:** University Physics Volume 1 — University Physics Volume 1, Ch.7.4: power as the rate at which work is done or energy is transferred, P = W / t [SUPPORTS, support=DIRECT, verification=UNVERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED

### FP-CONCEPT-EFFICIENCY-001

**Statement (v1, APPROVED):** Efficiency is the ratio of useful energy or power output to total energy or power input, usually expressed as a percentage.

**Direct prerequisites:** FP-CONCEPT-ENERGY-CONSERVATION-001 (REQUIRED); FM-ARITH-PERCENTAGE-001 (REQUIRED)
**Direct dependents:** FP-CALC-EFFICIENCY-001; EL-CONCEPT-ELECTRICAL-EFFICIENCY-001
**Curriculum mapping(s):** Describe the main principles of the following and their inter-relationships: force, work, energy (kinetic and potential), power, efficiency (REQUIRED_FOR)
**Provenance:** University Physics Volume 1 — University Physics Volume 1, Ch.7.4: power as the rate at which work is done or energy is transferred, P = W / t [SUPPORTS, support=DIRECT, verification=UNVERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED

### FP-CALC-EFFICIENCY-001

**Statement (v1, APPROVED):** Calculate the efficiency of a process as a percentage from its useful output and total input.

**Direct prerequisites:** FP-CONCEPT-EFFICIENCY-001 (REQUIRED); FM-ARITH-PERCENTAGE-001 (REQUIRED)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Calculate values of mechanical energy, power and efficiency (REQUIRED_FOR)
**Provenance:** University Physics Volume 1 — University Physics Volume 1, Ch.7.4: power as the rate at which work is done or energy is transferred, P = W / t [SUPPORTS, support=DIRECT, verification=UNVERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED

### FP-CONCEPT-MASS-001

**Statement (v1, APPROVED):** Mass is the amount of matter in an object, measured in kilograms.

**Direct prerequisites:** (none — root assertion)
**Direct dependents:** FP-CONCEPT-WEIGHT-001; FP-REL-WEIGHT-MASS-001
**Curriculum mapping(s):** Specify what is meant by mass and weight (REQUIRED_FOR)
**Provenance:** University Physics Volume 1 — University Physics Volume 1, Ch.7: work as a force causing displacement of its point of application; force and mass/weight [DEFINES, support=DIRECT, verification=UNVERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED

### FP-CONCEPT-WEIGHT-001

**Statement (v1, APPROVED):** Weight is the force of gravity acting on an object's mass, measured in newtons.

**Direct prerequisites:** FP-CONCEPT-FORCE-001 (STRONG); FP-CONCEPT-MASS-001 (STRONG)
**Direct dependents:** FP-REL-WEIGHT-MASS-001
**Curriculum mapping(s):** Specify what is meant by mass and weight (REQUIRED_FOR)
**Provenance:** University Physics Volume 1 — University Physics Volume 1, Ch.7: work as a force causing displacement of its point of application; force and mass/weight [DEFINES, support=DIRECT, verification=UNVERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED

### FP-REL-WEIGHT-MASS-001

**Statement (v1, APPROVED):** Weight is calculated from mass and gravitational field strength using W = m times g.

**Direct prerequisites:** FP-CONCEPT-MASS-001 (REQUIRED); FP-CONCEPT-WEIGHT-001 (REQUIRED)
**Direct dependents:** FP-REL-POTENTIAL-ENERGY-001; FP-CALC-WEIGHT-001
**Curriculum mapping(s):** Specify what is meant by mass and weight (SUPPORTS)
**Provenance:** University Physics Volume 1 — University Physics Volume 1, Ch.7: work as a force causing displacement of its point of application; force and mass/weight [SUPPORTS, support=DIRECT, verification=UNVERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** FOUNDATIONAL_PREREQUISITE

### FP-CALC-WEIGHT-001

**Statement (v1, APPROVED):** Calculate the weight of an object from its mass and gravitational field strength using W = m times g.

**Direct prerequisites:** FP-REL-WEIGHT-MASS-001 (REQUIRED); FM-ALG-TRANSPOSE-MULT-001 (REQUIRED); FM-ALG-SUBSTITUTION-001 (REQUIRED)
**Direct dependents:** (none — leaf capability)
**Provenance:** University Physics Volume 1 — University Physics Volume 1, Ch.7: work as a force causing displacement of its point of application; force and mass/weight [SUPPORTS, support=DIRECT, verification=UNVERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE

### FP-CONCEPT-MECHANICAL-ADVANTAGE-001

**Statement (v1, APPROVED):** A simple machine such as a lever, gear or pulley provides mechanical advantage by changing the relationship between the effort (input force) applied and the load (output force) it moves.

**Direct prerequisites:** FP-CONCEPT-FORCE-001 (STRONG)
**Direct dependents:** FP-CONCEPT-LEVER-PRINCIPLE-001; FP-CONCEPT-GEAR-001; FP-CONCEPT-PULLEY-001
**Curriculum mapping(s):** Explain the principles of basic mechanics as they apply to levers, gears and pulleys (REQUIRED_FOR)
**Provenance:** University Physics Volume 1 — Static equilibrium: a lever's mechanical advantage from the balance of torques (force times lever-arm distance) about a pivot, the physical basis distinguishing lever classes by the relative arrangement of pivot, effort and load [SUPPORTS, support=DIRECT, verification=UNVERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** FOUNDATIONAL_PREREQUISITE

### FP-CONCEPT-LEVER-PRINCIPLE-001

**Statement (v1, APPROVED):** A lever is a rigid bar that rotates about a fixed pivot (fulcrum); the mechanical advantage it provides depends on the ratio of the effort's distance from the pivot to the load's distance from the pivot.

**Direct prerequisites:** FP-CONCEPT-MECHANICAL-ADVANTAGE-001 (REQUIRED)
**Direct dependents:** FP-LEVER-CLASS-I-001; FP-LEVER-CLASS-II-001; FP-LEVER-CLASS-III-001; FP-REL-LEVER-BALANCE-001
**Curriculum mapping(s):** Explain the principles of basic mechanics as they apply to levers, gears and pulleys (REQUIRED_FOR)
**Provenance:** University Physics Volume 1 — Static equilibrium: a lever's mechanical advantage from the balance of torques (force times lever-arm distance) about a pivot, the physical basis distinguishing lever classes by the relative arrangement of pivot, effort and load [SUPPORTS, support=DIRECT, verification=UNVERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED

### FP-LEVER-CLASS-I-001

**Statement (v1, APPROVED):** In a class I lever, the pivot is positioned between the effort and the load (for example a see-saw or a pair of pliers).

**Direct prerequisites:** FP-CONCEPT-LEVER-PRINCIPLE-001 (REQUIRED)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Levers: Class I (REQUIRED_FOR)
**Provenance:** University Physics Volume 1 — Static equilibrium: a lever's mechanical advantage from the balance of torques (force times lever-arm distance) about a pivot, the physical basis distinguishing lever classes by the relative arrangement of pivot, effort and load [SUPPORTS, support=DIRECT, verification=UNVERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED

### FP-LEVER-CLASS-II-001

**Statement (v1, APPROVED):** In a class II lever, the load is positioned between the pivot and the effort (for example a wheelbarrow).

**Direct prerequisites:** FP-CONCEPT-LEVER-PRINCIPLE-001 (REQUIRED)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Levers: Class II (REQUIRED_FOR)
**Provenance:** University Physics Volume 1 — Static equilibrium: a lever's mechanical advantage from the balance of torques (force times lever-arm distance) about a pivot, the physical basis distinguishing lever classes by the relative arrangement of pivot, effort and load [SUPPORTS, support=DIRECT, verification=UNVERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED

### FP-LEVER-CLASS-III-001

**Statement (v1, APPROVED):** In a class III lever, the effort is positioned between the pivot and the load (for example a pair of tweezers or the human forearm).

**Direct prerequisites:** FP-CONCEPT-LEVER-PRINCIPLE-001 (REQUIRED)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Levers: Class III (REQUIRED_FOR)
**Provenance:** University Physics Volume 1 — Static equilibrium: a lever's mechanical advantage from the balance of torques (force times lever-arm distance) about a pivot, the physical basis distinguishing lever classes by the relative arrangement of pivot, effort and load [SUPPORTS, support=DIRECT, verification=UNVERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED

### FP-REL-LEVER-BALANCE-001

**Statement (v1, APPROVED):** A lever is in balance (equilibrium) when the effort multiplied by its distance from the pivot equals the load multiplied by its distance from the pivot; this relationship can be used to calculate the effort needed to balance a known load, or vice versa.

**Direct prerequisites:** FP-CONCEPT-LEVER-PRINCIPLE-001 (REQUIRED)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Explain the principles of basic mechanics as they apply to levers, gears and pulleys (REQUIRED_FOR)
**Provenance:** University Physics Volume 1 — Static equilibrium: a lever's mechanical advantage from the balance of torques (force times lever-arm distance) about a pivot, the physical basis distinguishing lever classes by the relative arrangement of pivot, effort and load [DEFINES, support=DIRECT, verification=UNVERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED

### FP-CONCEPT-GEAR-001

**Statement (v1, APPROVED):** A gear is a toothed wheel; when two gears mesh, their teeth engage so that one gear (the driving gear) transmits rotary motion and torque to the other (the driven gear) from one shaft to another.

**Direct prerequisites:** FP-CONCEPT-MECHANICAL-ADVANTAGE-001 (REQUIRED)
**Direct dependents:** FP-REL-GEAR-RATIO-001; FP-GEAR-DIRECTION-REVERSAL-001
**Curriculum mapping(s):** Explain the principles of basic mechanics as they apply to levers, gears and pulleys (REQUIRED_FOR)
**Provenance:** College Physics 2e — For wheels/gears driven by a common axle, mechanical advantage is the ratio of the radii of the driving and driven wheel/gear (the same simple expression as for a crank); a single fixed pulley has a mechanical advantage of 1 (direction change only, forces do not add); a movable/combination pulley system's mechanical advantage approximately equals the number of rope/cable sections directly supporting the load, demonstrated for MA of 2, 3 and 4 [DEFINES, support=PARTIAL, verification=UNVERIFIED] | Machine Design: Gear Ratios — Because the radius of a gear is proportional to its number of teeth, gear-ratio relationships can equivalently be stated in terms of tooth counts: omega_out/omega_in = n_in/n_out (speed) and tau_out/tau_in = n_out/n_in (torque); "a gear ratio can increase the output torque or output speed of a mechanism, but not both" -- with a given power source you can achieve high velocity output or high force/torque output, but not both [SUPPORTS, support=PARTIAL, verification=UNVERIFIED]
**Entailment result:** FULLY_SUPPORTED_MULTI_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED
**Clause coverage:** "a gear is a wheel used as a simple machine (MA-as-radius-ratio analogue of a crank)" -> College Physics 2e (loc-openstax-college-physics-simple-machines); "gear teeth mesh; driving/driven gears transmit rotary motion and torque between shafts" -> Machine Design: Gear Ratios (loc-ucsd-gear-ratio-tooth-count-torque)

### FP-REL-GEAR-RATIO-001

**Statement (v1, APPROVED):** For two meshed gears, mechanical advantage (the ratio of output torque to input torque) equals the ratio of their radii (the driven gear's radius to the driving gear's radius); because gear teeth are evenly spaced and shared between meshed gears, a gear's radius is proportional to its number of teeth, so this same mechanical advantage can equivalently be expressed as the ratio of their tooth counts (driven tooth count to driving tooth count).

**Direct prerequisites:** FP-CONCEPT-GEAR-001 (REQUIRED)
**Direct dependents:** FP-GEAR-SPEED-TORQUE-TRADEOFF-001
**Curriculum mapping(s):** Explain the principles of basic mechanics as they apply to levers, gears and pulleys (REQUIRED_FOR)
**Provenance:** College Physics 2e — For wheels/gears driven by a common axle, mechanical advantage is the ratio of the radii of the driving and driven wheel/gear (the same simple expression as for a crank); a single fixed pulley has a mechanical advantage of 1 (direction change only, forces do not add); a movable/combination pulley system's mechanical advantage approximately equals the number of rope/cable sections directly supporting the load, demonstrated for MA of 2, 3 and 4 [DEFINES, support=PARTIAL, verification=UNVERIFIED] | Machine Design: Gear Ratios — Because the radius of a gear is proportional to its number of teeth, gear-ratio relationships can equivalently be stated in terms of tooth counts: omega_out/omega_in = n_in/n_out (speed) and tau_out/tau_in = n_out/n_in (torque); "a gear ratio can increase the output torque or output speed of a mechanism, but not both" -- with a given power source you can achieve high velocity output or high force/torque output, but not both [DEFINES, support=PARTIAL, verification=UNVERIFIED]
**Entailment result:** FULLY_SUPPORTED_MULTI_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED
**Clause coverage:** "mechanical advantage equals the ratio of the two gears' radii" -> College Physics 2e (loc-openstax-college-physics-simple-machines); "mechanical advantage (torque ratio) is output/input, i.e. driven/driving -- tau_out/tau_in = n_out/n_in -- and radius is proportional to tooth count, so MA can equivalently be expressed as the driven/driving tooth-count ratio" -> Machine Design: Gear Ratios (loc-ucsd-gear-ratio-tooth-count-torque)

### FP-GEAR-SPEED-TORQUE-TRADEOFF-001

**Statement (v1, APPROVED):** A gear ratio can increase a mechanism's output torque or its output speed relative to the input, but not both at the same time.

**Direct prerequisites:** FP-REL-GEAR-RATIO-001 (REQUIRED)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Explain the principles of basic mechanics as they apply to levers, gears and pulleys (SUPPORTS)
**Provenance:** Machine Design: Gear Ratios — Because the radius of a gear is proportional to its number of teeth, gear-ratio relationships can equivalently be stated in terms of tooth counts: omega_out/omega_in = n_in/n_out (speed) and tau_out/tau_in = n_out/n_in (torque); "a gear ratio can increase the output torque or output speed of a mechanism, but not both" -- with a given power source you can achieve high velocity output or high force/torque output, but not both [DEFINES, support=DIRECT, verification=UNVERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** FOUNDATIONAL_PREREQUISITE

### FP-GEAR-DIRECTION-REVERSAL-001

**Statement (v1, APPROVED):** When two gears mesh directly, they rotate in opposite directions to each other.

**Direct prerequisites:** FP-CONCEPT-GEAR-001 (REQUIRED)
**Direct dependents:** FP-GEAR-IDLER-001
**Curriculum mapping(s):** Explain the principles of basic mechanics as they apply to levers, gears and pulleys (SUPPORTS)
**Provenance:** Gear Train Mechanism Explained: How It Works, Diagram, Formula and Calculator — Meshed gear teeth apply tangential forces at the pitch line such that if the driver gear turns clockwise, the driven gear is forced to turn anticlockwise -- meshed gears always rotate in opposite directions; "An idler sits between driver and driven without changing the overall ratio -- its tooth count cancels out -- but it reverses output direction" [DEFINES, support=DIRECT, verification=UNVERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** FOUNDATIONAL_PREREQUISITE

### FP-GEAR-IDLER-001

**Statement (v1, APPROVED):** An idler gear placed between a driving gear and a driven gear reverses the driven gear's direction of rotation back to match the driving gear's direction, without changing the overall gear ratio between them.

**Direct prerequisites:** FP-GEAR-DIRECTION-REVERSAL-001 (REQUIRED)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Explain the principles of basic mechanics as they apply to levers, gears and pulleys (SUPPORTS)
**Provenance:** Gear Train Mechanism Explained: How It Works, Diagram, Formula and Calculator — Meshed gear teeth apply tangential forces at the pitch line such that if the driver gear turns clockwise, the driven gear is forced to turn anticlockwise -- meshed gears always rotate in opposite directions; "An idler sits between driver and driven without changing the overall ratio -- its tooth count cancels out -- but it reverses output direction" [DEFINES, support=DIRECT, verification=UNVERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** FOUNDATIONAL_PREREQUISITE

### FP-CONCEPT-PULLEY-001

**Statement (v1, APPROVED):** A pulley is a wheel with a grooved rim that changes the direction of a force applied through a rope or cable running over it.

**Direct prerequisites:** FP-CONCEPT-MECHANICAL-ADVANTAGE-001 (REQUIRED)
**Direct dependents:** FP-PULLEY-FIXED-VS-MOVABLE-001
**Curriculum mapping(s):** Explain the principles of basic mechanics as they apply to levers, gears and pulleys (REQUIRED_FOR)
**Provenance:** College Physics 2e — For wheels/gears driven by a common axle, mechanical advantage is the ratio of the radii of the driving and driven wheel/gear (the same simple expression as for a crank); a single fixed pulley has a mechanical advantage of 1 (direction change only, forces do not add); a movable/combination pulley system's mechanical advantage approximately equals the number of rope/cable sections directly supporting the load, demonstrated for MA of 2, 3 and 4 [DEFINES, support=DIRECT, verification=UNVERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED

### FP-PULLEY-FIXED-VS-MOVABLE-001

**Statement (v1, APPROVED):** A single fixed pulley has a mechanical advantage of one -- it changes the direction of the effort but does not reduce the force needed; a movable pulley, or a combination of pulleys, can provide a mechanical advantage greater than one.

**Direct prerequisites:** FP-CONCEPT-PULLEY-001 (REQUIRED)
**Direct dependents:** FP-REL-PULLEY-MECHANICAL-ADVANTAGE-001
**Curriculum mapping(s):** Explain the principles of basic mechanics as they apply to levers, gears and pulleys (REQUIRED_FOR)
**Provenance:** College Physics 2e — For wheels/gears driven by a common axle, mechanical advantage is the ratio of the radii of the driving and driven wheel/gear (the same simple expression as for a crank); a single fixed pulley has a mechanical advantage of 1 (direction change only, forces do not add); a movable/combination pulley system's mechanical advantage approximately equals the number of rope/cable sections directly supporting the load, demonstrated for MA of 2, 3 and 4 [SUPPORTS, support=DIRECT, verification=UNVERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED

### FP-REL-PULLEY-MECHANICAL-ADVANTAGE-001

**Statement (v1, APPROVED):** For a movable or combination pulley system, the mechanical advantage is approximately equal to the number of rope or cable sections that directly support the load.

**Direct prerequisites:** FP-PULLEY-FIXED-VS-MOVABLE-001 (REQUIRED)
**Direct dependents:** FP-REL-PULLEY-FORCE-DISTANCE-TRADEOFF-001
**Curriculum mapping(s):** Explain the principles of basic mechanics as they apply to levers, gears and pulleys (REQUIRED_FOR)
**Provenance:** College Physics 2e — For wheels/gears driven by a common axle, mechanical advantage is the ratio of the radii of the driving and driven wheel/gear (the same simple expression as for a crank); a single fixed pulley has a mechanical advantage of 1 (direction change only, forces do not add); a movable/combination pulley system's mechanical advantage approximately equals the number of rope/cable sections directly supporting the load, demonstrated for MA of 2, 3 and 4 [SUPPORTS, support=DIRECT, verification=UNVERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED

### FP-REL-PULLEY-FORCE-DISTANCE-TRADEOFF-001

**Statement (v1, APPROVED):** The mechanical advantage a pulley system provides in reduced effort force is accompanied by a proportional increase in the distance the effort must move to lift the load.

**Direct prerequisites:** FP-REL-PULLEY-MECHANICAL-ADVANTAGE-001 (REQUIRED)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Explain the principles of basic mechanics as they apply to levers, gears and pulleys (SUPPORTS)
**Provenance:** College Physics 2e — For wheels/gears driven by a common axle, mechanical advantage is the ratio of the radii of the driving and driven wheel/gear (the same simple expression as for a crank); a single fixed pulley has a mechanical advantage of 1 (direction change only, forces do not add); a movable/combination pulley system's mechanical advantage approximately equals the number of rope/cable sections directly supporting the load, demonstrated for MA of 2, 3 and 4 [SUPPORTS, support=DIRECT, verification=UNVERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** FOUNDATIONAL_PREREQUISITE

### FP-UNIT-METRE-001

**Statement (v1, APPROVED):** The metre (m) is the SI base unit of length.

**Direct prerequisites:** (none — root assertion)
**Direct dependents:** FP-UNIT-SQUARE-METRE-001; FP-UNIT-CUBIC-METRE-001; FP-UNIT-METRE-PER-SECOND-001
**Curriculum mapping(s):** (SI) Units of measurement for: Length (REQUIRED_FOR)
**Provenance:** The International System of Units (SI Brochure) — SI Brochure Table 1: the seven SI base units, including the metre (length), kilogram (mass), second (time) and kelvin (thermodynamic temperature) [DEFINES, support=DIRECT, verification=UNVERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED

### FP-UNIT-SQUARE-METRE-001

**Statement (v1, APPROVED):** The square metre (m squared) is the SI derived unit of area, formed by multiplying two lengths.

**Direct prerequisites:** FP-UNIT-METRE-001 (REQUIRED)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** (SI) Units of measurement for: Area (REQUIRED_FOR)
**Provenance:** The International System of Units (SI Brochure) — SI Brochure Table 3: examples of SI coherent derived units expressed in terms of base units, including area (square metre), volume (cubic metre), speed/velocity (metre per second) and density (kilogram per cubic metre) [DEFINES, support=DIRECT, verification=UNVERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED

### FP-UNIT-CUBIC-METRE-001

**Statement (v1, APPROVED):** The cubic metre (m cubed) is the SI derived unit of volume, formed by multiplying three lengths.

**Direct prerequisites:** FP-UNIT-METRE-001 (REQUIRED)
**Direct dependents:** FP-UNIT-DENSITY-001
**Curriculum mapping(s):** (SI) Units of measurement for: Volume (REQUIRED_FOR)
**Provenance:** The International System of Units (SI Brochure) — SI Brochure Table 3: examples of SI coherent derived units expressed in terms of base units, including area (square metre), volume (cubic metre), speed/velocity (metre per second) and density (kilogram per cubic metre) [DEFINES, support=DIRECT, verification=UNVERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED

### FP-UNIT-KILOGRAM-001

**Statement (v1, APPROVED):** The kilogram (kg) is the SI base unit of mass.

**Direct prerequisites:** (none — root assertion)
**Direct dependents:** FP-UNIT-DENSITY-001
**Curriculum mapping(s):** (SI) Units of measurement for: Mass (REQUIRED_FOR)
**Provenance:** The International System of Units (SI Brochure) — SI Brochure Table 1: the seven SI base units, including the metre (length), kilogram (mass), second (time) and kelvin (thermodynamic temperature) [DEFINES, support=DIRECT, verification=UNVERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED

### FP-UNIT-DENSITY-001

**Statement (v1, APPROVED):** Density is mass per unit volume, with SI derived unit the kilogram per cubic metre (kg/m cubed).

**Direct prerequisites:** FP-UNIT-KILOGRAM-001 (REQUIRED); FP-UNIT-CUBIC-METRE-001 (REQUIRED)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** (SI) Units of measurement for: Density (REQUIRED_FOR)
**Provenance:** The International System of Units (SI Brochure) — SI Brochure Table 3: examples of SI coherent derived units expressed in terms of base units, including area (square metre), volume (cubic metre), speed/velocity (metre per second) and density (kilogram per cubic metre) [DEFINES, support=DIRECT, verification=UNVERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED

### FP-UNIT-SECOND-001

**Statement (v1, APPROVED):** The second (s) is the SI base unit of time.

**Direct prerequisites:** (none — root assertion)
**Direct dependents:** FP-UNIT-METRE-PER-SECOND-001
**Curriculum mapping(s):** (SI) Units of measurement for: Time (REQUIRED_FOR)
**Provenance:** The International System of Units (SI Brochure) — SI Brochure Table 1: the seven SI base units, including the metre (length), kilogram (mass), second (time) and kelvin (thermodynamic temperature) [DEFINES, support=DIRECT, verification=UNVERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED

### FP-UNIT-KELVIN-CELSIUS-001

**Statement (v1, APPROVED):** The kelvin (K) is the SI base unit of thermodynamic temperature T; the degree Celsius (deg C) is a special name for the kelvin used to express Celsius temperature t, related by t = T minus 273.15. A temperature interval or difference of one degree Celsius equals one kelvin.

**Direct prerequisites:** (none — root assertion)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** (SI) Units of measurement for: Temperature (REQUIRED_FOR)
**Provenance:** The International System of Units (SI Brochure) — SI Brochure Table 1: the seven SI base units, including the metre (length), kilogram (mass), second (time) and kelvin (thermodynamic temperature) [DEFINES, support=PARTIAL, verification=UNVERIFIED] | The International System of Units (SI Brochure) — SI Brochure 2.3.3: the degree Celsius, a special name for the kelvin used to express Celsius temperature [DEFINES, support=PARTIAL, verification=UNVERIFIED]
**Entailment result:** FULLY_SUPPORTED_MULTI_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED
**Clause coverage:** "the kelvin is the SI base unit of thermodynamic temperature" -> The International System of Units (SI Brochure) (loc-bipm-base-units-table); "degree Celsius = special name for kelvin, t = T - 273.15, equal interval magnitude" -> The International System of Units (SI Brochure) (loc-bipm-celsius)

### FP-UNIT-METRE-PER-SECOND-001

**Statement (v1, APPROVED):** The metre per second (m/s) is the SI derived unit of speed/velocity, formed by dividing a length by a time.

**Direct prerequisites:** FP-UNIT-METRE-001 (REQUIRED); FP-UNIT-SECOND-001 (REQUIRED)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** (SI) Units of measurement for: Velocity (REQUIRED_FOR)
**Provenance:** The International System of Units (SI Brochure) — SI Brochure Table 3: examples of SI coherent derived units expressed in terms of base units, including area (square metre), volume (cubic metre), speed/velocity (metre per second) and density (kilogram per cubic metre) [DEFINES, support=DIRECT, verification=UNVERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED

## Electrical (EL)

### EL-UNIT-VOLT-001

**Statement (v1, APPROVED):** The volt (V) is the SI derived unit of electric potential difference (voltage).

**Direct prerequisites:** (none — root assertion)
**Direct dependents:** EL-UNIT-BASE-VS-DERIVED-001
**Curriculum mapping(s):** Identify and use internationally recognised base and derived (SI) units of measurement (REQUIRED_FOR); Identify and determine values of base and derived SI units which apply specifically to electrical quantities (REQUIRED_FOR); Electrical quantities (SI units): Voltage (REQUIRED_FOR); Identify and use internationally recognised base and derived (SI) units of measurement (REQUIRED_FOR); Identify and determine values of base and derived SI units which apply specifically to electrical quantities (REQUIRED_FOR)
**Provenance:** The International System of Units (SI Brochure) — SI Brochure: table of SI derived units with special names, including the volt, ohm, watt and joule, and SI prefixes [DEFINES, support=DIRECT, verification=UNVERIFIED] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC2.2: identify and determine values of base and derived SI units which apply specifically to electrical quantities [CURRICULUM_REQUIRES, verification=VERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED
**Misconceptions targeting this assertion:** MIS-EL-UNIT-CONFUSION-001

### EL-UNIT-AMPERE-001

**Statement (v1, APPROVED):** The ampere (A) is the SI base unit of electric current.

**Direct prerequisites:** (none — root assertion)
**Direct dependents:** EL-UNIT-BASE-VS-DERIVED-001
**Curriculum mapping(s):** Identify and use internationally recognised base and derived (SI) units of measurement (REQUIRED_FOR); Identify and determine values of base and derived SI units which apply specifically to electrical quantities (REQUIRED_FOR); Electrical quantities (SI units): Current (REQUIRED_FOR); Identify and use internationally recognised base and derived (SI) units of measurement (REQUIRED_FOR); Identify and determine values of base and derived SI units which apply specifically to electrical quantities (REQUIRED_FOR)
**Provenance:** The International System of Units (SI Brochure) — SI Brochure Appendix 2: the ampere, SI base unit of electric current [DEFINES, support=DIRECT, verification=UNVERIFIED] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC2.2: identify and determine values of base and derived SI units which apply specifically to electrical quantities [CURRICULUM_REQUIRES, verification=VERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED
**Misconceptions targeting this assertion:** MIS-EL-UNIT-CONFUSION-001

### EL-UNIT-OHM-001

**Statement (v1, APPROVED):** The ohm is the SI derived unit of electrical resistance.

**Direct prerequisites:** (none — root assertion)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Identify and determine values of base and derived SI units which apply specifically to electrical quantities (REQUIRED_FOR); Electrical quantities (SI units): Resistance (REQUIRED_FOR); Identify and determine values of base and derived SI units which apply specifically to electrical quantities (REQUIRED_FOR)
**Provenance:** The International System of Units (SI Brochure) — SI Brochure: table of SI derived units with special names, including the volt, ohm, watt and joule, and SI prefixes [DEFINES, support=DIRECT, verification=UNVERIFIED] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC2.2: identify and determine values of base and derived SI units which apply specifically to electrical quantities [CURRICULUM_REQUIRES, verification=VERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED
**Misconceptions targeting this assertion:** MIS-EL-UNIT-CONFUSION-001

### EL-UNIT-WATT-001

**Statement (v1, APPROVED):** The watt (W) is the SI derived unit of power.

**Direct prerequisites:** (none — root assertion)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Identify and determine values of base and derived SI units which apply specifically to electrical quantities (REQUIRED_FOR); Electrical quantities (SI units): Power (REQUIRED_FOR); Identify and determine values of base and derived SI units which apply specifically to electrical quantities (REQUIRED_FOR)
**Provenance:** The International System of Units (SI Brochure) — SI Brochure: table of SI derived units with special names, including the volt, ohm, watt and joule, and SI prefixes [DEFINES, support=DIRECT, verification=UNVERIFIED] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC2.2: identify and determine values of base and derived SI units which apply specifically to electrical quantities [CURRICULUM_REQUIRES, verification=VERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED
**Misconceptions targeting this assertion:** MIS-EL-UNIT-CONFUSION-001

### EL-UNIT-JOULE-001

**Statement (v1, APPROVED):** The joule (J) is the SI derived unit of energy.

**Direct prerequisites:** (none — root assertion)
**Direct dependents:** EL-UNIT-KWH-001
**Curriculum mapping(s):** Identify and determine values of base and derived SI units which apply specifically to electrical quantities (REQUIRED_FOR); Electrical quantities (SI units): Energy (REQUIRED_FOR); Identify and determine values of base and derived SI units which apply specifically to electrical quantities (REQUIRED_FOR)
**Provenance:** The International System of Units (SI Brochure) — SI Brochure: table of SI derived units with special names, including the volt, ohm, watt and joule, and SI prefixes [DEFINES, support=DIRECT, verification=UNVERIFIED] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC2.2: identify and determine values of base and derived SI units which apply specifically to electrical quantities [CURRICULUM_REQUIRES, verification=VERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED
**Misconceptions targeting this assertion:** MIS-EL-UNIT-CONFUSION-001, MIS-EL-ENERGY-UNIT-CONFUSION-001

### EL-UNIT-OHM-METRE-001

**Statement (v1, APPROVED):** The ohm-metre is the SI derived unit of resistivity.

**Direct prerequisites:** (none — root assertion)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Identify and determine values of base and derived SI units which apply specifically to electrical quantities (REQUIRED_FOR); Electrical quantities (SI units): Resistivity (REQUIRED_FOR); Identify and determine values of base and derived SI units which apply specifically to electrical quantities (REQUIRED_FOR)
**Provenance:** The International System of Units (SI Brochure) — SI Brochure: table of SI derived units with special names, including the volt, ohm, watt and joule, and SI prefixes [DEFINES, support=DIRECT, verification=UNVERIFIED] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC2.2: identify and determine values of base and derived SI units which apply specifically to electrical quantities [CURRICULUM_REQUIRES, verification=VERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED

### EL-CONCEPT-VOLTAGE-001

**Statement (v1, APPROVED):** Potential difference (voltage) is the electrical energy transferred per unit charge between two points in a circuit.

**Direct prerequisites:** FP-CONCEPT-ENERGY-001 (STRONG)
**Direct dependents:** EL-INSTRUMENT-VOLTMETER-001; EL-OHM-RELATIONSHIP-001; EL-PARALLEL-VOLTAGE-001; EL-POWER-RELATIONSHIP-001; EL-CONCEPT-TERMINAL-VOLTAGE-001
**Curriculum mapping(s):** Identify and determine values of base and derived SI units which apply specifically to electrical quantities (REQUIRED_FOR); Identify and determine values of base and derived SI units which apply specifically to electrical quantities (REQUIRED_FOR)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, 9.4: Ohm's law, V = IR, and voltage/potential difference [DEFINES, support=DIRECT, verification=UNVERIFIED] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC2.2: identify and determine values of base and derived SI units which apply specifically to electrical quantities [CURRICULUM_REQUIRES, verification=VERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED
**Misconceptions targeting this assertion:** MIS-EL-CURRENT-VOLTAGE-CONFUSION-001

### EL-CONCEPT-CURRENT-001

**Statement (v1, APPROVED):** Electric current is the rate of flow of electric charge through a conductor.

**Direct prerequisites:** (none — root assertion)
**Direct dependents:** EL-INSTRUMENT-AMMETER-001; EL-CONCEPT-ELECTRON-THEORY-001; EL-OHM-RELATIONSHIP-001; EL-SERIES-CURRENT-001; EL-PARALLEL-CURRENT-001; EL-POWER-RELATIONSHIP-001; EL-CURRENT-CHEMICAL-EFFECT-001; EL-CURRENT-CHARGE-RELATIONSHIP-001; EL-CONCEPT-MAGNETIC-FIELD-CURRENT-001; EL-CONCEPT-AC-DC-DISTINCTION-001; EL-INSTRUMENT-CLAMP-METER-001
**Curriculum mapping(s):** Identify and determine values of base and derived SI units which apply specifically to electrical quantities (REQUIRED_FOR); Identify and determine values of base and derived SI units which apply specifically to electrical quantities (REQUIRED_FOR)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, 9.4: Ohm's law, V = IR, and voltage/potential difference [DEFINES, support=DIRECT, verification=UNVERIFIED] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC2.2: identify and determine values of base and derived SI units which apply specifically to electrical quantities [CURRICULUM_REQUIRES, verification=VERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED
**Misconceptions targeting this assertion:** MIS-EL-CURRENT-VOLTAGE-CONFUSION-001

### EL-CONCEPT-RESISTANCE-001

**Statement (v1, APPROVED):** Electrical resistance is the opposition a component presents to the flow of electric current.

**Direct prerequisites:** (none — root assertion)
**Direct dependents:** EL-CONCEPT-RESISTIVITY-001; EL-INSTRUMENT-OHMMETER-001; EL-CONCEPT-REACTANCE-001; EL-CONCEPT-IMPEDANCE-001; EL-RESISTIVITY-RELATIONSHIP-001; EL-OHM-RELATIONSHIP-001; EL-SERIES-RESISTANCE-001; EL-PARALLEL-RESISTANCE-001; EL-CURRENT-THERMAL-EFFECT-001; EL-CIRCUIT-RECOGNISE-SHORT-CIRCUIT-001; EL-COMPONENT-RESISTOR-001
**Curriculum mapping(s):** Identify and determine values of base and derived SI units which apply specifically to electrical quantities (REQUIRED_FOR); Describe what is meant by resistance and resistivity in relation to electrical circuits (REQUIRED_FOR); Electrical quantities (SI units): Resistance (REQUIRED_FOR); Electronic components and devices: Resistors (REQUIRED_FOR); Identify and determine values of base and derived SI units which apply specifically to electrical quantities (REQUIRED_FOR); Describe what is meant by resistance and resistivity in relation to electrical circuits (REQUIRED_FOR)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, 9.3: resistance and resistivity, and R = rho L / A [DEFINES, support=DIRECT, verification=UNVERIFIED] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC4.3: describe what is meant by resistance and resistivity in relation to electrical circuits [CURRICULUM_REQUIRES, verification=VERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED
**Misconceptions targeting this assertion:** MIS-EL-RESISTANCE-RESISTIVITY-CONFUSION-001

### EL-CONCEPT-RESISTIVITY-001

**Statement (v1, APPROVED):** Resistivity is a material property describing how strongly a material opposes current flow, independent of the conductor's length or cross-sectional area.

**Direct prerequisites:** EL-CONCEPT-RESISTANCE-001 (STRONG)
**Direct dependents:** EL-RESISTIVITY-RELATIONSHIP-001; EL-RESISTIVITY-COMPARE-MATERIALS-001
**Curriculum mapping(s):** Identify and determine values of base and derived SI units which apply specifically to electrical quantities (SUPPORTS); Describe what is meant by resistance and resistivity in relation to electrical circuits (REQUIRED_FOR); Identify and determine values of base and derived SI units which apply specifically to electrical quantities (SUPPORTS); Describe what is meant by resistance and resistivity in relation to electrical circuits (REQUIRED_FOR)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, 9.3: resistance and resistivity, and R = rho L / A [DEFINES, support=DIRECT, verification=UNVERIFIED] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC4.3: describe what is meant by resistance and resistivity in relation to electrical circuits [CURRICULUM_REQUIRES, verification=VERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED
**Misconceptions targeting this assertion:** MIS-EL-RESISTANCE-RESISTIVITY-CONFUSION-001

### EL-CONCEPT-POWER-001

**Statement (v1, APPROVED):** Electrical power is the rate at which electrical energy is transferred or converted.

**Direct prerequisites:** FP-CONCEPT-POWER-001 (REQUIRED)
**Direct dependents:** EL-INSTRUMENT-WATTMETER-001; EL-POWER-RATING-001; EL-CONCEPT-POWER-FACTOR-001; EL-CONCEPT-ELECTRICAL-EFFICIENCY-001; EL-POWER-RELATIONSHIP-001; EL-ENERGY-POWER-TIME-RELATIONSHIP-001
**Curriculum mapping(s):** Identify and determine values of base and derived SI units which apply specifically to electrical quantities (REQUIRED_FOR); Identify and determine values of base and derived SI units which apply specifically to electrical quantities (REQUIRED_FOR)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, 9.5: electrical power and energy, P = VI and P = I^2 R [DEFINES, support=DIRECT, verification=UNVERIFIED] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC2.2: identify and determine values of base and derived SI units which apply specifically to electrical quantities [CURRICULUM_REQUIRES, verification=VERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED
**Misconceptions targeting this assertion:** MIS-EL-POWER-ENERGY-CONFUSION-001

### EL-CONCEPT-ENERGY-001

**Statement (v1, APPROVED):** Electrical energy is the total amount of electrical work done, or energy transferred, over a period of time.

**Direct prerequisites:** FP-CONCEPT-ENERGY-001 (REQUIRED)
**Direct dependents:** EL-INSTRUMENT-ENERGY-METER-001; EL-UNIT-KWH-001; EL-CURRENT-THERMAL-EFFECT-001; EL-ENERGY-POWER-TIME-RELATIONSHIP-001
**Curriculum mapping(s):** Identify and determine values of base and derived SI units which apply specifically to electrical quantities (REQUIRED_FOR); Identify and determine values of base and derived SI units which apply specifically to electrical quantities (REQUIRED_FOR)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, 9.5: electrical power and energy, P = VI and P = I^2 R [DEFINES, support=DIRECT, verification=UNVERIFIED] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC2.2: identify and determine values of base and derived SI units which apply specifically to electrical quantities [CURRICULUM_REQUIRES, verification=VERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED
**Misconceptions targeting this assertion:** MIS-EL-POWER-ENERGY-CONFUSION-001

### EL-INSTRUMENT-VOLTMETER-001

**Statement (v1, APPROVED):** A voltmeter measures potential difference and is connected in parallel across the component being measured.

**Direct prerequisites:** EL-CONCEPT-VOLTAGE-001 (STRONG)
**Direct dependents:** EL-INSTRUMENT-MULTIMETER-001; EL-INSTRUMENT-SELECT-001; EL-INSTRUMENT-VOLTMETER-INTERNAL-RESISTANCE-001
**Curriculum mapping(s):** Identify appropriate electrical instruments for the measurement of different electrical quantities (REQUIRED_FOR); Electrical quantities (measurement): Voltage (REQUIRED_FOR); Identify appropriate electrical instruments for the measurement of different electrical quantities (REQUIRED_FOR)
**Provenance:** University Physics Volume 2 — A voltmeter is placed in parallel and must have very high (ideally infinite) resistance so it does not alter the circuit; an ammeter is placed in series and must have very low (ideally zero) resistance for the same reason; an ohmmeter must never be connected to a live (energised) circuit [DEFINES, support=DIRECT, verification=UNVERIFIED] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC2.3: identify appropriate electrical instruments for the measurement of different electrical quantities [CURRICULUM_REQUIRES, verification=VERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED
**Misconceptions targeting this assertion:** MIS-EL-INSTRUMENT-CONNECTION-CONFUSION-001

### EL-INSTRUMENT-AMMETER-001

**Statement (v1, APPROVED):** An ammeter measures current and is connected in series within the circuit being measured.

**Direct prerequisites:** EL-CONCEPT-CURRENT-001 (STRONG)
**Direct dependents:** EL-INSTRUMENT-MULTIMETER-001; EL-INSTRUMENT-SELECT-001; EL-INSTRUMENT-AMMETER-INTERNAL-RESISTANCE-001
**Curriculum mapping(s):** Identify appropriate electrical instruments for the measurement of different electrical quantities (REQUIRED_FOR); Electrical quantities (measurement): Current (REQUIRED_FOR); Identify appropriate electrical instruments for the measurement of different electrical quantities (REQUIRED_FOR)
**Provenance:** University Physics Volume 2 — A voltmeter is placed in parallel and must have very high (ideally infinite) resistance so it does not alter the circuit; an ammeter is placed in series and must have very low (ideally zero) resistance for the same reason; an ohmmeter must never be connected to a live (energised) circuit [DEFINES, support=DIRECT, verification=UNVERIFIED] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC2.3: identify appropriate electrical instruments for the measurement of different electrical quantities [CURRICULUM_REQUIRES, verification=VERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED
**Misconceptions targeting this assertion:** MIS-EL-INSTRUMENT-CONNECTION-CONFUSION-001

### EL-INSTRUMENT-OHMMETER-001

**Statement (v1, APPROVED):** An ohmmeter measures resistance, and must be used on a component that is isolated and de-energised.

**Direct prerequisites:** EL-CONCEPT-RESISTANCE-001 (STRONG)
**Direct dependents:** EL-INSTRUMENT-MULTIMETER-001; EL-INSTRUMENT-SELECT-001; EL-INSTRUMENT-CONTINUITY-TEST-001
**Curriculum mapping(s):** Identify appropriate electrical instruments for the measurement of different electrical quantities (REQUIRED_FOR); Electrical quantities (measurement): Resistance (REQUIRED_FOR); Identify appropriate electrical instruments for the measurement of different electrical quantities (REQUIRED_FOR)
**Provenance:** University Physics Volume 2 — A voltmeter is placed in parallel and must have very high (ideally infinite) resistance so it does not alter the circuit; an ammeter is placed in series and must have very low (ideally zero) resistance for the same reason; an ohmmeter must never be connected to a live (energised) circuit [DEFINES, support=DIRECT, verification=UNVERIFIED] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC2.3: identify appropriate electrical instruments for the measurement of different electrical quantities [CURRICULUM_REQUIRES, verification=VERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED

### EL-INSTRUMENT-WATTMETER-001

**Statement (v1, APPROVED):** A wattmeter measures electrical power by combining a measurement of the current through the load with a measurement of the voltage across it; its output is proportional to the product of the two, giving power.

**Direct prerequisites:** EL-CONCEPT-POWER-001 (STRONG)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Identify appropriate electrical instruments for the measurement of different electrical quantities (REQUIRED_FOR); Electrical quantities (measurement): Power (REQUIRED_FOR); Identify appropriate electrical instruments for the measurement of different electrical quantities (REQUIRED_FOR)
**Provenance:** NIST Handbook 44: Specifications, Tolerances, and Other Technical Requirements for Weighing and Measuring Devices -- Section 3.41, Non-Utility Electricity-Measuring Systems (Tentative Code) — Element: a combination of a voltage-sensing unit and a current-sensing unit, which provides an output proportional to the quantities measured; meters can include multiple elements [DEFINES, support=DIRECT, verification=UNVERIFIED] | Dynamometer Type Wattmeter — A wattmeter is an inherent combination of an ammeter and a voltmeter, with a current coil (CC) connected in series with the load so it carries the load current, and a potential coil (PC) connected in parallel with the load so it carries a current proportional to the load voltage [SUPPORTS, support=PARTIAL, verification=UNVERIFIED] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC2.3: identify appropriate electrical instruments for the measurement of different electrical quantities [CURRICULUM_REQUIRES, verification=VERIFIED]
**Entailment result:** FULLY_SUPPORTED_MULTI_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED
**Clause coverage:** "an element combines a voltage-sensing and current-sensing unit, output proportional to the product (the whole governed statement)" -> NIST Handbook 44: Specifications, Tolerances, and Other Technical Requirements for Weighing and Measuring Devices -- Section 3.41, Non-Utility Electricity-Measuring Systems (Tentative Code) (loc-nist-hb44-element); "(supporting, not required) concrete series/parallel coil-wiring implementation detail -- retained as evidence, not repeated in the governed statement per the syllabus-scope-fidelity rule" -> Dynamometer Type Wattmeter (loc-indus-uni-wattmeter-circuit)

### EL-INSTRUMENT-ENERGY-METER-001

**Statement (v1, APPROVED):** An energy meter (kWh meter) measures the cumulative electrical energy delivered over a period of time, expressed in kilowatt-hours, by continuously measuring power and accumulating it over time.

**Direct prerequisites:** EL-CONCEPT-ENERGY-001 (STRONG)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Identify appropriate electrical instruments for the measurement of different electrical quantities (REQUIRED_FOR); Electrical quantities (measurement): Energy (REQUIRED_FOR); Identify appropriate electrical instruments for the measurement of different electrical quantities (REQUIRED_FOR)
**Provenance:** NIST Handbook 44: Specifications, Tolerances, and Other Technical Requirements for Weighing and Measuring Devices -- Section 3.41, Non-Utility Electricity-Measuring Systems (Tentative Code) — Active energy: the integral of active power with respect to time, typically measured in kilowatt-hours (kWh) or watt-hours; E(T) = integral from 0 to T of v(t) times i(t) dt, where T is much greater than the AC line period [DEFINES, support=DIRECT, verification=UNVERIFIED] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC2.3: identify appropriate electrical instruments for the measurement of different electrical quantities [CURRICULUM_REQUIRES, verification=VERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED

### EL-INSTRUMENT-MULTIMETER-001

**Statement (v1, APPROVED):** A multimeter is a single test instrument that can be configured to measure several electrical quantities, commonly including voltage, current and resistance.

**Direct prerequisites:** EL-INSTRUMENT-VOLTMETER-001 (SUPPORTING); EL-INSTRUMENT-AMMETER-001 (SUPPORTING); EL-INSTRUMENT-OHMMETER-001 (SUPPORTING)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Identify appropriate electrical instruments for the measurement of different electrical quantities (REQUIRED_FOR); Identify appropriate electrical instruments for the measurement of different electrical quantities (REQUIRED_FOR)
**Provenance:** Electric Circuits I - Direct Current (Kuphaldt) — A single meter movement can be made to function as a voltmeter, ammeter or ohmmeter by connecting it to different external resistor networks and switch positions; a multi-purpose meter ("multimeter") can be designed in one unit with the appropriate switch(es) and resistors [DEFINES, support=DIRECT, verification=UNVERIFIED] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC2.3: identify appropriate electrical instruments for the measurement of different electrical quantities [CURRICULUM_REQUIRES, verification=VERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED

### EL-POWER-RATING-001

**Statement (v1, APPROVED):** The power rating of an electrical device states the rate at which it is designed to convert electrical energy under normal operating conditions.

**Direct prerequisites:** EL-CONCEPT-POWER-001 (STRONG)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Identify and determine values of base and derived SI units which apply specifically to electrical quantities (SUPPORTS); Identify and determine values of base and derived SI units which apply specifically to electrical quantities (SUPPORTS)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, 9.5: electrical power and energy, P = VI and P = I^2 R [SUPPORTS, support=DIRECT, verification=UNVERIFIED] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC2.2: identify and determine values of base and derived SI units which apply specifically to electrical quantities [CURRICULUM_REQUIRES, verification=VERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_SUPPORTING

### EL-UNIT-KWH-001

**Statement (v1, APPROVED):** The kilowatt-hour (kWh) is a practical, non-SI unit of electrical energy, equal to the energy transferred by a one-kilowatt load running for one hour, commonly used for billing electricity usage.

**Direct prerequisites:** EL-UNIT-JOULE-001 (STRONG); EL-CONCEPT-ENERGY-001 (STRONG)
**Direct dependents:** EL-ENERGY-KWH-CALC-001
**Curriculum mapping(s):** Identify and determine values of base and derived SI units which apply specifically to electrical quantities (SUPPORTS); Identify and determine values of base and derived SI units which apply specifically to electrical quantities (SUPPORTS)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, 9.5: electrical power and energy, P = VI and P = I^2 R [SUPPORTS, support=DIRECT, verification=UNVERIFIED] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC2.2: identify and determine values of base and derived SI units which apply specifically to electrical quantities [CURRICULUM_REQUIRES, verification=VERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_SUPPORTING
**Misconceptions targeting this assertion:** MIS-EL-ENERGY-UNIT-CONFUSION-001

### EL-UNIT-BASE-VS-DERIVED-001

**Statement (v1, APPROVED):** The ampere is an SI base unit, while the volt, ohm, watt, joule and hertz are SI derived units formed from combinations of base units.

**Direct prerequisites:** EL-UNIT-AMPERE-001 (STRONG); EL-UNIT-VOLT-001 (STRONG)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Identify and use internationally recognised base and derived (SI) units of measurement (REQUIRED_FOR); Identify and use internationally recognised base and derived (SI) units of measurement (REQUIRED_FOR)
**Provenance:** The International System of Units (SI Brochure) — SI Brochure: table of SI derived units with special names, including the volt, ohm, watt and joule, and SI prefixes [DEFINES, support=DIRECT, verification=UNVERIFIED] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC2.1: identify and use internationally recognised base and derived (SI) units of measurement (Range: length, area, volume, mass, density, time, temperature, velocity) [CURRICULUM_REQUIRES, verification=VERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED

### EL-UNIT-HERTZ-001

**Statement (v1, APPROVED):** The hertz (Hz) is the SI derived unit of frequency, equal to one cycle per second.

**Direct prerequisites:** (none — root assertion)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Identify and determine values of base and derived SI units which apply specifically to electrical quantities (REQUIRED_FOR); Electrical quantities (SI units): Frequency (REQUIRED_FOR); Identify and determine values of base and derived SI units which apply specifically to electrical quantities (REQUIRED_FOR)
**Provenance:** The International System of Units (SI Brochure) — SI Brochure: table of SI derived units with special names, including the volt, ohm, watt and joule, and SI prefixes [DEFINES, support=DIRECT, verification=UNVERIFIED] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC2.2: identify and determine values of base and derived SI units which apply specifically to electrical quantities [CURRICULUM_REQUIRES, verification=VERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED

### EL-CONCEPT-FREQUENCY-001

**Statement (v1, APPROVED):** Frequency is the number of complete cycles of a repeating waveform that occur in one second.

**Direct prerequisites:** (none — root assertion)
**Direct dependents:** EL-CONCEPT-REACTANCE-001; EL-CIRCUIT-AC-SUPPLY-RECOGNITION-001; EL-WAVEFORM-FREQUENCY-PERIOD-RELATIONSHIP-001
**Curriculum mapping(s):** Identify and determine values of base and derived SI units which apply specifically to electrical quantities (REQUIRED_FOR); Electrical quantities (SI units): Frequency (REQUIRED_FOR); Characteristics of a sine-wave: Frequency (REQUIRED_FOR); Identify and determine values of base and derived SI units which apply specifically to electrical quantities (REQUIRED_FOR)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, Ch.13: magnetic flux and flux density (13.1 Faraday's Law); EMF; electric generators and the sinusoidal generated waveform (13.6) [DEFINES, support=DIRECT, verification=UNVERIFIED] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC2.2: identify and determine values of base and derived SI units which apply specifically to electrical quantities [CURRICULUM_REQUIRES, verification=VERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED

### EL-CONCEPT-REACTANCE-001

**Statement (v1, APPROVED):** Reactance is the opposition to current flow in an AC circuit caused by inductance or capacitance, and unlike resistance its value depends on the supply frequency.

**Direct prerequisites:** EL-CONCEPT-RESISTANCE-001 (STRONG); EL-CONCEPT-FREQUENCY-001 (STRONG)
**Direct dependents:** EL-CONCEPT-IMPEDANCE-001; EL-CONCEPT-INDUCTIVE-REACTANCE-001; EL-CONCEPT-CAPACITIVE-REACTANCE-001; EL-CIRCUIT-COMPARE-AC-DC-BEHAVIOUR-001
**Curriculum mapping(s):** Identify and determine values of base and derived SI units which apply specifically to electrical quantities (REQUIRED_FOR); Identify and determine values of base and derived SI units which apply specifically to electrical quantities (REQUIRED_FOR)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, Ch.15: impedance, reactance, inductance, capacitance and power factor in AC circuits [DEFINES, support=DIRECT, verification=UNVERIFIED] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC2.2: identify and determine values of base and derived SI units which apply specifically to electrical quantities [CURRICULUM_REQUIRES, verification=VERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED

### EL-CONCEPT-IMPEDANCE-001

**Statement (v1, APPROVED):** Impedance is the total opposition a circuit presents to the flow of alternating current, combining resistance and reactance; like resistance and reactance, it is measured in ohms.

**Direct prerequisites:** EL-CONCEPT-RESISTANCE-001 (REQUIRED); EL-CONCEPT-REACTANCE-001 (REQUIRED)
**Direct dependents:** EL-REL-IMPEDANCE-001; EL-CONCEPT-POWER-FACTOR-001
**Curriculum mapping(s):** Identify and determine values of base and derived SI units which apply specifically to electrical quantities (REQUIRED_FOR); Electrical quantities (SI units): Impedance (REQUIRED_FOR); Identify and determine values of base and derived SI units which apply specifically to electrical quantities (REQUIRED_FOR)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, Ch.15: impedance, reactance, inductance, capacitance and power factor in AC circuits [DEFINES, support=DIRECT, verification=UNVERIFIED] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC2.2: identify and determine values of base and derived SI units which apply specifically to electrical quantities [CURRICULUM_REQUIRES, verification=VERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED

### EL-REL-IMPEDANCE-001

**Statement (v1, APPROVED):** The magnitude of the impedance of a series AC circuit is given by Z = sqrt(R^2 + X^2), where R is the circuit's resistance and X is its net reactance.

**Direct prerequisites:** EL-CONCEPT-IMPEDANCE-001 (REQUIRED)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Identify and determine values of base and derived SI units which apply specifically to electrical quantities (REQUIRED_FOR); Electrical quantities (SI units): Impedance (REQUIRED_FOR); Identify and determine values of base and derived SI units which apply specifically to electrical quantities (REQUIRED_FOR)
**Provenance:** University Physics Volume 2 — "Z = sqrt(R^2 + (X_L - X_C)^2)" (Equation 15.11) -- the impedance magnitude of a series RLC AC circuit, combining resistance and net reactance [DEFINES, support=DIRECT, verification=UNVERIFIED] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC2.2: identify and determine values of base and derived SI units which apply specifically to electrical quantities [CURRICULUM_REQUIRES, verification=VERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED

### EL-UNIT-HENRY-001

**Statement (v1, APPROVED):** The henry (H) is the SI derived unit of inductance -- distinct from the ohm, the unit of inductive reactance.

**Direct prerequisites:** (none — root assertion)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Identify and determine values of base and derived SI units which apply specifically to electrical quantities (REQUIRED_FOR); Electrical quantities (SI units): Inductance and inductive reactance (REQUIRED_FOR); Identify and determine values of base and derived SI units which apply specifically to electrical quantities (REQUIRED_FOR)
**Provenance:** The International System of Units (SI Brochure) — SI Brochure: table of SI derived units with special names, including the volt, ohm, watt and joule, and SI prefixes [DEFINES, support=DIRECT, verification=UNVERIFIED] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC2.2: identify and determine values of base and derived SI units which apply specifically to electrical quantities [CURRICULUM_REQUIRES, verification=VERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED

### EL-CONCEPT-INDUCTANCE-001

**Statement (v1, APPROVED):** Inductance is the property of a conductor or coil that opposes a change in current by storing energy in a magnetic field, measured in henries.

**Direct prerequisites:** (none — root assertion)
**Direct dependents:** EL-CONCEPT-INDUCTIVE-REACTANCE-001
**Curriculum mapping(s):** Identify and determine values of base and derived SI units which apply specifically to electrical quantities (REQUIRED_FOR); Electrical quantities (SI units): Inductance and inductive reactance (REQUIRED_FOR); Identify and determine values of base and derived SI units which apply specifically to electrical quantities (REQUIRED_FOR)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, Ch.15: impedance, reactance, inductance, capacitance and power factor in AC circuits [DEFINES, support=DIRECT, verification=UNVERIFIED] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC2.2: identify and determine values of base and derived SI units which apply specifically to electrical quantities [CURRICULUM_REQUIRES, verification=VERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED

### EL-CONCEPT-INDUCTIVE-REACTANCE-001

**Statement (v1, APPROVED):** Inductive reactance is the opposition an inductor presents to alternating current; it increases as supply frequency increases, and is measured in ohms (not henries, the unit of inductance itself).

**Direct prerequisites:** EL-CONCEPT-INDUCTANCE-001 (REQUIRED); EL-CONCEPT-REACTANCE-001 (REQUIRED)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Identify and determine values of base and derived SI units which apply specifically to electrical quantities (REQUIRED_FOR); Electrical quantities (SI units): Inductance and inductive reactance (REQUIRED_FOR); Identify and determine values of base and derived SI units which apply specifically to electrical quantities (REQUIRED_FOR)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, Ch.15: impedance, reactance, inductance, capacitance and power factor in AC circuits [DEFINES, support=DIRECT, verification=UNVERIFIED] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC2.2: identify and determine values of base and derived SI units which apply specifically to electrical quantities [CURRICULUM_REQUIRES, verification=VERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED

### EL-UNIT-FARAD-001

**Statement (v1, APPROVED):** The farad (F) is the SI derived unit of capacitance -- distinct from the ohm, the unit of capacitive reactance.

**Direct prerequisites:** (none — root assertion)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Identify and determine values of base and derived SI units which apply specifically to electrical quantities (REQUIRED_FOR); Electrical quantities (SI units): Capacitance and capacitive reactance (REQUIRED_FOR); Identify and determine values of base and derived SI units which apply specifically to electrical quantities (REQUIRED_FOR)
**Provenance:** The International System of Units (SI Brochure) — SI Brochure: table of SI derived units with special names, including the volt, ohm, watt and joule, and SI prefixes [DEFINES, support=DIRECT, verification=UNVERIFIED] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC2.2: identify and determine values of base and derived SI units which apply specifically to electrical quantities [CURRICULUM_REQUIRES, verification=VERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED

### EL-CONCEPT-CAPACITANCE-001

**Statement (v1, APPROVED):** Capacitance is the property of a component that describes its ability to store electrical charge in an electric field, measured in farads.

**Direct prerequisites:** (none — root assertion)
**Direct dependents:** EL-CONCEPT-CAPACITIVE-REACTANCE-001; EL-COMPONENT-CAPACITOR-001
**Curriculum mapping(s):** Identify and determine values of base and derived SI units which apply specifically to electrical quantities (REQUIRED_FOR); Electrical quantities (SI units): Capacitance and capacitive reactance (REQUIRED_FOR); Electronic components and devices: Capacitors (REQUIRED_FOR); Identify and determine values of base and derived SI units which apply specifically to electrical quantities (REQUIRED_FOR)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, Ch.15: impedance, reactance, inductance, capacitance and power factor in AC circuits [DEFINES, support=DIRECT, verification=UNVERIFIED] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC2.2: identify and determine values of base and derived SI units which apply specifically to electrical quantities [CURRICULUM_REQUIRES, verification=VERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED

### EL-CONCEPT-CAPACITIVE-REACTANCE-001

**Statement (v1, APPROVED):** Capacitive reactance is the opposition a capacitor presents to alternating current; it decreases as supply frequency increases (the opposite frequency behaviour to inductive reactance), and is measured in ohms (not farads, the unit of capacitance itself).

**Direct prerequisites:** EL-CONCEPT-CAPACITANCE-001 (REQUIRED); EL-CONCEPT-REACTANCE-001 (REQUIRED)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Identify and determine values of base and derived SI units which apply specifically to electrical quantities (REQUIRED_FOR); Electrical quantities (SI units): Capacitance and capacitive reactance (REQUIRED_FOR); Identify and determine values of base and derived SI units which apply specifically to electrical quantities (REQUIRED_FOR)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, Ch.15: impedance, reactance, inductance, capacitance and power factor in AC circuits [DEFINES, support=DIRECT, verification=UNVERIFIED] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC2.2: identify and determine values of base and derived SI units which apply specifically to electrical quantities [CURRICULUM_REQUIRES, verification=VERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED

### EL-CONCEPT-POWER-FACTOR-001

**Statement (v1, APPROVED):** Power factor is the ratio of real (true) power to apparent power in an AC circuit; for a sinusoidal single-frequency supply, this ratio equals the cosine of the phase angle between voltage and current.

**Direct prerequisites:** EL-CONCEPT-IMPEDANCE-001 (STRONG); EL-CONCEPT-POWER-001 (STRONG)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Identify and determine values of base and derived SI units which apply specifically to electrical quantities (REQUIRED_FOR); Electrical quantities (SI units): Power factor (REQUIRED_FOR); Identify and determine values of base and derived SI units which apply specifically to electrical quantities (REQUIRED_FOR)
**Provenance:** NIST Handbook 44: Specifications, Tolerances, and Other Technical Requirements for Weighing and Measuring Devices -- Section 3.41, Non-Utility Electricity-Measuring Systems (Tentative Code) — Power factor (PF): the ratio of "active power" to "apparent power" in an AC circuit; it describes the efficient use of available power [DEFINES, support=PARTIAL, verification=UNVERIFIED] | University Physics Volume 2 — University Physics Volume 2, Ch.15: impedance, reactance, inductance, capacitance and power factor in AC circuits [DEFINES, support=PARTIAL, verification=UNVERIFIED] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC2.2: identify and determine values of base and derived SI units which apply specifically to electrical quantities [CURRICULUM_REQUIRES, verification=VERIFIED]
**Entailment result:** FULLY_SUPPORTED_MULTI_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED
**Clause coverage:** "power factor is the ratio of real (active) power to apparent power" -> NIST Handbook 44: Specifications, Tolerances, and Other Technical Requirements for Weighing and Measuring Devices -- Section 3.41, Non-Utility Electricity-Measuring Systems (Tentative Code) (loc-nist-hb44-power-factor); "for a sinusoidal single-frequency supply, this ratio equals the cosine of the phase angle" -> University Physics Volume 2 (loc-openstax-up2-ac-circuits)

### EL-CONCEPT-ELECTRICAL-EFFICIENCY-001

**Statement (v1, APPROVED):** The efficiency of an electrical device is the ratio of useful power output to electrical power input.

**Direct prerequisites:** FP-CONCEPT-EFFICIENCY-001 (REQUIRED); EL-CONCEPT-POWER-001 (REQUIRED)
**Direct dependents:** EL-CALC-ELECTRICAL-EFFICIENCY-001
**Curriculum mapping(s):** Describe the main principles of force, work, energy, power and efficiency and their inter-relationships (REQUIRED_FOR); Describe the main principles of the following and their inter-relationships: force, work, energy (kinetic and potential), power, efficiency (REQUIRED_FOR)
**Provenance:** University Physics Volume 1 — University Physics Volume 1, Ch.7.4: power as the rate at which work is done or energy is transferred, P = W / t [SUPPORTS, support=DIRECT, verification=UNVERIFIED] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC3.3: describe the main principles of force, work, energy, power and efficiency and their inter-relationships [CURRICULUM_REQUIRES, verification=VERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_SUPPORTING

### EL-CALC-ELECTRICAL-EFFICIENCY-001

**Statement (v1, APPROVED):** Calculate the efficiency of an electrical device as a percentage from its useful power output and its power input.

**Direct prerequisites:** EL-CONCEPT-ELECTRICAL-EFFICIENCY-001 (REQUIRED); FM-ARITH-PERCENTAGE-001 (REQUIRED); FM-ALG-SUBSTITUTION-001 (REQUIRED)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Calculate values of mechanical energy, power and efficiency (REQUIRED_FOR); Calculate values of mechanical energy, power and efficiency (REQUIRED_FOR)
**Provenance:** University Physics Volume 1 — University Physics Volume 1, Ch.7.4: power as the rate at which work is done or energy is transferred, P = W / t [SUPPORTS, support=DIRECT, verification=UNVERIFIED] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC3.4: calculate values of mechanical energy, power and efficiency [CURRICULUM_REQUIRES, verification=VERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED

### EL-CONCEPT-ELECTRON-THEORY-001

**Statement (v1, APPROVED):** Electric current in a conductor is the flow of free electrons, driven by a potential difference across the conductor.

**Direct prerequisites:** EL-CONCEPT-CURRENT-001 (STRONG); EL-CONCEPT-ATOMIC-CHARGE-STRUCTURE-001 (STRONG)
**Direct dependents:** EL-CONCEPT-CONDUCTOR-001; EL-CONCEPT-INSULATOR-001
**Curriculum mapping(s):** Describe the basic principles of electron theory (REQUIRED_FOR); Describe the basic principles of electron theory (REQUIRED_FOR)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, Ch.9: electric current as the flow of free charge carriers; conductors, insulators; thermal/chemical effects of current [DEFINES, support=DIRECT, verification=UNVERIFIED] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC4.1: describe the basic principles of electron theory [CURRICULUM_REQUIRES, verification=VERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED
**Misconceptions targeting this assertion:** MIS-EL-ELECTRON-CURRENT-DIRECTION-CONFUSION-001

### EL-CONCEPT-CONDUCTOR-001

**Statement (v1, APPROVED):** A conductor is a material containing many free electrons, which allows electric current to flow through it easily.

**Direct prerequisites:** EL-CONCEPT-ELECTRON-THEORY-001 (STRONG)
**Direct dependents:** EL-MATERIAL-CONDUCTOR-INSULATOR-EXAMPLES-001
**Curriculum mapping(s):** Identify and distinguish between materials which are good conductors and insulators (REQUIRED_FOR); Identify and distinguish between materials which are good conductors and insulators (REQUIRED_FOR)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, Ch.9: electric current as the flow of free charge carriers; conductors, insulators; thermal/chemical effects of current [DEFINES, support=DIRECT, verification=UNVERIFIED] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC4.2: identify and distinguish between materials which are good conductors and insulators [CURRICULUM_REQUIRES, verification=VERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED
**Misconceptions targeting this assertion:** MIS-EL-CONDUCTOR-INSULATOR-CONFUSION-001

### EL-CONCEPT-INSULATOR-001

**Statement (v1, APPROVED):** An insulator is a material with very few free electrons, which strongly opposes the flow of electric current.

**Direct prerequisites:** EL-CONCEPT-ELECTRON-THEORY-001 (STRONG)
**Direct dependents:** EL-MATERIAL-CONDUCTOR-INSULATOR-EXAMPLES-001; EL-INSULATOR-BREAKDOWN-001
**Curriculum mapping(s):** Identify and distinguish between materials which are good conductors and insulators (REQUIRED_FOR); Identify and distinguish between materials which are good conductors and insulators (REQUIRED_FOR)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, Ch.9: electric current as the flow of free charge carriers; conductors, insulators; thermal/chemical effects of current [DEFINES, support=DIRECT, verification=UNVERIFIED] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC4.2: identify and distinguish between materials which are good conductors and insulators [CURRICULUM_REQUIRES, verification=VERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED
**Misconceptions targeting this assertion:** MIS-EL-CONDUCTOR-INSULATOR-CONFUSION-001

### EL-RESISTIVITY-RELATIONSHIP-001

**Statement (v1, APPROVED):** The resistance of a conductor is related to its resistivity, length and cross-sectional area by R = rho times L divided by A.

**Direct prerequisites:** EL-CONCEPT-RESISTIVITY-001 (REQUIRED); EL-CONCEPT-RESISTANCE-001 (REQUIRED)
**Direct dependents:** EL-CONDUCTOR-RESISTANCE-FACTORS-001; EL-RESISTIVITY-LENGTH-EFFECT-001; EL-RESISTIVITY-AREA-EFFECT-001
**Curriculum mapping(s):** Describe what is meant by resistance and resistivity in relation to electrical circuits (REQUIRED_FOR); Describe what is meant by resistance and resistivity in relation to electrical circuits (REQUIRED_FOR)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, 9.3: resistance and resistivity, and R = rho L / A [DEFINES, support=DIRECT, verification=UNVERIFIED] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC4.3: describe what is meant by resistance and resistivity in relation to electrical circuits [CURRICULUM_REQUIRES, verification=VERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED

### EL-OHM-RELATIONSHIP-001

**Statement (v1, APPROVED):** For a component obeying Ohm's law, potential difference, current and resistance are related by V = I times R.

**Direct prerequisites:** EL-CONCEPT-VOLTAGE-001 (REQUIRED); EL-CONCEPT-CURRENT-001 (REQUIRED); EL-CONCEPT-RESISTANCE-001 (REQUIRED)
**Direct dependents:** EL-OHM-PROPORTIONALITY-001; EL-OHM-REARRANGE-001; EL-OHM-SOLVE-V-001; EL-VOLTAGE-DROP-001; EL-OHM-SELECT-RELATIONSHIP-001; EL-CIRCUIT-COMPARE-AC-DC-BEHAVIOUR-001; EL-CIRCUIT-ZERO-RESISTANCE-INTERPRETATION-001; EL-CIRCUIT-OPEN-CIRCUIT-RESISTANCE-INTERPRETATION-001
**Curriculum mapping(s):** Explain the relationship between current, voltage and resistance in parallel and series D.C. circuits (REQUIRED_FOR); Explain the relationship between current, voltage and resistance in parallel and series D.C. circuits (REQUIRED_FOR)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, 9.4: Ohm's law, V = IR, and voltage/potential difference [DEFINES, support=DIRECT, verification=UNVERIFIED] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC4.4: explain the relationship between current, voltage and resistance in parallel and series D.C. circuits [CURRICULUM_REQUIRES, verification=VERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED
**Misconceptions targeting this assertion:** MIS-EL-OHM-UNRELATED-SYMBOLS-001

### EL-OHM-PROPORTIONALITY-001

**Statement (v1, APPROVED):** At constant resistance, current is directly proportional to voltage; at constant voltage, current is inversely proportional to resistance.

**Direct prerequisites:** EL-OHM-RELATIONSHIP-001 (REQUIRED); FM-ALG-PROPORTION-DIRECT-001 (REQUIRED); FM-ALG-PROPORTION-INVERSE-001 (REQUIRED)
**Direct dependents:** EL-SERIES-PREDICT-ADD-RESISTOR-001; EL-PARALLEL-PREDICT-ADD-RESISTOR-001
**Curriculum mapping(s):** Explain the relationship between current, voltage and resistance in parallel and series D.C. circuits (REQUIRED_FOR); Explain the relationship between current, voltage and resistance in parallel and series D.C. circuits (REQUIRED_FOR)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, 9.4: Ohm's law, V = IR, and voltage/potential difference [SUPPORTS, support=DIRECT, verification=UNVERIFIED] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC4.4: explain the relationship between current, voltage and resistance in parallel and series D.C. circuits [CURRICULUM_REQUIRES, verification=VERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED
**Misconceptions targeting this assertion:** MIS-FM-PROPORTION-DIRECTION-CONFUSION-001

### EL-OHM-REARRANGE-001

**Statement (v1, APPROVED):** Rearrange V = I times R algebraically to make voltage, current or resistance the subject.

**Direct prerequisites:** EL-OHM-RELATIONSHIP-001 (REQUIRED); FM-ALG-TRANSPOSE-MULT-001 (REQUIRED)
**Direct dependents:** EL-OHM-SOLVE-I-001; EL-OHM-SOLVE-R-001
**Curriculum mapping(s):** Calculate the values of current, voltage and resistance in parallel and series D.C. circuits (REQUIRED_FOR); Identify and apply appropriate mathematical principles which are relevant to electrical work tasks (EXEMPLIFIES); Calculate the values of current, voltage and resistance in parallel and series D.C. circuits (REQUIRED_FOR); Identify and apply appropriate mathematical principles which are relevant to electrical work tasks (EXEMPLIFIES)
**Provenance:** City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC4.5: calculate the values of current, voltage and resistance in parallel and series D.C. circuits [CURRICULUM_REQUIRES, verification=VERIFIED]
**Derived from:** EL-OHM-RELATIONSHIP-001 [MATHEMATICAL]
**Entailment result:** FULLY_SUPPORTED_DERIVED
**Scope status (CC-09B.5):** IN_SCOPE_SUPPORTING
**Misconceptions targeting this assertion:** MIS-EL-OHM-REARRANGE-ERROR-001

### EL-OHM-SOLVE-V-001

**Statement (v1, APPROVED):** Calculate an unknown voltage from known current and resistance using V = I times R.

**Direct prerequisites:** EL-OHM-RELATIONSHIP-001 (REQUIRED); FM-ALG-SUBSTITUTION-001 (REQUIRED); FM-NUM-SI-PREFIX-CONVERT-001 (STRONG)
**Direct dependents:** EL-SERIES-VOLTAGE-CALC-001
**Curriculum mapping(s):** Calculate the values of current, voltage and resistance in parallel and series D.C. circuits (REQUIRED_FOR); Identify and apply appropriate mathematical principles which are relevant to electrical work tasks (EXEMPLIFIES); Calculate the values of current, voltage and resistance in parallel and series D.C. circuits (REQUIRED_FOR); Identify and apply appropriate mathematical principles which are relevant to electrical work tasks (EXEMPLIFIES)
**Provenance:** City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC4.5: calculate the values of current, voltage and resistance in parallel and series D.C. circuits [CURRICULUM_REQUIRES, verification=VERIFIED]
**Derived from:** EL-OHM-RELATIONSHIP-001 [MATHEMATICAL]
**Entailment result:** FULLY_SUPPORTED_DERIVED
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED
**Misconceptions targeting this assertion:** MIS-EL-SI-PREFIX-ERROR-001

### EL-OHM-SOLVE-I-001

**Statement (v1, APPROVED):** Calculate an unknown current from known voltage and resistance by rearranging and applying V = I times R.

**Direct prerequisites:** EL-OHM-REARRANGE-001 (REQUIRED); FM-ALG-SUBSTITUTION-001 (REQUIRED); FM-NUM-SI-PREFIX-CONVERT-001 (STRONG)
**Direct dependents:** EL-PARALLEL-CURRENT-CALC-001; EL-CIRCUIT-SUPPLY-CURRENT-SERIES-001; EL-CIRCUIT-SUPPLY-CURRENT-PARALLEL-001
**Curriculum mapping(s):** Calculate the values of current, voltage and resistance in parallel and series D.C. circuits (REQUIRED_FOR); Identify and apply appropriate mathematical principles which are relevant to electrical work tasks (EXEMPLIFIES); Calculate the values of current, voltage and resistance in parallel and series D.C. circuits (REQUIRED_FOR); Identify and apply appropriate mathematical principles which are relevant to electrical work tasks (EXEMPLIFIES)
**Provenance:** City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC4.5: calculate the values of current, voltage and resistance in parallel and series D.C. circuits [CURRICULUM_REQUIRES, verification=VERIFIED]
**Derived from:** EL-OHM-RELATIONSHIP-001 [MATHEMATICAL]
**Entailment result:** FULLY_SUPPORTED_DERIVED
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED
**Misconceptions targeting this assertion:** MIS-EL-OHM-WRONG-OPERATION-001, MIS-EL-SI-PREFIX-ERROR-001

### EL-OHM-SOLVE-R-001

**Statement (v1, APPROVED):** Calculate an unknown resistance from known voltage and current by rearranging and applying V = I times R.

**Direct prerequisites:** EL-OHM-REARRANGE-001 (REQUIRED); FM-ALG-SUBSTITUTION-001 (REQUIRED); FM-NUM-SI-PREFIX-CONVERT-001 (STRONG)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Calculate the values of current, voltage and resistance in parallel and series D.C. circuits (REQUIRED_FOR); Identify and apply appropriate mathematical principles which are relevant to electrical work tasks (EXEMPLIFIES); Calculate the values of current, voltage and resistance in parallel and series D.C. circuits (REQUIRED_FOR); Identify and apply appropriate mathematical principles which are relevant to electrical work tasks (EXEMPLIFIES)
**Provenance:** City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC4.5: calculate the values of current, voltage and resistance in parallel and series D.C. circuits [CURRICULUM_REQUIRES, verification=VERIFIED]
**Derived from:** EL-OHM-RELATIONSHIP-001 [MATHEMATICAL]
**Entailment result:** FULLY_SUPPORTED_DERIVED
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED
**Misconceptions targeting this assertion:** MIS-EL-OHM-WRONG-OPERATION-001, MIS-EL-SI-PREFIX-ERROR-001

### EL-CIRCUIT-SERIES-STRUCTURE-001

**Statement (v1, APPROVED):** In a series circuit, components are connected end-to-end so that there is only one path for current to flow.

**Direct prerequisites:** (none — root assertion)
**Direct dependents:** EL-SERIES-CURRENT-001; EL-SERIES-RESISTANCE-001; EL-SERIES-VOLTAGE-001; EL-CIRCUIT-SELECT-CONFIGURATION-001; EL-CIRCUIT-MIXED-SERIES-PARALLEL-RECOGNITION-001; EL-SERIES-PREDICT-OPEN-001
**Curriculum mapping(s):** Explain the relationship between current, voltage and resistance in parallel and series D.C. circuits (REQUIRED_FOR); Explain the relationship between current, voltage and resistance in parallel and series D.C. circuits (REQUIRED_FOR)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, 10.2: equivalent resistance for resistors in series and in parallel [DEFINES, support=DIRECT, verification=UNVERIFIED] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC4.4: explain the relationship between current, voltage and resistance in parallel and series D.C. circuits [CURRICULUM_REQUIRES, verification=VERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED
**Misconceptions targeting this assertion:** MIS-EL-SERIES-PARALLEL-CONFUSION-001

### EL-SERIES-CURRENT-001

**Statement (v1, APPROVED):** In a series circuit, the same current flows through every component.

**Direct prerequisites:** EL-CIRCUIT-SERIES-STRUCTURE-001 (REQUIRED); EL-CONCEPT-CURRENT-001 (STRONG)
**Direct dependents:** EL-CIRCUIT-COMPARE-CURRENT-001; EL-SERIES-PREDICT-OPEN-001; EL-SERIES-POWER-CALC-001
**Curriculum mapping(s):** Explain the relationship between current, voltage and resistance in parallel and series D.C. circuits (REQUIRED_FOR); Explain the relationship between current, voltage and resistance in parallel and series D.C. circuits (REQUIRED_FOR)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, 10.2: equivalent resistance for resistors in series and in parallel [DEFINES, support=DIRECT, verification=UNVERIFIED] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC4.4: explain the relationship between current, voltage and resistance in parallel and series D.C. circuits [CURRICULUM_REQUIRES, verification=VERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED

### EL-SERIES-RESISTANCE-001

**Statement (v1, APPROVED):** The total resistance of resistors connected in series is the sum of the individual resistances: RT = R1 + R2 + ...

**Direct prerequisites:** EL-CIRCUIT-SERIES-STRUCTURE-001 (REQUIRED); EL-CONCEPT-RESISTANCE-001 (REQUIRED)
**Direct dependents:** EL-SERIES-RESISTANCE-CALC-001; EL-CIRCUIT-COMPARE-RESISTANCE-001; EL-SERIES-PREDICT-ADD-RESISTOR-001
**Curriculum mapping(s):** Explain the relationship between current, voltage and resistance in parallel and series D.C. circuits (REQUIRED_FOR); Explain the relationship between current, voltage and resistance in parallel and series D.C. circuits (REQUIRED_FOR)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, 10.2: equivalent resistance for resistors in series and in parallel [DEFINES, support=DIRECT, verification=UNVERIFIED] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC4.4: explain the relationship between current, voltage and resistance in parallel and series D.C. circuits [CURRICULUM_REQUIRES, verification=VERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED

### EL-SERIES-RESISTANCE-CALC-001

**Statement (v1, APPROVED):** Calculate the total resistance of resistors connected in series.

**Direct prerequisites:** EL-SERIES-RESISTANCE-001 (REQUIRED); FM-ALG-SUBSTITUTION-001 (REQUIRED)
**Direct dependents:** EL-INTERPRET-SERIES-RESULT-001; EL-CIRCUIT-SUPPLY-CURRENT-SERIES-001
**Curriculum mapping(s):** Calculate the values of current, voltage and resistance in parallel and series D.C. circuits (REQUIRED_FOR); Identify and apply appropriate mathematical principles which are relevant to electrical work tasks (EXEMPLIFIES); Calculate the values of current, voltage and resistance in parallel and series D.C. circuits (REQUIRED_FOR); Identify and apply appropriate mathematical principles which are relevant to electrical work tasks (EXEMPLIFIES)
**Provenance:** City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC4.5: calculate the values of current, voltage and resistance in parallel and series D.C. circuits [CURRICULUM_REQUIRES, verification=VERIFIED]
**Derived from:** EL-SERIES-RESISTANCE-001 [MATHEMATICAL]
**Entailment result:** FULLY_SUPPORTED_DERIVED
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED

### EL-INTERPRET-SERIES-RESULT-001

**Statement (v1, APPROVED):** A calculated total resistance for resistors in series that is less than the largest individual resistance indicates a calculation error, since total series resistance is always at least as great as the largest individual resistance.

**Direct prerequisites:** EL-SERIES-RESISTANCE-CALC-001 (STRONG)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Calculate the values of current, voltage and resistance in parallel and series D.C. circuits (SUPPORTS); Calculate the values of current, voltage and resistance in parallel and series D.C. circuits (SUPPORTS)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, 10.2: equivalent resistance for resistors in series and in parallel [SUPPORTS, support=DIRECT, verification=UNVERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_SUPPORTING

### EL-VOLTAGE-DROP-001

**Statement (v1, APPROVED):** Voltage drop is the reduction in potential difference across a component or conductor caused by current flowing through its resistance.

**Direct prerequisites:** EL-OHM-RELATIONSHIP-001 (STRONG)
**Direct dependents:** EL-SERIES-VOLTAGE-001; EL-CIRCUIT-ZERO-RESISTANCE-INTERPRETATION-001
**Curriculum mapping(s):** State what is meant by the term voltage drop in relation to electrical circuits (REQUIRED_FOR); State what is meant by the term voltage drop in relation to electrical circuits (REQUIRED_FOR)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, 9.4: Ohm's law, V = IR, and voltage/potential difference [DEFINES, support=DIRECT, verification=UNVERIFIED] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC4.7: state what is meant by the term voltage drop in relation to electrical circuits [CURRICULUM_REQUIRES, verification=VERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED
**Misconceptions targeting this assertion:** MIS-EL-VOLTAGE-DROP-MISUNDERSTANDING-001

### EL-SERIES-VOLTAGE-001

**Statement (v1, APPROVED):** In a series circuit, the supply voltage is shared between the components as individual voltage drops that sum to the supply voltage.

**Direct prerequisites:** EL-VOLTAGE-DROP-001 (REQUIRED); EL-CIRCUIT-SERIES-STRUCTURE-001 (REQUIRED); FM-ALG-TRANSPOSE-ADD-001 (STRONG)
**Direct dependents:** EL-CONCEPT-KIRCHHOFFS-VOLTAGE-LAW-001; EL-SERIES-VOLTAGE-CALC-001; EL-CIRCUIT-COMPARE-VOLTAGE-001; EL-SERIES-DOMINANT-RESISTOR-001; EL-SERIES-VOLTAGE-DIVIDER-001
**Curriculum mapping(s):** Explain the relationship between current, voltage and resistance in parallel and series D.C. circuits (REQUIRED_FOR); Explain the relationship between current, voltage and resistance in parallel and series D.C. circuits (REQUIRED_FOR)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, 10.2: equivalent resistance for resistors in series and in parallel [DEFINES, support=DIRECT, verification=UNVERIFIED] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC4.4: explain the relationship between current, voltage and resistance in parallel and series D.C. circuits [CURRICULUM_REQUIRES, verification=VERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED
**Misconceptions targeting this assertion:** MIS-EL-VOLTAGE-DROP-MISUNDERSTANDING-001

### EL-CONCEPT-KIRCHHOFFS-VOLTAGE-LAW-001

**Statement (v1, APPROVED):** Kirchhoff's voltage law states that the algebraic sum of the voltages around any closed loop of a circuit is zero -- in a series circuit this means the individual voltage drops sum to the supply voltage.

**Direct prerequisites:** EL-SERIES-VOLTAGE-001 (REQUIRED)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Explain the relationship between current, voltage and resistance in parallel and series D.C. circuits (SUPPORTS); Explain the relationship between current, voltage and resistance in parallel and series D.C. circuits (SUPPORTS)
**Provenance:** Electric Circuits I - Direct Current (Kuphaldt) — Kirchhoff's Voltage Law (KVL): "the algebraic sum of all voltages in a loop must equal zero"; Kirchhoff's Current Law (KCL): "the algebraic sum of all currents entering and exiting a node must equal zero" -- "these Laws deserve to be memorized by the electronics student every bit as much as Ohm's Law" [DEFINES, support=DIRECT, verification=UNVERIFIED] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC4.4: explain the relationship between current, voltage and resistance in parallel and series D.C. circuits [CURRICULUM_REQUIRES, verification=VERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_SUPPORTING

### EL-SERIES-VOLTAGE-CALC-001

**Statement (v1, APPROVED):** Calculate an individual voltage drop across a component in a series circuit.

**Direct prerequisites:** EL-SERIES-VOLTAGE-001 (REQUIRED); EL-OHM-SOLVE-V-001 (REQUIRED)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Calculate the values of current, voltage and resistance in parallel and series D.C. circuits (REQUIRED_FOR); Identify and apply appropriate mathematical principles which are relevant to electrical work tasks (EXEMPLIFIES); Calculate the values of current, voltage and resistance in parallel and series D.C. circuits (REQUIRED_FOR); Identify and apply appropriate mathematical principles which are relevant to electrical work tasks (EXEMPLIFIES)
**Provenance:** City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC4.5: calculate the values of current, voltage and resistance in parallel and series D.C. circuits [CURRICULUM_REQUIRES, verification=VERIFIED]
**Derived from:** EL-SERIES-VOLTAGE-001 [MATHEMATICAL]; EL-OHM-RELATIONSHIP-001 [MATHEMATICAL]
**Entailment result:** FULLY_SUPPORTED_DERIVED
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED

### EL-CIRCUIT-PARALLEL-STRUCTURE-001

**Statement (v1, APPROVED):** In a parallel circuit, components are connected between the same two points, providing more than one path for current to flow.

**Direct prerequisites:** (none — root assertion)
**Direct dependents:** EL-PARALLEL-VOLTAGE-001; EL-PARALLEL-CURRENT-001; EL-PARALLEL-RESISTANCE-001; EL-CIRCUIT-SELECT-CONFIGURATION-001; EL-CIRCUIT-MIXED-SERIES-PARALLEL-RECOGNITION-001; EL-PARALLEL-PREDICT-OPEN-001
**Curriculum mapping(s):** Explain the relationship between current, voltage and resistance in parallel and series D.C. circuits (REQUIRED_FOR); Explain the relationship between current, voltage and resistance in parallel and series D.C. circuits (REQUIRED_FOR)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, 10.2: equivalent resistance for resistors in series and in parallel [DEFINES, support=DIRECT, verification=UNVERIFIED] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC4.4: explain the relationship between current, voltage and resistance in parallel and series D.C. circuits [CURRICULUM_REQUIRES, verification=VERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED
**Misconceptions targeting this assertion:** MIS-EL-SERIES-PARALLEL-CONFUSION-001

### EL-PARALLEL-VOLTAGE-001

**Statement (v1, APPROVED):** In a parallel circuit, the potential difference is the same across every branch.

**Direct prerequisites:** EL-CIRCUIT-PARALLEL-STRUCTURE-001 (REQUIRED); EL-CONCEPT-VOLTAGE-001 (STRONG)
**Direct dependents:** EL-CIRCUIT-COMPARE-VOLTAGE-001; EL-PARALLEL-PREDICT-OPEN-001; EL-PARALLEL-POWER-CALC-001
**Curriculum mapping(s):** Explain the relationship between current, voltage and resistance in parallel and series D.C. circuits (REQUIRED_FOR); Explain the relationship between current, voltage and resistance in parallel and series D.C. circuits (REQUIRED_FOR)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, 10.2: equivalent resistance for resistors in series and in parallel [DEFINES, support=DIRECT, verification=UNVERIFIED] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC4.4: explain the relationship between current, voltage and resistance in parallel and series D.C. circuits [CURRICULUM_REQUIRES, verification=VERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED

### EL-PARALLEL-CURRENT-001

**Statement (v1, APPROVED):** In a parallel circuit, the supply current divides between the branches, and the branch currents sum to the total current.

**Direct prerequisites:** EL-CIRCUIT-PARALLEL-STRUCTURE-001 (REQUIRED); EL-CONCEPT-CURRENT-001 (REQUIRED); FM-ALG-TRANSPOSE-ADD-001 (STRONG)
**Direct dependents:** EL-CONCEPT-KIRCHHOFFS-CURRENT-LAW-001; EL-PARALLEL-CURRENT-CALC-001; EL-CIRCUIT-COMPARE-CURRENT-001; EL-PARALLEL-DOMINANT-RESISTOR-001; EL-PARALLEL-CURRENT-DIVIDER-001
**Curriculum mapping(s):** Explain the relationship between current, voltage and resistance in parallel and series D.C. circuits (REQUIRED_FOR); Explain the relationship between current, voltage and resistance in parallel and series D.C. circuits (REQUIRED_FOR)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, 10.2: equivalent resistance for resistors in series and in parallel [DEFINES, support=DIRECT, verification=UNVERIFIED] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC4.4: explain the relationship between current, voltage and resistance in parallel and series D.C. circuits [CURRICULUM_REQUIRES, verification=VERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED

### EL-CONCEPT-KIRCHHOFFS-CURRENT-LAW-001

**Statement (v1, APPROVED):** Kirchhoff's current law states that the algebraic sum of the currents entering and leaving any point in a circuit is zero -- in a parallel circuit this means the branch currents sum to the total supply current.

**Direct prerequisites:** EL-PARALLEL-CURRENT-001 (REQUIRED)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Explain the relationship between current, voltage and resistance in parallel and series D.C. circuits (SUPPORTS); Explain the relationship between current, voltage and resistance in parallel and series D.C. circuits (SUPPORTS)
**Provenance:** Electric Circuits I - Direct Current (Kuphaldt) — Kirchhoff's Voltage Law (KVL): "the algebraic sum of all voltages in a loop must equal zero"; Kirchhoff's Current Law (KCL): "the algebraic sum of all currents entering and exiting a node must equal zero" -- "these Laws deserve to be memorized by the electronics student every bit as much as Ohm's Law" [DEFINES, support=DIRECT, verification=UNVERIFIED] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC4.4: explain the relationship between current, voltage and resistance in parallel and series D.C. circuits [CURRICULUM_REQUIRES, verification=VERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_SUPPORTING

### EL-PARALLEL-RESISTANCE-001

**Statement (v1, APPROVED):** The reciprocal of the total resistance of resistors connected in parallel equals the sum of the reciprocals of the individual branch resistances.

**Direct prerequisites:** EL-CIRCUIT-PARALLEL-STRUCTURE-001 (REQUIRED); EL-CONCEPT-RESISTANCE-001 (REQUIRED); FM-ARITH-RECIPROCAL-001 (REQUIRED)
**Direct dependents:** EL-PARALLEL-RESISTANCE-CALC-001; EL-CIRCUIT-COMPARE-RESISTANCE-001; EL-PARALLEL-PREDICT-ADD-RESISTOR-001
**Curriculum mapping(s):** Explain the relationship between current, voltage and resistance in parallel and series D.C. circuits (REQUIRED_FOR); Explain the relationship between current, voltage and resistance in parallel and series D.C. circuits (REQUIRED_FOR)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, 10.2: equivalent resistance for resistors in series and in parallel [DEFINES, support=DIRECT, verification=UNVERIFIED] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC4.4: explain the relationship between current, voltage and resistance in parallel and series D.C. circuits [CURRICULUM_REQUIRES, verification=VERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED
**Misconceptions targeting this assertion:** MIS-EL-PARALLEL-RESISTANCE-ADDITION-001

### EL-PARALLEL-RESISTANCE-CALC-001

**Statement (v1, APPROVED):** Calculate the total resistance of resistors connected in parallel.

**Direct prerequisites:** EL-PARALLEL-RESISTANCE-001 (REQUIRED); FM-ARITH-RECIPROCAL-SUM-001 (REQUIRED); FM-ARITH-RECIPROCAL-INVERT-001 (REQUIRED); FM-ALG-TRANSPOSE-ADD-001 (REQUIRED)
**Direct dependents:** EL-INTERPRET-PARALLEL-RESULT-001; EL-CIRCUIT-SUPPLY-CURRENT-PARALLEL-001
**Curriculum mapping(s):** Calculate the values of current, voltage and resistance in parallel and series D.C. circuits (REQUIRED_FOR); Identify and apply appropriate mathematical principles which are relevant to electrical work tasks (EXEMPLIFIES); Calculate the values of current, voltage and resistance in parallel and series D.C. circuits (REQUIRED_FOR); Identify and apply appropriate mathematical principles which are relevant to electrical work tasks (EXEMPLIFIES)
**Provenance:** City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC4.5: calculate the values of current, voltage and resistance in parallel and series D.C. circuits [CURRICULUM_REQUIRES, verification=VERIFIED] | University Physics Volume 2 — University Physics Volume 2, 10.2: equivalent resistance for resistors in series and in parallel [SUPPORTS, support=DIRECT, verification=UNVERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED
**Misconceptions targeting this assertion:** MIS-EL-PARALLEL-RESISTANCE-ADDITION-001, MIS-EL-RECIPROCAL-FORGOTTEN-INVERT-001

### EL-INTERPRET-PARALLEL-RESULT-001

**Statement (v1, APPROVED):** A calculated total resistance for resistors in parallel that is greater than the smallest branch resistance indicates a calculation error, since total parallel resistance is always less than the smallest branch resistance.

**Direct prerequisites:** EL-PARALLEL-RESISTANCE-CALC-001 (STRONG)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Calculate the values of current, voltage and resistance in parallel and series D.C. circuits (SUPPORTS); Calculate the values of current, voltage and resistance in parallel and series D.C. circuits (SUPPORTS)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, 10.2: equivalent resistance for resistors in series and in parallel [SUPPORTS, support=DIRECT, verification=UNVERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_SUPPORTING

### EL-PARALLEL-CURRENT-CALC-001

**Statement (v1, APPROVED):** Calculate an individual branch current in a parallel circuit.

**Direct prerequisites:** EL-PARALLEL-CURRENT-001 (REQUIRED); EL-OHM-SOLVE-I-001 (REQUIRED)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Calculate the values of current, voltage and resistance in parallel and series D.C. circuits (REQUIRED_FOR); Identify and apply appropriate mathematical principles which are relevant to electrical work tasks (EXEMPLIFIES); Calculate the values of current, voltage and resistance in parallel and series D.C. circuits (REQUIRED_FOR); Identify and apply appropriate mathematical principles which are relevant to electrical work tasks (EXEMPLIFIES)
**Provenance:** City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC4.5: calculate the values of current, voltage and resistance in parallel and series D.C. circuits [CURRICULUM_REQUIRES, verification=VERIFIED]
**Derived from:** EL-PARALLEL-CURRENT-001 [MATHEMATICAL]; EL-OHM-RELATIONSHIP-001 [MATHEMATICAL]
**Entailment result:** FULLY_SUPPORTED_DERIVED
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED

### EL-POWER-RELATIONSHIP-001

**Statement (v1, APPROVED):** Electrical power is related to voltage and current by P = V times I.

**Direct prerequisites:** EL-CONCEPT-POWER-001 (REQUIRED); EL-CONCEPT-VOLTAGE-001 (REQUIRED); EL-CONCEPT-CURRENT-001 (REQUIRED)
**Direct dependents:** EL-POWER-REARRANGE-001; EL-POWER-SOLVE-001
**Curriculum mapping(s):** Calculate values of power in parallel and series D.C. circuits (REQUIRED_FOR); Calculate values of power in parallel and series D.C. circuits (REQUIRED_FOR)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, 9.5: electrical power and energy, P = VI and P = I^2 R [DEFINES, support=DIRECT, verification=UNVERIFIED] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC4.6: calculate values of power in parallel and series D.C. circuits [CURRICULUM_REQUIRES, verification=VERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED

### EL-POWER-REARRANGE-001

**Statement (v1, APPROVED):** Rearrange P = V times I algebraically to make voltage or current the subject.

**Direct prerequisites:** EL-POWER-RELATIONSHIP-001 (REQUIRED); FM-ALG-TRANSPOSE-MULT-001 (REQUIRED)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Calculate values of power in parallel and series D.C. circuits (REQUIRED_FOR); Identify and apply appropriate mathematical principles which are relevant to electrical work tasks (EXEMPLIFIES); Calculate values of power in parallel and series D.C. circuits (REQUIRED_FOR); Identify and apply appropriate mathematical principles which are relevant to electrical work tasks (EXEMPLIFIES)
**Provenance:** City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC4.6: calculate values of power in parallel and series D.C. circuits [CURRICULUM_REQUIRES, verification=VERIFIED]
**Derived from:** EL-POWER-RELATIONSHIP-001 [MATHEMATICAL]
**Entailment result:** FULLY_SUPPORTED_DERIVED
**Scope status (CC-09B.5):** IN_SCOPE_SUPPORTING
**Misconceptions targeting this assertion:** MIS-EL-OHM-REARRANGE-ERROR-001

### EL-POWER-SOLVE-001

**Statement (v1, APPROVED):** Calculate electrical power from known voltage and current using P = V times I.

**Direct prerequisites:** EL-POWER-RELATIONSHIP-001 (REQUIRED); FM-ALG-SUBSTITUTION-001 (REQUIRED)
**Direct dependents:** EL-CIRCUIT-POWER-TOTAL-001
**Curriculum mapping(s):** Calculate values of power in parallel and series D.C. circuits (REQUIRED_FOR); Identify and apply appropriate mathematical principles which are relevant to electrical work tasks (EXEMPLIFIES); Calculate values of power in parallel and series D.C. circuits (REQUIRED_FOR); Identify and apply appropriate mathematical principles which are relevant to electrical work tasks (EXEMPLIFIES)
**Provenance:** City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC4.6: calculate values of power in parallel and series D.C. circuits [CURRICULUM_REQUIRES, verification=VERIFIED]
**Derived from:** EL-POWER-RELATIONSHIP-001 [MATHEMATICAL]
**Entailment result:** FULLY_SUPPORTED_DERIVED
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED

### EL-POWER-DERIVED-VIR-001

**Statement (v1, APPROVED):** Electrical power can also be found from current and resistance alone, since combining P = V times I with V = I times R gives P = I squared times R.

**Direct prerequisites:** (none — root assertion)
**Direct dependents:** EL-POWER-SOLVE-IR-001; EL-SERIES-DOMINANT-RESISTOR-001
**Curriculum mapping(s):** Calculate values of power in parallel and series D.C. circuits (REQUIRED_FOR); Calculate values of power in parallel and series D.C. circuits (REQUIRED_FOR)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, 9.5: electrical power and energy, P = VI and P = I^2 R [SUPPORTS, support=DIRECT, verification=UNVERIFIED]
**Derived from:** EL-POWER-RELATIONSHIP-001 [MATHEMATICAL]; EL-OHM-RELATIONSHIP-001 [MATHEMATICAL]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED

### EL-POWER-SOLVE-IR-001

**Statement (v1, APPROVED):** Calculate electrical power from known current and resistance using P = I squared times R.

**Direct prerequisites:** EL-POWER-DERIVED-VIR-001 (REQUIRED); FM-ALG-SUBSTITUTION-001 (REQUIRED)
**Direct dependents:** EL-THERMAL-EFFECT-FACTORS-001; EL-SERIES-POWER-CALC-001
**Curriculum mapping(s):** Calculate values of power in parallel and series D.C. circuits (REQUIRED_FOR); Identify and apply appropriate mathematical principles which are relevant to electrical work tasks (EXEMPLIFIES); Calculate values of power in parallel and series D.C. circuits (REQUIRED_FOR); Identify and apply appropriate mathematical principles which are relevant to electrical work tasks (EXEMPLIFIES)
**Provenance:** City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC4.6: calculate values of power in parallel and series D.C. circuits [CURRICULUM_REQUIRES, verification=VERIFIED]
**Derived from:** EL-POWER-DERIVED-VIR-001 [MATHEMATICAL]
**Entailment result:** FULLY_SUPPORTED_DERIVED
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED

### EL-CIRCUIT-POWER-TOTAL-001

**Statement (v1, APPROVED):** The total power dissipated in a circuit is the sum of the power dissipated in each individual component, regardless of whether the components are connected in series or parallel.

**Direct prerequisites:** EL-POWER-SOLVE-001 (REQUIRED)
**Direct dependents:** EL-CIRCUIT-COMPARE-POWER-001
**Curriculum mapping(s):** Calculate values of power in parallel and series D.C. circuits (REQUIRED_FOR); Calculate values of power in parallel and series D.C. circuits (REQUIRED_FOR)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, 9.5: electrical power and energy, P = VI and P = I^2 R [SUPPORTS, support=DIRECT, verification=UNVERIFIED] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC4.6: calculate values of power in parallel and series D.C. circuits [CURRICULUM_REQUIRES, verification=VERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_SUPPORTING

### EL-CURRENT-THERMAL-EFFECT-001

**Statement (v1, APPROVED):** Current flowing through a resistance causes heating, because electrical energy is converted into heat energy.

**Direct prerequisites:** EL-CONCEPT-RESISTANCE-001 (STRONG); EL-CONCEPT-ENERGY-001 (STRONG)
**Direct dependents:** EL-PROTECTIVE-DEVICE-PURPOSE-001; EL-FUSE-OPERATION-001; EL-THERMAL-EFFECT-APPLICATION-001; EL-WAVEFORM-RMS-001
**Curriculum mapping(s):** Describe the chemical and thermal effects of electric currents (REQUIRED_FOR); Describe the chemical and thermal effects of electric currents (REQUIRED_FOR)
**Provenance:** University Physics Volume 2 — Fuse: "a device that protects a circuit from currents that are too high... The piece of wire in the fuse is under tension and has a low melting point. The wire is designed to heat up and break at the rated current." Circuit breaker: "also rated for a maximum current, and open to protect the circuit, but can be reset. Circuit breakers react much faster." Also discusses resistive heating in light bulbs/resistors ("electrical energy supplied to the light bulbs is converted into heat and light") [DEFINES, support=DIRECT, verification=UNVERIFIED] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC4.8: describe the chemical and thermal effects of electric currents [CURRICULUM_REQUIRES, verification=VERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED

### EL-CURRENT-CHEMICAL-EFFECT-001

**Statement (v1, APPROVED):** Current flowing through certain solutions (electrolytes) causes chemical changes, a process known as electrolysis.

**Direct prerequisites:** EL-CONCEPT-CURRENT-001 (STRONG)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Describe the chemical and thermal effects of electric currents (REQUIRED_FOR); Describe the chemical and thermal effects of electric currents (REQUIRED_FOR)
**Provenance:** Chemistry 2e — Electrolysis: "an external circuit does work on a redox system by imposing a voltage sufficient to drive an otherwise nonspontaneous reaction" -- i.e. an externally applied electric current/voltage forces a chemical change (a redox reaction) in an electrolyte that would not occur spontaneously [DEFINES, support=DIRECT, verification=UNVERIFIED] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC4.8: describe the chemical and thermal effects of electric currents [CURRICULUM_REQUIRES, verification=VERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED

### EL-CONCEPT-CHARGE-001

**Statement (v1, APPROVED):** Electric charge is a fundamental property of matter that causes it to experience a force in an electric field, and can be positive or negative.

**Direct prerequisites:** (none — root assertion)
**Direct dependents:** EL-CONCEPT-ATOMIC-CHARGE-STRUCTURE-001; EL-CURRENT-CHARGE-RELATIONSHIP-001
**Curriculum mapping(s):** Describe the basic principles of electron theory (REQUIRED_FOR); Describe the basic principles of electron theory (REQUIRED_FOR)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, Ch.9: electric current as the flow of free charge carriers; conductors, insulators; thermal/chemical effects of current [DEFINES, support=DIRECT, verification=UNVERIFIED] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC4.1: describe the basic principles of electron theory [CURRICULUM_REQUIRES, verification=VERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_SUPPORTING

### EL-CONCEPT-ATOMIC-CHARGE-STRUCTURE-001

**Statement (v1, APPROVED):** An atom consists of a nucleus containing positively charged protons, surrounded by negatively charged electrons; in a conductor, some of these electrons are only loosely bound to their atoms and are free to move.

**Direct prerequisites:** EL-CONCEPT-CHARGE-001 (REQUIRED)
**Direct dependents:** EL-CONCEPT-ELECTRON-THEORY-001
**Curriculum mapping(s):** Describe the basic principles of electron theory (REQUIRED_FOR); Describe the basic principles of electron theory (REQUIRED_FOR)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, Ch.9: electric current as the flow of free charge carriers; conductors, insulators; thermal/chemical effects of current [DEFINES, support=DIRECT, verification=UNVERIFIED] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC4.1: describe the basic principles of electron theory [CURRICULUM_REQUIRES, verification=VERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_SUPPORTING

### EL-UNIT-COULOMB-001

**Statement (v1, APPROVED):** The coulomb (C) is the SI derived unit of electric charge.

**Direct prerequisites:** (none — root assertion)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Identify and determine values of base and derived SI units which apply specifically to electrical quantities (REQUIRED_FOR); Identify and determine values of base and derived SI units which apply specifically to electrical quantities (REQUIRED_FOR)
**Provenance:** The International System of Units (SI Brochure) — SI Brochure: table of SI derived units with special names, including the volt, ohm, watt and joule, and SI prefixes [DEFINES, support=DIRECT, verification=UNVERIFIED] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC2.2: identify and determine values of base and derived SI units which apply specifically to electrical quantities [CURRICULUM_REQUIRES, verification=VERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED

### EL-CURRENT-CHARGE-RELATIONSHIP-001

**Statement (v1, APPROVED):** Electric current equals the rate of flow of charge: I = Q divided by t.

**Direct prerequisites:** EL-CONCEPT-CHARGE-001 (REQUIRED); EL-CONCEPT-CURRENT-001 (REQUIRED)
**Direct dependents:** EL-CURRENT-CHARGE-CALC-001
**Curriculum mapping(s):** Describe the basic principles of electron theory (REQUIRED_FOR); Describe the basic principles of electron theory (REQUIRED_FOR)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, Ch.9: electric current as the flow of free charge carriers; conductors, insulators; thermal/chemical effects of current [DEFINES, support=DIRECT, verification=UNVERIFIED] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC4.1: describe the basic principles of electron theory [CURRICULUM_REQUIRES, verification=VERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_SUPPORTING
**Misconceptions targeting this assertion:** MIS-EL-ELECTRON-CURRENT-DIRECTION-CONFUSION-001

### EL-CURRENT-CHARGE-CALC-001

**Statement (v1, APPROVED):** Calculate charge or current from the relationship I = Q divided by t, given the other two quantities.

**Direct prerequisites:** EL-CURRENT-CHARGE-RELATIONSHIP-001 (REQUIRED); FM-ALG-TRANSPOSE-MULT-001 (REQUIRED); FM-ALG-SUBSTITUTION-001 (REQUIRED)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Calculate the values of current, voltage and resistance in parallel and series D.C. circuits (REQUIRED_FOR); Identify and apply appropriate mathematical principles which are relevant to electrical work tasks (EXEMPLIFIES); Calculate the values of current, voltage and resistance in parallel and series D.C. circuits (REQUIRED_FOR); Identify and apply appropriate mathematical principles which are relevant to electrical work tasks (EXEMPLIFIES)
**Provenance:** City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC4.5: calculate the values of current, voltage and resistance in parallel and series D.C. circuits [CURRICULUM_REQUIRES, verification=VERIFIED]
**Derived from:** EL-CURRENT-CHARGE-RELATIONSHIP-001 [MATHEMATICAL]
**Entailment result:** FULLY_SUPPORTED_DERIVED
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED

### EL-MATERIAL-CONDUCTOR-INSULATOR-EXAMPLES-001

**Statement (v1, APPROVED):** Common conductors used in electrical installation work include copper and aluminium; common insulators include PVC and rubber.

**Direct prerequisites:** EL-CONCEPT-CONDUCTOR-001 (STRONG); EL-CONCEPT-INSULATOR-001 (STRONG)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Identify and distinguish between materials which are good conductors and insulators (REQUIRED_FOR); Identify and distinguish between materials which are good conductors and insulators (REQUIRED_FOR)
**Provenance:** University Physics Volume 2 — Table 9.1 lists real named materials by category: conductors include silver, copper, gold, aluminum, tungsten, iron, platinum, steel, lead; insulators include amber, glass, Lucite, mica, quartz (fused), rubber (hard), sulfur, Teflon, wood -- with resistivity/conductivity values for each [SUPPORTS, support=PARTIAL, verification=UNVERIFIED] | 6242Y PVC Flat Wiring Cable with Bare CPC (BS 6004, 300/500V) -- Datasheet — Prysmian 6242Y (BS 6004, 300/500V, "suitable for fixed installation in industrial, commercial and domestic premises"): Conductor material = Copper; Core insulation material = Polyvinyl chloride (PVC); Material outer sheath = Polyvinyl chloride (PVC) [SUPPORTS, support=PARTIAL, verification=UNVERIFIED] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC4.2: identify and distinguish between materials which are good conductors and insulators [CURRICULUM_REQUIRES, verification=VERIFIED]
**Entailment result:** FULLY_SUPPORTED_MULTI_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_SUPPORTING
**Clause coverage:** "copper and aluminium are conductors; rubber is an insulator" -> University Physics Volume 2 (loc-openstax-up2-resistivity-table-materials); "PVC is an insulator used for cable conductor/sheath insulation in real electrical installation cable" -> 6242Y PVC Flat Wiring Cable with Bare CPC (BS 6004, 300/500V) -- Datasheet (loc-prysmian-6242y-construction)

### EL-CONDUCTOR-RESISTANCE-FACTORS-001

**Statement (v1, APPROVED):** The resistance of a conductor depends on its length, its cross-sectional area, its resistivity and its temperature.

**Direct prerequisites:** EL-RESISTIVITY-RELATIONSHIP-001 (STRONG)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Describe what is meant by resistance and resistivity in relation to electrical circuits (REQUIRED_FOR); Describe what is meant by resistance and resistivity in relation to electrical circuits (REQUIRED_FOR)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, 9.3: resistance and resistivity, and R = rho L / A [SUPPORTS, support=DIRECT, verification=UNVERIFIED] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC4.3: describe what is meant by resistance and resistivity in relation to electrical circuits [CURRICULUM_REQUIRES, verification=VERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED

### EL-RESISTIVITY-COMPARE-MATERIALS-001

**Statement (v1, APPROVED):** Compare the resistivity of different materials to determine which is the better conductor: a lower resistivity indicates a better conductor.

**Direct prerequisites:** EL-CONCEPT-RESISTIVITY-001 (REQUIRED)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Describe what is meant by resistance and resistivity in relation to electrical circuits (SUPPORTS); Describe what is meant by resistance and resistivity in relation to electrical circuits (SUPPORTS)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, 9.3: resistance and resistivity, and R = rho L / A [SUPPORTS, support=DIRECT, verification=UNVERIFIED] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC4.3: describe what is meant by resistance and resistivity in relation to electrical circuits [CURRICULUM_REQUIRES, verification=VERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_SUPPORTING

### EL-RESISTIVITY-LENGTH-EFFECT-001

**Statement (v1, APPROVED):** Increasing the length of a conductor increases its resistance, since resistance is directly proportional to length.

**Direct prerequisites:** EL-RESISTIVITY-RELATIONSHIP-001 (REQUIRED); FM-ALG-PROPORTION-DIRECT-001 (REQUIRED)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Describe what is meant by resistance and resistivity in relation to electrical circuits (SUPPORTS); Describe what is meant by resistance and resistivity in relation to electrical circuits (SUPPORTS)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, 9.3: resistance and resistivity, and R = rho L / A [SUPPORTS, support=DIRECT, verification=UNVERIFIED] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC4.3: describe what is meant by resistance and resistivity in relation to electrical circuits [CURRICULUM_REQUIRES, verification=VERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED

### EL-RESISTIVITY-AREA-EFFECT-001

**Statement (v1, APPROVED):** Increasing the cross-sectional area of a conductor decreases its resistance, since resistance is inversely proportional to cross-sectional area.

**Direct prerequisites:** EL-RESISTIVITY-RELATIONSHIP-001 (REQUIRED); FM-ALG-PROPORTION-INVERSE-001 (REQUIRED)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Describe what is meant by resistance and resistivity in relation to electrical circuits (SUPPORTS); Describe what is meant by resistance and resistivity in relation to electrical circuits (SUPPORTS)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, 9.3: resistance and resistivity, and R = rho L / A [SUPPORTS, support=DIRECT, verification=UNVERIFIED] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC4.3: describe what is meant by resistance and resistivity in relation to electrical circuits [CURRICULUM_REQUIRES, verification=VERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED

### EL-INSULATOR-BREAKDOWN-001

**Statement (v1, APPROVED):** If the voltage across an insulator becomes too high, the insulator can break down and allow current to flow, which is why insulation has a rated maximum voltage.

**Direct prerequisites:** EL-CONCEPT-INSULATOR-001 (REQUIRED)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Identify and distinguish between materials which are good conductors and insulators (SUPPORTS); Identify and distinguish between materials which are good conductors and insulators (SUPPORTS)
**Provenance:** University Physics Volume 2 — "The critical value, Ec, of the electrical field at which the molecules of an insulator become ionized is called the dielectric strength of the material... When this happens, the material can conduct, thereby allowing charge to move through the dielectric... This phenomenon is called dielectric breakdown." "The dielectric strength imposes a limit on the voltage that can be applied for a given plate separation" [DEFINES, support=DIRECT, verification=UNVERIFIED] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC4.2: identify and distinguish between materials which are good conductors and insulators [CURRICULUM_REQUIRES, verification=VERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_SUPPORTING

### EL-OHM-SELECT-RELATIONSHIP-001

**Statement (v1, APPROVED):** Select the correct arrangement of V = I times R to use, based on which two quantities are known and which quantity is required.

**Direct prerequisites:** EL-OHM-RELATIONSHIP-001 (REQUIRED)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Calculate the values of current, voltage and resistance in parallel and series D.C. circuits (REQUIRED_FOR); Identify and apply appropriate mathematical principles which are relevant to electrical work tasks (EXEMPLIFIES); Calculate the values of current, voltage and resistance in parallel and series D.C. circuits (REQUIRED_FOR); Identify and apply appropriate mathematical principles which are relevant to electrical work tasks (EXEMPLIFIES)
**Provenance:** City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC4.5: calculate the values of current, voltage and resistance in parallel and series D.C. circuits [CURRICULUM_REQUIRES, verification=VERIFIED]
**Derived from:** EL-OHM-RELATIONSHIP-001 [LOGICAL_DEFINITIONAL]
**Entailment result:** FULLY_SUPPORTED_DERIVED
**Scope status (CC-09B.5):** IN_SCOPE_SUPPORTING

### EL-CIRCUIT-SELECT-CONFIGURATION-001

**Statement (v1, APPROVED):** Identify whether a given circuit diagram or description shows components connected in series or in parallel.

**Direct prerequisites:** EL-CIRCUIT-SERIES-STRUCTURE-001 (REQUIRED); EL-CIRCUIT-PARALLEL-STRUCTURE-001 (REQUIRED)
**Direct dependents:** EL-CIRCUIT-TRACE-CURRENT-PATH-001
**Curriculum mapping(s):** Explain the relationship between current, voltage and resistance in parallel and series D.C. circuits (SUPPORTS); Explain the relationship between current, voltage and resistance in parallel and series D.C. circuits (SUPPORTS)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, 10.2: equivalent resistance for resistors in series and in parallel [SUPPORTS, support=DIRECT, verification=UNVERIFIED] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC4.4: explain the relationship between current, voltage and resistance in parallel and series D.C. circuits [CURRICULUM_REQUIRES, verification=VERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_SUPPORTING

### EL-CIRCUIT-EQUIVALENT-RESISTANCE-DEFINITION-001

**Statement (v1, APPROVED):** The equivalent resistance of a network of resistors is the single resistance value that would draw the same current from the same supply voltage as the whole network.

**Direct prerequisites:** (none — root assertion)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Explain the relationship between current, voltage and resistance in parallel and series D.C. circuits (REQUIRED_FOR); Explain the relationship between current, voltage and resistance in parallel and series D.C. circuits (REQUIRED_FOR)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, 10.2: equivalent resistance for resistors in series and in parallel [DEFINES, support=DIRECT, verification=UNVERIFIED] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC4.4: explain the relationship between current, voltage and resistance in parallel and series D.C. circuits [CURRICULUM_REQUIRES, verification=VERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_SUPPORTING

### EL-CIRCUIT-MIXED-SERIES-PARALLEL-RECOGNITION-001

**Statement (v1, APPROVED):** Some circuits combine both series-connected and parallel-connected sections within the same network.

**Direct prerequisites:** EL-CIRCUIT-SERIES-STRUCTURE-001 (REQUIRED); EL-CIRCUIT-PARALLEL-STRUCTURE-001 (REQUIRED)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Explain the relationship between current, voltage and resistance in parallel and series D.C. circuits (SUPPORTS); Explain the relationship between current, voltage and resistance in parallel and series D.C. circuits (SUPPORTS)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, 10.2: equivalent resistance for resistors in series and in parallel [SUPPORTS, support=DIRECT, verification=UNVERIFIED] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC4.4: explain the relationship between current, voltage and resistance in parallel and series D.C. circuits [CURRICULUM_REQUIRES, verification=VERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_SUPPORTING

### EL-CIRCUIT-TRACE-CURRENT-PATH-001

**Statement (v1, APPROVED):** Trace the path or paths current takes through a given series or parallel circuit diagram.

**Direct prerequisites:** EL-CIRCUIT-SELECT-CONFIGURATION-001 (STRONG)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Explain the relationship between current, voltage and resistance in parallel and series D.C. circuits (SUPPORTS); Explain the relationship between current, voltage and resistance in parallel and series D.C. circuits (SUPPORTS)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, 10.2: equivalent resistance for resistors in series and in parallel [SUPPORTS, support=DIRECT, verification=UNVERIFIED] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC4.4: explain the relationship between current, voltage and resistance in parallel and series D.C. circuits [CURRICULUM_REQUIRES, verification=VERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_SUPPORTING

### EL-CIRCUIT-COMPARE-RESISTANCE-001

**Statement (v1, APPROVED):** Compare how the total resistance of the same set of resistors differs when connected in series versus in parallel: the parallel total is always lower than the series total.

**Direct prerequisites:** EL-SERIES-RESISTANCE-001 (REQUIRED); EL-PARALLEL-RESISTANCE-001 (REQUIRED)
**Direct dependents:** EL-CIRCUIT-COMPARE-POWER-001
**Curriculum mapping(s):** Explain the relationship between current, voltage and resistance in parallel and series D.C. circuits (SUPPORTS); Explain the relationship between current, voltage and resistance in parallel and series D.C. circuits (SUPPORTS)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, 10.2: equivalent resistance for resistors in series and in parallel [SUPPORTS, support=DIRECT, verification=UNVERIFIED] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC4.4: explain the relationship between current, voltage and resistance in parallel and series D.C. circuits [CURRICULUM_REQUIRES, verification=VERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_SUPPORTING

### EL-CIRCUIT-COMPARE-CURRENT-001

**Statement (v1, APPROVED):** Compare current behaviour in series versus parallel circuits: current is the same throughout a series circuit, but divides between branches in a parallel circuit.

**Direct prerequisites:** EL-SERIES-CURRENT-001 (REQUIRED); EL-PARALLEL-CURRENT-001 (REQUIRED)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Explain the relationship between current, voltage and resistance in parallel and series D.C. circuits (SUPPORTS); Explain the relationship between current, voltage and resistance in parallel and series D.C. circuits (SUPPORTS)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, 10.2: equivalent resistance for resistors in series and in parallel [SUPPORTS, support=DIRECT, verification=UNVERIFIED] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC4.4: explain the relationship between current, voltage and resistance in parallel and series D.C. circuits [CURRICULUM_REQUIRES, verification=VERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_SUPPORTING

### EL-CIRCUIT-COMPARE-VOLTAGE-001

**Statement (v1, APPROVED):** Compare voltage behaviour in series versus parallel circuits: voltage divides between components in a series circuit, but is the same across every branch of a parallel circuit.

**Direct prerequisites:** EL-SERIES-VOLTAGE-001 (REQUIRED); EL-PARALLEL-VOLTAGE-001 (REQUIRED)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Explain the relationship between current, voltage and resistance in parallel and series D.C. circuits (SUPPORTS); Explain the relationship between current, voltage and resistance in parallel and series D.C. circuits (SUPPORTS)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, 10.2: equivalent resistance for resistors in series and in parallel [SUPPORTS, support=DIRECT, verification=UNVERIFIED] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC4.4: explain the relationship between current, voltage and resistance in parallel and series D.C. circuits [CURRICULUM_REQUIRES, verification=VERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_SUPPORTING

### EL-CIRCUIT-COMPARE-POWER-001

**Statement (v1, APPROVED):** Compare the total power dissipated by the same set of resistors at the same supply voltage when connected in series versus in parallel.

**Direct prerequisites:** EL-CIRCUIT-COMPARE-RESISTANCE-001 (STRONG); EL-CIRCUIT-POWER-TOTAL-001 (REQUIRED)
**Direct dependents:** EL-CIRCUIT-COMPARE-ENERGY-001
**Curriculum mapping(s):** Calculate values of power in parallel and series D.C. circuits (SUPPORTS); Calculate values of power in parallel and series D.C. circuits (SUPPORTS)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, 9.5: electrical power and energy, P = VI and P = I^2 R [SUPPORTS, support=DIRECT, verification=UNVERIFIED] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC4.6: calculate values of power in parallel and series D.C. circuits [CURRICULUM_REQUIRES, verification=VERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_SUPPORTING

### EL-CIRCUIT-COMPARE-ENERGY-001

**Statement (v1, APPROVED):** Compare the total electrical energy transferred over a given time by the same set of resistors when connected in series versus in parallel at the same supply voltage.

**Direct prerequisites:** EL-CIRCUIT-COMPARE-POWER-001 (STRONG)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Calculate values of power in parallel and series D.C. circuits (SUPPORTS); Calculate values of power in parallel and series D.C. circuits (SUPPORTS)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, 9.5: electrical power and energy, P = VI and P = I^2 R [SUPPORTS, support=DIRECT, verification=UNVERIFIED] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC4.6: calculate values of power in parallel and series D.C. circuits [CURRICULUM_REQUIRES, verification=VERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_SUPPORTING

### EL-SERIES-DOMINANT-RESISTOR-001

**Statement (v1, APPROVED):** In a series circuit, since current is equal throughout, the component with the greatest resistance has the greatest voltage drop and dissipates the most power.

**Direct prerequisites:** EL-SERIES-VOLTAGE-001 (REQUIRED); EL-POWER-DERIVED-VIR-001 (STRONG)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Explain the relationship between current, voltage and resistance in parallel and series D.C. circuits (SUPPORTS); Explain the relationship between current, voltage and resistance in parallel and series D.C. circuits (SUPPORTS)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, 10.2: equivalent resistance for resistors in series and in parallel [SUPPORTS, support=DIRECT, verification=UNVERIFIED] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC4.4: explain the relationship between current, voltage and resistance in parallel and series D.C. circuits [CURRICULUM_REQUIRES, verification=VERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_SUPPORTING

### EL-PARALLEL-DOMINANT-RESISTOR-001

**Statement (v1, APPROVED):** In a parallel circuit, since voltage is equal across every branch, the branch with the smallest resistance carries the largest current and dissipates the most power.

**Direct prerequisites:** EL-PARALLEL-CURRENT-001 (REQUIRED); EL-POWER-DERIVED-V2R-001 (STRONG)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Explain the relationship between current, voltage and resistance in parallel and series D.C. circuits (SUPPORTS); Explain the relationship between current, voltage and resistance in parallel and series D.C. circuits (SUPPORTS)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, 10.2: equivalent resistance for resistors in series and in parallel [SUPPORTS, support=DIRECT, verification=UNVERIFIED] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC4.4: explain the relationship between current, voltage and resistance in parallel and series D.C. circuits [CURRICULUM_REQUIRES, verification=VERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_SUPPORTING

### EL-SERIES-PREDICT-OPEN-001

**Statement (v1, APPROVED):** Predict the effect on current if a series circuit is broken (open-circuited) at any point: current stops flowing throughout the whole circuit.

**Direct prerequisites:** EL-CIRCUIT-SERIES-STRUCTURE-001 (REQUIRED); EL-SERIES-CURRENT-001 (STRONG)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Explain the relationship between current, voltage and resistance in parallel and series D.C. circuits (SUPPORTS); Explain the relationship between current, voltage and resistance in parallel and series D.C. circuits (SUPPORTS)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, 10.2: equivalent resistance for resistors in series and in parallel [SUPPORTS, support=DIRECT, verification=UNVERIFIED] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC4.4: explain the relationship between current, voltage and resistance in parallel and series D.C. circuits [CURRICULUM_REQUIRES, verification=VERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_SUPPORTING

### EL-PARALLEL-PREDICT-OPEN-001

**Statement (v1, APPROVED):** Predict the effect on the remaining branches if one branch of a parallel circuit is broken (open-circuited): current continues to flow unaffected in the other branches.

**Direct prerequisites:** EL-CIRCUIT-PARALLEL-STRUCTURE-001 (REQUIRED); EL-PARALLEL-VOLTAGE-001 (STRONG)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Explain the relationship between current, voltage and resistance in parallel and series D.C. circuits (SUPPORTS); Explain the relationship between current, voltage and resistance in parallel and series D.C. circuits (SUPPORTS)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, 10.2: equivalent resistance for resistors in series and in parallel [SUPPORTS, support=DIRECT, verification=UNVERIFIED] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC4.4: explain the relationship between current, voltage and resistance in parallel and series D.C. circuits [CURRICULUM_REQUIRES, verification=VERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_SUPPORTING

### EL-SERIES-PREDICT-ADD-RESISTOR-001

**Statement (v1, APPROVED):** Predict the effect on supply current of adding an extra resistor in series: total resistance increases, so supply current decreases.

**Direct prerequisites:** EL-SERIES-RESISTANCE-001 (REQUIRED); EL-OHM-PROPORTIONALITY-001 (STRONG)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Explain the relationship between current, voltage and resistance in parallel and series D.C. circuits (SUPPORTS); Explain the relationship between current, voltage and resistance in parallel and series D.C. circuits (SUPPORTS)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, 10.2: equivalent resistance for resistors in series and in parallel [SUPPORTS, support=DIRECT, verification=UNVERIFIED] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC4.4: explain the relationship between current, voltage and resistance in parallel and series D.C. circuits [CURRICULUM_REQUIRES, verification=VERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_SUPPORTING

### EL-PARALLEL-PREDICT-ADD-RESISTOR-001

**Statement (v1, APPROVED):** Predict the effect on supply current of adding an extra branch resistor in parallel: total resistance decreases, so supply current increases.

**Direct prerequisites:** EL-PARALLEL-RESISTANCE-001 (REQUIRED); EL-OHM-PROPORTIONALITY-001 (STRONG)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Explain the relationship between current, voltage and resistance in parallel and series D.C. circuits (SUPPORTS); Explain the relationship between current, voltage and resistance in parallel and series D.C. circuits (SUPPORTS)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, 10.2: equivalent resistance for resistors in series and in parallel [SUPPORTS, support=DIRECT, verification=UNVERIFIED] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC4.4: explain the relationship between current, voltage and resistance in parallel and series D.C. circuits [CURRICULUM_REQUIRES, verification=VERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_SUPPORTING

### EL-CIRCUIT-RECOGNISE-SHORT-CIRCUIT-001

**Statement (v1, APPROVED):** Recognise a short circuit as an unintended low-resistance path that causes abnormally high current to flow.

**Direct prerequisites:** EL-CONCEPT-RESISTANCE-001 (STRONG)
**Direct dependents:** EL-CIRCUIT-PREDICT-SHORT-EFFECT-001
**Curriculum mapping(s):** Explain the relationship between current, voltage and resistance in parallel and series D.C. circuits (SUPPORTS); Explain the relationship between current, voltage and resistance in parallel and series D.C. circuits (SUPPORTS)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, 10.2: equivalent resistance for resistors in series and in parallel [SUPPORTS, support=DIRECT, verification=UNVERIFIED] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC4.4: explain the relationship between current, voltage and resistance in parallel and series D.C. circuits [CURRICULUM_REQUIRES, verification=VERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_SUPPORTING

### EL-CIRCUIT-RECOGNISE-OPEN-CIRCUIT-001

**Statement (v1, APPROVED):** Recognise an open circuit as an unintended break in the current path that prevents current from flowing.

**Direct prerequisites:** (none — root assertion)
**Direct dependents:** EL-CIRCUIT-OPEN-CIRCUIT-RESISTANCE-INTERPRETATION-001
**Curriculum mapping(s):** Explain the relationship between current, voltage and resistance in parallel and series D.C. circuits (SUPPORTS); Explain the relationship between current, voltage and resistance in parallel and series D.C. circuits (SUPPORTS)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, 10.2: equivalent resistance for resistors in series and in parallel [SUPPORTS, support=DIRECT, verification=UNVERIFIED] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC4.4: explain the relationship between current, voltage and resistance in parallel and series D.C. circuits [CURRICULUM_REQUIRES, verification=VERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_SUPPORTING

### EL-CIRCUIT-PREDICT-SHORT-EFFECT-001

**Statement (v1, APPROVED):** Predict the effect of a short circuit occurring across a component: current increases sharply and may cause damage or operate a protective device.

**Direct prerequisites:** EL-CIRCUIT-RECOGNISE-SHORT-CIRCUIT-001 (REQUIRED)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Describe the chemical and thermal effects of electric currents (SUPPORTS); Describe the chemical and thermal effects of electric currents (SUPPORTS)
**Provenance:** University Physics Volume 2 — "Fuses and circuit breakers are used to limit excessive currents" that would otherwise overheat wiring -- the general purpose of a protective device (automatic disconnection above a safe current) in a real household/installation safety context [SUPPORTS, support=DIRECT, verification=UNVERIFIED] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC4.8: describe the chemical and thermal effects of electric currents [CURRICULUM_REQUIRES, verification=VERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_SUPPORTING

### EL-PROTECTIVE-DEVICE-PURPOSE-001

**Statement (v1, APPROVED):** A protective device, such as a fuse or circuit breaker, is designed to automatically disconnect a circuit when current exceeds a safe value.

**Direct prerequisites:** EL-CURRENT-THERMAL-EFFECT-001 (STRONG)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Describe the chemical and thermal effects of electric currents (REQUIRED_FOR); Describe the chemical and thermal effects of electric currents (REQUIRED_FOR)
**Provenance:** University Physics Volume 2 — "Fuses and circuit breakers are used to limit excessive currents" that would otherwise overheat wiring -- the general purpose of a protective device (automatic disconnection above a safe current) in a real household/installation safety context [DEFINES, support=DIRECT, verification=UNVERIFIED] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC4.8: describe the chemical and thermal effects of electric currents [CURRICULUM_REQUIRES, verification=VERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_SUPPORTING

### EL-FUSE-OPERATION-001

**Statement (v1, APPROVED):** A fuse protects a circuit by melting and breaking the circuit when current exceeds its rated value, using the thermal effect of current.

**Direct prerequisites:** EL-CURRENT-THERMAL-EFFECT-001 (REQUIRED)
**Direct dependents:** EL-CIRCUIT-BREAKER-VS-FUSE-001
**Curriculum mapping(s):** Describe the chemical and thermal effects of electric currents (REQUIRED_FOR); Describe the chemical and thermal effects of electric currents (REQUIRED_FOR)
**Provenance:** University Physics Volume 2 — Fuse: "a device that protects a circuit from currents that are too high... The piece of wire in the fuse is under tension and has a low melting point. The wire is designed to heat up and break at the rated current." Circuit breaker: "also rated for a maximum current, and open to protect the circuit, but can be reset. Circuit breakers react much faster." Also discusses resistive heating in light bulbs/resistors ("electrical energy supplied to the light bulbs is converted into heat and light") [DEFINES, support=DIRECT, verification=UNVERIFIED] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC4.8: describe the chemical and thermal effects of electric currents [CURRICULUM_REQUIRES, verification=VERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_SUPPORTING

### EL-THERMAL-EFFECT-APPLICATION-001

**Statement (v1, APPROVED):** Recognise practical applications of the thermal effect of current, such as heating elements and filament lamps.

**Direct prerequisites:** EL-CURRENT-THERMAL-EFFECT-001 (REQUIRED)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Describe the chemical and thermal effects of electric currents (SUPPORTS); Describe the chemical and thermal effects of electric currents (SUPPORTS)
**Provenance:** University Physics Volume 2 — Fuse: "a device that protects a circuit from currents that are too high... The piece of wire in the fuse is under tension and has a low melting point. The wire is designed to heat up and break at the rated current." Circuit breaker: "also rated for a maximum current, and open to protect the circuit, but can be reset. Circuit breakers react much faster." Also discusses resistive heating in light bulbs/resistors ("electrical energy supplied to the light bulbs is converted into heat and light") [SUPPORTS, support=DIRECT, verification=UNVERIFIED] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC4.8: describe the chemical and thermal effects of electric currents [CURRICULUM_REQUIRES, verification=VERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_SUPPORTING

### EL-THERMAL-EFFECT-FACTORS-001

**Statement (v1, APPROVED):** The amount of heat generated by current flowing through a resistance depends on the current, the resistance and the time for which the current flows.

**Direct prerequisites:** EL-POWER-SOLVE-IR-001 (STRONG)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Describe the chemical and thermal effects of electric currents (SUPPORTS); Describe the chemical and thermal effects of electric currents (SUPPORTS)
**Provenance:** City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC4.8: describe the chemical and thermal effects of electric currents [CURRICULUM_REQUIRES, verification=VERIFIED]
**Derived from:** EL-POWER-DERIVED-VIR-001 [MATHEMATICAL]; EL-ENERGY-POWER-TIME-RELATIONSHIP-001 [MATHEMATICAL]
**Entailment result:** FULLY_SUPPORTED_DERIVED
**Scope status (CC-09B.5):** IN_SCOPE_SUPPORTING

### EL-CIRCUIT-BREAKER-VS-FUSE-001

**Statement (v1, APPROVED):** Compare a fuse, which must be replaced after operating, with a circuit breaker, which can be reset and reused after tripping.

**Direct prerequisites:** EL-FUSE-OPERATION-001 (REQUIRED)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Describe the chemical and thermal effects of electric currents (SUPPORTS); Describe the chemical and thermal effects of electric currents (SUPPORTS)
**Provenance:** University Physics Volume 2 — Fuse: "a device that protects a circuit from currents that are too high... The piece of wire in the fuse is under tension and has a low melting point. The wire is designed to heat up and break at the rated current." Circuit breaker: "also rated for a maximum current, and open to protect the circuit, but can be reset. Circuit breakers react much faster." Also discusses resistive heating in light bulbs/resistors ("electrical energy supplied to the light bulbs is converted into heat and light") [DEFINES, support=DIRECT, verification=UNVERIFIED] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC4.8: describe the chemical and thermal effects of electric currents [CURRICULUM_REQUIRES, verification=VERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_SUPPORTING

### EL-INSTRUMENT-SELECT-001

**Statement (v1, APPROVED):** Select the appropriate instrument (voltmeter, ammeter, ohmmeter or multimeter) to measure a given electrical quantity.

**Direct prerequisites:** EL-INSTRUMENT-VOLTMETER-001 (REQUIRED); EL-INSTRUMENT-AMMETER-001 (REQUIRED); EL-INSTRUMENT-OHMMETER-001 (REQUIRED)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Identify appropriate electrical instruments for the measurement of different electrical quantities (REQUIRED_FOR); Identify appropriate electrical instruments for the measurement of different electrical quantities (REQUIRED_FOR)
**Provenance:** City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC2.3: identify appropriate electrical instruments for the measurement of different electrical quantities [CURRICULUM_REQUIRES, verification=VERIFIED]
**Derived from:** EL-INSTRUMENT-VOLTMETER-001 [LOGICAL_DEFINITIONAL]; EL-INSTRUMENT-AMMETER-001 [LOGICAL_DEFINITIONAL]; EL-INSTRUMENT-OHMMETER-001 [LOGICAL_DEFINITIONAL]
**Entailment result:** FULLY_SUPPORTED_DERIVED
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED
**Misconceptions targeting this assertion:** MIS-EL-INSTRUMENT-CONNECTION-CONFUSION-001

### EL-INSTRUMENT-VOLTMETER-INTERNAL-RESISTANCE-001

**Statement (v1, APPROVED):** An ideal voltmeter has very high internal resistance so that connecting it in parallel does not significantly alter the circuit being measured.

**Direct prerequisites:** EL-INSTRUMENT-VOLTMETER-001 (REQUIRED)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Identify appropriate electrical instruments for the measurement of different electrical quantities (SUPPORTS); Identify appropriate electrical instruments for the measurement of different electrical quantities (SUPPORTS)
**Provenance:** University Physics Volume 2 — A voltmeter is placed in parallel and must have very high (ideally infinite) resistance so it does not alter the circuit; an ammeter is placed in series and must have very low (ideally zero) resistance for the same reason; an ohmmeter must never be connected to a live (energised) circuit [DEFINES, support=DIRECT, verification=UNVERIFIED] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC2.3: identify appropriate electrical instruments for the measurement of different electrical quantities [CURRICULUM_REQUIRES, verification=VERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED

### EL-INSTRUMENT-AMMETER-INTERNAL-RESISTANCE-001

**Statement (v1, APPROVED):** An ideal ammeter has very low internal resistance so that connecting it in series does not significantly alter the circuit being measured.

**Direct prerequisites:** EL-INSTRUMENT-AMMETER-001 (REQUIRED)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Identify appropriate electrical instruments for the measurement of different electrical quantities (SUPPORTS); Identify appropriate electrical instruments for the measurement of different electrical quantities (SUPPORTS)
**Provenance:** University Physics Volume 2 — A voltmeter is placed in parallel and must have very high (ideally infinite) resistance so it does not alter the circuit; an ammeter is placed in series and must have very low (ideally zero) resistance for the same reason; an ohmmeter must never be connected to a live (energised) circuit [DEFINES, support=DIRECT, verification=UNVERIFIED] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC2.3: identify appropriate electrical instruments for the measurement of different electrical quantities [CURRICULUM_REQUIRES, verification=VERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED

### EL-INSTRUMENT-CONTINUITY-TEST-001

**Statement (v1, APPROVED):** A continuity test uses an ohmmeter or multimeter to confirm that a low-resistance path exists between two points in a de-energised circuit.

**Direct prerequisites:** EL-INSTRUMENT-OHMMETER-001 (REQUIRED)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Identify appropriate electrical instruments for the measurement of different electrical quantities (SUPPORTS); Identify appropriate electrical instruments for the measurement of different electrical quantities (SUPPORTS)
**Provenance:** Electric Circuits I - Direct Current (Kuphaldt) — With the leads shorted (zero ohms) the meter movement carries maximum current and the needle deflects fully; with infinite resistance between the leads there is zero current and the needle stays at the far left -- so a low-resistance (near full-scale-deflection) reading confirms a continuous path; ohmmeters must never be connected to an energised circuit, since their accurate indication depends on the only voltage source being the ohmmeter's own internal battery [DEFINES, support=DIRECT, verification=UNVERIFIED] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC2.3: identify appropriate electrical instruments for the measurement of different electrical quantities [CURRICULUM_REQUIRES, verification=VERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_SUPPORTING

### EL-SERIES-VOLTAGE-DIVIDER-001

**Statement (v1, APPROVED):** A series circuit of two or more resistors can be used as a voltage divider, where the voltage across each resistor is proportional to its resistance.

**Direct prerequisites:** EL-SERIES-VOLTAGE-001 (REQUIRED); FM-ALG-PROPORTION-DIRECT-001 (STRONG)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Explain the relationship between current, voltage and resistance in parallel and series D.C. circuits (SUPPORTS); Explain the relationship between current, voltage and resistance in parallel and series D.C. circuits (SUPPORTS)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, 10.2: equivalent resistance for resistors in series and in parallel [SUPPORTS, support=DIRECT, verification=UNVERIFIED] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC4.4: explain the relationship between current, voltage and resistance in parallel and series D.C. circuits [CURRICULUM_REQUIRES, verification=VERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_SUPPORTING

### EL-PARALLEL-CURRENT-DIVIDER-001

**Statement (v1, APPROVED):** A parallel circuit of two or more resistors divides the total current between branches in inverse proportion to their resistance.

**Direct prerequisites:** EL-PARALLEL-CURRENT-001 (REQUIRED); FM-ALG-PROPORTION-INVERSE-001 (STRONG)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Explain the relationship between current, voltage and resistance in parallel and series D.C. circuits (SUPPORTS); Explain the relationship between current, voltage and resistance in parallel and series D.C. circuits (SUPPORTS)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, 10.2: equivalent resistance for resistors in series and in parallel [SUPPORTS, support=DIRECT, verification=UNVERIFIED] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC4.4: explain the relationship between current, voltage and resistance in parallel and series D.C. circuits [CURRICULUM_REQUIRES, verification=VERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_SUPPORTING

### EL-CIRCUIT-SUPPLY-CURRENT-SERIES-001

**Statement (v1, APPROVED):** Calculate the supply current in a series circuit from the supply voltage and the total resistance of the circuit.

**Direct prerequisites:** EL-OHM-SOLVE-I-001 (REQUIRED); EL-SERIES-RESISTANCE-CALC-001 (REQUIRED)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Calculate the values of current, voltage and resistance in parallel and series D.C. circuits (REQUIRED_FOR); Calculate the values of current, voltage and resistance in parallel and series D.C. circuits (REQUIRED_FOR)
**Provenance:** City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC4.5: calculate the values of current, voltage and resistance in parallel and series D.C. circuits [CURRICULUM_REQUIRES, verification=VERIFIED]
**Derived from:** EL-OHM-RELATIONSHIP-001 [MATHEMATICAL]; EL-SERIES-RESISTANCE-001 [MATHEMATICAL]
**Entailment result:** FULLY_SUPPORTED_DERIVED
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED

### EL-CIRCUIT-SUPPLY-CURRENT-PARALLEL-001

**Statement (v1, APPROVED):** Calculate the supply current in a parallel circuit from the supply voltage and the total resistance of the circuit.

**Direct prerequisites:** EL-OHM-SOLVE-I-001 (REQUIRED); EL-PARALLEL-RESISTANCE-CALC-001 (REQUIRED)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Calculate the values of current, voltage and resistance in parallel and series D.C. circuits (REQUIRED_FOR); Calculate the values of current, voltage and resistance in parallel and series D.C. circuits (REQUIRED_FOR)
**Provenance:** City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC4.5: calculate the values of current, voltage and resistance in parallel and series D.C. circuits [CURRICULUM_REQUIRES, verification=VERIFIED]
**Derived from:** EL-OHM-RELATIONSHIP-001 [MATHEMATICAL]; EL-PARALLEL-RESISTANCE-001 [MATHEMATICAL]
**Entailment result:** FULLY_SUPPORTED_DERIVED
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED

### EL-POWER-DERIVED-V2R-001

**Statement (v1, APPROVED):** Electrical power can also be found from voltage and resistance alone, since combining P = V times I with I = V divided by R gives P = V squared divided by R.

**Direct prerequisites:** (none — root assertion)
**Direct dependents:** EL-PARALLEL-DOMINANT-RESISTOR-001; EL-POWER-SOLVE-V2R-001
**Curriculum mapping(s):** Calculate values of power in parallel and series D.C. circuits (REQUIRED_FOR); Calculate values of power in parallel and series D.C. circuits (REQUIRED_FOR)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, 9.5: electrical power and energy, P = VI and P = I^2 R [SUPPORTS, support=DIRECT, verification=UNVERIFIED]
**Derived from:** EL-POWER-RELATIONSHIP-001 [MATHEMATICAL]; EL-OHM-RELATIONSHIP-001 [MATHEMATICAL]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED

### EL-POWER-SOLVE-V2R-001

**Statement (v1, APPROVED):** Calculate electrical power from known voltage and resistance using P = V squared divided by R.

**Direct prerequisites:** EL-POWER-DERIVED-V2R-001 (REQUIRED); FM-ALG-SUBSTITUTION-001 (REQUIRED)
**Direct dependents:** EL-PARALLEL-POWER-CALC-001
**Curriculum mapping(s):** Calculate values of power in parallel and series D.C. circuits (REQUIRED_FOR); Identify and apply appropriate mathematical principles which are relevant to electrical work tasks (EXEMPLIFIES); Calculate values of power in parallel and series D.C. circuits (REQUIRED_FOR); Identify and apply appropriate mathematical principles which are relevant to electrical work tasks (EXEMPLIFIES)
**Provenance:** City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC4.6: calculate values of power in parallel and series D.C. circuits [CURRICULUM_REQUIRES, verification=VERIFIED]
**Derived from:** EL-POWER-DERIVED-V2R-001 [MATHEMATICAL]
**Entailment result:** FULLY_SUPPORTED_DERIVED
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED

### EL-SERIES-POWER-CALC-001

**Statement (v1, APPROVED):** Calculate the power dissipated by an individual component in a series circuit from the common current and that component's resistance.

**Direct prerequisites:** EL-POWER-SOLVE-IR-001 (REQUIRED); EL-SERIES-CURRENT-001 (REQUIRED)
**Direct dependents:** EL-SERIES-POWER-DISTRIBUTION-001
**Curriculum mapping(s):** Calculate values of power in parallel and series D.C. circuits (REQUIRED_FOR); Calculate values of power in parallel and series D.C. circuits (REQUIRED_FOR)
**Provenance:** City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC4.6: calculate values of power in parallel and series D.C. circuits [CURRICULUM_REQUIRES, verification=VERIFIED]
**Derived from:** EL-POWER-DERIVED-VIR-001 [MATHEMATICAL]
**Entailment result:** FULLY_SUPPORTED_DERIVED
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED

### EL-PARALLEL-POWER-CALC-001

**Statement (v1, APPROVED):** Calculate the power dissipated by an individual branch in a parallel circuit from the common branch voltage and that branch's resistance.

**Direct prerequisites:** EL-POWER-SOLVE-V2R-001 (REQUIRED); EL-PARALLEL-VOLTAGE-001 (REQUIRED)
**Direct dependents:** EL-PARALLEL-POWER-DISTRIBUTION-001
**Curriculum mapping(s):** Calculate values of power in parallel and series D.C. circuits (REQUIRED_FOR); Calculate values of power in parallel and series D.C. circuits (REQUIRED_FOR)
**Provenance:** City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC4.6: calculate values of power in parallel and series D.C. circuits [CURRICULUM_REQUIRES, verification=VERIFIED]
**Derived from:** EL-POWER-DERIVED-V2R-001 [MATHEMATICAL]
**Entailment result:** FULLY_SUPPORTED_DERIVED
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED

### EL-SERIES-POWER-DISTRIBUTION-001

**Statement (v1, APPROVED):** In a series circuit, since current is equal throughout, the component with the greatest resistance dissipates the most power.

**Direct prerequisites:** EL-SERIES-POWER-CALC-001 (STRONG)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Calculate values of power in parallel and series D.C. circuits (SUPPORTS); Calculate values of power in parallel and series D.C. circuits (SUPPORTS)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, 9.5: electrical power and energy, P = VI and P = I^2 R [SUPPORTS, support=DIRECT, verification=UNVERIFIED] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC4.6: calculate values of power in parallel and series D.C. circuits [CURRICULUM_REQUIRES, verification=VERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_SUPPORTING

### EL-PARALLEL-POWER-DISTRIBUTION-001

**Statement (v1, APPROVED):** In a parallel circuit, since voltage is equal across every branch, the branch with the smallest resistance dissipates the most power.

**Direct prerequisites:** EL-PARALLEL-POWER-CALC-001 (STRONG)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Calculate values of power in parallel and series D.C. circuits (SUPPORTS); Calculate values of power in parallel and series D.C. circuits (SUPPORTS)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, 9.5: electrical power and energy, P = VI and P = I^2 R [SUPPORTS, support=DIRECT, verification=UNVERIFIED] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC4.6: calculate values of power in parallel and series D.C. circuits [CURRICULUM_REQUIRES, verification=VERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_SUPPORTING

### EL-ENERGY-POWER-TIME-RELATIONSHIP-001

**Statement (v1, APPROVED):** Electrical energy transferred is calculated by multiplying power by time: E = P times t.

**Direct prerequisites:** EL-CONCEPT-POWER-001 (REQUIRED); EL-CONCEPT-ENERGY-001 (REQUIRED)
**Direct dependents:** EL-ENERGY-REARRANGE-001; EL-ENERGY-CALC-001
**Curriculum mapping(s):** Identify and determine values of base and derived SI units which apply specifically to electrical quantities (REQUIRED_FOR); Identify and determine values of base and derived SI units which apply specifically to electrical quantities (REQUIRED_FOR)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, 9.5: electrical power and energy, P = VI and P = I^2 R [DEFINES, support=DIRECT, verification=UNVERIFIED] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC2.2: identify and determine values of base and derived SI units which apply specifically to electrical quantities [CURRICULUM_REQUIRES, verification=VERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_SUPPORTING

### EL-ENERGY-REARRANGE-001

**Statement (v1, APPROVED):** Rearrange E = P times t algebraically to make power or time the subject.

**Direct prerequisites:** EL-ENERGY-POWER-TIME-RELATIONSHIP-001 (REQUIRED); FM-ALG-TRANSPOSE-MULT-001 (REQUIRED)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Identify and determine values of base and derived SI units which apply specifically to electrical quantities (REQUIRED_FOR); Identify and apply appropriate mathematical principles which are relevant to electrical work tasks (EXEMPLIFIES); Identify and determine values of base and derived SI units which apply specifically to electrical quantities (REQUIRED_FOR); Identify and apply appropriate mathematical principles which are relevant to electrical work tasks (EXEMPLIFIES)
**Provenance:** City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC2.2: identify and determine values of base and derived SI units which apply specifically to electrical quantities [CURRICULUM_REQUIRES, verification=VERIFIED]
**Derived from:** EL-ENERGY-POWER-TIME-RELATIONSHIP-001 [MATHEMATICAL]
**Entailment result:** FULLY_SUPPORTED_DERIVED
**Scope status (CC-09B.5):** IN_SCOPE_SUPPORTING

### EL-ENERGY-CALC-001

**Statement (v1, APPROVED):** Calculate the electrical energy transferred by a device from its power rating and its time of use, using E = P times t.

**Direct prerequisites:** EL-ENERGY-POWER-TIME-RELATIONSHIP-001 (REQUIRED); FM-ALG-SUBSTITUTION-001 (REQUIRED)
**Direct dependents:** EL-ENERGY-KWH-CALC-001
**Curriculum mapping(s):** Identify and determine values of base and derived SI units which apply specifically to electrical quantities (REQUIRED_FOR); Identify and apply appropriate mathematical principles which are relevant to electrical work tasks (EXEMPLIFIES); Identify and determine values of base and derived SI units which apply specifically to electrical quantities (REQUIRED_FOR); Identify and apply appropriate mathematical principles which are relevant to electrical work tasks (EXEMPLIFIES)
**Provenance:** City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC2.2: identify and determine values of base and derived SI units which apply specifically to electrical quantities [CURRICULUM_REQUIRES, verification=VERIFIED]
**Derived from:** EL-ENERGY-POWER-TIME-RELATIONSHIP-001 [MATHEMATICAL]
**Entailment result:** FULLY_SUPPORTED_DERIVED
**Scope status (CC-09B.5):** IN_SCOPE_SUPPORTING

### EL-ENERGY-KWH-CALC-001

**Statement (v1, APPROVED):** Calculate the electrical energy used by a device in kilowatt-hours from its power rating in kilowatts and its time of use in hours.

**Direct prerequisites:** EL-ENERGY-CALC-001 (REQUIRED); EL-UNIT-KWH-001 (REQUIRED)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Identify and determine values of base and derived SI units which apply specifically to electrical quantities (SUPPORTS); Identify and determine values of base and derived SI units which apply specifically to electrical quantities (SUPPORTS)
**Provenance:** City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC2.2: identify and determine values of base and derived SI units which apply specifically to electrical quantities [CURRICULUM_REQUIRES, verification=VERIFIED]
**Derived from:** EL-ENERGY-POWER-TIME-RELATIONSHIP-001 [MATHEMATICAL]; EL-UNIT-KWH-001 [MATHEMATICAL]
**Entailment result:** FULLY_SUPPORTED_DERIVED
**Scope status (CC-09B.5):** IN_SCOPE_SUPPORTING

### EL-CONCEPT-MAGNETISM-001

**Statement (v1, APPROVED):** Magnetic poles exert forces on one another: like poles repel and unlike poles attract.

**Direct prerequisites:** (none — root assertion)
**Direct dependents:** EL-CONCEPT-MAGNETIC-FIELD-CURRENT-001; EL-MAGNETISM-COMPARE-PERMANENT-ELECTROMAGNET-001
**Curriculum mapping(s):** Describe the effects of magnetism in terms of attraction and repulsion (REQUIRED_FOR); Describe the effects of magnetism in terms of attraction and repulsion (REQUIRED_FOR)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, Ch.11: magnetic attraction/repulsion; force on a current-carrying conductor in a magnetic field (11.4) [DEFINES, support=DIRECT, verification=UNVERIFIED] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC5.1: describe the effects of magnetism in terms of attraction and repulsion [CURRICULUM_REQUIRES, verification=VERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED

### EL-CONCEPT-MAGNETIC-FLUX-001

**Statement (v1, APPROVED):** Magnetic flux is a measure of the total amount of magnetic field passing through a given area.

**Direct prerequisites:** (none — root assertion)
**Direct dependents:** EL-UNIT-WEBER-001; EL-CONCEPT-MAGNETIC-FLUX-DENSITY-001; EL-CONCEPT-EMF-001; EL-CONCEPT-ELECTROMAGNETIC-INDUCTION-001; EL-CONCEPT-AC-GENERATOR-001
**Curriculum mapping(s):** State the difference between magnetic flux and flux density (REQUIRED_FOR); State the difference between magnetic flux and flux density (REQUIRED_FOR)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, Ch.13: magnetic flux and flux density (13.1 Faraday's Law); EMF; electric generators and the sinusoidal generated waveform (13.6) [DEFINES, support=DIRECT, verification=UNVERIFIED] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC5.2: state the difference between magnetic flux and flux density [CURRICULUM_REQUIRES, verification=VERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED

### EL-UNIT-WEBER-001

**Statement (v1, APPROVED):** The weber (Wb) is the SI derived unit of magnetic flux.

**Direct prerequisites:** EL-CONCEPT-MAGNETIC-FLUX-001 (REQUIRED)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** State the difference between magnetic flux and flux density (REQUIRED_FOR); State the difference between magnetic flux and flux density (REQUIRED_FOR)
**Provenance:** The International System of Units (SI Brochure) — SI Brochure: table of SI derived units with special names, including the volt, ohm, watt and joule, and SI prefixes [DEFINES, support=DIRECT, verification=UNVERIFIED] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC5.2: state the difference between magnetic flux and flux density [CURRICULUM_REQUIRES, verification=VERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_SUPPORTING

### EL-CONCEPT-MAGNETIC-FLUX-DENSITY-001

**Statement (v1, APPROVED):** Magnetic flux density is the amount of magnetic flux passing through a unit area, describing how concentrated a magnetic field is.

**Direct prerequisites:** EL-CONCEPT-MAGNETIC-FLUX-001 (REQUIRED)
**Direct dependents:** EL-UNIT-TESLA-001
**Curriculum mapping(s):** State the difference between magnetic flux and flux density (REQUIRED_FOR); State the difference between magnetic flux and flux density (REQUIRED_FOR)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, Ch.13: magnetic flux and flux density (13.1 Faraday's Law); EMF; electric generators and the sinusoidal generated waveform (13.6) [DEFINES, support=DIRECT, verification=UNVERIFIED] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC5.2: state the difference between magnetic flux and flux density [CURRICULUM_REQUIRES, verification=VERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED

### EL-UNIT-TESLA-001

**Statement (v1, APPROVED):** The tesla (T) is the SI derived unit of magnetic flux density.

**Direct prerequisites:** EL-CONCEPT-MAGNETIC-FLUX-DENSITY-001 (REQUIRED)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** State the difference between magnetic flux and flux density (REQUIRED_FOR); State the difference between magnetic flux and flux density (REQUIRED_FOR)
**Provenance:** The International System of Units (SI Brochure) — SI Brochure: table of SI derived units with special names, including the volt, ohm, watt and joule, and SI prefixes [DEFINES, support=DIRECT, verification=UNVERIFIED] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC5.2: state the difference between magnetic flux and flux density [CURRICULUM_REQUIRES, verification=VERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED

### EL-CONCEPT-MAGNETIC-FIELD-CURRENT-001

**Statement (v1, APPROVED):** A current-carrying conductor produces a magnetic field around it.

**Direct prerequisites:** EL-CONCEPT-CURRENT-001 (REQUIRED); EL-CONCEPT-MAGNETISM-001 (STRONG)
**Direct dependents:** EL-CONCEPT-FIELD-DIRECTION-RULE-001; EL-CONCEPT-FORCE-ON-CONDUCTOR-001; EL-CONCEPT-ELECTROMAGNETISM-001; EL-INSTRUMENT-CLAMP-METER-001
**Curriculum mapping(s):** Describe the magnetic effects of electrical currents (REQUIRED_FOR); Describe the magnetic effects of electrical currents in terms of: production of a magnetic field, force on a current-carrying conductor in a magnetic field, electromagnetism, electromotive force (REQUIRED_FOR)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, Ch.12: the magnetic field produced by a current-carrying conductor; electromagnetism [DEFINES, support=DIRECT, verification=UNVERIFIED] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC5.3: describe the magnetic effects of electrical currents in terms of production of a magnetic field, force on a current-carrying conductor, electromagnetism and electromotive force [CURRICULUM_REQUIRES, verification=VERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED

### EL-CONCEPT-FIELD-DIRECTION-RULE-001

**Statement (v1, APPROVED):** The direction of the magnetic field around a straight current-carrying conductor is given by Maxwell's screw rule (equivalently, the right-hand rule): with the thumb pointing in the direction of current flow, the curled fingers give the direction of the circular field around the conductor.

**Direct prerequisites:** EL-CONCEPT-MAGNETIC-FIELD-CURRENT-001 (REQUIRED)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Describe the magnetic effects of electrical currents (REQUIRED_FOR); Describe the magnetic effects of electrical currents in terms of: production of a magnetic field, force on a current-carrying conductor in a magnetic field, electromagnetism, electromotive force (REQUIRED_FOR)
**Provenance:** University Physics Volume 2 — The direction of the magnetic field created by a long straight current-carrying wire is given by the right-hand rule: point the thumb of the right hand in the direction of current flow, and the curled fingers give the direction of the circular magnetic field loops around the wire [DEFINES, support=DIRECT, verification=UNVERIFIED] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC5.3: describe the magnetic effects of electrical currents in terms of production of a magnetic field, force on a current-carrying conductor, electromagnetism and electromotive force [CURRICULUM_REQUIRES, verification=VERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED

### EL-CONCEPT-FORCE-ON-CONDUCTOR-001

**Statement (v1, APPROVED):** A current-carrying conductor placed in a magnetic field experiences a mechanical force.

**Direct prerequisites:** EL-CONCEPT-MAGNETIC-FIELD-CURRENT-001 (REQUIRED); FP-CONCEPT-FORCE-001 (REQUIRED)
**Direct dependents:** EL-REL-FORCE-ON-CONDUCTOR-001; EL-CONCEPT-ELECTROMAGNETISM-001; EL-CONCEPT-MOTOR-PRINCIPLE-001
**Curriculum mapping(s):** Describe the magnetic effects of electrical currents (REQUIRED_FOR); Describe the magnetic effects of electrical currents in terms of: production of a magnetic field, force on a current-carrying conductor in a magnetic field, electromagnetism, electromotive force (REQUIRED_FOR)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, Ch.11: magnetic attraction/repulsion; force on a current-carrying conductor in a magnetic field (11.4) [DEFINES, support=DIRECT, verification=UNVERIFIED] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC5.3: describe the magnetic effects of electrical currents in terms of production of a magnetic field, force on a current-carrying conductor, electromagnetism and electromotive force [CURRICULUM_REQUIRES, verification=VERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED

### EL-REL-FORCE-ON-CONDUCTOR-001

**Statement (v1, APPROVED):** The magnitude of the force on a straight current-carrying conductor at right angles to a magnetic field is given by F = B I l, where B is the magnetic flux density, I is the current and l is the length of the conductor in the field.

**Direct prerequisites:** EL-CONCEPT-FORCE-ON-CONDUCTOR-001 (REQUIRED)
**Direct dependents:** EL-CONCEPT-FLEMING-LEFT-HAND-001
**Curriculum mapping(s):** Describe the magnetic effects of electrical currents (REQUIRED_FOR); Describe the magnetic effects of electrical currents in terms of: production of a magnetic field, force on a current-carrying conductor in a magnetic field, electromagnetism, electromotive force (REQUIRED_FOR)
**Provenance:** University Physics Volume 2 — "F = I l x B. This is the force on a straight, current-carrying wire in a uniform magnetic field" -- the magnitude relationship F = B I l (for a conductor perpendicular to the field); direction is given by "RHR-1, where you point your fingers in the direction of the current and curl them toward the field; your thumb then points in the direction of the force" [DEFINES, support=DIRECT, verification=UNVERIFIED] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC5.3: describe the magnetic effects of electrical currents in terms of production of a magnetic field, force on a current-carrying conductor, electromagnetism and electromotive force [CURRICULUM_REQUIRES, verification=VERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED

### EL-CONCEPT-FLEMING-LEFT-HAND-001

**Statement (v1, APPROVED):** Fleming's left-hand rule gives the direction of the force on a current-carrying conductor in a magnetic field: with the First finger, seCond finger and thuMb of the left hand mutually at right angles, the First finger points along the Field, the seCond finger along the Current, and the thuMb gives the direction of Motion (force).

**Direct prerequisites:** EL-REL-FORCE-ON-CONDUCTOR-001 (REQUIRED)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Describe the magnetic effects of electrical currents (REQUIRED_FOR); Describe the magnetic effects of electrical currents in terms of: production of a magnetic field, force on a current-carrying conductor in a magnetic field, electromagnetism, electromotive force (REQUIRED_FOR)
**Provenance:** Fleming's left-hand rule for motors — "The Thumb represents the direction of the Motion (Force) of the conductor. The Fore finger represents the direction of the magnetic Field. The Centre finger represents the direction of the Current" -- the UK vocational-trade naming/mnemonic for the same force-direction rule OpenStax states as RHR-1, citing Fleming, John Ambrose (1902), Magnets and Electric Currents, 2nd ed., pp.173-174 [DEFINES, support=DIRECT, verification=UNVERIFIED] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC5.3: describe the magnetic effects of electrical currents in terms of production of a magnetic field, force on a current-carrying conductor, electromagnetism and electromotive force [CURRICULUM_REQUIRES, verification=VERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED

### EL-CONCEPT-ELECTROMAGNETISM-001

**Statement (v1, APPROVED):** Electromagnetism is the branch of physics concerned with the relationship between electric current and magnetic fields, including how one can produce the other.

**Direct prerequisites:** EL-CONCEPT-MAGNETIC-FIELD-CURRENT-001 (REQUIRED); EL-CONCEPT-FORCE-ON-CONDUCTOR-001 (REQUIRED)
**Direct dependents:** EL-MAGNETISM-COMPARE-PERMANENT-ELECTROMAGNET-001
**Curriculum mapping(s):** Describe the magnetic effects of electrical currents (REQUIRED_FOR); Describe the magnetic effects of electrical currents in terms of: production of a magnetic field, force on a current-carrying conductor in a magnetic field, electromagnetism, electromotive force (REQUIRED_FOR)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, Ch.12: the magnetic field produced by a current-carrying conductor; electromagnetism [DEFINES, support=DIRECT, verification=UNVERIFIED] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC5.3: describe the magnetic effects of electrical currents in terms of production of a magnetic field, force on a current-carrying conductor, electromagnetism and electromotive force [CURRICULUM_REQUIRES, verification=VERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED

### EL-CONCEPT-EMF-001

**Statement (v1, APPROVED):** Electromotive force (EMF) is the electrical energy per unit charge supplied by a source, which drives current around a circuit.

**Direct prerequisites:** EL-CONCEPT-MAGNETIC-FLUX-001 (STRONG)
**Direct dependents:** EL-REL-INDUCED-EMF-001; EL-CONCEPT-TERMINAL-VOLTAGE-001; EL-CONCEPT-ELECTROMAGNETIC-INDUCTION-001; EL-CONCEPT-AC-GENERATOR-001
**Curriculum mapping(s):** Describe the magnetic effects of electrical currents (REQUIRED_FOR); Describe the magnetic effects of electrical currents in terms of: production of a magnetic field, force on a current-carrying conductor in a magnetic field, electromagnetism, electromotive force (REQUIRED_FOR)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, Ch.13: magnetic flux and flux density (13.1 Faraday's Law); EMF; electric generators and the sinusoidal generated waveform (13.6) [DEFINES, support=DIRECT, verification=UNVERIFIED] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC5.3: describe the magnetic effects of electrical currents in terms of production of a magnetic field, force on a current-carrying conductor, electromagnetism and electromotive force [CURRICULUM_REQUIRES, verification=VERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED
**Misconceptions targeting this assertion:** MIS-EL-EMF-VOLTAGE-CONFUSION-001

### EL-REL-INDUCED-EMF-001

**Statement (v1, APPROVED):** For a straight conductor of effective length l moving through a magnetic field of flux density B, the magnitude of the induced EMF is given by e = B l v (where v is the conductor's velocity) when the conductor's length, its velocity and the magnetic field are all mutually perpendicular (at right angles) to one another.

**Direct prerequisites:** EL-CONCEPT-EMF-001 (REQUIRED)
**Direct dependents:** EL-CONCEPT-FLEMING-RIGHT-HAND-001
**Curriculum mapping(s):** Describe the magnetic effects of electrical currents (REQUIRED_FOR); Describe the magnetic effects of electrical currents in terms of: production of a magnetic field, force on a current-carrying conductor in a magnetic field, electromagnetism, electromotive force (REQUIRED_FOR)
**Provenance:** University Physics Volume 2 — "epsilon = Blv" (Equation 13.5) -- the motional EMF induced in a straight conductor of length l moving at velocity v through a magnetic field of flux density B, derived directly from Faraday's law (epsilon = dPhi_m/dt = B l dx/dt = B l v) for the case where the conductor's length, its velocity and the field are mutually perpendicular to one another [DEFINES, support=DIRECT, verification=UNVERIFIED] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC5.3: describe the magnetic effects of electrical currents in terms of production of a magnetic field, force on a current-carrying conductor, electromagnetism and electromotive force [CURRICULUM_REQUIRES, verification=VERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED

### EL-CONCEPT-FLEMING-RIGHT-HAND-001

**Statement (v1, APPROVED):** Fleming's right-hand rule gives the direction of the current induced in a conductor moving through a magnetic field: with the thumb, First finger and seCond finger of the right hand mutually at right angles, the thumb points in the direction of Motion, the First finger along the Field, and the seCond finger gives the direction of the induced Current.

**Direct prerequisites:** EL-REL-INDUCED-EMF-001 (REQUIRED)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Describe the magnetic effects of electrical currents (REQUIRED_FOR); Describe the magnetic effects of electrical currents in terms of: production of a magnetic field, force on a current-carrying conductor in a magnetic field, electromagnetism, electromotive force (REQUIRED_FOR)
**Provenance:** Fleming's right-hand rule — "The thumb is pointed in the direction of the motion of the conductor relative to the magnetic field. The first finger is pointed in the direction of the magnetic field... the second finger represents the direction of the induced or generated current" -- the UK vocational-trade naming/mnemonic for generator induced-current direction, citing Hughes, Edward (2016), Electrical and Electronic Technology [DEFINES, support=DIRECT, verification=UNVERIFIED] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC5.3: describe the magnetic effects of electrical currents in terms of production of a magnetic field, force on a current-carrying conductor, electromagnetism and electromotive force [CURRICULUM_REQUIRES, verification=VERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED

### EL-CONCEPT-TERMINAL-VOLTAGE-001

**Statement (v1, APPROVED):** Terminal voltage is the potential difference measured across the terminals of a source while it is supplying current, which is less than its EMF due to the source's own internal resistance.

**Direct prerequisites:** EL-CONCEPT-EMF-001 (REQUIRED); EL-CONCEPT-VOLTAGE-001 (REQUIRED)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Describe the magnetic effects of electrical currents (SUPPORTS); Describe the magnetic effects of electrical currents in terms of: production of a magnetic field, force on a current-carrying conductor in a magnetic field, electromagnetism, electromotive force (SUPPORTS)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, Ch.13: magnetic flux and flux density (13.1 Faraday's Law); EMF; electric generators and the sinusoidal generated waveform (13.6) [SUPPORTS, support=DIRECT, verification=UNVERIFIED] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC5.3: describe the magnetic effects of electrical currents in terms of production of a magnetic field, force on a current-carrying conductor, electromagnetism and electromotive force [CURRICULUM_REQUIRES, verification=VERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_SUPPORTING
**Misconceptions targeting this assertion:** MIS-EL-EMF-VOLTAGE-CONFUSION-001

### EL-CONCEPT-ELECTROMAGNETIC-INDUCTION-001

**Statement (v1, APPROVED):** A changing magnetic flux through a circuit or coil induces an electromotive force (EMF) in that circuit -- the principle of electromagnetic induction.

**Direct prerequisites:** EL-CONCEPT-MAGNETIC-FLUX-001 (REQUIRED); EL-CONCEPT-EMF-001 (REQUIRED)
**Direct dependents:** EL-REL-FLUX-CHANGE-EMF-001; EL-CONCEPT-AC-GENERATOR-001
**Curriculum mapping(s):** Describe the basic principles of generating an A.C. supply (REQUIRED_FOR); Describe the basic principles of generating an A.C. supply in terms of: a single-loop generator, sine-wave, frequency, EMF, magnetic flux (REQUIRED_FOR)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, Ch.13: magnetic flux and flux density (13.1 Faraday's Law); EMF; electric generators and the sinusoidal generated waveform (13.6) [DEFINES, support=DIRECT, verification=UNVERIFIED] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC5.4: describe the basic principles of generating an A.C. supply in terms of a single-loop generator, sine-wave, frequency, EMF and magnetic flux [CURRICULUM_REQUIRES, verification=VERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_SUPPORTING

### EL-REL-FLUX-CHANGE-EMF-001

**Statement (v1, APPROVED):** The magnitude of the EMF induced in a single loop equals the rate of change of the magnetic flux through it: e = (change in flux) / (time taken).

**Direct prerequisites:** EL-CONCEPT-ELECTROMAGNETIC-INDUCTION-001 (REQUIRED)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Describe the basic principles of generating an A.C. supply (REQUIRED_FOR); Describe the basic principles of generating an A.C. supply in terms of: a single-loop generator, sine-wave, frequency, EMF, magnetic flux (REQUIRED_FOR)
**Provenance:** University Physics Volume 2 — "epsilon = -dPhi_m/dt" (single loop) and "epsilon = -N dPhi_m/dt" (N-turn coil) -- the induced EMF equals the (negative) rate of change of magnetic flux linking the circuit [DEFINES, support=DIRECT, verification=UNVERIFIED] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC5.4: describe the basic principles of generating an A.C. supply in terms of a single-loop generator, sine-wave, frequency, EMF and magnetic flux [CURRICULUM_REQUIRES, verification=VERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED

### EL-CONCEPT-AC-GENERATOR-001

**Statement (v1, APPROVED):** A simple AC generator produces an alternating EMF by rotating a single loop of wire at constant speed within a magnetic field, continuously changing the flux linking the loop.

**Direct prerequisites:** EL-CONCEPT-ELECTROMAGNETIC-INDUCTION-001 (REQUIRED); EL-CONCEPT-EMF-001 (REQUIRED); EL-CONCEPT-MAGNETIC-FLUX-001 (REQUIRED)
**Direct dependents:** EL-CONCEPT-SINE-WAVE-001; EL-MOTOR-GENERATOR-COMPARE-001
**Curriculum mapping(s):** Describe the basic principles of generating an A.C. supply (REQUIRED_FOR); Describe the basic principles of generating an A.C. supply in terms of: a single-loop generator, sine-wave, frequency, EMF, magnetic flux (REQUIRED_FOR)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, Ch.13: magnetic flux and flux density (13.1 Faraday's Law); EMF; electric generators and the sinusoidal generated waveform (13.6) [DEFINES, support=DIRECT, verification=UNVERIFIED] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC5.4: describe the basic principles of generating an A.C. supply in terms of a single-loop generator, sine-wave, frequency, EMF and magnetic flux [CURRICULUM_REQUIRES, verification=VERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED

### EL-CONCEPT-SINE-WAVE-001

**Statement (v1, APPROVED):** The EMF produced by a simple rotating-loop AC generator varies with time as a sine wave.

**Direct prerequisites:** EL-CONCEPT-AC-GENERATOR-001 (REQUIRED)
**Direct dependents:** EL-CONCEPT-AC-DC-DISTINCTION-001; EL-WAVEFORM-PERIODIC-TIME-001; EL-WAVEFORM-AMPLITUDE-001; EL-WAVEFORM-RMS-001; EL-WAVEFORM-AVERAGE-VALUE-001
**Curriculum mapping(s):** Describe the basic principles of generating an A.C. supply (REQUIRED_FOR); Describe the basic principles of generating an A.C. supply in terms of: a single-loop generator, sine-wave, frequency, EMF, magnetic flux (REQUIRED_FOR)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, Ch.13: magnetic flux and flux density (13.1 Faraday's Law); EMF; electric generators and the sinusoidal generated waveform (13.6) [DEFINES, support=DIRECT, verification=UNVERIFIED] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC5.4: describe the basic principles of generating an A.C. supply in terms of a single-loop generator, sine-wave, frequency, EMF and magnetic flux [CURRICULUM_REQUIRES, verification=VERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED
**Misconceptions targeting this assertion:** MIS-EL-AC-DC-CONFUSION-001

### EL-CONCEPT-AC-DC-DISTINCTION-001

**Statement (v1, APPROVED):** Direct current (D.C.) flows in one direction, and its magnitude may be steady or may vary (as with pulsating D.C.); alternating current (A.C.) periodically reverses direction and ordinarily varies in magnitude, typically following a sine wave.

**Direct prerequisites:** EL-CONCEPT-SINE-WAVE-001 (REQUIRED); EL-CONCEPT-CURRENT-001 (REQUIRED)
**Direct dependents:** EL-CIRCUIT-AC-SUPPLY-RECOGNITION-001; EL-CIRCUIT-COMPARE-AC-DC-BEHAVIOUR-001; EL-COMPONENT-RECTIFIER-001; EL-COMPONENT-INVERTER-001
**Curriculum mapping(s):** Describe the basic principles of generating an A.C. supply (REQUIRED_FOR); Describe the basic principles of generating an A.C. supply in terms of: a single-loop generator, sine-wave, frequency, EMF, magnetic flux (REQUIRED_FOR)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, Ch.13: magnetic flux and flux density (13.1 Faraday's Law); EMF; electric generators and the sinusoidal generated waveform (13.6) [SUPPORTS, support=DIRECT, verification=UNVERIFIED] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC5.4: describe the basic principles of generating an A.C. supply in terms of a single-loop generator, sine-wave, frequency, EMF and magnetic flux [CURRICULUM_REQUIRES, verification=VERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED
**Misconceptions targeting this assertion:** MIS-EL-AC-DC-CONFUSION-001

### EL-CIRCUIT-AC-SUPPLY-RECOGNITION-001

**Statement (v1, APPROVED):** UK domestic and industrial electrical supplies are alternating current, with a standard frequency of 50 Hz.

**Direct prerequisites:** EL-CONCEPT-AC-DC-DISTINCTION-001 (REQUIRED); EL-CONCEPT-FREQUENCY-001 (REQUIRED)
**Direct dependents:** EL-CONCEPT-PEAK-VS-RMS-SUPPLY-INTERPRETATION-001
**Curriculum mapping(s):** Describe the basic principles of generating an A.C. supply (SUPPORTS); Describe the basic principles of generating an A.C. supply in terms of: a single-loop generator, sine-wave, frequency, EMF, magnetic flux (SUPPORTS)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, Ch.13: magnetic flux and flux density (13.1 Faraday's Law); EMF; electric generators and the sinusoidal generated waveform (13.6) [SUPPORTS, support=DIRECT, verification=UNVERIFIED] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC5.4: describe the basic principles of generating an A.C. supply in terms of a single-loop generator, sine-wave, frequency, EMF and magnetic flux [CURRICULUM_REQUIRES, verification=VERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_SUPPORTING

### EL-WAVEFORM-PERIODIC-TIME-001

**Statement (v1, APPROVED):** Periodic time is the time taken to complete one full cycle of a repeating waveform.

**Direct prerequisites:** EL-CONCEPT-SINE-WAVE-001 (STRONG)
**Direct dependents:** EL-WAVEFORM-FREQUENCY-PERIOD-RELATIONSHIP-001; EL-INSTRUMENT-OSCILLOSCOPE-001
**Curriculum mapping(s):** Identify the characteristics of sine-waves (REQUIRED_FOR); Characteristics of a sine-wave: Periodic time (REQUIRED_FOR); Identify the characteristics of sine-waves (REQUIRED_FOR)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, Ch.13: magnetic flux and flux density (13.1 Faraday's Law); EMF; electric generators and the sinusoidal generated waveform (13.6) [DEFINES, support=DIRECT, verification=UNVERIFIED] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC5.5: identify the characteristics of sine-waves (RMS value, average value, peak-to-peak value, periodic time, frequency, amplitude) [CURRICULUM_REQUIRES, verification=VERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED

### EL-WAVEFORM-AMPLITUDE-001

**Statement (v1, APPROVED):** Amplitude is the maximum displacement of a waveform from its zero (mean) value.

**Direct prerequisites:** EL-CONCEPT-SINE-WAVE-001 (STRONG)
**Direct dependents:** EL-WAVEFORM-PEAK-TO-PEAK-001; EL-WAVEFORM-RMS-PEAK-RELATIONSHIP-001; EL-INSTRUMENT-OSCILLOSCOPE-001
**Curriculum mapping(s):** Identify the characteristics of sine-waves (REQUIRED_FOR); Characteristics of a sine-wave: Amplitude (REQUIRED_FOR); Identify the characteristics of sine-waves (REQUIRED_FOR)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, Ch.13: magnetic flux and flux density (13.1 Faraday's Law); EMF; electric generators and the sinusoidal generated waveform (13.6) [DEFINES, support=DIRECT, verification=UNVERIFIED] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC5.5: identify the characteristics of sine-waves (RMS value, average value, peak-to-peak value, periodic time, frequency, amplitude) [CURRICULUM_REQUIRES, verification=VERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED

### EL-WAVEFORM-PEAK-TO-PEAK-001

**Statement (v1, APPROVED):** The peak-to-peak value of a waveform is the difference between its maximum positive and maximum negative values.

**Direct prerequisites:** EL-WAVEFORM-AMPLITUDE-001 (REQUIRED)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Identify the characteristics of sine-waves (REQUIRED_FOR); Characteristics of a sine-wave: Peak to peak value (REQUIRED_FOR); Identify the characteristics of sine-waves (REQUIRED_FOR)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, Ch.13: magnetic flux and flux density (13.1 Faraday's Law); EMF; electric generators and the sinusoidal generated waveform (13.6) [DEFINES, support=DIRECT, verification=UNVERIFIED] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC5.5: identify the characteristics of sine-waves (RMS value, average value, peak-to-peak value, periodic time, frequency, amplitude) [CURRICULUM_REQUIRES, verification=VERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED

### EL-WAVEFORM-RMS-001

**Statement (v1, APPROVED):** The RMS (root mean square) value of an alternating quantity is the value of direct current or voltage that would produce the same heating effect in a resistor.

**Direct prerequisites:** EL-CONCEPT-SINE-WAVE-001 (REQUIRED); EL-CURRENT-THERMAL-EFFECT-001 (STRONG)
**Direct dependents:** EL-WAVEFORM-RMS-PEAK-RELATIONSHIP-001
**Curriculum mapping(s):** Identify the characteristics of sine-waves (REQUIRED_FOR); Characteristics of a sine-wave: Root Mean Square (RMS) value (REQUIRED_FOR); Identify the characteristics of sine-waves (REQUIRED_FOR)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, Ch.13: magnetic flux and flux density (13.1 Faraday's Law); EMF; electric generators and the sinusoidal generated waveform (13.6) [DEFINES, support=DIRECT, verification=UNVERIFIED] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC5.5: identify the characteristics of sine-waves (RMS value, average value, peak-to-peak value, periodic time, frequency, amplitude) [CURRICULUM_REQUIRES, verification=VERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED
**Misconceptions targeting this assertion:** MIS-EL-PEAK-RMS-CONFUSION-001

### EL-WAVEFORM-AVERAGE-VALUE-001

**Statement (v1, APPROVED):** The conventional (non-zero) average value quoted for an alternating waveform in AC calculations is the average taken over one half-cycle of the waveform; this is equivalent to averaging the full-wave-rectified waveform over a complete cycle, since rectification makes every half-cycle the same shape.

**Direct prerequisites:** EL-CONCEPT-SINE-WAVE-001 (REQUIRED)
**Direct dependents:** EL-WAVEFORM-AVERAGE-ZERO-INTERPRETATION-001
**Curriculum mapping(s):** Identify the characteristics of sine-waves (REQUIRED_FOR); Characteristics of a sine-wave: Average value (REQUIRED_FOR); Identify the characteristics of sine-waves (REQUIRED_FOR)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, Ch.13: magnetic flux and flux density (13.1 Faraday's Law); EMF; electric generators and the sinusoidal generated waveform (13.6) [DEFINES, support=DIRECT, verification=UNVERIFIED] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC5.5: identify the characteristics of sine-waves (RMS value, average value, peak-to-peak value, periodic time, frequency, amplitude) [CURRICULUM_REQUIRES, verification=VERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED

### EL-WAVEFORM-AVERAGE-ZERO-INTERPRETATION-001

**Statement (v1, APPROVED):** The average value of a symmetrical sine wave taken over a full cycle is zero, because the positive and negative half-cycles cancel; the conventional non-zero 'average value' quoted for AC calculations is instead taken over one half-cycle, equivalently the average of the full-wave-rectified waveform over a full cycle.

**Direct prerequisites:** EL-WAVEFORM-AVERAGE-VALUE-001 (REQUIRED)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Identify the characteristics of sine-waves (SUPPORTS); Identify the characteristics of sine-waves (SUPPORTS)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, Ch.13: magnetic flux and flux density (13.1 Faraday's Law); EMF; electric generators and the sinusoidal generated waveform (13.6) [SUPPORTS, support=DIRECT, verification=UNVERIFIED] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC5.5: identify the characteristics of sine-waves (RMS value, average value, peak-to-peak value, periodic time, frequency, amplitude) [CURRICULUM_REQUIRES, verification=VERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_SUPPORTING

### EL-WAVEFORM-RMS-PEAK-RELATIONSHIP-001

**Statement (v1, APPROVED):** For a pure sine wave, the RMS value equals the peak value divided by the square root of two.

**Direct prerequisites:** EL-WAVEFORM-RMS-001 (REQUIRED); EL-WAVEFORM-AMPLITUDE-001 (REQUIRED)
**Direct dependents:** EL-WAVEFORM-RMS-CALC-001; EL-CONCEPT-PEAK-VS-RMS-SUPPLY-INTERPRETATION-001
**Curriculum mapping(s):** Identify the characteristics of sine-waves (REQUIRED_FOR); Identify the characteristics of sine-waves (REQUIRED_FOR)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, Ch.15: impedance, reactance, inductance, capacitance and power factor in AC circuits [SUPPORTS, support=DIRECT, verification=UNVERIFIED] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC5.5: identify the characteristics of sine-waves (RMS value, average value, peak-to-peak value, periodic time, frequency, amplitude) [CURRICULUM_REQUIRES, verification=VERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_SUPPORTING

### EL-WAVEFORM-RMS-CALC-001

**Statement (v1, APPROVED):** Calculate the RMS value of a sine wave from its peak value, or the peak value from its RMS value.

**Direct prerequisites:** EL-WAVEFORM-RMS-PEAK-RELATIONSHIP-001 (REQUIRED); FM-ALG-SUBSTITUTION-001 (REQUIRED)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Identify the characteristics of sine-waves (REQUIRED_FOR); Identify the characteristics of sine-waves (REQUIRED_FOR)
**Provenance:** City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC5.5: identify the characteristics of sine-waves (RMS value, average value, peak-to-peak value, periodic time, frequency, amplitude) [CURRICULUM_REQUIRES, verification=VERIFIED]
**Derived from:** EL-WAVEFORM-RMS-PEAK-RELATIONSHIP-001 [MATHEMATICAL]
**Entailment result:** FULLY_SUPPORTED_DERIVED
**Scope status (CC-09B.5):** IN_SCOPE_SUPPORTING

### EL-CONCEPT-PEAK-VS-RMS-SUPPLY-INTERPRETATION-001

**Statement (v1, APPROVED):** The rated voltage of an AC supply (for example 230 V) refers to its RMS value, not its peak value, which is higher.

**Direct prerequisites:** EL-WAVEFORM-RMS-PEAK-RELATIONSHIP-001 (REQUIRED); EL-CIRCUIT-AC-SUPPLY-RECOGNITION-001 (STRONG)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Identify the characteristics of sine-waves (SUPPORTS); Identify the characteristics of sine-waves (SUPPORTS)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, Ch.15: impedance, reactance, inductance, capacitance and power factor in AC circuits [SUPPORTS, support=DIRECT, verification=UNVERIFIED] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC5.5: identify the characteristics of sine-waves (RMS value, average value, peak-to-peak value, periodic time, frequency, amplitude) [CURRICULUM_REQUIRES, verification=VERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_SUPPORTING
**Misconceptions targeting this assertion:** MIS-EL-PEAK-RMS-CONFUSION-001

### EL-WAVEFORM-FREQUENCY-PERIOD-RELATIONSHIP-001

**Statement (v1, APPROVED):** Frequency and periodic time are reciprocals of each other: frequency equals one divided by periodic time.

**Direct prerequisites:** EL-CONCEPT-FREQUENCY-001 (REQUIRED); EL-WAVEFORM-PERIODIC-TIME-001 (REQUIRED); FM-ARITH-RECIPROCAL-001 (REQUIRED)
**Direct dependents:** EL-WAVEFORM-FREQUENCY-CALC-001
**Curriculum mapping(s):** Identify the characteristics of sine-waves (REQUIRED_FOR); Characteristics of a sine-wave: Frequency (REQUIRED_FOR); Identify the characteristics of sine-waves (REQUIRED_FOR)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, Ch.13: magnetic flux and flux density (13.1 Faraday's Law); EMF; electric generators and the sinusoidal generated waveform (13.6) [SUPPORTS, support=DIRECT, verification=UNVERIFIED] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC5.5: identify the characteristics of sine-waves (RMS value, average value, peak-to-peak value, periodic time, frequency, amplitude) [CURRICULUM_REQUIRES, verification=VERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_SUPPORTING

### EL-WAVEFORM-FREQUENCY-CALC-001

**Statement (v1, APPROVED):** Calculate frequency from periodic time, or periodic time from frequency, using their reciprocal relationship.

**Direct prerequisites:** EL-WAVEFORM-FREQUENCY-PERIOD-RELATIONSHIP-001 (REQUIRED); FM-ALG-SUBSTITUTION-001 (REQUIRED)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Identify the characteristics of sine-waves (REQUIRED_FOR); Identify the characteristics of sine-waves (REQUIRED_FOR)
**Provenance:** City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC5.5: identify the characteristics of sine-waves (RMS value, average value, peak-to-peak value, periodic time, frequency, amplitude) [CURRICULUM_REQUIRES, verification=VERIFIED]
**Derived from:** EL-WAVEFORM-FREQUENCY-PERIOD-RELATIONSHIP-001 [MATHEMATICAL]
**Entailment result:** FULLY_SUPPORTED_DERIVED
**Scope status (CC-09B.5):** IN_SCOPE_SUPPORTING

### EL-MAGNETISM-COMPARE-PERMANENT-ELECTROMAGNET-001

**Statement (v1, APPROVED):** Compare a permanent magnet, which retains its magnetism without a current, with an electromagnet, whose magnetic field depends on a current flowing through a coil.

**Direct prerequisites:** EL-CONCEPT-ELECTROMAGNETISM-001 (REQUIRED); EL-CONCEPT-MAGNETISM-001 (REQUIRED)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Describe the magnetic effects of electrical currents (SUPPORTS); Describe the magnetic effects of electrical currents in terms of: production of a magnetic field, force on a current-carrying conductor in a magnetic field, electromagnetism, electromotive force (SUPPORTS)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, Ch.12: the magnetic field produced by a current-carrying conductor; electromagnetism [SUPPORTS, support=DIRECT, verification=UNVERIFIED] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC5.3: describe the magnetic effects of electrical currents in terms of production of a magnetic field, force on a current-carrying conductor, electromagnetism and electromotive force [CURRICULUM_REQUIRES, verification=VERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_SUPPORTING

### EL-INSTRUMENT-CLAMP-METER-001

**Statement (v1, APPROVED):** A clamp meter measures current without breaking the circuit, by detecting the magnetic field produced around the current-carrying conductor.

**Direct prerequisites:** EL-CONCEPT-MAGNETIC-FIELD-CURRENT-001 (REQUIRED); EL-CONCEPT-CURRENT-001 (REQUIRED)
**Direct dependents:** (none — leaf capability)
**Provenance:** The ABCs of Clamp Meters — "The integration of a hinged jaw into an electrical meter enables technicians to securely clamp around a wire, cable, or conductor at any point in an electrical system, facilitating current measurement in the circuit without the need for disconnection or de-energization"; the jaws "consist of ferrite iron and are engineered to detect, concentrate, and measure the magnetic field generated by current as it flows through a conductor" [DEFINES, support=DIRECT, verification=UNVERIFIED] | University Physics Volume 2 — University Physics Volume 2, Ch.12: the magnetic field produced by a current-carrying conductor; electromagnetism [SUPPORTS, support=PARTIAL, verification=UNVERIFIED] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC2.3: identify appropriate electrical instruments for the measurement of different electrical quantities [CURRICULUM_REQUIRES, verification=VERIFIED]
**Entailment result:** FULLY_SUPPORTED_MULTI_SOURCE
**Clause coverage:** "a clamp meter measures current without breaking the circuit, via ferrite jaws detecting the magnetic field" -> The ABCs of Clamp Meters (loc-fluke-clamp-meter-principle); "(background) current flowing in a conductor produces a magnetic field around it" -> University Physics Volume 2 (loc-openstax-up2-magnetic-sources)

### EL-CONCEPT-MOTOR-PRINCIPLE-001

**Statement (v1, APPROVED):** An electric motor uses the force on a current-carrying conductor in a magnetic field to produce rotational motion.

**Direct prerequisites:** EL-CONCEPT-FORCE-ON-CONDUCTOR-001 (REQUIRED)
**Direct dependents:** EL-MOTOR-GENERATOR-COMPARE-001
**Curriculum mapping(s):** Describe the magnetic effects of electrical currents (SUPPORTS); Describe the magnetic effects of electrical currents in terms of: production of a magnetic field, force on a current-carrying conductor in a magnetic field, electromagnetism, electromotive force (SUPPORTS)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, Ch.11: magnetic attraction/repulsion; force on a current-carrying conductor in a magnetic field (11.4) [SUPPORTS, support=DIRECT, verification=UNVERIFIED] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC5.3: describe the magnetic effects of electrical currents in terms of production of a magnetic field, force on a current-carrying conductor, electromagnetism and electromotive force [CURRICULUM_REQUIRES, verification=VERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_SUPPORTING

### EL-MOTOR-GENERATOR-COMPARE-001

**Statement (v1, APPROVED):** Compare an electric motor, which converts electrical energy into mechanical motion using force on a current-carrying conductor, with a generator, which converts mechanical motion into electrical energy using electromagnetic induction.

**Direct prerequisites:** EL-CONCEPT-MOTOR-PRINCIPLE-001 (REQUIRED); EL-CONCEPT-AC-GENERATOR-001 (REQUIRED)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Describe the basic principles of generating an A.C. supply (SUPPORTS); Describe the basic principles of generating an A.C. supply in terms of: a single-loop generator, sine-wave, frequency, EMF, magnetic flux (SUPPORTS)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, Ch.13: magnetic flux and flux density (13.1 Faraday's Law); EMF; electric generators and the sinusoidal generated waveform (13.6) [SUPPORTS, support=DIRECT, verification=UNVERIFIED] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC5.4: describe the basic principles of generating an A.C. supply in terms of a single-loop generator, sine-wave, frequency, EMF and magnetic flux [CURRICULUM_REQUIRES, verification=VERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_SUPPORTING

### EL-INSTRUMENT-OSCILLOSCOPE-001

**Statement (v1, APPROVED):** An oscilloscope displays how a voltage varies with time, allowing the shape, amplitude and periodic time of a waveform to be observed.

**Direct prerequisites:** EL-WAVEFORM-AMPLITUDE-001 (STRONG); EL-WAVEFORM-PERIODIC-TIME-001 (STRONG)
**Direct dependents:** (none — leaf capability)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, Ch.13: magnetic flux and flux density (13.1 Faraday's Law); EMF; electric generators and the sinusoidal generated waveform (13.6) [SUPPORTS, support=DIRECT, verification=UNVERIFIED] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC5.5: identify the characteristics of sine-waves (RMS value, average value, peak-to-peak value, periodic time, frequency, amplitude) [CURRICULUM_REQUIRES, verification=VERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE

### EL-CIRCUIT-COMPARE-AC-DC-BEHAVIOUR-001

**Statement (v1, APPROVED):** Compare how a resistor behaves the same way under AC or DC supply (Ohm's law applies using RMS values), while an inductor or capacitor's opposition to current depends on whether the supply is AC or DC.

**Direct prerequisites:** EL-CONCEPT-AC-DC-DISTINCTION-001 (REQUIRED); EL-CONCEPT-REACTANCE-001 (REQUIRED); EL-OHM-RELATIONSHIP-001 (STRONG)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Describe the basic principles of generating an A.C. supply (SUPPORTS); Describe the basic principles of generating an A.C. supply in terms of: a single-loop generator, sine-wave, frequency, EMF, magnetic flux (SUPPORTS)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, Ch.15: impedance, reactance, inductance, capacitance and power factor in AC circuits [SUPPORTS, support=DIRECT, verification=UNVERIFIED] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC5.4: describe the basic principles of generating an A.C. supply in terms of a single-loop generator, sine-wave, frequency, EMF and magnetic flux [CURRICULUM_REQUIRES, verification=VERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_SUPPORTING

### EL-CIRCUIT-ZERO-RESISTANCE-INTERPRETATION-001

**Statement (v1, APPROVED):** An ideal conductor with zero resistance has zero voltage drop across it, regardless of the current flowing through it.

**Direct prerequisites:** EL-VOLTAGE-DROP-001 (REQUIRED); EL-OHM-RELATIONSHIP-001 (STRONG)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** State what is meant by the term voltage drop in relation to electrical circuits (SUPPORTS); State what is meant by the term voltage drop in relation to electrical circuits (SUPPORTS)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, 9.4: Ohm's law, V = IR, and voltage/potential difference [SUPPORTS, support=DIRECT, verification=UNVERIFIED] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC4.7: state what is meant by the term voltage drop in relation to electrical circuits [CURRICULUM_REQUIRES, verification=VERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_SUPPORTING

### EL-CIRCUIT-OPEN-CIRCUIT-RESISTANCE-INTERPRETATION-001

**Statement (v1, APPROVED):** An open circuit can be modelled as having infinite resistance, since no current can flow through it regardless of the applied voltage.

**Direct prerequisites:** EL-CIRCUIT-RECOGNISE-OPEN-CIRCUIT-001 (REQUIRED); EL-OHM-RELATIONSHIP-001 (STRONG)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Explain the relationship between current, voltage and resistance in parallel and series D.C. circuits (SUPPORTS); Explain the relationship between current, voltage and resistance in parallel and series D.C. circuits (SUPPORTS)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, 9.4: Ohm's law, V = IR, and voltage/potential difference [SUPPORTS, support=DIRECT, verification=UNVERIFIED] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC4.4: explain the relationship between current, voltage and resistance in parallel and series D.C. circuits [CURRICULUM_REQUIRES, verification=VERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_SUPPORTING

### EL-COMPONENT-RESISTOR-001

**Statement (v1, APPROVED):** A resistor is a component manufactured to provide a specific, stable value of resistance, used in circuits to limit current or to divide voltage.

**Direct prerequisites:** EL-CONCEPT-RESISTANCE-001 (REQUIRED)
**Direct dependents:** EL-APPLICATION-TELEPHONE-MASTER-SOCKET-001
**Curriculum mapping(s):** State the basic operating principles of electronic components and devices (REQUIRED_FOR); Electronic components and devices: Resistors (REQUIRED_FOR)
**Provenance:** Electric Circuits I - Direct Current (Kuphaldt) — A resistor is a component manufactured to provide a specific, stable value of resistance, used in circuits to limit current or to divide voltage [DEFINES, support=DIRECT, verification=UNVERIFIED] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC6.2: state the basic operating principles of electronic components and devices (capacitors, resistors, rectifiers, diodes, zener, LED, photo, thermistors, diacs, triacs, transistors, thyristors, invertors) [CURRICULUM_REQUIRES, verification=VERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED

### EL-COMPONENT-CAPACITOR-001

**Statement (v1, APPROVED):** A capacitor is a component that stores electrical charge and energy by separating charge in an electric field between two conductive plates; a charged capacitor stores this energy in the electric field between its plates.

**Direct prerequisites:** EL-CONCEPT-CAPACITANCE-001 (REQUIRED)
**Direct dependents:** EL-COMPONENT-CAPACITOR-TRANSIENT-001; EL-APPLICATION-TELEPHONE-MASTER-SOCKET-001
**Curriculum mapping(s):** State the basic operating principles of electronic components and devices (REQUIRED_FOR); Electronic components and devices: Capacitors (REQUIRED_FOR)
**Provenance:** University Physics Volume 2 — A capacitor is a device used to store electrical charge and electrical energy: charge Q moves from one conductive plate to the other, creating equal and opposite charges on each plate and an electric field between them; a charged capacitor stores energy in that electric field, expressed as U = (1/2)CV^2 = (1/2)Q^2/C = (1/2)QV [DEFINES, support=DIRECT, verification=UNVERIFIED] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC6.2: state the basic operating principles of electronic components and devices (capacitors, resistors, rectifiers, diodes, zener, LED, photo, thermistors, diacs, triacs, transistors, thyristors, invertors) [CURRICULUM_REQUIRES, verification=VERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED

### EL-COMPONENT-CAPACITOR-TRANSIENT-001

**Statement (v1, APPROVED):** A capacitor opposes a sudden change in the voltage across it: connected in a circuit with resistance, it charges and discharges exponentially over time (governed by the time constant tau = R times C) rather than the voltage across it changing instantaneously.

**Direct prerequisites:** EL-COMPONENT-CAPACITOR-001 (REQUIRED)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** State the basic operating principles of electronic components and devices (SUPPORTS); Electronic components and devices: Capacitors (SUPPORTS)
**Provenance:** University Physics Volume 2 — In a circuit with resistance, a capacitor's voltage rises or falls exponentially rather than instantaneously: charging, Vc(t) = epsilon(1 - e^(-t/tau)); discharging, q(t) = Q e^(-t/tau); with time constant tau = RC, the capacitor reaches only 63.2% of its final change after one time constant, demonstrating gradual (not sudden) voltage change [DEFINES, support=DIRECT, verification=UNVERIFIED] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC6.2: state the basic operating principles of electronic components and devices (capacitors, resistors, rectifiers, diodes, zener, LED, photo, thermistors, diacs, triacs, transistors, thyristors, invertors) [CURRICULUM_REQUIRES, verification=VERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_SUPPORTING

### EL-COMPONENT-RECTIFIER-001

**Statement (v1, APPROVED):** A rectifier circuit uses one or more diodes to convert an alternating-current supply into a direct-current (or pulsating direct-current) output.

**Direct prerequisites:** EL-CONCEPT-AC-DC-DISTINCTION-001 (STRONG)
**Direct dependents:** EL-COMPONENT-RECTIFIER-HALF-WAVE-001; EL-COMPONENT-RECTIFIER-FULL-WAVE-001
**Curriculum mapping(s):** State the basic operating principles of electronic components and devices (REQUIRED_FOR); Electronic components and devices: Rectifiers (REQUIRED_FOR)
**Provenance:** Electric Circuits III - Semiconductors (Kuphaldt) — A rectifier circuit uses one or more diodes to convert an alternating-current input into a direct-current (or pulsating direct-current) output [DEFINES, support=DIRECT, verification=UNVERIFIED] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC6.2: state the basic operating principles of electronic components and devices (capacitors, resistors, rectifiers, diodes, zener, LED, photo, thermistors, diacs, triacs, transistors, thyristors, invertors) [CURRICULUM_REQUIRES, verification=VERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED

### EL-COMPONENT-RECTIFIER-HALF-WAVE-001

**Statement (v1, APPROVED):** A half-wave rectifier uses a single diode to allow only one half-cycle of an AC waveform through to the load, blocking the other half-cycle, producing a pulsating DC output.

**Direct prerequisites:** EL-COMPONENT-RECTIFIER-001 (REQUIRED)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** State the basic operating principles of electronic components and devices (REQUIRED_FOR); Electronic components and devices: Rectifiers (SUPPORTS)
**Provenance:** Electric Circuits III - Semiconductors (Kuphaldt) — A rectifier circuit uses one or more diodes to convert an alternating-current input into a direct-current (or pulsating direct-current) output [DEFINES, support=DIRECT, verification=UNVERIFIED] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC6.2: state the basic operating principles of electronic components and devices (capacitors, resistors, rectifiers, diodes, zener, LED, photo, thermistors, diacs, triacs, transistors, thyristors, invertors) [CURRICULUM_REQUIRES, verification=VERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED

### EL-COMPONENT-RECTIFIER-FULL-WAVE-001

**Statement (v1, APPROVED):** A full-wave bridge rectifier uses four diodes arranged so that both half-cycles of an AC waveform are converted to the same output polarity, producing a pulsating DC output with less ripple than a half-wave rectifier.

**Direct prerequisites:** EL-COMPONENT-RECTIFIER-001 (REQUIRED)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** State the basic operating principles of electronic components and devices (REQUIRED_FOR); Electronic components and devices: Rectifiers (SUPPORTS)
**Provenance:** Electric Circuits III - Semiconductors (Kuphaldt) — A rectifier circuit uses one or more diodes to convert an alternating-current input into a direct-current (or pulsating direct-current) output [DEFINES, support=DIRECT, verification=UNVERIFIED] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC6.2: state the basic operating principles of electronic components and devices (capacitors, resistors, rectifiers, diodes, zener, LED, photo, thermistors, diacs, triacs, transistors, thyristors, invertors) [CURRICULUM_REQUIRES, verification=VERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED

### EL-COMPONENT-DIODE-001

**Statement (v1, APPROVED):** A diode is a semiconductor device formed at a p-n junction that conducts current easily in one direction (forward bias, junction narrows) and blocks current in the other direction (reverse bias, junction widens).

**Direct prerequisites:** (none — root assertion)
**Direct dependents:** EL-COMPONENT-ZENER-DIODE-001; EL-COMPONENT-LED-001; EL-COMPONENT-PHOTODIODE-001; EL-APPLICATION-TELEPHONE-001
**Curriculum mapping(s):** State the basic operating principles of electronic components and devices (REQUIRED_FOR); Electronic components and devices: Diodes (REQUIRED_FOR)
**Provenance:** University Physics Volume 3 — A p-n junction diode's depletion layer narrows under forward bias (allowing current to flow easily) and widens under reverse bias (significantly reducing current flow), giving the diode its one-way-conduction behaviour [DEFINES, support=DIRECT, verification=UNVERIFIED] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC6.2: state the basic operating principles of electronic components and devices (capacitors, resistors, rectifiers, diodes, zener, LED, photo, thermistors, diacs, triacs, transistors, thyristors, invertors) [CURRICULUM_REQUIRES, verification=VERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED
**Misconceptions targeting this assertion:** MIS-EL-DIODE-DIRECTION-CONFUSION-001

### EL-COMPONENT-ZENER-DIODE-001

**Statement (v1, APPROVED):** A Zener diode is a special-purpose diode designed to be operated in reverse breakdown at a well-defined breakdown voltage without damage, so it maintains a substantially constant voltage across itself and can be used to regulate voltage.

**Direct prerequisites:** EL-COMPONENT-DIODE-001 (REQUIRED)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** State the basic operating principles of electronic components and devices (REQUIRED_FOR); Electronic components and devices: Zener (REQUIRED_FOR)
**Provenance:** Electric Circuits III - Semiconductors (Kuphaldt) — A Zener diode is a special-purpose diode designed to operate in reverse breakdown at a well-defined breakdown voltage without being damaged, so it maintains a substantially constant voltage across itself and can be used to regulate voltage [DEFINES, support=DIRECT, verification=UNVERIFIED] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC6.2: state the basic operating principles of electronic components and devices (capacitors, resistors, rectifiers, diodes, zener, LED, photo, thermistors, diacs, triacs, transistors, thyristors, invertors) [CURRICULUM_REQUIRES, verification=VERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED

### EL-COMPONENT-LED-001

**Statement (v1, APPROVED):** A light-emitting diode (LED) produces light by electroluminescence: when forward-biased, recombination of electrons and holes at the junction releases energy as photons.

**Direct prerequisites:** EL-COMPONENT-DIODE-001 (REQUIRED)
**Direct dependents:** EL-APPLICATION-SECURITY-ALARM-001
**Curriculum mapping(s):** State the basic operating principles of electronic components and devices (REQUIRED_FOR); Electronic components and devices: LED (REQUIRED_FOR)
**Provenance:** Electric Circuits III - Semiconductors (Kuphaldt) — A light-emitting diode (LED) produces light by electroluminescence when forward-biased (recombination of electrons and holes in the junction yields photons); a photodiode is optimised to generate a photocurrent in response to incident light [DEFINES, support=DIRECT, verification=UNVERIFIED] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC6.2: state the basic operating principles of electronic components and devices (capacitors, resistors, rectifiers, diodes, zener, LED, photo, thermistors, diacs, triacs, transistors, thyristors, invertors) [CURRICULUM_REQUIRES, verification=VERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED

### EL-COMPONENT-PHOTODIODE-001

**Statement (v1, APPROVED):** A photodiode is a diode optimised to generate a photocurrent in response to incident light falling on its junction, allowing it to detect or measure light.

**Direct prerequisites:** EL-COMPONENT-DIODE-001 (REQUIRED)
**Direct dependents:** EL-APPLICATION-SECURITY-ALARM-001
**Curriculum mapping(s):** State the basic operating principles of electronic components and devices (REQUIRED_FOR); Electronic components and devices: Photo (REQUIRED_FOR)
**Provenance:** Electric Circuits III - Semiconductors (Kuphaldt) — A light-emitting diode (LED) produces light by electroluminescence when forward-biased (recombination of electrons and holes in the junction yields photons); a photodiode is optimised to generate a photocurrent in response to incident light [DEFINES, support=DIRECT, verification=UNVERIFIED] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC6.2: state the basic operating principles of electronic components and devices (capacitors, resistors, rectifiers, diodes, zener, LED, photo, thermistors, diacs, triacs, transistors, thyristors, invertors) [CURRICULUM_REQUIRES, verification=VERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED

### EL-COMPONENT-THERMISTOR-001

**Statement (v1, APPROVED):** An NTC (negative-temperature-coefficient) thermistor's electrical resistance decreases as its temperature increases, allowing it to be used as a temperature-sensing component.

**Direct prerequisites:** (none — root assertion)
**Direct dependents:** EL-COMPONENT-THERMISTOR-PTC-001; EL-APPLICATION-HEATING-BOILER-CONTROL-001
**Curriculum mapping(s):** State the basic operating principles of electronic components and devices (REQUIRED_FOR); Electronic components and devices: Thermistors (REQUIRED_FOR)
**Provenance:** NTC Thermistors Application Note — An NTC (negative temperature coefficient) thermistor's electrical resistance decreases as its temperature increases; applications include temperature sensing/measurement, inrush-current limiting and temperature compensation [DEFINES, support=DIRECT, verification=UNVERIFIED] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC6.2: state the basic operating principles of electronic components and devices (capacitors, resistors, rectifiers, diodes, zener, LED, photo, thermistors, diacs, triacs, transistors, thyristors, invertors) [CURRICULUM_REQUIRES, verification=VERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED

### EL-COMPONENT-THERMISTOR-PTC-001

**Statement (v1, APPROVED):** A PTC (positive-temperature-coefficient) thermistor's electrical resistance increases as its temperature increases, in contrast to an NTC thermistor's resistance, which decreases as temperature increases.

**Direct prerequisites:** EL-COMPONENT-THERMISTOR-001 (STRONG)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** State the basic operating principles of electronic components and devices (REQUIRED_FOR); Electronic components and devices: Thermistors (SUPPORTS)
**Provenance:** PTCEL Series -- PTC Thermistors, Inrush Current Limiter -- Datasheet — "These directly heated ceramic-based doped barium titanate thermistors have a positive temperature coefficient and are primarily intended for inrush current limiting and overload protection"; Quick Reference Data lists a "Switching temperature" of 130-140C, above which resistance rises sharply -- confirming PTC resistance increases (rather than decreases, as with NTC) with rising temperature [DEFINES, support=DIRECT, verification=UNVERIFIED] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC6.2: state the basic operating principles of electronic components and devices (capacitors, resistors, rectifiers, diodes, zener, LED, photo, thermistors, diacs, triacs, transistors, thyristors, invertors) [CURRICULUM_REQUIRES, verification=VERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED

### EL-COMPONENT-DIAC-001

**Statement (v1, APPROVED):** A DIAC is a bidirectional thyristor that remains a high-impedance, non-conducting device until the voltage across it exceeds its breakover voltage, at which point it switches into conduction in either direction; it is almost never used alone, but to trigger other thyristor devices.

**Direct prerequisites:** (none — root assertion)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** State the basic operating principles of electronic components and devices (REQUIRED_FOR); Electronic components and devices: Diacs (REQUIRED_FOR)
**Provenance:** Electric Circuits III - Semiconductors (Kuphaldt) — A DIAC is a bidirectional thyristor formed from two Shockley diodes joined in antiparallel: it remains a high-impedance non-conducting device until the voltage across it exceeds its breakover voltage, at which point it switches into conduction; DIACs are almost never used alone, but in conjunction with other thyristor devices [DEFINES, support=DIRECT, verification=UNVERIFIED] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC6.2: state the basic operating principles of electronic components and devices (capacitors, resistors, rectifiers, diodes, zener, LED, photo, thermistors, diacs, triacs, transistors, thyristors, invertors) [CURRICULUM_REQUIRES, verification=VERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED

### EL-COMPONENT-THYRISTOR-SCR-001

**Statement (v1, APPROVED):** A silicon-controlled rectifier (SCR) conducts current in one direction only once a sufficient gate current triggers it into conduction, and continues conducting until the current through it falls below the device's holding current.

**Direct prerequisites:** (none — root assertion)
**Direct dependents:** EL-COMPONENT-TRIAC-001; EL-APPLICATION-MOTOR-CONTROL-001; EL-APPLICATION-SECURITY-ALARM-TRANSISTOR-THYRISTOR-001
**Curriculum mapping(s):** State the basic operating principles of electronic components and devices (REQUIRED_FOR); Electronic components and devices: Thyristors (REQUIRED_FOR)
**Provenance:** Electric Circuits III - Semiconductors (Kuphaldt) — A silicon-controlled rectifier (SCR) conducts current in one direction once a sufficient gate current triggers it on, and continues conducting until the anode-to-cathode current falls below the device's holding current; SCRs are more commonly seen in circuits like motor drives [DEFINES, support=DIRECT, verification=UNVERIFIED] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC6.2: state the basic operating principles of electronic components and devices (capacitors, resistors, rectifiers, diodes, zener, LED, photo, thermistors, diacs, triacs, transistors, thyristors, invertors) [CURRICULUM_REQUIRES, verification=VERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED

### EL-COMPONENT-TRIAC-001

**Statement (v1, APPROVED):** A TRIAC acts much like two silicon-controlled rectifiers connected back-to-back, allowing it to conduct current in both directions once triggered by gate current, making it suitable for controlling alternating current.

**Direct prerequisites:** EL-COMPONENT-THYRISTOR-SCR-001 (STRONG)
**Direct dependents:** EL-APPLICATION-DIMMER-SWITCH-001
**Curriculum mapping(s):** State the basic operating principles of electronic components and devices (REQUIRED_FOR); Electronic components and devices: Triacs (REQUIRED_FOR)
**Provenance:** Electric Circuits III - Semiconductors (Kuphaldt) — A TRIAC acts much like two SCRs connected back-to-back for bidirectional (AC) operation, triggered by gate current from the main-terminal-2 side; TRIACs are usually seen in simple, low-power applications like household dimmer switches [DEFINES, support=DIRECT, verification=UNVERIFIED] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC6.2: state the basic operating principles of electronic components and devices (capacitors, resistors, rectifiers, diodes, zener, LED, photo, thermistors, diacs, triacs, transistors, thyristors, invertors) [CURRICULUM_REQUIRES, verification=VERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED

### EL-COMPONENT-TRANSISTOR-001

**Statement (v1, APPROVED):** A bipolar junction transistor is a three-terminal semiconductor device whose collector-emitter current is controlled by a much smaller base current, allowing it to act as an electrically controlled switch (fully off with no base current, fully on/saturated with sufficient base current) or as an amplifier.

**Direct prerequisites:** (none — root assertion)
**Direct dependents:** EL-APPLICATION-SECURITY-ALARM-TRANSISTOR-THYRISTOR-001; EL-APPLICATION-WIRELESS-CONTROL-001
**Curriculum mapping(s):** State the basic operating principles of electronic components and devices (REQUIRED_FOR); Electronic components and devices: Transistors (REQUIRED_FOR)
**Provenance:** Electric Circuits III - Semiconductors (Kuphaldt) — A bipolar junction transistor is a three-terminal semiconductor device whose collector-emitter current is controlled by a much smaller base current, allowing it to act as an electrically controlled switch or amplifier [DEFINES, support=PARTIAL, verification=UNVERIFIED] | Electric Circuits III - Semiconductors (Kuphaldt) — With no base current, a bipolar junction transistor behaves like an open switch and blocks collector current; sufficient base current drives it into saturation, behaving like a closed switch [SUPPORTS, support=PARTIAL, verification=UNVERIFIED] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC6.2: state the basic operating principles of electronic components and devices (capacitors, resistors, rectifiers, diodes, zener, LED, photo, thermistors, diacs, triacs, transistors, thyristors, invertors) [CURRICULUM_REQUIRES, verification=VERIFIED]
**Entailment result:** FULLY_SUPPORTED_MULTI_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED
**Clause coverage:** "3-terminal device; collector-emitter current controlled by base current; can amplify" -> Electric Circuits III - Semiconductors (Kuphaldt) (loc-kuphaldt-bjt-intro); "acts as an electrically controlled switch: fully off with no base current, fully on/saturated with sufficient base current" -> Electric Circuits III - Semiconductors (Kuphaldt) (loc-kuphaldt-bjt-switch)

### EL-COMPONENT-INVERTER-001

**Statement (v1, APPROVED):** An inverter converts a direct-current supply into an alternating-current output, by using electronic switching circuits to switch the DC input in a controlled sequence and generate the AC voltage or current waveform.

**Direct prerequisites:** EL-CONCEPT-AC-DC-DISTINCTION-001 (STRONG)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** State the basic operating principles of electronic components and devices (REQUIRED_FOR); Electronic components and devices: Invertors (REQUIRED_FOR)
**Provenance:** 800 VA Pure Sine Wave Inverter Reference Design (SLAA602A) — A DC-to-AC power inverter converts a DC source into an AC output using electronic switching circuits (e.g. an H-bridge/full-bridge of transistors or MOSFETs) that repeatedly reverse the polarity of the DC input at a controlled frequency to produce an AC waveform [DEFINES, support=DIRECT, verification=UNVERIFIED] | ELG4139: DC to AC Converters (course material) — An inverter converts DC to AC power by switching the DC input voltage (or current) in a pre-determined sequence so as to generate an AC voltage (or current) output [SUPPORTS, support=PARTIAL, verification=UNVERIFIED] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC6.2: state the basic operating principles of electronic components and devices (capacitors, resistors, rectifiers, diodes, zener, LED, photo, thermistors, diacs, triacs, transistors, thyristors, invertors) [CURRICULUM_REQUIRES, verification=VERIFIED]
**Entailment result:** FULLY_SUPPORTED_MULTI_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED
**Clause coverage:** "an inverter converts DC to AC via controlled electronic switching, generating the AC waveform (whole statement)" -> 800 VA Pure Sine Wave Inverter Reference Design (SLAA602A) (loc-ti-inverter-principle); "(historical secondary) same DC-to-AC switching principle" -> ELG4139: DC to AC Converters (course material) (loc-uottawa-inverter-principle)

### EL-APPLICATION-DIMMER-SWITCH-001

**Statement (v1, APPROVED):** A household dimmer switch typically uses a TRIAC to control the average power delivered to a lamp, by switching on at a controlled phase angle within each AC half-cycle.

**Direct prerequisites:** EL-COMPONENT-TRIAC-001 (REQUIRED)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Describe the function and application of electronic components that are used in electrical systems (REQUIRED_FOR); Electrical systems: Dimmer switches (REQUIRED_FOR)
**Provenance:** Electric Circuits III - Semiconductors (Kuphaldt) — A TRIAC acts much like two SCRs connected back-to-back for bidirectional (AC) operation, triggered by gate current from the main-terminal-2 side; TRIACs are usually seen in simple, low-power applications like household dimmer switches [SUPPORTS, support=DIRECT, verification=UNVERIFIED] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC6.1: describe the function and application of electronic components that are used in electrical systems (security alarms, telephones, dimmer switches, heating/boiler controls, motor control, wireless control systems) [CURRICULUM_REQUIRES, verification=VERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED

### EL-APPLICATION-MOTOR-CONTROL-001

**Statement (v1, APPROVED):** Silicon-controlled rectifiers are commonly used in motor-control circuits to control the electrical power delivered to a motor.

**Direct prerequisites:** EL-COMPONENT-THYRISTOR-SCR-001 (REQUIRED)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Describe the function and application of electronic components that are used in electrical systems (REQUIRED_FOR); Electrical systems: Motor control (REQUIRED_FOR)
**Provenance:** Electric Circuits III - Semiconductors (Kuphaldt) — A silicon-controlled rectifier (SCR) conducts current in one direction once a sufficient gate current triggers it on, and continues conducting until the anode-to-cathode current falls below the device's holding current; SCRs are more commonly seen in circuits like motor drives [SUPPORTS, support=DIRECT, verification=UNVERIFIED] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC6.1: describe the function and application of electronic components that are used in electrical systems (security alarms, telephones, dimmer switches, heating/boiler controls, motor control, wireless control systems) [CURRICULUM_REQUIRES, verification=VERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED

### EL-APPLICATION-HEATING-BOILER-CONTROL-001

**Statement (v1, APPROVED):** Thermistors are used for temperature sensing in heating and ventilation systems, including central-heating and boiler controls, providing a feedback signal a control circuit (such as a thermostat) uses to switch a heating load on or off at set temperatures.

**Direct prerequisites:** EL-COMPONENT-THERMISTOR-001 (REQUIRED)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Describe the function and application of electronic components that are used in electrical systems (REQUIRED_FOR); Electrical systems: Heating/boiler controls (REQUIRED_FOR)
**Provenance:** NTC Thermistors Application Note — NTC temperature sensors' listed applications include "heating and ventilation" (industrial) and "central-heating systems" (domestic); Fig. 4 shows the typical response (about 4s) of a boiler sensor transitioning from 25C to 100C; Fig. 16 shows a simple thermostat circuit using an NTC sensor and a relay to switch a heating load off/on at set temperatures [DEFINES, support=DIRECT, verification=UNVERIFIED] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC6.1: describe the function and application of electronic components that are used in electrical systems (security alarms, telephones, dimmer switches, heating/boiler controls, motor control, wireless control systems) [CURRICULUM_REQUIRES, verification=VERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED

### EL-APPLICATION-SECURITY-ALARM-001

**Statement (v1, APPROVED):** An infrared LED transmitter and a photoelectric (photodiode) receiver can be paired as a beam-break sensor: an object interrupting the beam changes the receiver's output, which triggers a relay output wired to an alarm control panel -- the basis of commercially manufactured security/intrusion-detection beam sensors.

**Direct prerequisites:** EL-COMPONENT-LED-001 (REQUIRED); EL-COMPONENT-PHOTODIODE-001 (REQUIRED)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Describe the function and application of electronic components that are used in electrical systems (SUPPORTS); Electrical systems: Security alarms (SUPPORTS)
**Provenance:** ENFORCER E-931-S33PRGQ 33ft Polarized Reflective Photoelectric Beam Sensor -- Installation Manual — The ENFORCER E-931-S33PRGQ photoelectric beam sensor (IR LED, wavelength 740nm, plus a photoelectric receiver) provides reliable sensing of objects breaking the infrared beam, and is suitable for "an alarm notification, as well as many other uses"; its SPDT relay trigger output is wired to an alarm control panel (the N.C. tamper terminal connects to the tamper circuit of an alarm control panel); a caution notes use in certain security applications may be regulated by local laws [DEFINES, support=DIRECT, verification=UNVERIFIED] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC6.1: describe the function and application of electronic components that are used in electrical systems (security alarms, telephones, dimmer switches, heating/boiler controls, motor control, wireless control systems) [CURRICULUM_REQUIRES, verification=VERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_SUPPORTING

### EL-APPLICATION-SECURITY-ALARM-TRANSISTOR-THYRISTOR-001

**Statement (v1, APPROVED):** A simple electronic security-alarm circuit uses a transistor to detect a break in a normally-closed sensor loop; the transistor then triggers a thyristor, which latches on and continues to power a sounder even if the loop is reclosed, until the circuit is deliberately reset.

**Direct prerequisites:** EL-COMPONENT-TRANSISTOR-001 (REQUIRED); EL-COMPONENT-THYRISTOR-SCR-001 (REQUIRED)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Describe the function and application of electronic components that are used in electrical systems (REQUIRED_FOR); Electrical systems: Security alarms (REQUIRED_FOR)
**Provenance:** Electric Circuits III - Semiconductors (Kuphaldt) — A silicon-controlled rectifier (SCR) conducts current in one direction once a sufficient gate current triggers it on, and continues conducting until the anode-to-cathode current falls below the device's holding current; SCRs are more commonly seen in circuits like motor drives [SUPPORTS, support=PARTIAL, verification=UNVERIFIED] | Thyristor Based Sensor Alarm System, Working and Applications — Describes a thyristor-based sensor-alarm circuit in which closing/triggering a sensor switch gates the thyristor on; the thyristor then latches ("thyristors 'latch' in the on state... and stay on after the gate pulse is detached until they are reverse biased") so the alarm continues even after the triggering sensor condition ends, until the circuit is deliberately reset [DEFINES, support=PARTIAL, verification=UNVERIFIED] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC6.1: describe the function and application of electronic components that are used in electrical systems (security alarms, telephones, dimmer switches, heating/boiler controls, motor control, wireless control systems) [CURRICULUM_REQUIRES, verification=VERIFIED]
**Entailment result:** FULLY_SUPPORTED_MULTI_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED
**Clause coverage:** "a normally-closed sensor loop is monitored by a transistor, which triggers a thyristor's gate when the loop opens" -> Thyristor Based Sensor Alarm System, Working and Applications (loc-elprocus-thyristor-sensor-alarm); "the thyristor latches on (continues conducting) once triggered, even after the triggering condition ends, until the circuit is reset" -> Electric Circuits III - Semiconductors (Kuphaldt) (loc-kuphaldt-scr)

### EL-APPLICATION-TELEPHONE-001

**Statement (v1, APPROVED):** Telephone equipment includes a diode bridge connected across the two wires of the telephone line, so that the equipment's internal circuitry is unaffected by which way round the line is connected.

**Direct prerequisites:** EL-COMPONENT-DIODE-001 (REQUIRED)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Describe the function and application of electronic components that are used in electrical systems (SUPPORTS); Electrical systems: Telephones (SUPPORTS)
**Provenance:** AN347: DAA Design Guide — Figure 2 shows a diode-bridge symbol (D1) wired directly into the line-side circuitry of a real telephone-line interface (DAA) application circuit; Figure 29's block diagram explicitly labels a "Bridge Diode" block connected directly to the telephone line's TIP and RING terminals, positioned within the TNV-3 (Telecommunications Network Voltage) circuit area between the line-side device/discretes and the telephone line itself [DEFINES, support=DIRECT, verification=UNVERIFIED] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC6.1: describe the function and application of electronic components that are used in electrical systems (security alarms, telephones, dimmer switches, heating/boiler controls, motor control, wireless control systems) [CURRICULUM_REQUIRES, verification=VERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_SUPPORTING

### EL-APPLICATION-TELEPHONE-MASTER-SOCKET-001

**Statement (v1, APPROVED):** The traditional UK master telephone socket arrangement contains a capacitor that couples the AC ringing signal to the line while blocking the line's DC, and a resistor that provides a defined test load for line testing when no telephone is connected; older master sockets also included a surge protector to suppress transient overvoltages on the line. Secondary (extension) sockets, wired in parallel from the master socket, contain none of these components.

**Direct prerequisites:** EL-COMPONENT-CAPACITOR-001 (REQUIRED); EL-COMPONENT-RESISTOR-001 (REQUIRED)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Describe the function and application of electronic components that are used in electrical systems (REQUIRED_FOR); Electrical systems: Telephones (REQUIRED_FOR)
**Provenance:** British telephone sockets — "The socket includes a 1.8 uF capacitor (bell circuit) to feed the AC ringing and a 470 k-ohm resistor (R1, out-of-service resistor) to permit remote testing when no telephones are plugged into any sockets"; older master sockets also contained an enclosed spark-gap surge protector (SP1); secondary/extension sockets, wired in parallel off the master socket, contain none of these components [DEFINES, support=DIRECT, verification=UNVERIFIED] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC6.1: describe the function and application of electronic components that are used in electrical systems (security alarms, telephones, dimmer switches, heating/boiler controls, motor control, wireless control systems) [CURRICULUM_REQUIRES, verification=VERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED

### EL-APPLICATION-WIRELESS-CONTROL-001

**Statement (v1, APPROVED):** A wireless control system uses an electronic receiver and decoder circuit that responds to a transmitted control signal by switching an output to operate a device.

**Direct prerequisites:** EL-COMPONENT-TRANSISTOR-001 (SUPPORTING)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Describe the function and application of electronic components that are used in electrical systems (REQUIRED_FOR); Electrical systems: Wireless control systems (REQUIRED_FOR)
**Provenance:** HT12D/HT12F 2^12 Series of Decoders — HT12D/HT12F 2^12 series decoder ICs' own "Applications" list names: burglar alarm system, smoke and fire alarm system, garage door controllers, car door controllers, car alarm system, security system, cordless telephones, other remote control systems; "Easy interface with an RF or an infrared transmission medium"; General Description: "the 12-N bits of data are decoded to activate the output pins" once the received address matches; the Application Circuits figure shows the decoder wired to a "Receiver Circuit" (antenna symbol) with its CMOS output pins (D8-D11) driving external outputs [DEFINES, support=DIRECT, verification=UNVERIFIED] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC6.1: describe the function and application of electronic components that are used in electrical systems (security alarms, telephones, dimmer switches, heating/boiler controls, motor control, wireless control systems) [CURRICULUM_REQUIRES, verification=VERIFIED]
**Entailment result:** FULLY_SUPPORTED_SINGLE_SOURCE
**Scope status (CC-09B.5):** IN_SCOPE_REQUIRED

## Misconceptions

### MIS-EL-OHM-UNRELATED-SYMBOLS-001

Treats V, I and R as three unrelated symbols to memorise rather than as a single relationship connecting voltage, current and resistance (V = I times R).

**Conflicts with:** EL-OHM-RELATIONSHIP-001

### MIS-EL-OHM-REARRANGE-ERROR-001

Incorrectly rearranges a multiplicative relationship such as V = I times R or P = V times I (for example moving a variable to the wrong side, or inverting the wrong pair of variables) when isolating a different subject.

**Conflicts with:** EL-OHM-REARRANGE-001, EL-POWER-REARRANGE-001

### MIS-EL-OHM-WRONG-OPERATION-001

Selects the wrong arithmetic operation when calculating an unknown quantity from V = I times R (for example multiplying instead of dividing when solving for current or resistance, or dividing the two known quantities in the wrong order).

**Conflicts with:** EL-OHM-SOLVE-I-001, EL-OHM-SOLVE-R-001

### MIS-EL-UNIT-CONFUSION-001

Confuses the electrical quantities voltage, current, resistance, power and energy with their SI units (volt, ampere, ohm, watt, joule), or attaches the wrong unit to the wrong quantity.

**Conflicts with:** EL-UNIT-VOLT-001, EL-UNIT-AMPERE-001, EL-UNIT-OHM-001, EL-UNIT-WATT-001, EL-UNIT-JOULE-001

### MIS-EL-SI-PREFIX-ERROR-001

Confuses SI-prefix magnitudes when converting between units (for example treating milliamps and amps as numerically equal, or converting in the wrong direction, such as multiplying instead of dividing by the scale factor).

**Conflicts with:** EL-OHM-SOLVE-V-001, EL-OHM-SOLVE-I-001, EL-OHM-SOLVE-R-001

### MIS-EL-SERIES-PARALLEL-CONFUSION-001

Confuses series and parallel circuit structure, for example treating components wired in parallel as if they were in series (or vice versa) when identifying current and voltage relationships.

**Conflicts with:** EL-CIRCUIT-SERIES-STRUCTURE-001, EL-CIRCUIT-PARALLEL-STRUCTURE-001

### MIS-EL-PARALLEL-RESISTANCE-ADDITION-001

Calculates the total resistance of a parallel circuit by simply adding the branch resistances, as if they were in series, instead of using the reciprocal-of-sum-of-reciprocals relationship.

**Conflicts with:** EL-PARALLEL-RESISTANCE-001, EL-PARALLEL-RESISTANCE-CALC-001

### MIS-EL-RECIPROCAL-FORGOTTEN-INVERT-001

Correctly sums the reciprocals of the branch resistances in a parallel circuit but forgets to take the reciprocal of the result, giving an answer that is the reciprocal of the correct total resistance rather than the total resistance itself.

**Conflicts with:** EL-PARALLEL-RESISTANCE-CALC-001

### MIS-EL-POWER-ENERGY-CONFUSION-001

Confuses power and energy, treating the two quantities (and their units, the watt and the joule) as interchangeable.

**Conflicts with:** EL-CONCEPT-POWER-001, EL-CONCEPT-ENERGY-001

### MIS-EL-VOLTAGE-DROP-MISUNDERSTANDING-001

Believes that voltage is 'used up' or disappears as current flows through a series circuit, rather than understanding voltage drop as the potential difference resulting from current flowing through resistance.

**Conflicts with:** EL-VOLTAGE-DROP-001, EL-SERIES-VOLTAGE-001

### MIS-EL-CONDUCTOR-INSULATOR-CONFUSION-001

Confuses which materials are good conductors versus insulators, or believes conductivity and resistance are unrelated properties.

**Conflicts with:** EL-CONCEPT-CONDUCTOR-001, EL-CONCEPT-INSULATOR-001

### MIS-FM-PROPORTION-DIRECTION-CONFUSION-001

Confuses direct and inverse proportion, for example assuming a quantity increases when it should decrease as another quantity increases.

**Conflicts with:** FM-ALG-PROPORTION-DIRECT-001, FM-ALG-PROPORTION-INVERSE-001, EL-OHM-PROPORTIONALITY-001

### MIS-EL-CURRENT-VOLTAGE-CONFUSION-001

Confuses current and voltage as concepts, for example treating current as something a source 'has' independent of the circuit rather than voltage driving current through resistance.

**Conflicts with:** EL-CONCEPT-CURRENT-001, EL-CONCEPT-VOLTAGE-001

### MIS-EL-RESISTANCE-RESISTIVITY-CONFUSION-001

Treats resistance and resistivity as the same property, not realising that resistivity is a material property independent of a conductor's dimensions while resistance also depends on length and cross-sectional area.

**Conflicts with:** EL-CONCEPT-RESISTANCE-001, EL-CONCEPT-RESISTIVITY-001

### MIS-EL-INSTRUMENT-CONNECTION-CONFUSION-001

Connects a voltmeter in series or an ammeter in parallel, swapping the correct connection method for the two instruments.

**Conflicts with:** EL-INSTRUMENT-VOLTMETER-001, EL-INSTRUMENT-AMMETER-001, EL-INSTRUMENT-SELECT-001

### MIS-EL-ELECTRON-CURRENT-DIRECTION-CONFUSION-001

Confuses conventional current direction (positive to negative) with the actual direction of electron flow (negative to positive) in a conductor.

**Conflicts with:** EL-CONCEPT-ELECTRON-THEORY-001, EL-CURRENT-CHARGE-RELATIONSHIP-001

### MIS-EL-AC-DC-CONFUSION-001

Treats alternating current and direct current as the same, or believes an AC supply has a single constant unchanging value like a DC supply.

**Conflicts with:** EL-CONCEPT-AC-DC-DISTINCTION-001, EL-CONCEPT-SINE-WAVE-001

### MIS-EL-PEAK-RMS-CONFUSION-001

Confuses the peak value of an AC waveform with its RMS value, for example assuming a stated AC supply voltage (such as 230 V) is a peak value rather than an RMS value.

**Conflicts with:** EL-WAVEFORM-RMS-001, EL-CONCEPT-PEAK-VS-RMS-SUPPLY-INTERPRETATION-001

### MIS-EL-EMF-VOLTAGE-CONFUSION-001

Confuses EMF (the source's own electrical energy per unit charge) with terminal voltage, treating them as always identical rather than recognising terminal voltage is reduced by the source's internal resistance when supplying current.

**Conflicts with:** EL-CONCEPT-EMF-001, EL-CONCEPT-TERMINAL-VOLTAGE-001

### MIS-EL-ENERGY-UNIT-CONFUSION-001

Confuses the joule and the kilowatt-hour as interchangeable without converting between them, or is unaware that they measure the same quantity (energy) at different scales.

**Conflicts with:** EL-UNIT-JOULE-001, EL-UNIT-KWH-001

### MIS-EL-DIODE-DIRECTION-CONFUSION-001

Confuses which direction a diode allows current to flow (forward bias) versus blocks it (reverse bias), or assumes a diode conducts equally in both directions like a plain resistor.

**Conflicts with:** EL-COMPONENT-DIODE-001

