/**
 * CC-15: the Unit 202 Technical Source Verification package -- ingestion,
 * retrieval and proposition-level coverage of the Project-Architect-
 * approved technical source dossier (`unit202-approved-technical-source-
 * dossier.md`, 2026-08-30, Product-Owner-approved). See
 * ../../../packages/content-schema/src/technical-source-verification.ts
 * for the schema this data satisfies, and
 * docs/architecture/evidence/CC-15-UNIT202-TECHNICAL-SOURCE-VERIFICATION.md
 * for the full evidence report.
 *
 * AUTHORITY BOUNDARY: every source in `approvedSources` below is exactly
 * one of the 67 sources the approved dossier named -- no replacement or
 * additional source was selected. Every `propositionCoverage` record's
 * `requirementText` is copied VERBATIM from
 * `./unit202-source-acquisition-manifest.ts`'s own required-knowledge
 * arrays (never paraphrased or invented here) -- the validator
 * (../validate-unit202-technical-source-verification.ts) mechanically
 * cross-checks this. Every VERIFIED record's supporting locator(s) were
 * established by actually retrieving the source and reading its content
 * (directly, or via a parallel research agent instructed never to invent
 * a locator it did not see) -- not from model recollection.
 *
 * 4 of the 67 approved sources could not be retrieved in this pass despite
 * a retry using an alternate access route (Wayback Machine snapshot /
 * browser User-Agent retry) for the SAME approved URL -- never a
 * replacement source:
 *   - SRC-YOKOGAWA-POWER-MEASUREMENT (AWS WAF JavaScript challenge)
 *   - SRC-ST-AN3168-DIAC-TRIAC-DIMMER (hard origin block, no archive copy)
 *   - SRC-OFCOM-PSTN-VOIP-2026 (403, no archive copy)
 *   - SRC-OFCOM-FUTURE-LANDLINE (403; an archive copy is confirmed to
 *     exist via the Wayback CDX index, but web.archive.org itself was
 *     intermittently "Temporarily Offline" throughout this session -- a
 *     transient outage, worth a future retry, not treated as a permanent
 *     gap)
 * These remain `RETRIEVAL_FAILED` below; every proposition that depended
 * solely on one of them is `SOURCE_GAP`, never silently filled from an
 * unapproved source or from model knowledge.
 *
 * Two genuine locator-level findings surfaced during retrieval that this
 * module preserves rather than smooths over:
 *   - SRC-IASTATE-AC-WAVEFORMS states its own rectified/practical-average
 *     ratio as 0.636 (form factor 0.707/0.636), not the dossier's
 *     "0.637" -- both are valid roundings of the exact value
 *     (2/pi) ~= 0.63662; the underlying relationship is VERIFIED, but the
 *     source's own stated rounding differs from the dossier's, and that
 *     difference is recorded rather than silently reconciled.
 *   - SRC-ECAMPUS-ALTERNATOR-RELATIONSHIPS states its own formula as
 *     f = pN/60 (N in rpm, p = pole pairs) rather than the Unit 202
 *     matrix's f = N x P (N in rev/s) -- algebraically equivalent (the
 *     /60 performs the same rpm->rev/s conversion the matrix's N already
 *     assumes), and independently cross-checked against
 *     SRC-ABB-POLE-PAIR-CONVENTION's own n0 = 60f/p. Both sources are
 *     unambiguous that the pole variable is PAIRS, not total pole count.
 *
 * This package does NOT author, reconstruct, approve or alter any
 * knowledge-corpus assertion, lesson, capability or visual asset -- see
 * the evidence report's explicit "what this package did not do" section.
 */

import type { TechnicalSourceVerificationManifest } from "@alp/content-schema";

// ---------------------------------------------------------------------
// Reused existing governed source identities (see
// scripts/content/data/cc04-unit202-electrical-science.ts). These four
// dossier sources are genuinely the same source already registered
// informally in the live corpus -- reused by exact key per dossier
// section 14/this package's own instruction not to duplicate a source
// under a second label. Full record-level reconciliation (identical
// edition/version fields across both files) remains a later package's
// work; this package only proves the identity match is defensible.
// ---------------------------------------------------------------------
const SRC_BIPM = "src-bipm-si-brochure";
const SRC_OPENSTAX_UP1 = "src-openstax-university-physics-v1";
const SRC_OPENSTAX_UP2 = "src-openstax-university-physics-v2";
const SRC_OPENSTAX_CHEMISTRY = "src-openstax-chemistry-2e";

// ---------------------------------------------------------------------
// New source keys minted by this package.
// ---------------------------------------------------------------------
const SRC_NIST_SP811 = "src-nist-guide-to-si-sp811";
const SRC_OPENSTAX_PREALGEBRA = "src-openstax-prealgebra-2e";
const SRC_OPENSTAX_INTERALG = "src-openstax-intermediate-algebra-2e";
const SRC_OPENSTAX_PRECALC = "src-openstax-precalculus-2e";
const SRC_OPENSTAX_STATS = "src-openstax-introductory-statistics-2e";
const SRC_OPENSTAX_PHYSICS = "src-openstax-physics-2024";
const SRC_LIBRETEXTS_LEVER = "src-libretexts-lever-classes";
const SRC_LIBRETEXTS_GEAR_SYSTEMS = "src-libretexts-gear-driven-systems";
const SRC_LIBRETEXTS_MECHATRONICS = "src-libretexts-mechatronic-actuator-background";
const SRC_YOKOGAWA = "src-yokogawa-power-measurement";
const SRC_SCHNEIDER_ION7400 = "src-schneider-ion7400-energy";
const SRC_ECAMPUS_ELECTROTECHNOLOGY = "src-ecampus-electrotechnology";
const SRC_ABB_ASYNC_MOTORS = "src-abb-technical-application-papers-no7-asynchronous-motors";
const SRC_IASTATE_AC_WAVEFORMS = "src-iastate-applied-industrial-electricity";
const SRC_TE_RESISTOR_COLOR = "src-te-resistor-color-codes";
const SRC_ROHM_DIODE_BASICS = "src-rohm-diode-basics";
const SRC_ROHM_RECTIFIER = "src-rohm-rectifier-diode";
const SRC_ROHM_ZENER = "src-rohm-zener-diode";
const SRC_ROHM_LED_FORWARD = "src-rohm-led-forward-voltage";
const SRC_ROHM_LED_EMISSION = "src-rohm-laser-diode-led-emission-principle";
const SRC_HAMAMATSU_PHOTODIODE = "src-hamamatsu-photodiodes-exposed";
const SRC_ADVPHOTONIX_LDR = "src-advancedphotonix-ldr";
const SRC_MURATA_NTC = "src-murata-ntc-thermistor-basics";
const SRC_MURATA_PTC = "src-murata-ptc-thermistor-resistance-temperature";
const SRC_ST_DIAC_DB3 = "src-st-diac-db3";
const SRC_ST_AN3168 = "src-st-an3168-diac-triac-dimmer";
const SRC_ROHM_BJT = "src-rohm-bjt-transistor-basics";
const SRC_ROHM_NPN_SWITCH = "src-rohm-npn-transistor-switching";
const SRC_ST_AN4607_SCR = "src-st-an4607-scr-thyristor-basics";
const SRC_OMRON_E5C2 = "src-omron-e5c2-temperature-controller";
const SRC_ABB_DRIVES_TECH_GUIDE7 = "src-abb-drives-technical-guide-no7-dimensioning";
const SRC_TI_WIRELESS_ENV_SENSOR = "src-ti-wireless-environmental-sensor";
const SRC_TI_TIDA_01067 = "src-ti-tida-01067-smart-damper-control";
const SRC_OPENREACH_DIGITAL_PHONE = "src-openreach-digital-phone-lines";
const SRC_OFCOM_PSTN_VOIP = "src-ofcom-pstn-voip-switch-off-2026";
const SRC_OFCOM_FUTURE_LANDLINE = "src-ofcom-future-of-landline-calls";
const SRC_NAGOYA_OCW = "src-nagoya-ocw-electromagnetics-2024";

const RETRIEVED_DATE = "2026-08-30";
const VERIFIED_BY = "claude-code-automated-source-retrieval-2026-08-30";

