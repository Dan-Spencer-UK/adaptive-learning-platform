/**
 * Learn hub. The top card is CC-08's course-orchestration entry point:
 * @alp/diagnostic-engine's `selectNextActivity` (via
 * ./course/next-activity.ts) deterministically decides which real
 * lesson comes next -- across lesson boundaries, entirely from local
 * evidence -- and this screen renders that decision, but it is a
 * RECOMMENDATION, not a gate: below it, every lesson in the current
 * governed production release is directly listed and directly openable
 * (task brief §20's "avoid a fake manual choose-the-next-lesson button
 * that bypasses orchestration" is about not letting the learner steer
 * orchestration's own choice of "what's next"; it was never a rule that
 * only orchestration's four vertical-slice lessons may be reachable at
 * all -- see CC-12H's own correction below).
 *
 * CC-12H correction: this screen previously listed only the four lessons
 * `UNIT202_ADAPTIVE_VERTICAL` (packages/diagnostic-engine/src/course-
 * definitions.ts) currently sequences, via a hardcoded
 * `PROVING_FAMILY_LESSON_IDS` id map -- proving-slice scaffolding
 * (CC-05C/CC-12D) that was never actually production lesson-availability
 * policy, but had silently become the only route to ANY lesson once the
 * old static proving-slice browse screen (`/learn/[family]`) was retired
 * from navigation. The other 20 governed, content-complete Unit 202
 * lessons were reachable by no real navigation path at all. Fixed by
 * deriving the catalogue directly from the current bundled production
 * release (`getLocalReleaseLessons`) instead of a hand-maintained map --
 * every lesson the release actually carries is listed, automatically,
 * with no per-lesson navigation code to keep in sync. Every card still
 * opens the SAME real, current Lesson Player (`/learn/lesson-player`);
 * this remains the ONE production learner lesson runtime for governed
 * adaptive lessons -- do not add a second production route to lesson
 * content, here or elsewhere. See `learn-hub-catalogue.test.ts` for the
 * regression coverage proving the catalogue derives from release
 * membership, recommendation stays independent of availability, and no
 * prerequisite/mastery state can remove a lesson from it.
 */
