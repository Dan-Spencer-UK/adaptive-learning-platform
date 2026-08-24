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
 */
export interface ProofAuditResult {
  assetId: string;
  attempt: 1 | 2;
  verdict: AuditVerdict;
  factChecks: ImmutableFactCheck[];
  prohibitedChangeChecks: Array<{ prohibition: string; result: FactCheckResult; note: string }>;
  styleComplianceNotes: string;
  bakedLabelsFound: boolean;
  physicalImplausibilityNotes: string;
  overallFindings: string;
  auditedAt: string;
}
