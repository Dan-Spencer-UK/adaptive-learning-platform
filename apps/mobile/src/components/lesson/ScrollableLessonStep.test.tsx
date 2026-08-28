/**
 * CC-12F: the floating "more content below" affordance's visibility rule
 * is a pure function (`hasMoreContentBelow`), unit-tested directly below
 * for the boundary/threshold behaviour -- deliberately not exercised via
 * a synthetic native "layout" event, which corrupts React Native's own
 * test-renderer act() bookkeeping for every later render in the same
 * file (reproduced independently; `contentSizeChange`/`scroll` events do
 * not have this problem). The rendering-level tests below drive only
 * `contentSizeChange`/`scroll`, which are safe, plus the component's own
 * window-height-seeded initial viewport estimate (see the component's own
 * header comment) so no test needs to fire "layout" at all. Assertions
 * about a state change caused by an event use `findBy*`/`waitFor` (React
 * Testing Library's own recommended pattern for "state updates after this
 * event, wait for it") rather than a synchronous `getBy*` immediately
 * after `fireEvent`, since the state update genuinely lands on a
 * following commit rather than synchronously within `fireEvent` itself.
 */
import { fireEvent, render, waitFor } from "@testing-library/react-native";
import { Text } from "react-native";

// The component uses <SafeAreaView> (component), not useSafeAreaInsets()
// (hook) -- the component degrades gracefully with no SafeAreaProvider
// ancestor (matching every other SafeAreaView-based screen already
// tested this way in this codebase, e.g. lesson-player.tsx), so no
// safe-area mock/provider is needed here.
jest.mock("@/lib/motion", () => ({ useReducedMotion: () => false }));

import { hasMoreContentBelow, ScrollableLessonStep } from "./ScrollableLessonStep";

describe("hasMoreContentBelow (pure geometry rule)", () => {
  it("is false when content fits entirely within the viewport", () => {
    expect(hasMoreContentBelow(400, 600, 0)).toBe(false);
  });

  it("is true when scrollable content remains below the viewport", () => {
    expect(hasMoreContentBelow(900, 400, 0)).toBe(true);
  });

  it("is false once scrolled far enough that no content remains below", () => {
    expect(hasMoreContentBelow(900, 400, 500)).toBe(false);
  });

  it("is true again after scrolling back up while content still exists below", () => {
    expect(hasMoreContentBelow(900, 400, 100)).toBe(true);
  });

  it("ignores trivial/rounding overflow (a 1px difference never shows the arrow)", () => {
    expect(hasMoreContentBelow(401, 400, 0)).toBe(false);
  });

  it("shows the arrow once overflow genuinely exceeds the rounding threshold", () => {
    expect(hasMoreContentBelow(420, 400, 0)).toBe(true);
  });
});

describe("ScrollableLessonStep (rendering)", () => {
  it("renders the scroll container and no arrow before any measurement indicates overflow", async () => {
    const { queryByTestId, getByTestId } = await render(
      <ScrollableLessonStep>
        <Text>short content</Text>
      </ScrollableLessonStep>,
    );
    expect(getByTestId("scrollable-lesson-step-scrollview")).toBeTruthy();
    expect(queryByTestId("scroll-discoverability-arrow")).toBeNull();
  });

  it("shows an accessible arrow once content-size-change reports overflow beyond the window-height viewport estimate", async () => {
    const { getByTestId, findByLabelText } = await render(
      <ScrollableLessonStep>
        <Text>long content</Text>
      </ScrollableLessonStep>,
    );
    const scrollView = getByTestId("scrollable-lesson-step-scrollview");
    // Window height in the RN test environment defaults to a fixed value
    // (Dimensions.get("window").height) -- a very large content height
    // guarantees genuine overflow regardless of that default.
    fireEvent(scrollView, "contentSizeChange", 320, 100000);

    const arrow = await findByLabelText("More content below");
    expect(arrow.props.accessibilityRole).toBe("button");
  });

  it("hides the arrow again once scroll position reaches the bottom", async () => {
    const { getByTestId, findByTestId, queryByTestId } = await render(
      <ScrollableLessonStep>
        <Text>long content</Text>
      </ScrollableLessonStep>,
    );
    const scrollView = getByTestId("scrollable-lesson-step-scrollview");
    fireEvent(scrollView, "contentSizeChange", 320, 100000);
    await findByTestId("scroll-discoverability-arrow");

    fireEvent.scroll(scrollView, { nativeEvent: { contentOffset: { y: 99000 } } });
    await waitFor(() => expect(queryByTestId("scroll-discoverability-arrow")).toBeNull());
  });

  it("returns the arrow if the learner scrolls back up while content still exists below", async () => {
    const { getByTestId, findByTestId, queryByTestId } = await render(
      <ScrollableLessonStep>
        <Text>long content</Text>
      </ScrollableLessonStep>,
    );
    const scrollView = getByTestId("scrollable-lesson-step-scrollview");
    fireEvent(scrollView, "contentSizeChange", 320, 100000);
    await findByTestId("scroll-discoverability-arrow");
    fireEvent.scroll(scrollView, { nativeEvent: { contentOffset: { y: 99000 } } });
    await waitFor(() => expect(queryByTestId("scroll-discoverability-arrow")).toBeNull());

    fireEvent.scroll(scrollView, { nativeEvent: { contentOffset: { y: 100 } } });
    await findByTestId("scroll-discoverability-arrow");
  });

  it("tapping the arrow is a real press interaction that does not throw (the actual scrollTo() call is exercised live in the emulator, RUN A)", async () => {
    const { getByTestId, findByLabelText } = await render(
      <ScrollableLessonStep>
        <Text>long content</Text>
      </ScrollableLessonStep>,
    );
    const scrollView = getByTestId("scrollable-lesson-step-scrollview");
    fireEvent(scrollView, "contentSizeChange", 320, 100000);

    const arrow = await findByLabelText("More content below");
    expect(() => fireEvent.press(arrow)).not.toThrow();
  });
});
