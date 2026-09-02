# CC-19A Source Inventory

Every candidate raw source considered for the Unit 202 blind normalization, classified BEFORE its content was normalized. An `EXCLUDED_*` source was never opened beyond what is quoted in its own `reason` below.

## Included sources

### src-cg-2365-02-handbook-v1-12

- **Role:** OFFICIAL_CURRICULUM
- **Title:** City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) -- Qualification Handbook, April 2026, Version 1.12
- **Source ref:** https://www.cityandguilds.com/-/media/productdocuments/building_services_engineering/electrical_installation/2365/2365_level_2/centre_documents/2365-02_l2_electrical_installation_qualification_handbook_v1-12-pdf.pdf
- **Status:** PUBLIC
- **SHA-256:** `f6bc7a6c76e37a60a9d9830f873ab1079d230015d1ad95f458d69caa82dc9515`
- **Reason:** Official first-party City & Guilds qualification handbook, fetched directly from cityandguilds.com (no login/paywall). Contains Unit 202's own Learning Outcome / Assessment Criterion / Range wording verbatim (pages 25-30) plus the official 4.1 Test Specification LO-question-allocation table (page 15). This IS the permitted category-1 evidence (task section 3.1). Retained locally at reports/backtests/unit202/raw-sources/src-cg-2365-02-handbook-v1-12.pdf for audit.

### src-cg-602-sample-mark-schemes-v1-0

- **Role:** PUBLIC_ASSESSMENT
- **Title:** 5357 Level 3 Electrotechnical / 2365 Level 2 and 3 Diploma in Electrical Installations (Buildings and Structures) -- Sample paper mark schemes, City & Guilds, August 2018, v1.0
- **Source ref:** https://www.cityandguilds.com/-/media/productdocuments/building_services_engineering/electrical_installation/2365/2365_level_2/assessment_materials/sample_assessment/5357-and-2365-sample-papers---mark-schemes-v1-0-pdf.pdf
- **Status:** PUBLIC
- **SHA-256:** `0fba6fc4d2ad0f7662cc7068b184e815ddca4b17b3fa91f9772c058d62c770d7`
- **Reason:** Official first-party City & Guilds document, fetched directly from cityandguilds.com. Confirmed to contain a genuine 40-row Question->Key answer table for '2365-602 Principles of Electrical Science' (page 4 of the PDF). INCLUDED as a permitted PUBLIC_ASSESSMENT source, but contributes ZERO AssessmentEvidence proposals: it carries ONLY bare letter answer keys (e.g. 'Q1: C'), never a question stem or answer-option text, so no subject/performance/positive-target can be normalized from it. See the companion RAW_SOURCE_UNAVAILABLE record below for the missing question-stem document.

### src-bipm-si-brochure-9th-edition

