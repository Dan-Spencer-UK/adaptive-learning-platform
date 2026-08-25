/**
 * CC-11.11: the state-level completeness matrix -- one record per governed
 * canonical learner-visible state (98 as of this package), never per
 * ProductionAsset (53) and never per generated file. This is the mechanism
 * that makes "every one of the 98 states is accounted for" a checkable
 * fact rather than an assertion: `buildCompletenessMatrix()` classifies
 * every state into exactly one `ResolutionType`, and `HARD gate` in this
 * file's CLI entry point fails loudly if any REQUIRED-need state comes out
 * UNRESOLVED.
 *
 * Deliberately reads the LIVE catalogue (never a remembered/hardcoded
 * count) and the live proof-candidate filesystem (never assumes a file
 * exists without checking) -- see task brief CC-11.11 §2/§3/§4.
 */
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import {
  allAssets,
  familyForAsset,
  visualNeedClassificationFor,
  type CanonicalState,
  type VisualAsset,
  type VisualNeedClassification,
} from "./catalogue.ts";
import { REPO_ROOT } from "./paths.ts";
import { effectivePrimaryReference, effectiveReferenceReadiness } from "./reference-corrections.ts";
import { PRODUCTION_CANDIDATE_ROOT } from "./visual-proof/run-production.ts";
import type { ProofAuditResult, ProofGenerationMetadata } from "./visual-proof/proof-types.ts";

const JSON_PATH = join(REPO_ROOT, "reports", "instructional-visuals", "unit202-final-state-completeness.json");
const MD_PATH = join(REPO_ROOT, "reports", "instructional-visuals", "unit202-final-state-completeness.md");

/**
 * Snapshot of `apps/mobile/src/components/diagrams/DiagramRenderer.tsx`'s
 * own `SUPPORTED_DIAGRAM_BLUEPRINT_IDS` -- this tool lives in a separate
 * Node-only package from the React Native app (importing a `.tsx` file
 * with `react-native-svg` dependencies here is not viable), so the set is
 * mirrored here deliberately. Kept in sync manually; the real source of
 * truth (and the one CI/tests actually exercise) remains
 * `DiagramRenderer.test.tsx`'s own exact-match assertion.
 */
const KNOWN_DETERMINISTIC_RENDERER_BLUEPRINT_IDS = new Set([
  "circuit.series_resistors",
  "circuit.parallel_resistors",
  "circuit.series_parallel_mixed",
  "magnetic.field_conductor_direction",
  "motor.force_field_current",
  "graph.waveform_sine",
  "instrument.measurement_connection",
  "mechanical.lever_arrangement",
  "mechanical.gear_mesh",
  "mechanical.pulley_arrangement",
  "mechanical.resistivity_dimensions",
  "magnetic.pole_interaction",
  "magnetic.flux_field_lines",
  "emf.motional_emf_geometry",
  "generator.rotating_loop",
  "electronics.component_symbol_card",
  "electronics.rectification_waveform",
  "electronics.capacitor_transient_curve",
  "electronics.electron_flow_vs_conventional_current",
]);

/** CC-11.11: assets whose DETERMINISTIC_TECHNICAL production class has no wired renderer yet (electron-flow/rectification/capacitor-transient before this package) map to these new blueprint ids -- not present in catalogue.ts's own `governedDiagramBlueprintId` field. */
const NEWLY_WIRED_BLUEPRINT_ID_BY_ASSET: Record<string, string> = {
  "unit202.current-direction.electron-flow-vs-conventional": "electronics.electron_flow_vs_conventional_current",
  "unit202.rectification.waveforms": "electronics.rectification_waveform",
  "unit202.capacitor.transient": "electronics.capacitor_transient_curve",
};

export type ResolutionType = "GENERATED" | "DETERMINISTIC" | "REUSED_CANONICAL" | "SHARED_BASE_VALID" | "DEFERRED_SCOPE" | "UNRESOLVED";

