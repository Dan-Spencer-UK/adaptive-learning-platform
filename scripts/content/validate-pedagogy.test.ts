import { describe, expect, it } from "vitest";
import { buildReport, formatReport, isReportClean, type CoverageReport } from "./validate-pedagogy.ts";

function cleanReport(): CoverageReport {
  return {
    totalAssertionFamilies: 1,
    totalMemberships: 1,
    assertionsWithFamily: 1,
    standaloneAssertions: 0,
    totalCorpusAssertions: 1,
    unclassifiedLearnerAssertions: [],
    formulaFamilies: 1,
    formulaFamiliesMissingRequiredForms: [],
    familiesRequiringDiagrams: 0,
    diagramBlueprints: 0,
    unresolvedRequiredDiagramReferences: [],
    learnerAssessableFamilies: 1,
    teachingOnlyFamilies: 0,
    questionBlueprints: 1,
    assessableFamiliesWithZeroQuestionBlueprints: [],
    requiredCapabilitiesWithoutCoverage: [],
  };
}

describe("isReportClean", () => {
  it("returns true when every gate metric is zero", () => {
    expect(isReportClean(cleanReport())).toBe(true);
  });

  it("returns false when there are unclassified learner assertions", () => {
    expect(isReportClean({ ...cleanReport(), unclassifiedLearnerAssertions: ["EL-FOO-001"] })).toBe(false);
  });

  it("returns false when a formula family is missing required forms", () => {
    expect(
      isReportClean({ ...cleanReport(), formulaFamiliesMissingRequiredForms: ["formula.foo missing forms for: X"] }),
    ).toBe(false);
  });

  it("returns false when there is an unresolved required diagram reference", () => {
    expect(
      isReportClean({ ...cleanReport(), unresolvedRequiredDiagramReferences: ["question blueprint foo.bar"] }),
    ).toBe(false);
  });

  it("returns false when an assessable family has zero question blueprints", () => {
    expect(
      isReportClean({ ...cleanReport(), assessableFamiliesWithZeroQuestionBlueprints: ["family.foo"] }),
    ).toBe(false);
  });

  it("returns false when a required capability has no assessment coverage", () => {
    expect(
      isReportClean({ ...cleanReport(), requiredCapabilitiesWithoutCoverage: ["family.foo: cap.foo.bar"] }),
    ).toBe(false);
  });
});

describe("buildReport (against the real CC-05A pedagogy manifest and CC-04 corpus)", () => {
  const report = buildReport();

  it("classifies every corpus assertion (family membership or explicit standalone)", () => {
    expect(report.unclassifiedLearnerAssertions).toEqual([]);
    expect(report.assertionsWithFamily + report.standaloneAssertions).toBe(report.totalCorpusAssertions);
  });

  it("gives every formula family a form for each of its required teaching targets", () => {
    expect(report.formulaFamiliesMissingRequiredForms).toEqual([]);
  });

  it("resolves every required diagram reference to a real diagram blueprint", () => {
    expect(report.unresolvedRequiredDiagramReferences).toEqual([]);
  });

  it("gives every assessable family at least one question blueprint", () => {
    expect(report.assessableFamiliesWithZeroQuestionBlueprints).toEqual([]);
  });

  it("gives every required family capability an assessment path", () => {
    expect(report.requiredCapabilitiesWithoutCoverage).toEqual([]);
  });

  it("the full report is clean", () => {
    expect(isReportClean(report)).toBe(true);
  });

  it("has a non-trivial, genuinely exhaustive-scale inventory (not a token/placeholder backfill)", () => {
    expect(report.totalAssertionFamilies).toBeGreaterThanOrEqual(20);
    expect(report.totalCorpusAssertions).toBe(176);
    expect(report.formulaFamilies).toBeGreaterThanOrEqual(5);
    expect(report.diagramBlueprints).toBeGreaterThanOrEqual(5);
    expect(report.questionBlueprints).toBeGreaterThanOrEqual(50);
  });
});

describe("formatReport", () => {
  it("renders every metric label so a human reviewer can read the report without the source", () => {
    const text = formatReport(cleanReport());
    expect(text).toContain("Total assertion families");
    expect(text).toContain("UNCLASSIFIED");
    expect(text).toContain("missing required forms");
    expect(text).toContain("unresolved required diagram references");
    expect(text).toContain("assessable families with zero blueprints");
    expect(text).toContain("required capabilities without assessment coverage");
  });
});
