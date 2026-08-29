/**
 * CC-13A: mechanical/deterministic validators for the ADR-0005/ADR-0006
 * V1 learning-package foundation, mirroring validate-lesson-plan.ts's and
 * validate-pedagogy.ts's established discipline -- every check
 * independently recomputes against the live corpus/fixtures, never
 * trusting a governed object's own claims.
 *
 * Scope note: this package (CC-13A) integrates the architecture and
 * schema/tooling FOUNDATION; it explicitly does not re-author Unit 202
 * content under the new pipeline (that is reserved future work -- see
 * docs/architecture/LEARNING-PACKAGE-PIPELINE-AUDIT-AND-QUALIFICATION-
 * PLAN.md). So most of the checks below report ADOPTION metrics (how much
 * of the live corpus has opted into the new V1 fields) alongside hard
 * FAILURE gates for the fields/relationships that ARE populated -- a
 * lesson/blueprint that has not yet declared `routePolicy`/
 * `v1PedagogicalRole`/etc. is a currency-audit finding, never itself a
 * validation failure (this mirrors `assessmentStyleEvidence`'s existing
 * "absence means not yet classified" discipline in pedagogy.ts).
 *
 * Usage:
 *   node scripts/content/validate-v1-learning-package.ts            (print report)
 *   node scripts/content/validate-v1-learning-package.ts --check     (exit 1 on any hard-failure gate)
 */

import { fileURLToPath } from "node:url";

import {
  knowledgeGraphManifestSchema,
  pedagogyManifestSchema,
  lessonPlanManifestSchema,
  classifyV1StepRole,
  CURRENT_DESIGN_SYSTEM_VERSION,
  type LessonPlan,
  type ReferenceDossier,
  type VisualRequirement,
  type ProductionVisualAsset,
  type GuidedRevisionPlan,
} from "@alp/content-schema";

import { cc04Unit202ElectricalScience } from "./data/cc04-unit202-electrical-science.ts";
import { cc05aPedagogyUnit202 } from "./data/cc05a-pedagogy-unit202.ts";
import { lessons } from "./data/lessons.ts";

export interface V1LearningPackageReport {
  // ---- adoption metrics (informational, never a failure) ----
  totalLessons: number;
  lessonsWithRoutePolicy: number;
  totalQuestionBlueprints: number;
  questionBlueprintsWithV1Role: number;
  formativeMockBlueprintCount: number;

  // ---- hard-failure gates ----
  /** requiredKnowledgeIds naming an assertion identifier never taught by ANY step in ANY lesson in the corpus -- off-syllabus/untaught dependency. */
  offSyllabusRequiredKnowledge: string[];
  /** requiredKnowledgeIds resolving only to material taught in a DIFFERENT lesson than the one containing the check, with no declared prerequisiteKnowledge link -- the real Unit 202 finding "component questions depending on material taught only in another lesson". */
  requiredKnowledgeFromUndeclaredOtherLesson: string[];
  /** FORMATIVE_MOCK blueprint revisionLessonIds not resolving to any real lesson id in the manifest. */
  danglingRevisionLessonRefs: string[];
  /** CANONICAL_FIXED_ROUTE lessons containing a step classified POST_V1_ADAPTIVE (schema already blocks non-required steps there; this independently re-verifies the step-TYPE classification too, since a POST_V1_ADAPTIVE step marked `required` would slip past that gate alone). */
  postV1StepTypesInCanonicalRoute: string[];
}

