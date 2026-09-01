import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import {
  buildStandardPipeline,
  compareAgainstDiagnosticEvidence,
  compareCalibrationFactualClaims,
  detectAssessmentPatternCandidates,
  generateAssessmentCandidates,
  generateCurriculumCandidates,
  hasValidProvenance,
} from "./rules.ts";
import type {
  AssessmentEvidence,
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
 * CC-18/CC-18A synthetic regression suite. Fixtures are deliberately NOT
 * drawn from Unit 202's governed matrix or corpus -- they exist only to
 * mechanically prove the generic pipeline rules, cases A-O (CC-18) and
 * P-AC (CC-18A), with topic names chosen for readability, never as
 * expected-answer authority for any real qualification.
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
    curriculumUnitId: "UNIT-X",
    namedInPrimaryWording: false,
    isRangeItem: false,
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
  return { sourceRef: "SRC-SPEC", sourceLocator: "spec-loc", normalizationBasis: "EXPLICIT_RANGE_STRUCTURE", ...overrides };
}

function family(overrides: Partial<CurriculumFamily> & Pick<CurriculumFamily, "familyKey" | "memberSubjects">): CurriculumFamily {
  return { sourceRef: "SRC-SPEC", sourceLocator: "spec-loc", normalizationBasis: "EXPLICIT_RANGE_STRUCTURE", ...overrides };
}

function factualClaim(overrides: Partial<SourceFactualClaim> & Pick<SourceFactualClaim, "claimKey" | "subject" | "sourceRole" | "normalizedClaimValue">): SourceFactualClaim {
  return {
    evidenceId: nextId("claim"),
    sourceRef: overrides.sourceRole === "TECHNICAL_TRUTH" ? "SRC-TECHNICAL" : "SRC-CURRICULUM-PROVIDER",
    sourceLocator: "claim-loc",
    normalizationBasis: overrides.sourceRole === "TECHNICAL_TRUTH" ? "AUTHORITATIVE_TECHNICAL_FACT" : "SOURCE_FACTUAL_CLAIM",
    ...overrides,
  };
}

function pipeline(overrides: Partial<StandardPipelineInput> = {}): StandardPipelineInput {
  return { officialCurriculumUnits: [], curriculum: [], assessment: [], ...overrides };
}

function findCandidate(result: ReturnType<typeof buildStandardPipeline>, subject: string, performanceType?: string) {
  return result.candidates.find((c) => c.subject === subject && (performanceType === undefined || c.performanceType === performanceType));
}

// =====================================================================
// CC-18 cases A-O (retained, amended for CC-18A's registry/provenance/
// independent-factual-claim requirements).
// =====================================================================

describe("CC-18 case A -- AC names levers/gears/pulleys, Range only lists lever classes", () => {
  const curriculumEvidence: CurriculumEvidence[] = [
    curriculum({ subject: "levers", namedInPrimaryWording: true, commandVerbPerformanceType: "EXPLAIN" }),
    curriculum({ subject: "gears", namedInPrimaryWording: true, commandVerbPerformanceType: "EXPLAIN" }),
    curriculum({ subject: "pulleys", namedInPrimaryWording: true, commandVerbPerformanceType: "EXPLAIN" }),
    curriculum({ subject: "lever-class-i", isRangeItem: true, refinesSubject: "levers" }),
    curriculum({ subject: "lever-class-ii", isRangeItem: true, refinesSubject: "levers" }),
    curriculum({ subject: "lever-class-iii", isRangeItem: true, refinesSubject: "levers" }),
  ];
  const result = buildStandardPipeline(pipeline({ curriculum: curriculumEvidence }));

  it("retains levers, gears AND pulleys as REQUIRED_EXPLICIT_CURRICULUM even though only levers has Range refinement", () => {
    for (const subject of ["levers", "gears", "pulleys"]) {
      const c = findCandidate(result, subject);
      expect(c, `expected a candidate for "${subject}"`).toBeDefined();
      expect(c!.disposition).toBe("REQUIRED_EXPLICIT_CURRICULUM");
      expect(c!.confidence.scopeConfidence).toBe("HIGH");
    }
  });

  it("gives levers higher depth confidence than gears/pulleys because it alone has Range refinement", () => {
    expect(findCandidate(result, "levers")!.confidence.depthConfidence).toBe("MEDIUM");
    expect(findCandidate(result, "gears")!.confidence.depthConfidence).toBe("NONE");
    expect(findCandidate(result, "pulleys")!.confidence.depthConfidence).toBe("NONE");
  });

  it("does not create a standalone top-level candidate for the Range refinement items themselves", () => {
    expect(findCandidate(result, "lever-class-i")).toBeUndefined();
  });
});

describe("CC-18 case B -- Range says a bare category, no internals invented", () => {
  const result = buildStandardPipeline(pipeline({ curriculum: [curriculum({ subject: "telephones", isRangeItem: true })] }));

  it("retains the category itself", () => {
    const c = findCandidate(result, "telephones");
    expect(c!.disposition).toBe("REQUIRED_EXPLICIT_CURRICULUM");
    expect(c!.confidence.scopeConfidence).toBe("HIGH");
  });

  it("invents no internal implementation-detail candidates", () => {
    for (const s of ["telephone-capacitor-role", "telephone-resistor-role", "hook-switch"]) expect(findCandidate(result, s)).toBeUndefined();
    // Only the category candidate plus its default UNKNOWN-breadth review record exist.
    expect(result.candidates.length).toBe(2);
  });
});

