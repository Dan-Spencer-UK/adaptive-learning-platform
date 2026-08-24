/**
 * CC-11.6 §8: builds the exact copyable ASSET-SPECIFIC PROMPT
 * deterministically from one VisualAsset plus its containing VisualFamily
 * -- never a hand-authored HTML string. Two calls with the same asset
 * always produce byte-identical output (verified in
 * prompt-builder.test.ts). The Studio exposes exactly two prompt layers
 * (master-prompt.ts's MASTER ART SESSION PROMPT, used once, and this
 * builder's ASSET-SPECIFIC PROMPT, used once per asset) -- this file
 * never repeats the master prompt's own content.
 */

import type { VisualAsset, VisualFamily } from "./catalogue.ts";
import { familyForAsset, visualNeedClassificationFor } from "./catalogue.ts";

function bulletList(items: string[]): string {
  if (items.length === 0) return "  (none declared)";
  return items.map((item) => `  - ${item}`).join("\n");
}

function referenceBlock(label: string, ref: VisualAsset["primaryReference"]): string {
  const lines = [`${label}: ${ref.sourceName}`];
  if (ref.sourceUrl) lines.push(`  URL: ${ref.sourceUrl}`);
  lines.push(`  Licence/status: ${ref.licence}`);
  lines.push(`  Reference quality grade: ${ref.qualityGrade}`);
  return lines.join("\n");
}

/**
 * CC-11.6 §11's CRITICAL PROMPT RULE, reproduced verbatim in every
 * generated prompt regardless of asset -- the master prompt states it
 * once as a standing instruction, but this is deliberately repeated
 * per-asset so a ChatGPT session that only ever sees individual prompts
 * (master prompt scrolled out of context) still carries the rule.
 */
const CRITICAL_DIRECTION_RULE = `CRITICAL RULE FOR THIS REQUEST:
Do NOT rely on the text label of an arrow or diagram to infer correctness.
Where direction matters:
  - inspect the actual geometry you have drawn;
  - inspect arrowheads specifically;
  - compare directly against the supplied reference;
  - do not claim the illustration is correct merely because a caption says it is.
If the output is not demonstrably correct on inspection, edit/revise it before presenting it to me.`;

/**
 * Product Owner correction (ANNOTATION FOLLOWS PEDAGOGICAL STATE, recorded
 * in docs/architecture/PREMIUM-INSTRUCTIONAL-VISUAL-PRODUCTION-PIPELINE.md):
 * every prompt must tell the art session explicitly whether explanatory
 * labels are REQUIRED, PERMITTED-but-non-revealing, or should be OMITTED
 * -- never left implicit, and never a blanket "no labels" default.
 */
function annotationInstruction(asset: VisualAsset): string {
  if (asset.annotationPolicy === "TEACHING_EXPLANATORY") {
    const labels = asset.requiredLabels.length > 0 ? asset.requiredLabels.join(", ") : "(none specifically named -- use your judgement for what materially aids understanding)";
    return `LABELS FOR THIS ASSET: REQUIRED. This is a TEACHING asset -- clear, concise explanatory labels/callouts are encouraged, not something to omit for visual cleanliness. Include: ${labels}.`;
  }
  if (asset.annotationPolicy === "FEEDBACK_EXPLANATORY") {
    return "LABELS FOR THIS ASSET: PERMITTED, explanatory/answer-revealing. This is a FEEDBACK asset -- it may reveal the correct answer, explanatory labels, or why a distractor was wrong.";
  }
  if (asset.annotationPolicy === "ASSESSMENT_NON_REVEALING") {
    return "LABELS FOR THIS ASSET: PERMITTED, but ONLY neutral stimulus information (e.g. A/B/C identifiers, given dimensions, supplied values, axes/units). NEVER include any label, arrow or annotation that reveals the answer the learner is being asked to determine.";
  }
  return "LABELS FOR THIS ASSET: OMIT. This is a clean base layer for a separate deterministic overlay system -- do not bake in any text, arrow, or symbol labelling; every schematic/label element for this family is added deterministically afterward.";
}

