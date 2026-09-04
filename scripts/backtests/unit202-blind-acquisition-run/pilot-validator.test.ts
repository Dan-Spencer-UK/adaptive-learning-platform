/**
 * CC-24 PA-review correction §3: synthetic valid/invalid fixture tests
 * for the pilot-artifact validator, plus the required read-only run
 * against the real, frozen pilot-001 -- which MUST come back INVALID.
 * Pilot-001 is never modified by these tests (validatePilotDirectory
 * only calls readFileSync).
 */
import path from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { type PilotArtifactRawBundle, validatePilotBundle, validatePilotDirectory } from "./pilot-validator.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..", "..", "..");

const FIXTURE_IDS = ["ER::test::alpha::EXACT_FACT", "ER::test::beta::EXACT_FACT"] as const;
const HASH_A = "a".repeat(64);
const HASH_B = "b".repeat(64);

function validSelectionRequirement(id: string) {
  return { evidenceRequirementId: id, requiredCoverageDimensions: ["DEFINITION"], sourceAuthorityClasses: ["ACADEMIC_OR_RESEARCH_INSTITUTION"] };
}

function validManifest(deviationOccurred = false) {
  return {
    gitBranch: "main",
    gitCommit: "0123456789abcdef0123456789abcdef01234567",
    acquisitionStartedAt: "2026-09-05T09:00:00.000Z",
    acquisitionEndedAt: "2026-09-05T10:00:00.000Z",
    sourcePlanHash: HASH_A,
    selectionHash: HASH_B,
    acquisitionPolicy: { allowLiveWebResearch: true, requireExactLocator: true, maxCandidateSourcesPerRequirement: 4 },
    runtimeVersions: { node: process.version },
    blindnessBoundary: { deviationDisclosure: { occurred: deviationOccurred } },
  };
}

function validFreeze(deviationAcknowledged = false) {
  const artifactHashes: Record<string, string> = {};
  for (const name of ["PILOT-CLEAN-PLAN.json", "PILOT-SELECTION.json", "PILOT-RUN-MANIFEST.json", "PILOT-SEARCH-LOG.json", "PILOT-RETRIEVAL-LOG.json", "PILOT-RESULTS.json", "PILOT-ACCESS-AUDIT.json", "PILOT-REPORT.md"]) {
    artifactHashes[name] = HASH_A;
  }
  return {
    sourcePlanHash: HASH_A,
    selectionHash: HASH_B,
    artifactHashes,
    frozenBlindTargetManifest: { hashBeforeThisRun: HASH_A, hashAtFreeze: HASH_A, unchanged: true },
    declarations: { deviationDisclosureAcknowledged: deviationAcknowledged },
  };
}

function validRetrievalEntry(id: string, sourceId: string, outcome: "ACCEPTED" | "REJECTED" = "ACCEPTED") {
  return {
    evidenceRequirementId: id,
    sourceId,
    attemptedUrl: "https://example.edu/page",
    finalUrl: "https://example.edu/page",
    status: "OK",
    timestamp: "2026-09-05T09:30:00.000Z",
    publisher: "Example University",
    authorityClass: "ACADEMIC_OR_RESEARCH_INSTITUTION",
    authorityRationale: "A named university -- ACADEMIC_OR_RESEARCH_INSTITUTION.",
    contentHash: HASH_A,
    locator: "HTML; heading X",
    boundedPassageOrDiagramDescription: "The definition sentence.",
    outcome,
  };
}

function validResultEntry(id: string, sourceId: string) {
  return {
    evidenceRequirementId: id,
    result: {
      evidenceRequirementId: id,
      candidateSources: [{ sourceId, authorityClass: "ACADEMIC_OR_RESEARCH_INSTITUTION", sourceRef: "https://example.edu/page", sourceLocator: "HTML; heading X", retrievedPassage: "The definition sentence." }],
      normalizedClaims: [{ claimText: "The definition.", sourceId }],
      verificationStatus: "VERIFIED",
      coverageDimensionsSatisfied: ["DEFINITION"],
      unresolvedDimensions: [],
      conflicts: [],
      gaps: [],
    },
    pilotAudit: { claimDimensionBindings: [{ claimText: "The definition.", sourceId, dimensions: ["DEFINITION"] }] },
  };
}

function validReportMarkdown(ids: readonly string[]) {
  const header = "| ID | Status | Authority | Locator | Normalized claim | Satisfied dimensions | Unresolved dimensions | Conflict/Gap |";
  const sep = "|---|---|---|---|---|---|---|---|";
  const rows = ids.map((id) => `| ${id} | VERIFIED | ACADEMIC_OR_RESEARCH_INSTITUTION | HTML; heading X | The definition. | DEFINITION | -- | -- |`);
  return [header, sep, ...rows].join("\n");
}

