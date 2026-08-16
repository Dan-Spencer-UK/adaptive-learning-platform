/**
 * Dev-only foundation diagnostics screen (Part 8/11 of the CC-04N task
 * brief). Not reachable from the production navigation hierarchy (see
 * the __DEV__ guard on the link in ./index.tsx); exists purely to make
 * the CC-04N runtime proofs interactively inspectable during development
 * and manual Product Owner review (see
 * docs/architecture/evidence/CC-04N-MOBILE-FOUNDATION-EVIDENCE.md §Manual
 * checkpoint). Not present as visible product surface.
 */
import * as Haptics from "expo-haptics";
import { useEffect, useState } from "react";
import { Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { runEngineProof, type EngineProofResult } from "@/lib/native-proof/engine-proof";
import {
  runSharedPackageProof,
  type SharedPackageProofResult,
} from "@/lib/native-proof/shared-packages";
import { getPerformanceSamples, measure, type PerformanceSample } from "@/lib/native-proof/performance";
import {
  enqueueOutboxEvent,
  listPendingOutboxEvents,
  markOutboxEventSynced,
} from "@/lib/storage/outbox";
import { color, radius, spacing, typography } from "@/lib/tokens";

type OutboxProofState = {
  readonly pass: boolean;
  readonly detail: string;
};

// `HermesInternal` is a global that exists only inside a Hermes JS
// runtime -- the standard, widely-used mechanical check for "is this code
// actually executing under Hermes" (see docs/architecture/MOBILE-ARCHITECTURE.md
// §8 tier distinction / CC-04N task Part 11).
declare const HermesInternal: unknown;
function isHermesRuntime(): boolean {
  return typeof HermesInternal !== "undefined";
}

export default function DevProofScreen(): React.JSX.Element {
  const [sharedPackageResults, setSharedPackageResults] = useState<
    readonly SharedPackageProofResult[] | null
  >(null);
  const [engineProofResults, setEngineProofResults] = useState<readonly EngineProofResult[] | null>(null);
  const [outboxProof, setOutboxProof] = useState<OutboxProofState | null>(null);
  const [performanceSamples, setPerformanceSamples] = useState<readonly PerformanceSample[]>([]);
  const [hapticFired, setHapticFired] = useState(false);

  useEffect(() => {
    let cancelled = false;

    void measure("shared-package-proof", "dev-machine-metro-jest", () =>
      runSharedPackageProof(),
    ).then((result) => {
      if (cancelled) return;
      setSharedPackageResults(result);
      setPerformanceSamples(getPerformanceSamples());
    });

    void measure("engine-proof", "dev-machine-metro-jest", () => runEngineProof()).then((result) => {
      if (cancelled) return;
      setEngineProofResults(result);
      setPerformanceSamples(getPerformanceSamples());
    });

    void measure("outbox-proof", "dev-machine-metro-jest", () => runOutboxProof()).then(
      (result) => {
        if (cancelled) return;
        setOutboxProof(result);
        setPerformanceSamples(getPerformanceSamples());
      },
    );

    return () => {
      cancelled = true;
    };
  }, []);

  const onHapticPress = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setHapticFired(true);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
      <ScrollView contentContainerStyle={styles.container}>
        <Section title="Runtime">
          <Row label="Platform.OS" value={Platform.OS} />
          <Row label="Hermes engine active" value={isHermesRuntime() ? "yes" : "no (not Hermes)"} />
        </Section>

        <Section title="Shared-package runtime proof (Tier 2)">
          {sharedPackageResults === null ? (
            <Text style={styles.body}>Running...</Text>
          ) : (
            sharedPackageResults.map((r) => (
              <Row key={r.package} label={r.package} value={r.pass ? "PASS" : "FAIL"} ok={r.pass} />
            ))
          )}
        </Section>

        <Section title="Deterministic engine proof (CC-05B)">
          {engineProofResults === null ? (
            <Text style={styles.body}>Running...</Text>
          ) : (
            engineProofResults.map((r) => (
              <Row key={r.step} label={r.step} value={r.pass ? "PASS" : "FAIL"} ok={r.pass} />
            ))
          )}
        </Section>

        <Section title="SQLite outbox foundation proof">
          {outboxProof === null ? (
            <Text style={styles.body}>Running...</Text>
          ) : (
            <Row label="pending -> synced transition" value={outboxProof.pass ? "PASS" : "FAIL"} ok={outboxProof.pass} />
          )}
          {outboxProof ? <Text style={styles.detail}>{outboxProof.detail}</Text> : null}
        </Section>

        <Section title="Haptics proof (restrained, single use)">
          <Text style={styles.body}>
            {hapticFired ? "Haptic feedback triggered." : "Not yet triggered."}
          </Text>
          <Text style={styles.detail} onPress={onHapticPress} accessibilityRole="button">
            Tap to trigger a light impact haptic
          </Text>
        </Section>

        <Section title="Performance samples (this session, dev-machine only)">
          {performanceSamples.length === 0 ? (
            <Text style={styles.body}>No samples recorded yet.</Text>
          ) : (
            performanceSamples.map((s, i) => (
              <Row key={i} label={s.label} value={`${s.durationMs}ms (${s.environment})`} />
            ))
          )}
        </Section>
      </ScrollView>
    </SafeAreaView>
  );
}

async function runOutboxProof(): Promise<OutboxProofState> {
  try {
    const event = await enqueueOutboxEvent("dev-proof.synthetic-event", {
      note: "foundation fixture only, not real learner evidence",
    });
    const pendingBefore = await listPendingOutboxEvents();
    const foundBeforeSync = pendingBefore.some((e) => e.id === event.id);

    await markOutboxEventSynced(event.id);
    const pendingAfter = await listPendingOutboxEvents();
    const foundAfterSync = pendingAfter.some((e) => e.id === event.id);

    const pass = foundBeforeSync && !foundAfterSync;
    return {
      pass,
      detail: pass
        ? `Event ${event.id} written, appeared pending, then transitioned out of pending after acknowledgement.`
        : `Unexpected state: foundBeforeSync=${foundBeforeSync}, foundAfterSync=${foundAfterSync}`,
    };
  } catch (err) {
    return { pass: false, detail: `Threw: ${err instanceof Error ? err.message : String(err)}` };
  }
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function Row({ label, value, ok }: { label: string; value: string; ok?: boolean }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={[styles.rowValue, ok === true && styles.ok, ok === false && styles.fail]}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: color.background },
  container: { padding: spacing.lg, gap: spacing.lg },
  section: {
    backgroundColor: color.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: color.border,
    padding: spacing.md,
    gap: spacing.xs,
  },
  sectionTitle: {
    ...typography.caption,
    color: color.accent,
    textTransform: "uppercase",
    marginBottom: spacing.xs,
  },
  body: { ...typography.body, color: color.textSecondary },
  detail: { ...typography.caption, color: color.textSecondary },
  row: { flexDirection: "row", justifyContent: "space-between", gap: spacing.sm },
  rowLabel: { ...typography.code, color: color.text, flexShrink: 1 },
  rowValue: { ...typography.code, color: color.textSecondary },
  ok: { color: color.success },
  fail: { color: color.danger },
});
