/**
 * CC-11.7B §20-27: the FINAL pre-production Product Owner review pack for
 * the Unit 202 instructional-visual system. Generates two artefacts from
 * the LIVE catalogue/dashboard/audit data (never a hand-written parallel
 * list that can drift):
 *
 *   reports/instructional-visuals/unit202-final-visual-production-review.json
 *   reports/instructional-visuals/unit202-final-visual-production-review.pdf
 *
 * The PDF is the Product Owner's actual review artefact -- uploadable to
 * an independent reviewer without opening this repository (§20/§21). It
 * must never fabricate provisional artwork (§25): every premium/hybrid
 * asset not yet approved shows a clearly labelled "ARTWORK NOT YET
 * PRODUCED" placeholder; every already-governed deterministic state that
 * has a real rendered SVG (from the existing CC-05D review pipeline) gets
 * that real preview embedded, never a mockup.
 *
 * Usage:
 *   node tools/visual-production-studio/generate-final-review.ts
 * (requires reports/instructional-visuals/{manifest,mechanical-audit,
 * semantic-audit}.json to exist -- run `npm run visuals:all` first if
 * missing/stale; this script does not itself regenerate them)
 */

import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { chromium } from "@playwright/test";

import { generateReport } from "../../scripts/visual-governance/generate-report.ts";

import {
  allAssets,
  FAMILIES,
  familyForAsset,
  isPromptable,
  isReferenceBlocked,
  visualNeedClassificationFor,
  type VisualAsset,
  type VisualFamily,
} from "./catalogue.ts";
import { buildDashboard, type DashboardCounts } from "./dashboard.ts";
import { buildAuditReport, isAuditClean, type AuditReport } from "./audit.ts";
import { REPO_ROOT } from "./paths.ts";
import { loadState } from "./state-store.ts";

const REPORTS_DIR = join(REPO_ROOT, "reports", "instructional-visuals");
const JSON_PATH = join(REPORTS_DIR, "unit202-final-visual-production-review.json");
const PDF_PATH = join(REPORTS_DIR, "unit202-final-visual-production-review.pdf");

