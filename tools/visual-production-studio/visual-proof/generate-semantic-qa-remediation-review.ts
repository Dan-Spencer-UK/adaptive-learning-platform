/**
 * CC-11.12 §6: the REDO remediation review package -- for every one of the
 * 22 REDO entries, shows OLD output, OLD reference, NEW prepared
 * reference, the semantic-QA instructions that drove the correction, NEW
 * output, and the three independent verdicts. An actual prepared-reference
 * image is mandatory for every entry here; "reference preview not found"
 * is treated as a hard page-level failure per
 * VISUAL-REFERENCE-SEMANTIC-QA-PRODUCT-DECISION.md's own explicit rule.
 */
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { chromium } from "@playwright/test";

import { findAsset } from "../catalogue.ts";
import { REPO_ROOT } from "../paths.ts";
import { SEMANTIC_QA } from "../semantic-reference-qa.ts";
import { PRODUCTION_CANDIDATE_ROOT } from "./run-production.ts";
import type { ProofAuditResult, ProofGenerationMetadata } from "./proof-types.ts";

const PDF_PATH = join(REPO_ROOT, "reports", "instructional-visuals", "unit202-semantic-qa-remediation-review.pdf");
const JSON_PATH = join(REPO_ROOT, "reports", "instructional-visuals", "unit202-semantic-qa-remediation-review.json");

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

/** ownerAssetId: the directory (always the assetId, states nest in the asset's own dir). outputId: the file prefix (assetId or stateId). */
interface RedoJob {
  visualId: string;
  ownerAssetId: string;
  outputId: string;
  oldAttempt: number;
  newAttempt: number;
}

const REDO_JOBS: RedoJob[] = [
  { visualId: "unit202.right-hand-grip.teaching", ownerAssetId: "unit202.right-hand-grip.teaching", outputId: "unit202.right-hand-grip.teaching", oldAttempt: 1, newAttempt: 2 },
  { visualId: "unit202.motor.effect.horizontal-poles.state.into-page-teaching", ownerAssetId: "unit202.motor.effect.horizontal-poles", outputId: "unit202.motor.effect.horizontal-poles.state.into-page-teaching", oldAttempt: 1, newAttempt: 2 },
  { visualId: "unit202.motor.effect.horizontal-poles.state.into-page-assessment", ownerAssetId: "unit202.motor.effect.horizontal-poles", outputId: "unit202.motor.effect.horizontal-poles.state.into-page-assessment", oldAttempt: 1, newAttempt: 2 },
  { visualId: "unit202.motor.effect.horizontal-poles.state.out-of-page-teaching", ownerAssetId: "unit202.motor.effect.horizontal-poles", outputId: "unit202.motor.effect.horizontal-poles.state.out-of-page-teaching", oldAttempt: 1, newAttempt: 2 },
  { visualId: "unit202.motor.effect.horizontal-poles.state.out-of-page-assessment", ownerAssetId: "unit202.motor.effect.horizontal-poles", outputId: "unit202.motor.effect.horizontal-poles.state.out-of-page-assessment", oldAttempt: 1, newAttempt: 2 },
  { visualId: "unit202.motor.effect.vertical-poles.state.into-page-teaching", ownerAssetId: "unit202.motor.effect.vertical-poles", outputId: "unit202.motor.effect.vertical-poles.state.into-page-teaching", oldAttempt: 1, newAttempt: 2 },
  { visualId: "unit202.motor.effect.vertical-poles.state.into-page-assessment", ownerAssetId: "unit202.motor.effect.vertical-poles", outputId: "unit202.motor.effect.vertical-poles.state.into-page-assessment", oldAttempt: 1, newAttempt: 2 },
  { visualId: "unit202.motor.effect.vertical-poles.state.out-of-page-teaching", ownerAssetId: "unit202.motor.effect.vertical-poles", outputId: "unit202.motor.effect.vertical-poles.state.out-of-page-teaching", oldAttempt: 1, newAttempt: 2 },
  { visualId: "unit202.motor.effect.vertical-poles.state.out-of-page-assessment", ownerAssetId: "unit202.motor.effect.vertical-poles", outputId: "unit202.motor.effect.vertical-poles.state.out-of-page-assessment", oldAttempt: 1, newAttempt: 3 },
  { visualId: "unit202.generator.rotating-loop.horizontal", ownerAssetId: "unit202.generator.rotating-loop.horizontal", outputId: "unit202.generator.rotating-loop.horizontal", oldAttempt: 1, newAttempt: 2 },
  { visualId: "unit202.generator.rotating-loop.vertical", ownerAssetId: "unit202.generator.rotating-loop.vertical", outputId: "unit202.generator.rotating-loop.vertical", oldAttempt: 1, newAttempt: 3 },
  { visualId: "unit202.levers.class-3", ownerAssetId: "unit202.levers.class-3", outputId: "unit202.levers.class-3", oldAttempt: 1, newAttempt: 2 },
  { visualId: "unit202.magnet.poles.like", ownerAssetId: "unit202.magnet.poles.like", outputId: "unit202.magnet.poles.like", oldAttempt: 1, newAttempt: 2 },
  { visualId: "unit202.magnet.poles.unlike", ownerAssetId: "unit202.magnet.poles.unlike", outputId: "unit202.magnet.poles.unlike", oldAttempt: 2, newAttempt: 3 },
  { visualId: "unit202.resistivity.length-comparison", ownerAssetId: "unit202.resistivity.length-comparison", outputId: "unit202.resistivity.length-comparison", oldAttempt: 1, newAttempt: 2 },
  { visualId: "unit202.resistivity.area-comparison", ownerAssetId: "unit202.resistivity.area-comparison", outputId: "unit202.resistivity.area-comparison", oldAttempt: 1, newAttempt: 2 },
  { visualId: "unit202.emf.motional", ownerAssetId: "unit202.emf.motional", outputId: "unit202.emf.motional", oldAttempt: 1, newAttempt: 2 },
  { visualId: "unit202.components.physical.capacitor", ownerAssetId: "unit202.components.physical.capacitor", outputId: "unit202.components.physical.capacitor", oldAttempt: 1, newAttempt: 2 },
  { visualId: "unit202.diode.bias-direction.forward", ownerAssetId: "unit202.diode.bias-direction.forward", outputId: "unit202.diode.bias-direction.forward", oldAttempt: 1, newAttempt: 2 },
  { visualId: "unit202.diode.bias-direction.reverse", ownerAssetId: "unit202.diode.bias-direction.reverse", outputId: "unit202.diode.bias-direction.reverse", oldAttempt: 2, newAttempt: 4 },
  { visualId: "unit202.electrolysis", ownerAssetId: "unit202.electrolysis", outputId: "unit202.electrolysis", oldAttempt: 2, newAttempt: 3 },
  { visualId: "unit202.conductor-insulator", ownerAssetId: "unit202.conductor-insulator", outputId: "unit202.conductor-insulator", oldAttempt: 1, newAttempt: 2 },
];

