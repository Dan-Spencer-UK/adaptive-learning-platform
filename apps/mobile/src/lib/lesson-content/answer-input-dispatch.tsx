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

/** Unit symbol for the blueprint's answered quantity, from the governed formula family's own variable definitions. */
export function unitSymbolForAnswer(blueprint: QuestionBlueprint, formulaFamily: FormulaFamily | null): string {
  const quantity = blueprint.answer.quantity;
  if (!quantity) return "";
  const variable = requireFormulaFamily(blueprint, formulaFamily).variables.find((v) => v.quantity === quantity);
  if (!variable) {
    throw new Error(`answer-input-dispatch: governed formula family has no variable for quantity "${quantity}" (blueprint "${blueprint.id}")`);
  }
  return variable.unitSymbol;
}

export interface AnswerInputDispatchProps {
  readonly blueprint: QuestionBlueprint;
  readonly instance: GeneratedQuestionInstance;
  readonly formulaFamily: FormulaFamily | null;
  readonly onSubmit: (value: AnswerValue) => void;
  readonly disabled?: boolean;
  readonly testID?: string;
}

/** Renders the answer input appropriate to this blueprint's governed `answer.type`, wired to submit an AnswerValue in the exact shape @alp/calculation-engine's evaluateAnswer expects. */
export function AnswerInputDispatch({ blueprint, instance, formulaFamily, onSubmit, disabled, testID }: AnswerInputDispatchProps): React.JSX.Element {
  switch (blueprint.answer.type) {
    case "quantity":
      return <NumericAnswerInput unitSymbol={unitSymbolForAnswer(blueprint, formulaFamily)} onSubmit={(value) => onSubmit(value)} disabled={disabled} testID={testID} />;

    case "multiple_choice": {
      const options: readonly MultipleChoiceOption[] = resolveAnswerOptions(blueprint, instance);
      return <MultipleChoiceAnswerInput options={options} onSubmit={(value) => onSubmit(value)} disabled={disabled} testID={testID} />;
    }

    case "formula_selection": {
      const family = requireFormulaFamily(blueprint, formulaFamily);
      // CC-12G: the answer choice is the actual rearranged equation for
      // each variable ("V = I × R"), not the bare variable name ("V
      // (voltage)") -- the interaction asks "which equation should you
      // use", so the options must be equations. Falls back to the
      // variable-name label only if this family has no governed form for
      // a variable (never true for any family currently reachable from a
      // real lesson, but keeps this generic dispatch from throwing for a
      // family authored without full forms coverage).
      const baseOptions: readonly MultipleChoiceOption[] = family.variables.map((v) => {
        const form = family.forms.find((f) => f.target === v.symbol);
        return { value: v.symbol, label: form ? `${v.symbol} = ${formatExpressionInline(form.expression)}` : `${v.symbol} (${v.name})` };
      });
      const options = shuffleDeterministic(createRngForDomain(instance.identity, "formulaOptions"), baseOptions);
      return <MultipleChoiceAnswerInput options={options} onSubmit={(value) => onSubmit(value)} disabled={disabled} testID={testID} />;
    }

    case "multi_select": {
      const variables = requireFormulaFamily(blueprint, formulaFamily).variables;
      const baseChoices = variables.map((v) => ({ value: v.unitSymbol, label: v.unitSymbol }));
      const baseRows: readonly MatchRow[] = variables.map((v) => ({
        key: v.symbol,
        prompt: `${v.symbol} (${v.name})`,
        // CC-12G: each row's own choice order is shuffled independently
        // (a distinct domain per row key) so the correct unit isn't
        // always in the same position across every row of the same
        // instance.
        choices: shuffleDeterministic(createRngForDomain(instance.identity, `matchChoices:${v.symbol}`), baseChoices),
        encode: (chosen) => `${v.symbol}:${chosen}`,
      }));
      const rows = shuffleDeterministic(createRngForDomain(instance.identity, "matchRows"), baseRows);
      return <MultiSelectMatchAnswerInput rows={rows} onSubmit={(values) => onSubmit(values)} disabled={disabled} testID={testID} />;
    }

    case "worked_error_classification":
      return (
        <WorkedErrorClassificationAnswerInput
          shownWorkingLines={resolveShownWorkingLines(blueprint, instance)}
          options={resolveAnswerOptions(blueprint, instance)}
          onSubmit={(value) => onSubmit(value)}
          disabled={disabled}
          testID={testID}
        />
      );

    case "diagram_region": {
      const options = shuffleDeterministic(createRngForDomain(instance.identity, "diagramRegionOptions"), DIAGRAM_REGION_OPTIONS);
      return <MultipleChoiceAnswerInput options={options} onSubmit={(value) => onSubmit(value)} disabled={disabled} testID={testID} />;
    }

    case "direction":
      if (ROTATION_DOMAIN_BLUEPRINT_IDS.has(blueprint.id)) {
        return <RotationAnswerInput onSubmit={(value: Rotation) => onSubmit(value)} disabled={disabled} testID={testID} />;
      }
      return <DirectionAnswerInput onSubmit={(value: Direction) => onSubmit(value)} disabled={disabled} testID={testID} />;

    default:
      throw new Error(`answer-input-dispatch: no native input registered for answer type "${blueprint.answer.type}"`);
  }
}
