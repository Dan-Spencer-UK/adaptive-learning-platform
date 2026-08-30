/**
 * Framework-independent package boundary.
 *
 * This package owns the versioned import/export schemas for governed
 * content candidates. CC-01 proved the package boundary and Zod v4
 * wiring only, using a generic manifest shape. CC-04 added the real
 * knowledge-graph manifest schema (./knowledge-graph.ts) -- domain,
 * source/source-version/source-locator, curriculum/curriculum-version/
 * curriculum-node, assertion/assertion-version, assertion relationship,
 * assertion<->curriculum mapping, misconception -- used to validate
 * scripts/content/data manifests before SQL generation. CC-05A added the
 * pedagogical layer built on top of that knowledge graph (./pedagogy.ts)
 * -- assertion families, capabilities, formula families, teaching/
 * diagram/mnemonic representations, question blueprints -- consumed by
 * the future CC-05B deterministic engine. CC-05D added the instructional-
 * visual governance/semantic-QA layer (./visual-governance.ts) -- visual
 * semantic contracts, canonical variants, two-pass semantic-review
 * records, human-review decisions -- which sits beside, not inside,
 * ./pedagogy.ts. The Lesson Plan package (ARCH-003) added the
 * instructional-orchestration layer (./lesson-plan.ts) -- canonical
 * lesson plans and their ordered lesson steps -- which sits ABOVE the
 * pedagogical chain, referencing governed assertion/family/capability/
 * representation/question-blueprint/misconception ids rather than
 * duplicating them. CC-09A added the official assessment-structure layer
 * (./assessment-specification.ts) -- an awarding body's own published
 * test structure (duration, question count, per-Learning-Outcome
 * allocation) as governed data, deliberately separate from any future
 * mock-paper assembler. The learner-specific adaptive assembler and the
 * full learner-runtime content-publication pipeline remain later
 * packages.
 *
 * CC-13A (ADR-0005/ADR-0006 integration) added the V1 learning-package
 * foundation: ./assessment-instance.ts (formative/mock assessment attempt
 * lifecycle and the submitted-assessment result that is the sole V1
 * Guided Revision trigger), ./guided-revision.ts (deterministic weakness
 * aggregation and ranked Guided Revision plan), and ./learning-package-
 * gate.ts (the shared governed result shape every publication gate
 * reports through). It also extended -- never duplicated -- three
 * existing modules: ./lesson-plan.ts (V1 route policy, semantic-section/
 * answer-leak fields), ./pedagogy.ts (question V1 role and revision-lesson
 * mapping), and ./visual-governance.ts (upstream visual-opportunity/
 * requirement/reference-dossier/family-contract/production-eligibility
 * planning layer, sitting before the existing semantic-QA layer that
 * governs an already-produced visual).
 *
 * CC-14 added the course-depth/performance governance layer: ./depth-
 * performance-matrix.ts (a course-specific Depth & Performance Matrix --
 * per-Assessment-Criterion required learner performance/depth/supporting-
 * knowledge, sitting between curriculum authority and technical knowledge
 * sourcing) and ./source-acquisition-manifest.ts (the deterministic,
 * reusable-domain-knowledge-clustered shopping list derived from an
 * approved matrix). Neither module carries domain content of its own, and
 * neither is a technical knowledge corpus -- both describe SHAPE only.
 *
 * CC-15 added ./technical-source-verification.ts: given a Project-
 * Architect-approved candidate source dossier, the deterministic shape
 * for recording source retrieval, exact-locator verification and
 * per-proposition coverage against a Source-Acquisition Manifest's own
 * required-knowledge arrays. Reuses CC-04's existing source/source-
 * version/source-locator entities rather than a parallel registry;
 * deliberately does not reference assertionIdentifier/assertionVersion --
 * proposition coverage is not knowledge-corpus reconciliation, which
 * remains a later, separately-reviewed package.
 */

import { z } from "zod";

export const packageId = "content-schema" as const;

export type PackageId = typeof packageId;

export const packageManifestSchema = z.object({
  name: z.string().min(1),
  version: z.string().min(1),
});

export type PackageManifest = z.infer<typeof packageManifestSchema>;

export * from "./knowledge-graph.ts";
export * from "./pedagogy.ts";
export * from "./visual-governance.ts";
export * from "./lesson-plan.ts";
export * from "./content-release.ts";
export * from "./runtime-projection.ts";
export * from "./assessment-specification.ts";
export * from "./assessment-instance.ts";
export * from "./guided-revision.ts";
export * from "./learning-package-gate.ts";
export * from "./depth-performance-matrix.ts";
export * from "./source-acquisition-manifest.ts";
export * from "./technical-source-verification.ts";