import { Link, useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import type { ActivityDecision } from "@alp/diagnostic-engine";

import { useSession } from "@/lib/auth/session-context";
import { computeNextCourseActivity } from "@/lib/course/next-activity";
import { syncPendingLessonEvidence } from "@/lib/evidence-sync/evidence-sync";
import { getLocalReleaseLessons, bundledContentReleaseId } from "@/lib/lesson-content/local-content-registry";
import { getSupabaseClient } from "@/lib/supabase/client";
import { color, minTouchTarget, radius, spacing, typography } from "@/lib/tokens";

type NextActivityState = { kind: "loading" } | { kind: "ready"; decision: ActivityDecision; lessonTitle: string | null } | { kind: "error"; detail: string };

export default function LearnIndexScreen(): React.JSX.Element {
  const { session } = useSession();
  const learnerId = session?.user.id ?? null;
  const router = useRouter();
  const [nextActivity, setNextActivity] = useState<NextActivityState>({ kind: "loading" });

  // CC-08: recomputed every time the Learn context gains focus (which
  // includes returning from a lesson), so a just-completed lesson's
  // fresh local evidence immediately drives the next real decision --
  // no network round trip, entirely from local state (task brief §21).
  useFocusEffect(
    useCallback(() => {
      if (!learnerId) return;
      let cancelled = false;
      setNextActivity({ kind: "loading" });
      void computeNextCourseActivity(learnerId)
        .then((decision) => {
          if (cancelled) return;
          const lessonTitle = decision.lessonId
            ? (getLocalReleaseLessons(bundledContentReleaseId()).find((l) => l.id === decision.lessonId)?.title ?? decision.lessonId)
            : null;
          setNextActivity({ kind: "ready", decision, lessonTitle });
        })
        .catch((error: unknown) => {
          if (cancelled) return;
          console.error("Course orchestration decision failed", error);
          setNextActivity({ kind: "error", detail: error instanceof Error ? error.message : "The next activity could not be determined." });
        });
      return () => {
        cancelled = true;
      };
    }, [learnerId]),
  );

  // CC-07: opportunistic, fire-and-forget background evidence sync every
  // time the Learn context gains focus (which includes returning from a
  // lesson). Never blocks navigation or lesson launch; failures leave
  // events pending for the next opportunity. The Lesson Player itself
  // stays network-free.
  useFocusEffect(
    useCallback(() => {
      if (!learnerId) return;
      void syncPendingLessonEvidence({ client: getSupabaseClient(), authenticatedLearnerId: learnerId })
        .then((result) => {
          if (result.failed) {
            console.warn(`Background lesson-evidence sync failed; events remain pending. ${result.errorDetail ?? ""}`);
          }
        })
        .catch((error: unknown) => {
          console.warn("Background lesson-evidence sync failed; events remain pending.", error);
        });
    }, [learnerId]),
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
      <ScrollView contentContainerStyle={styles.container}>
        {nextActivity.kind === "loading" && (
          <View style={[styles.card, styles.lessonPlayerCard]}>
            <ActivityIndicator color={color.accent} accessibilityLabel="Deciding your next activity" />
          </View>
        )}

        {nextActivity.kind === "error" && (
          <View style={[styles.card, styles.lessonPlayerCard]}>
            <Text style={styles.cardTitle}>Could not determine your next activity</Text>
            <Text style={styles.cardBody}>{nextActivity.detail}</Text>
          </View>
        )}

        {nextActivity.kind === "ready" && nextActivity.decision.decisionType === "COMPLETE_SLICE" && (
          <View style={[styles.card, styles.lessonPlayerCard]}>
            <Text style={styles.cardTitle}>Adaptive vertical complete</Text>
            <Text style={styles.cardBody}>{nextActivity.decision.detail}</Text>
          </View>
        )}

        {nextActivity.kind === "ready" && nextActivity.decision.decisionType === "BLOCKED" && (
          <View style={[styles.card, styles.lessonPlayerCard]}>
            <Text style={styles.cardTitle}>Not available right now</Text>
            <Text style={styles.cardBody}>{nextActivity.decision.detail}</Text>
          </View>
        )}

        {nextActivity.kind === "ready" && nextActivity.decision.lessonId && (
          <Pressable
            style={({ pressed }) => [styles.card, styles.lessonPlayerCard, pressed && styles.pressed]}
            accessibilityRole="button"
            accessibilityLabel={`Continue: ${nextActivity.lessonTitle ?? nextActivity.decision.lessonId}`}
            onPress={() =>
              router.push({ pathname: "/learn/lesson-player", params: { lessonId: nextActivity.decision.lessonId! } })
            }
          >
            <Text style={styles.cardMetaText}>{decisionLabel(nextActivity.decision.decisionType)}</Text>
            <Text style={styles.cardTitle}>{nextActivity.lessonTitle}</Text>
            <Text style={styles.cardBody}>{nextActivity.decision.detail}</Text>
          </Pressable>
        )}

        <Text style={styles.intro}>Or browse and open any current Unit 202 lesson directly.</Text>
        {getLocalReleaseLessons(bundledContentReleaseId()).map((lesson) => (
          <Link key={lesson.id} href={{ pathname: "/learn/lesson-player", params: { lessonId: lesson.id } }} asChild>
            <Pressable
              style={({ pressed }) => [styles.card, pressed && styles.pressed]}
              accessibilityRole="button"
              accessibilityLabel={`Open ${lesson.title} lesson`}
            >
              <Text style={styles.cardTitle}>{lesson.title}</Text>
              <Text style={styles.cardBody}>{lesson.learnerFacingDescription}</Text>
            </Pressable>
          </Link>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

function decisionLabel(decisionType: ActivityDecision["decisionType"]): string {
  switch (decisionType) {
    case "START_TARGET":
      return "Start";
    case "CONTINUE_TARGET":
      return "Continue";
    case "REMEDIATE_FOUNDATION":
      return "Recommended: build a foundation first";
    case "RETEST_FOUNDATION":
      return "Recommended: try again";
    case "RETURN_TO_VOCATIONAL_TRANSFER":
      return "Ready to return";
    case "ADVANCE":
      return "Next up";
    default:
      return "";
  }
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: color.background },
  container: { padding: spacing.lg, gap: spacing.md },
  intro: { ...typography.body, color: color.textSecondary },
  card: {
    minHeight: minTouchTarget * 1.5,
    backgroundColor: color.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: color.border,
    padding: spacing.md,
    gap: spacing.xs,
  },
  pressed: { opacity: 0.85 },
  lessonPlayerCard: { borderColor: color.accent, backgroundColor: "#16223A" },
  cardTitle: { ...typography.title, fontSize: 18, color: color.text },
  cardBody: { ...typography.body, color: color.textSecondary },
  cardMetaText: { ...typography.caption, color: color.accent },
});
