import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import {
  buildOfficialCurriculumUnitIndex,
  buildStandardPipeline,
  compareAgainstDiagnosticEvidence,
  compareCalibrationFactualClaims,
  detectAssessmentPatternCandidates,
  generateAssessmentCandidates,
  generateCurriculumCandidates,
  hasValidProvenance,
  validateAssessmentEvidence,
  validateCurriculumEvidence,
  validateCurriculumFamilies,
  validateCurriculumSubjectRelations,
} from "./rules.ts";
import type {
  AssessmentEvidence,
  CandidateCapabilityRequirement,
  CandidateFactRequirement,
  CurriculumEvidence,
  CurriculumFamily,
  CurriculumSubjectRelation,
  LegacyDiagnosticEvidence,
  OfficialCurriculumUnit,
  OptionalCalibrationEvidence,
  PrerequisiteEvidence,
  QualificationLevelEvidence,
  SourceFactualClaim,
} from "./types.ts";
import type { StandardPipelineInput } from "./rules.ts";

/**
 * CC-18/CC-18A/CC-18B synthetic regression suite. Fixtures are
 * deliberately NOT drawn from Unit 202's governed matrix or corpus --
 * they exist only to mechanically prove the generic pipeline rules,
 * cases A-O (CC-18), P-AC (CC-18A), and AD-AZ (CC-18B), with topic
 * names chosen for readability, never as expected-answer authority for
 * any real qualification.
 */

let idCounter = 0;
function nextId(prefix: string): string {
  idCounter += 1;
  return `${prefix}-${idCounter}`;
}

const QUAL = "QUAL-SYNTH-1";
const OTHER_QUAL = "QUAL-SYNTH-2";

function curriculum(overrides: Partial<CurriculumEvidence> & Pick<CurriculumEvidence, "subject">): CurriculumEvidence {
  return {
    role: "OFFICIAL_CURRICULUM",
    evidenceId: nextId("curr"),
    qualificationId: QUAL,
    curriculumUnitId: "UNIT-X",
    normalizationKind: "PRIMARY_REQUIREMENT",
    sourceRef: "SRC-CURRICULUM-SPEC",
    sourceLocator: "spec-loc-1",
    normalizationBasis: "EXPLICIT_CURRICULUM_WORDING",
    ...overrides,
  };
}

function assessment(overrides: Partial<AssessmentEvidence> & Pick<AssessmentEvidence, "subject" | "performanceType">): AssessmentEvidence {
  return {
    role: "PUBLIC_ASSESSMENT",
    evidenceId: nextId("assess"),
    assessmentSource: "Sample Paper",
    itemId: nextId("Q"),
    qualificationId: QUAL,
    mappedCurriculumUnitId: "",
    questionStemRef: "stem reference",
    correctAnswerTarget: "correct answer target",
    sourceRef: "SRC-SAMPLE-ASSESSMENT",
    sourceLocator: "item-loc-1",
    normalizationBasis: "POSITIVE_ASSESSMENT_TARGET",
    ...overrides,
  };
}

function officialUnit(overrides: Partial<OfficialCurriculumUnit> & Pick<OfficialCurriculumUnit, "curriculumUnitId">): OfficialCurriculumUnit {
  return {
    qualificationId: QUAL,
    sourceRef: "SRC-SPEC",
    sourceLocator: "spec-loc",
    officialWording: "official wording",
    ...overrides,
  };
}

function subjectRelation(overrides: Partial<CurriculumSubjectRelation> & Pick<CurriculumSubjectRelation, "subject" | "underCategory">): CurriculumSubjectRelation {
  return { qualificationId: QUAL, sourceRef: "SRC-SPEC", sourceLocator: "spec-loc", normalizationBasis: "EXPLICIT_RANGE_STRUCTURE", ...overrides };
}

function family(overrides: Partial<CurriculumFamily> & Pick<CurriculumFamily, "familyKey" | "memberSubjects">): CurriculumFamily {
  return { qualificationId: QUAL, sourceRef: "SRC-SPEC", sourceLocator: "spec-loc", normalizationBasis: "EXPLICIT_RANGE_STRUCTURE", ...overrides };
}

function factualClaim(overrides: Partial<SourceFactualClaim> & Pick<SourceFactualClaim, "claimKey" | "subject" | "sourceRole" | "normalizedClaimValue">): SourceFactualClaim {
  return {
    evidenceId: nextId("claim"),
    comparisonKind: "CANONICAL_TEXT",
    sourceRef: overrides.sourceRole === "TECHNICAL_TRUTH" ? "SRC-TECHNICAL" : "SRC-CURRICULUM-PROVIDER",
    sourceLocator: "claim-loc",
    normalizationBasis: overrides.sourceRole === "TECHNICAL_TRUTH" ? "AUTHORITATIVE_TECHNICAL_FACT" : "SOURCE_FACTUAL_CLAIM",
    ...overrides,
  };
}

function capabilityRequirement(
  overrides: Partial<CandidateCapabilityRequirement> & Pick<CandidateCapabilityRequirement, "targetSubject" | "targetCandidateKey" | "capabilityKey" | "derivationKind">,
): CandidateCapabilityRequirement {
  return {
    qualificationId: QUAL,
    sourceRef: "SRC-DEPENDENCY",
    sourceLocator: "dep-loc",
    normalizationBasis: "CAPABILITY_DEPENDENCY_DERIVATION",
    sourceEvidenceRefs: [],
    ...overrides,
  };
}

function factRequirement(overrides: Partial<CandidateFactRequirement> & Pick<CandidateFactRequirement, "targetCandidateKey" | "claimKey">): CandidateFactRequirement {
  return { sourceRef: "SRC-SPEC", sourceLocator: "spec-loc", normalizationBasis: "EXPLICIT_CURRICULUM_WORDING", ...overrides };
}

function pipeline(overrides: Partial<StandardPipelineInput> = {}): StandardPipelineInput {
  return { qualificationId: QUAL, officialCurriculumUnits: [], curriculum: [], assessment: [], ...overrides };
}

function findCandidate(result: ReturnType<typeof buildStandardPipeline>, subject: string, performanceType?: string) {
  return result.candidates.find((c) => c.subject === subject && (performanceType === undefined || c.performanceType === performanceType));
}

// =====================================================================
// CC-18 cases A-O (retained, amended for CC-18A/CC-18B's registry,
// normalization-kind, and fact-key requirements).
// =====================================================================

describe("CC-18/CC-18B case A -- primary requirement + explicit Range members ALL survive as their own candidates", () => {
  const units: OfficialCurriculumUnit[] = [officialUnit({ curriculumUnitId: "AC-MECH-1" })];
  const curriculumEvidence: CurriculumEvidence[] = [
    curriculum({ subject: "levers", curriculumUnitId: "AC-MECH-1", normalizationKind: "PRIMARY_REQUIREMENT", commandVerbPerformanceType: "EXPLAIN" }),
    curriculum({ subject: "gears", curriculumUnitId: "AC-MECH-1", normalizationKind: "PRIMARY_REQUIREMENT", commandVerbPerformanceType: "EXPLAIN" }),
    curriculum({ subject: "pulleys", curriculumUnitId: "AC-MECH-1", normalizationKind: "PRIMARY_REQUIREMENT", commandVerbPerformanceType: "EXPLAIN" }),
    curriculum({ subject: "lever-class-i", curriculumUnitId: "AC-MECH-1", normalizationKind: "RANGE_REQUIRED_MEMBER", refinesSubject: "levers" }),
    curriculum({ subject: "lever-class-ii", curriculumUnitId: "AC-MECH-1", normalizationKind: "RANGE_REQUIRED_MEMBER", refinesSubject: "levers" }),
    curriculum({ subject: "lever-class-iii", curriculumUnitId: "AC-MECH-1", normalizationKind: "RANGE_REQUIRED_MEMBER", refinesSubject: "levers" }),
  ];
  const result = buildStandardPipeline(pipeline({ officialCurriculumUnits: units, curriculum: curriculumEvidence }));

  it("retains levers, gears AND pulleys as REQUIRED_EXPLICIT_CURRICULUM", () => {
    for (const subject of ["levers", "gears", "pulleys"]) {
      const c = findCandidate(result, subject);
      expect(c, `expected a candidate for "${subject}"`).toBeDefined();
      expect(c!.disposition).toBe("REQUIRED_EXPLICIT_CURRICULUM");
      expect(c!.confidence.scopeConfidence).toBe("HIGH");
    }
  });

  it("[CC-18B correction] each explicit Range member ALSO survives as its own required candidate, with the parent relationship preserved", () => {
    for (const member of ["lever-class-i", "lever-class-ii", "lever-class-iii"]) {
      const c = findCandidate(result, member);
      expect(c, `expected a candidate for Range member "${member}"`).toBeDefined();
      expect(c!.disposition).toBe("REQUIRED_EXPLICIT_CURRICULUM");
      expect(c!.parentSubject).toBe("levers");
    }
  });

  it("levers itself gains depth confidence from having Range members; gears/pulleys (no members) do not", () => {
    expect(findCandidate(result, "levers")!.confidence.depthConfidence).toBe("NONE"); // members are their own candidates, not DEPTH_QUALIFIERs
    expect(findCandidate(result, "gears")!.confidence.depthConfidence).toBe("NONE");
  });
});

describe("CC-18 case B -- a bare RANGE_CATEGORY, no internals invented", () => {
  const units: OfficialCurriculumUnit[] = [officialUnit({ curriculumUnitId: "AC-ELEC-6" })];
  const result = buildStandardPipeline(pipeline({ officialCurriculumUnits: units, curriculum: [curriculum({ subject: "telephones", curriculumUnitId: "AC-ELEC-6", normalizationKind: "RANGE_CATEGORY" })] }));

  it("retains the category itself", () => {
    const c = findCandidate(result, "telephones");
    expect(c!.disposition).toBe("REQUIRED_EXPLICIT_CURRICULUM");
    expect(c!.confidence.scopeConfidence).toBe("HIGH");
  });

  it("invents no internal implementation-detail candidates", () => {
    for (const s of ["telephone-capacitor-role", "telephone-resistor-role", "hook-switch"]) expect(findCandidate(result, s)).toBeUndefined();
    expect(result.candidates.length).toBe(2); // category + its default UNKNOWN-breadth review record
  });
});

