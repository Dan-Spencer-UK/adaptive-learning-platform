/**
 * CC-19A section 7: the Unit 202 blind normalization ledger.
 *
 * Every proposal here is built ONLY from:
 *   - the City & Guilds 2365-02 Qualification Handbook v1.12, pages 15 and
 *     25-30 (Unit 202's own LO/AC/Range wording, independently transcribed
 *     by direct inspection of the fetched PDF -- see
 *     reports/backtests/unit202/raw-sources/src-cg-2365-02-handbook-v1-12.pdf);
 *   - the BIPM SI Brochure, 9th edition, Tables 2/4/5 and section 2.3.3
 *     (used ONLY to attach technical truth to fact requirements that had
 *     already independently arisen from the handbook's own AC2.1/AC2.2
 *     wording -- never to seed scope).
 *
 * No Unit 202 governed matrix, obligation, assertion, lesson, or private
 * calibration material was consulted. See CC-19A-SOURCE-INVENTORY.md for
 * the full blindness-boundary audit trail.
 *
 * pipelineAcceptance is "NOT_RUN_CC19A" on every single proposal --
 * buildStandardPipeline is never imported or called anywhere in this
 * package (see cc19a-no-pipeline-execution.test.ts).
 */

import type {
  CandidateCapabilityRequirement,
  CategoryBreadthStatus,
  CurriculumNormalizationKind,
  EvidenceRef,
  LearnerPerformanceType,
  OfficialCurriculumUnit,
  PrerequisiteEvidence,
} from "@alp/qualification-pipeline";
import { candidateKey } from "@alp/qualification-pipeline";

import type { CC19ANormalizationConfidence, CC19AProfile, CC19AProposal } from "./cc19a-types.ts";

export const QUAL_ID = "CG-2365-02-UNIT202";
const SRC_HANDBOOK = "src-cg-2365-02-handbook-v1-12";
const SRC_BIPM = "src-bipm-si-brochure-9th-edition";
const HANDBOOK_REF = "City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) -- Qualification Handbook, April 2026, Version 1.12";
const BIPM_REF = "The International System of Units (SI), 9th edition (2019), BIPM";

const BOTH: readonly CC19AProfile[] = ["FULL_PUBLIC", "DEGRADED_NO_ASSESSMENT"];

// ---------------------------------------------------------------------
// Registry: one OfficialCurriculumUnit per Assessment Criterion.
// curriculumUnitId scheme: U202-LO{n}-AC{n}.
// ---------------------------------------------------------------------

interface AcSpec {
  readonly id: string; // curriculumUnitId, e.g. "U202-LO2-AC2"
  readonly lo: number;
  readonly ac: number;
  readonly loWording: string;
  readonly acWording: string;
  readonly page: number;
}

const ACS: readonly AcSpec[] = [
  { id: "U202-LO1-AC1", lo: 1, ac: 1, loWording: "Understand mathematical principles which are appropriate to electrical installation, maintenance and design work", acWording: "identify and apply appropriate mathematical principles which are relevant to electrical work tasks", page: 25 },
  { id: "U202-LO2-AC1", lo: 2, ac: 1, loWording: "Understand standard units of measurement used in electrical installation, maintenance and design work", acWording: "identify and use internationally recognised base and derived (SI) units of measurement", page: 26 },
  { id: "U202-LO2-AC2", lo: 2, ac: 2, loWording: "Understand standard units of measurement used in electrical installation, maintenance and design work", acWording: "identify and determine values of base and derived SI units which apply specifically to electrical quantities", page: 26 },
  { id: "U202-LO2-AC3", lo: 2, ac: 3, loWording: "Understand standard units of measurement used in electrical installation, maintenance and design work", acWording: "identify appropriate electrical instruments for the measurement of different electrical quantities", page: 26 },
  { id: "U202-LO3-AC1", lo: 3, ac: 1, loWording: "Understand basic mechanics and the relationship between force, work, energy and power", acWording: "specify what is meant by mass and weight", page: 27 },
  { id: "U202-LO3-AC2", lo: 3, ac: 2, loWording: "Understand basic mechanics and the relationship between force, work, energy and power", acWording: "explain the principles of basic mechanics as they apply to levers, gears and pulleys", page: 27 },
  { id: "U202-LO3-AC3", lo: 3, ac: 3, loWording: "Understand basic mechanics and the relationship between force, work, energy and power", acWording: "describe the main principles of the following and their inter-relationships: a. force b. work c. energy (kinetic and potential) d. power e. efficiency", page: 27 },
  { id: "U202-LO3-AC4", lo: 3, ac: 4, loWording: "Understand basic mechanics and the relationship between force, work, energy and power", acWording: "calculate values of mechanical energy, power and efficiency", page: 27 },
  { id: "U202-LO4-AC1", lo: 4, ac: 1, loWording: "Understand the relationship between resistance, resistivity, voltage, current and power", acWording: "describe the basic principles of electron theory", page: 27 },
  { id: "U202-LO4-AC2", lo: 4, ac: 2, loWording: "Understand the relationship between resistance, resistivity, voltage, current and power", acWording: "identify and distinguish between materials which are good conductors and insulators", page: 27 },
  { id: "U202-LO4-AC3", lo: 4, ac: 3, loWording: "Understand the relationship between resistance, resistivity, voltage, current and power", acWording: "describe what is meant by resistance and resistivity in relation to electrical circuits", page: 27 },
  { id: "U202-LO4-AC4", lo: 4, ac: 4, loWording: "Understand the relationship between resistance, resistivity, voltage, current and power", acWording: "explain the relationship between current, voltage and resistance in parallel and series D.C. circuits", page: 27 },
  { id: "U202-LO4-AC5", lo: 4, ac: 5, loWording: "Understand the relationship between resistance, resistivity, voltage, current and power", acWording: "calculate the values of current, voltage and resistance in parallel and series D.C. circuits", page: 27 },
  { id: "U202-LO4-AC6", lo: 4, ac: 6, loWording: "Understand the relationship between resistance, resistivity, voltage, current and power", acWording: "calculate values of power in parallel and series D.C. circuits", page: 27 },
  { id: "U202-LO4-AC7", lo: 4, ac: 7, loWording: "Understand the relationship between resistance, resistivity, voltage, current and power", acWording: "state what is meant by the term voltage drop in relation to electrical circuits", page: 27 },
  { id: "U202-LO4-AC8", lo: 4, ac: 8, loWording: "Understand the relationship between resistance, resistivity, voltage, current and power", acWording: "describe the chemical and thermal effects of electric currents", page: 27 },
  { id: "U202-LO5-AC1", lo: 5, ac: 1, loWording: "Understand the fundamental principles which underpin the relationship between magnetism and electricity", acWording: "describe the effects of magnetism in terms of attraction and repulsion", page: 28 },
  { id: "U202-LO5-AC2", lo: 5, ac: 2, loWording: "Understand the fundamental principles which underpin the relationship between magnetism and electricity", acWording: "state the difference between magnetic flux and flux density", page: 28 },
  { id: "U202-LO5-AC3", lo: 5, ac: 3, loWording: "Understand the fundamental principles which underpin the relationship between magnetism and electricity", acWording: "describe the magnetic effects of electrical currents in terms of: a. production of a magnetic field b. force on a current-carrying conductor in a magnetic field c. electromagnetism d. electromotive force", page: 28 },
  { id: "U202-LO5-AC4", lo: 5, ac: 4, loWording: "Understand the fundamental principles which underpin the relationship between magnetism and electricity", acWording: "describe the basic principles of generating an A.C. supply in terms of: a. a single-loop generator b. sine-wave c. frequency d. EMF e. magnetic flux", page: 28 },
  { id: "U202-LO5-AC5", lo: 5, ac: 5, loWording: "Understand the fundamental principles which underpin the relationship between magnetism and electricity", acWording: "identify the characteristics of sine-waves", page: 28 },
  { id: "U202-LO6-AC1", lo: 6, ac: 1, loWording: "Understand the types, applications and limitations of electronic components in electrical systems and equipment", acWording: "describe the function and application of electronic components that are used in electrical systems", page: 29 },
  { id: "U202-LO6-AC2", lo: 6, ac: 2, loWording: "Understand the types, applications and limitations of electronic components in electrical systems and equipment", acWording: "state the basic operating principles of electronic components and devices", page: 29 },
];

