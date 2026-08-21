# CC-04B Unit 202 proving-slice corpus review

Generated deterministically by `scripts/content/generate-corpus-review.ts` from
`scripts/content/data/cc04-unit202-electrical-science.ts` -- the same manifest
`scripts/content/generate-seed.ts` compiles to SQL. Development/review evidence
only, never rendered to learners. Regenerate with:
`node scripts/content/generate-corpus-review.ts`.

Total assertions: 235
- Foundational Maths (FM): 24
- Foundational Physics (FP): 40
- Electrical (EL): 171

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
| Describe the basic principles of generating an A.C. supply in terms of: a single-loop generator, sine-wave, frequency, EMF, magnetic flux | 7 |
| Describe the basic principles of generating an A.C. supply | 7 |
| Describe the chemical and thermal effects of electric currents | 16 |
| Describe the effects of magnetism in terms of attraction and repulsion | 2 |
| Describe the function and application of electronic components that are used in electrical systems | 6 |
| Describe the magnetic effects of electrical currents in terms of: production of a magnetic field, force on a current-carrying conductor in a magnetic field, electromagnetism, electromotive force | 7 |
| Describe the magnetic effects of electrical currents | 7 |
| Describe the main principles of force, work, energy, power and efficiency and their inter-relationships | 1 |
| Describe the main principles of the following and their inter-relationships: force, work, energy (kinetic and potential), power, efficiency | 1 |
| Describe what is meant by resistance and resistivity in relation to electrical circuits | 14 |
| Electrical quantities (SI units): Capacitance and capacitive reactance | 3 |
| Electrical quantities (SI units): Current | 1 |
| Electrical quantities (SI units): Energy | 1 |
| Electrical quantities (SI units): Frequency | 2 |
| Electrical quantities (SI units): Impedance | 1 |
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
| Electrical systems: Security alarms | 1 |
| Electrical systems: Telephones | 1 |
| Electrical systems: Wireless control systems | 1 |
| Electronic components and devices: Capacitors | 2 |
| Electronic components and devices: Diacs | 1 |
| Electronic components and devices: Diodes | 1 |
| Electronic components and devices: Invertors | 1 |
| Electronic components and devices: LED | 1 |
| Electronic components and devices: Photo | 1 |
| Electronic components and devices: Rectifiers | 1 |
| Electronic components and devices: Resistors | 2 |
| Electronic components and devices: Thermistors | 1 |
| Electronic components and devices: Thyristors | 1 |
| Electronic components and devices: Transistors | 1 |
| Electronic components and devices: Triacs | 1 |
| Electronic components and devices: Zener | 1 |
| Explain the relationship between current, voltage and resistance in parallel and series D.C. circuits | 56 |
| Identify and apply appropriate mathematical principles which are relevant to electrical work tasks | 32 |
| Identify and determine values of base and derived SI units which apply specifically to electrical quantities | 60 |
| Identify and distinguish between materials which are good conductors and insulators | 8 |
| Identify and use internationally recognised base and derived (SI) units of measurement | 6 |
| Identify appropriate electrical instruments for the measurement of different electrical quantities | 22 |
| Identify the characteristics of sine-waves | 24 |
| State the basic operating principles of electronic components and devices | 13 |
| State the difference between magnetic flux and flux density | 4 |
| State what is meant by the term voltage drop in relation to electrical circuits | 4 |

## Foundational Maths/Physics: used vs currently-unused-but-retained

23 of 64 Foundational assertions currently reach an Electrical target via PREREQUISITE_OF; the remainder are retained as coherent, atomic, properly-sourced, non-speculative reusable horizontal knowledge for future Unit 202 expansion, other electrical qualifications, or other vocational verticals -- per explicit Product Owner direction, this is not treated as a defect.

**Currently used (23):** FM-ALG-EQUALITY-ADD-001, FM-ALG-EQUALITY-MULT-001, FM-ALG-INVERSE-OPS-ADD-001, FM-ALG-INVERSE-OPS-MULT-001, FM-ALG-PROPORTION-DIRECT-001, FM-ALG-PROPORTION-INVERSE-001, FM-ALG-SUBSTITUTION-001, FM-ALG-TRANSPOSE-ADD-001, FM-ALG-TRANSPOSE-MULT-001, FM-ARITH-FRACTION-OPS-001, FM-ARITH-PERCENTAGE-001, FM-ARITH-RECIPROCAL-001, FM-ARITH-RECIPROCAL-INVERT-001, FM-ARITH-RECIPROCAL-SUM-001, FM-NUM-SI-PREFIX-001, FM-NUM-SI-PREFIX-CONVERT-001, FM-NUM-STANDARD-FORM-001, FP-CONCEPT-EFFICIENCY-001, FP-CONCEPT-ENERGY-001, FP-CONCEPT-ENERGY-CONSERVATION-001, FP-CONCEPT-FORCE-001, FP-CONCEPT-POWER-001, FP-CONCEPT-WORK-001

**Currently unused but retained (41):** FM-CALC-PYTHAGORAS-001, FM-CALC-TRIG-RATIO-001, FM-GEOM-PYTHAGORAS-001, FM-GEOM-TRIG-RATIOS-001, FM-NUM-INDICES-LAWS-001, FM-STATS-MEAN-001, FM-STATS-RANGE-001, FP-CALC-EFFICIENCY-001, FP-CALC-KINETIC-ENERGY-001, FP-CALC-POTENTIAL-ENERGY-001, FP-CALC-POWER-001, FP-CALC-WEIGHT-001, FP-CALC-WORK-001, FP-CONCEPT-GEAR-001, FP-CONCEPT-KINETIC-ENERGY-001, FP-CONCEPT-LEVER-PRINCIPLE-001, FP-CONCEPT-MASS-001, FP-CONCEPT-MECHANICAL-ADVANTAGE-001, FP-CONCEPT-POTENTIAL-ENERGY-001, FP-CONCEPT-PULLEY-001, FP-CONCEPT-WEIGHT-001, FP-GEAR-SPEED-TORQUE-TRADEOFF-001, FP-LEVER-CLASS-I-001, FP-LEVER-CLASS-II-001, FP-LEVER-CLASS-III-001, FP-PULLEY-FIXED-VS-MOVABLE-001, FP-REL-GEAR-RATIO-001, FP-REL-KINETIC-ENERGY-001, FP-REL-POTENTIAL-ENERGY-001, FP-REL-POWER-WORK-TIME-001, FP-REL-PULLEY-MECHANICAL-ADVANTAGE-001, FP-REL-WEIGHT-MASS-001, FP-REL-WORK-FORCE-DISTANCE-001, FP-UNIT-CUBIC-METRE-001, FP-UNIT-DENSITY-001, FP-UNIT-KELVIN-CELSIUS-001, FP-UNIT-KILOGRAM-001, FP-UNIT-METRE-001, FP-UNIT-METRE-PER-SECOND-001, FP-UNIT-SECOND-001, FP-UNIT-SQUARE-METRE-001

## Provenance source / rights distribution

Verification columns per ADR-0002 -- Verified/By/Fingerprint reflect the governed `sourceVersion` record mechanically, never hand-typed here. UNVERIFIED means exactly that: identifiable and usable as an authoring source, but not yet independently confirmed against the actual artefact by a verifier distinct from the authoring model.

| Source | Rights classification | Verification | Verified by | Fingerprint |
|---|---|---|---|---|
| City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook | PROPRIETARY_REFERENCE | VERIFIED | project-architect | present |
| The International System of Units (SI Brochure) | OPEN | UNVERIFIED | (none) | absent |
| Mathematics GCSE subject content and assessment objectives | OFFICIAL_OGL | UNVERIFIED | (none) | absent |
| University Physics Volume 1 | PUBLIC_RESTRICTED | UNVERIFIED | (none) | absent |
| University Physics Volume 2 | PUBLIC_RESTRICTED | UNVERIFIED | (none) | absent |
| University Physics Volume 3 | PUBLIC_RESTRICTED | UNVERIFIED | (none) | absent |
| Electric Circuits III - Semiconductors (Kuphaldt) | OPEN | UNVERIFIED | (none) | absent |
| NTC Thermistors Application Note | PROPRIETARY_REFERENCE | UNVERIFIED | (none) | present |
| ELG4139: DC to AC Converters (course material) | PROPRIETARY_REFERENCE | UNVERIFIED | (none) | present |
| 800 VA Pure Sine Wave Inverter Reference Design (SLAA602A) | PROPRIETARY_REFERENCE | UNVERIFIED | (none) | present |
| College Physics 2e | PUBLIC_RESTRICTED | UNVERIFIED | (none) | absent |
| Electric Circuits I - Direct Current (Kuphaldt) | OPEN | UNVERIFIED | (none) | absent |

Rights distribution: PROPRIETARY_REFERENCE: 4, OPEN: 3, OFFICIAL_OGL: 1, PUBLIC_RESTRICTED: 4

## OpenStax exact-book licence evidence (CC-04B hard requirement)

Re-verified directly from each book's own copyright page (not assumed from a generic OpenStax licensing page, a search summary, or the other volume):

