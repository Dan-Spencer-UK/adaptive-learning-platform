/**
 * CC-05C: builds a `WorkedExampleInstance` for teaching (lesson-screen)
 * display from fixed, illustrative known values.
 *
 * @alp/calculation-engine's own `buildWorkedExampleInstance` (families/
 * shared.ts) is internal to its executors and not part of the package's
 * public surface (packages/calculation-engine/src/index.ts only re-exports
 * ./families/shared.ts's *types*, not its functions) -- assessment worked
 * examples are only ever produced as part of a full generated question
 * instance. A *lesson* needs a worked example for a fixed, memorable
 * teaching example independent of any particular generated question, so
 * this module reimplements the same small plumbing (evaluate the form,
 * look up the unit) using ONLY the same public, generic
 * `evaluateFormulaExpression` the engine itself uses -- no calculation
 * logic is duplicated, only the assembly of already-public pieces into
 * the same instance shape.
 */
import { evaluateFormulaExpression } from "@alp/calculation-engine";
import type { WorkedExampleInstance } from "@alp/calculation-engine";
import type { FormulaFamily, WorkedExampleBlueprint } from "@alp/content-schema";

export function buildTeachingWorkedExample(
  formulaFamily: FormulaFamily,
  blueprint: WorkedExampleBlueprint,
  knownValues?: Readonly<Record<string, number>>,
): WorkedExampleInstance {
  // CC-06D (Correction C): teaching values default to the blueprint's own
  // GOVERNED `teachingValues` -- app code no longer supplies per-lesson
  // value constants. A worked example presented by a lesson step without
  // governed teaching values is invalid content and fails loudly.
  const values = knownValues ?? blueprint.teachingValues;
  if (!values) {
    throw new Error(`buildTeachingWorkedExample: worked example "${blueprint.id}" declares no governed teachingValues and none were supplied`);
  }
  const form = formulaFamily.forms.find((f) => f.target === blueprint.target);
  if (!form) {
    throw new Error(`buildTeachingWorkedExample: formula family "${formulaFamily.id}" has no form for "${blueprint.target}"`);
  }
  const variable = formulaFamily.variables.find((v) => v.symbol === blueprint.target);
  if (!variable) {
    throw new Error(`buildTeachingWorkedExample: formula family "${formulaFamily.id}" has no variable "${blueprint.target}"`);
  }
  const result = evaluateFormulaExpression(form.expression, values);
  return {
    formulaFamilyId: formulaFamily.id,
    target: blueprint.target,
    knownVariables: values,
    steps: blueprint.steps,
    result,
    unitSymbol: variable.unitSymbol,
  };
}
