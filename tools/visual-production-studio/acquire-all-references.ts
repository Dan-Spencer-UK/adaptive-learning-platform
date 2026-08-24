/**
 * CC-11.9: bulk-acquires the real reference file for every generative
 * (non-DETERMINISTIC_TECHNICAL) asset via the corrected reference overlay
 * (reference-corrections.ts). Idempotent -- already-cached files are
 * reused, not re-downloaded (see reference-acquisition.ts). Continues
 * past an individual failure (e.g. a transient rate limit) rather than
 * aborting the whole batch, and reports exactly which assets are still
 * unresolved at the end -- never silently claims success.
 *
 * Usage: node tools/visual-production-studio/acquire-all-references.ts [delayMs]
 */

import { allAssets } from "./catalogue.ts";
import { effectivePrimaryReference } from "./reference-corrections.ts";
import { acquireReference } from "./reference-acquisition.ts";
import { fileURLToPath } from "node:url";

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export interface AcquireAllResult {
  assetId: string;
  ok: boolean;
  mimeType?: string;
  sha256?: string;
  error?: string;
}

export async function acquireAllReferences(delayMs = 2500): Promise<AcquireAllResult[]> {
  const assets = allAssets().filter((a) => a.productionClass !== "DETERMINISTIC_TECHNICAL");
  const results: AcquireAllResult[] = [];
  for (const asset of assets) {
    const ref = effectivePrimaryReference(asset);
    try {
      const acquired = await acquireReference(asset.assetId, ref.sourceUrl);
      results.push({ assetId: asset.assetId, ok: true, mimeType: acquired.mimeType, sha256: acquired.sha256 });
    } catch (err) {
      results.push({ assetId: asset.assetId, ok: false, error: String(err instanceof Error ? err.message : err) });
    }
    await sleep(delayMs);
  }
  return results;
}

function isMainModule(): boolean {
  const entryPoint = process.argv[1];
  if (!entryPoint) return false;
  return fileURLToPath(import.meta.url) === entryPoint;
}

if (isMainModule()) {
  const delayMs = process.argv[2] ? Number(process.argv[2]) : 2500;
  acquireAllReferences(delayMs).then((results) => {
    for (const r of results) console.log(r.ok ? "OK  " : "FAIL", r.assetId, r.ok ? r.mimeType : r.error);
    const ok = results.filter((r) => r.ok).length;
    console.log(`\nAcquired ${ok} / ${results.length}`);
    if (ok < results.length) process.exitCode = 1;
  });
}
