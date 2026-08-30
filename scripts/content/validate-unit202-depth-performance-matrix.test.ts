import { describe, expect, it } from "vitest";

import { depthPerformanceMatrixSchema } from "@alp/content-schema";

import { unit202DepthPerformanceMatrix } from "./data/unit202-depth-performance-matrix.ts";
import {
  buildReport,
  EXPECTED_AC_COUNT,
  EXPECTED_RANGE_ITEM_COUNT,
  EXPECTED_REVIEW_FLAG_SUBSTRINGS,
  isReportClean,
} from "./validate-unit202-depth-performance-matrix.ts";

// CC-14: proves the REAL, Project-Architect-approved Unit 202 Depth &
// Performance Matrix instance is loadable, valid and complete through the
// same production path a future source-acquisition/reporting tool would
// use -- never merely that the schema is *capable* of representing such a
// matrix. Distinguishes:
//  - schema-capable (a well-formed object satisfies depthPerformanceMatrixSchema)
//  - real-corpus-adopted (the actual unit202DepthPerformanceMatrix instance parses and is semantically clean)
//  - production/runtime-loadable (buildReport()/isReportClean() are the exact functions the npm script CLI calls)
describe("CC-14 Unit 202 Depth & Performance Matrix -- real-instance validation", () => {
  it("REAL-CORPUS-ADOPTED: the real matrix instance parses against depthPerformanceMatrixSchema without modification", () => {
    expect(() => depthPerformanceMatrixSchema.parse(unit202DepthPerformanceMatrix)).not.toThrow();
  });

  it("REAL-CORPUS-ADOPTED: the real matrix has exactly the official 23 Assessment Criteria and 58 Range items", () => {
    const report = buildReport();
    expect(report.acCount).toBe(23);
    expect(report.acCount).toBe(EXPECTED_AC_COUNT);
    expect(report.rangeItemCount).toBe(58);
    expect(report.rangeItemCount).toBe(EXPECTED_RANGE_ITEM_COUNT);
  });

  it("PRODUCTION-LOADABLE: the real matrix report is entirely clean (the same isReportClean gate the CLI --check flag uses)", () => {
    const report = buildReport();
    expect(isReportClean(report)).toBe(true);
  });

  it("no duplicate AC numbers exist in the real instance", () => {
    const report = buildReport();
    expect(report.duplicateAcNumbers).toEqual([]);
  });

  it("no duplicate Range items exist in the real instance", () => {
    const report = buildReport();
    expect(report.duplicateRangeItems).toEqual([]);
  });

  it("every AC has non-empty required learner-performance, depth-dimension, supporting-knowledge, visual, calculation, calibration and scope-ceiling fields", () => {
    const report = buildReport();
    expect(report.acsMissingRequiredField).toEqual([]);
  });

  it("every AC carries a confidence value and a matrix status (mechanically counted, not assumed)", () => {
    const report = buildReport();
    const totalConfidence = Object.values(report.confidenceCounts).reduce((a, b) => a + b, 0);
    const totalStatus = Object.values(report.matrixStatusCounts).reduce((a, b) => a + b, 0);
    expect(totalConfidence).toBe(23);
    expect(totalStatus).toBe(23);
  });

  it("the confidence distribution matches the approved matrix exactly: 22 HIGH, 1 MEDIUM_HIGH (AC6.1)", () => {
    const report = buildReport();
    expect(report.confidenceCounts).toEqual({ HIGH: 22, MEDIUM_HIGH: 1 });
  });

  it("every one of the approved matrix's explicit review/correction/ambiguity flags survived encoding, verbatim", () => {
    const report = buildReport();
    expect(report.missingExpectedReviewFlagSubstrings).toEqual([]);
    // Sanity: the expectation list itself must be non-trivial, so this test
    // cannot pass merely because the list is empty.
    expect(EXPECTED_REVIEW_FLAG_SUBSTRINGS.length).toBeGreaterThanOrEqual(18);
  });

  it("18 ACs carry an explicit AC-level review flag; 5 (the highest-confidence LOCKED entries) do not", () => {
    const report = buildReport();
    expect(report.acReviewFlagCount).toBe(18);
  });

  it("8 official Range-item rows carry their own explicit review flag (temperature, resistivity, impedance, inductance, capacitance, power factor, telephones, photo)", () => {
    const report = buildReport();
    expect(report.rangeItemReviewFlagCount).toBe(8);
  });

  it("the matrix's assessment envelope is derived from, and stays identical to, the already-governed unit202AssessmentSpecification (no duplicated source of truth)", () => {
    const report = buildReport();
    expect(report.assessmentEnvelopeMismatchesSpecification).toEqual([]);
    expect(unit202DepthPerformanceMatrix.assessmentEnvelope).toEqual([
      { loNumber: 1, approxQuestionCount: 2, weightPercent: 5 },
      { loNumber: 2, approxQuestionCount: 5, weightPercent: 13 },
      { loNumber: 3, approxQuestionCount: 7, weightPercent: 18 },
      { loNumber: 4, approxQuestionCount: 15, weightPercent: 37 },
      { loNumber: 5, approxQuestionCount: 7, weightPercent: 17 },
      { loNumber: 6, approxQuestionCount: 4, weightPercent: 10 },
    ]);
  });

  it("the matrix authorship records Claude Code did not author any substantive judgment, and Product Owner approval", () => {
    expect(unit202DepthPerformanceMatrix.authorship.substantiveAuthor).toBe("Project Architect / ChatGPT");
    expect(unit202DepthPerformanceMatrix.authorship.approvalStatus).toBe("APPROVED");
    expect(unit202DepthPerformanceMatrix.authorship.approvedBy).toBe("Product Owner");
    // The source document's own header, as originally authored, is preserved
    // verbatim -- never silently rewritten by the later approval event.
    expect(unit202DepthPerformanceMatrix.authorship.documentHeaderStatusAsAuthored).toBe("PROPOSED FOR PRODUCT OWNER APPROVAL");
  });

  it("this validator module does not import the existing assertion/capability/obligation corpus (the existing corpus is never fallback authority for the matrix)", async () => {
    const { readFileSync } = await import("node:fs");
    const { dirname, join } = await import("node:path");
    const { fileURLToPath } = await import("node:url");
    const here = dirname(fileURLToPath(import.meta.url));
    // Strip block/line comments first: the validator's own doc comment
    // legitimately NAMES these modules to explain why it stays independent
    // of them -- only an actual import/require of one would be a defect.
    const stripComments = (src: string) => src.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "");
    const matrixSource = stripComments(readFileSync(join(here, "data", "unit202-depth-performance-matrix.ts"), "utf8"));
    const validatorSource = stripComments(readFileSync(join(here, "validate-unit202-depth-performance-matrix.ts"), "utf8"));
    for (const forbidden of ["cc04-unit202-electrical-science", "unit202-knowledge-obligations", "cc05a-pedagogy-unit202"]) {
      expect(matrixSource).not.toContain(forbidden);
      expect(validatorSource).not.toContain(forbidden);
    }
  });
});

