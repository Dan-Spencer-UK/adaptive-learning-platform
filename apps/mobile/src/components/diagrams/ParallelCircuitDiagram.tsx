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

  const accessibilityLabel = `Parallel circuit diagram with ${count} branch${count === 1 ? "" : "es"} labelled ${labels.join(", ")}, connected between two shared rails.`;

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
      <Line x1={left} y1={top} x2={left} y2={bottom} stroke={color.text} strokeWidth={2} />
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
