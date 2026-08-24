/**
 * CC-11.9 §9/§10: deterministic reference PREPARATION -- turning an
 * acquired-but-raw source (a composite multi-subfigure file, a PDF page,
 * or two separate sources that need to sit side by side) into the one
 * technically unambiguous image Gemini actually receives.
 *
 * These outputs are never learner-facing artwork -- they are boring,
 * technically clear working inputs, matching the brief's own "do not
 * beautify reference sheets" instruction. Built entirely on tools already
 * used elsewhere in this pipeline: Playwright screenshots for
 * cropping/composition (same technique as reference-acquisition.ts's SVG
 * rasteriser), and the system `pdftoppm` binary (Poppler, already
 * installed on this machine -- not a new npm dependency) for PDF page
 * extraction.
 */

import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, dirname, join } from "node:path";

import { chromium } from "@playwright/test";

import { REPO_ROOT } from "./paths.ts";

/** Minimal ambient typing for the one `page.evaluate()` browser-context callback below -- this file's own tsconfig has no DOM lib (it is a Node script), but the callback body executes inside Playwright's browser context, not Node. */
declare const document: { getElementById(id: string): { naturalWidth: number; naturalHeight: number } | null };

export const PREPARED_REFERENCE_DIR = join(REPO_ROOT, "tools", "visual-production-studio", "reference-cache", "prepared");

function sha256(buffer: Buffer): string {
  return createHash("sha256").update(buffer).digest("hex");
}

export interface PreparedReference {
  outPath: string;
  sha256: string;
  sourceShas: string[];
  transformation: string;
  preparedAt: string;
}

function record(outPath: string, sourceShas: string[], transformation: string): PreparedReference {
  return { outPath, sha256: sha256(readFileSync(outPath)), sourceShas, transformation, preparedAt: new Date().toISOString() };
}

/**
 * Crops a rectangular fraction (0..1 each) out of a source raster image --
 * e.g. isolating one of several stacked subfigures in a composite
 * reference (the lever-classes file's top/middle/bottom thirds).
 */
export async function cropReference(
  sourcePngPath: string,
  fraction: { x: number; y: number; width: number; height: number },
  outPath: string,
): Promise<PreparedReference> {
  mkdirSync(PREPARED_REFERENCE_DIR, { recursive: true });
  const sourceBuffer = readFileSync(sourcePngPath);
  const sourceB64 = sourceBuffer.toString("base64");

  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    await page.setContent(
      `<!doctype html><html><body style="margin:0;padding:0;"><img id="src" src="data:image/png;base64,${sourceB64}" /></body></html>`,
    );
    const dims = await page.evaluate(() => {
      const img = document.getElementById("src");
      if (!img) throw new Error("source <img> not found in prepared reference page");
      return { width: img.naturalWidth, height: img.naturalHeight };
    });
    const clip = {
      x: Math.round(dims.width * fraction.x),
      y: Math.round(dims.height * fraction.y),
      width: Math.round(dims.width * fraction.width),
      height: Math.round(dims.height * fraction.height),
    };
    await page.setViewportSize({ width: dims.width, height: dims.height });
    const buffer = await page.screenshot({ clip });
    writeFileSync(outPath, buffer);
    return record(outPath, [sha256(sourceBuffer)], `crop fraction ${JSON.stringify(fraction)} from ${sourcePngPath}`);
  } finally {
    await browser.close();
  }
}

export interface ComposePanel {
  imagePath: string;
  label: string;
}

/**
 * Composes 1-2 approved source images side by side with plain technical
 * labels and an optional caption -- for MULTI_REFERENCE_SHEET /
 * INTERNAL_REFERENCE_SHEET assets. Deliberately plain: white background,
 * black text, no styling beyond what makes the two panels legible.
 */
export async function composeReferenceSheet(panels: ComposePanel[], caption: string, outPath: string): Promise<PreparedReference> {
  mkdirSync(PREPARED_REFERENCE_DIR, { recursive: true });
  const sourceShas: string[] = [];
  const panelHtml = panels
    .map((p) => {
      const buf = readFileSync(p.imagePath);
      sourceShas.push(sha256(buf));
      const b64 = buf.toString("base64");
      const ext = p.imagePath.toLowerCase().endsWith(".svg") ? "svg+xml" : "png";
      return `<div style="display:flex;flex-direction:column;align-items:center;margin:16px;">
        <img src="data:image/${ext};base64,${b64}" style="max-width:520px;max-height:520px;object-fit:contain;border:1px solid #ccc;" />
        <div style="margin-top:8px;font:16px sans-serif;color:#111;text-align:center;">${p.label}</div>
      </div>`;
    })
    .join("\n");

  const html = `<!doctype html><html><body style="margin:0;padding:24px;background:#ffffff;">
    <div style="display:flex;flex-direction:row;justify-content:center;align-items:flex-start;">${panelHtml}</div>
    <div style="margin-top:12px;font:14px sans-serif;color:#333;text-align:center;max-width:1100px;">${caption}</div>
  </body></html>`;

  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ viewport: { width: 1200, height: 800 } });
    await page.setContent(html, { waitUntil: "networkidle" });
    const body = page.locator("body");
    const buffer = await body.screenshot();
    writeFileSync(outPath, buffer);
    return record(outPath, sourceShas, `compose ${panels.length} panel(s): ${panels.map((p) => p.label).join(" | ")} -- caption: ${caption}`);
  } finally {
    await browser.close();
  }
}

/** Extracts one page of a PDF to a high-resolution PNG via the system `pdftoppm` (Poppler) binary. */
export function extractPdfPage(pdfPath: string, pageNumber: number, outPathBase: string): PreparedReference {
  mkdirSync(PREPARED_REFERENCE_DIR, { recursive: true });
  execFileSync("pdftoppm", ["-png", "-r", "200", "-f", String(pageNumber), "-l", String(pageNumber), pdfPath, outPathBase]);
  // pdftoppm zero-pads the page-number suffix to the width of the document's total page count
  // (e.g. "-021" for a 127-page PDF), so search by prefix rather than guessing the exact width.
  const dir = dirname(outPathBase);
  const base = basename(outPathBase);
  const found = readdirSync(dir)
    .filter((f) => f.startsWith(base) && f.endsWith(".png"))
    .map((f) => join(dir, f))[0];
  if (!found) throw new Error(`pdftoppm did not produce an expected output file for page ${pageNumber} of ${pdfPath} (base: ${outPathBase})`);
  return record(found, [sha256(readFileSync(pdfPath))], `pdftoppm page ${pageNumber} @ 200dpi from ${pdfPath}`);
}
