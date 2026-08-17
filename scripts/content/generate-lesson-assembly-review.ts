/**
 * Human-readable Markdown review of the deterministic lesson-assembly
 * engine's (@alp/learning-engine) decisions for representative learner
 * scenarios (task brief §19/§23) -- shows, per step, whether it was
 * included or omitted and why, so a Product Owner can review adaptive
 * behaviour without reading engine code. Mirrors
 * generate-lesson-review.ts's discipline (regenerated deterministically
 * from the same real lesson + engine this repo already tests against,
 * never hand-edited).
 *
 * REAL vs SYNTHETIC is labelled explicitly per scenario throughout --
 * see scripts/content/prove-lesson-assembly.ts's header comment for
 * which scenarios use real governed content and which use small,
 * clearly-marked synthetic fixtures (task brief §20: never let a
 * synthetic result be mistaken for real content coverage).
 *
 * Usage: node scripts/content/generate-lesson-assembly-review.ts
 */

import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

import {
  ASSEMBLY_POLICY_VERSION,
  assembleLessonInstance,
  resolveWithinSessionBranch,
  type AssembledStepDecision,
  type AssemblyContext,
  type LearnerEvidenceSnapshot,
  type LessonAssemblyResult,
} from "@alp/learning-engine";
import { LESSON_OHMS_LAW, lessons as realLessons } from "./data/lesson-ohms-law.ts";
import {
  REAL_CONTENT_GAPS,
  SYNTHETIC_PREREQ_REMEDIATION,
  buildSyntheticRetrievalLesson,
  buildSyntheticSkipLesson,
} from "./prove-lesson-assembly.ts";

const OUTPUT_FILE = "scripts/content/evidence/lesson-assembly-review.md";

function evidence(overrides: Partial<LearnerEvidenceSnapshot> = {}): LearnerEvidenceSnapshot {
  return {
    learnerId: "learner.review",
    capabilityStatus: new Map(),
    misconceptionsEvidenced: new Set(),
    retrievalDue: new Set(),
    ...overrides,
  };
}

function decisionTable(decisions: readonly AssembledStepDecision[]): string {
  const lines = ["| Step | Included | Reason | Detail |", "|---|---|---|---|"];
  for (const d of decisions) {
    lines.push(`| \`${d.stepId}\` | ${d.included ? "included" : "OMITTED"} | ${d.reason} | ${d.detail} |`);
  }
  return lines.join("\n");
}

