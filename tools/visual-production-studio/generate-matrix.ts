/**
 * CC-11.7 §22: generates the machine-readable Unit 202 comprehensive
 * visual-coverage matrix. Every REQUIRED/BLOCKED_REFERENCE/DEFERRED_SCOPE
 * row is derived directly from the live catalogue (never hand-typed, so
 * it can never silently drift from the real data); the USEFUL/NOT_NEEDED
 * rows record findings that were deliberately not materialised as
 * catalogue assets (task brief §5) and are sourced from
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

/** §4 of the audit report -- USEFUL findings deliberately not materialised as catalogue assets this pass. */
const USEFUL_UNCATALOGUED_ROWS: MatrixRow[] = [
  { kind: "USEFUL_UNCATALOGUED", loOrLesson: "LO2 — lesson.electrical.instrumentation", displayName: "Clamp meter recognition", needClassification: "USEFUL", existing66Mapped: false, gapStatus: "USEFUL", notes: "EL-INSTRUMENT-CLAMP-METER-001; distinctive ferrite-jaw physical form." },
  { kind: "USEFUL_UNCATALOGUED", loOrLesson: "LO2 — lesson.electrical.instrumentation", displayName: "Oscilloscope recognition", needClassification: "USEFUL", existing66Mapped: false, gapStatus: "USEFUL", notes: "EL-INSTRUMENT-OSCILLOSCOPE-001." },
  { kind: "USEFUL_UNCATALOGUED", loOrLesson: "LO4 — lesson.electrical.charge-and-current", displayName: "Electron flow vs conventional current direction", needClassification: "USEFUL", existing66Mapped: false, gapStatus: "USEFUL", notes: "Targets MIS-EL-ELECTRON-CURRENT-DIRECTION-CONFUSION-001; no dedicated QuestionBlueprint yet." },
  { kind: "USEFUL_UNCATALOGUED", loOrLesson: "LO5 — lesson.magnetism.fundamentals", displayName: "Permanent magnet vs electromagnet comparison", needClassification: "USEFUL", existing66Mapped: false, gapStatus: "USEFUL", notes: "cap.magnetism.compare_permanent_electromagnet; Level 2 depth keeps it below REQUIRED." },
  { kind: "USEFUL_UNCATALOGUED", loOrLesson: "LO3 — lesson.foundation.physics.simple-machines", displayName: "Gear rotation-direction reversal / idler gear", needClassification: "USEFUL", existing66Mapped: false, gapStatus: "USEFUL", notes: "FP-GEAR-DIRECTION-REVERSAL-001, FP-GEAR-IDLER-001; SUPPORTS-only, non-mandatory." },
  { kind: "USEFUL_UNCATALOGUED", loOrLesson: "LO6 — lesson.electrical.electronic-components-passive", displayName: "Physical recognition — zener diode", needClassification: "USEFUL", existing66Mapped: false, gapStatus: "USEFUL", notes: "Specialist component; deferred to secondary queue." },
  { kind: "USEFUL_UNCATALOGUED", loOrLesson: "LO6 — lesson.electrical.electronic-components-passive", displayName: "Physical recognition — photodiode", needClassification: "USEFUL", existing66Mapped: false, gapStatus: "USEFUL", notes: "Specialist component; deferred to secondary queue." },
  { kind: "USEFUL_UNCATALOGUED", loOrLesson: "LO6 — lesson.electrical.electronic-components-switching-control", displayName: "Physical recognition — DIAC", needClassification: "USEFUL", existing66Mapped: false, gapStatus: "USEFUL", notes: "Specialist component; deferred to secondary queue." },
  { kind: "USEFUL_UNCATALOGUED", loOrLesson: "LO6 — lesson.electrical.electronic-components-switching-control", displayName: "Physical recognition — TRIAC", needClassification: "USEFUL", existing66Mapped: false, gapStatus: "USEFUL", notes: "Specialist component; deferred to secondary queue." },
  { kind: "USEFUL_UNCATALOGUED", loOrLesson: "LO6 — lesson.electrical.electronic-components-switching-control", displayName: "Physical recognition — thyristor/SCR", needClassification: "USEFUL", existing66Mapped: false, gapStatus: "USEFUL", notes: "Specialist component; deferred to secondary queue." },
];

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
