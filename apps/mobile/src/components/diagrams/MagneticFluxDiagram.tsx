/**
 * Governed, teaching-only reinforcement diagram for magnetic flux vs.
 * magnetic flux density (EL-CONCEPT-MAGNETIC-FLUX-001 /
 * EL-CONCEPT-MAGNETIC-FLUX-DENSITY-001, AC5.2). This diagram never backs
 * an answer-bearing element -- `magnetism.recognise_concept` (the real
 * question blueprint for this distinction) is text-based, asking the
 * learner to recognise flux/flux-density from a written definition, not
 * from this image. There is therefore no `reveal` prop here: the full
 * picture is always shown, matching how the two other purely-illustrative
 * governed diagrams in this folder (e.g. the always-shown parts of
 * MagneticForceDiagram's pole/field arrangement) never gate structural,
 * given information behind a reveal prop -- only genuinely assessed
 * elements are ever withheld.
 *
 * A bar magnet with curved field lines from N to S illustrates flux (the
 * total field). When `density_comparison` is true, a second row shows the
 * SAME number of field lines passing through a wide "gate" (lower
 * density, larger area) and a narrow "gate" (higher density, smaller
 * area) -- flux density as flux-per-unit-area, taught purely visually,
 * with no formula ever drawn (this is a conceptual, not calculation,
 * diagram; the quantitative form belongs to formula.flux_change_emf
 * elsewhere).
 */
import type { DiagramInstance } from "@alp/calculation-engine";
import Svg, { Line, Path, Rect, Text as SvgText } from "react-native-svg";

import { color } from "@/lib/tokens";

export interface MagneticFluxDiagramProps {
  readonly diagram: DiagramInstance;
  readonly testID?: string;
}

const WIDTH = 260;
const MAGNET_X = 110;
const MAGNET_Y = 16;
const MAGNET_W = 40;
const MAGNET_H = 96;
const MAGNET_CENTER_X = MAGNET_X + MAGNET_W / 2;
const N_Y = MAGNET_Y;
const S_Y = MAGNET_Y + MAGNET_H;

const FIELD_LINE_OFFSETS = [-15, -5, 5, 15];
const FIELD_LINE_BULGES = [-70, -35, 35, 70];

const PANEL1_HEIGHT = 150;
const PANEL2_Y = 168;
const PANEL2_HEIGHT = 110;

export function MagneticFluxDiagram({ diagram, testID }: MagneticFluxDiagramProps): React.JSX.Element {
  const densityComparison = Boolean(diagram.parameters.density_comparison ?? false);
  const height = densityComparison ? PANEL2_Y + PANEL2_HEIGHT : PANEL1_HEIGHT;

  const accessibilityLabel = [
    "A bar magnet with curved field lines arcing from the north pole, around, to the south pole -- this whole pattern of field lines is the magnetic flux.",
    densityComparison
      ? "Below, the same number of field lines passes through two gates of different width: a wider gate on the left, giving lower flux density (the same flux spread over a larger area), and a narrower gate on the right, giving higher flux density (the same flux concentrated over a smaller area)."
      : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Svg
      width={WIDTH}
      height={height}
      viewBox={`0 0 ${WIDTH} ${height}`}
      testID={testID}
      accessible
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="image"
    >
      <Rect x={MAGNET_X} y={MAGNET_Y} width={MAGNET_W} height={MAGNET_H / 2} fill="none" stroke={color.text} strokeWidth={2} />
      <SvgText x={MAGNET_CENTER_X} y={MAGNET_Y + MAGNET_H / 4 + 6} fill={color.text} fontSize={16} fontWeight="700" textAnchor="middle">
        N
      </SvgText>
      <Rect x={MAGNET_X} y={MAGNET_Y + MAGNET_H / 2} width={MAGNET_W} height={MAGNET_H / 2} fill="none" stroke={color.text} strokeWidth={2} />
      <SvgText x={MAGNET_CENTER_X} y={S_Y - MAGNET_H / 4 + 6} fill={color.text} fontSize={16} fontWeight="700" textAnchor="middle">
        S
      </SvgText>

      {FIELD_LINE_OFFSETS.map((offset, i) => (
        <FieldLine key={offset} topX={MAGNET_CENTER_X + offset} bottomX={MAGNET_CENTER_X + offset} bulge={FIELD_LINE_BULGES[i]!} />
      ))}
      <SvgText x={MAGNET_CENTER_X} y={S_Y + 22} fill={color.textSecondary} fontSize={11} textAnchor="middle">
        magnetic flux (field lines, N to S)
      </SvgText>

      {densityComparison ? <DensityComparisonPanels /> : null}
    </Svg>
  );
}

