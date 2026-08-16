import { render } from "@testing-library/react-native";

import { buildTeachingWorkedExample } from "@/lib/formula-rendering/build-worked-example";
import {
  FORMULA_OHMS_LAW,
  WORKED_OHMS_LAW_SOLVE_CURRENT,
} from "@/lib/proving-content/unit202-proving-fixture";
import { WorkedSubstitution } from "./WorkedSubstitution";

describe("WorkedSubstitution", () => {
  it("renders the deterministic I = V / R -> I = 24 / 6 -> I = 4 A sequence from real engine-computed data", async () => {
    const instance = buildTeachingWorkedExample(FORMULA_OHMS_LAW, WORKED_OHMS_LAW_SOLVE_CURRENT, { V: 24, R: 6 });
    const { getByLabelText, getByText } = await render(
      <WorkedSubstitution formulaFamily={FORMULA_OHMS_LAW} instance={instance} />,
    );

    // show_formula (symbolic)
    expect(getByLabelText("I equals V divided by R")).toBeTruthy();
    // substitute_values/calculate (numeric)
    expect(getByLabelText("I equals 24 divided by 6")).toBeTruthy();
    // show_answer_with_unit
    expect(getByLabelText("I equals 4 A")).toBeTruthy();
    expect(getByText("I = 4 A")).toBeTruthy();
  });

  it("shows the canonical form as a rearrangement note when the worked example's steps include show_rearrangement", async () => {
    const instance = buildTeachingWorkedExample(FORMULA_OHMS_LAW, WORKED_OHMS_LAW_SOLVE_CURRENT, { V: 24, R: 6 });
    const { getByText } = await render(<WorkedSubstitution formulaFamily={FORMULA_OHMS_LAW} instance={instance} />);
    expect(getByText("Rearranged from the canonical form:")).toBeTruthy();
  });
});
