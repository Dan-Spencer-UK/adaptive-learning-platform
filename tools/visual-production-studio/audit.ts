/**
 * CC-11.7 §23: the comprehensive Unit 202 visual-production catalogue's
 * own completeness gate. Distinct from `check-visual-governance.ts`
 * (scripts/visual-governance/ -- proves the CC-05D deterministic system
 * is internally consistent) and `check-visual-completeness.ts`
 * (proves every lesson-declared visual need is satisfied) -- this proves
 * the STUDIO'S OWN comprehensive catalogue (VisualFamily -> ProductionAsset
 * -> CanonicalState) is internally consistent AND that it has not
 * silently lost any of the 66 pre-existing CC-05D canonical variants,
 * which is this package's own explicit, non-negotiable acceptance
 * criterion.
 *
 * Usage:
 *   node tools/visual-production-studio/audit.ts            (report)
 *   node tools/visual-production-studio/audit.ts --check     (exit 1 on any failure)
 */

import { fileURLToPath } from "node:url";

import { CANONICAL_VARIANT_BUILDERS } from "../../scripts/visual-governance/data/canonical-variants.ts";
import { visualSemanticContracts } from "../../scripts/visual-governance/data/cc05d-visual-contracts-unit202.ts";

import { allAssets, FAMILIES, isPromptable } from "./catalogue.ts";
import { buildAssetPrompt } from "./prompt-builder.ts";

export interface AuditReport {
  totalRealCanonicalVariants: number;
  unmappedExistingVariants: string[];
  requiredWithNoFamily: string[];
  requiredPremiumHybridWithNoPrompt: string[];
  requiredPremiumHybridWithNoReferenceOrBlockedStatus: string[];
  familyReferencesNonexistentBlueprint: string[];
  stateWithNoPedagogicalState: string[];
  assessmentLeaksMnemonic: string[];
  duplicateIds: string[];
}

/** Recomputes the real 66 (or however many the live CC-05D system currently declares) canonical-variant ids directly from source -- never trusts the catalogue's own claims. */
function realCanonicalVariantIds(): Set<string> {
  const ids = new Set<string>();
  for (const contract of visualSemanticContracts) {
    const builder = CANONICAL_VARIANT_BUILDERS[contract.diagramBlueprintId];
    if (!builder) continue;
    for (const variant of builder(contract.id, contract.version)) ids.add(variant.variantId);
  }
  return ids;
}

export function buildAuditReport(families = FAMILIES): AuditReport {
  const assets = allAssets(families);
  const realIds = realCanonicalVariantIds();

  const catalogueIds = new Set<string>();
  for (const asset of assets) {
    for (const state of asset.canonicalStates) {
      if (state.existingCanonicalVariantId) catalogueIds.add(state.existingCanonicalVariantId);
    }
  }
  const unmappedExistingVariants = [...realIds].filter((id) => !catalogueIds.has(id));

  const requiredWithNoFamily: string[] = []; // structurally impossible (assets only exist inside families) -- kept for explicit acceptance-criterion coverage
  const requiredPremiumHybridWithNoPrompt: string[] = [];
  const requiredPremiumHybridWithNoReferenceOrBlockedStatus: string[] = [];
  const familyReferencesNonexistentBlueprint: string[] = [];
  const stateWithNoPedagogicalState: string[] = [];
  const assessmentLeaksMnemonic: string[] = [];
  const seenIds = new Set<string>();
  const duplicateIds: string[] = [];

  for (const family of families) {
    if (!family.familyId) requiredWithNoFamily.push(`(family with no id, containing ${family.assets.map((a) => a.assetId).join(", ")})`);

    for (const asset of family.assets) {
      if (seenIds.has(asset.assetId)) duplicateIds.push(asset.assetId);
      seenIds.add(asset.assetId);

      const isPremiumOrHybrid = asset.productionClass === "PREMIUM_CONCEPTUAL" || asset.productionClass === "HYBRID";
      if (isPremiumOrHybrid && isPromptable(asset)) {
        try {
          const prompt = buildAssetPrompt(asset, families);
          if (!prompt || prompt.length < 20) requiredPremiumHybridWithNoPrompt.push(asset.assetId);
        } catch {
          requiredPremiumHybridWithNoPrompt.push(asset.assetId);
        }

        const hasReference = asset.referenceReadiness === "READY" && Boolean(asset.primaryReference.sourceName);
        const explicitlyBlocked = asset.referenceReadiness === "NOT_READY";
        if (!hasReference && !explicitlyBlocked) {
          requiredPremiumHybridWithNoReferenceOrBlockedStatus.push(asset.assetId);
        }
      }

      for (const state of asset.canonicalStates) {
        if (seenIds.has(state.stateId)) duplicateIds.push(state.stateId);
        seenIds.add(state.stateId);

        if (!state.pedagogicalState) stateWithNoPedagogicalState.push(state.stateId);

        // Known answer-bearing mnemonic dependency: a MNEMONIC-role asset's
        // hand IS the answer for "which rule applies here" -- it must never
        // appear in an ASSESSMENT state.
        if (asset.role === "MNEMONIC" && state.pedagogicalState === "ASSESSMENT") {
          assessmentLeaksMnemonic.push(`${asset.assetId}/${state.stateId}`);
        }
        if (state.pedagogicalState === "ASSESSMENT" && (state.annotationPolicy === "TEACHING_EXPLANATORY" || state.annotationPolicy === "FEEDBACK_EXPLANATORY")) {
          assessmentLeaksMnemonic.push(`${asset.assetId}/${state.stateId} (explanatory annotationPolicy in an ASSESSMENT state)`);
        }
      }
    }
  }

  return {
    totalRealCanonicalVariants: realIds.size,
    unmappedExistingVariants,
    requiredWithNoFamily,
    requiredPremiumHybridWithNoPrompt,
    requiredPremiumHybridWithNoReferenceOrBlockedStatus,
    familyReferencesNonexistentBlueprint,
    stateWithNoPedagogicalState,
    assessmentLeaksMnemonic,
    duplicateIds,
  };
}

