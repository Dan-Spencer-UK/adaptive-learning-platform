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
 * governed presentation's `answerOptionLabels`. Option order is the
 * governed `answer.options` order. Fails loudly when the blueprint
 * declares no options or a label is missing for a declared option.
 */
export function resolveAnswerOptions(blueprint: QuestionBlueprint): readonly PresentedAnswerOption[] {
  const presentation = requirePresentation(blueprint);
  const options = blueprint.answer.options;
  if (!options || options.length === 0) {
    throw new Error(`Question blueprint "${blueprint.id}" has no governed answer.options to present`);
  }
  return options.map((value) => {
    const label = presentation.answerOptionLabels?.[value];
    if (!label) {
      throw new Error(`Question blueprint "${blueprint.id}" declares answer option "${value}" but its governed presentation has no learner-facing label for it`);
    }
    return { value, label };
  });
}
