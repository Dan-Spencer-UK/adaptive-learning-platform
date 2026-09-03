# Unit 202 Knowledge-Boundary Reconciliation (CC-22)

Generated from `reports/backtests/unit202-post-hardening/CC-21-FULL-PUBLIC-INPUT.json` (frozen, read-only), against `@alp/qualification-pipeline` at HEAD 9663120 (CC-21B). 70 SemanticAdjudication and 82 KnowledgeBoundaryCertification records were constructed by this package (see `decisions.ts`) and applied to a COPY of the frozen input -- the frozen input itself is never modified.

## Summary counts

| Metric | Count |
|---|---|
| Total locked propositions (candidate rows + explicit missing-proposition rows) | 167 |
| Fully mapped (NO_GAP) | 60 |
| Missing normalized candidate | 5 |
| Missing fact requirement | 27 |
| Awaiting semantic adjudication | 0 |
| Qualification-scope evidence gaps | 4 |
| Depth/performance evidence gaps | 0 |
| Technical-truth gaps | 41 |
| Technical conflicts | 0 |
| Calibrated-exemplar public-support gaps | 12 |
| Contextual support | 0 |
| Out-of-scope/overdepth | 0 |
| Awaiting Project-Architect decision (AC2.1) | 18 |
| Candidates GOVERNED | 56 |
| Candidates PARTIAL | 26 |
| Candidates ADJUDICATION_REQUIRED | 18 |
| Candidates UNRESOLVED | 31 |
| Candidates STRUCTURALLY_DECOMPOSED | 8 |

## Gaps grouped by AC

| AC | Total rows | NO_GAP | Other gap types |
|---|---|---|---|
| AC1.1 | 16 | 0 | C_MISSING_FACT_REQUIREMENT=14, B_MISSING_NORMALIZED_CANDIDATE=2 |
| AC2.1 | 18 | 0 | AWAITING_PA_DECISION=18 |
| AC2.2 | 24 | 24 | - |
| AC2.3 | 7 | 5 | C_MISSING_FACT_REQUIREMENT=2 |
| AC3.1 | 2 | 0 | B_MISSING_NORMALIZED_CANDIDATE=2 |
| AC3.2 | 10 | 4 | C_MISSING_FACT_REQUIREMENT=1, G_MISSING_TECHNICAL_TRUTH=5 |
| AC3.3 | 7 | 5 | C_MISSING_FACT_REQUIREMENT=1, G_MISSING_TECHNICAL_TRUTH=1 |
| AC3.4 | 4 | 2 | C_MISSING_FACT_REQUIREMENT=1, G_MISSING_TECHNICAL_TRUTH=1 |
| AC4.1 | 1 | 1 | - |
| AC4.2 | 4 | 4 | - |
| AC4.3 | 1 | 1 | - |
| AC4.4 | 1 | 1 | - |
| AC4.5 | 4 | 4 | - |
| AC4.6 | 1 | 1 | - |
| AC4.7 | 1 | 0 | G_MISSING_TECHNICAL_TRUTH=1 |
| AC4.8 | 1 | 1 | - |
| AC5.1 | 1 | 0 | G_MISSING_TECHNICAL_TRUTH=1 |
| AC5.2 | 1 | 1 | - |
| AC5.3 | 11 | 0 | C_MISSING_FACT_REQUIREMENT=2, E_MISSING_QUALIFICATION_SCOPE_EVIDENCE=4, G_MISSING_TECHNICAL_TRUTH=5 |
| AC5.4 | 9 | 3 | C_MISSING_FACT_REQUIREMENT=1, G_MISSING_TECHNICAL_TRUTH=5 |
| AC5.5 | 13 | 2 | G_MISSING_TECHNICAL_TRUTH=10, B_MISSING_NORMALIZED_CANDIDATE=1 |
| AC6.1 | 13 | 0 | C_MISSING_FACT_REQUIREMENT=3, I_CALIBRATED_EXEMPLAR_NEEDS_PUBLIC_SUPPORT=10 |
| AC6.2 | 17 | 1 | C_MISSING_FACT_REQUIREMENT=2, G_MISSING_TECHNICAL_TRUTH=12, I_CALIBRATED_EXEMPLAR_NEEDS_PUBLIC_SUPPORT=2 |

## Direct answer (task section 16)

**C** -- substantial evidence collection is required.

Based on: 4 qualification-scope evidence gaps (category E) + 41 technical-truth gaps (category G) + 12 calibrated-exemplar public-support gaps (category I) = 57 evidence-collection-relevant gaps out of 167 total locked propositions. See `UNIT202-TECHNICAL-EVIDENCE-GAPS.md` for the full actionable list.

## Systemic finding: umbrella parents not structurally linked to their own content

