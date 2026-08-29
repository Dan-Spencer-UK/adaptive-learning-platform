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
import { ASSEMBLY_POLICY_VERSION, assembleLessonInstance, computeLessonContentDependencies, type AssemblyContext, type PrerequisiteAdvisory } from "@alp/learning-engine";
import type { AnswerValue, EvaluationResult, GeneratedQuestionInstance } from "@alp/calculation-engine";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { LessonCompletionView } from "@/components/lesson/LessonCompletionView";
import { LessonStepView } from "@/components/lesson/LessonStepView";
import { ScrollableLessonStep } from "@/components/lesson/ScrollableLessonStep";
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
import { resolveDevDebugAnswer } from "@/lib/lesson-content/answer-input-dispatch";
import { useLessonDebugOverlay } from "@/lib/lesson-content/dev-debug-overlay";
import { acknowledgeStep, submitStepAnswer } from "@/lib/lesson-session/lesson-controller";
import { currentStepId, isSessionComplete, startSession, type LessonSessionState } from "@/lib/lesson-session/lesson-session-controller";
import { getActiveLessonInstanceId, loadLessonSession, saveLessonSession } from "@/lib/lesson-session/lesson-session-store";
import { recordRecentCourseCompletion } from "@/lib/course/recent-completion-store";
import { color, minTouchTarget, radius, spacing, typography } from "@/lib/tokens";

type ScreenState =
  | { readonly kind: "loading" }
  | { readonly kind: "identity_unavailable" }
  | { readonly kind: "unknown_lesson"; readonly detail: string }
  | { readonly kind: "content_unavailable"; readonly missing: readonly { category: string; id: string }[] }
  | {
      readonly kind: "active";
      readonly record: LocalLessonRecord;
      readonly displaySession: LessonSessionState;
      readonly pendingNextSession: LessonSessionState | null;
      readonly questionInstance: GeneratedQuestionInstance | null;
      readonly evaluation: EvaluationResult | null;
      readonly revealCorrectAnswer: boolean;
      readonly submitting: boolean;
      // CC-12G: prerequisite evidence is advisory only -- it must never
      // block direct lesson access (Product Owner product-architecture
      // decision; see @alp/learning-engine's PrerequisiteAdvisory doc
      // comment for the full rationale). Plain-language readiness notes,
      // never an internal family id or engine term.
      readonly prerequisiteAdvisories: readonly string[];
    }
  | { readonly kind: "complete"; readonly record: LocalLessonRecord; readonly session: LessonSessionState };

function describeAdvisory(advisory: PrerequisiteAdvisory): string {
  return advisory.remediation.status === "available"
    ? `Your recent evidence suggests "${advisory.remediation.lesson.title}" might be worth reviewing before this lesson -- entirely optional, you can carry on here.`
    : "Your recent evidence suggests some earlier material may be worth revisiting before this lesson -- entirely optional, you can carry on here.";
}

function questionInstanceForStep(record: LocalLessonRecord, session: LessonSessionState, stepId: string): GeneratedQuestionInstance | null {
  const step = record.lesson.steps.find((s) => s.id === stepId);
  if (!step?.questionBlueprintId) return null;
  const blueprint = record.lookup.questionBlueprints.find((b) => b.id === step.questionBlueprintId);
  if (!blueprint) {
    throw new UnknownLessonError(`question blueprint '${step.questionBlueprintId}' referenced by step '${stepId}' is not in local release '${record.contentRelease}'`);
  }
  return generateLessonQuestion({
    blueprint,
    formulaFamilies: record.lookup.formulaFamilies,
    // CC-12 fix: previously omitted -- see generate-lesson-question.ts's
    // own header comment for the real production crash this caused.
    diagramBlueprints: record.lookup.diagramBlueprints,
    workedExampleBlueprints: record.lookup.workedExampleBlueprints,
    contentRelease: record.contentRelease,
    blueprintVersion: record.questionBlueprintVersion,
    instanceId: session.instanceId,
    stepId,
  });
}

