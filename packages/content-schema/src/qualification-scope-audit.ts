/**
 * CC-16: structured ledger schema for a QUALIFICATION-SCOPE PROVENANCE /
 * CONTAMINATION AUDIT. This is a read-only evidence package: given an
 * already-governed Depth & Performance Matrix (see
 * ./depth-performance-matrix.ts), it records, for every distinct
 * non-trivial required-knowledge proposition the matrix asserts, what
 * actual curriculum evidence (explicit specification/Assessment
 * Criterion wording, explicit Range item, and matrix-recorded claims
 * about handout/worksheet/tutor-answer/sample-assessment coverage) does
 * or does not exist for it -- and, diagnostically only, what current
 * governed knowledge-obligation/assertion apparatus already asserts it
 * and from what source class.
 *
 * AUTHORITY BOUNDARY: this schema and the data satisfying it may never
 * carry a final scope classification (REQUIRED_QUALIFICATION_KNOWLEDGE,
 * FOUNDATIONAL_PREREQUISITE, CONTEXTUAL_TEACHING_SUPPORT, OUT_OF_SCOPE or
 * equivalent) -- that decision belongs exclusively to the Product Owner /
 * Project Architect. This module enforces that boundary structurally: no
 * field on `scopeProvenanceRowSchema` is a decision field, and the
 * `curriculumEvidenceStrengthSchema` / `scopeRiskFlagSchema` enums are deliberately
 * phrased as descriptions of what evidence was or was not found, never as
 * verdicts about what belongs in the course. A future package MUST NOT
 * add a decision-shaped field to this schema without a fresh Project
 * Architect authorisation -- doing so would silently move this from an
 * audit artefact into a scope-authoring artefact.
 *
 * Governed knowledge-obligation (`currentKnowledgeObligationKeys`,
 * ./ -- see scripts/content/data/unit202-knowledge-obligations.ts) and
 * governed-assertion (`currentAssertionKeys`) references, and
 * `legacySourceClass`, are explicitly DIAGNOSTIC ONLY per this package's
 * own governing instruction: they answer "does something in the current
 * repository already assert this," never "is this therefore in scope."
 * A legacy obligation/assertion must never be read as curriculum
 * evidence for A-F.
 */

import { z } from "zod";

const stableKey = z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "propositionKey must be kebab-case");
const acNumberPattern = /^[0-9]+\.[0-9]+$/;

/**
 * The KIND of matrix content a ledger row traces -- mirrors the same
 * five-kind decomposition already used by
 * ./source-acquisition-manifest.ts and ./technical-source-verification.ts
 * (factual proposition / relationship-or-mechanism / procedure-or-
 * calculation / symbol-or-convention / physical-or-component
 * recognition), plus one CC-16-specific addition for the LO6-style
 * "which component plays which role in this named application" claims
 * this audit's own triggering examples (telephone, security alarm) are
 * built from -- these are not quite any of the other five kinds, and
 * conflating them would blur exactly the pattern this audit exists to
 * examine.
 */
export const propositionRequirementTypeSchema = z.enum([
  "FACTUAL_PROPOSITION",
  "RELATIONSHIP_OR_FORMULA",
  "PROCEDURE_OR_CALCULATION",
  "SYMBOL_OR_CONVENTION",
  "PHYSICAL_OR_COMPONENT_RECOGNITION",
  "APPLICATION_OR_COMPONENT_ROLE_CLAIM",
]);
export type PropositionRequirementType = z.infer<typeof propositionRequirementTypeSchema>;

/** Whether the proposition is directly named by the AC's own title/verb wording, or absent from it. */
export const specSupportSchema = z.enum([
  "AC_TEXT_DIRECT",
  "AC_TEXT_ADJACENT_NOT_DIRECT",
  "NOT_IN_AC_TEXT",
]);
export type SpecSupport = z.infer<typeof specSupportSchema>;

/** Whether the proposition corresponds to an explicit official Range item, and how precisely. */
export const rangeSupportSchema = z.enum([
  "EXPLICIT_RANGE_ITEM_DIRECT",
  "RANGE_ITEM_DEPTH_TREATMENT_ADDS_DETAIL_BEYOND_ITEM_LABEL",
  "RANGE_ADJACENT_NO_EXACT_ITEM",
  "NO_RANGE_ITEM",
  "AC_HAS_NO_OFFICIAL_RANGE_LIST",
]);
export type RangeSupport = z.infer<typeof rangeSupportSchema>;

