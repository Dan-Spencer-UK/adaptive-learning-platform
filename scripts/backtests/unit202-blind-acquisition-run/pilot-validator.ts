/**
 * CC-24 PA-review correction §3: a narrow PILOT EXECUTION GATE -- not a
 * redesign of the generic `@alp/technical-evidence-engine` contract, and
 * not itself an acquisition tool.
 *
 * [Corrected] The prior version of this validator proved artifact SHAPE
 * (required fields present, counts within a cap read from an option
 * default, header words present in a report) without proving VALUES --
 * it never recomputed a single hash, never cross-checked a chosen
 * candidate against an actual retrieval outcome, and accepted a report
 * whose content merely LOOKED complete. This version proves values:
 * every frozen artifact's SHA-256 is recomputed from its actual raw
 * bytes (via the SAME `hashContent` function the pilot's own producer
 * scripts use -- `pilot-guard.ts`/`freeze-selection.ts` -- so producer
 * and validator can never silently disagree on what "the hash" means);
 * `sourcePlanHash`/`selectionHash` are recomputed from the actual
 * clean-plan/selection bytes and cross-checked across manifest, freeze,
 * and the selection payload's own embedded copy; the candidate cap is
 * read from the run's OWN declared acquisition policy, not a validator
 * default; every accepted source is traced through a specific, declared
 * search candidate to a specific, ACCEPTED retrieval entry; and
 * `PILOT-REPORT.md` is checked against a report DETERMINISTICALLY
 * RENDERED from the frozen selection/results/retrieval data, not merely
 * scanned for header words and a row count.
 *
 * Two honesty notes this validator does NOT overclaim past (task §3.F):
 *   - Mechanical validation can prove a DECLARED authority class is
 *     PERMITTED by a requirement's policy. It cannot prove the real
 *     publisher/source genuinely belongs to that class, that a claim is
 *     actually supported by its cited passage, that scope is contained
 *     to what the requirement asks, or that the depth is learner-
 *     appropriate. Publisher identity, source classification, claim
 *     support, scope containment, and learner depth remain MANDATORY
 *     Project-Architect semantic-review gates this validator cannot and
 *     does not substitute for.
 *   - `LocalAccessGuard` (and this validator's own DENIED-outcome check)
 *     can only prove that reads ROUTED THROUGH the guard were correctly
 *     authorized or denied. Neither the guard nor this validator is
 *     process-wide proof that no other code path performed an unguarded
 *     read (see `access-guard.ts`'s own doc comment on this exact
 *     limit, and `CC-24-PILOT-001-PA-REVIEW.md` defect 1/11, which is
 *     precisely a read that bypassed the guard entirely).
 *
 * `validatePilotBundle` operates on already-loaded raw file text (so
 * tests can exercise it against small synthetic fixtures without
 * touching disk, using the SAME `hashContent` function to compute
 * genuinely-correct expected hashes rather than arbitrary placeholder
 * strings); `validatePilotDirectory` is a thin disk-reading wrapper used
 * for the real pilot-001 read-only check, optionally also verifying the
 * sealed blind-target manifest's pre/post hash against an explicit
 * expected value.
 */
import { readFileSync } from "node:fs";
import path from "node:path";

import { hashContent, type CoverageDimension, type SourceAuthorityClass } from "@alp/technical-evidence-engine";

import { SELECTED_EVIDENCE_REQUIREMENT_IDS } from "./pilot-selection.ts";
import { DuplicateJsonKeyError, StrictJsonSyntaxError, parseStrictJson } from "./strict-json.ts";

export type ValidationSeverity = "ERROR";

export interface ValidationDefect {
  readonly code: string;
  readonly severity: ValidationSeverity;
  readonly message: string;
}

export interface PilotValidationResult {
  readonly valid: boolean;
  readonly defects: readonly ValidationDefect[];
}

export interface PilotArtifactRawBundle {
  readonly cleanPlanJson: string;
  readonly selectionJson: string;
  readonly manifestJson: string;
  readonly searchLogJson: string;
  readonly retrievalLogJson: string;
  readonly resultsJson: string;
  readonly accessAuditJson: string;
  readonly reportMarkdown: string;
  readonly freezeJson: string;
}

export interface SealedTargetCheck {
  readonly path: string;
  readonly expectedHash: string;
}

export interface PilotValidationOptions {
  readonly expectedRequirementIds?: readonly string[];
  /** Fallback candidate cap ONLY when the manifest's own acquisitionPolicy.maxCandidateSourcesPerRequirement cannot be read -- the real check always prefers the run's OWN declared policy (task §3.D: "no more than the declared policy cap"). */
  readonly fallbackMaxCandidatesPerRequirement?: number;
  readonly requiredFreezeArtifactNames?: readonly string[];
  readonly sealedTarget?: SealedTargetCheck;
}

const DEFAULT_FALLBACK_MAX_CANDIDATES = 4;
const DEFAULT_REQUIRED_FREEZE_ARTIFACTS = ["PILOT-CLEAN-PLAN.json", "PILOT-SELECTION.json", "PILOT-RUN-MANIFEST.json", "PILOT-SEARCH-LOG.json", "PILOT-RETRIEVAL-LOG.json", "PILOT-RESULTS.json", "PILOT-ACCESS-AUDIT.json", "PILOT-REPORT.md"];

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}
function isArray(v: unknown): v is unknown[] {
  return Array.isArray(v);
}
function isString(v: unknown): v is string {
  return typeof v === "string";
}
function isNonEmptyString(v: unknown): v is string {
  return typeof v === "string" && v.trim().length > 0;
}
function isBoolean(v: unknown): v is boolean {
  return typeof v === "boolean";
}
function isNumber(v: unknown): v is number {
  return typeof v === "number" && Number.isFinite(v);
}
function isValidIsoTimestamp(v: unknown): v is string {
  return isString(v) && !Number.isNaN(Date.parse(v));
}

function getPath(obj: unknown, dotPath: string): unknown {
  let cur = obj;
  for (const seg of dotPath.split(".")) {
    if (!isRecord(cur)) return undefined;
    cur = cur[seg];
  }
  return cur;
}

function strictParseOrDefect(defects: ValidationDefect[], fileLabel: string, raw: string): unknown {
  try {
    return parseStrictJson(raw);
  } catch (err) {
    if (err instanceof DuplicateJsonKeyError) {
      defects.push({ code: "DUPLICATE_JSON_KEY", severity: "ERROR", message: `${fileLabel}: ${err.message}` });
      return undefined;
    }
    if (err instanceof StrictJsonSyntaxError) {
      defects.push({ code: "JSON_SYNTAX_ERROR", severity: "ERROR", message: `${fileLabel}: ${err.message}` });
      return undefined;
    }
    defects.push({ code: "JSON_PARSE_ERROR", severity: "ERROR", message: `${fileLabel}: ${err instanceof Error ? err.message : String(err)}` });
    return undefined;
  }
}

