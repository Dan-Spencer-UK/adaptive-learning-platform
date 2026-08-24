import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { existsSync, mkdtempSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { createHash } from "node:crypto";

// Real PNG magic bytes (1x1 transparent pixel) so the "is this real image data" check has a genuine positive case without hitting the network.
const REAL_PNG_BASE64 =
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=";

describe("reference-acquisition -- CC-11.8 §H targeted tests", () => {
  let tempCacheDir: string;
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    tempCacheDir = mkdtempSync(join(tmpdir(), "alp-ref-cache-test-"));
  });

  afterEach(() => {
    rmSync(tempCacheDir, { recursive: true, force: true });
    globalThis.fetch = originalFetch;
    vi.resetModules();
  });

  // Higher timeout on all three: vi.doMock + dynamic import under full-suite
  // parallel execution can exceed the 5s default on a loaded machine
  // (verified isolated runs complete in ~1-2s -- this is contention under
  // many concurrent test files, not a hang in the code under test).
  const SLOW_TEST_TIMEOUT = 15000;

  it(
    "accepts real PNG bytes and computes a correct SHA-256",
    async () => {
      const pngBuffer = Buffer.from(REAL_PNG_BASE64, "base64");
      globalThis.fetch = vi.fn().mockResolvedValue({ ok: true, status: 200, statusText: "OK", arrayBuffer: async () => pngBuffer.buffer.slice(pngBuffer.byteOffset, pngBuffer.byteOffset + pngBuffer.byteLength) }) as unknown as typeof fetch;

      vi.doMock("./paths.ts", async (importOriginal) => {
        const actual = await importOriginal<typeof import("./paths.ts")>();
        return { ...actual, REPO_ROOT: tempCacheDir };
      });
      const { acquireReference } = await import("./reference-acquisition.ts");

      const result = await acquireReference("test.asset.png", "https://example.invalid/fake.png");
      expect(result.mimeType).toBe("image/png");
      expect(result.rasterPath).toBeUndefined();
      expect(result.sha256).toBe(createHash("sha256").update(pngBuffer).digest("hex"));
      expect(existsSync(result.localPath)).toBe(true);
    },
    SLOW_TEST_TIMEOUT,
  );

  it(
    "rejects an HTML error/redirect page as REFERENCE_UNSUITABLE rather than silently accepting it",
    async () => {
      const htmlBuffer = Buffer.from("<!doctype html><html><body>404 Not Found</body></html>", "utf8");
      globalThis.fetch = vi.fn().mockResolvedValue({ ok: true, status: 200, statusText: "OK", arrayBuffer: async () => htmlBuffer.buffer.slice(htmlBuffer.byteOffset, htmlBuffer.byteOffset + htmlBuffer.byteLength) }) as unknown as typeof fetch;

      vi.doMock("./paths.ts", async (importOriginal) => {
        const actual = await importOriginal<typeof import("./paths.ts")>();
        return { ...actual, REPO_ROOT: tempCacheDir };
      });
      const { acquireReference } = await import("./reference-acquisition.ts");

      await expect(acquireReference("test.asset.html", "https://example.invalid/error.svg")).rejects.toThrow(/REFERENCE_UNSUITABLE/);
    },
    SLOW_TEST_TIMEOUT,
  );

  it(
    "propagates a clear error on a non-OK HTTP response rather than caching a broken file",
    async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({ ok: false, status: 404, statusText: "Not Found" }) as unknown as typeof fetch;

      vi.doMock("./paths.ts", async (importOriginal) => {
        const actual = await importOriginal<typeof import("./paths.ts")>();
        return { ...actual, REPO_ROOT: tempCacheDir };
      });
      const { acquireReference } = await import("./reference-acquisition.ts");

      await expect(acquireReference("test.asset.missing", "https://example.invalid/missing.png")).rejects.toThrow(/HTTP 404/);
    },
    SLOW_TEST_TIMEOUT,
  );
});
