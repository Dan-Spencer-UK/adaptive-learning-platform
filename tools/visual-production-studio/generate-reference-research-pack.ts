/**
 * Ad hoc export task: "EXPORT THE COMPLETE UNIT 202 VISUAL REFERENCE
 * RESEARCH PACK". Read-only against the live catalogue -- does not
 * change catalogue.ts, does not touch the Studio, does not generate
 * artwork, does not call Gemini, does not perform a broad re-audit.
 *
 * ROW GRANULARITY: one row per `VisualAsset` (assetId). This is
 * deliberate, not a shortcut -- CC-11.7B's own SharedBaseAudit already
 * determined, per family, which learner-visible states are genuinely
 * separate deliverables (split into their own assetId, e.g.
 * unit202.levers.class-1/.class-2/.class-3) versus which are the SAME
 * base image served through a deterministic label/arrow overlay
 * (SAFE_SHARED_BASE / SHARED_BASE_WITH_CONDITIONS, kept as one asset
 * with multiple `canonicalStates`). An assetId is therefore already
 * "one distinct required final image" in this catalogue's own governed
 * model; exploding further to one row per canonicalState would invent
 * a different, uncommissioned splitting scheme and misrepresent
 * overlay variants as needing their own separate reference. Every
 * canonicalState is still listed per row (never hidden).
 *
 * REFERENCE-STATUS CLASSIFICATION: computed mechanically from data
 * already in the catalogue (referenceReadiness, empty sourceUrl,
 * qualityGrade, and identical sourceUrl reused across sibling assets)
 * plus two directly-evidenced findings from the CC-11.8 Gemini proof
 * session (unit202.pulleys.fixed confirmed REFERENCE_UNSUITABLE;
 * unit202.levers.class-1 confirmed to share a 3-diagram composite
 * reference file with .class-2/.class-3). Nothing else is asserted as
 * suspect/composite without that kind of direct evidence -- shared-URL
 * siblings beyond those two evidenced families are flagged as a lower-
 * confidence research note instead, never a false-certain verdict.
 */

import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { allAssets, FAMILIES, visualNeedClassificationFor, type VisualAsset, type VisualFamily } from "./catalogue.ts";
import { loadState } from "./state-store.ts";
import { REPO_ROOT } from "./paths.ts";

const OUT_DIR = resolve(REPO_ROOT, "reports", "instructional-visuals");

type ReferenceStatus = "APPROVED_EXISTING" | "MISSING" | "COMPOSITE_NEEDS_CROP" | "SUSPECT_UNSUITABLE" | "BLOCKED";
type ReferenceConfidence = "HIGH" | "MEDIUM" | "LOW" | "NONE";

// Directly evidenced this session (CC-11.8 two-asset Gemini proof) -- not a
// new audit, just recording what was already found while running it.
const EVIDENCED_UNSUITABLE = new Set(["unit202.pulleys.fixed"]);
const EVIDENCED_UNSUITABLE_SHARED_FILE_UNVERIFIED = new Set(["unit202.pulleys.movable"]);
const EVIDENCED_COMPOSITE: Record<string, string> = {
  "unit202.levers.class-1": "Confirmed composite (CC-11.8 proof): Lever_(PSF).svg contains 3 stacked lever-class diagrams. This asset is the TOP diagram.",
  "unit202.levers.class-2": "Shares the identical Lever_(PSF).svg file with unit202.levers.class-1 (confirmed composite, CC-11.8 proof). This asset is the MIDDLE diagram.",
  "unit202.levers.class-3": "Shares the identical Lever_(PSF).svg file with unit202.levers.class-1 (confirmed composite, CC-11.8 proof). This asset is the BOTTOM diagram.",
};