- **Role:** TECHNICAL_TRUTH
- **Title:** The International System of Units (SI), 9th edition (2019), Bureau International des Poids et Mesures (BIPM)
- **Source ref:** https://www.bipm.org/documents/20126/41483022/SI-Brochure-9-EN.pdf
- **Status:** PUBLIC
- **SHA-256:** `5442eea2c680caf77a9d96879205a97f57c7c270b98a0bd0126c18fefe47e02c`
- **Reason:** Official first-party BIPM publication, CC BY 4.0 licensed (confirmed on the document's own copyright page), fetched directly from bipm.org. Used strictly as Layer-C-independent Layer-B technical truth ONLY for CandidateFactRequirement proposals that had already independently arisen from Unit 202's own AC2.1/AC2.2 curriculum wording (task section 17 -- never used to seed scope). Tables 2, 4 and 5 (pages 126, 133-134, 135) supply the SI unit name/symbol for length, area, volume, mass, density, time, temperature, velocity, current, voltage, resistance, power, frequency, energy, capacitance and inductance; section 2.3.3 (page 132) supplies the general dimensionless-ratio-quantity principle used for power factor.

## Excluded sources

### EXCLUDED_DERIVED (11)

- **alp-cc04-unit202-electrical-science** -- CC-04/CC-04A/CC-04B: the Unit 202 proving-slice knowledge corpus (ALP's own knowledge-graph assertions) (`scripts/content/data/cc04-unit202-electrical-science.ts`)
  ALP's own existing, governed knowledge-graph corpus for Unit 202 -- author-written assertion statements, ALP's own curriculum mapping decisions, and ALP's own provenance links. Its own header explicitly documents having been reconciled against 'the official 2365-202 SmartScreen/handout material' historically. Falls squarely under task section 2.B ('existing Unit 202 knowledge assertions') and 2.A-adjacent contamination (SmartScreen-informed). Never opened beyond its header comment block.
- **alp-unit202-depth-performance-matrix** -- Unit 202 Depth & Performance Matrix (governed) (`scripts/content/data/unit202-depth-performance-matrix.ts`)
  The existing Unit 202 answer this back-test exists to independently test against. Explicitly forbidden (task section 2.B). Not opened at all.
- **alp-unit202-qualification-scope-audit** -- CC-16 Unit 202 Qualification Scope Audit (`scripts/content/data/unit202-qualification-scope-audit.ts`)
  Explicitly forbidden (task section 2.B, 'CC-16 qualification-scope audit'). Not opened at all.
- **alp-unit202-blind-calibration-baseline** -- CC-17 Unit 202 Blind Calibration Baseline (`scripts/content/data/unit202-blind-calibration-baseline.ts`)
  Explicitly forbidden (task section 2.A/2.B, 'CC-17/CC-17A/CC-17B calibration baseline or calibration exports'). Not opened at all.
- **alp-unit202-blind-calibration-baseline-snapshot** -- CC-17 Unit 202 Blind Calibration Baseline -- named historical snapshot (`scripts/content/data/unit202-blind-calibration-baseline-5d45953-snapshot.ts`)
  Same exclusion basis as the live CC-17 baseline. Not opened at all.
- **alp-unit202-knowledge-obligations** -- Unit 202 knowledge obligations (`scripts/content/data/unit202-knowledge-obligations.ts`)
  Explicitly forbidden (task section 2.B, 'current Unit 202 knowledge obligations'). Not opened at all.
- **alp-unit202-source-acquisition-manifest** -- Unit 202 Source Acquisition Manifest (CC-15-family) (`scripts/content/data/unit202-source-acquisition-manifest.ts`)
  A prior derived source-requirements artefact: its clusterKey/requirementText/relatedAcNumbers fields are ALP's own prior interpretation of what the curriculum requires (task section 2.C). Never used as evidence for what belongs in scope. Not opened beyond what was already surfaced incidentally during earlier CC-18 series work in this repository; not re-opened for CC-19A.
- **alp-unit202-technical-source-verification** -- Unit 202 Technical Source Verification dossier (CC-15A-family) (`scripts/content/data/unit202-technical-source-verification.ts`)
  Task section 2.C permits a technical-source registry to be used only as a ROUTE to a raw locator after a fact requirement has independently arisen -- but its propositionCoverage records are keyed against the also-excluded source-acquisition-manifest's clusterKey/requirementText, so even routing through it risks importing ALP's own prior requirement framing. CC-19A instead located and independently fetched primary technical sources (e.g. the BIPM SI Brochure) directly, bypassing this dossier entirely. Not used as a route or as evidence.
- **alp-unit202-proving-fixture** -- Unit 202 mobile proving fixture (`apps/mobile/src/lib/proving-content/unit202-proving-fixture.ts`)
  Existing ALP learning-package/proving content derived from the governed matrix. Task section 2.B ('legacy Unit 202 learning-package content'). Not opened at all.
- **alp-unit202-lesson-content** -- Unit 202 lesson content (all lesson-*.ts data files) (`scripts/content/data/lesson-*.ts (25 files, see scripts/content/data/lessons.ts index)`)
  Existing ALP lesson content. Task section 2.B. Not opened at all.
- **alp-unit202-assessment-specification** -- CC-09A Unit 202 assessment specification (governed AssessmentSpecification data) (`scripts/content/data/unit202-assessment-specification.ts`)
  Self-describes as a transcription of the same handbook edition CC-19A independently fetched directly. Excluded as a matter of policy (an ALP-authored transcription of the primary source is never used in place of independently re-fetching the primary source itself) even though its own content agrees with the independently-fetched handbook's 4.1 Test Specification table (2/5/7/15/7/4 question allocation across LO1-6) -- that agreement was observed only as an incidental corroboration after CC-19A's own independent transcription, never as a substitute for it.

### EXCLUDED_LEGACY (2)

- **alp-unit202-obsolete-visual-assets** -- Unit 202 obsolete instructional visual assets (`apps/mobile/src/assets/instructional/obsolete-assets/unit202/`)
  Legacy visual/storyboard assets. Task section 2.B ('storyboards', 'visual assets'). Not opened at all.
- **alp-instructional-visuals-reports** -- Instructional visuals production/audit reports (`reports/instructional-visuals/`)
  Derived visual-production audit artefacts (also two of these files are the protected, unrelated dirty files this package must not touch). Task section 2.B. Not opened at all.

### EXCLUDED_NOT_RELEVANT (8)

- **thirdparty-scribd-2365-602-practice-questions** -- "2365-602 Electrical Science Practice Test Questions.pdf" (Scribd upload) (`https://www.scribd.com/document/642601168/2365-602-Electrical-Science-Practice-Test-Questions-pdf`)
  Third-party file-sharing upload of unverifiable origin, not an official City & Guilds publication. Never opened.
- **thirdparty-scribd-2365-202-mock-science** -- "2365 202 Sample Questions MOCK SCIENCE" (Scribd upload) (`https://www.scribd.com/document/869514077/2365-202-Sample-Questions-MOCK-SCIENCE`)
  Third-party file-sharing upload of unverifiable origin ('MOCK' in the title itself signals it is not an official specimen paper), not an official City & Guilds publication. Never opened.
- **thirdparty-efixx-practice-questions** -- "Practice Exam Questions for Electrical Science and Principles" (efixx.co.uk) (`https://www.efixx.co.uk/Apprentice%20Hub/science-and-principles-practice-exam-questions`)
  Third-party training-company practice content, not an official City & Guilds publication or answer key. Never opened.
- **thirdparty-sparkyfacts-simulator** -- "C&G 2365-302 Practice questions" test simulator (sparkyfacts.co.uk) (`https://www.sparkyfacts.co.uk/2365_Unit302/2365_Unit302_test_simulator.php`)
  Third-party practice simulator, and for a different unit (302, Level 3) in any case. Never opened.
- **thirdparty-openexamprep** -- "Free C&G 2365 Level 2 Practice Test" (open-exam-prep.com) (`https://open-exam-prep.com/practice/uk-city-guilds-2365-l2`)
  Third-party unofficial practice-test generator, not an official City & Guilds publication. Never opened.
- **thirdparty-youtube-playlist** -- "City & Guilds 2365 Unit 202 Principles of Electrical..." (YouTube playlist) (`https://www.youtube.com/playlist?list=PL7eNzIRgKe05OTY_izNhHMi-ODaejd2p1`)
  Third-party video content, not an official City & Guilds publication. Never opened.
- **thirdparty-cg-602-questions-companion-404** -- Companion "sample papers" (questions) document referenced by search-engine indexing (`https://www.cityandguilds.com/-/media/productdocuments/building_services_engineering/electrical_installation/2365/2365_level_2/assessment_materials/sample_assessment/5357-and-2365-sample-papers-v1-0-pdf.pdf`)
  First-party cityandguilds.com URL pattern (mirrors the included mark-schemes document with '-mark-schemes-' removed), but returns a live 404 'page not found' from the City & Guilds site itself. Confirmed dead, not a private/paywalled redirect. Recorded here for auditability of the RAW_SOURCE_UNAVAILABLE finding below.
- **ofqual-qualification-and-component-levels-withdrawn** -- Ofqual "Qualification and Component Levels" (Ofqual/15/5774) (`https://assets.publishing.service.gov.uk/media/5b75448c40f0b60be2544ca8/qualification-and-component-levels.pdf`)
  Official government publication, but its own cover page is stamped 'WITHDRAWN -- This document has been removed or replaced.' A withdrawn regulatory document is not used as current qualification-level evidence. No current replacement was located within CC-19A's own research scope; see the QUALIFICATION_LEVEL gap recorded in the normalization ledger accounting instead of forcing a stale citation.

## Unavailability records

### RAW_SOURCE_UNAVAILABLE: PUBLIC_ASSESSMENT item-level content (question stem + answer options) for 2365-602 Principles of Electrical Science

- **Attempted sources:**
  - src-cg-602-sample-mark-schemes-v1-0 (fetched -- confirmed answer-key-only, no stems)
  - thirdparty-cg-602-questions-companion-404 (fetched -- confirmed 404 on cityandguilds.com's own site)
  - web search for an official companion 'sample paper' / 'specimen paper' with question text -- returned only third-party/unofficial hits (see EXCLUDED_NOT_RELEVANT entries above), none official
- **Explanation:** City & Guilds publicly releases only the bare per-question letter answer key for the 2365-602 e-volve test, never the question stems or answer options themselves (these are delivered only through the secure, centre/candidate-authenticated e-volve/Walled Garden testing platform, which CC-19A has no access to and would not be permitted to use even if it did, per task section 2.A/3.2's 'positive target evidence... publicly available' requirement). Per task section 4, this evidence class is reported RAW_SOURCE_UNAVAILABLE rather than substituted from any derived source. Zero AssessmentEvidence proposals are produced in this package.
