/**
 * Governed teaching/assessment diagram for like-poles-repel /
 * unlike-poles-attract (EL-CONCEPT-MAGNETISM-001), backing the
 * `magnetism.recognise_attraction_repulsion` question blueprint. Two bar
 * magnets face each other across a central gap; each magnet always shows
 * BOTH of its own poles (a real bar-magnet illustration, not an
 * abbreviated single-end symbol), so the learner can see which pole is
 * "outer" and which is "inner" (facing the gap) on each magnet.
 *
 * Structural correctness: the left magnet's facing (inner) pole is always
 * drawn as N; the `pole_pairing` parameter drives the right magnet's
 * facing pole only (N for "like_poles_facing", S for "unlike_poles_facing").
 * This means the component can never accidentally render an inconsistent
 * pairing -- the two facing labels are always the direct, deterministic
 * consequence of one governed enum value, never independently chosen.
 *
 * `showForceArrows` follows the same reveal/withhold pattern as
 * MagneticForceDiagram.tsx's `forceDirection` and RightHandGripRuleDiagram
 * .tsx's `fieldRotation`: the pole labels (given information) are always
 * shown; the force arrows in the gap -- which visually give away whether
 * the magnets attract or repel, the exact thing
 * `magnetism.recognise_attraction_repulsion` asks the learner to judge --
 * are drawn, and stated in the accessibility label, only when the caller
 * explicitly passes `showForceArrows` (teaching context). The component
 * never infers teaching-vs-assessment context itself.
 */
import type { DiagramInstance } from "@alp/calculation-engine";
import Svg, { Line, Polygon, Rect, Text as SvgText } from "react-native-svg";

import { color } from "@/lib/tokens";

export interface MagneticPoleDiagramProps {
  readonly diagram: DiagramInstance;
  readonly showForceArrows?: boolean;
  readonly testID?: string;
}

const WIDTH = 260;
const HEIGHT = 140;
const MAGNET_Y = 45;
const MAGNET_H = 50;
const GAP_CENTER_X = 130;

// Left magnet: outer (left) half then inner (facing-gap, right) half.
const LEFT_OUTER_X = 20;
const LEFT_INNER_X = 60;
const LEFT_MAGNET_END_X = 100;

// Right magnet: inner (facing-gap, left) half then outer (right) half.
const RIGHT_MAGNET_START_X = 160;
const RIGHT_INNER_X = 160;
const RIGHT_OUTER_X = 200;
const RIGHT_MAGNET_END_X = 240;

const HALF_W = 40;

export function MagneticPoleDiagram({ diagram, showForceArrows, testID }: MagneticPoleDiagramProps): React.JSX.Element {
  const polePairing = String(diagram.parameters.pole_pairing ?? "unlike_poles_facing");
  const isLike = polePairing === "like_poles_facing";

  // Design decision (see header comment): the left magnet's facing pole is
  // always N; only the right magnet's facing pole varies with the governed
  // parameter, so the rendered pairing is always the deterministic
  // consequence of `pole_pairing`, never an independently-chosen pair that
  // could drift out of sync with it.
  const leftFacingPole = "N" as const;
  const rightFacingPole = isLike ? ("N" as const) : ("S" as const);
  const leftOuterPole = "S" as const;
  const rightOuterPole = isLike ? ("S" as const) : ("N" as const);

  const facingDescription =
    rightFacingPole === "N"
      ? "the north pole of the left magnet faces the north pole of the right magnet"
      : "the north pole of the left magnet faces the south pole of the right magnet";

  const behaviour = rightFacingPole === "N" ? "repel" : "attract";

  const accessibilityLabel = [
    `Two bar magnets facing each other: ${facingDescription}.`,
    showForceArrows ? `Because ${rightFacingPole === "N" ? "both facing poles are north (like poles)" : "the facing poles are north and south (unlike poles)"}, the magnets ${behaviour} each other.` : "",
  ]
    .filter(Boolean)
    .join(" ");

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
      {/* Left magnet: outer half (S) then inner/facing half (N). */}
      <PoleHalf x={LEFT_OUTER_X} label={leftOuterPole} />
      <PoleHalf x={LEFT_INNER_X} label={leftFacingPole} />
      <Rect x={LEFT_OUTER_X} y={MAGNET_Y} width={LEFT_MAGNET_END_X - LEFT_OUTER_X} height={MAGNET_H} fill="none" stroke={color.text} strokeWidth={2} rx={3} />

      {/* Right magnet: inner/facing half then outer half. */}
      <PoleHalf x={RIGHT_INNER_X} label={rightFacingPole} />
      <PoleHalf x={RIGHT_OUTER_X} label={rightOuterPole} />
      <Rect x={RIGHT_MAGNET_START_X} y={MAGNET_Y} width={RIGHT_MAGNET_END_X - RIGHT_MAGNET_START_X} height={MAGNET_H} fill="none" stroke={color.text} strokeWidth={2} rx={3} />

      {showForceArrows ? <ForceArrows repel={rightFacingPole === "N"} /> : null}

      <SvgText x={GAP_CENTER_X} y={HEIGHT - 12} fill={color.textSecondary} fontSize={11} textAnchor="middle">
        {isLike ? "like poles facing" : "unlike poles facing"}
      </SvgText>
    </Svg>
  );
}

function PoleHalf({ x, label }: { x: number; label: "N" | "S" }) {
  return (
    <SvgText x={x + HALF_W / 2} y={MAGNET_Y + MAGNET_H / 2 + 6} fill={color.text} fontSize={18} fontWeight="700" textAnchor="middle">
      {label}
    </SvgText>
  );
}

/**
 * Force-direction arrows in the central gap -- the diagram's answer-bearing
 * element (see header comment). Repel: arrows point outward, away from the
 * gap centre toward each magnet. Attract: arrows point inward, toward the
 * gap centre.
 */
function ForceArrows({ repel }: { repel: boolean }) {
  const y = MAGNET_Y + MAGNET_H / 2;
  const near = 20; // distance from centre where each arrow starts
  const far = 42; // distance from centre where each arrow ends (arrowhead)
  const leftArrow = repel ? { x1: GAP_CENTER_X - near, y1: y, x2: GAP_CENTER_X - far, y2: y } : { x1: GAP_CENTER_X - far, y1: y, x2: GAP_CENTER_X - near, y2: y };
  const rightArrow = repel ? { x1: GAP_CENTER_X + near, y1: y, x2: GAP_CENTER_X + far, y2: y } : { x1: GAP_CENTER_X + far, y1: y, x2: GAP_CENTER_X + near, y2: y };
  return (
    <>
      <ForceArrow {...leftArrow} />
      <ForceArrow {...rightArrow} />
      <SvgText x={GAP_CENTER_X} y={y - 30} fill={color.success} fontSize={12} fontWeight="700" textAnchor="middle">
        {repel ? "Repel" : "Attract"}
      </SvgText>
    </>
  );
}

function ForceArrow({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) {
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const headLength = 8;
  const hx1 = x2 - headLength * Math.cos(angle - Math.PI / 6);
  const hy1 = y2 - headLength * Math.sin(angle - Math.PI / 6);
  const hx2 = x2 - headLength * Math.cos(angle + Math.PI / 6);
  const hy2 = y2 - headLength * Math.sin(angle + Math.PI / 6);
  return (
    <>
      <Line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color.success} strokeWidth={2.5} />
      <Polygon points={`${x2},${y2} ${hx1},${hy1} ${hx2},${hy2}`} fill={color.success} />
    </>
  );
}
