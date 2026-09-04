/**
 * CC-24 PA-review correction §3: synthetic valid/invalid fixture tests
 * for the pilot-artifact validator, plus the required read-only run
 * against the real, frozen pilot-001 -- which MUST come back INVALID,
 * reporting only defects genuinely present in the repository files.
 * Pilot-001 is never modified by these tests (validatePilotDirectory
 * only calls readFileSync).
 *
 * [Corrected] The valid fixture now computes every hash via the SAME
 * `hashContent` function the validator itself uses -- never an
 * arbitrary placeholder like `"a".repeat(64)` -- so a test that mutates
 * one byte of one artifact and expects a hash-mismatch defect is
 * actually exercising the real hash-comparison logic, not merely
 * decorative equality on inert strings.
 */
import path from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";
import { hashContent } from "@alp/technical-evidence-engine";

import { type PilotArtifactRawBundle, renderExpectedReportForBundle, validatePilotBundle, validatePilotDirectory } from "./pilot-validator.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..", "..", "..");

const FIXTURE_IDS = ["ER::test::alpha::EXACT_FACT", "ER::test::beta::EXACT_FACT"] as const;
const ACQUISITION_START = "2026-09-05T09:00:00.000Z";
const ACQUISITION_END = "2026-09-05T10:00:00.000Z";
const RETRIEVAL_TIMESTAMP = "2026-09-05T09:30:00.000Z";

function validSelectionRequirement(id: string) {
  return { evidenceRequirementId: id, requiredCoverageDimensions: ["DEFINITION"], sourceAuthorityClasses: ["ACADEMIC_OR_RESEARCH_INSTITUTION"] };
}

function validRetrievalEntry(id: string, candidateId: string, outcome: "ACCEPTED" | "REJECTED" = "ACCEPTED") {
  return {
    evidenceRequirementId: id,
    candidateId,
    attemptedUrl: "https://example.edu/page",
    finalUrl: "https://example.edu/page",
    status: "OK",
    timestamp: RETRIEVAL_TIMESTAMP,
    publisher: "Example University",
    authorityClass: "ACADEMIC_OR_RESEARCH_INSTITUTION",
    authorityRationale: "A named university -- ACADEMIC_OR_RESEARCH_INSTITUTION.",
    contentHash: hashContent("fixture retrieved content"),
    locator: "HTML; heading X",
    boundedPassageOrDiagramDescription: "The definition sentence.",
    outcome,
    ...(outcome === "REJECTED" ? { rejectionReason: "not on point" } : {}),
  };
}

function validResultEntry(id: string, candidateId: string) {
  return {
    evidenceRequirementId: id,
    result: {
      evidenceRequirementId: id,
      candidateSources: [{ sourceId: candidateId, authorityClass: "ACADEMIC_OR_RESEARCH_INSTITUTION", sourceRef: "https://example.edu/page", sourceLocator: "HTML; heading X", retrievedPassage: "The definition sentence." }],
      normalizedClaims: [{ claimText: "The definition.", sourceId: candidateId }],
      verificationStatus: "VERIFIED",
      coverageDimensionsSatisfied: ["DEFINITION"],
      unresolvedDimensions: [],
      conflicts: [],
      gaps: [],
    },
    pilotAudit: { claimDimensionBindings: [{ claimText: "The definition.", sourceId: candidateId, dimensions: ["DEFINITION"] }] },
  };
}

