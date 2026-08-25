/**
 * CC-11.8 §20: builds the exact prompt text sent to Gemini for one
 * generation job. Always includes, in order: (1) the canonical ALP style
 * guide, verbatim, read live from its own file so this can never drift
 * from the single source of truth in docs/design/
 * ALP-INSTRUCTIONAL-VISUAL-STYLE-GUIDE.md; (2) the individual asset's
 * production contract; (3) the explicit reference-authority boilerplate
 * the task brief requires verbatim; (4) an optional bounded-correction
 * note for a retry attempt.
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";

import type { VisualAsset } from "../catalogue.ts";
import { REPO_ROOT } from "../paths.ts";

const STYLE_GUIDE_PATH = join(REPO_ROOT, "docs", "design", "ALP-INSTRUCTIONAL-VISUAL-STYLE-GUIDE.md");

export function loadStyleGuideText(): string {
  return readFileSync(STYLE_GUIDE_PATH, "utf8");
}

/**
 * CC-11.8 §5 (task brief E3): stated verbatim in every generation prompt --
 * the technical reference image is authoritative geometry, never prose.
 */
const REFERENCE_AUTHORITY_BOILERPLATE = `THE SUPPLIED TECHNICAL REFERENCE IMAGE IS THE AUTHORITATIVE GEOMETRY / TOPOLOGY SKELETON.
PRESERVE ITS TECHNICAL RELATIONSHIPS.
REDRAW / RE-ILLUSTRATE IT IN ALP STYLE.
DO NOT RECONSTRUCT THE TECHNICAL APPARATUS FROM PROSE.

You MAY modify: material rendering, finish, lighting, non-authoritative perspective, visual polish, background (within the governed ALP style specified above).
You MUST NOT alter: topology, component count, electrical connectivity, mechanical connectivity, hand identity, finger relationships, lever/pulley configuration, poles, exact directional relationships, or any immutable technical fact listed below.`;

export interface GeminiPromptOptions {
  asset: VisualAsset;
  /**
   * CC-11.9 correction: the CC-11.8 proof forced clean base art
   * unconditionally, treating every asset's own requiredLabels as legacy
   * guidance not yet migrated -- that default is now reversed. Required
   * technical semantics (N/S, arrows, polarity, hand identity, finger
   * assignment, lever/component labels, bias direction, generator
   * topology, output path, etc.) are part of ACCEPTANCE for a generated
   * teaching illustration and must be present in the final image, not
   * deferred to "add it later as an overlay". Pass true only for an asset
   * whose own `deterministicOverlayResponsibilities` genuinely cover every
   * one of its `requiredLabels` (i.e. requiredLabels is empty and the
   * asset explicitly defers all annotation to a deterministic overlay
   * system) -- never as a blanket default.
   */
  forceCleanBaseArt: boolean;
  /** When the technical reference image contains more than this one asset's geometry (e.g. a composite reference showing all three lever classes in one file), state exactly which part establishes this asset's facts and which parts to ignore. */
  referenceExtractionNote?: string;
  /** Bounded correction note for the one permitted automatic retry (task brief E7) -- appended, never replacing the base prompt. */
  correctionNote?: string;
  /**
   * CC-11.10: when generating one specific canonicalState's final
   * learner-visible output (not the asset's shared neutral base), the exact
   * state requirement -- which direction-specific labels/indicators this
   * state must show, and which it must withhold as the assessed answer.
   */
  stateRequirement?: string;
}

export function buildGeminiPrompt(options: GeminiPromptOptions): string {
  const { asset, forceCleanBaseArt, referenceExtractionNote, correctionNote, stateRequirement } = options;
  const lines: string[] = [];

  lines.push("=== ALP CANONICAL VISUAL STYLE GUIDE (governed -- do not reinterpret) ===");
  lines.push(loadStyleGuideText());
  lines.push("");
  lines.push("=== ASSET PRODUCTION CONTRACT ===");
  lines.push(`Asset: ${asset.assetId} -- "${asset.displayName}"`);
  lines.push(`Role: ${asset.role}`);
  lines.push(`Production class: ${asset.productionClassLabel}`);
  lines.push(`Instructional purpose: ${asset.instructionalPurpose}`);
  lines.push("");
  lines.push("IMMUTABLE TECHNICAL FACTS (must be reproduced exactly):");
  for (const fact of asset.immutableFacts) lines.push(`  - ${fact}`);
  lines.push("");
  lines.push("PROHIBITED CHANGES:");
  for (const p of asset.prohibitedChanges) lines.push(`  - ${p}`);
  lines.push("");

  if (referenceExtractionNote) {
    lines.push("REFERENCE EXTRACTION NOTE:");
    lines.push(referenceExtractionNote);
    lines.push("");
  }

  lines.push(REFERENCE_AUTHORITY_BOILERPLATE);
  lines.push("");

  if (forceCleanBaseArt) {
    lines.push("=== CLEAN BASE ART (deterministic overlay covers all labels for this asset) ===");
    lines.push(
      "Generate CLEAN BASE ART for this job. Do not bake any text label, callout, or annotation into the image -- every label this concept needs is added afterward by ALP's own deterministic rendering code, per this asset's own deterministicOverlayResponsibilities.",
    );
    lines.push("");
  } else if (asset.requiredLabels.length > 0) {
    lines.push("=== REQUIRED LABELS (must be visibly and correctly present in the FINAL IMAGE) ===");
    lines.push(
      "The following labels/markings are part of this asset's acceptance criteria, not something to defer to a later overlay. They must actually appear in the generated image, correctly positioned on the correct element:",
    );
    for (const label of asset.requiredLabels) lines.push(`  - ${label}`);
    lines.push("");
  }

  lines.push(`EXACT DELIVERABLE: ${asset.exactDeliverable}`);
  lines.push("");

  if (stateRequirement) {
    lines.push("=== REQUIRED LEARNER-VISIBLE STATE (this generation is a specific final state, not a direction-neutral shared base) ===");
    lines.push(stateRequirement);
    lines.push("");
  }
  lines.push("CRITICAL RULE: inspect the actual geometry you have drawn before presenting it. Do not rely on a caption or label to assert correctness -- the pixels themselves must match the reference's technical relationships and every immutable fact above. Where labels/pole markings/directional semantics are required above, they must be TECHNICALLY CORRECT in the image, not merely present.");

  if (correctionNote) {
    lines.push("");
    lines.push("=== BOUNDED CORRECTION (attempt 2 of 2 maximum) ===");
    lines.push(correctionNote);
  }

  return lines.join("\n");
}
