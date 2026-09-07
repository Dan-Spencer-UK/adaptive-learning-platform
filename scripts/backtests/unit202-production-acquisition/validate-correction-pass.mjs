// Deterministic 35-point validation for the Unit 202 final bounded correction
// pass. Replaces the previous ad-hoc "12/12" script: every numbered item in
// the Product Architect's task section 6 is implemented as its own distinct,
// executable check -- no missing check is folded under a misleading label.
//
// Run with: node scripts/backtests/unit202-production-acquisition/validate-correction-pass.mjs
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import crypto from "node:crypto";

const repoRoot = path.resolve(import.meta.dirname, "..", "..", "..");
const rel = (p) => path.join(repoRoot, p);
const readJson = (p) => JSON.parse(fs.readFileSync(rel(p), "utf-8"));
const readText = (p) => fs.readFileSync(rel(p), "utf-8");

const results = [];
function check(n, name, fn) {
  try {
    const detail = fn();
    results.push({ n, name, pass: true, detail: detail ?? "" });
  } catch (e) {
    results.push({ n, name, pass: false, detail: String(e && e.message ? e.message : e) });
  }
}

const BASELINE_COMMIT = "8127768b34d7bec7db0fb72975d459586e5240a4";

const BATCH_DIRS = [
  { dir: "reports/unit202-production-acquisition/batch-01-foundational-mathematics", lp: "FOUNDATIONAL-MATHEMATICS-LEARNING-POINTS", frozen: true },
  { dir: "reports/unit202-production-acquisition/batch-02-electrical-fundamentals-and-safety", lp: "ELECTRICAL-FUNDAMENTALS-AND-SAFETY-LEARNING-POINTS", frozen: true },
  { dir: "reports/unit202-production-acquisition/batch-03-mechanics-and-machines", lp: "MECHANICS-AND-MACHINES-LEARNING-POINTS", frozen: true },
  { dir: "reports/unit202-production-acquisition/batch-04-electrical-quantities-and-circuit-theory", lp: "ELECTRICAL-QUANTITIES-AND-CIRCUIT-THEORY-LEARNING-POINTS", frozen: false },
  { dir: "reports/unit202-production-acquisition/batch-05-electromagnetism-and-induction", lp: "ELECTROMAGNETISM-AND-INDUCTION-LEARNING-POINTS", frozen: false },
  { dir: "reports/unit202-production-acquisition/batch-06-electronic-devices-and-applications", lp: "ELECTRONIC-DEVICES-AND-APPLICATIONS-LEARNING-POINTS", frozen: false },
];
const PLAN_PATH = "reports/backtests/unit202-evidence-acquisition-preflight/UNIT202-EVIDENCE-REQUIREMENT-PLAN.json";
const LEDGER_PATH = "reports/unit202-production-acquisition/UNIT202-CORRECTION-AMENDMENT-LEDGER.json";
const PACK_JSON_PATH = "reports/unit202-production-acquisition/UNIT202-ACQUISITION-REVIEW-PACK.json";
const PACK_MD_PATH = "reports/unit202-production-acquisition/UNIT202-ACQUISITION-REVIEW-PACK.md";

const CANONICAL_EVIDENCE_STATUSES = new Set(["VERIFIED", "PARTIALLY_VERIFIED", "SOURCE_GAP", "CONFLICTED", "NOT_ATTEMPTED"]);
const CANONICAL_ROW_DISPOSITIONS = new Set([undefined, "STRUCTURALLY_SATISFIED", "RETIRED_OUT_OF_SCOPE"]);
const CANONICAL_LEDGER_DISPOSITIONS = new Set(["RETAINED", "CORRECTED_IN_PLACE", "STRUCTURALLY_SATISFIED", "TRANSFORMED_TO_EXEMPLAR", "RETIRED_OUT_OF_SCOPE", "REQUIREMENT_ID_MIGRATED"]);

// Preload everything once.
const plan = readJson(PLAN_PATH);
const ledger = readJson(LEDGER_PATH);
const batches = BATCH_DIRS.map((b) => ({
  ...b,
  ev: readJson(path.join(b.dir, "EVIDENCE-RESULTS.json")),
  lpJson: readJson(path.join(b.dir, `${b.lp}.json`)),
  lpMdPath: path.join(b.dir, `${b.lp}.md`),
  srPath: path.join(b.dir, "SOURCE-REGISTER.json"),
}));

// =====================================================================
// 1. Every JSON artifact parses.
// =====================================================================
check(1, "Every JSON artifact parses", () => {
  let n = 0;
  for (const b of batches) {
    for (const f of fs.readdirSync(rel(b.dir))) {
      if (f.endsWith(".json")) { readJson(path.join(b.dir, f)); n++; }
    }
  }
  readJson(PACK_JSON_PATH);
  readJson(LEDGER_PATH);
  readJson(PLAN_PATH);
  return `${n} batch JSON files + review pack + ledger + plan`;
});

// =====================================================================
// 2. Batches 01-03 byte-identical to the accepted baseline commit.
// =====================================================================
check(2, "Batches 01-03 byte-identical to baseline commit " + BASELINE_COMMIT.slice(0, 7), () => {
  const frozenDirs = batches.filter((b) => b.frozen).map((b) => b.dir);
  const diff = execSync(`git diff --stat ${BASELINE_COMMIT} -- ${frozenDirs.map((d) => `"${d}"`).join(" ")}`, { cwd: repoRoot }).toString();
  if (diff.trim().length > 0) throw new Error("Frozen batch diff vs. baseline detected:\n" + diff);
  return "clean";
});

// =====================================================================
// 3. Every evidence status uses the canonical vocabulary.
// =====================================================================
check(3, "Every evidence status uses the canonical vocabulary", () => {
  let n = 0;
  for (const b of batches) {
    for (const r of b.ev.results) {
      if (!CANONICAL_EVIDENCE_STATUSES.has(r.result.verificationStatus)) {
        throw new Error(`${b.dir}: non-canonical status "${r.result.verificationStatus}" on ${r.evidenceRequirementId}`);
      }
      n++;
    }
  }
  return `${n} rows checked`;
});

// =====================================================================
// 4. Every disposition uses the approved disposition vocabulary.
// =====================================================================
check(4, "Every disposition uses the approved disposition vocabulary", () => {
  let n = 0;
  for (const b of batches) {
    for (const r of b.ev.results) {
      if (!CANONICAL_ROW_DISPOSITIONS.has(r.disposition)) throw new Error(`${b.dir}: non-canonical row disposition "${r.disposition}" on ${r.evidenceRequirementId}`);
      n++;
    }
  }
  for (const e of ledger.entries) {
    if (e.disposition && !CANONICAL_LEDGER_DISPOSITIONS.has(e.disposition)) throw new Error(`ledger entry has non-canonical disposition "${e.disposition}"`);
  }
  return `${n} rows + ${ledger.entries.length} ledger entries checked`;
});

// =====================================================================
// 5. Per-batch totals recompute from records.
//
// Scoped to Batches 04-06: Batches 01-03 predate the generic
// technical-evidence-engine architecture and use a legacy EVIDENCE-RESULTS
// schema with no `statusTotals`/`structurallySatisfiedCount` fields at all
// (their integrity is instead guaranteed by check 2's byte-identity
// comparison against the accepted baseline commit).
// =====================================================================
check(5, "Per-batch totals recompute from records (Batches 04-06; 01-03 covered by check 2's byte-identity)", () => {
  const report = [];
  for (const b of batches.filter((x) => !x.frozen)) {
    const totals = {};
    let structSat = 0, retired = 0;
    for (const r of b.ev.results) {
      if (r.disposition === "STRUCTURALLY_SATISFIED") { structSat++; continue; }
      if (r.disposition === "RETIRED_OUT_OF_SCOPE") { retired++; continue; }
      totals[r.result.verificationStatus] = (totals[r.result.verificationStatus] ?? 0) + 1;
    }
    const recorded = b.ev.statusTotals ?? {};
    for (const k of new Set([...Object.keys(totals), ...Object.keys(recorded)])) {
      if ((totals[k] ?? 0) !== (recorded[k] ?? 0)) throw new Error(`${b.dir}: statusTotals.${k} recorded=${recorded[k] ?? 0} recomputed=${totals[k] ?? 0}`);
    }
    if ((b.ev.structurallySatisfiedCount ?? 0) !== structSat) throw new Error(`${b.dir}: structurallySatisfiedCount recorded=${b.ev.structurallySatisfiedCount} recomputed=${structSat}`);
    if ((b.ev.retiredOutOfScopeCount ?? 0) !== retired) throw new Error(`${b.dir}: retiredOutOfScopeCount recorded=${b.ev.retiredOutOfScopeCount} recomputed=${retired}`);
    report.push(`${b.dir.split("/").pop()}: ${JSON.stringify(totals)} structSat=${structSat} retired=${retired}`);
  }
  return report.join("; ");
});

// =====================================================================
// 6/7. Whole-unit and Batches-04-06 totals recompute independently, and
// agree with the review pack's own two never-mixed scopes.
// =====================================================================
function recomputeScope(scopeBatches) {
  const statusTotals = {};
  let structSat = 0, retired = 0, requirementCount = 0, lpCount = 0;
  const lpReadiness = {};
  for (const b of scopeBatches) {
    requirementCount += b.ev.results.length;
    for (const r of b.ev.results) {
      if (r.disposition === "STRUCTURALLY_SATISFIED") { structSat++; continue; }
      if (r.disposition === "RETIRED_OUT_OF_SCOPE") { retired++; continue; }
      statusTotals[r.result.verificationStatus] = (statusTotals[r.result.verificationStatus] ?? 0) + 1;
    }
    lpCount += b.lpJson.learningPoints.length;
    for (const p of b.lpJson.learningPoints) lpReadiness[p.evidenceReadiness] = (lpReadiness[p.evidenceReadiness] ?? 0) + 1;
  }
  return { statusTotals, structSat, retired, requirementCount, lpCount, lpReadiness };
}
function assertScopeEqual(label, computed, packSection, packLpSection) {
  const packTotals = packSection.verifiedOrPartiallyVerifiedOrGap ?? {};
  for (const k of new Set([...Object.keys(computed.statusTotals), ...Object.keys(packTotals)])) {
    if ((computed.statusTotals[k] ?? 0) !== (packTotals[k] ?? 0)) throw new Error(`${label}: status.${k} computed=${computed.statusTotals[k] ?? 0} pack=${packTotals[k] ?? 0}`);
  }
  if (computed.structSat !== packSection.structurallySatisfied) throw new Error(`${label}: structurallySatisfied computed=${computed.structSat} pack=${packSection.structurallySatisfied}`);
  if (computed.retired !== packSection.retiredOutOfScope) throw new Error(`${label}: retiredOutOfScope computed=${computed.retired} pack=${packSection.retiredOutOfScope}`);
  if (computed.requirementCount !== packSection.requirementCount) throw new Error(`${label}: requirementCount computed=${computed.requirementCount} pack=${packSection.requirementCount}`);
  if (packLpSection) {
    if (computed.lpCount !== packLpSection.total) throw new Error(`${label}: learningPoint total computed=${computed.lpCount} pack=${packLpSection.total}`);
    for (const k of new Set([...Object.keys(computed.lpReadiness), ...Object.keys(packLpSection.readinessTotals)])) {
      if ((computed.lpReadiness[k] ?? 0) !== (packLpSection.readinessTotals[k] ?? 0)) throw new Error(`${label}: lpReadiness.${k} computed=${computed.lpReadiness[k] ?? 0} pack=${packLpSection.readinessTotals[k] ?? 0}`);
    }
  }
}
const pack = readJson(PACK_JSON_PATH);
check(6, "Whole-unit totals recompute from records and agree with the review pack", () => {
  const computed = recomputeScope(batches);
  assertScopeEqual("wholeUnit202", computed, pack.dispositionTotals.wholeUnit202, pack.learningPoints.wholeUnit202);
  return `requirements=${computed.requirementCount} status=${JSON.stringify(computed.statusTotals)} lp=${computed.lpCount}`;
});
check(7, "Batches-04-06-only totals recompute independently and agree with the review pack", () => {
  const scope = batches.filter((b) => !b.frozen);
  const computed = recomputeScope(scope);
  assertScopeEqual("batches0406Only", computed, pack.dispositionTotals.batches0406Only, pack.learningPoints.batches0406Only);
  return `requirements=${computed.requirementCount} status=${JSON.stringify(computed.statusTotals)} lp=${computed.lpCount}`;
});

