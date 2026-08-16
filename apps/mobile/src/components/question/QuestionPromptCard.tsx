/**
 * CC-05C: the prompt frame every practice question renders inside --
 * title, known-value lines (numeric values live in text, never embedded
 * in a symbolic-only diagram -- design doc §2.8/§14), and a slot for the
 * question's formula/diagram/worked-example representation.
 */
import { StyleSheet, Text, View } from "react-native";

import { color, radius, spacing, typography } from "@/lib/tokens";

export interface QuestionPromptCardProps {
  readonly title: string;
  readonly parameterLines?: readonly string[];
  readonly children?: React.ReactNode;
  readonly testID?: string;
}

export function QuestionPromptCard({ title, parameterLines = [], children, testID }: QuestionPromptCardProps): React.JSX.Element {
  return (
    <View style={styles.card} testID={testID}>
      <Text style={styles.title} accessibilityRole="header">
        {title}
      </Text>
      {parameterLines.length > 0 ? (
        <View style={styles.parameters} accessible accessibilityRole="text" accessibilityLabel={parameterLines.join(", ")}>
          {parameterLines.map((line) => (
            <Text key={line} style={styles.parameterLine}>
              {line}
            </Text>
          ))}
        </View>
      ) : null}
      {children ? <View style={styles.representation}>{children}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: color.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: color.border,
    padding: spacing.md,
    gap: spacing.sm,
  },
  title: { ...typography.title, fontSize: 18, color: color.text },
  parameters: { gap: 2 },
  parameterLine: { ...typography.body, color: color.textSecondary },
  representation: { alignItems: "center", marginTop: spacing.xs },
});