function buildValidBundle(): PilotArtifactRawBundle {
  const selection = { requirements: FIXTURE_IDS.map((id) => validSelectionRequirement(id)) };
  const manifest = validManifest(false);
  const freeze = validFreeze(false);
  const searchLog = { entries: FIXTURE_IDS.map((id) => ({ evidenceRequirementId: id, queries: ["a query"], candidates: [{ order: 1, sourceRef: "https://example.edu/page", chosen: true, reason: "on-point" }] })) };
  const retrievalLog = { entries: FIXTURE_IDS.map((id) => validRetrievalEntry(id, "SRC-1")) };
  const results = { results: FIXTURE_IDS.map((id) => validResultEntry(id, "SRC-1")) };
  const accessAudit = { records: [{ canonicalPath: "reports/x.json", contentHash: HASH_A, reason: "read", matchedRule: "RULE", outcome: "ALLOWED", recordedAt: "2026-09-05T09:00:00.000Z" }] };
  const reportMarkdown = validReportMarkdown(FIXTURE_IDS);

  return {
    selectionJson: JSON.stringify(selection),
    manifestJson: JSON.stringify(manifest),
    searchLogJson: JSON.stringify(searchLog),
    retrievalLogJson: JSON.stringify(retrievalLog),
    resultsJson: JSON.stringify(results),
    accessAuditJson: JSON.stringify(accessAudit),
    reportMarkdown,
    freezeJson: JSON.stringify(freeze),
  };
}

const VALID_OPTIONS = { expectedRequirementIds: FIXTURE_IDS };

