/**
 * CC-05B: top-level engine entry points --
 *   blueprint + version + seed + content-release identity
 *     -> generateQuestionInstance()  -> GeneratedQuestionInstance
 *     -> evaluateAnswer()            -> EvaluationResult
 *     -> emitEvidence()              -> QuestionEvidenceRecord
 *
 * This module owns the executor REGISTRY (blueprint id -> generation
 * function) and the generic marking/evidence glue; it contains no
 * calculation logic of its own -- every number comes from
 * ./formula-evaluator.ts via a family executor in ./families/*.
 *
 * Callers (tests, the future CC-05C native integration, the
 * scripts/content proving harness) supply the actual CC-05A blueprint/
 * formula-family/diagram-blueprint objects; this package never imports
 * scripts/content/data itself (see scripts/content/README.md: content
 * authoring tooling is "never imported by the learner-runtime domain
 * engines" -- the dependency runs the other way, content -> engine).
 */

import type { DiagramBlueprint, FormulaFamily, QuestionBlueprint, WorkedExampleBlueprint } from "@alp/content-schema";
import { chargeExecutors } from "./families/charge.ts";
import { comparisonExecutors } from "./families/comparison.ts";
import { emfExecutors } from "./families/emf.ts";
import { energyExecutors } from "./families/energy.ts";
import { faultExecutors } from "./families/fault.ts";
import { instrumentationExecutors } from "./families/instrumentation.ts";
import { magnetismExecutors } from "./families/magnetism.ts";
import { ohmsLawExecutors } from "./families/ohms-law.ts";
import { parallelResistanceExecutors } from "./families/parallel-resistance.ts";
import { powerExecutors } from "./families/power.ts";
import { resistivityExecutors } from "./families/resistivity.ts";
import { seriesResistanceExecutors } from "./families/series-resistance.ts";
import type { GenerationContext, QuestionExecutor } from "./families/shared.ts";
import { thermalAndConductorsExecutors } from "./families/thermal-and-conductors.ts";
import { unitsAndQuantitiesExecutors } from "./families/units-and-quantities.ts";
import { waveformExecutors } from "./families/waveform.ts";
import { markAnswer, type AnswerValue } from "./marking.ts";
import { createRngFromIdentity, type DeterministicIdentity } from "./seed.ts";
import { UnsupportedBlueprintError, type EvaluationResult, type GeneratedQuestionInstance, type QuestionEvidenceRecord } from "./types.ts";

/**
 * The complete blueprint-id -> executor registry. CC-05B originally
 * implemented a 36-blueprint proving subset (Ohm's law, series/parallel
 * resistance, magnetism/electromagnetism); CC-05B2 extends this to every
 * governed, learner-assessable question blueprint in the current CC-05A
 * Unit 202 manifest (84 total) -- si_units, core_quantities, resistivity,
 * series_vs_parallel_comparison, power_relationships, energy_and_efficiency,
 * charge_and_current, thermal_and_chemical_effects, conductors_and_insulators,
 * instrumentation, fault_conditions_protection, emf_and_generation and
 * ac_dc_waveforms. `SUPPORTED_BLUEPRINT_IDS` below is the explicit,
 * mechanically-checkable record of exactly which ones (see
 * scripts/content/prove-cc05b-engine.ts for the full-manifest gate that
 * proves this set equals the live governed blueprint set).
 */
const EXECUTORS: Readonly<Record<string, QuestionExecutor>> = {
  ...ohmsLawExecutors,
  ...seriesResistanceExecutors,
  ...parallelResistanceExecutors,
  ...magnetismExecutors,
  ...unitsAndQuantitiesExecutors,
  ...resistivityExecutors,
  ...comparisonExecutors,
  ...powerExecutors,
  ...energyExecutors,
  ...chargeExecutors,
  ...thermalAndConductorsExecutors,
  ...instrumentationExecutors,
  ...faultExecutors,
  ...emfExecutors,
  ...waveformExecutors,
};

