# CC-19R Source Inventory -- Unit 202 Principles of Electrical Science

Clean-room source inventory for City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02), Unit 202. See `CC-19R-SOURCE-ACCESS-LOG.json` for the full, sequenced, timestamped access log this inventory summarizes.

## A. OFFICIAL_CURRICULUM

| Document | Version | URL | Local copy | SHA-256 |
|---|---|---|---|---|
| 2365-02 L2 Electrical Installation Qualification Handbook | v1-12 | [link](https://www.cityandguilds.com/-/media/productdocuments/building_services_engineering/electrical_installation/2365/2365_level_2/centre_documents/2365-02_l2_electrical_installation_qualification_handbook_v1-12-pdf.pdf) | `raw-sources/2365-02_L2_handbook_v1-12.pdf` | `f6bc7a6c76e37a60a9d9830f873ab1079d230015d1ad95f458d69caa82dc9515` |

Discovered by following the current official City & Guilds landing page ("Electrotechnical Craft qualifications and training courses") rather than guessing a historical filename, per CC-19R section 4. Unit 202 content (pages 23-29) was read and transcribed verbatim into `scripts/backtests/unit202-cleanroom/curriculum-data.ts`.

## B. PUBLIC_ASSESSMENT

| Document | Status | Notes |
|---|---|---|
| 5357 and 2365 Sample Papers v1-2 (questions) | **RAW_SOURCE_UNAVAILABLE** | Downloaded directly from the current official landing page link (and independently re-confirmed byte-identical via the Level 3 landing page's own copy of the same file). The PDF is genuinely password-protected -- both `pdftotext`/`pdfinfo` (with and without an explicit empty user password) and the platform's PDF reader reject it with "Incorrect password". CC-19R section B explicitly disallows password-protected/private material, so **no content from this file was used as evidence anywhere in the ledger**. |
| 5357 and 2365 Sample Papers - Mark schemes v1-0 | **ACCESSED, INSUFFICIENT** | Not encrypted; full text extracted. Contains only a bare question-number -> answer-letter key for the 2365-602 "Principles of Electrical Science" sample e-volve MC test (40 items). No question stems, no answer-option text, no distractor content -- CC-19R section 16 requires the question-stem excerpt and correct-answer *content* for every item, which an answer letter alone cannot supply. No `AssessmentEvidence` records were created. |

**Consequence for the profile model (CC-19R section 16/26):** because no PUBLIC_ASSESSMENT evidence was successfully normalized, `FULL_PUBLIC` and `DEGRADED_NO_ASSESSMENT` are **identical** in this run -- mechanically filtering out PUBLIC_ASSESSMENT evidence removes nothing, since none exists. This is reported transparently, not manufactured as a false distinction.

## C. QUALIFICATION_LEVEL

| Document | URL | Notes |
|---|---|---|
| Ofqual Handbook, Section E / Condition E9, Level 2 descriptors | [link](https://www.gov.uk/guidance/ofqual-handbook/section-e-design-and-development-of-qualifications) | Web-native source (page states "Page last updated: 4 December 2025"); no PDF preserved per CC-19R section 6. Both the knowledge/understanding descriptor and the skills descriptor were normalized as separate `QualificationLevelEvidence` records, applied as depth constraints only. |

## D. TECHNICAL_TRUTH

25 distinct authoritative technical sources were consulted (see `CC-19R-SOURCE-ACCESS-LOG.json` sequence 6-28 for the full list with reasons), covering:

- **BIPM** SI Brochure (9th edition concise): base/derived SI units (Tables 1-2), and the generic "unit one" dimensionless convention (used only in support of the power-factor claim, never alone).
- **NIST** Guide to the SI, Chapter 4: coherent (non-specially-named) derived units -- area, volume, velocity, density.
- **OpenStax** (Rice University) University Physics Volumes 1-3, College Physics 2e, Physics, and Chemistry 2e: mass/weight, work/power/efficiency, kinetic/potential energy, Ohm's law and resistivity, series/parallel resistance, conductors/insulators, current and electron-flow direction, thermal power dissipation, electrolysis, magnetic pole attraction/repulsion, force on a current-carrying conductor, Faraday's law, diodes, transistors, and the power-factor defining relationship (cos phi).
- **Engineering/Physics LibreTexts** (Virginia Tech, various universities): magnetic flux density, Zener diode breakdown behaviour, LED p-n junction light emission, thermistor temperature sensitivity.

One attempted source (All About Circuits, for thyristor latching behaviour) returned HTTP 403 and was not used; this is recorded as a known unresolved decomposition rather than substituted with a lower-tier source.

## Generic mechanism files inspected (NOT Unit-202 evidence)

- `packages/qualification-pipeline/src/types.ts`
- `packages/qualification-pipeline/src/index.ts`

`rules.ts` was not opened -- `buildStandardPipeline` is never called by this package (Layer C is `NOT_RUN_CC19R` throughout).
