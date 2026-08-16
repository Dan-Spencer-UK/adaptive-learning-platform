/**
 * CC-05B: engine-level types for a generated, evaluable question
 * instance. These EXTEND CC-05A's governed content types
 * (@alp/content-schema) -- they never redefine or replace them. CC-05A's
 * own `generatedQuestionInstanceManifestSchema` deliberately stays a
 * minimal shape (blueprintId/version/seed/contentRelease/parameters/
 * expected) because CC-05A does not implement generation; this module is
 * where that shape gets the execution-time richness the design doc §5
 * asks for (representation specs, full answer/marking contracts, evidence
 * targets) without touching packages/content-schema/src/pedagogy.ts.
 *
 * Every type here is plain, JSON-serialisable data -- no functions,
 * classes or engine-runtime handles -- so a GeneratedQuestionInstance can
 * cross a JSON.stringify/parse boundary (offline queue, sync payload,
 * debug log) with zero semantic loss. See index.test.ts's serialisability
 * proof.
 */

import type {
  AnswerContract,
  EvidenceTarget,
  MarkingContract,
} from "@alp/content-schema";
import type { DeterministicIdentity } from "./seed.ts";

/** A structured, non-rendered formula presentation: authoritative substitution + result, not a display string. */
export interface FormulaInstance {
  readonly formulaFamilyId: string;
  readonly target: string;
  readonly substitution: Readonly<Record<string, number>>;
  readonly result: number;
  readonly unitSymbol: string;
}

/** A structured, non-rendered diagram presentation -- parameters + labels only, never rendered artwork. */
export interface DiagramInstance {
  readonly blueprintId: string;
  readonly parameters: Readonly<Record<string, string | number | boolean>>;
  readonly labels: readonly string[];
}

/** Deterministic worked-example data: enough for a future renderer to show formula -> substitution -> result -> unit. */
export interface WorkedExampleInstance {
  readonly formulaFamilyId: string;
  readonly target: string;
  readonly knownVariables: Readonly<Record<string, number>>;
  readonly steps: readonly string[];
  readonly result: number;
  readonly unitSymbol: string;
}

export interface QuestionRepresentationInstance {
  readonly formula?: FormulaInstance;
  readonly diagram?: DiagramInstance;
  readonly workedExample?: WorkedExampleInstance;
}

/** The value shape an ExpectedAnswer/learner answer may take -- must stay in sync with content-schema's answerTypeSchema value shapes actually used by the proving slice. */
export type AnswerValue = number | string | readonly string[];

export interface ExpectedAnswer {
  readonly answer: AnswerContract;
  readonly value: AnswerValue;
}

/**
 * A fully generated, self-contained, reproducible question instance.
 * `identity` alone is sufficient to regenerate an identical instance
 * (see engine.ts's `generateQuestionInstance`), everything else here is
 * denormalised onto the instance so a consumer never needs to re-resolve
 * blueprint/formula-family/diagram-blueprint records to grade an answer
 * or render a question.
 */
export interface GeneratedQuestionInstance {
  readonly identity: DeterministicIdentity;
  readonly assertionFamilyId: string;
  readonly capabilityId: string;
  readonly title: string;
  readonly parameters: Readonly<Record<string, number | string>>;
  readonly representation: QuestionRepresentationInstance;
  readonly expected: ExpectedAnswer;
  readonly marking: MarkingContract;
  readonly evidence: EvidenceTarget;
}

// Mirrors @alp/content-schema's evidenceStrengthSchema (pedagogy.ts) exactly --
// must stay in sync with it, the same convention knowledge-graph.ts's own
// enums use for their database CHECK-constraint counterparts.
export const EVIDENCE_STRENGTH = ["direct", "suggestive", "generic"] as const;
export type EvidenceStrength = (typeof EVIDENCE_STRENGTH)[number];

/**
 * The result of grading a learner's answer against a GeneratedQuestionInstance.
 * `misconceptionIdentifier`/`evidenceStrength` are populated only when the
 * blueprint's own governed `evidence.misconceptionTargets` explicitly
 * covers the observed wrong answer -- an incorrect answer is never
 * attributed to a specific misconception the blueprint didn't declare
 * (task brief §17).
 */
export interface EvaluationResult {
  readonly correct: boolean;
  readonly detail: string;
  readonly misconceptionIdentifier?: string;
  readonly evidenceStrength?: EvidenceStrength;
}

/**
 * Structured evidence emitted from a graded interaction, suitable for the
 * future CC-07 evidence-engine to consume. This package does not
 * implement mastery/adaptive logic itself (task brief §18) -- it only
 * emits this record.
 */
export interface QuestionEvidenceRecord {
  readonly assertionFamilyId: string;
  readonly capabilityId: string;
  readonly assertionIdentifiers: readonly string[];
  readonly supportingCapabilityIds: readonly string[];
  readonly questionBlueprintId: string;
  readonly generatedInstanceIdentity: DeterministicIdentity;
  readonly correct: boolean;
  readonly misconceptionIdentifier?: string;
  readonly evidenceStrength?: EvidenceStrength;
  readonly representationDependency: readonly string[];
}

export class UnsupportedBlueprintError extends Error {
  constructor(blueprintId: string) {
    super(`no CC-05B execution path is registered for question blueprint "${blueprintId}"`);
    this.name = "UnsupportedBlueprintError";
  }
}
