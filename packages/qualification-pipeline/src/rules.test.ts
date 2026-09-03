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
  SemanticAdjudication,
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
  return { evidenceId: nextId("relation"), qualificationId: QUAL, sourceRef: "SRC-SPEC", sourceLocator: "spec-loc", normalizationBasis: "EXPLICIT_RANGE_STRUCTURE", ...overrides };
}

function family(overrides: Partial<CurriculumFamily> & Pick<CurriculumFamily, "familyKey" | "memberSubjects">): CurriculumFamily {
  return { evidenceId: nextId("family"), qualificationId: QUAL, sourceRef: "SRC-SPEC", sourceLocator: "spec-loc", normalizationBasis: "EXPLICIT_RANGE_STRUCTURE", ...overrides };
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

/**
 * Defaults to EXPLICIT_CURRICULUM_FACT -- callers that need the
 * requirement to actually contribute a requiredFactKey MUST supply
 * `sourceEvidenceRefs` citing a real, validated OFFICIAL_CURRICULUM (or,
 * for EXPLICIT_ASSESSMENT_FACT, PUBLIC_ASSESSMENT) evidenceId; the bare
 * default of an empty array is deliberately ineligible (CC-18C section 8).
 */
function factRequirement(overrides: Partial<CandidateFactRequirement> & Pick<CandidateFactRequirement, "targetCandidateKey" | "claimKey">): CandidateFactRequirement {
  return {
    qualificationId: QUAL,
    derivationStatus: "EXPLICIT_CURRICULUM_FACT",
    sourceEvidenceRefs: [],
    sourceRef: "SRC-SPEC",
    sourceLocator: "spec-loc",
    normalizationBasis: "FACT_REQUIREMENT_DERIVATION",
    ...overrides,
  };
}

/** Defaults to a REQUIRED_CORE decision under QUAL -- callers override `decision`/`targetCandidateKey`/`claimKey` as needed. */
function semanticAdjudication(overrides: Partial<SemanticAdjudication> & Pick<SemanticAdjudication, "targetCandidateKey" | "claimKey" | "decision">): SemanticAdjudication {
  return {
    qualificationId: QUAL,
    adjudicationBasis: ["SEMANTIC_NECESSITY"],
    adjudicatorKind: "HUMAN_PROJECT_ARCHITECT",
    decisionRef: nextId("decision"),
    rationale: "synthetic CC-20 adjudication rationale",
    supportingEvidenceRefs: [],
    sourceRef: "SRC-ADJUDICATION",
    sourceLocator: "adjudication-loc",
    normalizationBasis: "SEMANTIC_ADJUDICATION_DECISION",
    ...overrides,
  };
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
  const curriculumEvidence: CurriculumEvidence[] = [curriculum({ subject: "gears", curriculumUnitId: "AC-MECH-1", commandVerbPerformanceType: "EXPLAIN", evidenceId: "curr-gears-lx" })];
  const gearsKey = generateCurriculumCandidates(curriculumEvidence).candidates[0]!.candidateKey;
  const claims: SourceFactualClaim[] = [
    factualClaim({ claimKey: "gearing-power-conservation", subject: "gears", sourceRole: "OFFICIAL_CURRICULUM", normalizedClaimValue: "gearing creates additional power", comparisonKind: "CANONICAL_TEXT" }),
    factualClaim({ claimKey: "gearing-power-conservation", subject: "gears", sourceRole: "TECHNICAL_TRUTH", normalizedClaimValue: "ideal gearing does not create power; speed and torque trade", comparisonKind: "CANONICAL_TEXT" }),
  ];
  const factReqs: CandidateFactRequirement[] = [
    factRequirement({ targetCandidateKey: gearsKey, claimKey: "gearing-power-conservation", sourceEvidenceRefs: [{ role: "OFFICIAL_CURRICULUM", evidenceId: "curr-gears-lx" }] }),
  ];
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
  const curriculumEvidence: CurriculumEvidence[] = [curriculum({ subject: "resistivity", curriculumUnitId: "AC-ELEC-4.3", commandVerbPerformanceType: "DESCRIBE", evidenceId: "curr-resistivity-m" })];
  const resistivityKey = generateCurriculumCandidates(curriculumEvidence).candidates[0]!.candidateKey;
  const claims: SourceFactualClaim[] = [
    factualClaim({ claimKey: "resistivity-unit", subject: "resistivity", sourceRole: "OFFICIAL_CURRICULUM", normalizedClaimValue: "ohms per metre" }),
    factualClaim({ claimKey: "resistivity-unit", subject: "resistivity", sourceRole: "TECHNICAL_TRUTH", normalizedClaimValue: "ohm-metres (Ω·m)" }),
  ];
  const factReqs: CandidateFactRequirement[] = [
    factRequirement({ targetCandidateKey: resistivityKey, claimKey: "resistivity-unit", sourceEvidenceRefs: [{ role: "OFFICIAL_CURRICULUM", evidenceId: "curr-resistivity-m" }] }),
  ];
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
  const targetKey = generateCurriculumCandidates(curriculumEvidence).candidates[0]!.candidateKey;
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
    curriculum({ subject: "explicit-calculation", curriculumUnitId: "AC-X", commandVerbPerformanceType: "CALCULATE", evidenceId: "curr-explicit-calculation" }),
    curriculum({ subject: "diode-operation", curriculumUnitId: "AC-X", commandVerbPerformanceType: "STATE" }),
  ];
  const baseCandidates = generateCurriculumCandidates(curriculumEvidence).candidates;
  const calculationKey = baseCandidates.find((c) => c.subject === "explicit-calculation")!.candidateKey;
  const diodeKey = baseCandidates.find((c) => c.subject === "diode-operation")!.candidateKey;

  const validAssessmentItem = assessment({ subject: "assessment-derived-op", performanceType: "PROCEDURE", mappedCurriculumUnitId: "AC-X", evidenceId: "assess-valid-op" });
  const invalidAssessmentItem = assessment({ subject: "assessment-derived-op-2", performanceType: "PROCEDURE", mappedCurriculumUnitId: "AC-FAKE", evidenceId: "assess-invalid-op" });

  const capabilityRequirements: CandidateCapabilityRequirement[] = [
    // W/AQ: EXPLICIT_CURRICULUM_OPERATION -- structurally derived, auto-promotable, and
    // (CC-18C) cites a role-and-id-matched entry in the validated curriculum stream.
    capabilityRequirement({
      targetSubject: "explicit-calculation",
      targetCandidateKey: calculationKey,
      capabilityKey: "formula-transposition",
      derivationKind: "EXPLICIT_CURRICULUM_OPERATION",
      sourceEvidenceRefs: [{ role: "OFFICIAL_CURRICULUM", evidenceId: "curr-explicit-calculation" }],
    }),
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
    const parent = findCandidate(result, "parent-topic")!;
    // CC-20 section 17: an explicit curriculum depth qualifier directly
    // constrains depth -- HIGH, with basis EXPLICIT_CURRICULUM_DEPTH.
    expect(parent.confidence.depthConfidence).toBe("HIGH");
    expect(parent.depthBasis).toBe("EXPLICIT_CURRICULUM_DEPTH");
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
  const curriculumEvidence: CurriculumEvidence[] = [curriculum({ subject: "y", curriculumUnitId: "AC-X", evidenceId: "curr-y-an" })];
  const key = generateCurriculumCandidates(curriculumEvidence).candidates[0]!.candidateKey;
  const factReqs: CandidateFactRequirement[] = [factRequirement({ targetCandidateKey: key, claimKey: "x", sourceEvidenceRefs: [{ role: "OFFICIAL_CURRICULUM", evidenceId: "curr-y-an" }] })];
  const result = buildStandardPipeline(pipeline({ officialCurriculumUnits: units, curriculum: curriculumEvidence, factRequirements: factReqs, factualClaims: [badClaim] }));

  it("never attaches, and is reported via EVIDENCE_NORMALIZATION_REVIEW", () => {
    expect(findCandidate(result, "y")!.technicalCoverageStatus).not.toBe("COMPLETE");
    expect(result.gaps.some((g) => g.gapType === "EVIDENCE_NORMALIZATION_REVIEW")).toBe(true);
  });
});

