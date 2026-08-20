/**
 * CC-05C: family picker -- the entry point of the native proving slice.
 * Lists the four representative governed families this slice demonstrates
 * end-to-end (design doc §39's recommended proving slice: Ohm's law,
 * series resistance, parallel resistance, one directional/diagram-heavy
 * family).
 */
import { Link, useFocusEffect } from "expo-router";
import { useCallback } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useSession } from "@/lib/auth/session-context";
import { syncPendingLessonEvidence } from "@/lib/evidence-sync/evidence-sync";
import { PROVING_FAMILIES } from "@/lib/proving-content/unit202-proving-fixture";
import { getSupabaseClient } from "@/lib/supabase/client";
import { color, minTouchTarget, radius, spacing, typography } from "@/lib/tokens";

export default function LearnIndexScreen(): React.JSX.Element {
  const { session } = useSession();
  const learnerId = session?.user.id ?? null;

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
        <Link href={{ pathname: "/learn/lesson-player", params: { lessonId: "lesson.electrical.ohms-law" } }} asChild>
          <Pressable
            style={({ pressed }) => [styles.card, styles.lessonPlayerCard, pressed && styles.pressed]}
            accessibilityRole="button"
            accessibilityLabel="Open the Ohm's Law lesson"
          >
            <Text style={styles.cardTitle}>Ohm&apos;s Law (full lesson)</Text>
            <Text style={styles.cardBody}>The step-based Lesson Player -- teaching, guided practice and adaptive remediation together.</Text>
          </Pressable>
        </Link>

        <Text style={styles.intro}>
          A proving slice across four governed Unit 202 topics: pick one to see teaching, generated questions, local
          marking and evidence end-to-end.
        </Text>
        {PROVING_FAMILIES.map((family) => (
          <Link key={family.id} href={{ pathname: "/learn/[family]", params: { family: family.id } }} asChild>
            <Pressable
              style={({ pressed }) => [styles.card, pressed && styles.pressed]}
              accessibilityRole="button"
              accessibilityLabel={`Open ${family.title} lesson`}
            >
              <Text style={styles.cardTitle}>{family.title}</Text>
              <Text style={styles.cardBody}>{family.learningIntent}</Text>
              <View style={styles.cardMeta}>
                <Text style={styles.cardMetaText}>{family.questionBlueprints.length} practice questions</Text>
              </View>
            </Pressable>
          </Link>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
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
  cardMeta: { marginTop: spacing.xs },
  cardMetaText: { ...typography.caption, color: color.accent },
});
