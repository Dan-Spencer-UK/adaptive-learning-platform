/**
 * CC-24 PA-review correction §3: a narrow PILOT EXECUTION GATE -- not a
 * redesign of the generic `@alp/technical-evidence-engine` contract, and
 * not itself an acquisition tool. Mechanically validates a completed
 * pilot's eight artifacts against the auditability bar the Project
 * Architect's review of pilot-001 exposed as missing: strict-JSON
 * integrity, exact selection-set/duplicate-ID checks, required
 * manifest/freeze fields, a candidate cap computed from EVERY candidate
 * considered (not merely accepted sources), complete retrieval-attempt
 * records, authority-class permission checks, exact coverage-dimension
 * partitions with per-dimension claim binding, cross-consistent
 * declarations, an unconditional DENIED-access/deviation invalidation
 * rule, and a human report with every required column present per row.
 *
 * `validatePilotBundle` operates on already-loaded raw file text (so
 * tests can exercise it against small synthetic fixtures without
 * touching disk); `validatePilotDirectory` is a thin disk-reading
 * wrapper used for the real pilot-001 read-only check. Neither function
 * reads anything outside the pilot's own output directory plus the
 * clean pilot-preparation source (`pilot-selection.ts`, for the frozen
 * `SELECTED_EVIDENCE_REQUIREMENT_IDS` default) -- never historical or
 * learner-content material.
 */
import { readFileSync } from "node:fs";
import path from "node:path";

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
  readonly selectionJson: string;
  readonly manifestJson: string;
  readonly searchLogJson: string;
  readonly retrievalLogJson: string;
  readonly resultsJson: string;
  readonly accessAuditJson: string;
  readonly reportMarkdown: string;
  readonly freezeJson: string;
}

export interface PilotValidationOptions {
  readonly expectedRequirementIds?: readonly string[];
  readonly maxCandidatesPerRequirement?: number;
  readonly requiredFreezeArtifactNames?: readonly string[];
}

const DEFAULT_MAX_CANDIDATES = 4;
const DEFAULT_REQUIRED_FREEZE_ARTIFACTS = ["PILOT-CLEAN-PLAN.json", "PILOT-SELECTION.json", "PILOT-RUN-MANIFEST.json", "PILOT-SEARCH-LOG.json", "PILOT-RETRIEVAL-LOG.json", "PILOT-RESULTS.json", "PILOT-ACCESS-AUDIT.json", "PILOT-REPORT.md"];

const REQUIRED_REPORT_COLUMN_MARKERS = ["status", "authority", "locator", "claim", "satisfied", "unresolved", "conflict"];

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}
function isArray(v: unknown): v is unknown[] {
  return Array.isArray(v);
}
function isString(v: unknown): v is string {
  return typeof v === "string";
}
function isBoolean(v: unknown): v is boolean {
  return typeof v === "boolean";
}
function isNumber(v: unknown): v is number {
  return typeof v === "number" && Number.isFinite(v);
}
const HEX64 = /^[0-9a-f]{64}$/;

function getPath(obj: unknown, dotPath: string): unknown {
  let cur = obj;
  for (const seg of dotPath.split(".")) {
    if (!isRecord(cur)) return undefined;
    cur = cur[seg];
  }
  return cur;
}

/** Parses a raw JSON string via the strict (duplicate-key-rejecting) parser, pushing a defect and returning `undefined` on failure rather than throwing -- so one malformed file never prevents every other check from running. */
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
// Individual checks. Each takes the already-parsed documents (where
// parsing succeeded) plus raw text (for the markdown report) and pushes
// defects; none throws for an ordinary validation failure -- only a
// programming error in the validator itself would throw.
// ---------------------------------------------------------------------

