import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import {
  buildStandardPipeline,
  compareAgainstDiagnosticEvidence,
  detectAssessmentPatternCandidates,
  generateAssessmentCandidates,
  generateCurriculumCandidates,
  type StandardPipelineInput,
} from "./rules.ts";
import type {
  AssessmentEvidence,
  CurriculumEvidence,
  LegacyDiagnosticEvidence,
  OptionalCalibrationEvidence,
  PrerequisiteEvidence,
  TechnicalTruthEvidence,
} from "./types.ts";

/**
 * CC-18 synthetic regression suite (task section 20). These fixtures are
 * deliberately NOT drawn from Unit 202's governed matrix or corpus -- they
 * exist only to mechanically prove the generic pipeline rules, cases A-O,
 * with topic names chosen for readability, never as expected-answer
 * authority for any real qualification.
 */

function findCandidate(result: ReturnType<typeof buildStandardPipeline>, subject: string, performanceType?: string) {
  return result.candidates.find((c) => c.subject === subject && (performanceType === undefined || c.performanceType === performanceType));
}

describe("CC-18 case A -- AC names levers/gears/pulleys, Range only lists lever classes", () => {
  const curriculum: CurriculumEvidence[] = [
    { role: "OFFICIAL_CURRICULUM", evidenceId: "ac-1", curriculumUnitId: "AC-MECH-1", subject: "levers", namedInPrimaryWording: true, isRangeItem: false, commandVerbPerformanceType: "EXPLAIN" },
    { role: "OFFICIAL_CURRICULUM", evidenceId: "ac-1", curriculumUnitId: "AC-MECH-1", subject: "gears", namedInPrimaryWording: true, isRangeItem: false, commandVerbPerformanceType: "EXPLAIN" },
    { role: "OFFICIAL_CURRICULUM", evidenceId: "ac-1", curriculumUnitId: "AC-MECH-1", subject: "pulleys", namedInPrimaryWording: true, isRangeItem: false, commandVerbPerformanceType: "EXPLAIN" },
    { role: "OFFICIAL_CURRICULUM", evidenceId: "range-1", curriculumUnitId: "AC-MECH-1", subject: "lever-class-i", namedInPrimaryWording: false, isRangeItem: true, refinesSubject: "levers" },
    { role: "OFFICIAL_CURRICULUM", evidenceId: "range-2", curriculumUnitId: "AC-MECH-1", subject: "lever-class-ii", namedInPrimaryWording: false, isRangeItem: true, refinesSubject: "levers" },
    { role: "OFFICIAL_CURRICULUM", evidenceId: "range-3", curriculumUnitId: "AC-MECH-1", subject: "lever-class-iii", namedInPrimaryWording: false, isRangeItem: true, refinesSubject: "levers" },
  ];
  const result = buildStandardPipeline({ curriculum, assessment: [] });

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
  const curriculum: CurriculumEvidence[] = [
    { role: "OFFICIAL_CURRICULUM", evidenceId: "range-tel", curriculumUnitId: "AC-ELEC-6", subject: "telephones", namedInPrimaryWording: false, isRangeItem: true },
  ];
  const result = buildStandardPipeline({ curriculum, assessment: [] });

  it("retains the category itself", () => {
    const c = findCandidate(result, "telephones");
    expect(c).toBeDefined();
    expect(c!.disposition).toBe("REQUIRED_EXPLICIT_CURRICULUM");
    expect(c!.confidence.scopeConfidence).toBe("HIGH");
  });

  it("invents no internal implementation-detail candidates", () => {
    const inventedSubjects = ["telephone-capacitor-role", "telephone-resistor-role", "telephone-surge-protector-role", "hook-switch", "hybrid-transformer"];
    for (const s of inventedSubjects) expect(findCandidate(result, s)).toBeUndefined();
    expect(result.candidates.length).toBe(1);
  });
});

