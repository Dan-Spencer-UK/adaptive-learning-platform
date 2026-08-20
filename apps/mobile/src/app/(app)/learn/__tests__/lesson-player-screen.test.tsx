/**
 * Tier-3 integration test for the native Lesson Player -- the strongest
 * single proof that the full runtime chain works inside the actual app:
 * local content preparation -> LessonInstance assembly -> session start
 * -> native step rendering -> deterministic marking -> evidence
 * recording -> session persistence/resume -> completion. CC-06D: the
 * player is entered by GOVERNED LESSON IDENTITY (route param), resolves
 * content through the generated projection, fails explicitly for
 * unknown identity, fails closed without learner identity, and
 * Exit/Continue navigate out instead of dead-ending in "loading".
 *
 * Every `fireEvent` call is awaited (see NumericAnswerInput.test.tsx's
 * established convention).
 */
import { fireEvent, render, waitFor } from "@testing-library/react-native";

import * as mockExpoSqlite from "@/lib/storage/__mocks__/expo-sqlite-jest-mock";
import { resetFoundationDbHandleForTests } from "@/lib/storage/db";
import { getActiveLessonInstanceId, loadLessonSession } from "@/lib/lesson-session/lesson-session-store";

jest.mock("expo-sqlite", () => mockExpoSqlite);
jest.mock("expo-haptics", () => ({
  selectionAsync: jest.fn(),
  impactAsync: jest.fn(),
  notificationAsync: jest.fn(),
  ImpactFeedbackStyle: { Light: "light" },
  NotificationFeedbackType: { Success: "success", Error: "error" },
}));

const mockRouter = { back: jest.fn(), replace: jest.fn(), push: jest.fn(), canGoBack: jest.fn(() => true) };
let mockParams: Record<string, string> = { lessonId: "lesson.electrical.ohms-law" };
jest.mock("expo-router", () => ({
  Link: ({ children }: { children: React.ReactNode }) => children,
  useRouter: () => mockRouter,
  useLocalSearchParams: () => mockParams,
}));

