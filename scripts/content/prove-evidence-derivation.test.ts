import { describe, expect, it } from "vitest";
import { buildReport, isReportClean, REAL_CONTENT_GAPS } from "./prove-evidence-derivation.ts";

describe("Evidence derivation proving report (real Ohm's Law content, CC-07 §32/§33)", () => {
  const report = buildReport();

  it("covers the required representative scenarios including the dedicated misconception-safety proof", () => {
    expect(report.scenarios.map((s) => s.scenarioId)).toEqual([
      "NEW",
      "ONE",
      "REPEAT",
      "RETRY",
      "MIS-A",
      "MIS-B",
      "MIS-C",
      "TRANSFER",
      "CONVERGE",
      "PERF",
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

  it("real scenarios are attributed to real governed content; only PERF's fabricated volume is labelled synthetic", () => {
    for (const scenario of report.scenarios) {
      expect(scenario.contentSource).toBe(scenario.scenarioId === "PERF" ? "synthetic" : "real");
    }
  });

  it("declares real-content gaps explicitly (no claimed cross-lesson remediation evidence)", () => {
    expect(REAL_CONTENT_GAPS.length).toBeGreaterThan(0);
    expect(report.realContentGaps).toEqual(REAL_CONTENT_GAPS);
  });
});