describe("CC-18 case C -- public assessment generates a brand-new candidate with no prior curriculum row", () => {
  const assessment: AssessmentEvidence[] = [
    {
      role: "PUBLIC_ASSESSMENT",
      evidenceId: "item-1",
      assessmentSource: "Sample Paper A",
      itemId: "Q7",
      mappedCurriculumUnitId: "AC-MAG-1",
      questionStemRef: "Identify the South pole of this solenoid.",
      correctAnswerTarget: "South pole identified from the shown current/field arrangement",
      subject: "solenoid-polarity",
      performanceType: "IDENTIFY",
    },
  ];
  const result = buildStandardPipeline({ curriculum: [], assessment });

  it("generates a solenoid-polarity candidate even with zero prior curriculum evidence", () => {
    const c = findCandidate(result, "solenoid-polarity", "IDENTIFY");
    expect(c).toBeDefined();
    expect(c!.disposition).toBe("REQUIRED_ASSESSMENT_EVIDENCED");
    expect(c!.confidence.scopeConfidence).toBe("HIGH");
    expect(c!.confidence.depthConfidence).toBe("HIGH");
  });
});

describe("CC-18 case D -- a distractor-only subject never generates a candidate", () => {
  const assessment: AssessmentEvidence[] = [
    {
      role: "PUBLIC_ASSESSMENT",
      evidenceId: "item-2",
      assessmentSource: "Sample Paper A",
      itemId: "Q12",
      mappedCurriculumUnitId: "AC-ELEC-6",
      questionStemRef: "Which component switches the alarm sounder circuit?",
      correctAnswerTarget: "transistor identified as the switching component",
      subject: "transistor-switching-role",
      performanceType: "COMPONENT_ROLE",
      distractorSubjects: ["relay", "contactor", "thermistor"],
    },
  ];
  const result = buildStandardPipeline({ curriculum: [], assessment });

  it("creates the positive-target candidate only", () => {
    expect(findCandidate(result, "transistor-switching-role")).toBeDefined();
  });

  it("never creates a candidate for any distractor subject from the same item", () => {
    for (const s of ["relay", "contactor", "thermistor"]) expect(findCandidate(result, s)).toBeUndefined();
    expect(result.candidates.length).toBe(1);
  });
});

describe("CC-18 case E -- a technical-truth source discussing a subject with no curriculum/assessment evidence creates no scope", () => {
  const technicalTruth: TechnicalTruthEvidence[] = [
    { role: "TECHNICAL_TRUTH", evidenceId: "tech-1", subject: "relay", correctStatement: "A relay uses an electromagnet to operate a mechanically separate switch contact." },
    { role: "TECHNICAL_TRUTH", evidenceId: "tech-2", subject: "contactor", correctStatement: "A contactor is a heavier-duty relay variant rated for higher switching currents." },
  ];
  const result = buildStandardPipeline({ curriculum: [], assessment: [], technicalTruth });

  it("creates no candidate for relay or contactor", () => {
    expect(findCandidate(result, "relay")).toBeUndefined();
    expect(findCandidate(result, "contactor")).toBeUndefined();
    expect(result.candidates.length).toBe(0);
  });

  it("still records the factual evidence as unmatched, never silently discarded", () => {
    expect([...result.unmatchedTechnicalTruth.map((e) => e.subject)].sort()).toEqual(["contactor", "relay"]);
  });
});