// SCHEMA-CAPABLE tamper-and-assert regressions: prove the validator
// actually catches each defect class on a deliberately corrupted CLONE of
// the real data, never merely that it passes on already-good data (the
// dominant idiom in scripts/content/report-coverage-matrix.test.ts).
describe("CC-14 Unit 202 Depth & Performance Matrix -- tamper-and-assert regressions", () => {
  it("SCHEMA-CAPABLE: a Range item referencing a non-existent acNumber is rejected at the schema layer", () => {
    const tampered = {
      ...unit202DepthPerformanceMatrix,
      officialRangeCoverage: [
        ...unit202DepthPerformanceMatrix.officialRangeCoverage,
        { loNumber: 9, acNumber: "9.9", rangeCategory: "Nonexistent", rangeItem: "Nonexistent item", depthTreatment: "n/a" },
      ],
    };
    expect(() => depthPerformanceMatrixSchema.parse(tampered)).toThrow();
    expect(() => buildReport({ matrix: tampered })).toThrow();
  });

  it("SCHEMA-CAPABLE: an AC missing requiredLearnerPerformance is rejected at the schema layer", () => {
    const tampered = {
      ...unit202DepthPerformanceMatrix,
      assessmentCriteria: unit202DepthPerformanceMatrix.assessmentCriteria.map((ac, i) => (i === 0 ? { ...ac, requiredLearnerPerformance: "" } : ac)),
    };
    expect(() => depthPerformanceMatrixSchema.parse(tampered)).toThrow();
  });

  it("SCHEMA-CAPABLE: an AC with an empty requiredDepthDimensions array is rejected at the schema layer", () => {
    const tampered = {
      ...unit202DepthPerformanceMatrix,
      assessmentCriteria: unit202DepthPerformanceMatrix.assessmentCriteria.map((ac, i) => (i === 0 ? { ...ac, requiredDepthDimensions: [] } : ac)),
    };
    expect(() => depthPerformanceMatrixSchema.parse(tampered)).toThrow();
  });

  it("a duplicated AC number is caught by the report's own duplicate check (not silently accepted as 23 distinct ACs)", () => {
    const tampered = {
      ...unit202DepthPerformanceMatrix,
      assessmentCriteria: [...unit202DepthPerformanceMatrix.assessmentCriteria, { ...unit202DepthPerformanceMatrix.assessmentCriteria[0]! }],
    };
    const report = buildReport({ matrix: tampered });
    expect(report.duplicateAcNumbers).toEqual(["1.1"]);
    expect(report.acCount).toBe(24);
    expect(report.acCountMismatch).toBe(true);
    expect(isReportClean(report)).toBe(false);
  });

  it("a duplicated Range item (same acNumber + rangeItem twice) is caught by the report's own duplicate check", () => {
    const tampered = {
      ...unit202DepthPerformanceMatrix,
      officialRangeCoverage: [...unit202DepthPerformanceMatrix.officialRangeCoverage, { ...unit202DepthPerformanceMatrix.officialRangeCoverage[0]! }],
    };
    const report = buildReport({ matrix: tampered });
    expect(report.duplicateRangeItems.length).toBe(1);
    expect(report.rangeItemCountMismatch).toBe(true);
    expect(isReportClean(report)).toBe(false);
  });

  it("removing an AC's review flag is caught as a missing expected review-flag substring (a review flag can never be silently dropped)", () => {
    const acIndex = unit202DepthPerformanceMatrix.assessmentCriteria.findIndex((ac) => ac.acNumber === "2.1");
    const tampered = {
      ...unit202DepthPerformanceMatrix,
      assessmentCriteria: unit202DepthPerformanceMatrix.assessmentCriteria.map((ac, i) => (i === acIndex ? { ...ac, reviewFlag: undefined } : ac)),
    };
    const report = buildReport({ matrix: tampered });
    expect(report.missingExpectedReviewFlagSubstrings.length).toBeGreaterThan(0);
    expect(isReportClean(report)).toBe(false);
  });

  it("an assessment envelope that drifts from unit202AssessmentSpecification is caught, never silently accepted", () => {
    const tampered = {
      ...unit202DepthPerformanceMatrix,
      assessmentEnvelope: unit202DepthPerformanceMatrix.assessmentEnvelope.map((row, i) => (i === 0 ? { ...row, approxQuestionCount: 999 } : row)),
    };
    const report = buildReport({ matrix: tampered });
    expect(report.assessmentEnvelopeMismatchesSpecification.length).toBeGreaterThan(0);
    expect(isReportClean(report)).toBe(false);
  });

  it("a wrong AC count (e.g. 22 instead of 23) is caught even if every present AC is individually well-formed", () => {
    const tampered = {
      ...unit202DepthPerformanceMatrix,
      assessmentCriteria: unit202DepthPerformanceMatrix.assessmentCriteria.slice(1),
      // Drop the matching Range rows too, so this test isolates the AC-count gate rather than tripping the unknown-AC referential gate.
      officialRangeCoverage: unit202DepthPerformanceMatrix.officialRangeCoverage.filter((r) => r.acNumber !== unit202DepthPerformanceMatrix.assessmentCriteria[0]!.acNumber),
    };
    const report = buildReport({ matrix: tampered });
    expect(report.acCount).toBe(22);
    expect(report.acCountMismatch).toBe(true);
    expect(isReportClean(report)).toBe(false);
  });
});
