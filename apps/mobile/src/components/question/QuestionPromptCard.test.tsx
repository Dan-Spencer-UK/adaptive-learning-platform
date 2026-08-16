import { render } from "@testing-library/react-native";
import { Text } from "react-native";

import { QuestionPromptCard } from "./QuestionPromptCard";

describe("QuestionPromptCard", () => {
  it("renders the title as a header and each parameter line", async () => {
    const { getByText } = await render(
      <QuestionPromptCard title="Solve for voltage" parameterLines={["I = 4 A", "R = 6 Ω"]} />,
    );
    expect(getByText("Solve for voltage")).toBeTruthy();
    expect(getByText("I = 4 A")).toBeTruthy();
    expect(getByText("R = 6 Ω")).toBeTruthy();
  });

  it("renders representation children when supplied", async () => {
    const { getByText } = await render(
      <QuestionPromptCard title="Series total">
        <Text>diagram-placeholder</Text>
      </QuestionPromptCard>,
    );
    expect(getByText("diagram-placeholder")).toBeTruthy();
  });
});
