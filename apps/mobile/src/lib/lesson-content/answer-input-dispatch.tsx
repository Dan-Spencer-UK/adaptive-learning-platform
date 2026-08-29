/**
 * Maps a governed `QuestionBlueprint.answer.type` to the right native
 * answer-input component and value encoding -- a compact reusable
 * dispatch, not one hand-wired branch per lesson step.
 *
 * CC-06D (Correction C): every piece of factual/pedagogical content this
 * dispatch renders now comes from governed content --
 *  - unit symbols resolve from the governed formula family's own
 *    variable definitions (never a hard-coded quantity->symbol map);
 *  - choice labels come from the blueprint's governed presentation
 *    (`answerOptionLabels`) or from governed formula-family variables;
 *  - diagnostic shown-working lines render from the blueprint's governed
 *    presentation templates via @alp/calculation-engine's single
 *    deterministic renderer.
 * Missing governed content fails loudly -- no silent app-side fallback
 * copy. Only the answer-TYPE dispatch itself is app logic.
 */
import type { AnswerValue, GeneratedQuestionInstance } from "@alp/calculation-engine";
import { createRngForDomain, resolveAnswerOptions, resolveShownWorkingLines, shuffleDeterministic } from "@alp/calculation-engine";
import type { FormulaFamily, QuestionBlueprint } from "@alp/content-schema";

import { formatExpressionInline } from "@/lib/formula-rendering/format-formula";

import { DirectionAnswerInput, type Direction } from "@/components/question/DirectionAnswerInput";
import { MultiSelectMatchAnswerInput, type MatchRow } from "@/components/question/MultiSelectMatchAnswerInput";
import { MultipleChoiceAnswerInput, type MultipleChoiceOption } from "@/components/question/MultipleChoiceAnswerInput";
import { NumericAnswerInput } from "@/components/question/NumericAnswerInput";
import { RotationAnswerInput, type Rotation } from "@/components/question/RotationAnswerInput";
import { WorkedErrorClassificationAnswerInput } from "@/components/question/WorkedErrorClassificationAnswerInput";

/**
 * `magnetism.interpret_field_direction`'s answer domain is a field-rotation
 * sense (clockwise/counterclockwise -- see @alp/calculation-engine's
 * `interpretFieldDirection` executor), not a screen direction, even though
 * its blueprint is tagged answer.type "direction" alongside
 * `magnetism.interpret_force_direction` (which genuinely is up/down/left/
 * right). Must be checked before the generic "direction" case below --
 * mirrors the same special case already proven in practice.tsx.
 */
const ROTATION_DOMAIN_BLUEPRINT_IDS: ReadonlySet<string> = new Set(["magnetism.interpret_field_direction"]);

/**
 * `diagram_region` blueprints (`series.interpret_diagram`,
 * `parallel.identify_topology`, `comparison.trace_current_path`) have no
 * governed `answer.options` -- @alp/calculation-engine's own executors are
 * the sole source of truth for the answer's value domain, and every one of
 * them draws from exactly this same fixed, closed vocabulary of three
 * circuit-topology descriptions (confirmed: no other "region-*" value is
 * emitted anywhere in the engine -- see families/series-resistance.ts,
 * families/parallel-resistance.ts, families/comparison.ts). Presented as a
 * small multiple-choice over that governed vocabulary: not invented
 * content, not a different answer type, and no schema change required.
 */
const DIAGRAM_REGION_OPTIONS: readonly MultipleChoiceOption[] = [
  { value: "region-full-loop", label: "A single loop, with every component in one path" },
  { value: "region-multiple-branches", label: "Multiple branches, connected across the same two points" },
  { value: "region-multi-path", label: "More than one current path from the supply and back" },
];

function requireFormulaFamily(blueprint: QuestionBlueprint, formulaFamily: FormulaFamily | null): FormulaFamily {
  if (!formulaFamily) {
    throw new Error(
      `answer-input-dispatch: blueprint "${blueprint.id}" (answer type "${blueprint.answer.type}") needs a governed formula family to present its answer input, but none was resolved for this step`,
    );
  }
  return formulaFamily;
}

