/**
 * CC-06D (Correction B): deterministic generator for the mobile
 * learner-runtime content projection.
 *
 * Authoring model:
 *
 *   governed content (scripts/content/data)
 *     -> THIS deterministic generator
 *     -> generated mobile runtime projection
 *       (apps/mobile/src/lib/lesson-content/generated/mobile-content-projection.ts)
 *
 * replacing the previous "human copies fields into a mobile fixture,
 * equality test prevents drift" model, which could never scale past one
 * lesson. A developer adding/changing governed lesson content regenerates
 * the projection; they never hand-edit a parallel factual mobile file.
 *
 * The projection contains ONLY what the learner runtime needs (the
 * @alp/content-schema `mobileContentProjectionSchema` boundary defined by
 * MOBILE-ARCHITECTURE.md §2): the release's LessonPlans, the governed
 * content they reference (question blueprints, formula families, worked
 * examples, visual aids, diagrams), and the learner-facing assertion/
 * misconception text they resolve at runtime. Authoring/governance/
 * provenance data never ships.
 *
 * Deterministic: same governed input always produces a byte-identical
 * output file (content is selected by id and sorted; no timestamps).
 * A referenced-but-missing dependency fails generation loudly.
 *
 * Usage:
 *   npm run content:mobile:generate   (validate + (re)write the projection)
 *   npm run content:mobile:check      (regenerate and fail if the committed file is stale)
 */

import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  contentReleaseManifestSchema,
  knowledgeGraphManifestSchema,
  lessonPlanManifestSchema,
  mobileContentProjectionSchema,
  pedagogyManifestSchema,
  type ContentRelease,
  type KnowledgeGraphManifest,
  type LessonPlan,
  type MobileContentProjection,
  type PedagogyManifest,
} from "@alp/content-schema";
import { computeLessonContentDependencies } from "@alp/learning-engine";

import { cc04Unit202ElectricalScience } from "./data/cc04-unit202-electrical-science.ts";
import { cc05aPedagogyUnit202 } from "./data/cc05a-pedagogy-unit202.ts";
import { contentReleases, MOBILE_BUNDLED_RELEASE_ID } from "./data/content-releases.ts";
import { lessons } from "./data/lessons.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, "..", "..");

export const PROJECTION_OUTPUT_FILE = "apps/mobile/src/lib/lesson-content/generated/mobile-content-projection.ts";

function byId<T extends { id: string }>(records: readonly T[]): Map<string, T> {
  return new Map(records.map((r) => [r.id, r]));
}

function pickAll<T extends { id: string }>(kind: string, ids: readonly string[], index: Map<string, T>): T[] {
  return [...ids]
    .sort((a, b) => a.localeCompare(b))
    .map((id) => {
      const record = index.get(id);
      if (!record) throw new Error(`mobile projection generation failed: referenced ${kind} '${id}' does not exist in the governed corpus`);
      return record;
    });
}

/**
 * Pure, deterministic projection assembly for one governed release --
 * exported so tests can prove multi-lesson genericity with synthetic
 * inputs without touching the real corpus.
 */
