/**
 * CC-11.8 Part F: the human-readable visual review document for the
 * two-asset Gemini proof -- a REQUIRED deliverable, not optional tooling.
 * Reuses the same Playwright-renders-HTML-to-PDF approach already
 * established by scripts/visual-governance/generate-review-package.ts and
 * tools/visual-production-studio/generate-final-review.ts (zero new
 * dependencies). This is what the Product Owner sends to an independent
 * reviewer -- it must be understandable without opening the repository or
 * navigating Studio folders.
 *
 * Usage:
 *   node tools/visual-production-studio/visual-proof/generate-proof-review.ts
 * (reads each proof asset's latest metadata-v{N}.json and audit-v{N}.json
 * from reports/instructional-visuals/premium-artwork/proof/<assetId>/ --
 * both must exist for an asset to be included with real content; a
 * missing audit is reported honestly, never fabricated.)
 */

import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { chromium } from "@playwright/test";

import { findAsset } from "../catalogue.ts";
import { REPO_ROOT } from "../paths.ts";
import { PROOF_ASSETS } from "./proof-config.ts";
import type { ProofAuditResult, ProofGenerationMetadata } from "./proof-types.ts";
import { REFERENCE_CACHE_DIR } from "../reference-acquisition.ts";

const PROOF_ROOT = join(REPO_ROOT, "reports", "instructional-visuals", "premium-artwork", "proof");
const PDF_PATH = join(REPO_ROOT, "reports", "instructional-visuals", "unit202-visual-production-proof-review.pdf");
const JSON_PATH = join(REPO_ROOT, "reports", "instructional-visuals", "unit202-visual-production-proof-review.json");

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

export interface ProofAssetReviewEntry {
  assetId: string;
  found: boolean;
  latestAttempt?: number;
  metadata?: ProofGenerationMetadata;
  audit?: ProofAuditResult;
  referenceDataUri?: string;
  masterDataUri?: string;
}

/** Finds the highest-numbered attempt (1 or 2) that has BOTH metadata and an audit result recorded -- the "final" candidate for this proof. */
function latestReviewedAttempt(assetId: string): { attempt: 1 | 2; metadata: ProofGenerationMetadata; audit: ProofAuditResult } | undefined {
  const assetDir = join(PROOF_ROOT, assetId);
  for (const attempt of [2, 1] as const) {
    const metadata = readJsonIfExists<ProofGenerationMetadata>(join(assetDir, `${assetId}-metadata-v${attempt}.json`));
    const audit = readJsonIfExists<ProofAuditResult>(join(assetDir, `${assetId}-audit-v${attempt}.json`));
    if (metadata && audit) return { attempt, metadata, audit };
  }
  return undefined;
}

export function buildProofReviewEntries(): ProofAssetReviewEntry[] {
  return PROOF_ASSETS.map((spec): ProofAssetReviewEntry => {
    const reviewed = latestReviewedAttempt(spec.assetId);
    if (!reviewed) return { assetId: spec.assetId, found: false };
    const referencePath = existsSync(join(REFERENCE_CACHE_DIR, `${spec.assetId}.raster.png`)) ? join(REFERENCE_CACHE_DIR, `${spec.assetId}.raster.png`) : join(REFERENCE_CACHE_DIR, `${spec.assetId}.png`);
    return {
      assetId: spec.assetId,
      found: true,
      latestAttempt: reviewed.attempt,
      metadata: reviewed.metadata,
      audit: reviewed.audit,
      referenceDataUri: imageDataUri(referencePath),
      masterDataUri: imageDataUri(reviewed.metadata.masterPath),
    };
  });
}

function summaryCounts(entries: ProofAssetReviewEntry[]) {
  const reviewed = entries.filter((e) => e.found && e.audit);
  return {
    attempted: entries.length,
    passed: reviewed.filter((e) => e.audit!.verdict === "PASS" && e.latestAttempt === 1).length,
    retryPassed: reviewed.filter((e) => e.audit!.verdict === "PASS" && e.latestAttempt === 2).length,
    humanReviewRequired: reviewed.filter((e) => e.audit!.verdict === "HUMAN_REVIEW_REQUIRED").length,
    failed: entries.filter((e) => !e.found).length,
    geminiCallsMade: entries.reduce((sum, e) => sum + (e.latestAttempt ?? 0), 0),
  };
}