export interface ReferenceResearchRow {
  unit: string;
  assetId: string;
  familyId: string;
  familyTitle: string;
  finalImageTitle: string;
  roleInFamily: string;
  pedagogicalStatesPresent: string[];
  needClassification: string;
  needOverride: string | null;
  productionClass: string;
  productionClassLabel: string;
  priority: string;
  priorityLabel: string;
  curriculumContext: string | null;
  instructionalPurpose: string;
  learnerVisiblePurpose: string;
  immutableFacts: string[];
  prohibitedChanges: string[];
  requiredLabelsPresent: boolean;
  requiredLabelsList: string[];
  labelsPedagogicallyRequired: boolean;
  annotationPolicy: string;
  artExpectation: string;
  currentReferenceTitle: string | null;
  currentReferenceUrl: string | null;
  currentReferenceLicence: string | null;
  currentReferenceQualityGrade: string | null;
  secondaryReferenceTitle: string | null;
  secondaryReferenceUrl: string | null;
  secondaryReferenceLicence: string | null;
  referenceMissing: boolean;
  referenceComposite: boolean;
  referenceSuspectUnsuitable: boolean;
  blockedNotes: string | null;
  canonicalStates: { stateId: string; displayName: string; pedagogicalState: string }[];
  canonicalStateCount: number;
  outputSubfolder: string;
  filenameBase: string;
  expectedOutputPathStem: string;
  governedDiagramBlueprintId: string | null;
  currentWorkflowStatus: string;
  hiddenFromStudio: boolean;
  requiresReferenceResearch: boolean;
  referenceStatus: ReferenceStatus;
  currentReferenceConfidence: ReferenceConfidence;
  notesForReferenceResearch: string;
  sharedReferenceSiblings: string[];
}

function confidenceFromGrade(grade: string): ReferenceConfidence {
  const g = grade.trim().toUpperCase();
  if (g.startsWith("A")) return "HIGH";
  if (g.startsWith("B")) return "MEDIUM";
  return "LOW";
}

function artExpectationFor(asset: VisualAsset): string {
  if (asset.productionClass === "DETERMINISTIC_TECHNICAL") return "DETERMINISTIC_VECTOR_NOT_ART_GENERATED";
  const hasOverlay = asset.deterministicOverlayResponsibilities.length > 0;
  const hasBakedLabels = asset.requiredLabels.length > 0;
  if (hasBakedLabels) return "LABELLED_ARTWORK";
  if (hasOverlay) return "CLEAN_BASE_ART_WITH_DETERMINISTIC_OVERLAY";
  return "CLEAN_BASE_ART";
}

function buildSharedUrlIndex(assets: VisualAsset[]): Map<string, string[]> {
  const byUrl = new Map<string, string[]>();
  for (const asset of assets) {
    const url = asset.primaryReference.sourceUrl;
    if (!url) continue;
    if (!byUrl.has(url)) byUrl.set(url, []);
    byUrl.get(url)!.push(asset.assetId);
  }
  return byUrl;
}