// ---------------------------------------------------------------------
// §3.B: exact ID-set checks, generalized across the three collections
// that must each carry exactly one entry per expected requirement ID.
// ---------------------------------------------------------------------

function checkExactIdSet(defects: ValidationDefect[], label: string, ids: readonly string[], expectedIds: readonly string[]): void {
  const counts = new Map<string, number>();
  for (const id of ids) counts.set(id, (counts.get(id) ?? 0) + 1);
  for (const [id, count] of counts) {
    if (count > 1) defects.push({ code: "DUPLICATE_REQUIREMENT_ID", severity: "ERROR", message: `${label}: evidenceRequirementId "${id}" occurs ${count} times, expected exactly once.` });
  }
  const expectedSet = new Set(expectedIds);
  const missing = expectedIds.filter((id) => !counts.has(id));
  const extra = [...counts.keys()].filter((id) => !expectedSet.has(id));
  if (missing.length > 0) defects.push({ code: "REQUIREMENT_SET_MISMATCH", severity: "ERROR", message: `${label}: missing ${missing.length} expected requirement ID(s): ${missing.join(", ")}` });
  if (extra.length > 0) defects.push({ code: "REQUIREMENT_SET_MISMATCH", severity: "ERROR", message: `${label}: contains ${extra.length} unexpected requirement ID(s): ${extra.join(", ")}` });
}

function extractIds(collection: unknown, arrayField: string, idField = "evidenceRequirementId"): string[] {
  const arr = isRecord(collection) ? collection[arrayField] : undefined;
  if (!isArray(arr)) return [];
  return arr.filter((e): e is Record<string, unknown> => isRecord(e) && isString(e[idField])).map((e) => e[idField] as string);
}

// ---------------------------------------------------------------------
// §3.C: real integrity verification -- every hash recomputed from actual
// bytes via the SAME `hashContent` function the pilot's own producer
// scripts use, never trusted from a self-reported field alone.
// ---------------------------------------------------------------------

function checkHashIntegrity(defects: ValidationDefect[], bundle: PilotArtifactRawBundle, manifest: unknown, freeze: unknown, selection: unknown): void {
  const actualCleanPlanHash = hashContent(bundle.cleanPlanJson);
  const actualSelectionHash = hashContent(bundle.selectionJson);

  const claimedSourcePlanHashes: [string, unknown][] = [
    ["PILOT-RUN-MANIFEST.json.sourcePlanHash", getPath(manifest, "sourcePlanHash")],
    ["PILOT-FREEZE.json.sourcePlanHash", getPath(freeze, "sourcePlanHash")],
    ["PILOT-SELECTION.json.sourcePlanHash", getPath(selection, "sourcePlanHash")],
  ];
  for (const [label, claimed] of claimedSourcePlanHashes) {
    if (claimed !== actualCleanPlanHash) defects.push({ code: "SOURCE_PLAN_HASH_MISMATCH", severity: "ERROR", message: `${label} = ${JSON.stringify(claimed)}, but the actual recomputed SHA-256 of PILOT-CLEAN-PLAN.json's raw bytes is "${actualCleanPlanHash}".` });
  }

  const claimedSelectionHashes: [string, unknown][] = [
    ["PILOT-RUN-MANIFEST.json.selectionHash", getPath(manifest, "selectionHash")],
    ["PILOT-FREEZE.json.selectionHash", getPath(freeze, "selectionHash")],
  ];
  for (const [label, claimed] of claimedSelectionHashes) {
    if (claimed !== actualSelectionHash) defects.push({ code: "SELECTION_HASH_MISMATCH", severity: "ERROR", message: `${label} = ${JSON.stringify(claimed)}, but the actual recomputed SHA-256 of PILOT-SELECTION.json's raw bytes is "${actualSelectionHash}".` });
  }

  const rawByArtifactName: Record<string, string> = {
    "PILOT-CLEAN-PLAN.json": bundle.cleanPlanJson,
    "PILOT-SELECTION.json": bundle.selectionJson,
    "PILOT-RUN-MANIFEST.json": bundle.manifestJson,
    "PILOT-SEARCH-LOG.json": bundle.searchLogJson,
    "PILOT-RETRIEVAL-LOG.json": bundle.retrievalLogJson,
    "PILOT-RESULTS.json": bundle.resultsJson,
    "PILOT-ACCESS-AUDIT.json": bundle.accessAuditJson,
    "PILOT-REPORT.md": bundle.reportMarkdown,
  };
  const artifactHashes = getPath(freeze, "artifactHashes");
  for (const [name, raw] of Object.entries(rawByArtifactName)) {
    const claimed = isRecord(artifactHashes) ? artifactHashes[name] : undefined;
    const actual = hashContent(raw);
    if (claimed !== actual) defects.push({ code: "ARTIFACT_HASH_MISMATCH", severity: "ERROR", message: `PILOT-FREEZE.json.artifactHashes["${name}"] = ${JSON.stringify(claimed)}, but the actual recomputed SHA-256 of that file's raw bytes is "${actual}". A single-byte mutation to this artifact is expected to trigger exactly this defect.` });
  }
}

function checkSealedTarget(defects: ValidationDefect[], freeze: unknown, sealedTarget: SealedTargetCheck | undefined): void {
  if (!sealedTarget) return;
  let actual: string;
  try {
    actual = hashContent(readFileSync(sealedTarget.path, "utf-8"));
  } catch (err) {
    defects.push({ code: "SEALED_TARGET_UNREADABLE", severity: "ERROR", message: `Could not read the sealed target manifest at "${sealedTarget.path}": ${err instanceof Error ? err.message : String(err)}` });
    return;
  }
  if (actual !== sealedTarget.expectedHash) {
    defects.push({ code: "SEALED_TARGET_HASH_MISMATCH", severity: "ERROR", message: `Sealed target manifest at "${sealedTarget.path}" has SHA-256 "${actual}", expected "${sealedTarget.expectedHash}".` });
    return;
  }
  const before = getPath(freeze, "frozenBlindTargetManifest.hashBeforeThisRun");
  const after = getPath(freeze, "frozenBlindTargetManifest.hashAtFreeze");
  if (before !== sealedTarget.expectedHash) defects.push({ code: "SEALED_TARGET_HASH_MISMATCH", severity: "ERROR", message: `PILOT-FREEZE.json.frozenBlindTargetManifest.hashBeforeThisRun = ${JSON.stringify(before)}, expected "${sealedTarget.expectedHash}".` });
  if (after !== sealedTarget.expectedHash) defects.push({ code: "SEALED_TARGET_HASH_MISMATCH", severity: "ERROR", message: `PILOT-FREEZE.json.frozenBlindTargetManifest.hashAtFreeze = ${JSON.stringify(after)}, expected "${sealedTarget.expectedHash}".` });
}

