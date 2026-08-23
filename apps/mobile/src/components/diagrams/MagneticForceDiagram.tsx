/**
 * CC-05C: deterministic vector rendering of CC-05B's real
 * `motor.force_field_current` DiagramInstance -- pole arrangement and
 * current direction are dynamic, governed parameters (design doc §10.1's
 * required proof: "direction arrows / magnetic-field diagram"). Every
 * label is textual as well as symbolic/positional, per design doc §15 --
 * "meaning must not depend on colour alone" (and, by the same principle
 * applied here, not on an unlabelled arrow/symbol alone either).
 *
 * `forceDirection` is deliberately a separate, optional prop rather than
 * always honouring `diagram.parameters.show_force_arrow`: CC-05B's own
 * `interpretForceDirection` executor sets `show_force_arrow: true` on the
 * assessment diagram it builds, but visually drawing the correct force
 * arrow on a question that asks the learner to determine that exact
 * direction would hand them the answer. This component never computes a
 * direction itself (that stays CC-05B's job -- see the real
 * `FORCE_DIRECTION` lookup in @alp/calculation-engine's magnetism.ts); the
 * caller decides whether to pass one: the lesson screen generates a real
 * instance and passes its already-engine-computed `expected.value`
 * (teaching context, arrow shown); the practice screen omits it
 * (assessment context, arrow withheld until after the learner answers).
 * See docs/architecture/evidence/CC-05C-NATIVE-LEARNER-PROVING-SLICE.md
 * for the full rationale.
 */
import type { DiagramInstance } from "@alp/calculation-engine";
import Svg, { Circle, Line, Polygon, Rect, Text as SvgText } from "react-native-svg";

import { color } from "@/lib/tokens";

export interface MagneticForceDiagramProps {
  readonly diagram: DiagramInstance;
  readonly forceDirection?: "up" | "down" | "left" | "right";
  readonly testID?: string;
}

const WIDTH = 260;
const HEIGHT = 180;
const CENTER_X = WIDTH / 2;
const CENTER_Y = HEIGHT / 2;
const CONDUCTOR_RADIUS = 12;

export function MagneticForceDiagram({ diagram, forceDirection, testID }: MagneticForceDiagramProps): React.JSX.Element {
  const poleLabels = String(diagram.parameters.pole_labels ?? "N_S_horizontal");
  const currentDirection = String(diagram.parameters.current_direction ?? "into_page");
  const horizontal = poleLabels === "N_S_horizontal";
  const currentLabel = currentDirection === "into_page" ? "into the page" : "out of the page";
  // CC-11 (Workstream D visual audit finding): "current" here means
  // conventional current -- F = I L x B is defined in terms of
  // conventional current, and the corpus separately teaches electron
  // theory (electrons flow the opposite way), so an undisambiguated
  // "current" risks reinforcing the real, governed
  // MIS-EL-ELECTRON-CURRENT-DIRECTION-CONFUSION-001 misconception this
  // diagram's own question blueprint (magnetism.interpret_force_direction)
  // targets.
  const conventionalCurrentLabel = `conventional current ${currentLabel}`;

  const accessibilityLabel = [
    horizontal ? "North pole on the left, south pole on the right." : "North pole at the top, south pole at the bottom.",
    `Field arrows point from north to south.`,
    `The ${conventionalCurrentLabel} in the conductor.`,
    forceDirection ? `Resulting force on the conductor acts ${forceDirection}wards.` : "Force direction not shown.",
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
      {horizontal ? (
        <>
          <Pole x={16} y={CENTER_Y - 30} w={28} h={60} label="N" />
          <Pole x={WIDTH - 44} y={CENTER_Y - 30} w={28} h={60} label="S" />
          {[-24, 0, 24].map((dy) => (
            <FieldArrow key={dy} x1={54} y1={CENTER_Y + dy} x2={WIDTH - 54} y2={CENTER_Y + dy} />
          ))}
        </>
      ) : (
        <>
          <Pole x={CENTER_X - 30} y={16} w={60} h={28} label="N" />
          <Pole x={CENTER_X - 30} y={HEIGHT - 44} w={60} h={28} label="S" />
          {[-24, 0, 24].map((dx) => (
            <FieldArrow key={dx} x1={CENTER_X + dx} y1={54} x2={CENTER_X + dx} y2={HEIGHT - 54} />
          ))}
        </>
      )}

      <Circle cx={CENTER_X} cy={CENTER_Y} r={CONDUCTOR_RADIUS} fill={color.background} stroke={color.text} strokeWidth={2} />
      {currentDirection === "out_of_page" ? (
        <Circle cx={CENTER_X} cy={CENTER_Y} r={3} fill={color.text} />
      ) : (
        <>
          <Line x1={CENTER_X - 6} y1={CENTER_Y - 6} x2={CENTER_X + 6} y2={CENTER_Y + 6} stroke={color.text} strokeWidth={2} />
          <Line x1={CENTER_X - 6} y1={CENTER_Y + 6} x2={CENTER_X + 6} y2={CENTER_Y - 6} stroke={color.text} strokeWidth={2} />
        </>
      )}
      <SvgText x={CENTER_X} y={CENTER_Y + CONDUCTOR_RADIUS + 16} fill={color.textSecondary} fontSize={11} textAnchor="middle">
        {conventionalCurrentLabel}
      </SvgText>

      {forceDirection ? <ForceArrow direction={forceDirection} /> : null}
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
      <Line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color.textSecondary} strokeWidth={1.5} />
      <Polygon points={`${x2},${y2} ${hx1},${hy1} ${hx2},${hy2}`} fill={color.textSecondary} />
    </>
  );
}

const FORCE_ARROW_GEOMETRY: Record<"up" | "down" | "left" | "right", { x1: number; y1: number; x2: number; y2: number }> = {
  up: { x1: CENTER_X, y1: CENTER_Y - CONDUCTOR_RADIUS - 4, x2: CENTER_X, y2: CENTER_Y - CONDUCTOR_RADIUS - 34 },
  down: { x1: CENTER_X, y1: CENTER_Y + CONDUCTOR_RADIUS + 4, x2: CENTER_X, y2: CENTER_Y + CONDUCTOR_RADIUS + 34 },
  left: { x1: CENTER_X - CONDUCTOR_RADIUS - 4, y1: CENTER_Y, x2: CENTER_X - CONDUCTOR_RADIUS - 34, y2: CENTER_Y },
  right: { x1: CENTER_X + CONDUCTOR_RADIUS + 4, y1: CENTER_Y, x2: CENTER_X + CONDUCTOR_RADIUS + 34, y2: CENTER_Y },
};

function ForceArrow({ direction }: { direction: "up" | "down" | "left" | "right" }) {
  const { x1, y1, x2, y2 } = FORCE_ARROW_GEOMETRY[direction];
  const labelX = direction === "left" ? x2 - 18 : direction === "right" ? x2 + 18 : x2;
  const labelY = direction === "up" ? y2 - 8 : direction === "down" ? y2 + 16 : y2 + 4;
  return (
    <>
      <FieldArrow x1={x1} y1={y1} x2={x2} y2={y2} />
      <SvgText x={labelX} y={labelY} fill={color.success} fontSize={12} fontWeight="700" textAnchor="middle">
        {`Force: ${direction}`}
      </SvgText>
    </>
  );
}
