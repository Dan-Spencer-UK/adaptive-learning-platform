/**
 * CC-24 PA-review correction §4: generates
 * `CC-24-PILOT-002-DEPTH-REVIEW-INPUT.json` -- a deterministic, ANSWER-
 * FREE review input for the Project Architect's own qualification-depth
 * decision on all 15 selected requirements, ahead of any pilot-002.
 *
 * Imports ONLY: the frozen blind target manifest (via the Unit-202
 * adapter, through a real guarded read), the Unit-202 adapter's own
 * audit metadata, the corrected clean plan (canonical authority policy
 * already applied), and the fixed 15-ID selection definition. NEVER
 * reads pilot-001 artifacts, historical benchmarks, source dossiers, old
 * claims, learner assertions, lessons/storyboards, or private
 * calibration material -- none of those are imported anywhere on this
 * script's module graph (mechanically proven alongside the rest of the
 * clean pilot-preparation path by clean-plan.test.ts's import-graph scan,
 * which covers every file in this directory).
 *
 * Every `paDepthReview` field is explicitly `null` -- this script makes
 * NO depth, curriculum, or pedagogy decision, and infers nothing.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import type { EvidenceRequirement, KnowledgeTarget } from "@alp/technical-evidence-engine";

import { buildUnit202PlanningInput, type AdapterAuditEntry } from "../unit202-evidence-acquisition-preflight/unit202-adapter.ts";
import { buildCleanPlan } from "./clean-plan.ts";
import { SELECTED_EVIDENCE_REQUIREMENT_IDS } from "./pilot-selection.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..", "..", "..");
const outDir = path.join(repoRoot, "reports", "backtests", "unit202-blind-acquisition-run");

export interface QualificationProvenanceEntry {
  readonly knowledgeTargetId: string;
  readonly acquisitionTargetId: string;
  readonly ac: string;
  readonly rawQualificationWording: string;
}

export interface EmptyPaDepthReview {
  readonly qualificationPerformanceVerb: null;
  readonly minimumSufficientDepth: null;
  readonly maximumJustifiedDepth: null;
  readonly excludedEnrichment: null;
  readonly assessmentPerformanceExpected: null;
  readonly depthEvidenceBasis: null;
  readonly depthVerdict: null;
  readonly architectNotes: null;
  readonly approvedAt: null;
}

export interface DepthReviewItem {
  readonly evidenceRequirementId: string;
  readonly sourceKnowledgeTargetIds: readonly string[];
  readonly qualificationProvenance: readonly QualificationProvenanceEntry[];
  readonly requirementMode: string;
  readonly specificationMode: string;
  readonly requirementText: string;
  readonly evidenceQuestion: string | null;
  readonly requiredCoverageDimensions: readonly string[];
  readonly permittedAuthorityClasses: readonly string[];
  readonly acceptanceCriteria: string;
  readonly calibratedSupportingPerformance: unknown;
  readonly representativeExemplar: boolean;
  readonly reusesFoundationalProcedureIds: readonly string[] | null;
  readonly paDepthReview: EmptyPaDepthReview;
}

export interface DepthReviewInput {
  readonly generatedAt: string;
  readonly purpose: string;
  readonly status: "PENDING_PROJECT_ARCHITECT_DEPTH_REVIEW";
  readonly expectedItemCount: number;
  readonly items: readonly DepthReviewItem[];
}

const EMPTY_PA_DEPTH_REVIEW: EmptyPaDepthReview = {
  qualificationPerformanceVerb: null,
  minimumSufficientDepth: null,
  maximumJustifiedDepth: null,
  excludedEnrichment: null,
  assessmentPerformanceExpected: null,
  depthEvidenceBasis: null,
  depthVerdict: null,
  architectNotes: null,
  approvedAt: null,
};

/** Deterministic -- calling this twice against the same repository state produces byte-identical output (no timestamps or random ordering inside `items`; `generatedAt` is the one intentionally-variable field, excluded from any equality check a caller should perform). */
export function buildDepthReviewInput(): DepthReviewInput {
  const { input, audit } = buildUnit202PlanningInput();
  const plan = buildCleanPlan();

  const auditByTargetId = new Map<string, AdapterAuditEntry>();
  for (const a of audit) auditByTargetId.set(a.knowledgeTargetId, a);
  const targetById = new Map<string, KnowledgeTarget>();
  for (const t of input.knowledgeTargets) targetById.set(t.knowledgeTargetId, t);
  const requirementById = new Map<string, EvidenceRequirement>();
  for (const r of plan.requirements) requirementById.set(r.evidenceRequirementId, r);

  const items: DepthReviewItem[] = SELECTED_EVIDENCE_REQUIREMENT_IDS.map((id) => {
    const r = requirementById.get(id);
    if (!r) throw new Error(`buildDepthReviewInput: "${id}" is not present in the corrected clean plan -- refusing to generate an incomplete depth-review input.`);

    const qualificationProvenance: QualificationProvenanceEntry[] = r.sourceKnowledgeTargetIds.map((ktId) => {
      const a = auditByTargetId.get(ktId);
      if (!a) throw new Error(`buildDepthReviewInput: no adapter audit entry found for source knowledge target "${ktId}" (required for "${id}").`);
      return { knowledgeTargetId: ktId, acquisitionTargetId: a.acquisitionTargetId, ac: a.ac, rawQualificationWording: a.rawProposition };
    });

    const reusesFoundationalProcedureIds = r.sourceKnowledgeTargetIds.reduce<string[]>((acc, ktId) => {
      const t = targetById.get(ktId);
      if (t?.reusesFoundationalProcedureIds) acc.push(...t.reusesFoundationalProcedureIds);
      return acc;
    }, []);

    return {
      evidenceRequirementId: r.evidenceRequirementId,
      sourceKnowledgeTargetIds: r.sourceKnowledgeTargetIds,
      qualificationProvenance,
      requirementMode: r.requirementMode,
      specificationMode: r.specificationMode,
      requirementText: r.requirementText,
      evidenceQuestion: r.evidenceQuestion,
      requiredCoverageDimensions: r.requiredCoverageDimensions,
      permittedAuthorityClasses: r.sourceAuthorityClasses,
      acceptanceCriteria: r.acceptanceCriteria,
      calibratedSupportingPerformance: r.calibratedSupportingPerformance,
      representativeExemplar: r.representativeExemplar,
      reusesFoundationalProcedureIds: reusesFoundationalProcedureIds.length > 0 ? reusesFoundationalProcedureIds : null,
      paDepthReview: EMPTY_PA_DEPTH_REVIEW,
    };
  });

  return {
    generatedAt: new Date().toISOString(),
    purpose: "Answer-free, deterministic review input for the Project Architect's qualification-depth decision on all 15 CC-24 pilot-selected requirements, ahead of the next acquisition attempt. Generated only from the sealed blind target, the Unit-202 adapter/audit metadata, the corrected clean plan, and the fixed 15-ID selection definition -- never from the prior invalidated acquisition run's own artifacts, historical benchmarks, source dossiers, old claims, learner assertions, lessons/storyboards, or private calibration material.",
    status: "PENDING_PROJECT_ARCHITECT_DEPTH_REVIEW",
    expectedItemCount: SELECTED_EVIDENCE_REQUIREMENT_IDS.length,
    items,
  };
}

if (path.resolve(__filename) === path.resolve(process.argv[1] ?? "")) {
  mkdirSync(outDir, { recursive: true });
  const output = buildDepthReviewInput();
  writeFileSync(path.join(outDir, "CC-24-PILOT-002-DEPTH-REVIEW-INPUT.json"), JSON.stringify(output, null, 2) + "\n", "utf-8");
  console.log("CC-24-PILOT-002-DEPTH-REVIEW-INPUT.json written:", output.items.length, "items, status:", output.status);
}