export const SUPPORTED_BLUEPRINT_IDS: readonly string[] = Object.freeze(Object.keys(EXECUTORS).sort());

export function isBlueprintSupported(blueprintId: string): boolean {
  return Object.hasOwn(EXECUTORS, blueprintId);
}

export interface GenerationInputs {
  readonly blueprint: QuestionBlueprint;
  readonly formulaFamilies: readonly FormulaFamily[];
  readonly diagramBlueprints: readonly DiagramBlueprint[];
  readonly workedExampleBlueprints?: readonly WorkedExampleBlueprint[];
  readonly identity: DeterministicIdentity;
}

/**
 * Generates a fully-formed, reproducible question instance. Deterministic:
 * calling this again with an identity tuple equal by value (same
 * blueprintId/blueprintVersion/contentRelease/seed) always produces an
 * identical instance, because the only source of variation
 * (createRngFromIdentity) is a pure function of that tuple -- see
 * ./seed.ts's module documentation for the full determinism contract.
 */
export function generateQuestionInstance(inputs: GenerationInputs): GeneratedQuestionInstance {
  const executor = EXECUTORS[inputs.blueprint.id];
  if (!executor) throw new UnsupportedBlueprintError(inputs.blueprint.id);

  const ctx: GenerationContext = {
    blueprint: inputs.blueprint,
    formulaFamiliesById: new Map(inputs.formulaFamilies.map((f) => [f.id, f])),
    diagramBlueprintsById: new Map(inputs.diagramBlueprints.map((d) => [d.id, d])),
    workedExampleBlueprintsById: new Map((inputs.workedExampleBlueprints ?? []).map((w) => [w.id, w])),
    identity: inputs.identity,
    rng: createRngFromIdentity(inputs.identity),
  };
  return executor(ctx);
}

/**
 * Grades a learner's answer against a previously generated instance.
 *
 * Misconception attribution: an incorrect answer is attributed to a
 * specific misconception ONLY when the blueprint's own governed
 * `evidence.misconceptionTargets` declares one for this question (task
 * brief §17 -- never inferred beyond what the blueprint explicitly
 * permits). When more than one misconception target is declared, the
 * first is used; no proving-slice blueprint currently declares more than
 * one (see the CC-05B evidence document's "limitations" section).
 */
export function evaluateAnswer(instance: GeneratedQuestionInstance, given: AnswerValue): EvaluationResult {
  const outcome = markAnswer(instance.marking, instance.expected.value, given);
  if (outcome.correct) {
    return { correct: true, detail: outcome.detail };
  }
  const declaredMisconception = instance.evidence.misconceptionTargets[0];
  if (declaredMisconception) {
    return {
      correct: false,
      detail: outcome.detail,
      misconceptionIdentifier: declaredMisconception.misconceptionIdentifier,
      evidenceStrength: declaredMisconception.evidenceStrength,
    };
  }
  return { correct: false, detail: outcome.detail, evidenceStrength: "generic" };
}

/**
 * Emits a structured evidence record suitable for the future CC-07
 * evidence-engine to consume. CC-05B does not implement mastery/adaptive
 * logic itself -- this is the full extent of its evidence responsibility
 * (task brief §18).
 */
export function emitEvidence(instance: GeneratedQuestionInstance, evaluation: EvaluationResult): QuestionEvidenceRecord {
  return {
    assertionFamilyId: instance.assertionFamilyId,
    capabilityId: instance.capabilityId,
    assertionIdentifiers: instance.evidence.assertionIdentifiers,
    supportingCapabilityIds: instance.evidence.supportingCapabilityIds,
    questionBlueprintId: instance.identity.blueprintId,
    generatedInstanceIdentity: instance.identity,
    correct: evaluation.correct,
    misconceptionIdentifier: evaluation.misconceptionIdentifier,
    evidenceStrength: evaluation.evidenceStrength,
    representationDependency: instance.evidence.representationDependency,
  };
}
