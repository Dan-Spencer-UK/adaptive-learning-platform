/**
 * CC-11: deterministic vector rendering of the `circuit.series_parallel_mixed`
 * DiagramInstance -- the third of the three diagram blueprints CC-05D left
 * without a renderer (PROJECT-STATUS.md §CC-05D's explicit, tracked gap).
 * Same conventions as SeriesCircuitDiagram.tsx / ParallelCircuitDiagram.tsx:
 * symbolic R{n} labels only (never numeric values, regardless of
 * `show_values`), rectilinear wiring only (no diagonal "tidy" lines that
 * could misrepresent a node), and the same colour tokens.
 *
 * Two genuinely different, electrically correct topologies:
 *  - "series_of_parallel": one series resistor (R1), then a two-branch
 *    parallel block (R2 alongside R3) reconnecting before the loop
 *    completes -- R1 in series with (R2 parallel R3).
 *  - "parallel_of_series": two parallel branches between shared rails,
 *    each branch itself carrying two resistors in series -- (R1 series R2)
 *    in parallel with (R3 series R4). This reuses ParallelCircuitDiagram's
 *    rails-and-branches shape, with each branch drawn as two resistors
 *    joined by a short node wire instead of one.
 */
import type { DiagramInstance } from "@alp/calculation-engine";
import { Fragment } from "react";
import { useWindowDimensions } from "react-native";
import Svg, { Line, Path, Text as SvgText } from "react-native-svg";

import { color } from "@/lib/tokens";
import { horizontalResistorPath } from "./resistor-path";

export interface SeriesParallelMixedCircuitDiagramProps {
  readonly diagram: DiagramInstance;
  readonly testID?: string;
}

const HEIGHT = 180;
const MARGIN = 26;
const RESISTOR_WIDTH = 42;
const RESISTOR_HEIGHT = 38;

export function SeriesParallelMixedCircuitDiagram({ diagram, testID }: SeriesParallelMixedCircuitDiagramProps): React.JSX.Element {
  const { width: windowWidth } = useWindowDimensions();
  const width = Math.max(300, Math.min(windowWidth - 48, 460));
  const arrangement = diagram.parameters.branch_arrangement === "parallel_of_series" ? "parallel_of_series" : "series_of_parallel";

  return arrangement === "series_of_parallel" ? (
    <SeriesOfParallel width={width} labels={diagram.labels} testID={testID} />
  ) : (
    <ParallelOfSeries width={width} labels={diagram.labels} testID={testID} />
  );
}

function SeriesOfParallel({ width, labels, testID }: { width: number; labels: readonly string[]; testID?: string }) {
  const [r1, r2, r3] = labels.length >= 3 ? labels : ["R1", "R2", "R3"];

  const top = MARGIN + 8;
  const bottom = HEIGHT - MARGIN;
  const left = MARGIN;
  const right = width - MARGIN;

  const r1Start = left + 28;
  const r1End = r1Start + RESISTOR_WIDTH;
  const splitX = r1End + 30;
  const rejoinX = splitX + 110;
  const branchTopY = top - 30;
  const branchBottomY = top + 30;
  const branchResistorStart = splitX + 34;
  const branchResistorEnd = rejoinX - 34;

  const accessibilityLabel = `Mixed circuit: ${r1} connected in series with ${r2} and ${r3}, which are connected in parallel with each other.`;

  return (
    <Svg width={width} height={HEIGHT} viewBox={`0 0 ${width} ${HEIGHT}`} testID={testID} accessible accessibilityLabel={accessibilityLabel} accessibilityRole="image">
      {/* Outer loop: left/right verticals, plain bottom return wire. */}
      <Line x1={left} y1={top} x2={left} y2={bottom} stroke={color.text} strokeWidth={2} />
      <Line x1={right} y1={top} x2={right} y2={bottom} stroke={color.text} strokeWidth={2} />
      <Line x1={left} y1={bottom} x2={right} y2={bottom} stroke={color.text} strokeWidth={2} />

      {/* R1, in series, before the parallel block. */}
      <Line x1={left} y1={top} x2={r1Start} y2={top} stroke={color.text} strokeWidth={2} />
      <Path d={horizontalResistorPath(r1Start, top, RESISTOR_WIDTH)} stroke={color.accent} strokeWidth={2} fill="none" />
      <SvgText x={r1Start + RESISTOR_WIDTH / 2} y={top - 10} fill={color.text} fontSize={13} fontWeight="700" textAnchor="middle">
        {r1}
      </SvgText>
      <Line x1={r1End} y1={top} x2={splitX} y2={top} stroke={color.text} strokeWidth={2} />

      {/* Node A: splits into two parallel branches. */}
      <Line x1={splitX} y1={top} x2={splitX} y2={branchTopY} stroke={color.text} strokeWidth={2} />
      <Line x1={splitX} y1={top} x2={splitX} y2={branchBottomY} stroke={color.text} strokeWidth={2} />

      {/* Upper branch: R2. */}
      <Line x1={splitX} y1={branchTopY} x2={branchResistorStart} y2={branchTopY} stroke={color.text} strokeWidth={2} />
      <Path d={horizontalResistorPath(branchResistorStart, branchTopY, RESISTOR_WIDTH)} stroke={color.accent} strokeWidth={2} fill="none" />
      <Line x1={branchResistorStart + RESISTOR_WIDTH} y1={branchTopY} x2={rejoinX} y2={branchTopY} stroke={color.text} strokeWidth={2} />
      <SvgText x={(branchResistorStart + branchResistorEnd) / 2 + RESISTOR_WIDTH / 2} y={branchTopY - 10} fill={color.text} fontSize={13} fontWeight="700" textAnchor="middle">
        {r2}
      </SvgText>

      {/* Lower branch: R3. */}
      <Line x1={splitX} y1={branchBottomY} x2={branchResistorStart} y2={branchBottomY} stroke={color.text} strokeWidth={2} />
      <Path d={horizontalResistorPath(branchResistorStart, branchBottomY, RESISTOR_WIDTH)} stroke={color.accent} strokeWidth={2} fill="none" />
      <Line x1={branchResistorStart + RESISTOR_WIDTH} y1={branchBottomY} x2={rejoinX} y2={branchBottomY} stroke={color.text} strokeWidth={2} />
      <SvgText x={(branchResistorStart + branchResistorEnd) / 2 + RESISTOR_WIDTH / 2} y={branchBottomY + 20} fill={color.text} fontSize={13} fontWeight="700" textAnchor="middle">
        {r3}
      </SvgText>

      {/* Node B: branches rejoin. */}
      <Line x1={rejoinX} y1={branchTopY} x2={rejoinX} y2={top} stroke={color.text} strokeWidth={2} />
      <Line x1={rejoinX} y1={branchBottomY} x2={rejoinX} y2={top} stroke={color.text} strokeWidth={2} />
      <Line x1={rejoinX} y1={top} x2={right} y2={top} stroke={color.text} strokeWidth={2} />
    </Svg>
  );
}

