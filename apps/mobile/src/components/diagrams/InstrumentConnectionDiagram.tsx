/**
 * CC-11: deterministic vector rendering of the `instrument.measurement_connection`
 * DiagramInstance -- the last of the three diagram blueprints CC-05D left
 * without a renderer (PROJECT-STATUS.md §CC-05D's explicit, tracked gap).
 *
 * Technical-correctness rules this component enforces structurally (task
 * brief §10 "INSTRUMENTS"):
 *  - a voltmeter is drawn as a side branch across the component under
 *    test (parallel connection) -- the main current path is never broken
 *    to insert it;
 *  - an ammeter is drawn spliced directly into the main current path
 *    (series connection) -- it is never drawn as a side branch;
 *  - an ohmmeter is drawn across an ISOLATED component with no source in
 *    the circuit at all (de-energised context), never superimposed on a
 *    live loop -- using an ohmmeter on an energised circuit is unsafe and
 *    incorrect practice, so this component structurally cannot depict
 *    that combination regardless of the `connection_style` parameter
 *    supplied.
 *
 * `connection_style` is still a genuine, honoured parameter for
 * voltmeter/ammeter (a caller may legitimately request either) -- a
 * deliberate non-standard combination (voltmeter-in-series, ammeter-in-
 * parallel) remains a legitimate TEACHING comparison example (task brief
 * §11.A/§11.B: "incorrect configurations may remain as teaching
 * comparison examples; they must not leak the answer in assessment
 * state").
 *
 * CC-11.3 mode correction: `mode` now genuinely gates the standard/non-
 * standard caption, which previously rendered unconditionally regardless
 * of context (an answer-leakage risk the moment this diagram is ever
 * wired into `instrumentation.recognise_connection`'s own assessment
 * presentation, whose answer options are literally "series"/"parallel" --
 * see this file's own git history / PROJECT-STATUS.md §CC-11.3 for the
 * finding). TEACHING (default) and "both" show the caption, exactly as
 * before; ASSESSMENT withholds it -- the learner must judge the
 * connection from the drawn topology alone, matching the answer-reveal
 * pattern every other diagram in this folder already uses (compare
 * `MagneticForceDiagram`'s `forceDirection` prop).
 */
import type { DiagramInstance } from "@alp/calculation-engine";
import { Fragment } from "react";
import { useWindowDimensions } from "react-native";
import Svg, { Circle, Line, Path, Text as SvgText } from "react-native-svg";

import { color } from "@/lib/tokens";
import { horizontalResistorPath } from "./resistor-path";

export interface InstrumentConnectionDiagramProps {
  readonly diagram: DiagramInstance;
  /** Whether the standard/non-standard caption (the assessed answer for `instrumentation.recognise_connection`) is shown. Defaults to "teaching" -- callers driving an assessment presentation must pass "assessment" explicitly. */
  readonly mode?: "teaching" | "assessment" | "both";
  readonly testID?: string;
}

type InstrumentType = "voltmeter" | "ammeter" | "ohmmeter";
type ConnectionStyle = "series" | "parallel";

const SYMBOL: Readonly<Record<InstrumentType, string>> = { voltmeter: "V", ammeter: "A", ohmmeter: "Ω" };
const CANONICAL_CONNECTION: Readonly<Record<InstrumentType, ConnectionStyle | null>> = {
  voltmeter: "parallel",
  ammeter: "series",
  ohmmeter: null, // ohmmeter measurement is never meaningfully "in series" or "in parallel" in a live loop -- it always connects across an isolated component.
};

const HEIGHT = 170;
const MARGIN = 26;
const RESISTOR_WIDTH = 44;

