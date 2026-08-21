/**
 * Human-readable Markdown review of every governed canonical Lesson Plan
 * -- the Product Owner review artefact task brief §20/§24 asks for.
 * Resolves every governed reference (assertion/family/capability/
 * misconception/question-blueprint/formula-family id) to its real
 * statement/description from the live corpus so a reviewer never has to
 * cross-reference ids by hand, without restating that content anywhere
 * except this generated, always-regenerated report (mirrors
 * generate-corpus-review.ts's discipline: this is development/review
 * evidence, not a learner-facing artefact, generated deterministically
 * from the same manifests validate-lesson-plan.ts checks, so it can
 * never silently drift from the actual governed lesson).
 *
 * Usage: node scripts/content/generate-lesson-review.ts
 */

import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

import { knowledgeGraphManifestSchema, pedagogyManifestSchema, lessonPlanManifestSchema, type LessonPlan, type LessonStep } from "@alp/content-schema";

import { cc04Unit202ElectricalScience } from "./data/cc04-unit202-electrical-science.ts";
import { cc05aPedagogyUnit202 } from "./data/cc05a-pedagogy-unit202.ts";
import { lessons } from "./data/lessons.ts";

const OUTPUT_FILE = "scripts/content/evidence/lesson-plan-review.md";

function buildReport(): string {
  const corpus = knowledgeGraphManifestSchema.parse(cc04Unit202ElectricalScience);
  const pedagogy = pedagogyManifestSchema.parse(cc05aPedagogyUnit202);
  const manifest = lessonPlanManifestSchema.parse({ lessons });

  const statementByAssertionId = new Map(corpus.assertionVersions.map((v) => [v.assertionIdentifier, v.statement]));
  const descriptionByMisconceptionId = new Map(corpus.misconceptions.map((m) => [m.identifier, m.description]));
  const descriptionByCapabilityId = new Map(pedagogy.capabilities.map((c) => [c.id, c.description]));
  const titleByQuestionBlueprintId = new Map(pedagogy.questionBlueprints.map((q) => [q.id, q.title]));
  const canonicalTargetByFormulaFamilyId = new Map(pedagogy.formulaFamilies.map((f) => [f.id, f.canonicalTarget]));

  const lines: string[] = [];
  lines.push("# Lesson Plan review");
  lines.push("");
  lines.push(
    "Generated from `@alp/content-schema`'s governed `LessonPlan` manifest and the live CC-05A/CC-04 corpus. Not hand-edited -- regenerate with `node scripts/content/generate-lesson-review.ts`.",
  );
  lines.push("");
  lines.push(`Lessons: ${manifest.lessons.length}`);
  lines.push("");

  for (const lesson of manifest.lessons) {
    writeLessonSection(lesson);
  }

  return lines.join("\n") + "\n";

  function resolveAssertions(ids: readonly string[]): string {
    if (ids.length === 0) return "&mdash;";
    return ids.map((id) => `**${id}**: ${statementByAssertionId.get(id) ?? "(unknown assertion)"}`).join("; ");
  }

  function resolveCapabilities(ids: readonly string[]): string {
    if (ids.length === 0) return "&mdash;";
    return ids.map((id) => `**${id}**: ${descriptionByCapabilityId.get(id) ?? "(unknown capability)"}`).join("; ");
  }

  function resolveMisconceptions(targets: LessonStep["misconceptionTargets"]): string {
    if (targets.length === 0) return "&mdash;";
    return targets
      .map((t) => `**${t.misconceptionIdentifier}** (${t.evidenceStrength}): ${descriptionByMisconceptionId.get(t.misconceptionIdentifier) ?? "(unknown misconception)"}`)
      .join("; ");
  }

  function resolveRepresentation(rep: LessonStep["representation"]): string {
    const parts: string[] = [];
    if (rep.formulaFamilyId) parts.push(`formula family \`${rep.formulaFamilyId}\` (canonical target ${canonicalTargetByFormulaFamilyId.get(rep.formulaFamilyId) ?? "?"})`);
    if (rep.diagramBlueprintId) parts.push(`diagram \`${rep.diagramBlueprintId}\``);
    if (rep.workedExampleBlueprintId) parts.push(`worked example \`${rep.workedExampleBlueprintId}\``);
    if (rep.visualAidBlueprintId) parts.push(`visual aid \`${rep.visualAidBlueprintId}\``);
    return parts.length ? parts.join(", ") : "&mdash;";
  }

  function writeLessonSection(lesson: LessonPlan): void {
    lines.push(`## ${lesson.title} (\`${lesson.id}\`, v${lesson.version})`);
    lines.push("");
    lines.push(lesson.learnerFacingDescription);
    lines.push("");
    lines.push(`- **Curriculum unit:** ${lesson.curriculumUnit}`);
    lines.push(`- **Estimated duration:** ${lesson.estimatedDurationMinutes} minutes`);
    lines.push(`- **Instructional strategy:** ${lesson.instructionalStrategy}`);
    lines.push(`- **Prerequisite knowledge (assertion families):** ${lesson.prerequisiteKnowledge.join(", ") || "&mdash;"}`);
    lines.push(`- **Target assertion families:** ${lesson.targetAssertionFamilyIds.join(", ")}`);
    lines.push(`- **Target assertions:** ${resolveAssertions(lesson.targetAssertionIdentifiers)}`);
    lines.push(`- **Target capabilities:** ${resolveCapabilities(lesson.targetCapabilityIds)}`);
    lines.push(`- **Misconceptions actively targeted by this lesson:** ${resolveMisconceptions(lesson.misconceptionTargets)}`);
    lines.push(`- **Presentation modes:** ${lesson.presentationModes.join(", ")}`);
    lines.push(`- **Content release:** \`${lesson.contentRelease}\``);
    lines.push("");

    lines.push(`### Canonical step sequence (${lesson.steps.length} steps)`);
    lines.push("");
    lines.push("| # | Step | Type | Requirement | Purpose |");
    lines.push("|---|---|---|---|---|");
    lesson.steps.forEach((step, index) => {
      lines.push(`| ${index + 1} | \`${step.id}\` | ${step.type} | ${step.requirement} | ${step.purpose} |`);
    });
    lines.push("");

    lines.push("### Step detail");
    lines.push("");
    for (const step of lesson.steps) {
      lines.push(`#### \`${step.id}\` -- ${step.type}`);
      lines.push("");
      lines.push(step.purpose);
      lines.push("");
      lines.push(`- **Teaches:** ${resolveAssertions(step.teaches)}`);
      lines.push(`- **Reinforces:** ${resolveAssertions(step.reinforces)}`);
      lines.push(`- **Tests:** ${resolveAssertions(step.tests)}`);
      lines.push(`- **Capabilities:** ${resolveCapabilities(step.capabilityIds)}`);
      lines.push(`- **Misconceptions:** ${resolveMisconceptions(step.misconceptionTargets)}`);
      lines.push(`- **Representation:** ${resolveRepresentation(step.representation)}`);
      lines.push(
        `- **Question/interaction:** ${step.questionBlueprintId ? `\`${step.questionBlueprintId}\` -- ${titleByQuestionBlueprintId.get(step.questionBlueprintId) ?? "(unknown question blueprint)"}` : "&mdash;"}`,
      );
      lines.push(
        `- **Interaction:** required=${step.presentation.interactionRequired}${step.presentation.interactionRole ? `, role=${step.presentation.interactionRole}` : ""}, answerReveal=${step.presentation.answerReveal}${step.presentation.contentMayScroll ? ", contentMayScroll" : ""}`,
      );
      lines.push(`- **Scaffolding / cognitive demand:** ${step.scaffoldingLevel} / ${step.cognitiveDemand}`);
      lines.push(`- **Feedback:** ${step.feedback.mode}${step.feedback.explainWhy ? " (explains why)" : ""}`);
      lines.push(`- **Completion condition:** ${step.completionCondition}`);
      if (step.branchRoutes.length > 0) {
        lines.push(
          `- **Branch routes:** ${step.branchRoutes
            .map((r) => `on \`${r.trigger}\`${r.misconceptionIdentifier ? ` (\`${r.misconceptionIdentifier}\`)` : ""} -> \`${r.destinationStepId}\` -- ${r.description}`)
            .join("; ")}`,
        );
      }
      lines.push("");
    }

    lines.push("### Completion criteria");
    lines.push("");
    lines.push(`- **Required steps:** ${lesson.completionCriteria.requiredStepIds.map((id) => `\`${id}\``).join(", ")}`);
    lines.push(`- **Required capability evidence:** ${resolveCapabilities(lesson.completionCriteria.requiredCapabilityEvidence)}`);
    lines.push(`- **Requires remediation clearance:** ${lesson.completionCriteria.requiresRemediationClearance}`);
    lines.push(`- **Exit summary:** ${lesson.completionCriteria.exitSummary}`);
    lines.push("");
  }
}

export { buildReport };

function isMainModule(): boolean {
  const entryPoint = process.argv[1];
  if (!entryPoint) return false;
  return fileURLToPath(import.meta.url) === entryPoint;
}

if (isMainModule()) {
  const report = buildReport();
  const outputPath = join(import.meta.dirname, "..", "..", OUTPUT_FILE);
  writeFileSync(outputPath, report, "utf8");
  console.log(`Lesson plan review written to ${OUTPUT_FILE} (${report.length} bytes).`);
}
