/**
 * CC-11.3 (electronic-component schematic-symbol library): a single reusable
 * "component card" renderer for `electrical.electronic_components`'s 13
 * governed components (scripts/content/data/cc05a-pedagogy-unit202.ts).
 * Given a `DiagramInstance` whose `parameters.component_type` names one of
 * the 13 ids below, renders the component's name as a heading, its
 * governed BS EN 60617 / IEC 60617 symbol (from ComponentSymbols.tsx) in a
 * bordered box, and a short one-line functional caption.
 *
 * A single self-contained `<Svg accessibilityLabel=... accessibilityRole=
 * "image">` as the sole root element -- the same shape every other
 * component in this folder uses (see e.g. MagneticForceDiagram.tsx), not
 * a `<View>`-wrapped card with separate RN `<Text>` chrome. This matters
 * beyond stylistic consistency: `apps/mobile/src/lib/visual-governance/
 * render-tree-to-svg.ts` (the CC-05D render-capture/QA-catalogue
 * pipeline every diagram in this folder is audited through) requires the
 * captured component tree's root to be a real `RNSVGSvgView` -- a `View`
 * wrapper is invisible to it by design (silently auditing only part of
 * an image is treated as worse than failing loudly), so this component
 * follows the same all-SVG convention as its siblings rather than
 * carving out an exception.
 *
 * Deliberately NO operating-principle prose here -- that stays in the
 * lesson's own step text (`concept_*` steps' `purpose`/assertion
 * statements). This card's job is purely visual: symbol recognition + an
 * at-a-glance one-line function, never a restatement of the governed
 * assertion.
 *
 * `component_type` ids below match the governed corpus's OWN naming
 * wherever the corpus already names a value (the `recognise_diode_family`
 * / `recognise_switching_family` / `recognise_rectifier_type` question
 * blueprints' own `answer.options` in cc05a-pedagogy-unit202.ts use
 * exactly "diode" | "zener_diode" | "led" | "photodiode" | "diac" |
 * "triac" | "thyristor_scr" | "transistor" | "inverter" -- reused
 * verbatim here rather than inventing parallel ids).
 */
import type { DiagramInstance } from "@alp/calculation-engine";
import Svg, { G, Rect, Text as SvgText } from "react-native-svg";

import {
  CapacitorSymbol,
  DiacSymbol,
  DiodeSymbol,
  InverterBlock,
  LedSymbol,
  PhotodiodeSymbol,
  RectifierBlock,
  ResistorSymbol,
  SYMBOL_VIEW_HEIGHT,
  SYMBOL_VIEW_WIDTH,
  ThermistorSymbol,
  ThyristorScrSymbol,
  TransistorSymbol,
  TriacSymbol,
  ZenerDiodeSymbol,
} from "./ComponentSymbols";
import { color } from "@/lib/tokens";

export interface ComponentSymbolCardProps {
  readonly diagram: DiagramInstance;
  readonly testID?: string;
}

/** The exact 13 governed `component_type` ids this card renders -- see header comment for the naming-source rule. */
export type ComponentType =
  | "resistor"
  | "capacitor"
  | "diode"
  | "zener_diode"
  | "led"
  | "photodiode"
  | "thermistor"
  | "diac"
  | "triac"
  | "transistor"
  | "thyristor_scr"
  | "rectifier"
  | "inverter";

export const COMPONENT_TYPES: readonly ComponentType[] = [
  "resistor",
  "capacitor",
  "diode",
  "zener_diode",
  "led",
  "photodiode",
  "thermistor",
  "diac",
  "triac",
  "transistor",
  "thyristor_scr",
  "rectifier",
  "inverter",
];

/**
 * Visual category, per this package's own instruction to keep the two
 * kinds conceptually distinct even though both compose through this same
 * card: 11 components get a genuine schematic SYMBOL; `rectifier` and
 * `inverter` get a functional-block ILLUSTRATION instead (see
 * ComponentSymbols.tsx's header comment for why neither has a single
 * standard discrete-component symbol).
 */