// ---------------------------------------------------------------------
// Manifest / freeze structural + declaration-consistency checks.
// ---------------------------------------------------------------------

function checkManifestRequiredFields(defects: ValidationDefect[], manifest: unknown): void {
  if (!isRecord(manifest)) {
    defects.push({ code: "MANIFEST_MALFORMED", severity: "ERROR", message: "PILOT-RUN-MANIFEST.json: not a JSON object." });
    return;
  }
  for (const field of ["gitBranch", "gitCommit", "acquisitionStartedAt", "acquisitionEndedAt", "sourcePlanHash", "selectionHash"]) {
    if (!isString(getPath(manifest, field))) defects.push({ code: "MANIFEST_MISSING_FIELD", severity: "ERROR", message: `PILOT-RUN-MANIFEST.json: missing required string field "${field}".` });
  }
  if (!isBoolean(getPath(manifest, "acquisitionPolicy.allowLiveWebResearch"))) defects.push({ code: "MANIFEST_MISSING_FIELD", severity: "ERROR", message: `PILOT-RUN-MANIFEST.json: missing required boolean field "acquisitionPolicy.allowLiveWebResearch".` });
  if (!isBoolean(getPath(manifest, "acquisitionPolicy.requireExactLocator"))) defects.push({ code: "MANIFEST_MISSING_FIELD", severity: "ERROR", message: `PILOT-RUN-MANIFEST.json: missing required boolean field "acquisitionPolicy.requireExactLocator".` });
  if (!isNumber(getPath(manifest, "acquisitionPolicy.maxCandidateSourcesPerRequirement"))) defects.push({ code: "MANIFEST_MISSING_FIELD", severity: "ERROR", message: `PILOT-RUN-MANIFEST.json: missing required numeric field "acquisitionPolicy.maxCandidateSourcesPerRequirement".` });
  if (!isString(getPath(manifest, "runtimeVersions.node"))) defects.push({ code: "MANIFEST_MISSING_FIELD", severity: "ERROR", message: `PILOT-RUN-MANIFEST.json: missing required string field "runtimeVersions.node".` });

  const start = getPath(manifest, "acquisitionStartedAt");
  const end = getPath(manifest, "acquisitionEndedAt");
  if (isString(start) && !isValidIsoTimestamp(start)) defects.push({ code: "INVALID_TIMESTAMP", severity: "ERROR", message: `PILOT-RUN-MANIFEST.json.acquisitionStartedAt "${start}" is not a valid ISO timestamp.` });
  if (isString(end) && !isValidIsoTimestamp(end)) defects.push({ code: "INVALID_TIMESTAMP", severity: "ERROR", message: `PILOT-RUN-MANIFEST.json.acquisitionEndedAt "${end}" is not a valid ISO timestamp.` });
  if (isValidIsoTimestamp(start) && isValidIsoTimestamp(end) && Date.parse(start as string) > Date.parse(end as string)) {
    defects.push({ code: "TIMESTAMP_ORDERING_INVALID", severity: "ERROR", message: `PILOT-RUN-MANIFEST.json: acquisitionStartedAt ("${start}") is after acquisitionEndedAt ("${end}").` });
  }
}

function checkDeviationInvalidation(defects: ValidationDefect[], manifest: unknown): void {
  if (getPath(manifest, "blindnessBoundary.deviationDisclosure.occurred") === true) {
    defects.push({ code: "PROHIBITED_READ_DEVIATION_DISCLOSED", severity: "ERROR", message: "PILOT-RUN-MANIFEST.json discloses a process deviation (blindnessBoundary.deviationDisclosure.occurred = true) -- any such deviation invalidates the run unconditionally, regardless of what was or was not exposed by it, and regardless of whether it constituted an executed historical comparison (which independently and separately invalidates blindness -- see CC-24-PILOT-001-PA-REVIEW.md defect 1)." });
  }
}

function checkFreezeRequiredFields(defects: ValidationDefect[], freeze: unknown, requiredArtifactNames: readonly string[]): void {
  if (!isRecord(freeze)) {
    defects.push({ code: "FREEZE_MALFORMED", severity: "ERROR", message: "PILOT-FREEZE.json: not a JSON object." });
    return;
  }
  if (!isString(getPath(freeze, "sourcePlanHash"))) defects.push({ code: "FREEZE_MISSING_FIELD", severity: "ERROR", message: `PILOT-FREEZE.json: missing required top-level "sourcePlanHash".` });
  if (!isString(getPath(freeze, "selectionHash"))) defects.push({ code: "FREEZE_MISSING_FIELD", severity: "ERROR", message: `PILOT-FREEZE.json: missing required top-level "selectionHash".` });
  if (!isString(getPath(freeze, "frozenBlindTargetManifest.hashBeforeThisRun"))) defects.push({ code: "FREEZE_MISSING_FIELD", severity: "ERROR", message: `PILOT-FREEZE.json: missing "frozenBlindTargetManifest.hashBeforeThisRun".` });
  if (!isString(getPath(freeze, "frozenBlindTargetManifest.hashAtFreeze"))) defects.push({ code: "FREEZE_MISSING_FIELD", severity: "ERROR", message: `PILOT-FREEZE.json: missing "frozenBlindTargetManifest.hashAtFreeze".` });
  if (getPath(freeze, "frozenBlindTargetManifest.unchanged") !== true) defects.push({ code: "FREEZE_TARGET_CHANGED", severity: "ERROR", message: `PILOT-FREEZE.json: frozenBlindTargetManifest.unchanged is not literally true.` });

  const artifactHashes = getPath(freeze, "artifactHashes");
  if (!isRecord(artifactHashes)) {
    defects.push({ code: "FREEZE_MISSING_FIELD", severity: "ERROR", message: `PILOT-FREEZE.json: missing "artifactHashes" object.` });
  } else {
    for (const name of requiredArtifactNames) {
      if (!isString(artifactHashes[name])) defects.push({ code: "FREEZE_MISSING_ARTIFACT_HASH", severity: "ERROR", message: `PILOT-FREEZE.json: artifactHashes is missing an entry for required artifact "${name}".` });
    }
  }
}

function checkFreezeDeclarationConsistency(defects: ValidationDefect[], freeze: unknown, manifest: unknown): void {
  const deviationOccurred = getPath(manifest, "blindnessBoundary.deviationDisclosure.occurred") === true;
  const acknowledged = getPath(freeze, "declarations.deviationDisclosureAcknowledged");
  if (deviationOccurred && acknowledged !== true) {
    defects.push({ code: "DECLARATION_INCONSISTENCY", severity: "ERROR", message: `PILOT-FREEZE.json declarations do not structurally acknowledge the process deviation PILOT-RUN-MANIFEST.json discloses (expected declarations.deviationDisclosureAcknowledged === true) -- a prose mention elsewhere in the freeze file is not a substitute for a machine-checkable, cross-consistent field.` });
  }
}

