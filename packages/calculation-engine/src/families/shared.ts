/**
 * CC-05B: shared plumbing every family executor uses. This file contains
 * no family-specific numbers or pedagogy -- only generic lookups and
 * assembly of the common GeneratedQuestionInstance shape from a
 * blueprint + computed representation/expected-answer. Family executors
 * (ohms-law.ts, series-resistance.ts, ...) are thin: they decide WHAT
 * parameters to generate and WHICH formula form/target to use, then call
 * back into this module (and the generic formula-evaluator/marking
 * modules) to do the actual work -- proving the same generic machinery
 * serves every family, per the task brief's "do not hard-code the engine
 * around these families" instruction.
 */

import type {
  DiagramBlueprint,
  FormulaFamily,
  QuestionBlueprint,
  WorkedExampleBlueprint,
} from "@alp/content-schema";
import { evaluateFormulaExpression, type VariableBindings } from "../formula-evaluator.ts";
import type { Rng } from "../seed.ts";
import type { DeterministicIdentity } from "../seed.ts";
import type {
  DiagramInstance,
  ExpectedAnswer,
  FormulaInstance,
  GeneratedQuestionInstance,
  QuestionRepresentationInstance,
  WorkedExampleInstance,
} from "../types.ts";

export interface GenerationContext {
  readonly blueprint: QuestionBlueprint;
  readonly formulaFamiliesById: ReadonlyMap<string, FormulaFamily>;
  readonly diagramBlueprintsById: ReadonlyMap<string, DiagramBlueprint>;
  readonly workedExampleBlueprintsById: ReadonlyMap<string, WorkedExampleBlueprint>;
  readonly identity: DeterministicIdentity;
  readonly rng: Rng;
}

export type QuestionExecutor = (ctx: GenerationContext) => GeneratedQuestionInstance;

export function requireFormulaFamily(ctx: GenerationContext, id: string): FormulaFamily {
  const family = ctx.formulaFamiliesById.get(id);
  if (!family) throw new Error(`generation context is missing required formula family "${id}"`);
  return family;
}

export function requireDiagramBlueprint(ctx: GenerationContext, id: string): DiagramBlueprint {
  const diagram = ctx.diagramBlueprintsById.get(id);
  if (!diagram) throw new Error(`generation context is missing required diagram blueprint "${id}"`);
  return diagram;
}

export function variableUnitSymbol(formulaFamily: FormulaFamily, symbol: string): string {
  const variable = formulaFamily.variables.find((v) => v.symbol === symbol);
  if (!variable) throw new Error(`formula family "${formulaFamily.id}" has no variable definition for "${symbol}"`);
  return variable.unitSymbol;
}

/** Evaluates the formula form for `target` against `bindings`, returning a fully-formed FormulaInstance. */
export function buildFormulaInstance(
  formulaFamily: FormulaFamily,
  target: string,
  bindings: VariableBindings,
): FormulaInstance {
  const form = formulaFamily.forms.find((f) => f.target === target);
  if (!form) throw new Error(`formula family "${formulaFamily.id}" has no form targeting "${target}"`);
  const result = evaluateFormulaExpression(form.expression, bindings);
  return {
    formulaFamilyId: formulaFamily.id,
    target,
    substitution: bindings,
    result,
    unitSymbol: variableUnitSymbol(formulaFamily, target),
  };
}

export function buildWorkedExampleInstance(
  formulaFamily: FormulaFamily,
  target: string,
  knownVariables: VariableBindings,
  steps: readonly string[],
): WorkedExampleInstance {
  const formulaInstance = buildFormulaInstance(formulaFamily, target, knownVariables);
  return {
    formulaFamilyId: formulaFamily.id,
    target,
    knownVariables,
    steps,
    result: formulaInstance.result,
    unitSymbol: formulaInstance.unitSymbol,
  };
}

export function buildDiagramInstance(
  diagramBlueprint: DiagramBlueprint,
  parameters: Readonly<Record<string, string | number | boolean>>,
  labels: readonly string[],
): DiagramInstance {
  return { blueprintId: diagramBlueprint.id, parameters, labels };
}

/**
 * Assembles the common GeneratedQuestionInstance envelope from the
 * blueprint (identity/assertionFamilyId/capabilityId/title/marking/
 * evidence all come straight from CC-05A's governed blueprint record --
 * never redefined here) plus the family executor's computed parameters/
 * representation/expected answer.
 */
export function assembleInstance(
  ctx: GenerationContext,
  parameters: Readonly<Record<string, number | string>>,
  representation: QuestionRepresentationInstance,
  expected: ExpectedAnswer,
): GeneratedQuestionInstance {
  const { blueprint } = ctx;
  return {
    identity: ctx.identity,
    assertionFamilyId: blueprint.assertionFamilyId,
    capabilityId: blueprint.capabilityId,
    title: blueprint.title,
    parameters,
    representation,
    expected,
    marking: blueprint.marking,
    evidence: blueprint.evidence,
  };
}