describe("CC-18/CC-18A cases C/P -- public assessment generates a brand-new candidate ONLY when validly mapped to a real official curriculum unit", () => {
  const units: OfficialCurriculumUnit[] = [officialUnit({ curriculumUnitId: "AC-MAG-1" })];
  const item = assessment({ subject: "solenoid-polarity", performanceType: "IDENTIFY", mappedCurriculumUnitId: "AC-MAG-1", questionStemRef: "Identify the South pole of this solenoid." });
  const result = buildStandardPipeline(pipeline({ officialCurriculumUnits: units, assessment: [item] }));

  it("generates a solenoid-polarity candidate even with zero prior curriculum evidence", () => {
    const c = findCandidate(result, "solenoid-polarity", "IDENTIFY");
    expect(c!.disposition).toBe("REQUIRED_ASSESSMENT_EVIDENCED");
    expect(c!.confidence.scopeConfidence).toBe("HIGH");
    expect(c!.confidence.depthConfidence).toBe("HIGH");
  });

  it("emits no ASSESSMENT_MAPPING_REVIEW for a validly mapped item", () => {
    expect(result.gaps.some((g) => g.gapType === "ASSESSMENT_MAPPING_REVIEW")).toBe(false);
  });
});

describe("CC-18A case Q -- an assessment item mapped to a fabricated/non-existent curriculum unit never becomes required scope", () => {
  const units: OfficialCurriculumUnit[] = [officialUnit({ curriculumUnitId: "AC-MAG-1" })];
  const item = assessment({ subject: "solenoid-polarity", performanceType: "IDENTIFY", mappedCurriculumUnitId: "AC-DOES-NOT-EXIST" });
  const result = buildStandardPipeline(pipeline({ officialCurriculumUnits: units, assessment: [item] }));

  it("creates no required candidate", () => {
    expect(result.candidates).toEqual([]);
  });

  it("emits an ASSESSMENT_MAPPING_REVIEW gap preserving the attempted mapping", () => {
    const gap = result.gaps.find((g) => g.gapType === "ASSESSMENT_MAPPING_REVIEW");
    expect(gap!.evidenceAvailable.some((e) => e.includes("AC-DOES-NOT-EXIST"))).toBe(true);
  });

  it("a bare non-empty mappedCurriculumUnitId is NOT treated as valid merely for being non-empty (empty registry)", () => {
    const r = buildStandardPipeline(pipeline({ officialCurriculumUnits: [], assessment: [item] }));
    expect(r.candidates).toEqual([]);
  });
});

describe("CC-18A case R -- an assessment item mapped to a real unit belonging to a DIFFERENT qualification never becomes required scope", () => {
  const units: OfficialCurriculumUnit[] = [officialUnit({ curriculumUnitId: "AC-MAG-1", qualificationId: OTHER_QUAL })];
  const item = assessment({ subject: "solenoid-polarity", performanceType: "IDENTIFY", mappedCurriculumUnitId: "AC-MAG-1", qualificationId: QUAL });
  const result = buildStandardPipeline(pipeline({ officialCurriculumUnits: units, assessment: [item] }));

  it("creates no required candidate even though the unit id itself is real", () => {
    expect(result.candidates).toEqual([]);
  });

  it("emits ASSESSMENT_MAPPING_REVIEW", () => {
    expect(result.gaps.some((g) => g.gapType === "ASSESSMENT_MAPPING_REVIEW")).toBe(true);
  });
});

describe("CC-18 case D -- a distractor-only subject never generates a candidate", () => {
  const units: OfficialCurriculumUnit[] = [officialUnit({ curriculumUnitId: "AC-ELEC-6" })];
  const item = assessment({ subject: "transistor-switching-role", performanceType: "COMPONENT_ROLE", mappedCurriculumUnitId: "AC-ELEC-6", distractorSubjects: ["relay", "contactor", "thermistor"] });
  const result = buildStandardPipeline(pipeline({ officialCurriculumUnits: units, assessment: [item] }));

  it("creates the positive-target candidate only", () => {
    expect(findCandidate(result, "transistor-switching-role")).toBeDefined();
    for (const s of ["relay", "contactor", "thermistor"]) expect(findCandidate(result, s)).toBeUndefined();
    expect(result.candidates.length).toBe(1);
  });
});

describe("CC-18/CC-18B case E -- a technical-truth claim for a subject with no candidate at all stays entirely unmatched", () => {
  const claims: SourceFactualClaim[] = [
    factualClaim({ claimKey: "relay-principle", subject: "relay", sourceRole: "TECHNICAL_TRUTH", normalizedClaimValue: "A relay uses an electromagnet to operate a mechanically separate switch contact." }),
    factualClaim({ claimKey: "contactor-principle", subject: "contactor", sourceRole: "TECHNICAL_TRUTH", normalizedClaimValue: "A contactor is a heavier-duty relay variant." }),
  ];
  const result = buildStandardPipeline(pipeline({ factualClaims: claims }));

  it("creates no candidate for relay or contactor", () => {
    expect(result.candidates.length).toBe(0);
  });

  it("still records the factual evidence as unmatched", () => {
    expect([...result.unmatchedTechnicalTruth.map((e) => e.subject)].sort()).toEqual(["contactor", "relay"]);
  });
});

describe("CC-18/CC-18B case F -- broad RANGE_CATEGORY with one directly-evidenced, GOVERNED sub-item produces a breadth gap regardless", () => {
  const units: OfficialCurriculumUnit[] = [officialUnit({ curriculumUnitId: "AC-MATH-1" })];
  const curriculumEvidence: CurriculumEvidence[] = [curriculum({ subject: "statistics", curriculumUnitId: "AC-MATH-1", normalizationKind: "RANGE_CATEGORY", breadthStatus: "OPEN_OR_UNDERSPECIFIED" })];
  const item = assessment({ subject: "statistics-mean", performanceType: "CALCULATE", mappedCurriculumUnitId: "AC-MATH-1", underCategory: "statistics" });
  const relations: CurriculumSubjectRelation[] = [subjectRelation({ subject: "statistics-mean", underCategory: "statistics" })];
  const result = buildStandardPipeline(pipeline({ officialCurriculumUnits: units, curriculum: curriculumEvidence, assessment: [item], subjectRelations: relations }));

  it("retains the Statistics category and directly evidences mean as its own candidate", () => {
    expect(findCandidate(result, "statistics")!.disposition).toBe("REQUIRED_EXPLICIT_CURRICULUM");
    expect(findCandidate(result, "statistics-mean", "CALCULATE")!.disposition).toBe("REQUIRED_ASSESSMENT_EVIDENCED");
  });

  it("records the unresolved breadth as an OPEN_SCOPE_GAP candidate and SCOPE_BREADTH_GAP naming the governed sub-item", () => {
    const gapCandidate = result.candidates.find((c) => c.disposition === "OPEN_SCOPE_GAP");
    expect(gapCandidate!.candidateKey).toBe("statistics::unresolved-breadth");
    const gapRecord = result.gaps.find((g) => g.gapType === "SCOPE_BREADTH_GAP");
    expect(gapRecord!.evidenceAvailable).toEqual(["statistics-mean"]);
    expect(gapRecord!.legitimateResolverRoles).toEqual(["OFFICIAL_CURRICULUM", "PUBLIC_ASSESSMENT"]);
  });

  it("never silently promotes median/mode/range", () => {
    for (const s of ["statistics-median", "statistics-mode", "statistics-range"]) expect(findCandidate(result, s)).toBeUndefined();
  });
});

describe("CC-18 case G -- an AC's own verb never silently creates a different performance type; distinct performances stay distinct", () => {
  const units: OfficialCurriculumUnit[] = [officialUnit({ curriculumUnitId: "AC-ELEC-6.2" })];
  const curriculumEvidence: CurriculumEvidence[] = [curriculum({ subject: "component-x", curriculumUnitId: "AC-ELEC-6.2", commandVerbPerformanceType: "STATE" })];
  const item = assessment({ subject: "component-x", performanceType: "SCHEMATIC_RECOGNITION", mappedCurriculumUnitId: "AC-ELEC-6.2" });
  const result = buildStandardPipeline(pipeline({ officialCurriculumUnits: units, curriculum: curriculumEvidence, assessment: [item] }));

  it("keeps STATE and SCHEMATIC_RECOGNITION as two separate candidates", () => {
    const statePrinciple = findCandidate(result, "component-x", "STATE");
    const symbolRecognition = findCandidate(result, "component-x", "SCHEMATIC_RECOGNITION");
    expect(statePrinciple!.candidateKey).not.toBe(symbolRecognition!.candidateKey);
    expect(statePrinciple!.disposition).toBe("REQUIRED_EXPLICIT_CURRICULUM");
    expect(symbolRecognition!.disposition).toBe("REQUIRED_ASSESSMENT_EVIDENCED");
    expect(result.candidates.filter((c) => c.subject === "component-x").length).toBe(2);
  });
});

// Curriculum evidence establishing family members as KNOWN curriculum subjects
// (CC-18B section 20 requires this for a CurriculumFamily to validate at all).
const COMPONENT_FAMILY_UNITS: OfficialCurriculumUnit[] = [officialUnit({ curriculumUnitId: "AC-ELEC-6.2" })];
function componentFamilyCurriculum(): CurriculumEvidence[] {
  return [
    curriculum({ subject: "capacitor", curriculumUnitId: "AC-ELEC-6.2", normalizationKind: "RANGE_CATEGORY" }),
    curriculum({ subject: "diode", curriculumUnitId: "AC-ELEC-6.2", normalizationKind: "RANGE_CATEGORY" }),
    curriculum({ subject: "resistor", curriculumUnitId: "AC-ELEC-6.2", normalizationKind: "RANGE_CATEGORY" }),
  ];
}

describe("CC-18 case H -- one symbol question never generalises across an entire component family", () => {
  const item = assessment({ subject: "capacitor", performanceType: "SCHEMATIC_RECOGNITION", familyKey: "component-symbols", mappedCurriculumUnitId: "AC-ELEC-6.2" });
  const families: CurriculumFamily[] = [family({ familyKey: "component-symbols", memberSubjects: ["capacitor", "diode", "resistor"] })];
  const result = buildStandardPipeline(pipeline({ officialCurriculumUnits: COMPONENT_FAMILY_UNITS, curriculum: componentFamilyCurriculum(), assessment: [item], families }));

  it("produces no family-wide pattern candidate from a single tested member", () => {
    expect(result.candidates.some((c) => c.assessmentPattern !== undefined)).toBe(false);
  });
});