function buildRow(asset: VisualAsset, family: VisualFamily, sharedUrlIndex: Map<string, string[]>, workflowStatus: string): ReferenceResearchRow {
  const url = asset.primaryReference.sourceUrl;
  const hasUrl = url.length > 0;
  const isDeterministic = asset.productionClass === "DETERMINISTIC_TECHNICAL";
  const siblings = (hasUrl ? sharedUrlIndex.get(url) ?? [] : []).filter((id) => id !== asset.assetId);

  const evidencedUnsuitable = EVIDENCED_UNSUITABLE.has(asset.assetId);
  const evidencedUnsuitableUnverified = EVIDENCED_UNSUITABLE_SHARED_FILE_UNVERIFIED.has(asset.assetId);
  const evidencedComposite = asset.assetId in EVIDENCED_COMPOSITE;

  let referenceStatus: ReferenceStatus;
  let confidence: ReferenceConfidence;
  let notes: string;
  let requiresResearch: boolean;
  let missing: boolean;
  const composite = evidencedComposite;
  const suspect = evidencedUnsuitable;

  if (isDeterministic && !hasUrl) {
    referenceStatus = "APPROVED_EXISTING";
    confidence = "NONE";
    missing = false;
    requiresResearch = false;
    notes = "Deterministic vector asset -- no external pictorial reference required; authoritative geometry is governed by ALP's own deterministic renderer, not redrawn from an external image. No reference research action needed.";
  } else if (!hasUrl) {
    referenceStatus = "MISSING";
    confidence = "NONE";
    missing = true;
    requiresResearch = true;
    notes = asset.scopeConfirmationNote ?? "No reference has been sourced/approved yet. Needs ChatGPT reference research: a real image whose geometry/topology matches this asset's immutableFacts and does not conflict with its prohibitedChanges.";
  } else if (evidencedUnsuitable) {
    referenceStatus = "SUSPECT_UNSUITABLE";
    confidence = "NONE";
    missing = false;
    requiresResearch = true;
    notes = "CONFIRMED unsuitable in the CC-11.8 Gemini proof session: the cited reference depicts a compound fixed+movable block-and-tackle pulley system, directly contradicting this asset's own prohibitedChanges (\"do NOT introduce block-and-tackle complexity\"). Needs a genuinely isolated fixed-pulley-only reference.";
  } else if (evidencedComposite) {
    referenceStatus = "COMPOSITE_NEEDS_CROP";
    confidence = "MEDIUM";
    missing = false;
    requiresResearch = true;
    notes = EVIDENCED_COMPOSITE[asset.assetId]!;
  } else if (evidencedUnsuitableUnverified) {
    referenceStatus = "APPROVED_EXISTING";
    confidence = "LOW";
    missing = false;
    requiresResearch = true;
    notes =
      "Shares the identical Pulley1a.svg reference file with unit202.pulleys.fixed, which was directly inspected in the CC-11.8 proof and found to depict a compound block-and-tackle system contradicting its own prohibitedChanges. This asset's own suitability against its own prohibitedChanges has NOT been independently re-verified -- treat with the same scrutiny before use.";
  } else {
    referenceStatus = "APPROVED_EXISTING";
    confidence = confidenceFromGrade(asset.primaryReference.qualityGrade);
    missing = false;
    requiresResearch = false;
    notes = "No confirmed problem on record. ";
    if (siblings.length > 0) {
      confidence = confidence === "HIGH" ? "MEDIUM" : confidence;
      requiresResearch = true;
      notes += `Shares the identical reference URL with ${siblings.length} sibling asset(s) (${siblings.join(", ")}) -- verify this file is not an unlabelled composite requiring per-asset isolation (cf. unit202.levers.class-1, confirmed composite in the CC-11.8 proof) before treating it as fully approved for this specific asset.`;
    } else {
      notes += "Standard appraisal welcome (geometry/topology match, licence, provenance) as part of this pack's general research pass.";
    }
  }

  return {
    unit: "Unit 202",
    assetId: asset.assetId,
    familyId: asset.familyId,
    familyTitle: family.displayName,
    finalImageTitle: asset.displayName,
    roleInFamily: asset.role,
    pedagogicalStatesPresent: [...new Set(asset.canonicalStates.map((s) => s.pedagogicalState))],
    needClassification: visualNeedClassificationFor(asset),
    needOverride: asset.needOverride ?? null,
    productionClass: asset.productionClass,
    productionClassLabel: asset.productionClassLabel,
    priority: asset.priority,
    priorityLabel: asset.priorityLabel,
    curriculumContext: asset.loOrLesson ?? null,
    instructionalPurpose: asset.instructionalPurpose,
    learnerVisiblePurpose: asset.exactDeliverable,
    immutableFacts: asset.immutableFacts,
    prohibitedChanges: asset.prohibitedChanges,
    requiredLabelsPresent: asset.requiredLabels.length > 0,
    requiredLabelsList: asset.requiredLabels,
    labelsPedagogicallyRequired: asset.annotationPolicy === "TEACHING_EXPLANATORY" || asset.annotationPolicy === "FEEDBACK_EXPLANATORY",
    annotationPolicy: asset.annotationPolicy,
    artExpectation: artExpectationFor(asset),
    currentReferenceTitle: asset.primaryReference.sourceName || null,
    currentReferenceUrl: hasUrl ? url : null,
    currentReferenceLicence: asset.primaryReference.licence || null,
    currentReferenceQualityGrade: asset.primaryReference.qualityGrade || null,
    secondaryReferenceTitle: asset.secondaryReference?.sourceName ?? null,
    secondaryReferenceUrl: asset.secondaryReference?.sourceUrl ?? null,
    secondaryReferenceLicence: asset.secondaryReference?.licence ?? null,
    referenceMissing: missing,
    referenceComposite: composite,
    referenceSuspectUnsuitable: suspect,
    blockedNotes: asset.scopeConfirmationNote ?? (missing ? "No reference sourced yet." : null),
    canonicalStates: asset.canonicalStates.map((s) => ({ stateId: s.stateId, displayName: s.displayName, pedagogicalState: s.pedagogicalState })),
    canonicalStateCount: asset.canonicalStates.length,
    outputSubfolder: asset.outputSubfolder,
    filenameBase: asset.filenameBase,
    expectedOutputPathStem: `apps/mobile/src/assets/instructional/unit202/${asset.outputSubfolder}/${asset.filenameBase}`,
    governedDiagramBlueprintId: asset.governedDiagramBlueprintId ?? null,
    currentWorkflowStatus: workflowStatus,
    hiddenFromStudio: isDeterministic || visualNeedClassificationFor(asset) === "DEFERRED_SCOPE",
    requiresReferenceResearch: requiresResearch,
    referenceStatus,
    currentReferenceConfidence: confidence,
    notesForReferenceResearch: notes,
    sharedReferenceSiblings: siblings,
  };
}

