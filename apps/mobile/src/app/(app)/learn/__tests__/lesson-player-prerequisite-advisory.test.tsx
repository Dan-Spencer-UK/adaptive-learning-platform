/**
 * CC-12G: a Product Owner product-architecture decision, discovered
 * while investigating a live-emulator navigation dead end during this
 * package's own acceptance testing -- prerequisite evidence may inform
 * recommendations/readiness/diagnostic-remediation routing, but must
 * NEVER hard-block a learner from directly opening a lesson via normal
 * Learn navigation. The previous behaviour showed a dead-end "Not ready
 * yet" screen with only a "Back to Learn" button and no way to open the
 * originally-requested lesson at all once a prerequisite family had
 * WEAK/CONFLICTING evidence.
 *
 * Reproducing genuine WEAK/CONFLICTING evidence through the real offline
 * derivation chain would need many real recorded wrong attempts across
 * several lessons -- this test instead mocks only `assembleLessonInstance`
 * (the exact seam @alp/learning-engine's own assembler.test.ts already
 * proves in full: a WEAK/CONFLICTING prerequisite family now produces
 * `ready_with_prerequisite_advisory`, never a blocking status), so this
 * test is a focused proof of the Lesson Player's OWN handling of that
 * result -- it must render the lesson directly, with an advisory note,
 * never a dead end. `computeLessonContentDependencies` and every other
 * export stay real (`jest.requireActual`), so local content preparation
 * genuinely succeeds and the rest of the runtime chain is unmocked.
 */
import { render, waitFor } from "@testing-library/react-native";
import type { LessonInstance, PrerequisiteAdvisory } from "@alp/learning-engine";

import { bundledContentReleaseId, getLocalLesson } from "@/lib/lesson-content/local-content-registry";
import * as mockExpoSqlite from "@/lib/storage/__mocks__/expo-sqlite-jest-mock";
import { resetFoundationDbHandleForTests } from "@/lib/storage/db";

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

// Mock assembleLessonInstance only -- every other export (including
// computeLessonContentDependencies, ASSEMBLY_POLICY_VERSION) is real.
jest.mock("@alp/learning-engine", () => {
  const actual: object = jest.requireActual("@alp/learning-engine");
  return { ...actual, assembleLessonInstance: jest.fn() };
});
// eslint-disable-next-line @typescript-eslint/no-require-imports -- must be required after the mock factory above for the jest.fn() reference to be usable.
const { assembleLessonInstance: mockAssemble } = require("@alp/learning-engine") as { assembleLessonInstance: jest.Mock };

import LessonPlayerScreen from "../lesson-player";

const WAIT_OPTS = { timeout: 5000 };

describe("LessonPlayerScreen -- prerequisite evidence is advisory, never blocking (CC-12G)", () => {
  beforeEach(() => {
    resetFoundationDbHandleForTests();
    jest.clearAllMocks();
    mockParams.lessonId = "lesson.electrical.ohms-law";
  });

  it("opens the requested lesson directly and shows a plain-language advisory, when an unmet prerequisite family resolves to an available remediation lesson", async () => {
    const record = getLocalLesson({ lessonId: "lesson.electrical.ohms-law", contentRelease: bundledContentReleaseId() });
    const remediationInstance: LessonInstance = {
      instanceId: "remediation-instance",
      lessonId: "lesson.electrical.magnetism-fundamentals",
      lessonVersion: 1,
      contentRelease: record.contentRelease,
      assemblyPolicyVersion: 1,
      learnerId: "learner.test",
      stepDecisions: [],
      includedStepIds: [],
      completionCriteria: record.lesson.completionCriteria,
      evidenceDigest: "digest",
    };
    const advisory: PrerequisiteAdvisory = {
      unmetFamilyId: "electrical.magnetism_and_electromagnetism",
      remediation: { status: "available", lesson: { ...record.lesson, id: "lesson.electrical.magnetism-fundamentals", title: "Magnetism fundamentals" }, instance: remediationInstance },
    };
    mockAssemble.mockReturnValue({
      status: "ready_with_prerequisite_advisory",
      instance: { instanceId: "main-instance", lessonId: record.lesson.id, lessonVersion: record.lesson.version, contentRelease: record.contentRelease, assemblyPolicyVersion: 1, learnerId: "learner.test", stepDecisions: record.lesson.steps.map((s) => ({ stepId: s.id, included: true, reason: "required", detail: "" })), includedStepIds: record.lesson.steps.map((s) => s.id), completionCriteria: record.lesson.completionCriteria, evidenceDigest: "digest" },
      advisories: [advisory],
    });

    const screen = await render(<LessonPlayerScreen />);

    // The lesson itself renders -- no dead-end "Not ready yet" screen.
    await waitFor(() => expect(screen.getByText("Introduction")).toBeTruthy(), WAIT_OPTS);
    expect(screen.queryByText("Not ready yet")).toBeNull();
    expect(screen.queryByLabelText("Back to Learn")).toBeNull();

    // The advisory is shown as plain-language, dismissible-feeling in-lesson context -- never an internal family id or engine term.
    expect(screen.getByTestId("lesson-prerequisite-advisory")).toBeTruthy();
    expect(screen.getByText(/Magnetism fundamentals.*might be worth reviewing/)).toBeTruthy();
    expect(screen.queryByText(/electrical\.magnetism_and_electromagnetism/)).toBeNull();
    expect(screen.queryByText(/ready_with_prerequisite_advisory/)).toBeNull();
  });

  it("opens the requested lesson directly, with an advisory, even when no remediation candidate resolves at all (never silently blocked)", async () => {
    const record = getLocalLesson({ lessonId: "lesson.electrical.ohms-law", contentRelease: bundledContentReleaseId() });
    const advisory: PrerequisiteAdvisory = {
      unmetFamilyId: "electrical.magnetism_and_electromagnetism",
      remediation: { status: "unresolved", reason: "no_candidate_lesson" },
    };
    mockAssemble.mockReturnValue({
      status: "ready_with_prerequisite_advisory",
      instance: { instanceId: "main-instance", lessonId: record.lesson.id, lessonVersion: record.lesson.version, contentRelease: record.contentRelease, assemblyPolicyVersion: 1, learnerId: "learner.test", stepDecisions: record.lesson.steps.map((s) => ({ stepId: s.id, included: true, reason: "required", detail: "" })), includedStepIds: record.lesson.steps.map((s) => s.id), completionCriteria: record.lesson.completionCriteria, evidenceDigest: "digest" },
      advisories: [advisory],
    });

    const screen = await render(<LessonPlayerScreen />);

    await waitFor(() => expect(screen.getByText("Introduction")).toBeTruthy(), WAIT_OPTS);
    expect(screen.queryByText("Not ready yet")).toBeNull();
    expect(screen.getByTestId("lesson-prerequisite-advisory")).toBeTruthy();
    expect(screen.getByText(/some earlier material may be worth revisiting/)).toBeTruthy();
  });
});
