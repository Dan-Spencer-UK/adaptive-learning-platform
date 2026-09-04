/**
 * CC-24 §4: generates the clean plan and freezes the fixed 15-requirement
 * pilot sample BEFORE any web acquisition begins. Writes
 * PILOT-CLEAN-PLAN.json and PILOT-SELECTION.json into the pilot output
 * directory, and prints their hashes so the pilot guard can be
 * reconstructed with those exact files hash-pinned.
 *
 * Imports only the clean pilot-preparation path -- no historical material.
 */
import { createHash } from "node:crypto";
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { buildCleanPlan } from "./clean-plan.ts";
import { PILOT_OUTPUT_DIR_RELATIVE } from "./pilot-guard.ts";
import { selectPilotSample } from "./pilot-selection.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..", "..", "..");
const outDir = path.join(repoRoot, PILOT_OUTPUT_DIR_RELATIVE);
mkdirSync(outDir, { recursive: true });

function canonicalJson(value: unknown): string {
  return JSON.stringify(value, null, 2) + "\n";
}
function sha256(text: string): string {
  return createHash("sha256").update(text).digest("hex");
}

const plan = buildCleanPlan();
const planJson = canonicalJson({ requirementCount: plan.requirements.length, requirements: plan.requirements, structuralSatisfactions: plan.structuralSatisfactions });
const planHash = sha256(planJson);
writeFileSync(path.join(outDir, "PILOT-CLEAN-PLAN.json"), planJson, "utf-8");

const outcome = selectPilotSample(plan);
if (!outcome.ok) {
  console.error("PILOT SELECTION FAILED:");
  for (const f of outcome.failures) console.error(" -", f.reason);
  process.exit(1);
}

const selectionPayload = {
  pilotId: "pilot-001",
  qualificationContextId: "unit202",
  sourcePlanHash: planHash,
  selectedCount: outcome.requirements.length,
  requirements: outcome.requirements,
};
const selectionJson = canonicalJson(selectionPayload);
const selectionHash = sha256(selectionJson);
writeFileSync(path.join(outDir, "PILOT-SELECTION.json"), selectionJson, "utf-8");

console.log("CC-24 pilot selection frozen.");
console.log("  plan requirement count:", plan.requirements.length);
console.log("  sourcePlanHash:", planHash);
console.log("  selectionHash:", selectionHash);
console.log("  selected IDs:");
for (const r of outcome.requirements) console.log("   -", r.evidenceRequirementId, "|", r.requirementMode, "|", r.specificationMode);
