/**
 * CC-11.3 (Unit 202 instructional visual coverage & correction gate): deterministic vector
 * rendering of a `mechanical.pulley_arrangement` `DiagramInstance` --
 * governed scope: a fixed pulley (FP-PULLEY-FIXED-VS-MOVABLE-001, MA=1,
 * changes direction only) versus one simple movable-pulley example
 * (MA≈2, per FP-REL-PULLEY-MECHANICAL-ADVANTAGE-001 -- mechanical
 * advantage approximates the number of rope/cable segments supporting
 * the load). No multi-pulley block-and-tackle systems are depicted -- the
 * corpus does not teach specific block-and-tackle ratios by name.
 *
 * A stylised schematic (straight rope segments, a circle for the pulley
 * wheel), not a physically-accurate rope-wrap path, per this course's
 * existing house style (see InstrumentConnectionDiagram.tsx /
 * MagneticForceDiagram.tsx -- neither attempts photorealistic rendering).
 */
import type { DiagramInstance } from "@alp/calculation-engine";
import Svg, { Circle, Line, Polygon, Rect, Text as SvgText } from "react-native-svg";

import { color } from "@/lib/tokens";

export interface PulleyDiagramProps {
  readonly diagram: DiagramInstance;
  readonly testID?: string;
}

type Arrangement = "fixed" | "movable";

const WIDTH = 240;
const HEIGHT = 240;
const WHEEL_RADIUS = 18;

export function PulleyDiagram({ diagram, testID }: PulleyDiagramProps): React.JSX.Element {
  const arrangement: Arrangement = diagram.parameters.arrangement === "movable" ? "movable" : "fixed";

  const accessibilityLabel =
    arrangement === "fixed"
      ? "A fixed pulley: the wheel is mounted to a fixed anchor at the top. Effort pulls down on one side of the rope, and the load hangs from the other side. One rope segment supports the load -- the pulley changes the direction of the force but gives no mechanical advantage."
      : "A movable pulley: the wheel is attached directly to the load and moves with it. One end of the rope is anchored to a fixed point at the top; the rope runs down around the movable pulley and back up to where the effort pulls. Two rope segments support the load, giving a mechanical advantage of approximately 2.";

  return (
    <Svg width={WIDTH} height={HEIGHT} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} testID={testID} accessible accessibilityLabel={accessibilityLabel} accessibilityRole="image">
      {arrangement === "fixed" ? <FixedPulley /> : <MovablePulley />}
    </Svg>
  );
}

function FixedAnchor({ x, y, width }: { x: number; y: number; width: number }) {
  const hatchCount = 5;
  const hatches = Array.from({ length: hatchCount }, (_, i) => {
    const hx = x - width / 2 + (i * width) / (hatchCount - 1);
    return <Line key={i} x1={hx} y1={y + 8} x2={hx - 6} y2={y + 18} stroke={color.textSecondary} strokeWidth={1.5} />;
  });
  return (
    <>
      <Rect x={x - width / 2} y={y} width={width} height={8} fill={color.text} />
      {hatches}
    </>
  );
}

function FixedPulley() {
  const cx = WIDTH / 2;
  const wheelCy = 55;
  const effortX = cx - 40;
  const loadX = cx + 40;
  const ropeBottomY = 190;

  return (
    <>
      <FixedAnchor x={cx} y={16} width={60} />
      <Line x1={cx} y1={24} x2={cx} y2={wheelCy - WHEEL_RADIUS} stroke={color.text} strokeWidth={2} />
      <Circle cx={cx} cy={wheelCy} r={WHEEL_RADIUS} fill={color.background} stroke={color.text} strokeWidth={2} />

      {/* Rope over the wheel: left side is effort (pulled down), right side is load (lifted). */}
      <Line x1={effortX} y1={wheelCy} x2={effortX} y2={ropeBottomY} stroke={color.text} strokeWidth={2} />
      <Polygon points={`${effortX},${ropeBottomY + 8} ${effortX - 6},${ropeBottomY - 4} ${effortX + 6},${ropeBottomY - 4}`} fill={color.text} />
      <SvgText x={effortX} y={ropeBottomY + 26} fill={color.text} fontSize={13} fontWeight="700" textAnchor="middle">
        Effort
      </SvgText>

      <Line x1={loadX} y1={wheelCy} x2={loadX} y2={ropeBottomY - 20} stroke={color.text} strokeWidth={2} />
      <Rect x={loadX - 16} y={ropeBottomY - 20} width={32} height={26} fill={color.background} stroke={color.text} strokeWidth={2} />
      <SvgText x={loadX} y={ropeBottomY + 26} fill={color.text} fontSize={13} fontWeight="700" textAnchor="middle">
        Load
      </SvgText>

      <SvgText x={cx} y={12} fill={color.textSecondary} fontSize={11} textAnchor="middle">
        Fixed anchor
      </SvgText>
    </>
  );
}

function MovablePulley() {
  const cx = WIDTH / 2;
  const anchorX = cx - 30;
  const effortX = cx + 30;
  const wheelCy = 150;
  const topY = 26;

  return (
    <>
      <FixedAnchor x={anchorX} y={16} width={30} />
      <SvgText x={anchorX} y={12} fill={color.textSecondary} fontSize={11} textAnchor="middle">
        Fixed anchor
      </SvgText>

      {/* Rope segment 1: fixed anchor straight down to the movable pulley. */}
      <Line x1={anchorX} y1={topY} x2={cx - WHEEL_RADIUS + 3} y2={wheelCy - 6} stroke={color.text} strokeWidth={2} />

      {/* Rope segment 2: movable pulley straight up to where the effort pulls. */}
      <Line x1={cx + WHEEL_RADIUS - 3} y1={wheelCy - 6} x2={effortX} y2={topY} stroke={color.text} strokeWidth={2} />
      <Polygon points={`${effortX},${topY - 8} ${effortX - 6},${topY + 4} ${effortX + 6},${topY + 4}`} fill={color.text} />
      <SvgText x={effortX} y={topY - 14} fill={color.text} fontSize={13} fontWeight="700" textAnchor="middle">
        Effort
      </SvgText>

      <Circle cx={cx} cy={wheelCy} r={WHEEL_RADIUS} fill={color.background} stroke={color.text} strokeWidth={2} />
      <Line x1={cx} y1={wheelCy + WHEEL_RADIUS} x2={cx} y2={wheelCy + WHEEL_RADIUS + 16} stroke={color.text} strokeWidth={2} />
      <Rect x={cx - 20} y={wheelCy + WHEEL_RADIUS + 16} width={40} height={28} fill={color.background} stroke={color.text} strokeWidth={2} />
      <SvgText x={cx} y={wheelCy + WHEEL_RADIUS + 60} fill={color.text} fontSize={13} fontWeight="700" textAnchor="middle">
        Load
      </SvgText>
    </>
  );
}