export interface StateCompletenessRecord {
  stateId: string;
  assetId: string;
  familyId: string;
  familyDisplayName: string;
  role: VisualAsset["role"];
  displayName: string;
  pedagogicalState: CanonicalState["pedagogicalState"];
  category: "TEACHING" | "ASSESSMENT" | "FEEDBACK" | "OTHER";
  needClassification: VisualNeedClassification;
  productionClass: VisualAsset["productionClass"];
  technicalConcept: string;
  learnerVisiblePurpose: string;
  resolutionType: ResolutionType;
  resolvedVisualId?: string;
  resolvedPath?: string;
  rendererBlueprintId?: string;
  masterVersion?: number;
  masterSha256?: string;
  derivativePath?: string;
  referenceSourceName?: string;
  referenceSourceUrl?: string;
  approvalStatus: "PASS" | "HUMAN_REVIEW_REQUIRED" | "RETRY" | "N/A_DETERMINISTIC" | "N/A_DEFERRED" | "UNRESOLVED";
  assessmentLeakageStatus: "N/A" | "OK_NO_LEAKAGE" | "NEEDS_REVIEW";
  reuse: {
    canonicalAssetId: string;
    reusable: boolean;
    commissioningContext: string;
    usageBindings: string[];
  };
  notes: string;
}

function categoryFor(state: CanonicalState): StateCompletenessRecord["category"] {
  if (state.pedagogicalState === "TEACHING") return "TEACHING";
  if (state.pedagogicalState === "ASSESSMENT") return "ASSESSMENT";
  if (state.pedagogicalState === "MULTI_STATE") return "TEACHING"; // MULTI_STATE states in this catalogue are all teaching-context variants (e.g. recognition/moment-balance), never assessment-answer-bearing.
  return "OTHER";
}

function highestAudit(ownerAssetId: string, outputId: string): { attempt: number; metadata: ProofGenerationMetadata; audit: ProofAuditResult } | undefined {
  const dir = join(PRODUCTION_CANDIDATE_ROOT, ownerAssetId);
  if (!existsSync(dir)) return undefined;
  const prefix = outputId.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(`^${prefix}-audit-v(\\d+)\\.json$`);
  const attempts = readdirSync(dir)
    .map((f) => pattern.exec(f)?.[1])
    .filter((n): n is string => !!n)
    .map(Number)
    .sort((a, b) => b - a);
  for (const attempt of attempts) {
    const metaPath = join(dir, `${outputId}-metadata-v${attempt}.json`);
    const auditPath = join(dir, `${outputId}-audit-v${attempt}.json`);
    if (!existsSync(metaPath) || !existsSync(auditPath)) continue;
    const metadata = JSON.parse(readFileSync(metaPath, "utf8")) as ProofGenerationMetadata;
    const audit = JSON.parse(readFileSync(auditPath, "utf8")) as ProofAuditResult;
    return { attempt, metadata, audit };
  }
  return undefined;
}

function approvalStatusFromAudit(audit: ProofAuditResult | undefined): StateCompletenessRecord["approvalStatus"] {
  if (!audit) return "UNRESOLVED";
  if (audit.verdict === "PASS") return "PASS";
  if (audit.verdict === "HUMAN_REVIEW_REQUIRED") return "HUMAN_REVIEW_REQUIRED";
  return "RETRY";
}

/** The 2 magnet.poles.* assets whose ASSESSMENT state is explicitly delegated to a separate deterministic diagram, never a second premium generated image (see catalogue.ts prohibitedChanges on those assets). */
function isPoleInteractionAssessmentDelegate(asset: VisualAsset, state: CanonicalState): boolean {
  return (asset.assetId === "unit202.magnet.poles.like" || asset.assetId === "unit202.magnet.poles.unlike") && state.pedagogicalState === "ASSESSMENT";
}

