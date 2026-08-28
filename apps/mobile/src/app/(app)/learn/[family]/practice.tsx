/**
 * LEGACY_RETIRED (CC-12D): CC-05C's practice loop -- the original,
 * pre-Lesson-Player proof of the full end-to-end path (governed assertion
 * family -> representation -> question blueprint -> deterministic
 * instance -> native interaction -> marking -> evidence) for one question
 * at a time. Superseded by the real Lesson Player
 * (apps/mobile/src/app/(app)/learn/lesson-player.tsx) for every governed
 * lesson, including all four topics this screen once covered.
 *
 * No longer linked from any in-app navigation (a Product Owner emulator
 * finding traced a learner reaching this exact screen, with stale
 * teaching imagery and none of the adaptive/evidence/canonical-visual
 * machinery, straight from the Learn hub's topic cards -- see
 * ../index.tsx's own header comment for the fix). Kept, unlinked, as it
 * still exercises real shared plumbing (proving-engine, formula-rendering,
 * session-store) that several existing tests cover; do not link it from
 * production navigation again -- route new topic-card/browse entries to
 * the Lesson Player instead.
 *
 * Local-first: generation, marking and evidence creation all happen on
 * this device with zero network round trip (Mobile UX Engineering
 * Standard §1). Session position (family, question queue, seeds, current
 * index) is persisted after every state change so an interrupted session
 * (backgrounding, restart) resumes at the same question with a
 * byte-identical regenerated instance (MOBILE-ARCHITECTURE.md §4,
 * MOBILE-UX-ENGINEERING-STANDARD.md §6).
 */