export type SymbolCategory = "schematic_symbol" | "functional_block";

interface ComponentMeta {
  readonly name: string;
  readonly caption: string;
  /** One-sentence description of what the symbol looks like -- feeds the accessibility label alongside `name`. */
  readonly symbolDescription: string;
  readonly category: SymbolCategory;
  readonly Symbol: () => React.JSX.Element;
}

const COMPONENT_META: Readonly<Record<ComponentType, ComponentMeta>> = {
  resistor: {
    name: "Resistor",
    caption: "Limits current or divides voltage.",
    symbolDescription: "a plain rectangle symbol (BS EN 60617 / IEC 60617), not the US zigzag.",
    category: "schematic_symbol",
    Symbol: ResistorSymbol,
  },
  capacitor: {
    name: "Capacitor",
    caption: "Stores charge and energy in an electric field.",
    symbolDescription: "two parallel plates with a small gap between them.",
    category: "schematic_symbol",
    Symbol: CapacitorSymbol,
  },
  diode: {
    name: "Diode",
    caption: "Conducts current in one direction only.",
    symbolDescription: "a triangle (arrow) pointing toward a straight perpendicular bar.",
    category: "schematic_symbol",
    Symbol: DiodeSymbol,
  },
  zener_diode: {
    name: "Zener diode",
    caption: "Holds a constant voltage in reverse breakdown.",
    symbolDescription: "a diode symbol with the bar bent into a kinked Z-shape at both ends, distinguishing it from a standard diode.",
    category: "schematic_symbol",
    Symbol: ZenerDiodeSymbol,
  },
  led: {
    name: "LED (light-emitting diode)",
    caption: "Produces light when forward-biased.",
    symbolDescription: "a diode symbol with two small arrows pointing away from it, showing emitted light.",
    category: "schematic_symbol",
    Symbol: LedSymbol,
  },
  photodiode: {
    name: "Photodiode",
    caption: "Generates a photocurrent in response to light.",
    symbolDescription: "a diode symbol with two small arrows pointing toward it, showing received light -- the opposite of an LED.",
    category: "schematic_symbol",
    Symbol: PhotodiodeSymbol,
  },
  thermistor: {
    name: "Thermistor (NTC / PTC)",
    caption: "Resistance changes with temperature.",
    symbolDescription:
      "a resistor rectangle with a diagonal line through it and a small 't' label, showing temperature-dependent resistance. The same symbol represents both the NTC and PTC variant.",
    category: "schematic_symbol",
    Symbol: ThermistorSymbol,
  },
  diac: {
    name: "DIAC",
    caption: "A bidirectional trigger device.",
    symbolDescription: "two diode triangle-and-bar symbols pointing in opposite directions, overlapping, with no gate lead.",
    category: "schematic_symbol",
    Symbol: DiacSymbol,
  },
  triac: {
    name: "TRIAC",
    caption: "A gate-triggered bidirectional AC switch.",
    symbolDescription: "like the DIAC's two opposite-pointing triangles, but with an added gate lead -- the gate lead is what distinguishes a TRIAC from a DIAC.",
    category: "schematic_symbol",
    Symbol: TriacSymbol,
  },
  transistor: {
    name: "Transistor (BJT)",
    caption: "A small base current controls a larger one.",
    symbolDescription:
      "a circle containing three lines -- a straight vertical base line, an angled collector line, and an angled emitter line with an arrowhead showing conventional current direction.",
    category: "schematic_symbol",
    Symbol: TransistorSymbol,
  },
  thyristor_scr: {
    name: "Thyristor (SCR)",
    caption: "Conducts once triggered, then latches on.",
    symbolDescription: "a diode symbol (triangle and bar) with an added gate lead near the bar.",
    category: "schematic_symbol",
    Symbol: ThyristorScrSymbol,
  },
  rectifier: {
    name: "Rectifier",
    caption: "Converts an AC supply into a DC output.",
    symbolDescription:
      "a functional block, not a single schematic symbol -- an AC input arrow and a DC output arrow either side of a box containing a diode symbol, showing the conversion mechanism.",
    category: "functional_block",
    Symbol: RectifierBlock,
  },
  inverter: {
    name: "Inverter",
    caption: "Converts a DC supply into an AC output.",
    symbolDescription:
      "a functional block, not a single schematic symbol -- a DC input arrow and an AC output arrow either side of a labelled box, showing the direction of conversion.",
    category: "functional_block",
    Symbol: InverterBlock,
  },
};

