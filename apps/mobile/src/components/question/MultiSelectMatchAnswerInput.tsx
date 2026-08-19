/**
 * Native "match each item to one of several choices" answer entry for
 * `multi_select`/`set_equality` question blueprints (e.g.
 * `ohms_law.match_variables_units`: match each variable to its correct
 * unit). Each row's choices are real governed option values (e.g. every
 * variable's real unit symbol, used as each other's distractors) --
 * never fabricated text.
 */
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { color, minTouchTarget, radius, spacing, typography } from "@/lib/tokens";

export interface MatchRow {
  readonly key: string;
  readonly prompt: string;
  readonly choices: readonly { readonly value: string; readonly label: string }[];
  /** The value to encode for this row once picked, e.g. "V:V" -- the governed pair format the marking contract expects. */
  readonly encode: (chosenValue: string) => string;
}

export interface MultiSelectMatchAnswerInputProps {
  readonly rows: readonly MatchRow[];
  readonly onSubmit: (values: readonly string[]) => void;
  readonly disabled?: boolean;
  readonly testID?: string;
}

export function MultiSelectMatchAnswerInput({ rows, onSubmit, disabled, testID }: MultiSelectMatchAnswerInputProps): React.JSX.Element {
  const [picked, setPicked] = useState<Readonly<Record<string, string>>>({});
  const allPicked = rows.every((row) => picked[row.key] !== undefined);
  const submitDisabled = !allPicked || Boolean(disabled);

  return (
    <View style={styles.container} testID={testID}>
      {rows.map((row) => (
        <View key={row.key} style={styles.row}>
          <Text style={styles.prompt}>{row.prompt}</Text>
          <View style={styles.choiceGroup} accessibilityRole="radiogroup">
            {row.choices.map((choice) => {
              const selected = picked[row.key] === choice.value;
              return (
                <Pressable
                  key={choice.value}
                  style={({ pressed }) => [styles.choice, selected && styles.choiceSelected, (pressed || disabled) && styles.disabled]}
                  disabled={disabled}
                  onPress={() => setPicked((prev) => ({ ...prev, [row.key]: choice.value }))}
                  accessibilityRole="button"
                  accessibilityLabel={`${row.prompt}: ${choice.label}`}
                  accessibilityState={{ selected }}
                >
                  <Text style={[styles.choiceLabel, selected && styles.choiceLabelSelected]}>{choice.label}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      ))}
      <Pressable
        style={({ pressed }) => [styles.submitButton, (submitDisabled || pressed) && styles.disabled]}
        disabled={submitDisabled}
        onPress={() => onSubmit(rows.map((row) => row.encode(picked[row.key]!)))}
        accessibilityRole="button"
        accessibilityLabel="Submit answer"
        accessibilityState={{ disabled: submitDisabled }}
      >
        <Text style={styles.submitText}>Submit</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: spacing.md, width: "100%" },
  row: { gap: spacing.xs },
  prompt: { ...typography.body, color: color.text, fontWeight: "600" },
  choiceGroup: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  choice: {
    minHeight: minTouchTarget,
    minWidth: minTouchTarget,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: color.border,
    backgroundColor: color.surface,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.md,
  },
  choiceSelected: { borderColor: color.accent, backgroundColor: "#16223A" },
  disabled: { opacity: 0.5 },
  choiceLabel: { ...typography.body, color: color.text },
  choiceLabelSelected: { color: color.accent, fontWeight: "700" },
  submitButton: {
    minHeight: minTouchTarget,
    borderRadius: radius.md,
    backgroundColor: color.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  submitText: { ...typography.body, color: "#fff", fontWeight: "700" },
});