/**
 * CC-11.9: Product Owner reference-handover correction (2026-08-24) --
 * supersedes the prior dark-slate default. The governed default is now
 * white/near-white (see docs/design/ALP-INSTRUCTIONAL-VISUAL-STYLE-GUIDE.md
 * §2). Not an absolute rule: an asset with a genuine, justified reason to
 * depart from it (e.g. an oscilloscope's own dark screen area) sets
 * `backgroundStyleOverride`, which replaces this text instead of it being
 * appended -- the surrounding illustration background must still be
 * white/near-white even then.
 */
const DEFAULT_BACKGROUND_INSTRUCTION =
  "Use a clean near-white background (#FBFBFA) with an optional extremely subtle gradient toward a very light cool-grey (#F0F1F3). Premium, adult, technically credible, contemporary, calm, uncluttered, mobile-first. Subtle neutral-grey shadow/depth only (soft, low-opacity, never colour-tinted). Avoid black voids, dark slate, strong texture, decorative scenery, neon/cyberpunk treatment or advertising-dramatic lighting.";

/**
 * Applies only to asset with real generated-artwork responsibility
 * (HYBRID/PREMIUM_CONCEPTUAL) -- never to a DETERMINISTIC_TECHNICAL
 * style-reference/schematic/graph/symbol/assessment-tile asset, which
 * has no illustrated background at all for this instruction to apply to.
 */
function backgroundInstruction(asset: VisualAsset): string | null {
  if (asset.productionClass === "DETERMINISTIC_TECHNICAL") return null;
  const text = asset.backgroundStyleOverride ?? DEFAULT_BACKGROUND_INSTRUCTION;
  return `BACKGROUND: ${text}`;
}

/**
 * CC-11.7 §7/§20: "A single base asset may support several canonical
 * states... If one base asset supports multiple canonical states, the
 * asset prompt must state all states it must safely support." Never a
 * generic family-only prompt, and never a separate prompt per state --
 * one prompt enumerates every state this specific base asset must work
 * for, so the art session knows up front what the finished artwork will
 * be asked to do (e.g. survive a deterministic mirror/rotation for an
 * opposite-current variant, or remain legible with an overlay toggled).
 */
function canonicalStatesInstruction(asset: VisualAsset): string {
  const lines = ["THIS BASE ASSET MUST SAFELY SUPPORT THE FOLLOWING CANONICAL LEARNER-VISIBLE STATE(S):"];
  for (const state of asset.canonicalStates) {
    lines.push(`  - [${state.pedagogicalState}] ${state.displayName}`);
    if (state.requiredLabels.length > 0) lines.push(`      labels: ${state.requiredLabels.join(", ")}`);
    if (state.notes) lines.push(`      note: ${state.notes}`);
  }
  if (asset.canonicalStates.length > 1) {
    lines.push("The artwork itself does not need to change per state where the difference is purely a deterministic overlay/annotation toggle -- only produce distinct artwork where the states genuinely require different geometry.");
  }
  return lines.join("\n");
}

