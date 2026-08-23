/**
 * CC-11.3 (Unit 202 instructional visual coverage & correction gate): deterministic vector
 * rendering of a `mechanical.resistivity_dimensions` `DiagramInstance` --
 * governed scope: the qualitative length/area factors in R = rho L / A
 * (EL-RESISTIVITY-LENGTH-EFFECT-001, EL-RESISTIVITY-AREA-EFFECT-001) --
 * longer conductor -> more resistance, larger cross-sectional area ->
 * less resistance, all else equal. This diagram never performs or embeds
 * a numeric R = rho L / A calculation (a separate formula family/blueprint
 * handles that elsewhere) -- captions are symbolic only, per this
 * course's `symbolic_only` valueEmbedding convention.
 *
 * (Placed alongside the other new mechanical-domain diagrams for this
 * package's delivery; the diagram itself belongs to the
 * `electrical.resistivity` assertion family, not the mechanical one --
 * see this component's own DiagramBlueprint entry in the integration
 * spec, type "mechanical" per the governed diagramType enum, which is a
 * spatial/graphical category, not an assertion-family grouping.)
 */
import type { DiagramInstance } from "@alp/calculation-engine";
import Svg, { Ellipse, Line, Rect, Text as SvgText } from "react-native-svg";

import { color } from "@/lib/tokens";

export interface ResistivityDimensionsDiagramProps {
  readonly diagram: DiagramInstance;
  readonly testID?: string;
}

type Comparison = "length" | "area";

const WIDTH = 260;
const HEIGHT = 200;
const ROD_A_Y = 50;
const ROD_B_Y = 130;
const ROD_LEFT_X = 40;
const CAP_RADIUS_X = 6;

export function ResistivityDimensionsDiagram({ diagram, testID }: ResistivityDimensionsDiagramProps): React.JSX.Element {
  const comparison: Comparison = diagram.parameters.comparison === "area" ? "area" : "length";

  const accessibilityLabel =
    comparison === "length"
      ? "Comparing conductor length, with cross-sectional area and material held the same: the shorter rod has less resistance, and the longer rod has more resistance."
      : "Comparing conductor cross-sectional area, with length and material held the same: the thinner rod has more resistance, and the thicker rod has less resistance.";

  return (
    <Svg width={WIDTH} height={HEIGHT} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} testID={testID} accessible accessibilityLabel={accessibilityLabel} accessibilityRole="image">
      {comparison === "length" ? (
        <>
          <Rod x={ROD_LEFT_X} y={ROD_A_Y} length={70} thickness={22} showLengthBracket caption="shorter -> less resistance" />
          <Rod x={ROD_LEFT_X} y={ROD_B_Y} length={170} thickness={22} showLengthBracket caption="longer -> more resistance" />
        </>
      ) : (
        <>
          <Rod x={ROD_LEFT_X} y={ROD_A_Y} length={150} thickness={12} showAreaIndicator caption="thinner -> more resistance" />
          <Rod x={ROD_LEFT_X} y={ROD_B_Y} length={150} thickness={34} showAreaIndicator caption="thicker -> less resistance" />
        </>
      )}
    </Svg>
  );
}

function Rod({
  x,
  y,
  length,
  thickness,
  caption,
  showLengthBracket = false,
  showAreaIndicator = false,
}: {
  x: number;
  y: number;
  length: number;
  thickness: number;
  caption: string;
  showLengthBracket?: boolean;
  showAreaIndicator?: boolean;
}) {
  const bodyLeft = x + CAP_RADIUS_X;
  const bodyRight = x + length - CAP_RADIUS_X;
  const halfThickness = thickness / 2;
  const bracketY = y + halfThickness + 14;

  return (
    <>
      {/* Rod body -- a simple cylinder schematic: a rectangle body with an end-cap ellipse (the conductor's cross-section). */}
      <Rect x={bodyLeft} y={y - halfThickness} width={bodyRight - bodyLeft} height={thickness} fill={color.background} stroke={color.text} strokeWidth={2} />
      <Ellipse cx={x + length - CAP_RADIUS_X} cy={y} rx={CAP_RADIUS_X} ry={halfThickness} fill={color.background} stroke={color.text} strokeWidth={2} />
      <Ellipse cx={bodyLeft} cy={y} rx={CAP_RADIUS_X} ry={halfThickness} fill={color.background} stroke={color.text} strokeWidth={2} />

      {showLengthBracket ? (
        <>
          <Line x1={x} y1={bracketY} x2={x + length} y2={bracketY} stroke={color.textSecondary} strokeWidth={1.5} />
          <Line x1={x} y1={bracketY - 5} x2={x} y2={bracketY + 5} stroke={color.textSecondary} strokeWidth={1.5} />
          <Line x1={x + length} y1={bracketY - 5} x2={x + length} y2={bracketY + 5} stroke={color.textSecondary} strokeWidth={1.5} />
          <SvgText x={x + length / 2} y={bracketY - 8} fill={color.textSecondary} fontSize={12} fontWeight="700" textAnchor="middle">
            L
          </SvgText>
        </>
      ) : null}

      {showAreaIndicator ? (
        <>
          <Line x1={bodyLeft - 14} y1={y - halfThickness} x2={bodyLeft - 14} y2={y + halfThickness} stroke={color.textSecondary} strokeWidth={1.5} />
          <SvgText x={bodyLeft - 24} y={y + 4} fill={color.textSecondary} fontSize={12} fontWeight="700" textAnchor="middle">
            A
          </SvgText>
        </>
      ) : null}

      <SvgText x={x + length / 2} y={y - halfThickness - 10} fill={color.text} fontSize={11} textAnchor="middle">
        {caption}
      </SvgText>
    </>
  );
}