/** Builds a fully self-consistent, genuinely-hashed valid bundle. Every step that depends on an earlier artifact's exact bytes (sourcePlanHash, selectionHash, every freeze artifactHashes entry, the deterministically-rendered report) is computed in the correct dependency order -- never hand-typed. */
function buildValidBundle(): PilotArtifactRawBundle {
  const cleanPlan = { requirementCount: FIXTURE_IDS.length, requirements: FIXTURE_IDS.map((id) => validSelectionRequirement(id)), structuralSatisfactions: [] };
  const cleanPlanJson = JSON.stringify(cleanPlan, null, 2) + "\n";
  const sourcePlanHash = hashContent(cleanPlanJson);

  const selection = { pilotId: "test-fixture", sourcePlanHash, selectedCount: FIXTURE_IDS.length, requirements: FIXTURE_IDS.map((id) => validSelectionRequirement(id)) };
  const selectionJson = JSON.stringify(selection, null, 2) + "\n";
  const selectionHash = hashContent(selectionJson);

  const searchLog = { entries: FIXTURE_IDS.map((id) => ({ evidenceRequirementId: id, queries: ["a query"], candidates: [{ candidateId: "SRC-1", order: 1, sourceRef: "https://example.edu/page", chosen: true, reason: "on-point", retrievalAttempted: true }] })) };
  const searchLogJson = JSON.stringify(searchLog, null, 2) + "\n";

  const retrievalLog = { entries: FIXTURE_IDS.map((id) => validRetrievalEntry(id, "SRC-1")) };
  const retrievalLogJson = JSON.stringify(retrievalLog, null, 2) + "\n";

  const results = { results: FIXTURE_IDS.map((id) => validResultEntry(id, "SRC-1")) };
  const resultsJson = JSON.stringify(results, null, 2) + "\n";

  const accessAudit = { records: [{ canonicalPath: "reports/x.json", contentHash: hashContent("x"), reason: "read", matchedRule: "RULE", outcome: "ALLOWED", recordedAt: ACQUISITION_START }] };
  const accessAuditJson = JSON.stringify(accessAudit, null, 2) + "\n";

  const manifest = {
    gitBranch: "main",
    gitCommit: "0123456789abcdef0123456789abcdef01234567",
    acquisitionStartedAt: ACQUISITION_START,
    acquisitionEndedAt: ACQUISITION_END,
    sourcePlanHash,
    selectionHash,
    acquisitionPolicy: { allowLiveWebResearch: true, requireExactLocator: true, maxCandidateSourcesPerRequirement: 4 },
    runtimeVersions: { node: process.version },
    blindnessBoundary: { deviationDisclosure: { occurred: false } },
  };
  const manifestJson = JSON.stringify(manifest, null, 2) + "\n";

  const preliminary: PilotArtifactRawBundle = { cleanPlanJson, selectionJson, manifestJson, searchLogJson, retrievalLogJson, resultsJson, accessAuditJson, reportMarkdown: "", freezeJson: "{}" };
  const reportMarkdown = renderExpectedReportForBundle(preliminary, FIXTURE_IDS);

  const artifactHashes = {
    "PILOT-CLEAN-PLAN.json": hashContent(cleanPlanJson),
    "PILOT-SELECTION.json": hashContent(selectionJson),
    "PILOT-RUN-MANIFEST.json": hashContent(manifestJson),
    "PILOT-SEARCH-LOG.json": hashContent(searchLogJson),
    "PILOT-RETRIEVAL-LOG.json": hashContent(retrievalLogJson),
    "PILOT-RESULTS.json": hashContent(resultsJson),
    "PILOT-ACCESS-AUDIT.json": hashContent(accessAuditJson),
    "PILOT-REPORT.md": hashContent(reportMarkdown),
  };
  const freeze = {
    sourcePlanHash,
    selectionHash,
    artifactHashes,
    frozenBlindTargetManifest: { hashBeforeThisRun: "x".repeat(64), hashAtFreeze: "x".repeat(64), unchanged: true },
    declarations: { deviationDisclosureAcknowledged: false },
  };
  const freezeJson = JSON.stringify(freeze, null, 2) + "\n";

  return { cleanPlanJson, selectionJson, manifestJson, searchLogJson, retrievalLogJson, resultsJson, accessAuditJson, reportMarkdown, freezeJson };
}

const VALID_OPTIONS = { expectedRequirementIds: FIXTURE_IDS };