export const unit202TechnicalSourceVerification: TechnicalSourceVerificationManifest = {
  approvedDossierIdentity:
    "Unit 202 Approved Technical Source Dossier (unit202-approved-technical-source-dossier.md), " +
    "Project-Architect-authored, Product-Owner-approved, dated 2026-08-30. Status " +
    "PROJECT_ARCHITECT_APPROVED_SOURCE_SELECTION. 67 approved source candidates across 20 accepted " +
    "Source-Acquisition Manifest clusters.",

  // =====================================================================
  // SOURCES -- one entry per distinct real-world document/page, reused
  // across multiple dossier entries where the same document supplies more
  // than one approved locator (e.g. University Physics Volume 2 supplies
  // 20 of the 67 dossier entries as different sections of one textbook).
  // =====================================================================
  sources: [
    {
      key: SRC_BIPM,
      title: "The International System of Units (SI Brochure)",
      publisher: "Bureau International des Poids et Mesures (BIPM)",
      sourceFamily: "International metrology standard",
      sourceType: "STANDARD",
      jurisdiction: "International",
      canonicalReference: "DOI 10.59161/AUEZ1291",
      accessLocation: "https://www.bipm.org/en/publications/si-brochure",
      sourceRole: "FACTUAL_AUTHORITY",
    },
    {
      key: SRC_NIST_SP811,
      title: "NIST Guide to the SI",
      publisher: "National Institute of Standards and Technology (NIST)",
      sourceFamily: "Government metrology guide",
      sourceType: "OFFICIAL_GUIDANCE",
      jurisdiction: "United States",
      canonicalReference: "NIST Special Publication 811",
      accessLocation: "https://www.nist.gov/pml/special-publication-811",
      sourceRole: "FACTUAL_AUTHORITY",
    },
    {
      key: SRC_OPENSTAX_PREALGEBRA,
      title: "Prealgebra 2e",
      publisher: "OpenStax / Rice University",
      sourceFamily: "Open textbook",
      sourceType: "TEXTBOOK",
      jurisdiction: "International",
      canonicalReference: "OpenStax Prealgebra 2e",
      accessLocation: "https://openstax.org/books/prealgebra-2e",
      sourceRole: "FACTUAL_AUTHORITY",
    },
    {
      key: SRC_OPENSTAX_INTERALG,
      title: "Intermediate Algebra 2e",
      publisher: "OpenStax / Rice University",
      sourceFamily: "Open textbook",
      sourceType: "TEXTBOOK",
      jurisdiction: "International",
      canonicalReference: "OpenStax Intermediate Algebra 2e",
      accessLocation: "https://openstax.org/books/intermediate-algebra-2e",
      sourceRole: "FACTUAL_AUTHORITY",
    },
    {
      key: SRC_OPENSTAX_PRECALC,
      title: "Precalculus 2e",
      publisher: "OpenStax / Rice University",
      sourceFamily: "Open textbook",
      sourceType: "TEXTBOOK",
      jurisdiction: "International",
      canonicalReference: "OpenStax Precalculus 2e",
      accessLocation: "https://openstax.org/books/precalculus-2e",
      sourceRole: "FACTUAL_AUTHORITY",
    },
    {
      key: SRC_OPENSTAX_STATS,
      title: "Introductory Statistics 2e",
      publisher: "OpenStax / Rice University",
      sourceFamily: "Open textbook",
      sourceType: "TEXTBOOK",
      jurisdiction: "International",
      canonicalReference: "OpenStax Introductory Statistics 2e",
      accessLocation: "https://openstax.org/books/introductory-statistics-2e",
      sourceRole: "FACTUAL_AUTHORITY",
    },
    {
      key: SRC_OPENSTAX_UP1,
      title: "University Physics Volume 1",
      publisher: "OpenStax / Rice University",
      sourceFamily: "Open textbook",
      sourceType: "TEXTBOOK",
      jurisdiction: "International",
      canonicalReference: "OpenStax University Physics Volume 1",
      accessLocation: "https://openstax.org/books/university-physics-volume-1",
      sourceRole: "FACTUAL_AUTHORITY",
    },
    {
      key: SRC_OPENSTAX_UP2,
      title: "University Physics Volume 2",
      publisher: "OpenStax / Rice University",
      sourceFamily: "Open textbook",
      sourceType: "TEXTBOOK",
      jurisdiction: "International",
      canonicalReference: "OpenStax University Physics Volume 2",
      accessLocation: "https://openstax.org/books/university-physics-volume-2",
      sourceRole: "FACTUAL_AUTHORITY",
    },
    {
      key: SRC_OPENSTAX_PHYSICS,
      title: "Physics",
      publisher: "OpenStax / Rice University",
      sourceFamily: "Open textbook",
      sourceType: "TEXTBOOK",
      jurisdiction: "International",
      canonicalReference: "OpenStax Physics",
      accessLocation: "https://openstax.org/books/physics",
      sourceRole: "FACTUAL_AUTHORITY",
    },
    {
      key: SRC_OPENSTAX_CHEMISTRY,
      title: "Chemistry 2e",
      publisher: "OpenStax / Rice University",
      sourceFamily: "Open textbook",
      sourceType: "TEXTBOOK",
      jurisdiction: "International",
      canonicalReference: "OpenStax Chemistry 2e",
      accessLocation: "https://openstax.org/books/chemistry",
      sourceRole: "FACTUAL_AUTHORITY",
    },
    {
      key: SRC_LIBRETEXTS_LEVER,
      title: "Lever (General Physics I: Classical Mechanics)",
      publisher: "Physics LibreTexts / Prince George's Community College",
      sourceFamily: "Open textbook",
      sourceType: "TEXTBOOK",
      jurisdiction: "International",
      canonicalReference: "Physics LibreTexts 25.04 Lever",
      accessLocation:
        "https://phys.libretexts.org/Courses/Prince_Georges_Community_College/General_Physics_I%3A_Classical_Mechanics/25%3A_Simple_Machines/25.04%3A_Lever",
      sourceRole: "FACTUAL_AUTHORITY",
    },
    {
      key: SRC_LIBRETEXTS_GEAR_SYSTEMS,
      title: "Belt- and Gear-Driven Systems (Mechanics Map)",
      publisher: "Engineering LibreTexts",
      sourceFamily: "Open textbook",
      sourceType: "TEXTBOOK",
      jurisdiction: "International",
      canonicalReference: "Engineering LibreTexts 11.2 Belt- and Gear-Driven Systems",
      accessLocation:
        "https://eng.libretexts.org/Bookshelves/Mechanical_Engineering/Mechanics_Map_%28Moore_et_al.%29/11%3A_Rigid_Body_Kinematics/11.2%3A_Belt-_and_Gear-Driven_Systems",
      sourceRole: "FACTUAL_AUTHORITY",
    },
    {
      key: SRC_LIBRETEXTS_MECHATRONICS,
      title: "Mechatronic Actuator Background",
      publisher: "Engineering LibreTexts",
      sourceFamily: "Open textbook",
      sourceType: "TEXTBOOK",
      jurisdiction: "International",
      canonicalReference: "Engineering LibreTexts 5.02 Mechatronic Actuator Background",
      accessLocation:
        "https://eng.libretexts.org/Bookshelves/Introductory_Engineering/Mechatronics%3A_Fundamentals_Design_Integration_and_Validation_%28Zhu%29/05%3A_Mechatronic_System_Component-_Actuators/5.02%3A_Mechatronic_Actuator_Background",
      sourceRole: "FACTUAL_AUTHORITY",
    },
    {
      key: SRC_YOKOGAWA,
      title: "How to Measure Electrical Power",
      publisher: "Yokogawa",
      sourceFamily: "Manufacturer technical article",
      sourceType: "APPLICATION_NOTE",
      jurisdiction: "International",
      canonicalReference: "Yokogawa: How to Measure Electrical Power",
      accessLocation: "https://www.yokogawa.com/library/resources/media-publications/how-to-measure-electrical-power/",
      sourceRole: "FACTUAL_AUTHORITY",
    },
    {
      key: SRC_SCHNEIDER_ION7400,
      title: "PowerLogic ION7400 -- Energy measurements",
      publisher: "Schneider Electric",
      sourceFamily: "Manufacturer product documentation",
      sourceType: "APPLICATION_NOTE",
      jurisdiction: "International",
      canonicalReference: "Schneider Electric PowerLogic ION7400 help -- Energy",
      accessLocation:
        "https://product-help.schneider-electric.com/PowerLogic-ION7400/en-us/content/13-measurements/energy.htm",
      sourceRole: "FACTUAL_AUTHORITY",
    },
    {
      key: SRC_ECAMPUS_ELECTROTECHNOLOGY,
      title: "Electrotechnology (PEG-3722)",
      publisher: "eCampusOntario Pressbooks",
      sourceFamily: "Open textbook",
      sourceType: "TEXTBOOK",
      jurisdiction: "International",
      canonicalReference: "eCampusOntario Electrotechnology, Parts 1 and 2",
      accessLocation: "https://ecampusontario.pressbooks.pub/electrotechnology/",
      sourceRole: "FACTUAL_AUTHORITY",
    },
    {
      key: SRC_ABB_ASYNC_MOTORS,
      title: "Technical Application Papers No.7 -- Three-phase asynchronous motors",
      publisher: "ABB",
      sourceFamily: "Manufacturer technical publication",
      sourceType: "APPLICATION_NOTE",
      jurisdiction: "International",
      canonicalReference: "ABB SACE, document 1SDC007106G0201",
      accessLocation: "https://library.e.abb.com/public/451760e552194a239c7fec9ebde3fd4a/1SDC007106G0201.pdf",
      sourceRole: "FACTUAL_AUTHORITY",
    },
    {
      key: SRC_IASTATE_AC_WAVEFORMS,
      title: "Applied Industrial Electricity -- Alternating Current",
      publisher: "Iowa State University Pressbooks",
      sourceFamily: "Open textbook",
      sourceType: "TEXTBOOK",
      jurisdiction: "International",
      canonicalReference: "Iowa State Pressbooks, Applied Industrial Electricity, Alternating Current chapter",
      accessLocation: "https://iastate.pressbooks.pub/electriccircuits/chapter/alternating-current/",
      sourceRole: "FACTUAL_AUTHORITY",
    },
    {
      key: SRC_TE_RESISTOR_COLOR,
      title: "Resistor Color Codes",
      publisher: "TE Connectivity",
      sourceFamily: "Manufacturer technical article",
      sourceType: "APPLICATION_NOTE",
      jurisdiction: "International",
      canonicalReference: "TE Connectivity: Resistor Color Codes",
      accessLocation: "https://www.te.com/en/products/passive-components/resistors/intersection/resistor-color-codes.html",
      sourceRole: "FACTUAL_AUTHORITY",
    },
    {
      key: SRC_ROHM_DIODE_BASICS,
      title: "What Is a Diode? How It Works, Types, and Applications",
      publisher: "ROHM Semiconductor",
      sourceFamily: "Manufacturer technical article",
      sourceType: "APPLICATION_NOTE",
      jurisdiction: "International",
      canonicalReference: "ROHM TechWeb, Diode basics",
      accessLocation: "https://techweb.rohm.com/product/transistors-diodes/diodes/23844/",
      sourceRole: "FACTUAL_AUTHORITY",
    },
    {
      key: SRC_ROHM_RECTIFIER,
      title: "Rectifier Diodes",
      publisher: "ROHM Semiconductor",
      sourceFamily: "Manufacturer technical article",
      sourceType: "APPLICATION_NOTE",
      jurisdiction: "International",
      canonicalReference: "ROHM TechWeb, Rectifier diode technical article",
      accessLocation: "https://techweb.rohm.com/product/transistors-diodes/diodes/23846/",
      sourceRole: "FACTUAL_AUTHORITY",
    },
    {
      key: SRC_ROHM_ZENER,
      title: "Zener Diode",
      publisher: "ROHM Semiconductor",
      sourceFamily: "Manufacturer technical article",
      sourceType: "APPLICATION_NOTE",
      jurisdiction: "International",
      canonicalReference: "ROHM TechWeb, Zener diode technical article",
      accessLocation: "https://techweb.rohm.com/product/transistors-diodes/diodes/23849/",
      sourceRole: "FACTUAL_AUTHORITY",
    },
    {
      key: SRC_ROHM_LED_FORWARD,
      title: "LED Circuit Configuration / Forward Voltage",
      publisher: "ROHM Semiconductor",
      sourceFamily: "Manufacturer technical article",
      sourceType: "APPLICATION_NOTE",
      jurisdiction: "International",
      canonicalReference: "ROHM TechWeb, LED technical content",
      accessLocation: "https://techweb.rohm.com/product/opto-electronics/led/23825/",
      sourceRole: "FACTUAL_AUTHORITY",
    },
    {
      key: SRC_ROHM_LED_EMISSION,
      title: "What are Laser Diodes?",
      publisher: "ROHM Semiconductor",
      sourceFamily: "Manufacturer technical article",
      sourceType: "APPLICATION_NOTE",
      jurisdiction: "International",
      canonicalReference: "ROHM TechWeb, laser-diode/LED shared emission-principle article",
      accessLocation: "https://techweb.rohm.com/product/opto-electronics/laser-diodes/18793/",
      sourceRole: "FACTUAL_AUTHORITY",
    },
    {
      key: SRC_HAMAMATSU_PHOTODIODE,
      title: "Photodiodes Exposed: Unlocking the Characteristics of These Crucial Sensors",
      publisher: "Hamamatsu Photonics",
      sourceFamily: "Manufacturer technical article",
      sourceType: "APPLICATION_NOTE",
      jurisdiction: "International",
      canonicalReference: "Hamamatsu Photonics, Photodiodes Exposed (2024)",
      accessLocation:
        "https://www.hamamatsu.com/eu/en/news/featured-products_and_technologies/2024/photodiodes-exposed-unlocking-the-characteristics-of-these-crucial-sensors.html",
      sourceRole: "FACTUAL_AUTHORITY",
    },
    {
      key: SRC_ADVPHOTONIX_LDR,
      title: "Light Dependent Resistor (LDR)",
      publisher: "Advanced Photonix",
      sourceFamily: "Manufacturer product documentation",
      sourceType: "APPLICATION_NOTE",
      jurisdiction: "International",
      canonicalReference: "Advanced Photonix, LDR product page",
      accessLocation: "https://www.advancedphotonix.com/our-products/light-dependent-resistor-ldr",
      sourceRole: "FACTUAL_AUTHORITY",
    },
    {
      key: SRC_MURATA_NTC,
      title: "What are NTC thermistors? And its principle of operation",
      publisher: "Murata Manufacturing",
      sourceFamily: "Manufacturer technical article",
      sourceType: "APPLICATION_NOTE",
      jurisdiction: "International",
      canonicalReference: "Murata, NTC thermistor basics",
      accessLocation: "https://www.murata.com/en-eu/products/thermistor/ntc/overview/basic/about",
      sourceRole: "FACTUAL_AUTHORITY",
    },
    {
      key: SRC_MURATA_PTC,
      title: "Resistance-Temperature Characteristics -- Basic Knowledge of PTC Thermistor (POSISTOR)",
      publisher: "Murata Manufacturing",
      sourceFamily: "Manufacturer technical article",
      sourceType: "APPLICATION_NOTE",
      jurisdiction: "International",
      canonicalReference: "Murata, PTC thermistor resistance-temperature behaviour",
      accessLocation: "https://www.murata.com/en-eu/products/thermistor/ptc/overview/basic/resistance-temperature",
      sourceRole: "FACTUAL_AUTHORITY",
    },
    {
      key: SRC_ST_DIAC_DB3,
      title: "DB3",
      publisher: "STMicroelectronics",
      sourceFamily: "Manufacturer product documentation",
      sourceType: "DATASHEET",
      jurisdiction: "International",
      canonicalReference: "STMicroelectronics DB3 trigger diode product page",
      accessLocation: "https://www.st.com/en/thyristors-scr-and-ac-switches/db3.html",
      sourceRole: "FACTUAL_AUTHORITY",
    },
    {
      key: SRC_ST_AN3168,
      title: "AN3168 -- Application note",
      publisher: "STMicroelectronics",
      sourceFamily: "Manufacturer application note",
      sourceType: "APPLICATION_NOTE",
      jurisdiction: "International",
      canonicalReference: "STMicroelectronics AN3168, Rev 2, January 2024",
      accessLocation: "https://www.st.com/resource/en/application_note/cd00266635.pdf",
      sourceRole: "FACTUAL_AUTHORITY",
    },
    {
      key: SRC_ROHM_BJT,
      title: "Transistor Basics (BJT)",
      publisher: "ROHM Semiconductor",
      sourceFamily: "Manufacturer technical article",
      sourceType: "APPLICATION_NOTE",
      jurisdiction: "International",
      canonicalReference: "ROHM TechWeb, BJT/transistor technical article",
      accessLocation: "https://techweb.rohm.com/product/transistors-diodes/transistors/23714/",
      sourceRole: "FACTUAL_AUTHORITY",
    },
    {
      key: SRC_ROHM_NPN_SWITCH,
      title: "NPN Transistor Switching",
      publisher: "ROHM Semiconductor",
      sourceFamily: "Manufacturer technical article",
      sourceType: "APPLICATION_NOTE",
      jurisdiction: "International",
      canonicalReference: "ROHM TechWeb, NPN transistor switching technical article",
      accessLocation: "https://techweb.rohm.com/product/transistors-diodes/transistors/27354/",
      sourceRole: "FACTUAL_AUTHORITY",
    },
    {
      key: SRC_ST_AN4607_SCR,
      title: "Basics on the Thyristor (SCR) Structure and its Applications",
      publisher: "STMicroelectronics",
      sourceFamily: "Manufacturer application note",
      sourceType: "APPLICATION_NOTE",
      jurisdiction: "International",
      canonicalReference: "STMicroelectronics AN4607, Rev 2, September 2018",
      accessLocation:
        "https://www.st.com/resource/en/application_note/an4607-basics-on-the-thyristor-scr-structure-and-its-application-stmicroelectronics.pdf",
      sourceRole: "FACTUAL_AUTHORITY",
    },
    {
      key: SRC_OMRON_E5C2,
      title: "E5C2 Temperature Controller Specifications",
      publisher: "OMRON Industrial Automation",
      sourceFamily: "Manufacturer product documentation",
      sourceType: "DATASHEET",
      jurisdiction: "International",
      canonicalReference: "OMRON E5C2 specification page",
      accessLocation: "https://www.ia.omron.com/products/family/167/specification.html",
      sourceRole: "FACTUAL_AUTHORITY",
    },
    {
      key: SRC_ABB_DRIVES_TECH_GUIDE7,
      title: "Technical guide No. 7 -- Dimensioning of a drive system",
      publisher: "ABB",
      sourceFamily: "Manufacturer technical publication",
      sourceType: "APPLICATION_NOTE",
      jurisdiction: "International",
      canonicalReference: "ABB Drives Technical guide No. 7, document 3AFE64362569 Rev D EN, 18 January 2022",
      accessLocation:
        "https://library.e.abb.com/public/e555e5106a3c44e882f48b75a44f6807/Technical_guide_No_7_3AFE64362569_RevD_EN_lowres.pdf",
      sourceRole: "FACTUAL_AUTHORITY",
    },
    {
      key: SRC_TI_WIRELESS_ENV_SENSOR,
      title: "Wireless environmental sensor",
      publisher: "Texas Instruments",
      sourceFamily: "Manufacturer solution page",
      sourceType: "APPLICATION_NOTE",
      jurisdiction: "International",
      canonicalReference: "Texas Instruments, Wireless environmental sensor solution",
      accessLocation: "https://www.ti.com/solution/wireless-environmental-sensor?subsystemid=34035&variantid=34084",
      sourceRole: "FACTUAL_AUTHORITY",
    },
    {
      key: SRC_TI_TIDA_01067,
      title: "TIDA-01067 Smart Damper Control Reference Design",
      publisher: "Texas Instruments",
      sourceFamily: "Manufacturer reference design",
      sourceType: "APPLICATION_NOTE",
      jurisdiction: "International",
      canonicalReference: "Texas Instruments TIDA-01067",
      accessLocation: "https://www.ti.com/tool/TIDA-01067",
      sourceRole: "FACTUAL_AUTHORITY",
    },
    {
      key: SRC_OPENREACH_DIGITAL_PHONE,
      title: "Upgrading the UK to digital phone lines",
      publisher: "Openreach",
      sourceFamily: "Industry programme page",
      sourceType: "OFFICIAL_GUIDANCE",
      jurisdiction: "UK",
      canonicalReference: "Openreach, Upgrading the UK to digital phone lines",
      accessLocation: "https://www.openreach.com/upgrading-the-UK-to-digital-phone-lines",
      sourceRole: "FACTUAL_AUTHORITY",
    },
    {
      key: SRC_OFCOM_PSTN_VOIP,
      title: "Published letter to business on PSTN switch-off deadline",
      publisher: "Ofcom",
      sourceFamily: "Regulator publication",
      sourceType: "OFFICIAL_GUIDANCE",
      jurisdiction: "UK",
      canonicalReference: "Ofcom, published letter to business on PSTN switch-off deadline (2024)",
      accessLocation:
        "https://www.ofcom.org.uk/siteassets/resources/documents/consumers/2024/published-letter-to-business-on-pstn-switch-off-deadline.pdf?v=412769",
      sourceRole: "FACTUAL_AUTHORITY",
    },
    {
      key: SRC_OFCOM_FUTURE_LANDLINE,
      title: "Future of landline calls",
      publisher: "Ofcom",
      sourceFamily: "Regulator consumer guidance",
      sourceType: "OFFICIAL_GUIDANCE",
      jurisdiction: "UK",
      canonicalReference: "Ofcom, Future of landline calls",
      accessLocation: "https://www.ofcom.org.uk/phones-and-broadband/landline-phones/future-of-landline-calls",
      sourceRole: "FACTUAL_AUTHORITY",
    },
    {
      key: SRC_NAGOYA_OCW,
      title: "Electromagnetics (2024)",
      publisher: "Nagoya University OpenCourseWare",
      sourceFamily: "University open courseware",
      sourceType: "COURSE_MATERIAL",
      jurisdiction: "International",
      canonicalReference: "Nagoya University OCW, Electromagnetics (2024)",
      accessLocation: "https://ocw.nagoya-u.jp/en/courses/0964-electromagnetics-2024/",
      sourceRole: "FACTUAL_AUTHORITY",
    },
  ],

  // =====================================================================
  // SOURCE VERSIONS -- one CURRENT snapshot per source actually retrieved
  // and inspected in this pass. The 4 RETRIEVAL_FAILED sources have no
  // sourceVersion here (their identity is registered above; no snapshot
  // was ever captured -- see `approvedSources` below for the failure
  // record).
  // =====================================================================
  sourceVersions: [
    {
      key: "sv-bipm-si-9th-edition-4.01",
      sourceKey: SRC_BIPM,
      edition: "9th edition",
      revision: "version 4.01",
      publicationDate: "2019-05-20",
      effectiveDate: "2026-06-01",
      status: "CURRENT",
      rightsClassification: "OPEN",
      retrievedDate: RETRIEVED_DATE,
      verificationStatus: "VERIFIED",
      verifiedBy: VERIFIED_BY,
    },
    {
      key: "sv-nist-sp811-current",
      sourceKey: SRC_NIST_SP811,
      status: "CURRENT",
      rightsClassification: "OPEN",
      retrievedDate: RETRIEVED_DATE,
      verificationStatus: "VERIFIED",
      verifiedBy: VERIFIED_BY,
    },
    {
      key: "sv-openstax-prealgebra-2e",
      sourceKey: SRC_OPENSTAX_PREALGEBRA,
      edition: "2nd edition",
      status: "CURRENT",
      rightsClassification: "OPEN",
      retrievedDate: RETRIEVED_DATE,
      verificationStatus: "VERIFIED",
      verifiedBy: VERIFIED_BY,
    },
    {
      key: "sv-openstax-interalg-2e",
      sourceKey: SRC_OPENSTAX_INTERALG,
      edition: "2nd edition",
      status: "CURRENT",
      rightsClassification: "OPEN",
      retrievedDate: RETRIEVED_DATE,
      verificationStatus: "VERIFIED",
      verifiedBy: VERIFIED_BY,
    },
    {
      key: "sv-openstax-precalc-2e",
      sourceKey: SRC_OPENSTAX_PRECALC,
      edition: "2nd edition",
      status: "CURRENT",
      rightsClassification: "OPEN",
      retrievedDate: RETRIEVED_DATE,
      verificationStatus: "VERIFIED",
      verifiedBy: VERIFIED_BY,
    },
    {
      key: "sv-openstax-stats-2e",
      sourceKey: SRC_OPENSTAX_STATS,
      edition: "2nd edition",
      status: "CURRENT",
      rightsClassification: "OPEN",
      retrievedDate: RETRIEVED_DATE,
      verificationStatus: "VERIFIED",
      verifiedBy: VERIFIED_BY,
    },
    {
      key: "sv-openstax-up1-current",
      sourceKey: SRC_OPENSTAX_UP1,
      status: "CURRENT",
      rightsClassification: "OPEN",
      retrievedDate: RETRIEVED_DATE,
      verificationStatus: "VERIFIED",
      verifiedBy: VERIFIED_BY,
    },
    {
      key: "sv-openstax-up2-current",
      sourceKey: SRC_OPENSTAX_UP2,
      status: "CURRENT",
      rightsClassification: "OPEN",
      retrievedDate: RETRIEVED_DATE,
      verificationStatus: "VERIFIED",
      verifiedBy: VERIFIED_BY,
    },
    {
      key: "sv-openstax-physics-2024",
      sourceKey: SRC_OPENSTAX_PHYSICS,
      status: "CURRENT",
      rightsClassification: "OPEN",
      retrievedDate: RETRIEVED_DATE,
      verificationStatus: "VERIFIED",
      verifiedBy: VERIFIED_BY,
    },
    {
      key: "sv-openstax-chemistry-2e",
      sourceKey: SRC_OPENSTAX_CHEMISTRY,
      status: "CURRENT",
      rightsClassification: "OPEN",
      retrievedDate: RETRIEVED_DATE,
      verificationStatus: "VERIFIED",
      verifiedBy: VERIFIED_BY,
    },
    {
      key: "sv-libretexts-lever-current",
      sourceKey: SRC_LIBRETEXTS_LEVER,
      status: "CURRENT",
      rightsClassification: "OPEN",
      retrievedDate: RETRIEVED_DATE,
      verificationStatus: "VERIFIED",
      verifiedBy: VERIFIED_BY,
    },
    {
      key: "sv-libretexts-gear-systems-current",
      sourceKey: SRC_LIBRETEXTS_GEAR_SYSTEMS,
      status: "CURRENT",
      rightsClassification: "OPEN",
      retrievedDate: RETRIEVED_DATE,
      verificationStatus: "VERIFIED",
      verifiedBy: VERIFIED_BY,
    },
    {
      key: "sv-libretexts-mechatronics-current",
      sourceKey: SRC_LIBRETEXTS_MECHATRONICS,
      status: "CURRENT",
      rightsClassification: "OPEN",
      retrievedDate: RETRIEVED_DATE,
      verificationStatus: "VERIFIED",
      verifiedBy: VERIFIED_BY,
    },
    {
      key: "sv-schneider-ion7400-current",
      sourceKey: SRC_SCHNEIDER_ION7400,
      status: "CURRENT",
      rightsClassification: "PROPRIETARY_REFERENCE",
      retrievedDate: RETRIEVED_DATE,
      verificationStatus: "VERIFIED",
      verifiedBy: VERIFIED_BY,
    },
    {
      key: "sv-ecampus-electrotechnology-current",
      sourceKey: SRC_ECAMPUS_ELECTROTECHNOLOGY,
      status: "CURRENT",
      rightsClassification: "OPEN",
      retrievedDate: RETRIEVED_DATE,
      verificationStatus: "VERIFIED",
      verifiedBy: VERIFIED_BY,
    },
    {
      key: "sv-abb-async-motors-current",
      sourceKey: SRC_ABB_ASYNC_MOTORS,
      status: "CURRENT",
      rightsClassification: "PROPRIETARY_REFERENCE",
      retrievedDate: RETRIEVED_DATE,
      verificationStatus: "VERIFIED",
      verifiedBy: VERIFIED_BY,
    },
    {
      key: "sv-iastate-ac-waveforms-current",
      sourceKey: SRC_IASTATE_AC_WAVEFORMS,
      status: "CURRENT",
      rightsClassification: "OPEN",
      retrievedDate: RETRIEVED_DATE,
      verificationStatus: "VERIFIED",
      verifiedBy: VERIFIED_BY,
    },
    {
      key: "sv-te-resistor-color-current",
      sourceKey: SRC_TE_RESISTOR_COLOR,
      status: "CURRENT",
      rightsClassification: "PROPRIETARY_REFERENCE",
      retrievedDate: RETRIEVED_DATE,
      verificationStatus: "VERIFIED",
      verifiedBy: VERIFIED_BY,
    },
    {
      key: "sv-rohm-diode-basics-current",
      sourceKey: SRC_ROHM_DIODE_BASICS,
      status: "CURRENT",
      rightsClassification: "PROPRIETARY_REFERENCE",
      retrievedDate: RETRIEVED_DATE,
      verificationStatus: "VERIFIED",
      verifiedBy: VERIFIED_BY,
    },
    {
      key: "sv-rohm-rectifier-current",
      sourceKey: SRC_ROHM_RECTIFIER,
      status: "CURRENT",
      rightsClassification: "PROPRIETARY_REFERENCE",
      retrievedDate: RETRIEVED_DATE,
      verificationStatus: "VERIFIED",
      verifiedBy: VERIFIED_BY,
    },
    {
      key: "sv-rohm-zener-current",
      sourceKey: SRC_ROHM_ZENER,
      status: "CURRENT",
      rightsClassification: "PROPRIETARY_REFERENCE",
      retrievedDate: RETRIEVED_DATE,
      verificationStatus: "VERIFIED",
      verifiedBy: VERIFIED_BY,
    },
    {
      key: "sv-rohm-led-forward-current",
      sourceKey: SRC_ROHM_LED_FORWARD,
      status: "CURRENT",
      rightsClassification: "PROPRIETARY_REFERENCE",
      retrievedDate: RETRIEVED_DATE,
      verificationStatus: "VERIFIED",
      verifiedBy: VERIFIED_BY,
    },
    {
      key: "sv-rohm-led-emission-current",
      sourceKey: SRC_ROHM_LED_EMISSION,
      status: "CURRENT",
      rightsClassification: "PROPRIETARY_REFERENCE",
      retrievedDate: RETRIEVED_DATE,
      verificationStatus: "VERIFIED",
      verifiedBy: VERIFIED_BY,
    },
    {
      key: "sv-hamamatsu-photodiode-current",
      sourceKey: SRC_HAMAMATSU_PHOTODIODE,
      publicationDate: "2024-01-01",
      status: "CURRENT",
      rightsClassification: "PROPRIETARY_REFERENCE",
      retrievedDate: RETRIEVED_DATE,
      verificationStatus: "VERIFIED",
      verifiedBy: VERIFIED_BY,
    },
    {
      key: "sv-advphotonix-ldr-current",
      sourceKey: SRC_ADVPHOTONIX_LDR,
      status: "CURRENT",
      rightsClassification: "PROPRIETARY_REFERENCE",
      retrievedDate: RETRIEVED_DATE,
      verificationStatus: "VERIFIED",
      verifiedBy: VERIFIED_BY,
    },
    {
      key: "sv-murata-ntc-current",
      sourceKey: SRC_MURATA_NTC,
      status: "CURRENT",
      rightsClassification: "PROPRIETARY_REFERENCE",
      retrievedDate: RETRIEVED_DATE,
      verificationStatus: "VERIFIED",
      verifiedBy: VERIFIED_BY,
    },
    {
      key: "sv-murata-ptc-current",
      sourceKey: SRC_MURATA_PTC,
      status: "CURRENT",
      rightsClassification: "PROPRIETARY_REFERENCE",
      retrievedDate: RETRIEVED_DATE,
      verificationStatus: "VERIFIED",
      verifiedBy: VERIFIED_BY,
    },
    {
      key: "sv-st-diac-db3-current",
      sourceKey: SRC_ST_DIAC_DB3,
      status: "CURRENT",
      rightsClassification: "PROPRIETARY_REFERENCE",
      retrievedDate: RETRIEVED_DATE,
      verificationStatus: "VERIFIED",
      verifiedBy: VERIFIED_BY,
    },
    {
      key: "sv-rohm-bjt-current",
      sourceKey: SRC_ROHM_BJT,
      status: "CURRENT",
      rightsClassification: "PROPRIETARY_REFERENCE",
      retrievedDate: RETRIEVED_DATE,
      verificationStatus: "VERIFIED",
      verifiedBy: VERIFIED_BY,
    },
    {
      key: "sv-rohm-npn-switch-current",
      sourceKey: SRC_ROHM_NPN_SWITCH,
      status: "CURRENT",
      rightsClassification: "PROPRIETARY_REFERENCE",
      retrievedDate: RETRIEVED_DATE,
      verificationStatus: "VERIFIED",
      verifiedBy: VERIFIED_BY,
    },
    {
      key: "sv-st-an4607-scr-rev2",
      sourceKey: SRC_ST_AN4607_SCR,
      revision: "Rev 2",
      publicationDate: "2018-09-01",
      status: "CURRENT",
      rightsClassification: "PROPRIETARY_REFERENCE",
      retrievedDate: RETRIEVED_DATE,
      verificationStatus: "VERIFIED",
      verifiedBy: VERIFIED_BY,
    },
    {
      key: "sv-omron-e5c2-current",
      sourceKey: SRC_OMRON_E5C2,
      status: "CURRENT",
      rightsClassification: "PROPRIETARY_REFERENCE",
      retrievedDate: RETRIEVED_DATE,
      verificationStatus: "VERIFIED",
      verifiedBy: VERIFIED_BY,
    },
    {
      key: "sv-abb-drives-tech-guide7-revd",
      sourceKey: SRC_ABB_DRIVES_TECH_GUIDE7,
      revision: "Rev D",
      publicationDate: "2022-01-18",
      status: "CURRENT",
      rightsClassification: "PROPRIETARY_REFERENCE",
      retrievedDate: RETRIEVED_DATE,
      verificationStatus: "VERIFIED",
      verifiedBy: VERIFIED_BY,
    },
    {
      key: "sv-ti-wireless-env-sensor-current",
      sourceKey: SRC_TI_WIRELESS_ENV_SENSOR,
      status: "CURRENT",
      rightsClassification: "PROPRIETARY_REFERENCE",
      retrievedDate: RETRIEVED_DATE,
      verificationStatus: "VERIFIED",
      verifiedBy: VERIFIED_BY,
    },
    {
      key: "sv-ti-tida-01067-current",
      sourceKey: SRC_TI_TIDA_01067,
      status: "CURRENT",
      rightsClassification: "PROPRIETARY_REFERENCE",
      retrievedDate: RETRIEVED_DATE,
      verificationStatus: "VERIFIED",
      verifiedBy: VERIFIED_BY,
    },
    {
      key: "sv-openreach-digital-phone-current",
      sourceKey: SRC_OPENREACH_DIGITAL_PHONE,
      status: "CURRENT",
      rightsClassification: "PROPRIETARY_REFERENCE",
      retrievedDate: RETRIEVED_DATE,
      verificationStatus: "VERIFIED",
      verifiedBy: VERIFIED_BY,
    },
    {
      key: "sv-nagoya-ocw-2024",
      sourceKey: SRC_NAGOYA_OCW,
      publicationDate: "2024-01-01",
      status: "CURRENT",
      rightsClassification: "OPEN",
      retrievedDate: RETRIEVED_DATE,
      verificationStatus: "VERIFIED",
      verifiedBy: VERIFIED_BY,
    },
  ],

  // =====================================================================
  // SOURCE LOCATORS -- the exact section/table/figure/page actually
  // inspected for each verified source. Every locator below was
  // established by reading real retrieved content (directly, in this
  // module's author's own session for the BIPM brochure and the missed
  // Chemistry 2e fetch; via a research agent instructed never to invent a
  // locator otherwise) -- never guessed from a URL slug alone.
  // =====================================================================
  sourceLocators: [
    {
      key: "loc-bipm-base-units",
      sourceVersionKey: "sv-bipm-si-9th-edition-4.01",
      section: "2.3.1 Base units",
      tableReference: "Table 2 (SI base units)",
      page: "126",
      locatorSummary: "Table 2 lists the seven SI base units including the kelvin (K) for thermodynamic temperature.",
    },
    {
      key: "loc-bipm-kelvin-celsius",
      sourceVersionKey: "sv-bipm-si-9th-edition-4.01",
      section: "2.3.1, subsection \"The kelvin\"",
      page: "129",
      locatorSummary:
        "States the kelvin is the SI unit of thermodynamic temperature, and defines the degree Celsius as equal in magnitude to the kelvin (t/deg C = T/K - 273.15) -- Celsius is not a replacement SI base unit.",
    },
    {
      key: "loc-bipm-derived-units",
      sourceVersionKey: "sv-bipm-si-9th-edition-4.01",
      section: "2.3.4 Derived units",
      tableReference: "Table 4 (22 SI units with special names and symbols)",
      page: "133-134",
      locatorSummary:
        "Table 4 lists hertz, joule, watt, coulomb, volt, farad, ohm, weber, tesla and henry among the 22 coherent derived units with special names, each with its symbol and base-unit expression.",
    },
    {
      key: "loc-bipm-derived-units-examples",
      sourceVersionKey: "sv-bipm-si-9th-edition-4.01",
      section: "2.3.4 Derived units",
      tableReference: "Table 5 (examples of coherent derived units expressed in base units)",
      page: "135",
      locatorSummary: "Table 5 gives area (m^2), volume (m^3), density (kg/m^3) and velocity (m/s) in terms of base units.",
    },
    {
      key: "loc-bipm-si-prefixes",
      sourceVersionKey: "sv-bipm-si-9th-edition-4.01",
      section: "3 Decimal multiples and sub-multiples of SI units",
      tableReference: "Table 7 (SI prefixes)",
      page: "138",
      locatorSummary: "Table 7 lists every SI prefix (e.g. kilo, milli, micro) with its factor and symbol, and states prefix-symbol notation rules.",
    },
    {
      key: "loc-bipm-cc-by-licence",
      sourceVersionKey: "sv-bipm-si-9th-edition-4.01",
      section: "Copyright statement",
      page: "2",
      locatorSummary: "States the SI Brochure is distributed under the Creative Commons Attribution 4.0 International License.",
    },
    {
      key: "loc-nist-sp811-ch4",
      sourceVersionKey: "sv-nist-sp811-current",
      chapter: "Chapter 4: The Two Classes of SI Units and the SI Prefixes",
      section: "4.1 base units, 4.2/4.2.1 derived units, 4.3 prefixes (Table 5)",
      webAnchor: "https://www.nist.gov/pml/special-publication-811/nist-guide-si-chapter-4-two-classes-si-units-and-si-prefixes",
      locatorSummary:
        "Section 4.2.1 names electrical derived units (volt, ohm, ampere, coulomb, farad, siemens, weber, tesla); Section 4.3/Table 5 gives the SI prefix table.",
    },
    {
      key: "loc-nist-sp811-b9",
      sourceVersionKey: "sv-nist-sp811-current",
      section: "Appendix B.9, \"Electricity and Magnetism\" heading",
      webAnchor: "https://www.nist.gov/pml/special-publication-811/nist-guide-si-appendix-b-conversion-factors/nist-guide-si-appendix-b9",
      locatorSummary: "Gives an explicit conversion entry to \"ohm meter (ohm times m)\" under the Electricity and Magnetism heading.",
    },
    {
      key: "loc-nist-sp811-b8",
      sourceVersionKey: "sv-nist-sp811-current",
      section: "Appendix B.8, alphabetical \"A\" entries",
      webAnchor: "https://www.nist.gov/pml/special-publication-811/nist-guide-si-appendix-b-conversion-factors/nist-guide-si-appendix-b8",
      locatorSummary: "Row \"acceleration of free fall, standard (gn)\" gives 9.806 65 m/s^2 (rounds to the required ~9.81 m/s^2).",
    },
    {
      key: "loc-prealg-percent",
      sourceVersionKey: "sv-openstax-prealgebra-2e",
      section: "6.1 Understand Percent",
      locatorSummary: "Defines percent as a ratio whose denominator is 100 and covers percent-to-decimal/fraction conversion.",
    },
    {
      key: "loc-prealg-sci-notation",
      sourceVersionKey: "sv-openstax-prealgebra-2e",
      section: "10.5 Integer Exponents and Scientific Notation",
      locatorSummary: "Covers negative exponents, the product/power/quotient properties of integer exponents, and scientific notation.",
    },
    {
      key: "loc-prealg-pythagoras",
      sourceVersionKey: "sv-openstax-prealgebra-2e",
      section: "9.3 Use Properties of Angles, Triangles, and the Pythagorean Theorem",
      locatorSummary: "States a^2+b^2=c^2 for a right triangle with worked application examples.",
    },
    {
      key: "loc-interalg-formula",
      sourceVersionKey: "sv-openstax-interalg-2e",
      section: "2.3 Solve a Formula for a Specific Variable",
      locatorSummary: "Covers isolating a named variable in a formula, including square/root forms (e.g. a^2+b^2=c^2).",
    },
    {
      key: "loc-precalc-trig",
      sourceVersionKey: "sv-openstax-precalc-2e",
      section: "5.4 Right Triangle Trigonometry",
      locatorSummary: "Defines sine, cosine and tangent as SOH-CAH-TOA ratios for a right triangle, with worked problems.",
    },
    {
      key: "loc-stats-center",
      sourceVersionKey: "sv-openstax-stats-2e",
      section: "2.5 Measures of the Center of the Data",
      locatorSummary:
        "Defines mean, median and mode explicitly. Does NOT define statistical range anywhere in this section -- confirmed absent, not merely unchecked.",
    },
    {
      key: "loc-up1-mass-weight",
      sourceVersionKey: "sv-openstax-up1-current",
      section: "5.4 Mass and Weight",
      locatorSummary:
        "States w=mg, that mass is location-invariant while weight depends on gravitational field strength, with a worked 5.0 kg Earth (49 N) vs Moon (8.4 N) example.",
    },
    {
      key: "loc-up2-electric-charge",
      sourceVersionKey: "sv-openstax-up2-current",
      section: "5.1 Electric Charge, subsection \"The Source of Charges: The Structure of the Atom\"",
      locatorSummary:
        "States protons are positive, electrons negative, and the neutron is explicitly \"an electrically neutral twin of the proton...with no electric charge\"; neutral atoms have equal positive/negative charge.",
    },
    {
      key: "loc-up2-conductors-insulators",
      sourceVersionKey: "sv-openstax-up2-current",
      section: "5.2 Conductors, Insulators, and Charging by Induction",
      locatorSummary:
        "Distinguishes conductors (mobile \"conduction electrons\", copper example) from insulators (\"lack conduction electrons\", amber/glass/plastic examples).",
    },
    {
      key: "loc-up2-electrical-current",
      sourceVersionKey: "sv-openstax-up2-current",
      section: "9.1 Electrical Current, subsection \"Current in a Circuit\"",
      locatorSummary:
        "Defines current I=dQ/dt, conventional current as the direction positive charge flows, notes electrons carry current in metals opposite to conventional current, and requires a complete circuit path.",
    },
    {
      key: "loc-up2-resistivity",
      sourceVersionKey: "sv-openstax-up2-current",
      section: "9.3 Resistivity and Resistance",
      locatorSummary:
        "Distinguishes resistance from resistivity (symbol rho, unit ohm-metre), gives R=rho*L/A (equation 9.9), and states resistance increases with length, decreases with area.",
    },
    {
      key: "loc-up2-ohm",
      sourceVersionKey: "sv-openstax-up2-current",
      section: "9.4 Ohm's Law",
      locatorSummary: "Gives V=IR (equation 9.11) and explicitly distinguishes ohmic from non-ohmic (e.g. diode) behaviour.",
    },
    {
      key: "loc-up2-electrical-power",
      sourceVersionKey: "sv-openstax-up2-current",
      section: "9.5 Electrical Energy and Power",
      locatorSummary: "Gives P=IV (9.12) and its P=I^2R/P=V^2/R derived forms (9.13); states current flow converts electrical energy to thermal energy.",
    },
    {
      key: "loc-up2-series-parallel",
      sourceVersionKey: "sv-openstax-up2-current",
      section: "10.2 Resistors in Series and Parallel",
      locatorSummary:
        "Gives series Rs=sum(R) with common current and divided voltage, and parallel 1/Rp=sum(1/R) with common voltage and divided current.",
    },
    {
      key: "loc-up2-kirchhoff",
      sourceVersionKey: "sv-openstax-up2-current",
      section: "10.3 Kirchhoff's Rules",
      locatorSummary: "States Kirchhoff's first rule (junction current conservation) and second rule (loop voltage conservation, sum V=0).",
    },
    {
      key: "loc-up2-measuring-instruments",
      sourceVersionKey: "sv-openstax-up2-current",
      section: "10.4 Electrical Measuring Instruments",
      locatorSummary:
        "States ammeters connect in series with very low resistance, voltmeters connect in parallel with very high resistance, and an ohmmeter must never be used on a live/energised circuit.",
    },
    {
      key: "loc-up2-capacitors",
      sourceVersionKey: "sv-openstax-up2-current",
      section: "8.1 Capacitors and Capacitance",
      locatorSummary: "States a capacitor stores electrical charge and energy; capacitance C is defined (equation 8.1) with SI unit the farad.",
    },
    {
      key: "loc-up2-capacitor-energy",
      sourceVersionKey: "sv-openstax-up2-current",
      section: "8.3 Energy Stored in a Capacitor",
      locatorSummary: "States a charged capacitor stores energy in the electrical field between its plates.",
    },
    {
      key: "loc-up2-magnetic-fields",
      sourceVersionKey: "sv-openstax-up2-current",
      section: "11.2 Magnetic Fields and Lines",
      locatorSummary:
        "Describes north/south poles, attraction/repulsion, field-line conventions (external field lines run N to S, closed loops), and field-line density as field strength.",
    },
    {
      key: "loc-up2-current-conductor-force",
      sourceVersionKey: "sv-openstax-up2-current",
      section: "11.4 Magnetic Force on a Current-Carrying Conductor",
      figureReference: "Figure 11.11 (dot/cross convention)",
      locatorSummary: "Gives F=BIl (equation 11.13) for the perpendicular case, right-hand-rule directional conventions, and the dot/cross page notation.",
    },
    {
      key: "loc-up2-straight-wire",
      sourceVersionKey: "sv-openstax-up2-current",
      section: "12.2 Magnetic Field due to a Thin Straight Wire",
      locatorSummary: "Describes the circular field around a straight current-carrying wire and the right-hand-rule direction convention.",
    },
    {
      key: "loc-up2-solenoid",
      sourceVersionKey: "sv-openstax-up2-current",
      section: "12.6 Solenoids and Toroids, subsection \"Solenoids\"",
      locatorSummary:
        "States the solenoid field is uniform near the centre and proportional to current, with polarity from the right-hand rule; electromagnet use is illustrated by example (e.g. MRI) rather than the literal word \"electromagnet\".",
    },
    {
      key: "loc-up2-faraday-flux",
      sourceVersionKey: "sv-openstax-up2-current",
      section: "13.1 Faraday's Law",
      locatorSummary:
        "Defines magnetic flux (weber, equation 13.1) and gives Phi=BA for the uniform perpendicular case in a worked example; states current flows only while flux is changing (equation 13.2).",
    },
    {
      key: "loc-up2-motional-emf",
      sourceVersionKey: "sv-openstax-up2-current",
      section: "13.3 Motional Emf",
      locatorSummary: "Derives e=Blv (equation 13.5) for a conductor moving perpendicular to a field, and I=Blv/R.",
    },
    {
      key: "loc-up2-generators",
      sourceVersionKey: "sv-openstax-up2-current",
      section: "13.6 Electric Generators and Back Emf",
      figureReference: "Figures 13.29-13.30",
      locatorSummary:
        "Derives generator EMF e=NBA*omega*sin(omega*t) from motional EMF for a rotating coil, and shows rings/brushes (Fig 13.29) and split-ring commutators (Fig 13.30).",
    },
    {
      key: "loc-up2-simple-ac",
      sourceVersionKey: "sv-openstax-up2-current",
      section: "15.2 Simple AC Circuits",
      locatorSummary:
        "Gives v(t)=V0*sin(omega*t), Irms=I0/sqrt(2) and Vrms=V0/sqrt(2), states the full-cycle averaged current/voltage is zero, and defines inductive/capacitive reactance in ohms.",
    },
    {
      key: "loc-up2-rlc-impedance",
      sourceVersionKey: "sv-openstax-up2-current",
      section: "15.3 RLC Series Circuits with AC",
      locatorSummary:
        "Introduces impedance Z as \"the ac analog to resistance\" with unit ohm, distinct from resistance/reactance (Z=sqrt(R^2+(XL-XC)^2)). Deeper phase-angle/resonance content on this page is explicitly out of the approved Unit 202 AC2.2 depth.",
    },
    {
      key: "loc-up2-ac-power",
      sourceVersionKey: "sv-openstax-up2-current",
      section: "15.4 Power in an AC Circuit",
      locatorSummary: "Gives Pave=(1/2)*I0*V0*cos(phi) and names cos(phi) \"the power factor\", ranging 0 (pure reactance) to 1 (pure resistance).",
    },
    {
      key: "loc-physics-work-power",
      sourceVersionKey: "sv-openstax-physics-2024",
      section: "9.1 Work, Power, and the Work-Energy Theorem",
      locatorSummary: "Defines work as force causing displacement, the work-energy theorem, power P=W/t, and kinetic/potential energy concepts.",
    },
    {
      key: "loc-physics-simple-machines",
      sourceVersionKey: "sv-openstax-physics-2024",
      section: "9.3 Simple Machines",
      locatorSummary:
        "Gives mechanical-advantage/efficiency formulas and explicitly states \"a machine cannot increase the amount of energy you put into it\" -- Wi=Wo for an ideal machine.",
    },
    {
      key: "loc-chem-electrolysis",
      sourceVersionKey: "sv-openstax-chemistry-2e",
      section: "17.7 Electrolysis",
      locatorSummary:
        "Describes electrolytic cells and electrolysis (e.g. molten NaCl decomposition) and includes a dedicated \"Electroplating\" subsection under Chemistry in Everyday Life.",
    },
    {
      key: "loc-libretexts-lever",
      sourceVersionKey: "sv-libretexts-lever-current",
      section: "25.04 Lever",
      locatorSummary:
        "Defines Class I/II/III levers by fulcrum/effort/resistance arrangement and gives mechanical advantage M.A.=rE/rR from FE*rE=FR*rR.",
    },
    {
      key: "loc-libretexts-gear-systems",
      sourceVersionKey: "sv-libretexts-gear-systems-current",
      section: "11.2, subsection \"Position, Velocity, and Acceleration in Gear Systems\"",
      locatorSummary: "Gives gear ratio = input speed/output speed = tooth-count ratio, and states meshed gears rotate in opposite directions.",
    },
    {
      key: "loc-libretexts-mechatronics",
      sourceVersionKey: "sv-libretexts-mechatronics-current",
      section: "5.02, subsection \"Gearbox effect to output torque and speed profiles\"",
      locatorSummary:
        "States that for an ideal (lossless) gearbox, input power equals output power (P=tau*omega=tau_o*omega_o) even as torque/speed trade off.",
    },
    {
      key: "loc-schneider-ion7400-energy",
      sourceVersionKey: "sv-schneider-ion7400-current",
      section: "\"Energy\" (13 Measurements)",
      locatorSummary: "States the meter provides bi-directional energy metering and lists kWh/kVARh/kVAh delivered/received/net/total.",
    },
    {
      key: "loc-ecampus-simple-ac-generator",
      sourceVersionKey: "sv-ecampus-electrotechnology-current",
      chapter: "Part 1.2, \"AC Voltage and Current\"",
      section: "\"Simple AC Generator\" section",
      locatorSummary:
        "States a single loop rotating in a field induces AC via slip rings and carbon brushes, with instantaneous emf proportional to sin(theta), and states \"a simple generator has...2 poles or 1 pole pair\".",
    },
    {
      key: "loc-ecampus-alternator-relationships",
      sourceVersionKey: "sv-ecampus-electrotechnology-current",
      chapter: "Part 2 -- Alternator Relationships",
      section: "\"Generator Poles\"",
      locatorSummary:
        "Gives f=pN/60 with p explicitly defined as \"number of pairs of poles\" and N as rotor speed in rpm; Worked Example 1 (60 Hz, 300 rpm) treats the machine as having 12 pole PAIRS, confirming p is pairs, not total poles.",
    },
    {
      key: "loc-abb-pole-pair-annex-a",
      sourceVersionKey: "sv-abb-async-motors-current",
      section: "Annex A: Theory of three-phase asynchronous motors",
      page: "28",
      locatorSummary:
        "Gives n0=60f/p with p explicitly defined as \"the number of pole pairs\", and a worked example (8-pole motor = 4 pole pairs, 50 Hz -> 750 rpm) plus a synchronous-speed table.",
    },
    {
      key: "loc-iastate-waveform-magnitude",
      sourceVersionKey: "sv-iastate-ac-waveforms-current",
      section: "\"Ways of Expressing the Magnitude of an AC Waveform\"",
      figureReference: "Figures 4.8-4.11",
      locatorSummary:
        "Defines peak/crest value and peak-to-peak value; Figure 4.11 caption states \"The average value of a sine wave is zero\" for the full cycle.",
    },
    {
      key: "loc-iastate-rms",
      sourceVersionKey: "sv-iastate-ac-waveforms-current",
      section: "\"How is Root Mean Square (RMS) Relevant to AC?\"",
      figureReference: "Figures 4.12-4.15",
      locatorSummary:
        "States sinusoidal RMS is 0.707 of peak, and gives the form factor as the ratio RMS/average = 0.707/0.636 for a sinusoid -- the source's own stated rectified-average ratio is 0.636, not the dossier's rounded 0.637 (both round the exact value 2/pi ~= 0.63662; the discrepancy is a rounding-convention difference, recorded rather than silently reconciled).",
    },
    {
      key: "loc-te-resistor-4band",
      sourceVersionKey: "sv-te-resistor-color-current",
      section: "\"IEC 60062 Resistance Value Shorthand\" and \"Resistor Color Codes\" > \"4-Band Resistors\"",
      locatorSummary:
        "Names IEC 60062 explicitly and gives a worked 4-band example (brown/green/red/gold = 1500 ohm +/-5%, +/-75 ohm tolerance).",
    },
    {
      key: "loc-rohm-diode-basics",
      sourceVersionKey: "sv-rohm-diode-basics-current",
      section: "Opening definition and \"Structure and Operation of a Diode\"",
      locatorSummary:
        "States a diode is a two-terminal semiconductor allowing current in essentially one direction, names anode/cathode, forward/reverse bias, and rectification as a purpose.",
    },
    {
      key: "loc-rohm-rectifier",
      sourceVersionKey: "sv-rohm-rectifier-current",
      section: "\"Rectifier Diodes\"",
      locatorSummary:
        "States rectification converts AC to DC and that a rectifier diode conducts on the positive half cycle and blocks on the negative half cycle.",
    },
    {
      key: "loc-rohm-zener",
      sourceVersionKey: "sv-rohm-zener-current",
      section: "\"The Working Principle of Zener Diodes\", \"Reverse Bias Clamping Operation\", \"Major Applications of Zener Diodes\"",
      locatorSummary:
        "Describes reverse-breakdown conduction at a roughly constant clamped voltage, and voltage-reference/regulation applications.",
    },
    {
      key: "loc-rohm-led-forward",
      sourceVersionKey: "sv-rohm-led-forward-current",
      section: "\"Forward Voltage\"",
      locatorSummary:
        "Explains forward voltage (VF) arises from positive-direction current through the LED; anode/cathode terms appear only incidentally, not as a dedicated polarity explanation.",
    },
    {
      key: "loc-rohm-led-emission",
      sourceVersionKey: "sv-rohm-led-emission-current",
      section: "\"Principle of Diode Light Emission\"",
      locatorSummary:
        "States laser diodes and LEDs \"are both light sources that use semiconductor elements, and the mechanisms by which they generate light are similar\", then explains forward-biased p-n junction hole/electron recombination emits light as the shared mechanism, before laser-specific (optical-cavity/stimulated-emission) content begins. This page is primarily about laser diodes; only this shared-mechanism framing is cited, never laser-cavity content.",
    },
    {
      key: "loc-hamamatsu-photodiode",
      sourceVersionKey: "sv-hamamatsu-photodiode-current",
      section: "\"Operating Principle\"",
      locatorSummary: "Describes photon absorption exciting electrons and generating a photocurrent proportional to incident photons.",
    },
    {
      key: "loc-advphotonix-ldr",
      sourceVersionKey: "sv-advphotonix-ldr-current",
      section: "Page header / product description",
      locatorSummary: "States the LDR senses visible light (400-700 nm) and that its resistance decreases as light increases.",
    },
    {
      key: "loc-murata-ntc",
      sourceVersionKey: "sv-murata-ntc-current",
      section: "\"What are NTC Thermistors?\", \"Operating principle\", \"Application\"",
      locatorSummary: "States NTC thermistor resistance decreases as temperature rises, with a temperature-sensing application example.",
    },
    {
      key: "loc-murata-ptc",
      sourceVersionKey: "sv-murata-ptc-current",
      section: "Body text on resistance-temperature curve",
      figureReference: "Figures 1-2",
      locatorSummary:
        "Describes a nonlinear curve: resistance roughly constant/slightly falling up to the Curie point, then rising sharply (logarithmically) above it, falling again beyond a further point -- not a simple linear increase.",
    },
    {
      key: "loc-st-diac-db3",
      sourceVersionKey: "sv-st-diac-db3-current",
      section: "\"Description\" and \"Key features\"",
      locatorSummary:
        "States the DB3 functions as a trigger diode used with TRIACs for gate control, with a symmetric breakover-voltage spec (32/40 V, symmetry 3 V) implying bidirectional behaviour; the word \"bidirectional\" itself is not used on this page.",
    },
    {
      key: "loc-rohm-bjt",
      sourceVersionKey: "sv-rohm-bjt-current",
      section: "Body text and NPN/PNP symbol figure",
      locatorSummary: "States a transistor amplifies/switches, explains emitter/collector current controlled by base current, and contrasts NPN vs PNP with a symbol figure.",
    },
    {
      key: "loc-rohm-npn-switch",
      sourceVersionKey: "sv-rohm-npn-switch-current",
      section: "Worked relay-driving example",
      locatorSummary:
        "Demonstrates an NPN transistor switching a 5V/70mA relay; all examples (LED, relay, motor, solenoid) are generic switching demonstrations with no alarm/security-specific content.",
    },
    {
      key: "loc-st-an4607-1.1",
      sourceVersionKey: "sv-st-an4607-scr-rev2",
      section: "1.1 Silicon structure and equivalent diagram",
      page: "2",
      locatorSummary:
        "States a thyristor can only be triggered by a positive gate current, and describes the regenerative latching mechanism (beta_NPN*beta_PNP reaching 1) that keeps it on after the gate current is removed, naming the \"latching current (IL)\".",
    },
    {
      key: "loc-st-an4607-1.2",
      sourceVersionKey: "sv-st-an4607-scr-rev2",
      section: "1.2 Static electrical characteristics and basic operating modes",
      page: "3",
      locatorSummary:
        "States a thyristor only conducts current from anode to cathode, names the \"holding current (IH)\", and states the device turns off once its current falls below IH / reaches zero.",
    },
    {
      key: "loc-omron-e5c2-specs",
      sourceVersionKey: "sv-omron-e5c2-current",
      section: "Specifications table, rows \"Input type\" and \"Control output\"",
      locatorSummary:
        "Lists thermistor (and other) temperature-sensor input types and a relay output (SPDT, 3A/250VAC), together showing a sensor-to-relay control chain.",
    },
    {
      key: "loc-abb-drives-fig1.1",
      sourceVersionKey: "sv-abb-drives-tech-guide7-revd",
      section: "\"Drive system\"",
      figureReference: "Figure 1.1",
      page: "5",
      locatorSummary:
        "Figure 1.1 and its caption label a variable speed drive's block chain: 1) rectifier, 2) DC-link, 3) inverter unit, 4) electric supply, driving an AC motor/load -- the inverter is the final stage converting DC-link power to controlled AC output.",
    },
    {
      key: "loc-ti-wireless-env-sensor",
      sourceVersionKey: "sv-ti-wireless-env-sensor-current",
      section: "Page body, \"Building automation > HVAC system\" category",
      locatorSummary: "Describes wireless MCU-based monitoring/transmission of climate data and integration with HVAC/building-management systems.",
    },
    {
      key: "loc-ti-tida-01067",
      sourceVersionKey: "sv-ti-tida-01067-current",
      section: "Page body, sensor list and wireless-transmission description",
      locatorSummary:
        "Describes CAV-to-VAV HVAC damper control sensing temperature/humidity/pressure, with data transmitted wirelessly to a smart thermostat or gateway.",
    },
    {
      key: "loc-openreach-digital-phone",
      sourceVersionKey: "sv-openreach-digital-phone-current",
      section: "Page body",
      locatorSummary:
        "States the analogue phone network is being retired by 31 January 2027 as part of an active digital/IP-voice upgrade programme. Contains no technical description of a UK master telephone socket's internal components -- confirmed absent, not merely unchecked.",
    },
    {
      key: "loc-nagoya-fleming-left",
      sourceVersionKey: "sv-nagoya-ocw-2024",
      section: "Lesson 12, subsection EM12_3 \"Fleming's Left-Hand Rule\"",
      locatorSummary:
        "Course-index page lists Lesson 12 subsection EM12_3 as Fleming's Left-Hand Rule; the instructional content itself is off-site (linked video), so only the index page's own listing is cited as the locator.",
    },
    {
      key: "loc-nagoya-fleming-right",
      sourceVersionKey: "sv-nagoya-ocw-2024",
      section: "Lesson 13, subsection EM13_4-5 \"Fleming's Right-Hand Rule\"",
      locatorSummary:
        "Course-index page lists Lesson 13 subsection EM13_4-5 as Fleming's Right-Hand Rule; the instructional content itself is off-site (linked video), so only the index page's own listing is cited as the locator.",
    },
  ],

  // =====================================================================
  // APPROVED SOURCES -- one entry per exactly one of the dossier's 67
  // approved source candidates (dossierSourceId copied verbatim from the
  // dossier's own `SRC-...` identifiers). 63 VERIFIED; 4 RETRIEVAL_FAILED
  // after a retry via an alternate access route for the SAME approved
  // URL (never a replacement source) -- see the module header.
  // =====================================================================
  approvedSources: [
    { dossierSourceId: "SRC-BIPM-SI-9E-V4.01", sourceKey: SRC_BIPM, approvedRole: "PRIMARY SI factual authority", status: "VERIFIED" },
    { dossierSourceId: "SRC-NIST-SP811-CH4", sourceKey: SRC_NIST_SP811, approvedRole: "SECONDARY / practical SI factual authority", status: "VERIFIED" },
    { dossierSourceId: "SRC-NIST-SP811-B9", sourceKey: SRC_NIST_SP811, approvedRole: "SECONDARY electrical/magnetic SI factual authority", status: "VERIFIED" },
    { dossierSourceId: "SRC-NIST-SP811-B8", sourceKey: SRC_NIST_SP811, approvedRole: "SECONDARY physical-quantity/conversion authority", status: "VERIFIED" },
    { dossierSourceId: "SRC-OPENSTAX-PREALG-PERCENT", sourceKey: SRC_OPENSTAX_PREALGEBRA, approvedRole: "factual/procedural authority", status: "VERIFIED" },
    { dossierSourceId: "SRC-OPENSTAX-INTERALG-FORMULA", sourceKey: SRC_OPENSTAX_INTERALG, approvedRole: "factual/procedural authority", status: "VERIFIED" },
    { dossierSourceId: "SRC-OPENSTAX-PREALG-SCI-NOTATION", sourceKey: SRC_OPENSTAX_PREALGEBRA, approvedRole: "factual/procedural authority", status: "VERIFIED" },
    { dossierSourceId: "SRC-OPENSTAX-PREALG-PYTHAGORAS", sourceKey: SRC_OPENSTAX_PREALGEBRA, approvedRole: "factual/procedural authority", status: "VERIFIED" },
    { dossierSourceId: "SRC-OPENSTAX-PRECALC-TRIG", sourceKey: SRC_OPENSTAX_PRECALC, approvedRole: "factual/procedural authority", status: "VERIFIED" },
    { dossierSourceId: "SRC-OPENSTAX-STATS-CENTER", sourceKey: SRC_OPENSTAX_STATS, approvedRole: "factual/procedural authority", status: "VERIFIED" },
    { dossierSourceId: "SRC-OPENSTAX-UP1-MASS-WEIGHT", sourceKey: SRC_OPENSTAX_UP1, approvedRole: "PRIMARY mechanics factual authority for AC3.1", status: "VERIFIED" },
    { dossierSourceId: "SRC-OPENSTAX-PHYSICS-WORK-POWER", sourceKey: SRC_OPENSTAX_PHYSICS, approvedRole: "PRIMARY mechanics factual/procedural authority", status: "VERIFIED" },
    { dossierSourceId: "SRC-OPENSTAX-PHYSICS-SIMPLE-MACHINES", sourceKey: SRC_OPENSTAX_PHYSICS, approvedRole: "PRIMARY simple-machines factual authority", status: "VERIFIED" },
    { dossierSourceId: "SRC-LIBRETEXTS-LEVER-CLASSES", sourceKey: SRC_LIBRETEXTS_LEVER, approvedRole: "factual authority for lever classification/operation", status: "VERIFIED" },
    { dossierSourceId: "SRC-LIBRETEXTS-GEAR-SYSTEMS", sourceKey: SRC_LIBRETEXTS_GEAR_SYSTEMS, approvedRole: "factual/procedural authority", status: "VERIFIED" },
    { dossierSourceId: "SRC-LIBRETEXTS-GEAR-POWER-TORQUE", sourceKey: SRC_LIBRETEXTS_MECHATRONICS, approvedRole: "secondary factual authority for ideal gearbox torque/speed/power relationships", status: "VERIFIED" },
    { dossierSourceId: "SRC-OPENSTAX-UP2-ELECTRIC-CHARGE", sourceKey: SRC_OPENSTAX_UP2, approvedRole: "factual authority", status: "VERIFIED" },
    { dossierSourceId: "SRC-OPENSTAX-UP2-ELECTRICAL-CURRENT", sourceKey: SRC_OPENSTAX_UP2, approvedRole: "PRIMARY electrical-current factual authority", status: "VERIFIED" },
    { dossierSourceId: "SRC-OPENSTAX-UP2-CONDUCTORS-INSULATORS", sourceKey: SRC_OPENSTAX_UP2, approvedRole: "PRIMARY conductor/insulator factual authority", status: "VERIFIED" },
    { dossierSourceId: "SRC-OPENSTAX-UP2-RESISTIVITY", sourceKey: SRC_OPENSTAX_UP2, approvedRole: "PRIMARY resistance/resistivity authority", status: "VERIFIED" },
    { dossierSourceId: "SRC-OPENSTAX-UP2-OHM", sourceKey: SRC_OPENSTAX_UP2, approvedRole: "PRIMARY factual/procedural authority", status: "VERIFIED" },
    { dossierSourceId: "SRC-OPENSTAX-UP2-ELECTRICAL-POWER", sourceKey: SRC_OPENSTAX_UP2, approvedRole: "PRIMARY electrical-power/thermal factual authority", status: "VERIFIED" },
    { dossierSourceId: "SRC-OPENSTAX-UP2-SERIES-PARALLEL", sourceKey: SRC_OPENSTAX_UP2, approvedRole: "PRIMARY DC circuit factual/procedural authority", status: "VERIFIED" },
    { dossierSourceId: "SRC-OPENSTAX-UP2-KIRCHHOFF", sourceKey: SRC_OPENSTAX_UP2, approvedRole: "secondary factual/procedural authority", status: "VERIFIED" },
    { dossierSourceId: "SRC-OPENSTAX-UP2-MEASURING-INSTRUMENTS", sourceKey: SRC_OPENSTAX_UP2, approvedRole: "PRIMARY factual authority", status: "VERIFIED" },
    {
      dossierSourceId: "SRC-YOKOGAWA-POWER-MEASUREMENT",
      sourceKey: SRC_YOKOGAWA,
      approvedRole: "manufacturer factual/application authority",
      status: "RETRIEVAL_FAILED",
      retrievalNote:
        "Site is protected by an AWS WAF JavaScript challenge (response body is a challenge.js page requiring JS execution) -- not retrievable by direct HTTP fetch. A Wayback Machine snapshot is confirmed to exist but web.archive.org itself returned \"Temporarily Offline\" on every attempt (14+) across two retrieval passes.",
    },
    { dossierSourceId: "SRC-SCHNEIDER-ION7400-ENERGY", sourceKey: SRC_SCHNEIDER_ION7400, approvedRole: "manufacturer application authority", status: "VERIFIED" },
    { dossierSourceId: "SRC-OPENSTAX-CHEM-ELECTROLYSIS", sourceKey: SRC_OPENSTAX_CHEMISTRY, approvedRole: "PRIMARY chemistry factual authority", status: "VERIFIED" },
    { dossierSourceId: "SRC-OPENSTAX-UP2-SIMPLE-AC", sourceKey: SRC_OPENSTAX_UP2, approvedRole: "PRIMARY AC quantity factual authority", status: "VERIFIED" },
    { dossierSourceId: "SRC-OPENSTAX-UP2-RLC-IMPEDANCE", sourceKey: SRC_OPENSTAX_UP2, approvedRole: "factual authority, tightly clipped", status: "VERIFIED" },
    { dossierSourceId: "SRC-OPENSTAX-UP2-AC-POWER", sourceKey: SRC_OPENSTAX_UP2, approvedRole: "factual authority, tightly clipped", status: "VERIFIED" },
    { dossierSourceId: "SRC-OPENSTAX-UP2-MAGNETIC-FIELDS", sourceKey: SRC_OPENSTAX_UP2, approvedRole: "PRIMARY magnetism factual authority", status: "VERIFIED" },
    { dossierSourceId: "SRC-OPENSTAX-UP2-CURRENT-CONDUCTOR-FORCE", sourceKey: SRC_OPENSTAX_UP2, approvedRole: "PRIMARY motor-effect factual/procedural authority", status: "VERIFIED" },
    { dossierSourceId: "SRC-OPENSTAX-UP2-STRAIGHT-WIRE", sourceKey: SRC_OPENSTAX_UP2, approvedRole: "factual/directional authority", status: "VERIFIED" },
    { dossierSourceId: "SRC-OPENSTAX-UP2-SOLENOID", sourceKey: SRC_OPENSTAX_UP2, approvedRole: "factual/directional authority", status: "VERIFIED" },
    { dossierSourceId: "SRC-OPENSTAX-UP2-FARADAY-FLUX", sourceKey: SRC_OPENSTAX_UP2, approvedRole: "PRIMARY magnetic-flux/induction authority", status: "VERIFIED" },
    { dossierSourceId: "SRC-OPENSTAX-UP2-MOTIONAL-EMF", sourceKey: SRC_OPENSTAX_UP2, approvedRole: "PRIMARY induced-EMF factual/procedural authority", status: "VERIFIED" },
    { dossierSourceId: "SRC-NAGOYA-OCW-ELECTROMAGNETICS", sourceKey: SRC_NAGOYA_OCW, approvedRole: "authoritative educational convention source", status: "VERIFIED" },
    { dossierSourceId: "SRC-OPENSTAX-UP2-GENERATORS", sourceKey: SRC_OPENSTAX_UP2, approvedRole: "PRIMARY AC-generator factual authority", status: "VERIFIED" },
    { dossierSourceId: "SRC-ECAMPUS-SIMPLE-AC-GENERATOR", sourceKey: SRC_ECAMPUS_ELECTROTECHNOLOGY, approvedRole: "secondary electrotechnology factual/pedagogical authority", status: "VERIFIED" },
    { dossierSourceId: "SRC-ECAMPUS-ALTERNATOR-RELATIONSHIPS", sourceKey: SRC_ECAMPUS_ELECTROTECHNOLOGY, approvedRole: "PRIMARY Unit-202-level alternator frequency relationship authority", status: "VERIFIED" },
    { dossierSourceId: "SRC-ABB-POLE-PAIR-CONVENTION", sourceKey: SRC_ABB_ASYNC_MOTORS, approvedRole: "independent manufacturer cross-check for pole-pair convention", status: "VERIFIED" },
    { dossierSourceId: "SRC-IASTATE-AC-WAVEFORMS", sourceKey: SRC_IASTATE_AC_WAVEFORMS, approvedRole: "applied-electrical factual authority", status: "VERIFIED" },
    { dossierSourceId: "SRC-OPENSTAX-UP2-CAPACITORS", sourceKey: SRC_OPENSTAX_UP2, approvedRole: "PRIMARY capacitor factual authority", status: "VERIFIED" },
    { dossierSourceId: "SRC-OPENSTAX-UP2-CAPACITOR-ENERGY", sourceKey: SRC_OPENSTAX_UP2, approvedRole: "secondary capacitor authority", status: "VERIFIED" },
    { dossierSourceId: "SRC-TE-RESISTOR-COLOR", sourceKey: SRC_TE_RESISTOR_COLOR, approvedRole: "manufacturer/component factual authority", status: "VERIFIED" },
    { dossierSourceId: "SRC-ROHM-DIODE-BASICS", sourceKey: SRC_ROHM_DIODE_BASICS, approvedRole: "manufacturer factual authority", status: "VERIFIED" },
    { dossierSourceId: "SRC-ROHM-RECTIFIER-DIODE", sourceKey: SRC_ROHM_RECTIFIER, approvedRole: "manufacturer factual authority", status: "VERIFIED" },
    { dossierSourceId: "SRC-ROHM-ZENER", sourceKey: SRC_ROHM_ZENER, approvedRole: "manufacturer factual authority", status: "VERIFIED" },
    { dossierSourceId: "SRC-ROHM-LED-FORWARD", sourceKey: SRC_ROHM_LED_FORWARD, approvedRole: "manufacturer factual authority", status: "VERIFIED" },
    { dossierSourceId: "SRC-ROHM-LED-EMISSION", sourceKey: SRC_ROHM_LED_EMISSION, approvedRole: "manufacturer factual authority, narrowly clipped", status: "VERIFIED" },
    { dossierSourceId: "SRC-HAMAMATSU-PHOTODIODE", sourceKey: SRC_HAMAMATSU_PHOTODIODE, approvedRole: "manufacturer factual authority", status: "VERIFIED" },
    { dossierSourceId: "SRC-ADVPHOTONIX-LDR", sourceKey: SRC_ADVPHOTONIX_LDR, approvedRole: "manufacturer factual authority", status: "VERIFIED" },
    { dossierSourceId: "SRC-MURATA-NTC", sourceKey: SRC_MURATA_NTC, approvedRole: "manufacturer factual authority", status: "VERIFIED" },
    { dossierSourceId: "SRC-MURATA-PTC", sourceKey: SRC_MURATA_PTC, approvedRole: "manufacturer factual authority", status: "VERIFIED" },
    { dossierSourceId: "SRC-ST-DIAC-DB3", sourceKey: SRC_ST_DIAC_DB3, approvedRole: "manufacturer factual authority", status: "VERIFIED" },
    {
      dossierSourceId: "SRC-ST-AN3168-DIAC-TRIAC-DIMMER",
      sourceKey: SRC_ST_AN3168,
      approvedRole: "PRIMARY manufacturer factual/application authority for DIAC/TRIAC dimmer chain",
      status: "RETRIEVAL_FAILED",
      retrievalNote:
        "Direct fetch consistently fails at the connection level (blocked, not a clean 403) from this network. No Wayback Machine snapshot exists for this exact PDF URL (confirmed via both the availability API and a CDX search, both empty). Unretrievable in this session by any available route.",
    },
    { dossierSourceId: "SRC-ROHM-BJT", sourceKey: SRC_ROHM_BJT, approvedRole: "manufacturer factual authority", status: "VERIFIED" },
    { dossierSourceId: "SRC-ROHM-NPN-SWITCH", sourceKey: SRC_ROHM_NPN_SWITCH, approvedRole: "manufacturer application authority", status: "VERIFIED" },
    { dossierSourceId: "SRC-ST-AN4607-SCR", sourceKey: SRC_ST_AN4607_SCR, approvedRole: "PRIMARY SCR/thyristor factual authority", status: "VERIFIED" },
    { dossierSourceId: "SRC-OMRON-E5C2-TEMP-CONTROLLER", sourceKey: SRC_OMRON_E5C2, approvedRole: "bounded manufacturer application evidence", status: "VERIFIED" },
    { dossierSourceId: "SRC-ABB-DRIVE-SYSTEM", sourceKey: SRC_ABB_DRIVES_TECH_GUIDE7, approvedRole: "PRIMARY manufacturer application authority for basic AC-drive block structure", status: "VERIFIED" },
    { dossierSourceId: "SRC-TI-WIRELESS-ENV-SENSOR", sourceKey: SRC_TI_WIRELESS_ENV_SENSOR, approvedRole: "bounded manufacturer application evidence", status: "VERIFIED" },
    { dossierSourceId: "SRC-TI-TIDA-01067", sourceKey: SRC_TI_TIDA_01067, approvedRole: "bounded manufacturer application evidence", status: "VERIFIED" },
    { dossierSourceId: "SRC-OPENREACH-DIGITAL-PHONE", sourceKey: SRC_OPENREACH_DIGITAL_PHONE, approvedRole: "PRIMARY current-industry authority for UK network-transition context", status: "VERIFIED" },
    {
      dossierSourceId: "SRC-OFCOM-PSTN-VOIP-2026",
      sourceKey: SRC_OFCOM_PSTN_VOIP,
      approvedRole: "PRIMARY regulator authority for current UK telephony-transition context",
      status: "RETRIEVAL_FAILED",
      retrievalNote:
        "Origin returns 403 Forbidden on every direct attempt. No Wayback Machine snapshot exists for this exact PDF URL (availability API returned an empty archived_snapshots object). The propositions this source was assigned (PSTN retirement context, 31 January 2027 date, VoIP migration) are independently already VERIFIED via SRC-OPENREACH-DIGITAL-PHONE, so no required proposition depends solely on this failed source.",
    },
    {
      dossierSourceId: "SRC-OFCOM-FUTURE-LANDLINE",
      sourceKey: SRC_OFCOM_FUTURE_LANDLINE,
      approvedRole: "current regulator/consumer context",
      status: "RETRIEVAL_FAILED",
      retrievalNote:
        "Direct origin access returns 403 Forbidden. A Wayback Machine snapshot of this exact page is confirmed to exist (CDX search found a 200-status snapshot dated October 2025), but web.archive.org itself returned \"Temporarily Offline\" on every one of 14+ attempts in this session -- worth a future retry, not treated as a permanent gap. The proposition this source was assigned (migration to digital/IP landline context) is independently already VERIFIED via SRC-OPENREACH-DIGITAL-PHONE.",
    },
  ],

  // =====================================================================
  // PROPOSITION COVERAGE -- every requirementText below is copied
  // verbatim from unit202-source-acquisition-manifest.ts's own five
  // required-knowledge arrays per cluster; the validator cross-checks
  // this mechanically. Clusters 1-10 in this block, 11-20 follow below.
  // =====================================================================
  propositionCoverage: [
    // ---- 1. foundational-mathematics-for-electrical-work ----
    // NOTE (false-green audit correction, independent fresh-review pass):
    // loc-prealg-percent's own summary is scoped to "percent as a ratio...
    // percent-to-decimal/fraction conversion" -- it does not establish the
    // four arithmetic operations on fractions/decimals or proportional
    // reasoning generally. Downgraded from an incorrect VERIFIED.
    {
      clusterKey: "foundational-mathematics-for-electrical-work",
      requirementKind: "FACTUAL_PROPOSITION",
      requirementText: "The four operations on fractions, decimals and percentages, and proportional reasoning.",
      coverageState: "CONDITIONAL_SOURCE_GAP",
      supportingSourceLocatorKeys: ["loc-prealg-percent"],
      gapReason:
        "SRC-OPENSTAX-PREALG-PERCENT (6.1 Understand Percent) is VERIFIED for percent-to-decimal/fraction conversion only. The approved dossier does not separately name a source for the four arithmetic operations on fractions/decimals or for proportional reasoning generally, and no retrieved approved source establishes them.",
    },
    // NOTE (false-green audit correction): loc-prealg-sci-notation's own
    // summary and section title ("10.5 Integer Exponents...") are scoped
    // to negative/integer exponents -- it does not cover fractional
    // indices as roots. Downgraded from an incorrect VERIFIED.
    {
      clusterKey: "foundational-mathematics-for-electrical-work",
      requirementKind: "FACTUAL_PROPOSITION",
      requirementText: "Laws of indices (multiplying/dividing powers of the same base; fractional indices as roots).",
      coverageState: "CONDITIONAL_SOURCE_GAP",
      supportingSourceLocatorKeys: ["loc-prealg-sci-notation"],
      gapReason:
        "SRC-OPENSTAX-PREALG-SCI-NOTATION (10.5) is VERIFIED for multiplying/dividing powers of the same base (the product/quotient properties of integer exponents). Fractional indices as roots are outside that section's own stated integer-exponent scope and are not established by any retrieved approved source.",
    },
    {
      clusterKey: "foundational-mathematics-for-electrical-work",
      requirementKind: "FACTUAL_PROPOSITION",
      requirementText: "Pythagoras' theorem and the sine/cosine/tangent ratios for a right triangle.",
      coverageState: "VERIFIED",
      supportingSourceLocatorKeys: ["loc-prealg-pythagoras", "loc-precalc-trig"],
    },
    {
      clusterKey: "foundational-mathematics-for-electrical-work",
      requirementKind: "FACTUAL_PROPOSITION",
      requirementText: "Definitions of range, mean, median and mode for a small dataset.",
      coverageState: "CONDITIONAL_SOURCE_GAP",
      supportingSourceLocatorKeys: ["loc-stats-center"],
      gapReason:
        "SRC-OPENSTAX-STATS-CENTER section 2.5 explicitly defines mean, median and mode but does NOT define statistical range anywhere in that section (independently confirmed absent). This is exactly the CONDITIONAL_SOURCE_GAP the dossier anticipated (GAP-UNIT202-MATH-STATISTICAL-RANGE). Note: the live corpus already cites an unapproved NIST/SEMATECH e-Handbook of Statistical Methods section that does define range -- not usable here per the dossier's explicit prohibition on substituting an unapproved source; flagged for Project Architect review as a candidate future approval.",
    },
    {
      clusterKey: "foundational-mathematics-for-electrical-work",
      requirementKind: "RELATIONSHIP_OR_MECHANISM",
      requirementText: "Formula transposition: rearranging an equation to isolate an unknown, including squared/root forms.",
      coverageState: "VERIFIED",
      supportingSourceLocatorKeys: ["loc-interalg-formula"],
    },
    {
      clusterKey: "foundational-mathematics-for-electrical-work",
      requirementKind: "PROCEDURE_OR_CALCULATION_RULE",
      requirementText: "Solving a right-triangle side/angle from Pythagoras or a trig ratio.",
      coverageState: "VERIFIED",
      supportingSourceLocatorKeys: ["loc-prealg-pythagoras", "loc-precalc-trig"],
    },
    {
      clusterKey: "foundational-mathematics-for-electrical-work",
      requirementKind: "PROCEDURE_OR_CALCULATION_RULE",
      requirementText: "Computing range/mean/median/mode from a small dataset.",
      coverageState: "CONDITIONAL_SOURCE_GAP",
      supportingSourceLocatorKeys: ["loc-stats-center"],
      gapReason: "Same gap as the range definition above: mean/median/mode computation is supported, range is not, by the approved and retrieved source.",
    },
    {
      clusterKey: "foundational-mathematics-for-electrical-work",
      requirementKind: "PROCEDURE_OR_CALCULATION_RULE",
      requirementText: "Rearranging and evaluating a formula for an unknown quantity, including a square/root form.",
      coverageState: "VERIFIED",
      supportingSourceLocatorKeys: ["loc-interalg-formula"],
    },

    // ---- 2. si-units-and-physical-quantities ----
    {
      clusterKey: "si-units-and-physical-quantities",
      requirementKind: "FACTUAL_PROPOSITION",
      requirementText:
        "The SI base/derived units for length (m), area (m²), volume (m³), mass (kg), density (kg/m³), time (s), temperature " +
        "(K) and velocity (m/s).",
      coverageState: "VERIFIED",
      supportingSourceLocatorKeys: ["loc-bipm-base-units", "loc-bipm-derived-units-examples"],
    },
    {
      clusterKey: "si-units-and-physical-quantities",
      requirementKind: "FACTUAL_PROPOSITION",
      requirementText:
        "Kelvin is the SI base unit of thermodynamic temperature; Celsius is a common practical scale related to it, not the SI " +
        "unit itself.",
      coverageState: "VERIFIED",
      supportingSourceLocatorKeys: ["loc-bipm-kelvin-celsius"],
    },
    {
      clusterKey: "si-units-and-physical-quantities",
      requirementKind: "RELATIONSHIP_OR_MECHANISM",
      requirementText: "The distinction between an SI base unit and an SI derived unit.",
      coverageState: "VERIFIED",
      supportingSourceLocatorKeys: ["loc-bipm-base-units", "loc-bipm-derived-units"],
    },
    // NOTE (false-green audit correction): both cited locators are SI-
    // prefix (decimal-multiple) references -- they support mm->m and
    // mm^2->m^2 (milli- is a decimal SI prefix) but not minutes->seconds,
    // which is a non-decimal legacy time-unit conversion neither locator
    // addresses.
    {
      clusterKey: "si-units-and-physical-quantities",
      requirementKind: "PROCEDURE_OR_CALCULATION_RULE",
      requirementText: "Practical unit conversions used elsewhere in the unit (e.g. mm→m, mm²→m², minutes→seconds).",
      coverageState: "CONDITIONAL_SOURCE_GAP",
      supportingSourceLocatorKeys: ["loc-nist-sp811-ch4", "loc-bipm-si-prefixes"],
      gapReason:
        "mm->m and mm²->m² conversions are VERIFIED via the SI decimal-prefix tables in both cited locators. minutes->seconds is a non-decimal (base-60) legacy time conversion outside SI-prefix scope and is not established by any retrieved approved source.",
    },

    // ---- 3. electrical-quantities-and-si-units ----
    {
      clusterKey: "electrical-quantities-and-si-units",
      requirementKind: "FACTUAL_PROPOSITION",
      requirementText:
        "The conventional symbol and SI unit for resistance (R, Ω), resistivity (ρ, Ω·m), power (P, W), frequency (f, Hz), " +
        "current (I, A), voltage (V, V), energy (E/W, J), impedance (Z, Ω), inductance (L, H), inductive reactance (XL, Ω), " +
        "capacitance (C, F), capacitive reactance (XC, Ω), and power factor as a dimensionless ratio.",
      coverageState: "VERIFIED",
      supportingSourceLocatorKeys: [
        "loc-bipm-derived-units",
        "loc-nist-sp811-b9",
        "loc-up2-resistivity",
        "loc-up2-ohm",
        "loc-up2-electrical-power",
        "loc-up2-electrical-current",
        "loc-up2-rlc-impedance",
        "loc-up2-simple-ac",
        "loc-up2-capacitors",
        "loc-up2-ac-power",
      ],
    },
    {
      clusterKey: "electrical-quantities-and-si-units",
      requirementKind: "RELATIONSHIP_OR_MECHANISM",
      requirementText:
        "Why resistance and resistivity, or inductance and inductive reactance, or capacitance and capacitive reactance, are " +
        "distinct quantities that happen to share a family relationship.",
      coverageState: "VERIFIED",
      supportingSourceLocatorKeys: ["loc-up2-resistivity", "loc-up2-simple-ac", "loc-up2-rlc-impedance"],
    },
    {
      clusterKey: "electrical-quantities-and-si-units",
      requirementKind: "SYMBOL_OR_CONVENTION",
      requirementText: "Standard formula-symbol conventions for each listed electrical quantity.",
      coverageState: "VERIFIED",
      supportingSourceLocatorKeys: ["loc-bipm-derived-units", "loc-up2-resistivity", "loc-up2-rlc-impedance", "loc-up2-simple-ac"],
    },

    // ---- 4. electrical-measurement-instruments ----
    {
      clusterKey: "electrical-measurement-instruments",
      requirementKind: "FACTUAL_PROPOSITION",
      requirementText: "An ammeter is connected in series and has very low internal resistance.",
      coverageState: "VERIFIED",
      supportingSourceLocatorKeys: ["loc-up2-measuring-instruments"],
    },
    {
      clusterKey: "electrical-measurement-instruments",
      requirementKind: "FACTUAL_PROPOSITION",
      requirementText: "A voltmeter is connected in parallel and has high internal resistance.",
      coverageState: "VERIFIED",
      supportingSourceLocatorKeys: ["loc-up2-measuring-instruments"],
    },
    {
      clusterKey: "electrical-measurement-instruments",
      requirementKind: "FACTUAL_PROPOSITION",
      requirementText: "An ohmmeter requires the circuit under test to be de-energised.",
      coverageState: "VERIFIED",
      supportingSourceLocatorKeys: ["loc-up2-measuring-instruments"],
    },
    {
      clusterKey: "electrical-measurement-instruments",
      requirementKind: "FACTUAL_PROPOSITION",
      requirementText: "A wattmeter measures power via combined current- and voltage-sensing paths.",
      coverageState: "SOURCE_GAP",
      supportingSourceLocatorKeys: [],
      gapReason:
        "SRC-YOKOGAWA-POWER-MEASUREMENT is the dossier's only approved wattmeter source and is RETRIEVAL_FAILED (AWS WAF JS challenge). No other approved source in this cluster covers wattmeter measurement principle.",
    },
    {
      clusterKey: "electrical-measurement-instruments",
      requirementKind: "FACTUAL_PROPOSITION",
      requirementText: "An energy meter integrates power over time (kWh).",
      coverageState: "VERIFIED",
      supportingSourceLocatorKeys: ["loc-schneider-ion7400-energy"],
    },
    {
      clusterKey: "electrical-measurement-instruments",
      requirementKind: "PROCEDURE_OR_CALCULATION_RULE",
      requirementText: "Correct connection topology for each instrument in a given circuit.",
      coverageState: "CONDITIONAL_SOURCE_GAP",
      supportingSourceLocatorKeys: ["loc-up2-measuring-instruments"],
      gapReason:
        "Ammeter/voltmeter/ohmmeter connection topology is VERIFIED; wattmeter connection topology is not established by any retrieved approved source (see the wattmeter factual-proposition gap above).",
    },
    {
      clusterKey: "electrical-measurement-instruments",
      requirementKind: "PHYSICAL_OR_COMPONENT_RECOGNITION",
      requirementText: "Recognise the correct instrument for a stated quantity, including a combined multimeter.",
      coverageState: "CONDITIONAL_SOURCE_GAP",
      supportingSourceLocatorKeys: ["loc-up2-measuring-instruments"],
      gapReason:
        "Ammeter/voltmeter/ohmmeter recognition is VERIFIED; no retrieved approved source specifically addresses a combined multimeter or wattmeter recognition.",
    },

    // ---- 5. mass-and-weight ----
    {
      clusterKey: "mass-and-weight",
      requirementKind: "FACTUAL_PROPOSITION",
      requirementText: "Mass is the amount of matter in an object (kg) and is invariant with location.",
      coverageState: "VERIFIED",
      supportingSourceLocatorKeys: ["loc-up1-mass-weight"],
    },
    {
      clusterKey: "mass-and-weight",
      requirementKind: "FACTUAL_PROPOSITION",
      requirementText: "Weight is the force due to gravity acting on a mass (N) and depends on gravitational field strength.",
      coverageState: "VERIFIED",
      supportingSourceLocatorKeys: ["loc-up1-mass-weight"],
    },
    {
      clusterKey: "mass-and-weight",
      requirementKind: "FACTUAL_PROPOSITION",
      requirementText: "Standard gravitational field strength on Earth is approximately 9.81 m/s².",
      coverageState: "VERIFIED",
      supportingSourceLocatorKeys: ["loc-nist-sp811-b8"],
    },
    {
      clusterKey: "mass-and-weight",
      requirementKind: "RELATIONSHIP_OR_MECHANISM",
      requirementText: "W = mg and its rearrangement m = W/g.",
      coverageState: "VERIFIED",
      supportingSourceLocatorKeys: ["loc-up1-mass-weight"],
    },
    {
      clusterKey: "mass-and-weight",
      requirementKind: "PROCEDURE_OR_CALCULATION_RULE",
      requirementText: "Calculating weight from mass (and vice versa) under a stated gravitational field strength.",
      coverageState: "VERIFIED",
      supportingSourceLocatorKeys: ["loc-up1-mass-weight"],
    },

    // ---- 6. simple-machines-levers-gears-pulleys ----
    {
      clusterKey: "simple-machines-levers-gears-pulleys",
      requirementKind: "FACTUAL_PROPOSITION",
      requirementText: "The three lever classes are distinguished by the relative arrangement of fulcrum, effort and load.",
      coverageState: "VERIFIED",
      supportingSourceLocatorKeys: ["loc-libretexts-lever"],
    },
    {
      clusterKey: "simple-machines-levers-gears-pulleys",
      requirementKind: "FACTUAL_PROPOSITION",
      requirementText:
        "A gear transmits rotary motion; gear ratio relates tooth count to speed ratio and direction (including the idler effect).",
      coverageState: "VERIFIED",
      supportingSourceLocatorKeys: ["loc-libretexts-gear-systems"],
    },
    {
      clusterKey: "simple-machines-levers-gears-pulleys",
      requirementKind: "FACTUAL_PROPOSITION",
      requirementText: "A pulley system's mechanical advantage relates to the number of supporting strands.",
      coverageState: "SOURCE_GAP",
      supportingSourceLocatorKeys: [],
      gapReason:
        "No approved source in this cluster (OPENSTAX-PHYSICS-SIMPLE-MACHINES, LIBRETEXTS-LEVER-CLASSES, LIBRETEXTS-GEAR-SYSTEMS, LIBRETEXTS-GEAR-POWER-TORQUE) specifically addresses pulleys or supporting-strand counting -- all four cover levers/gears only. Genuine gap the dossier did not itself flag; reported here for Project Architect review.",
    },
    {
      clusterKey: "simple-machines-levers-gears-pulleys",
      requirementKind: "FACTUAL_PROPOSITION",
      requirementText: "An ideal machine trades force for distance; it does not create power.",
      coverageState: "VERIFIED",
      supportingSourceLocatorKeys: ["loc-physics-simple-machines", "loc-libretexts-mechatronics"],
    },
    {
      clusterKey: "simple-machines-levers-gears-pulleys",
      requirementKind: "RELATIONSHIP_OR_MECHANISM",
      requirementText: "Moment/turning-effect balance: effort × effort-arm = load × load-arm.",
      coverageState: "VERIFIED",
      supportingSourceLocatorKeys: ["loc-libretexts-lever"],
    },
    {
      clusterKey: "simple-machines-levers-gears-pulleys",
      requirementKind: "PROCEDURE_OR_CALCULATION_RULE",
      requirementText: "Solving a lever balance problem for an unknown effort, load or distance.",
      coverageState: "VERIFIED",
      supportingSourceLocatorKeys: ["loc-libretexts-lever"],
    },
    {
      clusterKey: "simple-machines-levers-gears-pulleys",
      requirementKind: "PROCEDURE_OR_CALCULATION_RULE",
      requirementText: "Determining driven-gear speed/direction from tooth-count ratio.",
      coverageState: "VERIFIED",
      supportingSourceLocatorKeys: ["loc-libretexts-gear-systems"],
    },
    {
      clusterKey: "simple-machines-levers-gears-pulleys",
      requirementKind: "PROCEDURE_OR_CALCULATION_RULE",
      requirementText: "Determining pulley effort from mechanical advantage.",
      coverageState: "SOURCE_GAP",
      supportingSourceLocatorKeys: [],
      gapReason: "Same pulley gap as above -- no approved source covers pulley-specific mechanical advantage.",
    },

    // ---- 7. work-energy-power-efficiency ----
    {
      clusterKey: "work-energy-power-efficiency",
      requirementKind: "FACTUAL_PROPOSITION",
      requirementText:
        "A force is a push or pull that can cause or resist motion, deformation or equilibrium; weight is one example (force due to gravity).",
      coverageState: "CONDITIONAL_SOURCE_GAP",
      supportingSourceLocatorKeys: ["loc-up1-mass-weight"],
      gapReason:
        "Weight-as-gravitational-force is VERIFIED via SRC-OPENSTAX-UP1-MASS-WEIGHT. A generic definitional statement of 'force is a push or pull that can cause or resist motion/deformation/equilibrium' was not confirmed present in the specific approved-source sections retrieved (SRC-OPENSTAX-PHYSICS-WORK-POWER's 9.1 section discusses work/power, not a standalone force definition).",
    },
    {
      clusterKey: "work-energy-power-efficiency",
      requirementKind: "FACTUAL_PROPOSITION",
      requirementText: "Work is done when a force causes a displacement; work and energy are equivalent in this context.",
      coverageState: "VERIFIED",
      supportingSourceLocatorKeys: ["loc-physics-work-power"],
    },
    {
      clusterKey: "work-energy-power-efficiency",
      requirementKind: "FACTUAL_PROPOSITION",
      requirementText: "Kinetic energy and potential energy are distinct forms of mechanical energy at Level-2 conceptual depth.",
      coverageState: "VERIFIED",
      supportingSourceLocatorKeys: ["loc-physics-work-power"],
    },
    {
      clusterKey: "work-energy-power-efficiency",
      requirementKind: "FACTUAL_PROPOSITION",
      requirementText: "Efficiency is the ratio of useful output to total input; total input equals useful output plus losses.",
      coverageState: "VERIFIED",
      supportingSourceLocatorKeys: ["loc-physics-simple-machines"],
    },
    {
      clusterKey: "work-energy-power-efficiency",
      requirementKind: "RELATIONSHIP_OR_MECHANISM",
      requirementText: "Work/energy = force × distance.",
      coverageState: "VERIFIED",
      supportingSourceLocatorKeys: ["loc-physics-work-power"],
    },
    {
      clusterKey: "work-energy-power-efficiency",
      requirementKind: "RELATIONSHIP_OR_MECHANISM",
      requirementText: "Power = work (or energy) / time.",
      coverageState: "VERIFIED",
      supportingSourceLocatorKeys: ["loc-physics-work-power"],
    },
    {
      clusterKey: "work-energy-power-efficiency",
      requirementKind: "RELATIONSHIP_OR_MECHANISM",
      requirementText: "Efficiency (%) = (useful output / input) × 100.",
      coverageState: "VERIFIED",
      supportingSourceLocatorKeys: ["loc-physics-simple-machines"],
    },
    {
      clusterKey: "work-energy-power-efficiency",
      requirementKind: "PROCEDURE_OR_CALCULATION_RULE",
      requirementText:
        "Multi-step mechanical calculations combining mass/weight, work/energy, time and efficiency (including chained motor/pump efficiency problems).",
      coverageState: "VERIFIED",
      supportingSourceLocatorKeys: ["loc-up1-mass-weight", "loc-physics-work-power", "loc-physics-simple-machines"],
    },

    // ---- 8. electron-theory-and-conduction ----
    {
      clusterKey: "electron-theory-and-conduction",
      requirementKind: "FACTUAL_PROPOSITION",
      requirementText:
        "At a basic level, protons are positive, electrons are negative and neutrons are neutral; atoms are normally neutral with a nucleus and outer electrons.",
      coverageState: "VERIFIED",
      supportingSourceLocatorKeys: ["loc-up2-electric-charge"],
    },
    {
      clusterKey: "electron-theory-and-conduction",
      requirementKind: "FACTUAL_PROPOSITION",
      requirementText: "Metals have loosely bound/free electrons available to carry current.",
      coverageState: "VERIFIED",
      supportingSourceLocatorKeys: ["loc-up2-conductors-insulators"],
    },
    {
      clusterKey: "electron-theory-and-conduction",
      requirementKind: "FACTUAL_PROPOSITION",
      requirementText: "Current requires a closed circuit and an EMF/potential-difference driver.",
      coverageState: "VERIFIED",
      supportingSourceLocatorKeys: ["loc-up2-electrical-current"],
    },
    {
      clusterKey: "electron-theory-and-conduction",
      requirementKind: "FACTUAL_PROPOSITION",
      requirementText: "Conventional current flow (+ to −) is the opposite direction to electron flow (− to +).",
      coverageState: "VERIFIED",
      supportingSourceLocatorKeys: ["loc-up2-electrical-current"],
    },
    {
      clusterKey: "electron-theory-and-conduction",
      requirementKind: "RELATIONSHIP_OR_MECHANISM",
      requirementText: "Current as the flow of free electrons through a conductor under an applied potential difference.",
      coverageState: "VERIFIED",
      supportingSourceLocatorKeys: ["loc-up2-electrical-current", "loc-up2-conductors-insulators"],
    },

    // ---- 9. conductors-and-insulators ----
    {
      clusterKey: "conductors-and-insulators",
      requirementKind: "FACTUAL_PROPOSITION",
      requirementText:
        "A good conductor has readily available/free charge carriers; an insulator tightly binds its outer electrons and presents high resistance.",
      coverageState: "VERIFIED",
      supportingSourceLocatorKeys: ["loc-up2-conductors-insulators"],
    },
    {
      clusterKey: "conductors-and-insulators",
      requirementKind: "FACTUAL_PROPOSITION",
      requirementText: "Common conductor examples (e.g. copper, tungsten) and insulator examples (e.g. porcelain, glass, plastics).",
      coverageState: "CONDITIONAL_SOURCE_GAP",
      supportingSourceLocatorKeys: ["loc-up2-conductors-insulators"],
      gapReason:
        "Copper (conductor) and glass/plastic (insulators) are explicitly confirmed present in the retrieved section; tungsten and porcelain specifically were not found in the retrieved excerpt.",
    },

    // ---- 10. resistance-and-resistivity ----
    {
      clusterKey: "resistance-and-resistivity",
      requirementKind: "FACTUAL_PROPOSITION",
      requirementText: "Resistance (R, Ω) is distinct from resistivity (ρ, Ω·m), a material property.",
      coverageState: "VERIFIED",
      supportingSourceLocatorKeys: ["loc-up2-resistivity"],
    },
    {
      clusterKey: "resistance-and-resistivity",
      requirementKind: "FACTUAL_PROPOSITION",
      requirementText: "Resistance is directly proportional to conductor length and inversely proportional to cross-sectional area.",
      coverageState: "VERIFIED",
      supportingSourceLocatorKeys: ["loc-up2-resistivity"],
    },
    {
      clusterKey: "resistance-and-resistivity",
      requirementKind: "RELATIONSHIP_OR_MECHANISM",
      requirementText: "R = ρL/A and its rearrangements for ρ, L or A.",
      coverageState: "VERIFIED",
      supportingSourceLocatorKeys: ["loc-up2-resistivity"],
    },
    {
      clusterKey: "resistance-and-resistivity",
      requirementKind: "PROCEDURE_OR_CALCULATION_RULE",
      requirementText: "Solving R = ρL/A for any unknown, with correct area/length unit conversion (e.g. mm²→m²).",
      coverageState: "VERIFIED",
      supportingSourceLocatorKeys: ["loc-up2-resistivity", "loc-nist-sp811-ch4"],
    },
    {
      clusterKey: "resistance-and-resistivity",
      requirementKind: "PROCEDURE_OR_CALCULATION_RULE",
      requirementText: "Combining a resistivity calculation with V = IR in a cable voltage-drop context.",
      coverageState: "VERIFIED",
      supportingSourceLocatorKeys: ["loc-up2-resistivity", "loc-up2-ohm"],
    },

    // ---- 11. dc-circuit-theory-series-parallel ----
    {
      clusterKey: "dc-circuit-theory-series-parallel",
      requirementKind: "FACTUAL_PROPOSITION",
      requirementText: "Ohm's law V = IR holds for an ohmic conductor under stated/appropriate conditions.",
      coverageState: "VERIFIED",
      supportingSourceLocatorKeys: ["loc-up2-ohm"],
    },
    {
      clusterKey: "dc-circuit-theory-series-parallel",
      requirementKind: "FACTUAL_PROPOSITION",
      requirementText: "In a series circuit: current is common, voltage divides across components, and resistances add.",
      coverageState: "VERIFIED",
      supportingSourceLocatorKeys: ["loc-up2-series-parallel"],
    },
    // NOTE (false-green audit correction): loc-up2-series-parallel's own
    // summary gives 1/Rp=Sum(1/R) with common voltage/divided current; it
    // does not itself state the "below the smallest branch" property.
    // That property is a direct mathematical consequence of 1/Rp=Sum(1/R)
    // (governed algebra/inequality reasoning, SRC-OPENSTAX-INTERALG-
    // FORMULA), not separately source-printed text -- kept VERIFIED with
    // that source cited alongside, per the same treatment as B=Phi/A.
    {
      clusterKey: "dc-circuit-theory-series-parallel",
      requirementKind: "FACTUAL_PROPOSITION",
      requirementText:
        "In a parallel circuit: voltage is common across branches, current divides, and equivalent resistance is below the smallest branch resistance.",
      coverageState: "VERIFIED",
      supportingSourceLocatorKeys: ["loc-up2-series-parallel", "loc-interalg-formula"],
    },
    {
      clusterKey: "dc-circuit-theory-series-parallel",
      requirementKind: "FACTUAL_PROPOSITION",
      requirementText: "Basic Kirchhoff voltage/current conservation (KVL/KCL) at simple-circuit level.",
      coverageState: "VERIFIED",
      supportingSourceLocatorKeys: ["loc-up2-kirchhoff"],
    },
    {
      clusterKey: "dc-circuit-theory-series-parallel",
      requirementKind: "RELATIONSHIP_OR_MECHANISM",
      requirementText: "Series total resistance Rt = ΣR.",
      coverageState: "VERIFIED",
      supportingSourceLocatorKeys: ["loc-up2-series-parallel"],
    },
    // NOTE (false-green audit correction): the two-resistor product-over-
    // sum shortcut is a direct algebraic rearrangement of 1/Rt=Sum(1/R)
    // for two terms (governed transposition, not separately source-
    // printed) -- kept VERIFIED with the algebra source cited alongside.
    {
      clusterKey: "dc-circuit-theory-series-parallel",
      requirementKind: "RELATIONSHIP_OR_MECHANISM",
      requirementText: "Parallel total resistance 1/Rt = Σ(1/R), including the two-resistor product-over-sum shortcut.",
      coverageState: "VERIFIED",
      supportingSourceLocatorKeys: ["loc-up2-series-parallel", "loc-interalg-formula"],
    },
    {
      clusterKey: "dc-circuit-theory-series-parallel",
      requirementKind: "PROCEDURE_OR_CALCULATION_RULE",
      requirementText:
        "Calculating total/branch resistance, current and voltage in pure series and pure parallel DC circuits, including multi-step and unknown-component problems.",
      coverageState: "VERIFIED",
      supportingSourceLocatorKeys: ["loc-up2-series-parallel", "loc-up2-ohm"],
    },
    {
      clusterKey: "dc-circuit-theory-series-parallel",
      requirementKind: "PROCEDURE_OR_CALCULATION_RULE",
      requirementText: "Verifying simple KVL/KCL relationships in a solved circuit.",
      coverageState: "VERIFIED",
      supportingSourceLocatorKeys: ["loc-up2-kirchhoff"],
    },

    // ---- 12. dc-circuit-power ----
    {
      clusterKey: "dc-circuit-power",
      requirementKind: "FACTUAL_PROPOSITION",
      requirementText:
        "Electrical power in a DC circuit can be calculated from voltage and current, or equivalently from current/resistance or voltage/resistance alone.",
      coverageState: "VERIFIED",
      supportingSourceLocatorKeys: ["loc-up2-electrical-power"],
    },
    {
      clusterKey: "dc-circuit-power",
      requirementKind: "RELATIONSHIP_OR_MECHANISM",
      requirementText: "P = VI, and its derived forms P = I²R and P = V²/R.",
      coverageState: "VERIFIED",
      supportingSourceLocatorKeys: ["loc-up2-electrical-power"],
    },
    {
      clusterKey: "dc-circuit-power",
      requirementKind: "PROCEDURE_OR_CALCULATION_RULE",
      requirementText:
        "Calculating power for an individual component, a whole circuit, or a resistive loss, selecting and rearranging the correct P/V/I/R relationship.",
      coverageState: "VERIFIED",
      supportingSourceLocatorKeys: ["loc-up2-electrical-power", "loc-up2-ohm"],
    },
    {
      clusterKey: "dc-circuit-power",
      requirementKind: "PROCEDURE_OR_CALCULATION_RULE",
      requirementText: "Summing individual component powers to total circuit power in simple series/parallel circuits.",
      coverageState: "VERIFIED",
      supportingSourceLocatorKeys: ["loc-up2-electrical-power", "loc-up2-series-parallel"],
    },

    // ---- 13. voltage-drop ----
    {
      clusterKey: "voltage-drop",
      requirementKind: "FACTUAL_PROPOSITION",
      requirementText: "Voltage drop is the voltage developed across a resistance carrying current (Vdrop = IR).",
      coverageState: "VERIFIED",
      supportingSourceLocatorKeys: ["loc-up2-ohm"],
    },
    {
      clusterKey: "voltage-drop",
      requirementKind: "FACTUAL_PROPOSITION",
      requirementText: "In a simple circuit, the voltage available at the load equals the supply voltage minus upstream voltage drops.",
      coverageState: "VERIFIED",
      supportingSourceLocatorKeys: ["loc-up2-series-parallel"],
    },
    {
      clusterKey: "voltage-drop",
      requirementKind: "RELATIONSHIP_OR_MECHANISM",
      requirementText: "Vdrop = IR.",
      coverageState: "VERIFIED",
      supportingSourceLocatorKeys: ["loc-up2-ohm"],
    },
    {
      clusterKey: "voltage-drop",
      requirementKind: "PROCEDURE_OR_CALCULATION_RULE",
      requirementText: "Calculating voltage drop from current and cable/circuit resistance, and simple supply-minus-drop load-terminal-voltage arithmetic.",
      coverageState: "VERIFIED",
      supportingSourceLocatorKeys: ["loc-up2-ohm", "loc-up2-resistivity", "loc-up2-series-parallel"],
    },

    // ---- 14. thermal-and-chemical-effects-of-current ----
    {
      clusterKey: "thermal-and-chemical-effects-of-current",
      requirementKind: "FACTUAL_PROPOSITION",
      requirementText: "Current through a resistance converts electrical energy to heat, with greater heating at greater power/current.",
      coverageState: "VERIFIED",
      supportingSourceLocatorKeys: ["loc-up2-electrical-power"],
    },
    {
      clusterKey: "thermal-and-chemical-effects-of-current",
      requirementKind: "FACTUAL_PROPOSITION",
      requirementText: "Current through a suitable liquid can produce a chemical change (electrolysis); electroplating is a practical application.",
      coverageState: "VERIFIED",
      supportingSourceLocatorKeys: ["loc-chem-electrolysis"],
    },
    {
      clusterKey: "thermal-and-chemical-effects-of-current",
      requirementKind: "PHYSICAL_OR_COMPONENT_RECOGNITION",
      requirementText: "Fuse operation as a practical application of the thermal effect.",
      coverageState: "SOURCE_GAP",
      supportingSourceLocatorKeys: [],
      gapReason: "Neither approved source for this cluster (OPENSTAX-UP2-ELECTRICAL-POWER, OPENSTAX-CHEM-ELECTROLYSIS) discusses fuse operation.",
    },

    // ---- 15. magnetism-flux-and-flux-density ----
    {
      clusterKey: "magnetism-flux-and-flux-density",
      requirementKind: "FACTUAL_PROPOSITION",
      requirementText: "Like magnetic poles repel; unlike poles attract.",
      coverageState: "VERIFIED",
      supportingSourceLocatorKeys: ["loc-up2-magnetic-fields"],
    },
    {
      clusterKey: "magnetism-flux-and-flux-density",
      requirementKind: "FACTUAL_PROPOSITION",
      requirementText:
        "A magnetic field is the region in which a magnetic effect can be observed; field-line conventions (closed loops, external N→S direction, non-crossing lines).",
      coverageState: "VERIFIED",
      supportingSourceLocatorKeys: ["loc-up2-magnetic-fields"],
    },
    {
      clusterKey: "magnetism-flux-and-flux-density",
      requirementKind: "FACTUAL_PROPOSITION",
      requirementText:
        "Magnetic flux (Φ, weber) is distinct from flux density (B, tesla = Wb/m²), which is flux concentration per unit area.",
      coverageState: "VERIFIED",
      supportingSourceLocatorKeys: ["loc-up2-faraday-flux", "loc-bipm-derived-units"],
    },
    // NOTE (false-green audit correction, dossier section 11F):
    // loc-up2-faraday-flux's own worked example gives Phi=BA directly (the
    // uniform-perpendicular case) -- it does not itself print the
    // rearranged forms B=Phi/A or A=Phi/B. Those rearrangements are
    // governed-algebra transposition (SRC-OPENSTAX-INTERALG-FORMULA,
    // cited alongside), not text the physics source printed. The
    // underlying physics relationship (Phi=BA) is source-verified; the
    // rearrangement is not claimed as source-printed text.
    {
      clusterKey: "magnetism-flux-and-flux-density",
      requirementKind: "RELATIONSHIP_OR_MECHANISM",
      requirementText: "B = Φ/A, and its rearrangements Φ = BA and A = Φ/B.",
      coverageState: "VERIFIED",
      supportingSourceLocatorKeys: ["loc-up2-faraday-flux", "loc-interalg-formula"],
    },
    {
      clusterKey: "magnetism-flux-and-flux-density",
      requirementKind: "PROCEDURE_OR_CALCULATION_RULE",
      requirementText: "Solving B = Φ/A for any unknown, with area unit conversion where required.",
      coverageState: "VERIFIED",
      supportingSourceLocatorKeys: ["loc-up2-faraday-flux", "loc-nist-sp811-ch4"],
    },
    {
      clusterKey: "magnetism-flux-and-flux-density",
      requirementKind: "SYMBOL_OR_CONVENTION",
      requirementText: "Standard B (flux density) and Φ (flux) symbol notation.",
      coverageState: "VERIFIED",
      supportingSourceLocatorKeys: ["loc-up2-faraday-flux", "loc-bipm-derived-units"],
    },

    // ---- 16. electromagnetism-motor-effect-and-induced-emf ----
    {
      clusterKey: "electromagnetism-motor-effect-and-induced-emf",
      requirementKind: "FACTUAL_PROPOSITION",
      requirementText: "A current-carrying conductor produces a magnetic field around it.",
      coverageState: "VERIFIED",
      supportingSourceLocatorKeys: ["loc-up2-straight-wire"],
    },
    {
      clusterKey: "electromagnetism-motor-effect-and-induced-emf",
      requirementKind: "FACTUAL_PROPOSITION",
      requirementText: "A current-carrying conductor placed in a magnetic field experiences a force (the motor effect).",
      coverageState: "VERIFIED",
      supportingSourceLocatorKeys: ["loc-up2-current-conductor-force"],
    },
    {
      clusterKey: "electromagnetism-motor-effect-and-induced-emf",
      requirementKind: "FACTUAL_PROPOSITION",
      requirementText: "A conductor moving through a magnetic field has an EMF induced in it (motional EMF).",
      coverageState: "VERIFIED",
      supportingSourceLocatorKeys: ["loc-up2-motional-emf"],
    },
    {
      clusterKey: "electromagnetism-motor-effect-and-induced-emf",
      requirementKind: "RELATIONSHIP_OR_MECHANISM",
      requirementText: "Right-hand grip / Maxwell's screw rule for field direction around a straight conductor.",
      coverageState: "VERIFIED",
      supportingSourceLocatorKeys: ["loc-up2-straight-wire"],
    },
    // NOTE (false-green audit correction): both Fleming records below were
    // initially recorded VERIFIED against loc-nagoya-fleming-left/right,
    // but those locators only cite the Nagoya OCW course-INDEX page's
    // lesson titles ("Fleming's Left-Hand Rule" / "Fleming's Right-Hand
    // Rule") -- a subsection heading, not the actual finger/current/field/
    // force directional mapping, which lives in an off-site linked video
    // never retrieved or inspected. Downgraded to SOURCE_GAP per dossier
    // section 11A, which anticipated exactly this failure mode. The two
    // now-unreferenced locators are left in place as an honest record of
    // what was actually retrieved.
    {
      clusterKey: "electromagnetism-motor-effect-and-induced-emf",
      requirementKind: "RELATIONSHIP_OR_MECHANISM",
      requirementText: "Fleming's left-hand rule for force direction on a current-carrying conductor in a field.",
      coverageState: "SOURCE_GAP",
      supportingSourceLocatorKeys: [],
      gapReason:
        "SRC-NAGOYA-OCW-ELECTROMAGNETICS is the dossier's sole approved source for this directional mapping. Only its course-index page was retrievable, which lists Lesson 12 subsection EM12_3 as titled \"Fleming's Left-Hand Rule\" -- a subsection TITLE alone, not the actual finger/current/field/force directional mapping. The lesson's instructional content is an off-site linked video, not retrieved or inspected in this pass, so the mapping itself remains unverified.",
    },
    {
      clusterKey: "electromagnetism-motor-effect-and-induced-emf",
      requirementKind: "RELATIONSHIP_OR_MECHANISM",
      requirementText: "Fleming's right-hand rule for induced-current direction in a conductor moving through a field.",
      coverageState: "SOURCE_GAP",
      supportingSourceLocatorKeys: [],
      gapReason:
        "Same failure mode as Fleming's left-hand rule above: SRC-NAGOYA-OCW-ELECTROMAGNETICS's course-index page lists Lesson 13 subsection EM13_4-5 as titled \"Fleming's Right-Hand Rule\", but the actual directional-mapping content is an off-site linked video, not retrieved or inspected in this pass.",
    },
    {
      clusterKey: "electromagnetism-motor-effect-and-induced-emf",
      requirementKind: "RELATIONSHIP_OR_MECHANISM",
      requirementText: "F = BIl for a conductor perpendicular to the field; reversing B or I reverses the force.",
      coverageState: "VERIFIED",
      supportingSourceLocatorKeys: ["loc-up2-current-conductor-force"],
    },
    {
      clusterKey: "electromagnetism-motor-effect-and-induced-emf",
      requirementKind: "RELATIONSHIP_OR_MECHANISM",
      requirementText: "e = Blv for a conductor moving perpendicular to the field.",
      coverageState: "VERIFIED",
      supportingSourceLocatorKeys: ["loc-up2-motional-emf"],
    },
    {
      clusterKey: "electromagnetism-motor-effect-and-induced-emf",
      requirementKind: "PROCEDURE_OR_CALCULATION_RULE",
      requirementText: "Calculating force from F=BIl or induced EMF from e=Blv, including simple rearrangements and unit conversions.",
      coverageState: "VERIFIED",
      supportingSourceLocatorKeys: ["loc-up2-current-conductor-force", "loc-up2-motional-emf", "loc-nist-sp811-ch4"],
    },
    {
      clusterKey: "electromagnetism-motor-effect-and-induced-emf",
      requirementKind: "SYMBOL_OR_CONVENTION",
      requirementText: "Dot/cross page convention for field direction into/out of the page.",
      coverageState: "VERIFIED",
      supportingSourceLocatorKeys: ["loc-up2-current-conductor-force"],
    },
    {
      clusterKey: "electromagnetism-motor-effect-and-induced-emf",
      requirementKind: "PHYSICAL_OR_COMPONENT_RECOGNITION",
      requirementText: "Coil/solenoid field and polarity; basic electromagnet/relay/contactor principle.",
      coverageState: "CONDITIONAL_SOURCE_GAP",
      supportingSourceLocatorKeys: ["loc-up2-solenoid"],
      gapReason:
        "Solenoid field/polarity is VERIFIED. The word 'electromagnet' is not used explicitly by the retrieved source (only illustrated indirectly via application examples), and no approved source addresses relay/contactor principle at all.",
    },

    // ---- 17. ac-generation-single-loop-alternator ----
    {
      clusterKey: "ac-generation-single-loop-alternator",
      requirementKind: "FACTUAL_PROPOSITION",
      requirementText: "A single loop rotating within a magnetic field, connected via slip rings and brushes, produces an alternating EMF.",
      coverageState: "VERIFIED",
      supportingSourceLocatorKeys: ["loc-up2-generators", "loc-ecampus-simple-ac-generator"],
    },
    {
      clusterKey: "ac-generation-single-loop-alternator",
      requirementKind: "FACTUAL_PROPOSITION",
      requirementText:
        "No EMF is induced for motion parallel to the field; maximum EMF occurs for motion perpendicular to (cutting) the field.",
      coverageState: "VERIFIED",
      supportingSourceLocatorKeys: ["loc-ecampus-simple-ac-generator", "loc-up2-motional-emf"],
    },
    {
      clusterKey: "ac-generation-single-loop-alternator",
      requirementKind: "FACTUAL_PROPOSITION",
      requirementText: "The generator's output EMF varies as a sine wave as the loop rotates.",
      coverageState: "VERIFIED",
      supportingSourceLocatorKeys: ["loc-up2-generators", "loc-ecampus-simple-ac-generator"],
    },
    // NOTE (documentation-consistency correction, independent fresh-review
    // pass): SRC-ECAMPUS-ALTERNATOR-RELATIONSHIPS itself prints f=pN/60
    // (N in rpm), not the matrix's own f=N×P form (N in rev/s) -- the /60
    // performs the same rpm->rev/s conversion the matrix's N already
    // assumes, so the two forms are algebraically equivalent, not a
    // different relationship. See this module's header for the full
    // cross-check against SRC-ABB-POLE-PAIR-CONVENTION's n0=60f/p.
    {
      clusterKey: "ac-generation-single-loop-alternator",
      requirementKind: "RELATIONSHIP_OR_MECHANISM",
      requirementText:
        "f = N×P where N is rotational speed in rev/s and P is the number of pole pairs (per the C&G handout's own convention -- pole-pair definition requires independent verification, see review flag).",
      coverageState: "VERIFIED",
      supportingSourceLocatorKeys: ["loc-ecampus-alternator-relationships", "loc-abb-pole-pair-annex-a"],
    },
    {
      clusterKey: "ac-generation-single-loop-alternator",
      requirementKind: "RELATIONSHIP_OR_MECHANISM",
      requirementText: "One cycle of output corresponds to one revolution per pole pair.",
      coverageState: "VERIFIED",
      supportingSourceLocatorKeys: ["loc-ecampus-alternator-relationships", "loc-abb-pole-pair-annex-a"],
    },
    {
      clusterKey: "ac-generation-single-loop-alternator",
      requirementKind: "PROCEDURE_OR_CALCULATION_RULE",
      requirementText: "Simple f=N×P calculations and rearrangements; cycle/period/time relations.",
      coverageState: "VERIFIED",
      supportingSourceLocatorKeys: ["loc-ecampus-alternator-relationships", "loc-abb-pole-pair-annex-a"],
    },
    {
      clusterKey: "ac-generation-single-loop-alternator",
      requirementKind: "PHYSICAL_OR_COMPONENT_RECOGNITION",
      requirementText: "Slip rings, brushes, poles and coil as the core parts of a single-loop alternator.",
      coverageState: "VERIFIED",
      supportingSourceLocatorKeys: ["loc-ecampus-simple-ac-generator"],
    },

    // ---- 18. sine-wave-characteristics ----
    // NOTE (false-green audit correction, independent fresh-review pass):
    // none of the three cited locators' own summaries establish periodic
    // time or frequency as sine-wave characteristics -- loc-up2-simple-ac
    // gives v(t), Irms/Vrms and the full-cycle average; the two IAstate
    // locators give peak/peak-to-peak and RMS/form-factor. Amplitude/peak,
    // peak-to-peak, RMS and average value ARE covered; periodic time and
    // frequency are not, by any retrieved approved source. Downgraded from
    // an incorrect fully-VERIFIED to CONDITIONAL_SOURCE_GAP.
    {
      clusterKey: "sine-wave-characteristics",
      requirementKind: "FACTUAL_PROPOSITION",
      requirementText: "Definitions of amplitude/peak, peak-to-peak, periodic time, frequency, RMS value and average value for a sine wave.",
      coverageState: "CONDITIONAL_SOURCE_GAP",
      supportingSourceLocatorKeys: ["loc-up2-simple-ac", "loc-iastate-waveform-magnitude", "loc-iastate-rms"],
      gapReason:
        "Amplitude/peak, peak-to-peak, RMS value and average value are VERIFIED via the cited locators. Periodic time and frequency as sine-wave characteristics are not established by any retrieved approved source's own content (as distinct from f=N×P in the alternator cluster, which covers frequency only in the alternator-speed context).",
    },
    {
      clusterKey: "sine-wave-characteristics",
      requirementKind: "FACTUAL_PROPOSITION",
      requirementText:
        "The signed average of a complete symmetrical sine-wave cycle is zero; the 'average value' used in AC calculations is the average of one alternation.",
      coverageState: "VERIFIED",
      supportingSourceLocatorKeys: ["loc-up2-simple-ac", "loc-iastate-waveform-magnitude", "loc-iastate-rms"],
    },
    {
      clusterKey: "sine-wave-characteristics",
      requirementKind: "RELATIONSHIP_OR_MECHANISM",
      requirementText: "Vpp = 2×Vpeak.",
      coverageState: "VERIFIED",
      supportingSourceLocatorKeys: ["loc-iastate-waveform-magnitude"],
    },
    // NOTE (false-green audit correction): loc-up2-simple-ac's own summary
    // (v(t)=V0*sin(omega*t), Irms, Vrms, full-cycle average, reactance)
    // never states T=1/f or defines period; no other retrieved approved
    // source does either. Downgraded from an incorrect VERIFIED -- not
    // resolved from model knowledge, per this task's own governance.
    {
      clusterKey: "sine-wave-characteristics",
      requirementKind: "RELATIONSHIP_OR_MECHANISM",
      requirementText: "T = 1/f.",
      coverageState: "SOURCE_GAP",
      supportingSourceLocatorKeys: [],
      gapReason:
        "No retrieved approved source's own content states the period-frequency relationship T=1/f or defines periodic time for a sine wave. loc-up2-simple-ac (the only locator previously cited) covers v(t), RMS and full-cycle average, not period.",
    },
    {
      clusterKey: "sine-wave-characteristics",
      requirementKind: "RELATIONSHIP_OR_MECHANISM",
      requirementText: "Vrms ≈ 0.707×Vpeak (and Vpeak ≈ 1.414×Vrms).",
      coverageState: "VERIFIED",
      supportingSourceLocatorKeys: ["loc-up2-simple-ac", "loc-iastate-rms"],
    },
    {
      clusterKey: "sine-wave-characteristics",
      requirementKind: "RELATIONSHIP_OR_MECHANISM",
      requirementText: "Vavg ≈ 0.636×Vpeak (average of one alternation), and the analogous current relationships.",
      coverageState: "VERIFIED",
      supportingSourceLocatorKeys: ["loc-iastate-rms"],
    },
    // NOTE (false-green audit correction): the frequency<->period half of
    // this procedure depends on the same missing T=1/f evidence above; the
    // peak/RMS/average-of-one-alternation half is genuinely VERIFIED via
    // the cited locators.
    {
      clusterKey: "sine-wave-characteristics",
      requirementKind: "PROCEDURE_OR_CALCULATION_RULE",
      requirementText: "Converting between frequency and period, and between peak, RMS and average-of-one-alternation values.",
      coverageState: "CONDITIONAL_SOURCE_GAP",
      supportingSourceLocatorKeys: ["loc-up2-simple-ac", "loc-iastate-rms"],
      gapReason:
        "Converting between peak, RMS and average-of-one-alternation values is VERIFIED via the cited locators. Frequency<->period conversion is not, for the same reason as the T=1/f relationship above (SOURCE_GAP).",
    },

    // ---- 19. electronic-systems-and-applications ----
    {
      clusterKey: "electronic-systems-and-applications",
      requirementKind: "FACTUAL_PROPOSITION",
      requirementText: "Security alarm: a transistor provides a switching role and a thyristor provides a latching/sounder role within the circuit.",
      coverageState: "SOURCE_GAP",
      supportingSourceLocatorKeys: [],
      gapReason:
        "GAP-UNIT202-SECURITY-ALARM-TOPOLOGY (dossier section 5.9/8, explicit deliberate gap): transistor switching (ROHM-NPN-SWITCH) and SCR latching/holding-current behaviour (ST-AN4607-SCR) are separately sourceable and VERIFIED as generic component behaviour (see cluster 20), but no approved source establishes that exact component chain as a representative/general security-alarm architecture. SRC-ROHM-NPN-SWITCH was explicitly checked and confirmed to show only generic switching examples (LED/relay/motor/solenoid), no alarm content.",
    },
    {
      clusterKey: "electronic-systems-and-applications",
      requirementKind: "FACTUAL_PROPOSITION",
      requirementText: "Dimmer switch: a capacitor provides timing, a DIAC triggers, and a TRIAC provides phase control.",
      coverageState: "SOURCE_GAP",
      supportingSourceLocatorKeys: [],
      gapReason:
        "SRC-ST-AN3168-DIAC-TRIAC-DIMMER is the dossier's PRIMARY source for this exact chain and is RETRIEVAL_FAILED (no archive copy, hard origin block). SRC-ST-DIAC-DB3 (VERIFIED) covers only DIAC identity and its association with TRIAC triggering, not the full capacitor-timing/phase-control chain.",
    },
    {
      clusterKey: "electronic-systems-and-applications",
      requirementKind: "FACTUAL_PROPOSITION",
      requirementText: "Heating/boiler control: a thermistor senses temperature, feeding a switching/relay chain.",
      coverageState: "VERIFIED",
      supportingSourceLocatorKeys: ["loc-murata-ntc", "loc-omron-e5c2-specs"],
    },
    // NOTE (false-green audit correction): loc-abb-drives-fig1.1's own
    // summary is rectifier -> DC-link -> inverter -> motor block-function
    // only; it names no protection function. Downgraded from VERIFIED.
    {
      clusterKey: "electronic-systems-and-applications",
      requirementKind: "FACTUAL_PROPOSITION",
      requirementText: "Motor control: rectification and controlled switching/protection at block-function level.",
      coverageState: "CONDITIONAL_SOURCE_GAP",
      supportingSourceLocatorKeys: ["loc-abb-drives-fig1.1"],
      gapReason:
        "Rectification and controlled switching (rectifier/DC-link/inverter block chain) are VERIFIED via SRC-ABB-DRIVE-SYSTEM Figure 1.1. No retrieved approved source names a protection function for this chain.",
    },
    // NOTE (false-green audit correction): neither TI locator's own
    // summary states a practical advantage of wireless control (only the
    // transmitter/receiver arrangement itself). Downgraded from VERIFIED.
    {
      clusterKey: "electronic-systems-and-applications",
      requirementKind: "FACTUAL_PROPOSITION",
      requirementText: "Wireless control: transmitter/receiver arrangement and its practical advantages.",
      coverageState: "CONDITIONAL_SOURCE_GAP",
      supportingSourceLocatorKeys: ["loc-ti-wireless-env-sensor", "loc-ti-tida-01067"],
      gapReason:
        "The transmitter/receiver arrangement (wireless sensing transmitting to a gateway/thermostat) is VERIFIED via both TI locators. Neither locator's own content states a practical advantage of the wireless approach.",
    },
    {
      clusterKey: "electronic-systems-and-applications",
      requirementKind: "FACTUAL_PROPOSITION",
      requirementText:
        "Telephone system: whether any specific master-socket component role remains qualification-relevant and current is itself unestablished -- currency must be independently verified before any such role is taught as current general technical truth.",
      coverageState: "SOURCE_GAP",
      supportingSourceLocatorKeys: [],
      gapReason:
        "GAP-UNIT202-TELEPHONE-MASTER-SOCKET (dossier section 5.8/8, LEGACY_CONTEXT_ONLY, explicit deliberate gap). The broader currency context (UK PSTN is legacy/being retired, digital/IP transition, 31 January 2027 target date) IS VERIFIED via SRC-OPENREACH-DIGITAL-PHONE (loc-openreach-digital-phone), which was also explicitly checked and confirmed to contain NO detailed master-socket internal-component description. The specific master-socket component-role proposition itself remains unsourced by design -- Wikipedia/community/DIY sources remain explicitly prohibited (dossier section 9) and were not used.",
    },

    // ---- 20. electronic-components-operating-principles ----
    {
      clusterKey: "electronic-components-operating-principles",
      requirementKind: "FACTUAL_PROPOSITION",
      requirementText: "A capacitor stores charge/energy in an electric field.",
      coverageState: "VERIFIED",
      supportingSourceLocatorKeys: ["loc-up2-capacitors", "loc-up2-capacitor-energy"],
    },
    {
      clusterKey: "electronic-components-operating-principles",
      requirementKind: "FACTUAL_PROPOSITION",
      requirementText: "A resistor opposes current flow; resistors carry a 4-band colour-code rating.",
      coverageState: "VERIFIED",
      supportingSourceLocatorKeys: ["loc-te-resistor-4band", "loc-up2-ohm"],
    },
    {
      clusterKey: "electronic-components-operating-principles",
      requirementKind: "FACTUAL_PROPOSITION",
      requirementText: "A rectifier converts AC to unidirectional/pulsating DC, with distinct half-wave and full-wave circuit forms.",
      coverageState: "CONDITIONAL_SOURCE_GAP",
      supportingSourceLocatorKeys: ["loc-rohm-rectifier"],
      gapReason:
        "AC-to-DC conversion and half-wave conduction/blocking behaviour are VERIFIED via SRC-ROHM-RECTIFIER-DIODE. That source describes single-diode half-wave behaviour only; a distinct full-wave (bridge) circuit form is not explicitly established by any retrieved approved source.",
    },
    {
      clusterKey: "electronic-components-operating-principles",
      requirementKind: "FACTUAL_PROPOSITION",
      requirementText: "A diode conducts in one direction only, with anode/cathode terminals.",
      coverageState: "VERIFIED",
      supportingSourceLocatorKeys: ["loc-rohm-diode-basics"],
    },
    {
      clusterKey: "electronic-components-operating-principles",
      requirementKind: "FACTUAL_PROPOSITION",
      requirementText: "A Zener diode provides controlled reverse conduction for simple regulation/reference use.",
      coverageState: "VERIFIED",
      supportingSourceLocatorKeys: ["loc-rohm-zener"],
    },
    {
      clusterKey: "electronic-components-operating-principles",
      requirementKind: "FACTUAL_PROPOSITION",
      requirementText: "An LED emits light when correctly forward biased.",
      coverageState: "VERIFIED",
      supportingSourceLocatorKeys: ["loc-rohm-led-forward", "loc-rohm-led-emission"],
    },
    {
      clusterKey: "electronic-components-operating-principles",
      requirementKind: "FACTUAL_PROPOSITION",
      requirementText:
        "A photo-sensitive device's behaviour depends on light -- both a photodiode and a light-dependent resistor (LDR) are candidate devices for the Range's terse 'photo' entry (see review flag).",
      coverageState: "VERIFIED",
      supportingSourceLocatorKeys: ["loc-hamamatsu-photodiode", "loc-advphotonix-ldr"],
    },
    {
      clusterKey: "electronic-components-operating-principles",
      requirementKind: "FACTUAL_PROPOSITION",
      requirementText: "A thermistor's resistance changes with temperature; PTC and NTC are the two types.",
      coverageState: "VERIFIED",
      supportingSourceLocatorKeys: ["loc-murata-ntc", "loc-murata-ptc"],
    },
    {
      clusterKey: "electronic-components-operating-principles",
      requirementKind: "FACTUAL_PROPOSITION",
      requirementText: "A DIAC is a bidirectional breakover device commonly used to trigger a TRIAC.",
      coverageState: "VERIFIED",
      supportingSourceLocatorKeys: ["loc-st-diac-db3"],
    },
    {
      clusterKey: "electronic-components-operating-principles",
      requirementKind: "FACTUAL_PROPOSITION",
      requirementText: "A TRIAC is a bidirectional gated AC switching device.",
      coverageState: "SOURCE_GAP",
      supportingSourceLocatorKeys: [],
      gapReason:
        "SRC-ST-AN3168-DIAC-TRIAC-DIMMER, the dossier's primary TRIAC-operation source, is RETRIEVAL_FAILED. SRC-ST-DIAC-DB3 (VERIFIED) mentions TRIACs only as DB3's trigger target, without describing TRIAC's own bidirectional gated-switching operation.",
    },
    {
      clusterKey: "electronic-components-operating-principles",
      requirementKind: "FACTUAL_PROPOSITION",
      requirementText: "A transistor can switch or amplify; NPN and PNP are distinguished by symbol.",
      coverageState: "VERIFIED",
      supportingSourceLocatorKeys: ["loc-rohm-bjt"],
    },
    {
      clusterKey: "electronic-components-operating-principles",
      requirementKind: "FACTUAL_PROPOSITION",
      requirementText: "A thyristor (SCR) is a gate-triggered, latching, unidirectional controlled switch.",
      coverageState: "VERIFIED",
      supportingSourceLocatorKeys: ["loc-st-an4607-1.1", "loc-st-an4607-1.2"],
    },
    {
      clusterKey: "electronic-components-operating-principles",
      requirementKind: "FACTUAL_PROPOSITION",
      requirementText: "An inverter converts DC to AC, the reverse of a rectifier.",
      coverageState: "VERIFIED",
      supportingSourceLocatorKeys: ["loc-abb-drives-fig1.1"],
    },
    // NOTE (false-green audit correction): loc-rohm-bjt supports only the
    // NPN/PNP transistor symbol figure, not "each" of the cluster's 13
    // listed components (the neighbouring physical-appearance-recognition
    // bullet is correctly CONDITIONAL_SOURCE_GAP for the identical reason).
    // Downgraded from an incorrect VERIFIED.
    {
      clusterKey: "electronic-components-operating-principles",
      requirementKind: "SYMBOL_OR_CONVENTION",
      requirementText: "Standard schematic symbols for each listed component, including the NPN/PNP transistor distinction.",
      coverageState: "CONDITIONAL_SOURCE_GAP",
      supportingSourceLocatorKeys: ["loc-rohm-bjt"],
      gapReason:
        "The NPN/PNP transistor symbol distinction is VERIFIED via SRC-ROHM-BJT's symbol figure. No retrieved approved source establishes standard schematic symbols for the cluster's other twelve listed components (capacitor, resistor, rectifier, diode, Zener, LED, photo device, thermistor, DIAC, TRIAC, thyristor, inverter).",
    },
    {
      clusterKey: "electronic-components-operating-principles",
      requirementKind: "PHYSICAL_OR_COMPONENT_RECOGNITION",
      requirementText: "Physical appearance of each listed component as supporting recognition where useful.",
      coverageState: "CONDITIONAL_SOURCE_GAP",
      supportingSourceLocatorKeys: [],
      gapReason:
        "No retrieved approved source is specifically a physical-appearance recognition guide (most are functional/technical articles); a dedicated appearance-recognition reference was not part of the approved dossier for this bullet.",
    },
  ],
};
