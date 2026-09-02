/**
 * CC-19R1 DEFECT-C fix: a real validator proving every OFFICIAL_CURRICULUM
 * Layer-A `sourceFragment.sourceExcerpt` is genuinely verbatim source
 * text -- never a synthetic annotation such as CC-19R's
 * `${ac.wording} [child: ${child.rawWording}]` or `| Range:` concatenation.
 *
 * Two independent checks, BOTH must pass:
 *   1. STRUCTURAL: the excerpt exactly equals one of the canonical raw
 *      strings already transcribed into curriculum-data.ts (ac.wording,
 *      an explicit child's rawWording, a Range group's categoryLabel, or
 *      a Range member's raw text) -- this catches synthetic
 *      concatenation/annotation immediately.
 *   2. GROUNDING: the excerpt (normalized-whitespace) also occurs as a
 *      normalized-whitespace substring of the raw pdftotext transcription
 *      of the handbook PDF (raw-sources/handbook.txt) -- this ties the
 *      canonical strings themselves back to the actual source document,
 *      not merely to curriculum-data.ts's own (potentially erroneous)
 *      transcription.
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

import { ASSESSMENT_CRITERIA, LEARNING_OUTCOMES } from "./curriculum-data.ts";
import type { SourceFragment } from "./build-ledger.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..", "..", "..");

/**
 * Collapses whitespace runs to a single space AND undoes the standard
 * PDF-extraction line-wrap artifact where a hyphenated word breaks across
 * a line ("inter-\n\nrelationships" -> "inter- relationships" after naive
 * whitespace collapsing, when the true flowing-paragraph reading is
 * "inter-relationships" with no space after the hyphen).
 */
function normalizeWhitespace(s: string): string {
  return s
    .replace(/-\s+/g, "-")
    .replace(/\s+/g, " ")
    .trim();
}

let cachedHandbookNormalized: string | undefined;
function loadNormalizedHandbookText(): string {
  if (cachedHandbookNormalized) return cachedHandbookNormalized;
  const raw = readFileSync(path.join(repoRoot, "reports", "backtests", "unit202-cleanroom", "raw-sources", "handbook.txt"), "utf-8");
  cachedHandbookNormalized = normalizeWhitespace(raw);
  return cachedHandbookNormalized;
}

/** Every canonical raw string transcribed into curriculum-data.ts (structural ground truth). */
function buildCanonicalStringSet(): ReadonlySet<string> {
  const set = new Set<string>();
  for (const lo of LEARNING_OUTCOMES) set.add(lo.wording);
  for (const ac of ASSESSMENT_CRITERIA) {
    set.add(ac.wording);
    for (const child of ac.explicitChildren ?? []) set.add(child.rawWording);
    for (const group of ac.rangeGroups ?? []) {
      set.add(group.categoryLabel);
      for (const member of group.members) set.add(member.raw);
    }
  }
  return set;
}

export interface VerbatimViolation {
  readonly sourceExcerpt: string;
  readonly fragmentRole: string;
  readonly reason: "NOT_A_CANONICAL_STRING" | "NOT_GROUNDED_IN_RAW_HANDBOOK_TEXT";
}

/**
 * Validates ONLY fragments whose sourceRef is the handbook (OFFICIAL_CURRICULUM
 * fragments) -- technical-truth / qualification-level fragments are out of
 * scope for this validator (they cite different raw sources entirely).
 */
export function validateOfficialCurriculumFragments(fragments: readonly { readonly sourceRef: string; readonly fragment: SourceFragment }[], handbookSourceRef: string): readonly VerbatimViolation[] {
  const canonical = buildCanonicalStringSet();
  const normalizedHandbook = loadNormalizedHandbookText();
  const violations: VerbatimViolation[] = [];

  for (const { sourceRef, fragment } of fragments) {
    if (sourceRef !== handbookSourceRef) continue; // not an OFFICIAL_CURRICULUM fragment

    if (!canonical.has(fragment.sourceExcerpt)) {
      violations.push({ sourceExcerpt: fragment.sourceExcerpt, fragmentRole: fragment.fragmentRole, reason: "NOT_A_CANONICAL_STRING" });
      continue;
    }

    const normalizedExcerpt = normalizeWhitespace(fragment.sourceExcerpt);
    if (!normalizedHandbook.includes(normalizedExcerpt)) {
      violations.push({ sourceExcerpt: fragment.sourceExcerpt, fragmentRole: fragment.fragmentRole, reason: "NOT_GROUNDED_IN_RAW_HANDBOOK_TEXT" });
    }
  }

  return violations;
}
