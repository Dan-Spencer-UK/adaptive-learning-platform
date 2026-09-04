/**
 * CC-24 §4: the fixed 15-`evidenceRequirementId` pilot sample, and the
 * validator that freezes it. Selection is BY ID, from the clean plan
 * (clean-plan.ts) only -- never by re-deriving IDs from any other source,
 * and never by reading historical/benchmark data to decide "interesting"
 * rows to pick.
 */
import type { EvidenceRequirement, KnowledgeEvidencePlanResult, RequirementMode } from "@alp/technical-evidence-engine";

export const SELECTED_EVIDENCE_REQUIREMENT_IDS: readonly string[] = [
  "ER::provisional::unit202::foundational-mathematics::fractions::TOPIC_BREADTH_COVERAGE",
  "ER::provisional::unit202::foundational-mathematics::formula-transposition::PROCEDURE_COVERAGE",
  "ER::provisional::unit202::electrical-quantities-and-circuit-theory::temperature-correct-si-unit-and-unit-symbol::EXACT_FACT",
  "ER::provisional::unit202::electrical-fundamentals-and-safety::v-ir-and-rearrangements::FORMULA_OR_RULE",
  "ER::provisional::unit202::mechanics-and-machines::weight-force-relationship::RELATIONSHIP",
  "ER::provisional::unit202::electromagnetism-and-induction::right-hand-grip-rule::OPERATIONAL_USE_RULE",
  "ER::provisional::unit202::electromagnetism-and-induction::fleming-left-hand-rule::OPERATIONAL_USE_RULE",
  "ER::provisional::unit202::electromagnetism-and-induction::fleming-right-hand-generator-rule::OPERATIONAL_USE_RULE",
  "ER::provisional::unit202::electromagnetism-and-induction::rotational-frequency-pole-pairs-relationship::FORMULA_OR_RULE",
  "ER::provisional::unit202::electromagnetism-and-induction::vrms-0-707-x-vpeak::RELATIONSHIP",
  "ER::provisional::unit202::electronic-devices-and-applications::capacitor-basic-operating-principle::OPERATING_PRINCIPLE",
  "ER::provisional::unit202::electronic-devices-and-applications::triac-basic-operating-principle::OPERATING_PRINCIPLE",
  "ER::provisional::unit202::electronic-devices-and-applications::wireless-control-systems-application-category-function::APPLICATION_FUNCTION",
  "ER::provisional::unit202::electrical-quantities-and-circuit-theory::wattmeter-measures-electrical-power-appropriate-current-voltage-sensing-arrangement-at-qualification-depth::EXACT_FACT",
  "ER::provisional::unit202::electronic-devices-and-applications::telephone-capacitor-ringer::EXACT_FACT",
];

/** `evidenceRequirementId -> expected requirementMode`, parsed once from the frozen ID list itself (the mode is the final `::`-delimited segment of every ID here) -- never hand-duplicated separately from the IDs above. */
function expectedModeFromId(id: string): RequirementMode {
  const segments = id.split("::");
  return segments[segments.length - 1] as RequirementMode;
}

export interface PilotSelectionFailure {
  readonly reason: string;
}

export interface PilotSelectionSuccess {
  readonly requirements: readonly EvidenceRequirement[];
}

export type PilotSelectionOutcome = { readonly ok: true; readonly requirements: readonly EvidenceRequirement[] } | { readonly ok: false; readonly failures: readonly PilotSelectionFailure[] };

const FORBIDDEN_DIRECTIONAL_ANSWER_TERMS = ["thumb", "finger", "curl", "curled"];

/**
 * Task §4's exact failure conditions -- fails preparation (never silently
 * substitutes, drops, or re-selects a different row) if:
 *   - any ID is absent from the plan;
 *   - any ID occurs more than once in the plan (a genuine dedup defect);
 *   - any resolved requirement's mode differs from the mode encoded in its
 *     own ID;
 *   - any selected requirement is not READY or not REQUIRED;
 *   - either directional-rule requirement contains a technical answer.
 */
export function selectPilotSample(plan: KnowledgeEvidencePlanResult): PilotSelectionOutcome {
  const failures: PilotSelectionFailure[] = [];
  const byId = new Map<string, EvidenceRequirement[]>();
  for (const r of plan.requirements) {
    const list = byId.get(r.evidenceRequirementId) ?? [];
    list.push(r);
    byId.set(r.evidenceRequirementId, list);
  }

  const selected: EvidenceRequirement[] = [];
  for (const id of SELECTED_EVIDENCE_REQUIREMENT_IDS) {
    const matches = byId.get(id);
    if (!matches || matches.length === 0) {
      failures.push({ reason: `Selected evidenceRequirementId is absent from the clean plan: "${id}"` });
      continue;
    }
    if (matches.length > 1) {
      failures.push({ reason: `Selected evidenceRequirementId occurs more than once in the clean plan (${matches.length} occurrences): "${id}"` });
      continue;
    }
    const requirement = matches[0]!;
    const expectedMode = expectedModeFromId(id);
    if (requirement.requirementMode !== expectedMode) {
      failures.push({ reason: `"${id}" resolved to requirementMode "${requirement.requirementMode}", expected "${expectedMode}"` });
      continue;
    }
    if (requirement.decompositionStatus !== "READY") {
      failures.push({ reason: `"${id}" is not READY (decompositionStatus: ${requirement.decompositionStatus})` });
      continue;
    }
    if (requirement.acquisitionPriority !== "REQUIRED") {
      failures.push({ reason: `"${id}" is not REQUIRED (acquisitionPriority: ${requirement.acquisitionPriority})` });
      continue;
    }
    if (requirement.requirementMode === "OPERATIONAL_USE_RULE") {
      const haystack = `${requirement.requirementText} ${requirement.evidenceQuestion ?? ""}`.toLowerCase();
      for (const term of FORBIDDEN_DIRECTIONAL_ANSWER_TERMS) {
        if (haystack.includes(term)) {
          failures.push({ reason: `"${id}" (a directional-rule requirement) leaks a technical answer term "${term}"` });
          break;
        }
      }
    }
    selected.push(requirement);
  }

  if (failures.length > 0) return { ok: false, failures };
  return { ok: true, requirements: selected };
}
