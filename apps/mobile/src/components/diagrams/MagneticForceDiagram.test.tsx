import { render } from "@testing-library/react-native";

import { MagneticForceDiagram } from "./MagneticForceDiagram";

describe("MagneticForceDiagram", () => {
  it("describes N-left/S-right orientation and current-into-page for N_S_horizontal + into_page", async () => {
    const { getByLabelText } = await render(
      <MagneticForceDiagram diagram={{ blueprintId: "motor.force_field_current", parameters: { pole_labels: "N_S_horizontal", current_direction: "into_page", show_force_arrow: true }, labels: ["conductor"] }} />,
    );
    expect(
      getByLabelText(/North pole on the left, south pole on the right\..*conventional current into the page in the conductor\./),
    ).toBeTruthy();
  });

  it("describes N-top/S-bottom orientation and current-out-of-page for N_S_vertical + out_of_page", async () => {
    const { getByLabelText } = await render(
      <MagneticForceDiagram diagram={{ blueprintId: "motor.force_field_current", parameters: { pole_labels: "N_S_vertical", current_direction: "out_of_page", show_force_arrow: true }, labels: ["conductor"] }} />,
    );
    expect(
      getByLabelText(/North pole at the top, south pole at the bottom\..*conventional current out of the page in the conductor\./),
    ).toBeTruthy();
  });

  it("withholds the force direction from both the visual and its accessibility text when forceDirection is omitted (assessment mode)", async () => {
    const { getByLabelText, queryByText } = await render(
      <MagneticForceDiagram diagram={{ blueprintId: "motor.force_field_current", parameters: { pole_labels: "N_S_horizontal", current_direction: "into_page", show_force_arrow: true }, labels: ["conductor"] }} />,
    );
    expect(getByLabelText(/Force direction not shown\./)).toBeTruthy();
    expect(queryByText(/Force: /)).toBeNull();
  });

  it("reveals the force direction in the accessibility description only when forceDirection is explicitly passed (teaching mode)", async () => {
    const { getByLabelText } = await render(
      <MagneticForceDiagram
        diagram={{ blueprintId: "motor.force_field_current", parameters: { pole_labels: "N_S_horizontal", current_direction: "out_of_page", show_force_arrow: true }, labels: ["conductor"] }}
        forceDirection="up"
      />,
    );
    expect(getByLabelText(/Resulting force on the conductor acts upwards\./)).toBeTruthy();
  });
});