describe("CC-18/CC-18A case I -- repeated evidence across GOVERNED, distinct family members creates a reviewable pattern candidate", () => {
  const items: AssessmentEvidence[] = [
    assessment({ subject: "capacitor", performanceType: "SCHEMATIC_RECOGNITION", familyKey: "component-symbols", mappedCurriculumUnitId: "AC-ELEC-6.2" }),
    assessment({ subject: "diode", performanceType: "SCHEMATIC_RECOGNITION", familyKey: "component-symbols", mappedCurriculumUnitId: "AC-ELEC-6.2" }),
  ];
  const families: CurriculumFamily[] = [family({ familyKey: "component-symbols", memberSubjects: ["capacitor", "diode", "resistor"] })];
  const result = buildStandardPipeline(pipeline({ officialCurriculumUnits: COMPONENT_FAMILY_UNITS, curriculum: componentFamilyCurriculum(), assessment: items, families }));

  it("creates an ASSESSMENT_PATTERN_CANDIDATE, disposition REVIEW_REQUIRED, spanning the two tested members", () => {
    const pattern = result.candidates.find((c) => c.assessmentPattern !== undefined);
    expect(pattern!.disposition).toBe("REVIEW_REQUIRED");
    expect([...pattern!.assessmentPattern!.evidencedMembers].sort()).toEqual(["capacitor", "diode"]);
    expect(result.gaps.some((g) => g.gapType === "ASSESSMENT_GENERALISATION_REVIEW")).toBe(true);
  });

  it("never promotes the untested, governed family member (resistor) via the pattern mechanism", () => {
    const resistorCandidates = result.candidates.filter((c) => c.subject === "resistor");
    expect(resistorCandidates.every((c) => c.disposition !== "REVIEW_REQUIRED" || c.assessmentPattern === undefined)).toBe(true);
  });
});

describe("CC-18J/K -- private worksheet and legacy assertion claims are ignored by the standard pipeline", () => {
  const units: OfficialCurriculumUnit[] = [officialUnit({ curriculumUnitId: "AC-ELEC-6" })];
  const curriculumEvidence: CurriculumEvidence[] = [curriculum({ subject: "telephones", curriculumUnitId: "AC-ELEC-6", normalizationKind: "RANGE_CATEGORY" })];
  const calibration: OptionalCalibrationEvidence[] = [{ role: "OPTIONAL_CALIBRATION", evidenceId: "priv-1", subject: "telephone-capacitor-role", claim: "The private worksheet states the telephone capacitor is used for ringing." }];
  const legacy: LegacyDiagnosticEvidence[] = [{ role: "LEGACY_DIAGNOSTIC", evidenceId: "legacy-1", subject: "telephone-resistor-role", claim: "Existing lesson content asserts the telephone resistor is used for remote line testing." }];
  const result = buildStandardPipeline(pipeline({ officialCurriculumUnits: units, curriculum: curriculumEvidence }));

  it("the standard pipeline never sees calibration/legacy evidence", () => {
    expect(findCandidate(result, "telephone-capacitor-role")).toBeUndefined();
    expect(findCandidate(result, "telephone-resistor-role")).toBeUndefined();
  });

  it("a read-only diagnostic comparison records both claims without creating a candidate", () => {
    const comparison = compareAgainstDiagnosticEvidence(result.candidates, calibration, legacy);
    expect(comparison.every((e) => e.matchesExistingCandidate === false)).toBe(true);
  });

  it("[hard mechanical test] routing calibration/legacy evidence into the standard pipeline's own input is rejected", () => {
    const tampered1 = { qualificationId: QUAL, curriculum: [...curriculumEvidence, calibration[0]!], assessment: [], officialCurriculumUnits: units } as unknown as StandardPipelineInput;
    expect(() => buildStandardPipeline(tampered1)).toThrow(/OPTIONAL_CALIBRATION and LEGACY_DIAGNOSTIC evidence must never be passed/);
    const tampered2 = { qualificationId: QUAL, curriculum: [...curriculumEvidence, legacy[0]!], assessment: [], officialCurriculumUnits: units } as unknown as StandardPipelineInput;
    expect(() => buildStandardPipeline(tampered2)).toThrow(/OPTIONAL_CALIBRATION and LEGACY_DIAGNOSTIC evidence must never be passed/);
  });
});

describe("CC-18B cases L/X -- curriculum/provider vs technical factual claims are independent records; conflict is DETECTED, never pre-labelled", () => {
  const units: OfficialCurriculumUnit[] = [officialUnit({ curriculumUnitId: "AC-MECH-1" })];
  const curriculumEvidence: CurriculumEvidence[] = [curriculum({ subject: "gears", curriculumUnitId: "AC-MECH-1", commandVerbPerformanceType: "EXPLAIN" })];
  const gearsKey = generateCurriculumCandidates(curriculumEvidence)[0]!.candidateKey;
  const claims: SourceFactualClaim[] = [
    factualClaim({ claimKey: "gearing-power-conservation", subject: "gears", sourceRole: "OFFICIAL_CURRICULUM", normalizedClaimValue: "gearing creates additional power", comparisonKind: "CANONICAL_TEXT" }),
    factualClaim({ claimKey: "gearing-power-conservation", subject: "gears", sourceRole: "TECHNICAL_TRUTH", normalizedClaimValue: "ideal gearing does not create power; speed and torque trade", comparisonKind: "CANONICAL_TEXT" }),
  ];
  const factReqs: CandidateFactRequirement[] = [factRequirement({ targetCandidateKey: gearsKey, claimKey: "gearing-power-conservation" })];
  const result = buildStandardPipeline(pipeline({ officialCurriculumUnits: units, curriculum: curriculumEvidence, factRequirements: factReqs, factualClaims: claims }));

  it("retains gears as required scope", () => {
    expect(findCandidate(result, "gears")!.disposition).toBe("REQUIRED_EXPLICIT_CURRICULUM");
  });

  it("attaches the CORRECT technical statement under its claimKey, never the erroneous curriculum/provider claim", () => {
    const c = findCandidate(result, "gears")!;
    expect(c.factualStatementsByClaimKey?.["gearing-power-conservation"]).toBe("ideal gearing does not create power; speed and torque trade");
    expect(c.technicalCoverageStatus).toBe("COMPLETE");
  });

  it("emits a CURRICULUM_TECHNICAL_CONFLICT purely from comparing the two independent claims by claimKey", () => {
    const conflict = result.gaps.find((g) => g.gapType === "CURRICULUM_TECHNICAL_CONFLICT");
    expect(conflict!.legitimateResolverRoles).toEqual(["TECHNICAL_TRUTH"]);
    expect(conflict!.evidenceAvailable.join(" ")).toMatch(/creates additional power/);
  });

  it("two claims that AGREE on the same claimKey never produce a conflict", () => {
    const agreeing: SourceFactualClaim[] = [
      factualClaim({ claimKey: "gearing-power-conservation", subject: "gears", sourceRole: "OFFICIAL_CURRICULUM", normalizedClaimValue: "ideal gearing does not create power; speed and torque trade" }),
      factualClaim({ claimKey: "gearing-power-conservation", subject: "gears", sourceRole: "TECHNICAL_TRUTH", normalizedClaimValue: "ideal gearing does not create power; speed and torque trade" }),
    ];
    const r = buildStandardPipeline(pipeline({ officialCurriculumUnits: units, curriculum: curriculumEvidence, factRequirements: factReqs, factualClaims: agreeing }));
    expect(r.gaps.some((g) => g.gapType === "CURRICULUM_TECHNICAL_CONFLICT")).toBe(false);
  });
});

describe("CC-18A case M -- malformed curriculum unit corrected by independent technical claim", () => {
  const units: OfficialCurriculumUnit[] = [officialUnit({ curriculumUnitId: "AC-ELEC-4.3" })];
  const curriculumEvidence: CurriculumEvidence[] = [curriculum({ subject: "resistivity", curriculumUnitId: "AC-ELEC-4.3", commandVerbPerformanceType: "DESCRIBE" })];
  const resistivityKey = generateCurriculumCandidates(curriculumEvidence)[0]!.candidateKey;
  const claims: SourceFactualClaim[] = [
    factualClaim({ claimKey: "resistivity-unit", subject: "resistivity", sourceRole: "OFFICIAL_CURRICULUM", normalizedClaimValue: "ohms per metre" }),
    factualClaim({ claimKey: "resistivity-unit", subject: "resistivity", sourceRole: "TECHNICAL_TRUTH", normalizedClaimValue: "ohm-metres (Ω·m)" }),
  ];
  const factReqs: CandidateFactRequirement[] = [factRequirement({ targetCandidateKey: resistivityKey, claimKey: "resistivity-unit" })];
  const result = buildStandardPipeline(pipeline({ officialCurriculumUnits: units, curriculum: curriculumEvidence, factRequirements: factReqs, factualClaims: claims }));

  it("retains the correct unit as the taught fact and emits a conflict", () => {
    expect(findCandidate(result, "resistivity")!.factualStatementsByClaimKey?.["resistivity-unit"]).toBe("ohm-metres (Ω·m)");
    expect(result.gaps.some((g) => g.gapType === "CURRICULUM_TECHNICAL_CONFLICT")).toBe(true);
  });
});

describe("CC-18 case N -- an explicit curriculum topic untested by any sample question remains required", () => {
  const units: OfficialCurriculumUnit[] = [officialUnit({ curriculumUnitId: "AC-X" })];
  const curriculumEvidence: CurriculumEvidence[] = [curriculum({ subject: "topic-never-sampled", curriculumUnitId: "AC-X", commandVerbPerformanceType: "DESCRIBE" })];
  const result = buildStandardPipeline(pipeline({ officialCurriculumUnits: units, curriculum: curriculumEvidence }));

  it("remains a REQUIRED_EXPLICIT_CURRICULUM candidate despite zero assessment evidence", () => {
    const c = findCandidate(result, "topic-never-sampled");
    expect(c!.disposition).toBe("REQUIRED_EXPLICIT_CURRICULUM");
    expect(c!.confidence.scopeConfidence).toBe("HIGH");
  });

  it("absence of assessment coverage produces a depth gap, never a scope removal", () => {
    expect(result.gaps.some((g) => g.gapType === "PERFORMANCE_DEPTH_GAP")).toBe(true);
  });
});

describe("CC-18/CC-18B case O -- an interesting adjacent technical topic never becomes curriculum scope", () => {
  const claims: SourceFactualClaim[] = [factualClaim({ claimKey: "adjacent", subject: "adjacent-interesting-topic", sourceRole: "TECHNICAL_TRUTH", normalizedClaimValue: "A true and interesting fact about a related but never-required topic." })];
  const result = buildStandardPipeline(pipeline({ factualClaims: claims }));

  it("creates no candidate for the adjacent topic and records it as unmatched", () => {
    expect(result.candidates).toEqual([]);
    expect(result.unmatchedTechnicalTruth).toHaveLength(1);
  });
});

// =====================================================================
// CC-18A cases S-AC.
// =====================================================================

