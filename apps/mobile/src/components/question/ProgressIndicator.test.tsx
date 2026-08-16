import { render } from "@testing-library/react-native";

import { ProgressIndicator } from "./ProgressIndicator";

describe("ProgressIndicator", () => {
  it("exposes current/total via accessibility value and label", async () => {
    const { getByLabelText } = await render(<ProgressIndicator current={2} total={5} />);
    const bar = getByLabelText("Question 2 of 5");
    expect(bar.props.accessibilityValue).toEqual({ min: 0, max: 5, now: 2 });
  });
});
