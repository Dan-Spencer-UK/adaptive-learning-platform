/**
 * CC-05C: immediate local feedback (Mobile UX Engineering Standard §1 --
 * correctness is calculated locally and feedback begins immediately, no
 * network round trip). `misconceptionMessage`, when present, is rendered
 * with the evidence-strength qualifier the caller supplies (see
 * lib/formula-rendering -- callers must never state a learner definitely
 * holds a misconception when CC-05B's own evidence is only "suggestive",
 * per task brief §16).
 */
import { Pressable, StyleSheet, Text, View } from "react-native";

import { color, minTouchTarget, radius, spacing, typography } from "@/lib/tokens";

export interface FeedbackPanelProps {
  readonly correct: boolean;
  readonly detail: string;
  readonly expectedAnswerText: string;
  readonly misconceptionMessage?: string;
  readonly onContinue: () => void;
  readonly continueLabel?: string;
  readonly testID?: string;
}

export function FeedbackPanel({
  correct,
  detail,
  expectedAnswerText,
  misconceptionMessage,
  onContinue,
  continueLabel = "Continue",
  testID,
}: FeedbackPanelProps): React.JSX.Element {
  const stateLabel = correct ? "Correct" : "Not quite";
  return (
    <View
      style={[styles.panel, correct ? styles.correctPanel : styles.incorrectPanel]}
      testID={testID}
      accessible
      accessibilityRole="alert"
      accessibilityLabel={`${stateLabel}. ${correct ? "" : `The correct answer was ${expectedAnswerText}. `}${detail}`}
    >
      <Text style={[styles.stateLabel, correct ? styles.correctText : styles.incorrectText]}>{stateLabel}</Text>
      {!correct ? <Text style={styles.expectedText}>Correct answer: {expectedAnswerText}</Text> : null}
      <Text style={styles.detailText}>{detail}</Text>
      {misconceptionMessage ? <Text style={styles.misconceptionText}>{misconceptionMessage}</Text> : null}
      <Pressable
        style={({ pressed }) => [styles.continueButton, pressed && styles.pressed]}
        onPress={onContinue}
        accessibilityRole="button"
        accessibilityLabel={continueLabel}
      >
        <Text style={styles.continueText}>{continueLabel}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: spacing.md,
    gap: spacing.xs,
  },
  correctPanel: { backgroundColor: "#123321", borderColor: color.success },
  incorrectPanel: { backgroundColor: "#331616", borderColor: color.danger },
  stateLabel: { ...typography.title, fontSize: 18 },
  correctText: { color: color.success },
  incorrectText: { color: color.danger },
  expectedText: { ...typography.body, color: color.text, fontWeight: "600" },
  detailText: { ...typography.caption, color: color.textSecondary },
  misconceptionText: { ...typography.caption, color: color.textSecondary, fontStyle: "italic" },
  continueButton: {
    minHeight: minTouchTarget,
    borderRadius: radius.md,
    backgroundColor: color.accent,
    alignItems: "center",
    justifyContent: "center",
    marginTop: spacing.xs,
  },
  pressed: { opacity: 0.85 },
  continueText: { ...typography.body, color: "#fff", fontWeight: "700" },
});
