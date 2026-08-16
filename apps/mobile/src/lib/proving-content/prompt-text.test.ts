import { promptLinesFor } from "./prompt-text";
import { generateProvingQuestion } from "@/lib/proving-engine/proving-engine";

describe("promptLinesFor", () => {
  it("shows the two known values for ohms_law.solve_for_voltage, never the target itself", () => {
    const instance = generateProvingQuestion({ familyId: "electrical.ohms_law", blueprintId: "ohms_law.solve_for_voltage", seed: 1 });
    const lines = promptLinesFor(instance);
    expect(lines.some((l) => l.startsWith("I ="))).toBe(true);
    expect(lines.some((l) => l.startsWith("R ="))).toBe(true);
    expect(lines.some((l) => l.startsWith("V ="))).toBe(false);
  });

  it("lists every component for series.calculate_total_resistance, matching component_count", () => {
    const instance = generateProvingQuestion({
      familyId: "electrical.series_circuits",
      blueprintId: "series.calculate_total_resistance",
      seed: 2,
    });
    const count = instance.parameters.component_count as number;
    const lines = promptLinesFor(instance);
    expect(lines).toHaveLength(count);
  });

  it("omits the missing component's value and names it as the target for series.solve_missing_component", () => {
    const instance = generateProvingQuestion({
      familyId: "electrical.series_circuits",
      blueprintId: "series.solve_missing_component",
      seed: 3,
    });
    const target = String(instance.parameters.target);
    const lines = promptLinesFor(instance);
    expect(lines.some((l) => l.startsWith(`${target} =`))).toBe(false);
    expect(lines).toContain(`Find ${target}.`);
  });

  it("references the right-hand grip rule for magnetism.interpret_field_direction", () => {
    const instance = generateProvingQuestion({
      familyId: "electrical.magnetism_and_electromagnetism",
      blueprintId: "magnetism.interpret_field_direction",
      seed: 1,
    });
    const lines = promptLinesFor(instance);
    expect(lines.some((l) => /right-hand grip rule/i.test(l))).toBe(true);
  });

  it("throws for a blueprint id with no registered prompt-line formatter", () => {
    const instance = generateProvingQuestion({ familyId: "electrical.ohms_law", blueprintId: "ohms_law.solve_for_voltage", seed: 1 });
    const bogus = { ...instance, identity: { ...instance.identity, blueprintId: "nonexistent.blueprint" } };
    expect(() => promptLinesFor(bogus)).toThrow();
  });
});
