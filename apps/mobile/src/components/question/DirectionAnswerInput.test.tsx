import { fireEvent, render } from "@testing-library/react-native";

import { DirectionAnswerInput } from "./DirectionAnswerInput";

describe("DirectionAnswerInput", () => {
  it("calls onSubmit with the pressed direction, and each button's meaning is conveyed by text as well as glyph", async () => {
    const onSubmit = jest.fn();
    const { getByLabelText } = await render(<DirectionAnswerInput onSubmit={onSubmit} />);

    expect(getByLabelText("Force acts Up")).toBeTruthy();
    expect(getByLabelText("Force acts Down")).toBeTruthy();
    expect(getByLabelText("Force acts Left")).toBeTruthy();
    expect(getByLabelText("Force acts Right")).toBeTruthy();

    await fireEvent.press(getByLabelText("Force acts Right"));
    expect(onSubmit).toHaveBeenCalledWith("right");
  });

  it("is fully disabled when disabled is passed", async () => {
    const onSubmit = jest.fn();
    const { getByLabelText } = await render(<DirectionAnswerInput onSubmit={onSubmit} disabled />);
    await fireEvent.press(getByLabelText("Force acts Up"));
    expect(onSubmit).not.toHaveBeenCalled();
  });
});
