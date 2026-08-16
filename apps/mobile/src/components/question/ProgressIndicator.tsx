/**
 * CC-05C: lesson/practice progress indicator (Mobile UX Engineering
 * Standard §5's expected first-class component set includes "lesson
 * progress indicator").
 */
import { StyleSheet, Text, View } from "react-native";

import { color, radius, spacing, typography } from "@/lib/tokens";

export interface ProgressIndicatorProps {
  readonly current: number;
  readonly total: number;
  readonly testID?: string;
}

export function ProgressIndicator({ current, total, testID }: ProgressIndicatorProps): React.JSX.Element {
  const fraction = total > 0 ? Math.min(1, current / total) : 0;
  return (
    <View
      style={styles.container}
      testID={testID}
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={`Question ${current} of ${total}`}
      accessibilityValue={{ min: 0, max: total, now: current }}
    >
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${fraction * 100}%` }]} />
      </View>
      <Text style={styles.label}>
        {current} / {total}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  track: {
    flex: 1,
    height: 6,
    borderRadius: radius.sm,
    backgroundColor: color.surface,
    overflow: "hidden",
  },
  fill: { height: "100%", backgroundColor: color.accent },
  label: { ...typography.caption, color: color.textSecondary },
});
