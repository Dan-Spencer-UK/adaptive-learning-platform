/**
 * Generic native multiple-choice answer entry for `multiple_choice`
 * question blueprints (e.g. `ohms_law.plausibility_check`). Mirrors
 * DirectionAnswerInput's button-grid pattern, generalised to arbitrary
 * option/label pairs rather than a fixed four-way direction vocabulary.
 */
import { Pressable, StyleSheet, Text, View } from "react-native";

import { color, minTouchTarget, radius, spacing, typography } from "@/lib/tokens";

export interface MultipleChoiceOption {
  readonly value: string;
  readonly label: string;
}

export interface MultipleChoiceAnswerInputProps {
  readonly options: readonly MultipleChoiceOption[];
  readonly onSubmit: (value: string) => void;
  readonly disabled?: boolean;
  readonly testID?: string;
}

export function MultipleChoiceAnswerInput({ options, onSubmit, disabled, testID }: MultipleChoiceAnswerInputProps): React.JSX.Element {
  return (
    <View style={styles.list} testID={testID} accessibilityRole="radiogroup">
      {options.map((option) => (
        <Pressable
          key={option.value}
          style={({ pressed }) => [styles.button, pressed && styles.pressed, disabled && styles.disabled]}
          disabled={disabled}
          onPress={() => onSubmit(option.value)}
          accessibilityRole="button"
          accessibilityLabel={option.label}
        >
          <Text style={styles.label}>{option.label}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { gap: spacing.sm, width: "100%" },
  button: {
    minHeight: minTouchTarget,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: color.border,
    backgroundColor: color.surface,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  pressed: { opacity: 0.8 },
  disabled: { opacity: 0.4 },
  label: { ...typography.body, color: color.text, fontWeight: "600" },
});
