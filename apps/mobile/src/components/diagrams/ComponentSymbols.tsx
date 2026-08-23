/**
 * CC-11.3 (electronic-component schematic-symbol library): pure, stateless
 * BS EN 60617 / IEC 60617 (the UK/IEC convention -- see design authority
 * cited in this package's integration spec) SVG-fragment symbols for the
 * 13 governed components in `electrical.electronic_components`
 * (scripts/content/data/cc05a-pedagogy-unit202.ts). Each function returns
 * a composable fragment of `react-native-svg` primitives sized for a
 * `SYMBOL_VIEW_WIDTH x SYMBOL_VIEW_HEIGHT` (60x40) viewBox unit -- meant
 * to be embedded inside a parent `<Svg>`, never a standalone `<Svg>`
 * wrapper itself. This mirrors `resistor-path.ts`'s "pure fragment,
 * composed by the caller" pattern one level up: that file returns path
 * strings for a single-shape symbol; several of these symbols need more
 * than one primitive (a triangle plus a bar, an arrow plus a lead), so
 * these are small components rather than path-string functions, but the
 * intent is identical -- no `<Svg>` wrapper, no state, nothing but shapes.
 *
 * VISUAL CATEGORY (kept conceptually distinct per this package's own
 * brief -- see ComponentSymbolCard.tsx's `SYMBOL_CATEGORY` map for the
 * machine-readable version of this split):
 *  - 11 components below (everything except `rectifier` and `inverter`)
 *    render a genuine BS EN 60617 / IEC 60617 SCHEMATIC SYMBOL: resistor,
 *    capacitor, diode, zener_diode, led, photodiode, thermistor, diac,
 *    triac, transistor, thyristor_scr.
 *  - `rectifier` and `inverter` are NOT single standard schematic symbols
 *    (a rectifier is normally drawn as a diode-bridge circuit fragment;
 *    an inverter is a functional block, not a discrete component) -- both
 *    instead render a small labelled FUNCTIONAL BLOCK ("AC -> box -> DC"
 *    / "DC -> box -> AC") rather than a symbol, per this package's brief.
 *
 * Every stroke renders at `color.text`/`strokeWidth 2`, matching
 * MagneticForceDiagram.tsx's convention -- a teaching symbol must never
 * be faint.
 */
import { Circle, Line, Path, Polygon, Rect, Text as SvgText } from "react-native-svg";

import { color } from "@/lib/tokens";

/** Every symbol below is drawn for this exact viewBox unit -- callers size their `<Svg>` to a multiple of it. */
export const SYMBOL_VIEW_WIDTH = 60;
export const SYMBOL_VIEW_HEIGHT = 40;

const CY = SYMBOL_VIEW_HEIGHT / 2; // 20 -- every symbol's electrical centreline.
const STROKE = color.text;
const STROKE_WIDTH = 2;

// -----------------------------------------------------------------------
// Shared micro-primitives (leads, arrows, the diode triangle+bar) -- kept
// tiny and local, exactly like MagneticForceDiagram.tsx's own Pole/
// FieldArrow helpers, not a generic shape-library.
// -----------------------------------------------------------------------

/** A plain connecting wire lead along the symbol's centreline (or an explicit `y`). */
function Lead({ x1, x2, y = CY }: { x1: number; x2: number; y?: number }) {
  return <Line x1={x1} y1={y} x2={x2} y2={y} stroke={STROKE} strokeWidth={STROKE_WIDTH} />;
}

/** A straight line with a small filled arrowhead at (x2, y2) -- used for LED/photodiode light arrows and gate leads. */
function Arrow({ x1, y1, x2, y2, headLength = 4 }: { x1: number; y1: number; x2: number; y2: number; headLength?: number }) {
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const hx1 = x2 - headLength * Math.cos(angle - Math.PI / 6);
  const hy1 = y2 - headLength * Math.sin(angle - Math.PI / 6);
  const hx2 = x2 - headLength * Math.cos(angle + Math.PI / 6);
  const hy2 = y2 - headLength * Math.sin(angle + Math.PI / 6);
  return (
    <>
      <Line x1={x1} y1={y1} x2={x2} y2={y2} stroke={STROKE} strokeWidth={1.5} />
      <Polygon points={`${x2},${y2} ${hx1},${hy1} ${hx2},${hy2}`} fill={STROKE} />
    </>
  );
}

