/**
 * CC-19A: writes the frozen source-inventory and normalization-ledger
 * JSON + Markdown reports, and the freeze-hash record. Run via:
 *   node --experimental-strip-types scripts/backtests/unit202/generate-cc19a-reports.ts
 *
 * This script performs local file I/O only. It never imports or calls
 * buildStandardPipeline (see cc19a-no-pipeline-execution.test.ts).
 */

import { createHash } from "node:crypto";
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

import { allProposals, capabilityRequirementProposals, curriculumEvidenceProposals, factRequirementAndTechnicalTruthProposals, officialCurriculumUnitProposals, prerequisiteProposals, QUAL_ID } from "./cc19a-ledger-data.ts";
import { buildCoverageAccounting } from "./cc19a-accounting.ts";
import { findContamination } from "./cc19a-contamination-validator.ts";
import { filterToProfile } from "./cc19a-profile-filter.ts";
import { cc19aSourceInventory, cc19aUnavailabilityRecords } from "./cc19a-source-inventory-data.ts";
import type { CC19AProposal } from "./cc19a-types.ts";

const OUT_DIR = path.resolve(import.meta.dirname, "..", "..", "..", "reports", "backtests", "unit202");
mkdirSync(OUT_DIR, { recursive: true });

function sha256(content: string): string {
  return createHash("sha256").update(content, "utf8").digest("hex");
}

function writeJson(fileName: string, data: unknown): string {
  const content = `${JSON.stringify(data, null, 2)}\n`;
  writeFileSync(path.join(OUT_DIR, fileName), content, "utf8");
  return content;
}

function writeMd(fileName: string, content: string): void {
  writeFileSync(path.join(OUT_DIR, fileName), content, "utf8");
}

// ---------------------------------------------------------------------
// Blindness/contamination check -- refuse to write a contaminated ledger.
// ---------------------------------------------------------------------
const contamination = findContamination(allProposals, cc19aSourceInventory);
if (contamination.length > 0) {
  console.error("CC-19A contamination validator FAILED -- refusing to write reports:");
  for (const f of contamination) console.error(`  [${f.recordKind} ${f.id}] field=${f.field} pattern=${f.pattern} value=${f.value}`);
  process.exit(1);
}

// ---------------------------------------------------------------------
// Source inventory report.
// ---------------------------------------------------------------------
const inventoryJsonContent = writeJson("cc19a-source-inventory.json", {
  packageId: "CC-19A",
  qualificationId: QUAL_ID,
  entries: cc19aSourceInventory,
  unavailabilityRecords: cc19aUnavailabilityRecords,
});

const inventoryMd = buildSourceInventoryMarkdown();
writeMd("CC-19A-SOURCE-INVENTORY.md", inventoryMd);

// ---------------------------------------------------------------------
// Normalization ledger report.
// ---------------------------------------------------------------------
const accounting = buildCoverageAccounting();
const profileACount = filterToProfile(allProposals, "FULL_PUBLIC").length;
const profileBCount = filterToProfile(allProposals, "DEGRADED_NO_ASSESSMENT").length;

const ledgerJsonContent = writeJson("cc19a-normalization-ledger.json", {
  packageId: "CC-19A",
  qualificationId: QUAL_ID,
  proposals: allProposals,
  accounting,
  profileCounts: { FULL_PUBLIC: profileACount, DEGRADED_NO_ASSESSMENT: profileBCount },
});

const ledgerMd = buildLedgerMarkdown(accounting, profileACount, profileBCount);
writeMd("CC-19A-NORMALIZATION-LEDGER.md", ledgerMd);

// ---------------------------------------------------------------------
// Freeze hashes.
// ---------------------------------------------------------------------
const freeze = {
  packageId: "CC-19A",
  gitHeadBeforeCC19A: "3c9b1dd",
  frozenAt: "2026-09-02",
  hashes: {
    "cc19a-source-inventory.json": sha256(inventoryJsonContent),
    "cc19a-normalization-ledger.json": sha256(ledgerJsonContent),
  },
  counts: {
    sourceInventoryEntries: cc19aSourceInventory.length,
    normalizationProposals: allProposals.length,
    publicAssessmentItemsNormalized: 0,
    officialCurriculumUnitsRegistered: officialCurriculumUnitProposals.length,
    curriculumEvidenceProposals: curriculumEvidenceProposals.length,
    prerequisiteProposals: prerequisiteProposals.length,
    capabilityRequirementProposals: capabilityRequirementProposals.length,
    factRequirementAndTechnicalTruthProposals: factRequirementAndTechnicalTruthProposals.length,
  },
};
writeJson("CC-19A-FREEZE.json", freeze);

console.log("CC-19A reports written to", OUT_DIR);
console.log(JSON.stringify(freeze, null, 2));

// =======================================================================
// Markdown builders
// =======================================================================