function ParallelOfSeries({ width, labels, testID }: { width: number; labels: readonly string[]; testID?: string }) {
  const fallback = ["R1", "R2", "R3", "R4"];
  const r1 = labels[0] ?? fallback[0]!;
  const r2 = labels[1] ?? fallback[1]!;
  const r3 = labels[2] ?? fallback[2]!;
  const r4 = labels[3] ?? fallback[3]!;

  const top = MARGIN;
  const bottom = HEIGHT - MARGIN;
  const left = MARGIN;
  const right = width - MARGIN;
  const branchTopY = top + (bottom - top) * 0.32;
  const branchBottomY = top + (bottom - top) * 0.68;

  const branchSpan = right - left;
  const midX = left + branchSpan / 2;
  const r1Start = left + branchSpan * 0.18;
  const r2Start = midX + branchSpan * 0.04;

  const accessibilityLabel = `Mixed circuit: two parallel branches between shared rails. One branch has ${r1} in series with ${r2}; the other branch has ${r3} in series with ${r4}.`;

  return (
    <Svg width={width} height={HEIGHT} viewBox={`0 0 ${width} ${HEIGHT}`} testID={testID} accessible accessibilityLabel={accessibilityLabel} accessibilityRole="image">
      {/* Shared rails. */}
      <Line x1={left} y1={top} x2={left} y2={bottom} stroke={color.text} strokeWidth={2} />
      <Line x1={right} y1={top} x2={right} y2={bottom} stroke={color.text} strokeWidth={2} />

      {SeriesBranch({ y: branchTopY, left, right, r1Start, r2Start, labelA: r1, labelB: r2 })}
      {SeriesBranch({ y: branchBottomY, left, right, r1Start, r2Start, labelA: r3, labelB: r4 })}
    </Svg>
  );
}

function SeriesBranch({
  y,
  left,
  right,
  r1Start,
  r2Start,
  labelA,
  labelB,
}: {
  y: number;
  left: number;
  right: number;
  r1Start: number;
  r2Start: number;
  labelA: string;
  labelB: string;
}) {
  const r1End = r1Start + RESISTOR_HEIGHT;
  const r2End = r2Start + RESISTOR_HEIGHT;
  return (
    <Fragment>
      <Line x1={left} y1={y} x2={r1Start} y2={y} stroke={color.text} strokeWidth={2} />
      <Path d={horizontalResistorPath(r1Start, y, RESISTOR_HEIGHT)} stroke={color.accent} strokeWidth={2} fill="none" />
      <SvgText x={r1Start + RESISTOR_HEIGHT / 2} y={y - 10} fill={color.text} fontSize={13} fontWeight="700" textAnchor="middle">
        {labelA}
      </SvgText>
      <Line x1={r1End} y1={y} x2={r2Start} y2={y} stroke={color.text} strokeWidth={2} />
      <Path d={horizontalResistorPath(r2Start, y, RESISTOR_HEIGHT)} stroke={color.accent} strokeWidth={2} fill="none" />
      <SvgText x={r2Start + RESISTOR_HEIGHT / 2} y={y - 10} fill={color.text} fontSize={13} fontWeight="700" textAnchor="middle">
        {labelB}
      </SvgText>
      <Line x1={r2End} y1={y} x2={right} y2={y} stroke={color.text} strokeWidth={2} />
    </Fragment>
  );
}