export function buildCompletenessMatrix(): StateCompletenessRecord[] {
  const records: StateCompletenessRecord[] = [];

  for (const asset of allAssets()) {
    const family = familyForAsset(asset.assetId);
    const need = visualNeedClassificationFor(asset);
    const effectiveRef = effectiveReferenceReadiness(asset) === "READY" ? effectivePrimaryReference(asset) : undefined;

    for (const state of asset.canonicalStates) {
      const base: Omit<StateCompletenessRecord, "resolutionType" | "approvalStatus" | "assessmentLeakageStatus" | "resolvedVisualId" | "resolvedPath" | "rendererBlueprintId" | "masterVersion" | "masterSha256" | "derivativePath" | "notes"> = {
        stateId: state.stateId,
        assetId: asset.assetId,
        familyId: asset.familyId,
        familyDisplayName: family?.displayName ?? asset.familyId,
        role: asset.role,
        displayName: state.displayName,
        pedagogicalState: state.pedagogicalState,
        category: categoryFor(state),
        needClassification: need,
        productionClass: asset.productionClass,
        technicalConcept: family?.governedConcept ?? asset.governedDiagramBlueprintId ?? asset.instructionalPurpose,
        learnerVisiblePurpose: asset.instructionalPurpose,
        referenceSourceName: effectiveRef?.sourceName,
        referenceSourceUrl: effectiveRef?.sourceUrl,
        reuse: {
          canonicalAssetId: asset.assetId,
          reusable: true,
          commissioningContext: "unit202",
          usageBindings: ["unit202"],
        },
      };

      // 1. Explicit governance-level deferral (only unit202.trigonometry today).
      if (need === "DEFERRED_SCOPE") {
        records.push({
          ...base,
          resolutionType: "DEFERRED_SCOPE",
          approvalStatus: "N/A_DEFERRED",
          assessmentLeakageStatus: "N/A",
          notes: "Governed DEFERRED_SCOPE: no lesson exists yet to host this asset (tracked for future commissioning only per catalogue.ts visualNeedClassificationFor).",
        });
        continue;
      }

      // 2. DETERMINISTIC_TECHNICAL production class -> deterministic renderer pathway.
      if (asset.productionClass === "DETERMINISTIC_TECHNICAL") {
        const blueprintId = asset.governedDiagramBlueprintId ?? NEWLY_WIRED_BLUEPRINT_ID_BY_ASSET[asset.assetId];
        const rendererExists = !!blueprintId && KNOWN_DETERMINISTIC_RENDERER_BLUEPRINT_IDS.has(blueprintId);
        records.push({
          ...base,
          resolutionType: rendererExists ? "DETERMINISTIC" : "UNRESOLVED",
          rendererBlueprintId: blueprintId,
          approvalStatus: rendererExists ? "N/A_DETERMINISTIC" : "UNRESOLVED",
          assessmentLeakageStatus: "N/A",
          notes: rendererExists
            ? `Deterministic vector renderer registered in apps/mobile/src/components/diagrams/DiagramRenderer.tsx under blueprint id "${blueprintId}". ${NEWLY_WIRED_BLUEPRINT_ID_BY_ASSET[asset.assetId] ? "CC-11.11: renderer newly added this package; not yet wired to any lesson step's representation.diagramBlueprintId (content-layer integration, out of this pass's scope)." : ""}`.trim()
            : `No registered deterministic renderer found for blueprint id "${blueprintId ?? "(none declared)"}".`,
        });
        continue;
      }

      // 3. magnet.poles.*.state.assessment -> delegated to the separate magnetic.pole_interaction deterministic diagram, not this premium asset.
      if (isPoleInteractionAssessmentDelegate(asset, state)) {
        records.push({
          ...base,
          resolutionType: "DETERMINISTIC",
          rendererBlueprintId: "magnetic.pole_interaction",
          approvalStatus: "N/A_DETERMINISTIC",
          assessmentLeakageStatus: "OK_NO_LEAKAGE",
          notes:
            "Per this asset's own governed prohibitedChanges: the premium TEACHING image is never reused/withheld for assessment -- the assessment reveal/withhold state is governed entirely by the separate deterministic magnetic.pole_interaction diagram (MagneticPoleDiagram.tsx), which never bakes the attract/repel answer unless explicitly revealed.",
        });
        continue;
      }

      // 4. Otherwise: this state must resolve to a real generated image, either a state-specific final output or a validly shared asset-level base.
      const stateSpecific = highestAudit(asset.assetId, state.stateId);
      if (stateSpecific) {
        records.push({
          ...base,
          resolutionType: "GENERATED",
          resolvedVisualId: state.stateId,
          resolvedPath: stateSpecific.metadata.masterPath,
          masterVersion: stateSpecific.attempt,
          masterSha256: stateSpecific.metadata.masterSha256,
          derivativePath: stateSpecific.metadata.derivativePath,
          approvalStatus: approvalStatusFromAudit(stateSpecific.audit),
          assessmentLeakageStatus: state.pedagogicalState === "ASSESSMENT" ? (state.requiredLabels.length === 0 ? "OK_NO_LEAKAGE" : "NEEDS_REVIEW") : "N/A",
          notes: `State-specific final generated output (CC-11.10/CC-11.11), attempt ${stateSpecific.attempt}.`,
        });
        continue;
      }

      const assetBase = highestAudit(asset.assetId, asset.assetId);
      const isSharedBaseValid = asset.sharedBaseAudit?.classification === "SAFE_SHARED_BASE";
      // "Sole generative state": excludes sibling states that resolve entirely through a
      // separate deterministic diagram (e.g. magnet.poles.*'s assessment state) -- those
      // never compete for this asset's one generated image, so a 2-state asset with one
      // deterministic-delegated sibling still has exactly one state that legitimately owns
      // the asset-level base, same as a genuinely single-state asset.
      const generativeStates = asset.canonicalStates.filter((s) => !isPoleInteractionAssessmentDelegate(asset, s));
      const isSoleGenerativeState = generativeStates.length === 1;
      if (assetBase && (isSoleGenerativeState || isSharedBaseValid)) {
        records.push({
          ...base,
          resolutionType: isSoleGenerativeState ? "GENERATED" : "SHARED_BASE_VALID",
          resolvedVisualId: asset.assetId,
          resolvedPath: assetBase.metadata.masterPath,
          masterVersion: assetBase.attempt,
          masterSha256: assetBase.metadata.masterSha256,
          derivativePath: assetBase.metadata.derivativePath,
          approvalStatus: approvalStatusFromAudit(assetBase.audit),
          assessmentLeakageStatus: state.pedagogicalState === "ASSESSMENT" ? (state.requiredLabels.length === 0 ? "OK_NO_LEAKAGE" : "NEEDS_REVIEW") : "N/A",
          notes: isSoleGenerativeState
            ? `The asset's own base generated image fully represents this, its only state actually requiring generated artwork${asset.canonicalStates.length > 1 ? " (the other canonicalState resolves via a separate deterministic diagram, see that state's own record)" : ""}, attempt ${assetBase.attempt}.`
            : `Governed SAFE_SHARED_BASE (${asset.sharedBaseAudit?.rationale ?? ""}) -- the asset's shared base image validly covers this state via a deterministic-overlay-only difference (e.g. dimension/comparison callouts), not a baked scene change. Attempt ${assetBase.attempt}.`,
        });
        continue;
      }

      // 5. Genuinely unresolved -- no valid pathway found by any of the above rules.
      records.push({
        ...base,
        resolutionType: "UNRESOLVED",
        approvalStatus: "UNRESOLVED",
        assessmentLeakageStatus: "N/A",
        notes: assetBase
          ? "Asset-level base image exists but this state is neither this asset's sole state nor covered by a governed SAFE_SHARED_BASE classification -- a genuine state-specific gap."
          : "No generated image (state-specific or asset-level base) found on disk for this state at all.",
      });
    }
  }

  return records;
}

