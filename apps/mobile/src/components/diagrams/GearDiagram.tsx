/**
 * CC-11.3 (Unit 202 instructional visual coverage & correction gate): deterministic vector
 * rendering of a `mechanical.gear_mesh` `DiagramInstance` -- governed
 * scope: two meshed gears (FP-CONCEPT-GEAR-001), whose relative size
 * (radius / tooth count) sets the mechanical advantage and the resulting
 * torque/speed trade-off (FP-REL-GEAR-RATIO-001,
 * FP-GEAR-SPEED-TORQUE-TRADEOFF-001). Recognition-depth only, per the
 * governed scope note in this component's own task brief -- there is no
 * numeric gear-ratio calculation blueprint, so this diagram never implies
 * a calculator feature: it draws relative size (larger/smaller/equal),
 * never numeric radii or tooth counts.
 *
 * No rotation-direction arrows: rotation direction is not the governed
 * teaching point here (torque/speed trade-off via size is) -- see
 * FP-GEAR-DIRECTION-REVERSAL-001, which is separate governed content this
 * diagram does not attempt to depict.
 */
import type { DiagramInstance } from "@alp/calculation-engine";
import Svg, { Circle, Line, Text as SvgText } from "react-native-svg";

import { color } from "@/lib/tokens";

export interface GearDiagramProps {
  readonly diagram: DiagramInstance;
  readonly testID?: string;
}

type SizeRatio = "driven_larger" | "driven_smaller" | "equal";

const WIDTH = 320;
const HEIGHT = 200;
const CENTER_Y = 100;
const DRIVER_RADIUS = 36;
const TOOTH_COUNT = 16;
const TOOTH_LENGTH = 8;

const DRIVEN_RADIUS: Readonly<Record<SizeRatio, number>> = {
  equal: DRIVER_RADIUS,
  driven_larger: 52,
  driven_smaller: 22,
};

const SIZE_DESCRIPTION: Readonly<Record<SizeRatio, string>> = {
  equal: "the same size as the driver gear, so speed and torque are unchanged",
  driven_larger: "larger than the driver gear, meaning it turns more slowly and produces higher output torque",
  driven_smaller: "smaller than the driver gear, meaning it turns faster and produces lower output torque",
};

export function GearDiagram({ diagram, testID }: GearDiagramProps): React.JSX.Element {
  const sizeRatio: SizeRatio =
    diagram.parameters.size_ratio === "driven_larger" || diagram.parameters.size_ratio === "driven_smaller" ? diagram.parameters.size_ratio : "equal";

  const driverRadius = DRIVER_RADIUS;
  const drivenRadius = DRIVEN_RADIUS[sizeRatio];
  const driverCx = 90;
  const drivenCx = driverCx + driverRadius + drivenRadius;

  const accessibilityLabel = `The driver gear meshes with the driven gear. The driven gear is ${SIZE_DESCRIPTION[sizeRatio]}.`;

  return (
    <Svg width={WIDTH} height={HEIGHT} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} testID={testID} accessible accessibilityLabel={accessibilityLabel} accessibilityRole="image">
      <Gear cx={driverCx} cy={CENTER_Y} radius={driverRadius} label="Driver" />
      <Gear cx={drivenCx} cy={CENTER_Y} radius={drivenRadius} label="Driven" />
    </Svg>
  );
}

function Gear({ cx, cy, radius, label }: { cx: number; cy: number; radius: number; label: string }) {
  const teeth = [];
  for (let i = 0; i < TOOTH_COUNT; i += 1) {
    const angle = (2 * Math.PI * i) / TOOTH_COUNT;
    const x1 = cx + radius * Math.cos(angle);
    const y1 = cy + radius * Math.sin(angle);
    const x2 = cx + (radius + TOOTH_LENGTH) * Math.cos(angle);
    const y2 = cy + (radius + TOOTH_LENGTH) * Math.sin(angle);
    teeth.push(<Line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={color.text} strokeWidth={1.5} />);
  }

  return (
    <>
      {teeth}
      <Circle cx={cx} cy={cy} r={radius} fill={color.background} stroke={color.text} strokeWidth={2} />
      <Circle cx={cx} cy={cy} r={4} fill={color.text} />
      <SvgText x={cx} y={cy + radius + TOOTH_LENGTH + 18} fill={color.text} fontSize={13} fontWeight="700" textAnchor="middle">
        {label}
      </SvgText>
    </>
  );
}
