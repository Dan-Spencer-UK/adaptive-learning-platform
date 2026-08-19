import { fireEvent, render } from "@testing-library/react-native";

import { MultipleChoiceAnswerInput } from "./MultipleChoiceAnswerInput";

describe("MultipleChoiceAnswerInput", () => {
  const options = [
    { value: "plausible", label: "Plausible" },
    { value: "too_high", label: "Too high" },
    { value: "too_low", label: "Too low" },
  ];

  it("calls onSubmit with the selected option's value", async () => {
    const onSubmit = jest.fn();
    const { getByLabelText } = await render(<MultipleChoiceAnswerInput options={options} onSubmit={onSubmit} />);
    await fireEvent.press(getByLabelText("Too high"));
    expect(onSubmit).toHaveBeenCalledWith("too_high");
  });

  it("renders every option", async () => {
    const { getByLabelText } = await render(<MultipleChoiceAnswerInput options={options} onSubmit={jest.fn()} />);
    expect(getByLabelText("Plausible")).toBeTruthy();
    expect(getByLabelText("Too high")).toBeTruthy();
    expect(getByLabelText("Too low")).toBeTruthy();
  });

  it("does not call onSubmit when disabled", async () => {
    const onSubmit = jest.fn();
    const { getByLabelText } = await render(<MultipleChoiceAnswerInput options={options} onSubmit={onSubmit} disabled />);
    await fireEvent.press(getByLabelText("Plausible"));
    expect(onSubmit).not.toHaveBeenCalled();
  });
});
