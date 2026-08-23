/**
 * CC-11.5 §18: EXPORT REVIEW CONTACT SHEET -- a simple local HTML report
 * of every currently-approved premium asset, so the whole family can be
 * reviewed without opening every file individually. PDF generation is
 * explicitly optional per the task brief; HTML is sufficient.
 */

import { readFileSync } from "node:fs";
import { relative } from "node:path";

import { CATALOGUE } from "./catalogue.ts";
import { loadManifest, type ManifestEntry } from "./state-store.ts";
import { MANIFEST_PATH, REPO_ROOT } from "./paths.ts";

function esc(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function currentVersionsByAsset(entries: ManifestEntry[]): ManifestEntry[] {
  const byAsset = new Map<string, ManifestEntry>();
  for (const entry of entries) {
    const existing = byAsset.get(entry.assetId);
    if (!existing || entry.artworkVersion > existing.artworkVersion || (entry.artworkVersion === existing.artworkVersion && entry.approvedAt > existing.approvedAt)) {
      byAsset.set(entry.assetId, entry);
    }
  }
  return [...byAsset.values()].sort((a, b) => a.assetId.localeCompare(b.assetId));
}

function mimeToDataUri(path: string, mimeType: string): string | null {
  try {
    const bytes = readFileSync(path);
    return `data:${mimeType};base64,${bytes.toString("base64")}`;
  } catch {
    return null;
  }
}

export function buildContactSheetHtml(manifestPath: string = MANIFEST_PATH): string {
  const manifest = loadManifest(manifestPath);
  const current = currentVersionsByAsset(manifest.assets);

  const cards = current
    .map((entry) => {
      const thumb = mimeToDataUri(entry.outputPath, entry.mimeType);
      const relativePath = relative(REPO_ROOT, entry.outputPath).replace(/\\/g, "/");
      return `
<section class="card">
  <div class="thumb">${thumb ? `<img src="${thumb}" alt="${esc(entry.displayName)}" />` : `<div class="missing">file not found on disk: ${esc(relativePath)}</div>`}</div>
  <h2>${esc(entry.displayName)}</h2>
  <dl>
    <dt>Asset ID</dt><dd><code>${esc(entry.assetId)}</code></dd>
    <dt>Reference</dt><dd>${esc(entry.referenceSource)}${entry.referenceUrl ? ` — <a href="${esc(entry.referenceUrl)}">${esc(entry.referenceUrl)}</a>` : ""}</dd>
    <dt>Status</dt><dd>${esc(entry.approvalStatus)}</dd>
    <dt>Version</dt><dd>v${entry.artworkVersion}</dd>
    <dt>Path</dt><dd><code>${esc(relativePath)}</code></dd>
    <dt>Approved</dt><dd>${esc(entry.approvedAt)}</dd>
  </dl>
</section>`;
    })
    .join("\n");

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>Unit 202 Premium Artwork — Review Contact Sheet</title>
<style>
  * { box-sizing: border-box; }
  body { margin: 0; font-family: system-ui, -apple-system, "Segoe UI", sans-serif; background: #0B0D12; color: #F2F4F8; padding: 24px; }
  h1 { font-size: 22px; }
  .generated { color: #9AA3B2; font-size: 12px; margin-bottom: 24px; }
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 18px; }
  .card { background: #151821; border: 1px solid #262B38; border-radius: 12px; padding: 14px; }
  .thumb { background: #05060a; border-radius: 8px; overflow: hidden; margin-bottom: 10px; min-height: 140px; display: flex; align-items: center; justify-content: center; }
  .thumb img { max-width: 100%; max-height: 320px; display: block; }
  .missing { color: #ff6b6b; font-size: 12px; padding: 12px; }
  h2 { font-size: 15px; margin: 0 0 8px; }
  dl { display: grid; grid-template-columns: 90px 1fr; gap: 4px 8px; font-size: 12px; margin: 0; }
  dt { color: #9AA3B2; }
  dd { margin: 0; word-break: break-word; }
  a { color: #4C8DFF; }
  .empty { color: #9AA3B2; }
</style>
</head>
<body>
<h1>Unit 202 Premium Artwork — Review Contact Sheet</h1>
<p class="generated">Generated ${new Date().toISOString()} — ${current.length} approved asset${current.length === 1 ? "" : "s"} of ${CATALOGUE.length} catalogued.</p>
${current.length ? `<div class="grid">${cards}</div>` : '<p class="empty">No approved assets yet.</p>'}
</body>
</html>`;
}
