import { describe, expect, it } from "vitest";
import { buildProvingReport, isProvingReportClean } from "./prove-cc05b-engine.ts";

describe("CC-05B engine proving report (full governed Unit 202 question-blueprint inventory)", () => {
  const report = buildProvingReport();

  it("mechanically derives the total governed blueprint count from the live manifest (currently 114 -- CC-08 adds 2 for foundational.algebraic_technique; CC-09E adds 5 for electrical.ac_reactive_quantities/magnetism/emf_and_generation archetypes; CC-09E.1 adds 1 for magnetism.identify_flux_unit, split out of magnetism.identify_flux_density_unit; CC-11 adds 11 for foundational.mass_weight/levers_mechanical_advantage/mechanics_work_energy_power and 6 for electrical.electronic_components; CC-11.1 adds 3 for magnetism.recognise_attraction_repulsion/magnetism.calculate_force_on_conductor/emf.calculate_motional_emf; CC-11.2 adds 1 for conductors.recognise_electron_theory; CC-12 adds 1 for magnetism.diagnose_current_convention)", () => {
    expect(report.totalGovernedBlueprints).toBe(114);
  });

  it("every governed blueprint is supported by the engine registry", () => {
    expect(report.supportedCount).toBe(report.totalGovernedBlueprints);
    expect(report.unsupportedBlueprints).toEqual([]);
  });

  it("has zero generation failures", () => {
    expect(report.generationFailures).toEqual([]);
  });

  it("has zero correct-answer grading failures", () => {
    expect(report.correctAnswerGradingFailures).toEqual([]);
  });

  it("has zero incorrect-answer grading failures", () => {
    expect(report.incorrectAnswerGradingFailures).toEqual([]);
  });

  it("has zero serialisation failures", () => {
    expect(report.serialisationFailures).toEqual([]);
  });

  it("has zero determinism failures", () => {
    expect(report.determinismFailures).toEqual([]);
  });

  it("has zero representation-contract failures", () => {
    expect(report.representationContractFailures).toEqual([]);
  });

  it("has zero evidence-contract failures", () => {
    expect(report.evidenceContractFailures).toEqual([]);
  });

  it("the full report is clean", () => {
    expect(isProvingReportClean(report)).toBe(true);
  });

  it("every individual result passes every check", () => {
    for (const result of report.results) {
      expect(result.supported, `${result.blueprintId} should be supported`).toBe(true);
      expect(result.generated, `${result.blueprintId} should generate without throwing`).toBe(true);
      expect(result.serialisable, `${result.blueprintId} instance should survive JSON round-trip`).toBe(true);
      expect(result.correctAnswerGradesCorrect, `${result.blueprintId} correct answer should grade correct`).toBe(true);
      expect(result.wrongAnswerGradesIncorrect, `${result.blueprintId} wrong answer should grade incorrect`).toBe(true);
      expect(result.deterministicAcrossRepeat, `${result.blueprintId} should reproduce identically for the same identity`).toBe(true);
      expect(result.representationContractOk, `${result.blueprintId} should satisfy its declared representation contract`).toBe(true);
      expect(result.evidenceContractOk, `${result.blueprintId} should emit evidence matching its governed family/capability/assertions`).toBe(true);
    }
  });
});

describe("CC-05B engine proving report -- stability across many seeds (all 86 governed blueprints)", () => {
  // The original CC-05B proving pattern used 25 seeds; kept here at 30 (not
  // reduced) to catch any seed-dependent parameter-generation edge case
  // across the FULL now-86-blueprint inventory (CC-08 adds 2), not just the
  // original 36.
  const SEEDS_TO_TRY = Array.from({ length: 30 }, (_, i) => 1000 + i * 37);

  it.each(SEEDS_TO_TRY)("seed %d: every governed blueprint generates and grades correctly with no unsupported/failed blueprints", (seed) => {
    const report = buildProvingReport(seed, "2026.08.001-stability");
    expect(isProvingReportClean(report)).toBe(true);
  });
});