describe("CC-18A case S -- an ungoverned underCategory label never drives scope-breadth conclusions", () => {
  const units: OfficialCurriculumUnit[] = [officialUnit({ curriculumUnitId: "AC-MATH-1" })];
  const curriculumEvidence: CurriculumEvidence[] = [curriculum({ subject: "statistics", curriculumUnitId: "AC-MATH-1", normalizationKind: "RANGE_CATEGORY", breadthStatus: "OPEN_OR_UNDERSPECIFIED" })];
  const item = assessment({ subject: "statistics-mean", performanceType: "CALCULATE", mappedCurriculumUnitId: "AC-MATH-1", underCategory: "statistics" });
  const result = buildStandardPipeline(pipeline({ officialCurriculumUnits: units, curriculum: curriculumEvidence, assessment: [item], subjectRelations: [] }));

  it("the breadth gap still fires but lists no evidenced sub-item, since the relation is ungoverned", () => {
    const gapRecord = result.gaps.find((g) => g.gapType === "SCOPE_BREADTH_GAP");
    expect(gapRecord!.evidenceAvailable).toEqual([]);
  });

  it("statistics-mean is still independently REQUIRED_ASSESSMENT_EVIDENCED on its own positive-target merits", () => {
    expect(findCandidate(result, "statistics-mean", "CALCULATE")!.disposition).toBe("REQUIRED_ASSESSMENT_EVIDENCED");
  });
});

describe("CC-18A case T -- an ungoverned familyKey never produces assessment-family generalisation", () => {
  const items: AssessmentEvidence[] = [
    assessment({ subject: "capacitor", performanceType: "SCHEMATIC_RECOGNITION", familyKey: "not-a-governed-family", mappedCurriculumUnitId: "AC-ELEC-6.2" }),
    assessment({ subject: "diode", performanceType: "SCHEMATIC_RECOGNITION", familyKey: "not-a-governed-family", mappedCurriculumUnitId: "AC-ELEC-6.2" }),
  ];
  const { validated } = validateAssessmentEvidence(items, QUAL, buildOfficialCurriculumUnitIndex(COMPONENT_FAMILY_UNITS).index);

  it("produces no pattern candidate despite two distinct members sharing the label, when no family is governed at all", () => {
    const { candidates } = detectAssessmentPatternCandidates(validated, []);
    expect(candidates).toEqual([]);
  });

  it("also produces none when a family IS governed but does not list these members", () => {
    const unrelatedFamily: CurriculumFamily[] = [family({ familyKey: "not-a-governed-family", memberSubjects: ["some-other-subject"] })];
    const { candidates } = detectAssessmentPatternCandidates(validated, unrelatedFamily);
    expect(candidates).toEqual([]);
  });
});

describe("CC-18A case U -- qualification-level evidence constrains depth but never creates scope", () => {
  const units: OfficialCurriculumUnit[] = [officialUnit({ curriculumUnitId: "AC-X" })];
  const curriculumEvidence: CurriculumEvidence[] = [curriculum({ subject: "explicit-topic", curriculumUnitId: "AC-X", commandVerbPerformanceType: "CALCULATE" })];
  const targetKey = generateCurriculumCandidates(curriculumEvidence)[0]!.candidateKey;
  const levelEvidence: QualificationLevelEvidence[] = [
    { role: "QUALIFICATION_LEVEL", evidenceId: "level-1", qualificationId: QUAL, levelId: "LEVEL-2", sourceRef: "SRC-FRAMEWORK", sourceLocator: "framework-loc", normalizationBasis: "QUALIFICATION_LEVEL_DESCRIPTOR", depthConstraintDescriptor: "Single-step calculation only.", appliesToCandidateKey: targetKey },
    { role: "QUALIFICATION_LEVEL", evidenceId: "level-2", qualificationId: QUAL, levelId: "LEVEL-2", sourceRef: "SRC-FRAMEWORK", sourceLocator: "framework-loc-2", normalizationBasis: "QUALIFICATION_LEVEL_DESCRIPTOR", depthConstraintDescriptor: "Constrains an unmatched key.", appliesToCandidateKey: "no-such-candidate::OTHER" },
  ];
  const result = buildStandardPipeline(pipeline({ officialCurriculumUnits: units, curriculum: curriculumEvidence, qualificationLevel: levelEvidence }));

  it("attaches the depth constraint to the existing candidate it names, without changing its disposition", () => {
    const c = findCandidate(result, "explicit-topic")!;
    expect(c.qualificationLevelRefs?.length).toBe(1);
    expect(c.depthConstraintNote).toMatch(/Single-step calculation only/);
    expect(c.disposition).toBe("REQUIRED_EXPLICIT_CURRICULUM");
  });

  it("creates no new candidate for an unmatched key -- recorded as unmatched instead", () => {
    expect(result.candidates.some((c) => c.candidateKey === "no-such-candidate::OTHER")).toBe(false);
    expect(result.unmatchedQualificationLevel).toHaveLength(1);
  });

  it("qualification-level evidence alone, with no curriculum/assessment evidence, creates zero candidates", () => {
    const r = buildStandardPipeline(pipeline({ qualificationLevel: levelEvidence }));
    expect(r.candidates).toEqual([]);
  });
});

describe("CC-18B cases V/W/AO/AP/AQ -- capability dependency is an independent relation; only certain derivationKinds auto-promote", () => {
  const units: OfficialCurriculumUnit[] = [officialUnit({ curriculumUnitId: "AC-X" })];
  const curriculumEvidence: CurriculumEvidence[] = [
    curriculum({ subject: "explicit-calculation", curriculumUnitId: "AC-X", commandVerbPerformanceType: "CALCULATE" }),
    curriculum({ subject: "diode-operation", curriculumUnitId: "AC-X", commandVerbPerformanceType: "STATE" }),
  ];
  const baseCandidates = generateCurriculumCandidates(curriculumEvidence);
  const calculationKey = baseCandidates.find((c) => c.subject === "explicit-calculation")!.candidateKey;
  const diodeKey = baseCandidates.find((c) => c.subject === "diode-operation")!.candidateKey;

  const validAssessmentItem = assessment({ subject: "assessment-derived-op", performanceType: "PROCEDURE", mappedCurriculumUnitId: "AC-X", evidenceId: "assess-valid-op" });
  const invalidAssessmentItem = assessment({ subject: "assessment-derived-op-2", performanceType: "PROCEDURE", mappedCurriculumUnitId: "AC-FAKE", evidenceId: "assess-invalid-op" });

  const capabilityRequirements: CandidateCapabilityRequirement[] = [
    // W/AQ: EXPLICIT_CURRICULUM_OPERATION -- structurally derived, auto-promotable.
    capabilityRequirement({ targetSubject: "explicit-calculation", targetCandidateKey: calculationKey, capabilityKey: "formula-transposition", derivationKind: "EXPLICIT_CURRICULUM_OPERATION" }),
    // V/AO: REVIEW_PROPOSED -- never auto-promotes, even with a real target.
    capabilityRequirement({ targetSubject: "diode-operation", targetCandidateKey: diodeKey, capabilityKey: "semiconductor-band-theory", derivationKind: "REVIEW_PROPOSED" }),
  ];

  const prerequisites: PrerequisiteEvidence[] = [
    { kind: "STRUCTURAL_PREREQUISITE_DEPENDENCY", evidenceId: "prereq-w", subject: "formula-transposition", performanceType: "PROCEDURE", capabilityKey: "formula-transposition", necessaryForCandidateKey: calculationKey, minimalDepthJustification: "cannot rearrange without it", sourceRef: "SRC-DEP", sourceLocator: "l1", normalizationBasis: "STRUCTURAL_PREREQUISITE_DEPENDENCY" },
    { kind: "STRUCTURAL_PREREQUISITE_DEPENDENCY", evidenceId: "prereq-v", subject: "semiconductor-band-theory", performanceType: "EXPLAIN", capabilityKey: "semiconductor-band-theory", necessaryForCandidateKey: diodeKey, minimalDepthJustification: "claimed but not structurally backed", sourceRef: "SRC-DEP", sourceLocator: "l2", normalizationBasis: "STRUCTURAL_PREREQUISITE_DEPENDENCY" },
  ];

  const result = buildStandardPipeline(pipeline({ officialCurriculumUnits: units, curriculum: curriculumEvidence, prerequisites, capabilityRequirements }));

  it("[W/AQ] promotes a prerequisite to FOUNDATIONAL_PREREQUISITE when derivationKind is EXPLICIT_CURRICULUM_OPERATION", () => {
    expect(findCandidate(result, "formula-transposition")!.disposition).toBe("FOUNDATIONAL_PREREQUISITE");
  });

  it("[V/AO] REVIEW_PROPOSED never auto-promotes, even with a real required target", () => {
    expect(findCandidate(result, "semiconductor-band-theory")!.disposition).toBe("REVIEW_REQUIRED");
  });

  it("a prerequisite whose target references no real required candidate is capped at CONTEXTUAL_TEACHING_SUPPORT", () => {
    const orphan: PrerequisiteEvidence[] = [{ kind: "STRUCTURAL_PREREQUISITE_DEPENDENCY", evidenceId: "prereq-orphan", subject: "unrelated-skill", performanceType: "OTHER", capabilityKey: "x", necessaryForCandidateKey: "nothing::OTHER", minimalDepthJustification: "n/a", sourceRef: "SRC-DEP", sourceLocator: "l3", normalizationBasis: "STRUCTURAL_PREREQUISITE_DEPENDENCY" }];
    const r = buildStandardPipeline(pipeline({ officialCurriculumUnits: units, curriculum: curriculumEvidence, prerequisites: orphan }));
    expect(findCandidate(r, "unrelated-skill")!.disposition).toBe("CONTEXTUAL_TEACHING_SUPPORT");
  });

  it("[AP] EXPLICIT_ASSESSMENT_OPERATION derived from a REJECTED assessment item cannot auto-promote", () => {
    const capReq: CandidateCapabilityRequirement[] = [
      capabilityRequirement({ targetSubject: "explicit-calculation", targetCandidateKey: calculationKey, capabilityKey: "assessment-derived-capability", derivationKind: "EXPLICIT_ASSESSMENT_OPERATION", sourceEvidenceRefs: [{ role: "PUBLIC_ASSESSMENT", evidenceId: invalidAssessmentItem.evidenceId }] }),
    ];
    const prereq: PrerequisiteEvidence[] = [{ kind: "STRUCTURAL_PREREQUISITE_DEPENDENCY", evidenceId: "prereq-ap", subject: "assessment-derived-capability", performanceType: "PROCEDURE", capabilityKey: "assessment-derived-capability", necessaryForCandidateKey: calculationKey, minimalDepthJustification: "n/a", sourceRef: "SRC-DEP", sourceLocator: "l4", normalizationBasis: "STRUCTURAL_PREREQUISITE_DEPENDENCY" }];
    const r = buildStandardPipeline(pipeline({ officialCurriculumUnits: units, curriculum: curriculumEvidence, assessment: [invalidAssessmentItem], prerequisites: prereq, capabilityRequirements: capReq }));
    expect(findCandidate(r, "assessment-derived-capability")!.disposition).not.toBe("FOUNDATIONAL_PREREQUISITE");
  });

  it("[AQ, assessment variant] EXPLICIT_ASSESSMENT_OPERATION derived from a VALIDATED assessment item MAY auto-promote", () => {
    const capReq: CandidateCapabilityRequirement[] = [
      capabilityRequirement({ targetSubject: "explicit-calculation", targetCandidateKey: calculationKey, capabilityKey: "assessment-derived-capability", derivationKind: "EXPLICIT_ASSESSMENT_OPERATION", sourceEvidenceRefs: [{ role: "PUBLIC_ASSESSMENT", evidenceId: validAssessmentItem.evidenceId }] }),
    ];
    const prereq: PrerequisiteEvidence[] = [{ kind: "STRUCTURAL_PREREQUISITE_DEPENDENCY", evidenceId: "prereq-aq", subject: "assessment-derived-capability", performanceType: "PROCEDURE", capabilityKey: "assessment-derived-capability", necessaryForCandidateKey: calculationKey, minimalDepthJustification: "n/a", sourceRef: "SRC-DEP", sourceLocator: "l5", normalizationBasis: "STRUCTURAL_PREREQUISITE_DEPENDENCY" }];
    const r = buildStandardPipeline(pipeline({ officialCurriculumUnits: units, curriculum: curriculumEvidence, assessment: [validAssessmentItem], prerequisites: prereq, capabilityRequirements: capReq }));
    expect(findCandidate(r, "assessment-derived-capability")!.disposition).toBe("FOUNDATIONAL_PREREQUISITE");
  });
});

