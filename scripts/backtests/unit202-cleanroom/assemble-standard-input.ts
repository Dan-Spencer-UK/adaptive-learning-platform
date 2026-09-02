/**
 * CC-19R1 section 6: a zero-semantics assembly check proving the frozen
 * Layer-B records can become a valid `StandardPipelineInput` for
 * packages/qualification-pipeline WITHOUT any semantic transformation.
 *
 * This module:
 *   - consumes the frozen typed Layer-B records from the ledger;
 *   - groups them into the corresponding StandardPipelineInput
 *     arrays/fields;
 *   - filters by profile (FULL_PUBLIC vs DEGRADED_NO_ASSESSMENT);
 *   - performs NO semantic transformation, NO subject rewriting, NO
 *     candidate generation, NO mapping inference, NO fact-key rewriting.
 *
 * It is a ONE-TO-ONE assembly operation only: every record present in the
 * relevant ledger entries appears in the output, unchanged, in the same
 * shape it was frozen in. It does NOT call `buildStandardPipeline` --
 * that remains for a later, separately authorised CC-19B package.
 */
import type { AssessmentEvidence, CandidateFactRequirement, CurriculumEvidence, OfficialCurriculumUnit, QualificationLevelEvidence, SourceFactualClaim } from "@alp/qualification-pipeline";
import type { StandardPipelineInput } from "@alp/qualification-pipeline";

import { ledger, QUALIFICATION_ID, type LedgerEntry } from "./build-ledger.ts";

export type Profile = "FULL_PUBLIC" | "DEGRADED_NO_ASSESSMENT";

/** proposalId -> originating ledger entry, for the one-to-one traceability proof (CC-19R1 section 6/23.E). */
export interface AssembledWithProvenance {
  readonly input: StandardPipelineInput;
  /** Maps every assembled record's identity (evidenceId, or targetCandidateKey::claimKey for fact requirements) back to the ledger proposalId it came from, unchanged. */
  readonly provenance: ReadonlyMap<string, string>;
}

function recordIdentity(entry: LedgerEntry): string {
  const rec = entry.layerB.normalizedRecord;
  switch (entry.layerB.genericPipelineRecordType) {
    case "CurriculumEvidence":
    case "QualificationLevelEvidence":
    case "SourceFactualClaim":
      return (rec as { evidenceId: string }).evidenceId;
    case "OfficialCurriculumUnit": {
      const u = rec as OfficialCurriculumUnit;
      return `${u.qualificationId}::${u.curriculumUnitId}`;
    }
    case "CandidateFactRequirement": {
      const f = rec as CandidateFactRequirement;
      return `${f.targetCandidateKey}::${f.claimKey}::${f.derivationStatus}`;
    }
  }
}

/**
 * Assemble a StandardPipelineInput for the given profile, purely by
 * grouping already-frozen Layer-B records into the shape
 * StandardPipelineInput expects. No field is recomputed, reinterpreted,
 * or filtered on any basis OTHER than `profileEligibility` (and, for
 * assessment, the profile's own definition -- DEGRADED_NO_ASSESSMENT
 * mechanically excludes AssessmentEvidence/EXPLICIT_ASSESSMENT_FACT/
 * EXPLICIT_ASSESSMENT_OPERATION per CC-19R section 26, though in this
 * run there is none to exclude -- see cc19r-source-inventory.json
 * profileImpact).
 */
export function assembleStandardInput(profile: Profile): AssembledWithProvenance {
  const provenance = new Map<string, string>();
  const eligible = (e: LedgerEntry) => e.layerB.profileEligibility.includes(profile);

  const curriculum: CurriculumEvidence[] = [];
  const officialCurriculumUnits: OfficialCurriculumUnit[] = [];
  const qualificationLevel: QualificationLevelEvidence[] = [];
  const factRequirements: CandidateFactRequirement[] = [];
  const factualClaims: SourceFactualClaim[] = [];
  const assessment: AssessmentEvidence[] = []; // always empty this run -- see cc19r-source-inventory.json

  for (const entry of ledger) {
    if (!eligible(entry)) continue;
    const rec = entry.layerB.normalizedRecord;
    const identity = recordIdentity(entry);

    switch (entry.layerB.genericPipelineRecordType) {
      case "CurriculumEvidence":
        curriculum.push(rec as CurriculumEvidence);
        provenance.set(identity, entry.proposalId);
        break;
      case "OfficialCurriculumUnit":
        officialCurriculumUnits.push(rec as OfficialCurriculumUnit);
        provenance.set(identity, entry.proposalId);
        break;
      case "QualificationLevelEvidence":
        qualificationLevel.push(rec as QualificationLevelEvidence);
        provenance.set(identity, entry.proposalId);
        break;
      case "CandidateFactRequirement": {
        const f = rec as CandidateFactRequirement;
        if (profile === "DEGRADED_NO_ASSESSMENT" && f.derivationStatus === "EXPLICIT_ASSESSMENT_FACT") break; // mechanical profile filter, not semantic rewriting
        factRequirements.push(f);
        provenance.set(identity, entry.proposalId);
        break;
      }
      case "SourceFactualClaim":
        factualClaims.push(rec as SourceFactualClaim);
        provenance.set(identity, entry.proposalId);
        break;
    }
  }

  const input: StandardPipelineInput = {
    qualificationId: QUALIFICATION_ID,
    officialCurriculumUnits,
    curriculum,
    assessment,
    qualificationLevel,
    factRequirements,
    factualClaims,
  };

  return { input, provenance };
}
