import { resolvePromptLines } from "@alp/calculation-engine";

import { promptLinesFor } from "./prompt-text";
import { generateProvingQuestion } from "@/lib/proving-engine/proving-engine";
import { getProvingFamily } from "./unit202-proving-fixture";

describe("promptLinesFor (legacy formatter for not-yet-migrated proving families)", () => {
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

  it("no longer has ANY Ohm's-law case -- Ohm prompt copy is governed presentation content, not app switch logic (CC-06D)", () => {
    const instance = generateProvingQuestion({ familyId: "electrical.ohms_law", blueprintId: "ohms_law.solve_for_voltage", seed: 1 });
    expect(() => promptLinesFor(instance)).toThrow(/no prompt-line formatter/);
  });

  it("throws for a blueprint id with no registered prompt-line formatter", () => {
    const instance = generateProvingQuestion({ familyId: "electrical.series_circuits", blueprintId: "series.calculate_total_resistance", seed: 1 });
    const bogus = { ...instance, identity: { ...instance.identity, blueprintId: "nonexistent.blueprint" } };
    expect(() => promptLinesFor(bogus)).toThrow();
  });
});

describe("governed presentation supersedes the legacy formatter for migrated blueprints", () => {
  it("ohms_law.solve_for_voltage renders its prompt from the GOVERNED presentation contract", () => {
    const family = getProvingFamily("electrical.ohms_law");
    const blueprint = family!.questionBlueprints.find((b) => b.id === "ohms_law.solve_for_voltage")!;
    const instance = generateProvingQuestion({ familyId: "electrical.ohms_law", blueprintId: "ohms_law.solve_for_voltage", seed: 1 });
    const lines = resolvePromptLines(blueprint, instance);
    expect(lines.some((l) => l.startsWith("I ="))).toBe(true);
    expect(lines.some((l) => l.startsWith("R ="))).toBe(true);
    expect(lines.some((l) => l.startsWith("V ="))).toBe(false);
  });
});