describe("CC-18A case Y -- an optional-calibration factual claim contradicting technical truth is diagnostic only", () => {
  const calibrationClaims: SourceFactualClaim[] = [factualClaim({ claimKey: "gearing-power-conservation", subject: "gears", sourceRole: "OPTIONAL_CALIBRATION", normalizedClaimValue: "gearing creates additional power" })];
  const technicalClaims: SourceFactualClaim[] = [factualClaim({ claimKey: "gearing-power-conservation", subject: "gears", sourceRole: "TECHNICAL_TRUTH", normalizedClaimValue: "ideal gearing does not create power; speed and torque trade" })];

  it("compareCalibrationFactualClaims detects the conflict diagnostically", () => {
    const conflicts = compareCalibrationFactualClaims(calibrationClaims, technicalClaims);
    expect(conflicts).toHaveLength(1);
    expect(conflicts[0]!.gapType).toBe("CURRICULUM_TECHNICAL_CONFLICT");
  });

  it("the standard pipeline never sees the calibration claim", () => {
    const result = buildStandardPipeline(pipeline({ factualClaims: technicalClaims }));
    expect(result.candidates).toEqual([]);
    expect(result.gaps.some((g) => g.gapType === "CURRICULUM_TECHNICAL_CONFLICT")).toBe(false);
  });

  it("[hard mechanical test] passing an OPTIONAL_CALIBRATION-sourced factual claim into the standard pipeline is rejected", () => {
    expect(() => buildStandardPipeline(pipeline({ factualClaims: calibrationClaims }))).toThrow(/OPTIONAL_CALIBRATION/);
  });
});

describe("CC-18A case Z -- OPEN_OR_UNDERSPECIFIED category produces SCOPE_BREADTH_GAP with ZERO assessment evidence", () => {
  const units: OfficialCurriculumUnit[] = [officialUnit({ curriculumUnitId: "AC-X" })];
  const curriculumEvidence: CurriculumEvidence[] = [curriculum({ subject: "broad-category", curriculumUnitId: "AC-X", normalizationKind: "RANGE_CATEGORY", breadthStatus: "OPEN_OR_UNDERSPECIFIED" })];
  const result = buildStandardPipeline(pipeline({ officialCurriculumUnits: units, curriculum: curriculumEvidence, assessment: [] }));

  it("still retains the category and still emits the breadth gap despite zero assessment evidence", () => {
    expect(findCandidate(result, "broad-category")!.disposition).toBe("REQUIRED_EXPLICIT_CURRICULUM");
    const gap = result.gaps.find((g) => g.gapType === "SCOPE_BREADTH_GAP");
    expect(gap!.evidenceAvailable).toEqual([]);
  });
});

describe("CC-18A case AA -- ENUMERATED_COMPLETE category never produces a false breadth gap", () => {
  const units: OfficialCurriculumUnit[] = [officialUnit({ curriculumUnitId: "AC-X" })];
  const curriculumEvidence: CurriculumEvidence[] = [curriculum({ subject: "fully-enumerated-category", curriculumUnitId: "AC-X", normalizationKind: "RANGE_CATEGORY", breadthStatus: "ENUMERATED_COMPLETE" })];
  const result = buildStandardPipeline(pipeline({ officialCurriculumUnits: units, curriculum: curriculumEvidence }));

  it("the category remains required, with no breadth gap and no gap candidate", () => {
    expect(findCandidate(result, "fully-enumerated-category")!.disposition).toBe("REQUIRED_EXPLICIT_CURRICULUM");
    expect(result.gaps.some((g) => g.gapType === "SCOPE_BREADTH_GAP")).toBe(false);
    expect(result.candidates.length).toBe(1);
  });
});

describe("CC-18A case AB -- an UNKNOWN breadth state is preserved as review uncertainty, never silently complete", () => {
  const units: OfficialCurriculumUnit[] = [officialUnit({ curriculumUnitId: "AC-X" })];

  it("a category with no declared breadthStatus defaults to UNKNOWN", () => {
    const curriculumEvidence: CurriculumEvidence[] = [curriculum({ subject: "undeclared-breadth-category", curriculumUnitId: "AC-X", normalizationKind: "RANGE_CATEGORY" })];
    const result = buildStandardPipeline(pipeline({ officialCurriculumUnits: units, curriculum: curriculumEvidence }));
    const reviewCandidate = result.candidates.find((c) => c.candidateKey === "undeclared-breadth-category::unresolved-breadth");
    expect(reviewCandidate!.disposition).toBe("REVIEW_REQUIRED");
  });

  it("an explicit UNKNOWN status produces the same review-required outcome, distinct from OPEN_OR_UNDERSPECIFIED's OPEN_SCOPE_GAP", () => {
    const curriculumEvidence: CurriculumEvidence[] = [curriculum({ subject: "explicit-unknown-category", curriculumUnitId: "AC-X", normalizationKind: "RANGE_CATEGORY", breadthStatus: "UNKNOWN" })];
    const result = buildStandardPipeline(pipeline({ officialCurriculumUnits: units, curriculum: curriculumEvidence }));
    const c = result.candidates.find((cand) => cand.candidateKey === "explicit-unknown-category::unresolved-breadth")!;
    expect(c.disposition).toBe("REVIEW_REQUIRED");
    expect(c.disposition).not.toBe("OPEN_SCOPE_GAP");
  });
});

describe("CC-18A case AC -- evidence lacking mandatory source provenance is rejected", () => {
  it("hasValidProvenance rejects empty sourceRef/sourceLocator", () => {
    expect(hasValidProvenance({ sourceRef: "", sourceLocator: "x", normalizationBasis: "EXPLICIT_CURRICULUM_WORDING" })).toBe(false);
    expect(hasValidProvenance({ sourceRef: "x", sourceLocator: "", normalizationBasis: "EXPLICIT_CURRICULUM_WORDING" })).toBe(false);
    expect(hasValidProvenance({ sourceRef: "x", sourceLocator: "y", normalizationBasis: "EXPLICIT_CURRICULUM_WORDING" })).toBe(true);
  });

  it("a CurriculumEvidence record with empty sourceRef is excluded from candidate generation entirely", () => {
    const invalid = curriculum({ subject: "no-provenance-topic", sourceRef: "" });
    const { validated } = validateCurriculumEvidence([invalid], QUAL, new Map());
    expect(validated).toEqual([]);
  });

  it("end-to-end: a provenance-invalid record produces no candidate via the full standard pipeline", () => {
    const invalidCurriculum = curriculum({ subject: "rejected-topic", sourceRef: "   " });
    const result = buildStandardPipeline(pipeline({ curriculum: [invalidCurriculum] }));
    expect(findCandidate(result, "rejected-topic")).toBeUndefined();
  });
});

// =====================================================================
// CC-18B new cases AD-AZ.
// =====================================================================

describe("CC-18B case AD -- fabricated curriculumUnitId never creates required scope", () => {
  const units: OfficialCurriculumUnit[] = [officialUnit({ curriculumUnitId: "AC-REAL" })];
  const bad = curriculum({ subject: "fabricated-topic", curriculumUnitId: "AC-FAKE" });
  const result = buildStandardPipeline(pipeline({ officialCurriculumUnits: units, curriculum: [bad] }));

  it("creates no candidate", () => {
    expect(result.candidates).toEqual([]);
  });

  it("emits CURRICULUM_MAPPING_REVIEW naming the fabricated id", () => {
    const gap = result.gaps.find((g) => g.gapType === "CURRICULUM_MAPPING_REVIEW");
    expect(gap).toBeDefined();
    expect(gap!.evidenceAvailable.some((e) => e.includes("AC-FAKE"))).toBe(true);
  });
});

describe("CC-18B case AE -- CurriculumEvidence belonging to another qualification creates no scope", () => {
  const units: OfficialCurriculumUnit[] = [officialUnit({ curriculumUnitId: "AC-REAL", qualificationId: OTHER_QUAL })];
  const bad = curriculum({ subject: "wrong-qual-topic", curriculumUnitId: "AC-REAL", qualificationId: OTHER_QUAL });
  const result = buildStandardPipeline(pipeline({ officialCurriculumUnits: units, curriculum: [bad] })); // active qualification = QUAL

  it("creates no candidate and emits CURRICULUM_MAPPING_REVIEW", () => {
    expect(result.candidates).toEqual([]);
    expect(result.gaps.some((g) => g.gapType === "CURRICULUM_MAPPING_REVIEW")).toBe(true);
  });
});