function computeReport(overrides?: { readonly lessons?: readonly LessonPlan[] }): V1LearningPackageReport {
  const corpus = knowledgeGraphManifestSchema.parse(cc04Unit202ElectricalScience);
  const pedagogy = pedagogyManifestSchema.parse(cc05aPedagogyUnit202);
  const lessonInputs = overrides?.lessons ?? lessons;
  const manifest = lessonPlanManifestSchema.parse({ lessons: lessonInputs });

  const realAssertionIds = new Set(corpus.assertions.map((a) => a.identifier));
  const realLessonIds = new Set(manifest.lessons.map((l) => l.id));

  // Every assertion identifier taught by at least one step, anywhere in the corpus.
  const taughtEverywhere = new Set<string>();
  // Which lesson(s) teach a given assertion identifier.
  const taughtByLessonIds = new Map<string, Set<string>>();
  for (const lesson of manifest.lessons) {
    for (const step of lesson.steps) {
      for (const id of step.teaches) {
        taughtEverywhere.add(id);
        if (!taughtByLessonIds.has(id)) taughtByLessonIds.set(id, new Set());
        taughtByLessonIds.get(id)!.add(lesson.id);
      }
    }
  }

  // Assertion families reachable from a lesson's declared prerequisiteKnowledge (family ids) -> assertion identifiers.
  const familyAssertions = new Map<string, Set<string>>();
  for (const membership of pedagogy.assertionFamilyMemberships) {
    if (!familyAssertions.has(membership.familyId)) familyAssertions.set(membership.familyId, new Set());
    familyAssertions.get(membership.familyId)!.add(membership.assertionIdentifier);
  }

  const questionBlueprintsById = new Map(pedagogy.questionBlueprints.map((q) => [q.id, q] as const));

  const offSyllabusRequiredKnowledge: string[] = [];
  const requiredKnowledgeFromUndeclaredOtherLesson: string[] = [];
  const postV1StepTypesInCanonicalRoute: string[] = [];
  let lessonsWithRoutePolicy = 0;

  for (const lesson of manifest.lessons) {
    if (lesson.routePolicy) lessonsWithRoutePolicy++;

    const declaredPriorAssertions = new Set<string>();
    for (const familyId of lesson.prerequisiteKnowledge) {
      for (const assertionId of familyAssertions.get(familyId) ?? []) declaredPriorAssertions.add(assertionId);
    }

    const taughtSoFarInThisLesson = new Set<string>();
    for (const step of lesson.steps) {
      if (lesson.routePolicy === "CANONICAL_FIXED_ROUTE" && classifyV1StepRole(step.type) === "POST_V1_ADAPTIVE") {
        postV1StepTypesInCanonicalRoute.push(`${lesson.id}.${step.id}: step type '${step.type}' is POST_V1_ADAPTIVE but lesson declares routePolicy CANONICAL_FIXED_ROUTE`);
      }

      if (step.questionBlueprintId) {
        const blueprint = questionBlueprintsById.get(step.questionBlueprintId);
        for (const knowledgeId of blueprint?.requiredKnowledgeIds ?? []) {
          if (!realAssertionIds.has(knowledgeId)) continue; // dangling id -- validate-pedagogy.ts's own corpus-integrity gates already catch unknown assertion identifiers generally.
          if (!taughtEverywhere.has(knowledgeId)) {
            offSyllabusRequiredKnowledge.push(
              `${lesson.id}.${step.id} (blueprint '${blueprint!.id}') requires knowledge '${knowledgeId}', which no step in any lesson teaches -- off-syllabus/untaught dependency`,
            );
            continue;
          }
          const taughtLocallyOrDeclaredPrior = taughtSoFarInThisLesson.has(knowledgeId) || declaredPriorAssertions.has(knowledgeId);
          if (!taughtLocallyOrDeclaredPrior) {
            const teachingLessons = [...(taughtByLessonIds.get(knowledgeId) ?? [])].filter((id) => id !== lesson.id);
            if (teachingLessons.length > 0) {
              requiredKnowledgeFromUndeclaredOtherLesson.push(
                `${lesson.id}.${step.id} (blueprint '${blueprint!.id}') requires knowledge '${knowledgeId}', taught only by lesson(s) [${teachingLessons.join(", ")}] -- '${lesson.id}' does not teach it earlier in its own sequence and does not declare a prerequisiteKnowledge link that resolves to it`,
              );
            }
          }
        }
      }

      for (const id of step.teaches) taughtSoFarInThisLesson.add(id);
    }
  }

  const danglingRevisionLessonRefs: string[] = [];
  let questionBlueprintsWithV1Role = 0;
  let formativeMockBlueprintCount = 0;
  for (const blueprint of pedagogy.questionBlueprints) {
    if (blueprint.v1PedagogicalRole) questionBlueprintsWithV1Role++;
    if (blueprint.v1PedagogicalRole === "FORMATIVE_MOCK") {
      formativeMockBlueprintCount++;
      for (const revisionLessonId of blueprint.revisionLessonIds ?? []) {
        if (!realLessonIds.has(revisionLessonId)) {
          danglingRevisionLessonRefs.push(`question blueprint '${blueprint.id}' revisionLessonIds references unknown lesson '${revisionLessonId}'`);
        }
      }
    }
  }

  return {
    totalLessons: manifest.lessons.length,
    lessonsWithRoutePolicy,
    totalQuestionBlueprints: pedagogy.questionBlueprints.length,
    questionBlueprintsWithV1Role,
    formativeMockBlueprintCount,
    offSyllabusRequiredKnowledge,
    requiredKnowledgeFromUndeclaredOtherLesson,
    danglingRevisionLessonRefs,
    postV1StepTypesInCanonicalRoute,
  };
}