function checkAccessAuditDenials(defects: ValidationDefect[], accessAudit: unknown): void {
  const records = isRecord(accessAudit) ? accessAudit.records : accessAudit;
  if (!isArray(records)) {
    defects.push({ code: "ACCESS_AUDIT_MALFORMED", severity: "ERROR", message: "PILOT-ACCESS-AUDIT.json: missing or non-array `records`." });
    return;
  }
  const denied = records.filter((r) => isRecord(r) && r.outcome === "DENIED");
  if (denied.length > 0) {
    defects.push({ code: "DENIED_ACCESS_OUTCOME", severity: "ERROR", message: `PILOT-ACCESS-AUDIT.json contains ${denied.length} DENIED access record(s) -- per task rule, ANY denied access attempt invalidates the run unconditionally, including a deliberate "demonstration" denial. Note: LocalAccessGuard, and this check, can only prove what happened to reads ROUTED THROUGH the guard -- neither is process-wide proof no other code path performed an unguarded read (see access-guard.ts's own documented enforcement boundary).` });
  }
}

// ---------------------------------------------------------------------
// §3.D: candidate + retrieval trace verification.
// ---------------------------------------------------------------------

interface SelectionRequirementInfo {
  readonly requiredCoverageDimensions: readonly string[];
  readonly sourceAuthorityClasses: readonly string[];
}

function indexSelectionRequirements(selection: unknown): Map<string, SelectionRequirementInfo> {
  const index = new Map<string, SelectionRequirementInfo>();
  if (!isRecord(selection) || !isArray(selection.requirements)) return index;
  for (const r of selection.requirements) {
    if (!isRecord(r) || !isString(r.evidenceRequirementId)) continue;
    index.set(r.evidenceRequirementId, {
      requiredCoverageDimensions: isArray(r.requiredCoverageDimensions) ? r.requiredCoverageDimensions.filter(isString) : [],
      sourceAuthorityClasses: isArray(r.sourceAuthorityClasses) ? r.sourceAuthorityClasses.filter(isString) : [],
    });
  }
  return index;
}

interface SearchCandidate {
  readonly candidateId: string;
  readonly order: number;
  readonly chosen: boolean;
  readonly retrievalAttempted: boolean;
}

function indexSearchCandidates(defects: ValidationDefect[], searchLog: unknown): Map<string, SearchCandidate[]> {
  const byRequirement = new Map<string, SearchCandidate[]>();
  const entries = isRecord(searchLog) ? searchLog.entries : undefined;
  if (!isArray(entries)) {
    defects.push({ code: "SEARCH_LOG_MALFORMED", severity: "ERROR", message: "PILOT-SEARCH-LOG.json: missing or non-array `entries`." });
    return byRequirement;
  }
  for (const entry of entries) {
    if (!isRecord(entry) || !isString(entry.evidenceRequirementId)) continue;
    const id = entry.evidenceRequirementId;
    const rawCandidates = isArray(entry.candidates) ? entry.candidates : [];
    const candidates: SearchCandidate[] = [];
    for (const c of rawCandidates) {
      if (!isRecord(c) || !isNonEmptyString(c.candidateId) || !isNumber(c.order) || !isBoolean(c.chosen) || !isBoolean(c.retrievalAttempted) || !isNonEmptyString(c.sourceRef) || !isNonEmptyString(c.reason)) {
        defects.push({ code: "SEARCH_CANDIDATE_MALFORMED", severity: "ERROR", message: `PILOT-SEARCH-LOG.json: "${id}" has a candidate missing one of candidateId/order/sourceRef/chosen/reason/retrievalAttempted.` });
        continue;
      }
      candidates.push({ candidateId: c.candidateId, order: c.order, chosen: c.chosen, retrievalAttempted: c.retrievalAttempted });
    }
    byRequirement.set(id, candidates);
  }
  return byRequirement;
}

function checkCandidateOrderAndCap(defects: ValidationDefect[], byRequirement: Map<string, SearchCandidate[]>, declaredCap: number): void {
  for (const [id, candidates] of byRequirement) {
    if (candidates.length > declaredCap) {
      defects.push({ code: "CANDIDATE_CAP_EXCEEDED", severity: "ERROR", message: `PILOT-SEARCH-LOG.json: "${id}" considered ${candidates.length} candidates, exceeding the run's own declared policy cap of ${declaredCap} (acquisitionPolicy.maxCandidateSourcesPerRequirement).` });
    }
    const orders = candidates.map((c) => c.order).sort((a, b) => a - b);
    const expected = candidates.map((_, i) => i + 1);
    if (JSON.stringify(orders) !== JSON.stringify(expected)) {
      defects.push({ code: "CANDIDATE_ORDER_NOT_SEQUENTIAL", severity: "ERROR", message: `PILOT-SEARCH-LOG.json: "${id}" candidate order values are [${orders.join(", ")}], expected a unique sequence starting at 1 with no gaps ([${expected.join(", ")}]).` });
    }
    const idCounts = new Map<string, number>();
    for (const c of candidates) idCounts.set(c.candidateId, (idCounts.get(c.candidateId) ?? 0) + 1);
    for (const [cid, count] of idCounts) {
      if (count > 1) defects.push({ code: "CANDIDATE_ID_DUPLICATE", severity: "ERROR", message: `PILOT-SEARCH-LOG.json: "${id}" declares candidateId "${cid}" ${count} times.` });
    }
  }
}

interface RetrievalEntryInfo {
  readonly outcome: unknown;
}

const RETRIEVAL_REQUIRED_TYPED_FIELDS = ["evidenceRequirementId", "candidateId", "attemptedUrl", "status", "publisher", "authorityClass", "authorityRationale", "locator", "boundedPassageOrDiagramDescription", "outcome"];