function checkSelectionSet(defects: ValidationDefect[], selection: unknown, expectedIds: readonly string[]): Set<string> {
  const foundIds = new Set<string>();
  if (!isRecord(selection) || !isArray(selection.requirements)) {
    defects.push({ code: "SELECTION_MALFORMED", severity: "ERROR", message: "PILOT-SELECTION.json: missing or non-array `requirements`." });
    return foundIds;
  }
  const seen = new Map<string, number>();
  for (const r of selection.requirements) {
    if (!isRecord(r) || !isString(r.evidenceRequirementId)) continue;
    const id = r.evidenceRequirementId;
    seen.set(id, (seen.get(id) ?? 0) + 1);
    foundIds.add(id);
  }
  for (const [id, count] of seen) {
    if (count > 1) defects.push({ code: "SELECTION_DUPLICATE_ID", severity: "ERROR", message: `PILOT-SELECTION.json: evidenceRequirementId "${id}" occurs ${count} times.` });
  }
  const expectedSet = new Set(expectedIds);
  const missing = expectedIds.filter((id) => !foundIds.has(id));
  const extra = [...foundIds].filter((id) => !expectedSet.has(id));
  if (missing.length > 0) defects.push({ code: "SELECTION_SET_MISMATCH", severity: "ERROR", message: `PILOT-SELECTION.json: missing ${missing.length} expected requirement ID(s): ${missing.join(", ")}` });
  if (extra.length > 0) defects.push({ code: "SELECTION_SET_MISMATCH", severity: "ERROR", message: `PILOT-SELECTION.json: contains ${extra.length} unexpected requirement ID(s) not in the frozen selection: ${extra.join(", ")}` });
  return foundIds;
}

function checkManifestRequiredFields(defects: ValidationDefect[], manifest: unknown): void {
  if (!isRecord(manifest)) {
    defects.push({ code: "MANIFEST_MALFORMED", severity: "ERROR", message: "PILOT-RUN-MANIFEST.json: not a JSON object." });
    return;
  }
  const requiredStringFields = ["gitBranch", "gitCommit", "acquisitionStartedAt", "acquisitionEndedAt", "sourcePlanHash", "selectionHash"];
  for (const field of requiredStringFields) {
    if (!isString(getPath(manifest, field))) defects.push({ code: "MANIFEST_MISSING_FIELD", severity: "ERROR", message: `PILOT-RUN-MANIFEST.json: missing required string field "${field}".` });
  }
  if (!isBoolean(getPath(manifest, "acquisitionPolicy.allowLiveWebResearch"))) defects.push({ code: "MANIFEST_MISSING_FIELD", severity: "ERROR", message: `PILOT-RUN-MANIFEST.json: missing required boolean field "acquisitionPolicy.allowLiveWebResearch".` });
  if (!isBoolean(getPath(manifest, "acquisitionPolicy.requireExactLocator"))) defects.push({ code: "MANIFEST_MISSING_FIELD", severity: "ERROR", message: `PILOT-RUN-MANIFEST.json: missing required boolean field "acquisitionPolicy.requireExactLocator".` });
  if (!isNumber(getPath(manifest, "acquisitionPolicy.maxCandidateSourcesPerRequirement"))) defects.push({ code: "MANIFEST_MISSING_FIELD", severity: "ERROR", message: `PILOT-RUN-MANIFEST.json: missing required numeric field "acquisitionPolicy.maxCandidateSourcesPerRequirement".` });
  if (!isString(getPath(manifest, "runtimeVersions.node"))) defects.push({ code: "MANIFEST_MISSING_FIELD", severity: "ERROR", message: `PILOT-RUN-MANIFEST.json: missing required string field "runtimeVersions.node".` });
}

function checkDeviationInvalidation(defects: ValidationDefect[], manifest: unknown): boolean {
  const occurred = getPath(manifest, "blindnessBoundary.deviationDisclosure.occurred");
  if (occurred === true) {
    defects.push({ code: "PROHIBITED_READ_DEVIATION_DISCLOSED", severity: "ERROR", message: "PILOT-RUN-MANIFEST.json discloses a process deviation (blindnessBoundary.deviationDisclosure.occurred = true) -- any such deviation invalidates the run unconditionally, regardless of what was or was not exposed by it." });
    return true;
  }
  return false;
}

