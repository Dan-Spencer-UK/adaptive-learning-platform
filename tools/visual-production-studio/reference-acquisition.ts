/**
 * CC-11.8 §20: local reference acquisition + validation, one stage of the
 * governed production path (docs/architecture/
 * PREMIUM-INSTRUCTIONAL-VISUAL-PRODUCTION-PIPELINE.md §20):
 *
 *   APPROVED REFERENCE CATALOGUE -> LOCAL REFERENCE ACQUISITION -> REFERENCE VALIDATION
 *
 * Downloads and caches the ACTUAL reference file (never trusts a URL
 * string alone -- the generative model must receive real bytes), verifies
 * it is genuine image/SVG data rather than an HTML error/redirect page,
 * and computes its SHA-256 for provenance. For an SVG reference, also
 * rasterises a clean high-resolution PNG copy via Playwright (already a
 * repo dependency -- see scripts/visual-governance/generate-review-package.ts
 * for the same "Playwright renders, no new image library" pattern), since
 * Gemini's image-input API expects a raster format.
 */

import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { chromium } from "@playwright/test";

import { REPO_ROOT } from "./paths.ts";
import type { InlineImage } from "./gemini-client.ts";

export const REFERENCE_CACHE_DIR = join(REPO_ROOT, "tools", "visual-production-studio", "reference-cache");

export interface AcquiredReference {
  assetId: string;
  sourceUrl: string;
  localPath: string;
  mimeType: string;
  sha256: string;
  byteLength: number;
  /** Present only when the source was SVG -- the rasterised PNG copy actually sent to Gemini. */
  rasterPath?: string;
  rasterSha256?: string;
}

function sha256(buffer: Buffer): string {
  return createHash("sha256").update(buffer).digest("hex");
}

/**
 * Real, minimal magic-byte sniffing -- enough to reject an HTML
 * error/redirect page (task brief E2: "verify it is actual image/SVG
 * data, not an HTML error/download page"), not a full format parser.
 */
function detectRealImageOrSvg(buffer: Buffer): "svg" | "png" | "jpeg" | "webp" | null {
  const head = buffer.subarray(0, 16);
  if (head.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return "png";
  if (head[0] === 0xff && head[1] === 0xd8 && head[2] === 0xff) return "jpeg";
  if (head.subarray(0, 4).toString("ascii") === "RIFF" && buffer.subarray(8, 12).toString("ascii") === "WEBP") return "webp";
  const textHead = buffer.subarray(0, Math.min(buffer.length, 500)).toString("utf8").trimStart().toLowerCase();
  if (textHead.startsWith("<?xml") || textHead.startsWith("<svg")) {
    // Reject an HTML page that merely contains the substring "<svg" somewhere in a script tag etc. -- require it near the very start, and reject anything that looks like an HTML document shell.
    if (textHead.includes("<html") || textHead.includes("<!doctype html")) return null;
    if (textHead.startsWith("<?xml") || textHead.startsWith("<svg")) return "svg";
  }
  return null;
}

/**
 * Downloads a reference file, validates it is real image/SVG data, caches
 * it locally with a deterministic filename, and (for SVG) rasterises a
 * clean PNG copy. Idempotent -- re-running with the same assetId/URL
 * reuses the existing cached file rather than re-downloading, but always
 * re-validates and re-hashes what is on disk.
 */
export async function acquireReference(assetId: string, sourceUrl: string): Promise<AcquiredReference> {
  mkdirSync(REFERENCE_CACHE_DIR, { recursive: true });

  const extGuess = sourceUrl.toLowerCase().endsWith(".svg") ? "svg" : sourceUrl.toLowerCase().match(/\.(png|jpe?g|webp)$/)?.[1] || "bin";
  const localPath = join(REFERENCE_CACHE_DIR, `${assetId}.${extGuess === "jpg" ? "jpeg" : extGuess}`);

  let buffer: Buffer;
  if (existsSync(localPath)) {
    buffer = readFileSync(localPath);
  } else {
    const res = await fetch(sourceUrl, { redirect: "follow" });
    if (!res.ok) throw new Error(`Reference fetch failed for ${assetId}: HTTP ${res.status} ${res.statusText} (${sourceUrl})`);
    buffer = Buffer.from(await res.arrayBuffer());
    writeFileSync(localPath, buffer);
  }

  const kind = detectRealImageOrSvg(buffer);
  if (!kind) {
    throw new Error(`REFERENCE_UNSUITABLE: ${assetId}'s downloaded content at ${sourceUrl} is not recognisable image/SVG data (looks like an HTML page or unknown format) -- ${buffer.length} bytes cached at ${localPath} for inspection.`);
  }

  const mimeType = kind === "svg" ? "image/svg+xml" : `image/${kind}`;
  const result: AcquiredReference = { assetId, sourceUrl, localPath, mimeType, sha256: sha256(buffer), byteLength: buffer.length };

  if (kind === "svg") {
    const rasterPath = join(REFERENCE_CACHE_DIR, `${assetId}.raster.png`);
    if (!existsSync(rasterPath)) {
      await rasteriseSvg(buffer, rasterPath);
    }
    const rasterBuffer = readFileSync(rasterPath);
    result.rasterPath = rasterPath;
    result.rasterSha256 = sha256(rasterBuffer);
  }

  return result;
}

/** Renders an SVG buffer to a clean, high-resolution PNG using a headless browser -- no new raster/SVG library dependency. */
async function rasteriseSvg(svgBuffer: Buffer, outPath: string): Promise<void> {
  const svgText = svgBuffer.toString("utf8");
  const html = `<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0;padding:0;background:#fff;}</style></head><body>${svgText}</body></html>`;

  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ viewport: { width: 1600, height: 1200 }, deviceScaleFactor: 2 });
    await page.setContent(html, { waitUntil: "networkidle" });
    const svgEl = page.locator("svg").first();
    await svgEl.waitFor({ state: "attached" });
    const buffer = await svgEl.screenshot({ omitBackground: false });
    writeFileSync(outPath, buffer);
  } finally {
    await browser.close();
  }
}

/** Loads a previously-acquired reference's bytes as an InlineImage ready for gemini-client.ts, preferring the rasterised copy for an SVG source. */
export function asInlineImage(ref: AcquiredReference): InlineImage {
  if (ref.rasterPath) {
    return { mimeType: "image/png", bytes: readFileSync(ref.rasterPath) };
  }
  return { mimeType: ref.mimeType, bytes: readFileSync(ref.localPath) };
}
