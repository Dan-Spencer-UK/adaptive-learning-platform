import { describe, expect, it, beforeEach, afterEach } from "vitest";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  findCurrentDecision,
  isDecisionCurrent,
  loadHumanReviewDecisions,
  saveHumanReviewDecisions,
  upsertDecision,
} from "./human-review.ts";
import type { HumanReviewDecision } from "@alp/content-schema";

const validHash = "a".repeat(64);
const otherHash = "b".repeat(64);

function decision(overrides: Partial<HumanReviewDecision> = {}): HumanReviewDecision {
  return {
    variantId: "v1",
    status: "approved",
    reviewer: "product-owner",
    timestamp: "2026-08-17T00:00:00.000Z",
    imageHash: validHash,
    contractHash: validHash,
    ...overrides,
  };
}

describe("isDecisionCurrent / findCurrentDecision", () => {
  it("a decision is current when both hashes match", () => {
    expect(isDecisionCurrent(decision(), { imageHash: validHash, contractHash: validHash })).toBe(true);
  });

  it("a decision is NOT current once the image changes (re-rendered artefact)", () => {
    expect(isDecisionCurrent(decision(), { imageHash: otherHash, contractHash: validHash })).toBe(false);
  });

  it("a decision is NOT current once the contract changes", () => {
    expect(isDecisionCurrent(decision(), { imageHash: validHash, contractHash: otherHash })).toBe(false);
  });

  it("findCurrentDecision returns undefined for a stale decision rather than a false positive", () => {
    const decisions = [decision()];
    const found = findCurrentDecision(decisions, "v1", { imageHash: otherHash, contractHash: validHash });
    expect(found).toBeUndefined();
  });

  it("findCurrentDecision returns the decision when it is current", () => {
    const decisions = [decision()];
    const found = findCurrentDecision(decisions, "v1", { imageHash: validHash, contractHash: validHash });
    expect(found?.status).toBe("approved");
  });
});

describe("upsertDecision", () => {
  it("adds a new decision for a variant with no prior decision", () => {
    const result = upsertDecision([], decision());
    expect(result).toHaveLength(1);
  });

  it("replaces the prior decision for the same variant rather than appending a duplicate", () => {
    const first = decision({ status: "approved" });
    const second = decision({ status: "rejected", reason: "field rotation arrow still looks wrong" });
    const result = upsertDecision([first], second);
    expect(result).toHaveLength(1);
    expect(result[0]?.status).toBe("rejected");
  });

  it("leaves decisions for other variants untouched", () => {
    const other = decision({ variantId: "v2" });
    const updated = decision({ variantId: "v1", status: "rejected" });
    const result = upsertDecision([other, decision()], updated);
    expect(result).toHaveLength(2);
    expect(result.find((d) => d.variantId === "v2")).toEqual(other);
  });
});

describe("loadHumanReviewDecisions / saveHumanReviewDecisions", () => {
  let dir: string;

  beforeEach(() => {
    dir = mkdtempSync(join(tmpdir(), "cc05d-human-review-"));
  });

  afterEach(() => {
    rmSync(dir, { recursive: true, force: true });
  });

  it("returns an empty array when no file exists yet", () => {
    expect(loadHumanReviewDecisions(join(dir, "nonexistent.json"))).toEqual([]);
  });

  it("round-trips decisions through save then load", () => {
    const path = join(dir, "nested", "human-review.json");
    saveHumanReviewDecisions(path, [decision(), decision({ variantId: "v2", status: "rejected" })]);
    const loaded = loadHumanReviewDecisions(path);
    expect(loaded).toHaveLength(2);
    expect(loaded.map((d) => d.variantId).sort()).toEqual(["v1", "v2"]);
  });

  it("rejects malformed content on load rather than silently accepting it", () => {
    const path = join(dir, "bad.json");
    saveHumanReviewDecisions(path, [decision()]);
    // Corrupt the saved file with an invalid status value.
    const raw = JSON.parse(readFileSync(path, "utf8"));
    raw[0].status = "looks_fine_probably";
    writeFileSync(path, JSON.stringify(raw));
    expect(() => loadHumanReviewDecisions(path)).toThrow();
  });
});
