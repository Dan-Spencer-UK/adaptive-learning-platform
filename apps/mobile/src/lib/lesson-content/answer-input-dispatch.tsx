/**
 * Maps a governed `QuestionBlueprint.answer.type` to the right native
 * answer-input component and value encoding -- a compact reusable
 * dispatch (task brief §14: "Do NOT create eight bespoke screens. Create
 * a compact reusable interaction system driven by governed contracts"),
 * not one hand-wired branch per lesson step.
 */
import type { AnswerValue, GeneratedQuestionInstance } from "@alp/calculation-engine";
import type { FormulaFamily, QuestionBlueprint } from "@alp/content-schema";

import { DirectionAnswerInput, type Direction } from "@/components/question/DirectionAnswerInput";
import { MultiSelectMatchAnswerInput, type MatchRow } from "@/components/question/MultiSelectMatchAnswerInput";
import { MultipleChoiceAnswerInput, type MultipleChoiceOption } from "@/components/question/MultipleChoiceAnswerInput";
import { NumericAnswerInput } from "@/components/question/NumericAnswerInput";
import { WorkedErrorClassificationAnswerInput } from "@/components/question/WorkedErrorClassificationAnswerInput";

const QUANTITY_UNIT_SYMBOLS: Readonly<Record<string, string>> = { voltage: "V", current: "A", resistance: "Ω" };

const MULTIPLE_CHOICE_LABELS: Readonly<Record<string, string>> = {
  plausible: "Plausible",
  too_high: "Too high",
  too_low: "Too low",
};

function num(parameters: GeneratedQuestionInstance["parameters"], key: string): number {
  const value = parameters[key];
  if (typeof value !== "number") throw new Error(`answer-input-dispatch: parameter "${key}" is not a number`);
  return value;
}

function shownWorkingLines(instance: GeneratedQuestionInstance): readonly string[] {
  switch (instance.identity.blueprintId) {
    case "ohms_law.diagnose_wrong_operation":
      return [`V = ${num(instance.parameters, "V")} V, R = ${num(instance.parameters, "R")} Ω`, `I = V x R = ${num(instance.parameters, "shown_I")} A`];
    case "ohms_law.diagnose_rearrangement_error":
      return [`V = ${num(instance.parameters, "V")} V, I = ${num(instance.parameters, "I")} A`, `R = I / V = ${num(instance.parameters, "shown_R")} Ω`];
    default:
      return [];
  }
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
    case "quantity": {
      const unitSymbol = blueprint.answer.canonicalUnit
        ? (QUANTITY_UNIT_SYMBOLS[blueprint.answer.quantity ?? ""] ?? blueprint.answer.canonicalUnit)
        : "";
      return <NumericAnswerInput unitSymbol={unitSymbol} onSubmit={(value) => onSubmit(value)} disabled={disabled} testID={testID} />;
    }

    case "multiple_choice": {
      const options: readonly MultipleChoiceOption[] = (blueprint.answer.options ?? []).map((value) => ({
        value,
        label: MULTIPLE_CHOICE_LABELS[value] ?? value,
      }));
      return <MultipleChoiceAnswerInput options={options} onSubmit={(value) => onSubmit(value)} disabled={disabled} testID={testID} />;
    }

    case "formula_selection": {
      const options: readonly MultipleChoiceOption[] = (formulaFamily?.variables ?? []).map((v) => ({
        value: v.symbol,
        label: `${v.symbol} (${v.name})`,
      }));
      return <MultipleChoiceAnswerInput options={options} onSubmit={(value) => onSubmit(value)} disabled={disabled} testID={testID} />;
    }

    case "multi_select": {
      const variables = formulaFamily?.variables ?? [];
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
          shownWorkingLines={shownWorkingLines(instance)}
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
