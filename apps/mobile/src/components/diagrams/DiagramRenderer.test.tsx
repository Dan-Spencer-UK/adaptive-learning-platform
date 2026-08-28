import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { render } from "@testing-library/react-native";
import type { DiagramBlueprint } from "@alp/content-schema";

import { buildTeachingDiagramInstance, CANONICAL_ASSET_LOCK, DiagramRenderer, SUPPORTED_DIAGRAM_BLUEPRINT_IDS, UnsupportedDiagramBlueprintError } from "./DiagramRenderer";

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
      parameters: [{ name: "current_direction", kind: "enum", allowed: ["into_page", "out_of_page", "left_to_right"] }],
    });
    // "left_to_right" has no registered CC-13 canonical assessment-state entry
    // (see DiagramRenderer.tsx's CANONICAL_ASSESSMENT_VISUALS -- only
    // into_page/out_of_page are covered), so this exercises the plain SVG
    // component's own reveal-prop plumbing directly, undisturbed by CC-13's
    // canonical resolution.
    const diagram = { blueprintId: "magnetic.field_conductor_direction", parameters: { current_direction: "left_to_right" }, labels: [] };

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

    it("context='assessment' uses the SVG diagram for a blueprint with only a teaching-only premium master (no registered assessment-state family)", async () => {
      const poleBlueprint = blueprint({
        id: "magnetic.pole_interaction",
        type: "magnetic_field",
        parameters: [{ name: "pole_pairing", kind: "enum", allowed: ["like_poles_facing", "unlike_poles_facing"] }],
      });
      const poleDiagram = { blueprintId: "magnetic.pole_interaction", parameters: { pole_pairing: "like_poles_facing" }, labels: [] };
      const { queryByLabelText } = await render(<DiagramRenderer blueprint={poleBlueprint} diagram={poleDiagram} context="assessment" />);
      expect(queryByLabelText(/Two bar magnets facing each other across a central gap\. The right-hand pole/)).toBeNull();
    });

    it("omitting context defaults to the safe 'assessment' behaviour -- a blueprint with no registered assessment-state family never silently resolves to a premium master", async () => {
      const poleBlueprint = blueprint({
        id: "magnetic.pole_interaction",
        type: "magnetic_field",
        parameters: [{ name: "pole_pairing", kind: "enum", allowed: ["like_poles_facing", "unlike_poles_facing"] }],
      });
      const poleDiagram = { blueprintId: "magnetic.pole_interaction", parameters: { pole_pairing: "like_poles_facing" }, labels: [] };
      const { queryByLabelText } = await render(<DiagramRenderer blueprint={poleBlueprint} diagram={poleDiagram} />);
      expect(queryByLabelText(/Two bar magnets facing each other across a central gap\. The right-hand pole/)).toBeNull();
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

    it("emf.motional_emf_geometry resolves to the governed premium master in BOTH teaching and assessment context -- context-agnostic, since MotionalEmfDiagram has no reveal-sensitive content to withhold", async () => {
      const emfBlueprint = blueprint({ id: "emf.motional_emf_geometry", type: "magnetic_field", parameters: [] });
      const emfDiagram = { blueprintId: "emf.motional_emf_geometry", parameters: {}, labels: [] };
      const teachingRender = await render(<DiagramRenderer blueprint={emfBlueprint} diagram={emfDiagram} context="teaching" />);
      expect(teachingRender.getByLabelText(/A conductor of length l moving with velocity v/)).toBeTruthy();
      const assessmentRender = await render(<DiagramRenderer blueprint={emfBlueprint} diagram={emfDiagram} context="assessment" />);
      expect(assessmentRender.getByLabelText(/A conductor of length l moving with velocity v/)).toBeTruthy();
    });
  });

  // CC-13: the fix for the defect a Product Owner emulator finding traced
  // live -- guided_interpret_field_direction (magnetic.field_conductor_direction)
  // and guided_interpret_force_direction (motor.force_field_current) both
  // drive a real, randomly-generated DiagramInstance, so context alone was
  // never enough; the actual parameter state must select among several
  // independently-audited withheld/revealed masters.
  describe("CC-13: reveal-sensitive per-parameter-state assessment visuals (the right-hand-grip/motor-effect assessment fix)", () => {
    const fieldBlueprint = blueprint({
      id: "magnetic.field_conductor_direction",
      type: "magnetic_field",
      parameters: [{ name: "current_direction", kind: "enum", allowed: ["into_page", "out_of_page"] }],
    });

    it("assessment context, no reveal: shows the withheld state image for the actual current_direction, never the answer", async () => {
      const diagram = { blueprintId: "magnetic.field_conductor_direction", parameters: { current_direction: "into_page" }, labels: [] };
      const { getByLabelText, queryByLabelText } = await render(<DiagramRenderer blueprint={fieldBlueprint} diagram={diagram} context="assessment" />);
      expect(getByLabelText(/direction it circulates is not shown/)).toBeTruthy();
      expect(queryByLabelText(/circulates clockwise/)).toBeNull();
    });

    it("assessment context, with reveal: shows the revealed state image matching the actual current_direction and the correct field rotation", async () => {
      const diagram = { blueprintId: "magnetic.field_conductor_direction", parameters: { current_direction: "into_page" }, labels: [] };
      const { getByLabelText } = await render(
        <DiagramRenderer blueprint={fieldBlueprint} diagram={diagram} context="assessment" reveal={{ fieldRotation: "clockwise" }} />,
      );
      expect(getByLabelText(/circulates clockwise/)).toBeTruthy();
    });

    it("out_of_page state resolves to its own withheld/revealed pair, not the into_page one", async () => {
      const diagram = { blueprintId: "magnetic.field_conductor_direction", parameters: { current_direction: "out_of_page" }, labels: [] };
      const withheld = await render(<DiagramRenderer blueprint={fieldBlueprint} diagram={diagram} context="assessment" />);
      expect(withheld.getByLabelText(/out of the page.*direction it circulates is not shown/)).toBeTruthy();
      const revealed = await render(<DiagramRenderer blueprint={fieldBlueprint} diagram={diagram} context="assessment" reveal={{ fieldRotation: "counterclockwise" }} />);
      expect(revealed.getByLabelText(/circulates counterclockwise/)).toBeTruthy();
    });

    it("motor.force_field_current: N_S_horizontal assessment states resolve to their own withheld/revealed masters", async () => {
      const motorBlueprint = blueprint({
        id: "motor.force_field_current",
        type: "magnetic_field",
        parameters: [
          { name: "pole_labels", kind: "enum", allowed: ["N_S_horizontal", "N_S_vertical"] },
          { name: "current_direction", kind: "enum", allowed: ["into_page", "out_of_page"] },
        ],
      });
      const diagram = { blueprintId: "motor.force_field_current", parameters: { pole_labels: "N_S_horizontal", current_direction: "into_page" }, labels: [] };
      const withheld = await render(<DiagramRenderer blueprint={motorBlueprint} diagram={diagram} context="assessment" />);
      expect(withheld.getByLabelText(/resulting force on the conductor is not shown/)).toBeTruthy();
      const revealed = await render(<DiagramRenderer blueprint={motorBlueprint} diagram={diagram} context="assessment" reveal={{ forceDirection: "down" }} />);
      expect(revealed.getByLabelText(/shown acting downward/)).toBeTruthy();
    });

    it("motor.force_field_current: N_S_vertical states are NOT wired -- a known content defect in that asset family's audit trail (see DiagramRenderer.tsx header comment) -- and fall through to the verified-correct SVG", async () => {
      const motorBlueprint = blueprint({
        id: "motor.force_field_current",
        type: "magnetic_field",
        parameters: [
          { name: "pole_labels", kind: "enum", allowed: ["N_S_horizontal", "N_S_vertical"] },
          { name: "current_direction", kind: "enum", allowed: ["into_page", "out_of_page"] },
        ],
      });
      const diagram = { blueprintId: "motor.force_field_current", parameters: { pole_labels: "N_S_vertical", current_direction: "into_page" }, labels: [] };
      const { getByLabelText } = await render(<DiagramRenderer blueprint={motorBlueprint} diagram={diagram} context="assessment" reveal={{ forceDirection: "left" }} />);
      // The SVG MagneticForceDiagram's own accessibility label -- proves this fell through to SVG, not a mis-keyed canonical entry.
      expect(getByLabelText(/North pole at the top, south pole at the bottom/)).toBeTruthy();
    });
  });

  // CC-13: context-agnostic per-parameter-state visuals for blueprints
  // whose SVG has no reveal semantics at all (levers/gears/pulleys/
  // generator) -- same picture, safe in either context.
  describe("CC-13: context-agnostic per-parameter-state visuals (levers, gears, pulleys, generator)", () => {
    it("mechanical.gear_mesh resolves per size_ratio in both contexts", async () => {
      const gearBlueprint = blueprint({ id: "mechanical.gear_mesh", type: "mechanical", parameters: [{ name: "size_ratio", kind: "enum", allowed: ["driven_larger", "driven_smaller", "equal"] }] });
      const diagram = { blueprintId: "mechanical.gear_mesh", parameters: { size_ratio: "driven_smaller" }, labels: [] };
      const teaching = await render(<DiagramRenderer blueprint={gearBlueprint} diagram={diagram} context="teaching" />);
      expect(teaching.getByLabelText(/smaller than the driver gear/)).toBeTruthy();
      const assessment = await render(<DiagramRenderer blueprint={gearBlueprint} diagram={diagram} context="assessment" />);
      expect(assessment.getByLabelText(/smaller than the driver gear/)).toBeTruthy();
    });

    it("mechanical.pulley_arrangement resolves per arrangement", async () => {
      const pulleyBlueprint = blueprint({ id: "mechanical.pulley_arrangement", type: "mechanical", parameters: [{ name: "arrangement", kind: "enum", allowed: ["fixed", "movable"] }] });
      const diagram = { blueprintId: "mechanical.pulley_arrangement", parameters: { arrangement: "movable" }, labels: [] };
      const { getByLabelText } = await render(<DiagramRenderer blueprint={pulleyBlueprint} diagram={diagram} context="assessment" />);
      expect(getByLabelText(/mechanical advantage of approximately 2/)).toBeTruthy();
    });

    it("generator.rotating_loop resolves per rotation_phase", async () => {
      const generatorBlueprint = blueprint({ id: "generator.rotating_loop", type: "magnetic_field", parameters: [{ name: "rotation_phase", kind: "enum", allowed: ["vertical", "horizontal"] }] });
      const diagram = { blueprintId: "generator.rotating_loop", parameters: { rotation_phase: "horizontal" }, labels: [] };
      const { getByLabelText } = await render(<DiagramRenderer blueprint={generatorBlueprint} diagram={diagram} context="teaching" />);
      expect(getByLabelText(/momentarily not cutting flux lines/)).toBeTruthy();
    });

    it("mechanical.lever_arrangement resolves per lever_class when show_distances is not set", async () => {
      const leverBlueprint = blueprint({
        id: "mechanical.lever_arrangement",
        type: "mechanical",
        parameters: [
          { name: "lever_class", kind: "enum", allowed: ["class_1", "class_2", "class_3"] },
          { name: "show_distances", kind: "boolean" },
        ],
      });
      const diagram = { blueprintId: "mechanical.lever_arrangement", parameters: { lever_class: "class_2" }, labels: [] };
      const { getByLabelText } = await render(<DiagramRenderer blueprint={leverBlueprint} diagram={diagram} context="assessment" />);
      expect(getByLabelText(/Class II lever with the load positioned between/)).toBeTruthy();
    });

    it("mechanical.lever_arrangement falls through to the SVG diagram when show_distances is true -- the premium master never depicts the distance-bracket overlay the calculation steps need", async () => {
      const leverBlueprint = blueprint({
        id: "mechanical.lever_arrangement",
        type: "mechanical",
        parameters: [
          { name: "lever_class", kind: "enum", allowed: ["class_1", "class_2", "class_3"] },
          { name: "show_distances", kind: "boolean" },
        ],
      });
      const diagram = { blueprintId: "mechanical.lever_arrangement", parameters: { lever_class: "class_2", show_distances: true }, labels: [] };
      const { getByLabelText, queryByLabelText } = await render(<DiagramRenderer blueprint={leverBlueprint} diagram={diagram} context="assessment" />);
      expect(getByLabelText(/effort arm, de, measured from the pivot/)).toBeTruthy();
      expect(queryByLabelText(/Class II lever with the load positioned between/)).toBeNull();
    });
  });

  // CC-12C/CC-13: the mechanical governance tripwire task brief §11.A/§5
  // asks for -- recomputes the SHA-256 of each shipped canonical visual at
  // test time and asserts it against CANONICAL_ASSET_LOCK, which is itself
  // pinned to the highest-numbered audit file with an all-PASS verdict for
  // that asset (see DiagramRenderer.tsx's own header comment for why the
  // canonical-visual-registry.json generated artifact is NOT a safe source
  // of truth to pin against -- CC-12C found it frozen at a stale,
  // superseded version for two assets). A future accidental or malicious
  // swap of any shipped file -- stale, legacy, or simply wrong -- fails
  // this test immediately, rather than shipping silently until a Product
  // Owner happens to notice it on-device.
  describe("CC-12C/CC-13: canonical asset lock -- shipped files match the approved current master, never a stale/legacy one", () => {
    it.each(CANONICAL_ASSET_LOCK)("$canonicalAssetId's shipped file SHA-256 matches its pinned, audit-verified approved master", (locked) => {
      const path = join(__dirname, "../../assets/instructional/unit202", locked.shippedAssetRelativePath);
      const actualSha256 = createHash("sha256").update(readFileSync(path)).digest("hex");
      expect(actualSha256).toBe(locked.sha256);
    });

    it("locks exactly the 21 shipped Unit 202 canonical visuals -- no unpinned entry can exist", () => {
      expect(CANONICAL_ASSET_LOCK.length).toBe(21);
      expect(new Set(CANONICAL_ASSET_LOCK.map((entry) => entry.canonicalAssetId)).size).toBe(21);
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
