/**
 * CC-05B2: execution for the 6 `electrical.series_vs_parallel_comparison`
 * question blueprints. Three (identify_topology, recognise_mixed_circuit,
 * trace_current_path) use the `circuit.series_parallel_mixed` diagram
 * blueprint; the remaining three are deterministic physics/maths
 * comparisons that need no diagram.
 *
 * Interpretation note (diagram <-> answer-option mapping, not a CC-05A
 * content change): `circuit.series_parallel_mixed`'s only structural
 * parameter is `branch_arrangement` in {"series_of_parallel",
 * "parallel_of_series"} -- both genuinely mixed sub-structures. For
 * `identify_topology` (whose answer options are the binary
 * ["series", "parallel"]), this executor reads that parameter as the
 * circuit's DOMINANT top-level structure: "series_of_parallel" means
 * parallel sub-blocks wired in series with each other (top-level =
 * series); "parallel_of_series" means series sub-blocks wired in
 * parallel (top-level = parallel) -- the conventional way compound
 * networks of this shape are named. `recognise_mixed_circuit` always
 * answers "mixed" regardless of which arrangement, since both are
 * genuinely mixed at the sub-structure level.
 */

import { pick } from "../seed.ts";
import { assembleInstance, buildDiagramInstance, requireDiagramBlueprint, type QuestionExecutor } from "./shared.ts";

const MIXED_DIAGRAM_ID = "circuit.series_parallel_mixed";
const BRANCH_ARRANGEMENTS = ["series_of_parallel", "parallel_of_series"] as const;
type BranchArrangement = (typeof BRANCH_ARRANGEMENTS)[number];

const DOMINANT_TOPOLOGY: Readonly<Record<BranchArrangement, "series" | "parallel">> = {
  series_of_parallel: "series",
  parallel_of_series: "parallel",
};

const identifyTopology: QuestionExecutor = (ctx) => {
  const diagramBlueprint = requireDiagramBlueprint(ctx, MIXED_DIAGRAM_ID);
  const arrangement = pick(ctx.rng, BRANCH_ARRANGEMENTS);
  const diagram = buildDiagramInstance(diagramBlueprint, { branch_arrangement: arrangement, show_values: false }, [
    "R1",
    "R2",
    "R3",
  ]);
  return assembleInstance(
    ctx,
    { branch_arrangement: arrangement },
    { diagram },
    { answer: ctx.blueprint.answer, value: DOMINANT_TOPOLOGY[arrangement] },
  );
};

const recogniseMixedCircuit: QuestionExecutor = (ctx) => {
  const diagramBlueprint = requireDiagramBlueprint(ctx, MIXED_DIAGRAM_ID);
  const arrangement = pick(ctx.rng, BRANCH_ARRANGEMENTS);
  const diagram = buildDiagramInstance(diagramBlueprint, { branch_arrangement: arrangement, show_values: false }, [
    "R1",
    "R2",
    "R3",
  ]);
  return assembleInstance(ctx, { branch_arrangement: arrangement }, { diagram }, { answer: ctx.blueprint.answer, value: "mixed" });
};

const traceCurrentPath: QuestionExecutor = (ctx) => {
  const diagramBlueprint = requireDiagramBlueprint(ctx, MIXED_DIAGRAM_ID);
  const arrangement = pick(ctx.rng, BRANCH_ARRANGEMENTS);
  const diagram = buildDiagramInstance(diagramBlueprint, { branch_arrangement: arrangement, show_values: true }, [
    "R1",
    "R2",
    "R3",
  ]);
  return assembleInstance(
    ctx,
    { branch_arrangement: arrangement },
    { diagram },
    { answer: ctx.blueprint.answer, value: "region-multi-path" },
  );
};

const compareResistance: QuestionExecutor = (ctx) => {
  // For any set of >=2 positive resistors, the series total is always
  // strictly greater than the parallel total -- a mathematical certainty
  // of formula.series_resistance ("add") versus formula.parallel_resistance
  // ("reciprocal_of_sum_of_reciprocals"), not a coin flip.
  return assembleInstance(ctx, {}, {}, { answer: ctx.blueprint.answer, value: "series_higher" });
};

const compareCurrentVoltage: QuestionExecutor = (ctx) => {
  const describedPattern = pick(ctx.rng, ["current_common_voltage_divides", "voltage_common_current_divides"] as const);
  const expected = describedPattern === "current_common_voltage_divides" ? "series_behaviour" : "parallel_behaviour";
  return assembleInstance(
    ctx,
    { described_pattern: describedPattern },
    {},
    { answer: ctx.blueprint.answer, value: expected },
  );
};

const comparePowerEnergy: QuestionExecutor = (ctx) => {
  // At the SAME supply voltage, parallel's lower total resistance means
  // higher total power (P = V^2 / R) and, over the same time, higher
  // total energy -- again a mathematical certainty, not arbitrary.
  return assembleInstance(ctx, {}, {}, { answer: ctx.blueprint.answer, value: "parallel_higher" });
};

export const comparisonExecutors: Readonly<Record<string, QuestionExecutor>> = {
  "comparison.identify_topology": identifyTopology,
  "comparison.recognise_mixed_circuit": recogniseMixedCircuit,
  "comparison.trace_current_path": traceCurrentPath,
  "comparison.compare_resistance": compareResistance,
  "comparison.compare_current_voltage": compareCurrentVoltage,
  "comparison.compare_power_energy": comparePowerEnergy,
};
