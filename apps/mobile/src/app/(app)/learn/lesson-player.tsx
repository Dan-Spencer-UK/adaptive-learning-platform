/**
 * The production-intent native Lesson Player, parameterized by GOVERNED
 * LESSON IDENTITY (CC-06D, Correction D): the screen enters with a
 * `lessonId` route parameter (plus optional `contentRelease`/`version`
 * overrides, defaulting to the bundled local release) and resolves all
 * content through the generated local content projection via the typed
 * local content registry -- it is structurally bound to no particular
 * lesson. Unknown lesson identity fails explicitly; there is no
 * first-lesson fallback.
 *
 * Learner scoping (Correction E): the player fails closed when learner
 * identity is unavailable -- no "unknown-learner" fallback ever reaches
 * durable state -- and resume is only offered for a session owned by the
 * signed-in learner AND matching the requested immutable lesson identity
 * (lessonId + version + contentRelease).
 *
 * Runtime chain: generated local projection -> canonical LessonPlan ->
 * LearnerEvidenceSnapshot -> @alp/learning-engine -> LessonInstance ->
 * this screen -> governed step -> governed representation/question
 * blueprint -> @alp/calculation-engine -> evaluation/feedback ->
 * learner-owned evidence -> within-session governed branch -> next step.
 */
import { ASSEMBLY_POLICY_VERSION, assembleLessonInstance, computeLessonContentDependencies, type AssemblyContext } from "@alp/learning-engine";
import type { AnswerValue, EvaluationResult, GeneratedQuestionInstance } from "@alp/calculation-engine";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { LessonCompletionView } from "@/components/lesson/LessonCompletionView";
import { LessonStepView } from "@/components/lesson/LessonStepView";
import { ProgressIndicator } from "@/components/question/ProgressIndicator";
import { triggerHaptic } from "@/lib/haptics";
import { useSession } from "@/lib/auth/session-context";
import { deriveLocalLearnerEvidence } from "@/lib/evidence-sync/derived-snapshot";
import { randomId } from "@/lib/storage/random-id";
import { generateLessonQuestion } from "@/lib/lesson-content/generate-lesson-question";
import {
  bundledContentReleaseId,
  getLocalLesson,
  getLocalReleaseLessons,
  UnknownLessonError,
  type LocalLessonRecord,
} from "@/lib/lesson-content/local-content-registry";
import { prepareLessonContent, type LocalContentStatus } from "@/lib/lesson-content/local-content-store";
import { resolveLessonStep } from "@/lib/lesson-content/resolve-lesson-step";
import { useLessonDebugOverlay } from "@/lib/lesson-content/dev-debug-overlay";
import { acknowledgeStep, submitStepAnswer } from "@/lib/lesson-session/lesson-controller";
import { currentStepId, isSessionComplete, startSession, type LessonSessionState } from "@/lib/lesson-session/lesson-session-controller";
import { getActiveLessonInstanceId, loadLessonSession, saveLessonSession } from "@/lib/lesson-session/lesson-session-store";
import { recordRecentCourseCompletion } from "@/lib/course/recent-completion-store";
import { color, radius, spacing, typography } from "@/lib/tokens";

type ScreenState =
  | { readonly kind: "loading" }
  | { readonly kind: "identity_unavailable" }
  | { readonly kind: "unknown_lesson"; readonly detail: string }
  | { readonly kind: "content_unavailable"; readonly missing: readonly { category: string; id: string }[] }
  | { readonly kind: "prerequisite_blocked"; readonly reason: string }
  | {
      readonly kind: "active";
      readonly record: LocalLessonRecord;
      readonly displaySession: LessonSessionState;
      readonly pendingNextSession: LessonSessionState | null;
      readonly questionInstance: GeneratedQuestionInstance | null;
      readonly evaluation: EvaluationResult | null;
      readonly revealCorrectAnswer: boolean;
      readonly submitting: boolean;
    }
  | { readonly kind: "complete"; readonly record: LocalLessonRecord; readonly session: LessonSessionState };

function questionInstanceFor(record: LocalLessonRecord, session: LessonSessionState): GeneratedQuestionInstance | null {
  const stepId = currentStepId(session);
  if (!stepId) return null;
  const step = record.lesson.steps.find((s) => s.id === stepId);
  if (!step?.questionBlueprintId) return null;
  const blueprint = record.lookup.questionBlueprints.find((b) => b.id === step.questionBlueprintId);
  if (!blueprint) {
    throw new UnknownLessonError(`question blueprint '${step.questionBlueprintId}' referenced by step '${stepId}' is not in local release '${record.contentRelease}'`);
  }
  return generateLessonQuestion({
    blueprint,
    formulaFamilies: record.lookup.formulaFamilies,
    contentRelease: record.contentRelease,
    blueprintVersion: record.questionBlueprintVersion,
    instanceId: session.instanceId,
    stepId,
  });
}