function checkFreezeRequiredFields(defects: ValidationDefect[], freeze: unknown, requiredArtifactNames: readonly string[]): void {
  if (!isRecord(freeze)) {
    defects.push({ code: "FREEZE_MALFORMED", severity: "ERROR", message: "PILOT-FREEZE.json: not a JSON object." });
    return;
  }
  if (!isString(getPath(freeze, "sourcePlanHash"))) defects.push({ code: "FREEZE_MISSING_FIELD", severity: "ERROR", message: `PILOT-FREEZE.json: missing required top-level "sourcePlanHash" (distinct from the generic per-file artifactHashes entry).` });
  if (!isString(getPath(freeze, "selectionHash"))) defects.push({ code: "FREEZE_MISSING_FIELD", severity: "ERROR", message: `PILOT-FREEZE.json: missing required top-level "selectionHash" (distinct from the generic per-file artifactHashes entry).` });
  if (!isString(getPath(freeze, "frozenBlindTargetManifest.hashBeforeThisRun"))) defects.push({ code: "FREEZE_MISSING_FIELD", severity: "ERROR", message: `PILOT-FREEZE.json: missing "frozenBlindTargetManifest.hashBeforeThisRun".` });
  if (!isString(getPath(freeze, "frozenBlindTargetManifest.hashAtFreeze"))) defects.push({ code: "FREEZE_MISSING_FIELD", severity: "ERROR", message: `PILOT-FREEZE.json: missing "frozenBlindTargetManifest.hashAtFreeze".` });
  if (getPath(freeze, "frozenBlindTargetManifest.unchanged") !== true) defects.push({ code: "FREEZE_TARGET_CHANGED", severity: "ERROR", message: `PILOT-FREEZE.json: frozenBlindTargetManifest.unchanged is not literally true.` });

  const artifactHashes = getPath(freeze, "artifactHashes");
  if (!isRecord(artifactHashes)) {
    defects.push({ code: "FREEZE_MISSING_FIELD", severity: "ERROR", message: `PILOT-FREEZE.json: missing "artifactHashes" object.` });
  } else {
    for (const name of requiredArtifactNames) {
      if (!isString(artifactHashes[name]) || !HEX64.test(artifactHashes[name] as string)) defects.push({ code: "FREEZE_MISSING_ARTIFACT_HASH", severity: "ERROR", message: `PILOT-FREEZE.json: artifactHashes is missing a valid SHA-256 hash for required artifact "${name}".` });
    }
  }
}

function checkFreezeDeclarationConsistency(defects: ValidationDefect[], freeze: unknown, manifest: unknown): void {
  const deviationOccurred = getPath(manifest, "blindnessBoundary.deviationDisclosure.occurred") === true;
  const acknowledged = getPath(freeze, "declarations.deviationDisclosureAcknowledged");
  if (deviationOccurred && acknowledged !== true) {
    defects.push({
      code: "DECLARATION_INCONSISTENCY",
      severity: "ERROR",
      message: `PILOT-FREEZE.json declarations do not structurally acknowledge the process deviation PILOT-RUN-MANIFEST.json discloses (expected declarations.deviationDisclosureAcknowledged === true) -- a prose mention elsewhere in the freeze file is not a substitute for a machine-checkable, cross-consistent field.`,
    });
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
    defects.push({
      code: "DENIED_ACCESS_OUTCOME",
      severity: "ERROR",
      message: `PILOT-ACCESS-AUDIT.json contains ${denied.length} DENIED access record(s) -- per task rule, ANY denied access attempt invalidates the run unconditionally, including a deliberate "demonstration" denial; a valid pilot's access audit must contain ALLOWED outcomes only.`,
    });
  }
}

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

