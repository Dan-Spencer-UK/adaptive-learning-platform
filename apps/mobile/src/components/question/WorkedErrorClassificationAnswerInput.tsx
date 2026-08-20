/**
 * Native error-classification answer entry for `worked_error_classification`
 * question blueprints. Shows the flawed worked calculation the learner
 * must diagnose (rendered from the blueprint's governed presentation
 * templates by the caller, never fabricated), then the classification
 * choices. CC-06D (Correction C): the classification vocabulary AND its
 * learner-facing labels are governed content (`answer.options` +
 * `presentation.answerOptionLabels`) supplied via `options` -- this
 * component owns layout/interaction only, never factual copy.
 */
import { Pressable, StyleSheet, Text, View } from "react-native";

import { color, minTouchTarget, radius, spacing, typography } from "@/lib/tokens";

export interface WorkedErrorClassificationAnswerInputProps {
  readonly shownWorkingLines: readonly string[];
  /** Governed classification options in governed order: value submitted to marking, label shown to the learner. */
  readonly options: readonly { readonly value: string; readonly label: string }[];
  readonly onSubmit: (value: string) => void;
  readonly disabled?: boolean;
  readonly testID?: string;
}

export function WorkedErrorClassificationAnswerInput({
  shownWorkingLines,
  options,
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
        {options.map((c) => (
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