/**
 * A single flux line from the N face to the S face, bulging left or right
 * by `bulge` pixels -- the primary teaching element (this IS the concept
 * being taught), drawn at the same visual weight as the pole labels, not
 * as a thin secondary decoration.
 */
function FieldLine({ topX, bottomX, bulge }: { topX: number; bottomX: number; bulge: number }) {
  const midY = (N_Y + S_Y) / 2;
  const controlX = MAGNET_CENTER_X + bulge;
  const d = `M${topX},${N_Y} Q${controlX},${midY} ${bottomX},${S_Y}`;
  // Arrowhead at the S end, tangent to the curve's approach direction
  // (from the control point to the end point), so it always points along
  // the line it labels, never perpendicular to it.
  const angle = Math.atan2(S_Y - midY, bottomX - controlX);
  const headLength = 7;
  const hx1 = bottomX - headLength * Math.cos(angle - Math.PI / 6);
  const hy1 = S_Y - headLength * Math.sin(angle - Math.PI / 6);
  const hx2 = bottomX - headLength * Math.cos(angle + Math.PI / 6);
  const hy2 = S_Y - headLength * Math.sin(angle + Math.PI / 6);
  return (
    <>
      <Path d={d} stroke={color.text} strokeWidth={2} fill="none" />
      <Path d={`M${bottomX},${S_Y} L${hx1},${hy1} L${hx2},${hy2} Z`} fill={color.text} />
    </>
  );
}

const WIDE_GATE = { x1: 40, x2: 110 };
const NARROW_GATE = { x1: 165, x2: 205 };
const GATE_LINE_COUNT = 4;

function DensityComparisonPanels() {
  const gateTop = PANEL2_Y + 10;
  const gateBottom = PANEL2_Y + 70;
  const captionY = gateBottom + 20;
  const labelY = gateBottom + 36;

  return (
    <>
      <SvgText x={WIDTH / 2} y={PANEL2_Y - 4} fill={color.textSecondary} fontSize={10} textAnchor="middle">
        the same number of field lines through each gate
      </SvgText>

      {/* Wide gate -- same flux, larger area -> lower density. */}
      <GateLines x1={WIDE_GATE.x1} x2={WIDE_GATE.x2} top={gateTop} bottom={gateBottom} />
      <Line x1={WIDE_GATE.x1} y1={gateTop} x2={WIDE_GATE.x1} y2={gateBottom} stroke={color.textSecondary} strokeWidth={1.5} />
      <Line x1={WIDE_GATE.x2} y1={gateTop} x2={WIDE_GATE.x2} y2={gateBottom} stroke={color.textSecondary} strokeWidth={1.5} />
      <SvgText x={(WIDE_GATE.x1 + WIDE_GATE.x2) / 2} y={captionY} fill={color.textSecondary} fontSize={10} textAnchor="middle">
        same flux, larger area
      </SvgText>
      <SvgText x={(WIDE_GATE.x1 + WIDE_GATE.x2) / 2} y={labelY} fill={color.text} fontSize={12} fontWeight="700" textAnchor="middle">
        Lower density
      </SvgText>

      {/* Narrow gate -- same flux, smaller area -> higher density. */}
      <GateLines x1={NARROW_GATE.x1} x2={NARROW_GATE.x2} top={gateTop} bottom={gateBottom} />
      <Line x1={NARROW_GATE.x1} y1={gateTop} x2={NARROW_GATE.x1} y2={gateBottom} stroke={color.textSecondary} strokeWidth={1.5} />
      <Line x1={NARROW_GATE.x2} y1={gateTop} x2={NARROW_GATE.x2} y2={gateBottom} stroke={color.textSecondary} strokeWidth={1.5} />
      <SvgText x={(NARROW_GATE.x1 + NARROW_GATE.x2) / 2} y={captionY} fill={color.textSecondary} fontSize={10} textAnchor="middle">
        same flux, smaller area
      </SvgText>
      <SvgText x={(NARROW_GATE.x1 + NARROW_GATE.x2) / 2} y={labelY} fill={color.text} fontSize={12} fontWeight="700" textAnchor="middle">
        Higher density
      </SvgText>
    </>
  );
}

function GateLines({ x1, x2, top, bottom }: { x1: number; x2: number; top: number; bottom: number }) {
  const step = (bottom - top) / (GATE_LINE_COUNT + 1);
  return (
    <>
      {Array.from({ length: GATE_LINE_COUNT }, (_, i) => {
        const y = top + step * (i + 1);
        return <Line key={i} x1={x1 - 20} y1={y} x2={x2 + 20} y2={y} stroke={color.text} strokeWidth={2} />;
      })}
    </>
  );
}
