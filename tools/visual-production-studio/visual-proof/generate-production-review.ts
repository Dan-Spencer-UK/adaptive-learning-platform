/**
 * CC-11.9 §44: the full Unit 202 visual-production review pack, covering
 * every generative asset processed in this production run. Same
 * Playwright-renders-HTML-to-PDF pattern as generate-pilot-review.ts and
 * generate-proof-review.ts, generalised to iterate every asset directory
 * under the candidate root rather than a fixed small list.
 */

import { existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { chromium } from "@playwright/test";

import { allAssets, findAsset } from "../catalogue.ts";
import { REPO_ROOT } from "../paths.ts";
import type { ProofAuditResult, ProofGenerationMetadata } from "./proof-types.ts";
import { REFERENCE_CACHE_DIR } from "../reference-acquisition.ts";
import { PRODUCTION_CANDIDATE_ROOT } from "./run-production.ts";

const PDF_PATH = join(REPO_ROOT, "reports", "instructional-visuals", "unit202-visual-production-review.pdf");
const JSON_PATH = join(REPO_ROOT, "reports", "instructional-visuals", "unit202-visual-production-review.json");

function esc(text: string): string {
  return String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function readJsonIfExists<T>(path: string): T | undefined {
  if (!existsSync(path)) return undefined;
  return JSON.parse(readFileSync(path, "utf8")) as T;
}

function imageDataUri(path: string | undefined): string | undefined {
  if (!path || !existsSync(path)) return undefined;
  const ext = path.toLowerCase().endsWith(".png") ? "png" : "jpeg";
  return `data:image/${ext};base64,${readFileSync(path).toString("base64")}`;
}

export interface ProductionReviewEntry {
  assetId: string;
  found: boolean;
  latestAttempt?: number;
  metadata?: ProofGenerationMetadata;
  audit?: ProofAuditResult;
  referenceDataUri?: string;
  masterDataUri?: string;
}

function highestAuditedAttempt(assetId: string): { attempt: number; metadata: ProofGenerationMetadata; audit: ProofAuditResult } | undefined {
  const assetDir = join(PRODUCTION_CANDIDATE_ROOT, assetId);
  if (!existsSync(assetDir)) return undefined;
  const attempts = readdirSync(assetDir)
    .map((f) => /-audit-v(\d+)\.json$/.exec(f)?.[1])
    .filter((n): n is string => !!n)
    .map(Number)
    .sort((a, b) => b - a);
  for (const attempt of attempts) {
    const metadata = readJsonIfExists<ProofGenerationMetadata>(join(assetDir, `${assetId}-metadata-v${attempt}.json`));
    const audit = readJsonIfExists<ProofAuditResult>(join(assetDir, `${assetId}-audit-v${attempt}.json`));
    if (metadata && audit) return { attempt, metadata, audit };
  }
  return undefined;
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

export function buildProductionReviewEntries(): ProductionReviewEntry[] {
  const generativeAssets = allAssets().filter((a) => a.productionClass !== "DETERMINISTIC_TECHNICAL");
  return generativeAssets.map((asset): ProductionReviewEntry => {
    const reviewed = highestAuditedAttempt(asset.assetId);
    if (!reviewed) return { assetId: asset.assetId, found: false };
    return {
      assetId: asset.assetId,
      found: true,
      latestAttempt: reviewed.attempt,
      metadata: reviewed.metadata,
      audit: reviewed.audit,
      referenceDataUri: imageDataUri(referencePathFor(asset.assetId)),
      masterDataUri: imageDataUri(reviewed.metadata.masterPath),
    };
  });
}

function summaryCounts(entries: ProductionReviewEntry[]) {
  const reviewed = entries.filter((e) => e.found && e.audit);
  const totalCalls = entries.reduce((sum, e) => sum + (e.latestAttempt ?? 0), 0);
  return {
    totalGenerativeAssets: entries.length,
    attempted: reviewed.length,
    pass: reviewed.filter((e) => e.audit!.verdict === "PASS").length,
    firstAttemptPass: reviewed.filter((e) => e.audit!.verdict === "PASS" && e.latestAttempt === 1).length,
    retryPass: reviewed.filter((e) => e.audit!.verdict === "PASS" && (e.latestAttempt ?? 0) > 1).length,
    humanReviewRequired: reviewed.filter((e) => e.audit!.verdict === "HUMAN_REVIEW_REQUIRED").length,
    notCompleted: entries.filter((e) => !e.found).length,
    totalGeminiCalls: totalCalls,
  };
}

function assetPageHtml(entry: ProductionReviewEntry): string {
  if (!entry.found || !entry.metadata || !entry.audit) {
    return `<section class="sheet"><h2>${esc(entry.assetId)}</h2><p class="notice notice-bad">Not completed in this production run -- see the summary for the reason (e.g. reference source unavailable at the time).</p></section>`;
  }
  const asset = findAsset(entry.assetId);
  const a = entry.audit;
  const m = entry.metadata;
  const verdictClass = a.verdict === "PASS" ? "notice-good" : a.verdict === "RETRY" ? "notice-warn" : "notice-bad";

  return `
<section class="sheet">
  <div class="page-header">
    <h2>${esc(asset?.displayName ?? entry.assetId)}</h2>
    <span class="badge">${esc(entry.assetId)}</span>
  </div>
  <table class="kv-table">
    <tr><th>Family</th><td>${esc(asset?.familyId ?? "n/a")}</td></tr>
    <tr><th>Curriculum context</th><td>${esc(asset?.loOrLesson ?? "n/a")}</td></tr>
    <tr><th>Role / pedagogical state</th><td>${esc(asset?.role ?? "n/a")} / ${esc((asset?.canonicalStates ?? []).map((s) => s.pedagogicalState).join(", "))}</td></tr>
    <tr><th>Purpose</th><td>${esc(asset?.instructionalPurpose ?? "n/a")}</td></tr>
  </table>
  <div class="compare-grid">
    <div class="compare-col">
      <h3>REFERENCE (as sent to Gemini)</h3>
      ${entry.referenceDataUri ? `<img class="compare-img" src="${entry.referenceDataUri}" />` : '<div class="missing">reference preview not found</div>'}
      <p class="small">${esc(asset?.primaryReference.sourceName ?? "")}</p>
    </div>
    <div class="compare-col">
      <h3>FINAL ARTWORK (attempt ${entry.latestAttempt})</h3>
      ${entry.masterDataUri ? `<img class="compare-img" src="${entry.masterDataUri}" />` : '<div class="missing">master not found</div>'}
    </div>
  </div>
  <p class="notice ${verdictClass}"><strong>AUDIT VERDICT: ${esc(a.verdict)}</strong></p>
  <table class="wide-table"><thead><tr><th>Fact</th><th>Result</th><th>Note</th></tr></thead>
  <tbody>${a.factChecks.map((f) => `<tr><td>${esc(f.fact)}</td><td>${esc(f.result)}</td><td>${esc(f.note)}</td></tr>`).join("")}</tbody></table>
  <p class="small"><strong>Overall:</strong> ${esc(a.overallFindings)}</p>
  <p class="small"><code>${esc(m.masterPath)}</code></p>
</section>`;
}

function coverHtml(entries: ProductionReviewEntry[]): string {
  const s = summaryCounts(entries);
  return `
<section class="sheet cover">
  <h1>Unit 202 — Full Visual Production Review</h1>
  <p class="generated">CC-11.9 &middot; Generated: ${esc(new Date().toISOString())}</p>
  <div class="notice notice-critical">FULL PRODUCTION GENERATED — AWAITING PRODUCT OWNER / CHATGPT VISUAL REVIEW</div>
  <table class="kv-table">
    <tr><th>Total generative assets</th><td>${s.totalGenerativeAssets}</td></tr>
    <tr><th>Attempted</th><td>${s.attempted}</td></tr>
    <tr><th>PASS (first attempt)</th><td>${s.firstAttemptPass}</td></tr>
    <tr><th>PASS (after retry)</th><td>${s.retryPass}</td></tr>
    <tr><th>HUMAN_REVIEW_REQUIRED</th><td>${s.humanReviewRequired}</td></tr>
    <tr><th>Not completed</th><td>${s.notCompleted}</td></tr>
    <tr><th>Total Gemini calls (this production run)</th><td>${s.totalGeminiCalls}</td></tr>
  </table>
</section>`;
}

export function buildProductionReviewHtml(entries: ProductionReviewEntry[]): string {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8" /><title>Unit 202 Full Visual Production Review</title>
<style>
  * { box-sizing: border-box; }
  body { margin: 0; font-family: system-ui, -apple-system, "Segoe UI", sans-serif; color: #16181d; background: #fff; font-size: 11px; line-height: 1.4; }
  .sheet { page-break-after: always; padding: 18px 24px; }
  .sheet:last-child { page-break-after: auto; }
  .cover { display: flex; flex-direction: column; justify-content: center; min-height: 90vh; gap: 12px; }
  .cover h1 { font-size: 22px; margin: 0; }
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
  .kv-table { width: 100%; border-collapse: collapse; margin: 6px 0; }
  .kv-table th { text-align: left; color: #555; font-weight: 600; padding: 3px 8px 3px 0; width: 32%; vertical-align: top; }
  .kv-table td { padding: 3px 0; }
  .kv-table tr { border-bottom: 1px solid #eee; }
  .wide-table { width: 100%; border-collapse: collapse; font-size: 10px; margin: 8px 0; }
  .wide-table th { background: #222; color: #fff; text-align: left; padding: 4px 6px; }
  .wide-table td { padding: 4px 6px; border-bottom: 1px solid #ddd; vertical-align: top; }
  .compare-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 8px 0; }
  .compare-col { border: 1px solid #ddd; border-radius: 6px; padding: 6px; }
  .compare-img { width: 100%; max-height: 220px; object-fit: contain; background: #f5f5f5; border-radius: 4px; }
  .missing { padding: 30px 8px; text-align: center; color: #999; background: #f5f5f5; border-radius: 4px; font-weight: 700; font-size: 10px; }
  .small { font-size: 9px; color: #666; margin: 3px 0; }
  code { font-size: 9px; }
</style></head><body>
${coverHtml(entries)}
${entries.map(assetPageHtml).join("\n")}
</body></html>`;
}

export async function generateProductionReview(): Promise<{ pdfPath: string; jsonPath: string; entries: ProductionReviewEntry[] }> {
  const entries = buildProductionReviewEntries();
  const reportsDir = join(REPO_ROOT, "reports", "instructional-visuals");
  mkdirSync(reportsDir, { recursive: true });
  writeFileSync(JSON_PATH, JSON.stringify({ generatedAt: new Date().toISOString(), summary: summaryCounts(entries), entries }, null, 2) + "\n", "utf8");

  const html = buildProductionReviewHtml(entries);
  const scratchDir = mkdtempSync(join(tmpdir(), "unit202-production-review-"));
  const tempHtmlPath = join(scratchDir, "_source.html");
  writeFileSync(tempHtmlPath, html, "utf8");

  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    await page.goto(`file://${tempHtmlPath.replace(/\\/g, "/")}`);
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "12mm", bottom: "12mm", left: "10mm", right: "10mm" },
      displayHeaderFooter: true,
      headerTemplate: "<span></span>",
      footerTemplate: `<div style="width:100%;font-size:8px;color:#999;text-align:center;">Unit 202 Full Visual Production Review &middot; Page <span class="pageNumber"></span> / <span class="totalPages"></span></div>`,
    });
    writeFileSync(PDF_PATH, pdfBuffer);
  } finally {
    await browser.close();
    rmSync(scratchDir, { recursive: true, force: true });
  }

  return { pdfPath: PDF_PATH, jsonPath: JSON_PATH, entries };
}

function isMainModule(): boolean {
  const entryPoint = process.argv[1];
  if (!entryPoint) return false;
  return fileURLToPath(import.meta.url) === entryPoint;
}

if (isMainModule()) {
  generateProductionReview()
    .then(({ pdfPath, jsonPath, entries }) => {
      console.log(`Production review generated. PDF: ${pdfPath}`);
      console.log(`JSON: ${jsonPath}`);
      console.log(`Entries: ${entries.length}`);
    })
    .catch((error: unknown) => {
      console.error(error);
      process.exitCode = 1;
    });
}
