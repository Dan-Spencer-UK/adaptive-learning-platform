/**
 * CC-11.11 §14: the FINAL Unit 202 visual review package, organised at
 * STATE level (not asset level) and grouped by VisualFamily -- built
 * directly from the state-level completeness matrix
 * (`generate-final-state-completeness.ts`), the single source of truth for
 * "what is every governed state, and how is it resolved".
 *
 * Same lesson as §13's JSON-bloat fix: the JSON output here never embeds
 * base64 image data -- only the HTML (used to render the PDF) does.
 */
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { chromium } from "@playwright/test";

import { REPO_ROOT } from "../paths.ts";
import { REFERENCE_CACHE_DIR } from "../reference-acquisition.ts";
import { buildCompletenessMatrix, summariseMatrix, type StateCompletenessRecord } from "../generate-final-state-completeness.ts";

const PDF_PATH = join(REPO_ROOT, "reports", "instructional-visuals", "unit202-final-visual-suite-review.pdf");
const JSON_PATH = join(REPO_ROOT, "reports", "instructional-visuals", "unit202-final-visual-suite-review.json");

function esc(text: string): string {
  return String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function imageDataUri(path: string | undefined): string | undefined {
  if (!path || !existsSync(path)) return undefined;
  const ext = path.toLowerCase().endsWith(".png") ? "png" : "jpeg";
  return `data:image/${ext};base64,${readFileSync(path).toString("base64")}`;
}

function referencePathFor(assetId: string): string | undefined {
  const preparedPath = join(REFERENCE_CACHE_DIR, "prepared", `${assetId}.prepared.png`);
  if (existsSync(preparedPath)) return preparedPath;
  const rasterPath = join(REFERENCE_CACHE_DIR, `${assetId}.raster.png`);
  if (existsSync(rasterPath)) return rasterPath;
  for (const ext of ["png", "jpeg", "jpg"]) {
    const p = join(REFERENCE_CACHE_DIR, `${assetId}.${ext}`);
    if (existsSync(p)) return p;
  }
  return undefined;
}

function statePageHtml(r: StateCompletenessRecord): string {
  const verdictClass = r.approvalStatus === "PASS" ? "notice-good" : r.approvalStatus.startsWith("N/A") ? "notice-neutral" : r.approvalStatus === "HUMAN_REVIEW_REQUIRED" ? "notice-bad" : "notice-warn";
  const masterUri = imageDataUri(r.resolvedPath);
  const refUri = r.resolutionType === "GENERATED" || r.resolutionType === "SHARED_BASE_VALID" ? imageDataUri(referencePathFor(r.assetId)) : undefined;

  const visualBlock =
    r.resolutionType === "DETERMINISTIC"
      ? `<div class="notice notice-neutral">Deterministic vector renderer: <code>${esc(r.rendererBlueprintId ?? "n/a")}</code> (apps/mobile/src/components/diagrams/DiagramRenderer.tsx)</div>`
      : r.resolutionType === "DEFERRED_SCOPE"
        ? `<div class="notice notice-neutral">DEFERRED_SCOPE -- not produced, per governed catalogue.</div>`
        : masterUri
          ? `<div class="compare-grid">
              <div class="compare-col"><h3>REFERENCE</h3>${refUri ? `<img class="compare-img" src="${refUri}" />` : '<div class="missing">n/a</div>'}<p class="small">${esc(r.referenceSourceName ?? "")}</p></div>
              <div class="compare-col"><h3>FINAL ARTWORK (v${r.masterVersion ?? "?"})</h3><img class="compare-img" src="${masterUri}" /></div>
            </div>`
          : `<div class="notice notice-bad">Master image not found on disk.</div>`;

  return `
<section class="sheet">
  <div class="page-header">
    <h2>${esc(r.displayName)}</h2>
    <span class="badge">${esc(r.stateId)}</span>
  </div>
  <table class="kv-table">
    <tr><th>Asset</th><td>${esc(r.assetId)}</td></tr>
    <tr><th>Role</th><td>${esc(r.role)}</td></tr>
    <tr><th>Category</th><td>${esc(r.category)}</td></tr>
    <tr><th>Need classification</th><td>${esc(r.needClassification)}</td></tr>
    <tr><th>Learner-visible purpose</th><td>${esc(r.learnerVisiblePurpose)}</td></tr>
    <tr><th>Resolution type</th><td><strong>${esc(r.resolutionType)}</strong></td></tr>
    <tr><th>Assessment leakage</th><td>${esc(r.assessmentLeakageStatus)}</td></tr>
  </table>
  ${visualBlock}
  <p class="notice ${verdictClass}"><strong>STATUS: ${esc(r.approvalStatus)}</strong></p>
  <p class="small">${esc(r.notes)}</p>
</section>`;
}

function familySectionHtml(familyDisplayName: string, familyId: string, records: StateCompletenessRecord[]): string {
  return `<section class="sheet family-divider"><h1>${esc(familyDisplayName)}</h1><p class="small"><code>${esc(familyId)}</code> -- ${records.length} governed state(s)</p></section>\n${records.map(statePageHtml).join("\n")}`;
}

function coverHtml(summary: ReturnType<typeof summariseMatrix>): string {
  return `
<section class="sheet cover">
  <h1>Unit 202 — Final Visual Suite Review</h1>
  <p class="generated">CC-11.11 &middot; Generated: ${esc(new Date().toISOString())}</p>
  <div class="notice notice-critical">UNIT 202 VISUAL SUITE COMPLETE — AWAITING PRODUCT OWNER / CHATGPT FINAL VISUAL APPROVAL</div>
  <table class="kv-table">
    <tr><th>Live canonical states</th><td>${summary.liveCanonicalStateTotal}</td></tr>
    <tr><th>Live ProductionAssets</th><td>${summary.liveProductionAssetTotal}</td></tr>
    <tr><th>GENERATED</th><td>${summary.generated}</td></tr>
    <tr><th>DETERMINISTIC</th><td>${summary.deterministic}</td></tr>
    <tr><th>REUSED_CANONICAL</th><td>${summary.reusedCanonical}</td></tr>
    <tr><th>SHARED_BASE_VALID</th><td>${summary.sharedBaseValid}</td></tr>
    <tr><th>DEFERRED_SCOPE</th><td>${summary.deferredScope}</td></tr>
    <tr><th>UNRESOLVED</th><td>${summary.unresolved} (REQUIRED-need: ${summary.unresolvedRequired})</td></tr>
    <tr><th>PASS</th><td>${summary.pass}</td></tr>
    <tr><th>HUMAN_REVIEW_REQUIRED</th><td>${summary.humanReviewRequired}</td></tr>
    <tr><th>RETRY (incomplete)</th><td>${summary.retry}</td></tr>
    <tr><th>Assessment states needing leakage review</th><td>${summary.assessmentNeedsReview}</td></tr>
  </table>
</section>`;
}

function buildHtml(records: StateCompletenessRecord[], summary: ReturnType<typeof summariseMatrix>): string {
  const byFamily = new Map<string, { displayName: string; records: StateCompletenessRecord[] }>();
  for (const r of records) {
    if (!byFamily.has(r.familyId)) byFamily.set(r.familyId, { displayName: r.familyDisplayName, records: [] });
    byFamily.get(r.familyId)!.records.push(r);
  }
  const familySections = [...byFamily.entries()]
    .sort(([, a], [, b]) => a.displayName.localeCompare(b.displayName))
    .map(([familyId, group]) => familySectionHtml(group.displayName, familyId, group.records))
    .join("\n");

  return `<!doctype html><html lang="en"><head><meta charset="utf-8" /><title>Unit 202 Final Visual Suite Review</title>
<style>
  * { box-sizing: border-box; }
  body { margin: 0; font-family: system-ui, -apple-system, "Segoe UI", sans-serif; color: #16181d; background: #fff; font-size: 11px; line-height: 1.4; }
  .sheet { page-break-after: always; padding: 18px 24px; }
  .sheet:last-child { page-break-after: auto; }
  .cover, .family-divider { display: flex; flex-direction: column; justify-content: center; min-height: 90vh; gap: 12px; }
  .cover h1, .family-divider h1 { font-size: 22px; margin: 0; }
  .generated { color: #666; font-size: 10px; }
  h2 { font-size: 15px; margin: 0; }
  h3 { font-size: 11px; margin: 6px 0 4px; color: #444; text-transform: uppercase; }
  .page-header { display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid #222; padding-bottom: 6px; margin-bottom: 8px; }
  .badge { font-size: 9px; background: #222; color: #fff; padding: 2px 7px; border-radius: 999px; }
  .notice { border-radius: 6px; padding: 8px 12px; font-size: 11px; margin: 8px 0; }
  .notice-critical { border: 1px solid #d9364a; background: #fdecee; color: #8a1526; font-weight: 700; text-align: center; }
  .notice-good { border: 1px solid #1a7f37; background: #eaf7ee; color: #1a7f37; }
  .notice-warn { border: 1px solid #b35900; background: #fff4e5; color: #8a4a00; }
  .notice-bad { border: 1px solid #d9364a; background: #fdecee; color: #8a1526; }
  .notice-neutral { border: 1px solid #888; background: #f2f2f2; color: #333; }
  .kv-table { width: 100%; border-collapse: collapse; margin: 6px 0; }
  .kv-table th { text-align: left; color: #555; font-weight: 600; padding: 3px 8px 3px 0; width: 32%; vertical-align: top; }
  .kv-table td { padding: 3px 0; }
  .kv-table tr { border-bottom: 1px solid #eee; }
  .compare-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 8px 0; }
  .compare-col { border: 1px solid #ddd; border-radius: 6px; padding: 6px; }
  .compare-img { width: 100%; max-height: 220px; object-fit: contain; background: #f5f5f5; border-radius: 4px; }
  .missing { padding: 30px 8px; text-align: center; color: #999; background: #f5f5f5; border-radius: 4px; font-weight: 700; font-size: 10px; }
  .small { font-size: 9px; color: #666; margin: 3px 0; }
  code { font-size: 9px; }
</style></head><body>
${coverHtml(summary)}
${familySections}
</body></html>`;
}

/** JSON export stays lightweight -- paths/hashes/state metadata only, never embedded image bytes (CC-11.11 §13). */
function toJsonSafeRecord(r: StateCompletenessRecord) {
  return r; // StateCompletenessRecord never carries data URIs -- only real filesystem paths.
}

export async function generateFinalVisualSuiteReview(): Promise<{ pdfPath: string; jsonPath: string; summary: ReturnType<typeof summariseMatrix> }> {
  const records = buildCompletenessMatrix();
  const summary = summariseMatrix(records);
  const reportsDir = join(REPO_ROOT, "reports", "instructional-visuals");
  mkdirSync(reportsDir, { recursive: true });

  writeFileSync(
    JSON_PATH,
    JSON.stringify({ generatedAt: new Date().toISOString(), status: "UNIT 202 VISUAL SUITE COMPLETE — AWAITING PRODUCT OWNER / CHATGPT FINAL VISUAL APPROVAL", summary, records: records.map(toJsonSafeRecord) }, null, 2) + "\n",
    "utf8",
  );

  const html = buildHtml(records, summary);
  const scratchDir = mkdtempSync(join(tmpdir(), "unit202-final-suite-review-"));
  const tempHtmlPath = join(scratchDir, "_source.html");
  writeFileSync(tempHtmlPath, html, "utf8");

  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    await page.goto(`file://${tempHtmlPath}`, { waitUntil: "networkidle" });
    await page.pdf({ path: PDF_PATH, printBackground: true, format: "A4", margin: { top: "8mm", bottom: "8mm", left: "8mm", right: "8mm" } });
  } finally {
    await browser.close();
    rmSync(scratchDir, { recursive: true, force: true });
  }

  return { pdfPath: PDF_PATH, jsonPath: JSON_PATH, summary };
}

function isMainModule(): boolean {
  const entryPoint = process.argv[1];
  if (!entryPoint) return false;
  return fileURLToPath(import.meta.url) === entryPoint;
}

if (isMainModule()) {
  generateFinalVisualSuiteReview()
    .then(({ pdfPath, jsonPath, summary }) => {
      console.log(`Final visual suite review generated.`);
      console.log(`PDF: ${pdfPath}`);
      console.log(`JSON: ${jsonPath}`);
      console.log(JSON.stringify(summary, null, 2));
    })
    .catch((error: unknown) => {
      console.error(error);
      process.exitCode = 1;
    });
}