describe("CC-18/CC-18A cases C/P -- public assessment generates a brand-new candidate ONLY when validly mapped to a real official curriculum unit", () => {
  const units: OfficialCurriculumUnit[] = [officialUnit({ curriculumUnitId: "AC-MAG-1" })];
  const item = assessment({
    subject: "solenoid-polarity",
    performanceType: "IDENTIFY",
    mappedCurriculumUnitId: "AC-MAG-1",
    questionStemRef: "Identify the South pole of this solenoid.",
    correctAnswerTarget: "South pole identified from the shown current/field arrangement",
  });
  const result = buildStandardPipeline(pipeline({ officialCurriculumUnits: units, assessment: [item] }));

  it("generates a solenoid-polarity candidate even with zero prior curriculum evidence, because the mapping resolves to a real registry unit", () => {
    const c = findCandidate(result, "solenoid-polarity", "IDENTIFY");
    expect(c).toBeDefined();
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
    expect(findCandidate(result, "solenoid-polarity")).toBeUndefined();
    expect(result.candidates).toEqual([]);
  });

  it("emits an ASSESSMENT_MAPPING_REVIEW gap preserving the attempted mapping, never silently dropping the evidence", () => {
    const gap = result.gaps.find((g) => g.gapType === "ASSESSMENT_MAPPING_REVIEW");
    expect(gap).toBeDefined();
    expect(gap!.evidenceAvailable.some((e) => e.includes("AC-DOES-NOT-EXIST"))).toBe(true);
    expect(gap!.unresolved).toMatch(/does not resolve to any official curriculum unit/);
  });

  it("a bare non-empty mappedCurriculumUnitId string is NOT treated as a valid mapping merely for being non-empty", () => {
    // Same fixture, no registry entry at all -- proves the old CC-18 behaviour (non-empty string = valid) is gone.
    const noRegistryResult = buildStandardPipeline(pipeline({ officialCurriculumUnits: [], assessment: [item] }));
    expect(noRegistryResult.candidates).toEqual([]);
    expect(noRegistryResult.gaps.some((g) => g.gapType === "ASSESSMENT_MAPPING_REVIEW")).toBe(true);
  });
});

