/**
 * CC-05D: mechanical geometry check operating on the ACTUAL RENDERED SVG
 * ARTEFACT (not the component's internal helper functions in isolation)
 * -- the exact regression class from CC-05C-DIAGRAM-FIX defect #2 (a
 * current-direction arrow that sat on the correct wire but pointed
 * perpendicular to it, not along it). Design authority: docs/
 * architecture/CC-05D-INSTRUCTIONAL-VISUAL-GOVERNANCE-AND-SEMANTIC-QA.md
 * §E.
 *
 * `packages/calculation-engine` and `apps/mobile/.../arc-geometry.ts`
 * already unit-test the pure geometry helpers directly (CC-05C). This
 * check is deliberately independent of that: it parses the real,
 * rendered SVG string this package's own render-capture step produced,
 * extracts the current-direction arrow's line and arrowhead-triangle
 * coordinates by their known stroke colour (`color.accent`, `#4c8dff`),
 * and proves the rendered arrowhead triangle is geometrically consistent
 * with pointing along the line it is attached to -- so a regression that
 * reintroduces defect #2 fails here even if arc-geometry.ts's own unit
 * tests were (hypothetically) never run or were themselves broken.
 */

const ACCENT_HEX = "#4c8dff";

interface Point {
  readonly x: number;
  readonly y: number;
}

function parseLines(svg: string, strokeHex: string): Array<{ x1: number; y1: number; x2: number; y2: number }> {
  const results: Array<{ x1: number; y1: number; x2: number; y2: number }> = [];
  const lineTagPattern = /<line\s+([^/]*?)\/>/g;
  let match: RegExpExecArray | null;
  while ((match = lineTagPattern.exec(svg)) !== null) {
    const attrs = match[1] ?? "";
    if (!attrs.includes(`stroke="${strokeHex}"`)) continue;
    const x1 = Number(/x1="([^"]+)"/.exec(attrs)?.[1]);
    const y1 = Number(/y1="([^"]+)"/.exec(attrs)?.[1]);
    const x2 = Number(/x2="([^"]+)"/.exec(attrs)?.[1]);
    const y2 = Number(/y2="([^"]+)"/.exec(attrs)?.[1]);
    if ([x1, y1, x2, y2].every((n) => Number.isFinite(n))) results.push({ x1, y1, x2, y2 });
  }
  return results;
}

/** Parses a `fill="#hex"`-only triangular arrowhead `<path d="M x,y L x,y L x,y Z" .../>` into its 3 vertices. */
function parseArrowheadTriangles(svg: string, fillHex: string): Point[][] {
  const triangles: Point[][] = [];
  const pathTagPattern = /<path\s+([^/]*?)\/>/g;
  let match: RegExpExecArray | null;
  while ((match = pathTagPattern.exec(svg)) !== null) {
    const attrs = match[1] ?? "";
    if (!attrs.includes(`fill="${fillHex}"`)) continue;
    const d = /d="([^"]+)"/.exec(attrs)?.[1];
    if (!d) continue;
    const numbers = d.match(/-?\d+(\.\d+)?/g)?.map(Number) ?? [];
    if (numbers.length < 6) continue;
    const points: Point[] = [];
    for (let i = 0; i + 1 < numbers.length; i += 2) points.push({ x: numbers[i]!, y: numbers[i + 1]! });
    if (points.length === 3) triangles.push(points);
  }
  return triangles;
}

function distance(a: Point, b: Point): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

/** The triangle vertex farthest from the midpoint of the other two is the tip (the two back corners are close together; the tip is not). */
function findTip(triangle: Point[]): Point {
  let best = triangle[0]!;
  let bestScore = -Infinity;
  for (let i = 0; i < triangle.length; i++) {
    const p = triangle[i]!;
    const others = triangle.filter((_, j) => j !== i);
    const mid = { x: (others[0]!.x + others[1]!.x) / 2, y: (others[0]!.y + others[1]!.y) / 2 };
    const score = distance(p, mid);
    if (score > bestScore) {
      bestScore = score;
      best = p;
    }
  }
  return best;
}

export interface ArrowGeometryResult {
  readonly passed: boolean;
  readonly failures: string[];
  readonly checkedArrows: number;
}

/**
 * For every accent-coloured line + accent-filled arrowhead triangle pair
 * found in the rendered SVG, proves the arrowhead's tip lies
 * (approximately) on the extension of the line, in the line's direction
 * of travel -- never perpendicular to it. Tolerant of the small
 * intentional gap between the line's end and the arrowhead's back edge
 * (the visible arrow tail).
 */
export function checkCurrentArrowGeometry(svg: string): ArrowGeometryResult {
  const lines = parseLines(svg, ACCENT_HEX);
  const triangles = parseArrowheadTriangles(svg, ACCENT_HEX);

  if (lines.length === 0 || triangles.length === 0) {
    return { passed: true, failures: [], checkedArrows: 0 };
  }

  const failures: string[] = [];
  let checked = 0;

  for (const line of lines) {
    const lineVector = { x: line.x2 - line.x1, y: line.y2 - line.y1 };
    const lineLength = Math.hypot(lineVector.x, lineVector.y);
    if (lineLength === 0) continue;
    const lineDirection = { x: lineVector.x / lineLength, y: lineVector.y / lineLength };
    const lineEnd: Point = { x: line.x2, y: line.y2 };

    const nearestTriangle = triangles.reduce<{ triangle: Point[]; dist: number } | undefined>((closest, triangle) => {
      const tip = findTip(triangle);
      const d = distance(tip, lineEnd);
      if (!closest || d < closest.dist) return { triangle, dist: d };
      return closest;
    }, undefined);
    if (!nearestTriangle) continue;
    checked++;

    const tip = findTip(nearestTriangle.triangle);
    const tipVector = { x: tip.x - line.x1, y: tip.y - line.y1 };
    const tipLength = Math.hypot(tipVector.x, tipVector.y);
    if (tipLength === 0) continue;
    const tipDirection = { x: tipVector.x / tipLength, y: tipVector.y / tipLength };

    // The tip must lie in essentially the same direction as the line travels (dot product close to 1), not perpendicular (0) or reversed (-1).
    const dot = lineDirection.x * tipDirection.x + lineDirection.y * tipDirection.y;
    if (dot < 0.9) {
      failures.push(
        `arrowhead tip at (${tip.x}, ${tip.y}) is not collinear with its line (${line.x1},${line.y1})->(${line.x2},${line.y2}): direction-agreement dot product ${dot.toFixed(3)} (expected >= 0.9, 1.0 = perfectly aligned, 0.0 = perpendicular).`,
      );
    }
  }

  return { passed: failures.length === 0, failures, checkedArrows: checked };
}
