/**
 * Native error-classification answer entry for `worked_error_classification`
 * question blueprints (the two Ohm's-law misconception-discrimination
 * blueprints: diagnose_wrong_operation, diagnose_rearrangement_error).
 * Shows the flawed worked calculation the learner must diagnose (built
 * from the real generated instance's own parameters, never fabricated),
 * then a fixed four-way classification choice. The classification
 * vocabulary itself mirrors
 * packages/calculation-engine/src/families/ohms-law.ts's
 * `OhmsLawErrorClassification` union -- not declared in the governed
 * blueprint's `answer.options` (there is none), so, like
 * DirectionAnswerInput's blueprint-specific option set, it is a
 * deliberate small UI-layer constant, not calculation logic.
 */
import { Pressable, StyleSheet, Text, View } from "react-native";

import { color, minTouchTarget, radius, spacing, typography } from "@/lib/tokens";

const CLASSIFICATIONS: readonly { value: string; label: string }[] = [
  { value: "wrong_operation", label: "Used the wrong operation (multiplied instead of divided, or vice versa)" },
  { value: "rearrangement_error", label: "Rearranged the formula incorrectly" },
  { value: "unrelated_symbols", label: "Substituted an unrelated value" },
  { value: "no_error", label: "The working shown is actually correct" },
];

export interface WorkedErrorClassificationAnswerInputProps {
  readonly shownWorkingLines: readonly string[];
  readonly onSubmit: (value: string) => void;
  readonly disabled?: boolean;
  readonly testID?: string;
}

export function WorkedErrorClassificationAnswerInput({
  shownWorkingLines,
  onSubmit,
  disabled,
  testID,
}: WorkedErrorClassificationAnswerInputProps): React.JSX.Element {
  return (
    <View style={styles.container} testID={testID}>
      <View style={styles.workingBox} accessible accessibilityRole="text" accessibilityLabel={`Working shown: ${shownWorkingLines.join(", ")}`}>
        {shownWorkingLines.map((line) => (
          <Text key={line} style={styles.workingLine}>
            {line}
          </Text>
        ))}
      </View>
      <Text style={styles.prompt}>What went wrong?</Text>
      <View style={styles.list} accessibilityRole="radiogroup">
        {CLASSIFICATIONS.map((c) => (
          <Pressable
            key={c.value}
            style={({ pressed }) => [styles.button, pressed && styles.pressed, disabled && styles.disabled]}
            disabled={disabled}
            onPress={() => onSubmit(c.value)}
            accessibilityRole="button"
            accessibilityLabel={c.label}
          >
            <Text style={styles.label}>{c.label}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: spacing.md, width: "100%" },
  workingBox: {
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: color.border,
    backgroundColor: color.background,
    padding: spacing.md,
    gap: spacing.xs,
  },
  workingLine: { ...typography.code, color: color.text },
  prompt: { ...typography.body, color: color.text, fontWeight: "600" },
  list: { gap: spacing.sm },
  button: {
    minHeight: minTouchTarget,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: color.border,
    backgroundColor: color.surface,
    justifyContent: "center",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  pressed: { opacity: 0.8 },
  disabled: { opacity: 0.4 },
  label: { ...typography.body, color: color.text },
});