export function InstrumentConnectionDiagram({ diagram, mode = "teaching", testID }: InstrumentConnectionDiagramProps): React.JSX.Element {
  const { width: windowWidth } = useWindowDimensions();
  const width = Math.max(280, Math.min(windowWidth - 48, 420));

  const instrumentType: InstrumentType =
    diagram.parameters.instrument_type === "ammeter" || diagram.parameters.instrument_type === "ohmmeter" ? diagram.parameters.instrument_type : "voltmeter";
  const requestedStyle: ConnectionStyle = diagram.parameters.connection_style === "series" ? "series" : "parallel";
  const showCaption = mode !== "assessment";

  const top = MARGIN + 6;
  const bottom = HEIGHT - MARGIN;
  const left = MARGIN;
  const right = width - MARGIN;
  const componentStart = left + (right - left) / 2 - RESISTOR_WIDTH / 2;
  const componentEnd = componentStart + RESISTOR_WIDTH;

  if (instrumentType === "ohmmeter") {
    return (
      <OhmmeterDiagram width={width} left={left} right={right} top={top} bottom={bottom} componentStart={componentStart} componentEnd={componentEnd} testID={testID} />
    );
  }

  const canonical = CANONICAL_CONNECTION[instrumentType];
  const isCanonical = requestedStyle === canonical;
  const captionText = isCanonical ? "(standard connection)" : "(NOT the standard connection -- for illustration only)";

  const accessibilityLabel = [
    `${instrumentType === "voltmeter" ? "Voltmeter" : "Ammeter"} connected in ${requestedStyle} with the component under test.`,
    showCaption
      ? isCanonical
        ? `This is the standard, correct way to connect ${instrumentType === "voltmeter" ? "a voltmeter (in parallel, across the component)" : "an ammeter (in series, in the current path)"}.`
        : `This connection does not match the standard, correct method for a ${instrumentType}.`
      : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Svg width={width} height={HEIGHT} viewBox={`0 0 ${width} ${HEIGHT}`} testID={testID} accessible accessibilityLabel={accessibilityLabel} accessibilityRole="image">
      {/* Source + component loop. */}
      <BatterySymbol x={left} yTop={top} yBottom={bottom} />
      <Line x1={left} y1={top} x2={left + 14} y2={top} stroke={color.text} strokeWidth={2} />
      <Line x1={left + 14} y1={top} x2={componentStart} y2={top} stroke={color.text} strokeWidth={2} />
      <Path d={horizontalResistorPath(componentStart, top, RESISTOR_WIDTH)} stroke={color.accent} strokeWidth={2} fill="none" />
      <SvgText x={(componentStart + componentEnd) / 2} y={top - 10} fill={color.text} fontSize={12} fontWeight="700" textAnchor="middle">
        Component
      </SvgText>

      {requestedStyle === "series" ? (
        <SeriesInstrument componentEnd={componentEnd} right={right} top={top} bottom={bottom} left={left} type={instrumentType} />
      ) : (
        <ParallelInstrument componentStart={componentStart} componentEnd={componentEnd} top={top} right={right} left={left} bottom={bottom} type={instrumentType} />
      )}

      {showCaption ? (
        <SvgText x={width / 2} y={HEIGHT - 6} fill={isCanonical ? color.textSecondary : color.danger} fontSize={10} textAnchor="middle">
          {captionText}
        </SvgText>
      ) : null}
    </Svg>
  );
}

function SeriesInstrument({
  componentEnd,
  right,
  top,
  bottom,
  left,
  type,
}: {
  componentEnd: number;
  right: number;
  top: number;
  bottom: number;
  left: number;
  type: InstrumentType;
}) {
  const meterX = (componentEnd + right) / 2;
  return (
    <Fragment>
      <Line x1={componentEnd} y1={top} x2={meterX - 16} y2={top} stroke={color.text} strokeWidth={2} />
      <MeterCircle cx={meterX} cy={top} label={SYMBOL[type]} />
      <Line x1={meterX + 16} y1={top} x2={right} y2={top} stroke={color.text} strokeWidth={2} />
      <Line x1={right} y1={top} x2={right} y2={bottom} stroke={color.text} strokeWidth={2} />
      <Line x1={right} y1={bottom} x2={left} y2={bottom} stroke={color.text} strokeWidth={2} />
    </Fragment>
  );
}

