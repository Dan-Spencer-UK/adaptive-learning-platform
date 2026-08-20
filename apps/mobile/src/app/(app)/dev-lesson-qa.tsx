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
 */
import { useEffect, useState } from "react";
import { Link } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { computeLessonContentDependencies } from "@alp/learning-engine";

import { bundledContentReleaseId, getLocalLesson } from "@/lib/lesson-content/local-content-registry";
import { getLessonContentRecord, prepareLessonContent, type LocalContentRecord } from "@/lib/lesson-content/local-content-store";
import { getActiveLessonInstanceId, loadLessonSession } from "@/lib/lesson-session/lesson-session-store";
import { useSession } from "@/lib/auth/session-context";
import { setFoundationState } from "@/lib/storage/foundation-state";
import { getFoundationDb } from "@/lib/storage/db";
import { DEV_LESSON_DEBUG_OVERLAY_KEY, useLessonDebugOverlay } from "@/lib/lesson-content/dev-debug-overlay";
import { color, minTouchTarget, radius, spacing, typography } from "@/lib/tokens";

const QA_LESSON_ID = 'lesson.electrical.ohms-law';

export default function DevLessonQaScreen(): React.JSX.Element {
  const qaLesson = getLocalLesson({ lessonId: QA_LESSON_ID, contentRelease: bundledContentReleaseId() });
  const { session: authSession } = useSession();
  const learnerId = authSession?.user.id ?? null;
  const [contentRecord, setContentRecord] = useState<LocalContentRecord | null>(null);
  const [sessionSummary, setSessionSummary] = useState<string>("(checking...)");
  const debugOverlayEnabled = useLessonDebugOverlay();

  async function refresh(): Promise<void> {
    const record = await getLessonContentRecord(qaLesson.lesson.id, qaLesson.lesson.version, qaLesson.contentRelease);
    setContentRecord(record);

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
    let cancelled = false;
    (async () => {
      const record = await getLessonContentRecord(qaLesson.lesson.id, qaLesson.lesson.version, qaLesson.contentRelease);
      if (cancelled) return;
      setContentRecord(record);

      const activeId = learnerId ? await getActiveLessonInstanceId(learnerId) : null;
      if (cancelled) return;
      if (!activeId) {
        setSessionSummary("No active session.");
        return;
      }
      const session = learnerId ? await loadLessonSession(activeId, learnerId) : null;
      if (cancelled) return;
      setSessionSummary(
        session
          ? `instance ${session.instanceId}\ncurrent index ${session.currentIndex} of ${session.stepSequence.length}\ncompleted: ${session.completedStepIds.join(", ") || "(none)"}`
          : `pointer set to ${activeId} but no session record found`,
      );
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const manifest = computeLessonContentDependencies(qaLesson.lesson);

  return (
    <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title} accessibilityRole="header">
          Lesson Player QA (dev only)
        </Text>

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

        <Link href={{ pathname: "/learn/lesson-player", params: { lessonId: QA_LESSON_ID } }} asChild>
          <Pressable style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]} accessibilityRole="button" accessibilityLabel="Open the Ohm's Law lesson">
            <Text style={styles.primaryButtonText}>Open the Ohm&apos;s Law lesson</Text>
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
  card: { backgroundColor: color.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: color.border, padding: spacing.md, gap: spacing.sm },
  cardLabel: { ...typography.caption, color: color.accent, textTransform: "uppercase" },
  primaryButton: { minHeight: minTouchTarget, borderRadius: radius.md, backgroundColor: color.accent, alignItems: "center", justifyContent: "center" },
  primaryButtonText: { ...typography.body, color: "#fff", fontWeight: "700" },
  secondaryButton: { minHeight: minTouchTarget, borderRadius: radius.md, borderWidth: 1, borderColor: color.border, alignItems: "center", justifyContent: "center" },
  secondaryButtonText: { ...typography.body, color: color.text },
  dangerButton: { minHeight: minTouchTarget, borderRadius: radius.md, borderWidth: 1, borderColor: color.danger, alignItems: "center", justifyContent: "center" },
  dangerButtonText: { ...typography.body, color: color.danger, fontWeight: "600" },
  pressed: { opacity: 0.85 },
});
