import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { render } from "@testing-library/react-native";
import type { DiagramBlueprint } from "@alp/content-schema";

import { buildTeachingDiagramInstance, CANONICAL_TEACHING_VISUAL_LOCK, DiagramRenderer, SUPPORTED_DIAGRAM_BLUEPRINT_IDS, UnsupportedDiagramBlueprintError } from "./DiagramRenderer";

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

  it("SUPPORTED_DIAGRAM_BLUEPRINT_IDS lists exactly the 19 governed diagram blueprints (CC-11.11 adds 3: rectification-waveform, capacitor-transient-curve, electron-flow-vs-conventional-current)", () => {
    expect([...SUPPORTED_DIAGRAM_BLUEPRINT_IDS]).toEqual(
      [
        "circuit.parallel_resistors",
        "circuit.series_parallel_mixed",
        "circuit.series_resistors",
        "graph.waveform_sine",
        "instrument.measurement_connection",
        "magnetic.field_conductor_direction",
        "motor.force_field_current",
        "mechanical.lever_arrangement",
        "mechanical.gear_mesh",
        "mechanical.pulley_arrangement",
        "mechanical.resistivity_dimensions",
        "magnetic.pole_interaction",
        "magnetic.flux_field_lines",
        "emf.motional_emf_geometry",
        "generator.rotating_loop",
        "electronics.component_symbol_card",
        "electronics.rectification_waveform",
        "electronics.capacitor_transient_curve",
        "electronics.electron_flow_vs_conventional_current",
      ].sort(),
    );
  });

  it("CC-11.11: renders the rectification-waveform diagram for each of the three governed shapes", async () => {
    const rectBlueprint = blueprint({ id: "electronics.rectification_waveform", type: "waveform", parameters: [{ name: "waveform_shape", kind: "enum", allowed: ["half_wave", "full_wave", "inverter"] }] });
    for (const shape of ["half_wave", "full_wave", "inverter"] as const) {
      const { getByLabelText } = await render(
        <DiagramRenderer blueprint={rectBlueprint} diagram={{ blueprintId: "electronics.rectification_waveform", parameters: { waveform_shape: shape }, labels: [] }} />,
      );
      expect(getByLabelText(shape === "half_wave" ? /Half-wave/ : shape === "full_wave" ? /Full-wave/ : /Inverter-synthesised/)).toBeTruthy();
    }
  });

  it("CC-11.11: renders the capacitor-transient diagram for both charge and discharge", async () => {
    const capBlueprint = blueprint({ id: "electronics.capacitor_transient_curve", type: "graph", parameters: [{ name: "transient_mode", kind: "enum", allowed: ["charge", "discharge"] }] });
    const { getByLabelText: getCharge } = await render(
      <DiagramRenderer blueprint={capBlueprint} diagram={{ blueprintId: "electronics.capacitor_transient_curve", parameters: { transient_mode: "charge" }, labels: [] }} />,
    );
    expect(getCharge(/exponential rise/)).toBeTruthy();
    const { getByLabelText: getDischarge } = await render(
      <DiagramRenderer blueprint={capBlueprint} diagram={{ blueprintId: "electronics.capacitor_transient_curve", parameters: { transient_mode: "discharge" }, labels: [] }} />,
    );
    expect(getDischarge(/exponential decay/)).toBeTruthy();
  });

  it("CC-11.11: renders the electron-flow-vs-conventional diagram with both arrows on one wire", async () => {
    const wireBlueprint = blueprint({ id: "electronics.electron_flow_vs_conventional_current", type: "electrical_circuit", parameters: [] });
    const { getByLabelText } = await render(
      <DiagramRenderer blueprint={wireBlueprint} diagram={{ blueprintId: "electronics.electron_flow_vs_conventional_current", parameters: {}, labels: [] }} />,
    );
    expect(getByLabelText(/conventional current flowing from positive to negative.*electron flow.*opposite direction/s)).toBeTruthy();
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

  describe("CC-12B: canonical teaching visual resolution", () => {
    const fieldBlueprint = blueprint({
      id: "magnetic.field_conductor_direction",
      type: "magnetic_field",
      parameters: [{ name: "current_direction", kind: "enum", allowed: ["into_page", "out_of_page"] }],
    });
    const fieldDiagram = { blueprintId: "magnetic.field_conductor_direction", parameters: { current_direction: "into_page" }, labels: [] };

    const motorBlueprint = blueprint({
      id: "motor.force_field_current",
      type: "magnetic_field",
      parameters: [
        { name: "pole_labels", kind: "enum", allowed: ["N_S_horizontal", "N_S_vertical"] },
        { name: "current_direction", kind: "enum", allowed: ["into_page", "out_of_page"] },
      ],
    });
    const motorDiagram = { blueprintId: "motor.force_field_current", parameters: { pole_labels: "N_S_horizontal", current_direction: "into_page" }, labels: [] };

    it("context='teaching' resolves the right-hand-grip blueprint to the governed premium master, not the SVG mnemonic", async () => {
      const { getByLabelText, queryByLabelText } = await render(<DiagramRenderer blueprint={fieldBlueprint} diagram={fieldDiagram} context="teaching" />);
      expect(getByLabelText(/Right-hand grip rule\. A right hand grips/)).toBeTruthy();
      expect(queryByLabelText(/thumb points along the conductor/)).toBeNull();
    });

    it("context='teaching' resolves the motor blueprint to the governed premium master, not the SVG diagram", async () => {
      const { getByLabelText, queryByLabelText } = await render(<DiagramRenderer blueprint={motorBlueprint} diagram={motorDiagram} context="teaching" />);
      expect(getByLabelText(/A current-carrying conductor between a north pole on the left/)).toBeTruthy();
      expect(queryByLabelText(/North pole on the left, south pole on the right\./)).toBeNull();
    });

    it("context='assessment' always uses the SVG diagram, even for a blueprint that has a registered premium teaching master", async () => {
      const { getByLabelText, queryByLabelText } = await render(<DiagramRenderer blueprint={fieldBlueprint} diagram={fieldDiagram} context="assessment" />);
      expect(getByLabelText(/direction the fingers curl.*is not shown/)).toBeTruthy();
      expect(queryByLabelText(/Right-hand grip rule\. A right hand grips/)).toBeNull();
    });

    it("omitting context defaults to the safe 'assessment' behaviour -- never silently resolves to a premium master", async () => {
      const { getByLabelText, queryByLabelText } = await render(<DiagramRenderer blueprint={fieldBlueprint} diagram={fieldDiagram} />);
      expect(getByLabelText(/direction the fingers curl.*is not shown/)).toBeTruthy();
      expect(queryByLabelText(/Right-hand grip rule\. A right hand grips/)).toBeNull();
    });

    it("context='teaching' for a blueprint with no registered premium master falls back to the SVG diagram unchanged", async () => {
      const { getByLabelText } = await render(
        <DiagramRenderer
          blueprint={SERIES_BLUEPRINT}
          diagram={{ blueprintId: "circuit.series_resistors", parameters: { component_count: 2, show_values: false, show_current_arrow: false }, labels: ["R1", "R2"] }}
          context="teaching"
        />,
      );
      expect(getByLabelText(/Series circuit diagram/)).toBeTruthy();
    });

    it("context='teaching' resolves the emf.motional_emf_geometry blueprint to the governed premium master, not the old schematic diagram", async () => {
      const emfBlueprint = blueprint({ id: "emf.motional_emf_geometry", type: "magnetic_field", parameters: [] });
      const emfDiagram = { blueprintId: "emf.motional_emf_geometry", parameters: {}, labels: [] };
      const { getByLabelText } = await render(<DiagramRenderer blueprint={emfBlueprint} diagram={emfDiagram} context="teaching" />);
      expect(getByLabelText(/A conductor of length l moving with velocity v/)).toBeTruthy();
      const svgOnlyRender = await render(<DiagramRenderer blueprint={emfBlueprint} diagram={emfDiagram} context="assessment" />);
      // The SVG MotionalEmfDiagram renders under assessment context -- proves this is a real
      // swap between two different components, not the same markup relabelled.
      expect(svgOnlyRender.queryByLabelText(/A conductor of length l moving with velocity v/)).toBeNull();
    });
  });

  // CC-12C: the mechanical governance tripwire task brief §11.A/§5 asks for --
  // recomputes the SHA-256 of each shipped canonical teaching image at test
  // time and asserts it against CANONICAL_TEACHING_VISUAL_LOCK, which is
  // itself pinned to the highest-numbered audit file with an all-PASS
  // verdict for that asset (see DiagramRenderer.tsx's own header comment
  // for why the canonical-visual-registry.json generated artifact is NOT a
  // safe source of truth to pin against -- CC-12C found it frozen at a
  // stale, superseded version for two of these three assets). A future
  // accidental or malicious swap of any shipped file -- stale, legacy, or
  // simply wrong -- fails this test immediately, rather than shipping
  // silently until a Product Owner happens to notice it on-device.
  describe("CC-12C: canonical asset lock -- shipped files match the approved current master, never a stale/legacy one", () => {
    const SHIPPED_ASSET_PATHS: Readonly<Record<string, string>> = {
      "magnetic.field_conductor_direction": join(__dirname, "../../assets/instructional/unit202/teaching/right-hand-grip-teaching-master-v4.png"),
      "motor.force_field_current": join(__dirname, "../../assets/instructional/unit202/hybrid/motor-effect-horizontal-poles-into-page-teaching-base-v1.png"),
      "emf.motional_emf_geometry": join(__dirname, "../../assets/instructional/unit202/teaching/emf-motional-teaching-master-v3.png"),
    };

    it.each(Object.entries(CANONICAL_TEACHING_VISUAL_LOCK))(
      "%s's shipped file SHA-256 matches its pinned, audit-verified approved master",
      (blueprintId, locked) => {
        const path = SHIPPED_ASSET_PATHS[blueprintId];
        expect(path).toBeDefined();
        const actualSha256 = createHash("sha256").update(readFileSync(path!)).digest("hex");
        expect(actualSha256).toBe(locked.sha256);
      },
    );

    it("locks exactly the three CC-12 magnetism/EMF slice blueprints -- no unpinned canonical entry can exist", () => {
      expect(Object.keys(CANONICAL_TEACHING_VISUAL_LOCK).sort()).toEqual(
        ["emf.motional_emf_geometry", "magnetic.field_conductor_direction", "motor.force_field_current"].sort(),
      );
    });
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

  it("CC-11.3: an explicit override replaces the generic default for the named parameter only, leaving every other parameter at its normal default", () => {
    const instance = buildTeachingDiagramInstance(SERIES_BLUEPRINT, ["R1", "R2", "R3"], { component_count: 4 });
    expect(instance.parameters).toEqual({ component_count: 4, show_values: true, show_current_arrow: true });
  });

  it("CC-11.3: an override naming a parameter the blueprint doesn't declare is ignored, never injected as new state", () => {
    const instance = buildTeachingDiagramInstance(SERIES_BLUEPRINT, [], { not_a_real_parameter: "x" });
    expect(instance.parameters).toEqual({ component_count: 2, show_values: true, show_current_arrow: true });
    expect(instance.parameters).not.toHaveProperty("not_a_real_parameter");
  });
});
