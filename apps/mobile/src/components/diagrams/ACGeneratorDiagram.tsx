/**
 * Governed single-loop A.C. generator diagram (EL-CONCEPT-AC-GENERATOR-001,
 * `cap.emf.describe_ac_generation` / `emf.describe_ac_generation`). This
 * component is the fix for an active misrepresentation this package's
 * integration spec documents: the lesson previously reused the STATIC
 * motor-principle diagram (`motor.force_field_current`) for this rotating-
 * loop concept, which never drew a loop or any rotation at all. Level 2
 * scope only -- a single loop, no three-phase alternators, phasors or
 * vector maths, and no waveform overlay (that pairing belongs to the
 * separate, existing WaveformSineDiagram).
 *
 * `rotation_phase` structurally enforces the two teachable loop positions:
 * "vertical" draws the loop as a tall, narrow ellipse -- edge-on to the
 * viewer, its flat face aligned WITH the field lines, cutting flux at the
 * maximum rate (near-peak EMF). "horizontal" draws it as a wide, flat
 * ellipse -- face-on to the viewer, its flat face directly facing the
 * poles, momentarily not cutting flux lines (near-zero EMF). No numeric
 * EMF value or waveform is ever drawn here; the relationship is taught
 * qualitatively/positionally only, matching this question blueprint's own
 * multiple_choice (waveform-shape) answer, not a diagram-embedded value.
 */
import type { DiagramInstance } from "@alp/calculation-engine";
import Svg, { Circle, Ellipse, Line, Path, Rect, Text as SvgText } from "react-native-svg";

import { color } from "@/lib/tokens";
import { arcPath } from "./arc-geometry";

export interface ACGeneratorDiagramProps {
  readonly diagram: DiagramInstance;
  readonly testID?: string;
}

const WIDTH = 260;
const HEIGHT = 220;
const CENTER_X = 130;
const CENTER_Y = 100;
const AXIS_TOP_Y = CENTER_Y - 65;
const AXIS_BOTTOM_Y = CENTER_Y + 65;

export function ACGeneratorDiagram({ diagram, testID }: ACGeneratorDiagramProps): React.JSX.Element {
  const rotationPhase = String(diagram.parameters.rotation_phase ?? "vertical");
  const isVertical = rotationPhase === "vertical";

  const phaseDescription = isVertical
    ? "The loop is shown edge-on, its plane aligned with the field lines -- the position where it cuts the magnetic flux at the fastest rate, producing an EMF near its peak."
    : "The loop is shown face-on, its plane at right angles to the field lines, directly facing the poles -- the position where it is momentarily not cutting flux lines, producing an EMF near zero.";

  const accessibilityLabel = [
    "North pole on the left, south pole on the right.",
    "A single loop of wire rotates on a central vertical axis between the poles, with slip-ring connections at the axis carrying the output to the external circuit.",
    phaseDescription,
  ].join(" ");

  return (
    <Svg
      width={WIDTH}
      height={HEIGHT}
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      testID={testID}
      accessible
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="image"
    >
      <Pole x={16} y={CENTER_Y - 30} w={28} h={60} label="N" />
      <Pole x={WIDTH - 44} y={CENTER_Y - 30} w={28} h={60} label="S" />
      {[-24, 0, 24].map((dy) => (
        <FieldArrow key={dy} x1={54} y1={CENTER_Y + dy} x2={WIDTH - 54} y2={CENTER_Y + dy} />
      ))}

      {/* Rotation axis. */}
      <Line x1={CENTER_X} y1={AXIS_TOP_Y} x2={CENTER_X} y2={AXIS_BOTTOM_Y} stroke={color.textSecondary} strokeWidth={1.5} />

      {/* The loop itself -- the primary teaching element, drawn boldest. */}
      {isVertical ? (
        <Ellipse cx={CENTER_X} cy={CENTER_Y} rx={12} ry={44} fill={color.background} stroke={color.text} strokeWidth={3} />
      ) : (
        <Ellipse cx={CENTER_X} cy={CENTER_Y} rx={52} ry={16} fill={color.background} stroke={color.text} strokeWidth={3} />
      )}

      <RotationArrow />

      {/* Minimal slip-ring / output suggestion. */}
      <Line x1={CENTER_X} y1={AXIS_TOP_Y} x2={CENTER_X + 34} y2={AXIS_TOP_Y - 18} stroke={color.textSecondary} strokeWidth={1.5} />
      <Line x1={CENTER_X} y1={AXIS_BOTTOM_Y} x2={CENTER_X + 34} y2={AXIS_BOTTOM_Y + 18} stroke={color.textSecondary} strokeWidth={1.5} />
      <Circle cx={CENTER_X + 38} cy={AXIS_TOP_Y - 20} r={3} fill={color.textSecondary} />
      <Circle cx={CENTER_X + 38} cy={AXIS_BOTTOM_Y + 20} r={3} fill={color.textSecondary} />
      <SvgText x={CENTER_X + 44} y={AXIS_BOTTOM_Y + 24} fill={color.textSecondary} fontSize={10} textAnchor="start">
        Output
      </SvgText>

      <SvgText x={CENTER_X} y={HEIGHT - 8} fill={color.text} fontSize={12} fontWeight="700" textAnchor="middle">
        {isVertical ? "Loop plane aligned with field (near-peak EMF)" : "Loop plane facing poles (near-zero EMF)"}
      </SvgText>
    </Svg>
  );
}

function Pole({ x, y, w, h, label }: { x: number; y: number; w: number; h: number; label: "N" | "S" }) {
  return (
    <>
      <Rect x={x} y={y} width={w} height={h} fill="none" stroke={color.text} strokeWidth={2} rx={3} />
      <SvgText x={x + w / 2} y={y + h / 2 + 6} fill={color.text} fontSize={18} fontWeight="700" textAnchor="middle">
        {label}
      </SvgText>
    </>
  );
}

function FieldArrow({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) {
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const headLength = 7;
  const hx1 = x2 - headLength * Math.cos(angle - Math.PI / 6);
  const hy1 = y2 - headLength * Math.sin(angle - Math.PI / 6);
  const hx2 = x2 - headLength * Math.cos(angle + Math.PI / 6);
  const hy2 = y2 - headLength * Math.sin(angle + Math.PI / 6);
  return (
    <>
      <Line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color.textSecondary} strokeWidth={2} />
      <Path d={`M${x2},${y2} L${hx1},${hy1} L${hx2},${hy2} Z`} fill={color.textSecondary} />
    </>
  );
}

/** A small curved arrow around the axis, purely illustrating "this loop spins" -- no specific handedness is a governed/assessed fact in this scope, so one direction is drawn consistently and described in words only as "rotates". */
function RotationArrow() {
  const { path, endPoint, tangentAngleDeg } = arcPath(CENTER_X, CENTER_Y - 60, 14, 200, 500, 1);
  const headLength = 6;
  const rad = (tangentAngleDeg * Math.PI) / 180;
  const hx1 = endPoint.x - headLength * Math.cos(rad - Math.PI / 6);
  const hy1 = endPoint.y - headLength * Math.sin(rad - Math.PI / 6);
  const hx2 = endPoint.x - headLength * Math.cos(rad + Math.PI / 6);
  const hy2 = endPoint.y - headLength * Math.sin(rad + Math.PI / 6);
  return (
    <>
      <Path d={path} stroke={color.textSecondary} strokeWidth={1.5} fill="none" />
      <Path d={`M${endPoint.x},${endPoint.y} L${hx1},${hy1} L${hx2},${hy2} Z`} fill={color.textSecondary} />
    </>
  );
}