function assetPageHtml(entry: ProofAssetReviewEntry): string {
  if (!entry.found || !entry.metadata || !entry.audit) {
    return `<section class="sheet"><h2>${esc(entry.assetId)}</h2><p class="notice notice-bad">No completed generation + audit found for this asset yet.</p></section>`;
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
    <tr><th>Curriculum context</th><td>${esc(asset?.loOrLesson ?? "n/a")}</td></tr>
    <tr><th>Pedagogical role</th><td>${esc(asset?.role ?? "n/a")}</td></tr>
    <tr><th>Production class</th><td>${esc(asset?.productionClassLabel ?? "n/a")}</td></tr>
    <tr><th>Purpose</th><td>${esc(asset?.instructionalPurpose ?? "n/a")}</td></tr>
  </table>

  <div class="compare-grid">
    <div class="compare-col">
      <h3>REFERENCE</h3>
      ${entry.referenceDataUri ? `<img class="compare-img" src="${entry.referenceDataUri}" />` : '<div class="missing">reference preview not found</div>'}
      <p class="small">${esc(asset?.primaryReference.sourceName ?? "")}${asset?.primaryReference.sourceUrl ? ` — <a href="${esc(asset.primaryReference.sourceUrl)}">${esc(asset.primaryReference.sourceUrl)}</a>` : ""}</p>
      <p class="small">Licence: ${esc(asset?.primaryReference.licence ?? "n/a")}</p>
    </div>
    <div class="compare-col">
      <h3>FINAL ALP ARTWORK (attempt ${entry.latestAttempt})</h3>
      ${entry.masterDataUri ? `<img class="compare-img" src="${entry.masterDataUri}" />` : '<div class="missing">master not found</div>'}
      <p class="small">Model: ${esc(m.model)} &middot; Generated: ${esc(m.generatedAt)}</p>
    </div>
  </div>

  <p class="notice ${verdictClass}"><strong>AUDIT VERDICT: ${esc(a.verdict)}</strong> (retry count: ${entry.latestAttempt! - 1})</p>

  <table class="wide-table">
    <thead><tr><th>Immutable fact</th><th>Result</th><th>Note</th></tr></thead>
    <tbody>${a.factChecks.map((f) => `<tr><td>${esc(f.fact)}</td><td>${esc(f.result)}</td><td>${esc(f.note)}</td></tr>`).join("\n")}</tbody>
  </table>

  <table class="wide-table">
    <thead><tr><th>Prohibited change</th><th>Result</th><th>Note</th></tr></thead>
    <tbody>${a.prohibitedChangeChecks.map((f) => `<tr><td>${esc(f.prohibition)}</td><td>${esc(f.result)}</td><td>${esc(f.note)}</td></tr>`).join("\n")}</tbody>
  </table>

  <table class="kv-table">
    <tr><th>Baked labels found</th><td>${a.bakedLabelsFound ? "YES -- style-guide violation" : "No -- clean base art confirmed"}</td></tr>
    <tr><th>Style compliance</th><td>${esc(a.styleComplianceNotes)}</td></tr>
    <tr><th>Physical plausibility</th><td>${esc(a.physicalImplausibilityNotes || "No implausibilities found.")}</td></tr>
    <tr><th>Overall findings</th><td>${esc(a.overallFindings)}</td></tr>
    <tr><th>Master path</th><td><code>${esc(m.masterPath)}</code> (sha256 ${esc(m.masterSha256.slice(0, 16))}...)</td></tr>
    <tr><th>Derivative path</th><td><code>${esc(m.derivativePath)}</code></td></tr>
    <tr><th>Reference SHA-256</th><td><code>${esc(m.sourceReferenceSha256)}</code></td></tr>
  </table>
</section>`;
}

function coverAndSummaryHtml(entries: ProofAssetReviewEntry[]): string {
  const s = summaryCounts(entries);
  return `
<section class="sheet cover">
  <h1>Unit 202 — Visual Production Proof Review</h1>
  <p class="generated">Package: CC-11.8 &middot; Generated: ${esc(new Date().toISOString())}</p>
  <div class="notice notice-critical">TWO-ASSET AUTOMATED PRODUCTION PIPELINE PROOF — FOR INDEPENDENT REVIEW BEFORE ANY WIDER PRODUCTION RUN</div>
  <p>This document proves the automated visual-production pipeline (Claude orchestrates, Gemini renders, Claude audits) end-to-end on two real assets. It is not a bulk production run and does not constitute Product Owner approval of either candidate image.</p>
  <table class="kv-table">
    <tr><th>Assets attempted</th><td>${s.attempted}</td></tr>
    <tr><th>Passed (first attempt)</th><td>${s.passed}</td></tr>
    <tr><th>Retry-passed</th><td>${s.retryPassed}</td></tr>
    <tr><th>Human review required</th><td>${s.humanReviewRequired}</td></tr>
    <tr><th>Failed / incomplete</th><td>${s.failed}</td></tr>
    <tr><th>Total Gemini calls made</th><td>${s.geminiCallsMade} (of 4 maximum permitted)</td></tr>
  </table>
</section>`;
}

export function buildProofReviewHtml(entries: ProofAssetReviewEntry[]): string {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>Unit 202 — Visual Production Proof Review</title>
<style>
  * { box-sizing: border-box; }
  body { margin: 0; font-family: system-ui, -apple-system, "Segoe UI", sans-serif; color: #16181d; background: #fff; font-size: 12px; line-height: 1.45; }
  .sheet { page-break-after: always; padding: 20px 28px; }
  .sheet:last-child { page-break-after: auto; }
  .cover { display: flex; flex-direction: column; justify-content: center; min-height: 90vh; gap: 14px; }
  .cover h1 { font-size: 24px; margin: 0; }
  .generated { color: #666; font-size: 11px; }
  h2 { font-size: 17px; margin: 0; }
  h3 { font-size: 12px; margin: 8px 0 6px; color: #444; text-transform: uppercase; letter-spacing: 0.03em; }
  .page-header { display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid #222; padding-bottom: 8px; margin-bottom: 10px; }
  .badge { font-size: 10px; background: #222; color: #fff; padding: 3px 8px; border-radius: 999px; }
  .notice { border-radius: 8px; padding: 10px 14px; font-size: 12px; margin: 10px 0; }
  .notice-critical { border: 1px solid #d9364a; background: #fdecee; color: #8a1526; font-weight: 700; text-align: center; }
  .notice-good { border: 1px solid #1a7f37; background: #eaf7ee; color: #1a7f37; }
  .notice-warn { border: 1px solid #b35900; background: #fff4e5; color: #8a4a00; }
  .notice-bad { border: 1px solid #d9364a; background: #fdecee; color: #8a1526; }
  .kv-table { width: 100%; border-collapse: collapse; margin: 8px 0; }
  .kv-table th { text-align: left; color: #555; font-weight: 600; padding: 4px 10px 4px 0; width: 32%; vertical-align: top; }
  .kv-table td { padding: 4px 0; }
  .kv-table tr { border-bottom: 1px solid #eee; }
  .wide-table { width: 100%; border-collapse: collapse; font-size: 11px; margin: 10px 0; }
  .wide-table th { background: #222; color: #fff; text-align: left; padding: 5px 8px; }
  .wide-table td { padding: 5px 8px; border-bottom: 1px solid #ddd; vertical-align: top; }
  .compare-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin: 10px 0; }
  .compare-col { border: 1px solid #ddd; border-radius: 8px; padding: 8px; }
  .compare-img { width: 100%; max-height: 260px; object-fit: contain; background: #f5f5f5; border-radius: 4px; }
  .missing { padding: 40px 10px; text-align: center; color: #999; background: #f5f5f5; border-radius: 4px; font-weight: 700; font-size: 11px; }
  .small { font-size: 10px; color: #666; margin: 4px 0; }
  a { color: #2255aa; }
  code { font-size: 10px; }
</style>
</head>
<body>
${coverAndSummaryHtml(entries)}
${entries.map(assetPageHtml).join("\n")}
</body>
</html>`;
}

export async function generateProofReview(): Promise<{ pdfPath: string; jsonPath: string; entries: ProofAssetReviewEntry[] }> {
  const entries = buildProofReviewEntries();
  const reportsDir = join(REPO_ROOT, "reports", "instructional-visuals");
  mkdirSync(reportsDir, { recursive: true });
  writeFileSync(JSON_PATH, JSON.stringify({ generatedAt: new Date().toISOString(), summary: summaryCounts(entries), entries }, null, 2) + "\n", "utf8");

  const html = buildProofReviewHtml(entries);
  const scratchDir = mkdtempSync(join(tmpdir(), "unit202-proof-review-"));
  const tempHtmlPath = join(scratchDir, "_source.html");
  writeFileSync(tempHtmlPath, html, "utf8");

  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    await page.goto(`file://${tempHtmlPath.replace(/\\/g, "/")}`);
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "14mm", bottom: "14mm", left: "12mm", right: "12mm" },
      displayHeaderFooter: true,
      headerTemplate: "<span></span>",
      footerTemplate: `<div style="width:100%;font-size:8px;color:#999;text-align:center;">Unit 202 Visual Production Proof Review &middot; Page <span class="pageNumber"></span> / <span class="totalPages"></span></div>`,
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
  generateProofReview()
    .then(({ pdfPath, jsonPath, entries }) => {
      console.log(`Proof review generated. PDF: ${pdfPath}`);
      console.log(`JSON: ${jsonPath}`);
      for (const e of entries) console.log(`  ${e.assetId}: ${e.found ? `attempt ${e.latestAttempt}, verdict ${e.audit?.verdict}` : "NOT FOUND"}`);
    })
    .catch((error: unknown) => {
      console.error(error);
      process.exitCode = 1;
    });
}