let mockLearnerId: string | null = "learner.test";
jest.mock("@/lib/auth/session-context", () => ({
  useSession: () => ({
    session: mockLearnerId ? { user: { id: mockLearnerId } } : null,
    isLoading: false,
    requestOtp: jest.fn(),
    verifyOtp: jest.fn(),
    signOut: jest.fn(),
  }),
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

describe("LessonPlayerScreen (generic lesson identity)", () => {
  beforeEach(() => {
    resetFoundationDbHandleForTests();
    jest.clearAllMocks();
    mockRouter.canGoBack.mockReturnValue(true);
    mockLearnerId = "learner.test";
    mockParams = { lessonId: "lesson.electrical.ohms-law" };
  });

  it("starts a new learner at the orientation step of the lesson selected by id", async () => {
    const screen = await render(<LessonPlayerScreen />);
    await waitFor(() => expect(screen.getByLabelText("Continue")).toBeTruthy(), WAIT_OPTS);
    expect(screen.getByText("Introduction")).toBeTruthy();
  });

  it("fails explicitly for an unknown lesson id -- no first/default lesson fallback", async () => {
    mockParams = { lessonId: "lesson.does.not.exist" };
    const screen = await render(<LessonPlayerScreen />);
    await waitFor(() => expect(screen.getByText("Lesson not available")).toBeTruthy(), WAIT_OPTS);
    expect(screen.queryByText("Introduction")).toBeNull();
  });

  it("fails explicitly when no lesson id is supplied at all", async () => {
    mockParams = {};
    const screen = await render(<LessonPlayerScreen />);
    await waitFor(() => expect(screen.getByText("Lesson not available")).toBeTruthy(), WAIT_OPTS);
  });

  it("fails explicitly for an unavailable content release", async () => {
    mockParams = { lessonId: "lesson.electrical.ohms-law", contentRelease: "release.not-local.v9" };
    const screen = await render(<LessonPlayerScreen />);
    await waitFor(() => expect(screen.getByText("Lesson not available")).toBeTruthy(), WAIT_OPTS);
  });

  it("fails closed (non-destructively) when learner identity is unavailable", async () => {
    mockLearnerId = null;
    const screen = await render(<LessonPlayerScreen />);
    await waitFor(() => expect(screen.getByText("Sign-in required")).toBeTruthy(), WAIT_OPTS);
    expect(screen.queryByText("Introduction")).toBeNull();
  });

  it("answering a graded step correctly shows feedback, then advances to the next real step on Continue", async () => {
    const screen = await render(<LessonPlayerScreen />);
    await advanceTo(screen, "Try it"); // orientation -> activate_prior_knowledge
    await advanceTo(screen, "Concept"); // -> introduce_relationship
    await advanceTo(screen, "How it works"); // -> formula_and_mnemonic_representation
    await advanceTo(screen, "Try it"); // -> interpret_variables_and_units (graded, multi_select)

    await waitFor(() => expect(screen.getByText("Match each Ohm's-law variable to its correct SI unit")).toBeTruthy(), WAIT_OPTS);
    await fireEvent.press(screen.getByLabelText("V (voltage): V"));
    await fireEvent.press(screen.getByLabelText("I (current): A"));
    await fireEvent.press(screen.getByLabelText("R (resistance): Ω"));
    await submitAndAwaitFeedback(screen);
    expect(screen.getByLabelText(/^Correct\./)).toBeTruthy();

    await advanceTo(screen, "Worked example"); // -> worked_example_solve_voltage
  });

  it("a wrong answer on a retry-required step does NOT reveal the correct answer, and offers Try again", async () => {
    const screen = await render(<LessonPlayerScreen />);
    await advanceTo(screen, "Try it");
    await advanceTo(screen, "Concept");
    await advanceTo(screen, "How it works");
    await advanceTo(screen, "Try it"); // interpret_variables_and_units

    // Deliberately wrong: swap two unit assignments.
    await fireEvent.press(screen.getByLabelText("V (voltage): A"));
    await fireEvent.press(screen.getByLabelText("I (current): V"));
    await fireEvent.press(screen.getByLabelText("R (resistance): Ω"));
    await submitAndAwaitFeedback(screen);
    expect(screen.getByLabelText(/^Not quite\./)).toBeTruthy();
    expect(screen.queryByText(/^Correct answer:/)).toBeNull();
    // The engine's marking detail states the expected answer -- it must not
    // surface while a retry is pending either (found on-device during the
    // CC-06D native smoke check).
    expect(screen.queryByText(/expected/)).toBeNull();
    expect(screen.getByLabelText("Try again")).toBeTruthy();

    // Try again returns to the same question for an independent attempt.
    await fireEvent.press(screen.getByLabelText("Try again"));
    await waitFor(() => expect(screen.getByText("Match each Ohm's-law variable to its correct SI unit")).toBeTruthy(), WAIT_OPTS);
  });

  it("persists an active session that a fresh screen instance resumes from the same step for the same learner", async () => {
    const first = await render(<LessonPlayerScreen />);
    await advanceTo(first, "Try it"); // orientation -> activate_prior_knowledge

    const activeId = await getActiveLessonInstanceId("learner.test");
    expect(activeId).not.toBeNull();
    const savedSession = await loadLessonSession(activeId!, "learner.test");
    expect(savedSession?.completedStepIds).toContain("orientation");
    expect(savedSession?.learnerId).toBe("learner.test");
    expect(savedSession?.contentRelease).toBe("release.unit202.v1");

    await first.unmount();
    const second = await render(<LessonPlayerScreen />);
    await waitFor(() => expect(second.getByText("Try it")).toBeTruthy(), WAIT_OPTS);
    const resumedSession = await loadLessonSession(activeId!, "learner.test");
    expect(resumedSession?.completedStepIds).toContain("orientation");
  });

  it("a DIFFERENT learner does not resume the first learner's session -- a fresh session starts at orientation", async () => {
    const first = await render(<LessonPlayerScreen />);
    await advanceTo(first, "Try it"); // learner.test progresses past orientation
    await first.unmount();

    mockLearnerId = "learner.other";
    const second = await render(<LessonPlayerScreen />);
    await waitFor(() => expect(second.getByText("Introduction")).toBeTruthy(), WAIT_OPTS);
    // learner.test's session remains intact and owned.
    const aActive = await getActiveLessonInstanceId("learner.test");
    expect(aActive).not.toBeNull();
    expect(await loadLessonSession(aActive!, "learner.other")).toBeNull();
    expect(await loadLessonSession(aActive!, "learner.test")).not.toBeNull();
  });

  it("Exit navigates back out of the Player instead of dead-ending in loading", async () => {
    const screen = await render(<LessonPlayerScreen />);
    await screen.findByLabelText("Continue", {}, WAIT_OPTS);
    await fireEvent.press(screen.getByLabelText("Exit lesson"));
    expect(mockRouter.back).toHaveBeenCalled();
    expect(screen.queryByText("Preparing lesson...")).toBeNull();
  });

  it("Exit falls back to replacing with the Learn route when there is no back history", async () => {
    mockRouter.canGoBack.mockReturnValue(false);
    const screen = await render(<LessonPlayerScreen />);
    await screen.findByLabelText("Continue", {}, WAIT_OPTS);
    await fireEvent.press(screen.getByLabelText("Exit lesson"));
    expect(mockRouter.replace).toHaveBeenCalledWith("/learn");
  });
});
