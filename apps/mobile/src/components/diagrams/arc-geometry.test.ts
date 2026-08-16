/**
 * CC-05C-DIAGRAM-FIX: proves the arrowhead/arc geometry helpers actually
 * point where they claim to -- the exact class of defect the Product
 * Owner found in manual Android review (a current-direction triangle
 * that sat on a horizontal wire but pointed straight down). These are
 * pure numeric checks on the underlying geometry, independent of any
 * SVG/RN rendering.
 */
import { arcPath, arrowheadPoints, lineArrowheadPoints } from "./arc-geometry";

describe("arrowheadPoints", () => {
  it("points rightward (tip has the largest x) when angle is 0 degrees", () => {
    const { tip, left, right } = arrowheadPoints(100, 50, 0, 8);
    expect(tip.x).toBeGreaterThan(left.x);
    expect(tip.x).toBeGreaterThan(right.x);
    // The two back corners straddle the tip's y (a symmetric wedge), never both above or below.
    expect(Math.min(left.y, right.y)).toBeLessThan(tip.y);
    expect(Math.max(left.y, right.y)).toBeGreaterThan(tip.y);
  });

  it("points downward (tip has the largest y) when angle is 90 degrees -- SVG's y-down convention", () => {
    const { tip, left, right } = arrowheadPoints(100, 50, 90, 8);
    expect(tip.y).toBeGreaterThan(left.y);
    expect(tip.y).toBeGreaterThan(right.y);
  });
});

describe("lineArrowheadPoints", () => {
  it("derives its direction from the line itself -- a horizontal line never produces a vertically-pointing arrowhead", () => {
    // This is the exact defect class found in manual review: a triangle on a
    // horizontal wire that pointed perpendicular to it instead of along it.
    const horizontal = lineArrowheadPoints(0, 50, 100, 50, 8);
    expect(horizontal.tip.y).toBeCloseTo(50, 5);
    expect(horizontal.tip.x).toBeGreaterThan(horizontal.left.x);

    const vertical = lineArrowheadPoints(50, 0, 50, 100, 8);
    expect(vertical.tip.x).toBeCloseTo(50, 5);
    expect(vertical.tip.y).toBeGreaterThan(vertical.left.y);
  });

  it("points leftward for a right-to-left line, not rightward", () => {
    const { tip, left, right } = lineArrowheadPoints(100, 50, 0, 50, 8);
    expect(tip.x).toBeLessThan(left.x);
    expect(tip.x).toBeLessThan(right.x);
  });
});

describe("arcPath", () => {
  it("clockwise (sweepFlag 1) and counterclockwise (sweepFlag 0) share the same start/end points but travel oppositely", () => {
    const cw = arcPath(100, 100, 40, 200, 320, 1);
    const ccw = arcPath(100, 100, 40, 200, 320, 0);
    // Same start angle and same explicit end angle for both -- the endpoint must match exactly.
    expect(cw.endPoint.x).toBeCloseTo(ccw.endPoint.x, 5);
    expect(cw.endPoint.y).toBeCloseTo(ccw.endPoint.y, 5);
    // The sweep flag selects a genuinely different arc (the short way vs. the long way round), so the path data differs.
    expect(cw.path).not.toBe(ccw.path);
    // Tangent (direction of travel) at the end must differ between the two sweep directions.
    expect(Math.abs(cw.tangentAngleDeg - ccw.tangentAngleDeg) % 360).not.toBeCloseTo(0, 0);
  });

  it("produces a path string starting at the start-angle point and ending at the end-angle point", () => {
    const { path, endPoint } = arcPath(0, 0, 10, 0, 90, 1);
    expect(path).toMatch(/^M10,0/); // start point at angle 0: (cx + r, cy) = (10, 0)
    expect(path).toContain(`${endPoint.x},${endPoint.y}`);
  });
});
