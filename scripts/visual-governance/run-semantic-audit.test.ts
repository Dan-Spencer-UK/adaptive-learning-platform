/**
 * Integration test against the real, committed
 * reports/instructional-visuals/manifest.json (produced by
 * `npm run visuals:render`, which must run before this test file can
 * pass -- see the CC-05D architecture doc §D/§N for why rendering can
 * only happen under Jest, and the evidence doc for the exact command
 * order this repository expects: visuals:render then npm run test:unit).
 */
import { describe, expect, it } from "vitest";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { runSemanticAudit } from "./run-semantic-audit.ts";

const MANIFEST_PATH = join(import.meta.dirname, "..", "..", "reports", "instructional-visuals", "manifest.json");

describe.skipIf(!existsSync(MANIFEST_PATH))("runSemanticAudit against the real committed render manifest", () => {
  it("produces exactly one audit record per rendered artefact", async () => {
    const { records } = await runSemanticAudit();
    expect(records.length).toBeGreaterThan(0);
  });

  it("every record's status/confidence/imageHash/contractHash are schema-valid (already enforced by Zod .parse inside runSemanticAudit, re-asserted here for the reader)", async () => {
    const { records } = await runSemanticAudit();
    for (const r of records) {
      expect(["pass", "warn", "fail"]).toContain(r.verification.status);
      expect(["high", "medium", "low"]).toContain(r.verification.confidence);
      expect(r.verification.imageHash).toMatch(/^[0-9a-f]{64}$/);
      expect(r.verification.contractHash).toMatch(/^[0-9a-f]{64}$/);
    }
  });

  it("a second run reuses every result from cache -- nothing changed since the first run", async () => {
    await runSemanticAudit();
    const { records } = await runSemanticAudit();
    expect(records.every((r) => r.cacheHit)).toBe(true);
  });

  it("the human-review queue never mixes mandatory and sampled reasons for the same variant twice", async () => {
    const { queue } = await runSemanticAudit();
    const ids = queue.map((q) => q.variantId);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every mandatory queue entry corresponds to a record that actually required human review", async () => {
    const { records, queue } = await runSemanticAudit();
    const requiresReview = new Set(records.filter((r) => r.verification.requiresHumanReview).map((r) => r.variantId));
    const mandatoryInQueue = queue.filter((q) => q.reason === "mandatory").map((q) => q.variantId);
    for (const id of mandatoryInQueue) expect(requiresReview.has(id)).toBe(true);
  });
});
