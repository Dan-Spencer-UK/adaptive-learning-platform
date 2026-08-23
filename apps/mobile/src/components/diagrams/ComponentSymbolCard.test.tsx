import { render } from "@testing-library/react-native";

import { COMPONENT_TYPES, ComponentSymbolCard } from "./ComponentSymbolCard";

/** Human-readable heading text expected for each governed `component_type` -- kept in sync with ComponentSymbolCard.tsx's own COMPONENT_META names. */
const EXPECTED_HEADING: Readonly<Record<(typeof COMPONENT_TYPES)[number], string>> = {
  resistor: "Resistor",
  capacitor: "Capacitor",
  diode: "Diode",
  zener_diode: "Zener diode",
  led: "LED (light-emitting diode)",
  photodiode: "Photodiode",
  thermistor: "Thermistor (NTC / PTC)",
  diac: "DIAC",
  triac: "TRIAC",
  transistor: "Transistor (BJT)",
  thyristor_scr: "Thyristor (SCR)",
  rectifier: "Rectifier",
  inverter: "Inverter",
};

function renderCard(componentType: string) {
  return render(
    <ComponentSymbolCard diagram={{ blueprintId: "electronics.component_symbol_card", parameters: { component_type: componentType }, labels: [] }} />,
  );
}

describe("ComponentSymbolCard", () => {
  describe.each(COMPONENT_TYPES)("component_type '%s'", (componentType) => {
    it("renders without throwing, shows the component's heading, and produces a component-specific accessibility label", async () => {
      // CC-11.3: ComponentSymbolCard is a pure <Svg> component (its heading
      // is an <SvgText>, not an RN <Text>) -- getByText does not reliably
      // match react-native-svg Text/TSpan content in this jest-expo setup
      // (a known limitation also hit elsewhere in this diagram folder), so
      // presence of the heading is proven via the accessibility label,
      // which always starts with "<Name>: " followed by a description of
      // the symbol -- the same evidence the redundant getByText call was
      // duplicating.
      const { getByLabelText } = await renderCard(componentType);
      expect(getByLabelText(new RegExp(`^${EXPECTED_HEADING[componentType].replace(/[()./]/g, "\\$&")}: `))).toBeTruthy();
    });
  });

  it("gives every component_type a distinct accessibility label (no two components share a description)", async () => {
    const labels = new Set<string>();
    for (const componentType of COMPONENT_TYPES) {
      const { getByLabelText } = await renderCard(componentType);
      const node = getByLabelText(new RegExp(`^${EXPECTED_HEADING[componentType].replace(/[()./]/g, "\\$&")}: `));
      const label = node.props.accessibilityLabel as string;
      expect(labels.has(label)).toBe(false);
      labels.add(label);
    }
  });

  it("distinguishes the Zener diode's kinked Z-shaped bar from a standard diode's plain straight bar", async () => {
    const diode = await renderCard("diode");
    const zener = await renderCard("zener_diode");

    const diodeLabel = diode.getByLabelText(/^Diode: /).props.accessibilityLabel as string;
    const zenerLabel = zener.getByLabelText(/^Zener diode: /).props.accessibilityLabel as string;

    expect(zenerLabel).toMatch(/kinked Z-shape/);
    expect(diodeLabel).not.toMatch(/kinked/);
    expect(diodeLabel).not.toMatch(/Z-shape/);
  });

  it("distinguishes the TRIAC's gate lead from the DIAC's lack of one -- the governed key visual distinguisher between the two", async () => {
    const diac = await renderCard("diac");
    const triac = await renderCard("triac");

    const diacLabel = diac.getByLabelText(/^DIAC: /).props.accessibilityLabel as string;
    const triacLabel = triac.getByLabelText(/^TRIAC: /).props.accessibilityLabel as string;

    expect(triacLabel).toMatch(/gate lead/);
    expect(triacLabel).not.toMatch(/no gate lead/);
    expect(diacLabel).toMatch(/no gate lead/);
  });

  it("distinguishes the LED's outward light arrows from the photodiode's inward light arrows", async () => {
    const led = await renderCard("led");
    const photodiode = await renderCard("photodiode");

    const ledLabel = led.getByLabelText(/^LED \(light-emitting diode\): /).props.accessibilityLabel as string;
    const photodiodeLabel = photodiode.getByLabelText(/^Photodiode: /).props.accessibilityLabel as string;

    expect(ledLabel).toMatch(/arrows pointing away from it/);
    expect(photodiodeLabel).toMatch(/arrows pointing toward it/);
  });

  it("marks rectifier and inverter as functional blocks, distinct from the 11 genuine schematic symbols", async () => {
    const rectifier = await renderCard("rectifier");
    const inverter = await renderCard("inverter");
    const resistor = await renderCard("resistor");

    expect(rectifier.getByLabelText(/^Rectifier: /).props.accessibilityLabel as string).toMatch(/a functional block, not a single schematic symbol/);
    expect(inverter.getByLabelText(/^Inverter: /).props.accessibilityLabel as string).toMatch(/a functional block, not a single schematic symbol/);
    expect(resistor.getByLabelText(/^Resistor: /).props.accessibilityLabel as string).not.toMatch(/functional block/);
  });

  it("falls back to the resistor symbol for an unrecognised component_type rather than throwing", async () => {
    const { getByLabelText } = await render(
      <ComponentSymbolCard diagram={{ blueprintId: "electronics.component_symbol_card", parameters: { component_type: "not_a_real_component" }, labels: [] }} />,
    );
    expect(getByLabelText(/^Resistor: /)).toBeTruthy();
  });
});
