# CC-19B -- Frozen Unit-202 Clean-Room Input Through the Production Generic Qualification Pipeline

**This is a mechanical execution report.** It reports what `buildStandardPipeline` (the real, unmodified production function in `packages/qualification-pipeline`) returned when called against the frozen (commit 54a9ebb) Unit-202 clean-room input. It is NOT a semantic judgement. Nothing here should be read as "correct", "validated against Unit 202", "complete curriculum", or "production-ready course" -- those determinations belong to a later, separate Project-Architect review.

## Execution identity

- Lineage: 3c9b1dd -> 20d65c6 -> ea7e8be -> 54a9ebb
- Accepted combined assembled-input hash: `4e10f5692805b0ef2a6f0c781e87d5639276c87683e284c57634489c648c4437` -- MATCHED
- Node version: v24.12.0
- Production `packages/qualification-pipeline` git tree hash: `95d5cdb063c31795276e45c77b319433d8419341` (working tree clean)
- Execution harness SHA-256: `522c9733f8eadfa10f12bb1e911d5fd9c3954870712f9ca9cb020f0d93c41338`

## Read-only provenance preflights

- **A. Public-assessment attempt trace**: sample-questions attempt found=true, permitted=true; mark-scheme attempt found=true, permitted=true; AssessmentEvidence count=0 -- **PASS**
- **B. Source-identity access trace**: unmatched source identities=0 -- **PASS**

## Semantic input invariants (verified against the frozen ledger, unchanged)

- CurriculumEvidence candidates: 139 (expected 139)
- AssessmentEvidence: 0 (expected 0)

## Profile input equality

`INPUTS_IDENTICAL = true`