/**
 * The universal diode symbol: a solid triangle (arrow) with its apex
 * touching a straight perpendicular cathode bar. Shared by diode, zener
 * diode (bar shape overridden below), LED, photodiode and thyristor/SCR
 * (gate lead added below) -- every diode-family/thyristor-family member
 * is genuinely built from this one shared shape, matching how the
 * governed corpus itself groups them (contrastsWith/prereqs on
 * EL-COMPONENT-DIODE-001).
 */
function DiodeTriangleAndBar({ baseX, apexX, barX, top = 8, bottom = 32 }: { baseX: number; apexX: number; barX: number; top?: number; bottom?: number }) {
  return (
    <>
      <Polygon points={`${baseX},${top} ${baseX},${bottom} ${apexX},${CY}`} fill={STROKE} stroke={STROKE} strokeWidth={STROKE_WIDTH} />
      <Line x1={barX} y1={top} x2={barX} y2={bottom} stroke={STROKE} strokeWidth={STROKE_WIDTH} />
    </>
  );
}

// -----------------------------------------------------------------------
// 1. Resistor -- BS EN 60617 plain rectangle (NOT the US/ANSI zigzag).
// -----------------------------------------------------------------------
export function ResistorSymbol(): React.JSX.Element {
  return (
    <>
      <Lead x1={0} x2={18} />
      <Rect x={18} y={12} width={24} height={16} fill="none" stroke={STROKE} strokeWidth={STROKE_WIDTH} />
      <Lead x1={42} x2={60} />
    </>
  );
}

// -----------------------------------------------------------------------
// 2. Capacitor -- two parallel plates separated by a gap.
// -----------------------------------------------------------------------
export function CapacitorSymbol(): React.JSX.Element {
  return (
    <>
      <Lead x1={0} x2={27} />
      <Line x1={27} y1={8} x2={27} y2={32} stroke={STROKE} strokeWidth={STROKE_WIDTH} />
      <Line x1={33} y1={8} x2={33} y2={32} stroke={STROKE} strokeWidth={STROKE_WIDTH} />
      <Lead x1={33} x2={60} />
    </>
  );
}

// -----------------------------------------------------------------------
// 3. Diode -- triangle pointing toward a perpendicular bar.
// -----------------------------------------------------------------------
export function DiodeSymbol(): React.JSX.Element {
  return (
    <>
      <Lead x1={0} x2={20} />
      <DiodeTriangleAndBar baseX={20} apexX={36} barX={36} />
      <Lead x1={36} x2={60} />
    </>
  );
}

// -----------------------------------------------------------------------
// 4. Zener diode -- diode symbol, but the bar is kinked into a 'Z' shape
//    at both ends. This is the ONLY structural difference from
//    DiodeSymbol above (2 extra short diagonal "flag" lines) -- see
//    ComponentSymbolCard.test.tsx for a test asserting this literally
//    (Zener renders strictly more Line elements than a plain diode).
// -----------------------------------------------------------------------
export function ZenerDiodeSymbol(): React.JSX.Element {
  return (
    <>
      <Lead x1={0} x2={20} />
      <Polygon points={`20,8 20,32 36,${CY}`} fill={STROKE} stroke={STROKE} strokeWidth={STROKE_WIDTH} />
      <Line x1={36} y1={8} x2={36} y2={32} stroke={STROKE} strokeWidth={STROKE_WIDTH} />
      {/* The two kinks: short diagonal flags bent outward at each end of the bar. */}
      <Line x1={36} y1={8} x2={40} y2={4} stroke={STROKE} strokeWidth={STROKE_WIDTH} />
      <Line x1={36} y1={32} x2={32} y2={36} stroke={STROKE} strokeWidth={STROKE_WIDTH} />
      <Lead x1={36} x2={60} />
    </>
  );
}

// -----------------------------------------------------------------------
// 5. LED -- diode symbol with two small arrows pointing AWAY from it
//    (emitted light).
// -----------------------------------------------------------------------
export function LedSymbol(): React.JSX.Element {
  return (
    <>
      <Lead x1={0} x2={20} />
      <DiodeTriangleAndBar baseX={20} apexX={36} barX={36} />
      <Lead x1={36} x2={60} />
      <Arrow x1={24} y1={7} x2={32} y2={1} />
      <Arrow x1={30} y1={7} x2={38} y2={1} />
    </>
  );
}

// -----------------------------------------------------------------------
// 6. Photodiode -- diode symbol with two small arrows pointing TOWARD it
//    (received light) -- the exact reverse of LedSymbol's arrows above.
// -----------------------------------------------------------------------
export function PhotodiodeSymbol(): React.JSX.Element {
  return (
    <>
      <Lead x1={0} x2={20} />
      <DiodeTriangleAndBar baseX={20} apexX={36} barX={36} />
      <Lead x1={36} x2={60} />
      <Arrow x1={32} y1={1} x2={24} y2={7} />
      <Arrow x1={38} y1={1} x2={30} y2={7} />
    </>
  );
}

