import { describe, expect, it } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { ROADMAP, currentPositionItem } from "./roadmap-data.ts";

describe("roadmap-data -- CC-11.8 §G1 targeted tests", () => {
  it("every item has a unique id", () => {
    const ids = ROADMAP.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every dependsOn reference points at a real item id -- never a dangling dependency", () => {
    const ids = new Set(ROADMAP.map((item) => item.id));
    for (const item of ROADMAP) {
      for (const dep of item.dependsOn) {
        expect(ids.has(dep), `${item.id} depends on unknown id "${dep}"`).toBe(true);
      }
    }
  });

  it("exactly one item is marked as the current position", () => {
    const current = ROADMAP.filter((item) => item.isCurrentPosition);
    expect(current.length).toBe(1);
    expect(currentPositionItem()?.id).toBe(current[0]!.id);
  });

  it("the current position item is IN_PROGRESS, not COMPLETE or NOT_STARTED", () => {
    expect(currentPositionItem()?.status).toBe("IN_PROGRESS");
  });

  it("status is always one of the 4 closed values (task brief §G1 schema)", () => {
    const allowed = new Set(["NOT_STARTED", "IN_PROGRESS", "BLOCKED", "COMPLETE"]);
    for (const item of ROADMAP) expect(allowed.has(item.status), `${item.id} has invalid status ${item.status}`).toBe(true);
  });

  it("CC-12 is present and NOT_STARTED -- the brief explicitly forbids beginning it in this package", () => {
    const cc12 = ROADMAP.find((item) => item.id === "cc-12");
    expect(cc12?.status).toBe("NOT_STARTED");
  });

  it("the platform-flow Mermaid source file exists and is non-trivial", () => {
    const flowPath = join(import.meta.dirname, "platform-flow.mmd");
    expect(existsSync(flowPath)).toBe(true);
    const text = readFileSync(flowPath, "utf8");
    expect(text.length).toBeGreaterThan(500);
    expect(text).toContain("flowchart");
  });
});
