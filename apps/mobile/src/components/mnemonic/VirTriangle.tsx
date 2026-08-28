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
 *
 * CC-12F: the tap-to-reveal LOGIC already existed, but its only visible
 * feedback was a barely-visible 10px dot below the letter -- the letter
 * itself never actually looked "covered". A real Product Owner emulator
 * pass reported the whole triangle as non-interactive because of this: a
 * mnemonic literally named "cover the letter you want to find" needs the
 * selected letter to visibly disappear under an opaque cover, not gain a
 * small decoration next to it. The cover is now a real SVG patch drawn
 * directly over the selected letter's own position/size, drawn last so it
 * sits on top; the other two letters are left exactly as they were.
 */
import type { FormulaFamily, VisualAidBlueprint } from "@alp/content-schema";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Svg, { Line, Polygon, Rect, Text as SvgText } from "react-native-svg";

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
const COVER_WIDTH = 44;
const COVER_HEIGHT = 36;

function requireRegion(regions: Readonly<Record<string, string>>, key: string): string {
  const value = regions[key];
  if (!value) throw new Error(`VirTriangle: visual aid has no "${key}" region`);
  return value;
}

interface RegionLayout {
  readonly symbol: string;
  readonly x: number;
  readonly y: number;
}

export function VirTriangle({ visualAid, formulaFamily, testID }: VirTriangleProps): React.JSX.Element {
  const [selected, setSelected] = useState<string | null>(null);
  const top = requireRegion(visualAid.regions, "top");
  const bottomLeft = requireRegion(visualAid.regions, "bottom_left");
  const bottomRight = requireRegion(visualAid.regions, "bottom_right");
  const revealedForm = selected ? formulaFamily.forms.find((f) => f.target === selected) : null;

  const regionLayouts: readonly RegionLayout[] = [
    { symbol: top, x: TRIANGLE_WIDTH / 2, y: TRIANGLE_HEIGHT * 0.4 },
    { symbol: bottomLeft, x: TRIANGLE_WIDTH * 0.3, y: TRIANGLE_HEIGHT * 0.85 },
    { symbol: bottomRight, x: TRIANGLE_WIDTH * 0.7, y: TRIANGLE_HEIGHT * 0.85 },
  ];
  const selectedLayout = selected ? regionLayouts.find((r) => r.symbol === selected) : undefined;

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

          {/* The "cover" itself -- drawn last so it sits on top of the
              selected letter only, obscuring it exactly as the "cover the
              quantity you want to find" mnemonic describes. The other two
              letters are never touched. */}
          {selectedLayout ? (
            <>
              <Rect
                x={selectedLayout.x - COVER_WIDTH / 2}
                y={selectedLayout.y - COVER_HEIGHT * 0.72}
                width={COVER_WIDTH}
                height={COVER_HEIGHT}
                rx={radius.sm}
                fill={color.accent}
              />
              <SvgText x={selectedLayout.x} y={selectedLayout.y - COVER_HEIGHT * 0.72 + COVER_HEIGHT / 2 + 6} fill="#fff" fontSize={18} fontWeight="700" textAnchor="middle">
                ?
              </SvgText>
            </>
          ) : null}
        </Svg>

        {/* Transparent hit-areas matching the SVG regions above -- see module header for why touch handling is done this way rather than SVG-native hit-testing. */}
        <View style={styles.overlay} pointerEvents="box-none">
          <RegionButton
            symbol={top}
            name={formulaFamily.variables.find((v) => v.symbol === top)?.name ?? top}
            selected={selected === top}
            revealedExpression={selected === top && revealedForm ? revealedForm : null}
            style={styles.topRegion}
            onPress={() => setSelected((current) => (current === top ? null : top))}
          />
          <View style={styles.bottomRow}>
            <RegionButton
              symbol={bottomLeft}
              name={formulaFamily.variables.find((v) => v.symbol === bottomLeft)?.name ?? bottomLeft}
              selected={selected === bottomLeft}
              revealedExpression={selected === bottomLeft && revealedForm ? revealedForm : null}
              style={styles.bottomRegion}
              onPress={() => setSelected((current) => (current === bottomLeft ? null : bottomLeft))}
            />
            <RegionButton
              symbol={bottomRight}
              name={formulaFamily.variables.find((v) => v.symbol === bottomRight)?.name ?? bottomRight}
              selected={selected === bottomRight}
              revealedExpression={selected === bottomRight && revealedForm ? revealedForm : null}
              style={styles.bottomRegion}
              onPress={() => setSelected((current) => (current === bottomRight ? null : bottomRight))}
            />
          </View>
        </View>
      </View>

      <Text style={styles.description}>{visualAid.accessibleDescription}</Text>

      {revealedForm ? (
        <View style={styles.reveal} accessible accessibilityRole="text">
          <Text style={styles.revealLabel}>Covering {selected} shows:</Text>
          <FormulaEquation target={revealedForm.target} expression={revealedForm.expression} resolve={symbolicResolver} />
        </View>
      ) : (
        <Text style={styles.hint}>Tap a letter to cover it and reveal the relationship it stands for.</Text>
      )}
    </View>
  );
}

function RegionButton({
  symbol,
  name,
  selected,
  revealedExpression,
  style,
  onPress,
}: {
  symbol: string;
  name: string;
  selected: boolean;
  revealedExpression: { readonly target: string } | null;
  style: object;
  onPress: () => void;
}) {
  const accessibilityLabel = revealedExpression
    ? `${name} (${symbol}) covered. Relationship revealed. Tap to uncover.`
    : `Cover ${name} ${symbol}`;
  return (
    <Pressable
      onPress={onPress}
      style={[style, styles.regionHit]}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={selected ? undefined : `Reveals the relationship you get by covering ${symbol}`}
      accessibilityState={{ selected }}
    />
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
