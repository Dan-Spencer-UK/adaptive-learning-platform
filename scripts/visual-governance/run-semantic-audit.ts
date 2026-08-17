/**
 * CC-05D: two-pass semantic-review orchestrator. Design authority:
 * docs/architecture/CC-05D-INSTRUCTIONAL-VISUAL-GOVERNANCE-AND-SEMANTIC-
 * QA.md §F/§G/§J/§K.
 *
 * Reads the render manifest (npm run visuals:render's output), runs Pass
 * A (blind observation) then Pass B (semantic verification against the
 * governed contract) for every artefact whose cached result is missing
 * or stale, reuses cached results otherwise, and writes:
 *   - reports/instructional-visuals/semantic-audit.json
 *   - reports/instructional-visuals/human-review-queue.json
 *
 * Uses MockSemanticReviewProvider by default -- no network call, no
 * credential required, safe to run in this environment and in CI dry
 * runs. Set VISUAL_GOVERNANCE_PROVIDER=anthropic (+ ANTHROPIC_API_KEY)
 * to opt into the live path, which currently throws
 * ProviderNotImplementedError (see semantic-review/anthropic-provider.ts
 * for exactly why and what remains).
 *
 * Usage:
 *   node scripts/visual-governance/run-semantic-audit.ts
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

import {
  renderManifestSchema,
  semanticAuditRecordSchema,
  semanticVerificationSchema,
  blindObservationSchema,
  type SemanticAuditRecord,
  type SemanticVerification,
} from "@alp/content-schema";

import { pedagogyManifestSchema } from "@alp/content-schema";
import { cc05aPedagogyUnit202 } from "../content/data/cc05a-pedagogy-unit202.ts";
import { visualSemanticContracts } from "./data/cc05d-visual-contracts-unit202.ts";
import { computeContractHash, composePromptVersion, isStale } from "./audit-cache.ts";
import { PASS_A_PROMPT_VERSION, PASS_B_PROMPT_VERSION } from "./semantic-review/prompts.ts";
import { resolveSemanticReviewProvider } from "./semantic-review/anthropic-provider.ts";
import { selectHumanReviewSample } from "./sampling.ts";

const REPORTS_DIR = join(import.meta.dirname, "..", "..", "reports", "instructional-visuals");
const MANIFEST_PATH = join(REPORTS_DIR, "manifest.json");
const SEMANTIC_AUDIT_PATH = join(REPORTS_DIR, "semantic-audit.json");
const HUMAN_REVIEW_QUEUE_PATH = join(REPORTS_DIR, "human-review-queue.json");

const SCHEMA_VERSION = "semantic-verification.v1";
const PROMPT_VERSION = composePromptVersion(PASS_A_PROMPT_VERSION, PASS_B_PROMPT_VERSION);

export interface HumanReviewQueueItem {
  readonly variantId: string;
  readonly reason: "mandatory" | "sampled";
  readonly status: SemanticVerification["status"];
}

export async function runSemanticAudit(): Promise<{ records: SemanticAuditRecord[]; queue: HumanReviewQueueItem[] }> {
  if (!existsSync(MANIFEST_PATH)) {
    throw new Error(`No render manifest found at ${MANIFEST_PATH}. Run 'npm run visuals:render' first.`);
  }
  const manifest = renderManifestSchema.parse(JSON.parse(readFileSync(MANIFEST_PATH, "utf8")));

  const pedagogy = pedagogyManifestSchema.parse(cc05aPedagogyUnit202);
  const diagramTypeByBlueprintId = new Map(pedagogy.diagramBlueprints.map((d) => [d.id, d.type]));
  const contractById = new Map(visualSemanticContracts.map((c) => [c.id, c]));

  const previousRecords: SemanticAuditRecord[] = existsSync(SEMANTIC_AUDIT_PATH)
    ? (JSON.parse(readFileSync(SEMANTIC_AUDIT_PATH, "utf8")) as unknown[]).map((r) => semanticAuditRecordSchema.parse(r))
    : [];
  const previousByVariantId = new Map(previousRecords.map((r) => [r.variantId, r]));

  const provider = resolveSemanticReviewProvider();
  const records: SemanticAuditRecord[] = [];

  for (const artifact of manifest.artifacts) {
    const contract = contractById.get(artifact.contractId);
    if (!contract) throw new Error(`run-semantic-audit: manifest references unknown contract '${artifact.contractId}' for variant '${artifact.variantId}'.`);

    const contractHash = computeContractHash(contract);
    const currentIdentity = {
      imageHash: artifact.imageHash,
      contractHash,
      promptVersion: PROMPT_VERSION,
      schemaVersion: SCHEMA_VERSION,
      reviewerIdentity: provider.identity,
    };

    const previous = previousByVariantId.get(artifact.variantId);
    if (previous && !isStale(previous.verification, currentIdentity)) {
      records.push({ ...previous, cacheHit: true });
      continue;
    }

    const svgPath = join(REPORTS_DIR, artifact.svgRelativePath);
    const svg = readFileSync(svgPath, "utf8");
    const domain = "vocational qualification instructional content";
    const visualType = diagramTypeByBlueprintId.get(artifact.diagramBlueprintId) ?? "unknown";

    const observation = blindObservationSchema.parse(
      await provider.runPassA({ svg, hash: artifact.imageHash }, { variantId: artifact.variantId, domain, visualType }),
    );
    const draft = await provider.runPassB(observation, contract, { variantId: artifact.variantId, mode: artifact.mode });

    const verification = semanticVerificationSchema.parse({
      ...draft,
      reviewerIdentity: provider.identity,
      promptVersion: PROMPT_VERSION,
      schemaVersion: SCHEMA_VERSION,
      timestamp: new Date().toISOString(),
      imageHash: artifact.imageHash,
      contractHash,
    });

    records.push(semanticAuditRecordSchema.parse({ variantId: artifact.variantId, observation, verification, cacheHit: false }));
  }

  records.sort((a, b) => a.variantId.localeCompare(b.variantId));
  mkdirSync(REPORTS_DIR, { recursive: true });
  writeFileSync(SEMANTIC_AUDIT_PATH, JSON.stringify(records, null, 2) + "\n", "utf8");

  const mandatory: HumanReviewQueueItem[] = records
    .filter((r) => r.verification.requiresHumanReview)
    .map((r) => ({ variantId: r.variantId, reason: "mandatory" as const, status: r.verification.status }));

  const highConfidencePassPool = records.filter((r) => r.verification.status === "pass" && r.verification.confidence === "high" && !r.verification.requiresHumanReview);
  const sample = selectHumanReviewSample(
    highConfidencePassPool.map((r) => ({ variantId: r.variantId })),
    { contentRelease: manifest.contentRelease, sampleSeed: 1 },
  );
  const sampled: HumanReviewQueueItem[] = sample.selected.map((s) => ({ variantId: s.variantId, reason: "sampled" as const, status: "pass" as const }));

  const queue = [...mandatory, ...sampled];
  writeFileSync(HUMAN_REVIEW_QUEUE_PATH, JSON.stringify(queue, null, 2) + "\n", "utf8");

  return { records, queue };
}

function isMainModule(): boolean {
  const entryPoint = process.argv[1];
  if (!entryPoint) return false;
  return fileURLToPath(import.meta.url) === entryPoint;
}

if (isMainModule()) {
  const { records, queue } = await runSemanticAudit();
  const cacheHits = records.filter((r) => r.cacheHit).length;
  const reviewerIdentity = records[0]?.verification.reviewerIdentity ?? "n/a";
  const simulated = reviewerIdentity.startsWith("mock");
  console.log(`CC-05D semantic audit: ${records.length} variants reviewed (${cacheHits} reused from cache, ${records.length - cacheHits} freshly reviewed by ${reviewerIdentity}).`);
  console.log(`  ${simulated ? "*** SIMULATED (mock pipeline, NOT a real AI/vision review) ***" : "REAL AI REVIEW"}`);
  console.log(`  status: ${records.filter((r) => r.verification.status === "pass").length} pass, ${records.filter((r) => r.verification.status === "warn").length} warn, ${records.filter((r) => r.verification.status === "fail").length} fail`);
  console.log(`  human-review queue: ${queue.length} (${queue.filter((q) => q.reason === "mandatory").length} mandatory, ${queue.filter((q) => q.reason === "sampled").length} sampled)`);
}
