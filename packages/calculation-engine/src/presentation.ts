/**
 * Deterministic rendering of governed learner-facing question
 * presentation copy (CC-06D, Correction C).
 *
 * The words a learner reads when answering a question are governed
 * instructional content (@alp/content-schema's
 * `questionPresentationManifestSchema`), never app-side per-blueprint
 * switch logic. This module is the single renderer that turns a
 * blueprint's governed presentation templates plus a generated
 * instance's own engine-computed parameters into concrete display
 * lines.
 *
 * Deliberately NOT a templating language: the only supported syntax is
 * `{parameterName}` substitution against `instance.parameters`. Missing
 * presentation or an unknown parameter placeholder fails loudly (product
 * invariant: unsupported/ambiguous content produces explicit
 * deterministic failure, not silent guessing).
 */

import type { QuestionBlueprint, QuestionPresentation } from "@alp/content-schema";
import { createRngForDomain, shuffleDeterministic } from "./seed.ts";
import type { GeneratedQuestionInstance } from "./types.ts";

export class MissingPresentationError extends Error {
  constructor(blueprintId: string) {
    super(
      `Question blueprint "${blueprintId}" declares no governed learner-facing presentation. Learner-runtime prompt copy must be governed content -- add a \`presentation\` contract to the blueprint (see @alp/content-schema's questionPresentationManifestSchema).`,
    );
    this.name = "MissingPresentationError";
  }
}

const PLACEHOLDER_PATTERN = /\{([A-Za-z0-9_]+)\}/g;

/**
 * Substitutes every `{parameterName}` placeholder in one governed
 * template line with the generated instance's parameter value.
 * Deterministic: same template + same parameters always renders the same
 * line. Throws on a placeholder naming a parameter the instance does not
 * carry -- a template/blueprint mismatch is invalid governed content,
 * never silently rendered as "{x}".
 */
export function renderPresentationLine(template: string, parameters: GeneratedQuestionInstance["parameters"]): string {
  return template.replace(PLACEHOLDER_PATTERN, (_match, name: string) => {
    const value = parameters[name];
    if (value === undefined) {
      throw new Error(`presentation template "${template}" references parameter "{${name}}" which the generated instance does not carry`);
    }
    return String(value);
  });
}

function requirePresentation(blueprint: QuestionBlueprint): QuestionPresentation {
  if (!blueprint.presentation) throw new MissingPresentationError(blueprint.id);
  return blueprint.presentation;
}

/** The learner-facing prompt lines for one generated question instance, rendered from the blueprint's governed presentation. */
export function resolvePromptLines(blueprint: QuestionBlueprint, instance: GeneratedQuestionInstance): readonly string[] {
  return requirePresentation(blueprint).promptLines.map((line) => renderPresentationLine(line, instance.parameters));
}

/** The flawed shown-working lines a diagnostic/classification question displays, rendered from the governed presentation (empty for non-diagnostic blueprints). */
export function resolveShownWorkingLines(blueprint: QuestionBlueprint, instance: GeneratedQuestionInstance): readonly string[] {
  if (!blueprint.presentation) throw new MissingPresentationError(blueprint.id);
  return (blueprint.presentation.shownWorkingLines ?? []).map((line) => renderPresentationLine(line, instance.parameters));
}

export interface PresentedAnswerOption {
  readonly value: string;
  readonly label: string;
}

/**
 * The learner-facing answer options for a blueprint whose choice
 * vocabulary is governed via `answer.options`, labelled from the
 * governed presentation's `answerOptionLabels`. Fails loudly when the
 * blueprint declares no options or a label is missing for a declared
 * option.
 *
 * CC-12G: display order is randomised, deterministically, per generated
 * question instance -- when `instance` is supplied, the returned options
 * are shuffled with an Rng seeded from that instance's own identity plus
 * a fixed "answerOptions" domain (`createRngForDomain`), so the SAME
 * instance (same `instanceId`/`stepId`, e.g. across a re-render or a
 * resumed session) always reproduces the SAME order, while a fresh
 * instance (a different seed) may produce a different one. Every
 * `answer.options` list this function serves (`multiple_choice`,
 * `worked_error_classification`) is a set of mutually-exclusive labelled
 * choices with no governed sequential meaning (confirmed by inspection of
 * every blueprint using this answer shape in the corpus); marking and
 * misconception attribution are keyed entirely on each option's stable
 * `value` string (see `marking.ts`), never on array position, so
 * reordering here cannot affect correctness. Omitting `instance` (as
 * dev-QA/test call sites that only need labels, not a live instance, may
 * do) returns the governed authored order unshuffled.
 */
export function resolveAnswerOptions(blueprint: QuestionBlueprint, instance?: GeneratedQuestionInstance): readonly PresentedAnswerOption[] {
  const presentation = requirePresentation(blueprint);
  const options = blueprint.answer.options;
  if (!options || options.length === 0) {
    throw new Error(`Question blueprint "${blueprint.id}" has no governed answer.options to present`);
  }
  const resolved = options.map((value) => {
    const label = presentation.answerOptionLabels?.[value];
    if (!label) {
      throw new Error(`Question blueprint "${blueprint.id}" declares answer option "${value}" but its governed presentation has no learner-facing label for it`);
    }
    return { value, label };
  });
  if (!instance) return resolved;
  return shuffleDeterministic(createRngForDomain(instance.identity, "answerOptions"), resolved);
}