/** Re-derives freeze + manifest from a mutated bundle's other artifacts so a test can isolate ONE specific defect (e.g. a hash mismatch) without every other genuinely-computed cross-check also firing as noise. Recomputes sourcePlanHash/selectionHash and artifactHashes from whatever the bundle's fields ACTUALLY are at call time -- so the only way to introduce a mismatch is to mutate bytes and then NOT re-run this. */
function reconcileFreezeAndManifest(bundle: PilotArtifactRawBundle): PilotArtifactRawBundle {
  const sourcePlanHash = hashContent(bundle.cleanPlanJson);
  const selectionHash = hashContent(bundle.selectionJson);
  const manifest = JSON.parse(bundle.manifestJson);
  manifest.sourcePlanHash = sourcePlanHash;
  manifest.selectionHash = selectionHash;
  const manifestJson = JSON.stringify(manifest, null, 2) + "\n";
  const freeze = JSON.parse(bundle.freezeJson);
  freeze.sourcePlanHash = sourcePlanHash;
  freeze.selectionHash = selectionHash;
  freeze.artifactHashes = {
    "PILOT-CLEAN-PLAN.json": hashContent(bundle.cleanPlanJson),
    "PILOT-SELECTION.json": hashContent(bundle.selectionJson),
    "PILOT-RUN-MANIFEST.json": hashContent(manifestJson),
    "PILOT-SEARCH-LOG.json": hashContent(bundle.searchLogJson),
    "PILOT-RETRIEVAL-LOG.json": hashContent(bundle.retrievalLogJson),
    "PILOT-RESULTS.json": hashContent(bundle.resultsJson),
    "PILOT-ACCESS-AUDIT.json": hashContent(bundle.accessAuditJson),
    "PILOT-REPORT.md": hashContent(bundle.reportMarkdown),
  };
  return { ...bundle, manifestJson, freezeJson: JSON.stringify(freeze, null, 2) + "\n" };
}

