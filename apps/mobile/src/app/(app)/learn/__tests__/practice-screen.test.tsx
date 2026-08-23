/**
 * CC-05C: Tier 3 integration test for the practice loop -- the strongest
 * single proof that the full path (governed family -> representation ->
 * question blueprint -> deterministic instance -> native interaction ->
 * marking -> evidence) works inside the actual app, not just at the
 * library layer (proving-engine.test.ts already covers that layer in
 * isolation). Runs against the same in-memory SQLite mock
 * lib/storage/__mocks__/expo-sqlite-jest-mock.ts already used by
 * outbox.test.ts/db.test.ts/session-store.test.ts.
 *
 * `Date.now()` is mocked to a fixed value so the session's seed
 * derivation (see session-store.ts's `deriveQueueSeed`) is predictable --
 * this test independently generates the same instance the screen will,
 * to know the correct answer in advance, without duplicating any
 * marking/physics logic.
 */
import { fireEvent, render } from "@testing-library/react-native";
import { Text as MockText } from "react-native";

import * as mockExpoSqlite from "@/lib/storage/__mocks__/expo-sqlite-jest-mock";
import { resetFoundationDbHandleForTests } from "@/lib/storage/db";
import { generateProvingQuestion } from "@/lib/proving-engine/proving-engine";
import { deriveQueueSeed, listProvingEvidence } from "@/lib/proving-session/session-store";

jest.mock("expo-sqlite", () => mockExpoSqlite);
jest.mock("expo-haptics", () => ({
  notificationAsync: jest.fn(),
  NotificationFeedbackType: { Success: "success", Error: "error" },
}));

let mockFamilyId = "electrical.ohms_law";

jest.mock("expo-router", () => ({
  useLocalSearchParams: () => ({ family: mockFamilyId }),
  // Mirrors real Link behaviour closely enough for this test: a bare
  // string child (no `asChild`) renders as text, an element child (the
  // `asChild` pattern) renders as-is.
  Link: ({ children, ...props }: { children: React.ReactNode }) =>
    typeof children === "string" ? <MockText {...props}>{children}</MockText> : children,
}));

import PracticeScreen from "../[family]/practice";

const FIXED_NOW = 1_700_000_000_000;

