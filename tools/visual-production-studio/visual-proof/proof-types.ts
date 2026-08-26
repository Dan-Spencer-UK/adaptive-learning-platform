/**
 * CC-11.8 §20: shared types for the two-asset Gemini proof -- kept simple
 * and compatible with the existing Studio machinery (task brief E5: "Keep
 * metadata simple and compatible with existing Studio machinery").
 */

export interface ProofGenerationMetadata {
  assetId: string;
  attempt: 1 | 2;
  sourceReferenceUrl: string;
  sourceReferenceSha256: string;
  model: string;
  masterPath: string;
  masterSha256: string;
  derivativePath: string;
  derivativeSha256: string;
  generatedAt: string;
  /** The model's own accompanying text response, if any -- logged for context, never trusted as proof of correctness (task brief E6). */
  modelResponseText?: string;
}

export type AuditVerdict = "PASS" | "RETRY" | "HUMAN_REVIEW_REQUIRED";

export type FactCheckResult = "PASS" | "FAIL" | "UNCERTAIN";

/** CC-11.12: the three independent dimensions a generated candidate must PASS on, per VISUAL-REFERENCE-SEMANTIC-QA-PRODUCT-DECISION.md's "three independent approval gates". A technical PASS alone is explicitly insufficient. */
export type DimensionVerdict = "PASS" | "FAIL" | "UNCERTAIN";

export interface ImmutableFactCheck {
  fact: string;
  result: FactCheckResult;
  note: string;
}

/**
 * The structured output of Claude's own independent visual inspection of
 * the actual generated candidate (task brief E6) -- written by hand after
 * viewing the saved master PNG, never generated automatically, since there
 * is no second AI in this loop to delegate the audit to.
 *
 * CC-11.12: extended with three independent dimension verdicts
 * (`technicalVerdict` / `pedagogicalClarityVerdict` /
 * `visualProductQualityVerdict`), replacing the single-dimension "did the
 * geometry look right" judgement used through CC-11.11. `verdict` (the
 * overall PASS/RETRY/HUMAN_REVIEW_REQUIRED) must equal PASS only when all
 * three dimension verdicts are PASS; an UNCERTAIN on any dimension blocks
 * an automatic overall PASS the same as a FAIL. The three fields are
 * optional on the type only for backward compatibility with every audit
 * JSON already on disk from CC-11.8–CC-11.11 (written before this
 * extension existed) -- every CC-11.12-authored audit populates all three.
 */
export interface ProofAuditResult {
  assetId: string;
  attempt: 1 | 2;
  verdict: AuditVerdict;
  technicalVerdict?: DimensionVerdict;
  pedagogicalClarityVerdict?: DimensionVerdict;
  visualProductQualityVerdict?: DimensionVerdict;
  factChecks: ImmutableFactCheck[];
  prohibitedChangeChecks: Array<{ prohibition: string; result: FactCheckResult; note: string }>;
  styleComplianceNotes: string;
  bakedLabelsFound: boolean;
  physicalImplausibilityNotes: string;
  overallFindings: string;
  auditedAt: string;
}