function indexRetrievalLog(defects: ValidationDefect[], retrievalLog: unknown, searchCandidates: Map<string, SearchCandidate[]>, acquisitionWindow: { start: number | null; end: number | null }): Map<string, RetrievalEntryInfo> {
  const index = new Map<string, RetrievalEntryInfo>();
  const entries = isRecord(retrievalLog) ? retrievalLog.entries : undefined;
  if (!isArray(entries)) {
    defects.push({ code: "RETRIEVAL_LOG_MALFORMED", severity: "ERROR", message: "PILOT-RETRIEVAL-LOG.json: missing or non-array `entries`." });
    return index;
  }
  for (const entry of entries) {
    if (!isRecord(entry)) {
      defects.push({ code: "RETRIEVAL_ENTRY_MALFORMED", severity: "ERROR", message: "PILOT-RETRIEVAL-LOG.json: an entry is not a JSON object." });
      continue;
    }
    const label = isString(entry.evidenceRequirementId) && isString(entry.candidateId) ? `${entry.evidenceRequirementId} / ${entry.candidateId}` : "(unidentified entry)";

    for (const field of RETRIEVAL_REQUIRED_TYPED_FIELDS) {
      if (!isNonEmptyString(entry[field]) && !(field === "outcome" && isNonEmptyString(entry[field]))) {
        if (!isNonEmptyString(entry[field])) defects.push({ code: "RETRIEVAL_ENTRY_MISSING_FIELD", severity: "ERROR", message: `PILOT-RETRIEVAL-LOG.json: entry ${label} is missing a non-empty typed value for required field "${field}".` });
      }
    }
    if ("finalUrl" in entry) {
      if (entry.finalUrl === null) {
        if (!isNonEmptyString(entry.finalUrlReason)) defects.push({ code: "RETRIEVAL_ENTRY_MISSING_FIELD", severity: "ERROR", message: `PILOT-RETRIEVAL-LOG.json: entry ${label} has finalUrl = null but no finalUrlReason.` });
      } else if (!isNonEmptyString(entry.finalUrl)) {
        defects.push({ code: "RETRIEVAL_ENTRY_MISSING_FIELD", severity: "ERROR", message: `PILOT-RETRIEVAL-LOG.json: entry ${label} finalUrl must be a non-empty string or explicit null.` });
      }
    } else {
      defects.push({ code: "RETRIEVAL_ENTRY_MISSING_FIELD", severity: "ERROR", message: `PILOT-RETRIEVAL-LOG.json: entry ${label} is missing "finalUrl" (string, or explicit null plus finalUrlReason).` });
    }
    if ("contentHash" in entry) {
      if (entry.contentHash === null) {
        if (!isNonEmptyString(entry.contentHashReason)) defects.push({ code: "RETRIEVAL_ENTRY_MISSING_FIELD", severity: "ERROR", message: `PILOT-RETRIEVAL-LOG.json: entry ${label} has contentHash = null but no contentHashReason.` });
      } else if (!isNonEmptyString(entry.contentHash)) {
        defects.push({ code: "RETRIEVAL_ENTRY_MISSING_FIELD", severity: "ERROR", message: `PILOT-RETRIEVAL-LOG.json: entry ${label} contentHash must be a non-empty string or explicit null.` });
      }
    } else {
      defects.push({ code: "RETRIEVAL_ENTRY_MISSING_FIELD", severity: "ERROR", message: `PILOT-RETRIEVAL-LOG.json: entry ${label} is missing "contentHash" (string, or explicit null plus contentHashReason).` });
    }
    if (entry.outcome === "REJECTED" && !isNonEmptyString(entry.rejectionReason)) {
      defects.push({ code: "RETRIEVAL_ENTRY_MISSING_FIELD", severity: "ERROR", message: `PILOT-RETRIEVAL-LOG.json: entry ${label} has outcome REJECTED but no rejectionReason.` });
    }
    if (entry.outcome !== undefined && entry.outcome !== "ACCEPTED" && entry.outcome !== "REJECTED") {
      defects.push({ code: "RETRIEVAL_ENTRY_MALFORMED", severity: "ERROR", message: `PILOT-RETRIEVAL-LOG.json: entry ${label} outcome must be "ACCEPTED" or "REJECTED", got ${JSON.stringify(entry.outcome)}.` });
    }

    if (!isValidIsoTimestamp(entry.timestamp)) {
      defects.push({ code: "INVALID_TIMESTAMP", severity: "ERROR", message: `PILOT-RETRIEVAL-LOG.json: entry ${label} timestamp ${JSON.stringify(entry.timestamp)} is not a valid ISO timestamp.` });
    } else {
      const t = Date.parse(entry.timestamp as string);
      if (acquisitionWindow.start !== null && t < acquisitionWindow.start) defects.push({ code: "TIMESTAMP_ORDERING_INVALID", severity: "ERROR", message: `PILOT-RETRIEVAL-LOG.json: entry ${label} timestamp is before the manifest's acquisitionStartedAt.` });
      if (acquisitionWindow.end !== null && t > acquisitionWindow.end) defects.push({ code: "TIMESTAMP_ORDERING_INVALID", severity: "ERROR", message: `PILOT-RETRIEVAL-LOG.json: entry ${label} timestamp is after the manifest's acquisitionEndedAt.` });
    }

    if (isString(entry.evidenceRequirementId) && isString(entry.candidateId)) {
      const declared = searchCandidates.get(entry.evidenceRequirementId)?.some((c) => c.candidateId === entry.candidateId);
      if (!declared) defects.push({ code: "RETRIEVAL_ENTRY_UNDECLARED_CANDIDATE", severity: "ERROR", message: `PILOT-RETRIEVAL-LOG.json: entry ${label} does not correspond to any candidate declared in PILOT-SEARCH-LOG.json for that requirement.` });
      const key = `${entry.evidenceRequirementId}::${entry.candidateId}`;
      if (index.has(key)) defects.push({ code: "RETRIEVAL_ENTRY_DUPLICATE", severity: "ERROR", message: `PILOT-RETRIEVAL-LOG.json: more than one entry for ${label}.` });
      index.set(key, { outcome: entry.outcome });
    }
  }
  return index;
}

function checkRetrievalAttemptedConsistency(defects: ValidationDefect[], searchCandidates: Map<string, SearchCandidate[]>, retrievalIndex: Map<string, RetrievalEntryInfo>): void {
  for (const [id, candidates] of searchCandidates) {
    for (const c of candidates) {
      const key = `${id}::${c.candidateId}`;
      const hasRetrievalEntry = retrievalIndex.has(key);
      if (c.retrievalAttempted && !hasRetrievalEntry) {
        defects.push({ code: "RETRIEVAL_ATTEMPT_MISSING", severity: "ERROR", message: `PILOT-RETRIEVAL-LOG.json: candidate "${c.candidateId}" for "${id}" is declared retrievalAttempted=true but has no matching retrieval entry.` });
      }
      if (!c.retrievalAttempted && hasRetrievalEntry) {
        defects.push({ code: "RETRIEVAL_ATTEMPT_INCONSISTENT", severity: "ERROR", message: `PILOT-RETRIEVAL-LOG.json: candidate "${c.candidateId}" for "${id}" is declared retrievalAttempted=false but a retrieval entry exists for it.` });
      }
    }
  }
}

// ---------------------------------------------------------------------
// Results checks: authority-class permission (declared-class-permitted
// ONLY -- see the module doc comment's honesty note), coverage-dimension
// partition, claim binding, and chosen-candidate resolution.
// ---------------------------------------------------------------------

