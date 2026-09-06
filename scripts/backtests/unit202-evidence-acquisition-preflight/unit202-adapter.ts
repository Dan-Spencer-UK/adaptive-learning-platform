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
  type KnowledgeEvidencePlanningInput,
  type KnowledgeTarget,
  type KnowledgeTargetKind,
  type RequirementSpecificationMode,
  type SourceAuthorityClass,
  type SourceAuthorityPolicy,
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
  /**
   * [Correction, Stage 4 item 12]: "appropriate simple AC-generation
   * calculations" is an integration/performance target satisfied by its
   * own already-verified constituent frequency/pole-pairs formulae plus
   * the already-approved foundational formula-transposition procedure --
   * never a demand for one omnibus worked-example source stating the
   * whole chain at once.
   */
  "Appropriate simple AC-generation calculations.": ["ACQ-131", "ACQ-132", "ACQ-133", "ACQ-004"],
  /**
   * [Correction, Stage 4 item 10]: "appropriate sine-wave conversions/
   * calculations" is structurally supported by the already-verified
   * individual conversion relationships plus the same foundational
   * calculation capability -- a separate published worked example for
   * every algebraic direction is not required evidence.
   */
  "Appropriate sine-wave conversions/calculations.": ["ACQ-141", "ACQ-142", "ACQ-143", "ACQ-144", "ACQ-145", "ACQ-004"],
};

/**
 * [Correction, Stage 4 items 10/12]: the frozen manifest never set
 * `requiresMultipleIndependentClaims` for these two AC5 procedure targets
 * (they predate this correction), so it is forced true here -- mirroring
 * the existing `DIRECTIONAL_RULE_TARGET_IDS` override pattern below -- so
 * the generic planner's integration-satisfaction mechanism (§8.E, now
 * extended to PROCEDURE) actually applies to them.
 */
const PROCEDURE_INTEGRATION_TARGET_IDS = new Set(["ACQ-134", "ACQ-146"]);

/**
 * [Correction, Stage 1.3 underspecified-exemplar detection]: these three
 * Batch 06 targets each ask for an EXACT, named circuit/component-value
 * object ("Dimmer: exact RC timing implementation/component values.",
 * "Heating: exact transistor/relay topology.", "Security alarm: exact
 * NC/contact/bias topology.") that no governed reference in the frozen
 * manifest determinately identifies. Marking them here (never editing the
 * frozen/sealed manifest itself) lets the generic planner's
 * `exemplarObjectIdentity` mechanism refuse READY status for the exact-
 * object claim structurally: a row being researched does not by itself
 * prove the researched object is the right canonical exemplar. This
 * matches the batch-06 acquisition's own finding that no determinate
 * source names these exact objects (see EDA-LP-19/21/25 in the batch-06
 * learning-point inventory).
 */
const UNDERSPECIFIED_EXEMPLAR_TARGET_IDS = new Set(["ACQ-155", "ACQ-164", "ACQ-166"]);

/**
 * [Correction, Stage 1.3/5 item 3]: the frozen manifest also flags three
 * OTHER targets `isRepresentativeExemplar: true`
 * ("Security alarm: SCR/thyristor latching + sounder role.", "Telephone:
 * capacitor -> ringer.", "Motor: bridge rectifier converts AC to DC.") --
 * each names a general ROLE/BEHAVIOUR (not an exact, otherwise-
 * unidentifiable circuit/component-value object) that acquisition
 * genuinely resolved against a determinate, governed source (e.g. AT&T
 * Bell System Practices Section 502-200-100 for the telephone capacitor's
 * exact value and role). These are therefore
 * `exemplarObjectIdentity: "GOVERNED_REFERENCE_RESOLVED"`, distinct from
 * the three genuinely underspecified exemplars above (Stage 5 item 3:
 * "retain the transferable roles ... where technically evidenced ...
 * treat the actual circuit as a representative exemplar to be authored
 * and validated downstream" -- the ROLE is resolved even where the exact
 * downstream circuit is not).
 */
const RESOLVED_EXEMPLAR_TARGET_IDS = new Set(["ACQ-153", "ACQ-156", "ACQ-168"]);

/**
 * [Correction, Stage 1.2]: explicit coverage-dimension declarations for
 * every `PROCEDURE_OR_CALCULATION_RULE` / `SYMBOL_OR_CONVENTION` target in
 * Unit 202, replacing reliance on the generic planner's now-corrected
 * defaults (`PROCEDURE` no longer silently assumes `CALCULATION_METHOD`;
 * `SYMBOL_OR_CONVENTION` and `OPERATIONAL_USE_RULE` no longer have any
 * default dimension at all -- see planner.ts's `AMBIGUOUS_DEFAULT_DIMENSION_KINDS`).
 * Every one of Unit 202's 20 such targets is listed explicitly and
 * hand-verified against its real proposition text -- never inferred.
 *
 * Frozen-batch targets (Batches 01-03: AC1.1, AC3.1/AC3.4, AC4.3/AC4.6/
 * AC4.7) are pinned to EXACTLY the dimension set the prior, now-corrected
 * default produced, so regenerating the frozen plan from this adapter
 * reproduces those batches byte-identically -- this pass never edits
 * frozen Batch 01-03 artifacts. Only unfrozen Batch 04-06 targets receive
 * a genuine correction (see the inline notes below).
 */