function pathsFor(ownerAssetId: string, outputId: string, attempt: number) {
  const dir = join(PRODUCTION_CANDIDATE_ROOT, ownerAssetId);
  return {
    masterPath: join(dir, `${outputId}-master-v${attempt}.png`),
    metadataPath: join(dir, `${outputId}-metadata-v${attempt}.json`),
    auditPath: join(dir, `${outputId}-audit-v${attempt}.json`),
  };
}

interface RemediationEntry {
  visualId: string;
  oldMasterDataUri?: string;
  newMasterDataUri?: string;
  newPreparedReferenceDataUri?: string;
  oldMetadata?: ProofGenerationMetadata;
  newMetadata?: ProofGenerationMetadata;
  newAudit?: ProofAuditResult;
}

function buildEntries(): RemediationEntry[] {
  return REDO_JOBS.map((job) => {
    const oldPaths = pathsFor(job.ownerAssetId, job.outputId, job.oldAttempt);
    const newPaths = pathsFor(job.ownerAssetId, job.outputId, job.newAttempt);
    const newMetadata = readJson<ProofGenerationMetadata>(newPaths.metadataPath);
    const newAudit = readJson<ProofAuditResult>(newPaths.auditPath);
    const preparedRefPath = newMetadata?.sourceReferenceUrl.includes("prepared:")
      ? newMetadata.sourceReferenceUrl.split("prepared: ")[1]?.replace(/\)$/, "")
      : undefined;
    return {
      visualId: job.visualId,
      oldMasterDataUri: imageDataUri(oldPaths.masterPath),
      newMasterDataUri: imageDataUri(newPaths.masterPath),
      newPreparedReferenceDataUri: imageDataUri(preparedRefPath),
      oldMetadata: readJson<ProofGenerationMetadata>(oldPaths.metadataPath),
      newMetadata,
      newAudit,
    };
  });
}