describe("PracticeScreen", () => {
  beforeEach(() => {
    resetFoundationDbHandleForTests();
    jest.spyOn(Date, "now").mockReturnValue(FIXED_NOW);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("Ohm's law: submitting the correct answer to the first question shows correct feedback and records local evidence", async () => {
    mockFamilyId = "electrical.ohms_law";
    const firstSeed = deriveQueueSeed(FIXED_NOW, 0);
    // The first blueprint in OHMS_LAW_FAMILY.questionBlueprints is solve_for_voltage.
    const expectedInstance = generateProvingQuestion({
      familyId: "electrical.ohms_law",
      blueprintId: "ohms_law.solve_for_voltage",
      seed: firstSeed,
    });

    const { getByLabelText, findByText } = await render(<PracticeScreen />);
    await findByText("Solve for voltage given current and resistance");

    await fireEvent.changeText(getByLabelText(/Your answer, in/), String(expectedInstance.expected.value));
    await fireEvent.press(getByLabelText("Submit answer"));

    await findByText("Correct");

    const evidence = await listProvingEvidence();
    expect(evidence).toHaveLength(1);
    expect(evidence[0]!.evidence.correct).toBe(true);
    expect(evidence[0]!.evidence.assertionFamilyId).toBe("electrical.ohms_law");
    expect(evidence[0]!.evidence.questionBlueprintId).toBe("ohms_law.solve_for_voltage");
  });

  it("Ohm's law: an incorrect answer shows the correct value and a generic (non-misconception) evaluation, then Next question advances", async () => {
    mockFamilyId = "electrical.ohms_law";
    const firstSeed = deriveQueueSeed(FIXED_NOW, 0);
    const expectedInstance = generateProvingQuestion({
      familyId: "electrical.ohms_law",
      blueprintId: "ohms_law.solve_for_voltage",
      seed: firstSeed,
    });

    const { getByLabelText, findByText, findByLabelText, queryByText } = await render(<PracticeScreen />);
    await findByText("Solve for voltage given current and resistance");

    const wrongValue = (expectedInstance.expected.value as number) + 1000;
    await fireEvent.changeText(getByLabelText(/Your answer, in/), String(wrongValue));
    await fireEvent.press(getByLabelText("Submit answer"));

    await findByText("Not quite");
    expect(queryByText(`Correct answer: ${expectedInstance.expected.value} V`)).toBeTruthy();

    await fireEvent.press(getByLabelText("Next question"));
    await findByLabelText("Question 2 of 3");
  });

  it("magnetism: the right-hand-grip-rule (field direction) question uses the rotation answer input and shows the correct prompt", async () => {
    mockFamilyId = "electrical.magnetism_and_electromagnetism";
    const firstSeed = deriveQueueSeed(FIXED_NOW, 0);
    const expectedInstance = generateProvingQuestion({
      familyId: "electrical.magnetism_and_electromagnetism",
      blueprintId: "magnetism.interpret_field_direction",
      seed: firstSeed,
    });
    const correctLabelMap: Record<string, string> = {
      clockwise: "Field direction: Clockwise",
      counterclockwise: "Field direction: Counterclockwise",
    };

    const { getByLabelText, findByText } = await render(<PracticeScreen />);
    await findByText("Interpret the direction of the magnetic field produced by a current-carrying conductor");
    // CC-11: the blueprint now carries governed presentation.promptLines,
    // so the screen resolves via resolvePromptLines() (real corpus copy)
    // instead of the legacy prompt-text.ts fallback it used previously.
    await findByText("A straight conductor carries current as shown. In which direction does the magnetic field circulate around it?");

    await fireEvent.press(getByLabelText(correctLabelMap[expectedInstance.expected.value as string]!));
    await findByText("Correct");
  });

  it("magnetism: an incorrect force-direction answer surfaces the hedged, suggestive-strength misconception message", async () => {
    mockFamilyId = "electrical.magnetism_and_electromagnetism";
    const firstSeed = deriveQueueSeed(FIXED_NOW, 0);
    const fieldInstance = generateProvingQuestion({
      familyId: "electrical.magnetism_and_electromagnetism",
      blueprintId: "magnetism.interpret_field_direction",
      seed: firstSeed,
    });
    const secondSeed = deriveQueueSeed(FIXED_NOW, 1);
    const forceInstance = generateProvingQuestion({
      familyId: "electrical.magnetism_and_electromagnetism",
      blueprintId: "magnetism.interpret_force_direction",
      seed: secondSeed,
    });
    const correctDirection = forceInstance.expected.value as string;
    const wrongDirectionLabel = (
      [
        ["up", "Force acts Up"],
        ["down", "Force acts Down"],
        ["left", "Force acts Left"],
        ["right", "Force acts Right"],
      ] as const
    ).find(([direction]) => direction !== correctDirection)![1];
    const fieldCorrectLabel = fieldInstance.expected.value === "clockwise" ? "Field direction: Clockwise" : "Field direction: Counterclockwise";

    const { getByLabelText, findByText, getByText } = await render(<PracticeScreen />);

    // Answer question 1 (field direction) correctly to advance to question 2 (force direction).
    await findByText("Interpret the direction of the magnetic field produced by a current-carrying conductor");
    await fireEvent.press(getByLabelText(fieldCorrectLabel));
    await findByText("Correct");
    await fireEvent.press(getByLabelText("Next question"));

    await findByText("Interpret the direction of the force on a current-carrying conductor in a magnetic field");
    await fireEvent.press(getByLabelText(wrongDirectionLabel));
    await findByText("Not quite");

    expect(getByText(/may be related to a possible misunderstanding -- not certain from a single answer\./)).toBeTruthy();
  });

  it("completing the full magnetism queue (grip rule then motor principle) shows the session summary with a correct/total score", async () => {
    mockFamilyId = "electrical.magnetism_and_electromagnetism";
    const firstSeed = deriveQueueSeed(FIXED_NOW, 0);
    const fieldInstance = generateProvingQuestion({
      familyId: "electrical.magnetism_and_electromagnetism",
      blueprintId: "magnetism.interpret_field_direction",
      seed: firstSeed,
    });
    const secondSeed = deriveQueueSeed(FIXED_NOW, 1);
    const forceInstance = generateProvingQuestion({
      familyId: "electrical.magnetism_and_electromagnetism",
      blueprintId: "magnetism.interpret_force_direction",
      seed: secondSeed,
    });
    const rotationLabelMap: Record<string, string> = {
      clockwise: "Field direction: Clockwise",
      counterclockwise: "Field direction: Counterclockwise",
    };
    const directionLabelMap: Record<string, string> = {
      up: "Force acts Up",
      down: "Force acts Down",
      left: "Force acts Left",
      right: "Force acts Right",
    };

    const { getByLabelText, findByText, findByLabelText } = await render(<PracticeScreen />);
    await findByLabelText("Question 1 of 2");

    await fireEvent.press(getByLabelText(rotationLabelMap[fieldInstance.expected.value as string]!));
    await findByText("Correct");
    await fireEvent.press(getByLabelText("Next question"));

    await findByLabelText("Question 2 of 2");
    await fireEvent.press(getByLabelText(directionLabelMap[forceInstance.expected.value as string]!));
    await findByText("Correct");

    await fireEvent.press(getByLabelText("Finish"));
    await findByText("Session complete");
    await findByText("2 / 2 correct");
  });
});
