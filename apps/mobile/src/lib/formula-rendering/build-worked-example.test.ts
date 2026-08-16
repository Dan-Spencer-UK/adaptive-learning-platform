import { buildTeachingWorkedExample } from "./build-worked-example";
import {
  FORMULA_OHMS_LAW,
  FORMULA_PARALLEL_RESISTANCE,
  FORMULA_SERIES_RESISTANCE,
  WORKED_OHMS_LAW_SOLVE_CURRENT,
  WORKED_PARALLEL_CALCULATE_TOTAL,
  WORKED_SERIES_CALCULATE_TOTAL,
} from "@/lib/proving-content/unit202-proving-fixture";

describe("buildTeachingWorkedExample", () => {
  it("computes I = V / R via the real public formula evaluator, never a hand-rolled division", () => {
    const instance = buildTeachingWorkedExample(FORMULA_OHMS_LAW, WORKED_OHMS_LAW_SOLVE_CURRENT, { V: 24, R: 6 });
    expect(instance.result).toBe(4);
    expect(instance.unitSymbol).toBe("A");
    expect(instance.target).toBe("I");
    expect(instance.knownVariables).toEqual({ V: 24, R: 6 });
  });

  it("computes series Rt = R1 + R2 + R3 exactly", () => {
    const instance = buildTeachingWorkedExample(FORMULA_SERIES_RESISTANCE, WORKED_SERIES_CALCULATE_TOTAL, {
      R1: 10,
      R2: 20,
      R3: 30,
    });
    expect(instance.result).toBe(60);
    expect(instance.unitSymbol).toBe("Ω");
  });

  it("computes parallel Rt via reciprocal-of-sum-of-reciprocals exactly", () => {
    const instance = buildTeachingWorkedExample(FORMULA_PARALLEL_RESISTANCE, WORKED_PARALLEL_CALCULATE_TOTAL, {
      R1: 6,
      R2: 12,
      R3: 4,
    });
    expect(instance.result).toBe(2);
  });

  it("throws for a target the formula family has no form for", () => {
    expect(() =>
      buildTeachingWorkedExample(FORMULA_OHMS_LAW, { ...WORKED_OHMS_LAW_SOLVE_CURRENT, target: "nonexistent" }, {}),
    ).toThrow();
  });
});