describe("CC-24 PA-review correction §3 -- pilot-artifact validator", () => {
  it("accepts a fully-conforming, genuinely-hashed synthetic fixture as VALID", () => {
    const result = validatePilotBundle(buildValidBundle(), VALID_OPTIONS);
    expect(result.defects).toEqual([]);
    expect(result.valid).toBe(true);
  });

  it("§3.A: rejects a duplicate JSON key (strict JSON parsing, delegated grammar)", () => {
    const bundle: PilotArtifactRawBundle = { ...buildValidBundle(), resultsJson: `{"results":[{"evidenceRequirementId":"${FIXTURE_IDS[0]}","result":{"unresolvedDimensions":[],"unresolvedDimensions":["DEFINITION"]}}]}` };
    const result = validatePilotBundle(bundle, VALID_OPTIONS);
    expect(result.valid).toBe(false);
    expect(result.defects.some((d) => d.code === "DUPLICATE_JSON_KEY")).toBe(true);
  });

  it("§3.A: rejects malformed JSON grammar (e.g. a leading-zero number) via the native-JSON.parse-delegated check", () => {
    const bundle: PilotArtifactRawBundle = { ...buildValidBundle(), accessAuditJson: '{"records":[{"outcome":01}]}' };
    const result = validatePilotBundle(bundle, VALID_OPTIONS);
    expect(result.valid).toBe(false);
    expect(result.defects.some((d) => d.code === "JSON_SYNTAX_ERROR")).toBe(true);
  });

  it("§3.B: rejects a selection set that is missing an expected ID, has a duplicate ID, and an unexpected extra ID", () => {
    const base = buildValidBundle();
    const selection = JSON.parse(base.selectionJson);
    selection.requirements.push(validSelectionRequirement(FIXTURE_IDS[0])); // duplicate
    selection.requirements = selection.requirements.filter((r: { evidenceRequirementId: string }) => r.evidenceRequirementId !== FIXTURE_IDS[1]); // missing beta
    selection.requirements.push(validSelectionRequirement("ER::test::unexpected::EXACT_FACT")); // extra
    const bundle = reconcileFreezeAndManifest({ ...base, selectionJson: JSON.stringify(selection, null, 2) + "\n" });
    const result = validatePilotBundle(bundle, VALID_OPTIONS);
    expect(result.valid).toBe(false);
    expect(result.defects.some((d) => d.code === "DUPLICATE_REQUIREMENT_ID")).toBe(true);
    expect(result.defects.filter((d) => d.code === "REQUIREMENT_SET_MISMATCH" && d.message.includes("PILOT-SELECTION.json")).length).toBeGreaterThanOrEqual(2);
  });

  it("§3.B: rejects a search-log / results entry set that does not exactly match the expected IDs", () => {
    const base = buildValidBundle();
    const searchLog = JSON.parse(base.searchLogJson);
    searchLog.entries = searchLog.entries.filter((e: { evidenceRequirementId: string }) => e.evidenceRequirementId !== FIXTURE_IDS[1]);
    const results = JSON.parse(base.resultsJson);
    results.results.push(JSON.parse(JSON.stringify(results.results[0])));
    const bundle = reconcileFreezeAndManifest({ ...base, searchLogJson: JSON.stringify(searchLog, null, 2) + "\n", resultsJson: JSON.stringify(results, null, 2) + "\n" });
    const result = validatePilotBundle(bundle, VALID_OPTIONS);
    expect(result.valid).toBe(false);
    expect(result.defects.some((d) => d.code === "REQUIREMENT_SET_MISMATCH" && d.message.includes("PILOT-SEARCH-LOG.json"))).toBe(true);
    expect(result.defects.some((d) => d.code === "DUPLICATE_REQUIREMENT_ID" && d.message.includes("PILOT-RESULTS.json"))).toBe(true);
  });

  it("§3.B: rejects a result whose inner result.evidenceRequirementId does not equal its outer evidenceRequirementId", () => {
    const base = buildValidBundle();
    const results = JSON.parse(base.resultsJson);
    results.results[0].result.evidenceRequirementId = "ER::test::mismatched::EXACT_FACT";
    const bundle = reconcileFreezeAndManifest({ ...base, resultsJson: JSON.stringify(results, null, 2) + "\n" });
    const result = validatePilotBundle(bundle, VALID_OPTIONS);
    expect(result.valid).toBe(false);
    expect(result.defects.some((d) => d.code === "RESULT_ID_MISMATCH")).toBe(true);
  });

  it("§3.C: a single-byte mutation to PILOT-RESULTS.json (after freeze) makes validation fail with a hash-mismatch defect", () => {
    const base = buildValidBundle(); // freeze hashes reflect the ORIGINAL resultsJson
    const mutated = base.resultsJson.replace('"VERIFIED"', '"VERIFIEE"'); // single-byte-class mutation, same length
    const bundle: PilotArtifactRawBundle = { ...base, resultsJson: mutated };
    const result = validatePilotBundle(bundle, VALID_OPTIONS);
    expect(result.valid).toBe(false);
    expect(result.defects.some((d) => d.code === "ARTIFACT_HASH_MISMATCH" && d.message.includes("PILOT-RESULTS.json"))).toBe(true);
  });

  it("§3.C: arbitrary placeholder hashes (not genuinely computed) do NOT pass -- sourcePlanHash/selectionHash/artifactHashes must be the real recomputed values", () => {
    const base = buildValidBundle();
    const freeze = JSON.parse(base.freezeJson);
    freeze.sourcePlanHash = "a".repeat(64);
    freeze.selectionHash = "a".repeat(64);
    freeze.artifactHashes["PILOT-RESULTS.json"] = "a".repeat(64);
    const bundle: PilotArtifactRawBundle = { ...base, freezeJson: JSON.stringify(freeze, null, 2) + "\n" };
    const result = validatePilotBundle(bundle, VALID_OPTIONS);
    expect(result.valid).toBe(false);
    expect(result.defects.some((d) => d.code === "SOURCE_PLAN_HASH_MISMATCH")).toBe(true);
    expect(result.defects.some((d) => d.code === "SELECTION_HASH_MISMATCH")).toBe(true);
    expect(result.defects.some((d) => d.code === "ARTIFACT_HASH_MISMATCH" && d.message.includes("PILOT-RESULTS.json"))).toBe(true);
  });

  it("§3.C: manifest/selection/freeze copies of sourcePlanHash/selectionHash that disagree with each other are all flagged", () => {
    const base = buildValidBundle();
    const manifest = JSON.parse(base.manifestJson);
    manifest.sourcePlanHash = "b".repeat(64);
    const bundle = { ...base, manifestJson: JSON.stringify(manifest, null, 2) + "\n" };
    const result = validatePilotBundle(bundle, VALID_OPTIONS);
    expect(result.valid).toBe(false);
    expect(result.defects.some((d) => d.code === "SOURCE_PLAN_HASH_MISMATCH" && d.message.includes("PILOT-RUN-MANIFEST.json"))).toBe(true);
  });

  it("§3.C: checks the sealed target pre/post hash against an explicit expected value when validatePilotDirectory receives one", () => {
    const pilotDir = path.join(repoRoot, "reports", "backtests", "unit202-blind-acquisition-run", "pilot-001");
    const targetPath = path.join(repoRoot, "reports", "backtests", "unit202-evidence-acquisition-benchmark", "UNIT202-BLIND-ACQUISITION-TARGETS.json");
    const result = validatePilotDirectory(pilotDir, { sealedTarget: { path: targetPath, expectedHash: "0000000000000000000000000000000000000000000000000000000000000000" } });
    expect(result.defects.some((d) => d.code === "SEALED_TARGET_HASH_MISMATCH")).toBe(true);
  });

  it("§3.D: rejects a fifth candidate for one requirement, exceeding the run's OWN declared policy cap", () => {
    const base = buildValidBundle();
    const searchLog = JSON.parse(base.searchLogJson);
    searchLog.entries[0].candidates = [1, 2, 3, 4, 5].map((n) => ({ candidateId: `SRC-${n}`, order: n, sourceRef: `https://example.edu/c${n}`, chosen: n === 1, reason: "considered", retrievalAttempted: n === 1 }));
    const bundle = reconcileFreezeAndManifest({ ...base, searchLogJson: JSON.stringify(searchLog, null, 2) + "\n" });
    const result = validatePilotBundle(bundle, VALID_OPTIONS);
    expect(result.valid).toBe(false);
    expect(result.defects.some((d) => d.code === "CANDIDATE_CAP_EXCEEDED")).toBe(true);
  });

  it("§3.D: rejects non-sequential/non-unique candidate order values", () => {
    const base = buildValidBundle();
    const searchLog = JSON.parse(base.searchLogJson);
    searchLog.entries[0].candidates[0].order = 3; // should be 1
    const bundle = reconcileFreezeAndManifest({ ...base, searchLogJson: JSON.stringify(searchLog, null, 2) + "\n" });
    const result = validatePilotBundle(bundle, VALID_OPTIONS);
    expect(result.valid).toBe(false);
    expect(result.defects.some((d) => d.code === "CANDIDATE_ORDER_NOT_SEQUENTIAL")).toBe(true);
  });

  it("§3.D: rejects a retrievalAttempted=true candidate with no matching retrieval entry", () => {
    const base = buildValidBundle();
    const retrievalLog = JSON.parse(base.retrievalLogJson);
    retrievalLog.entries = retrievalLog.entries.filter((e: { evidenceRequirementId: string }) => e.evidenceRequirementId !== FIXTURE_IDS[0]);
    const bundle = reconcileFreezeAndManifest({ ...base, retrievalLogJson: JSON.stringify(retrievalLog, null, 2) + "\n" });
    const result = validatePilotBundle(bundle, VALID_OPTIONS);
    expect(result.valid).toBe(false);
    expect(result.defects.some((d) => d.code === "RETRIEVAL_ATTEMPT_MISSING")).toBe(true);
  });

  it("§3.D: rejects a retrievalAttempted=false candidate that nonetheless has a retrieval entry", () => {
    const base = buildValidBundle();
    const searchLog = JSON.parse(base.searchLogJson);
    searchLog.entries[0].candidates.push({ candidateId: "SRC-2", order: 2, sourceRef: "https://example.edu/other", chosen: false, reason: "rejected, not attempted", retrievalAttempted: false });
    const retrievalLog = JSON.parse(base.retrievalLogJson);
    retrievalLog.entries.push(validRetrievalEntry(FIXTURE_IDS[0], "SRC-2", "REJECTED"));
    const bundle = reconcileFreezeAndManifest({ ...base, searchLogJson: JSON.stringify(searchLog, null, 2) + "\n", retrievalLogJson: JSON.stringify(retrievalLog, null, 2) + "\n" });
    const result = validatePilotBundle(bundle, VALID_OPTIONS);
    expect(result.valid).toBe(false);
    expect(result.defects.some((d) => d.code === "RETRIEVAL_ATTEMPT_INCONSISTENT")).toBe(true);
  });

  it("§3.D: rejects a retrieval entry missing the locator field", () => {
    const base = buildValidBundle();
    const retrievalLog = JSON.parse(base.retrievalLogJson);
    delete retrievalLog.entries[0].locator;
    const bundle = reconcileFreezeAndManifest({ ...base, retrievalLogJson: JSON.stringify(retrievalLog, null, 2) + "\n" });
    const result = validatePilotBundle(bundle, VALID_OPTIONS);
    expect(result.valid).toBe(false);
    expect(result.defects.some((d) => d.code === "RETRIEVAL_ENTRY_MISSING_FIELD" && d.message.includes("locator"))).toBe(true);
  });

  it("§3.D: rejects an accepted candidateSources entry with no matching chosen search candidate", () => {
    const base = buildValidBundle();
    const searchLog = JSON.parse(base.searchLogJson);
    searchLog.entries[0].candidates[0].chosen = false;
    const bundle = reconcileFreezeAndManifest({ ...base, searchLogJson: JSON.stringify(searchLog, null, 2) + "\n" });
    const result = validatePilotBundle(bundle, VALID_OPTIONS);
    expect(result.valid).toBe(false);
    expect(result.defects.some((d) => d.code === "CANDIDATE_SOURCE_NOT_CHOSEN")).toBe(true);
  });

  it("§3.D: rejects a chosen candidate that has neither an accepted result nor an explicit gap disposition", () => {
    const base = buildValidBundle();
    const retrievalLog = JSON.parse(base.retrievalLogJson);
    retrievalLog.entries[0].outcome = "REJECTED";
    retrievalLog.entries[0].rejectionReason = "did not pan out";
    const results = JSON.parse(base.resultsJson);
    results.results[0].result.candidateSources = [];
    results.results[0].result.normalizedClaims = [];
    results.results[0].result.verificationStatus = "SOURCE_GAP";
    results.results[0].result.unresolvedDimensions = ["DEFINITION"];
    results.results[0].result.coverageDimensionsSatisfied = [];
    results.results[0].result.gaps = []; // no explicit gap disposition -- the defect under test
    results.results[0].pilotAudit.claimDimensionBindings = [];
    const bundle = reconcileFreezeAndManifest({ ...base, retrievalLogJson: JSON.stringify(retrievalLog, null, 2) + "\n", resultsJson: JSON.stringify(results, null, 2) + "\n" });
    const result = validatePilotBundle(bundle, VALID_OPTIONS);
    expect(result.valid).toBe(false);
    expect(result.defects.some((d) => d.code === "CHOSEN_CANDIDATE_UNRESOLVED")).toBe(true);
  });

  it("§3.D: accepts a chosen candidate that was rejected on retrieval WHEN an explicit gap disposition is present", () => {
    const base = buildValidBundle();
    const retrievalLog = JSON.parse(base.retrievalLogJson);
    retrievalLog.entries[0].outcome = "REJECTED";
    retrievalLog.entries[0].rejectionReason = "did not pan out";
    const selection = JSON.parse(base.selectionJson);
    const results = JSON.parse(base.resultsJson);
    results.results[0].result.candidateSources = [];
    results.results[0].result.normalizedClaims = [];
    results.results[0].result.verificationStatus = "SOURCE_GAP";
    results.results[0].result.unresolvedDimensions = selection.requirements[0].requiredCoverageDimensions;
    results.results[0].result.coverageDimensionsSatisfied = [];
    results.results[0].result.gaps = [{ description: "no qualifying source found", reason: "candidate cap exhausted" }];
    results.results[0].pilotAudit.claimDimensionBindings = [];
    const bundle = reconcileFreezeAndManifest({ ...base, retrievalLogJson: JSON.stringify(retrievalLog, null, 2) + "\n", resultsJson: JSON.stringify(results, null, 2) + "\n" });
    const withReport: PilotArtifactRawBundle = { ...bundle, reportMarkdown: renderExpectedReportForBundle(bundle, FIXTURE_IDS) };
    const final = reconcileFreezeAndManifest(withReport);
    const result = validatePilotBundle(final, VALID_OPTIONS);
    expect(result.defects.some((d) => d.code === "CHOSEN_CANDIDATE_UNRESOLVED")).toBe(false);
  });

  it("§3.D: rejects manifest/retrieval timestamps that are invalid or out of logical order", () => {
    const base = buildValidBundle();
    const manifest = JSON.parse(base.manifestJson);
    manifest.acquisitionStartedAt = manifest.acquisitionEndedAt;
    manifest.acquisitionEndedAt = "2026-09-05T08:00:00.000Z"; // before start
    const bundle: PilotArtifactRawBundle = { ...base, manifestJson: JSON.stringify(manifest, null, 2) + "\n" };
    const result = validatePilotBundle(bundle, VALID_OPTIONS);
    expect(result.valid).toBe(false);
    expect(result.defects.some((d) => d.code === "TIMESTAMP_ORDERING_INVALID")).toBe(true);
  });

  it("rejects a source authority class not permitted by the requirement's declared policy (renamed from 'source-class laundering' to 'authority class not permitted' -- see §3.F)", () => {
    const base = buildValidBundle();
    const results = JSON.parse(base.resultsJson);
    results.results[0].result.candidateSources[0].authorityClass = "ORIGINAL_MANUFACTURER_OR_VENDOR"; // not in the fixture's permitted list
    const bundle = reconcileFreezeAndManifest({ ...base, resultsJson: JSON.stringify(results, null, 2) + "\n" });
    const result = validatePilotBundle(bundle, VALID_OPTIONS);
    expect(result.valid).toBe(false);
    const defect = result.defects.find((d) => d.code === "AUTHORITY_CLASS_NOT_PERMITTED");
    expect(defect).toBeDefined();
    // §3.F: the message must not overclaim -- it proves permission, not genuine class membership.
    expect(defect!.message).toContain("cannot and does not prove the source genuinely belongs");
  });

  it("rejects an incomplete coverage-dimension partition (a required dimension accounted for nowhere)", () => {
    const base = buildValidBundle();
    const selection = JSON.parse(base.selectionJson);
    selection.requirements[0].requiredCoverageDimensions = ["DEFINITION", "UNIT_SYMBOL"];
    const bundle = reconcileFreezeAndManifest({ ...base, selectionJson: JSON.stringify(selection, null, 2) + "\n" });
    const result = validatePilotBundle(bundle, VALID_OPTIONS);
    expect(result.valid).toBe(false);
    expect(result.defects.some((d) => d.code === "COVERAGE_PARTITION_INVALID")).toBe(true);
  });

  it("rejects a false 'no historical read' declaration (deviation disclosed but freeze does not structurally acknowledge it)", () => {
    const base = buildValidBundle();
    const manifest = JSON.parse(base.manifestJson);
    manifest.blindnessBoundary.deviationDisclosure.occurred = true;
    const bundle = reconcileFreezeAndManifest({ ...base, manifestJson: JSON.stringify(manifest, null, 2) + "\n" });
    const result = validatePilotBundle(bundle, VALID_OPTIONS);
    expect(result.valid).toBe(false);
    expect(result.defects.some((d) => d.code === "PROHIBITED_READ_DEVIATION_DISCLOSED")).toBe(true);
    expect(result.defects.some((d) => d.code === "DECLARATION_INCONSISTENCY")).toBe(true);
  });

  it("rejects any DENIED access outcome, unconditionally, with an honest (not process-wide) message", () => {
    const base = buildValidBundle();
    const accessAudit = JSON.parse(base.accessAuditJson);
    accessAudit.records.push({ canonicalPath: "scripts/backtests/unit202-reconciliation/x.ts", contentHash: null, reason: "demonstration", matchedRule: null, outcome: "DENIED", recordedAt: RETRIEVAL_TIMESTAMP });
    const bundle = reconcileFreezeAndManifest({ ...base, accessAuditJson: JSON.stringify(accessAudit, null, 2) + "\n" });
    const result = validatePilotBundle(bundle, VALID_OPTIONS);
    expect(result.valid).toBe(false);
    const defect = result.defects.find((d) => d.code === "DENIED_ACCESS_OUTCOME");
    expect(defect).toBeDefined();
    expect(defect!.message).toContain("process-wide proof");
  });

  it("§3.E: rejects a PILOT-REPORT.md that does not match the deterministic rendering of the frozen selection/results/retrieval data", () => {
    const base = buildValidBundle();
    const bundle: PilotArtifactRawBundle = { ...base, reportMarkdown: ["| ID | Status | Source |", "|---|---|---|", `| ${FIXTURE_IDS[0]} | VERIFIED | Example |`].join("\n") };
    const result = validatePilotBundle(bundle, VALID_OPTIONS);
    expect(result.valid).toBe(false);
    expect(result.defects.some((d) => d.code === "REPORT_DOES_NOT_MATCH_DETERMINISTIC_RENDERING")).toBe(true);
  });

  it("§3.E: a single mutated cell in an otherwise-correct report row is caught", () => {
    const base = buildValidBundle();
    const mutatedReport = base.reportMarkdown.replace("VERIFIED", "PARTIALLY_VERIFIED");
    const bundle: PilotArtifactRawBundle = { ...base, reportMarkdown: mutatedReport };
    const result = validatePilotBundle(bundle, VALID_OPTIONS);
    expect(result.valid).toBe(false);
    expect(result.defects.some((d) => d.code === "REPORT_DOES_NOT_MATCH_DETERMINISTIC_RENDERING")).toBe(true);
  });

  it("read-only run against the real, frozen pilot-001 returns INVALID and lists genuine defects only -- pilot-001 is never modified", () => {
    const pilotDir = path.join(repoRoot, "reports", "backtests", "unit202-blind-acquisition-run", "pilot-001");
    const result = validatePilotDirectory(pilotDir);
    expect(result.valid).toBe(false);
    expect(result.defects.length).toBeGreaterThan(0);
    const codes = new Set(result.defects.map((d) => d.code));
    // Genuine, mechanically-verified defects the corrected validator finds
    // in the real pilot-001 artifacts.
    expect(codes.has("PROHIBITED_READ_DEVIATION_DISCLOSED")).toBe(true);
    expect(codes.has("DENIED_ACCESS_OUTCOME")).toBe(true);
    expect(codes.has("MANIFEST_MISSING_FIELD")).toBe(true);
    expect(codes.has("FREEZE_MISSING_FIELD")).toBe(true);
    expect(codes.has("SOURCE_PLAN_HASH_MISMATCH")).toBe(true);
    expect(codes.has("SELECTION_HASH_MISMATCH")).toBe(true);
    expect(codes.has("REPORT_DOES_NOT_MATCH_DETERMINISTIC_RENDERING")).toBe(true);
    // The retracted duplicate-key allegation: correctly finds NONE, because
    // there genuinely is none in the real file (see CC-24-PILOT-001-PA-REVIEW.md's
    // "Retracted observation").
    expect(result.defects.filter((d) => d.code === "DUPLICATE_JSON_KEY" && d.message.includes("PILOT-RESULTS.json"))).toEqual([]);
  });
});
