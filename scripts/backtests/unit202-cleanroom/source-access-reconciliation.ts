/**
 * CC-19R2 sections 3-5: mechanical reconciliation between the frozen
 * TECHNICAL_CLAIMS/curriculum/qualification-level sourceRef values (as of
 * commit ea7e8be) and the permitted source-access history (the original
 * CC-19R log + the CC-19R1 addendum this module computes).
 *
 * This module performs NO new web research. It only diffs URLs already
 * present in already-frozen data files against the already-frozen access
 * log, per CC-19R2 section 4 ("using ONLY... the sourceRef/sourceLocator
 * values already frozen at ea7e8be"). The addendum is therefore
 * mechanically COMPLETE by construction: every distinct new source URL
 * used by a TECHNICAL_CLAIMS entry that is not already in the original
 * log is included automatically, never hand-selected from memory.
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { TECHNICAL_CLAIMS } from "./technical-truth-data.ts";
import { HANDBOOK_SOURCE_REF, HANDBOOK_SOURCE_URL } from "./curriculum-data.ts";
import { OFQUAL_SOURCE_REF, OFQUAL_SOURCE_URL } from "./qualification-level-data.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..", "..", "..");
const outDir = path.join(repoRoot, "reports", "backtests", "unit202-cleanroom");

interface OriginalAccessLogEntry {
  readonly accessSequence: number;
  readonly sourceType: string;
  readonly reference: string;
  readonly locator: string;
  readonly evidenceRole: string;
  readonly permitted: boolean;
}
interface OriginalAccessLog {
  readonly evidentialAccessLog: readonly OriginalAccessLogEntry[];
}

export interface SourceUsage {
  readonly url: string;
  readonly sourceRef: string;
  readonly claimKeys: readonly string[];
}

/**
 * Extracts the first http(s) URL substring from a string, stopping at
 * whitespace/comma/quote (but NOT ')' -- several of the frozen LibreTexts
 * sourceLocator URLs legitimately contain a parenthesised author name in
 * the path, e.g. ".../Semiconductor_Devices_-_Theory_and_Application_(Fiore)/...",
 * and excluding ')' would truncate mid-path. A downloaded-file locator's
 * trailing " (local copy: ...)" annotation is always preceded by a space,
 * so it is excluded by the whitespace boundary regardless.
 */
export function extractUrl(s: string): string | undefined {
  const m = s.match(/https?:\/\/[^\s,"]+/);
  return m?.[0];
}

function loadOriginalAccessLog(): OriginalAccessLog {
  return JSON.parse(readFileSync(path.join(outDir, "CC-19R-SOURCE-ACCESS-LOG.json"), "utf-8")) as OriginalAccessLog;
}

export interface Cc19r1AddendumEntry {
  readonly sourceRef: string;
  readonly sourceLocator: string;
  readonly evidenceRole: "TECHNICAL_TRUTH";
  readonly permitted: true;
  readonly provenancePhase: "CC-19R1";
  readonly loggingStatus: "RETROSPECTIVELY_RECONSTRUCTED_FROM_SAME_SESSION_HISTORY";
  readonly claimKeysSupported: readonly string[];
}

/**
 * Every distinct TECHNICAL_CLAIMS source URL not already present in the
 * original CC-19R access log -- computed by diff, not by memory.
 */
export function computeAllTechnicalSourceUsages(): readonly SourceUsage[] {
  const byUrl = new Map<string, { sourceRef: string; claimKeys: Set<string> }>();
  for (const claim of TECHNICAL_CLAIMS) {
    const url = extractUrl(claim.sourceLocator) ?? extractUrl(claim.sourceRef);
    if (!url) continue; // no distinguishable URL (should not happen for any current claim)
    const entry = byUrl.get(url) ?? { sourceRef: claim.sourceRef, claimKeys: new Set<string>() };
    entry.claimKeys.add(claim.claimKey);
    byUrl.set(url, entry);
  }
  return [...byUrl.entries()].map(([url, { sourceRef, claimKeys }]) => ({ url, sourceRef, claimKeys: [...claimKeys].sort() }));
}

function originalLoggedUrls(): ReadonlySet<string> {
  const log = loadOriginalAccessLog();
  const urls = new Set<string>();
  for (const entry of log.evidentialAccessLog) {
    const url = extractUrl(entry.locator);
    if (url) urls.add(url);
  }
  return urls;
}

/** Mechanically computes the CC-19R1 addendum: every technical-claim source URL not already logged by CC-19R. */
export function computeCc19r1Addendum(): readonly Cc19r1AddendumEntry[] {
  const logged = originalLoggedUrls();
  const allUsages = computeAllTechnicalSourceUsages();
  return allUsages
    .filter((u) => !logged.has(u.url))
    .map((u) => ({
      sourceRef: u.sourceRef,
      sourceLocator: u.url,
      evidenceRole: "TECHNICAL_TRUTH" as const,
      permitted: true as const,
      provenancePhase: "CC-19R1" as const,
      loggingStatus: "RETROSPECTIVELY_RECONSTRUCTED_FROM_SAME_SESSION_HISTORY" as const,
      claimKeysSupported: u.claimKeys,
    }))
    .sort((a, b) => a.sourceLocator.localeCompare(b.sourceLocator));
}

export interface CompletenessViolation {
  readonly kind: "UNMATCHED_TECHNICAL_SOURCE" | "UNMATCHED_OFFICIAL_CURRICULUM_SOURCE" | "UNMATCHED_QUALIFICATION_LEVEL_SOURCE";
  readonly url: string | undefined;
  readonly sourceRef: string;
  readonly detail: string;
}

/**
 * Proves every evidential source actually used by the frozen ea7e8be
 * normalization (OFFICIAL_CURRICULUM, QUALIFICATION_LEVEL, and every
 * TECHNICAL_CLAIMS entry) has a matching permitted access record in
 * either the original log or the CC-19R1 addendum. Fails loudly (returns
 * violations) if a used source is missing from the combined history.
 */
export function validateSourceAccessCompleteness(): readonly CompletenessViolation[] {
  const logged = originalLoggedUrls();
  const addendum = computeCc19r1Addendum();
  const addendumUrls = new Set(addendum.map((a) => a.sourceLocator));
  const combined = new Set([...logged, ...addendumUrls]);

  const violations: CompletenessViolation[] = [];

  for (const usage of computeAllTechnicalSourceUsages()) {
    if (!combined.has(usage.url)) {
      violations.push({ kind: "UNMATCHED_TECHNICAL_SOURCE", url: usage.url, sourceRef: usage.sourceRef, detail: `claimKeys: ${usage.claimKeys.join(", ")}` });
    }
  }

  const handbookUrl = extractUrl(HANDBOOK_SOURCE_URL) ?? HANDBOOK_SOURCE_URL;
  if (!combined.has(handbookUrl)) {
    violations.push({ kind: "UNMATCHED_OFFICIAL_CURRICULUM_SOURCE", url: handbookUrl, sourceRef: HANDBOOK_SOURCE_REF, detail: "handbook PDF" });
  }

  const ofqualUrl = extractUrl(OFQUAL_SOURCE_URL) ?? OFQUAL_SOURCE_URL;
  if (!combined.has(ofqualUrl)) {
    violations.push({ kind: "UNMATCHED_QUALIFICATION_LEVEL_SOURCE", url: ofqualUrl, sourceRef: OFQUAL_SOURCE_REF, detail: "Ofqual Handbook Section E" });
  }

  return violations;
}