describe("CC-18B case AF -- two qualifications sharing the same curriculumUnitId resolve independently, regardless of registry insertion order", () => {
  const unitsForward: OfficialCurriculumUnit[] = [
    officialUnit({ curriculumUnitId: "AC1.1", qualificationId: QUAL, officialWording: "wording in QUAL" }),
    officialUnit({ curriculumUnitId: "AC1.1", qualificationId: OTHER_QUAL, officialWording: "wording in OTHER_QUAL" }),
  ];
  const unitsReversed = [...unitsForward].reverse();
  const curr = curriculum({ subject: "topic-in-qual", curriculumUnitId: "AC1.1", qualificationId: QUAL });

  it("resolves the correct qualification's unit regardless of insertion order", () => {
    for (const units of [unitsForward, unitsReversed]) {
      const result = buildStandardPipeline(pipeline({ officialCurriculumUnits: units, curriculum: [curr] }));
      expect(findCandidate(result, "topic-in-qual"), "expected the candidate to resolve for either insertion order").toBeDefined();
    }
  });

  it("a genuine registry conflict (same composite key, incompatible wording) excludes BOTH duplicates and is reported, never last-write-wins", () => {
    const conflicting: OfficialCurriculumUnit[] = [
      officialUnit({ curriculumUnitId: "AC1.1", qualificationId: QUAL, officialWording: "First version of the wording" }),
      officialUnit({ curriculumUnitId: "AC1.1", qualificationId: QUAL, officialWording: "Incompatible second version" }),
    ];
    const { index, gaps } = buildOfficialCurriculumUnitIndex(conflicting);
    expect(index.has("QUAL-SYNTH-1::AC1.1")).toBe(false);
    expect(gaps.some((g) => g.gapType === "EVIDENCE_NORMALIZATION_REVIEW")).toBe(true);

    const result = buildStandardPipeline(pipeline({ officialCurriculumUnits: conflicting, curriculum: [curr] }));
    expect(result.candidates).toEqual([]);
    expect(result.gaps.some((g) => g.gapType === "EVIDENCE_NORMALIZATION_REVIEW")).toBe(true);
  });
});

describe("CC-18B case AG -- no legitimate path (empty registry) means no candidate, even with otherwise-valid curriculum evidence", () => {
  const validKindGoodProvenance = curriculum({ subject: "no-registry-topic", curriculumUnitId: "AC-ANYTHING" });
  const result = buildStandardPipeline(pipeline({ officialCurriculumUnits: [], curriculum: [validKindGoodProvenance] }));

  it("creates no candidate when the registry has no entries at all to resolve against", () => {
    expect(result.candidates).toEqual([]);
    expect(result.gaps.some((g) => g.gapType === "CURRICULUM_MAPPING_REVIEW")).toBe(true);
  });
});

describe("CC-18B case AH -- the same subject under three distinct performance types survives as three candidates", () => {
  const units: OfficialCurriculumUnit[] = [officialUnit({ curriculumUnitId: "AC-X" })];
  const curriculumEvidence: CurriculumEvidence[] = [
    curriculum({ subject: "multi-performance-topic", curriculumUnitId: "AC-X", commandVerbPerformanceType: "IDENTIFY" }),
    curriculum({ subject: "multi-performance-topic", curriculumUnitId: "AC-X", commandVerbPerformanceType: "DESCRIBE" }),
    curriculum({ subject: "multi-performance-topic", curriculumUnitId: "AC-X", commandVerbPerformanceType: "CALCULATE" }),
  ];
  const result = buildStandardPipeline(pipeline({ officialCurriculumUnits: units, curriculum: curriculumEvidence }));

  it("produces three distinct required candidates, one per performance type", () => {
    const matches = result.candidates.filter((c) => c.subject === "multi-performance-topic");
    expect(matches.length).toBe(3);
    expect(new Set(matches.map((c) => c.performanceType))).toEqual(new Set(["IDENTIFY", "DESCRIBE", "CALCULATE"]));
  });

  it("source order does not change which performance types survive", () => {
    const reversed = [...curriculumEvidence].reverse();
    const r = buildStandardPipeline(pipeline({ officialCurriculumUnits: units, curriculum: reversed }));
    const matches = r.candidates.filter((c) => c.subject === "multi-performance-topic");
    expect(new Set(matches.map((c) => c.performanceType))).toEqual(new Set(["IDENTIFY", "DESCRIBE", "CALCULATE"]));
  });
});

describe("CC-18B case AI -- three explicit Range members under one parent: parent + all three member candidates survive", () => {
  const units: OfficialCurriculumUnit[] = [officialUnit({ curriculumUnitId: "AC-X" })];
  const curriculumEvidence: CurriculumEvidence[] = [
    curriculum({ subject: "parent-topic", curriculumUnitId: "AC-X", normalizationKind: "PRIMARY_REQUIREMENT", commandVerbPerformanceType: "EXPLAIN" }),
    curriculum({ subject: "member-a", curriculumUnitId: "AC-X", normalizationKind: "RANGE_REQUIRED_MEMBER", refinesSubject: "parent-topic" }),
    curriculum({ subject: "member-b", curriculumUnitId: "AC-X", normalizationKind: "RANGE_REQUIRED_MEMBER", refinesSubject: "parent-topic" }),
    curriculum({ subject: "member-c", curriculumUnitId: "AC-X", normalizationKind: "RANGE_REQUIRED_MEMBER", refinesSubject: "parent-topic" }),
  ];
  const result = buildStandardPipeline(pipeline({ officialCurriculumUnits: units, curriculum: curriculumEvidence }));

  it("produces 4 required candidates: the parent and all three members", () => {
    expect(result.candidates.filter((c) => c.disposition === "REQUIRED_EXPLICIT_CURRICULUM").length).toBe(4);
    for (const member of ["member-a", "member-b", "member-c"]) {
      const c = findCandidate(result, member)!;
      expect(c.disposition).toBe("REQUIRED_EXPLICIT_CURRICULUM");
      expect(c.parentSubject).toBe("parent-topic");
    }
  });
});

describe("CC-18B case AJ -- a DEPTH_QUALIFIER under a parent changes depth evidence only; no independent mastery candidate", () => {
  const units: OfficialCurriculumUnit[] = [officialUnit({ curriculumUnitId: "AC-X" })];
  const curriculumEvidence: CurriculumEvidence[] = [
    curriculum({ subject: "parent-topic", curriculumUnitId: "AC-X", normalizationKind: "PRIMARY_REQUIREMENT", commandVerbPerformanceType: "EXPLAIN" }),
    curriculum({ subject: "depth-detail", curriculumUnitId: "AC-X", normalizationKind: "DEPTH_QUALIFIER", refinesSubject: "parent-topic" }),
  ];
  const result = buildStandardPipeline(pipeline({ officialCurriculumUnits: units, curriculum: curriculumEvidence }));

  it("raises the parent's depth confidence but creates no candidate for the depth qualifier itself", () => {
    expect(findCandidate(result, "parent-topic")!.confidence.depthConfidence).toBe("MEDIUM");
    expect(findCandidate(result, "depth-detail")).toBeUndefined();
    expect(result.candidates.filter((c) => c.disposition === "REQUIRED_EXPLICIT_CURRICULUM").length).toBe(1);
  });
});

describe("CC-18B case AK -- one valid and one invalid assessment member of the same governed family: the invalid one cannot create a family pattern", () => {
  const units: OfficialCurriculumUnit[] = [officialUnit({ curriculumUnitId: "AC-X" })];
  const curriculumEvidence: CurriculumEvidence[] = [
    curriculum({ subject: "member-1", curriculumUnitId: "AC-X", normalizationKind: "RANGE_CATEGORY" }),
    curriculum({ subject: "member-2", curriculumUnitId: "AC-X", normalizationKind: "RANGE_CATEGORY" }),
  ];
  const families: CurriculumFamily[] = [family({ familyKey: "fam", memberSubjects: ["member-1", "member-2"] })];
  const items: AssessmentEvidence[] = [
    assessment({ subject: "member-1", performanceType: "SCHEMATIC_RECOGNITION", familyKey: "fam", mappedCurriculumUnitId: "AC-X" }),
    assessment({ subject: "member-2", performanceType: "SCHEMATIC_RECOGNITION", familyKey: "fam", mappedCurriculumUnitId: "AC-FAKE" }),
  ];
  const result = buildStandardPipeline(pipeline({ officialCurriculumUnits: units, curriculum: curriculumEvidence, assessment: items, families }));

  it("the valid item creates its own direct candidate; the invalid one is rejected via ASSESSMENT_MAPPING_REVIEW", () => {
    expect(findCandidate(result, "member-1", "SCHEMATIC_RECOGNITION")!.disposition).toBe("REQUIRED_ASSESSMENT_EVIDENCED");
    expect(findCandidate(result, "member-2", "SCHEMATIC_RECOGNITION")).toBeUndefined();
    expect(result.gaps.some((g) => g.gapType === "ASSESSMENT_MAPPING_REVIEW")).toBe(true);
  });

  it("no family-level pattern candidate is emitted, since only one governed member has valid evidence", () => {
    expect(result.candidates.some((c) => c.assessmentPattern !== undefined)).toBe(false);
  });
});

describe("CC-18B case AL -- an invalid assessment item under a category does not appear as an evidenced breadth sub-item", () => {
  const units: OfficialCurriculumUnit[] = [officialUnit({ curriculumUnitId: "AC-X" })];
  const curriculumEvidence: CurriculumEvidence[] = [curriculum({ subject: "broad-cat", curriculumUnitId: "AC-X", normalizationKind: "RANGE_CATEGORY", breadthStatus: "OPEN_OR_UNDERSPECIFIED" })];
  const relations: CurriculumSubjectRelation[] = [subjectRelation({ subject: "sub-item", underCategory: "broad-cat" })];
  const invalidItem = assessment({ subject: "sub-item", performanceType: "CALCULATE", mappedCurriculumUnitId: "AC-FAKE", underCategory: "broad-cat" });
  const result = buildStandardPipeline(pipeline({ officialCurriculumUnits: units, curriculum: curriculumEvidence, assessment: [invalidItem], subjectRelations: relations }));

  it("the breadth gap's evidenceAvailable does not include the rejected item's subject", () => {
    const gap = result.gaps.find((g) => g.gapType === "SCOPE_BREADTH_GAP");
    expect(gap!.evidenceAvailable).toEqual([]);
  });
});

describe("CC-18B case AM -- CurriculumEvidence using a technical-truth normalization basis is rejected, never scope", () => {
  const units: OfficialCurriculumUnit[] = [officialUnit({ curriculumUnitId: "AC-X" })];
  const bad = curriculum({ subject: "wrong-basis-topic", curriculumUnitId: "AC-X", normalizationBasis: "AUTHORITATIVE_TECHNICAL_FACT" });
  const result = buildStandardPipeline(pipeline({ officialCurriculumUnits: units, curriculum: [bad] }));

  it("creates no candidate and emits EVIDENCE_NORMALIZATION_REVIEW", () => {
    expect(result.candidates).toEqual([]);
    expect(result.gaps.some((g) => g.gapType === "EVIDENCE_NORMALIZATION_REVIEW")).toBe(true);
  });
});

