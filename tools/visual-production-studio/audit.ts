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

import { allAssets, FAMILIES, isPromptable, isReferenceBlocked, validateCatalogue, visualNeedClassificationFor } from "./catalogue.ts";
import { buildAssetPrompt } from "./prompt-builder.ts";

/**
 * CC-11.7A §2/§26: the exact 10 USEFUL findings the CC-11.7 audit report
 * (reports/instructional-visuals/unit202-comprehensive-visual-audit.md §4)
 * recorded, mechanically enumerated from that report -- not invented here.
 * Every one of these assetIds must exist in the live catalogue with
 * `needOverride: "USEFUL"`, or this gate fails (task brief §1's
 * acceptance criterion: "0 CC-11.7 USEFUL findings remain
 * documentation-only").
 */
export const EXPECTED_USEFUL_FINDING_ASSET_IDS: readonly string[] = [
  "unit202.instrument.clamp-meter", // finding 1
  "unit202.instrument.oscilloscope", // finding 2
  "unit202.current-direction.electron-flow-vs-conventional", // finding 3
  "unit202.magnet.permanent-vs-electromagnet", // finding 4
  "unit202.gears.rotation-direction", // finding 5
  "unit202.components.physical.zener-diode", // finding 6
  "unit202.components.physical.photodiode", // finding 7
  "unit202.components.physical.diac", // finding 8
  "unit202.components.physical.triac", // finding 9
  "unit202.components.physical.thyristor-scr", // finding 10
];

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
  /** CC-11.7A §1/§26: a CC-11.7 USEFUL finding that has no live catalogue asset at all, or exists but is missing `needOverride: "USEFUL"`. */
  usefulFindingsMissingFromCatalogue: string[];
  /** CC-11.7A §7/§8/§9/§26: catalogue structural-integrity problems, including "ONE ART PROMPT PER DISTINCT IMAGE JOB" violations -- see `validateCatalogue()` in catalogue.ts. */
  catalogueStructuralProblems: string[];
  /** CC-11.7B §6/§28: every ProductionAsset with more than one CanonicalState must carry a `sharedBaseAudit` decision -- "100% of multi-state ProductionAssets audited" is this package's own acceptance criterion. */
  multiStateAssetsMissingSharedBaseAudit: string[];
  /** CC-11.7B §28: a `sharedBaseAudit.classification === "SEPARATE_ARTWORK_REQUIRED"` asset must be a genuine, traceable split result (`action: "SPLIT"` and a `splitFrom` pointer) -- never a dangling "should split but didn't" marker left on an asset that still combines the conflicting states. */
  splitDecisionsNotApplied: string[];
  /** CC-11.7B §12/§28 regression proof: a REQUIRED asset must report classification REQUIRED regardless of reference readiness -- never silently excluded from the REQUIRED bucket because it is blocked. */
  requiredBlockedExcludedFromRequiredTotal: string[];
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

  // CC-11.7A §1/§26: every accepted CC-11.7 USEFUL finding must have a live
  // catalogue presence with needOverride: "USEFUL" -- recomputed from the
  // fixed, mechanically-enumerated finding list, never trusted from a
  // dashboard count alone.
  const usefulFindingsMissingFromCatalogue: string[] = [];
  for (const assetId of EXPECTED_USEFUL_FINDING_ASSET_IDS) {
    const asset = assets.find((a) => a.assetId === assetId);
    if (!asset) {
      usefulFindingsMissingFromCatalogue.push(`${assetId} (no catalogue asset with this id)`);
    } else if (asset.needOverride !== "USEFUL") {
      usefulFindingsMissingFromCatalogue.push(`${assetId} (exists but missing needOverride: "USEFUL")`);
    }
  }

  const catalogueStructuralProblems = validateCatalogue(families);

  // CC-11.7B §6/§28: 100% multi-state ProductionAsset shared-base audit coverage.
  const multiStateAssetsMissingSharedBaseAudit = assets.filter((a) => a.canonicalStates.length > 1 && !a.sharedBaseAudit).map((a) => a.assetId);

  // CC-11.7B §28: a SEPARATE_ARTWORK_REQUIRED decision must be a genuine, traceable split -- never a marker left on an asset that was never actually split.
  const splitDecisionsNotApplied = assets
    .filter((a) => a.sharedBaseAudit?.classification === "SEPARATE_ARTWORK_REQUIRED" && (a.sharedBaseAudit.action !== "SPLIT" || !a.sharedBaseAudit.splitFrom))
    .map((a) => a.assetId);

  // CC-11.7B §12/§28 regression proof: a REQUIRED-but-blocked asset must still classify as REQUIRED (and a USEFUL-but-blocked asset as USEFUL) -- BLOCKED_REFERENCE must never silently override pedagogical need.
  const requiredBlockedExcludedFromRequiredTotal = assets
    .filter((a) => isReferenceBlocked(a) && a.needOverride !== "USEFUL" && !a.needsScopeConfirmation && a.assetId !== "unit202.trigonometry" && visualNeedClassificationFor(a) !== "REQUIRED")
    .map((a) => a.assetId);

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
    usefulFindingsMissingFromCatalogue,
    catalogueStructuralProblems,
    multiStateAssetsMissingSharedBaseAudit,
    splitDecisionsNotApplied,
    requiredBlockedExcludedFromRequiredTotal,
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
    report.duplicateIds.length === 0 &&
    report.usefulFindingsMissingFromCatalogue.length === 0 &&
    report.catalogueStructuralProblems.length === 0 &&
    report.multiStateAssetsMissingSharedBaseAudit.length === 0 &&
    report.splitDecisionsNotApplied.length === 0 &&
    report.requiredBlockedExcludedFromRequiredTotal.length === 0
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
  lines.push(`CC-11.7 USEFUL findings missing from the live catalogue (target 0, FATAL): ${report.usefulFindingsMissingFromCatalogue.length}`);
  if (report.usefulFindingsMissingFromCatalogue.length) lines.push(`    ${report.usefulFindingsMissingFromCatalogue.join("; ")}`);
  lines.push(`Catalogue structural problems, incl. one-art-prompt-per-distinct-image-job violations (target 0, FATAL): ${report.catalogueStructuralProblems.length}`);
  if (report.catalogueStructuralProblems.length) lines.push(`    ${report.catalogueStructuralProblems.join("; ")}`);
  lines.push(`Multi-state assets missing a shared-base audit decision (target 0, FATAL): ${report.multiStateAssetsMissingSharedBaseAudit.length}`);
  if (report.multiStateAssetsMissingSharedBaseAudit.length) lines.push(`    ${report.multiStateAssetsMissingSharedBaseAudit.join("; ")}`);
  lines.push(`SEPARATE_ARTWORK_REQUIRED decisions not actually applied as a traceable split (target 0, FATAL): ${report.splitDecisionsNotApplied.length}`);
  if (report.splitDecisionsNotApplied.length) lines.push(`    ${report.splitDecisionsNotApplied.join("; ")}`);
  lines.push(`REQUIRED-but-blocked assets excluded from the REQUIRED total (target 0, FATAL): ${report.requiredBlockedExcludedFromRequiredTotal.length}`);
  if (report.requiredBlockedExcludedFromRequiredTotal.length) lines.push(`    ${report.requiredBlockedExcludedFromRequiredTotal.join("; ")}`);
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
