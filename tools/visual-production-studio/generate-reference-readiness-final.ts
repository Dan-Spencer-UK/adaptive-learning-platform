/**
 * CC-11.9 §6: the hard Reference Gate. Every non-deterministic
 * (generative) asset must resolve to a real, locally-storable technical
 * reference before any production run -- zero missing, zero unresolved
 * placeholders, zero unprepared composites passed raw to Gemini.
 */

import { existsSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { allAssets } from "./catalogue.ts";
import { effectivePrimaryReference, effectiveReferenceReadiness, REFERENCE_CORRECTIONS } from "./reference-corrections.ts";
import { REPO_ROOT } from "./paths.ts";
import { PREPARED_REFERENCE_DIR } from "./reference-preparation.ts";

const OUT_DIR = resolve(REPO_ROOT, "reports", "instructional-visuals");

// Composite sources that must be cropped/isolated before Gemini receives
// them -- known from direct inspection (levers, confirmed CC-11.8) plus
// the handover's own explicit composite/crop instructions. An asset here
// is only actually COMPOSITE_UNPREPARED if no prepared file exists for it
// yet at PREPARED_REFERENCE_DIR/<assetId>.prepared.png -- checked live
// below, not assumed from this membership alone.
const KNOWN_COMPOSITE_ASSET_IDS = new Set([
  "unit202.levers.class-1",
  "unit202.levers.class-2",
  "unit202.levers.class-3",
  "unit202.components.physical.thyristor-scr", // multi-package photo, crop required
  "unit202.emf.motional", // multi-panel Faraday's-law figure, crop required
]);

function hasPreparedReference(assetId: string): boolean {
  return existsSync(join(PREPARED_REFERENCE_DIR, `${assetId}.prepared.png`));
}

export interface GateRow {
  assetId: string;
  productionClass: string;
  exempt: boolean;
  referenceStatus: "READY" | "MISSING" | "UNRESOLVED_PLACEHOLDER" | "COMPOSITE_UNPREPARED";
  sourceUrl: string | null;
  researchDecision: string | null;
}

export function buildGateRows(): GateRow[] {
  return allAssets().map((asset) => {
    const exempt = asset.productionClass === "DETERMINISTIC_TECHNICAL";
    const readiness = effectiveReferenceReadiness(asset);
    const ref = effectivePrimaryReference(asset);
    const correction = REFERENCE_CORRECTIONS[asset.assetId];

    let status: GateRow["referenceStatus"];
    if (exempt) status = "READY";
    else if (readiness !== "READY" || !ref.sourceUrl) status = "MISSING";
    else if (ref.sourceUrl.includes("STILL TO BE APPROVED") || ref.sourceUrl.trim() === "") status = "UNRESOLVED_PLACEHOLDER";
    else if (KNOWN_COMPOSITE_ASSET_IDS.has(asset.assetId) && !hasPreparedReference(asset.assetId)) status = "COMPOSITE_UNPREPARED";
    else status = "READY";

    return {
      assetId: asset.assetId,
      productionClass: asset.productionClass,
      exempt,
      referenceStatus: status,
      sourceUrl: ref.sourceUrl || null,
      researchDecision: correction?.researchDecision ?? null,
    };
  });
}

export function buildGateReport() {
  const rows = buildGateRows();
  const generative = rows.filter((r) => !r.exempt);
  const missing = generative.filter((r) => r.referenceStatus === "MISSING");
  const unresolved = generative.filter((r) => r.referenceStatus === "UNRESOLVED_PLACEHOLDER");
  const composite = generative.filter((r) => r.referenceStatus === "COMPOSITE_UNPREPARED");
  const ready = generative.filter((r) => r.referenceStatus === "READY");

  return {
    generatedAt: new Date().toISOString(),
    totals: { total: rows.length, generative: generative.length, deterministicExempt: rows.length - generative.length },
    generativeAssetsReady: ready.length,
    generativeAssetsTotal: generative.length,
    missingReferences: missing.length,
    unresolvedPlaceholders: unresolved.length,
    unpreparedComposites: composite.length,
    gatePasses: missing.length === 0 && unresolved.length === 0 && composite.length === 0,
    rows,
  };
}

function buildGateMarkdown(report: ReturnType<typeof buildGateReport>): string {
  const lines: string[] = [];
  lines.push("# Unit 202 -- Final Reference Readiness (Gate Check)");
  lines.push("");
  lines.push(`Generated: ${report.generatedAt}`);
  lines.push("");
  lines.push(`**GENERATIVE ASSETS READY: ${report.generativeAssetsReady} / ${report.generativeAssetsTotal}**`);
  lines.push(`**MISSING REFERENCES: ${report.missingReferences}**`);
  lines.push(`**UNRESOLVED PLACEHOLDERS: ${report.unresolvedPlaceholders}**`);
  lines.push(`**UNPREPARED COMPOSITES: ${report.unpreparedComposites}**`);
  lines.push("");
  lines.push(`Gate status: **${report.gatePasses ? "PASS -- production may proceed" : "BLOCKED -- do not begin production"}**`);
  lines.push("");
  if (report.unpreparedComposites > 0) {
    lines.push("## Composite sources requiring preparation before use");
    lines.push("");
    for (const r of report.rows.filter((r) => r.referenceStatus === "COMPOSITE_UNPREPARED")) {
      lines.push(`- \`${r.assetId}\` -- ${r.sourceUrl}`);
    }
    lines.push("");
  }
  lines.push("## All generative assets");
  lines.push("");
  lines.push("| assetId | status | research decision | source |");
  lines.push("|---|---|---|---|");
  for (const r of report.rows.filter((r) => !r.exempt)) {
    lines.push(`| \`${r.assetId}\` | ${r.referenceStatus} | ${r.researchDecision ?? ""} | ${r.sourceUrl ?? ""} |`);
  }
  return lines.join("\n") + "\n";
}

function isMainModule(): boolean {
  const entryPoint = process.argv[1];
  if (!entryPoint) return false;
  return fileURLToPath(import.meta.url) === entryPoint;
}

if (isMainModule()) {
  const report = buildGateReport();
  writeFileSync(resolve(OUT_DIR, "unit202-reference-readiness-final.json"), JSON.stringify(report, null, 2) + "\n", "utf8");
  writeFileSync(resolve(OUT_DIR, "unit202-reference-readiness-final.md"), buildGateMarkdown(report), "utf8");
  console.log(`GENERATIVE ASSETS READY: ${report.generativeAssetsReady} / ${report.generativeAssetsTotal}`);
  console.log(`MISSING REFERENCES: ${report.missingReferences}`);
  console.log(`UNRESOLVED PLACEHOLDERS: ${report.unresolvedPlaceholders}`);
  console.log(`UNPREPARED COMPOSITES: ${report.unpreparedComposites}`);
  console.log(`Gate: ${report.gatePasses ? "PASS" : "BLOCKED"}`);
}
