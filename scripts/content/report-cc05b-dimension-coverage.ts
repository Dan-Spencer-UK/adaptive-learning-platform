/**
 * CC-05B2: mechanical coverage evidence for every governed
 * `variantDimensions` entry across the full 84-blueprint Unit 202
 * manifest (task brief §12/§25) -- proves that a deterministic multi-seed
 * sweep actually exercises every permitted value of every finite,
 * meaningful variant dimension at least once, rather than relying on
 * chance.
 *
 * For each blueprint with a declared `variantDimensions` entry, this
 * generates `SEEDS_PER_BLUEPRINT` instances and checks which of the
 * dimension's `allowed` values actually appeared in
 * `instance.parameters[dimensionName]`. A dimension whose only allowed
 * value is a generator-selection marker (e.g. `target: ["choose_from_components"]`,
 * which documents "the generator picks the unknown", not an enumerable
 * value set) is reported but not required to be "covered" in the
 * conventional sense.
 *
 * Usage:
 *   node scripts/content/report-cc05b-dimension-coverage.ts            (print report)
 *   node scripts/content/report-cc05b-dimension-coverage.ts --check     (exit 1 on any uncovered value)
 */

import { generateQuestionInstance, type DeterministicIdentity } from "@alp/calculation-engine";
import { pedagogyManifestSchema } from "@alp/content-schema";
import { fileURLToPath } from "node:url";
import { cc05aPedagogyUnit202 } from "./data/cc05a-pedagogy-unit202.ts";

const SEEDS_PER_BLUEPRINT = 60;

/** Dimensions whose sole allowed value is a generator-selection marker, not an enumerable value to sweep for coverage. */
const GENERATOR_SELECTION_MARKERS = new Set(["choose_from_components", "choose_from_branches"]);

export interface DimensionCoverageResult {
  readonly blueprintId: string;
  readonly dimensionName: string;
  readonly allowedValues: readonly (string | number)[];
  readonly exercisedValues: readonly (string | number)[];
  readonly uncoveredValues: readonly (string | number)[];
  readonly isGeneratorSelectionMarker: boolean;
}

export function buildDimensionCoverageReport(): readonly DimensionCoverageResult[] {
  const pedagogy = pedagogyManifestSchema.parse(cc05aPedagogyUnit202);
  const results: DimensionCoverageResult[] = [];

  for (const blueprint of pedagogy.questionBlueprints) {
    for (const [dimensionName, dimension] of Object.entries(blueprint.variantDimensions)) {
      const isMarker = dimension.allowed.every((v) => typeof v === "string" && GENERATOR_SELECTION_MARKERS.has(v));
      const exercised = new Set<string | number>();

      for (let seed = 0; seed < SEEDS_PER_BLUEPRINT; seed++) {
        const identity: DeterministicIdentity = {
          blueprintId: blueprint.id,
          blueprintVersion: 1,
          contentRelease: "2026.08.001-dimension-coverage",
          seed,
        };
        const instance = generateQuestionInstance({
          blueprint,
          formulaFamilies: pedagogy.formulaFamilies,
          diagramBlueprints: pedagogy.diagramBlueprints,
          workedExampleBlueprints: pedagogy.workedExampleBlueprints,
          identity,
        });
        const value = instance.parameters[dimensionName];
        if (typeof value === "string" || typeof value === "number") exercised.add(value);
      }

      const uncoveredValues = isMarker ? [] : dimension.allowed.filter((v) => !exercised.has(v));

      results.push({
        blueprintId: blueprint.id,
        dimensionName,
        allowedValues: dimension.allowed,
        exercisedValues: [...exercised],
        uncoveredValues,
        isGeneratorSelectionMarker: isMarker,
      });
    }
  }

  return results;
}

export function isDimensionCoverageClean(results: readonly DimensionCoverageResult[]): boolean {
  return results.every((r) => r.uncoveredValues.length === 0);
}

function formatReport(results: readonly DimensionCoverageResult[]): string {
  const lines: string[] = [];
  lines.push("CC-05B2 variant-dimension coverage report (full governed Unit 202 manifest)");
  lines.push("================================================================================");
  lines.push(`Blueprints with a declared variantDimensions entry: ${new Set(results.map((r) => r.blueprintId)).size}`);
  lines.push(`Total dimension entries: ${results.length}`);
  lines.push(`Seeds swept per blueprint: ${SEEDS_PER_BLUEPRINT}`);
  lines.push("");
  for (const r of results) {
    const status = r.isGeneratorSelectionMarker ? "MARKER" : r.uncoveredValues.length === 0 ? "PASS" : "FAIL";
    lines.push(`  [${status}] ${r.blueprintId} :: ${r.dimensionName} -- allowed=[${r.allowedValues.join(", ")}] exercised=[${r.exercisedValues.join(", ")}]`);
    if (r.uncoveredValues.length) lines.push(`         uncovered=[${r.uncoveredValues.join(", ")}]`);
  }
  return lines.join("\n");
}

function isMainModule(): boolean {
  const entryPoint = process.argv[1];
  if (!entryPoint) return false;
  return fileURLToPath(import.meta.url) === entryPoint;
}

if (isMainModule()) {
  const results = buildDimensionCoverageReport();
  console.log(formatReport(results));
  const clean = isDimensionCoverageClean(results);
  console.log("");
  console.log(clean ? "PASS: every finite variant-dimension value is exercised by the seed sweep." : "FAIL: see above.");
  if (process.argv.includes("--check") && !clean) {
    process.exit(1);
  }
}
