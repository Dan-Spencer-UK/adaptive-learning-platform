/**
 * CC-05C: the approved VIR triangle mnemonic (design doc §10, §42.5) as a
 * scalable SVG vector visual with a bounded, governed-content-driven
 * interaction: tapping a region reveals the relationship you get by
 * covering that variable. The revealed relationship is never invented --
 * it is `formulaFamily.forms.find(f => f.target === region).expression`,
 * i.e. the exact same structured formula CC-05B evaluates, rendered via
 * FormulaExpressionView. The triangle remains a learning aid only; the
 * canonical relationship stays formula.ohms_law (design doc §2.5 -- a
 * mnemonic is not the mathematical source of truth).
 */
import type { FormulaFamily, VisualAidBlueprint } from "@alp/content-schema";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Svg, { Line, Polygon, Text as SvgText } from "react-native-svg";

import { color, minTouchTarget, radius, spacing, typography } from "@/lib/tokens";
import { symbolicResolver } from "@/lib/formula-rendering/format-formula";
import { FormulaEquation } from "@/components/formula/FormulaExpressionView";

export interface VirTriangleProps {
  readonly visualAid: VisualAidBlueprint;
  readonly formulaFamily: FormulaFamily;
  readonly testID?: string;
}

const TRIANGLE_HEIGHT = 160;
const TRIANGLE_WIDTH = 220;

function requireRegion(regions: Readonly<Record<string, string>>, key: string): string {
  const value = regions[key];
  if (!value) throw new Error(`VirTriangle: visual aid has no "${key}" region`);
  return value;
}

export function VirTriangle({ visualAid, formulaFamily, testID }: VirTriangleProps): React.JSX.Element {
  const [selected, setSelected] = useState<string | null>(null);
  const top = requireRegion(visualAid.regions, "top");
  const bottomLeft = requireRegion(visualAid.regions, "bottom_left");
  const bottomRight = requireRegion(visualAid.regions, "bottom_right");
  const revealedForm = selected ? formulaFamily.forms.find((f) => f.target === selected) : null;

  return (
    <View style={styles.container} testID={testID}>
      <View style={styles.triangleWrap}>
        <Svg width={TRIANGLE_WIDTH} height={TRIANGLE_HEIGHT} viewBox={`0 0 ${TRIANGLE_WIDTH} ${TRIANGLE_HEIGHT}`}>
          <Polygon
            points={`${TRIANGLE_WIDTH / 2},4 4,${TRIANGLE_HEIGHT - 4} ${TRIANGLE_WIDTH - 4},${TRIANGLE_HEIGHT - 4}`}
            fill="none"
            stroke={color.border}
            strokeWidth={2}
          />
          {/* Horizontal divider between the top region and the bottom two regions. */}
          <Line
            x1={TRIANGLE_WIDTH * 0.25}
            y1={TRIANGLE_HEIGHT * 0.62}
            x2={TRIANGLE_WIDTH * 0.75}
            y2={TRIANGLE_HEIGHT * 0.62}
            stroke={color.border}
            strokeWidth={2}
          />
          {/* Vertical divider splitting the bottom half into left/right regions. */}
          <Line
            x1={TRIANGLE_WIDTH / 2}
            y1={TRIANGLE_HEIGHT * 0.62}
            x2={TRIANGLE_WIDTH / 2}
            y2={TRIANGLE_HEIGHT - 4}
            stroke={color.border}
            strokeWidth={2}
          />
          <SvgText x={TRIANGLE_WIDTH / 2} y={TRIANGLE_HEIGHT * 0.4} fill={color.text} fontSize={22} fontWeight="700" textAnchor="middle">
            {top}
          </SvgText>
          <SvgText x={TRIANGLE_WIDTH * 0.3} y={TRIANGLE_HEIGHT * 0.85} fill={color.text} fontSize={22} fontWeight="700" textAnchor="middle">
            {bottomLeft}
          </SvgText>
          <SvgText x={TRIANGLE_WIDTH * 0.7} y={TRIANGLE_HEIGHT * 0.85} fill={color.text} fontSize={22} fontWeight="700" textAnchor="middle">
            {bottomRight}
          </SvgText>
        </Svg>

        {/* Transparent hit-areas matching the SVG regions above -- see module header for why touch handling is done this way rather than SVG-native hit-testing. */}
        <View style={styles.overlay} pointerEvents="box-none">
          <RegionButton
            label={top}
            selected={selected === top}
            style={styles.topRegion}
            onPress={() => setSelected((current) => (current === top ? null : top))}
          />
          <View style={styles.bottomRow}>
            <RegionButton
              label={bottomLeft}
              selected={selected === bottomLeft}
              style={styles.bottomRegion}
              onPress={() => setSelected((current) => (current === bottomLeft ? null : bottomLeft))}
            />
            <RegionButton
              label={bottomRight}
              selected={selected === bottomRight}
              style={styles.bottomRegion}
              onPress={() => setSelected((current) => (current === bottomRight ? null : bottomRight))}
            />
          </View>
        </View>
      </View>

      <Text style={styles.description}>{visualAid.accessibleDescription}</Text>

      {revealedForm ? (
        <View style={styles.reveal} accessible accessibilityRole="text">
          <Text style={styles.revealLabel}>
            Covering {selected} shows:
          </Text>
          <FormulaEquation target={revealedForm.target} expression={revealedForm.expression} resolve={symbolicResolver} />
        </View>
      ) : (
        <Text style={styles.hint}>Tap a letter to reveal the relationship it stands for.</Text>
      )}
    </View>
  );
}

function RegionButton({
  label,
  selected,
  style,
  onPress,
}: {
  label: string;
  selected: boolean;
  style: object;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[style, styles.regionHit]}
      accessibilityRole="button"
      accessibilityLabel={`${label} region of the VIR triangle`}
      accessibilityHint={`Reveals the relationship you get by covering ${label}`}
      accessibilityState={{ selected }}
    >
      {selected ? <View style={styles.selectedMarker} /> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { gap: spacing.sm, alignItems: "center" },
  triangleWrap: { width: TRIANGLE_WIDTH, height: TRIANGLE_HEIGHT },
  overlay: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0 },
  topRegion: { height: TRIANGLE_HEIGHT * 0.62, minHeight: minTouchTarget },
  bottomRow: { flexDirection: "row", flex: 1 },
  bottomRegion: { flex: 1, minWidth: minTouchTarget, minHeight: minTouchTarget },
  regionHit: { alignItems: "center", justifyContent: "flex-end", paddingBottom: 4 },
  selectedMarker: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: color.accent,
    borderWidth: 1,
    borderColor: color.text,
  },
  description: { ...typography.caption, color: color.textSecondary, textAlign: "center", maxWidth: TRIANGLE_WIDTH + 40 },
  hint: { ...typography.caption, color: color.textSecondary },
  reveal: {
    backgroundColor: color.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: color.border,
    padding: spacing.sm,
    gap: spacing.xs,
    alignItems: "center",
  },
  revealLabel: { ...typography.caption, color: color.accent, textTransform: "uppercase" },
});