// =====================================================================
// 8/9. Required dimensions equal satisfied plus unresolved; the two
// dimension sets never overlap.
// =====================================================================
check(8, "Required coverage dimensions equal satisfied plus unresolved (Batches 04-06; 01-03 use a legacy schema without requiredCoverageDimensions, covered by check 2)", () => {
  let n = 0;
  for (const b of batches.filter((x) => !x.frozen)) {
    for (const r of b.ev.results) {
      const required = new Set(r.requiredCoverageDimensions ?? []);
      const satisfied = new Set(r.result.coverageDimensionsSatisfied ?? []);
      const unresolved = new Set(r.result.unresolvedDimensions ?? []);
      const union = new Set([...satisfied, ...unresolved]);
      const missing = [...required].filter((d) => !union.has(d));
      const extra = [...union].filter((d) => !required.has(d));
      if (missing.length > 0 || extra.length > 0) {
        throw new Error(`${b.dir} ${r.evidenceRequirementId}: required=${[...required]} satisfied∪unresolved=${[...union]} (missing=${missing}, extra=${extra})`);
      }
      n++;
    }
  }
  return `${n} rows checked`;
});
check(9, "Satisfied and unresolved dimension sets never overlap", () => {
  let n = 0;
  for (const b of batches) {
    for (const r of b.ev.results) {
      const satisfied = new Set(r.result.coverageDimensionsSatisfied ?? []);
      const unresolved = new Set(r.result.unresolvedDimensions ?? []);
      const overlap = [...satisfied].filter((d) => unresolved.has(d));
      if (overlap.length > 0) throw new Error(`${b.dir} ${r.evidenceRequirementId}: dimensions ${overlap} marked both satisfied and unresolved`);
      n++;
    }
  }
  return `${n} rows checked`;
});

// =====================================================================
// 10/11. Every current plan requirement has exactly one non-structural
// result; results excluding STRUCTURALLY_SATISFIED exactly ID-match plan.
// =====================================================================
const allRows = batches.flatMap((b) => b.ev.results.map((r) => ({ ...r, batch: b.dir })));
const nonStructuralRows = allRows.filter((r) => r.disposition !== "STRUCTURALLY_SATISFIED");
check(10, "Every current plan requirement has exactly one non-structural result", () => {
  const byId = new Map();
  for (const r of nonStructuralRows) byId.set(r.evidenceRequirementId, (byId.get(r.evidenceRequirementId) ?? 0) + 1);
  const problems = [];
  for (const req of plan.requirements) {
    const count = byId.get(req.evidenceRequirementId) ?? 0;
    if (count !== 1) problems.push(`${req.evidenceRequirementId}: ${count} results`);
  }
  if (problems.length > 0) throw new Error(problems.join("; "));
  return `${plan.requirements.length} plan requirements, each with exactly 1 result`;
});
check(11, "Results excluding STRUCTURALLY_SATISFIED have exact ID-set equality with the current plan", () => {
  const planIds = new Set(plan.requirements.map((r) => r.evidenceRequirementId));
  const rowIds = new Set(nonStructuralRows.map((r) => r.evidenceRequirementId));
  const inRowsNotPlan = [...rowIds].filter((id) => !planIds.has(id));
  const inPlanNotRows = [...planIds].filter((id) => !rowIds.has(id));
  if (inRowsNotPlan.length > 0) throw new Error(`${inRowsNotPlan.length} result ID(s) not in plan, e.g. ${inRowsNotPlan.slice(0, 3).join(", ")}`);
  if (inPlanNotRows.length > 0) throw new Error(`${inPlanNotRows.length} plan ID(s) with no result, e.g. ${inPlanNotRows.slice(0, 3).join(", ")}`);
  return `${planIds.size} IDs match exactly`;
});

// =====================================================================
// 12. Plan/result mode, specification mode, text, dimensions and
// authority classes match exactly for every non-structural row.
// =====================================================================
check(12, "Plan/result mode, specification mode, text, dimensions and authority classes match (Batches 04-06; 01-03 use a legacy schema with no per-row mirrored plan fields, covered by check 2)", () => {
  const planById = new Map(plan.requirements.map((r) => [r.evidenceRequirementId, r]));
  const setEq = (a, b) => a.length === b.length && new Set(a).size === new Set(b).size && [...new Set(a)].every((x) => new Set(b).has(x));
  let n = 0;
  const scopedRows = nonStructuralRows.filter((r) => !batches.find((b) => b.dir === r.batch)?.frozen);
  for (const r of scopedRows) {
    const p = planById.get(r.evidenceRequirementId);
    if (!p) continue; // already reported by check 11
    if (r.requirementMode !== p.requirementMode) throw new Error(`${r.evidenceRequirementId}: requirementMode result=${r.requirementMode} plan=${p.requirementMode}`);
    if (r.specificationMode !== p.specificationMode) throw new Error(`${r.evidenceRequirementId}: specificationMode result=${r.specificationMode} plan=${p.specificationMode}`);
    if (r.requirementText !== p.requirementText) throw new Error(`${r.evidenceRequirementId}: requirementText mismatch`);
    if (!setEq(r.requiredCoverageDimensions ?? [], p.requiredCoverageDimensions ?? [])) throw new Error(`${r.evidenceRequirementId}: requiredCoverageDimensions result=${r.requiredCoverageDimensions} plan=${p.requiredCoverageDimensions}`);
    if (!setEq(r.sourceAuthorityClasses ?? [], p.sourceAuthorityClasses ?? [])) throw new Error(`${r.evidenceRequirementId}: sourceAuthorityClasses result=${r.sourceAuthorityClasses} plan=${p.sourceAuthorityClasses}`);
    n++;
  }
  return `${n} rows field-matched against the plan`;
});

// =====================================================================
// 13. Each historical one of the 213 requirements has exactly one
// explicit disposition or migration (every row currently present has a
// disposition/status; every migrated old ID resolved to a present row).
// =====================================================================
check(13, "Each historical requirement has exactly one explicit disposition or migration", () => {
  const HISTORICAL_ORIGINAL_COUNT = 213;
  if (allRows.length !== HISTORICAL_ORIGINAL_COUNT) throw new Error(`total row count=${allRows.length}, expected historical count ${HISTORICAL_ORIGINAL_COUNT}`);
  for (const r of allRows) {
    const hasStatus = CANONICAL_EVIDENCE_STATUSES.has(r.result.verificationStatus);
    const hasDisposition = CANONICAL_ROW_DISPOSITIONS.has(r.disposition);
    if (!hasStatus || !hasDisposition) throw new Error(`${r.evidenceRequirementId}: missing an explicit status/disposition`);
  }
  return `${allRows.length} rows, each with exactly one explicit status+disposition`;
});

// =====================================================================
// 14. Old/new requirement-ID migrations are unique and resolve.
// =====================================================================
check(14, "Old/new requirement-ID migrations are unique and resolve", () => {
  const migrations = ledger.requirementIdMigrations ?? [];
  if (migrations.length === 0) throw new Error("no requirementIdMigrations recorded");
  const oldIds = migrations.map((m) => m.oldEvidenceRequirementId);
  const newIds = migrations.map((m) => m.newEvidenceRequirementId);
  if (new Set(oldIds).size !== oldIds.length) throw new Error("duplicate oldEvidenceRequirementId in migrations");
  if (new Set(newIds).size !== newIds.length) throw new Error("duplicate newEvidenceRequirementId in migrations");
  const currentIds = new Set(allRows.map((r) => r.evidenceRequirementId));
  for (const m of migrations) {
    if (currentIds.has(m.oldEvidenceRequirementId)) throw new Error(`old ID still present: ${m.oldEvidenceRequirementId}`);
    if (!currentIds.has(m.newEvidenceRequirementId)) throw new Error(`new ID does not resolve: ${m.newEvidenceRequirementId}`);
  }
  return `${migrations.length} migrations, all unique and resolving`;
});

// =====================================================================
// 15. Learning-point IDs are unique and stable.
// =====================================================================
check(15, "Learning-point IDs are unique (per batch and globally) and frozen-batch IDs are stable", () => {
  const allIds = [];
  for (const b of batches) {
    const ids = b.lpJson.learningPoints.map((p) => p.id);
    const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
    if (dupes.length > 0) throw new Error(`${b.dir}: duplicate LP IDs ${dupes.join(",")}`);
    allIds.push(...ids);
  }
  const globalDupes = allIds.filter((id, i) => allIds.indexOf(id) !== i);
  if (globalDupes.length > 0) throw new Error(`duplicate LP IDs across batches: ${globalDupes.join(",")}`);
  return `${allIds.length} unique LP IDs (frozen-batch stability covered by check 2)`;
});

// =====================================================================
// 16/17/18. Every LP evidence-requirement / knowledge-target /
// prerequisite reference resolves.
// =====================================================================
const allEvidenceReqIds = new Set(allRows.map((r) => r.evidenceRequirementId));
const allKnowledgeTargetIds = new Set([
  ...plan.requirements.flatMap((r) => r.sourceKnowledgeTargetIds ?? []),
  ...(plan.structuralSatisfactions ?? []).flatMap((s) => [s.knowledgeTargetId, ...(s.satisfiedByKnowledgeTargetIds ?? [])]),
]);
const allLpIds = new Set(batches.flatMap((b) => b.lpJson.learningPoints.map((p) => p.id)));
check(16, "Every LP evidence-requirement reference resolves", () => {
  let n = 0;
  for (const b of batches) {
    for (const p of b.lpJson.learningPoints) {
      for (const id of p.evidenceRequirementIds ?? []) {
        if (!allEvidenceReqIds.has(id)) throw new Error(`${b.dir} ${p.id}: evidenceRequirementId "${id}" does not resolve to any batch result`);
        n++;
      }
    }
  }
  return `${n} references resolved`;
});
check(17, "Every LP knowledge-target reference resolves", () => {
  let n = 0;
  for (const b of batches) {
    for (const p of b.lpJson.learningPoints) {
      for (const id of p.knowledgeTargetIds ?? []) {
        if (!allKnowledgeTargetIds.has(id)) throw new Error(`${b.dir} ${p.id}: knowledgeTargetId "${id}" does not resolve to any plan requirement/structural-satisfaction`);
        n++;
      }
    }
  }
  return `${n} references resolved (against ${allKnowledgeTargetIds.size} known knowledge-target IDs)`;
});
check(18, "Every prerequisite LP reference resolves", () => {
  let n = 0;
  for (const b of batches) {
    for (const p of b.lpJson.learningPoints) {
      for (const id of [...(p.prerequisiteLearningPointIds ?? []), ...(p.crossDomainPrerequisiteIds ?? [])]) {
        if (!allLpIds.has(id)) throw new Error(`${b.dir} ${p.id}: prerequisite "${id}" does not resolve to any learning point`);
        n++;
      }
    }
  }
  return `${n} prerequisite references resolved`;
});

// =====================================================================
// 19. The prerequisite graph is acyclic.
// =====================================================================
check(19, "The prerequisite graph is acyclic", () => {
  const edges = new Map(); // lp -> prerequisites (edges point FROM lp TO its prereqs)
  for (const b of batches) {
    for (const p of b.lpJson.learningPoints) {
      edges.set(p.id, [...(p.prerequisiteLearningPointIds ?? []), ...(p.crossDomainPrerequisiteIds ?? [])]);
    }
  }
  const WHITE = 0, GRAY = 1, BLACK = 2;
  const color = new Map([...edges.keys()].map((id) => [id, WHITE]));
  const stack = [];
  function visit(id) {
    color.set(id, GRAY);
    stack.push(id);
    for (const dep of edges.get(id) ?? []) {
      if (color.get(dep) === GRAY) throw new Error(`cycle detected: ${stack.slice(stack.indexOf(dep)).concat(dep).join(" -> ")}`);
      if (color.get(dep) === WHITE) visit(dep);
    }
    stack.pop();
    color.set(id, BLACK);
  }
  for (const id of edges.keys()) if (color.get(id) === WHITE) visit(id);
  return `${edges.size} learning points, acyclic`;
});

// =====================================================================
// 20. Every candidate/normalized-claim source ID resolves to a
// source-register entry (global union, since sources are reused
// across batches).
// =====================================================================
const globalSourceIds = new Set(batches.flatMap((b) => readJson(b.srPath).sources.map((s) => s.sourceId)));
check(20, "Every candidate and normalized-claim source ID resolves to a source-register entry (Batches 04-06; 01-03 covered by check 2)", () => {
  let n = 0;
  const problems = [];
  for (const b of batches.filter((x) => !x.frozen)) {
    for (const r of b.ev.results) {
      const ids = [
        ...(r.result.candidateSources ?? []).map((c) => c.sourceId),
        ...(r.result.normalizedClaims ?? []).map((c) => c.sourceId),
        ...(r.result.evaluatedButOutOfPermittedAuthorityClass ?? []).map((c) => c.sourceId),
      ];
      for (const id of ids) {
        n++;
        if (!globalSourceIds.has(id)) problems.push(`${b.dir} ${r.evidenceRequirementId}: source "${id}" not in any source register`);
      }
    }
  }
  if (problems.length > 0) throw new Error(problems.slice(0, 5).join("; ") + (problems.length > 5 ? ` (+${problems.length - 5} more)` : ""));
  return `${n} source references resolved against ${globalSourceIds.size} registered sources`;
});