describe("CC-18 case F -- broad Range label with one directly-evidenced sub-item produces OPEN_SCOPE_GAP, not a silent narrow or broad resolution", () => {
  const curriculum: CurriculumEvidence[] = [
    { role: "OFFICIAL_CURRICULUM", evidenceId: "range-stats", curriculumUnitId: "AC-MATH-1", subject: "statistics", namedInPrimaryWording: false, isRangeItem: true, breadthFullyEnumerated: false },
  ];
  const assessment: AssessmentEvidence[] = [
    {
      role: "PUBLIC_ASSESSMENT",
      evidenceId: "item-mean",
      assessmentSource: "Sample Paper B",
      itemId: "Q3",
      mappedCurriculumUnitId: "AC-MATH-1",
      questionStemRef: "Calculate the mean of this dataset.",
      correctAnswerTarget: "mean correctly calculated",
      subject: "statistics-mean",
      performanceType: "CALCULATE",
      underCategory: "statistics",
    },
  ];
  const result = buildStandardPipeline({ curriculum, assessment });

  it("retains the Statistics category itself", () => {
    const c = findCandidate(result, "statistics");
    expect(c).toBeDefined();
    expect(c!.disposition).toBe("REQUIRED_EXPLICIT_CURRICULUM");
  });

  it("directly evidences mean as its own candidate", () => {
    const c = findCandidate(result, "statistics-mean", "CALCULATE");
    expect(c).toBeDefined();
    expect(c!.disposition).toBe("REQUIRED_ASSESSMENT_EVIDENCED");
  });

  it("records the unresolved breadth as an OPEN_SCOPE_GAP candidate and a SCOPE_BREADTH_GAP record", () => {
    const gapCandidate = result.candidates.find((c) => c.disposition === "OPEN_SCOPE_GAP");
    expect(gapCandidate).toBeDefined();
    expect(gapCandidate!.candidateKey).toBe("statistics::unresolved-breadth");
    const gapRecord = result.gaps.find((g) => g.gapType === "SCOPE_BREADTH_GAP");
    expect(gapRecord).toBeDefined();
    expect(gapRecord!.evidenceAvailable).toEqual(["statistics-mean"]);
  });

  it("never silently promotes median/mode/range -- no evidence for them means no candidate for them", () => {
    for (const s of ["statistics-median", "statistics-mode", "statistics-range", "median", "mode", "range"]) {
      expect(findCandidate(result, s)).toBeUndefined();
    }
  });
});

describe("CC-18 case G -- an AC's own verb never silently creates a different performance type; distinct performances stay distinct", () => {
  const curriculum: CurriculumEvidence[] = [
    { role: "OFFICIAL_CURRICULUM", evidenceId: "ac-comp", curriculumUnitId: "AC-ELEC-6.2", subject: "component-x", namedInPrimaryWording: true, isRangeItem: false, commandVerbPerformanceType: "STATE" },
  ];
  const assessment: AssessmentEvidence[] = [
    {
      role: "PUBLIC_ASSESSMENT",
      evidenceId: "item-symbol",
      assessmentSource: "Sample Paper A",
      itemId: "Q9",
      mappedCurriculumUnitId: "AC-ELEC-6.2",
      questionStemRef: "Identify this component from its schematic symbol.",
      correctAnswerTarget: "component-x symbol correctly identified",
      subject: "component-x",
      performanceType: "SCHEMATIC_RECOGNITION",
    },
  ];
  const result = buildStandardPipeline({ curriculum, assessment });

  it("keeps operating-principle knowledge (STATE) and schematic-recognition performance as two separate candidates", () => {
    const statePrinciple = findCandidate(result, "component-x", "STATE");
    const symbolRecognition = findCandidate(result, "component-x", "SCHEMATIC_RECOGNITION");
    expect(statePrinciple).toBeDefined();
    expect(symbolRecognition).toBeDefined();
    expect(statePrinciple!.candidateKey).not.toBe(symbolRecognition!.candidateKey);
    expect(statePrinciple!.disposition).toBe("REQUIRED_EXPLICIT_CURRICULUM");
    expect(symbolRecognition!.disposition).toBe("REQUIRED_ASSESSMENT_EVIDENCED");
  });

  it("results in exactly two candidates for this subject, not one collapsed proposition", () => {
    expect(result.candidates.filter((c) => c.subject === "component-x").length).toBe(2);
  });
});

describe("CC-18 case H -- one symbol question never generalises across an entire component family", () => {
  const assessment: AssessmentEvidence[] = [
    {
      role: "PUBLIC_ASSESSMENT",
      evidenceId: "item-cap-symbol",
      assessmentSource: "Sample Paper A",
      itemId: "Q4",
      mappedCurriculumUnitId: "AC-ELEC-6.2",
      questionStemRef: "Identify this symbol.",
      correctAnswerTarget: "capacitor symbol identified",
      subject: "capacitor",
      performanceType: "SCHEMATIC_RECOGNITION",
      familyKey: "component-symbols",
    },
  ];
  const { candidates, gaps } = detectAssessmentPatternCandidates(assessment);

  it("produces no family-wide pattern candidate from a single tested member", () => {
    expect(candidates).toEqual([]);
    expect(gaps).toEqual([]);
  });
});

