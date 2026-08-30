/**
 * CC-14: structured manifest schema for a "Source-Acquisition Manifest" --
 * the deterministic shopping list of reusable domain-knowledge clusters
 * that still require authoritative external technical sources, derived
 * from an approved Depth & Performance Matrix (see
 * ./depth-performance-matrix.ts). This is NOT a knowledge corpus and
 * carries no factual content of its own -- only WHAT needs sourcing, WHY
 * (which curriculum requirements need it, at what depth), and WHAT KIND of
 * source would count as authoritative. Systematic acquisition of the
 * actual sources is a later, separately-reviewed work package -- never
 * performed by deriving this manifest (see docs/architecture/
 * SYLLABUS-TO-LEARNING-PACKAGE-PRODUCTION-ARCHITECTURE.md §4.3's
 * production sequence).
 *
 * Clusters group requirements by reusable domain-knowledge topic, not
 * mechanically one-per-Assessment-Criterion -- the same fact, relationship,
 * procedure, symbol or convention may be required by several ACs, several
 * units, or (per docs/governance/PROJECT-CONSTITUTION.md "Knowledge
 * principle") several qualifications. The manifest exists so that
 * knowledge is sourced once per genuine topic, never once per AC.
 */

import { z } from "zod";

export const sourceAcquisitionStatusSchema = z.enum(["UNSOURCED", "SOURCED"]);
export type SourceAcquisitionStatus = z.infer<typeof sourceAcquisitionStatusSchema>;

/**
 * The KIND of institution/publication that would count as an acceptable
 * authoritative source for a cluster's knowledge -- distinct from
 * knowledge-graph.ts's `sourceRoleSchema`, which describes the EVIDENTIAL
 * JOB a specific, already-registered source plays (e.g. FACTUAL_AUTHORITY).
 * Once a real source is registered against a cluster in a later package,
 * it would normally also be registered there with sourceRole
 * "FACTUAL_AUTHORITY" -- the two enums answer different questions and are
 * deliberately not merged.
 */
export const requiredSourceCharacteristicSchema = z.enum([
  "NATIONAL_OR_INTERNATIONAL_STANDARDS_BODY",
  "GOVERNMENT_OR_PUBLIC_AUTHORITY",
  "UNIVERSITY_OR_OPEN_EDUCATIONAL_RESOURCE",
  "AUTHORITATIVE_ENGINEERING_OR_SCIENCE_REFERENCE",
  "PROFESSIONAL_BODY",
  "MANUFACTURER_TECHNICAL_DOCUMENTATION",
  "OTHER_AUTHORITATIVE_PUBLIC_TECHNICAL_REFERENCE",
]);
export type RequiredSourceCharacteristic = z.infer<typeof requiredSourceCharacteristicSchema>;

export const sourceAcquisitionRangeReferenceSchema = z.object({
  acNumber: z.string().min(1),
  rangeItem: z.string().min(1),
});
export type SourceAcquisitionRangeReference = z.infer<typeof sourceAcquisitionRangeReferenceSchema>;

export const sourceAcquisitionClusterSchema = z
  .object({
    clusterKey: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "clusterKey must be kebab-case"),
    title: z.string().min(1),
    /** Non-binding note on how this cluster's knowledge would likely align with existing reusable domain codes (e.g. FM/FP/EL) or a future one -- never a decision that a future package must follow. */
    domainReuseNote: z.string().min(1),
    relatedAcNumbers: z.array(z.string().min(1)).min(1),
    relatedRangeItems: z.array(sourceAcquisitionRangeReferenceSchema).default([]),
    factualPropositionsRequiringSupport: z.array(z.string().min(1)).min(1),
    relationshipsOrMechanismsRequiringSupport: z.array(z.string().min(1)).default([]),
    proceduresOrCalculationRulesRequiringSupport: z.array(z.string().min(1)).default([]),
    symbolsOrConventionsRequiringSupport: z.array(z.string().min(1)).default([]),
    physicalOrComponentRecognitionRequirements: z.array(z.string().min(1)).default([]),
    unit202RequiredUseAndDepth: z.string().min(1),
    /** Review/correction/ambiguity flags from the source matrix relevant to this cluster -- carried forward verbatim, never silently resolved here. */
    reviewOrCorrectionFlags: z.array(z.string().min(1)).default([]),
    requiredSourceCharacteristics: z.array(requiredSourceCharacteristicSchema).min(1),
    status: sourceAcquisitionStatusSchema,
    /** Required, with exact repo evidence, whenever status is SOURCED. C&G teaching material alone is never sufficient evidence here. */
    existingGovernedSourceEvidence: z.string().min(1).optional(),
  })
  .superRefine((cluster, ctx) => {
    if (cluster.status === "SOURCED" && !cluster.existingGovernedSourceEvidence) {
      ctx.addIssue({ code: "custom", message: "a SOURCED cluster must cite exact existingGovernedSourceEvidence" });
    }
  });
export type SourceAcquisitionCluster = z.infer<typeof sourceAcquisitionClusterSchema>;

export const sourceAcquisitionManifestSchema = z
  .object({
    derivedFromMatrix: z.string().min(1),
    reusableKnowledgePrinciple: z.string().min(1),
    clusters: z.array(sourceAcquisitionClusterSchema).min(1),
  })
  .superRefine((manifest, ctx) => {
    const seen = new Set<string>();
    for (const [i, c] of manifest.clusters.entries()) {
      if (seen.has(c.clusterKey)) {
        ctx.addIssue({ code: "custom", path: ["clusters", i, "clusterKey"], message: `duplicate clusterKey ${c.clusterKey}` });
      }
      seen.add(c.clusterKey);
    }
  });
export type SourceAcquisitionManifest = z.infer<typeof sourceAcquisitionManifestSchema>;
