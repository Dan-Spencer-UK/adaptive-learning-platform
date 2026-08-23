/**
 * CC-11.3 (task brief §27): the smallest GENERIC visual-completeness gate.
 *
 * check-visual-governance.ts already proves that every governed
 * DiagramBlueprint that HAS a renderer also has a contract, canonical
 * variants and no answer leakage -- but it starts from the blueprint, not
 * the lesson. It cannot catch "this lesson step declares a REQUIRED
 * visual that turns out to be unrenderable/uncontracted/unconventioned",
 * because it never looks at lesson content at all. This script closes
 * that gap so a future course can never go green merely because "every
 * DiagramBlueprint that happens to exist has a renderer" -- it must also
 * be true that every lesson step claiming a diagram actually gets a real,
 * governed, rendered, contracted one.
 *
 * "REQUIRED visual" here is not a subjective judgement call re-litigated
 * mechanically (that classification is a human/pedagogical decision made
 * once, during content authoring) -- it is the mechanically observable
 * fact that a lesson step's `representation.diagramBlueprintId` is set.
 * A step that sets this field is, definitionally, declaring "this
 * instructional point REQUIRES a visual". For every such declaration this
 * script verifies the five things task brief §27 names:
 *   1. the governed DiagramBlueprint asset exists in the CC-05A corpus
 *   2. the lesson step's reference resolves to it (true by construction,
 *      checked here only to catch a typo'd/rewritten corpus id)
 *   3. a real apps/mobile renderer exists for it
 *   4. a VisualSemanticContract exists for it
 *   5. where the blueprint's type is `component_symbol`, its contract
 *      declares an approved `symbolStandard` (UK/IEC), never an
 *      unapproved/unstated convention
 *
 * Only the CURRENT (highest-version) object per lesson id is checked --
 * frozen historical snapshots are immutable by design (see
 * content-releases.ts) and can never gain a visual retroactively.
 *
 * Usage:
 *   node scripts/visual-governance/check-visual-completeness.ts            (report)
 *   node scripts/visual-governance/check-visual-completeness.ts --check     (exit 1 on any failure)
 */

import { fileURLToPath } from "node:url";

import { lessonPlanSchema, pedagogyManifestSchema, visualSemanticContractSchema, type LessonPlan } from "@alp/content-schema";

import { lessons as rawLessons } from "../content/data/lessons.ts";
import { cc05aPedagogyUnit202 } from "../content/data/cc05a-pedagogy-unit202.ts";
import { visualSemanticContracts } from "./data/cc05d-visual-contracts-unit202.ts";
import { RENDERED_DIAGRAM_BLUEPRINT_IDS } from "./check-visual-governance.ts";

export interface RequiredVisualFinding {
  lessonId: string;
  stepId: string;
  diagramBlueprintId: string;
}

export interface VisualCompletenessReport {
  totalCurrentLessons: number;
  totalRequiredVisualDeclarations: number;
  requiredVisualsWithNoAsset: RequiredVisualFinding[];
  requiredVisualsWithNoRenderer: RequiredVisualFinding[];
  requiredVisualsWithNoContract: RequiredVisualFinding[];
  requiredSymbolVisualsWithUnapprovedConvention: RequiredVisualFinding[];
  lessonsWithNoDiagramReference: string[];
}

/**
 * Keeps only the CURRENT LessonPlan object per lesson `id`. Frozen
 * historical snapshots and their current successors deliberately share
 * the same `id` (and even the same `version` -- lesson version numbers
 * track structural schema revisions, not release history) so a lesson's
 * `version` field cannot be used to pick the current one. Release history
 * in this corpus is instead expressed by array position:
 * scripts/content/data/lessons.ts appends each content release's block
 * strictly after the previous one, so the LAST occurrence of a given id
 * is always its current, live content -- exactly the object this check
 * must validate (never a frozen historical snapshot, which can never
 * gain a visual retroactively).
 */
function currentLessonsById(all: LessonPlan[]): LessonPlan[] {
  const byId = new Map<string, LessonPlan>();
  for (const lesson of all) byId.set(lesson.id, lesson);
  return [...byId.values()];
}

