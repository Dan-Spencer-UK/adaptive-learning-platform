/**
 * CC-12: progressive-disclosure feedback -- a permanent product principle
 * (different learners want different amounts of help) demonstrated here
 * for the first time in a real learner-facing screen. Three layers,
 * revealed in place (never a separate screen/modal):
 *
 *  1. QUICK   -- always visible: correct/incorrect, the correct answer
 *     (when revealable), and the marking engine's own `detail` text.
 *     Exactly `FeedbackPanel`'s existing content -- unchanged.
 *  2. EXPLAIN -- one tap reveals WHY: the real governed assertion
 *     statement(s) this step tests (`resolved.bodyStatements`, already
 *     resolved by `resolve-lesson-step.ts` -- no new content authored).
 *  3. DEEPER  -- a further tap reveals the governed misconception
 *     description (when the engine identified one) plus, where the
 *     calling step supplies it, a `deeperNote` -- an additional,
 *     explicitly-framed "commonly confused with" hint for a residual
 *     hypothesis that was NOT positively confirmed by the engine (never
 *     asserted as certain, task brief §11/§16).
 *
 * Gated by `step.presentation.progressiveReveal` in `LessonStepView` --
 * every other lesson step in the platform keeps rendering the plain,
 * unmodified `FeedbackPanel` exactly as before.
 */
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { color, minTouchTarget, radius, spacing, typography } from "@/lib/tokens";
import type { FeedbackPanelProps } from "./FeedbackPanel";

export interface LayeredFeedbackPanelProps extends FeedbackPanelProps {
  /** The real governed assertion statement(s) this step tests -- the EXPLAIN layer's "why" content. Empty hides the Explain layer entirely. */
  readonly explainReasoning: readonly string[];
  /** An additional, explicitly-informational hint for a residual hypothesis the engine did not confirm (e.g. a related, commonly-confused misconception) -- shown only in the DEEPER layer, always framed as "a common related mix-up", never as a confirmed diagnosis. */
  readonly deeperNote?: string;
}

export function LayeredFeedbackPanel({
  correct,
  detail,
  expectedAnswerText,
  misconceptionMessage,
  deeperNote,
  explainReasoning,
  onContinue,
  continueLabel = "Continue",
  testID,
}: LayeredFeedbackPanelProps): React.JSX.Element {
  const [explainOpen, setExplainOpen] = useState(false);
  const [deeperOpen, setDeeperOpen] = useState(false);
  const stateLabel = correct ? "Correct" : "Not quite";
  const hasExplain = explainReasoning.length > 0;
  const hasDeeper = Boolean(misconceptionMessage) || Boolean(deeperNote);

  return (
    <View
      style={[styles.panel, correct ? styles.correctPanel : styles.incorrectPanel]}
      testID={testID}
      accessible
      accessibilityRole="alert"
      accessibilityLabel={`${stateLabel}. ${!correct && expectedAnswerText !== null ? `The correct answer was ${expectedAnswerText}. ` : ""}${detail}`}
    >
      <Text style={[styles.stateLabel, correct ? styles.correctText : styles.incorrectText]}>{stateLabel}</Text>
      {!correct && expectedAnswerText !== null ? <Text style={styles.expectedText}>Correct answer: {expectedAnswerText}</Text> : null}
      <Text style={styles.detailText}>{detail}</Text>

      {hasExplain ? (
        <View style={styles.layerSection}>
          <Pressable
            onPress={() => setExplainOpen((v) => !v)}
            accessibilityRole="button"
            accessibilityLabel={explainOpen ? "Hide why" : "Explain why"}
            style={styles.layerToggle}
          >
            <Text style={styles.layerToggleText}>{explainOpen ? "Hide why ▲" : "Explain why ▾"}</Text>
          </Pressable>
          {explainOpen ? (
            <View style={styles.layerBody}>
              {explainReasoning.map((s) => (
                <Text key={s} style={styles.layerText}>
                  {s}
                </Text>
              ))}
            </View>
          ) : null}
        </View>
      ) : null}

      {hasDeeper ? (
        <View style={styles.layerSection}>
          <Pressable
            onPress={() => setDeeperOpen((v) => !v)}
            accessibilityRole="button"
            accessibilityLabel={deeperOpen ? "Hide deeper detail" : "Show my weakness"}
            style={styles.layerToggle}
          >
            <Text style={styles.layerToggleText}>{deeperOpen ? "Hide deeper detail ▲" : "Show my weakness ▾"}</Text>
          </Pressable>
          {deeperOpen ? (
            <View style={styles.layerBody}>
              {misconceptionMessage ? <Text style={styles.misconceptionText}>{misconceptionMessage}</Text> : null}
              {deeperNote ? <Text style={styles.layerText}>{deeperNote}</Text> : null}
            </View>
          ) : null}
        </View>
      ) : null}

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
  layerSection: { marginTop: spacing.xs },
  layerToggle: { minHeight: minTouchTarget, justifyContent: "center" },
  layerToggleText: { ...typography.caption, color: color.accent, fontWeight: "700" },
  layerBody: { gap: spacing.xs, paddingTop: spacing.xs },
  layerText: { ...typography.caption, color: color.textSecondary },
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