describe("CC-18B cases AR/AS/AT/AU -- claim-key-exact technical coverage", () => {
  const units: OfficialCurriculumUnit[] = [officialUnit({ curriculumUnitId: "AC-X" })];
  const curriculumEvidence: CurriculumEvidence[] = [curriculum({ subject: "multi-fact-topic", curriculumUnitId: "AC-X", evidenceId: "curr-multi-fact-topic" })];
  const key = generateCurriculumCandidates(curriculumEvidence).candidates[0]!.candidateKey;
  const factCitation = [{ role: "OFFICIAL_CURRICULUM" as const, evidenceId: "curr-multi-fact-topic" }];
  const factReqs: CandidateFactRequirement[] = [
    factRequirement({ targetCandidateKey: key, claimKey: "fact-a", sourceEvidenceRefs: factCitation }),
    factRequirement({ targetCandidateKey: key, claimKey: "fact-b", sourceEvidenceRefs: factCitation }),
  ];

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
    // CC-20 section 15: a required, mastery-bearing leaf with zero
    // requiredFactKeys and no adjudication history is UNRESOLVED_REQUIREMENTS
    // (never NOT_REQUIRED) -- see the dedicated CC-20 case A below.
    expect(c.technicalCoverageStatus).toBe("UNRESOLVED_REQUIREMENTS");
    expect(c.knowledgeBoundaryStatus).toBe("UNRESOLVED");
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

// =====================================================================
// CC-18C new cases BA-BS -- final pre-back-test integrity correction.
// =====================================================================

describe("CC-18C case BA -- CurriculumEvidence blank sourceLocator is rejected and reported, never silently dropped", () => {
  const units: OfficialCurriculumUnit[] = [officialUnit({ curriculumUnitId: "AC-X" })];
  const bad = curriculum({ subject: "blank-locator-topic", curriculumUnitId: "AC-X", sourceLocator: "", evidenceId: "curr-ba" });
  const result = buildStandardPipeline(pipeline({ officialCurriculumUnits: units, curriculum: [bad] }));

  it("creates no candidate", () => {
    expect(result.candidates).toEqual([]);
  });

  it("emits EVIDENCE_NORMALIZATION_REVIEW preserving the attempted proposal's own supplied evidence", () => {
    const gap = result.gaps.find((g) => g.gapType === "EVIDENCE_NORMALIZATION_REVIEW" && g.evidenceAvailable.some((e) => e.includes("curr-ba")));
    expect(gap).toBeDefined();
    expect(gap!.evidenceAvailable.some((e) => e.includes("evidenceId=curr-ba"))).toBe(true);
    expect(gap!.evidenceAvailable.some((e) => e.includes("sourceRef="))).toBe(true);
    expect(gap!.evidenceAvailable.some((e) => e.includes("normalizationBasis="))).toBe(true);
    expect(gap!.unresolved).toMatch(/sourceLocator is empty/);
  });
});

describe("CC-18C case BB -- AssessmentEvidence blank sourceRef is rejected and reported, never silently dropped", () => {
  const units: OfficialCurriculumUnit[] = [officialUnit({ curriculumUnitId: "AC-X" })];
  const bad = assessment({ subject: "blank-ref-item", performanceType: "IDENTIFY", mappedCurriculumUnitId: "AC-X", sourceRef: "", evidenceId: "assess-bb" });
  const result = buildStandardPipeline(pipeline({ officialCurriculumUnits: units, assessment: [bad] }));

  it("creates no candidate", () => {
    expect(result.candidates).toEqual([]);
  });

  it("emits EVIDENCE_NORMALIZATION_REVIEW naming the exact failure", () => {
    const gap = result.gaps.find((g) => g.gapType === "EVIDENCE_NORMALIZATION_REVIEW" && g.evidenceAvailable.some((e) => e.includes("assess-bb")));
    expect(gap).toBeDefined();
    expect(gap!.unresolved).toMatch(/sourceRef is empty/);
  });
});

describe("CC-18C case BC -- OfficialCurriculumUnit blank provenance cannot become mapping authority, and is reported", () => {
  it("buildOfficialCurriculumUnitIndex excludes it and reports EVIDENCE_NORMALIZATION_REVIEW", () => {
    const badUnit = officialUnit({ curriculumUnitId: "AC-BLANK", sourceRef: "" });
    const { index, gaps } = buildOfficialCurriculumUnitIndex([badUnit]);
    expect(index.has("QUAL-SYNTH-1::AC-BLANK")).toBe(false);
    expect(gaps.some((g) => g.gapType === "EVIDENCE_NORMALIZATION_REVIEW")).toBe(true);
  });

  it("end-to-end: curriculum evidence mapping to it cannot validate; the review is visible", () => {
    const badUnit = officialUnit({ curriculumUnitId: "AC-BLANK", sourceRef: "" });
    const curriculumEvidence: CurriculumEvidence[] = [curriculum({ subject: "topic-over-blank-unit", curriculumUnitId: "AC-BLANK" })];
    const result = buildStandardPipeline(pipeline({ officialCurriculumUnits: [badUnit], curriculum: curriculumEvidence }));
    expect(result.candidates).toEqual([]);
    expect(result.gaps.some((g) => g.gapType === "EVIDENCE_NORMALIZATION_REVIEW")).toBe(true);
    expect(result.gaps.some((g) => g.gapType === "CURRICULUM_MAPPING_REVIEW")).toBe(true);
  });
});

describe("CC-18C case BD -- a foreign-qualification CandidateCapabilityRequirement cannot auto-promote a prerequisite", () => {
  const units: OfficialCurriculumUnit[] = [officialUnit({ curriculumUnitId: "AC-X" })];
  const curriculumEvidence: CurriculumEvidence[] = [curriculum({ subject: "bd-target", curriculumUnitId: "AC-X", commandVerbPerformanceType: "CALCULATE", evidenceId: "curr-bd" })];
  const targetKey = generateCurriculumCandidates(curriculumEvidence).candidates[0]!.candidateKey;
  const capReq: CandidateCapabilityRequirement[] = [
    capabilityRequirement({
      qualificationId: OTHER_QUAL,
      targetSubject: "bd-target",
      targetCandidateKey: targetKey,
      capabilityKey: "bd-capability",
      derivationKind: "EXPLICIT_CURRICULUM_OPERATION",
      sourceEvidenceRefs: [{ role: "OFFICIAL_CURRICULUM", evidenceId: "curr-bd" }],
    }),
  ];
  const prereq: PrerequisiteEvidence[] = [
    { kind: "STRUCTURAL_PREREQUISITE_DEPENDENCY", evidenceId: "prereq-bd", subject: "bd-capability-subject", performanceType: "PROCEDURE", capabilityKey: "bd-capability", necessaryForCandidateKey: targetKey, minimalDepthJustification: "n/a", sourceRef: "SRC-DEP", sourceLocator: "l-bd", normalizationBasis: "STRUCTURAL_PREREQUISITE_DEPENDENCY" },
  ];
  const result = buildStandardPipeline(pipeline({ officialCurriculumUnits: units, curriculum: curriculumEvidence, prerequisites: prereq, capabilityRequirements: capReq }));

  it("the requirement is rejected for the wrong qualification, and the prerequisite cannot auto-promote", () => {
    expect(findCandidate(result, "bd-capability-subject")!.disposition).not.toBe("FOUNDATIONAL_PREREQUISITE");
    expect(result.gaps.some((g) => g.gapType === "EVIDENCE_NORMALIZATION_REVIEW" && g.unresolved.includes(OTHER_QUAL))).toBe(true);
  });
});

describe("CC-18C case BE -- EXPLICIT_CURRICULUM_OPERATION citing no validated curriculum evidence cannot auto-promote", () => {
  const units: OfficialCurriculumUnit[] = [officialUnit({ curriculumUnitId: "AC-X" })];
  const curriculumEvidence: CurriculumEvidence[] = [curriculum({ subject: "be-target", curriculumUnitId: "AC-X", commandVerbPerformanceType: "CALCULATE", evidenceId: "curr-be" })];
  const targetKey = generateCurriculumCandidates(curriculumEvidence).candidates[0]!.candidateKey;
  const capReq: CandidateCapabilityRequirement[] = [
    capabilityRequirement({ targetSubject: "be-target", targetCandidateKey: targetKey, capabilityKey: "be-capability", derivationKind: "EXPLICIT_CURRICULUM_OPERATION", sourceEvidenceRefs: [] }),
  ];
  const prereq: PrerequisiteEvidence[] = [
    { kind: "STRUCTURAL_PREREQUISITE_DEPENDENCY", evidenceId: "prereq-be", subject: "be-capability-subject", performanceType: "PROCEDURE", capabilityKey: "be-capability", necessaryForCandidateKey: targetKey, minimalDepthJustification: "n/a", sourceRef: "SRC-DEP", sourceLocator: "l-be", normalizationBasis: "STRUCTURAL_PREREQUISITE_DEPENDENCY" },
  ];
  const result = buildStandardPipeline(pipeline({ officialCurriculumUnits: units, curriculum: curriculumEvidence, prerequisites: prereq, capabilityRequirements: capReq }));

  it("the prerequisite is held at REVIEW_REQUIRED", () => {
    expect(findCandidate(result, "be-capability-subject")!.disposition).toBe("REVIEW_REQUIRED");
  });
});

describe("CC-18C case BF -- EXPLICIT_CURRICULUM_OPERATION citing validated OFFICIAL_CURRICULUM evidence MAY auto-promote", () => {
  const units: OfficialCurriculumUnit[] = [officialUnit({ curriculumUnitId: "AC-X" })];
  const curriculumEvidence: CurriculumEvidence[] = [curriculum({ subject: "bf-target", curriculumUnitId: "AC-X", commandVerbPerformanceType: "CALCULATE", evidenceId: "curr-bf" })];
  const targetKey = generateCurriculumCandidates(curriculumEvidence).candidates[0]!.candidateKey;
  const capReq: CandidateCapabilityRequirement[] = [
    capabilityRequirement({ targetSubject: "bf-target", targetCandidateKey: targetKey, capabilityKey: "bf-capability", derivationKind: "EXPLICIT_CURRICULUM_OPERATION", sourceEvidenceRefs: [{ role: "OFFICIAL_CURRICULUM", evidenceId: "curr-bf" }] }),
  ];
  const prereq: PrerequisiteEvidence[] = [
    { kind: "STRUCTURAL_PREREQUISITE_DEPENDENCY", evidenceId: "prereq-bf", subject: "bf-capability-subject", performanceType: "PROCEDURE", capabilityKey: "bf-capability", necessaryForCandidateKey: targetKey, minimalDepthJustification: "n/a", sourceRef: "SRC-DEP", sourceLocator: "l-bf", normalizationBasis: "STRUCTURAL_PREREQUISITE_DEPENDENCY" },
  ];
  const result = buildStandardPipeline(pipeline({ officialCurriculumUnits: units, curriculum: curriculumEvidence, prerequisites: prereq, capabilityRequirements: capReq }));

  it("the prerequisite is promoted to FOUNDATIONAL_PREREQUISITE", () => {
    expect(findCandidate(result, "bf-capability-subject")!.disposition).toBe("FOUNDATIONAL_PREREQUISITE");
  });
});

describe("CC-18C case BG -- EXPLICIT_ASSESSMENT_OPERATION with a colliding evidenceId under the WRONG role cannot auto-promote", () => {
  const units: OfficialCurriculumUnit[] = [officialUnit({ curriculumUnitId: "AC-X" })];
  const curriculumEvidence: CurriculumEvidence[] = [curriculum({ subject: "bg-target", curriculumUnitId: "AC-X", commandVerbPerformanceType: "CALCULATE" })];
  const targetKey = generateCurriculumCandidates(curriculumEvidence).candidates[0]!.candidateKey;
  const validAssessmentItem = assessment({ subject: "bg-assessment-op", performanceType: "PROCEDURE", mappedCurriculumUnitId: "AC-X", evidenceId: "assess-bg-valid" });
  const capReq: CandidateCapabilityRequirement[] = [
    // Colliding evidenceId ("assess-bg-valid" is real and validated) but declared under the WRONG role.
    capabilityRequirement({ targetSubject: "bg-target", targetCandidateKey: targetKey, capabilityKey: "bg-capability", derivationKind: "EXPLICIT_ASSESSMENT_OPERATION", sourceEvidenceRefs: [{ role: "OFFICIAL_CURRICULUM", evidenceId: "assess-bg-valid" }] }),
  ];
  const prereq: PrerequisiteEvidence[] = [
    { kind: "STRUCTURAL_PREREQUISITE_DEPENDENCY", evidenceId: "prereq-bg", subject: "bg-capability-subject", performanceType: "PROCEDURE", capabilityKey: "bg-capability", necessaryForCandidateKey: targetKey, minimalDepthJustification: "n/a", sourceRef: "SRC-DEP", sourceLocator: "l-bg", normalizationBasis: "STRUCTURAL_PREREQUISITE_DEPENDENCY" },
  ];
  const result = buildStandardPipeline(pipeline({ officialCurriculumUnits: units, curriculum: curriculumEvidence, assessment: [validAssessmentItem], prerequisites: prereq, capabilityRequirements: capReq }));

  it("the prerequisite is held at REVIEW_REQUIRED -- a colliding evidenceId never satisfies the role-and-id-matched gate", () => {
    expect(findCandidate(result, "bg-capability-subject")!.disposition).toBe("REVIEW_REQUIRED");
  });
});

describe("CC-18C case BH -- DETERMINISTIC_OPERATIONAL_DEPENDENCY is a deliberate HOLD and never auto-promotes", () => {
  const units: OfficialCurriculumUnit[] = [officialUnit({ curriculumUnitId: "AC-X" })];
  const curriculumEvidence: CurriculumEvidence[] = [curriculum({ subject: "bh-target", curriculumUnitId: "AC-X", commandVerbPerformanceType: "CALCULATE", evidenceId: "curr-bh" })];
  const targetKey = generateCurriculumCandidates(curriculumEvidence).candidates[0]!.candidateKey;
  const capReq: CandidateCapabilityRequirement[] = [
    capabilityRequirement({ targetSubject: "bh-target", targetCandidateKey: targetKey, capabilityKey: "bh-capability", derivationKind: "DETERMINISTIC_OPERATIONAL_DEPENDENCY", sourceEvidenceRefs: [{ role: "OFFICIAL_CURRICULUM", evidenceId: "curr-bh" }] }),
  ];
  const prereq: PrerequisiteEvidence[] = [
    { kind: "STRUCTURAL_PREREQUISITE_DEPENDENCY", evidenceId: "prereq-bh", subject: "bh-capability-subject", performanceType: "PROCEDURE", capabilityKey: "bh-capability", necessaryForCandidateKey: targetKey, minimalDepthJustification: "n/a", sourceRef: "SRC-DEP", sourceLocator: "l-bh", normalizationBasis: "STRUCTURAL_PREREQUISITE_DEPENDENCY" },
  ];
  const result = buildStandardPipeline(pipeline({ officialCurriculumUnits: units, curriculum: curriculumEvidence, prerequisites: prereq, capabilityRequirements: capReq }));

  it("held at REVIEW_REQUIRED even though it structurally cites real, validated evidence -- no self-authorising registry exists yet", () => {
    expect(findCandidate(result, "bh-capability-subject")!.disposition).toBe("REVIEW_REQUIRED");
  });
});

describe("CC-18C case BI -- a foreign-qualification CandidateFactRequirement creates no requiredFactKey", () => {
  const units: OfficialCurriculumUnit[] = [officialUnit({ curriculumUnitId: "AC-X" })];
  const curriculumEvidence: CurriculumEvidence[] = [curriculum({ subject: "bi-topic", curriculumUnitId: "AC-X", evidenceId: "curr-bi" })];
  const key = generateCurriculumCandidates(curriculumEvidence).candidates[0]!.candidateKey;
  const factReqs: CandidateFactRequirement[] = [
    factRequirement({ targetCandidateKey: key, claimKey: "bi-fact", qualificationId: OTHER_QUAL, sourceEvidenceRefs: [{ role: "OFFICIAL_CURRICULUM", evidenceId: "curr-bi" }] }),
  ];
  const claims: SourceFactualClaim[] = [factualClaim({ claimKey: "bi-fact", subject: "bi-topic", sourceRole: "TECHNICAL_TRUTH", normalizedClaimValue: "some value" })];
  const result = buildStandardPipeline(pipeline({ officialCurriculumUnits: units, curriculum: curriculumEvidence, factRequirements: factReqs, factualClaims: claims }));

  it("the candidate has no requiredFactKeys and coverage is UNRESOLVED_REQUIREMENTS (CC-20 -- never a false-green NOT_REQUIRED)", () => {
    const c = findCandidate(result, "bi-topic")!;
    expect(c.requiredFactKeys ?? []).toEqual([]);
    expect(c.technicalCoverageStatus).toBe("UNRESOLVED_REQUIREMENTS");
  });

  it("emits EVIDENCE_NORMALIZATION_REVIEW naming the foreign qualification", () => {
    expect(result.gaps.some((g) => g.gapType === "EVIDENCE_NORMALIZATION_REVIEW" && g.unresolved.includes(OTHER_QUAL))).toBe(true);
  });
});

describe("CC-18C case BJ -- a REVIEW_PROPOSED fact requirement is visible for review but never enters requiredFactKeys", () => {
  const units: OfficialCurriculumUnit[] = [officialUnit({ curriculumUnitId: "AC-X" })];
  const curriculumEvidence: CurriculumEvidence[] = [curriculum({ subject: "bj-topic", curriculumUnitId: "AC-X" })];
  const key = generateCurriculumCandidates(curriculumEvidence).candidates[0]!.candidateKey;
  const factReqs: CandidateFactRequirement[] = [factRequirement({ targetCandidateKey: key, claimKey: "bj-fact", derivationStatus: "REVIEW_PROPOSED" })];
  const claims: SourceFactualClaim[] = [factualClaim({ claimKey: "bj-fact", subject: "bj-topic", sourceRole: "TECHNICAL_TRUTH", normalizedClaimValue: "some value" })];
  const result = buildStandardPipeline(pipeline({ officialCurriculumUnits: units, curriculum: curriculumEvidence, factRequirements: factReqs, factualClaims: claims }));

  it("does not contribute a requiredFactKey, and is flagged ADJUDICATION_REQUIRED (CC-20) rather than falsely NOT_REQUIRED", () => {
    const c = findCandidate(result, "bj-topic")!;
    expect(c.requiredFactKeys ?? []).toEqual([]);
    expect(c.technicalCoverageStatus).toBe("UNRESOLVED_REQUIREMENTS");
    expect(c.knowledgeBoundaryStatus).toBe("ADJUDICATION_REQUIRED");
  });

  it("is nonetheless visible via an EVIDENCE_NORMALIZATION_REVIEW gap", () => {
    expect(result.gaps.some((g) => g.gapType === "EVIDENCE_NORMALIZATION_REVIEW" && g.unresolved.includes("REVIEW_PROPOSED"))).toBe(true);
  });
});

describe("CC-18C case BK -- EXPLICIT_CURRICULUM_FACT with no validated curriculum source is rejected and reviewed", () => {
  const units: OfficialCurriculumUnit[] = [officialUnit({ curriculumUnitId: "AC-X" })];
  const curriculumEvidence: CurriculumEvidence[] = [curriculum({ subject: "bk-topic", curriculumUnitId: "AC-X" })];
  const key = generateCurriculumCandidates(curriculumEvidence).candidates[0]!.candidateKey;
  const factReqs: CandidateFactRequirement[] = [factRequirement({ targetCandidateKey: key, claimKey: "bk-fact", derivationStatus: "EXPLICIT_CURRICULUM_FACT", sourceEvidenceRefs: [] })];
  const claims: SourceFactualClaim[] = [factualClaim({ claimKey: "bk-fact", subject: "bk-topic", sourceRole: "TECHNICAL_TRUTH", normalizedClaimValue: "some value" })];
  const result = buildStandardPipeline(pipeline({ officialCurriculumUnits: units, curriculum: curriculumEvidence, factRequirements: factReqs, factualClaims: claims }));

  it("the fact is never counted as required or covered", () => {
    const c = findCandidate(result, "bk-topic")!;
    expect(c.requiredFactKeys ?? []).toEqual([]);
    expect(c.technicalCoverageStatus).toBe("UNRESOLVED_REQUIREMENTS");
  });

  it("is reported via EVIDENCE_NORMALIZATION_REVIEW", () => {
    expect(result.gaps.some((g) => g.gapType === "EVIDENCE_NORMALIZATION_REVIEW" && g.unresolved.includes("EXPLICIT_CURRICULUM_FACT"))).toBe(true);
  });
});

describe("CC-18C case BL -- EXPLICIT_ASSESSMENT_FACT citing a REJECTED assessment source is rejected and reviewed", () => {
  const units: OfficialCurriculumUnit[] = [officialUnit({ curriculumUnitId: "AC-X" })];
  const curriculumEvidence: CurriculumEvidence[] = [curriculum({ subject: "bl-topic", curriculumUnitId: "AC-X" })];
  const key = generateCurriculumCandidates(curriculumEvidence).candidates[0]!.candidateKey;
  const rejectedItem = assessment({ subject: "bl-topic", performanceType: "OTHER", mappedCurriculumUnitId: "AC-FAKE", evidenceId: "assess-bl-rejected" });
  const factReqs: CandidateFactRequirement[] = [
    factRequirement({ targetCandidateKey: key, claimKey: "bl-fact", derivationStatus: "EXPLICIT_ASSESSMENT_FACT", sourceEvidenceRefs: [{ role: "PUBLIC_ASSESSMENT", evidenceId: "assess-bl-rejected" }] }),
  ];
  const claims: SourceFactualClaim[] = [factualClaim({ claimKey: "bl-fact", subject: "bl-topic", sourceRole: "TECHNICAL_TRUTH", normalizedClaimValue: "some value" })];
  const result = buildStandardPipeline(pipeline({ officialCurriculumUnits: units, curriculum: curriculumEvidence, assessment: [rejectedItem], factRequirements: factReqs, factualClaims: claims }));

  it("the fact is never counted as required or covered", () => {
    const c = findCandidate(result, "bl-topic")!;
    expect(c.requiredFactKeys ?? []).toEqual([]);
    expect(c.technicalCoverageStatus).toBe("UNRESOLVED_REQUIREMENTS");
  });

  it("is reported via EVIDENCE_NORMALIZATION_REVIEW", () => {
    expect(result.gaps.some((g) => g.gapType === "EVIDENCE_NORMALIZATION_REVIEW" && g.unresolved.includes("EXPLICIT_ASSESSMENT_FACT"))).toBe(true);
  });
});

describe("CC-18C case BM -- two AGREEING TECHNICAL_TRUTH claims for the same (subject, claimKey) attach with both evidence refs preserved", () => {
  const units: OfficialCurriculumUnit[] = [officialUnit({ curriculumUnitId: "AC-X" })];
  const curriculumEvidence: CurriculumEvidence[] = [curriculum({ subject: "bm-topic", curriculumUnitId: "AC-X", evidenceId: "curr-bm" })];
  const key = generateCurriculumCandidates(curriculumEvidence).candidates[0]!.candidateKey;
  const factReqs: CandidateFactRequirement[] = [factRequirement({ targetCandidateKey: key, claimKey: "bm-fact", sourceEvidenceRefs: [{ role: "OFFICIAL_CURRICULUM", evidenceId: "curr-bm" }] })];
  const claims: SourceFactualClaim[] = [
    factualClaim({ claimKey: "bm-fact", subject: "bm-topic", sourceRole: "TECHNICAL_TRUTH", normalizedClaimValue: "agreed-value", evidenceId: "truth-bm-1" }),
    factualClaim({ claimKey: "bm-fact", subject: "bm-topic", sourceRole: "TECHNICAL_TRUTH", normalizedClaimValue: "agreed-value", evidenceId: "truth-bm-2" }),
  ];
  const result = buildStandardPipeline(pipeline({ officialCurriculumUnits: units, curriculum: curriculumEvidence, factRequirements: factReqs, factualClaims: claims }));

  it("attaches the agreed value and reaches COMPLETE coverage", () => {
    const c = findCandidate(result, "bm-topic")!;
    expect(c.factualStatementsByClaimKey?.["bm-fact"]).toBe("agreed-value");
    expect(c.technicalCoverageStatus).toBe("COMPLETE");
  });

  it("preserves BOTH supporting evidence refs", () => {
    const c = findCandidate(result, "bm-topic")!;
    expect(c.evidenceRefs.some((r) => r.evidenceId === "truth-bm-1")).toBe(true);
    expect(c.evidenceRefs.some((r) => r.evidenceId === "truth-bm-2")).toBe(true);
  });

  it("emits no TECHNICAL_TRUTH_CONFLICT_REVIEW or FACTUAL_COMPARISON_REVIEW", () => {
    expect(result.gaps.some((g) => g.gapType === "TECHNICAL_TRUTH_CONFLICT_REVIEW" || g.gapType === "FACTUAL_COMPARISON_REVIEW")).toBe(false);
  });
});

describe("CC-18C cases BN/BO -- disagreeing same-kind TECHNICAL_TRUTH claims never arbitrarily resolve, regardless of source order", () => {
  const units: OfficialCurriculumUnit[] = [officialUnit({ curriculumUnitId: "AC-X" })];
  const curriculumEvidence: CurriculumEvidence[] = [curriculum({ subject: "bn-topic", curriculumUnitId: "AC-X", evidenceId: "curr-bn" })];
  const key = generateCurriculumCandidates(curriculumEvidence).candidates[0]!.candidateKey;
  const factReqs: CandidateFactRequirement[] = [factRequirement({ targetCandidateKey: key, claimKey: "bn-fact", sourceEvidenceRefs: [{ role: "OFFICIAL_CURRICULUM", evidenceId: "curr-bn" }] })];
  const forward: SourceFactualClaim[] = [
    factualClaim({ claimKey: "bn-fact", subject: "bn-topic", sourceRole: "TECHNICAL_TRUTH", normalizedClaimValue: "value-1", evidenceId: "truth-bn-1" }),
    factualClaim({ claimKey: "bn-fact", subject: "bn-topic", sourceRole: "TECHNICAL_TRUTH", normalizedClaimValue: "value-2", evidenceId: "truth-bn-2" }),
  ];
  const reversed = [...forward].reverse();

  it("[BN] forward order: emits TECHNICAL_TRUTH_CONFLICT_REVIEW, does not attach, does not cover", () => {
    const result = buildStandardPipeline(pipeline({ officialCurriculumUnits: units, curriculum: curriculumEvidence, factRequirements: factReqs, factualClaims: forward }));
    const c = findCandidate(result, "bn-topic")!;
    expect(c.factualStatementsByClaimKey?.["bn-fact"]).toBeUndefined();
    // CC-20 section 15: a disputed required fact is CONFLICTED, distinct from PARTIAL.
    expect(c.technicalCoverageStatus).toBe("CONFLICTED");
    expect(result.gaps.some((g) => g.gapType === "TECHNICAL_TRUTH_CONFLICT_REVIEW")).toBe(true);
  });

  it("[BO] reversed order produces an IDENTICAL result -- no arbitrary pick, never source-order-dependent", () => {
    const r1 = buildStandardPipeline(pipeline({ officialCurriculumUnits: units, curriculum: curriculumEvidence, factRequirements: factReqs, factualClaims: forward }));
    const r2 = buildStandardPipeline(pipeline({ officialCurriculumUnits: units, curriculum: curriculumEvidence, factRequirements: factReqs, factualClaims: reversed }));
    expect(findCandidate(r1, "bn-topic")!.factualStatementsByClaimKey).toEqual(findCandidate(r2, "bn-topic")!.factualStatementsByClaimKey);
    expect(findCandidate(r1, "bn-topic")!.technicalCoverageStatus).toBe(findCandidate(r2, "bn-topic")!.technicalCoverageStatus);
    expect(r2.gaps.some((g) => g.gapType === "TECHNICAL_TRUTH_CONFLICT_REVIEW")).toBe(true);
  });
});

describe("CC-18C case BP -- multiple TECHNICAL_TRUTH claims with incompatible comparison kinds are never compared; fact stays unresolved", () => {
  const units: OfficialCurriculumUnit[] = [officialUnit({ curriculumUnitId: "AC-X" })];
  const curriculumEvidence: CurriculumEvidence[] = [curriculum({ subject: "bp-topic", curriculumUnitId: "AC-X", evidenceId: "curr-bp" })];
  const key = generateCurriculumCandidates(curriculumEvidence).candidates[0]!.candidateKey;
  const factReqs: CandidateFactRequirement[] = [factRequirement({ targetCandidateKey: key, claimKey: "bp-fact", sourceEvidenceRefs: [{ role: "OFFICIAL_CURRICULUM", evidenceId: "curr-bp" }] })];
  const claims: SourceFactualClaim[] = [
    factualClaim({ claimKey: "bp-fact", subject: "bp-topic", sourceRole: "TECHNICAL_TRUTH", normalizedClaimValue: "some canonical prose", comparisonKind: "CANONICAL_TEXT", evidenceId: "truth-bp-1" }),
    factualClaim({ claimKey: "bp-fact", subject: "bp-topic", sourceRole: "TECHNICAL_TRUTH", normalizedClaimValue: "42", comparisonKind: "NUMBER_WITH_UNIT", evidenceId: "truth-bp-2" }),
  ];
  const result = buildStandardPipeline(pipeline({ officialCurriculumUnits: units, curriculum: curriculumEvidence, factRequirements: factReqs, factualClaims: claims }));

  it("emits FACTUAL_COMPARISON_REVIEW and leaves the fact unresolved/uncovered", () => {
    const c = findCandidate(result, "bp-topic")!;
    expect(c.factualStatementsByClaimKey?.["bp-fact"]).toBeUndefined();
    // CC-20 section 15: an incompatible-comparison-kind dispute is CONFLICTED, distinct from PARTIAL.
    expect(c.technicalCoverageStatus).toBe("CONFLICTED");
    expect(result.gaps.some((g) => g.gapType === "FACTUAL_COMPARISON_REVIEW")).toBe(true);
  });
});

describe("CC-18C case BQ -- one resolved fact plus one disputed required fact caps coverage at CONFLICTED, never COMPLETE (CC-20: CONFLICTED, not PARTIAL)", () => {
  const units: OfficialCurriculumUnit[] = [officialUnit({ curriculumUnitId: "AC-X" })];
  const curriculumEvidence: CurriculumEvidence[] = [curriculum({ subject: "bq-topic", curriculumUnitId: "AC-X", evidenceId: "curr-bq" })];
  const key = generateCurriculumCandidates(curriculumEvidence).candidates[0]!.candidateKey;
  const citation = [{ role: "OFFICIAL_CURRICULUM" as const, evidenceId: "curr-bq" }];
  const factReqs: CandidateFactRequirement[] = [
    factRequirement({ targetCandidateKey: key, claimKey: "bq-fact-a", sourceEvidenceRefs: citation }),
    factRequirement({ targetCandidateKey: key, claimKey: "bq-fact-b", sourceEvidenceRefs: citation }),
  ];
  const claims: SourceFactualClaim[] = [
    factualClaim({ claimKey: "bq-fact-a", subject: "bq-topic", sourceRole: "TECHNICAL_TRUTH", normalizedClaimValue: "undisputed-value" }),
    factualClaim({ claimKey: "bq-fact-b", subject: "bq-topic", sourceRole: "TECHNICAL_TRUTH", normalizedClaimValue: "disputed-value-1" }),
    factualClaim({ claimKey: "bq-fact-b", subject: "bq-topic", sourceRole: "TECHNICAL_TRUTH", normalizedClaimValue: "disputed-value-2" }),
  ];
  const result = buildStandardPipeline(pipeline({ officialCurriculumUnits: units, curriculum: curriculumEvidence, factRequirements: factReqs, factualClaims: claims }));

  it("fact-a attaches, fact-b stays unresolved, coverage is CONFLICTED and technicalTruthConfidence is never HIGH", () => {
    const c = findCandidate(result, "bq-topic")!;
    expect(c.factualStatementsByClaimKey?.["bq-fact-a"]).toBe("undisputed-value");
    expect(c.factualStatementsByClaimKey?.["bq-fact-b"]).toBeUndefined();
    expect(c.technicalCoverageStatus).toBe("CONFLICTED");
    expect(c.confidence.technicalTruthConfidence).not.toBe("HIGH");
  });
});

describe("CC-18C case BR -- a DEPTH_QUALIFIER explicitly targeting one performance type affects ONLY that candidate", () => {
  const units: OfficialCurriculumUnit[] = [officialUnit({ curriculumUnitId: "AC-X" })];
  const curriculumEvidence: CurriculumEvidence[] = [
    curriculum({ subject: "br-topic", curriculumUnitId: "AC-X", normalizationKind: "PRIMARY_REQUIREMENT", commandVerbPerformanceType: "IDENTIFY" }),
    curriculum({ subject: "br-topic", curriculumUnitId: "AC-X", normalizationKind: "PRIMARY_REQUIREMENT", commandVerbPerformanceType: "CALCULATE" }),
    curriculum({ subject: "br-topic", curriculumUnitId: "AC-X", normalizationKind: "DEPTH_QUALIFIER", refinesSubject: "br-topic", refinesPerformanceType: "CALCULATE" }),
  ];
  const result = buildStandardPipeline(pipeline({ officialCurriculumUnits: units, curriculum: curriculumEvidence }));

  it("CALCULATE gains depth confidence; IDENTIFY does not", () => {
    // CC-20 section 17: an explicit, resolved depth qualifier is HIGH confidence.
    expect(findCandidate(result, "br-topic", "CALCULATE")!.confidence.depthConfidence).toBe("HIGH");
    expect(findCandidate(result, "br-topic", "IDENTIFY")!.confidence.depthConfidence).toBe("NONE");
  });
});

describe("CC-18C case BS -- an ambiguous DEPTH_QUALIFIER (multiple performance types, no explicit target) never applies broadly, and is reviewed", () => {
  const units: OfficialCurriculumUnit[] = [officialUnit({ curriculumUnitId: "AC-X" })];
  const curriculumEvidence: CurriculumEvidence[] = [
    curriculum({ subject: "bs-topic", curriculumUnitId: "AC-X", normalizationKind: "PRIMARY_REQUIREMENT", commandVerbPerformanceType: "IDENTIFY" }),
    curriculum({ subject: "bs-topic", curriculumUnitId: "AC-X", normalizationKind: "PRIMARY_REQUIREMENT", commandVerbPerformanceType: "CALCULATE" }),
    curriculum({ subject: "bs-topic", curriculumUnitId: "AC-X", normalizationKind: "DEPTH_QUALIFIER", refinesSubject: "bs-topic" }), // no refinesPerformanceType -- ambiguous
  ];
  const result = buildStandardPipeline(pipeline({ officialCurriculumUnits: units, curriculum: curriculumEvidence }));

  it("neither candidate gains depth confidence from the ambiguous qualifier", () => {
    expect(findCandidate(result, "bs-topic", "IDENTIFY")!.confidence.depthConfidence).toBe("NONE");
    expect(findCandidate(result, "bs-topic", "CALCULATE")!.confidence.depthConfidence).toBe("NONE");
  });

  it("emits an EVIDENCE_NORMALIZATION_REVIEW gap instead of silently applying broadly", () => {
    expect(result.gaps.some((g) => g.gapType === "EVIDENCE_NORMALIZATION_REVIEW" && g.unresolved.includes("DEPTH_QUALIFIER"))).toBe(true);
  });
});

// =====================================================================
// CC-20 cases A-T -- semantic adjudication and knowledge-boundary
// hardening, derived from explicit Project-Architect decisions following
// the blind back-test. Fixtures are synthetic, chosen for readability
// only, never drawn from any real qualification's governed content.
// =====================================================================

describe("CC-20 case A -- required leaf, zero fact requirements, no decomposition -> UNRESOLVED, KNOWLEDGE_DECOMPOSITION_GAP, never NOT_APPLICABLE", () => {
  const units: OfficialCurriculumUnit[] = [officialUnit({ curriculumUnitId: "AC-X" })];
  const curriculumEvidence: CurriculumEvidence[] = [curriculum({ subject: "c20a-leaf-topic", curriculumUnitId: "AC-X" })];
  const result = buildStandardPipeline(pipeline({ officialCurriculumUnits: units, curriculum: curriculumEvidence }));

  it("knowledgeBoundaryStatus is UNRESOLVED and technicalCoverageStatus is never NOT_APPLICABLE", () => {
    const c = findCandidate(result, "c20a-leaf-topic")!;
    expect(c.knowledgeBoundaryStatus).toBe("UNRESOLVED");
    expect(c.technicalCoverageStatus).toBe("UNRESOLVED_REQUIREMENTS");
    expect(c.technicalCoverageStatus).not.toBe("NOT_APPLICABLE");
  });

  it("emits KNOWLEDGE_DECOMPOSITION_GAP for this exact candidate", () => {
    const key = findCandidate(result, "c20a-leaf-topic")!.candidateKey;
    expect(result.gaps.some((g) => g.gapType === "KNOWLEDGE_DECOMPOSITION_GAP" && g.candidateKey === key)).toBe(true);
  });
});

describe("CC-20 case B -- a structural parent with governed children and no own facts is STRUCTURALLY_DECOMPOSED, never a false decomposition gap", () => {
  const units: OfficialCurriculumUnit[] = [officialUnit({ curriculumUnitId: "AC-X" })];
  const curriculumEvidence: CurriculumEvidence[] = [
    // CC-20A section 9: only a validated RANGE_CATEGORY parent is eligible to be treated as explicitly structural.
    curriculum({ subject: "c20b-parent", curriculumUnitId: "AC-X", normalizationKind: "RANGE_CATEGORY" }),
    curriculum({ subject: "c20b-child", curriculumUnitId: "AC-X", normalizationKind: "RANGE_REQUIRED_MEMBER", refinesSubject: "c20b-parent" }),
  ];
  const result = buildStandardPipeline(pipeline({ officialCurriculumUnits: units, curriculum: curriculumEvidence }));

  it("the parent is STRUCTURALLY_DECOMPOSED with technicalCoverageStatus NOT_APPLICABLE", () => {
    const parent = findCandidate(result, "c20b-parent")!;
    expect(parent.knowledgeBoundaryStatus).toBe("STRUCTURALLY_DECOMPOSED");
    expect(parent.technicalCoverageStatus).toBe("NOT_APPLICABLE");
  });

  it("emits no KNOWLEDGE_DECOMPOSITION_GAP for the parent (detected from the governed relationship, never a topic string)", () => {
    const parentKey = findCandidate(result, "c20b-parent")!.candidateKey;
    expect(result.gaps.some((g) => g.gapType === "KNOWLEDGE_DECOMPOSITION_GAP" && g.candidateKey === parentKey)).toBe(false);
  });
});

describe("CC-20 case C -- a REVIEW_PROPOSED fact with an exact TECHNICAL_TRUTH claim but no adjudication remains non-governing", () => {
  const units: OfficialCurriculumUnit[] = [officialUnit({ curriculumUnitId: "AC-X" })];
  const curriculumEvidence: CurriculumEvidence[] = [curriculum({ subject: "c20c-topic", curriculumUnitId: "AC-X" })];
  const key = generateCurriculumCandidates(curriculumEvidence).candidates[0]!.candidateKey;
  const factReqs: CandidateFactRequirement[] = [factRequirement({ targetCandidateKey: key, claimKey: "c20c-fact", derivationStatus: "REVIEW_PROPOSED" })];
  const claims: SourceFactualClaim[] = [factualClaim({ claimKey: "c20c-fact", subject: "c20c-topic", sourceRole: "TECHNICAL_TRUTH", normalizedClaimValue: "some value" })];
  const result = buildStandardPipeline(pipeline({ officialCurriculumUnits: units, curriculum: curriculumEvidence, factRequirements: factReqs, factualClaims: claims }));

  it("does not enter requiredFactKeys and is flagged ADJUDICATION_REQUIRED", () => {
    const c = findCandidate(result, "c20c-topic")!;
    expect(c.requiredFactKeys ?? []).toEqual([]);
    expect(c.knowledgeBoundaryStatus).toBe("ADJUDICATION_REQUIRED");
  });
});

describe("CC-20 case D -- the same proposal plus a valid REQUIRED_CORE adjudication promotes the fact to governing, with technical coverage attached", () => {
  const units: OfficialCurriculumUnit[] = [officialUnit({ curriculumUnitId: "AC-X" })];
  const curriculumEvidence: CurriculumEvidence[] = [curriculum({ subject: "c20d-topic", curriculumUnitId: "AC-X", evidenceId: "curr-c20d" })];
  const key = generateCurriculumCandidates(curriculumEvidence).candidates[0]!.candidateKey;
  const factReqs: CandidateFactRequirement[] = [factRequirement({ targetCandidateKey: key, claimKey: "c20d-fact", derivationStatus: "REVIEW_PROPOSED" })];
  const claims: SourceFactualClaim[] = [factualClaim({ claimKey: "c20d-fact", subject: "c20d-topic", sourceRole: "TECHNICAL_TRUTH", normalizedClaimValue: "some value" })];
  // CC-20A: a governing adjudication needs real supportingEvidenceRefs resolving to the exact target candidate.
  const adjudications: SemanticAdjudication[] = [
    semanticAdjudication({ targetCandidateKey: key, claimKey: "c20d-fact", decision: "REQUIRED_CORE", supportingEvidenceRefs: [{ role: "OFFICIAL_CURRICULUM", evidenceId: "curr-c20d" }] }),
  ];
  const result = buildStandardPipeline(pipeline({ officialCurriculumUnits: units, curriculum: curriculumEvidence, factRequirements: factReqs, factualClaims: claims, semanticAdjudications: adjudications }));

  it("promotes the fact into requiredFactKeys with COMPLETE technical coverage and GOVERNED boundary", () => {
    const c = findCandidate(result, "c20d-topic")!;
    expect(c.requiredFactKeys).toEqual(["c20d-fact"]);
    expect(c.technicalCoverageStatus).toBe("COMPLETE");
    expect(c.knowledgeBoundaryStatus).toBe("GOVERNED");
  });

  it("does not widen scope confidence beyond what curriculum evidence already established", () => {
    expect(findCandidate(result, "c20d-topic")!.confidence.scopeConfidence).toBe("HIGH");
  });

  it("the adjudication is recorded in semanticAdjudicationOutcomes", () => {
    expect(result.semanticAdjudicationOutcomes.some((a) => a.claimKey === "c20d-fact" && a.decision === "REQUIRED_CORE")).toBe(true);
  });
});

describe("CC-20 case E -- a REQUIRED_CORE adjudication promotes the fact even with no matching technical truth, but coverage stays incomplete", () => {
  const units: OfficialCurriculumUnit[] = [officialUnit({ curriculumUnitId: "AC-X" })];
  const curriculumEvidence: CurriculumEvidence[] = [curriculum({ subject: "c20e-topic", curriculumUnitId: "AC-X", evidenceId: "curr-c20e" })];
  const key = generateCurriculumCandidates(curriculumEvidence).candidates[0]!.candidateKey;
  const factReqs: CandidateFactRequirement[] = [factRequirement({ targetCandidateKey: key, claimKey: "c20e-fact", derivationStatus: "REVIEW_PROPOSED" })];
  const adjudications: SemanticAdjudication[] = [
    semanticAdjudication({ targetCandidateKey: key, claimKey: "c20e-fact", decision: "REQUIRED_CORE", supportingEvidenceRefs: [{ role: "OFFICIAL_CURRICULUM", evidenceId: "curr-c20e" }] }),
  ];
  const result = buildStandardPipeline(pipeline({ officialCurriculumUnits: units, curriculum: curriculumEvidence, factRequirements: factReqs, semanticAdjudications: adjudications }));

  it("the fact governs but technical coverage never reaches COMPLETE", () => {
    const c = findCandidate(result, "c20e-topic")!;
    expect(c.requiredFactKeys).toEqual(["c20e-fact"]);
    expect(c.technicalCoverageStatus).not.toBe("COMPLETE");
  });

  it("emits a TECHNICAL_TRUTH_GAP for this candidate", () => {
    const c = findCandidate(result, "c20e-topic")!;
    expect(result.gaps.some((g) => g.gapType === "TECHNICAL_TRUTH_GAP" && g.candidateKey === c.candidateKey)).toBe(true);
  });
});

describe("CC-20 case F -- a REQUIRED_OPERATIONAL adjudication with a valid proposal also promotes the fact", () => {
  const units: OfficialCurriculumUnit[] = [officialUnit({ curriculumUnitId: "AC-X" })];
  const curriculumEvidence: CurriculumEvidence[] = [curriculum({ subject: "c20f-topic", curriculumUnitId: "AC-X", evidenceId: "curr-c20f" })];
  const key = generateCurriculumCandidates(curriculumEvidence).candidates[0]!.candidateKey;
  const factReqs: CandidateFactRequirement[] = [factRequirement({ targetCandidateKey: key, claimKey: "c20f-fact", derivationStatus: "REVIEW_PROPOSED" })];
  const claims: SourceFactualClaim[] = [factualClaim({ claimKey: "c20f-fact", subject: "c20f-topic", sourceRole: "TECHNICAL_TRUTH", normalizedClaimValue: "operational value" })];
  const adjudications: SemanticAdjudication[] = [
    semanticAdjudication({
      targetCandidateKey: key,
      claimKey: "c20f-fact",
      decision: "REQUIRED_OPERATIONAL",
      adjudicationBasis: ["OPERATIONAL_NECESSITY"],
      supportingEvidenceRefs: [{ role: "OFFICIAL_CURRICULUM", evidenceId: "curr-c20f" }],
    }),
  ];
  const result = buildStandardPipeline(pipeline({ officialCurriculumUnits: units, curriculum: curriculumEvidence, factRequirements: factReqs, factualClaims: claims, semanticAdjudications: adjudications }));

  it("promotes the fact into requiredFactKeys", () => {
    expect(findCandidate(result, "c20f-topic")!.requiredFactKeys).toEqual(["c20f-fact"]);
  });
});

describe("CC-20 case G -- a REPRESENTATIVE_EXEMPLAR adjudication is exposed separately, never enters requiredFactKeys", () => {
  const units: OfficialCurriculumUnit[] = [officialUnit({ curriculumUnitId: "AC-X" })];
  const curriculumEvidence: CurriculumEvidence[] = [curriculum({ subject: "c20g-topic", curriculumUnitId: "AC-X" })];
  const key = generateCurriculumCandidates(curriculumEvidence).candidates[0]!.candidateKey;
  const factReqs: CandidateFactRequirement[] = [factRequirement({ targetCandidateKey: key, claimKey: "c20g-fact", derivationStatus: "REVIEW_PROPOSED" })];
  const adjudications: SemanticAdjudication[] = [semanticAdjudication({ targetCandidateKey: key, claimKey: "c20g-fact", decision: "REPRESENTATIVE_EXEMPLAR", adjudicationBasis: ["REPRESENTATIVE_EXEMPLAR_SELECTION"] })];
  const result = buildStandardPipeline(pipeline({ officialCurriculumUnits: units, curriculum: curriculumEvidence, factRequirements: factReqs, semanticAdjudications: adjudications }));

  it("never enters requiredFactKeys and never raises scope/depth confidence", () => {
    const c = findCandidate(result, "c20g-topic")!;
    expect(c.requiredFactKeys ?? []).toEqual([]);
    expect(c.confidence.scopeConfidence).toBe("HIGH"); // unchanged from curriculum evidence alone
  });

  it("is exposed in representativeExemplars", () => {
    expect(result.representativeExemplars).toEqual([expect.objectContaining({ candidateKey: key, claimKey: "c20g-fact" })]);
  });

  it("is also recorded in semanticAdjudicationOutcomes", () => {
    expect(result.semanticAdjudicationOutcomes.some((a) => a.claimKey === "c20g-fact" && a.decision === "REPRESENTATIVE_EXEMPLAR")).toBe(true);
  });
});

describe("CC-20 cases H/I/J -- CONTEXT_ONLY/REJECT_OVERDEPTH/REJECT_NOT_NECESSARY remain non-governing but are preserved in audit output", () => {
  function nonGoverningCase(decision: "CONTEXT_ONLY" | "REJECT_OVERDEPTH" | "REJECT_NOT_NECESSARY", topic: string, claimKey: string) {
    const units: OfficialCurriculumUnit[] = [officialUnit({ curriculumUnitId: "AC-X" })];
    const curriculumEvidence: CurriculumEvidence[] = [curriculum({ subject: topic, curriculumUnitId: "AC-X" })];
    const key = generateCurriculumCandidates(curriculumEvidence).candidates[0]!.candidateKey;
    const factReqs: CandidateFactRequirement[] = [factRequirement({ targetCandidateKey: key, claimKey, derivationStatus: "REVIEW_PROPOSED" })];
    const adjudications: SemanticAdjudication[] = [semanticAdjudication({ targetCandidateKey: key, claimKey, decision })];
    return buildStandardPipeline(pipeline({ officialCurriculumUnits: units, curriculum: curriculumEvidence, factRequirements: factReqs, semanticAdjudications: adjudications }));
  }

  it("[H] CONTEXT_ONLY is non-governing but preserved", () => {
    const result = nonGoverningCase("CONTEXT_ONLY", "c20h-topic", "c20h-fact");
    expect(findCandidate(result, "c20h-topic")!.requiredFactKeys ?? []).toEqual([]);
    expect(result.semanticAdjudicationOutcomes.some((a) => a.claimKey === "c20h-fact" && a.decision === "CONTEXT_ONLY")).toBe(true);
  });

  it("[I] REJECT_OVERDEPTH is non-governing but preserved", () => {
    const result = nonGoverningCase("REJECT_OVERDEPTH", "c20i-topic", "c20i-fact");
    expect(findCandidate(result, "c20i-topic")!.requiredFactKeys ?? []).toEqual([]);
    expect(result.semanticAdjudicationOutcomes.some((a) => a.claimKey === "c20i-fact" && a.decision === "REJECT_OVERDEPTH")).toBe(true);
  });

  it("[J] REJECT_NOT_NECESSARY is non-governing but preserved", () => {
    const result = nonGoverningCase("REJECT_NOT_NECESSARY", "c20j-topic", "c20j-fact");
    expect(findCandidate(result, "c20j-topic")!.requiredFactKeys ?? []).toEqual([]);
    expect(result.semanticAdjudicationOutcomes.some((a) => a.claimKey === "c20j-fact" && a.decision === "REJECT_NOT_NECESSARY")).toBe(true);
  });
});

describe("CC-20 case K -- an UNRESOLVED adjudication emits SEMANTIC_ADJUDICATION_GAP and never governs", () => {
  const units: OfficialCurriculumUnit[] = [officialUnit({ curriculumUnitId: "AC-X" })];
  const curriculumEvidence: CurriculumEvidence[] = [curriculum({ subject: "c20k-topic", curriculumUnitId: "AC-X" })];
  const key = generateCurriculumCandidates(curriculumEvidence).candidates[0]!.candidateKey;
  const factReqs: CandidateFactRequirement[] = [factRequirement({ targetCandidateKey: key, claimKey: "c20k-fact", derivationStatus: "REVIEW_PROPOSED" })];
  const adjudications: SemanticAdjudication[] = [semanticAdjudication({ targetCandidateKey: key, claimKey: "c20k-fact", decision: "UNRESOLVED", adjudicationBasis: ["INSUFFICIENT_EVIDENCE"] })];
  const result = buildStandardPipeline(pipeline({ officialCurriculumUnits: units, curriculum: curriculumEvidence, factRequirements: factReqs, semanticAdjudications: adjudications }));

  it("never governs", () => {
    expect(findCandidate(result, "c20k-topic")!.requiredFactKeys ?? []).toEqual([]);
  });

  it("emits SEMANTIC_ADJUDICATION_GAP", () => {
    const c = findCandidate(result, "c20k-topic")!;
    expect(result.gaps.some((g) => g.gapType === "SEMANTIC_ADJUDICATION_GAP" && g.candidateKey === c.candidateKey)).toBe(true);
  });
});

describe("CC-20 case L -- an adjudication referencing a nonexistent claimKey is rejected, never creates a fact", () => {
  const units: OfficialCurriculumUnit[] = [officialUnit({ curriculumUnitId: "AC-X" })];
  const curriculumEvidence: CurriculumEvidence[] = [curriculum({ subject: "c20l-topic", curriculumUnitId: "AC-X" })];
  const key = generateCurriculumCandidates(curriculumEvidence).candidates[0]!.candidateKey;
  // No CandidateFactRequirement proposal exists for "c20l-fact" at all.
  const adjudications: SemanticAdjudication[] = [semanticAdjudication({ targetCandidateKey: key, claimKey: "c20l-fact", decision: "REQUIRED_CORE" })];
  const result = buildStandardPipeline(pipeline({ officialCurriculumUnits: units, curriculum: curriculumEvidence, semanticAdjudications: adjudications }));

  it("creates no requiredFactKey and is excluded from semanticAdjudicationOutcomes", () => {
    const c = findCandidate(result, "c20l-topic")!;
    expect(c.requiredFactKeys ?? []).toEqual([]);
    expect(result.semanticAdjudicationOutcomes).toEqual([]);
  });

  it("is reported via a gap naming the missing proposal", () => {
    expect(result.gaps.some((g) => g.unresolved.includes("does not correspond to any existing CandidateFactRequirement proposal"))).toBe(true);
  });
});

describe("CC-20 case M -- an adjudication belonging to a different qualification cannot influence the result", () => {
  const units: OfficialCurriculumUnit[] = [officialUnit({ curriculumUnitId: "AC-X" })];
  const curriculumEvidence: CurriculumEvidence[] = [curriculum({ subject: "c20m-topic", curriculumUnitId: "AC-X" })];
  const key = generateCurriculumCandidates(curriculumEvidence).candidates[0]!.candidateKey;
  const factReqs: CandidateFactRequirement[] = [factRequirement({ targetCandidateKey: key, claimKey: "c20m-fact", derivationStatus: "REVIEW_PROPOSED" })];
  const adjudications: SemanticAdjudication[] = [semanticAdjudication({ targetCandidateKey: key, claimKey: "c20m-fact", decision: "REQUIRED_CORE", qualificationId: OTHER_QUAL })];
  const result = buildStandardPipeline(pipeline({ officialCurriculumUnits: units, curriculum: curriculumEvidence, factRequirements: factReqs, semanticAdjudications: adjudications }));

  it("never promotes the fact", () => {
    expect(findCandidate(result, "c20m-topic")!.requiredFactKeys ?? []).toEqual([]);
  });

  it("emits a gap naming the foreign qualification", () => {
    expect(result.gaps.some((g) => g.unresolved.includes(OTHER_QUAL))).toBe(true);
  });
});

describe("CC-20 case N -- two conflicting adjudications for the same fact never resolve by array order", () => {
  const units: OfficialCurriculumUnit[] = [officialUnit({ curriculumUnitId: "AC-X" })];
  const curriculumEvidence: CurriculumEvidence[] = [curriculum({ subject: "c20n-topic", curriculumUnitId: "AC-X", evidenceId: "curr-c20n" })];
  const key = generateCurriculumCandidates(curriculumEvidence).candidates[0]!.candidateKey;
  const factReqs: CandidateFactRequirement[] = [factRequirement({ targetCandidateKey: key, claimKey: "c20n-fact", derivationStatus: "REVIEW_PROPOSED" })];
  // Both adjudications carry real, independently valid support -- the conflict is a genuine disagreement about the DECISION, not one side losing on an evidence technicality.
  const forward: SemanticAdjudication[] = [
    semanticAdjudication({
      targetCandidateKey: key,
      claimKey: "c20n-fact",
      decision: "REQUIRED_CORE",
      decisionRef: "decision-forward-1",
      supportingEvidenceRefs: [{ role: "OFFICIAL_CURRICULUM", evidenceId: "curr-c20n" }],
    }),
    semanticAdjudication({ targetCandidateKey: key, claimKey: "c20n-fact", decision: "REJECT_NOT_NECESSARY", decisionRef: "decision-forward-2" }),
  ];
  const reversed = [...forward].reverse();

  it("neither array order promotes the fact, and a SEMANTIC_ADJUDICATION_CONFLICT gap is emitted regardless of order", () => {
    const r1 = buildStandardPipeline(pipeline({ officialCurriculumUnits: units, curriculum: curriculumEvidence, factRequirements: factReqs, semanticAdjudications: forward }));
    const r2 = buildStandardPipeline(pipeline({ officialCurriculumUnits: units, curriculum: curriculumEvidence, factRequirements: factReqs, semanticAdjudications: reversed }));
    for (const r of [r1, r2]) {
      const c = findCandidate(r, "c20n-topic")!;
      expect(c.requiredFactKeys ?? []).toEqual([]);
      expect(r.gaps.some((g) => g.gapType === "SEMANTIC_ADJUDICATION_CONFLICT")).toBe(true);
      expect(r.semanticAdjudicationOutcomes.some((a) => a.claimKey === "c20n-fact")).toBe(false);
    }
  });
});

describe("CC-20 cases O/P -- qualification-level evidence bounds depth to MEDIUM; absence of assessment alone no longer causes PERFORMANCE_DEPTH_GAP", () => {
  const units: OfficialCurriculumUnit[] = [officialUnit({ curriculumUnitId: "AC-X" })];
  const curriculumEvidence: CurriculumEvidence[] = [curriculum({ subject: "c20op-topic", curriculumUnitId: "AC-X", commandVerbPerformanceType: "CALCULATE" })];
  const key = generateCurriculumCandidates(curriculumEvidence).candidates[0]!.candidateKey;
  const levelEvidence: QualificationLevelEvidence[] = [
    {
      role: "QUALIFICATION_LEVEL",
      evidenceId: "c20-level-1",
      qualificationId: QUAL,
      levelId: "LEVEL-2",
      sourceRef: "SRC-FRAMEWORK",
      sourceLocator: "framework-loc",
      normalizationBasis: "QUALIFICATION_LEVEL_DESCRIPTOR",
      depthConstraintDescriptor: "ceiling only, never exact content",
      appliesToCandidateKey: key,
    },
  ];
  const result = buildStandardPipeline(pipeline({ officialCurriculumUnits: units, curriculum: curriculumEvidence, qualificationLevel: levelEvidence }));

  it("[O] depthBasis is QUALIFICATION_LEVEL_BOUNDED with MEDIUM confidence, not NONE", () => {
    const c = findCandidate(result, "c20op-topic")!;
    expect(c.depthBasis).toBe("QUALIFICATION_LEVEL_BOUNDED");
    expect(c.confidence.depthConfidence).toBe("MEDIUM");
  });

  it("[P] no PERFORMANCE_DEPTH_GAP fires despite zero assessment evidence, and assessmentCalibrationAvailable stays visible as false", () => {
    const c = findCandidate(result, "c20op-topic")!;
    expect(result.gaps.some((g) => g.gapType === "PERFORMANCE_DEPTH_GAP" && g.candidateKey === c.candidateKey)).toBe(false);
    expect(c.assessmentCalibrationAvailable).toBeFalsy(); // undefined defaults to "no assessment calibration", never explicitly forced to false
  });
});

describe("CC-20 case Q -- qualification-level evidence never creates scope or fact requirements", () => {
  it("qualification-level evidence alone, naming no existing candidate, creates zero candidates", () => {
    const levelEvidence: QualificationLevelEvidence[] = [
      {
        role: "QUALIFICATION_LEVEL",
        evidenceId: "c20q-level",
        qualificationId: QUAL,
        levelId: "LEVEL-2",
        sourceRef: "SRC-FRAMEWORK",
        sourceLocator: "framework-loc",
        normalizationBasis: "QUALIFICATION_LEVEL_DESCRIPTOR",
        depthConstraintDescriptor: "n/a",
        appliesToCandidateKey: "no-such-candidate::OTHER",
      },
    ];
    const result = buildStandardPipeline(pipeline({ qualificationLevel: levelEvidence }));
    expect(result.candidates).toEqual([]);
  });
});

describe("CC-20 case R -- assessment-calibrated depth remains distinguishable from qualification-level-bounded depth", () => {
  const units: OfficialCurriculumUnit[] = [officialUnit({ curriculumUnitId: "AC-X" })];
  const curriculumEvidence: CurriculumEvidence[] = [curriculum({ subject: "c20r-topic", curriculumUnitId: "AC-X", commandVerbPerformanceType: "CALCULATE" })];
  const key = generateCurriculumCandidates(curriculumEvidence).candidates[0]!.candidateKey;
  const item = assessment({ subject: "c20r-topic", performanceType: "CALCULATE", mappedCurriculumUnitId: "AC-X" });
  const levelEvidence: QualificationLevelEvidence[] = [
    {
      role: "QUALIFICATION_LEVEL",
      evidenceId: "c20r-level",
      qualificationId: QUAL,
      levelId: "LEVEL-2",
      sourceRef: "SRC-FRAMEWORK",
      sourceLocator: "framework-loc",
      normalizationBasis: "QUALIFICATION_LEVEL_DESCRIPTOR",
      depthConstraintDescriptor: "ceiling",
      appliesToCandidateKey: key,
    },
  ];
  const result = buildStandardPipeline(pipeline({ officialCurriculumUnits: units, curriculum: curriculumEvidence, assessment: [item], qualificationLevel: levelEvidence }));

  it("depthBasis is ASSESSMENT_CALIBRATED, not QUALIFICATION_LEVEL_BOUNDED, when both are present", () => {
    const c = findCandidate(result, "c20r-topic", "CALCULATE")!;
    expect(c.depthBasis).toBe("ASSESSMENT_CALIBRATED");
    expect(c.confidence.depthConfidence).toBe("HIGH");
    expect(c.assessmentCalibrationAvailable).toBe(true);
  });
});

describe("CC-20 case S -- governing facts exist but an additional review-proposed fact remains pending -> never falsely COMPLETE", () => {
  const units: OfficialCurriculumUnit[] = [officialUnit({ curriculumUnitId: "AC-X" })];
  const curriculumEvidence: CurriculumEvidence[] = [curriculum({ subject: "c20s-topic", curriculumUnitId: "AC-X", evidenceId: "curr-c20s" })];
  const key = generateCurriculumCandidates(curriculumEvidence).candidates[0]!.candidateKey;
  const citation = [{ role: "OFFICIAL_CURRICULUM" as const, evidenceId: "curr-c20s" }];
  const factReqs: CandidateFactRequirement[] = [
    factRequirement({ targetCandidateKey: key, claimKey: "c20s-fact-governed", sourceEvidenceRefs: citation }),
    factRequirement({ targetCandidateKey: key, claimKey: "c20s-fact-pending", derivationStatus: "REVIEW_PROPOSED" }),
  ];
  const claims: SourceFactualClaim[] = [factualClaim({ claimKey: "c20s-fact-governed", subject: "c20s-topic", sourceRole: "TECHNICAL_TRUTH", normalizedClaimValue: "value" })];
  const result = buildStandardPipeline(pipeline({ officialCurriculumUnits: units, curriculum: curriculumEvidence, factRequirements: factReqs, factualClaims: claims }));

  it("is never falsely COMPLETE, and is flagged ADJUDICATION_REQUIRED while the sibling proposal is pending", () => {
    const c = findCandidate(result, "c20s-topic")!;
    expect(c.technicalCoverageStatus).not.toBe("COMPLETE");
    expect(c.knowledgeBoundaryStatus).toBe("ADJUDICATION_REQUIRED");
    expect(c.requiredFactKeys).toEqual(["c20s-fact-governed"]);
  });
});

describe("CC-20 case T -- technical truth alone can never convert REVIEW_PROPOSED into required mastery", () => {
  const units: OfficialCurriculumUnit[] = [officialUnit({ curriculumUnitId: "AC-X" })];
  const curriculumEvidence: CurriculumEvidence[] = [curriculum({ subject: "c20t-topic", curriculumUnitId: "AC-X" })];
  const key = generateCurriculumCandidates(curriculumEvidence).candidates[0]!.candidateKey;
  const factReqs: CandidateFactRequirement[] = [factRequirement({ targetCandidateKey: key, claimKey: "c20t-fact", derivationStatus: "REVIEW_PROPOSED" })];
  const claims: SourceFactualClaim[] = [factualClaim({ claimKey: "c20t-fact", subject: "c20t-topic", sourceRole: "TECHNICAL_TRUTH", normalizedClaimValue: "some value" })];
  // No semantic adjudication supplied at all -- technical truth alone must never promote it.
  const result = buildStandardPipeline(pipeline({ officialCurriculumUnits: units, curriculum: curriculumEvidence, factRequirements: factReqs, factualClaims: claims }));

  it("requiredFactKeys stays empty despite an exact matching TECHNICAL_TRUTH claim", () => {
    const c = findCandidate(result, "c20t-topic")!;
    expect(c.requiredFactKeys ?? []).toEqual([]);
    expect(result.unmatchedTechnicalTruth.some((u) => u.claimKey === "c20t-fact")).toBe(true);
  });
});

// =====================================================================
// CC-20A cases U-AM2 -- narrow correction: SemanticAdjudication support
// must resolve mechanically against real accepted evidence; child
// existence alone does not make a parent structural; qualification-level
// depth bounds only an established performance. Fixtures are synthetic.
// =====================================================================

describe("CC-20A case U -- a REQUIRED_CORE adjudication citing a fabricated supporting evidenceId cannot promote", () => {
  const units: OfficialCurriculumUnit[] = [officialUnit({ curriculumUnitId: "AC-X" })];
  const curriculumEvidence: CurriculumEvidence[] = [curriculum({ subject: "u-topic", curriculumUnitId: "AC-X", evidenceId: "curr-u-real" })];
  const key = generateCurriculumCandidates(curriculumEvidence).candidates[0]!.candidateKey;
  const factReqs: CandidateFactRequirement[] = [factRequirement({ targetCandidateKey: key, claimKey: "u-fact", derivationStatus: "REVIEW_PROPOSED" })];
  const adjudications: SemanticAdjudication[] = [
    semanticAdjudication({ targetCandidateKey: key, claimKey: "u-fact", decision: "REQUIRED_CORE", supportingEvidenceRefs: [{ role: "OFFICIAL_CURRICULUM", evidenceId: "curr-u-FABRICATED" }] }),
  ];
  const result = buildStandardPipeline(pipeline({ officialCurriculumUnits: units, curriculum: curriculumEvidence, factRequirements: factReqs, semanticAdjudications: adjudications }));

  it("cannot promote", () => {
    expect(findCandidate(result, "u-topic")!.requiredFactKeys ?? []).toEqual([]);
  });
});

describe("CC-20A case V -- a REQUIRED_OPERATIONAL adjudication citing a real evidenceId under the wrong role cannot promote", () => {
  const units: OfficialCurriculumUnit[] = [officialUnit({ curriculumUnitId: "AC-X" })];
  const curriculumEvidence: CurriculumEvidence[] = [curriculum({ subject: "v-topic", curriculumUnitId: "AC-X", evidenceId: "curr-v-real" })];
  const key = generateCurriculumCandidates(curriculumEvidence).candidates[0]!.candidateKey;
  const factReqs: CandidateFactRequirement[] = [factRequirement({ targetCandidateKey: key, claimKey: "v-fact", derivationStatus: "REVIEW_PROPOSED" })];
  // The real curriculum evidenceId, but cited under PUBLIC_ASSESSMENT -- must not resolve.
  const adjudications: SemanticAdjudication[] = [
    semanticAdjudication({ targetCandidateKey: key, claimKey: "v-fact", decision: "REQUIRED_OPERATIONAL", adjudicationBasis: ["OPERATIONAL_NECESSITY"], supportingEvidenceRefs: [{ role: "PUBLIC_ASSESSMENT", evidenceId: "curr-v-real" }] }),
  ];
  const result = buildStandardPipeline(pipeline({ officialCurriculumUnits: units, curriculum: curriculumEvidence, factRequirements: factReqs, semanticAdjudications: adjudications }));

  it("cannot promote", () => {
    expect(findCandidate(result, "v-topic")!.requiredFactKeys ?? []).toEqual([]);
  });
});

describe("CC-20A case W -- PUBLIC_ASSESSMENT_CALIBRATION basis without a validated assessment record cannot promote", () => {
  const units: OfficialCurriculumUnit[] = [officialUnit({ curriculumUnitId: "AC-X" })];
  const curriculumEvidence: CurriculumEvidence[] = [curriculum({ subject: "w-topic", curriculumUnitId: "AC-X", evidenceId: "curr-w" })];
  const key = generateCurriculumCandidates(curriculumEvidence).candidates[0]!.candidateKey;
  const factReqs: CandidateFactRequirement[] = [factRequirement({ targetCandidateKey: key, claimKey: "w-fact", derivationStatus: "REVIEW_PROPOSED" })];
  // Real curriculum support exists, but the declared basis specifically needs an assessment match.
  const adjudications: SemanticAdjudication[] = [
    semanticAdjudication({ targetCandidateKey: key, claimKey: "w-fact", decision: "REQUIRED_CORE", adjudicationBasis: ["PUBLIC_ASSESSMENT_CALIBRATION"], supportingEvidenceRefs: [{ role: "OFFICIAL_CURRICULUM", evidenceId: "curr-w" }] }),
  ];
  const result = buildStandardPipeline(pipeline({ officialCurriculumUnits: units, curriculum: curriculumEvidence, factRequirements: factReqs, semanticAdjudications: adjudications }));

  it("cannot promote", () => {
    expect(findCandidate(result, "w-topic")!.requiredFactKeys ?? []).toEqual([]);
  });
});

describe("CC-20A case X -- COMMAND_VERB_AND_LEVEL with curriculum evidence but no applicable QUALIFICATION_LEVEL evidence cannot govern", () => {
  const units: OfficialCurriculumUnit[] = [officialUnit({ curriculumUnitId: "AC-X" })];
  const curriculumEvidence: CurriculumEvidence[] = [curriculum({ subject: "x-topic", curriculumUnitId: "AC-X", evidenceId: "curr-x" })];
  const key = generateCurriculumCandidates(curriculumEvidence).candidates[0]!.candidateKey;
  const factReqs: CandidateFactRequirement[] = [factRequirement({ targetCandidateKey: key, claimKey: "x-fact", derivationStatus: "REVIEW_PROPOSED" })];
  const adjudications: SemanticAdjudication[] = [
    semanticAdjudication({ targetCandidateKey: key, claimKey: "x-fact", decision: "REQUIRED_CORE", adjudicationBasis: ["COMMAND_VERB_AND_LEVEL"], supportingEvidenceRefs: [{ role: "OFFICIAL_CURRICULUM", evidenceId: "curr-x" }] }),
  ];
  const result = buildStandardPipeline(pipeline({ officialCurriculumUnits: units, curriculum: curriculumEvidence, factRequirements: factReqs, semanticAdjudications: adjudications }));

  it("basis is invalid without applicable qualification-level evidence -- cannot promote", () => {
    expect(findCandidate(result, "x-topic")!.requiredFactKeys ?? []).toEqual([]);
  });
});

describe("CC-20A case Y -- COMMAND_VERB_AND_LEVEL with exact validated curriculum plus applicable qualification level may govern", () => {
  const units: OfficialCurriculumUnit[] = [officialUnit({ curriculumUnitId: "AC-X" })];
  const curriculumEvidence: CurriculumEvidence[] = [curriculum({ subject: "y-topic", curriculumUnitId: "AC-X", evidenceId: "curr-y" })];
  const key = generateCurriculumCandidates(curriculumEvidence).candidates[0]!.candidateKey;
  const levelEvidence: QualificationLevelEvidence[] = [
    { role: "QUALIFICATION_LEVEL", evidenceId: "level-y", qualificationId: QUAL, levelId: "LEVEL-2", sourceRef: "SRC-FRAMEWORK", sourceLocator: "loc", normalizationBasis: "QUALIFICATION_LEVEL_DESCRIPTOR", depthConstraintDescriptor: "ceiling", appliesToCandidateKey: key },
  ];
  const factReqs: CandidateFactRequirement[] = [factRequirement({ targetCandidateKey: key, claimKey: "y-fact", derivationStatus: "REVIEW_PROPOSED" })];
  const adjudications: SemanticAdjudication[] = [
    semanticAdjudication({
      targetCandidateKey: key,
      claimKey: "y-fact",
      decision: "REQUIRED_CORE",
      adjudicationBasis: ["COMMAND_VERB_AND_LEVEL"],
      supportingEvidenceRefs: [
        { role: "OFFICIAL_CURRICULUM", evidenceId: "curr-y" },
        { role: "QUALIFICATION_LEVEL", evidenceId: "level-y" },
      ],
    }),
  ];
  const result = buildStandardPipeline(pipeline({ officialCurriculumUnits: units, curriculum: curriculumEvidence, qualificationLevel: levelEvidence, factRequirements: factReqs, semanticAdjudications: adjudications }));

  it("basis is valid and the fact promotes, subject to all other gates", () => {
    expect(findCandidate(result, "y-topic")!.requiredFactKeys).toEqual(["y-fact"]);
  });
});

describe("CC-20A case Z -- OPERATIONAL_NECESSITY supported only by TECHNICAL_TRUTH cannot establish qualification necessity", () => {
  const units: OfficialCurriculumUnit[] = [officialUnit({ curriculumUnitId: "AC-X" })];
  const curriculumEvidence: CurriculumEvidence[] = [curriculum({ subject: "z-topic", curriculumUnitId: "AC-X", evidenceId: "curr-z" })];
  const key = generateCurriculumCandidates(curriculumEvidence).candidates[0]!.candidateKey;
  const factReqs: CandidateFactRequirement[] = [factRequirement({ targetCandidateKey: key, claimKey: "z-fact", derivationStatus: "REVIEW_PROPOSED" })];
  const claims: SourceFactualClaim[] = [factualClaim({ claimKey: "z-fact", subject: "z-topic", sourceRole: "TECHNICAL_TRUTH", normalizedClaimValue: "value", evidenceId: "truth-z" })];
  const adjudications: SemanticAdjudication[] = [
    semanticAdjudication({ targetCandidateKey: key, claimKey: "z-fact", decision: "REQUIRED_CORE", adjudicationBasis: ["OPERATIONAL_NECESSITY"], supportingEvidenceRefs: [{ role: "TECHNICAL_TRUTH", evidenceId: "truth-z" }] }),
  ];
  const result = buildStandardPipeline(pipeline({ officialCurriculumUnits: units, curriculum: curriculumEvidence, factRequirements: factReqs, factualClaims: claims, semanticAdjudications: adjudications }));

  it("cannot promote -- technical truth alone never substitutes for curriculum/performance authority", () => {
    expect(findCandidate(result, "z-topic")!.requiredFactKeys ?? []).toEqual([]);
  });
});

describe("CC-20A case AA2 -- OPERATIONAL_NECESSITY supported by exact validated curriculum plus technical truth may govern, with technical truth separately attached", () => {
  const units: OfficialCurriculumUnit[] = [officialUnit({ curriculumUnitId: "AC-X" })];
  const curriculumEvidence: CurriculumEvidence[] = [curriculum({ subject: "aa2-topic", curriculumUnitId: "AC-X", evidenceId: "curr-aa2" })];
  const key = generateCurriculumCandidates(curriculumEvidence).candidates[0]!.candidateKey;
  const factReqs: CandidateFactRequirement[] = [factRequirement({ targetCandidateKey: key, claimKey: "aa2-fact", derivationStatus: "REVIEW_PROPOSED" })];
  const claims: SourceFactualClaim[] = [factualClaim({ claimKey: "aa2-fact", subject: "aa2-topic", sourceRole: "TECHNICAL_TRUTH", normalizedClaimValue: "value", evidenceId: "truth-aa2" })];
  const adjudications: SemanticAdjudication[] = [
    semanticAdjudication({
      targetCandidateKey: key,
      claimKey: "aa2-fact",
      decision: "REQUIRED_CORE",
      adjudicationBasis: ["OPERATIONAL_NECESSITY"],
      supportingEvidenceRefs: [
        { role: "OFFICIAL_CURRICULUM", evidenceId: "curr-aa2" },
        { role: "TECHNICAL_TRUTH", evidenceId: "truth-aa2" },
      ],
    }),
  ];
  const result = buildStandardPipeline(pipeline({ officialCurriculumUnits: units, curriculum: curriculumEvidence, factRequirements: factReqs, factualClaims: claims, semanticAdjudications: adjudications }));

  it("governs, and technical truth attaches separately to reach COMPLETE coverage", () => {
    const c = findCandidate(result, "aa2-topic")!;
    expect(c.requiredFactKeys).toEqual(["aa2-fact"]);
    expect(c.technicalCoverageStatus).toBe("COMPLETE");
    expect(c.factualStatementsByClaimKey?.["aa2-fact"]).toBe("value");
  });
});

describe("CC-20A case AB2 -- fake supporting evidence produces a visible semantic-adjudication gap rather than disappearing", () => {
  const units: OfficialCurriculumUnit[] = [officialUnit({ curriculumUnitId: "AC-X" })];
  const curriculumEvidence: CurriculumEvidence[] = [curriculum({ subject: "ab2-topic", curriculumUnitId: "AC-X", evidenceId: "curr-ab2" })];
  const key = generateCurriculumCandidates(curriculumEvidence).candidates[0]!.candidateKey;
  const factReqs: CandidateFactRequirement[] = [factRequirement({ targetCandidateKey: key, claimKey: "ab2-fact", derivationStatus: "REVIEW_PROPOSED" })];
  const adjudications: SemanticAdjudication[] = [
    semanticAdjudication({ targetCandidateKey: key, claimKey: "ab2-fact", decision: "REQUIRED_CORE", supportingEvidenceRefs: [{ role: "OFFICIAL_CURRICULUM", evidenceId: "curr-ab2-FAKE" }] }),
  ];
  const result = buildStandardPipeline(pipeline({ officialCurriculumUnits: units, curriculum: curriculumEvidence, factRequirements: factReqs, semanticAdjudications: adjudications }));

  it("emits a visible EVIDENCE_NORMALIZATION_REVIEW gap naming the rejected adjudication, rather than silently dropping it", () => {
    expect(result.gaps.some((g) => g.gapType === "EVIDENCE_NORMALIZATION_REVIEW" && g.candidateKey === key && g.unresolved.includes("ab2-fact"))).toBe(true);
  });
});

describe("CC-20A case AC2 -- HUMAN_PROJECT_ARCHITECT with invalid supporting evidence is rejected exactly like LLM_EVIDENCE_BOUND", () => {
  const units: OfficialCurriculumUnit[] = [officialUnit({ curriculumUnitId: "AC-X" })];
  const curriculumEvidence: CurriculumEvidence[] = [curriculum({ subject: "ac2-topic", curriculumUnitId: "AC-X", evidenceId: "curr-ac2" })];
  const key = generateCurriculumCandidates(curriculumEvidence).candidates[0]!.candidateKey;
  const factReqs: CandidateFactRequirement[] = [factRequirement({ targetCandidateKey: key, claimKey: "ac2-fact", derivationStatus: "REVIEW_PROPOSED" })];

  it("HUMAN_PROJECT_ARCHITECT with fabricated evidence cannot promote", () => {
    const adjudications: SemanticAdjudication[] = [
      semanticAdjudication({ targetCandidateKey: key, claimKey: "ac2-fact", decision: "REQUIRED_CORE", adjudicatorKind: "HUMAN_PROJECT_ARCHITECT", supportingEvidenceRefs: [{ role: "OFFICIAL_CURRICULUM", evidenceId: "curr-ac2-FAKE" }] }),
    ];
    const result = buildStandardPipeline(pipeline({ officialCurriculumUnits: units, curriculum: curriculumEvidence, factRequirements: factReqs, semanticAdjudications: adjudications }));
    expect(findCandidate(result, "ac2-topic")!.requiredFactKeys ?? []).toEqual([]);
  });

  it("LLM_EVIDENCE_BOUND with the identical fabricated evidence is rejected the same way", () => {
    const adjudications: SemanticAdjudication[] = [
      semanticAdjudication({ targetCandidateKey: key, claimKey: "ac2-fact", decision: "REQUIRED_CORE", adjudicatorKind: "LLM_EVIDENCE_BOUND", supportingEvidenceRefs: [{ role: "OFFICIAL_CURRICULUM", evidenceId: "curr-ac2-FAKE" }] }),
    ];
    const result = buildStandardPipeline(pipeline({ officialCurriculumUnits: units, curriculum: curriculumEvidence, factRequirements: factReqs, semanticAdjudications: adjudications }));
    expect(findCandidate(result, "ac2-topic")!.requiredFactKeys ?? []).toEqual([]);
  });
});

describe("CC-20A case AD2 -- LLM_EVIDENCE_BOUND with valid supporting evidence is not rejected merely because it is an LLM", () => {
  const units: OfficialCurriculumUnit[] = [officialUnit({ curriculumUnitId: "AC-X" })];
  const curriculumEvidence: CurriculumEvidence[] = [curriculum({ subject: "ad2-topic", curriculumUnitId: "AC-X", evidenceId: "curr-ad2" })];
  const key = generateCurriculumCandidates(curriculumEvidence).candidates[0]!.candidateKey;
  const factReqs: CandidateFactRequirement[] = [factRequirement({ targetCandidateKey: key, claimKey: "ad2-fact", derivationStatus: "REVIEW_PROPOSED" })];
  const adjudications: SemanticAdjudication[] = [
    semanticAdjudication({ targetCandidateKey: key, claimKey: "ad2-fact", decision: "REQUIRED_CORE", adjudicatorKind: "LLM_EVIDENCE_BOUND", supportingEvidenceRefs: [{ role: "OFFICIAL_CURRICULUM", evidenceId: "curr-ad2" }] }),
  ];
  const result = buildStandardPipeline(pipeline({ officialCurriculumUnits: units, curriculum: curriculumEvidence, factRequirements: factReqs, semanticAdjudications: adjudications }));

  it("promotes the fact", () => {
    expect(findCandidate(result, "ad2-topic")!.requiredFactKeys).toEqual(["ad2-fact"]);
  });
});

describe("CC-20A case AE2 -- a PRIMARY_REQUIREMENT with a governed child but no own knowledge resolution is NOT STRUCTURALLY_DECOMPOSED", () => {
  const units: OfficialCurriculumUnit[] = [officialUnit({ curriculumUnitId: "AC-X" })];
  const curriculumEvidence: CurriculumEvidence[] = [
    curriculum({ subject: "ae2-parent", curriculumUnitId: "AC-X", normalizationKind: "PRIMARY_REQUIREMENT" }),
    curriculum({ subject: "ae2-child", curriculumUnitId: "AC-X", normalizationKind: "RANGE_REQUIRED_MEMBER", refinesSubject: "ae2-parent" }),
  ];
  const result = buildStandardPipeline(pipeline({ officialCurriculumUnits: units, curriculum: curriculumEvidence }));

  it("the parent is not STRUCTURALLY_DECOMPOSED", () => {
    expect(findCandidate(result, "ae2-parent")!.knowledgeBoundaryStatus).not.toBe("STRUCTURALLY_DECOMPOSED");
  });
});

describe("CC-20A case AF2 -- a PRIMARY_REQUIREMENT with multiple children still does not become structural merely by child count", () => {
  const units: OfficialCurriculumUnit[] = [officialUnit({ curriculumUnitId: "AC-X" })];
  const curriculumEvidence: CurriculumEvidence[] = [
    curriculum({ subject: "af2-parent", curriculumUnitId: "AC-X", normalizationKind: "PRIMARY_REQUIREMENT" }),
    curriculum({ subject: "af2-child-a", curriculumUnitId: "AC-X", normalizationKind: "RANGE_REQUIRED_MEMBER", refinesSubject: "af2-parent" }),
    curriculum({ subject: "af2-child-b", curriculumUnitId: "AC-X", normalizationKind: "RANGE_REQUIRED_MEMBER", refinesSubject: "af2-parent" }),
    curriculum({ subject: "af2-child-c", curriculumUnitId: "AC-X", normalizationKind: "RANGE_REQUIRED_MEMBER", refinesSubject: "af2-parent" }),
  ];
  const result = buildStandardPipeline(pipeline({ officialCurriculumUnits: units, curriculum: curriculumEvidence }));

  it("the parent is still not STRUCTURALLY_DECOMPOSED", () => {
    expect(findCandidate(result, "af2-parent")!.knowledgeBoundaryStatus).not.toBe("STRUCTURALLY_DECOMPOSED");
  });
});

describe("CC-20A case AG2 -- a validated RANGE_CATEGORY with resolved governed children is STRUCTURALLY_DECOMPOSED", () => {
  const units: OfficialCurriculumUnit[] = [officialUnit({ curriculumUnitId: "AC-X" })];
  const curriculumEvidence: CurriculumEvidence[] = [
    curriculum({ subject: "ag2-parent", curriculumUnitId: "AC-X", normalizationKind: "RANGE_CATEGORY" }),
    curriculum({ subject: "ag2-child", curriculumUnitId: "AC-X", normalizationKind: "RANGE_REQUIRED_MEMBER", refinesSubject: "ag2-parent" }),
  ];
  const result = buildStandardPipeline(pipeline({ officialCurriculumUnits: units, curriculum: curriculumEvidence }));

  it("the parent is STRUCTURALLY_DECOMPOSED with technicalCoverageStatus NOT_APPLICABLE", () => {
    const parent = findCandidate(result, "ag2-parent")!;
    expect(parent.knowledgeBoundaryStatus).toBe("STRUCTURALLY_DECOMPOSED");
    expect(parent.technicalCoverageStatus).toBe("NOT_APPLICABLE");
  });
});

describe("CC-20A case AH2 -- a validated RANGE_CATEGORY whose child relation does not resolve is not falsely STRUCTURALLY_DECOMPOSED", () => {
  const units: OfficialCurriculumUnit[] = [officialUnit({ curriculumUnitId: "AC-X" })];
  const curriculumEvidence: CurriculumEvidence[] = [curriculum({ subject: "ah2-parent", curriculumUnitId: "AC-X", normalizationKind: "RANGE_CATEGORY" })]; // no children at all
  const result = buildStandardPipeline(pipeline({ officialCurriculumUnits: units, curriculum: curriculumEvidence }));

  it("the parent is not STRUCTURALLY_DECOMPOSED", () => {
    expect(findCandidate(result, "ah2-parent")!.knowledgeBoundaryStatus).not.toBe("STRUCTURALLY_DECOMPOSED");
  });
});

describe("CC-20A case AI2 -- explicit curriculum performance + applicable qualification level + no assessment -> QUALIFICATION_LEVEL_BOUNDED / MEDIUM", () => {
  const units: OfficialCurriculumUnit[] = [officialUnit({ curriculumUnitId: "AC-X" })];
  const curriculumEvidence: CurriculumEvidence[] = [curriculum({ subject: "ai2-topic", curriculumUnitId: "AC-X", commandVerbPerformanceType: "CALCULATE" })];
  const key = generateCurriculumCandidates(curriculumEvidence).candidates[0]!.candidateKey;
  const levelEvidence: QualificationLevelEvidence[] = [
    { role: "QUALIFICATION_LEVEL", evidenceId: "level-ai2", qualificationId: QUAL, levelId: "LEVEL-2", sourceRef: "SRC-FRAMEWORK", sourceLocator: "loc", normalizationBasis: "QUALIFICATION_LEVEL_DESCRIPTOR", depthConstraintDescriptor: "ceiling", appliesToCandidateKey: key },
  ];
  const result = buildStandardPipeline(pipeline({ officialCurriculumUnits: units, curriculum: curriculumEvidence, qualificationLevel: levelEvidence }));

  it("performance is EXPLICIT, depthBasis QUALIFICATION_LEVEL_BOUNDED, depthConfidence MEDIUM", () => {
    const c = findCandidate(result, "ai2-topic")!;
    expect(c.performanceProvenance).toBe("EXPLICIT");
    expect(c.depthBasis).toBe("QUALIFICATION_LEVEL_BOUNDED");
    expect(c.confidence.depthConfidence).toBe("MEDIUM");
  });
});

describe("CC-20A case AJ2 -- uncertain/unresolved performance mapping + qualification level -> NOT automatically QUALIFICATION_LEVEL_BOUNDED / MEDIUM", () => {
  const units: OfficialCurriculumUnit[] = [officialUnit({ curriculumUnitId: "AC-X" })];
  // No commandVerbPerformanceType supplied -- rests on the pipeline's own "?? OTHER" fallback, never an explicit claim.
  const curriculumEvidence: CurriculumEvidence[] = [curriculum({ subject: "aj2-topic", curriculumUnitId: "AC-X" })];
  const key = generateCurriculumCandidates(curriculumEvidence).candidates[0]!.candidateKey;
  const levelEvidence: QualificationLevelEvidence[] = [
    { role: "QUALIFICATION_LEVEL", evidenceId: "level-aj2", qualificationId: QUAL, levelId: "LEVEL-2", sourceRef: "SRC-FRAMEWORK", sourceLocator: "loc", normalizationBasis: "QUALIFICATION_LEVEL_DESCRIPTOR", depthConstraintDescriptor: "ceiling", appliesToCandidateKey: key },
  ];
  const result = buildStandardPipeline(pipeline({ officialCurriculumUnits: units, curriculum: curriculumEvidence, qualificationLevel: levelEvidence }));

  it("performance is UNRESOLVED and depth stays unbounded, never automatically MEDIUM", () => {
    const c = findCandidate(result, "aj2-topic")!;
    expect(c.performanceProvenance).toBe("UNRESOLVED");
    expect(c.depthBasis).not.toBe("QUALIFICATION_LEVEL_BOUNDED");
    expect(c.confidence.depthConfidence).not.toBe("MEDIUM");
  });

  it("materially unresolved depth still produces PERFORMANCE_DEPTH_GAP", () => {
    const c = findCandidate(result, "aj2-topic")!;
    expect(result.gaps.some((g) => g.gapType === "PERFORMANCE_DEPTH_GAP" && g.candidateKey === c.candidateKey)).toBe(true);
  });
});

describe("CC-20A case AK2 -- a governed inherited explicit performance plus applicable qualification level may be QUALIFICATION_LEVEL_BOUNDED / MEDIUM", () => {
  const units: OfficialCurriculumUnit[] = [officialUnit({ curriculumUnitId: "AC-X" })];
  const curriculumEvidence: CurriculumEvidence[] = [
    curriculum({ subject: "ak2-parent", curriculumUnitId: "AC-X", normalizationKind: "PRIMARY_REQUIREMENT", commandVerbPerformanceType: "EXPLAIN" }),
    // The child declares no commandVerbPerformanceType of its own -- inherits EXPLICIT via the governed parent relationship.
    curriculum({ subject: "ak2-child", curriculumUnitId: "AC-X", normalizationKind: "RANGE_REQUIRED_MEMBER", refinesSubject: "ak2-parent" }),
  ];
  const { candidates: standaloneCandidates } = generateCurriculumCandidates(curriculumEvidence);
  const childKey = standaloneCandidates.find((c) => c.subject === "ak2-child")!.candidateKey;
  const levelEvidence: QualificationLevelEvidence[] = [
    { role: "QUALIFICATION_LEVEL", evidenceId: "level-ak2", qualificationId: QUAL, levelId: "LEVEL-2", sourceRef: "SRC-FRAMEWORK", sourceLocator: "loc", normalizationBasis: "QUALIFICATION_LEVEL_DESCRIPTOR", depthConstraintDescriptor: "ceiling", appliesToCandidateKey: childKey },
  ];
  const result = buildStandardPipeline(pipeline({ officialCurriculumUnits: units, curriculum: curriculumEvidence, qualificationLevel: levelEvidence }));

  it("the child's performance is GOVERNED_INHERITED and depth becomes QUALIFICATION_LEVEL_BOUNDED / MEDIUM", () => {
    const c = findCandidate(result, "ak2-child")!;
    expect(c.performanceProvenance).toBe("GOVERNED_INHERITED");
    expect(c.depthBasis).toBe("QUALIFICATION_LEVEL_BOUNDED");
    expect(c.confidence.depthConfidence).toBe("MEDIUM");
  });
});

describe("CC-20A case AL2 -- absence of assessment remains visible without itself creating a depth gap, for both direct and inherited established performances", () => {
  it("direct explicit performance (AI2-style): assessmentCalibrationAvailable falsy, no PERFORMANCE_DEPTH_GAP", () => {
    const units: OfficialCurriculumUnit[] = [officialUnit({ curriculumUnitId: "AC-X" })];
    const curriculumEvidence: CurriculumEvidence[] = [curriculum({ subject: "al2a-topic", curriculumUnitId: "AC-X", commandVerbPerformanceType: "CALCULATE" })];
    const key = generateCurriculumCandidates(curriculumEvidence).candidates[0]!.candidateKey;
    const levelEvidence: QualificationLevelEvidence[] = [
      { role: "QUALIFICATION_LEVEL", evidenceId: "level-al2a", qualificationId: QUAL, levelId: "LEVEL-2", sourceRef: "SRC-FRAMEWORK", sourceLocator: "loc", normalizationBasis: "QUALIFICATION_LEVEL_DESCRIPTOR", depthConstraintDescriptor: "ceiling", appliesToCandidateKey: key },
    ];
    const result = buildStandardPipeline(pipeline({ officialCurriculumUnits: units, curriculum: curriculumEvidence, qualificationLevel: levelEvidence }));
    const c = findCandidate(result, "al2a-topic")!;
    expect(c.assessmentCalibrationAvailable).toBeFalsy();
    expect(result.gaps.some((g) => g.gapType === "PERFORMANCE_DEPTH_GAP" && g.candidateKey === c.candidateKey)).toBe(false);
  });

  it("governed inherited performance (AK2-style): assessmentCalibrationAvailable falsy, no PERFORMANCE_DEPTH_GAP", () => {
    const units: OfficialCurriculumUnit[] = [officialUnit({ curriculumUnitId: "AC-X" })];
    const curriculumEvidence: CurriculumEvidence[] = [
      curriculum({ subject: "al2b-parent", curriculumUnitId: "AC-X", normalizationKind: "PRIMARY_REQUIREMENT", commandVerbPerformanceType: "EXPLAIN" }),
      curriculum({ subject: "al2b-child", curriculumUnitId: "AC-X", normalizationKind: "RANGE_REQUIRED_MEMBER", refinesSubject: "al2b-parent" }),
    ];
    const { candidates: standaloneCandidates } = generateCurriculumCandidates(curriculumEvidence);
    const childKey = standaloneCandidates.find((c) => c.subject === "al2b-child")!.candidateKey;
    const levelEvidence: QualificationLevelEvidence[] = [
      { role: "QUALIFICATION_LEVEL", evidenceId: "level-al2b", qualificationId: QUAL, levelId: "LEVEL-2", sourceRef: "SRC-FRAMEWORK", sourceLocator: "loc", normalizationBasis: "QUALIFICATION_LEVEL_DESCRIPTOR", depthConstraintDescriptor: "ceiling", appliesToCandidateKey: childKey },
    ];
    const result = buildStandardPipeline(pipeline({ officialCurriculumUnits: units, curriculum: curriculumEvidence, qualificationLevel: levelEvidence }));
    const c = findCandidate(result, "al2b-child")!;
    expect(c.assessmentCalibrationAvailable).toBeFalsy();
    expect(result.gaps.some((g) => g.gapType === "PERFORMANCE_DEPTH_GAP" && g.candidateKey === c.candidateKey)).toBe(false);
  });
});

describe("CC-20A case AM2 -- technical truth alone can never establish semantic necessity or depth", () => {
  const claims: SourceFactualClaim[] = [factualClaim({ claimKey: "am2-fact", subject: "am2-nonexistent-topic", sourceRole: "TECHNICAL_TRUTH", normalizedClaimValue: "value" })];
  const result = buildStandardPipeline(pipeline({ factualClaims: claims }));

  it("creates no candidate and no scope from technical truth alone", () => {
    expect(result.candidates).toEqual([]);
    expect(result.unmatchedTechnicalTruth).toHaveLength(1);
  });
});
