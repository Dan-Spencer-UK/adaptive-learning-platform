/**
 * Thin, GENERIC binding of the real @alp/calculation-engine to the
 * Lesson Player's resolved local content (CC-06D, Correction D): no
 * calculation, marking or evidence logic of its own, and no binding to
 * any particular lesson's fixture -- the blueprint, formula families,
 * release identity and blueprint version all come from the resolved
 * local content record (./local-content-registry.ts).
 *
 * Deterministic identity: a question instance is fully determined by
 * (blueprintId, blueprintVersion, contentRelease, seed). The seed is
 * derived from the stable (instanceId, stepId) pair via the same FNV-1a
 * primitive @alp/calculation-engine's own seeding already uses, so a
 * restored session regenerates a byte-identical question for the same
 * step without persisting the generated instance itself. A retry
 * deliberately re-presents the SAME question (the correct answer is not
 * revealed while a retry is pending -- CC-06D Correction G); attempt
 * identity is recorded on the evidence event (attemptIndex,
 * answerRevealedBeforeAttempt), never hidden inside the seed.
 */
import { fnv1a32, generateQuestionInstance, type DeterministicIdentity, type GeneratedQuestionInstance } from "@alp/calculation-engine";
import type { DiagramBlueprint, FormulaFamily, QuestionBlueprint, WorkedExampleBlueprint } from "@alp/content-schema";

export function deriveStepSeed(instanceId: string, stepId: string): number {
  return fnv1a32(`${instanceId}::${stepId}`);
}

/**
 * Generates the deterministic question instance for one governed blueprint
 * within one lesson step, from resolved local release content.
 *
 * CC-12 fix (a genuine pre-existing production defect, found while writing
 * this package's own tests): `diagramBlueprints` was previously hardcoded
 * to `[]` here, but several real governed executors (e.g. magnetism's
 * `interpretFieldDirection`/`interpretForceDirection`/
 * `recogniseAttractionRepulsion`) call `requireDiagramBlueprint()`, which
 * THROWS when the referenced diagram blueprint is not present in the
 * generation context -- meaning any real learner answering
 * `guided_interpret_field_direction`, `guided_interpret_force_direction`
 * or `guided_recognise_attraction_repulsion` would have crashed the real
 * Lesson Player, every time, since this WAS this function's only real
 * production call site (`lesson-player.tsx`). Both optional params now
 * default to empty (preserving every existing caller's behaviour for
 * blueprints that genuinely need neither), but real callers should pass
 * the resolved lookup's own `diagramBlueprints`/`workedExampleBlueprints`.
 */
export function generateLessonQuestion(args: {
  readonly blueprint: QuestionBlueprint;
  readonly formulaFamilies: readonly FormulaFamily[];
  readonly diagramBlueprints?: readonly DiagramBlueprint[];
  readonly workedExampleBlueprints?: readonly WorkedExampleBlueprint[];
  readonly contentRelease: string;
  readonly blueprintVersion: number;
  readonly instanceId: string;
  readonly stepId: string;
}): GeneratedQuestionInstance {
  const identity: DeterministicIdentity = {
    blueprintId: args.blueprint.id,
    blueprintVersion: args.blueprintVersion,
    contentRelease: args.contentRelease,
    seed: deriveStepSeed(args.instanceId, args.stepId),
  };

  return generateQuestionInstance({
    blueprint: args.blueprint,
    formulaFamilies: args.formulaFamilies,
    diagramBlueprints: args.diagramBlueprints ?? [],
    workedExampleBlueprints: args.workedExampleBlueprints ?? [],
    identity,
  });
}