Seven curriculum-authored "principles of..."/"basic operating principles of..." PRIMARY_REQUIREMENT candidates exist as umbrellas over real, well-evidenced sibling topics, but were never given `refinesSubject`/`parentSubject` links (or their own facts) connecting them to those siblings: `electrical instruments for the measurement of electrical quantities` (AC2.3), `principles of basic mechanics as applied to levers, gears and pulleys` (AC3.2), `principles of force, work, energy, power and efficiency` (AC3.3) and its AC3.4 sibling `values of mechanical energy, power and efficiency`, `magnetic effects of electrical currents` and `electromagnetism` (AC5.3), `basic principles of generating an A.C. supply` (AC5.4), `function and application of electronic components used in electrical systems` (AC6.1), and `basic operating principles of electronic components and devices` (AC6.2). Per CC-20A's correctly-conservative rule, a `PRIMARY_REQUIREMENT` is never treated as structurally exhausted merely because children point to it (and several of these have NO children pointing to them at all -- a parallel RANGE_CATEGORY sibling exists instead, e.g. AC2.3's dual-parent pattern). Each stays `UNRESOLVED`/`ADJUDICATION_REQUIRED`, correctly and conservatively, even though their constituent topics are individually well-governed. This is a real, recurring **evidence-authoring** pattern in the frozen Unit-202 curriculum data (not a generic-pipeline defect) -- flagged here for Project-Architect review; not corrected in this package (frozen evidence).

## Full ledger

See `UNIT202-KNOWLEDGE-BOUNDARY-RECONCILIATION.json` for the complete, machine-readable ledger (167 rows). Abbreviated view below (subject, AC, classification, gap type):

