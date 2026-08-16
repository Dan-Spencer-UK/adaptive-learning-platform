/**
 * CC-05C: mechanically proves that
 * apps/mobile/src/lib/proving-content/unit202-proving-fixture.ts (the
 * native proving-slice's governed-content mirror -- see that file's header
 * comment for why apps/mobile cannot import scripts/content/data directly)
 * has not drifted from the real governed CC-05A corpus. This is
 * content-authoring tooling (scripts/content), which is allowed to import
 * both the real corpus and the mobile fixture to cross-check them; the
 * dependency direction this guards is the other one -- apps/mobile must
 * never import scripts/content/data (see scripts/content/README.md).
 *
 * Every id mirrored in the fixture is looked up in the real corpus exports
 * and asserted deeply equal. If CC-05A content is later edited, this test
 * fails until the mobile fixture is updated to match -- it cannot pass by
 * silently diverging.
 */
import { describe, expect, it } from "vitest";
import {
  diagramBlueprints,
  formulaFamilies,
  questionBlueprints,
  visualAidBlueprints,
  workedExampleBlueprints,
} from "./data/cc05a-pedagogy-unit202.ts";
import {
  DIAGRAM_MAGNETIC_FIELD_CONDUCTOR_DIRECTION,
  DIAGRAM_MOTOR_FORCE_FIELD_CURRENT,
  DIAGRAM_PARALLEL_RESISTORS,
  DIAGRAM_SERIES_RESISTORS,
  FORMULA_OHMS_LAW,
  FORMULA_PARALLEL_RESISTANCE,
  FORMULA_SERIES_RESISTANCE,
  MNEMONIC_VIR_TRIANGLE,
  QB_MAGNETISM_INTERPRET_FIELD_DIRECTION,
  QB_MAGNETISM_INTERPRET_FORCE_DIRECTION,
  QB_OHMS_LAW_SOLVE_FOR_CURRENT,
  QB_OHMS_LAW_SOLVE_FOR_RESISTANCE,
  QB_OHMS_LAW_SOLVE_FOR_VOLTAGE,
  QB_PARALLEL_CALCULATE_TOTAL,
  QB_PARALLEL_SOLVE_MISSING_BRANCH,
  QB_SERIES_CALCULATE_TOTAL_RESISTANCE,
  QB_SERIES_SOLVE_MISSING_COMPONENT,
  WORKED_OHMS_LAW_SOLVE_CURRENT,
  WORKED_OHMS_LAW_SOLVE_RESISTANCE,
  WORKED_OHMS_LAW_SOLVE_VOLTAGE,
  WORKED_PARALLEL_CALCULATE_TOTAL,
  WORKED_SERIES_CALCULATE_TOTAL,
} from "../../apps/mobile/src/lib/proving-content/unit202-proving-fixture.ts";

function real<T extends { id: string }>(records: readonly T[], id: string): T {
  const found = records.find((r) => r.id === id);
  if (!found) throw new Error(`real CC-05A corpus has no record with id "${id}" -- fixture references a stale id`);
  return found;
}

describe("CC-05C proving-slice content fixture matches the real governed CC-05A corpus exactly", () => {
  it("formula families are byte-identical to the real corpus", () => {
    expect(FORMULA_OHMS_LAW).toEqual(real(formulaFamilies, "formula.ohms_law"));
    expect(FORMULA_SERIES_RESISTANCE).toEqual(real(formulaFamilies, "formula.series_resistance"));
    expect(FORMULA_PARALLEL_RESISTANCE).toEqual(real(formulaFamilies, "formula.parallel_resistance"));
  });

  it("the VIR triangle mnemonic is byte-identical to the real corpus", () => {
    expect(MNEMONIC_VIR_TRIANGLE).toEqual(real(visualAidBlueprints, "mnemonic.vir_triangle"));
  });

  it("diagram blueprints are byte-identical to the real corpus", () => {
    expect(DIAGRAM_SERIES_RESISTORS).toEqual(real(diagramBlueprints, "circuit.series_resistors"));
    expect(DIAGRAM_PARALLEL_RESISTORS).toEqual(real(diagramBlueprints, "circuit.parallel_resistors"));
    expect(DIAGRAM_MOTOR_FORCE_FIELD_CURRENT).toEqual(real(diagramBlueprints, "motor.force_field_current"));
    expect(DIAGRAM_MAGNETIC_FIELD_CONDUCTOR_DIRECTION).toEqual(
      real(diagramBlueprints, "magnetic.field_conductor_direction"),
    );
  });

  it("worked-example blueprints are byte-identical to the real corpus", () => {
    expect(WORKED_OHMS_LAW_SOLVE_VOLTAGE).toEqual(real(workedExampleBlueprints, "worked.ohms_law.solve_voltage"));
    expect(WORKED_OHMS_LAW_SOLVE_CURRENT).toEqual(real(workedExampleBlueprints, "worked.ohms_law.solve_current"));
    expect(WORKED_OHMS_LAW_SOLVE_RESISTANCE).toEqual(
      real(workedExampleBlueprints, "worked.ohms_law.solve_resistance"),
    );
    expect(WORKED_SERIES_CALCULATE_TOTAL).toEqual(
      real(workedExampleBlueprints, "worked.series_resistance.calculate_total"),
    );
    expect(WORKED_PARALLEL_CALCULATE_TOTAL).toEqual(
      real(workedExampleBlueprints, "worked.parallel_resistance.calculate_total"),
    );
  });

  it("question blueprints are byte-identical to the real corpus", () => {
    expect(QB_OHMS_LAW_SOLVE_FOR_VOLTAGE).toEqual(real(questionBlueprints, "ohms_law.solve_for_voltage"));
    expect(QB_OHMS_LAW_SOLVE_FOR_CURRENT).toEqual(real(questionBlueprints, "ohms_law.solve_for_current"));
    expect(QB_OHMS_LAW_SOLVE_FOR_RESISTANCE).toEqual(real(questionBlueprints, "ohms_law.solve_for_resistance"));
    expect(QB_SERIES_CALCULATE_TOTAL_RESISTANCE).toEqual(
      real(questionBlueprints, "series.calculate_total_resistance"),
    );
    expect(QB_SERIES_SOLVE_MISSING_COMPONENT).toEqual(real(questionBlueprints, "series.solve_missing_component"));
    expect(QB_PARALLEL_CALCULATE_TOTAL).toEqual(real(questionBlueprints, "parallel.calculate_total"));
    expect(QB_PARALLEL_SOLVE_MISSING_BRANCH).toEqual(real(questionBlueprints, "parallel.solve_missing_branch"));
    expect(QB_MAGNETISM_INTERPRET_FIELD_DIRECTION).toEqual(
      real(questionBlueprints, "magnetism.interpret_field_direction"),
    );
    expect(QB_MAGNETISM_INTERPRET_FORCE_DIRECTION).toEqual(
      real(questionBlueprints, "magnetism.interpret_force_direction"),
    );
  });
});
