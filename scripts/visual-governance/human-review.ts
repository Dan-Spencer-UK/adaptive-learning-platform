/**
 * CC-05D: human-review decision storage/workflow. Design authority:
 * docs/architecture/CC-05D-INSTRUCTIONAL-VISUAL-GOVERNANCE-AND-SEMANTIC-
 * QA.md §H/§25.
 *
 * Decisions are hash-bound: a decision recorded against one
 * (imageHash, contractHash) pair is never treated as current evidence
 * once either hash changes (isDecisionCurrent below) -- if a visual is
 * re-rendered or its contract edited, the prior approval simply stops
 * applying; it is not silently carried forward.
 *
 * Usage (CLI):
 *   node scripts/visual-governance/human-review.ts record \
 *     --variant <variantId> --status approved --reviewer "product-owner" [--reason "..."]
 *   (reads the current image/contract hash for that variant from the
 *   manifest/report the render+audit steps already produced, so the
 *   reviewer never has to type a hash by hand.)
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { humanReviewDecisionSchema, type HumanReviewDecision } from "@alp/content-schema";

export function loadHumanReviewDecisions(path: string): HumanReviewDecision[] {
  if (!existsSync(path)) return [];
  const raw = JSON.parse(readFileSync(path, "utf8"));
  return (raw as unknown[]).map((entry) => humanReviewDecisionSchema.parse(entry));
}

export function saveHumanReviewDecisions(path: string, decisions: HumanReviewDecision[]): void {
  mkdirSync(dirname(path), { recursive: true });
  const sorted = [...decisions].sort((a, b) => a.variantId.localeCompare(b.variantId));
  writeFileSync(path, JSON.stringify(sorted, null, 2) + "\n", "utf8");
}

/** Upserts by variantId -- a new decision on an already-decided variant replaces the old one; history is not retained beyond the latest disposition. */
export function upsertDecision(decisions: readonly HumanReviewDecision[], decision: HumanReviewDecision): HumanReviewDecision[] {
  const filtered = decisions.filter((d) => d.variantId !== decision.variantId);
  return [...filtered, decision];
}

export interface CurrentIdentity {
  readonly imageHash: string;
  readonly contractHash: string;
}

/** A decision only counts as current evidence while both hashes still match -- see this file's header. */
export function isDecisionCurrent(decision: HumanReviewDecision, current: CurrentIdentity): boolean {
  return decision.imageHash === current.imageHash && decision.contractHash === current.contractHash;
}

export function findCurrentDecision(
  decisions: readonly HumanReviewDecision[],
  variantId: string,
  current: CurrentIdentity,
): HumanReviewDecision | undefined {
  const decision = decisions.find((d) => d.variantId === variantId);
  if (!decision) return undefined;
  return isDecisionCurrent(decision, current) ? decision : undefined;
}

// ---------------------------------------------------------------------
// CLI entry point
// ---------------------------------------------------------------------

function parseArgs(argv: string[]): Record<string, string> {
  const args: Record<string, string> = {};
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg?.startsWith("--")) {
      const key = arg.slice(2);
      const value = argv[i + 1];
      if (value && !value.startsWith("--")) {
        args[key] = value;
        i++;
      } else {
        args[key] = "true";
      }
    }
  }
  return args;
}

function isMainModule(): boolean {
  const entryPoint = process.argv[1];
  if (!entryPoint) return false;
  return fileURLToPath(import.meta.url) === entryPoint;
}

if (isMainModule()) {
  const [command, ...rest] = process.argv.slice(2);
  const args = parseArgs(rest);
  const reportsDir = join(import.meta.dirname, "..", "..", "reports", "instructional-visuals");
  const humanReviewPath = join(reportsDir, "human-review.json");
  const manifestPath = join(reportsDir, "manifest.json");

  if (command !== "record") {
    console.error("Usage: node scripts/visual-governance/human-review.ts record --variant <id> --status <approved|rejected|approved_with_note> --reviewer <name> [--reason <text>]");
    process.exit(1);
  }

  const { variant: variantId, status, reviewer, reason } = args;
  if (!variantId || !status || !reviewer) {
    console.error("Missing required arguments. Required: --variant, --status, --reviewer.");
    process.exit(1);
  }
  if (!existsSync(manifestPath)) {
    console.error(`No render manifest found at ${manifestPath}. Run 'npm run visuals:render' first.`);
    process.exit(1);
  }

  const manifest = JSON.parse(readFileSync(manifestPath, "utf8")) as { artifacts: Array<{ variantId: string; imageHash: string }> };
  const artifact = manifest.artifacts.find((a) => a.variantId === variantId);
  if (!artifact) {
    console.error(`No rendered artifact found for variant '${variantId}' in ${manifestPath}.`);
    process.exit(1);
  }

  // The contract hash for this decision is read from the semantic-audit
  // evidence (already computed there against the exact same contract);
  // recording a human decision without a prior semantic audit having run
  // is not supported by this minimal CLI -- run `npm run visuals:audit:semantic` first.
  const semanticAuditPath = join(reportsDir, "semantic-audit.json");
  if (!existsSync(semanticAuditPath)) {
    console.error(`No semantic audit found at ${semanticAuditPath}. Run 'npm run visuals:audit:semantic' first.`);
    process.exit(1);
  }
  const semanticAudit = JSON.parse(readFileSync(semanticAuditPath, "utf8")) as Array<{ variantId: string; verification: { contractHash: string } }>;
  const record = semanticAudit.find((r) => r.variantId === variantId);
  if (!record) {
    console.error(`No semantic audit record found for variant '${variantId}'.`);
    process.exit(1);
  }

  const decision = humanReviewDecisionSchema.parse({
    variantId,
    status,
    reviewer,
    timestamp: new Date().toISOString(),
    reason,
    imageHash: artifact.imageHash,
    contractHash: record.verification.contractHash,
  });

  const existing = loadHumanReviewDecisions(humanReviewPath);
  saveHumanReviewDecisions(humanReviewPath, upsertDecision(existing, decision));
  console.log(`Recorded human-review decision for ${variantId}: ${status} (by ${reviewer}).`);
}
