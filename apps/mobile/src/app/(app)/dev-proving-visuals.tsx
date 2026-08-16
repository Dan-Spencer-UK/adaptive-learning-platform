/**
 * CC-05C: dev-only visual QA screen (task brief §23) -- deterministic,
 * repeatable examples of every proving-slice visual/interaction primitive
 * in one place, for interactive manual review and as a foundation for
 * future structural screenshot testing (families/families/new-families.test.ts
 * -style Jest snapshot tests exist alongside this screen's components --
 * see families/*.test.tsx). Not reachable from production navigation
 * (see the __DEV__ guard on the link in ./index.tsx).
 */
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { MagneticForceDiagram } from "@/components/diagrams/MagneticForceDiagram";
import { ParallelCircuitDiagram } from "@/components/diagrams/ParallelCircuitDiagram";
import { RightHandGripRuleDiagram } from "@/components/diagrams/RightHandGripRuleDiagram";
import { SeriesCircuitDiagram } from "@/components/diagrams/SeriesCircuitDiagram";
import { FormulaEquation } from "@/components/formula/FormulaExpressionView";
import { VariableKey } from "@/components/formula/VariableKey";
import { WorkedSubstitution } from "@/components/formula/WorkedSubstitution";
import { FeedbackPanel } from "@/components/question/FeedbackPanel";
import { VirTriangle } from "@/components/mnemonic/VirTriangle";
import { buildTeachingWorkedExample } from "@/lib/formula-rendering/build-worked-example";
import { getPerformanceSamples, measure, type PerformanceSample } from "@/lib/native-proof/performance";
import { OHMS_LAW_FAMILY, PARALLEL_FAMILY, SERIES_FAMILY } from "@/lib/proving-content/unit202-proving-fixture";
import { OHMS_LAW_TEACHING_VALUES } from "@/lib/proving-content/teaching-examples";
import { emitProvingEvidence, generateProvingQuestion, markProvingAnswer } from "@/lib/proving-engine/proving-engine";
import { color, radius, spacing, typography } from "@/lib/tokens";

const DEMO_SEED = 42;

