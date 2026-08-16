/**
 * CC-05C-DIAGRAM-FIX: deterministic vector rendering of CC-05B's real
 * `magnetic.field_conductor_direction` DiagramInstance as a genuine
 * right-hand-grip-rule teaching aid -- a stylised right hand gripping the
 * conductor, with an explicitly labelled thumb (points along the current
 * direction) and four curled fingers (wrap the direction of the magnetic
 * field around the conductor). This replaces the earlier approach of
 * showing only a generic field/current arrangement under a "right-hand
 * grip rule" caption (Product Owner finding, manual Android emulator
 * review): the rule cannot be understood from an image that never draws
 * a hand.
 *
 * Physical rule (right-hand grip rule, viewed end-on -- the same
 * `FIELD_ROTATION_BY_CURRENT_DIRECTION` lookup @alp/calculation-engine's
 * magnetism.ts uses, re-derived and cross-checked there, not invented
 * here): thumb points along the current; the curl of the fingers gives
 * the field's rotation direction. Current toward the viewer (out of the
 * page) curls the field anticlockwise as seen by the viewer; current away
 * from the viewer (into the page) curls it clockwise.
 *
 * `fieldRotation` is deliberately a separate, optional prop -- the same
 * reveal/withhold pattern MagneticForceDiagram.tsx uses for its force
 * arrow: the thumb (current direction) is always shown, since it is given
 * information; the finger-curl direction arrow (the assessed answer) is
 * drawn only when explicitly supplied by the caller (teaching context),
 * never derived by this component itself.
 */
import type { DiagramInstance } from "@alp/calculation-engine";
import Svg, { Circle, Line, Path, Text as SvgText } from "react-native-svg";

import { color } from "@/lib/tokens";
import { arcPath, arrowheadPathData, arrowheadPoints } from "./arc-geometry";

export interface RightHandGripRuleDiagramProps {
  readonly diagram: DiagramInstance;
  readonly fieldRotation?: "clockwise" | "counterclockwise";
  readonly testID?: string;
}

const WIDTH = 260;
const HEIGHT = 240;
const CONDUCTOR_X = 175;
const CONDUCTOR_Y = 95;
const CONDUCTOR_RADIUS = 14;
const FIELD_ARC_RADIUS = 34;
// Status-line y-positions live in their own band, well below the thumb
// caption (~y150-163) and the hand/conductor graphics, so no text ever
// overlaps another -- CC-05C-DIAGRAM-FIX found the original layout let
// the field-rotation label collide with the thumb caption on real-device
// review.
const CURRENT_LABEL_Y = 205;
const FIELD_LABEL_Y = 222;