// -----------------------------------------------------------------------
// 7. Thermistor -- resistor rectangle with a diagonal line through it and
//    a small "t" label (temperature-dependent-resistor convention). One
//    symbol covers both the NTC and PTC variant referenced by the corpus
//    (EL-COMPONENT-THERMISTOR-001 / EL-COMPONENT-THERMISTOR-PTC-001) --
//    the two are distinguished by the direction of resistance change with
//    temperature, not by a different drawn symbol; ComponentSymbolCard's
//    caption/accessibility text carries that variant note.
// -----------------------------------------------------------------------
export function ThermistorSymbol(): React.JSX.Element {
  return (
    <>
      <Lead x1={0} x2={18} />
      <Rect x={18} y={12} width={24} height={16} fill="none" stroke={STROKE} strokeWidth={STROKE_WIDTH} />
      <Line x1={14} y1={34} x2={46} y2={6} stroke={STROKE} strokeWidth={STROKE_WIDTH} />
      <SvgText x={48} y={13} fill={STROKE} fontSize={9} fontWeight="700">
        {"t°"}
      </SvgText>
      <Lead x1={42} x2={60} />
    </>
  );
}

// -----------------------------------------------------------------------
// 8. DIAC -- two diode triangles pointing in opposite directions,
//    overlapping (bidirectional), with NO gate lead.
// -----------------------------------------------------------------------
export function DiacSymbol(): React.JSX.Element {
  return (
    <>
      <Lead x1={0} x2={16} />
      <Polygon points={`16,8 16,32 32,${CY}`} fill={STROKE} stroke={STROKE} strokeWidth={STROKE_WIDTH} />
      <Polygon points={`44,8 44,32 28,${CY}`} fill={STROKE} stroke={STROKE} strokeWidth={STROKE_WIDTH} />
      <Lead x1={44} x2={60} />
    </>
  );
}

// -----------------------------------------------------------------------
// 9. TRIAC -- the same two opposite-pointing triangles as the DIAC, PLUS
//    a gate lead (a line with an arrowhead). The gate lead is the single
//    deliberate structural difference from DiacSymbol above -- see
//    ComponentSymbolCard.test.tsx for a test asserting TRIAC renders
//    strictly more Line/Polygon elements than DIAC because of it.
// -----------------------------------------------------------------------
export function TriacSymbol(): React.JSX.Element {
  return (
    <>
      <Lead x1={0} x2={16} />
      <Polygon points={`16,8 16,32 32,${CY}`} fill={STROKE} stroke={STROKE} strokeWidth={STROKE_WIDTH} />
      <Polygon points={`44,8 44,32 28,${CY}`} fill={STROKE} stroke={STROKE} strokeWidth={STROKE_WIDTH} />
      <Lead x1={44} x2={60} />
      {/* Gate lead -- the feature that distinguishes a TRIAC from a DIAC. */}
      <Arrow x1={30} y1={35} x2={40} y2={39} />
    </>
  );
}

// -----------------------------------------------------------------------
// 10. Transistor (BJT) -- a circle containing three lines: a straight
//     vertical base line, an angled collector line (no arrowhead) and an
//     angled emitter line WITH a small arrowhead showing conventional
//     current direction.
// -----------------------------------------------------------------------
export function TransistorSymbol(): React.JSX.Element {
  const cx = 32;
  const r = 16;
  return (
    <>
      <Lead x1={0} x2={cx - r} />
      <Circle cx={cx} cy={CY} r={r} fill="none" stroke={STROKE} strokeWidth={STROKE_WIDTH} />
      {/* Base: straight vertical line inside the circle, fed by a horizontal connector from the circle edge. */}
      <Line x1={cx - r} y1={CY} x2={cx - 6} y2={CY} stroke={STROKE} strokeWidth={STROKE_WIDTH} />
      <Line x1={cx - 6} y1={CY - 10} x2={cx - 6} y2={CY + 10} stroke={STROKE} strokeWidth={STROKE_WIDTH} />
      {/* Collector: angled line, no arrowhead, exiting the circle toward the upper right. */}
      <Line x1={cx - 6} y1={CY - 10} x2={cx + 6} y2={CY - 16} stroke={STROKE} strokeWidth={STROKE_WIDTH} />
      <Line x1={cx + 6} y1={CY - 16} x2={cx + r + 6} y2={CY - 19} stroke={STROKE} strokeWidth={STROKE_WIDTH} />
      {/* Emitter: angled line WITH an arrowhead, exiting toward the lower right. */}
      <Arrow x1={cx - 6} y1={CY + 10} x2={cx + 6} y2={CY + 16} />
      <Line x1={cx + 6} y1={CY + 16} x2={cx + r + 6} y2={CY + 19} stroke={STROKE} strokeWidth={STROKE_WIDTH} />
    </>
  );
}

