/**
 * CC-23 section 17: the Unit-202 ADAPTER -- the ONLY place in this whole
 * package where Unit-202-specific judgement is allowed to live. Translates
 * the frozen blind acquisition target manifest into the generic
 * `@alp/technical-evidence-engine` `KnowledgeEvidencePlanningInput`
 * contract. The generic planner (`planEvidenceRequirements`) never sees
 * this file, never sees "AC2.2", never sees "Unit 202" -- only the
 * structural `KnowledgeTarget` fields this adapter populates.
 *
 * Frozen input (task section 17/26): reports/backtests/unit202-evidence-
 * acquisition-benchmark/UNIT202-BLIND-ACQUISITION-TARGETS.json, read
 * through a real `LocalAccessGuard` instance (task section 21 -- this is
 * not merely documented isolation, the read is actually gated).
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { LocalAccessGuard, hashContent, type CoverageDimension, type KnowledgeEvidencePlanningInput, type KnowledgeTarget, type KnowledgeTargetKind } from "@alp/technical-evidence-engine";
import { DEFAULT_SOURCE_AUTHORITY_POLICY } from "@alp/technical-evidence-engine";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const repoRoot = path.resolve(__dirname, "..", "..", "..");

const BLIND_TARGETS_RELATIVE_PATH = "reports/backtests/unit202-evidence-acquisition-benchmark/UNIT202-BLIND-ACQUISITION-TARGETS.json";

interface BlindAcquisitionTarget {
  readonly acquisitionTargetId: string;
  readonly ac: string;
  readonly proposition: string;
  readonly knowledgeClassification: "REQUIRED_QUALIFICATION_KNOWLEDGE" | "FOUNDATIONAL_PREREQUISITE" | "CONTEXTUAL_TEACHING_SUPPORT";
  readonly acquisitionReplayRequirement: "REQUIRED" | "OPTIONAL_CONTEXT";
  readonly isRepresentativeExemplar: boolean;
  readonly propositionKind: "FACTUAL_PROPOSITION" | "PROCEDURE_OR_CALCULATION_RULE" | "SYMBOL_OR_CONVENTION" | "RELATIONSHIP_OR_MECHANISM" | "PHYSICAL_OR_COMPONENT_RECOGNITION";
  readonly technicalDomainCategory: string;
  readonly requiresMultipleIndependentClaims: boolean;
  readonly genericRequiredSourceCharacteristics: readonly string[];
  readonly acceptanceCriteria: string;
}

interface BlindAcquisitionTargetManifest {
  readonly qualificationId: string;
  readonly purpose: string;
  readonly targets: readonly BlindAcquisitionTarget[];
}

/**
 * The ONLY allowed local read this adapter performs -- gated through a
 * real `LocalAccessGuard` scoped to exactly the one frozen manifest, by
 * exact path (no hash pin here since the adapter does not yet know the
 * expected hash independently; the sealed benchmark builder already
 * proves byte-identical reproduction -- see build-preflight.test.ts's
 * own independent hash check against the same constant used there).
 */
export function readBlindAcquisitionTargets(): { manifest: BlindAcquisitionTargetManifest; contentHash: string } {
  const guard = new LocalAccessGuard({
    experimentId: "unit202-preflight-adapter",
    allowedInputs: [{ rule: "FROZEN_BLIND_TARGET_MANIFEST", matchKind: "EXACT_PATH", pathOrGlob: BLIND_TARGETS_RELATIVE_PATH, note: "The one frozen input this adapter is authorised to read." }],
  });
  const absPath = path.join(repoRoot, BLIND_TARGETS_RELATIVE_PATH);
  const raw = readFileSync(absPath, "utf-8");
  guard.checkRead(BLIND_TARGETS_RELATIVE_PATH, "translate frozen Unit-202 blind acquisition targets into the generic KnowledgeEvidencePlanningInput contract", raw);
  return { manifest: JSON.parse(raw) as BlindAcquisitionTargetManifest, contentHash: hashContent(raw) };
}

// ---------------------------------------------------------------------
// Adapter-level, qualification-specific judgement (task §17/§18). Every
// decision here is hand-verified against the real proposition text --
// never a generic regex heuristic -- and documented with its reasoning,
// exactly like every other explicit binding decision in this reconciled
// package.
// ---------------------------------------------------------------------

