/**
 * CC-04/CC-04A/CC-04B: the Unit 202 proving-slice knowledge corpus.
 *
 * CC-04A superseded the original CC-04 minimum Ohm's-law-only
 * neighbourhood (15 assertions, internal-only provenance, placeholder
 * curriculum version) with a curriculum-grounded slice covering LO1/LO2/
 * LO4. CC-04B expands the Electrical corpus to the Product-Owner-
 * confirmed target of ~150 Electrical assertions/capabilities (excluding
 * Foundational Maths/Physics, which are additional reusable horizontal
 * knowledge and do not count toward that target), by extending coverage
 * to real LO2 AC/reactive-quantity content and real LO5 (magnetism/AC
 * generation) content, and by decomposing the existing LO4 D.C. cluster
 * more finely across comparison, selection, prediction and interpretation
 * capability types rather than merely adding more Ohm's-law variants.
 *
 * CURRICULUM GROUNDING
 *
 * Curriculum identity, version and Learning Outcome / Assessment
 * Criterion wording below are taken directly from the official handbook:
 *
 *   City & Guilds Level 2 Diploma in Electrical Installations (Buildings
 *   and Structures) (2365-02) -- Qualification Handbook, April 2026,
 *   Version 1.12 (UAN for Unit 202: R/503/9937).
 *   https://www.cityandguilds.com/-/media/productdocuments/building_services_engineering/electrical_installation/2365/2365_level_2/centre_documents/2365-02_l2_electrical_installation_qualification_handbook_v1-12-pdf.pdf
 *
 * Selected slice: Unit 202 "Principles of Electrical Science", Learning
 * Outcomes 1, 2, 4 and 5 in full, plus the calculable subset of Learning
 * Outcome 3 needed to ground electrical power/energy/efficiency in
 * general physics. CC-04A originally excluded LO5 (magnetism and AC
 * generation/waveforms) as a slice-boundary choice, not a permanent
 * architecture rule; CC-04B includes it because it is genuinely part of
 * Unit 202, decomposes cleanly into atomic assertions, can be properly
 * sourced (OpenStax University Physics Volume 2, Chapters 11-13 and 15),
 * and materially improves vocational breadth/diversity without requiring
 * CC-05 (no numeric AC calculation engine is implemented -- only the
 * conceptual/relational knowledge substrate). Within LO3, AC3.1
 * (mass/weight) and AC3.2 (levers, gears, pulleys) remain represented
 * only where they feed something used elsewhere in this slice; CC-04B
 * adds a direct LO3-to-Electrical bridge via electrical efficiency
 * (useful power output / power input), genuinely connecting LO3's
 * "efficiency" Assessment Criterion to the Electrical vertical. Levers/
 * gears/pulleys remain excluded as a self-contained mechanical-advantage
 * topic with no connection to the rest of this slice. AC circuit
 * calculation (reactance/impedance arithmetic, phasor addition) is
 * deliberately NOT decomposed into calculation capabilities here -- only
 * the conceptual/definitional knowledge (what impedance/reactance/power
 * factor/RMS *are*) is modelled, consistent with LO2's own "identify and
 * determine values of... SI units" framing rather than LO4's deeper
 * "calculate" framing, which Unit 202 restricts to D.C. circuits.
 *
 * Foundational Maths (FM) and Foundational Physics (FP) assertions remain
 * reusable, domain-owned horizontal knowledge -- never duplicated into a
 * vocational-domain assertion merely to satisfy one qualification's
 * syllabus wording. CC-04A/B's original rule here read "never curriculum-
 * mapped directly"; that was correct for the case it was written for
 * (Ohm's Law's instrumental use of algebraic rearrangement, which
 * remains PREREQUISITE_OF-only, never curriculum-mapped) but was
 * over-broad as a blanket statement. CC-09B refined it once the corpus
 * reached AC/Range items (LO1's mathematical principles, LO3's mass/
 * weight and levers/gears/pulleys) that ask directly for generic FM/FP
 * knowledge AS ITSELF, not merely as another assertion's instrumental
 * prerequisite -- those cases now curriculum-map the FM/FP assertion
 * directly, and are documented at the point they occur (search
 * `acNode(` / `rangeNode(` within the FM/FP sections below). The
 * ordinary case remains unchanged: an FM/FP assertion used only
 * instrumentally by a vocational assertion (e.g. Ohm's Law's rearrangement
 * technique) is demonstrated through a PREREQUISITE_OF edge only, never a
 * direct curriculum mapping. Per explicit Product Owner direction
 * (CC-04B), a Foundational assertion that does not currently reach an
 * Electrical assertion or a direct curriculum mapping is not treated as a
 * defect -- it remains retained, reusable horizontal knowledge for future
 * Unit 202 expansion, other electrical qualifications, or other
 * vocational verticals.
 *
 * PROVENANCE GROUNDING
 *
 * Every APPROVED assertion version cites genuine external authoritative
 * provenance -- never only this project's own assertion collection:
 *
 *   - BIPM, "The International System of Units (SI Brochure)", 9th
 *     edition (2019; content updated 2026). DOI 10.59161/AUEZ1291.
 *     https://www.bipm.org/en/publications/si-brochure -- OPEN (CC BY 4.0).
 *   - UK Department for Education, "Mathematics GCSE subject content and
 *     assessment objectives".
 *     https://assets.publishing.service.gov.uk/media/5a7cb5b040f0b6629523b52c/GCSE_mathematics_subject_content_and_assessment_objectives.pdf
 *     -- OFFICIAL_OGL (Crown copyright, Open Government Licence).
 *   - OpenStax / Rice University, "University Physics Volume 1" (mechanics:
 *     work, energy, power; published 19 September 2016, authors Moebs/
 *     Ling/Sanny) and "University Physics Volume 2" (current, resistance,
 *     Ohm's law, DC circuits, electrical power, magnetism, electromagnetic
 *     induction, AC circuits; published 6 October 2016). Both licences
 *     were re-verified directly from each book's own copyright page
 *     (CC-04B hard requirement, not assumed from a licensing summary or
 *     from the other volume): both state "This book uses the Creative
 *     Commons Attribution-NonCommercial-ShareAlike License", with an
 *     explicit license URL http://creativecommons.org/licenses/by-nc-sa/4.0/
 *     confirmed on Volume 1's page, and Volume 2's statement independently
 *     re-confirmed on a second fetch. Both require attribution, restrict
 *     commercial use, and require ShareAlike on derivatives.
 *     https://openstax.org/ -- PUBLIC_RESTRICTED: publicly and freely
 *     readable, but the NonCommercial clause means "publicly viewable" is
 *     deliberately NOT treated as OPEN here.
 *   - City & Guilds 2365-02 handbook itself, cited with role
 *     CURRICULUM_REQUIRES where a specific Learning Outcome/Assessment
 *     Criterion is the acknowledged reason an Electrical assertion is
 *     included in this slice -- PROPRIETARY_REFERENCE. Locator summaries
 *     quote short Assessment Criterion phrases (a few words, for
 *     citation/identification only, as governed metadata never rendered
 *     to learners) -- every assertion `statement` below remains 100%
 *     independently authored, never copied from the handbook.
 *
 * No assertion relies solely on this project's own ORIGINAL provenance
 * for its factual grounding. ORIGINAL is not used as a rights
 * classification anywhere in this manifest.
 */

import type {
  KnowledgeGraphManifest,
  provenanceRoleSchema,
  relationshipStrengthSchema,
} from "@alp/content-schema";
import { z } from "zod";

type ProvenanceRole = z.infer<typeof provenanceRoleSchema>;
type Strength = z.infer<typeof relationshipStrengthSchema>;

// ---------------------------------------------------------------------
// Sources
// ---------------------------------------------------------------------

const SRC_CG = "src-cg-2365-02";
// CC-09D (Unit 202 Official Public Assessment Calibration): the official
// public 2365-602 sample assessment, registered as OFFICIAL_ASSESSMENT-role
// Course Evidence Registry entries (CC-09C's sourceRole). Deliberately
// carries NO assertionProvenanceLinks anywhere in this manifest -- it is
// evidence that a proposition is assessable, never factual authority for
// the proposition itself (task section 7's explicit CORRECT/INCORRECT
// sequence). Two companion documents, released together as the same v1.0
// (August 2018) sample-paper set but as separate PDF files with separate
// fingerprints.
const SRC_CG_602_SAMPLE_QUESTIONS = "src-cg-2365-602-sample-questions";
const SRC_CG_602_SAMPLE_MARK_SCHEME = "src-cg-2365-602-sample-mark-scheme";
const SRC_BIPM = "src-bipm-si-brochure";
const SRC_DFE_MATHS = "src-dfe-gcse-maths";
const SRC_OPENSTAX_UP1 = "src-openstax-university-physics-v1";
const SRC_OPENSTAX_UP2 = "src-openstax-university-physics-v2";
// CC-09B: new sources, researched to satisfy ADR-0002/task's non-negotiable
// provenance rule for LO6 (electronic components) and the LO1 indices/
// trigonometry/statistics and LO3 lever gaps CC-09A's structural-only
// correction left as backlog. Every new assertion below cites one of
// these (or an existing source) directly -- none relies on model
// knowledge alone.
const SRC_OPENSTAX_UP3 = "src-openstax-university-physics-v3";
const SRC_KUPHALDT_SEMICONDUCTORS = "src-kuphaldt-electric-circuits-iii-semiconductors";
const SRC_VISHAY_NTC = "src-vishay-ntc-thermistor-appnote";
const SRC_UOTTAWA_INVERTERS = "src-uottawa-elg4139-dc-ac-converters";
// CC-09B.1: audit-correction sources. TI is the new primary inverter
// source (task section 18, stronger first-party technical material);
// UOttawa is retained and re-cited as SUPPORTS rather than removed, per
// the explicit "do not silently erase audit history" instruction.
const SRC_TI_INVERTERS = "src-ti-slaa602a-pure-sine-inverter";
const SRC_OPENSTAX_COLLEGE_PHYSICS = "src-openstax-college-physics-2e";
const SRC_KUPHALDT_DC_CIRCUITS = "src-kuphaldt-electric-circuits-i-direct-current";
// CC-09B.2 (source-first evidence hardening): new sources acquired to
// replace DERIVED_FROM-only "provenance" for empirical/application claims
// (device construction, specific industry application) with genuine
// direct evidence, and to fill two entailment gaps the Project Architect
// named specifically (gear tooth-count/speed-torque; power factor's
// real/apparent-power-ratio clause). See PROJECT-STATUS.md CC-09B.2.
const SRC_NIST_HB44 = "src-nist-hb44-3.41-electricity-measuring";
const SRC_INDUS_UNI_WATTMETER = "src-indus-uni-dynamometer-wattmeter";
const SRC_UCSD_GEAR_RATIOS = "src-ucsd-mae3-gear-ratios";
const SRC_SECO_LARM_BEAM_SENSOR = "src-seco-larm-photoelectric-beam-sensor";
// CC-09B.3: closes the two AC6.1 application-evidence gaps CC-09B.2 left
// honestly incomplete (telephone equipment; wireless control systems).
// See PROJECT-STATUS.md CC-09B.3.
const SRC_SKYWORKS_DAA_DESIGN_GUIDE = "src-skyworks-an347-daa-design-guide";
const SRC_HOLTEK_HT12D = "src-holtek-ht12d-ht12f-decoder";
// CC-09B.4 (retroactive source-first provenance migration): new sources
// acquired to close the five named legacy defects (electrolysis;
// conductor/insulator installation examples; insulator/dielectric
// breakdown; clamp meter; fuse/breaker cluster) that a broad, generic
// "Chapter 9 introduction" locator was previously reused for. See
// PROJECT-STATUS.md CC-09B.4.
const SRC_OPENSTAX_CHEMISTRY = "src-openstax-chemistry-2e";
const SRC_FLUKE_CLAMP_METERS = "src-fluke-abcs-of-clamp-meters";
const SRC_PRYSMIAN_6242Y = "src-prysmian-6242y-pvc-cable-datasheet";
// CC-09B.6 (official teaching-material reconciliation): new sources
// acquired to close genuine intended-teaching gaps the official 2365-202
// SmartScreen/handout material revealed (median/mode already covered by
// the existing DfE Maths locator; lever-balance/pulley-tradeoff already
// covered by existing OpenStax locators; half-wave/full-wave already
// covered by the existing Kuphaldt rectifier locator -- only genuinely
// NEW facts needed a genuinely NEW independent source). See
// PROJECT-STATUS.md CC-09B.6.
const SRC_VISHAY_PTC = "src-vishay-ptcel-series-datasheet";
const SRC_FIRGELLI_GEAR_TRAIN = "src-firgelli-gear-train-mechanisms";
const SRC_WIKIPEDIA_BRITISH_TELEPHONE_SOCKETS = "src-wikipedia-british-telephone-sockets";
const SRC_ELPROCUS_THYRISTOR_ALARM = "src-elprocus-thyristor-sensor-alarm";
// CC-09B.6 (task section 30, adversarial gap review): an independent
// read-only subagent critique found F = B I l / Fleming's left-hand rule
// (AC5.3, Handout 11) and e = B l v / Fleming's right-hand rule (AC5.3,
// Handout 10) were exact structural analogues of the Maxwell's-screw-rule
// fix already made under the same AC, but had been missed. Adjudicated as
// genuine, load-bearing gaps and closed.
const SRC_WIKIPEDIA_FLEMING_LEFT_HAND = "src-wikipedia-flemings-left-hand-rule";
const SRC_WIKIPEDIA_FLEMING_RIGHT_HAND = "src-wikipedia-flemings-right-hand-rule";

/** Exported so ./unit202-assessment-specification.ts cites the same governed source-version identity rather than hand-copying the string. */
export const SV_CG = "sv-cg-2365-02-v1-12";
const SV_BIPM = "sv-bipm-si-9th-edition";
const SV_DFE_MATHS = "sv-dfe-gcse-maths";
const SV_OPENSTAX_UP1 = "sv-openstax-up1";
const SV_OPENSTAX_UP2 = "sv-openstax-up2";
const SV_OPENSTAX_UP3 = "sv-openstax-up3";
const SV_KUPHALDT_SEMICONDUCTORS = "sv-kuphaldt-electric-circuits-iii-semiconductors";
const SV_VISHAY_NTC = "sv-vishay-ntc-thermistor-appnote";
const SV_UOTTAWA_INVERTERS = "sv-uottawa-elg4139-dc-ac-converters";
const SV_TI_INVERTERS = "sv-ti-slaa602a-pure-sine-inverter";
const SV_OPENSTAX_COLLEGE_PHYSICS = "sv-openstax-college-physics-2e";
const SV_KUPHALDT_DC_CIRCUITS = "sv-kuphaldt-electric-circuits-i-direct-current";
const SV_NIST_HB44 = "sv-nist-hb44-3.41-2026";
const SV_INDUS_UNI_WATTMETER = "sv-indus-uni-dynamometer-wattmeter";
const SV_UCSD_GEAR_RATIOS = "sv-ucsd-mae3-gear-ratios";
const SV_SECO_LARM_BEAM_SENSOR = "sv-seco-larm-e-931-s33prgq";
const SV_SKYWORKS_DAA_DESIGN_GUIDE = "sv-skyworks-an347-daa-design-guide";
const SV_HOLTEK_HT12D = "sv-holtek-ht12d-ht12f-decoder";
// CC-09B.4: the CURRENT official Holtek revision (Rev. 1.40, 30-Aug-2022,
// fetched directly from holtek.com), superseding the CC-09B.3 fetch of
// Rev. 1.10 (2002, via a Farnell mirror). Same document family, same
// Applications list and General Description content re-verified present
// in the newer revision -- the old snapshot is kept as SUPERSEDED
// history, never deleted or silently relabelled.
const SV_HOLTEK_HT12D_2022 = "sv-holtek-ht12d-ht12f-decoder-rev1.40-2022";
const SV_OPENSTAX_CHEMISTRY = "sv-openstax-chemistry-2e";
const SV_FLUKE_CLAMP_METERS = "sv-fluke-abcs-of-clamp-meters";
const SV_PRYSMIAN_6242Y = "sv-prysmian-6242y-pvc-cable-datasheet";
const SV_VISHAY_PTC = "sv-vishay-ptcel-series-datasheet";
const SV_FIRGELLI_GEAR_TRAIN = "sv-firgelli-gear-train-mechanisms";
const SV_WIKIPEDIA_BRITISH_TELEPHONE_SOCKETS = "sv-wikipedia-british-telephone-sockets";
const SV_ELPROCUS_THYRISTOR_ALARM = "sv-elprocus-thyristor-sensor-alarm";
const SV_WIKIPEDIA_FLEMING_LEFT_HAND = "sv-wikipedia-flemings-left-hand-rule";
const SV_WIKIPEDIA_FLEMING_RIGHT_HAND = "sv-wikipedia-flemings-right-hand-rule";
// CC-09D: the official public 2365-602 sample e-volve MC test (v1.0,
// August 2018) -- OFFICIAL_ASSESSMENT evidence only, never cited as
// factual authority anywhere in this manifest.
const SV_CG_602_SAMPLE_QUESTIONS = "sv-cg-2365-602-sample-questions-v1-0";
const SV_CG_602_SAMPLE_MARK_SCHEME = "sv-cg-2365-602-sample-mark-scheme-v1-0";

// ---------------------------------------------------------------------
// Curriculum
// ---------------------------------------------------------------------

const CURRICULUM_CODE = "2365-02";
const CV_KEY = "cv-2365-02-v1-12";
const NODE_QUAL = "node-2365-02-qualification";
const NODE_UNIT = "node-202-unit";
const NODE_LO1 = "node-202-lo1";
const NODE_AC1_1 = "node-202-lo1-ac1.1";
const NODE_LO2 = "node-202-lo2";
const NODE_AC2_1 = "node-202-lo2-ac2.1";
const NODE_AC2_2 = "node-202-lo2-ac2.2";
const NODE_AC2_3 = "node-202-lo2-ac2.3";
const NODE_LO3 = "node-202-lo3";
const NODE_AC3_3 = "node-202-lo3-ac3.3";
const NODE_AC3_4 = "node-202-lo3-ac3.4";
const NODE_LO4 = "node-202-lo4";
const NODE_AC4_1 = "node-202-lo4-ac4.1";
const NODE_AC4_2 = "node-202-lo4-ac4.2";
const NODE_AC4_3 = "node-202-lo4-ac4.3";
const NODE_AC4_4 = "node-202-lo4-ac4.4";
const NODE_AC4_5 = "node-202-lo4-ac4.5";
const NODE_AC4_6 = "node-202-lo4-ac4.6";
const NODE_AC4_7 = "node-202-lo4-ac4.7";
const NODE_AC4_8 = "node-202-lo4-ac4.8";
const NODE_LO5 = "node-202-lo5";
const NODE_AC5_1 = "node-202-lo5-ac5.1";
const NODE_AC5_2 = "node-202-lo5-ac5.2";
const NODE_AC5_3 = "node-202-lo5-ac5.3";
const NODE_AC5_4 = "node-202-lo5-ac5.4";
const NODE_AC5_5 = "node-202-lo5-ac5.5";

// ---------------------------------------------------------------------
// CC-09A: corrected, complete Unit 202 curriculum structure.
//
// The block above (CV_KEY = cv-2365-02-v1-12) is the CC-04A/CC-04B
// deliberately-scoped proving slice: LO1, LO2, LO4, LO5 in full, plus
// only the calculable subset of LO3 -- documented as an intentional
// slice boundary in this file's own header comment, not an error. Every
// title transcribed into it was independently re-verified against the
// official handbook fetched directly from cityandguilds.com (CC-09A) and
// found accurate for what it covers.
//
// It is nonetheless INCOMPLETE against the full official Unit 202
// structure: LO3 is missing AC3.1 (mass/weight) and AC3.2 (levers/gears/
// pulleys); LO6 (electronic components, 2 ACs) is entirely absent; and no
// official handbook "Range" box (58 individually mandatory items across
// 8 Range headings) is represented as a curriculum requirement at all --
// RANGE_ITEM did not exist as a node type before CC-09A.
//
// Per the CC-09A approved architecture decision, this is corrected by a
// NEW curriculumVersion (never by mutating the already-governed CC-04B
// snapshot above -- the same "supersede, never silently rewrite"
// discipline ContentRelease already enforces for lessons). CV_KEY_R2
// contains the complete official LO1-LO6 / 23-AC / 58-Range-item
// structure, transcribed and verified directly from:
//
//   City & Guilds Level 2 Diploma in Electrical Installations (Buildings
//   and Structures) (2365-02) -- Qualification Handbook, April 2026,
//   Version 1.12 (same edition as SV_CG above; UAN for Unit 202:
//   R/503/9937), fetched directly from cityandguilds.com. Unit 202 is
//   assessed by one mandatory online multiple-choice test (602): 90
//   minutes, 40 questions, closed book, non-programmable calculator,
//   approximate pass 50%. Per-outcome allocation: LO1 2/5%, LO2 5/13%,
//   LO3 7/18%, LO4 15/37%, LO5 7/17%, LO6 4/10% (see
//   ./unit202-assessment-specification.ts).
//
// The 19 Assessment Criterion nodes CC-04B already has real, provenanced
// assertion coverage for (see `assertionCurriculumMappings` below) are
// mechanically remapped onto their CV_KEY_R2 equivalents via
// `OLD_TO_R2_AC_NODE` -- the SAME assertions, an additional mapping, not
// re-authored knowledge -- so CV_KEY_R2's coverage picture is accurate
// rather than falsely showing already-covered ground as backlog. AC3.1,
// AC3.2, LO6's two ACs, and all 58 Range items have no CC-09A assertion
// authored for them yet: this is the real, mechanically-derived Unit 202
// knowledge backlog `scripts/content/report-coverage-matrix.ts` exists to
// expose, not a defect in this package (CC-09A explicitly does not author
// new lessons or question content).
// ---------------------------------------------------------------------

/** Exported so ./unit202-assessment-specification.ts and scripts/content/report-coverage-matrix.ts reference the same governed curriculum-version identity rather than hand-copying the string. */
export const CV_KEY_R2 = "cv-2365-02-v1-12-r2";
const NODE_QUAL_R2 = "node-2365-02-qualification-r2";
const NODE_UNIT_R2 = "node-202-unit-r2";

interface RangeItemDef {
  /** Short stable suffix, e.g. "FRACTIONS-PERCENTAGES" -- combined with the owning AC's code to form the node's `code`, and lower-cased to form its manifest key. */
  suffix: string;
  title: string;
}

interface AcDef {
  /** Official Assessment Criterion number, e.g. "1.1", "3.3a"-free (sub-lettered items inside one AC statement, e.g. AC3.3's a-e or AC5.3's a-d, are part of that AC's own statement text, never split into separate nodes -- only a handbook "Range" box's own bullet items become RANGE_ITEM nodes). */
  number: string;
  title: string;
  /** One AC may have zero or one Range box (never more, per the current handbook); a Range box may itself contain more than one named heading (LO2), each contributing its own items. */
  range?: { heading: string; items: RangeItemDef[] }[];
}

interface LoDef {
  number: number;
  title: string;
  acs: AcDef[];
}

const UNIT202_R2_STRUCTURE: LoDef[] = [
  {
    number: 1,
    title: "Understand mathematical principles which are appropriate to electrical installation, maintenance and design work",
    acs: [
      {
        number: "1.1",
        title: "Identify and apply appropriate mathematical principles which are relevant to electrical work tasks",
        range: [
          {
            heading: "Mathematical principles",
            items: [
              { suffix: "FRACTIONS-PERCENTAGES", title: "Fractions and percentages" },
              { suffix: "ALGEBRA", title: "Algebra" },
              { suffix: "INDICES", title: "Indices" },
              { suffix: "TRANSPOSITION", title: "Transposition" },
              { suffix: "TRIANGLES-TRIGONOMETRY", title: "Triangles and trigonometry" },
              { suffix: "STATISTICS", title: "Statistics" },
            ],
          },
        ],
      },
    ],
  },
  {
    number: 2,
    title: "Understand standard units of measurement used in electrical installation, maintenance and design work",
    acs: [
      {
        number: "2.1",
        title: "Identify and use internationally recognised base and derived (SI) units of measurement",
        range: [
          {
            heading: "(SI) Units of measurement for",
            items: [
              { suffix: "LENGTH", title: "Length" },
              { suffix: "AREA", title: "Area" },
              { suffix: "VOLUME", title: "Volume" },
              { suffix: "MASS", title: "Mass" },
              { suffix: "DENSITY", title: "Density" },
              { suffix: "TIME", title: "Time" },
              { suffix: "TEMPERATURE", title: "Temperature" },
              { suffix: "VELOCITY", title: "Velocity" },
            ],
          },
        ],
      },
      {
        number: "2.2",
        title: "Identify and determine values of base and derived SI units which apply specifically to electrical quantities",
        range: [
          {
            heading: "Electrical quantities (SI units)",
            items: [
              { suffix: "RESISTANCE", title: "Resistance" },
              { suffix: "RESISTIVITY", title: "Resistivity" },
              { suffix: "POWER", title: "Power" },
              { suffix: "FREQUENCY", title: "Frequency" },
              { suffix: "CURRENT", title: "Current" },
              { suffix: "VOLTAGE", title: "Voltage" },
              { suffix: "ENERGY", title: "Energy" },
              { suffix: "IMPEDANCE", title: "Impedance" },
              { suffix: "INDUCTANCE-REACTANCE", title: "Inductance and inductive reactance" },
              { suffix: "CAPACITANCE-REACTANCE", title: "Capacitance and capacitive reactance" },
              { suffix: "POWER-FACTOR", title: "Power factor" },
            ],
          },
        ],
      },
      {
        number: "2.3",
        title: "Identify appropriate electrical instruments for the measurement of different electrical quantities",
        range: [
          {
            heading: "Electrical quantities (measurement)",
            items: [
              { suffix: "RESISTANCE", title: "Resistance" },
              { suffix: "POWER", title: "Power" },
              { suffix: "CURRENT", title: "Current" },
              { suffix: "VOLTAGE", title: "Voltage" },
              { suffix: "ENERGY", title: "Energy" },
            ],
          },
        ],
      },
    ],
  },
  {
    number: 3,
    title: "Understand basic mechanics and the relationship between force, work, energy and power",
    acs: [
      { number: "3.1", title: "Specify what is meant by mass and weight" },
      {
        number: "3.2",
        title: "Explain the principles of basic mechanics as they apply to levers, gears and pulleys",
        range: [
          {
            heading: "Levers",
            items: [
              { suffix: "CLASS-I", title: "Class I" },
              { suffix: "CLASS-II", title: "Class II" },
              { suffix: "CLASS-III", title: "Class III" },
            ],
          },
        ],
      },
      {
        number: "3.3",
        title: "Describe the main principles of the following and their inter-relationships: force, work, energy (kinetic and potential), power, efficiency",
      },
      { number: "3.4", title: "Calculate values of mechanical energy, power and efficiency" },
    ],
  },
  {
    number: 4,
    title: "Understand the relationship between resistance, resistivity, voltage, current and power",
    acs: [
      { number: "4.1", title: "Describe the basic principles of electron theory" },
      { number: "4.2", title: "Identify and distinguish between materials which are good conductors and insulators" },
      { number: "4.3", title: "Describe what is meant by resistance and resistivity in relation to electrical circuits" },
      { number: "4.4", title: "Explain the relationship between current, voltage and resistance in parallel and series D.C. circuits" },
      { number: "4.5", title: "Calculate the values of current, voltage and resistance in parallel and series D.C. circuits" },
      { number: "4.6", title: "Calculate values of power in parallel and series D.C. circuits" },
      { number: "4.7", title: "State what is meant by the term voltage drop in relation to electrical circuits" },
      { number: "4.8", title: "Describe the chemical and thermal effects of electric currents" },
    ],
  },
  {
    number: 5,
    title: "Understand the fundamental principles which underpin the relationship between magnetism and electricity",
    acs: [
      { number: "5.1", title: "Describe the effects of magnetism in terms of attraction and repulsion" },
      { number: "5.2", title: "State the difference between magnetic flux and flux density" },
      {
        number: "5.3",
        title:
          "Describe the magnetic effects of electrical currents in terms of: production of a magnetic field, force on a current-carrying conductor in a magnetic field, electromagnetism, electromotive force",
      },
      {
        number: "5.4",
        title: "Describe the basic principles of generating an A.C. supply in terms of: a single-loop generator, sine-wave, frequency, EMF, magnetic flux",
      },
      {
        number: "5.5",
        title: "Identify the characteristics of sine-waves",
        range: [
          {
            heading: "Characteristics of a sine-wave",
            items: [
              { suffix: "RMS-VALUE", title: "Root Mean Square (RMS) value" },
              { suffix: "AVERAGE-VALUE", title: "Average value" },
              { suffix: "PEAK-TO-PEAK-VALUE", title: "Peak to peak value" },
              { suffix: "PERIODIC-TIME", title: "Periodic time" },
              { suffix: "FREQUENCY", title: "Frequency" },
              { suffix: "AMPLITUDE", title: "Amplitude" },
            ],
          },
        ],
      },
    ],
  },
  {
    number: 6,
    title: "Understand the types, applications and limitations of electronic components in electrical systems and equipment",
    acs: [
      {
        number: "6.1",
        title: "Describe the function and application of electronic components that are used in electrical systems",
        range: [
          {
            heading: "Electrical systems",
            items: [
              { suffix: "SECURITY-ALARMS", title: "Security alarms" },
              { suffix: "TELEPHONES", title: "Telephones" },
              { suffix: "DIMMER-SWITCHES", title: "Dimmer switches" },
              { suffix: "HEATING-BOILER-CONTROLS", title: "Heating/boiler controls" },
              { suffix: "MOTOR-CONTROL", title: "Motor control" },
              { suffix: "WIRELESS-CONTROL-SYSTEMS", title: "Wireless control systems" },
            ],
          },
        ],
      },
      {
        number: "6.2",
        title: "State the basic operating principles of electronic components and devices",
        range: [
          {
            heading: "Electronic components and devices",
            items: [
              { suffix: "CAPACITORS", title: "Capacitors" },
              { suffix: "RESISTORS", title: "Resistors" },
              { suffix: "RECTIFIERS", title: "Rectifiers" },
              { suffix: "DIODES", title: "Diodes" },
              { suffix: "ZENER", title: "Zener" },
              { suffix: "LED", title: "LED" },
              { suffix: "PHOTO", title: "Photo" },
              { suffix: "THERMISTORS", title: "Thermistors" },
              { suffix: "DIACS", title: "Diacs" },
              { suffix: "TRIACS", title: "Triacs" },
              { suffix: "TRANSISTORS", title: "Transistors" },
              { suffix: "THYRISTORS", title: "Thyristors" },
              { suffix: "INVERTORS", title: "Invertors" },
            ],
          },
        ],
      },
    ],
  },
];

/** node-key -> AC code, for the 19 CC-04B ACs that already have real assertion coverage (used by `OLD_TO_R2_AC_NODE` below to remap that coverage onto CV_KEY_R2 mechanically, without re-authoring any assertion). */
const OLD_AC_NODE_TO_CODE = new Map<string, string>([
  [NODE_AC1_1, "1.1"],
  [NODE_AC2_1, "2.1"],
  [NODE_AC2_2, "2.2"],
  [NODE_AC2_3, "2.3"],
  [NODE_AC3_3, "3.3"],
  [NODE_AC3_4, "3.4"],
  [NODE_AC4_1, "4.1"],
  [NODE_AC4_2, "4.2"],
  [NODE_AC4_3, "4.3"],
  [NODE_AC4_4, "4.4"],
  [NODE_AC4_5, "4.5"],
  [NODE_AC4_6, "4.6"],
  [NODE_AC4_7, "4.7"],
  [NODE_AC4_8, "4.8"],
  [NODE_AC5_1, "5.1"],
  [NODE_AC5_2, "5.2"],
  [NODE_AC5_3, "5.3"],
  [NODE_AC5_4, "5.4"],
  [NODE_AC5_5, "5.5"],
]);

interface BuiltR2Nodes {
  nodes: KnowledgeGraphManifest["curriculumNodes"];
  /** AC number ("1.1", "3.2", ...) -> CV_KEY_R2 node key, so OLD_TO_R2_AC_NODE and the AssessmentSpecification data can resolve real node keys mechanically instead of hand-copied strings. */
  acNodeKeyByNumber: Map<string, string>;
  /** LO number (1..6) -> CV_KEY_R2 node key, consumed by ./unit202-assessment-specification.ts. */
  loNodeKeyByNumber: Map<number, string>;
  /** CC-09B: `${AC number}:${range item suffix}` (e.g. "1.1:ALGEBRA") -> CV_KEY_R2 RANGE_ITEM node key, so new assertions below map to the exact governed Range-item node mechanically rather than hand-deriving its key string. */
  rangeItemNodeKeyByAcAndSuffix: Map<string, string>;
}

function buildUnit202R2Nodes(structure: readonly LoDef[]): BuiltR2Nodes {
  const nodes: KnowledgeGraphManifest["curriculumNodes"] = [];
  const acNodeKeyByNumber = new Map<string, string>();
  const loNodeKeyByNumber = new Map<number, string>();
  const rangeItemNodeKeyByAcAndSuffix = new Map<string, string>();

  structure.forEach((lo, loIndex) => {
    const loKey = `node-202r2-lo${lo.number}`;
    loNodeKeyByNumber.set(lo.number, loKey);
    nodes.push({
      key: loKey,
      curriculumVersionKey: CV_KEY_R2,
      parentKey: NODE_UNIT_R2,
      nodeType: "LEARNING_OUTCOME",
      code: `202-LO${lo.number}`,
      title: lo.title,
      sequenceOrder: loIndex + 1,
    });

    lo.acs.forEach((ac, acIndex) => {
      const acKey = `${loKey}-ac${ac.number}`;
      acNodeKeyByNumber.set(ac.number, acKey);
      nodes.push({
        key: acKey,
        curriculumVersionKey: CV_KEY_R2,
        parentKey: loKey,
        nodeType: "ASSESSMENT_CRITERION",
        code: `202-LO${lo.number}-AC${ac.number}`,
        title: ac.title,
        sequenceOrder: acIndex + 1,
      });

      let rangeSequence = 0;
      for (const group of ac.range ?? []) {
        for (const item of group.items) {
          rangeSequence += 1;
          const rangeItemKey = `${acKey}-range-${item.suffix.toLowerCase()}`;
          rangeItemNodeKeyByAcAndSuffix.set(`${ac.number}:${item.suffix}`, rangeItemKey);
          nodes.push({
            key: rangeItemKey,
            curriculumVersionKey: CV_KEY_R2,
            parentKey: acKey,
            nodeType: "RANGE_ITEM",
            code: `202-LO${lo.number}-AC${ac.number}-RANGE-${item.suffix}`,
            title: `${group.heading}: ${item.title}`,
            sequenceOrder: rangeSequence,
          });
        }
      }
    });
  });

  return { nodes, acNodeKeyByNumber, loNodeKeyByNumber, rangeItemNodeKeyByAcAndSuffix };
}

const unit202R2 = buildUnit202R2Nodes(UNIT202_R2_STRUCTURE);

/** Every CV_KEY_R2 Assessment Criterion node's key, keyed by AC number -- exported so ./unit202-assessment-specification.ts never hand-copies a node key string. */
export const UNIT202_R2_AC_NODE_KEY_BY_NUMBER = unit202R2.acNodeKeyByNumber;
/** Every CV_KEY_R2 Learning Outcome node's key, keyed by LO number -- exported so ./unit202-assessment-specification.ts never hand-copies a node key string. */
export const UNIT202_R2_LO_NODE_KEY_BY_NUMBER = unit202R2.loNodeKeyByNumber;

/**
 * CC-09B: `${AC number}:${range-item suffix}` -> CV_KEY_R2 RANGE_ITEM node
 * key (e.g. `rangeNode("1.1", "ALGEBRA")`). Throws loudly on an unknown
 * pair rather than silently mapping a new assertion to nothing -- a typo
 * here must fail the manifest build, never fall through to "uncovered".
 */
function rangeNode(acNumber: string, suffix: string): string {
  const key = unit202R2.rangeItemNodeKeyByAcAndSuffix.get(`${acNumber}:${suffix}`);
  if (!key) {
    throw new Error(`rangeNode: no CV_KEY_R2 RANGE_ITEM node for AC ${acNumber} range item '${suffix}'`);
  }
  return key;
}

/** AC number -> CV_KEY_R2 ASSESSMENT_CRITERION node key. Throws loudly on an unknown AC number, for the same reason as rangeNode() above. */
function acNode(acNumber: string): string {
  const key = unit202R2.acNodeKeyByNumber.get(acNumber);
  if (!key) {
    throw new Error(`acNode: no CV_KEY_R2 ASSESSMENT_CRITERION node for AC ${acNumber}`);
  }
  return key;
}

const OLD_TO_R2_AC_NODE = new Map<string, string>(
  [...OLD_AC_NODE_TO_CODE.entries()].map(([oldKey, acNumber]) => {
    const r2Key = unit202R2.acNodeKeyByNumber.get(acNumber);
    if (!r2Key) {
      throw new Error(`OLD_TO_R2_AC_NODE: no CV_KEY_R2 node built for AC ${acNumber} (remapped from ${oldKey})`);
    }
    return [oldKey, r2Key];
  }),
);

// ---------------------------------------------------------------------
// Source locators (each cited from multiple assertions where the same
// section genuinely supports several propositions -- WP1.2 SS23).
// ---------------------------------------------------------------------

interface LocatorDef {
  key: string;
  sourceVersionKey: string;
  section?: string;
  subsection?: string;
  page?: string;
  locatorSummary: string;
}

const locators: LocatorDef[] = [
  // -- DfE GCSE Mathematics subject content --
  {
    key: "loc-dfe-number-inverse-reciprocal",
    sourceVersionKey: SV_DFE_MATHS,
    section: "Subject content", subsection: "Number, item 3", page: "4-5",
    locatorSummary: "Number: relationships between operations including inverse operations; conventional notation for priority of operations including brackets, powers, roots and reciprocals",
  },
  {
    key: "loc-dfe-number-fractions",
    sourceVersionKey: SV_DFE_MATHS,
    section: "Subject content", subsection: "Number, item 2", page: "4",
    locatorSummary: "Number: apply the four operations, including formal written methods, to integers, decimals and simple fractions (proper and improper), and mixed numbers",
  },
  {
    key: "loc-dfe-number-standard-form",
    sourceVersionKey: SV_DFE_MATHS,
    section: "Subject content", subsection: "Number, item 9", page: "5",
    locatorSummary: "Number: calculate with and interpret standard form A x 10^n, where 1 <= A < 10 and n is an integer",
  },
  {
    key: "loc-dfe-algebra-equations",
    sourceVersionKey: SV_DFE_MATHS,
    section: "Subject content", subsection: "Algebra, Notation/vocabulary/manipulation, item 3", page: "6",
    locatorSummary: "Algebra: understand and use the concepts and vocabulary of expressions, equations, formulae, identities",
  },
  {
    key: "loc-dfe-algebra-substitution",
    sourceVersionKey: SV_DFE_MATHS,
    section: "Subject content", subsection: "Algebra, Notation/vocabulary/manipulation, item 2", page: "6",
    locatorSummary: "Algebra: substitute numerical values into formulae and expressions, including scientific formulae",
  },
  {
    key: "loc-dfe-algebra-rearrange",
    sourceVersionKey: SV_DFE_MATHS,
    section: "Subject content", subsection: "Algebra, Notation/vocabulary/manipulation, item 5", page: "6",
    locatorSummary: "Algebra: understand and use standard mathematical formulae; rearrange formulae to change the subject",
  },
  {
    key: "loc-dfe-ratio-percentage",
    sourceVersionKey: SV_DFE_MATHS,
    section: "Subject content", subsection: "Ratio, proportion and rates of change, item 9", page: "8",
    locatorSummary: "Ratio, proportion and rates of change: define percentage as 'number of parts per hundred'; interpret percentages and percentage changes",
  },
  {
    key: "loc-dfe-ratio-proportion",
    sourceVersionKey: SV_DFE_MATHS,
    section: "Subject content", subsection: "Ratio, proportion and rates of change, items 10 and 13", page: "8-9",
    locatorSummary: "Ratio, proportion and rates of change: solve problems involving direct and inverse proportion; X inversely proportional to Y is equivalent to X proportional to 1/Y",
  },

  // -- BIPM SI Brochure --
  {
    key: "loc-bipm-ampere",
    sourceVersionKey: SV_BIPM,
    section: "Appendix 2", subsection: "The ampere",
    locatorSummary: "SI Brochure Appendix 2: the ampere, SI base unit of electric current",
  },
  {
    key: "loc-bipm-derived-units",
    sourceVersionKey: SV_BIPM,
    section: "Table of SI derived units with special names and symbols",
    locatorSummary: "SI Brochure: table of SI derived units with special names, including the volt, ohm, watt and joule, and SI prefixes",
  },

  // -- OpenStax University Physics Volume 1 --
  {
    key: "loc-openstax-up1-work",
    sourceVersionKey: SV_OPENSTAX_UP1,
    section: "Chapter 7", subsection: "7.1 Work",
    locatorSummary: "University Physics Volume 1, Ch.7: work as a force causing displacement of its point of application; force and mass/weight",
  },
  {
    key: "loc-openstax-up1-kinetic-energy",
    sourceVersionKey: SV_OPENSTAX_UP1,
    section: "Chapter 7", subsection: "7.2 Kinetic Energy",
    locatorSummary: "University Physics Volume 1, Ch.7.2: kinetic energy and the work-energy relationship; conservation of energy",
  },
  {
    key: "loc-openstax-up1-power",
    sourceVersionKey: SV_OPENSTAX_UP1,
    section: "Chapter 7", subsection: "7.4 Power",
    locatorSummary: "University Physics Volume 1, Ch.7.4: power as the rate at which work is done or energy is transferred, P = W / t",
  },

  // -- OpenStax University Physics Volume 2 --
  {
    key: "loc-openstax-up2-current-general",
    sourceVersionKey: SV_OPENSTAX_UP2,
    section: "Chapter 9", subsection: "Current and Resistance (introduction)",
    locatorSummary: "University Physics Volume 2, Ch.9: electric current as the flow of free charge carriers; conductors, insulators; thermal/chemical effects of current",
  },
  {
    key: "loc-openstax-up2-resistivity-resistance",
    sourceVersionKey: SV_OPENSTAX_UP2,
    section: "Chapter 9", subsection: "9.3 Resistivity and Resistance",
    locatorSummary: "University Physics Volume 2, 9.3: resistance and resistivity, and R = rho L / A",
  },
  {
    key: "loc-openstax-up2-ohms-law",
    sourceVersionKey: SV_OPENSTAX_UP2,
    section: "Chapter 9", subsection: "9.4 Ohm's Law",
    locatorSummary: "University Physics Volume 2, 9.4: Ohm's law, V = IR, and voltage/potential difference",
  },
  {
    key: "loc-openstax-up2-power-energy",
    sourceVersionKey: SV_OPENSTAX_UP2,
    section: "Chapter 9", subsection: "9.5 Electrical Energy and Power",
    locatorSummary: "University Physics Volume 2, 9.5: electrical power and energy, P = VI and P = I^2 R",
  },
  {
    key: "loc-openstax-up2-series-parallel",
    sourceVersionKey: SV_OPENSTAX_UP2,
    section: "Chapter 10", subsection: "10.2 Resistors in Series and Parallel",
    locatorSummary: "University Physics Volume 2, 10.2: equivalent resistance for resistors in series and in parallel",
  },
  {
    key: "loc-openstax-up2-magnetic-forces",
    sourceVersionKey: SV_OPENSTAX_UP2,
    section: "Chapter 11", subsection: "Magnetic Forces and Fields",
    locatorSummary: "University Physics Volume 2, Ch.11: magnetic attraction/repulsion; force on a current-carrying conductor in a magnetic field (11.4)",
  },
  {
    key: "loc-openstax-up2-magnetic-sources",
    sourceVersionKey: SV_OPENSTAX_UP2,
    section: "Chapter 12", subsection: "Sources of Magnetic Fields",
    locatorSummary: "University Physics Volume 2, Ch.12: the magnetic field produced by a current-carrying conductor; electromagnetism",
  },
  {
    key: "loc-openstax-up2-em-induction",
    sourceVersionKey: SV_OPENSTAX_UP2,
    section: "Chapter 13", subsection: "Electromagnetic Induction",
    locatorSummary: "University Physics Volume 2, Ch.13: magnetic flux and flux density (13.1 Faraday's Law); EMF; electric generators and the sinusoidal generated waveform (13.6)",
  },
  {
    // CC-09D: precise locator for the quantitative form of Faraday's law
    // itself (distinct from loc-openstax-up2-em-induction's broader
    // chapter-level citation, and distinct from loc-openstax-up2-motional-
    // emf's own e=Blv special case) -- inspected directly, task section 24.
    key: "loc-openstax-up2-faradays-law",
    sourceVersionKey: SV_OPENSTAX_UP2,
    section: "Chapter 13", subsection: "13.1 Faraday's Law",
    locatorSummary: "\"epsilon = -dPhi_m/dt\" (single loop) and \"epsilon = -N dPhi_m/dt\" (N-turn coil) -- the induced EMF equals the (negative) rate of change of magnetic flux linking the circuit",
  },
  {
    key: "loc-openstax-up2-ac-circuits",
    sourceVersionKey: SV_OPENSTAX_UP2,
    section: "Chapter 15", subsection: "Alternating-Current Circuits",
    locatorSummary: "University Physics Volume 2, Ch.15: impedance, reactance, inductance, capacitance and power factor in AC circuits",
  },
  {
    // CC-09D: precise locator for the impedance MAGNITUDE formula itself
    // (distinct from loc-openstax-up2-ac-circuits' broader chapter-level
    // citation already used for the qualitative impedance concept) --
    // inspected directly, task section 24.
    key: "loc-openstax-up2-rlc-series-impedance",
    sourceVersionKey: SV_OPENSTAX_UP2,
    section: "Chapter 15", subsection: "15.3 RLC Series Circuits with AC",
    locatorSummary: "\"Z = sqrt(R^2 + (X_L - X_C)^2)\" (Equation 15.11) -- the impedance magnitude of a series RLC AC circuit, combining resistance and net reactance",
  },

  // -- City & Guilds 2365-02, Unit 202 Assessment Criteria (real AC
  // wording used as citation/identification metadata only; every
  // assertion statement is independently authored) --
  {
    key: "loc-cg-ac1.1", sourceVersionKey: SV_CG, page: "25",
    section: "Unit 202, LO1", subsection: "AC1.1",
    locatorSummary: "AC1.1: identify and apply appropriate mathematical principles which are relevant to electrical work tasks",
  },
  {
    key: "loc-cg-ac2.1", sourceVersionKey: SV_CG, page: "26",
    section: "Unit 202, LO2", subsection: "AC2.1",
    locatorSummary: "AC2.1: identify and use internationally recognised base and derived (SI) units of measurement",
  },
  {
    key: "loc-cg-ac2.2", sourceVersionKey: SV_CG, page: "26",
    section: "Unit 202, LO2", subsection: "AC2.2",
    locatorSummary: "AC2.2: identify and determine values of base and derived SI units which apply specifically to electrical quantities",
  },
  {
    key: "loc-cg-ac2.3", sourceVersionKey: SV_CG, page: "26",
    section: "Unit 202, LO2", subsection: "AC2.3",
    locatorSummary: "AC2.3: identify appropriate electrical instruments for the measurement of different electrical quantities",
  },
  {
    key: "loc-cg-ac3.3", sourceVersionKey: SV_CG, page: "27",
    section: "Unit 202, LO3", subsection: "AC3.3",
    locatorSummary: "AC3.3: describe the main principles of force, work, energy, power and efficiency and their inter-relationships",
  },
  {
    key: "loc-cg-ac3.4", sourceVersionKey: SV_CG, page: "27",
    section: "Unit 202, LO3", subsection: "AC3.4",
    locatorSummary: "AC3.4: calculate values of mechanical energy, power and efficiency",
  },
  {
    key: "loc-cg-ac4.1", sourceVersionKey: SV_CG, page: "27",
    section: "Unit 202, LO4", subsection: "AC4.1",
    locatorSummary: "AC4.1: describe the basic principles of electron theory",
  },
  {
    key: "loc-cg-ac4.2", sourceVersionKey: SV_CG, page: "27",
    section: "Unit 202, LO4", subsection: "AC4.2",
    locatorSummary: "AC4.2: identify and distinguish between materials which are good conductors and insulators",
  },
  {
    key: "loc-cg-ac4.3", sourceVersionKey: SV_CG, page: "27",
    section: "Unit 202, LO4", subsection: "AC4.3",
    locatorSummary: "AC4.3: describe what is meant by resistance and resistivity in relation to electrical circuits",
  },
  {
    key: "loc-cg-ac4.4", sourceVersionKey: SV_CG, page: "27",
    section: "Unit 202, LO4", subsection: "AC4.4",
    locatorSummary: "AC4.4: explain the relationship between current, voltage and resistance in parallel and series D.C. circuits",
  },
  {
    key: "loc-cg-ac4.5", sourceVersionKey: SV_CG, page: "27",
    section: "Unit 202, LO4", subsection: "AC4.5",
    locatorSummary: "AC4.5: calculate the values of current, voltage and resistance in parallel and series D.C. circuits",
  },
  {
    key: "loc-cg-ac4.6", sourceVersionKey: SV_CG, page: "27",
    section: "Unit 202, LO4", subsection: "AC4.6",
    locatorSummary: "AC4.6: calculate values of power in parallel and series D.C. circuits",
  },
  {
    key: "loc-cg-ac4.7", sourceVersionKey: SV_CG, page: "27",
    section: "Unit 202, LO4", subsection: "AC4.7",
    locatorSummary: "AC4.7: state what is meant by the term voltage drop in relation to electrical circuits",
  },
  {
    key: "loc-cg-ac4.8", sourceVersionKey: SV_CG, page: "27",
    section: "Unit 202, LO4", subsection: "AC4.8",
    locatorSummary: "AC4.8: describe the chemical and thermal effects of electric currents",
  },
  {
    key: "loc-cg-ac5.1", sourceVersionKey: SV_CG, page: "28",
    section: "Unit 202, LO5", subsection: "AC5.1",
    locatorSummary: "AC5.1: describe the effects of magnetism in terms of attraction and repulsion",
  },
  {
    key: "loc-cg-ac5.2", sourceVersionKey: SV_CG, page: "28",
    section: "Unit 202, LO5", subsection: "AC5.2",
    locatorSummary: "AC5.2: state the difference between magnetic flux and flux density",
  },
  {
    key: "loc-cg-ac5.3", sourceVersionKey: SV_CG, page: "28",
    section: "Unit 202, LO5", subsection: "AC5.3",
    locatorSummary: "AC5.3: describe the magnetic effects of electrical currents in terms of production of a magnetic field, force on a current-carrying conductor, electromagnetism and electromotive force",
  },
  {
    key: "loc-cg-ac5.4", sourceVersionKey: SV_CG, page: "28",
    section: "Unit 202, LO5", subsection: "AC5.4",
    locatorSummary: "AC5.4: describe the basic principles of generating an A.C. supply in terms of a single-loop generator, sine-wave, frequency, EMF and magnetic flux",
  },
  {
    key: "loc-cg-ac5.5", sourceVersionKey: SV_CG, page: "28",
    section: "Unit 202, LO5", subsection: "AC5.5",
    locatorSummary: "AC5.5: identify the characteristics of sine-waves (RMS value, average value, peak-to-peak value, periodic time, frequency, amplitude)",
  },
  {
    key: "loc-cg-ac6.1", sourceVersionKey: SV_CG, page: "29",
    section: "Unit 202, LO6", subsection: "AC6.1",
    locatorSummary: "AC6.1: describe the function and application of electronic components that are used in electrical systems (security alarms, telephones, dimmer switches, heating/boiler controls, motor control, wireless control systems)",
  },
  {
    key: "loc-cg-ac6.2", sourceVersionKey: SV_CG, page: "29",
    section: "Unit 202, LO6", subsection: "AC6.2",
    locatorSummary: "AC6.2: state the basic operating principles of electronic components and devices (capacitors, resistors, rectifiers, diodes, zener, LED, photo, thermistors, diacs, triacs, transistors, thyristors, invertors)",
  },
  {
    key: "loc-cg-ac3.1", sourceVersionKey: SV_CG, page: "27",
    section: "Unit 202, LO3", subsection: "AC3.1",
    locatorSummary: "AC3.1: specify what is meant by mass and weight",
  },
  {
    key: "loc-cg-ac3.2", sourceVersionKey: SV_CG, page: "27",
    section: "Unit 202, LO3", subsection: "AC3.2",
    locatorSummary: "AC3.2: explain the principles of basic mechanics as they apply to levers, gears and pulleys (Range: levers class I, class II, class III)",
  },
  {
    key: "loc-cg-ac1.1", sourceVersionKey: SV_CG, page: "25",
    section: "Unit 202, LO1", subsection: "AC1.1",
    locatorSummary: "AC1.1: identify and apply appropriate mathematical principles which are relevant to electrical work tasks (Range: fractions and percentages, algebra, indices, transposition, triangles and trigonometry, statistics)",
  },
  {
    key: "loc-cg-ac2.1", sourceVersionKey: SV_CG, page: "26",
    section: "Unit 202, LO2", subsection: "AC2.1",
    locatorSummary: "AC2.1: identify and use internationally recognised base and derived (SI) units of measurement (Range: length, area, volume, mass, density, time, temperature, velocity)",
  },
  {
    key: "loc-cg-ac2.3-power-energy", sourceVersionKey: SV_CG, page: "26",
    section: "Unit 202, LO2", subsection: "AC2.3",
    locatorSummary: "AC2.3: identify appropriate electrical instruments for the measurement of different electrical quantities (Range: electrical quantities (measurement) -- resistance, power, current, voltage, energy)",
  },

  // -- CC-09B: BIPM SI Brochure, generic (non-electrical) SI quantities
  // required by LO2 AC2.1's own Range (length/area/volume/mass/density/
  // time/temperature/velocity) --
  {
    key: "loc-bipm-base-units-table",
    sourceVersionKey: SV_BIPM,
    section: "Table 1", subsection: "The seven SI base units",
    locatorSummary: "SI Brochure Table 1: the seven SI base units, including the metre (length), kilogram (mass), second (time) and kelvin (thermodynamic temperature)",
  },
  {
    key: "loc-bipm-coherent-derived-units-table",
    sourceVersionKey: SV_BIPM,
    section: "Table 3", subsection: "Examples of coherent derived units expressed in terms of base units",
    locatorSummary: "SI Brochure Table 3: examples of SI coherent derived units expressed in terms of base units, including area (square metre), volume (cubic metre), speed/velocity (metre per second) and density (kilogram per cubic metre)",
  },
  {
    key: "loc-bipm-celsius",
    sourceVersionKey: SV_BIPM,
    section: "2.3.3", subsection: "The degree Celsius",
    locatorSummary: "SI Brochure 2.3.3: the degree Celsius, a special name for the kelvin used to express Celsius temperature",
  },

  // -- CC-09B: DfE GCSE Mathematics, LO1 range items with no existing FM
  // assertion (indices, triangles and trigonometry, statistics) --
  {
    key: "loc-dfe-algebra-indices",
    sourceVersionKey: SV_DFE_MATHS,
    section: "Subject content", subsection: "Algebra, Notation/vocabulary/manipulation, item 4", page: "6",
    locatorSummary: "Algebra: simplify and manipulate algebraic expressions... simplifying expressions involving sums, products and powers, including the laws of indices",
  },
  {
    key: "loc-dfe-number-indices",
    sourceVersionKey: SV_DFE_MATHS,
    section: "Subject content", subsection: "Number, item 7", page: "5",
    locatorSummary: "Number: calculate with roots, and with integer and fractional indices",
  },
  {
    key: "loc-dfe-geometry-pythagoras-trig",
    sourceVersionKey: SV_DFE_MATHS,
    section: "Subject content", subsection: "Geometry and measures, Mensuration and calculation, item 20", page: "10",
    locatorSummary: "Geometry and measures: know the formulae for Pythagoras' theorem a^2 + b^2 = c^2, and the trigonometric ratios sin(theta) = opposite/hypotenuse, cos(theta) = adjacent/hypotenuse and tan(theta) = opposite/adjacent; apply them to find angles and lengths in right-angled triangles",
  },
  {
    key: "loc-dfe-statistics-central-tendency-spread",
    sourceVersionKey: SV_DFE_MATHS,
    section: "Subject content", subsection: "Statistics, item 4", page: "11-12",
    locatorSummary: "Statistics: interpret, analyse and compare distributions of data sets through appropriate measures of central tendency (median, mean, mode and modal class) and spread (range, including consideration of outliers, quartiles and inter-quartile range)",
  },

  // -- CC-09B: OpenStax University Physics Volume 1, LO3 AC3.2 (levers) --
  {
    key: "loc-openstax-up1-torque-levers",
    sourceVersionKey: SV_OPENSTAX_UP1,
    section: "Chapter 12", subsection: "12.1 Conditions for Static Equilibrium / 12.2 Examples of Static Equilibrium",
    locatorSummary: "Static equilibrium: a lever's mechanical advantage from the balance of torques (force times lever-arm distance) about a pivot, the physical basis distinguishing lever classes by the relative arrangement of pivot, effort and load",
  },

  // -- CC-09B: OpenStax University Physics Volume 3, LO6 diode physics --
  {
    key: "loc-openstax-up3-semiconductor-diode",
    sourceVersionKey: SV_OPENSTAX_UP3,
    section: "9.7", subsection: "Semiconductor Devices -- Diodes",
    locatorSummary: "A p-n junction diode's depletion layer narrows under forward bias (allowing current to flow easily) and widens under reverse bias (significantly reducing current flow), giving the diode its one-way-conduction behaviour",
  },

  // -- CC-09B: Kuphaldt, Electric Circuits III -- Semiconductors (LibreTexts) --
  {
    key: "loc-kuphaldt-rectifier-circuits",
    sourceVersionKey: SV_KUPHALDT_SEMICONDUCTORS,
    section: "Chapter 3, Diodes and Rectifiers", subsection: "3.4 Rectifier Circuits",
    locatorSummary: "A rectifier circuit uses one or more diodes to convert an alternating-current input into a direct-current (or pulsating direct-current) output",
  },
  {
    key: "loc-kuphaldt-zener-diodes",
    sourceVersionKey: SV_KUPHALDT_SEMICONDUCTORS,
    section: "Chapter 3, Diodes and Rectifiers", subsection: "3.11 What Are Zener Diodes?",
    locatorSummary: "A Zener diode is a special-purpose diode designed to operate in reverse breakdown at a well-defined breakdown voltage without being damaged, so it maintains a substantially constant voltage across itself and can be used to regulate voltage",
  },
  {
    key: "loc-kuphaldt-special-purpose-diodes",
    sourceVersionKey: SV_KUPHALDT_SEMICONDUCTORS,
    section: "Chapter 3, Diodes and Rectifiers", subsection: "3.12 Special-purpose Diodes",
    locatorSummary: "A light-emitting diode (LED) produces light by electroluminescence when forward-biased (recombination of electrons and holes in the junction yields photons); a photodiode is optimised to generate a photocurrent in response to incident light",
  },
  {
    key: "loc-kuphaldt-bjt-intro",
    sourceVersionKey: SV_KUPHALDT_SEMICONDUCTORS,
    section: "Chapter 4, Bipolar Junction Transistors", subsection: "4.1 Introduction to Bipolar Junction Transistors (BJT)",
    locatorSummary: "A bipolar junction transistor is a three-terminal semiconductor device whose collector-emitter current is controlled by a much smaller base current, allowing it to act as an electrically controlled switch or amplifier",
  },
  {
    key: "loc-kuphaldt-bjt-switch",
    sourceVersionKey: SV_KUPHALDT_SEMICONDUCTORS,
    section: "Chapter 4, Bipolar Junction Transistors", subsection: "4.2 The Bipolar Junction Transistor (BJT) as a Switch",
    locatorSummary: "With no base current, a bipolar junction transistor behaves like an open switch and blocks collector current; sufficient base current drives it into saturation, behaving like a closed switch",
  },
  {
    key: "loc-kuphaldt-diac",
    sourceVersionKey: SV_KUPHALDT_SEMICONDUCTORS,
    section: "Chapter 7, Thyristors", subsection: "7.4 The DIAC",
    locatorSummary: "A DIAC is a bidirectional thyristor formed from two Shockley diodes joined in antiparallel: it remains a high-impedance non-conducting device until the voltage across it exceeds its breakover voltage, at which point it switches into conduction; DIACs are almost never used alone, but in conjunction with other thyristor devices",
  },
  {
    key: "loc-kuphaldt-scr",
    sourceVersionKey: SV_KUPHALDT_SEMICONDUCTORS,
    section: "Chapter 7, Thyristors", subsection: "7.5 The Silicon-Controlled Rectifier (SCR)",
    locatorSummary: "A silicon-controlled rectifier (SCR) conducts current in one direction once a sufficient gate current triggers it on, and continues conducting until the anode-to-cathode current falls below the device's holding current; SCRs are more commonly seen in circuits like motor drives",
  },
  {
    key: "loc-kuphaldt-triac",
    sourceVersionKey: SV_KUPHALDT_SEMICONDUCTORS,
    section: "Chapter 7, Thyristors", subsection: "7.6 The TRIAC",
    locatorSummary: "A TRIAC acts much like two SCRs connected back-to-back for bidirectional (AC) operation, triggered by gate current from the main-terminal-2 side; TRIACs are usually seen in simple, low-power applications like household dimmer switches",
  },

  // -- CC-09B: Vishay NTC thermistor application note, LO6 --
  {
    key: "loc-vishay-ntc-principle",
    sourceVersionKey: SV_VISHAY_NTC,
    section: "NTC Thermistors Application Note",
    locatorSummary: "An NTC (negative temperature coefficient) thermistor's electrical resistance decreases as its temperature increases; applications include temperature sensing/measurement, inrush-current limiting and temperature compensation",
  },

  // -- CC-09B: University of Ottawa ELG4139 course material, LO6 invertors --
  {
    key: "loc-uottawa-inverter-principle",
    sourceVersionKey: SV_UOTTAWA_INVERTERS,
    section: "ELG4139: DC to AC Converters", subsection: "Introduction",
    locatorSummary: "An inverter converts DC to AC power by switching the DC input voltage (or current) in a pre-determined sequence so as to generate an AC voltage (or current) output",
  },

  // -- CC-09B.1 audit-correction locators --
  {
    key: "loc-ti-inverter-principle",
    sourceVersionKey: SV_TI_INVERTERS,
    section: "SLAA602A", subsection: "Introduction / overview",
    locatorSummary: "A DC-to-AC power inverter converts a DC source into an AC output using electronic switching circuits (e.g. an H-bridge/full-bridge of transistors or MOSFETs) that repeatedly reverse the polarity of the DC input at a controlled frequency to produce an AC waveform",
  },
  {
    key: "loc-openstax-up1-gravitational-potential-energy",
    sourceVersionKey: SV_OPENSTAX_UP1,
    section: "Chapter 8", subsection: "8.1 Potential Energy of a System",
    locatorSummary: "Gravitational potential energy near Earth's surface is calculated as GPE = mgh, where m is mass, g is gravitational field strength and h is height above a reference level",
  },
  {
    key: "loc-openstax-up2-electrical-measuring-instruments",
    sourceVersionKey: SV_OPENSTAX_UP2,
    section: "Chapter 10", subsection: "10.4 Electrical Measuring Instruments",
    locatorSummary: "A voltmeter is placed in parallel and must have very high (ideally infinite) resistance so it does not alter the circuit; an ammeter is placed in series and must have very low (ideally zero) resistance for the same reason; an ohmmeter must never be connected to a live (energised) circuit",
  },
  {
    key: "loc-openstax-college-physics-simple-machines",
    sourceVersionKey: SV_OPENSTAX_COLLEGE_PHYSICS,
    section: "Chapter 9", subsection: "9.5 Simple Machines",
    // CC-09B.2 correction (task section 14): the Project Architect's audit
    // found this locator's own summary overstated what section 9.5 itself
    // establishes -- it directly gives the MA-as-radius-ratio relationship
    // for wheels/gears and both pulley facts, but does NOT itself state
    // tooth-count equivalence or a speed/torque trade-off (independently
    // re-inspected: the section reads "Wheels and gears have this simple
    // expression for their MAs too" [MA = ri/r0], with no tooth-count or
    // torque/speed language). Those two propositions now cite
    // loc-ucsd-gear-ratio-tooth-count-torque instead -- this summary no
    // longer claims them.
    locatorSummary: "For wheels/gears driven by a common axle, mechanical advantage is the ratio of the radii of the driving and driven wheel/gear (the same simple expression as for a crank); a single fixed pulley has a mechanical advantage of 1 (direction change only, forces do not add); a movable/combination pulley system's mechanical advantage approximately equals the number of rope/cable sections directly supporting the load, demonstrated for MA of 2, 3 and 4",
  },
  {
    key: "loc-kuphaldt-dc-resistors",
    sourceVersionKey: SV_KUPHALDT_DC_CIRCUITS,
    section: "Chapter 2, Ohm's Law", subsection: "2.5 Resistors",
    locatorSummary: "A resistor is a component manufactured to provide a specific, stable value of resistance, used in circuits to limit current or to divide voltage",
  },
  // -- CC-09B.2 (source-first evidence hardening) new locators --
  {
    key: "loc-ucsd-gear-ratio-tooth-count-torque",
    sourceVersionKey: SV_UCSD_GEAR_RATIOS,
    section: "Gear Ratios",
    locatorSummary: "Because the radius of a gear is proportional to its number of teeth, gear-ratio relationships can equivalently be stated in terms of tooth counts: omega_out/omega_in = n_in/n_out (speed) and tau_out/tau_in = n_out/n_in (torque); \"a gear ratio can increase the output torque or output speed of a mechanism, but not both\" -- with a given power source you can achieve high velocity output or high force/torque output, but not both",
  },
  {
    key: "loc-nist-hb44-active-energy",
    sourceVersionKey: SV_NIST_HB44,
    section: "Appendix D, Definitions", subsection: "active energy", page: "3-183",
    locatorSummary: "Active energy: the integral of active power with respect to time, typically measured in kilowatt-hours (kWh) or watt-hours; E(T) = integral from 0 to T of v(t) times i(t) dt, where T is much greater than the AC line period",
  },
  {
    key: "loc-nist-hb44-power-factor",
    sourceVersionKey: SV_NIST_HB44,
    section: "Appendix D, Definitions", subsection: "power factor (PF)", page: "3-186",
    locatorSummary: "Power factor (PF): the ratio of \"active power\" to \"apparent power\" in an AC circuit; it describes the efficient use of available power",
  },
  {
    key: "loc-nist-hb44-element",
    sourceVersionKey: SV_NIST_HB44,
    section: "Appendix D, Definitions", subsection: "element", page: "3-184",
    locatorSummary: "Element: a combination of a voltage-sensing unit and a current-sensing unit, which provides an output proportional to the quantities measured; meters can include multiple elements",
  },
  {
    key: "loc-indus-uni-wattmeter-circuit",
    sourceVersionKey: SV_INDUS_UNI_WATTMETER,
    section: "2 Wattmeter",
    locatorSummary: "A wattmeter is an inherent combination of an ammeter and a voltmeter, with a current coil (CC) connected in series with the load so it carries the load current, and a potential coil (PC) connected in parallel with the load so it carries a current proportional to the load voltage",
  },
  {
    key: "loc-kuphaldt-dc-multimeters",
    sourceVersionKey: SV_KUPHALDT_DC_CIRCUITS,
    section: "Chapter 8, DC Metering Circuits", subsection: "Multimeters",
    locatorSummary: "A single meter movement can be made to function as a voltmeter, ammeter or ohmmeter by connecting it to different external resistor networks and switch positions; a multi-purpose meter (\"multimeter\") can be designed in one unit with the appropriate switch(es) and resistors",
  },
  {
    key: "loc-kuphaldt-dc-ohmmeter-continuity",
    sourceVersionKey: SV_KUPHALDT_DC_CIRCUITS,
    section: "Chapter 8, DC Metering Circuits", subsection: "Ohmmeter design",
    locatorSummary: "With the leads shorted (zero ohms) the meter movement carries maximum current and the needle deflects fully; with infinite resistance between the leads there is zero current and the needle stays at the far left -- so a low-resistance (near full-scale-deflection) reading confirms a continuous path; ohmmeters must never be connected to an energised circuit, since their accurate indication depends on the only voltage source being the ohmmeter's own internal battery",
  },
  {
    key: "loc-openstax-up2-capacitor-charge-energy",
    sourceVersionKey: SV_OPENSTAX_UP2,
    section: "Chapter 8, Capacitance", subsection: "8.1 Capacitors and Capacitance; 8.3 Energy Stored in a Capacitor",
    locatorSummary: "A capacitor is a device used to store electrical charge and electrical energy: charge Q moves from one conductive plate to the other, creating equal and opposite charges on each plate and an electric field between them; a charged capacitor stores energy in that electric field, expressed as U = (1/2)CV^2 = (1/2)Q^2/C = (1/2)QV",
  },
  {
    key: "loc-openstax-up2-rc-circuits",
    sourceVersionKey: SV_OPENSTAX_UP2,
    section: "Chapter 10, DC Circuits", subsection: "10.5 RC Circuits",
    locatorSummary: "In a circuit with resistance, a capacitor's voltage rises or falls exponentially rather than instantaneously: charging, Vc(t) = epsilon(1 - e^(-t/tau)); discharging, q(t) = Q e^(-t/tau); with time constant tau = RC, the capacitor reaches only 63.2% of its final change after one time constant, demonstrating gradual (not sudden) voltage change",
  },
  {
    key: "loc-vishay-ntc-heating-applications",
    sourceVersionKey: SV_VISHAY_NTC,
    section: "Applications; Examples", subsection: "Industrial/domestic application list (p.1); Fig. 4 boiler sensor response, Fig. 16 simple thermostat (pp.5, 10)",
    locatorSummary: "NTC temperature sensors' listed applications include \"heating and ventilation\" (industrial) and \"central-heating systems\" (domestic); Fig. 4 shows the typical response (about 4s) of a boiler sensor transitioning from 25C to 100C; Fig. 16 shows a simple thermostat circuit using an NTC sensor and a relay to switch a heating load off/on at set temperatures",
  },
  {
    key: "loc-seco-larm-beam-sensor-alarm",
    sourceVersionKey: SV_SECO_LARM_BEAM_SENSOR,
    section: "Overview; Wiring Diagram", subsection: "product description and Trigger output specification",
    locatorSummary: "The ENFORCER E-931-S33PRGQ photoelectric beam sensor (IR LED, wavelength 740nm, plus a photoelectric receiver) provides reliable sensing of objects breaking the infrared beam, and is suitable for \"an alarm notification, as well as many other uses\"; its SPDT relay trigger output is wired to an alarm control panel (the N.C. tamper terminal connects to the tamper circuit of an alarm control panel); a caution notes use in certain security applications may be regulated by local laws",
  },
  // -- CC-09B.3 locators --
  {
    key: "loc-skyworks-an347-bridge-diode",
    sourceVersionKey: SV_SKYWORKS_DAA_DESIGN_GUIDE,
    section: "2.2 Typical DAA Application Schematics; 3.3.1 Isolation Barrier",
    subsection: "Figure 2 (Typical Si3018 Based DAA Application Circuit); Figure 29 (SELV, TNV-3 and Isolation Barrier)",
    locatorSummary: "Figure 2 shows a diode-bridge symbol (D1) wired directly into the line-side circuitry of a real telephone-line interface (DAA) application circuit; Figure 29's block diagram explicitly labels a \"Bridge Diode\" block connected directly to the telephone line's TIP and RING terminals, positioned within the TNV-3 (Telecommunications Network Voltage) circuit area between the line-side device/discretes and the telephone line itself",
  },
  {
    key: "loc-holtek-ht12d-applications",
    // CC-09B.4: retargeted to the current official Rev. 1.40 snapshot
    // (SV_HOLTEK_HT12D_2022) -- content re-verified identical (same
    // Applications list, same General Description wording) to the
    // superseded Rev. 1.10 this locator originally cited.
    sourceVersionKey: SV_HOLTEK_HT12D_2022,
    section: "Features; Applications; General Description; Application Circuits",
    locatorSummary: "HT12D/HT12F 2^12 series decoder ICs' own \"Applications\" list names: burglar alarm system, smoke and fire alarm system, garage door controllers, car door controllers, car alarm system, security system, cordless telephones, other remote control systems; \"Easy interface with an RF or an infrared transmission medium\"; General Description: \"the 12-N bits of data are decoded to activate the output pins\" once the received address matches; the Application Circuits figure shows the decoder wired to a \"Receiver Circuit\" (antenna symbol) with its CMOS output pins (D8-D11) driving external outputs",
  },
  // -- CC-09B.4 (retroactive source-first provenance migration) locators.
  // Each replaces a previous generic "loc-openstax-up2-current-general"
  // (Ch.9 introduction) citation that did not itself establish the
  // specific claim it was attached to (task section 2). --
  {
    key: "loc-openstax-chemistry-electrolysis",
    sourceVersionKey: SV_OPENSTAX_CHEMISTRY,
    section: "Chapter 17, Electrochemistry", subsection: "17.7 Electrolysis",
    locatorSummary: "Electrolysis: \"an external circuit does work on a redox system by imposing a voltage sufficient to drive an otherwise nonspontaneous reaction\" -- i.e. an externally applied electric current/voltage forces a chemical change (a redox reaction) in an electrolyte that would not occur spontaneously",
  },
  {
    key: "loc-openstax-up2-resistivity-table-materials",
    sourceVersionKey: SV_OPENSTAX_UP2,
    section: "Chapter 9", subsection: "9.3 Resistivity and Resistance, Table 9.1 (Resistivities and Conductivities of Various Materials at 20C)",
    locatorSummary: "Table 9.1 lists real named materials by category: conductors include silver, copper, gold, aluminum, tungsten, iron, platinum, steel, lead; insulators include amber, glass, Lucite, mica, quartz (fused), rubber (hard), sulfur, Teflon, wood -- with resistivity/conductivity values for each",
  },
  {
    key: "loc-prysmian-6242y-construction",
    sourceVersionKey: SV_PRYSMIAN_6242Y,
    section: "Construction; Key Applications",
    locatorSummary: "Prysmian 6242Y (BS 6004, 300/500V, \"suitable for fixed installation in industrial, commercial and domestic premises\"): Conductor material = Copper; Core insulation material = Polyvinyl chloride (PVC); Material outer sheath = Polyvinyl chloride (PVC)",
  },
  {
    key: "loc-openstax-up2-dielectric-breakdown",
    sourceVersionKey: SV_OPENSTAX_UP2,
    section: "Chapter 8, Capacitance", subsection: "8.5 Molecular Model of a Dielectric",
    locatorSummary: "\"The critical value, Ec, of the electrical field at which the molecules of an insulator become ionized is called the dielectric strength of the material... When this happens, the material can conduct, thereby allowing charge to move through the dielectric... This phenomenon is called dielectric breakdown.\" \"The dielectric strength imposes a limit on the voltage that can be applied for a given plate separation\"",
  },
  {
    key: "loc-fluke-clamp-meter-principle",
    sourceVersionKey: SV_FLUKE_CLAMP_METERS,
    section: "The ABCs of Clamp Meters",
    locatorSummary: "\"The integration of a hinged jaw into an electrical meter enables technicians to securely clamp around a wire, cable, or conductor at any point in an electrical system, facilitating current measurement in the circuit without the need for disconnection or de-energization\"; the jaws \"consist of ferrite iron and are engineered to detect, concentrate, and measure the magnetic field generated by current as it flows through a conductor\"",
  },
  {
    key: "loc-openstax-up2-fuse-breaker-mechanism",
    sourceVersionKey: SV_OPENSTAX_UP2,
    section: "Chapter 9", subsection: "9.5 Electrical Energy and Power",
    locatorSummary: "Fuse: \"a device that protects a circuit from currents that are too high... The piece of wire in the fuse is under tension and has a low melting point. The wire is designed to heat up and break at the rated current.\" Circuit breaker: \"also rated for a maximum current, and open to protect the circuit, but can be reset. Circuit breakers react much faster.\" Also discusses resistive heating in light bulbs/resistors (\"electrical energy supplied to the light bulbs is converted into heat and light\")",
  },
  {
    key: "loc-openstax-up2-household-wiring-safety",
    sourceVersionKey: SV_OPENSTAX_UP2,
    section: "Chapter 10, Direct-Current Circuits", subsection: "10.6 Household Wiring and Electrical Safety",
    locatorSummary: "\"Fuses and circuit breakers are used to limit excessive currents\" that would otherwise overheat wiring -- the general purpose of a protective device (automatic disconnection above a safe current) in a real household/installation safety context",
  },
  {
    // CC-09B.6 (task section 9): a more precise subsection of the same
    // already-cited OpenStax UP2 Ch.12 source, re-inspected directly for
    // this specific proposition (independently confirmed: "the direction
    // of the magnetic field created by a long straight wire is given by
    // right-hand rule 2 (RHR-2): point the thumb... in the direction of
    // current, and the fingers curl in the direction of the magnetic
    // field").
    key: "loc-openstax-up2-straight-wire-field-direction",
    sourceVersionKey: SV_OPENSTAX_UP2,
    section: "Chapter 12", subsection: "12.2 Magnetic Field due to a Thin Straight Wire",
    locatorSummary: "The direction of the magnetic field created by a long straight current-carrying wire is given by the right-hand rule: point the thumb of the right hand in the direction of current flow, and the curled fingers give the direction of the circular magnetic field loops around the wire",
  },
  // -- CC-09B.6 (official teaching-material reconciliation) new locators.
  // Only genuinely NEW facts (confirmed missing from the corpus by
  // comparison against the official 2365-202 SmartScreen handouts) needed
  // a genuinely new source; median/mode, lever-balance and pulley
  // force-distance already reuse existing, already-inspected locators
  // (see their own assertions below). --
  {
    key: "loc-vishay-ptcel-principle",
    sourceVersionKey: SV_VISHAY_PTC,
    section: "Description; Quick Reference Data", page: "1",
    locatorSummary: "\"These directly heated ceramic-based doped barium titanate thermistors have a positive temperature coefficient and are primarily intended for inrush current limiting and overload protection\"; Quick Reference Data lists a \"Switching temperature\" of 130-140C, above which resistance rises sharply -- confirming PTC resistance increases (rather than decreases, as with NTC) with rising temperature",
  },
  {
    key: "loc-firgelli-gear-idler-direction",
    sourceVersionKey: SV_FIRGELLI_GEAR_TRAIN,
    section: "Gear Train Mechanism Explained",
    locatorSummary: "Meshed gear teeth apply tangential forces at the pitch line such that if the driver gear turns clockwise, the driven gear is forced to turn anticlockwise -- meshed gears always rotate in opposite directions; \"An idler sits between driver and driven without changing the overall ratio -- its tooth count cancels out -- but it reverses output direction\"",
  },
  {
    key: "loc-wikipedia-telephone-master-socket-components",
    sourceVersionKey: SV_WIKIPEDIA_BRITISH_TELEPHONE_SOCKETS,
    section: "Sockets", subsection: "Master socket (NTE5/LJU) component description, citing BS 6312 and BT SIN 351/352",
    locatorSummary: "\"The socket includes a 1.8 uF capacitor (bell circuit) to feed the AC ringing and a 470 k-ohm resistor (R1, out-of-service resistor) to permit remote testing when no telephones are plugged into any sockets\"; older master sockets also contained an enclosed spark-gap surge protector (SP1); secondary/extension sockets, wired in parallel off the master socket, contain none of these components",
  },
  {
    key: "loc-elprocus-thyristor-sensor-alarm",
    sourceVersionKey: SV_ELPROCUS_THYRISTOR_ALARM,
    section: "Thyristor Based Sensor Alarm System, Working and Applications",
    locatorSummary: "Describes a thyristor-based sensor-alarm circuit in which closing/triggering a sensor switch gates the thyristor on; the thyristor then latches (\"thyristors 'latch' in the on state... and stay on after the gate pulse is detached until they are reverse biased\") so the alarm continues even after the triggering sensor condition ends, until the circuit is deliberately reset",
  },
  // -- CC-09B.6 (adversarial gap review, task section 30) locators: two
  // genuine AC5.3 gaps found by an independent read-only critique, exact
  // structural analogues of the Maxwell's-screw-rule fix already made
  // under the same AC. --
  {
    key: "loc-openstax-up2-force-on-conductor-magnitude",
    sourceVersionKey: SV_OPENSTAX_UP2,
    section: "Chapter 11", subsection: "11.4 Magnetic Force on a Current-Carrying Conductor",
    locatorSummary: "\"F = I l x B. This is the force on a straight, current-carrying wire in a uniform magnetic field\" -- the magnitude relationship F = B I l (for a conductor perpendicular to the field); direction is given by \"RHR-1, where you point your fingers in the direction of the current and curl them toward the field; your thumb then points in the direction of the force\"",
  },
  {
    key: "loc-wikipedia-flemings-left-hand-rule",
    sourceVersionKey: SV_WIKIPEDIA_FLEMING_LEFT_HAND,
    section: "Fleming's left-hand rule for motors",
    locatorSummary: "\"The Thumb represents the direction of the Motion (Force) of the conductor. The Fore finger represents the direction of the magnetic Field. The Centre finger represents the direction of the Current\" -- the UK vocational-trade naming/mnemonic for the same force-direction rule OpenStax states as RHR-1, citing Fleming, John Ambrose (1902), Magnets and Electric Currents, 2nd ed., pp.173-174",
  },
  {
    key: "loc-openstax-up2-motional-emf",
    sourceVersionKey: SV_OPENSTAX_UP2,
    section: "Chapter 13", subsection: "13.3 Motional Emf",
    locatorSummary: "\"epsilon = Blv\" (Equation 13.5) -- the motional EMF induced in a conductor of length l moving at velocity v perpendicular to a magnetic field of flux density B, derived directly from Faraday's law (epsilon = dPhi_m/dt = B l dx/dt = B l v)",
  },
  {
    key: "loc-wikipedia-flemings-right-hand-rule",
    sourceVersionKey: SV_WIKIPEDIA_FLEMING_RIGHT_HAND,
    section: "Fleming's right-hand rule",
    locatorSummary: "\"The thumb is pointed in the direction of the motion of the conductor relative to the magnetic field. The first finger is pointed in the direction of the magnetic field... the second finger represents the direction of the induced or generated current\" -- the UK vocational-trade naming/mnemonic for generator induced-current direction, citing Hughes, Edward (2016), Electrical and Electronic Technology",
  },
  {
    // CC-09B.6 (adversarial gap review, task section 30): the official
    // SmartScreen handout (Handouts 4-5, 7) names and proves both laws
    // explicitly with worked examples; the underlying arithmetic (series
    // voltage-drops sum to supply, parallel branch-currents sum to total)
    // was already governed, but never NAMED -- preserves the recognisable
    // exam terminology (task section 10), reusing the same already-cited
    // Kuphaldt DC-circuits source (its own Chapter 6 is titled "Divider
    // Circuits and Kirchhoff's Laws").
    key: "loc-kuphaldt-kirchhoffs-laws",
    sourceVersionKey: SV_KUPHALDT_DC_CIRCUITS,
    section: "Chapter 6, Divider Circuits and Kirchhoff's Laws",
    locatorSummary: "Kirchhoff's Voltage Law (KVL): \"the algebraic sum of all voltages in a loop must equal zero\"; Kirchhoff's Current Law (KCL): \"the algebraic sum of all currents entering and exiting a node must equal zero\" -- \"these Laws deserve to be memorized by the electronics student every bit as much as Ohm's Law\"",
  },
];

// ---------------------------------------------------------------------
// Assertions
// ---------------------------------------------------------------------

interface ProvenanceSpec {
  locator: string;
  role: ProvenanceRole;
  /**
   * CC-09B.2 (source-first evidence hardening): whether the cited
   * locator's actual inspected evidence supports this assertion's WHOLE
   * material proposition (DIRECT) or only PART of it. Optional and left
   * unset on most pre-existing links -- this package classifies the
   * specific links it audited/corrected, not a retroactive re-audit of
   * links CC-04A through CC-09B.1 already passed review with (a tracked,
   * honestly-reported backlog, see PROJECT-STATUS.md CC-09B.2). A PARTIAL
   * link is a signal to narrow/split the assertion or add a further
   * source, never a final resting state.
   */
  supportType?: "DIRECT" | "PARTIAL";
}

interface PrereqSpec {
  id: string;
  strength?: Strength;
}

interface CurriculumSpec {
  node: string;
  type: "REQUIRED_FOR" | "SUPPORTS" | "EXEMPLIFIES" | "ASSESSED_UNDER";
}

interface AssertionDef {
  id: string;
  domain: "FM" | "FP" | "EL";
  statement: string;
  provenance: ProvenanceSpec[];
  prereqs?: PrereqSpec[];
  supports?: PrereqSpec[]; // this assertion SUPPORTS the named target(s)
  contrastsWith?: string[];
  derivedFrom?: string[];
  /**
   * CC-09B.2: required whenever `derivedFrom` is non-empty (enforced by
   * `buildRelationships` below, not merely documented). Applies uniformly
   * to every parent in `derivedFrom` -- in this corpus, an assertion's
   * DERIVED_FROM parents are always combined for one single mathematical
   * or logical consequence (e.g. substituting two relationships), never a
   * mix of independently-classified derivations, so one shared kind per
   * assertion is accurate, not a loss of precision. Only MATHEMATICAL and
   * LOGICAL_DEFINITIONAL may ever be used here -- an EMPIRICAL_APPLICATION
   * or INVALID_UNCLEAR derivation means the assertion must instead cite
   * real direct provenance (see derivationKindSchema in
   * packages/content-schema/src/knowledge-graph.ts).
   */
  derivedFromKind?: "MATHEMATICAL" | "LOGICAL_DEFINITIONAL";
  /**
   * CC-09B.3: set true only after actually re-inspecting every classified
   * (supportType-carrying) provenance link clause-by-clause and confirming
   * they jointly cover this assertion's WHOLE material proposition. Never
   * set merely because two PARTIAL links exist -- see the matching field
   * on assertionVersionManifestSchema for the full rule.
   */
  multiSourceFullyCovered?: boolean;
  /**
   * CC-09B.4: concise, auditable clause-by-clause evidence map for a
   * multi-source assertion -- see the matching field on
   * assertionVersionManifestSchema for the full rule.
   */
  clauseCoverage?: { clause: string; locator: string }[];
  curriculum?: CurriculumSpec[];
}

const A: AssertionDef[] = [
  // ===================================================================
  // Foundational Maths -- horizontal, reusable knowledge. CC-09B refines
  // (does not reverse) CC-04A/B's "never curriculum-mapped directly"
  // rule: an FM/FP assertion is curriculum-mapped ONLY where an official
  // Assessment Criterion or Range item asks for that generic knowledge AS
  // ITSELF (definitional/recognition content Unit 202 examines directly,
  // e.g. LO1's Mathematical Principles Range) -- never merely because a
  // vocational AC uses it instrumentally (e.g. Ohm's Law's use of
  // algebraic rearrangement, which remains PREREQUISITE_OF-only, exactly
  // as CC-04B established). See PROJECT-STATUS.md CC-09B for the full
  // rationale.
  // ===================================================================
  {
    id: "FM-ALG-INVERSE-OPS-MULT-001", domain: "FM",
    statement: "Multiplication and division are inverse operations: dividing by a non-zero number undoes multiplying by that number, and vice versa.",
    provenance: [{ locator: "loc-dfe-number-inverse-reciprocal", role: "DEFINES" }],
    curriculum: [{ node: rangeNode("1.1", "ALGEBRA"), type: "REQUIRED_FOR" }],
  },
  {
    id: "FM-ALG-INVERSE-OPS-ADD-001", domain: "FM",
    statement: "Addition and subtraction are inverse operations: subtracting a number undoes adding that number, and vice versa.",
    provenance: [{ locator: "loc-dfe-number-inverse-reciprocal", role: "DEFINES" }],
    curriculum: [{ node: rangeNode("1.1", "ALGEBRA"), type: "REQUIRED_FOR" }],
  },
  {
    id: "FM-ALG-EQUALITY-MULT-001", domain: "FM",
    statement: "In an equation, multiplying or dividing both sides by the same non-zero value preserves the equality between the two sides.",
    provenance: [{ locator: "loc-dfe-algebra-equations", role: "DEFINES" }],
    curriculum: [{ node: rangeNode("1.1", "ALGEBRA"), type: "REQUIRED_FOR" }],
  },
  {
    id: "FM-ALG-EQUALITY-ADD-001", domain: "FM",
    statement: "In an equation, adding or subtracting the same value from both sides preserves the equality between the two sides.",
    provenance: [{ locator: "loc-dfe-algebra-equations", role: "DEFINES" }],
    curriculum: [{ node: rangeNode("1.1", "ALGEBRA"), type: "REQUIRED_FOR" }],
  },
  {
    id: "FM-ALG-TRANSPOSE-MULT-001", domain: "FM",
    statement: "Given a relationship of the form a = b times c, rearrange it algebraically to make b or c the subject.",
    provenance: [{ locator: "loc-dfe-algebra-rearrange", role: "SUPPORTS" }],
    prereqs: [
      { id: "FM-ALG-INVERSE-OPS-MULT-001", strength: "REQUIRED" },
      { id: "FM-ALG-EQUALITY-MULT-001", strength: "REQUIRED" },
    ],
    curriculum: [{ node: rangeNode("1.1", "TRANSPOSITION"), type: "REQUIRED_FOR" }],
  },
  {
    id: "FM-ALG-TRANSPOSE-ADD-001", domain: "FM",
    statement: "Given a relationship of the form a = b + c, rearrange it algebraically to make b or c the subject.",
    provenance: [{ locator: "loc-dfe-algebra-rearrange", role: "SUPPORTS" }],
    prereqs: [
      { id: "FM-ALG-INVERSE-OPS-ADD-001", strength: "REQUIRED" },
      { id: "FM-ALG-EQUALITY-ADD-001", strength: "REQUIRED" },
    ],
    curriculum: [{ node: rangeNode("1.1", "TRANSPOSITION"), type: "REQUIRED_FOR" }],
  },
  {
    id: "FM-ALG-SUBSTITUTION-001", domain: "FM",
    statement: "Substitute known numerical values into a formula to calculate the value of the remaining unknown quantity.",
    provenance: [{ locator: "loc-dfe-algebra-substitution", role: "SUPPORTS" }],
    curriculum: [{ node: rangeNode("1.1", "TRANSPOSITION"), type: "SUPPORTS" }],
  },
  {
    id: "FM-ARITH-RECIPROCAL-001", domain: "FM",
    statement: "The reciprocal of a non-zero number is 1 divided by that number.",
    provenance: [{ locator: "loc-dfe-number-inverse-reciprocal", role: "DEFINES" }],
  },
  {
    id: "FM-ARITH-FRACTION-OPS-001", domain: "FM",
    statement: "Apply the four arithmetic operations (addition, subtraction, multiplication, division) to fractions, including proper and improper fractions.",
    provenance: [{ locator: "loc-dfe-number-fractions", role: "DEFINES" }],
    curriculum: [{ node: rangeNode("1.1", "FRACTIONS-PERCENTAGES"), type: "REQUIRED_FOR" }],
  },
  {
    id: "FM-ARITH-RECIPROCAL-SUM-001", domain: "FM",
    statement: "The reciprocal of a total formed from several parallel contributions can be found by summing the reciprocals of each individual contribution.",
    provenance: [{ locator: "loc-openstax-up2-series-parallel", role: "SUPPORTS" }],
    prereqs: [
      { id: "FM-ARITH-RECIPROCAL-001", strength: "REQUIRED" },
      { id: "FM-ARITH-FRACTION-OPS-001", strength: "STRONG" },
    ],
  },
  {
    id: "FM-ARITH-RECIPROCAL-INVERT-001", domain: "FM",
    statement: "Once the reciprocal of a total quantity has been calculated, take its reciprocal again to find the value of the total quantity itself.",
    provenance: [{ locator: "loc-openstax-up2-series-parallel", role: "SUPPORTS" }],
    prereqs: [{ id: "FM-ARITH-RECIPROCAL-001", strength: "REQUIRED" }],
  },
  {
    id: "FM-ARITH-PERCENTAGE-001", domain: "FM",
    statement: "A percentage expresses a quantity as a number of parts per hundred, and can be used to express one quantity as a proportion of another.",
    provenance: [{ locator: "loc-dfe-ratio-percentage", role: "DEFINES" }],
    curriculum: [{ node: rangeNode("1.1", "FRACTIONS-PERCENTAGES"), type: "REQUIRED_FOR" }],
  },
  {
    id: "FM-ALG-PROPORTION-DIRECT-001", domain: "FM",
    statement: "Two quantities are in direct proportion when one increases in the same ratio as the other.",
    provenance: [{ locator: "loc-dfe-ratio-proportion", role: "DEFINES" }],
    contrastsWith: ["FM-ALG-PROPORTION-INVERSE-001"],
  },
  {
    id: "FM-ALG-PROPORTION-INVERSE-001", domain: "FM",
    statement: "Two quantities are in inverse proportion when one increases in the same ratio as the other decreases.",
    provenance: [{ locator: "loc-dfe-ratio-proportion", role: "DEFINES" }],
  },
  {
    id: "FM-NUM-SI-PREFIX-001", domain: "FM",
    statement: "An SI prefix (such as milli-, kilo- or mega-) represents a fixed power-of-ten scale factor applied to a base or derived unit.",
    provenance: [{ locator: "loc-bipm-derived-units", role: "SUPPORTS" }],
  },
  {
    id: "FM-NUM-STANDARD-FORM-001", domain: "FM",
    statement: "A number can be expressed in standard form as A times 10 to the power n, where 1 <= A < 10 and n is an integer.",
    provenance: [{ locator: "loc-dfe-number-standard-form", role: "DEFINES" }],
  },
  {
    id: "FM-NUM-SI-PREFIX-CONVERT-001", domain: "FM",
    statement: "Convert a numerical quantity from one SI-prefixed unit to another by applying the appropriate power-of-ten scale factor.",
    provenance: [{ locator: "loc-bipm-derived-units", role: "SUPPORTS" }],
    prereqs: [
      { id: "FM-NUM-SI-PREFIX-001", strength: "REQUIRED" },
      { id: "FM-NUM-STANDARD-FORM-001", strength: "STRONG" },
    ],
  },

  // -- CC-09B: LO1 Range items with no prior FM assertion (Indices;
  // Triangles and trigonometry; Statistics) --
  {
    // CC-09B.4 (task section 7): re-audited clause-by-clause. Both DfE
    // curriculum locators are DIRECT for their own clause (the Algebra
    // subject-content item names "the laws of indices"; the separate
    // Number item names "roots, and integer and fractional indices"), so
    // neither alone covers the whole compound statement -- classified
    // PARTIAL each, confirmed jointly fully covering it.
    id: "FM-NUM-INDICES-LAWS-001", domain: "FM",
    statement: "When multiplying two powers of the same base, add the indices; when dividing, subtract the indices; a fractional index represents a root.",
    provenance: [
      { locator: "loc-dfe-algebra-indices", role: "DEFINES", supportType: "PARTIAL" },
      { locator: "loc-dfe-number-indices", role: "SUPPORTS", supportType: "PARTIAL" },
    ],
    multiSourceFullyCovered: true,
    clauseCoverage: [
      { clause: "multiplying/dividing powers of the same base adds/subtracts indices (laws of indices)", locator: "loc-dfe-algebra-indices" },
      { clause: "a fractional index represents a root", locator: "loc-dfe-number-indices" },
    ],
    curriculum: [{ node: rangeNode("1.1", "INDICES"), type: "REQUIRED_FOR" }],
  },
  {
    id: "FM-GEOM-PYTHAGORAS-001", domain: "FM",
    statement: "In a right-angled triangle, the square of the hypotenuse equals the sum of the squares of the other two sides: a squared plus b squared equals c squared.",
    provenance: [{ locator: "loc-dfe-geometry-pythagoras-trig", role: "DEFINES" }],
    curriculum: [{ node: rangeNode("1.1", "TRIANGLES-TRIGONOMETRY"), type: "REQUIRED_FOR" }],
  },
  {
    id: "FM-GEOM-TRIG-RATIOS-001", domain: "FM",
    statement: "In a right-angled triangle, the sine, cosine and tangent of an angle are defined as the ratios opposite/hypotenuse, adjacent/hypotenuse and opposite/adjacent respectively.",
    provenance: [{ locator: "loc-dfe-geometry-pythagoras-trig", role: "DEFINES" }],
    prereqs: [{ id: "FM-GEOM-PYTHAGORAS-001", strength: "SUPPORTING" }],
    curriculum: [{ node: rangeNode("1.1", "TRIANGLES-TRIGONOMETRY"), type: "REQUIRED_FOR" }],
  },
  // -- CC-09B.1: application knowledge was previously missing -- the
  // corpus defined Pythagoras/trig ratios but never the procedure of
  // using them to find an unknown value, which the DfE locator's own
  // "apply them to find angles and lengths" clause explicitly requires.
  {
    id: "FM-CALC-PYTHAGORAS-001", domain: "FM",
    statement: "Use Pythagoras' theorem to calculate an unknown side length of a right-angled triangle, given the lengths of the other two sides.",
    provenance: [{ locator: "loc-dfe-geometry-pythagoras-trig", role: "SUPPORTS" }],
    prereqs: [{ id: "FM-GEOM-PYTHAGORAS-001", strength: "REQUIRED" }, { id: "FM-ALG-SUBSTITUTION-001", strength: "STRONG" }],
    curriculum: [{ node: rangeNode("1.1", "TRIANGLES-TRIGONOMETRY"), type: "REQUIRED_FOR" }],
  },
  {
    id: "FM-CALC-TRIG-RATIO-001", domain: "FM",
    statement: "Use a trigonometric ratio (sine, cosine or tangent) to calculate an unknown side length or angle of a right-angled triangle, given sufficient other side lengths or angles.",
    provenance: [{ locator: "loc-dfe-geometry-pythagoras-trig", role: "SUPPORTS" }],
    prereqs: [{ id: "FM-GEOM-TRIG-RATIOS-001", strength: "REQUIRED" }, { id: "FM-ALG-SUBSTITUTION-001", strength: "STRONG" }],
    curriculum: [{ node: rangeNode("1.1", "TRIANGLES-TRIGONOMETRY"), type: "REQUIRED_FOR" }],
  },
  {
    id: "FM-STATS-MEAN-001", domain: "FM",
    statement: "The mean of a set of numerical values is found by dividing their sum by the number of values, and is a measure of the central tendency of the data.",
    provenance: [{ locator: "loc-dfe-statistics-central-tendency-spread", role: "DEFINES" }],
    curriculum: [{ node: rangeNode("1.1", "STATISTICS"), type: "REQUIRED_FOR" }],
  },
  {
    id: "FM-STATS-RANGE-001", domain: "FM",
    statement: "The range of a set of numerical values is the difference between the largest and smallest values, and is a measure of the spread of the data.",
    provenance: [{ locator: "loc-dfe-statistics-central-tendency-spread", role: "DEFINES" }],
    curriculum: [{ node: rangeNode("1.1", "STATISTICS"), type: "REQUIRED_FOR" }],
  },
  {
    // CC-09B.6 (task section 6): closes the Statistics breadth ambiguity
    // CC-09B.4 deliberately left scope-unresolved. The official 2365-202
    // SmartScreen handout (Handout 2, "Mathematical principles") explicitly
    // teaches "range, average (mean), median and mode" as the four
    // statistical tools -- median and mode were genuinely missing, not
    // merely under-decomposed. The same already-verified DfE Maths locator
    // already covers median (it was never re-cited only because no
    // median assertion existed yet); quartiles/inter-quartile range remain
    // deliberately excluded (not part of the SmartScreen-confirmed
    // breadth).
    id: "FM-STATS-MEDIAN-001", domain: "FM",
    statement: "The median of a set of numerical values is the middle value when the values are arranged in numerical order, and is a measure of the central tendency of the data.",
    provenance: [{ locator: "loc-dfe-statistics-central-tendency-spread", role: "DEFINES" }],
    curriculum: [{ node: rangeNode("1.1", "STATISTICS"), type: "REQUIRED_FOR" }],
  },
  {
    // CC-09B.6 (task section 6): see FM-STATS-MEDIAN-001 above.
    id: "FM-STATS-MODE-001", domain: "FM",
    statement: "The mode of a set of numerical values is the value that occurs most often; a data set can have more than one mode.",
    provenance: [{ locator: "loc-dfe-statistics-central-tendency-spread", role: "DEFINES" }],
    curriculum: [{ node: rangeNode("1.1", "STATISTICS"), type: "REQUIRED_FOR" }],
  },

  // ===================================================================
  // Foundational Physics -- horizontal, reusable knowledge. Curriculum-
  // mapped only where CC-09B's refined rule (see the Foundational Maths
  // header comment above) applies: LO3's AC3.1 (mass/weight) and AC3.2
  // (levers) ask directly for this generic-physics knowledge itself.
  // ===================================================================
  {
    id: "FP-CONCEPT-FORCE-001", domain: "FP",
    statement: "A force is a push or a pull that can change the motion, shape or state of rest of an object.",
    provenance: [{ locator: "loc-openstax-up1-work", role: "DEFINES" }],
    curriculum: [{ node: acNode("3.3"), type: "REQUIRED_FOR" }],
  },
  {
    id: "FP-CONCEPT-WORK-001", domain: "FP",
    statement: "Work is done when a force causes its point of application to move through a distance in the direction of the force.",
    provenance: [{ locator: "loc-openstax-up1-work", role: "DEFINES" }],
    prereqs: [{ id: "FP-CONCEPT-FORCE-001", strength: "STRONG" }],
    curriculum: [{ node: acNode("3.3"), type: "REQUIRED_FOR" }],
  },
  // CC-09B.1: the work-formula relationship (audit 13, AC3.3) was
  // previously missing -- FP-CONCEPT-WORK-001 stated work definitionally
  // but never gave W = F x d.
  {
    id: "FP-REL-WORK-FORCE-DISTANCE-001", domain: "FP",
    statement: "Work done is calculated by multiplying the force applied by the distance moved in the direction of that force: W = F times d.",
    provenance: [{ locator: "loc-openstax-up1-work", role: "SUPPORTS" }],
    prereqs: [{ id: "FP-CONCEPT-WORK-001", strength: "REQUIRED" }],
    curriculum: [{ node: acNode("3.3"), type: "REQUIRED_FOR" }],
  },
  {
    id: "FP-CALC-WORK-001", domain: "FP",
    statement: "Calculate the work done by a force from its magnitude and the distance moved in its direction, using W = F times d.",
    provenance: [{ locator: "loc-openstax-up1-work", role: "SUPPORTS" }],
    prereqs: [{ id: "FP-REL-WORK-FORCE-DISTANCE-001", strength: "REQUIRED" }, { id: "FM-ALG-SUBSTITUTION-001", strength: "REQUIRED" }],
    curriculum: [{ node: acNode("3.4"), type: "REQUIRED_FOR" }],
  },
  {
    // CC-09B.1: retained as the general, umbrella energy concept -- the
    // audit's finding was that this alone ("energy includes kinetic and
    // potential") is not sufficient; it is now supplemented (not
    // replaced) by the two dedicated KE/GPE concept/relationship/
    // calculation triples below.
    id: "FP-CONCEPT-ENERGY-001", domain: "FP",
    statement: "Energy is the capacity to do work, and exists in different forms including kinetic energy (due to motion) and potential energy (due to position or state).",
    provenance: [{ locator: "loc-openstax-up1-kinetic-energy", role: "DEFINES" }],
    prereqs: [{ id: "FP-CONCEPT-WORK-001", strength: "STRONG" }],
    curriculum: [{ node: acNode("3.3"), type: "REQUIRED_FOR" }],
  },
  {
    id: "FP-CONCEPT-ENERGY-CONSERVATION-001", domain: "FP",
    statement: "Energy cannot be created or destroyed, only transferred or converted from one form to another.",
    provenance: [{ locator: "loc-openstax-up1-kinetic-energy", role: "SUPPORTS" }],
    prereqs: [{ id: "FP-CONCEPT-ENERGY-001", strength: "REQUIRED" }],
  },
  // -- CC-09B.1: dedicated kinetic-energy concept/relationship/calculation
  // triple (audit section 13, the largest AC3.3/AC3.4 gap) -- previously
  // only mentioned inside the single compound FP-CONCEPT-ENERGY-001
  // statement, with no formula and no calculation assertion at all. --
  {
    id: "FP-CONCEPT-KINETIC-ENERGY-001", domain: "FP",
    statement: "Kinetic energy is the energy an object possesses because of its motion.",
    provenance: [{ locator: "loc-openstax-up1-kinetic-energy", role: "DEFINES" }],
    prereqs: [{ id: "FP-CONCEPT-ENERGY-001", strength: "REQUIRED" }],
    curriculum: [{ node: acNode("3.3"), type: "REQUIRED_FOR" }],
  },
  {
    id: "FP-REL-KINETIC-ENERGY-001", domain: "FP",
    statement: "Kinetic energy is calculated from an object's mass and speed using KE = one half times m times v squared.",
    provenance: [{ locator: "loc-openstax-up1-kinetic-energy", role: "SUPPORTS" }],
    prereqs: [{ id: "FP-CONCEPT-KINETIC-ENERGY-001", strength: "REQUIRED" }],
    curriculum: [{ node: acNode("3.3"), type: "REQUIRED_FOR" }],
  },
  {
    id: "FP-CALC-KINETIC-ENERGY-001", domain: "FP",
    statement: "Calculate the kinetic energy of an object from its mass and speed, using KE = one half times m times v squared.",
    provenance: [{ locator: "loc-openstax-up1-kinetic-energy", role: "SUPPORTS" }],
    prereqs: [{ id: "FP-REL-KINETIC-ENERGY-001", strength: "REQUIRED" }, { id: "FM-ALG-SUBSTITUTION-001", strength: "REQUIRED" }],
    curriculum: [{ node: acNode("3.4"), type: "REQUIRED_FOR" }],
  },
  // -- CC-09B.1: dedicated gravitational-potential-energy concept/
  // relationship/calculation triple -- same gap as kinetic energy above. --
  {
    id: "FP-CONCEPT-POTENTIAL-ENERGY-001", domain: "FP",
    statement: "Gravitational potential energy is the energy an object possesses because of its position (height) within a gravitational field.",
    provenance: [{ locator: "loc-openstax-up1-gravitational-potential-energy", role: "DEFINES" }],
    prereqs: [{ id: "FP-CONCEPT-ENERGY-001", strength: "REQUIRED" }],
    curriculum: [{ node: acNode("3.3"), type: "REQUIRED_FOR" }],
  },
  {
    id: "FP-REL-POTENTIAL-ENERGY-001", domain: "FP",
    statement: "Gravitational potential energy near the Earth's surface is calculated from an object's mass, gravitational field strength and height using GPE = m times g times h.",
    provenance: [{ locator: "loc-openstax-up1-gravitational-potential-energy", role: "SUPPORTS" }],
    prereqs: [{ id: "FP-CONCEPT-POTENTIAL-ENERGY-001", strength: "REQUIRED" }, { id: "FP-REL-WEIGHT-MASS-001", strength: "STRONG" }],
    curriculum: [{ node: acNode("3.3"), type: "REQUIRED_FOR" }],
  },
  {
    id: "FP-CALC-POTENTIAL-ENERGY-001", domain: "FP",
    statement: "Calculate the gravitational potential energy of an object from its mass, gravitational field strength and height, using GPE = m times g times h.",
    provenance: [{ locator: "loc-openstax-up1-gravitational-potential-energy", role: "SUPPORTS" }],
    prereqs: [{ id: "FP-REL-POTENTIAL-ENERGY-001", strength: "REQUIRED" }, { id: "FM-ALG-SUBSTITUTION-001", strength: "REQUIRED" }],
    curriculum: [{ node: acNode("3.4"), type: "REQUIRED_FOR" }],
  },
  {
    id: "FP-CONCEPT-POWER-001", domain: "FP",
    statement: "Power is the rate at which work is done or energy is transferred.",
    provenance: [{ locator: "loc-openstax-up1-power", role: "DEFINES" }],
    prereqs: [
      { id: "FP-CONCEPT-WORK-001", strength: "REQUIRED" },
      { id: "FP-CONCEPT-ENERGY-001", strength: "REQUIRED" },
    ],
    curriculum: [{ node: acNode("3.3"), type: "REQUIRED_FOR" }],
  },
  {
    id: "FP-REL-POWER-WORK-TIME-001", domain: "FP",
    statement: "Power is calculated by dividing the work done (or energy transferred) by the time taken: P = W / t.",
    provenance: [{ locator: "loc-openstax-up1-power", role: "SUPPORTS" }],
    prereqs: [{ id: "FP-CONCEPT-POWER-001", strength: "REQUIRED" }],
    curriculum: [{ node: acNode("3.3"), type: "REQUIRED_FOR" }],
  },
  {
    id: "FP-CALC-POWER-001", domain: "FP",
    statement: "Calculate power from known work done (or energy transferred) and time taken, using P = W / t.",
    provenance: [{ locator: "loc-openstax-up1-power", role: "SUPPORTS" }],
    prereqs: [
      { id: "FP-REL-POWER-WORK-TIME-001", strength: "REQUIRED" },
      { id: "FM-ALG-SUBSTITUTION-001", strength: "REQUIRED" },
    ],
    curriculum: [{ node: acNode("3.4"), type: "REQUIRED_FOR" }],
  },
  {
    id: "FP-CONCEPT-EFFICIENCY-001", domain: "FP",
    statement: "Efficiency is the ratio of useful energy or power output to total energy or power input, usually expressed as a percentage.",
    provenance: [{ locator: "loc-openstax-up1-power", role: "SUPPORTS" }],
    prereqs: [
      { id: "FP-CONCEPT-ENERGY-CONSERVATION-001", strength: "REQUIRED" },
      { id: "FM-ARITH-PERCENTAGE-001", strength: "REQUIRED" },
    ],
    curriculum: [{ node: acNode("3.3"), type: "REQUIRED_FOR" }],
  },
  {
    id: "FP-CALC-EFFICIENCY-001", domain: "FP",
    statement: "Calculate the efficiency of a process as a percentage from its useful output and total input.",
    provenance: [{ locator: "loc-openstax-up1-power", role: "SUPPORTS" }],
    prereqs: [
      { id: "FP-CONCEPT-EFFICIENCY-001", strength: "REQUIRED" },
      { id: "FM-ARITH-PERCENTAGE-001", strength: "REQUIRED" },
    ],
    curriculum: [{ node: acNode("3.4"), type: "REQUIRED_FOR" }],
  },
  {
    id: "FP-CONCEPT-MASS-001", domain: "FP",
    statement: "Mass is the amount of matter in an object, measured in kilograms.",
    provenance: [{ locator: "loc-openstax-up1-work", role: "DEFINES" }],
    // CC-09B: AC3.1 ("specify what is meant by mass and weight") asks
    // directly for this generic-physics definitional knowledge -- see the
    // Foundational Physics header comment above for the refined rule.
    curriculum: [{ node: acNode("3.1"), type: "REQUIRED_FOR" }],
  },
  {
    id: "FP-CONCEPT-WEIGHT-001", domain: "FP",
    statement: "Weight is the force of gravity acting on an object's mass, measured in newtons.",
    provenance: [{ locator: "loc-openstax-up1-work", role: "DEFINES" }],
    prereqs: [
      { id: "FP-CONCEPT-FORCE-001", strength: "STRONG" },
      { id: "FP-CONCEPT-MASS-001", strength: "STRONG" },
    ],
    curriculum: [{ node: acNode("3.1"), type: "REQUIRED_FOR" }],
  },
  {
    id: "FP-REL-WEIGHT-MASS-001", domain: "FP",
    statement: "Weight is calculated from mass and gravitational field strength using W = m times g.",
    provenance: [{ locator: "loc-openstax-up1-work", role: "SUPPORTS" }],
    prereqs: [
      { id: "FP-CONCEPT-MASS-001", strength: "REQUIRED" },
      { id: "FP-CONCEPT-WEIGHT-001", strength: "REQUIRED" },
    ],
    curriculum: [{ node: acNode("3.1"), type: "SUPPORTS" }],
  },
  {
    id: "FP-CALC-WEIGHT-001", domain: "FP",
    statement: "Calculate the weight of an object from its mass and gravitational field strength using W = m times g.",
    provenance: [{ locator: "loc-openstax-up1-work", role: "SUPPORTS" }],
    prereqs: [
      { id: "FP-REL-WEIGHT-MASS-001", strength: "REQUIRED" },
      { id: "FM-ALG-TRANSPOSE-MULT-001", strength: "REQUIRED" },
      { id: "FM-ALG-SUBSTITUTION-001", strength: "REQUIRED" },
    ],
  },

  // -- CC-09B: LO3 AC3.2 (levers, gears and pulleys) -- previously
  // entirely absent from the corpus. --
  {
    id: "FP-CONCEPT-MECHANICAL-ADVANTAGE-001", domain: "FP",
    statement: "A simple machine such as a lever, gear or pulley provides mechanical advantage by changing the relationship between the effort (input force) applied and the load (output force) it moves.",
    provenance: [{ locator: "loc-openstax-up1-torque-levers", role: "SUPPORTS" }],
    prereqs: [{ id: "FP-CONCEPT-FORCE-001", strength: "STRONG" }],
    curriculum: [{ node: acNode("3.2"), type: "REQUIRED_FOR" }],
  },
  {
    id: "FP-CONCEPT-LEVER-PRINCIPLE-001", domain: "FP",
    statement: "A lever is a rigid bar that rotates about a fixed pivot (fulcrum); the mechanical advantage it provides depends on the ratio of the effort's distance from the pivot to the load's distance from the pivot.",
    provenance: [{ locator: "loc-openstax-up1-torque-levers", role: "SUPPORTS" }],
    prereqs: [{ id: "FP-CONCEPT-MECHANICAL-ADVANTAGE-001", strength: "REQUIRED" }],
    curriculum: [{ node: acNode("3.2"), type: "REQUIRED_FOR" }],
  },
  {
    id: "FP-LEVER-CLASS-I-001", domain: "FP",
    statement: "In a class I lever, the pivot is positioned between the effort and the load (for example a see-saw or a pair of pliers).",
    provenance: [{ locator: "loc-openstax-up1-torque-levers", role: "SUPPORTS" }],
    prereqs: [{ id: "FP-CONCEPT-LEVER-PRINCIPLE-001", strength: "REQUIRED" }],
    curriculum: [{ node: rangeNode("3.2", "CLASS-I"), type: "REQUIRED_FOR" }],
  },
  {
    id: "FP-LEVER-CLASS-II-001", domain: "FP",
    statement: "In a class II lever, the load is positioned between the pivot and the effort (for example a wheelbarrow).",
    provenance: [{ locator: "loc-openstax-up1-torque-levers", role: "SUPPORTS" }],
    prereqs: [{ id: "FP-CONCEPT-LEVER-PRINCIPLE-001", strength: "REQUIRED" }],
    curriculum: [{ node: rangeNode("3.2", "CLASS-II"), type: "REQUIRED_FOR" }],
  },
  {
    id: "FP-LEVER-CLASS-III-001", domain: "FP",
    statement: "In a class III lever, the effort is positioned between the pivot and the load (for example a pair of tweezers or the human forearm).",
    provenance: [{ locator: "loc-openstax-up1-torque-levers", role: "SUPPORTS" }],
    prereqs: [{ id: "FP-CONCEPT-LEVER-PRINCIPLE-001", strength: "REQUIRED" }],
    curriculum: [{ node: rangeNode("3.2", "CLASS-III"), type: "REQUIRED_FOR" }],
  },
  {
    // CC-09B.6 (task section 7): official SmartScreen handout (Handout 16,
    // "Levers") explicitly teaches lever calculation with worked numeric
    // examples ("Effort = Load x Load-to-fulcrum distance / Effort-to-
    // fulcrum distance"), even though AC3.2's own verb is "explain" not
    // "calculate" -- exactly analogous to the gear-ratio and pulley-
    // mechanical-advantage relationship assertions already governed under
    // this same AC's RANGE-basis obligation. This is the moment-balance
    // (torque-balance) condition already established generally by the same
    // OpenStax "Conditions for Static Equilibrium" chapter already cited
    // for the lever principle itself -- no new source needed.
    id: "FP-REL-LEVER-BALANCE-001", domain: "FP",
    statement: "A lever is in balance (equilibrium) when the effort multiplied by its distance from the pivot equals the load multiplied by its distance from the pivot; this relationship can be used to calculate the effort needed to balance a known load, or vice versa.",
    provenance: [{ locator: "loc-openstax-up1-torque-levers", role: "DEFINES" }],
    prereqs: [{ id: "FP-CONCEPT-LEVER-PRINCIPLE-001", strength: "REQUIRED" }],
    curriculum: [{ node: acNode("3.2"), type: "REQUIRED_FOR" }],
  },

  // -- CC-09B.1: AC3.2's own statement names "levers, gears and pulleys",
  // but CC-09B only modelled levers -- the audit's largest single named
  // defect (section 13). Gears and pulleys have no dedicated Range
  // sub-items (only the three lever classes do), so these are AC-level
  // (not Range-item-level) additions.
  //
  // CC-09B.2 correction (task section 14): the Project Architect
  // independently confirmed OpenStax College Physics 2e 9.5 supports gears
  // as simple machines and MA-as-radius-ratio, but NOT tooth-count
  // equivalence or the speed/torque trade-off it was previously cited for
  // (re-inspected directly: confirmed). The tooth-count and speed/torque
  // propositions now cite University of California San Diego MAE 3 course
  // material instead (loc-ucsd-gear-ratio-tooth-count-torque), which
  // states both explicitly and precisely. Nothing here claims more than
  // its own cited locator's own inspected text establishes. --
  // CC-09B.3 (task section 7): re-audited clause-by-clause. OpenStax
  // establishes the wheel/gear-as-simple-machine and MA-as-radius-ratio
  // clauses; UCSD establishes gear teeth/meshing, input/output gear
  // torque-and-speed transmission, and tooth-count proportionality. Between
  // the two, every clause of FP-CONCEPT-GEAR-001's and
  // FP-REL-GEAR-RATIO-001's statements is covered -- neither leaves a
  // material factual clause unsupported -- so both are now confirmed
  // FULLY_SUPPORTED_MULTI_SOURCE (multiSourceFullyCovered: true), not left
  // at the link-level PARTIAL classification alone.
  {
    id: "FP-CONCEPT-GEAR-001", domain: "FP",
    statement: "A gear is a toothed wheel; when two gears mesh, their teeth engage so that one gear (the driving gear) transmits rotary motion and torque to the other (the driven gear) from one shaft to another.",
    provenance: [
      { locator: "loc-openstax-college-physics-simple-machines", role: "DEFINES", supportType: "PARTIAL" },
      { locator: "loc-ucsd-gear-ratio-tooth-count-torque", role: "SUPPORTS", supportType: "PARTIAL" },
    ],
    multiSourceFullyCovered: true,
    clauseCoverage: [
      { clause: "a gear is a wheel used as a simple machine (MA-as-radius-ratio analogue of a crank)", locator: "loc-openstax-college-physics-simple-machines" },
      { clause: "gear teeth mesh; driving/driven gears transmit rotary motion and torque between shafts", locator: "loc-ucsd-gear-ratio-tooth-count-torque" },
    ],
    prereqs: [{ id: "FP-CONCEPT-MECHANICAL-ADVANTAGE-001", strength: "REQUIRED" }],
    curriculum: [{ node: acNode("3.2"), type: "REQUIRED_FOR" }],
  },
  {
    id: "FP-REL-GEAR-RATIO-001", domain: "FP",
    statement: "For two meshed gears, mechanical advantage equals the ratio of their radii (the driving gear's radius to the driven gear's radius); because gear teeth are evenly spaced and shared between meshed gears, a gear's radius is proportional to its number of teeth, so this same mechanical advantage can equivalently be expressed as the ratio of their tooth counts.",
    provenance: [
      { locator: "loc-openstax-college-physics-simple-machines", role: "DEFINES", supportType: "PARTIAL" },
      { locator: "loc-ucsd-gear-ratio-tooth-count-torque", role: "DEFINES", supportType: "PARTIAL" },
    ],
    multiSourceFullyCovered: true,
    clauseCoverage: [
      { clause: "mechanical advantage equals the ratio of the two gears' radii", locator: "loc-openstax-college-physics-simple-machines" },
      { clause: "radius is proportional to tooth count, so MA can equivalently be expressed as the tooth-count ratio", locator: "loc-ucsd-gear-ratio-tooth-count-torque" },
    ],
    prereqs: [{ id: "FP-CONCEPT-GEAR-001", strength: "REQUIRED" }],
    curriculum: [{ node: acNode("3.2"), type: "REQUIRED_FOR" }],
  },
  {
    id: "FP-GEAR-SPEED-TORQUE-TRADEOFF-001", domain: "FP",
    // CC-09B.6 (task sections 7-8): the official SmartScreen handout
    // (Handout 16, "Levers") teaches this same speed/torque trade-off, but
    // its own wording is technically inaccurate: "there would be twice as
    // much POWER available at the driven cog, despite going slower". A
    // passive gear train has no power source of its own and cannot create
    // power -- ignoring friction losses it approximately CONSERVES power
    // (P = tau * omega stays constant), with torque rising as speed falls,
    // never a power gain. This assertion already correctly states the
    // trade-off as torque-or-speed (never power), and was NOT contaminated
    // by the handout's error -- recorded here as a discrepancy the audit
    // found and confirmed was never encoded:
    //   OFFICIAL TEACHING INTENT: a gear ratio trades output speed for
    //     output torque (or vice versa).
    //   TECHNICAL ISSUE: the handout states this trade-off increases
    //     output POWER, which is physically incorrect for a passive
    //     (unpowered) gear train.
    //   GOVERNED CORRECTION: this assertion states the trade-off is
    //     between torque and speed only, consistent with approximate power
    //     conservation (loc-ucsd-gear-ratio-tooth-count-torque, already the
    //     sole cited source, itself correctly frames it this way).
    statement: "A gear ratio can increase a mechanism's output torque or its output speed relative to the input, but not both at the same time.",
    provenance: [{ locator: "loc-ucsd-gear-ratio-tooth-count-torque", role: "DEFINES", supportType: "DIRECT" }],
    prereqs: [{ id: "FP-REL-GEAR-RATIO-001", strength: "REQUIRED" }],
    curriculum: [{ node: acNode("3.2"), type: "SUPPORTS" }],
  },
  {
    // CC-09B.6 (task section 7): the official SmartScreen handout
    // (Handout 16) explicitly teaches that meshed gears rotate in opposite
    // directions, and that an idler gear restores the original direction
    // without changing the overall ratio. The existing UCSD gear-ratio
    // locator was directly re-checked and confirmed to NOT establish this
    // (only a diagram caption shows opposite rotation, never stated as a
    // taught principle) -- genuinely new source required.
    id: "FP-GEAR-DIRECTION-REVERSAL-001", domain: "FP",
    statement: "When two gears mesh directly, they rotate in opposite directions to each other.",
    provenance: [{ locator: "loc-firgelli-gear-idler-direction", role: "DEFINES", supportType: "DIRECT" }],
    prereqs: [{ id: "FP-CONCEPT-GEAR-001", strength: "REQUIRED" }],
    curriculum: [{ node: acNode("3.2"), type: "SUPPORTS" }],
  },
  {
    id: "FP-GEAR-IDLER-001", domain: "FP",
    statement: "An idler gear placed between a driving gear and a driven gear reverses the driven gear's direction of rotation back to match the driving gear's direction, without changing the overall gear ratio between them.",
    provenance: [{ locator: "loc-firgelli-gear-idler-direction", role: "DEFINES", supportType: "DIRECT" }],
    prereqs: [{ id: "FP-GEAR-DIRECTION-REVERSAL-001", strength: "REQUIRED" }],
    curriculum: [{ node: acNode("3.2"), type: "SUPPORTS" }],
  },
  {
    id: "FP-CONCEPT-PULLEY-001", domain: "FP",
    statement: "A pulley is a wheel with a grooved rim that changes the direction of a force applied through a rope or cable running over it.",
    provenance: [{ locator: "loc-openstax-college-physics-simple-machines", role: "DEFINES" }],
    prereqs: [{ id: "FP-CONCEPT-MECHANICAL-ADVANTAGE-001", strength: "REQUIRED" }],
    curriculum: [{ node: acNode("3.2"), type: "REQUIRED_FOR" }],
  },
  {
    id: "FP-PULLEY-FIXED-VS-MOVABLE-001", domain: "FP",
    statement: "A single fixed pulley has a mechanical advantage of one -- it changes the direction of the effort but does not reduce the force needed; a movable pulley, or a combination of pulleys, can provide a mechanical advantage greater than one.",
    provenance: [{ locator: "loc-openstax-college-physics-simple-machines", role: "SUPPORTS" }],
    prereqs: [{ id: "FP-CONCEPT-PULLEY-001", strength: "REQUIRED" }],
    contrastsWith: ["FP-CONCEPT-PULLEY-001"],
    curriculum: [{ node: acNode("3.2"), type: "REQUIRED_FOR" }],
  },
  {
    id: "FP-REL-PULLEY-MECHANICAL-ADVANTAGE-001", domain: "FP",
    statement: "For a movable or combination pulley system, the mechanical advantage is approximately equal to the number of rope or cable sections that directly support the load.",
    provenance: [{ locator: "loc-openstax-college-physics-simple-machines", role: "SUPPORTS" }],
    prereqs: [{ id: "FP-PULLEY-FIXED-VS-MOVABLE-001", strength: "REQUIRED" }],
    curriculum: [{ node: acNode("3.2"), type: "REQUIRED_FOR" }],
  },
  {
    // CC-09B.6 (task section 7): official SmartScreen handout (Handout 16)
    // explicitly teaches the explicit force/distance trade-off ("increasing
    // the number of pulleys will mean less force needs to be applied...
    // but the force needs to be applied over a greater distance"), worked
    // through four numeric examples. Already implicit in the existing
    // rope-sections-count relationship, but not previously stated as its
    // own explicit trade-off proposition -- reuses the same already-cited
    // OpenStax simple-machines locator (a direct consequence of the same
    // mechanical-advantage relationship the locator already establishes).
    id: "FP-REL-PULLEY-FORCE-DISTANCE-TRADEOFF-001", domain: "FP",
    statement: "The mechanical advantage a pulley system provides in reduced effort force is accompanied by a proportional increase in the distance the effort must move to lift the load.",
    provenance: [{ locator: "loc-openstax-college-physics-simple-machines", role: "SUPPORTS" }],
    prereqs: [{ id: "FP-REL-PULLEY-MECHANICAL-ADVANTAGE-001", strength: "REQUIRED" }],
    curriculum: [{ node: acNode("3.2"), type: "SUPPORTS" }],
  },

  // -- CC-09B: LO2 AC2.1 Range ("(SI) Units of measurement for": Length,
  // Area, Volume, Mass, Density, Time, Temperature, Velocity) -- generic
  // physical quantities Unit 202 asks for directly, distinct from the
  // AC2.2 Range's ELECTRICAL SI quantities (already covered above by
  // EL-UNIT-*/EL-CONCEPT-* assertions). BIPM-sourced, matching the
  // primary authority already used for every other SI-unit assertion in
  // this corpus. --
  {
    id: "FP-UNIT-METRE-001", domain: "FP",
    statement: "The metre (m) is the SI base unit of length.",
    provenance: [{ locator: "loc-bipm-base-units-table", role: "DEFINES" }],
    curriculum: [{ node: rangeNode("2.1", "LENGTH"), type: "REQUIRED_FOR" }],
  },
  {
    id: "FP-UNIT-SQUARE-METRE-001", domain: "FP",
    statement: "The square metre (m squared) is the SI derived unit of area, formed by multiplying two lengths.",
    provenance: [{ locator: "loc-bipm-coherent-derived-units-table", role: "DEFINES" }],
    prereqs: [{ id: "FP-UNIT-METRE-001", strength: "REQUIRED" }],
    curriculum: [{ node: rangeNode("2.1", "AREA"), type: "REQUIRED_FOR" }],
  },
  {
    id: "FP-UNIT-CUBIC-METRE-001", domain: "FP",
    statement: "The cubic metre (m cubed) is the SI derived unit of volume, formed by multiplying three lengths.",
    provenance: [{ locator: "loc-bipm-coherent-derived-units-table", role: "DEFINES" }],
    prereqs: [{ id: "FP-UNIT-METRE-001", strength: "REQUIRED" }],
    curriculum: [{ node: rangeNode("2.1", "VOLUME"), type: "REQUIRED_FOR" }],
  },
  {
    id: "FP-UNIT-KILOGRAM-001", domain: "FP",
    statement: "The kilogram (kg) is the SI base unit of mass.",
    provenance: [{ locator: "loc-bipm-base-units-table", role: "DEFINES" }],
    curriculum: [{ node: rangeNode("2.1", "MASS"), type: "REQUIRED_FOR" }],
  },
  {
    id: "FP-UNIT-DENSITY-001", domain: "FP",
    statement: "Density is mass per unit volume, with SI derived unit the kilogram per cubic metre (kg/m cubed).",
    provenance: [{ locator: "loc-bipm-coherent-derived-units-table", role: "DEFINES" }],
    prereqs: [{ id: "FP-UNIT-KILOGRAM-001", strength: "REQUIRED" }, { id: "FP-UNIT-CUBIC-METRE-001", strength: "REQUIRED" }],
    curriculum: [{ node: rangeNode("2.1", "DENSITY"), type: "REQUIRED_FOR" }],
  },
  {
    id: "FP-UNIT-SECOND-001", domain: "FP",
    statement: "The second (s) is the SI base unit of time.",
    provenance: [{ locator: "loc-bipm-base-units-table", role: "DEFINES" }],
    curriculum: [{ node: rangeNode("2.1", "TIME"), type: "REQUIRED_FOR" }],
  },
  {
    id: "FP-UNIT-KELVIN-CELSIUS-001", domain: "FP",
    // CC-09B.1: enriched to the BIPM's actual defining relationship
    // (audit section 12.F) -- the 273.15 offset and equal interval
    // magnitude were previously left implicit.
    // CC-09B.4 (task section 7): re-audited clause-by-clause. The base-
    // units table establishes kelvin as the SI base unit; the separate
    // Celsius locator establishes the t=T-273.15 relationship and the
    // equal-interval-magnitude fact -- neither table entry alone covers
    // both.
    statement: "The kelvin (K) is the SI base unit of thermodynamic temperature T; the degree Celsius (deg C) is a special name for the kelvin used to express Celsius temperature t, related by t = T minus 273.15. A temperature interval or difference of one degree Celsius equals one kelvin.",
    provenance: [
      { locator: "loc-bipm-base-units-table", role: "DEFINES", supportType: "PARTIAL" },
      { locator: "loc-bipm-celsius", role: "DEFINES", supportType: "PARTIAL" },
    ],
    multiSourceFullyCovered: true,
    clauseCoverage: [
      { clause: "the kelvin is the SI base unit of thermodynamic temperature", locator: "loc-bipm-base-units-table" },
      { clause: "degree Celsius = special name for kelvin, t = T - 273.15, equal interval magnitude", locator: "loc-bipm-celsius" },
    ],
    curriculum: [{ node: rangeNode("2.1", "TEMPERATURE"), type: "REQUIRED_FOR" }],
  },
  {
    id: "FP-UNIT-METRE-PER-SECOND-001", domain: "FP",
    statement: "The metre per second (m/s) is the SI derived unit of speed/velocity, formed by dividing a length by a time.",
    provenance: [{ locator: "loc-bipm-coherent-derived-units-table", role: "DEFINES" }],
    prereqs: [{ id: "FP-UNIT-METRE-001", strength: "REQUIRED" }, { id: "FP-UNIT-SECOND-001", strength: "REQUIRED" }],
    curriculum: [{ node: rangeNode("2.1", "VELOCITY"), type: "REQUIRED_FOR" }],
  },

  // ===================================================================
  // Electrical -- LO2 cluster: units, quantities, instruments (17).
  // ===================================================================
  {
    id: "EL-UNIT-VOLT-001", domain: "EL",
    statement: "The volt (V) is the SI derived unit of electric potential difference (voltage).",
    provenance: [
      { locator: "loc-bipm-derived-units", role: "DEFINES" },
      { locator: "loc-cg-ac2.2", role: "CURRICULUM_REQUIRES" },
    ],
    curriculum: [
      { node: NODE_AC2_1, type: "REQUIRED_FOR" },
      { node: NODE_AC2_2, type: "REQUIRED_FOR" },
      { node: rangeNode("2.2", "VOLTAGE"), type: "REQUIRED_FOR" },
    ],
  },
  {
    id: "EL-UNIT-AMPERE-001", domain: "EL",
    statement: "The ampere (A) is the SI base unit of electric current.",
    provenance: [
      { locator: "loc-bipm-ampere", role: "DEFINES" },
      { locator: "loc-cg-ac2.2", role: "CURRICULUM_REQUIRES" },
    ],
    curriculum: [
      { node: NODE_AC2_1, type: "REQUIRED_FOR" },
      { node: NODE_AC2_2, type: "REQUIRED_FOR" },
      { node: rangeNode("2.2", "CURRENT"), type: "REQUIRED_FOR" },
    ],
  },
  {
    id: "EL-UNIT-OHM-001", domain: "EL",
    statement: "The ohm is the SI derived unit of electrical resistance.",
    provenance: [
      { locator: "loc-bipm-derived-units", role: "DEFINES" },
      { locator: "loc-cg-ac2.2", role: "CURRICULUM_REQUIRES" },
    ],
    curriculum: [{ node: NODE_AC2_2, type: "REQUIRED_FOR" }, { node: rangeNode("2.2", "RESISTANCE"), type: "REQUIRED_FOR" }],
  },
  {
    id: "EL-UNIT-WATT-001", domain: "EL",
    statement: "The watt (W) is the SI derived unit of power.",
    provenance: [
      { locator: "loc-bipm-derived-units", role: "DEFINES" },
      { locator: "loc-cg-ac2.2", role: "CURRICULUM_REQUIRES" },
    ],
    curriculum: [{ node: NODE_AC2_2, type: "REQUIRED_FOR" }, { node: rangeNode("2.2", "POWER"), type: "REQUIRED_FOR" }],
  },
  {
    id: "EL-UNIT-JOULE-001", domain: "EL",
    statement: "The joule (J) is the SI derived unit of energy.",
    provenance: [
      { locator: "loc-bipm-derived-units", role: "DEFINES" },
      { locator: "loc-cg-ac2.2", role: "CURRICULUM_REQUIRES" },
    ],
    curriculum: [{ node: NODE_AC2_2, type: "REQUIRED_FOR" }, { node: rangeNode("2.2", "ENERGY"), type: "REQUIRED_FOR" }],
  },
  {
    id: "EL-UNIT-OHM-METRE-001", domain: "EL",
    statement: "The ohm-metre is the SI derived unit of resistivity.",
    provenance: [
      { locator: "loc-bipm-derived-units", role: "DEFINES" },
      { locator: "loc-cg-ac2.2", role: "CURRICULUM_REQUIRES" },
    ],
    curriculum: [{ node: NODE_AC2_2, type: "REQUIRED_FOR" }, { node: rangeNode("2.2", "RESISTIVITY"), type: "REQUIRED_FOR" }],
  },
  {
    id: "EL-CONCEPT-VOLTAGE-001", domain: "EL",
    statement: "Potential difference (voltage) is the electrical energy transferred per unit charge between two points in a circuit.",
    provenance: [
      { locator: "loc-openstax-up2-ohms-law", role: "DEFINES" },
      { locator: "loc-cg-ac2.2", role: "CURRICULUM_REQUIRES" },
    ],
    prereqs: [{ id: "FP-CONCEPT-ENERGY-001", strength: "STRONG" }],
    curriculum: [{ node: NODE_AC2_2, type: "REQUIRED_FOR" }],
  },
  {
    id: "EL-CONCEPT-CURRENT-001", domain: "EL",
    statement: "Electric current is the rate of flow of electric charge through a conductor.",
    provenance: [
      { locator: "loc-openstax-up2-ohms-law", role: "DEFINES" },
      { locator: "loc-cg-ac2.2", role: "CURRICULUM_REQUIRES" },
    ],
    curriculum: [{ node: NODE_AC2_2, type: "REQUIRED_FOR" }],
  },
  {
    id: "EL-CONCEPT-RESISTANCE-001", domain: "EL",
    statement: "Electrical resistance is the opposition a component presents to the flow of electric current.",
    provenance: [
      { locator: "loc-openstax-up2-resistivity-resistance", role: "DEFINES" },
      { locator: "loc-cg-ac4.3", role: "CURRICULUM_REQUIRES" },
    ],
    curriculum: [
      { node: NODE_AC2_2, type: "REQUIRED_FOR" },
      { node: NODE_AC4_3, type: "REQUIRED_FOR" },
      { node: rangeNode("2.2", "RESISTANCE"), type: "REQUIRED_FOR" },
      // CC-09B: also the LO6 AC6.2 "Resistors" Range item -- reused
      // rather than re-authoring an electrical-domain duplicate.
      { node: rangeNode("6.2", "RESISTORS"), type: "REQUIRED_FOR" },
    ],
  },
  {
    id: "EL-CONCEPT-RESISTIVITY-001", domain: "EL",
    statement: "Resistivity is a material property describing how strongly a material opposes current flow, independent of the conductor's length or cross-sectional area.",
    provenance: [
      { locator: "loc-openstax-up2-resistivity-resistance", role: "DEFINES" },
      { locator: "loc-cg-ac4.3", role: "CURRICULUM_REQUIRES" },
    ],
    prereqs: [{ id: "EL-CONCEPT-RESISTANCE-001", strength: "STRONG" }],
    curriculum: [
      { node: NODE_AC2_2, type: "SUPPORTS" },
      { node: NODE_AC4_3, type: "REQUIRED_FOR" },
    ],
  },
  {
    id: "EL-CONCEPT-POWER-001", domain: "EL",
    statement: "Electrical power is the rate at which electrical energy is transferred or converted.",
    provenance: [
      { locator: "loc-openstax-up2-power-energy", role: "DEFINES" },
      { locator: "loc-cg-ac2.2", role: "CURRICULUM_REQUIRES" },
    ],
    prereqs: [{ id: "FP-CONCEPT-POWER-001", strength: "REQUIRED" }],
    curriculum: [{ node: NODE_AC2_2, type: "REQUIRED_FOR" }],
  },
  {
    id: "EL-CONCEPT-ENERGY-001", domain: "EL",
    statement: "Electrical energy is the total amount of electrical work done, or energy transferred, over a period of time.",
    provenance: [
      { locator: "loc-openstax-up2-power-energy", role: "DEFINES" },
      { locator: "loc-cg-ac2.2", role: "CURRICULUM_REQUIRES" },
    ],
    prereqs: [{ id: "FP-CONCEPT-ENERGY-001", strength: "REQUIRED" }],
    curriculum: [{ node: NODE_AC2_2, type: "REQUIRED_FOR" }],
  },
  {
    id: "EL-INSTRUMENT-VOLTMETER-001", domain: "EL",
    statement: "A voltmeter measures potential difference and is connected in parallel across the component being measured.",
    provenance: [{ locator: "loc-openstax-up2-electrical-measuring-instruments", role: "DEFINES" }, { locator: "loc-cg-ac2.3", role: "CURRICULUM_REQUIRES" }],
    prereqs: [{ id: "EL-CONCEPT-VOLTAGE-001", strength: "STRONG" }],
    curriculum: [{ node: NODE_AC2_3, type: "REQUIRED_FOR" }, { node: rangeNode("2.3", "VOLTAGE"), type: "REQUIRED_FOR" }],
  },
  {
    id: "EL-INSTRUMENT-AMMETER-001", domain: "EL",
    statement: "An ammeter measures current and is connected in series within the circuit being measured.",
    provenance: [{ locator: "loc-openstax-up2-electrical-measuring-instruments", role: "DEFINES" }, { locator: "loc-cg-ac2.3", role: "CURRICULUM_REQUIRES" }],
    prereqs: [{ id: "EL-CONCEPT-CURRENT-001", strength: "STRONG" }],
    curriculum: [{ node: NODE_AC2_3, type: "REQUIRED_FOR" }, { node: rangeNode("2.3", "CURRENT"), type: "REQUIRED_FOR" }],
  },
  {
    id: "EL-INSTRUMENT-OHMMETER-001", domain: "EL",
    statement: "An ohmmeter measures resistance, and must be used on a component that is isolated and de-energised.",
    provenance: [{ locator: "loc-openstax-up2-electrical-measuring-instruments", role: "DEFINES" }, { locator: "loc-cg-ac2.3", role: "CURRICULUM_REQUIRES" }],
    prereqs: [{ id: "EL-CONCEPT-RESISTANCE-001", strength: "STRONG" }],
    curriculum: [{ node: NODE_AC2_3, type: "REQUIRED_FOR" }, { node: rangeNode("2.3", "RESISTANCE"), type: "REQUIRED_FOR" }],
  },
  // CC-09B.2 correction (task section 16/28): CC-09B.1 gave the wattmeter,
  // energy-meter and multimeter assertions below DERIVED_FROM provenance
  // from unrelated mathematical relationship assertions (P = VI; E = Pt)
  // plus the separate voltmeter/ammeter/ohmmeter assertions. That is an
  // EMPIRICAL/APPLICATION derivation, not a mathematical one: the fact
  // that P = VI is true, and that separate voltmeters/ammeters/ohmmeters
  // exist, does not by itself entail that a real manufactured instrument
  // combining them exists or how it is built -- exactly the "device
  // construction inference" failure mode this package exists to close
  // (task section 36.B). All three now cite real, direct, independently
  // inspected instrumentation evidence instead.
  {
    // CC-09B.5 correction (task section 17): AC2.3's own cognitive verb is
    // "Identify appropriate electrical instruments" -- distinguishing
    // WHICH instrument to select for a task from HOW a manufacturer
    // internally wires its sensing coils is beyond that depth. The
    // detailed series/parallel coil-wiring architecture (still genuinely
    // evidenced by Indus University's circuit description) is retained as
    // supporting provenance but no longer repeated in the governed,
    // learner-facing statement -- narrowed to the functional principle
    // that lets a learner recognise/select a wattmeter: it senses both
    // current and voltage and multiplies them.
    id: "EL-INSTRUMENT-WATTMETER-001", domain: "EL",
    statement: "A wattmeter measures electrical power by combining a measurement of the current through the load with a measurement of the voltage across it; its output is proportional to the product of the two, giving power.",
    provenance: [
      { locator: "loc-nist-hb44-element", role: "DEFINES", supportType: "DIRECT" },
      { locator: "loc-indus-uni-wattmeter-circuit", role: "SUPPORTS", supportType: "PARTIAL" },
      { locator: "loc-cg-ac2.3", role: "CURRICULUM_REQUIRES" },
    ],
    multiSourceFullyCovered: true,
    clauseCoverage: [
      { clause: "an element combines a voltage-sensing and current-sensing unit, output proportional to the product (the whole governed statement)", locator: "loc-nist-hb44-element" },
      { clause: "(supporting, not required) concrete series/parallel coil-wiring implementation detail -- retained as evidence, not repeated in the governed statement per the syllabus-scope-fidelity rule", locator: "loc-indus-uni-wattmeter-circuit" },
    ],
    prereqs: [{ id: "EL-CONCEPT-POWER-001", strength: "STRONG" }],
    curriculum: [{ node: NODE_AC2_3, type: "REQUIRED_FOR" }, { node: rangeNode("2.3", "POWER"), type: "REQUIRED_FOR" }],
  },
  {
    // CC-09B.5 correction (task section 17): narrowed the calculus-
    // flavoured "time integral of instantaneous voltage x current"
    // phrasing (a formalism proportionate to NIST's own standards-body
    // register, not to AC2.3's "identify appropriate instruments" Level 2
    // depth) to plain-language "continuously measuring power and
    // accumulating it over time" -- same substance, still DIRECT-
    // evidenced by the same NIST definition, without introducing
    // calculus notation this AC does not require.
    id: "EL-INSTRUMENT-ENERGY-METER-001", domain: "EL",
    statement: "An energy meter (kWh meter) measures the cumulative electrical energy delivered over a period of time, expressed in kilowatt-hours, by continuously measuring power and accumulating it over time.",
    provenance: [
      { locator: "loc-nist-hb44-active-energy", role: "DEFINES", supportType: "DIRECT" },
      { locator: "loc-cg-ac2.3", role: "CURRICULUM_REQUIRES" },
    ],
    prereqs: [{ id: "EL-CONCEPT-ENERGY-001", strength: "STRONG" }],
    curriculum: [{ node: NODE_AC2_3, type: "REQUIRED_FOR" }, { node: rangeNode("2.3", "ENERGY"), type: "REQUIRED_FOR" }],
  },
  {
    id: "EL-INSTRUMENT-MULTIMETER-001", domain: "EL",
    statement: "A multimeter is a single instrument that can be configured to measure voltage, current or resistance, by connecting one meter movement to different external resistor networks via a selector switch.",
    provenance: [
      { locator: "loc-kuphaldt-dc-multimeters", role: "DEFINES", supportType: "DIRECT" },
      { locator: "loc-cg-ac2.3", role: "CURRICULUM_REQUIRES" },
    ],
    prereqs: [
      { id: "EL-INSTRUMENT-VOLTMETER-001", strength: "SUPPORTING" },
      { id: "EL-INSTRUMENT-AMMETER-001", strength: "SUPPORTING" },
      { id: "EL-INSTRUMENT-OHMMETER-001", strength: "SUPPORTING" },
    ],
    curriculum: [{ node: NODE_AC2_3, type: "REQUIRED_FOR" }],
  },
  {
    id: "EL-POWER-RATING-001", domain: "EL",
    statement: "The power rating of an electrical device states the rate at which it is designed to convert electrical energy under normal operating conditions.",
    provenance: [
      { locator: "loc-openstax-up2-power-energy", role: "SUPPORTS" },
      { locator: "loc-cg-ac2.2", role: "CURRICULUM_REQUIRES" },
    ],
    prereqs: [{ id: "EL-CONCEPT-POWER-001", strength: "STRONG" }],
    curriculum: [{ node: NODE_AC2_2, type: "SUPPORTS" }],
  },
  {
    id: "EL-UNIT-KWH-001", domain: "EL",
    statement: "The kilowatt-hour (kWh) is a practical, non-SI unit of electrical energy, equal to the energy transferred by a one-kilowatt load running for one hour, commonly used for billing electricity usage.",
    provenance: [{ locator: "loc-openstax-up2-power-energy", role: "SUPPORTS" }, { locator: "loc-cg-ac2.2", role: "CURRICULUM_REQUIRES" }],
    prereqs: [{ id: "EL-UNIT-JOULE-001", strength: "STRONG" }, { id: "EL-CONCEPT-ENERGY-001", strength: "STRONG" }],
    curriculum: [{ node: NODE_AC2_2, type: "SUPPORTS" }],
  },
  {
    id: "EL-UNIT-BASE-VS-DERIVED-001", domain: "EL",
    statement: "The ampere is an SI base unit, while the volt, ohm, watt, joule and hertz are SI derived units formed from combinations of base units.",
    provenance: [{ locator: "loc-bipm-derived-units", role: "DEFINES" }, { locator: "loc-cg-ac2.1", role: "CURRICULUM_REQUIRES" }],
    prereqs: [{ id: "EL-UNIT-AMPERE-001", strength: "STRONG" }, { id: "EL-UNIT-VOLT-001", strength: "STRONG" }],
    curriculum: [{ node: NODE_AC2_1, type: "REQUIRED_FOR" }],
  },
  {
    id: "EL-UNIT-HERTZ-001", domain: "EL",
    statement: "The hertz (Hz) is the SI derived unit of frequency, equal to one cycle per second.",
    provenance: [{ locator: "loc-bipm-derived-units", role: "DEFINES" }, { locator: "loc-cg-ac2.2", role: "CURRICULUM_REQUIRES" }],
    curriculum: [{ node: NODE_AC2_2, type: "REQUIRED_FOR" }, { node: rangeNode("2.2", "FREQUENCY"), type: "REQUIRED_FOR" }],
  },
  {
    id: "EL-CONCEPT-FREQUENCY-001", domain: "EL",
    statement: "Frequency is the number of complete cycles of a repeating waveform that occur in one second.",
    provenance: [{ locator: "loc-openstax-up2-em-induction", role: "DEFINES" }, { locator: "loc-cg-ac2.2", role: "CURRICULUM_REQUIRES" }],
    supports: [{ id: "EL-UNIT-HERTZ-001", strength: "SUPPORTING" }],
    curriculum: [
      { node: NODE_AC2_2, type: "REQUIRED_FOR" },
      { node: rangeNode("2.2", "FREQUENCY"), type: "REQUIRED_FOR" },
      { node: rangeNode("5.5", "FREQUENCY"), type: "REQUIRED_FOR" },
    ],
  },
  {
    id: "EL-CONCEPT-REACTANCE-001", domain: "EL",
    statement: "Reactance is the opposition to current flow in an AC circuit caused by inductance or capacitance, and unlike resistance its value depends on the supply frequency.",
    provenance: [{ locator: "loc-openstax-up2-ac-circuits", role: "DEFINES" }, { locator: "loc-cg-ac2.2", role: "CURRICULUM_REQUIRES" }],
    prereqs: [{ id: "EL-CONCEPT-RESISTANCE-001", strength: "STRONG" }, { id: "EL-CONCEPT-FREQUENCY-001", strength: "STRONG" }],
    contrastsWith: ["EL-CONCEPT-RESISTANCE-001"],
    curriculum: [{ node: NODE_AC2_2, type: "REQUIRED_FOR" }],
  },
  {
    id: "EL-CONCEPT-IMPEDANCE-001", domain: "EL",
    // CC-09B.1: explicitly states impedance's unit (audit section 12.C) --
    // previously left implicit.
    statement: "Impedance is the total opposition a circuit presents to the flow of alternating current, combining resistance and reactance; like resistance and reactance, it is measured in ohms.",
    provenance: [{ locator: "loc-openstax-up2-ac-circuits", role: "DEFINES" }, { locator: "loc-cg-ac2.2", role: "CURRICULUM_REQUIRES" }],
    prereqs: [{ id: "EL-CONCEPT-RESISTANCE-001", strength: "REQUIRED" }, { id: "EL-CONCEPT-REACTANCE-001", strength: "REQUIRED" }],
    curriculum: [{ node: NODE_AC2_2, type: "REQUIRED_FOR" }, { node: rangeNode("2.2", "IMPEDANCE"), type: "REQUIRED_FOR" }],
  },
  {
    // CC-09D (Unit 202 Official Public Assessment Calibration): the
    // official public 2365-602 sample e-volve MC test (item 6) tests
    // selecting the correct impedance FORMULA among four plausible
    // distractors (wrong sign, wrong operation, inverted) -- positive
    // OFFICIAL_ASSESSMENT evidence that a calculation/formula-recall
    // capability is expected under AC2.2's "impedance" Range item, beyond
    // EL-CONCEPT-IMPEDANCE-001's existing qualitative "understand
    // impedance" depth. Formula independently inspected and verified
    // against OpenStax University Physics Volume 2 Section 15.3 (Equation
    // 15.11) before authoring -- never taken from the assessment item or
    // its answer key, which establish assessability only, never fact.
    id: "EL-REL-IMPEDANCE-001", domain: "EL",
    statement: "The magnitude of the impedance of a series AC circuit is given by Z = sqrt(R^2 + X^2), where R is the circuit's resistance and X is its net reactance.",
    provenance: [
      { locator: "loc-openstax-up2-rlc-series-impedance", role: "DEFINES", supportType: "DIRECT" },
      { locator: "loc-cg-ac2.2", role: "CURRICULUM_REQUIRES" },
    ],
    prereqs: [{ id: "EL-CONCEPT-IMPEDANCE-001", strength: "REQUIRED" }],
    curriculum: [{ node: NODE_AC2_2, type: "REQUIRED_FOR" }, { node: rangeNode("2.2", "IMPEDANCE"), type: "REQUIRED_FOR" }],
  },
  {
    id: "EL-UNIT-HENRY-001", domain: "EL",
    statement: "The henry (H) is the SI derived unit of inductance -- distinct from the ohm, the unit of inductive reactance.",
    provenance: [{ locator: "loc-bipm-derived-units", role: "DEFINES" }, { locator: "loc-cg-ac2.2", role: "CURRICULUM_REQUIRES" }],
    curriculum: [{ node: NODE_AC2_2, type: "REQUIRED_FOR" }, { node: rangeNode("2.2", "INDUCTANCE-REACTANCE"), type: "REQUIRED_FOR" }],
  },
  {
    id: "EL-CONCEPT-INDUCTANCE-001", domain: "EL",
    statement: "Inductance is the property of a conductor or coil that opposes a change in current by storing energy in a magnetic field, measured in henries.",
    provenance: [{ locator: "loc-openstax-up2-ac-circuits", role: "DEFINES" }, { locator: "loc-cg-ac2.2", role: "CURRICULUM_REQUIRES" }],
    supports: [{ id: "EL-UNIT-HENRY-001", strength: "SUPPORTING" }],
    curriculum: [{ node: NODE_AC2_2, type: "REQUIRED_FOR" }, { node: rangeNode("2.2", "INDUCTANCE-REACTANCE"), type: "REQUIRED_FOR" }],
  },
  // -- CC-09B.1: the official Range distinguishes "inductance and
  // inductive reactance" as one item -- inductance (henry) and inductive
  // reactance (ohm) are different quantities with different units, and
  // the generic EL-CONCEPT-REACTANCE-001 assertion never made the
  // inductive-specific frequency relationship explicit (audit 12.D).
  {
    id: "EL-CONCEPT-INDUCTIVE-REACTANCE-001", domain: "EL",
    statement: "Inductive reactance is the opposition an inductor presents to alternating current; it increases as supply frequency increases, and is measured in ohms (not henries, the unit of inductance itself).",
    provenance: [{ locator: "loc-openstax-up2-ac-circuits", role: "DEFINES" }, { locator: "loc-cg-ac2.2", role: "CURRICULUM_REQUIRES" }],
    prereqs: [{ id: "EL-CONCEPT-INDUCTANCE-001", strength: "REQUIRED" }, { id: "EL-CONCEPT-REACTANCE-001", strength: "REQUIRED" }],
    curriculum: [{ node: NODE_AC2_2, type: "REQUIRED_FOR" }, { node: rangeNode("2.2", "INDUCTANCE-REACTANCE"), type: "REQUIRED_FOR" }],
  },
  {
    id: "EL-UNIT-FARAD-001", domain: "EL",
    statement: "The farad (F) is the SI derived unit of capacitance -- distinct from the ohm, the unit of capacitive reactance.",
    provenance: [{ locator: "loc-bipm-derived-units", role: "DEFINES" }, { locator: "loc-cg-ac2.2", role: "CURRICULUM_REQUIRES" }],
    curriculum: [{ node: NODE_AC2_2, type: "REQUIRED_FOR" }, { node: rangeNode("2.2", "CAPACITANCE-REACTANCE"), type: "REQUIRED_FOR" }],
  },
  {
    id: "EL-CONCEPT-CAPACITANCE-001", domain: "EL",
    statement: "Capacitance is the property of a component that describes its ability to store electrical charge in an electric field, measured in farads.",
    provenance: [{ locator: "loc-openstax-up2-ac-circuits", role: "DEFINES" }, { locator: "loc-cg-ac2.2", role: "CURRICULUM_REQUIRES" }],
    supports: [{ id: "EL-UNIT-FARAD-001", strength: "SUPPORTING" }],
    curriculum: [
      { node: NODE_AC2_2, type: "REQUIRED_FOR" },
      { node: rangeNode("2.2", "CAPACITANCE-REACTANCE"), type: "REQUIRED_FOR" },
      // CC-09B: also the LO6 AC6.2 "Capacitors" Range item -- reused
      // rather than re-authoring an electrical-domain duplicate (task's
      // "do not duplicate the same truth" instruction).
      { node: rangeNode("6.2", "CAPACITORS"), type: "REQUIRED_FOR" },
    ],
  },
  {
    id: "EL-CONCEPT-CAPACITIVE-REACTANCE-001", domain: "EL",
    statement: "Capacitive reactance is the opposition a capacitor presents to alternating current; it decreases as supply frequency increases (the opposite frequency behaviour to inductive reactance), and is measured in ohms (not farads, the unit of capacitance itself).",
    provenance: [{ locator: "loc-openstax-up2-ac-circuits", role: "DEFINES" }, { locator: "loc-cg-ac2.2", role: "CURRICULUM_REQUIRES" }],
    prereqs: [{ id: "EL-CONCEPT-CAPACITANCE-001", strength: "REQUIRED" }, { id: "EL-CONCEPT-REACTANCE-001", strength: "REQUIRED" }],
    contrastsWith: ["EL-CONCEPT-INDUCTIVE-REACTANCE-001"],
    curriculum: [{ node: NODE_AC2_2, type: "REQUIRED_FOR" }, { node: rangeNode("2.2", "CAPACITANCE-REACTANCE"), type: "REQUIRED_FOR" }],
  },
  {
    id: "EL-CONCEPT-POWER-FACTOR-001", domain: "EL",
    // CC-09B.1: corrected to the technically primary definition (real
    // power / apparent power); the phase-angle/cosine relationship is
    // the correct explanation only under sinusoidal single-frequency
    // conditions, so it is now stated as a consequence, not the
    // definition itself (audit section 12.B). Its Range mapping was
    // independently re-checked and already correctly targets the
    // "Power factor" Range item (not "Power") -- no mapping defect
    // reproduced against the live corpus; no mapping change made.
    //
    // CC-09B.2 correction (task section 23): re-inspecting OpenStax UP2
    // 15.4 directly found it establishes ONLY the cosine-of-phase-angle
    // form ("cos(phi) is known as the power factor... the amount by which
    // power... is less than the theoretical maximum... due to voltage and
    // current being out of phase") -- it does NOT itself frame power
    // factor as a ratio of real to apparent power. NIST Handbook 44 now
    // supplies that missing clause directly ("power factor (PF): the
    // ratio of active power to apparent power in an AC circuit"), so
    // each clause of this statement now has its own direct evidence
    // rather than one borrowing an unsupported ratio framing from the
    // other's citation.
    //
    // CC-09B.3 (task section 7): re-audited clause-by-clause. NIST HB44
    // fully establishes the ratio-definition clause; OpenStax UP2 15.4
    // fully establishes the cosine-of-phase-angle-under-sinusoidal-supply
    // clause (matching this statement's own "for a sinusoidal single-
    // frequency supply" qualifier). No material clause is left
    // unsupported by either -- confirmed FULLY_SUPPORTED_MULTI_SOURCE.
    statement: "Power factor is the ratio of real (true) power to apparent power in an AC circuit; for a sinusoidal single-frequency supply, this ratio equals the cosine of the phase angle between voltage and current.",
    provenance: [
      { locator: "loc-nist-hb44-power-factor", role: "DEFINES", supportType: "PARTIAL" },
      { locator: "loc-openstax-up2-ac-circuits", role: "DEFINES", supportType: "PARTIAL" },
      { locator: "loc-cg-ac2.2", role: "CURRICULUM_REQUIRES" },
    ],
    clauseCoverage: [
      { clause: "power factor is the ratio of real (active) power to apparent power", locator: "loc-nist-hb44-power-factor" },
      { clause: "for a sinusoidal single-frequency supply, this ratio equals the cosine of the phase angle", locator: "loc-openstax-up2-ac-circuits" },
    ],
    multiSourceFullyCovered: true,
    prereqs: [{ id: "EL-CONCEPT-IMPEDANCE-001", strength: "STRONG" }, { id: "EL-CONCEPT-POWER-001", strength: "STRONG" }],
    curriculum: [{ node: NODE_AC2_2, type: "REQUIRED_FOR" }, { node: rangeNode("2.2", "POWER-FACTOR"), type: "REQUIRED_FOR" }],
  },

  // ===================================================================
  // Electrical -- LO3 bridge: electrical efficiency (2).
  // ===================================================================
  {
    id: "EL-CONCEPT-ELECTRICAL-EFFICIENCY-001", domain: "EL",
    statement: "The efficiency of an electrical device is the ratio of useful power output to electrical power input.",
    provenance: [{ locator: "loc-openstax-up1-power", role: "SUPPORTS" }, { locator: "loc-cg-ac3.3", role: "CURRICULUM_REQUIRES" }],
    prereqs: [{ id: "FP-CONCEPT-EFFICIENCY-001", strength: "REQUIRED" }, { id: "EL-CONCEPT-POWER-001", strength: "REQUIRED" }],
    curriculum: [{ node: NODE_AC3_3, type: "REQUIRED_FOR" }],
  },
  {
    id: "EL-CALC-ELECTRICAL-EFFICIENCY-001", domain: "EL",
    statement: "Calculate the efficiency of an electrical device as a percentage from its useful power output and its power input.",
    provenance: [{ locator: "loc-openstax-up1-power", role: "SUPPORTS" }, { locator: "loc-cg-ac3.4", role: "CURRICULUM_REQUIRES" }],
    prereqs: [{ id: "EL-CONCEPT-ELECTRICAL-EFFICIENCY-001", strength: "REQUIRED" }, { id: "FM-ARITH-PERCENTAGE-001", strength: "REQUIRED" }, { id: "FM-ALG-SUBSTITUTION-001", strength: "REQUIRED" }],
    curriculum: [{ node: NODE_AC3_4, type: "REQUIRED_FOR" }],
  },

  // ===================================================================
  // Electrical -- LO4 cluster: electron theory, resistance/resistivity,
  // Ohm's law, series, parallel, power, thermal/chemical effects (33).
  // ===================================================================
  {
    id: "EL-CONCEPT-ELECTRON-THEORY-001", domain: "EL",
    statement: "Electric current in a conductor is the flow of free electrons, driven by a potential difference across the conductor.",
    provenance: [
      { locator: "loc-openstax-up2-current-general", role: "DEFINES" },
      { locator: "loc-cg-ac4.1", role: "CURRICULUM_REQUIRES" },
    ],
    prereqs: [{ id: "EL-CONCEPT-CURRENT-001", strength: "STRONG" }, { id: "EL-CONCEPT-ATOMIC-CHARGE-STRUCTURE-001", strength: "STRONG" }],
    curriculum: [{ node: NODE_AC4_1, type: "REQUIRED_FOR" }],
  },
  {
    id: "EL-CONCEPT-CONDUCTOR-001", domain: "EL",
    statement: "A conductor is a material containing many free electrons, which allows electric current to flow through it easily.",
    provenance: [
      { locator: "loc-openstax-up2-current-general", role: "DEFINES" },
      { locator: "loc-cg-ac4.2", role: "CURRICULUM_REQUIRES" },
    ],
    prereqs: [{ id: "EL-CONCEPT-ELECTRON-THEORY-001", strength: "STRONG" }],
    contrastsWith: ["EL-CONCEPT-INSULATOR-001"],
    curriculum: [{ node: NODE_AC4_2, type: "REQUIRED_FOR" }],
  },
  {
    id: "EL-CONCEPT-INSULATOR-001", domain: "EL",
    statement: "An insulator is a material with very few free electrons, which strongly opposes the flow of electric current.",
    provenance: [
      { locator: "loc-openstax-up2-current-general", role: "DEFINES" },
      { locator: "loc-cg-ac4.2", role: "CURRICULUM_REQUIRES" },
    ],
    prereqs: [{ id: "EL-CONCEPT-ELECTRON-THEORY-001", strength: "STRONG" }],
    curriculum: [{ node: NODE_AC4_2, type: "REQUIRED_FOR" }],
  },
  {
    id: "EL-RESISTIVITY-RELATIONSHIP-001", domain: "EL",
    statement: "The resistance of a conductor is related to its resistivity, length and cross-sectional area by R = rho times L divided by A.",
    provenance: [
      { locator: "loc-openstax-up2-resistivity-resistance", role: "DEFINES" },
      { locator: "loc-cg-ac4.3", role: "CURRICULUM_REQUIRES" },
    ],
    prereqs: [
      { id: "EL-CONCEPT-RESISTIVITY-001", strength: "REQUIRED" },
      { id: "EL-CONCEPT-RESISTANCE-001", strength: "REQUIRED" },
    ],
    curriculum: [{ node: NODE_AC4_3, type: "REQUIRED_FOR" }],
  },
  {
    id: "EL-OHM-RELATIONSHIP-001", domain: "EL",
    statement: "For a component obeying Ohm's law, potential difference, current and resistance are related by V = I times R.",
    provenance: [
      { locator: "loc-openstax-up2-ohms-law", role: "DEFINES" },
      { locator: "loc-cg-ac4.4", role: "CURRICULUM_REQUIRES" },
    ],
    prereqs: [
      { id: "EL-CONCEPT-VOLTAGE-001", strength: "REQUIRED" },
      { id: "EL-CONCEPT-CURRENT-001", strength: "REQUIRED" },
      { id: "EL-CONCEPT-RESISTANCE-001", strength: "REQUIRED" },
    ],
    curriculum: [{ node: NODE_AC4_4, type: "REQUIRED_FOR" }],
  },
  {
    id: "EL-OHM-PROPORTIONALITY-001", domain: "EL",
    statement: "At constant resistance, current is directly proportional to voltage; at constant voltage, current is inversely proportional to resistance.",
    provenance: [
      { locator: "loc-openstax-up2-ohms-law", role: "SUPPORTS" },
      { locator: "loc-cg-ac4.4", role: "CURRICULUM_REQUIRES" },
    ],
    prereqs: [
      { id: "EL-OHM-RELATIONSHIP-001", strength: "REQUIRED" },
      { id: "FM-ALG-PROPORTION-DIRECT-001", strength: "REQUIRED" },
      { id: "FM-ALG-PROPORTION-INVERSE-001", strength: "REQUIRED" },
    ],
    curriculum: [{ node: NODE_AC4_4, type: "REQUIRED_FOR" }],
  },
  {
    // CC-09B.1: syllabus-only provenance corrected -- each is genuinely
    // DERIVED_FROM EL-OHM-RELATIONSHIP-001 (real OpenStax provenance),
    // per task section 10.
    id: "EL-OHM-REARRANGE-001", domain: "EL",
    statement: "Rearrange V = I times R algebraically to make voltage, current or resistance the subject.",
    provenance: [{ locator: "loc-cg-ac4.5", role: "CURRICULUM_REQUIRES" }],
    prereqs: [
      { id: "EL-OHM-RELATIONSHIP-001", strength: "REQUIRED" },
      { id: "FM-ALG-TRANSPOSE-MULT-001", strength: "REQUIRED" },
    ],
    derivedFrom: ["EL-OHM-RELATIONSHIP-001"],
    derivedFromKind: "MATHEMATICAL",
    curriculum: [
      { node: NODE_AC4_5, type: "REQUIRED_FOR" },
      { node: NODE_AC1_1, type: "EXEMPLIFIES" },
    ],
  },
  {
    id: "EL-OHM-SOLVE-V-001", domain: "EL",
    statement: "Calculate an unknown voltage from known current and resistance using V = I times R.",
    provenance: [{ locator: "loc-cg-ac4.5", role: "CURRICULUM_REQUIRES" }],
    prereqs: [
      { id: "EL-OHM-RELATIONSHIP-001", strength: "REQUIRED" },
      { id: "FM-ALG-SUBSTITUTION-001", strength: "REQUIRED" },
      { id: "FM-NUM-SI-PREFIX-CONVERT-001", strength: "STRONG" },
    ],
    derivedFrom: ["EL-OHM-RELATIONSHIP-001"],
    derivedFromKind: "MATHEMATICAL",
    curriculum: [
      { node: NODE_AC4_5, type: "REQUIRED_FOR" },
      { node: NODE_AC1_1, type: "EXEMPLIFIES" },
    ],
  },
  {
    id: "EL-OHM-SOLVE-I-001", domain: "EL",
    statement: "Calculate an unknown current from known voltage and resistance by rearranging and applying V = I times R.",
    provenance: [{ locator: "loc-cg-ac4.5", role: "CURRICULUM_REQUIRES" }],
    prereqs: [
      { id: "EL-OHM-REARRANGE-001", strength: "REQUIRED" },
      { id: "FM-ALG-SUBSTITUTION-001", strength: "REQUIRED" },
      { id: "FM-NUM-SI-PREFIX-CONVERT-001", strength: "STRONG" },
    ],
    derivedFrom: ["EL-OHM-RELATIONSHIP-001"],
    derivedFromKind: "MATHEMATICAL",
    curriculum: [
      { node: NODE_AC4_5, type: "REQUIRED_FOR" },
      { node: NODE_AC1_1, type: "EXEMPLIFIES" },
    ],
  },
  {
    id: "EL-OHM-SOLVE-R-001", domain: "EL",
    statement: "Calculate an unknown resistance from known voltage and current by rearranging and applying V = I times R.",
    provenance: [{ locator: "loc-cg-ac4.5", role: "CURRICULUM_REQUIRES" }],
    prereqs: [
      { id: "EL-OHM-REARRANGE-001", strength: "REQUIRED" },
      { id: "FM-ALG-SUBSTITUTION-001", strength: "REQUIRED" },
      { id: "FM-NUM-SI-PREFIX-CONVERT-001", strength: "STRONG" },
    ],
    derivedFrom: ["EL-OHM-RELATIONSHIP-001"],
    derivedFromKind: "MATHEMATICAL",
    curriculum: [
      { node: NODE_AC4_5, type: "REQUIRED_FOR" },
      { node: NODE_AC1_1, type: "EXEMPLIFIES" },
    ],
  },
  {
    id: "EL-CIRCUIT-SERIES-STRUCTURE-001", domain: "EL",
    statement: "In a series circuit, components are connected end-to-end so that there is only one path for current to flow.",
    provenance: [
      { locator: "loc-openstax-up2-series-parallel", role: "DEFINES" },
      { locator: "loc-cg-ac4.4", role: "CURRICULUM_REQUIRES" },
    ],
    contrastsWith: ["EL-CIRCUIT-PARALLEL-STRUCTURE-001"],
    curriculum: [{ node: NODE_AC4_4, type: "REQUIRED_FOR" }],
  },
  {
    id: "EL-SERIES-CURRENT-001", domain: "EL",
    statement: "In a series circuit, the same current flows through every component.",
    provenance: [
      { locator: "loc-openstax-up2-series-parallel", role: "DEFINES" },
      { locator: "loc-cg-ac4.4", role: "CURRICULUM_REQUIRES" },
    ],
    prereqs: [
      { id: "EL-CIRCUIT-SERIES-STRUCTURE-001", strength: "REQUIRED" },
      { id: "EL-CONCEPT-CURRENT-001", strength: "STRONG" },
    ],
    curriculum: [{ node: NODE_AC4_4, type: "REQUIRED_FOR" }],
  },
  {
    id: "EL-SERIES-RESISTANCE-001", domain: "EL",
    statement: "The total resistance of resistors connected in series is the sum of the individual resistances: RT = R1 + R2 + ...",
    provenance: [
      { locator: "loc-openstax-up2-series-parallel", role: "DEFINES" },
      { locator: "loc-cg-ac4.4", role: "CURRICULUM_REQUIRES" },
    ],
    prereqs: [
      { id: "EL-CIRCUIT-SERIES-STRUCTURE-001", strength: "REQUIRED" },
      { id: "EL-CONCEPT-RESISTANCE-001", strength: "REQUIRED" },
    ],
    curriculum: [{ node: NODE_AC4_4, type: "REQUIRED_FOR" }],
  },
  {
    id: "EL-SERIES-RESISTANCE-CALC-001", domain: "EL",
    statement: "Calculate the total resistance of resistors connected in series.",
    provenance: [{ locator: "loc-cg-ac4.5", role: "CURRICULUM_REQUIRES" }],
    prereqs: [
      { id: "EL-SERIES-RESISTANCE-001", strength: "REQUIRED" },
      { id: "FM-ALG-SUBSTITUTION-001", strength: "REQUIRED" },
    ],
    derivedFrom: ["EL-SERIES-RESISTANCE-001"],
    derivedFromKind: "MATHEMATICAL",
    curriculum: [
      { node: NODE_AC4_5, type: "REQUIRED_FOR" },
      { node: NODE_AC1_1, type: "EXEMPLIFIES" },
    ],
  },
  {
    id: "EL-INTERPRET-SERIES-RESULT-001", domain: "EL",
    statement: "A calculated total resistance for resistors in series that is less than the largest individual resistance indicates a calculation error, since total series resistance is always at least as great as the largest individual resistance.",
    provenance: [{ locator: "loc-openstax-up2-series-parallel", role: "SUPPORTS" }],
    prereqs: [{ id: "EL-SERIES-RESISTANCE-CALC-001", strength: "STRONG" }],
    curriculum: [{ node: NODE_AC4_5, type: "SUPPORTS" }],
  },
  {
    id: "EL-VOLTAGE-DROP-001", domain: "EL",
    statement: "Voltage drop is the reduction in potential difference across a component or conductor caused by current flowing through its resistance.",
    provenance: [
      { locator: "loc-openstax-up2-ohms-law", role: "DEFINES" },
      { locator: "loc-cg-ac4.7", role: "CURRICULUM_REQUIRES" },
    ],
    prereqs: [{ id: "EL-OHM-RELATIONSHIP-001", strength: "STRONG" }],
    curriculum: [{ node: NODE_AC4_7, type: "REQUIRED_FOR" }],
  },
  {
    id: "EL-SERIES-VOLTAGE-001", domain: "EL",
    statement: "In a series circuit, the supply voltage is shared between the components as individual voltage drops that sum to the supply voltage.",
    provenance: [
      { locator: "loc-openstax-up2-series-parallel", role: "DEFINES" },
      { locator: "loc-cg-ac4.4", role: "CURRICULUM_REQUIRES" },
    ],
    prereqs: [
      { id: "EL-VOLTAGE-DROP-001", strength: "REQUIRED" },
      { id: "EL-CIRCUIT-SERIES-STRUCTURE-001", strength: "REQUIRED" },
      { id: "FM-ALG-TRANSPOSE-ADD-001", strength: "STRONG" },
    ],
    curriculum: [{ node: NODE_AC4_4, type: "REQUIRED_FOR" }],
  },
  {
    // CC-09B.6 (adversarial gap review, task section 30): the official
    // SmartScreen handout (Handouts 4, 7) explicitly names this as
    // Kirchhoff's Voltage Law with worked "law is proved" examples --
    // the arithmetic was already governed (EL-SERIES-VOLTAGE-001); this
    // adds the recognisable name (task section 10), not new substance.
    id: "EL-CONCEPT-KIRCHHOFFS-VOLTAGE-LAW-001", domain: "EL",
    statement: "Kirchhoff's voltage law states that the algebraic sum of the voltages around any closed loop of a circuit is zero -- in a series circuit this means the individual voltage drops sum to the supply voltage.",
    provenance: [
      { locator: "loc-kuphaldt-kirchhoffs-laws", role: "DEFINES", supportType: "DIRECT" },
      { locator: "loc-cg-ac4.4", role: "CURRICULUM_REQUIRES" },
    ],
    prereqs: [{ id: "EL-SERIES-VOLTAGE-001", strength: "REQUIRED" }],
    curriculum: [{ node: NODE_AC4_4, type: "SUPPORTS" }],
  },
  {
    id: "EL-SERIES-VOLTAGE-CALC-001", domain: "EL",
    statement: "Calculate an individual voltage drop across a component in a series circuit.",
    provenance: [{ locator: "loc-cg-ac4.5", role: "CURRICULUM_REQUIRES" }],
    prereqs: [
      { id: "EL-SERIES-VOLTAGE-001", strength: "REQUIRED" },
      { id: "EL-OHM-SOLVE-V-001", strength: "REQUIRED" },
    ],
    derivedFrom: ["EL-SERIES-VOLTAGE-001", "EL-OHM-RELATIONSHIP-001"],
    derivedFromKind: "MATHEMATICAL",
    curriculum: [
      { node: NODE_AC4_5, type: "REQUIRED_FOR" },
      { node: NODE_AC1_1, type: "EXEMPLIFIES" },
    ],
  },
  {
    id: "EL-CIRCUIT-PARALLEL-STRUCTURE-001", domain: "EL",
    statement: "In a parallel circuit, components are connected between the same two points, providing more than one path for current to flow.",
    provenance: [
      { locator: "loc-openstax-up2-series-parallel", role: "DEFINES" },
      { locator: "loc-cg-ac4.4", role: "CURRICULUM_REQUIRES" },
    ],
    curriculum: [{ node: NODE_AC4_4, type: "REQUIRED_FOR" }],
  },
  {
    id: "EL-PARALLEL-VOLTAGE-001", domain: "EL",
    statement: "In a parallel circuit, the potential difference is the same across every branch.",
    provenance: [
      { locator: "loc-openstax-up2-series-parallel", role: "DEFINES" },
      { locator: "loc-cg-ac4.4", role: "CURRICULUM_REQUIRES" },
    ],
    prereqs: [
      { id: "EL-CIRCUIT-PARALLEL-STRUCTURE-001", strength: "REQUIRED" },
      { id: "EL-CONCEPT-VOLTAGE-001", strength: "STRONG" },
    ],
    curriculum: [{ node: NODE_AC4_4, type: "REQUIRED_FOR" }],
  },
  {
    id: "EL-PARALLEL-CURRENT-001", domain: "EL",
    statement: "In a parallel circuit, the supply current divides between the branches, and the branch currents sum to the total current.",
    provenance: [
      { locator: "loc-openstax-up2-series-parallel", role: "DEFINES" },
      { locator: "loc-cg-ac4.4", role: "CURRICULUM_REQUIRES" },
    ],
    prereqs: [
      { id: "EL-CIRCUIT-PARALLEL-STRUCTURE-001", strength: "REQUIRED" },
      { id: "EL-CONCEPT-CURRENT-001", strength: "REQUIRED" },
      { id: "FM-ALG-TRANSPOSE-ADD-001", strength: "STRONG" },
    ],
    curriculum: [{ node: NODE_AC4_4, type: "REQUIRED_FOR" }],
  },
  {
    // CC-09B.6 (adversarial gap review, task section 30): as
    // EL-CONCEPT-KIRCHHOFFS-VOLTAGE-LAW-001 above, for the current
    // analogue (Handout 5).
    id: "EL-CONCEPT-KIRCHHOFFS-CURRENT-LAW-001", domain: "EL",
    statement: "Kirchhoff's current law states that the algebraic sum of the currents entering and leaving any point in a circuit is zero -- in a parallel circuit this means the branch currents sum to the total supply current.",
    provenance: [
      { locator: "loc-kuphaldt-kirchhoffs-laws", role: "DEFINES", supportType: "DIRECT" },
      { locator: "loc-cg-ac4.4", role: "CURRICULUM_REQUIRES" },
    ],
    prereqs: [{ id: "EL-PARALLEL-CURRENT-001", strength: "REQUIRED" }],
    curriculum: [{ node: NODE_AC4_4, type: "SUPPORTS" }],
  },
  {
    id: "EL-PARALLEL-RESISTANCE-001", domain: "EL",
    statement: "The reciprocal of the total resistance of resistors connected in parallel equals the sum of the reciprocals of the individual branch resistances.",
    provenance: [
      { locator: "loc-openstax-up2-series-parallel", role: "DEFINES" },
      { locator: "loc-cg-ac4.4", role: "CURRICULUM_REQUIRES" },
    ],
    prereqs: [
      { id: "EL-CIRCUIT-PARALLEL-STRUCTURE-001", strength: "REQUIRED" },
      { id: "EL-CONCEPT-RESISTANCE-001", strength: "REQUIRED" },
      { id: "FM-ARITH-RECIPROCAL-001", strength: "REQUIRED" },
    ],
    curriculum: [{ node: NODE_AC4_4, type: "REQUIRED_FOR" }],
  },
  {
    id: "EL-PARALLEL-RESISTANCE-CALC-001", domain: "EL",
    statement: "Calculate the total resistance of resistors connected in parallel.",
    provenance: [
      { locator: "loc-cg-ac4.5", role: "CURRICULUM_REQUIRES" },
      { locator: "loc-openstax-up2-series-parallel", role: "SUPPORTS" },
    ],
    // CC-08: FM-ALG-TRANSPOSE-ADD-001 added as a REQUIRED prereq alongside
    // the existing reciprocal-arithmetic prereqs -- solving for a missing
    // branch (1/Rx = 1/Rt - sum of the other branches' reciprocals) is
    // genuine additive-relationship rearrangement, not only reciprocal/
    // invert arithmetic. Mirrors the same prereq already declared on
    // EL-SERIES-VOLTAGE-001 / EL-SERIES-RESISTANCE-001's own rearrangement
    // needs, giving series and parallel a shared, explicit foundational
    // dependency for the CC-08 cross-lesson adaptive vertical.
    prereqs: [
      { id: "EL-PARALLEL-RESISTANCE-001", strength: "REQUIRED" },
      { id: "FM-ARITH-RECIPROCAL-SUM-001", strength: "REQUIRED" },
      { id: "FM-ARITH-RECIPROCAL-INVERT-001", strength: "REQUIRED" },
      { id: "FM-ALG-TRANSPOSE-ADD-001", strength: "REQUIRED" },
    ],
    curriculum: [
      { node: NODE_AC4_5, type: "REQUIRED_FOR" },
      { node: NODE_AC1_1, type: "EXEMPLIFIES" },
    ],
  },
  {
    id: "EL-INTERPRET-PARALLEL-RESULT-001", domain: "EL",
    statement: "A calculated total resistance for resistors in parallel that is greater than the smallest branch resistance indicates a calculation error, since total parallel resistance is always less than the smallest branch resistance.",
    provenance: [{ locator: "loc-openstax-up2-series-parallel", role: "SUPPORTS" }],
    prereqs: [{ id: "EL-PARALLEL-RESISTANCE-CALC-001", strength: "STRONG" }],
    curriculum: [{ node: NODE_AC4_5, type: "SUPPORTS" }],
  },
  {
    id: "EL-PARALLEL-CURRENT-CALC-001", domain: "EL",
    statement: "Calculate an individual branch current in a parallel circuit.",
    provenance: [{ locator: "loc-cg-ac4.5", role: "CURRICULUM_REQUIRES" }],
    prereqs: [
      { id: "EL-PARALLEL-CURRENT-001", strength: "REQUIRED" },
      { id: "EL-OHM-SOLVE-I-001", strength: "REQUIRED" },
    ],
    derivedFrom: ["EL-PARALLEL-CURRENT-001", "EL-OHM-RELATIONSHIP-001"],
    derivedFromKind: "MATHEMATICAL",
    curriculum: [
      { node: NODE_AC4_5, type: "REQUIRED_FOR" },
      { node: NODE_AC1_1, type: "EXEMPLIFIES" },
    ],
  },
  {
    id: "EL-POWER-RELATIONSHIP-001", domain: "EL",
    statement: "Electrical power is related to voltage and current by P = V times I.",
    provenance: [
      { locator: "loc-openstax-up2-power-energy", role: "DEFINES" },
      { locator: "loc-cg-ac4.6", role: "CURRICULUM_REQUIRES" },
    ],
    prereqs: [
      { id: "EL-CONCEPT-POWER-001", strength: "REQUIRED" },
      { id: "EL-CONCEPT-VOLTAGE-001", strength: "REQUIRED" },
      { id: "EL-CONCEPT-CURRENT-001", strength: "REQUIRED" },
    ],
    curriculum: [{ node: NODE_AC4_6, type: "REQUIRED_FOR" }],
  },
  {
    id: "EL-POWER-REARRANGE-001", domain: "EL",
    statement: "Rearrange P = V times I algebraically to make voltage or current the subject.",
    provenance: [{ locator: "loc-cg-ac4.6", role: "CURRICULUM_REQUIRES" }],
    prereqs: [
      { id: "EL-POWER-RELATIONSHIP-001", strength: "REQUIRED" },
      { id: "FM-ALG-TRANSPOSE-MULT-001", strength: "REQUIRED" },
    ],
    derivedFrom: ["EL-POWER-RELATIONSHIP-001"],
    derivedFromKind: "MATHEMATICAL",
    curriculum: [
      { node: NODE_AC4_6, type: "REQUIRED_FOR" },
      { node: NODE_AC1_1, type: "EXEMPLIFIES" },
    ],
  },
  {
    id: "EL-POWER-SOLVE-001", domain: "EL",
    statement: "Calculate electrical power from known voltage and current using P = V times I.",
    provenance: [{ locator: "loc-cg-ac4.6", role: "CURRICULUM_REQUIRES" }],
    prereqs: [
      { id: "EL-POWER-RELATIONSHIP-001", strength: "REQUIRED" },
      { id: "FM-ALG-SUBSTITUTION-001", strength: "REQUIRED" },
    ],
    derivedFrom: ["EL-POWER-RELATIONSHIP-001"],
    derivedFromKind: "MATHEMATICAL",
    curriculum: [
      { node: NODE_AC4_6, type: "REQUIRED_FOR" },
      { node: NODE_AC1_1, type: "EXEMPLIFIES" },
    ],
  },
  {
    id: "EL-POWER-DERIVED-VIR-001", domain: "EL",
    statement: "Electrical power can also be found from current and resistance alone, since combining P = V times I with V = I times R gives P = I squared times R.",
    provenance: [{ locator: "loc-openstax-up2-power-energy", role: "SUPPORTS" }],
    derivedFrom: ["EL-POWER-RELATIONSHIP-001", "EL-OHM-RELATIONSHIP-001"],
    derivedFromKind: "MATHEMATICAL",
    curriculum: [{ node: NODE_AC4_6, type: "REQUIRED_FOR" }],
  },
  {
    id: "EL-POWER-SOLVE-IR-001", domain: "EL",
    statement: "Calculate electrical power from known current and resistance using P = I squared times R.",
    provenance: [{ locator: "loc-cg-ac4.6", role: "CURRICULUM_REQUIRES" }],
    prereqs: [
      { id: "EL-POWER-DERIVED-VIR-001", strength: "REQUIRED" },
      { id: "FM-ALG-SUBSTITUTION-001", strength: "REQUIRED" },
    ],
    derivedFrom: ["EL-POWER-DERIVED-VIR-001"],
    derivedFromKind: "MATHEMATICAL",
    curriculum: [
      { node: NODE_AC4_6, type: "REQUIRED_FOR" },
      { node: NODE_AC1_1, type: "EXEMPLIFIES" },
    ],
  },
  {
    id: "EL-CIRCUIT-POWER-TOTAL-001", domain: "EL",
    statement: "The total power dissipated in a circuit is the sum of the power dissipated in each individual component, regardless of whether the components are connected in series or parallel.",
    provenance: [
      { locator: "loc-openstax-up2-power-energy", role: "SUPPORTS" },
      { locator: "loc-cg-ac4.6", role: "CURRICULUM_REQUIRES" },
    ],
    prereqs: [{ id: "EL-POWER-SOLVE-001", strength: "REQUIRED" }],
    curriculum: [{ node: NODE_AC4_6, type: "REQUIRED_FOR" }],
  },
  {
    // CC-09B.4: retargeted to UP2's dedicated Electrical Energy and Power
    // section, which directly states "electrical energy is converted into
    // thermal energy within the conductor" -- the more precise locator
    // for this exact clause than the generic Ch.9 introduction.
    id: "EL-CURRENT-THERMAL-EFFECT-001", domain: "EL",
    statement: "Current flowing through a resistance causes heating, because electrical energy is converted into heat energy.",
    provenance: [
      { locator: "loc-openstax-up2-fuse-breaker-mechanism", role: "DEFINES", supportType: "DIRECT" },
      { locator: "loc-cg-ac4.8", role: "CURRICULUM_REQUIRES" },
    ],
    prereqs: [
      { id: "EL-CONCEPT-RESISTANCE-001", strength: "STRONG" },
      { id: "EL-CONCEPT-ENERGY-001", strength: "STRONG" },
    ],
    curriculum: [{ node: NODE_AC4_8, type: "REQUIRED_FOR" }],
  },
  {
    // CC-09B.4 correction (task section 2.A): the generic "Ch.9
    // introduction" physics locator did not itself establish the
    // electrolysis claim (re-inspected directly: confirmed, it covers
    // current/resistance/conductors, not electrochemistry). Re-sourced to
    // OpenStax Chemistry 2e's dedicated Electrolysis section.
    id: "EL-CURRENT-CHEMICAL-EFFECT-001", domain: "EL",
    statement: "Current flowing through certain solutions (electrolytes) causes chemical changes, a process known as electrolysis.",
    provenance: [
      { locator: "loc-openstax-chemistry-electrolysis", role: "DEFINES", supportType: "DIRECT" },
      { locator: "loc-cg-ac4.8", role: "CURRICULUM_REQUIRES" },
    ],
    prereqs: [{ id: "EL-CONCEPT-CURRENT-001", strength: "STRONG" }],
    curriculum: [{ node: NODE_AC4_8, type: "REQUIRED_FOR" }],
  },

  // ===================================================================
  // Electrical -- LO4 deepening: charge/electron theory, resistivity
  // interpretation, selection/comparison/prediction capabilities,
  // equivalent-resistance synthesis, dividers, compound application,
  // power/energy derived forms, fault recognition, protective devices.
  // Decomposed by capability type (CC-04B), not by adding more Ohm's-law
  // variants.
  // ===================================================================
  {
    id: "EL-CONCEPT-CHARGE-001", domain: "EL",
    statement: "Electric charge is a fundamental property of matter that causes it to experience a force in an electric field, and can be positive or negative.",
    provenance: [{ locator: "loc-openstax-up2-current-general", role: "DEFINES" }, { locator: "loc-cg-ac4.1", role: "CURRICULUM_REQUIRES" }],
    curriculum: [{ node: NODE_AC4_1, type: "REQUIRED_FOR" }],
  },
  // CC-09B.1: AC4.1's own "basic principles of electron theory" needs the
  // minimal atomic charge context grounding EL-CONCEPT-ELECTRON-THEORY-001's
  // "flow of free electrons" claim (audit section 14.A) -- an atom's
  // structure was never stated, only asserted for. Kept minimal: no
  // atomic-physics course, one proposition.
  {
    id: "EL-CONCEPT-ATOMIC-CHARGE-STRUCTURE-001", domain: "EL",
    statement: "An atom consists of a nucleus containing positively charged protons, surrounded by negatively charged electrons; in a conductor, some of these electrons are only loosely bound to their atoms and are free to move.",
    provenance: [{ locator: "loc-openstax-up2-current-general", role: "DEFINES" }, { locator: "loc-cg-ac4.1", role: "CURRICULUM_REQUIRES" }],
    prereqs: [{ id: "EL-CONCEPT-CHARGE-001", strength: "REQUIRED" }],
    curriculum: [{ node: NODE_AC4_1, type: "REQUIRED_FOR" }],
  },
  {
    id: "EL-UNIT-COULOMB-001", domain: "EL",
    statement: "The coulomb (C) is the SI derived unit of electric charge.",
    provenance: [{ locator: "loc-bipm-derived-units", role: "DEFINES" }, { locator: "loc-cg-ac2.2", role: "CURRICULUM_REQUIRES" }],
    supports: [{ id: "EL-CONCEPT-CHARGE-001", strength: "SUPPORTING" }],
    curriculum: [{ node: NODE_AC2_2, type: "REQUIRED_FOR" }],
  },
  {
    id: "EL-CURRENT-CHARGE-RELATIONSHIP-001", domain: "EL",
    statement: "Electric current equals the rate of flow of charge: I = Q divided by t.",
    provenance: [{ locator: "loc-openstax-up2-current-general", role: "DEFINES" }, { locator: "loc-cg-ac4.1", role: "CURRICULUM_REQUIRES" }],
    prereqs: [{ id: "EL-CONCEPT-CHARGE-001", strength: "REQUIRED" }, { id: "EL-CONCEPT-CURRENT-001", strength: "REQUIRED" }],
    curriculum: [{ node: NODE_AC4_1, type: "REQUIRED_FOR" }],
  },
  {
    id: "EL-CURRENT-CHARGE-CALC-001", domain: "EL",
    statement: "Calculate charge or current from the relationship I = Q divided by t, given the other two quantities.",
    provenance: [{ locator: "loc-cg-ac4.5", role: "CURRICULUM_REQUIRES" }],
    prereqs: [{ id: "EL-CURRENT-CHARGE-RELATIONSHIP-001", strength: "REQUIRED" }, { id: "FM-ALG-TRANSPOSE-MULT-001", strength: "REQUIRED" }, { id: "FM-ALG-SUBSTITUTION-001", strength: "REQUIRED" }],
    derivedFrom: ["EL-CURRENT-CHARGE-RELATIONSHIP-001"],
    derivedFromKind: "MATHEMATICAL",
    curriculum: [{ node: NODE_AC4_5, type: "REQUIRED_FOR" }, { node: NODE_AC1_1, type: "EXEMPLIFIES" }],
  },
  // CC-09B.4 correction (task section 2.B): the generic Ch.9-introduction
  // locator named no specific materials at all. Copper/aluminium/rubber
  // are now directly evidenced by OpenStax UP2's own resistivity Table
  // 9.1 (a real physics reference table naming these exact materials by
  // category); PVC specifically is an installation-practice fact a
  // physics table cannot itself establish, so it is separately evidenced
  // by a real, BS 6004-compliant, installation-labelled manufacturer
  // cable datasheet (Prysmian 6242Y) -- two sources, each covering
  // different named materials, re-confirmed to jointly cover every
  // material named in the statement (multiSourceFullyCovered).
  {
    id: "EL-MATERIAL-CONDUCTOR-INSULATOR-EXAMPLES-001", domain: "EL",
    statement: "Common conductors used in electrical installation work include copper and aluminium; common insulators include PVC and rubber.",
    provenance: [
      { locator: "loc-openstax-up2-resistivity-table-materials", role: "SUPPORTS", supportType: "PARTIAL" },
      { locator: "loc-prysmian-6242y-construction", role: "SUPPORTS", supportType: "PARTIAL" },
      { locator: "loc-cg-ac4.2", role: "CURRICULUM_REQUIRES" },
    ],
    multiSourceFullyCovered: true,
    clauseCoverage: [
      { clause: "copper and aluminium are conductors; rubber is an insulator", locator: "loc-openstax-up2-resistivity-table-materials" },
      { clause: "PVC is an insulator used for cable conductor/sheath insulation in real electrical installation cable", locator: "loc-prysmian-6242y-construction" },
    ],
    prereqs: [{ id: "EL-CONCEPT-CONDUCTOR-001", strength: "STRONG" }, { id: "EL-CONCEPT-INSULATOR-001", strength: "STRONG" }],
    curriculum: [{ node: NODE_AC4_2, type: "REQUIRED_FOR" }],
  },
  {
    id: "EL-CONDUCTOR-RESISTANCE-FACTORS-001", domain: "EL",
    statement: "The resistance of a conductor depends on its length, its cross-sectional area, its resistivity and its temperature.",
    provenance: [{ locator: "loc-openstax-up2-resistivity-resistance", role: "SUPPORTS" }, { locator: "loc-cg-ac4.3", role: "CURRICULUM_REQUIRES" }],
    prereqs: [{ id: "EL-RESISTIVITY-RELATIONSHIP-001", strength: "STRONG" }],
    curriculum: [{ node: NODE_AC4_3, type: "REQUIRED_FOR" }],
  },
  {
    id: "EL-RESISTIVITY-COMPARE-MATERIALS-001", domain: "EL",
    statement: "Compare the resistivity of different materials to determine which is the better conductor: a lower resistivity indicates a better conductor.",
    provenance: [{ locator: "loc-openstax-up2-resistivity-resistance", role: "SUPPORTS" }, { locator: "loc-cg-ac4.3", role: "CURRICULUM_REQUIRES" }],
    prereqs: [{ id: "EL-CONCEPT-RESISTIVITY-001", strength: "REQUIRED" }],
    curriculum: [{ node: NODE_AC4_3, type: "SUPPORTS" }],
  },
  {
    id: "EL-RESISTIVITY-LENGTH-EFFECT-001", domain: "EL",
    statement: "Increasing the length of a conductor increases its resistance, since resistance is directly proportional to length.",
    provenance: [{ locator: "loc-openstax-up2-resistivity-resistance", role: "SUPPORTS" }, { locator: "loc-cg-ac4.3", role: "CURRICULUM_REQUIRES" }],
    prereqs: [{ id: "EL-RESISTIVITY-RELATIONSHIP-001", strength: "REQUIRED" }, { id: "FM-ALG-PROPORTION-DIRECT-001", strength: "REQUIRED" }],
    curriculum: [{ node: NODE_AC4_3, type: "SUPPORTS" }],
  },
  {
    id: "EL-RESISTIVITY-AREA-EFFECT-001", domain: "EL",
    statement: "Increasing the cross-sectional area of a conductor decreases its resistance, since resistance is inversely proportional to cross-sectional area.",
    provenance: [{ locator: "loc-openstax-up2-resistivity-resistance", role: "SUPPORTS" }, { locator: "loc-cg-ac4.3", role: "CURRICULUM_REQUIRES" }],
    prereqs: [{ id: "EL-RESISTIVITY-RELATIONSHIP-001", strength: "REQUIRED" }, { id: "FM-ALG-PROPORTION-INVERSE-001", strength: "REQUIRED" }],
    curriculum: [{ node: NODE_AC4_3, type: "SUPPORTS" }],
  },
  {
    // CC-09B.4 correction (task section 2.C): re-sourced from the generic
    // current-chapter locator to OpenStax UP2's dedicated dielectric-
    // breakdown section, which explicitly defines dielectric strength,
    // the ionization/breakdown mechanism, and the resulting voltage
    // limit -- exactly this assertion's whole material proposition.
    id: "EL-INSULATOR-BREAKDOWN-001", domain: "EL",
    statement: "If the voltage across an insulator becomes too high, the insulator can break down and allow current to flow, which is why insulation has a rated maximum voltage.",
    provenance: [
      { locator: "loc-openstax-up2-dielectric-breakdown", role: "DEFINES", supportType: "DIRECT" },
      { locator: "loc-cg-ac4.2", role: "CURRICULUM_REQUIRES" },
    ],
    prereqs: [{ id: "EL-CONCEPT-INSULATOR-001", strength: "REQUIRED" }],
    curriculum: [{ node: NODE_AC4_2, type: "SUPPORTS" }],
  },
  {
    id: "EL-OHM-SELECT-RELATIONSHIP-001", domain: "EL",
    statement: "Select the correct arrangement of V = I times R to use, based on which two quantities are known and which quantity is required.",
    provenance: [{ locator: "loc-cg-ac4.5", role: "CURRICULUM_REQUIRES" }],
    prereqs: [{ id: "EL-OHM-RELATIONSHIP-001", strength: "REQUIRED" }],
    derivedFrom: ["EL-OHM-RELATIONSHIP-001"],
    derivedFromKind: "LOGICAL_DEFINITIONAL",
    curriculum: [{ node: NODE_AC4_5, type: "REQUIRED_FOR" }, { node: NODE_AC1_1, type: "EXEMPLIFIES" }],
  },
  {
    id: "EL-CIRCUIT-SELECT-CONFIGURATION-001", domain: "EL",
    statement: "Identify whether a given circuit diagram or description shows components connected in series or in parallel.",
    provenance: [{ locator: "loc-openstax-up2-series-parallel", role: "SUPPORTS" }, { locator: "loc-cg-ac4.4", role: "CURRICULUM_REQUIRES" }],
    prereqs: [{ id: "EL-CIRCUIT-SERIES-STRUCTURE-001", strength: "REQUIRED" }, { id: "EL-CIRCUIT-PARALLEL-STRUCTURE-001", strength: "REQUIRED" }],
    curriculum: [{ node: NODE_AC4_4, type: "SUPPORTS" }],
  },
  {
    id: "EL-CIRCUIT-EQUIVALENT-RESISTANCE-DEFINITION-001", domain: "EL",
    statement: "The equivalent resistance of a network of resistors is the single resistance value that would draw the same current from the same supply voltage as the whole network.",
    provenance: [{ locator: "loc-openstax-up2-series-parallel", role: "DEFINES" }, { locator: "loc-cg-ac4.4", role: "CURRICULUM_REQUIRES" }],
    curriculum: [{ node: NODE_AC4_4, type: "REQUIRED_FOR" }],
  },
  {
    id: "EL-CIRCUIT-MIXED-SERIES-PARALLEL-RECOGNITION-001", domain: "EL",
    statement: "Some circuits combine both series-connected and parallel-connected sections within the same network.",
    provenance: [{ locator: "loc-openstax-up2-series-parallel", role: "SUPPORTS" }, { locator: "loc-cg-ac4.4", role: "CURRICULUM_REQUIRES" }],
    prereqs: [{ id: "EL-CIRCUIT-SERIES-STRUCTURE-001", strength: "REQUIRED" }, { id: "EL-CIRCUIT-PARALLEL-STRUCTURE-001", strength: "REQUIRED" }],
    curriculum: [{ node: NODE_AC4_4, type: "SUPPORTS" }],
  },
  {
    id: "EL-CIRCUIT-TRACE-CURRENT-PATH-001", domain: "EL",
    statement: "Trace the path or paths current takes through a given series or parallel circuit diagram.",
    provenance: [{ locator: "loc-openstax-up2-series-parallel", role: "SUPPORTS" }, { locator: "loc-cg-ac4.4", role: "CURRICULUM_REQUIRES" }],
    prereqs: [{ id: "EL-CIRCUIT-SELECT-CONFIGURATION-001", strength: "STRONG" }],
    curriculum: [{ node: NODE_AC4_4, type: "SUPPORTS" }],
  },
  {
    id: "EL-CIRCUIT-COMPARE-RESISTANCE-001", domain: "EL",
    statement: "Compare how the total resistance of the same set of resistors differs when connected in series versus in parallel: the parallel total is always lower than the series total.",
    provenance: [{ locator: "loc-openstax-up2-series-parallel", role: "SUPPORTS" }, { locator: "loc-cg-ac4.4", role: "CURRICULUM_REQUIRES" }],
    prereqs: [{ id: "EL-SERIES-RESISTANCE-001", strength: "REQUIRED" }, { id: "EL-PARALLEL-RESISTANCE-001", strength: "REQUIRED" }],
    curriculum: [{ node: NODE_AC4_4, type: "SUPPORTS" }],
  },
  {
    id: "EL-CIRCUIT-COMPARE-CURRENT-001", domain: "EL",
    statement: "Compare current behaviour in series versus parallel circuits: current is the same throughout a series circuit, but divides between branches in a parallel circuit.",
    provenance: [{ locator: "loc-openstax-up2-series-parallel", role: "SUPPORTS" }, { locator: "loc-cg-ac4.4", role: "CURRICULUM_REQUIRES" }],
    prereqs: [{ id: "EL-SERIES-CURRENT-001", strength: "REQUIRED" }, { id: "EL-PARALLEL-CURRENT-001", strength: "REQUIRED" }],
    curriculum: [{ node: NODE_AC4_4, type: "SUPPORTS" }],
  },
  {
    id: "EL-CIRCUIT-COMPARE-VOLTAGE-001", domain: "EL",
    statement: "Compare voltage behaviour in series versus parallel circuits: voltage divides between components in a series circuit, but is the same across every branch of a parallel circuit.",
    provenance: [{ locator: "loc-openstax-up2-series-parallel", role: "SUPPORTS" }, { locator: "loc-cg-ac4.4", role: "CURRICULUM_REQUIRES" }],
    prereqs: [{ id: "EL-SERIES-VOLTAGE-001", strength: "REQUIRED" }, { id: "EL-PARALLEL-VOLTAGE-001", strength: "REQUIRED" }],
    curriculum: [{ node: NODE_AC4_4, type: "SUPPORTS" }],
  },
  {
    id: "EL-CIRCUIT-COMPARE-POWER-001", domain: "EL",
    statement: "Compare the total power dissipated by the same set of resistors at the same supply voltage when connected in series versus in parallel.",
    provenance: [{ locator: "loc-openstax-up2-power-energy", role: "SUPPORTS" }, { locator: "loc-cg-ac4.6", role: "CURRICULUM_REQUIRES" }],
    prereqs: [{ id: "EL-CIRCUIT-COMPARE-RESISTANCE-001", strength: "STRONG" }, { id: "EL-CIRCUIT-POWER-TOTAL-001", strength: "REQUIRED" }],
    curriculum: [{ node: NODE_AC4_6, type: "SUPPORTS" }],
  },
  {
    id: "EL-CIRCUIT-COMPARE-ENERGY-001", domain: "EL",
    statement: "Compare the total electrical energy transferred over a given time by the same set of resistors when connected in series versus in parallel at the same supply voltage.",
    provenance: [{ locator: "loc-openstax-up2-power-energy", role: "SUPPORTS" }, { locator: "loc-cg-ac4.6", role: "CURRICULUM_REQUIRES" }],
    prereqs: [{ id: "EL-CIRCUIT-COMPARE-POWER-001", strength: "STRONG" }],
    curriculum: [{ node: NODE_AC4_6, type: "SUPPORTS" }],
  },
  {
    id: "EL-SERIES-DOMINANT-RESISTOR-001", domain: "EL",
    statement: "In a series circuit, since current is equal throughout, the component with the greatest resistance has the greatest voltage drop and dissipates the most power.",
    provenance: [{ locator: "loc-openstax-up2-series-parallel", role: "SUPPORTS" }, { locator: "loc-cg-ac4.4", role: "CURRICULUM_REQUIRES" }],
    prereqs: [{ id: "EL-SERIES-VOLTAGE-001", strength: "REQUIRED" }, { id: "EL-POWER-DERIVED-VIR-001", strength: "STRONG" }],
    curriculum: [{ node: NODE_AC4_4, type: "SUPPORTS" }],
  },
  {
    id: "EL-PARALLEL-DOMINANT-RESISTOR-001", domain: "EL",
    statement: "In a parallel circuit, since voltage is equal across every branch, the branch with the smallest resistance carries the largest current and dissipates the most power.",
    provenance: [{ locator: "loc-openstax-up2-series-parallel", role: "SUPPORTS" }, { locator: "loc-cg-ac4.4", role: "CURRICULUM_REQUIRES" }],
    prereqs: [{ id: "EL-PARALLEL-CURRENT-001", strength: "REQUIRED" }, { id: "EL-POWER-DERIVED-V2R-001", strength: "STRONG" }],
    curriculum: [{ node: NODE_AC4_4, type: "SUPPORTS" }],
  },
  {
    id: "EL-SERIES-PREDICT-OPEN-001", domain: "EL",
    statement: "Predict the effect on current if a series circuit is broken (open-circuited) at any point: current stops flowing throughout the whole circuit.",
    provenance: [{ locator: "loc-openstax-up2-series-parallel", role: "SUPPORTS" }, { locator: "loc-cg-ac4.4", role: "CURRICULUM_REQUIRES" }],
    prereqs: [{ id: "EL-CIRCUIT-SERIES-STRUCTURE-001", strength: "REQUIRED" }, { id: "EL-SERIES-CURRENT-001", strength: "STRONG" }],
    contrastsWith: ["EL-PARALLEL-PREDICT-OPEN-001"],
    curriculum: [{ node: NODE_AC4_4, type: "SUPPORTS" }],
  },
  {
    id: "EL-PARALLEL-PREDICT-OPEN-001", domain: "EL",
    statement: "Predict the effect on the remaining branches if one branch of a parallel circuit is broken (open-circuited): current continues to flow unaffected in the other branches.",
    provenance: [{ locator: "loc-openstax-up2-series-parallel", role: "SUPPORTS" }, { locator: "loc-cg-ac4.4", role: "CURRICULUM_REQUIRES" }],
    prereqs: [{ id: "EL-CIRCUIT-PARALLEL-STRUCTURE-001", strength: "REQUIRED" }, { id: "EL-PARALLEL-VOLTAGE-001", strength: "STRONG" }],
    curriculum: [{ node: NODE_AC4_4, type: "SUPPORTS" }],
  },
  {
    id: "EL-SERIES-PREDICT-ADD-RESISTOR-001", domain: "EL",
    statement: "Predict the effect on supply current of adding an extra resistor in series: total resistance increases, so supply current decreases.",
    provenance: [{ locator: "loc-openstax-up2-series-parallel", role: "SUPPORTS" }, { locator: "loc-cg-ac4.4", role: "CURRICULUM_REQUIRES" }],
    prereqs: [{ id: "EL-SERIES-RESISTANCE-001", strength: "REQUIRED" }, { id: "EL-OHM-PROPORTIONALITY-001", strength: "STRONG" }],
    contrastsWith: ["EL-PARALLEL-PREDICT-ADD-RESISTOR-001"],
    curriculum: [{ node: NODE_AC4_4, type: "SUPPORTS" }],
  },
  {
    id: "EL-PARALLEL-PREDICT-ADD-RESISTOR-001", domain: "EL",
    statement: "Predict the effect on supply current of adding an extra branch resistor in parallel: total resistance decreases, so supply current increases.",
    provenance: [{ locator: "loc-openstax-up2-series-parallel", role: "SUPPORTS" }, { locator: "loc-cg-ac4.4", role: "CURRICULUM_REQUIRES" }],
    prereqs: [{ id: "EL-PARALLEL-RESISTANCE-001", strength: "REQUIRED" }, { id: "EL-OHM-PROPORTIONALITY-001", strength: "STRONG" }],
    curriculum: [{ node: NODE_AC4_4, type: "SUPPORTS" }],
  },
  {
    id: "EL-CIRCUIT-RECOGNISE-SHORT-CIRCUIT-001", domain: "EL",
    statement: "Recognise a short circuit as an unintended low-resistance path that causes abnormally high current to flow.",
    provenance: [{ locator: "loc-openstax-up2-series-parallel", role: "SUPPORTS" }, { locator: "loc-cg-ac4.4", role: "CURRICULUM_REQUIRES" }],
    prereqs: [{ id: "EL-CONCEPT-RESISTANCE-001", strength: "STRONG" }],
    contrastsWith: ["EL-CIRCUIT-RECOGNISE-OPEN-CIRCUIT-001"],
    curriculum: [{ node: NODE_AC4_4, type: "SUPPORTS" }],
  },
  {
    id: "EL-CIRCUIT-RECOGNISE-OPEN-CIRCUIT-001", domain: "EL",
    statement: "Recognise an open circuit as an unintended break in the current path that prevents current from flowing.",
    provenance: [{ locator: "loc-openstax-up2-series-parallel", role: "SUPPORTS" }, { locator: "loc-cg-ac4.4", role: "CURRICULUM_REQUIRES" }],
    curriculum: [{ node: NODE_AC4_4, type: "SUPPORTS" }],
  },
  {
    // CC-09B.4: retargeted from the generic current-chapter locator to
    // UP2's dedicated household-wiring-safety section, which directly
    // discusses short circuits causing wire overheating and the role of
    // protective devices in a real installation-safety context.
    id: "EL-CIRCUIT-PREDICT-SHORT-EFFECT-001", domain: "EL",
    statement: "Predict the effect of a short circuit occurring across a component: current increases sharply and may cause damage or operate a protective device.",
    provenance: [
      { locator: "loc-openstax-up2-household-wiring-safety", role: "SUPPORTS", supportType: "DIRECT" },
      { locator: "loc-cg-ac4.8", role: "CURRICULUM_REQUIRES" },
    ],
    prereqs: [{ id: "EL-CIRCUIT-RECOGNISE-SHORT-CIRCUIT-001", strength: "REQUIRED" }],
    curriculum: [{ node: NODE_AC4_8, type: "SUPPORTS" }],
  },
  // CC-09B.4 correction (task section 2.E, "fuse/circuit breaker
  // cluster"): a locator repair, not a new-source problem, exactly as the
  // task anticipated -- OpenStax UP2 genuinely covers all of this, just
  // in specific sections (9.5, 10.6) the generic Ch.9-introduction
  // locator this cluster previously cited does not itself reach.
  {
    id: "EL-PROTECTIVE-DEVICE-PURPOSE-001", domain: "EL",
    statement: "A protective device, such as a fuse or circuit breaker, is designed to automatically disconnect a circuit when current exceeds a safe value.",
    provenance: [
      { locator: "loc-openstax-up2-household-wiring-safety", role: "DEFINES", supportType: "DIRECT" },
      { locator: "loc-cg-ac4.8", role: "CURRICULUM_REQUIRES" },
    ],
    prereqs: [{ id: "EL-CURRENT-THERMAL-EFFECT-001", strength: "STRONG" }],
    curriculum: [{ node: NODE_AC4_8, type: "REQUIRED_FOR" }],
  },
  {
    id: "EL-FUSE-OPERATION-001", domain: "EL",
    statement: "A fuse protects a circuit by melting and breaking the circuit when current exceeds its rated value, using the thermal effect of current.",
    provenance: [
      { locator: "loc-openstax-up2-fuse-breaker-mechanism", role: "DEFINES", supportType: "DIRECT" },
      { locator: "loc-cg-ac4.8", role: "CURRICULUM_REQUIRES" },
    ],
    prereqs: [{ id: "EL-CURRENT-THERMAL-EFFECT-001", strength: "REQUIRED" }],
    curriculum: [{ node: NODE_AC4_8, type: "REQUIRED_FOR" }],
  },
  {
    id: "EL-THERMAL-EFFECT-APPLICATION-001", domain: "EL",
    statement: "Recognise practical applications of the thermal effect of current, such as heating elements and filament lamps.",
    provenance: [
      { locator: "loc-openstax-up2-fuse-breaker-mechanism", role: "SUPPORTS", supportType: "DIRECT" },
      { locator: "loc-cg-ac4.8", role: "CURRICULUM_REQUIRES" },
    ],
    prereqs: [{ id: "EL-CURRENT-THERMAL-EFFECT-001", strength: "REQUIRED" }],
    curriculum: [{ node: NODE_AC4_8, type: "SUPPORTS" }],
  },
  {
    // CC-09B.4: this is a restatement of the already directly-sourced
    // power/energy relationships (P = I^2R, E = Pt) applied to heating --
    // a mathematical consequence, not an independent empirical claim, so
    // it is now expressed as DERIVED_FROM those two assertions rather
    // than citing the generic current-chapter locator directly.
    id: "EL-THERMAL-EFFECT-FACTORS-001", domain: "EL",
    statement: "The amount of heat generated by current flowing through a resistance depends on the current, the resistance and the time for which the current flows.",
    provenance: [{ locator: "loc-cg-ac4.8", role: "CURRICULUM_REQUIRES" }],
    prereqs: [{ id: "EL-POWER-SOLVE-IR-001", strength: "STRONG" }],
    derivedFrom: ["EL-POWER-DERIVED-VIR-001", "EL-ENERGY-POWER-TIME-RELATIONSHIP-001"],
    derivedFromKind: "MATHEMATICAL",
    curriculum: [{ node: NODE_AC4_8, type: "SUPPORTS" }],
  },
  {
    id: "EL-CIRCUIT-BREAKER-VS-FUSE-001", domain: "EL",
    statement: "Compare a fuse, which must be replaced after operating, with a circuit breaker, which can be reset and reused after tripping.",
    provenance: [
      { locator: "loc-openstax-up2-fuse-breaker-mechanism", role: "DEFINES", supportType: "DIRECT" },
      { locator: "loc-cg-ac4.8", role: "CURRICULUM_REQUIRES" },
    ],
    prereqs: [{ id: "EL-FUSE-OPERATION-001", strength: "REQUIRED" }],
    curriculum: [{ node: NODE_AC4_8, type: "SUPPORTS" }],
  },
  {
    id: "EL-INSTRUMENT-SELECT-001", domain: "EL",
    statement: "Select the appropriate instrument (voltmeter, ammeter, ohmmeter or multimeter) to measure a given electrical quantity.",
    provenance: [{ locator: "loc-cg-ac2.3", role: "CURRICULUM_REQUIRES" }],
    prereqs: [{ id: "EL-INSTRUMENT-VOLTMETER-001", strength: "REQUIRED" }, { id: "EL-INSTRUMENT-AMMETER-001", strength: "REQUIRED" }, { id: "EL-INSTRUMENT-OHMMETER-001", strength: "REQUIRED" }],
    derivedFrom: ["EL-INSTRUMENT-VOLTMETER-001", "EL-INSTRUMENT-AMMETER-001", "EL-INSTRUMENT-OHMMETER-001"],
    derivedFromKind: "LOGICAL_DEFINITIONAL",
    curriculum: [{ node: NODE_AC2_3, type: "REQUIRED_FOR" }],
  },
  {
    id: "EL-INSTRUMENT-VOLTMETER-INTERNAL-RESISTANCE-001", domain: "EL",
    statement: "An ideal voltmeter has very high internal resistance so that connecting it in parallel does not significantly alter the circuit being measured.",
    provenance: [{ locator: "loc-openstax-up2-electrical-measuring-instruments", role: "DEFINES" }, { locator: "loc-cg-ac2.3", role: "CURRICULUM_REQUIRES" }],
    prereqs: [{ id: "EL-INSTRUMENT-VOLTMETER-001", strength: "REQUIRED" }],
    curriculum: [{ node: NODE_AC2_3, type: "SUPPORTS" }],
  },
  {
    id: "EL-INSTRUMENT-AMMETER-INTERNAL-RESISTANCE-001", domain: "EL",
    statement: "An ideal ammeter has very low internal resistance so that connecting it in series does not significantly alter the circuit being measured.",
    provenance: [{ locator: "loc-openstax-up2-electrical-measuring-instruments", role: "DEFINES" }, { locator: "loc-cg-ac2.3", role: "CURRICULUM_REQUIRES" }],
    prereqs: [{ id: "EL-INSTRUMENT-AMMETER-001", strength: "REQUIRED" }],
    curriculum: [{ node: NODE_AC2_3, type: "SUPPORTS" }],
  },
  {
    // CC-09B.2 correction (task section 18): previously DERIVED_FROM the
    // ohmmeter assertion alone -- an EMPIRICAL/APPLICATION derivation
    // (which specific trade-test procedure a real technician performs is
    // not a mathematical consequence of "an ohmmeter measures
    // resistance"). Now cites Kuphaldt's ohmmeter-design section directly:
    // it demonstrates exactly this behaviour (full-scale deflection at
    // zero ohms, no deflection at infinite ohms -- i.e. confirming a
    // continuous low-resistance path) and states the de-energised-circuit
    // requirement explicitly.
    id: "EL-INSTRUMENT-CONTINUITY-TEST-001", domain: "EL",
    statement: "A continuity test uses an ohmmeter or multimeter to confirm that a low-resistance path exists between two points in a de-energised circuit.",
    provenance: [
      { locator: "loc-kuphaldt-dc-ohmmeter-continuity", role: "DEFINES", supportType: "DIRECT" },
      { locator: "loc-cg-ac2.3", role: "CURRICULUM_REQUIRES" },
    ],
    prereqs: [{ id: "EL-INSTRUMENT-OHMMETER-001", strength: "REQUIRED" }],
    curriculum: [{ node: NODE_AC2_3, type: "SUPPORTS" }],
  },
  {
    id: "EL-SERIES-VOLTAGE-DIVIDER-001", domain: "EL",
    statement: "A series circuit of two or more resistors can be used as a voltage divider, where the voltage across each resistor is proportional to its resistance.",
    provenance: [{ locator: "loc-openstax-up2-series-parallel", role: "SUPPORTS" }, { locator: "loc-cg-ac4.4", role: "CURRICULUM_REQUIRES" }],
    prereqs: [{ id: "EL-SERIES-VOLTAGE-001", strength: "REQUIRED" }, { id: "FM-ALG-PROPORTION-DIRECT-001", strength: "STRONG" }],
    curriculum: [{ node: NODE_AC4_4, type: "SUPPORTS" }],
  },
  {
    id: "EL-PARALLEL-CURRENT-DIVIDER-001", domain: "EL",
    statement: "A parallel circuit of two or more resistors divides the total current between branches in inverse proportion to their resistance.",
    provenance: [{ locator: "loc-openstax-up2-series-parallel", role: "SUPPORTS" }, { locator: "loc-cg-ac4.4", role: "CURRICULUM_REQUIRES" }],
    prereqs: [{ id: "EL-PARALLEL-CURRENT-001", strength: "REQUIRED" }, { id: "FM-ALG-PROPORTION-INVERSE-001", strength: "STRONG" }],
    curriculum: [{ node: NODE_AC4_4, type: "SUPPORTS" }],
  },
  {
    id: "EL-CIRCUIT-SUPPLY-CURRENT-SERIES-001", domain: "EL",
    statement: "Calculate the supply current in a series circuit from the supply voltage and the total resistance of the circuit.",
    provenance: [{ locator: "loc-cg-ac4.5", role: "CURRICULUM_REQUIRES" }],
    prereqs: [{ id: "EL-OHM-SOLVE-I-001", strength: "REQUIRED" }, { id: "EL-SERIES-RESISTANCE-CALC-001", strength: "REQUIRED" }],
    derivedFrom: ["EL-OHM-RELATIONSHIP-001", "EL-SERIES-RESISTANCE-001"],
    derivedFromKind: "MATHEMATICAL",
    curriculum: [{ node: NODE_AC4_5, type: "REQUIRED_FOR" }],
  },
  {
    id: "EL-CIRCUIT-SUPPLY-CURRENT-PARALLEL-001", domain: "EL",
    statement: "Calculate the supply current in a parallel circuit from the supply voltage and the total resistance of the circuit.",
    provenance: [{ locator: "loc-cg-ac4.5", role: "CURRICULUM_REQUIRES" }],
    prereqs: [{ id: "EL-OHM-SOLVE-I-001", strength: "REQUIRED" }, { id: "EL-PARALLEL-RESISTANCE-CALC-001", strength: "REQUIRED" }],
    derivedFrom: ["EL-OHM-RELATIONSHIP-001", "EL-PARALLEL-RESISTANCE-001"],
    derivedFromKind: "MATHEMATICAL",
    curriculum: [{ node: NODE_AC4_5, type: "REQUIRED_FOR" }],
  },
  {
    id: "EL-POWER-DERIVED-V2R-001", domain: "EL",
    statement: "Electrical power can also be found from voltage and resistance alone, since combining P = V times I with I = V divided by R gives P = V squared divided by R.",
    provenance: [{ locator: "loc-openstax-up2-power-energy", role: "SUPPORTS" }],
    derivedFrom: ["EL-POWER-RELATIONSHIP-001", "EL-OHM-RELATIONSHIP-001"],
    derivedFromKind: "MATHEMATICAL",
    curriculum: [{ node: NODE_AC4_6, type: "REQUIRED_FOR" }],
  },
  {
    id: "EL-POWER-SOLVE-V2R-001", domain: "EL",
    statement: "Calculate electrical power from known voltage and resistance using P = V squared divided by R.",
    provenance: [{ locator: "loc-cg-ac4.6", role: "CURRICULUM_REQUIRES" }],
    prereqs: [{ id: "EL-POWER-DERIVED-V2R-001", strength: "REQUIRED" }, { id: "FM-ALG-SUBSTITUTION-001", strength: "REQUIRED" }],
    derivedFrom: ["EL-POWER-DERIVED-V2R-001"],
    derivedFromKind: "MATHEMATICAL",
    curriculum: [{ node: NODE_AC4_6, type: "REQUIRED_FOR" }, { node: NODE_AC1_1, type: "EXEMPLIFIES" }],
  },
  {
    id: "EL-SERIES-POWER-CALC-001", domain: "EL",
    statement: "Calculate the power dissipated by an individual component in a series circuit from the common current and that component's resistance.",
    provenance: [{ locator: "loc-cg-ac4.6", role: "CURRICULUM_REQUIRES" }],
    prereqs: [{ id: "EL-POWER-SOLVE-IR-001", strength: "REQUIRED" }, { id: "EL-SERIES-CURRENT-001", strength: "REQUIRED" }],
    derivedFrom: ["EL-POWER-DERIVED-VIR-001"],
    derivedFromKind: "MATHEMATICAL",
    curriculum: [{ node: NODE_AC4_6, type: "REQUIRED_FOR" }],
  },
  {
    id: "EL-PARALLEL-POWER-CALC-001", domain: "EL",
    statement: "Calculate the power dissipated by an individual branch in a parallel circuit from the common branch voltage and that branch's resistance.",
    provenance: [{ locator: "loc-cg-ac4.6", role: "CURRICULUM_REQUIRES" }],
    prereqs: [{ id: "EL-POWER-SOLVE-V2R-001", strength: "REQUIRED" }, { id: "EL-PARALLEL-VOLTAGE-001", strength: "REQUIRED" }],
    derivedFrom: ["EL-POWER-DERIVED-V2R-001"],
    derivedFromKind: "MATHEMATICAL",
    curriculum: [{ node: NODE_AC4_6, type: "REQUIRED_FOR" }],
  },
  {
    id: "EL-SERIES-POWER-DISTRIBUTION-001", domain: "EL",
    statement: "In a series circuit, since current is equal throughout, the component with the greatest resistance dissipates the most power.",
    provenance: [{ locator: "loc-openstax-up2-power-energy", role: "SUPPORTS" }, { locator: "loc-cg-ac4.6", role: "CURRICULUM_REQUIRES" }],
    prereqs: [{ id: "EL-SERIES-POWER-CALC-001", strength: "STRONG" }],
    curriculum: [{ node: NODE_AC4_6, type: "SUPPORTS" }],
  },
  {
    id: "EL-PARALLEL-POWER-DISTRIBUTION-001", domain: "EL",
    statement: "In a parallel circuit, since voltage is equal across every branch, the branch with the smallest resistance dissipates the most power.",
    provenance: [{ locator: "loc-openstax-up2-power-energy", role: "SUPPORTS" }, { locator: "loc-cg-ac4.6", role: "CURRICULUM_REQUIRES" }],
    prereqs: [{ id: "EL-PARALLEL-POWER-CALC-001", strength: "STRONG" }],
    curriculum: [{ node: NODE_AC4_6, type: "SUPPORTS" }],
  },
  {
    id: "EL-ENERGY-POWER-TIME-RELATIONSHIP-001", domain: "EL",
    statement: "Electrical energy transferred is calculated by multiplying power by time: E = P times t.",
    provenance: [{ locator: "loc-openstax-up2-power-energy", role: "DEFINES" }, { locator: "loc-cg-ac2.2", role: "CURRICULUM_REQUIRES" }],
    prereqs: [{ id: "EL-CONCEPT-POWER-001", strength: "REQUIRED" }, { id: "EL-CONCEPT-ENERGY-001", strength: "REQUIRED" }],
    curriculum: [{ node: NODE_AC2_2, type: "REQUIRED_FOR" }],
  },
  {
    id: "EL-ENERGY-REARRANGE-001", domain: "EL",
    statement: "Rearrange E = P times t algebraically to make power or time the subject.",
    provenance: [{ locator: "loc-cg-ac2.2", role: "CURRICULUM_REQUIRES" }],
    prereqs: [{ id: "EL-ENERGY-POWER-TIME-RELATIONSHIP-001", strength: "REQUIRED" }, { id: "FM-ALG-TRANSPOSE-MULT-001", strength: "REQUIRED" }],
    derivedFrom: ["EL-ENERGY-POWER-TIME-RELATIONSHIP-001"],
    derivedFromKind: "MATHEMATICAL",
    curriculum: [{ node: NODE_AC2_2, type: "REQUIRED_FOR" }, { node: NODE_AC1_1, type: "EXEMPLIFIES" }],
  },
  {
    id: "EL-ENERGY-CALC-001", domain: "EL",
    statement: "Calculate the electrical energy transferred by a device from its power rating and its time of use, using E = P times t.",
    provenance: [{ locator: "loc-cg-ac2.2", role: "CURRICULUM_REQUIRES" }],
    prereqs: [{ id: "EL-ENERGY-POWER-TIME-RELATIONSHIP-001", strength: "REQUIRED" }, { id: "FM-ALG-SUBSTITUTION-001", strength: "REQUIRED" }],
    derivedFrom: ["EL-ENERGY-POWER-TIME-RELATIONSHIP-001"],
    derivedFromKind: "MATHEMATICAL",
    curriculum: [{ node: NODE_AC2_2, type: "REQUIRED_FOR" }, { node: NODE_AC1_1, type: "EXEMPLIFIES" }],
  },
  {
    id: "EL-ENERGY-KWH-CALC-001", domain: "EL",
    statement: "Calculate the electrical energy used by a device in kilowatt-hours from its power rating in kilowatts and its time of use in hours.",
    provenance: [{ locator: "loc-cg-ac2.2", role: "CURRICULUM_REQUIRES" }],
    prereqs: [{ id: "EL-ENERGY-CALC-001", strength: "REQUIRED" }, { id: "EL-UNIT-KWH-001", strength: "REQUIRED" }],
    derivedFrom: ["EL-ENERGY-POWER-TIME-RELATIONSHIP-001", "EL-UNIT-KWH-001"],
    derivedFromKind: "MATHEMATICAL",
    curriculum: [{ node: NODE_AC2_2, type: "SUPPORTS" }],
  },

  // ===================================================================
  // Electrical -- LO5 cluster: magnetism, electromagnetic induction and
  // AC generation/waveform characteristics (21). Real Unit 202 content
  // (CC-04B); conceptual/definitional only -- no AC calculation engine.
  // ===================================================================
  {
    id: "EL-CONCEPT-MAGNETISM-001", domain: "EL",
    statement: "Magnetism is a force of attraction between unlike magnetic poles and repulsion between like magnetic poles.",
    provenance: [{ locator: "loc-openstax-up2-magnetic-forces", role: "DEFINES" }, { locator: "loc-cg-ac5.1", role: "CURRICULUM_REQUIRES" }],
    curriculum: [{ node: NODE_AC5_1, type: "REQUIRED_FOR" }],
  },
  {
    id: "EL-CONCEPT-MAGNETIC-FLUX-001", domain: "EL",
    statement: "Magnetic flux is a measure of the total amount of magnetic field passing through a given area.",
    provenance: [{ locator: "loc-openstax-up2-em-induction", role: "DEFINES" }, { locator: "loc-cg-ac5.2", role: "CURRICULUM_REQUIRES" }],
    contrastsWith: ["EL-CONCEPT-MAGNETIC-FLUX-DENSITY-001"],
    curriculum: [{ node: NODE_AC5_2, type: "REQUIRED_FOR" }],
  },
  {
    // CC-09D: AC5.2's own EXPLICIT wording ("state the difference between
    // magnetic flux and flux density") already required both quantities'
    // identity as governed knowledge -- naming the SI unit alongside the
    // quantity is the same paired quantity+unit pattern every other
    // electrical quantity in this corpus already carries (ohm/resistance,
    // henry/inductance, farad/capacitance, etc.), not new scope.
    id: "EL-UNIT-WEBER-001", domain: "EL",
    statement: "The weber (Wb) is the SI derived unit of magnetic flux.",
    provenance: [{ locator: "loc-bipm-derived-units", role: "DEFINES" }, { locator: "loc-cg-ac5.2", role: "CURRICULUM_REQUIRES" }],
    prereqs: [{ id: "EL-CONCEPT-MAGNETIC-FLUX-001", strength: "REQUIRED" }],
    curriculum: [{ node: NODE_AC5_2, type: "REQUIRED_FOR" }],
  },
  {
    id: "EL-CONCEPT-MAGNETIC-FLUX-DENSITY-001", domain: "EL",
    statement: "Magnetic flux density is the amount of magnetic flux passing through a unit area, describing how concentrated a magnetic field is.",
    provenance: [{ locator: "loc-openstax-up2-em-induction", role: "DEFINES" }, { locator: "loc-cg-ac5.2", role: "CURRICULUM_REQUIRES" }],
    prereqs: [{ id: "EL-CONCEPT-MAGNETIC-FLUX-001", strength: "REQUIRED" }],
    curriculum: [{ node: NODE_AC5_2, type: "REQUIRED_FOR" }],
  },
  {
    // CC-09D: the official public 2365-602 sample e-volve MC test (item
    // 31) directly tests naming the SI unit of magnetic flux density
    // among plausible distractors (weber, henry, farad -- all real but
    // wrong SI derived units) -- positive OFFICIAL_ASSESSMENT evidence
    // this unit-recognition fact is assessable, previously ungoverned
    // (EL-CONCEPT-MAGNETIC-FLUX-DENSITY-001 states the quantity but never
    // named its unit).
    id: "EL-UNIT-TESLA-001", domain: "EL",
    statement: "The tesla (T) is the SI derived unit of magnetic flux density.",
    provenance: [{ locator: "loc-bipm-derived-units", role: "DEFINES" }, { locator: "loc-cg-ac5.2", role: "CURRICULUM_REQUIRES" }],
    prereqs: [{ id: "EL-CONCEPT-MAGNETIC-FLUX-DENSITY-001", strength: "REQUIRED" }],
    curriculum: [{ node: NODE_AC5_2, type: "REQUIRED_FOR" }],
  },
  {
    id: "EL-CONCEPT-MAGNETIC-FIELD-CURRENT-001", domain: "EL",
    statement: "A current-carrying conductor produces a magnetic field around it.",
    provenance: [{ locator: "loc-openstax-up2-magnetic-sources", role: "DEFINES" }, { locator: "loc-cg-ac5.3", role: "CURRICULUM_REQUIRES" }],
    prereqs: [{ id: "EL-CONCEPT-CURRENT-001", strength: "REQUIRED" }, { id: "EL-CONCEPT-MAGNETISM-001", strength: "STRONG" }],
    curriculum: [{ node: NODE_AC5_3, type: "REQUIRED_FOR" }],
  },
  {
    // CC-09B.6 (task section 9): the official SmartScreen handout (Handout
    // 9, "Electro-magnetism") explicitly teaches how to determine the
    // direction of the field around a current-carrying conductor, naming
    // it "Maxwell's screw rule" -- the vocational-trade term a City &
    // Guilds question would use. Preserved alongside the equivalent modern
    // physics term (right-hand rule) per task section 10: never modernised
    // so aggressively that a learner fails to recognise the exam language.
    id: "EL-CONCEPT-FIELD-DIRECTION-RULE-001", domain: "EL",
    statement: "The direction of the magnetic field around a straight current-carrying conductor is given by Maxwell's screw rule (equivalently, the right-hand rule): with the thumb pointing in the direction of current flow, the curled fingers give the direction of the circular field around the conductor.",
    provenance: [
      { locator: "loc-openstax-up2-straight-wire-field-direction", role: "DEFINES", supportType: "DIRECT" },
      { locator: "loc-cg-ac5.3", role: "CURRICULUM_REQUIRES" },
    ],
    prereqs: [{ id: "EL-CONCEPT-MAGNETIC-FIELD-CURRENT-001", strength: "REQUIRED" }],
    curriculum: [{ node: NODE_AC5_3, type: "REQUIRED_FOR" }],
  },
  {
    id: "EL-CONCEPT-FORCE-ON-CONDUCTOR-001", domain: "EL",
    statement: "A current-carrying conductor placed in a magnetic field experiences a mechanical force.",
    provenance: [{ locator: "loc-openstax-up2-magnetic-forces", role: "DEFINES" }, { locator: "loc-cg-ac5.3", role: "CURRICULUM_REQUIRES" }],
    prereqs: [{ id: "EL-CONCEPT-MAGNETIC-FIELD-CURRENT-001", strength: "REQUIRED" }, { id: "FP-CONCEPT-FORCE-001", strength: "REQUIRED" }],
    curriculum: [{ node: NODE_AC5_3, type: "REQUIRED_FOR" }],
  },
  {
    // CC-09B.6 (adversarial gap review, task section 30): the official
    // SmartScreen handout (Handout 11, "Force on current-carrying
    // conductor") is entirely dedicated to this named formula with two
    // worked numeric examples -- exact structural analogue of the
    // Maxwell's-screw-rule fix already made for AC5.3's field-production
    // sub-topic.
    id: "EL-REL-FORCE-ON-CONDUCTOR-001", domain: "EL",
    statement: "The magnitude of the force on a straight current-carrying conductor at right angles to a magnetic field is given by F = B I l, where B is the magnetic flux density, I is the current and l is the length of the conductor in the field.",
    provenance: [
      { locator: "loc-openstax-up2-force-on-conductor-magnitude", role: "DEFINES", supportType: "DIRECT" },
      { locator: "loc-cg-ac5.3", role: "CURRICULUM_REQUIRES" },
    ],
    prereqs: [{ id: "EL-CONCEPT-FORCE-ON-CONDUCTOR-001", strength: "REQUIRED" }],
    curriculum: [{ node: NODE_AC5_3, type: "REQUIRED_FOR" }],
  },
  {
    // CC-09B.6: preserves the vocational-trade term (task section 10) a
    // City & Guilds question would use, alongside the equivalent modern
    // physics naming (OpenStax's own RHR-1) already implicit in
    // loc-openstax-up2-force-on-conductor-magnitude.
    id: "EL-CONCEPT-FLEMING-LEFT-HAND-001", domain: "EL",
    statement: "Fleming's left-hand rule gives the direction of the force on a current-carrying conductor in a magnetic field: with the First finger, seCond finger and thuMb of the left hand mutually at right angles, the First finger points along the Field, the seCond finger along the Current, and the thuMb gives the direction of Motion (force).",
    provenance: [
      { locator: "loc-wikipedia-flemings-left-hand-rule", role: "DEFINES", supportType: "DIRECT" },
      { locator: "loc-cg-ac5.3", role: "CURRICULUM_REQUIRES" },
    ],
    prereqs: [{ id: "EL-REL-FORCE-ON-CONDUCTOR-001", strength: "REQUIRED" }],
    curriculum: [{ node: NODE_AC5_3, type: "REQUIRED_FOR" }],
  },
  {
    id: "EL-CONCEPT-ELECTROMAGNETISM-001", domain: "EL",
    statement: "Electromagnetism is the branch of physics concerned with the relationship between electric current and magnetic fields, including how one can produce the other.",
    provenance: [{ locator: "loc-openstax-up2-magnetic-sources", role: "DEFINES" }, { locator: "loc-cg-ac5.3", role: "CURRICULUM_REQUIRES" }],
    prereqs: [{ id: "EL-CONCEPT-MAGNETIC-FIELD-CURRENT-001", strength: "REQUIRED" }, { id: "EL-CONCEPT-FORCE-ON-CONDUCTOR-001", strength: "REQUIRED" }],
    curriculum: [{ node: NODE_AC5_3, type: "REQUIRED_FOR" }],
  },
  {
    id: "EL-CONCEPT-EMF-001", domain: "EL",
    statement: "Electromotive force (EMF) is the electrical energy per unit charge supplied by a source, which drives current around a circuit.",
    provenance: [{ locator: "loc-openstax-up2-em-induction", role: "DEFINES" }, { locator: "loc-cg-ac5.3", role: "CURRICULUM_REQUIRES" }],
    prereqs: [{ id: "EL-CONCEPT-MAGNETIC-FLUX-001", strength: "STRONG" }],
    curriculum: [{ node: NODE_AC5_3, type: "REQUIRED_FOR" }],
  },
  {
    // CC-09B.6 (adversarial gap review, task section 30): the official
    // SmartScreen handout (Handout 10, "Generation of an EMF") is entirely
    // dedicated to this named formula with two worked numeric examples --
    // exact structural analogue of the force-on-conductor fix above.
    id: "EL-REL-INDUCED-EMF-001", domain: "EL",
    statement: "The magnitude of the EMF induced in a conductor of length l moving at velocity v perpendicular to a magnetic field of flux density B is given by e = B l v.",
    provenance: [
      { locator: "loc-openstax-up2-motional-emf", role: "DEFINES", supportType: "DIRECT" },
      { locator: "loc-cg-ac5.3", role: "CURRICULUM_REQUIRES" },
    ],
    prereqs: [{ id: "EL-CONCEPT-EMF-001", strength: "REQUIRED" }],
    curriculum: [{ node: NODE_AC5_3, type: "REQUIRED_FOR" }],
  },
  {
    // CC-09B.6: preserves the vocational-trade term (task section 10)
    // alongside the underlying physics (Lenz's law direction, already
    // implicit in loc-openstax-up2-motional-emf).
    id: "EL-CONCEPT-FLEMING-RIGHT-HAND-001", domain: "EL",
    statement: "Fleming's right-hand rule gives the direction of the current induced in a conductor moving through a magnetic field: with the thumb, First finger and seCond finger of the right hand mutually at right angles, the thumb points in the direction of Motion, the First finger along the Field, and the seCond finger gives the direction of the induced Current.",
    provenance: [
      { locator: "loc-wikipedia-flemings-right-hand-rule", role: "DEFINES", supportType: "DIRECT" },
      { locator: "loc-cg-ac5.3", role: "CURRICULUM_REQUIRES" },
    ],
    prereqs: [{ id: "EL-REL-INDUCED-EMF-001", strength: "REQUIRED" }],
    contrastsWith: ["EL-CONCEPT-FLEMING-LEFT-HAND-001"],
    curriculum: [{ node: NODE_AC5_3, type: "REQUIRED_FOR" }],
  },
  {
    id: "EL-CONCEPT-TERMINAL-VOLTAGE-001", domain: "EL",
    statement: "Terminal voltage is the potential difference measured across the terminals of a source while it is supplying current, which is slightly less than its EMF due to the source's own internal resistance.",
    provenance: [{ locator: "loc-openstax-up2-em-induction", role: "SUPPORTS" }, { locator: "loc-cg-ac5.3", role: "CURRICULUM_REQUIRES" }],
    prereqs: [{ id: "EL-CONCEPT-EMF-001", strength: "REQUIRED" }, { id: "EL-CONCEPT-VOLTAGE-001", strength: "REQUIRED" }],
    contrastsWith: ["EL-CONCEPT-EMF-001"],
    curriculum: [{ node: NODE_AC5_3, type: "SUPPORTS" }],
  },
  {
    // CC-09B.1: the explicit causal proposition "changing flux induces
    // EMF" was previously only implicit inside the motor/generator
    // comparison assertion, never stated as its own atomic fact (audit
    // section 15.C) -- added here as the direct prerequisite the
    // generator assertion below actually depends on.
    id: "EL-CONCEPT-ELECTROMAGNETIC-INDUCTION-001", domain: "EL",
    statement: "A changing magnetic flux through a circuit or coil induces an electromotive force (EMF) in that circuit -- the principle of electromagnetic induction.",
    provenance: [{ locator: "loc-openstax-up2-em-induction", role: "DEFINES" }, { locator: "loc-cg-ac5.4", role: "CURRICULUM_REQUIRES" }],
    prereqs: [{ id: "EL-CONCEPT-MAGNETIC-FLUX-001", strength: "REQUIRED" }, { id: "EL-CONCEPT-EMF-001", strength: "REQUIRED" }],
    curriculum: [{ node: NODE_AC5_4, type: "REQUIRED_FOR" }],
  },
  {
    // CC-09D: the official public 2365-602 sample e-volve MC test (item
    // 35) requires CALCULATING the flux change from a given induced EMF
    // and time interval -- positive OFFICIAL_ASSESSMENT evidence that
    // AC5.4's "changing flux induces an EMF" obligation extends to the
    // quantitative Faraday's-law relationship, not merely the qualitative
    // principle EL-CONCEPT-ELECTROMAGNETIC-INDUCTION-001 already states.
    // Distinct from EL-REL-INDUCED-EMF-001 (e = B l v, AC5.3's motional-EMF
    // special case for a conductor moving through a field) -- this is the
    // general rate-of-change-of-flux form underlying AC5.4's generator
    // principle. Formula independently inspected and verified against
    // OpenStax University Physics Volume 2 Section 13.1 before authoring
    // -- never taken from the assessment item or its answer key.
    //
    // CC-09D.1 (Project Architect correction): the source itself
    // distinguishes single-loop (epsilon = -dPhi/dt) from N-turn-coil
    // (epsilon = -N dPhi/dt) forms -- the original wording said "coil"
    // while giving the single-loop expression (no N factor), an
    // over-broad mismatch between statement and formula. AC5.4's own
    // wording is specifically "a single-loop generator"; narrowed to
    // match both the formula actually given and the AC5.4 context. N-turn
    // detail is NOT introduced -- neither the formal curriculum nor the
    // assessment evidence requires it.
    id: "EL-REL-FLUX-CHANGE-EMF-001", domain: "EL",
    statement: "The magnitude of the EMF induced in a single loop equals the rate of change of the magnetic flux through it: e = (change in flux) / (time taken).",
    provenance: [
      { locator: "loc-openstax-up2-faradays-law", role: "DEFINES", supportType: "DIRECT" },
      { locator: "loc-cg-ac5.4", role: "CURRICULUM_REQUIRES" },
    ],
    prereqs: [{ id: "EL-CONCEPT-ELECTROMAGNETIC-INDUCTION-001", strength: "REQUIRED" }],
    curriculum: [{ node: NODE_AC5_4, type: "REQUIRED_FOR" }],
  },
  {
    id: "EL-CONCEPT-AC-GENERATOR-001", domain: "EL",
    statement: "A simple AC generator produces an alternating EMF by rotating a single loop of wire at constant speed within a magnetic field, continuously changing the flux linking the loop.",
    provenance: [{ locator: "loc-openstax-up2-em-induction", role: "DEFINES" }, { locator: "loc-cg-ac5.4", role: "CURRICULUM_REQUIRES" }],
    prereqs: [{ id: "EL-CONCEPT-ELECTROMAGNETIC-INDUCTION-001", strength: "REQUIRED" }, { id: "EL-CONCEPT-EMF-001", strength: "REQUIRED" }, { id: "EL-CONCEPT-MAGNETIC-FLUX-001", strength: "REQUIRED" }],
    curriculum: [{ node: NODE_AC5_4, type: "REQUIRED_FOR" }],
  },
  {
    id: "EL-CONCEPT-SINE-WAVE-001", domain: "EL",
    statement: "The EMF produced by a simple rotating-loop AC generator varies with time as a sine wave.",
    provenance: [{ locator: "loc-openstax-up2-em-induction", role: "DEFINES" }, { locator: "loc-cg-ac5.4", role: "CURRICULUM_REQUIRES" }],
    prereqs: [{ id: "EL-CONCEPT-AC-GENERATOR-001", strength: "REQUIRED" }],
    curriculum: [{ node: NODE_AC5_4, type: "REQUIRED_FOR" }],
  },
  {
    id: "EL-CONCEPT-AC-DC-DISTINCTION-001", domain: "EL",
    statement: "Direct current (D.C.) flows in one direction with a constant value, while alternating current (A.C.) periodically reverses direction and varies in value, typically following a sine wave.",
    provenance: [{ locator: "loc-openstax-up2-em-induction", role: "SUPPORTS" }, { locator: "loc-cg-ac5.4", role: "CURRICULUM_REQUIRES" }],
    prereqs: [{ id: "EL-CONCEPT-SINE-WAVE-001", strength: "REQUIRED" }, { id: "EL-CONCEPT-CURRENT-001", strength: "REQUIRED" }],
    curriculum: [{ node: NODE_AC5_4, type: "REQUIRED_FOR" }],
  },
  {
    id: "EL-CIRCUIT-AC-SUPPLY-RECOGNITION-001", domain: "EL",
    statement: "UK domestic and industrial electrical supplies are alternating current, with a standard frequency of 50 Hz.",
    provenance: [{ locator: "loc-openstax-up2-em-induction", role: "SUPPORTS" }, { locator: "loc-cg-ac5.4", role: "CURRICULUM_REQUIRES" }],
    prereqs: [{ id: "EL-CONCEPT-AC-DC-DISTINCTION-001", strength: "REQUIRED" }, { id: "EL-CONCEPT-FREQUENCY-001", strength: "REQUIRED" }],
    curriculum: [{ node: NODE_AC5_4, type: "SUPPORTS" }],
  },
  {
    id: "EL-WAVEFORM-PERIODIC-TIME-001", domain: "EL",
    statement: "Periodic time is the time taken to complete one full cycle of a repeating waveform.",
    provenance: [{ locator: "loc-openstax-up2-em-induction", role: "DEFINES" }, { locator: "loc-cg-ac5.5", role: "CURRICULUM_REQUIRES" }],
    prereqs: [{ id: "EL-CONCEPT-SINE-WAVE-001", strength: "STRONG" }],
    curriculum: [{ node: NODE_AC5_5, type: "REQUIRED_FOR" }, { node: rangeNode("5.5", "PERIODIC-TIME"), type: "REQUIRED_FOR" }],
  },
  {
    id: "EL-WAVEFORM-AMPLITUDE-001", domain: "EL",
    statement: "Amplitude is the maximum displacement of a waveform from its zero (mean) value.",
    provenance: [{ locator: "loc-openstax-up2-em-induction", role: "DEFINES" }, { locator: "loc-cg-ac5.5", role: "CURRICULUM_REQUIRES" }],
    prereqs: [{ id: "EL-CONCEPT-SINE-WAVE-001", strength: "STRONG" }],
    curriculum: [{ node: NODE_AC5_5, type: "REQUIRED_FOR" }, { node: rangeNode("5.5", "AMPLITUDE"), type: "REQUIRED_FOR" }],
  },
  {
    id: "EL-WAVEFORM-PEAK-TO-PEAK-001", domain: "EL",
    statement: "The peak-to-peak value of a waveform is the difference between its maximum positive and maximum negative values.",
    provenance: [{ locator: "loc-openstax-up2-em-induction", role: "DEFINES" }, { locator: "loc-cg-ac5.5", role: "CURRICULUM_REQUIRES" }],
    prereqs: [{ id: "EL-WAVEFORM-AMPLITUDE-001", strength: "REQUIRED" }],
    curriculum: [{ node: NODE_AC5_5, type: "REQUIRED_FOR" }, { node: rangeNode("5.5", "PEAK-TO-PEAK-VALUE"), type: "REQUIRED_FOR" }],
  },
  {
    id: "EL-WAVEFORM-RMS-001", domain: "EL",
    statement: "The RMS (root mean square) value of an alternating quantity is the value of direct current or voltage that would produce the same heating effect in a resistor.",
    provenance: [{ locator: "loc-openstax-up2-em-induction", role: "DEFINES" }, { locator: "loc-cg-ac5.5", role: "CURRICULUM_REQUIRES" }],
    prereqs: [{ id: "EL-CONCEPT-SINE-WAVE-001", strength: "REQUIRED" }, { id: "EL-CURRENT-THERMAL-EFFECT-001", strength: "STRONG" }],
    curriculum: [{ node: NODE_AC5_5, type: "REQUIRED_FOR" }, { node: rangeNode("5.5", "RMS-VALUE"), type: "REQUIRED_FOR" }],
  },
  {
    id: "EL-WAVEFORM-AVERAGE-VALUE-001", domain: "EL",
    statement: "The average value of an alternating waveform used in AC calculations is normally the average of the rectified (half-cycle) waveform, rather than the average over a full cycle.",
    provenance: [{ locator: "loc-openstax-up2-em-induction", role: "DEFINES" }, { locator: "loc-cg-ac5.5", role: "CURRICULUM_REQUIRES" }],
    prereqs: [{ id: "EL-CONCEPT-SINE-WAVE-001", strength: "REQUIRED" }],
    contrastsWith: ["EL-WAVEFORM-RMS-001"],
    curriculum: [{ node: NODE_AC5_5, type: "REQUIRED_FOR" }, { node: rangeNode("5.5", "AVERAGE-VALUE"), type: "REQUIRED_FOR" }],
  },
  {
    id: "EL-WAVEFORM-AVERAGE-ZERO-INTERPRETATION-001", domain: "EL",
    statement: "The average value of a symmetrical sine wave taken over a full cycle is zero, because the positive and negative half-cycles cancel; the non-zero 'average value' quoted for AC calculations refers to the rectified waveform.",
    provenance: [{ locator: "loc-openstax-up2-em-induction", role: "SUPPORTS" }, { locator: "loc-cg-ac5.5", role: "CURRICULUM_REQUIRES" }],
    prereqs: [{ id: "EL-WAVEFORM-AVERAGE-VALUE-001", strength: "REQUIRED" }],
    curriculum: [{ node: NODE_AC5_5, type: "SUPPORTS" }],
  },
  {
    id: "EL-WAVEFORM-RMS-PEAK-RELATIONSHIP-001", domain: "EL",
    statement: "For a pure sine wave, the RMS value equals the peak value divided by the square root of two.",
    provenance: [{ locator: "loc-openstax-up2-ac-circuits", role: "SUPPORTS" }, { locator: "loc-cg-ac5.5", role: "CURRICULUM_REQUIRES" }],
    prereqs: [{ id: "EL-WAVEFORM-RMS-001", strength: "REQUIRED" }, { id: "EL-WAVEFORM-AMPLITUDE-001", strength: "REQUIRED" }],
    curriculum: [{ node: NODE_AC5_5, type: "REQUIRED_FOR" }],
  },
  {
    // CC-09B.1: two real defects corrected (audit section 15.A) -- the
    // City & Guilds locator wrongly pointed at AC4.5 (D.C. circuit
    // calculations) instead of AC5.5 (this assertion's own waveform
    // Assessment Criterion), and the assertion had no factual provenance
    // beyond that curriculum citation; it is now properly DERIVED_FROM
    // the real-sourced RMS/peak relationship.
    id: "EL-WAVEFORM-RMS-CALC-001", domain: "EL",
    statement: "Calculate the RMS value of a sine wave from its peak value, or the peak value from its RMS value.",
    provenance: [{ locator: "loc-cg-ac5.5", role: "CURRICULUM_REQUIRES" }],
    prereqs: [{ id: "EL-WAVEFORM-RMS-PEAK-RELATIONSHIP-001", strength: "REQUIRED" }, { id: "FM-ALG-SUBSTITUTION-001", strength: "REQUIRED" }],
    derivedFrom: ["EL-WAVEFORM-RMS-PEAK-RELATIONSHIP-001"],
    derivedFromKind: "MATHEMATICAL",
    curriculum: [{ node: NODE_AC5_5, type: "REQUIRED_FOR" }],
  },
  {
    id: "EL-CONCEPT-PEAK-VS-RMS-SUPPLY-INTERPRETATION-001", domain: "EL",
    statement: "The rated voltage of an AC supply (for example 230 V) refers to its RMS value, not its peak value, which is higher.",
    provenance: [{ locator: "loc-openstax-up2-ac-circuits", role: "SUPPORTS" }, { locator: "loc-cg-ac5.5", role: "CURRICULUM_REQUIRES" }],
    prereqs: [{ id: "EL-WAVEFORM-RMS-PEAK-RELATIONSHIP-001", strength: "REQUIRED" }, { id: "EL-CIRCUIT-AC-SUPPLY-RECOGNITION-001", strength: "STRONG" }],
    curriculum: [{ node: NODE_AC5_5, type: "SUPPORTS" }],
  },
  {
    id: "EL-WAVEFORM-FREQUENCY-PERIOD-RELATIONSHIP-001", domain: "EL",
    statement: "Frequency and periodic time are reciprocals of each other: frequency equals one divided by periodic time.",
    provenance: [{ locator: "loc-openstax-up2-em-induction", role: "SUPPORTS" }, { locator: "loc-cg-ac5.5", role: "CURRICULUM_REQUIRES" }],
    prereqs: [{ id: "EL-CONCEPT-FREQUENCY-001", strength: "REQUIRED" }, { id: "EL-WAVEFORM-PERIODIC-TIME-001", strength: "REQUIRED" }, { id: "FM-ARITH-RECIPROCAL-001", strength: "REQUIRED" }],
    curriculum: [{ node: NODE_AC5_5, type: "REQUIRED_FOR" }, { node: rangeNode("5.5", "FREQUENCY"), type: "REQUIRED_FOR" }],
  },
  {
    // CC-09B.1: same two corrections as EL-WAVEFORM-RMS-CALC-001 above --
    // wrong AC4.5 locator corrected to AC5.5, and DERIVED_FROM the
    // real-sourced frequency/period relationship added.
    id: "EL-WAVEFORM-FREQUENCY-CALC-001", domain: "EL",
    statement: "Calculate frequency from periodic time, or periodic time from frequency, using their reciprocal relationship.",
    provenance: [{ locator: "loc-cg-ac5.5", role: "CURRICULUM_REQUIRES" }],
    prereqs: [{ id: "EL-WAVEFORM-FREQUENCY-PERIOD-RELATIONSHIP-001", strength: "REQUIRED" }, { id: "FM-ALG-SUBSTITUTION-001", strength: "REQUIRED" }],
    derivedFrom: ["EL-WAVEFORM-FREQUENCY-PERIOD-RELATIONSHIP-001"],
    derivedFromKind: "MATHEMATICAL",
    curriculum: [{ node: NODE_AC5_5, type: "REQUIRED_FOR" }],
  },
  {
    id: "EL-MAGNETISM-COMPARE-PERMANENT-ELECTROMAGNET-001", domain: "EL",
    statement: "Compare a permanent magnet, which retains its magnetism without a current, with an electromagnet, whose magnetic field depends on a current flowing through a coil.",
    provenance: [{ locator: "loc-openstax-up2-magnetic-sources", role: "SUPPORTS" }, { locator: "loc-cg-ac5.3", role: "CURRICULUM_REQUIRES" }],
    prereqs: [{ id: "EL-CONCEPT-ELECTROMAGNETISM-001", strength: "REQUIRED" }, { id: "EL-CONCEPT-MAGNETISM-001", strength: "REQUIRED" }],
    curriculum: [{ node: NODE_AC5_3, type: "SUPPORTS" }],
  },
  {
    // CC-09B.4 correction (task section 2.D): the generic physics fact
    // "current produces a magnetic field" does not by itself establish
    // that a real clamp-meter instrument exists or how it uses that
    // field -- an EMPIRICAL/APPLICATION/device-construction claim (task
    // section 9's own worked example). Re-sourced to Fluke's own
    // technical explanation of the instrument, with the generic
    // current-produces-a-magnetic-field physics kept as SUPPORTS for the
    // underlying principle the instrument relies on, not as the sole
    // evidence for the device claim itself.
    // CC-09B.4 (task section 7): Fluke's own technical explanation alone
    // is DIRECT for the whole statement; OpenStax's generic "current
    // produces a magnetic field" locator is retained only as PARTIAL
    // supporting background for the underlying physics the instrument
    // relies on -- explicitly classified so it is never mistaken for
    // independent direct evidence of the device claim itself.
    id: "EL-INSTRUMENT-CLAMP-METER-001", domain: "EL",
    statement: "A clamp meter measures current without breaking the circuit, by detecting the magnetic field produced around the current-carrying conductor.",
    provenance: [
      { locator: "loc-fluke-clamp-meter-principle", role: "DEFINES", supportType: "DIRECT" },
      { locator: "loc-openstax-up2-magnetic-sources", role: "SUPPORTS", supportType: "PARTIAL" },
      { locator: "loc-cg-ac2.3", role: "CURRICULUM_REQUIRES" },
    ],
    multiSourceFullyCovered: true,
    clauseCoverage: [
      { clause: "a clamp meter measures current without breaking the circuit, via ferrite jaws detecting the magnetic field", locator: "loc-fluke-clamp-meter-principle" },
      { clause: "(background) current flowing in a conductor produces a magnetic field around it", locator: "loc-openstax-up2-magnetic-sources" },
    ],
    prereqs: [{ id: "EL-CONCEPT-MAGNETIC-FIELD-CURRENT-001", strength: "REQUIRED" }, { id: "EL-CONCEPT-CURRENT-001", strength: "REQUIRED" }],
    // CC-09B.6 (task section 13): the official SmartScreen handout for
    // AC2.3 (Handout 8, "Connection of meters") explicitly enumerates its
    // complete intended instrument set -- ammeter, voltmeter, ohmmeter,
    // wattmeter, energy meter -- and does not mention a clamp meter at
    // all. Genuine negative teaching-scope evidence, not merely absence:
    // the Unit 202 curriculum mapping is removed so this factually valid,
    // well-sourced knowledge is retained as reusable horizontal EL
    // knowledge without contributing to Unit 202 required/supporting
    // completeness or mastery (previously SUPPORTS-mapped to NODE_AC2_3).
  },
  {
    id: "EL-CONCEPT-MOTOR-PRINCIPLE-001", domain: "EL",
    statement: "An electric motor uses the force on a current-carrying conductor in a magnetic field to produce rotational motion.",
    provenance: [{ locator: "loc-openstax-up2-magnetic-forces", role: "SUPPORTS" }, { locator: "loc-cg-ac5.3", role: "CURRICULUM_REQUIRES" }],
    prereqs: [{ id: "EL-CONCEPT-FORCE-ON-CONDUCTOR-001", strength: "REQUIRED" }],
    curriculum: [{ node: NODE_AC5_3, type: "SUPPORTS" }],
  },
  {
    id: "EL-MOTOR-GENERATOR-COMPARE-001", domain: "EL",
    statement: "Compare an electric motor, which converts electrical energy into mechanical motion using force on a current-carrying conductor, with a generator, which converts mechanical motion into electrical energy using electromagnetic induction.",
    provenance: [{ locator: "loc-openstax-up2-em-induction", role: "SUPPORTS" }, { locator: "loc-cg-ac5.4", role: "CURRICULUM_REQUIRES" }],
    prereqs: [{ id: "EL-CONCEPT-MOTOR-PRINCIPLE-001", strength: "REQUIRED" }, { id: "EL-CONCEPT-AC-GENERATOR-001", strength: "REQUIRED" }],
    curriculum: [{ node: NODE_AC5_4, type: "SUPPORTS" }],
  },
  {
    id: "EL-INSTRUMENT-OSCILLOSCOPE-001", domain: "EL",
    statement: "An oscilloscope displays how a voltage varies with time, allowing the shape, amplitude and periodic time of a waveform to be observed.",
    provenance: [{ locator: "loc-openstax-up2-em-induction", role: "SUPPORTS" }, { locator: "loc-cg-ac5.5", role: "CURRICULUM_REQUIRES" }],
    prereqs: [{ id: "EL-WAVEFORM-AMPLITUDE-001", strength: "STRONG" }, { id: "EL-WAVEFORM-PERIODIC-TIME-001", strength: "STRONG" }],
    // CC-09B.6 (task section 13): the official SmartScreen handout for
    // AC5.5 (Handout 13, "Sine wave quantities") teaches amplitude,
    // peak-to-peak, frequency, periodic time, average and RMS purely
    // through worked calculation, with no mention of an oscilloscope as
    // the means of observing them. Same treatment as the clamp meter
    // above: Unit 202 curriculum mapping removed (previously SUPPORTS-
    // mapped to NODE_AC5_5), retained as valid reusable EL knowledge.
  },
  {
    id: "EL-CIRCUIT-COMPARE-AC-DC-BEHAVIOUR-001", domain: "EL",
    statement: "Compare how a resistor behaves the same way under AC or DC supply (Ohm's law applies using RMS values), while an inductor or capacitor's opposition to current depends on whether the supply is AC or DC.",
    provenance: [{ locator: "loc-openstax-up2-ac-circuits", role: "SUPPORTS" }, { locator: "loc-cg-ac5.4", role: "CURRICULUM_REQUIRES" }],
    prereqs: [{ id: "EL-CONCEPT-AC-DC-DISTINCTION-001", strength: "REQUIRED" }, { id: "EL-CONCEPT-REACTANCE-001", strength: "REQUIRED" }, { id: "EL-OHM-RELATIONSHIP-001", strength: "STRONG" }],
    curriculum: [{ node: NODE_AC5_4, type: "SUPPORTS" }],
  },
  {
    id: "EL-CIRCUIT-ZERO-RESISTANCE-INTERPRETATION-001", domain: "EL",
    statement: "An ideal conductor with zero resistance has zero voltage drop across it, regardless of the current flowing through it.",
    provenance: [{ locator: "loc-openstax-up2-ohms-law", role: "SUPPORTS" }, { locator: "loc-cg-ac4.7", role: "CURRICULUM_REQUIRES" }],
    prereqs: [{ id: "EL-VOLTAGE-DROP-001", strength: "REQUIRED" }, { id: "EL-OHM-RELATIONSHIP-001", strength: "STRONG" }],
    curriculum: [{ node: NODE_AC4_7, type: "SUPPORTS" }],
  },
  {
    id: "EL-CIRCUIT-OPEN-CIRCUIT-RESISTANCE-INTERPRETATION-001", domain: "EL",
    statement: "An open circuit can be modelled as having infinite resistance, since no current can flow through it regardless of the applied voltage.",
    provenance: [{ locator: "loc-openstax-up2-ohms-law", role: "SUPPORTS" }, { locator: "loc-cg-ac4.4", role: "CURRICULUM_REQUIRES" }],
    prereqs: [{ id: "EL-CIRCUIT-RECOGNISE-OPEN-CIRCUIT-001", strength: "REQUIRED" }, { id: "EL-OHM-RELATIONSHIP-001", strength: "STRONG" }],
    curriculum: [{ node: NODE_AC4_4, type: "SUPPORTS" }],
  },

  // ===================================================================
  // Electrical -- LO6 cluster: electronic components (CC-09B, previously
  // entirely absent). Level 2 depth throughout: recognise the device,
  // its basic operating principle, and typical application -- never
  // semiconductor-device engineering depth (task brief section 18).
  // ===================================================================
  // CC-09B.1 (audit section 16.A/B): the generic quantity definitions
  // EL-CONCEPT-RESISTANCE-001/EL-CONCEPT-CAPACITANCE-001 alone do not
  // satisfy the "Resistors"/"Capacitors" Range items -- the Range asks
  // for the COMPONENT (a manufactured device with a purpose), not merely
  // the abstract electrical quantity it is named after. These two new
  // component-level assertions now also map to the Range items,
  // alongside (not instead of) the existing quantity definitions.
  {
    id: "EL-COMPONENT-RESISTOR-001", domain: "EL",
    statement: "A resistor is a component manufactured to provide a specific, stable value of resistance, used in circuits to limit current or to divide voltage.",
    provenance: [
      { locator: "loc-kuphaldt-dc-resistors", role: "DEFINES" },
      { locator: "loc-cg-ac6.2", role: "CURRICULUM_REQUIRES" },
    ],
    prereqs: [{ id: "EL-CONCEPT-RESISTANCE-001", strength: "REQUIRED" }],
    curriculum: [{ node: acNode("6.2"), type: "REQUIRED_FOR" }, { node: rangeNode("6.2", "RESISTORS"), type: "REQUIRED_FOR" }],
  },
  // CC-09B.2 correction (task section 15): the single compound assertion
  // below was cited to OpenStax UP2's AC-circuits chapter (reactance,
  // impedance, power factor) for a charge-storage/energy/transient-
  // behaviour claim that chapter does not itself cover. The Project
  // Architect identified stronger direct sources -- UP2 Chapter 8
  // (Capacitance) for charge storage and field energy, and UP2's RC-
  // circuits section for charging/discharging/voltage-continuity
  // behaviour -- which are two materially different, separately-sourced
  // propositions (static field-energy storage vs. time-domain transient
  // behaviour), so per the task's own instruction the assertion is split
  // rather than retained as one compound citation of convenience.
  {
    id: "EL-COMPONENT-CAPACITOR-001", domain: "EL",
    statement: "A capacitor is a component that stores electrical charge and energy by separating charge in an electric field between two conductive plates; a charged capacitor stores this energy in the electric field between its plates.",
    provenance: [
      { locator: "loc-openstax-up2-capacitor-charge-energy", role: "DEFINES", supportType: "DIRECT" },
      { locator: "loc-cg-ac6.2", role: "CURRICULUM_REQUIRES" },
    ],
    prereqs: [{ id: "EL-CONCEPT-CAPACITANCE-001", strength: "REQUIRED" }],
    curriculum: [{ node: acNode("6.2"), type: "REQUIRED_FOR" }, { node: rangeNode("6.2", "CAPACITORS"), type: "REQUIRED_FOR" }],
  },
  {
    id: "EL-COMPONENT-CAPACITOR-TRANSIENT-001", domain: "EL",
    statement: "A capacitor opposes a sudden change in the voltage across it: connected in a circuit with resistance, it charges and discharges exponentially over time (governed by the time constant tau = R times C) rather than the voltage across it changing instantaneously.",
    provenance: [
      { locator: "loc-openstax-up2-rc-circuits", role: "DEFINES", supportType: "DIRECT" },
      { locator: "loc-cg-ac6.2", role: "CURRICULUM_REQUIRES" },
    ],
    prereqs: [{ id: "EL-COMPONENT-CAPACITOR-001", strength: "REQUIRED" }],
    curriculum: [{ node: acNode("6.2"), type: "SUPPORTS" }, { node: rangeNode("6.2", "CAPACITORS"), type: "SUPPORTS" }],
  },
  {
    id: "EL-COMPONENT-RECTIFIER-001", domain: "EL",
    statement: "A rectifier circuit uses one or more diodes to convert an alternating-current supply into a direct-current (or pulsating direct-current) output.",
    provenance: [
      { locator: "loc-kuphaldt-rectifier-circuits", role: "DEFINES" },
      { locator: "loc-cg-ac6.2", role: "CURRICULUM_REQUIRES" },
    ],
    prereqs: [{ id: "EL-CONCEPT-AC-DC-DISTINCTION-001", strength: "STRONG" }],
    curriculum: [{ node: acNode("6.2"), type: "REQUIRED_FOR" }, { node: rangeNode("6.2", "RECTIFIERS"), type: "REQUIRED_FOR" }],
  },
  {
    // CC-09B.6 (task section 19): official SmartScreen handout (Handout 17,
    // "Electronic components") explicitly distinguishes half-wave from
    // full-wave/bridge rectification as named Level-2 teaching content, not
    // merely the generic rectifier concept already governed above. Reuses
    // the SAME already-verified Kuphaldt locator (independently
    // re-inspected: "The simplest kind of rectifier circuit is the
    // half-wave rectifier. It only allows one half of an AC waveform to
    // pass through to the load" -- section 3.4, Rectifier Circuits).
    id: "EL-COMPONENT-RECTIFIER-HALF-WAVE-001", domain: "EL",
    statement: "A half-wave rectifier uses a single diode to allow only one half-cycle of an AC waveform through to the load, blocking the other half-cycle, producing a pulsating DC output.",
    provenance: [
      { locator: "loc-kuphaldt-rectifier-circuits", role: "DEFINES", supportType: "DIRECT" },
      { locator: "loc-cg-ac6.2", role: "CURRICULUM_REQUIRES" },
    ],
    prereqs: [{ id: "EL-COMPONENT-RECTIFIER-001", strength: "REQUIRED" }],
    curriculum: [{ node: acNode("6.2"), type: "REQUIRED_FOR" }, { node: rangeNode("6.2", "RECTIFIERS"), type: "SUPPORTS" }],
  },
  {
    // CC-09B.6: independently re-inspected the same locator: full-wave
    // bridge rectification uses four diodes so that "regardless of the
    // polarity of the input, the current flows in the same direction
    // through the load", converting both half-cycles to the same output
    // polarity (a smoother pulsating DC than half-wave).
    id: "EL-COMPONENT-RECTIFIER-FULL-WAVE-001", domain: "EL",
    statement: "A full-wave bridge rectifier uses four diodes arranged so that both half-cycles of an AC waveform are converted to the same output polarity, producing a pulsating DC output with less ripple than a half-wave rectifier.",
    provenance: [
      { locator: "loc-kuphaldt-rectifier-circuits", role: "DEFINES", supportType: "DIRECT" },
      { locator: "loc-cg-ac6.2", role: "CURRICULUM_REQUIRES" },
    ],
    prereqs: [{ id: "EL-COMPONENT-RECTIFIER-001", strength: "REQUIRED" }],
    contrastsWith: ["EL-COMPONENT-RECTIFIER-HALF-WAVE-001"],
    curriculum: [{ node: acNode("6.2"), type: "REQUIRED_FOR" }, { node: rangeNode("6.2", "RECTIFIERS"), type: "SUPPORTS" }],
  },
  {
    id: "EL-COMPONENT-DIODE-001", domain: "EL",
    statement: "A diode is a semiconductor device formed at a p-n junction that conducts current easily in one direction (forward bias, junction narrows) and blocks current in the other direction (reverse bias, junction widens).",
    provenance: [
      { locator: "loc-openstax-up3-semiconductor-diode", role: "DEFINES" },
      { locator: "loc-cg-ac6.2", role: "CURRICULUM_REQUIRES" },
    ],
    curriculum: [{ node: acNode("6.2"), type: "REQUIRED_FOR" }, { node: rangeNode("6.2", "DIODES"), type: "REQUIRED_FOR" }],
  },
  {
    id: "EL-COMPONENT-ZENER-DIODE-001", domain: "EL",
    statement: "A Zener diode is a special-purpose diode designed to be operated in reverse breakdown at a well-defined breakdown voltage without damage, so it maintains a substantially constant voltage across itself and can be used to regulate voltage.",
    provenance: [
      { locator: "loc-kuphaldt-zener-diodes", role: "DEFINES" },
      { locator: "loc-cg-ac6.2", role: "CURRICULUM_REQUIRES" },
    ],
    prereqs: [{ id: "EL-COMPONENT-DIODE-001", strength: "REQUIRED" }],
    contrastsWith: ["EL-COMPONENT-DIODE-001"],
    curriculum: [{ node: acNode("6.2"), type: "REQUIRED_FOR" }, { node: rangeNode("6.2", "ZENER"), type: "REQUIRED_FOR" }],
  },
  {
    id: "EL-COMPONENT-LED-001", domain: "EL",
    statement: "A light-emitting diode (LED) produces light by electroluminescence: when forward-biased, recombination of electrons and holes at the junction releases energy as photons.",
    provenance: [
      { locator: "loc-kuphaldt-special-purpose-diodes", role: "DEFINES" },
      { locator: "loc-cg-ac6.2", role: "CURRICULUM_REQUIRES" },
    ],
    prereqs: [{ id: "EL-COMPONENT-DIODE-001", strength: "REQUIRED" }],
    curriculum: [{ node: acNode("6.2"), type: "REQUIRED_FOR" }, { node: rangeNode("6.2", "LED"), type: "REQUIRED_FOR" }],
  },
  {
    id: "EL-COMPONENT-PHOTODIODE-001", domain: "EL",
    statement: "A photodiode is a diode optimised to generate a photocurrent in response to incident light falling on its junction, allowing it to detect or measure light.",
    provenance: [
      { locator: "loc-kuphaldt-special-purpose-diodes", role: "DEFINES" },
      { locator: "loc-cg-ac6.2", role: "CURRICULUM_REQUIRES" },
    ],
    prereqs: [{ id: "EL-COMPONENT-DIODE-001", strength: "REQUIRED" }],
    curriculum: [{ node: acNode("6.2"), type: "REQUIRED_FOR" }, { node: rangeNode("6.2", "PHOTO"), type: "REQUIRED_FOR" }],
  },
  {
    id: "EL-COMPONENT-THERMISTOR-001", domain: "EL",
    statement: "An NTC (negative-temperature-coefficient) thermistor's electrical resistance decreases as its temperature increases, allowing it to be used as a temperature-sensing component.",
    provenance: [
      { locator: "loc-vishay-ntc-principle", role: "DEFINES" },
      { locator: "loc-cg-ac6.2", role: "CURRICULUM_REQUIRES" },
    ],
    curriculum: [{ node: acNode("6.2"), type: "REQUIRED_FOR" }, { node: rangeNode("6.2", "THERMISTORS"), type: "REQUIRED_FOR" }],
  },
  {
    // CC-09B.6 (task section 18): official SmartScreen handout (Handout
    // 17) explicitly names both thermistor types ("positive temperature
    // coefficient (PTC)... negative temperature coefficient (NTC)... with
    // PTC devices, the resistance increases as the temperature increases;
    // with NTC devices, the resistance decreases as the temperature
    // increases") -- PTC was genuinely missing, not merely under-
    // decomposed. Sourced from the same manufacturer family (Vishay)
    // already used for NTC, via a real PTC-specific datasheet.
    id: "EL-COMPONENT-THERMISTOR-PTC-001", domain: "EL",
    statement: "A PTC (positive-temperature-coefficient) thermistor's electrical resistance rises sharply once its temperature exceeds a defined switching temperature, in contrast to an NTC thermistor's resistance, which decreases as temperature rises; this behaviour is used for applications such as overcurrent and overload protection.",
    provenance: [
      { locator: "loc-vishay-ptcel-principle", role: "DEFINES", supportType: "DIRECT" },
      { locator: "loc-cg-ac6.2", role: "CURRICULUM_REQUIRES" },
    ],
    prereqs: [{ id: "EL-COMPONENT-THERMISTOR-001", strength: "STRONG" }],
    contrastsWith: ["EL-COMPONENT-THERMISTOR-001"],
    curriculum: [{ node: acNode("6.2"), type: "REQUIRED_FOR" }, { node: rangeNode("6.2", "THERMISTORS"), type: "SUPPORTS" }],
  },
  {
    id: "EL-COMPONENT-DIAC-001", domain: "EL",
    statement: "A DIAC is a bidirectional thyristor that remains a high-impedance, non-conducting device until the voltage across it exceeds its breakover voltage, at which point it switches into conduction in either direction; it is almost never used alone, but to trigger other thyristor devices.",
    provenance: [
      { locator: "loc-kuphaldt-diac", role: "DEFINES" },
      { locator: "loc-cg-ac6.2", role: "CURRICULUM_REQUIRES" },
    ],
    curriculum: [{ node: acNode("6.2"), type: "REQUIRED_FOR" }, { node: rangeNode("6.2", "DIACS"), type: "REQUIRED_FOR" }],
  },
  {
    id: "EL-COMPONENT-THYRISTOR-SCR-001", domain: "EL",
    statement: "A silicon-controlled rectifier (SCR) conducts current in one direction only once a sufficient gate current triggers it into conduction, and continues conducting until the current through it falls below the device's holding current.",
    provenance: [
      { locator: "loc-kuphaldt-scr", role: "DEFINES" },
      { locator: "loc-cg-ac6.2", role: "CURRICULUM_REQUIRES" },
    ],
    curriculum: [{ node: acNode("6.2"), type: "REQUIRED_FOR" }, { node: rangeNode("6.2", "THYRISTORS"), type: "REQUIRED_FOR" }],
  },
  {
    id: "EL-COMPONENT-TRIAC-001", domain: "EL",
    statement: "A TRIAC acts much like two silicon-controlled rectifiers connected back-to-back, allowing it to conduct current in both directions once triggered by gate current, making it suitable for controlling alternating current.",
    provenance: [
      { locator: "loc-kuphaldt-triac", role: "DEFINES" },
      { locator: "loc-cg-ac6.2", role: "CURRICULUM_REQUIRES" },
    ],
    prereqs: [{ id: "EL-COMPONENT-THYRISTOR-SCR-001", strength: "STRONG" }],
    contrastsWith: ["EL-COMPONENT-THYRISTOR-SCR-001"],
    curriculum: [{ node: acNode("6.2"), type: "REQUIRED_FOR" }, { node: rangeNode("6.2", "TRIACS"), type: "REQUIRED_FOR" }],
  },
  {
    // CC-09B.4 (task section 7): re-audited clause-by-clause. The intro
    // section establishes the general device definition (3-terminal,
    // collector-emitter current controlled by base current) and its dual
    // switch/amplifier use; the dedicated switch section adds the
    // specific off/saturated switching-state detail this statement names
    // explicitly -- classified PARTIAL each, confirmed jointly covering it.
    id: "EL-COMPONENT-TRANSISTOR-001", domain: "EL",
    statement: "A bipolar junction transistor is a three-terminal semiconductor device whose collector-emitter current is controlled by a much smaller base current, allowing it to act as an electrically controlled switch (fully off with no base current, fully on/saturated with sufficient base current) or as an amplifier.",
    provenance: [
      { locator: "loc-kuphaldt-bjt-intro", role: "DEFINES", supportType: "PARTIAL" },
      { locator: "loc-kuphaldt-bjt-switch", role: "SUPPORTS", supportType: "PARTIAL" },
      { locator: "loc-cg-ac6.2", role: "CURRICULUM_REQUIRES" },
    ],
    multiSourceFullyCovered: true,
    clauseCoverage: [
      { clause: "3-terminal device; collector-emitter current controlled by base current; can amplify", locator: "loc-kuphaldt-bjt-intro" },
      { clause: "acts as an electrically controlled switch: fully off with no base current, fully on/saturated with sufficient base current", locator: "loc-kuphaldt-bjt-switch" },
    ],
    curriculum: [{ node: acNode("6.2"), type: "REQUIRED_FOR" }, { node: rangeNode("6.2", "TRANSISTORS"), type: "REQUIRED_FOR" }],
  },
  {
    id: "EL-COMPONENT-INVERTER-001", domain: "EL",
    statement: "An inverter converts a direct-current supply into an alternating-current output, by using electronic switching circuits to switch the DC input in a controlled sequence and generate the AC voltage or current waveform.",
    // CC-09B.1: Texas Instruments (a first-party manufacturer technical
    // source, task section 18) is now the primary factual source;
    // University of Ottawa is retained and re-cited as SUPPORTS rather
    // than removed -- audit history is never silently erased.
    //
    // CC-09B.4 (task section 7): TI SLAA602A alone is DIRECT for the
    // whole statement (already confirmed adequate, no defect, in CC-09B.2
    // section 24); UOttawa is retained as a PARTIAL historical secondary
    // citation, not required for full coverage but not silently erased.
    provenance: [
      { locator: "loc-ti-inverter-principle", role: "DEFINES", supportType: "DIRECT" },
      { locator: "loc-uottawa-inverter-principle", role: "SUPPORTS", supportType: "PARTIAL" },
      { locator: "loc-cg-ac6.2", role: "CURRICULUM_REQUIRES" },
    ],
    multiSourceFullyCovered: true,
    clauseCoverage: [
      { clause: "an inverter converts DC to AC via controlled electronic switching, generating the AC waveform (whole statement)", locator: "loc-ti-inverter-principle" },
      { clause: "(historical secondary) same DC-to-AC switching principle", locator: "loc-uottawa-inverter-principle" },
    ],
    prereqs: [{ id: "EL-CONCEPT-AC-DC-DISTINCTION-001", strength: "STRONG" }],
    curriculum: [{ node: acNode("6.2"), type: "REQUIRED_FOR" }, { node: rangeNode("6.2", "INVERTORS"), type: "REQUIRED_FOR" }],
  },

  // -- CC-09B: LO6 AC6.1 electrical-system applications. Each connects a
  // real, already-sourced component (above) to the specific application
  // its own source material names, rather than a generic unsupported
  // "used in X" claim (task brief section 19/20). Proportionate: the
  // Level 2 requirement is the component-to-application relationship, not
  // full system design. --
  {
    id: "EL-APPLICATION-DIMMER-SWITCH-001", domain: "EL",
    statement: "A household dimmer switch typically uses a TRIAC to control the average power delivered to a lamp, by switching on at a controlled phase angle within each AC half-cycle.",
    provenance: [
      { locator: "loc-kuphaldt-triac", role: "SUPPORTS" },
      { locator: "loc-cg-ac6.1", role: "CURRICULUM_REQUIRES" },
    ],
    prereqs: [{ id: "EL-COMPONENT-TRIAC-001", strength: "REQUIRED" }],
    curriculum: [{ node: acNode("6.1"), type: "REQUIRED_FOR" }, { node: rangeNode("6.1", "DIMMER-SWITCHES"), type: "REQUIRED_FOR" }],
  },
  {
    id: "EL-APPLICATION-MOTOR-CONTROL-001", domain: "EL",
    statement: "Silicon-controlled rectifiers are commonly used in motor-control circuits to control the electrical power delivered to a motor.",
    provenance: [
      { locator: "loc-kuphaldt-scr", role: "SUPPORTS" },
      { locator: "loc-cg-ac6.1", role: "CURRICULUM_REQUIRES" },
    ],
    prereqs: [{ id: "EL-COMPONENT-THYRISTOR-SCR-001", strength: "REQUIRED" }],
    curriculum: [{ node: acNode("6.1"), type: "REQUIRED_FOR" }, { node: rangeNode("6.1", "MOTOR-CONTROL"), type: "REQUIRED_FOR" }],
  },
  {
    // CC-09B.2 correction (task section 22): CC-09B.1's DERIVED_FROM-only
    // treatment was itself an EMPIRICAL/APPLICATION derivation (thermistor
    // resistance-temperature response does not by itself entail a real
    // "boiler control" application). The Project Architect's re-inspection
    // of the SAME Vishay document CC-09B already registered found it
    // directly names "Heating and ventilation" (industrial) and "Central-
    // heating systems" (domestic) in its own Applications list, and shows
    // a real "boiler sensor" response-time example (Fig. 4) and a "Simple
    // thermostat" NTC/relay circuit (Fig. 16) -- genuine direct evidence
    // that was already sitting in an already-registered source and simply
    // was not the locator originally cited.
    id: "EL-APPLICATION-HEATING-BOILER-CONTROL-001", domain: "EL",
    statement: "Thermistors are used for temperature sensing in heating and ventilation systems, including central-heating and boiler controls, providing a feedback signal a control circuit (such as a thermostat) uses to switch a heating load on or off at set temperatures.",
    provenance: [
      { locator: "loc-vishay-ntc-heating-applications", role: "DEFINES", supportType: "DIRECT" },
      { locator: "loc-cg-ac6.1", role: "CURRICULUM_REQUIRES" },
    ],
    prereqs: [{ id: "EL-COMPONENT-THERMISTOR-001", strength: "REQUIRED" }],
    curriculum: [{ node: acNode("6.1"), type: "REQUIRED_FOR" }, { node: rangeNode("6.1", "HEATING-BOILER-CONTROLS"), type: "REQUIRED_FOR" }],
  },
  {
    // CC-09B.2 correction (task section 19): CC-09B.1's DERIVED_FROM-only
    // treatment was an EMPIRICAL/APPLICATION derivation (a photodiode
    // detecting light does not by itself entail a "security alarm"
    // application -- exactly the failure pattern the task's own worked
    // example names). Now cites a first-party manufacturer of a real,
    // commercially sold security product: SECO-LARM's ENFORCER photo-
    // electric beam sensor, explicitly marketed for "an alarm
    // notification" with a relay output wired to an alarm control panel.
    // The LED/photodiode component sources are retained as SUPPORTS for
    // the underlying component behaviour the beam sensor depends on, not
    // as the sole evidence for the application claim itself.
    // CC-09B.6 correction (task section 14): independent Project Architect
    // review of the official 2365-202 SmartScreen handout (Handout 18,
    // "Electronic systems") found the intended AC6.1 security-alarm
    // teaching example is a transistor/thyristor switching-and-latching
    // circuit (see EL-APPLICATION-SECURITY-ALARM-TRANSISTOR-THYRISTOR-001
    // below), not a beam-break sensor. This assertion's factual content
    // remains valid and well-evidenced (SECO-LARM is a real, commercially
    // sold product), so it is RETAINED as governed knowledge -- but
    // downgraded from REQUIRED_FOR to SUPPORTS so it no longer stands as
    // the sole (or primary) required Unit 202 Security-alarms coverage,
    // per this package's explicit governance rule that a valid but
    // wrongly-selected teaching example must not substitute for the
    // official one merely because it was easier to source.
    id: "EL-APPLICATION-SECURITY-ALARM-001", domain: "EL",
    statement: "An infrared LED transmitter and a photoelectric (photodiode) receiver can be paired as a beam-break sensor: an object interrupting the beam changes the receiver's output, which triggers a relay output wired to an alarm control panel -- the basis of commercially manufactured security/intrusion-detection beam sensors.",
    provenance: [
      { locator: "loc-seco-larm-beam-sensor-alarm", role: "DEFINES", supportType: "DIRECT" },
      { locator: "loc-cg-ac6.1", role: "CURRICULUM_REQUIRES" },
    ],
    prereqs: [{ id: "EL-COMPONENT-LED-001", strength: "REQUIRED" }, { id: "EL-COMPONENT-PHOTODIODE-001", strength: "REQUIRED" }],
    curriculum: [{ node: acNode("6.1"), type: "SUPPORTS" }, { node: rangeNode("6.1", "SECURITY-ALARMS"), type: "SUPPORTS" }],
  },
  {
    // CC-09B.6 (task section 14): the official-teaching-matched replacement
    // example. The general thyristor-latching PROPERTY is DIRECT via the
    // same already-verified Kuphaldt SCR locator already governing
    // EL-COMPONENT-THYRISTOR-001/EL-APPLICATION-MOTOR-CONTROL-001 ("SCR...
    // continues conducting until the anode-to-cathode current falls below
    // the device's holding current"); the specific "normally-closed loop
    // -> transistor -> thyristor gate -> latched sounder" alarm-circuit
    // APPLICATION pattern is independently corroborated (PARTIAL) via
    // ElProCus. SmartScreen itself is used only to identify which
    // proportionate proposition to source and govern, never as the
    // factual authority for the proposition itself.
    id: "EL-APPLICATION-SECURITY-ALARM-TRANSISTOR-THYRISTOR-001", domain: "EL",
    statement: "A simple electronic security-alarm circuit uses a transistor to detect a break in a normally-closed sensor loop; the transistor then triggers a thyristor, which latches on and continues to power a sounder even if the loop is reclosed, until the circuit is deliberately reset.",
    provenance: [
      { locator: "loc-kuphaldt-scr", role: "SUPPORTS", supportType: "PARTIAL" },
      { locator: "loc-elprocus-thyristor-sensor-alarm", role: "DEFINES", supportType: "PARTIAL" },
      { locator: "loc-cg-ac6.1", role: "CURRICULUM_REQUIRES" },
    ],
    multiSourceFullyCovered: true,
    clauseCoverage: [
      { clause: "a normally-closed sensor loop is monitored by a transistor, which triggers a thyristor's gate when the loop opens", locator: "loc-elprocus-thyristor-sensor-alarm" },
      { clause: "the thyristor latches on (continues conducting) once triggered, even after the triggering condition ends, until the circuit is reset", locator: "loc-kuphaldt-scr" },
    ],
    prereqs: [{ id: "EL-COMPONENT-TRANSISTOR-001", strength: "REQUIRED" }, { id: "EL-COMPONENT-THYRISTOR-SCR-001", strength: "REQUIRED" }],
    curriculum: [{ node: acNode("6.1"), type: "REQUIRED_FOR" }, { node: rangeNode("6.1", "SECURITY-ALARMS"), type: "REQUIRED_FOR" }],
  },
  // CC-09B.3 (task sections 3/4): closes the two AC6.1 application-
  // evidence gaps CC-09B.2 left honestly incomplete after failing to find
  // adequate sources. Both now cite real, first-party, application-
  // specific manufacturer documentation, inspected directly (not merely
  // generic component behaviour) -- see PROJECT-STATUS.md CC-09B.3.
  // CC-09B.5 correction (task sections 12/13): SOURCE SPECIFICITY MUST NOT
  // BECOME OR EXCEED SYLLABUS SCOPE. The CC-09B.3 statements below were
  // factually correct and genuinely DIRECT-evidenced, but their wording
  // absorbed source-specific implementation vocabulary (DAA, TIP/RING,
  // CMOS, "address code", RF/IR, named products) that AC6.1's actual
  // cognitive verb ("Describe the function and application") does not
  // require at Level 2 depth. The detailed Skyworks/Holtek evidence is
  // UNCHANGED and remains cited (still fully supports the now-narrower
  // claim, a subset of what each source establishes) -- only the
  // GOVERNED, learner-facing proposition is narrowed. Product/example
  // names (garage door, car door) remain in each locator's own
  // locatorSummary as evidence context; they are deliberately not
  // repeated in the assertion text itself (task section 7).
  {
    // CC-09B.6 correction (task section 15): the official SmartScreen
    // handout's intended AC6.1 telephone teaching content is the UK master
    // telephone socket's capacitor/resistor/surge-protector (see
    // EL-APPLICATION-TELEPHONE-MASTER-SOCKET-001 below), not the DAA
    // diode-bridge. This assertion's factual content remains valid and
    // well-evidenced, so it is RETAINED -- but downgraded from
    // REQUIRED_FOR to SUPPORTS for the same reason as the security-alarm
    // beam-sensor correction above.
    id: "EL-APPLICATION-TELEPHONE-001", domain: "EL",
    statement: "Telephone equipment includes a diode bridge connected across the two wires of the telephone line, so that the equipment's internal circuitry is unaffected by which way round the line is connected.",
    provenance: [
      { locator: "loc-skyworks-an347-bridge-diode", role: "DEFINES", supportType: "DIRECT" },
      { locator: "loc-cg-ac6.1", role: "CURRICULUM_REQUIRES" },
    ],
    prereqs: [{ id: "EL-COMPONENT-DIODE-001", strength: "REQUIRED" }],
    curriculum: [{ node: acNode("6.1"), type: "SUPPORTS" }, { node: rangeNode("6.1", "TELEPHONES"), type: "SUPPORTS" }],
  },
  {
    // CC-09B.6 (task section 15): the official-teaching-matched
    // replacement. Sourced independently (Wikipedia's "British telephone
    // sockets" article, itself citing BS 6312 and BT SIN 351/352 --
    // recorded honestly as an encyclopedia-tier source; see the source's
    // own registration comment for why a stronger freely-accessible source
    // could not be found). SmartScreen itself only identified WHICH
    // proposition to source and govern; it is never treated as the
    // factual authority for the proposition.
    id: "EL-APPLICATION-TELEPHONE-MASTER-SOCKET-001", domain: "EL",
    statement: "A master telephone socket contains a capacitor that couples the AC ringing signal to the line while blocking the line's DC, a resistor that provides a defined test load for line testing when no telephone is connected, and a surge protector that suppresses transient overvoltages on the line; secondary (extension) sockets, wired in parallel from the master socket, contain none of these components.",
    provenance: [
      { locator: "loc-wikipedia-telephone-master-socket-components", role: "DEFINES", supportType: "DIRECT" },
      { locator: "loc-cg-ac6.1", role: "CURRICULUM_REQUIRES" },
    ],
    prereqs: [{ id: "EL-COMPONENT-CAPACITOR-001", strength: "REQUIRED" }, { id: "EL-COMPONENT-RESISTOR-001", strength: "REQUIRED" }],
    curriculum: [{ node: acNode("6.1"), type: "REQUIRED_FOR" }, { node: rangeNode("6.1", "TELEPHONES"), type: "REQUIRED_FOR" }],
  },
  {
    id: "EL-APPLICATION-WIRELESS-CONTROL-001", domain: "EL",
    statement: "A wireless control system uses an electronic receiver and decoder circuit that responds to a transmitted control signal by switching an output to operate a device.",
    provenance: [
      { locator: "loc-holtek-ht12d-applications", role: "DEFINES", supportType: "DIRECT" },
      { locator: "loc-cg-ac6.1", role: "CURRICULUM_REQUIRES" },
    ],
    prereqs: [{ id: "EL-COMPONENT-TRANSISTOR-001", strength: "SUPPORTING" }],
    curriculum: [{ node: acNode("6.1"), type: "REQUIRED_FOR" }, { node: rangeNode("6.1", "WIRELESS-CONTROL-SYSTEMS"), type: "REQUIRED_FOR" }],
  },
];

// ---------------------------------------------------------------------
// Misconceptions -- plausible recurring learner errors, not one per
// assertion. Each conflicts with the stable assertion identity it
// contradicts (WP1.2 SS13-15).
// ---------------------------------------------------------------------

interface MisconceptionDef {
  id: string;
  description: string;
  conflicts: string[];
}

const M: MisconceptionDef[] = [
  {
    id: "MIS-EL-OHM-UNRELATED-SYMBOLS-001",
    description: "Treats V, I and R as three unrelated symbols to memorise rather than as a single relationship connecting voltage, current and resistance (V = I times R).",
    conflicts: ["EL-OHM-RELATIONSHIP-001"],
  },
  {
    id: "MIS-EL-OHM-REARRANGE-ERROR-001",
    description: "Incorrectly rearranges a multiplicative relationship such as V = I times R or P = V times I (for example moving a variable to the wrong side, or inverting the wrong pair of variables) when isolating a different subject.",
    conflicts: ["EL-OHM-REARRANGE-001", "EL-POWER-REARRANGE-001"],
  },
  {
    id: "MIS-EL-OHM-WRONG-OPERATION-001",
    description: "Selects the wrong arithmetic operation when calculating an unknown quantity from V = I times R (for example multiplying instead of dividing when solving for current or resistance, or dividing the two known quantities in the wrong order).",
    conflicts: ["EL-OHM-SOLVE-I-001", "EL-OHM-SOLVE-R-001"],
  },
  {
    id: "MIS-EL-UNIT-CONFUSION-001",
    description: "Confuses the electrical quantities voltage, current, resistance, power and energy with their SI units (volt, ampere, ohm, watt, joule), or attaches the wrong unit to the wrong quantity.",
    conflicts: ["EL-UNIT-VOLT-001", "EL-UNIT-AMPERE-001", "EL-UNIT-OHM-001", "EL-UNIT-WATT-001", "EL-UNIT-JOULE-001"],
  },
  {
    id: "MIS-EL-SI-PREFIX-ERROR-001",
    description: "Confuses SI-prefix magnitudes when converting between units (for example treating milliamps and amps as numerically equal, or converting in the wrong direction, such as multiplying instead of dividing by the scale factor).",
    conflicts: ["EL-OHM-SOLVE-V-001", "EL-OHM-SOLVE-I-001", "EL-OHM-SOLVE-R-001"],
  },
  {
    id: "MIS-EL-SERIES-PARALLEL-CONFUSION-001",
    description: "Confuses series and parallel circuit structure, for example treating components wired in parallel as if they were in series (or vice versa) when identifying current and voltage relationships.",
    conflicts: ["EL-CIRCUIT-SERIES-STRUCTURE-001", "EL-CIRCUIT-PARALLEL-STRUCTURE-001"],
  },
  {
    id: "MIS-EL-PARALLEL-RESISTANCE-ADDITION-001",
    description: "Calculates the total resistance of a parallel circuit by simply adding the branch resistances, as if they were in series, instead of using the reciprocal-of-sum-of-reciprocals relationship.",
    conflicts: ["EL-PARALLEL-RESISTANCE-001", "EL-PARALLEL-RESISTANCE-CALC-001"],
  },
  {
    id: "MIS-EL-RECIPROCAL-FORGOTTEN-INVERT-001",
    description: "Correctly sums the reciprocals of the branch resistances in a parallel circuit but forgets to take the reciprocal of the result, giving an answer that is the reciprocal of the correct total resistance rather than the total resistance itself.",
    conflicts: ["EL-PARALLEL-RESISTANCE-CALC-001"],
  },
  {
    id: "MIS-EL-POWER-ENERGY-CONFUSION-001",
    description: "Confuses power and energy, treating the two quantities (and their units, the watt and the joule) as interchangeable.",
    conflicts: ["EL-CONCEPT-POWER-001", "EL-CONCEPT-ENERGY-001"],
  },
  {
    id: "MIS-EL-VOLTAGE-DROP-MISUNDERSTANDING-001",
    description: "Believes that voltage is 'used up' or disappears as current flows through a series circuit, rather than understanding voltage drop as the potential difference resulting from current flowing through resistance.",
    conflicts: ["EL-VOLTAGE-DROP-001", "EL-SERIES-VOLTAGE-001"],
  },
  {
    id: "MIS-EL-CONDUCTOR-INSULATOR-CONFUSION-001",
    description: "Confuses which materials are good conductors versus insulators, or believes conductivity and resistance are unrelated properties.",
    conflicts: ["EL-CONCEPT-CONDUCTOR-001", "EL-CONCEPT-INSULATOR-001"],
  },
  {
    id: "MIS-FM-PROPORTION-DIRECTION-CONFUSION-001",
    description: "Confuses direct and inverse proportion, for example assuming a quantity increases when it should decrease as another quantity increases.",
    conflicts: ["FM-ALG-PROPORTION-DIRECT-001", "FM-ALG-PROPORTION-INVERSE-001", "EL-OHM-PROPORTIONALITY-001"],
  },
  {
    id: "MIS-EL-CURRENT-VOLTAGE-CONFUSION-001",
    description: "Confuses current and voltage as concepts, for example treating current as something a source 'has' independent of the circuit rather than voltage driving current through resistance.",
    conflicts: ["EL-CONCEPT-CURRENT-001", "EL-CONCEPT-VOLTAGE-001"],
  },
  {
    id: "MIS-EL-RESISTANCE-RESISTIVITY-CONFUSION-001",
    description: "Treats resistance and resistivity as the same property, not realising that resistivity is a material property independent of a conductor's dimensions while resistance also depends on length and cross-sectional area.",
    conflicts: ["EL-CONCEPT-RESISTANCE-001", "EL-CONCEPT-RESISTIVITY-001"],
  },
  {
    id: "MIS-EL-INSTRUMENT-CONNECTION-CONFUSION-001",
    description: "Connects a voltmeter in series or an ammeter in parallel, swapping the correct connection method for the two instruments.",
    conflicts: ["EL-INSTRUMENT-VOLTMETER-001", "EL-INSTRUMENT-AMMETER-001", "EL-INSTRUMENT-SELECT-001"],
  },
  {
    id: "MIS-EL-ELECTRON-CURRENT-DIRECTION-CONFUSION-001",
    description: "Confuses conventional current direction (positive to negative) with the actual direction of electron flow (negative to positive) in a conductor.",
    conflicts: ["EL-CONCEPT-ELECTRON-THEORY-001", "EL-CURRENT-CHARGE-RELATIONSHIP-001"],
  },
  {
    id: "MIS-EL-AC-DC-CONFUSION-001",
    description: "Treats alternating current and direct current as the same, or believes an AC supply has a single constant unchanging value like a DC supply.",
    conflicts: ["EL-CONCEPT-AC-DC-DISTINCTION-001", "EL-CONCEPT-SINE-WAVE-001"],
  },
  {
    id: "MIS-EL-PEAK-RMS-CONFUSION-001",
    description: "Confuses the peak value of an AC waveform with its RMS value, for example assuming a stated AC supply voltage (such as 230 V) is a peak value rather than an RMS value.",
    conflicts: ["EL-WAVEFORM-RMS-001", "EL-CONCEPT-PEAK-VS-RMS-SUPPLY-INTERPRETATION-001"],
  },
  {
    id: "MIS-EL-EMF-VOLTAGE-CONFUSION-001",
    description: "Confuses EMF (the source's own electrical energy per unit charge) with terminal voltage, treating them as always identical rather than recognising terminal voltage is reduced by the source's internal resistance when supplying current.",
    conflicts: ["EL-CONCEPT-EMF-001", "EL-CONCEPT-TERMINAL-VOLTAGE-001"],
  },
  {
    id: "MIS-EL-ENERGY-UNIT-CONFUSION-001",
    description: "Confuses the joule and the kilowatt-hour as interchangeable without converting between them, or is unaware that they measure the same quantity (energy) at different scales.",
    conflicts: ["EL-UNIT-JOULE-001", "EL-UNIT-KWH-001"],
  },
  {
    id: "MIS-EL-DIODE-DIRECTION-CONFUSION-001",
    description: "Confuses which direction a diode allows current to flow (forward bias) versus blocks it (reverse bias), or assumes a diode conducts equally in both directions like a plain resistor.",
    conflicts: ["EL-COMPONENT-DIODE-001"],
  },
];

// ---------------------------------------------------------------------
// Assemble the flat KnowledgeGraphManifest shape.
// ---------------------------------------------------------------------

const domainOf = (id: string): string => {
  const def = A.find((a) => a.id === id);
  if (!def) throw new Error(`unknown assertion id referenced: ${id}`);
  return def.domain;
};
void domainOf;

const relationships: KnowledgeGraphManifest["assertionRelationships"] = [];
for (const a of A) {
  for (const p of a.prereqs ?? []) {
    relationships.push({
      fromIdentifier: p.id,
      toIdentifier: a.id,
      relationshipType: "PREREQUISITE_OF",
      strength: p.strength,
    });
  }
  for (const s of a.supports ?? []) {
    relationships.push({
      fromIdentifier: a.id,
      toIdentifier: s.id,
      relationshipType: "SUPPORTS",
      strength: s.strength,
    });
  }
  for (const c of a.contrastsWith ?? []) {
    relationships.push({
      fromIdentifier: a.id,
      toIdentifier: c,
      relationshipType: "CONTRASTS_WITH",
    });
  }
  if ((a.derivedFrom ?? []).length > 0 && !a.derivedFromKind) {
    throw new Error(
      `${a.id} declares derivedFrom but no derivedFromKind -- CC-09B.2 requires every DERIVED_FROM edge to state whether it is a valid MATHEMATICAL/LOGICAL_DEFINITIONAL consequence before it may substitute for direct provenance`,
    );
  }
  for (const d of a.derivedFrom ?? []) {
    relationships.push({
      fromIdentifier: a.id,
      toIdentifier: d,
      relationshipType: "DERIVED_FROM",
      derivationKind: a.derivedFromKind,
    });
  }
}

// The six "unit recognition SUPPORTS quantity concept" edges use the
// dedicated `supports` field so the direction (unit -> concept) reads
// naturally at the point each unit assertion is authored above; wire
// them here since they cross the LO2 unit/concept split.
const unitSupportsConcept: [string, string][] = [
  ["EL-UNIT-VOLT-001", "EL-CONCEPT-VOLTAGE-001"],
  ["EL-UNIT-AMPERE-001", "EL-CONCEPT-CURRENT-001"],
  ["EL-UNIT-OHM-001", "EL-CONCEPT-RESISTANCE-001"],
  ["EL-UNIT-WATT-001", "EL-CONCEPT-POWER-001"],
  ["EL-UNIT-JOULE-001", "EL-CONCEPT-ENERGY-001"],
  ["EL-UNIT-OHM-METRE-001", "EL-CONCEPT-RESISTIVITY-001"],
];
for (const [from, to] of unitSupportsConcept) {
  relationships.push({
    fromIdentifier: from,
    toIdentifier: to,
    relationshipType: "SUPPORTS",
    strength: "SUPPORTING",
  });
}

/** Stable identity of this governed knowledge-corpus snapshot module, referenced by governed ContentRelease manifests (scripts/content/data/content-releases.ts). */
export const CC04_KNOWLEDGE_CORPUS_ID = "cc04-unit202-electrical-science" as const;

export const cc04Unit202ElectricalScience: KnowledgeGraphManifest = {
  domains: [
    { code: "FM", name: "Foundational Maths", description: "Reusable horizontal foundational mathematics domain (WP1.2 SS7)." },
    { code: "FP", name: "Foundational Physics", description: "Reusable horizontal foundational physics domain (WP1.2 SS7)." },
    { code: "EL", name: "Electrical", description: "First full vocational vertical domain (WP1.2 SS7)." },
  ],

  sources: [
    {
      key: SRC_CG,
      title: "City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) — Qualification Handbook",
      publisher: "City & Guilds",
      sourceFamily: "Qualification handbook",
      sourceType: "QUALIFICATION_HANDBOOK",
      jurisdiction: "UK",
      canonicalReference: "City & Guilds 2365-02, Accreditation 600/5498/0",
      accessLocation: "https://www.cityandguilds.com/-/media/productdocuments/building_services_engineering/electrical_installation/2365/2365_level_2/centre_documents/2365-02_l2_electrical_installation_qualification_handbook_v1-12-pdf.pdf",
      // CC-09C: the sole source in this corpus ever cited with
      // provenanceRole CURRICULUM_REQUIRES/AUTHORITATIVE_REQUIREMENT/
      // LEGAL_BASIS -- narrowly and defensibly classified as the generic
      // NORMATIVE_CURRICULUM evidence role (see knowledge-graph.ts's
      // sourceRoleSchema). Every other source in this manifest is
      // deliberately left unclassified rather than retroactively
      // mass-labelled (task section 32).
      sourceRole: "NORMATIVE_CURRICULUM",
    },
    {
      key: SRC_BIPM,
      title: "The International System of Units (SI Brochure)",
      publisher: "Bureau International des Poids et Mesures (BIPM)",
      sourceFamily: "International metrology standard",
      sourceType: "STANDARD",
      jurisdiction: "International",
      canonicalReference: "DOI 10.59161/AUEZ1291",
      accessLocation: "https://www.bipm.org/en/publications/si-brochure",
    },
    {
      key: SRC_DFE_MATHS,
      title: "Mathematics GCSE subject content and assessment objectives",
      publisher: "UK Department for Education",
      sourceFamily: "National curriculum specification",
      sourceType: "OFFICIAL_GUIDANCE",
      jurisdiction: "UK",
      canonicalReference: "GCSE_mathematics_subject_content_and_assessment_objectives",
      accessLocation: "https://assets.publishing.service.gov.uk/media/5a7cb5b040f0b6629523b52c/GCSE_mathematics_subject_content_and_assessment_objectives.pdf",
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
    },
    // -- CC-09B new sources --
    {
      key: SRC_OPENSTAX_UP3,
      title: "University Physics Volume 3",
      publisher: "OpenStax / Rice University",
      sourceFamily: "Open textbook",
      sourceType: "TEXTBOOK",
      jurisdiction: "International",
      canonicalReference: "OpenStax University Physics Volume 3",
      accessLocation: "https://openstax.org/books/university-physics-volume-3",
    },
    {
      // "Lessons in Electric Circuits" (Tony R. Kuphaldt, originally
      // published under the Design Science License; this LibreTexts
      // mirror -- an NSF-supported multi-institution academic OER
      // platform -- displays it under GFDL 1.3), Volume III
      // (Semiconductors). A long-established, collaboratively-developed
      // open electronics textbook (chapter/section structure, not a blog
      // or revision site), used here for LO6 device-level facts OpenStax
      // (physics-first, no power-electronics/thyristor coverage) does not
      // reach: rectification, Zener/special-purpose diodes, DIAC/SCR/
      // TRIAC thyristor family, bipolar-junction-transistor switching.
      key: SRC_KUPHALDT_SEMICONDUCTORS,
      title: "Electric Circuits III - Semiconductors (Kuphaldt)",
      publisher: "Tony R. Kuphaldt / LibreTexts (Workforce LibreTexts)",
      sourceFamily: "Open textbook",
      sourceType: "TEXTBOOK",
      jurisdiction: "International",
      canonicalReference: "Lessons in Electric Circuits, Volume III -- Semiconductors",
      accessLocation: "https://workforce.libretexts.org/Bookshelves/Electronics_Technology/Electric_Circuits_III_-_Semiconductors_(Kuphaldt)",
    },
    {
      // Manufacturer application note (task's own suggested source class
      // for device-specific behaviour); used only for the NTC thermistor's
      // basic resistance-temperature operating principle and application
      // context, never for proprietary device-specific electrical ratings.
      key: SRC_VISHAY_NTC,
      title: "NTC Thermistors Application Note",
      publisher: "Vishay BCcomponents",
      sourceFamily: "Manufacturer application note",
      sourceType: "APPLICATION_NOTE",
      jurisdiction: "International",
      canonicalReference: "Vishay BCcomponents document 29053",
      accessLocation: "https://www.vishay.com/docs/29053/ntcappnote.pdf",
    },
    {
      // University course material (source priority tier 4: "government/
      // official educational source" -- used only because no accessible
      // open-textbook chapter on DC-to-AC inverters was found; the fact
      // cited is the single basic definitional principle, not any deeper
      // inverter-design content this deck also contains.
      key: SRC_UOTTAWA_INVERTERS,
      title: "ELG4139: DC to AC Converters (course material)",
      publisher: "University of Ottawa, School of Electrical Engineering and Computer Science",
      sourceFamily: "University course material",
      sourceType: "COURSE_MATERIAL",
      jurisdiction: "International",
      canonicalReference: "ELG4139 DC to AC Converters",
      accessLocation: "https://www.site.uottawa.ca/~rhabash/ELG4139DCtoACConverters.pdf",
    },
    // -- CC-09B.1 audit-correction sources --
    {
      // Stronger first-party manufacturer technical source for the
      // inverter Range item, per task section 18. Supplements (does not
      // replace/erase) the UOttawa course-material source above.
      key: SRC_TI_INVERTERS,
      title: "800 VA Pure Sine Wave Inverter Reference Design (SLAA602A)",
      publisher: "Texas Instruments",
      sourceFamily: "Manufacturer application report",
      sourceType: "APPLICATION_NOTE",
      jurisdiction: "International",
      canonicalReference: "Texas Instruments literature number SLAA602A",
      accessLocation: "https://www.ti.com/lit/an/slaa602a/slaa602a.pdf",
    },
    {
      // OpenStax College Physics 2e -- same CC BY-NC-SA licence family as
      // UP1/UP2/UP3, used specifically for its dedicated "9.5 Simple
      // Machines" section (gears, pulleys, mechanical advantage), which
      // University Physics Volume 1's torque/equilibrium chapter (used
      // for levers) does not itself extend to.
      key: SRC_OPENSTAX_COLLEGE_PHYSICS,
      title: "College Physics 2e",
      publisher: "OpenStax / Rice University",
      sourceFamily: "Open textbook",
      sourceType: "TEXTBOOK",
      jurisdiction: "International",
      canonicalReference: "OpenStax College Physics 2e",
      accessLocation: "https://openstax.org/books/college-physics-2e",
    },
    {
      // "Lessons in Electric Circuits" Volume I (Direct Current) --
      // same Kuphaldt/LibreTexts open-textbook family already registered
      // for Volume III (Semiconductors), used here specifically for its
      // "2.5 Resistors" section (the resistor as a manufactured
      // component, not merely the abstract quantity resistance).
      key: SRC_KUPHALDT_DC_CIRCUITS,
      title: "Electric Circuits I - Direct Current (Kuphaldt)",
      publisher: "Tony R. Kuphaldt / LibreTexts (Workforce LibreTexts)",
      sourceFamily: "Open textbook",
      sourceType: "TEXTBOOK",
      jurisdiction: "International",
      canonicalReference: "Lessons in Electric Circuits, Volume I -- Direct Current",
      accessLocation: "https://workforce.libretexts.org/Bookshelves/Electronics_Technology/Electric_Circuits_I_-_Direct_Current_(Kuphaldt)",
    },
    // -- CC-09B.2 (source-first evidence hardening) sources --
    {
      // Official US standards body (highest source-priority tier). Its
      // Appendix D definitions ("active energy", "power factor (PF)",
      // "element") directly establish the factual content several
      // instrument/quantity assertions previously only reached via a
      // DERIVED_FROM chain from unrelated relationship assertions.
      key: SRC_NIST_HB44,
      title: "NIST Handbook 44: Specifications, Tolerances, and Other Technical Requirements for Weighing and Measuring Devices -- Section 3.41, Non-Utility Electricity-Measuring Systems (Tentative Code)",
      publisher: "National Institute of Standards and Technology (NIST)",
      sourceFamily: "Official standards body",
      sourceType: "STANDARD",
      jurisdiction: "United States",
      canonicalReference: "NIST Handbook 44 - 2026, Section 3.41",
      accessLocation: "https://www.nist.gov/system/files/documents/2025/12/30/3-41-26-HB44-20251222.pdf",
    },
    {
      // University engineering course material giving the concrete
      // dynamometer-wattmeter circuit (current coil in series carrying
      // load current, potential coil in parallel carrying a current
      // proportional to load voltage) that NIST's abstract "element"
      // definition does not itself spell out.
      key: SRC_INDUS_UNI_WATTMETER,
      title: "Dynamometer Type Wattmeter",
      publisher: "Indus University",
      sourceFamily: "University course material",
      sourceType: "COURSE_NOTES",
      jurisdiction: "International",
      canonicalReference: "Indus University course content: Dynamometer-type wattmeter",
      accessLocation: "https://coursecontent.indusuni.ac.in/wp-content/uploads/sites/8/2021/10/Dynamometer-type-wattmeter.pdf",
    },
    {
      // University engineering course material. Used specifically because
      // the Project Architect's audit found OpenStax College Physics 2e
      // section 9.5 supports gears as simple machines and mechanical
      // advantage as a ratio of radii, but does NOT itself establish
      // tooth-count equivalence or the speed/torque trade-off -- this
      // source directly establishes both.
      key: SRC_UCSD_GEAR_RATIOS,
      title: "Machine Design: Gear Ratios",
      publisher: "University of California San Diego, Department of Mechanical and Aerospace Engineering",
      sourceFamily: "University course material",
      sourceType: "COURSE_NOTES",
      jurisdiction: "United States",
      canonicalReference: "UCSD MAE 3, Machine Design: Gear Ratios",
      accessLocation: "https://mae3.eng.ucsd.edu/machine-design/gear-ratios",
    },
    {
      // First-party manufacturer (SECO-LARM, "ENFORCER" security-product
      // line) installation manual for a real, commercially sold
      // photoelectric infrared beam-break sensor wired to an alarm
      // control panel and explicitly marketed for "alarm notification"
      // and security applications -- direct evidence for the specific
      // application claim that a photodiode's/LED's own component
      // behaviour does not by itself establish.
      key: SRC_SECO_LARM_BEAM_SENSOR,
      title: "ENFORCER E-931-S33PRGQ 33ft Polarized Reflective Photoelectric Beam Sensor -- Installation Manual",
      publisher: "SECO-LARM U.S.A., Inc.",
      sourceFamily: "Manufacturer installation manual",
      sourceType: "INSTALLATION_MANUAL",
      jurisdiction: "International",
      canonicalReference: "SECO-LARM E-931-S33PRGQ Installation Manual",
      accessLocation: "https://www.seco-larm.com/wp-content/uploads/2020/12/MI_E-931-S33PRGQ_231113.pdf",
    },
    // -- CC-09B.3 sources --
    {
      // First-party manufacturer (Skyworks Solutions, successor to
      // Silicon Laboratories' DAA business) design guide for real
      // telephone-line interface (Direct Access Arrangement) circuitry.
      // Figure 2 ("Typical Si3018 Based DAA Application Circuit") and
      // Figure 29 ("SELV, TNV-3 and Isolation Barrier") both show a
      // "Bridge Diode" block wired directly to the telephone line's TIP
      // and RING terminals -- genuine application-specific evidence that
      // a diode bridge is a real component of telephone equipment, not
      // merely a generic polarity-protection circuit description.
      key: SRC_SKYWORKS_DAA_DESIGN_GUIDE,
      title: "AN347: DAA Design Guide",
      publisher: "Skyworks Solutions, Inc.",
      sourceFamily: "Manufacturer application note",
      sourceType: "APPLICATION_NOTE",
      jurisdiction: "International",
      canonicalReference: "Skyworks Solutions Application Note AN347, Rev. 0.3",
      accessLocation: "https://www.skyworksinc.com/-/media/Skyworks/SL/documents/public/application-notes/AN347.pdf",
    },
    {
      // First-party manufacturer (Holtek Semiconductor) datasheet for a
      // real, commercially sold remote-control decoder IC. Its own
      // "Applications" list names "Garage door controllers", "Car door
      // controllers", "Car alarm system", "Security system" and "Other
      // remote control systems" directly; its own functional description
      // and application circuit show the decoder's CMOS output pins
      // switching to activate an output when a matching wireless code is
      // received.
      //
      // CC-09B.4 (task section 3.B): accessLocation/canonicalReference
      // corrected to the official first-party holtek.com copy (task
      // section 17, "prefer the original publisher URL") -- the CC-09B.3
      // Farnell-mirrored Rev. 1.10 snapshot is preserved as a historical
      // SUPERSEDED sourceVersion below (SV_HOLTEK_HT12D), never deleted.
      key: SRC_HOLTEK_HT12D,
      title: "HT12D/HT12F 2^12 Series of Decoders",
      publisher: "Holtek Semiconductor Inc.",
      sourceFamily: "Manufacturer datasheet",
      sourceType: "DATASHEET",
      jurisdiction: "International",
      canonicalReference: "Holtek HT12D/HT12F Datasheet, Rev. 1.40",
      accessLocation: "https://www.holtek.com/webapi/116711/HT12D_Fv140.pdf",
    },
    // -- CC-09B.4 (retroactive source-first provenance migration) sources --
    {
      // Official standards-body-adjacent open textbook (same OpenStax
      // family already used for physics volumes), used specifically for
      // its dedicated electrolysis section -- the direct chemistry
      // authority for electric current driving chemical change, distinct
      // from the physics-only current/resistance chapters already cited.
      key: SRC_OPENSTAX_CHEMISTRY,
      title: "Chemistry 2e",
      publisher: "OpenStax / Rice University",
      sourceFamily: "Open textbook",
      sourceType: "TEXTBOOK",
      jurisdiction: "International",
      canonicalReference: "OpenStax Chemistry 2e",
      accessLocation: "https://openstax.org/books/chemistry-2e",
    },
    {
      // First-party manufacturer (Fluke, the leading electrical test and
      // measurement instrument manufacturer) technical explainer for a
      // real, commercially sold class of instrument -- direct evidence
      // for the clamp meter's actual operating principle, not merely the
      // generic physics of current producing a magnetic field.
      key: SRC_FLUKE_CLAMP_METERS,
      title: "The ABCs of Clamp Meters",
      publisher: "Fluke Corporation",
      sourceFamily: "Manufacturer technical article",
      sourceType: "TECHNICAL_ARTICLE",
      jurisdiction: "International",
      canonicalReference: "Fluke: The ABCs of Clamp Meters",
      accessLocation: "https://www.fluke.com/en-us/learn/blog/clamps/abcs-of-clamp-meters",
    },
    {
      // First-party manufacturer (Prysmian, a major first-tier cable
      // manufacturer) datasheet for a real, BS 6004-compliant PVC-
      // insulated copper cable explicitly sold for UK fixed electrical
      // installation -- direct, installation-specific evidence for the
      // copper-conductor/PVC-insulation pairing that a general physics
      // resistivity table alone does not itself establish for PVC.
      key: SRC_PRYSMIAN_6242Y,
      title: "6242Y PVC Flat Wiring Cable with Bare CPC (BS 6004, 300/500V) -- Datasheet",
      publisher: "Prysmian Group",
      sourceFamily: "Manufacturer datasheet",
      sourceType: "DATASHEET",
      jurisdiction: "United Kingdom",
      canonicalReference: "Prysmian 6242Y Datasheet",
      accessLocation: "https://datasheet.prysmian.com/pdf/datasheet/en-GB/312416/GB00_6242Y",
    },
    {
      // First-party manufacturer (Vishay, same manufacturer family already
      // used for the corpus's NTC thermistor evidence) datasheet for a
      // real PTC (positive-temperature-coefficient) thermistor product --
      // direct evidence that PTC thermistor resistance rises sharply with
      // temperature, the fact NTC-only sourcing could not itself establish
      // (CC-09B.6, task section 18 -- SmartScreen handout 17 names PTC and
      // NTC as the two thermistor types, but SmartScreen itself is never
      // treated as factual authority; this datasheet is).
      key: SRC_VISHAY_PTC,
      title: "PTCEL Series -- PTC Thermistors, Inrush Current Limiter -- Datasheet",
      publisher: "Vishay Intertechnology (Vishay BCcomponents)",
      sourceFamily: "Manufacturer datasheet",
      sourceType: "DATASHEET",
      jurisdiction: "International",
      canonicalReference: "Vishay PTCEL Series Datasheet, Document Number 29165",
      accessLocation: "https://www.vishay.com/docs/29165/ptcel_series.pdf",
    },
    {
      // Manufacturer (linear-actuator/motion-control) technical blog --
      // independent of SmartScreen -- for the mechanical-engineering
      // principle that meshed gears rotate in opposite directions and that
      // an idler gear reverses output direction without changing the
      // overall gear ratio (CC-09B.6, task section 7; the existing UCSD
      // gear-ratio locator was directly re-checked and confirmed to NOT
      // cover this -- see loc-ucsd-gear-ratio-tooth-count-torque's own
      // scope note).
      key: SRC_FIRGELLI_GEAR_TRAIN,
      title: "Gear Train Mechanism Explained: How It Works, Diagram, Formula and Calculator",
      publisher: "Firgelli Automations",
      sourceFamily: "Manufacturer technical article",
      sourceType: "TECHNICAL_ARTICLE",
      jurisdiction: "International",
      canonicalReference: "Firgelli Automations: Gear Train Mechanism Explained",
      accessLocation: "https://www.firgelliauto.com/blogs/mechanisms/gear-train",
    },
    {
      // CC-09B.6 (task section 15): independent, citation-backed evidence
      // for what a UK BT-style master telephone socket contains (ring
      // capacitor, line-test resistor, surge protector) and each
      // component's function. Not a first-party BT/Openreach technical
      // document (BT does not publicly host the underlying BS 6312/SIN 351
      // specification text); this Wikipedia article's own citations to
      // BS 6312 and BT SIN 351/352 were independently checked, and the
      // same specific values (1.8uF ring capacitor, 470k ohm test
      // resistor) were independently cross-corroborated across multiple
      // unrelated UK electrician/telecoms trade sources during this
      // package's research -- recorded honestly as an encyclopedia-tier
      // source, one tier below this corpus's usual first-party-manufacturer
      // standard, because a better freely-accessible source could not be
      // found.
      key: SRC_WIKIPEDIA_BRITISH_TELEPHONE_SOCKETS,
      title: "British telephone sockets",
      publisher: "Wikipedia",
      sourceFamily: "Encyclopedia article (citation-backed)",
      sourceType: "ENCYCLOPEDIA_ARTICLE",
      jurisdiction: "United Kingdom",
      canonicalReference: "Wikipedia: British telephone sockets",
      accessLocation: "https://en.wikipedia.org/wiki/British_telephone_sockets",
    },
    {
      // CC-09B.6 (task section 14): independent electronics-education
      // source for the specific APPLICATION pattern (a normally-closed
      // sensor loop feeding a transistor which triggers a thyristor gate,
      // latching the output on) used in a simple electronic security-alarm
      // circuit -- the general thyristor-latching PROPERTY itself is
      // already directly sourced via loc-kuphaldt-scr; this source
      // supplements it with the specific alarm-circuit application,
      // PARTIAL support only (see clauseCoverage on the assertion this
      // supports).
      key: SRC_ELPROCUS_THYRISTOR_ALARM,
      title: "Thyristor Based Sensor Alarm System, Working and Applications",
      publisher: "ElProCus (Electronic Projects for Engineering Students)",
      sourceFamily: "Electronics-education technical article",
      sourceType: "TECHNICAL_ARTICLE",
      jurisdiction: "International",
      canonicalReference: "ElProCus: Thyristor Based Sensor Alarm System",
      accessLocation: "https://www.elprocus.com/thyristor-based-sensor-alarm-system/",
    },
    {
      // CC-09B.6 (adversarial gap review, task section 30): citation-backed
      // encyclopedia article for the naming/finger-convention of Fleming's
      // left-hand rule (motors), citing Fleming, John Ambrose (1902),
      // "Magnets and Electric Currents", 2nd ed., pp.173-174, as the
      // original historical source -- the F = B I l magnitude relationship
      // itself is sourced directly from OpenStax UP2 11.4, not from this
      // encyclopedia article.
      key: SRC_WIKIPEDIA_FLEMING_LEFT_HAND,
      title: "Fleming's left-hand rule for motors",
      publisher: "Wikipedia",
      sourceFamily: "Encyclopedia article (citation-backed)",
      sourceType: "ENCYCLOPEDIA_ARTICLE",
      jurisdiction: "International",
      canonicalReference: "Wikipedia: Fleming's left-hand rule for motors",
      accessLocation: "https://en.wikipedia.org/wiki/Fleming%27s_left-hand_rule_for_motors",
    },
    {
      // CC-09B.6: as above, for Fleming's right-hand rule (generators),
      // citing Hughes, Edward (2016), "Electrical and Electronic
      // Technology". The e = B l v magnitude relationship itself is
      // sourced directly from OpenStax UP2 13.3, not from this article.
      key: SRC_WIKIPEDIA_FLEMING_RIGHT_HAND,
      title: "Fleming's right-hand rule",
      publisher: "Wikipedia",
      sourceFamily: "Encyclopedia article (citation-backed)",
      sourceType: "ENCYCLOPEDIA_ARTICLE",
      jurisdiction: "International",
      canonicalReference: "Wikipedia: Fleming's right-hand rule",
      accessLocation: "https://en.wikipedia.org/wiki/Fleming%27s_right-hand_rule",
    },
    {
      // CC-09D (Unit 202 Official Public Assessment Calibration): the
      // official public 2365-602 sample assessment, registered in the
      // Course Evidence Registry as OFFICIAL_ASSESSMENT-role evidence
      // (CC-09C's sourceRole) -- positive evidence of assessability only,
      // never factual authority. Deliberately carries ZERO
      // assertionProvenanceLinks anywhere in this manifest.
      key: SRC_CG_602_SAMPLE_QUESTIONS,
      title: "5357-003 Electrical Scientific Principles and Technologies / 2365-602 Principles of Electrical Science -- Sample e-volve MC Test (question paper)",
      publisher: "City & Guilds",
      sourceFamily: "Official sample assessment",
      sourceType: "SAMPLE_ASSESSMENT",
      jurisdiction: "UK",
      canonicalReference: "City & Guilds \"5357 Level 3 Electrotechnical / 2365 Level 2 and 3 Diploma in Electrical Installations (Buildings and Structures) -- Sample papers\", v1.0, August 2018",
      accessLocation: "https://www.cityandguilds.com/-/media/productdocuments/building_services_engineering/electrical_installation/2365/2365_level_2/assessment_materials/sample_assessment/5357-and-2365-sample-papers-v1-0-pdf.ashx",
      sourceRole: "OFFICIAL_ASSESSMENT",
    },
    {
      // CC-09D: the companion mark scheme / answer key for the same
      // sample e-volve MC test above -- used only to confirm which of the
      // four options is correct for each item during analysis, never
      // itself cited as a fact source.
      key: SRC_CG_602_SAMPLE_MARK_SCHEME,
      title: "5357-003 Electrical Scientific Principles and Technologies / 2365-602 Principles of Electrical Science -- Sample e-volve MC Test (mark scheme / answer keys)",
      publisher: "City & Guilds",
      sourceFamily: "Official sample assessment",
      sourceType: "MARK_SCHEME",
      jurisdiction: "UK",
      canonicalReference: "City & Guilds \"5357 Level 3 Electrotechnical / 2365 Level 2 and 3 Diploma in Electrical Installations (Buildings and Structures) -- Sample papers -- Mark schemes\", v1.0, August 2018",
      accessLocation: "https://www.cityandguilds.com/-/media/productdocuments/building_services_engineering/electrical_installation/2365/2365_level_2/assessment_materials/sample_assessment/5357-and-2365-sample-papers---mark-schemes-v1-0-pdf.pdf",
      sourceRole: "OFFICIAL_ASSESSMENT",
    },
  ],

  sourceVersions: [
    {
      key: SV_CG, sourceKey: SRC_CG,
      edition: "Version 1.12 (April 2026)",
      status: "CURRENT", rightsClassification: "PROPRIETARY_REFERENCE",
      // ADR-0002: this snapshot was fetched directly from cityandguilds.com
      // (not a third-party mirror) on 2026-08-21 -- the fetched PDF's own
      // title page reads "April 2026 Version 1.12", and its "Qualification
      // at a glance" version-history table independently corroborates that
      // edition. contentFingerprintSha256 is the real SHA-256 of that
      // fetched artefact (880.5KB, 2026-08-21), never a placeholder --
      // computed by the CC-09A implementation session, not recomputed
      // since.
      //
      // CC-09A recorded this UNVERIFIED: the model that fetched/
      // transcribed the source was the same model authoring the content
      // citing it, which ADR-0002 holds is never sufficient for VERIFIED
      // on its own. CC-09B: the Project Architect (ChatGPT) has now
      // independently verified this handbook edition's AUTHORITATIVE
      // CONTENT -- source identity (City & Guilds 2365-02, Unit 202
      // R/503/9937), edition (v1.12, April 2026), the complete six-LO/
      // 23-AC/58-Range-item structure, and the Unit 602 assessment
      // specification (90 min, 40 questions, closed book, non-programmable
      // calculator, ~50% pass, LO allocation 2/5/7/15/7/4) -- confirming
      // CC-09A's transcription. Stated accurately, not more than actually
      // happened: the Project Architect verified the document's CONTENT
      // independently, but did NOT independently recompute the raw-byte
      // SHA-256 above -- that fingerprint remains the CC-09A
      // implementation-session value, content-verified but not itself
      // byte-level re-verified. Recorded VERIFIED on that basis.
      retrievedDate: "2026-08-21",
      contentFingerprintSha256: "f6bc7a6c76e37a60a9d9830f873ab1079d230015d1ad95f458d69caa82dc9515",
      verificationStatus: "VERIFIED",
      verifiedBy: "project-architect",
      lastCurrencyCheckDate: "2026-08-21",
    },
    {
      // CC-09D: the official cityandguilds.com URL for this specific file
      // (the question-text companion) currently redirects to
      // "/page-not-found" -- confirmed by direct HTTP inspection, not
      // assumed. Fetched instead via the Internet Archive Wayback
      // Machine's own snapshot of the SAME cityandguilds.com URL, captured
      // 2024-11-25 -- the most recent available capture of the live,
      // official artefact, not a third-party mirror or reproduction.
      // contentFingerprintSha256 is the real SHA-256 of that exact
      // archived artefact (627.6KB), computed directly, never fabricated.
      // Currency: the document's own title page states "August 2018 v1.0"
      // -- unchanged since original publication as far as this session
      // could determine; the companion mark-scheme document below (same
      // v1.0/August 2018) remains live at the same host today, supporting
      // (not proving) that v1.0 is still the current sample-paper edition.
      //
      // CC-09D.1 (Project Architect review): `status: "CURRENT"` here is
      // deliberately kept, not changed to a "stale"/"historical" value.
      // Per ADR-0002's own status/verificationStatus split, `status`
      // (CURRENT/SUPERSEDED/WITHDRAWN) answers "is this the specific
      // edition being cited, or has it been replaced/invalidated by a
      // known later one" -- CURRENT here means the latest-known,
      // not-superseded source-version record (no later edition of this
      // sample paper is known to exist), matching the treatment already
      // given to every pre-ADR-0002 CC-04A/B source. It does NOT assert
      // independently-confirmed live/current applicability -- that
      // separate, honest question is answered by `verificationStatus:
      // "UNVERIFIED"` and `lastCurrencyCheckDate` below, exactly the
      // orthogonal pair ADR-0002 defines for this. The live URL's own
      // 404 (this document's dead-link finding, above) is a currency
      // concern tracked via those fields and this comment, never
      // silently hidden behind an unqualified CURRENT.
      key: SV_CG_602_SAMPLE_QUESTIONS, sourceKey: SRC_CG_602_SAMPLE_QUESTIONS,
      edition: "v1.0 (August 2018)",
      status: "CURRENT", rightsClassification: "PROPRIETARY_REFERENCE",
      retrievedDate: "2026-08-22",
      contentFingerprintSha256: "96afeb0827ec1f39cc19249608bf0fbea9287e554f7b40a94979dcccf8da983c",
      verificationStatus: "UNVERIFIED",
      lastCurrencyCheckDate: "2026-08-22",
    },
    {
      // CC-09D: fetched directly, live, from cityandguilds.com on
      // 2026-08-22 (this exact URL still resolves, unlike its question-
      // text companion above). contentFingerprintSha256 is the real
      // SHA-256 of that fetched artefact (181KB), computed directly.
      key: SV_CG_602_SAMPLE_MARK_SCHEME, sourceKey: SRC_CG_602_SAMPLE_MARK_SCHEME,
      edition: "v1.0 (August 2018)",
      status: "CURRENT", rightsClassification: "PROPRIETARY_REFERENCE",
      retrievedDate: "2026-08-22",
      contentFingerprintSha256: "0fba6fc4d2ad0f7662cc7068b184e815ddca4b17b3fa91f9772c058d62c770d7",
      verificationStatus: "UNVERIFIED",
      lastCurrencyCheckDate: "2026-08-22",
    },
    // ADR-0002: these four pre-dated ADR-0002 (fetched during CC-04A/B) --
    // no raw fetched-artefact bytes are available in this environment to
    // honestly compute a real fingerprint (never fabricated, per ADR-0002),
    // so verificationStatus is UNVERIFIED with retrievedDate/fingerprint
    // left unset rather than invented. A future maintenance pass may
    // populate real snapshot identity for these when the source is
    // next (re-)fetched.
    {
      key: SV_BIPM, sourceKey: SRC_BIPM,
      edition: "9th edition (2019)",
      status: "CURRENT", rightsClassification: "OPEN",
      verificationStatus: "UNVERIFIED",
    },
    {
      key: SV_DFE_MATHS, sourceKey: SRC_DFE_MATHS,
      status: "CURRENT", rightsClassification: "OFFICIAL_OGL",
      verificationStatus: "UNVERIFIED",
    },
    {
      key: SV_OPENSTAX_UP1, sourceKey: SRC_OPENSTAX_UP1,
      edition: "1st edition",
      publicationDate: "2016-09-19",
      status: "CURRENT", rightsClassification: "PUBLIC_RESTRICTED",
      verificationStatus: "UNVERIFIED",
    },
    {
      key: SV_OPENSTAX_UP2, sourceKey: SRC_OPENSTAX_UP2,
      edition: "1st edition",
      publicationDate: "2016-10-06",
      status: "CURRENT", rightsClassification: "PUBLIC_RESTRICTED",
      verificationStatus: "UNVERIFIED",
    },
    // -- CC-09B new source versions. Per ADR-0002 and the task brief's own
    // instruction: this Sonnet session is the authoring/extraction model,
    // so none of these are self-marked VERIFIED regardless of how directly
    // their content was inspected -- independent verification by the
    // Project Architect remains outstanding for all four.
    {
      key: SV_OPENSTAX_UP3, sourceKey: SRC_OPENSTAX_UP3,
      edition: "1st edition",
      publicationDate: "2016-09-29",
      status: "CURRENT", rightsClassification: "PUBLIC_RESTRICTED",
      // Same OpenStax CC BY-NC-SA 4.0 licence family already verified for
      // UP1/UP2 (CC-04B); confirmed independently on this volume's own
      // page during CC-09B research, not merely assumed from the sibling
      // volumes.
      retrievedDate: "2026-08-21",
      verificationStatus: "UNVERIFIED",
      lastCurrencyCheckDate: "2026-08-21",
    },
    {
      key: SV_KUPHALDT_SEMICONDUCTORS, sourceKey: SRC_KUPHALDT_SEMICONDUCTORS,
      // Displayed on this LibreTexts mirror as GFDL 1.3 (the original
      // Kuphaldt/All About Circuits publication uses the Design Science
      // License; LibreTexts' own hosting states GFDL 1.3) -- both are
      // genuine open-content copyleft licences permitting free copying,
      // distribution and modification with attribution, so OPEN here
      // matches the treatment already given to BIPM's CC BY licence.
      status: "CURRENT", rightsClassification: "OPEN",
      // Fetched via LibreTexts' rendered HTML pages, not a single
      // downloadable artefact -- no stable single-file byte fingerprint is
      // practical for a multi-page HTML book (ADR-0002 explicitly allows
      // omitting one here rather than inventing one); source
      // identity/edition/locators are recorded instead.
      retrievedDate: "2026-08-21",
      verificationStatus: "UNVERIFIED",
      lastCurrencyCheckDate: "2026-08-21",
    },
    {
      // CC-09B.4 correction (task section 3.A): the fetched artefact's own
      // footer reads "Revision: 27-Jan-2021, Document Number: 29053" on
      // every page -- the previously recorded revision label ("20-Jan-06")
      // did not match the actual bytes the fingerprint below was computed
      // from. Corrected to the true revision/publication date of the same
      // artefact (document number unchanged) rather than silently keeping
      // stale metadata attached to the real 2021 bytes.
      key: SV_VISHAY_NTC, sourceKey: SRC_VISHAY_NTC,
      revision: "Document Number 29053, Rev. 27-Jan-2021",
      publicationDate: "2021-01-27",
      status: "CURRENT", rightsClassification: "PROPRIETARY_REFERENCE",
      retrievedDate: "2026-08-21",
      contentFingerprintSha256: "45a0acecc6cb70766784bd8a3a762853564e957c5c0b44e5c238ef67f94f366a",
      verificationStatus: "UNVERIFIED",
      lastCurrencyCheckDate: "2026-08-21",
    },
    {
      key: SV_UOTTAWA_INVERTERS, sourceKey: SRC_UOTTAWA_INVERTERS,
      // CC-09B.1: retained unchanged (never deleted -- audit history is
      // not erased). No longer the sole/primary inverter provenance; see
      // SV_TI_INVERTERS below, now cited DEFINES with this source
      // demoted to SUPPORTS on EL-COMPONENT-INVERTER-001.
      status: "CURRENT", rightsClassification: "PROPRIETARY_REFERENCE",
      retrievedDate: "2026-08-21",
      contentFingerprintSha256: "29758def630c61322d6e89a7e4dfa29ddd7e5f669b6ad0284e44626830a5e020",
      verificationStatus: "UNVERIFIED",
      lastCurrencyCheckDate: "2026-08-21",
    },
    // -- CC-09B.1 audit-correction source versions (all UNVERIFIED -- this
    // Sonnet session is the authoring/extraction model, never its own
    // verifier, per ADR-0002) --
    {
      key: SV_TI_INVERTERS, sourceKey: SRC_TI_INVERTERS,
      revision: "SLAA602A",
      status: "CURRENT", rightsClassification: "PROPRIETARY_REFERENCE",
      retrievedDate: "2026-08-21",
      contentFingerprintSha256: "39ad916bf586311364470325576e20d60ee039bc1c543f4aea3bc75574faf044",
      verificationStatus: "UNVERIFIED",
      lastCurrencyCheckDate: "2026-08-21",
    },
    {
      key: SV_OPENSTAX_COLLEGE_PHYSICS, sourceKey: SRC_OPENSTAX_COLLEGE_PHYSICS,
      edition: "2nd edition",
      status: "CURRENT", rightsClassification: "PUBLIC_RESTRICTED",
      retrievedDate: "2026-08-21",
      verificationStatus: "UNVERIFIED",
      lastCurrencyCheckDate: "2026-08-21",
    },
    {
      key: SV_KUPHALDT_DC_CIRCUITS, sourceKey: SRC_KUPHALDT_DC_CIRCUITS,
      status: "CURRENT", rightsClassification: "OPEN",
      retrievedDate: "2026-08-21",
      verificationStatus: "UNVERIFIED",
      lastCurrencyCheckDate: "2026-08-21",
    },
    // -- CC-09B.2 (source-first evidence hardening) source versions -- all
    // UNVERIFIED (this Sonnet session is the authoring/extraction model,
    // never its own verifier, per ADR-0002). Fingerprints are the real
    // SHA-256 of the actual fetched PDF bytes, never fabricated; the UCSD
    // page has none for the same reason the other HTML-only sources above
    // do not (no single downloadable artefact to fingerprint).
    {
      key: SV_NIST_HB44, sourceKey: SRC_NIST_HB44,
      edition: "Handbook 44 - 2026",
      revision: "Section 3.41 (Tentative Code, added 2024)",
      status: "CURRENT", rightsClassification: "OPEN",
      retrievedDate: "2026-08-21",
      contentFingerprintSha256: "3a8654c4a3cda1e3cf24774050af713b24fc37d75a929987276e0d538a48d557",
      verificationStatus: "UNVERIFIED",
      lastCurrencyCheckDate: "2026-08-21",
    },
    {
      key: SV_INDUS_UNI_WATTMETER, sourceKey: SRC_INDUS_UNI_WATTMETER,
      status: "CURRENT", rightsClassification: "PROPRIETARY_REFERENCE",
      retrievedDate: "2026-08-21",
      contentFingerprintSha256: "f3ef29975ead33618ce12ada09acc2329c98111e03f787fe33d5036ee3251059",
      verificationStatus: "UNVERIFIED",
      lastCurrencyCheckDate: "2026-08-21",
    },
    {
      key: SV_UCSD_GEAR_RATIOS, sourceKey: SRC_UCSD_GEAR_RATIOS,
      status: "CURRENT", rightsClassification: "PROPRIETARY_REFERENCE",
      retrievedDate: "2026-08-21",
      verificationStatus: "UNVERIFIED",
      lastCurrencyCheckDate: "2026-08-21",
    },
    {
      key: SV_SECO_LARM_BEAM_SENSOR, sourceKey: SRC_SECO_LARM_BEAM_SENSOR,
      revision: "E-931-S33PRGQ installation manual",
      status: "CURRENT", rightsClassification: "PROPRIETARY_REFERENCE",
      retrievedDate: "2026-08-21",
      contentFingerprintSha256: "242e887377533f4e89ac4241ebe5e262124438cd2c3e16f823cea3e1b8ba57f6",
      verificationStatus: "UNVERIFIED",
      lastCurrencyCheckDate: "2026-08-21",
    },
    // -- CC-09B.3 source versions -- UNVERIFIED (this Sonnet session is
    // the authoring/extraction model, never its own verifier, ADR-0002).
    {
      key: SV_SKYWORKS_DAA_DESIGN_GUIDE, sourceKey: SRC_SKYWORKS_DAA_DESIGN_GUIDE,
      revision: "AN347 Rev. 0.3",
      status: "CURRENT", rightsClassification: "PROPRIETARY_REFERENCE",
      retrievedDate: "2026-08-21",
      contentFingerprintSha256: "232e6643ad677923d221d69110fc34dad7b80378f5d64919f0b9527d979f78ad",
      verificationStatus: "UNVERIFIED",
      lastCurrencyCheckDate: "2026-08-21",
    },
    {
      // CC-09B.4 correction (task section 3.B): this Farnell-mirrored
      // Rev. 1.10 (2002) snapshot is no longer the obsolete/current
      // artefact -- superseded by SV_HOLTEK_HT12D_2022 below (the current
      // official holtek.com Rev. 1.40). Preserved as historical
      // provenance, never deleted or silently relabelled CURRENT.
      key: SV_HOLTEK_HT12D, sourceKey: SRC_HOLTEK_HT12D,
      revision: "Rev. 1.10, November 18, 2002",
      status: "SUPERSEDED", rightsClassification: "PROPRIETARY_REFERENCE",
      retrievedDate: "2026-08-21",
      contentFingerprintSha256: "bd588dca8331aa129892e4981f86c49aedc8834fd876d92a7652326e0e6148d7",
      verificationStatus: "UNVERIFIED",
      lastCurrencyCheckDate: "2026-08-21",
    },
    {
      // The current official Holtek revision, fetched directly from
      // holtek.com (task section 17, first-party over mirror). Re-verified
      // the same Applications list ("garage door controllers", "car door
      // controllers", "car alarm system", "security system", "other
      // remote control systems") and General Description content this
      // corpus cites are still present in this revision.
      key: SV_HOLTEK_HT12D_2022, sourceKey: SRC_HOLTEK_HT12D,
      revision: "Rev. 1.40, August 30, 2022",
      publicationDate: "2022-08-30",
      status: "CURRENT", rightsClassification: "PROPRIETARY_REFERENCE",
      retrievedDate: "2026-08-21",
      contentFingerprintSha256: "d892a7fef6a9cd2a381dab5aadc4f0173d90a9e9ffec8a08d9ce392bc6f87c96",
      verificationStatus: "UNVERIFIED",
      lastCurrencyCheckDate: "2026-08-21",
    },
    // -- CC-09B.4 (retroactive source-first provenance migration) source
    // versions -- all UNVERIFIED (this Sonnet session is the authoring/
    // extraction model, never its own verifier, per ADR-0002).
    {
      key: SV_OPENSTAX_CHEMISTRY, sourceKey: SRC_OPENSTAX_CHEMISTRY,
      edition: "2nd edition",
      status: "CURRENT", rightsClassification: "PUBLIC_RESTRICTED",
      retrievedDate: "2026-08-21",
      verificationStatus: "UNVERIFIED",
      lastCurrencyCheckDate: "2026-08-21",
    },
    {
      key: SV_FLUKE_CLAMP_METERS, sourceKey: SRC_FLUKE_CLAMP_METERS,
      status: "CURRENT", rightsClassification: "PROPRIETARY_REFERENCE",
      retrievedDate: "2026-08-21",
      verificationStatus: "UNVERIFIED",
      lastCurrencyCheckDate: "2026-08-21",
    },
    {
      key: SV_PRYSMIAN_6242Y, sourceKey: SRC_PRYSMIAN_6242Y,
      revision: "GB00_6242Y_20260821",
      status: "CURRENT", rightsClassification: "PROPRIETARY_REFERENCE",
      retrievedDate: "2026-08-21",
      contentFingerprintSha256: "d1c64322fbb31d926a4533b604642cd314674959affb55675c738a7eefea793b",
      verificationStatus: "UNVERIFIED",
      lastCurrencyCheckDate: "2026-08-21",
    },
    {
      key: SV_VISHAY_PTC, sourceKey: SRC_VISHAY_PTC,
      revision: "Revision: 12-Sep-2024, Document Number: 29165",
      status: "CURRENT", rightsClassification: "PROPRIETARY_REFERENCE",
      retrievedDate: "2026-08-21",
      verificationStatus: "UNVERIFIED",
      lastCurrencyCheckDate: "2026-08-21",
    },
    {
      key: SV_FIRGELLI_GEAR_TRAIN, sourceKey: SRC_FIRGELLI_GEAR_TRAIN,
      status: "CURRENT", rightsClassification: "PROPRIETARY_REFERENCE",
      retrievedDate: "2026-08-21",
      verificationStatus: "UNVERIFIED",
      lastCurrencyCheckDate: "2026-08-21",
    },
    {
      key: SV_WIKIPEDIA_BRITISH_TELEPHONE_SOCKETS, sourceKey: SRC_WIKIPEDIA_BRITISH_TELEPHONE_SOCKETS,
      status: "CURRENT", rightsClassification: "OPEN",
      retrievedDate: "2026-08-21",
      verificationStatus: "UNVERIFIED",
      lastCurrencyCheckDate: "2026-08-21",
    },
    {
      key: SV_ELPROCUS_THYRISTOR_ALARM, sourceKey: SRC_ELPROCUS_THYRISTOR_ALARM,
      status: "CURRENT", rightsClassification: "PROPRIETARY_REFERENCE",
      retrievedDate: "2026-08-21",
      verificationStatus: "UNVERIFIED",
      lastCurrencyCheckDate: "2026-08-21",
    },
    {
      key: SV_WIKIPEDIA_FLEMING_LEFT_HAND, sourceKey: SRC_WIKIPEDIA_FLEMING_LEFT_HAND,
      status: "CURRENT", rightsClassification: "OPEN",
      retrievedDate: "2026-08-21",
      verificationStatus: "UNVERIFIED",
      lastCurrencyCheckDate: "2026-08-21",
    },
    {
      key: SV_WIKIPEDIA_FLEMING_RIGHT_HAND, sourceKey: SRC_WIKIPEDIA_FLEMING_RIGHT_HAND,
      status: "CURRENT", rightsClassification: "OPEN",
      retrievedDate: "2026-08-21",
      verificationStatus: "UNVERIFIED",
      lastCurrencyCheckDate: "2026-08-21",
    },
  ],

  sourceLocators: locators.map((l) => ({
    key: l.key,
    sourceVersionKey: l.sourceVersionKey,
    section: l.section,
    subsection: l.subsection,
    page: l.page,
    locatorSummary: l.locatorSummary,
  })),

  curricula: [
    {
      code: CURRICULUM_CODE,
      name: "City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02)",
      awardingBody: "City & Guilds",
    },
  ],

  curriculumVersions: [
    {
      key: CV_KEY,
      curriculumCode: CURRICULUM_CODE,
      versionLabel: "Version 1.12 (April 2026)",
      // CC-09A: superseded by CV_KEY_R2, the complete LO1-LO6 extraction
      // of the same handbook edition -- see the CC-09A header comment
      // above. Its nodes/mappings are untouched; this is a lifecycle
      // status change, never a content mutation.
      status: "SUPERSEDED",
    },
    {
      key: CV_KEY_R2,
      curriculumCode: CURRICULUM_CODE,
      versionLabel: "Version 1.12 (April 2026) -- complete LO1-LO6 extraction (CC-09A)",
      status: "CURRENT",
    },
  ],

  curriculumNodes: [
    { key: NODE_QUAL, curriculumVersionKey: CV_KEY, nodeType: "QUALIFICATION", code: "2365-02", title: "City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02)", sequenceOrder: 1 },
    { key: NODE_UNIT, curriculumVersionKey: CV_KEY, parentKey: NODE_QUAL, nodeType: "UNIT", code: "202", title: "Principles of Electrical Science", sequenceOrder: 2 },
    { key: NODE_LO1, curriculumVersionKey: CV_KEY, parentKey: NODE_UNIT, nodeType: "LEARNING_OUTCOME", code: "202-LO1", title: "Understand mathematical principles which are appropriate to electrical installation, maintenance and design work", sequenceOrder: 1 },
    { key: NODE_AC1_1, curriculumVersionKey: CV_KEY, parentKey: NODE_LO1, nodeType: "ASSESSMENT_CRITERION", code: "202-LO1-AC1.1", title: "Identify and apply appropriate mathematical principles which are relevant to electrical work tasks", sequenceOrder: 1 },
    { key: NODE_LO2, curriculumVersionKey: CV_KEY, parentKey: NODE_UNIT, nodeType: "LEARNING_OUTCOME", code: "202-LO2", title: "Understand standard units of measurement used in electrical installation, maintenance and design work", sequenceOrder: 2 },
    { key: NODE_AC2_1, curriculumVersionKey: CV_KEY, parentKey: NODE_LO2, nodeType: "ASSESSMENT_CRITERION", code: "202-LO2-AC2.1", title: "Identify and use internationally recognised base and derived (SI) units of measurement", sequenceOrder: 1 },
    { key: NODE_AC2_2, curriculumVersionKey: CV_KEY, parentKey: NODE_LO2, nodeType: "ASSESSMENT_CRITERION", code: "202-LO2-AC2.2", title: "Identify and determine values of base and derived SI units which apply specifically to electrical quantities", sequenceOrder: 2 },
    { key: NODE_AC2_3, curriculumVersionKey: CV_KEY, parentKey: NODE_LO2, nodeType: "ASSESSMENT_CRITERION", code: "202-LO2-AC2.3", title: "Identify appropriate electrical instruments for the measurement of different electrical quantities", sequenceOrder: 3 },
    { key: NODE_LO3, curriculumVersionKey: CV_KEY, parentKey: NODE_UNIT, nodeType: "LEARNING_OUTCOME", code: "202-LO3", title: "Understand basic mechanics and the relationship between force, work, energy and power", sequenceOrder: 3 },
    { key: NODE_AC3_3, curriculumVersionKey: CV_KEY, parentKey: NODE_LO3, nodeType: "ASSESSMENT_CRITERION", code: "202-LO3-AC3.3", title: "Describe the main principles of force, work, energy, power and efficiency and their inter-relationships", sequenceOrder: 1 },
    { key: NODE_AC3_4, curriculumVersionKey: CV_KEY, parentKey: NODE_LO3, nodeType: "ASSESSMENT_CRITERION", code: "202-LO3-AC3.4", title: "Calculate values of mechanical energy, power and efficiency", sequenceOrder: 2 },
    { key: NODE_LO4, curriculumVersionKey: CV_KEY, parentKey: NODE_UNIT, nodeType: "LEARNING_OUTCOME", code: "202-LO4", title: "Understand the relationship between resistance, resistivity, voltage, current and power", sequenceOrder: 4 },
    { key: NODE_AC4_1, curriculumVersionKey: CV_KEY, parentKey: NODE_LO4, nodeType: "ASSESSMENT_CRITERION", code: "202-LO4-AC4.1", title: "Describe the basic principles of electron theory", sequenceOrder: 1 },
    { key: NODE_AC4_2, curriculumVersionKey: CV_KEY, parentKey: NODE_LO4, nodeType: "ASSESSMENT_CRITERION", code: "202-LO4-AC4.2", title: "Identify and distinguish between materials which are good conductors and insulators", sequenceOrder: 2 },
    { key: NODE_AC4_3, curriculumVersionKey: CV_KEY, parentKey: NODE_LO4, nodeType: "ASSESSMENT_CRITERION", code: "202-LO4-AC4.3", title: "Describe what is meant by resistance and resistivity in relation to electrical circuits", sequenceOrder: 3 },
    { key: NODE_AC4_4, curriculumVersionKey: CV_KEY, parentKey: NODE_LO4, nodeType: "ASSESSMENT_CRITERION", code: "202-LO4-AC4.4", title: "Explain the relationship between current, voltage and resistance in parallel and series D.C. circuits", sequenceOrder: 4 },
    { key: NODE_AC4_5, curriculumVersionKey: CV_KEY, parentKey: NODE_LO4, nodeType: "ASSESSMENT_CRITERION", code: "202-LO4-AC4.5", title: "Calculate the values of current, voltage and resistance in parallel and series D.C. circuits", sequenceOrder: 5 },
    { key: NODE_AC4_6, curriculumVersionKey: CV_KEY, parentKey: NODE_LO4, nodeType: "ASSESSMENT_CRITERION", code: "202-LO4-AC4.6", title: "Calculate values of power in parallel and series D.C. circuits", sequenceOrder: 6 },
    { key: NODE_AC4_7, curriculumVersionKey: CV_KEY, parentKey: NODE_LO4, nodeType: "ASSESSMENT_CRITERION", code: "202-LO4-AC4.7", title: "State what is meant by the term voltage drop in relation to electrical circuits", sequenceOrder: 7 },
    { key: NODE_AC4_8, curriculumVersionKey: CV_KEY, parentKey: NODE_LO4, nodeType: "ASSESSMENT_CRITERION", code: "202-LO4-AC4.8", title: "Describe the chemical and thermal effects of electric currents", sequenceOrder: 8 },
    { key: NODE_LO5, curriculumVersionKey: CV_KEY, parentKey: NODE_UNIT, nodeType: "LEARNING_OUTCOME", code: "202-LO5", title: "Understand the fundamental principles which underpin the relationship between magnetism and electricity", sequenceOrder: 5 },
    { key: NODE_AC5_1, curriculumVersionKey: CV_KEY, parentKey: NODE_LO5, nodeType: "ASSESSMENT_CRITERION", code: "202-LO5-AC5.1", title: "Describe the effects of magnetism in terms of attraction and repulsion", sequenceOrder: 1 },
    { key: NODE_AC5_2, curriculumVersionKey: CV_KEY, parentKey: NODE_LO5, nodeType: "ASSESSMENT_CRITERION", code: "202-LO5-AC5.2", title: "State the difference between magnetic flux and flux density", sequenceOrder: 2 },
    { key: NODE_AC5_3, curriculumVersionKey: CV_KEY, parentKey: NODE_LO5, nodeType: "ASSESSMENT_CRITERION", code: "202-LO5-AC5.3", title: "Describe the magnetic effects of electrical currents", sequenceOrder: 3 },
    { key: NODE_AC5_4, curriculumVersionKey: CV_KEY, parentKey: NODE_LO5, nodeType: "ASSESSMENT_CRITERION", code: "202-LO5-AC5.4", title: "Describe the basic principles of generating an A.C. supply", sequenceOrder: 4 },
    { key: NODE_AC5_5, curriculumVersionKey: CV_KEY, parentKey: NODE_LO5, nodeType: "ASSESSMENT_CRITERION", code: "202-LO5-AC5.5", title: "Identify the characteristics of sine-waves", sequenceOrder: 5 },

    // -- CV_KEY_R2: complete official LO1-LO6/AC/Range structure --
    { key: NODE_QUAL_R2, curriculumVersionKey: CV_KEY_R2, nodeType: "QUALIFICATION", code: "2365-02", title: "City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02)", sequenceOrder: 1 },
    { key: NODE_UNIT_R2, curriculumVersionKey: CV_KEY_R2, parentKey: NODE_QUAL_R2, nodeType: "UNIT", code: "202", title: "Principles of Electrical Science", sequenceOrder: 2 },
    ...unit202R2.nodes,
  ],

  assertions: A.map((a) => ({ identifier: a.id, domainCode: a.domain })),

  assertionVersions: A.map((a) => ({
    assertionIdentifier: a.id,
    version: 1,
    statement: a.statement,
    status: "APPROVED" as const,
    multiSourceFullyCovered: a.multiSourceFullyCovered,
    clauseCoverage: a.clauseCoverage?.map((c) => ({ clause: c.clause, sourceLocatorKey: c.locator })),
  })),

  // CC-09B.4 (retroactive source-first provenance migration, task section
  // 5): "0 legacy factual provenance links may remain unclassified" -- a
  // factual link (one whose locator is NOT the City & Guilds handbook,
  // i.e. not CURRICULUM_REQUIRES/AUTHORITATIVE_REQUIREMENT/LEGAL_BASIS
  // provenance) that does not carry an explicit ProvenanceSpec.supportType
  // defaults to DIRECT here, on the basis of the SAME evidence record
  // already carried by that locator's own `locatorSummary` (itself
  // written from direct source inspection at authoring time across
  // CC-04A/B and CC-09A/B/B.1/B.2/B.3) -- never a fabricated or "blind"
  // classification. Every genuinely doubtful case this migration found
  // (the five named legacy defects, plus every assertion whose statement
  // used application/device/installation-practice language) was instead
  // individually re-sourced above with an explicit supportType. See
  // PROJECT-STATUS.md CC-09B.4 for the full audit methodology and scope.
  assertionProvenanceLinks: A.flatMap((a) =>
    a.provenance.map((p) => {
      const svKey = locators.find((l) => l.key === p.locator)?.sourceVersionKey;
      const isFactualLink = svKey !== SV_CG;
      return {
        assertionIdentifier: a.id,
        assertionVersion: 1,
        sourceLocatorKey: p.locator,
        provenanceRole: p.role,
        supportType: p.supportType ?? (isFactualLink ? ("DIRECT" as const) : undefined),
      };
    }),
  ),

  assertionRelationships: relationships,

  assertionCurriculumMappings: [
    ...A.flatMap((a) =>
      (a.curriculum ?? []).map((c) => ({
        assertionIdentifier: a.id,
        curriculumNodeKey: c.node,
        mappingType: c.type,
      })),
    ),
    // CC-09A: mechanical remap of the 19 CC-04B mappings above onto their
    // CV_KEY_R2 equivalents -- the same assertions, an additional mapping
    // to the corrected curriculum version's node, never re-authored
    // knowledge. See OLD_TO_R2_AC_NODE's own header comment.
    ...A.flatMap((a) =>
      (a.curriculum ?? [])
        .filter((c) => OLD_TO_R2_AC_NODE.has(c.node))
        .map((c) => ({
          assertionIdentifier: a.id,
          curriculumNodeKey: OLD_TO_R2_AC_NODE.get(c.node)!,
          mappingType: c.type,
        })),
    ),
  ],

  misconceptions: M.map((m) => ({ identifier: m.id, description: m.description })),

  misconceptionConflicts: M.flatMap((m) =>
    m.conflicts.map((assertionIdentifier) => ({
      misconceptionIdentifier: m.id,
      assertionIdentifier,
    })),
  ),
};
