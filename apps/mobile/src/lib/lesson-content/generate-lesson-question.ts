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
import type { FormulaFamily, QuestionBlueprint } from "@alp/content-schema";

export function deriveStepSeed(instanceId: string, stepId: string): number {
  return fnv1a32(`${instanceId}::${stepId}`);
}

/** Generates the deterministic question instance for one governed blueprint within one lesson step, from resolved local release content. */
export function generateLessonQuestion(args: {
  readonly blueprint: QuestionBlueprint;
  readonly formulaFamilies: readonly FormulaFamily[];
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
    diagramBlueprints: [],
    workedExampleBlueprints: [],
    identity,
  });
}
