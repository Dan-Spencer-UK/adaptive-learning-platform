/**
 * CC-05C: deterministic vector rendering of CC-05B's real
 * `circuit.series_resistors` DiagramInstance -- blueprint id, parameters
 * (component_count, show_current_arrow) and labels come straight from the
 * generated instance, never a static per-value image asset (design doc
 * §13). Labels stay symbolic (R1..Rn); numeric values belong in the
 * question prompt text, per design doc §2.8/§14 and CC-05C task brief §8
 * ("For resistor networks default to R1 R2 R3 in the visual and put
 * numeric values in question text") -- see this file's sibling
 * ParallelCircuitDiagram.tsx for the same convention applied to branches.
 */
import type { DiagramInstance } from "@alp/calculation-engine";
import { Fragment } from "react";
import { useWindowDimensions } from "react-native";
import Svg, { Line, Path, Text as SvgText } from "react-native-svg";

import { color } from "@/lib/tokens";
import { arrowheadPathData, lineArrowheadPoints } from "./arc-geometry";
import { horizontalResistorPath } from "./resistor-path";

export interface SeriesCircuitDiagramProps {
  readonly diagram: DiagramInstance;
  readonly testID?: string;
}

const HEIGHT = 140;
const MARGIN = 24;
const RESISTOR_WIDTH = 46;

export function SeriesCircuitDiagram({ diagram, testID }: SeriesCircuitDiagramProps): React.JSX.Element {
  const { width: windowWidth } = useWindowDimensions();
  const width = Math.max(260, Math.min(windowWidth - 48, 420));

  const count = Number(diagram.parameters.component_count ?? diagram.labels.length);
  const showCurrentArrow = diagram.parameters.show_current_arrow === true;
  const labels = diagram.labels.length > 0 ? diagram.labels : Array.from({ length: count }, (_, i) => `R${i + 1}`);

  const top = MARGIN;
  const bottom = HEIGHT - MARGIN;
  const left = MARGIN;
  const right = width - MARGIN;
  const span = right - left;
  const slot = span / count;

  // CC-11.3: the current-direction arrow needs a physical justification --
  // an arrow drawn without any source/polarity shown can look as if
  // direction were arbitrary rather than physically determined (task
  // brief §15). A battery is now drawn inline on the left wire whenever
  // the arrow is shown, with its polarity consistent with the shown
  // direction: bottom wire left-to-right -> (single loop) -> left wire
  // top-to-bottom -> the battery's + terminal sits at the BOTTOM of its
  // own symbol (conventional current exits + and continues down to the
  // bottom-left corner, then right along the bottom wire, matching the arrow).
  const midLeftY = (top + bottom) / 2;
  const accessibilityLabel = [
    `Series circuit diagram with ${count} resistor${count === 1 ? "" : "s"} labelled ${labels.join(", ")}, connected one after another in a single loop.`,
    showCurrentArrow
      ? "A battery is shown on the left wire, and an arrow on the return wire shows the current direction, flowing left to right -- consistent with the battery's own polarity."
      : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Svg
      width={width}
      height={HEIGHT}
      viewBox={`0 0 ${width} ${HEIGHT}`}
      testID={testID}
      accessible
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="image"
    >
      {/* Loop: left/right vertical wires, plain bottom return wire. */}
      {showCurrentArrow ? (
        <>
          <Line x1={left} y1={top} x2={left} y2={midLeftY - 10} stroke={color.text} strokeWidth={2} />
          <Line x1={left} y1={midLeftY + 10} x2={left} y2={bottom} stroke={color.text} strokeWidth={2} />
          <SeriesBattery x={left} yTop={midLeftY - 10} yBottom={midLeftY + 10} />
        </>
      ) : (
        <Line x1={left} y1={top} x2={left} y2={bottom} stroke={color.text} strokeWidth={2} />
      )}
      <Line x1={right} y1={top} x2={right} y2={bottom} stroke={color.text} strokeWidth={2} />
      <Line x1={left} y1={bottom} x2={right} y2={bottom} stroke={color.text} strokeWidth={2} />

      {Array.from({ length: count }, (_, i) => {
        const slotStart = left + slot * i;
        const resistorStart = slotStart + (slot - RESISTOR_WIDTH) / 2;
        const resistorEnd = resistorStart + RESISTOR_WIDTH;
        return (
          <Fragment key={i}>
            {i === 0 ? null : (
              <Line x1={slotStart} y1={top} x2={resistorStart} y2={top} stroke={color.text} strokeWidth={2} />
            )}
            <Line x1={slotStart} y1={top} x2={resistorStart} y2={top} stroke={color.text} strokeWidth={2} />
            <Path d={horizontalResistorPath(resistorStart, top, RESISTOR_WIDTH)} stroke={color.accent} strokeWidth={2} fill="none" />
            <Line
              x1={resistorEnd}
              y1={top}
              x2={i === count - 1 ? right : slotStart + slot}
              y2={top}
              stroke={color.text}
              strokeWidth={2}
            />
            <SvgText x={resistorStart + RESISTOR_WIDTH / 2} y={top - 10} fill={color.text} fontSize={13} fontWeight="700" textAnchor="middle">
              {labels[i]}
            </SvgText>
          </Fragment>
        );
      })}

      {showCurrentArrow ? <CurrentDirectionArrow left={left} right={right} y={bottom} /> : null}
    </Svg>
  );
}

/**
 * CC-11.3: the battery justifying the current-direction arrow -- explicit
 * "+"/"-" labels rather than relying on plate-length/thickness
 * conventions alone, so the polarity is unambiguous. Long thin plate =
 * positive terminal (at the bottom here, matching the shown current
 * direction -- see SeriesCircuitDiagram's own header comment for the
 * derivation); short thick plate = negative terminal.
 */
function SeriesBattery({ x, yTop, yBottom }: { x: number; yTop: number; yBottom: number }) {
  return (
    <>
      <Line x1={x - 5} y1={yTop} x2={x + 5} y2={yTop} stroke={color.text} strokeWidth={3} />
      <SvgText x={x + 12} y={yTop + 4} fill={color.text} fontSize={11} fontWeight="700" textAnchor="start">
        -
      </SvgText>
      <Line x1={x - 9} y1={yBottom} x2={x + 9} y2={yBottom} stroke={color.text} strokeWidth={1.5} />
      <SvgText x={x + 12} y={yBottom + 4} fill={color.text} fontSize={11} fontWeight="700" textAnchor="start">
        +
      </SvgText>
    </>
  );
}

/**
 * Current-direction indicator, drawn ON the return wire and pointing
 * along it (left to right) -- CC-05C-DIAGRAM-FIX corrects the earlier
 * version, whose triangle sat on this same horizontal wire but pointed
 * straight down, perpendicular to the conductor it was meant to label
 * (Product Owner finding, manual Android emulator review).
 */
function CurrentDirectionArrow({ left, right, y }: { left: number; right: number; y: number }) {
  const midX = (left + right) / 2;
  const tailX = midX - 16;
  const headX = midX + 16;
  const head = lineArrowheadPoints(tailX, y, headX, y, 7);
  return (
    <>
      <Line x1={tailX} y1={y} x2={headX} y2={y} stroke={color.accent} strokeWidth={2.5} />
      <Path d={arrowheadPathData(head)} fill={color.accent} />
      <SvgText x={midX} y={y + 20} fill={color.textSecondary} fontSize={11} textAnchor="middle">
        current direction
      </SvgText>
    </>
  );
}
