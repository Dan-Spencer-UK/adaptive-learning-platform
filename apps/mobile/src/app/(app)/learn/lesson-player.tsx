/**
 * The first PRODUCTION-INTENT native Lesson Player slice: executes a real
 * assembled `LessonInstance` for the canonical Ohm's Law lesson, step by
 * step, DO -> RESPOND -> FEEDBACK -> NEXT (task brief §3), fully offline
 * once locally prepared (task brief §25). Replaces/extends (does not
 * remove) the CC-05C proving screens at ../[family]/index.tsx and
 * ../[family]/practice.tsx, which remain the proving-grade baseline for
 * the other three families.
 *
 * Runtime chain (task brief §4): local governed content fixture ->
 * canonical LessonPlan -> LearnerEvidenceSnapshot -> @alp/learning-engine
 * -> LessonInstance -> this screen -> governed step -> governed
 * representation/question blueprint -> @alp/calculation-engine ->
 * evaluation/feedback -> evidence emission -> within-session governed
 * branch -> next step. No calculation/marking/branching logic is
 * duplicated here -- see lib/lesson-session/lesson-controller.ts.
 */
import { ASSEMBLY_POLICY_VERSION, assembleLessonInstance, computeLessonContentDependencies, type AssemblyContext, type LearnerEvidenceSnapshot } from "@alp/learning-engine";
import type { AnswerValue, EvaluationResult, GeneratedQuestionInstance } from "@alp/calculation-engine";
import { useCallback, useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { LessonCompletionView } from "@/components/lesson/LessonCompletionView";
import { LessonStepView } from "@/components/lesson/LessonStepView";
import { ProgressIndicator } from "@/components/question/ProgressIndicator";
import { triggerHaptic } from "@/lib/haptics";
import { useSession } from "@/lib/auth/session-context";
import { generateLessonQuestion } from "@/lib/lesson-content/generate-lesson-question";
import {
  ASSERTION_STATEMENTS,
  FORMULA_OHMS_LAW,
  LESSON_OHMS_LAW,
  LESSON_QUESTION_BLUEPRINTS,
  MNEMONIC_VIR_TRIANGLE,
  OHMS_LAW_LOCAL_CONTENT_INVENTORY,
  WORKED_OHMS_LAW_SOLVE_CURRENT,
  WORKED_OHMS_LAW_SOLVE_RESISTANCE,
  WORKED_OHMS_LAW_SOLVE_VOLTAGE,
} from "@/lib/lesson-content/lesson-ohms-law-content-fixture";
import { prepareLessonContent, type LocalContentStatus } from "@/lib/lesson-content/local-content-store";
import { resolveLessonStep, type ContentLookup } from "@/lib/lesson-content/resolve-lesson-step";
import { useLessonDebugOverlay } from "@/lib/lesson-content/dev-debug-overlay";
import { acknowledgeStep, submitStepAnswer } from "@/lib/lesson-session/lesson-controller";
import { currentStepId, isSessionComplete, startSession, type LessonSessionState } from "@/lib/lesson-session/lesson-session-controller";
import { getActiveLessonInstanceId, loadLessonSession, saveLessonSession } from "@/lib/lesson-session/lesson-session-store";
import { color, radius, spacing, typography } from "@/lib/tokens";

const CONTENT_LOOKUP: ContentLookup = {
  questionBlueprints: LESSON_QUESTION_BLUEPRINTS,
  formulaFamilies: [FORMULA_OHMS_LAW],
  workedExampleBlueprints: [WORKED_OHMS_LAW_SOLVE_VOLTAGE, WORKED_OHMS_LAW_SOLVE_CURRENT, WORKED_OHMS_LAW_SOLVE_RESISTANCE],
  visualAidBlueprints: [MNEMONIC_VIR_TRIANGLE],
  assertionStatements: ASSERTION_STATEMENTS,
};

/** No real learner-evidence persistence exists yet (CC-07+ scope) -- a new learner with no prior evidence is the honest default for production entry. NOT_ASSESSED never gates teaching (WP1.3 §39.1). */
function emptyEvidenceSnapshot(learnerId: string): LearnerEvidenceSnapshot {
  return { learnerId, capabilityStatus: new Map(), misconceptionsEvidenced: new Set(), retrievalDue: new Set() };
}

type ScreenState =
  | { readonly kind: "loading" }
  | { readonly kind: "content_unavailable"; readonly missing: readonly { category: string; id: string }[] }
  | { readonly kind: "prerequisite_blocked"; readonly reason: string }
  | {
      readonly kind: "active";
      readonly displaySession: LessonSessionState;
      readonly pendingNextSession: LessonSessionState | null;
      readonly questionInstance: GeneratedQuestionInstance | null;
      readonly evaluation: EvaluationResult | null;
      readonly submitting: boolean;
    }
  | { readonly kind: "complete"; readonly session: LessonSessionState };

function questionInstanceFor(session: LessonSessionState): GeneratedQuestionInstance | null {
  const stepId = currentStepId(session);
  if (!stepId) return null;
  const step = LESSON_OHMS_LAW.steps.find((s) => s.id === stepId);
  if (!step?.questionBlueprintId) return null;
  return generateLessonQuestion({ blueprintId: step.questionBlueprintId, instanceId: session.instanceId, stepId });
}

export default function LessonPlayerScreen(): React.JSX.Element {
  const { session: authSession } = useSession();
  const learnerId = authSession?.user.id ?? "unknown-learner";
  const [state, setState] = useState<ScreenState>({ kind: "loading" });
  const debugOverlayEnabled = useLessonDebugOverlay();

  useEffect(() => {
    let cancelled = false;

    async function init(): Promise<void> {
      const manifest = computeLessonContentDependencies(LESSON_OHMS_LAW);
      const contentRecord = await prepareLessonContent(manifest, OHMS_LAW_LOCAL_CONTENT_INVENTORY);
      if (cancelled) return;
      const status: LocalContentStatus = contentRecord.status;
      if (status !== "ready") {
        setState({ kind: "content_unavailable", missing: contentRecord.missingDependencies });
        return;
      }

      const activeInstanceId = await getActiveLessonInstanceId();
      if (activeInstanceId) {
        const resumed = await loadLessonSession(activeInstanceId);
        if (resumed && resumed.lessonId === LESSON_OHMS_LAW.id && !isSessionComplete(resumed)) {
          if (cancelled) return;
          setState({ kind: "active", displaySession: resumed, pendingNextSession: null, questionInstance: questionInstanceFor(resumed), evaluation: null, submitting: false });
          return;
        }
      }

      const context: AssemblyContext = { assemblyPolicyVersion: ASSEMBLY_POLICY_VERSION, allLessons: [LESSON_OHMS_LAW] };
      const result = assembleLessonInstance(LESSON_OHMS_LAW, emptyEvidenceSnapshot(learnerId), context);
      if (cancelled) return;

      if (result.status === "prerequisite_unresolved") {
        setState({ kind: "prerequisite_blocked", reason: "A prerequisite for this lesson has not yet been mastered, and no remediation lesson is available yet." });
        return;
      }
      if (result.status === "prerequisite_required") {
        setState({ kind: "prerequisite_blocked", reason: "A prerequisite lesson needs to be completed first." });
        return;
      }

      const fresh = startSession(result.instance, learnerId, new Date().toISOString());
      await saveLessonSession(fresh);
      if (cancelled) return;
      setState({ kind: "active", displaySession: fresh, pendingNextSession: null, questionInstance: questionInstanceFor(fresh), evaluation: null, submitting: false });
    }

    void init();
    return () => {
      cancelled = true;
    };
  }, [learnerId]);

  const handleSubmit = useCallback(
    async (given: AnswerValue) => {
      if (state.kind !== "active" || !state.questionInstance || state.submitting) return;
      setState({ ...state, submitting: true });
      const result = await submitStepAnswer({ lesson: LESSON_OHMS_LAW, state: state.displaySession, questionInstance: state.questionInstance, given });
      triggerHaptic(result.evaluation.correct ? "correct" : "incorrect");
      setState({
        kind: "active",
        displaySession: state.displaySession,
        pendingNextSession: result.advanced ? result.nextState : null,
        questionInstance: state.questionInstance,
        evaluation: result.evaluation,
        submitting: false,
      });
    },
    [state],
  );

  const handleContinue = useCallback(async () => {
    if (state.kind !== "active") return;

    if (state.evaluation) {
      // Feedback was shown for a graded step -- either apply the already-persisted advance, or (held position) retry the same step.
      const next = state.pendingNextSession;
      if (!next) {
        setState({ ...state, evaluation: null });
        return;
      }
      if (isSessionComplete(next)) {
        setState({ kind: "complete", session: next });
        return;
      }
      setState({ kind: "active", displaySession: next, pendingNextSession: null, questionInstance: questionInstanceFor(next), evaluation: null, submitting: false });
      return;
    }

    // Non-graded step: acknowledge and advance now.
    const next = await acknowledgeStep({ state: state.displaySession });
    if (isSessionComplete(next)) {
      triggerHaptic("milestone");
      setState({ kind: "complete", session: next });
      return;
    }
    setState({ kind: "active", displaySession: next, pendingNextSession: null, questionInstance: questionInstanceFor(next), evaluation: null, submitting: false });
  }, [state]);

  if (state.kind === "loading") {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centered}>
          <Text style={styles.bodyText}>Preparing lesson...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (state.kind === "content_unavailable") {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centered}>
          <Text style={styles.title}>This lesson hasn&apos;t been downloaded yet.</Text>
          <Text style={styles.bodyText}>{state.missing.length} piece(s) of required content are not available locally.</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (state.kind === "prerequisite_blocked") {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centered}>
          <Text style={styles.title}>Not ready yet</Text>
          <Text style={styles.bodyText}>{state.reason}</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (state.kind === "complete") {
    return (
      <SafeAreaView style={styles.safeArea}>
        <LessonCompletionView lesson={LESSON_OHMS_LAW} onContinue={() => setState({ kind: "loading" })} />
      </SafeAreaView>
    );
  }

  const stepId = currentStepId(state.displaySession);
  if (!stepId) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centered}>
          <Text style={styles.bodyText}>Session error: no current step.</Text>
        </View>
      </SafeAreaView>
    );
  }
  const resolved = resolveLessonStep(LESSON_OHMS_LAW, stepId, CONTENT_LOOKUP);
  const progress = { completed: state.displaySession.completedStepIds.length, total: state.displaySession.stepSequence.length };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <View style={styles.header}>
        <ProgressIndicator current={progress.completed} total={progress.total} testID="lesson-progress" />
        <Pressable accessibilityRole="button" accessibilityLabel="Exit lesson" style={styles.exitButton} onPress={() => setState({ kind: "loading" })}>
          <Text style={styles.exitText}>Exit</Text>
        </Pressable>
      </View>
      {debugOverlayEnabled ? (
        <View style={styles.debugBadge} testID="lesson-debug-overlay">
          <Text style={styles.debugBadgeText}>
            {resolved.step.id} ({resolved.step.type})
          </Text>
        </View>
      ) : null}
      <ScrollView contentContainerStyle={styles.container}>
        <LessonStepView
          resolved={resolved}
          questionInstance={state.questionInstance}
          evaluation={state.evaluation}
          onSubmit={(value) => void handleSubmit(value)}
          onContinue={() => void handleContinue()}
          submitting={state.submitting}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: color.background },
  centered: { flex: 1, alignItems: "center", justifyContent: "center", padding: spacing.lg, gap: spacing.sm },
  header: { flexDirection: "row", alignItems: "center", gap: spacing.md, paddingHorizontal: spacing.lg, paddingTop: spacing.sm },
  exitButton: { padding: spacing.xs },
  exitText: { ...typography.body, color: color.textSecondary },
  container: { padding: spacing.lg, gap: spacing.md },
  title: { ...typography.title, fontSize: 18, color: color.text, textAlign: "center" },
  bodyText: { ...typography.body, color: color.textSecondary, textAlign: "center" },
  debugBadge: { alignSelf: "flex-start", marginHorizontal: spacing.lg, marginTop: spacing.xs, paddingHorizontal: spacing.sm, paddingVertical: 2, borderRadius: radius.sm, backgroundColor: "#3A1620" },
  debugBadgeText: { ...typography.code, color: color.danger },
});
