/**
 * Authenticated foundation/home screen. Deliberately minimal (see
 * docs/architecture/evidence/CC-04N-MOBILE-FOUNDATION-EVIDENCE.md --
 * no syllabus browser, lessons, questions or progress UI belong here;
 * those are CC-05+ scope). Demonstrates, in the ordinary (non-dev-only)
 * flow: authenticated session state, and local-state restoration across
 * restart via `foundation_state` (see lib/storage/foundation-state.ts) --
 * the "app restart does not destroy demonstration state" requirement.
 */
import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useSession } from "@/lib/auth/session-context";
import { getFoundationState, setFoundationState } from "@/lib/storage/foundation-state";
import { color, minTouchTarget, radius, spacing, typography } from "@/lib/tokens";

const LAST_OPENED_KEY = "home.last_opened_at";

export default function HomeScreen(): React.JSX.Element {
  const { session, signOut } = useSession();
  const [previousOpenedAt, setPreviousOpenedAt] = useState<string | null>(null);
  const [restoreChecked, setRestoreChecked] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const previous = await getFoundationState(LAST_OPENED_KEY);
      if (cancelled) return;
      setPreviousOpenedAt(previous);
      setRestoreChecked(true);
      await setFoundationState(LAST_OPENED_KEY, new Date().toISOString());
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
      <View style={styles.container}>
        <Text style={styles.title} accessibilityRole="header">
          Foundation home
        </Text>
        <Text style={styles.body}>Signed in as {session?.user.email ?? "unknown"}</Text>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>Local-state restoration proof</Text>
          {!restoreChecked ? (
            <Text style={styles.body}>Checking local state...</Text>
          ) : previousOpenedAt ? (
            <Text style={styles.body}>
              This screen was previously opened at{"\n"}
              {previousOpenedAt}
              {"\n"}(read from on-device SQLite before this visit was recorded).
            </Text>
          ) : (
            <Text style={styles.body}>
              No prior visit recorded yet -- this is the first open. Restart the app to see this
              value persist.
            </Text>
          )}
        </View>

        <Link href="/learn" asChild>
          <Pressable
            style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}
            accessibilityRole="button"
            accessibilityLabel="Open Learn"
          >
            <Text style={styles.primaryButtonText}>Learn</Text>
          </Pressable>
        </Link>

        {__DEV__ ? (
          <Link href="/dev-proof" asChild>
            <Pressable
              style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]}
              accessibilityRole="button"
              accessibilityLabel="Open foundation diagnostics"
            >
              <Text style={styles.secondaryButtonText}>Foundation diagnostics (dev only)</Text>
            </Pressable>
          </Link>
        ) : null}

        {__DEV__ ? (
          <Link href="/dev-lesson-qa" asChild>
            <Pressable
              style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]}
              accessibilityRole="button"
              accessibilityLabel="Open Lesson Player QA"
            >
              <Text style={styles.secondaryButtonText}>Lesson Player QA (dev only)</Text>
            </Pressable>
          </Link>
        ) : null}

        {__DEV__ ? (
          <Link href="/dev-proving-visuals" asChild>
            <Pressable
              style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]}
              accessibilityRole="button"
              accessibilityLabel="Open proving-slice visual QA"
            >
              <Text style={styles.secondaryButtonText}>Proving-slice visual QA (dev only)</Text>
            </Pressable>
          </Link>
        ) : null}

        <Pressable
          style={({ pressed }) => [styles.dangerButton, pressed && styles.pressed]}
          onPress={() => void signOut()}
          accessibilityRole="button"
          accessibilityLabel="Sign out"
        >
          <Text style={styles.dangerButtonText}>Sign out</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: color.background,
  },
  container: {
    flex: 1,
    padding: spacing.lg,
    gap: spacing.md,
  },
  title: {
    ...typography.title,
    color: color.text,
  },
  body: {
    ...typography.body,
    color: color.textSecondary,
  },
  card: {
    backgroundColor: color.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: color.border,
    padding: spacing.md,
    gap: spacing.xs,
  },
  cardLabel: {
    ...typography.caption,
    color: color.accent,
    textTransform: "uppercase",
  },
  primaryButton: {
    minHeight: minTouchTarget,
    borderRadius: radius.md,
    backgroundColor: color.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonText: {
    ...typography.body,
    color: "#fff",
    fontWeight: "700",
  },
  secondaryButton: {
    minHeight: minTouchTarget,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: color.border,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButtonText: {
    ...typography.body,
    color: color.text,
  },
  dangerButton: {
    minHeight: minTouchTarget,
    borderRadius: radius.md,
    backgroundColor: color.surface,
    borderWidth: 1,
    borderColor: color.danger,
    alignItems: "center",
    justifyContent: "center",
    marginTop: "auto",
  },
  dangerButtonText: {
    ...typography.body,
    color: color.danger,
    fontWeight: "600",
  },
  pressed: {
    opacity: 0.85,
  },
});