export function buildReferenceResearchPack(): ReferenceResearchRow[] {
  const state = loadState();
  const sharedUrlIndex = buildSharedUrlIndex(allAssets());
  const rows: ReferenceResearchRow[] = [];
  for (const family of FAMILIES) {
    for (const asset of family.assets) {
      rows.push(buildRow(asset, family, sharedUrlIndex, state[asset.assetId]?.status ?? "UNKNOWN"));
    }
  }
  return rows;
}

function csvEscape(value: string): string {
  if (/[",\n]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}

function toCsvValue(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (Array.isArray(value)) {
    if (value.length === 0) return "";
    if (typeof value[0] === "object") return csvEscape(value.map((v) => JSON.stringify(v)).join(" | "));
    return csvEscape(value.join("; "));
  }
  if (typeof value === "boolean") return value ? "TRUE" : "FALSE";
  return csvEscape(String(value));
}

export function buildCsv(rows: ReferenceResearchRow[]): string {
  const columns = Object.keys(rows[0] ?? {}) as (keyof ReferenceResearchRow)[];
  const header = columns.join(",");
  const lines = rows.map((row) => columns.map((col) => toCsvValue(row[col])).join(","));
  return [header, ...lines].join("\n") + "\n";
}

function fmtList(items: string[], empty = "(none recorded)"): string {
  return items.length > 0 ? items.map((i) => `  - ${i}`).join("\n") : `  - ${empty}`;
}

export function buildMarkdown(rows: ReferenceResearchRow[]): string {
  const byFamily = new Map<string, ReferenceResearchRow[]>();
  for (const row of rows) {
    if (!byFamily.has(row.familyId)) byFamily.set(row.familyId, []);
    byFamily.get(row.familyId)!.push(row);
  }

  const lines: string[] = [];
  lines.push("# Unit 202 -- Complete Visual Reference Research Pack");
  lines.push("");
  lines.push(`Generated: ${new Date().toISOString()}`);
  lines.push("");
  lines.push(`One entry per distinct required final image (${rows.length} total). Source: \`tools/visual-production-studio/catalogue.ts\` (live, unmodified). See \`unit202-reference-research-summary.md\` for totals and traceability.`);
  lines.push("");

  for (const family of FAMILIES) {
    const familyRows = byFamily.get(family.familyId);
    if (!familyRows || familyRows.length === 0) continue;
    lines.push(`## ${family.displayName}`);
    lines.push("");
    lines.push(`*Family:* \`${family.familyId}\` -- ${familyRows.length} distinct final image(s). ${family.instructionalPurpose}`);
    if (family.familyNotes) lines.push(`\n*Family notes:* ${family.familyNotes}`);
    lines.push("");

    for (const row of familyRows) {
      lines.push(`### ${row.finalImageTitle}`);
      lines.push("");
      lines.push(`- **assetId:** \`${row.assetId}\``);
      lines.push(`- **Role / production class:** ${row.roleInFamily} / ${row.productionClassLabel}`);
      lines.push(`- **Need classification:** ${row.needClassification}${row.needOverride ? ` (${row.needOverride})` : ""}${row.hiddenFromStudio ? " -- HIDDEN FROM CURRENT STUDIO QUEUE" : ""}`);
      lines.push(`- **Priority:** ${row.priorityLabel}`);
      lines.push(`- **Curriculum context:** ${row.curriculumContext ?? "(none recorded)"}`);
      lines.push(`- **Instructional purpose:** ${row.instructionalPurpose}`);
      lines.push(`- **Learner-visible deliverable:** ${row.learnerVisiblePurpose}`);
      lines.push(`- **Immutable technical facts:**`);
      lines.push(fmtList(row.immutableFacts));
      lines.push(`- **Prohibited changes:**`);
      lines.push(fmtList(row.prohibitedChanges));
      lines.push(`- **Labels:** required=${row.requiredLabelsPresent} pedagogicallyRequired=${row.labelsPedagogicallyRequired} annotationPolicy=${row.annotationPolicy} artExpectation=${row.artExpectation}`);
      lines.push(`- **Canonical learner-visible states (${row.canonicalStateCount}):**`);
      lines.push(fmtList(row.canonicalStates.map((s) => `${s.displayName} [${s.pedagogicalState}]`)));
      lines.push("");
      lines.push(`**Current reference**`);
      lines.push(`- Title: ${row.currentReferenceTitle ?? "(none)"}`);
      lines.push(`- URL: ${row.currentReferenceUrl ?? "(none)"}`);
      lines.push(`- Licence: ${row.currentReferenceLicence ?? "(none)"}`);
      lines.push(`- Quality grade: ${row.currentReferenceQualityGrade ?? "(none)"}`);
      if (row.secondaryReferenceUrl) lines.push(`- Secondary reference: ${row.secondaryReferenceTitle} -- ${row.secondaryReferenceUrl} (${row.secondaryReferenceLicence})`);
      lines.push("");
      lines.push(`**Reference-research flags**`);
      lines.push(`- requiresReferenceResearch: **${row.requiresReferenceResearch}**`);
      lines.push(`- referenceStatus: **${row.referenceStatus}**`);
      lines.push(`- currentReferenceConfidence: **${row.currentReferenceConfidence}**`);
      lines.push(`- notesForReferenceResearch: ${row.notesForReferenceResearch}`);
      if (row.sharedReferenceSiblings.length > 0) lines.push(`- Shares its reference URL with: ${row.sharedReferenceSiblings.join(", ")}`);
      lines.push("");
      lines.push(`**Production/output**`);
      lines.push(`- Expected output path stem: \`${row.expectedOutputPathStem}\` (+ \`-vN.{png|webp|jpg}\` on approval)`);
      lines.push(`- Current workflow status: ${row.currentWorkflowStatus}`);
      lines.push(`- Governed diagram blueprint: ${row.governedDiagramBlueprintId ?? "(none)"}`);
      lines.push("");
      lines.push("---");
      lines.push("");
    }
  }

  return lines.join("\n");
}

export function buildSummaryMarkdown(rows: ReferenceResearchRow[]): string {
  const count = (pred: (r: ReferenceResearchRow) => boolean) => rows.filter(pred).length;
  const groupCounts = (keyFn: (r: ReferenceResearchRow) => string): Record<string, number> => {
    const out: Record<string, number> = {};
    for (const row of rows) {
      const key = keyFn(row);
      out[key] = (out[key] ?? 0) + 1;
    }
    return out;
  };

  const byProdClass = groupCounts((r) => r.productionClass);
  const byNeed = groupCounts((r) => r.needClassification);
  const byPedState = groupCounts((r) => (r.pedagogicalStatesPresent.length > 0 ? r.pedagogicalStatesPresent.join("+") : "(none)"));

  const approved = count((r) => r.referenceStatus === "APPROVED_EXISTING");
  const missing = count((r) => r.referenceStatus === "MISSING");
  const composite = count((r) => r.referenceStatus === "COMPOSITE_NEEDS_CROP");
  const suspect = count((r) => r.referenceStatus === "SUSPECT_UNSUITABLE");
  const blocked = count((r) => r.referenceStatus === "BLOCKED");
  const hidden = rows.filter((r) => r.hiddenFromStudio);
  const totalCanonicalStates = rows.reduce((n, r) => n + r.canonicalStateCount, 0);

  const lines: string[] = [];
  lines.push("# Unit 202 -- Visual Reference Research Pack: Summary");
  lines.push("");
  lines.push(`Generated: ${new Date().toISOString()}`);
  lines.push("");
  lines.push("## Totals");
  lines.push("");
  lines.push(`- **Total distinct required final images exported:** ${rows.length}`);
  lines.push(`  (each row = one \`VisualAsset\`/assetId in \`tools/visual-production-studio/catalogue.ts\` -- CC-11.7B's own governed shared-base-vs-split decision already determines what counts as one distinct final image; this export does not invent a different splitting scheme. Total underlying learner-visible canonical states across all rows: ${totalCanonicalStates}.)`);
  lines.push(`- **By production class:** ${Object.entries(byProdClass).map(([k, v]) => `${k}=${v}`).join(", ")}`);
  lines.push(`- **By need classification:** ${Object.entries(byNeed).map(([k, v]) => `${k}=${v}`).join(", ")}`);
  lines.push(`- **By pedagogical state(s) present:** ${Object.entries(byPedState).map(([k, v]) => `${k}=${v}`).join(", ")}`);
  lines.push("");
  lines.push("## Reference status");
  lines.push("");
  lines.push(`- APPROVED_EXISTING: ${approved}`);
  lines.push(`- MISSING: ${missing}`);
  lines.push(`- COMPOSITE_NEEDS_CROP: ${composite}`);
  lines.push(`- SUSPECT_UNSUITABLE: ${suspect}`);
  lines.push(`- BLOCKED: ${blocked}`);
  lines.push(`- Total requiring reference-research action (requiresReferenceResearch=true): ${count((r) => r.requiresReferenceResearch)}`);
  lines.push("");
  lines.push("## Hidden from the current Studio queue");
  lines.push("");
  lines.push(
    `${hidden.length} item(s) are not surfaced as an actionable art-generation prompt in the current Visual Production Studio, but ARE included in full in this export. "Hidden" here means: DETERMINISTIC_TECHNICAL assets (CC-11.7C removed these from the Studio's promptable/art-job flow entirely -- their authoritative output is vector geometry, not a Gemini/ChatGPT art job) plus the one DEFERRED_SCOPE asset (excluded from REQUIRED/USEFUL completion accounting pending a scope decision). This is not a claim that they are missing or wrong -- only that a reviewer using the Studio's own UI would not see them in its active queue.`,
  );
  lines.push("");
  for (const row of hidden) lines.push(`- \`${row.assetId}\` -- ${row.finalImageTitle} (${row.productionClass}${row.needClassification === "DEFERRED_SCOPE" ? ", DEFERRED_SCOPE" : ""})`);
  lines.push("");
  lines.push("## Source traceability");
  lines.push("");
  lines.push("This export was built entirely from the live, unmodified production catalogue -- no catalogue logic was changed, no new audit was performed, no web research was done:");
  lines.push("");
  lines.push("- `tools/visual-production-studio/catalogue.ts` -- the 53-asset / 21-family governed Unit 202 visual catalogue (`FAMILIES`, `allAssets()`), including `VisualAsset.primaryReference`/`referenceReadiness`/`immutableFacts`/`prohibitedChanges`/`canonicalStates`/`sharedBaseAudit` etc.");
  lines.push("- `tools/visual-production-studio/catalogue.ts`'s `visualNeedClassificationFor()` -- REQUIRED/USEFUL/DEFERRED_SCOPE classification, used unmodified.");
  lines.push("- `tools/visual-production-studio/state-store.ts`'s `loadState()` -- current per-asset Studio workflow status.");
  lines.push("- `tools/visual-production-studio/visual-proof/proof-config.ts` and the CC-11.8 proof session's own recorded findings -- the source of the two directly-evidenced SUSPECT_UNSUITABLE/COMPOSITE_NEEDS_CROP verdicts (unit202.pulleys.fixed, unit202.levers.class-1/.class-2/.class-3); every other reference-status verdict in this pack is a mechanical read of catalogue data (empty sourceUrl, quality grade, duplicate reference URLs across siblings), never a fresh visual re-audit.");
  lines.push("");
  lines.push("**Does the Studio under-represent the true required catalogue?** Yes, by design, for one dimension only: the Studio's default art-generation queue does not surface `DETERMINISTIC_TECHNICAL` assets (11 of them) or the 1 `DEFERRED_SCOPE` asset as actionable prompt items, because they are not art-generation jobs / not yet in scope. This export includes all of them. On every other dimension (REQUIRED vs USEFUL, READY vs NOT_READY/blocked), the Studio and this export read the same live catalogue and agree exactly.");
  lines.push("");
  lines.push(`**True total distinct final images currently required by the governed catalogue: ${rows.length}** (${byNeed.REQUIRED ?? 0} REQUIRED + ${byNeed.USEFUL ?? 0} USEFUL + ${byNeed.DEFERRED_SCOPE ?? 0} DEFERRED_SCOPE).`);
  lines.push("");
  lines.push("## Production-direction note (recorded only -- not acted on in this task)");
  lines.push("");
  lines.push(
    "The Product Owner has indicated the preferred instructional-visual background direction has changed: **drop the dark/slate background default and move to a white / very light background default.** This is recorded here as a direction note only -- no prompt, style guide, or catalogue field has been changed as part of this export task (out of scope: \"Do NOT redesign prompts in this task\"). The existing style guide (`docs/design/ALP-INSTRUCTIONAL-VISUAL-STYLE-GUIDE.md`) and prompt builders (`tools/visual-production-studio/prompt-builder.ts`, `tools/visual-production-studio/visual-proof/prompt-builder-gemini.ts`) still specify the dark slate/blue-grey background (`#151821` -> `#262B38`) and have NOT yet been updated to reflect this new direction -- a future package's job.",
  );
  lines.push("");

  return lines.join("\n");
}

function isMainModule(): boolean {
  const entryPoint = process.argv[1];
  if (!entryPoint) return false;
  return fileURLToPath(import.meta.url) === entryPoint;
}

if (isMainModule()) {
  const rows = buildReferenceResearchPack();
  const jsonPath = resolve(OUT_DIR, "unit202-reference-research-pack.json");
  const csvPath = resolve(OUT_DIR, "unit202-reference-research-pack.csv");
  const mdPath = resolve(OUT_DIR, "unit202-reference-research-pack.md");
  const summaryPath = resolve(OUT_DIR, "unit202-reference-research-summary.md");

  writeFileSync(jsonPath, JSON.stringify(rows, null, 2) + "\n", "utf8");
  writeFileSync(csvPath, buildCsv(rows), "utf8");
  writeFileSync(mdPath, buildMarkdown(rows), "utf8");
  writeFileSync(summaryPath, buildSummaryMarkdown(rows), "utf8");

  console.log(`Wrote ${rows.length} rows to:`);
  console.log(`  ${jsonPath}`);
  console.log(`  ${csvPath}`);
  console.log(`  ${mdPath}`);
  console.log(`  ${summaryPath}`);
}