// -----------------------------------------------------------------------
// 11. Thyristor / SCR -- diode symbol (triangle + bar) with an additional
//     gate lead (a line with an arrow) coming off near the bar.
// -----------------------------------------------------------------------
export function ThyristorScrSymbol(): React.JSX.Element {
  return (
    <>
      <Lead x1={0} x2={20} />
      <DiodeTriangleAndBar baseX={20} apexX={36} barX={36} />
      <Lead x1={36} x2={60} />
      <Arrow x1={36} y1={24} x2={46} y2={35} />
    </>
  );
}

// -----------------------------------------------------------------------
// 12. Rectifier -- FUNCTIONAL BLOCK (not a discrete-component symbol):
//     "AC -> [box containing a diode] -> DC", showing the mechanism.
// -----------------------------------------------------------------------
export function RectifierBlock(): React.JSX.Element {
  const boxX = 14;
  const boxY = 10;
  const boxW = 32;
  const boxH = 20;
  return (
    <>
      <Arrow x1={0} y1={CY} x2={boxX} y2={CY} />
      <SvgText x={boxX / 2} y={7} fill={STROKE} fontSize={9} fontWeight="700" textAnchor="middle">
        AC
      </SvgText>
      <Rect x={boxX} y={boxY} width={boxW} height={boxH} fill="none" stroke={STROKE} strokeWidth={STROKE_WIDTH} />
      {/* Small diode inside the block -- the mechanism a rectifier actually uses. */}
      <Polygon points={`${boxX + 8},${CY - 6} ${boxX + 8},${CY + 6} ${boxX + 16},${CY}`} fill={STROKE} stroke={STROKE} strokeWidth={STROKE_WIDTH} />
      <Line x1={boxX + 16} y1={CY - 6} x2={boxX + 16} y2={CY + 6} stroke={STROKE} strokeWidth={STROKE_WIDTH} />
      <Arrow x1={boxX + boxW} y1={CY} x2={60} y2={CY} />
      <SvgText x={boxX + boxW + (60 - boxX - boxW) / 2} y={7} fill={STROKE} fontSize={9} fontWeight="700" textAnchor="middle">
        DC
      </SvgText>
    </>
  );
}

// -----------------------------------------------------------------------
// 13. Inverter -- FUNCTIONAL BLOCK (not a discrete-component symbol):
//     "DC -> [box containing a square wave] -> AC", showing the direction
//     of conversion. Deliberately never re-uses the rectifier's diode
//     glyph -- an inverter is not rectification.
// -----------------------------------------------------------------------
export function InverterBlock(): React.JSX.Element {
  const boxX = 14;
  const boxY = 10;
  const boxW = 32;
  const boxH = 20;
  return (
    <>
      <Arrow x1={0} y1={CY} x2={boxX} y2={CY} />
      <SvgText x={boxX / 2} y={7} fill={STROKE} fontSize={9} fontWeight="700" textAnchor="middle">
        DC
      </SvgText>
      <Rect x={boxX} y={boxY} width={boxW} height={boxH} fill="none" stroke={STROKE} strokeWidth={STROKE_WIDTH} />
      {/* Small square-wave path inside the block -- DC switched into an AC waveform. */}
      <Path
        d={`M${boxX + 6},${CY + 4} L${boxX + 6},${CY - 6} L${boxX + 13},${CY - 6} L${boxX + 13},${CY + 4} L${boxX + 20},${CY + 4} L${boxX + 20},${CY - 6} L${boxX + 26},${CY - 6}`}
        fill="none"
        stroke={STROKE}
        strokeWidth={STROKE_WIDTH}
      />
      <Arrow x1={boxX + boxW} y1={CY} x2={60} y2={CY} />
      <SvgText x={boxX + boxW + (60 - boxX - boxW) / 2} y={7} fill={STROKE} fontSize={9} fontWeight="700" textAnchor="middle">
        AC
      </SvgText>
    </>
  );
}
