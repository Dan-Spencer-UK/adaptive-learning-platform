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
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  DEFAULT_SOURCE_AUTHORITY_POLICY,
  LocalAccessGuard,
  hashContent,
  type CoverageDimension,
  type KnowledgeEvidencePlanResult,
  type KnowledgeEvidencePlanningInput,
  type KnowledgeTarget,
  type KnowledgeTargetKind,
  type RequirementSpecificationMode,
  type SourceAuthorityClass,
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
 *
 * CC-24 §2 correction: uses `guardedReadUtf8` so authorization is checked
 * BEFORE the filesystem is ever touched -- the prior pattern (read via
 * `readFileSync`, then call `guard.checkRead` on the already-read content)
 * meant the read had already happened by the time authorization was
 * checked, which the guard could never actually have prevented.
 */
export function readBlindAcquisitionTargets(): { manifest: BlindAcquisitionTargetManifest; contentHash: string } {
  const guard = new LocalAccessGuard(
    {
      experimentId: "unit202-preflight-adapter",
      allowedInputs: [{ rule: "FROZEN_BLIND_TARGET_MANIFEST", matchKind: "EXACT_PATH", pathOrGlob: BLIND_TARGETS_RELATIVE_PATH, note: "The one frozen input this adapter is authorised to read." }],
    },
    repoRoot,
  );
  const { content: raw, audit } = guard.guardedReadUtf8(BLIND_TARGETS_RELATIVE_PATH, "translate frozen Unit-202 blind acquisition targets into the generic KnowledgeEvidencePlanningInput contract");
  return { manifest: JSON.parse(raw) as BlindAcquisitionTargetManifest, contentHash: audit.contentHash ?? hashContent(raw) };
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

/**
 * CC-23B §10: every Unit-202 target is PROVISIONAL_NON_REUSABLE. Unit 202
 * is a single regression fixture -- no other real qualification's data
 * flows through this pipeline yet, so nothing here has been genuinely
 * validated as safe for cross-qualification reuse. This is the
 * conservative default the architecture is designed to make safe: the
 * planner scopes every provisional key by `qualificationContextId`
 * ("unit202"), so within-qualification reuse (e.g. the frequency/pole-
 * pairs duplicate below) still works exactly as before, while cross-
 * qualification merging simply cannot happen by construction.
 */
function semanticIdentityFor(ac: string, proposition: string): TechnicalSemanticIdentity {
  return {
    semanticNamespace: AC_SEMANTIC_NAMESPACE[ac] ?? "unclassified",
    semanticKey: SEMANTIC_KEY_OVERRIDE[proposition] ?? defaultSemanticKeyFor(proposition),
    governanceState: "PROVISIONAL_NON_REUSABLE",
  };
}

// ---------------------------------------------------------------------
// CC-23B §1-§3/§13-§15: requirement specification mode. Mechanically
// determined from whether the RAW proposition text literally states an
// equation ("=" or "~=") -- never a guessed/interpreted judgement. This is
// deliberately broad: the overwhelming majority of Unit-202's propositions
// name a required concept/rule/device/procedure WITHOUT stating its
// technical content (e.g. "Current: meaning, quantity symbol, unit name/
// symbol." states that these three things are required, not what they
// ARE), so they are OPEN_TECHNICAL_QUESTION. Only a proposition that
// literally supplies the formula/exact relationship is KNOWN_CLAIM_TO_VERIFY
// (task §14: "the formula is already part of the Project-Architect-
// approved target"). Hand-verified against the real proposition text --
// all 21 members below were read individually to confirm each is a
// genuine stated equation, never a false positive from an incidental "="
// elsewhere in prose (none occur in this manifest).
// ---------------------------------------------------------------------

const KNOWN_CLAIM_PROPOSITIONS = new Set([
  "F = mg.",
  "F = mg where relevant.",
  "W = Fd.",
  "PE = mgh / work-against-gravity equivalence.",
  "P = W/t.",
  "R = rho L/A and appropriate rearrangement/use.",
  "V = IR and rearrangements.",
  "P = VI.",
  "P = I^2 R.",
  "P = V^2/R where appropriate.",
  "Vdrop = IR.",
  "B = Phi/A and appropriate rearrangement/use.",
  "Scalar F = BIl.",
  "e = Blv.",
  "f = N x P (N = rev/s, P = pole pairs).",
  "Equivalent rpm relationship f = n_rpm x P / 60.",
  "T = 1/f.",
  "Vrms ~= 0.707 x Vpeak.",
  "Vpeak ~= 1.414 x Vrms.",
  "Average over one alternation ~= 0.6366 x Vpeak.",
  "Signed average of a complete symmetrical sine-wave cycle = 0.",
]);

function specificationModeFor(proposition: string): RequirementSpecificationMode {
  return KNOWN_CLAIM_PROPOSITIONS.has(proposition) ? "KNOWN_CLAIM_TO_VERIFY" : "OPEN_TECHNICAL_QUESTION";
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
// CC-23A §17-§19 / CC-23B §13: the generic directional/operational-rule
// pattern, applied to Unit 202's three hand-rule targets -- reclassified
// from RELATIONSHIP (which previously required, and never received,
// integration constituents or a foundational-procedure reuse) to
// OPERATIONAL_USE_RULE, a kind the planner already treats as atomic/
// class-A/READY.
//
// CC-23B §13 correction: CC-23A's own adapter (wrongly) supplied the
// finger/current/field/force ANSWER mapping here as `directionalMapping`
// content -- acceptable only as a calibrated regression fixture, but not
// what the scalable pipeline needs: a new module's public qualification
// text names a rule ("explain/use <named rule>") WITHOUT supplying its
// technical mapping, and acquisition must be able to discover it. These
// three targets are therefore now OPEN_TECHNICAL_QUESTION with ONLY the
// raw manifest proposition text (the rule's NAME, nothing more) and
// generic coverage-dimension obligations (`DIRECTIONAL_MAPPING`,
// `ROLE_MAPPING`, `CORRECT_USE_CONDITIONS`) -- never the mapping itself.
// The technical answer belongs solely in the sealed historical benchmark
// and, later, an acquired normalized claim (task §13/§16).
// ---------------------------------------------------------------------

const DIRECTIONAL_RULE_TARGET_IDS = new Set(["ACQ-108", "ACQ-114", "ACQ-117"]);
const DIRECTIONAL_RULE_DIMENSIONS: readonly CoverageDimension[] = ["DIRECTIONAL_MAPPING", "ROLE_MAPPING", "CORRECT_USE_CONDITIONS"];

// ---------------------------------------------------------------------
// PA review of CC-24 pilot-001, requirement 6 ("right-hand grip rule"):
// the live pilot's only genuinely available candidate for a non-safety
// directional physics rule (a physics-department instructional handout)
// is ACADEMIC evidence, not an AUTHORITATIVE_TECHNICAL_REFERENCE -- the
// generic OPERATIONAL_USE_RULE default (GOVERNMENT_OR_REGULATOR /
// PROFESSIONAL_BODY / AUTHORITATIVE_TECHNICAL_REFERENCE / ORIGINAL_
// MANUFACTURER_OR_VENDOR) was calibrated for genuine safety/regulated
// operational procedures and wrongly excludes it. Unit 202's three
// OPERATIONAL_USE_RULE targets (the right-hand grip rule and the two
// Fleming rules) are all non-safety directional physics rules, not
// SAFE_USE procedures -- academic/authoritative-educational material is
// legitimate evidence for their directional/role mapping.
//
// This is a narrow, Unit-202-scoped, POST-PLANNING correction -- never a
// change to the generic DEFAULT_SOURCE_AUTHORITY_POLICY (which stays
// exactly as strict as before for every other qualification, and for any
// future genuinely safety-critical Unit-202 OPERATIONAL_USE_RULE target).
// The generic `SourceAuthorityPolicy` mechanism keys allowed classes by
// `requirementMode` alone (task/CC-23A design), with no per-target or
// per-dimension granularity -- insufficient to express "only THESE three
// targets, identified by their exact dimension set, not just their
// mode." `applyUnit202DirectionalRuleAuthorityPolicyOverride` therefore
// operates on the planner's OUTPUT, widening `sourceAuthorityClasses`
// only on a requirement whose mode is OPERATIONAL_USE_RULE AND whose
// `requiredCoverageDimensions` are EXACTLY the three non-safety
// directional-rule dimensions -- never merely "any Unit-202
// OPERATIONAL_USE_RULE requirement" and never any other mode. A future
// Unit-202 OPERATIONAL_USE_RULE target with a different dimension set
// (e.g. a genuine SAFE_USE procedure) is left on the generic, strict
// default, unaffected by this override.
// ---------------------------------------------------------------------

const DIRECTIONAL_RULE_AUTHORITY_OVERRIDE_DIMENSIONS = new Set<CoverageDimension>(DIRECTIONAL_RULE_DIMENSIONS);

/** The four generic OPERATIONAL_USE_RULE classes, plus the two academic/educational classes this override adds. Both additions are STANDARD_AUTHORITY_CLASSES members already -- no custom-class registration is needed. */
export const UNIT202_DIRECTIONAL_RULE_AUTHORITY_CLASSES: readonly SourceAuthorityClass[] = [
  "GOVERNMENT_OR_REGULATOR",
  "PROFESSIONAL_BODY",
  "AUTHORITATIVE_TECHNICAL_REFERENCE",
  "ORIGINAL_MANUFACTURER_OR_VENDOR",
  "ACADEMIC_OR_RESEARCH_INSTITUTION",
  "AUTHORITATIVE_EDUCATIONAL_REFERENCE",
];

function dimensionSetMatches(dimensions: readonly CoverageDimension[], expected: ReadonlySet<CoverageDimension>): boolean {
  if (dimensions.length !== expected.size) return false;
  return dimensions.every((d) => expected.has(d));
}

/**
 * Applies the narrow Unit-202 directional-rule authority-policy override
 * to an already-planned `KnowledgeEvidencePlanResult`. Never touches
 * `requirementText`, `evidenceQuestion`, `specificationMode`,
 * `classification`, `acquisitionPriority`, or any other field -- only
 * `sourceAuthorityClasses`, and only on requirements matching the exact
 * mode + dimension-set test above.
 */
export function applyUnit202DirectionalRuleAuthorityPolicyOverride(plan: KnowledgeEvidencePlanResult): KnowledgeEvidencePlanResult {
  return {
    ...plan,
    requirements: plan.requirements.map((r) => {
      if (r.requirementMode !== "OPERATIONAL_USE_RULE") return r;
      if (!dimensionSetMatches(r.requiredCoverageDimensions, DIRECTIONAL_RULE_AUTHORITY_OVERRIDE_DIMENSIONS)) return r;
      return { ...r, sourceAuthorityClasses: UNIT202_DIRECTIONAL_RULE_AUTHORITY_CLASSES };
    }),
  };
}

// ---------------------------------------------------------------------
// CC-24 §1 (Narrow Correction A): adapter-adoption of existing generic
// modes the Unit-202 adapter had never actually used. The generic package
// has always supported `APPLICATION_FUNCTION` and `OPERATING_PRINCIPLE`
// (task §2/CC-23 §8) -- these two explicit, auditable ID sets correct the
// six AC6.1 "application category/function" targets and fourteen AC6.2
// "basic operating principle" targets, previously left as the generic
// FACTUAL_PROPOSITION/EXACT_FACT default. This is an adapter mapping
// correction only: no generic planner text-recognition logic, no change
// to qualificationClassification/acquisitionPriority/targetText.
// ---------------------------------------------------------------------

const APPLICATION_FUNCTION_TARGET_IDS = new Set(["ACQ-147", "ACQ-148", "ACQ-149", "ACQ-150", "ACQ-151", "ACQ-152"]);
const OPERATING_PRINCIPLE_TARGET_IDS = new Set([
  "ACQ-170",
  "ACQ-171",
  "ACQ-172",
  "ACQ-173",
  "ACQ-174",
  "ACQ-175",
  "ACQ-176",
  "ACQ-177",
  "ACQ-178",
  "ACQ-179",
  "ACQ-180",
  "ACQ-181",
  "ACQ-182",
  "ACQ-183",
]);

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
    let requiresMultipleIndependentClaims = t.requiresMultipleIndependentClaims;
    const specificationMode = specificationModeFor(t.proposition);
    notes.push(`specificationMode=${specificationMode} (mechanical: raw proposition text ${specificationMode === "KNOWN_CLAIM_TO_VERIFY" ? "literally states an equation" : "does not literally state an equation"}, task §14/§15)`);

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
    } else if (DIRECTIONAL_RULE_TARGET_IDS.has(t.acquisitionTargetId)) {
      // CC-23B §13 correction: directional/operational rule -- atomic, class A, READY,
      // but OPEN_TECHNICAL_QUESTION with ONLY the rule's NAME (raw manifest text) and
      // generic coverage obligations -- never the finger/current/field/force answer.
      kind = "OPERATIONAL_USE_RULE";
      expectedCoverageDimensions = DIRECTIONAL_RULE_DIMENSIONS;
      requiresMultipleIndependentClaims = false; // resolved atomically -- never an unresolved multi-claim target
      notes.push("CC-23B directional-rule pattern -- kind overridden to OPERATIONAL_USE_RULE, generic DIRECTIONAL_MAPPING/ROLE_MAPPING/CORRECT_USE_CONDITIONS dimensions requested, NO answer mapping supplied (task §13)");
    } else if (APPLICATION_FUNCTION_TARGET_IDS.has(t.acquisitionTargetId)) {
      // CC-24 §1 (Correction A): adopt the generic APPLICATION_FUNCTION mode -- already
      // supported by the planner, never previously used by this adapter.
      kind = "APPLICATION_FUNCTION";
      notes.push("CC-24 Correction A -- kind overridden to APPLICATION_FUNCTION (adapter-adoption of an existing generic mode, no planner change)");
    } else if (OPERATING_PRINCIPLE_TARGET_IDS.has(t.acquisitionTargetId)) {
      // CC-24 §1 (Correction A): adopt the generic OPERATING_PRINCIPLE mode -- already
      // supported by the planner, never previously used by this adapter.
      kind = "OPERATING_PRINCIPLE";
      notes.push("CC-24 Correction A -- kind overridden to OPERATING_PRINCIPLE (adapter-adoption of an existing generic mode, no planner change)");
    }

    const constituentIds = INTEGRATION_CONSTITUENTS[t.proposition]?.map(knowledgeTargetIdFor);
    if (constituentIds) notes.push(`integration target -- constituentKnowledgeTargetIds=[${constituentIds.join(", ")}]`);

    const target: KnowledgeTarget = {
      knowledgeTargetId,
      targetText: requirementText,
      kind,
      classification: t.knowledgeClassification,
      semanticIdentity,
      specificationMode,
      ...(expectedCoverageDimensions ? { expectedCoverageDimensions } : {}),
      ...(requiresMultipleIndependentClaims ? { requiresMultipleIndependentClaims: true } : {}),
      ...(constituentIds ? { constituentKnowledgeTargetIds: constituentIds } : {}),
      ...(reusesFoundationalProcedureIds ? { reusesFoundationalProcedureIds } : {}),
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
