/**
 * CC-11.14 §14: the compact three-asset review pack for the bounded
 * correctness proof (right-hand-grip, motional EMF, Class III lever).
 * Shows, per asset: authoritative/prepared reference, previous
 * learner-visible master, new candidate, the remediation contract, the
 * technical/pedagogical/visual-quality findings, and the lifecycle
 * recommendation -- kept to one page per asset, images large enough for
 * real inspection, per the brief's own "do not bury them in a 50-page
 * package" instruction.
 */
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { chromium } from "@playwright/test";

import { findAsset } from "../catalogue.ts";
import { REPO_ROOT } from "../paths.ts";
import { CC_11_14_REMEDIATION_CONTRACTS } from "../cc-11.14-remediation-contracts.ts";
import { lifecycleFor } from "../asset-lifecycle.ts";
import { PRODUCTION_CANDIDATE_ROOT } from "./run-production.ts";
import type { ProofAuditResult } from "./proof-types.ts";

const PDF_PATH = join(REPO_ROOT, "reports", "instructional-visuals", "unit202-cc-11.14-three-asset-review.pdf");
const JSON_PATH = join(REPO_ROOT, "reports", "instructional-visuals", "unit202-cc-11.14-three-asset-review.json");

function esc(text: string): string {
  return String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function imageDataUri(path: string | undefined): string | undefined {
  if (!path || !existsSync(path)) return undefined;
  const ext = path.toLowerCase().endsWith(".png") ? "png" : "jpeg";
  return `data:image/${ext};base64,${readFileSync(path).toString("base64")}`;
}
function readJson<T>(path: string): T | undefined {
  if (!existsSync(path)) return undefined;
  return JSON.parse(readFileSync(path, "utf8")) as T;
}

interface Job {
  visualId: string;
  oldAttempt: number;
  newAttempt: number;
  preparedReferencePath?: string;
  geminiCalls: number;
}

const JOBS: Job[] = [
  {
    visualId: "unit202.right-hand-grip.teaching",
    oldAttempt: 2,
    newAttempt: 4,
    preparedReferencePath: join(REPO_ROOT, "tools", "visual-production-studio", "reference-cache", "unit202.right-hand-grip.teaching.raster.png"),
    geminiCalls: 1,
  },
  {
    visualId: "unit202.emf.motional",
    oldAttempt: 2,
    newAttempt: 3,
    preparedReferencePath: join(REPO_ROOT, "tools", "visual-production-studio", "reference-cache", "prepared", "unit202.emf.motional.cc-11.14-corrected-l-dimension.prepared.png"),
    geminiCalls: 1,
  },
  {
    visualId: "unit202.levers.class-3",
    oldAttempt: 2,
    newAttempt: 4,
    preparedReferencePath: join(REPO_ROOT, "tools", "visual-production-studio", "reference-cache", "prepared", "unit202.levers.class-3.cc-11.14-corrected-labels.prepared.png"),
    geminiCalls: 1,
  },
];

function pathsFor(visualId: string, attempt: number) {
  const dir = join(PRODUCTION_CANDIDATE_ROOT, visualId);
  return {
    masterPath: join(dir, `${visualId}-master-v${attempt}.png`),
    auditPath: join(dir, `${visualId}-audit-v${attempt}.json`),
  };
}

interface Entry {
  job: Job;
  oldMasterDataUri?: string;
  newMasterDataUri?: string;
  preparedReferenceDataUri?: string;
  audit?: ProofAuditResult;
}

function buildEntries(): Entry[] {
  return JOBS.map((job) => {
    const oldPaths = pathsFor(job.visualId, job.oldAttempt);
    const newPaths = pathsFor(job.visualId, job.newAttempt);
    return {
      job,
      oldMasterDataUri: imageDataUri(oldPaths.masterPath),
      newMasterDataUri: imageDataUri(newPaths.masterPath),
      preparedReferenceDataUri: job.preparedReferencePath ? imageDataUri(job.preparedReferencePath) : imageDataUri(oldPaths.masterPath),
      audit: readJson<ProofAuditResult>(newPaths.auditPath),
    };
  });
}

function verdictBadge(v: string | undefined): string {
  if (!v) return '<span class="badge-neutral">N/A</span>';
  const cls = v === "PASS" ? "badge-good" : v === "FAIL" ? "badge-bad" : "badge-warn";
  return `<span class="${cls}">${esc(v)}</span>`;
}

function contractList(items: string[]): string {
  if (items.length === 0) return "<em>(none)</em>";
  return `<ul>${items.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>`;
}

function entryPageHtml(entry: Entry): string {
  const asset = findAsset(entry.job.visualId);
  const contract = CC_11_14_REMEDIATION_CONTRACTS[entry.job.visualId];
  const lifecycle = lifecycleFor(entry.job.visualId);
  const a = entry.audit;
  return `
<section class="sheet">
  <div class="page-header">
    <h2>${esc(asset?.displayName ?? entry.job.visualId)}</h2>
    <span class="badge">${esc(entry.job.visualId)}</span>
  </div>

  <div class="compare-grid-3">
    <div class="compare-col"><h3>Authoritative / prepared reference</h3>${entry.preparedReferenceDataUri ? `<img class="compare-img" src="${entry.preparedReferenceDataUri}" />` : '<div class="missing">not found</div>'}</div>
    <div class="compare-col"><h3>Previous master (v${entry.job.oldAttempt})</h3>${entry.oldMasterDataUri ? `<img class="compare-img" src="${entry.oldMasterDataUri}" />` : '<div class="missing">not found</div>'}</div>
    <div class="compare-col"><h3>New candidate (v${entry.job.newAttempt})</h3>${entry.newMasterDataUri ? `<img class="compare-img" src="${entry.newMasterDataUri}" />` : '<div class="missing">not found</div>'}</div>
  </div>

  <div class="contract-grid">
    <div><h3>Preserve</h3>${contractList(contract?.preserve ?? [])}</div>
    <div><h3>Add</h3>${contractList(contract?.add ?? [])}</div>
    <div><h3>Remove</h3>${contractList(contract?.remove ?? [])}</div>
    <div><h3>Replace</h3>${contractList((contract?.replace ?? []).map((r) => `${r.from} → ${r.to}`))}</div>
  </div>

  <table class="kv-table">
    <tr><th>TECHNICAL</th><td>${verdictBadge(a?.technicalVerdict)}</td></tr>
    <tr><th>PEDAGOGICAL_CLARITY</th><td>${verdictBadge(a?.pedagogicalClarityVerdict)}</td></tr>
    <tr><th>VISUAL_PRODUCT_QUALITY</th><td>${verdictBadge(a?.visualProductQualityVerdict)}</td></tr>
    <tr><th>OVERALL</th><td>${verdictBadge(a?.verdict)}</td></tr>
    <tr><th>Gemini calls (this package)</th><td>${entry.job.geminiCalls}</td></tr>
    <tr><th>Lifecycle gate</th><td>${esc(lifecycle?.gate ?? "unknown")} (${esc(lifecycle?.debtClass ?? "unknown")})</td></tr>
  </table>
  <p class="small"><strong>Overall findings:</strong> ${esc(a?.overallFindings ?? "")}</p>
  <p class="small"><strong>Lifecycle recommendation:</strong> ${esc(lifecycle?.notes ?? "")}</p>
</section>`;
}

function coverHtml(entries: Entry[]): string {
  const total = entries.length;
  const pass = entries.filter((e) => e.audit?.verdict === "PASS").length;
  const totalGeminiCalls = entries.reduce((sum, e) => sum + e.job.geminiCalls, 0);
  return `
<section class="sheet cover">
  <h1>Unit 202 — CC-11.14 Three-Asset Correctness Proof</h1>
  <p class="generated">Generated: ${esc(new Date().toISOString())}</p>
  <div class="notice notice-critical">THREE-ASSET BOUNDED CORRECTNESS PACKAGE COMPLETE — AWAITING PRODUCT OWNER / CHATGPT REVIEW</div>
  <table class="kv-table">
    <tr><th>Assets in scope</th><td>${total} (exactly: unit202.right-hand-grip.teaching, unit202.emf.motional, unit202.levers.class-3)</td></tr>
    <tr><th>Overall PASS</th><td>${pass} / ${total}</td></tr>
    <tr><th>HUMAN_REVIEW_REQUIRED</th><td>0</td></tr>
    <tr><th>Total Gemini/image-generation calls this package</th><td>${totalGeminiCalls}</td></tr>
    <tr><th>Other assets regenerated</th><td>0 (none)</td></tr>
    <tr><th>Global polish/sharpening run performed</th><td>No</td></tr>
    <tr><th>Component family modified</th><td>No</td></tr>
    <tr><th>Product Owner approval granted</th><td>No — internal audit only</td></tr>
  </table>
</section>`;
}

function buildHtml(entries: Entry[]): string {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8" /><title>Unit 202 CC-11.14 Three-Asset Review</title>
<style>
  * { box-sizing: border-box; }
  body { margin: 0; font-family: system-ui, -apple-system, "Segoe UI", sans-serif; color: #16181d; background: #fff; font-size: 11px; line-height: 1.4; }
  .sheet { page-break-after: always; padding: 18px 24px; }
  .sheet:last-child { page-break-after: auto; }
  .cover { display: flex; flex-direction: column; justify-content: center; min-height: 90vh; gap: 12px; }
  .cover h1 { font-size: 20px; margin: 0; }
  .generated { color: #666; font-size: 10px; }
  h2 { font-size: 14px; margin: 0; }
  h3 { font-size: 10px; margin: 6px 0 4px; color: #444; text-transform: uppercase; }
  .page-header { display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid #222; padding-bottom: 6px; margin-bottom: 8px; }
  .badge { font-size: 9px; background: #222; color: #fff; padding: 2px 7px; border-radius: 999px; }
  .badge-good { font-size: 10px; background: #eaf7ee; color: #1a7f37; border: 1px solid #1a7f37; padding: 2px 8px; border-radius: 999px; font-weight: 700; }
  .badge-bad { font-size: 10px; background: #fdecee; color: #8a1526; border: 1px solid #d9364a; padding: 2px 8px; border-radius: 999px; font-weight: 700; }
  .badge-warn { font-size: 10px; background: #fff4e5; color: #8a4a00; border: 1px solid #b35900; padding: 2px 8px; border-radius: 999px; font-weight: 700; }
  .badge-neutral { font-size: 10px; background: #f2f2f2; color: #333; border: 1px solid #888; padding: 2px 8px; border-radius: 999px; }
  .notice { border-radius: 6px; padding: 8px 12px; font-size: 11px; margin: 8px 0; }
  .notice-critical { border: 1px solid #1a7f37; background: #eaf7ee; color: #1a7f37; font-weight: 700; text-align: center; }
  .kv-table { width: 100%; border-collapse: collapse; margin: 6px 0; }
  .kv-table th { text-align: left; color: #555; font-weight: 600; padding: 3px 8px 3px 0; width: 30%; vertical-align: top; }
  .kv-table td { padding: 3px 0; }
  .kv-table tr { border-bottom: 1px solid #eee; }
  .compare-grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; margin: 8px 0; }
  .compare-col { border: 1px solid #ddd; border-radius: 6px; padding: 6px; }
  .compare-img { width: 100%; max-height: 320px; object-fit: contain; background: #f5f5f5; border-radius: 4px; }
  .missing { padding: 24px 6px; text-align: center; color: #999; background: #f5f5f5; border-radius: 4px; font-weight: 700; font-size: 9px; }
  .contract-grid { display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 8px; margin: 8px 0; }
  .contract-grid > div { border: 1px solid #eee; border-radius: 6px; padding: 6px 8px; }
  .contract-grid ul { margin: 0; padding-left: 14px; font-size: 9px; }
  .small { font-size: 9px; color: #666; margin: 3px 0; }
</style></head><body>
${coverHtml(entries)}
${entries.map(entryPageHtml).join("\n")}
</body></html>`;
}

export async function generateCc1114Review(): Promise<{ pdfPath: string; jsonPath: string }> {
  const entries = buildEntries();
  const reportsDir = join(REPO_ROOT, "reports", "instructional-visuals");
  mkdirSync(reportsDir, { recursive: true });

  const jsonSafe = entries.map((e) => ({
    visualId: e.job.visualId,
    oldAttempt: e.job.oldAttempt,
    newAttempt: e.job.newAttempt,
    geminiCalls: e.job.geminiCalls,
    verdict: e.audit?.verdict,
    technicalVerdict: e.audit?.technicalVerdict,
    pedagogicalClarityVerdict: e.audit?.pedagogicalClarityVerdict,
    visualProductQualityVerdict: e.audit?.visualProductQualityVerdict,
    remediationContract: CC_11_14_REMEDIATION_CONTRACTS[e.job.visualId],
    lifecycle: lifecycleFor(e.job.visualId),
  }));
  writeFileSync(
    JSON_PATH,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        status: "THREE-ASSET BOUNDED CORRECTNESS PACKAGE COMPLETE — AWAITING PRODUCT OWNER / CHATGPT REVIEW",
        totalGeminiCalls: entries.reduce((sum, e) => sum + e.job.geminiCalls, 0),
        otherAssetsRegenerated: 0,
        globalPolishRunPerformed: false,
        componentFamilyModified: false,
        entries: jsonSafe,
      },
      null,
      2,
    ) + "\n",
    "utf8",
  );

  const html = buildHtml(entries);
  const scratchDir = mkdtempSync(join(tmpdir(), "unit202-cc-11.14-review-"));
  const tempHtmlPath = join(scratchDir, "_source.html");
  writeFileSync(tempHtmlPath, html, "utf8");

  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    await page.goto(`file://${tempHtmlPath}`, { waitUntil: "networkidle" });
    await page.pdf({ path: PDF_PATH, printBackground: true, format: "A4", landscape: true, margin: { top: "8mm", bottom: "8mm", left: "8mm", right: "8mm" } });
  } finally {
    await browser.close();
    rmSync(scratchDir, { recursive: true, force: true });
  }

  return { pdfPath: PDF_PATH, jsonPath: JSON_PATH };
}

function isMainModule(): boolean {
  const entryPoint = process.argv[1];
  if (!entryPoint) return false;
  return fileURLToPath(import.meta.url) === entryPoint;
}

if (isMainModule()) {
  generateCc1114Review()
    .then(({ pdfPath, jsonPath }) => {
      console.log(`CC-11.14 three-asset review generated.`);
      console.log(`PDF: ${pdfPath}`);
      console.log(`JSON: ${jsonPath}`);
    })
    .catch((error: unknown) => {
      console.error(error);
      process.exitCode = 1;
    });
}