interface ResultInfo {
  readonly verificationStatus: unknown;
  readonly candidateSourceIds: readonly string[];
  readonly hasGaps: boolean;
  readonly authorityByCandidate: ReadonlyMap<string, string>;
  readonly locatorByCandidate: ReadonlyMap<string, string>;
  readonly claimByCandidate: ReadonlyMap<string, string>;
  readonly coverageDimensionsSatisfied: readonly string[];
  readonly unresolvedDimensions: readonly string[];
  readonly conflictsAndGapsSummary: string;
}

function checkResults(defects: ValidationDefect[], results: unknown, selectionIndex: Map<string, SelectionRequirementInfo>, searchCandidates: Map<string, SearchCandidate[]>, retrievalIndex: Map<string, RetrievalEntryInfo>): Map<string, ResultInfo> {
  const resultInfoById = new Map<string, ResultInfo>();
  const list = isRecord(results) ? results.results : undefined;
  if (!isArray(list)) {
    defects.push({ code: "RESULTS_MALFORMED", severity: "ERROR", message: "PILOT-RESULTS.json: missing or non-array `results`." });
    return resultInfoById;
  }
  for (const entry of list) {
    if (!isRecord(entry) || !isString(entry.evidenceRequirementId) || !isRecord(entry.result)) {
      defects.push({ code: "RESULTS_ENTRY_MALFORMED", severity: "ERROR", message: "PILOT-RESULTS.json: an entry is missing evidenceRequirementId or a `result` object." });
      continue;
    }
    const id = entry.evidenceRequirementId;
    const result = entry.result;
    if (result.evidenceRequirementId !== id) {
      defects.push({ code: "RESULT_ID_MISMATCH", severity: "ERROR", message: `PILOT-RESULTS.json: outer evidenceRequirementId "${id}" does not equal inner result.evidenceRequirementId ${JSON.stringify(result.evidenceRequirementId)}.` });
    }
    const selectionInfo = selectionIndex.get(id);
    if (!selectionInfo) {
      defects.push({ code: "RESULTS_UNKNOWN_REQUIREMENT", severity: "ERROR", message: `PILOT-RESULTS.json: "${id}" is not present in PILOT-SELECTION.json.` });
      continue;
    }

    const candidateSources = isArray(result.candidateSources) ? result.candidateSources : [];
    const authorityByCandidate = new Map<string, string>();
    const locatorByCandidate = new Map<string, string>();
    for (const cs of candidateSources) {
      if (!isRecord(cs) || !isString(cs.sourceId) || !isString(cs.authorityClass)) continue;
      authorityByCandidate.set(cs.sourceId, cs.authorityClass);
      if (isString(cs.sourceLocator)) locatorByCandidate.set(cs.sourceId, cs.sourceLocator);
      if (!selectionInfo.sourceAuthorityClasses.includes(cs.authorityClass)) {
        defects.push({ code: "AUTHORITY_CLASS_NOT_PERMITTED", severity: "ERROR", message: `PILOT-RESULTS.json: "${id}" source "${cs.sourceId}" declares authorityClass "${cs.authorityClass}", which is not in the requirement's permitted sourceAuthorityClasses (${selectionInfo.sourceAuthorityClasses.join(", ")}). (This check proves the DECLARED class is permitted -- it cannot and does not prove the source genuinely belongs to that class; that is a Project-Architect semantic-review judgement.)` });
      }
      const declaredChosen = searchCandidates.get(id)?.some((c) => c.candidateId === cs.sourceId && c.chosen);
      if (!declaredChosen) defects.push({ code: "CANDIDATE_SOURCE_NOT_CHOSEN", severity: "ERROR", message: `PILOT-RESULTS.json: "${id}" candidateSources entry "${cs.sourceId}" does not correspond to a candidate declared chosen=true in PILOT-SEARCH-LOG.json.` });
      const retrievalOutcome = retrievalIndex.get(`${id}::${cs.sourceId}`)?.outcome;
      if (retrievalOutcome !== "ACCEPTED") defects.push({ code: "RETRIEVAL_ATTEMPT_MISSING_FOR_CANDIDATE", severity: "ERROR", message: `PILOT-RESULTS.json: "${id}" candidateSources entry "${cs.sourceId}" has no matching ACCEPTED entry in PILOT-RETRIEVAL-LOG.json (found: ${JSON.stringify(retrievalOutcome)}).` });
    }

    const chosenCandidates = searchCandidates.get(id)?.filter((c) => c.chosen) ?? [];
    const gaps = isArray(result.gaps) ? result.gaps : [];
    for (const c of chosenCandidates) {
      const resolved = authorityByCandidate.has(c.candidateId);
      if (!resolved && gaps.length === 0) {
        defects.push({ code: "CHOSEN_CANDIDATE_UNRESOLVED", severity: "ERROR", message: `PILOT-RESULTS.json / PILOT-SEARCH-LOG.json: "${id}" candidate "${c.candidateId}" is declared chosen=true but has neither an accepted candidateSources entry nor an explicit gap disposition in result.gaps.` });
      }
    }

    const satisfied = isArray(result.coverageDimensionsSatisfied) ? result.coverageDimensionsSatisfied.filter(isString) : [];
    const unresolved = isArray(result.unresolvedDimensions) ? result.unresolvedDimensions.filter(isString) : [];
    const satisfiedSet = new Set(satisfied);
    const unresolvedSet = new Set(unresolved);
    if (satisfiedSet.size !== satisfied.length) defects.push({ code: "COVERAGE_PARTITION_INVALID", severity: "ERROR", message: `PILOT-RESULTS.json: "${id}" coverageDimensionsSatisfied contains a duplicate dimension.` });
    if (unresolvedSet.size !== unresolved.length) defects.push({ code: "COVERAGE_PARTITION_INVALID", severity: "ERROR", message: `PILOT-RESULTS.json: "${id}" unresolvedDimensions contains a duplicate dimension.` });
    const overlap = [...satisfiedSet].filter((d) => unresolvedSet.has(d));
    if (overlap.length > 0) defects.push({ code: "COVERAGE_PARTITION_INVALID", severity: "ERROR", message: `PILOT-RESULTS.json: "${id}" has dimension(s) in BOTH satisfied and unresolved: ${overlap.join(", ")}.` });
    const requiredSet = new Set(selectionInfo.requiredCoverageDimensions);
    const combined = new Set([...satisfiedSet, ...unresolvedSet]);
    const missingFromPartition = [...requiredSet].filter((d) => !combined.has(d));
    const extraInPartition = [...combined].filter((d) => !requiredSet.has(d));
    if (missingFromPartition.length > 0) defects.push({ code: "COVERAGE_PARTITION_INVALID", severity: "ERROR", message: `PILOT-RESULTS.json: "${id}" does not account for required dimension(s): ${missingFromPartition.join(", ")}.` });
    if (extraInPartition.length > 0) defects.push({ code: "COVERAGE_PARTITION_INVALID", severity: "ERROR", message: `PILOT-RESULTS.json: "${id}" partitions dimension(s) not in its required set: ${extraInPartition.join(", ")}.` });

    const normalizedClaims = isArray(result.normalizedClaims) ? result.normalizedClaims : [];
    const claimBySourceId = new Map<string, string>();
    for (const c of normalizedClaims) if (isRecord(c) && isString(c.sourceId) && isString(c.claimText)) claimBySourceId.set(c.sourceId, c.claimText);
    const pilotAudit = isRecord(entry.pilotAudit) ? entry.pilotAudit : {};
    const bindings = isArray(pilotAudit.claimDimensionBindings) ? pilotAudit.claimDimensionBindings : [];
    for (const dim of satisfied) {
      const binding = bindings.find((b) => isRecord(b) && isArray(b.dimensions) && b.dimensions.includes(dim));
      if (!binding || !isRecord(binding) || !isString(binding.sourceId)) {
        defects.push({ code: "CLAIM_BINDING_MISSING", severity: "ERROR", message: `PILOT-RESULTS.json: "${id}" satisfied dimension "${dim}" has no claimDimensionBindings entry binding it to a claim + source.` });
        continue;
      }
      if (!authorityByCandidate.has(binding.sourceId)) defects.push({ code: "CLAIM_BINDING_UNRESOLVED_SOURCE", severity: "ERROR", message: `PILOT-RESULTS.json: "${id}" dimension "${dim}" binding references sourceId "${binding.sourceId}", which is not among this requirement's candidateSources.` });
      if (!claimBySourceId.has(binding.sourceId)) defects.push({ code: "CLAIM_BINDING_UNRESOLVED_SOURCE", severity: "ERROR", message: `PILOT-RESULTS.json: "${id}" dimension "${dim}" binding's source "${binding.sourceId}" has no corresponding entry in normalizedClaims.` });
    }

    const conflictsAndGapsParts: string[] = [];
    for (const g of gaps) if (isRecord(g) && isString(g.description)) conflictsAndGapsParts.push(`GAP: ${g.description}`);
    const conflicts = isArray(result.conflicts) ? result.conflicts : [];
    for (const c of conflicts) if (isRecord(c) && isString(c.description)) conflictsAndGapsParts.push(`CONFLICT: ${c.description}`);

    resultInfoById.set(id, {
      verificationStatus: result.verificationStatus,
      candidateSourceIds: [...authorityByCandidate.keys()],
      hasGaps: gaps.length > 0,
      authorityByCandidate,
      locatorByCandidate,
      claimByCandidate: claimBySourceId,
      coverageDimensionsSatisfied: satisfied,
      unresolvedDimensions: unresolved,
      conflictsAndGapsSummary: conflictsAndGapsParts.length > 0 ? conflictsAndGapsParts.join("; ") : "--",
    });
  }
  return resultInfoById;
}

