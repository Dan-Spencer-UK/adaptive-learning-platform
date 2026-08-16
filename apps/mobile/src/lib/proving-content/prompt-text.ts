/**
 * CC-05C: turns a generated question instance's `parameters` (plain,
 * engine-computed data -- never re-derived here) into the human-readable
 * prompt lines the practice screen shows above the answer input. Numeric
 * values are surfaced here, in text, rather than embedded in the diagram
 * -- see SeriesCircuitDiagram.tsx / ParallelCircuitDiagram.tsx for the
 * symbolic-only convention this complements (design doc §2.8/§14, CC-05C
 * task brief §8).
 */
import type { GeneratedQuestionInstance } from "@alp/calculation-engine";

function num(parameters: GeneratedQuestionInstance["parameters"], key: string): number {
  const value = parameters[key];
  if (typeof value !== "number") throw new Error(`prompt-text: parameter "${key}" is not a number`);
  return value;
}

function componentLines(
  parameters: GeneratedQuestionInstance["parameters"],
  count: number,
  unit: string,
  excludeIndex?: number,
): string[] {
  const lines: string[] = [];
  for (let i = 0; i < count; i++) {
    if (i === excludeIndex) continue;
    const key = `R${i + 1}`;
    lines.push(`${key} = ${num(parameters, key)} ${unit}`);
  }
  return lines;
}

export function promptLinesFor(instance: GeneratedQuestionInstance): readonly string[] {
  const { parameters } = instance;
  switch (instance.identity.blueprintId) {
    case "ohms_law.solve_for_voltage":
      return [`I = ${num(parameters, "I")} A`, `R = ${num(parameters, "R")} Ω`];
    case "ohms_law.solve_for_current":
      return [`V = ${num(parameters, "V")} V`, `R = ${num(parameters, "R")} Ω`];
    case "ohms_law.solve_for_resistance":
      return [`V = ${num(parameters, "V")} V`, `I = ${num(parameters, "I")} A`];

    case "series.calculate_total_resistance":
      return componentLines(parameters, num(parameters, "component_count"), "Ω");

    case "series.solve_missing_component": {
      const count = num(parameters, "component_count");
      const target = String(parameters.target);
      const missingIndex = Number(target.replace("R", "")) - 1;
      return [
        `Total resistance Rt = ${num(parameters, "Rt")} Ω`,
        ...componentLines(parameters, count, "Ω", missingIndex),
        `Find ${target}.`,
      ];
    }

    case "parallel.calculate_total":
      return componentLines(parameters, num(parameters, "branch_count"), "Ω");

    case "parallel.solve_missing_branch": {
      const count = num(parameters, "branch_count");
      const target = String(parameters.target);
      const missingIndex = Number(target.replace("R", "")) - 1;
      return [
        `Total resistance Rt = ${num(parameters, "Rt")} Ω`,
        ...componentLines(parameters, count, "Ω", missingIndex),
        `Find ${target}.`,
      ];
    }

    case "magnetism.interpret_field_direction":
      return ["Apply the right-hand grip rule to determine the direction the magnetic field curls around the conductor."];

    case "magnetism.interpret_force_direction":
      return ["Determine the direction of the force on the current-carrying conductor."];

    default:
      throw new Error(`prompt-text: no prompt-line formatter registered for "${instance.identity.blueprintId}"`);
  }
}
