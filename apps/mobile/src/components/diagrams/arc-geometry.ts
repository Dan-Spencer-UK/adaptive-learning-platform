/**
 * CC-05C-DIAGRAM-FIX: pure SVG path-geometry helpers for directional
 * indicators (arrowheads, curved arcs) shared across the proving-slice
 * diagram components. Extracted so every "does this arrow actually point
 * the way it claims to" concern is computed the same way in one place,
 * rather than each diagram hand-rolling its own (mis)aligned triangle --
 * see SeriesCircuitDiagram.tsx's corrected current-direction indicator
 * and RightHandGripRuleDiagram.tsx's field-rotation arrow for the two
 * callers this was extracted for. No RN/SVG imports -- easily
 * unit-testable geometry only.
 */

export interface Point {
  readonly x: number;
  readonly y: number;
}

export interface ArrowheadPoints {
  readonly tip: Point;
  readonly left: Point;
  readonly right: Point;
}

/** Arrowhead triangle whose tip sits at (x, y), pointing in the direction `angleDeg` (0 = +x/right, 90 = +y/down, matching SVG's y-down convention). */
export function arrowheadPoints(x: number, y: number, angleDeg: number, size = 7): ArrowheadPoints {
  const rad = (angleDeg * Math.PI) / 180;
  const tip: Point = { x, y };
  const backX = x - size * Math.cos(rad);
  const backY = y - size * Math.sin(rad);
  const perpRad = rad + Math.PI / 2;
  const spread = size * 0.6;
  return {
    tip,
    left: { x: backX + spread * Math.cos(perpRad), y: backY + spread * Math.sin(perpRad) },
    right: { x: backX - spread * Math.cos(perpRad), y: backY - spread * Math.sin(perpRad) },
  };
}

/** Arrowhead triangle for a straight line from (x1,y1) to (x2,y2), pointing at the (x2,y2) end -- the direction is derived from the line itself, so it can never be drawn perpendicular to the path it labels. */
export function lineArrowheadPoints(x1: number, y1: number, x2: number, y2: number, size = 7): ArrowheadPoints {
  const angleDeg = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;
  return arrowheadPoints(x2, y2, angleDeg, size);
}

export function arrowheadPathData(points: ArrowheadPoints): string {
  return `M${points.tip.x},${points.tip.y} L${points.left.x},${points.left.y} L${points.right.x},${points.right.y} Z`;
}

function polarPoint(cx: number, cy: number, r: number, angleDeg: number): Point {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

export interface ArcResult {
  readonly path: string;
  readonly endPoint: Point;
  /** Direction of travel (degrees) at the arc's end point -- feed this straight into `arrowheadPoints` for an arrowhead that is always tangent to the arc, never pointing off it. */
  readonly tangentAngleDeg: number;
}

/**
 * An SVG circular arc path from `startAngleDeg` to `endAngleDeg` around
 * (cx, cy). `sweepFlag: 1` sweeps in the visually clockwise direction (SVG's
 * y-down coordinate system), `0` counterclockwise -- matching SVG's own
 * arc sweep-flag semantics directly, so "clockwise" in calling code always
 * means clockwise on screen.
 */
export function arcPath(
  cx: number,
  cy: number,
  r: number,
  startAngleDeg: number,
  endAngleDeg: number,
  sweepFlag: 0 | 1,
): ArcResult {
  const start = polarPoint(cx, cy, r, startAngleDeg);
  const end = polarPoint(cx, cy, r, endAngleDeg);
  const largeArcFlag = Math.abs(endAngleDeg - startAngleDeg) % 360 > 180 ? 1 : 0;
  const path = `M${start.x},${start.y} A${r},${r} 0 ${largeArcFlag} ${sweepFlag} ${end.x},${end.y}`;
  const tangentAngleDeg = sweepFlag === 1 ? endAngleDeg + 90 : endAngleDeg - 90;
  return { path, endPoint: end, tangentAngleDeg };
}
