import { describe, expect, it } from "vitest";
import { buildDimensionCoverageReport, isDimensionCoverageClean } from "./report-cc05b-dimension-coverage.ts";

describe("CC-05B2 variant-dimension coverage (full governed Unit 202 manifest)", () => {
  const results = buildDimensionCoverageReport();

  it("finds every governed blueprint with a declared variantDimensions entry (currently 11 blueprints, 13 entries -- CC-09E adds magnetism.identify_flux_density_unit and emf.calculate_flux_change)", () => {
    const blueprintIds = new Set(results.map((r) => r.blueprintId));
    expect(blueprintIds.size).toBe(11);
    expect(results.length).toBe(13);
  });

  it("exercises every permitted value of every non-marker dimension at least once", () => {
    expect(isDimensionCoverageClean(results)).toBe(true);
    for (const r of results) {
      if (r.isGeneratorSelectionMarker) continue;
      expect(r.uncoveredValues, `${r.blueprintId}::${r.dimensionName}`).toEqual([]);
    }
  });

  it("specifically covers all three component_count/branch_count values for series and parallel", () => {
    const seriesTotal = results.find((r) => r.blueprintId === "series.calculate_total_resistance");
    const parallelTotal = results.find((r) => r.blueprintId === "parallel.calculate_total");
    expect(seriesTotal?.exercisedValues.slice().sort()).toEqual([2, 3, 4]);
    expect(parallelTotal?.exercisedValues.slice().sort()).toEqual([2, 3, 4]);
  });

  it("specifically covers both target_variable values for the three new formula-family variant blueprints", () => {
    const charge = results.find((r) => r.blueprintId === "charge.calculate");
    const rmsPeak = results.find((r) => r.blueprintId === "waveform.calculate_rms_from_peak");
    const freqPeriod = results.find((r) => r.blueprintId === "waveform.calculate_frequency_from_period");
    expect(charge?.exercisedValues.slice().sort()).toEqual(["I", "Q"]);
    expect(rmsPeak?.exercisedValues.slice().sort()).toEqual(["peak", "rms"]);
    expect(freqPeriod?.exercisedValues.slice().sort()).toEqual(["T", "f"]);
  });
});
