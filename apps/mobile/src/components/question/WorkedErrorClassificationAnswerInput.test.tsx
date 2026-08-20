import { fireEvent, render } from "@testing-library/react-native";

import { WorkedErrorClassificationAnswerInput } from "./WorkedErrorClassificationAnswerInput";

const OPTIONS = [
  { value: "wrong_operation", label: "Used the wrong operation (multiplied instead of divided, or vice versa)" },
  { value: "no_error", label: "The working shown is actually correct" },
];

describe("WorkedErrorClassificationAnswerInput", () => {
  it("renders the shown-working lines it is given", async () => {
    const { getByText } = await render(
      <WorkedErrorClassificationAnswerInput shownWorkingLines={["I = V x R", "I = 12 x 4 = 48 A"]} options={OPTIONS} onSubmit={jest.fn()} />,
    );
    expect(getByText("I = V x R")).toBeTruthy();
    expect(getByText("I = 12 x 4 = 48 A")).toBeTruthy();
  });

  it("calls onSubmit with the classification value for the tapped option", async () => {
    const onSubmit = jest.fn();
    const { getByLabelText } = await render(<WorkedErrorClassificationAnswerInput shownWorkingLines={["I = V x R"]} options={OPTIONS} onSubmit={onSubmit} />);
    await fireEvent.press(getByLabelText("Used the wrong operation (multiplied instead of divided, or vice versa)"));
    expect(onSubmit).toHaveBeenCalledWith("wrong_operation");
  });

  it("does not call onSubmit when disabled", async () => {
    const onSubmit = jest.fn();
    const { getByLabelText } = await render(
      <WorkedErrorClassificationAnswerInput shownWorkingLines={["I = V x R"]} options={OPTIONS} onSubmit={onSubmit} disabled />,
    );
    await fireEvent.press(getByLabelText("The working shown is actually correct"));
    expect(onSubmit).not.toHaveBeenCalled();
  });
});
