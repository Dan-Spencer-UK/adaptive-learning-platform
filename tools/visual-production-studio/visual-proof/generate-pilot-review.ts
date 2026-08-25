/**
 * CC-11.9 §41: the four-asset pilot review pack. Adapted from
 * generate-proof-review.ts's CC-11.8 two-asset pattern, generalised to:
 * (a) an explicit list of assetIds (the four pilot assets) rather than the
 * hardcoded 2-asset PROOF_ASSETS list, and (b) scanning for the highest
 * existing attempt number rather than assuming a 1/2 cap, since a
 * production-run asset may have more than one prior master version on
 * disk from earlier packages (e.g. unit202.magnet.field's CC-11.8 proof
 * masters).
 */

import { existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { chromium } from "@playwright/test";

import { findAsset } from "../catalogue.ts";
import { REPO_ROOT } from "../paths.ts";
import type { ProofAuditResult, ProofGenerationMetadata } from "./proof-types.ts";
import { REFERENCE_CACHE_DIR } from "../reference-acquisition.ts";
import { effectivePrimaryReference } from "../reference-corrections.ts";
import { PRODUCTION_CANDIDATE_ROOT } from "./run-production.ts";

const PDF_PATH = join(REPO_ROOT, "reports", "instructional-visuals", "unit202-four-asset-pilot-review.pdf");
const JSON_PATH = join(REPO_ROOT, "reports", "instructional-visuals", "unit202-four-asset-pilot-review.json");

export const PILOT_ASSET_IDS = [
  "unit202.magnet.field",
  "unit202.levers.class-1",
  "unit202.generator.rotating-loop.horizontal",
  "unit202.components.physical.resistor",
];

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

export interface PilotAssetReviewEntry {
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

export function buildPilotReviewEntries(): PilotAssetReviewEntry[] {
  return PILOT_ASSET_IDS.map((assetId): PilotAssetReviewEntry => {
    const reviewed = highestAuditedAttempt(assetId);
    if (!reviewed) return { assetId, found: false };
    const referencePath = existsSync(join(REFERENCE_CACHE_DIR, "prepared", `${assetId}.prepared.png`))
      ? join(REFERENCE_CACHE_DIR, "prepared", `${assetId}.prepared.png`)
      : existsSync(join(REFERENCE_CACHE_DIR, `${assetId}.raster.png`))
        ? join(REFERENCE_CACHE_DIR, `${assetId}.raster.png`)
        : join(REFERENCE_CACHE_DIR, `${assetId}.png`);
    return {
      assetId,
      found: true,
      latestAttempt: reviewed.attempt,
      metadata: reviewed.metadata,
      audit: reviewed.audit,
      referenceDataUri: imageDataUri(referencePath),
      masterDataUri: imageDataUri(reviewed.metadata.masterPath),
    };
  });
}

function summaryCounts(entries: PilotAssetReviewEntry[]) {
  const reviewed = entries.filter((e) => e.found && e.audit);
  return {
    attempted: entries.length,
    pass: reviewed.filter((e) => e.audit!.verdict === "PASS").length,
    retry: reviewed.filter((e) => e.audit!.verdict === "RETRY").length,
    humanReviewRequired: reviewed.filter((e) => e.audit!.verdict === "HUMAN_REVIEW_REQUIRED").length,
    notFound: entries.filter((e) => !e.found).length,
    allPass: reviewed.length === entries.length && reviewed.every((e) => e.audit!.verdict === "PASS"),
  };
}

function assetPageHtml(entry: PilotAssetReviewEntry): string {
  if (!entry.found || !entry.metadata || !entry.audit) {
    return `<section class="sheet"><h2>${esc(entry.assetId)}</h2><p class="notice notice-bad">No completed generation + audit found for this asset -- pending (e.g. blocked on an external reference-source rate limit at report time).</p></section>`;
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
      <h3>REFERENCE (as sent to Gemini)</h3>
      ${entry.referenceDataUri ? `<img class="compare-img" src="${entry.referenceDataUri}" />` : '<div class="missing">reference preview not found</div>'}
      <p class="small">${esc(asset ? effectivePrimaryReference(asset).sourceName : "")}</p>
    </div>
    <div class="compare-col">
      <h3>FINAL ALP ARTWORK (attempt ${entry.latestAttempt})</h3>
      ${entry.masterDataUri ? `<img class="compare-img" src="${entry.masterDataUri}" />` : '<div class="missing">master not found</div>'}
      <p class="small">Model: ${esc(m.model)} &middot; Generated: ${esc(m.generatedAt)}</p>
    </div>
  </div>

  <p class="notice ${verdictClass}"><strong>AUDIT VERDICT: ${esc(a.verdict)}</strong></p>

  <table class="wide-table">
    <thead><tr><th>Immutable fact</th><th>Result</th><th>Note</th></tr></thead>
    <tbody>${a.factChecks.map((f) => `<tr><td>${esc(f.fact)}</td><td>${esc(f.result)}</td><td>${esc(f.note)}</td></tr>`).join("\n")}</tbody>
  </table>

  <table class="wide-table">
    <thead><tr><th>Prohibited change</th><th>Result</th><th>Note</th></tr></thead>
    <tbody>${a.prohibitedChangeChecks.map((f) => `<tr><td>${esc(f.prohibition)}</td><td>${esc(f.result)}</td><td>${esc(f.note)}</td></tr>`).join("\n")}</tbody>
  </table>

  <table class="kv-table">
    <tr><th>Overall findings</th><td>${esc(a.overallFindings)}</td></tr>
    <tr><th>Master path</th><td><code>${esc(m.masterPath)}</code></td></tr>
  </table>
</section>`;
}

function coverHtml(entries: PilotAssetReviewEntry[]): string {
  const s = summaryCounts(entries);
  return `
<section class="sheet cover">
  <h1>Unit 202 — Four-Asset Pilot Review</h1>
  <p class="generated">Package: CC-11.9 &middot; Generated: ${esc(new Date().toISOString())}</p>
  <div class="notice ${s.allPass ? "notice-good" : "notice-critical"}">${s.allPass ? "ALL FOUR PASS — AUTOMATIC GO INTO FULL PRODUCTION" : "NOT ALL FOUR PASS — NO-GO, STOPPED BEFORE BULK GENERATION"}</div>
  <table class="kv-table">
    <tr><th>Assets attempted</th><td>${s.attempted}</td></tr>
    <tr><th>PASS</th><td>${s.pass}</td></tr>
    <tr><th>RETRY (mid-pipeline, superseded by a later attempt)</th><td>${s.retry}</td></tr>
    <tr><th>HUMAN_REVIEW_REQUIRED</th><td>${s.humanReviewRequired}</td></tr>
    <tr><th>Not completed</th><td>${s.notFound}</td></tr>
  </table>
</section>`;
}

export function buildPilotReviewHtml(entries: PilotAssetReviewEntry[]): string {
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8" /><title>Unit 202 Four-Asset Pilot Review</title>
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
  .notice-good { border: 1px solid #1a7f37; background: #eaf7ee; color: #1a7f37; font-weight: 700; text-align: center; }
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
  code { font-size: 10px; }
</style></head>
<body>
${coverHtml(entries)}
${entries.map(assetPageHtml).join("\n")}
</body></html>`;
}

/** CC-11.11 §13: strip base64 image blobs before writing JSON -- same fix as generate-production-review.ts's `toJsonSafeEntry`. */
function toJsonSafeEntry(entry: PilotAssetReviewEntry): Omit<PilotAssetReviewEntry, "referenceDataUri" | "masterDataUri"> {
  const { referenceDataUri: _referenceDataUri, masterDataUri: _masterDataUri, ...rest } = entry;
  return rest;
}

export async function generatePilotReview(): Promise<{ pdfPath: string; jsonPath: string; entries: PilotAssetReviewEntry[] }> {
  const entries = buildPilotReviewEntries();
  const reportsDir = join(REPO_ROOT, "reports", "instructional-visuals");
  mkdirSync(reportsDir, { recursive: true });
  writeFileSync(
    JSON_PATH,
    JSON.stringify({ generatedAt: new Date().toISOString(), summary: summaryCounts(entries), entries: entries.map(toJsonSafeEntry) }, null, 2) + "\n",
    "utf8",
  );

  const html = buildPilotReviewHtml(entries);
  const scratchDir = mkdtempSync(join(tmpdir(), "unit202-pilot-review-"));
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
      footerTemplate: `<div style="width:100%;font-size:8px;color:#999;text-align:center;">Unit 202 Four-Asset Pilot Review &middot; Page <span class="pageNumber"></span> / <span class="totalPages"></span></div>`,
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
  generatePilotReview()
    .then(({ pdfPath, jsonPath, entries }) => {
      console.log(`Pilot review generated. PDF: ${pdfPath}`);
      console.log(`JSON: ${jsonPath}`);
      for (const e of entries) console.log(`  ${e.assetId}: ${e.found ? `attempt ${e.latestAttempt}, verdict ${e.audit?.verdict}` : "NOT FOUND"}`);
    })
    .catch((error: unknown) => {
      console.error(error);
      process.exitCode = 1;
    });
}
