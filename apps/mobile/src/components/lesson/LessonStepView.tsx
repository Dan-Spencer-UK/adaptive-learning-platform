/**
 * Renders one resolved Lesson Player step: representation (formula/
 * worked-example/mnemonic), real governed body copy, and -- for graded
 * steps -- the DO -> RESPOND -> FEEDBACK -> NEXT rhythm: question prompt
 * + answer input, then FeedbackPanel once evaluated, then Continue.
 * Non-graded steps render body copy + a single Continue affordance.
 *
 * CC-06D: this component carries NO lesson-specific or factual content
 * of its own. Question prompt lines and misconception feedback copy
 * resolve from governed content (blueprint presentation via
 * @alp/calculation-engine's deterministic renderer; misconception
 * descriptions via the resolved content lookup); worked-example teaching
 * values come from the governed worked-example blueprint. Only
 * interface microcopy (section labels, "Continue", "Try again") is
 * app-owned.
 *
 * This component only renders; it never decides session advancement/
 * branching itself -- see lib/lesson-session/lesson-controller.ts.
 * `revealCorrectAnswer` gates whether the correct answer may be shown in
 * feedback (false while a retry of the same question is pending --
 * CC-06D, Correction G).
 */
import type { AnswerValue, EvaluationResult, GeneratedQuestionInstance } from "@alp/calculation-engine";
import { resolvePromptLines } from "@alp/calculation-engine";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { buildTeachingDiagramInstance, DiagramRenderer, type DiagramRevealProps } from "@/components/diagrams/DiagramRenderer";
import { FormulaEquation } from "@/components/formula/FormulaExpressionView";
import { WorkedSubstitution } from "@/components/formula/WorkedSubstitution";
import { VirTriangle } from "@/components/mnemonic/VirTriangle";
import { FeedbackPanel } from "@/components/question/FeedbackPanel";
import { QuestionPromptCard } from "@/components/question/QuestionPromptCard";
import { AnswerInputDispatch } from "@/lib/lesson-content/answer-input-dispatch";
import type { RenderableLessonStep } from "@/lib/lesson-content/resolve-lesson-step";
import { buildTeachingWorkedExample } from "@/lib/formula-rendering/build-worked-example";
import { symbolicResolver } from "@/lib/formula-rendering/format-formula";
import { color, minTouchTarget, radius, spacing, typography } from "@/lib/tokens";

export interface LessonStepViewProps {
  readonly resolved: RenderableLessonStep;
  readonly questionInstance: GeneratedQuestionInstance | null;
  readonly evaluation: EvaluationResult | null;
  /** Whether feedback may display the correct answer -- false while this same question is awaiting a retry. */
  readonly revealCorrectAnswer: boolean;
  readonly onSubmit: (value: AnswerValue) => void;
  readonly onContinue: () => void;
  readonly submitting?: boolean;
}

export function LessonStepView({ resolved, questionInstance, evaluation, revealCorrectAnswer, onSubmit, onContinue, submitting }: LessonStepViewProps): React.JSX.Element {
  const misconceptionMessage =
    evaluation?.misconceptionIdentifier !== undefined ? resolved.misconceptionDescriptions[evaluation.misconceptionIdentifier] : undefined;

  // CC-11: the diagram runtime fix (task brief §7). A step's diagram
  // instance prefers the real generated question instance's own diagram
  // (correct parameters for THIS specific question) when one exists for
  // the same blueprint; otherwise it falls back to a generic teaching
  // instance built straight from the blueprint's own declared parameters
  // (a pure teaching illustration, no generated question driving it).
  //
  // The directional reveal (field-curl / force direction -- the assessed
  // answer for the two magnetism diagrams) is withheld until feedback,
  // mirroring exactly how `expectedAnswerText` below is withheld while a
  // retry is pending (CC-06D Correction G) -- never shown while the
  // learner is still answering, exactly like every other answer-bearing
  // element in this component.
  const diagramInstance =
    resolved.diagram && questionInstance?.representation.diagram?.blueprintId === resolved.diagram.id
      ? questionInstance.representation.diagram
      : resolved.diagram
        ? buildTeachingDiagramInstance(resolved.diagram, [], resolved.step.representation.diagramParameters)
        : null;
  const diagramReveal: DiagramRevealProps | undefined =
    evaluation && revealCorrectAnswer && questionInstance && resolved.diagram
      ? resolved.diagram.id === "magnetic.field_conductor_direction"
        ? { fieldRotation: questionInstance.expected.value as "clockwise" | "counterclockwise" }
        : resolved.diagram.id === "motor.force_field_current"
          ? { forceDirection: questionInstance.expected.value as "up" | "down" | "left" | "right" }
          : resolved.diagram.id === "magnetic.pole_interaction"
            ? { showPoleForce: true }
            : undefined
      : undefined;

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
          <WorkedSubstitution formulaFamily={resolved.formulaFamily} instance={buildTeachingWorkedExample(resolved.formulaFamily, resolved.workedExample)} />
        </View>
      ) : null}

      {resolved.visualAid && resolved.formulaFamily ? (
        <View style={styles.representation}>
          <VirTriangle visualAid={resolved.visualAid} formulaFamily={resolved.formulaFamily} />
        </View>
      ) : null}

      {resolved.diagram && diagramInstance ? (
        <View style={styles.representation}>
          <DiagramRenderer blueprint={resolved.diagram} diagram={diagramInstance} reveal={diagramReveal} />
        </View>
      ) : null}

      {resolved.questionBlueprint && questionInstance ? (
        <QuestionPromptCard title={resolved.questionBlueprint.title} parameterLines={resolvePromptLines(resolved.questionBlueprint, questionInstance)}>
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
          // The engine's marking detail states the expected answer -- while a
          // retry of the same question is pending it must not surface either
          // (CC-06D Correction G). The replacement line is interface
          // microcopy, not factual content.
          detail={revealCorrectAnswer ? evaluation.detail : "Have another look and try again."}
          expectedAnswerText={revealCorrectAnswer ? String(questionInstance?.expected.value ?? "") : null}
          misconceptionMessage={misconceptionMessage}
          onContinue={onContinue}
          continueLabel={revealCorrectAnswer ? "Continue" : "Try again"}
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