| Book | Edition/date | Licence (verbatim, on-page) | Commercial use | ShareAlike | Attribution | Final classification |
|---|---|---|---|---|---|---|
| University Physics Volume 1 (Moebs/Ling/Sanny) | 1st edition, 19 Sept 2016 | "This book uses the Creative Commons Attribution-NonCommercial-ShareAlike License" (licence URL http://creativecommons.org/licenses/by-nc-sa/4.0/ confirmed on-page) | No (NonCommercial) | Yes | Yes | PUBLIC_RESTRICTED |
| University Physics Volume 2 (OpenStax/Rice University) | 1st edition, 6 Oct 2016 | "Creative Commons Attribution-NonCommercial-ShareAlike License" (CC BY-NC-SA 4.0), independently re-confirmed on a second fetch | No (NonCommercial) | Yes | Yes | PUBLIC_RESTRICTED |

## Graph health

- Total relationships: 380
  - CONTRASTS_WITH: 14
  - DERIVED_FROM: 49
  - PREREQUISITE_OF: 307
  - SUPPORTS: 10
- Misconceptions: 21; conflict links: 45
- Curriculum mappings: 467
- Self edges, duplicate edges, unintended prerequisite cycles, broken relationship targets, unmapped Electrical assertions and approved-versions-without-provenance: all mechanically proven 0 -- see supabase/tests/database/10_unit202_knowledge_graph.sql and the CC-04B completion report for the live query evidence.

## Foundational Maths (FM)

### FM-ALG-INVERSE-OPS-MULT-001

**Statement (v1, APPROVED):** Multiplication and division are inverse operations: dividing by a non-zero number undoes multiplying by that number, and vice versa.

**Direct prerequisites:** (none — root assertion)
**Direct dependents:** FM-ALG-TRANSPOSE-MULT-001
**Curriculum mapping(s):** Mathematical principles: Algebra (REQUIRED_FOR)
**Provenance:** Mathematics GCSE subject content and assessment objectives — Number: relationships between operations including inverse operations; conventional notation for priority of operations including brackets, powers, roots and reciprocals [DEFINES]

### FM-ALG-INVERSE-OPS-ADD-001

**Statement (v1, APPROVED):** Addition and subtraction are inverse operations: subtracting a number undoes adding that number, and vice versa.

**Direct prerequisites:** (none — root assertion)
**Direct dependents:** FM-ALG-TRANSPOSE-ADD-001
**Curriculum mapping(s):** Mathematical principles: Algebra (REQUIRED_FOR)
**Provenance:** Mathematics GCSE subject content and assessment objectives — Number: relationships between operations including inverse operations; conventional notation for priority of operations including brackets, powers, roots and reciprocals [DEFINES]

### FM-ALG-EQUALITY-MULT-001

**Statement (v1, APPROVED):** In an equation, multiplying or dividing both sides by the same non-zero value preserves the equality between the two sides.

**Direct prerequisites:** (none — root assertion)
**Direct dependents:** FM-ALG-TRANSPOSE-MULT-001
**Curriculum mapping(s):** Mathematical principles: Algebra (REQUIRED_FOR)
**Provenance:** Mathematics GCSE subject content and assessment objectives — Algebra: understand and use the concepts and vocabulary of expressions, equations, formulae, identities [DEFINES]

### FM-ALG-EQUALITY-ADD-001

**Statement (v1, APPROVED):** In an equation, adding or subtracting the same value from both sides preserves the equality between the two sides.

**Direct prerequisites:** (none — root assertion)
**Direct dependents:** FM-ALG-TRANSPOSE-ADD-001
**Curriculum mapping(s):** Mathematical principles: Algebra (REQUIRED_FOR)
**Provenance:** Mathematics GCSE subject content and assessment objectives — Algebra: understand and use the concepts and vocabulary of expressions, equations, formulae, identities [DEFINES]

### FM-ALG-TRANSPOSE-MULT-001

**Statement (v1, APPROVED):** Given a relationship of the form a = b times c, rearrange it algebraically to make b or c the subject.

**Direct prerequisites:** FM-ALG-INVERSE-OPS-MULT-001 (REQUIRED); FM-ALG-EQUALITY-MULT-001 (REQUIRED)
**Direct dependents:** FP-CALC-WEIGHT-001; EL-OHM-REARRANGE-001; EL-POWER-REARRANGE-001; EL-CURRENT-CHARGE-CALC-001; EL-ENERGY-REARRANGE-001
**Curriculum mapping(s):** Mathematical principles: Transposition (REQUIRED_FOR)
**Provenance:** Mathematics GCSE subject content and assessment objectives — Algebra: understand and use standard mathematical formulae; rearrange formulae to change the subject [SUPPORTS]

### FM-ALG-TRANSPOSE-ADD-001

**Statement (v1, APPROVED):** Given a relationship of the form a = b + c, rearrange it algebraically to make b or c the subject.

**Direct prerequisites:** FM-ALG-INVERSE-OPS-ADD-001 (REQUIRED); FM-ALG-EQUALITY-ADD-001 (REQUIRED)
**Direct dependents:** EL-SERIES-VOLTAGE-001; EL-PARALLEL-CURRENT-001; EL-PARALLEL-RESISTANCE-CALC-001
**Curriculum mapping(s):** Mathematical principles: Transposition (REQUIRED_FOR)
**Provenance:** Mathematics GCSE subject content and assessment objectives — Algebra: understand and use standard mathematical formulae; rearrange formulae to change the subject [SUPPORTS]

### FM-ALG-SUBSTITUTION-001

**Statement (v1, APPROVED):** Substitute known numerical values into a formula to calculate the value of the remaining unknown quantity.

**Direct prerequisites:** (none — root assertion)
**Direct dependents:** FM-CALC-PYTHAGORAS-001; FM-CALC-TRIG-RATIO-001; FP-CALC-WORK-001; FP-CALC-KINETIC-ENERGY-001; FP-CALC-POTENTIAL-ENERGY-001; FP-CALC-POWER-001; FP-CALC-WEIGHT-001; EL-CALC-ELECTRICAL-EFFICIENCY-001; EL-OHM-SOLVE-V-001; EL-OHM-SOLVE-I-001; EL-OHM-SOLVE-R-001; EL-SERIES-RESISTANCE-CALC-001; EL-POWER-SOLVE-001; EL-POWER-SOLVE-IR-001; EL-CURRENT-CHARGE-CALC-001; EL-POWER-SOLVE-V2R-001; EL-ENERGY-CALC-001; EL-WAVEFORM-RMS-CALC-001; EL-WAVEFORM-FREQUENCY-CALC-001
**Curriculum mapping(s):** Mathematical principles: Transposition (SUPPORTS)
**Provenance:** Mathematics GCSE subject content and assessment objectives — Algebra: substitute numerical values into formulae and expressions, including scientific formulae [SUPPORTS]

### FM-ARITH-RECIPROCAL-001

**Statement (v1, APPROVED):** The reciprocal of a non-zero number is 1 divided by that number.

**Direct prerequisites:** (none — root assertion)
**Direct dependents:** FM-ARITH-RECIPROCAL-SUM-001; FM-ARITH-RECIPROCAL-INVERT-001; EL-PARALLEL-RESISTANCE-001; EL-WAVEFORM-FREQUENCY-PERIOD-RELATIONSHIP-001
**Provenance:** Mathematics GCSE subject content and assessment objectives — Number: relationships between operations including inverse operations; conventional notation for priority of operations including brackets, powers, roots and reciprocals [DEFINES]

### FM-ARITH-FRACTION-OPS-001

**Statement (v1, APPROVED):** Apply the four arithmetic operations (addition, subtraction, multiplication, division) to fractions, including proper and improper fractions.

**Direct prerequisites:** (none — root assertion)
**Direct dependents:** FM-ARITH-RECIPROCAL-SUM-001
**Curriculum mapping(s):** Mathematical principles: Fractions and percentages (REQUIRED_FOR)
**Provenance:** Mathematics GCSE subject content and assessment objectives — Number: apply the four operations, including formal written methods, to integers, decimals and simple fractions (proper and improper), and mixed numbers [DEFINES]

### FM-ARITH-RECIPROCAL-SUM-001

**Statement (v1, APPROVED):** The reciprocal of a total formed from several parallel contributions can be found by summing the reciprocals of each individual contribution.

**Direct prerequisites:** FM-ARITH-RECIPROCAL-001 (REQUIRED); FM-ARITH-FRACTION-OPS-001 (STRONG)
**Direct dependents:** EL-PARALLEL-RESISTANCE-CALC-001
**Provenance:** University Physics Volume 2 — University Physics Volume 2, 10.2: equivalent resistance for resistors in series and in parallel [SUPPORTS]

### FM-ARITH-RECIPROCAL-INVERT-001

**Statement (v1, APPROVED):** Once the reciprocal of a total quantity has been calculated, take its reciprocal again to find the value of the total quantity itself.

**Direct prerequisites:** FM-ARITH-RECIPROCAL-001 (REQUIRED)
**Direct dependents:** EL-PARALLEL-RESISTANCE-CALC-001
**Provenance:** University Physics Volume 2 — University Physics Volume 2, 10.2: equivalent resistance for resistors in series and in parallel [SUPPORTS]

### FM-ARITH-PERCENTAGE-001

**Statement (v1, APPROVED):** A percentage expresses a quantity as a number of parts per hundred, and can be used to express one quantity as a proportion of another.

**Direct prerequisites:** (none — root assertion)
**Direct dependents:** FP-CONCEPT-EFFICIENCY-001; FP-CALC-EFFICIENCY-001; EL-CALC-ELECTRICAL-EFFICIENCY-001
**Curriculum mapping(s):** Mathematical principles: Fractions and percentages (REQUIRED_FOR)
**Provenance:** Mathematics GCSE subject content and assessment objectives — Ratio, proportion and rates of change: define percentage as 'number of parts per hundred'; interpret percentages and percentage changes [DEFINES]

### FM-ALG-PROPORTION-DIRECT-001

**Statement (v1, APPROVED):** Two quantities are in direct proportion when one increases in the same ratio as the other.

**Direct prerequisites:** (none — root assertion)
**Direct dependents:** EL-OHM-PROPORTIONALITY-001; EL-RESISTIVITY-LENGTH-EFFECT-001; EL-SERIES-VOLTAGE-DIVIDER-001
**Provenance:** Mathematics GCSE subject content and assessment objectives — Ratio, proportion and rates of change: solve problems involving direct and inverse proportion; X inversely proportional to Y is equivalent to X proportional to 1/Y [DEFINES]
**Misconceptions targeting this assertion:** MIS-FM-PROPORTION-DIRECTION-CONFUSION-001

### FM-ALG-PROPORTION-INVERSE-001

**Statement (v1, APPROVED):** Two quantities are in inverse proportion when one increases in the same ratio as the other decreases.

**Direct prerequisites:** (none — root assertion)
**Direct dependents:** EL-OHM-PROPORTIONALITY-001; EL-RESISTIVITY-AREA-EFFECT-001; EL-PARALLEL-CURRENT-DIVIDER-001
**Provenance:** Mathematics GCSE subject content and assessment objectives — Ratio, proportion and rates of change: solve problems involving direct and inverse proportion; X inversely proportional to Y is equivalent to X proportional to 1/Y [DEFINES]
**Misconceptions targeting this assertion:** MIS-FM-PROPORTION-DIRECTION-CONFUSION-001

### FM-NUM-SI-PREFIX-001

**Statement (v1, APPROVED):** An SI prefix (such as milli-, kilo- or mega-) represents a fixed power-of-ten scale factor applied to a base or derived unit.

**Direct prerequisites:** (none — root assertion)
**Direct dependents:** FM-NUM-SI-PREFIX-CONVERT-001
**Provenance:** The International System of Units (SI Brochure) — SI Brochure: table of SI derived units with special names, including the volt, ohm, watt and joule, and SI prefixes [SUPPORTS]

### FM-NUM-STANDARD-FORM-001

**Statement (v1, APPROVED):** A number can be expressed in standard form as A times 10 to the power n, where 1 <= A < 10 and n is an integer.

**Direct prerequisites:** (none — root assertion)
**Direct dependents:** FM-NUM-SI-PREFIX-CONVERT-001
**Provenance:** Mathematics GCSE subject content and assessment objectives — Number: calculate with and interpret standard form A x 10^n, where 1 <= A < 10 and n is an integer [DEFINES]

### FM-NUM-SI-PREFIX-CONVERT-001

**Statement (v1, APPROVED):** Convert a numerical quantity from one SI-prefixed unit to another by applying the appropriate power-of-ten scale factor.

**Direct prerequisites:** FM-NUM-SI-PREFIX-001 (REQUIRED); FM-NUM-STANDARD-FORM-001 (STRONG)
**Direct dependents:** EL-OHM-SOLVE-V-001; EL-OHM-SOLVE-I-001; EL-OHM-SOLVE-R-001
**Provenance:** The International System of Units (SI Brochure) — SI Brochure: table of SI derived units with special names, including the volt, ohm, watt and joule, and SI prefixes [SUPPORTS]

### FM-NUM-INDICES-LAWS-001

**Statement (v1, APPROVED):** When multiplying two powers of the same base, add the indices; when dividing, subtract the indices; a fractional index represents a root.

**Direct prerequisites:** (none — root assertion)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Mathematical principles: Indices (REQUIRED_FOR)
**Provenance:** Mathematics GCSE subject content and assessment objectives — Algebra: simplify and manipulate algebraic expressions... simplifying expressions involving sums, products and powers, including the laws of indices [DEFINES] | Mathematics GCSE subject content and assessment objectives — Number: calculate with roots, and with integer and fractional indices [SUPPORTS]

### FM-GEOM-PYTHAGORAS-001

**Statement (v1, APPROVED):** In a right-angled triangle, the square of the hypotenuse equals the sum of the squares of the other two sides: a squared plus b squared equals c squared.

**Direct prerequisites:** (none — root assertion)
**Direct dependents:** FM-GEOM-TRIG-RATIOS-001; FM-CALC-PYTHAGORAS-001
**Curriculum mapping(s):** Mathematical principles: Triangles and trigonometry (REQUIRED_FOR)
**Provenance:** Mathematics GCSE subject content and assessment objectives — Geometry and measures: know the formulae for Pythagoras' theorem a^2 + b^2 = c^2, and the trigonometric ratios sin(theta) = opposite/hypotenuse, cos(theta) = adjacent/hypotenuse and tan(theta) = opposite/adjacent; apply them to find angles and lengths in right-angled triangles [DEFINES]

### FM-GEOM-TRIG-RATIOS-001

**Statement (v1, APPROVED):** In a right-angled triangle, the sine, cosine and tangent of an angle are defined as the ratios opposite/hypotenuse, adjacent/hypotenuse and opposite/adjacent respectively.

**Direct prerequisites:** FM-GEOM-PYTHAGORAS-001 (SUPPORTING)
**Direct dependents:** FM-CALC-TRIG-RATIO-001
**Curriculum mapping(s):** Mathematical principles: Triangles and trigonometry (REQUIRED_FOR)
**Provenance:** Mathematics GCSE subject content and assessment objectives — Geometry and measures: know the formulae for Pythagoras' theorem a^2 + b^2 = c^2, and the trigonometric ratios sin(theta) = opposite/hypotenuse, cos(theta) = adjacent/hypotenuse and tan(theta) = opposite/adjacent; apply them to find angles and lengths in right-angled triangles [DEFINES]

### FM-CALC-PYTHAGORAS-001

**Statement (v1, APPROVED):** Use Pythagoras' theorem to calculate an unknown side length of a right-angled triangle, given the lengths of the other two sides.

**Direct prerequisites:** FM-GEOM-PYTHAGORAS-001 (REQUIRED); FM-ALG-SUBSTITUTION-001 (STRONG)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Mathematical principles: Triangles and trigonometry (REQUIRED_FOR)
**Provenance:** Mathematics GCSE subject content and assessment objectives — Geometry and measures: know the formulae for Pythagoras' theorem a^2 + b^2 = c^2, and the trigonometric ratios sin(theta) = opposite/hypotenuse, cos(theta) = adjacent/hypotenuse and tan(theta) = opposite/adjacent; apply them to find angles and lengths in right-angled triangles [SUPPORTS]

### FM-CALC-TRIG-RATIO-001

**Statement (v1, APPROVED):** Use a trigonometric ratio (sine, cosine or tangent) to calculate an unknown side length or angle of a right-angled triangle, given sufficient other side lengths or angles.

**Direct prerequisites:** FM-GEOM-TRIG-RATIOS-001 (REQUIRED); FM-ALG-SUBSTITUTION-001 (STRONG)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Mathematical principles: Triangles and trigonometry (REQUIRED_FOR)
**Provenance:** Mathematics GCSE subject content and assessment objectives — Geometry and measures: know the formulae for Pythagoras' theorem a^2 + b^2 = c^2, and the trigonometric ratios sin(theta) = opposite/hypotenuse, cos(theta) = adjacent/hypotenuse and tan(theta) = opposite/adjacent; apply them to find angles and lengths in right-angled triangles [SUPPORTS]

### FM-STATS-MEAN-001

**Statement (v1, APPROVED):** The mean of a set of numerical values is found by dividing their sum by the number of values, and is a measure of the central tendency of the data.

**Direct prerequisites:** (none — root assertion)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Mathematical principles: Statistics (REQUIRED_FOR)
**Provenance:** Mathematics GCSE subject content and assessment objectives — Statistics: interpret, analyse and compare distributions of data sets through appropriate measures of central tendency (median, mean, mode and modal class) and spread (range, including consideration of outliers, quartiles and inter-quartile range) [DEFINES]

### FM-STATS-RANGE-001

**Statement (v1, APPROVED):** The range of a set of numerical values is the difference between the largest and smallest values, and is a measure of the spread of the data.

**Direct prerequisites:** (none — root assertion)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Mathematical principles: Statistics (REQUIRED_FOR)
**Provenance:** Mathematics GCSE subject content and assessment objectives — Statistics: interpret, analyse and compare distributions of data sets through appropriate measures of central tendency (median, mean, mode and modal class) and spread (range, including consideration of outliers, quartiles and inter-quartile range) [DEFINES]

## Foundational Physics (FP)

### FP-CONCEPT-FORCE-001

**Statement (v1, APPROVED):** A force is a push or a pull that can change the motion, shape or state of rest of an object.

**Direct prerequisites:** (none — root assertion)
**Direct dependents:** FP-CONCEPT-WORK-001; FP-CONCEPT-WEIGHT-001; FP-CONCEPT-MECHANICAL-ADVANTAGE-001; EL-CONCEPT-FORCE-ON-CONDUCTOR-001
**Curriculum mapping(s):** Describe the main principles of the following and their inter-relationships: force, work, energy (kinetic and potential), power, efficiency (REQUIRED_FOR)
**Provenance:** University Physics Volume 1 — University Physics Volume 1, Ch.7: work as a force causing displacement of its point of application; force and mass/weight [DEFINES]

### FP-CONCEPT-WORK-001

**Statement (v1, APPROVED):** Work is done when a force causes its point of application to move through a distance in the direction of the force.

**Direct prerequisites:** FP-CONCEPT-FORCE-001 (STRONG)
**Direct dependents:** FP-REL-WORK-FORCE-DISTANCE-001; FP-CONCEPT-ENERGY-001; FP-CONCEPT-POWER-001
**Curriculum mapping(s):** Describe the main principles of the following and their inter-relationships: force, work, energy (kinetic and potential), power, efficiency (REQUIRED_FOR)
**Provenance:** University Physics Volume 1 — University Physics Volume 1, Ch.7: work as a force causing displacement of its point of application; force and mass/weight [DEFINES]

### FP-REL-WORK-FORCE-DISTANCE-001

**Statement (v1, APPROVED):** Work done is calculated by multiplying the force applied by the distance moved in the direction of that force: W = F times d.

**Direct prerequisites:** FP-CONCEPT-WORK-001 (REQUIRED)
**Direct dependents:** FP-CALC-WORK-001
**Curriculum mapping(s):** Describe the main principles of the following and their inter-relationships: force, work, energy (kinetic and potential), power, efficiency (REQUIRED_FOR)
**Provenance:** University Physics Volume 1 — University Physics Volume 1, Ch.7: work as a force causing displacement of its point of application; force and mass/weight [SUPPORTS]

### FP-CALC-WORK-001

**Statement (v1, APPROVED):** Calculate the work done by a force from its magnitude and the distance moved in its direction, using W = F times d.

**Direct prerequisites:** FP-REL-WORK-FORCE-DISTANCE-001 (REQUIRED); FM-ALG-SUBSTITUTION-001 (REQUIRED)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Calculate values of mechanical energy, power and efficiency (REQUIRED_FOR)
**Provenance:** University Physics Volume 1 — University Physics Volume 1, Ch.7: work as a force causing displacement of its point of application; force and mass/weight [SUPPORTS]

### FP-CONCEPT-ENERGY-001

**Statement (v1, APPROVED):** Energy is the capacity to do work, and exists in different forms including kinetic energy (due to motion) and potential energy (due to position or state).

**Direct prerequisites:** FP-CONCEPT-WORK-001 (STRONG)
**Direct dependents:** FP-CONCEPT-ENERGY-CONSERVATION-001; FP-CONCEPT-KINETIC-ENERGY-001; FP-CONCEPT-POTENTIAL-ENERGY-001; FP-CONCEPT-POWER-001; EL-CONCEPT-VOLTAGE-001; EL-CONCEPT-ENERGY-001
**Curriculum mapping(s):** Describe the main principles of the following and their inter-relationships: force, work, energy (kinetic and potential), power, efficiency (REQUIRED_FOR)
**Provenance:** University Physics Volume 1 — University Physics Volume 1, Ch.7.2: kinetic energy and the work-energy relationship; conservation of energy [DEFINES]

### FP-CONCEPT-ENERGY-CONSERVATION-001

**Statement (v1, APPROVED):** Energy cannot be created or destroyed, only transferred or converted from one form to another.

**Direct prerequisites:** FP-CONCEPT-ENERGY-001 (REQUIRED)
**Direct dependents:** FP-CONCEPT-EFFICIENCY-001
**Provenance:** University Physics Volume 1 — University Physics Volume 1, Ch.7.2: kinetic energy and the work-energy relationship; conservation of energy [SUPPORTS]

### FP-CONCEPT-KINETIC-ENERGY-001

**Statement (v1, APPROVED):** Kinetic energy is the energy an object possesses because of its motion.

**Direct prerequisites:** FP-CONCEPT-ENERGY-001 (REQUIRED)
**Direct dependents:** FP-REL-KINETIC-ENERGY-001
**Curriculum mapping(s):** Describe the main principles of the following and their inter-relationships: force, work, energy (kinetic and potential), power, efficiency (REQUIRED_FOR)
**Provenance:** University Physics Volume 1 — University Physics Volume 1, Ch.7.2: kinetic energy and the work-energy relationship; conservation of energy [DEFINES]

### FP-REL-KINETIC-ENERGY-001

**Statement (v1, APPROVED):** Kinetic energy is calculated from an object's mass and speed using KE = one half times m times v squared.

**Direct prerequisites:** FP-CONCEPT-KINETIC-ENERGY-001 (REQUIRED)
**Direct dependents:** FP-CALC-KINETIC-ENERGY-001
**Curriculum mapping(s):** Describe the main principles of the following and their inter-relationships: force, work, energy (kinetic and potential), power, efficiency (REQUIRED_FOR)
**Provenance:** University Physics Volume 1 — University Physics Volume 1, Ch.7.2: kinetic energy and the work-energy relationship; conservation of energy [SUPPORTS]

### FP-CALC-KINETIC-ENERGY-001

**Statement (v1, APPROVED):** Calculate the kinetic energy of an object from its mass and speed, using KE = one half times m times v squared.

**Direct prerequisites:** FP-REL-KINETIC-ENERGY-001 (REQUIRED); FM-ALG-SUBSTITUTION-001 (REQUIRED)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Calculate values of mechanical energy, power and efficiency (REQUIRED_FOR)
**Provenance:** University Physics Volume 1 — University Physics Volume 1, Ch.7.2: kinetic energy and the work-energy relationship; conservation of energy [SUPPORTS]

### FP-CONCEPT-POTENTIAL-ENERGY-001

**Statement (v1, APPROVED):** Gravitational potential energy is the energy an object possesses because of its position (height) within a gravitational field.

**Direct prerequisites:** FP-CONCEPT-ENERGY-001 (REQUIRED)
**Direct dependents:** FP-REL-POTENTIAL-ENERGY-001
**Curriculum mapping(s):** Describe the main principles of the following and their inter-relationships: force, work, energy (kinetic and potential), power, efficiency (REQUIRED_FOR)
**Provenance:** University Physics Volume 1 — Gravitational potential energy near Earth's surface is calculated as GPE = mgh, where m is mass, g is gravitational field strength and h is height above a reference level [DEFINES]

### FP-REL-POTENTIAL-ENERGY-001

**Statement (v1, APPROVED):** Gravitational potential energy near the Earth's surface is calculated from an object's mass, gravitational field strength and height using GPE = m times g times h.

**Direct prerequisites:** FP-CONCEPT-POTENTIAL-ENERGY-001 (REQUIRED); FP-REL-WEIGHT-MASS-001 (STRONG)
**Direct dependents:** FP-CALC-POTENTIAL-ENERGY-001
**Curriculum mapping(s):** Describe the main principles of the following and their inter-relationships: force, work, energy (kinetic and potential), power, efficiency (REQUIRED_FOR)
**Provenance:** University Physics Volume 1 — Gravitational potential energy near Earth's surface is calculated as GPE = mgh, where m is mass, g is gravitational field strength and h is height above a reference level [SUPPORTS]

### FP-CALC-POTENTIAL-ENERGY-001

**Statement (v1, APPROVED):** Calculate the gravitational potential energy of an object from its mass, gravitational field strength and height, using GPE = m times g times h.

**Direct prerequisites:** FP-REL-POTENTIAL-ENERGY-001 (REQUIRED); FM-ALG-SUBSTITUTION-001 (REQUIRED)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Calculate values of mechanical energy, power and efficiency (REQUIRED_FOR)
**Provenance:** University Physics Volume 1 — Gravitational potential energy near Earth's surface is calculated as GPE = mgh, where m is mass, g is gravitational field strength and h is height above a reference level [SUPPORTS]

### FP-CONCEPT-POWER-001

**Statement (v1, APPROVED):** Power is the rate at which work is done or energy is transferred.

**Direct prerequisites:** FP-CONCEPT-WORK-001 (REQUIRED); FP-CONCEPT-ENERGY-001 (REQUIRED)
**Direct dependents:** FP-REL-POWER-WORK-TIME-001; EL-CONCEPT-POWER-001
**Curriculum mapping(s):** Describe the main principles of the following and their inter-relationships: force, work, energy (kinetic and potential), power, efficiency (REQUIRED_FOR)
**Provenance:** University Physics Volume 1 — University Physics Volume 1, Ch.7.4: power as the rate at which work is done or energy is transferred, P = W / t [DEFINES]

### FP-REL-POWER-WORK-TIME-001

**Statement (v1, APPROVED):** Power is calculated by dividing the work done (or energy transferred) by the time taken: P = W / t.

**Direct prerequisites:** FP-CONCEPT-POWER-001 (REQUIRED)
**Direct dependents:** FP-CALC-POWER-001
**Curriculum mapping(s):** Describe the main principles of the following and their inter-relationships: force, work, energy (kinetic and potential), power, efficiency (REQUIRED_FOR)
**Provenance:** University Physics Volume 1 — University Physics Volume 1, Ch.7.4: power as the rate at which work is done or energy is transferred, P = W / t [SUPPORTS]

### FP-CALC-POWER-001

**Statement (v1, APPROVED):** Calculate power from known work done (or energy transferred) and time taken, using P = W / t.

**Direct prerequisites:** FP-REL-POWER-WORK-TIME-001 (REQUIRED); FM-ALG-SUBSTITUTION-001 (REQUIRED)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Calculate values of mechanical energy, power and efficiency (REQUIRED_FOR)
**Provenance:** University Physics Volume 1 — University Physics Volume 1, Ch.7.4: power as the rate at which work is done or energy is transferred, P = W / t [SUPPORTS]

### FP-CONCEPT-EFFICIENCY-001

**Statement (v1, APPROVED):** Efficiency is the ratio of useful energy or power output to total energy or power input, usually expressed as a percentage.

**Direct prerequisites:** FP-CONCEPT-ENERGY-CONSERVATION-001 (REQUIRED); FM-ARITH-PERCENTAGE-001 (REQUIRED)
**Direct dependents:** FP-CALC-EFFICIENCY-001; EL-CONCEPT-ELECTRICAL-EFFICIENCY-001
**Curriculum mapping(s):** Describe the main principles of the following and their inter-relationships: force, work, energy (kinetic and potential), power, efficiency (REQUIRED_FOR)
**Provenance:** University Physics Volume 1 — University Physics Volume 1, Ch.7.4: power as the rate at which work is done or energy is transferred, P = W / t [SUPPORTS]

### FP-CALC-EFFICIENCY-001

**Statement (v1, APPROVED):** Calculate the efficiency of a process as a percentage from its useful output and total input.

**Direct prerequisites:** FP-CONCEPT-EFFICIENCY-001 (REQUIRED); FM-ARITH-PERCENTAGE-001 (REQUIRED)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Calculate values of mechanical energy, power and efficiency (REQUIRED_FOR)
**Provenance:** University Physics Volume 1 — University Physics Volume 1, Ch.7.4: power as the rate at which work is done or energy is transferred, P = W / t [SUPPORTS]

### FP-CONCEPT-MASS-001

**Statement (v1, APPROVED):** Mass is the amount of matter in an object, measured in kilograms.

**Direct prerequisites:** (none — root assertion)
**Direct dependents:** FP-CONCEPT-WEIGHT-001; FP-REL-WEIGHT-MASS-001
**Curriculum mapping(s):** Specify what is meant by mass and weight (REQUIRED_FOR)
**Provenance:** University Physics Volume 1 — University Physics Volume 1, Ch.7: work as a force causing displacement of its point of application; force and mass/weight [DEFINES]

### FP-CONCEPT-WEIGHT-001

**Statement (v1, APPROVED):** Weight is the force of gravity acting on an object's mass, measured in newtons.

**Direct prerequisites:** FP-CONCEPT-FORCE-001 (STRONG); FP-CONCEPT-MASS-001 (STRONG)
**Direct dependents:** FP-REL-WEIGHT-MASS-001
**Curriculum mapping(s):** Specify what is meant by mass and weight (REQUIRED_FOR)
**Provenance:** University Physics Volume 1 — University Physics Volume 1, Ch.7: work as a force causing displacement of its point of application; force and mass/weight [DEFINES]

### FP-REL-WEIGHT-MASS-001

**Statement (v1, APPROVED):** Weight is calculated from mass and gravitational field strength using W = m times g.

**Direct prerequisites:** FP-CONCEPT-MASS-001 (REQUIRED); FP-CONCEPT-WEIGHT-001 (REQUIRED)
**Direct dependents:** FP-REL-POTENTIAL-ENERGY-001; FP-CALC-WEIGHT-001
**Curriculum mapping(s):** Specify what is meant by mass and weight (SUPPORTS)
**Provenance:** University Physics Volume 1 — University Physics Volume 1, Ch.7: work as a force causing displacement of its point of application; force and mass/weight [SUPPORTS]

### FP-CALC-WEIGHT-001

**Statement (v1, APPROVED):** Calculate the weight of an object from its mass and gravitational field strength using W = m times g.

**Direct prerequisites:** FP-REL-WEIGHT-MASS-001 (REQUIRED); FM-ALG-TRANSPOSE-MULT-001 (REQUIRED); FM-ALG-SUBSTITUTION-001 (REQUIRED)
**Direct dependents:** (none — leaf capability)
**Provenance:** University Physics Volume 1 — University Physics Volume 1, Ch.7: work as a force causing displacement of its point of application; force and mass/weight [SUPPORTS]

### FP-CONCEPT-MECHANICAL-ADVANTAGE-001

**Statement (v1, APPROVED):** A simple machine such as a lever, gear or pulley provides mechanical advantage by changing the relationship between the effort (input force) applied and the load (output force) it moves.

**Direct prerequisites:** FP-CONCEPT-FORCE-001 (STRONG)
**Direct dependents:** FP-CONCEPT-LEVER-PRINCIPLE-001; FP-CONCEPT-GEAR-001; FP-CONCEPT-PULLEY-001
**Curriculum mapping(s):** Explain the principles of basic mechanics as they apply to levers, gears and pulleys (REQUIRED_FOR)
**Provenance:** University Physics Volume 1 — Static equilibrium: a lever's mechanical advantage from the balance of torques (force times lever-arm distance) about a pivot, the physical basis distinguishing lever classes by the relative arrangement of pivot, effort and load [SUPPORTS]

### FP-CONCEPT-LEVER-PRINCIPLE-001

**Statement (v1, APPROVED):** A lever is a rigid bar that rotates about a fixed pivot (fulcrum); the mechanical advantage it provides depends on the ratio of the effort's distance from the pivot to the load's distance from the pivot.

**Direct prerequisites:** FP-CONCEPT-MECHANICAL-ADVANTAGE-001 (REQUIRED)
**Direct dependents:** FP-LEVER-CLASS-I-001; FP-LEVER-CLASS-II-001; FP-LEVER-CLASS-III-001
**Curriculum mapping(s):** Explain the principles of basic mechanics as they apply to levers, gears and pulleys (REQUIRED_FOR)
**Provenance:** University Physics Volume 1 — Static equilibrium: a lever's mechanical advantage from the balance of torques (force times lever-arm distance) about a pivot, the physical basis distinguishing lever classes by the relative arrangement of pivot, effort and load [SUPPORTS]

### FP-LEVER-CLASS-I-001

**Statement (v1, APPROVED):** In a class I lever, the pivot is positioned between the effort and the load (for example a see-saw or a pair of pliers).

**Direct prerequisites:** FP-CONCEPT-LEVER-PRINCIPLE-001 (REQUIRED)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Levers: Class I (REQUIRED_FOR)
**Provenance:** University Physics Volume 1 — Static equilibrium: a lever's mechanical advantage from the balance of torques (force times lever-arm distance) about a pivot, the physical basis distinguishing lever classes by the relative arrangement of pivot, effort and load [SUPPORTS]

### FP-LEVER-CLASS-II-001

**Statement (v1, APPROVED):** In a class II lever, the load is positioned between the pivot and the effort (for example a wheelbarrow).

**Direct prerequisites:** FP-CONCEPT-LEVER-PRINCIPLE-001 (REQUIRED)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Levers: Class II (REQUIRED_FOR)
**Provenance:** University Physics Volume 1 — Static equilibrium: a lever's mechanical advantage from the balance of torques (force times lever-arm distance) about a pivot, the physical basis distinguishing lever classes by the relative arrangement of pivot, effort and load [SUPPORTS]

### FP-LEVER-CLASS-III-001

**Statement (v1, APPROVED):** In a class III lever, the effort is positioned between the pivot and the load (for example a pair of tweezers or the human forearm).

**Direct prerequisites:** FP-CONCEPT-LEVER-PRINCIPLE-001 (REQUIRED)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Levers: Class III (REQUIRED_FOR)
**Provenance:** University Physics Volume 1 — Static equilibrium: a lever's mechanical advantage from the balance of torques (force times lever-arm distance) about a pivot, the physical basis distinguishing lever classes by the relative arrangement of pivot, effort and load [SUPPORTS]

### FP-CONCEPT-GEAR-001

**Statement (v1, APPROVED):** A gear is a toothed wheel that meshes with another gear to transmit rotary motion and force from one shaft to another.

**Direct prerequisites:** FP-CONCEPT-MECHANICAL-ADVANTAGE-001 (REQUIRED)
**Direct dependents:** FP-REL-GEAR-RATIO-001
**Curriculum mapping(s):** Explain the principles of basic mechanics as they apply to levers, gears and pulleys (REQUIRED_FOR)
**Provenance:** College Physics 2e — For gears/wheels driven by a common axle, mechanical advantage is the ratio of the radii (or, equivalently, tooth counts) of the driving and driven gears; a single fixed pulley has a mechanical advantage of 1 (direction change only), while a movable/combination pulley system's mechanical advantage approximately equals the number of rope/cable sections directly supporting the load [DEFINES]

### FP-REL-GEAR-RATIO-001

**Statement (v1, APPROVED):** For two meshed gears sharing a common tooth pitch, the mechanical advantage (and speed/torque relationship) between the driving and driven gear equals the ratio of their radii, which is equivalent to the ratio of their tooth counts.

**Direct prerequisites:** FP-CONCEPT-GEAR-001 (REQUIRED)
**Direct dependents:** FP-GEAR-SPEED-TORQUE-TRADEOFF-001
**Curriculum mapping(s):** Explain the principles of basic mechanics as they apply to levers, gears and pulleys (REQUIRED_FOR)
**Provenance:** College Physics 2e — For gears/wheels driven by a common axle, mechanical advantage is the ratio of the radii (or, equivalently, tooth counts) of the driving and driven gears; a single fixed pulley has a mechanical advantage of 1 (direction change only), while a movable/combination pulley system's mechanical advantage approximately equals the number of rope/cable sections directly supporting the load [SUPPORTS]

### FP-GEAR-SPEED-TORQUE-TRADEOFF-001

**Statement (v1, APPROVED):** A gear ratio can increase a mechanism's output torque or its output speed relative to the input, but not both at the same time.

**Direct prerequisites:** FP-REL-GEAR-RATIO-001 (REQUIRED)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Explain the principles of basic mechanics as they apply to levers, gears and pulleys (SUPPORTS)
**Provenance:** College Physics 2e — For gears/wheels driven by a common axle, mechanical advantage is the ratio of the radii (or, equivalently, tooth counts) of the driving and driven gears; a single fixed pulley has a mechanical advantage of 1 (direction change only), while a movable/combination pulley system's mechanical advantage approximately equals the number of rope/cable sections directly supporting the load [SUPPORTS]

### FP-CONCEPT-PULLEY-001

**Statement (v1, APPROVED):** A pulley is a wheel with a grooved rim that changes the direction of a force applied through a rope or cable running over it.

**Direct prerequisites:** FP-CONCEPT-MECHANICAL-ADVANTAGE-001 (REQUIRED)
**Direct dependents:** FP-PULLEY-FIXED-VS-MOVABLE-001
**Curriculum mapping(s):** Explain the principles of basic mechanics as they apply to levers, gears and pulleys (REQUIRED_FOR)
**Provenance:** College Physics 2e — For gears/wheels driven by a common axle, mechanical advantage is the ratio of the radii (or, equivalently, tooth counts) of the driving and driven gears; a single fixed pulley has a mechanical advantage of 1 (direction change only), while a movable/combination pulley system's mechanical advantage approximately equals the number of rope/cable sections directly supporting the load [DEFINES]

### FP-PULLEY-FIXED-VS-MOVABLE-001

**Statement (v1, APPROVED):** A single fixed pulley has a mechanical advantage of one -- it changes the direction of the effort but does not reduce the force needed; a movable pulley, or a combination of pulleys, can provide a mechanical advantage greater than one.

**Direct prerequisites:** FP-CONCEPT-PULLEY-001 (REQUIRED)
**Direct dependents:** FP-REL-PULLEY-MECHANICAL-ADVANTAGE-001
**Curriculum mapping(s):** Explain the principles of basic mechanics as they apply to levers, gears and pulleys (REQUIRED_FOR)
**Provenance:** College Physics 2e — For gears/wheels driven by a common axle, mechanical advantage is the ratio of the radii (or, equivalently, tooth counts) of the driving and driven gears; a single fixed pulley has a mechanical advantage of 1 (direction change only), while a movable/combination pulley system's mechanical advantage approximately equals the number of rope/cable sections directly supporting the load [SUPPORTS]

### FP-REL-PULLEY-MECHANICAL-ADVANTAGE-001

**Statement (v1, APPROVED):** For a movable or combination pulley system, the mechanical advantage is approximately equal to the number of rope or cable sections that directly support the load.

**Direct prerequisites:** FP-PULLEY-FIXED-VS-MOVABLE-001 (REQUIRED)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Explain the principles of basic mechanics as they apply to levers, gears and pulleys (REQUIRED_FOR)
**Provenance:** College Physics 2e — For gears/wheels driven by a common axle, mechanical advantage is the ratio of the radii (or, equivalently, tooth counts) of the driving and driven gears; a single fixed pulley has a mechanical advantage of 1 (direction change only), while a movable/combination pulley system's mechanical advantage approximately equals the number of rope/cable sections directly supporting the load [SUPPORTS]

### FP-UNIT-METRE-001

**Statement (v1, APPROVED):** The metre (m) is the SI base unit of length.

**Direct prerequisites:** (none — root assertion)
**Direct dependents:** FP-UNIT-SQUARE-METRE-001; FP-UNIT-CUBIC-METRE-001; FP-UNIT-METRE-PER-SECOND-001
**Curriculum mapping(s):** (SI) Units of measurement for: Length (REQUIRED_FOR)
**Provenance:** The International System of Units (SI Brochure) — SI Brochure Table 1: the seven SI base units, including the metre (length), kilogram (mass), second (time) and kelvin (thermodynamic temperature) [DEFINES]

### FP-UNIT-SQUARE-METRE-001

**Statement (v1, APPROVED):** The square metre (m squared) is the SI derived unit of area, formed by multiplying two lengths.

**Direct prerequisites:** FP-UNIT-METRE-001 (REQUIRED)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** (SI) Units of measurement for: Area (REQUIRED_FOR)
**Provenance:** The International System of Units (SI Brochure) — SI Brochure Table 3: examples of SI coherent derived units expressed in terms of base units, including area (square metre), volume (cubic metre), speed/velocity (metre per second) and density (kilogram per cubic metre) [DEFINES]

### FP-UNIT-CUBIC-METRE-001

**Statement (v1, APPROVED):** The cubic metre (m cubed) is the SI derived unit of volume, formed by multiplying three lengths.

**Direct prerequisites:** FP-UNIT-METRE-001 (REQUIRED)
**Direct dependents:** FP-UNIT-DENSITY-001
**Curriculum mapping(s):** (SI) Units of measurement for: Volume (REQUIRED_FOR)
**Provenance:** The International System of Units (SI Brochure) — SI Brochure Table 3: examples of SI coherent derived units expressed in terms of base units, including area (square metre), volume (cubic metre), speed/velocity (metre per second) and density (kilogram per cubic metre) [DEFINES]

### FP-UNIT-KILOGRAM-001

**Statement (v1, APPROVED):** The kilogram (kg) is the SI base unit of mass.

**Direct prerequisites:** (none — root assertion)
**Direct dependents:** FP-UNIT-DENSITY-001
**Curriculum mapping(s):** (SI) Units of measurement for: Mass (REQUIRED_FOR)
**Provenance:** The International System of Units (SI Brochure) — SI Brochure Table 1: the seven SI base units, including the metre (length), kilogram (mass), second (time) and kelvin (thermodynamic temperature) [DEFINES]

### FP-UNIT-DENSITY-001

**Statement (v1, APPROVED):** Density is mass per unit volume, with SI derived unit the kilogram per cubic metre (kg/m cubed).

**Direct prerequisites:** FP-UNIT-KILOGRAM-001 (REQUIRED); FP-UNIT-CUBIC-METRE-001 (REQUIRED)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** (SI) Units of measurement for: Density (REQUIRED_FOR)
**Provenance:** The International System of Units (SI Brochure) — SI Brochure Table 3: examples of SI coherent derived units expressed in terms of base units, including area (square metre), volume (cubic metre), speed/velocity (metre per second) and density (kilogram per cubic metre) [DEFINES]

### FP-UNIT-SECOND-001

**Statement (v1, APPROVED):** The second (s) is the SI base unit of time.

**Direct prerequisites:** (none — root assertion)
**Direct dependents:** FP-UNIT-METRE-PER-SECOND-001
**Curriculum mapping(s):** (SI) Units of measurement for: Time (REQUIRED_FOR)
**Provenance:** The International System of Units (SI Brochure) — SI Brochure Table 1: the seven SI base units, including the metre (length), kilogram (mass), second (time) and kelvin (thermodynamic temperature) [DEFINES]

### FP-UNIT-KELVIN-CELSIUS-001

**Statement (v1, APPROVED):** The kelvin (K) is the SI base unit of thermodynamic temperature T; the degree Celsius (deg C) is a special name for the kelvin used to express Celsius temperature t, related by t = T minus 273.15. A temperature interval or difference of one degree Celsius equals one kelvin.

**Direct prerequisites:** (none — root assertion)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** (SI) Units of measurement for: Temperature (REQUIRED_FOR)
**Provenance:** The International System of Units (SI Brochure) — SI Brochure Table 1: the seven SI base units, including the metre (length), kilogram (mass), second (time) and kelvin (thermodynamic temperature) [DEFINES] | The International System of Units (SI Brochure) — SI Brochure 2.3.3: the degree Celsius, a special name for the kelvin used to express Celsius temperature [DEFINES]

### FP-UNIT-METRE-PER-SECOND-001

**Statement (v1, APPROVED):** The metre per second (m/s) is the SI derived unit of speed/velocity, formed by dividing a length by a time.

**Direct prerequisites:** FP-UNIT-METRE-001 (REQUIRED); FP-UNIT-SECOND-001 (REQUIRED)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** (SI) Units of measurement for: Velocity (REQUIRED_FOR)
**Provenance:** The International System of Units (SI Brochure) — SI Brochure Table 3: examples of SI coherent derived units expressed in terms of base units, including area (square metre), volume (cubic metre), speed/velocity (metre per second) and density (kilogram per cubic metre) [DEFINES]

## Electrical (EL)

### EL-UNIT-VOLT-001

**Statement (v1, APPROVED):** The volt (V) is the SI derived unit of electric potential difference (voltage).

**Direct prerequisites:** (none — root assertion)
**Direct dependents:** EL-UNIT-BASE-VS-DERIVED-001
**Curriculum mapping(s):** Identify and use internationally recognised base and derived (SI) units of measurement (REQUIRED_FOR); Identify and determine values of base and derived SI units which apply specifically to electrical quantities (REQUIRED_FOR); Electrical quantities (SI units): Voltage (REQUIRED_FOR); Identify and use internationally recognised base and derived (SI) units of measurement (REQUIRED_FOR); Identify and determine values of base and derived SI units which apply specifically to electrical quantities (REQUIRED_FOR)
**Provenance:** The International System of Units (SI Brochure) — SI Brochure: table of SI derived units with special names, including the volt, ohm, watt and joule, and SI prefixes [DEFINES] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC2.2: identify and determine values of base and derived SI units which apply specifically to electrical quantities [CURRICULUM_REQUIRES]
**Misconceptions targeting this assertion:** MIS-EL-UNIT-CONFUSION-001

### EL-UNIT-AMPERE-001

**Statement (v1, APPROVED):** The ampere (A) is the SI base unit of electric current.

**Direct prerequisites:** (none — root assertion)
**Direct dependents:** EL-UNIT-BASE-VS-DERIVED-001
**Curriculum mapping(s):** Identify and use internationally recognised base and derived (SI) units of measurement (REQUIRED_FOR); Identify and determine values of base and derived SI units which apply specifically to electrical quantities (REQUIRED_FOR); Electrical quantities (SI units): Current (REQUIRED_FOR); Identify and use internationally recognised base and derived (SI) units of measurement (REQUIRED_FOR); Identify and determine values of base and derived SI units which apply specifically to electrical quantities (REQUIRED_FOR)
**Provenance:** The International System of Units (SI Brochure) — SI Brochure Appendix 2: the ampere, SI base unit of electric current [DEFINES] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC2.2: identify and determine values of base and derived SI units which apply specifically to electrical quantities [CURRICULUM_REQUIRES]
**Misconceptions targeting this assertion:** MIS-EL-UNIT-CONFUSION-001

### EL-UNIT-OHM-001

**Statement (v1, APPROVED):** The ohm is the SI derived unit of electrical resistance.

**Direct prerequisites:** (none — root assertion)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Identify and determine values of base and derived SI units which apply specifically to electrical quantities (REQUIRED_FOR); Electrical quantities (SI units): Resistance (REQUIRED_FOR); Identify and determine values of base and derived SI units which apply specifically to electrical quantities (REQUIRED_FOR)
**Provenance:** The International System of Units (SI Brochure) — SI Brochure: table of SI derived units with special names, including the volt, ohm, watt and joule, and SI prefixes [DEFINES] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC2.2: identify and determine values of base and derived SI units which apply specifically to electrical quantities [CURRICULUM_REQUIRES]
**Misconceptions targeting this assertion:** MIS-EL-UNIT-CONFUSION-001

### EL-UNIT-WATT-001

**Statement (v1, APPROVED):** The watt (W) is the SI derived unit of power.

**Direct prerequisites:** (none — root assertion)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Identify and determine values of base and derived SI units which apply specifically to electrical quantities (REQUIRED_FOR); Electrical quantities (SI units): Power (REQUIRED_FOR); Identify and determine values of base and derived SI units which apply specifically to electrical quantities (REQUIRED_FOR)
**Provenance:** The International System of Units (SI Brochure) — SI Brochure: table of SI derived units with special names, including the volt, ohm, watt and joule, and SI prefixes [DEFINES] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC2.2: identify and determine values of base and derived SI units which apply specifically to electrical quantities [CURRICULUM_REQUIRES]
**Misconceptions targeting this assertion:** MIS-EL-UNIT-CONFUSION-001

### EL-UNIT-JOULE-001

**Statement (v1, APPROVED):** The joule (J) is the SI derived unit of energy.

**Direct prerequisites:** (none — root assertion)
**Direct dependents:** EL-UNIT-KWH-001
**Curriculum mapping(s):** Identify and determine values of base and derived SI units which apply specifically to electrical quantities (REQUIRED_FOR); Electrical quantities (SI units): Energy (REQUIRED_FOR); Identify and determine values of base and derived SI units which apply specifically to electrical quantities (REQUIRED_FOR)
**Provenance:** The International System of Units (SI Brochure) — SI Brochure: table of SI derived units with special names, including the volt, ohm, watt and joule, and SI prefixes [DEFINES] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC2.2: identify and determine values of base and derived SI units which apply specifically to electrical quantities [CURRICULUM_REQUIRES]
**Misconceptions targeting this assertion:** MIS-EL-UNIT-CONFUSION-001, MIS-EL-ENERGY-UNIT-CONFUSION-001

### EL-UNIT-OHM-METRE-001

**Statement (v1, APPROVED):** The ohm-metre is the SI derived unit of resistivity.

**Direct prerequisites:** (none — root assertion)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Identify and determine values of base and derived SI units which apply specifically to electrical quantities (REQUIRED_FOR); Electrical quantities (SI units): Resistivity (REQUIRED_FOR); Identify and determine values of base and derived SI units which apply specifically to electrical quantities (REQUIRED_FOR)
**Provenance:** The International System of Units (SI Brochure) — SI Brochure: table of SI derived units with special names, including the volt, ohm, watt and joule, and SI prefixes [DEFINES] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC2.2: identify and determine values of base and derived SI units which apply specifically to electrical quantities [CURRICULUM_REQUIRES]

### EL-CONCEPT-VOLTAGE-001

**Statement (v1, APPROVED):** Potential difference (voltage) is the electrical energy transferred per unit charge between two points in a circuit.

**Direct prerequisites:** FP-CONCEPT-ENERGY-001 (STRONG)
**Direct dependents:** EL-INSTRUMENT-VOLTMETER-001; EL-OHM-RELATIONSHIP-001; EL-PARALLEL-VOLTAGE-001; EL-POWER-RELATIONSHIP-001; EL-CONCEPT-TERMINAL-VOLTAGE-001
**Curriculum mapping(s):** Identify and determine values of base and derived SI units which apply specifically to electrical quantities (REQUIRED_FOR); Identify and determine values of base and derived SI units which apply specifically to electrical quantities (REQUIRED_FOR)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, 9.4: Ohm's law, V = IR, and voltage/potential difference [DEFINES] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC2.2: identify and determine values of base and derived SI units which apply specifically to electrical quantities [CURRICULUM_REQUIRES]
**Misconceptions targeting this assertion:** MIS-EL-CURRENT-VOLTAGE-CONFUSION-001

### EL-CONCEPT-CURRENT-001

**Statement (v1, APPROVED):** Electric current is the rate of flow of electric charge through a conductor.

**Direct prerequisites:** (none — root assertion)
**Direct dependents:** EL-INSTRUMENT-AMMETER-001; EL-CONCEPT-ELECTRON-THEORY-001; EL-OHM-RELATIONSHIP-001; EL-SERIES-CURRENT-001; EL-PARALLEL-CURRENT-001; EL-POWER-RELATIONSHIP-001; EL-CURRENT-CHEMICAL-EFFECT-001; EL-CURRENT-CHARGE-RELATIONSHIP-001; EL-CONCEPT-MAGNETIC-FIELD-CURRENT-001; EL-CONCEPT-AC-DC-DISTINCTION-001; EL-INSTRUMENT-CLAMP-METER-001
**Curriculum mapping(s):** Identify and determine values of base and derived SI units which apply specifically to electrical quantities (REQUIRED_FOR); Identify and determine values of base and derived SI units which apply specifically to electrical quantities (REQUIRED_FOR)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, 9.4: Ohm's law, V = IR, and voltage/potential difference [DEFINES] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC2.2: identify and determine values of base and derived SI units which apply specifically to electrical quantities [CURRICULUM_REQUIRES]
**Misconceptions targeting this assertion:** MIS-EL-CURRENT-VOLTAGE-CONFUSION-001

### EL-CONCEPT-RESISTANCE-001

**Statement (v1, APPROVED):** Electrical resistance is the opposition a component presents to the flow of electric current.

**Direct prerequisites:** (none — root assertion)
**Direct dependents:** EL-CONCEPT-RESISTIVITY-001; EL-INSTRUMENT-OHMMETER-001; EL-CONCEPT-REACTANCE-001; EL-CONCEPT-IMPEDANCE-001; EL-RESISTIVITY-RELATIONSHIP-001; EL-OHM-RELATIONSHIP-001; EL-SERIES-RESISTANCE-001; EL-PARALLEL-RESISTANCE-001; EL-CURRENT-THERMAL-EFFECT-001; EL-CIRCUIT-RECOGNISE-SHORT-CIRCUIT-001; EL-COMPONENT-RESISTOR-001
**Curriculum mapping(s):** Identify and determine values of base and derived SI units which apply specifically to electrical quantities (REQUIRED_FOR); Describe what is meant by resistance and resistivity in relation to electrical circuits (REQUIRED_FOR); Electrical quantities (SI units): Resistance (REQUIRED_FOR); Electronic components and devices: Resistors (REQUIRED_FOR); Identify and determine values of base and derived SI units which apply specifically to electrical quantities (REQUIRED_FOR); Describe what is meant by resistance and resistivity in relation to electrical circuits (REQUIRED_FOR)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, 9.3: resistance and resistivity, and R = rho L / A [DEFINES] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC4.3: describe what is meant by resistance and resistivity in relation to electrical circuits [CURRICULUM_REQUIRES]
**Misconceptions targeting this assertion:** MIS-EL-RESISTANCE-RESISTIVITY-CONFUSION-001

### EL-CONCEPT-RESISTIVITY-001

**Statement (v1, APPROVED):** Resistivity is a material property describing how strongly a material opposes current flow, independent of the conductor's length or cross-sectional area.

**Direct prerequisites:** EL-CONCEPT-RESISTANCE-001 (STRONG)
**Direct dependents:** EL-RESISTIVITY-RELATIONSHIP-001; EL-RESISTIVITY-COMPARE-MATERIALS-001
**Curriculum mapping(s):** Identify and determine values of base and derived SI units which apply specifically to electrical quantities (SUPPORTS); Describe what is meant by resistance and resistivity in relation to electrical circuits (REQUIRED_FOR); Identify and determine values of base and derived SI units which apply specifically to electrical quantities (SUPPORTS); Describe what is meant by resistance and resistivity in relation to electrical circuits (REQUIRED_FOR)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, 9.3: resistance and resistivity, and R = rho L / A [DEFINES] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC4.3: describe what is meant by resistance and resistivity in relation to electrical circuits [CURRICULUM_REQUIRES]
**Misconceptions targeting this assertion:** MIS-EL-RESISTANCE-RESISTIVITY-CONFUSION-001

### EL-CONCEPT-POWER-001

**Statement (v1, APPROVED):** Electrical power is the rate at which electrical energy is transferred or converted.

**Direct prerequisites:** FP-CONCEPT-POWER-001 (REQUIRED)
**Direct dependents:** EL-INSTRUMENT-WATTMETER-001; EL-POWER-RATING-001; EL-CONCEPT-POWER-FACTOR-001; EL-CONCEPT-ELECTRICAL-EFFICIENCY-001; EL-POWER-RELATIONSHIP-001; EL-ENERGY-POWER-TIME-RELATIONSHIP-001
**Curriculum mapping(s):** Identify and determine values of base and derived SI units which apply specifically to electrical quantities (REQUIRED_FOR); Identify and determine values of base and derived SI units which apply specifically to electrical quantities (REQUIRED_FOR)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, 9.5: electrical power and energy, P = VI and P = I^2 R [DEFINES] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC2.2: identify and determine values of base and derived SI units which apply specifically to electrical quantities [CURRICULUM_REQUIRES]
**Misconceptions targeting this assertion:** MIS-EL-POWER-ENERGY-CONFUSION-001

### EL-CONCEPT-ENERGY-001

**Statement (v1, APPROVED):** Electrical energy is the total amount of electrical work done, or energy transferred, over a period of time.

**Direct prerequisites:** FP-CONCEPT-ENERGY-001 (REQUIRED)
**Direct dependents:** EL-INSTRUMENT-ENERGY-METER-001; EL-UNIT-KWH-001; EL-CURRENT-THERMAL-EFFECT-001; EL-ENERGY-POWER-TIME-RELATIONSHIP-001
**Curriculum mapping(s):** Identify and determine values of base and derived SI units which apply specifically to electrical quantities (REQUIRED_FOR); Identify and determine values of base and derived SI units which apply specifically to electrical quantities (REQUIRED_FOR)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, 9.5: electrical power and energy, P = VI and P = I^2 R [DEFINES] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC2.2: identify and determine values of base and derived SI units which apply specifically to electrical quantities [CURRICULUM_REQUIRES]
**Misconceptions targeting this assertion:** MIS-EL-POWER-ENERGY-CONFUSION-001

### EL-INSTRUMENT-VOLTMETER-001

**Statement (v1, APPROVED):** A voltmeter measures potential difference and is connected in parallel across the component being measured.

**Direct prerequisites:** EL-CONCEPT-VOLTAGE-001 (STRONG)
**Direct dependents:** EL-INSTRUMENT-MULTIMETER-001; EL-INSTRUMENT-SELECT-001; EL-INSTRUMENT-VOLTMETER-INTERNAL-RESISTANCE-001
**Curriculum mapping(s):** Identify appropriate electrical instruments for the measurement of different electrical quantities (REQUIRED_FOR); Electrical quantities (measurement): Voltage (REQUIRED_FOR); Identify appropriate electrical instruments for the measurement of different electrical quantities (REQUIRED_FOR)
**Provenance:** University Physics Volume 2 — A voltmeter is placed in parallel and must have very high (ideally infinite) resistance so it does not alter the circuit; an ammeter is placed in series and must have very low (ideally zero) resistance for the same reason; an ohmmeter must never be connected to a live (energised) circuit [DEFINES] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC2.3: identify appropriate electrical instruments for the measurement of different electrical quantities [CURRICULUM_REQUIRES]
**Misconceptions targeting this assertion:** MIS-EL-INSTRUMENT-CONNECTION-CONFUSION-001

### EL-INSTRUMENT-AMMETER-001

**Statement (v1, APPROVED):** An ammeter measures current and is connected in series within the circuit being measured.

**Direct prerequisites:** EL-CONCEPT-CURRENT-001 (STRONG)
**Direct dependents:** EL-INSTRUMENT-MULTIMETER-001; EL-INSTRUMENT-SELECT-001; EL-INSTRUMENT-AMMETER-INTERNAL-RESISTANCE-001
**Curriculum mapping(s):** Identify appropriate electrical instruments for the measurement of different electrical quantities (REQUIRED_FOR); Electrical quantities (measurement): Current (REQUIRED_FOR); Identify appropriate electrical instruments for the measurement of different electrical quantities (REQUIRED_FOR)
**Provenance:** University Physics Volume 2 — A voltmeter is placed in parallel and must have very high (ideally infinite) resistance so it does not alter the circuit; an ammeter is placed in series and must have very low (ideally zero) resistance for the same reason; an ohmmeter must never be connected to a live (energised) circuit [DEFINES] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC2.3: identify appropriate electrical instruments for the measurement of different electrical quantities [CURRICULUM_REQUIRES]
**Misconceptions targeting this assertion:** MIS-EL-INSTRUMENT-CONNECTION-CONFUSION-001

### EL-INSTRUMENT-OHMMETER-001

**Statement (v1, APPROVED):** An ohmmeter measures resistance, and must be used on a component that is isolated and de-energised.

**Direct prerequisites:** EL-CONCEPT-RESISTANCE-001 (STRONG)
**Direct dependents:** EL-INSTRUMENT-MULTIMETER-001; EL-INSTRUMENT-SELECT-001; EL-INSTRUMENT-CONTINUITY-TEST-001
**Curriculum mapping(s):** Identify appropriate electrical instruments for the measurement of different electrical quantities (REQUIRED_FOR); Electrical quantities (measurement): Resistance (REQUIRED_FOR); Identify appropriate electrical instruments for the measurement of different electrical quantities (REQUIRED_FOR)
**Provenance:** University Physics Volume 2 — A voltmeter is placed in parallel and must have very high (ideally infinite) resistance so it does not alter the circuit; an ammeter is placed in series and must have very low (ideally zero) resistance for the same reason; an ohmmeter must never be connected to a live (energised) circuit [DEFINES] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC2.3: identify appropriate electrical instruments for the measurement of different electrical quantities [CURRICULUM_REQUIRES]

### EL-INSTRUMENT-WATTMETER-001

**Statement (v1, APPROVED):** A wattmeter measures electrical power by simultaneously sensing the current through a load (as an ammeter does) and the voltage across it (as a voltmeter does), and computing their product.

**Direct prerequisites:** EL-CONCEPT-POWER-001 (STRONG)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Identify appropriate electrical instruments for the measurement of different electrical quantities (REQUIRED_FOR); Electrical quantities (measurement): Power (REQUIRED_FOR); Identify appropriate electrical instruments for the measurement of different electrical quantities (REQUIRED_FOR)
**Provenance:** City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC2.3: identify appropriate electrical instruments for the measurement of different electrical quantities [CURRICULUM_REQUIRES]

### EL-INSTRUMENT-ENERGY-METER-001

**Statement (v1, APPROVED):** An energy meter (kWh meter) measures the cumulative electrical energy consumed by a supply over time, by integrating measured power over time.

**Direct prerequisites:** EL-CONCEPT-ENERGY-001 (STRONG)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Identify appropriate electrical instruments for the measurement of different electrical quantities (REQUIRED_FOR); Electrical quantities (measurement): Energy (REQUIRED_FOR); Identify appropriate electrical instruments for the measurement of different electrical quantities (REQUIRED_FOR)
**Provenance:** City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC2.3: identify appropriate electrical instruments for the measurement of different electrical quantities [CURRICULUM_REQUIRES]

### EL-INSTRUMENT-MULTIMETER-001

**Statement (v1, APPROVED):** A multimeter is a single instrument that can be configured to measure voltage, current or resistance.

**Direct prerequisites:** EL-INSTRUMENT-VOLTMETER-001 (SUPPORTING); EL-INSTRUMENT-AMMETER-001 (SUPPORTING); EL-INSTRUMENT-OHMMETER-001 (SUPPORTING)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Identify appropriate electrical instruments for the measurement of different electrical quantities (REQUIRED_FOR); Identify appropriate electrical instruments for the measurement of different electrical quantities (REQUIRED_FOR)
**Provenance:** City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC2.3: identify appropriate electrical instruments for the measurement of different electrical quantities [CURRICULUM_REQUIRES]

### EL-POWER-RATING-001

**Statement (v1, APPROVED):** The power rating of an electrical device states the rate at which it is designed to convert electrical energy under normal operating conditions.

**Direct prerequisites:** EL-CONCEPT-POWER-001 (STRONG)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Identify and determine values of base and derived SI units which apply specifically to electrical quantities (SUPPORTS); Identify and determine values of base and derived SI units which apply specifically to electrical quantities (SUPPORTS)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, 9.5: electrical power and energy, P = VI and P = I^2 R [SUPPORTS] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC2.2: identify and determine values of base and derived SI units which apply specifically to electrical quantities [CURRICULUM_REQUIRES]

### EL-UNIT-KWH-001

**Statement (v1, APPROVED):** The kilowatt-hour (kWh) is a practical, non-SI unit of electrical energy, equal to the energy transferred by a one-kilowatt load running for one hour, commonly used for billing electricity usage.

**Direct prerequisites:** EL-UNIT-JOULE-001 (STRONG); EL-CONCEPT-ENERGY-001 (STRONG)
**Direct dependents:** EL-ENERGY-KWH-CALC-001
**Curriculum mapping(s):** Identify and determine values of base and derived SI units which apply specifically to electrical quantities (SUPPORTS); Identify and determine values of base and derived SI units which apply specifically to electrical quantities (SUPPORTS)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, 9.5: electrical power and energy, P = VI and P = I^2 R [SUPPORTS] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC2.2: identify and determine values of base and derived SI units which apply specifically to electrical quantities [CURRICULUM_REQUIRES]
**Misconceptions targeting this assertion:** MIS-EL-ENERGY-UNIT-CONFUSION-001

### EL-UNIT-BASE-VS-DERIVED-001

**Statement (v1, APPROVED):** The ampere is an SI base unit, while the volt, ohm, watt, joule and hertz are SI derived units formed from combinations of base units.

**Direct prerequisites:** EL-UNIT-AMPERE-001 (STRONG); EL-UNIT-VOLT-001 (STRONG)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Identify and use internationally recognised base and derived (SI) units of measurement (REQUIRED_FOR); Identify and use internationally recognised base and derived (SI) units of measurement (REQUIRED_FOR)
**Provenance:** The International System of Units (SI Brochure) — SI Brochure: table of SI derived units with special names, including the volt, ohm, watt and joule, and SI prefixes [DEFINES] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC2.1: identify and use internationally recognised base and derived (SI) units of measurement (Range: length, area, volume, mass, density, time, temperature, velocity) [CURRICULUM_REQUIRES]

### EL-UNIT-HERTZ-001

**Statement (v1, APPROVED):** The hertz (Hz) is the SI derived unit of frequency, equal to one cycle per second.

**Direct prerequisites:** (none — root assertion)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Identify and determine values of base and derived SI units which apply specifically to electrical quantities (REQUIRED_FOR); Electrical quantities (SI units): Frequency (REQUIRED_FOR); Identify and determine values of base and derived SI units which apply specifically to electrical quantities (REQUIRED_FOR)
**Provenance:** The International System of Units (SI Brochure) — SI Brochure: table of SI derived units with special names, including the volt, ohm, watt and joule, and SI prefixes [DEFINES] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC2.2: identify and determine values of base and derived SI units which apply specifically to electrical quantities [CURRICULUM_REQUIRES]

### EL-CONCEPT-FREQUENCY-001

**Statement (v1, APPROVED):** Frequency is the number of complete cycles of a repeating waveform that occur in one second.

**Direct prerequisites:** (none — root assertion)
**Direct dependents:** EL-CONCEPT-REACTANCE-001; EL-CIRCUIT-AC-SUPPLY-RECOGNITION-001; EL-WAVEFORM-FREQUENCY-PERIOD-RELATIONSHIP-001
**Curriculum mapping(s):** Identify and determine values of base and derived SI units which apply specifically to electrical quantities (REQUIRED_FOR); Electrical quantities (SI units): Frequency (REQUIRED_FOR); Characteristics of a sine-wave: Frequency (REQUIRED_FOR); Identify and determine values of base and derived SI units which apply specifically to electrical quantities (REQUIRED_FOR)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, Ch.13: magnetic flux and flux density (13.1 Faraday's Law); EMF; electric generators and the sinusoidal generated waveform (13.6) [DEFINES] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC2.2: identify and determine values of base and derived SI units which apply specifically to electrical quantities [CURRICULUM_REQUIRES]

### EL-CONCEPT-REACTANCE-001

**Statement (v1, APPROVED):** Reactance is the opposition to current flow in an AC circuit caused by inductance or capacitance, and unlike resistance its value depends on the supply frequency.

**Direct prerequisites:** EL-CONCEPT-RESISTANCE-001 (STRONG); EL-CONCEPT-FREQUENCY-001 (STRONG)
**Direct dependents:** EL-CONCEPT-IMPEDANCE-001; EL-CONCEPT-INDUCTIVE-REACTANCE-001; EL-CONCEPT-CAPACITIVE-REACTANCE-001; EL-CIRCUIT-COMPARE-AC-DC-BEHAVIOUR-001
**Curriculum mapping(s):** Identify and determine values of base and derived SI units which apply specifically to electrical quantities (REQUIRED_FOR); Identify and determine values of base and derived SI units which apply specifically to electrical quantities (REQUIRED_FOR)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, Ch.15: impedance, reactance, inductance, capacitance and power factor in AC circuits [DEFINES] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC2.2: identify and determine values of base and derived SI units which apply specifically to electrical quantities [CURRICULUM_REQUIRES]

### EL-CONCEPT-IMPEDANCE-001

**Statement (v1, APPROVED):** Impedance is the total opposition a circuit presents to the flow of alternating current, combining resistance and reactance; like resistance and reactance, it is measured in ohms.

**Direct prerequisites:** EL-CONCEPT-RESISTANCE-001 (REQUIRED); EL-CONCEPT-REACTANCE-001 (REQUIRED)
**Direct dependents:** EL-CONCEPT-POWER-FACTOR-001
**Curriculum mapping(s):** Identify and determine values of base and derived SI units which apply specifically to electrical quantities (REQUIRED_FOR); Electrical quantities (SI units): Impedance (REQUIRED_FOR); Identify and determine values of base and derived SI units which apply specifically to electrical quantities (REQUIRED_FOR)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, Ch.15: impedance, reactance, inductance, capacitance and power factor in AC circuits [DEFINES] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC2.2: identify and determine values of base and derived SI units which apply specifically to electrical quantities [CURRICULUM_REQUIRES]

### EL-UNIT-HENRY-001

**Statement (v1, APPROVED):** The henry (H) is the SI derived unit of inductance -- distinct from the ohm, the unit of inductive reactance.

**Direct prerequisites:** (none — root assertion)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Identify and determine values of base and derived SI units which apply specifically to electrical quantities (REQUIRED_FOR); Electrical quantities (SI units): Inductance and inductive reactance (REQUIRED_FOR); Identify and determine values of base and derived SI units which apply specifically to electrical quantities (REQUIRED_FOR)
**Provenance:** The International System of Units (SI Brochure) — SI Brochure: table of SI derived units with special names, including the volt, ohm, watt and joule, and SI prefixes [DEFINES] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC2.2: identify and determine values of base and derived SI units which apply specifically to electrical quantities [CURRICULUM_REQUIRES]

### EL-CONCEPT-INDUCTANCE-001

**Statement (v1, APPROVED):** Inductance is the property of a conductor or coil that opposes a change in current by storing energy in a magnetic field, measured in henries.

**Direct prerequisites:** (none — root assertion)
**Direct dependents:** EL-CONCEPT-INDUCTIVE-REACTANCE-001
**Curriculum mapping(s):** Identify and determine values of base and derived SI units which apply specifically to electrical quantities (REQUIRED_FOR); Electrical quantities (SI units): Inductance and inductive reactance (REQUIRED_FOR); Identify and determine values of base and derived SI units which apply specifically to electrical quantities (REQUIRED_FOR)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, Ch.15: impedance, reactance, inductance, capacitance and power factor in AC circuits [DEFINES] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC2.2: identify and determine values of base and derived SI units which apply specifically to electrical quantities [CURRICULUM_REQUIRES]

### EL-CONCEPT-INDUCTIVE-REACTANCE-001

**Statement (v1, APPROVED):** Inductive reactance is the opposition an inductor presents to alternating current; it increases as supply frequency increases, and is measured in ohms (not henries, the unit of inductance itself).

**Direct prerequisites:** EL-CONCEPT-INDUCTANCE-001 (REQUIRED); EL-CONCEPT-REACTANCE-001 (REQUIRED)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Identify and determine values of base and derived SI units which apply specifically to electrical quantities (REQUIRED_FOR); Electrical quantities (SI units): Inductance and inductive reactance (REQUIRED_FOR); Identify and determine values of base and derived SI units which apply specifically to electrical quantities (REQUIRED_FOR)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, Ch.15: impedance, reactance, inductance, capacitance and power factor in AC circuits [DEFINES] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC2.2: identify and determine values of base and derived SI units which apply specifically to electrical quantities [CURRICULUM_REQUIRES]

### EL-UNIT-FARAD-001

**Statement (v1, APPROVED):** The farad (F) is the SI derived unit of capacitance -- distinct from the ohm, the unit of capacitive reactance.

**Direct prerequisites:** (none — root assertion)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Identify and determine values of base and derived SI units which apply specifically to electrical quantities (REQUIRED_FOR); Electrical quantities (SI units): Capacitance and capacitive reactance (REQUIRED_FOR); Identify and determine values of base and derived SI units which apply specifically to electrical quantities (REQUIRED_FOR)
**Provenance:** The International System of Units (SI Brochure) — SI Brochure: table of SI derived units with special names, including the volt, ohm, watt and joule, and SI prefixes [DEFINES] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC2.2: identify and determine values of base and derived SI units which apply specifically to electrical quantities [CURRICULUM_REQUIRES]

### EL-CONCEPT-CAPACITANCE-001

**Statement (v1, APPROVED):** Capacitance is the property of a component that describes its ability to store electrical charge in an electric field, measured in farads.

**Direct prerequisites:** (none — root assertion)
**Direct dependents:** EL-CONCEPT-CAPACITIVE-REACTANCE-001; EL-COMPONENT-CAPACITOR-001
**Curriculum mapping(s):** Identify and determine values of base and derived SI units which apply specifically to electrical quantities (REQUIRED_FOR); Electrical quantities (SI units): Capacitance and capacitive reactance (REQUIRED_FOR); Electronic components and devices: Capacitors (REQUIRED_FOR); Identify and determine values of base and derived SI units which apply specifically to electrical quantities (REQUIRED_FOR)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, Ch.15: impedance, reactance, inductance, capacitance and power factor in AC circuits [DEFINES] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC2.2: identify and determine values of base and derived SI units which apply specifically to electrical quantities [CURRICULUM_REQUIRES]

### EL-CONCEPT-CAPACITIVE-REACTANCE-001

**Statement (v1, APPROVED):** Capacitive reactance is the opposition a capacitor presents to alternating current; it decreases as supply frequency increases (the opposite frequency behaviour to inductive reactance), and is measured in ohms (not farads, the unit of capacitance itself).

**Direct prerequisites:** EL-CONCEPT-CAPACITANCE-001 (REQUIRED); EL-CONCEPT-REACTANCE-001 (REQUIRED)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Identify and determine values of base and derived SI units which apply specifically to electrical quantities (REQUIRED_FOR); Electrical quantities (SI units): Capacitance and capacitive reactance (REQUIRED_FOR); Identify and determine values of base and derived SI units which apply specifically to electrical quantities (REQUIRED_FOR)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, Ch.15: impedance, reactance, inductance, capacitance and power factor in AC circuits [DEFINES] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC2.2: identify and determine values of base and derived SI units which apply specifically to electrical quantities [CURRICULUM_REQUIRES]

### EL-CONCEPT-POWER-FACTOR-001

**Statement (v1, APPROVED):** Power factor is the ratio of real (true) power to apparent power in an AC circuit; for a sinusoidal single-frequency supply, this ratio equals the cosine of the phase angle between voltage and current.

**Direct prerequisites:** EL-CONCEPT-IMPEDANCE-001 (STRONG); EL-CONCEPT-POWER-001 (STRONG)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Identify and determine values of base and derived SI units which apply specifically to electrical quantities (REQUIRED_FOR); Electrical quantities (SI units): Power factor (REQUIRED_FOR); Identify and determine values of base and derived SI units which apply specifically to electrical quantities (REQUIRED_FOR)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, Ch.15: impedance, reactance, inductance, capacitance and power factor in AC circuits [DEFINES] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC2.2: identify and determine values of base and derived SI units which apply specifically to electrical quantities [CURRICULUM_REQUIRES]

### EL-CONCEPT-ELECTRICAL-EFFICIENCY-001

**Statement (v1, APPROVED):** The efficiency of an electrical device is the ratio of useful power output to electrical power input.

**Direct prerequisites:** FP-CONCEPT-EFFICIENCY-001 (REQUIRED); EL-CONCEPT-POWER-001 (REQUIRED)
**Direct dependents:** EL-CALC-ELECTRICAL-EFFICIENCY-001
**Curriculum mapping(s):** Describe the main principles of force, work, energy, power and efficiency and their inter-relationships (REQUIRED_FOR); Describe the main principles of the following and their inter-relationships: force, work, energy (kinetic and potential), power, efficiency (REQUIRED_FOR)
**Provenance:** University Physics Volume 1 — University Physics Volume 1, Ch.7.4: power as the rate at which work is done or energy is transferred, P = W / t [SUPPORTS] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC3.3: describe the main principles of force, work, energy, power and efficiency and their inter-relationships [CURRICULUM_REQUIRES]

### EL-CALC-ELECTRICAL-EFFICIENCY-001

**Statement (v1, APPROVED):** Calculate the efficiency of an electrical device as a percentage from its useful power output and its power input.

**Direct prerequisites:** EL-CONCEPT-ELECTRICAL-EFFICIENCY-001 (REQUIRED); FM-ARITH-PERCENTAGE-001 (REQUIRED); FM-ALG-SUBSTITUTION-001 (REQUIRED)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Calculate values of mechanical energy, power and efficiency (REQUIRED_FOR); Calculate values of mechanical energy, power and efficiency (REQUIRED_FOR)
**Provenance:** University Physics Volume 1 — University Physics Volume 1, Ch.7.4: power as the rate at which work is done or energy is transferred, P = W / t [SUPPORTS] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC3.4: calculate values of mechanical energy, power and efficiency [CURRICULUM_REQUIRES]

### EL-CONCEPT-ELECTRON-THEORY-001

**Statement (v1, APPROVED):** Electric current in a conductor is the flow of free electrons, driven by a potential difference across the conductor.

**Direct prerequisites:** EL-CONCEPT-CURRENT-001 (STRONG); EL-CONCEPT-ATOMIC-CHARGE-STRUCTURE-001 (STRONG)
**Direct dependents:** EL-CONCEPT-CONDUCTOR-001; EL-CONCEPT-INSULATOR-001
**Curriculum mapping(s):** Describe the basic principles of electron theory (REQUIRED_FOR); Describe the basic principles of electron theory (REQUIRED_FOR)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, Ch.9: electric current as the flow of free charge carriers; conductors, insulators; thermal/chemical effects of current [DEFINES] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC4.1: describe the basic principles of electron theory [CURRICULUM_REQUIRES]
**Misconceptions targeting this assertion:** MIS-EL-ELECTRON-CURRENT-DIRECTION-CONFUSION-001

### EL-CONCEPT-CONDUCTOR-001

**Statement (v1, APPROVED):** A conductor is a material containing many free electrons, which allows electric current to flow through it easily.

**Direct prerequisites:** EL-CONCEPT-ELECTRON-THEORY-001 (STRONG)
**Direct dependents:** EL-MATERIAL-CONDUCTOR-INSULATOR-EXAMPLES-001
**Curriculum mapping(s):** Identify and distinguish between materials which are good conductors and insulators (REQUIRED_FOR); Identify and distinguish between materials which are good conductors and insulators (REQUIRED_FOR)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, Ch.9: electric current as the flow of free charge carriers; conductors, insulators; thermal/chemical effects of current [DEFINES] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC4.2: identify and distinguish between materials which are good conductors and insulators [CURRICULUM_REQUIRES]
**Misconceptions targeting this assertion:** MIS-EL-CONDUCTOR-INSULATOR-CONFUSION-001

### EL-CONCEPT-INSULATOR-001

**Statement (v1, APPROVED):** An insulator is a material with very few free electrons, which strongly opposes the flow of electric current.

**Direct prerequisites:** EL-CONCEPT-ELECTRON-THEORY-001 (STRONG)
**Direct dependents:** EL-MATERIAL-CONDUCTOR-INSULATOR-EXAMPLES-001; EL-INSULATOR-BREAKDOWN-001
**Curriculum mapping(s):** Identify and distinguish between materials which are good conductors and insulators (REQUIRED_FOR); Identify and distinguish between materials which are good conductors and insulators (REQUIRED_FOR)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, Ch.9: electric current as the flow of free charge carriers; conductors, insulators; thermal/chemical effects of current [DEFINES] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC4.2: identify and distinguish between materials which are good conductors and insulators [CURRICULUM_REQUIRES]
**Misconceptions targeting this assertion:** MIS-EL-CONDUCTOR-INSULATOR-CONFUSION-001

### EL-RESISTIVITY-RELATIONSHIP-001

**Statement (v1, APPROVED):** The resistance of a conductor is related to its resistivity, length and cross-sectional area by R = rho times L divided by A.

**Direct prerequisites:** EL-CONCEPT-RESISTIVITY-001 (REQUIRED); EL-CONCEPT-RESISTANCE-001 (REQUIRED)
**Direct dependents:** EL-CONDUCTOR-RESISTANCE-FACTORS-001; EL-RESISTIVITY-LENGTH-EFFECT-001; EL-RESISTIVITY-AREA-EFFECT-001
**Curriculum mapping(s):** Describe what is meant by resistance and resistivity in relation to electrical circuits (REQUIRED_FOR); Describe what is meant by resistance and resistivity in relation to electrical circuits (REQUIRED_FOR)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, 9.3: resistance and resistivity, and R = rho L / A [DEFINES] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC4.3: describe what is meant by resistance and resistivity in relation to electrical circuits [CURRICULUM_REQUIRES]

### EL-OHM-RELATIONSHIP-001

**Statement (v1, APPROVED):** For a component obeying Ohm's law, potential difference, current and resistance are related by V = I times R.

**Direct prerequisites:** EL-CONCEPT-VOLTAGE-001 (REQUIRED); EL-CONCEPT-CURRENT-001 (REQUIRED); EL-CONCEPT-RESISTANCE-001 (REQUIRED)
**Direct dependents:** EL-OHM-PROPORTIONALITY-001; EL-OHM-REARRANGE-001; EL-OHM-SOLVE-V-001; EL-VOLTAGE-DROP-001; EL-OHM-SELECT-RELATIONSHIP-001; EL-CIRCUIT-COMPARE-AC-DC-BEHAVIOUR-001; EL-CIRCUIT-ZERO-RESISTANCE-INTERPRETATION-001; EL-CIRCUIT-OPEN-CIRCUIT-RESISTANCE-INTERPRETATION-001
**Curriculum mapping(s):** Explain the relationship between current, voltage and resistance in parallel and series D.C. circuits (REQUIRED_FOR); Explain the relationship between current, voltage and resistance in parallel and series D.C. circuits (REQUIRED_FOR)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, 9.4: Ohm's law, V = IR, and voltage/potential difference [DEFINES] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC4.4: explain the relationship between current, voltage and resistance in parallel and series D.C. circuits [CURRICULUM_REQUIRES]
**Misconceptions targeting this assertion:** MIS-EL-OHM-UNRELATED-SYMBOLS-001

### EL-OHM-PROPORTIONALITY-001

**Statement (v1, APPROVED):** At constant resistance, current is directly proportional to voltage; at constant voltage, current is inversely proportional to resistance.

**Direct prerequisites:** EL-OHM-RELATIONSHIP-001 (REQUIRED); FM-ALG-PROPORTION-DIRECT-001 (REQUIRED); FM-ALG-PROPORTION-INVERSE-001 (REQUIRED)
**Direct dependents:** EL-SERIES-PREDICT-ADD-RESISTOR-001; EL-PARALLEL-PREDICT-ADD-RESISTOR-001
**Curriculum mapping(s):** Explain the relationship between current, voltage and resistance in parallel and series D.C. circuits (REQUIRED_FOR); Explain the relationship between current, voltage and resistance in parallel and series D.C. circuits (REQUIRED_FOR)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, 9.4: Ohm's law, V = IR, and voltage/potential difference [SUPPORTS] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC4.4: explain the relationship between current, voltage and resistance in parallel and series D.C. circuits [CURRICULUM_REQUIRES]
**Misconceptions targeting this assertion:** MIS-FM-PROPORTION-DIRECTION-CONFUSION-001

### EL-OHM-REARRANGE-001

**Statement (v1, APPROVED):** Rearrange V = I times R algebraically to make voltage, current or resistance the subject.

**Direct prerequisites:** EL-OHM-RELATIONSHIP-001 (REQUIRED); FM-ALG-TRANSPOSE-MULT-001 (REQUIRED)
**Direct dependents:** EL-OHM-SOLVE-I-001; EL-OHM-SOLVE-R-001
**Curriculum mapping(s):** Calculate the values of current, voltage and resistance in parallel and series D.C. circuits (REQUIRED_FOR); Identify and apply appropriate mathematical principles which are relevant to electrical work tasks (EXEMPLIFIES); Calculate the values of current, voltage and resistance in parallel and series D.C. circuits (REQUIRED_FOR); Identify and apply appropriate mathematical principles which are relevant to electrical work tasks (EXEMPLIFIES)
**Provenance:** City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC4.5: calculate the values of current, voltage and resistance in parallel and series D.C. circuits [CURRICULUM_REQUIRES]
**Misconceptions targeting this assertion:** MIS-EL-OHM-REARRANGE-ERROR-001

### EL-OHM-SOLVE-V-001

**Statement (v1, APPROVED):** Calculate an unknown voltage from known current and resistance using V = I times R.

**Direct prerequisites:** EL-OHM-RELATIONSHIP-001 (REQUIRED); FM-ALG-SUBSTITUTION-001 (REQUIRED); FM-NUM-SI-PREFIX-CONVERT-001 (STRONG)
**Direct dependents:** EL-SERIES-VOLTAGE-CALC-001
**Curriculum mapping(s):** Calculate the values of current, voltage and resistance in parallel and series D.C. circuits (REQUIRED_FOR); Identify and apply appropriate mathematical principles which are relevant to electrical work tasks (EXEMPLIFIES); Calculate the values of current, voltage and resistance in parallel and series D.C. circuits (REQUIRED_FOR); Identify and apply appropriate mathematical principles which are relevant to electrical work tasks (EXEMPLIFIES)
**Provenance:** City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC4.5: calculate the values of current, voltage and resistance in parallel and series D.C. circuits [CURRICULUM_REQUIRES]
**Misconceptions targeting this assertion:** MIS-EL-SI-PREFIX-ERROR-001

### EL-OHM-SOLVE-I-001

**Statement (v1, APPROVED):** Calculate an unknown current from known voltage and resistance by rearranging and applying V = I times R.

**Direct prerequisites:** EL-OHM-REARRANGE-001 (REQUIRED); FM-ALG-SUBSTITUTION-001 (REQUIRED); FM-NUM-SI-PREFIX-CONVERT-001 (STRONG)
**Direct dependents:** EL-PARALLEL-CURRENT-CALC-001; EL-CIRCUIT-SUPPLY-CURRENT-SERIES-001; EL-CIRCUIT-SUPPLY-CURRENT-PARALLEL-001
**Curriculum mapping(s):** Calculate the values of current, voltage and resistance in parallel and series D.C. circuits (REQUIRED_FOR); Identify and apply appropriate mathematical principles which are relevant to electrical work tasks (EXEMPLIFIES); Calculate the values of current, voltage and resistance in parallel and series D.C. circuits (REQUIRED_FOR); Identify and apply appropriate mathematical principles which are relevant to electrical work tasks (EXEMPLIFIES)
**Provenance:** City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC4.5: calculate the values of current, voltage and resistance in parallel and series D.C. circuits [CURRICULUM_REQUIRES]
**Misconceptions targeting this assertion:** MIS-EL-OHM-WRONG-OPERATION-001, MIS-EL-SI-PREFIX-ERROR-001

### EL-OHM-SOLVE-R-001

**Statement (v1, APPROVED):** Calculate an unknown resistance from known voltage and current by rearranging and applying V = I times R.

**Direct prerequisites:** EL-OHM-REARRANGE-001 (REQUIRED); FM-ALG-SUBSTITUTION-001 (REQUIRED); FM-NUM-SI-PREFIX-CONVERT-001 (STRONG)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Calculate the values of current, voltage and resistance in parallel and series D.C. circuits (REQUIRED_FOR); Identify and apply appropriate mathematical principles which are relevant to electrical work tasks (EXEMPLIFIES); Calculate the values of current, voltage and resistance in parallel and series D.C. circuits (REQUIRED_FOR); Identify and apply appropriate mathematical principles which are relevant to electrical work tasks (EXEMPLIFIES)
**Provenance:** City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC4.5: calculate the values of current, voltage and resistance in parallel and series D.C. circuits [CURRICULUM_REQUIRES]
**Misconceptions targeting this assertion:** MIS-EL-OHM-WRONG-OPERATION-001, MIS-EL-SI-PREFIX-ERROR-001

### EL-CIRCUIT-SERIES-STRUCTURE-001

**Statement (v1, APPROVED):** In a series circuit, components are connected end-to-end so that there is only one path for current to flow.

**Direct prerequisites:** (none — root assertion)
**Direct dependents:** EL-SERIES-CURRENT-001; EL-SERIES-RESISTANCE-001; EL-SERIES-VOLTAGE-001; EL-CIRCUIT-SELECT-CONFIGURATION-001; EL-CIRCUIT-MIXED-SERIES-PARALLEL-RECOGNITION-001; EL-SERIES-PREDICT-OPEN-001
**Curriculum mapping(s):** Explain the relationship between current, voltage and resistance in parallel and series D.C. circuits (REQUIRED_FOR); Explain the relationship between current, voltage and resistance in parallel and series D.C. circuits (REQUIRED_FOR)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, 10.2: equivalent resistance for resistors in series and in parallel [DEFINES] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC4.4: explain the relationship between current, voltage and resistance in parallel and series D.C. circuits [CURRICULUM_REQUIRES]
**Misconceptions targeting this assertion:** MIS-EL-SERIES-PARALLEL-CONFUSION-001

### EL-SERIES-CURRENT-001

**Statement (v1, APPROVED):** In a series circuit, the same current flows through every component.

**Direct prerequisites:** EL-CIRCUIT-SERIES-STRUCTURE-001 (REQUIRED); EL-CONCEPT-CURRENT-001 (STRONG)
**Direct dependents:** EL-CIRCUIT-COMPARE-CURRENT-001; EL-SERIES-PREDICT-OPEN-001; EL-SERIES-POWER-CALC-001
**Curriculum mapping(s):** Explain the relationship between current, voltage and resistance in parallel and series D.C. circuits (REQUIRED_FOR); Explain the relationship between current, voltage and resistance in parallel and series D.C. circuits (REQUIRED_FOR)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, 10.2: equivalent resistance for resistors in series and in parallel [DEFINES] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC4.4: explain the relationship between current, voltage and resistance in parallel and series D.C. circuits [CURRICULUM_REQUIRES]

### EL-SERIES-RESISTANCE-001

**Statement (v1, APPROVED):** The total resistance of resistors connected in series is the sum of the individual resistances: RT = R1 + R2 + ...

**Direct prerequisites:** EL-CIRCUIT-SERIES-STRUCTURE-001 (REQUIRED); EL-CONCEPT-RESISTANCE-001 (REQUIRED)
**Direct dependents:** EL-SERIES-RESISTANCE-CALC-001; EL-CIRCUIT-COMPARE-RESISTANCE-001; EL-SERIES-PREDICT-ADD-RESISTOR-001
**Curriculum mapping(s):** Explain the relationship between current, voltage and resistance in parallel and series D.C. circuits (REQUIRED_FOR); Explain the relationship between current, voltage and resistance in parallel and series D.C. circuits (REQUIRED_FOR)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, 10.2: equivalent resistance for resistors in series and in parallel [DEFINES] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC4.4: explain the relationship between current, voltage and resistance in parallel and series D.C. circuits [CURRICULUM_REQUIRES]

### EL-SERIES-RESISTANCE-CALC-001

**Statement (v1, APPROVED):** Calculate the total resistance of resistors connected in series.

**Direct prerequisites:** EL-SERIES-RESISTANCE-001 (REQUIRED); FM-ALG-SUBSTITUTION-001 (REQUIRED)
**Direct dependents:** EL-INTERPRET-SERIES-RESULT-001; EL-CIRCUIT-SUPPLY-CURRENT-SERIES-001
**Curriculum mapping(s):** Calculate the values of current, voltage and resistance in parallel and series D.C. circuits (REQUIRED_FOR); Identify and apply appropriate mathematical principles which are relevant to electrical work tasks (EXEMPLIFIES); Calculate the values of current, voltage and resistance in parallel and series D.C. circuits (REQUIRED_FOR); Identify and apply appropriate mathematical principles which are relevant to electrical work tasks (EXEMPLIFIES)
**Provenance:** City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC4.5: calculate the values of current, voltage and resistance in parallel and series D.C. circuits [CURRICULUM_REQUIRES]

### EL-INTERPRET-SERIES-RESULT-001

**Statement (v1, APPROVED):** A calculated total resistance for resistors in series that is less than the largest individual resistance indicates a calculation error, since total series resistance is always at least as great as the largest individual resistance.

**Direct prerequisites:** EL-SERIES-RESISTANCE-CALC-001 (STRONG)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Calculate the values of current, voltage and resistance in parallel and series D.C. circuits (SUPPORTS); Calculate the values of current, voltage and resistance in parallel and series D.C. circuits (SUPPORTS)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, 10.2: equivalent resistance for resistors in series and in parallel [SUPPORTS]

### EL-VOLTAGE-DROP-001

**Statement (v1, APPROVED):** Voltage drop is the reduction in potential difference across a component or conductor caused by current flowing through its resistance.

**Direct prerequisites:** EL-OHM-RELATIONSHIP-001 (STRONG)
**Direct dependents:** EL-SERIES-VOLTAGE-001; EL-CIRCUIT-ZERO-RESISTANCE-INTERPRETATION-001
**Curriculum mapping(s):** State what is meant by the term voltage drop in relation to electrical circuits (REQUIRED_FOR); State what is meant by the term voltage drop in relation to electrical circuits (REQUIRED_FOR)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, 9.4: Ohm's law, V = IR, and voltage/potential difference [DEFINES] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC4.7: state what is meant by the term voltage drop in relation to electrical circuits [CURRICULUM_REQUIRES]
**Misconceptions targeting this assertion:** MIS-EL-VOLTAGE-DROP-MISUNDERSTANDING-001

### EL-SERIES-VOLTAGE-001

**Statement (v1, APPROVED):** In a series circuit, the supply voltage is shared between the components as individual voltage drops that sum to the supply voltage.

**Direct prerequisites:** EL-VOLTAGE-DROP-001 (REQUIRED); EL-CIRCUIT-SERIES-STRUCTURE-001 (REQUIRED); FM-ALG-TRANSPOSE-ADD-001 (STRONG)
**Direct dependents:** EL-SERIES-VOLTAGE-CALC-001; EL-CIRCUIT-COMPARE-VOLTAGE-001; EL-SERIES-DOMINANT-RESISTOR-001; EL-SERIES-VOLTAGE-DIVIDER-001
**Curriculum mapping(s):** Explain the relationship between current, voltage and resistance in parallel and series D.C. circuits (REQUIRED_FOR); Explain the relationship between current, voltage and resistance in parallel and series D.C. circuits (REQUIRED_FOR)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, 10.2: equivalent resistance for resistors in series and in parallel [DEFINES] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC4.4: explain the relationship between current, voltage and resistance in parallel and series D.C. circuits [CURRICULUM_REQUIRES]
**Misconceptions targeting this assertion:** MIS-EL-VOLTAGE-DROP-MISUNDERSTANDING-001

### EL-SERIES-VOLTAGE-CALC-001

**Statement (v1, APPROVED):** Calculate an individual voltage drop across a component in a series circuit.

**Direct prerequisites:** EL-SERIES-VOLTAGE-001 (REQUIRED); EL-OHM-SOLVE-V-001 (REQUIRED)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Calculate the values of current, voltage and resistance in parallel and series D.C. circuits (REQUIRED_FOR); Identify and apply appropriate mathematical principles which are relevant to electrical work tasks (EXEMPLIFIES); Calculate the values of current, voltage and resistance in parallel and series D.C. circuits (REQUIRED_FOR); Identify and apply appropriate mathematical principles which are relevant to electrical work tasks (EXEMPLIFIES)
**Provenance:** City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC4.5: calculate the values of current, voltage and resistance in parallel and series D.C. circuits [CURRICULUM_REQUIRES]

### EL-CIRCUIT-PARALLEL-STRUCTURE-001

**Statement (v1, APPROVED):** In a parallel circuit, components are connected between the same two points, providing more than one path for current to flow.

**Direct prerequisites:** (none — root assertion)
**Direct dependents:** EL-PARALLEL-VOLTAGE-001; EL-PARALLEL-CURRENT-001; EL-PARALLEL-RESISTANCE-001; EL-CIRCUIT-SELECT-CONFIGURATION-001; EL-CIRCUIT-MIXED-SERIES-PARALLEL-RECOGNITION-001; EL-PARALLEL-PREDICT-OPEN-001
**Curriculum mapping(s):** Explain the relationship between current, voltage and resistance in parallel and series D.C. circuits (REQUIRED_FOR); Explain the relationship between current, voltage and resistance in parallel and series D.C. circuits (REQUIRED_FOR)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, 10.2: equivalent resistance for resistors in series and in parallel [DEFINES] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC4.4: explain the relationship between current, voltage and resistance in parallel and series D.C. circuits [CURRICULUM_REQUIRES]
**Misconceptions targeting this assertion:** MIS-EL-SERIES-PARALLEL-CONFUSION-001

### EL-PARALLEL-VOLTAGE-001

**Statement (v1, APPROVED):** In a parallel circuit, the potential difference is the same across every branch.

**Direct prerequisites:** EL-CIRCUIT-PARALLEL-STRUCTURE-001 (REQUIRED); EL-CONCEPT-VOLTAGE-001 (STRONG)
**Direct dependents:** EL-CIRCUIT-COMPARE-VOLTAGE-001; EL-PARALLEL-PREDICT-OPEN-001; EL-PARALLEL-POWER-CALC-001
**Curriculum mapping(s):** Explain the relationship between current, voltage and resistance in parallel and series D.C. circuits (REQUIRED_FOR); Explain the relationship between current, voltage and resistance in parallel and series D.C. circuits (REQUIRED_FOR)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, 10.2: equivalent resistance for resistors in series and in parallel [DEFINES] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC4.4: explain the relationship between current, voltage and resistance in parallel and series D.C. circuits [CURRICULUM_REQUIRES]

### EL-PARALLEL-CURRENT-001

**Statement (v1, APPROVED):** In a parallel circuit, the supply current divides between the branches, and the branch currents sum to the total current.

**Direct prerequisites:** EL-CIRCUIT-PARALLEL-STRUCTURE-001 (REQUIRED); EL-CONCEPT-CURRENT-001 (REQUIRED); FM-ALG-TRANSPOSE-ADD-001 (STRONG)
**Direct dependents:** EL-PARALLEL-CURRENT-CALC-001; EL-CIRCUIT-COMPARE-CURRENT-001; EL-PARALLEL-DOMINANT-RESISTOR-001; EL-PARALLEL-CURRENT-DIVIDER-001
**Curriculum mapping(s):** Explain the relationship between current, voltage and resistance in parallel and series D.C. circuits (REQUIRED_FOR); Explain the relationship between current, voltage and resistance in parallel and series D.C. circuits (REQUIRED_FOR)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, 10.2: equivalent resistance for resistors in series and in parallel [DEFINES] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC4.4: explain the relationship between current, voltage and resistance in parallel and series D.C. circuits [CURRICULUM_REQUIRES]

### EL-PARALLEL-RESISTANCE-001

**Statement (v1, APPROVED):** The reciprocal of the total resistance of resistors connected in parallel equals the sum of the reciprocals of the individual branch resistances.

**Direct prerequisites:** EL-CIRCUIT-PARALLEL-STRUCTURE-001 (REQUIRED); EL-CONCEPT-RESISTANCE-001 (REQUIRED); FM-ARITH-RECIPROCAL-001 (REQUIRED)
**Direct dependents:** EL-PARALLEL-RESISTANCE-CALC-001; EL-CIRCUIT-COMPARE-RESISTANCE-001; EL-PARALLEL-PREDICT-ADD-RESISTOR-001
**Curriculum mapping(s):** Explain the relationship between current, voltage and resistance in parallel and series D.C. circuits (REQUIRED_FOR); Explain the relationship between current, voltage and resistance in parallel and series D.C. circuits (REQUIRED_FOR)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, 10.2: equivalent resistance for resistors in series and in parallel [DEFINES] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC4.4: explain the relationship between current, voltage and resistance in parallel and series D.C. circuits [CURRICULUM_REQUIRES]
**Misconceptions targeting this assertion:** MIS-EL-PARALLEL-RESISTANCE-ADDITION-001

### EL-PARALLEL-RESISTANCE-CALC-001

**Statement (v1, APPROVED):** Calculate the total resistance of resistors connected in parallel.

**Direct prerequisites:** EL-PARALLEL-RESISTANCE-001 (REQUIRED); FM-ARITH-RECIPROCAL-SUM-001 (REQUIRED); FM-ARITH-RECIPROCAL-INVERT-001 (REQUIRED); FM-ALG-TRANSPOSE-ADD-001 (REQUIRED)
**Direct dependents:** EL-INTERPRET-PARALLEL-RESULT-001; EL-CIRCUIT-SUPPLY-CURRENT-PARALLEL-001
**Curriculum mapping(s):** Calculate the values of current, voltage and resistance in parallel and series D.C. circuits (REQUIRED_FOR); Identify and apply appropriate mathematical principles which are relevant to electrical work tasks (EXEMPLIFIES); Calculate the values of current, voltage and resistance in parallel and series D.C. circuits (REQUIRED_FOR); Identify and apply appropriate mathematical principles which are relevant to electrical work tasks (EXEMPLIFIES)
**Provenance:** City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC4.5: calculate the values of current, voltage and resistance in parallel and series D.C. circuits [CURRICULUM_REQUIRES] | University Physics Volume 2 — University Physics Volume 2, 10.2: equivalent resistance for resistors in series and in parallel [SUPPORTS]
**Misconceptions targeting this assertion:** MIS-EL-PARALLEL-RESISTANCE-ADDITION-001, MIS-EL-RECIPROCAL-FORGOTTEN-INVERT-001

### EL-INTERPRET-PARALLEL-RESULT-001

**Statement (v1, APPROVED):** A calculated total resistance for resistors in parallel that is greater than the smallest branch resistance indicates a calculation error, since total parallel resistance is always less than the smallest branch resistance.

**Direct prerequisites:** EL-PARALLEL-RESISTANCE-CALC-001 (STRONG)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Calculate the values of current, voltage and resistance in parallel and series D.C. circuits (SUPPORTS); Calculate the values of current, voltage and resistance in parallel and series D.C. circuits (SUPPORTS)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, 10.2: equivalent resistance for resistors in series and in parallel [SUPPORTS]

### EL-PARALLEL-CURRENT-CALC-001

**Statement (v1, APPROVED):** Calculate an individual branch current in a parallel circuit.

**Direct prerequisites:** EL-PARALLEL-CURRENT-001 (REQUIRED); EL-OHM-SOLVE-I-001 (REQUIRED)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Calculate the values of current, voltage and resistance in parallel and series D.C. circuits (REQUIRED_FOR); Identify and apply appropriate mathematical principles which are relevant to electrical work tasks (EXEMPLIFIES); Calculate the values of current, voltage and resistance in parallel and series D.C. circuits (REQUIRED_FOR); Identify and apply appropriate mathematical principles which are relevant to electrical work tasks (EXEMPLIFIES)
**Provenance:** City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC4.5: calculate the values of current, voltage and resistance in parallel and series D.C. circuits [CURRICULUM_REQUIRES]

### EL-POWER-RELATIONSHIP-001

**Statement (v1, APPROVED):** Electrical power is related to voltage and current by P = V times I.

**Direct prerequisites:** EL-CONCEPT-POWER-001 (REQUIRED); EL-CONCEPT-VOLTAGE-001 (REQUIRED); EL-CONCEPT-CURRENT-001 (REQUIRED)
**Direct dependents:** EL-POWER-REARRANGE-001; EL-POWER-SOLVE-001
**Curriculum mapping(s):** Calculate values of power in parallel and series D.C. circuits (REQUIRED_FOR); Calculate values of power in parallel and series D.C. circuits (REQUIRED_FOR)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, 9.5: electrical power and energy, P = VI and P = I^2 R [DEFINES] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC4.6: calculate values of power in parallel and series D.C. circuits [CURRICULUM_REQUIRES]

### EL-POWER-REARRANGE-001

**Statement (v1, APPROVED):** Rearrange P = V times I algebraically to make voltage or current the subject.

**Direct prerequisites:** EL-POWER-RELATIONSHIP-001 (REQUIRED); FM-ALG-TRANSPOSE-MULT-001 (REQUIRED)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Calculate values of power in parallel and series D.C. circuits (REQUIRED_FOR); Identify and apply appropriate mathematical principles which are relevant to electrical work tasks (EXEMPLIFIES); Calculate values of power in parallel and series D.C. circuits (REQUIRED_FOR); Identify and apply appropriate mathematical principles which are relevant to electrical work tasks (EXEMPLIFIES)
**Provenance:** City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC4.6: calculate values of power in parallel and series D.C. circuits [CURRICULUM_REQUIRES]
**Misconceptions targeting this assertion:** MIS-EL-OHM-REARRANGE-ERROR-001

### EL-POWER-SOLVE-001

**Statement (v1, APPROVED):** Calculate electrical power from known voltage and current using P = V times I.

**Direct prerequisites:** EL-POWER-RELATIONSHIP-001 (REQUIRED); FM-ALG-SUBSTITUTION-001 (REQUIRED)
**Direct dependents:** EL-CIRCUIT-POWER-TOTAL-001
**Curriculum mapping(s):** Calculate values of power in parallel and series D.C. circuits (REQUIRED_FOR); Identify and apply appropriate mathematical principles which are relevant to electrical work tasks (EXEMPLIFIES); Calculate values of power in parallel and series D.C. circuits (REQUIRED_FOR); Identify and apply appropriate mathematical principles which are relevant to electrical work tasks (EXEMPLIFIES)
**Provenance:** City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC4.6: calculate values of power in parallel and series D.C. circuits [CURRICULUM_REQUIRES]

### EL-POWER-DERIVED-VIR-001

**Statement (v1, APPROVED):** Electrical power can also be found from current and resistance alone, since combining P = V times I with V = I times R gives P = I squared times R.

**Direct prerequisites:** (none — root assertion)
**Direct dependents:** EL-POWER-SOLVE-IR-001; EL-SERIES-DOMINANT-RESISTOR-001
**Curriculum mapping(s):** Calculate values of power in parallel and series D.C. circuits (REQUIRED_FOR); Calculate values of power in parallel and series D.C. circuits (REQUIRED_FOR)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, 9.5: electrical power and energy, P = VI and P = I^2 R [SUPPORTS]

### EL-POWER-SOLVE-IR-001

**Statement (v1, APPROVED):** Calculate electrical power from known current and resistance using P = I squared times R.

**Direct prerequisites:** EL-POWER-DERIVED-VIR-001 (REQUIRED); FM-ALG-SUBSTITUTION-001 (REQUIRED)
**Direct dependents:** EL-THERMAL-EFFECT-FACTORS-001; EL-SERIES-POWER-CALC-001
**Curriculum mapping(s):** Calculate values of power in parallel and series D.C. circuits (REQUIRED_FOR); Identify and apply appropriate mathematical principles which are relevant to electrical work tasks (EXEMPLIFIES); Calculate values of power in parallel and series D.C. circuits (REQUIRED_FOR); Identify and apply appropriate mathematical principles which are relevant to electrical work tasks (EXEMPLIFIES)
**Provenance:** City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC4.6: calculate values of power in parallel and series D.C. circuits [CURRICULUM_REQUIRES]

### EL-CIRCUIT-POWER-TOTAL-001

**Statement (v1, APPROVED):** The total power dissipated in a circuit is the sum of the power dissipated in each individual component, regardless of whether the components are connected in series or parallel.

**Direct prerequisites:** EL-POWER-SOLVE-001 (REQUIRED)
**Direct dependents:** EL-CIRCUIT-COMPARE-POWER-001
**Curriculum mapping(s):** Calculate values of power in parallel and series D.C. circuits (REQUIRED_FOR); Calculate values of power in parallel and series D.C. circuits (REQUIRED_FOR)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, 9.5: electrical power and energy, P = VI and P = I^2 R [SUPPORTS] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC4.6: calculate values of power in parallel and series D.C. circuits [CURRICULUM_REQUIRES]

### EL-CURRENT-THERMAL-EFFECT-001

**Statement (v1, APPROVED):** Current flowing through a resistance causes heating, because electrical energy is converted into heat energy.

**Direct prerequisites:** EL-CONCEPT-RESISTANCE-001 (STRONG); EL-CONCEPT-ENERGY-001 (STRONG)
**Direct dependents:** EL-PROTECTIVE-DEVICE-PURPOSE-001; EL-FUSE-OPERATION-001; EL-THERMAL-EFFECT-APPLICATION-001; EL-WAVEFORM-RMS-001
**Curriculum mapping(s):** Describe the chemical and thermal effects of electric currents (REQUIRED_FOR); Describe the chemical and thermal effects of electric currents (REQUIRED_FOR)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, Ch.9: electric current as the flow of free charge carriers; conductors, insulators; thermal/chemical effects of current [DEFINES] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC4.8: describe the chemical and thermal effects of electric currents [CURRICULUM_REQUIRES]

### EL-CURRENT-CHEMICAL-EFFECT-001

**Statement (v1, APPROVED):** Current flowing through certain solutions (electrolytes) causes chemical changes, a process known as electrolysis.

**Direct prerequisites:** EL-CONCEPT-CURRENT-001 (STRONG)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Describe the chemical and thermal effects of electric currents (REQUIRED_FOR); Describe the chemical and thermal effects of electric currents (REQUIRED_FOR)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, Ch.9: electric current as the flow of free charge carriers; conductors, insulators; thermal/chemical effects of current [DEFINES] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC4.8: describe the chemical and thermal effects of electric currents [CURRICULUM_REQUIRES]

### EL-CONCEPT-CHARGE-001

**Statement (v1, APPROVED):** Electric charge is a fundamental property of matter that causes it to experience a force in an electric field, and can be positive or negative.

**Direct prerequisites:** (none — root assertion)
**Direct dependents:** EL-CONCEPT-ATOMIC-CHARGE-STRUCTURE-001; EL-CURRENT-CHARGE-RELATIONSHIP-001
**Curriculum mapping(s):** Describe the basic principles of electron theory (REQUIRED_FOR); Describe the basic principles of electron theory (REQUIRED_FOR)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, Ch.9: electric current as the flow of free charge carriers; conductors, insulators; thermal/chemical effects of current [DEFINES] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC4.1: describe the basic principles of electron theory [CURRICULUM_REQUIRES]

### EL-CONCEPT-ATOMIC-CHARGE-STRUCTURE-001

**Statement (v1, APPROVED):** An atom consists of a nucleus containing positively charged protons, surrounded by negatively charged electrons; in a conductor, some of these electrons are only loosely bound to their atoms and are free to move.

**Direct prerequisites:** EL-CONCEPT-CHARGE-001 (REQUIRED)
**Direct dependents:** EL-CONCEPT-ELECTRON-THEORY-001
**Curriculum mapping(s):** Describe the basic principles of electron theory (REQUIRED_FOR); Describe the basic principles of electron theory (REQUIRED_FOR)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, Ch.9: electric current as the flow of free charge carriers; conductors, insulators; thermal/chemical effects of current [DEFINES] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC4.1: describe the basic principles of electron theory [CURRICULUM_REQUIRES]

### EL-UNIT-COULOMB-001

**Statement (v1, APPROVED):** The coulomb (C) is the SI derived unit of electric charge.

**Direct prerequisites:** (none — root assertion)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Identify and determine values of base and derived SI units which apply specifically to electrical quantities (REQUIRED_FOR); Identify and determine values of base and derived SI units which apply specifically to electrical quantities (REQUIRED_FOR)
**Provenance:** The International System of Units (SI Brochure) — SI Brochure: table of SI derived units with special names, including the volt, ohm, watt and joule, and SI prefixes [DEFINES] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC2.2: identify and determine values of base and derived SI units which apply specifically to electrical quantities [CURRICULUM_REQUIRES]

### EL-CURRENT-CHARGE-RELATIONSHIP-001

**Statement (v1, APPROVED):** Electric current equals the rate of flow of charge: I = Q divided by t.

**Direct prerequisites:** EL-CONCEPT-CHARGE-001 (REQUIRED); EL-CONCEPT-CURRENT-001 (REQUIRED)
**Direct dependents:** EL-CURRENT-CHARGE-CALC-001
**Curriculum mapping(s):** Describe the basic principles of electron theory (REQUIRED_FOR); Describe the basic principles of electron theory (REQUIRED_FOR)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, Ch.9: electric current as the flow of free charge carriers; conductors, insulators; thermal/chemical effects of current [DEFINES] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC4.1: describe the basic principles of electron theory [CURRICULUM_REQUIRES]
**Misconceptions targeting this assertion:** MIS-EL-ELECTRON-CURRENT-DIRECTION-CONFUSION-001

### EL-CURRENT-CHARGE-CALC-001

**Statement (v1, APPROVED):** Calculate charge or current from the relationship I = Q divided by t, given the other two quantities.

**Direct prerequisites:** EL-CURRENT-CHARGE-RELATIONSHIP-001 (REQUIRED); FM-ALG-TRANSPOSE-MULT-001 (REQUIRED); FM-ALG-SUBSTITUTION-001 (REQUIRED)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Calculate the values of current, voltage and resistance in parallel and series D.C. circuits (REQUIRED_FOR); Identify and apply appropriate mathematical principles which are relevant to electrical work tasks (EXEMPLIFIES); Calculate the values of current, voltage and resistance in parallel and series D.C. circuits (REQUIRED_FOR); Identify and apply appropriate mathematical principles which are relevant to electrical work tasks (EXEMPLIFIES)
**Provenance:** City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC4.5: calculate the values of current, voltage and resistance in parallel and series D.C. circuits [CURRICULUM_REQUIRES]

### EL-MATERIAL-CONDUCTOR-INSULATOR-EXAMPLES-001

**Statement (v1, APPROVED):** Common conductors used in electrical installation work include copper and aluminium; common insulators include PVC and rubber.

**Direct prerequisites:** EL-CONCEPT-CONDUCTOR-001 (STRONG); EL-CONCEPT-INSULATOR-001 (STRONG)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Identify and distinguish between materials which are good conductors and insulators (REQUIRED_FOR); Identify and distinguish between materials which are good conductors and insulators (REQUIRED_FOR)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, Ch.9: electric current as the flow of free charge carriers; conductors, insulators; thermal/chemical effects of current [SUPPORTS] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC4.2: identify and distinguish between materials which are good conductors and insulators [CURRICULUM_REQUIRES]

### EL-CONDUCTOR-RESISTANCE-FACTORS-001

**Statement (v1, APPROVED):** The resistance of a conductor depends on its length, its cross-sectional area, its resistivity and its temperature.

**Direct prerequisites:** EL-RESISTIVITY-RELATIONSHIP-001 (STRONG)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Describe what is meant by resistance and resistivity in relation to electrical circuits (REQUIRED_FOR); Describe what is meant by resistance and resistivity in relation to electrical circuits (REQUIRED_FOR)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, 9.3: resistance and resistivity, and R = rho L / A [SUPPORTS] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC4.3: describe what is meant by resistance and resistivity in relation to electrical circuits [CURRICULUM_REQUIRES]

### EL-RESISTIVITY-COMPARE-MATERIALS-001

**Statement (v1, APPROVED):** Compare the resistivity of different materials to determine which is the better conductor: a lower resistivity indicates a better conductor.

**Direct prerequisites:** EL-CONCEPT-RESISTIVITY-001 (REQUIRED)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Describe what is meant by resistance and resistivity in relation to electrical circuits (SUPPORTS); Describe what is meant by resistance and resistivity in relation to electrical circuits (SUPPORTS)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, 9.3: resistance and resistivity, and R = rho L / A [SUPPORTS] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC4.3: describe what is meant by resistance and resistivity in relation to electrical circuits [CURRICULUM_REQUIRES]

### EL-RESISTIVITY-LENGTH-EFFECT-001

**Statement (v1, APPROVED):** Increasing the length of a conductor increases its resistance, since resistance is directly proportional to length.

**Direct prerequisites:** EL-RESISTIVITY-RELATIONSHIP-001 (REQUIRED); FM-ALG-PROPORTION-DIRECT-001 (REQUIRED)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Describe what is meant by resistance and resistivity in relation to electrical circuits (SUPPORTS); Describe what is meant by resistance and resistivity in relation to electrical circuits (SUPPORTS)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, 9.3: resistance and resistivity, and R = rho L / A [SUPPORTS] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC4.3: describe what is meant by resistance and resistivity in relation to electrical circuits [CURRICULUM_REQUIRES]

### EL-RESISTIVITY-AREA-EFFECT-001

**Statement (v1, APPROVED):** Increasing the cross-sectional area of a conductor decreases its resistance, since resistance is inversely proportional to cross-sectional area.

**Direct prerequisites:** EL-RESISTIVITY-RELATIONSHIP-001 (REQUIRED); FM-ALG-PROPORTION-INVERSE-001 (REQUIRED)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Describe what is meant by resistance and resistivity in relation to electrical circuits (SUPPORTS); Describe what is meant by resistance and resistivity in relation to electrical circuits (SUPPORTS)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, 9.3: resistance and resistivity, and R = rho L / A [SUPPORTS] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC4.3: describe what is meant by resistance and resistivity in relation to electrical circuits [CURRICULUM_REQUIRES]

### EL-INSULATOR-BREAKDOWN-001

**Statement (v1, APPROVED):** If the voltage across an insulator becomes too high, the insulator can break down and allow current to flow, which is why insulation has a rated maximum voltage.

**Direct prerequisites:** EL-CONCEPT-INSULATOR-001 (REQUIRED)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Identify and distinguish between materials which are good conductors and insulators (SUPPORTS); Identify and distinguish between materials which are good conductors and insulators (SUPPORTS)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, Ch.9: electric current as the flow of free charge carriers; conductors, insulators; thermal/chemical effects of current [SUPPORTS] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC4.2: identify and distinguish between materials which are good conductors and insulators [CURRICULUM_REQUIRES]

### EL-OHM-SELECT-RELATIONSHIP-001

**Statement (v1, APPROVED):** Select the correct arrangement of V = I times R to use, based on which two quantities are known and which quantity is required.

**Direct prerequisites:** EL-OHM-RELATIONSHIP-001 (REQUIRED)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Calculate the values of current, voltage and resistance in parallel and series D.C. circuits (REQUIRED_FOR); Identify and apply appropriate mathematical principles which are relevant to electrical work tasks (EXEMPLIFIES); Calculate the values of current, voltage and resistance in parallel and series D.C. circuits (REQUIRED_FOR); Identify and apply appropriate mathematical principles which are relevant to electrical work tasks (EXEMPLIFIES)
**Provenance:** City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC4.5: calculate the values of current, voltage and resistance in parallel and series D.C. circuits [CURRICULUM_REQUIRES]

### EL-CIRCUIT-SELECT-CONFIGURATION-001

**Statement (v1, APPROVED):** Identify whether a given circuit diagram or description shows components connected in series or in parallel.

**Direct prerequisites:** EL-CIRCUIT-SERIES-STRUCTURE-001 (REQUIRED); EL-CIRCUIT-PARALLEL-STRUCTURE-001 (REQUIRED)
**Direct dependents:** EL-CIRCUIT-TRACE-CURRENT-PATH-001
**Curriculum mapping(s):** Explain the relationship between current, voltage and resistance in parallel and series D.C. circuits (SUPPORTS); Explain the relationship between current, voltage and resistance in parallel and series D.C. circuits (SUPPORTS)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, 10.2: equivalent resistance for resistors in series and in parallel [SUPPORTS] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC4.4: explain the relationship between current, voltage and resistance in parallel and series D.C. circuits [CURRICULUM_REQUIRES]

### EL-CIRCUIT-EQUIVALENT-RESISTANCE-DEFINITION-001

**Statement (v1, APPROVED):** The equivalent resistance of a network of resistors is the single resistance value that would draw the same current from the same supply voltage as the whole network.

**Direct prerequisites:** (none — root assertion)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Explain the relationship between current, voltage and resistance in parallel and series D.C. circuits (REQUIRED_FOR); Explain the relationship between current, voltage and resistance in parallel and series D.C. circuits (REQUIRED_FOR)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, 10.2: equivalent resistance for resistors in series and in parallel [DEFINES] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC4.4: explain the relationship between current, voltage and resistance in parallel and series D.C. circuits [CURRICULUM_REQUIRES]

### EL-CIRCUIT-MIXED-SERIES-PARALLEL-RECOGNITION-001

**Statement (v1, APPROVED):** Some circuits combine both series-connected and parallel-connected sections within the same network.

**Direct prerequisites:** EL-CIRCUIT-SERIES-STRUCTURE-001 (REQUIRED); EL-CIRCUIT-PARALLEL-STRUCTURE-001 (REQUIRED)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Explain the relationship between current, voltage and resistance in parallel and series D.C. circuits (SUPPORTS); Explain the relationship between current, voltage and resistance in parallel and series D.C. circuits (SUPPORTS)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, 10.2: equivalent resistance for resistors in series and in parallel [SUPPORTS] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC4.4: explain the relationship between current, voltage and resistance in parallel and series D.C. circuits [CURRICULUM_REQUIRES]

### EL-CIRCUIT-TRACE-CURRENT-PATH-001

**Statement (v1, APPROVED):** Trace the path or paths current takes through a given series or parallel circuit diagram.

**Direct prerequisites:** EL-CIRCUIT-SELECT-CONFIGURATION-001 (STRONG)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Explain the relationship between current, voltage and resistance in parallel and series D.C. circuits (SUPPORTS); Explain the relationship between current, voltage and resistance in parallel and series D.C. circuits (SUPPORTS)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, 10.2: equivalent resistance for resistors in series and in parallel [SUPPORTS] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC4.4: explain the relationship between current, voltage and resistance in parallel and series D.C. circuits [CURRICULUM_REQUIRES]

### EL-CIRCUIT-COMPARE-RESISTANCE-001

**Statement (v1, APPROVED):** Compare how the total resistance of the same set of resistors differs when connected in series versus in parallel: the parallel total is always lower than the series total.

**Direct prerequisites:** EL-SERIES-RESISTANCE-001 (REQUIRED); EL-PARALLEL-RESISTANCE-001 (REQUIRED)
**Direct dependents:** EL-CIRCUIT-COMPARE-POWER-001
**Curriculum mapping(s):** Explain the relationship between current, voltage and resistance in parallel and series D.C. circuits (SUPPORTS); Explain the relationship between current, voltage and resistance in parallel and series D.C. circuits (SUPPORTS)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, 10.2: equivalent resistance for resistors in series and in parallel [SUPPORTS] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC4.4: explain the relationship between current, voltage and resistance in parallel and series D.C. circuits [CURRICULUM_REQUIRES]

### EL-CIRCUIT-COMPARE-CURRENT-001

**Statement (v1, APPROVED):** Compare current behaviour in series versus parallel circuits: current is the same throughout a series circuit, but divides between branches in a parallel circuit.

**Direct prerequisites:** EL-SERIES-CURRENT-001 (REQUIRED); EL-PARALLEL-CURRENT-001 (REQUIRED)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Explain the relationship between current, voltage and resistance in parallel and series D.C. circuits (SUPPORTS); Explain the relationship between current, voltage and resistance in parallel and series D.C. circuits (SUPPORTS)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, 10.2: equivalent resistance for resistors in series and in parallel [SUPPORTS] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC4.4: explain the relationship between current, voltage and resistance in parallel and series D.C. circuits [CURRICULUM_REQUIRES]

### EL-CIRCUIT-COMPARE-VOLTAGE-001

**Statement (v1, APPROVED):** Compare voltage behaviour in series versus parallel circuits: voltage divides between components in a series circuit, but is the same across every branch of a parallel circuit.

**Direct prerequisites:** EL-SERIES-VOLTAGE-001 (REQUIRED); EL-PARALLEL-VOLTAGE-001 (REQUIRED)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Explain the relationship between current, voltage and resistance in parallel and series D.C. circuits (SUPPORTS); Explain the relationship between current, voltage and resistance in parallel and series D.C. circuits (SUPPORTS)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, 10.2: equivalent resistance for resistors in series and in parallel [SUPPORTS] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC4.4: explain the relationship between current, voltage and resistance in parallel and series D.C. circuits [CURRICULUM_REQUIRES]

### EL-CIRCUIT-COMPARE-POWER-001

**Statement (v1, APPROVED):** Compare the total power dissipated by the same set of resistors at the same supply voltage when connected in series versus in parallel.

**Direct prerequisites:** EL-CIRCUIT-COMPARE-RESISTANCE-001 (STRONG); EL-CIRCUIT-POWER-TOTAL-001 (REQUIRED)
**Direct dependents:** EL-CIRCUIT-COMPARE-ENERGY-001
**Curriculum mapping(s):** Calculate values of power in parallel and series D.C. circuits (SUPPORTS); Calculate values of power in parallel and series D.C. circuits (SUPPORTS)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, 9.5: electrical power and energy, P = VI and P = I^2 R [SUPPORTS] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC4.6: calculate values of power in parallel and series D.C. circuits [CURRICULUM_REQUIRES]

### EL-CIRCUIT-COMPARE-ENERGY-001

**Statement (v1, APPROVED):** Compare the total electrical energy transferred over a given time by the same set of resistors when connected in series versus in parallel at the same supply voltage.

**Direct prerequisites:** EL-CIRCUIT-COMPARE-POWER-001 (STRONG)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Calculate values of power in parallel and series D.C. circuits (SUPPORTS); Calculate values of power in parallel and series D.C. circuits (SUPPORTS)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, 9.5: electrical power and energy, P = VI and P = I^2 R [SUPPORTS] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC4.6: calculate values of power in parallel and series D.C. circuits [CURRICULUM_REQUIRES]

### EL-SERIES-DOMINANT-RESISTOR-001

**Statement (v1, APPROVED):** In a series circuit, since current is equal throughout, the component with the greatest resistance has the greatest voltage drop and dissipates the most power.

**Direct prerequisites:** EL-SERIES-VOLTAGE-001 (REQUIRED); EL-POWER-DERIVED-VIR-001 (STRONG)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Explain the relationship between current, voltage and resistance in parallel and series D.C. circuits (SUPPORTS); Explain the relationship between current, voltage and resistance in parallel and series D.C. circuits (SUPPORTS)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, 10.2: equivalent resistance for resistors in series and in parallel [SUPPORTS] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC4.4: explain the relationship between current, voltage and resistance in parallel and series D.C. circuits [CURRICULUM_REQUIRES]

### EL-PARALLEL-DOMINANT-RESISTOR-001

**Statement (v1, APPROVED):** In a parallel circuit, since voltage is equal across every branch, the branch with the smallest resistance carries the largest current and dissipates the most power.

**Direct prerequisites:** EL-PARALLEL-CURRENT-001 (REQUIRED); EL-POWER-DERIVED-V2R-001 (STRONG)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Explain the relationship between current, voltage and resistance in parallel and series D.C. circuits (SUPPORTS); Explain the relationship between current, voltage and resistance in parallel and series D.C. circuits (SUPPORTS)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, 10.2: equivalent resistance for resistors in series and in parallel [SUPPORTS] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC4.4: explain the relationship between current, voltage and resistance in parallel and series D.C. circuits [CURRICULUM_REQUIRES]

### EL-SERIES-PREDICT-OPEN-001

**Statement (v1, APPROVED):** Predict the effect on current if a series circuit is broken (open-circuited) at any point: current stops flowing throughout the whole circuit.

**Direct prerequisites:** EL-CIRCUIT-SERIES-STRUCTURE-001 (REQUIRED); EL-SERIES-CURRENT-001 (STRONG)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Explain the relationship between current, voltage and resistance in parallel and series D.C. circuits (SUPPORTS); Explain the relationship between current, voltage and resistance in parallel and series D.C. circuits (SUPPORTS)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, 10.2: equivalent resistance for resistors in series and in parallel [SUPPORTS] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC4.4: explain the relationship between current, voltage and resistance in parallel and series D.C. circuits [CURRICULUM_REQUIRES]

### EL-PARALLEL-PREDICT-OPEN-001

**Statement (v1, APPROVED):** Predict the effect on the remaining branches if one branch of a parallel circuit is broken (open-circuited): current continues to flow unaffected in the other branches.

**Direct prerequisites:** EL-CIRCUIT-PARALLEL-STRUCTURE-001 (REQUIRED); EL-PARALLEL-VOLTAGE-001 (STRONG)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Explain the relationship between current, voltage and resistance in parallel and series D.C. circuits (SUPPORTS); Explain the relationship between current, voltage and resistance in parallel and series D.C. circuits (SUPPORTS)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, 10.2: equivalent resistance for resistors in series and in parallel [SUPPORTS] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC4.4: explain the relationship between current, voltage and resistance in parallel and series D.C. circuits [CURRICULUM_REQUIRES]

### EL-SERIES-PREDICT-ADD-RESISTOR-001

**Statement (v1, APPROVED):** Predict the effect on supply current of adding an extra resistor in series: total resistance increases, so supply current decreases.

**Direct prerequisites:** EL-SERIES-RESISTANCE-001 (REQUIRED); EL-OHM-PROPORTIONALITY-001 (STRONG)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Explain the relationship between current, voltage and resistance in parallel and series D.C. circuits (SUPPORTS); Explain the relationship between current, voltage and resistance in parallel and series D.C. circuits (SUPPORTS)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, 10.2: equivalent resistance for resistors in series and in parallel [SUPPORTS] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC4.4: explain the relationship between current, voltage and resistance in parallel and series D.C. circuits [CURRICULUM_REQUIRES]

### EL-PARALLEL-PREDICT-ADD-RESISTOR-001

**Statement (v1, APPROVED):** Predict the effect on supply current of adding an extra branch resistor in parallel: total resistance decreases, so supply current increases.

**Direct prerequisites:** EL-PARALLEL-RESISTANCE-001 (REQUIRED); EL-OHM-PROPORTIONALITY-001 (STRONG)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Explain the relationship between current, voltage and resistance in parallel and series D.C. circuits (SUPPORTS); Explain the relationship between current, voltage and resistance in parallel and series D.C. circuits (SUPPORTS)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, 10.2: equivalent resistance for resistors in series and in parallel [SUPPORTS] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC4.4: explain the relationship between current, voltage and resistance in parallel and series D.C. circuits [CURRICULUM_REQUIRES]

### EL-CIRCUIT-RECOGNISE-SHORT-CIRCUIT-001

**Statement (v1, APPROVED):** Recognise a short circuit as an unintended low-resistance path that causes abnormally high current to flow.

**Direct prerequisites:** EL-CONCEPT-RESISTANCE-001 (STRONG)
**Direct dependents:** EL-CIRCUIT-PREDICT-SHORT-EFFECT-001
**Curriculum mapping(s):** Explain the relationship between current, voltage and resistance in parallel and series D.C. circuits (SUPPORTS); Explain the relationship between current, voltage and resistance in parallel and series D.C. circuits (SUPPORTS)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, 10.2: equivalent resistance for resistors in series and in parallel [SUPPORTS] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC4.4: explain the relationship between current, voltage and resistance in parallel and series D.C. circuits [CURRICULUM_REQUIRES]

### EL-CIRCUIT-RECOGNISE-OPEN-CIRCUIT-001

**Statement (v1, APPROVED):** Recognise an open circuit as an unintended break in the current path that prevents current from flowing.

**Direct prerequisites:** (none — root assertion)
**Direct dependents:** EL-CIRCUIT-OPEN-CIRCUIT-RESISTANCE-INTERPRETATION-001
**Curriculum mapping(s):** Explain the relationship between current, voltage and resistance in parallel and series D.C. circuits (SUPPORTS); Explain the relationship between current, voltage and resistance in parallel and series D.C. circuits (SUPPORTS)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, 10.2: equivalent resistance for resistors in series and in parallel [SUPPORTS] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC4.4: explain the relationship between current, voltage and resistance in parallel and series D.C. circuits [CURRICULUM_REQUIRES]

### EL-CIRCUIT-PREDICT-SHORT-EFFECT-001

**Statement (v1, APPROVED):** Predict the effect of a short circuit occurring across a component: current increases sharply and may cause damage or operate a protective device.

**Direct prerequisites:** EL-CIRCUIT-RECOGNISE-SHORT-CIRCUIT-001 (REQUIRED)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Describe the chemical and thermal effects of electric currents (SUPPORTS); Describe the chemical and thermal effects of electric currents (SUPPORTS)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, Ch.9: electric current as the flow of free charge carriers; conductors, insulators; thermal/chemical effects of current [SUPPORTS] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC4.8: describe the chemical and thermal effects of electric currents [CURRICULUM_REQUIRES]

### EL-PROTECTIVE-DEVICE-PURPOSE-001

**Statement (v1, APPROVED):** A protective device, such as a fuse or circuit breaker, is designed to automatically disconnect a circuit when current exceeds a safe value.

**Direct prerequisites:** EL-CURRENT-THERMAL-EFFECT-001 (STRONG)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Describe the chemical and thermal effects of electric currents (REQUIRED_FOR); Describe the chemical and thermal effects of electric currents (REQUIRED_FOR)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, Ch.9: electric current as the flow of free charge carriers; conductors, insulators; thermal/chemical effects of current [SUPPORTS] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC4.8: describe the chemical and thermal effects of electric currents [CURRICULUM_REQUIRES]

### EL-FUSE-OPERATION-001

**Statement (v1, APPROVED):** A fuse protects a circuit by melting and breaking the circuit when current exceeds its rated value, using the thermal effect of current.

**Direct prerequisites:** EL-CURRENT-THERMAL-EFFECT-001 (REQUIRED)
**Direct dependents:** EL-CIRCUIT-BREAKER-VS-FUSE-001
**Curriculum mapping(s):** Describe the chemical and thermal effects of electric currents (REQUIRED_FOR); Describe the chemical and thermal effects of electric currents (REQUIRED_FOR)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, Ch.9: electric current as the flow of free charge carriers; conductors, insulators; thermal/chemical effects of current [SUPPORTS] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC4.8: describe the chemical and thermal effects of electric currents [CURRICULUM_REQUIRES]

### EL-THERMAL-EFFECT-APPLICATION-001

**Statement (v1, APPROVED):** Recognise practical applications of the thermal effect of current, such as heating elements and filament lamps.

**Direct prerequisites:** EL-CURRENT-THERMAL-EFFECT-001 (REQUIRED)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Describe the chemical and thermal effects of electric currents (SUPPORTS); Describe the chemical and thermal effects of electric currents (SUPPORTS)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, Ch.9: electric current as the flow of free charge carriers; conductors, insulators; thermal/chemical effects of current [SUPPORTS] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC4.8: describe the chemical and thermal effects of electric currents [CURRICULUM_REQUIRES]

### EL-THERMAL-EFFECT-FACTORS-001

**Statement (v1, APPROVED):** The amount of heat generated by current flowing through a resistance depends on the current, the resistance and the time for which the current flows.

**Direct prerequisites:** EL-POWER-SOLVE-IR-001 (STRONG)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Describe the chemical and thermal effects of electric currents (SUPPORTS); Describe the chemical and thermal effects of electric currents (SUPPORTS)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, Ch.9: electric current as the flow of free charge carriers; conductors, insulators; thermal/chemical effects of current [SUPPORTS] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC4.8: describe the chemical and thermal effects of electric currents [CURRICULUM_REQUIRES]

### EL-CIRCUIT-BREAKER-VS-FUSE-001

**Statement (v1, APPROVED):** Compare a fuse, which must be replaced after operating, with a circuit breaker, which can be reset and reused after tripping.

**Direct prerequisites:** EL-FUSE-OPERATION-001 (REQUIRED)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Describe the chemical and thermal effects of electric currents (SUPPORTS); Describe the chemical and thermal effects of electric currents (SUPPORTS)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, Ch.9: electric current as the flow of free charge carriers; conductors, insulators; thermal/chemical effects of current [SUPPORTS] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC4.8: describe the chemical and thermal effects of electric currents [CURRICULUM_REQUIRES]

### EL-INSTRUMENT-SELECT-001

**Statement (v1, APPROVED):** Select the appropriate instrument (voltmeter, ammeter, ohmmeter or multimeter) to measure a given electrical quantity.

**Direct prerequisites:** EL-INSTRUMENT-VOLTMETER-001 (REQUIRED); EL-INSTRUMENT-AMMETER-001 (REQUIRED); EL-INSTRUMENT-OHMMETER-001 (REQUIRED)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Identify appropriate electrical instruments for the measurement of different electrical quantities (REQUIRED_FOR); Identify appropriate electrical instruments for the measurement of different electrical quantities (REQUIRED_FOR)
**Provenance:** City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC2.3: identify appropriate electrical instruments for the measurement of different electrical quantities [CURRICULUM_REQUIRES]
**Misconceptions targeting this assertion:** MIS-EL-INSTRUMENT-CONNECTION-CONFUSION-001

### EL-INSTRUMENT-VOLTMETER-INTERNAL-RESISTANCE-001

**Statement (v1, APPROVED):** An ideal voltmeter has very high internal resistance so that connecting it in parallel does not significantly alter the circuit being measured.

**Direct prerequisites:** EL-INSTRUMENT-VOLTMETER-001 (REQUIRED)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Identify appropriate electrical instruments for the measurement of different electrical quantities (SUPPORTS); Identify appropriate electrical instruments for the measurement of different electrical quantities (SUPPORTS)
**Provenance:** University Physics Volume 2 — A voltmeter is placed in parallel and must have very high (ideally infinite) resistance so it does not alter the circuit; an ammeter is placed in series and must have very low (ideally zero) resistance for the same reason; an ohmmeter must never be connected to a live (energised) circuit [DEFINES] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC2.3: identify appropriate electrical instruments for the measurement of different electrical quantities [CURRICULUM_REQUIRES]

### EL-INSTRUMENT-AMMETER-INTERNAL-RESISTANCE-001

**Statement (v1, APPROVED):** An ideal ammeter has very low internal resistance so that connecting it in series does not significantly alter the circuit being measured.

**Direct prerequisites:** EL-INSTRUMENT-AMMETER-001 (REQUIRED)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Identify appropriate electrical instruments for the measurement of different electrical quantities (SUPPORTS); Identify appropriate electrical instruments for the measurement of different electrical quantities (SUPPORTS)
**Provenance:** University Physics Volume 2 — A voltmeter is placed in parallel and must have very high (ideally infinite) resistance so it does not alter the circuit; an ammeter is placed in series and must have very low (ideally zero) resistance for the same reason; an ohmmeter must never be connected to a live (energised) circuit [DEFINES] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC2.3: identify appropriate electrical instruments for the measurement of different electrical quantities [CURRICULUM_REQUIRES]

### EL-INSTRUMENT-CONTINUITY-TEST-001

**Statement (v1, APPROVED):** A continuity test uses an ohmmeter or multimeter to confirm that a low-resistance path exists between two points in a de-energised circuit.

**Direct prerequisites:** EL-INSTRUMENT-OHMMETER-001 (REQUIRED)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Identify appropriate electrical instruments for the measurement of different electrical quantities (SUPPORTS); Identify appropriate electrical instruments for the measurement of different electrical quantities (SUPPORTS)
**Provenance:** City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC2.3: identify appropriate electrical instruments for the measurement of different electrical quantities [CURRICULUM_REQUIRES]

### EL-SERIES-VOLTAGE-DIVIDER-001

**Statement (v1, APPROVED):** A series circuit of two or more resistors can be used as a voltage divider, where the voltage across each resistor is proportional to its resistance.

**Direct prerequisites:** EL-SERIES-VOLTAGE-001 (REQUIRED); FM-ALG-PROPORTION-DIRECT-001 (STRONG)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Explain the relationship between current, voltage and resistance in parallel and series D.C. circuits (SUPPORTS); Explain the relationship between current, voltage and resistance in parallel and series D.C. circuits (SUPPORTS)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, 10.2: equivalent resistance for resistors in series and in parallel [SUPPORTS] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC4.4: explain the relationship between current, voltage and resistance in parallel and series D.C. circuits [CURRICULUM_REQUIRES]

### EL-PARALLEL-CURRENT-DIVIDER-001

**Statement (v1, APPROVED):** A parallel circuit of two or more resistors divides the total current between branches in inverse proportion to their resistance.

**Direct prerequisites:** EL-PARALLEL-CURRENT-001 (REQUIRED); FM-ALG-PROPORTION-INVERSE-001 (STRONG)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Explain the relationship between current, voltage and resistance in parallel and series D.C. circuits (SUPPORTS); Explain the relationship between current, voltage and resistance in parallel and series D.C. circuits (SUPPORTS)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, 10.2: equivalent resistance for resistors in series and in parallel [SUPPORTS] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC4.4: explain the relationship between current, voltage and resistance in parallel and series D.C. circuits [CURRICULUM_REQUIRES]

### EL-CIRCUIT-SUPPLY-CURRENT-SERIES-001

**Statement (v1, APPROVED):** Calculate the supply current in a series circuit from the supply voltage and the total resistance of the circuit.

**Direct prerequisites:** EL-OHM-SOLVE-I-001 (REQUIRED); EL-SERIES-RESISTANCE-CALC-001 (REQUIRED)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Calculate the values of current, voltage and resistance in parallel and series D.C. circuits (REQUIRED_FOR); Calculate the values of current, voltage and resistance in parallel and series D.C. circuits (REQUIRED_FOR)
**Provenance:** City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC4.5: calculate the values of current, voltage and resistance in parallel and series D.C. circuits [CURRICULUM_REQUIRES]

### EL-CIRCUIT-SUPPLY-CURRENT-PARALLEL-001

**Statement (v1, APPROVED):** Calculate the supply current in a parallel circuit from the supply voltage and the total resistance of the circuit.

**Direct prerequisites:** EL-OHM-SOLVE-I-001 (REQUIRED); EL-PARALLEL-RESISTANCE-CALC-001 (REQUIRED)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Calculate the values of current, voltage and resistance in parallel and series D.C. circuits (REQUIRED_FOR); Calculate the values of current, voltage and resistance in parallel and series D.C. circuits (REQUIRED_FOR)
**Provenance:** City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC4.5: calculate the values of current, voltage and resistance in parallel and series D.C. circuits [CURRICULUM_REQUIRES]

### EL-POWER-DERIVED-V2R-001

**Statement (v1, APPROVED):** Electrical power can also be found from voltage and resistance alone, since combining P = V times I with I = V divided by R gives P = V squared divided by R.

**Direct prerequisites:** (none — root assertion)
**Direct dependents:** EL-PARALLEL-DOMINANT-RESISTOR-001; EL-POWER-SOLVE-V2R-001
**Curriculum mapping(s):** Calculate values of power in parallel and series D.C. circuits (REQUIRED_FOR); Calculate values of power in parallel and series D.C. circuits (REQUIRED_FOR)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, 9.5: electrical power and energy, P = VI and P = I^2 R [SUPPORTS]

### EL-POWER-SOLVE-V2R-001

**Statement (v1, APPROVED):** Calculate electrical power from known voltage and resistance using P = V squared divided by R.

**Direct prerequisites:** EL-POWER-DERIVED-V2R-001 (REQUIRED); FM-ALG-SUBSTITUTION-001 (REQUIRED)
**Direct dependents:** EL-PARALLEL-POWER-CALC-001
**Curriculum mapping(s):** Calculate values of power in parallel and series D.C. circuits (REQUIRED_FOR); Identify and apply appropriate mathematical principles which are relevant to electrical work tasks (EXEMPLIFIES); Calculate values of power in parallel and series D.C. circuits (REQUIRED_FOR); Identify and apply appropriate mathematical principles which are relevant to electrical work tasks (EXEMPLIFIES)
**Provenance:** City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC4.6: calculate values of power in parallel and series D.C. circuits [CURRICULUM_REQUIRES]

### EL-SERIES-POWER-CALC-001

**Statement (v1, APPROVED):** Calculate the power dissipated by an individual component in a series circuit from the common current and that component's resistance.

**Direct prerequisites:** EL-POWER-SOLVE-IR-001 (REQUIRED); EL-SERIES-CURRENT-001 (REQUIRED)
**Direct dependents:** EL-SERIES-POWER-DISTRIBUTION-001
**Curriculum mapping(s):** Calculate values of power in parallel and series D.C. circuits (REQUIRED_FOR); Calculate values of power in parallel and series D.C. circuits (REQUIRED_FOR)
**Provenance:** City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC4.6: calculate values of power in parallel and series D.C. circuits [CURRICULUM_REQUIRES]

### EL-PARALLEL-POWER-CALC-001

**Statement (v1, APPROVED):** Calculate the power dissipated by an individual branch in a parallel circuit from the common branch voltage and that branch's resistance.

**Direct prerequisites:** EL-POWER-SOLVE-V2R-001 (REQUIRED); EL-PARALLEL-VOLTAGE-001 (REQUIRED)
**Direct dependents:** EL-PARALLEL-POWER-DISTRIBUTION-001
**Curriculum mapping(s):** Calculate values of power in parallel and series D.C. circuits (REQUIRED_FOR); Calculate values of power in parallel and series D.C. circuits (REQUIRED_FOR)
**Provenance:** City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC4.6: calculate values of power in parallel and series D.C. circuits [CURRICULUM_REQUIRES]

### EL-SERIES-POWER-DISTRIBUTION-001

**Statement (v1, APPROVED):** In a series circuit, since current is equal throughout, the component with the greatest resistance dissipates the most power.

**Direct prerequisites:** EL-SERIES-POWER-CALC-001 (STRONG)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Calculate values of power in parallel and series D.C. circuits (SUPPORTS); Calculate values of power in parallel and series D.C. circuits (SUPPORTS)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, 9.5: electrical power and energy, P = VI and P = I^2 R [SUPPORTS] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC4.6: calculate values of power in parallel and series D.C. circuits [CURRICULUM_REQUIRES]

### EL-PARALLEL-POWER-DISTRIBUTION-001

**Statement (v1, APPROVED):** In a parallel circuit, since voltage is equal across every branch, the branch with the smallest resistance dissipates the most power.

**Direct prerequisites:** EL-PARALLEL-POWER-CALC-001 (STRONG)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Calculate values of power in parallel and series D.C. circuits (SUPPORTS); Calculate values of power in parallel and series D.C. circuits (SUPPORTS)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, 9.5: electrical power and energy, P = VI and P = I^2 R [SUPPORTS] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC4.6: calculate values of power in parallel and series D.C. circuits [CURRICULUM_REQUIRES]

### EL-ENERGY-POWER-TIME-RELATIONSHIP-001

**Statement (v1, APPROVED):** Electrical energy transferred is calculated by multiplying power by time: E = P times t.

**Direct prerequisites:** EL-CONCEPT-POWER-001 (REQUIRED); EL-CONCEPT-ENERGY-001 (REQUIRED)
**Direct dependents:** EL-ENERGY-REARRANGE-001; EL-ENERGY-CALC-001
**Curriculum mapping(s):** Identify and determine values of base and derived SI units which apply specifically to electrical quantities (REQUIRED_FOR); Identify and determine values of base and derived SI units which apply specifically to electrical quantities (REQUIRED_FOR)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, 9.5: electrical power and energy, P = VI and P = I^2 R [DEFINES] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC2.2: identify and determine values of base and derived SI units which apply specifically to electrical quantities [CURRICULUM_REQUIRES]

### EL-ENERGY-REARRANGE-001

**Statement (v1, APPROVED):** Rearrange E = P times t algebraically to make power or time the subject.

**Direct prerequisites:** EL-ENERGY-POWER-TIME-RELATIONSHIP-001 (REQUIRED); FM-ALG-TRANSPOSE-MULT-001 (REQUIRED)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Identify and determine values of base and derived SI units which apply specifically to electrical quantities (REQUIRED_FOR); Identify and apply appropriate mathematical principles which are relevant to electrical work tasks (EXEMPLIFIES); Identify and determine values of base and derived SI units which apply specifically to electrical quantities (REQUIRED_FOR); Identify and apply appropriate mathematical principles which are relevant to electrical work tasks (EXEMPLIFIES)
**Provenance:** City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC2.2: identify and determine values of base and derived SI units which apply specifically to electrical quantities [CURRICULUM_REQUIRES]

### EL-ENERGY-CALC-001

**Statement (v1, APPROVED):** Calculate the electrical energy transferred by a device from its power rating and its time of use, using E = P times t.

**Direct prerequisites:** EL-ENERGY-POWER-TIME-RELATIONSHIP-001 (REQUIRED); FM-ALG-SUBSTITUTION-001 (REQUIRED)
**Direct dependents:** EL-ENERGY-KWH-CALC-001
**Curriculum mapping(s):** Identify and determine values of base and derived SI units which apply specifically to electrical quantities (REQUIRED_FOR); Identify and apply appropriate mathematical principles which are relevant to electrical work tasks (EXEMPLIFIES); Identify and determine values of base and derived SI units which apply specifically to electrical quantities (REQUIRED_FOR); Identify and apply appropriate mathematical principles which are relevant to electrical work tasks (EXEMPLIFIES)
**Provenance:** City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC2.2: identify and determine values of base and derived SI units which apply specifically to electrical quantities [CURRICULUM_REQUIRES]

### EL-ENERGY-KWH-CALC-001

**Statement (v1, APPROVED):** Calculate the electrical energy used by a device in kilowatt-hours from its power rating in kilowatts and its time of use in hours.

**Direct prerequisites:** EL-ENERGY-CALC-001 (REQUIRED); EL-UNIT-KWH-001 (REQUIRED)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Identify and determine values of base and derived SI units which apply specifically to electrical quantities (SUPPORTS); Identify and determine values of base and derived SI units which apply specifically to electrical quantities (SUPPORTS)
**Provenance:** City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC2.2: identify and determine values of base and derived SI units which apply specifically to electrical quantities [CURRICULUM_REQUIRES]

### EL-CONCEPT-MAGNETISM-001

**Statement (v1, APPROVED):** Magnetism is a force of attraction between unlike magnetic poles and repulsion between like magnetic poles.

**Direct prerequisites:** (none — root assertion)
**Direct dependents:** EL-CONCEPT-MAGNETIC-FIELD-CURRENT-001; EL-MAGNETISM-COMPARE-PERMANENT-ELECTROMAGNET-001
**Curriculum mapping(s):** Describe the effects of magnetism in terms of attraction and repulsion (REQUIRED_FOR); Describe the effects of magnetism in terms of attraction and repulsion (REQUIRED_FOR)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, Ch.11: magnetic attraction/repulsion; force on a current-carrying conductor in a magnetic field (11.4) [DEFINES] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC5.1: describe the effects of magnetism in terms of attraction and repulsion [CURRICULUM_REQUIRES]

### EL-CONCEPT-MAGNETIC-FLUX-001

**Statement (v1, APPROVED):** Magnetic flux is a measure of the total amount of magnetic field passing through a given area.

**Direct prerequisites:** (none — root assertion)
**Direct dependents:** EL-CONCEPT-MAGNETIC-FLUX-DENSITY-001; EL-CONCEPT-EMF-001; EL-CONCEPT-ELECTROMAGNETIC-INDUCTION-001; EL-CONCEPT-AC-GENERATOR-001
**Curriculum mapping(s):** State the difference between magnetic flux and flux density (REQUIRED_FOR); State the difference between magnetic flux and flux density (REQUIRED_FOR)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, Ch.13: magnetic flux and flux density (13.1 Faraday's Law); EMF; electric generators and the sinusoidal generated waveform (13.6) [DEFINES] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC5.2: state the difference between magnetic flux and flux density [CURRICULUM_REQUIRES]

### EL-CONCEPT-MAGNETIC-FLUX-DENSITY-001

**Statement (v1, APPROVED):** Magnetic flux density is the amount of magnetic flux passing through a unit area, describing how concentrated a magnetic field is.

**Direct prerequisites:** EL-CONCEPT-MAGNETIC-FLUX-001 (REQUIRED)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** State the difference between magnetic flux and flux density (REQUIRED_FOR); State the difference between magnetic flux and flux density (REQUIRED_FOR)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, Ch.13: magnetic flux and flux density (13.1 Faraday's Law); EMF; electric generators and the sinusoidal generated waveform (13.6) [DEFINES] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC5.2: state the difference between magnetic flux and flux density [CURRICULUM_REQUIRES]

### EL-CONCEPT-MAGNETIC-FIELD-CURRENT-001

**Statement (v1, APPROVED):** A current-carrying conductor produces a magnetic field around it.

**Direct prerequisites:** EL-CONCEPT-CURRENT-001 (REQUIRED); EL-CONCEPT-MAGNETISM-001 (STRONG)
**Direct dependents:** EL-CONCEPT-FORCE-ON-CONDUCTOR-001; EL-CONCEPT-ELECTROMAGNETISM-001; EL-INSTRUMENT-CLAMP-METER-001
**Curriculum mapping(s):** Describe the magnetic effects of electrical currents (REQUIRED_FOR); Describe the magnetic effects of electrical currents in terms of: production of a magnetic field, force on a current-carrying conductor in a magnetic field, electromagnetism, electromotive force (REQUIRED_FOR)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, Ch.12: the magnetic field produced by a current-carrying conductor; electromagnetism [DEFINES] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC5.3: describe the magnetic effects of electrical currents in terms of production of a magnetic field, force on a current-carrying conductor, electromagnetism and electromotive force [CURRICULUM_REQUIRES]

### EL-CONCEPT-FORCE-ON-CONDUCTOR-001

**Statement (v1, APPROVED):** A current-carrying conductor placed in a magnetic field experiences a mechanical force.

**Direct prerequisites:** EL-CONCEPT-MAGNETIC-FIELD-CURRENT-001 (REQUIRED); FP-CONCEPT-FORCE-001 (REQUIRED)
**Direct dependents:** EL-CONCEPT-ELECTROMAGNETISM-001; EL-CONCEPT-MOTOR-PRINCIPLE-001
**Curriculum mapping(s):** Describe the magnetic effects of electrical currents (REQUIRED_FOR); Describe the magnetic effects of electrical currents in terms of: production of a magnetic field, force on a current-carrying conductor in a magnetic field, electromagnetism, electromotive force (REQUIRED_FOR)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, Ch.11: magnetic attraction/repulsion; force on a current-carrying conductor in a magnetic field (11.4) [DEFINES] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC5.3: describe the magnetic effects of electrical currents in terms of production of a magnetic field, force on a current-carrying conductor, electromagnetism and electromotive force [CURRICULUM_REQUIRES]

### EL-CONCEPT-ELECTROMAGNETISM-001

**Statement (v1, APPROVED):** Electromagnetism is the branch of physics concerned with the relationship between electric current and magnetic fields, including how one can produce the other.

**Direct prerequisites:** EL-CONCEPT-MAGNETIC-FIELD-CURRENT-001 (REQUIRED); EL-CONCEPT-FORCE-ON-CONDUCTOR-001 (REQUIRED)
**Direct dependents:** EL-MAGNETISM-COMPARE-PERMANENT-ELECTROMAGNET-001
**Curriculum mapping(s):** Describe the magnetic effects of electrical currents (REQUIRED_FOR); Describe the magnetic effects of electrical currents in terms of: production of a magnetic field, force on a current-carrying conductor in a magnetic field, electromagnetism, electromotive force (REQUIRED_FOR)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, Ch.12: the magnetic field produced by a current-carrying conductor; electromagnetism [DEFINES] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC5.3: describe the magnetic effects of electrical currents in terms of production of a magnetic field, force on a current-carrying conductor, electromagnetism and electromotive force [CURRICULUM_REQUIRES]

### EL-CONCEPT-EMF-001

**Statement (v1, APPROVED):** Electromotive force (EMF) is the electrical energy per unit charge supplied by a source, which drives current around a circuit.

**Direct prerequisites:** EL-CONCEPT-MAGNETIC-FLUX-001 (STRONG)
**Direct dependents:** EL-CONCEPT-TERMINAL-VOLTAGE-001; EL-CONCEPT-ELECTROMAGNETIC-INDUCTION-001; EL-CONCEPT-AC-GENERATOR-001
**Curriculum mapping(s):** Describe the magnetic effects of electrical currents (REQUIRED_FOR); Describe the magnetic effects of electrical currents in terms of: production of a magnetic field, force on a current-carrying conductor in a magnetic field, electromagnetism, electromotive force (REQUIRED_FOR)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, Ch.13: magnetic flux and flux density (13.1 Faraday's Law); EMF; electric generators and the sinusoidal generated waveform (13.6) [DEFINES] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC5.3: describe the magnetic effects of electrical currents in terms of production of a magnetic field, force on a current-carrying conductor, electromagnetism and electromotive force [CURRICULUM_REQUIRES]
**Misconceptions targeting this assertion:** MIS-EL-EMF-VOLTAGE-CONFUSION-001

### EL-CONCEPT-TERMINAL-VOLTAGE-001

**Statement (v1, APPROVED):** Terminal voltage is the potential difference measured across the terminals of a source while it is supplying current, which is slightly less than its EMF due to the source's own internal resistance.

**Direct prerequisites:** EL-CONCEPT-EMF-001 (REQUIRED); EL-CONCEPT-VOLTAGE-001 (REQUIRED)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Describe the magnetic effects of electrical currents (SUPPORTS); Describe the magnetic effects of electrical currents in terms of: production of a magnetic field, force on a current-carrying conductor in a magnetic field, electromagnetism, electromotive force (SUPPORTS)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, Ch.13: magnetic flux and flux density (13.1 Faraday's Law); EMF; electric generators and the sinusoidal generated waveform (13.6) [SUPPORTS] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC5.3: describe the magnetic effects of electrical currents in terms of production of a magnetic field, force on a current-carrying conductor, electromagnetism and electromotive force [CURRICULUM_REQUIRES]
**Misconceptions targeting this assertion:** MIS-EL-EMF-VOLTAGE-CONFUSION-001

### EL-CONCEPT-ELECTROMAGNETIC-INDUCTION-001

**Statement (v1, APPROVED):** A changing magnetic flux through a circuit or coil induces an electromotive force (EMF) in that circuit -- the principle of electromagnetic induction.

**Direct prerequisites:** EL-CONCEPT-MAGNETIC-FLUX-001 (REQUIRED); EL-CONCEPT-EMF-001 (REQUIRED)
**Direct dependents:** EL-CONCEPT-AC-GENERATOR-001
**Curriculum mapping(s):** Describe the basic principles of generating an A.C. supply (REQUIRED_FOR); Describe the basic principles of generating an A.C. supply in terms of: a single-loop generator, sine-wave, frequency, EMF, magnetic flux (REQUIRED_FOR)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, Ch.13: magnetic flux and flux density (13.1 Faraday's Law); EMF; electric generators and the sinusoidal generated waveform (13.6) [DEFINES] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC5.4: describe the basic principles of generating an A.C. supply in terms of a single-loop generator, sine-wave, frequency, EMF and magnetic flux [CURRICULUM_REQUIRES]

### EL-CONCEPT-AC-GENERATOR-001

**Statement (v1, APPROVED):** A simple AC generator produces an alternating EMF by rotating a single loop of wire at constant speed within a magnetic field, continuously changing the flux linking the loop.

**Direct prerequisites:** EL-CONCEPT-ELECTROMAGNETIC-INDUCTION-001 (REQUIRED); EL-CONCEPT-EMF-001 (REQUIRED); EL-CONCEPT-MAGNETIC-FLUX-001 (REQUIRED)
**Direct dependents:** EL-CONCEPT-SINE-WAVE-001; EL-MOTOR-GENERATOR-COMPARE-001
**Curriculum mapping(s):** Describe the basic principles of generating an A.C. supply (REQUIRED_FOR); Describe the basic principles of generating an A.C. supply in terms of: a single-loop generator, sine-wave, frequency, EMF, magnetic flux (REQUIRED_FOR)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, Ch.13: magnetic flux and flux density (13.1 Faraday's Law); EMF; electric generators and the sinusoidal generated waveform (13.6) [DEFINES] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC5.4: describe the basic principles of generating an A.C. supply in terms of a single-loop generator, sine-wave, frequency, EMF and magnetic flux [CURRICULUM_REQUIRES]

### EL-CONCEPT-SINE-WAVE-001

**Statement (v1, APPROVED):** The EMF produced by a simple rotating-loop AC generator varies with time as a sine wave.

**Direct prerequisites:** EL-CONCEPT-AC-GENERATOR-001 (REQUIRED)
**Direct dependents:** EL-CONCEPT-AC-DC-DISTINCTION-001; EL-WAVEFORM-PERIODIC-TIME-001; EL-WAVEFORM-AMPLITUDE-001; EL-WAVEFORM-RMS-001; EL-WAVEFORM-AVERAGE-VALUE-001
**Curriculum mapping(s):** Describe the basic principles of generating an A.C. supply (REQUIRED_FOR); Describe the basic principles of generating an A.C. supply in terms of: a single-loop generator, sine-wave, frequency, EMF, magnetic flux (REQUIRED_FOR)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, Ch.13: magnetic flux and flux density (13.1 Faraday's Law); EMF; electric generators and the sinusoidal generated waveform (13.6) [DEFINES] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC5.4: describe the basic principles of generating an A.C. supply in terms of a single-loop generator, sine-wave, frequency, EMF and magnetic flux [CURRICULUM_REQUIRES]
**Misconceptions targeting this assertion:** MIS-EL-AC-DC-CONFUSION-001

### EL-CONCEPT-AC-DC-DISTINCTION-001

**Statement (v1, APPROVED):** Direct current (D.C.) flows in one direction with a constant value, while alternating current (A.C.) periodically reverses direction and varies in value, typically following a sine wave.

**Direct prerequisites:** EL-CONCEPT-SINE-WAVE-001 (REQUIRED); EL-CONCEPT-CURRENT-001 (REQUIRED)
**Direct dependents:** EL-CIRCUIT-AC-SUPPLY-RECOGNITION-001; EL-CIRCUIT-COMPARE-AC-DC-BEHAVIOUR-001; EL-COMPONENT-RECTIFIER-001; EL-COMPONENT-INVERTER-001
**Curriculum mapping(s):** Describe the basic principles of generating an A.C. supply (REQUIRED_FOR); Describe the basic principles of generating an A.C. supply in terms of: a single-loop generator, sine-wave, frequency, EMF, magnetic flux (REQUIRED_FOR)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, Ch.13: magnetic flux and flux density (13.1 Faraday's Law); EMF; electric generators and the sinusoidal generated waveform (13.6) [SUPPORTS] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC5.4: describe the basic principles of generating an A.C. supply in terms of a single-loop generator, sine-wave, frequency, EMF and magnetic flux [CURRICULUM_REQUIRES]
**Misconceptions targeting this assertion:** MIS-EL-AC-DC-CONFUSION-001

### EL-CIRCUIT-AC-SUPPLY-RECOGNITION-001

**Statement (v1, APPROVED):** UK domestic and industrial electrical supplies are alternating current, with a standard frequency of 50 Hz.

**Direct prerequisites:** EL-CONCEPT-AC-DC-DISTINCTION-001 (REQUIRED); EL-CONCEPT-FREQUENCY-001 (REQUIRED)
**Direct dependents:** EL-CONCEPT-PEAK-VS-RMS-SUPPLY-INTERPRETATION-001
**Curriculum mapping(s):** Describe the basic principles of generating an A.C. supply (SUPPORTS); Describe the basic principles of generating an A.C. supply in terms of: a single-loop generator, sine-wave, frequency, EMF, magnetic flux (SUPPORTS)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, Ch.13: magnetic flux and flux density (13.1 Faraday's Law); EMF; electric generators and the sinusoidal generated waveform (13.6) [SUPPORTS] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC5.4: describe the basic principles of generating an A.C. supply in terms of a single-loop generator, sine-wave, frequency, EMF and magnetic flux [CURRICULUM_REQUIRES]

### EL-WAVEFORM-PERIODIC-TIME-001

**Statement (v1, APPROVED):** Periodic time is the time taken to complete one full cycle of a repeating waveform.

**Direct prerequisites:** EL-CONCEPT-SINE-WAVE-001 (STRONG)
**Direct dependents:** EL-WAVEFORM-FREQUENCY-PERIOD-RELATIONSHIP-001; EL-INSTRUMENT-OSCILLOSCOPE-001
**Curriculum mapping(s):** Identify the characteristics of sine-waves (REQUIRED_FOR); Characteristics of a sine-wave: Periodic time (REQUIRED_FOR); Identify the characteristics of sine-waves (REQUIRED_FOR)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, Ch.13: magnetic flux and flux density (13.1 Faraday's Law); EMF; electric generators and the sinusoidal generated waveform (13.6) [DEFINES] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC5.5: identify the characteristics of sine-waves (RMS value, average value, peak-to-peak value, periodic time, frequency, amplitude) [CURRICULUM_REQUIRES]

### EL-WAVEFORM-AMPLITUDE-001

**Statement (v1, APPROVED):** Amplitude is the maximum displacement of a waveform from its zero (mean) value.

**Direct prerequisites:** EL-CONCEPT-SINE-WAVE-001 (STRONG)
**Direct dependents:** EL-WAVEFORM-PEAK-TO-PEAK-001; EL-WAVEFORM-RMS-PEAK-RELATIONSHIP-001; EL-INSTRUMENT-OSCILLOSCOPE-001
**Curriculum mapping(s):** Identify the characteristics of sine-waves (REQUIRED_FOR); Characteristics of a sine-wave: Amplitude (REQUIRED_FOR); Identify the characteristics of sine-waves (REQUIRED_FOR)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, Ch.13: magnetic flux and flux density (13.1 Faraday's Law); EMF; electric generators and the sinusoidal generated waveform (13.6) [DEFINES] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC5.5: identify the characteristics of sine-waves (RMS value, average value, peak-to-peak value, periodic time, frequency, amplitude) [CURRICULUM_REQUIRES]

### EL-WAVEFORM-PEAK-TO-PEAK-001

**Statement (v1, APPROVED):** The peak-to-peak value of a waveform is the difference between its maximum positive and maximum negative values.

**Direct prerequisites:** EL-WAVEFORM-AMPLITUDE-001 (REQUIRED)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Identify the characteristics of sine-waves (REQUIRED_FOR); Characteristics of a sine-wave: Peak to peak value (REQUIRED_FOR); Identify the characteristics of sine-waves (REQUIRED_FOR)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, Ch.13: magnetic flux and flux density (13.1 Faraday's Law); EMF; electric generators and the sinusoidal generated waveform (13.6) [DEFINES] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC5.5: identify the characteristics of sine-waves (RMS value, average value, peak-to-peak value, periodic time, frequency, amplitude) [CURRICULUM_REQUIRES]

### EL-WAVEFORM-RMS-001

**Statement (v1, APPROVED):** The RMS (root mean square) value of an alternating quantity is the value of direct current or voltage that would produce the same heating effect in a resistor.

**Direct prerequisites:** EL-CONCEPT-SINE-WAVE-001 (REQUIRED); EL-CURRENT-THERMAL-EFFECT-001 (STRONG)
**Direct dependents:** EL-WAVEFORM-RMS-PEAK-RELATIONSHIP-001
**Curriculum mapping(s):** Identify the characteristics of sine-waves (REQUIRED_FOR); Characteristics of a sine-wave: Root Mean Square (RMS) value (REQUIRED_FOR); Identify the characteristics of sine-waves (REQUIRED_FOR)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, Ch.13: magnetic flux and flux density (13.1 Faraday's Law); EMF; electric generators and the sinusoidal generated waveform (13.6) [DEFINES] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC5.5: identify the characteristics of sine-waves (RMS value, average value, peak-to-peak value, periodic time, frequency, amplitude) [CURRICULUM_REQUIRES]
**Misconceptions targeting this assertion:** MIS-EL-PEAK-RMS-CONFUSION-001

### EL-WAVEFORM-AVERAGE-VALUE-001

**Statement (v1, APPROVED):** The average value of an alternating waveform used in AC calculations is normally the average of the rectified (half-cycle) waveform, rather than the average over a full cycle.

**Direct prerequisites:** EL-CONCEPT-SINE-WAVE-001 (REQUIRED)
**Direct dependents:** EL-WAVEFORM-AVERAGE-ZERO-INTERPRETATION-001
**Curriculum mapping(s):** Identify the characteristics of sine-waves (REQUIRED_FOR); Characteristics of a sine-wave: Average value (REQUIRED_FOR); Identify the characteristics of sine-waves (REQUIRED_FOR)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, Ch.13: magnetic flux and flux density (13.1 Faraday's Law); EMF; electric generators and the sinusoidal generated waveform (13.6) [DEFINES] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC5.5: identify the characteristics of sine-waves (RMS value, average value, peak-to-peak value, periodic time, frequency, amplitude) [CURRICULUM_REQUIRES]

### EL-WAVEFORM-AVERAGE-ZERO-INTERPRETATION-001

**Statement (v1, APPROVED):** The average value of a symmetrical sine wave taken over a full cycle is zero, because the positive and negative half-cycles cancel; the non-zero 'average value' quoted for AC calculations refers to the rectified waveform.

**Direct prerequisites:** EL-WAVEFORM-AVERAGE-VALUE-001 (REQUIRED)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Identify the characteristics of sine-waves (SUPPORTS); Identify the characteristics of sine-waves (SUPPORTS)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, Ch.13: magnetic flux and flux density (13.1 Faraday's Law); EMF; electric generators and the sinusoidal generated waveform (13.6) [SUPPORTS] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC5.5: identify the characteristics of sine-waves (RMS value, average value, peak-to-peak value, periodic time, frequency, amplitude) [CURRICULUM_REQUIRES]

### EL-WAVEFORM-RMS-PEAK-RELATIONSHIP-001

**Statement (v1, APPROVED):** For a pure sine wave, the RMS value equals the peak value divided by the square root of two.

**Direct prerequisites:** EL-WAVEFORM-RMS-001 (REQUIRED); EL-WAVEFORM-AMPLITUDE-001 (REQUIRED)
**Direct dependents:** EL-WAVEFORM-RMS-CALC-001; EL-CONCEPT-PEAK-VS-RMS-SUPPLY-INTERPRETATION-001
**Curriculum mapping(s):** Identify the characteristics of sine-waves (REQUIRED_FOR); Identify the characteristics of sine-waves (REQUIRED_FOR)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, Ch.15: impedance, reactance, inductance, capacitance and power factor in AC circuits [SUPPORTS] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC5.5: identify the characteristics of sine-waves (RMS value, average value, peak-to-peak value, periodic time, frequency, amplitude) [CURRICULUM_REQUIRES]

### EL-WAVEFORM-RMS-CALC-001

**Statement (v1, APPROVED):** Calculate the RMS value of a sine wave from its peak value, or the peak value from its RMS value.

**Direct prerequisites:** EL-WAVEFORM-RMS-PEAK-RELATIONSHIP-001 (REQUIRED); FM-ALG-SUBSTITUTION-001 (REQUIRED)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Identify the characteristics of sine-waves (REQUIRED_FOR); Identify the characteristics of sine-waves (REQUIRED_FOR)
**Provenance:** City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC5.5: identify the characteristics of sine-waves (RMS value, average value, peak-to-peak value, periodic time, frequency, amplitude) [CURRICULUM_REQUIRES]

### EL-CONCEPT-PEAK-VS-RMS-SUPPLY-INTERPRETATION-001

**Statement (v1, APPROVED):** The rated voltage of an AC supply (for example 230 V) refers to its RMS value, not its peak value, which is higher.

**Direct prerequisites:** EL-WAVEFORM-RMS-PEAK-RELATIONSHIP-001 (REQUIRED); EL-CIRCUIT-AC-SUPPLY-RECOGNITION-001 (STRONG)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Identify the characteristics of sine-waves (SUPPORTS); Identify the characteristics of sine-waves (SUPPORTS)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, Ch.15: impedance, reactance, inductance, capacitance and power factor in AC circuits [SUPPORTS] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC5.5: identify the characteristics of sine-waves (RMS value, average value, peak-to-peak value, periodic time, frequency, amplitude) [CURRICULUM_REQUIRES]
**Misconceptions targeting this assertion:** MIS-EL-PEAK-RMS-CONFUSION-001

### EL-WAVEFORM-FREQUENCY-PERIOD-RELATIONSHIP-001

**Statement (v1, APPROVED):** Frequency and periodic time are reciprocals of each other: frequency equals one divided by periodic time.

**Direct prerequisites:** EL-CONCEPT-FREQUENCY-001 (REQUIRED); EL-WAVEFORM-PERIODIC-TIME-001 (REQUIRED); FM-ARITH-RECIPROCAL-001 (REQUIRED)
**Direct dependents:** EL-WAVEFORM-FREQUENCY-CALC-001
**Curriculum mapping(s):** Identify the characteristics of sine-waves (REQUIRED_FOR); Characteristics of a sine-wave: Frequency (REQUIRED_FOR); Identify the characteristics of sine-waves (REQUIRED_FOR)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, Ch.13: magnetic flux and flux density (13.1 Faraday's Law); EMF; electric generators and the sinusoidal generated waveform (13.6) [SUPPORTS] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC5.5: identify the characteristics of sine-waves (RMS value, average value, peak-to-peak value, periodic time, frequency, amplitude) [CURRICULUM_REQUIRES]

### EL-WAVEFORM-FREQUENCY-CALC-001

**Statement (v1, APPROVED):** Calculate frequency from periodic time, or periodic time from frequency, using their reciprocal relationship.

**Direct prerequisites:** EL-WAVEFORM-FREQUENCY-PERIOD-RELATIONSHIP-001 (REQUIRED); FM-ALG-SUBSTITUTION-001 (REQUIRED)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Identify the characteristics of sine-waves (REQUIRED_FOR); Identify the characteristics of sine-waves (REQUIRED_FOR)
**Provenance:** City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC5.5: identify the characteristics of sine-waves (RMS value, average value, peak-to-peak value, periodic time, frequency, amplitude) [CURRICULUM_REQUIRES]

### EL-MAGNETISM-COMPARE-PERMANENT-ELECTROMAGNET-001

**Statement (v1, APPROVED):** Compare a permanent magnet, which retains its magnetism without a current, with an electromagnet, whose magnetic field depends on a current flowing through a coil.

**Direct prerequisites:** EL-CONCEPT-ELECTROMAGNETISM-001 (REQUIRED); EL-CONCEPT-MAGNETISM-001 (REQUIRED)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Describe the magnetic effects of electrical currents (SUPPORTS); Describe the magnetic effects of electrical currents in terms of: production of a magnetic field, force on a current-carrying conductor in a magnetic field, electromagnetism, electromotive force (SUPPORTS)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, Ch.12: the magnetic field produced by a current-carrying conductor; electromagnetism [SUPPORTS] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC5.3: describe the magnetic effects of electrical currents in terms of production of a magnetic field, force on a current-carrying conductor, electromagnetism and electromotive force [CURRICULUM_REQUIRES]

### EL-INSTRUMENT-CLAMP-METER-001

**Statement (v1, APPROVED):** A clamp meter measures current without breaking the circuit, by detecting the magnetic field produced around the current-carrying conductor.

**Direct prerequisites:** EL-CONCEPT-MAGNETIC-FIELD-CURRENT-001 (REQUIRED); EL-CONCEPT-CURRENT-001 (REQUIRED)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Identify appropriate electrical instruments for the measurement of different electrical quantities (SUPPORTS); Identify appropriate electrical instruments for the measurement of different electrical quantities (SUPPORTS)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, Ch.12: the magnetic field produced by a current-carrying conductor; electromagnetism [SUPPORTS] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC2.3: identify appropriate electrical instruments for the measurement of different electrical quantities [CURRICULUM_REQUIRES]

### EL-CONCEPT-MOTOR-PRINCIPLE-001

**Statement (v1, APPROVED):** An electric motor uses the force on a current-carrying conductor in a magnetic field to produce rotational motion.

**Direct prerequisites:** EL-CONCEPT-FORCE-ON-CONDUCTOR-001 (REQUIRED)
**Direct dependents:** EL-MOTOR-GENERATOR-COMPARE-001
**Curriculum mapping(s):** Describe the magnetic effects of electrical currents (SUPPORTS); Describe the magnetic effects of electrical currents in terms of: production of a magnetic field, force on a current-carrying conductor in a magnetic field, electromagnetism, electromotive force (SUPPORTS)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, Ch.11: magnetic attraction/repulsion; force on a current-carrying conductor in a magnetic field (11.4) [SUPPORTS] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC5.3: describe the magnetic effects of electrical currents in terms of production of a magnetic field, force on a current-carrying conductor, electromagnetism and electromotive force [CURRICULUM_REQUIRES]

### EL-MOTOR-GENERATOR-COMPARE-001

**Statement (v1, APPROVED):** Compare an electric motor, which converts electrical energy into mechanical motion using force on a current-carrying conductor, with a generator, which converts mechanical motion into electrical energy using electromagnetic induction.

**Direct prerequisites:** EL-CONCEPT-MOTOR-PRINCIPLE-001 (REQUIRED); EL-CONCEPT-AC-GENERATOR-001 (REQUIRED)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Describe the basic principles of generating an A.C. supply (SUPPORTS); Describe the basic principles of generating an A.C. supply in terms of: a single-loop generator, sine-wave, frequency, EMF, magnetic flux (SUPPORTS)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, Ch.13: magnetic flux and flux density (13.1 Faraday's Law); EMF; electric generators and the sinusoidal generated waveform (13.6) [SUPPORTS] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC5.4: describe the basic principles of generating an A.C. supply in terms of a single-loop generator, sine-wave, frequency, EMF and magnetic flux [CURRICULUM_REQUIRES]

### EL-INSTRUMENT-OSCILLOSCOPE-001

**Statement (v1, APPROVED):** An oscilloscope displays how a voltage varies with time, allowing the shape, amplitude and periodic time of a waveform to be observed.

**Direct prerequisites:** EL-WAVEFORM-AMPLITUDE-001 (STRONG); EL-WAVEFORM-PERIODIC-TIME-001 (STRONG)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Identify the characteristics of sine-waves (SUPPORTS); Identify the characteristics of sine-waves (SUPPORTS)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, Ch.13: magnetic flux and flux density (13.1 Faraday's Law); EMF; electric generators and the sinusoidal generated waveform (13.6) [SUPPORTS] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC5.5: identify the characteristics of sine-waves (RMS value, average value, peak-to-peak value, periodic time, frequency, amplitude) [CURRICULUM_REQUIRES]

### EL-CIRCUIT-COMPARE-AC-DC-BEHAVIOUR-001

**Statement (v1, APPROVED):** Compare how a resistor behaves the same way under AC or DC supply (Ohm's law applies using RMS values), while an inductor or capacitor's opposition to current depends on whether the supply is AC or DC.

**Direct prerequisites:** EL-CONCEPT-AC-DC-DISTINCTION-001 (REQUIRED); EL-CONCEPT-REACTANCE-001 (REQUIRED); EL-OHM-RELATIONSHIP-001 (STRONG)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Describe the basic principles of generating an A.C. supply (SUPPORTS); Describe the basic principles of generating an A.C. supply in terms of: a single-loop generator, sine-wave, frequency, EMF, magnetic flux (SUPPORTS)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, Ch.15: impedance, reactance, inductance, capacitance and power factor in AC circuits [SUPPORTS] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC5.4: describe the basic principles of generating an A.C. supply in terms of a single-loop generator, sine-wave, frequency, EMF and magnetic flux [CURRICULUM_REQUIRES]

### EL-CIRCUIT-ZERO-RESISTANCE-INTERPRETATION-001

**Statement (v1, APPROVED):** An ideal conductor with zero resistance has zero voltage drop across it, regardless of the current flowing through it.

**Direct prerequisites:** EL-VOLTAGE-DROP-001 (REQUIRED); EL-OHM-RELATIONSHIP-001 (STRONG)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** State what is meant by the term voltage drop in relation to electrical circuits (SUPPORTS); State what is meant by the term voltage drop in relation to electrical circuits (SUPPORTS)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, 9.4: Ohm's law, V = IR, and voltage/potential difference [SUPPORTS] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC4.7: state what is meant by the term voltage drop in relation to electrical circuits [CURRICULUM_REQUIRES]

### EL-CIRCUIT-OPEN-CIRCUIT-RESISTANCE-INTERPRETATION-001

**Statement (v1, APPROVED):** An open circuit can be modelled as having infinite resistance, since no current can flow through it regardless of the applied voltage.

**Direct prerequisites:** EL-CIRCUIT-RECOGNISE-OPEN-CIRCUIT-001 (REQUIRED); EL-OHM-RELATIONSHIP-001 (STRONG)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Explain the relationship between current, voltage and resistance in parallel and series D.C. circuits (SUPPORTS); Explain the relationship between current, voltage and resistance in parallel and series D.C. circuits (SUPPORTS)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, 9.4: Ohm's law, V = IR, and voltage/potential difference [SUPPORTS] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC4.4: explain the relationship between current, voltage and resistance in parallel and series D.C. circuits [CURRICULUM_REQUIRES]

### EL-COMPONENT-RESISTOR-001

**Statement (v1, APPROVED):** A resistor is a component manufactured to provide a specific, stable value of resistance, used in circuits to limit current or to divide voltage.

**Direct prerequisites:** EL-CONCEPT-RESISTANCE-001 (REQUIRED)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** State the basic operating principles of electronic components and devices (REQUIRED_FOR); Electronic components and devices: Resistors (REQUIRED_FOR)
**Provenance:** Electric Circuits I - Direct Current (Kuphaldt) — A resistor is a component manufactured to provide a specific, stable value of resistance, used in circuits to limit current or to divide voltage [DEFINES] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC6.2: state the basic operating principles of electronic components and devices (capacitors, resistors, rectifiers, diodes, zener, LED, photo, thermistors, diacs, triacs, transistors, thyristors, invertors) [CURRICULUM_REQUIRES]

### EL-COMPONENT-CAPACITOR-001

**Statement (v1, APPROVED):** A capacitor is a component that stores electrical energy by separating charge in an electric field between two conductive plates; it opposes a sudden change in the voltage across it, charging and discharging over time rather than passing an instantaneous voltage step.

**Direct prerequisites:** EL-CONCEPT-CAPACITANCE-001 (REQUIRED)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** State the basic operating principles of electronic components and devices (REQUIRED_FOR); Electronic components and devices: Capacitors (REQUIRED_FOR)
**Provenance:** University Physics Volume 2 — University Physics Volume 2, Ch.15: impedance, reactance, inductance, capacitance and power factor in AC circuits [DEFINES] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC6.2: state the basic operating principles of electronic components and devices (capacitors, resistors, rectifiers, diodes, zener, LED, photo, thermistors, diacs, triacs, transistors, thyristors, invertors) [CURRICULUM_REQUIRES]

### EL-COMPONENT-RECTIFIER-001

**Statement (v1, APPROVED):** A rectifier circuit uses one or more diodes to convert an alternating-current supply into a direct-current (or pulsating direct-current) output.

**Direct prerequisites:** EL-CONCEPT-AC-DC-DISTINCTION-001 (STRONG)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** State the basic operating principles of electronic components and devices (REQUIRED_FOR); Electronic components and devices: Rectifiers (REQUIRED_FOR)
**Provenance:** Electric Circuits III - Semiconductors (Kuphaldt) — A rectifier circuit uses one or more diodes to convert an alternating-current input into a direct-current (or pulsating direct-current) output [DEFINES] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC6.2: state the basic operating principles of electronic components and devices (capacitors, resistors, rectifiers, diodes, zener, LED, photo, thermistors, diacs, triacs, transistors, thyristors, invertors) [CURRICULUM_REQUIRES]

### EL-COMPONENT-DIODE-001

**Statement (v1, APPROVED):** A diode is a semiconductor device formed at a p-n junction that conducts current easily in one direction (forward bias, junction narrows) and blocks current in the other direction (reverse bias, junction widens).

**Direct prerequisites:** (none — root assertion)
**Direct dependents:** EL-COMPONENT-ZENER-DIODE-001; EL-COMPONENT-LED-001; EL-COMPONENT-PHOTODIODE-001; EL-APPLICATION-TELEPHONE-001
**Curriculum mapping(s):** State the basic operating principles of electronic components and devices (REQUIRED_FOR); Electronic components and devices: Diodes (REQUIRED_FOR)
**Provenance:** University Physics Volume 3 — A p-n junction diode's depletion layer narrows under forward bias (allowing current to flow easily) and widens under reverse bias (significantly reducing current flow), giving the diode its one-way-conduction behaviour [DEFINES] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC6.2: state the basic operating principles of electronic components and devices (capacitors, resistors, rectifiers, diodes, zener, LED, photo, thermistors, diacs, triacs, transistors, thyristors, invertors) [CURRICULUM_REQUIRES]
**Misconceptions targeting this assertion:** MIS-EL-DIODE-DIRECTION-CONFUSION-001

### EL-COMPONENT-ZENER-DIODE-001

**Statement (v1, APPROVED):** A Zener diode is a special-purpose diode designed to be operated in reverse breakdown at a well-defined breakdown voltage without damage, so it maintains a substantially constant voltage across itself and can be used to regulate voltage.

**Direct prerequisites:** EL-COMPONENT-DIODE-001 (REQUIRED)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** State the basic operating principles of electronic components and devices (REQUIRED_FOR); Electronic components and devices: Zener (REQUIRED_FOR)
**Provenance:** Electric Circuits III - Semiconductors (Kuphaldt) — A Zener diode is a special-purpose diode designed to operate in reverse breakdown at a well-defined breakdown voltage without being damaged, so it maintains a substantially constant voltage across itself and can be used to regulate voltage [DEFINES] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC6.2: state the basic operating principles of electronic components and devices (capacitors, resistors, rectifiers, diodes, zener, LED, photo, thermistors, diacs, triacs, transistors, thyristors, invertors) [CURRICULUM_REQUIRES]

### EL-COMPONENT-LED-001

**Statement (v1, APPROVED):** A light-emitting diode (LED) produces light by electroluminescence: when forward-biased, recombination of electrons and holes at the junction releases energy as photons.

**Direct prerequisites:** EL-COMPONENT-DIODE-001 (REQUIRED)
**Direct dependents:** EL-APPLICATION-SECURITY-ALARM-001; EL-APPLICATION-TELEPHONE-001
**Curriculum mapping(s):** State the basic operating principles of electronic components and devices (REQUIRED_FOR); Electronic components and devices: LED (REQUIRED_FOR)
**Provenance:** Electric Circuits III - Semiconductors (Kuphaldt) — A light-emitting diode (LED) produces light by electroluminescence when forward-biased (recombination of electrons and holes in the junction yields photons); a photodiode is optimised to generate a photocurrent in response to incident light [DEFINES] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC6.2: state the basic operating principles of electronic components and devices (capacitors, resistors, rectifiers, diodes, zener, LED, photo, thermistors, diacs, triacs, transistors, thyristors, invertors) [CURRICULUM_REQUIRES]

### EL-COMPONENT-PHOTODIODE-001

**Statement (v1, APPROVED):** A photodiode is a diode optimised to generate a photocurrent in response to incident light falling on its junction, allowing it to detect or measure light.

**Direct prerequisites:** EL-COMPONENT-DIODE-001 (REQUIRED)
**Direct dependents:** EL-APPLICATION-SECURITY-ALARM-001
**Curriculum mapping(s):** State the basic operating principles of electronic components and devices (REQUIRED_FOR); Electronic components and devices: Photo (REQUIRED_FOR)
**Provenance:** Electric Circuits III - Semiconductors (Kuphaldt) — A light-emitting diode (LED) produces light by electroluminescence when forward-biased (recombination of electrons and holes in the junction yields photons); a photodiode is optimised to generate a photocurrent in response to incident light [DEFINES] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC6.2: state the basic operating principles of electronic components and devices (capacitors, resistors, rectifiers, diodes, zener, LED, photo, thermistors, diacs, triacs, transistors, thyristors, invertors) [CURRICULUM_REQUIRES]

### EL-COMPONENT-THERMISTOR-001

**Statement (v1, APPROVED):** An NTC (negative-temperature-coefficient) thermistor's electrical resistance decreases as its temperature increases, allowing it to be used as a temperature-sensing component.

**Direct prerequisites:** (none — root assertion)
**Direct dependents:** EL-APPLICATION-HEATING-BOILER-CONTROL-001
**Curriculum mapping(s):** State the basic operating principles of electronic components and devices (REQUIRED_FOR); Electronic components and devices: Thermistors (REQUIRED_FOR)
**Provenance:** NTC Thermistors Application Note — An NTC (negative temperature coefficient) thermistor's electrical resistance decreases as its temperature increases; applications include temperature sensing/measurement, inrush-current limiting and temperature compensation [DEFINES] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC6.2: state the basic operating principles of electronic components and devices (capacitors, resistors, rectifiers, diodes, zener, LED, photo, thermistors, diacs, triacs, transistors, thyristors, invertors) [CURRICULUM_REQUIRES]

### EL-COMPONENT-DIAC-001

**Statement (v1, APPROVED):** A DIAC is a bidirectional thyristor that remains a high-impedance, non-conducting device until the voltage across it exceeds its breakover voltage, at which point it switches into conduction in either direction; it is almost never used alone, but to trigger other thyristor devices.

**Direct prerequisites:** (none — root assertion)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** State the basic operating principles of electronic components and devices (REQUIRED_FOR); Electronic components and devices: Diacs (REQUIRED_FOR)
**Provenance:** Electric Circuits III - Semiconductors (Kuphaldt) — A DIAC is a bidirectional thyristor formed from two Shockley diodes joined in antiparallel: it remains a high-impedance non-conducting device until the voltage across it exceeds its breakover voltage, at which point it switches into conduction; DIACs are almost never used alone, but in conjunction with other thyristor devices [DEFINES] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC6.2: state the basic operating principles of electronic components and devices (capacitors, resistors, rectifiers, diodes, zener, LED, photo, thermistors, diacs, triacs, transistors, thyristors, invertors) [CURRICULUM_REQUIRES]

### EL-COMPONENT-THYRISTOR-SCR-001

**Statement (v1, APPROVED):** A silicon-controlled rectifier (SCR) conducts current in one direction only once a sufficient gate current triggers it into conduction, and continues conducting until the current through it falls below the device's holding current.

**Direct prerequisites:** (none — root assertion)
**Direct dependents:** EL-COMPONENT-TRIAC-001; EL-APPLICATION-MOTOR-CONTROL-001
**Curriculum mapping(s):** State the basic operating principles of electronic components and devices (REQUIRED_FOR); Electronic components and devices: Thyristors (REQUIRED_FOR)
**Provenance:** Electric Circuits III - Semiconductors (Kuphaldt) — A silicon-controlled rectifier (SCR) conducts current in one direction once a sufficient gate current triggers it on, and continues conducting until the anode-to-cathode current falls below the device's holding current; SCRs are more commonly seen in circuits like motor drives [DEFINES] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC6.2: state the basic operating principles of electronic components and devices (capacitors, resistors, rectifiers, diodes, zener, LED, photo, thermistors, diacs, triacs, transistors, thyristors, invertors) [CURRICULUM_REQUIRES]

### EL-COMPONENT-TRIAC-001

**Statement (v1, APPROVED):** A TRIAC acts much like two silicon-controlled rectifiers connected back-to-back, allowing it to conduct current in both directions once triggered by gate current, making it suitable for controlling alternating current.

**Direct prerequisites:** EL-COMPONENT-THYRISTOR-SCR-001 (STRONG)
**Direct dependents:** EL-APPLICATION-DIMMER-SWITCH-001
**Curriculum mapping(s):** State the basic operating principles of electronic components and devices (REQUIRED_FOR); Electronic components and devices: Triacs (REQUIRED_FOR)
**Provenance:** Electric Circuits III - Semiconductors (Kuphaldt) — A TRIAC acts much like two SCRs connected back-to-back for bidirectional (AC) operation, triggered by gate current from the main-terminal-2 side; TRIACs are usually seen in simple, low-power applications like household dimmer switches [DEFINES] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC6.2: state the basic operating principles of electronic components and devices (capacitors, resistors, rectifiers, diodes, zener, LED, photo, thermistors, diacs, triacs, transistors, thyristors, invertors) [CURRICULUM_REQUIRES]

### EL-COMPONENT-TRANSISTOR-001

**Statement (v1, APPROVED):** A bipolar junction transistor is a three-terminal semiconductor device whose collector-emitter current is controlled by a much smaller base current, allowing it to act as an electrically controlled switch (fully off with no base current, fully on/saturated with sufficient base current) or as an amplifier.

**Direct prerequisites:** (none — root assertion)
**Direct dependents:** EL-APPLICATION-WIRELESS-CONTROL-001
**Curriculum mapping(s):** State the basic operating principles of electronic components and devices (REQUIRED_FOR); Electronic components and devices: Transistors (REQUIRED_FOR)
**Provenance:** Electric Circuits III - Semiconductors (Kuphaldt) — A bipolar junction transistor is a three-terminal semiconductor device whose collector-emitter current is controlled by a much smaller base current, allowing it to act as an electrically controlled switch or amplifier [DEFINES] | Electric Circuits III - Semiconductors (Kuphaldt) — With no base current, a bipolar junction transistor behaves like an open switch and blocks collector current; sufficient base current drives it into saturation, behaving like a closed switch [SUPPORTS] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC6.2: state the basic operating principles of electronic components and devices (capacitors, resistors, rectifiers, diodes, zener, LED, photo, thermistors, diacs, triacs, transistors, thyristors, invertors) [CURRICULUM_REQUIRES]

### EL-COMPONENT-INVERTER-001

**Statement (v1, APPROVED):** An inverter converts a direct-current supply into an alternating-current output, by using electronic switching circuits to switch the DC input in a controlled sequence and generate the AC voltage or current waveform.

**Direct prerequisites:** EL-CONCEPT-AC-DC-DISTINCTION-001 (STRONG)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** State the basic operating principles of electronic components and devices (REQUIRED_FOR); Electronic components and devices: Invertors (REQUIRED_FOR)
**Provenance:** 800 VA Pure Sine Wave Inverter Reference Design (SLAA602A) — A DC-to-AC power inverter converts a DC source into an AC output using electronic switching circuits (e.g. an H-bridge/full-bridge of transistors or MOSFETs) that repeatedly reverse the polarity of the DC input at a controlled frequency to produce an AC waveform [DEFINES] | ELG4139: DC to AC Converters (course material) — An inverter converts DC to AC power by switching the DC input voltage (or current) in a pre-determined sequence so as to generate an AC voltage (or current) output [SUPPORTS] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC6.2: state the basic operating principles of electronic components and devices (capacitors, resistors, rectifiers, diodes, zener, LED, photo, thermistors, diacs, triacs, transistors, thyristors, invertors) [CURRICULUM_REQUIRES]

### EL-APPLICATION-DIMMER-SWITCH-001

**Statement (v1, APPROVED):** A household dimmer switch typically uses a TRIAC to control the average power delivered to a lamp, by switching on at a controlled phase angle within each AC half-cycle.

**Direct prerequisites:** EL-COMPONENT-TRIAC-001 (REQUIRED)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Describe the function and application of electronic components that are used in electrical systems (REQUIRED_FOR); Electrical systems: Dimmer switches (REQUIRED_FOR)
**Provenance:** Electric Circuits III - Semiconductors (Kuphaldt) — A TRIAC acts much like two SCRs connected back-to-back for bidirectional (AC) operation, triggered by gate current from the main-terminal-2 side; TRIACs are usually seen in simple, low-power applications like household dimmer switches [SUPPORTS] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC6.1: describe the function and application of electronic components that are used in electrical systems (security alarms, telephones, dimmer switches, heating/boiler controls, motor control, wireless control systems) [CURRICULUM_REQUIRES]

### EL-APPLICATION-MOTOR-CONTROL-001

**Statement (v1, APPROVED):** Silicon-controlled rectifiers are commonly used in motor-control circuits to control the electrical power delivered to a motor.

**Direct prerequisites:** EL-COMPONENT-THYRISTOR-SCR-001 (REQUIRED)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Describe the function and application of electronic components that are used in electrical systems (REQUIRED_FOR); Electrical systems: Motor control (REQUIRED_FOR)
**Provenance:** Electric Circuits III - Semiconductors (Kuphaldt) — A silicon-controlled rectifier (SCR) conducts current in one direction once a sufficient gate current triggers it on, and continues conducting until the anode-to-cathode current falls below the device's holding current; SCRs are more commonly seen in circuits like motor drives [SUPPORTS] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC6.1: describe the function and application of electronic components that are used in electrical systems (security alarms, telephones, dimmer switches, heating/boiler controls, motor control, wireless control systems) [CURRICULUM_REQUIRES]

### EL-APPLICATION-HEATING-BOILER-CONTROL-001

**Statement (v1, APPROVED):** Thermistors' resistance-temperature response makes them suitable for temperature sensing in industrial and domestic control systems -- including heating and boiler controls -- providing a feedback signal the control circuit uses to regulate heating.

**Direct prerequisites:** EL-COMPONENT-THERMISTOR-001 (REQUIRED)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Describe the function and application of electronic components that are used in electrical systems (REQUIRED_FOR); Electrical systems: Heating/boiler controls (REQUIRED_FOR)
**Provenance:** NTC Thermistors Application Note — An NTC (negative temperature coefficient) thermistor's electrical resistance decreases as its temperature increases; applications include temperature sensing/measurement, inrush-current limiting and temperature compensation [SUPPORTS] | City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC6.1: describe the function and application of electronic components that are used in electrical systems (security alarms, telephones, dimmer switches, heating/boiler controls, motor control, wireless control systems) [CURRICULUM_REQUIRES]

### EL-APPLICATION-SECURITY-ALARM-001

**Statement (v1, APPROVED):** An LED's low-power visual indication and a photodiode's photocurrent response to incident light make them suitable, respectively, for status-indicator and light-beam-interruption-detection roles in applications such as a security alarm system.

**Direct prerequisites:** EL-COMPONENT-LED-001 (REQUIRED); EL-COMPONENT-PHOTODIODE-001 (REQUIRED)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Describe the function and application of electronic components that are used in electrical systems (REQUIRED_FOR); Electrical systems: Security alarms (REQUIRED_FOR)
**Provenance:** City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC6.1: describe the function and application of electronic components that are used in electrical systems (security alarms, telephones, dimmer switches, heating/boiler controls, motor control, wireless control systems) [CURRICULUM_REQUIRES]

### EL-APPLICATION-TELEPHONE-001

**Statement (v1, APPROVED):** A diode's one-way conduction makes it suitable for protecting equipment against incorrect supply polarity, and an LED's low-power visual indication makes it suitable for line/status indication -- roles applicable to telephone and communication equipment.

**Direct prerequisites:** EL-COMPONENT-DIODE-001 (REQUIRED); EL-COMPONENT-LED-001 (REQUIRED)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Describe the function and application of electronic components that are used in electrical systems (REQUIRED_FOR); Electrical systems: Telephones (REQUIRED_FOR)
**Provenance:** City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC6.1: describe the function and application of electronic components that are used in electrical systems (security alarms, telephones, dimmer switches, heating/boiler controls, motor control, wireless control systems) [CURRICULUM_REQUIRES]

### EL-APPLICATION-WIRELESS-CONTROL-001

**Statement (v1, APPROVED):** A transistor's ability to switch or amplify a small input signal makes it suitable for processing the low-power signal received from a remote transmitter, a role applicable to wireless control systems such as remote-controlled switches.

**Direct prerequisites:** EL-COMPONENT-TRANSISTOR-001 (REQUIRED)
**Direct dependents:** (none — leaf capability)
**Curriculum mapping(s):** Describe the function and application of electronic components that are used in electrical systems (REQUIRED_FOR); Electrical systems: Wireless control systems (REQUIRED_FOR)
**Provenance:** City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook — AC6.1: describe the function and application of electronic components that are used in electrical systems (security alarms, telephones, dimmer switches, heating/boiler controls, motor control, wireless control systems) [CURRICULUM_REQUIRES]

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

