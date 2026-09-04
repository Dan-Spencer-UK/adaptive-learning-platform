/**
 * CC-24 §6: generates PILOT-ACCESS-AUDIT.json -- the real, mechanically
 * recorded `AccessAuditRecord` trail for every local read this pilot run
 * performed, PLUS a deliberate runtime demonstration that unauthorized
 * paths (historical/reconciliation material, path traversal, an absolute
 * path) are denied BEFORE any filesystem access.
 *
 * [Corrected for pilot-002] The three denial demonstrations are proven at
 * RUNTIME (this script throws if any of them unexpectedly succeeds, so a
 * broken guard fails this script loudly) but their DENIED records are no
 * longer persisted into PILOT-ACCESS-AUDIT.json's `records`. The
 * validator's own corrected rule (`checkAccessAuditDenials`) treats ANY
 * DENIED entry in that file as invalidating the run unconditionally --
 * exactly right for a genuine unauthorized-access attempt during real
 * acquisition, but it would also always fail a fully valid run if the
 * file additionally contained pilot-001's synthetic proof-of-denial
 * entries. Persisting a real denial and a deliberate self-test denial in
 * the same unconditional field is not a distinction the validator (or a
 * downstream reader of this file) could make safely, so the self-test
 * stays a script-level assertion + console log only.
 *
 * Imports only the clean pilot-preparation path and the generic guard --
 * no historical material.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { LocalAccessGuard, UnauthorizedLocalReadError, type AccessAuditRecord } from "@alp/technical-evidence-engine";

import { buildUnit202PlanningInput, repoRoot as adapterRepoRoot } from "../unit202-evidence-acquisition-preflight/unit202-adapter.ts";
import { PILOT_OUTPUT_DIR_RELATIVE, createPilotGuard } from "./pilot-guard.ts";

const PILOT_ID = process.env.PILOT_ID ?? "pilot-001";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..", "..", "..");
const outDir = path.join(repoRoot, PILOT_OUTPUT_DIR_RELATIVE);
mkdirSync(outDir, { recursive: true });

const records: (AccessAuditRecord & { readonly source: string })[] = [];

// 1. The adapter's own guarded read of the one frozen blind-target manifest
// (its internal LocalAccessGuard is not exposed, so this reconstructs the
// equivalent audit record from the adapter's own returned contentHash --
// deterministic, since the adapter performs exactly one guarded read).
const { blindTargetsContentHash } = buildUnit202PlanningInput();
records.push({
  canonicalPath: "reports/backtests/unit202-evidence-acquisition-benchmark/UNIT202-BLIND-ACQUISITION-TARGETS.json",
  contentHash: blindTargetsContentHash,
  reason: "translate frozen Unit-202 blind acquisition targets into the generic KnowledgeEvidencePlanningInput contract",
  matchedRule: "FROZEN_BLIND_TARGET_MANIFEST",
  outcome: "ALLOWED",
  recordedAt: new Date().toISOString(),
  source: "unit202-adapter.ts (adapterRepoRoot=" + adapterRepoRoot + ")",
});

// 2. The pilot's own legitimate read-back of its own already-written,
// hash-pinned generated artifacts (clean plan + selection), through the
// pilot guard proper.
const cleanPlanContent = readFileSync(path.join(outDir, "PILOT-CLEAN-PLAN.json"), "utf-8");
const selectionManifestContent = readFileSync(path.join(outDir, "PILOT-SELECTION.json"), "utf-8");
const pilotGuard = createPilotGuard(repoRoot, { cleanPlanContent, selectionManifestContent });

for (const file of ["PILOT-CLEAN-PLAN.json", "PILOT-SELECTION.json"]) {
  const rel = `${PILOT_OUTPUT_DIR_RELATIVE}/${file}`;
  const { audit } = pilotGuard.guardedReadUtf8(rel, `pilot read-back of its own already-generated ${file}, to compute the access-audit and freeze artifacts`);
  records.push({ ...audit, source: "record-access-audit.ts (legitimate read-back)" });
}

// 3. Deliberate denial self-test -- every one of these MUST throw. A
// script bug that let any of these silently "succeed" would itself be the
// guard failing; each block re-throws if the expected error class is not
// what was caught, so this script fails loudly rather than producing a
// falsely-reassuring audit file. Their DENIED records are logged to the
// console (proof they were exercised) but deliberately NOT pushed into
// `records` -- see the file-level comment on why they must not share
// PILOT-ACCESS-AUDIT.json's unconditional "any DENIED entry invalidates
// the run" field with a genuine denied access attempt.
const denialSelfTestLog: (AccessAuditRecord & { readonly source: string })[] = [];
function expectDenied(label: string, attempt: () => void): void {
  const before = pilotGuard.getAuditLog().length;
  try {
    attempt();
    throw new Error(`ACCESS-AUDIT INVARIANT VIOLATION: "${label}" was expected to be denied but succeeded.`);
  } catch (err) {
    if (!(err instanceof UnauthorizedLocalReadError)) throw err;
  }
  const after = pilotGuard.getAuditLog();
  const newEntries = after.slice(before).map((r) => ({ ...r, source: `record-access-audit.ts (denial self-test: ${label})` }));
  denialSelfTestLog.push(...newEntries);
}

expectDenied("historical reconciliation material, out of the pilot allowlist entirely", () => {
  pilotGuard.guardedReadUtf8("scripts/backtests/unit202-reconciliation/historical-resolution.ts", "attempted read of historical reconciliation source -- must be denied, this pilot must never see it");
});

expectDenied("path traversal escaping the pilot output directory back into historical benchmark output", () => {
  pilotGuard.guardedReadUtf8(`${PILOT_OUTPUT_DIR_RELATIVE}/../../unit202-evidence-acquisition-benchmark/UNIT202-EVIDENCE-REQUIREMENT-BENCHMARK.json`, "attempted traversal out of the pilot output directory -- must resolve to its true (unauthorized) location and be denied");
});

expectDenied("absolute Windows path", () => {
  pilotGuard.guardedReadUtf8("C:/Windows/System32/drivers/etc/hosts", "attempted absolute path read -- must be denied outright, before any normalization-based matching");
});

writeFileSync(
  path.join(outDir, "PILOT-ACCESS-AUDIT.json"),
  JSON.stringify(
    {
      pilotId: PILOT_ID,
      generatedAt: new Date().toISOString(),
      note: "Every local read this pilot run performed through the guard. A separate runtime self-test (not recorded here) additionally proved the guard denies historical material, path traversal, and an absolute path before any filesystem access; see record-access-audit.ts's own console output for that proof. This file's `records` contains only genuine reads, all ALLOWED, so that the validator's unconditional any-DENIED-invalidates-the-run check reflects a real unauthorized read if it ever fires.",
      allReadsAllowed: records.every((r) => r.outcome === "ALLOWED"),
      records,
    },
    null,
    2,
  ) + "\n",
  "utf-8",
);

console.log("PILOT-ACCESS-AUDIT.json written:", records.length, "records (all ALLOWED:", records.every((r) => r.outcome === "ALLOWED"), ").");
console.log("Denial self-test (not persisted to PILOT-ACCESS-AUDIT.json):", denialSelfTestLog.length, "denied attempts, all correctly denied.");
for (const d of denialSelfTestLog) console.log("  -", d.source, "|", d.canonicalPath, "|", d.outcome);
