/**
 * Tier-3 integration test proving the real Ohm's Law wrong-operation
 * misconception branch interactively through the actual Lesson Player
 * screen (task brief §20: "Prove at least one of these REAL branches
 * interactively"). Kept in its own file/test suite (rather than
 * alongside lesson-player-screen.test.tsx's other scenarios) so this
 * long, many-step sequential flow gets a clean render lifecycle with no
 * risk of cross-test interaction from unrelated scenarios in the same
 * describe block.
 *
 * Every `fireEvent` call is awaited (see lesson-player-screen.test.tsx's
 * header comment for why).
 */
import { fireEvent, render, waitFor } from "@testing-library/react-native";

import * as mockExpoSqlite from "@/lib/storage/__mocks__/expo-sqlite-jest-mock";
import { resetFoundationDbHandleForTests } from "@/lib/storage/db";
import { generateLessonQuestion } from "@/lib/lesson-content/generate-lesson-question";
import { getActiveLessonInstanceId } from "@/lib/lesson-session/lesson-session-store";

jest.mock("expo-sqlite", () => mockExpoSqlite);
jest.mock("expo-haptics", () => ({
  selectionAsync: jest.fn(),
  impactAsync: jest.fn(),
  notificationAsync: jest.fn(),
  ImpactFeedbackStyle: { Light: "light" },
  NotificationFeedbackType: { Success: "success", Error: "error" },
}));
jest.mock("expo-router", () => ({
  Link: ({ children }: { children: React.ReactNode }) => children,
}));
jest.mock("@/lib/auth/session-context", () => ({
  useSession: () => ({ session: { user: { id: "learner.test" } }, isLoading: false, requestOtp: jest.fn(), verifyOtp: jest.fn(), signOut: jest.fn() }),
}));

import LessonPlayerScreen from "../lesson-player";

const WAIT_OPTS = { timeout: 5000 };

async function advanceTo(screen: Awaited<ReturnType<typeof render>>, nextSectionLabel: string): Promise<void> {
  const button = await screen.findByLabelText("Continue", {}, WAIT_OPTS);
  await fireEvent.press(button);
  await waitFor(() => expect(screen.getByText(nextSectionLabel)).toBeTruthy(), WAIT_OPTS);
}

async function submitAndAwaitFeedback(screen: Awaited<ReturnType<typeof render>>): Promise<void> {
  await fireEvent.press(screen.getByLabelText("Submit answer"));
  await waitFor(() => expect(screen.getByLabelText(/^(Correct\.|Not quite\.)/)).toBeTruthy(), WAIT_OPTS);
}

describe("LessonPlayerScreen -- real governed misconception branch", () => {
  beforeEach(() => {
    resetFoundationDbHandleForTests();
  });

  it(
    "routes the real wrong-operation misconception branch to remediation, and remediation clears back to the transfer step",
    async () => {
      const screen = await render(<LessonPlayerScreen />);

      await advanceTo(screen, "Try it"); // orientation -> activate_prior_knowledge
      await advanceTo(screen, "Concept"); // -> introduce_relationship
      await advanceTo(screen, "How it works"); // -> formula_and_mnemonic_representation
      await advanceTo(screen, "Try it"); // -> interpret_variables_and_units

      await fireEvent.press(screen.getByLabelText("V (voltage): V"));
      await fireEvent.press(screen.getByLabelText("I (current): A"));
      await fireEvent.press(screen.getByLabelText("R (resistance): Ω"));
      await submitAndAwaitFeedback(screen);
      expect(screen.getByLabelText(/^Correct\./)).toBeTruthy();

      await advanceTo(screen, "Worked example"); // -> worked_example_solve_voltage
      await advanceTo(screen, "Try it"); // -> guided_calculation_current (graded, quantity)

      const activeId = (await getActiveLessonInstanceId())!;
      const currentInstance = generateLessonQuestion({ blueprintId: "ohms_law.solve_for_current", instanceId: activeId, stepId: "guided_calculation_current" });
      await fireEvent.changeText(screen.getByLabelText("Your answer, in A"), String(currentInstance.expected.value));
      await submitAndAwaitFeedback(screen);
      expect(screen.getByLabelText(/^Correct\./)).toBeTruthy();

      await advanceTo(screen, "Check your understanding"); // -> misconception_check_wrong_operation

      // Submit a deliberately WRONG classification -- any incorrect answer here evidences the real governed misconception.
      await fireEvent.press(screen.getByLabelText("The working shown is actually correct"));
      await waitFor(() => expect(screen.getByLabelText(/^Not quite\./)).toBeTruthy(), WAIT_OPTS);
      expect(screen.getByText(/wrong operation was used/i)).toBeTruthy();

      // The branch must land on the real governed remediation step, not the next linear step.
      await advanceTo(screen, "Let's revisit this");

      // Clear remediation with a correct answer -- must resume at the governed destination (plausibility_check_transfer), not the step that would naturally follow remediation in list order.
      const remediationInstance = generateLessonQuestion({ blueprintId: "ohms_law.solve_for_resistance", instanceId: activeId, stepId: "remediation_rearrangement" });
      await fireEvent.changeText(screen.getByLabelText("Your answer, in Ω"), String(remediationInstance.expected.value));
      await submitAndAwaitFeedback(screen);
      expect(screen.getByLabelText(/^Correct\./)).toBeTruthy();

      await advanceTo(screen, "Apply it"); // -> plausibility_check_transfer, per the governed remediation_cleared branch route
    },
    20000,
  );
});
