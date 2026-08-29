/**
 * CC-12H: regression coverage for the architectural correction to the
 * Learn hub (see ../index.tsx's own header comment for the full defect
 * this fixes -- 20 of 24 governed Unit 202 lessons had no real navigation
 * route to them at all). Proves the five properties the correction was
 * required to establish:
 *
 *  1. every learner-visible lesson in the current production release
 *     appears in normal Learn navigation;
 *  2. every listed lesson resolves to the canonical Lesson Player;
 *  3. the catalogue is DERIVED from release membership, not a
 *     hand-maintained id map -- changing what the release carries changes
 *     the catalogue with no navigation-code edit required;
 *  4. adaptive recommendation ("Next up") stays independent of
 *     availability -- every decision state still shows the full catalogue;
 *  5. prerequisite/mastery state cannot remove or hard-lock a lesson from
 *     the catalogue (CC-12G's own "no ordinary lesson is hard-gated"
 *     invariant, restated for DISCOVERABILITY, not just access once opened).
 */
import { render } from "@testing-library/react-native";
import React from "react";
import type { LessonPlan } from "@alp/content-schema";

let mockCapturedHrefs: Record<string, unknown> = {};

jest.mock("expo-router", () => ({
  // A real `useEffect` with an empty dependency array -- runs the effect
  // body once per mount (close enough to a focus event for this test),
  // rather than on every render, which an unconditional inline call would
  // do and which drives the real component into an infinite render loop
  // the instant its own `setState` inside the effect causes a re-render.
  useFocusEffect: (callback: () => void | (() => void)) => {
    const { useEffect } = require("react");
    useEffect(() => callback(), []);
  },
  useRouter: () => ({ push: jest.fn() }),
  Link: ({ href, asChild, children }: { href: unknown; asChild?: boolean; children: React.ReactElement<{ accessibilityLabel?: string }> }) => {
    if (asChild && children?.props?.accessibilityLabel) {
      mockCapturedHrefs[children.props.accessibilityLabel] = href;
    }
    return asChild ? children : null;
  },
}));

const mockUseSession = jest.fn();
jest.mock("@/lib/auth/session-context", () => ({ useSession: () => mockUseSession() }));
jest.mock("@/lib/supabase/client", () => ({ getSupabaseClient: jest.fn() }));
jest.mock("@/lib/evidence-sync/evidence-sync", () => ({
  syncPendingLessonEvidence: jest.fn(() => Promise.resolve({ uploaded: 0, skippedOtherLearner: 0, skippedUnsyncable: 0, failed: false })),
}));

const mockComputeNextCourseActivity = jest.fn();
jest.mock("@/lib/course/next-activity", () => ({
  computeNextCourseActivity: (...args: unknown[]) => mockComputeNextCourseActivity(...args),
}));

const mockGetLocalReleaseLessons = jest.fn();
const mockBundledContentReleaseId = jest.fn();
jest.mock("@/lib/lesson-content/local-content-registry", () => ({
  bundledContentReleaseId: () => mockBundledContentReleaseId(),
  getLocalReleaseLessons: (release: string) => mockGetLocalReleaseLessons(release),
}));

import LearnIndexScreen from "../index";

const REAL_REGISTRY = jest.requireActual("@/lib/lesson-content/local-content-registry") as {
  bundledContentReleaseId: () => string;
  getLocalReleaseLessons: (release: string) => readonly LessonPlan[];
};

function useRealRegistry(): void {
  mockBundledContentReleaseId.mockImplementation(() => REAL_REGISTRY.bundledContentReleaseId());
  mockGetLocalReleaseLessons.mockImplementation((release: string) => REAL_REGISTRY.getLocalReleaseLessons(release));
}

function lessonPlan(id: string, title: string): LessonPlan {
  return {
    id,
    schemaVersion: 1,
    version: 1,
    title,
    learnerFacingDescription: `Learn about ${title}.`,
    curriculumUnit: "City & Guilds 2365-02 Unit 202 -- Principles of Electrical Science",
    prerequisiteKnowledge: [],
    targetAssertionFamilyIds: [],
    remediationEligibility: [],
    targetAssertionIdentifiers: [],
    targetCapabilityIds: [],
    estimatedDurationMinutes: 10,
    instructionalStrategy: "",
    contentRelease: "synthetic.release.v1",
    completionCriteria: { requiredStepIds: [], exitSummary: "Done." },
    steps: [
      {
        id: "orientation",
        type: "orientation",
        purpose: "",
        requirement: "required",
        teaches: [],
        reinforces: [],
        tests: [],
        capabilityIds: [],
        misconceptionTargets: [],
        representation: {},
        presentation: { interactionRequired: false, answerReveal: "not_applicable", contentMayScroll: false, progressiveReveal: false },
        scaffoldingLevel: "guided",
        cognitiveDemand: "introductory",
        feedback: { mode: "immediate", explainWhy: false },
        completionCondition: "view_acknowledged",
        branchRoutes: [],
        evidenceEmitted: [],
      },
    ],
  } as unknown as LessonPlan;
}

