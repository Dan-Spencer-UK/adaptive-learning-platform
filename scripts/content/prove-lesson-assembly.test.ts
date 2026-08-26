import { describe, expect, it } from "vitest";
import { buildReport, isReportClean, REAL_CONTENT_GAPS } from "./prove-lesson-assembly.ts";

describe("Lesson assembly engine proving report (real Ohm's Law content + synthetic mechanism proofs)", () => {
  const report = buildReport();

  it("covers all 7 representative scenarios from task brief §19", () => {
    expect(report.scenarios.map((s) => s.scenarioId)).toEqual(["A", "B", "C", "D", "E", "F", "G", "H"]);
  });

  it("every scenario passes", () => {
    for (const scenario of report.scenarios) {
      expect(scenario.passed, `scenario ${scenario.scenarioId} (${scenario.label}): ${scenario.detail}`).toBe(true);
    }
  });

  it("the full report is clean", () => {
    expect(isReportClean(report)).toBe(true);
  });

  it("scenarios A, C, D, E, G are attributed to real governed content; B and F are honestly labelled synthetic", () => {
    const byId = new Map(report.scenarios.map((s) => [s.scenarioId, s]));
    for (const realId of ["A", "C", "D", "E", "G"]) {
      expect(byId.get(realId)?.contentSource).toBe("real");
    }
    for (const syntheticId of ["B", "F"]) {
      expect(byId.get(syntheticId)?.contentSource).toBe("synthetic");
    }
  });

  it("declares the real-content gaps explicitly rather than silently relying on synthetic fixtures", () => {
    expect(REAL_CONTENT_GAPS.length).toBeGreaterThan(0);
    expect(report.realContentGaps).toEqual(REAL_CONTENT_GAPS);
  });
});
