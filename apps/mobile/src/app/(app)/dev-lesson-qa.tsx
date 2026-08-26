/**
 * DEV-ONLY Lesson Player QA route (task brief §38) -- visually/
 * architecturally isolated from production learner UI: registered only
 * as an extra `__DEV__`-gated entry point (see (app)/index.tsx), never
 * linked from any learner-facing screen. Lets the Product Owner inspect
 * and reset local Lesson Player state (content readiness, active
 * session, debug overlay) without Mailpit/manual DB edits.
 *
 * Does NOT fabricate evidence scenarios the real Ohm's Law lesson cannot
 * actually exercise (it has no conditional_skip_if_mastered or
 * conditional-retrieval step -- see PROJECT-STATUS.md's recorded
 * real-content gap) -- this screen only exposes mechanisms that are
 * genuinely real for this lesson: content-readiness/session reset and a
 * debug overlay toggle. The real governed misconception branch is
 * already reachable interactively from the lesson itself (answer a
 * misconception-check step incorrectly).
 *
 * CC-12: previously hardcoded to Ohm's Law only. Generalised with a small
 * lesson picker (task brief §18 -- inspecting the adaptive engine must not
 * be tied to a single lesson) and a new card surfacing the real course-
 * orchestration decision (`computeNextCourseActivity`) -- the "adaptive
 * next-step decision" this screen previously had no visibility into at
 * all.
 */
import { useEffect, useState } from "react";
import { Link } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { computeLessonContentDependencies } from "@alp/learning-engine";
import type { ActivityDecision } from "@alp/diagnostic-engine";

import { deriveLocalLearnerEvidence } from "@/lib/evidence-sync/derived-snapshot";
import { syncPendingLessonEvidence, type EvidenceSyncResult } from "@/lib/evidence-sync/evidence-sync";
import { bundledContentReleaseId, getLocalLesson } from "@/lib/lesson-content/local-content-registry";
import { getLessonContentRecord, prepareLessonContent, type LocalContentRecord } from "@/lib/lesson-content/local-content-store";
import { EVIDENCE_EVENT_TYPE, getActiveLessonInstanceId, loadLessonSession } from "@/lib/lesson-session/lesson-session-store";
import { listOutboxEventsByLearner } from "@/lib/storage/outbox";
import { getSupabaseClient } from "@/lib/supabase/client";
import { useSession } from "@/lib/auth/session-context";
import { setFoundationState } from "@/lib/storage/foundation-state";
import { getFoundationDb } from "@/lib/storage/db";
import { DEV_LESSON_DEBUG_OVERLAY_KEY, useLessonDebugOverlay } from "@/lib/lesson-content/dev-debug-overlay";
import { computeNextCourseActivity } from "@/lib/course/next-activity";
import { color, minTouchTarget, radius, spacing, typography } from "@/lib/tokens";

const QA_LESSON_CHOICES = [
  { id: "lesson.electrical.ohms-law", label: "Ohm's Law" },
  { id: "lesson.magnetism.effects-of-current", label: "Magnetism / effects of current" },
] as const;

