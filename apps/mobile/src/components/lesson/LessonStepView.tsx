/**
 * Renders one resolved Lesson Player step: representation (formula/
 * worked-example/mnemonic), real governed body copy, and -- for graded
 * steps -- the DO -> RESPOND -> FEEDBACK -> NEXT rhythm (task brief §3):
 * question prompt + answer input, then FeedbackPanel once evaluated, then
 * Continue. Non-graded steps (`view_acknowledged`, or an
 * `answer_submitted` step with no machine-marked question) render body
 * copy + a single Continue affordance.
 *
 * This component only renders; it never decides session
 * advancement/branching itself -- see lib/lesson-session/lesson-
 * controller.ts for that. `evaluation`/`onSubmit`/`onContinue` are all
 * provided by the caller.
 */
import type { AnswerValue, EvaluationResult, GeneratedQuestionInstance } from "@alp/calculation-engine";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { FormulaEquation } from "@/components/formula/FormulaExpressionView";
import { WorkedSubstitution } from "@/components/formula/WorkedSubstitution";
import { VirTriangle } from "@/components/mnemonic/VirTriangle";
import { FeedbackPanel } from "@/components/question/FeedbackPanel";
import { QuestionPromptCard } from "@/components/question/QuestionPromptCard";
import { AnswerInputDispatch } from "@/lib/lesson-content/answer-input-dispatch";
import type { RenderableLessonStep } from "@/lib/lesson-content/resolve-lesson-step";
import { buildTeachingWorkedExample } from "@/lib/formula-rendering/build-worked-example";
import { OHMS_LAW_TEACHING_VALUES } from "@/lib/proving-content/teaching-examples";
import { symbolicResolver } from "@/lib/formula-rendering/format-formula";
import { promptLinesFor } from "@/lib/proving-content/prompt-text";
import { color, minTouchTarget, radius, spacing, typography } from "@/lib/tokens";

const MISCONCEPTION_MESSAGES: Readonly<Record<string, string>> = {
  "MIS-EL-OHM-WRONG-OPERATION-001": "This looks like the wrong operation was used -- check whether the step needed multiplying or dividing.",
  "MIS-EL-OHM-REARRANGE-ERROR-001": "This looks like the formula was rearranged incorrectly -- check which variable ended up on which side.",
  "MIS-EL-OHM-UNRELATED-SYMBOLS-001": "V, I and R are not independent facts to memorise -- they are one relationship, V = I x R.",
};

export interface LessonStepViewProps {
  readonly resolved: RenderableLessonStep;
  readonly questionInstance: GeneratedQuestionInstance | null;
  readonly evaluation: EvaluationResult | null;
  readonly onSubmit: (value: AnswerValue) => void;
  readonly onContinue: () => void;
  readonly submitting?: boolean;
}

export function LessonStepView({ resolved, questionInstance, evaluation, onSubmit, onContinue, submitting }: LessonStepViewProps): React.JSX.Element {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionLabel} accessibilityRole="header">
        {resolved.sectionLabel}
      </Text>

      {resolved.bodyStatements.map((statement) => (
        <Text key={statement} style={styles.bodyText}>
          {statement}
        </Text>
      ))}

      {resolved.formulaFamily && !resolved.workedExample ? (
        <View style={styles.representation}>
          {resolved.formulaFamily.forms.map((form) => (
            <FormulaEquation key={form.target} target={form.target} expression={form.expression} resolve={symbolicResolver} />
          ))}
        </View>
      ) : null}

      {resolved.workedExample && resolved.formulaFamily ? (
        <View style={styles.representation}>
          <WorkedSubstitution
            formulaFamily={resolved.formulaFamily}
            instance={buildTeachingWorkedExample(resolved.formulaFamily, resolved.workedExample, OHMS_LAW_TEACHING_VALUES)}
          />
        </View>
      ) : null}

      {resolved.visualAid && resolved.formulaFamily ? (
        <View style={styles.representation}>
          <VirTriangle visualAid={resolved.visualAid} formulaFamily={resolved.formulaFamily} />
        </View>
      ) : null}

      {resolved.questionBlueprint && questionInstance ? (
        <QuestionPromptCard title={resolved.questionBlueprint.title} parameterLines={promptLinesFor(questionInstance)}>
          {evaluation ? null : (
            <AnswerInputDispatch
              blueprint={resolved.questionBlueprint}
              instance={questionInstance}
              formulaFamily={resolved.formulaFamily}
              onSubmit={onSubmit}
              disabled={submitting}
            />
          )}
        </QuestionPromptCard>
      ) : null}

      {evaluation ? (
        <FeedbackPanel
          correct={evaluation.correct}
          detail={evaluation.detail}
          expectedAnswerText={String(questionInstance?.expected.value ?? "")}
          misconceptionMessage={evaluation.misconceptionIdentifier ? MISCONCEPTION_MESSAGES[evaluation.misconceptionIdentifier] : undefined}
          onContinue={onContinue}
          continueLabel={evaluation.correct || evaluation.misconceptionIdentifier ? "Continue" : "Try again"}
        />
      ) : !resolved.questionBlueprint ? (
        <Pressable
          style={({ pressed }) => [styles.continueButton, pressed && styles.pressed]}
          onPress={onContinue}
          accessibilityRole="button"
          accessibilityLabel="Continue"
        >
          <Text style={styles.continueText}>Continue</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: spacing.md },
  sectionLabel: { ...typography.caption, color: color.textSecondary, textTransform: "uppercase", letterSpacing: 0.5 },
  bodyText: { ...typography.body, color: color.text },
  representation: { alignItems: "center", paddingVertical: spacing.sm },
  continueButton: {
    minHeight: minTouchTarget,
    borderRadius: radius.md,
    backgroundColor: color.accent,
    alignItems: "center",
    justifyContent: "center",
    marginTop: spacing.sm,
  },
  pressed: { opacity: 0.85 },
  continueText: { ...typography.body, color: "#fff", fontWeight: "700" },
});