export function isReportClean(report: V1LearningPackageReport): boolean {
  return (
    report.offSyllabusRequiredKnowledge.length === 0 &&
    report.requiredKnowledgeFromUndeclaredOtherLesson.length === 0 &&
    report.danglingRevisionLessonRefs.length === 0 &&
    report.postV1StepTypesInCanonicalRoute.length === 0
  );
}

function formatReport(report: V1LearningPackageReport): string {
  const lines: string[] = [];
  lines.push("V1 Learning-Package (ADR-0005/ADR-0006) governance report");
  lines.push("===========================================================");
  lines.push(`Lessons: ${report.totalLessons} (${report.lessonsWithRoutePolicy} declare a V1 routePolicy)`);
  lines.push(`Question blueprints: ${report.totalQuestionBlueprints} (${report.questionBlueprintsWithV1Role} classified with a v1PedagogicalRole, ${report.formativeMockBlueprintCount} FORMATIVE_MOCK)`);
  const gateGroups: Array<[string, string[]]> = [
    ["Off-syllabus required knowledge (never taught anywhere)", report.offSyllabusRequiredKnowledge],
    ["Required knowledge from an undeclared other lesson", report.requiredKnowledgeFromUndeclaredOtherLesson],
    ["Dangling FORMATIVE_MOCK revisionLessonIds", report.danglingRevisionLessonRefs],
    ["POST_V1_ADAPTIVE step types inside a CANONICAL_FIXED_ROUTE lesson", report.postV1StepTypesInCanonicalRoute],
  ];
  for (const [label, items] of gateGroups) {
    lines.push(`${label} (target 0): ${items.length}`);
    if (items.length) lines.push(`    ${items.join("; ")}`);
  }
  return lines.join("\n");
}

// ---------------------------------------------------------------------
// Visual planning/reference-governance validators. These operate on
// caller-supplied VisualRequirement/ReferenceDossier/ProductionVisualAsset
// sets rather than a live corpus -- CC-13A does not populate a real
// Unit 202 visual requirement register (that is pipeline-audit/pilot
// work); these are the deterministic checks that register will need.
// ---------------------------------------------------------------------

export interface VisualGovernanceReport {
  /** REQUIRED + PRODUCT_OWNER_APPROVED requirement referencing a dossier that is not itself status APPROVED (or does not exist at all). */
  requiredVisualsWithoutApprovedDossier: string[];
  /** Requirement/family/asset declaring a designSystemVersion other than the current one. */
  staleDesignSystemVersionBindings: string[];
  /** More than one PRODUCTION_ELIGIBLE asset sharing the same assetId, or a PRODUCTION_ELIGIBLE asset that is not the highest version among its own assetId group -- "obsolete/superseded visual assets cannot resolve at runtime". */
  supersededAssetsMarkedEligible: string[];
}