/**
 * Unit symbol for the blueprint's answered quantity, from the governed
 * formula family's own variable definitions.
 *
 * CC-12H: a small number of blueprints (`charge.calculate`,
 * `waveform.calculate_frequency_from_period`) genuinely ask for either of
 * two different quantities depending on which variable a given generated
 * instance leaves unknown (e.g. "find the current" vs "find the charge")
 * -- their static `answer.quantity` is a deliberately compound
 * placeholder (`"charge_or_current"`) that can never match any single
 * variable's own `quantity`, by design, not by omission. When that direct
 * lookup fails, the generated instance's own `target_variable` parameter
 * (the same convention every such executor already uses -- see
 * families/charge.ts, families/waveform.ts) names the actual resolved
 * variable for THIS instance; falling back to a symbol lookup against it
 * resolves the real unit without the answer-input layer needing to know
 * which specific blueprints vary their target.
 */
export function unitSymbolForAnswer(blueprint: QuestionBlueprint, formulaFamily: FormulaFamily | null, instance?: GeneratedQuestionInstance): string {
  const quantity = blueprint.answer.quantity;
  if (!quantity) return "";
  const family = requireFormulaFamily(blueprint, formulaFamily);
  const byQuantity = family.variables.find((v) => v.quantity === quantity);
  if (byQuantity) return byQuantity.unitSymbol;
  const targetVariable = instance?.parameters.target_variable;
  if (typeof targetVariable === "string") {
    const bySymbol = family.variables.find((v) => v.symbol === targetVariable);
    if (bySymbol) return bySymbol.unitSymbol;
  }
  throw new Error(`answer-input-dispatch: governed formula family has no variable for quantity "${quantity}" (blueprint "${blueprint.id}")`);
}

export interface AnswerInputDispatchProps {
  readonly blueprint: QuestionBlueprint;
  readonly instance: GeneratedQuestionInstance;
  readonly formulaFamily: FormulaFamily | null;
  readonly onSubmit: (value: AnswerValue) => void;
  readonly disabled?: boolean;
  readonly testID?: string;
}

/** The full governed answer-type domain (content-schema's `answerTypeSchema`), independent of which of them this dispatch currently implements. */
export type AnswerType = QuestionBlueprint["answer"]["type"];

type AnswerInputRenderer = (props: AnswerInputDispatchProps) => React.JSX.Element;

/**
 * CC-12H (task brief §4): a declarative answerType -> renderer registry,
 * replacing a `switch` whose `default: throw` could silently drift from
 * content-schema's `answerTypeSchema` (a new schema-level answer type
 * shipping in production content with no matching case here, discovered
 * only by a learner's crash -- exactly what happened with `diagram_region`
 * in the parallel-resistor lesson). `SUPPORTED_ANSWER_TYPES` below is
 * derived from this object's own keys, so it can never drift from what is
 * actually implemented; `mobile-runtime-contract-audit.test.ts` proves
 * every answer type any PRODUCTION lesson blueprint actually references is
 * a member of this set, against the real bundled content release, not a
 * hand-maintained list. Exactly mirrors `DiagramRenderer.tsx`'s own
 * `REGISTRY`/`SUPPORTED_DIAGRAM_BLUEPRINT_IDS`/`resolveDiagramComponent`
 * pattern, already established for diagram-blueprint coverage.
 *
 * `integer`/`decimal`/`fraction`/`ordering` are schema-defined but, as of
 * this audit, referenced by zero blueprints anywhere in the governed
 * corpus (not just the current production release) -- deliberately left
 * unregistered here rather than given placeholder renderers nobody can
 * exercise; `validate-lesson-plan.ts`'s "answer type has native mobile
 * support" gate fails content authoring loudly if any blueprint ever
 * starts using one before a real renderer is added.
 */
