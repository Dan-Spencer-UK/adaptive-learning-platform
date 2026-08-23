/**
 * CC-11.3 (Unit 202 instructional visual coverage & correction gate): deterministic vector
 * rendering of a `mechanical.lever_arrangement` `DiagramInstance` --
 * governed scope: three lever classes (FP-LEVER-CLASS-I/II/III-001),
 * distinguished purely by the relative arrangement of pivot, effort and
 * load along the bar, plus the moment-balance relationship
 * (FP-REL-LEVER-BALANCE-001, Fe x de = Fl x dl) when `show_distances` is
 * requested.
 *
 * This diagram's real use (`levers.identify_class`) asks the learner to
 * name the class FROM the arrangement shown -- the class is never
 * withheld or ambiguous here (unlike MagneticForceDiagram's optional
 * `forceDirection` reveal prop): the diagram always depicts a real,
 * structurally-correct arrangement for the requested `lever_class`
 * parameter, and the learner's job is to read the arrangement, not guess
 * at a hidden value. There is therefore no separate reveal prop.
 *
 * Position, not colour, carries the class distinction (design doc §15 --
 * "meaning must not depend on colour alone"), and every element is also
 * named in the always-present `accessibilityLabel`.
 */
import type { DiagramInstance } from "@alp/calculation-engine";
import Svg, { Line, Polygon, Text as SvgText } from "react-native-svg";

import { color } from "@/lib/tokens";

export interface LeverDiagramProps {
  readonly diagram: DiagramInstance;
  readonly testID?: string;
}

type LeverClass = "class_1" | "class_2" | "class_3";
type Role = "pivot" | "effort" | "load";

const WIDTH = 280;
const HEIGHT = 200;
const BAR_Y = 70;
const BAR_HEIGHT = 8;
const LEFT_X = 50;
const MID_X = 140;
const RIGHT_X = 230;

/** Structural definition of each governed lever class: which role sits at which of the bar's three positions. Never a display-only convention -- this IS the assertion (FP-LEVER-CLASS-I/II/III-001) encoded as geometry. */
const ARRANGEMENT: Readonly<Record<LeverClass, Readonly<Record<"left" | "mid" | "right", Role>>>> = {
  // Class I: pivot between effort and load.
  class_1: { left: "effort", mid: "pivot", right: "load" },
  // Class II: load between pivot and effort.
  class_2: { left: "pivot", mid: "load", right: "effort" },
  // Class III: effort between pivot and load.
  class_3: { left: "pivot", mid: "effort", right: "load" },
};

const CLASS_NAME: Readonly<Record<LeverClass, string>> = {
  class_1: "Class I",
  class_2: "Class II",
  class_3: "Class III",
};

function positionsFor(leverClass: LeverClass): Record<Role, number> {
  const arrangement = ARRANGEMENT[leverClass];
  const positions: Partial<Record<Role, number>> = {};
  positions[arrangement.left] = LEFT_X;
  positions[arrangement.mid] = MID_X;
  positions[arrangement.right] = RIGHT_X;
  return positions as Record<Role, number>;
}

function orderDescription(leverClass: LeverClass): string {
  const arrangement = ARRANGEMENT[leverClass];
  const label = (role: Role) => (role === "pivot" ? "the pivot" : role === "effort" ? "the effort" : "the load");
  return `${label(arrangement.left)} on the left, ${label(arrangement.mid)} in the middle, and ${label(arrangement.right)} on the right`;
}

export function LeverDiagram({ diagram, testID }: LeverDiagramProps): React.JSX.Element {
  const leverClass: LeverClass =
    diagram.parameters.lever_class === "class_2" || diagram.parameters.lever_class === "class_3" ? diagram.parameters.lever_class : "class_1";
  const showDistances = diagram.parameters.show_distances === true;

  const positions = positionsFor(leverClass);
  const pivotX = positions.pivot;
  const effortX = positions.effort;
  const loadX = positions.load;

  const accessibilityLabel = [
    `A ${CLASS_NAME[leverClass]} lever with ${orderDescription(leverClass)}.`,
    showDistances
      ? `Distance brackets show the effort arm, de, measured from the pivot to the effort, and the load arm, dl, measured from the pivot to the load.`
      : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Svg width={WIDTH} height={HEIGHT} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} testID={testID} accessible accessibilityLabel={accessibilityLabel} accessibilityRole="image">
      {/* The bar itself -- the primary structural element. */}
      <Line x1={LEFT_X} y1={BAR_Y} x2={RIGHT_X} y2={BAR_Y} stroke={color.text} strokeWidth={6} strokeLinecap="round" />

      <ForceArrow x={effortX} label="Effort" />
      <ForceArrow x={loadX} label="Load" />
      <Pivot x={pivotX} />

      {showDistances ? (
        <>
          <DistanceBracket x1={Math.min(pivotX, effortX)} x2={Math.max(pivotX, effortX)} y={140} label="de" />
          <DistanceBracket x1={Math.min(pivotX, loadX)} x2={Math.max(pivotX, loadX)} y={168} label="dl" />
        </>
      ) : null}
    </Svg>
  );
}

/** Both effort and load are drawn identically (a downward arrow onto the bar) -- position along the bar, not arrow direction, is what distinguishes them; the text label carries the rest. */
function ForceArrow({ x, label }: { x: number; label: "Effort" | "Load" }) {
  const y1 = 18;
  const y2 = BAR_Y - 2;
  return (
    <>
      <Line x1={x} y1={y1} x2={x} y2={y2} stroke={color.text} strokeWidth={2} />
      <Polygon points={`${x},${y2 + 6} ${x - 5},${y2 - 4} ${x + 5},${y2 - 4}`} fill={color.text} />
      <SvgText x={x} y={y1 - 6} fill={color.text} fontSize={13} fontWeight="700" textAnchor="middle">
        {label}
      </SvgText>
    </>
  );
}

function Pivot({ x }: { x: number }) {
  const apexY = BAR_Y + BAR_HEIGHT / 2 + 3;
  const baseY = apexY + 22;
  return (
    <>
      <Polygon points={`${x},${apexY} ${x - 14},${baseY} ${x + 14},${baseY}`} fill={color.text} />
      <SvgText x={x} y={baseY + 16} fill={color.text} fontSize={13} fontWeight="700" textAnchor="middle">
        Pivot
      </SvgText>
    </>
  );
}

function DistanceBracket({ x1, x2, y, label }: { x1: number; x2: number; y: number; label: string }) {
  return (
    <>
      <Line x1={x1} y1={y} x2={x2} y2={y} stroke={color.textSecondary} strokeWidth={1.5} />
      <Line x1={x1} y1={y - 5} x2={x1} y2={y + 5} stroke={color.textSecondary} strokeWidth={1.5} />
      <Line x1={x2} y1={y - 5} x2={x2} y2={y + 5} stroke={color.textSecondary} strokeWidth={1.5} />
      <SvgText x={(x1 + x2) / 2} y={y - 8} fill={color.textSecondary} fontSize={12} fontWeight="700" textAnchor="middle">
        {label}
      </SvgText>
    </>
  );
}
