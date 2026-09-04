/**
 * CC-24 PA-review correction §3 (further corrected in a follow-up pass):
 * synthetic valid/invalid fixture tests for the pilot-artifact
 * validator, plus the required read-only run against the real, frozen
 * pilot-001 -- which MUST come back INVALID, reporting only defects
 * genuinely present in the repository files. Pilot-001 is never
 * modified by these tests (validatePilotDirectory only calls
 * readFileSync).
 *
 * The valid fixture computes every hash via the SAME `hashContent`
 * function the validator itself uses -- never an arbitrary placeholder
 * like `"a".repeat(64)`. This pass adds: the fixed external pilot-002
 * policy contract, structured/ordered search-query records, and
 * value-level retrieval/results cross-checks plus verification-status
 * coherence.
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

  const searchLog = {
    entries: FIXTURE_IDS.map((id) => ({
      evidenceRequirementId: id,
      queries: [{ queryId: "Q1", order: 1, queryText: "a query" }],
      candidates: [{ candidateId: "SRC-1", order: 1, sourceRef: "https://example.edu/page", chosen: true, reason: "on-point", retrievalAttempted: true }],
    })),
  };
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

/** Rebuilds only the report from whatever results/search/retrieval the bundle currently has, then reconciles freeze/manifest hashes -- for tests that legitimately change result data and need a self-consistent bundle afterward. */
function reconcileReportFreezeAndManifest(bundle: PilotArtifactRawBundle): PilotArtifactRawBundle {
  const withReport: PilotArtifactRawBundle = { ...bundle, reportMarkdown: renderExpectedReportForBundle(bundle, FIXTURE_IDS) };
  return reconcileFreezeAndManifest(withReport);
}

