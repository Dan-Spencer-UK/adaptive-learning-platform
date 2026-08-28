/**
 * CC-12D: route-identity regression for the Learn hub's topic cards.
 *
 * A Product Owner emulator finding traced a learner reaching an outdated,
 * non-adaptive lesson screen (with stale teaching imagery) through
 * completely normal navigation -- tapping a Learn-hub topic card, which
 * used to link to the CC-05C legacy static screen (`/learn/[family]`)
 * instead of the real, current Lesson Player (`/learn/lesson-player`).
 *
 * This test proves something distinctive to the real implementation --
 * the exact route pathname and the real governed `lessonId` param each
 * card navigates with -- not merely that both screens happen to share a
 * title today. It also explicitly asserts no card links to the retired
 * legacy pathname any more, so a future regression (someone re-adding a
 * `/learn/[family]` link) fails loudly here rather than only being
 * caught by a Product Owner clicking through the emulator again.
 */
import { render } from "@testing-library/react-native";
import React from "react";

let mockCapturedHrefs: Record<string, unknown> = {};

jest.mock("expo-router", () => ({
  // The top course-orchestration card's own useFocusEffect-driven fetch is
  // irrelevant to this test (the topic cards below it render
  // unconditionally) -- a no-op keeps this test fast and free of SQLite/
  // network mocking.
  useFocusEffect: () => {},
  useRouter: () => ({ push: jest.fn() }),
  Link: ({ href, asChild, children }: { href: unknown; asChild?: boolean; children: React.ReactElement<{ accessibilityLabel?: string }> }) => {
    if (asChild && children?.props?.accessibilityLabel) {
      mockCapturedHrefs[children.props.accessibilityLabel] = href;
    }
    return asChild ? children : null;
  },
}));

jest.mock("@/lib/auth/session-context", () => ({ useSession: () => ({ session: null }) }));
// These are only ever called from inside the (no-op'd above) useFocusEffect
// callbacks, but their real modules pull in native modules (AsyncStorage
// via the Supabase client) that error at import time under Jest -- mocked
// away here purely so importing the real screen component doesn't crash.
jest.mock("@/lib/supabase/client", () => ({ getSupabaseClient: jest.fn() }));
jest.mock("@/lib/evidence-sync/evidence-sync", () => ({ syncPendingLessonEvidence: jest.fn() }));
jest.mock("@/lib/course/next-activity", () => ({ computeNextCourseActivity: jest.fn() }));

import LearnIndexScreen from "../index";

describe("Learn hub topic cards route to the real Lesson Player, not the retired legacy screen", () => {
  beforeEach(() => {
    mockCapturedHrefs = {};
  });

  it("every topic card, including magnetism, links to /learn/lesson-player with its real governed lessonId", async () => {
    await render(<LearnIndexScreen />);

    const expected: Record<string, string> = {
      "Open Ohm's Law lesson": "lesson.electrical.ohms-law",
      "Open Series D.C. circuits lesson": "lesson.electrical.resistors-series",
      "Open Parallel D.C. circuits lesson": "lesson.electrical.resistors-parallel",
      "Open Magnetism, electromagnetism and the motor principle lesson": "lesson.magnetism.effects-of-current",
    };

    for (const [accessibilityLabel, lessonId] of Object.entries(expected)) {
      expect(mockCapturedHrefs[accessibilityLabel]).toEqual({ pathname: "/learn/lesson-player", params: { lessonId } });
    }
  });

  it("no topic card links to the retired legacy screen's pathname", async () => {
    await render(<LearnIndexScreen />);

    const hrefs = Object.values(mockCapturedHrefs) as { pathname?: string }[];
    expect(hrefs.length).toBeGreaterThan(0);
    for (const href of hrefs) {
      expect(href.pathname).not.toBe("/learn/[family]");
      expect(href.pathname).toBe("/learn/lesson-player");
    }
  });
});
