/**
 * CC-05C: renders a formula family's governed variable definitions
 * (@alp/content-schema's VariableDefinition -- symbol/name/unit) as a
 * legend, per design doc §7.2's "formula presentation contract" (variable
 * definitions are part of the governed formula family, not invented UI
 * copy).
 */
import type { VariableDefinition } from "@alp/content-schema";
import { StyleSheet, Text, View } from "react-native";

import { color, radius, spacing, typography } from "@/lib/tokens";

export interface VariableKeyProps {
  readonly variables: readonly VariableDefinition[];
  readonly testID?: string;
}

export function VariableKey({ variables, testID }: VariableKeyProps): React.JSX.Element {
  return (
    <View style={styles.container} testID={testID} accessibilityRole="list">
      {variables.map((v) => (
        <View
          key={v.symbol}
          style={styles.row}
          accessible
          accessibilityRole="text"
          accessibilityLabel={`${v.symbol} stands for ${v.name}, measured in ${v.unitName}, symbol ${v.unitSymbol}`}
        >
          <View style={styles.symbolBadge}>
            <Text style={styles.symbolText}>{v.symbol}</Text>
          </View>
          <Text style={styles.nameText}>
            {v.name} <Text style={styles.unitText}>({v.unitName}, {v.unitSymbol})</Text>
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: spacing.xs },
  row: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  symbolBadge: {
    minWidth: 32,
    minHeight: 32,
    borderRadius: radius.sm,
    backgroundColor: color.surface,
    borderWidth: 1,
    borderColor: color.border,
    alignItems: "center",
    justifyContent: "center",
  },
  symbolText: { ...typography.body, color: color.accent, fontWeight: "700" },
  nameText: { ...typography.body, color: color.text },
  unitText: { ...typography.caption, color: color.textSecondary },
});