| ID | AC | Subject | Classification | Gap |
|---|---|---|---|---|
| RL-001 | AC1.1 | mathematical principles (IDENTIFY) | REQUIRED_QUALIFICATION_KNOWLEDGE | C_MISSING_FACT_REQUIREMENT |
| RL-002 | AC1.1 | mathematical principles (APPLY) | REQUIRED_QUALIFICATION_KNOWLEDGE | C_MISSING_FACT_REQUIREMENT |
| RL-003 | AC1.1 | fractions and percentages (IDENTIFY) | REQUIRED_QUALIFICATION_KNOWLEDGE | C_MISSING_FACT_REQUIREMENT |
| RL-004 | AC1.1 | fractions and percentages (APPLY) | REQUIRED_QUALIFICATION_KNOWLEDGE | C_MISSING_FACT_REQUIREMENT |
| RL-005 | AC1.1 | algebra (IDENTIFY) | REQUIRED_QUALIFICATION_KNOWLEDGE | C_MISSING_FACT_REQUIREMENT |
| RL-006 | AC1.1 | algebra (APPLY) | REQUIRED_QUALIFICATION_KNOWLEDGE | C_MISSING_FACT_REQUIREMENT |
| RL-007 | AC1.1 | indices (IDENTIFY) | REQUIRED_QUALIFICATION_KNOWLEDGE | C_MISSING_FACT_REQUIREMENT |
| RL-008 | AC1.1 | indices (APPLY) | REQUIRED_QUALIFICATION_KNOWLEDGE | C_MISSING_FACT_REQUIREMENT |
| RL-009 | AC1.1 | transposition (IDENTIFY) | REQUIRED_QUALIFICATION_KNOWLEDGE | C_MISSING_FACT_REQUIREMENT |
| RL-010 | AC1.1 | transposition (APPLY) | REQUIRED_QUALIFICATION_KNOWLEDGE | C_MISSING_FACT_REQUIREMENT |
| RL-011 | AC1.1 | triangles and trigonometry (IDENTIFY) | REQUIRED_QUALIFICATION_KNOWLEDGE | C_MISSING_FACT_REQUIREMENT |
| RL-012 | AC1.1 | triangles and trigonometry (APPLY) | REQUIRED_QUALIFICATION_KNOWLEDGE | C_MISSING_FACT_REQUIREMENT |
| RL-013 | AC1.1 | statistics (IDENTIFY) | REQUIRED_QUALIFICATION_KNOWLEDGE | C_MISSING_FACT_REQUIREMENT |
| RL-014 | AC1.1 | statistics (APPLY) | REQUIRED_QUALIFICATION_KNOWLEDGE | C_MISSING_FACT_REQUIREMENT |
| RL-015 | AC2.1 | SI units of measurement for general physical quantities (IDENTIFY) | AWAITING_PROJECT_ARCHITECT_DECISION | AWAITING_PA_DECISION |
| RL-016 | AC2.1 | SI units of measurement for general physical quantities (APPLY) | AWAITING_PROJECT_ARCHITECT_DECISION | AWAITING_PA_DECISION |
| RL-017 | AC2.1 | length (SI unit) (IDENTIFY) | AWAITING_PROJECT_ARCHITECT_DECISION | AWAITING_PA_DECISION |
| RL-018 | AC2.1 | length (SI unit) (APPLY) | AWAITING_PROJECT_ARCHITECT_DECISION | AWAITING_PA_DECISION |
| RL-019 | AC2.1 | area (SI unit) (IDENTIFY) | AWAITING_PROJECT_ARCHITECT_DECISION | AWAITING_PA_DECISION |
| RL-020 | AC2.1 | area (SI unit) (APPLY) | AWAITING_PROJECT_ARCHITECT_DECISION | AWAITING_PA_DECISION |
| RL-021 | AC2.1 | volume (SI unit) (IDENTIFY) | AWAITING_PROJECT_ARCHITECT_DECISION | AWAITING_PA_DECISION |
| RL-022 | AC2.1 | volume (SI unit) (APPLY) | AWAITING_PROJECT_ARCHITECT_DECISION | AWAITING_PA_DECISION |
| RL-023 | AC2.1 | mass (SI unit) (IDENTIFY) | AWAITING_PROJECT_ARCHITECT_DECISION | AWAITING_PA_DECISION |
| RL-024 | AC2.1 | mass (SI unit) (APPLY) | AWAITING_PROJECT_ARCHITECT_DECISION | AWAITING_PA_DECISION |
| RL-025 | AC2.1 | density (SI unit) (IDENTIFY) | AWAITING_PROJECT_ARCHITECT_DECISION | AWAITING_PA_DECISION |
| RL-026 | AC2.1 | density (SI unit) (APPLY) | AWAITING_PROJECT_ARCHITECT_DECISION | AWAITING_PA_DECISION |
| RL-027 | AC2.1 | time (SI unit) (IDENTIFY) | AWAITING_PROJECT_ARCHITECT_DECISION | AWAITING_PA_DECISION |
| RL-028 | AC2.1 | time (SI unit) (APPLY) | AWAITING_PROJECT_ARCHITECT_DECISION | AWAITING_PA_DECISION |
| RL-029 | AC2.1 | temperature (SI unit) (IDENTIFY) | AWAITING_PROJECT_ARCHITECT_DECISION | AWAITING_PA_DECISION |
| RL-030 | AC2.1 | temperature (SI unit) (APPLY) | AWAITING_PROJECT_ARCHITECT_DECISION | AWAITING_PA_DECISION |
| RL-031 | AC2.1 | velocity (SI unit) (IDENTIFY) | AWAITING_PROJECT_ARCHITECT_DECISION | AWAITING_PA_DECISION |
| RL-032 | AC2.1 | velocity (SI unit) (APPLY) | AWAITING_PROJECT_ARCHITECT_DECISION | AWAITING_PA_DECISION |
| RL-033 | AC2.2 | electrical quantities (SI units) (IDENTIFY) | REQUIRED_QUALIFICATION_KNOWLEDGE | A_NO_GAP |
| RL-034 | AC2.2 | electrical quantities (SI units) (OTHER) | REQUIRED_QUALIFICATION_KNOWLEDGE | A_NO_GAP |
| RL-035 | AC2.2 | resistance (SI unit) (IDENTIFY) | REQUIRED_QUALIFICATION_KNOWLEDGE | A_NO_GAP |
| RL-036 | AC2.2 | resistance (SI unit) (OTHER) | REQUIRED_QUALIFICATION_KNOWLEDGE | A_NO_GAP |
| RL-037 | AC2.2 | resistivity (SI unit) (IDENTIFY) | REQUIRED_QUALIFICATION_KNOWLEDGE | A_NO_GAP |
| RL-038 | AC2.2 | resistivity (SI unit) (OTHER) | REQUIRED_QUALIFICATION_KNOWLEDGE | A_NO_GAP |
| RL-039 | AC2.2 | power (SI unit) (IDENTIFY) | REQUIRED_QUALIFICATION_KNOWLEDGE | A_NO_GAP |
| RL-040 | AC2.2 | power (SI unit) (OTHER) | REQUIRED_QUALIFICATION_KNOWLEDGE | A_NO_GAP |
| RL-041 | AC2.2 | frequency (SI electrical quantity) (IDENTIFY) | REQUIRED_QUALIFICATION_KNOWLEDGE | A_NO_GAP |
| RL-042 | AC2.2 | frequency (SI electrical quantity) (OTHER) | REQUIRED_QUALIFICATION_KNOWLEDGE | A_NO_GAP |
| RL-043 | AC2.2 | current (SI unit) (IDENTIFY) | REQUIRED_QUALIFICATION_KNOWLEDGE | A_NO_GAP |
| RL-044 | AC2.2 | current (SI unit) (OTHER) | REQUIRED_QUALIFICATION_KNOWLEDGE | A_NO_GAP |
| RL-045 | AC2.2 | voltage (SI unit) (IDENTIFY) | REQUIRED_QUALIFICATION_KNOWLEDGE | A_NO_GAP |
| RL-046 | AC2.2 | voltage (SI unit) (OTHER) | REQUIRED_QUALIFICATION_KNOWLEDGE | A_NO_GAP |
| RL-047 | AC2.2 | energy (SI unit) (IDENTIFY) | REQUIRED_QUALIFICATION_KNOWLEDGE | A_NO_GAP |
| RL-048 | AC2.2 | energy (SI unit) (OTHER) | REQUIRED_QUALIFICATION_KNOWLEDGE | A_NO_GAP |
| RL-049 | AC2.2 | impedance (SI unit) (IDENTIFY) | REQUIRED_QUALIFICATION_KNOWLEDGE | A_NO_GAP |
| RL-050 | AC2.2 | impedance (SI unit) (OTHER) | REQUIRED_QUALIFICATION_KNOWLEDGE | A_NO_GAP |
| RL-051 | AC2.2 | inductance and inductive reactance (SI unit) (IDENTIFY) | REQUIRED_QUALIFICATION_KNOWLEDGE | A_NO_GAP |
| RL-052 | AC2.2 | inductance and inductive reactance (SI unit) (OTHER) | REQUIRED_QUALIFICATION_KNOWLEDGE | A_NO_GAP |
| RL-053 | AC2.2 | capacitance and capacitive reactance (SI unit) (IDENTIFY) | REQUIRED_QUALIFICATION_KNOWLEDGE | A_NO_GAP |
| RL-054 | AC2.2 | capacitance and capacitive reactance (SI unit) (OTHER) | REQUIRED_QUALIFICATION_KNOWLEDGE | A_NO_GAP |
| RL-055 | AC2.2 | power factor (SI unit / dimensional status) (IDENTIFY) | REQUIRED_QUALIFICATION_KNOWLEDGE | A_NO_GAP |
| RL-056 | AC2.2 | power factor (SI unit / dimensional status) (OTHER) | REQUIRED_QUALIFICATION_KNOWLEDGE | A_NO_GAP |
| RL-057 | AC2.3 | electrical instruments for the measurement of electrical quantities (IDENTIFY) | REQUIRED_QUALIFICATION_KNOWLEDGE | C_MISSING_FACT_REQUIREMENT |
| RL-058 | AC2.3 | electrical quantities requiring instrument identification (measurement) (IDENTIFY) | REQUIRED_QUALIFICATION_KNOWLEDGE | C_MISSING_FACT_REQUIREMENT |
| RL-059 | AC2.3 | instrument for measuring resistance (IDENTIFY) | REQUIRED_QUALIFICATION_KNOWLEDGE | A_NO_GAP |
| RL-060 | AC2.3 | instrument for measuring power (IDENTIFY) | REQUIRED_QUALIFICATION_KNOWLEDGE | A_NO_GAP |
| RL-061 | AC2.3 | instrument for measuring current (IDENTIFY) | REQUIRED_QUALIFICATION_KNOWLEDGE | A_NO_GAP |
| RL-062 | AC2.3 | instrument for measuring voltage (IDENTIFY) | REQUIRED_QUALIFICATION_KNOWLEDGE | A_NO_GAP |
| RL-063 | AC2.3 | instrument for measuring energy (IDENTIFY) | REQUIRED_QUALIFICATION_KNOWLEDGE | A_NO_GAP |
| RL-064 | AC3.1 | mass and weight (DEFINE) | REQUIRED_QUALIFICATION_KNOWLEDGE | B_MISSING_NORMALIZED_CANDIDATE |
| RL-065 | AC3.2 | principles of basic mechanics as applied to levers, gears and pulleys (EXPLAIN) | REQUIRED_QUALIFICATION_KNOWLEDGE | C_MISSING_FACT_REQUIREMENT |
| RL-066 | AC3.2 | gears (EXPLAIN) | REQUIRED_QUALIFICATION_KNOWLEDGE | G_MISSING_TECHNICAL_TRUTH |
| RL-067 | AC3.2 | pulleys (EXPLAIN) | REQUIRED_QUALIFICATION_KNOWLEDGE | G_MISSING_TECHNICAL_TRUTH |
| RL-068 | AC3.2 | levers (EXPLAIN) | REQUIRED_QUALIFICATION_KNOWLEDGE | A_NO_GAP |
| RL-069 | AC3.2 | lever class I (EXPLAIN) | REQUIRED_QUALIFICATION_KNOWLEDGE | A_NO_GAP |
| RL-070 | AC3.2 | lever class II (EXPLAIN) | REQUIRED_QUALIFICATION_KNOWLEDGE | A_NO_GAP |
| RL-071 | AC3.2 | lever class III (EXPLAIN) | REQUIRED_QUALIFICATION_KNOWLEDGE | A_NO_GAP |
| RL-072 | AC3.3 | principles of force, work, energy, power and efficiency (DESCRIBE) | REQUIRED_QUALIFICATION_KNOWLEDGE | C_MISSING_FACT_REQUIREMENT |
| RL-073 | AC3.3 | force (DESCRIBE) | REQUIRED_QUALIFICATION_KNOWLEDGE | A_NO_GAP |
| RL-074 | AC3.3 | work (DESCRIBE) | REQUIRED_QUALIFICATION_KNOWLEDGE | A_NO_GAP |
| RL-075 | AC3.3 | energy (kinetic and potential) (DESCRIBE) | REQUIRED_QUALIFICATION_KNOWLEDGE | G_MISSING_TECHNICAL_TRUTH |
| RL-076 | AC3.3 | power (mechanical) (DESCRIBE) | REQUIRED_QUALIFICATION_KNOWLEDGE | A_NO_GAP |
| RL-077 | AC3.3 | efficiency (DESCRIBE) | REQUIRED_QUALIFICATION_KNOWLEDGE | A_NO_GAP |
| RL-078 | AC3.3 | inter-relationships between force, work, energy, power and efficiency (DESCRIBE) | REQUIRED_QUALIFICATION_KNOWLEDGE | A_NO_GAP |
| RL-079 | AC3.4 | values of mechanical energy, power and efficiency (CALCULATE) | REQUIRED_QUALIFICATION_KNOWLEDGE | C_MISSING_FACT_REQUIREMENT |
| RL-080 | AC3.4 | mechanical energy (calculation) (CALCULATE) | REQUIRED_QUALIFICATION_KNOWLEDGE | G_MISSING_TECHNICAL_TRUTH |
| RL-081 | AC3.4 | power (calculation, mechanical) (CALCULATE) | REQUIRED_QUALIFICATION_KNOWLEDGE | A_NO_GAP |
| RL-082 | AC3.4 | efficiency (calculation) (CALCULATE) | REQUIRED_QUALIFICATION_KNOWLEDGE | A_NO_GAP |
| RL-083 | AC4.1 | basic principles of electron theory (DESCRIBE) | REQUIRED_QUALIFICATION_KNOWLEDGE | A_NO_GAP |
| RL-084 | AC4.2 | conductors (good electrical conductor materials) (IDENTIFY) | REQUIRED_QUALIFICATION_KNOWLEDGE | A_NO_GAP |
| RL-085 | AC4.2 | conductors (good electrical conductor materials) (DISTINGUISH) | REQUIRED_QUALIFICATION_KNOWLEDGE | A_NO_GAP |
| RL-086 | AC4.2 | insulators (electrical insulator materials) (IDENTIFY) | REQUIRED_QUALIFICATION_KNOWLEDGE | A_NO_GAP |
| RL-087 | AC4.2 | insulators (electrical insulator materials) (DISTINGUISH) | REQUIRED_QUALIFICATION_KNOWLEDGE | A_NO_GAP |
| RL-088 | AC4.3 | resistance and resistivity in relation to electrical circuits (DESCRIBE) | REQUIRED_QUALIFICATION_KNOWLEDGE | A_NO_GAP |
| RL-089 | AC4.4 | relationship between current, voltage and resistance in parallel and series D.C. circuits (EXPLAIN) | REQUIRED_QUALIFICATION_KNOWLEDGE | A_NO_GAP |
| RL-090 | AC4.5 | values of current, voltage and resistance in parallel and series D.C. circuits (CALCULATE) | REQUIRED_QUALIFICATION_KNOWLEDGE | A_NO_GAP |
| RL-091 | AC4.5 | current (calculation, D.C. circuits) (CALCULATE) | REQUIRED_QUALIFICATION_KNOWLEDGE | A_NO_GAP |
| RL-092 | AC4.5 | voltage (calculation, D.C. circuits) (CALCULATE) | REQUIRED_QUALIFICATION_KNOWLEDGE | A_NO_GAP |
| RL-093 | AC4.5 | resistance (calculation, D.C. circuits) (CALCULATE) | REQUIRED_QUALIFICATION_KNOWLEDGE | A_NO_GAP |
| RL-094 | AC4.6 | values of power in parallel and series D.C. circuits (CALCULATE) | REQUIRED_QUALIFICATION_KNOWLEDGE | A_NO_GAP |
| RL-095 | AC4.7 | voltage drop (STATE) | REQUIRED_QUALIFICATION_KNOWLEDGE | G_MISSING_TECHNICAL_TRUTH |
| RL-096 | AC4.8 | chemical and thermal effects of electric currents (DESCRIBE) | REQUIRED_QUALIFICATION_KNOWLEDGE | A_NO_GAP |
| RL-097 | AC5.1 | attraction and repulsion effects of magnetism (DESCRIBE) | REQUIRED_QUALIFICATION_KNOWLEDGE | G_MISSING_TECHNICAL_TRUTH |
| RL-098 | AC5.2 | difference between magnetic flux and flux density (STATE) | REQUIRED_QUALIFICATION_KNOWLEDGE | A_NO_GAP |
| RL-099 | AC5.3 | magnetic effects of electrical currents (DESCRIBE) | REQUIRED_QUALIFICATION_KNOWLEDGE | C_MISSING_FACT_REQUIREMENT |
| RL-100 | AC5.3 | production of a magnetic field (DESCRIBE) | REQUIRED_QUALIFICATION_KNOWLEDGE | E_MISSING_QUALIFICATION_SCOPE_EVIDENCE |
| RL-101 | AC5.3 | force on a current-carrying conductor in a magnetic field (DESCRIBE) | REQUIRED_QUALIFICATION_KNOWLEDGE | G_MISSING_TECHNICAL_TRUTH |
| RL-102 | AC5.3 | electromagnetism (DESCRIBE) | REQUIRED_QUALIFICATION_KNOWLEDGE | C_MISSING_FACT_REQUIREMENT |
| RL-103 | AC5.3 | electromotive force (DESCRIBE) | REQUIRED_QUALIFICATION_KNOWLEDGE | G_MISSING_TECHNICAL_TRUTH |
| RL-104 | AC5.4 | basic principles of generating an A.C. supply (DESCRIBE) | REQUIRED_QUALIFICATION_KNOWLEDGE | C_MISSING_FACT_REQUIREMENT |
| RL-105 | AC5.4 | single-loop generator (DESCRIBE) | REQUIRED_QUALIFICATION_KNOWLEDGE | G_MISSING_TECHNICAL_TRUTH |
| RL-106 | AC5.4 | sine-wave (AC generation principle) (DESCRIBE) | REQUIRED_QUALIFICATION_KNOWLEDGE | A_NO_GAP |
| RL-107 | AC5.4 | frequency (AC generation principle) (DESCRIBE) | REQUIRED_QUALIFICATION_KNOWLEDGE | G_MISSING_TECHNICAL_TRUTH |
| RL-108 | AC5.4 | EMF (AC generation principle) (DESCRIBE) | REQUIRED_QUALIFICATION_KNOWLEDGE | A_NO_GAP |
| RL-109 | AC5.4 | magnetic flux (AC generation principle) (DESCRIBE) | REQUIRED_QUALIFICATION_KNOWLEDGE | A_NO_GAP |
| RL-110 | AC5.5 | characteristics of sine-waves (IDENTIFY) | REQUIRED_QUALIFICATION_KNOWLEDGE | A_NO_GAP |
| RL-111 | AC5.5 | RMS value (sine-wave characteristic) (IDENTIFY) | REQUIRED_QUALIFICATION_KNOWLEDGE | G_MISSING_TECHNICAL_TRUTH |
| RL-112 | AC5.5 | average value (sine-wave characteristic) (IDENTIFY) | REQUIRED_QUALIFICATION_KNOWLEDGE | G_MISSING_TECHNICAL_TRUTH |
| RL-113 | AC5.5 | peak to peak value (sine-wave characteristic) (IDENTIFY) | REQUIRED_QUALIFICATION_KNOWLEDGE | G_MISSING_TECHNICAL_TRUTH |
| RL-114 | AC5.5 | periodic time (sine-wave characteristic) (IDENTIFY) | REQUIRED_QUALIFICATION_KNOWLEDGE | G_MISSING_TECHNICAL_TRUTH |
| RL-115 | AC5.5 | frequency (sine-wave characteristic) (IDENTIFY) | REQUIRED_QUALIFICATION_KNOWLEDGE | A_NO_GAP |
| RL-116 | AC5.5 | amplitude (sine-wave characteristic) (IDENTIFY) | REQUIRED_QUALIFICATION_KNOWLEDGE | G_MISSING_TECHNICAL_TRUTH |
| RL-117 | AC6.1 | function and application of electronic components used in electrical systems (DESCRIBE) | REQUIRED_QUALIFICATION_KNOWLEDGE | C_MISSING_FACT_REQUIREMENT |
| RL-118 | AC6.1 | electrical systems (context for electronic component function/application) (DESCRIBE) | REQUIRED_QUALIFICATION_KNOWLEDGE | C_MISSING_FACT_REQUIREMENT |
| RL-119 | AC6.1 | electronic components function/application: security alarms (DESCRIBE) | REQUIRED_QUALIFICATION_KNOWLEDGE | I_CALIBRATED_EXEMPLAR_NEEDS_PUBLIC_SUPPORT |
| RL-120 | AC6.1 | electronic components function/application: telephones (DESCRIBE) | REQUIRED_QUALIFICATION_KNOWLEDGE | I_CALIBRATED_EXEMPLAR_NEEDS_PUBLIC_SUPPORT |
| RL-121 | AC6.1 | electronic components function/application: dimmer switches (DESCRIBE) | REQUIRED_QUALIFICATION_KNOWLEDGE | I_CALIBRATED_EXEMPLAR_NEEDS_PUBLIC_SUPPORT |
| RL-122 | AC6.1 | electronic components function/application: heating/boiler controls (DESCRIBE) | REQUIRED_QUALIFICATION_KNOWLEDGE | I_CALIBRATED_EXEMPLAR_NEEDS_PUBLIC_SUPPORT |
| RL-123 | AC6.1 | electronic components function/application: motor control (DESCRIBE) | REQUIRED_QUALIFICATION_KNOWLEDGE | I_CALIBRATED_EXEMPLAR_NEEDS_PUBLIC_SUPPORT |
| RL-124 | AC6.1 | electronic components function/application: wireless control systems (DESCRIBE) | REQUIRED_QUALIFICATION_KNOWLEDGE | C_MISSING_FACT_REQUIREMENT |
| RL-125 | AC6.2 | basic operating principles of electronic components and devices (STATE) | REQUIRED_QUALIFICATION_KNOWLEDGE | C_MISSING_FACT_REQUIREMENT |
| RL-126 | AC6.2 | electronic components and devices (STATE) | REQUIRED_QUALIFICATION_KNOWLEDGE | A_NO_GAP |
| RL-127 | AC6.2 | capacitors (STATE) | REQUIRED_QUALIFICATION_KNOWLEDGE | G_MISSING_TECHNICAL_TRUTH |
| RL-128 | AC6.2 | resistors (STATE) | REQUIRED_QUALIFICATION_KNOWLEDGE | I_CALIBRATED_EXEMPLAR_NEEDS_PUBLIC_SUPPORT |
| RL-129 | AC6.2 | rectifiers (STATE) | REQUIRED_QUALIFICATION_KNOWLEDGE | G_MISSING_TECHNICAL_TRUTH |
| RL-130 | AC6.2 | diodes (STATE) | REQUIRED_QUALIFICATION_KNOWLEDGE | G_MISSING_TECHNICAL_TRUTH |
| RL-131 | AC6.2 | Zener (STATE) | REQUIRED_QUALIFICATION_KNOWLEDGE | G_MISSING_TECHNICAL_TRUTH |
| RL-132 | AC6.2 | LED (STATE) | REQUIRED_QUALIFICATION_KNOWLEDGE | G_MISSING_TECHNICAL_TRUTH |
| RL-133 | AC6.2 | photo (STATE) | REQUIRED_QUALIFICATION_KNOWLEDGE | C_MISSING_FACT_REQUIREMENT |
| RL-134 | AC6.2 | thermistors (STATE) | REQUIRED_QUALIFICATION_KNOWLEDGE | G_MISSING_TECHNICAL_TRUTH |
| RL-135 | AC6.2 | diacs (STATE) | REQUIRED_QUALIFICATION_KNOWLEDGE | G_MISSING_TECHNICAL_TRUTH |
| RL-136 | AC6.2 | triacs (STATE) | REQUIRED_QUALIFICATION_KNOWLEDGE | G_MISSING_TECHNICAL_TRUTH |
| RL-137 | AC6.2 | transistors (STATE) | REQUIRED_QUALIFICATION_KNOWLEDGE | G_MISSING_TECHNICAL_TRUTH |
| RL-138 | AC6.2 | thyristors (STATE) | REQUIRED_QUALIFICATION_KNOWLEDGE | G_MISSING_TECHNICAL_TRUTH |
| RL-139 | AC6.2 | invertors (STATE) | REQUIRED_QUALIFICATION_KNOWLEDGE | G_MISSING_TECHNICAL_TRUTH |
| MP-001 | AC1.1 | standard / scientific notation | REQUIRED_QUALIFICATION_KNOWLEDGE | B_MISSING_NORMALIZED_CANDIDATE |
| MP-002 | AC1.1 | engineering notation | REQUIRED_QUALIFICATION_KNOWLEDGE | B_MISSING_NORMALIZED_CANDIDATE |
| MP-003 | AC3.1 | mass/weight 'appropriate calculations' (numeric practice, distinct from the DEFINE candidate's own definitional content) | REQUIRED_QUALIFICATION_KNOWLEDGE | B_MISSING_NORMALIZED_CANDIDATE |
| MP-004 | AC3.2 | ideal power conservation in a simple machine (levers/gears/pulleys) | REQUIRED_QUALIFICATION_KNOWLEDGE | G_MISSING_TECHNICAL_TRUTH |
| MP-005 | AC3.2 | real losses reduce output in a simple machine (levers/gears/pulleys) | REQUIRED_QUALIFICATION_KNOWLEDGE | G_MISSING_TECHNICAL_TRUTH |
| MP-006 | AC3.2 | explicit rejection of the misconception that gears 'create power' | REQUIRED_QUALIFICATION_KNOWLEDGE | G_MISSING_TECHNICAL_TRUTH |
| MP-007 | AC5.3 | solenoid magnetic field | REQUIRED_QUALIFICATION_KNOWLEDGE | E_MISSING_QUALIFICATION_SCOPE_EVIDENCE |
| MP-008 | AC5.3 | solenoid polarity | REQUIRED_QUALIFICATION_KNOWLEDGE | E_MISSING_QUALIFICATION_SCOPE_EVIDENCE |
| MP-009 | AC5.3 | basic electromagnet principle | REQUIRED_QUALIFICATION_KNOWLEDGE | E_MISSING_QUALIFICATION_SCOPE_EVIDENCE |
| MP-010 | AC5.3 | Fleming left-hand rule mapping (motor effect) | REQUIRED_QUALIFICATION_KNOWLEDGE | G_MISSING_TECHNICAL_TRUTH |
| MP-011 | AC5.3 | Fleming right-hand (generator) rule mapping | REQUIRED_QUALIFICATION_KNOWLEDGE | G_MISSING_TECHNICAL_TRUTH |
| MP-012 | AC5.3 | e = Blv (motional EMF formula) | REQUIRED_QUALIFICATION_KNOWLEDGE | G_MISSING_TECHNICAL_TRUTH |
| MP-013 | AC5.4 | f = N x P (N = rev/s, P = pole pairs) | REQUIRED_QUALIFICATION_KNOWLEDGE | G_MISSING_TECHNICAL_TRUTH |
| MP-014 | AC5.4 | f = n_rpm x P / 60 (equivalent rpm form) | REQUIRED_QUALIFICATION_KNOWLEDGE | G_MISSING_TECHNICAL_TRUTH |
| MP-015 | AC5.4 | single-loop alternator/generator physical components (coil, slip rings/brushes, field source) | REQUIRED_QUALIFICATION_KNOWLEDGE | G_MISSING_TECHNICAL_TRUTH |
| MP-016 | AC5.5 | RMS = peak / sqrt(2) (approx. 0.707 x peak); peak = approx. 1.414 x RMS | REQUIRED_QUALIFICATION_KNOWLEDGE | G_MISSING_TECHNICAL_TRUTH |
| MP-017 | AC5.5 | average value over one alternation = 2/pi x peak (approx. 0.6366 x peak) | REQUIRED_QUALIFICATION_KNOWLEDGE | G_MISSING_TECHNICAL_TRUTH |
| MP-018 | AC5.5 | signed full-cycle sine-wave average = 0 | REQUIRED_QUALIFICATION_KNOWLEDGE | G_MISSING_TECHNICAL_TRUTH |
| MP-019 | AC5.5 | T = 1/f (periodic time) | REQUIRED_QUALIFICATION_KNOWLEDGE | G_MISSING_TECHNICAL_TRUTH |
| MP-020 | AC5.5 | peak-to-peak = 2 x peak | REQUIRED_QUALIFICATION_KNOWLEDGE | G_MISSING_TECHNICAL_TRUTH |
| MP-021 | AC5.5 | suitable RMS/average/period/frequency calculation practice | REQUIRED_QUALIFICATION_KNOWLEDGE | B_MISSING_NORMALIZED_CANDIDATE |
| MP-022 | AC6.1 | thyristor/SCR latching and sounder role (security-alarm exemplar) | REQUIRED_QUALIFICATION_KNOWLEDGE | I_CALIBRATED_EXEMPLAR_NEEDS_PUBLIC_SUPPORT |
| MP-023 | AC6.1 | capacitor-to-ringer function (telephone exemplar) | REQUIRED_QUALIFICATION_KNOWLEDGE | I_CALIBRATED_EXEMPLAR_NEEDS_PUBLIC_SUPPORT |
| MP-024 | AC6.1 | TRIAC AC-switching/control + DIAC triggering + basic timing/control relationship (dimmer exemplar) | REQUIRED_QUALIFICATION_KNOWLEDGE | I_CALIBRATED_EXEMPLAR_NEEDS_PUBLIC_SUPPORT |
| MP-025 | AC6.1 | thermistor sensing role (heating-control exemplar) | REQUIRED_QUALIFICATION_KNOWLEDGE | I_CALIBRATED_EXEMPLAR_NEEDS_PUBLIC_SUPPORT |
| MP-026 | AC6.1 | bridge rectifier converts AC to DC (motor-control exemplar) | REQUIRED_QUALIFICATION_KNOWLEDGE | I_CALIBRATED_EXEMPLAR_NEEDS_PUBLIC_SUPPORT |
| MP-027 | AC6.2 | 4-band resistor colour code (calibrated supporting performance) | REQUIRED_QUALIFICATION_KNOWLEDGE | I_CALIBRATED_EXEMPLAR_NEEDS_PUBLIC_SUPPORT |
| MP-028 | AC6.2 | schematic-symbol recognition (all 13 component families, cross-cutting) | REQUIRED_QUALIFICATION_KNOWLEDGE | G_MISSING_TECHNICAL_TRUTH |
