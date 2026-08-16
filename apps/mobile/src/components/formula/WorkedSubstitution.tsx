/**
 * CC-05C: renders a deterministic worked-example sequence --
 *
 *   I = V / R
 *   I = 24 / 6
 *   I = 4 A
 *
 * -- entirely from @alp/calculation-engine's `WorkedExampleInstance`
 * (design doc §9/§2.4: every value comes from engine/worked-example data,
 * never presentation-only arithmetic invented by this component). The
 * governed `steps` array (show_formula/show_rearrangement/
 * substitute_values/calculate/show_answer_with_unit/sanity_check_result)
 * controls which lines are shown, per blueprint.
 */
import type { FormulaFamily } from "@alp/content-schema";
import type { WorkedExampleInstance } from "@alp/calculation-engine";
import { StyleSheet, Text, View } from "react-native";

import { color, spacing, typography } from "@/lib/tokens";
import { substitutionResolver, symbolicResolver } from "@/lib/formula-rendering/format-formula";
import { FormulaEquation } from "./FormulaExpressionView";

export interface WorkedSubstitutionProps {
  readonly formulaFamily: FormulaFamily;
  readonly instance: WorkedExampleInstance;
  readonly testID?: string;
}

export function WorkedSubstitution({ formulaFamily, instance, testID }: WorkedSubstitutionProps): React.JSX.Element {
  const form = formulaFamily.forms.find((f) => f.target === instance.target);
  if (!form) {
    throw new Error(`WorkedSubstitution: formula family "${formulaFamily.id}" has no form for "${instance.target}"`);
  }
  const canonicalForm = formulaFamily.forms.find((f) => f.target === formulaFamily.canonicalTarget);
  const resolveNumbers = substitutionResolver(instance.knownVariables);

  const showsRearrangement = instance.steps.includes("show_rearrangement");
  const showsSubstitution = instance.steps.includes("substitute_values") || instance.steps.includes("calculate");
  const showsAnswer = instance.steps.includes("show_answer_with_unit");
  const showsSanityCheck = instance.steps.includes("sanity_check_result");

  return (
    <View style={styles.container} testID={testID}>
      {showsRearrangement && canonicalForm && canonicalForm.target !== instance.target ? (
        <Text style={styles.note}>Rearranged from the canonical form:</Text>
      ) : null}
      {showsRearrangement && canonicalForm && canonicalForm.target !== instance.target ? (
        <FormulaEquation target={canonicalForm.target} expression={canonicalForm.expression} resolve={symbolicResolver} />
      ) : null}

      <FormulaEquation target={instance.target} expression={form.expression} resolve={symbolicResolver} />

      {showsSubstitution ? (
        <FormulaEquation target={instance.target} expression={form.expression} resolve={resolveNumbers} />
      ) : null}

      {showsAnswer ? (
        <View
          style={styles.answerRow}
          accessible
          accessibilityRole="text"
          accessibilityLabel={`${instance.target} equals ${instance.result} ${instance.unitSymbol}`}
        >
          <Text style={styles.answerText}>
            {instance.target} = {instance.result} {instance.unitSymbol}
          </Text>
        </View>
      ) : null}

      {showsSanityCheck ? (
        <Text style={styles.note}>
          Sanity check: {instance.result} {instance.unitSymbol} is consistent with the values substituted above.
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: spacing.sm },
  note: { ...typography.caption, color: color.textSecondary },
  answerRow: { marginTop: spacing.xs },
  answerText: { ...typography.body, color: color.success, fontWeight: "700" },
});
