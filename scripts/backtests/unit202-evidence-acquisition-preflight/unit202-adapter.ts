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

import {
  DEFAULT_SOURCE_AUTHORITY_POLICY,
  LocalAccessGuard,
  hashContent,
  type CoverageDimension,
  type DirectionalMappingEntry,
  type KnowledgeEvidencePlanningInput,
  type KnowledgeTarget,
  type KnowledgeTargetKind,
  type TechnicalSemanticIdentity,
} from "@alp/technical-evidence-engine";

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

function expectedDimensionsForAC2_2(proposition: string): readonly CoverageDimension[] {
  const dims: CoverageDimension[] = ["DEFINITION", "QUANTITY_SYMBOL", "UNIT_SYMBOL"];
  if (proposition.includes("distinction")) dims.push("DISTINCTION");
  return dims;
}

function knowledgeTargetIdFor(acquisitionTargetId: string): string {
  return `unit202::${acquisitionTargetId}`;
}

// ---------------------------------------------------------------------
// CC-23A §2-§6: structured semantic identity. Every Unit-202 target is
// assigned a `TechnicalSemanticIdentity { semanticNamespace, semanticKey }`
// HERE, in the adapter -- the generic planner never derives identity from
// free text (task §6). `semanticNamespace` groups by genuine SUBJECT AREA
// (never a curriculum location such as an AC number, even though the
// lookup below happens to be indexed by AC for convenience -- the VALUES
// are portable domain names any qualification with, say, a mechanics
// section could reuse). `semanticKey` defaults to a slug of the
// proposition text (an implementation convenience for the common case of
// one atomic, non-reused target) but is explicitly OVERRIDDEN wherever two
// targets are judged, by a human, to be the same reusable technical truth
// (CC-23A §16's duplicate frequency/pole-pairs case) or where a homonym
// risk exists -- never a generic word-matching heuristic.
// ---------------------------------------------------------------------

const AC_SEMANTIC_NAMESPACE: Record<string, string> = {
  "AC1.1": "foundational-mathematics",
  "AC2.1": "electrical-quantities-and-circuit-theory",
  "AC2.2": "electrical-quantities-and-circuit-theory",
  "AC2.3": "electrical-quantities-and-circuit-theory",
  "AC3.1": "mechanics-and-machines",
  "AC3.2": "mechanics-and-machines",
  "AC3.3": "mechanics-and-machines",
  "AC3.4": "mechanics-and-machines",
  "AC4.1": "electrical-fundamentals-and-safety",
  "AC4.2": "electrical-fundamentals-and-safety",
  "AC4.3": "electrical-fundamentals-and-safety",
  "AC4.4": "electrical-fundamentals-and-safety",
  "AC4.6": "electrical-fundamentals-and-safety",
  "AC4.7": "electrical-fundamentals-and-safety",
  "AC4.8": "electrical-fundamentals-and-safety",
  "AC5.1": "electromagnetism-and-induction",
  "AC5.2": "electromagnetism-and-induction",
  "AC5.3": "electromagnetism-and-induction",
  "AC5.4": "electromagnetism-and-induction",
  "AC5.5": "electromagnetism-and-induction",
  "AC6.1": "electronic-devices-and-applications",
  "AC6.2": "electronic-devices-and-applications",
};

