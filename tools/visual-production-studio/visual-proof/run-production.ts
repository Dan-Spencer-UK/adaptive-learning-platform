/**
 * CC-11.9: general production-run orchestration CLI, superseding run-proof.ts's
 * narrow 2-asset-only scope now that the Product Owner's reference handover
 * unblocks all 42 generative assets. Candidates are written to the same
 * "pending review" location as the original 2-asset proof
 * (reports/instructional-visuals/premium-artwork/proof/<assetId>/) --
 * unapproved candidates never enter the shipped apps/mobile asset tree or
 * the approval manifest; that only happens through the Studio's own
 * human-approval flow.
 *
 * Usage:
 *   node tools/visual-production-studio/visual-proof/run-production.ts <assetId>
 *   node tools/visual-production-studio/visual-proof/run-production.ts <assetId> --correction "<note>"
 */

import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { findAsset } from "../catalogue.ts";
import { REPO_ROOT } from "../paths.ts";
import { generateImage } from "../gemini-client.ts";
import { acquireReference, asInlineImage } from "../reference-acquisition.ts";
import { effectivePrimaryReference, effectiveReferenceReadiness, referencePreparationFor } from "../reference-corrections.ts";
import { semanticQaFor } from "../semantic-reference-qa.ts";
import { buildGeminiPrompt } from "./prompt-builder-gemini.ts";
import { createMobileDerivative } from "./derivative.ts";
import type { ProofGenerationMetadata } from "./proof-types.ts";

export const PRODUCTION_CANDIDATE_ROOT = join(REPO_ROOT, "reports", "instructional-visuals", "premium-artwork", "proof");

function sha256(buffer: Buffer): string {
  return createHash("sha256").update(buffer).digest("hex");
}

export interface RunProductionOptions {
  assetId: string;
  correctionNote?: string;
  /** A prepared (cropped/composed) reference image path to use instead of the raw acquired reference -- required for composite sources. */
  preparedReferencePath?: string;
  referenceExtractionNote?: string;
  /**
   * CC-11.10: generate one specific canonicalState's final learner-visible
   * output instead of the asset's shared neutral base. Must match a
   * `stateId` in `asset.canonicalStates`. Output files are named after the
   * stateId, nested in the same per-asset directory as the base files.
   */
  stateId?: string;
  /** CC-11.10: explicit override for whether this generation must bake labels -- a state-specific generation always needs this true even when the asset-level heuristic would say otherwise, so pass it explicitly rather than relying on the asset-level default. */
  forceCleanBaseArtOverride?: boolean;
}

