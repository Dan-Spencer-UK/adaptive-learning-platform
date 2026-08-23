/**
 * CC-11.7 §22 / CC-11.7A §25: generates the machine-readable Unit 202
 * comprehensive visual-coverage matrix. Every REQUIRED/USEFUL/
 * BLOCKED_REFERENCE/DEFERRED_SCOPE row is derived directly from the live
 * catalogue (never hand-typed, so it can never silently drift from the
 * real data). CC-11.7A materialised all 10 CC-11.7 USEFUL findings into
 * the live catalogue (audit.ts's EXPECTED_USEFUL_FINDING_ASSET_IDS), so
 * `USEFUL_UNCATALOGUED_ROWS` below is now empty -- kept as an explicit,
 * empty, documented list (not deleted) so a future genuinely-uncataloguable
 * finding has an obvious place to go, per task brief §25's "this should be
 * exceptional" framing. The `NOT_NEEDED_ROWS` (lesson-level, no visual
 * component at all) are unaffected by CC-11.7A and remain sourced from
 * reports/instructional-visuals/unit202-comprehensive-visual-audit.md.
 *
 * Usage: node tools/visual-production-studio/generate-matrix.ts
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { allAssets, familyForAsset, visualNeedClassificationFor, type VisualAsset } from "./catalogue.ts";
import { REPO_ROOT } from "./paths.ts";

const MATRIX_PATH = join(REPO_ROOT, "reports", "instructional-visuals", "unit202-visual-coverage-matrix.json");

interface MatrixRow {
  kind: "CATALOGUED_ASSET" | "USEFUL_UNCATALOGUED" | "NOT_NEEDED";
  loOrLesson?: string;
  assetId?: string;
  familyId?: string;
  familyDisplayName?: string;
  displayName: string;
  needClassification: string;
  productionClass?: string;
  referenceReadiness?: string;
  canonicalStates?: Array<{ stateId: string; pedagogicalState: string; existingCanonicalVariantId?: string }>;
  existing66Mapped: boolean;
  gapStatus: string;
  notes?: string;
}

function catalogueRow(asset: VisualAsset): MatrixRow {
  const family = familyForAsset(asset.assetId);
  const existing66Mapped = asset.canonicalStates.some((s) => Boolean(s.existingCanonicalVariantId));
  return {
    kind: "CATALOGUED_ASSET",
    loOrLesson: asset.loOrLesson,
    assetId: asset.assetId,
    familyId: family?.familyId,
    familyDisplayName: family?.displayName,
    displayName: asset.displayName,
    needClassification: visualNeedClassificationFor(asset),
    productionClass: asset.productionClass,
    referenceReadiness: asset.referenceReadiness,
    canonicalStates: asset.canonicalStates.map((s) => ({ stateId: s.stateId, pedagogicalState: s.pedagogicalState, existingCanonicalVariantId: s.existingCanonicalVariantId })),
    existing66Mapped,
    gapStatus: visualNeedClassificationFor(asset) === "REQUIRED" ? "SATISFIED" : visualNeedClassificationFor(asset),
  };
}

/**
 * CC-11.7A §25: empty by design -- all 10 CC-11.7 USEFUL findings this
 * list previously held are now materialised as live `CATALOGUED_ASSET`
 * rows (see `catalogueRow`/`allAssets()` below), each carrying
 * `needClassification: "USEFUL"`. Reserved for a future genuinely
 * non-materialisable finding, which task brief §25 frames as exceptional.
 */
const USEFUL_UNCATALOGUED_ROWS: MatrixRow[] = [];

/** §4 of the audit report -- confirmed NOT_NEEDED at lesson granularity. */
const NOT_NEEDED_ROWS: MatrixRow[] = [
  "lesson.electrical.ohms-law",
  "lesson.foundation.maths.formula-rearrangement",
  "lesson.electrical.core-quantities",
  "lesson.electrical.si-units",
  "lesson.electrical.charge-and-current",
  "lesson.electrical.power",
  "lesson.electrical.energy-and-efficiency",
  "lesson.foundation.physics.mass-and-weight",
  "lesson.foundation.physics.mechanics-force-work-energy-power",
].map((loOrLesson) => ({
  kind: "NOT_NEEDED" as const,
  loOrLesson,
  displayName: loOrLesson,
  needClassification: "NOT_NEEDED",
  existing66Mapped: false,
  gapStatus: "NOT_NEEDED",
  notes: "See reports/instructional-visuals/unit202-comprehensive-visual-audit.md §4 for the confirmed reasoning.",
}));

export function buildMatrix(): { generatedAt: string; rows: MatrixRow[] } {
  const rows: MatrixRow[] = [...allAssets().map(catalogueRow), ...USEFUL_UNCATALOGUED_ROWS, ...NOT_NEEDED_ROWS];
  return { generatedAt: new Date().toISOString(), rows };
}

function isMainModule(): boolean {
  const entryPoint = process.argv[1];
  if (!entryPoint) return false;
  return fileURLToPath(import.meta.url) === entryPoint;
}

if (isMainModule()) {
  const matrix = buildMatrix();
  mkdirSync(dirname(MATRIX_PATH), { recursive: true });
  writeFileSync(MATRIX_PATH, JSON.stringify(matrix, null, 2) + "\n", "utf8");
  console.log(`Wrote ${matrix.rows.length} rows to ${MATRIX_PATH}`);
}