/** Default `component_type` used only when a `DiagramInstance` omits the parameter entirely -- mirrors every other diagram component's own `String(diagram.parameters.x ?? default)` fallback pattern (see e.g. MagneticForceDiagram.tsx). */
const DEFAULT_COMPONENT_TYPE: ComponentType = "resistor";

function resolveComponentType(value: unknown): ComponentType {
  return typeof value === "string" && value in COMPONENT_META ? (value as ComponentType) : DEFAULT_COMPONENT_TYPE;
}

const WIDTH = 240;
const HEIGHT = 210;
const BOX_X = 20;
const BOX_Y = 34;
const BOX_WIDTH = WIDTH - BOX_X * 2;
const BOX_HEIGHT = 90;
const SYMBOL_SCALE = Math.min(BOX_WIDTH / SYMBOL_VIEW_WIDTH, BOX_HEIGHT / SYMBOL_VIEW_HEIGHT) * 0.8;
const SYMBOL_TRANSLATE_X = BOX_X + (BOX_WIDTH - SYMBOL_VIEW_WIDTH * SYMBOL_SCALE) / 2;
const SYMBOL_TRANSLATE_Y = BOX_Y + (BOX_HEIGHT - SYMBOL_VIEW_HEIGHT * SYMBOL_SCALE) / 2;

/** Simple word-wrap for the caption -- SVG text never auto-wraps, so long captions are split into short lines by character-count estimate (matching the plain, symbolic-only convention every diagram in this folder already follows for its own labels). */
function wrapCaption(text: string, maxCharsPerLine = 26): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length > maxCharsPerLine && current) {
      lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
  }
  if (current) lines.push(current);
  return lines;
}

export function ComponentSymbolCard({ diagram, testID }: ComponentSymbolCardProps): React.JSX.Element {
  const componentType = resolveComponentType(diagram.parameters.component_type);
  const meta = COMPONENT_META[componentType];
  const { Symbol } = meta;
  const captionLines = wrapCaption(meta.caption);

  const accessibilityLabel = `${meta.name}: ${meta.symbolDescription}`;

  return (
    <Svg width={WIDTH} height={HEIGHT} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} testID={testID} accessible accessibilityLabel={accessibilityLabel} accessibilityRole="image">
      <SvgText x={WIDTH / 2} y={20} fill={color.text} fontSize={14} fontWeight="700" textAnchor="middle">
        {meta.name}
      </SvgText>

      <Rect x={BOX_X} y={BOX_Y} width={BOX_WIDTH} height={BOX_HEIGHT} rx={8} fill={color.surface} stroke={color.border} strokeWidth={1} />
      <G transform={`translate(${SYMBOL_TRANSLATE_X}, ${SYMBOL_TRANSLATE_Y}) scale(${SYMBOL_SCALE})`}>
        <Symbol />
      </G>

      {captionLines.map((line, i) => (
        <SvgText key={i} x={WIDTH / 2} y={BOX_Y + BOX_HEIGHT + 22 + i * 14} fill={color.textSecondary} fontSize={11} textAnchor="middle">
          {line}
        </SvgText>
      ))}
    </Svg>
  );
}
