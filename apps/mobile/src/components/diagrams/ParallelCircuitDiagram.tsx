/**
 * CC-05C: deterministic vector rendering of CC-05B's real
 * `circuit.parallel_resistors` DiagramInstance -- see SeriesCircuitDiagram.tsx
 * for the shared symbolic-labels-only convention this mirrors.
 */
import type { DiagramInstance } from "@alp/calculation-engine";
import { Fragment } from "react";
import { useWindowDimensions } from "react-native";
import Svg, { Line, Path, Polygon, Text as SvgText } from "react-native-svg";

import { color } from "@/lib/tokens";
import { verticalResistorPath } from "./resistor-path";

export interface ParallelCircuitDiagramProps {
  readonly diagram: DiagramInstance;
  readonly testID?: string;
}

const HEIGHT = 150;
const MARGIN = 24;
const RESISTOR_HEIGHT = 46;

export function ParallelCircuitDiagram({ diagram, testID }: ParallelCircuitDiagramProps): React.JSX.Element {
  const { width: windowWidth } = useWindowDimensions();
  const width = Math.max(260, Math.min(windowWidth - 48, 420));

  const count = Number(diagram.parameters.branch_count ?? diagram.labels.length);
  const showBranchArrows = diagram.parameters.show_branch_current_arrows === true;
  const labels = diagram.labels.length > 0 ? diagram.labels : Array.from({ length: count }, (_, i) => `R${i + 1}`);

  const top = MARGIN;
  const bottom = HEIGHT - MARGIN;
  const left = MARGIN;
  const right = width - MARGIN;
  const span = right - left;
  const slot = span / count;
  const midY = top + (bottom - top - RESISTOR_HEIGHT) / 2;

  // CC-11.3: as with SeriesCircuitDiagram, a current-direction arrow needs
  // a physical justification (task brief §15) -- a battery is now drawn
  // inline on the left rail whenever branch-current arrows are shown.
  // Branch current flows DOWN each branch (top rail to bottom rail), so
  // by loop continuity current flows UP the left rail from the bottom
  // rail to the top rail -- the battery's + terminal therefore sits at
  // the TOP of its own symbol (current exits + and continues up/along to
  // feed the branches from the top rail).
  const midLeftY = (top + bottom) / 2;
  const accessibilityLabel = [
    `Parallel circuit diagram with ${count} branch${count === 1 ? "" : "es"} labelled ${labels.join(", ")}, connected between two shared rails.`,
    showBranchArrows
      ? "A battery is shown on the left rail, and an arrow at the top of each branch shows the current direction, flowing down the branch -- consistent with the battery's own polarity."
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
      {/* Two shared rails all branches connect between. */}
      <Line x1={left} y1={top} x2={right} y2={top} stroke={color.text} strokeWidth={2} />
      <Line x1={left} y1={bottom} x2={right} y2={bottom} stroke={color.text} strokeWidth={2} />
      {showBranchArrows ? (
        <>
          <Line x1={left} y1={top} x2={left} y2={midLeftY - 10} stroke={color.text} strokeWidth={2} />
          <Line x1={left} y1={midLeftY + 10} x2={left} y2={bottom} stroke={color.text} strokeWidth={2} />
          <ParallelBattery x={left} yTop={midLeftY - 10} yBottom={midLeftY + 10} />
        </>
      ) : (
        <Line x1={left} y1={top} x2={left} y2={bottom} stroke={color.text} strokeWidth={2} />
      )}
      <Line x1={right} y1={top} x2={right} y2={bottom} stroke={color.text} strokeWidth={2} />

      {Array.from({ length: count }, (_, i) => {
        const branchX = left + slot * (i + 0.5);
        return (
          <Fragment key={i}>
            <Line x1={branchX} y1={top} x2={branchX} y2={midY} stroke={color.text} strokeWidth={2} />
            <Path d={verticalResistorPath(branchX, midY, RESISTOR_HEIGHT)} stroke={color.accent} strokeWidth={2} fill="none" />
            <Line x1={branchX} y1={midY + RESISTOR_HEIGHT} x2={branchX} y2={bottom} stroke={color.text} strokeWidth={2} />
            <SvgText x={branchX + 14} y={midY + RESISTOR_HEIGHT / 2 + 4} fill={color.text} fontSize={13} fontWeight="700">
              {labels[i]}
            </SvgText>
            {showBranchArrows ? (
              <Polygon points={`${branchX - 5},${top + 10} ${branchX + 5},${top + 10} ${branchX},${top + 20}`} fill={color.accent} />
            ) : null}
          </Fragment>
        );
      })}
    </Svg>
  );
}

/** CC-11.3: mirrors SeriesCircuitDiagram's own SeriesBattery, with polarity flipped to match this diagram's current direction (+ at top -- see this file's header comment for the derivation). */
function ParallelBattery({ x, yTop, yBottom }: { x: number; yTop: number; yBottom: number }) {
  return (
    <>
      <Line x1={x - 9} y1={yTop} x2={x + 9} y2={yTop} stroke={color.text} strokeWidth={1.5} />
      <SvgText x={x + 14} y={yTop + 4} fill={color.text} fontSize={11} fontWeight="700" textAnchor="start">
        +
      </SvgText>
      <Line x1={x - 5} y1={yBottom} x2={x + 5} y2={yBottom} stroke={color.text} strokeWidth={3} />
      <SvgText x={x + 14} y={yBottom + 4} fill={color.text} fontSize={11} fontWeight="700" textAnchor="start">
        -
      </SvgText>
    </>
  );
}
