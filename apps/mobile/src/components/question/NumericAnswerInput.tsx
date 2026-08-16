/**
 * CC-05C: native numeric answer entry for `quantity`/`numeric_tolerance`
 * question blueprints -- decimal-pad keyboard, no formula-syntax typing
 * required (task brief §13), unit shown alongside the field rather than
 * expected as part of the typed value.
 */
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { color, minTouchTarget, radius, spacing, typography } from "@/lib/tokens";

export interface NumericAnswerInputProps {
  readonly unitSymbol: string;
  readonly onSubmit: (value: number) => void;
  readonly disabled?: boolean;
  readonly testID?: string;
}

export function NumericAnswerInput({ unitSymbol, onSubmit, disabled, testID }: NumericAnswerInputProps): React.JSX.Element {
  const [text, setText] = useState("");
  const parsed = Number(text);
  const canSubmit = !disabled && text.trim().length > 0 && Number.isFinite(parsed);

  return (
    <View style={styles.container} testID={testID}>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={text}
          onChangeText={setText}
          keyboardType="decimal-pad"
          placeholder="0"
          placeholderTextColor={color.textSecondary}
          editable={!disabled}
          accessibilityLabel={`Your answer, in ${unitSymbol}`}
          accessibilityHint="Enter a number using the numeric keypad"
        />
        <Text style={styles.unit}>{unitSymbol}</Text>
      </View>
      <Pressable
        style={({ pressed }) => [styles.submitButton, (!canSubmit || pressed) && styles.submitButtonDisabled]}
        disabled={!canSubmit}
        onPress={() => onSubmit(parsed)}
        accessibilityRole="button"
        accessibilityLabel="Submit answer"
        accessibilityState={{ disabled: !canSubmit }}
      >
        <Text style={styles.submitText}>Submit</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: spacing.sm, width: "100%" },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: color.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    backgroundColor: color.background,
  },
  input: {
    flex: 1,
    minHeight: minTouchTarget,
    ...typography.title,
    fontSize: 22,
    color: color.text,
  },
  unit: { ...typography.body, color: color.textSecondary },
  submitButton: {
    minHeight: minTouchTarget,
    borderRadius: radius.md,
    backgroundColor: color.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  submitButtonDisabled: { opacity: 0.4 },
  submitText: { ...typography.body, color: "#fff", fontWeight: "700" },
});