describe("CC-18 case I -- repeated evidence across distinct family members creates a reviewable pattern candidate, never silent promotion of untested members", () => {
  const assessment: AssessmentEvidence[] = [
    {
      role: "PUBLIC_ASSESSMENT",
      evidenceId: "item-cap-symbol",
      assessmentSource: "Sample Paper A",
      itemId: "Q4",
      mappedCurriculumUnitId: "AC-ELEC-6.2",
      questionStemRef: "Identify this symbol.",
      correctAnswerTarget: "capacitor symbol identified",
      subject: "capacitor",
      performanceType: "SCHEMATIC_RECOGNITION",
      familyKey: "component-symbols",
    },
    {
      role: "PUBLIC_ASSESSMENT",
      evidenceId: "item-diode-symbol",
      assessmentSource: "Sample Paper B",
      itemId: "Q6",
      mappedCurriculumUnitId: "AC-ELEC-6.2",
      questionStemRef: "Identify this symbol.",
      correctAnswerTarget: "diode symbol identified",
      subject: "diode",
      performanceType: "SCHEMATIC_RECOGNITION",
      familyKey: "component-symbols",
    },
  ];
  const result = buildStandardPipeline({ curriculum: [], assessment });

  it("creates an ASSESSMENT_PATTERN_CANDIDATE, disposition REVIEW_REQUIRED, spanning the two tested members", () => {
    const pattern = result.candidates.find((c) => c.assessmentPattern !== undefined);
    expect(pattern).toBeDefined();
    expect(pattern!.disposition).toBe("REVIEW_REQUIRED");
    expect([...pattern!.assessmentPattern!.evidencedMembers].sort()).toEqual(["capacitor", "diode"]);
    expect(result.gaps.some((g) => g.gapType === "ASSESSMENT_GENERALISATION_REVIEW")).toBe(true);
  });

  it("keeps the individually tested members separately REQUIRED_ASSESSMENT_EVIDENCED", () => {
    expect(findCandidate(result, "capacitor", "SCHEMATIC_RECOGNITION")!.disposition).toBe("REQUIRED_ASSESSMENT_EVIDENCED");
    expect(findCandidate(result, "diode", "SCHEMATIC_RECOGNITION")!.disposition).toBe("REQUIRED_ASSESSMENT_EVIDENCED");
  });

  it("never promotes an untested family member (e.g. resistor, never mentioned in any evidence) to any candidate", () => {
    expect(findCandidate(result, "resistor")).toBeUndefined();
  });
});

describe("CC-18 case J -- a private worksheet claim is ignored by the standard pipeline", () => {
  const curriculum: CurriculumEvidence[] = [
    { role: "OFFICIAL_CURRICULUM", evidenceId: "range-tel", curriculumUnitId: "AC-ELEC-6", subject: "telephones", namedInPrimaryWording: false, isRangeItem: true },
  ];
  const calibration: OptionalCalibrationEvidence[] = [
    { role: "OPTIONAL_CALIBRATION", evidenceId: "priv-1", subject: "telephone-capacitor-role", claim: "The private worksheet states the telephone capacitor is used for ringing." },
  ];
  const result = buildStandardPipeline({ curriculum, assessment: [] });

  it("the standard pipeline never sees calibration evidence and produces no candidate for its claimed subject", () => {
    expect(findCandidate(result, "telephone-capacitor-role")).toBeUndefined();
  });

  it("a read-only diagnostic comparison records the claim without ever creating or mutating a candidate", () => {
    const comparison = compareAgainstDiagnosticEvidence(result.candidates, calibration, []);
    expect(comparison).toHaveLength(1);
    expect(comparison[0]!.diagnosticRole).toBe("OPTIONAL_CALIBRATION");
    expect(comparison[0]!.matchesExistingCandidate).toBe(false);
    // Comparison ran AFTER candidate generation and must not have altered it.
    expect(findCandidate(result, "telephone-capacitor-role")).toBeUndefined();
  });

  it("[hard mechanical test] OPTIONAL_CALIBRATION evidence routed into the standard pipeline's own input is rejected, not silently accepted", () => {
    const tamperedInput = { curriculum: [...curriculum, calibration[0]!], assessment: [] } as unknown as StandardPipelineInput;
    expect(() => buildStandardPipeline(tamperedInput)).toThrow(/OPTIONAL_CALIBRATION and LEGACY_DIAGNOSTIC evidence must never be passed/);
  });
});

