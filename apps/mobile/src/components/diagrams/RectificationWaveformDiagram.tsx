/**
 * CC-11.11: deterministic vector rendering of a rectifier/inverter output
 * waveform SHAPE -- distinct from `graph.waveform_sine` (a plain sine wave)
 * and from `electronics.component_symbol_card`'s rectifier/inverter entries
 * (which render only the functional-block symbol, never the resulting
 * waveform shape). Governed facts this component enforces structurally,
 * mirroring `unit202.rectification.waveforms`'s catalogue immutableFacts:
 *  - half-wave: one half-cycle is blocked entirely (flat at the zero axis),
 *    the other half-cycle passes unchanged in shape;
 *  - full-wave: both half-cycles are converted to the SAME polarity
 *    (pulsating DC -- a series of same-sign humps), never a flat line;
 *  - inverter: a DC input synthesised into an AC-shaped output via
 *    switching, drawn as a stepped/quasi-square wave -- never a smooth
 *    sine (that would misrepresent switched synthesis as a plain sine,
 *    which is a distinct, ungoverned claim).
 *
 * Not yet wired to any lesson step's `representation.diagramBlueprintId`
 * (that is content-layer integration work, out of this visual-completeness
 * pass's scope) -- this component makes the deterministic pathway real and
 * production-ready so the LESSON / ACTIVITY INTEGRATION workstream can wire
 * it in without needing new artwork.
 */
import type { DiagramInstance } from "@alp/calculation-engine";
import { useWindowDimensions } from "react-native";
import Svg, { Line, Path, Text as SvgText } from "react-native-svg";

import { color } from "@/lib/tokens";

export interface RectificationWaveformDiagramProps {
  readonly diagram: DiagramInstance;
  readonly testID?: string;
}

const HEIGHT = 160;
const MARGIN_LEFT = 20;
const MARGIN_RIGHT = 20;
const AMPLITUDE = 44;
const CYCLES = 2;
const SAMPLES_PER_HALF_CYCLE = 12;

type WaveformShape = "half_wave" | "full_wave" | "inverter";

function isWaveformShape(value: unknown): value is WaveformShape {
  return value === "half_wave" || value === "full_wave" || value === "inverter";
}

/** Builds the path for the half-wave and full-wave shapes -- a sequence of half-cycle sine bumps, some possibly flattened to zero. */
function buildSineBasedPath(plotLeft: number, halfPeriodPx: number, zeroY: number, totalHalfCycles: number, blockNegativeHalves: boolean): string {
  const points: string[] = [];
  for (let half = 0; half < totalHalfCycles; half++) {
    const isPositiveHalf = half % 2 === 0;
    const blocked = blockNegativeHalves && !isPositiveHalf;
    for (let s = 0; s <= SAMPLES_PER_HALF_CYCLE; s++) {
      const tWithinHalf = s / SAMPLES_PER_HALF_CYCLE;
      const x = plotLeft + half * halfPeriodPx + tWithinHalf * halfPeriodPx;
      const y = blocked ? zeroY : zeroY - AMPLITUDE * Math.sin(Math.PI * tWithinHalf);
      points.push(`${half === 0 && s === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`);
    }
  }
  return points.join(" ");
}

/** Builds the path for the inverter's stepped quasi-square wave -- flat top, flat bottom, vertical risers at each half-cycle boundary. */
function buildSquarePath(plotLeft: number, halfPeriodPx: number, zeroY: number, totalHalfCycles: number): string {
  const points: string[] = [];
  for (let half = 0; half < totalHalfCycles; half++) {
    const isPositiveHalf = half % 2 === 0;
    const y = isPositiveHalf ? zeroY - AMPLITUDE : zeroY + AMPLITUDE;
    const xStart = plotLeft + half * halfPeriodPx;
    const xEnd = xStart + halfPeriodPx;
    points.push(`${half === 0 ? "M" : "L"}${xStart.toFixed(1)},${y.toFixed(1)}`);
    points.push(`L${xEnd.toFixed(1)},${y.toFixed(1)}`);
  }
  return points.join(" ");
}

export function RectificationWaveformDiagram({ diagram, testID }: RectificationWaveformDiagramProps): React.JSX.Element {
  const { width: windowWidth } = useWindowDimensions();
  const width = Math.max(280, Math.min(windowWidth - 48, 440));

  const shapeParam = diagram.parameters.waveform_shape;
  const shape: WaveformShape = isWaveformShape(shapeParam) ? shapeParam : "half_wave";

  const zeroY = HEIGHT / 2;
  const plotLeft = MARGIN_LEFT;
  const plotRight = width - MARGIN_RIGHT;
  const plotWidth = plotRight - plotLeft;
  const periodPx = plotWidth / CYCLES;
  const halfPeriodPx = periodPx / 2;
  const totalHalfCycles = CYCLES * 2;

  const wavePath =
    shape === "half_wave"
      ? buildSineBasedPath(plotLeft, halfPeriodPx, zeroY, totalHalfCycles, true)
      : shape === "full_wave"
        ? buildSineBasedPath(plotLeft, halfPeriodPx, zeroY, totalHalfCycles, false)
        : buildSquarePath(plotLeft, halfPeriodPx, zeroY, totalHalfCycles);

  const shapeDescription =
    shape === "half_wave"
      ? "Half-wave rectified output: alternate half-cycles are blocked entirely, flat at the zero axis, while the other half-cycles pass as unchanged sine-shaped bumps."
      : shape === "full_wave"
        ? "Full-wave rectified output: every half-cycle is converted to the same polarity, producing a continuous series of same-sign bumps -- pulsating DC, never a flat line."
        : "Inverter-synthesised AC output: a stepped, quasi-square waveform produced by switching a DC input, never a smooth sine wave.";

  return (
    <Svg width={width} height={HEIGHT} viewBox={`0 0 ${width} ${HEIGHT}`} testID={testID} accessible accessibilityLabel={shapeDescription} accessibilityRole="image">
      <Line x1={plotLeft} y1={zeroY} x2={plotRight} y2={zeroY} stroke={color.textSecondary} strokeWidth={1.5} />
      <SvgText x={plotRight + 2} y={zeroY + 4} fill={color.textSecondary} fontSize={11} textAnchor="start">
        t
      </SvgText>
      <SvgText x={plotLeft - 8} y={zeroY + 4} fill={color.textSecondary} fontSize={11} textAnchor="end">
        0
      </SvgText>
      <Path d={wavePath} stroke={color.accent} strokeWidth={2.5} fill="none" />
    </Svg>
  );
}
