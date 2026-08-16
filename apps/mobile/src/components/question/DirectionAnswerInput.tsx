/**
 * CC-05C: native four-way direction answer entry for `direction`/
 * `direction_match` question blueprints (magnetism.interpret_force_direction).
 * Arrow glyphs are paired with text labels throughout -- direction meaning
 * never depends on the glyph alone (design doc §15).
 */
import { Pressable, StyleSheet, Text, View } from "react-native";

import { color, minTouchTarget, radius, spacing, typography } from "@/lib/tokens";

export type Direction = "up" | "down" | "left" | "right";

const DIRECTIONS: readonly { value: Direction; glyph: string; label: string }[] = [
  { value: "up", glyph: "↑", label: "Up" },
  { value: "down", glyph: "↓", label: "Down" },
  { value: "left", glyph: "←", label: "Left" },
  { value: "right", glyph: "→", label: "Right" },
];

export interface DirectionAnswerInputProps {
  readonly onSubmit: (value: Direction) => void;
  readonly disabled?: boolean;
  readonly testID?: string;
}

export function DirectionAnswerInput({ onSubmit, disabled, testID }: DirectionAnswerInputProps): React.JSX.Element {
  return (
    <View style={styles.grid} testID={testID} accessibilityRole="radiogroup">
      {DIRECTIONS.map((d) => (
        <Pressable
          key={d.value}
          style={({ pressed }) => [styles.button, pressed && styles.pressed, disabled && styles.disabled]}
          disabled={disabled}
          onPress={() => onSubmit(d.value)}
          accessibilityRole="button"
          accessibilityLabel={`Force acts ${d.label}`}
        >
          <Text style={styles.glyph}>{d.glyph}</Text>
          <Text style={styles.label}>{d.label}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm, justifyContent: "center" },
  button: {
    minWidth: minTouchTarget * 1.4,
    minHeight: minTouchTarget * 1.4,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: color.border,
    backgroundColor: color.surface,
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },
  pressed: { opacity: 0.8 },
  disabled: { opacity: 0.4 },
  glyph: { fontSize: 24, color: color.accent },
  label: { ...typography.caption, color: color.text },
});