export function validateVisualGovernance(
  requirements: readonly VisualRequirement[],
  dossiers: readonly ReferenceDossier[],
  assets: readonly ProductionVisualAsset[],
): VisualGovernanceReport {
  const dossiersById = new Map(dossiers.map((d) => [d.id, d] as const));

  const requiredVisualsWithoutApprovedDossier: string[] = [];
  const staleDesignSystemVersionBindings: string[] = [];
  for (const requirement of requirements) {
    if (requirement.designSystemVersion !== CURRENT_DESIGN_SYSTEM_VERSION) {
      staleDesignSystemVersionBindings.push(
        `visual requirement '${requirement.assetId}' declares designSystemVersion '${requirement.designSystemVersion}', current is '${CURRENT_DESIGN_SYSTEM_VERSION}'`,
      );
    }
    if (requirement.needClassification !== "REQUIRED" || requirement.approval !== "PRODUCT_OWNER_APPROVED") continue;
    const approvedDossier = requirement.referenceDossierIds.some((id) => dossiersById.get(id)?.status === "APPROVED");
    if (!approvedDossier) {
      requiredVisualsWithoutApprovedDossier.push(
        `visual requirement '${requirement.assetId}' is REQUIRED and PRODUCT_OWNER_APPROVED but none of its referenceDossierIds [${requirement.referenceDossierIds.join(", ")}] resolves to a dossier with status APPROVED`,
      );
    }
  }

  for (const asset of assets) {
    if (asset.designSystemVersion !== CURRENT_DESIGN_SYSTEM_VERSION) {
      staleDesignSystemVersionBindings.push(`production asset '${asset.assetId}' v${asset.version} declares designSystemVersion '${asset.designSystemVersion}', current is '${CURRENT_DESIGN_SYSTEM_VERSION}'`);
    }
  }

  const supersededAssetsMarkedEligible: string[] = [];
  const assetsById = new Map<string, ProductionVisualAsset[]>();
  for (const asset of assets) {
    if (!assetsById.has(asset.assetId)) assetsById.set(asset.assetId, []);
    assetsById.get(asset.assetId)!.push(asset);
  }
  for (const [assetId, group] of assetsById) {
    const eligible = group.filter((a) => a.eligibility === "PRODUCTION_ELIGIBLE");
    if (eligible.length > 1) {
      supersededAssetsMarkedEligible.push(`asset '${assetId}' has ${eligible.length} versions marked PRODUCTION_ELIGIBLE simultaneously (versions: ${eligible.map((a) => a.version).join(", ")}) -- exactly one, the current version, may resolve at runtime`);
      continue;
    }
    if (eligible.length === 1) {
      const maxVersion = Math.max(...group.map((a) => a.version));
      if (eligible[0]!.version !== maxVersion) {
        supersededAssetsMarkedEligible.push(`asset '${assetId}' v${eligible[0]!.version} is marked PRODUCTION_ELIGIBLE but a newer v${maxVersion} exists -- the superseded version must not remain runtime-resolvable`);
      }
    }
  }

  return { requiredVisualsWithoutApprovedDossier, staleDesignSystemVersionBindings, supersededAssetsMarkedEligible };
}

export function isVisualGovernanceReportClean(report: VisualGovernanceReport): boolean {
  return (
    report.requiredVisualsWithoutApprovedDossier.length === 0 &&
    report.staleDesignSystemVersionBindings.length === 0 &&
    report.supersededAssetsMarkedEligible.length === 0
  );
}

// ---------------------------------------------------------------------
// Guided Revision plan -> canonical lesson resolution.
// ---------------------------------------------------------------------

export function validateGuidedRevisionPlanLessons(plan: GuidedRevisionPlan, lessonManifest: { readonly lessons: readonly LessonPlan[] }): string[] {
  const realLessonIds = new Set(lessonManifest.lessons.map((l) => l.id));
  const failures: string[] = [];
  for (const item of plan.items) {
    if (!realLessonIds.has(item.lessonId)) {
      failures.push(`Guided Revision plan '${plan.planId}' item rank ${item.rank} references unknown lesson '${item.lessonId}' -- every item must resolve to a production canonical lesson`);
    }
  }
  return failures;
}

export { computeReport as buildReport, formatReport };

function isMainModule(): boolean {
  const entryPoint = process.argv[1];
  if (!entryPoint) return false;
  return fileURLToPath(import.meta.url) === entryPoint;
}

if (isMainModule()) {
  const report = computeReport();
  console.log(formatReport(report));
  const clean = isReportClean(report);
  console.log("");
  console.log(clean ? "PASS: all V1 learning-package governance gates are zero." : "FAIL: one or more V1 learning-package governance gates are non-zero.");
  if (process.argv.includes("--check") && !clean) {
    process.exit(1);
  }
}