function checkSearchLogCandidateCapAndOrder(defects: ValidationDefect[], searchLog: unknown, maxCandidates: number): void {
  const entries = isRecord(searchLog) ? searchLog.entries : undefined;
  if (!isArray(entries)) {
    defects.push({ code: "SEARCH_LOG_MALFORMED", severity: "ERROR", message: "PILOT-SEARCH-LOG.json: missing or non-array `entries`." });
    return;
  }
  for (const entry of entries) {
    if (!isRecord(entry) || !isString(entry.evidenceRequirementId)) continue;
    const id = entry.evidenceRequirementId;
    const candidates = isArray(entry.candidates) ? entry.candidates : [];
    if (candidates.length > maxCandidates) {
      defects.push({
        code: "CANDIDATE_CAP_EXCEEDED",
        severity: "ERROR",
        message: `PILOT-SEARCH-LOG.json: "${id}" considered ${candidates.length} candidates, exceeding the maximum of ${maxCandidates}. The cap applies to every candidate considered, not merely those accepted into a result's candidateSources.`,
      });
    }
    const orders = new Set<number>();
    for (const c of candidates) {
      if (!isRecord(c) || !isNumber(c.order)) {
        defects.push({ code: "SEARCH_CANDIDATE_MISSING_ORDER", severity: "ERROR", message: `PILOT-SEARCH-LOG.json: "${id}" has a candidate with no explicit numeric "order" field -- candidate order must be declared, not merely implied by array position.` });
        continue;
      }
      if (orders.has(c.order)) defects.push({ code: "SEARCH_CANDIDATE_DUPLICATE_ORDER", severity: "ERROR", message: `PILOT-SEARCH-LOG.json: "${id}" has more than one candidate declaring order ${c.order}.` });
      orders.add(c.order);
    }
  }
}

interface RetrievalEntryInfo {
  readonly outcome: unknown;
}

function indexRetrievalLog(defects: ValidationDefect[], retrievalLog: unknown): Map<string, RetrievalEntryInfo> {
  const index = new Map<string, RetrievalEntryInfo>();
  const entries = isRecord(retrievalLog) ? retrievalLog.entries : undefined;
  if (!isArray(entries)) {
    defects.push({ code: "RETRIEVAL_LOG_MALFORMED", severity: "ERROR", message: "PILOT-RETRIEVAL-LOG.json: missing or non-array `entries`." });
    return index;
  }
  const requiredFields = ["evidenceRequirementId", "sourceId", "attemptedUrl", "status", "timestamp", "publisher", "authorityClass", "authorityRationale", "locator", "outcome"];
  for (const entry of entries) {
    if (!isRecord(entry)) {
      defects.push({ code: "RETRIEVAL_ENTRY_MALFORMED", severity: "ERROR", message: "PILOT-RETRIEVAL-LOG.json: an entry is not a JSON object." });
      continue;
    }
    const label = isString(entry.evidenceRequirementId) && isString(entry.sourceId) ? `${entry.evidenceRequirementId} / ${entry.sourceId}` : "(unidentified entry)";
    for (const field of requiredFields) {
      if (!(field in entry) || entry[field] === undefined) defects.push({ code: "RETRIEVAL_ENTRY_MISSING_FIELD", severity: "ERROR", message: `PILOT-RETRIEVAL-LOG.json: entry ${label} is missing required field "${field}".` });
    }
    if (!("boundedPassageOrDiagramDescription" in entry) && !("boundedPassage" in entry)) {
      defects.push({ code: "RETRIEVAL_ENTRY_MISSING_FIELD", severity: "ERROR", message: `PILOT-RETRIEVAL-LOG.json: entry ${label} is missing a bounded passage / diagram description field.` });
    }
    if (isString(entry.evidenceRequirementId) && isString(entry.sourceId)) index.set(`${entry.evidenceRequirementId}::${entry.sourceId}`, { outcome: entry.outcome });
  }
  return index;
}