describe("CC-18 case K -- a legacy ALP assertion claim is ignored by the standard pipeline", () => {
  const curriculum: CurriculumEvidence[] = [
    { role: "OFFICIAL_CURRICULUM", evidenceId: "range-tel", curriculumUnitId: "AC-ELEC-6", subject: "telephones", namedInPrimaryWording: false, isRangeItem: true },
  ];
  const legacy: LegacyDiagnosticEvidence[] = [
    { role: "LEGACY_DIAGNOSTIC", evidenceId: "legacy-1", subject: "telephone-resistor-role", claim: "Existing lesson content asserts the telephone resistor is used for remote line testing." },
  ];
  const result = buildStandardPipeline({ curriculum, assessment: [] });

  it("the standard pipeline never sees legacy evidence and produces no candidate for its claimed subject", () => {
    expect(findCandidate(result, "telephone-resistor-role")).toBeUndefined();
  });

  it("a read-only diagnostic comparison records the claim without creating a candidate", () => {
    const comparison = compareAgainstDiagnosticEvidence(result.candidates, [], legacy);
    expect(comparison).toHaveLength(1);
    expect(comparison[0]!.diagnosticRole).toBe("LEGACY_DIAGNOSTIC");
    expect(comparison[0]!.matchesExistingCandidate).toBe(false);
  });

  it("[hard mechanical test] LEGACY_DIAGNOSTIC evidence routed into the standard pipeline's own input is rejected, not silently accepted", () => {
    const tamperedInput = { curriculum: [...curriculum, legacy[0]!], assessment: [] } as unknown as StandardPipelineInput;
    expect(() => buildStandardPipeline(tamperedInput)).toThrow(/OPTIONAL_CALIBRATION and LEGACY_DIAGNOSTIC evidence must never be passed/);
  });
});

describe("CC-18 case L -- curriculum/provider material claims a false physical fact; approved technical truth corrects it without losing scope", () => {
  const curriculum: CurriculumEvidence[] = [
    { role: "OFFICIAL_CURRICULUM", evidenceId: "ac-gear", curriculumUnitId: "AC-MECH-1", subject: "gears", namedInPrimaryWording: true, isRangeItem: false, commandVerbPerformanceType: "EXPLAIN" },
  ];
  const technicalTruth: TechnicalTruthEvidence[] = [
    {
      role: "TECHNICAL_TRUTH",
      evidenceId: "tech-gear",
      subject: "gears",
      correctStatement: "Ideal gearing exchanges speed for torque; it never creates additional power.",
      conflictingCurriculumStatement: "Gearing increases power output.",
    },
  ];
  const result = buildStandardPipeline({ curriculum, assessment: [], technicalTruth });

  it("retains gears as required scope", () => {
    expect(findCandidate(result, "gears")!.disposition).toBe("REQUIRED_EXPLICIT_CURRICULUM");
  });

  it("attaches the CORRECT technical statement, never the erroneous curriculum/provider wording", () => {
    const c = findCandidate(result, "gears")!;
    expect(c.factualStatement).toBe("Ideal gearing exchanges speed for torque; it never creates additional power.");
    expect(c.factualStatement).not.toMatch(/increases power/);
  });

  it("emits a CURRICULUM_TECHNICAL_CONFLICT gap record for Project-Architect review", () => {
    const conflict = result.gaps.find((g) => g.gapType === "CURRICULUM_TECHNICAL_CONFLICT");
    expect(conflict).toBeDefined();
    expect(conflict!.legitimateResolverRole).toBe("TECHNICAL_TRUTH");
    expect(conflict!.evidenceAvailable.join(" ")).toMatch(/increases power output/);
  });
});

