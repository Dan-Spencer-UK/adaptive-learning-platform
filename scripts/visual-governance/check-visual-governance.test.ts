import { describe, expect, it } from "vitest";
import { buildReport, formatReport, isReportClean, RENDERED_DIAGRAM_BLUEPRINT_IDS } from "./check-visual-governance.ts";

describe("check-visual-governance against the live CC-05A corpus + CC-05D contracts", () => {
  const report = buildReport();

  it("produces a clean report -- every mandatory gate is zero", () => {
    expect(isReportClean(report)).toBe(true);
  });

  it("finds exactly 7 real governed diagram blueprints", () => {
    expect(report.totalRealDiagramBlueprints).toBe(7);
  });

  it("has exactly one contract per rendered (governed pilot) diagram blueprint", () => {
    expect(report.totalContracts).toBe(RENDERED_DIAGRAM_BLUEPRINT_IDS.size);
    expect(report.governedPilotBlueprintsMissingContract).toEqual([]);
  });

  it("CC-11: every governed diagram blueprint now has a renderer -- zero renderer-missing blueprints remain", () => {
    expect(report.ungovernedNonPilotBlueprints).toEqual([]);
  });

  it("has zero dangling references of any kind", () => {
    expect(report.orphanContracts).toEqual([]);
    expect(report.danglingAssertionFamilyRefs).toEqual([]);
    expect(report.danglingCapabilityRefs).toEqual([]);
    expect(report.danglingQuestionBlueprintRefs).toEqual([]);
  });

  it("has zero answer-leakage failures across every canonical variant", () => {
    expect(report.answerLeakageFailures).toEqual([]);
  });

  it("produces 31 canonical variants: 3 series + 3 parallel + 4 grip-rule + 8 motor-force + 2 series-parallel-mixed + 6 waveform + 5 instrument-connection", () => {
    expect(report.totalCanonicalVariants).toBe(31);
  });

  it("has zero rendered-artefact geometry failures (checks 0 when renders don't exist yet, or all real arrows when they do)", () => {
    expect(report.artifactGeometryFailures).toEqual([]);
  });

  it("formats to a human-readable report string containing the PASS/FAIL verdict inputs", () => {
    const text = formatReport(report);
    expect(text).toContain("CC-05D instructional-visual governance mechanical report");
    expect(text).toContain("Real governed diagram blueprints (CC-05A corpus): 7");
  });
});

describe("check-visual-governance detects real defect classes when introduced synthetically", () => {
  it("isReportClean is false when a governed-pilot blueprint has no contract", () => {
    const dirty = {
      totalRealDiagramBlueprints: 7,
      totalContracts: 3,
      duplicateContractIds: [],
      orphanContracts: [],
      danglingAssertionFamilyRefs: [],
      danglingCapabilityRefs: [],
      danglingQuestionBlueprintRefs: [],
      rendererCoverage: [],
      governedPilotBlueprintsMissingContract: ["circuit.series_resistors"],
      ungovernedNonPilotBlueprints: [],
      incompleteVariantCoverage: [],
      answerLeakageFailures: [],
      totalCanonicalVariants: 0,
      artifactGeometryChecked: 0,
      artifactGeometryFailures: [],
    };
    expect(isReportClean(dirty)).toBe(false);
  });

  it("isReportClean is false when an assessment-mode variant leaks a revealed answer prop", () => {
    const dirty = {
      totalRealDiagramBlueprints: 7,
      totalContracts: 4,
      duplicateContractIds: [],
      orphanContracts: [],
      danglingAssertionFamilyRefs: [],
      danglingCapabilityRefs: [],
      danglingQuestionBlueprintRefs: [],
      rendererCoverage: [],
      governedPilotBlueprintsMissingContract: [],
      ungovernedNonPilotBlueprints: [],
      incompleteVariantCoverage: [],
      answerLeakageFailures: ["visual-contract.right-hand-grip-rule/x: assessment-mode variant carries non-empty revealProps for 'field_rotation_arrow_and_label'"],
      totalCanonicalVariants: 18,
      artifactGeometryChecked: 0,
      artifactGeometryFailures: [],
    };
    expect(isReportClean(dirty)).toBe(false);
  });
});