const EXPLICIT_PROCEDURE_OR_SYMBOL_DIMENSIONS: Record<string, readonly CoverageDimension[]> = {
  // --- Batch 01 (frozen) -- genuine calculation procedures; pinned to the prior default. ---
  "ACQ-004": ["PROCEDURE", "CALCULATION_METHOD"], // Formula transposition.
  "ACQ-007": ["QUANTITY_SYMBOL"], // Standard/scientific notation. (pinned -- Batch 01's own PA authority-class adjudication corrected this requirement's permitted AUTHORITY, not its coverage dimension)
  "ACQ-008": ["QUANTITY_SYMBOL"], // Engineering notation. (pinned)
  "ACQ-010": ["PROCEDURE", "CALCULATION_METHOD"], // Sine/cosine/tangent use in right triangles.
  "ACQ-015": ["PROCEDURE", "CALCULATION_METHOD"], // Ordinary decimal arithmetic.
  "ACQ-016": ["PROCEDURE", "CALCULATION_METHOD"], // Proportional reasoning required to execute the above calculations.
  // --- Batch 02 (frozen) -- genuine calculation procedures / pinned symbol dimensions. ---
  "ACQ-081": ["QUANTITY_SYMBOL"], // Rho (resistivity symbol). -- genuinely a quantity symbol; pinned value happens to already be correct.
  "ACQ-082": ["QUANTITY_SYMBOL"], // Ohm-metre (resistivity unit). -- pinned to the prior default; a unit is arguably UNIT_SYMBOL, but Batch 02 is frozen and this pass never edits frozen Batch 01-03 artifacts, so the pre-correction value is preserved exactly rather than "fixed".
  "ACQ-095": ["PROCEDURE", "CALCULATION_METHOD"], // Suitable DC-circuit-power calculations.
  "ACQ-098": ["PROCEDURE", "CALCULATION_METHOD"], // Appropriate voltage-drop calculation.
  // --- Batch 03 (frozen) -- genuine calculation procedures. ---
  "ACQ-048": ["PROCEDURE", "CALCULATION_METHOD"], // Appropriate mass/weight calculations.
  "ACQ-073": ["PROCEDURE", "CALCULATION_METHOD"], // Legitimate multistep mechanical calculations.
  // --- Batch 04 (unfrozen) -- genuine calculation, and a genuine correction. ---
  "ACQ-025": ["PROCEDURE", "CALCULATION_METHOD"], // Practical unit conversion needed elsewhere in Unit 202. -- genuine calculation.
  "ACQ-040": ["SAFE_USE"], // Ohmmeter: circuit de-energised/safe-use principle. [Correction, Stage 3 item 7]: a safety/use principle, never a calculation -- the prior default's CALCULATION_METHOD dimension created exactly the false gap the batch-04 internal audit found ("the ohmmeter safe-use requirement had CALCULATION_METHOD marked satisfied although its evidence contains no calculation").
  // --- Batch 05 (unfrozen) -- genuine calculation, and a genuine correction. ---
  "ACQ-118": ["PROCEDURE", "CALCULATION_METHOD"], // Suitable simple electromagnetism calculations/rearrangements. -- genuine calculation.
  "ACQ-121": ["SCHEMATIC_SYMBOL"], // Dot/cross page convention. [Correction, Stage 1.2/2.3]: a page-direction/schematic convention, never a quantity symbol -- the prior default's QUANTITY_SYMBOL dimension held this to an acceptance bar it was never trying to meet (this is exactly the "dot-cross-page-convention" requirement previously recorded as a GAP in the review pack).
  // --- Batch 06 (unfrozen) -- genuine calculation, and a genuine correction. ---
  "ACQ-184": ["SCHEMATIC_SYMBOL"], // Schematic-symbol recognition for each named AC6.2 component/device family. [Correction, Stage 1.2/2.3]: schematic symbols, never quantity symbols -- see the IEC 60617 authority correction for this same requirement.
  "ACQ-185": ["PROCEDURE", "CALCULATION_METHOD"], // 4-band resistor colour code. -- decoding bands into a resistance value is genuinely a calculation-like procedure.
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
// PA review of CC-24 pilot-001, requirement 6 ("right-hand grip rule"),
// and the PA's follow-up correction: the live pilot's only genuinely
// available candidate for a non-safety directional physics rule (a
// physics-department instructional handout) is ACADEMIC evidence, not
// an AUTHORITATIVE_TECHNICAL_REFERENCE -- the generic OPERATIONAL_USE_RULE
// default (GOVERNMENT_OR_REGULATOR / PROFESSIONAL_BODY /
// AUTHORITATIVE_TECHNICAL_REFERENCE / ORIGINAL_MANUFACTURER_OR_VENDOR)
// was calibrated for genuine safety/regulated operational procedures and
// wrongly excludes it. Unit 202's three OPERATIONAL_USE_RULE targets (the
// right-hand grip rule and the two Fleming rules) are all non-safety
// directional physics rules, not SAFE_USE procedures -- academic/
// authoritative-educational material is legitimate evidence for their
// directional/role mapping.
//
// [Corrected] An earlier version of this policy was applied as a POST-
// PLANNING patch (`applyUnit202DirectionalRuleAuthorityPolicyOverride`)
// invoked only by the pilot's own `clean-plan.ts`. That was PILOT-PATH
// adoption, not canonical Unit-202 adoption: any OTHER caller of
// `buildUnit202PlanningInput` (e.g. `build-preflight.ts`, and its own
// tests) that called `planEvidenceRequirements` directly still received
// the unpatched, generic default policy. The override function is
// REMOVED. The corrected, canonical mechanism supplies an explicit
// `UNIT202_SOURCE_AUTHORITY_POLICY` directly in
// `buildUnit202PlanningInput().input.sourceAuthorityPolicy` -- every
// caller of the adapter now receives the identical policy from the
// planner's OWN normal input, with no post-processing step to remember
// to apply.
//
// The generic `SourceAuthorityPolicy` mechanism keys allowed classes by
// `requirementMode` alone (task/CC-23A design), with no per-target or
// per-dimension granularity. Widening the whole `OPERATIONAL_USE_RULE`
// mode entry is therefore only safe BECAUSE Unit 202 currently has
// EXACTLY three OPERATIONAL_USE_RULE targets and all three carry EXACTLY
// the same non-safety directional dimension set -- `assertUnit202
// DirectionalRuleInvariant` below is a FAIL-CLOSED check of that exact
// premise, thrown from `buildUnit202PlanningInput` itself. If a future
// Unit-202 correction ever adds a differently-dimensioned
// OPERATIONAL_USE_RULE target (e.g. a genuine SAFE_USE procedure) or
// changes the target count, planning FAILS LOUDLY and requires an
// explicit policy decision, rather than that new target silently
// inheriting the widened academic-evidence allowance it was never
// reviewed against.
// ---------------------------------------------------------------------

/** The four generic OPERATIONAL_USE_RULE classes, plus the two academic/educational classes Unit 202's canonical policy adds. Both additions are STANDARD_AUTHORITY_CLASSES members already -- no custom-class registration is needed. */
export const UNIT202_DIRECTIONAL_RULE_AUTHORITY_CLASSES: readonly SourceAuthorityClass[] = [
  ...DEFAULT_SOURCE_AUTHORITY_POLICY.allowedAuthorityClassesByMode.OPERATIONAL_USE_RULE!,
  "ACADEMIC_OR_RESEARCH_INSTITUTION",
  "AUTHORITATIVE_EDUCATIONAL_REFERENCE",
];

/**
 * The canonical Unit-202 `SourceAuthorityPolicy`: every generic default
 * mode entry, UNCHANGED, except `OPERATIONAL_USE_RULE`, which is widened
 * to `UNIT202_DIRECTIONAL_RULE_AUTHORITY_CLASSES`. `DEFAULT_SOURCE_
 * AUTHORITY_POLICY` itself is never mutated -- this is a NEW object that
 * spreads its modes and overrides exactly one.
 */
export const UNIT202_SOURCE_AUTHORITY_POLICY: SourceAuthorityPolicy = {
  allowedAuthorityClassesByMode: {
    ...DEFAULT_SOURCE_AUTHORITY_POLICY.allowedAuthorityClassesByMode,
    OPERATIONAL_USE_RULE: UNIT202_DIRECTIONAL_RULE_AUTHORITY_CLASSES,
  },
};

function dimensionSetMatches(dimensions: readonly CoverageDimension[], expected: ReadonlySet<CoverageDimension>): boolean {
  if (dimensions.length !== expected.size) return false;
  return dimensions.every((d) => expected.has(d));
}

/**
 * Fail-closed invariant, called from `buildUnit202PlanningInput` before
 * it returns: throws unless Unit 202 has EXACTLY three
 * `OPERATIONAL_USE_RULE`-kind knowledge targets and every one of them
 * carries EXACTLY the non-safety directional dimension set
 * (`DIRECTIONAL_MAPPING`/`ROLE_MAPPING`/`CORRECT_USE_CONDITIONS`) --
 * the sole premise `UNIT202_SOURCE_AUTHORITY_POLICY`'s mode-level
 * widening relies on. A future target that breaks either half of this
 * premise (a different count, or a different/additional dimension set)
 * must never silently inherit the widened academic-evidence allowance.
 */
export function assertUnit202DirectionalRuleInvariant(targets: readonly KnowledgeTarget[]): void {
  const expectedDimensions = new Set<CoverageDimension>(DIRECTIONAL_RULE_DIMENSIONS);
  const operationalUseRuleTargets = targets.filter((t) => t.kind === "OPERATIONAL_USE_RULE");
  if (operationalUseRuleTargets.length !== 3) {
    throw new Error(
      `assertUnit202DirectionalRuleInvariant: Unit 202 is expected to have EXACTLY 3 OPERATIONAL_USE_RULE knowledge targets (the widened UNIT202_SOURCE_AUTHORITY_POLICY relies on this), found ${operationalUseRuleTargets.length}. Planning is refused -- this requires an explicit Project-Architect policy decision, not a silent inheritance of the widened academic-evidence allowance.`,
    );
  }
  for (const t of operationalUseRuleTargets) {
    const dims = t.expectedCoverageDimensions ?? [];
    if (!dimensionSetMatches(dims, expectedDimensions)) {
      throw new Error(
        `assertUnit202DirectionalRuleInvariant: OPERATIONAL_USE_RULE target "${t.knowledgeTargetId}" has requiredCoverageDimensions [${dims.join(", ")}], expected EXACTLY [${DIRECTIONAL_RULE_DIMENSIONS.join(", ")}]. Planning is refused -- a differently-dimensioned operational-use-rule target (e.g. a genuine SAFE_USE procedure) must never silently inherit the widened academic-evidence allowance calibrated for non-safety directional physics rules.`,
      );
    }
  }
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

    const explicitProcedureOrSymbolDimensions = EXPLICIT_PROCEDURE_OR_SYMBOL_DIMENSIONS[t.acquisitionTargetId];
    if (explicitProcedureOrSymbolDimensions) {
      expectedCoverageDimensions = explicitProcedureOrSymbolDimensions;
      notes.push(`[Correction 1.2] explicit expectedCoverageDimensions=[${explicitProcedureOrSymbolDimensions.join(", ")}] -- the generic planner no longer supplies a default dimension for this kind`);
    }

    if (PROCEDURE_INTEGRATION_TARGET_IDS.has(t.acquisitionTargetId)) {
      requiresMultipleIndependentClaims = true;
      notes.push("[Correction 4.10/4.12] forced requiresMultipleIndependentClaims=true -- integration target satisfied by already-verified constituent formulae/relationships, never a demand for one omnibus source");
    }

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

    const isUnderspecifiedExemplar = UNDERSPECIFIED_EXEMPLAR_TARGET_IDS.has(t.acquisitionTargetId);
    if (isUnderspecifiedExemplar) {
      notes.push("[Correction 1.3] marked isRepresentativeExemplar=true, exemplarObjectIdentity=UNDETERMINED -- this target names an exact circuit/component-value object no governed reference in the frozen manifest determinately identifies; the planner refuses READY status for it structurally");
    }
    const isResolvedExemplar = RESOLVED_EXEMPLAR_TARGET_IDS.has(t.acquisitionTargetId);
    if (isResolvedExemplar) {
      notes.push("[Correction 1.3] marked exemplarObjectIdentity=GOVERNED_REFERENCE_RESOLVED -- this exemplar's role/behaviour is genuinely resolved by a determinate, governed source, distinct from the underspecified exact-object exemplars above");
    }

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
      isRepresentativeExemplar: t.isRepresentativeExemplar || isUnderspecifiedExemplar,
      ...(isUnderspecifiedExemplar ? { exemplarObjectIdentity: "UNDETERMINED" as const } : {}),
      ...(isResolvedExemplar ? { exemplarObjectIdentity: "GOVERNED_REFERENCE_RESOLVED" as const } : {}),
    };

    audit.push({ knowledgeTargetId, acquisitionTargetId: t.acquisitionTargetId, ac: t.ac, rawProposition: t.proposition, normalizedTargetText: requirementText, adapterDecisionNotes: notes });
    return target;
  });

  assertUnit202DirectionalRuleInvariant(targets);

  return {
    input: {
      qualificationContext: { qualificationContextId: "unit202", description: manifest.purpose },
      knowledgeTargets: targets,
      sourceAuthorityPolicy: UNIT202_SOURCE_AUTHORITY_POLICY,
    },
    audit,
    blindTargetsContentHash: contentHash,
  };
}