export function buildMobileContentProjection(args: {
  readonly release: ContentRelease;
  readonly allLessons: readonly LessonPlan[];
  readonly pedagogy: PedagogyManifest;
  readonly knowledgeGraph: KnowledgeGraphManifest;
}): MobileContentProjection {
  const { release, allLessons, pedagogy, knowledgeGraph } = args;

  // CC-08A: matched on (id, version, contentRelease===release.id), never
  // id/version alone -- the same immutable lesson content may legitimately
  // be a member of more than one release, so an id/version-only lookup
  // could silently resolve to a DIFFERENT release's entry for the same
  // lesson when more than one exists (see lessonPlanManifestSchema's
  // duplicate-detection comment).
  const memberLessons = [...release.lessons]
    .sort((a, b) => a.lessonId.localeCompare(b.lessonId))
    .map((member) => {
      const lesson = allLessons.find((l) => l.id === member.lessonId && l.version === member.lessonVersion && l.contentRelease === release.id);
      if (!lesson) throw new Error(`mobile projection generation failed: release '${release.id}' declares member '${member.lessonId}@${member.lessonVersion}' but no governed lesson with that id/version claims contentRelease '${release.id}'`);
      return lesson;
    });

  const dependencies = memberLessons.map((lesson) => computeLessonContentDependencies(lesson));
  const union = (select: (d: (typeof dependencies)[number]) => readonly string[]): string[] =>
    [...new Set(dependencies.flatMap(select))].sort((a, b) => a.localeCompare(b));

  const assertionFamilyIds = union((d) => d.assertionFamilyIds);
  const questionBlueprintIds = union((d) => d.questionBlueprintIds);
  const formulaFamilyIds = union((d) => d.formulaFamilyIds);
  const workedExampleIds = union((d) => d.workedExampleBlueprintIds);
  const visualAidIds = union((d) => d.visualAidBlueprintIds);
  const diagramIds = union((d) => d.diagramBlueprintIds);
  const assertionIdentifiers = union((d) => d.assertionIdentifiers);
  const misconceptionIdentifiers = union((d) => d.misconceptionIdentifiers);

  const statementByAssertion = new Map(knowledgeGraph.assertionVersions.map((v) => [v.assertionIdentifier, v.statement]));
  const descriptionByMisconception = new Map(knowledgeGraph.misconceptions.map((m) => [m.identifier, m.description]));

  const assertionStatements: Record<string, string> = {};
  for (const id of assertionIdentifiers) {
    const statement = statementByAssertion.get(id);
    if (!statement) throw new Error(`mobile projection generation failed: referenced assertion '${id}' has no statement in the governed knowledge graph`);
    assertionStatements[id] = statement;
  }
  const misconceptionDescriptions: Record<string, string> = {};
  for (const id of misconceptionIdentifiers) {
    const description = descriptionByMisconception.get(id);
    if (!description) throw new Error(`mobile projection generation failed: referenced misconception '${id}' has no description in the governed knowledge graph`);
    misconceptionDescriptions[id] = description;
  }

  // CC-07: minimal family metadata for on-device family-level mastery
  // derivation -- required capability sets only, never the full governed
  // authoring record.
  const assertionFamilies = pickAll("assertion family", assertionFamilyIds, byId(pedagogy.assertionFamilies)).map((family) => ({
    id: family.id,
    requiredCapabilityIds: family.completeness.requiredCapabilityIds,
    assessmentRequirement: family.assessmentRequirement,
  }));

  const projection: MobileContentProjection = {
    schemaVersion: 2,
    contentRelease: { id: release.id, questionBlueprintVersion: release.questionBlueprintVersion },
    lessons: memberLessons,
    assertionFamilies,
    questionBlueprints: pickAll("question blueprint", questionBlueprintIds, byId(pedagogy.questionBlueprints)),
    formulaFamilies: pickAll("formula family", formulaFamilyIds, byId(pedagogy.formulaFamilies)),
    workedExampleBlueprints: pickAll("worked-example blueprint", workedExampleIds, byId(pedagogy.workedExampleBlueprints)),
    visualAidBlueprints: pickAll("visual-aid blueprint", visualAidIds, byId(pedagogy.visualAidBlueprints)),
    diagramBlueprints: pickAll("diagram blueprint", diagramIds, byId(pedagogy.diagramBlueprints)),
    assertionStatements,
    misconceptionDescriptions,
  };

  // Validate the finished projection against its own governed schema
  // before it is ever written -- generation of an invalid projection is a
  // hard failure, never a committed artefact.
  return mobileContentProjectionSchema.parse(projection);
}

export function renderProjectionModule(projection: MobileContentProjection): string {
  const header = `/**
 * GENERATED FILE -- DO NOT EDIT.
 *
 * Deterministic mobile learner-runtime content projection for governed
 * content release "${projection.contentRelease.id}".
 *
 * Source of truth: the governed content under scripts/content/data.
 * Regenerate with:  npm run content:mobile:generate
 * CI currency gate: npm run content:mobile:check
 *
 * Factual learner-facing content must NEVER be edited here -- edit the
 * governed authoring content and regenerate (CC-06D, Correction B).
 */
import type { MobileContentProjection } from "@alp/content-schema";

export const MOBILE_CONTENT_PROJECTION: MobileContentProjection = `;
  return `${header}${JSON.stringify(projection, null, 2)};\n`;
}

function isMainModule(): boolean {
  const entryPoint = process.argv[1];
  if (!entryPoint) return false;
  return fileURLToPath(import.meta.url) === entryPoint;
}

if (isMainModule()) {
  const releaseManifest = contentReleaseManifestSchema.parse(contentReleases);
  const release = releaseManifest.releases.find((r) => r.id === MOBILE_BUNDLED_RELEASE_ID);
  if (!release) throw new Error(`bundled release '${MOBILE_BUNDLED_RELEASE_ID}' is not declared in the governed release manifest`);

  const projection = buildMobileContentProjection({
    release,
    allLessons: lessonPlanManifestSchema.parse({ lessons }).lessons,
    pedagogy: pedagogyManifestSchema.parse(cc05aPedagogyUnit202),
    knowledgeGraph: knowledgeGraphManifestSchema.parse(cc04Unit202ElectricalScience),
  });

  const outputPath = join(REPO_ROOT, PROJECTION_OUTPUT_FILE);
  writeFileSync(outputPath, renderProjectionModule(projection), "utf8");
  console.log(`Generated ${PROJECTION_OUTPUT_FILE}`);
  console.log(`  release: ${projection.contentRelease.id}`);
  console.log(`  lessons: ${projection.lessons.length}`);
  console.log(`  assertionFamilies: ${projection.assertionFamilies.length}`);
  console.log(`  questionBlueprints: ${projection.questionBlueprints.length}`);
  console.log(`  formulaFamilies: ${projection.formulaFamilies.length}`);
  console.log(`  workedExampleBlueprints: ${projection.workedExampleBlueprints.length}`);
  console.log(`  visualAidBlueprints: ${projection.visualAidBlueprints.length}`);
  console.log(`  diagramBlueprints: ${projection.diagramBlueprints.length}`);
  console.log(`  assertionStatements: ${Object.keys(projection.assertionStatements).length}`);
  console.log(`  misconceptionDescriptions: ${Object.keys(projection.misconceptionDescriptions).length}`);
}