export function summariseMatrix(records: StateCompletenessRecord[]) {
  const count = (fn: (r: StateCompletenessRecord) => boolean) => records.filter(fn).length;
  return {
    liveCanonicalStateTotal: records.length,
    liveProductionAssetTotal: new Set(records.map((r) => r.assetId)).size,
    generated: count((r) => r.resolutionType === "GENERATED"),
    deterministic: count((r) => r.resolutionType === "DETERMINISTIC"),
    reusedCanonical: count((r) => r.resolutionType === "REUSED_CANONICAL"),
    sharedBaseValid: count((r) => r.resolutionType === "SHARED_BASE_VALID"),
    deferredScope: count((r) => r.resolutionType === "DEFERRED_SCOPE"),
    unresolved: count((r) => r.resolutionType === "UNRESOLVED"),
    unresolvedRequired: count((r) => r.resolutionType === "UNRESOLVED" && r.needClassification === "REQUIRED"),
    pass: count((r) => r.approvalStatus === "PASS"),
    humanReviewRequired: count((r) => r.approvalStatus === "HUMAN_REVIEW_REQUIRED"),
    retry: count((r) => r.approvalStatus === "RETRY"),
    assessmentNeedsReview: count((r) => r.assessmentLeakageStatus === "NEEDS_REVIEW"),
  };
}

