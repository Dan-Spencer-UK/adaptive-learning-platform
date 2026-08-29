/**
 * CC-13A / ADR-0005: proves the real dev-only debug overlay
 * (@/lib/lesson-content/dev-debug-overlay.ts's `useLessonDebugOverlay`,
 * wired into `lesson-player.tsx` as `testID="lesson-debug-overlay"` /
 * `testID="lesson-debug-expected-answer"`) is OFF for a learner by
 * default, and specifically that its gate is a real, working conditional
 * -- not merely absent, not merely dead code. This is the "learner-facing
 * debug/internal metadata exclusion" runtime gate the CC-13A brief
 * requires (ARCHITECTURE-RESET-INTEGRATION-MATRIX.md §5), added
 * alongside -- never replacing or weakening -- the existing CC-12H
 * `mobile-runtime-contract-audit.test.tsx` production-content-coverage
 * gate.
 *
 * Reuses `lesson-player-screen.test.tsx`'s established mocking harness
 * (real SQLite jest mock, real `foundation_state` read/write) so the
 * overlay is proven through the ACTUAL wired hook/component composition,
 * not a hand-rolled stand-in. One render per `it()` (RNTL hazard --
 * rendering more than once in one test silently corrupts later renders
 * in this same test file).
 */
import { render, waitFor } from "@testing-library/react-native";

import * as mockExpoSqlite from "@/lib/storage/__mocks__/expo-sqlite-jest-mock";
import { resetFoundationDbHandleForTests } from "@/lib/storage/db";
import { setFoundationState } from "@/lib/storage/foundation-state";
import { DEV_LESSON_DEBUG_OVERLAY_KEY } from "@/lib/lesson-content/dev-debug-overlay";

jest.mock("expo-sqlite", () => mockExpoSqlite);
jest.mock("expo-haptics", () => ({
  selectionAsync: jest.fn(),
  impactAsync: jest.fn(),
  notificationAsync: jest.fn(),
  ImpactFeedbackStyle: { Light: "light" },
  NotificationFeedbackType: { Success: "success", Error: "error" },
}));

const mockRouter = { back: jest.fn(), replace: jest.fn(), push: jest.fn(), canGoBack: jest.fn(() => true) };
const mockParams: Record<string, string> = { lessonId: "lesson.electrical.ohms-law" };
jest.mock("expo-router", () => ({
  Link: ({ children }: { children: React.ReactNode }) => children,
  useRouter: () => mockRouter,
  useLocalSearchParams: () => mockParams,
}));

jest.mock("@/lib/auth/session-context", () => ({
  useSession: () => ({
    session: { user: { id: "learner.test" } },
    isLoading: false,
    requestOtp: jest.fn(),
    verifyOtp: jest.fn(),
    signOut: jest.fn(),
  }),
}));

import LessonPlayerScreen from "../lesson-player";

const WAIT_OPTS = { timeout: 5000 };

describe("Lesson Player dev-debug overlay -- production/learner gating", () => {
  beforeEach(() => {
    resetFoundationDbHandleForTests();
    jest.clearAllMocks();
  });

  it("does NOT render the debug overlay or the expected-answer readout for a learner by default (flag never set)", async () => {
    const screen = await render(<LessonPlayerScreen />);
    await waitFor(() => expect(screen.getByLabelText("Continue")).toBeTruthy(), WAIT_OPTS);

    expect(screen.queryByTestId("lesson-debug-overlay")).toBeNull();
    expect(screen.queryByTestId("lesson-debug-expected-answer")).toBeNull();
  });

  it("DOES render the debug overlay once the dev-only flag is explicitly enabled -- proves the gate is a real, working conditional, not dead/removed code", async () => {
    await setFoundationState(DEV_LESSON_DEBUG_OVERLAY_KEY, "true");
    const screen = await render(<LessonPlayerScreen />);
    await waitFor(() => expect(screen.getByTestId("lesson-debug-overlay")).toBeTruthy(), WAIT_OPTS);

    expect(screen.getByTestId("lesson-debug-overlay")).toBeTruthy();
  });

  it("treats any persisted value other than the exact string 'true' as disabled (e.g. stale/corrupt state fails closed, not open)", async () => {
    await setFoundationState(DEV_LESSON_DEBUG_OVERLAY_KEY, "1");
    const screen = await render(<LessonPlayerScreen />);
    await waitFor(() => expect(screen.getByLabelText("Continue")).toBeTruthy(), WAIT_OPTS);

    expect(screen.queryByTestId("lesson-debug-overlay")).toBeNull();
  });
});