import type {
  AnswerValue,
  EvaluationResult,
  GeneratedQuestionInstance,
} from "@alp/calculation-engine";
import type { QuestionBlueprint } from "@alp/content-schema";
import * as Haptics from "expo-haptics";
import { Link, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { MagneticForceDiagram } from "@/components/diagrams/MagneticForceDiagram";
import { ParallelCircuitDiagram } from "@/components/diagrams/ParallelCircuitDiagram";
import { RightHandGripRuleDiagram } from "@/components/diagrams/RightHandGripRuleDiagram";
import { SeriesCircuitDiagram } from "@/components/diagrams/SeriesCircuitDiagram";
import { DirectionAnswerInput, type Direction } from "@/components/question/DirectionAnswerInput";
import { FeedbackPanel } from "@/components/question/FeedbackPanel";
import { NumericAnswerInput } from "@/components/question/NumericAnswerInput";
import { ProgressIndicator } from "@/components/question/ProgressIndicator";
import { QuestionPromptCard } from "@/components/question/QuestionPromptCard";
import { RotationAnswerInput, type Rotation } from "@/components/question/RotationAnswerInput";
import { FormulaEquation } from "@/components/formula/FormulaExpressionView";
import { getProvingFamily } from "@/lib/proving-content/unit202-proving-fixture";
import { resolvePromptLines } from "@alp/calculation-engine";
import { promptLinesFor } from "@/lib/proving-content/prompt-text";
import { unitSymbolForQuantity } from "@/lib/proving-content/units";
import { generateProvingQuestion, markProvingAnswer, emitProvingEvidence } from "@/lib/proving-engine/proving-engine";
import {
  deriveQueueSeed,
  loadProvingSession,
  recordProvingEvidence,
  saveProvingSession,
  clearProvingSession,
  type ProvingQueueEntry,
  type ProvingSessionState,
} from "@/lib/proving-session/session-store";
import { color, radius, spacing, typography } from "@/lib/tokens";

type Phase =
  | { readonly kind: "loading" }
  | { readonly kind: "question"; readonly session: ProvingSessionState; readonly instance: GeneratedQuestionInstance }
  | {
      readonly kind: "feedback";
      readonly session: ProvingSessionState;
      readonly instance: GeneratedQuestionInstance;
      readonly evaluation: EvaluationResult;
      readonly given: AnswerValue;
    }
  | { readonly kind: "complete"; readonly total: number; readonly correctCount: number }
  | { readonly kind: "not-found" };

export default function PracticeScreen(): React.JSX.Element {
  const { family: familyId } = useLocalSearchParams<{ family: string }>();
  const family = getProvingFamily(familyId ?? "");
  const [phase, setPhase] = useState<Phase>({ kind: "loading" });
  const [correctCount, setCorrectCount] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!family) {
        if (!cancelled) setPhase({ kind: "not-found" });
        return;
      }
      const existing = await loadProvingSession(family.id);
      const session =
        existing && existing.currentIndex < existing.queue.length ? existing : freshSession(family.id, family.questionBlueprints.map((q) => q.id));
      if (!existing) await saveProvingSession(session);
      if (cancelled) return;
      setPhase({ kind: "question", session, instance: generateInstance(family.id, session) });
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [familyId]);

  if (!family || phase.kind === "not-found") {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Text style={styles.notFound}>Unknown family.</Text>
      </SafeAreaView>
    );
  }

  if (phase.kind === "loading") {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Text style={styles.loading}>Loading practice session...</Text>
      </SafeAreaView>
    );
  }

  if (phase.kind === "complete") {
    return (
      <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
        <View style={styles.completeContainer}>
          <Text style={styles.completeTitle}>Session complete</Text>
          <Text style={styles.completeScore}>
            {phase.correctCount} / {phase.total} correct
          </Text>
          <Text
            style={styles.link}
            accessibilityRole="button"
            accessibilityLabel="Practice again"
            onPress={() => {
              const session = freshSession(family.id, family.questionBlueprints.map((q) => q.id));
              void saveProvingSession(session);
              setCorrectCount(0);
              setPhase({ kind: "question", session, instance: generateInstance(family.id, session) });
            }}
          >
            Practice again
          </Text>
          <Link href={{ pathname: "/learn/[family]", params: { family: family.id } }} style={styles.link}>
            Back to lesson
          </Link>
        </View>
      </SafeAreaView>
    );
  }

  const { session, instance } = phase;
  const blueprint = family.questionBlueprints.find((q) => q.id === instance.identity.blueprintId)!;
  const total = session.queue.length;
  const current = session.currentIndex + 1;

  async function handleSubmit(given: AnswerValue) {
    const evaluation = markProvingAnswer(instance, given);
    const evidence = emitProvingEvidence(instance, evaluation);
    void recordProvingEvidence(evidence, given);
    if (evaluation.correct) {
      setCorrectCount((c) => c + 1);
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
    setPhase({ kind: "feedback", session, instance, evaluation, given });
  }

  async function handleContinue() {
    if (!family) return;
    const nextIndex = session.currentIndex + 1;
    if (nextIndex >= session.queue.length) {
      await clearProvingSession(family.id);
      setPhase({ kind: "complete", total: session.queue.length, correctCount: correctCount });
      return;
    }
    const nextSession: ProvingSessionState = { ...session, currentIndex: nextIndex, updatedAt: new Date().toISOString() };
    await saveProvingSession(nextSession);
    setPhase({ kind: "question", session: nextSession, instance: generateInstance(family.id, nextSession) });
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
      <ScrollView contentContainerStyle={styles.container}>
        <ProgressIndicator current={current} total={total} />
        <QuestionPromptCard
          title={blueprint.title}
          parameterLines={blueprint.presentation ? resolvePromptLines(blueprint, instance) : promptLinesFor(instance)}
        >
          {renderRepresentation(family.id, instance)}
        </QuestionPromptCard>

        {phase.kind === "question" ? renderAnswerInput(blueprint, (value: AnswerValue) => void handleSubmit(value)) : null}

        {phase.kind === "feedback" ? (
          <FeedbackPanel
            correct={phase.evaluation.correct}
            detail={phase.evaluation.detail}
            expectedAnswerText={formatExpectedAnswer(instance)}
            misconceptionMessage={misconceptionMessage(phase.evaluation)}
            onContinue={() => void handleContinue()}
            continueLabel={session.currentIndex + 1 >= session.queue.length ? "Finish" : "Next question"}
          />
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

function freshSession(familyId: string, blueprintIds: readonly string[]): ProvingSessionState {
  const now = Date.now();
  const queue: ProvingQueueEntry[] = blueprintIds.map((blueprintId, i) => ({
    blueprintId,
    seed: deriveQueueSeed(now, i),
  }));
  const nowIso = new Date().toISOString();
  return { familyId, queue, currentIndex: 0, startedAt: nowIso, updatedAt: nowIso };
}

function generateInstance(familyId: string, session: ProvingSessionState): GeneratedQuestionInstance {
  const entry = session.queue[session.currentIndex];
  if (!entry) throw new Error("generateInstance: session queue index out of range");
  return generateProvingQuestion({ familyId, blueprintId: entry.blueprintId, seed: entry.seed });
}

function renderRepresentation(familyId: string, instance: GeneratedQuestionInstance): React.ReactNode {
  const { formula, diagram } = instance.representation;
  return (
    <View style={styles.representationStack}>
      {formula ? <FormulaEquation target={formula.target} expression={formulaExpressionFor(familyId, formula.target)} /> : null}
      {diagram ? renderDiagram(diagram) : null}
    </View>
  );
}

/** Dispatches on the diagram instance's own governed blueprint id, never the family id -- a family may have more than one diagram type (magnetism has two: the grip-rule field diagram and the motor-principle force diagram). */
function renderDiagram(diagram: NonNullable<GeneratedQuestionInstance["representation"]["diagram"]>): React.ReactNode {
  switch (diagram.blueprintId) {
    case "circuit.series_resistors":
      return <SeriesCircuitDiagram diagram={diagram} />;
    case "circuit.parallel_resistors":
      return <ParallelCircuitDiagram diagram={diagram} />;
    case "magnetic.field_conductor_direction":
      return <RightHandGripRuleDiagram diagram={diagram} />;
    case "motor.force_field_current":
      return <MagneticForceDiagram diagram={diagram} />;
    default:
      return null;
  }
}

function renderAnswerInput(blueprint: QuestionBlueprint, onSubmit: (value: AnswerValue) => void): React.ReactNode {
  if (blueprint.id === "magnetism.interpret_field_direction") {
    return <RotationAnswerInput onSubmit={(value: Rotation) => onSubmit(value)} />;
  }
  if (blueprint.answer.type === "direction") {
    return <DirectionAnswerInput onSubmit={(value: Direction) => onSubmit(value)} />;
  }
  return (
    <NumericAnswerInput unitSymbol={unitSymbolForQuantity(blueprint.answer.quantity)} onSubmit={(value: number) => onSubmit(value)} />
  );
}

function formulaExpressionFor(familyId: string, target: string) {
  const family = getProvingFamily(familyId);
  const form = family?.formulaFamily?.forms.find((f) => f.target === target);
  if (!form) throw new Error(`formulaExpressionFor: no form for target "${target}" in family "${familyId}"`);
  return form.expression;
}

function formatExpectedAnswer(instance: GeneratedQuestionInstance): string {
  const { value, answer } = instance.expected;
  if (answer.type === "direction") return String(value);
  return `${value} ${unitSymbolForQuantity(answer.quantity)}`.trim();
}

function misconceptionMessage(evaluation: EvaluationResult): string | undefined {
  if (!evaluation.misconceptionIdentifier) return undefined;
  if (evaluation.evidenceStrength === "suggestive") {
    return "This may be related to a possible misunderstanding -- not certain from a single answer.";
  }
  return "This response is consistent with a known error pattern.";
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: color.background },
  container: { padding: spacing.lg, gap: spacing.md },
  notFound: { ...typography.body, color: color.danger, padding: spacing.lg },
  loading: { ...typography.body, color: color.textSecondary, padding: spacing.lg },
  representationStack: { gap: spacing.sm, alignItems: "center" },
  completeContainer: { flex: 1, alignItems: "center", justifyContent: "center", gap: spacing.md, padding: spacing.lg },
  completeTitle: { ...typography.title, color: color.text },
  completeScore: { ...typography.title, fontSize: 32, color: color.accent },
  link: { ...typography.body, color: color.accent, padding: spacing.sm, borderRadius: radius.md },
});