// ---------------------------------------------------------------------
// §3.E: deterministic report rendering + comparison, replacing the
// prior header-words-and-row-count-only check.
// ---------------------------------------------------------------------

function renderExpectedReport(expectedIds: readonly string[], resultInfoById: Map<string, ResultInfo>): string {
  const header = "| evidenceRequirementId | Status | Authority | Locator | Normalized claim | Satisfied dimensions | Unresolved dimensions | Conflict/Gap |";
  const sep = "|---|---|---|---|---|---|---|---|";
  const rows = expectedIds.map((id) => {
    const info = resultInfoById.get(id);
    if (!info) return `| ${id} | (missing from PILOT-RESULTS.json) | -- | -- | -- | -- | -- | -- |`;
    const authority = info.candidateSourceIds.length > 0 ? info.candidateSourceIds.map((sid) => info.authorityByCandidate.get(sid)).join("; ") : "--";
    const locator = info.candidateSourceIds.length > 0 ? info.candidateSourceIds.map((sid) => info.locatorByCandidate.get(sid) ?? "").join("; ") : "--";
    const claim = info.candidateSourceIds.length > 0 ? info.candidateSourceIds.map((sid) => info.claimByCandidate.get(sid) ?? "").join("; ") : "SOURCE_GAP -- no claim";
    const satisfied = info.coverageDimensionsSatisfied.length > 0 ? info.coverageDimensionsSatisfied.join(", ") : "--";
    const unresolved = info.unresolvedDimensions.length > 0 ? info.unresolvedDimensions.join(", ") : "--";
    return `| ${id} | ${String(info.verificationStatus)} | ${authority} | ${locator} | ${claim} | ${satisfied} | ${unresolved} | ${info.conflictsAndGapsSummary} |`;
  });
  return [header, sep, ...rows].join("\n");
}

function checkReportMatchesDeterministicRendering(defects: ValidationDefect[], reportMarkdown: string, expectedIds: readonly string[], resultInfoById: Map<string, ResultInfo>): void {
  const expected = renderExpectedReport(expectedIds, resultInfoById);
  const actualLines = reportMarkdown
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.startsWith("|"));
  const expectedLines = expected.split("\n");
  if (actualLines.length !== expectedLines.length) {
    defects.push({ code: "REPORT_DOES_NOT_MATCH_DETERMINISTIC_RENDERING", severity: "ERROR", message: `PILOT-REPORT.md: has ${actualLines.length} table row(s), the deterministic rendering from PILOT-SELECTION.json/PILOT-RESULTS.json/PILOT-RETRIEVAL-LOG.json expects ${expectedLines.length}. The report must be generated from (or reconciled against) that data, not authored independently of it.` });
    return;
  }
  const mismatches: number[] = [];
  for (let i = 0; i < expectedLines.length; i++) {
    if (actualLines[i] !== expectedLines[i]) mismatches.push(i);
  }
  if (mismatches.length > 0) {
    defects.push({
      code: "REPORT_DOES_NOT_MATCH_DETERMINISTIC_RENDERING",
      severity: "ERROR",
      message: `PILOT-REPORT.md: ${mismatches.length} row(s) (0-indexed: ${mismatches.slice(0, 10).join(", ")}${mismatches.length > 10 ? ", ..." : ""}) do not match the deterministic rendering from PILOT-SELECTION.json/PILOT-RESULTS.json/PILOT-RETRIEVAL-LOG.json. Example -- expected: ${JSON.stringify(expectedLines[mismatches[0]!])}, actual: ${JSON.stringify(actualLines[mismatches[0]!])}.`,
    });
  }
}

// ---------------------------------------------------------------------
// Top-level entry points.
// ---------------------------------------------------------------------