/**
 * Evidence-tier support common to handout / worksheet / tutor-answer /
 * sample-assessment claims. IMPORTANT: no actual C&G handout, worksheet,
 * tutor-answer or sample-assessment artefact is checked into this
 * repository (confirmed by this audit, see the evidence report's
 * methodology section) -- every "CLAIMED" value below means the matrix's
 * OWN prose asserts this coverage, not that this audit independently
 * verified it against a retrieved artefact. `QUOTED_IN_CODE_COMMENT` is a
 * distinct, slightly stronger-looking but still NOT independently
 * verifiable category: a small number of governed-code comments
 * (`unit202-knowledge-obligations.ts`) contain what reads as a verbatim
 * quotation from a handout, apparently transcribed by a prior session
 * that had temporary/ephemeral access to a user-supplied document -- but
 * that document itself was never persisted to the repository, so this
 * audit has no way to re-verify the quotation is accurate or complete.
 * Never treat `QUOTED_IN_CODE_COMMENT` as equivalent to an independently
 * inspected artefact.
 */
export const artefactEvidenceTierSchema = z.enum([
  "MATRIX_CLAIMS_SPECIFIC_PERFORMANCE",
  "MATRIX_CLAIMS_GENERIC_COVERAGE_ONLY",
  "QUOTED_IN_CODE_COMMENT_UNVERIFIABLE_THIS_SESSION",
  "NO_CLAIM_IN_MATRIX",
]);
export type ArtefactEvidenceTier = z.infer<typeof artefactEvidenceTierSchema>;

/**
 * An overall, purely-descriptive summary of how much genuine curriculum
 * evidence exists for a proposition. Deliberately NOT a scope verdict --
 * see this module's header. Ordered roughly strongest-to-weakest evidence
 * as a reading aid only; the Project Architect draws the actual line.
 */
export const curriculumEvidenceStrengthSchema = z.enum([
  "RANGE_ANCHORED_WITH_WORKSHEET_OR_ASSESSMENT_PERFORMANCE_CLAIMED",
  "RANGE_ANCHORED_HANDOUT_ADJACENCY_CLAIMED_ONLY",
  "RANGE_ANCHORED_NO_DEPTH_EVIDENCE_LOCATED",
  "AC_TEXT_ONLY_NO_RANGE_ITEM",
  "NO_AC_OR_RANGE_ANCHOR_LOCATED",
  "FOUNDATIONAL_SUPPLEMENTATION_CLAIM",
]);
export type CurriculumEvidenceStrength = z.infer<typeof curriculumEvidenceStrengthSchema>;

/**
 * Mechanically/consistently-applied evidence flags (task-mandated set,
 * extended with a small number this audit found were recurring and not
 * otherwise nameable by the mandated set -- each addition is documented
 * inline). These are evidence flags, never decisions.
 */
export const scopeRiskFlagSchema = z.enum([
  "NO_EXPLICIT_AC_OR_RANGE_ANCHOR",
  "DEPTH_ONLY_FROM_HANDOUT",
  "MENTION_ONLY_NOT_PERFORMANCE",
  "WORKSHEET_DOES_NOT_REQUIRE_DETAIL",
  "NO_TUTOR_OR_ASSESSMENT_SUPPORT",
  "LEGACY_ASSERTION_ONLY",
  "LEGACY_LESSON_ONLY",
  "TECHNICAL_SOURCE_ONLY",
  "ENCYCLOPEDIA_SOURCE",
  "FOUNDATIONAL_JUSTIFICATION_REQUIRED",
  "POSSIBLE_CONTEXT_ONLY",
  "POSSIBLE_OVERBUNDLED_PROPOSITION",
  "CURRENTNESS_OR_JURISDICTION_DEPENDENT",
  "PHYSICAL_RECOGNITION_EVIDENCE_ONLY",
  /** CC-16 addition: the matrix's own review flag already names this exact proposition as uncertain/legacy/currency-sensitive -- the matrix authored its own doubt. */
  "MATRIX_SELF_FLAGGED_REVIEW_NOTE",
  /** CC-16 addition: the only curriculum-scope basis on record (in unit202-knowledge-obligations.ts) is OFFICIAL_TEACHING_INTERPRETATION rather than EXPLICIT/RANGE -- i.e. the AC/Range wording alone does not resolve this breadth, by the governed obligations file's own prior admission. */
  "OBLIGATION_BASIS_IS_TEACHING_INTERPRETATION_NOT_EXPLICIT_OR_RANGE",
  /** CC-16 addition: quoted handout text exists only inside a code comment from a prior session's ephemeral document access, never independently re-verifiable this session (see artefactEvidenceTierSchema's QUOTED_IN_CODE_COMMENT_UNVERIFIABLE_THIS_SESSION). */
  "HANDOUT_QUOTE_UNVERIFIABLE_NO_PERSISTED_ARTEFACT",
]);
export type ScopeRiskFlag = z.infer<typeof scopeRiskFlagSchema>;