export default function DevLessonQaScreen(): React.JSX.Element {
  const [qaLessonId, setQaLessonId] = useState<string>(QA_LESSON_CHOICES[0].id);
  const qaLesson = getLocalLesson({ lessonId: qaLessonId, contentRelease: bundledContentReleaseId() });
  const { session: authSession } = useSession();
  const learnerId = authSession?.user.id ?? null;
  const [contentRecord, setContentRecord] = useState<LocalContentRecord | null>(null);
  const [sessionSummary, setSessionSummary] = useState<string>("(checking...)");
  const [evidenceSummary, setEvidenceSummary] = useState<string>("(checking...)");
  const [derivedSummary, setDerivedSummary] = useState<string>("(checking...)");
  const [syncSummary, setSyncSummary] = useState<string>("(not yet run this visit)");
  const [courseDecisionSummary, setCourseDecisionSummary] = useState<string>("(checking...)");
  const debugOverlayEnabled = useLessonDebugOverlay();

  async function refreshCourseDecision(): Promise<void> {
    if (!learnerId) {
      setCourseDecisionSummary("(no authenticated learner)");
      return;
    }
    try {
      const decision: ActivityDecision = await computeNextCourseActivity(learnerId);
      setCourseDecisionSummary(
        `${decision.decisionType}${decision.lessonId ? ` -> ${decision.lessonId}` : ""}\nreason: ${decision.reason}\n${decision.detail}`,
      );
    } catch (error) {
      setCourseDecisionSummary(`(failed: ${error instanceof Error ? error.message : "unknown"})`);
    }
  }

  async function refreshEvidenceAndDerived(): Promise<void> {
    if (!learnerId) {
      setEvidenceSummary("(no authenticated learner)");
      setDerivedSummary("(no authenticated learner)");
      return;
    }
    const events = await listOutboxEventsByLearner(learnerId, EVIDENCE_EVENT_TYPE);
    const pending = events.filter((e) => e.status === "pending").length;
    const recent = events
      .slice(-5)
      .reverse()
      .map((e) => {
        try {
          const p = JSON.parse(e.payload) as { stepId?: string; attemptIndex?: number; evidence?: { correct?: boolean }; answerRevealedBeforeAttempt?: boolean };
          return `${e.status === "pending" ? "PENDING" : "SYNCED "} ${p.stepId ?? "?"} #${p.attemptIndex ?? "?"} ${p.evidence?.correct ? "correct" : "incorrect"}${p.answerRevealedBeforeAttempt ? " (post-reveal)" : ""}`;
        } catch {
          return `${e.status} (unparseable payload)`;
        }
      });
    setEvidenceSummary(`${events.length} local event(s): ${pending} pending, ${events.length - pending} synced.\n${recent.join("\n") || "(none)"}`);

    const { derived, excludedLegacyEvents } = await deriveLocalLearnerEvidence(learnerId);
    const lines: string[] = [];
    lines.push(`mastery policy v${derived.masteryPolicyVersion}; ${derived.attemptsConsidered} attempt(s) considered, ${derived.ignoredAttempts.length} ignored, ${excludedLegacyEvents} legacy excluded`);
    lines.push("capabilities:");
    for (const c of derived.capabilities) lines.push(`  ${c.capabilityId}: ${c.state} (${c.ruleApplied})`);
    if (derived.capabilities.length === 0) lines.push("  (none -- NOT_ASSESSED everywhere)");
    lines.push("families:");
    for (const f of derived.families) lines.push(`  ${f.assertionFamilyId}: ${f.state} (${f.ruleApplied})`);
    if (derived.families.length === 0) lines.push("  (none)");
    lines.push("misconceptions:");
    for (const m of derived.misconceptions) lines.push(`  ${m.misconceptionId}: ${m.currentlyEvidenced ? "CURRENTLY EVIDENCED" : "cleared"} (${m.events.length} event(s))`);
    if (derived.misconceptions.length === 0) lines.push("  (none evidenced)");
    setDerivedSummary(lines.join("\n"));
  }

  async function refresh(): Promise<void> {
    const record = await getLessonContentRecord(qaLesson.lesson.id, qaLesson.lesson.version, qaLesson.contentRelease);
    setContentRecord(record);

    await refreshEvidenceAndDerived();

    const activeId = learnerId ? await getActiveLessonInstanceId(learnerId) : null;
    if (!activeId) {
      setSessionSummary("No active session.");
      return;
    }
    const session = learnerId ? await loadLessonSession(activeId, learnerId) : null;
    setSessionSummary(
      session
        ? `instance ${session.instanceId}\ncurrent index ${session.currentIndex} of ${session.stepSequence.length}\ncompleted: ${session.completedStepIds.join(", ") || "(none)"}`
        : `pointer set to ${activeId} but no session record found`,
    );
  }

  useEffect(() => {
    void (async () => {
      try {
        await refresh();
        await refreshCourseDecision();
      } catch (error) {
        console.warn("Dev QA refresh failed", error);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [learnerId, qaLessonId]);

  const manifest = computeLessonContentDependencies(qaLesson.lesson);

  return (
    <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title} accessibilityRole="header">
          Lesson Player QA (dev only)
        </Text>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>Inspect lesson</Text>
          <View style={styles.choiceRow}>
            {QA_LESSON_CHOICES.map((choice) => (
              <Pressable
                key={choice.id}
                style={({ pressed }) => [styles.choiceButton, choice.id === qaLessonId && styles.choiceButtonActive, pressed && styles.pressed]}
                accessibilityRole="button"
                accessibilityLabel={`Inspect ${choice.label}`}
                onPress={() => setQaLessonId(choice.id)}
              >
                <Text style={[styles.secondaryButtonText, choice.id === qaLessonId && styles.choiceButtonTextActive]}>{choice.label}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>Adaptive next-step decision (course orchestration)</Text>
          <Text style={styles.mono}>{courseDecisionSummary}</Text>
          <Pressable
            style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]}
            accessibilityRole="button"
            accessibilityLabel="Re-compute the adaptive next-step decision"
            onPress={() => void refreshCourseDecision()}
          >
            <Text style={styles.secondaryButtonText}>Re-compute decision</Text>
          </Pressable>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>Content dependency manifest</Text>
          <Text style={styles.body}>
            {manifest.questionBlueprintIds.length} question blueprints, {manifest.formulaFamilyIds.length} formula families,{" "}
            {manifest.workedExampleBlueprintIds.length} worked examples, {manifest.visualAidBlueprintIds.length} visual aids,{" "}
            {manifest.assertionIdentifiers.length} assertion statements, {manifest.misconceptionIdentifiers.length} misconception descriptions.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>Local content status</Text>
          <Text style={styles.body}>{contentRecord ? `${contentRecord.status} (prepared ${contentRecord.preparedAt ?? "never"})` : "(not yet prepared)"}</Text>
          {contentRecord && contentRecord.missingDependencies.length > 0 ? (
            <Text style={styles.body}>Missing: {contentRecord.missingDependencies.map((m) => `${m.category}:${m.id}`).join(", ")}</Text>
          ) : null}
          <Pressable
            style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]}
            accessibilityRole="button"
            accessibilityLabel="Re-prepare local content (mark ready)"
            onPress={() =>
              void prepareLessonContent(manifest, qaLesson.inventory).then(refresh)
            }
          >
            <Text style={styles.secondaryButtonText}>Re-prepare local content (mark ready)</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]}
            accessibilityRole="button"
            accessibilityLabel="Simulate missing content (mark not ready)"
            onPress={() =>
              void prepareLessonContent(manifest, {
                questionBlueprintIds: new Set(),
                formulaFamilyIds: new Set(),
                workedExampleBlueprintIds: new Set(),
                visualAidBlueprintIds: new Set(),
                diagramBlueprintIds: new Set(),
                assertionIdentifiersWithStatements: new Set(),
                misconceptionIdentifiersWithDescriptions: new Set(),
              }).then(refresh)
            }
          >
            <Text style={styles.secondaryButtonText}>Simulate missing content (mark not ready)</Text>
          </Pressable>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>Active session</Text>
          <Text style={styles.body}>{sessionSummary}</Text>
          <Pressable
            style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]}
            accessibilityRole="button"
            accessibilityLabel="Clear active session pointer (next entry starts fresh)"
            onPress={() => void (learnerId ? setFoundationState(`lesson_session.active_instance_id.${learnerId}`, JSON.stringify(null)).then(refresh) : refresh())}
          >
            <Text style={styles.secondaryButtonText}>Clear active session pointer</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [styles.dangerButton, pressed && styles.pressed]}
            accessibilityRole="button"
            accessibilityLabel="Wipe all local lesson data (session, content, evidence)"
            onPress={() =>
              void (async () => {
                const db = await getFoundationDb();
                await db.execAsync(
                  "DELETE FROM foundation_state WHERE key LIKE 'lesson_session%'; DELETE FROM local_lesson_content; DELETE FROM foundation_outbox WHERE event_type = 'lesson.evidence';",
                );
                await refresh();
              })()
            }
          >
            <Text style={styles.dangerButtonText}>Wipe all local lesson data</Text>
          </Pressable>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>Local evidence events (CC-07)</Text>
          <Text style={styles.mono}>{evidenceSummary}</Text>
          <Pressable
            style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]}
            accessibilityRole="button"
            accessibilityLabel="Sync pending evidence to server now"
            onPress={() =>
              void (async () => {
                if (!learnerId) {
                  setSyncSummary("No authenticated learner -- nothing uploaded, nothing lost.");
                  return;
                }
                try {
                  const result: EvidenceSyncResult = await syncPendingLessonEvidence({ client: getSupabaseClient(), authenticatedLearnerId: learnerId });
                  setSyncSummary(
                    result.failed
                      ? `FAILED (events remain pending): ${result.errorDetail ?? "unknown"}`
                      : `uploaded ${result.uploaded}, skipped ${result.skippedOtherLearner} (other learner) + ${result.skippedUnsyncable} (unsyncable legacy)`,
                  );
                } catch (error) {
                  setSyncSummary(`FAILED (events remain pending): ${error instanceof Error ? error.message : "unknown"}`);
                }
                await refresh();
              })()
            }
          >
            <Text style={styles.secondaryButtonText}>Sync pending evidence now</Text>
          </Pressable>
          <Text style={styles.body}>Last sync: {syncSummary}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>Derived learner state (deterministic, local, offline)</Text>
          <Text style={styles.mono}>{derivedSummary}</Text>
          <Pressable
            style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]}
            accessibilityRole="button"
            accessibilityLabel="Re-derive learner state from local evidence"
            onPress={() => void refreshEvidenceAndDerived()}
          >
            <Text style={styles.secondaryButtonText}>Re-derive from local evidence</Text>
          </Pressable>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>Debug overlay</Text>
          <Text style={styles.body}>When enabled, the Lesson Player shows the current step id/type in a small badge.</Text>
          <Pressable
            style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]}
            accessibilityRole="button"
            accessibilityLabel={debugOverlayEnabled ? "Disable debug overlay" : "Enable debug overlay"}
            onPress={() => void setFoundationState(DEV_LESSON_DEBUG_OVERLAY_KEY, JSON.stringify(!debugOverlayEnabled))}
          >
            <Text style={styles.secondaryButtonText}>{debugOverlayEnabled ? "Disable" : "Enable"} debug overlay</Text>
          </Pressable>
        </View>

        <Link href={{ pathname: "/learn/lesson-player", params: { lessonId: qaLessonId } }} asChild>
          <Pressable style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]} accessibilityRole="button" accessibilityLabel={`Open the ${qaLesson.lesson.title} lesson`}>
            <Text style={styles.primaryButtonText}>Open the {qaLesson.lesson.title} lesson</Text>
          </Pressable>
        </Link>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: color.background },
  container: { padding: spacing.lg, gap: spacing.md },
  title: { ...typography.title, color: color.text },
  body: { ...typography.body, color: color.textSecondary },
  mono: { ...typography.caption, color: color.textSecondary, fontFamily: "monospace" },
  card: { backgroundColor: color.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: color.border, padding: spacing.md, gap: spacing.sm },
  cardLabel: { ...typography.caption, color: color.accent, textTransform: "uppercase" },
  choiceRow: { flexDirection: "row", gap: spacing.sm },
  choiceButton: { flex: 1, minHeight: minTouchTarget, borderRadius: radius.md, borderWidth: 1, borderColor: color.border, alignItems: "center", justifyContent: "center", paddingHorizontal: spacing.sm },
  choiceButtonActive: { borderColor: color.accent, backgroundColor: color.surface },
  choiceButtonTextActive: { color: color.accent, fontWeight: "700" },
  primaryButton: { minHeight: minTouchTarget, borderRadius: radius.md, backgroundColor: color.accent, alignItems: "center", justifyContent: "center" },
  primaryButtonText: { ...typography.body, color: "#fff", fontWeight: "700" },
  secondaryButton: { minHeight: minTouchTarget, borderRadius: radius.md, borderWidth: 1, borderColor: color.border, alignItems: "center", justifyContent: "center" },
  secondaryButtonText: { ...typography.body, color: color.text },
  dangerButton: { minHeight: minTouchTarget, borderRadius: radius.md, borderWidth: 1, borderColor: color.danger, alignItems: "center", justifyContent: "center" },
  dangerButtonText: { ...typography.body, color: color.danger, fontWeight: "600" },
  pressed: { opacity: 0.85 },
});
