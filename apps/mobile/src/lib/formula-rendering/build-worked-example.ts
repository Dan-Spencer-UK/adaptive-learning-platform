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
import { evaluateFormulaExpression, selectFormForKnownVariables } from "@alp/calculation-engine";
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
  // CC-12H: a formula family may declare more than one form for the same
  // target (e.g. formula.electrical_power has both P = V x I and
  // P = I^2 x R, both targeting "P") -- picking the first form matching
  // only `target` (as this used to) silently grabbed the WRONG form
  // whenever a worked example's own `knownVariables`/teachingValues
  // matched the second form, producing a real "missing binding" render
  // crash (worked.power.calculate_from_ir, found live). Every real
  // calculation-engine executor already resolves this ambiguity via
  // `selectFormForKnownVariables`, which is reused here -- but ONLY when
  // genuine ambiguity exists (more than one form targets this variable).
  // A single-form target (e.g. Rt = R1 + R2 + ... , series/parallel
  // resistance) is never ambiguous, and its own variable-arity operand
  // list (as few as 2, as many as 4 resistors) is a DELIBERATE governed
  // pattern the real evaluator already resolves permissively for "add"/
  // "reciprocal_of_sum_of_reciprocals" (formula-evaluator.ts's own
  // optional-resolve path) -- `selectFormForKnownVariables`'s exact-match
  // requirement exists to disambiguate BETWEEN forms, not to re-enforce
  // that every declared operand is bound, so it is only invoked where
  // there is more than one form to choose between.
  const candidateForms = formulaFamily.forms.filter((f) => f.target === blueprint.target);
  const form =
    candidateForms.length === 1
      ? candidateForms[0]!
      : selectFormForKnownVariables(formulaFamily.forms, blueprint.target, Object.keys(values));
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