function defaultSemanticKeyFor(proposition: string): string {
  return proposition
    .trim()
    .toLowerCase()
    .replace(/[.]+$/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * CC-23A §16: two differently-worded propositions the Project Architect has
 * identified as the SAME calibrated technical relationship. Hand-verified
 * equality, never inferred from shared vocabulary -- an explicit
 * `semanticKey` override is the mechanism (task §4: identity, never text).
 */
const SEMANTIC_KEY_OVERRIDE: Record<string, string> = {
  "F = mg.": "weight-force-relationship",
  "F = mg where relevant.": "weight-force-relationship",
  "Frequency relationship to rotational speed and pole pairs.": "rotational-frequency-pole-pairs-relationship",
  "f = N x P (N = rev/s, P = pole pairs).": "rotational-frequency-pole-pairs-relationship",
};

function semanticIdentityFor(ac: string, proposition: string): TechnicalSemanticIdentity {
  return {
    semanticNamespace: AC_SEMANTIC_NAMESPACE[ac] ?? "unclassified",
    semanticKey: SEMANTIC_KEY_OVERRIDE[proposition] ?? defaultSemanticKeyFor(proposition),
  };
}

// ---------------------------------------------------------------------
// CC-23A §11-§15: the generic formula+rearrangement rule, applied to the
// four Unit-202 formula targets that previously abstained
// (SEMANTIC_DECOMPOSITION_REQUIRED) purely because they combined a formula
// with an unresolved "rearrangement/use" claim. Each is reclassified to
// FORMULA_OR_RULE and points `reusesFoundationalProcedureIds` at Unit
// 202's own existing, already-approved foundational procedure target
// ("Formula transposition.", ACQ-004) -- never a new technical-domain
// source requirement for ordinary algebra.
// ---------------------------------------------------------------------

const FORMULA_TRANSPOSITION_TARGET_ID = knowledgeTargetIdFor("ACQ-004");

interface FormulaRearrangementOverride {
  readonly requirementText: string;
}

const FORMULA_REARRANGEMENT_TARGETS: Record<string, FormulaRearrangementOverride> = {
  "ACQ-083": { requirementText: "R = ρL/A, including the meanings of R (resistance), ρ (resistivity), L (length) and A (cross-sectional area)." },
  "ACQ-085": { requirementText: "V = IR (Ohm's law), including the meanings of V (voltage), I (current) and R (resistance)." },
  "ACQ-106": { requirementText: "B = Φ/A, including the meanings of B (magnetic flux density), Φ (magnetic flux) and A (area)." },
  "ACQ-131": { requirementText: "f = N × P, where f is frequency, N is rotational speed in revolutions per second, and P is the number of pole pairs." },
  "ACQ-132": { requirementText: "f = N × P, where f is frequency, N is rotational speed in revolutions per second, and P is the number of pole pairs." },
};

// ---------------------------------------------------------------------
// CC-23A §17-§19: the generic directional/operational-rule pattern,
// applied to Unit 202's three hand-rule targets -- reclassified from
// RELATIONSHIP (which previously required, and never received, integration
// constituents or a foundational-procedure reuse) to OPERATIONAL_USE_RULE,
// a kind the planner already treats as atomic/class-A/READY.
// `directionalMapping` is generic structured metadata (role/meaning pairs)
// -- never an electrical-specific production field (task §CH).
// ---------------------------------------------------------------------

interface DirectionalRuleOverride {
  readonly requirementText: string;
  readonly directionalMapping: readonly DirectionalMappingEntry[];
}

const DIRECTIONAL_RULE_TARGETS: Record<string, DirectionalRuleOverride> = {
  "ACQ-108": {
    requirementText:
      "Right-hand grip rule: with the right hand's thumb aligned with the direction of conventional current, the curled fingers show the direction of magnetic-field circulation around the conductor; reversing the current reverses the field circulation.",
    directionalMapping: [
      { role: "hand", meaning: "right hand" },
      { role: "thumb", meaning: "aligned with the direction of conventional current" },
      { role: "curled-fingers", meaning: "show the direction of magnetic-field circulation" },
      { role: "reversal-rule", meaning: "reversing the current reverses the field circulation" },
    ],
  },
  "ACQ-114": {
    requirementText:
      "Fleming's left-hand rule (motor effect): with the left hand, the First finger points in the direction of the magnetic field, the Second finger points in the direction of conventional current, and the Thumb points in the direction of the resulting force/motion.",
    directionalMapping: [
      { role: "hand", meaning: "left hand" },
      { role: "first-finger", meaning: "direction of magnetic field" },
      { role: "second-finger", meaning: "direction of conventional current" },
      { role: "thumb", meaning: "direction of force/motion" },
    ],
  },
  "ACQ-117": {
    requirementText:
      "Fleming's right-hand rule (generator effect): with the right hand, the First finger points in the direction of the magnetic field, the Thumb points in the direction of conductor motion, and the Second finger points in the direction of the induced conventional current.",
    directionalMapping: [
      { role: "hand", meaning: "right hand" },
      { role: "first-finger", meaning: "direction of magnetic field" },
      { role: "thumb", meaning: "direction of conductor motion" },
      { role: "second-finger", meaning: "direction of induced conventional current" },
    ],
  },
};

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
    const semanticIdentity = semanticIdentityFor(t.ac, t.proposition);
    if (SEMANTIC_KEY_OVERRIDE[t.proposition]) notes.push(`explicit semanticKey override for cross-target reuse: "${semanticIdentity.semanticKey}"`);

    let kind: KnowledgeTargetKind = KIND_BY_PROPOSITION_KIND[t.propositionKind];
    let expectedCoverageDimensions: readonly CoverageDimension[] | undefined;
    let requirementText = t.proposition;
    let reusesFoundationalProcedureIds: readonly string[] | undefined;
    let directionalMapping: readonly DirectionalMappingEntry[] | undefined;
    let requiresMultipleIndependentClaims = t.requiresMultipleIndependentClaims;

    if (AC2_2_QUANTITIES.has(t.proposition)) {
      kind = "CONCEPT_DEFINITION";
      expectedCoverageDimensions = expectedDimensionsForAC2_2(t.proposition);
      notes.push(`AC2.2 compound quantity -- kind overridden to CONCEPT_DEFINITION, expectedCoverageDimensions=[${expectedCoverageDimensions.join(", ")}]`);
    } else if (BREADTH_PROPOSITIONS.has(t.proposition)) {
      kind = "BREADTH_TOPIC_COVERAGE";
      notes.push("hand-identified broad arithmetic/algebra topic -- kind overridden to BREADTH_TOPIC_COVERAGE");
    } else if (FORMULA_REARRANGEMENT_TARGETS[t.acquisitionTargetId]) {
      // CC-23A §11-§15/§12-§16: formula + ordinary algebraic rearrangement reuses the
      // generic governed formula-transposition/calculation prerequisite.
      const override = FORMULA_REARRANGEMENT_TARGETS[t.acquisitionTargetId]!;
      kind = "FORMULA_OR_RULE";
      requirementText = override.requirementText;
      reusesFoundationalProcedureIds = [FORMULA_TRANSPOSITION_TARGET_ID];
      notes.push(`CC-23A formula+rearrangement rule -- kind overridden to FORMULA_OR_RULE, reusesFoundationalProcedureIds=[${FORMULA_TRANSPOSITION_TARGET_ID}]`);
    } else if (DIRECTIONAL_RULE_TARGETS[t.acquisitionTargetId]) {
      // CC-23A §17-§19: directional/operational rule -- atomic, class A, READY.
      const override = DIRECTIONAL_RULE_TARGETS[t.acquisitionTargetId]!;
      kind = "OPERATIONAL_USE_RULE";
      requirementText = override.requirementText;
      directionalMapping = override.directionalMapping;
      expectedCoverageDimensions = ["CAUSAL_MECHANISM"];
      requiresMultipleIndependentClaims = false; // resolved atomically -- never an unresolved multi-claim target
      notes.push("CC-23A directional-rule pattern -- kind overridden to OPERATIONAL_USE_RULE, structured directionalMapping attached");
    }

    const constituentIds = INTEGRATION_CONSTITUENTS[t.proposition]?.map(knowledgeTargetIdFor);
    if (constituentIds) notes.push(`integration target -- constituentKnowledgeTargetIds=[${constituentIds.join(", ")}]`);

    const target: KnowledgeTarget = {
      knowledgeTargetId,
      targetText: requirementText,
      kind,
      classification: t.knowledgeClassification,
      semanticIdentity,
      ...(expectedCoverageDimensions ? { expectedCoverageDimensions } : {}),
      ...(requiresMultipleIndependentClaims ? { requiresMultipleIndependentClaims: true } : {}),
      ...(constituentIds ? { constituentKnowledgeTargetIds: constituentIds } : {}),
      ...(reusesFoundationalProcedureIds ? { reusesFoundationalProcedureIds } : {}),
      ...(directionalMapping ? { directionalMapping } : {}),
      isRepresentativeExemplar: t.isRepresentativeExemplar,
    };

    audit.push({ knowledgeTargetId, acquisitionTargetId: t.acquisitionTargetId, ac: t.ac, rawProposition: t.proposition, normalizedTargetText: requirementText, adapterDecisionNotes: notes });
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
