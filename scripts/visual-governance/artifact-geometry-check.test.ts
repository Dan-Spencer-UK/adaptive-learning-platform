import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { checkCurrentArrowGeometry } from "./artifact-geometry-check.ts";

const RENDERS_DIR = join(import.meta.dirname, "..", "..", "reports", "instructional-visuals", "renders");

function realSeriesCircuitSvg(): string | undefined {
  let files: string[];
  try {
    files = readdirSync(RENDERS_DIR);
  } catch {
    return undefined;
  }
  const file = files.find((f) => f.startsWith("visual-contract.series-circuit-current-direction"));
  return file ? readFileSync(join(RENDERS_DIR, file), "utf8") : undefined;
}

describe("checkCurrentArrowGeometry", () => {
  it("passes when no accent-coloured line/arrowhead exist at all (nothing to check)", () => {
    const result = checkCurrentArrowGeometry("<svg></svg>");
    expect(result.passed).toBe(true);
    expect(result.checkedArrows).toBe(0);
  });

  it("passes for a hand-constructed arrow that correctly points along its line (rightward)", () => {
    const svg = `<svg><line x1="194" y1="116" x2="226" y2="116" stroke="#4c8dff" stroke-width="2.5" /><path d="M226,116 L219,120.2 L219,111.8 Z" fill="#4c8dff" /></svg>`;
    const result = checkCurrentArrowGeometry(svg);
    expect(result.passed).toBe(true);
    expect(result.checkedArrows).toBe(1);
  });

  it("FAILS for a hand-constructed arrow whose arrowhead points perpendicular to its line -- reproducing the exact CC-05C-DIAGRAM-FIX defect class", () => {
    // The line runs rightward (x1,y1)->(x2,y2), but the arrowhead's tip points straight down instead of continuing rightward.
    const svg = `<svg><line x1="194" y1="116" x2="226" y2="116" stroke="#4c8dff" stroke-width="2.5" /><path d="M226,140 L219,116 L233,116 Z" fill="#4c8dff" /></svg>`;
    const result = checkCurrentArrowGeometry(svg);
    expect(result.passed).toBe(false);
    expect(result.failures).toHaveLength(1);
    expect(result.failures[0]).toMatch(/not collinear/);
  });

  it("FAILS for an arrowhead pointing backward along the line (reversed direction)", () => {
    const svg = `<svg><line x1="194" y1="116" x2="226" y2="116" stroke="#4c8dff" stroke-width="2.5" /><path d="M188,116 L195,120.2 L195,111.8 Z" fill="#4c8dff" /></svg>`;
    const result = checkCurrentArrowGeometry(svg);
    expect(result.passed).toBe(false);
  });

  it.skipIf(!realSeriesCircuitSvg())("passes against the real, currently-rendered series-circuit artefact", () => {
    const svg = realSeriesCircuitSvg()!;
    const result = checkCurrentArrowGeometry(svg);
    expect(result.checkedArrows).toBeGreaterThan(0);
    expect(result.passed).toBe(true);
  });
});