function verdictBadge(v: string | undefined): string {
  if (!v) return '<span class="badge-neutral">N/A</span>';
  const cls = v === "PASS" ? "badge-good" : v === "FAIL" ? "badge-bad" : "badge-warn";
  return `<span class="${cls}">${esc(v)}</span>`;
}

function entryPageHtml(entry: RemediationEntry): string {
  const qa = SEMANTIC_QA[entry.visualId];
  const asset = findAsset(entry.visualId.split(".state.")[0] ?? entry.visualId);
  const a = entry.newAudit;
  const referenceMissing = !entry.newPreparedReferenceDataUri;
  return `
<section class="sheet">
  <div class="page-header">
    <h2>${esc(asset?.displayName ?? entry.visualId)}</h2>
    <span class="badge">${esc(entry.visualId)}</span>
  </div>
  <p class="small"><strong>Semantic finding:</strong> ${esc(qa?.semanticFinding ?? "")}</p>
  <p class="small"><strong>Required action:</strong> ${esc(qa?.requiredAction ?? "")}</p>

  <div class="compare-grid-3">
    <div class="compare-col"><h3>OLD OUTPUT</h3>${entry.oldMasterDataUri ? `<img class="compare-img" src="${entry.oldMasterDataUri}" />` : '<div class="missing">not found</div>'}</div>
    <div class="compare-col"><h3>NEW PREPARED REFERENCE</h3>${referenceMissing ? '<div class="missing notice-bad-bg">reference preview not found -- HARD FAILURE</div>' : `<img class="compare-img" src="${entry.newPreparedReferenceDataUri}" />`}</div>
    <div class="compare-col"><h3>NEW OUTPUT</h3>${entry.newMasterDataUri ? `<img class="compare-img" src="${entry.newMasterDataUri}" />` : '<div class="missing">not found</div>'}</div>
  </div>

  <table class="kv-table">
    <tr><th>Keep elements</th><td>${esc((qa?.keepElements ?? []).join("; "))}</td></tr>
    <tr><th>Crop/remove elements</th><td>${esc((qa?.cropRemoveElements ?? []).join("; "))}</td></tr>
    <tr><th>Required final elements</th><td>${esc((qa?.requiredFinalElements ?? []).join("; "))}</td></tr>
    <tr><th>Prohibited final elements</th><td>${esc((qa?.prohibitedFinalElements ?? []).join("; "))}</td></tr>
    <tr><th>Model must not infer</th><td>${esc((qa?.modelMustNotInfer ?? []).join("; "))}</td></tr>
  </table>

  <table class="kv-table">
    <tr><th>TECHNICAL</th><td>${verdictBadge(a?.technicalVerdict)}</td></tr>
    <tr><th>PEDAGOGICAL_CLARITY</th><td>${verdictBadge(a?.pedagogicalClarityVerdict)}</td></tr>
    <tr><th>VISUAL_PRODUCT_QUALITY</th><td>${verdictBadge(a?.visualProductQualityVerdict)}</td></tr>
    <tr><th>OVERALL</th><td>${verdictBadge(a?.verdict)}</td></tr>
  </table>
  <p class="small">${esc(a?.overallFindings ?? "")}</p>
</section>`;
}

