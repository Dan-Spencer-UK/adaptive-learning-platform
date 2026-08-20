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
import { resolveAnswerOptions, resolveShownWorkingLines } from "@alp/calculation-engine";
import type { FormulaFamily, QuestionBlueprint } from "@alp/content-schema";

import { DirectionAnswerInput, type Direction } from "@/components/question/DirectionAnswerInput";
import { MultiSelectMatchAnswerInput, type MatchRow } from "@/components/question/MultiSelectMatchAnswerInput";
import { MultipleChoiceAnswerInput, type MultipleChoiceOption } from "@/components/question/MultipleChoiceAnswerInput";
import { NumericAnswerInput } from "@/components/question/NumericAnswerInput";
import { WorkedErrorClassificationAnswerInput } from "@/components/question/WorkedErrorClassificationAnswerInput";

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
      const options: readonly MultipleChoiceOption[] = resolveAnswerOptions(blueprint);
      return <MultipleChoiceAnswerInput options={options} onSubmit={(value) => onSubmit(value)} disabled={disabled} testID={testID} />;
    }

    case "formula_selection": {
      const family = requireFormulaFamily(blueprint, formulaFamily);
      const options: readonly MultipleChoiceOption[] = family.variables.map((v) => ({
        value: v.symbol,
        label: `${v.symbol} (${v.name})`,
      }));
      return <MultipleChoiceAnswerInput options={options} onSubmit={(value) => onSubmit(value)} disabled={disabled} testID={testID} />;
    }

    case "multi_select": {
      const variables = requireFormulaFamily(blueprint, formulaFamily).variables;
      const choices = variables.map((v) => ({ value: v.unitSymbol, label: v.unitSymbol }));
      const rows: readonly MatchRow[] = variables.map((v) => ({
        key: v.symbol,
        prompt: `${v.symbol} (${v.name})`,
        choices,
        encode: (chosen) => `${v.symbol}:${chosen}`,
      }));
      return <MultiSelectMatchAnswerInput rows={rows} onSubmit={(values) => onSubmit(values)} disabled={disabled} testID={testID} />;
    }

    case "worked_error_classification":
      return (
        <WorkedErrorClassificationAnswerInput
          shownWorkingLines={resolveShownWorkingLines(blueprint, instance)}
          options={resolveAnswerOptions(blueprint)}
          onSubmit={(value) => onSubmit(value)}
          disabled={disabled}
          testID={testID}
        />
      );

    case "direction":
      return <DirectionAnswerInput onSubmit={(value: Direction) => onSubmit(value)} disabled={disabled} testID={testID} />;

    default:
      throw new Error(`answer-input-dispatch: no native input registered for answer type "${blueprint.answer.type}"`);
  }
}
