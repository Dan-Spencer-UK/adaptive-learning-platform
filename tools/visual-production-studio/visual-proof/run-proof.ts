/**
 * CC-11.8 §20 two-asset Gemini proof -- orchestration CLI. Runs exactly
 * one generation attempt per invocation (task brief E7: max 1 initial +
 * 1 automatic correction attempt per asset, 4 total Gemini calls across
 * the whole two-asset proof). The actual independent audit (task brief
 * E6) is performed separately, by Claude visually inspecting the saved
 * master PNG -- there is no second AI in this loop to delegate it to, so
 * this script's job ends at "candidate saved with full provenance,"
 * never "approved."
 *
 * Usage:
 *   node tools/visual-production-studio/visual-proof/run-proof.ts <assetId>
 *   node tools/visual-production-studio/visual-proof/run-proof.ts <assetId> --correction "<bounded correction note>"
 */

import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { findAsset } from "../catalogue.ts";
import { REPO_ROOT } from "../paths.ts";
import { generateImage } from "../gemini-client.ts";
import { acquireReference, asInlineImage } from "../reference-acquisition.ts";
import { buildGeminiPrompt } from "./prompt-builder-gemini.ts";
import { createMobileDerivative } from "./derivative.ts";
import { proofAssetSpec } from "./proof-config.ts";
import type { ProofGenerationMetadata } from "./proof-types.ts";

const PROOF_ROOT = join(REPO_ROOT, "reports", "instructional-visuals", "premium-artwork", "proof");

function sha256(buffer: Buffer): string {
  return createHash("sha256").update(buffer).digest("hex");
}

export async function runProof(assetId: string, correctionNote?: string): Promise<ProofGenerationMetadata> {
  const spec = proofAssetSpec(assetId);
  const asset = findAsset(assetId);
  if (!asset) throw new Error(`${assetId} not found in the live catalogue.`);
  if (asset.referenceReadiness !== "READY") throw new Error(`${assetId} is not READY (referenceReadiness=${asset.referenceReadiness}) -- refusing to generate.`);

  const assetDir = join(PROOF_ROOT, assetId);
  mkdirSync(assetDir, { recursive: true });

  const attempt: 1 | 2 = correctionNote ? 2 : 1;
  const masterPath = join(assetDir, `${assetId}-master-v${attempt}.png`);
  const derivativePath = join(assetDir, `${assetId}-derivative-v${attempt}.png`);
  const metadataPath = join(assetDir, `${assetId}-metadata-v${attempt}.json`);
  if (existsSync(masterPath)) {
    throw new Error(`${masterPath} already exists -- never overwrite an existing versioned master. Delete it deliberately first if this attempt should be regenerated.`);
  }
  if (attempt === 2 && !existsSync(join(assetDir, `${assetId}-master-v1.png`))) {
    throw new Error(`Cannot run attempt 2 (--correction) for ${assetId} before attempt 1 exists.`);
  }

  const reference = await acquireReference(assetId, spec.referenceUrl);
  const promptText = buildGeminiPrompt({
    asset,
    forceCleanBaseArt: true,
    referenceExtractionNote: spec.referenceExtractionNote,
    correctionNote,
  });

  const result = await generateImage({
    promptText,
    technicalReference: asInlineImage(reference),
  });

  writeFileSync(masterPath, result.image.bytes);
  await createMobileDerivative(result.image.bytes, derivativePath);
  const derivativeBuffer = readFileSync(derivativePath);

  const metadata: ProofGenerationMetadata = {
    assetId,
    attempt,
    sourceReferenceUrl: spec.referenceUrl,
    sourceReferenceSha256: reference.sha256,
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

  if (!assetId) {
    console.error("Usage: node run-proof.ts <assetId> [--correction \"<note>\"]");
    process.exit(1);
  }

  runProof(assetId, correctionNote)
    .then((metadata) => {
      console.log(`Generated ${metadata.assetId} attempt ${metadata.attempt} via ${metadata.model}`);
      console.log(`  Reference: ${metadata.sourceReferenceUrl} (sha256 ${metadata.sourceReferenceSha256.slice(0, 12)}...)`);
      console.log(`  Master: ${metadata.masterPath} (sha256 ${metadata.masterSha256.slice(0, 12)}...)`);
      console.log(`  Derivative: ${metadata.derivativePath}`);
      if (metadata.modelResponseText) console.log(`  Model note: ${metadata.modelResponseText}`);
    })
    .catch((error: unknown) => {
      console.error(error);
      process.exitCode = 1;
    });
}