function coverHtml(entries: RemediationEntry[]): string {
  const total = entries.length;
  const pass = entries.filter((e) => e.newAudit?.verdict === "PASS").length;
  const hrr = entries.filter((e) => e.newAudit?.verdict === "HUMAN_REVIEW_REQUIRED").length;
  const missingRef = entries.filter((e) => !e.newPreparedReferenceDataUri).length;
  const techPass = entries.filter((e) => e.newAudit?.technicalVerdict === "PASS").length;
  const pedPass = entries.filter((e) => e.newAudit?.pedagogicalClarityVerdict === "PASS").length;
  const visPass = entries.filter((e) => e.newAudit?.visualProductQualityVerdict === "PASS").length;
  return `
<section class="sheet cover">
  <h1>Unit 202 — Semantic Reference QA Remediation Review</h1>
  <p class="generated">CC-11.12 &middot; Generated: ${esc(new Date().toISOString())}</p>
  <div class="notice notice-critical">UNIT 202 GENERATIVE VISUAL REMEDIATION COMPLETE — AWAITING PRODUCT OWNER / CHATGPT REVIEW</div>
  <table class="kv-table">
    <tr><th>REDO entries remediated</th><td>${total}</td></tr>
    <tr><th>Overall PASS</th><td>${pass}</td></tr>
    <tr><th>HUMAN_REVIEW_REQUIRED</th><td>${hrr}</td></tr>
    <tr><th>Missing prepared reference (hard failure)</th><td>${missingRef}</td></tr>
    <tr><th>TECHNICAL verdict PASS</th><td>${techPass} / ${total}</td></tr>
    <tr><th>PEDAGOGICAL_CLARITY verdict PASS</th><td>${pedPass} / ${total}</td></tr>
    <tr><th>VISUAL_PRODUCT_QUALITY verdict PASS</th><td>${visPass} / ${total}</td></tr>
  </table>
</section>`;
}

function buildHtml(entries: RemediationEntry[]): string {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8" /><title>Unit 202 Semantic QA Remediation Review</title>
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
  .notice-critical { border: 1px solid #d9364a; background: #fdecee; color: #8a1526; font-weight: 700; text-align: center; }
  .kv-table { width: 100%; border-collapse: collapse; margin: 6px 0; }
  .kv-table th { text-align: left; color: #555; font-weight: 600; padding: 3px 8px 3px 0; width: 26%; vertical-align: top; }
  .kv-table td { padding: 3px 0; }
  .kv-table tr { border-bottom: 1px solid #eee; }
  .compare-grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; margin: 8px 0; }
  .compare-col { border: 1px solid #ddd; border-radius: 6px; padding: 5px; }
  .compare-img { width: 100%; max-height: 200px; object-fit: contain; background: #f5f5f5; border-radius: 4px; }
  .missing { padding: 24px 6px; text-align: center; color: #999; background: #f5f5f5; border-radius: 4px; font-weight: 700; font-size: 9px; }
  .notice-bad-bg { background: #fdecee; color: #8a1526; }
  .small { font-size: 9px; color: #666; margin: 3px 0; }
</style></head><body>
${coverHtml(entries)}
${entries.map(entryPageHtml).join("\n")}
</body></html>`;
}

export async function generateSemanticQaRemediationReview(): Promise<{ pdfPath: string; jsonPath: string }> {
  const entries = buildEntries();
  const reportsDir = join(REPO_ROOT, "reports", "instructional-visuals");
  mkdirSync(reportsDir, { recursive: true });

  const jsonSafe = entries.map((e) => ({
    visualId: e.visualId,
    oldMasterPath: e.oldMetadata?.masterPath,
    newMasterPath: e.newMetadata?.masterPath,
    newMasterSha256: e.newMetadata?.masterSha256,
    verdict: e.newAudit?.verdict,
    technicalVerdict: e.newAudit?.technicalVerdict,
    pedagogicalClarityVerdict: e.newAudit?.pedagogicalClarityVerdict,
    visualProductQualityVerdict: e.newAudit?.visualProductQualityVerdict,
    referenceFound: !!e.newPreparedReferenceDataUri,
  }));
  writeFileSync(JSON_PATH, JSON.stringify({ generatedAt: new Date().toISOString(), status: "UNIT 202 GENERATIVE VISUAL REMEDIATION COMPLETE — AWAITING PRODUCT OWNER / CHATGPT REVIEW", entries: jsonSafe }, null, 2) + "\n", "utf8");

  const html = buildHtml(entries);
  const scratchDir = mkdtempSync(join(tmpdir(), "unit202-semantic-qa-review-"));
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

  return { pdfPath: PDF_PATH, jsonPath: JSON_PATH };
}

function isMainModule(): boolean {
  const entryPoint = process.argv[1];
  if (!entryPoint) return false;
  return fileURLToPath(import.meta.url) === entryPoint;
}

if (isMainModule()) {
  generateSemanticQaRemediationReview()
    .then(({ pdfPath, jsonPath }) => {
      console.log(`Semantic QA remediation review generated.`);
      console.log(`PDF: ${pdfPath}`);
      console.log(`JSON: ${jsonPath}`);
    })
    .catch((error: unknown) => {
      console.error(error);
      process.exitCode = 1;
    });
}
