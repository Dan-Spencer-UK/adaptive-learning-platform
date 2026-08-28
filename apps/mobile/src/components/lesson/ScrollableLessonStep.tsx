/**
 * CC-12F: the generic Lesson Player scroll container (ARCH-003 §4/CC-12E
 * Product Owner decision -- scrolling within a step is permitted whenever
 * it serves teaching better than forcing content into one viewport, but
 * hidden continuation must never be ambiguous). Every lesson step renders
 * through this ONE component (`lesson-player.tsx`) -- the floating "more
 * content below" affordance is Lesson Player behaviour, never authored
 * per-lesson.
 *
 * Visibility is derived purely from live scroll geometry
 * (`layoutMeasurement`/`contentSize`/`contentOffset`, all provided by a
 * single native `onScroll` event) plus `onContentSizeChange` for the
 * pre-first-scroll state: no separate "is this step scrollable" flag is
 * threaded through from content, so it stays correct automatically when
 * feedback expansion, image load, or font scaling changes a step's real
 * height. A small overflow threshold absorbs rounding/sub-pixel overflow
 * (never shows the arrow for a step that already visually fits).
 */
import { useCallback, useRef, useState } from "react";
import {
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type LayoutChangeEvent,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useReducedMotion } from "@/lib/motion";
import { color, minTouchTarget, radius, spacing } from "@/lib/tokens";

/** Ignore trivial/rounding overflow -- never show the arrow for a step that already fits (task brief §5). */
const OVERFLOW_THRESHOLD_PX = 8;
/** Tapping the arrow scrolls by a generous fraction of the viewport, not a blind jump to the absolute bottom (task brief §4). */
const SCROLL_STEP_FRACTION = 0.8;
const ARROW_SIZE = 48;

/**
 * Pure geometry -> visibility rule, exported for direct unit testing
 * (no rendering/native-event machinery required): the arrow shows only
 * when genuine content remains below the current scroll position, never
 * for trivial/rounding overflow.
 */
export function hasMoreContentBelow(contentHeight: number, viewportHeight: number, scrollY: number): boolean {
  return contentHeight - viewportHeight - scrollY > OVERFLOW_THRESHOLD_PX;
}

export interface ScrollableLessonStepProps {
  readonly children: React.ReactNode;
  readonly testID?: string;
}

export function ScrollableLessonStep({ children, testID }: ScrollableLessonStepProps): React.JSX.Element {
  const scrollRef = useRef<ScrollView>(null);
  const reducedMotion = useReducedMotion();
  // Seeded from the window height (a conservative overestimate of the
  // real, safe-area-reduced scroll viewport) rather than 0, so a very
  // tall step's arrow doesn't have to wait for the first native onLayout
  // callback to become visible, and a short step is never falsely shown
  // as scrollable in the brief instant before that callback fires -- the
  // real onLayout value (below) always corrects this once known.
  const [viewportHeight, setViewportHeight] = useState(() => Dimensions.get("window").height);
  const [contentHeight, setContentHeight] = useState(0);
  const [scrollY, setScrollY] = useState(0);

  const hasMoreBelow = hasMoreContentBelow(contentHeight, viewportHeight, scrollY);

  const handleLayout = useCallback((event: LayoutChangeEvent) => {
    setViewportHeight(event.nativeEvent.layout.height);
  }, []);

  const handleContentSizeChange = useCallback((_width: number, height: number) => {
    setContentHeight(height);
  }, []);

  const handleScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    setScrollY(event.nativeEvent.contentOffset.y);
  }, []);

  const scrollDown = useCallback(() => {
    scrollRef.current?.scrollTo({ y: scrollY + viewportHeight * SCROLL_STEP_FRACTION, animated: !reducedMotion });
  }, [scrollY, viewportHeight, reducedMotion]);

  return (
    <View style={styles.fill} testID={testID}>
      <ScrollView
        ref={scrollRef}
        testID="scrollable-lesson-step-scrollview"
        style={styles.fill}
        contentContainerStyle={styles.container}
        onLayout={handleLayout}
        onContentSizeChange={handleContentSizeChange}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {children}
      </ScrollView>
      {hasMoreBelow ? (
        // SafeAreaView (component), not useSafeAreaInsets (hook): the
        // component degrades gracefully with no SafeAreaProvider
        // ancestor (matching how this codebase already renders
        // SafeAreaView-based screens under Jest, e.g. lesson-player.tsx
        // itself), while the hook throws hard without one -- see this
        // component's own test file for why that matters here.
        <SafeAreaView edges={["bottom", "right"]} pointerEvents="box-none" style={styles.arrowSafeArea}>
          <Pressable
            onPress={scrollDown}
            accessibilityRole="button"
            accessibilityLabel="More content below"
            style={styles.arrow}
            testID="scroll-discoverability-arrow"
          >
            <Text style={styles.arrowGlyph}>↓</Text>
          </Pressable>
        </SafeAreaView>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  container: { padding: spacing.lg, gap: spacing.md },
  arrowSafeArea: {
    position: "absolute",
    bottom: 0,
    right: 0,
    paddingRight: spacing.md,
    // Deliberately much larger than the horizontal padding: a Product
    // Owner emulator finding (RUN A) found the arrow's original 16px
    // bottom clearance genuinely overlapped a full-width Continue button
    // that happened to render right at the bottom of the scrollable
    // content -- see this component's own header comment ("does not
    // cover Submit/Continue/answer controls" is a real, checked
    // requirement, not just a comment). This fixed clearance is a
    // pragmatic choice (generous enough for this app's own button
    // heights, per lib/tokens.ts's minTouchTarget/spacing scale) rather
    // than dynamic collision detection against the actual last-rendered
    // control, which would be real complexity for a small, bounded gain.
    paddingBottom: minTouchTarget * 2,
  },
  arrow: {
    width: ARROW_SIZE,
    height: ARROW_SIZE,
    borderRadius: radius.lg,
    backgroundColor: color.accent,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  arrowGlyph: { fontSize: 22, fontWeight: "700", color: "#fff" },
});