const ANSWER_INPUT_REGISTRY: Readonly<Partial<Record<AnswerType, AnswerInputRenderer>>> = {
  quantity: ({ blueprint, instance, formulaFamily, onSubmit, disabled, testID }) => (
    <NumericAnswerInput unitSymbol={unitSymbolForAnswer(blueprint, formulaFamily, instance)} onSubmit={(value) => onSubmit(value)} disabled={disabled} testID={testID} />
  ),

  multiple_choice: ({ blueprint, instance, onSubmit, disabled, testID }) => {
    const options: readonly MultipleChoiceOption[] = resolveAnswerOptions(blueprint, instance);
    return <MultipleChoiceAnswerInput options={options} onSubmit={(value) => onSubmit(value)} disabled={disabled} testID={testID} />;
  },

  // CC-12G: the answer choice is the actual rearranged equation for each
  // variable ("V = I × R"), not the bare variable name ("V (voltage)") --
  // the interaction asks "which equation should you use", so the options
  // must be equations. Falls back to the variable-name label only if this
  // family has no governed form for a variable (never true for any family
  // currently reachable from a real lesson, but keeps this generic
  // dispatch from throwing for a family authored without full forms
  // coverage).
  formula_selection: ({ blueprint, instance, formulaFamily, onSubmit, disabled, testID }) => {
    const family = requireFormulaFamily(blueprint, formulaFamily);
    const baseOptions: readonly MultipleChoiceOption[] = family.variables.map((v) => {
      const form = family.forms.find((f) => f.target === v.symbol);
      return { value: v.symbol, label: form ? `${v.symbol} = ${formatExpressionInline(form.expression)}` : `${v.symbol} (${v.name})` };
    });
    const options = shuffleDeterministic(createRngForDomain(instance.identity, "formulaOptions"), baseOptions);
    return <MultipleChoiceAnswerInput options={options} onSubmit={(value) => onSubmit(value)} disabled={disabled} testID={testID} />;
  },

  multi_select: ({ blueprint, instance, formulaFamily, onSubmit, disabled, testID }) => {
    const variables = requireFormulaFamily(blueprint, formulaFamily).variables;
    const baseChoices = variables.map((v) => ({ value: v.unitSymbol, label: v.unitSymbol }));
    const baseRows: readonly MatchRow[] = variables.map((v) => ({
      key: v.symbol,
      prompt: `${v.symbol} (${v.name})`,
      // CC-12G: each row's own choice order is shuffled independently (a
      // distinct domain per row key) so the correct unit isn't always in
      // the same position across every row of the same instance.
      choices: shuffleDeterministic(createRngForDomain(instance.identity, `matchChoices:${v.symbol}`), baseChoices),
      encode: (chosen) => `${v.symbol}:${chosen}`,
    }));
    const rows = shuffleDeterministic(createRngForDomain(instance.identity, "matchRows"), baseRows);
    return <MultiSelectMatchAnswerInput rows={rows} onSubmit={(values) => onSubmit(values)} disabled={disabled} testID={testID} />;
  },

  worked_error_classification: ({ blueprint, instance, onSubmit, disabled, testID }) => (
    <WorkedErrorClassificationAnswerInput
      shownWorkingLines={resolveShownWorkingLines(blueprint, instance)}
      options={resolveAnswerOptions(blueprint, instance)}
      onSubmit={(value) => onSubmit(value)}
      disabled={disabled}
      testID={testID}
    />
  ),

  diagram_region: ({ instance, onSubmit, disabled, testID }) => {
    const options = shuffleDeterministic(createRngForDomain(instance.identity, "diagramRegionOptions"), DIAGRAM_REGION_OPTIONS);
    return <MultipleChoiceAnswerInput options={options} onSubmit={(value) => onSubmit(value)} disabled={disabled} testID={testID} />;
  },

  direction: ({ blueprint, onSubmit, disabled, testID }) =>
    ROTATION_DOMAIN_BLUEPRINT_IDS.has(blueprint.id) ? (
      <RotationAnswerInput onSubmit={(value: Rotation) => onSubmit(value)} disabled={disabled} testID={testID} />
    ) : (
      <DirectionAnswerInput onSubmit={(value: Direction) => onSubmit(value)} disabled={disabled} testID={testID} />
    ),
};

/** Every answer type with a registered native renderer -- the completeness audit's source of truth, inspectable without parsing a switch. */
export const SUPPORTED_ANSWER_TYPES: readonly AnswerType[] = Object.freeze(
  (Object.keys(ANSWER_INPUT_REGISTRY) as AnswerType[]).sort(),
);