function checkResults(defects: ValidationDefect[], results: unknown, selectionIndex: Map<string, SelectionRequirementInfo>, retrievalIndex: Map<string, RetrievalEntryInfo>): void {
  const list = isRecord(results) ? results.results : undefined;
  if (!isArray(list)) {
    defects.push({ code: "RESULTS_MALFORMED", severity: "ERROR", message: "PILOT-RESULTS.json: missing or non-array `results`." });
    return;
  }
  for (const entry of list) {
    if (!isRecord(entry) || !isString(entry.evidenceRequirementId) || !isRecord(entry.result)) {
      defects.push({ code: "RESULTS_ENTRY_MALFORMED", severity: "ERROR", message: "PILOT-RESULTS.json: an entry is missing evidenceRequirementId or a `result` object." });
      continue;
    }
    const id = entry.evidenceRequirementId;
    const result = entry.result;
    const selectionInfo = selectionIndex.get(id);
    if (!selectionInfo) {
      defects.push({ code: "RESULTS_UNKNOWN_REQUIREMENT", severity: "ERROR", message: `PILOT-RESULTS.json: "${id}" is not present in PILOT-SELECTION.json.` });
      continue;
    }

    const candidateSources = isArray(result.candidateSources) ? result.candidateSources : [];
    const knownSourceIds = new Set<string>();
    for (const cs of candidateSources) {
      if (!isRecord(cs) || !isString(cs.sourceId) || !isString(cs.authorityClass)) continue;
      knownSourceIds.add(cs.sourceId);
      if (!selectionInfo.sourceAuthorityClasses.includes(cs.authorityClass)) {
        defects.push({ code: "AUTHORITY_CLASS_NOT_PERMITTED", severity: "ERROR", message: `PILOT-RESULTS.json: "${id}" source "${cs.sourceId}" is classified "${cs.authorityClass}", which is not in the requirement's permitted sourceAuthorityClasses (${selectionInfo.sourceAuthorityClasses.join(", ")}).` });
      }
      const retrievalEntry = retrievalIndex.get(`${id}::${cs.sourceId}`);
      if (!retrievalEntry || retrievalEntry.outcome !== "ACCEPTED") {
        defects.push({ code: "RETRIEVAL_ATTEMPT_MISSING_FOR_CANDIDATE", severity: "ERROR", message: `PILOT-RESULTS.json: "${id}" candidateSources entry "${cs.sourceId}" has no matching ACCEPTED entry in PILOT-RETRIEVAL-LOG.json.` });
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
    const claimKnownFor = (sourceId: string) => normalizedClaims.some((c) => isRecord(c) && c.sourceId === sourceId);
    const pilotAudit = isRecord(entry.pilotAudit) ? entry.pilotAudit : {};
    const bindings = isArray(pilotAudit.claimDimensionBindings) ? pilotAudit.claimDimensionBindings : [];
    for (const dim of satisfied) {
      const binding = bindings.find((b) => isRecord(b) && isArray(b.dimensions) && b.dimensions.includes(dim));
      if (!binding || !isRecord(binding) || !isString(binding.sourceId)) {
        defects.push({ code: "CLAIM_BINDING_MISSING", severity: "ERROR", message: `PILOT-RESULTS.json: "${id}" satisfied dimension "${dim}" has no claimDimensionBindings entry binding it to a claim + source.` });
        continue;
      }
      if (!knownSourceIds.has(binding.sourceId)) defects.push({ code: "CLAIM_BINDING_UNRESOLVED_SOURCE", severity: "ERROR", message: `PILOT-RESULTS.json: "${id}" dimension "${dim}" binding references sourceId "${binding.sourceId}", which is not among this requirement's candidateSources.` });
      if (!claimKnownFor(binding.sourceId)) defects.push({ code: "CLAIM_BINDING_UNRESOLVED_SOURCE", severity: "ERROR", message: `PILOT-RESULTS.json: "${id}" dimension "${dim}" binding's source "${binding.sourceId}" has no corresponding entry in normalizedClaims.` });
    }
  }
}

function checkReportRows(defects: ValidationDefect[], reportMarkdown: string, expectedIds: readonly string[]): void {
  const lines = reportMarkdown.split(/\r?\n/).filter((l) => l.trim().startsWith("|"));
  if (lines.length < 2) {
    defects.push({ code: "REPORT_TABLE_MISSING", severity: "ERROR", message: "PILOT-REPORT.md: no markdown table found." });
    return;
  }
  const header = lines[0]!.toLowerCase();
  for (const marker of REQUIRED_REPORT_COLUMN_MARKERS) {
    if (!header.includes(marker)) defects.push({ code: "REPORT_MISSING_REQUIRED_COLUMN", severity: "ERROR", message: `PILOT-REPORT.md: the report table's header does not contain a "${marker}" column -- every row must state this inline, not merely by cross-reference to another file.` });
  }
  const dataRows = lines.slice(2).filter((l) => l.split("|").length > 2);
  if (dataRows.length !== expectedIds.length) {
    defects.push({ code: "REPORT_ROW_COUNT_MISMATCH", severity: "ERROR", message: `PILOT-REPORT.md: table has ${dataRows.length} data row(s), expected exactly ${expectedIds.length} (one per selected requirement).` });
  }
}

// ---------------------------------------------------------------------
// Top-level entry points.
// ---------------------------------------------------------------------

export function validatePilotBundle(bundle: PilotArtifactRawBundle, options: PilotValidationOptions = {}): PilotValidationResult {
  const defects: ValidationDefect[] = [];
  const expectedIds = options.expectedRequirementIds ?? SELECTED_EVIDENCE_REQUIREMENT_IDS;
  const maxCandidates = options.maxCandidatesPerRequirement ?? DEFAULT_MAX_CANDIDATES;
  const requiredArtifacts = options.requiredFreezeArtifactNames ?? DEFAULT_REQUIRED_FREEZE_ARTIFACTS;

  const selection = strictParseOrDefect(defects, "PILOT-SELECTION.json", bundle.selectionJson);
  const manifest = strictParseOrDefect(defects, "PILOT-RUN-MANIFEST.json", bundle.manifestJson);
  const searchLog = strictParseOrDefect(defects, "PILOT-SEARCH-LOG.json", bundle.searchLogJson);
  const retrievalLog = strictParseOrDefect(defects, "PILOT-RETRIEVAL-LOG.json", bundle.retrievalLogJson);
  const results = strictParseOrDefect(defects, "PILOT-RESULTS.json", bundle.resultsJson);
  const accessAudit = strictParseOrDefect(defects, "PILOT-ACCESS-AUDIT.json", bundle.accessAuditJson);
  const freeze = strictParseOrDefect(defects, "PILOT-FREEZE.json", bundle.freezeJson);

  checkSelectionSet(defects, selection, expectedIds);
  if (manifest !== undefined) {
    checkManifestRequiredFields(defects, manifest);
    checkDeviationInvalidation(defects, manifest);
  }
  if (freeze !== undefined) {
    checkFreezeRequiredFields(defects, freeze, requiredArtifacts);
    if (manifest !== undefined) checkFreezeDeclarationConsistency(defects, freeze, manifest);
  }
  if (accessAudit !== undefined) checkAccessAuditDenials(defects, accessAudit);
  if (searchLog !== undefined) checkSearchLogCandidateCapAndOrder(defects, searchLog, maxCandidates);

  const selectionIndex = indexSelectionRequirements(selection);
  const retrievalIndex = retrievalLog !== undefined ? indexRetrievalLog(defects, retrievalLog) : new Map<string, RetrievalEntryInfo>();
  if (results !== undefined) checkResults(defects, results, selectionIndex, retrievalIndex);

  checkReportRows(defects, bundle.reportMarkdown, expectedIds);

  return { valid: defects.length === 0, defects };
}

/** Reads all eight pilot artifacts from `pilotDir` (read-only -- never writes, never modifies pilot-001's frozen files) and validates them. */
export function validatePilotDirectory(pilotDir: string, options: PilotValidationOptions = {}): PilotValidationResult {
  const read = (name: string) => readFileSync(path.join(pilotDir, name), "utf-8");
  const bundle: PilotArtifactRawBundle = {
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
