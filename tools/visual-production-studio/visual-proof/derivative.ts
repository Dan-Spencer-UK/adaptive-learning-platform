/**
 * CC-11.8 §20 task brief E5: "one mobile production derivative." Produces
 * a resized PNG via Playwright (already a repo dependency -- no new
 * image-processing library) rather than saving the raw master at mobile
 * scale unresized.
 */

import { writeFileSync } from "node:fs";
import { chromium } from "@playwright/test";

/** Mobile production derivative target width -- matches the phone-viewport convention already used by scripts/visual-governance/generate-review-package.ts (390px logical width) scaled up 2x for a retina-appropriate raster derivative. */
const DERIVATIVE_WIDTH = 780;

export async function createMobileDerivative(masterPngBuffer: Buffer, outPath: string): Promise<void> {
  const base64 = masterPngBuffer.toString("base64");
  const html = `<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0;padding:0;background:transparent;}img{display:block;width:${DERIVATIVE_WIDTH}px;height:auto;}</style></head><body><img src="data:image/png;base64,${base64}" /></body></html>`;

  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ viewport: { width: DERIVATIVE_WIDTH, height: DERIVATIVE_WIDTH } });
    await page.setContent(html, { waitUntil: "networkidle" });
    const img = page.locator("img");
    await img.waitFor({ state: "visible" });
    const buffer = await img.screenshot({ omitBackground: true });
    writeFileSync(outPath, buffer);
  } finally {
    await browser.close();
  }
}
