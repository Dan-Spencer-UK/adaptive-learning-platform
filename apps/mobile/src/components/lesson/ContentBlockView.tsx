/**
 * CC-13C.2B: renders one resolved rich teaching content block
 * (`ResolvedContentBlock`, `@/lib/lesson-content/resolve-lesson-step`) in
 * authored order. A thin dispatcher, never a general CMS renderer -- it
 * reuses the SAME governed representation components `LessonStepView.tsx`
 * already renders for the legacy `representation` path (`FormulaEquation`,
 * `WorkedSubstitution`, `VirTriangle`, `DiagramRenderer`) exactly as-is,
 * plus small new views for the three genuinely new block shapes
 * (paragraph/list/callout).
 *
 * Accessibility: paragraph is normal readable text (Dynamic Type stays
 * enabled -- no fixed font sizing here); list uses list/item semantics;
 * callout communicates its variant via an accessible label, never colour
 * alone (the label/icon glyph carries the meaning; colour is a secondary
 * cue only).
 */
import { StyleSheet, Text, View } from "react-native";

import { buildTeachingDiagramInstance, DiagramRenderer } from "@/components/diagrams/DiagramRenderer";
import { FormulaEquation } from "@/components/formula/FormulaExpressionView";
import { WorkedSubstitution } from "@/components/formula/WorkedSubstitution";
import { VirTriangle } from "@/components/mnemonic/VirTriangle";
import type { ResolvedContentBlock } from "@/lib/lesson-content/resolve-lesson-step";
import { buildTeachingWorkedExample } from "@/lib/formula-rendering/build-worked-example";
import { symbolicResolver } from "@/lib/formula-rendering/format-formula";
import { color, radius, spacing, typography } from "@/lib/tokens";

export interface ContentBlockViewProps {
  readonly block: ResolvedContentBlock;
}

const CALLOUT_LABEL: Readonly<Record<"key_point" | "definition" | "caution", string>> = {
  key_point: "Key point",
  definition: "Definition",
  caution: "Caution",
};

const CALLOUT_GLYPH: Readonly<Record<"key_point" | "definition" | "caution", string>> = {
  key_point: "★", // never the ONLY cue -- the accessible label always states the variant in words too
  definition: "ℹ",
  caution: "⚠",
};

export function ContentBlockView({ block }: ContentBlockViewProps): React.JSX.Element | null {
  switch (block.type) {
    case "paragraph":
      return <Text style={styles.paragraph}>{block.text}</Text>;

    case "list":
      return (
        <View accessibilityRole="list" style={styles.list} testID="content-block-list">
          {block.items.map((item, index) => (
            <View key={`${index}-${item}`} style={styles.listItem}>
              <Text style={styles.listMarker}>{block.style === "ordered" ? `${index + 1}.` : "•"}</Text>
              <Text style={styles.listItemText}>{item}</Text>
            </View>
          ))}
        </View>
      );

    case "callout":
      return (
        <View
          style={[styles.callout, styles[`callout_${block.variant}`]]}
          accessible
          accessibilityRole="text"
          accessibilityLabel={`${CALLOUT_LABEL[block.variant]}: ${block.text}`}
        >
          <Text style={styles.calloutHeading}>
            {CALLOUT_GLYPH[block.variant]} {CALLOUT_LABEL[block.variant]}
          </Text>
          <Text style={styles.calloutText}>{block.text}</Text>
        </View>
      );

    case "formula":
      return (
        <View style={styles.representation}>
          {/* CC-12H: keyed by target+index, not target alone -- a formula family can legitimately declare more than one form for the same target variable. */}
          {block.formulaFamily.forms.map((form, index) => (
            <FormulaEquation key={`${form.target}-${index}`} target={form.target} expression={form.expression} resolve={symbolicResolver} />
          ))}
        </View>
      );

    case "worked_example":
      return (
        <View style={styles.representation}>
          <WorkedSubstitution formulaFamily={block.formulaFamily} instance={buildTeachingWorkedExample(block.formulaFamily, block.workedExample)} />
        </View>
      );

    case "visual":
      if (block.source.kind === "visual_aid") {
        return (
          <View style={styles.representation}>
            <VirTriangle visualAid={block.source.visualAid} formulaFamily={block.source.formulaFamily} />
          </View>
        );
      }
      return (
        <View style={styles.representation}>
          <DiagramRenderer
            blueprint={block.source.diagram}
            diagram={buildTeachingDiagramInstance(block.source.diagram, [], block.source.diagramParameters)}
            context="teaching"
          />
        </View>
      );

    default:
      return null;
  }
}

const styles = StyleSheet.create({
  paragraph: { ...typography.body, color: color.text },
  list: { gap: spacing.xs },
  listItem: { flexDirection: "row", gap: spacing.xs },
  listMarker: { ...typography.body, color: color.text },
  listItemText: { ...typography.body, color: color.text, flex: 1 },
  callout: { borderRadius: radius.md, borderWidth: 1, padding: spacing.md, gap: spacing.xs, backgroundColor: color.surface },
  callout_key_point: { borderColor: color.accent },
  callout_definition: { borderColor: color.border },
  callout_caution: { borderColor: color.danger },
  calloutHeading: { ...typography.caption, color: color.text, fontWeight: "700", textTransform: "uppercase", letterSpacing: 0.5 },
  calloutText: { ...typography.body, color: color.text },
  representation: { alignItems: "center", paddingVertical: spacing.sm },
});
