/**
 * The lesson-completion experience (task brief §36): communicates real
 * governed progress -- duration and the capabilities the completion
 * criteria call for -- never fabricated metrics ("concepts strengthened"/
 * "weaknesses identified" would require an evidence-aggregation
 * capability this repository does not yet have; Product Principles
 * 10/11: evidence is not mastery, one session does not determine
 * learner state). No fake XP, streak, or score.
 */
import type { LessonPlan } from "@alp/content-schema";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { color, minTouchTarget, radius, spacing, typography } from "@/lib/tokens";

export interface LessonCompletionViewProps {
  readonly lesson: LessonPlan;
  readonly onContinue: () => void;
  readonly testID?: string;
}

export function LessonCompletionView({ lesson, onContinue, testID }: LessonCompletionViewProps): React.JSX.Element {
  return (
    <View style={styles.container} testID={testID}>
      <Text style={styles.title} accessibilityRole="header">
        Lesson complete
      </Text>
      <Text style={styles.meta}>{lesson.title}</Text>
      <Text style={styles.meta}>~{lesson.estimatedDurationMinutes} min</Text>
      <Text style={styles.summary}>{lesson.completionCriteria.exitSummary}</Text>
      <Pressable
        style={({ pressed }) => [styles.continueButton, pressed && styles.pressed]}
        onPress={onContinue}
        accessibilityRole="button"
        accessibilityLabel="Continue learning"
      >
        <Text style={styles.continueText}>Continue learning</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: spacing.md, padding: spacing.lg, alignItems: "center" },
  title: { ...typography.title, color: color.success },
  meta: { ...typography.body, color: color.textSecondary },
  summary: { ...typography.body, color: color.text, textAlign: "center" },
  continueButton: {
    minHeight: minTouchTarget,
    minWidth: 200,
    borderRadius: radius.md,
    backgroundColor: color.accent,
    alignItems: "center",
    justifyContent: "center",
    marginTop: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  pressed: { opacity: 0.85 },
  continueText: { ...typography.body, color: "#fff", fontWeight: "700" },
});
