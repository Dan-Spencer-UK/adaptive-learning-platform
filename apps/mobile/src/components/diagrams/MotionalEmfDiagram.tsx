/**
 * Governed geometry diagram for motional EMF (e = B x l x v,
 * EL-REL-INDUCED-EMF-001), backing the `emf.calculate_motional_emf`
 * question blueprint's formula-only representation with the one thing it
 * currently has zero visual support for: WHY the simple e = B l v formula
 * applies -- because B, l and v are always mutually perpendicular in this
 * governed scope. Two horizontal rails (receding into the distance, a
 * simple axonometric-flavoured sketch, never full 3D) carry a conductor
 * rod sliding across them at right angles. B is drawn straight down onto
 * the rail-plane from above (perpendicular to it); v runs along the
 * rails, in the plane; l labels the rod itself, which lies across the
 * rails, perpendicular to v.
 *
 * This is always the SAME given geometry (the governed formula family
 * never models an oblique/general case -- no vector maths or sin(theta)
 * is introduced anywhere in this scope), so there is no reveal prop and
 * no varying parameter: the diagram illustrates a fixed, structural fact
 * the learner is never asked to determine, only to use in a numeric
 * calculation the caller's own question prompt carries the values for.
 */
import type { DiagramInstance } from "@alp/calculation-engine";
import Svg, { Line, Path, Text as SvgText } from "react-native-svg";

import { color } from "@/lib/tokens";

export interface MotionalEmfDiagramProps {
  readonly diagram: DiagramInstance;
  readonly testID?: string;
}

const WIDTH = 280;
const HEIGHT = 230;

// Trapezoid rail geometry: the back edge (further away) is narrower and
// higher up the page; the front edge (nearer the viewer) is wider and
// lower down -- a simple perspective cue suggesting the rails recede into
// the distance, without attempting true 3D projection.
const BACK_Y = 55;
const BACK_LEFT_X = 105;
const BACK_RIGHT_X = 175;
const FRONT_Y = 195;
const FRONT_LEFT_X = 40;
const FRONT_RIGHT_X = 240;
const CENTER_X = (BACK_LEFT_X + BACK_RIGHT_X) / 2; // == (FRONT_LEFT_X + FRONT_RIGHT_X) / 2 == 140

// Conductor rod position: interpolated partway along the rails' depth.
const ROD_T = 0.55;
const ROD_Y = BACK_Y + ROD_T * (FRONT_Y - BACK_Y);
const ROD_LEFT_X = BACK_LEFT_X + ROD_T * (FRONT_LEFT_X - BACK_LEFT_X);
const ROD_RIGHT_X = BACK_RIGHT_X + ROD_T * (FRONT_RIGHT_X - BACK_RIGHT_X);

export function MotionalEmfDiagram({ diagram: _diagram, testID }: MotionalEmfDiagramProps): React.JSX.Element {
  const accessibilityLabel =
    "A conductor of length l lies across two parallel rails, at right angles to them, and can slide along the rails with velocity v. " +
    "The magnetic field B points straight down through the plane containing the rails, at right angles to that plane. " +
    "The conductor's length, its velocity and the magnetic field are mutually perpendicular to one another, which is why the simple formula e = B x l x v applies.";

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
      {/* Rails -- the given supporting structure, not itself a labelled vector, drawn as secondary/context weight. */}
      <Line x1={BACK_LEFT_X} y1={BACK_Y} x2={FRONT_LEFT_X} y2={FRONT_Y} stroke={color.textSecondary} strokeWidth={1.5} />
      <Line x1={BACK_RIGHT_X} y1={BACK_Y} x2={FRONT_RIGHT_X} y2={FRONT_Y} stroke={color.textSecondary} strokeWidth={1.5} />
      {/* Rail end-caps, purely to make the trapezoid read as a track rather than two stray lines. */}
      <Line x1={BACK_LEFT_X} y1={BACK_Y} x2={BACK_RIGHT_X} y2={BACK_Y} stroke={color.textSecondary} strokeWidth={1} />
      <Line x1={FRONT_LEFT_X} y1={FRONT_Y} x2={FRONT_RIGHT_X} y2={FRONT_Y} stroke={color.textSecondary} strokeWidth={1} />

      {/* B -- the magnetic field, perpendicular to the rail-plane: drawn as
          arrows descending straight down onto the track from above. */}
      {[BACK_LEFT_X, CENTER_X, BACK_RIGHT_X].map((x, i) => (
        <DownArrow key={i} x={x} y1={14} y2={BACK_Y - 4} />
      ))}
      <SvgText x={CENTER_X} y={10} fill={color.success} fontSize={13} fontWeight="700" textAnchor="middle">
        B
      </SvgText>

      {/* v -- velocity, along the rails' direction (in the rail-plane),
          drawn along the centreline so it reads as distinct from B's
          downward strike and from the rod's left-right span. */}
      <Line x1={CENTER_X} y1={ROD_Y - 45} x2={CENTER_X} y2={ROD_Y - 12} stroke={color.accent} strokeWidth={2.5} />
      <Path d={arrowheadDown(CENTER_X, ROD_Y - 12, 8)} fill={color.accent} />
      <SvgText x={CENTER_X + 16} y={ROD_Y - 25} fill={color.accent} fontSize={13} fontWeight="700" textAnchor="middle">
        v
      </SvgText>

      {/* l -- the conductor rod itself, lying across the rails at right
          angles to them: the primary teaching element, drawn boldest. */}
      <Line x1={ROD_LEFT_X} y1={ROD_Y} x2={ROD_RIGHT_X} y2={ROD_Y} stroke={color.text} strokeWidth={3.5} strokeLinecap="round" />
      <SvgText x={CENTER_X} y={ROD_Y + 18} fill={color.text} fontSize={13} fontWeight="700" textAnchor="middle">
        l
      </SvgText>

      <SvgText x={CENTER_X} y={HEIGHT - 8} fill={color.textSecondary} fontSize={10} textAnchor="middle">
        B, l and v are mutually perpendicular
      </SvgText>
    </Svg>
  );
}

function DownArrow({ x, y1, y2 }: { x: number; y1: number; y2: number }) {
  return (
    <>
      <Line x1={x} y1={y1} x2={x} y2={y2} stroke={color.success} strokeWidth={2} />
      <Path d={arrowheadDown(x, y2, 6)} fill={color.success} />
    </>
  );
}

function arrowheadDown(x: number, y: number, size: number): string {
  return `M${x},${y} L${x - size * 0.6},${y - size} L${x + size * 0.6},${y - size} Z`;
}
