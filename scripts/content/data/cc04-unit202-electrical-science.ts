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
 * Foundational Maths (FM) and Foundational Physics (FP) assertions are
 * NEVER curriculum-mapped directly (WP1.2's domain-ownership rule: they
 * are reusable horizontal knowledge, not qualification syllabus
 * statements). Their curriculum relevance is demonstrated only through
 * PREREQUISITE_OF edges into curriculum-mapped Electrical assertions. Per
 * explicit Product Owner direction (CC-04B), a Foundational assertion
 * that does not currently reach an Electrical assertion in this slice is
 * not treated as a defect -- it remains retained, reusable horizontal
 * knowledge for future Unit 202 expansion, other electrical
 * qualifications, or other vocational verticals.
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
const SRC_BIPM = "src-bipm-si-brochure";
const SRC_DFE_MATHS = "src-dfe-gcse-maths";
const SRC_OPENSTAX_UP1 = "src-openstax-university-physics-v1";
const SRC_OPENSTAX_UP2 = "src-openstax-university-physics-v2";

const SV_CG = "sv-cg-2365-02-v1-12";
const SV_BIPM = "sv-bipm-si-9th-edition";
const SV_DFE_MATHS = "sv-dfe-gcse-maths";
const SV_OPENSTAX_UP1 = "sv-openstax-up1";
const SV_OPENSTAX_UP2 = "sv-openstax-up2";

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
    key: "loc-openstax-up2-ac-circuits",
    sourceVersionKey: SV_OPENSTAX_UP2,
    section: "Chapter 15", subsection: "Alternating-Current Circuits",
    locatorSummary: "University Physics Volume 2, Ch.15: impedance, reactance, inductance, capacitance and power factor in AC circuits",
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
];

// ---------------------------------------------------------------------
// Assertions
// ---------------------------------------------------------------------

interface ProvenanceSpec {
  locator: string;
  role: ProvenanceRole;
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
  curriculum?: CurriculumSpec[];
}

