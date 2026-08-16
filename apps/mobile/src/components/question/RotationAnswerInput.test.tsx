import { fireEvent, render } from "@testing-library/react-native";

import { RotationAnswerInput } from "./RotationAnswerInput";

describe("RotationAnswerInput", () => {
  it("calls onSubmit with the pressed rotation, and each option is conveyed by text as well as glyph", async () => {
    const onSubmit = jest.fn();
    const { getByLabelText } = await render(<RotationAnswerInput onSubmit={onSubmit} />);

    expect(getByLabelText("Field direction: Clockwise")).toBeTruthy();
    expect(getByLabelText("Field direction: Counterclockwise")).toBeTruthy();

    await fireEvent.press(getByLabelText("Field direction: Clockwise"));
    expect(onSubmit).toHaveBeenCalledWith("clockwise");
  });

  it("is fully disabled when disabled is passed", async () => {
    const onSubmit = jest.fn();
    const { getByLabelText } = await render(<RotationAnswerInput onSubmit={onSubmit} disabled />);
    await fireEvent.press(getByLabelText("Field direction: Clockwise"));
    expect(onSubmit).not.toHaveBeenCalled();
  });
});
