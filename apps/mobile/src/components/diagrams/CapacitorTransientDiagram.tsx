/**
 * CC-11.11: deterministic vector rendering of an RC capacitor charge/
 * discharge transient curve -- distinct from `graph.waveform_sine` (a
 * periodic waveform; this is a one-shot transient response, never
 * repeating). Governed facts this component enforces structurally,
 * mirroring `unit202.capacitor.transient`'s catalogue immutableFacts:
 *  - charge: a genuine exponential RISE from 0 toward the asymptotic
 *    maximum, never a straight-line ramp or an instant step;
 *  - discharge: a genuine exponential DECAY from the maximum toward 0,
 *    never a straight-line ramp or an instant step;
 *  - the curve never touches its asymptote (true exponential behaviour).
 *
 * Not yet wired to any lesson step's `representation.diagramBlueprintId`
 * (content-layer integration work, out of this visual-completeness pass's
 * scope) -- this component makes the deterministic pathway real and
 * production-ready so the LESSON / ACTIVITY INTEGRATION workstream can wire
 * it in without needing new artwork.
 */
import type { DiagramInstance } from "@alp/calculation-engine";
import { useWindowDimensions } from "react-native";
import Svg, { Line, Path, Text as SvgText } from "react-native-svg";

import { color } from "@/lib/tokens";

export interface CapacitorTransientDiagramProps {
  readonly diagram: DiagramInstance;
  readonly testID?: string;
}

const HEIGHT = 160;
const MARGIN_LEFT = 20;
const MARGIN_RIGHT = 20;
const MARGIN_TOP = 16;
const MARGIN_BOTTOM = 24;
const SAMPLES = 40;
const TIME_CONSTANTS_SHOWN = 5; // 5*tau is visually indistinguishable from the asymptote -- standard convention.

type TransientMode = "charge" | "discharge";

function isTransientMode(value: unknown): value is TransientMode {
  return value === "charge" || value === "discharge";
}

export function CapacitorTransientDiagram({ diagram, testID }: CapacitorTransientDiagramProps): React.JSX.Element {
  const { width: windowWidth } = useWindowDimensions();
  const width = Math.max(280, Math.min(windowWidth - 48, 440));

  const modeParam = diagram.parameters.transient_mode;
  const mode: TransientMode = isTransientMode(modeParam) ? modeParam : "charge";

  const plotLeft = MARGIN_LEFT;
  const plotRight = width - MARGIN_RIGHT;
  const plotWidth = plotRight - plotLeft;
  const maxY = HEIGHT - MARGIN_BOTTOM; // baseline (0 level)
  const minY = MARGIN_TOP; // asymptotic max level

  const points: string[] = [];
  for (let i = 0; i <= SAMPLES; i++) {
    const tNorm = i / SAMPLES; // 0..1 across the plotted window
    const tTau = tNorm * TIME_CONSTANTS_SHOWN;
    // charge: fraction = 1 - e^-t/tau (rises from 0 to 1); discharge: fraction = e^-t/tau (decays from 1 to 0).
    const fraction = mode === "charge" ? 1 - Math.exp(-tTau) : Math.exp(-tTau);
    const x = plotLeft + tNorm * plotWidth;
    const y = maxY - fraction * (maxY - minY);
    points.push(`${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`);
  }
  const curvePath = points.join(" ");

  const asymptoteY = mode === "charge" ? minY : maxY;
  const description =
    mode === "charge"
      ? "Capacitor charge curve: a genuine exponential rise from zero, approaching but never reaching the maximum level."
      : "Capacitor discharge curve: a genuine exponential decay from the maximum level, approaching but never reaching zero.";

  return (
    <Svg width={width} height={HEIGHT} viewBox={`0 0 ${width} ${HEIGHT}`} testID={testID} accessible accessibilityLabel={description} accessibilityRole="image">
      {/* time axis (0 level) */}
      <Line x1={plotLeft} y1={maxY} x2={plotRight} y2={maxY} stroke={color.textSecondary} strokeWidth={1.5} />
      <SvgText x={plotRight + 2} y={maxY + 4} fill={color.textSecondary} fontSize={11} textAnchor="start">
        t
      </SvgText>
      <SvgText x={plotLeft - 8} y={maxY + 4} fill={color.textSecondary} fontSize={11} textAnchor="end">
        0
      </SvgText>
      {/* dashed asymptote reference -- the curve approaches but never touches this line */}
      <Line x1={plotLeft} y1={asymptoteY} x2={plotRight} y2={asymptoteY} stroke={color.text} strokeWidth={1} strokeDasharray="6,4" />
      <Path d={curvePath} stroke={color.accent} strokeWidth={2.5} fill="none" />
    </Svg>
  );
}
