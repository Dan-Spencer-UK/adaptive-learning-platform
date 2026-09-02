# CC-19R1 Normalization Ledger -- Unit 202 Principles of Electrical Science

Clean-room proposal ledger (supersedes CC-19R's serialization/provenance representation; same clean-room experimental lineage, branch cc19-cleanroom, parent commit 20d65c6). Every record: RAW SOURCE -> NORMALIZED REQUIRED CONTENT / REVIEW-PROPOSED KNOWLEDGE / TECHNICAL TRUTH -> pipelineAcceptance = NOT_RUN_CC19R1.

Layer-B normalizedRecord values are now typed against the real @alp/qualification-pipeline production interfaces (CurriculumEvidence, OfficialCurriculumUnit, QualificationLevelEvidence, CandidateFactRequirement, SourceFactualClaim) -- see build-ledger.test.ts for the compile-time compatibility proof.

Qualification-level evidence (2 descriptors) is mechanically fanned out to one record per required candidate (see section "Qualification-level evidence" below) -- summarised, not listed record-by-record, to keep this report readable.

## LO1: Understand mathematical principles which are appropriate to electrical installation, maintenance and design work

### AC1.1

**RAW SOURCE (AC wording, page 25):** "identify and apply appropriate mathematical principles which are relevant to electrical work tasks"

**NORMALIZED REQUIRED CONTENT:**

| Candidate | Kind | Performance | Confidence | Refines |
|---|---|---|---|---|
| mathematical principles | RANGE_CATEGORY | IDENTIFY | EXPLICIT | - |
| mathematical principles | RANGE_CATEGORY | APPLY | EXPLICIT | - |
| fractions and percentages | RANGE_REQUIRED_MEMBER | IDENTIFY | STRONG_INFERENCE | mathematical principles |
| fractions and percentages | RANGE_REQUIRED_MEMBER | APPLY | STRONG_INFERENCE | mathematical principles |
| algebra | RANGE_REQUIRED_MEMBER | IDENTIFY | STRONG_INFERENCE | mathematical principles |
| algebra | RANGE_REQUIRED_MEMBER | APPLY | STRONG_INFERENCE | mathematical principles |
| indices | RANGE_REQUIRED_MEMBER | IDENTIFY | STRONG_INFERENCE | mathematical principles |
| indices | RANGE_REQUIRED_MEMBER | APPLY | STRONG_INFERENCE | mathematical principles |
| transposition | RANGE_REQUIRED_MEMBER | IDENTIFY | STRONG_INFERENCE | mathematical principles |
| transposition | RANGE_REQUIRED_MEMBER | APPLY | STRONG_INFERENCE | mathematical principles |
| triangles and trigonometry | RANGE_REQUIRED_MEMBER | IDENTIFY | STRONG_INFERENCE | mathematical principles |
| triangles and trigonometry | RANGE_REQUIRED_MEMBER | APPLY | STRONG_INFERENCE | mathematical principles |
| statistics | RANGE_REQUIRED_MEMBER | IDENTIFY | STRONG_INFERENCE | mathematical principles |
| statistics | RANGE_REQUIRED_MEMBER | APPLY | STRONG_INFERENCE | mathematical principles |

## LO2: Understand standard units of measurement used in electrical installation, maintenance and design work

### AC2.1

**RAW SOURCE (AC wording, page 25):** "identify and use internationally recognised base and derived (SI) units of measurement"

**NORMALIZED REQUIRED CONTENT:**

| Candidate | Kind | Performance | Confidence | Refines |
|---|---|---|---|---|
| SI units of measurement for general physical quantities | RANGE_CATEGORY | IDENTIFY | EXPLICIT | - |
| SI units of measurement for general physical quantities | RANGE_CATEGORY | APPLY | STRONG_INFERENCE | - |
| length (SI unit) | RANGE_REQUIRED_MEMBER | IDENTIFY | STRONG_INFERENCE | SI units of measurement for general physical quantities |
| length (SI unit) | RANGE_REQUIRED_MEMBER | APPLY | STRONG_INFERENCE | SI units of measurement for general physical quantities |
| area (SI unit) | RANGE_REQUIRED_MEMBER | IDENTIFY | STRONG_INFERENCE | SI units of measurement for general physical quantities |
| area (SI unit) | RANGE_REQUIRED_MEMBER | APPLY | STRONG_INFERENCE | SI units of measurement for general physical quantities |
| volume (SI unit) | RANGE_REQUIRED_MEMBER | IDENTIFY | STRONG_INFERENCE | SI units of measurement for general physical quantities |
| volume (SI unit) | RANGE_REQUIRED_MEMBER | APPLY | STRONG_INFERENCE | SI units of measurement for general physical quantities |
| mass (SI unit) | RANGE_REQUIRED_MEMBER | IDENTIFY | STRONG_INFERENCE | SI units of measurement for general physical quantities |
| mass (SI unit) | RANGE_REQUIRED_MEMBER | APPLY | STRONG_INFERENCE | SI units of measurement for general physical quantities |
| density (SI unit) | RANGE_REQUIRED_MEMBER | IDENTIFY | STRONG_INFERENCE | SI units of measurement for general physical quantities |
| density (SI unit) | RANGE_REQUIRED_MEMBER | APPLY | STRONG_INFERENCE | SI units of measurement for general physical quantities |
| time (SI unit) | RANGE_REQUIRED_MEMBER | IDENTIFY | STRONG_INFERENCE | SI units of measurement for general physical quantities |
| time (SI unit) | RANGE_REQUIRED_MEMBER | APPLY | STRONG_INFERENCE | SI units of measurement for general physical quantities |
| temperature (SI unit) | RANGE_REQUIRED_MEMBER | IDENTIFY | STRONG_INFERENCE | SI units of measurement for general physical quantities |
| temperature (SI unit) | RANGE_REQUIRED_MEMBER | APPLY | STRONG_INFERENCE | SI units of measurement for general physical quantities |
| velocity (SI unit) | RANGE_REQUIRED_MEMBER | IDENTIFY | STRONG_INFERENCE | SI units of measurement for general physical quantities |
| velocity (SI unit) | RANGE_REQUIRED_MEMBER | APPLY | STRONG_INFERENCE | SI units of measurement for general physical quantities |

**EXPLICIT FACT REQUIREMENTS:**

- `unit202.si-unit.length` on length (SI unit)::IDENTIFY -- **TECHNICAL TRUTH:** metre, symbol m (BIPM, "SI: A concise summary of the International System of Units, SI" (9th edition concise brochure), https://www.bipm.org/documents/20126/41483022/SI-Brochure-9-concise-EN.pdf/2fda4656-e236-0fcb-3867-36ca74eea4e3)
- `unit202.si-unit.length` on length (SI unit)::APPLY -- **TECHNICAL TRUTH:** metre, symbol m (BIPM, "SI: A concise summary of the International System of Units, SI" (9th edition concise brochure), https://www.bipm.org/documents/20126/41483022/SI-Brochure-9-concise-EN.pdf/2fda4656-e236-0fcb-3867-36ca74eea4e3)
- `unit202.si-unit.area` on area (SI unit)::IDENTIFY -- **TECHNICAL TRUTH:** square metre, symbol m² (NIST, "Guide to the SI", Chapter 4: The Two Classes of SI Units and the SI Prefixes, https://www.nist.gov/pml/special-publication-811/nist-guide-si-chapter-4-two-classes-si-units-and-si-prefixes)
- `unit202.si-unit.area` on area (SI unit)::APPLY -- **TECHNICAL TRUTH:** square metre, symbol m² (NIST, "Guide to the SI", Chapter 4: The Two Classes of SI Units and the SI Prefixes, https://www.nist.gov/pml/special-publication-811/nist-guide-si-chapter-4-two-classes-si-units-and-si-prefixes)
- `unit202.si-unit.volume` on volume (SI unit)::IDENTIFY -- **TECHNICAL TRUTH:** cubic metre, symbol m³ (NIST, "Guide to the SI", Chapter 4: The Two Classes of SI Units and the SI Prefixes, https://www.nist.gov/pml/special-publication-811/nist-guide-si-chapter-4-two-classes-si-units-and-si-prefixes)
- `unit202.si-unit.volume` on volume (SI unit)::APPLY -- **TECHNICAL TRUTH:** cubic metre, symbol m³ (NIST, "Guide to the SI", Chapter 4: The Two Classes of SI Units and the SI Prefixes, https://www.nist.gov/pml/special-publication-811/nist-guide-si-chapter-4-two-classes-si-units-and-si-prefixes)
- `unit202.si-unit.mass` on mass (SI unit)::IDENTIFY -- **TECHNICAL TRUTH:** kilogram, symbol kg (BIPM, "SI: A concise summary of the International System of Units, SI" (9th edition concise brochure), https://www.bipm.org/documents/20126/41483022/SI-Brochure-9-concise-EN.pdf/2fda4656-e236-0fcb-3867-36ca74eea4e3)
- `unit202.si-unit.mass` on mass (SI unit)::APPLY -- **TECHNICAL TRUTH:** kilogram, symbol kg (BIPM, "SI: A concise summary of the International System of Units, SI" (9th edition concise brochure), https://www.bipm.org/documents/20126/41483022/SI-Brochure-9-concise-EN.pdf/2fda4656-e236-0fcb-3867-36ca74eea4e3)
- `unit202.si-unit.density` on density (SI unit)::IDENTIFY -- **TECHNICAL TRUTH:** kilogram per cubic metre, symbol kg/m³ (NIST, "Guide to the SI", Chapter 4: The Two Classes of SI Units and the SI Prefixes, https://www.nist.gov/pml/special-publication-811/nist-guide-si-chapter-4-two-classes-si-units-and-si-prefixes)
- `unit202.si-unit.density` on density (SI unit)::APPLY -- **TECHNICAL TRUTH:** kilogram per cubic metre, symbol kg/m³ (NIST, "Guide to the SI", Chapter 4: The Two Classes of SI Units and the SI Prefixes, https://www.nist.gov/pml/special-publication-811/nist-guide-si-chapter-4-two-classes-si-units-and-si-prefixes)
- `unit202.si-unit.time` on time (SI unit)::IDENTIFY -- **TECHNICAL TRUTH:** second, symbol s (BIPM, "SI: A concise summary of the International System of Units, SI" (9th edition concise brochure), https://www.bipm.org/documents/20126/41483022/SI-Brochure-9-concise-EN.pdf/2fda4656-e236-0fcb-3867-36ca74eea4e3)
- `unit202.si-unit.time` on time (SI unit)::APPLY -- **TECHNICAL TRUTH:** second, symbol s (BIPM, "SI: A concise summary of the International System of Units, SI" (9th edition concise brochure), https://www.bipm.org/documents/20126/41483022/SI-Brochure-9-concise-EN.pdf/2fda4656-e236-0fcb-3867-36ca74eea4e3)
- `unit202.si-unit.temperature` on temperature (SI unit)::IDENTIFY -- **TECHNICAL TRUTH:** kelvin, symbol K (BIPM, "SI: A concise summary of the International System of Units, SI" (9th edition concise brochure), https://www.bipm.org/documents/20126/41483022/SI-Brochure-9-concise-EN.pdf/2fda4656-e236-0fcb-3867-36ca74eea4e3)
- `unit202.si-unit.temperature` on temperature (SI unit)::APPLY -- **TECHNICAL TRUTH:** kelvin, symbol K (BIPM, "SI: A concise summary of the International System of Units, SI" (9th edition concise brochure), https://www.bipm.org/documents/20126/41483022/SI-Brochure-9-concise-EN.pdf/2fda4656-e236-0fcb-3867-36ca74eea4e3)
- `unit202.si-unit.velocity` on velocity (SI unit)::IDENTIFY -- **TECHNICAL TRUTH:** metre per second, symbol m/s (NIST, "Guide to the SI", Chapter 4: The Two Classes of SI Units and the SI Prefixes, https://www.nist.gov/pml/special-publication-811/nist-guide-si-chapter-4-two-classes-si-units-and-si-prefixes)
- `unit202.si-unit.velocity` on velocity (SI unit)::APPLY -- **TECHNICAL TRUTH:** metre per second, symbol m/s (NIST, "Guide to the SI", Chapter 4: The Two Classes of SI Units and the SI Prefixes, https://www.nist.gov/pml/special-publication-811/nist-guide-si-chapter-4-two-classes-si-units-and-si-prefixes)

### AC2.2

**RAW SOURCE (AC wording, page 25):** "identify and determine values of base and derived SI units which apply specifically to electrical quantities"

**NORMALIZED REQUIRED CONTENT:**

| Candidate | Kind | Performance | Confidence | Refines |
|---|---|---|---|---|
| electrical quantities (SI units) | RANGE_CATEGORY | IDENTIFY | EXPLICIT | - |
| electrical quantities (SI units) | RANGE_CATEGORY | OTHER | STRONG_INFERENCE | - |
| resistance (SI unit) | RANGE_REQUIRED_MEMBER | IDENTIFY | STRONG_INFERENCE | electrical quantities (SI units) |
| resistance (SI unit) | RANGE_REQUIRED_MEMBER | OTHER | STRONG_INFERENCE | electrical quantities (SI units) |
| resistivity (SI unit) | RANGE_REQUIRED_MEMBER | IDENTIFY | STRONG_INFERENCE | electrical quantities (SI units) |
| resistivity (SI unit) | RANGE_REQUIRED_MEMBER | OTHER | STRONG_INFERENCE | electrical quantities (SI units) |
| power (SI unit) | RANGE_REQUIRED_MEMBER | IDENTIFY | STRONG_INFERENCE | electrical quantities (SI units) |
| power (SI unit) | RANGE_REQUIRED_MEMBER | OTHER | STRONG_INFERENCE | electrical quantities (SI units) |
| frequency (SI electrical quantity) | RANGE_REQUIRED_MEMBER | IDENTIFY | STRONG_INFERENCE | electrical quantities (SI units) |
| frequency (SI electrical quantity) | RANGE_REQUIRED_MEMBER | OTHER | STRONG_INFERENCE | electrical quantities (SI units) |
| current (SI unit) | RANGE_REQUIRED_MEMBER | IDENTIFY | STRONG_INFERENCE | electrical quantities (SI units) |
| current (SI unit) | RANGE_REQUIRED_MEMBER | OTHER | STRONG_INFERENCE | electrical quantities (SI units) |
| voltage (SI unit) | RANGE_REQUIRED_MEMBER | IDENTIFY | STRONG_INFERENCE | electrical quantities (SI units) |
| voltage (SI unit) | RANGE_REQUIRED_MEMBER | OTHER | STRONG_INFERENCE | electrical quantities (SI units) |
| energy (SI unit) | RANGE_REQUIRED_MEMBER | IDENTIFY | STRONG_INFERENCE | electrical quantities (SI units) |
| energy (SI unit) | RANGE_REQUIRED_MEMBER | OTHER | STRONG_INFERENCE | electrical quantities (SI units) |
| impedance (SI unit) | RANGE_REQUIRED_MEMBER | IDENTIFY | STRONG_INFERENCE | electrical quantities (SI units) |
| impedance (SI unit) | RANGE_REQUIRED_MEMBER | OTHER | STRONG_INFERENCE | electrical quantities (SI units) |
| inductance and inductive reactance (SI unit) | RANGE_REQUIRED_MEMBER | IDENTIFY | STRONG_INFERENCE | electrical quantities (SI units) |
| inductance and inductive reactance (SI unit) | RANGE_REQUIRED_MEMBER | OTHER | STRONG_INFERENCE | electrical quantities (SI units) |
| capacitance and capacitive reactance (SI unit) | RANGE_REQUIRED_MEMBER | IDENTIFY | STRONG_INFERENCE | electrical quantities (SI units) |
| capacitance and capacitive reactance (SI unit) | RANGE_REQUIRED_MEMBER | OTHER | STRONG_INFERENCE | electrical quantities (SI units) |
| power factor (SI unit / dimensional status) | RANGE_REQUIRED_MEMBER | IDENTIFY | STRONG_INFERENCE | electrical quantities (SI units) |
| power factor (SI unit / dimensional status) | RANGE_REQUIRED_MEMBER | OTHER | STRONG_INFERENCE | electrical quantities (SI units) |

**EXPLICIT FACT REQUIREMENTS:**

- `unit202.si-unit.resistance` on resistance (SI unit)::IDENTIFY -- **TECHNICAL TRUTH:** ohm, symbol Ω (BIPM, "SI: A concise summary of the International System of Units, SI" (9th edition concise brochure), https://www.bipm.org/documents/20126/41483022/SI-Brochure-9-concise-EN.pdf/2fda4656-e236-0fcb-3867-36ca74eea4e3)
- `unit202.si-unit.resistance` on resistance (SI unit)::OTHER -- **TECHNICAL TRUTH:** ohm, symbol Ω (BIPM, "SI: A concise summary of the International System of Units, SI" (9th edition concise brochure), https://www.bipm.org/documents/20126/41483022/SI-Brochure-9-concise-EN.pdf/2fda4656-e236-0fcb-3867-36ca74eea4e3)
- `unit202.si-unit.resistivity` on resistivity (SI unit)::IDENTIFY -- **TECHNICAL TRUTH:** ohm-metre, symbol Ω·m (OpenStax, University Physics Volume 2, §9.3 "Resistivity and Resistance")
- `unit202.si-unit.resistivity` on resistivity (SI unit)::OTHER -- **TECHNICAL TRUTH:** ohm-metre, symbol Ω·m (OpenStax, University Physics Volume 2, §9.3 "Resistivity and Resistance")
- `unit202.si-unit.power` on power (SI unit)::IDENTIFY -- **TECHNICAL TRUTH:** watt, symbol W (BIPM, "SI: A concise summary of the International System of Units, SI" (9th edition concise brochure), https://www.bipm.org/documents/20126/41483022/SI-Brochure-9-concise-EN.pdf/2fda4656-e236-0fcb-3867-36ca74eea4e3)
- `unit202.si-unit.power` on power (SI unit)::OTHER -- **TECHNICAL TRUTH:** watt, symbol W (BIPM, "SI: A concise summary of the International System of Units, SI" (9th edition concise brochure), https://www.bipm.org/documents/20126/41483022/SI-Brochure-9-concise-EN.pdf/2fda4656-e236-0fcb-3867-36ca74eea4e3)
- `unit202.si-unit.frequency` on frequency (SI electrical quantity)::IDENTIFY -- **TECHNICAL TRUTH:** hertz, symbol Hz (BIPM, "SI: A concise summary of the International System of Units, SI" (9th edition concise brochure), https://www.bipm.org/documents/20126/41483022/SI-Brochure-9-concise-EN.pdf/2fda4656-e236-0fcb-3867-36ca74eea4e3)
- `unit202.si-unit.frequency` on frequency (SI electrical quantity)::OTHER -- **TECHNICAL TRUTH:** hertz, symbol Hz (BIPM, "SI: A concise summary of the International System of Units, SI" (9th edition concise brochure), https://www.bipm.org/documents/20126/41483022/SI-Brochure-9-concise-EN.pdf/2fda4656-e236-0fcb-3867-36ca74eea4e3)
- `unit202.si-unit.current` on current (SI unit)::IDENTIFY -- **TECHNICAL TRUTH:** ampere, symbol A (BIPM, "SI: A concise summary of the International System of Units, SI" (9th edition concise brochure), https://www.bipm.org/documents/20126/41483022/SI-Brochure-9-concise-EN.pdf/2fda4656-e236-0fcb-3867-36ca74eea4e3)
- `unit202.si-unit.current` on current (SI unit)::OTHER -- **TECHNICAL TRUTH:** ampere, symbol A (BIPM, "SI: A concise summary of the International System of Units, SI" (9th edition concise brochure), https://www.bipm.org/documents/20126/41483022/SI-Brochure-9-concise-EN.pdf/2fda4656-e236-0fcb-3867-36ca74eea4e3)
- `unit202.si-unit.voltage` on voltage (SI unit)::IDENTIFY -- **TECHNICAL TRUTH:** volt, symbol V (BIPM, "SI: A concise summary of the International System of Units, SI" (9th edition concise brochure), https://www.bipm.org/documents/20126/41483022/SI-Brochure-9-concise-EN.pdf/2fda4656-e236-0fcb-3867-36ca74eea4e3)
- `unit202.si-unit.voltage` on voltage (SI unit)::OTHER -- **TECHNICAL TRUTH:** volt, symbol V (BIPM, "SI: A concise summary of the International System of Units, SI" (9th edition concise brochure), https://www.bipm.org/documents/20126/41483022/SI-Brochure-9-concise-EN.pdf/2fda4656-e236-0fcb-3867-36ca74eea4e3)
- `unit202.si-unit.energy` on energy (SI unit)::IDENTIFY -- **TECHNICAL TRUTH:** joule, symbol J (BIPM, "SI: A concise summary of the International System of Units, SI" (9th edition concise brochure), https://www.bipm.org/documents/20126/41483022/SI-Brochure-9-concise-EN.pdf/2fda4656-e236-0fcb-3867-36ca74eea4e3)
- `unit202.si-unit.energy` on energy (SI unit)::OTHER -- **TECHNICAL TRUTH:** joule, symbol J (BIPM, "SI: A concise summary of the International System of Units, SI" (9th edition concise brochure), https://www.bipm.org/documents/20126/41483022/SI-Brochure-9-concise-EN.pdf/2fda4656-e236-0fcb-3867-36ca74eea4e3)
- `unit202.si-unit.impedance` on impedance (SI unit)::IDENTIFY -- **TECHNICAL TRUTH:** ohm, symbol Ω (OpenStax, College Physics 2e, §23.12 "RLC Series AC Circuits")
- `unit202.si-unit.impedance` on impedance (SI unit)::OTHER -- **TECHNICAL TRUTH:** ohm, symbol Ω (OpenStax, College Physics 2e, §23.12 "RLC Series AC Circuits")
- `unit202.si-unit.inductance` on inductance and inductive reactance (SI unit)::IDENTIFY -- **TECHNICAL TRUTH:** henry, symbol H (inductance) (BIPM, "SI: A concise summary of the International System of Units, SI" (9th edition concise brochure), https://www.bipm.org/documents/20126/41483022/SI-Brochure-9-concise-EN.pdf/2fda4656-e236-0fcb-3867-36ca74eea4e3)
- `unit202.si-unit.inductive-reactance` on inductance and inductive reactance (SI unit)::IDENTIFY -- **TECHNICAL TRUTH:** ohm, symbol Ω (inductive reactance) (OpenStax, College Physics 2e, §23.11 "Reactance, Inductive and Capacitive")
- `unit202.si-unit.inductance` on inductance and inductive reactance (SI unit)::OTHER -- **TECHNICAL TRUTH:** henry, symbol H (inductance) (BIPM, "SI: A concise summary of the International System of Units, SI" (9th edition concise brochure), https://www.bipm.org/documents/20126/41483022/SI-Brochure-9-concise-EN.pdf/2fda4656-e236-0fcb-3867-36ca74eea4e3)
- `unit202.si-unit.inductive-reactance` on inductance and inductive reactance (SI unit)::OTHER -- **TECHNICAL TRUTH:** ohm, symbol Ω (inductive reactance) (OpenStax, College Physics 2e, §23.11 "Reactance, Inductive and Capacitive")
- `unit202.si-unit.capacitance` on capacitance and capacitive reactance (SI unit)::IDENTIFY -- **TECHNICAL TRUTH:** farad, symbol F (capacitance) (BIPM, "SI: A concise summary of the International System of Units, SI" (9th edition concise brochure), https://www.bipm.org/documents/20126/41483022/SI-Brochure-9-concise-EN.pdf/2fda4656-e236-0fcb-3867-36ca74eea4e3)
- `unit202.si-unit.capacitive-reactance` on capacitance and capacitive reactance (SI unit)::IDENTIFY -- **TECHNICAL TRUTH:** ohm, symbol Ω (capacitive reactance) (OpenStax, College Physics 2e, §23.11 "Reactance, Inductive and Capacitive")
- `unit202.si-unit.capacitance` on capacitance and capacitive reactance (SI unit)::OTHER -- **TECHNICAL TRUTH:** farad, symbol F (capacitance) (BIPM, "SI: A concise summary of the International System of Units, SI" (9th edition concise brochure), https://www.bipm.org/documents/20126/41483022/SI-Brochure-9-concise-EN.pdf/2fda4656-e236-0fcb-3867-36ca74eea4e3)
- `unit202.si-unit.capacitive-reactance` on capacitance and capacitive reactance (SI unit)::OTHER -- **TECHNICAL TRUTH:** ohm, symbol Ω (capacitive reactance) (OpenStax, College Physics 2e, §23.11 "Reactance, Inductive and Capacitive")
- `unit202.si-unit.power-factor.defining-relationship` on power factor (SI unit / dimensional status)::IDENTIFY -- **TECHNICAL TRUTH:** power factor = cos(phi), a trigonometric ratio (equation 15.12) (OpenStax, University Physics Volume 2, §15.4 "Power in an AC Circuit")
- `unit202.si-unit.power-factor.dimensionless-convention` on power factor (SI unit / dimensional status)::IDENTIFY -- **TECHNICAL TRUTH:** unit one, symbol 1 (not written) (BIPM, "SI: A concise summary of the International System of Units, SI" (9th edition concise brochure), https://www.bipm.org/documents/20126/41483022/SI-Brochure-9-concise-EN.pdf/2fda4656-e236-0fcb-3867-36ca74eea4e3)
- `unit202.si-unit.power-factor.defining-relationship` on power factor (SI unit / dimensional status)::OTHER -- **TECHNICAL TRUTH:** power factor = cos(phi), a trigonometric ratio (equation 15.12) (OpenStax, University Physics Volume 2, §15.4 "Power in an AC Circuit")
- `unit202.si-unit.power-factor.dimensionless-convention` on power factor (SI unit / dimensional status)::OTHER -- **TECHNICAL TRUTH:** unit one, symbol 1 (not written) (BIPM, "SI: A concise summary of the International System of Units, SI" (9th edition concise brochure), https://www.bipm.org/documents/20126/41483022/SI-Brochure-9-concise-EN.pdf/2fda4656-e236-0fcb-3867-36ca74eea4e3)

### AC2.3

**RAW SOURCE (AC wording, page 25):** "identify appropriate electrical instruments for the measurement of different electrical quantities"

**NORMALIZED REQUIRED CONTENT:**

| Candidate | Kind | Performance | Confidence | Refines |
|---|---|---|---|---|
| electrical instruments for the measurement of electrical quantities | PRIMARY_REQUIREMENT | IDENTIFY | EXPLICIT | - |
| electrical quantities requiring instrument identification (measurement) | RANGE_CATEGORY | IDENTIFY | EXPLICIT | - |
| instrument for measuring resistance | RANGE_REQUIRED_MEMBER | IDENTIFY | STRONG_INFERENCE | electrical instruments for the measurement of electrical quantities |
| instrument for measuring power | RANGE_REQUIRED_MEMBER | IDENTIFY | STRONG_INFERENCE | electrical instruments for the measurement of electrical quantities |
| instrument for measuring current | RANGE_REQUIRED_MEMBER | IDENTIFY | STRONG_INFERENCE | electrical instruments for the measurement of electrical quantities |
| instrument for measuring voltage | RANGE_REQUIRED_MEMBER | IDENTIFY | STRONG_INFERENCE | electrical instruments for the measurement of electrical quantities |
| instrument for measuring energy | RANGE_REQUIRED_MEMBER | IDENTIFY | STRONG_INFERENCE | electrical instruments for the measurement of electrical quantities |

**REVIEW-PROPOSED KNOWLEDGE (does not auto-govern):**

- `unit202.review-fact.ohmmeter-definition` on instrument for measuring resistance::IDENTIFY: AC2.3 requires identifying the appropriate instrument for measuring resistance -- minimally requires knowing an ohmmeter is used, derived from R=V/I. CC-19R section 21: exported for Project-Architect review; MUST NOT auto-govern or contribute to requiredFactKeys automatically.
  - **TECHNICAL TRUTH:** An ohmmeter measures resistance, computed via Ohm's law (R=V/I) from a known/measured voltage and current. (OpenStax, University Physics Volume 2, §10.4 "Electrical Measuring Instruments")
- `unit202.review-fact.ammeter-definition` on instrument for measuring current::IDENTIFY: AC2.3 requires identifying the appropriate instrument for measuring current -- minimally requires knowing an ammeter is used, connected in series. CC-19R section 21: exported for Project-Architect review; MUST NOT auto-govern or contribute to requiredFactKeys automatically.
  - **TECHNICAL TRUTH:** An ammeter measures current and is connected in series with the device/component being measured. (OpenStax, University Physics Volume 2, §10.4 "Electrical Measuring Instruments")
- `unit202.review-fact.voltmeter-definition` on instrument for measuring voltage::IDENTIFY: AC2.3 requires identifying the appropriate instrument for measuring voltage -- minimally requires knowing a voltmeter is used, connected in parallel. CC-19R section 21: exported for Project-Architect review; MUST NOT auto-govern or contribute to requiredFactKeys automatically.
  - **TECHNICAL TRUTH:** A voltmeter measures voltage/potential difference and is connected in parallel with the device being measured. (OpenStax, University Physics Volume 2, §10.4 "Electrical Measuring Instruments")
- `unit202.review-fact.wattmeter` on instrument for measuring power::IDENTIFY: AC2.3 requires identifying the appropriate instrument for measuring power -- minimally requires knowing a wattmeter is used. No source meeting the CC-19R section 23 quality hierarchy was found this session for a formal wattmeter definition; the proposal stands with a TECHNICAL_TRUTH_GAP. CC-19R section 21: exported for Project-Architect review; MUST NOT auto-govern or contribute to requiredFactKeys automatically.
  - **TECHNICAL_TRUTH_GAP:** fact proposed, no technical source meeting the CC-19R section 23 quality hierarchy found
- `unit202.review-fact.energy-meter` on instrument for measuring energy::IDENTIFY: AC2.3 requires identifying the appropriate instrument for measuring energy -- minimally requires knowing an energy meter (kWh meter) is used. No source meeting the CC-19R section 23 quality hierarchy was found this session; the proposal stands with a TECHNICAL_TRUTH_GAP. CC-19R section 21: exported for Project-Architect review; MUST NOT auto-govern or contribute to requiredFactKeys automatically.
  - **TECHNICAL_TRUTH_GAP:** fact proposed, no technical source meeting the CC-19R section 23 quality hierarchy found

## LO3: Understand basic mechanics and the relationship between force, work, energy and power

### AC3.1

**RAW SOURCE (AC wording, page 26):** "specify what is meant by mass and weight"

**NORMALIZED REQUIRED CONTENT:**

| Candidate | Kind | Performance | Confidence | Refines |
|---|---|---|---|---|
| mass and weight | PRIMARY_REQUIREMENT | DEFINE | STRONG_INFERENCE | - |

**REVIEW-PROPOSED KNOWLEDGE (does not auto-govern):**

- `unit202.review-fact.mass-definition` on mass and weight::DEFINE: AC3.1 requires the learner to 'specify what is meant by mass' -- defining mass minimally requires knowing it is the quantity of matter in an object, distinct from weight. CC-19R section 21: exported for Project-Architect review; MUST NOT auto-govern or contribute to requiredFactKeys automatically.
  - **TECHNICAL TRUTH:** Mass is the quantity of matter in an object and does not vary. (OpenStax, Physics, §4.3 "Newton's Second Law of Motion")
- `unit202.review-fact.weight-definition` on mass and weight::DEFINE: AC3.1 requires the learner to 'specify what is meant by ... weight' -- defining weight minimally requires knowing it is the gravitational force on an object (W=mg), distinguishing it from mass. CC-19R section 21: exported for Project-Architect review; MUST NOT auto-govern or contribute to requiredFactKeys automatically.
  - **TECHNICAL TRUTH:** Weight is the gravitational force on an object, W = mg, and is proportional to the force of gravity. (OpenStax, Physics, §4.3 "Newton's Second Law of Motion")

### AC3.2

**RAW SOURCE (AC wording, page 26):** "explain the principles of basic mechanics as they apply to levers, gears and pulleys"

**NORMALIZED REQUIRED CONTENT:**

| Candidate | Kind | Performance | Confidence | Refines |
|---|---|---|---|---|
| principles of basic mechanics as applied to levers, gears and pulleys | PRIMARY_REQUIREMENT | EXPLAIN | EXPLICIT | - |
| gears | PRIMARY_REQUIREMENT | EXPLAIN | EXPLICIT | - |
| pulleys | PRIMARY_REQUIREMENT | EXPLAIN | EXPLICIT | - |
| levers | RANGE_CATEGORY | EXPLAIN | EXPLICIT | - |
| lever class I | RANGE_REQUIRED_MEMBER | EXPLAIN | STRONG_INFERENCE | levers |
| lever class II | RANGE_REQUIRED_MEMBER | EXPLAIN | STRONG_INFERENCE | levers |
| lever class III | RANGE_REQUIRED_MEMBER | EXPLAIN | STRONG_INFERENCE | levers |

**REVIEW-PROPOSED KNOWLEDGE (does not auto-govern):**

- `unit202.review-fact.gear-mechanism` on gears::EXPLAIN: AC3.2 requires explaining the principles of basic mechanics as applied to gears -- minimally requires knowing meshed gear teeth share a common speed at the contact point and that gear ratio = radius(output)/radius(input) = teeth(output)/teeth(input). CC-19R section 21: exported for Project-Architect review; MUST NOT auto-govern or contribute to requiredFactKeys automatically.
  - **TECHNICAL TRUTH:** Meshed gear teeth have equal speed at the point of contact; gear ratio = radius(output)/radius(input) = teeth(output)/teeth(input). (Engineering LibreTexts, Mechanics Map (Moore et al.), §11.2 "Belt- and Gear-Driven Systems")
- `unit202.review-fact.mechanical-advantage` on gears::EXPLAIN: AC3.2 requires explaining the principles of basic mechanics as applied to gears -- as a simple machine, minimally requires the general mechanical-advantage concept (ratio of output to input force). CC-19R section 21: exported for Project-Architect review; MUST NOT auto-govern or contribute to requiredFactKeys automatically.
  - **TECHNICAL TRUTH:** Mechanical advantage (MA) is the ratio of output to input force magnitudes for a simple machine. (OpenStax, College Physics 2e, §9.5 "Simple Machines")
- `unit202.review-fact.pulley-mechanism` on pulleys::EXPLAIN: AC3.2 requires explaining the principles of basic mechanics as applied to pulleys -- minimally requires knowing a single pulley redirects force without multiplying it, while multi-cable systems' mechanical advantage approximates the number of supporting cables. CC-19R section 21: exported for Project-Architect review; MUST NOT auto-govern or contribute to requiredFactKeys automatically.
  - **TECHNICAL TRUTH:** An ordinary (single) pulley has MA of 1, changing only the direction of a force, not its magnitude; multi-cable pulley systems' MA approximates the number of supporting cables. (OpenStax, College Physics 2e, §9.5 "Simple Machines")
- `unit202.review-fact.mechanical-advantage` on pulleys::EXPLAIN: AC3.2 requires explaining the principles of basic mechanics as applied to pulleys -- as a simple machine, minimally requires the general mechanical-advantage concept. CC-19R section 21: exported for Project-Architect review; MUST NOT auto-govern or contribute to requiredFactKeys automatically.
  - **TECHNICAL TRUTH:** Mechanical advantage (MA) is the ratio of output to input force magnitudes for a simple machine. (OpenStax, College Physics 2e, §9.5 "Simple Machines")
- `unit202.review-fact.lever-class-1` on lever class I::EXPLAIN: Range member 'class I' under AC3.2 -- performing the inherited EXPLAIN requirement minimally requires knowing the fulcrum's position relative to load and effort for a class I lever. CC-19R section 21: exported for Project-Architect review; MUST NOT auto-govern or contribute to requiredFactKeys automatically.
  - **TECHNICAL TRUTH:** First-class levers have the fulcrum in the middle, between the load and resistance/effort. (Physics LibreTexts, Body Physics (Davis), §6.2 "Body Levers")
- `unit202.review-fact.lever-class-2` on lever class II::EXPLAIN: Range member 'class II' under AC3.2 -- minimally requires knowing the load's position relative to fulcrum and effort for a class II lever. CC-19R section 21: exported for Project-Architect review; MUST NOT auto-govern or contribute to requiredFactKeys automatically.
  - **TECHNICAL TRUTH:** Second-class levers have the resistance/load in the middle, between the fulcrum and effort. (Physics LibreTexts, Body Physics (Davis), §6.2 "Body Levers")
- `unit202.review-fact.lever-class-3` on lever class III::EXPLAIN: Range member 'class III' under AC3.2 -- minimally requires knowing the effort's position relative to fulcrum and load for a class III lever. CC-19R section 21: exported for Project-Architect review; MUST NOT auto-govern or contribute to requiredFactKeys automatically.
  - **TECHNICAL TRUTH:** Third-class levers have the effort in the middle, between the fulcrum and load. (Physics LibreTexts, Body Physics (Davis), §6.2 "Body Levers")

### AC3.3

**RAW SOURCE (AC wording, page 26):** "describe the main principles of the following and their inter-relationships: a. force b. work c. energy (kinetic and potential) d. power e. efficiency."

**NORMALIZED REQUIRED CONTENT:**

| Candidate | Kind | Performance | Confidence | Refines |
|---|---|---|---|---|
| principles of force, work, energy, power and efficiency | PRIMARY_REQUIREMENT | DESCRIBE | EXPLICIT | - |
| force | PRIMARY_REQUIREMENT | DESCRIBE | EXPLICIT | - |
| work | PRIMARY_REQUIREMENT | DESCRIBE | EXPLICIT | - |
| energy (kinetic and potential) | PRIMARY_REQUIREMENT | DESCRIBE | EXPLICIT | - |
| power (mechanical) | PRIMARY_REQUIREMENT | DESCRIBE | EXPLICIT | - |
| efficiency | PRIMARY_REQUIREMENT | DESCRIBE | EXPLICIT | - |
| inter-relationships between force, work, energy, power and efficiency | PRIMARY_REQUIREMENT | DESCRIBE | EXPLICIT | - |

**REVIEW-PROPOSED KNOWLEDGE (does not auto-govern):**

- `unit202.review-fact.work-formula` on work::DESCRIBE: AC3.3.b requires describing the principle of 'work' -- minimally requires knowing work is the product of force and distance moved. CC-19R section 21: exported for Project-Architect review; MUST NOT auto-govern or contribute to requiredFactKeys automatically.
  - **TECHNICAL TRUTH:** W = f d (work equals force times distance) (OpenStax, Physics, §9.3 "Simple Machines")
- `unit202.review-fact.kinetic-potential-energy-formula` on energy (kinetic and potential)::DESCRIBE: AC3.3.c explicitly names 'energy (kinetic and potential)' -- describing both forms minimally requires the KE=1/2mv^2 and PE=mgh relationships that distinguish them. CC-19R section 21: exported for Project-Architect review; MUST NOT auto-govern or contribute to requiredFactKeys automatically.
  - **TECHNICAL TRUTH:** KE = 1/2 m v^2; PE = mgh (equation 9.5) (OpenStax, Physics, §9.2 "Mechanical Energy and Conservation of Energy")
- `unit202.review-fact.power-mechanical-formula` on power (mechanical)::DESCRIBE: AC3.3.d requires describing the principle of 'power' -- minimally requires knowing power is the rate of doing work, P=W/t. CC-19R section 21: exported for Project-Architect review; MUST NOT auto-govern or contribute to requiredFactKeys automatically.
  - **TECHNICAL TRUTH:** P = W/t (equation 7.69); SI unit watt, 1 W = 1 J/s (OpenStax, College Physics 2e, §7.7 "Power")
- `unit202.review-fact.efficiency-formula` on efficiency::DESCRIBE: AC3.3.e requires describing the principle of 'efficiency' -- minimally requires knowing efficiency is useful output work divided by input work, expressed as a percentage. CC-19R section 21: exported for Project-Architect review; MUST NOT auto-govern or contribute to requiredFactKeys automatically.
  - **TECHNICAL TRUTH:** % efficiency = Wo/Wi x 100 (output work divided by input work, as a percentage) (OpenStax, Physics, §9.3 "Simple Machines")
- `unit202.review-fact.force-definition` on force::DESCRIBE: AC3.3.a requires describing the principle of 'force' -- minimally requires the Newton's-second-law relationship between force, mass and acceleration already established for the AC3.1 weight fact (W=mg is a special case of F=ma). CC-19R section 21: exported for Project-Architect review; MUST NOT auto-govern or contribute to requiredFactKeys automatically.
  - **TECHNICAL TRUTH:** Force relates to mass and acceleration via Newton's second law (the same relationship, F=ma, underlying the weight formula W=mg already sourced for AC3.1). (OpenStax, Physics, §4.3 "Newton's Second Law of Motion")
- `unit202.review-fact.power-mechanical-formula` on inter-relationships between force, work, energy, power and efficiency::DESCRIBE: AC3.3 explicitly requires describing 'their inter-relationships' -- minimally requires the relationship already sourced connecting work and power (P=W/t), which is the most direct explicit inter-relationship among the five named quantities. CC-19R section 21: exported for Project-Architect review; MUST NOT auto-govern or contribute to requiredFactKeys automatically.
  - **TECHNICAL TRUTH:** P = W/t (equation 7.69); SI unit watt, 1 W = 1 J/s (OpenStax, College Physics 2e, §7.7 "Power")

### AC3.4

**RAW SOURCE (AC wording, page 26):** "calculate values of mechanical energy, power and efficiency"

**NORMALIZED REQUIRED CONTENT:**

| Candidate | Kind | Performance | Confidence | Refines |
|---|---|---|---|---|
| values of mechanical energy, power and efficiency | PRIMARY_REQUIREMENT | CALCULATE | EXPLICIT | - |
| mechanical energy (calculation) | PRIMARY_REQUIREMENT | CALCULATE | EXPLICIT | - |
| power (calculation, mechanical) | PRIMARY_REQUIREMENT | CALCULATE | EXPLICIT | - |
| efficiency (calculation) | PRIMARY_REQUIREMENT | CALCULATE | EXPLICIT | - |

**REVIEW-PROPOSED KNOWLEDGE (does not auto-govern):**

- `unit202.review-fact.kinetic-potential-energy-formula` on mechanical energy (calculation)::CALCULATE: AC3.4 requires calculating values of mechanical energy -- performing the calculation minimally requires the KE/PE formulas already established for AC3.3. CC-19R section 21: exported for Project-Architect review; MUST NOT auto-govern or contribute to requiredFactKeys automatically.
  - **TECHNICAL TRUTH:** KE = 1/2 m v^2; PE = mgh (equation 9.5) (OpenStax, Physics, §9.2 "Mechanical Energy and Conservation of Energy")
- `unit202.review-fact.power-mechanical-formula` on power (calculation, mechanical)::CALCULATE: AC3.4 requires calculating values of power -- performing the calculation minimally requires the P=W/t formula. CC-19R section 21: exported for Project-Architect review; MUST NOT auto-govern or contribute to requiredFactKeys automatically.
  - **TECHNICAL TRUTH:** P = W/t (equation 7.69); SI unit watt, 1 W = 1 J/s (OpenStax, College Physics 2e, §7.7 "Power")
- `unit202.review-fact.efficiency-formula` on efficiency (calculation)::CALCULATE: AC3.4 requires calculating values of efficiency -- performing the calculation minimally requires the %efficiency=Wo/Wi x100 formula. CC-19R section 21: exported for Project-Architect review; MUST NOT auto-govern or contribute to requiredFactKeys automatically.
  - **TECHNICAL TRUTH:** % efficiency = Wo/Wi x 100 (output work divided by input work, as a percentage) (OpenStax, Physics, §9.3 "Simple Machines")

## LO4: Understand the relationship between resistance, resistivity, voltage, current and power

### AC4.1

**RAW SOURCE (AC wording, page 26):** "describe the basic principles of electron theory"

**NORMALIZED REQUIRED CONTENT:**

| Candidate | Kind | Performance | Confidence | Refines |
|---|---|---|---|---|
| basic principles of electron theory | PRIMARY_REQUIREMENT | DESCRIBE | EXPLICIT | - |

**REVIEW-PROPOSED KNOWLEDGE (does not auto-govern):**

- `unit202.review-fact.current-charge-flow` on basic principles of electron theory::DESCRIBE: AC4.1 requires describing basic principles of electron theory -- minimally requires knowing current is the rate of flow of charge. CC-19R section 21: exported for Project-Architect review; MUST NOT auto-govern or contribute to requiredFactKeys automatically.
  - **TECHNICAL TRUTH:** Electric current I is the rate at which charge flows. (OpenStax, University Physics Volume 2, §9.1 "Electrical Current")
- `unit202.review-fact.conventional-vs-electron-flow` on basic principles of electron theory::DESCRIBE: AC4.1 requires describing basic principles of electron theory -- minimally requires knowing conventional current direction is opposite to the actual electron-flow direction in a metal conductor. CC-19R section 21: exported for Project-Architect review; MUST NOT auto-govern or contribute to requiredFactKeys automatically.
  - **TECHNICAL TRUTH:** Conventional current is defined to flow from positive to negative terminal; in a metal conductor the actual electron flow is from negative to positive (opposite direction). (OpenStax, University Physics Volume 2, §9.1 "Electrical Current")

### AC4.2

**RAW SOURCE (AC wording, page 26):** "identify and distinguish between materials which are good conductors and insulators"

**NORMALIZED REQUIRED CONTENT:**

| Candidate | Kind | Performance | Confidence | Refines |
|---|---|---|---|---|
| conductors (good electrical conductor materials) | PRIMARY_REQUIREMENT | IDENTIFY | EXPLICIT | - |
| conductors (good electrical conductor materials) | PRIMARY_REQUIREMENT | DISTINGUISH | EXPLICIT | - |
| insulators (electrical insulator materials) | PRIMARY_REQUIREMENT | IDENTIFY | EXPLICIT | - |
| insulators (electrical insulator materials) | PRIMARY_REQUIREMENT | DISTINGUISH | EXPLICIT | - |

**REVIEW-PROPOSED KNOWLEDGE (does not auto-govern):**

- `unit202.review-fact.conductor-definition` on conductors (good electrical conductor materials)::IDENTIFY: AC4.2 requires identifying materials which are good conductors -- minimally requires knowing a conductor has free electrons allowing charge to move. CC-19R section 21: exported for Project-Architect review; MUST NOT auto-govern or contribute to requiredFactKeys automatically.
  - **TECHNICAL TRUTH:** A conductor is a substance with free electrons that allows charge to move relatively freely through it. (OpenStax, College Physics 2e, §18.2 "Conductors and Insulators")
- `unit202.review-fact.conductor-definition` on conductors (good electrical conductor materials)::DISTINGUISH: AC4.2 requires distinguishing conductors from insulators -- minimally requires knowing a conductor has free electrons allowing charge to move. CC-19R section 21: exported for Project-Architect review; MUST NOT auto-govern or contribute to requiredFactKeys automatically.
  - **TECHNICAL TRUTH:** A conductor is a substance with free electrons that allows charge to move relatively freely through it. (OpenStax, College Physics 2e, §18.2 "Conductors and Insulators")
- `unit202.review-fact.insulator-definition` on insulators (electrical insulator materials)::IDENTIFY: AC4.2 requires identifying materials which are insulators -- minimally requires knowing an insulator does not allow charge to move freely. CC-19R section 21: exported for Project-Architect review; MUST NOT auto-govern or contribute to requiredFactKeys automatically.
  - **TECHNICAL TRUTH:** An insulator does not allow charges to move through it (electrons are bound). (OpenStax, College Physics 2e, §18.2 "Conductors and Insulators")
- `unit202.review-fact.insulator-definition` on insulators (electrical insulator materials)::DISTINGUISH: AC4.2 requires distinguishing conductors from insulators -- minimally requires knowing an insulator does not allow charge to move freely. CC-19R section 21: exported for Project-Architect review; MUST NOT auto-govern or contribute to requiredFactKeys automatically.
  - **TECHNICAL TRUTH:** An insulator does not allow charges to move through it (electrons are bound). (OpenStax, College Physics 2e, §18.2 "Conductors and Insulators")

### AC4.3

**RAW SOURCE (AC wording, page 26):** "describe what is meant by resistance and resistivity in relation to electrical circuits"

**NORMALIZED REQUIRED CONTENT:**

| Candidate | Kind | Performance | Confidence | Refines |
|---|---|---|---|---|
| resistance and resistivity in relation to electrical circuits | PRIMARY_REQUIREMENT | DESCRIBE | EXPLICIT | - |

**REVIEW-PROPOSED KNOWLEDGE (does not auto-govern):**

- `unit202.review-fact.ohms-law` on resistance and resistivity in relation to electrical circuits::DESCRIBE: AC4.3 requires describing what is meant by resistance -- minimally requires the defining relationship R=V/I. CC-19R section 21: exported for Project-Architect review; MUST NOT auto-govern or contribute to requiredFactKeys automatically.
  - **TECHNICAL TRUTH:** R = V/I (equation 9.8) (OpenStax, University Physics Volume 2, §9.3 "Resistivity and Resistance")
- `unit202.review-fact.resistance-resistivity-relation` on resistance and resistivity in relation to electrical circuits::DESCRIBE: AC4.3 requires describing what is meant by resistivity in relation to electrical circuits -- minimally requires the relationship R=rho L/A connecting resistivity to resistance. CC-19R section 21: exported for Project-Architect review; MUST NOT auto-govern or contribute to requiredFactKeys automatically.
  - **TECHNICAL TRUTH:** R = rho L / A (equation 9.9) (OpenStax, University Physics Volume 2, §9.3 "Resistivity and Resistance")

### AC4.4

**RAW SOURCE (AC wording, page 26):** "explain the relationship between current, voltage and resistance in parallel and series D.C. circuits"

**NORMALIZED REQUIRED CONTENT:**

| Candidate | Kind | Performance | Confidence | Refines |
|---|---|---|---|---|
| relationship between current, voltage and resistance in parallel and series D.C. circuits | PRIMARY_REQUIREMENT | EXPLAIN | EXPLICIT | - |

**REVIEW-PROPOSED KNOWLEDGE (does not auto-govern):**

- `unit202.review-fact.ohms-law` on relationship between current, voltage and resistance in parallel and series D.C. circuits::EXPLAIN: AC4.4 requires explaining the relationship between current, voltage and resistance -- minimally requires Ohm's law, R=V/I. CC-19R section 21: exported for Project-Architect review; MUST NOT auto-govern or contribute to requiredFactKeys automatically.
  - **TECHNICAL TRUTH:** R = V/I (equation 9.8) (OpenStax, University Physics Volume 2, §9.3 "Resistivity and Resistance")
- `unit202.review-fact.series-resistance` on relationship between current, voltage and resistance in parallel and series D.C. circuits::EXPLAIN: AC4.4 requires explaining the relationship in series circuits specifically -- minimally requires the series total-resistance formula. CC-19R section 21: exported for Project-Architect review; MUST NOT auto-govern or contribute to requiredFactKeys automatically.
  - **TECHNICAL TRUTH:** Rs = R1 + R2 + R3 + ... (equation 21.5) (OpenStax, College Physics 2e, §21.1 "Resistors in Series and Parallel")
- `unit202.review-fact.parallel-resistance` on relationship between current, voltage and resistance in parallel and series D.C. circuits::EXPLAIN: AC4.4 requires explaining the relationship in parallel circuits specifically -- minimally requires the parallel total-resistance formula. CC-19R section 21: exported for Project-Architect review; MUST NOT auto-govern or contribute to requiredFactKeys automatically.
  - **TECHNICAL TRUTH:** 1/Rp = 1/R1 + 1/R2 + 1/R3 + ... (equation 21.20) (OpenStax, College Physics 2e, §21.1 "Resistors in Series and Parallel")

### AC4.5

**RAW SOURCE (AC wording, page 26):** "calculate the values of current, voltage and resistance in parallel and series D.C. circuits"

**NORMALIZED REQUIRED CONTENT:**

| Candidate | Kind | Performance | Confidence | Refines |
|---|---|---|---|---|
| values of current, voltage and resistance in parallel and series D.C. circuits | PRIMARY_REQUIREMENT | CALCULATE | EXPLICIT | - |
| current (calculation, D.C. circuits) | PRIMARY_REQUIREMENT | CALCULATE | EXPLICIT | - |
| voltage (calculation, D.C. circuits) | PRIMARY_REQUIREMENT | CALCULATE | EXPLICIT | - |
| resistance (calculation, D.C. circuits) | PRIMARY_REQUIREMENT | CALCULATE | EXPLICIT | - |

**REVIEW-PROPOSED KNOWLEDGE (does not auto-govern):**

- `unit202.review-fact.ohms-law` on values of current, voltage and resistance in parallel and series D.C. circuits::CALCULATE: AC4.5 requires calculating current, voltage and resistance values -- performing the calculation minimally requires Ohm's law, R=V/I. CC-19R section 21: exported for Project-Architect review; MUST NOT auto-govern or contribute to requiredFactKeys automatically.
  - **TECHNICAL TRUTH:** R = V/I (equation 9.8) (OpenStax, University Physics Volume 2, §9.3 "Resistivity and Resistance")
- `unit202.review-fact.ohms-law` on current (calculation, D.C. circuits)::CALCULATE: AC4.5 explicitly names 'current' as a required calculation -- performing it minimally requires Ohm's law, R=V/I (rearranged for I). CC-19R section 21: exported for Project-Architect review; MUST NOT auto-govern or contribute to requiredFactKeys automatically.
  - **TECHNICAL TRUTH:** R = V/I (equation 9.8) (OpenStax, University Physics Volume 2, §9.3 "Resistivity and Resistance")
- `unit202.review-fact.ohms-law` on voltage (calculation, D.C. circuits)::CALCULATE: AC4.5 explicitly names 'voltage' as a required calculation -- performing it minimally requires Ohm's law, R=V/I (rearranged for V). CC-19R section 21: exported for Project-Architect review; MUST NOT auto-govern or contribute to requiredFactKeys automatically.
  - **TECHNICAL TRUTH:** R = V/I (equation 9.8) (OpenStax, University Physics Volume 2, §9.3 "Resistivity and Resistance")
- `unit202.review-fact.ohms-law` on resistance (calculation, D.C. circuits)::CALCULATE: AC4.5 explicitly names 'resistance' as a required calculation -- performing it minimally requires Ohm's law, R=V/I. CC-19R section 21: exported for Project-Architect review; MUST NOT auto-govern or contribute to requiredFactKeys automatically.
  - **TECHNICAL TRUTH:** R = V/I (equation 9.8) (OpenStax, University Physics Volume 2, §9.3 "Resistivity and Resistance")

### AC4.6

**RAW SOURCE (AC wording, page 26):** "calculate values of power in parallel and series D.C. circuits"

**NORMALIZED REQUIRED CONTENT:**

| Candidate | Kind | Performance | Confidence | Refines |
|---|---|---|---|---|
| values of power in parallel and series D.C. circuits | PRIMARY_REQUIREMENT | CALCULATE | EXPLICIT | - |

**REVIEW-PROPOSED KNOWLEDGE (does not auto-govern):**

- `unit202.review-fact.thermal-effect` on values of power in parallel and series D.C. circuits::CALCULATE: AC4.6 requires calculating values of power -- minimally requires the power formula already sourced for AC4.8, P=I^2R=V^2/R. CC-19R section 21: exported for Project-Architect review; MUST NOT auto-govern or contribute to requiredFactKeys automatically.
  - **TECHNICAL TRUTH:** P = I^2 R = V^2/R (equation 9.13) -- resistive/thermal power dissipated by a resistor. (OpenStax, University Physics Volume 2, §9.5 "Electrical Energy and Power")

### AC4.7

**RAW SOURCE (AC wording, page 26):** "state what is meant by the term voltage drop in relation to electrical circuits"

**NORMALIZED REQUIRED CONTENT:**

| Candidate | Kind | Performance | Confidence | Refines |
|---|---|---|---|---|
| voltage drop | PRIMARY_REQUIREMENT | STATE | EXPLICIT | - |

**REVIEW-PROPOSED KNOWLEDGE (does not auto-govern):**

- `unit202.review-fact.ohms-law` on voltage drop::STATE: AC4.7 requires stating what is meant by voltage drop -- minimally requires Ohm's law (V=IR), which is the relationship a voltage drop across a resistive element is computed from. CC-19R section 21: exported for Project-Architect review; MUST NOT auto-govern or contribute to requiredFactKeys automatically.
  - **TECHNICAL TRUTH:** R = V/I (equation 9.8) (OpenStax, University Physics Volume 2, §9.3 "Resistivity and Resistance")

### AC4.8

**RAW SOURCE (AC wording, page 26):** "describe the chemical and thermal effects of electric currents"

**NORMALIZED REQUIRED CONTENT:**

| Candidate | Kind | Performance | Confidence | Refines |
|---|---|---|---|---|
| chemical and thermal effects of electric currents | PRIMARY_REQUIREMENT | DESCRIBE | EXPLICIT | - |

**REVIEW-PROPOSED KNOWLEDGE (does not auto-govern):**

- `unit202.review-fact.thermal-effect` on chemical and thermal effects of electric currents::DESCRIBE: AC4.8 requires describing the thermal effect of electric currents -- minimally requires knowing resistive/thermal power dissipation, P=I^2R. CC-19R section 21: exported for Project-Architect review; MUST NOT auto-govern or contribute to requiredFactKeys automatically.
  - **TECHNICAL TRUTH:** P = I^2 R = V^2/R (equation 9.13) -- resistive/thermal power dissipated by a resistor. (OpenStax, University Physics Volume 2, §9.5 "Electrical Energy and Power")
- `unit202.review-fact.chemical-effect` on chemical and thermal effects of electric currents::DESCRIBE: AC4.8 requires describing the chemical effect of electric currents -- minimally requires knowing current can drive nonspontaneous chemical decomposition (electrolysis). CC-19R section 21: exported for Project-Architect review; MUST NOT auto-govern or contribute to requiredFactKeys automatically.
  - **TECHNICAL TRUTH:** Electrolysis: an external circuit does work on a redox system, imposing a voltage to drive an otherwise nonspontaneous chemical reaction. (OpenStax, Chemistry 2e, §17.7 "Electrolysis")

## LO5: Understand the fundamental principles which underpin the relationship between magnetism and electricity

### AC5.1

**RAW SOURCE (AC wording, page 27):** "describe the effects of magnetism in terms of attraction and repulsion"

**NORMALIZED REQUIRED CONTENT:**

| Candidate | Kind | Performance | Confidence | Refines |
|---|---|---|---|---|
| attraction and repulsion effects of magnetism | PRIMARY_REQUIREMENT | DESCRIBE | EXPLICIT | - |

**REVIEW-PROPOSED KNOWLEDGE (does not auto-govern):**

- `unit202.review-fact.magnetic-attraction-repulsion` on attraction and repulsion effects of magnetism::DESCRIBE: AC5.1 requires describing the effects of magnetism in terms of attraction and repulsion -- minimally requires knowing like poles repel and unlike poles attract. CC-19R section 21: exported for Project-Architect review; MUST NOT auto-govern or contribute to requiredFactKeys automatically.
  - **TECHNICAL TRUTH:** Like magnetic poles repel; unlike magnetic poles attract. (OpenStax, University Physics Volume 2, §11.1 "Magnetism and Its Historical Discoveries")

### AC5.2

**RAW SOURCE (AC wording, page 27):** "state the difference between magnetic flux and flux density"

**NORMALIZED REQUIRED CONTENT:**

| Candidate | Kind | Performance | Confidence | Refines |
|---|---|---|---|---|
| difference between magnetic flux and flux density | PRIMARY_REQUIREMENT | STATE | EXPLICIT | - |

**REVIEW-PROPOSED KNOWLEDGE (does not auto-govern):**

- `unit202.review-fact.flux-vs-flux-density` on difference between magnetic flux and flux density::STATE: AC5.2 requires stating the difference between magnetic flux and flux density -- minimally requires knowing flux (Wb) is a total quantity and flux density (T) is flux per unit area. CC-19R section 21: exported for Project-Architect review; MUST NOT auto-govern or contribute to requiredFactKeys automatically.
  - **TECHNICAL TRUTH:** Magnetic flux (Phi) is measured in weber (Wb); flux density B is flux per unit area, measured in tesla (T), 1 Wb/m^2 = 1 T. (Engineering LibreTexts, Electromagnetics I (Ellingson), §2.5 "Magnetic Flux Density")

### AC5.3

**RAW SOURCE (AC wording, page 27):** "describe the magnetic effects of electrical currents in terms of: a. production of a magnetic field b. force on a current-carrying conductor in a magnetic field c. electromagnetism d. electromotive force."

**NORMALIZED REQUIRED CONTENT:**

| Candidate | Kind | Performance | Confidence | Refines |
|---|---|---|---|---|
| magnetic effects of electrical currents | PRIMARY_REQUIREMENT | DESCRIBE | EXPLICIT | - |
| production of a magnetic field | PRIMARY_REQUIREMENT | DESCRIBE | EXPLICIT | - |
| force on a current-carrying conductor in a magnetic field | PRIMARY_REQUIREMENT | DESCRIBE | EXPLICIT | - |
| electromagnetism | PRIMARY_REQUIREMENT | DESCRIBE | EXPLICIT | - |
| electromotive force | PRIMARY_REQUIREMENT | DESCRIBE | EXPLICIT | - |

**REVIEW-PROPOSED KNOWLEDGE (does not auto-govern):**

- `unit202.review-fact.force-on-conductor` on force on a current-carrying conductor in a magnetic field::DESCRIBE: AC5.3.b requires describing force on a current-carrying conductor in a magnetic field -- minimally requires the relationship F = I l x B. CC-19R section 21: exported for Project-Architect review; MUST NOT auto-govern or contribute to requiredFactKeys automatically.
  - **TECHNICAL TRUTH:** F = I l x B (equation 11.13, vector cross product) (OpenStax, University Physics Volume 2, §11.4 "Magnetic Force on a Current-Carrying Conductor")
- `unit202.review-fact.faradays-law` on electromotive force::DESCRIBE: AC5.3.d requires describing electromotive force as a magnetic effect of electrical currents -- minimally requires Faraday's law relating induced EMF to the rate of change of magnetic flux. CC-19R section 21: exported for Project-Architect review; MUST NOT auto-govern or contribute to requiredFactKeys automatically.
  - **TECHNICAL TRUTH:** epsilon = -N dPhi/dt (equation 13.2) -- induced EMF equals the negative rate of change of magnetic flux. (OpenStax, University Physics Volume 2, §13.1 "Faraday's Law")
- `unit202.review-fact.magnetic-field-production` on production of a magnetic field::DESCRIBE: AC5.3.a requires describing the production of a magnetic field as a magnetic effect of electrical currents -- minimally requires knowing a current-carrying conductor produces a magnetic field, direction given by the right-hand rule. CC-19R section 21: exported for Project-Architect review; MUST NOT auto-govern or contribute to requiredFactKeys automatically.
  - **TECHNICAL TRUTH:** A current-carrying wire produces a magnetic field (circular loops around the wire); direction given by the right-hand rule (thumb in direction of current, fingers curl in direction of the field). (OpenStax, College Physics 2e, §22.9 "Magnetic Fields Produced by Currents: Ampere's Law")

### AC5.4

**RAW SOURCE (AC wording, page 27):** "describe the basic principles of generating an A.C. supply in terms of: a. a single-loop generator b. sine-wave c. frequency d. EMF e. magnetic flux."

**NORMALIZED REQUIRED CONTENT:**

| Candidate | Kind | Performance | Confidence | Refines |
|---|---|---|---|---|
| basic principles of generating an A.C. supply | PRIMARY_REQUIREMENT | DESCRIBE | EXPLICIT | - |
| single-loop generator | PRIMARY_REQUIREMENT | DESCRIBE | EXPLICIT | - |
| sine-wave (AC generation principle) | PRIMARY_REQUIREMENT | DESCRIBE | EXPLICIT | - |
| frequency (AC generation principle) | PRIMARY_REQUIREMENT | DESCRIBE | EXPLICIT | - |
| EMF (AC generation principle) | PRIMARY_REQUIREMENT | DESCRIBE | EXPLICIT | - |
| magnetic flux (AC generation principle) | PRIMARY_REQUIREMENT | DESCRIBE | EXPLICIT | - |

**REVIEW-PROPOSED KNOWLEDGE (does not auto-govern):**

- `unit202.review-fact.faradays-law` on EMF (AC generation principle)::DESCRIBE: AC5.4.d requires describing EMF as a principle of generating an A.C. supply -- minimally requires Faraday's law. CC-19R section 21: exported for Project-Architect review; MUST NOT auto-govern or contribute to requiredFactKeys automatically.
  - **TECHNICAL TRUTH:** epsilon = -N dPhi/dt (equation 13.2) -- induced EMF equals the negative rate of change of magnetic flux. (OpenStax, University Physics Volume 2, §13.1 "Faraday's Law")
- `unit202.review-fact.faradays-law` on single-loop generator::DESCRIBE: AC5.4.a requires describing the single-loop generator as a principle of generating an A.C. supply -- minimally requires Faraday's law (EMF induced by a changing magnetic flux as the loop rotates), already sourced for AC5.3.d. CC-19R section 21: exported for Project-Architect review; MUST NOT auto-govern or contribute to requiredFactKeys automatically.
  - **TECHNICAL TRUTH:** epsilon = -N dPhi/dt (equation 13.2) -- induced EMF equals the negative rate of change of magnetic flux. (OpenStax, University Physics Volume 2, §13.1 "Faraday's Law")
- `unit202.review-fact.ac-sine-equation` on sine-wave (AC generation principle)::DESCRIBE: AC5.4.b requires describing sine-wave as a principle of generating an A.C. supply -- minimally requires the sinusoidal voltage equation V=V0sin(2*pi*f*t) produced by a rotating loop. CC-19R section 21: exported for Project-Architect review; MUST NOT auto-govern or contribute to requiredFactKeys automatically.
  - **TECHNICAL TRUTH:** An AC voltage waveform is described by V = V0 sin(2*pi*f*t) (equation 20.38), where f is the frequency in hertz. (OpenStax, College Physics 2e, §20.5 "Alternating Current versus Direct Current")
- `unit202.review-fact.ac-sine-equation` on frequency (AC generation principle)::DESCRIBE: AC5.4.c requires describing frequency as a principle of generating an A.C. supply -- minimally requires its role in the sinusoidal voltage equation already sourced (V=V0sin(2*pi*f*t), f in hertz). CC-19R section 21: exported for Project-Architect review; MUST NOT auto-govern or contribute to requiredFactKeys automatically.
  - **TECHNICAL TRUTH:** An AC voltage waveform is described by V = V0 sin(2*pi*f*t) (equation 20.38), where f is the frequency in hertz. (OpenStax, College Physics 2e, §20.5 "Alternating Current versus Direct Current")
- `unit202.review-fact.faradays-law` on magnetic flux (AC generation principle)::DESCRIBE: AC5.4.e requires describing magnetic flux as a principle of generating an A.C. supply -- minimally requires Faraday's law, which relates induced EMF directly to the rate of change of magnetic flux through the rotating loop. CC-19R section 21: exported for Project-Architect review; MUST NOT auto-govern or contribute to requiredFactKeys automatically.
  - **TECHNICAL TRUTH:** epsilon = -N dPhi/dt (equation 13.2) -- induced EMF equals the negative rate of change of magnetic flux. (OpenStax, University Physics Volume 2, §13.1 "Faraday's Law")

### AC5.5

**RAW SOURCE (AC wording, page 27):** "identify the characteristics of sine-waves"

**NORMALIZED REQUIRED CONTENT:**

| Candidate | Kind | Performance | Confidence | Refines |
|---|---|---|---|---|
| characteristics of sine-waves | RANGE_CATEGORY | IDENTIFY | EXPLICIT | - |
| RMS value (sine-wave characteristic) | RANGE_REQUIRED_MEMBER | IDENTIFY | STRONG_INFERENCE | characteristics of sine-waves |
| average value (sine-wave characteristic) | RANGE_REQUIRED_MEMBER | IDENTIFY | STRONG_INFERENCE | characteristics of sine-waves |
| peak to peak value (sine-wave characteristic) | RANGE_REQUIRED_MEMBER | IDENTIFY | STRONG_INFERENCE | characteristics of sine-waves |
| periodic time (sine-wave characteristic) | RANGE_REQUIRED_MEMBER | IDENTIFY | STRONG_INFERENCE | characteristics of sine-waves |
| frequency (sine-wave characteristic) | RANGE_REQUIRED_MEMBER | IDENTIFY | STRONG_INFERENCE | characteristics of sine-waves |
| amplitude (sine-wave characteristic) | RANGE_REQUIRED_MEMBER | IDENTIFY | STRONG_INFERENCE | characteristics of sine-waves |

**REVIEW-PROPOSED KNOWLEDGE (does not auto-govern):**

- `unit202.review-fact.rms-value` on RMS value (sine-wave characteristic)::IDENTIFY: AC5.5 Range member 'Root Mean Square (RMS) value' -- minimally requires knowing RMS is the value that produces an equivalent DC heating effect, related to the peak value. A WebFetch attempt against OpenStax College Physics 2e §20.5 returned an equation with ambiguous rendering of the divisor (possibly '/2' or '/sqrt(2)', a known math-notation extraction limitation of the fetch tool) -- rather than assert an uncertain verbatim excerpt, this proposal stands with a TECHNICAL_TRUTH_GAP. CC-19R section 21: exported for Project-Architect review; MUST NOT auto-govern or contribute to requiredFactKeys automatically.
  - **TECHNICAL_TRUTH_GAP:** fact proposed, no technical source meeting the CC-19R section 23 quality hierarchy found
- `unit202.review-fact.average-value` on average value (sine-wave characteristic)::IDENTIFY: AC5.5 Range member 'Average value' -- minimally requires knowing the mean value of a sine wave over a half-cycle, related to the peak value. No reliably verbatim technical source was obtained this session (same math-notation extraction limitation as the RMS value); TECHNICAL_TRUTH_GAP. CC-19R section 21: exported for Project-Architect review; MUST NOT auto-govern or contribute to requiredFactKeys automatically.
  - **TECHNICAL_TRUTH_GAP:** fact proposed, no technical source meeting the CC-19R section 23 quality hierarchy found
- `unit202.review-fact.peak-to-peak-value` on peak to peak value (sine-wave characteristic)::IDENTIFY: AC5.5 Range member 'Peak to peak value' -- minimally requires knowing peak-to-peak is the total excursion between the positive and negative peaks of the waveform. TECHNICAL_TRUTH_GAP -- not independently verified against a verbatim technical source this session. CC-19R section 21: exported for Project-Architect review; MUST NOT auto-govern or contribute to requiredFactKeys automatically.
  - **TECHNICAL_TRUTH_GAP:** fact proposed, no technical source meeting the CC-19R section 23 quality hierarchy found
- `unit202.review-fact.periodic-time` on periodic time (sine-wave characteristic)::IDENTIFY: AC5.5 Range member 'Periodic time' -- minimally requires knowing the periodic time T is the time for one complete cycle, T=1/f. TECHNICAL_TRUTH_GAP -- not independently verified against a verbatim technical source this session. CC-19R section 21: exported for Project-Architect review; MUST NOT auto-govern or contribute to requiredFactKeys automatically.
  - **TECHNICAL_TRUTH_GAP:** fact proposed, no technical source meeting the CC-19R section 23 quality hierarchy found
- `unit202.review-fact.ac-sine-equation` on frequency (sine-wave characteristic)::IDENTIFY: AC5.5 Range member 'Frequency' -- minimally requires knowing frequency f (hertz) is the number of complete cycles per second, per the sinusoidal voltage equation already sourced for AC5.4. CC-19R section 21: exported for Project-Architect review; MUST NOT auto-govern or contribute to requiredFactKeys automatically.
  - **TECHNICAL TRUTH:** An AC voltage waveform is described by V = V0 sin(2*pi*f*t) (equation 20.38), where f is the frequency in hertz. (OpenStax, College Physics 2e, §20.5 "Alternating Current versus Direct Current")
- `unit202.review-fact.amplitude-value` on amplitude (sine-wave characteristic)::IDENTIFY: AC5.5 Range member 'Amplitude' -- minimally requires knowing amplitude is the maximum displacement of the waveform from its zero/mean value (the peak value). TECHNICAL_TRUTH_GAP -- not independently verified against a verbatim technical source this session. CC-19R section 21: exported for Project-Architect review; MUST NOT auto-govern or contribute to requiredFactKeys automatically.
  - **TECHNICAL_TRUTH_GAP:** fact proposed, no technical source meeting the CC-19R section 23 quality hierarchy found

## LO6: Understand the types, applications and limitations of electronic components in electrical systems and equipment

### AC6.1

**RAW SOURCE (AC wording, page 27):** "describe the function and application of electronic components that are used in electrical systems"

**NORMALIZED REQUIRED CONTENT:**

| Candidate | Kind | Performance | Confidence | Refines |
|---|---|---|---|---|
| function and application of electronic components used in electrical systems | PRIMARY_REQUIREMENT | DESCRIBE | EXPLICIT | - |
| electrical systems (context for electronic component function/application) | RANGE_CATEGORY | DESCRIBE | EXPLICIT | - |
| electronic components function/application: security alarms | RANGE_REQUIRED_MEMBER | DESCRIBE | STRONG_INFERENCE | function and application of electronic components used in electrical systems |
| electronic components function/application: telephones | RANGE_REQUIRED_MEMBER | DESCRIBE | STRONG_INFERENCE | function and application of electronic components used in electrical systems |
| electronic components function/application: dimmer switches | RANGE_REQUIRED_MEMBER | DESCRIBE | STRONG_INFERENCE | function and application of electronic components used in electrical systems |
| electronic components function/application: heating/boiler controls | RANGE_REQUIRED_MEMBER | DESCRIBE | STRONG_INFERENCE | function and application of electronic components used in electrical systems |
| electronic components function/application: motor control | RANGE_REQUIRED_MEMBER | DESCRIBE | STRONG_INFERENCE | function and application of electronic components used in electrical systems |
| electronic components function/application: wireless control systems | RANGE_REQUIRED_MEMBER | DESCRIBE | STRONG_INFERENCE | function and application of electronic components used in electrical systems |

### AC6.2

**RAW SOURCE (AC wording, page 27):** "state the basic operating principles of electronic components and devices"

**NORMALIZED REQUIRED CONTENT:**

| Candidate | Kind | Performance | Confidence | Refines |
|---|---|---|---|---|
| basic operating principles of electronic components and devices | PRIMARY_REQUIREMENT | STATE | EXPLICIT | - |
| electronic components and devices | RANGE_CATEGORY | STATE | EXPLICIT | - |
| capacitors | RANGE_REQUIRED_MEMBER | STATE | STRONG_INFERENCE | basic operating principles of electronic components and devices |
| resistors | RANGE_REQUIRED_MEMBER | STATE | STRONG_INFERENCE | basic operating principles of electronic components and devices |
| rectifiers | RANGE_REQUIRED_MEMBER | STATE | STRONG_INFERENCE | basic operating principles of electronic components and devices |
| diodes | RANGE_REQUIRED_MEMBER | STATE | STRONG_INFERENCE | basic operating principles of electronic components and devices |
| Zener | RANGE_REQUIRED_MEMBER | STATE | STRONG_INFERENCE | basic operating principles of electronic components and devices |
| LED | RANGE_REQUIRED_MEMBER | STATE | STRONG_INFERENCE | basic operating principles of electronic components and devices |
| photo | RANGE_REQUIRED_MEMBER | STATE | STRONG_INFERENCE | basic operating principles of electronic components and devices |
| thermistors | RANGE_REQUIRED_MEMBER | STATE | STRONG_INFERENCE | basic operating principles of electronic components and devices |
| diacs | RANGE_REQUIRED_MEMBER | STATE | STRONG_INFERENCE | basic operating principles of electronic components and devices |
| triacs | RANGE_REQUIRED_MEMBER | STATE | STRONG_INFERENCE | basic operating principles of electronic components and devices |
| transistors | RANGE_REQUIRED_MEMBER | STATE | STRONG_INFERENCE | basic operating principles of electronic components and devices |
| thyristors | RANGE_REQUIRED_MEMBER | STATE | STRONG_INFERENCE | basic operating principles of electronic components and devices |
| invertors | RANGE_REQUIRED_MEMBER | STATE | STRONG_INFERENCE | basic operating principles of electronic components and devices |

**REVIEW-PROPOSED KNOWLEDGE (does not auto-govern):**

- `unit202.review-fact.diode-definition` on diodes::STATE: AC6.2 requires stating basic operating principles of electronic components including diodes -- minimally requires knowing a diode conducts current in one direction only. CC-19R section 21: exported for Project-Architect review; MUST NOT auto-govern or contribute to requiredFactKeys automatically.
  - **TECHNICAL TRUTH:** A diode is a circuit element that allows electric current to flow in only one direction. (OpenStax, University Physics Volume 3, §9.7 "Semiconductor Devices")
- `unit202.review-fact.zener-definition` on Zener::STATE: AC6.2 requires stating basic operating principles of electronic components including Zener -- minimally requires knowing a Zener diode is operated in reverse breakdown as a voltage reference. CC-19R section 21: exported for Project-Architect review; MUST NOT auto-govern or contribute to requiredFactKeys automatically.
  - **TECHNICAL TRUTH:** A Zener diode is a reverse-biased diode designed to operate in breakdown, used as a voltage reference. (Engineering LibreTexts, Introduction to Physical Electronics (Wilson), §1.10 "Reverse Biased/Breakdown")
- `unit202.review-fact.led-definition` on LED::STATE: AC6.2 requires stating basic operating principles of electronic components including LED -- minimally requires knowing an LED is a forward-biased p-n junction that emits light. CC-19R section 21: exported for Project-Architect review; MUST NOT auto-govern or contribute to requiredFactKeys automatically.
  - **TECHNICAL TRUTH:** An LED is a p-n junction semiconductor device that emits light (a photon) when forward biased, due to electron-hole recombination. (Engineering LibreTexts, Semiconductors, "Light Emitting Diodes")
- `unit202.review-fact.thermistor-definition` on thermistors::STATE: AC6.2 requires stating basic operating principles of electronic components including thermistors -- minimally requires knowing a thermistor's resistance is sensitive to temperature. CC-19R section 21: exported for Project-Architect review; MUST NOT auto-govern or contribute to requiredFactKeys automatically.
  - **TECHNICAL TRUTH:** A thermistor is a semiconducting device whose resistance is very sensitive to temperature. (Physics LibreTexts, Electricity and Magnetism (Tatum), §4.3 "Resistance and Temperature")
- `unit202.review-fact.transistor-definition` on transistors::STATE: AC6.2 requires stating basic operating principles of electronic components including transistors -- minimally requires knowing a transistor amplifies or switches electrical signals. CC-19R section 21: exported for Project-Architect review; MUST NOT auto-govern or contribute to requiredFactKeys automatically.
  - **TECHNICAL TRUTH:** A transistor is a device that can amplify or switch electrical signals. (OpenStax, University Physics Volume 3, §9.7 "Semiconductor Devices")
- `unit202.review-fact.ohms-law` on resistors::STATE: AC6.2 requires stating basic operating principles of electronic components including resistors -- minimally requires knowing a resistor's function is governed by Ohm's law, R=V/I (already sourced for AC4.3/4.4/4.5). CC-19R section 21: exported for Project-Architect review; MUST NOT auto-govern or contribute to requiredFactKeys automatically.
  - **TECHNICAL TRUTH:** R = V/I (equation 9.8) (OpenStax, University Physics Volume 2, §9.3 "Resistivity and Resistance")
- `unit202.review-fact.capacitor-definition` on capacitors::STATE: AC6.2 requires stating basic operating principles of electronic components including capacitors -- minimally requires knowing a capacitor stores electrical charge/energy. CC-19R section 21: exported for Project-Architect review; MUST NOT auto-govern or contribute to requiredFactKeys automatically.
  - **TECHNICAL TRUTH:** A capacitor is a device used to store electrical charge and electrical energy. (OpenStax, University Physics Volume 2, §8.1 "Capacitors and Capacitance")
- `unit202.review-fact.rectifier-definition` on rectifiers::STATE: AC6.2 requires stating basic operating principles of electronic components including rectifiers -- minimally requires knowing a rectifier converts AC to DC. CC-19R section 21: exported for Project-Architect review; MUST NOT auto-govern or contribute to requiredFactKeys automatically.
  - **TECHNICAL TRUTH:** Rectification is the process of turning an alternating-current waveform into a direct-current waveform (a signal with only a single polarity). (Engineering LibreTexts, Semiconductor Devices -- Theory and Application (Fiore), §3.2 "Rectification")
- `unit202.review-fact.diac-definition` on diacs::STATE: AC6.2 requires stating basic operating principles of electronic components including diacs -- minimally requires knowing a diac is a bidirectional trigger device. CC-19R section 21: exported for Project-Architect review; MUST NOT auto-govern or contribute to requiredFactKeys automatically.
  - **TECHNICAL TRUTH:** A DIAC is formed by joining two Shockley diodes in parallel facing opposite directions, giving bidirectional (AC) triggering. (Workforce LibreTexts, Electric Circuits III -- Semiconductors (Kuphaldt), §7.4 "The DIAC")
- `unit202.review-fact.triac-definition` on triacs::STATE: AC6.2 requires stating basic operating principles of electronic components including triacs -- minimally requires knowing a triac is a bidirectional thyristor equivalent to two back-to-back SCRs. CC-19R section 21: exported for Project-Architect review; MUST NOT auto-govern or contribute to requiredFactKeys automatically.
  - **TECHNICAL TRUTH:** A TRIAC acts like two SCRs connected back-to-back for bidirectional (AC) operation. (Workforce LibreTexts, Electric Circuits III -- Semiconductors (Kuphaldt), §7.6 "The TRIAC")
- `unit202.review-fact.thyristor-definition` on thyristors::STATE: AC6.2 requires stating basic operating principles of electronic components including thyristors -- minimally requires knowing a thyristor is a latching switch that remains conducting once triggered until current falls to zero. CC-19R section 21: exported for Project-Architect review; MUST NOT auto-govern or contribute to requiredFactKeys automatically.
  - **TECHNICAL TRUTH:** An SCR/thyristor is a latching semiconductor switch: once triggered on, internal feedback keeps it conducting until current is reduced to cutoff (a hysteretic device that, triggered during an AC half-cycle, remains on until current decreases to zero). (Workforce LibreTexts, Electric Circuits III -- Semiconductors (Kuphaldt), §7.5 "The Silicon-Controlled Rectifier (SCR)")
- `unit202.review-fact.invertor-definition` on invertors::STATE: AC6.2 requires stating basic operating principles of electronic components including invertors -- minimally requires knowing an invertor converts DC to AC. No source meeting the CC-19R section 23 quality hierarchy (standards body / government publication / open academic textbook) was found this session (only Wikipedia/commercial results); the proposal stands with a TECHNICAL_TRUTH_GAP rather than being sourced from a lower-tier site. CC-19R section 21: exported for Project-Architect review; MUST NOT auto-govern or contribute to requiredFactKeys automatically.
  - **TECHNICAL_TRUTH_GAP:** fact proposed, no technical source meeting the CC-19R section 23 quality hierarchy found

## Qualification-level evidence

2 descriptor(s) x 139 required candidates = 278 QualificationLevelEvidence records (see cc19r-normalization-ledger.json for the full per-candidate list). Depth constraint only, never scope (CC-19R section 17).

- **knowledge:** "Has knowledge and understanding of facts, procedures and ideas in an area of study or field of work to complete well-defined tasks and address straightforward problems. Can interpret relevant information and ideas. Is aware of a range of information that is relevant to the area of study or work."
- **skills:** "Select and use relevant cognitive and practical skills to complete well-defined, generally routine tasks and address straightforward problems. Identify, gather and use relevant information to inform actions. Identify how effective actions have been."

## Official curriculum-unit registry

29 entries (6 Learning Outcomes + 23 Assessment Criteria), verbatim official wording -- CC-19R1 DEFECT-A fix.