function esc(text: string): string {
  return String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

/** Reads .git/HEAD directly rather than shelling out to `git` -- avoids a child-process spawn that behaves inconsistently across shells/platforms for a purely informational metadata field. */
function currentCommit(): string {
  try {
    const headPath = join(REPO_ROOT, ".git", "HEAD");
    const head = readFileSync(headPath, "utf8").trim();
    const refMatch = /^ref: (.+)$/.exec(head);
    if (!refMatch) return head; // detached HEAD -- already a commit hash
    const refPath = join(REPO_ROOT, ".git", refMatch[1]!);
    if (existsSync(refPath)) return readFileSync(refPath, "utf8").trim();
    return `${head} (packed-ref, not resolved)`;
  } catch {
    return "unknown (.git/HEAD not readable)";
  }
}

// ---------------------------------------------------------------------
// Existing deterministic-preview lookup (§24: embed real renders, never fabricate)
// ---------------------------------------------------------------------

function existingSvgByVariantId(): Map<string, string> {
  const map = new Map<string, string>();
  try {
    const { cards } = generateReport();
    for (const card of cards) {
      const svgPath = join(REPORTS_DIR, card.svgRelativePath);
      if (existsSync(svgPath)) map.set(card.variantId, readFileSync(svgPath, "utf8"));
    }
  } catch {
    // The CC-05D review pipeline's own JSON sources may be stale/missing in
    // some environments -- this section is a nice-to-have preview, never a
    // hard dependency of this package's own audit correctness.
  }
  return map;
}

function firstExistingPreview(asset: VisualAsset, svgByVariantId: Map<string, string>): string | undefined {
  for (const state of asset.canonicalStates) {
    if (state.existingCanonicalVariantId && svgByVariantId.has(state.existingCanonicalVariantId)) {
      return svgByVariantId.get(state.existingCanonicalVariantId);
    }
  }
  return undefined;
}

// ---------------------------------------------------------------------
// Review data model -- built entirely from live catalogue/dashboard/audit data
// ---------------------------------------------------------------------

export interface ReviewAssetRow {
  sequence: number;
  assetId: string;
  familyId: string;
  familyDisplayName: string;
  displayName: string;
  loOrLesson: string;
  needClassification: string;
  referenceBlocked: boolean;
  productionClass: string;
  artPromptRequired: boolean;
  referenceReadiness: string;
  primaryReferenceName: string;
  primaryReferenceUrl: string;
  referenceLicence: string;
  role: string;
  instructionalPurpose: string;
  immutableFacts: string[];
  canonicalStates: { stateId: string; displayName: string; pedagogicalState: string; existingCanonicalVariantId?: string }[];
  historical66Mapped: boolean;
  sharedBaseClassification?: string;
  sharedBaseRationale?: string;
  sharedBaseConditions?: string[];
  splitFrom?: string;
  splitSiblings?: string[];
  annotationPolicy: string;
  expectedOutputFile: string;
  studioPromptAvailable: boolean;
}

function assetRow(asset: VisualAsset, svgByVariantId: Map<string, string>): ReviewAssetRow & { existingPreviewSvg?: string } {
  const family = familyForAsset(asset.assetId)!;
  return {
    sequence: asset.sequence,
    assetId: asset.assetId,
    familyId: family.familyId,
    familyDisplayName: family.displayName,
    displayName: asset.displayName,
    loOrLesson: asset.loOrLesson ?? "n/a",
    needClassification: visualNeedClassificationFor(asset),
    referenceBlocked: isReferenceBlocked(asset),
    productionClass: asset.productionClass,
    // Readiness-independent: "is this the kind of asset that needs a real
    // ChatGPT art prompt" -- NOT gated by isPromptable()/referenceReadiness,
    // or every blocked required/useful asset would silently vanish from the
    // Blocked References and Production Readiness sections (the bug this
    // comment replaces: isPromptable() requires READY, so a blocked asset's
    // own art-job-ness was previously reported as false).
    artPromptRequired: asset.productionClass !== "DETERMINISTIC_TECHNICAL" && asset.promptable !== false,
    referenceReadiness: asset.referenceReadiness,
    primaryReferenceName: asset.primaryReference.sourceName,
    primaryReferenceUrl: asset.primaryReference.sourceUrl,
    referenceLicence: asset.primaryReference.licence,
    role: asset.role,
    instructionalPurpose: asset.instructionalPurpose,
    immutableFacts: asset.immutableFacts,
    canonicalStates: asset.canonicalStates.map((s) => ({ stateId: s.stateId, displayName: s.displayName, pedagogicalState: s.pedagogicalState, existingCanonicalVariantId: s.existingCanonicalVariantId })),
    historical66Mapped: asset.canonicalStates.some((s) => Boolean(s.existingCanonicalVariantId)),
    sharedBaseClassification: asset.sharedBaseAudit?.classification,
    sharedBaseRationale: asset.sharedBaseAudit?.rationale,
    sharedBaseConditions: asset.sharedBaseAudit?.conditions,
    splitFrom: asset.sharedBaseAudit?.splitFrom,
    splitSiblings: asset.sharedBaseAudit?.splitSiblings,
    annotationPolicy: asset.annotationPolicy,
    expectedOutputFile: `apps/mobile/src/assets/instructional/unit202/${asset.outputSubfolder}/${asset.filenameBase}-v{N}.(png|webp|jpg)`,
    studioPromptAvailable: isPromptable(asset),
    existingPreviewSvg: firstExistingPreview(asset, svgByVariantId),
  };
}

export interface MultiStateSharingRow {
  assetId: string;
  displayName: string;
  stateCount: number;
  decision: string;
  rationale: string;
  action: string;
  splitFrom?: string;
  splitSiblings?: string[];
}

export interface ArtJobRow {
  jobNumber: number;
  assetId: string;
  displayName: string;
  needClassification: string;
  readiness: "READY" | "BLOCKED";
  referenceName: string;
  statesSupported: string[];
}

export interface DirectionalSafetyRow {
  familyId: string;
  familyDisplayName: string;
  technicalAuthority: string;
  generatedArtBoundary: string;
  statesRequiringSeparateArtwork: string[];
  deterministicStates: string[];
}

export interface ReviewData {
  generatedAt: string;
  commit: string;
  executiveSummary: {
    visualFamilies: number;
    productionAssets: number;
    canonicalStates: number;
    historicalVariantsReconciled: number;
    historicalVariantsTotal: number;
    requiredTotal: number;
    requiredReady: number;
    requiredBlocked: number;
    usefulTotal: number;
    usefulReady: number;
    usefulBlocked: number;
    deterministicOnly: number;
    premiumHybridArtJobsTotal: number;
    requiredArtJobs: number;
    usefulArtJobs: number;
    sharedBasesAudited: number;
    sharedBasesKept: number;
    sharedBasesKeptWithConditions: number;
    sharedBasesSplit: number;
    requiredVisualProductionComplete: boolean;
  };
  assets: (ReviewAssetRow & { existingPreviewSvg?: string })[];
  multiStateSharing: MultiStateSharingRow[];
  artJobs: ArtJobRow[];
  deterministicAssets: { assetId: string; displayName: string; needClassification: string; stateCount: number }[];
  blockedReferences: { required: ReviewAssetRow[]; useful: ReviewAssetRow[] };
  directionalSafety: DirectionalSafetyRow[];
  componentRecognition: ReviewAssetRow[];
  productionReadiness: { assetId: string; displayName: string; needClassification: string; status: "READY TO GENERATE" | "BLOCKED" }[];
  finalAudit: AuditReport & { clean: boolean };
  dashboard: DashboardCounts;
}

function directionalSafetyRow(familyId: string, technicalAuthority: string, generatedArtBoundary: string): DirectionalSafetyRow {
  const family = FAMILIES.find((f) => f.familyId === familyId)!;
  const statesRequiringSeparateArtwork: string[] = [];
  const deterministicStates: string[] = [];
  for (const asset of family.assets) {
    for (const state of asset.canonicalStates) {
      const label = `${asset.assetId} / ${state.stateId}`;
      if (asset.productionClass === "DETERMINISTIC_TECHNICAL") deterministicStates.push(label);
      else if (asset.sharedBaseAudit?.classification === "SEPARATE_ARTWORK_REQUIRED") statesRequiringSeparateArtwork.push(label);
    }
  }
  return { familyId, familyDisplayName: family.displayName, technicalAuthority, generatedArtBoundary, statesRequiringSeparateArtwork, deterministicStates };
}

export function buildReviewData(families: VisualFamily[] = FAMILIES): ReviewData {
  const assets = allAssets(families);
  const state = loadState(undefined, families);
  const dashboard = buildDashboard(state, families);
  const auditReport = buildAuditReport(families);
  const svgByVariantId = existingSvgByVariantId();

  const rows = assets.map((a) => assetRow(a, svgByVariantId));

  const multiStateAssets = assets.filter((a) => a.sharedBaseAudit);
  const multiStateSharing: MultiStateSharingRow[] = multiStateAssets.map((a) => ({
    assetId: a.assetId,
    displayName: a.displayName,
    stateCount: a.canonicalStates.length,
    decision: a.sharedBaseAudit!.classification,
    rationale: a.sharedBaseAudit!.rationale,
    action: a.sharedBaseAudit!.action,
    splitFrom: a.sharedBaseAudit!.splitFrom,
    splitSiblings: a.sharedBaseAudit!.splitSiblings,
  }));

  // §9: the ACTUAL art-job list -- every distinct promptable, non-deterministic asset, one row per real ChatGPT session. REQUIRED before USEFUL, then priority, then sequence (matches next-asset.ts's own ranking).
  const priorityRank: Record<string, number> = { P0: 0, P1: 1, P2: 2 };
  const artJobAssets = assets
    .filter((a) => a.productionClass !== "DETERMINISTIC_TECHNICAL" && a.promptable !== false)
    .sort((a, b) => {
      const classDelta = Number(a.needOverride === "USEFUL") - Number(b.needOverride === "USEFUL");
      if (classDelta !== 0) return classDelta;
      const prDelta = priorityRank[a.priority]! - priorityRank[b.priority]!;
      if (prDelta !== 0) return prDelta;
      return a.sequence - b.sequence;
    });
  const artJobs: ArtJobRow[] = artJobAssets.map((a, i) => ({
    jobNumber: i + 1,
    assetId: a.assetId,
    displayName: a.displayName,
    needClassification: visualNeedClassificationFor(a),
    readiness: isReferenceBlocked(a) ? "BLOCKED" : "READY",
    referenceName: a.primaryReference.sourceName,
    statesSupported: a.canonicalStates.map((s) => s.displayName),
  }));

  const deterministicAssets = assets
    .filter((a) => a.productionClass === "DETERMINISTIC_TECHNICAL" || a.promptable === false)
    .map((a) => ({ assetId: a.assetId, displayName: a.displayName, needClassification: visualNeedClassificationFor(a), stateCount: a.canonicalStates.length }));

  const blockedRows = rows.filter((r) => r.referenceBlocked && r.artPromptRequired);
  const blockedReferences = {
    required: blockedRows.filter((r) => r.needClassification === "REQUIRED"),
    useful: blockedRows.filter((r) => r.needClassification === "USEFUL"),
  };

  const directionalSafety: DirectionalSafetyRow[] = [
    directionalSafetyRow(
      "unit202.family.right-hand-grip",
      "Right-hand grip rule: thumb = conventional current, curled fingers = magnetic-field circulation direction. Governed by the deterministic magnetic.field_conductor_direction blueprint for assessment; the premium phenomenon/mnemonic assets are teaching-only illustrations of the same governed geometry.",
      "The conductor's concentric field-line pattern is direction-neutral in the base artwork -- current-direction and field-circulation indicators are added as a deterministic overlay, never baked in, so one base image safely serves both current directions (CC-11.7B correction).",
    ),
    directionalSafetyRow(
      "unit202.family.fleming-left-hand-motor",
      "Fleming's left-hand rule (motor effect): thumb = force/motion, first finger = field, second finger = current, mutually perpendicular. Governed by the deterministic motor.force_field_current blueprint for assessment.",
      "Pole orientation (horizontal vs vertical) is a genuine apparatus-layout change requiring separate artwork (CC-11.7B split into .horizontal-poles / .vertical-poles); current direction within one fixed orientation remains a deterministic overlay concern.",
    ),
    directionalSafetyRow(
      "unit202.family.fleming-right-hand-generator",
      "Fleming's right-hand rule (generator effect): thumb = conductor motion, first finger = field, second finger = induced current/EMF. Governed by the deterministic generator.rotating_loop blueprint for assessment.",
      "Loop pose (face-on/near-zero-EMF vs edge-on/near-peak-EMF) is a materially different 3D silhouette requiring separate artwork (CC-11.7B split into .horizontal / .vertical) -- no deterministic overlay can rotate a loop's rendered pose.",
    ),
  ];

  const componentRecognition = rows.filter((r) => r.role === "PHYSICAL_RECOGNITION");

  const productionReadiness = rows
    .filter((r) => r.artPromptRequired)
    .map((r) => ({ assetId: r.assetId, displayName: r.displayName, needClassification: r.needClassification, status: (r.referenceBlocked ? "BLOCKED" : "READY TO GENERATE") as "READY TO GENERATE" | "BLOCKED" }));

  const executiveSummary = {
    visualFamilies: families.length,
    productionAssets: assets.length,
    canonicalStates: assets.reduce((sum, a) => sum + a.canonicalStates.length, 0),
    historicalVariantsReconciled: auditReport.totalRealCanonicalVariants - auditReport.unmappedExistingVariants.length,
    historicalVariantsTotal: auditReport.totalRealCanonicalVariants,
    requiredTotal: dashboard.requiredTotal,
    requiredReady: dashboard.requiredReady,
    requiredBlocked: dashboard.requiredBlocked,
    usefulTotal: dashboard.usefulTotal,
    usefulReady: dashboard.usefulReady,
    usefulBlocked: dashboard.usefulBlocked,
    deterministicOnly: dashboard.deterministicOnly,
    premiumHybridArtJobsTotal: dashboard.requiredArtJobsTotal + dashboard.usefulArtJobsTotal,
    requiredArtJobs: dashboard.requiredArtJobsTotal,
    usefulArtJobs: dashboard.usefulArtJobsTotal,
    sharedBasesAudited: multiStateSharing.length,
    sharedBasesKept: multiStateSharing.filter((r) => r.action === "KEEP").length,
    sharedBasesKeptWithConditions: multiStateSharing.filter((r) => r.action === "KEEP_WITH_CONDITIONS").length,
    sharedBasesSplit: multiStateSharing.filter((r) => r.action === "SPLIT").length,
    requiredVisualProductionComplete: dashboard.requiredVisualProductionComplete,
  };

  return {
    generatedAt: new Date().toISOString(),
    commit: currentCommit(),
    executiveSummary,
    assets: rows,
    multiStateSharing,
    artJobs,
    deterministicAssets,
    blockedReferences,
    directionalSafety,
    componentRecognition,
    productionReadiness,
    finalAudit: { ...auditReport, clean: isAuditClean(auditReport) },
    dashboard,
  };
}

// ---------------------------------------------------------------------
// HTML rendering
// ---------------------------------------------------------------------

function needBadgeHtml(classification: string): string {
  const cls = classification === "USEFUL" ? "badge-useful" : classification === "DEFERRED_SCOPE" ? "badge-deferred" : "badge-required";
  return `<span class="badge ${cls}">${esc(classification)}</span>`;
}

function blockedBadgeHtml(blocked: boolean): string {
  return blocked ? `<span class="badge badge-blocked">BLOCKED</span>` : `<span class="badge badge-ready">READY</span>`;
}

function coverPageHtml(data: ReviewData): string {
  return `
<section class="sheet cover">
  <h1>Unit 202 — Final Visual Production Review</h1>
  <p class="generated">Package: CC-11.7B &middot; Commit: <code>${esc(data.commit)}</code> &middot; Generated: ${esc(data.generatedAt)}</p>
  <div class="notice notice-critical">
    PRE-PRODUCTION REVIEW — NO ARTWORK GENERATION SHOULD BEGIN UNTIL APPROVED
  </div>
  <p>This document is the complete, final pre-production review pack for the Unit 202 instructional-visual production catalogue. It is generated directly from the live Visual Production Studio catalogue -- every number and table in this document is derived mechanically, never hand-maintained separately.</p>
  <p>It is intended to be understandable without opening the repository: an independent reviewer should be able to answer, from this document alone, whether every important visual need is represented, whether any distinct images have been incorrectly compressed into one production asset, whether teaching/assessment/feedback states are properly separated, and whether the proposed manual ChatGPT production workload is sensible.</p>
</section>`;
}

function executiveSummaryHtml(data: ReviewData): string {
  const s = data.executiveSummary;
  const rows: Array<[string, string | number]> = [
    ["Visual families", s.visualFamilies],
    ["Production assets", s.productionAssets],
    ["Canonical learner-visible states", s.canonicalStates],
    ["Historical CC-05D variants reconciled", `${s.historicalVariantsReconciled} / ${s.historicalVariantsTotal}`],
    ["REQUIRED assets (total / ready / blocked)", `${s.requiredTotal} / ${s.requiredReady} / ${s.requiredBlocked}`],
    ["USEFUL assets (total / ready / blocked)", `${s.usefulTotal} / ${s.usefulReady} / ${s.usefulBlocked}`],
    ["Deterministic-only assets (no ChatGPT job)", s.deterministicOnly],
    ["Premium/hybrid art jobs — TOTAL", s.premiumHybridArtJobsTotal],
    ["  of which REQUIRED", s.requiredArtJobs],
    ["  of which USEFUL", s.usefulArtJobs],
    ["Shared-base decisions audited", s.sharedBasesAudited],
    ["  KEPT (SAFE_SHARED_BASE)", s.sharedBasesKept],
    ["  KEPT WITH CONDITIONS", s.sharedBasesKeptWithConditions],
    ["  SPLIT (SEPARATE_ARTWORK_REQUIRED)", s.sharedBasesSplit],
    ["REQUIRED VISUAL PRODUCTION COMPLETE", s.requiredVisualProductionComplete ? "YES" : "NO — not yet complete"],
  ];
  return `
<section class="sheet">
  <h2>Executive summary</h2>
  <table class="kv-table">
    ${rows.map(([k, v]) => `<tr><th>${esc(k)}</th><td>${esc(String(v))}</td></tr>`).join("\n")}
  </table>
</section>`;
}

function howToReadHtml(): string {
  const terms: Array<[string, string]> = [
    ["VisualFamily", "An organisational grouping of one or more ProductionAssets that together teach one concept. Never reduces prompt granularity."],
    ["ProductionAsset (\"image job\")", "One real, independent image-generation job (or deterministic-only artefact) -- its own prompt, filename, save slot and approval state."],
    ["CanonicalState", "One distinct learner-visible presentation a ProductionAsset supports (e.g. teaching vs assessment). Several states may safely share one base image via deterministic overlay, or may require separate artwork -- see the Multi-state sharing review."],
    ["Deterministic asset", "Produced entirely by ALP's own rendering code -- never a ChatGPT image-generation job."],
    ["Premium / Hybrid asset", "A real ChatGPT image-generation job. Hybrid assets combine generated artwork with a deterministic overlay layer."],
    ["Required", "Unit 202 visual completeness depends on this asset existing."],
    ["Useful", "Optional enrichment the Product Owner may choose to commission for course quality -- never blocks REQUIRED completeness."],
    ["Blocked reference", "A production-readiness state, independent of REQUIRED/USEFUL: no approved reference exists yet for this asset."],
    ["Teaching / Assessment / Feedback", "The pedagogical state a canonical state is produced for -- assessment states never reveal the answer; teaching/feedback states may."],
  ];
  return `
<section class="sheet">
  <h2>How to read this catalogue</h2>
  <table class="kv-table">
    ${terms.map(([k, v]) => `<tr><th>${esc(k)}</th><td>${esc(v)}</td></tr>`).join("\n")}
  </table>
</section>`;
}

function assetCardHtml(row: ReviewAssetRow & { existingPreviewSvg?: string }): string {
  const preview = row.existingPreviewSvg
    ? `<div class="asset-preview">${row.existingPreviewSvg}</div>`
    : row.artPromptRequired
      ? `<div class="asset-preview placeholder">ARTWORK NOT YET PRODUCED</div>`
      : "";
  const blockedNotice = row.referenceBlocked && row.artPromptRequired ? `<p class="blocked-notice">BLOCKED — REFERENCE REQUIRED BEFORE PRODUCTION.</p>` : "";
  return `
<div class="asset-card">
  <div class="asset-card-head">
    <span class="seq">#${String(row.sequence).padStart(2, "0")}</span>
    <h4>${esc(row.displayName)}</h4>
    ${needBadgeHtml(row.needClassification)}
    ${row.artPromptRequired ? blockedBadgeHtml(row.referenceBlocked) : `<span class="badge badge-deterministic">NO ART PROMPT</span>`}
  </div>
  <div class="asset-card-meta">
    <code>${esc(row.assetId)}</code> &middot; family: ${esc(row.familyDisplayName)} &middot; ${esc(row.loOrLesson)} &middot; role: ${esc(row.role)} &middot; class: ${esc(row.productionClass)}
  </div>
  ${preview}
  ${blockedNotice}
  <p class="purpose">${esc(row.instructionalPurpose)}</p>
  <table class="mini-table">
    <tr><th>Reference</th><td>${esc(row.primaryReferenceName)}${row.primaryReferenceUrl ? ` — <a href="${esc(row.primaryReferenceUrl)}">${esc(row.primaryReferenceUrl)}</a>` : ""} (${esc(row.referenceLicence)})</td></tr>
    <tr><th>Immutable facts</th><td>${row.immutableFacts.length ? esc(row.immutableFacts.join("; ")) : "&mdash;"}</td></tr>
    <tr><th>Annotation policy</th><td>${esc(row.annotationPolicy)}</td></tr>
    <tr><th>Canonical states</th><td>${row.canonicalStates.map((s) => `${esc(s.displayName)} [${esc(s.pedagogicalState)}]${s.existingCanonicalVariantId ? " (historical-66)" : ""}`).join("<br/>")}</td></tr>
    <tr><th>Shared-base decision</th><td>${row.sharedBaseClassification ? `${esc(row.sharedBaseClassification)} — ${esc(row.sharedBaseRationale ?? "")}` : "single state / not applicable"}</td></tr>
    <tr><th>Expected output file</th><td><code>${esc(row.expectedOutputFile)}</code></td></tr>
    <tr><th>Studio prompt</th><td>${row.studioPromptAvailable ? "Available in Studio (COPY PROMPT / VIEW PROMPT)" : "Not offered (blocked, scope-pending, or deterministic-only)"}</td></tr>
  </table>
</div>`;
}

function fullCatalogueHtml(data: ReviewData): string {
  const byLo = new Map<string, (ReviewAssetRow & { existingPreviewSvg?: string })[]>();
  for (const row of data.assets) {
    const key = row.loOrLesson;
    if (!byLo.has(key)) byLo.set(key, []);
    byLo.get(key)!.push(row);
  }
  const sections = [...byLo.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([lo, rows]) => `<section class="sheet"><h3>${esc(lo)}</h3>${rows.map(assetCardHtml).join("\n")}</section>`)
    .join("\n");
  return `<section class="sheet"><h2>Full catalogue, by LO / lesson</h2><p>Every production asset in the live catalogue, ${data.assets.length} total.</p></section>\n${sections}`;
}

function multiStateSharingHtml(data: ReviewData): string {
  const rows = data.multiStateSharing
    .map(
      (r) => `<tr>
    <td><code>${esc(r.assetId)}</code><br/>${esc(r.displayName)}</td>
    <td>${r.stateCount}</td>
    <td><strong>${esc(r.decision)}</strong></td>
    <td>${esc(r.rationale)}</td>
    <td>${esc(r.action)}</td>
  </tr>`,
    )
    .join("\n");
  return `
<section class="sheet">
  <h2>Multi-state sharing review</h2>
  <p>Every ProductionAsset with more than one CanonicalState, audited for whether the proposed image sharing is genuinely safe. ${data.multiStateSharing.length} assets audited: ${data.executiveSummary.sharedBasesKept} kept, ${data.executiveSummary.sharedBasesKeptWithConditions} kept with conditions, ${data.executiveSummary.sharedBasesSplit} split.</p>
  <table class="wide-table">
    <thead><tr><th>Asset</th><th>States</th><th>Decision</th><th>Rationale</th><th>Action</th></tr></thead>
    <tbody>${rows}</tbody>
  </table>
</section>`;
}

function artJobListHtml(data: ReviewData): string {
  const rows = data.artJobs
    .map(
      (j) => `<tr>
    <td>ART JOB ${String(j.jobNumber).padStart(2, "0")}</td>
    <td><code>${esc(j.assetId)}</code><br/>${esc(j.displayName)}</td>
    <td>${needBadgeHtml(j.needClassification)}</td>
    <td>${j.readiness === "READY" ? blockedBadgeHtml(false) : blockedBadgeHtml(true)}</td>
    <td>${esc(j.referenceName)}</td>
    <td>${j.statesSupported.map(esc).join("<br/>")}</td>
  </tr>`,
    )
    .join("\n");
  return `
<section class="sheet">
  <h2>Actual image-generation job list — the real production workload</h2>
  <p>${data.artJobs.length} separate ChatGPT image-generation jobs (${data.executiveSummary.requiredArtJobs} REQUIRED, ${data.executiveSummary.usefulArtJobs} USEFUL). This is the Product Owner's real manual workload -- not the family count, not the state count, not the asset count.</p>
  <table class="wide-table">
    <thead><tr><th>#</th><th>Asset</th><th>Need</th><th>Status</th><th>Reference</th><th>States supported</th></tr></thead>
    <tbody>${rows}</tbody>
  </table>
</section>`;
}

function deterministicListHtml(data: ReviewData): string {
  const rows = data.deterministicAssets.map((d) => `<tr><td><code>${esc(d.assetId)}</code><br/>${esc(d.displayName)}</td><td>${needBadgeHtml(d.needClassification)}</td><td>${d.stateCount}</td></tr>`).join("\n");
  return `
<section class="sheet">
  <h2>Deterministic visual list</h2>
  <p class="notice">NO CHATGPT IMAGE GENERATION REQUIRED for any asset in this list -- all ${data.deterministicAssets.length} are produced entirely by ALP's own rendering code.</p>
  <table class="wide-table">
    <thead><tr><th>Asset</th><th>Need</th><th>States</th></tr></thead>
    <tbody>${rows}</tbody>
  </table>
</section>`;
}

function blockedReferencesHtml(data: ReviewData): string {
  const section = (title: string, rows: ReviewAssetRow[]) => `
  <h3>${esc(title)} (${rows.length})</h3>
  ${
    rows.length === 0
      ? "<p>None.</p>"
      : `<table class="wide-table"><thead><tr><th>Asset</th><th>Visual need</th><th>What reference is needed</th></tr></thead><tbody>${rows
          .map((r) => `<tr><td><code>${esc(r.assetId)}</code><br/>${esc(r.displayName)}</td><td>${esc(r.instructionalPurpose)}</td><td>An authoritative technical/photographic reference for: ${esc(r.displayName)}</td></tr>`)
          .join("\n")}</tbody></table>`
  }`;
  return `
<section class="sheet">
  <h2>Blocked references</h2>
  ${section("REQUIRED, blocked", data.blockedReferences.required)}
  ${section("USEFUL, blocked", data.blockedReferences.useful)}
</section>`;
}

function directionalSafetyHtml(data: ReviewData): string {
  const rows = data.directionalSafety
    .map(
      (r) => `<div class="asset-card">
    <h4>${esc(r.familyDisplayName)}</h4>
    <table class="mini-table">
      <tr><th>Technical authority</th><td>${esc(r.technicalAuthority)}</td></tr>
      <tr><th>Generated-art boundary</th><td>${esc(r.generatedArtBoundary)}</td></tr>
      <tr><th>States requiring separate artwork</th><td>${r.statesRequiringSeparateArtwork.length ? r.statesRequiringSeparateArtwork.map(esc).join("<br/>") : "none"}</td></tr>
      <tr><th>Deterministic states</th><td>${r.deterministicStates.length ? r.deterministicStates.map(esc).join("<br/>") : "none"}</td></tr>
    </table>
  </div>`,
    )
    .join("\n");
  return `
<section class="sheet">
  <h2>Right-hand / Fleming / motor / generator directional safety</h2>
  <p>Allows independent technical review of every direction-sensitive electromagnetic family before any artwork is generated.</p>
  ${rows}
</section>`;
}

function componentRecognitionHtml(data: ReviewData): string {
  const rows = data.componentRecognition
    .map((r) => `<tr><td><code>${esc(r.assetId)}</code><br/>${esc(r.displayName)}</td><td>${needBadgeHtml(r.needClassification)}</td><td>${blockedBadgeHtml(r.referenceBlocked)}</td></tr>`)
    .join("\n");
  return `
<section class="sheet">
  <h2>Component-recognition section</h2>
  <p>Every individual physical-recognition art job, shown separately -- never hidden behind one family count. ${data.componentRecognition.length} total.</p>
  <table class="wide-table">
    <thead><tr><th>Asset</th><th>Need</th><th>Status</th></tr></thead>
    <tbody>${rows}</tbody>
  </table>
</section>`;
}

function productionReadinessHtml(data: ReviewData): string {
  const rows = data.productionReadiness
    .map((r) => `<tr><td><code>${esc(r.assetId)}</code><br/>${esc(r.displayName)}</td><td>${needBadgeHtml(r.needClassification)}</td><td><strong>${esc(r.status)}</strong></td></tr>`)
    .join("\n");
  return `
<section class="sheet">
  <h2>Final production readiness table</h2>
  <table class="wide-table">
    <thead><tr><th>Asset</th><th>Need</th><th>Status</th></tr></thead>
    <tbody>${rows}</tbody>
  </table>
</section>`;
}

function finalAuditHtml(data: ReviewData): string {
  const a = data.finalAudit;
  const rows: Array<[string, number]> = [
    ["Historical variants unmapped", a.unmappedExistingVariants.length],
    ["Duplicate ids", a.duplicateIds.length],
    ["Premium/hybrid assets with no working prompt", a.requiredPremiumHybridWithNoPrompt.length],
    ["Premium/hybrid assets with no reference or blocked status", a.requiredPremiumHybridWithNoReferenceOrBlockedStatus.length],
    ["Canonical states with no pedagogical state", a.stateWithNoPedagogicalState.length],
    ["Assessment states leaking a mnemonic", a.assessmentLeaksMnemonic.length],
    ["CC-11.7 USEFUL findings missing from catalogue", a.usefulFindingsMissingFromCatalogue.length],
    ["Catalogue structural problems", a.catalogueStructuralProblems.length],
    ["Multi-state assets missing a shared-base decision", a.multiStateAssetsMissingSharedBaseAudit.length],
    ["Split decisions not actually applied", a.splitDecisionsNotApplied.length],
    ["REQUIRED-but-blocked assets excluded from REQUIRED total", a.requiredBlockedExcludedFromRequiredTotal.length],
  ];
  return `
<section class="sheet">
  <h2>Final audit statement</h2>
  <p class="notice ${a.clean ? "notice-good" : "notice-critical"}">${a.clean ? "PASS — all mechanical audit gates are zero." : "FAIL — one or more mechanical audit gates are non-zero. Do not proceed to production."}</p>
  <table class="kv-table">
    ${rows.map(([k, v]) => `<tr><th>${esc(k)}</th><td>${v} (target 0)</td></tr>`).join("\n")}
  </table>
  <p>Run <code>npm run visuals:studio:audit</code> to reproduce this result mechanically.</p>
</section>`;
}

export function buildReviewHtml(data: ReviewData): string {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>Unit 202 — Final Visual Production Review</title>
<style>
  * { box-sizing: border-box; }
  body { margin: 0; font-family: system-ui, -apple-system, "Segoe UI", sans-serif; color: #16181d; background: #fff; font-size: 12px; line-height: 1.45; }
  .sheet { page-break-after: always; padding: 20px 28px; }
  .sheet:last-child { page-break-after: auto; }
  .cover { display: flex; flex-direction: column; justify-content: center; min-height: 90vh; gap: 14px; }
  .cover h1 { font-size: 26px; margin: 0; }
  .cover .generated { color: #666; font-size: 11px; }
  h2 { font-size: 17px; margin: 0 0 12px; border-bottom: 2px solid #222; padding-bottom: 6px; }
  h3 { font-size: 14px; margin: 18px 0 8px; color: #333; }
  h4 { font-size: 12.5px; margin: 0; flex: 1; }
  .notice { border: 1px solid #8a5cf6; background: #f4effe; color: #4a2d99; border-radius: 8px; padding: 10px 14px; font-size: 12px; margin: 0 0 12px; }
  .notice-critical { border-color: #d9364a; background: #fdecee; color: #8a1526; font-weight: 700; text-align: center; font-size: 13px; }
  .notice-good { border-color: #1a7f37; background: #eaf7ee; color: #1a7f37; font-weight: 700; }
  .kv-table { width: 100%; border-collapse: collapse; }
  .kv-table th { text-align: left; color: #555; font-weight: 600; padding: 4px 10px 4px 0; width: 45%; vertical-align: top; }
  .kv-table td { padding: 4px 0; }
  .kv-table tr { border-bottom: 1px solid #eee; }
  .wide-table { width: 100%; border-collapse: collapse; font-size: 11px; }
  .wide-table th { background: #222; color: #fff; text-align: left; padding: 6px 8px; }
  .wide-table td { padding: 6px 8px; border-bottom: 1px solid #ddd; vertical-align: top; }
  .wide-table thead { display: table-header-group; }
  .wide-table tr { page-break-inside: avoid; }
  .asset-card { border: 1px solid #ccc; border-radius: 8px; padding: 10px 12px; margin-bottom: 12px; page-break-inside: avoid; }
  .asset-card-head { display: flex; align-items: center; gap: 8px; margin-bottom: 4px; }
  .asset-card-head .seq { color: #888; font-size: 10px; }
  .asset-card-meta { font-size: 10px; color: #666; margin-bottom: 6px; }
  .asset-preview { max-width: 260px; max-height: 180px; margin: 6px 0; border: 1px solid #ddd; border-radius: 6px; overflow: hidden; background: #0B0D12; display: flex; align-items: center; justify-content: center; }
  .asset-preview svg { max-width: 100%; max-height: 180px; }
  .asset-preview.placeholder { background: #f5f5f5; color: #999; font-weight: 700; font-size: 11px; text-align: center; padding: 30px 10px; border-style: dashed; }
  .purpose { color: #444; margin: 4px 0; }
  .mini-table { width: 100%; border-collapse: collapse; font-size: 10.5px; margin-top: 6px; }
  .mini-table th { text-align: left; color: #666; width: 22%; vertical-align: top; padding: 2px 6px 2px 0; }
  .mini-table td { padding: 2px 0; }
  .blocked-notice { color: #a6172b; font-weight: 700; font-size: 11px; margin: 4px 0; }
  .badge { display: inline-block; font-size: 9px; font-weight: 700; padding: 2px 7px; border-radius: 999px; border: 1px solid #999; white-space: nowrap; }
  .badge-required { color: #1a7f37; border-color: #1a7f37; }
  .badge-useful { color: #a6710a; border-color: #a6710a; }
  .badge-deferred { color: #666; border-color: #999; }
  .badge-blocked { color: #a6172b; border-color: #a6172b; }
  .badge-ready { color: #1a7f37; border-color: #1a7f37; }
  .badge-deterministic { color: #2255aa; border-color: #2255aa; }
  a { color: #2255aa; }
  code { font-size: 10.5px; }
</style>
</head>
<body>
${coverPageHtml(data)}
${executiveSummaryHtml(data)}
${howToReadHtml()}
${fullCatalogueHtml(data)}
${multiStateSharingHtml(data)}
${artJobListHtml(data)}
${deterministicListHtml(data)}
${blockedReferencesHtml(data)}
${directionalSafetyHtml(data)}
${componentRecognitionHtml(data)}
${productionReadinessHtml(data)}
${finalAuditHtml(data)}
</body>
</html>`;
}

// ---------------------------------------------------------------------
// Main -- writes both artefacts
// ---------------------------------------------------------------------

export async function generateFinalReview(): Promise<{ data: ReviewData; pdfPath: string; jsonPath: string }> {
  const data = buildReviewData();

  mkdirSync(REPORTS_DIR, { recursive: true });
  writeFileSync(JSON_PATH, JSON.stringify(data, null, 2) + "\n", "utf8");

  const html = buildReviewHtml(data);
  const scratchDir = mkdtempSync(join(tmpdir(), "unit202-final-review-"));
  const tempHtmlPath = join(scratchDir, "_source.html");
  writeFileSync(tempHtmlPath, html, "utf8");

  const browser = await chromium.launch();
  let pdfBuffer: Buffer;
  try {
    const page = await browser.newPage();
    await page.goto(`file://${tempHtmlPath.replace(/\\/g, "/")}`);
    pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "14mm", bottom: "14mm", left: "12mm", right: "12mm" },
      displayHeaderFooter: true,
      headerTemplate: "<span></span>",
      footerTemplate: `<div style="width:100%;font-size:8px;color:#999;text-align:center;">Unit 202 Final Visual Production Review &middot; Page <span class="pageNumber"></span> / <span class="totalPages"></span></div>`,
    });
  } finally {
    await browser.close();
    rmSync(scratchDir, { recursive: true, force: true });
  }

  writeFileSync(PDF_PATH, pdfBuffer);

  return { data, pdfPath: PDF_PATH, jsonPath: JSON_PATH };
}

function isMainModule(): boolean {
  const entryPoint = process.argv[1];
  if (!entryPoint) return false;
  return fileURLToPath(import.meta.url) === entryPoint;
}

if (isMainModule()) {
  generateFinalReview()
    .then(({ data, pdfPath, jsonPath }) => {
      console.log(`Final visual production review generated.`);
      console.log(`  Assets: ${data.assets.length}, art jobs: ${data.artJobs.length}, multi-state audited: ${data.multiStateSharing.length}`);
      console.log(`  PDF: ${pdfPath}`);
      console.log(`  JSON: ${jsonPath}`);
    })
    .catch((error: unknown) => {
      console.error(error);
      process.exitCode = 1;
    });
}