function buildSourceInventoryMarkdown(): string {
  const lines: string[] = [];
  lines.push("# CC-19A Source Inventory", "");
  lines.push("Every candidate raw source considered for the Unit 202 blind normalization, classified BEFORE its content was normalized. An `EXCLUDED_*` source was never opened beyond what is quoted in its own `reason` below.", "");
  lines.push("## Included sources", "");
  for (const e of cc19aSourceInventory.filter((x) => x.inclusionDecision === "INCLUDED")) {
    lines.push(`### ${e.sourceId}`, "");
    lines.push(`- **Role:** ${e.sourceRole}`);
    lines.push(`- **Title:** ${e.title}`);
    lines.push(`- **Source ref:** ${e.sourceRef}`);
    lines.push(`- **Status:** ${e.publicPrivateDerivedStatus}`);
    if (e.contentHashSha256) lines.push(`- **SHA-256:** \`${e.contentHashSha256}\``);
    lines.push(`- **Reason:** ${e.reason}`, "");
  }
  lines.push("## Excluded sources", "");
  const grouped = new Map<string, typeof cc19aSourceInventory extends readonly (infer T)[] ? T[] : never>();
  for (const e of cc19aSourceInventory.filter((x) => x.inclusionDecision !== "INCLUDED")) {
    const list = grouped.get(e.inclusionDecision) ?? [];
    list.push(e);
    grouped.set(e.inclusionDecision, list);
  }
  for (const [category, entries] of grouped) {
    lines.push(`### ${category} (${entries.length})`, "");
    for (const e of entries) {
      lines.push(`- **${e.sourceId}** -- ${e.title} (\`${e.sourceRef}\`)`);
      lines.push(`  ${e.reason}`);
    }
    lines.push("");
  }
  lines.push("## Unavailability records", "");
  for (const u of cc19aUnavailabilityRecords) {
    lines.push(`### ${u.kind}: ${u.evidenceClass}`, "");
    lines.push(`- **Attempted sources:**`);
    for (const s of u.attemptedSources) lines.push(`  - ${s}`);
    lines.push(`- **Explanation:** ${u.explanation}`, "");
  }
  return lines.join("\n");
}

function buildLedgerMarkdown(accounting: ReturnType<typeof buildCoverageAccounting>, profileACount: number, profileBCount: number): string {
  const lines: string[] = [];
  lines.push("# CC-19A Unit 202 Normalization Ledger", "");
  lines.push(
    "Blind normalization of Unit 202's official public curriculum wording (City & Guilds 2365-02 Qualification Handbook v1.12, pages 15/25-30). No Unit 202 governed matrix, obligation, assertion, lesson, or private calibration material was consulted -- see CC-19A-SOURCE-INVENTORY.md. `pipelineAcceptance` is `NOT_RUN_CC19A` on every proposal; `buildStandardPipeline` was never called against this ledger.",
    "",
  );
  lines.push("## Coverage accounting", "");
  lines.push("```json");
  lines.push(JSON.stringify(accounting, null, 2));
  lines.push("```", "");
  lines.push(`## Profile eligibility`, "", `- PROFILE A (FULL_PUBLIC): ${profileACount} proposals`, `- PROFILE B (DEGRADED_NO_ASSESSMENT): ${profileBCount} proposals`, "");
  lines.push(
    "PROFILE B is produced by mechanically filtering PROFILE A (see `cc19a-profile-filter.ts`), never hand-authored. In this package the two counts are equal: zero AssessmentEvidence proposals exist (PUBLIC_ASSESSMENT item content is RAW_SOURCE_UNAVAILABLE), so nothing in the ledger depends solely on PUBLIC_ASSESSMENT authority.",
    "",
  );

  lines.push("## Normalization proposals, grouped by Learning Outcome -> Assessment Criterion -> Range -> proposal", "");
  const byAc = groupProposalsByAc(allProposals);
  for (const [acId, group] of byAc) {
    lines.push(`### ${acId}`, "");
    for (const p of group) {
      lines.push(`#### ${p.proposalId}`, "");
      lines.push("**SOURCE:**", `${p.layerA.sourceId} -- ${p.layerA.sourceLocator}`, "");
      lines.push("**RAW:**", `> ${p.layerA.sourceExcerpt}`, "");
      lines.push("**PROPOSAL:**", `${p.layerB.recordType}${"normalizationKind" in p.layerB.record ? ` / ${(p.layerB.record as { normalizationKind?: string }).normalizationKind}` : ""} -- \`${JSON.stringify(summarizeRecord(p))}\``, "");
      lines.push("**CONFIDENCE:**", p.layerB.normalizationConfidence, "");
      lines.push("**RATIONALE:**", p.layerB.normalizationRationale, "");
      lines.push("---", "");
    }
  }

  lines.push("## Unmapped / not-yet-attached technical truth", "");
  for (const claimKey of accounting.factRequirements.unattachedClaimKeys) {
    lines.push(`- \`${claimKey}\`: fact requirement proposed from AC2.2's curriculum wording; no SourceFactualClaim attached in CC-19A (the exact quantity name is not separately tabulated by the BIPM SI Brochure under that name -- never fabricated from memory). Left genuinely unresolved for a follow-up technical-verification pass.`);
  }
  lines.push("");

  lines.push("## REVIEW_PROPOSED proposals", "");
  for (const id of accounting.reviewProposed.proposalIds) lines.push(`- ${id}`);
  lines.push("");

  return lines.join("\n");
}

function summarizeRecord(p: CC19AProposal): Record<string, unknown> {
  const r = p.layerB.record as unknown as Record<string, unknown>;
  const keys = ["subject", "curriculumUnitId", "targetCandidateKey", "claimKey", "capabilityKey", "normalizedClaimValue", "derivationStatus", "derivationKind", "commandVerbPerformanceType", "officialWording"];
  const out: Record<string, unknown> = {};
  for (const k of keys) if (k in r) out[k] = r[k];
  return out;
}

function groupProposalsByAc(proposals: readonly CC19AProposal[]): Map<string, CC19AProposal[]> {
  const map = new Map<string, CC19AProposal[]>();
  for (const p of proposals) {
    const acTag = p.layerA.rawIdentifier?.match(/LO\d+\.AC\d+/)?.[0] ?? "UNGROUPED";
    const list = map.get(acTag) ?? [];
    list.push(p);
    map.set(acTag, list);
  }
  return new Map([...map.entries()].sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true })));
}