export function RightHandGripRuleDiagram({ diagram, fieldRotation, testID }: RightHandGripRuleDiagramProps): React.JSX.Element {
  const currentDirection = String(diagram.parameters.current_direction ?? "into_page");
  const currentLabel = currentDirection === "into_page" ? "into the page" : "out of the page";

  const accessibilityLabel = [
    "Right-hand grip rule.",
    `The thumb points along the conductor, in the direction the current flows: ${currentLabel}.`,
    fieldRotation
      ? `The curled fingers show the magnetic field circling ${fieldRotation} as seen by the viewer.`
      : "The direction the fingers curl (the magnetic field direction) is not shown.",
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
      {/* Conductor cross-section, same visual language as MagneticForceDiagram's conductor. */}
      <Circle cx={CONDUCTOR_X} cy={CONDUCTOR_Y} r={CONDUCTOR_RADIUS} fill={color.background} stroke={color.text} strokeWidth={2} />
      {currentDirection === "out_of_page" ? (
        <Circle cx={CONDUCTOR_X} cy={CONDUCTOR_Y} r={3} fill={color.text} />
      ) : (
        <>
          <Line x1={CONDUCTOR_X - 6} y1={CONDUCTOR_Y - 6} x2={CONDUCTOR_X + 6} y2={CONDUCTOR_Y + 6} stroke={color.text} strokeWidth={2} />
          <Line x1={CONDUCTOR_X - 6} y1={CONDUCTOR_Y + 6} x2={CONDUCTOR_X + 6} y2={CONDUCTOR_Y - 6} stroke={color.text} strokeWidth={2} />
        </>
      )}

      {/* Palm. */}
      <PalmShape />

      {/* Thumb -- extends from the palm to the conductor, along the current direction. Coloured and labelled distinctly from the fingers so the rule reads correctly without relying on shape recognition alone. */}
      <Line
        x1={92}
        y1={128}
        x2={CONDUCTOR_X - CONDUCTOR_RADIUS - 2}
        y2={CONDUCTOR_Y + 4}
        stroke={color.accent}
        strokeWidth={13}
        strokeLinecap="round"
      />
      <SvgText x={80} y={150} fill={color.accent} fontSize={11} fontWeight="700" textAnchor="middle">
        Thumb
      </SvgText>
      <SvgText x={80} y={163} fill={color.textSecondary} fontSize={10} textAnchor="middle">
        (current direction)
      </SvgText>

      {/* Four curled fingers, wrapping from the palm over the top of the conductor. */}
      {FINGER_CURLS.map((d, i) => (
        <Path key={i} d={d} stroke={color.text} strokeWidth={9} strokeLinecap="round" fill="none" />
      ))}
      <SvgText x={90} y={40} fill={color.text} fontSize={11} fontWeight="700" textAnchor="middle">
        Fingers
      </SvgText>
      <SvgText x={90} y={53} fill={color.textSecondary} fontSize={10} textAnchor="middle">
        (field direction)
      </SvgText>

      {fieldRotation ? <FieldRotationArrow rotation={fieldRotation} /> : null}

      <SvgText x={CONDUCTOR_X} y={CURRENT_LABEL_Y} fill={color.textSecondary} fontSize={11} textAnchor="middle">
        {`current ${currentLabel}`}
      </SvgText>
    </Svg>
  );
}

function PalmShape() {
  return (
    <Path
      d="M40,100 Q34,128 56,138 Q80,148 100,132 Q106,118 92,108 Q84,96 68,94 Q50,92 40,100 Z"
      fill={color.surface}
      stroke={color.text}
      strokeWidth={2}
    />
  );
}

/** Four fanned finger curls, drawn from the top of the palm, wrapping toward the top of the conductor. */
const FINGER_CURLS = [
  "M50,96 Q78,44 155,72",
  "M58,90 Q90,36 158,62",
  "M67,86 Q100,30 160,53",
  "M76,84 Q110,28 161,44",
];

function FieldRotationArrow({ rotation }: { rotation: "clockwise" | "counterclockwise" }) {
  const sweep = rotation === "clockwise" ? 1 : 0;
  // Draw ~300 degrees of arc around the conductor, leaving a gap near the
  // thumb so the arrow reads as "wrapping the conductor", with an
  // arrowhead at the travel-direction end.
  const startAngle = 200;
  const endAngle = rotation === "clockwise" ? startAngle + 300 : startAngle - 300;
  const { path, endPoint, tangentAngleDeg } = arcPath(CONDUCTOR_X, CONDUCTOR_Y, FIELD_ARC_RADIUS, startAngle, endAngle, sweep);
  const head = arrowheadPoints(endPoint.x, endPoint.y, tangentAngleDeg, 8);

  return (
    <>
      <Path d={path} stroke={color.success} strokeWidth={2.5} fill="none" />
      <Path d={arrowheadPathData(head)} fill={color.success} />
      <SvgText x={CONDUCTOR_X} y={FIELD_LABEL_Y} fill={color.success} fontSize={11} fontWeight="700" textAnchor="middle">
        {`Field: ${rotation}`}
      </SvgText>
    </>
  );
}
