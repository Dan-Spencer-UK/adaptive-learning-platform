import { describe, expect, it } from "vitest";
import { buildReport, isReportClean, REAL_CONTENT_GAPS } from "./prove-course-orchestration.ts";

describe("Course orchestration proving report (real cross-lesson adaptive vertical, CC-08 §31)", () => {
  const report = buildReport();

  it("covers every required representative scenario", () => {
    expect(report.scenarios.map((s) => s.scenarioId)).toEqual([
      "NEW",
      "VOCATIONAL",
      "WEAK-FOUNDATION",
      "REMEDIATE",
      "RETEST-FOUNDATION",
      "RETURN",
      "TRANSFER",
      "ADVANCE",
      "SHARED-PREREQUISITE",
      "MISCONCEPTION-SAFE",
      "CONVERGE",
      "COMPLETE-SLICE",
    ]);
  });

  it("every scenario passes", () => {
    for (const scenario of report.scenarios) {
      expect(scenario.passed, `scenario ${scenario.scenarioId} (${scenario.label}): ${scenario.detail}`).toBe(true);
    }
  });

  it("the full report is clean", () => {
    expect(isReportClean(report)).toBe(true);
  });

  it("every scenario is attributed to real governed content -- acceptance of the cross-lesson vertical depends on real content, not synthetic fixtures", () => {
    for (const scenario of report.scenarios) {
      expect(scenario.contentSource).toBe("real");
    }
  });

  it("declares real-content gaps explicitly", () => {
    expect(REAL_CONTENT_GAPS.length).toBeGreaterThan(0);
    expect(report.realContentGaps).toEqual(REAL_CONTENT_GAPS);
  });
});