export function buildReport(): VisualCompletenessReport {
  const lessons = currentLessonsById(rawLessons.map((l) => lessonPlanSchema.parse(l)));
  const pedagogy = pedagogyManifestSchema.parse(cc05aPedagogyUnit202);
  const contracts = visualSemanticContracts.map((c) => visualSemanticContractSchema.parse(c));

  const diagramBlueprintById = new Map(pedagogy.diagramBlueprints.map((d) => [d.id, d]));
  const contractByBlueprintId = new Map(contracts.map((c) => [c.diagramBlueprintId, c]));

  const requiredVisualsWithNoAsset: RequiredVisualFinding[] = [];
  const requiredVisualsWithNoRenderer: RequiredVisualFinding[] = [];
  const requiredVisualsWithNoContract: RequiredVisualFinding[] = [];
  const requiredSymbolVisualsWithUnapprovedConvention: RequiredVisualFinding[] = [];
  const lessonsWithNoDiagramReference: string[] = [];
  let totalRequiredVisualDeclarations = 0;

  for (const lesson of lessons) {
    let lessonHasDiagramRef = false;

    for (const step of lesson.steps) {
      const blueprintId = step.representation.diagramBlueprintId;
      if (!blueprintId) continue;

      lessonHasDiagramRef = true;
      totalRequiredVisualDeclarations += 1;
      const finding: RequiredVisualFinding = { lessonId: lesson.id, stepId: step.id, diagramBlueprintId: blueprintId };

      const blueprint = diagramBlueprintById.get(blueprintId);
      if (!blueprint) {
        requiredVisualsWithNoAsset.push(finding);
        continue;
      }
      if (!RENDERED_DIAGRAM_BLUEPRINT_IDS.has(blueprintId)) {
        requiredVisualsWithNoRenderer.push(finding);
      }
      const contract = contractByBlueprintId.get(blueprintId);
      if (!contract) {
        requiredVisualsWithNoContract.push(finding);
        continue;
      }
      if (blueprint.type === "component_symbol" && contract.symbolStandard !== "UK_IEC") {
        requiredSymbolVisualsWithUnapprovedConvention.push(finding);
      }
    }

    if (!lessonHasDiagramRef) lessonsWithNoDiagramReference.push(lesson.id);
  }

  return {
    totalCurrentLessons: lessons.length,
    totalRequiredVisualDeclarations,
    requiredVisualsWithNoAsset,
    requiredVisualsWithNoRenderer,
    requiredVisualsWithNoContract,
    requiredSymbolVisualsWithUnapprovedConvention,
    lessonsWithNoDiagramReference,
  };
}

export function isReportClean(report: VisualCompletenessReport): boolean {
  return (
    report.requiredVisualsWithNoAsset.length === 0 &&
    report.requiredVisualsWithNoRenderer.length === 0 &&
    report.requiredVisualsWithNoContract.length === 0 &&
    report.requiredSymbolVisualsWithUnapprovedConvention.length === 0
  );
}

function formatFinding(f: RequiredVisualFinding): string {
  return `${f.lessonId}.step.${f.stepId} -> ${f.diagramBlueprintId}`;
}

export function formatReport(report: VisualCompletenessReport): string {
  const lines: string[] = [];
  lines.push("CC-11.3 whole-course visual-completeness mechanical report");
  lines.push("=============================================================");
  lines.push(`Current (live) lessons checked: ${report.totalCurrentLessons}`);
  lines.push(`REQUIRED-visual declarations found (steps with representation.diagramBlueprintId set): ${report.totalRequiredVisualDeclarations}`);
  lines.push("");
  lines.push(`Required visuals with no governed asset (target 0, FATAL): ${report.requiredVisualsWithNoAsset.length}`);
  if (report.requiredVisualsWithNoAsset.length) lines.push(`    ${report.requiredVisualsWithNoAsset.map(formatFinding).join("; ")}`);
  lines.push(`Required visuals with no renderer (target 0, FATAL): ${report.requiredVisualsWithNoRenderer.length}`);
  if (report.requiredVisualsWithNoRenderer.length) lines.push(`    ${report.requiredVisualsWithNoRenderer.map(formatFinding).join("; ")}`);
  lines.push(`Required visuals with no semantic contract (target 0, FATAL): ${report.requiredVisualsWithNoContract.length}`);
  if (report.requiredVisualsWithNoContract.length) lines.push(`    ${report.requiredVisualsWithNoContract.map(formatFinding).join("; ")}`);
  lines.push(`Required UK/IEC symbol visuals using an unapproved/unstated convention (target 0, FATAL): ${report.requiredSymbolVisualsWithUnapprovedConvention.length}`);
  if (report.requiredSymbolVisualsWithUnapprovedConvention.length) {
    lines.push(`    ${report.requiredSymbolVisualsWithUnapprovedConvention.map(formatFinding).join("; ")}`);
  }
  lines.push("");
  lines.push(`Lessons with zero diagram references (informational only -- NOT_NEEDED/USEFUL-deferred is a legitimate outcome, not a failure): ${report.lessonsWithNoDiagramReference.length}`);
  lines.push(`    ${report.lessonsWithNoDiagramReference.join(", ")}`);
  return lines.join("\n");
}

function isMainModule(): boolean {
  const entryPoint = process.argv[1];
  if (!entryPoint) return false;
  return fileURLToPath(import.meta.url) === entryPoint;
}

if (isMainModule()) {
  const report = buildReport();
  console.log(formatReport(report));
  const clean = isReportClean(report);
  console.log("");
  console.log(clean ? "PASS: every REQUIRED (lesson-declared) visual is a real, rendered, contracted, conventioned asset." : "FAIL: one or more REQUIRED-visual completeness gates are non-zero.");
  if (process.argv.includes("--check") && !clean) {
    process.exit(1);
  }
}