describe("CC-18A case R -- an assessment item mapped to a real unit belonging to a DIFFERENT qualification never becomes required scope", () => {
  const units: OfficialCurriculumUnit[] = [officialUnit({ curriculumUnitId: "AC-MAG-1", qualificationId: OTHER_QUAL })];
  const item = assessment({ subject: "solenoid-polarity", performanceType: "IDENTIFY", mappedCurriculumUnitId: "AC-MAG-1", qualificationId: QUAL });
  const result = buildStandardPipeline(pipeline({ officialCurriculumUnits: units, assessment: [item] }));

  it("creates no required candidate even though the unit id itself is real", () => {
    expect(findCandidate(result, "solenoid-polarity")).toBeUndefined();
  });

  it("emits ASSESSMENT_MAPPING_REVIEW naming the qualification mismatch", () => {
    const gap = result.gaps.find((g) => g.gapType === "ASSESSMENT_MAPPING_REVIEW");
    expect(gap).toBeDefined();
    expect(gap!.unresolved).toMatch(/different qualification|not this item's own qualification/);
  });
});

describe("CC-18 case D -- a distractor-only subject never generates a candidate", () => {
  const units: OfficialCurriculumUnit[] = [officialUnit({ curriculumUnitId: "AC-ELEC-6" })];
  const item = assessment({
    subject: "transistor-switching-role",
    performanceType: "COMPONENT_ROLE",
    mappedCurriculumUnitId: "AC-ELEC-6",
    distractorSubjects: ["relay", "contactor", "thermistor"],
  });
  const result = buildStandardPipeline(pipeline({ officialCurriculumUnits: units, assessment: [item] }));

  it("creates the positive-target candidate only", () => {
    expect(findCandidate(result, "transistor-switching-role")).toBeDefined();
  });

  it("never creates a candidate for any distractor subject from the same item", () => {
    for (const s of ["relay", "contactor", "thermistor"]) expect(findCandidate(result, s)).toBeUndefined();
    expect(result.candidates.length).toBe(1);
  });
});

describe("CC-18/CC-18A case E -- a technical-truth factual claim for a subject with no curriculum/assessment evidence creates no scope", () => {
  const claims: SourceFactualClaim[] = [
    factualClaim({ claimKey: "relay-principle", subject: "relay", sourceRole: "TECHNICAL_TRUTH", normalizedClaimValue: "A relay uses an electromagnet to operate a mechanically separate switch contact." }),
    factualClaim({ claimKey: "contactor-principle", subject: "contactor", sourceRole: "TECHNICAL_TRUTH", normalizedClaimValue: "A contactor is a heavier-duty relay variant rated for higher switching currents." }),
  ];
  const result = buildStandardPipeline(pipeline({ factualClaims: claims }));

  it("creates no candidate for relay or contactor", () => {
    expect(findCandidate(result, "relay")).toBeUndefined();
    expect(findCandidate(result, "contactor")).toBeUndefined();
    expect(result.candidates.length).toBe(0);
  });

  it("still records the factual evidence as unmatched, never silently discarded", () => {
    expect([...result.unmatchedTechnicalTruth.map((e) => e.subject)].sort()).toEqual(["contactor", "relay"]);
  });
});

describe("CC-18/CC-18A case F -- broad Range label with one directly-evidenced, GOVERNED sub-item produces a breadth gap regardless", () => {
  const curriculumEvidence: CurriculumEvidence[] = [curriculum({ subject: "statistics", isRangeItem: true, breadthStatus: "OPEN_OR_UNDERSPECIFIED" })];
  const units: OfficialCurriculumUnit[] = [officialUnit({ curriculumUnitId: "AC-MATH-1" })];
  const item = assessment({ subject: "statistics-mean", performanceType: "CALCULATE", mappedCurriculumUnitId: "AC-MATH-1", underCategory: "statistics" });
  const relations: CurriculumSubjectRelation[] = [subjectRelation({ subject: "statistics-mean", underCategory: "statistics" })];
  const result = buildStandardPipeline(pipeline({ officialCurriculumUnits: units, curriculum: curriculumEvidence, assessment: [item], subjectRelations: relations }));

  it("retains the Statistics category itself", () => {
    expect(findCandidate(result, "statistics")!.disposition).toBe("REQUIRED_EXPLICIT_CURRICULUM");
  });

  it("directly evidences mean as its own candidate", () => {
    expect(findCandidate(result, "statistics-mean", "CALCULATE")!.disposition).toBe("REQUIRED_ASSESSMENT_EVIDENCED");
  });

  it("records the unresolved breadth as an OPEN_SCOPE_GAP candidate and a SCOPE_BREADTH_GAP record naming the governed sub-item", () => {
    const gapCandidate = result.candidates.find((c) => c.disposition === "OPEN_SCOPE_GAP");
    expect(gapCandidate!.candidateKey).toBe("statistics::unresolved-breadth");
    const gapRecord = result.gaps.find((g) => g.gapType === "SCOPE_BREADTH_GAP");
    expect(gapRecord!.evidenceAvailable).toEqual(["statistics-mean"]);
    expect(gapRecord!.legitimateResolverRoles).toEqual(["OFFICIAL_CURRICULUM", "PUBLIC_ASSESSMENT"]);
  });

  it("never silently promotes median/mode/range -- no evidence for them means no candidate for them", () => {
    for (const s of ["statistics-median", "statistics-mode", "statistics-range"]) expect(findCandidate(result, s)).toBeUndefined();
  });
});

describe("CC-18 case G -- an AC's own verb never silently creates a different performance type; distinct performances stay distinct", () => {
  const curriculumEvidence: CurriculumEvidence[] = [curriculum({ subject: "component-x", namedInPrimaryWording: true, commandVerbPerformanceType: "STATE" })];
  const units: OfficialCurriculumUnit[] = [officialUnit({ curriculumUnitId: "AC-ELEC-6.2" })];
  const item = assessment({ subject: "component-x", performanceType: "SCHEMATIC_RECOGNITION", mappedCurriculumUnitId: "AC-ELEC-6.2", questionStemRef: "Identify this component from its schematic symbol." });
  const result = buildStandardPipeline(pipeline({ officialCurriculumUnits: units, curriculum: curriculumEvidence, assessment: [item] }));

  it("keeps operating-principle knowledge (STATE) and schematic-recognition performance as two separate candidates", () => {
    const statePrinciple = findCandidate(result, "component-x", "STATE");
    const symbolRecognition = findCandidate(result, "component-x", "SCHEMATIC_RECOGNITION");
    expect(statePrinciple!.candidateKey).not.toBe(symbolRecognition!.candidateKey);
    expect(statePrinciple!.disposition).toBe("REQUIRED_EXPLICIT_CURRICULUM");
    expect(symbolRecognition!.disposition).toBe("REQUIRED_ASSESSMENT_EVIDENCED");
  });

  it("results in exactly two candidates for this subject, not one collapsed proposition", () => {
    expect(result.candidates.filter((c) => c.subject === "component-x").length).toBe(2);
  });
});

describe("CC-18 case H -- one symbol question never generalises across an entire component family", () => {
  const item = assessment({ subject: "capacitor", performanceType: "SCHEMATIC_RECOGNITION", familyKey: "component-symbols" });
  const families: CurriculumFamily[] = [family({ familyKey: "component-symbols", memberSubjects: ["capacitor", "diode", "resistor"] })];
  const { candidates, gaps } = detectAssessmentPatternCandidates([item], families);

  it("produces no family-wide pattern candidate from a single tested member", () => {
    expect(candidates).toEqual([]);
    expect(gaps).toEqual([]);
  });
});

describe("CC-18/CC-18A case I -- repeated evidence across GOVERNED, distinct family members creates a reviewable pattern candidate", () => {
  const items: AssessmentEvidence[] = [
    assessment({ subject: "capacitor", performanceType: "SCHEMATIC_RECOGNITION", familyKey: "component-symbols" }),
    assessment({ subject: "diode", performanceType: "SCHEMATIC_RECOGNITION", familyKey: "component-symbols" }),
  ];
  const families: CurriculumFamily[] = [family({ familyKey: "component-symbols", memberSubjects: ["capacitor", "diode", "resistor"] })];
  const result = buildStandardPipeline(pipeline({ assessment: items, families }));

  it("creates an ASSESSMENT_PATTERN_CANDIDATE, disposition REVIEW_REQUIRED, spanning the two tested members", () => {
    const pattern = result.candidates.find((c) => c.assessmentPattern !== undefined);
    expect(pattern!.disposition).toBe("REVIEW_REQUIRED");
    expect([...pattern!.assessmentPattern!.evidencedMembers].sort()).toEqual(["capacitor", "diode"]);
    expect(result.gaps.some((g) => g.gapType === "ASSESSMENT_GENERALISATION_REVIEW")).toBe(true);
  });

  it("never promotes an untested family member (resistor, governed but never evidenced) to any candidate", () => {
    expect(findCandidate(result, "resistor")).toBeUndefined();
  });
});

describe("CC-18J/K -- private worksheet and legacy assertion claims are ignored by the standard pipeline", () => {
  const curriculumEvidence: CurriculumEvidence[] = [curriculum({ subject: "telephones", isRangeItem: true })];
  const calibration: OptionalCalibrationEvidence[] = [{ role: "OPTIONAL_CALIBRATION", evidenceId: "priv-1", subject: "telephone-capacitor-role", claim: "The private worksheet states the telephone capacitor is used for ringing." }];
  const legacy: LegacyDiagnosticEvidence[] = [{ role: "LEGACY_DIAGNOSTIC", evidenceId: "legacy-1", subject: "telephone-resistor-role", claim: "Existing lesson content asserts the telephone resistor is used for remote line testing." }];
  const result = buildStandardPipeline(pipeline({ curriculum: curriculumEvidence }));

  it("the standard pipeline never sees calibration/legacy evidence and produces no candidate for their claimed subjects", () => {
    expect(findCandidate(result, "telephone-capacitor-role")).toBeUndefined();
    expect(findCandidate(result, "telephone-resistor-role")).toBeUndefined();
  });

  it("a read-only diagnostic comparison records both claims without creating or mutating a candidate", () => {
    const comparison = compareAgainstDiagnosticEvidence(result.candidates, calibration, legacy);
    expect(comparison).toHaveLength(2);
    expect(comparison.every((e) => e.matchesExistingCandidate === false)).toBe(true);
  });

  it("[hard mechanical test] OPTIONAL_CALIBRATION/LEGACY_DIAGNOSTIC evidence routed into the standard pipeline's own input is rejected, not silently accepted", () => {
    const tamperedCalibration = { curriculum: [...curriculumEvidence, calibration[0]!], assessment: [], officialCurriculumUnits: [] } as unknown as StandardPipelineInput;
    expect(() => buildStandardPipeline(tamperedCalibration)).toThrow(/OPTIONAL_CALIBRATION and LEGACY_DIAGNOSTIC evidence must never be passed/);
    const tamperedLegacy = { curriculum: [...curriculumEvidence, legacy[0]!], assessment: [], officialCurriculumUnits: [] } as unknown as StandardPipelineInput;
    expect(() => buildStandardPipeline(tamperedLegacy)).toThrow(/OPTIONAL_CALIBRATION and LEGACY_DIAGNOSTIC evidence must never be passed/);
  });
});

describe("CC-18A cases L/X -- curriculum/provider vs technical factual claims are independent records; conflict is DETECTED, never pre-labelled", () => {
  const curriculumEvidence: CurriculumEvidence[] = [curriculum({ subject: "gears", namedInPrimaryWording: true, commandVerbPerformanceType: "EXPLAIN" })];
  const claims: SourceFactualClaim[] = [
    factualClaim({ claimKey: "gearing-power-conservation", subject: "gears", sourceRole: "OFFICIAL_CURRICULUM", normalizedClaimValue: "gearing creates additional power" }),
    factualClaim({ claimKey: "gearing-power-conservation", subject: "gears", sourceRole: "TECHNICAL_TRUTH", normalizedClaimValue: "ideal gearing does not create power; speed and torque trade" }),
  ];
  const result = buildStandardPipeline(pipeline({ curriculum: curriculumEvidence, factualClaims: claims }));

  it("retains gears as required scope", () => {
    expect(findCandidate(result, "gears")!.disposition).toBe("REQUIRED_EXPLICIT_CURRICULUM");
  });

  it("attaches the CORRECT technical statement, never the erroneous curriculum/provider claim -- neither claim record itself declared the conflict", () => {
    const c = findCandidate(result, "gears")!;
    expect(c.factualStatement).toBe("ideal gearing does not create power; speed and torque trade");
    expect(c.factualStatement).not.toMatch(/creates additional power/);
  });

  it("emits a CURRICULUM_TECHNICAL_CONFLICT gap record purely from comparing the two independent claims by claimKey", () => {
    const conflict = result.gaps.find((g) => g.gapType === "CURRICULUM_TECHNICAL_CONFLICT");
    expect(conflict).toBeDefined();
    expect(conflict!.legitimateResolverRoles).toEqual(["TECHNICAL_TRUTH"]);
    expect(conflict!.evidenceAvailable.join(" ")).toMatch(/creates additional power/);
  });

  it("two claims that AGREE on the same claimKey never produce a conflict", () => {
    const agreeing: SourceFactualClaim[] = [
      factualClaim({ claimKey: "gearing-power-conservation", subject: "gears", sourceRole: "OFFICIAL_CURRICULUM", normalizedClaimValue: "ideal gearing does not create power; speed and torque trade" }),
      factualClaim({ claimKey: "gearing-power-conservation", subject: "gears", sourceRole: "TECHNICAL_TRUTH", normalizedClaimValue: "ideal gearing does not create power; speed and torque trade" }),
    ];
    const r = buildStandardPipeline(pipeline({ curriculum: curriculumEvidence, factualClaims: agreeing }));
    expect(r.gaps.some((g) => g.gapType === "CURRICULUM_TECHNICAL_CONFLICT")).toBe(false);
  });
});

describe("CC-18A case M -- malformed curriculum unit corrected by independent technical claim", () => {
  const curriculumEvidence: CurriculumEvidence[] = [curriculum({ subject: "resistivity", namedInPrimaryWording: true, commandVerbPerformanceType: "DESCRIBE" })];
  const claims: SourceFactualClaim[] = [
    factualClaim({ claimKey: "resistivity-unit", subject: "resistivity", sourceRole: "OFFICIAL_CURRICULUM", normalizedClaimValue: "ohms per metre" }),
    factualClaim({ claimKey: "resistivity-unit", subject: "resistivity", sourceRole: "TECHNICAL_TRUTH", normalizedClaimValue: "ohm-metres (Ω·m)" }),
  ];
  const result = buildStandardPipeline(pipeline({ curriculum: curriculumEvidence, factualClaims: claims }));

  it("retains the correct unit as the taught fact", () => {
    expect(findCandidate(result, "resistivity")!.factualStatement).toBe("ohm-metres (Ω·m)");
  });

  it("emits a conflict record rather than silently overwriting the malformed unit", () => {
    expect(result.gaps.some((g) => g.gapType === "CURRICULUM_TECHNICAL_CONFLICT" && g.candidateKey === "resistivity::FACTUAL_CLAIM")).toBe(true);
  });
});

describe("CC-18 case N -- an explicit curriculum topic untested by any sample question remains required", () => {
  const curriculumEvidence: CurriculumEvidence[] = [curriculum({ subject: "topic-never-sampled", namedInPrimaryWording: true, commandVerbPerformanceType: "DESCRIBE" })];
  const result = buildStandardPipeline(pipeline({ curriculum: curriculumEvidence }));

  it("remains a REQUIRED_EXPLICIT_CURRICULUM candidate despite zero assessment evidence", () => {
    const c = findCandidate(result, "topic-never-sampled");
    expect(c!.disposition).toBe("REQUIRED_EXPLICIT_CURRICULUM");
    expect(c!.confidence.scopeConfidence).toBe("HIGH");
  });

  it("absence of assessment coverage produces a depth gap, never a scope removal", () => {
    expect(result.gaps.some((g) => g.gapType === "PERFORMANCE_DEPTH_GAP")).toBe(true);
    expect(result.candidates.some((c) => c.subject === "topic-never-sampled")).toBe(true);
  });
});

describe("CC-18/CC-18A case O -- an interesting adjacent technical topic never becomes curriculum scope", () => {
  const claims: SourceFactualClaim[] = [factualClaim({ claimKey: "adjacent", subject: "adjacent-interesting-topic", sourceRole: "TECHNICAL_TRUTH", normalizedClaimValue: "A true and interesting fact about a related but never-required topic." })];
  const result = buildStandardPipeline(pipeline({ factualClaims: claims }));

  it("creates no candidate for the adjacent topic", () => {
    expect(result.candidates).toEqual([]);
  });

  it("still records it as unmatched technical truth, available but unused", () => {
    expect(result.unmatchedTechnicalTruth).toHaveLength(1);
    expect(result.unmatchedTechnicalTruth[0]!.subject).toBe("adjacent-interesting-topic");
  });
});

// =====================================================================
// CC-18A new cases S-AC.
// =====================================================================

describe("CC-18A case S -- an ungoverned underCategory label never drives scope-breadth conclusions", () => {
  const curriculumEvidence: CurriculumEvidence[] = [curriculum({ subject: "statistics", isRangeItem: true, breadthStatus: "OPEN_OR_UNDERSPECIFIED" })];
  const units: OfficialCurriculumUnit[] = [officialUnit({ curriculumUnitId: "AC-MATH-1" })];
  const item = assessment({ subject: "statistics-mean", performanceType: "CALCULATE", mappedCurriculumUnitId: "AC-MATH-1", underCategory: "statistics" });
  // No matching CurriculumSubjectRelation is supplied -- the relation is ungoverned.
  const result = buildStandardPipeline(pipeline({ officialCurriculumUnits: units, curriculum: curriculumEvidence, assessment: [item], subjectRelations: [] }));

  it("the breadth gap still fires (curriculum declared OPEN_OR_UNDERSPECIFIED) but lists no evidenced sub-item, since the relation is ungoverned", () => {
    const gapRecord = result.gaps.find((g) => g.gapType === "SCOPE_BREADTH_GAP");
    expect(gapRecord).toBeDefined();
    expect(gapRecord!.evidenceAvailable).toEqual([]);
  });

  it("statistics-mean is still independently REQUIRED_ASSESSMENT_EVIDENCED on its own positive-target merits -- the ungoverned relation only affects breadth bookkeeping, not the item's own validity", () => {
    expect(findCandidate(result, "statistics-mean", "CALCULATE")!.disposition).toBe("REQUIRED_ASSESSMENT_EVIDENCED");
  });
});

describe("CC-18A case T -- an ungoverned familyKey never produces assessment-family generalisation", () => {
  const items: AssessmentEvidence[] = [
    assessment({ subject: "capacitor", performanceType: "SCHEMATIC_RECOGNITION", familyKey: "not-a-governed-family" }),
    assessment({ subject: "diode", performanceType: "SCHEMATIC_RECOGNITION", familyKey: "not-a-governed-family" }),
  ];
  // No CurriculumFamily declares "not-a-governed-family" at all.
  const { candidates, gaps } = detectAssessmentPatternCandidates(items, []);

  it("produces no pattern candidate despite two distinct members sharing the label", () => {
    expect(candidates).toEqual([]);
    expect(gaps).toEqual([]);
  });

  it("also produces none when a family IS governed but does not list these members", () => {
    const unrelatedFamily: CurriculumFamily[] = [family({ familyKey: "not-a-governed-family", memberSubjects: ["some-other-subject"] })];
    const { candidates: c2 } = detectAssessmentPatternCandidates(items, unrelatedFamily);
    expect(c2).toEqual([]);
  });
});

describe("CC-18A case U -- qualification-level evidence constrains depth but never creates scope", () => {
  const curriculumEvidence: CurriculumEvidence[] = [curriculum({ subject: "explicit-topic", namedInPrimaryWording: true, commandVerbPerformanceType: "CALCULATE" })];
  const targetKey = generateCurriculumCandidates(curriculumEvidence)[0]!.candidateKey;
  const levelEvidence: QualificationLevelEvidence[] = [
    { role: "QUALIFICATION_LEVEL", evidenceId: "level-1", levelId: "LEVEL-2", sourceRef: "SRC-FRAMEWORK", sourceLocator: "framework-loc", normalizationBasis: "QUALIFICATION_LEVEL_DESCRIPTOR", depthConstraintDescriptor: "Single-step calculation only, no multi-stage derivation.", appliesToCandidateKey: targetKey },
    { role: "QUALIFICATION_LEVEL", evidenceId: "level-2", levelId: "LEVEL-2", sourceRef: "SRC-FRAMEWORK", sourceLocator: "framework-loc-2", normalizationBasis: "QUALIFICATION_LEVEL_DESCRIPTOR", depthConstraintDescriptor: "Constrains a subject with no matching candidate.", appliesToCandidateKey: "no-such-candidate::OTHER" },
  ];
  const result = buildStandardPipeline(pipeline({ curriculum: curriculumEvidence, qualificationLevel: levelEvidence }));

  it("attaches the depth constraint to the existing candidate it names", () => {
    const c = findCandidate(result, "explicit-topic")!;
    expect(c.qualificationLevelRefs?.length).toBe(1);
    expect(c.depthConstraintNote).toMatch(/Single-step calculation only/);
    expect(c.disposition).toBe("REQUIRED_EXPLICIT_CURRICULUM"); // unchanged by the level constraint
  });

  it("creates no new candidate for the second QualificationLevelEvidence's unmatched key -- recorded as unmatched instead", () => {
    expect(result.candidates.some((c) => c.candidateKey === "no-such-candidate::OTHER")).toBe(false);
    expect(result.unmatchedQualificationLevel).toHaveLength(1);
    expect(result.unmatchedQualificationLevel[0]!.evidenceId).toBe("level-2");
  });

  it("qualification-level evidence alone, with no curriculum/assessment evidence at all, creates zero candidates", () => {
    const r = buildStandardPipeline(pipeline({ qualificationLevel: levelEvidence }));
    expect(r.candidates).toEqual([]);
  });
});

describe("CC-18A cases V/W -- a prerequisite can become FOUNDATIONAL_PREREQUISITE only via a structural capabilityKey match, never a free-form label alone", () => {
  const curriculumEvidence: CurriculumEvidence[] = [
    curriculum({ subject: "explicit-calculation", namedInPrimaryWording: true, commandVerbPerformanceType: "CALCULATE", requiredCapabilityKeys: ["formula-transposition"] }),
    curriculum({ subject: "diode-operation", namedInPrimaryWording: true, commandVerbPerformanceType: "STATE" }), // declares NO requiredCapabilityKeys
  ];
  const baseCandidates = generateCurriculumCandidates(curriculumEvidence);
  const calculationKey = baseCandidates.find((c) => c.subject === "explicit-calculation")!.candidateKey;
  const diodeKey = baseCandidates.find((c) => c.subject === "diode-operation")!.candidateKey;

  const prerequisites: PrerequisiteEvidence[] = [
    // W: matching structural capability dependency exists.
    { kind: "STRUCTURAL_PREREQUISITE_DEPENDENCY", evidenceId: "prereq-w", subject: "formula-transposition", performanceType: "PROCEDURE", capabilityKey: "formula-transposition", necessaryForCandidateKey: calculationKey, minimalDepthJustification: "The explicit calculation cannot be performed without rearranging its own formula.", sourceRef: "SRC-DEPENDENCY", sourceLocator: "dep-loc-1", normalizationBasis: "STRUCTURAL_PREREQUISITE_DEPENDENCY" },
    // V: unrelated topic labelled as necessary, but the target candidate never structurally declares this capability.
    { kind: "STRUCTURAL_PREREQUISITE_DEPENDENCY", evidenceId: "prereq-v", subject: "semiconductor-band-theory", performanceType: "EXPLAIN", capabilityKey: "semiconductor-band-theory", necessaryForCandidateKey: diodeKey, minimalDepthJustification: "Claimed as necessary, but diode-operation declares no such requiredCapabilityKeys entry.", sourceRef: "SRC-DEPENDENCY", sourceLocator: "dep-loc-2", normalizationBasis: "STRUCTURAL_PREREQUISITE_DEPENDENCY" },
  ];

  const result = buildStandardPipeline(pipeline({ curriculum: curriculumEvidence, prerequisites }));

  it("[W] promotes a prerequisite to FOUNDATIONAL_PREREQUISITE only when its capabilityKey matches the target's own requiredCapabilityKeys", () => {
    const c = findCandidate(result, "formula-transposition");
    expect(c!.disposition).toBe("FOUNDATIONAL_PREREQUISITE");
  });

  it("[V] a claimed necessity without a matching structural capability dependency is NEVER promoted to FOUNDATIONAL_PREREQUISITE, even though a real required target exists", () => {
    const c = findCandidate(result, "semiconductor-band-theory");
    expect(c!.disposition).not.toBe("FOUNDATIONAL_PREREQUISITE");
    expect(c!.disposition).toBe("REVIEW_REQUIRED");
  });

  it("a prerequisite whose necessaryForCandidateKey references no real required candidate at all is capped at CONTEXTUAL_TEACHING_SUPPORT", () => {
    const orphan: PrerequisiteEvidence[] = [
      { kind: "STRUCTURAL_PREREQUISITE_DEPENDENCY", evidenceId: "prereq-orphan", subject: "unrelated-skill", performanceType: "OTHER", capabilityKey: "x", necessaryForCandidateKey: "nothing::OTHER", minimalDepthJustification: "n/a", sourceRef: "SRC-DEPENDENCY", sourceLocator: "dep-loc-3", normalizationBasis: "STRUCTURAL_PREREQUISITE_DEPENDENCY" },
    ];
    const r = buildStandardPipeline(pipeline({ curriculum: curriculumEvidence, prerequisites: orphan }));
    expect(findCandidate(r, "unrelated-skill")!.disposition).toBe("CONTEXTUAL_TEACHING_SUPPORT");
  });
});

describe("CC-18A case Y -- an optional-calibration factual claim contradicting technical truth is diagnostic only, never standard-mode scope", () => {
  const calibrationClaims: SourceFactualClaim[] = [factualClaim({ claimKey: "gearing-power-conservation", subject: "gears", sourceRole: "OPTIONAL_CALIBRATION", normalizedClaimValue: "gearing creates additional power" })];
  const technicalClaims: SourceFactualClaim[] = [factualClaim({ claimKey: "gearing-power-conservation", subject: "gears", sourceRole: "TECHNICAL_TRUTH", normalizedClaimValue: "ideal gearing does not create power; speed and torque trade" })];

  it("compareCalibrationFactualClaims detects the conflict diagnostically", () => {
    const conflicts = compareCalibrationFactualClaims(calibrationClaims, technicalClaims);
    expect(conflicts).toHaveLength(1);
    expect(conflicts[0]!.gapType).toBe("CURRICULUM_TECHNICAL_CONFLICT");
  });

  it("the standard pipeline never sees the calibration claim and produces no required scope from it", () => {
    const result = buildStandardPipeline(pipeline({ factualClaims: technicalClaims }));
    expect(result.candidates).toEqual([]);
    expect(result.gaps.some((g) => g.gapType === "CURRICULUM_TECHNICAL_CONFLICT")).toBe(false);
  });

  it("[hard mechanical test] passing an OPTIONAL_CALIBRATION-sourced factual claim into the standard pipeline's own factualClaims input is rejected", () => {
    expect(() => buildStandardPipeline(pipeline({ factualClaims: calibrationClaims }))).toThrow(/OPTIONAL_CALIBRATION/);
  });
});

describe("CC-18A case Z -- OPEN_OR_UNDERSPECIFIED category produces SCOPE_BREADTH_GAP with ZERO assessment evidence", () => {
  const curriculumEvidence: CurriculumEvidence[] = [curriculum({ subject: "broad-category", isRangeItem: true, breadthStatus: "OPEN_OR_UNDERSPECIFIED" })];
  const result = buildStandardPipeline(pipeline({ curriculum: curriculumEvidence, assessment: [] }));

  it("still retains the category as required scope", () => {
    expect(findCandidate(result, "broad-category")!.disposition).toBe("REQUIRED_EXPLICIT_CURRICULUM");
  });

  it("still emits the breadth gap despite there being no assessment evidence at all", () => {
    const gap = result.gaps.find((g) => g.gapType === "SCOPE_BREADTH_GAP");
    expect(gap).toBeDefined();
    expect(gap!.evidenceAvailable).toEqual([]);
    const gapCandidate = result.candidates.find((c) => c.disposition === "OPEN_SCOPE_GAP");
    expect(gapCandidate).toBeDefined();
  });
});

describe("CC-18A case AA -- ENUMERATED_COMPLETE category never produces a false breadth gap merely from assessment absence", () => {
  const curriculumEvidence: CurriculumEvidence[] = [curriculum({ subject: "fully-enumerated-category", isRangeItem: true, breadthStatus: "ENUMERATED_COMPLETE" })];
  const result = buildStandardPipeline(pipeline({ curriculum: curriculumEvidence, assessment: [] }));

  it("the category remains required", () => {
    expect(findCandidate(result, "fully-enumerated-category")!.disposition).toBe("REQUIRED_EXPLICIT_CURRICULUM");
  });

  it("no SCOPE_BREADTH_GAP and no OPEN_SCOPE_GAP/REVIEW_REQUIRED candidate is produced for it", () => {
    expect(result.gaps.some((g) => g.gapType === "SCOPE_BREADTH_GAP")).toBe(false);
    expect(result.candidates.some((c) => c.disposition === "OPEN_SCOPE_GAP" || c.disposition === "REVIEW_REQUIRED")).toBe(false);
    expect(result.candidates.length).toBe(1);
  });
});

describe("CC-18A case AB -- an UNKNOWN breadth state is preserved as review uncertainty, never silently treated as complete", () => {
  it("a category with no declared breadthStatus at all defaults to UNKNOWN, not ENUMERATED_COMPLETE", () => {
    const curriculumEvidence: CurriculumEvidence[] = [curriculum({ subject: "undeclared-breadth-category", isRangeItem: true })]; // breadthStatus omitted entirely
    const result = buildStandardPipeline(pipeline({ curriculum: curriculumEvidence }));
    const reviewCandidate = result.candidates.find((c) => c.disposition === "REVIEW_REQUIRED" && c.candidateKey === "undeclared-breadth-category::unresolved-breadth");
    expect(reviewCandidate).toBeDefined();
    const gap = result.gaps.find((g) => g.gapType === "SCOPE_BREADTH_GAP");
    expect(gap!.unresolved).toMatch(/UNKNOWN/);
  });

  it("an explicitly declared UNKNOWN status produces the same review-required outcome, distinct from OPEN_OR_UNDERSPECIFIED's own OPEN_SCOPE_GAP disposition", () => {
    const curriculumEvidence: CurriculumEvidence[] = [curriculum({ subject: "explicit-unknown-category", isRangeItem: true, breadthStatus: "UNKNOWN" })];
    const result = buildStandardPipeline(pipeline({ curriculum: curriculumEvidence }));
    const c = result.candidates.find((cand) => cand.candidateKey === "explicit-unknown-category::unresolved-breadth")!;
    expect(c.disposition).toBe("REVIEW_REQUIRED");
    expect(c.disposition).not.toBe("OPEN_SCOPE_GAP");
  });
});

describe("CC-18A case AC -- evidence lacking mandatory source provenance is rejected, never silently accepted at HIGH confidence", () => {
  it("hasValidProvenance rejects empty sourceRef/sourceLocator and accepts well-formed provenance", () => {
    expect(hasValidProvenance({ sourceRef: "", sourceLocator: "x", normalizationBasis: "EXPLICIT_CURRICULUM_WORDING" })).toBe(false);
    expect(hasValidProvenance({ sourceRef: "x", sourceLocator: "", normalizationBasis: "EXPLICIT_CURRICULUM_WORDING" })).toBe(false);
    expect(hasValidProvenance({ sourceRef: "x", sourceLocator: "y", normalizationBasis: "EXPLICIT_CURRICULUM_WORDING" })).toBe(true);
  });

  it("a CurriculumEvidence record with empty sourceRef is excluded from candidate generation entirely", () => {
    const invalid = curriculum({ subject: "no-provenance-topic", namedInPrimaryWording: true, sourceRef: "" });
    expect(generateCurriculumCandidates([invalid])).toEqual([]);
  });

  it("an AssessmentEvidence record with empty sourceLocator is excluded from candidate generation entirely, even with a valid mapping", () => {
    const units: OfficialCurriculumUnit[] = [officialUnit({ curriculumUnitId: "AC-X" })];
    const invalid = assessment({ subject: "no-provenance-item", performanceType: "STATE", mappedCurriculumUnitId: "AC-X", sourceLocator: "" });
    const { candidates } = generateAssessmentCandidates([invalid], units);
    expect(candidates).toEqual([]);
  });

  it("end-to-end: a provenance-invalid record produces no HIGH-confidence required candidate via the full standard pipeline", () => {
    const invalidCurriculum = curriculum({ subject: "rejected-topic", namedInPrimaryWording: true, sourceRef: "   " });
    const result = buildStandardPipeline(pipeline({ curriculum: [invalidCurriculum] }));
    expect(findCandidate(result, "rejected-topic")).toBeUndefined();
  });
});

// =====================================================================
// Cross-cutting rules retained from CC-18.
// =====================================================================

describe("CC-18 -- exemplar vs mastery (task section 12)", () => {
  const curriculumEvidence: CurriculumEvidence[] = [curriculum({ subject: "security-alarms", isRangeItem: true })];
  const exemplars = [{ role: "TECHNICAL_TRUTH" as const, evidenceId: "exemplar-1", exemplarOfCategory: "security-alarms", exemplarSubject: "transistor-thyristor-alarm-topology", implementationDetailSubjects: ["latch-resistor-value", "specific-contact-arrangement"] }];
  const result = buildStandardPipeline(pipeline({ curriculum: curriculumEvidence, exemplars }));

  it("creates the exemplar as REPRESENTATIVE_EXEMPLAR, distinct from the required category", () => {
    const category = findCandidate(result, "security-alarms");
    const exemplar = findCandidate(result, "transistor-thyristor-alarm-topology");
    expect(category!.disposition).toBe("REQUIRED_EXPLICIT_CURRICULUM");
    expect(exemplar!.disposition).toBe("REPRESENTATIVE_EXEMPLAR");
    expect(exemplar!.exemplarOfCategory).toBe("security-alarms");
  });

  it("never promotes the exemplar's own implementation detail to independent candidates", () => {
    expect(findCandidate(result, "latch-resistor-value")).toBeUndefined();
    expect(findCandidate(result, "specific-contact-arrangement")).toBeUndefined();
  });

  it("creates no exemplar candidate when its category is not itself required", () => {
    const orphanExemplar = [{ role: "TECHNICAL_TRUTH" as const, evidenceId: "exemplar-2", exemplarOfCategory: "never-required-category", exemplarSubject: "orphan-example" }];
    const r = buildStandardPipeline(pipeline({ exemplars: orphanExemplar }));
    expect(r.candidates).toEqual([]);
  });

  it("no longer accepts OPTIONAL_CALIBRATION as an exemplar source role (CC-18A tightening)", () => {
    const badExemplar = [{ role: "OPTIONAL_CALIBRATION", evidenceId: "exemplar-bad", exemplarOfCategory: "security-alarms", exemplarSubject: "should-be-rejected" }] as unknown as StandardPipelineInput["exemplars"];
    expect(() => buildStandardPipeline(pipeline({ curriculum: curriculumEvidence, exemplars: badExemplar }))).toThrow();
  });
});

describe("CC-18 -- absence-of-evidence rule (task section 15)", () => {
  it("an explicit curriculum requirement is never removed merely because no sample question was located for it", () => {
    const curriculumEvidence: CurriculumEvidence[] = [curriculum({ subject: "unsampled-topic", namedInPrimaryWording: true })];
    const withNoAssessment = buildStandardPipeline(pipeline({ curriculum: curriculumEvidence }));
    const units: OfficialCurriculumUnit[] = [officialUnit({ curriculumUnitId: "AC-Y" })];
    const withUnrelatedAssessment = buildStandardPipeline(
      pipeline({
        curriculum: curriculumEvidence,
        officialCurriculumUnits: units,
        assessment: [assessment({ subject: "a-completely-different-topic", performanceType: "STATE", mappedCurriculumUnitId: "AC-Y" })],
      }),
    );
    for (const result of [withNoAssessment, withUnrelatedAssessment]) {
      expect(findCandidate(result, "unsampled-topic")!.disposition).toBe("REQUIRED_EXPLICIT_CURRICULUM");
    }
  });
});

describe("CC-18/CC-18A -- architecture-integrity checks", () => {
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

describe("CC-18/CC-18A -- generic disposition/confidence/gap plumbing sanity", () => {
  it("generateAssessmentCandidates rejects an item with no valid curriculum mapping", () => {
    const evidence: AssessmentEvidence[] = [assessment({ subject: "unmapped-subject", performanceType: "STATE", mappedCurriculumUnitId: "" })];
    const { candidates, gaps } = generateAssessmentCandidates(evidence, []);
    expect(candidates).toEqual([]);
    expect(gaps).toHaveLength(1);
    expect(gaps[0]!.gapType).toBe("ASSESSMENT_MAPPING_REVIEW");
  });

  it("every candidate carries a non-empty rationale and at least one evidence reference", () => {
    const curriculumEvidence: CurriculumEvidence[] = [curriculum({ subject: "s1", namedInPrimaryWording: true })];
    const result = buildStandardPipeline(pipeline({ curriculum: curriculumEvidence }));
    for (const c of result.candidates) {
      expect(c.rationale.length).toBeGreaterThan(0);
      expect(c.evidenceRefs.length).toBeGreaterThan(0);
    }
  });

  it("every gap record names at least one legitimate resolver role from the governed evidence-role enum, as a plural array", () => {
    const curriculumEvidence: CurriculumEvidence[] = [curriculum({ subject: "s1", namedInPrimaryWording: true })];
    const result = buildStandardPipeline(pipeline({ curriculum: curriculumEvidence }));
    const validRoles = ["OFFICIAL_CURRICULUM", "PUBLIC_ASSESSMENT", "QUALIFICATION_LEVEL", "TECHNICAL_TRUTH", "OPTIONAL_CALIBRATION", "LEGACY_DIAGNOSTIC", "MODEL_KNOWLEDGE"];
    for (const g of result.gaps) {
      expect(Array.isArray(g.legitimateResolverRoles)).toBe(true);
      expect(g.legitimateResolverRoles.length).toBeGreaterThan(0);
      for (const role of g.legitimateResolverRoles) expect(validRoles).toContain(role);
    }
  });

  it("TECHNICAL_TRUTH is never a legitimate resolver role for a SCOPE_BREADTH_GAP", () => {
    const curriculumEvidence: CurriculumEvidence[] = [curriculum({ subject: "broad-topic", isRangeItem: true, breadthStatus: "OPEN_OR_UNDERSPECIFIED" })];
    const result = buildStandardPipeline(pipeline({ curriculum: curriculumEvidence }));
    const breadthGap = result.gaps.find((g) => g.gapType === "SCOPE_BREADTH_GAP")!;
    expect(breadthGap.legitimateResolverRoles).not.toContain("TECHNICAL_TRUTH");
  });
});
