/**
 * Thin binding of the real @alp/calculation-engine to the Lesson Player's
 * governed content fixture -- mirrors
 * lib/proving-engine/proving-engine.ts's exact discipline: no
 * calculation, marking or evidence logic of its own.
 *
 * Deterministic identity: a question instance is fully determined by
 * (blueprintId, blueprintVersion, contentRelease, seed). The seed is
 * derived from the stable (instanceId, stepId) pair via the same FNV-1a
 * primitive @alp/calculation-engine's own seeding already uses, so a
 * restored session regenerates a byte-identical question for the same
 * step (task brief §23/§24 -- immutable instance, deterministic
 * restoration) without needing to persist the generated instance itself.
 */
import { fnv1a32, generateQuestionInstance, type DeterministicIdentity, type GeneratedQuestionInstance } from "@alp/calculation-engine";
import type { QuestionBlueprint } from "@alp/content-schema";

import { LESSON_OHMS_LAW, LESSON_QUESTION_BLUEPRINTS, FORMULA_OHMS_LAW } from "./lesson-ohms-law-content-fixture.ts";

const BLUEPRINT_VERSION = 1;

export function deriveStepSeed(instanceId: string, stepId: string): number {
  return fnv1a32(`${instanceId}::${stepId}`);
}

/** Generates the deterministic question instance for a governed Ohm's Law question blueprint within one lesson step. */
export function generateLessonQuestion(args: { readonly blueprintId: string; readonly instanceId: string; readonly stepId: string }): GeneratedQuestionInstance {
  const blueprint = LESSON_QUESTION_BLUEPRINTS.find((b) => b.id === args.blueprintId);
  if (!blueprint) {
    throw new Error(`"${args.blueprintId}" is not one of this Lesson Player's governed question blueprints`);
  }

  const identity: DeterministicIdentity = {
    blueprintId: blueprint.id,
    blueprintVersion: BLUEPRINT_VERSION,
    contentRelease: LESSON_OHMS_LAW.contentRelease,
    seed: deriveStepSeed(args.instanceId, args.stepId),
  };

  return generateQuestionInstance({
    blueprint,
    formulaFamilies: [FORMULA_OHMS_LAW],
    diagramBlueprints: [],
    workedExampleBlueprints: [],
    identity,
  });
}

export function lessonQuestionBlueprints(): readonly QuestionBlueprint[] {
  return LESSON_QUESTION_BLUEPRINTS;
}
