/**
 * CC-05C: minimal structural screenshot-testing foundation (task brief
 * §23). These are Jest structural snapshots (component tree / prop
 * output via `toJSON()`), not pixel screenshots -- no image-diffing
 * infrastructure (e.g. Detox/Maestro visual regression) exists in this
 * repository yet, so this is deliberately the smallest foundation that
 * catches unintended structural/prop drift in the proving slice's core
 * visuals without overbuilding a pixel-diffing pipeline that isn't set up
 * elsewhere in the project. Every fixture below uses a fixed seed/fixed
 * teaching values, so snapshots are exactly reproducible.
 *
 * True pixel-level visual regression (device-rendered screenshot
 * comparison) remains a deferred item -- see the CC-05C evidence
 * document's "Deferred items" section.
 */
import { render } from "@testing-library/react-native";

import { FormulaEquation } from "@/components/formula/FormulaExpressionView";
import { VirTriangle } from "@/components/mnemonic/VirTriangle";
import { SeriesCircuitDiagram } from "@/components/diagrams/SeriesCircuitDiagram";
import { ParallelCircuitDiagram } from "@/components/diagrams/ParallelCircuitDiagram";
import { MagneticForceDiagram } from "@/components/diagrams/MagneticForceDiagram";
import { RightHandGripRuleDiagram } from "@/components/diagrams/RightHandGripRuleDiagram";
import { FeedbackPanel } from "@/components/question/FeedbackPanel";
import { FORMULA_OHMS_LAW, MNEMONIC_VIR_TRIANGLE } from "@/lib/proving-content/unit202-proving-fixture";

describe("proving-slice visual QA -- structural snapshots", () => {
  it("formula family: Ohm's law V = I x R", async () => {
    const form = FORMULA_OHMS_LAW.forms.find((f) => f.target === "V")!;
    const { toJSON } = await render(<FormulaEquation target="V" expression={form.expression} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it("VIR triangle mnemonic (default, unselected state)", async () => {
    const { toJSON } = await render(<VirTriangle visualAid={MNEMONIC_VIR_TRIANGLE} formulaFamily={FORMULA_OHMS_LAW} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it("series circuit diagram (3 components, symbolic labels)", async () => {
    const { toJSON } = await render(
      <SeriesCircuitDiagram
        diagram={{ blueprintId: "circuit.series_resistors", parameters: { component_count: 3, show_values: false, show_current_arrow: true }, labels: ["R1", "R2", "R3"] }}
      />,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it("parallel circuit diagram (3 branches, symbolic labels)", async () => {
    const { toJSON } = await render(
      <ParallelCircuitDiagram
        diagram={{ blueprintId: "circuit.parallel_resistors", parameters: { branch_count: 3, show_values: false, show_branch_current_arrows: true }, labels: ["R1", "R2", "R3"] }}
      />,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it("right-hand grip rule diagram (field direction revealed, teaching mode)", async () => {
    const { toJSON } = await render(
      <RightHandGripRuleDiagram
        diagram={{ blueprintId: "magnetic.field_conductor_direction", parameters: { current_direction: "into_page", show_field_arrows: true }, labels: ["conductor"] }}
        fieldRotation="clockwise"
      />,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it("directional/magnetic diagram (force revealed, teaching mode)", async () => {
    const { toJSON } = await render(
      <MagneticForceDiagram
        diagram={{ blueprintId: "motor.force_field_current", parameters: { pole_labels: "N_S_horizontal", current_direction: "out_of_page", show_force_arrow: true }, labels: ["conductor"] }}
        forceDirection="up"
      />,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it("feedback -- correct", async () => {
    const { toJSON } = await render(
      <FeedbackPanel correct detail="within tolerance" expectedAnswerText="24 V" onContinue={() => {}} />,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it("feedback -- incorrect", async () => {
    const { toJSON } = await render(
      <FeedbackPanel correct={false} detail="expected 24, got 30" expectedAnswerText="24 V" onContinue={() => {}} />,
    );
    expect(toJSON()).toMatchSnapshot();
  });
});