/** Renders the answer input appropriate to this blueprint's governed `answer.type`, wired to submit an AnswerValue in the exact shape @alp/calculation-engine's evaluateAnswer expects. */
export function AnswerInputDispatch(props: AnswerInputDispatchProps): React.JSX.Element {
  const renderer = ANSWER_INPUT_REGISTRY[props.blueprint.answer.type];
  if (!renderer) {
    throw new Error(`answer-input-dispatch: no native input registered for answer type "${props.blueprint.answer.type}"`);
  }
  return renderer(props);
}

/**
 * CC-12H: dev-only helper resolving the objectively correct submission
 * value AND the exact learner-facing label a QA walker should look for and
 * tap, for any graded step -- built from the SAME per-answer-type option/
 * label construction the real renderers above use (never a second, drifting
 * copy of the label logic). Consumed only by the Lesson Player's pre-
 * existing dev-only debug overlay (`lesson-player.tsx`, gated by
 * `__DEV__ && debugOverlayEnabled`, default off, toggled only from the
 * `__DEV__`-only `dev-lesson-qa` screen -- never reachable by a real
 * learner) so the CC-12H runtime QA walker (tools/qa/) can read the
 * ground-truth answer directly off the live screen instead of trying to
 * replicate learner-identity/RNG seeding offline.
 */
export interface DevDebugAnswer {
  /** JSON-encoded `instance.expected.value` -- a number, a string, or a string array. */
  readonly expectedValue: string;
  /** The exact accessibilityLabel/text a QA walker should tap; `null` for free-text "quantity" entry (no button to find). */
  readonly tapLabel: string | null;
}

export function resolveDevDebugAnswer(blueprint: QuestionBlueprint, instance: GeneratedQuestionInstance, formulaFamily: FormulaFamily | null): DevDebugAnswer {
  const expectedValue = JSON.stringify(instance.expected.value);
  const value = instance.expected.value;

  switch (blueprint.answer.type) {
    case "quantity":
      return { expectedValue, tapLabel: null };

    case "multiple_choice":
    case "worked_error_classification": {
      const match = resolveAnswerOptions(blueprint, instance).find((o) => o.value === value);
      return { expectedValue, tapLabel: match?.label ?? null };
    }

    case "diagram_region": {
      const match = DIAGRAM_REGION_OPTIONS.find((o) => o.value === value);
      return { expectedValue, tapLabel: match?.label ?? null };
    }

    case "formula_selection": {
      const family = requireFormulaFamily(blueprint, formulaFamily);
      const variable = family.variables.find((v) => v.symbol === value);
      if (!variable) return { expectedValue, tapLabel: null };
      const form = family.forms.find((f) => f.target === variable.symbol);
      return { expectedValue, tapLabel: form ? `${variable.symbol} = ${formatExpressionInline(form.expression)}` : `${variable.symbol} (${variable.name})` };
    }

    case "direction": {
      if (typeof value !== "string") return { expectedValue, tapLabel: null };
      if (ROTATION_DOMAIN_BLUEPRINT_IDS.has(blueprint.id)) {
        const label = value === "clockwise" ? "Clockwise" : value === "counterclockwise" ? "Counterclockwise" : null;
        return { expectedValue, tapLabel: label && `Field direction: ${label}` };
      }
      const label = ({ up: "Up", down: "Down", left: "Left", right: "Right" } as Record<string, string>)[value] ?? null;
      return { expectedValue, tapLabel: label && `Force acts ${label}` };
    }

    case "multi_select": {
      const family = requireFormulaFamily(blueprint, formulaFamily);
      if (!Array.isArray(value)) return { expectedValue, tapLabel: null };
      const labels = (value as readonly string[]).map((entry) => {
        const [symbol, unitSymbol] = entry.split(":");
        const variable = family.variables.find((v) => v.symbol === symbol);
        return variable ? `${variable.symbol} (${variable.name}): ${unitSymbol}` : entry;
      });
      return { expectedValue, tapLabel: labels.join(" || ") };
    }

    default:
      return { expectedValue, tapLabel: null };
  }
}
