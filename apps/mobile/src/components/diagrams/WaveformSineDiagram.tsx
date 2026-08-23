/**
 * CC-11: deterministic vector rendering of the `graph.waveform_sine`
 * DiagramInstance -- the second of the three diagram blueprints CC-05D
 * left without a renderer (PROJECT-STATUS.md §CC-05D's explicit, tracked
 * gap).
 *
 * Technical-correctness rules this component enforces structurally (task
 * brief §10 "WAVEFORMS"), not just by convention:
 *  - the zero/reference axis is always drawn, and every other reference
 *    line is positioned relative to it -- there is no way to draw a peak
 *    or RMS line without the zero axis being present;
 *  - the period marker always spans exactly one full cycle horizontally
 *    (`PERIOD_PX`), never an arbitrary or partial span;
 *  - the peak line is measured from the zero axis, never from an
 *    arbitrary offset;
 *  - the RMS line is drawn at exactly `1 / sqrt(2)` of the peak amplitude
 *    (the real RMS-to-peak ratio for a sine wave), with its own distinct
 *    dash pattern and colour so it can never be mistaken for a second
 *    peak line -- it sits strictly between the zero axis and the peak
 *    line, never coincident with either;
 *  - there is deliberately NO "average" reference line anywhere in this
 *    component: the signed full-cycle average of a symmetric AC waveform
 *    is zero, and drawing any non-zero horizontal "average" line would
 *    misrepresent that -- `graph.waveform_sine`'s own governed parameters
 *    (`show_peak_line`/`show_rms_line`/`show_period_marker`) do not
 *    include an average option, and this component does not invent one.
 *
 * Like every other diagram in this folder, no numeric value is ever
 * embedded in the rendered artwork (`valueEmbedding: "values_when_assessed"`
 * on the governed blueprint means numeric peak/RMS/period VALUES belong in
 * the surrounding question/lesson prompt text, never burned into the SVG --
 * exactly the same "R1/R2, never 470Ω" convention SeriesCircuitDiagram.tsx
 * documents for resistor labels, applied here to waveform quantities).
 */
import type { DiagramInstance } from "@alp/calculation-engine";
import { useWindowDimensions } from "react-native";
import Svg, { Line, Path, Text as SvgText } from "react-native-svg";

import { color } from "@/lib/tokens";

export interface WaveformSineDiagramProps {
  readonly diagram: DiagramInstance;
  readonly testID?: string;
}

const HEIGHT = 180;
const MARGIN_LEFT = 20;
const MARGIN_RIGHT = 20;
const AMPLITUDE = 46;
const RMS_RATIO = 1 / Math.SQRT2; // ~0.7071 -- the real RMS/peak ratio for a sine wave, not an arbitrary illustrative fraction.
const SAMPLES_PER_CYCLE = 24;

export function WaveformSineDiagram({ diagram, testID }: WaveformSineDiagramProps): React.JSX.Element {
  const { width: windowWidth } = useWindowDimensions();
  const width = Math.max(280, Math.min(windowWidth - 48, 440));

  const showPeak = diagram.parameters.show_peak_line === true;
  const showRms = diagram.parameters.show_rms_line === true;
  const showPeriod = diagram.parameters.show_period_marker === true;
  const cyclesRaw = Number(diagram.parameters.cycles_shown ?? 2);
  const cycles = Math.min(3, Math.max(1, Number.isFinite(cyclesRaw) ? Math.round(cyclesRaw) : 2));

  const zeroY = HEIGHT / 2;
  const plotLeft = MARGIN_LEFT;
  const plotRight = width - MARGIN_RIGHT;
  const plotWidth = plotRight - plotLeft;
  const periodPx = plotWidth / cycles;

  const peakY = zeroY - AMPLITUDE;
  const troughY = zeroY + AMPLITUDE;
  const rmsY = zeroY - AMPLITUDE * RMS_RATIO;

  const points: string[] = [];
  const totalSamples = SAMPLES_PER_CYCLE * cycles;
  for (let i = 0; i <= totalSamples; i++) {
    const t = i / SAMPLES_PER_CYCLE; // in cycles
    const x = plotLeft + t * periodPx;
    const y = zeroY - AMPLITUDE * Math.sin(2 * Math.PI * t);
    points.push(`${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`);
  }
  const wavePath = points.join(" ");

  const accessibilityLabel = [
    `Sine waveform, ${cycles} cycle${cycles === 1 ? "" : "s"} shown, oscillating symmetrically above and below a zero reference axis.`,
    showPeak ? "A peak reference line marks the maximum height above the zero axis." : "",
    showRms ? "A separate RMS reference line sits between the zero axis and the peak line, at about 71 percent of the peak height." : "",
    showPeriod ? "A period marker spans exactly one full cycle along the time axis." : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Svg width={width} height={HEIGHT} viewBox={`0 0 ${width} ${HEIGHT}`} testID={testID} accessible accessibilityLabel={accessibilityLabel} accessibilityRole="image">
      {/* Zero/reference axis -- every other reference line is measured from this. */}
      <Line x1={plotLeft} y1={zeroY} x2={plotRight} y2={zeroY} stroke={color.textSecondary} strokeWidth={1.5} />
      <SvgText x={plotRight + 2} y={zeroY + 4} fill={color.textSecondary} fontSize={11} textAnchor="start">
        t
      </SvgText>
      <SvgText x={plotLeft - 8} y={zeroY + 4} fill={color.textSecondary} fontSize={11} textAnchor="end">
        0
      </SvgText>

      <Path d={wavePath} stroke={color.accent} strokeWidth={2.5} fill="none" />

      {showPeak ? (
        <>
          <Line x1={plotLeft} y1={peakY} x2={plotRight} y2={peakY} stroke={color.text} strokeWidth={1} strokeDasharray="6,4" />
          <Line x1={plotLeft} y1={troughY} x2={plotRight} y2={troughY} stroke={color.text} strokeWidth={1} strokeDasharray="6,4" />
          <SvgText x={plotRight + 2} y={peakY + 4} fill={color.text} fontSize={10} textAnchor="start">
            peak
          </SvgText>
        </>
      ) : null}

      {showRms ? (
        <Line x1={plotLeft} y1={rmsY} x2={plotRight} y2={rmsY} stroke={color.success} strokeWidth={1.25} strokeDasharray="2,3" />
      ) : null}
      {showRms ? (
        <SvgText x={plotRight + 2} y={rmsY + 4} fill={color.success} fontSize={10} textAnchor="start">
          RMS
        </SvgText>
      ) : null}

      {showPeriod ? <PeriodMarker x1={plotLeft} x2={plotLeft + periodPx} y={HEIGHT - 14} /> : null}
    </Svg>
  );
}

function PeriodMarker({ x1, x2, y }: { x1: number; x2: number; y: number }) {
  const tick = 5;
  return (
    <>
      <Line x1={x1} y1={y} x2={x2} y2={y} stroke={color.textSecondary} strokeWidth={1.25} />
      <Line x1={x1} y1={y - tick} x2={x1} y2={y + tick} stroke={color.textSecondary} strokeWidth={1.25} />
      <Line x1={x2} y1={y - tick} x2={x2} y2={y + tick} stroke={color.textSecondary} strokeWidth={1.25} />
      <SvgText x={(x1 + x2) / 2} y={y - 8} fill={color.textSecondary} fontSize={10} textAnchor="middle">
        T (period)
      </SvgText>
    </>
  );
}
