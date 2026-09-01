/**
 * CC-18: framework-independent generic qualification knowledge-
 * construction pipeline.
 *
 * Transforms generic, role-tagged qualification evidence (official
 * curriculum wording, public sample-assessment items, qualification-level
 * depth constraints, and independently approved technical-truth sources)
 * into learner-performance/knowledge candidates, plus structured gaps and
 * conflicts -- deterministically, and without ever requiring proprietary
 * course-provider material or treating legacy ALP content as authoritative.
 *
 * See docs/architecture/qualification-knowledge-construction-pipeline.md
 * for the governing design. See ./types.ts for the evidence/candidate/
 * gap/conflict model and ./rules.ts for the deterministic rules this
 * package implements.
 *
 * Independent of any specific qualification -- no real qualification's
 * content lives in this package. A later,
 * qualification-specific package supplies evidence records and calls
 * these functions; this package never does so itself.
 *
 * Pipeline stops at candidates + gaps/conflicts (task section 24). It
 * never writes a governed course matrix, knowledge obligation, assertion,
 * or lesson -- those remain a later Project-Architect decision and a
 * later, separately authorised package.
 */

export const packageId = "qualification-pipeline" as const;

export type PackageId = typeof packageId;

export * from "./types.ts";
export * from "./rules.ts";