function ParallelInstrument({
  componentStart,
  componentEnd,
  top,
  right,
  left,
  bottom,
  type,
}: {
  componentStart: number;
  componentEnd: number;
  top: number;
  right: number;
  left: number;
  bottom: number;
  type: InstrumentType;
}) {
  const branchY = top + 46;
  const meterX = (componentStart + componentEnd) / 2;
  return (
    <Fragment>
      {/* Main current path continues unbroken through the component. */}
      <Line x1={componentEnd} y1={top} x2={right} y2={top} stroke={color.text} strokeWidth={2} />
      <Line x1={right} y1={top} x2={right} y2={bottom} stroke={color.text} strokeWidth={2} />
      <Line x1={right} y1={bottom} x2={left} y2={bottom} stroke={color.text} strokeWidth={2} />

      {/* Side branch, tapped from both terminals of the component, carrying the meter -- never in the main path. */}
      <Line x1={componentStart} y1={top} x2={componentStart} y2={branchY} stroke={color.textSecondary} strokeWidth={1.5} />
      <Line x1={componentEnd} y1={top} x2={componentEnd} y2={branchY} stroke={color.textSecondary} strokeWidth={1.5} />
      <Line x1={componentStart} y1={branchY} x2={meterX - 16} y2={branchY} stroke={color.textSecondary} strokeWidth={1.5} />
      <MeterCircle cx={meterX} cy={branchY} label={SYMBOL[type]} />
      <Line x1={meterX + 16} y1={branchY} x2={componentEnd} y2={branchY} stroke={color.textSecondary} strokeWidth={1.5} />
    </Fragment>
  );
}

function OhmmeterDiagram({
  width,
  left,
  right,
  top,
  bottom,
  componentStart,
  componentEnd,
  testID,
}: {
  width: number;
  left: number;
  right: number;
  top: number;
  bottom: number;
  componentStart: number;
  componentEnd: number;
  testID?: string;
}) {
  const meterY = top + 46;
  const meterX = (componentStart + componentEnd) / 2;
  // CC-11.3: matches EL-INSTRUMENT-OHMMETER-001's exact governed wording --
  // an ohmmeter must never be connected to an energised circuit; isolating
  // the individual component (disconnecting other parallel paths) may be
  // needed for an ACCURATE reading of that one component, not because
  // isolation is universally required for resistance measurement itself.
  // The pre-CC-11.3 wording overstated this as an unconditional rule.
  const accessibilityLabel =
    "Ohmmeter connected across an isolated component. An ohmmeter must never be connected to an energised circuit; other circuit paths may need to be disconnected first to measure this component's resistance accurately.";
  return (
    <Svg width={width} height={HEIGHT} viewBox={`0 0 ${width} ${HEIGHT}`} testID={testID} accessible accessibilityLabel={accessibilityLabel} accessibilityRole="image">
      <Path d={horizontalResistorPath(componentStart, top, RESISTOR_WIDTH)} stroke={color.accent} strokeWidth={2} fill="none" />
      <SvgText x={(componentStart + componentEnd) / 2} y={top - 10} fill={color.text} fontSize={12} fontWeight="700" textAnchor="middle">
        Component
      </SvgText>

      <Line x1={componentStart} y1={top} x2={componentStart} y2={meterY} stroke={color.textSecondary} strokeWidth={1.5} />
      <Line x1={componentEnd} y1={top} x2={componentEnd} y2={meterY} stroke={color.textSecondary} strokeWidth={1.5} />
      <Line x1={componentStart} y1={meterY} x2={meterX - 16} y2={meterY} stroke={color.textSecondary} strokeWidth={1.5} />
      <MeterCircle cx={meterX} cy={meterY} label={SYMBOL.ohmmeter} />
      <Line x1={meterX + 16} y1={meterY} x2={componentEnd} y2={meterY} stroke={color.textSecondary} strokeWidth={1.5} />

      <SvgText x={width / 2} y={bottom + 10} fill={color.danger} fontSize={10} textAnchor="middle">
        no source connected -- circuit isolated / de-energised
      </SvgText>
    </Svg>
  );
}

function MeterCircle({ cx, cy, label }: { cx: number; cy: number; label: string }) {
  return (
    <>
      <Circle cx={cx} cy={cy} r={16} fill={color.background} stroke={color.text} strokeWidth={2} />
      <SvgText x={cx} y={cy + 5} fill={color.text} fontSize={14} fontWeight="700" textAnchor="middle">
        {label}
      </SvgText>
    </>
  );
}

function BatterySymbol({ x, yTop, yBottom }: { x: number; yTop: number; yBottom: number }) {
  const midY = (yTop + yBottom) / 2;
  return (
    <>
      <Line x1={x} y1={yTop} x2={x} y2={yBottom} stroke={color.text} strokeWidth={2} />
      <Line x1={x - 10} y1={midY - 10} x2={x + 10} y2={midY - 10} stroke={color.text} strokeWidth={3} />
      <Line x1={x - 6} y1={midY + 10} x2={x + 6} y2={midY + 10} stroke={color.text} strokeWidth={1.5} />
    </>
  );
}
