import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";

import type { ProofAuditResult, ProofGenerationMetadata } from "./proof-types.ts";

const REAL_PNG_BASE64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=";

describe("generate-proof-review -- CC-11.8 §H targeted tests: honest, data-driven review generation", () => {
  let tempRepoRoot: string;

  beforeEach(() => {
    tempRepoRoot = mkdtempSync(join(tmpdir(), "alp-proof-review-test-"));
    vi.doMock("../paths.ts", async (importOriginal) => {
      const actual = await importOriginal<typeof import("../paths.ts")>();
      return { ...actual, REPO_ROOT: tempRepoRoot };
    });
  });

  afterEach(() => {
    rmSync(tempRepoRoot, { recursive: true, force: true });
    vi.resetModules();
  });

  function writeFixture(assetId: string, attempt: 1 | 2, verdict: ProofAuditResult["verdict"]) {
    const assetDir = join(tempRepoRoot, "reports", "instructional-visuals", "premium-artwork", "proof", assetId);
    mkdirSync(assetDir, { recursive: true });
    const masterPath = join(assetDir, `${assetId}-master-v${attempt}.png`);
    writeFileSync(masterPath, Buffer.from(REAL_PNG_BASE64, "base64"));
    const metadata: ProofGenerationMetadata = {
      assetId,
      attempt,
      sourceReferenceUrl: "https://example.invalid/ref.svg",
      sourceReferenceSha256: "deadbeef",
      model: "gemini-3.1-flash-image",
      masterPath,
      masterSha256: "cafebabe",
      derivativePath: join(assetDir, `${assetId}-derivative-v${attempt}.png`),
      derivativeSha256: "cafed00d",
      generatedAt: "2026-01-01T00:00:00.000Z",
    };
    writeFileSync(join(assetDir, `${assetId}-metadata-v${attempt}.json`), JSON.stringify(metadata));
    const audit: ProofAuditResult = {
      assetId,
      attempt,
      verdict,
      factChecks: [{ fact: "test fact", result: "PASS", note: "matches reference" }],
      prohibitedChangeChecks: [{ prohibition: "test prohibition", result: "PASS", note: "not violated" }],
      styleComplianceNotes: "matches style guide",
      bakedLabelsFound: false,
      physicalImplausibilityNotes: "",
      overallFindings: "looks correct",
      auditedAt: "2026-01-01T00:05:00.000Z",
    };
    writeFileSync(join(assetDir, `${assetId}-audit-v${attempt}.json`), JSON.stringify(audit));
  }

  it(
    "reports an asset honestly as not-found when no metadata/audit exists yet -- never fabricates a result",
    async () => {
      const { buildProofReviewEntries } = await import("./generate-proof-review.ts");
      const entries = buildProofReviewEntries();
      expect(entries.length).toBeGreaterThan(0);
      for (const e of entries) expect(e.found).toBe(false);
      const html = (await import("./generate-proof-review.ts")).buildProofReviewHtml(entries);
      expect(html).toContain("No completed generation + audit found");
    },
    15000, // vi.doMock + dynamic import can exceed the 5s default under full-suite parallel load (contention, not a hang -- isolated runs complete in ~1-2s).
  );

  it("picks the latest (highest-numbered) attempt that has both metadata and an audit result", async () => {
    writeFixture("unit202.magnet.field", 1, "RETRY");
    writeFixture("unit202.magnet.field", 2, "PASS");
    const { buildProofReviewEntries } = await import("./generate-proof-review.ts");
    const entries = buildProofReviewEntries();
    const magnetEntry = entries.find((e) => e.assetId === "unit202.magnet.field")!;
    expect(magnetEntry.found).toBe(true);
    expect(magnetEntry.latestAttempt).toBe(2);
    expect(magnetEntry.audit?.verdict).toBe("PASS");
  });

  it("embeds the actual generated master image as a data URI, never a placeholder, when one exists", async () => {
    writeFixture("unit202.magnet.field", 1, "PASS");
    const { buildProofReviewEntries, buildProofReviewHtml } = await import("./generate-proof-review.ts");
    const entries = buildProofReviewEntries();
    const magnetEntry = entries.find((e) => e.assetId === "unit202.magnet.field")!;
    expect(magnetEntry.masterDataUri).toMatch(/^data:image\/png;base64,/);
    const html = buildProofReviewHtml(entries);
    expect(html).toContain(magnetEntry.masterDataUri!);
  });

  it("the executive summary counts total Gemini calls made as the sum of attempt numbers across assets", async () => {
    writeFixture("unit202.magnet.field", 1, "PASS");
    writeFixture("unit202.levers.class-1", 2, "PASS");
    const { buildProofReviewEntries, buildProofReviewHtml } = await import("./generate-proof-review.ts");
    const entries = buildProofReviewEntries();
    const html = buildProofReviewHtml(entries);
    expect(html).toContain("3 (of 4 maximum permitted)"); // 1 + 2
  });

  it("HTML includes the mandatory cross-review statement", async () => {
    const { buildProofReviewEntries, buildProofReviewHtml } = await import("./generate-proof-review.ts");
    const html = buildProofReviewHtml(buildProofReviewEntries());
    expect(html).toContain("FOR INDEPENDENT REVIEW BEFORE ANY WIDER PRODUCTION RUN");
  });
});