export function buildAssetPrompt(asset: VisualAsset, families?: VisualFamily[]): string {
  const family = familyForAsset(asset.assetId, families);

  // CC-11.7C §3: a DETERMINISTIC_TECHNICAL asset's authoritative output is
  // always deterministic vector geometry produced by ALP's own rendering
  // code -- never a ChatGPT image-generation job, regardless of the
  // `promptable` field (which some deterministic assets never explicitly
  // set to false, relying on this productionClass check instead).
  if (asset.promptable === false || asset.productionClass === "DETERMINISTIC_TECHNICAL") {
    return [
      `ASSET ${asset.sequence} -- ${asset.assetId}`,
      `"${asset.displayName}"`,
      family ? `Visual family: ${family.displayName} (${family.familyId})` : "",
      "",
      "NO CHATGPT ART JOB -- VECTOR AUTHORITATIVE.",
      "This asset's authoritative output is deterministic SVG / React Native SVG / equivalent vector geometry, produced entirely by ALP's own rendering code. A PNG/WEBP/JPG may exist only as a review/render preview, never as the production format.",
      asset.exactDeliverable,
      "Do not request artwork for this asset from an art session.",
    ]
      .filter(Boolean)
      .join("\n");
  }

  if (asset.referenceReadiness === "NOT_READY") {
    return [
      `ASSET ${asset.sequence} -- ${asset.assetId}`,
      `"${asset.displayName}"`,
      family ? `Visual family: ${family.displayName} (${family.familyId})` : "",
      "",
      "THIS ASSET IS BLOCKED: no primary reference has been approved yet.",
      "Do not request artwork for this asset. Source and approve a primary reference in the Studio first.",
    ]
      .filter(Boolean)
      .join("\n");
  }

  if (asset.needsScopeConfirmation) {
    return [
      `ASSET ${asset.sequence} -- ${asset.assetId}`,
      `"${asset.displayName}"`,
      family ? `Visual family: ${family.displayName} (${family.familyId})` : "",
      "",
      "THIS ASSET NEEDS SCOPE CONFIRMATION before any artwork is requested.",
      asset.scopeConfirmationNote ?? "The governed Unit 202 corpus does not clearly establish that this specific configuration is required teaching content.",
      "Do not request artwork for this asset until a Product Owner/Architect scope decision is recorded.",
    ]
      .filter(Boolean)
      .join("\n");
  }

  const lines: string[] = [];
  lines.push(`ASSET ${asset.sequence} -- ${asset.assetId}`);
  lines.push(`"${asset.displayName}"`);
  if (family) {
    lines.push(`Visual family: ${family.displayName} (${family.familyId}) -- asset ${asset.orderInFamily} of ${family.assets.length}`);
  }
  lines.push(`Role in family: ${asset.role}`);
  lines.push(`Need classification: ${visualNeedClassificationFor(asset)}${asset.needOverride === "USEFUL" ? " (optional enrichment -- never blocks REQUIRED Unit 202 visual completeness)" : ""}`);
  lines.push(`Production class: ${asset.productionClassLabel}`);
  lines.push(`Priority: ${asset.priorityLabel}`);
  if (asset.loOrLesson) lines.push(`Curriculum context: ${asset.loOrLesson}`);
  lines.push("");
  lines.push("INSTRUCTIONAL PURPOSE OF THIS ASSET:");
  lines.push(asset.instructionalPurpose);
  lines.push("");
  lines.push(referenceBlock("PRIMARY REFERENCE (technical/pedagogical authority -- do not copy stylistically)", asset.primaryReference));
  if (asset.secondaryReference) {
    lines.push("");
    lines.push(referenceBlock("SECONDARY / CROSS-CHECK REFERENCE", asset.secondaryReference));
  }
  lines.push("");
  lines.push("IMMUTABLE TECHNICAL FACTS (must be reproduced exactly, never adjusted for composition):");
  lines.push(bulletList(asset.immutableFacts));
  lines.push("");
  lines.push(annotationInstruction(asset));
  lines.push("");
  lines.push(canonicalStatesInstruction(asset));
  const background = backgroundInstruction(asset);
  if (background) {
    lines.push("");
    lines.push(background);
  }
  lines.push("");
  lines.push("YOU MAY FREELY DESIGN (generated-artwork responsibility):");
  lines.push(bulletList(asset.creativeFreedoms));
  lines.push("");
  lines.push("REMAINS DETERMINISTIC / NOT YOUR RESPONSIBILITY (ALP's own tooling adds these separately):");
  lines.push(bulletList(asset.deterministicOverlayResponsibilities));
  lines.push("");
  lines.push("PROHIBITED CHANGES:");
  lines.push(bulletList(asset.prohibitedChanges));
  if (asset.assessmentNote) {
    lines.push("");
    lines.push(`ASSESSMENT NOTE: ${asset.assessmentNote}`);
  }
  lines.push("");
  lines.push("EXACT REQUESTED DELIVERABLE:");
  lines.push(asset.exactDeliverable);
  lines.push("");
  lines.push("Produce ONLY this asset. Do not automatically create the other members of the visual family.");
  if (family && family.assets.length > 1) {
    lines.push(`If several assets from this family (${family.displayName}) are produced in the same session, keep them visually consistent with each other (same rendering style, material treatment, composition language) -- but do not assume every concept needs multiple images; this family's own count is deliberately justified, not templated.`);
  }
  lines.push("");
  lines.push(CRITICAL_DIRECTION_RULE);

  return lines.join("\n");
}