(Expected, mechanically confirmed rather than assumed: AssessmentEvidence = 0, so DEGRADED_NO_ASSESSMENT's profile filter removes nothing that FULL_PUBLIC has.)

## FULL_PUBLIC profile

- Input hash before invocation: `956ea2c7b40739b2846f99301209e13a98eb50cb21c0ecd65bf7fff10f1b6ea1`
- Input hash after invocation: `956ea2c7b40739b2846f99301209e13a98eb50cb21c0ecd65bf7fff10f1b6ea1` -- unchanged
- First-run output hash: `0c3597fdb8d3a16d775705bb900f577a8dbafe4b38bea2afd0e5319d8ab89c9f`
- Second-run (determinism) output hash: `0c3597fdb8d3a16d775705bb900f577a8dbafe4b38bea2afd0e5319d8ab89c9f` -- MATCHES (deterministic)

Mechanical counts (fields exactly as emitted by `StandardPipelineResult`):

- Total candidates: 139
- Candidates by `disposition`: {"REQUIRED_EXPLICIT_CURRICULUM":139}
- Candidates by `technicalCoverageStatus`: {"NOT_REQUIRED":101,"COMPLETE":38}
- Total gaps: 209
- Gaps by `gapType`: {"EVIDENCE_NORMALIZATION_REVIEW":70,"PERFORMANCE_DEPTH_GAP":139}
- `unmatchedTechnicalTruth`: 60
- `unmatchedQualificationLevel`: 0

### FULL_PUBLIC candidates (raw, as emitted)

| candidateKey | subject | performanceType | disposition | scopeConf | depthConf | technicalTruthConf | technicalCoverageStatus | evidenceRefs | requiredFactKeys |
|---|---|---|---|---|---|---|---|---|---|
| mathematical principles::IDENTIFY | mathematical principles | IDENTIFY | REQUIRED_EXPLICIT_CURRICULUM | HIGH | NONE | NONE | NOT_REQUIRED | 1 | 0 |
| mathematical principles::APPLY | mathematical principles | APPLY | REQUIRED_EXPLICIT_CURRICULUM | HIGH | NONE | NONE | NOT_REQUIRED | 1 | 0 |
| fractions and percentages::IDENTIFY | fractions and percentages | IDENTIFY | REQUIRED_EXPLICIT_CURRICULUM | HIGH | NONE | NONE | NOT_REQUIRED | 1 | 0 |
| fractions and percentages::APPLY | fractions and percentages | APPLY | REQUIRED_EXPLICIT_CURRICULUM | HIGH | NONE | NONE | NOT_REQUIRED | 1 | 0 |
| algebra::IDENTIFY | algebra | IDENTIFY | REQUIRED_EXPLICIT_CURRICULUM | HIGH | NONE | NONE | NOT_REQUIRED | 1 | 0 |
| algebra::APPLY | algebra | APPLY | REQUIRED_EXPLICIT_CURRICULUM | HIGH | NONE | NONE | NOT_REQUIRED | 1 | 0 |
| indices::IDENTIFY | indices | IDENTIFY | REQUIRED_EXPLICIT_CURRICULUM | HIGH | NONE | NONE | NOT_REQUIRED | 1 | 0 |
| indices::APPLY | indices | APPLY | REQUIRED_EXPLICIT_CURRICULUM | HIGH | NONE | NONE | NOT_REQUIRED | 1 | 0 |
| transposition::IDENTIFY | transposition | IDENTIFY | REQUIRED_EXPLICIT_CURRICULUM | HIGH | NONE | NONE | NOT_REQUIRED | 1 | 0 |
| transposition::APPLY | transposition | APPLY | REQUIRED_EXPLICIT_CURRICULUM | HIGH | NONE | NONE | NOT_REQUIRED | 1 | 0 |
| triangles and trigonometry::IDENTIFY | triangles and trigonometry | IDENTIFY | REQUIRED_EXPLICIT_CURRICULUM | HIGH | NONE | NONE | NOT_REQUIRED | 1 | 0 |
| triangles and trigonometry::APPLY | triangles and trigonometry | APPLY | REQUIRED_EXPLICIT_CURRICULUM | HIGH | NONE | NONE | NOT_REQUIRED | 1 | 0 |
| statistics::IDENTIFY | statistics | IDENTIFY | REQUIRED_EXPLICIT_CURRICULUM | HIGH | NONE | NONE | NOT_REQUIRED | 1 | 0 |
| statistics::APPLY | statistics | APPLY | REQUIRED_EXPLICIT_CURRICULUM | HIGH | NONE | NONE | NOT_REQUIRED | 1 | 0 |
| SI units of measurement for general physical quantities::IDENTIFY | SI units of measurement for general physical quantities | IDENTIFY | REQUIRED_EXPLICIT_CURRICULUM | HIGH | NONE | NONE | NOT_REQUIRED | 1 | 0 |
| SI units of measurement for general physical quantities::APPLY | SI units of measurement for general physical quantities | APPLY | REQUIRED_EXPLICIT_CURRICULUM | HIGH | NONE | NONE | NOT_REQUIRED | 1 | 0 |
| length (SI unit)::IDENTIFY | length (SI unit) | IDENTIFY | REQUIRED_EXPLICIT_CURRICULUM | HIGH | NONE | HIGH | COMPLETE | 2 | 1 |
| length (SI unit)::APPLY | length (SI unit) | APPLY | REQUIRED_EXPLICIT_CURRICULUM | HIGH | NONE | HIGH | COMPLETE | 2 | 1 |
| area (SI unit)::IDENTIFY | area (SI unit) | IDENTIFY | REQUIRED_EXPLICIT_CURRICULUM | HIGH | NONE | HIGH | COMPLETE | 2 | 1 |
| area (SI unit)::APPLY | area (SI unit) | APPLY | REQUIRED_EXPLICIT_CURRICULUM | HIGH | NONE | HIGH | COMPLETE | 2 | 1 |
| volume (SI unit)::IDENTIFY | volume (SI unit) | IDENTIFY | REQUIRED_EXPLICIT_CURRICULUM | HIGH | NONE | HIGH | COMPLETE | 2 | 1 |
| volume (SI unit)::APPLY | volume (SI unit) | APPLY | REQUIRED_EXPLICIT_CURRICULUM | HIGH | NONE | HIGH | COMPLETE | 2 | 1 |
| mass (SI unit)::IDENTIFY | mass (SI unit) | IDENTIFY | REQUIRED_EXPLICIT_CURRICULUM | HIGH | NONE | HIGH | COMPLETE | 2 | 1 |
| mass (SI unit)::APPLY | mass (SI unit) | APPLY | REQUIRED_EXPLICIT_CURRICULUM | HIGH | NONE | HIGH | COMPLETE | 2 | 1 |
| density (SI unit)::IDENTIFY | density (SI unit) | IDENTIFY | REQUIRED_EXPLICIT_CURRICULUM | HIGH | NONE | HIGH | COMPLETE | 2 | 1 |
| density (SI unit)::APPLY | density (SI unit) | APPLY | REQUIRED_EXPLICIT_CURRICULUM | HIGH | NONE | HIGH | COMPLETE | 2 | 1 |
| time (SI unit)::IDENTIFY | time (SI unit) | IDENTIFY | REQUIRED_EXPLICIT_CURRICULUM | HIGH | NONE | HIGH | COMPLETE | 2 | 1 |
| time (SI unit)::APPLY | time (SI unit) | APPLY | REQUIRED_EXPLICIT_CURRICULUM | HIGH | NONE | HIGH | COMPLETE | 2 | 1 |
| temperature (SI unit)::IDENTIFY | temperature (SI unit) | IDENTIFY | REQUIRED_EXPLICIT_CURRICULUM | HIGH | NONE | HIGH | COMPLETE | 2 | 1 |
| temperature (SI unit)::APPLY | temperature (SI unit) | APPLY | REQUIRED_EXPLICIT_CURRICULUM | HIGH | NONE | HIGH | COMPLETE | 2 | 1 |
| velocity (SI unit)::IDENTIFY | velocity (SI unit) | IDENTIFY | REQUIRED_EXPLICIT_CURRICULUM | HIGH | NONE | HIGH | COMPLETE | 2 | 1 |
| velocity (SI unit)::APPLY | velocity (SI unit) | APPLY | REQUIRED_EXPLICIT_CURRICULUM | HIGH | NONE | HIGH | COMPLETE | 2 | 1 |
| electrical quantities (SI units)::IDENTIFY | electrical quantities (SI units) | IDENTIFY | REQUIRED_EXPLICIT_CURRICULUM | HIGH | NONE | NONE | NOT_REQUIRED | 1 | 0 |
| electrical quantities (SI units)::OTHER | electrical quantities (SI units) | OTHER | REQUIRED_EXPLICIT_CURRICULUM | HIGH | NONE | NONE | NOT_REQUIRED | 1 | 0 |
| resistance (SI unit)::IDENTIFY | resistance (SI unit) | IDENTIFY | REQUIRED_EXPLICIT_CURRICULUM | HIGH | NONE | HIGH | COMPLETE | 2 | 1 |
| resistance (SI unit)::OTHER | resistance (SI unit) | OTHER | REQUIRED_EXPLICIT_CURRICULUM | HIGH | NONE | HIGH | COMPLETE | 2 | 1 |
| resistivity (SI unit)::IDENTIFY | resistivity (SI unit) | IDENTIFY | REQUIRED_EXPLICIT_CURRICULUM | HIGH | NONE | HIGH | COMPLETE | 2 | 1 |
| resistivity (SI unit)::OTHER | resistivity (SI unit) | OTHER | REQUIRED_EXPLICIT_CURRICULUM | HIGH | NONE | HIGH | COMPLETE | 2 | 1 |
| power (SI unit)::IDENTIFY | power (SI unit) | IDENTIFY | REQUIRED_EXPLICIT_CURRICULUM | HIGH | NONE | HIGH | COMPLETE | 2 | 1 |
| power (SI unit)::OTHER | power (SI unit) | OTHER | REQUIRED_EXPLICIT_CURRICULUM | HIGH | NONE | HIGH | COMPLETE | 2 | 1 |
| frequency (SI electrical quantity)::IDENTIFY | frequency (SI electrical quantity) | IDENTIFY | REQUIRED_EXPLICIT_CURRICULUM | HIGH | NONE | HIGH | COMPLETE | 2 | 1 |
| frequency (SI electrical quantity)::OTHER | frequency (SI electrical quantity) | OTHER | REQUIRED_EXPLICIT_CURRICULUM | HIGH | NONE | HIGH | COMPLETE | 2 | 1 |
| current (SI unit)::IDENTIFY | current (SI unit) | IDENTIFY | REQUIRED_EXPLICIT_CURRICULUM | HIGH | NONE | HIGH | COMPLETE | 2 | 1 |
| current (SI unit)::OTHER | current (SI unit) | OTHER | REQUIRED_EXPLICIT_CURRICULUM | HIGH | NONE | HIGH | COMPLETE | 2 | 1 |
| voltage (SI unit)::IDENTIFY | voltage (SI unit) | IDENTIFY | REQUIRED_EXPLICIT_CURRICULUM | HIGH | NONE | HIGH | COMPLETE | 2 | 1 |
| voltage (SI unit)::OTHER | voltage (SI unit) | OTHER | REQUIRED_EXPLICIT_CURRICULUM | HIGH | NONE | HIGH | COMPLETE | 2 | 1 |
| energy (SI unit)::IDENTIFY | energy (SI unit) | IDENTIFY | REQUIRED_EXPLICIT_CURRICULUM | HIGH | NONE | HIGH | COMPLETE | 2 | 1 |
| energy (SI unit)::OTHER | energy (SI unit) | OTHER | REQUIRED_EXPLICIT_CURRICULUM | HIGH | NONE | HIGH | COMPLETE | 2 | 1 |
| impedance (SI unit)::IDENTIFY | impedance (SI unit) | IDENTIFY | REQUIRED_EXPLICIT_CURRICULUM | HIGH | NONE | HIGH | COMPLETE | 2 | 1 |
| impedance (SI unit)::OTHER | impedance (SI unit) | OTHER | REQUIRED_EXPLICIT_CURRICULUM | HIGH | NONE | HIGH | COMPLETE | 2 | 1 |
| inductance and inductive reactance (SI unit)::IDENTIFY | inductance and inductive reactance (SI unit) | IDENTIFY | REQUIRED_EXPLICIT_CURRICULUM | HIGH | NONE | HIGH | COMPLETE | 3 | 2 |
| inductance and inductive reactance (SI unit)::OTHER | inductance and inductive reactance (SI unit) | OTHER | REQUIRED_EXPLICIT_CURRICULUM | HIGH | NONE | HIGH | COMPLETE | 3 | 2 |
| capacitance and capacitive reactance (SI unit)::IDENTIFY | capacitance and capacitive reactance (SI unit) | IDENTIFY | REQUIRED_EXPLICIT_CURRICULUM | HIGH | NONE | HIGH | COMPLETE | 3 | 2 |
| capacitance and capacitive reactance (SI unit)::OTHER | capacitance and capacitive reactance (SI unit) | OTHER | REQUIRED_EXPLICIT_CURRICULUM | HIGH | NONE | HIGH | COMPLETE | 3 | 2 |
| power factor (SI unit / dimensional status)::IDENTIFY | power factor (SI unit / dimensional status) | IDENTIFY | REQUIRED_EXPLICIT_CURRICULUM | HIGH | NONE | HIGH | COMPLETE | 3 | 2 |
| power factor (SI unit / dimensional status)::OTHER | power factor (SI unit / dimensional status) | OTHER | REQUIRED_EXPLICIT_CURRICULUM | HIGH | NONE | HIGH | COMPLETE | 3 | 2 |
| electrical instruments for the measurement of electrical quantities::IDENTIFY | electrical instruments for the measurement of electrical quantities | IDENTIFY | REQUIRED_EXPLICIT_CURRICULUM | HIGH | NONE | NONE | NOT_REQUIRED | 1 | 0 |
| electrical quantities requiring instrument identification (measurement)::IDENTIFY | electrical quantities requiring instrument identification (measurement) | IDENTIFY | REQUIRED_EXPLICIT_CURRICULUM | HIGH | NONE | NONE | NOT_REQUIRED | 1 | 0 |
| instrument for measuring resistance::IDENTIFY | instrument for measuring resistance | IDENTIFY | REQUIRED_EXPLICIT_CURRICULUM | HIGH | NONE | NONE | NOT_REQUIRED | 1 | 0 |
| instrument for measuring power::IDENTIFY | instrument for measuring power | IDENTIFY | REQUIRED_EXPLICIT_CURRICULUM | HIGH | NONE | NONE | NOT_REQUIRED | 1 | 0 |
| instrument for measuring current::IDENTIFY | instrument for measuring current | IDENTIFY | REQUIRED_EXPLICIT_CURRICULUM | HIGH | NONE | NONE | NOT_REQUIRED | 1 | 0 |
| instrument for measuring voltage::IDENTIFY | instrument for measuring voltage | IDENTIFY | REQUIRED_EXPLICIT_CURRICULUM | HIGH | NONE | NONE | NOT_REQUIRED | 1 | 0 |
| instrument for measuring energy::IDENTIFY | instrument for measuring energy | IDENTIFY | REQUIRED_EXPLICIT_CURRICULUM | HIGH | NONE | NONE | NOT_REQUIRED | 1 | 0 |
| mass and weight::DEFINE | mass and weight | DEFINE | REQUIRED_EXPLICIT_CURRICULUM | HIGH | NONE | NONE | NOT_REQUIRED | 1 | 0 |
| principles of basic mechanics as applied to levers, gears and pulleys::EXPLAIN | principles of basic mechanics as applied to levers, gears and pulleys | EXPLAIN | REQUIRED_EXPLICIT_CURRICULUM | HIGH | NONE | NONE | NOT_REQUIRED | 1 | 0 |
| gears::EXPLAIN | gears | EXPLAIN | REQUIRED_EXPLICIT_CURRICULUM | HIGH | NONE | NONE | NOT_REQUIRED | 1 | 0 |
| pulleys::EXPLAIN | pulleys | EXPLAIN | REQUIRED_EXPLICIT_CURRICULUM | HIGH | NONE | NONE | NOT_REQUIRED | 1 | 0 |
| levers::EXPLAIN | levers | EXPLAIN | REQUIRED_EXPLICIT_CURRICULUM | HIGH | NONE | NONE | NOT_REQUIRED | 1 | 0 |
| lever class I::EXPLAIN | lever class I | EXPLAIN | REQUIRED_EXPLICIT_CURRICULUM | HIGH | NONE | NONE | NOT_REQUIRED | 1 | 0 |
| lever class II::EXPLAIN | lever class II | EXPLAIN | REQUIRED_EXPLICIT_CURRICULUM | HIGH | NONE | NONE | NOT_REQUIRED | 1 | 0 |
| lever class III::EXPLAIN | lever class III | EXPLAIN | REQUIRED_EXPLICIT_CURRICULUM | HIGH | NONE | NONE | NOT_REQUIRED | 1 | 0 |
| principles of force, work, energy, power and efficiency::DESCRIBE | principles of force, work, energy, power and efficiency | DESCRIBE | REQUIRED_EXPLICIT_CURRICULUM | HIGH | NONE | NONE | NOT_REQUIRED | 1 | 0 |
| force::DESCRIBE | force | DESCRIBE | REQUIRED_EXPLICIT_CURRICULUM | HIGH | NONE | NONE | NOT_REQUIRED | 1 | 0 |
| work::DESCRIBE | work | DESCRIBE | REQUIRED_EXPLICIT_CURRICULUM | HIGH | NONE | NONE | NOT_REQUIRED | 1 | 0 |
| energy (kinetic and potential)::DESCRIBE | energy (kinetic and potential) | DESCRIBE | REQUIRED_EXPLICIT_CURRICULUM | HIGH | NONE | NONE | NOT_REQUIRED | 1 | 0 |
| power (mechanical)::DESCRIBE | power (mechanical) | DESCRIBE | REQUIRED_EXPLICIT_CURRICULUM | HIGH | NONE | NONE | NOT_REQUIRED | 1 | 0 |
| efficiency::DESCRIBE | efficiency | DESCRIBE | REQUIRED_EXPLICIT_CURRICULUM | HIGH | NONE | NONE | NOT_REQUIRED | 1 | 0 |
| inter-relationships between force, work, energy, power and efficiency::DESCRIBE | inter-relationships between force, work, energy, power and efficiency | DESCRIBE | REQUIRED_EXPLICIT_CURRICULUM | HIGH | NONE | NONE | NOT_REQUIRED | 1 | 0 |
| values of mechanical energy, power and efficiency::CALCULATE | values of mechanical energy, power and efficiency | CALCULATE | REQUIRED_EXPLICIT_CURRICULUM | HIGH | NONE | NONE | NOT_REQUIRED | 1 | 0 |
| mechanical energy (calculation)::CALCULATE | mechanical energy (calculation) | CALCULATE | REQUIRED_EXPLICIT_CURRICULUM | HIGH | NONE | NONE | NOT_REQUIRED | 1 | 0 |
| power (calculation, mechanical)::CALCULATE | power (calculation, mechanical) | CALCULATE | REQUIRED_EXPLICIT_CURRICULUM | HIGH | NONE | NONE | NOT_REQUIRED | 1 | 0 |
| efficiency (calculation)::CALCULATE | efficiency (calculation) | CALCULATE | REQUIRED_EXPLICIT_CURRICULUM | HIGH | NONE | NONE | NOT_REQUIRED | 1 | 0 |
| basic principles of electron theory::DESCRIBE | basic principles of electron theory | DESCRIBE | REQUIRED_EXPLICIT_CURRICULUM | HIGH | NONE | NONE | NOT_REQUIRED | 1 | 0 |
| conductors (good electrical conductor materials)::IDENTIFY | conductors (good electrical conductor materials) | IDENTIFY | REQUIRED_EXPLICIT_CURRICULUM | HIGH | NONE | NONE | NOT_REQUIRED | 1 | 0 |
| conductors (good electrical conductor materials)::DISTINGUISH | conductors (good electrical conductor materials) | DISTINGUISH | REQUIRED_EXPLICIT_CURRICULUM | HIGH | NONE | NONE | NOT_REQUIRED | 1 | 0 |
| insulators (electrical insulator materials)::IDENTIFY | insulators (electrical insulator materials) | IDENTIFY | REQUIRED_EXPLICIT_CURRICULUM | HIGH | NONE | NONE | NOT_REQUIRED | 1 | 0 |
| insulators (electrical insulator materials)::DISTINGUISH | insulators (electrical insulator materials) | DISTINGUISH | REQUIRED_EXPLICIT_CURRICULUM | HIGH | NONE | NONE | NOT_REQUIRED | 1 | 0 |
| resistance and resistivity in relation to electrical circuits::DESCRIBE | resistance and resistivity in relation to electrical circuits | DESCRIBE | REQUIRED_EXPLICIT_CURRICULUM | HIGH | NONE | NONE | NOT_REQUIRED | 1 | 0 |
| relationship between current, voltage and resistance in parallel and series D.C. circuits::EXPLAIN | relationship between current, voltage and resistance in parallel and series D.C. circuits | EXPLAIN | REQUIRED_EXPLICIT_CURRICULUM | HIGH | NONE | NONE | NOT_REQUIRED | 1 | 0 |
| values of current, voltage and resistance in parallel and series D.C. circuits::CALCULATE | values of current, voltage and resistance in parallel and series D.C. circuits | CALCULATE | REQUIRED_EXPLICIT_CURRICULUM | HIGH | NONE | NONE | NOT_REQUIRED | 1 | 0 |
| current (calculation, D.C. circuits)::CALCULATE | current (calculation, D.C. circuits) | CALCULATE | REQUIRED_EXPLICIT_CURRICULUM | HIGH | NONE | NONE | NOT_REQUIRED | 1 | 0 |
| voltage (calculation, D.C. circuits)::CALCULATE | voltage (calculation, D.C. circuits) | CALCULATE | REQUIRED_EXPLICIT_CURRICULUM | HIGH | NONE | NONE | NOT_REQUIRED | 1 | 0 |
| resistance (calculation, D.C. circuits)::CALCULATE | resistance (calculation, D.C. circuits) | CALCULATE | REQUIRED_EXPLICIT_CURRICULUM | HIGH | NONE | NONE | NOT_REQUIRED | 1 | 0 |
| values of power in parallel and series D.C. circuits::CALCULATE | values of power in parallel and series D.C. circuits | CALCULATE | REQUIRED_EXPLICIT_CURRICULUM | HIGH | NONE | NONE | NOT_REQUIRED | 1 | 0 |
| voltage drop::STATE | voltage drop | STATE | REQUIRED_EXPLICIT_CURRICULUM | HIGH | NONE | NONE | NOT_REQUIRED | 1 | 0 |
| chemical and thermal effects of electric currents::DESCRIBE | chemical and thermal effects of electric currents | DESCRIBE | REQUIRED_EXPLICIT_CURRICULUM | HIGH | NONE | NONE | NOT_REQUIRED | 1 | 0 |
| attraction and repulsion effects of magnetism::DESCRIBE | attraction and repulsion effects of magnetism | DESCRIBE | REQUIRED_EXPLICIT_CURRICULUM | HIGH | NONE | NONE | NOT_REQUIRED | 1 | 0 |
| difference between magnetic flux and flux density::STATE | difference between magnetic flux and flux density | STATE | REQUIRED_EXPLICIT_CURRICULUM | HIGH | NONE | NONE | NOT_REQUIRED | 1 | 0 |
| magnetic effects of electrical currents::DESCRIBE | magnetic effects of electrical currents | DESCRIBE | REQUIRED_EXPLICIT_CURRICULUM | HIGH | NONE | NONE | NOT_REQUIRED | 1 | 0 |
| production of a magnetic field::DESCRIBE | production of a magnetic field | DESCRIBE | REQUIRED_EXPLICIT_CURRICULUM | HIGH | NONE | NONE | NOT_REQUIRED | 1 | 0 |
| force on a current-carrying conductor in a magnetic field::DESCRIBE | force on a current-carrying conductor in a magnetic field | DESCRIBE | REQUIRED_EXPLICIT_CURRICULUM | HIGH | NONE | NONE | NOT_REQUIRED | 1 | 0 |
| electromagnetism::DESCRIBE | electromagnetism | DESCRIBE | REQUIRED_EXPLICIT_CURRICULUM | HIGH | NONE | NONE | NOT_REQUIRED | 1 | 0 |
| electromotive force::DESCRIBE | electromotive force | DESCRIBE | REQUIRED_EXPLICIT_CURRICULUM | HIGH | NONE | NONE | NOT_REQUIRED | 1 | 0 |
| basic principles of generating an A.C. supply::DESCRIBE | basic principles of generating an A.C. supply | DESCRIBE | REQUIRED_EXPLICIT_CURRICULUM | HIGH | NONE | NONE | NOT_REQUIRED | 1 | 0 |
| single-loop generator::DESCRIBE | single-loop generator | DESCRIBE | REQUIRED_EXPLICIT_CURRICULUM | HIGH | NONE | NONE | NOT_REQUIRED | 1 | 0 |
| sine-wave (AC generation principle)::DESCRIBE | sine-wave (AC generation principle) | DESCRIBE | REQUIRED_EXPLICIT_CURRICULUM | HIGH | NONE | NONE | NOT_REQUIRED | 1 | 0 |
| frequency (AC generation principle)::DESCRIBE | frequency (AC generation principle) | DESCRIBE | REQUIRED_EXPLICIT_CURRICULUM | HIGH | NONE | NONE | NOT_REQUIRED | 1 | 0 |
| EMF (AC generation principle)::DESCRIBE | EMF (AC generation principle) | DESCRIBE | REQUIRED_EXPLICIT_CURRICULUM | HIGH | NONE | NONE | NOT_REQUIRED | 1 | 0 |
| magnetic flux (AC generation principle)::DESCRIBE | magnetic flux (AC generation principle) | DESCRIBE | REQUIRED_EXPLICIT_CURRICULUM | HIGH | NONE | NONE | NOT_REQUIRED | 1 | 0 |
| characteristics of sine-waves::IDENTIFY | characteristics of sine-waves | IDENTIFY | REQUIRED_EXPLICIT_CURRICULUM | HIGH | NONE | NONE | NOT_REQUIRED | 1 | 0 |
| RMS value (sine-wave characteristic)::IDENTIFY | RMS value (sine-wave characteristic) | IDENTIFY | REQUIRED_EXPLICIT_CURRICULUM | HIGH | NONE | NONE | NOT_REQUIRED | 1 | 0 |
| average value (sine-wave characteristic)::IDENTIFY | average value (sine-wave characteristic) | IDENTIFY | REQUIRED_EXPLICIT_CURRICULUM | HIGH | NONE | NONE | NOT_REQUIRED | 1 | 0 |
| peak to peak value (sine-wave characteristic)::IDENTIFY | peak to peak value (sine-wave characteristic) | IDENTIFY | REQUIRED_EXPLICIT_CURRICULUM | HIGH | NONE | NONE | NOT_REQUIRED | 1 | 0 |
| periodic time (sine-wave characteristic)::IDENTIFY | periodic time (sine-wave characteristic) | IDENTIFY | REQUIRED_EXPLICIT_CURRICULUM | HIGH | NONE | NONE | NOT_REQUIRED | 1 | 0 |
| frequency (sine-wave characteristic)::IDENTIFY | frequency (sine-wave characteristic) | IDENTIFY | REQUIRED_EXPLICIT_CURRICULUM | HIGH | NONE | NONE | NOT_REQUIRED | 1 | 0 |
| amplitude (sine-wave characteristic)::IDENTIFY | amplitude (sine-wave characteristic) | IDENTIFY | REQUIRED_EXPLICIT_CURRICULUM | HIGH | NONE | NONE | NOT_REQUIRED | 1 | 0 |
| function and application of electronic components used in electrical systems::DESCRIBE | function and application of electronic components used in electrical systems | DESCRIBE | REQUIRED_EXPLICIT_CURRICULUM | HIGH | NONE | NONE | NOT_REQUIRED | 1 | 0 |
| electrical systems (context for electronic component function/application)::DESCRIBE | electrical systems (context for electronic component function/application) | DESCRIBE | REQUIRED_EXPLICIT_CURRICULUM | HIGH | NONE | NONE | NOT_REQUIRED | 1 | 0 |
| electronic components function/application: security alarms::DESCRIBE | electronic components function/application: security alarms | DESCRIBE | REQUIRED_EXPLICIT_CURRICULUM | HIGH | NONE | NONE | NOT_REQUIRED | 1 | 0 |
| electronic components function/application: telephones::DESCRIBE | electronic components function/application: telephones | DESCRIBE | REQUIRED_EXPLICIT_CURRICULUM | HIGH | NONE | NONE | NOT_REQUIRED | 1 | 0 |
| electronic components function/application: dimmer switches::DESCRIBE | electronic components function/application: dimmer switches | DESCRIBE | REQUIRED_EXPLICIT_CURRICULUM | HIGH | NONE | NONE | NOT_REQUIRED | 1 | 0 |
| electronic components function/application: heating/boiler controls::DESCRIBE | electronic components function/application: heating/boiler controls | DESCRIBE | REQUIRED_EXPLICIT_CURRICULUM | HIGH | NONE | NONE | NOT_REQUIRED | 1 | 0 |
| electronic components function/application: motor control::DESCRIBE | electronic components function/application: motor control | DESCRIBE | REQUIRED_EXPLICIT_CURRICULUM | HIGH | NONE | NONE | NOT_REQUIRED | 1 | 0 |
| electronic components function/application: wireless control systems::DESCRIBE | electronic components function/application: wireless control systems | DESCRIBE | REQUIRED_EXPLICIT_CURRICULUM | HIGH | NONE | NONE | NOT_REQUIRED | 1 | 0 |
| basic operating principles of electronic components and devices::STATE | basic operating principles of electronic components and devices | STATE | REQUIRED_EXPLICIT_CURRICULUM | HIGH | NONE | NONE | NOT_REQUIRED | 1 | 0 |
| electronic components and devices::STATE | electronic components and devices | STATE | REQUIRED_EXPLICIT_CURRICULUM | HIGH | NONE | NONE | NOT_REQUIRED | 1 | 0 |
| capacitors::STATE | capacitors | STATE | REQUIRED_EXPLICIT_CURRICULUM | HIGH | NONE | NONE | NOT_REQUIRED | 1 | 0 |
| resistors::STATE | resistors | STATE | REQUIRED_EXPLICIT_CURRICULUM | HIGH | NONE | NONE | NOT_REQUIRED | 1 | 0 |
| rectifiers::STATE | rectifiers | STATE | REQUIRED_EXPLICIT_CURRICULUM | HIGH | NONE | NONE | NOT_REQUIRED | 1 | 0 |
| diodes::STATE | diodes | STATE | REQUIRED_EXPLICIT_CURRICULUM | HIGH | NONE | NONE | NOT_REQUIRED | 1 | 0 |
| Zener::STATE | Zener | STATE | REQUIRED_EXPLICIT_CURRICULUM | HIGH | NONE | NONE | NOT_REQUIRED | 1 | 0 |
| LED::STATE | LED | STATE | REQUIRED_EXPLICIT_CURRICULUM | HIGH | NONE | NONE | NOT_REQUIRED | 1 | 0 |
| photo::STATE | photo | STATE | REQUIRED_EXPLICIT_CURRICULUM | HIGH | NONE | NONE | NOT_REQUIRED | 1 | 0 |
| thermistors::STATE | thermistors | STATE | REQUIRED_EXPLICIT_CURRICULUM | HIGH | NONE | NONE | NOT_REQUIRED | 1 | 0 |
| diacs::STATE | diacs | STATE | REQUIRED_EXPLICIT_CURRICULUM | HIGH | NONE | NONE | NOT_REQUIRED | 1 | 0 |
| triacs::STATE | triacs | STATE | REQUIRED_EXPLICIT_CURRICULUM | HIGH | NONE | NONE | NOT_REQUIRED | 1 | 0 |
| transistors::STATE | transistors | STATE | REQUIRED_EXPLICIT_CURRICULUM | HIGH | NONE | NONE | NOT_REQUIRED | 1 | 0 |
| thyristors::STATE | thyristors | STATE | REQUIRED_EXPLICIT_CURRICULUM | HIGH | NONE | NONE | NOT_REQUIRED | 1 | 0 |
| invertors::STATE | invertors | STATE | REQUIRED_EXPLICIT_CURRICULUM | HIGH | NONE | NONE | NOT_REQUIRED | 1 | 0 |

### FULL_PUBLIC gaps (raw, as emitted)

| gapType | candidateKey | legitimateResolverRoles |
|---|---|---|
| EVIDENCE_NORMALIZATION_REVIEW | mass and weight::DEFINE | OFFICIAL_CURRICULUM, PUBLIC_ASSESSMENT |
| EVIDENCE_NORMALIZATION_REVIEW | mass and weight::DEFINE | OFFICIAL_CURRICULUM, PUBLIC_ASSESSMENT |
| EVIDENCE_NORMALIZATION_REVIEW | work::DESCRIBE | OFFICIAL_CURRICULUM, PUBLIC_ASSESSMENT |
| EVIDENCE_NORMALIZATION_REVIEW | energy (kinetic and potential)::DESCRIBE | OFFICIAL_CURRICULUM, PUBLIC_ASSESSMENT |
| EVIDENCE_NORMALIZATION_REVIEW | power (mechanical)::DESCRIBE | OFFICIAL_CURRICULUM, PUBLIC_ASSESSMENT |
| EVIDENCE_NORMALIZATION_REVIEW | efficiency::DESCRIBE | OFFICIAL_CURRICULUM, PUBLIC_ASSESSMENT |
| EVIDENCE_NORMALIZATION_REVIEW | mechanical energy (calculation)::CALCULATE | OFFICIAL_CURRICULUM, PUBLIC_ASSESSMENT |
| EVIDENCE_NORMALIZATION_REVIEW | power (calculation, mechanical)::CALCULATE | OFFICIAL_CURRICULUM, PUBLIC_ASSESSMENT |
| EVIDENCE_NORMALIZATION_REVIEW | efficiency (calculation)::CALCULATE | OFFICIAL_CURRICULUM, PUBLIC_ASSESSMENT |
| EVIDENCE_NORMALIZATION_REVIEW | basic principles of electron theory::DESCRIBE | OFFICIAL_CURRICULUM, PUBLIC_ASSESSMENT |
| EVIDENCE_NORMALIZATION_REVIEW | basic principles of electron theory::DESCRIBE | OFFICIAL_CURRICULUM, PUBLIC_ASSESSMENT |
| EVIDENCE_NORMALIZATION_REVIEW | conductors (good electrical conductor materials)::IDENTIFY | OFFICIAL_CURRICULUM, PUBLIC_ASSESSMENT |
| EVIDENCE_NORMALIZATION_REVIEW | conductors (good electrical conductor materials)::DISTINGUISH | OFFICIAL_CURRICULUM, PUBLIC_ASSESSMENT |
| EVIDENCE_NORMALIZATION_REVIEW | insulators (electrical insulator materials)::IDENTIFY | OFFICIAL_CURRICULUM, PUBLIC_ASSESSMENT |
| EVIDENCE_NORMALIZATION_REVIEW | insulators (electrical insulator materials)::DISTINGUISH | OFFICIAL_CURRICULUM, PUBLIC_ASSESSMENT |
| EVIDENCE_NORMALIZATION_REVIEW | resistance and resistivity in relation to electrical circuits::DESCRIBE | OFFICIAL_CURRICULUM, PUBLIC_ASSESSMENT |
| EVIDENCE_NORMALIZATION_REVIEW | resistance and resistivity in relation to electrical circuits::DESCRIBE | OFFICIAL_CURRICULUM, PUBLIC_ASSESSMENT |
| EVIDENCE_NORMALIZATION_REVIEW | relationship between current, voltage and resistance in parallel and series D.C. circuits::EXPLAIN | OFFICIAL_CURRICULUM, PUBLIC_ASSESSMENT |
| EVIDENCE_NORMALIZATION_REVIEW | relationship between current, voltage and resistance in parallel and series D.C. circuits::EXPLAIN | OFFICIAL_CURRICULUM, PUBLIC_ASSESSMENT |
| EVIDENCE_NORMALIZATION_REVIEW | relationship between current, voltage and resistance in parallel and series D.C. circuits::EXPLAIN | OFFICIAL_CURRICULUM, PUBLIC_ASSESSMENT |
| EVIDENCE_NORMALIZATION_REVIEW | values of current, voltage and resistance in parallel and series D.C. circuits::CALCULATE | OFFICIAL_CURRICULUM, PUBLIC_ASSESSMENT |
| EVIDENCE_NORMALIZATION_REVIEW | chemical and thermal effects of electric currents::DESCRIBE | OFFICIAL_CURRICULUM, PUBLIC_ASSESSMENT |
| EVIDENCE_NORMALIZATION_REVIEW | chemical and thermal effects of electric currents::DESCRIBE | OFFICIAL_CURRICULUM, PUBLIC_ASSESSMENT |
| EVIDENCE_NORMALIZATION_REVIEW | attraction and repulsion effects of magnetism::DESCRIBE | OFFICIAL_CURRICULUM, PUBLIC_ASSESSMENT |
| EVIDENCE_NORMALIZATION_REVIEW | difference between magnetic flux and flux density::STATE | OFFICIAL_CURRICULUM, PUBLIC_ASSESSMENT |
| EVIDENCE_NORMALIZATION_REVIEW | force on a current-carrying conductor in a magnetic field::DESCRIBE | OFFICIAL_CURRICULUM, PUBLIC_ASSESSMENT |
| EVIDENCE_NORMALIZATION_REVIEW | electromotive force::DESCRIBE | OFFICIAL_CURRICULUM, PUBLIC_ASSESSMENT |
| EVIDENCE_NORMALIZATION_REVIEW | EMF (AC generation principle)::DESCRIBE | OFFICIAL_CURRICULUM, PUBLIC_ASSESSMENT |
| EVIDENCE_NORMALIZATION_REVIEW | diodes::STATE | OFFICIAL_CURRICULUM, PUBLIC_ASSESSMENT |
| EVIDENCE_NORMALIZATION_REVIEW | Zener::STATE | OFFICIAL_CURRICULUM, PUBLIC_ASSESSMENT |
| EVIDENCE_NORMALIZATION_REVIEW | LED::STATE | OFFICIAL_CURRICULUM, PUBLIC_ASSESSMENT |
| EVIDENCE_NORMALIZATION_REVIEW | thermistors::STATE | OFFICIAL_CURRICULUM, PUBLIC_ASSESSMENT |
| EVIDENCE_NORMALIZATION_REVIEW | transistors::STATE | OFFICIAL_CURRICULUM, PUBLIC_ASSESSMENT |
| EVIDENCE_NORMALIZATION_REVIEW | gears::EXPLAIN | OFFICIAL_CURRICULUM, PUBLIC_ASSESSMENT |
| EVIDENCE_NORMALIZATION_REVIEW | gears::EXPLAIN | OFFICIAL_CURRICULUM, PUBLIC_ASSESSMENT |
| EVIDENCE_NORMALIZATION_REVIEW | pulleys::EXPLAIN | OFFICIAL_CURRICULUM, PUBLIC_ASSESSMENT |
| EVIDENCE_NORMALIZATION_REVIEW | pulleys::EXPLAIN | OFFICIAL_CURRICULUM, PUBLIC_ASSESSMENT |
| EVIDENCE_NORMALIZATION_REVIEW | lever class I::EXPLAIN | OFFICIAL_CURRICULUM, PUBLIC_ASSESSMENT |
| EVIDENCE_NORMALIZATION_REVIEW | lever class II::EXPLAIN | OFFICIAL_CURRICULUM, PUBLIC_ASSESSMENT |
| EVIDENCE_NORMALIZATION_REVIEW | lever class III::EXPLAIN | OFFICIAL_CURRICULUM, PUBLIC_ASSESSMENT |
| EVIDENCE_NORMALIZATION_REVIEW | force::DESCRIBE | OFFICIAL_CURRICULUM, PUBLIC_ASSESSMENT |
| EVIDENCE_NORMALIZATION_REVIEW | inter-relationships between force, work, energy, power and efficiency::DESCRIBE | OFFICIAL_CURRICULUM, PUBLIC_ASSESSMENT |
| EVIDENCE_NORMALIZATION_REVIEW | current (calculation, D.C. circuits)::CALCULATE | OFFICIAL_CURRICULUM, PUBLIC_ASSESSMENT |
| EVIDENCE_NORMALIZATION_REVIEW | voltage (calculation, D.C. circuits)::CALCULATE | OFFICIAL_CURRICULUM, PUBLIC_ASSESSMENT |
| EVIDENCE_NORMALIZATION_REVIEW | resistance (calculation, D.C. circuits)::CALCULATE | OFFICIAL_CURRICULUM, PUBLIC_ASSESSMENT |
| EVIDENCE_NORMALIZATION_REVIEW | values of power in parallel and series D.C. circuits::CALCULATE | OFFICIAL_CURRICULUM, PUBLIC_ASSESSMENT |
| EVIDENCE_NORMALIZATION_REVIEW | voltage drop::STATE | OFFICIAL_CURRICULUM, PUBLIC_ASSESSMENT |
| EVIDENCE_NORMALIZATION_REVIEW | resistors::STATE | OFFICIAL_CURRICULUM, PUBLIC_ASSESSMENT |
| EVIDENCE_NORMALIZATION_REVIEW | capacitors::STATE | OFFICIAL_CURRICULUM, PUBLIC_ASSESSMENT |
| EVIDENCE_NORMALIZATION_REVIEW | rectifiers::STATE | OFFICIAL_CURRICULUM, PUBLIC_ASSESSMENT |
| EVIDENCE_NORMALIZATION_REVIEW | diacs::STATE | OFFICIAL_CURRICULUM, PUBLIC_ASSESSMENT |
| EVIDENCE_NORMALIZATION_REVIEW | triacs::STATE | OFFICIAL_CURRICULUM, PUBLIC_ASSESSMENT |
| EVIDENCE_NORMALIZATION_REVIEW | thyristors::STATE | OFFICIAL_CURRICULUM, PUBLIC_ASSESSMENT |
| EVIDENCE_NORMALIZATION_REVIEW | invertors::STATE | OFFICIAL_CURRICULUM, PUBLIC_ASSESSMENT |
| EVIDENCE_NORMALIZATION_REVIEW | instrument for measuring resistance::IDENTIFY | OFFICIAL_CURRICULUM, PUBLIC_ASSESSMENT |
| EVIDENCE_NORMALIZATION_REVIEW | instrument for measuring current::IDENTIFY | OFFICIAL_CURRICULUM, PUBLIC_ASSESSMENT |
| EVIDENCE_NORMALIZATION_REVIEW | instrument for measuring voltage::IDENTIFY | OFFICIAL_CURRICULUM, PUBLIC_ASSESSMENT |
| EVIDENCE_NORMALIZATION_REVIEW | instrument for measuring power::IDENTIFY | OFFICIAL_CURRICULUM, PUBLIC_ASSESSMENT |
| EVIDENCE_NORMALIZATION_REVIEW | instrument for measuring energy::IDENTIFY | OFFICIAL_CURRICULUM, PUBLIC_ASSESSMENT |
| EVIDENCE_NORMALIZATION_REVIEW | production of a magnetic field::DESCRIBE | OFFICIAL_CURRICULUM, PUBLIC_ASSESSMENT |
| EVIDENCE_NORMALIZATION_REVIEW | single-loop generator::DESCRIBE | OFFICIAL_CURRICULUM, PUBLIC_ASSESSMENT |
| EVIDENCE_NORMALIZATION_REVIEW | sine-wave (AC generation principle)::DESCRIBE | OFFICIAL_CURRICULUM, PUBLIC_ASSESSMENT |
| EVIDENCE_NORMALIZATION_REVIEW | frequency (AC generation principle)::DESCRIBE | OFFICIAL_CURRICULUM, PUBLIC_ASSESSMENT |
| EVIDENCE_NORMALIZATION_REVIEW | magnetic flux (AC generation principle)::DESCRIBE | OFFICIAL_CURRICULUM, PUBLIC_ASSESSMENT |
| EVIDENCE_NORMALIZATION_REVIEW | RMS value (sine-wave characteristic)::IDENTIFY | OFFICIAL_CURRICULUM, PUBLIC_ASSESSMENT |
| EVIDENCE_NORMALIZATION_REVIEW | average value (sine-wave characteristic)::IDENTIFY | OFFICIAL_CURRICULUM, PUBLIC_ASSESSMENT |
| EVIDENCE_NORMALIZATION_REVIEW | peak to peak value (sine-wave characteristic)::IDENTIFY | OFFICIAL_CURRICULUM, PUBLIC_ASSESSMENT |
| EVIDENCE_NORMALIZATION_REVIEW | periodic time (sine-wave characteristic)::IDENTIFY | OFFICIAL_CURRICULUM, PUBLIC_ASSESSMENT |
| EVIDENCE_NORMALIZATION_REVIEW | frequency (sine-wave characteristic)::IDENTIFY | OFFICIAL_CURRICULUM, PUBLIC_ASSESSMENT |
| EVIDENCE_NORMALIZATION_REVIEW | amplitude (sine-wave characteristic)::IDENTIFY | OFFICIAL_CURRICULUM, PUBLIC_ASSESSMENT |
| PERFORMANCE_DEPTH_GAP | mathematical principles::IDENTIFY | PUBLIC_ASSESSMENT |
| PERFORMANCE_DEPTH_GAP | mathematical principles::APPLY | PUBLIC_ASSESSMENT |
| PERFORMANCE_DEPTH_GAP | fractions and percentages::IDENTIFY | PUBLIC_ASSESSMENT |
| PERFORMANCE_DEPTH_GAP | fractions and percentages::APPLY | PUBLIC_ASSESSMENT |
| PERFORMANCE_DEPTH_GAP | algebra::IDENTIFY | PUBLIC_ASSESSMENT |
| PERFORMANCE_DEPTH_GAP | algebra::APPLY | PUBLIC_ASSESSMENT |
| PERFORMANCE_DEPTH_GAP | indices::IDENTIFY | PUBLIC_ASSESSMENT |
| PERFORMANCE_DEPTH_GAP | indices::APPLY | PUBLIC_ASSESSMENT |
| PERFORMANCE_DEPTH_GAP | transposition::IDENTIFY | PUBLIC_ASSESSMENT |
| PERFORMANCE_DEPTH_GAP | transposition::APPLY | PUBLIC_ASSESSMENT |
| PERFORMANCE_DEPTH_GAP | triangles and trigonometry::IDENTIFY | PUBLIC_ASSESSMENT |
| PERFORMANCE_DEPTH_GAP | triangles and trigonometry::APPLY | PUBLIC_ASSESSMENT |
| PERFORMANCE_DEPTH_GAP | statistics::IDENTIFY | PUBLIC_ASSESSMENT |
| PERFORMANCE_DEPTH_GAP | statistics::APPLY | PUBLIC_ASSESSMENT |
| PERFORMANCE_DEPTH_GAP | SI units of measurement for general physical quantities::IDENTIFY | PUBLIC_ASSESSMENT |
| PERFORMANCE_DEPTH_GAP | SI units of measurement for general physical quantities::APPLY | PUBLIC_ASSESSMENT |
| PERFORMANCE_DEPTH_GAP | length (SI unit)::IDENTIFY | PUBLIC_ASSESSMENT |
| PERFORMANCE_DEPTH_GAP | length (SI unit)::APPLY | PUBLIC_ASSESSMENT |
| PERFORMANCE_DEPTH_GAP | area (SI unit)::IDENTIFY | PUBLIC_ASSESSMENT |
| PERFORMANCE_DEPTH_GAP | area (SI unit)::APPLY | PUBLIC_ASSESSMENT |
| PERFORMANCE_DEPTH_GAP | volume (SI unit)::IDENTIFY | PUBLIC_ASSESSMENT |
| PERFORMANCE_DEPTH_GAP | volume (SI unit)::APPLY | PUBLIC_ASSESSMENT |
| PERFORMANCE_DEPTH_GAP | mass (SI unit)::IDENTIFY | PUBLIC_ASSESSMENT |
| PERFORMANCE_DEPTH_GAP | mass (SI unit)::APPLY | PUBLIC_ASSESSMENT |
| PERFORMANCE_DEPTH_GAP | density (SI unit)::IDENTIFY | PUBLIC_ASSESSMENT |
| PERFORMANCE_DEPTH_GAP | density (SI unit)::APPLY | PUBLIC_ASSESSMENT |
| PERFORMANCE_DEPTH_GAP | time (SI unit)::IDENTIFY | PUBLIC_ASSESSMENT |
| PERFORMANCE_DEPTH_GAP | time (SI unit)::APPLY | PUBLIC_ASSESSMENT |
| PERFORMANCE_DEPTH_GAP | temperature (SI unit)::IDENTIFY | PUBLIC_ASSESSMENT |
| PERFORMANCE_DEPTH_GAP | temperature (SI unit)::APPLY | PUBLIC_ASSESSMENT |
| PERFORMANCE_DEPTH_GAP | velocity (SI unit)::IDENTIFY | PUBLIC_ASSESSMENT |
| PERFORMANCE_DEPTH_GAP | velocity (SI unit)::APPLY | PUBLIC_ASSESSMENT |
| PERFORMANCE_DEPTH_GAP | electrical quantities (SI units)::IDENTIFY | PUBLIC_ASSESSMENT |
| PERFORMANCE_DEPTH_GAP | electrical quantities (SI units)::OTHER | PUBLIC_ASSESSMENT |
| PERFORMANCE_DEPTH_GAP | resistance (SI unit)::IDENTIFY | PUBLIC_ASSESSMENT |
| PERFORMANCE_DEPTH_GAP | resistance (SI unit)::OTHER | PUBLIC_ASSESSMENT |
| PERFORMANCE_DEPTH_GAP | resistivity (SI unit)::IDENTIFY | PUBLIC_ASSESSMENT |
| PERFORMANCE_DEPTH_GAP | resistivity (SI unit)::OTHER | PUBLIC_ASSESSMENT |
| PERFORMANCE_DEPTH_GAP | power (SI unit)::IDENTIFY | PUBLIC_ASSESSMENT |
| PERFORMANCE_DEPTH_GAP | power (SI unit)::OTHER | PUBLIC_ASSESSMENT |
| PERFORMANCE_DEPTH_GAP | frequency (SI electrical quantity)::IDENTIFY | PUBLIC_ASSESSMENT |
| PERFORMANCE_DEPTH_GAP | frequency (SI electrical quantity)::OTHER | PUBLIC_ASSESSMENT |
| PERFORMANCE_DEPTH_GAP | current (SI unit)::IDENTIFY | PUBLIC_ASSESSMENT |
| PERFORMANCE_DEPTH_GAP | current (SI unit)::OTHER | PUBLIC_ASSESSMENT |
| PERFORMANCE_DEPTH_GAP | voltage (SI unit)::IDENTIFY | PUBLIC_ASSESSMENT |
| PERFORMANCE_DEPTH_GAP | voltage (SI unit)::OTHER | PUBLIC_ASSESSMENT |
| PERFORMANCE_DEPTH_GAP | energy (SI unit)::IDENTIFY | PUBLIC_ASSESSMENT |
| PERFORMANCE_DEPTH_GAP | energy (SI unit)::OTHER | PUBLIC_ASSESSMENT |
| PERFORMANCE_DEPTH_GAP | impedance (SI unit)::IDENTIFY | PUBLIC_ASSESSMENT |
| PERFORMANCE_DEPTH_GAP | impedance (SI unit)::OTHER | PUBLIC_ASSESSMENT |
| PERFORMANCE_DEPTH_GAP | inductance and inductive reactance (SI unit)::IDENTIFY | PUBLIC_ASSESSMENT |
| PERFORMANCE_DEPTH_GAP | inductance and inductive reactance (SI unit)::OTHER | PUBLIC_ASSESSMENT |
| PERFORMANCE_DEPTH_GAP | capacitance and capacitive reactance (SI unit)::IDENTIFY | PUBLIC_ASSESSMENT |
| PERFORMANCE_DEPTH_GAP | capacitance and capacitive reactance (SI unit)::OTHER | PUBLIC_ASSESSMENT |
| PERFORMANCE_DEPTH_GAP | power factor (SI unit / dimensional status)::IDENTIFY | PUBLIC_ASSESSMENT |
| PERFORMANCE_DEPTH_GAP | power factor (SI unit / dimensional status)::OTHER | PUBLIC_ASSESSMENT |
| PERFORMANCE_DEPTH_GAP | electrical instruments for the measurement of electrical quantities::IDENTIFY | PUBLIC_ASSESSMENT |
| PERFORMANCE_DEPTH_GAP | electrical quantities requiring instrument identification (measurement)::IDENTIFY | PUBLIC_ASSESSMENT |
| PERFORMANCE_DEPTH_GAP | instrument for measuring resistance::IDENTIFY | PUBLIC_ASSESSMENT |
| PERFORMANCE_DEPTH_GAP | instrument for measuring power::IDENTIFY | PUBLIC_ASSESSMENT |
| PERFORMANCE_DEPTH_GAP | instrument for measuring current::IDENTIFY | PUBLIC_ASSESSMENT |
| PERFORMANCE_DEPTH_GAP | instrument for measuring voltage::IDENTIFY | PUBLIC_ASSESSMENT |
| PERFORMANCE_DEPTH_GAP | instrument for measuring energy::IDENTIFY | PUBLIC_ASSESSMENT |
| PERFORMANCE_DEPTH_GAP | mass and weight::DEFINE | PUBLIC_ASSESSMENT |
| PERFORMANCE_DEPTH_GAP | principles of basic mechanics as applied to levers, gears and pulleys::EXPLAIN | PUBLIC_ASSESSMENT |
| PERFORMANCE_DEPTH_GAP | gears::EXPLAIN | PUBLIC_ASSESSMENT |
| PERFORMANCE_DEPTH_GAP | pulleys::EXPLAIN | PUBLIC_ASSESSMENT |
| PERFORMANCE_DEPTH_GAP | levers::EXPLAIN | PUBLIC_ASSESSMENT |
| PERFORMANCE_DEPTH_GAP | lever class I::EXPLAIN | PUBLIC_ASSESSMENT |
| PERFORMANCE_DEPTH_GAP | lever class II::EXPLAIN | PUBLIC_ASSESSMENT |
| PERFORMANCE_DEPTH_GAP | lever class III::EXPLAIN | PUBLIC_ASSESSMENT |
| PERFORMANCE_DEPTH_GAP | principles of force, work, energy, power and efficiency::DESCRIBE | PUBLIC_ASSESSMENT |
| PERFORMANCE_DEPTH_GAP | force::DESCRIBE | PUBLIC_ASSESSMENT |
| PERFORMANCE_DEPTH_GAP | work::DESCRIBE | PUBLIC_ASSESSMENT |
| PERFORMANCE_DEPTH_GAP | energy (kinetic and potential)::DESCRIBE | PUBLIC_ASSESSMENT |
| PERFORMANCE_DEPTH_GAP | power (mechanical)::DESCRIBE | PUBLIC_ASSESSMENT |
| PERFORMANCE_DEPTH_GAP | efficiency::DESCRIBE | PUBLIC_ASSESSMENT |
| PERFORMANCE_DEPTH_GAP | inter-relationships between force, work, energy, power and efficiency::DESCRIBE | PUBLIC_ASSESSMENT |
| PERFORMANCE_DEPTH_GAP | values of mechanical energy, power and efficiency::CALCULATE | PUBLIC_ASSESSMENT |
| PERFORMANCE_DEPTH_GAP | mechanical energy (calculation)::CALCULATE | PUBLIC_ASSESSMENT |
| PERFORMANCE_DEPTH_GAP | power (calculation, mechanical)::CALCULATE | PUBLIC_ASSESSMENT |
| PERFORMANCE_DEPTH_GAP | efficiency (calculation)::CALCULATE | PUBLIC_ASSESSMENT |
| PERFORMANCE_DEPTH_GAP | basic principles of electron theory::DESCRIBE | PUBLIC_ASSESSMENT |
| PERFORMANCE_DEPTH_GAP | conductors (good electrical conductor materials)::IDENTIFY | PUBLIC_ASSESSMENT |
| PERFORMANCE_DEPTH_GAP | conductors (good electrical conductor materials)::DISTINGUISH | PUBLIC_ASSESSMENT |
| PERFORMANCE_DEPTH_GAP | insulators (electrical insulator materials)::IDENTIFY | PUBLIC_ASSESSMENT |
| PERFORMANCE_DEPTH_GAP | insulators (electrical insulator materials)::DISTINGUISH | PUBLIC_ASSESSMENT |
| PERFORMANCE_DEPTH_GAP | resistance and resistivity in relation to electrical circuits::DESCRIBE | PUBLIC_ASSESSMENT |
| PERFORMANCE_DEPTH_GAP | relationship between current, voltage and resistance in parallel and series D.C. circuits::EXPLAIN | PUBLIC_ASSESSMENT |
| PERFORMANCE_DEPTH_GAP | values of current, voltage and resistance in parallel and series D.C. circuits::CALCULATE | PUBLIC_ASSESSMENT |
| PERFORMANCE_DEPTH_GAP | current (calculation, D.C. circuits)::CALCULATE | PUBLIC_ASSESSMENT |
| PERFORMANCE_DEPTH_GAP | voltage (calculation, D.C. circuits)::CALCULATE | PUBLIC_ASSESSMENT |
| PERFORMANCE_DEPTH_GAP | resistance (calculation, D.C. circuits)::CALCULATE | PUBLIC_ASSESSMENT |
| PERFORMANCE_DEPTH_GAP | values of power in parallel and series D.C. circuits::CALCULATE | PUBLIC_ASSESSMENT |
| PERFORMANCE_DEPTH_GAP | voltage drop::STATE | PUBLIC_ASSESSMENT |
| PERFORMANCE_DEPTH_GAP | chemical and thermal effects of electric currents::DESCRIBE | PUBLIC_ASSESSMENT |
| PERFORMANCE_DEPTH_GAP | attraction and repulsion effects of magnetism::DESCRIBE | PUBLIC_ASSESSMENT |
| PERFORMANCE_DEPTH_GAP | difference between magnetic flux and flux density::STATE | PUBLIC_ASSESSMENT |
| PERFORMANCE_DEPTH_GAP | magnetic effects of electrical currents::DESCRIBE | PUBLIC_ASSESSMENT |
| PERFORMANCE_DEPTH_GAP | production of a magnetic field::DESCRIBE | PUBLIC_ASSESSMENT |
| PERFORMANCE_DEPTH_GAP | force on a current-carrying conductor in a magnetic field::DESCRIBE | PUBLIC_ASSESSMENT |
| PERFORMANCE_DEPTH_GAP | electromagnetism::DESCRIBE | PUBLIC_ASSESSMENT |
| PERFORMANCE_DEPTH_GAP | electromotive force::DESCRIBE | PUBLIC_ASSESSMENT |
| PERFORMANCE_DEPTH_GAP | basic principles of generating an A.C. supply::DESCRIBE | PUBLIC_ASSESSMENT |
| PERFORMANCE_DEPTH_GAP | single-loop generator::DESCRIBE | PUBLIC_ASSESSMENT |
| PERFORMANCE_DEPTH_GAP | sine-wave (AC generation principle)::DESCRIBE | PUBLIC_ASSESSMENT |
| PERFORMANCE_DEPTH_GAP | frequency (AC generation principle)::DESCRIBE | PUBLIC_ASSESSMENT |
| PERFORMANCE_DEPTH_GAP | EMF (AC generation principle)::DESCRIBE | PUBLIC_ASSESSMENT |
| PERFORMANCE_DEPTH_GAP | magnetic flux (AC generation principle)::DESCRIBE | PUBLIC_ASSESSMENT |
| PERFORMANCE_DEPTH_GAP | characteristics of sine-waves::IDENTIFY | PUBLIC_ASSESSMENT |
| PERFORMANCE_DEPTH_GAP | RMS value (sine-wave characteristic)::IDENTIFY | PUBLIC_ASSESSMENT |
| PERFORMANCE_DEPTH_GAP | average value (sine-wave characteristic)::IDENTIFY | PUBLIC_ASSESSMENT |
| PERFORMANCE_DEPTH_GAP | peak to peak value (sine-wave characteristic)::IDENTIFY | PUBLIC_ASSESSMENT |
| PERFORMANCE_DEPTH_GAP | periodic time (sine-wave characteristic)::IDENTIFY | PUBLIC_ASSESSMENT |
| PERFORMANCE_DEPTH_GAP | frequency (sine-wave characteristic)::IDENTIFY | PUBLIC_ASSESSMENT |
| PERFORMANCE_DEPTH_GAP | amplitude (sine-wave characteristic)::IDENTIFY | PUBLIC_ASSESSMENT |
| PERFORMANCE_DEPTH_GAP | function and application of electronic components used in electrical systems::DESCRIBE | PUBLIC_ASSESSMENT |
| PERFORMANCE_DEPTH_GAP | electrical systems (context for electronic component function/application)::DESCRIBE | PUBLIC_ASSESSMENT |
| PERFORMANCE_DEPTH_GAP | electronic components function/application: security alarms::DESCRIBE | PUBLIC_ASSESSMENT |
| PERFORMANCE_DEPTH_GAP | electronic components function/application: telephones::DESCRIBE | PUBLIC_ASSESSMENT |
| PERFORMANCE_DEPTH_GAP | electronic components function/application: dimmer switches::DESCRIBE | PUBLIC_ASSESSMENT |
| PERFORMANCE_DEPTH_GAP | electronic components function/application: heating/boiler controls::DESCRIBE | PUBLIC_ASSESSMENT |
| PERFORMANCE_DEPTH_GAP | electronic components function/application: motor control::DESCRIBE | PUBLIC_ASSESSMENT |
| PERFORMANCE_DEPTH_GAP | electronic components function/application: wireless control systems::DESCRIBE | PUBLIC_ASSESSMENT |
| PERFORMANCE_DEPTH_GAP | basic operating principles of electronic components and devices::STATE | PUBLIC_ASSESSMENT |
| PERFORMANCE_DEPTH_GAP | electronic components and devices::STATE | PUBLIC_ASSESSMENT |
| PERFORMANCE_DEPTH_GAP | capacitors::STATE | PUBLIC_ASSESSMENT |
| PERFORMANCE_DEPTH_GAP | resistors::STATE | PUBLIC_ASSESSMENT |
| PERFORMANCE_DEPTH_GAP | rectifiers::STATE | PUBLIC_ASSESSMENT |
| PERFORMANCE_DEPTH_GAP | diodes::STATE | PUBLIC_ASSESSMENT |
| PERFORMANCE_DEPTH_GAP | Zener::STATE | PUBLIC_ASSESSMENT |
| PERFORMANCE_DEPTH_GAP | LED::STATE | PUBLIC_ASSESSMENT |
| PERFORMANCE_DEPTH_GAP | photo::STATE | PUBLIC_ASSESSMENT |
| PERFORMANCE_DEPTH_GAP | thermistors::STATE | PUBLIC_ASSESSMENT |
| PERFORMANCE_DEPTH_GAP | diacs::STATE | PUBLIC_ASSESSMENT |
| PERFORMANCE_DEPTH_GAP | triacs::STATE | PUBLIC_ASSESSMENT |
| PERFORMANCE_DEPTH_GAP | transistors::STATE | PUBLIC_ASSESSMENT |
| PERFORMANCE_DEPTH_GAP | thyristors::STATE | PUBLIC_ASSESSMENT |
| PERFORMANCE_DEPTH_GAP | invertors::STATE | PUBLIC_ASSESSMENT |

## DEGRADED_NO_ASSESSMENT profile

- Input hash before invocation: `956ea2c7b40739b2846f99301209e13a98eb50cb21c0ecd65bf7fff10f1b6ea1`
- Input hash after invocation: `956ea2c7b40739b2846f99301209e13a98eb50cb21c0ecd65bf7fff10f1b6ea1` -- unchanged
- First-run output hash: `0c3597fdb8d3a16d775705bb900f577a8dbafe4b38bea2afd0e5319d8ab89c9f`
- Second-run (determinism) output hash: `0c3597fdb8d3a16d775705bb900f577a8dbafe4b38bea2afd0e5319d8ab89c9f` -- MATCHES (deterministic)

Mechanical counts:

- Total candidates: 139
- Candidates by `disposition`: {"REQUIRED_EXPLICIT_CURRICULUM":139}
- Candidates by `technicalCoverageStatus`: {"NOT_REQUIRED":101,"COMPLETE":38}
- Total gaps: 209
- Gaps by `gapType`: {"EVIDENCE_NORMALIZATION_REVIEW":70,"PERFORMANCE_DEPTH_GAP":139}
- `unmatchedTechnicalTruth`: 60
- `unmatchedQualificationLevel`: 0

## Profile output equality

`OUTPUTS_IDENTICAL = true`

## Result type / top-level shape

`StandardPipelineResult` keys as actually returned: ["candidates","gaps","unmatchedQualificationLevel","unmatchedTechnicalTruth"]

## What this report does NOT say

This report does not say the resulting candidates are curriculum-correct, that course scope or depth is correct, that facts are sufficient, that Unit 202 is calibrated, or that this is ready for lessons. It says only: **the production `buildStandardPipeline` function executed against this frozen input, deterministically, without mutating its input, and this is exactly what it returned.**
