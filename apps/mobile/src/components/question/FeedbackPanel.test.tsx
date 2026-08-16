import { fireEvent, render } from "@testing-library/react-native";

import { FeedbackPanel } from "./FeedbackPanel";

describe("FeedbackPanel", () => {
  it("shows a correct state without the expected-answer line and calls onContinue when pressed", async () => {
    const onContinue = jest.fn();
    const { getByText, queryByText } = await render(
      <FeedbackPanel correct detail="exact numeric match" expectedAnswerText="4 A" onContinue={onContinue} />,
    );
    expect(getByText("Correct")).toBeTruthy();
    expect(queryByText(/Correct answer:/)).toBeNull();
    await fireEvent.press(getByText("Continue"));
    expect(onContinue).toHaveBeenCalled();
  });

  it("shows the correct answer and detail when incorrect", async () => {
    const { getByText } = await render(
      <FeedbackPanel correct={false} detail="expected 4, got 5" expectedAnswerText="4 A" onContinue={() => {}} />,
    );
    expect(getByText("Not quite")).toBeTruthy();
    expect(getByText("Correct answer: 4 A")).toBeTruthy();
    expect(getByText("expected 4, got 5")).toBeTruthy();
  });

  it("hedges a suggestive-strength misconception message rather than stating it as certain", async () => {
    const { getByText } = await render(
      <FeedbackPanel
        correct={false}
        detail="direction mismatch"
        expectedAnswerText="up"
        misconceptionMessage="This may be related to a possible misunderstanding -- not certain from a single answer."
        onContinue={() => {}}
      />,
    );
    expect(getByText(/may be related to a possible misunderstanding/)).toBeTruthy();
  });

  it("uses a custom continue label when supplied", async () => {
    const { getByText } = await render(
      <FeedbackPanel correct detail="exact match" expectedAnswerText="up" onContinue={() => {}} continueLabel="Finish" />,
    );
    expect(getByText("Finish")).toBeTruthy();
  });
});
