/**
 * Learn hub. The top card is CC-08's course-orchestration entry point:
 * @alp/diagnostic-engine's `selectNextActivity` (via
 * ./course/next-activity.ts) deterministically decides which real
 * lesson comes next -- across lesson boundaries, entirely from local
 * evidence -- and this screen only renders that decision; it never
 * lets the learner pick a lesson id itself (task brief §20's "avoid a
 * fake manual choose-the-next-lesson button that bypasses
 * orchestration").
 *
 * CC-12D: the four topic cards below reuse CC-05C's governed
 * `PROVING_FAMILIES` list purely as a browse-by-topic menu -- each now
 * opens the SAME real, current Lesson Player (`/learn/lesson-player`)
 * the top card does, via `PROVING_FAMILY_LESSON_IDS`, never the CC-05C
 * static proving-slice screen (`/learn/[family]`) those cards used to
 * link to. That screen is retired from all in-app navigation (see its
 * own header comment) -- a Product Owner emulator finding traced a
 * learner reaching an outdated, non-adaptive teaching screen with stale
 * imagery straight to this Link. This is the ONE production learner
 * lesson runtime for governed adaptive lessons; do not add a second
 * production route to lesson content, here or elsewhere.
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
import { PROVING_FAMILIES } from "@/lib/proving-content/unit202-proving-fixture";
import { getSupabaseClient } from "@/lib/supabase/client";
import { color, minTouchTarget, radius, spacing, typography } from "@/lib/tokens";

/**
 * CC-12D: each proving family below corresponds 1:1 to a real governed
 * lesson already reached by course orchestration -- the SAME four lessons
 * `UNIT202_ADAPTIVE_VERTICAL` (packages/diagnostic-engine/src/course-
 * definitions.ts) sequences, in the same order. There is no mechanical way
 * to derive this mapping (a lesson's steps can span several assertion
 * families -- e.g. this magnetism lesson also teaches
 * electrical.emf_and_generation -- so a lesson has no single top-level
 * assertionFamilyId to look up), so it is a small, explicit, governed-ID
 * table, cross-checked at test time against both real corpora.
 */
const PROVING_FAMILY_LESSON_IDS: Readonly<Record<string, string>> = {
  "electrical.ohms_law": "lesson.electrical.ohms-law",
  "electrical.series_circuits": "lesson.electrical.resistors-series",
  "electrical.parallel_circuits": "lesson.electrical.resistors-parallel",
  "electrical.magnetism_and_electromagnetism": "lesson.magnetism.effects-of-current",
};

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

        <Text style={styles.intro}>Or jump directly to any of the four governed Unit 202 topics below.</Text>
        {PROVING_FAMILIES.map((family) => {
          const lessonId = PROVING_FAMILY_LESSON_IDS[family.id];
          if (!lessonId) return null;
          return (
            <Link key={family.id} href={{ pathname: "/learn/lesson-player", params: { lessonId } }} asChild>
              <Pressable
                style={({ pressed }) => [styles.card, pressed && styles.pressed]}
                accessibilityRole="button"
                accessibilityLabel={`Open ${family.title} lesson`}
              >
                <Text style={styles.cardTitle}>{family.title}</Text>
                <Text style={styles.cardBody}>{family.learningIntent}</Text>
              </Pressable>
            </Link>
          );
        })}
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