describe("CC-18 case M -- malformed curriculum unit is corrected by technical truth without losing the domain fact", () => {
  const curriculum: CurriculumEvidence[] = [
    { role: "OFFICIAL_CURRICULUM", evidenceId: "ac-resistivity", curriculumUnitId: "AC-ELEC-4.3", subject: "resistivity", namedInPrimaryWording: true, isRangeItem: false, commandVerbPerformanceType: "DESCRIBE" },
  ];
  const technicalTruth: TechnicalTruthEvidence[] = [
    {
      role: "TECHNICAL_TRUTH",
      evidenceId: "tech-resistivity",
      subject: "resistivity",
      correctStatement: "Resistivity is measured in ohm-metres (Ω·m).",
      conflictingCurriculumStatement: "Resistivity is measured in ohms per metre.",
    },
  ];
  const result = buildStandardPipeline({ curriculum, assessment: [], technicalTruth });

  it("retains the correct unit as the taught fact", () => {
    expect(findCandidate(result, "resistivity")!.factualStatement).toBe("Resistivity is measured in ohm-metres (Ω·m).");
  });

  it("emits a conflict record rather than silently overwriting the malformed unit", () => {
    expect(result.gaps.some((g) => g.gapType === "CURRICULUM_TECHNICAL_CONFLICT" && g.candidateKey === findCandidate(result, "resistivity")!.candidateKey)).toBe(true);
  });
});

describe("CC-18 case N -- an explicit curriculum topic untested by any sample question remains required", () => {
  const curriculum: CurriculumEvidence[] = [
    { role: "OFFICIAL_CURRICULUM", evidenceId: "ac-untested", curriculumUnitId: "AC-X", subject: "topic-never-sampled", namedInPrimaryWording: true, isRangeItem: false, commandVerbPerformanceType: "DESCRIBE" },
  ];
  const result = buildStandardPipeline({ curriculum, assessment: [] });

  it("remains a REQUIRED_EXPLICIT_CURRICULUM candidate despite zero assessment evidence", () => {
    const c = findCandidate(result, "topic-never-sampled");
    expect(c).toBeDefined();
    expect(c!.disposition).toBe("REQUIRED_EXPLICIT_CURRICULUM");
    expect(c!.confidence.scopeConfidence).toBe("HIGH");
  });

  it("absence of assessment coverage produces a depth gap, never a scope removal", () => {
    expect(result.gaps.some((g) => g.gapType === "PERFORMANCE_DEPTH_GAP" && g.candidateKey === findCandidate(result, "topic-never-sampled")!.candidateKey)).toBe(true);
    expect(result.candidates.some((c) => c.subject === "topic-never-sampled")).toBe(true);
  });
});

describe("CC-18 case O -- an interesting adjacent technical topic never becomes curriculum scope", () => {
  const technicalTruth: TechnicalTruthEvidence[] = [
    { role: "TECHNICAL_TRUTH", evidenceId: "tech-adjacent", subject: "adjacent-interesting-topic", correctStatement: "A true and interesting fact about a related but never-required topic." },
  ];
  const result = buildStandardPipeline({ curriculum: [], assessment: [], technicalTruth });

  it("creates no candidate for the adjacent topic", () => {
    expect(findCandidate(result, "adjacent-interesting-topic")).toBeUndefined();
    expect(result.candidates).toEqual([]);
  });

  it("still records it as unmatched technical truth, available but unused", () => {
    expect(result.unmatchedTechnicalTruth).toHaveLength(1);
    expect(result.unmatchedTechnicalTruth[0]!.subject).toBe("adjacent-interesting-topic");
  });
});

