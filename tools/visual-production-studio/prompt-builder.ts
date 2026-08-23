/**
 * CC-11.5 §10/§11: builds the exact copyable per-asset prompt deterministically
 * from one CatalogueEntry -- never a hand-authored HTML string. Two calls with
 * the same entry always produce byte-identical output (verified in
 * prompt-builder.test.ts), which is what makes "Copy Prompt" trustworthy: the
 * Product Owner can always regenerate the same request if the ChatGPT session
 * needs restarting.
 */

import type { CatalogueEntry } from "./catalogue.ts";

function bulletList(items: string[]): string {
  if (items.length === 0) return "  (none declared)";
  return items.map((item) => `  - ${item}`).join("\n");
}

function referenceBlock(label: string, ref: CatalogueEntry["primaryReference"]): string {
  const lines = [`${label}: ${ref.sourceName}`];
  if (ref.sourceUrl) lines.push(`  URL: ${ref.sourceUrl}`);
  lines.push(`  Licence/status: ${ref.licence}`);
  lines.push(`  Reference quality grade: ${ref.qualityGrade}`);
  return lines.join("\n");
}

/**
 * CC-11.5 §11's CRITICAL PROMPT RULE, reproduced verbatim in every generated
 * prompt regardless of asset -- the master prompt states it once as a
 * standing instruction, but this is deliberately repeated per-asset so a
 * ChatGPT session that only ever sees individual prompts (master prompt
 * scrolled out of context) still carries the rule.
 */
const CRITICAL_DIRECTION_RULE = `CRITICAL RULE FOR THIS REQUEST:
Do NOT rely on the text label of an arrow or diagram to infer correctness.
Where direction matters:
  - inspect the actual geometry you have drawn;
  - inspect arrowheads specifically;
  - compare directly against the supplied reference;
  - do not claim the illustration is correct merely because a caption says it is.
If the output is not demonstrably correct on inspection, edit/revise it before presenting it to me.`;

export function buildAssetPrompt(entry: CatalogueEntry): string {
  if (entry.referenceReadiness === "NOT_READY") {
    return [
      `ASSET ${entry.sequence} -- ${entry.assetId}`,
      `"${entry.displayName}"`,
      "",
      "THIS ASSET IS BLOCKED: no primary reference has been approved yet.",
      "Do not request artwork for this asset. Source and approve a primary reference in the Studio first.",
    ].join("\n");
  }

  const lines: string[] = [];
  lines.push(`ASSET ${entry.sequence} -- ${entry.assetId}`);
  lines.push(`"${entry.displayName}"`);
  lines.push(`Production class: ${entry.productionClassLabel}`);
  lines.push(`Priority: ${entry.priorityLabel}`);
  if (entry.loOrLesson) lines.push(`Curriculum context: ${entry.loOrLesson}`);
  lines.push("");
  lines.push("INSTRUCTIONAL PURPOSE:");
  lines.push(entry.instructionalPurpose);
  lines.push("");
  lines.push(referenceBlock("PRIMARY REFERENCE (technical/pedagogical authority -- do not copy stylistically)", entry.primaryReference));
  if (entry.secondaryReference) {
    lines.push("");
    lines.push(referenceBlock("SECONDARY / CROSS-CHECK REFERENCE", entry.secondaryReference));
  }
  lines.push("");
  lines.push("IMMUTABLE TECHNICAL FACTS (must be reproduced exactly, never adjusted for composition):");
  lines.push(bulletList(entry.immutableFacts));
  lines.push("");
  lines.push("YOU MAY FREELY DESIGN (generated-artwork responsibility):");
  lines.push(bulletList(entry.creativeFreedoms));
  lines.push("");
  lines.push("REMAINS DETERMINISTIC / NOT YOUR RESPONSIBILITY (ALP's own tooling adds these separately):");
  lines.push(bulletList(entry.deterministicOverlayResponsibilities));
  lines.push("");
  lines.push("PROHIBITED CHANGES:");
  lines.push(bulletList(entry.prohibitedChanges));
  if (entry.assessmentNote) {
    lines.push("");
    lines.push(`ASSESSMENT NOTE: ${entry.assessmentNote}`);
  }
  lines.push("");
  lines.push("EXACT REQUESTED DELIVERABLE:");
  lines.push(entry.exactDeliverable);
  lines.push("");
  lines.push(CRITICAL_DIRECTION_RULE);

  return lines.join("\n");
}
