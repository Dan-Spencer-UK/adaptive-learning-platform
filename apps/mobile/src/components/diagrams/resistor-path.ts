/**
 * CC-05C: pure SVG path-string generators for the standard zigzag resistor
 * symbol, axis-aligned (the only orientations this proving slice's series/
 * parallel diagrams need). No RN/SVG imports -- easily unit-testable, and
 * reused by both SeriesCircuitDiagram (horizontal) and
 * ParallelCircuitDiagram (vertical).
 */

/** Horizontal zigzag resistor body path centred on `y`, spanning [x, x+width]. */
export function horizontalResistorPath(x: number, y: number, width: number, amplitude = 8, peaks = 6): string {
  const segment = width / peaks;
  let d = `M${x},${y}`;
  for (let i = 0; i < peaks; i++) {
    const px = x + segment * (i + 0.5);
    const py = i % 2 === 0 ? y - amplitude : y + amplitude;
    d += ` L${px},${py}`;
  }
  d += ` L${x + width},${y}`;
  return d;
}

/** Vertical zigzag resistor body path centred on `x`, spanning [y, y+height]. */
export function verticalResistorPath(x: number, y: number, height: number, amplitude = 8, peaks = 6): string {
  const segment = height / peaks;
  let d = `M${x},${y}`;
  for (let i = 0; i < peaks; i++) {
    const py = y + segment * (i + 0.5);
    const px = i % 2 === 0 ? x - amplitude : x + amplitude;
    d += ` L${px},${py}`;
  }
  d += ` L${x},${y + height}`;
  return d;
}
