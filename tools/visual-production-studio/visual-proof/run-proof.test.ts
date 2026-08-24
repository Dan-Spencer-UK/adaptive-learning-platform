import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";

const FAKE_MASTER_BYTES = Buffer.from("fake-master-png-bytes");

vi.mock("../gemini-client.ts", () => ({
  generateImage: vi.fn().mockResolvedValue({
    image: { mimeType: "image/png", bytes: FAKE_MASTER_BYTES },
    responseText: "generated",
    model: "gemini-3.1-flash-image",
    requestedAt: "2026-01-01T00:00:00.000Z",
  }),
}));

vi.mock("../reference-acquisition.ts", () => ({
  acquireReference: vi.fn().mockResolvedValue({
    assetId: "unit202.magnet.field",
    sourceUrl: "https://example.invalid/ref.svg",
    localPath: "/fake/ref.svg",
    mimeType: "image/svg+xml",
    sha256: "deadbeef",
    byteLength: 100,
  }),
  asInlineImage: vi.fn().mockReturnValue({ mimeType: "image/png", bytes: Buffer.from("ref") }),
}));

vi.mock("./prompt-builder-gemini.ts", () => ({
  buildGeminiPrompt: vi.fn().mockReturnValue("fake prompt text"),
}));

vi.mock("./derivative.ts", () => ({
  createMobileDerivative: vi.fn().mockImplementation(async (_bytes: Buffer, outPath: string) => {
    const { writeFileSync } = await import("node:fs");
    writeFileSync(outPath, Buffer.from("fake-derivative"));
  }),
}));

describe("run-proof -- CC-11.8 §H targeted tests: versioned output, never overwrite", () => {
  let tempRepoRoot: string;

  beforeEach(() => {
    tempRepoRoot = mkdtempSync(join(tmpdir(), "alp-proof-test-"));
    vi.doMock("../paths.ts", async (importOriginal) => {
      const actual = await importOriginal<typeof import("../paths.ts")>();
      return { ...actual, REPO_ROOT: tempRepoRoot };
    });
  });

  afterEach(() => {
    rmSync(tempRepoRoot, { recursive: true, force: true });
    vi.resetModules();
  });

  it("saves attempt 1 as v1 with full provenance metadata (assetId, reference sha, model, master/derivative paths+sha, timestamp)", async () => {
    const { runProof } = await import("./run-proof.ts");
    const metadata = await runProof("unit202.magnet.field");

    expect(metadata.attempt).toBe(1);
    expect(metadata.assetId).toBe("unit202.magnet.field");
    expect(metadata.masterPath).toContain("unit202.magnet.field-master-v1.png");
    expect(metadata.derivativePath).toContain("unit202.magnet.field-derivative-v1.png");
    expect(metadata.model).toBe("gemini-3.1-flash-image");
    expect(metadata.sourceReferenceSha256).toBe("deadbeef");
    expect(existsSync(metadata.masterPath)).toBe(true);
    expect(readFileSync(metadata.masterPath).equals(FAKE_MASTER_BYTES)).toBe(true);
  });

  it("refuses to overwrite an existing versioned master on a second attempt-1 call", async () => {
    const { runProof } = await import("./run-proof.ts");
    await runProof("unit202.magnet.field");
    await expect(runProof("unit202.magnet.field")).rejects.toThrow(/already exists/);
  });

  it("a --correction attempt saves as v2 without touching the v1 master, and refuses if v1 does not exist yet", async () => {
    const { runProof } = await import("./run-proof.ts");
    await expect(runProof("unit202.levers.class-1", "fix the fulcrum position")).rejects.toThrow(/attempt 2.*before attempt 1/i);

    await runProof("unit202.levers.class-1");
    const v2 = await runProof("unit202.levers.class-1", "fix the fulcrum position");
    expect(v2.attempt).toBe(2);
    expect(v2.masterPath).toContain("unit202.levers.class-1-master-v2.png");
    expect(existsSync(v2.masterPath.replace("-v2.png", "-v1.png"))).toBe(true); // v1 untouched
  });

  it("throws a clear error for an assetId with no registered proof spec", async () => {
    const { runProof } = await import("./run-proof.ts");
    await expect(runProof("unit202.does-not-exist")).rejects.toThrow(/No proof spec registered/);
  });
});