function renderResult(result: LessonAssemblyResult): string {
  if (result.status === "ready") {
    return [`Status: **ready** -- instance \`${result.instance.instanceId}\` (${result.instance.includedStepIds.length}/${result.instance.stepDecisions.length} steps included)`, "", decisionTable(result.instance.stepDecisions)].join("\n");
  }
  if (result.status === "prerequisite_required") {
    return [
      `Status: **prerequisite_required** -- unmet family \`${result.unmetFamilyId}\`; main lesson \`${result.mainLessonPending.id}\` deferred until the prerequisite is cleared.`,
      "",
      `Prerequisite instance \`${result.prerequisiteInstance.instanceId}\` (lesson \`${result.prerequisiteInstance.lessonId}\`):`,
      "",
      decisionTable(result.prerequisiteInstance.stepDecisions),
    ].join("\n");
  }
  return [`Status: **prerequisite_unresolved** -- ${result.unresolved.map((u) => `\`${u.assertionFamilyId}\` (${u.reason})`).join(", ")}. The learner is not silently taught as if the weakness did not exist.`].join("\n");
}

function buildReport(): string {
  const lines: string[] = [];
  lines.push("# Lesson assembly review");
  lines.push("");
  lines.push(
    "Generated from `@alp/learning-engine`'s deterministic assembler against the live canonical Ohm's Law lesson, plus small clearly-labelled SYNTHETIC fixtures where the real lesson does not exercise a mechanism. Not hand-edited -- regenerate with `node scripts/content/generate-lesson-assembly-review.ts`. See `npm run lesson:assembly:prove` for the machine-checked pass/fail gate this review is drawn from.",
  );
  lines.push("");

  const realContext: AssemblyContext = { assemblyPolicyVersion: ASSEMBLY_POLICY_VERSION, allLessons: realLessons };

  // -- A: new learner, REAL --------------------------------------------------
  lines.push("## Scenario A -- new learner (REAL content)");
  lines.push("");
  lines.push("No prior evidence at all. Every required real step is included; the misconception-triggered remediation step is correctly excluded from the pre-session sequence (it is only reachable via within-session branching).");
  lines.push("");
  lines.push(renderResult(assembleLessonInstance(LESSON_OHMS_LAW, evidence(), realContext)));
  lines.push("");

  // -- C/D: misconceptions, REAL, within-session branching --------------------
  lines.push("## Scenarios C & D -- misconception-specific within-session routing (REAL content)");
  lines.push("");
  lines.push("Pre-session assembly is identical to Scenario A (every misconception-check step is `required`; only the resulting *within-session* branch differs). This shows `resolveWithinSessionBranch`'s real routing decisions once a specific governed misconception is evidenced -- not a whole-lesson reassembly.");
  lines.push("");
  lines.push("| Completed step | Observed outcome | Routes to |");
  lines.push("|---|---|---|");
  lines.push(
    `| \`misconception_check_wrong_operation\` | misconception \`MIS-EL-OHM-WRONG-OPERATION-001\` detected | \`${resolveWithinSessionBranch(LESSON_OHMS_LAW, "misconception_check_wrong_operation", { trigger: "misconception_detected", misconceptionIdentifier: "MIS-EL-OHM-WRONG-OPERATION-001" })}\` |`,
  );
  lines.push(
    `| \`misconception_check_wrong_operation\` | plain wrong answer (no specific misconception evidenced) | ${resolveWithinSessionBranch(LESSON_OHMS_LAW, "misconception_check_wrong_operation", { trigger: "misconception_detected" }) ?? "*(no route -- continues to next step)*"} |`,
  );
  lines.push(
    `| \`misconception_check_rearrangement\` | misconception \`MIS-EL-OHM-REARRANGE-ERROR-001\` detected | \`${resolveWithinSessionBranch(LESSON_OHMS_LAW, "misconception_check_rearrangement", { trigger: "misconception_detected", misconceptionIdentifier: "MIS-EL-OHM-REARRANGE-ERROR-001" })}\` |`,
  );
  lines.push(
    `| \`remediation_rearrangement\` | remediation cleared | \`${resolveWithinSessionBranch(LESSON_OHMS_LAW, "remediation_rearrangement", { trigger: "remediation_cleared" })}\` |`,
  );
  lines.push("");

  // -- E: prerequisite weakness, REAL half + SYNTHETIC half --------------------
  lines.push("## Scenario E -- prerequisite weakness");
  lines.push("");
  lines.push("**[REAL]** With only the live corpus (no governed remediation lesson yet targets any of the real lesson's prerequisite families):");
  lines.push("");
  lines.push(renderResult(assembleLessonInstance(LESSON_OHMS_LAW, evidence({ capabilityStatus: new Map([["foundational.algebraic_technique", "WEAK"]]) }), realContext)));
  lines.push("");
  lines.push("**[SYNTHETIC]** With a synthetic remediation lesson added to the manifest (proves the mechanism resolves to an actual remediation lesson's own assembled sequence, not just reports the family id):");
  lines.push("");
  lines.push(
    renderResult(
      assembleLessonInstance(
        LESSON_OHMS_LAW,
        evidence({ capabilityStatus: new Map([["foundational.algebraic_technique", "WEAK"]]) }),
        { assemblyPolicyVersion: ASSEMBLY_POLICY_VERSION, allLessons: [LESSON_OHMS_LAW, SYNTHETIC_PREREQ_REMEDIATION] },
      ),
    ),
  );
  lines.push("");

  // -- G: same-input replay, REAL ----------------------------------------------
  lines.push("## Scenario G -- same-input replay (REAL content)");
  lines.push("");
  const replayA = assembleLessonInstance(LESSON_OHMS_LAW, evidence({ learnerId: "learner.replay" }), realContext);
  const replayB = assembleLessonInstance(LESSON_OHMS_LAW, evidence({ learnerId: "learner.replay" }), realContext);
  const sameInstanceId = replayA.status === "ready" && replayB.status === "ready" && replayA.instance.instanceId === replayB.instance.instanceId;
  lines.push(`Two independent assemblies of the same lesson with identical evidence: ${sameInstanceId ? `same instance id \`${replayA.status === "ready" ? replayA.instance.instanceId : ""}\` both times.` : "**DIVERGED -- this would be a bug.**"}`);
  lines.push("");

  // -- B: skip-if-mastered, SYNTHETIC only --------------------------------------
  lines.push("## Scenario B -- skip-if-mastered (SYNTHETIC ONLY)");
  lines.push("");
  lines.push("The real Ohm's Law lesson has no `conditional_skip_if_mastered` step (task brief §7/§20: never distort real content to exercise a mechanism it doesn't have). This uses a small synthetic fixture lesson instead.");
  lines.push("");
  const skipLesson = buildSyntheticSkipLesson();
  const skipContext: AssemblyContext = { assemblyPolicyVersion: ASSEMBLY_POLICY_VERSION, allLessons: [skipLesson] };
  lines.push("Strong returning learner (`TRANSFER_SECURE`):");
  lines.push("");
  lines.push(renderResult(assembleLessonInstance(skipLesson, evidence({ capabilityStatus: new Map([["cap.synthetic.skip_target", "TRANSFER_SECURE"]]) }), skipContext)));
  lines.push("");
  lines.push("Not-yet-mastered learner (`EMERGING`):");
  lines.push("");
  lines.push(renderResult(assembleLessonInstance(skipLesson, evidence({ capabilityStatus: new Map([["cap.synthetic.skip_target", "EMERGING"]]) }), skipContext)));
  lines.push("");

  // -- F: retrieval due, SYNTHETIC only ------------------------------------------
  lines.push("## Scenario F -- retrieval due (SYNTHETIC ONLY)");
  lines.push("");
  lines.push("The real lesson's `retrieval_check` step is deliberately `required` (unconditional distributed practice), not conditional on a due schedule. This uses a small synthetic fixture lesson instead.");
  lines.push("");
  const retrievalLesson = buildSyntheticRetrievalLesson();
  const retrievalContext: AssemblyContext = { assemblyPolicyVersion: ASSEMBLY_POLICY_VERSION, allLessons: [retrievalLesson] };
  lines.push("Retrieval tag due:");
  lines.push("");
  lines.push(renderResult(assembleLessonInstance(retrievalLesson, evidence({ retrievalDue: new Set(["synthetic.retrieval_tag"]) }), retrievalContext)));
  lines.push("");
  lines.push("Nothing due:");
  lines.push("");
  lines.push(renderResult(assembleLessonInstance(retrievalLesson, evidence(), retrievalContext)));
  lines.push("");

  // -- Real-content gaps ----------------------------------------------------------
  lines.push("## Real-content gaps (mechanism proven; not yet exercised by real governed content)");
  lines.push("");
  for (const gap of REAL_CONTENT_GAPS) lines.push(`- ${gap}`);
  lines.push("");

  return lines.join("\n") + "\n";
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
  console.log(`Lesson assembly review written to ${OUTPUT_FILE} (${report.length} bytes).`);
}