describe("CC-24 PA-review correction §3 -- pilot-artifact validator", () => {
  it("accepts a fully-conforming, genuinely-hashed synthetic fixture as VALID", () => {
    const result = validatePilotBundle(buildValidBundle(), VALID_OPTIONS);
    expect(result.defects).toEqual([]);
    expect(result.valid).toBe(true);
  });

  it("§3.A: rejects a manifest declaring maxCandidateSourcesPerRequirement = 100 (must be exactly 4)", () => {
    const base = buildValidBundle();
    const manifest = JSON.parse(base.manifestJson);
    manifest.acquisitionPolicy.maxCandidateSourcesPerRequirement = 100;
    const bundle = reconcileFreezeAndManifest({ ...base, manifestJson: JSON.stringify(manifest, null, 2) + "\n" });
    const result = validatePilotBundle(bundle, VALID_OPTIONS);
    expect(result.valid).toBe(false);
    expect(result.defects.some((d) => d.code === "MANIFEST_POLICY_MISMATCH" && d.message.includes("maxCandidateSourcesPerRequirement"))).toBe(true);
  });

  it("§3.A: rejects a manifest declaring allowLiveWebResearch = false", () => {
    const base = buildValidBundle();
    const manifest = JSON.parse(base.manifestJson);
    manifest.acquisitionPolicy.allowLiveWebResearch = false;
    const bundle = reconcileFreezeAndManifest({ ...base, manifestJson: JSON.stringify(manifest, null, 2) + "\n" });
    const result = validatePilotBundle(bundle, VALID_OPTIONS);
    expect(result.valid).toBe(false);
    expect(result.defects.some((d) => d.code === "MANIFEST_POLICY_MISMATCH" && d.message.includes("allowLiveWebResearch"))).toBe(true);
  });

  it("§3.A: rejects a manifest declaring requireExactLocator = false", () => {
    const base = buildValidBundle();
    const manifest = JSON.parse(base.manifestJson);
    manifest.acquisitionPolicy.requireExactLocator = false;
    const bundle = reconcileFreezeAndManifest({ ...base, manifestJson: JSON.stringify(manifest, null, 2) + "\n" });
    const result = validatePilotBundle(bundle, VALID_OPTIONS);
    expect(result.valid).toBe(false);
    expect(result.defects.some((d) => d.code === "MANIFEST_POLICY_MISMATCH" && d.message.includes("requireExactLocator"))).toBe(true);
  });

  it("§3.A: a manifest declaring a fractional or zero cap also fails (the validator never trusts the manifest's own value)", () => {
    for (const badCap of [0, 0.5, 5, "4"]) {
      const base = buildValidBundle();
      const manifest = JSON.parse(base.manifestJson);
      manifest.acquisitionPolicy.maxCandidateSourcesPerRequirement = badCap;
      const bundle = reconcileFreezeAndManifest({ ...base, manifestJson: JSON.stringify(manifest, null, 2) + "\n" });
      const result = validatePilotBundle(bundle, VALID_OPTIONS);
      expect(result.valid, `cap ${JSON.stringify(badCap)} must fail`).toBe(false);
    }
  });

  it("§3.A: strict JSON grammar (delegated to native JSON.parse) and duplicate-key detection still fail as before", () => {
    const bundle: PilotArtifactRawBundle = { ...buildValidBundle(), accessAuditJson: '{"records":[{"outcome":01}]}' };
    const result = validatePilotBundle(bundle, VALID_OPTIONS);
    expect(result.valid).toBe(false);
    expect(result.defects.some((d) => d.code === "JSON_SYNTAX_ERROR")).toBe(true);
  });

  it("§3.B: rejects an absent query collection", () => {
    const base = buildValidBundle();
    const searchLog = JSON.parse(base.searchLogJson);
    searchLog.entries[0].queries = [];
    const bundle = reconcileFreezeAndManifest({ ...base, searchLogJson: JSON.stringify(searchLog, null, 2) + "\n" });
    const result = validatePilotBundle(bundle, VALID_OPTIONS);
    expect(result.valid).toBe(false);
    expect(result.defects.some((d) => d.code === "SEARCH_QUERIES_MISSING")).toBe(true);
  });

  it("§3.B: rejects a string-only query array", () => {
    const base = buildValidBundle();
    const searchLog = JSON.parse(base.searchLogJson);
    searchLog.entries[0].queries = ["a bare string query"];
    const bundle = reconcileFreezeAndManifest({ ...base, searchLogJson: JSON.stringify(searchLog, null, 2) + "\n" });
    const result = validatePilotBundle(bundle, VALID_OPTIONS);
    expect(result.valid).toBe(false);
    expect(result.defects.some((d) => d.code === "SEARCH_QUERIES_STRING_ONLY")).toBe(true);
  });

  it("§3.B: rejects a duplicate query order", () => {
    const base = buildValidBundle();
    const searchLog = JSON.parse(base.searchLogJson);
    searchLog.entries[0].queries = [
      { queryId: "Q1", order: 1, queryText: "first" },
      { queryId: "Q2", order: 1, queryText: "second" },
    ];
    const bundle = reconcileFreezeAndManifest({ ...base, searchLogJson: JSON.stringify(searchLog, null, 2) + "\n" });
    const result = validatePilotBundle(bundle, VALID_OPTIONS);
    expect(result.valid).toBe(false);
    expect(result.defects.some((d) => d.code === "SEARCH_QUERY_ORDER_INVALID")).toBe(true);
  });

  it("§3.B: rejects a gapped query order", () => {
    const base = buildValidBundle();
    const searchLog = JSON.parse(base.searchLogJson);
    searchLog.entries[0].queries = [
      { queryId: "Q1", order: 1, queryText: "first" },
      { queryId: "Q2", order: 3, queryText: "second" },
    ];
    const bundle = reconcileFreezeAndManifest({ ...base, searchLogJson: JSON.stringify(searchLog, null, 2) + "\n" });
    const result = validatePilotBundle(bundle, VALID_OPTIONS);
    expect(result.valid).toBe(false);
    expect(result.defects.some((d) => d.code === "SEARCH_QUERY_ORDER_INVALID")).toBe(true);
  });

  it("§3.B: rejects a fifth candidate for one requirement (candidate cap exceeded, fixed at 4)", () => {
    const base = buildValidBundle();
    const searchLog = JSON.parse(base.searchLogJson);
    searchLog.entries[0].candidates = [1, 2, 3, 4, 5].map((n) => ({ candidateId: `SRC-${n}`, order: n, sourceRef: `https://example.edu/c${n}`, chosen: n === 1, reason: "considered", retrievalAttempted: n === 1 }));
    const bundle = reconcileFreezeAndManifest({ ...base, searchLogJson: JSON.stringify(searchLog, null, 2) + "\n" });
    const result = validatePilotBundle(bundle, VALID_OPTIONS);
    expect(result.valid).toBe(false);
    expect(result.defects.some((d) => d.code === "CANDIDATE_CAP_EXCEEDED")).toBe(true);
  });

  it("§3.C: rejects a retrieval/result authority-class mismatch (a result relabeling a retrieval entry into a different class)", () => {
    const base = buildValidBundle();
    const results = JSON.parse(base.resultsJson);
    results.results[0].result.candidateSources[0].authorityClass = "AUTHORITATIVE_TECHNICAL_REFERENCE"; // differs from the retrieval entry's ACADEMIC_OR_RESEARCH_INSTITUTION
    const bundle = reconcileReportFreezeAndManifest({ ...base, resultsJson: JSON.stringify(results, null, 2) + "\n" });
    const result = validatePilotBundle(bundle, VALID_OPTIONS);
    expect(result.valid).toBe(false);
    expect(result.defects.some((d) => d.code === "RETRIEVAL_RESULT_VALUE_MISMATCH" && d.message.includes("authorityClass"))).toBe(true);
  });

  it("§3.C: rejects a retrieval/result locator mismatch", () => {
    const base = buildValidBundle();
    const results = JSON.parse(base.resultsJson);
    results.results[0].result.candidateSources[0].sourceLocator = "HTML; a different heading entirely";
    const bundle = reconcileReportFreezeAndManifest({ ...base, resultsJson: JSON.stringify(results, null, 2) + "\n" });
    const result = validatePilotBundle(bundle, VALID_OPTIONS);
    expect(result.valid).toBe(false);
    expect(result.defects.some((d) => d.code === "RETRIEVAL_RESULT_VALUE_MISMATCH" && d.message.includes("locator"))).toBe(true);
  });

  it("§3.C: rejects a retrieval/result bounded-passage mismatch", () => {
    const base = buildValidBundle();
    const results = JSON.parse(base.resultsJson);
    results.results[0].result.candidateSources[0].retrievedPassage = "A completely different passage.";
    const bundle = reconcileReportFreezeAndManifest({ ...base, resultsJson: JSON.stringify(results, null, 2) + "\n" });
    const result = validatePilotBundle(bundle, VALID_OPTIONS);
    expect(result.valid).toBe(false);
    expect(result.defects.some((d) => d.code === "RETRIEVAL_RESULT_VALUE_MISMATCH" && d.message.includes("bounded passage"))).toBe(true);
  });

  it("§3.C: rejects an ACCEPTED retrieval entry omitted from the accepted results", () => {
    const base = buildValidBundle();
    const results = JSON.parse(base.resultsJson);
    results.results[0].result.candidateSources = [];
    results.results[0].result.normalizedClaims = [];
    results.results[0].result.verificationStatus = "SOURCE_GAP";
    results.results[0].result.coverageDimensionsSatisfied = [];
    results.results[0].result.unresolvedDimensions = ["DEFINITION"];
    results.results[0].result.gaps = [{ description: "omitted despite an ACCEPTED retrieval", reason: "test" }];
    results.results[0].pilotAudit.claimDimensionBindings = [];
    // The retrieval log still says ACCEPTED for SRC-1 -- that's the defect under test.
    const bundle = reconcileReportFreezeAndManifest({ ...base, resultsJson: JSON.stringify(results, null, 2) + "\n" });
    const result = validatePilotBundle(bundle, VALID_OPTIONS);
    expect(result.valid).toBe(false);
    expect(result.defects.some((d) => d.code === "RETRIEVAL_ACCEPTED_NOT_REPRESENTED_IN_RESULTS")).toBe(true);
  });

  it("§3.C: rejects a claim-dimension binding whose claimText does not match the referenced normalized claim", () => {
    const base = buildValidBundle();
    const results = JSON.parse(base.resultsJson);
    results.results[0].pilotAudit.claimDimensionBindings[0].claimText = "A different claim entirely.";
    const bundle = reconcileReportFreezeAndManifest({ ...base, resultsJson: JSON.stringify(results, null, 2) + "\n" });
    const result = validatePilotBundle(bundle, VALID_OPTIONS);
    expect(result.valid).toBe(false);
    expect(result.defects.some((d) => d.code === "CLAIM_BINDING_TEXT_MISMATCH")).toBe(true);
  });

  it("§3.C: rejects a duplicate dimension binding (the same dimension bound twice)", () => {
    const base = buildValidBundle();
    const results = JSON.parse(base.resultsJson);
    results.results[0].pilotAudit.claimDimensionBindings.push({ claimText: "The definition.", sourceId: "SRC-1", dimensions: ["DEFINITION"] });
    const bundle = reconcileReportFreezeAndManifest({ ...base, resultsJson: JSON.stringify(results, null, 2) + "\n" });
    const result = validatePilotBundle(bundle, VALID_OPTIONS);
    expect(result.valid).toBe(false);
    expect(result.defects.some((d) => d.code === "DUPLICATE_DIMENSION_BINDING")).toBe(true);
  });

  it("§3.C: rejects a binding to a dimension that is not satisfied (unresolved or non-required)", () => {
    const base = buildValidBundle();
    const selection = JSON.parse(base.selectionJson);
    selection.requirements[0].requiredCoverageDimensions = ["DEFINITION", "UNIT_SYMBOL"];
    const results = JSON.parse(base.resultsJson);
    results.results[0].result.unresolvedDimensions = ["UNIT_SYMBOL"];
    results.results[0].pilotAudit.claimDimensionBindings.push({ claimText: "The definition.", sourceId: "SRC-1", dimensions: ["UNIT_SYMBOL"] }); // bound, but UNIT_SYMBOL is unresolved, not satisfied
    const bundle = reconcileReportFreezeAndManifest({ ...base, selectionJson: JSON.stringify(selection, null, 2) + "\n", resultsJson: JSON.stringify(results, null, 2) + "\n" });
    const result = validatePilotBundle(bundle, VALID_OPTIONS);
    expect(result.valid).toBe(false);
    expect(result.defects.some((d) => d.code === "BINDING_TO_INVALID_DIMENSION")).toBe(true);
  });

  it("§3.D: rejects VERIFIED with an unresolved dimension", () => {
    const base = buildValidBundle();
    const selection = JSON.parse(base.selectionJson);
    selection.requirements[0].requiredCoverageDimensions = ["DEFINITION", "UNIT_SYMBOL"];
    const results = JSON.parse(base.resultsJson);
    results.results[0].result.unresolvedDimensions = ["UNIT_SYMBOL"]; // still VERIFIED, which is incoherent
    const bundle = reconcileReportFreezeAndManifest({ ...base, selectionJson: JSON.stringify(selection, null, 2) + "\n", resultsJson: JSON.stringify(results, null, 2) + "\n" });
    const result = validatePilotBundle(bundle, VALID_OPTIONS);
    expect(result.valid).toBe(false);
    expect(result.defects.some((d) => d.code === "VERIFICATION_STATUS_INCOHERENT" && d.message.includes("VERIFIED"))).toBe(true);
  });

  it("§3.D: rejects VERIFIED with no accepted evidence", () => {
    const base = buildValidBundle();
    const results = JSON.parse(base.resultsJson);
    results.results[0].result.candidateSources = [];
    results.results[0].result.normalizedClaims = [];
    results.results[0].pilotAudit.claimDimensionBindings = [];
    // verificationStatus stays VERIFIED -- incoherent with zero evidence.
    const bundle = reconcileReportFreezeAndManifest({ ...base, resultsJson: JSON.stringify(results, null, 2) + "\n" });
    const result = validatePilotBundle(bundle, VALID_OPTIONS);
    expect(result.valid).toBe(false);
    expect(result.defects.some((d) => d.code === "VERIFICATION_STATUS_INCOHERENT" && d.message.includes("VERIFIED"))).toBe(true);
  });

  it("§3.D: rejects SOURCE_GAP with satisfied dimensions or claims present", () => {
    const base = buildValidBundle();
    const results = JSON.parse(base.resultsJson);
    results.results[0].result.verificationStatus = "SOURCE_GAP"; // but candidateSources/normalizedClaims/coverageDimensionsSatisfied are still populated
    const bundle = reconcileReportFreezeAndManifest({ ...base, resultsJson: JSON.stringify(results, null, 2) + "\n" });
    const result = validatePilotBundle(bundle, VALID_OPTIONS);
    expect(result.valid).toBe(false);
    expect(result.defects.some((d) => d.code === "VERIFICATION_STATUS_INCOHERENT" && d.message.includes("SOURCE_GAP"))).toBe(true);
  });

  it("§3.D: rejects PARTIALLY_VERIFIED without both sides of the partition", () => {
    const base = buildValidBundle();
    const results = JSON.parse(base.resultsJson);
    results.results[0].result.verificationStatus = "PARTIALLY_VERIFIED"; // unresolvedDimensions is still [] -- only one side present
    const bundle = reconcileReportFreezeAndManifest({ ...base, resultsJson: JSON.stringify(results, null, 2) + "\n" });
    const result = validatePilotBundle(bundle, VALID_OPTIONS);
    expect(result.valid).toBe(false);
    expect(result.defects.some((d) => d.code === "VERIFICATION_STATUS_INCOHERENT" && d.message.includes("PARTIALLY_VERIFIED"))).toBe(true);
  });

  it("§3.D: rejects CONFLICTED without a structured conflict", () => {
    const base = buildValidBundle();
    const results = JSON.parse(base.resultsJson);
    results.results[0].result.verificationStatus = "CONFLICTED"; // conflicts stays [] -- no structured conflict at all
    const bundle = reconcileReportFreezeAndManifest({ ...base, resultsJson: JSON.stringify(results, null, 2) + "\n" });
    const result = validatePilotBundle(bundle, VALID_OPTIONS);
    expect(result.valid).toBe(false);
    expect(result.defects.some((d) => d.code === "VERIFICATION_STATUS_INCOHERENT" && d.message.includes("CONFLICTED"))).toBe(true);
  });

  it("§3.D: rejects NOT_ATTEMPTED unconditionally for a completed pilot", () => {
    const base = buildValidBundle();
    const results = JSON.parse(base.resultsJson);
    results.results[0].result.verificationStatus = "NOT_ATTEMPTED";
    const bundle = reconcileReportFreezeAndManifest({ ...base, resultsJson: JSON.stringify(results, null, 2) + "\n" });
    const result = validatePilotBundle(bundle, VALID_OPTIONS);
    expect(result.valid).toBe(false);
    expect(result.defects.some((d) => d.code === "VERIFICATION_STATUS_INCOHERENT" && d.message.includes("NOT_ATTEMPTED"))).toBe(true);
  });

  it("§3.D: rejects a malformed/unknown verificationStatus value", () => {
    const base = buildValidBundle();
    const results = JSON.parse(base.resultsJson);
    results.results[0].result.verificationStatus = "TOTALLY_CONFIRMED";
    const bundle = reconcileReportFreezeAndManifest({ ...base, resultsJson: JSON.stringify(results, null, 2) + "\n" });
    const result = validatePilotBundle(bundle, VALID_OPTIONS);
    expect(result.valid).toBe(false);
    expect(result.defects.some((d) => d.code === "VERIFICATION_STATUS_UNKNOWN")).toBe(true);
  });

  it("accepts a genuinely coherent CONFLICTED result (two conflicting normalized claims, an explicit conflict record)", () => {
    const base = buildValidBundle();
    const searchLog = JSON.parse(base.searchLogJson);
    searchLog.entries[0].candidates.push({ candidateId: "SRC-2", order: 2, sourceRef: "https://example.edu/other", chosen: true, reason: "conflicting source", retrievalAttempted: true });
    const retrievalLog = JSON.parse(base.retrievalLogJson);
    retrievalLog.entries.push(validRetrievalEntry(FIXTURE_IDS[0], "SRC-2"));
    const results = JSON.parse(base.resultsJson);
    results.results[0].result.candidateSources.push({ sourceId: "SRC-2", authorityClass: "ACADEMIC_OR_RESEARCH_INSTITUTION", sourceRef: "https://example.edu/page", sourceLocator: "HTML; heading X", retrievedPassage: "The definition sentence." });
    results.results[0].result.normalizedClaims.push({ claimText: "A conflicting definition.", sourceId: "SRC-2" });
    results.results[0].result.verificationStatus = "CONFLICTED";
    results.results[0].result.conflicts = [{ description: "Two sources disagree.", conflictingClaims: [{ claimText: "The definition.", sourceId: "SRC-1" }, { claimText: "A conflicting definition.", sourceId: "SRC-2" }] }];
    const bundle = reconcileReportFreezeAndManifest({ ...base, searchLogJson: JSON.stringify(searchLog, null, 2) + "\n", retrievalLogJson: JSON.stringify(retrievalLog, null, 2) + "\n", resultsJson: JSON.stringify(results, null, 2) + "\n" });
    const result = validatePilotBundle(bundle, VALID_OPTIONS);
    expect(result.defects.filter((d) => d.code === "VERIFICATION_STATUS_INCOHERENT")).toEqual([]);
  });

  it("keeps guardrail honesty documentation intact: authority-class-permitted proves permission only, never genuine class membership", () => {
    const base = buildValidBundle();
    const results = JSON.parse(base.resultsJson);
    results.results[0].result.candidateSources[0].authorityClass = "ORIGINAL_MANUFACTURER_OR_VENDOR"; // not in the fixture's permitted list
    const retrievalLog = JSON.parse(base.retrievalLogJson);
    retrievalLog.entries[0].authorityClass = "ORIGINAL_MANUFACTURER_OR_VENDOR"; // keep result/retrieval consistent so only the permission check fires
    const bundle = reconcileReportFreezeAndManifest({ ...base, retrievalLogJson: JSON.stringify(retrievalLog, null, 2) + "\n", resultsJson: JSON.stringify(results, null, 2) + "\n" });
    const result = validatePilotBundle(bundle, VALID_OPTIONS);
    expect(result.valid).toBe(false);
    const defect = result.defects.find((d) => d.code === "AUTHORITY_CLASS_NOT_PERMITTED");
    expect(defect).toBeDefined();
    expect(defect!.message).toContain("cannot and does not prove the source genuinely belongs");
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

  it("§3.C: a single-byte mutation to PILOT-RESULTS.json (after freeze) makes validation fail with a hash-mismatch defect", () => {
    const base = buildValidBundle();
    const mutated = base.resultsJson.replace('"VERIFIED"', '"VERIFIEE"');
    const bundle: PilotArtifactRawBundle = { ...base, resultsJson: mutated };
    const result = validatePilotBundle(bundle, VALID_OPTIONS);
    expect(result.valid).toBe(false);
    expect(result.defects.some((d) => d.code === "ARTIFACT_HASH_MISMATCH" && d.message.includes("PILOT-RESULTS.json"))).toBe(true);
  });

  it("§3.C: arbitrary placeholder hashes (not genuinely computed) do NOT pass", () => {
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

  it("rejects a selection/search-log/results ID set that does not exactly match the expected IDs", () => {
    const base = buildValidBundle();
    const selection = JSON.parse(base.selectionJson);
    selection.requirements.push(validSelectionRequirement(FIXTURE_IDS[0]));
    selection.requirements = selection.requirements.filter((r: { evidenceRequirementId: string }) => r.evidenceRequirementId !== FIXTURE_IDS[1]);
    selection.requirements.push(validSelectionRequirement("ER::test::unexpected::EXACT_FACT"));
    const bundle = reconcileFreezeAndManifest({ ...base, selectionJson: JSON.stringify(selection, null, 2) + "\n" });
    const result = validatePilotBundle(bundle, VALID_OPTIONS);
    expect(result.valid).toBe(false);
    expect(result.defects.some((d) => d.code === "DUPLICATE_REQUIREMENT_ID")).toBe(true);
    expect(result.defects.filter((d) => d.code === "REQUIREMENT_SET_MISMATCH" && d.message.includes("PILOT-SELECTION.json")).length).toBeGreaterThanOrEqual(2);
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

  it("§3.E: rejects a PILOT-REPORT.md that does not match the deterministic rendering of the frozen selection/results/retrieval data", () => {
    const base = buildValidBundle();
    const bundle: PilotArtifactRawBundle = { ...base, reportMarkdown: ["| ID | Status | Source |", "|---|---|---|", `| ${FIXTURE_IDS[0]} | VERIFIED | Example |`].join("\n") };
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
    expect(codes.has("PROHIBITED_READ_DEVIATION_DISCLOSED")).toBe(true);
    expect(codes.has("DENIED_ACCESS_OUTCOME")).toBe(true);
    expect(codes.has("MANIFEST_MISSING_FIELD")).toBe(true);
    expect(codes.has("FREEZE_MISSING_FIELD")).toBe(true);
    expect(codes.has("SOURCE_PLAN_HASH_MISMATCH")).toBe(true);
    expect(codes.has("SELECTION_HASH_MISMATCH")).toBe(true);
    expect(codes.has("REPORT_DOES_NOT_MATCH_DETERMINISTIC_RENDERING")).toBe(true);
    // The retracted duplicate-key allegation: correctly finds NONE.
    expect(result.defects.filter((d) => d.code === "DUPLICATE_JSON_KEY" && d.message.includes("PILOT-RESULTS.json"))).toEqual([]);
  });
});