describe("CC-18B case AN -- a TECHNICAL_TRUTH factual claim using a curriculum-wording normalization basis is rejected, never attached", () => {
  const badClaim: SourceFactualClaim = factualClaim({ claimKey: "x", subject: "y", sourceRole: "TECHNICAL_TRUTH", normalizedClaimValue: "v", normalizationBasis: "EXPLICIT_CURRICULUM_WORDING" });
  const units: OfficialCurriculumUnit[] = [officialUnit({ curriculumUnitId: "AC-X" })];
  const curriculumEvidence: CurriculumEvidence[] = [curriculum({ subject: "y", curriculumUnitId: "AC-X" })];
  const key = generateCurriculumCandidates(curriculumEvidence)[0]!.candidateKey;
  const result = buildStandardPipeline(pipeline({ officialCurriculumUnits: units, curriculum: curriculumEvidence, factRequirements: [factRequirement({ targetCandidateKey: key, claimKey: "x" })], factualClaims: [badClaim] }));

  it("never attaches, and is reported via EVIDENCE_NORMALIZATION_REVIEW", () => {
    expect(findCandidate(result, "y")!.technicalCoverageStatus).not.toBe("COMPLETE");
    expect(result.gaps.some((g) => g.gapType === "EVIDENCE_NORMALIZATION_REVIEW")).toBe(true);
  });
});

describe("CC-18B cases AR/AS/AT/AU -- claim-key-exact technical coverage", () => {
  const units: OfficialCurriculumUnit[] = [officialUnit({ curriculumUnitId: "AC-X" })];
  const curriculumEvidence: CurriculumEvidence[] = [curriculum({ subject: "multi-fact-topic", curriculumUnitId: "AC-X" })];
  const key = generateCurriculumCandidates(curriculumEvidence)[0]!.candidateKey;
  const factReqs: CandidateFactRequirement[] = [factRequirement({ targetCandidateKey: key, claimKey: "fact-a" }), factRequirement({ targetCandidateKey: key, claimKey: "fact-b" })];

  it("[AR] only fact-a supplied -> technical coverage is PARTIAL, never COMPLETE", () => {
    const claims: SourceFactualClaim[] = [factualClaim({ claimKey: "fact-a", subject: "multi-fact-topic", sourceRole: "TECHNICAL_TRUTH", normalizedClaimValue: "value-a" })];
    const result = buildStandardPipeline(pipeline({ officialCurriculumUnits: units, curriculum: curriculumEvidence, factRequirements: factReqs, factualClaims: claims }));
    const c = findCandidate(result, "multi-fact-topic")!;
    expect(c.technicalCoverageStatus).toBe("PARTIAL");
    expect(c.factualStatementsByClaimKey?.["fact-a"]).toBe("value-a");
    expect(c.factualStatementsByClaimKey?.["fact-b"]).toBeUndefined();
  });

  it("[AS] both fact-a and fact-b supplied -> COMPLETE", () => {
    const claims: SourceFactualClaim[] = [
      factualClaim({ claimKey: "fact-a", subject: "multi-fact-topic", sourceRole: "TECHNICAL_TRUTH", normalizedClaimValue: "value-a" }),
      factualClaim({ claimKey: "fact-b", subject: "multi-fact-topic", sourceRole: "TECHNICAL_TRUTH", normalizedClaimValue: "value-b" }),
    ];
    const result = buildStandardPipeline(pipeline({ officialCurriculumUnits: units, curriculum: curriculumEvidence, factRequirements: factReqs, factualClaims: claims }));
    const c = findCandidate(result, "multi-fact-topic")!;
    expect(c.technicalCoverageStatus).toBe("COMPLETE");
    expect(c.confidence.technicalTruthConfidence).toBe("HIGH");
  });

  it("[AT] fact-c shares the subject but is not a required fact key -- does not improve coverage for fact-b", () => {
    const claims: SourceFactualClaim[] = [
      factualClaim({ claimKey: "fact-a", subject: "multi-fact-topic", sourceRole: "TECHNICAL_TRUTH", normalizedClaimValue: "value-a" }),
      factualClaim({ claimKey: "fact-c", subject: "multi-fact-topic", sourceRole: "TECHNICAL_TRUTH", normalizedClaimValue: "value-c" }),
    ];
    const result = buildStandardPipeline(pipeline({ officialCurriculumUnits: units, curriculum: curriculumEvidence, factRequirements: factReqs, factualClaims: claims }));
    const c = findCandidate(result, "multi-fact-topic")!;
    expect(c.technicalCoverageStatus).toBe("PARTIAL");
    expect(c.factualStatementsByClaimKey?.["fact-c"]).toBeUndefined();
    expect(c.requiredFactKeys).toEqual(["fact-a", "fact-b"]);
  });

  it("[AU] two claims for the same subject arrive in reverse source order -- identical coverage/result", () => {
    const forward: SourceFactualClaim[] = [
      factualClaim({ claimKey: "fact-a", subject: "multi-fact-topic", sourceRole: "TECHNICAL_TRUTH", normalizedClaimValue: "value-a" }),
      factualClaim({ claimKey: "fact-b", subject: "multi-fact-topic", sourceRole: "TECHNICAL_TRUTH", normalizedClaimValue: "value-b" }),
    ];
    const reversed = [...forward].reverse();
    const r1 = buildStandardPipeline(pipeline({ officialCurriculumUnits: units, curriculum: curriculumEvidence, factRequirements: factReqs, factualClaims: forward }));
    const r2 = buildStandardPipeline(pipeline({ officialCurriculumUnits: units, curriculum: curriculumEvidence, factRequirements: factReqs, factualClaims: reversed }));
    expect(findCandidate(r1, "multi-fact-topic")!.factualStatementsByClaimKey).toEqual(findCandidate(r2, "multi-fact-topic")!.factualStatementsByClaimKey);
    expect(findCandidate(r1, "multi-fact-topic")!.technicalCoverageStatus).toBe(findCandidate(r2, "multi-fact-topic")!.technicalCoverageStatus);
  });

  it("zero requiredFactKeys never claims HIGH technical-truth confidence merely because a source discusses the same subject", () => {
    const noReqCurriculum: CurriculumEvidence[] = [curriculum({ subject: "no-fact-requirement-topic", curriculumUnitId: "AC-X" })];
    const claims: SourceFactualClaim[] = [factualClaim({ claimKey: "irrelevant-fact", subject: "no-fact-requirement-topic", sourceRole: "TECHNICAL_TRUTH", normalizedClaimValue: "some fact" })];
    const result = buildStandardPipeline(pipeline({ officialCurriculumUnits: units, curriculum: noReqCurriculum, factualClaims: claims }));
    const c = findCandidate(result, "no-fact-requirement-topic")!;
    expect(c.technicalCoverageStatus).toBe("NOT_REQUIRED");
    expect(c.confidence.technicalTruthConfidence).toBe("NONE");
  });
});

describe("CC-18B cases AV/AW -- factual comparison kinds gate automatic conflict detection", () => {
  it("[AV] same claimKey, both BOOLEAN, differing values -> deterministic conflict", () => {
    const claims: SourceFactualClaim[] = [
      factualClaim({ claimKey: "boolean-fact", subject: "s1", sourceRole: "OFFICIAL_CURRICULUM", normalizedClaimValue: "true", comparisonKind: "BOOLEAN" }),
      factualClaim({ claimKey: "boolean-fact", subject: "s1", sourceRole: "TECHNICAL_TRUTH", normalizedClaimValue: "false", comparisonKind: "BOOLEAN" }),
    ];
    const units: OfficialCurriculumUnit[] = [officialUnit({ curriculumUnitId: "AC-X" })];
    const curriculumEvidence: CurriculumEvidence[] = [curriculum({ subject: "s1", curriculumUnitId: "AC-X" })];
    const result = buildStandardPipeline(pipeline({ officialCurriculumUnits: units, curriculum: curriculumEvidence, factualClaims: claims }));
    expect(result.gaps.some((g) => g.gapType === "CURRICULUM_TECHNICAL_CONFLICT")).toBe(true);
  });

  it("[AW] same claimKey, incompatible comparison kinds -> FACTUAL_COMPARISON_REVIEW, not an automatic conflict", () => {
    const claims: SourceFactualClaim[] = [
      factualClaim({ claimKey: "mixed-kind-fact", subject: "s2", sourceRole: "OFFICIAL_CURRICULUM", normalizedClaimValue: "some canonical prose", comparisonKind: "CANONICAL_TEXT" }),
      factualClaim({ claimKey: "mixed-kind-fact", subject: "s2", sourceRole: "TECHNICAL_TRUTH", normalizedClaimValue: "42", comparisonKind: "NUMBER_WITH_UNIT" }),
    ];
    const units: OfficialCurriculumUnit[] = [officialUnit({ curriculumUnitId: "AC-X" })];
    const curriculumEvidence: CurriculumEvidence[] = [curriculum({ subject: "s2", curriculumUnitId: "AC-X" })];
    const result = buildStandardPipeline(pipeline({ officialCurriculumUnits: units, curriculum: curriculumEvidence, factualClaims: claims }));
    expect(result.gaps.some((g) => g.gapType === "FACTUAL_COMPARISON_REVIEW")).toBe(true);
    expect(result.gaps.some((g) => g.gapType === "CURRICULUM_TECHNICAL_CONFLICT")).toBe(false);
  });
});

describe("CC-18B case AX -- an exemplar with TECHNICAL_TRUTH role never auto-gains HIGH technical-truth coverage", () => {
  const units: OfficialCurriculumUnit[] = [officialUnit({ curriculumUnitId: "AC-X" })];
  const curriculumEvidence: CurriculumEvidence[] = [curriculum({ subject: "security-alarms", curriculumUnitId: "AC-X", normalizationKind: "RANGE_CATEGORY" })];
  const exemplars = [{ role: "TECHNICAL_TRUTH" as const, evidenceId: "exemplar-1", exemplarOfCategory: "security-alarms", exemplarSubject: "transistor-thyristor-alarm-topology", sourceRef: "SRC-TECH", sourceLocator: "loc-1", normalizationBasis: "AUTHORITATIVE_TECHNICAL_FACT" as const }];
  const result = buildStandardPipeline(pipeline({ officialCurriculumUnits: units, curriculum: curriculumEvidence, exemplars }));

  it("the exemplar candidate's technical-truth confidence is NOT automatically HIGH merely from its own role", () => {
    const exemplar = findCandidate(result, "transistor-thyristor-alarm-topology")!;
    expect(exemplar.disposition).toBe("REPRESENTATIVE_EXEMPLAR");
    expect(exemplar.confidence.technicalTruthConfidence).not.toBe("HIGH");
  });
});

