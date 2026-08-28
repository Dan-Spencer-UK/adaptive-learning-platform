/**
 * LEGACY_RETIRED (CC-12D): CC-05C's static "lesson" (teaching) screen --
 * proved design doc §11/§42.1-2 ("a lesson teaching a formula family must
 * present all required family assertions") before the real Lesson Player
 * existed. Renders the old schematic diagrams (RightHandGripRuleDiagram,
 * MagneticForceDiagram) directly, always revealed, with none of the
 * adaptive branching / evidence engine / layered feedback / canonical
 * teaching-visual resolution the real Lesson Player has. This is exactly
 * the screen a Product Owner emulator finding traced a learner reaching
 * through completely normal Learn-hub navigation (tapping a topic card),
 * showing stale imagery for `lesson.magnetism.effects-of-current` even
 * after CC-12C locked that lesson's canonical visuals -- because this
 * screen never went through DiagramRenderer/CANONICAL_TEACHING_VISUALS at
 * all. No longer linked from any in-app navigation (see ../index.tsx's
 * own header comment). Kept, unlinked, as it still exercises real shared
 * plumbing (proving-engine, formula-rendering) that several existing
 * tests cover; do not link it from production navigation again -- route
 * new topic-card/browse entries to the Lesson Player instead.
 */
import { Link, useLocalSearchParams } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { MagneticForceDiagram } from "@/components/diagrams/MagneticForceDiagram";
import { ParallelCircuitDiagram } from "@/components/diagrams/ParallelCircuitDiagram";
import { RightHandGripRuleDiagram } from "@/components/diagrams/RightHandGripRuleDiagram";
import { SeriesCircuitDiagram } from "@/components/diagrams/SeriesCircuitDiagram";
import { FormulaEquation } from "@/components/formula/FormulaExpressionView";
import { VariableKey } from "@/components/formula/VariableKey";
import { WorkedSubstitution } from "@/components/formula/WorkedSubstitution";
import { VirTriangle } from "@/components/mnemonic/VirTriangle";
import { buildTeachingWorkedExample } from "@/lib/formula-rendering/build-worked-example";
import { getProvingFamily } from "@/lib/proving-content/unit202-proving-fixture";
import {
  OHMS_LAW_TEACHING_VALUES,
  PARALLEL_TEACHING_VALUES,
  SERIES_TEACHING_VALUES,
} from "@/lib/proving-content/teaching-examples";
import { generateProvingQuestion } from "@/lib/proving-engine/proving-engine";
import { color, minTouchTarget, radius, spacing, typography } from "@/lib/tokens";

const LESSON_TEACHING_SEED = 1;