function acById(id: string): AcSpec {
  const found = ACS.find((a) => a.id === id);
  if (!found) throw new Error(`cc19a-ledger-data: no AcSpec for curriculumUnitId "${id}"`);
  return found;
}

export const officialCurriculumUnitProposals: readonly CC19AProposal[] = ACS.map((a): CC19AProposal => {
  const unit: OfficialCurriculumUnit = {
    curriculumUnitId: a.id,
    qualificationId: QUAL_ID,
    sourceRef: HANDBOOK_REF,
    sourceLocator: `page ${a.page}`,
    officialWording: a.acWording,
  };
  return {
    proposalId: `OCU-${a.id}`,
    evidenceRole: "OFFICIAL_CURRICULUM",
    layerA: {
      sourceId: SRC_HANDBOOK,
      sourceRef: HANDBOOK_REF,
      sourceLocator: `page ${a.page}, Unit 202, Learning outcome ${a.lo}, Assessment criteria ${a.ac}`,
      sourceExcerpt: `Learning outcome: The learner will: ${a.lo}. ${a.loWording}. Assessment criteria: The learner can: ${a.ac}. ${a.acWording}`,
      rawIdentifier: `LO${a.lo}.AC${a.ac}`,
    },
    layerB: {
      recordType: "OfficialCurriculumUnit",
      record: unit,
      normalizationConfidence: "EXPLICIT",
      normalizationRationale: `Registry entry transcribed verbatim from the handbook's own Learning outcome / Assessment criteria table for Unit 202, page ${a.page}. curriculumUnitId is a CC-19A-assigned mapping key (U202-LO${a.lo}-AC${a.ac}), not itself official wording.`,
      profileEligibility: BOTH,
    },
    layerC: { pipelineAcceptance: "NOT_RUN_CC19A" },
  };
});

// ---------------------------------------------------------------------
// Curriculum evidence: PRIMARY_REQUIREMENT per AC (per performance type),
// plus RANGE_REQUIRED_MEMBER for every explicit Range/lettered-sub-item.
// ---------------------------------------------------------------------

let seq = 0;
function ceId(tag: string): string {
  seq += 1;
  return `CE-${String(seq).padStart(3, "0")}-${tag}`;
}

function primary(acId: string, subject: string, performanceType: LearnerPerformanceType, opts: { confidence: CC19ANormalizationConfidence; rationale: string; breadthStatus?: CategoryBreadthStatus }): CC19AProposal {
  const a = acById(acId);
  return {
    proposalId: ceId(`${acId}-PRIMARY-${performanceType}`),
    evidenceRole: "OFFICIAL_CURRICULUM",
    layerA: {
      sourceId: SRC_HANDBOOK,
      sourceRef: HANDBOOK_REF,
      sourceLocator: `page ${a.page}, Unit 202, AC${a.lo}.${a.ac}`,
      sourceExcerpt: `The learner can: ${a.ac}. ${a.acWording}`,
      rawIdentifier: `LO${a.lo}.AC${a.ac}`,
    },
    layerB: {
      recordType: "CurriculumEvidence",
      record: {
        role: "OFFICIAL_CURRICULUM",
        evidenceId: ceId(`${acId}-PRIMARY-${performanceType}-rec`),
        qualificationId: QUAL_ID,
        curriculumUnitId: acId,
        subject,
        normalizationKind: "PRIMARY_REQUIREMENT",
        commandVerbPerformanceType: performanceType,
        sourceRef: HANDBOOK_REF,
        sourceLocator: `page ${a.page}, AC${a.lo}.${a.ac}`,
        normalizationBasis: "EXPLICIT_CURRICULUM_WORDING",
        ...(opts.breadthStatus ? { breadthStatus: opts.breadthStatus } : {}),
      },
      normalizationConfidence: opts.confidence,
      normalizationRationale: opts.rationale,
      profileEligibility: BOTH,
    },
    layerC: { pipelineAcceptance: "NOT_RUN_CC19A" },
  };
}

