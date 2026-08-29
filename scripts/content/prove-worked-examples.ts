/**
 * CC-12H: mechanically exercises EVERY governed `WorkedExampleBlueprint`
 * in the live corpus -- the content-authoring-time half of the "formula
 * binding validation" this package's brief explicitly authorizes
 * (§13: "If formulas can reference variables absent from worked-example/
 * question bindings: add generation-time validation"), independent of
 * `apps/mobile`'s own runtime-contract Jest audit
 * (`mobile-runtime-contract-audit.test.tsx`) that originally caught this
 * defect class live on the emulator.
 *
 * Root cause this proves against: a worked example whose `teachingValues`
 * (or an explicitly supplied `knownValues`) is missing entirely, or whose
 * known-variable set doesn't exactly match ANY declared form for its
 * target -- both real, live-caught defects (worked.power.calculate_from_ir
 * silently resolved to the WRONG formula form when picked by target alone,
 * a distinct class from simply missing teachingValues). Mirrors
 * `apps/mobile/src/lib/formula-rendering/build-worked-example.ts`'s own
 * form-selection logic exactly (a single form for a target is used
 * directly -- its own variable-arity operand list, e.g. series/parallel
 * Rt = R1 + R2 + ..., is a deliberate governed pattern, not an
 * under-specified example; genuine ambiguity between multiple forms
 * sharing a target is resolved via the same public
 * `selectFormForKnownVariables` every real question executor already
 * uses) so this script and the real app can never silently drift apart.
 *
 * Usage:
 *   node scripts/content/prove-worked-examples.ts            (print report)
 *   node scripts/content/prove-worked-examples.ts --check     (exit 1 on any gap)
 */
import { evaluateFormulaExpression, selectFormForKnownVariables } from "@alp/calculation-engine";
import { pedagogyManifestSchema, type FormulaFamily, type WorkedExampleBlueprint } from "@alp/content-schema";
import { fileURLToPath } from "node:url";
import { cc05aPedagogyUnit202 } from "./data/cc05a-pedagogy-unit202.ts";

export interface WorkedExampleProofResult {
  readonly workedExampleId: string;
  readonly formulaFamilyId: string;
  readonly built: boolean;
  readonly error?: string;
}

export interface WorkedExampleProvingReport {
  readonly totalWorkedExamples: number;
  readonly results: readonly WorkedExampleProofResult[];
  readonly buildFailures: readonly string[];
}

function buildOne(formulaFamily: FormulaFamily, blueprint: WorkedExampleBlueprint): void {
  const values = blueprint.teachingValues;
  if (!values) {
    throw new Error(`worked example "${blueprint.id}" declares no governed teachingValues`);
  }
  const candidateForms = formulaFamily.forms.filter((f) => f.target === blueprint.target);
  const form = candidateForms.length === 1 ? candidateForms[0]! : selectFormForKnownVariables(formulaFamily.forms, blueprint.target, Object.keys(values));
  const variable = formulaFamily.variables.find((v) => v.symbol === blueprint.target);
  if (!variable) {
    throw new Error(`formula family "${formulaFamily.id}" has no variable "${blueprint.target}"`);
  }
  evaluateFormulaExpression(form.expression, values);
}

export function buildWorkedExamplesProvingReport(): WorkedExampleProvingReport {
  const pedagogy = pedagogyManifestSchema.parse(cc05aPedagogyUnit202);
  const results = pedagogy.workedExampleBlueprints.map((blueprint): WorkedExampleProofResult => {
    const formulaFamily = pedagogy.formulaFamilies.find((f) => f.id === blueprint.formulaFamilyId);
    if (!formulaFamily) {
      return { workedExampleId: blueprint.id, formulaFamilyId: blueprint.formulaFamilyId, built: false, error: `no formula family "${blueprint.formulaFamilyId}"` };
    }
    try {
      buildOne(formulaFamily, blueprint);
      return { workedExampleId: blueprint.id, formulaFamilyId: blueprint.formulaFamilyId, built: true };
    } catch (error) {
      return { workedExampleId: blueprint.id, formulaFamilyId: blueprint.formulaFamilyId, built: false, error: error instanceof Error ? error.message : String(error) };
    }
  });
  return {
    totalWorkedExamples: results.length,
    results,
    buildFailures: results.filter((r) => !r.built).map((r) => r.workedExampleId),
  };
}

export function isWorkedExamplesProvingReportClean(report: WorkedExampleProvingReport): boolean {
  return report.buildFailures.length === 0;
}

function isMainModule(): boolean {
  const entryPoint = process.argv[1];
  if (!entryPoint) return false;
  return fileURLToPath(import.meta.url) === entryPoint;
}

if (isMainModule()) {
  const report = buildWorkedExamplesProvingReport();
  console.log("CC-12H worked-example proving report -- full governed corpus");
  console.log("==============================================================");
  console.log(`Total governed worked examples: ${report.totalWorkedExamples}`);
  console.log(`Build failures (target 0): ${report.buildFailures.length}`);
  if (report.buildFailures.length) {
    for (const result of report.results) {
      if (!result.built) console.log(`  ${result.workedExampleId}: ${result.error}`);
    }
  }
  const clean = isWorkedExamplesProvingReportClean(report);
  console.log("");
  console.log(clean ? "PASS: every governed worked example builds successfully." : "FAIL: see above.");
  if (process.argv.includes("--check") && !clean) {
    process.exit(1);
  }
}