function questionInstanceFor(record: LocalLessonRecord, session: LessonSessionState): GeneratedQuestionInstance | null {
  const stepId = currentStepId(session);
  if (!stepId) return null;
  return questionInstanceForStep(record, session, stepId);
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
  // CC-12G: "previous step" review. Deliberately a plain index into the
  // session's own `completedStepIds` (the true, branch-skip-free
  // chronological walk history -- never `stepSequence`/`currentIndex`,
  // which can contain steps a branch jump skipped over and the learner
  // never actually saw) -- not a call into lesson-session-controller.ts,
  // which stays exactly the forward-only adaptive-routing/resume source
  // of truth it already is. `null` means "showing the live current
  // step" (normal mode); reviewing never mutates `displaySession` and is
  // reset whenever a fresh/resumed session is loaded.
  const [reviewIndex, setReviewIndex] = useState<number | null>(null);

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
          setReviewIndex(null);
          setState({
            kind: "active",
            record,
            displaySession: resumed,
            pendingNextSession: null,
            questionInstance: questionInstanceFor(record, resumed),
            evaluation: null,
            revealCorrectAnswer: false,
            submitting: false,
            prerequisiteAdvisories: [],
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

      // CC-12G: prerequisite evidence never blocks direct lesson access
      // (Product Owner product-architecture decision) -- `result.instance`
      // is always the requested lesson's own playable instance; any
      // unmet-prerequisite evidence surfaces only as an advisory note
      // inside the lesson, never a dead-end screen.
      const prerequisiteAdvisories = result.status === "ready_with_prerequisite_advisory" ? result.advisories.map(describeAdvisory) : [];

      const fresh = startSession(result.instance, learnerId, new Date().toISOString(), randomId());
      await saveLessonSession(fresh);
      if (cancelled) return;
      setReviewIndex(null);
      setState({
        kind: "active",
        record,
        displaySession: fresh,
        pendingNextSession: null,
        questionInstance: questionInstanceFor(record, fresh),
        evaluation: null,
        revealCorrectAnswer: false,
        submitting: false,
        prerequisiteAdvisories,
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
      // Reviewing a previous step must never be able to reach this --
      // the review render never wires onSubmit to this handler, but this
      // guard makes it structurally impossible even if that ever changed.
      if (reviewIndex !== null) return;
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
        prerequisiteAdvisories: state.prerequisiteAdvisories,
      });
    },
    [state, reviewIndex],
  );

  const handleContinue = useCallback(async () => {
    if (reviewIndex !== null) return;
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
        prerequisiteAdvisories: state.prerequisiteAdvisories,
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
      prerequisiteAdvisories: state.prerequisiteAdvisories,
    });
  }, [state, reviewIndex]);

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

  if (state.kind === "complete") {
    return (
      <SafeAreaView style={styles.safeArea}>
        <LessonCompletionView lesson={state.record.lesson} onContinue={exitToLearn} />
      </SafeAreaView>
    );
  }

  // CC-12G: "previous step" review, sourced from completedStepIds (the
  // real chronological walk history) -- see reviewIndex's own declaration
  // comment above for why this must never be stepSequence/currentIndex
  // arithmetic.
  const completedStepIds = state.displaySession.completedStepIds;
  const isReviewing = reviewIndex !== null;
  const canGoPrevious = isReviewing ? reviewIndex > 0 : completedStepIds.length > 0;
  const goPrevious = () => {
    if (isReviewing) {
      if (reviewIndex > 0) setReviewIndex(reviewIndex - 1);
    } else if (completedStepIds.length > 0) {
      setReviewIndex(completedStepIds.length - 1);
    }
  };
  const goNext = () => {
    if (!isReviewing) return;
    setReviewIndex(reviewIndex < completedStepIds.length - 1 ? reviewIndex + 1 : null);
  };

  const stepId = isReviewing ? completedStepIds[reviewIndex] : currentStepId(state.displaySession);
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
  // Reviewing renders the SAME deterministic question instance the
  // learner originally saw (same instanceId + stepId seed -- see
  // generate-lesson-question.ts's deriveStepSeed), never a fresh one, and
  // never with evaluation/reveal state -- this is a read-only look, not a
  // fresh attempt.
  const displayedQuestionInstance = isReviewing ? questionInstanceForStep(state.record, state.displaySession, stepId) : state.questionInstance;

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Previous lesson step"
          accessibilityState={{ disabled: !canGoPrevious }}
          style={styles.navButton}
          onPress={goPrevious}
          disabled={!canGoPrevious}
        >
          <Text style={[styles.navText, !canGoPrevious && styles.navTextDisabled]}>‹</Text>
        </Pressable>
        <View style={styles.progressWrap}>
          <ProgressIndicator current={progress.completed} total={progress.total} testID="lesson-progress" />
        </View>
        {isReviewing ? (
          <Pressable accessibilityRole="button" accessibilityLabel="Next lesson step" style={styles.navButton} onPress={goNext}>
            <Text style={styles.navText}>›</Text>
          </Pressable>
        ) : null}
        <Pressable accessibilityRole="button" accessibilityLabel="Exit lesson" style={styles.exitButton} onPress={exitToLearn}>
          <Text style={styles.exitText}>Exit</Text>
        </Pressable>
      </View>
      {isReviewing ? (
        <View style={styles.reviewBanner} testID="lesson-review-banner">
          <Text style={styles.reviewBannerText}>Reviewing a previous step -- use Next to return to where you left off.</Text>
        </View>
      ) : state.prerequisiteAdvisories.length > 0 ? (
        <View style={styles.reviewBanner} testID="lesson-prerequisite-advisory">
          {state.prerequisiteAdvisories.map((advisory) => (
            <Text key={advisory} style={styles.reviewBannerText}>
              {advisory}
            </Text>
          ))}
        </View>
      ) : null}
      {debugOverlayEnabled ? (
        <View style={styles.debugBadge} testID="lesson-debug-overlay">
          <Text style={styles.debugBadgeText}>
            {resolved.step.id} ({resolved.step.type})
          </Text>
          {/* CC-12H: dev-only ground-truth answer readout for the runtime
              QA walker (tools/qa/) -- lets it read the correct submission
              directly off the live screen rather than replicating
              learner-identity/RNG seeding offline. Never shown to a real
              learner (debugOverlayEnabled defaults off, toggled only from
              the __DEV__-only dev-lesson-qa screen). */}
          {resolved.questionBlueprint && displayedQuestionInstance
            ? (() => {
                const debugAnswer = resolveDevDebugAnswer(resolved.questionBlueprint, displayedQuestionInstance, resolved.formulaFamily);
                return (
                  <Text style={styles.debugBadgeText} testID="lesson-debug-expected-answer">
                    {debugAnswer.tapLabel ? `tap: ${debugAnswer.tapLabel}` : `expected: ${debugAnswer.expectedValue}`}
                  </Text>
                );
              })()
            : null}
        </View>
      ) : null}
      <ScrollableLessonStep key={`${resolved.step.id}:${isReviewing}`} testID="lesson-step-scroll-container">
        <LessonStepView
          resolved={resolved}
          questionInstance={displayedQuestionInstance}
          evaluation={isReviewing ? null : state.evaluation}
          revealCorrectAnswer={isReviewing ? false : state.revealCorrectAnswer}
          onSubmit={(value) => void handleSubmit(value)}
          onContinue={() => void handleContinue()}
          submitting={state.submitting}
          readOnly={isReviewing}
        />
      </ScrollableLessonStep>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: color.background },
  centered: { flex: 1, alignItems: "center", justifyContent: "center", padding: spacing.lg, gap: spacing.sm },
  header: { flexDirection: "row", alignItems: "center", gap: spacing.md, paddingHorizontal: spacing.lg, paddingTop: spacing.sm },
  exitButton: { padding: spacing.xs },
  exitText: { ...typography.body, color: color.textSecondary },
  progressWrap: { flex: 1 },
  navButton: { minHeight: minTouchTarget, minWidth: minTouchTarget, alignItems: "center", justifyContent: "center" },
  navText: { fontSize: 24, lineHeight: 28, color: color.accent, fontWeight: "700" },
  navTextDisabled: { color: color.textSecondary, opacity: 0.4 },
  reviewBanner: { marginHorizontal: spacing.lg, marginTop: spacing.xs, paddingVertical: spacing.xs, paddingHorizontal: spacing.sm, borderRadius: radius.sm, backgroundColor: color.surface, borderWidth: 1, borderColor: color.border },
  reviewBannerText: { ...typography.caption, color: color.textSecondary, textAlign: "center" },
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