const KIND_BY_PROPOSITION_KIND: Record<BlindAcquisitionTarget["propositionKind"], KnowledgeTargetKind> = {
  FACTUAL_PROPOSITION: "FACTUAL_PROPOSITION",
  PROCEDURE_OR_CALCULATION_RULE: "PROCEDURE",
  SYMBOL_OR_CONVENTION: "SYMBOL_OR_CONVENTION",
  RELATIONSHIP_OR_MECHANISM: "RELATIONSHIP",
  PHYSICAL_OR_COMPONENT_RECOGNITION: "RECOGNITION_REQUIREMENT",
}

/**
 * Task §18 "AC2.2 meaning/symbol/unit/distinction decomposes into
 * independent coverage dimensions" -- the eleven electrical-quantity
 * propositions each state meaning + quantity symbol + unit name/symbol
 * (+ an explicit distinction from a confusable quantity, where present in
 * the source text). Hand-verified against the real proposition text, not
 * a generic length/shape heuristic.
 */
const AC2_2_QUANTITIES = new Set([
  "Current: meaning, quantity symbol, unit name/symbol.",
  "Voltage: meaning, quantity symbol, unit name/symbol.",
  "Resistance: meaning, quantity symbol, unit name/symbol, distinction from resistivity.",
  "Resistivity: meaning, quantity symbol, unit name/symbol, distinction from resistance.",
  "Power: meaning, quantity symbol, unit name/symbol, distinction from energy and from power factor.",
  "Energy: meaning, quantity symbol, unit name/symbol, distinction from power.",
  "Frequency: meaning, quantity symbol, unit name/symbol.",
  "Impedance: meaning, quantity symbol, unit name/symbol, distinction from resistance and reactance.",
  "Capacitance and capacitive reactance: meaning, quantity symbol, unit name/symbol, distinction between the two.",
  "Inductance and inductive reactance: meaning, quantity symbol, unit name/symbol, distinction between the two.",
  "Power factor: meaning, quantity symbol, unit name/symbol (dimensionless), distinction from power.",
]);

/**
 * Task §16.D / §18 "'Fractions.' becomes TOPIC_BREADTH_COVERAGE... not a
 * fake exact fact" -- the small set of AC1.1 propositions that are
 * genuinely broad arithmetic/algebra topic areas rather than one atomic
 * fact, procedure, or symbol. Deliberately NOT extended to
 * "Positive/Negative indices." (a specific, narrow index rule),
 * "Pythagoras." (a single named theorem -- FORMULA_OR_RULE), or the
 * statistics propositions (each names one specific measure) -- breadth is
 * a hand-verified judgement about the proposition's actual mathematical
 * scope, never a text-shape heuristic (a bare one-word sentence is not by
 * itself evidence of breadth; see historical-benchmark-bindings.ts's own
 * identical caution for "bare 'Algebra.'").
 */
const BREADTH_PROPOSITIONS = new Set(["Fractions.", "Percentages.", "Algebra."]);

/**
 * Task §18 "relationships between force, work, energy, power and
 * efficiency reuses constituent technical truths" -- the five already-
 * independently-sourceable AC3.3 atomic concepts this integration target
 * is satisfied by. Hand-identified against the real cluster, not derived
 * mechanically (the manifest carries no explicit constituent-graph field).
 */
const INTEGRATION_CONSTITUENTS: Record<string, readonly string[]> = {
  "Relationships between force, work, energy, power and efficiency.": ["ACQ-060", "ACQ-061", "ACQ-062", "ACQ-064", "ACQ-065"],
};

/**
 * Task §10 "F = mg appearing in multiple ACs must become one canonical
 * evidence requirement" -- the manifest carries this as two SLIGHTLY
 * different raw strings ("F = mg." at AC3.1, "F = mg where relevant." at
 * AC3.3); this adapter is the qualification-specific place a human judges
 * them the SAME canonical technical truth and normalizes both to
 * identical `targetText` so the generic planner's own domain-oriented
 * canonical-key dedup (never text-content-aware on its own) collapses
 * them naturally.
 */
