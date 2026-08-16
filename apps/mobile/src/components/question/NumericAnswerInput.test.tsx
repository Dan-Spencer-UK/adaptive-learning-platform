import { fireEvent, render } from "@testing-library/react-native";

import { NumericAnswerInput } from "./NumericAnswerInput";

describe("NumericAnswerInput", () => {
  it("submit is disabled until a valid number is entered, then calls onSubmit with the parsed number", async () => {
    const onSubmit = jest.fn();
    const { getByLabelText } = await render(<NumericAnswerInput unitSymbol="A" onSubmit={onSubmit} />);

    const submitButton = getByLabelText("Submit answer");
    expect(submitButton.props.accessibilityState?.disabled).toBe(true);

    await fireEvent.changeText(getByLabelText("Your answer, in A"), "4");
    expect(submitButton.props.accessibilityState?.disabled).toBe(false);

    await fireEvent.press(submitButton);
    expect(onSubmit).toHaveBeenCalledWith(4);
  });

  it("does not call onSubmit for non-numeric text", async () => {
    const onSubmit = jest.fn();
    const { getByLabelText } = await render(<NumericAnswerInput unitSymbol="V" onSubmit={onSubmit} />);
    await fireEvent.changeText(getByLabelText("Your answer, in V"), "not a number");
    expect(getByLabelText("Submit answer").props.accessibilityState?.disabled).toBe(true);
  });

  it("does not require a decimal point for whole-number answers", async () => {
    const onSubmit = jest.fn();
    const { getByLabelText } = await render(<NumericAnswerInput unitSymbol="Ω" onSubmit={onSubmit} />);
    await fireEvent.changeText(getByLabelText("Your answer, in Ω"), "60");
    await fireEvent.press(getByLabelText("Submit answer"));
    expect(onSubmit).toHaveBeenCalledWith(60);
  });
});