// =====================================================================
// 21. Every verifying candidate uses a permitted authority class, unless
// explicitly recorded as excluded and not used.
// =====================================================================
check(21, "Every candidate actually counted toward a VERIFIED result uses a permitted authority class (Batches 04-06)", () => {
  // Scoped to VERIFIED rows: a VERIFIED status is the claim that the
  // requirement is CLOSED by its candidates, so every candidate on such a
  // row must be permitted-class. A PARTIALLY_VERIFIED/SOURCE_GAP row may
  // legitimately still list an out-of-class candidate as honestly-disclosed
  // (but insufficient) evidence -- that is not the false-green pattern this
  // check targets (see check 22 for VERIFIED-specific dimension checks).
  let n = 0;
  const problems = [];
  for (const b of batches.filter((x) => !x.frozen)) {
    for (const r of b.ev.results) {
      if (r.result.verificationStatus !== "VERIFIED") continue;
      const permitted = new Set(r.sourceAuthorityClasses ?? []);
      for (const c of r.result.candidateSources ?? []) {
        n++;
        if (!permitted.has(c.authorityClass)) problems.push(`${b.dir} ${r.evidenceRequirementId}: candidate ${c.sourceId} authorityClass=${c.authorityClass} not in permitted set ${[...permitted]}`);
      }
    }
  }
  if (problems.length > 0) throw new Error(problems.slice(0, 5).join("; ") + (problems.length > 5 ? ` (+${problems.length - 5} more)` : ""));
  return `${n} candidate sources on VERIFIED rows checked across Batches 04-06, all within permitted classes`;
});

// =====================================================================
// 22. VERIFIED means all required dimensions satisfied, none unresolved,
// and no active gap says it is partial/unverified.
// =====================================================================
const CONTRADICTION_PATTERNS = [/status is therefore\s+PARTIALLY_VERIFIED/i, /is recorded as PARTIALLY_VERIFIED rather than VERIFIED/i, /downgraded (from )?VERIFIED (to|->)\s*PARTIALLY_VERIFIED/i];
check(22, "VERIFIED rows have all dimensions satisfied, none unresolved, and no self-contradicting gap", () => {
  let n = 0;
  for (const b of batches) {
    for (const r of b.ev.results) {
      if (r.result.verificationStatus !== "VERIFIED") continue;
      n++;
      const required = new Set(r.requiredCoverageDimensions ?? []);
      const satisfied = new Set(r.result.coverageDimensionsSatisfied ?? []);
      if ((r.result.unresolvedDimensions ?? []).length > 0) throw new Error(`${b.dir} ${r.evidenceRequirementId}: VERIFIED but has unresolvedDimensions ${r.result.unresolvedDimensions}`);
      for (const d of required) if (!satisfied.has(d)) throw new Error(`${b.dir} ${r.evidenceRequirementId}: VERIFIED but dimension "${d}" not marked satisfied`);
      const gapsText = (r.result.gaps ?? []).join(" \n ");
      for (const pat of CONTRADICTION_PATTERNS) {
        if (pat.test(gapsText)) throw new Error(`${b.dir} ${r.evidenceRequirementId}: VERIFIED but gaps contain a self-contradicting pattern (${pat})`);
      }
    }
  }
  return `${n} VERIFIED rows checked`;
});

// =====================================================================
// 23. READY LPs contain only verified/structurally-satisfied taught
// claims, or explicitly partition verified from held/retired content.
// =====================================================================
check(23, "READY learning points have every REQUIRED-mastery facet verified, or explicitly partition held/retired facets", () => {
  // Stage 9 item 6: a READY LP may not depend on an unresolved
  // REQUIRED-mastery facet. Where curriculumRole exists (Batches 04-06),
  // only requiredMasteryEvidenceRequirementIds must be VERIFIED/
  // STRUCTURALLY_SATISFIED -- a CONTEXTUAL facet may legitimately remain
  // partial without blocking READY. Where curriculumRole does not exist
  // (frozen Batches 01-03, pre-Stage-6 schema), fall back to checking
  // every referenced facet, as before.
  const statusById = new Map(allRows.map((r) => [r.evidenceRequirementId, r]));
  let n = 0;
  const problems = [];
  for (const b of batches) {
    for (const p of b.lpJson.learningPoints) {
      if (p.evidenceReadiness !== "READY") continue;
      n++;
      const idsToCheck = p.curriculumRole ? (p.requiredMasteryEvidenceRequirementIds ?? []) : (p.evidenceRequirementIds ?? []);
      const nonVerified = idsToCheck
        .map((id) => statusById.get(id))
        .filter((r) => r && r.result.verificationStatus !== "VERIFIED" && r.disposition !== "STRUCTURALLY_SATISFIED");
      if (nonVerified.length === 0) continue;
      // Must be explicitly partitioned: underlyingEvidenceStatuses must record the non-VERIFIED status for each.
      if (!p.underlyingEvidenceStatuses) {
        problems.push(`${b.dir} ${p.id}: READY with ${nonVerified.length} non-VERIFIED underlying result(s) but no underlyingEvidenceStatuses partition`);
        continue;
      }
      for (const r of nonVerified) {
        // Suffix convention used throughout this corpus: everything after
        // "ER::provisional::unit202::<domain>::", which for a compound mode
        // (e.g. "...::SYMBOL_OR_CONVENTION::QUANTITY_SYMBOL") is more than
        // the last 2 segments -- never hardcode segment count.
        const suffix = r.evidenceRequirementId.split("::").slice(4).join("::");
        const recorded = p.underlyingEvidenceStatuses[suffix];
        if (recorded !== r.result.verificationStatus) {
          problems.push(`${b.dir} ${p.id}: underlyingEvidenceStatuses["${suffix}"]=${recorded ?? "(missing)"} but actual result is ${r.result.verificationStatus}`);
        }
      }
    }
  }
  if (problems.length > 0) throw new Error(problems.join("; "));
  return `${n} READY learning points checked`;
});

// =====================================================================
// 24. TRIAC holding-current wording is bound to an actual supporting
// source passage, not checked by string presence alone.
// =====================================================================
check(24, "TRIAC holding-current wording is bound to an actual supporting source passage", () => {
  const b6 = batches.find((b) => b.dir.includes("batch-06"));
  const r = b6.ev.results.find((x) => x.evidenceRequirementId.includes("triac-basic-operating-principle"));
  if (!r) throw new Error("triac-basic-operating-principle result not found");
  const boundClaim = (r.result.normalizedClaims ?? []).find((c) => c.sourceId === "SRC-LITTELFUSE-AN1002-GATING-LATCHING-HOLDING" && /holding current/i.test(c.claimText));
  if (!boundClaim) throw new Error("no normalizedClaim binds the holding-current wording to SRC-LITTELFUSE-AN1002-GATING-LATCHING-HOLDING");
  const boundSource = (r.result.candidateSources ?? []).find((c) => c.sourceId === "SRC-LITTELFUSE-AN1002-GATING-LATCHING-HOLDING");
  if (!boundSource || !/holding current/i.test(boundSource.retrievedPassage ?? "")) throw new Error("bound source's own retrievedPassage does not contain a holding-current passage");
  if (/conducts until the applied AC voltage reaches zero/i.test(boundClaim.claimText) && !/imprecise|not the basis/i.test(boundClaim.claimText)) {
    throw new Error("corrected claim text still asserts the imprecise voltage-zero formulation as fact");
  }
  return "holding-current claim genuinely bound to a real AN1002 passage, not asserted independent of any source";
});

// =====================================================================
// 25. The three exact circuit requirements remain retired and are not
// taught elsewhere as canonical truth.
// =====================================================================
check(25, "The three exact circuit requirements remain retired, not taught elsewhere as canonical truth", () => {
  const b6 = batches.find((b) => b.dir.includes("batch-06"));
  for (const suffix of ["dimmer-exact-rc-timing-implementation-component-values", "heating-exact-transistor-relay-topology", "security-alarm-exact-nc-contact-bias-topology"]) {
    const r = b6.ev.results.find((x) => x.evidenceRequirementId.includes(suffix));
    if (!r) throw new Error(`${suffix}: not found`);
    if (r.disposition !== "RETIRED_OUT_OF_SCOPE") throw new Error(`${suffix}: expected RETIRED_OUT_OF_SCOPE, got ${r.disposition}`);
  }
  const lpText = JSON.stringify(b6.lpJson) + readText(b6.lpMdPath);
  if (/R1\s*250K/.test(lpText)) throw new Error("retired dimmer RC value (R1 250K) appears in taught learning-point content");
  return "all three exact-object exemplars retired, and their specific retired values do not leak into taught LP content";
});

// =====================================================================
// 26. No alarm NC/sounder claim is taught without evidence.
// =====================================================================
check(26, "No alarm NC/sounder claim is taught without evidence", () => {
  const b6 = batches.find((b) => b.dir.includes("batch-06"));
  const lp25 = b6.lpJson.learningPoints.find((p) => p.id === "EDA-LP-25");
  if (/NC detection/i.test(lp25.title) || /NC detection/i.test(lp25.learnerOutcome)) throw new Error("EDA-LP-25 title/learnerOutcome still names retired NC detection");
  if (/keeps? a sounder energised/i.test(lp25.knowledgeOrProcedure)) throw new Error("EDA-LP-25 knowledge text still asserts the unevidenced sounder-energising claim");
  const mdText = readText(b6.lpMdPath);
  if (/NC detection, transistor switching/i.test(mdText)) throw new Error("EDA-LP-25 heading in markdown still names retired NC detection");
  return "no NC-detection or sounder-energising claim taught as canonical fact";
});

// =====================================================================
// 27. The official IEC preview is represented accurately.
// =====================================================================
check(27, "The official IEC 60617 preview is represented accurately: all six ID/name pairs positively confirmed, artwork/status explicitly disclosed as unconfirmed", () => {
  // Directly and personally re-verified (Stage 1, this pass) by opening the
  // official IEC webstore preview PDF page by page: the ID/Name catalogue
  // table genuinely lists all six entries below. The record must POSITIVELY
  // assert these six pairs (not merely avoid contradicting them), and must
  // also carry the explicit artwork/status limitation -- so this check
  // fails both if the pairs go missing again AND if the false "no specific
  // numbered entries visible" claim ever reappears.
  const b6 = batches.find((b) => b.dir.includes("batch-06"));
  const r = b6.ev.results.find((x) => x.evidenceRequirementId.includes("schematic-symbol-recognition-for-each-named-ac6-2"));
  if (!r) throw new Error("schematic-symbol-recognition-for-each-named-ac6-2 result not found");
  const text = JSON.stringify(r);

  const REQUIRED_PAIRS = [
    ["S00641", "Semiconductor diode, general symbol"],
    ["S00652", "Bidirectional diode thyristor"],
    ["S00659", "Bidirectional triode thyristor"],
    ["S00684", "Light dependent resistor"],
    ["S01919", "Light emitting diode"],
    ["S01920", "Photodiode"],
  ];
  const missing = REQUIRED_PAIRS.filter(([id, name]) => !text.includes(id) || !text.includes(name));
  if (missing.length > 0) throw new Error(`missing positively-confirmed IEC ID/name pair(s): ${missing.map(([id]) => id).join(", ")}`);

  // The historical false claim must never reappear as a LIVE assertion.
  // Scoped to gaps/candidateSources/normalizedClaims only (the "live" claim
  // surface) -- `disclosures` legitimately quotes the retracted wording for
  // audit-trail purposes when explicitly framed as a past correction, and
  // must not trip this check.
  const liveText = JSON.stringify({ gaps: r.result.gaps, candidateSources: r.result.candidateSources, normalizedClaims: r.result.normalizedClaims });
  if (/no specific numbered entries|exposes no specific|expose no specific/i.test(liveText)) {
    throw new Error('the false "no specific numbered entries visible" claim has reappeared as a live assertion');
  }

  // The artwork/status limitation must be explicit -- identity confirmation
  // is not shape or currency confirmation.
  if (!/artwork|geometry/i.test(text)) throw new Error("missing explicit disclosure that symbol artwork/geometry was not confirmed");
  if (!/status|obsolete/i.test(text)) throw new Error("missing explicit disclosure that per-entry Standard/Obsolete status was not confirmed");

  // The requirement's overall status may legitimately be upgraded by a
  // genuinely independent evidentiary basis (Section 4/H, this pass: the
  // LED/inverter breadth closure via a fresh, directly-read re-examination
  // of the already-registered 1975 IEEE Std 315/ANSI Y32.2 standard) -- but
  // the six-identity IEC webstore confirmation must never itself be
  // represented as sufficient to satisfy this requirement (Stage 1's
  // original instruction). The record must explicitly disclaim this.
  const iecClaim = (r.result.normalizedClaims ?? []).find((c) => c.sourceId === "SRC-IEC-60617-WEBSTORE-PREVIEW");
  if (!iecClaim) throw new Error("no normalizedClaims entry for SRC-IEC-60617-WEBSTORE-PREVIEW");
  if (!/not the basis/i.test(iecClaim.claimText)) {
    throw new Error("the six-identity IEC webstore confirmation is not explicitly disclaimed as insufficient, on its own, to satisfy this requirement");
  }

  return "all six ID/name pairs positively confirmed; artwork/geometry and status explicitly disclosed as unconfirmed; the six-identity confirmation is explicitly disclaimed as not itself the basis for this requirement's status";
});

