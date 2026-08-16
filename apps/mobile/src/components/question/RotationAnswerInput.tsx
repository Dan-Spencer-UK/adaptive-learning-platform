/**
 * CC-05C-DIAGRAM-FIX: native two-way rotation answer entry for
 * `direction`/`direction_match` question blueprints whose answer domain
 * is a field-rotation sense (clockwise/counterclockwise) rather than a
 * screen direction (up/down/left/right) -- see DirectionAnswerInput.tsx
 * for the sibling component covering that domain. Kept as a separate,
 * small component rather than generalising DirectionAnswerInput's fixed
 * four-option layout, since the two answer domains are genuinely
 * different shapes, not a parameterisation of the same one.
 */
import { Pressable, StyleSheet, Text, View } from "react-native";

import { color, minTouchTarget, radius, spacing, typography } from "@/lib/tokens";

export type Rotation = "clockwise" | "counterclockwise";

const ROTATIONS: readonly { value: Rotation; glyph: string; label: string }[] = [
  { value: "clockwise", glyph: "↻", label: "Clockwise" },
  { value: "counterclockwise", glyph: "↺", label: "Counterclockwise" },
];

export interface RotationAnswerInputProps {
  readonly onSubmit: (value: Rotation) => void;
  readonly disabled?: boolean;
  readonly testID?: string;
}

export function RotationAnswerInput({ onSubmit, disabled, testID }: RotationAnswerInputProps): React.JSX.Element {
  return (
    <View style={styles.row} testID={testID} accessibilityRole="radiogroup">
      {ROTATIONS.map((r) => (
        <Pressable
          key={r.value}
          style={({ pressed }) => [styles.button, pressed && styles.pressed, disabled && styles.disabled]}
          disabled={disabled}
          onPress={() => onSubmit(r.value)}
          accessibilityRole="button"
          accessibilityLabel={`Field direction: ${r.label}`}
        >
          <Text style={styles.glyph}>{r.glyph}</Text>
          <Text style={styles.label}>{r.label}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", gap: spacing.sm, justifyContent: "center" },
  button: {
    minWidth: minTouchTarget * 2,
    minHeight: minTouchTarget * 1.4,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: color.border,
    backgroundColor: color.surface,
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
    paddingHorizontal: spacing.sm,
  },
  pressed: { opacity: 0.8 },
  disabled: { opacity: 0.4 },
  glyph: { fontSize: 26, color: color.accent },
  label: { ...typography.caption, color: color.text },
});