export function validatePilotBundle(bundle: PilotArtifactRawBundle, options: PilotValidationOptions = {}): PilotValidationResult {
  const defects: ValidationDefect[] = [];
  const expectedIds = options.expectedRequirementIds ?? SELECTED_EVIDENCE_REQUIREMENT_IDS;
  const requiredArtifacts = options.requiredFreezeArtifactNames ?? DEFAULT_REQUIRED_FREEZE_ARTIFACTS;

  const cleanPlan = strictParseOrDefect(defects, "PILOT-CLEAN-PLAN.json", bundle.cleanPlanJson);
  void cleanPlan;
  const selection = strictParseOrDefect(defects, "PILOT-SELECTION.json", bundle.selectionJson);
  const manifest = strictParseOrDefect(defects, "PILOT-RUN-MANIFEST.json", bundle.manifestJson);
  const searchLog = strictParseOrDefect(defects, "PILOT-SEARCH-LOG.json", bundle.searchLogJson);
  const retrievalLog = strictParseOrDefect(defects, "PILOT-RETRIEVAL-LOG.json", bundle.retrievalLogJson);
  const results = strictParseOrDefect(defects, "PILOT-RESULTS.json", bundle.resultsJson);
  const accessAudit = strictParseOrDefect(defects, "PILOT-ACCESS-AUDIT.json", bundle.accessAuditJson);
  const freeze = strictParseOrDefect(defects, "PILOT-FREEZE.json", bundle.freezeJson);

  checkExactIdSet(defects, "PILOT-SELECTION.json", extractIds(selection, "requirements"), expectedIds);
  checkExactIdSet(defects, "PILOT-SEARCH-LOG.json", extractIds(searchLog, "entries"), expectedIds);
  checkExactIdSet(defects, "PILOT-RESULTS.json", extractIds(results, "results"), expectedIds);

  if (manifest !== undefined) {
    checkManifestRequiredFields(defects, manifest);
    checkDeviationInvalidation(defects, manifest);
  }
  if (freeze !== undefined) {
    checkFreezeRequiredFields(defects, freeze, requiredArtifacts);
    if (manifest !== undefined) checkFreezeDeclarationConsistency(defects, freeze, manifest);
  }
  if (manifest !== undefined && freeze !== undefined && selection !== undefined) checkHashIntegrity(defects, bundle, manifest, freeze, selection);
  checkSealedTarget(defects, freeze, options.sealedTarget);
  if (accessAudit !== undefined) checkAccessAuditDenials(defects, accessAudit);

  const searchCandidates = searchLog !== undefined ? indexSearchCandidates(defects, searchLog) : new Map<string, SearchCandidate[]>();
  const declaredCap = isNumber(getPath(manifest, "acquisitionPolicy.maxCandidateSourcesPerRequirement")) ? (getPath(manifest, "acquisitionPolicy.maxCandidateSourcesPerRequirement") as number) : (options.fallbackMaxCandidatesPerRequirement ?? DEFAULT_FALLBACK_MAX_CANDIDATES);
  checkCandidateOrderAndCap(defects, searchCandidates, declaredCap);

  const acquisitionWindow = {
    start: isValidIsoTimestamp(getPath(manifest, "acquisitionStartedAt")) ? Date.parse(getPath(manifest, "acquisitionStartedAt") as string) : null,
    end: isValidIsoTimestamp(getPath(manifest, "acquisitionEndedAt")) ? Date.parse(getPath(manifest, "acquisitionEndedAt") as string) : null,
  };
  const retrievalIndex = retrievalLog !== undefined ? indexRetrievalLog(defects, retrievalLog, searchCandidates, acquisitionWindow) : new Map<string, RetrievalEntryInfo>();
  checkRetrievalAttemptedConsistency(defects, searchCandidates, retrievalIndex);

  const selectionIndex = indexSelectionRequirements(selection);
  const resultInfoById = results !== undefined ? checkResults(defects, results, selectionIndex, searchCandidates, retrievalIndex) : new Map<string, ResultInfo>();

  checkReportMatchesDeterministicRendering(defects, bundle.reportMarkdown, expectedIds, resultInfoById);

  return { valid: defects.length === 0, defects };
}

/** Reads all nine pilot artifacts from `pilotDir` (read-only -- never writes, never modifies pilot-001's frozen files) and validates them. */
export function validatePilotDirectory(pilotDir: string, options: PilotValidationOptions = {}): PilotValidationResult {
  const read = (name: string) => readFileSync(path.join(pilotDir, name), "utf-8");
  const bundle: PilotArtifactRawBundle = {
    cleanPlanJson: read("PILOT-CLEAN-PLAN.json"),
    selectionJson: read("PILOT-SELECTION.json"),
    manifestJson: read("PILOT-RUN-MANIFEST.json"),
    searchLogJson: read("PILOT-SEARCH-LOG.json"),
    retrievalLogJson: read("PILOT-RETRIEVAL-LOG.json"),
    resultsJson: read("PILOT-RESULTS.json"),
    accessAuditJson: read("PILOT-ACCESS-AUDIT.json"),
    reportMarkdown: read("PILOT-REPORT.md"),
    freezeJson: read("PILOT-FREEZE.json"),
  };
  return validatePilotBundle(bundle, options);
}

/**
 * Exposed for test fixtures (and any producer script) that need to
 * construct a `PILOT-REPORT.md` guaranteed to match what
 * `validatePilotBundle`'s own deterministic-rendering check expects --
 * so a fixture never has to hand-duplicate the render format and risk
 * it silently drifting out of sync with the actual check.
 */
export function renderExpectedReportForBundle(bundle: PilotArtifactRawBundle, expectedIds: readonly string[]): string {
  const throwaway: ValidationDefect[] = [];
  const selection = strictParseOrDefect(throwaway, "PILOT-SELECTION.json", bundle.selectionJson);
  const results = strictParseOrDefect(throwaway, "PILOT-RESULTS.json", bundle.resultsJson);
  const searchLog = strictParseOrDefect(throwaway, "PILOT-SEARCH-LOG.json", bundle.searchLogJson);
  const retrievalLog = strictParseOrDefect(throwaway, "PILOT-RETRIEVAL-LOG.json", bundle.retrievalLogJson);
  const searchCandidates = searchLog !== undefined ? indexSearchCandidates(throwaway, searchLog) : new Map<string, SearchCandidate[]>();
  const retrievalIndex = retrievalLog !== undefined ? indexRetrievalLog(throwaway, retrievalLog, searchCandidates, { start: null, end: null }) : new Map<string, RetrievalEntryInfo>();
  const selectionIndex = indexSelectionRequirements(selection);
  const resultInfoById = results !== undefined ? checkResults(throwaway, results, selectionIndex, searchCandidates, retrievalIndex) : new Map<string, ResultInfo>();
  return renderExpectedReport(expectedIds, resultInfoById);
}

// Re-exported so callers/tests can reference the shared domain types without a second import of the generic package.
export type { CoverageDimension, SourceAuthorityClass };
