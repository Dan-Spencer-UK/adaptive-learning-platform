/**
 * CC-11.5/CC-11.6 §15/§18: EXPORT REVIEW CONTACT SHEET -- a simple local
 * HTML report of every currently-approved premium asset, grouped by
 * visual family and shown in family order, so visual consistency and
 * pedagogical progression across related images can be reviewed together
 * without opening every file individually. PDF generation is explicitly
 * optional per the task brief; HTML is sufficient.
 */

import { readFileSync } from "node:fs";
import { relative } from "node:path";

import { allAssets, FAMILIES, findAsset, visualNeedClassificationFor, type VisualFamily } from "./catalogue.ts";
import { loadManifest, type ManifestEntry } from "./state-store.ts";
import { MANIFEST_PATH, REPO_ROOT } from "./paths.ts";

function esc(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function currentVersionsByAsset(entries: ManifestEntry[]): Map<string, ManifestEntry> {
  const byAsset = new Map<string, ManifestEntry>();
  for (const entry of entries) {
    const existing = byAsset.get(entry.assetId);
    if (!existing || entry.artworkVersion > existing.artworkVersion || (entry.artworkVersion === existing.artworkVersion && entry.approvedAt > existing.approvedAt)) {
      byAsset.set(entry.assetId, entry);
    }
  }
  return byAsset;
}

function mimeToDataUri(path: string, mimeType: string): string | null {
  try {
    const bytes = readFileSync(path);
    return `data:${mimeType};base64,${bytes.toString("base64")}`;
  } catch {
    return null;
  }
}

/** CC-11.7A §24: REQUIRED and USEFUL approved artwork must remain distinguishable on the contact sheet, never hidden. */
function classificationBadgeHtml(entry: ManifestEntry): string {
  const asset = findAsset(entry.assetId);
  const classification = asset ? visualNeedClassificationFor(asset) : "REQUIRED";
  const cssClass = classification === "USEFUL" ? "badge-useful" : "badge-required";
  return `<span class="badge ${cssClass}">${esc(classification)}</span>`;
}

function assetCardHtml(entry: ManifestEntry): string {
  const thumb = mimeToDataUri(entry.outputPath, entry.mimeType);
  const relativePath = relative(REPO_ROOT, entry.outputPath).replace(/\\/g, "/");
  return `
<section class="card">
  <div class="thumb">${thumb ? `<img src="${thumb}" alt="${esc(entry.displayName)}" />` : `<div class="missing">file not found on disk: ${esc(relativePath)}</div>`}</div>
  <h3>${esc(entry.displayName)} ${classificationBadgeHtml(entry)}</h3>
  <dl>
    <dt>Asset ID</dt><dd><code>${esc(entry.assetId)}</code></dd>
    <dt>Reference</dt><dd>${esc(entry.referenceSource)}${entry.referenceUrl ? ` — <a href="${esc(entry.referenceUrl)}">${esc(entry.referenceUrl)}</a>` : ""}</dd>
    <dt>Status</dt><dd>${esc(entry.approvalStatus)}</dd>
    <dt>Version</dt><dd>v${entry.artworkVersion}</dd>
    <dt>Path</dt><dd><code>${esc(relativePath)}</code></dd>
    <dt>Approved</dt><dd>${esc(entry.approvedAt)}</dd>
  </dl>
</section>`;
}

function familySectionHtml(family: VisualFamily, approvedByAsset: Map<string, ManifestEntry>): string | null {
  const approvedInOrder = family.assets.map((asset) => approvedByAsset.get(asset.assetId)).filter((entry): entry is ManifestEntry => Boolean(entry));
  if (approvedInOrder.length === 0) return null;

  return `
<section class="family">
  <div class="family-header">
    <h2>${esc(family.displayName)}</h2>
    <span class="family-progress">[${approvedInOrder.length}/${family.assets.length} approved]</span>
  </div>
  <div class="grid">${approvedInOrder.map(assetCardHtml).join("\n")}</div>
</section>`;
}

export function buildContactSheetHtml(manifestPath: string = MANIFEST_PATH): string {
  const manifest = loadManifest(manifestPath);
  const approvedByAsset = currentVersionsByAsset(manifest.assets);
  const totalApproved = approvedByAsset.size;
  const totalCatalogued = allAssets().length;

  const familySections = FAMILIES.map((family) => familySectionHtml(family, approvedByAsset)).filter((html): html is string => html !== null);

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>Unit 202 Premium Artwork — Review Contact Sheet</title>
<style>
  * { box-sizing: border-box; }
  body { margin: 0; font-family: system-ui, -apple-system, "Segoe UI", sans-serif; background: #0B0D12; color: #F2F4F8; padding: 24px; }
  h1 { font-size: 22px; margin: 0; }
  .generated { color: #9AA3B2; font-size: 12px; margin: 6px 0 28px; }
  .family { margin-bottom: 28px; }
  .family-header { display: flex; align-items: baseline; gap: 10px; margin-bottom: 10px; border-bottom: 1px solid #262B38; padding-bottom: 6px; }
  .family-header h2 { font-size: 16px; margin: 0; }
  .family-progress { font-size: 11px; color: #4CD07A; font-weight: 700; }
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 18px; }
  .card { background: #151821; border: 1px solid #262B38; border-radius: 12px; padding: 14px; }
  .thumb { background: #05060a; border-radius: 8px; overflow: hidden; margin-bottom: 10px; min-height: 140px; display: flex; align-items: center; justify-content: center; }
  .thumb img { max-width: 100%; max-height: 320px; display: block; }
  .missing { color: #ff6b6b; font-size: 12px; padding: 12px; }
  h3 { font-size: 14px; margin: 0 0 8px; display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
  .badge { font-size: 9px; font-weight: 700; letter-spacing: 0.04em; padding: 2px 6px; border-radius: 4px; }
  .badge-required { background: #1d3a2a; color: #4CD07A; }
  .badge-useful { background: #2a2410; color: #E0B84C; }
  dl { display: grid; grid-template-columns: 90px 1fr; gap: 4px 8px; font-size: 12px; margin: 0; }
  dt { color: #9AA3B2; }
  dd { margin: 0; word-break: break-word; }
  a { color: #4C8DFF; }
  .empty { color: #9AA3B2; }
</style>
</head>
<body>
<h1>Unit 202 Premium Artwork — Review Contact Sheet</h1>
<p class="generated">Generated ${new Date().toISOString()} — ${totalApproved} approved asset${totalApproved === 1 ? "" : "s"} of ${totalCatalogued} catalogued, grouped by visual family in family order.</p>
${familySections.length ? familySections.join("\n") : '<p class="empty">No approved assets yet.</p>'}
</body>
</html>`;
}
