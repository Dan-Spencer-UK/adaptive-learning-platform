import { describe, expect, it } from "vitest";
import { buildReport, formatReport, isReportClean, type VisualCompletenessReport } from "./check-visual-completeness.ts";

describe("check-visual-completeness against the live corpus", () => {
  const report = buildReport();

  it("produces a clean report -- every mandatory gate is zero", () => {
    expect(isReportClean(report)).toBe(true);
  });

  it("checks all 24 current (release.unit202.v7) lessons, not any frozen historical snapshot", () => {
    expect(report.totalCurrentLessons).toBe(24);
  });

  it("finds at least the 49 REQUIRED-visual declarations known to exist across the live corpus", () => {
    expect(report.totalRequiredVisualDeclarations).toBeGreaterThanOrEqual(49);
  });

  it("has zero required-visual completeness failures of any kind", () => {
    expect(report.requiredVisualsWithNoAsset).toEqual([]);
    expect(report.requiredVisualsWithNoRenderer).toEqual([]);
    expect(report.requiredVisualsWithNoContract).toEqual([]);
    expect(report.requiredSymbolVisualsWithUnapprovedConvention).toEqual([]);
  });

  it("the lessons wired with a CC-11.3 visual are no longer reported as diagram-free (proves this check reads the CURRENT lesson content, not a frozen historical snapshot with the same id)", () => {
    const wiredThisSession = [
      "lesson.foundation.physics.simple-machines",
      "lesson.electrical.resistivity",
      "lesson.magnetism.fundamentals",
      "lesson.electrical.electronic-components-passive",
      "lesson.electrical.electronic-components-switching-control",
    ];
    for (const id of wiredThisSession) {
      expect(report.lessonsWithNoDiagramReference).not.toContain(id);
    }
  });

  it("formats to a human-readable report string containing the PASS verdict inputs", () => {
    const text = formatReport(report);
    expect(text).toContain("CC-11.3 whole-course visual-completeness mechanical report");
    expect(text).toContain("Current (live) lessons checked: 24");
  });
});

describe("check-visual-completeness detects real defect classes when introduced synthetically", () => {
  function cleanReport(): VisualCompletenessReport {
    return {
      totalCurrentLessons: 1,
      totalRequiredVisualDeclarations: 1,
      requiredVisualsWithNoAsset: [],
      requiredVisualsWithNoRenderer: [],
      requiredVisualsWithNoContract: [],
      requiredSymbolVisualsWithUnapprovedConvention: [],
      lessonsWithNoDiagramReference: [],
    };
  }

  it("isReportClean is false when a REQUIRED visual references a non-existent DiagramBlueprint", () => {
    const dirty = {
      ...cleanReport(),
      requiredVisualsWithNoAsset: [{ lessonId: "lesson.x", stepId: "step.y", diagramBlueprintId: "ghost.blueprint" }],
    };
    expect(isReportClean(dirty)).toBe(false);
  });

  it("isReportClean is false when a REQUIRED visual has no renderer", () => {
    const dirty = {
      ...cleanReport(),
      requiredVisualsWithNoRenderer: [{ lessonId: "lesson.x", stepId: "step.y", diagramBlueprintId: "unrendered.blueprint" }],
    };
    expect(isReportClean(dirty)).toBe(false);
  });

  it("isReportClean is false when a REQUIRED visual has no semantic contract", () => {
    const dirty = {
      ...cleanReport(),
      requiredVisualsWithNoContract: [{ lessonId: "lesson.x", stepId: "step.y", diagramBlueprintId: "uncontracted.blueprint" }],
    };
    expect(isReportClean(dirty)).toBe(false);
  });

  it("isReportClean is false when a REQUIRED symbol-card visual has no approved UK/IEC convention", () => {
    const dirty = {
      ...cleanReport(),
      requiredSymbolVisualsWithUnapprovedConvention: [{ lessonId: "lesson.x", stepId: "step.y", diagramBlueprintId: "electronics.component_symbol_card" }],
    };
    expect(isReportClean(dirty)).toBe(false);
  });

  it("a lesson with zero diagram references is informational only, not a failure", () => {
    const dirty = { ...cleanReport(), lessonsWithNoDiagramReference: ["lesson.some-topic-that-needs-no-visual"] };
    expect(isReportClean(dirty)).toBe(true);
  });
});