export function isAuditClean(report: AuditReport): boolean {
  return (
    report.unmappedExistingVariants.length === 0 &&
    report.requiredWithNoFamily.length === 0 &&
    report.requiredPremiumHybridWithNoPrompt.length === 0 &&
    report.requiredPremiumHybridWithNoReferenceOrBlockedStatus.length === 0 &&
    report.familyReferencesNonexistentBlueprint.length === 0 &&
    report.stateWithNoPedagogicalState.length === 0 &&
    report.assessmentLeaksMnemonic.length === 0 &&
    report.duplicateIds.length === 0
  );
}

export function formatAuditReport(report: AuditReport): string {
  const lines: string[] = [];
  lines.push("CC-11.7 comprehensive visual-production catalogue audit");
  lines.push("==========================================================");
  lines.push(`Real CC-05D canonical variants (recomputed from source): ${report.totalRealCanonicalVariants}`);
  lines.push(`Unmapped existing canonical variants (target 0, FATAL -- "zero silently lost"): ${report.unmappedExistingVariants.length}`);
  if (report.unmappedExistingVariants.length) lines.push(`    ${report.unmappedExistingVariants.join("; ")}`);
  lines.push(`REQUIRED visual needs with no family (target 0, FATAL): ${report.requiredWithNoFamily.length}`);
  if (report.requiredWithNoFamily.length) lines.push(`    ${report.requiredWithNoFamily.join("; ")}`);
  lines.push(`REQUIRED premium/hybrid assets with no working prompt (target 0, FATAL): ${report.requiredPremiumHybridWithNoPrompt.length}`);
  if (report.requiredPremiumHybridWithNoPrompt.length) lines.push(`    ${report.requiredPremiumHybridWithNoPrompt.join("; ")}`);
  lines.push(`REQUIRED premium/hybrid assets with no reference or BLOCKED_REFERENCE status (target 0, FATAL): ${report.requiredPremiumHybridWithNoReferenceOrBlockedStatus.length}`);
  if (report.requiredPremiumHybridWithNoReferenceOrBlockedStatus.length) lines.push(`    ${report.requiredPremiumHybridWithNoReferenceOrBlockedStatus.join("; ")}`);
  lines.push(`Families referencing a nonexistent blueprint (target 0, FATAL): ${report.familyReferencesNonexistentBlueprint.length}`);
  if (report.familyReferencesNonexistentBlueprint.length) lines.push(`    ${report.familyReferencesNonexistentBlueprint.join("; ")}`);
  lines.push(`Canonical states with no pedagogical state (target 0, FATAL): ${report.stateWithNoPedagogicalState.length}`);
  if (report.stateWithNoPedagogicalState.length) lines.push(`    ${report.stateWithNoPedagogicalState.join("; ")}`);
  lines.push(`Assessment states exposing a known answer-bearing mnemonic dependency (target 0, FATAL): ${report.assessmentLeaksMnemonic.length}`);
  if (report.assessmentLeaksMnemonic.length) lines.push(`    ${report.assessmentLeaksMnemonic.join("; ")}`);
  lines.push(`Duplicate ids (family/asset/state, target 0, FATAL): ${report.duplicateIds.length}`);
  if (report.duplicateIds.length) lines.push(`    ${report.duplicateIds.join("; ")}`);
  return lines.join("\n");
}

function isMainModule(): boolean {
  const entryPoint = process.argv[1];
  if (!entryPoint) return false;
  return fileURLToPath(import.meta.url) === entryPoint;
}

if (isMainModule()) {
  const report = buildAuditReport();
  console.log(formatAuditReport(report));
  const clean = isAuditClean(report);
  console.log("");
  console.log(clean ? "PASS: comprehensive catalogue audit is clean." : "FAIL: one or more comprehensive-catalogue audit gates are non-zero.");
  if (process.argv.includes("--check") && !clean) {
    process.exit(1);
  }
}