export default function LessonScreen(): React.JSX.Element {
  const { family: familyId } = useLocalSearchParams<{ family: string }>();
  const family = getProvingFamily(familyId ?? "");
  const isMagnetism = family?.id === "electrical.magnetism_and_electromagnetism";
  const fieldDirectionTeachingInstance = isMagnetism
    ? generateProvingQuestion({
        familyId: family!.id,
        blueprintId: "magnetism.interpret_field_direction",
        seed: LESSON_TEACHING_SEED,
      })
    : null;
  const forceDirectionTeachingInstance = isMagnetism
    ? generateProvingQuestion({
        familyId: family!.id,
        blueprintId: "magnetism.interpret_force_direction",
        seed: LESSON_TEACHING_SEED,
      })
    : null;

  if (!family) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Text style={styles.notFound}>Unknown family.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title} accessibilityRole="header">
          {family.title}
        </Text>
        <Text style={styles.intro}>{family.learningIntent}</Text>

        {family.formulaFamily ? (
          <Section title="The relationship, taught as a family">
            <VariableKey variables={family.formulaFamily.variables} />
            <View style={styles.formulaList}>
              {family.formulaFamily.forms.map((form) => (
                <FormulaEquation key={form.target} target={form.target} expression={form.expression} />
              ))}
            </View>
          </Section>
        ) : null}

        {family.visualAid && family.formulaFamily ? (
          <Section title="Mnemonic (learning aid only)">
            <VirTriangle visualAid={family.visualAid} formulaFamily={family.formulaFamily} />
          </Section>
        ) : null}

        {family.id === "electrical.ohms_law" && family.formulaFamily ? (
          <Section title="Worked substitution -- every target">
            {family.workedExampleBlueprints.map((blueprint) => (
              <WorkedSubstitution
                key={blueprint.id}
                formulaFamily={family.formulaFamily!}
                instance={buildTeachingWorkedExample(family.formulaFamily!, blueprint, OHMS_LAW_TEACHING_VALUES)}
              />
            ))}
          </Section>
        ) : null}

        {family.id === "electrical.series_circuits" && family.formulaFamily ? (
          <Section title="Circuit diagram and worked example">
            <SeriesCircuitDiagram
              diagram={{ blueprintId: "circuit.series_resistors", parameters: { component_count: 3, show_values: false, show_current_arrow: false }, labels: ["R1", "R2", "R3"] }}
            />
            {family.workedExampleBlueprints.map((blueprint) => (
              <WorkedSubstitution
                key={blueprint.id}
                formulaFamily={family.formulaFamily!}
                instance={buildTeachingWorkedExample(family.formulaFamily!, blueprint, SERIES_TEACHING_VALUES)}
              />
            ))}
          </Section>
        ) : null}

        {family.id === "electrical.parallel_circuits" && family.formulaFamily ? (
          <Section title="Circuit diagram and worked example">
            <ParallelCircuitDiagram
              diagram={{ blueprintId: "circuit.parallel_resistors", parameters: { branch_count: 3, show_values: false, show_branch_current_arrows: false }, labels: ["R1", "R2", "R3"] }}
            />
            {family.workedExampleBlueprints.map((blueprint) => (
              <WorkedSubstitution
                key={blueprint.id}
                formulaFamily={family.formulaFamily!}
                instance={buildTeachingWorkedExample(family.formulaFamily!, blueprint, PARALLEL_TEACHING_VALUES)}
              />
            ))}
          </Section>
        ) : null}

        {isMagnetism && fieldDirectionTeachingInstance?.representation.diagram ? (
          <Section title="Right-hand grip rule (magnetic field direction)">
            <RightHandGripRuleDiagram
              diagram={fieldDirectionTeachingInstance.representation.diagram}
              fieldRotation={fieldDirectionTeachingInstance.expected.value as "clockwise" | "counterclockwise"}
            />
            <Text style={styles.note}>
              Point your right thumb along the current direction. Your fingers then curl in the direction of the
              magnetic field around the conductor.
            </Text>
          </Section>
        ) : null}

        {isMagnetism && forceDirectionTeachingInstance?.representation.diagram ? (
          <Section title="Motor principle (force on a current-carrying conductor)">
            <MagneticForceDiagram
              diagram={forceDirectionTeachingInstance.representation.diagram}
              forceDirection={forceDirectionTeachingInstance.expected.value as "up" | "down" | "left" | "right"}
            />
            <Text style={styles.note}>
              A current-carrying conductor placed in a magnetic field experiences a force. The force direction
              depends on both the field direction and the current direction, shown here for one example arrangement.
            </Text>
          </Section>
        ) : null}

        <Link href={{ pathname: "/learn/[family]/practice", params: { family: family.id } }} asChild>
          <Pressable style={({ pressed }) => [styles.practiceButton, pressed && styles.pressed]} accessibilityRole="button" accessibilityLabel="Start practice">
            <Text style={styles.practiceButtonText}>Start practice</Text>
          </Pressable>
        </Link>
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
  notFound: { ...typography.body, color: color.danger, padding: spacing.lg },
  title: { ...typography.title, color: color.text },
  intro: { ...typography.body, color: color.textSecondary },
  section: {
    backgroundColor: color.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: color.border,
    padding: spacing.md,
    gap: spacing.md,
    alignItems: "center",
  },
  sectionTitle: { ...typography.caption, color: color.accent, textTransform: "uppercase", alignSelf: "flex-start" },
  formulaList: { gap: spacing.sm, alignSelf: "stretch" },
  note: { ...typography.caption, color: color.textSecondary },
  practiceButton: {
    minHeight: minTouchTarget,
    borderRadius: radius.md,
    backgroundColor: color.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  pressed: { opacity: 0.85 },
  practiceButtonText: { ...typography.body, color: "#fff", fontWeight: "700" },
});
