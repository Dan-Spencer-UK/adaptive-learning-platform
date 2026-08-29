import { describe, expect, it } from "vitest";
import { buildWorkedExamplesProvingReport, isWorkedExamplesProvingReportClean } from "./prove-worked-examples.ts";

describe("CC-12H worked-example proving report (full governed corpus)", () => {
  const report = buildWorkedExamplesProvingReport();

  it("mechanically derives the total governed worked-example count from the live manifest", () => {
    expect(report.totalWorkedExamples).toBeGreaterThan(0);
  });

  it("has zero build failures", () => {
    expect(report.buildFailures).toEqual([]);
  });

  it("the full report is clean", () => {
    expect(isWorkedExamplesProvingReportClean(report)).toBe(true);
  });

  it("every individual worked example builds", () => {
    for (const result of report.results) {
      expect(result.built, `${result.workedExampleId}: ${result.error ?? ""}`).toBe(true);
    }
  });
});
