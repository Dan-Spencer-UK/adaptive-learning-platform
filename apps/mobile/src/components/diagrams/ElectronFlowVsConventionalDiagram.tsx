/**
 * CC-11.11: deterministic vector rendering of a single wire showing BOTH
 * conventional current direction and actual electron-flow direction,
 * mirroring `unit202.current-direction.electron-flow-vs-conventional`'s
 * catalogue immutableFacts:
 *  - conventional current: positive terminal to negative terminal;
 *  - electron flow: negative terminal to positive terminal -- always the
 *    OPPOSITE direction to conventional current, never the same;
 *  - both arrows on the same single wire/conductor, never on separate
 *    wires -- this component structurally cannot draw two wires.
 *
 * Single canonical state (no parameters vary this diagram); governed
 * `needOverride: "USEFUL"` (not REQUIRED) in the visual-production
 * catalogue, but resolved here anyway so no canonical state in the Unit
 * 202 catalogue is left without a real, working visual pathway. Not yet
 * wired to any lesson step's `representation.diagramBlueprintId`
 * (content-layer integration work, out of this visual-completeness pass's
 * scope).
 */
import type { DiagramInstance } from "@alp/calculation-engine";
import { useWindowDimensions } from "react-native";
import Svg, { Line, Path, Text as SvgText } from "react-native-svg";

import { color } from "@/lib/tokens";

export interface ElectronFlowVsConventionalDiagramProps {
  readonly diagram: DiagramInstance;
  readonly testID?: string;
}

const HEIGHT = 140;
const MARGIN = 24;
const ARROWHEAD = 8;

function arrowPath(xStart: number, xEnd: number, y: number): string {
  // A horizontal line with an arrowhead at the (xEnd) end, pointing in the line's own direction.
  const dir = xEnd >= xStart ? 1 : -1;
  const headBaseX = xEnd - dir * ARROWHEAD;
  return [
    `M${xStart.toFixed(1)},${y} L${xEnd.toFixed(1)},${y}`,
    `M${headBaseX.toFixed(1)},${(y - ARROWHEAD * 0.6).toFixed(1)} L${xEnd.toFixed(1)},${y} L${headBaseX.toFixed(1)},${(y + ARROWHEAD * 0.6).toFixed(1)}`,
  ].join(" ");
}

export function ElectronFlowVsConventionalDiagram({ testID }: ElectronFlowVsConventionalDiagramProps): React.JSX.Element {
  const { width: windowWidth } = useWindowDimensions();
  const width = Math.max(280, Math.min(windowWidth - 48, 440));

  const wireY = HEIGHT / 2;
  const left = MARGIN;
  const right = width - MARGIN;

  // Conventional current: left (+) to right (-) -- drawn above the wire.
  const conventionalY = wireY - 22;
  // Electron flow: right (-) to left (+) -- always opposite -- drawn below the wire.
  const electronY = wireY + 22;

  return (
    <Svg
      width={width}
      height={HEIGHT}
      viewBox={`0 0 ${width} ${HEIGHT}`}
      testID={testID}
      accessible
      accessibilityLabel="A single conductor with two labelled arrows: conventional current flowing from positive to negative, and actual electron flow, on the same wire, flowing in the opposite direction from negative to positive."
      accessibilityRole="image"
    >
      {/* The single conductor. */}
      <Line x1={left} y1={wireY} x2={right} y2={wireY} stroke={color.text} strokeWidth={3} />
      <SvgText x={left - 4} y={wireY - 8} fill={color.textSecondary} fontSize={11} textAnchor="start">
        +
      </SvgText>
      <SvgText x={right - 4} y={wireY - 8} fill={color.textSecondary} fontSize={11} textAnchor="end">
        -
      </SvgText>

      {/* Conventional current: + to -, i.e. left to right. */}
      <Path d={arrowPath(left, right, conventionalY)} stroke={color.accent} strokeWidth={2} fill="none" />
      <SvgText x={(left + right) / 2} y={conventionalY - 8} fill={color.accent} fontSize={11} textAnchor="middle">
        CONVENTIONAL CURRENT (+ to -)
      </SvgText>

      {/* Electron flow: - to +, i.e. right to left -- always the opposite arrow direction. */}
      <Path d={arrowPath(right, left, electronY)} stroke={color.danger} strokeWidth={2} fill="none" />
      <SvgText x={(left + right) / 2} y={electronY + 18} fill={color.danger} fontSize={11} textAnchor="middle">
        ELECTRON FLOW (- to +)
      </SvgText>
    </Svg>
  );
}
