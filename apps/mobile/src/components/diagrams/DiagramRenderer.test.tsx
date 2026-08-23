import { render } from "@testing-library/react-native";
import type { DiagramBlueprint } from "@alp/content-schema";

import { buildTeachingDiagramInstance, DiagramRenderer, SUPPORTED_DIAGRAM_BLUEPRINT_IDS, UnsupportedDiagramBlueprintError } from "./DiagramRenderer";

function blueprint(overrides: Partial<DiagramBlueprint> & Pick<DiagramBlueprint, "id" | "type">): DiagramBlueprint {
  return {
    renderer: "svg",
    parameters: [],
    accessibility: { semanticDescriptionRequired: true, colourOnlyEncodingProhibited: true, identifierLabelPattern: "R{index}" },
    valueEmbedding: "symbolic_only",
    ...overrides,
  };
}

const SERIES_BLUEPRINT = blueprint({
  id: "circuit.series_resistors",
  type: "electrical_circuit",
  parameters: [
    { name: "component_count", kind: "enum", allowed: [2, 3, 4] },
    { name: "show_values", kind: "boolean" },
    { name: "show_current_arrow", kind: "boolean" },
  ],
});

describe("DiagramRenderer registry", () => {
  it("renders the registered component for a known blueprint id", async () => {
    const { getByLabelText } = await render(
      <DiagramRenderer blueprint={SERIES_BLUEPRINT} diagram={{ blueprintId: "circuit.series_resistors", parameters: { component_count: 2, show_values: false, show_current_arrow: false }, labels: ["R1", "R2"] }} />,
    );
    expect(getByLabelText(/Series circuit diagram/)).toBeTruthy();
  });

  it("throws UnsupportedDiagramBlueprintError for an unregistered blueprint id -- fails loudly, never silently disappears (task brief §7/§8)", async () => {
    const unknown = blueprint({ id: "not.a.real.blueprint", type: "graph" });
    await expect(render(<DiagramRenderer blueprint={unknown} diagram={{ blueprintId: "not.a.real.blueprint", parameters: {}, labels: [] }} />)).rejects.toThrow(
      UnsupportedDiagramBlueprintError,
    );
  });

  it("SUPPORTED_DIAGRAM_BLUEPRINT_IDS lists exactly the 7 governed diagram blueprints", () => {
    expect([...SUPPORTED_DIAGRAM_BLUEPRINT_IDS]).toEqual(
      [
        "circuit.parallel_resistors",
        "circuit.series_parallel_mixed",
        "circuit.series_resistors",
        "graph.waveform_sine",
        "instrument.measurement_connection",
        "magnetic.field_conductor_direction",
        "motor.force_field_current",
      ].sort(),
    );
  });

  it("passes the reveal prop through to a magnetism diagram only when explicitly supplied", async () => {
    const fieldBlueprint = blueprint({
      id: "magnetic.field_conductor_direction",
      type: "magnetic_field",
      parameters: [{ name: "current_direction", kind: "enum", allowed: ["into_page", "out_of_page"] }],
    });
    const diagram = { blueprintId: "magnetic.field_conductor_direction", parameters: { current_direction: "into_page" }, labels: [] };

    const withoutReveal = await render(<DiagramRenderer blueprint={fieldBlueprint} diagram={diagram} />);
    expect(withoutReveal.getByLabelText(/direction the fingers curl.*is not shown/)).toBeTruthy();

    const withReveal = await render(<DiagramRenderer blueprint={fieldBlueprint} diagram={diagram} reveal={{ fieldRotation: "clockwise" }} />);
    expect(withReveal.getByLabelText(/circling clockwise/)).toBeTruthy();
  });
});

describe("buildTeachingDiagramInstance", () => {
  it("picks the first allowed value for enum parameters, true for boolean parameters", () => {
    const instance = buildTeachingDiagramInstance(SERIES_BLUEPRINT, ["R1", "R2", "R3"]);
    expect(instance).toEqual({
      blueprintId: "circuit.series_resistors",
      parameters: { component_count: 2, show_values: true, show_current_arrow: true },
      labels: ["R1", "R2", "R3"],
    });
  });

  it("picks the min value for number_range parameters", () => {
    const waveformBlueprint = blueprint({
      id: "graph.waveform_sine",
      type: "waveform",
      parameters: [{ name: "cycles_shown", kind: "number_range", min: 1, max: 3 }],
    });
    const instance = buildTeachingDiagramInstance(waveformBlueprint);
    expect(instance.parameters.cycles_shown).toBe(1);
  });
});