describe("CC-24 PA-review correction §3 -- pilot-artifact validator", () => {
  it("accepts a fully-conforming synthetic fixture as VALID", () => {
    const result = validatePilotBundle(buildValidBundle(), VALID_OPTIONS);
    expect(result.defects).toEqual([]);
    expect(result.valid).toBe(true);
  });

  it("rejects a duplicate JSON key (strict JSON parsing)", () => {
    // Hand-crafted raw text with a literal duplicated key inside one object
    // -- JSON.parse would silently keep only the last occurrence.
    const bundle: PilotArtifactRawBundle = { ...buildValidBundle(), resultsJson: `{"results":[{"evidenceRequirementId":"${FIXTURE_IDS[0]}","result":{"unresolvedDimensions":[],"unresolvedDimensions":["DEFINITION"]}}]}` };
    const result = validatePilotBundle(bundle, VALID_OPTIONS);
    expect(result.valid).toBe(false);
    expect(result.defects.some((d) => d.code === "DUPLICATE_JSON_KEY")).toBe(true);
  });

  it("rejects a fifth candidate for one requirement (candidate cap exceeded)", () => {
    const base = buildValidBundle();
    const searchLog = JSON.parse(base.searchLogJson);
    searchLog.entries[0].candidates = [1, 2, 3, 4, 5].map((n) => ({ order: n, sourceRef: `https://example.edu/c${n}`, chosen: n === 1, reason: "considered" }));
    const bundle: PilotArtifactRawBundle = { ...base, searchLogJson: JSON.stringify(searchLog) };
    const result = validatePilotBundle(bundle, VALID_OPTIONS);
    expect(result.valid).toBe(false);
    expect(result.defects.some((d) => d.code === "CANDIDATE_CAP_EXCEEDED")).toBe(true);
  });

  it("rejects source-class laundering (authorityClass not permitted by the requirement's policy)", () => {
    const base = buildValidBundle();
    const results = JSON.parse(base.resultsJson);
    results.results[0].result.candidateSources[0].authorityClass = "ORIGINAL_MANUFACTURER_OR_VENDOR"; // not in the fixture's permitted list
    const bundle: PilotArtifactRawBundle = { ...base, resultsJson: JSON.stringify(results) };
    const result = validatePilotBundle(bundle, VALID_OPTIONS);
    expect(result.valid).toBe(false);
    expect(result.defects.some((d) => d.code === "AUTHORITY_CLASS_NOT_PERMITTED")).toBe(true);
  });

  it("rejects a candidateSources entry with no matching ACCEPTED retrieval attempt", () => {
    const base = buildValidBundle();
    const retrievalLog = JSON.parse(base.retrievalLogJson);
    retrievalLog.entries = retrievalLog.entries.filter((e: { evidenceRequirementId: string }) => e.evidenceRequirementId !== FIXTURE_IDS[0]);
    const bundle: PilotArtifactRawBundle = { ...base, retrievalLogJson: JSON.stringify(retrievalLog) };
    const result = validatePilotBundle(bundle, VALID_OPTIONS);
    expect(result.valid).toBe(false);
    expect(result.defects.some((d) => d.code === "RETRIEVAL_ATTEMPT_MISSING_FOR_CANDIDATE")).toBe(true);
  });

  it("rejects a retrieval entry missing the locator field", () => {
    const base = buildValidBundle();
    const retrievalLog = JSON.parse(base.retrievalLogJson);
    delete retrievalLog.entries[0].locator;
    const bundle: PilotArtifactRawBundle = { ...base, retrievalLogJson: JSON.stringify(retrievalLog) };
    const result = validatePilotBundle(bundle, VALID_OPTIONS);
    expect(result.valid).toBe(false);
    expect(result.defects.some((d) => d.code === "RETRIEVAL_ENTRY_MISSING_FIELD" && d.message.includes("locator"))).toBe(true);
  });

  it("rejects an incomplete coverage-dimension partition (a required dimension accounted for nowhere)", () => {
    const base = buildValidBundle();
    const selection = JSON.parse(base.selectionJson);
    selection.requirements[0].requiredCoverageDimensions = ["DEFINITION", "UNIT_SYMBOL"];
    // results still only partitions DEFINITION -- UNIT_SYMBOL is unaccounted for.
    const bundle: PilotArtifactRawBundle = { ...base, selectionJson: JSON.stringify(selection) };
    const result = validatePilotBundle(bundle, VALID_OPTIONS);
    expect(result.valid).toBe(false);
    expect(result.defects.some((d) => d.code === "COVERAGE_PARTITION_INVALID")).toBe(true);
  });

  it("rejects a false 'no historical read' declaration (deviation disclosed but freeze does not structurally acknowledge it)", () => {
    const base = buildValidBundle();
    const bundle: PilotArtifactRawBundle = { ...base, manifestJson: JSON.stringify(validManifest(true)), freezeJson: JSON.stringify(validFreeze(false)) };
    const result = validatePilotBundle(bundle, VALID_OPTIONS);
    expect(result.valid).toBe(false);
    expect(result.defects.some((d) => d.code === "PROHIBITED_READ_DEVIATION_DISCLOSED")).toBe(true);
    expect(result.defects.some((d) => d.code === "DECLARATION_INCONSISTENCY")).toBe(true);
  });

  it("rejects any DENIED access outcome, unconditionally", () => {
    const base = buildValidBundle();
    const accessAudit = JSON.parse(base.accessAuditJson);
    accessAudit.records.push({ canonicalPath: "scripts/backtests/unit202-reconciliation/x.ts", contentHash: null, reason: "demonstration", matchedRule: null, outcome: "DENIED", recordedAt: "2026-09-05T09:01:00.000Z" });
    const bundle: PilotArtifactRawBundle = { ...base, accessAuditJson: JSON.stringify(accessAudit) };
    const result = validatePilotBundle(bundle, VALID_OPTIONS);
    expect(result.valid).toBe(false);
    expect(result.defects.some((d) => d.code === "DENIED_ACCESS_OUTCOME")).toBe(true);
  });

  it("rejects an incomplete report row (missing required columns / row-count mismatch)", () => {
    const base = buildValidBundle();
    const bundle: PilotArtifactRawBundle = { ...base, reportMarkdown: ["| ID | Status | Source |", "|---|---|---|", `| ${FIXTURE_IDS[0]} | VERIFIED | Example |`].join("\n") };
    const result = validatePilotBundle(bundle, VALID_OPTIONS);
    expect(result.valid).toBe(false);
    expect(result.defects.some((d) => d.code === "REPORT_MISSING_REQUIRED_COLUMN")).toBe(true);
    expect(result.defects.some((d) => d.code === "REPORT_ROW_COUNT_MISMATCH")).toBe(true);
  });

  it("rejects a selection set that does not exactly match the expected requirement IDs (missing / extra / duplicate)", () => {
    const base = buildValidBundle();
    const selection = JSON.parse(base.selectionJson);
    selection.requirements.push(validSelectionRequirement(FIXTURE_IDS[0])); // duplicate
    selection.requirements = selection.requirements.filter((r: { evidenceRequirementId: string }) => r.evidenceRequirementId !== FIXTURE_IDS[1]); // missing beta
    selection.requirements.push(validSelectionRequirement("ER::test::unexpected::EXACT_FACT")); // extra
    const bundle: PilotArtifactRawBundle = { ...base, selectionJson: JSON.stringify(selection) };
    const result = validatePilotBundle(bundle, VALID_OPTIONS);
    expect(result.valid).toBe(false);
    expect(result.defects.some((d) => d.code === "SELECTION_DUPLICATE_ID")).toBe(true);
    expect(result.defects.filter((d) => d.code === "SELECTION_SET_MISMATCH").length).toBeGreaterThanOrEqual(2);
  });

  it("read-only run against the real, frozen pilot-001 returns INVALID and lists genuine defects -- pilot-001 is never modified", () => {
    const pilotDir = path.join(repoRoot, "reports", "backtests", "unit202-blind-acquisition-run", "pilot-001");
    const result = validatePilotDirectory(pilotDir);
    expect(result.valid).toBe(false);
    expect(result.defects.length).toBeGreaterThan(0);
    const codes = new Set(result.defects.map((d) => d.code));
    // The specific defects the Project Architect's review identified that
    // this mechanical validator independently, and correctly, catches too.
    expect(codes.has("CANDIDATE_CAP_EXCEEDED")).toBe(true);
    expect(codes.has("PROHIBITED_READ_DEVIATION_DISCLOSED")).toBe(true);
    expect(codes.has("DENIED_ACCESS_OUTCOME")).toBe(true);
    expect(codes.has("MANIFEST_MISSING_FIELD")).toBe(true);
    expect(codes.has("FREEZE_MISSING_FIELD")).toBe(true);
    expect(codes.has("RETRIEVAL_ENTRY_MISSING_FIELD")).toBe(true);
    expect(codes.has("REPORT_MISSING_REQUIRED_COLUMN")).toBe(true);
  });
});