describe("CC-18 -- minimal prerequisite rule (task section 8)", () => {
  const curriculum: CurriculumEvidence[] = [
    { role: "OFFICIAL_CURRICULUM", evidenceId: "ac-calc", curriculumUnitId: "AC-X", subject: "explicit-calculation", namedInPrimaryWording: true, isRangeItem: false, commandVerbPerformanceType: "CALCULATE" },
    { role: "OFFICIAL_CURRICULUM", evidenceId: "ac-diode", curriculumUnitId: "AC-Y", subject: "diode-operation", namedInPrimaryWording: true, isRangeItem: false, commandVerbPerformanceType: "STATE" },
  ];
  const baseCandidates = generateCurriculumCandidates(curriculum);
  const calculationKey = baseCandidates.find((c) => c.subject === "explicit-calculation")!.candidateKey;
  const diodeKey = baseCandidates.find((c) => c.subject === "diode-operation")!.candidateKey;

  const prerequisites: PrerequisiteEvidence[] = [
    {
      role: "QUALIFICATION_LEVEL",
      evidenceId: "prereq-1",
      subject: "formula-transposition",
      performanceType: "PROCEDURE",
      necessaryForCandidateKey: calculationKey,
      necessityKind: "OPERATIONALLY_NECESSARY_FOR_STATED_PROCEDURE",
      minimalDepthJustification: "The explicit calculation cannot be performed without rearranging its own formula.",
    },
    {
      role: "QUALIFICATION_LEVEL",
      evidenceId: "prereq-2",
      subject: "semiconductor-band-theory",
      performanceType: "EXPLAIN",
      necessaryForCandidateKey: diodeKey,
      necessityKind: "BACKGROUND_OR_CONTEXTUAL",
      minimalDepthJustification: "Interesting background on why diodes conduct one way, but not itself required to state the operating principle.",
    },
  ];

  const result = buildStandardPipeline({ curriculum, assessment: [], prerequisites });

  it("promotes an operationally-necessary prerequisite to FOUNDATIONAL_PREREQUISITE", () => {
    const c = findCandidate(result, "formula-transposition");
    expect(c).toBeDefined();
    expect(c!.disposition).toBe("FOUNDATIONAL_PREREQUISITE");
  });

  it("caps a merely-background prerequisite claim at CONTEXTUAL_TEACHING_SUPPORT, never promoting it merely because a broader topic is in scope", () => {
    const c = findCandidate(result, "semiconductor-band-theory");
    expect(c).toBeDefined();
    expect(c!.disposition).toBe("CONTEXTUAL_TEACHING_SUPPORT");
  });
});

describe("CC-18 -- exemplar vs mastery (task section 12)", () => {
  const curriculum: CurriculumEvidence[] = [
    { role: "OFFICIAL_CURRICULUM", evidenceId: "range-alarm", curriculumUnitId: "AC-ELEC-6", subject: "security-alarms", namedInPrimaryWording: false, isRangeItem: true },
  ];
  const exemplars = [
    {
      role: "TECHNICAL_TRUTH" as const,
      evidenceId: "exemplar-1",
      exemplarOfCategory: "security-alarms",
      exemplarSubject: "transistor-thyristor-alarm-topology",
      implementationDetailSubjects: ["latch-resistor-value", "specific-contact-arrangement"],
    },
  ];
  const result = buildStandardPipeline({ curriculum, assessment: [], exemplars });

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
    const r = buildStandardPipeline({ curriculum: [], assessment: [], exemplars: orphanExemplar });
    expect(r.candidates).toEqual([]);
  });
});

describe("CC-18 -- absence-of-evidence rule (task section 15)", () => {
  it("an explicit curriculum requirement is never removed merely because no sample question was located for it", () => {
    const curriculum: CurriculumEvidence[] = [
      { role: "OFFICIAL_CURRICULUM", evidenceId: "ac-1", curriculumUnitId: "AC-X", subject: "unsampled-topic", namedInPrimaryWording: true, isRangeItem: false },
    ];
    const withNoAssessment = buildStandardPipeline({ curriculum, assessment: [] });
    const withUnrelatedAssessment = buildStandardPipeline({
      curriculum,
      assessment: [
        {
          role: "PUBLIC_ASSESSMENT",
          evidenceId: "unrelated-item",
          assessmentSource: "Sample A",
          itemId: "Q1",
          mappedCurriculumUnitId: "AC-Y",
          questionStemRef: "unrelated",
          correctAnswerTarget: "unrelated",
          subject: "a-completely-different-topic",
          performanceType: "STATE",
        },
      ],
    });
    for (const result of [withNoAssessment, withUnrelatedAssessment]) {
      const c = findCandidate(result, "unsampled-topic");
      expect(c).toBeDefined();
      expect(c!.disposition).toBe("REQUIRED_EXPLICIT_CURRICULUM");
    }
  });
});