function toMarkdown(records: StateCompletenessRecord[], summary: ReturnType<typeof summariseMatrix>): string {
  const lines: string[] = [];
  lines.push("# Unit 202 -- Final State-Level Completeness Matrix (CC-11.11)");
  lines.push("");
  lines.push(`Generated: ${new Date().toISOString()}`);
  lines.push("");
  lines.push("## Summary");
  lines.push("");
  lines.push(`- Live canonical-state total: **${summary.liveCanonicalStateTotal}**`);
  lines.push(`- Live ProductionAsset total: **${summary.liveProductionAssetTotal}**`);
  lines.push(`- GENERATED: ${summary.generated}`);
  lines.push(`- DETERMINISTIC: ${summary.deterministic}`);
  lines.push(`- REUSED_CANONICAL: ${summary.reusedCanonical}`);
  lines.push(`- SHARED_BASE_VALID: ${summary.sharedBaseValid}`);
  lines.push(`- DEFERRED_SCOPE: ${summary.deferredScope}`);
  lines.push(`- UNRESOLVED: ${summary.unresolved} (of which REQUIRED-need: ${summary.unresolvedRequired})`);
  lines.push(`- PASS: ${summary.pass}`);
  lines.push(`- HUMAN_REVIEW_REQUIRED: ${summary.humanReviewRequired}`);
  lines.push(`- RETRY (incomplete): ${summary.retry}`);
  lines.push(`- Assessment states needing leakage review: ${summary.assessmentNeedsReview}`);
  lines.push("");

  const byFamily = new Map<string, StateCompletenessRecord[]>();
  for (const r of records) {
    if (!byFamily.has(r.familyId)) byFamily.set(r.familyId, []);
    byFamily.get(r.familyId)!.push(r);
  }

  for (const [familyId, familyRecords] of [...byFamily.entries()].sort(([a], [b]) => a.localeCompare(b))) {
    lines.push(`## ${familyRecords[0]!.familyDisplayName} (\`${familyId}\`)`);
    lines.push("");
    lines.push("| stateId | resolutionType | approvalStatus | needClassification | assessmentLeakage | notes |");
    lines.push("|---|---|---|---|---|---|");
    for (const r of familyRecords) {
      lines.push(`| \`${r.stateId}\` | ${r.resolutionType} | ${r.approvalStatus} | ${r.needClassification} | ${r.assessmentLeakageStatus} | ${r.notes.replace(/\|/g, "/").slice(0, 200)} |`);
    }
    lines.push("");
  }

  return lines.join("\n");
}

export function generateFinalStateCompleteness(): { jsonPath: string; mdPath: string; summary: ReturnType<typeof summariseMatrix> } {
  const records = buildCompletenessMatrix();
  const summary = summariseMatrix(records);
  writeFileSync(JSON_PATH, JSON.stringify({ generatedAt: new Date().toISOString(), summary, records }, null, 2) + "\n", "utf8");
  writeFileSync(MD_PATH, toMarkdown(records, summary), "utf8");
  return { jsonPath: JSON_PATH, mdPath: MD_PATH, summary };
}

function isMainModule(): boolean {
  const entryPoint = process.argv[1];
  if (!entryPoint) return false;
  return import.meta.url === `file://${entryPoint.replace(/\\/g, "/")}` || import.meta.url.endsWith(entryPoint.replace(/\\/g, "/"));
}

if (isMainModule()) {
  const { jsonPath, mdPath, summary } = generateFinalStateCompleteness();
  console.log(`Completeness matrix written: ${jsonPath}`);
  console.log(`Completeness matrix written: ${mdPath}`);
  console.log(JSON.stringify(summary, null, 2));
  if (summary.unresolvedRequired > 0) {
    console.error(`HARD GATE FAILED: ${summary.unresolvedRequired} REQUIRED-need state(s) are UNRESOLVED.`);
    process.exitCode = 1;
  }
}