export default function DevProvingVisualsScreen(): React.JSX.Element {
  const [performanceSamples, setPerformanceSamples] = useState<readonly PerformanceSample[]>([]);

  const voltageInstance = generateProvingQuestion({
    familyId: "electrical.ohms_law",
    blueprintId: "ohms_law.solve_for_voltage",
    seed: DEMO_SEED,
  });
  const correctEvaluation = markProvingAnswer(voltageInstance, voltageInstance.expected.value);
  const incorrectEvaluation = markProvingAnswer(voltageInstance, (voltageInstance.expected.value as number) + 1000);

  const fieldInstance = generateProvingQuestion({
    familyId: "electrical.magnetism_and_electromagnetism",
    blueprintId: "magnetism.interpret_field_direction",
    seed: DEMO_SEED,
  });
  const forceInstance = generateProvingQuestion({
    familyId: "electrical.magnetism_and_electromagnetism",
    blueprintId: "magnetism.interpret_force_direction",
    seed: DEMO_SEED,
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      await measure("proving-question-generation", "dev-machine-metro-jest", () =>
        generateProvingQuestion({ familyId: "electrical.series_circuits", blueprintId: "series.calculate_total_resistance", seed: DEMO_SEED }),
      );
      await measure("proving-answer-marking", "dev-machine-metro-jest", () => markProvingAnswer(voltageInstance, voltageInstance.expected.value));
      await measure("proving-evidence-emission", "dev-machine-metro-jest", () => emitProvingEvidence(voltageInstance, correctEvaluation));
      if (!cancelled) {
        setPerformanceSamples(getPerformanceSamples());
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
      <ScrollView contentContainerStyle={styles.container}>
        <Section title="Formula family -- Ohm's law (all three forms)">
          <VariableKey variables={OHMS_LAW_FAMILY.formulaFamily!.variables} />
          {OHMS_LAW_FAMILY.formulaFamily!.forms.map((f) => (
            <FormulaEquation key={f.target} target={f.target} expression={f.expression} />
          ))}
        </Section>

        <Section title="VIR triangle mnemonic">
          <VirTriangle visualAid={OHMS_LAW_FAMILY.visualAid!} formulaFamily={OHMS_LAW_FAMILY.formulaFamily!} />
        </Section>

        <Section title="Worked substitution (I = V / R)">
          <WorkedSubstitution
            formulaFamily={OHMS_LAW_FAMILY.formulaFamily!}
            instance={buildTeachingWorkedExample(
              OHMS_LAW_FAMILY.formulaFamily!,
              OHMS_LAW_FAMILY.workedExampleBlueprints[1]!,
              OHMS_LAW_TEACHING_VALUES,
            )}
          />
        </Section>

        <Section title="Series circuit diagram (3 components)">
          <SeriesCircuitDiagram
            diagram={{
              blueprintId: SERIES_FAMILY.diagramBlueprints[0]!.id,
              parameters: { component_count: 3, show_values: false, show_current_arrow: true },
              labels: ["R1", "R2", "R3"],
            }}
          />
        </Section>

        <Section title="Parallel circuit diagram (3 branches)">
          <ParallelCircuitDiagram
            diagram={{
              blueprintId: PARALLEL_FAMILY.diagramBlueprints[0]!.id,
              parameters: { branch_count: 3, show_values: false, show_branch_current_arrows: true },
              labels: ["R1", "R2", "R3"],
            }}
          />
        </Section>

        <Section title="Right-hand grip rule (field direction revealed, teaching mode)">
          <RightHandGripRuleDiagram
            diagram={fieldInstance.representation.diagram!}
            fieldRotation={fieldInstance.expected.value as "clockwise" | "counterclockwise"}
          />
        </Section>

        <Section title="Motor principle (force revealed, teaching mode)">
          <MagneticForceDiagram
            diagram={forceInstance.representation.diagram!}
            forceDirection={forceInstance.expected.value as "up" | "down" | "left" | "right"}
          />
        </Section>

        <Section title="Feedback -- correct">
          <FeedbackPanel
            correct={correctEvaluation.correct}
            detail={correctEvaluation.detail}
            expectedAnswerText={`${voltageInstance.expected.value} V`}
            onContinue={() => {}}
          />
        </Section>

        <Section title="Feedback -- incorrect">
          <FeedbackPanel
            correct={incorrectEvaluation.correct}
            detail={incorrectEvaluation.detail}
            expectedAnswerText={`${voltageInstance.expected.value} V`}
            onContinue={() => {}}
          />
        </Section>

        <Section title="Performance samples (this session, dev-machine only)">
          {performanceSamples.length === 0 ? (
            <Text style={styles.body}>Running...</Text>
          ) : (
            performanceSamples.map((s, i) => (
              <View key={i} style={styles.perfRow}>
                <Text style={styles.perfLabel}>{s.label}</Text>
                <Text style={styles.perfValue}>{s.durationMs}ms</Text>
              </View>
            ))
          )}
        </Section>

        <Section title="Deterministic reproduction proof">
          <Text style={styles.body}>
            Every visual above the feedback sections was generated from a fixed seed ({DEMO_SEED}) and fixed teaching
            values -- reloading this screen reproduces byte-identical instances (see
            proving-engine.test.ts for the mechanical proof).
          </Text>
        </Section>
      </ScrollView>
    </SafeAreaView>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
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
    gap: spacing.sm,
    alignItems: "center",
  },
  sectionTitle: { ...typography.caption, color: color.accent, textTransform: "uppercase", alignSelf: "flex-start" },
  body: { ...typography.body, color: color.textSecondary },
  perfRow: { flexDirection: "row", justifyContent: "space-between", alignSelf: "stretch" },
  perfLabel: { ...typography.code, color: color.text },
  perfValue: { ...typography.code, color: color.textSecondary },
});