function rangeMember(acId: string, parentSubject: string, subject: string, performanceType: LearnerPerformanceType, rangeHeading: string, rawItemText: string, opts: { confidence: CC19ANormalizationConfidence; rationale: string }): CC19AProposal {
  const a = acById(acId);
  return {
    proposalId: ceId(`${acId}-RANGE-${subject}-${performanceType}`),
    evidenceRole: "OFFICIAL_CURRICULUM",
    layerA: {
      sourceId: SRC_HANDBOOK,
      sourceRef: HANDBOOK_REF,
      sourceLocator: `page ${a.page}, Unit 202, Range under AC${a.lo}.${a.ac} ("${rangeHeading}")`,
      sourceExcerpt: `Range: ${rangeHeading} ${rawItemText}.`,
      rawIdentifier: `LO${a.lo}.AC${a.ac} Range: ${rangeHeading}`,
    },
    layerB: {
      recordType: "CurriculumEvidence",
      record: {
        role: "OFFICIAL_CURRICULUM",
        evidenceId: ceId(`${acId}-RANGE-${subject}-${performanceType}-rec`),
        qualificationId: QUAL_ID,
        curriculumUnitId: acId,
        subject,
        normalizationKind: "RANGE_REQUIRED_MEMBER",
        refinesSubject: parentSubject,
        commandVerbPerformanceType: performanceType,
        sourceRef: HANDBOOK_REF,
        sourceLocator: `page ${a.page}, Range under AC${a.lo}.${a.ac}`,
        normalizationBasis: "EXPLICIT_RANGE_STRUCTURE",
      },
      normalizationConfidence: opts.confidence,
      normalizationRationale: opts.rationale,
      profileEligibility: BOTH,
    },
    layerC: { pipelineAcceptance: "NOT_RUN_CC19A" },
  };
}

function rangeMembers(acId: string, parentSubject: string, subjectPrefix: string, performanceType: LearnerPerformanceType, rangeHeading: string, items: readonly string[]): CC19AProposal[] {
  return items.map((raw) =>
    rangeMember(acId, parentSubject, `${subjectPrefix}--${slug(raw)}`, performanceType, rangeHeading, raw, {
      confidence: "STRONG_INFERENCE",
      rationale: `"${raw}" is an explicit member of the "${rangeHeading}" Range list under AC${acById(acId).lo}.${acById(acId).ac}. Performance type ${performanceType} is inherited from the parent AC's own command verb (the Range table itself carries no separate verb per item) -- an inference from Range structure, not a second literal verb, hence STRONG_INFERENCE rather than EXPLICIT.`,
    }),
  );
}