export const scopeProvenanceRowSchema = z.object({
  propositionKey: stableKey,
  acNumber: z.string().regex(acNumberPattern, 'acNumber must look like "1.1"'),
  /** One or more official Range items this row covers -- an array (not a single string) so a row MAY deliberately group several Range items that genuinely share identical, undifferentiated curriculum evidence (documented as such in `notes`), while every named item still independently counts toward full 58-Range-item mechanical coverage. Omit entirely for an AC with no official Range list. */
  rangeItems: z.array(z.string().min(1)).min(1).optional(),
  matrixRequirementText: z.string().min(1),
  requirementType: propositionRequirementTypeSchema,
  explicitSpecSupport: specSupportSchema,
  explicitRangeSupport: rangeSupportSchema,
  handoutSupport: artefactEvidenceTierSchema,
  worksheetSupport: artefactEvidenceTierSchema,
  tutorAnswerSupport: artefactEvidenceTierSchema,
  sampleAssessmentSupport: artefactEvidenceTierSchema,
  /** Only for propositions carrying a foundational-supplementation claim (task section 4) -- the explicit syllabus performance it supports, and why the learner cannot reasonably perform that requirement without it. */
  foundationalDependencyClaim: z.string().min(1).optional(),
  /** DIAGNOSTIC ONLY -- see module header. Omitted (not an empty array) means this row's G-trace was not exhaustively performed, per the audit's own disclosed methodology scoping -- distinct from an empty array, which would mean "traced and found none". */
  currentKnowledgeObligationKeys: z.array(z.string().min(1)).optional(),
  /** DIAGNOSTIC ONLY -- see module header. Omission semantics as currentKnowledgeObligationKeys above. */
  currentAssertionKeys: z.array(z.string().min(1)).optional(),
  /** DIAGNOSTIC ONLY -- see module header. Free text naming the source class actually found (e.g. "Wikipedia (encyclopedia article)", "CC-15/CC-15A approved dossier FACTUAL_AUTHORITY", "none found"). */
  legacySourceClass: z.string().min(1).optional(),
  /** Downstream propagation into legacy lesson content, inspected ONLY to detect propagation -- never as scope evidence (task section 7). Report file paths, never lesson prose. Omission means lesson propagation was not checked for this row, not that none exists. */
  downstreamLessonFootprint: z.array(z.string().min(1)).optional(),
  evidenceStrength: curriculumEvidenceStrengthSchema,
  /** Never omit -- an empty array is a meaningful claim ("no risk pattern found"), distinct from the diagnostic fields above. */
  scopeRiskFlags: z.array(scopeRiskFlagSchema).default([]),
  notes: z.string().min(1),
});
export type ScopeProvenanceRow = z.infer<typeof scopeProvenanceRowSchema>;

export const qualificationScopeAuditSchema = z
  .object({
    auditTitle: z.string().min(1),
    derivedFromMatrix: z.string().min(1),
    methodologyNote: z.string().min(1),
    rows: z.array(scopeProvenanceRowSchema).min(1),
  })
  .superRefine((audit, ctx) => {
    const seen = new Set<string>();
    audit.rows.forEach((row, i) => {
      if (seen.has(row.propositionKey)) {
        ctx.addIssue({
          code: "custom",
          path: ["rows", i, "propositionKey"],
          message: `duplicate propositionKey '${row.propositionKey}' -- every ledger row must be independently identifiable`,
        });
      }
      seen.add(row.propositionKey);
    });
  });
export type QualificationScopeAudit = z.infer<typeof qualificationScopeAuditSchema>;