export default function LessonPlayerScreen(): React.JSX.Element {
  const router = useRouter();
  const params = useLocalSearchParams<{ lessonId?: string; contentRelease?: string; version?: string }>();
  const lessonId = typeof params.lessonId === "string" ? params.lessonId : undefined;
  const requestedRelease = typeof params.contentRelease === "string" ? params.contentRelease : bundledContentReleaseId();
  const requestedVersion = typeof params.version === "string" ? Number(params.version) : undefined;

  const { session: authSession, isLoading: authLoading } = useSession();
  const learnerId = authSession?.user.id ?? null;
  const [state, setState] = useState<ScreenState>({ kind: "loading" });
  const debugOverlayEnabled = useLessonDebugOverlay();

  const exitToLearn = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/learn");
    }
  }, [router]);

  useEffect(() => {
    let cancelled = false;

    async function init(): Promise<void> {
      if (authLoading) return;
      // Fail closed on missing learner identity (Correction E §9.1): no
      // durable unknown-learner state, and no destruction of any existing
      // learner's offline data.
      if (!learnerId) {
        setState({ kind: "identity_unavailable" });
        return;
      }
      if (!lessonId) {
        setState({ kind: "unknown_lesson", detail: "No lesson was specified. The Lesson Player requires an explicit governed lesson id." });
        return;
      }

      let record: LocalLessonRecord;
      try {
        record = getLocalLesson({ lessonId, contentRelease: requestedRelease, version: requestedVersion });
      } catch (error) {
        if (error instanceof UnknownLessonError) {
          if (!cancelled) setState({ kind: "unknown_lesson", detail: error.message });
          return;
        }
        throw error;
      }

      const manifest = computeLessonContentDependencies(record.lesson);
      const contentRecord = await prepareLessonContent(manifest, record.inventory);
      if (cancelled) return;
      const status: LocalContentStatus = contentRecord.status;
      if (status !== "ready") {
        setState({ kind: "content_unavailable", missing: contentRecord.missingDependencies });
        return;
      }

      // Resume only the SAME learner's session for the SAME immutable
      // lesson identity (lessonId + version + contentRelease) -- never
      // merely "a stored session that happens to exist" (Correction D §8.4).
      const activeInstanceId = await getActiveLessonInstanceId(learnerId);
      if (activeInstanceId) {
        const resumed = await loadLessonSession(activeInstanceId, learnerId);
        if (
          resumed &&
          resumed.lessonId === record.lesson.id &&
          resumed.lessonVersion === record.lesson.version &&
          resumed.contentRelease === record.contentRelease &&
          !isSessionComplete(resumed)
        ) {
          if (cancelled) return;
          setState({
            kind: "active",
            record,
            displaySession: resumed,
            pendingNextSession: null,
            questionInstance: questionInstanceFor(record, resumed),
            evaluation: null,
            revealCorrectAnswer: false,
            submitting: false,
          });
          return;
        }
      }

      // The REAL evidence chain (CC-07): locally durable attempts ->
      // deterministic evidence engine -> snapshot -> assembly. Entirely
      // offline; a new learner with no evidence derives an empty snapshot
      // (NOT_ASSESSED never gates teaching, WP1.3 §39.1).
      const { snapshot } = await deriveLocalLearnerEvidence(learnerId);
      if (cancelled) return;
      const context: AssemblyContext = { assemblyPolicyVersion: ASSEMBLY_POLICY_VERSION, allLessons: getLocalReleaseLessons(record.contentRelease) };
      const result = assembleLessonInstance(record.lesson, snapshot, context);
      if (cancelled) return;

      if (result.status === "prerequisite_unresolved") {
        setState({ kind: "prerequisite_blocked", reason: "A prerequisite for this lesson has not yet been mastered, and no remediation lesson is available yet." });
        return;
      }
      if (result.status === "prerequisite_required") {
        setState({ kind: "prerequisite_blocked", reason: "A prerequisite lesson needs to be completed first." });
        return;
      }

      const fresh = startSession(result.instance, learnerId, new Date().toISOString(), randomId());
      await saveLessonSession(fresh);
      if (cancelled) return;
      setState({
        kind: "active",
        record,
        displaySession: fresh,
        pendingNextSession: null,
        questionInstance: questionInstanceFor(record, fresh),
        evaluation: null,
        revealCorrectAnswer: false,
        submitting: false,
      });
    }

    void init().catch((error: unknown) => {
      // Fail loudly and visibly -- an initialization error must never
      // leave the learner stranded on "Preparing lesson...".
      console.error("Lesson Player initialization failed", error);
      if (!cancelled) {
        setState({ kind: "unknown_lesson", detail: error instanceof Error ? error.message : "The lesson could not be prepared." });
      }
    });
    return () => {
      cancelled = true;
    };
  }, [learnerId, authLoading, lessonId, requestedRelease, requestedVersion]);

  const handleSubmit = useCallback(
    async (given: AnswerValue) => {
      if (state.kind !== "active" || !state.questionInstance || state.submitting) return;
      setState({ ...state, submitting: true });
      const result = await submitStepAnswer({ lesson: state.record.lesson, state: state.displaySession, questionInstance: state.questionInstance, given });
      triggerHaptic(result.evaluation.correct ? "correct" : "incorrect");
      setState({
        kind: "active",
        record: state.record,
        // When holding for a retry, the attempt bookkeeping still advanced -- keep it.
        displaySession: result.advanced ? state.displaySession : result.nextState,
        pendingNextSession: result.advanced ? result.nextState : null,
        questionInstance: state.questionInstance,
        evaluation: result.evaluation,
        revealCorrectAnswer: result.revealCorrectAnswer,
        submitting: false,
      });
    },
    [state],
  );

  const handleContinue = useCallback(async () => {
    if (state.kind !== "active") return;
    const record = state.record;

    if (state.evaluation) {
      // Feedback was shown for a graded step -- either apply the already-persisted advance, or (held position) retry the same step.
      const next = state.pendingNextSession;
      if (!next) {
        setState({ ...state, evaluation: null, revealCorrectAnswer: false });
        return;
      }
      if (isSessionComplete(next)) {
        setState({ kind: "complete", record, session: next });
        return;
      }
      setState({
        kind: "active",
        record,
        displaySession: next,
        pendingNextSession: null,
        questionInstance: questionInstanceFor(record, next),
        evaluation: null,
        revealCorrectAnswer: false,
        submitting: false,
      });
      return;
    }

    // Non-graded step: acknowledge and advance now.
    const next = await acknowledgeStep({ state: state.displaySession });
    if (isSessionComplete(next)) {
      triggerHaptic("milestone");
      setState({ kind: "complete", record, session: next });
      return;
    }
    setState({
      kind: "active",
      record,
      displaySession: next,
      pendingNextSession: null,
      questionInstance: questionInstanceFor(record, next),
      evaluation: null,
      revealCorrectAnswer: false,
      submitting: false,
    });
  }, [state]);

  useEffect(() => {
    // CC-08: record "what was just completed" for the course orchestrator
    // (@alp/diagnostic-engine's selectNextActivity) once, when this
    // Lesson Player instance actually reaches its own completion state --
    // never for exits, never for prior sessions restored on init.
    if (state.kind === "complete" && learnerId) {
      void recordRecentCourseCompletion(learnerId, { lessonId: state.session.lessonId, lessonInstanceId: state.session.instanceId });
    }
  }, [state, learnerId]);

  if (state.kind === "loading") {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centered}>
          <Text style={styles.bodyText}>Preparing lesson...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (state.kind === "identity_unavailable") {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centered}>
          <Text style={styles.title}>Sign-in required</Text>
          <Text style={styles.bodyText}>Your account could not be confirmed. Please sign in again to continue learning. Your saved progress is kept on this device.</Text>
          <Pressable accessibilityRole="button" accessibilityLabel="Back to Learn" style={styles.secondaryButton} onPress={exitToLearn}>
            <Text style={styles.secondaryButtonText}>Back to Learn</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  if (state.kind === "unknown_lesson") {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centered}>
          <Text style={styles.title}>Lesson not available</Text>
          <Text style={styles.bodyText}>{state.detail}</Text>
          <Pressable accessibilityRole="button" accessibilityLabel="Back to Learn" style={styles.secondaryButton} onPress={exitToLearn}>
            <Text style={styles.secondaryButtonText}>Back to Learn</Text>
          </Pressable>
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
          <Pressable accessibilityRole="button" accessibilityLabel="Back to Learn" style={styles.secondaryButton} onPress={exitToLearn}>
            <Text style={styles.secondaryButtonText}>Back to Learn</Text>
          </Pressable>
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
          <Pressable accessibilityRole="button" accessibilityLabel="Back to Learn" style={styles.secondaryButton} onPress={exitToLearn}>
            <Text style={styles.secondaryButtonText}>Back to Learn</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  if (state.kind === "complete") {
    return (
      <SafeAreaView style={styles.safeArea}>
        <LessonCompletionView lesson={state.record.lesson} onContinue={exitToLearn} />
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
  const resolved = resolveLessonStep(state.record.lesson, stepId, state.record.lookup);
  const progress = { completed: state.displaySession.completedStepIds.length, total: state.displaySession.stepSequence.length };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <View style={styles.header}>
        <ProgressIndicator current={progress.completed} total={progress.total} testID="lesson-progress" />
        <Pressable accessibilityRole="button" accessibilityLabel="Exit lesson" style={styles.exitButton} onPress={exitToLearn}>
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
          revealCorrectAnswer={state.revealCorrectAnswer}
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
  secondaryButton: {
    minHeight: 44,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: color.border,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.lg,
    marginTop: spacing.md,
  },
  secondaryButtonText: { ...typography.body, color: color.text },
  debugBadge: { alignSelf: "flex-start", marginHorizontal: spacing.lg, marginTop: spacing.xs, paddingHorizontal: spacing.sm, paddingVertical: 2, borderRadius: radius.sm, backgroundColor: "#3A1620" },
  debugBadgeText: { ...typography.code, color: color.danger },
});