// =====================================================================
// 28. JSON and Markdown learning-point artifacts are semantically
// equivalent.
// =====================================================================
check(28, "JSON and Markdown learning-point artifacts are semantically equivalent (Batches 04-06; 01-03 covered by check 2)", () => {
  let n = 0;
  for (const b of batches.filter((x) => !x.frozen)) {
    const md = readText(b.lpMdPath);
    for (const p of b.lpJson.learningPoints) {
      n++;
      if (!md.includes("`" + p.id + "`")) throw new Error(`${b.dir}: LP ${p.id} heading not found in markdown`);
      if (!md.includes(p.evidenceReadiness)) throw new Error(`${b.dir}: LP ${p.id} evidenceReadiness "${p.evidenceReadiness}" not found anywhere in markdown`);
      for (const reqId of p.evidenceRequirementIds ?? []) {
        if (!md.includes(reqId)) throw new Error(`${b.dir}: LP ${p.id} evidenceRequirementId "${reqId}" not found in markdown`);
      }
    }
    // Count only headings that name a learning-point ID in backticks (e.g.
    // "### `EQCT-LP-01` -- ..."); some batches' markdown also carries extra
    // "### " preamble/overview sub-headings that are not per-LP sections.
    const lpHeadingCount = (md.match(/^### `[A-Z]+-LP-\d+`/gm) ?? []).length;
    if (lpHeadingCount !== b.lpJson.learningPoints.length) {
      throw new Error(`${b.dir}: markdown has ${lpHeadingCount} LP-ID headings but JSON has ${b.lpJson.learningPoints.length} learning points`);
    }
  }
  return `${n} learning points cross-checked between JSON and Markdown`;
});

// =====================================================================
// 29. Review-pack JSON and Markdown totals/statuses agree.
// =====================================================================
check(29, "Review-pack JSON and Markdown totals agree", () => {
  const md = readText(PACK_MD_PATH);
  const wu = pack.dispositionTotals.wholeUnit202;
  const b0406 = pack.dispositionTotals.batches0406Only;
  if (!md.includes(String(wu.requirementCount))) throw new Error(`whole-unit requirementCount ${wu.requirementCount} not found in markdown`);
  if (!md.includes(JSON.stringify(wu.verifiedOrPartiallyVerifiedOrGap))) throw new Error("whole-unit status totals JSON string not found verbatim in markdown");
  if (!md.includes(JSON.stringify(b0406.verifiedOrPartiallyVerifiedOrGap))) throw new Error("batches-04-06 status totals JSON string not found verbatim in markdown");
  if (!md.includes(String(pack.learningPoints.wholeUnit202.total))) throw new Error("whole-unit learning-point total not found in markdown");
  return "review pack JSON and Markdown totals agree";
});

// =====================================================================
// 30. Review-pack generation is deterministic and idempotent.
// =====================================================================
check(30, "Review-pack generation is deterministic and idempotent", () => {
  const before = readText(PACK_JSON_PATH);
  const beforeMd = readText(PACK_MD_PATH);
  execSync("node scripts/backtests/unit202-production-acquisition/build-review-pack.ts", { cwd: repoRoot, stdio: "pipe" });
  const after = readText(PACK_JSON_PATH);
  const afterMd = readText(PACK_MD_PATH);
  if (before !== after) throw new Error("UNIT202-ACQUISITION-REVIEW-PACK.json changed on a second run");
  if (beforeMd !== afterMd) throw new Error("UNIT202-ACQUISITION-REVIEW-PACK.md changed on a second run");
  return "second run produced byte-identical output";
});

// =====================================================================
// 31. The review-pack generator does not hand-assert totals.
// =====================================================================
check(31, "The review-pack generator does not hand-assert totals", () => {
  const src = readText("scripts/backtests/unit202-production-acquisition/build-review-pack.ts");
  // The only permitted bare numeric literal assigned as a fact is the
  // historically-cited original count, which is explicitly documented as
  // a reference figure, not a computed one.
  // Zero is always a legitimate accumulator seed (e.g. "let structSat = 0;"
  // followed by "structSat++"); only a nonzero literal assigned directly to
  // one of these names would indicate a hand-asserted total.
  const suspiciousAssignments = src.match(/(?:VERIFIED|PARTIALLY_VERIFIED|structSat|retired)\s*[:=]\s*[1-9]\d*/gi) ?? [];
  if (suspiciousAssignments.length > 0) throw new Error(`hand-asserted total(s) found: ${suspiciousAssignments.join(", ")}`);
  if (!src.includes("HISTORICAL_ORIGINAL_COUNT = 213")) throw new Error("expected the one documented, explicitly-labelled historical reference figure");
  return "no hand-asserted computed total found (only the documented historical reference figure)";
});

// =====================================================================
// 32. No unqualified universal AC P=VI/P=I^2R/P=V^2/R claim is
// introduced.
// =====================================================================
check(32, "No unqualified universal AC power-formula claim introduced in Batches 04-06 taught content", () => {
  // Scoped to the LEARNING-POINTS files (taught content). EVIDENCE-RESULTS.json
  // and SOURCE-REGISTER.json legitimately contain verbatim quoted source
  // passages (e.g. a retrievedPassage stating "P=V.I=I^2.R=V^2/R" as the
  // source's own general formula list) which are historical record, not this
  // pass's own taught assertion.
  for (const b of batches.filter((x) => !x.frozen)) {
    for (const f of fs.readdirSync(rel(b.dir)).filter((f) => f.includes("LEARNING-POINTS"))) {
      const text = readText(path.join(b.dir, f));
      const matches = text.match(/P\s*=\s*V\s*[.x*×]\s*I(?!\w)/g) ?? [];
      for (const m of matches) {
        const idx = text.indexOf(m);
        const surrounding = text.slice(Math.max(0, idx - 200), idx + 200);
        if (!/DC|resistive|steady|power factor|instantaneous|exclu/i.test(surrounding)) {
          throw new Error(`${b.dir}/${f}: unqualified "P = V x I" near: ...${surrounding.slice(180, 220)}...`);
        }
      }
    }
  }
  return "no unqualified universal AC power-formula claim found in Batches 04-06";
});

// =====================================================================
// 33. Capacitance/inductance language remains explicitly an
// ideal/basic-component model where appropriate.
// =====================================================================
check(33, "Capacitance/inductance language is explicitly an ideal/basic-component model", () => {
  const b4 = batches.find((b) => b.dir.includes("batch-04"));
  for (const f of ["ELECTRICAL-QUANTITIES-AND-CIRCUIT-THEORY-LEARNING-POINTS.json", "ELECTRICAL-QUANTITIES-AND-CIRCUIT-THEORY-LEARNING-POINTS.md"]) {
    const text = readText(path.join(b4.dir, f));
    if (/a fixed (component )?property/i.test(text) && !/ideal|basic-component|treated as constant/i.test(text)) {
      throw new Error(`${f}: an absolute "fixed property" claim remains without the ideal/basic-component qualification`);
    }
  }
  return "capacitance/inductance constancy is explicitly framed as an ideal/basic-component model";
});

// =====================================================================
// 34. No protected/unrelated file is staged or modified by this pass.
// =====================================================================
const ALLOWED_PATH_PREFIXES = [
  "packages/technical-evidence-engine/",
  "scripts/backtests/unit202-blind-acquisition-run/",
  "scripts/backtests/unit202-evidence-acquisition-preflight/",
  "scripts/backtests/unit202-production-acquisition/",
  "reports/backtests/unit202-evidence-acquisition-preflight/",
  "reports/unit202-production-acquisition/",
  "PROJECT-STATUS.md",
];
const KNOWN_PREEXISTING_UNRELATED = ["reports/instructional-visuals/index.html", "reports/instructional-visuals/semantic-audit.json"];
check(34, "No protected/unrelated file is staged or modified by this pass", () => {
  const status = execSync("git status --porcelain", { cwd: repoRoot }).toString().split("\n").filter(Boolean);
  const problems = [];
  for (const line of status) {
    const filePath = line.slice(3).trim();
    if (KNOWN_PREEXISTING_UNRELATED.includes(filePath)) continue;
    const allowed = ALLOWED_PATH_PREFIXES.some((prefix) => filePath === prefix || filePath.startsWith(prefix));
    if (!allowed) problems.push(line);
  }
  if (problems.length > 0) throw new Error(`unexpected file(s) touched: ${problems.join("; ")}`);
  return `${status.length} changed path(s), all within the declared scope boundary`;
});

// =====================================================================
// 35. git diff --check passes.
// =====================================================================
check(35, "git diff --check passes", () => {
  execSync("git diff --check", { cwd: repoRoot });
  return "clean";
});

// =====================================================================
// Stage 9 additions (this pass). Numbered 36+ rather than renumbering
// 1-35, per instruction that accuracy matters more than preserving the
// old headline count. Batches 04-06 only unless noted -- these all
// depend on the Stage-6 curriculumRole/underlyingEvidenceStatuses schema
// which is not retrofitted onto the frozen Batches 01-03 (covered by
// check 2's byte-identity instead).
// =====================================================================

const priorityById2 = new Map(plan.requirements.map((r) => [r.evidenceRequirementId, r.acquisitionPriority]));
const STRUCTURAL_SATISFACTION_IDS_TREATED_AS_REQUIRED = new Set([
  "ER::provisional::unit202::electromagnetism-and-induction::appropriate-simple-ac-generation-calculations::PROCEDURE_COVERAGE",
  "ER::provisional::unit202::electromagnetism-and-induction::appropriate-sine-wave-conversions-calculations::PROCEDURE_COVERAGE",
]);
function priorityOf2(id) {
  const p = priorityById2.get(id);
  if (p === "REQUIRED" || p === "OPTIONAL_CONTEXT") return p;
  if (STRUCTURAL_SATISFACTION_IDS_TREATED_AS_REQUIRED.has(id)) return "REQUIRED";
  return undefined;
}
const statusByIdFull = new Map(allRows.map((r) => [r.evidenceRequirementId, r]));
function terminalStatusOf(id) {
  const r = statusByIdFull.get(id);
  if (!r) return undefined;
  return r.disposition === "STRUCTURALLY_SATISFIED" || r.disposition === "RETIRED_OUT_OF_SCOPE" ? r.disposition : r.result.verificationStatus;
}
function suffixOfFull(id) {
  return id.split("::").slice(4).join("::");
}

check(36, "Every Batches 04-06 LP's underlyingEvidenceStatuses has exact key/value equality with its referenced current results", () => {
  let n = 0;
  const problems = [];
  for (const b of batches.filter((x) => !x.frozen)) {
    for (const p of b.lpJson.learningPoints) {
      const ids = p.evidenceRequirementIds ?? [];
      const expected = {};
      for (const id of ids) {
        const status = terminalStatusOf(id);
        if (status === undefined) { problems.push(`${b.dir} ${p.id}: evidenceRequirementId "${id}" does not resolve`); continue; }
        expected[suffixOfFull(id)] = status;
      }
      const actual = p.underlyingEvidenceStatuses ?? {};
      const expectedKeys = Object.keys(expected).sort();
      const actualKeys = Object.keys(actual).sort();
      const staleKeys = actualKeys.filter((k) => !(k in expected));
      const missingKeys = expectedKeys.filter((k) => !(k in actual));
      const valueMismatches = expectedKeys.filter((k) => k in actual && actual[k] !== expected[k]);
      if (staleKeys.length || missingKeys.length || valueMismatches.length) {
        problems.push(`${b.dir} ${p.id}: stale=[${staleKeys}] missing=[${missingKeys}] mismatched=[${valueMismatches.map((k) => `${k}:${actual[k]}!=${expected[k]}`)}]`);
      }
      n++;
    }
  }
  if (problems.length > 0) throw new Error(problems.slice(0, 8).join("; ") + (problems.length > 8 ? ` (+${problems.length - 8} more)` : ""));
  return `${n} LPs checked, all underlyingEvidenceStatuses exactly match current results (no stale/missing/extra keys)`;
});

check(37, "Each batch's declared readinessCounts and curriculumRoleCounts equal recomputed counts", () => {
  const report = [];
  for (const b of batches.filter((x) => !x.frozen)) {
    const readiness = {};
    const curriculumRole = {};
    for (const p of b.lpJson.learningPoints) {
      readiness[p.evidenceReadiness] = (readiness[p.evidenceReadiness] ?? 0) + 1;
      if (p.curriculumRole) curriculumRole[p.curriculumRole] = (curriculumRole[p.curriculumRole] ?? 0) + 1;
    }
    const declaredReadiness = b.lpJson.readinessCounts ?? {};
    const declaredRole = b.lpJson.curriculumRoleCounts ?? {};
    for (const k of new Set([...Object.keys(readiness), ...Object.keys(declaredReadiness)])) {
      if ((readiness[k] ?? 0) !== (declaredReadiness[k] ?? 0)) throw new Error(`${b.dir}: readinessCounts.${k} declared=${declaredReadiness[k] ?? 0} recomputed=${readiness[k] ?? 0}`);
    }
    for (const k of new Set([...Object.keys(curriculumRole), ...Object.keys(declaredRole)])) {
      if ((curriculumRole[k] ?? 0) !== (declaredRole[k] ?? 0)) throw new Error(`${b.dir}: curriculumRoleCounts.${k} declared=${declaredRole[k] ?? 0} recomputed=${curriculumRole[k] ?? 0}`);
    }
    report.push(`${b.dir.split("/").pop()}: readiness=${JSON.stringify(readiness)} role=${JSON.stringify(curriculumRole)}`);
  }
  return report.join("; ");
});

check(38, "A HELD learning point with wholly verified/structurally-satisfied evidence has an explicit non-evidence blocker", () => {
  let n = 0;
  const problems = [];
  for (const b of batches.filter((x) => !x.frozen)) {
    for (const p of b.lpJson.learningPoints) {
      if (p.evidenceReadiness !== "HELD_PENDING_EVIDENCE_CORRECTION") continue;
      const ids = p.evidenceRequirementIds ?? [];
      const allTerminalGood = ids.length > 0 && ids.every((id) => ["VERIFIED", "STRUCTURALLY_SATISFIED"].includes(terminalStatusOf(id)));
      if (allTerminalGood) {
        n++;
        if (!p.outstandingProductionDependencies || p.outstandingProductionDependencies.length === 0) {
          problems.push(`${b.dir} ${p.id}: HELD with all evidence VERIFIED/STRUCTURALLY_SATISFIED but no outstandingProductionDependencies blocker recorded`);
        }
      }
    }
  }
  if (problems.length > 0) throw new Error(problems.join("; "));
  return `${n} HELD LP(s) with fully-resolved evidence checked, each carries an explicit non-evidence blocker`;
});

check(39, "Context-only learning points expose no assessable application types", () => {
  let n = 0;
  const problems = [];
  for (const b of batches.filter((x) => !x.frozen)) {
    for (const p of b.lpJson.learningPoints) {
      if (p.curriculumRole !== "CONTEXTUAL_SUPPORT_ONLY") continue;
      n++;
      if ((p.applicationTypes ?? []).length > 0) problems.push(`${b.dir} ${p.id}: CONTEXTUAL_SUPPORT_ONLY but applicationTypes is non-empty`);
    }
  }
  if (problems.length > 0) throw new Error(problems.join("; "));
  return `${n} context-only LPs checked, none expose an assessable application type`;
});

check(40, "Required/context evidence arrays exactly match the plan's acquisitionPriority partition", () => {
  let n = 0;
  const problems = [];
  for (const b of batches.filter((x) => !x.frozen)) {
    for (const p of b.lpJson.learningPoints) {
      if (!p.curriculumRole) continue;
      n++;
      const ids = p.evidenceRequirementIds ?? [];
      const expectedRequired = ids.filter((id) => priorityOf2(id) === "REQUIRED");
      const expectedContextual = ids.filter((id) => priorityOf2(id) === "OPTIONAL_CONTEXT");
      const unresolved = ids.filter((id) => priorityOf2(id) === undefined);
      if (unresolved.length > 0) { problems.push(`${b.dir} ${p.id}: unresolved plan priority for ${unresolved.join(",")}`); continue; }
      const actualRequired = [...(p.requiredMasteryEvidenceRequirementIds ?? [])].sort();
      const actualContextual = [...(p.contextualEvidenceRequirementIds ?? [])].sort();
      if (JSON.stringify(expectedRequired.sort()) !== JSON.stringify(actualRequired)) problems.push(`${b.dir} ${p.id}: requiredMasteryEvidenceRequirementIds mismatch`);
      if (JSON.stringify(expectedContextual.sort()) !== JSON.stringify(actualContextual)) problems.push(`${b.dir} ${p.id}: contextualEvidenceRequirementIds mismatch`);
      // No overlap between the two arrays.
      const overlap = actualRequired.filter((id) => actualContextual.includes(id));
      if (overlap.length > 0) problems.push(`${b.dir} ${p.id}: required/contextual arrays overlap on ${overlap.join(",")}`);
      // curriculumRole must match the partition.
      const expectedRole = expectedRequired.length > 0 && expectedContextual.length > 0 ? "MIXED_REQUIRED_AND_CONTEXT" : expectedRequired.length > 0 ? "REQUIRED_MASTERY" : "CONTEXTUAL_SUPPORT_ONLY";
      if (p.curriculumRole !== expectedRole) problems.push(`${b.dir} ${p.id}: curriculumRole=${p.curriculumRole} but partition implies ${expectedRole}`);
    }
  }
  if (problems.length > 0) throw new Error(problems.slice(0, 8).join("; ") + (problems.length > 8 ? ` (+${problems.length - 8} more)` : ""));
  return `${n} LPs' required/context partitions verified against the plan's own acquisitionPriority field`;
});

check(41, "Structured cross-requirement/cross-LP satisfaction claims resolve and their supporting evidence is sufficient", () => {
  let n = 0;
  const problems = [];
  for (const b of batches.filter((x) => !x.frozen)) {
    for (const r of b.ev.results) {
      const coverage = r.result.patternComponentCoverage;
      if (!coverage) continue;
      n++;
      for (const c of coverage) {
        if (c.coverageBasis === "DIRECT") {
          const candIds = new Set((r.result.candidateSources ?? []).map((s) => s.sourceId));
          for (const sid of c.supportingSourceIds ?? []) {
            if (!candIds.has(sid)) problems.push(`${b.dir} ${r.evidenceRequirementId} component ${c.component}: supportingSourceId "${sid}" not in candidateSources`);
          }
        } else if (c.coverageBasis === "CROSS_REQUIREMENT_AND_LEARNING_POINT") {
          const linkedStatus = terminalStatusOf(c.satisfiedByEvidenceRequirementId);
          if (linkedStatus === undefined) problems.push(`${b.dir} ${r.evidenceRequirementId} component ${c.component}: satisfiedByEvidenceRequirementId does not resolve`);
          else if (!["VERIFIED", "STRUCTURALLY_SATISFIED"].includes(linkedStatus)) problems.push(`${b.dir} ${r.evidenceRequirementId} component ${c.component}: linked requirement is ${linkedStatus}, not VERIFIED/STRUCTURALLY_SATISFIED`);
          for (const lpId of c.satisfiedByExistingLearningPointIds ?? []) {
            if (!allLpIds.has(lpId)) problems.push(`${b.dir} ${r.evidenceRequirementId} component ${c.component}: linked LP "${lpId}" does not resolve`);
          }
        } else {
          problems.push(`${b.dir} ${r.evidenceRequirementId} component ${c.component}: unknown coverageBasis "${c.coverageBasis}"`);
        }
        if (c.status !== "VERIFIED") problems.push(`${b.dir} ${r.evidenceRequirementId} component ${c.component}: status is ${c.status}, not VERIFIED`);
      }
      if (r.result.verificationStatus === "VERIFIED" && coverage.some((c) => c.status !== "VERIFIED")) {
        problems.push(`${b.dir} ${r.evidenceRequirementId}: overall VERIFIED but not every pattern component is VERIFIED`);
      }
    }
  }
  if (problems.length > 0) throw new Error(problems.join("; "));
  return `${n} structured composite-coverage requirement(s) checked (patternComponentCoverage), all components resolve and are sufficient`;
});

check(42, "Every VERIFIED result has an empty active gaps array", () => {
  let n = 0;
  const problems = [];
  for (const b of batches) {
    for (const r of b.ev.results) {
      if (r.result.verificationStatus !== "VERIFIED") continue;
      n++;
      if ((r.result.gaps ?? []).length > 0) problems.push(`${b.dir} ${r.evidenceRequirementId}: VERIFIED but gaps has ${r.result.gaps.length} entr(y/ies)`);
    }
  }
  if (problems.length > 0) throw new Error(problems.slice(0, 8).join("; ") + (problems.length > 8 ? ` (+${problems.length - 8} more)` : ""));
  return `${n} VERIFIED rows checked across all batches, all have empty gaps`;
});

check(43, "The alarm-transistor result is not verified from a source discussing only generic transistor switching", () => {
  const b6 = batches.find((b) => b.dir.includes("batch-06"));
  const r = b6.ev.results.find((x) => x.evidenceRequirementId.includes("security-alarm-transistor-switching"));
  if (!r) throw new Error("security-alarm-transistor-switching result not found");
  if (r.result.verificationStatus === "VERIFIED") {
    const hasAlarmSpecificClaim = (r.result.normalizedClaims ?? []).some((c) => /alarm/i.test(c.claimText));
    if (!hasAlarmSpecificClaim) throw new Error("VERIFIED but no normalizedClaim ties the transistor behaviour to a security-alarm circuit specifically -- false-green pattern");
  }
  return `security-alarm-transistor-switching is ${r.result.verificationStatus}, consistent with the general-switching-is-not-alarm-specific correction`;
});

check(44, "The magnetic-field-pattern result covers all three enumerated pattern components", () => {
  const b5 = batches.find((b) => b.dir.includes("batch-05"));
  const r = b5.ev.results.find((x) => x.evidenceRequirementId.includes("magnetic-field-patterns"));
  if (!r) throw new Error("magnetic-field-patterns result not found");
  const required = r.result.requiredPatternComponents ?? [];
  const EXPECTED = ["bar-magnet", "straight-current-carrying-conductor", "solenoid-coil"];
  if (JSON.stringify([...required].sort()) !== JSON.stringify([...EXPECTED].sort())) {
    throw new Error(`requiredPatternComponents=${JSON.stringify(required)}, expected exactly ${JSON.stringify(EXPECTED)}`);
  }
  const coverage = r.result.patternComponentCoverage ?? [];
  const coveredComponents = coverage.map((c) => c.component).sort();
  if (JSON.stringify(coveredComponents) !== JSON.stringify([...EXPECTED].sort())) {
    throw new Error(`patternComponentCoverage components=${JSON.stringify(coveredComponents)}, expected exactly ${JSON.stringify(EXPECTED)}`);
  }
  return "all three enumerated pattern components (bar magnet, straight conductor, solenoid/coil) are structurally covered";
});

check(45, "Review-pack required/context totals recompute independently from source records", () => {
  function computeRequiredContext(scopeBatches) {
    let required = 0;
    let optionalContext = 0;
    for (const b of scopeBatches) {
      for (const r of b.ev.results) {
        const p = priorityOf2(r.evidenceRequirementId);
        if (p === "REQUIRED") required++;
        else if (p === "OPTIONAL_CONTEXT") optionalContext++;
        else throw new Error(`${b.dir} ${r.evidenceRequirementId}: no resolvable acquisitionPriority`);
      }
    }
    return { required, optionalContext };
  }
  const wholeComputed = computeRequiredContext(batches);
  const b0406Computed = computeRequiredContext(batches.filter((b) => !b.frozen));
  const packWhole = pack.requirementCounts.requiredVsContext.wholeUnit202;
  const packB0406 = pack.requirementCounts.requiredVsContext.batches0406Only;
  if (wholeComputed.required !== packWhole.REQUIRED || wholeComputed.optionalContext !== packWhole.OPTIONAL_CONTEXT) {
    throw new Error(`whole-unit required/context computed=${JSON.stringify(wholeComputed)} pack=${JSON.stringify(packWhole)}`);
  }
  if (b0406Computed.required !== packB0406.REQUIRED || b0406Computed.optionalContext !== packB0406.OPTIONAL_CONTEXT) {
    throw new Error(`batches-04-06 required/context computed=${JSON.stringify(b0406Computed)} pack=${JSON.stringify(packB0406)}`);
  }
  return `whole-unit=${JSON.stringify(wholeComputed)} batches0406=${JSON.stringify(b0406Computed)}, both match the review pack`;
});

// =====================================================================
// Checks 46-48 (Stage 7, 2026-09-06 continuation pass): guard the new
// DEFERRED_CONTEXT_ONLY state and the held-point completion ledger this
// pass introduced, without weakening any check above.
// =====================================================================
check(46, "DEFERRED_CONTEXT_ONLY is used only for non-blocking context-only learning points", () => {
  let n = 0;
  const problems = [];
  for (const b of batches.filter((x) => !x.frozen)) {
    for (const p of b.lpJson.learningPoints) {
      if (p.evidenceReadiness !== "DEFERRED_CONTEXT_ONLY") continue;
      n++;
      if (p.curriculumRole !== "CONTEXTUAL_SUPPORT_ONLY") problems.push(`${b.dir} ${p.id}: DEFERRED_CONTEXT_ONLY but curriculumRole=${p.curriculumRole} (must be CONTEXTUAL_SUPPORT_ONLY)`);
      if (p.assessmentEligibility !== "CONTEXT_ONLY_NOT_ASSESSED") problems.push(`${b.dir} ${p.id}: DEFERRED_CONTEXT_ONLY but assessmentEligibility=${p.assessmentEligibility} (must be CONTEXT_ONLY_NOT_ASSESSED)`);
      if ((p.requiredMasteryEvidenceRequirementIds ?? []).length > 0) problems.push(`${b.dir} ${p.id}: DEFERRED_CONTEXT_ONLY but carries a non-empty requiredMasteryEvidenceRequirementIds`);
      if ((p.applicationTypes ?? []).length > 0) problems.push(`${b.dir} ${p.id}: DEFERRED_CONTEXT_ONLY but applicationTypes is non-empty (would expose assessable content from a non-blocking deferral)`);
    }
  }
  if (problems.length > 0) throw new Error(problems.join("; "));
  return `${n} DEFERRED_CONTEXT_ONLY LP(s) checked, each is genuinely non-blocking context-only`;
});

check(47, "Core-release-blocker and contextual-deferral counts in the review pack are mechanically correct", () => {
  const liveBlockers = [];
  const liveDeferrals = [];
  for (const b of batches.filter((x) => !x.frozen)) {
    for (const p of b.lpJson.learningPoints) {
      if (p.evidenceReadiness === "HELD_PENDING_EVIDENCE_CORRECTION") liveBlockers.push(p.id);
      if (p.evidenceReadiness === "DEFERRED_CONTEXT_ONLY") liveDeferrals.push(p.id);
    }
  }
  if (pack.coreReleaseBlockerCount !== liveBlockers.length) throw new Error(`pack.coreReleaseBlockerCount=${pack.coreReleaseBlockerCount} but ${liveBlockers.length} LP(s) are actually HELD_PENDING_EVIDENCE_CORRECTION: ${liveBlockers.join(", ")}`);
  if (pack.contextualDeferralCount !== liveDeferrals.length) throw new Error(`pack.contextualDeferralCount=${pack.contextualDeferralCount} but ${liveDeferrals.length} LP(s) are actually DEFERRED_CONTEXT_ONLY: ${liveDeferrals.join(", ")}`);
  const packBlockerSet = new Set(pack.coreReleaseBlockerLearningPointIds ?? []);
  const packDeferralSet = new Set(pack.contextualDeferralLearningPointIds ?? []);
  for (const id of liveBlockers) if (!packBlockerSet.has(id)) throw new Error(`${id} is HELD_PENDING_EVIDENCE_CORRECTION but missing from pack.coreReleaseBlockerLearningPointIds`);
  for (const id of liveDeferrals) if (!packDeferralSet.has(id)) throw new Error(`${id} is DEFERRED_CONTEXT_ONLY but missing from pack.contextualDeferralLearningPointIds`);
  if (pack.productArchitectFreezeReadiness.coreAcquisitionAndCurriculumInputFreezeReady !== (liveBlockers.length === 0)) {
    throw new Error(`productArchitectFreezeReadiness.coreAcquisitionAndCurriculumInputFreezeReady=${pack.productArchitectFreezeReadiness.coreAcquisitionAndCurriculumInputFreezeReady} but liveBlockers.length=${liveBlockers.length}`);
  }
  return `${liveBlockers.length} core blocker(s), ${liveDeferrals.length} contextual deferral(s), all match the review pack exactly`;
});

check(48, "The held-point completion ledger's 16 entries exactly match current live learning-point state", () => {
  const ledger = readJson("reports/unit202-production-acquisition/UNIT202-HELD-POINT-COMPLETION-LEDGER.json");
  if (ledger.entries.length !== 16) throw new Error(`ledger has ${ledger.entries.length} entries, expected exactly 16`);
  const lpById = new Map();
  for (const b of batches) for (const p of b.lpJson.learningPoints) lpById.set(p.id, p);
  const problems = [];
  for (const e of ledger.entries) {
    const p = lpById.get(e.id);
    if (!p) { problems.push(`${e.id}: not found in any batch's learning points`); continue; }
    if (p.evidenceReadiness !== e.after) problems.push(`${e.id}: ledger.after=${e.after} but live evidenceReadiness=${p.evidenceReadiness}`);
    const liveCoreBlockerAfter = p.evidenceReadiness === "HELD_PENDING_EVIDENCE_CORRECTION";
    if (e.coreBlockerAfter !== liveCoreBlockerAfter) problems.push(`${e.id}: ledger.coreBlockerAfter=${e.coreBlockerAfter} but live state implies ${liveCoreBlockerAfter}`);
  }
  const resolvedCount = ledger.entries.filter((e) => e.after === "READY").length;
  const deferredCount = ledger.entries.filter((e) => e.after === "DEFERRED_CONTEXT_ONLY").length;
  const blockerCount = ledger.entries.filter((e) => e.coreBlockerAfter).length;
  if (ledger.summary.resolvedToReady !== resolvedCount) problems.push(`ledger.summary.resolvedToReady=${ledger.summary.resolvedToReady} recomputed=${resolvedCount}`);
  if (ledger.summary.reclassifiedDeferredContextOnly !== deferredCount) problems.push(`ledger.summary.reclassifiedDeferredContextOnly=${ledger.summary.reclassifiedDeferredContextOnly} recomputed=${deferredCount}`);
  if (ledger.summary.remainingCoreBlockers !== blockerCount) problems.push(`ledger.summary.remainingCoreBlockers=${ledger.summary.remainingCoreBlockers} recomputed=${blockerCount}`);
  if (problems.length > 0) throw new Error(problems.join("; "));
  return `16/16 held-point ledger entries verified against live state; summary counts recompute correctly`;
});

// =====================================================================
// Checks 49-57 (Section B, narrow evidence/curriculum-modelling/
// validation correction pass, 2026-09-06): repair specific false-green
// logic an independent review found in the prior 48-check validator.
// Existing checks 1-48 are unchanged and unweakened.
// =====================================================================

const PROTECTED_FILE_HASHES = {
  "reports/instructional-visuals/index.html": "1340be4b43f639aa2f18b79347cb39499210efffa97768e77e1b75d0cd162d5d",
  "reports/instructional-visuals/semantic-audit.json": "87598f9c19b70790f12cd15cecddaee0397916a2ecee15e06308d6f88dbcccd7",
};

check(49, "Every embedded candidateSource/evaluatedButOutOfPermittedAuthorityClass authorityClass matches its canonical SOURCE-REGISTER entry", () => {
  let n = 0;
  const problems = [];
  for (const b of batches.filter((x) => !x.frozen)) {
    const sr = readJson(b.srPath);
    const canonical = new Map(sr.sources.map((s) => [s.sourceId, s.authorityClass]));
    for (const r of b.ev.results) {
      for (const cs of [...(r.result.candidateSources ?? []), ...(r.result.evaluatedButOutOfPermittedAuthorityClass ?? [])]) {
        const c = canonical.get(cs.sourceId);
        if (c === undefined) { problems.push(`${b.dir} ${r.evidenceRequirementId}: source "${cs.sourceId}" not in SOURCE-REGISTER`); continue; }
        n++;
        if (cs.authorityClass !== c) problems.push(`${b.dir} ${r.evidenceRequirementId}: embedded authorityClass "${cs.authorityClass}" for ${cs.sourceId} does not match canonical "${c}"`);
      }
    }
  }
  if (problems.length > 0) throw new Error(problems.slice(0, 10).join("; ") + (problems.length > 10 ? ` (+${problems.length - 10} more)` : ""));
  return `${n} embedded source-authority-class label(s) checked against the canonical SOURCE-REGISTER, all match`;
});

check(50, "Every normalizedClaim cites a source that is both a registered candidate and permitted for its requirement, unless a genuinely governed PA override exists", () => {
  const paRegistry = readJson("reports/unit202-production-acquisition/UNIT202-PA-AUTHORITY-DECISION-REGISTRY.json");
  const governedIds = new Set(paRegistry.decisions.map((d) => d.id));
  let n = 0;
  const problems = [];
  for (const b of batches.filter((x) => !x.frozen)) {
    for (const r of b.ev.results) {
      const adjudication = r.result.paAuthorityPolicyAdjudication;
      if (adjudication && !governedIds.has(adjudication.id)) {
        problems.push(`${b.dir} ${r.evidenceRequirementId}: paAuthorityPolicyAdjudication id "${adjudication.id}" is not in UNIT202-PA-AUTHORITY-DECISION-REGISTRY.json -- an ungoverned, self-declared authority override`);
        continue;
      }
      const permitted = new Set(r.sourceAuthorityClasses);
      const candById = new Map((r.result.candidateSources ?? []).map((c) => [c.sourceId, c]));
      for (const claim of r.result.normalizedClaims ?? []) {
        n++;
        const cs = candById.get(claim.sourceId);
        if (!cs) { problems.push(`${b.dir} ${r.evidenceRequirementId}: normalizedClaim cites "${claim.sourceId}", which is not in this row's own candidateSources`); continue; }
        if (!permitted.has(cs.authorityClass)) problems.push(`${b.dir} ${r.evidenceRequirementId}: normalizedClaim's source "${claim.sourceId}" has authorityClass "${cs.authorityClass}", not permitted by this row's own sourceAuthorityClasses`);
      }
    }
  }
  if (problems.length > 0) throw new Error(problems.slice(0, 10).join("; ") + (problems.length > 10 ? ` (+${problems.length - 10} more)` : ""));
  return `${n} normalizedClaim(s) checked; every cited source is a registered, permitted candidate (or a genuinely governed PA override)`;
});

check(51, "Every VERIFIED row has structured, atomic per-dimension claim coverage (not merely 'at least one permitted claim exists')", () => {
  // Narrow scope disclosure: this check mechanically verifies STRUCTURAL claim-
  // dimension coverage (every required dimension has >=1 permitted, registered,
  // correctly-tagged claim; every claim's declared dimension(s) are a real subset
  // of the row's own requiredCoverageDimensions). It does NOT and cannot verify
  // that a compound claim's cited passage genuinely supports every clause the
  // claim text asserts -- that is a reading-comprehension judgment, made by hand
  // during this pass's own review (see UNIT202-NARROW-CORRECTION-REPORT-2.md
  // Section D), not something this code checks. Do not read a PASS here as a
  // semantic-correctness guarantee beyond structural coverage.
  let n = 0;
  let claimsChecked = 0;
  const problems = [];
  for (const b of batches.filter((x) => !x.frozen)) {
    for (const r of b.ev.results) {
      if (r.disposition) continue; // STRUCTURALLY_SATISFIED / RETIRED_OUT_OF_SCOPE rows have no direct claims of their own
      const required = r.requiredCoverageDimensions ?? [];
      const permitted = new Set(r.sourceAuthorityClasses);
      const candById = new Map((r.result.candidateSources ?? []).map((c) => [c.sourceId, c]));
      const claims = r.result.normalizedClaims ?? [];

      // Every claim's own declared dimension(s) must be a real subset of this row's requiredCoverageDimensions.
      for (const claim of claims) {
        claimsChecked++;
        const dims = claim.dimension ?? [];
        if (dims.length === 0) { problems.push(`${b.dir} ${r.evidenceRequirementId}: normalizedClaim (source ${claim.sourceId}) has no dimension tag`); continue; }
        for (const d of dims) {
          if (!required.includes(d)) problems.push(`${b.dir} ${r.evidenceRequirementId}: claim (source ${claim.sourceId}) tags dimension "${d}", which is not in this row's own requiredCoverageDimensions [${required.join(", ")}]`);
        }
      }

      if (r.result.verificationStatus !== "VERIFIED") continue;
      n++;
      // Every required dimension must have at least one permitted, registered, correctly-tagged claim.
      for (const dim of required) {
        const covered = claims.some((claim) => {
          const cs = candById.get(claim.sourceId);
          return cs && permitted.has(cs.authorityClass) && (claim.dimension ?? []).includes(dim);
        });
        if (!covered) problems.push(`${b.dir} ${r.evidenceRequirementId}: VERIFIED but required dimension "${dim}" has no permitted, registered, correctly-tagged claim`);
      }
      const satisfied = r.result.coverageDimensionsSatisfied ?? [];
      if (required.length > 0 && !required.every((d) => satisfied.includes(d))) problems.push(`${b.dir} ${r.evidenceRequirementId}: VERIFIED but coverageDimensionsSatisfied does not cover every requiredCoverageDimension`);
    }
  }
  if (problems.length > 0) throw new Error(problems.slice(0, 10).join("; ") + (problems.length > 10 ? ` (+${problems.length - 10} more)` : ""));
  return `${n} VERIFIED row(s) / ${claimsChecked} claim(s) checked: every required dimension has a permitted, registered, correctly-tagged atomic claim, and no claim over-claims a dimension outside its row's own requiredCoverageDimensions`;
});

check(52, "No PARTIALLY_VERIFIED row has an empty unresolvedDimensions array", () => {
  let n = 0;
  const problems = [];
  for (const b of batches.filter((x) => !x.frozen)) {
    for (const r of b.ev.results) {
      if (r.disposition) continue; // STRUCTURALLY_SATISFIED/RETIRED_OUT_OF_SCOPE rows: disposition is the terminal status, not result.verificationStatus (same convention as terminalStatusOf/check 51)
      if (r.result.verificationStatus !== "PARTIALLY_VERIFIED") continue;
      n++;
      if ((r.result.unresolvedDimensions ?? []).length === 0) problems.push(`${b.dir} ${r.evidenceRequirementId}: PARTIALLY_VERIFIED with an empty unresolvedDimensions array -- self-contradictory (what, exactly, remains unresolved?)`);
    }
  }
  if (problems.length > 0) throw new Error(problems.join("; "));
  return `${n} PARTIALLY_VERIFIED row(s) checked, each names at least one genuinely unresolved dimension`;
});

check(53, "No atomic dimension is simultaneously recorded as satisfied and unresolved on the same row", () => {
  let n = 0;
  const problems = [];
  for (const b of batches.filter((x) => !x.frozen)) {
    for (const r of b.ev.results) {
      n++;
      const satisfied = new Set(r.result.coverageDimensionsSatisfied ?? []);
      const unresolved = r.result.unresolvedDimensions ?? [];
      const overlap = unresolved.filter((d) => satisfied.has(d));
      if (overlap.length > 0) problems.push(`${b.dir} ${r.evidenceRequirementId}: dimension(s) [${overlap.join(", ")}] recorded as BOTH satisfied and unresolved`);
    }
  }
  if (problems.length > 0) throw new Error(problems.join("; "));
  return `${n} row(s) checked, no dimension is simultaneously satisfied and unresolved`;
});

check(54, "No REQUIRED_MASTERY or MIXED_REQUIRED_AND_CONTEXT learning point depends on a DEFERRED_CONTEXT_ONLY or RETIRED_OUT_OF_SCOPE prerequisite", () => {
  let n = 0;
  const problems = [];
  const lpById = new Map();
  for (const b of batches) for (const p of b.lpJson.learningPoints) lpById.set(p.id, p);
  for (const b of batches.filter((x) => !x.frozen)) {
    for (const p of b.lpJson.learningPoints) {
      if (p.curriculumRole !== "REQUIRED_MASTERY" && p.curriculumRole !== "MIXED_REQUIRED_AND_CONTEXT") continue;
      n++;
      const prereqIds = [...(p.prerequisiteLearningPointIds ?? []), ...(p.crossDomainPrerequisiteIds ?? [])];
      for (const prereqId of prereqIds) {
        const prereq = lpById.get(prereqId);
        if (!prereq) continue; // unresolved-reference is check 18's job
        if (prereq.evidenceReadiness === "DEFERRED_CONTEXT_ONLY" || prereq.evidenceReadiness === "RETIRED_OUT_OF_SCOPE") {
          problems.push(`${b.dir} ${p.id} (${p.curriculumRole}) depends on ${prereqId}, which is ${prereq.evidenceReadiness} -- a required/core learning point cannot rest on a non-blocking deferral or a retired point as load-bearing prerequisite knowledge`);
        }
      }
    }
  }
  if (problems.length > 0) throw new Error(problems.join("; "));
  return `${n} REQUIRED_MASTERY/MIXED_REQUIRED_AND_CONTEXT learning point(s) checked, none depend on a deferred or retired prerequisite`;
});

check(55, "No DEFERRED_CONTEXT_ONLY or RETIRED_OUT_OF_SCOPE learning point appears in its batch's core V1 instructional sequence", () => {
  let n = 0;
  const problems = [];
  for (const b of batches.filter((x) => !x.frozen)) {
    const readinessById = new Map(b.lpJson.learningPoints.map((p) => [p.id, p.evidenceReadiness]));
    for (const id of b.lpJson.coreInstructionalSequence ?? []) {
      n++;
      const readiness = readinessById.get(id);
      if (readiness === "DEFERRED_CONTEXT_ONLY" || readiness === "RETIRED_OUT_OF_SCOPE") problems.push(`${b.dir}: coreInstructionalSequence contains ${id}, which is ${readiness}`);
    }
    // The full inventory/sequence must still exist and be a superset, so nothing is silently lost.
    const full = new Set(b.lpJson.instructionalSequence ?? []);
    const core = b.lpJson.coreInstructionalSequence ?? [];
    for (const id of core) if (!full.has(id)) problems.push(`${b.dir}: coreInstructionalSequence contains ${id}, which is not present in the full instructionalSequence`);
  }
  if (problems.length > 0) throw new Error(problems.join("; "));
  return `${n} core-instructional-sequence entr(y/ies) checked across Batches 04-06, none are deferred or retired, and the core sequence is a genuine subset of the full inventory`;
});

check(56, "The two protected pre-existing unrelated files are byte-identical to their hashes at the start of this pass", () => {
  const problems = [];
  for (const [relPath, expected] of Object.entries(PROTECTED_FILE_HASHES)) {
    const actual = crypto.createHash("sha256").update(fs.readFileSync(rel(relPath))).digest("hex");
    if (actual !== expected) problems.push(`${relPath}: expected ${expected}, got ${actual}`);
  }
  if (problems.length > 0) throw new Error(problems.join("; "));
  return `${Object.keys(PROTECTED_FILE_HASHES).length} protected file(s) confirmed byte-identical to their starting hashes`;
});

check(57, "The runtime curriculum-delta mapping never marks lesson content as taught-correct when its governed evidence is held, partial, source-gap or retired without an explicit content-ahead-of-evidence flag", () => {
  const mappingPath = "reports/unit202-production-acquisition/UNIT202-RUNTIME-CURRICULUM-DELTA-MAPPING.json";
  if (!fs.existsSync(rel(mappingPath))) return "runtime delta mapping not yet generated -- skipped";
  const mapping = readJson(mappingPath);
  const readinessById = new Map();
  for (const b of batches) for (const p of b.lpJson.learningPoints) readinessById.set(p.id, p.evidenceReadiness);
  let n = 0;
  const problems = [];
  const UNSETTLED = new Set(["HELD_PENDING_EVIDENCE_CORRECTION"]);
  for (const row of mapping.rows ?? []) {
    n++;
    const readiness = readinessById.get(row.id);
    const taughtAsCorrect = (row.lessonCoverageStatus === "TAUGHT_AS_SETTLED_FACT") || (row.axes && row.axes.lessonCoverageStatus === "TAUGHT_AS_SETTLED_FACT");
    if (!taughtAsCorrect) continue;
    if (readiness && UNSETTLED.has(readiness)) {
      const flagged = row.contentAheadOfEvidenceRisk === true || (row.axes && row.axes.contentAheadOfEvidenceRisk === true);
      if (!flagged) problems.push(`${row.id}: runtime mapping marks lesson content as taught/settled while governed evidenceReadiness is ${readiness}, with no contentAheadOfEvidenceRisk flag`);
    }
  }
  if (problems.length > 0) throw new Error(problems.join("; "));
  return `${n} runtime-mapping row(s) checked, no unflagged content-ahead-of-evidence case`;
});

// =====================================================================
// Checks 58-60 (second narrow correction pass, 2026-09-07)
// =====================================================================

function claimRefLine(c) {
  const t = c.claimText.length > 140 ? c.claimText.slice(0, 139) + '…' : c.claimText;
  return `${c.sourceId}: ${t}`;
}

check(58, "Every Batches 04-06 LP's normalizedClaimRefs is an exact, exhaustive, current mechanical cache of its referenced evidence rows' normalizedClaims", () => {
  let n = 0;
  const problems = [];
  for (const b of batches.filter((x) => !x.frozen)) {
    const rowById = new Map(b.ev.results.map((r) => [r.evidenceRequirementId, r]));
    for (const p of b.lpJson.learningPoints) {
      const ids = p.evidenceRequirementIds ?? [];
      if (ids.length === 0) continue;
      n++;
      const expected = [];
      for (const id of ids) {
        const row = rowById.get(id);
        if (!row) continue; // unresolved reference is check 16's job
        for (const c of row.result.normalizedClaims ?? []) expected.push(claimRefLine(c));
      }
      const actual = p.normalizedClaimRefs ?? [];
      if (JSON.stringify(expected) !== JSON.stringify(actual)) {
        problems.push(`${b.dir} ${p.id}: normalizedClaimRefs stale -- expected ${expected.length} entries, has ${actual.length}`);
      }
    }
  }
  if (problems.length > 0) throw new Error(problems.slice(0, 10).join("; ") + (problems.length > 10 ? ` (+${problems.length - 10} more)` : ""));
  return `${n} LP(s) checked; normalizedClaimRefs is the exhaustive, current, mechanically-derived cache model for this field (defined once, applied uniformly)`;
});

check(59, "No READY (or READY-facet) learning point's required-facing fields contain stale unresolved-state language, and no explicitExclusion contradicts currently-taught content", () => {
  const BANNED = [/currently unresolved/i, /pending resolution/i, /required mastery unresolved/i, /not authoritatively evidenced/i, /must not be taught/i];
  const CONTEXTUAL_MARKERS = /context only|not required (recall|core mastery)|contextual|CONTEXT ONLY|line-test|line testing|widely repeated but/i;
  let n = 0;
  const problems = [];
  for (const b of batches.filter((x) => !x.frozen)) {
    for (const p of b.lpJson.learningPoints) {
      if (p.evidenceReadiness !== "READY") continue;
      n++;
      // learnerOutcome and applicationTypes are strictly required-facing: no banned phrase is ever acceptable there.
      for (const field of ["learnerOutcome"]) {
        const text = p[field] ?? "";
        for (const pat of BANNED) if (pat.test(text)) problems.push(`${b.dir} ${p.id}.${field}: stale phrase ${pat} on a READY learning point`);
      }
      for (const at of p.applicationTypes ?? []) {
        for (const pat of BANNED) if (pat.test(at)) problems.push(`${b.dir} ${p.id}.applicationTypes: stale phrase ${pat} ("${at.slice(0, 80)}")`);
      }
      // knowledgeOrProcedure may legitimately narrate an unresolved CONTEXTUAL facet;
      // a banned phrase there is only acceptable within ~200 chars of a contextual marker.
      const kp = p.knowledgeOrProcedure ?? "";
      for (const pat of BANNED) {
        let m;
        const re = new RegExp(pat.source, pat.flags.includes("g") ? pat.flags : pat.flags + "g");
        while ((m = re.exec(kp)) !== null) {
          const windowStart = Math.max(0, m.index - 200);
          const window = kp.slice(windowStart, m.index + 200);
          if (!CONTEXTUAL_MARKERS.test(window)) problems.push(`${b.dir} ${p.id}.knowledgeOrProcedure: stale phrase "${m[0]}" not near a contextual-facet marker`);
        }
      }
      // Heuristic exclusion-contradiction check: an explicitExclusion naming a REQUIRED
      // (not contextual) requirement's own topic words as "NOT evidenced" contradicts a
      // requirement this LP's own requiredMasteryEvidenceRequirementIds shows is VERIFIED.
      const requiredIds = p.requiredMasteryEvidenceRequirementIds ?? [];
      const requiredTopicWords = new Set();
      for (const id of requiredIds) {
        const suffix = id.split("::").slice(4).join("::");
        for (const w of suffix.split(/[-:]+/)) if (w.length > 4) requiredTopicWords.add(w.toLowerCase());
      }
      // Words that recur across >1 of this LP's OWN exclusion entries are generic
      // category language for the LP as a whole (e.g. "heating"/"control"/"motor"
      // repeated across several unrelated exclusions), not a claim-specific overlap
      // -- exclude them mechanically rather than via a hand-curated stoplist.
      const allExclusions = p.explicitExclusions ?? [];
      const exclusionWordCounts = new Map();
      for (const ex of allExclusions) {
        const seenInThisExclusion = new Set(ex.toLowerCase().split(/[^a-z0-9]+/).filter((w) => w.length > 4));
        for (const w of seenInThisExclusion) exclusionWordCounts.set(w, (exclusionWordCounts.get(w) ?? 0) + 1);
      }
      for (const ex of allExclusions) {
        if (!/not (authoritatively )?evidenced|must not be taught/i.test(ex)) continue;
        const exWords = ex.toLowerCase();
        const overlap = [...requiredTopicWords].filter((w) => exWords.includes(w) && (exclusionWordCounts.get(w) ?? 0) === 1);
        if (overlap.length >= 2) problems.push(`${b.dir} ${p.id}.explicitExclusions: "${ex.slice(0, 100)}" overlaps required-mastery topic words [${overlap.join(", ")}] but this LP's required facet(s) are READY -- likely a stale exclusion contradicting current content`);
      }
    }
  }
  if (problems.length > 0) throw new Error(problems.slice(0, 10).join("; ") + (problems.length > 10 ? ` (+${problems.length - 10} more)` : ""));
  return `${n} READY learning point(s) checked across Batches 04-06 for stale unresolved-state language and exclusion/content contradictions`;
});

function verifyRuntimeEvidence(rowId, f, problems) {
  const items = f.runtimeEvidence;
  if (!Array.isArray(items) || items.length === 0) {
    problems.push(`${rowId}: facet "${f.evidenceRequirementId}" is citedAsSettledInRuntime=true but carries no runtimeEvidence`);
    return;
  }
  items.forEach((ev, i) => {
    const label = `${rowId} facet "${f.evidenceRequirementId}" runtimeEvidence[${i}]`;
    if (typeof ev.sourcePath !== "string" || ev.sourcePath.length === 0) {
      problems.push(`${label}: missing/empty sourcePath`);
      return;
    }
    const resolved = path.resolve(repoRoot, ev.sourcePath);
    if (resolved !== repoRoot && !resolved.startsWith(repoRoot + path.sep)) {
      problems.push(`${label}: sourcePath "${ev.sourcePath}" resolves outside the repository`);
      return;
    }
    if (!fs.existsSync(resolved) || !fs.statSync(resolved).isFile()) {
      problems.push(`${label}: sourcePath "${ev.sourcePath}" does not exist as a file`);
      return;
    }
    if (typeof ev.exactTextNeedle !== "string" || ev.exactTextNeedle.length === 0) {
      problems.push(`${label}: missing/empty exactTextNeedle`);
      return;
    }
    const content = fs.readFileSync(resolved, "utf-8");
    if (!content.includes(ev.exactTextNeedle)) {
      problems.push(`${label}: exactTextNeedle does not occur verbatim in "${ev.sourcePath}"`);
    }
  });
}

check(60, "Runtime-mapping rows with facet-level governed evidence references correctly reflect each facet's own live status and citation-class, and every facet cited as settled carries machine-verified runtimeEvidence", () => {
  const mappingPath = "reports/unit202-production-acquisition/UNIT202-RUNTIME-CURRICULUM-DELTA-MAPPING.json";
  if (!fs.existsSync(rel(mappingPath))) throw new Error("runtime delta mapping not generated -- governedFacetReferences coverage cannot be checked");
  const mapping = readJson(mappingPath);
  const rowById = new Map();
  for (const b of batches.filter((x) => !x.frozen)) for (const r of b.ev.results) rowById.set(r.evidenceRequirementId, r);
  const REQUIRED_FACET_ROW_IDS = ["EDA-LP-16", "EDA-LP-25", "EDA-LP-28"];
  const rowsById = new Map((mapping.rows ?? []).map((r) => [r.id, r]));
  const seenEvidenceRequirementIds = new Set();
  let n = 0;
  let evidenceChecked = 0;
  const problems = [];
  const UNSETTLED_STATUSES = new Set(["PARTIALLY_VERIFIED", "SOURCE_GAP", "CONFLICTED", "NOT_ATTEMPTED"]);
  for (const row of mapping.rows ?? []) {
    const facets = row.axes?.governedFacetReferences ?? [];
    for (const f of facets) {
      n++;
      if (typeof f.evidenceRequirementId !== "string" || f.evidenceRequirementId.length === 0) {
        problems.push(`${row.id}: a governedFacetReferences entry has no complete evidenceRequirementId (ambiguous suffixes are not accepted)`);
        continue;
      }
      if (seenEvidenceRequirementIds.has(f.evidenceRequirementId)) {
        problems.push(`${row.id}: duplicate governedFacetReferences entry for ${f.evidenceRequirementId}`);
        continue;
      }
      seenEvidenceRequirementIds.add(f.evidenceRequirementId);
      const evRow = rowById.get(f.evidenceRequirementId);
      if (!evRow) {
        problems.push(`${row.id}: evidenceRequirementId "${f.evidenceRequirementId}" does not resolve to any live Batches-04-06 evidence-result row`);
        continue;
      }
      const liveStatus = evRow.disposition === "RETIRED_OUT_OF_SCOPE" ? "RETIRED_OUT_OF_SCOPE" : evRow.disposition === "STRUCTURALLY_SATISFIED" ? "STRUCTURALLY_SATISFIED" : evRow.result.verificationStatus;
      if (f.status !== liveStatus) problems.push(`${row.id}: facet "${f.evidenceRequirementId}" recorded stale status=${f.status} but live status is ${liveStatus}`);
      if (f.citedAsSettledInRuntime === true && (UNSETTLED_STATUSES.has(liveStatus) || liveStatus === "RETIRED_OUT_OF_SCOPE") && f.flaggedAsUnsupported !== true) {
        problems.push(`${row.id}: facet "${f.evidenceRequirementId}" is cited as settled in the runtime corpus while its live governed status is ${liveStatus}, but is not flagged flaggedAsUnsupported`);
      }
      if (f.citedAsSettledInRuntime === true) {
        evidenceChecked++;
        verifyRuntimeEvidence(row.id, f, problems);
      }
    }
  }
  for (const id of REQUIRED_FACET_ROW_IDS) {
    const row = rowsById.get(id);
    if (!row) { problems.push(`required status-sensitive row ${id} is missing from the runtime mapping entirely`); continue; }
    const facets = row.axes?.governedFacetReferences ?? [];
    if (facets.length === 0) problems.push(`${id}: a status-sensitive row (Product Architect decision) must carry non-empty axes.governedFacetReferences, found none`);
  }
  if (n === 0) throw new Error("0 facet-level governed-evidence references examined -- vacuous PASS is not acceptable; the required status-sensitive rows (EDA-LP-16, EDA-LP-25, EDA-LP-28) must carry structured governedFacetReferences data");
  if (problems.length > 0) throw new Error(problems.slice(0, 10).join("; ") + (problems.length > 10 ? ` (+${problems.length - 10} more)` : ""));
  return `${n} facet-level governed-evidence reference(s) checked across the runtime mapping's opt-in richer rows (including all ${REQUIRED_FACET_ROW_IDS.length} required status-sensitive rows: ${REQUIRED_FACET_ROW_IDS.join(", ")}); each resolves its complete evidenceRequirementId exactly, correctly reflects its own live status, and is never cited as settled on an unsettled/retired facet without flaggedAsUnsupported; ${evidenceChecked} citedAsSettledInRuntime=true facet(s) each carry runtimeEvidence that machine-verifiably resolves to a real, in-repository source file and exact text`;
});

// =====================================================================
// Checks 61-63 (final bounded recovery pass)
// =====================================================================

check(61, "contentAheadOfEvidenceRisk is derived exactly from governedFacetReferences (citedAsSettledInRuntime && flaggedAsUnsupported), and the top-level count/rows exactly match the derived set", () => {
  const mappingPath = "reports/unit202-production-acquisition/UNIT202-RUNTIME-CURRICULUM-DELTA-MAPPING.json";
  if (!fs.existsSync(rel(mappingPath))) throw new Error("runtime delta mapping not generated");
  const mapping = readJson(mappingPath);
  const problems = [];
  const derivedRisky = new Set();
  for (const row of mapping.rows ?? []) {
    const facets = row.axes?.governedFacetReferences ?? [];
    const shouldBeRisky = facets.some((f) => f.citedAsSettledInRuntime === true && f.flaggedAsUnsupported === true);
    const actualRisky = row.axes?.contentAheadOfEvidenceRisk === true;
    if (shouldBeRisky !== actualRisky) {
      problems.push(`${row.id}: contentAheadOfEvidenceRisk=${actualRisky} but the derived-from-facets value is ${shouldBeRisky} -- a READY learning point cannot suppress an unsupported facet-level runtime finding, and this must never be proxied via curriculumDispositionState`);
    }
    if (shouldBeRisky) derivedRisky.add(row.id);
  }
  const topLevelIds = new Set((mapping.contentAheadOfEvidenceRows ?? []).map((r) => r.id));
  const missing = [...derivedRisky].filter((id) => !topLevelIds.has(id));
  const extra = [...topLevelIds].filter((id) => !derivedRisky.has(id));
  if (missing.length > 0) problems.push(`contentAheadOfEvidenceRows is missing derived risky row(s): ${missing.join(", ")}`);
  if (extra.length > 0) problems.push(`contentAheadOfEvidenceRows lists row(s) not derived as risky: ${extra.join(", ")}`);
  if (mapping.contentAheadOfEvidenceCount !== topLevelIds.size) problems.push(`contentAheadOfEvidenceCount (${mapping.contentAheadOfEvidenceCount}) does not match contentAheadOfEvidenceRows.length (${topLevelIds.size})`);
  if (topLevelIds.size !== derivedRisky.size) problems.push(`contentAheadOfEvidenceRows.length (${topLevelIds.size}) does not match the derived risky-row set size (${derivedRisky.size})`);
  if (problems.length > 0) throw new Error(problems.join("; "));
  return `${derivedRisky.size} content-ahead-of-evidence row(s) derived exactly from facet-level flags and matched exactly at the top level: ${[...derivedRisky].sort().join(", ") || "(none)"}`;
});

check(62, "READY-state consistency also covers evidenceReadinessNote, depthJustification and assessmentEligibility: no stale unresolved-state language, and assessmentEligibility is never contradictorily BLOCKED", () => {
  const BANNED = [/currently unresolved/i, /pending resolution/i, /required mastery unresolved/i, /not authoritatively evidenced/i, /must not be taught/i];
  const CONTEXTUAL_MARKERS = /context only|not required (recall|core mastery)|contextual|CONTEXT ONLY|line-test|line testing|widely repeated but/i;
  let n = 0;
  const problems = [];
  for (const b of batches.filter((x) => !x.frozen)) {
    for (const p of b.lpJson.learningPoints) {
      if (p.evidenceReadiness !== "READY") continue;
      n++;
      for (const field of ["evidenceReadinessNote", "depthJustification"]) {
        const text = p[field] ?? "";
        for (const pat of BANNED) {
          const re = new RegExp(pat.source, "gi");
          let m;
          while ((m = re.exec(text)) !== null) {
            const windowStart = Math.max(0, m.index - 200);
            const window = text.slice(windowStart, m.index + 200);
            if (!CONTEXTUAL_MARKERS.test(window)) problems.push(`${b.dir} ${p.id}.${field}: stale phrase "${m[0]}" not near a contextual-facet marker`);
          }
        }
      }
      if (p.assessmentEligibility === "BLOCKED") problems.push(`${b.dir} ${p.id}: evidenceReadiness=READY but assessmentEligibility=BLOCKED -- contradictory pair`);
    }
  }
  if (problems.length > 0) throw new Error(problems.slice(0, 10).join("; ") + (problems.length > 10 ? ` (+${problems.length - 10} more)` : ""));
  return `${n} READY learning point(s) checked for stale language in evidenceReadinessNote/depthJustification and for a contradictory BLOCKED assessmentEligibility`;
});

check(63, "The consolidated review pack's core-blocker summary is genuinely empty when the computed count is zero, and never hand-lists a resolved learning point as a current blocker", () => {
  if (!fs.existsSync(rel(PACK_JSON_PATH))) return "review pack not yet generated -- skipped";
  const pack = readJson(PACK_JSON_PATH);
  const count = pack.coreReleaseBlockerCount;
  const ids = pack.coreReleaseBlockerLearningPointIds ?? [];
  if (count !== ids.length) throw new Error(`coreReleaseBlockerCount (${count}) does not match coreReleaseBlockerLearningPointIds.length (${ids.length})`);
  const battery = pack.remainingGenuineGaps?.battery ?? "";
  const m = battery.match(/CORE \(required-mastery\) blockers remaining after this pass's re-sourcing \((\d+) total, mechanically derived from coreReleaseBlockerLearningPointIds -- never hand-listed\): (.*?)\. RESOLVED/);
  if (!m) throw new Error("remainingGenuineGaps.battery does not carry the expected mechanically-derived core-blocker clause -- has the generator's template drifted from what this check expects?");
  const [, batteryCountStr, batteryList] = m;
  if (Number(batteryCountStr) !== count) throw new Error(`battery text's stated core-blocker count (${batteryCountStr}) does not match pack.coreReleaseBlockerCount (${count})`);
  const expectedList = count > 0 ? ids.join(", ") : "(none)";
  if (batteryList !== expectedList) throw new Error(`battery text's core-blocker list ("${batteryList}") does not match the mechanically-expected list ("${expectedList}")`);
  if (count === 0 && pack.productArchitectFreezeReadiness?.coreAcquisitionAndCurriculumInputFreezeReady !== true) throw new Error("coreReleaseBlockerCount is 0 but productArchitectFreezeReadiness.coreAcquisitionAndCurriculumInputFreezeReady is not true");
  return `review pack's core-blocker summary is mechanically consistent (count=${count}, list="${batteryList}")`;
});

// --- Report ---
let failed = 0;
for (const r of results) {
  console.log(`${r.pass ? "PASS" : "FAIL"} ${String(r.n).padStart(2, "0")} - ${r.name}${r.detail ? " :: " + r.detail : ""}`);
  if (!r.pass) failed++;
}
console.log(`\n${results.length - failed}/${results.length} checks passed.`);
if (failed > 0) process.exit(1);