export async function runProduction(options: RunProductionOptions): Promise<ProofGenerationMetadata> {
  const { assetId, correctionNote, preparedReferencePath, referenceExtractionNote, stateId, forceCleanBaseArtOverride } = options;
  const asset = findAsset(assetId);
  if (!asset) throw new Error(`${assetId} not found in the live catalogue.`);
  if (effectiveReferenceReadiness(asset) !== "READY") {
    throw new Error(`${assetId} is not READY after handover correction -- refusing to generate.`);
  }

  const state = stateId ? asset.canonicalStates.find((s) => s.stateId === stateId) : undefined;
  if (stateId && !state) throw new Error(`${stateId} is not a canonicalState of ${assetId}.`);

  const outputId = state ? state.stateId : assetId;

  // CC-11.12 hard gate: a state that HAS been through semantic reference QA
  // (SEMANTIC_QA has a record for it) must carry an APPROVED_DIRECT or
  // APPROVED_PREPARED disposition before generation may proceed -- this is
  // what stops a REDO entry from being silently regenerated with its old,
  // semantically-rejected reference/composition. A state with no QA record
  // at all (never part of a semantic review) is not blocked by this check.
  const semanticQa = semanticQaFor(outputId) ?? semanticQaFor(assetId);
  if (semanticQa && semanticQa.referenceDisposition !== "APPROVED_DIRECT" && semanticQa.referenceDisposition !== "APPROVED_PREPARED") {
    throw new Error(
      `${outputId} has semantic-QA disposition "${semanticQa.referenceDisposition}", not APPROVED_DIRECT/APPROVED_PREPARED -- refusing to generate until a new reference frame is prepared and re-reviewed.`,
    );
  }
  const assetDir = join(PRODUCTION_CANDIDATE_ROOT, assetId);
  mkdirSync(assetDir, { recursive: true });

  // Attempt number = 1 + however many master versions already exist for this output (asset base, or this specific state).
  let attempt = 1;
  while (existsSync(join(assetDir, `${outputId}-master-v${attempt}.png`))) attempt++;
  if (correctionNote && attempt === 1) throw new Error(`Cannot run a --correction attempt for ${outputId} before attempt 1 exists.`);

  const masterPath = join(assetDir, `${outputId}-master-v${attempt}.png`);
  const derivativePath = join(assetDir, `${outputId}-derivative-v${attempt}.png`);
  const metadataPath = join(assetDir, `${outputId}-metadata-v${attempt}.json`);

  const ref = effectivePrimaryReference(asset);
  let inlineRef: { mimeType: string; bytes: Buffer };
  let referenceSha: string;
  let referenceUrlForRecord: string;

  if (preparedReferencePath) {
    const bytes = readFileSync(preparedReferencePath);
    inlineRef = { mimeType: "image/png", bytes };
    referenceSha = sha256(bytes);
    referenceUrlForRecord = `${ref.sourceUrl} (prepared: ${preparedReferencePath})`;
  } else {
    const acquired = await acquireReference(assetId, ref.sourceUrl);
    inlineRef = asInlineImage(acquired);
    referenceSha = acquired.rasterSha256 ?? acquired.sha256;
    referenceUrlForRecord = ref.sourceUrl;
  }

  // Force clean base art only when this asset genuinely has no baked-label
  // requirement of its own (CC-11.9 §3 correction -- see prompt-builder-gemini.ts).
  // A state-specific generation always bakes its own state's labels, so it
  // is never clean base art unless explicitly overridden.
  const forceCleanBaseArt = forceCleanBaseArtOverride ?? (asset.requiredLabels.length === 0 && asset.deterministicOverlayResponsibilities.length > 0);

  const stateRequirement = state
    ? [
        `State: ${state.displayName} (${state.pedagogicalState})`,
        state.requiredLabels.length > 0
          ? `This state's required labels/indicators (must be visibly and correctly present, technically correct, not merely present): ${state.requiredLabels.join(", ")}`
          : "This state deliberately WITHHOLDS the assessed-answer indicator described in the notes below -- do not draw it, even though the given stimulus below must still be shown.",
        state.parameters ? `Parameters: ${JSON.stringify(state.parameters)}` : undefined,
        state.notes ? `Notes: ${state.notes}` : undefined,
      ]
        .filter((l): l is string => !!l)
        .join("\n")
    : undefined;

  const promptText = buildGeminiPrompt({
    asset,
    forceCleanBaseArt,
    referenceExtractionNote: referenceExtractionNote ?? referencePreparationFor(asset),
    correctionNote,
    stateRequirement,
  });

  const result = await generateImage({ promptText, technicalReference: inlineRef });

  writeFileSync(masterPath, result.image.bytes);
  await createMobileDerivative(result.image.bytes, derivativePath);
  const derivativeBuffer = readFileSync(derivativePath);

  const metadata: ProofGenerationMetadata = {
    assetId: outputId,
    attempt: attempt as 1 | 2,
    sourceReferenceUrl: referenceUrlForRecord,
    sourceReferenceSha256: referenceSha,
    model: result.model,
    masterPath,
    masterSha256: sha256(result.image.bytes),
    derivativePath,
    derivativeSha256: sha256(derivativeBuffer),
    generatedAt: result.requestedAt,
    modelResponseText: result.responseText,
  };
  writeFileSync(metadataPath, JSON.stringify(metadata, null, 2) + "\n", "utf8");

  return metadata;
}

function isMainModule(): boolean {
  const entryPoint = process.argv[1];
  if (!entryPoint) return false;
  return fileURLToPath(import.meta.url) === entryPoint;
}

if (isMainModule()) {
  const assetId = process.argv[2];
  const correctionFlagIndex = process.argv.indexOf("--correction");
  const correctionNote = correctionFlagIndex >= 0 ? process.argv[correctionFlagIndex + 1] : undefined;
  const preparedFlagIndex = process.argv.indexOf("--prepared-reference");
  const preparedReferencePath = preparedFlagIndex >= 0 ? process.argv[preparedFlagIndex + 1] : undefined;
  const extractionNoteFlagIndex = process.argv.indexOf("--extraction-note");
  const referenceExtractionNote = extractionNoteFlagIndex >= 0 ? process.argv[extractionNoteFlagIndex + 1] : undefined;
  const stateFlagIndex = process.argv.indexOf("--state");
  const stateId = stateFlagIndex >= 0 ? process.argv[stateFlagIndex + 1] : undefined;

  if (!assetId) {
    console.error("Usage: node run-production.ts <assetId> [--correction \"<note>\"] [--prepared-reference <path>] [--extraction-note \"<note>\"] [--state <stateId>]");
    process.exit(1);
  }

  runProduction({ assetId, correctionNote, preparedReferencePath, referenceExtractionNote, stateId, forceCleanBaseArtOverride: stateId ? false : undefined })
    .then((metadata) => {
      console.log(`Generated ${metadata.assetId} attempt ${metadata.attempt} via ${metadata.model}`);
      console.log(`  Reference: ${metadata.sourceReferenceUrl}`);
      console.log(`  Master: ${metadata.masterPath} (sha256 ${metadata.masterSha256.slice(0, 12)}...)`);
      console.log(`  Derivative: ${metadata.derivativePath}`);
    })
    .catch((error: unknown) => {
      console.error(error);
      process.exitCode = 1;
    });
}