function slug(s: string): string {
  return s
    .toLowerCase()
    .replace(/[().]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const curriculumProposals: CC19AProposal[] = [];

// --- LO1 / AC1.1 -------------------------------------------------------
{
  const acId = "U202-LO1-AC1";
  const subj = "mathematical-principles-relevant-to-electrical-work";
  curriculumProposals.push(
    primary(acId, subj, "IDENTIFY", { confidence: "EXPLICIT", rationale: 'AC1.1 literally reads "identify and apply appropriate mathematical principles..." -- IDENTIFY is one of the two explicit verbs.' }),
    primary(acId, subj, "APPLY", { confidence: "EXPLICIT", rationale: 'AC1.1 literally reads "identify and apply appropriate mathematical principles..." -- APPLY is the second explicit verb.' }),
    ...rangeMembers(acId, subj, "mathematical-principle", "APPLY", "Mathematical principles:", ["Fractions and percentages", "Algebra", "Indices", "Transposition", "Triangles and trigonometry", "Statistics"]),
  );
}

// --- LO2 / AC2.1, AC2.2, AC2.3 -----------------------------------------
{
  const acId = "U202-LO2-AC1";
  const subj = "si-units-of-measurement-for-physical-quantities";
  curriculumProposals.push(
    primary(acId, subj, "IDENTIFY", { confidence: "EXPLICIT", rationale: 'AC2.1 reads "identify and use internationally recognised base and derived (SI) units of measurement" -- IDENTIFY is the first explicit verb.' }),
    primary(acId, subj, "APPLY", { confidence: "EXPLICIT", rationale: 'AC2.1\'s second verb "use" is normalized to the governed vocabulary\'s APPLY (using a unit of measurement in practice is an application, not a bare recognition act).' }),
    ...rangeMembers(acId, subj, "physical-quantity-si-unit", "APPLY", "(SI) Units of measurement for:", ["Length", "Area", "Volume", "Mass", "Density", "Time", "Temperature", "Velocity"]),
  );
}
{
  const acId = "U202-LO2-AC2";
  const subj = "si-units-of-measurement-for-electrical-quantities";
  curriculumProposals.push(
    primary(acId, subj, "IDENTIFY", { confidence: "EXPLICIT", rationale: 'AC2.2 reads "identify and determine values of base and derived SI units which apply specifically to electrical quantities" -- IDENTIFY is the first explicit verb.' }),
    primary(acId, subj, "DEFINE", { confidence: "EXPLICIT", rationale: 'AC2.2\'s "determine values of ... units" is normalized to DEFINE: no arithmetic/circuit calculation is implied (contrast AC4.5/AC4.6\'s explicit "calculate"), this is knowing/stating what unit and symbol apply to each named electrical quantity.' }),
  );
  // AC2.2's Range bundles two quantity pairs on one line each ("Inductance
  // and inductive reactance"; "Capacitance and capacitive reactance") --
  // task section 18 forbids bundling two independently falsifiable facts
  // into one claimKey, so each pair is split into two Range-member
  // candidates here even though the handbook prints them as one bullet.
  const items: readonly string[] = ["Resistance", "Resistivity", "Power", "Frequency", "Current", "Voltage", "Energy", "Impedance", "Inductance", "Inductive reactance", "Capacitance", "Capacitive reactance", "Power factor"];
  for (const raw of items) {
    curriculumProposals.push(
      rangeMember(acId, subj, `electrical-quantity-si-unit--${slug(raw)}`, "DEFINE", "Electrical quantities (SI units):", raw, {
        confidence: raw === "Inductive reactance" || raw === "Capacitive reactance" ? "STRONG_INFERENCE" : "STRONG_INFERENCE",
        rationale:
          raw === "Inductance" || raw === "Capacitive reactance" || raw === "Inductive reactance" || raw === "Capacitance"
            ? `The handbook prints this Range line as a single bundled bullet ("Inductance and inductive reactance" / "Capacitance and capacitive reactance"). Split into two independent claim-bearing Range members ("${raw}" here) per the one-factual-dimension-per-claimKey rule -- both halves remain required, but are tracked as separate candidates.`
            : `"${raw}" is an explicit member of the "Electrical quantities (SI units):" Range list under AC2.2. Performance type DEFINE inherited from the parent AC's "determine values of" verb.`,
      }),
    );
  }
}
{
  const acId = "U202-LO2-AC3";
  const subj = "electrical-instruments-for-measurement";
  curriculumProposals.push(
    primary(acId, subj, "IDENTIFY", { confidence: "EXPLICIT", rationale: 'AC2.3 reads "identify appropriate electrical instruments for the measurement of different electrical quantities" -- single explicit verb IDENTIFY.' }),
    ...rangeMembers(acId, subj, "electrical-instrument-for-measuring", "IDENTIFY", "Electrical quantities (measurement):", ["Resistance", "Power", "Current", "Voltage", "Energy"]),
  );
}

// --- LO3 -----------------------------------------------------------------
curriculumProposals.push(primary("U202-LO3-AC1", "mass-and-weight", "DEFINE", { confidence: "EXPLICIT", rationale: 'AC3.1 reads "specify what is meant by mass and weight" -- "specify what is meant by" is normalized to DEFINE.' }));
{
  const acId = "U202-LO3-AC2";
  const subj = "basic-mechanics-of-levers-gears-and-pulleys";
  curriculumProposals.push(
    primary(acId, subj, "EXPLAIN", { confidence: "EXPLICIT", rationale: 'AC3.2 reads "explain the principles of basic mechanics as they apply to levers, gears and pulleys" -- explicit verb EXPLAIN.' }),
    ...rangeMembers(acId, "lever-classes", "lever-class", "EXPLAIN", "Levers:", ["class I", "class II", "class III"]),
  );
}
{
  const acId = "U202-LO3-AC3";
  const subj = "force-work-energy-power-efficiency-interrelationships";
  curriculumProposals.push(
    primary(acId, subj, "DESCRIBE", { confidence: "EXPLICIT", rationale: 'AC3.3 reads "describe the main principles of the following and their inter-relationships" -- explicit verb DESCRIBE.' }),
    ...(["force", "work", "energy (kinetic and potential)", "power", "efficiency"] as const).map((item) =>
      rangeMember(acId, subj, `mechanics-principle--${slug(item)}`, "DESCRIBE", "(AC3.3's own lettered sub-list, not a formal Range table)", item, {
        confidence: "EXPLICIT",
        rationale: `"${item}" is one of AC3.3's own literal lettered sub-clauses (a-e), not a separate formal "Range" box -- functionally equivalent to an explicit Range member (a named, individually assessable sub-topic of one AC), so normalized as RANGE_REQUIRED_MEMBER, but EXPLICIT confidence since the wording is verbatim AC text, not a Range-structure inference.`,
      }),
    ),
  );
}
curriculumProposals.push(primary("U202-LO3-AC4", "mechanical-energy-power-and-efficiency-calculation", "CALCULATE", { confidence: "EXPLICIT", rationale: 'AC3.4 reads "calculate values of mechanical energy, power and efficiency" -- explicit verb CALCULATE.' }));

// --- LO4 (no Range section for any AC in the handbook) --------------------
curriculumProposals.push(
  primary("U202-LO4-AC1", "electron-theory-basic-principles", "DESCRIBE", { confidence: "EXPLICIT", rationale: 'AC4.1 reads "describe the basic principles of electron theory".' }),
  primary("U202-LO4-AC2", "conductors-and-insulators", "IDENTIFY", { confidence: "EXPLICIT", rationale: 'AC4.2 reads "identify and distinguish between materials which are good conductors and insulators" -- IDENTIFY is the first explicit verb.' }),
  primary("U202-LO4-AC2", "conductors-and-insulators", "DISTINGUISH", { confidence: "EXPLICIT", rationale: 'AC4.2\'s second explicit verb is DISTINGUISH ("distinguish between").' }),
  primary("U202-LO4-AC3", "resistance-and-resistivity-in-electrical-circuits", "DESCRIBE", { confidence: "EXPLICIT", rationale: 'AC4.3 reads "describe what is meant by resistance and resistivity in relation to electrical circuits".' }),
  primary("U202-LO4-AC4", "current-voltage-resistance-relationship-series-parallel-dc", "EXPLAIN", { confidence: "EXPLICIT", rationale: 'AC4.4 reads "explain the relationship between current, voltage and resistance in parallel and series D.C. circuits".' }),
  primary("U202-LO4-AC5", "current-voltage-resistance-calculation-series-parallel-dc", "CALCULATE", { confidence: "EXPLICIT", rationale: 'AC4.5 reads "calculate the values of current, voltage and resistance in parallel and series D.C. circuits".' }),
  primary("U202-LO4-AC6", "power-calculation-series-parallel-dc", "CALCULATE", { confidence: "EXPLICIT", rationale: 'AC4.6 reads "calculate values of power in parallel and series D.C. circuits".' }),
  primary("U202-LO4-AC7", "voltage-drop-meaning", "STATE", { confidence: "EXPLICIT", rationale: 'AC4.7 reads "state what is meant by the term voltage drop in relation to electrical circuits".' }),
  primary("U202-LO4-AC8", "chemical-and-thermal-effects-of-electric-current", "DESCRIBE", { confidence: "EXPLICIT", rationale: 'AC4.8 reads "describe the chemical and thermal effects of electric currents".' }),
);
// LO4 has NO "Range" heading for any of its 8 ACs anywhere in the handbook
// (pages 27, between AC4.1's heading and LO5's heading on page 28) -- a
// genuine structural absence, recorded here rather than silently ignored;
// see the coverage accounting note "LO4_NO_RANGE_SECTION".

// --- LO5 -------------------------------------------------------------------
curriculumProposals.push(primary("U202-LO5-AC1", "magnetism-attraction-and-repulsion-effects", "DESCRIBE", { confidence: "EXPLICIT", rationale: 'AC5.1 reads "describe the effects of magnetism in terms of attraction and repulsion".' }));
curriculumProposals.push(primary("U202-LO5-AC2", "magnetic-flux-vs-flux-density-difference", "STATE", { confidence: "EXPLICIT", rationale: 'AC5.2 reads "state the difference between magnetic flux and flux density" -- literal verb STATE.' }));
{
  const acId = "U202-LO5-AC3";
  const subj = "magnetic-effects-of-electrical-currents";
  curriculumProposals.push(
    primary(acId, subj, "DESCRIBE", { confidence: "EXPLICIT", rationale: 'AC5.3 reads "describe the magnetic effects of electrical currents in terms of: ...".' }),
    ...(["production of a magnetic field", "force on a current-carrying conductor in a magnetic field", "electromagnetism", "electromotive force"] as const).map((item) =>
      rangeMember(acId, subj, `magnetic-effect--${slug(item)}`, "DESCRIBE", "(AC5.3's own lettered sub-list a-d, not a formal Range table)", item, {
        confidence: "EXPLICIT",
        rationale: `"${item}" is one of AC5.3's own literal lettered sub-clauses (a-d) enumerating what "in terms of" covers -- treated as RANGE_REQUIRED_MEMBER (functionally a named required sub-topic), EXPLICIT confidence since verbatim AC text.`,
      }),
    ),
  );
}
{
  const acId = "U202-LO5-AC4";
  const subj = "basic-principles-of-generating-an-ac-supply";
  curriculumProposals.push(
    primary(acId, subj, "DESCRIBE", { confidence: "EXPLICIT", rationale: 'AC5.4 reads "describe the basic principles of generating an A.C. supply in terms of: ...".' }),
    ...(["a single-loop generator", "sine-wave", "frequency", "EMF", "magnetic flux"] as const).map((item) =>
      rangeMember(acId, subj, `ac-generation-principle--${slug(item)}`, "DESCRIBE", "(AC5.4's own lettered sub-list a-e, not a formal Range table)", item, {
        confidence: "EXPLICIT",
        rationale: `"${item}" is one of AC5.4's own literal lettered sub-clauses (a-e) -- RANGE_REQUIRED_MEMBER, EXPLICIT confidence since verbatim AC text.`,
      }),
    ),
  );
}
{
  const acId = "U202-LO5-AC5";
  const subj = "characteristics-of-sine-waves";
  curriculumProposals.push(
    primary(acId, subj, "IDENTIFY", { confidence: "EXPLICIT", rationale: 'AC5.5 reads "identify the characteristics of sine-waves".' }),
    ...rangeMembers(acId, subj, "sine-wave-characteristic", "IDENTIFY", "Characteristics of a sine-wave:", ["Root Mean Square (RMS) value", "Average value", "Peak to peak value", "Periodic time", "Frequency", "Amplitude"]),
  );
}

// --- LO6 ---------------------------------------------------------------
{
  const acId = "U202-LO6-AC1";
  const subj = "electronic-component-function-and-application-in-electrical-systems";
  curriculumProposals.push(
    primary(acId, subj, "DESCRIBE", { confidence: "EXPLICIT", rationale: 'AC6.1 reads "describe the function and application of electronic components that are used in electrical systems".' }),
    ...rangeMembers(acId, subj, "electrical-system-application", "DESCRIBE", "Electrical systems:", ["Security alarms", "Telephones", "Dimmer switches", "Heating/boiler controls", "Motor control", "Wireless control systems"]),
  );
}
{
  const acId = "U202-LO6-AC2";
  const subj = "electronic-component-basic-operating-principles";
  curriculumProposals.push(primary(acId, subj, "STATE", { confidence: "EXPLICIT", rationale: 'AC6.2 reads "state the basic operating principles of electronic components and devices".' }));
  const topLevelItems: readonly string[] = ["Capacitors", "Resistors", "Rectifiers", "Diodes", "Thermistors", "Diacs", "Triacs", "Transistors", "Thyristors", "Invertors"];
  for (const raw of topLevelItems) {
    curriculumProposals.push(
      rangeMember(acId, subj, `electronic-component--${slug(raw)}`, "STATE", "Electronic components and devices:", raw, {
        confidence: "STRONG_INFERENCE",
        rationale: `"${raw}" is an explicit member of the "Electronic components and devices:" Range list under AC6.2.`,
      }),
    );
  }
  // "Zener" and "photo" print at the same bullet indentation as the other
  // items but, per standard practice for this kind of listing and the
  // adjacency to "Diodes", most plausibly name TYPES of diode rather than
  // freestanding components -- genuinely ambiguous from the rendered
  // structure alone, so recorded as REVIEW_PROPOSED nested members of
  // "Diodes" rather than forcing either a top-level or nested reading.
  for (const raw of ["Zener", "photo"] as const) {
    curriculumProposals.push(
      rangeMember(acId, `electronic-component--diodes`, `electronic-component--diodes--${slug(raw)}`, "STATE", "Electronic components and devices:", raw, {
        confidence: "REVIEW_PROPOSED",
        rationale: `"${raw}" prints in the Range list immediately after "Diodes" at the same bullet indentation as every other top-level item. The most plausible reading is that it names a TYPE of diode ("${raw} diode"/"${raw}diode"), i.e. a nested member of "Diodes" rather than a freestanding component -- but the rendered source does not unambiguously show sub-bullet indentation, so this structural interpretation is NOT treated as EXPLICIT or even STRONG_INFERENCE; it is exported REVIEW_PROPOSED for the Project Architect to confirm against the original document layout before being treated as governing.`,
      }),
    );
  }
}

export const curriculumEvidenceProposals: readonly CC19AProposal[] = curriculumProposals;

/** candidateKey(subject, performanceType) -> the real evidenceId of the CurriculumEvidence proposal that produced it, so fact-requirement citations resolve to a genuine proposal rather than a guessed id. */
const curriculumEvidenceIdByCandidateKey = new Map<string, string>();
for (const p of curriculumProposals) {
  if (p.layerB.recordType !== "CurriculumEvidence") continue;
  const rec = p.layerB.record;
  if (!rec.commandVerbPerformanceType) continue;
  curriculumEvidenceIdByCandidateKey.set(candidateKey(rec.subject, rec.commandVerbPerformanceType), rec.evidenceId);
}

// ---------------------------------------------------------------------
// Prerequisites / capability requirements. Task section 15: only created
// when the public curriculum source ITSELF demonstrates the operation;
// the handbook never explicitly states a necessity relationship between
// two ACs, so these are REVIEW_PROPOSED, never EXPLICIT_CURRICULUM_OPERATION.
// ---------------------------------------------------------------------

interface PrereqSpec {
  readonly capabilitySubject: string;
  readonly capabilityPerformance: LearnerPerformanceType;
  readonly targetSubject: string;
  readonly targetPerformance: LearnerPerformanceType;
  readonly capabilityKey: string;
  readonly justification: string;
}

const PREREQS: readonly PrereqSpec[] = [
  {
    capabilitySubject: "mathematical-principle--transposition",
    capabilityPerformance: "APPLY",
    targetSubject: "current-voltage-resistance-calculation-series-parallel-dc",
    targetPerformance: "CALCULATE",
    capabilityKey: "algebraic-transposition",
    justification: "AC4.5's D.C. circuit calculations of current/voltage/resistance structurally require rearranging Ohm's-law-family equations, which is exactly LO1's Range item \"Transposition\" (AC1.1).",
  },
  {
    capabilitySubject: "mathematical-principle--transposition",
    capabilityPerformance: "APPLY",
    targetSubject: "power-calculation-series-parallel-dc",
    targetPerformance: "CALCULATE",
    capabilityKey: "algebraic-transposition",
    justification: "AC4.6's D.C. circuit power calculations structurally require the same algebraic transposition skill as AC4.5.",
  },
  {
    capabilitySubject: "mathematical-principle--transposition",
    capabilityPerformance: "APPLY",
    targetSubject: "mechanical-energy-power-and-efficiency-calculation",
    targetPerformance: "CALCULATE",
    capabilityKey: "algebraic-transposition",
    justification: "AC3.4's mechanical energy/power/efficiency calculations structurally require rearranging the same class of equations as AC4.5/AC4.6.",
  },
];

export const prerequisiteProposals: readonly CC19AProposal[] = PREREQS.map((p, i): CC19AProposal => {
  const targetKey = candidateKey(p.targetSubject, p.targetPerformance);
  const capKey = candidateKey(p.capabilitySubject, p.capabilityPerformance);
  const prereq: PrerequisiteEvidence = {
    kind: "STRUCTURAL_PREREQUISITE_DEPENDENCY",
    evidenceId: `PREREQ-${i + 1}`,
    subject: p.capabilitySubject,
    performanceType: p.capabilityPerformance,
    capabilityKey: p.capabilityKey,
    necessaryForCandidateKey: targetKey,
    minimalDepthJustification: p.justification,
    sourceRef: HANDBOOK_REF,
    sourceLocator: "pages 25, 27 (AC1.1 Range: Transposition; AC3.4/AC4.5/AC4.6 calculation ACs)",
    normalizationBasis: "STRUCTURAL_PREREQUISITE_DEPENDENCY",
  };
  return {
    proposalId: `PREREQ-${i + 1}-${p.capabilityKey}-for-${slug(p.targetSubject)}`,
    evidenceRole: "OFFICIAL_CURRICULUM",
    layerA: {
      sourceId: SRC_HANDBOOK,
      sourceRef: HANDBOOK_REF,
      sourceLocator: "pages 25, 27",
      sourceExcerpt: `AC1.1 Range: "Transposition". Target AC wording: "${p.justification}"`,
      rawIdentifier: `LO1.AC1 Range x target candidate ${targetKey}`,
    },
    layerB: {
      recordType: "PrerequisiteEvidence",
      record: prereq,
      normalizationConfidence: "REVIEW_PROPOSED",
      normalizationRationale: `The handbook demonstrates BOTH the capability (AC1.1's Transposition Range item) AND the operation that needs it (the named calculation AC), but never explicitly states a necessity relationship between the two ACs -- task section 15 requires EXPLICIT_CURRICULUM_OPERATION to come from the source ITSELF demonstrating the operation as necessary, not from CC-19A's own structural inference. Exported REVIEW_PROPOSED, capped from auto-promotion, matching the companion CandidateCapabilityRequirement's derivationKind REVIEW_PROPOSED below.`,
      profileEligibility: BOTH,
    },
    layerC: { pipelineAcceptance: "NOT_RUN_CC19A" },
  };
});

export const capabilityRequirementProposals: readonly CC19AProposal[] = PREREQS.map((p, i): CC19AProposal => {
  const targetKey = candidateKey(p.targetSubject, p.targetPerformance);
  const req: CandidateCapabilityRequirement = {
    qualificationId: QUAL_ID,
    targetSubject: p.targetSubject,
    targetCandidateKey: targetKey,
    capabilityKey: p.capabilityKey,
    derivationKind: "REVIEW_PROPOSED",
    sourceEvidenceRefs: [],
    sourceRef: HANDBOOK_REF,
    sourceLocator: "pages 25, 27",
    normalizationBasis: "CAPABILITY_DEPENDENCY_DERIVATION",
  };
  return {
    proposalId: `CAPREQ-${i + 1}-${p.capabilityKey}-for-${slug(p.targetSubject)}`,
    evidenceRole: "OFFICIAL_CURRICULUM",
    layerA: {
      sourceId: SRC_HANDBOOK,
      sourceRef: HANDBOOK_REF,
      sourceLocator: "pages 25, 27",
      sourceExcerpt: `AC1.1 Range: "Transposition". Target AC wording: "${p.justification}"`,
      rawIdentifier: `LO1.AC1 Range x target candidate ${targetKey}`,
    },
    layerB: {
      recordType: "CandidateCapabilityRequirement",
      record: req,
      normalizationConfidence: "REVIEW_PROPOSED",
      normalizationRationale: "derivationKind REVIEW_PROPOSED -- see the companion PrerequisiteEvidence proposal's rationale. Never auto-promotable per the governed architecture even if the pipeline were run.",
      profileEligibility: BOTH,
    },
    layerC: { pipelineAcceptance: "NOT_RUN_CC19A" },
  };
});

// ---------------------------------------------------------------------
// Candidate fact requirements + technical truth. Derived ONLY from
// AC2.1/AC2.2's own "identify and determine values of ... SI units"
// wording, which explicitly requires knowing the unit/symbol VALUE for
// each named quantity (task section 16). Technical truth attached ONLY
// from the BIPM SI Brochure, and ONLY where it explicitly (or, for power
// factor, by its own general dimensionless-ratio principle) supports the
// exact claim -- resistivity/impedance/inductive & capacitive reactance
// are NOT separately named by BIPM under those exact quantity names, so
// those four fact requirements are exported WITHOUT an attached
// SourceFactualClaim (never fabricated from memory).
// ---------------------------------------------------------------------

interface FactSpec {
  readonly targetSubject: string;
  readonly targetPerformance: LearnerPerformanceType;
  readonly claimKey: string;
  readonly citedRangeExcerpt: string;
  readonly bipmValue?: { unitName: string; symbol: string; bipmLocator: string; bipmExcerpt: string; confidence: CC19ANormalizationConfidence };
}

const PHYSICAL_FACTS: readonly FactSpec[] = [
  { targetSubject: "physical-quantity-si-unit--length", targetPerformance: "APPLY", claimKey: "length-si-unit", citedRangeExcerpt: "Length", bipmValue: { unitName: "metre", symbol: "m", bipmLocator: "Table 2, page 126", bipmExcerpt: "length ... metre ... m", confidence: "EXPLICIT" } },
  { targetSubject: "physical-quantity-si-unit--area", targetPerformance: "APPLY", claimKey: "area-si-unit", citedRangeExcerpt: "Area", bipmValue: { unitName: "square metre", symbol: "m²", bipmLocator: "Table 5, page 135", bipmExcerpt: "area ... m2", confidence: "EXPLICIT" } },
  { targetSubject: "physical-quantity-si-unit--volume", targetPerformance: "APPLY", claimKey: "volume-si-unit", citedRangeExcerpt: "Volume", bipmValue: { unitName: "cubic metre", symbol: "m³", bipmLocator: "Table 5, page 135", bipmExcerpt: "volume ... m3", confidence: "EXPLICIT" } },
  { targetSubject: "physical-quantity-si-unit--mass", targetPerformance: "APPLY", claimKey: "mass-si-unit", citedRangeExcerpt: "Mass", bipmValue: { unitName: "kilogram", symbol: "kg", bipmLocator: "Table 2, page 126", bipmExcerpt: "mass ... kilogram ... kg", confidence: "EXPLICIT" } },
  { targetSubject: "physical-quantity-si-unit--density", targetPerformance: "APPLY", claimKey: "density-si-unit", citedRangeExcerpt: "Density", bipmValue: { unitName: "kilogram per cubic metre", symbol: "kg/m³", bipmLocator: "Table 5, page 135", bipmExcerpt: "density, mass density ... kg m-3", confidence: "EXPLICIT" } },
  { targetSubject: "physical-quantity-si-unit--time", targetPerformance: "APPLY", claimKey: "time-si-unit", citedRangeExcerpt: "Time", bipmValue: { unitName: "second", symbol: "s", bipmLocator: "Table 2, page 126", bipmExcerpt: "time ... second ... s", confidence: "EXPLICIT" } },
  { targetSubject: "physical-quantity-si-unit--temperature", targetPerformance: "APPLY", claimKey: "temperature-si-unit", citedRangeExcerpt: "Temperature", bipmValue: { unitName: "kelvin", symbol: "K", bipmLocator: "Table 2, page 126", bipmExcerpt: "thermodynamic temperature ... kelvin ... K", confidence: "EXPLICIT" } },
  { targetSubject: "physical-quantity-si-unit--velocity", targetPerformance: "APPLY", claimKey: "velocity-si-unit", citedRangeExcerpt: "Velocity", bipmValue: { unitName: "metre per second", symbol: "m/s", bipmLocator: "Table 5, page 135", bipmExcerpt: "speed, velocity ... m s-1", confidence: "EXPLICIT" } },
];

const ELECTRICAL_FACTS: readonly FactSpec[] = [
  { targetSubject: "electrical-quantity-si-unit--resistance", targetPerformance: "DEFINE", claimKey: "resistance-si-unit", citedRangeExcerpt: "Resistance", bipmValue: { unitName: "ohm", symbol: "Ω", bipmLocator: "Table 4, page 133", bipmExcerpt: "electric resistance ... ohm ... Ω", confidence: "EXPLICIT" } },
  { targetSubject: "electrical-quantity-si-unit--resistivity", targetPerformance: "DEFINE", claimKey: "resistivity-si-unit", citedRangeExcerpt: "Resistivity" },
  { targetSubject: "electrical-quantity-si-unit--power", targetPerformance: "DEFINE", claimKey: "power-si-unit", citedRangeExcerpt: "Power", bipmValue: { unitName: "watt", symbol: "W", bipmLocator: "Table 4, page 133", bipmExcerpt: "power, radiant flux ... watt ... W", confidence: "EXPLICIT" } },
  { targetSubject: "electrical-quantity-si-unit--frequency", targetPerformance: "DEFINE", claimKey: "frequency-si-unit", citedRangeExcerpt: "Frequency", bipmValue: { unitName: "hertz", symbol: "Hz", bipmLocator: "Table 4, page 133", bipmExcerpt: "frequency ... hertz ... Hz", confidence: "EXPLICIT" } },
  { targetSubject: "electrical-quantity-si-unit--current", targetPerformance: "DEFINE", claimKey: "current-si-unit", citedRangeExcerpt: "Current", bipmValue: { unitName: "ampere", symbol: "A", bipmLocator: "Table 2, page 126", bipmExcerpt: "electric current ... ampere ... A", confidence: "EXPLICIT" } },
  { targetSubject: "electrical-quantity-si-unit--voltage", targetPerformance: "DEFINE", claimKey: "voltage-si-unit", citedRangeExcerpt: "Voltage", bipmValue: { unitName: "volt", symbol: "V", bipmLocator: "Table 4, page 133", bipmExcerpt: "electric potential difference ... volt ... V", confidence: "EXPLICIT" } },
  { targetSubject: "electrical-quantity-si-unit--energy", targetPerformance: "DEFINE", claimKey: "energy-si-unit", citedRangeExcerpt: "Energy", bipmValue: { unitName: "joule", symbol: "J", bipmLocator: "Table 4, page 133", bipmExcerpt: "energy, work, amount of heat ... joule ... J", confidence: "EXPLICIT" } },
  { targetSubject: "electrical-quantity-si-unit--impedance", targetPerformance: "DEFINE", claimKey: "impedance-si-unit", citedRangeExcerpt: "Impedance" },
  { targetSubject: "electrical-quantity-si-unit--inductance", targetPerformance: "DEFINE", claimKey: "inductance-si-unit", citedRangeExcerpt: "Inductance and inductive reactance (split; this claim covers the Inductance half)", bipmValue: { unitName: "henry", symbol: "H", bipmLocator: "Table 4, page 133", bipmExcerpt: "inductance ... henry ... H", confidence: "EXPLICIT" } },
  { targetSubject: "electrical-quantity-si-unit--inductive-reactance", targetPerformance: "DEFINE", claimKey: "inductive-reactance-si-unit", citedRangeExcerpt: "Inductance and inductive reactance (split; this claim covers the inductive-reactance half)" },
  { targetSubject: "electrical-quantity-si-unit--capacitance", targetPerformance: "DEFINE", claimKey: "capacitance-si-unit", citedRangeExcerpt: "Capacitance and capacitive reactance (split; this claim covers the Capacitance half)", bipmValue: { unitName: "farad", symbol: "F", bipmLocator: "Table 4, page 133", bipmExcerpt: "capacitance ... farad ... F", confidence: "EXPLICIT" } },
  { targetSubject: "electrical-quantity-si-unit--capacitive-reactance", targetPerformance: "DEFINE", claimKey: "capacitive-reactance-si-unit", citedRangeExcerpt: "Capacitance and capacitive reactance (split; this claim covers the capacitive-reactance half)" },
  {
    targetSubject: "electrical-quantity-si-unit--power-factor",
    targetPerformance: "DEFINE",
    claimKey: "power-factor-si-unit",
    citedRangeExcerpt: "Power factor",
    bipmValue: {
      unitName: "(none -- dimensionless ratio)",
      symbol: "1",
      bipmLocator: "section 2.3.3, page 132",
      bipmExcerpt: "quantities Q for which the defining equation is such that all of the dimensional exponents in the equation for the dimension of Q are zero ... are simply numbers. The associated unit is the unit one, symbol 1",
      confidence: "STRONG_INFERENCE",
    },
  },
];

function factAndClaim(f: FactSpec, acId: string): CC19AProposal[] {
  const a = acById(acId);
  const out: CC19AProposal[] = [];
  const targetKey = candidateKey(f.targetSubject, f.targetPerformance);
  const citedEvidenceId = curriculumEvidenceIdByCandidateKey.get(targetKey);
  if (!citedEvidenceId) {
    throw new Error(`cc19a-ledger-data: fact requirement for claimKey "${f.claimKey}" targets candidateKey "${targetKey}", which no CurriculumEvidence proposal produced -- fix the FactSpec's targetSubject/targetPerformance.`);
  }
  const factReqRecord = {
    qualificationId: QUAL_ID,
    targetCandidateKey: targetKey,
    claimKey: f.claimKey,
    derivationStatus: "EXPLICIT_CURRICULUM_FACT" as const,
    sourceEvidenceRefs: [{ role: "OFFICIAL_CURRICULUM", evidenceId: citedEvidenceId } satisfies EvidenceRef],
    sourceRef: HANDBOOK_REF,
    sourceLocator: `page ${a.page}, AC${a.lo}.${a.ac} Range`,
    normalizationBasis: "FACT_REQUIREMENT_DERIVATION" as const,
  };
  out.push({
    proposalId: `FACTREQ-${f.claimKey}`,
    evidenceRole: "OFFICIAL_CURRICULUM",
    layerA: {
      sourceId: SRC_HANDBOOK,
      sourceRef: HANDBOOK_REF,
      sourceLocator: `page ${a.page}, AC${a.lo}.${a.ac} ("${a.acWording}")`,
      sourceExcerpt: `AC${a.lo}.${a.ac}: "${a.acWording}". Range item: "${f.citedRangeExcerpt}".`,
      rawIdentifier: `LO${a.lo}.AC${a.ac} Range: ${f.citedRangeExcerpt}`,
    },
    layerB: {
      recordType: "CandidateFactRequirement",
      record: factReqRecord,
      normalizationConfidence: "EXPLICIT",
      normalizationRationale: `AC${a.lo}.${a.ac}'s own wording ("${a.acWording}") explicitly requires knowing the SI unit VALUE for each Range-named quantity, not merely that the quantity exists -- this is the "determine values of ... units" clause itself, satisfying task section 16's EXPLICIT_CURRICULUM_FACT bar (never AUTHORITATIVE_TECHNICAL_FACT, per the locked normalizationBasis rule).`,
      profileEligibility: BOTH,
    },
    layerC: { pipelineAcceptance: "NOT_RUN_CC19A" },
  });

  if (f.bipmValue) {
    out.push({
      proposalId: `CLAIM-${f.claimKey}`,
      evidenceRole: "TECHNICAL_TRUTH",
      layerA: {
        sourceId: SRC_BIPM,
        sourceRef: BIPM_REF,
        sourceLocator: f.bipmValue.bipmLocator,
        sourceExcerpt: f.bipmValue.bipmExcerpt,
        rawIdentifier: f.claimKey,
      },
      layerB: {
        recordType: "SourceFactualClaim",
        record: {
          claimKey: f.claimKey,
          subject: f.targetSubject,
          sourceRole: "TECHNICAL_TRUTH",
          evidenceId: `TRUTH-${f.claimKey}`,
          normalizedClaimValue: `${f.bipmValue.unitName} (${f.bipmValue.symbol})`,
          comparisonKind: "CANONICAL_TEXT",
          sourceRef: BIPM_REF,
          sourceLocator: f.bipmValue.bipmLocator,
          normalizationBasis: "AUTHORITATIVE_TECHNICAL_FACT",
        },
        normalizationConfidence: f.bipmValue.confidence,
        normalizationRationale:
          f.bipmValue.confidence === "EXPLICIT"
            ? `Attached ONLY after the CandidateFactRequirement above independently arose from AC${a.lo}.${a.ac}'s own wording (task section 17). BIPM Table names this exact quantity with this exact unit/symbol.`
            : `Attached ONLY after the CandidateFactRequirement above independently arose from AC${a.lo}.${a.ac}'s own wording. BIPM does not name "power factor" directly, but section 2.3.3's general principle for dimensionless-ratio quantities applies directly (power factor = real power / apparent power, a ratio of two quantities of the same kind) -- STRONG_INFERENCE, not EXPLICIT, since the quantity is not named verbatim.`,
        profileEligibility: BOTH,
      },
      layerC: { pipelineAcceptance: "NOT_RUN_CC19A" },
    });
  }
  return out;
}

export const factRequirementAndTechnicalTruthProposals: readonly CC19AProposal[] = [
  ...PHYSICAL_FACTS.flatMap((f) => factAndClaim(f, "U202-LO2-AC1")),
  ...ELECTRICAL_FACTS.flatMap((f) => factAndClaim(f, "U202-LO2-AC2")),
];

/** Fact requirements with no attached technical claim in this package -- honestly unattached, never fabricated. See CC-19A-NORMALIZATION-LEDGER.md's "Unresolved technical truth" section. */
export const unattachedFactClaimKeys: readonly string[] = ELECTRICAL_FACTS.filter((f) => !f.bipmValue).map((f) => f.claimKey);

export const allProposals: readonly CC19AProposal[] = [...officialCurriculumUnitProposals, ...curriculumEvidenceProposals, ...prerequisiteProposals, ...capabilityRequirementProposals, ...factRequirementAndTechnicalTruthProposals];