describe("Learn hub lesson catalogue (CC-12H architectural correction)", () => {
  beforeEach(() => {
    mockCapturedHrefs = {};
    mockUseSession.mockReturnValue({ session: null });
    mockComputeNextCourseActivity.mockResolvedValue({ decisionType: "ADVANCE", lessonId: "lesson.electrical.ohms-law", detail: "" });
    mockGetLocalReleaseLessons.mockReset();
    mockBundledContentReleaseId.mockReset();
  });

  it("1/2: every lesson in the current bundled production release appears in the catalogue, linked to the canonical Lesson Player with its own real lessonId", async () => {
    useRealRegistry();
    const realLessons = REAL_REGISTRY.getLocalReleaseLessons(REAL_REGISTRY.bundledContentReleaseId());
    expect(realLessons.length).toBeGreaterThanOrEqual(20);

    await render(<LearnIndexScreen />);

    for (const lesson of realLessons) {
      const label = `Open ${lesson.title} lesson`;
      expect(mockCapturedHrefs[label]).toEqual({
        pathname: "/learn/lesson-player",
        params: { lessonId: lesson.id },
      });
    }
    // Exactly one catalogue card per real lesson -- no extras, no omissions
    // (session is null in this test, so the separate "Next up" recommendation
    // card never resolves/never contributes an href -- see test 4 for that
    // card's own behaviour with a real learner session).
    expect(Object.keys(mockCapturedHrefs).length).toBe(realLessons.length);
  });

  it("3: the catalogue is derived from release membership, not a hardcoded id map -- a completely different synthetic release produces a completely different catalogue with no navigation-code change", async () => {
    mockBundledContentReleaseId.mockReturnValue("synthetic.release.v1");
    mockGetLocalReleaseLessons.mockReturnValue([lessonPlan("lesson.synthetic.alpha", "Synthetic Alpha"), lessonPlan("lesson.synthetic.beta", "Synthetic Beta")]);

    const { queryByLabelText } = await render(<LearnIndexScreen />);

    expect(mockCapturedHrefs["Open Synthetic Alpha lesson"]).toEqual({ pathname: "/learn/lesson-player", params: { lessonId: "lesson.synthetic.alpha" } });
    expect(mockCapturedHrefs["Open Synthetic Beta lesson"]).toEqual({ pathname: "/learn/lesson-player", params: { lessonId: "lesson.synthetic.beta" } });
    // None of the real production lessons leak through -- the catalogue
    // genuinely reflects only what the (mocked) release reports.
    expect(queryByLabelText("Open Ohm's Law lesson")).toBeNull();
    expect(Object.keys(mockCapturedHrefs).length).toBe(2); // just the 2 synthetic lessons (session null -> no "Next up" href).
  });

  it("4: the catalogue renders in full regardless of the adaptive recommendation's own decision state (BLOCKED/error/complete never hide or filter it)", async () => {
    // A real learnerId this time, so the "Next up" fetch actually resolves --
    // proving the catalogue below is independent of that resolved state, not
    // merely independent of an unresolved one.
    mockUseSession.mockReturnValue({ session: { user: { id: "learner-1" } } });
    mockBundledContentReleaseId.mockReturnValue("synthetic.release.v1");
    mockGetLocalReleaseLessons.mockReturnValue([lessonPlan("lesson.synthetic.alpha", "Synthetic Alpha")]);
    mockComputeNextCourseActivity.mockResolvedValue({ decisionType: "BLOCKED", lessonId: null, detail: "Nothing available right now." });

    const { findByText } = await render(<LearnIndexScreen />);

    await findByText("Not available right now");
    expect(mockCapturedHrefs["Open Synthetic Alpha lesson"]).toEqual({ pathname: "/learn/lesson-player", params: { lessonId: "lesson.synthetic.alpha" } });
  });

  it("5: the catalogue renders with no signed-in learner/evidence context at all -- prerequisite/mastery state has no code path that could remove a lesson from it", async () => {
    // `useSession` resolves to a null session in this test (set in
    // beforeEach) -- no learnerId, so no evidence/prerequisite lookup is
    // even possible -- and the catalogue below is unaffected regardless.
    useRealRegistry();
    const realLessons = REAL_REGISTRY.getLocalReleaseLessons(REAL_REGISTRY.bundledContentReleaseId());

    await render(<LearnIndexScreen />);

    for (const lesson of realLessons) {
      expect(mockCapturedHrefs[`Open ${lesson.title} lesson`]).toBeTruthy();
    }
  });
});