const CANONICAL_TEXT_NORMALIZATION: Record<string, string> = {
  "F = mg where relevant.": "F = mg.",
};

function expectedDimensionsForAC2_2(proposition: string): readonly CoverageDimension[] {
  const dims: CoverageDimension[] = ["DEFINITION", "QUANTITY_SYMBOL", "UNIT_SYMBOL"];
  if (proposition.includes("distinction")) dims.push("DISTINCTION");
  return dims;
}

function knowledgeTargetIdFor(acquisitionTargetId: string): string {
  return `unit202::${acquisitionTargetId}`;
}

export interface AdapterAuditEntry {
  readonly knowledgeTargetId: string;
  readonly acquisitionTargetId: string;
  readonly ac: string;
  readonly rawProposition: string;
  readonly normalizedTargetText: string;
  readonly adapterDecisionNotes: readonly string[];
}

export interface AdapterResult {
  readonly input: KnowledgeEvidencePlanningInput;
  readonly audit: readonly AdapterAuditEntry[];
  readonly blindTargetsContentHash: string;
}

/** Translates the frozen Unit-202 blind acquisition target manifest into the generic planning input contract (task §7/§17). */
export function buildUnit202PlanningInput(): AdapterResult {
  const { manifest, contentHash } = readBlindAcquisitionTargets();
  const audit: AdapterAuditEntry[] = [];

  const targets: KnowledgeTarget[] = manifest.targets.map((t) => {
    const notes: string[] = [];
    const knowledgeTargetId = knowledgeTargetIdFor(t.acquisitionTargetId);
    const normalizedText = CANONICAL_TEXT_NORMALIZATION[t.proposition] ?? t.proposition;
    if (CANONICAL_TEXT_NORMALIZATION[t.proposition]) notes.push(`text normalized for canonical dedup: "${t.proposition}" -> "${normalizedText}"`);

    let kind: KnowledgeTargetKind = KIND_BY_PROPOSITION_KIND[t.propositionKind];
    let expectedCoverageDimensions: readonly CoverageDimension[] | undefined;

    if (AC2_2_QUANTITIES.has(t.proposition)) {
      kind = "CONCEPT_DEFINITION";
      expectedCoverageDimensions = expectedDimensionsForAC2_2(t.proposition);
      notes.push(`AC2.2 compound quantity -- kind overridden to CONCEPT_DEFINITION, expectedCoverageDimensions=[${expectedCoverageDimensions.join(", ")}]`);
    } else if (BREADTH_PROPOSITIONS.has(t.proposition)) {
      kind = "BREADTH_TOPIC_COVERAGE";
      notes.push("hand-identified broad arithmetic/algebra topic -- kind overridden to BREADTH_TOPIC_COVERAGE");
    }

    const constituentIds = INTEGRATION_CONSTITUENTS[t.proposition]?.map(knowledgeTargetIdFor);
    if (constituentIds) notes.push(`integration target -- constituentKnowledgeTargetIds=[${constituentIds.join(", ")}]`);

    const target: KnowledgeTarget = {
      knowledgeTargetId,
      targetText: normalizedText,
      kind,
      classification: t.knowledgeClassification,
      ...(expectedCoverageDimensions ? { expectedCoverageDimensions } : {}),
      ...(t.requiresMultipleIndependentClaims ? { requiresMultipleIndependentClaims: true } : {}),
      ...(constituentIds ? { constituentKnowledgeTargetIds: constituentIds } : {}),
      isRepresentativeExemplar: t.isRepresentativeExemplar,
    };

    audit.push({ knowledgeTargetId, acquisitionTargetId: t.acquisitionTargetId, ac: t.ac, rawProposition: t.proposition, normalizedTargetText: normalizedText, adapterDecisionNotes: notes });
    return target;
  });

  return {
    input: {
      qualificationContext: { qualificationContextId: "unit202", description: manifest.purpose },
      knowledgeTargets: targets,
      sourceAuthorityPolicy: DEFAULT_SOURCE_AUTHORITY_POLICY,
    },
    audit,
    blindTargetsContentHash: contentHash,
  };
}