describe("CC-18 -- architecture-integrity checks (task section 22/25)", () => {
  const rulesSource = readFileSync(path.resolve(import.meta.dirname, "rules.ts"), "utf-8");
  const typesSource = readFileSync(path.resolve(import.meta.dirname, "types.ts"), "utf-8");
  const indexSource = readFileSync(path.resolve(import.meta.dirname, "index.ts"), "utf-8");

  it("production logic (rules.ts, types.ts, index.ts) contains no qualification/topic-specific branching literals", () => {
    // Exactly the banned example literals from task section 22, plus the
    // synthetic-fixture topic words used throughout this test file --
    // production source must never mention any of them; they may only
    // ever appear in this test file's own fixtures.
    const bannedLiterals = [
      "202",
      "telephone",
      "solenoid",
      "gears",
      "levers",
      "pulleys",
      "statistics",
      "unit202",
      "c&g",
      "city and guilds",
      "2365",
    ];
    for (const source of [rulesSource, typesSource, indexSource]) {
      const lower = source.toLowerCase();
      for (const banned of bannedLiterals) {
        expect(lower.includes(banned.toLowerCase()), `production source must not contain the topic-specific literal "${banned}"`).toBe(false);
      }
    }
  });

  it("this package declares zero dependency on @alp/content-schema or any other workspace package -- structurally decoupled from Unit 202's own governed content", () => {
    const packageJson = JSON.parse(readFileSync(path.resolve(import.meta.dirname, "..", "package.json"), "utf-8")) as { dependencies?: Record<string, string> };
    const deps = Object.keys(packageJson.dependencies ?? {});
    expect(deps.every((d) => !d.startsWith("@alp/"))).toBe(true);
  });

  it("no source file in this package imports from an @alp/* workspace package", () => {
    for (const source of [rulesSource, typesSource, indexSource]) {
      expect(source).not.toMatch(/from\s+["']@alp\//);
    }
  });
});

describe("CC-18 -- generic disposition/confidence/gap plumbing sanity", () => {
  it("generateAssessmentCandidates rejects an item with no valid curriculum mapping", () => {
    const evidence: AssessmentEvidence[] = [
      {
        role: "PUBLIC_ASSESSMENT",
        evidenceId: "unmapped-item",
        assessmentSource: "Sample A",
        itemId: "Q1",
        mappedCurriculumUnitId: "",
        questionStemRef: "x",
        correctAnswerTarget: "x",
        subject: "unmapped-subject",
        performanceType: "STATE",
      },
    ];
    expect(generateAssessmentCandidates(evidence)).toEqual([]);
  });

  it("every candidate carries a non-empty rationale and at least one evidence reference", () => {
    const curriculum: CurriculumEvidence[] = [{ role: "OFFICIAL_CURRICULUM", evidenceId: "e1", curriculumUnitId: "u1", subject: "s1", namedInPrimaryWording: true, isRangeItem: false }];
    const result = buildStandardPipeline({ curriculum, assessment: [] });
    for (const c of result.candidates) {
      expect(c.rationale.length).toBeGreaterThan(0);
      expect(c.evidenceRefs.length).toBeGreaterThan(0);
    }
  });

  it("every gap record names a legitimate resolver role from the governed evidence-role enum", () => {
    const curriculum: CurriculumEvidence[] = [{ role: "OFFICIAL_CURRICULUM", evidenceId: "e1", curriculumUnitId: "u1", subject: "s1", namedInPrimaryWording: true, isRangeItem: false }];
    const result = buildStandardPipeline({ curriculum, assessment: [] });
    const validRoles = ["OFFICIAL_CURRICULUM", "PUBLIC_ASSESSMENT", "QUALIFICATION_LEVEL", "TECHNICAL_TRUTH", "OPTIONAL_CALIBRATION", "LEGACY_DIAGNOSTIC", "MODEL_KNOWLEDGE"];
    for (const g of result.gaps) {
      expect(validRoles).toContain(g.legitimateResolverRole);
    }
  });
});