const A: AssertionDef[] = [
  // ===================================================================
  // Foundational Maths (17) -- horizontal, never curriculum-mapped.
  // ===================================================================
  {
    id: "FM-ALG-INVERSE-OPS-MULT-001", domain: "FM",
    statement: "Multiplication and division are inverse operations: dividing by a non-zero number undoes multiplying by that number, and vice versa.",
    provenance: [{ locator: "loc-dfe-number-inverse-reciprocal", role: "DEFINES" }],
  },
  {
    id: "FM-ALG-INVERSE-OPS-ADD-001", domain: "FM",
    statement: "Addition and subtraction are inverse operations: subtracting a number undoes adding that number, and vice versa.",
    provenance: [{ locator: "loc-dfe-number-inverse-reciprocal", role: "DEFINES" }],
  },
  {
    id: "FM-ALG-EQUALITY-MULT-001", domain: "FM",
    statement: "In an equation, multiplying or dividing both sides by the same non-zero value preserves the equality between the two sides.",
    provenance: [{ locator: "loc-dfe-algebra-equations", role: "DEFINES" }],
  },
  {
    id: "FM-ALG-EQUALITY-ADD-001", domain: "FM",
    statement: "In an equation, adding or subtracting the same value from both sides preserves the equality between the two sides.",
    provenance: [{ locator: "loc-dfe-algebra-equations", role: "DEFINES" }],
  },
  {
    id: "FM-ALG-TRANSPOSE-MULT-001", domain: "FM",
    statement: "Given a relationship of the form a = b times c, rearrange it algebraically to make b or c the subject.",
    provenance: [{ locator: "loc-dfe-algebra-rearrange", role: "SUPPORTS" }],
    prereqs: [
      { id: "FM-ALG-INVERSE-OPS-MULT-001", strength: "REQUIRED" },
      { id: "FM-ALG-EQUALITY-MULT-001", strength: "REQUIRED" },
    ],
  },
  {
    id: "FM-ALG-TRANSPOSE-ADD-001", domain: "FM",
    statement: "Given a relationship of the form a = b + c, rearrange it algebraically to make b or c the subject.",
    provenance: [{ locator: "loc-dfe-algebra-rearrange", role: "SUPPORTS" }],
    prereqs: [
      { id: "FM-ALG-INVERSE-OPS-ADD-001", strength: "REQUIRED" },
      { id: "FM-ALG-EQUALITY-ADD-001", strength: "REQUIRED" },
    ],
  },
  {
    id: "FM-ALG-SUBSTITUTION-001", domain: "FM",
    statement: "Substitute known numerical values into a formula to calculate the value of the remaining unknown quantity.",
    provenance: [{ locator: "loc-dfe-algebra-substitution", role: "SUPPORTS" }],
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

  // ===================================================================
  // Foundational Physics (13) -- horizontal, never curriculum-mapped.
  // ===================================================================
  {
    id: "FP-CONCEPT-FORCE-001", domain: "FP",
    statement: "A force is a push or a pull that can change the motion, shape or state of rest of an object.",
    provenance: [{ locator: "loc-openstax-up1-work", role: "DEFINES" }],
  },
  {
    id: "FP-CONCEPT-WORK-001", domain: "FP",
    statement: "Work is done when a force causes its point of application to move through a distance in the direction of the force.",
    provenance: [{ locator: "loc-openstax-up1-work", role: "DEFINES" }],
    prereqs: [{ id: "FP-CONCEPT-FORCE-001", strength: "STRONG" }],
  },
  {
    id: "FP-CONCEPT-ENERGY-001", domain: "FP",
    statement: "Energy is the capacity to do work, and exists in different forms including kinetic energy (due to motion) and potential energy (due to position or state).",
    provenance: [{ locator: "loc-openstax-up1-kinetic-energy", role: "DEFINES" }],
    prereqs: [{ id: "FP-CONCEPT-WORK-001", strength: "STRONG" }],
  },
  {
    id: "FP-CONCEPT-ENERGY-CONSERVATION-001", domain: "FP",
    statement: "Energy cannot be created or destroyed, only transferred or converted from one form to another.",
    provenance: [{ locator: "loc-openstax-up1-kinetic-energy", role: "SUPPORTS" }],
    prereqs: [{ id: "FP-CONCEPT-ENERGY-001", strength: "REQUIRED" }],
  },
  {
    id: "FP-CONCEPT-POWER-001", domain: "FP",
    statement: "Power is the rate at which work is done or energy is transferred.",
    provenance: [{ locator: "loc-openstax-up1-power", role: "DEFINES" }],
    prereqs: [
      { id: "FP-CONCEPT-WORK-001", strength: "REQUIRED" },
      { id: "FP-CONCEPT-ENERGY-001", strength: "REQUIRED" },
    ],
  },
  {
    id: "FP-REL-POWER-WORK-TIME-001", domain: "FP",
    statement: "Power is calculated by dividing the work done (or energy transferred) by the time taken: P = W / t.",
    provenance: [{ locator: "loc-openstax-up1-power", role: "SUPPORTS" }],
    prereqs: [{ id: "FP-CONCEPT-POWER-001", strength: "REQUIRED" }],
  },
  {
    id: "FP-CALC-POWER-001", domain: "FP",
    statement: "Calculate power from known work done (or energy transferred) and time taken, using P = W / t.",
    provenance: [{ locator: "loc-openstax-up1-power", role: "SUPPORTS" }],
    prereqs: [
      { id: "FP-REL-POWER-WORK-TIME-001", strength: "REQUIRED" },
      { id: "FM-ALG-SUBSTITUTION-001", strength: "REQUIRED" },
    ],
  },
  {
    id: "FP-CONCEPT-EFFICIENCY-001", domain: "FP",
    statement: "Efficiency is the ratio of useful energy or power output to total energy or power input, usually expressed as a percentage.",
    provenance: [{ locator: "loc-openstax-up1-power", role: "SUPPORTS" }],
    prereqs: [
      { id: "FP-CONCEPT-ENERGY-CONSERVATION-001", strength: "REQUIRED" },
      { id: "FM-ARITH-PERCENTAGE-001", strength: "REQUIRED" },
    ],
  },
  {
    id: "FP-CALC-EFFICIENCY-001", domain: "FP",
    statement: "Calculate the efficiency of a process as a percentage from its useful output and total input.",
    provenance: [{ locator: "loc-openstax-up1-power", role: "SUPPORTS" }],
    prereqs: [
      { id: "FP-CONCEPT-EFFICIENCY-001", strength: "REQUIRED" },
      { id: "FM-ARITH-PERCENTAGE-001", strength: "REQUIRED" },
    ],
  },
  {
    id: "FP-CONCEPT-MASS-001", domain: "FP",
    statement: "Mass is the amount of matter in an object, measured in kilograms.",
    provenance: [{ locator: "loc-openstax-up1-work", role: "DEFINES" }],
  },
  {
    id: "FP-CONCEPT-WEIGHT-001", domain: "FP",
    statement: "Weight is the force of gravity acting on an object's mass, measured in newtons.",
    provenance: [{ locator: "loc-openstax-up1-work", role: "DEFINES" }],
    prereqs: [
      { id: "FP-CONCEPT-FORCE-001", strength: "STRONG" },
      { id: "FP-CONCEPT-MASS-001", strength: "STRONG" },
    ],
  },
  {
    id: "FP-REL-WEIGHT-MASS-001", domain: "FP",
    statement: "Weight is calculated from mass and gravitational field strength using W = m times g.",
    provenance: [{ locator: "loc-openstax-up1-work", role: "SUPPORTS" }],
    prereqs: [
      { id: "FP-CONCEPT-MASS-001", strength: "REQUIRED" },
      { id: "FP-CONCEPT-WEIGHT-001", strength: "REQUIRED" },
    ],
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
    ],
  },
  {
    id: "EL-UNIT-OHM-001", domain: "EL",
    statement: "The ohm is the SI derived unit of electrical resistance.",
    provenance: [
      { locator: "loc-bipm-derived-units", role: "DEFINES" },
      { locator: "loc-cg-ac2.2", role: "CURRICULUM_REQUIRES" },
    ],
    curriculum: [{ node: NODE_AC2_2, type: "REQUIRED_FOR" }],
  },
  {
    id: "EL-UNIT-WATT-001", domain: "EL",
    statement: "The watt (W) is the SI derived unit of power.",
    provenance: [
      { locator: "loc-bipm-derived-units", role: "DEFINES" },
      { locator: "loc-cg-ac2.2", role: "CURRICULUM_REQUIRES" },
    ],
    curriculum: [{ node: NODE_AC2_2, type: "REQUIRED_FOR" }],
  },
  {
    id: "EL-UNIT-JOULE-001", domain: "EL",
    statement: "The joule (J) is the SI derived unit of energy.",
    provenance: [
      { locator: "loc-bipm-derived-units", role: "DEFINES" },
      { locator: "loc-cg-ac2.2", role: "CURRICULUM_REQUIRES" },
    ],
    curriculum: [{ node: NODE_AC2_2, type: "REQUIRED_FOR" }],
  },
  {
    id: "EL-UNIT-OHM-METRE-001", domain: "EL",
    statement: "The ohm-metre is the SI derived unit of resistivity.",
    provenance: [
      { locator: "loc-bipm-derived-units", role: "DEFINES" },
      { locator: "loc-cg-ac2.2", role: "CURRICULUM_REQUIRES" },
    ],
    curriculum: [{ node: NODE_AC2_2, type: "REQUIRED_FOR" }],
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
    provenance: [{ locator: "loc-cg-ac2.3", role: "CURRICULUM_REQUIRES" }],
    prereqs: [{ id: "EL-CONCEPT-VOLTAGE-001", strength: "STRONG" }],
    curriculum: [{ node: NODE_AC2_3, type: "REQUIRED_FOR" }],
  },
  {
    id: "EL-INSTRUMENT-AMMETER-001", domain: "EL",
    statement: "An ammeter measures current and is connected in series within the circuit being measured.",
    provenance: [{ locator: "loc-cg-ac2.3", role: "CURRICULUM_REQUIRES" }],
    prereqs: [{ id: "EL-CONCEPT-CURRENT-001", strength: "STRONG" }],
    curriculum: [{ node: NODE_AC2_3, type: "REQUIRED_FOR" }],
  },
  {
    id: "EL-INSTRUMENT-OHMMETER-001", domain: "EL",
    statement: "An ohmmeter measures resistance, and must be used on a component that is isolated and de-energised.",
    provenance: [{ locator: "loc-cg-ac2.3", role: "CURRICULUM_REQUIRES" }],
    prereqs: [{ id: "EL-CONCEPT-RESISTANCE-001", strength: "STRONG" }],
    curriculum: [{ node: NODE_AC2_3, type: "REQUIRED_FOR" }],
  },
  {
    id: "EL-INSTRUMENT-MULTIMETER-001", domain: "EL",
    statement: "A multimeter is a single instrument that can be configured to measure voltage, current or resistance.",
    provenance: [{ locator: "loc-cg-ac2.3", role: "CURRICULUM_REQUIRES" }],
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
    curriculum: [{ node: NODE_AC2_2, type: "REQUIRED_FOR" }],
  },
  {
    id: "EL-CONCEPT-FREQUENCY-001", domain: "EL",
    statement: "Frequency is the number of complete cycles of a repeating waveform that occur in one second.",
    provenance: [{ locator: "loc-openstax-up2-em-induction", role: "DEFINES" }, { locator: "loc-cg-ac2.2", role: "CURRICULUM_REQUIRES" }],
    supports: [{ id: "EL-UNIT-HERTZ-001", strength: "SUPPORTING" }],
    curriculum: [{ node: NODE_AC2_2, type: "REQUIRED_FOR" }],
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
    statement: "Impedance is the total opposition a circuit presents to the flow of alternating current, combining resistance and reactance.",
    provenance: [{ locator: "loc-openstax-up2-ac-circuits", role: "DEFINES" }, { locator: "loc-cg-ac2.2", role: "CURRICULUM_REQUIRES" }],
    prereqs: [{ id: "EL-CONCEPT-RESISTANCE-001", strength: "REQUIRED" }, { id: "EL-CONCEPT-REACTANCE-001", strength: "REQUIRED" }],
    curriculum: [{ node: NODE_AC2_2, type: "REQUIRED_FOR" }],
  },
  {
    id: "EL-UNIT-HENRY-001", domain: "EL",
    statement: "The henry (H) is the SI derived unit of inductance.",
    provenance: [{ locator: "loc-bipm-derived-units", role: "DEFINES" }, { locator: "loc-cg-ac2.2", role: "CURRICULUM_REQUIRES" }],
    curriculum: [{ node: NODE_AC2_2, type: "REQUIRED_FOR" }],
  },
  {
    id: "EL-CONCEPT-INDUCTANCE-001", domain: "EL",
    statement: "Inductance is the property of a conductor or coil that opposes a change in current by storing energy in a magnetic field.",
    provenance: [{ locator: "loc-openstax-up2-ac-circuits", role: "DEFINES" }, { locator: "loc-cg-ac2.2", role: "CURRICULUM_REQUIRES" }],
    supports: [{ id: "EL-UNIT-HENRY-001", strength: "SUPPORTING" }],
    curriculum: [{ node: NODE_AC2_2, type: "REQUIRED_FOR" }],
  },
  {
    id: "EL-UNIT-FARAD-001", domain: "EL",
    statement: "The farad (F) is the SI derived unit of capacitance.",
    provenance: [{ locator: "loc-bipm-derived-units", role: "DEFINES" }, { locator: "loc-cg-ac2.2", role: "CURRICULUM_REQUIRES" }],
    curriculum: [{ node: NODE_AC2_2, type: "REQUIRED_FOR" }],
  },
  {
    id: "EL-CONCEPT-CAPACITANCE-001", domain: "EL",
    statement: "Capacitance is the property of a component that describes its ability to store electrical charge in an electric field.",
    provenance: [{ locator: "loc-openstax-up2-ac-circuits", role: "DEFINES" }, { locator: "loc-cg-ac2.2", role: "CURRICULUM_REQUIRES" }],
    supports: [{ id: "EL-UNIT-FARAD-001", strength: "SUPPORTING" }],
    curriculum: [{ node: NODE_AC2_2, type: "REQUIRED_FOR" }],
  },
  {
    id: "EL-CONCEPT-POWER-FACTOR-001", domain: "EL",
    statement: "Power factor is a dimensionless ratio describing the phase relationship between voltage and current in an AC circuit.",
    provenance: [{ locator: "loc-openstax-up2-ac-circuits", role: "DEFINES" }, { locator: "loc-cg-ac2.2", role: "CURRICULUM_REQUIRES" }],
    prereqs: [{ id: "EL-CONCEPT-IMPEDANCE-001", strength: "STRONG" }],
    curriculum: [{ node: NODE_AC2_2, type: "REQUIRED_FOR" }],
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
    prereqs: [{ id: "EL-CONCEPT-CURRENT-001", strength: "STRONG" }],
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
    id: "EL-OHM-REARRANGE-001", domain: "EL",
    statement: "Rearrange V = I times R algebraically to make voltage, current or resistance the subject.",
    provenance: [{ locator: "loc-cg-ac4.5", role: "CURRICULUM_REQUIRES" }],
    prereqs: [
      { id: "EL-OHM-RELATIONSHIP-001", strength: "REQUIRED" },
      { id: "FM-ALG-TRANSPOSE-MULT-001", strength: "REQUIRED" },
    ],
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
    id: "EL-SERIES-VOLTAGE-CALC-001", domain: "EL",
    statement: "Calculate an individual voltage drop across a component in a series circuit.",
    provenance: [{ locator: "loc-cg-ac4.5", role: "CURRICULUM_REQUIRES" }],
    prereqs: [
      { id: "EL-SERIES-VOLTAGE-001", strength: "REQUIRED" },
      { id: "EL-OHM-SOLVE-V-001", strength: "REQUIRED" },
    ],
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
    prereqs: [
      { id: "EL-PARALLEL-RESISTANCE-001", strength: "REQUIRED" },
      { id: "FM-ARITH-RECIPROCAL-SUM-001", strength: "REQUIRED" },
      { id: "FM-ARITH-RECIPROCAL-INVERT-001", strength: "REQUIRED" },
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
    id: "EL-CURRENT-THERMAL-EFFECT-001", domain: "EL",
    statement: "Current flowing through a resistance causes heating, because electrical energy is converted into heat energy.",
    provenance: [
      { locator: "loc-openstax-up2-current-general", role: "DEFINES" },
      { locator: "loc-cg-ac4.8", role: "CURRICULUM_REQUIRES" },
    ],
    prereqs: [
      { id: "EL-CONCEPT-RESISTANCE-001", strength: "STRONG" },
      { id: "EL-CONCEPT-ENERGY-001", strength: "STRONG" },
    ],
    curriculum: [{ node: NODE_AC4_8, type: "REQUIRED_FOR" }],
  },
  {
    id: "EL-CURRENT-CHEMICAL-EFFECT-001", domain: "EL",
    statement: "Current flowing through certain solutions (electrolytes) causes chemical changes, a process known as electrolysis.",
    provenance: [
      { locator: "loc-openstax-up2-current-general", role: "DEFINES" },
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
    curriculum: [{ node: NODE_AC4_5, type: "REQUIRED_FOR" }, { node: NODE_AC1_1, type: "EXEMPLIFIES" }],
  },
  {
    id: "EL-MATERIAL-CONDUCTOR-INSULATOR-EXAMPLES-001", domain: "EL",
    statement: "Common conductors used in electrical installation work include copper and aluminium; common insulators include PVC and rubber.",
    provenance: [{ locator: "loc-openstax-up2-current-general", role: "SUPPORTS" }, { locator: "loc-cg-ac4.2", role: "CURRICULUM_REQUIRES" }],
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
    id: "EL-INSULATOR-BREAKDOWN-001", domain: "EL",
    statement: "If the voltage across an insulator becomes too high, the insulator can break down and allow current to flow, which is why insulation has a rated maximum voltage.",
    provenance: [{ locator: "loc-openstax-up2-current-general", role: "SUPPORTS" }, { locator: "loc-cg-ac4.2", role: "CURRICULUM_REQUIRES" }],
    prereqs: [{ id: "EL-CONCEPT-INSULATOR-001", strength: "REQUIRED" }],
    curriculum: [{ node: NODE_AC4_2, type: "SUPPORTS" }],
  },
  {
    id: "EL-OHM-SELECT-RELATIONSHIP-001", domain: "EL",
    statement: "Select the correct arrangement of V = I times R to use, based on which two quantities are known and which quantity is required.",
    provenance: [{ locator: "loc-cg-ac4.5", role: "CURRICULUM_REQUIRES" }],
    prereqs: [{ id: "EL-OHM-RELATIONSHIP-001", strength: "REQUIRED" }],
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
    id: "EL-CIRCUIT-PREDICT-SHORT-EFFECT-001", domain: "EL",
    statement: "Predict the effect of a short circuit occurring across a component: current increases sharply and may cause damage or operate a protective device.",
    provenance: [{ locator: "loc-openstax-up2-current-general", role: "SUPPORTS" }, { locator: "loc-cg-ac4.8", role: "CURRICULUM_REQUIRES" }],
    prereqs: [{ id: "EL-CIRCUIT-RECOGNISE-SHORT-CIRCUIT-001", strength: "REQUIRED" }],
    curriculum: [{ node: NODE_AC4_8, type: "SUPPORTS" }],
  },
  {
    id: "EL-PROTECTIVE-DEVICE-PURPOSE-001", domain: "EL",
    statement: "A protective device, such as a fuse or circuit breaker, is designed to automatically disconnect a circuit when current exceeds a safe value.",
    provenance: [{ locator: "loc-openstax-up2-current-general", role: "SUPPORTS" }, { locator: "loc-cg-ac4.8", role: "CURRICULUM_REQUIRES" }],
    prereqs: [{ id: "EL-CURRENT-THERMAL-EFFECT-001", strength: "STRONG" }],
    curriculum: [{ node: NODE_AC4_8, type: "REQUIRED_FOR" }],
  },
  {
    id: "EL-FUSE-OPERATION-001", domain: "EL",
    statement: "A fuse protects a circuit by melting and breaking the circuit when current exceeds its rated value, using the thermal effect of current.",
    provenance: [{ locator: "loc-openstax-up2-current-general", role: "SUPPORTS" }, { locator: "loc-cg-ac4.8", role: "CURRICULUM_REQUIRES" }],
    prereqs: [{ id: "EL-CURRENT-THERMAL-EFFECT-001", strength: "REQUIRED" }],
    curriculum: [{ node: NODE_AC4_8, type: "REQUIRED_FOR" }],
  },
  {
    id: "EL-THERMAL-EFFECT-APPLICATION-001", domain: "EL",
    statement: "Recognise practical applications of the thermal effect of current, such as heating elements and filament lamps.",
    provenance: [{ locator: "loc-openstax-up2-current-general", role: "SUPPORTS" }, { locator: "loc-cg-ac4.8", role: "CURRICULUM_REQUIRES" }],
    prereqs: [{ id: "EL-CURRENT-THERMAL-EFFECT-001", strength: "REQUIRED" }],
    curriculum: [{ node: NODE_AC4_8, type: "SUPPORTS" }],
  },
  {
    id: "EL-THERMAL-EFFECT-FACTORS-001", domain: "EL",
    statement: "The amount of heat generated by current flowing through a resistance depends on the current, the resistance and the time for which the current flows.",
    provenance: [{ locator: "loc-openstax-up2-current-general", role: "SUPPORTS" }, { locator: "loc-cg-ac4.8", role: "CURRICULUM_REQUIRES" }],
    prereqs: [{ id: "EL-POWER-SOLVE-IR-001", strength: "STRONG" }],
    curriculum: [{ node: NODE_AC4_8, type: "SUPPORTS" }],
  },
  {
    id: "EL-CIRCUIT-BREAKER-VS-FUSE-001", domain: "EL",
    statement: "Compare a fuse, which must be replaced after operating, with a circuit breaker, which can be reset and reused after tripping.",
    provenance: [{ locator: "loc-openstax-up2-current-general", role: "SUPPORTS" }, { locator: "loc-cg-ac4.8", role: "CURRICULUM_REQUIRES" }],
    prereqs: [{ id: "EL-FUSE-OPERATION-001", strength: "REQUIRED" }],
    curriculum: [{ node: NODE_AC4_8, type: "SUPPORTS" }],
  },
  {
    id: "EL-INSTRUMENT-SELECT-001", domain: "EL",
    statement: "Select the appropriate instrument (voltmeter, ammeter, ohmmeter or multimeter) to measure a given electrical quantity.",
    provenance: [{ locator: "loc-cg-ac2.3", role: "CURRICULUM_REQUIRES" }],
    prereqs: [{ id: "EL-INSTRUMENT-VOLTMETER-001", strength: "REQUIRED" }, { id: "EL-INSTRUMENT-AMMETER-001", strength: "REQUIRED" }, { id: "EL-INSTRUMENT-OHMMETER-001", strength: "REQUIRED" }],
    curriculum: [{ node: NODE_AC2_3, type: "REQUIRED_FOR" }],
  },
  {
    id: "EL-INSTRUMENT-VOLTMETER-INTERNAL-RESISTANCE-001", domain: "EL",
    statement: "An ideal voltmeter has very high internal resistance so that connecting it in parallel does not significantly alter the circuit being measured.",
    provenance: [{ locator: "loc-cg-ac2.3", role: "CURRICULUM_REQUIRES" }],
    prereqs: [{ id: "EL-INSTRUMENT-VOLTMETER-001", strength: "REQUIRED" }],
    curriculum: [{ node: NODE_AC2_3, type: "SUPPORTS" }],
  },
  {
    id: "EL-INSTRUMENT-AMMETER-INTERNAL-RESISTANCE-001", domain: "EL",
    statement: "An ideal ammeter has very low internal resistance so that connecting it in series does not significantly alter the circuit being measured.",
    provenance: [{ locator: "loc-cg-ac2.3", role: "CURRICULUM_REQUIRES" }],
    prereqs: [{ id: "EL-INSTRUMENT-AMMETER-001", strength: "REQUIRED" }],
    curriculum: [{ node: NODE_AC2_3, type: "SUPPORTS" }],
  },
  {
    id: "EL-INSTRUMENT-CONTINUITY-TEST-001", domain: "EL",
    statement: "A continuity test uses an ohmmeter or multimeter to confirm that a low-resistance path exists between two points in a de-energised circuit.",
    provenance: [{ locator: "loc-cg-ac2.3", role: "CURRICULUM_REQUIRES" }],
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
    curriculum: [{ node: NODE_AC4_5, type: "REQUIRED_FOR" }],
  },
  {
    id: "EL-CIRCUIT-SUPPLY-CURRENT-PARALLEL-001", domain: "EL",
    statement: "Calculate the supply current in a parallel circuit from the supply voltage and the total resistance of the circuit.",
    provenance: [{ locator: "loc-cg-ac4.5", role: "CURRICULUM_REQUIRES" }],
    prereqs: [{ id: "EL-OHM-SOLVE-I-001", strength: "REQUIRED" }, { id: "EL-PARALLEL-RESISTANCE-CALC-001", strength: "REQUIRED" }],
    curriculum: [{ node: NODE_AC4_5, type: "REQUIRED_FOR" }],
  },
  {
    id: "EL-POWER-DERIVED-V2R-001", domain: "EL",
    statement: "Electrical power can also be found from voltage and resistance alone, since combining P = V times I with I = V divided by R gives P = V squared divided by R.",
    provenance: [{ locator: "loc-openstax-up2-power-energy", role: "SUPPORTS" }],
    derivedFrom: ["EL-POWER-RELATIONSHIP-001", "EL-OHM-RELATIONSHIP-001"],
    curriculum: [{ node: NODE_AC4_6, type: "REQUIRED_FOR" }],
  },
  {
    id: "EL-POWER-SOLVE-V2R-001", domain: "EL",
    statement: "Calculate electrical power from known voltage and resistance using P = V squared divided by R.",
    provenance: [{ locator: "loc-cg-ac4.6", role: "CURRICULUM_REQUIRES" }],
    prereqs: [{ id: "EL-POWER-DERIVED-V2R-001", strength: "REQUIRED" }, { id: "FM-ALG-SUBSTITUTION-001", strength: "REQUIRED" }],
    curriculum: [{ node: NODE_AC4_6, type: "REQUIRED_FOR" }, { node: NODE_AC1_1, type: "EXEMPLIFIES" }],
  },
  {
    id: "EL-SERIES-POWER-CALC-001", domain: "EL",
    statement: "Calculate the power dissipated by an individual component in a series circuit from the common current and that component's resistance.",
    provenance: [{ locator: "loc-cg-ac4.6", role: "CURRICULUM_REQUIRES" }],
    prereqs: [{ id: "EL-POWER-SOLVE-IR-001", strength: "REQUIRED" }, { id: "EL-SERIES-CURRENT-001", strength: "REQUIRED" }],
    curriculum: [{ node: NODE_AC4_6, type: "REQUIRED_FOR" }],
  },
  {
    id: "EL-PARALLEL-POWER-CALC-001", domain: "EL",
    statement: "Calculate the power dissipated by an individual branch in a parallel circuit from the common branch voltage and that branch's resistance.",
    provenance: [{ locator: "loc-cg-ac4.6", role: "CURRICULUM_REQUIRES" }],
    prereqs: [{ id: "EL-POWER-SOLVE-V2R-001", strength: "REQUIRED" }, { id: "EL-PARALLEL-VOLTAGE-001", strength: "REQUIRED" }],
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
    curriculum: [{ node: NODE_AC2_2, type: "REQUIRED_FOR" }, { node: NODE_AC1_1, type: "EXEMPLIFIES" }],
  },
  {
    id: "EL-ENERGY-CALC-001", domain: "EL",
    statement: "Calculate the electrical energy transferred by a device from its power rating and its time of use, using E = P times t.",
    provenance: [{ locator: "loc-cg-ac2.2", role: "CURRICULUM_REQUIRES" }],
    prereqs: [{ id: "EL-ENERGY-POWER-TIME-RELATIONSHIP-001", strength: "REQUIRED" }, { id: "FM-ALG-SUBSTITUTION-001", strength: "REQUIRED" }],
    curriculum: [{ node: NODE_AC2_2, type: "REQUIRED_FOR" }, { node: NODE_AC1_1, type: "EXEMPLIFIES" }],
  },
  {
    id: "EL-ENERGY-KWH-CALC-001", domain: "EL",
    statement: "Calculate the electrical energy used by a device in kilowatt-hours from its power rating in kilowatts and its time of use in hours.",
    provenance: [{ locator: "loc-cg-ac2.2", role: "CURRICULUM_REQUIRES" }],
    prereqs: [{ id: "EL-ENERGY-CALC-001", strength: "REQUIRED" }, { id: "EL-UNIT-KWH-001", strength: "REQUIRED" }],
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
    id: "EL-CONCEPT-MAGNETIC-FLUX-DENSITY-001", domain: "EL",
    statement: "Magnetic flux density is the amount of magnetic flux passing through a unit area, describing how concentrated a magnetic field is.",
    provenance: [{ locator: "loc-openstax-up2-em-induction", role: "DEFINES" }, { locator: "loc-cg-ac5.2", role: "CURRICULUM_REQUIRES" }],
    prereqs: [{ id: "EL-CONCEPT-MAGNETIC-FLUX-001", strength: "REQUIRED" }],
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
    id: "EL-CONCEPT-FORCE-ON-CONDUCTOR-001", domain: "EL",
    statement: "A current-carrying conductor placed in a magnetic field experiences a mechanical force.",
    provenance: [{ locator: "loc-openstax-up2-magnetic-forces", role: "DEFINES" }, { locator: "loc-cg-ac5.3", role: "CURRICULUM_REQUIRES" }],
    prereqs: [{ id: "EL-CONCEPT-MAGNETIC-FIELD-CURRENT-001", strength: "REQUIRED" }, { id: "FP-CONCEPT-FORCE-001", strength: "REQUIRED" }],
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
    id: "EL-CONCEPT-TERMINAL-VOLTAGE-001", domain: "EL",
    statement: "Terminal voltage is the potential difference measured across the terminals of a source while it is supplying current, which is slightly less than its EMF due to the source's own internal resistance.",
    provenance: [{ locator: "loc-openstax-up2-em-induction", role: "SUPPORTS" }, { locator: "loc-cg-ac5.3", role: "CURRICULUM_REQUIRES" }],
    prereqs: [{ id: "EL-CONCEPT-EMF-001", strength: "REQUIRED" }, { id: "EL-CONCEPT-VOLTAGE-001", strength: "REQUIRED" }],
    contrastsWith: ["EL-CONCEPT-EMF-001"],
    curriculum: [{ node: NODE_AC5_3, type: "SUPPORTS" }],
  },
  {
    id: "EL-CONCEPT-AC-GENERATOR-001", domain: "EL",
    statement: "A simple AC generator produces an alternating EMF by rotating a single loop of wire at constant speed within a magnetic field.",
    provenance: [{ locator: "loc-openstax-up2-em-induction", role: "DEFINES" }, { locator: "loc-cg-ac5.4", role: "CURRICULUM_REQUIRES" }],
    prereqs: [{ id: "EL-CONCEPT-EMF-001", strength: "REQUIRED" }, { id: "EL-CONCEPT-MAGNETIC-FLUX-001", strength: "REQUIRED" }],
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
    curriculum: [{ node: NODE_AC5_5, type: "REQUIRED_FOR" }],
  },
  {
    id: "EL-WAVEFORM-AMPLITUDE-001", domain: "EL",
    statement: "Amplitude is the maximum displacement of a waveform from its zero (mean) value.",
    provenance: [{ locator: "loc-openstax-up2-em-induction", role: "DEFINES" }, { locator: "loc-cg-ac5.5", role: "CURRICULUM_REQUIRES" }],
    prereqs: [{ id: "EL-CONCEPT-SINE-WAVE-001", strength: "STRONG" }],
    curriculum: [{ node: NODE_AC5_5, type: "REQUIRED_FOR" }],
  },
  {
    id: "EL-WAVEFORM-PEAK-TO-PEAK-001", domain: "EL",
    statement: "The peak-to-peak value of a waveform is the difference between its maximum positive and maximum negative values.",
    provenance: [{ locator: "loc-openstax-up2-em-induction", role: "DEFINES" }, { locator: "loc-cg-ac5.5", role: "CURRICULUM_REQUIRES" }],
    prereqs: [{ id: "EL-WAVEFORM-AMPLITUDE-001", strength: "REQUIRED" }],
    curriculum: [{ node: NODE_AC5_5, type: "REQUIRED_FOR" }],
  },
  {
    id: "EL-WAVEFORM-RMS-001", domain: "EL",
    statement: "The RMS (root mean square) value of an alternating quantity is the value of direct current or voltage that would produce the same heating effect in a resistor.",
    provenance: [{ locator: "loc-openstax-up2-em-induction", role: "DEFINES" }, { locator: "loc-cg-ac5.5", role: "CURRICULUM_REQUIRES" }],
    prereqs: [{ id: "EL-CONCEPT-SINE-WAVE-001", strength: "REQUIRED" }, { id: "EL-CURRENT-THERMAL-EFFECT-001", strength: "STRONG" }],
    curriculum: [{ node: NODE_AC5_5, type: "REQUIRED_FOR" }],
  },
  {
    id: "EL-WAVEFORM-AVERAGE-VALUE-001", domain: "EL",
    statement: "The average value of an alternating waveform used in AC calculations is normally the average of the rectified (half-cycle) waveform, rather than the average over a full cycle.",
    provenance: [{ locator: "loc-openstax-up2-em-induction", role: "DEFINES" }, { locator: "loc-cg-ac5.5", role: "CURRICULUM_REQUIRES" }],
    prereqs: [{ id: "EL-CONCEPT-SINE-WAVE-001", strength: "REQUIRED" }],
    contrastsWith: ["EL-WAVEFORM-RMS-001"],
    curriculum: [{ node: NODE_AC5_5, type: "REQUIRED_FOR" }],
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
    id: "EL-WAVEFORM-RMS-CALC-001", domain: "EL",
    statement: "Calculate the RMS value of a sine wave from its peak value, or the peak value from its RMS value.",
    provenance: [{ locator: "loc-cg-ac4.5", role: "CURRICULUM_REQUIRES" }],
    prereqs: [{ id: "EL-WAVEFORM-RMS-PEAK-RELATIONSHIP-001", strength: "REQUIRED" }, { id: "FM-ALG-SUBSTITUTION-001", strength: "REQUIRED" }],
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
    curriculum: [{ node: NODE_AC5_5, type: "REQUIRED_FOR" }],
  },
  {
    id: "EL-WAVEFORM-FREQUENCY-CALC-001", domain: "EL",
    statement: "Calculate frequency from periodic time, or periodic time from frequency, using their reciprocal relationship.",
    provenance: [{ locator: "loc-cg-ac4.5", role: "CURRICULUM_REQUIRES" }],
    prereqs: [{ id: "EL-WAVEFORM-FREQUENCY-PERIOD-RELATIONSHIP-001", strength: "REQUIRED" }, { id: "FM-ALG-SUBSTITUTION-001", strength: "REQUIRED" }],
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
    id: "EL-INSTRUMENT-CLAMP-METER-001", domain: "EL",
    statement: "A clamp meter measures current without breaking the circuit, by detecting the magnetic field produced around the current-carrying conductor.",
    provenance: [{ locator: "loc-openstax-up2-magnetic-sources", role: "SUPPORTS" }, { locator: "loc-cg-ac2.3", role: "CURRICULUM_REQUIRES" }],
    prereqs: [{ id: "EL-CONCEPT-MAGNETIC-FIELD-CURRENT-001", strength: "REQUIRED" }, { id: "EL-CONCEPT-CURRENT-001", strength: "REQUIRED" }],
    curriculum: [{ node: NODE_AC2_3, type: "SUPPORTS" }],
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
    curriculum: [{ node: NODE_AC5_5, type: "SUPPORTS" }],
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
  for (const d of a.derivedFrom ?? []) {
    relationships.push({
      fromIdentifier: a.id,
      toIdentifier: d,
      relationshipType: "DERIVED_FROM",
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
  ],

  sourceVersions: [
    {
      key: SV_CG, sourceKey: SRC_CG,
      edition: "Version 1.12 (April 2026)",
      status: "CURRENT", rightsClassification: "PROPRIETARY_REFERENCE",
    },
    {
      key: SV_BIPM, sourceKey: SRC_BIPM,
      edition: "9th edition (2019)",
      status: "CURRENT", rightsClassification: "OPEN",
    },
    {
      key: SV_DFE_MATHS, sourceKey: SRC_DFE_MATHS,
      status: "CURRENT", rightsClassification: "OFFICIAL_OGL",
    },
    {
      key: SV_OPENSTAX_UP1, sourceKey: SRC_OPENSTAX_UP1,
      edition: "1st edition",
      publicationDate: "2016-09-19",
      status: "CURRENT", rightsClassification: "PUBLIC_RESTRICTED",
    },
    {
      key: SV_OPENSTAX_UP2, sourceKey: SRC_OPENSTAX_UP2,
      edition: "1st edition",
      publicationDate: "2016-10-06",
      status: "CURRENT", rightsClassification: "PUBLIC_RESTRICTED",
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
  ],

  assertions: A.map((a) => ({ identifier: a.id, domainCode: a.domain })),

  assertionVersions: A.map((a) => ({
    assertionIdentifier: a.id,
    version: 1,
    statement: a.statement,
    status: "APPROVED" as const,
  })),

  assertionProvenanceLinks: A.flatMap((a) =>
    a.provenance.map((p) => ({
      assertionIdentifier: a.id,
      assertionVersion: 1,
      sourceLocatorKey: p.locator,
      provenanceRole: p.role,
    })),
  ),

  assertionRelationships: relationships,

  assertionCurriculumMappings: A.flatMap((a) =>
    (a.curriculum ?? []).map((c) => ({
      assertionIdentifier: a.id,
      curriculumNodeKey: c.node,
      mappingType: c.type,
    })),
  ),

  misconceptions: M.map((m) => ({ identifier: m.id, description: m.description })),

  misconceptionConflicts: M.flatMap((m) =>
    m.conflicts.map((assertionIdentifier) => ({
      misconceptionIdentifier: m.id,
      assertionIdentifier,
    })),
  ),
};