describe("CC-18B case AY -- an ungoverned subject relation referencing a nonexistent normalized curriculum subject is rejected", () => {
  // Tested directly against the validation function: "known" subjects come
  // from curriculum AND validated assessment evidence (section 6), so this
  // isolates the one remaining failure mode -- a subject with NO supporting
  // evidence anywhere, neither curriculum nor a validly mapped assessment item.
  it("a relation whose 'subject' resolves to nothing known is rejected, never silently governed", () => {
    const known = new Set(["real-category"]); // "nonexistent-subject" is not known by any evidence
    const relations: CurriculumSubjectRelation[] = [subjectRelation({ subject: "nonexistent-subject", underCategory: "real-category" })];
    const { validated, gaps } = validateCurriculumSubjectRelations(relations, QUAL, known);
    expect(validated).toEqual([]);
    expect(gaps.some((g) => g.gapType === "EVIDENCE_NORMALIZATION_REVIEW")).toBe(true);
  });

  it("a relation whose 'underCategory' resolves to nothing known is likewise rejected", () => {
    const known = new Set(["real-subject"]);
    const relations: CurriculumSubjectRelation[] = [subjectRelation({ subject: "real-subject", underCategory: "nonexistent-category" })];
    const { validated, gaps } = validateCurriculumSubjectRelations(relations, QUAL, known);
    expect(validated).toEqual([]);
    expect(gaps.some((g) => g.gapType === "EVIDENCE_NORMALIZATION_REVIEW")).toBe(true);
  });

  it("end-to-end: an entirely unsupported relation never counts toward breadth evidence", () => {
    const units: OfficialCurriculumUnit[] = [officialUnit({ curriculumUnitId: "AC-X" })];
    const curriculumEvidence: CurriculumEvidence[] = [curriculum({ subject: "real-category", curriculumUnitId: "AC-X", normalizationKind: "RANGE_CATEGORY", breadthStatus: "OPEN_OR_UNDERSPECIFIED" })];
    const relations: CurriculumSubjectRelation[] = [subjectRelation({ subject: "nonexistent-subject", underCategory: "real-category" })];
    const result = buildStandardPipeline(pipeline({ officialCurriculumUnits: units, curriculum: curriculumEvidence, subjectRelations: relations }));
    expect(result.gaps.some((g) => g.gapType === "EVIDENCE_NORMALIZATION_REVIEW")).toBe(true);
    const breadthGap = result.gaps.find((g) => g.gapType === "SCOPE_BREADTH_GAP");
    expect(breadthGap!.evidenceAvailable).toEqual([]);
  });
});

describe("CC-18B case AZ -- an ungoverned family containing subjects not present in normalized curriculum structure is rejected", () => {
  it("a family listing an unknown member is rejected entirely, tested directly against the validation function", () => {
    const known = new Set(["member-known"]);
    const families: CurriculumFamily[] = [family({ familyKey: "partially-unknown-family", memberSubjects: ["member-known", "member-unknown"] })];
    const { validated, gaps } = validateCurriculumFamilies(families, QUAL, known);
    expect(validated).toEqual([]);
    expect(gaps.some((g) => g.gapType === "EVIDENCE_NORMALIZATION_REVIEW" && g.candidateKey === "partially-unknown-family")).toBe(true);
  });

  it("end-to-end: the whole family is rejected -- no pattern candidate is produced even though two assessment items would otherwise share the label", () => {
    const units: OfficialCurriculumUnit[] = [officialUnit({ curriculumUnitId: "AC-X" })];
    const curriculumEvidence: CurriculumEvidence[] = [curriculum({ subject: "member-known", curriculumUnitId: "AC-X", normalizationKind: "RANGE_CATEGORY" })];
    const families: CurriculumFamily[] = [family({ familyKey: "partially-unknown-family", memberSubjects: ["member-known", "member-unknown-no-evidence"] })];
    const items: AssessmentEvidence[] = [assessment({ subject: "member-known", performanceType: "SCHEMATIC_RECOGNITION", familyKey: "partially-unknown-family", mappedCurriculumUnitId: "AC-X" })];
    const result = buildStandardPipeline(pipeline({ officialCurriculumUnits: units, curriculum: curriculumEvidence, assessment: items, families }));
    expect(result.gaps.some((g) => g.gapType === "EVIDENCE_NORMALIZATION_REVIEW" && g.candidateKey === "partially-unknown-family")).toBe(true);
    expect(result.candidates.some((c) => c.assessmentPattern !== undefined)).toBe(false);
  });
});

// =====================================================================
// Cross-cutting rules retained from CC-18.
// =====================================================================

describe("CC-18 -- exemplar vs mastery", () => {
  const units: OfficialCurriculumUnit[] = [officialUnit({ curriculumUnitId: "AC-X" })];
  const curriculumEvidence: CurriculumEvidence[] = [curriculum({ subject: "security-alarms", curriculumUnitId: "AC-X", normalizationKind: "RANGE_CATEGORY" })];
  const exemplars = [{ role: "TECHNICAL_TRUTH" as const, evidenceId: "exemplar-1", exemplarOfCategory: "security-alarms", exemplarSubject: "transistor-thyristor-alarm-topology", implementationDetailSubjects: ["latch-resistor-value", "specific-contact-arrangement"], sourceRef: "SRC-TECH", sourceLocator: "loc-1", normalizationBasis: "AUTHORITATIVE_TECHNICAL_FACT" as const }];
  const result = buildStandardPipeline(pipeline({ officialCurriculumUnits: units, curriculum: curriculumEvidence, exemplars }));

  it("creates the exemplar as REPRESENTATIVE_EXEMPLAR, distinct from the required category, and never promotes its implementation detail", () => {
    expect(findCandidate(result, "security-alarms")!.disposition).toBe("REQUIRED_EXPLICIT_CURRICULUM");
    const exemplar = findCandidate(result, "transistor-thyristor-alarm-topology")!;
    expect(exemplar.disposition).toBe("REPRESENTATIVE_EXEMPLAR");
    expect(exemplar.exemplarOfCategory).toBe("security-alarms");
    expect(findCandidate(result, "latch-resistor-value")).toBeUndefined();
    expect(findCandidate(result, "specific-contact-arrangement")).toBeUndefined();
  });

  it("creates no exemplar candidate when its category is not itself required", () => {
    const orphanExemplar = [{ role: "TECHNICAL_TRUTH" as const, evidenceId: "exemplar-2", exemplarOfCategory: "never-required-category", exemplarSubject: "orphan-example", sourceRef: "SRC-TECH", sourceLocator: "loc-2", normalizationBasis: "AUTHORITATIVE_TECHNICAL_FACT" as const }];
    const r = buildStandardPipeline(pipeline({ exemplars: orphanExemplar }));
    expect(r.candidates).toEqual([]);
  });
});

describe("CC-18/CC-18B -- architecture-integrity checks", () => {
  const rulesSource = readFileSync(path.resolve(import.meta.dirname, "rules.ts"), "utf-8");
  const typesSource = readFileSync(path.resolve(import.meta.dirname, "types.ts"), "utf-8");
  const indexSource = readFileSync(path.resolve(import.meta.dirname, "index.ts"), "utf-8");

  it("production logic contains no qualification/topic-specific branching literals", () => {
    const bannedLiterals = ["202", "telephone", "solenoid", "gears", "levers", "pulleys", "statistics", "unit202", "c&g", "city and guilds", "2365"];
    for (const source of [rulesSource, typesSource, indexSource]) {
      const lower = source.toLowerCase();
      for (const banned of bannedLiterals) {
        expect(lower.includes(banned.toLowerCase()), `production source must not contain the topic-specific literal "${banned}"`).toBe(false);
      }
    }
  });

  it("this package declares zero dependency on @alp/content-schema or any other workspace package", () => {
    const packageJson = JSON.parse(readFileSync(path.resolve(import.meta.dirname, "..", "package.json"), "utf-8")) as { dependencies?: Record<string, string> };
    expect(Object.keys(packageJson.dependencies ?? {}).every((d) => !d.startsWith("@alp/"))).toBe(true);
  });

  it("no source file in this package imports from an @alp/* workspace package", () => {
    for (const source of [rulesSource, typesSource, indexSource]) expect(source).not.toMatch(/from\s+["']@alp\//);
  });
});

describe("CC-18/CC-18A/CC-18B -- generic disposition/confidence/gap plumbing sanity", () => {
  it("generateAssessmentCandidates operates only on an already-validated stream and never re-validates", () => {
    const evidence: AssessmentEvidence[] = [assessment({ subject: "already-validated-subject", performanceType: "STATE", mappedCurriculumUnitId: "does-not-matter-here" })];
    const candidates = generateAssessmentCandidates(evidence);
    expect(candidates.length).toBe(1); // trusts its input completely -- validation is a separate, prior step
  });

  it("every candidate carries a non-empty rationale and at least one evidence reference", () => {
    const units: OfficialCurriculumUnit[] = [officialUnit({ curriculumUnitId: "AC-X" })];
    const curriculumEvidence: CurriculumEvidence[] = [curriculum({ subject: "s1", curriculumUnitId: "AC-X" })];
    const result = buildStandardPipeline(pipeline({ officialCurriculumUnits: units, curriculum: curriculumEvidence }));
    for (const c of result.candidates) {
      expect(c.rationale.length).toBeGreaterThan(0);
      expect(c.evidenceRefs.length).toBeGreaterThan(0);
    }
  });

  it("every gap record names at least one legitimate resolver role from the governed evidence-role enum, as a plural array", () => {
    const units: OfficialCurriculumUnit[] = [officialUnit({ curriculumUnitId: "AC-X" })];
    const curriculumEvidence: CurriculumEvidence[] = [curriculum({ subject: "s1", curriculumUnitId: "AC-X" })];
    const result = buildStandardPipeline(pipeline({ officialCurriculumUnits: units, curriculum: curriculumEvidence }));
    const validRoles = ["OFFICIAL_CURRICULUM", "PUBLIC_ASSESSMENT", "QUALIFICATION_LEVEL", "TECHNICAL_TRUTH", "OPTIONAL_CALIBRATION", "LEGACY_DIAGNOSTIC", "MODEL_KNOWLEDGE"];
    for (const g of result.gaps) {
      expect(Array.isArray(g.legitimateResolverRoles)).toBe(true);
      expect(g.legitimateResolverRoles.length).toBeGreaterThan(0);
      for (const role of g.legitimateResolverRoles) expect(validRoles).toContain(role);
    }
  });

  it("TECHNICAL_TRUTH is never a legitimate resolver role for a SCOPE_BREADTH_GAP", () => {
    const units: OfficialCurriculumUnit[] = [officialUnit({ curriculumUnitId: "AC-X" })];
    const curriculumEvidence: CurriculumEvidence[] = [curriculum({ subject: "broad-topic", curriculumUnitId: "AC-X", normalizationKind: "RANGE_CATEGORY", breadthStatus: "OPEN_OR_UNDERSPECIFIED" })];
    const result = buildStandardPipeline(pipeline({ officialCurriculumUnits: units, curriculum: curriculumEvidence }));
    const breadthGap = result.gaps.find((g) => g.gapType === "SCOPE_BREADTH_GAP")!;
    expect(breadthGap.legitimateResolverRoles).not.toContain("TECHNICAL_TRUTH");
  });
});
