/**
 * CC-05C: thin binding of the real @alp/calculation-engine (CC-05B,
 * approved/committed, not modified here) to this proving slice's governed
 * content fixture. Contains no calculation, marking or evidence logic of
 * its own -- every number/decision comes from the engine, exactly as
 * @alp/calculation-engine's own header comment requires of its callers.
 *
 * Deterministic identity: a question instance is fully determined by
 * (blueprintId, blueprintVersion, contentRelease, seed). This proving
 * slice fixes blueprintVersion=1 (the fixture has no versioning concept
 * yet -- a real content-release pipeline would carry it) and derives
 * `seed` from the session id + the question's position in the session's
 * queue, so re-opening a restored session regenerates byte-identical
 * question instances (see proving-session.ts).
 */
import {
  emitEvidence,
  evaluateAnswer,
  generateQuestionInstance,
  type AnswerValue,
  type DeterministicIdentity,
  type EvaluationResult,
  type GeneratedQuestionInstance,
  type QuestionEvidenceRecord,
} from "@alp/calculation-engine";
import type { QuestionBlueprint } from "@alp/content-schema";

import {
  PROVING_CONTENT_RELEASE,
  getProvingFamily,
  type ProvingFamily,
} from "@/lib/proving-content/unit202-proving-fixture";

const BLUEPRINT_VERSION = 1;

export interface GenerateProvingQuestionArgs {
  readonly familyId: string;
  readonly blueprintId: string;
  readonly seed: number;
}

/**
 * Generates a question instance for a blueprint belonging to one of this
 * proving slice's four governed families. Throws if the family/blueprint
 * is not part of the fixture -- this proving slice is intentionally
 * narrow (representative families only), not the full 84-blueprint
 * inventory (see docs/architecture/evidence/CC-05C-NATIVE-LEARNER-PROVING-SLICE.md).
 */
export function generateProvingQuestion(args: GenerateProvingQuestionArgs): GeneratedQuestionInstance {
  const family = getProvingFamily(args.familyId);
  if (!family) {
    throw new Error(`"${args.familyId}" is not one of this proving slice's governed families`);
  }
  const blueprint = family.questionBlueprints.find((q) => q.id === args.blueprintId);
  if (!blueprint) {
    throw new Error(`"${args.blueprintId}" is not a governed question blueprint of family "${args.familyId}"`);
  }

  const identity: DeterministicIdentity = {
    blueprintId: blueprint.id,
    blueprintVersion: BLUEPRINT_VERSION,
    contentRelease: PROVING_CONTENT_RELEASE,
    seed: args.seed,
  };

  return generateQuestionInstance({
    blueprint,
    formulaFamilies: family.formulaFamily ? [family.formulaFamily] : [],
    diagramBlueprints: family.diagramBlueprints,
    workedExampleBlueprints: family.workedExampleBlueprints,
    identity,
  });
}

/** Grades a learner's answer locally -- never a network round trip (Mobile UX Engineering Standard §1). */
export function markProvingAnswer(instance: GeneratedQuestionInstance, given: AnswerValue): EvaluationResult {
  return evaluateAnswer(instance, given);
}

/** Emits the structured evidence record for a graded interaction (CC-05B's full evidence responsibility; CC-05C persists it locally -- see proving-session.ts). */
export function emitProvingEvidence(
  instance: GeneratedQuestionInstance,
  evaluation: EvaluationResult,
): QuestionEvidenceRecord {
  return emitEvidence(instance, evaluation);
}

/** All question blueprints for a family, for lesson/practice screens that need the full list without re-deriving it. */
export function provingFamilyBlueprints(familyId: string): readonly QuestionBlueprint[] {
  return getProvingFamily(familyId)?.questionBlueprints ?? [];
}

export type { ProvingFamily };
export { getProvingFamily, PROVING_CONTENT_RELEASE };
