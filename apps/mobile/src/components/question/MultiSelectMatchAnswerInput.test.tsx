import { fireEvent, render } from "@testing-library/react-native";

import { MultiSelectMatchAnswerInput, type MatchRow } from "./MultiSelectMatchAnswerInput";

const ROWS: readonly MatchRow[] = [
  {
    key: "V",
    prompt: "voltage",
    choices: [
      { value: "V", label: "V" },
      { value: "A", label: "A" },
      { value: "Ω", label: "Ω" },
    ],
    encode: (v) => `V:${v}`,
  },
  {
    key: "I",
    prompt: "current",
    choices: [
      { value: "V", label: "V" },
      { value: "A", label: "A" },
      { value: "Ω", label: "Ω" },
    ],
    encode: (v) => `I:${v}`,
  },
];

describe("MultiSelectMatchAnswerInput", () => {
  it("submit is disabled until every row has a choice picked", async () => {
    const onSubmit = jest.fn();
    const { getByLabelText } = await render(<MultiSelectMatchAnswerInput rows={ROWS} onSubmit={onSubmit} />);

    expect(getByLabelText("Submit answer").props.accessibilityState?.disabled).toBe(true);

    await fireEvent.press(getByLabelText("voltage: V"));
    expect(getByLabelText("Submit answer").props.accessibilityState?.disabled).toBe(true);

    await fireEvent.press(getByLabelText("current: A"));
    expect(getByLabelText("Submit answer").props.accessibilityState?.disabled).toBe(false);
  });

  it("submits the encoded value for each row's chosen option", async () => {
    const onSubmit = jest.fn();
    const { getByLabelText } = await render(<MultiSelectMatchAnswerInput rows={ROWS} onSubmit={onSubmit} />);

    await fireEvent.press(getByLabelText("voltage: V"));
    await fireEvent.press(getByLabelText("current: A"));
    await fireEvent.press(getByLabelText("Submit answer"));

    expect(onSubmit).toHaveBeenCalledWith(["V:V", "I:A"]);
  });

  it("re-picking a row's choice replaces the earlier selection rather than adding to it", async () => {
    const onSubmit = jest.fn();
    const { getByLabelText } = await render(<MultiSelectMatchAnswerInput rows={ROWS} onSubmit={onSubmit} />);

    await fireEvent.press(getByLabelText("voltage: V"));
    await fireEvent.press(getByLabelText("voltage: A"));
    await fireEvent.press(getByLabelText("current: Ω"));
    await fireEvent.press(getByLabelText("Submit answer"));

    expect(onSubmit).toHaveBeenCalledWith(["V:A", "I:Ω"]);
  });
});
