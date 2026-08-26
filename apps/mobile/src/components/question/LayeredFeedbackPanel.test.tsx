import { fireEvent, render } from "@testing-library/react-native";

import { LayeredFeedbackPanel } from "./LayeredFeedbackPanel";

describe("LayeredFeedbackPanel", () => {
  it("shows the Quick layer content unconditionally, matching FeedbackPanel's own baseline", async () => {
    const { getByText, queryByText } = await render(
      <LayeredFeedbackPanel
        correct={false}
        detail="direction mismatch"
        expectedAnswerText="up"
        explainReasoning={["A current-carrying conductor placed in a magnetic field experiences a mechanical force."]}
        onContinue={() => {}}
      />,
    );
    expect(getByText("Not quite")).toBeTruthy();
    expect(getByText("Correct answer: up")).toBeTruthy();
    expect(getByText("direction mismatch")).toBeTruthy();
    // Explain content is not visible until the learner opens it.
    expect(queryByText(/A current-carrying conductor placed/)).toBeNull();
  });

  it("reveals the Explain layer's real governed reasoning only after the toggle is pressed", async () => {
    const reasoning = "A current-carrying conductor placed in a magnetic field experiences a mechanical force.";
    const { getByLabelText, getByText, queryByText } = await render(
      <LayeredFeedbackPanel correct={false} detail="direction mismatch" expectedAnswerText="up" explainReasoning={[reasoning]} onContinue={() => {}} />,
    );
    expect(queryByText(reasoning)).toBeNull();
    await fireEvent.press(getByLabelText("Explain why"));
    expect(getByText(reasoning)).toBeTruthy();
  });

  it("does not render an Explain toggle when there is no reasoning to show", async () => {
    const { queryByLabelText } = await render(
      <LayeredFeedbackPanel correct detail="exact match" expectedAnswerText="up" explainReasoning={[]} onContinue={() => {}} />,
    );
    expect(queryByLabelText("Explain why")).toBeNull();
  });

  it("reveals the Deeper layer's misconception message and deeperNote only after its own toggle is pressed, never mixed into Quick/Explain", async () => {
    const { getByLabelText, getByText, queryByText } = await render(
      <LayeredFeedbackPanel
        correct={false}
        detail="direction mismatch"
        expectedAnswerText="up"
        explainReasoning={["why text"]}
        misconceptionMessage="This may be related to current-convention confusion -- not certain from a single answer."
        deeperNote="A common related mix-up: mixes up which finger represents Field, Current and Motion."
        onContinue={() => {}}
      />,
    );
    expect(queryByText(/current-convention confusion/)).toBeNull();
    expect(queryByText(/common related mix-up/)).toBeNull();
    await fireEvent.press(getByLabelText("Show my weakness"));
    expect(getByText(/current-convention confusion/)).toBeTruthy();
    expect(getByText(/common related mix-up/)).toBeTruthy();
  });

  it("does not render a Deeper toggle when there is neither a misconception message nor a deeper note", async () => {
    const { queryByLabelText } = await render(
      <LayeredFeedbackPanel correct detail="exact match" expectedAnswerText="up" explainReasoning={["why text"]} onContinue={() => {}} />,
    );
    expect(queryByLabelText("Show my weakness")).toBeNull();
  });

  it("calls onContinue when the continue button is pressed, independent of layer state", async () => {
    const onContinue = jest.fn();
    const { getByLabelText } = await render(
      <LayeredFeedbackPanel correct detail="exact match" expectedAnswerText="up" explainReasoning={[]} onContinue={onContinue} continueLabel="Try again" />,
    );
    await fireEvent.press(getByLabelText("Try again"));
    expect(onContinue).toHaveBeenCalled();
  });
});
