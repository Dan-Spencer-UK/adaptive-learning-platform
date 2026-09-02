# CC-19A Unit 202 Normalization Ledger

Blind normalization of Unit 202's official public curriculum wording (City & Guilds 2365-02 Qualification Handbook v1.12, pages 15/25-30). No Unit 202 governed matrix, obligation, assertion, lesson, or private calibration material was consulted -- see CC-19A-SOURCE-INVENTORY.md. `pipelineAcceptance` is `NOT_RUN_CC19A` on every proposal; `buildStandardPipeline` was never called against this ledger.

## Coverage accounting

```json
{
  "officialCurriculum": {
    "learningOutcomesSeen": 6,
    "assessmentCriteriaSeen": 23,
    "normalizedRangeAndLetteredSubItems": 73,
    "primaryRequirementRecords": 27,
    "loWithNoRangeSection": [
      "LO4 (AC4.1-AC4.8) -- confirmed structural absence, not an omission"
    ]
  },
  "publicAssessment": {
    "sourcesSeen": 1,
    "totalAnswerKeyRowsSeen": 40,
    "itemsNormalizedAsAssessmentEvidence": 0,
    "itemsReviewProposed": 0,
    "itemsUnmapped": 0,
    "note": "Answer-key letters were seen (40 rows, matching the handbook's own 2/5/7/15/7/4 LO allocation) but carry no question-stem/answer-option text, so zero AssessmentEvidence proposals could be normalized. See RAW_SOURCE_UNAVAILABLE record."
  },
  "proposalsByRecordType": {
    "OfficialCurriculumUnit": 23,
    "CurriculumEvidence": 100,
    "PrerequisiteEvidence": 3,
    "CandidateCapabilityRequirement": 3,
    "CandidateFactRequirement": 21,
    "SourceFactualClaim": 17
  },
  "proposalsByEvidenceRole": {
    "OFFICIAL_CURRICULUM": 150,
    "TECHNICAL_TRUTH": 17
  },
  "normalizationConfidenceDistribution": {
    "EXPLICIT": 101,
    "STRONG_INFERENCE": 58,
    "REVIEW_PROPOSED": 8
  },
  "factRequirements": {
    "total": 21,
    "withAttachedTechnicalClaim": 17,
    "unattachedClaimKeys": [
      "resistivity-si-unit",
      "impedance-si-unit",
      "inductive-reactance-si-unit",
      "capacitive-reactance-si-unit"
    ]
  },
  "reviewProposed": {
    "count": 8,
    "proposalIds": [
      "CE-197-U202-LO6-AC2-RANGE-electronic-component--diodes--zener-STATE",
      "CE-199-U202-LO6-AC2-RANGE-electronic-component--diodes--photo-STATE",
      "PREREQ-1-algebraic-transposition-for-current-voltage-resistance-calculation-series-parallel-dc",
      "PREREQ-2-algebraic-transposition-for-power-calculation-series-parallel-dc",
      "PREREQ-3-algebraic-transposition-for-mechanical-energy-power-and-efficiency-calculation",
      "CAPREQ-1-algebraic-transposition-for-current-voltage-resistance-calculation-series-parallel-dc",
      "CAPREQ-2-algebraic-transposition-for-power-calculation-series-parallel-dc",
      "CAPREQ-3-algebraic-transposition-for-mechanical-energy-power-and-efficiency-calculation"
    ]
  },
  "unavailability": [
    {
      "kind": "RAW_SOURCE_UNAVAILABLE",
      "evidenceClass": "PUBLIC_ASSESSMENT item-level content (question stem + answer options) for 2365-602 Principles of Electrical Science",
      "attemptedSources": [
        "src-cg-602-sample-mark-schemes-v1-0 (fetched -- confirmed answer-key-only, no stems)",
        "thirdparty-cg-602-questions-companion-404 (fetched -- confirmed 404 on cityandguilds.com's own site)",
        "web search for an official companion 'sample paper' / 'specimen paper' with question text -- returned only third-party/unofficial hits (see EXCLUDED_NOT_RELEVANT entries above), none official"
      ],
      "explanation": "City & Guilds publicly releases only the bare per-question letter answer key for the 2365-602 e-volve test, never the question stems or answer options themselves (these are delivered only through the secure, centre/candidate-authenticated e-volve/Walled Garden testing platform, which CC-19A has no access to and would not be permitted to use even if it did, per task section 2.A/3.2's 'positive target evidence... publicly available' requirement). Per task section 4, this evidence class is reported RAW_SOURCE_UNAVAILABLE rather than substituted from any derived source. Zero AssessmentEvidence proposals are produced in this package."
    }
  ],
  "sourceInventory": {
    "totalCandidateSources": 24,
    "includedCount": 3,
    "includedSourceIds": [
      "src-cg-2365-02-handbook-v1-12",
      "src-cg-602-sample-mark-schemes-v1-0",
      "src-bipm-si-brochure-9th-edition"
    ],
    "excludedByCategory": {
      "EXCLUDED_DERIVED": 11,
      "EXCLUDED_LEGACY": 2,
      "EXCLUDED_NOT_RELEVANT": 8
    }
  },
  "totalProposalCount": 167
}
```

## Profile eligibility

- PROFILE A (FULL_PUBLIC): 167 proposals
- PROFILE B (DEGRADED_NO_ASSESSMENT): 167 proposals

PROFILE B is produced by mechanically filtering PROFILE A (see `cc19a-profile-filter.ts`), never hand-authored. In this package the two counts are equal: zero AssessmentEvidence proposals exist (PUBLIC_ASSESSMENT item content is RAW_SOURCE_UNAVAILABLE), so nothing in the ledger depends solely on PUBLIC_ASSESSMENT authority.

## Normalization proposals, grouped by Learning Outcome -> Assessment Criterion -> Range -> proposal

### LO1.AC1

#### OCU-U202-LO1-AC1

**SOURCE:**
src-cg-2365-02-handbook-v1-12 -- page 25, Unit 202, Learning outcome 1, Assessment criteria 1

**RAW:**
> Learning outcome: The learner will: 1. Understand mathematical principles which are appropriate to electrical installation, maintenance and design work. Assessment criteria: The learner can: 1. identify and apply appropriate mathematical principles which are relevant to electrical work tasks

**PROPOSAL:**
OfficialCurriculumUnit -- `{"curriculumUnitId":"U202-LO1-AC1","officialWording":"identify and apply appropriate mathematical principles which are relevant to electrical work tasks"}`

**CONFIDENCE:**
EXPLICIT

**RATIONALE:**
Registry entry transcribed verbatim from the handbook's own Learning outcome / Assessment criteria table for Unit 202, page 25. curriculumUnitId is a CC-19A-assigned mapping key (U202-LO1-AC1), not itself official wording.

---

#### CE-001-U202-LO1-AC1-PRIMARY-IDENTIFY

**SOURCE:**
src-cg-2365-02-handbook-v1-12 -- page 25, Unit 202, AC1.1

**RAW:**
> The learner can: 1. identify and apply appropriate mathematical principles which are relevant to electrical work tasks

**PROPOSAL:**
CurriculumEvidence / PRIMARY_REQUIREMENT -- `{"subject":"mathematical-principles-relevant-to-electrical-work","curriculumUnitId":"U202-LO1-AC1","commandVerbPerformanceType":"IDENTIFY"}`

**CONFIDENCE:**
EXPLICIT

**RATIONALE:**
AC1.1 literally reads "identify and apply appropriate mathematical principles..." -- IDENTIFY is one of the two explicit verbs.

---

#### CE-003-U202-LO1-AC1-PRIMARY-APPLY

**SOURCE:**
src-cg-2365-02-handbook-v1-12 -- page 25, Unit 202, AC1.1

**RAW:**
> The learner can: 1. identify and apply appropriate mathematical principles which are relevant to electrical work tasks

**PROPOSAL:**
CurriculumEvidence / PRIMARY_REQUIREMENT -- `{"subject":"mathematical-principles-relevant-to-electrical-work","curriculumUnitId":"U202-LO1-AC1","commandVerbPerformanceType":"APPLY"}`

**CONFIDENCE:**
EXPLICIT

**RATIONALE:**
AC1.1 literally reads "identify and apply appropriate mathematical principles..." -- APPLY is the second explicit verb.

---

#### CE-005-U202-LO1-AC1-RANGE-mathematical-principle--fractions-and-percentages-APPLY

**SOURCE:**
src-cg-2365-02-handbook-v1-12 -- page 25, Unit 202, Range under AC1.1 ("Mathematical principles:")

**RAW:**
> Range: Mathematical principles: Fractions and percentages.

**PROPOSAL:**
CurriculumEvidence / RANGE_REQUIRED_MEMBER -- `{"subject":"mathematical-principle--fractions-and-percentages","curriculumUnitId":"U202-LO1-AC1","commandVerbPerformanceType":"APPLY"}`

**CONFIDENCE:**
STRONG_INFERENCE

**RATIONALE:**
"Fractions and percentages" is an explicit member of the "Mathematical principles:" Range list under AC1.1. Performance type APPLY is inherited from the parent AC's own command verb (the Range table itself carries no separate verb per item) -- an inference from Range structure, not a second literal verb, hence STRONG_INFERENCE rather than EXPLICIT.

---

#### CE-007-U202-LO1-AC1-RANGE-mathematical-principle--algebra-APPLY

**SOURCE:**
src-cg-2365-02-handbook-v1-12 -- page 25, Unit 202, Range under AC1.1 ("Mathematical principles:")

**RAW:**
> Range: Mathematical principles: Algebra.

**PROPOSAL:**
CurriculumEvidence / RANGE_REQUIRED_MEMBER -- `{"subject":"mathematical-principle--algebra","curriculumUnitId":"U202-LO1-AC1","commandVerbPerformanceType":"APPLY"}`

**CONFIDENCE:**
STRONG_INFERENCE

**RATIONALE:**
"Algebra" is an explicit member of the "Mathematical principles:" Range list under AC1.1. Performance type APPLY is inherited from the parent AC's own command verb (the Range table itself carries no separate verb per item) -- an inference from Range structure, not a second literal verb, hence STRONG_INFERENCE rather than EXPLICIT.

---

#### CE-009-U202-LO1-AC1-RANGE-mathematical-principle--indices-APPLY

**SOURCE:**
src-cg-2365-02-handbook-v1-12 -- page 25, Unit 202, Range under AC1.1 ("Mathematical principles:")

**RAW:**
> Range: Mathematical principles: Indices.

**PROPOSAL:**
CurriculumEvidence / RANGE_REQUIRED_MEMBER -- `{"subject":"mathematical-principle--indices","curriculumUnitId":"U202-LO1-AC1","commandVerbPerformanceType":"APPLY"}`

**CONFIDENCE:**
STRONG_INFERENCE

**RATIONALE:**
"Indices" is an explicit member of the "Mathematical principles:" Range list under AC1.1. Performance type APPLY is inherited from the parent AC's own command verb (the Range table itself carries no separate verb per item) -- an inference from Range structure, not a second literal verb, hence STRONG_INFERENCE rather than EXPLICIT.

---

#### CE-011-U202-LO1-AC1-RANGE-mathematical-principle--transposition-APPLY

**SOURCE:**
src-cg-2365-02-handbook-v1-12 -- page 25, Unit 202, Range under AC1.1 ("Mathematical principles:")

**RAW:**
> Range: Mathematical principles: Transposition.

**PROPOSAL:**
CurriculumEvidence / RANGE_REQUIRED_MEMBER -- `{"subject":"mathematical-principle--transposition","curriculumUnitId":"U202-LO1-AC1","commandVerbPerformanceType":"APPLY"}`

**CONFIDENCE:**
STRONG_INFERENCE

**RATIONALE:**
"Transposition" is an explicit member of the "Mathematical principles:" Range list under AC1.1. Performance type APPLY is inherited from the parent AC's own command verb (the Range table itself carries no separate verb per item) -- an inference from Range structure, not a second literal verb, hence STRONG_INFERENCE rather than EXPLICIT.

---

#### CE-013-U202-LO1-AC1-RANGE-mathematical-principle--triangles-and-trigonometry-APPLY

**SOURCE:**
src-cg-2365-02-handbook-v1-12 -- page 25, Unit 202, Range under AC1.1 ("Mathematical principles:")

**RAW:**
> Range: Mathematical principles: Triangles and trigonometry.

**PROPOSAL:**
CurriculumEvidence / RANGE_REQUIRED_MEMBER -- `{"subject":"mathematical-principle--triangles-and-trigonometry","curriculumUnitId":"U202-LO1-AC1","commandVerbPerformanceType":"APPLY"}`

**CONFIDENCE:**
STRONG_INFERENCE

**RATIONALE:**
"Triangles and trigonometry" is an explicit member of the "Mathematical principles:" Range list under AC1.1. Performance type APPLY is inherited from the parent AC's own command verb (the Range table itself carries no separate verb per item) -- an inference from Range structure, not a second literal verb, hence STRONG_INFERENCE rather than EXPLICIT.

---

#### CE-015-U202-LO1-AC1-RANGE-mathematical-principle--statistics-APPLY

**SOURCE:**
src-cg-2365-02-handbook-v1-12 -- page 25, Unit 202, Range under AC1.1 ("Mathematical principles:")

**RAW:**
> Range: Mathematical principles: Statistics.

**PROPOSAL:**
CurriculumEvidence / RANGE_REQUIRED_MEMBER -- `{"subject":"mathematical-principle--statistics","curriculumUnitId":"U202-LO1-AC1","commandVerbPerformanceType":"APPLY"}`

**CONFIDENCE:**
STRONG_INFERENCE

**RATIONALE:**
"Statistics" is an explicit member of the "Mathematical principles:" Range list under AC1.1. Performance type APPLY is inherited from the parent AC's own command verb (the Range table itself carries no separate verb per item) -- an inference from Range structure, not a second literal verb, hence STRONG_INFERENCE rather than EXPLICIT.

---

#### PREREQ-1-algebraic-transposition-for-current-voltage-resistance-calculation-series-parallel-dc

**SOURCE:**
src-cg-2365-02-handbook-v1-12 -- pages 25, 27

**RAW:**
> AC1.1 Range: "Transposition". Target AC wording: "AC4.5's D.C. circuit calculations of current/voltage/resistance structurally require rearranging Ohm's-law-family equations, which is exactly LO1's Range item "Transposition" (AC1.1)."

**PROPOSAL:**
PrerequisiteEvidence -- `{"subject":"mathematical-principle--transposition","capabilityKey":"algebraic-transposition"}`

**CONFIDENCE:**
REVIEW_PROPOSED

**RATIONALE:**
The handbook demonstrates BOTH the capability (AC1.1's Transposition Range item) AND the operation that needs it (the named calculation AC), but never explicitly states a necessity relationship between the two ACs -- task section 15 requires EXPLICIT_CURRICULUM_OPERATION to come from the source ITSELF demonstrating the operation as necessary, not from CC-19A's own structural inference. Exported REVIEW_PROPOSED, capped from auto-promotion, matching the companion CandidateCapabilityRequirement's derivationKind REVIEW_PROPOSED below.

---

#### PREREQ-2-algebraic-transposition-for-power-calculation-series-parallel-dc

**SOURCE:**
src-cg-2365-02-handbook-v1-12 -- pages 25, 27

**RAW:**
> AC1.1 Range: "Transposition". Target AC wording: "AC4.6's D.C. circuit power calculations structurally require the same algebraic transposition skill as AC4.5."

**PROPOSAL:**
PrerequisiteEvidence -- `{"subject":"mathematical-principle--transposition","capabilityKey":"algebraic-transposition"}`

**CONFIDENCE:**
REVIEW_PROPOSED

**RATIONALE:**
The handbook demonstrates BOTH the capability (AC1.1's Transposition Range item) AND the operation that needs it (the named calculation AC), but never explicitly states a necessity relationship between the two ACs -- task section 15 requires EXPLICIT_CURRICULUM_OPERATION to come from the source ITSELF demonstrating the operation as necessary, not from CC-19A's own structural inference. Exported REVIEW_PROPOSED, capped from auto-promotion, matching the companion CandidateCapabilityRequirement's derivationKind REVIEW_PROPOSED below.

---

#### PREREQ-3-algebraic-transposition-for-mechanical-energy-power-and-efficiency-calculation

**SOURCE:**
src-cg-2365-02-handbook-v1-12 -- pages 25, 27

**RAW:**
> AC1.1 Range: "Transposition". Target AC wording: "AC3.4's mechanical energy/power/efficiency calculations structurally require rearranging the same class of equations as AC4.5/AC4.6."

**PROPOSAL:**
PrerequisiteEvidence -- `{"subject":"mathematical-principle--transposition","capabilityKey":"algebraic-transposition"}`

**CONFIDENCE:**
REVIEW_PROPOSED

**RATIONALE:**
The handbook demonstrates BOTH the capability (AC1.1's Transposition Range item) AND the operation that needs it (the named calculation AC), but never explicitly states a necessity relationship between the two ACs -- task section 15 requires EXPLICIT_CURRICULUM_OPERATION to come from the source ITSELF demonstrating the operation as necessary, not from CC-19A's own structural inference. Exported REVIEW_PROPOSED, capped from auto-promotion, matching the companion CandidateCapabilityRequirement's derivationKind REVIEW_PROPOSED below.

---

#### CAPREQ-1-algebraic-transposition-for-current-voltage-resistance-calculation-series-parallel-dc

**SOURCE:**
src-cg-2365-02-handbook-v1-12 -- pages 25, 27

**RAW:**
> AC1.1 Range: "Transposition". Target AC wording: "AC4.5's D.C. circuit calculations of current/voltage/resistance structurally require rearranging Ohm's-law-family equations, which is exactly LO1's Range item "Transposition" (AC1.1)."

**PROPOSAL:**
CandidateCapabilityRequirement -- `{"targetCandidateKey":"current-voltage-resistance-calculation-series-parallel-dc::CALCULATE","capabilityKey":"algebraic-transposition","derivationKind":"REVIEW_PROPOSED"}`

**CONFIDENCE:**
REVIEW_PROPOSED

**RATIONALE:**
derivationKind REVIEW_PROPOSED -- see the companion PrerequisiteEvidence proposal's rationale. Never auto-promotable per the governed architecture even if the pipeline were run.

---

#### CAPREQ-2-algebraic-transposition-for-power-calculation-series-parallel-dc

**SOURCE:**
src-cg-2365-02-handbook-v1-12 -- pages 25, 27

**RAW:**
> AC1.1 Range: "Transposition". Target AC wording: "AC4.6's D.C. circuit power calculations structurally require the same algebraic transposition skill as AC4.5."

**PROPOSAL:**
CandidateCapabilityRequirement -- `{"targetCandidateKey":"power-calculation-series-parallel-dc::CALCULATE","capabilityKey":"algebraic-transposition","derivationKind":"REVIEW_PROPOSED"}`

**CONFIDENCE:**
REVIEW_PROPOSED

**RATIONALE:**
derivationKind REVIEW_PROPOSED -- see the companion PrerequisiteEvidence proposal's rationale. Never auto-promotable per the governed architecture even if the pipeline were run.

---

#### CAPREQ-3-algebraic-transposition-for-mechanical-energy-power-and-efficiency-calculation

**SOURCE:**
src-cg-2365-02-handbook-v1-12 -- pages 25, 27

**RAW:**
> AC1.1 Range: "Transposition". Target AC wording: "AC3.4's mechanical energy/power/efficiency calculations structurally require rearranging the same class of equations as AC4.5/AC4.6."

**PROPOSAL:**
CandidateCapabilityRequirement -- `{"targetCandidateKey":"mechanical-energy-power-and-efficiency-calculation::CALCULATE","capabilityKey":"algebraic-transposition","derivationKind":"REVIEW_PROPOSED"}`

**CONFIDENCE:**
REVIEW_PROPOSED

**RATIONALE:**
derivationKind REVIEW_PROPOSED -- see the companion PrerequisiteEvidence proposal's rationale. Never auto-promotable per the governed architecture even if the pipeline were run.

---

### LO2.AC1

#### OCU-U202-LO2-AC1

**SOURCE:**
src-cg-2365-02-handbook-v1-12 -- page 26, Unit 202, Learning outcome 2, Assessment criteria 1

**RAW:**
> Learning outcome: The learner will: 2. Understand standard units of measurement used in electrical installation, maintenance and design work. Assessment criteria: The learner can: 1. identify and use internationally recognised base and derived (SI) units of measurement

**PROPOSAL:**
OfficialCurriculumUnit -- `{"curriculumUnitId":"U202-LO2-AC1","officialWording":"identify and use internationally recognised base and derived (SI) units of measurement"}`

**CONFIDENCE:**
EXPLICIT

**RATIONALE:**
Registry entry transcribed verbatim from the handbook's own Learning outcome / Assessment criteria table for Unit 202, page 26. curriculumUnitId is a CC-19A-assigned mapping key (U202-LO2-AC1), not itself official wording.

---

#### CE-017-U202-LO2-AC1-PRIMARY-IDENTIFY

**SOURCE:**
src-cg-2365-02-handbook-v1-12 -- page 26, Unit 202, AC2.1

**RAW:**
> The learner can: 1. identify and use internationally recognised base and derived (SI) units of measurement

**PROPOSAL:**
CurriculumEvidence / PRIMARY_REQUIREMENT -- `{"subject":"si-units-of-measurement-for-physical-quantities","curriculumUnitId":"U202-LO2-AC1","commandVerbPerformanceType":"IDENTIFY"}`

**CONFIDENCE:**
EXPLICIT

**RATIONALE:**
AC2.1 reads "identify and use internationally recognised base and derived (SI) units of measurement" -- IDENTIFY is the first explicit verb.

---

#### CE-019-U202-LO2-AC1-PRIMARY-APPLY

**SOURCE:**
src-cg-2365-02-handbook-v1-12 -- page 26, Unit 202, AC2.1

**RAW:**
> The learner can: 1. identify and use internationally recognised base and derived (SI) units of measurement

**PROPOSAL:**
CurriculumEvidence / PRIMARY_REQUIREMENT -- `{"subject":"si-units-of-measurement-for-physical-quantities","curriculumUnitId":"U202-LO2-AC1","commandVerbPerformanceType":"APPLY"}`

**CONFIDENCE:**
EXPLICIT

**RATIONALE:**
AC2.1's second verb "use" is normalized to the governed vocabulary's APPLY (using a unit of measurement in practice is an application, not a bare recognition act).

---

#### CE-021-U202-LO2-AC1-RANGE-physical-quantity-si-unit--length-APPLY

**SOURCE:**
src-cg-2365-02-handbook-v1-12 -- page 26, Unit 202, Range under AC2.1 ("(SI) Units of measurement for:")

**RAW:**
> Range: (SI) Units of measurement for: Length.

**PROPOSAL:**
CurriculumEvidence / RANGE_REQUIRED_MEMBER -- `{"subject":"physical-quantity-si-unit--length","curriculumUnitId":"U202-LO2-AC1","commandVerbPerformanceType":"APPLY"}`

**CONFIDENCE:**
STRONG_INFERENCE

**RATIONALE:**
"Length" is an explicit member of the "(SI) Units of measurement for:" Range list under AC2.1. Performance type APPLY is inherited from the parent AC's own command verb (the Range table itself carries no separate verb per item) -- an inference from Range structure, not a second literal verb, hence STRONG_INFERENCE rather than EXPLICIT.

---

#### CE-023-U202-LO2-AC1-RANGE-physical-quantity-si-unit--area-APPLY

**SOURCE:**
src-cg-2365-02-handbook-v1-12 -- page 26, Unit 202, Range under AC2.1 ("(SI) Units of measurement for:")

**RAW:**
> Range: (SI) Units of measurement for: Area.

**PROPOSAL:**
CurriculumEvidence / RANGE_REQUIRED_MEMBER -- `{"subject":"physical-quantity-si-unit--area","curriculumUnitId":"U202-LO2-AC1","commandVerbPerformanceType":"APPLY"}`

**CONFIDENCE:**
STRONG_INFERENCE

**RATIONALE:**
"Area" is an explicit member of the "(SI) Units of measurement for:" Range list under AC2.1. Performance type APPLY is inherited from the parent AC's own command verb (the Range table itself carries no separate verb per item) -- an inference from Range structure, not a second literal verb, hence STRONG_INFERENCE rather than EXPLICIT.

---

#### CE-025-U202-LO2-AC1-RANGE-physical-quantity-si-unit--volume-APPLY

**SOURCE:**
src-cg-2365-02-handbook-v1-12 -- page 26, Unit 202, Range under AC2.1 ("(SI) Units of measurement for:")

**RAW:**
> Range: (SI) Units of measurement for: Volume.

**PROPOSAL:**
CurriculumEvidence / RANGE_REQUIRED_MEMBER -- `{"subject":"physical-quantity-si-unit--volume","curriculumUnitId":"U202-LO2-AC1","commandVerbPerformanceType":"APPLY"}`

**CONFIDENCE:**
STRONG_INFERENCE

**RATIONALE:**
"Volume" is an explicit member of the "(SI) Units of measurement for:" Range list under AC2.1. Performance type APPLY is inherited from the parent AC's own command verb (the Range table itself carries no separate verb per item) -- an inference from Range structure, not a second literal verb, hence STRONG_INFERENCE rather than EXPLICIT.

---

#### CE-027-U202-LO2-AC1-RANGE-physical-quantity-si-unit--mass-APPLY

**SOURCE:**
src-cg-2365-02-handbook-v1-12 -- page 26, Unit 202, Range under AC2.1 ("(SI) Units of measurement for:")

**RAW:**
> Range: (SI) Units of measurement for: Mass.

**PROPOSAL:**
CurriculumEvidence / RANGE_REQUIRED_MEMBER -- `{"subject":"physical-quantity-si-unit--mass","curriculumUnitId":"U202-LO2-AC1","commandVerbPerformanceType":"APPLY"}`

**CONFIDENCE:**
STRONG_INFERENCE

**RATIONALE:**
"Mass" is an explicit member of the "(SI) Units of measurement for:" Range list under AC2.1. Performance type APPLY is inherited from the parent AC's own command verb (the Range table itself carries no separate verb per item) -- an inference from Range structure, not a second literal verb, hence STRONG_INFERENCE rather than EXPLICIT.

---

#### CE-029-U202-LO2-AC1-RANGE-physical-quantity-si-unit--density-APPLY

**SOURCE:**
src-cg-2365-02-handbook-v1-12 -- page 26, Unit 202, Range under AC2.1 ("(SI) Units of measurement for:")

**RAW:**
> Range: (SI) Units of measurement for: Density.

**PROPOSAL:**
CurriculumEvidence / RANGE_REQUIRED_MEMBER -- `{"subject":"physical-quantity-si-unit--density","curriculumUnitId":"U202-LO2-AC1","commandVerbPerformanceType":"APPLY"}`

**CONFIDENCE:**
STRONG_INFERENCE

**RATIONALE:**
"Density" is an explicit member of the "(SI) Units of measurement for:" Range list under AC2.1. Performance type APPLY is inherited from the parent AC's own command verb (the Range table itself carries no separate verb per item) -- an inference from Range structure, not a second literal verb, hence STRONG_INFERENCE rather than EXPLICIT.

---

#### CE-031-U202-LO2-AC1-RANGE-physical-quantity-si-unit--time-APPLY

**SOURCE:**
src-cg-2365-02-handbook-v1-12 -- page 26, Unit 202, Range under AC2.1 ("(SI) Units of measurement for:")

**RAW:**
> Range: (SI) Units of measurement for: Time.

**PROPOSAL:**
CurriculumEvidence / RANGE_REQUIRED_MEMBER -- `{"subject":"physical-quantity-si-unit--time","curriculumUnitId":"U202-LO2-AC1","commandVerbPerformanceType":"APPLY"}`

**CONFIDENCE:**
STRONG_INFERENCE

**RATIONALE:**
"Time" is an explicit member of the "(SI) Units of measurement for:" Range list under AC2.1. Performance type APPLY is inherited from the parent AC's own command verb (the Range table itself carries no separate verb per item) -- an inference from Range structure, not a second literal verb, hence STRONG_INFERENCE rather than EXPLICIT.

---

#### CE-033-U202-LO2-AC1-RANGE-physical-quantity-si-unit--temperature-APPLY

**SOURCE:**
src-cg-2365-02-handbook-v1-12 -- page 26, Unit 202, Range under AC2.1 ("(SI) Units of measurement for:")

**RAW:**
> Range: (SI) Units of measurement for: Temperature.

**PROPOSAL:**
CurriculumEvidence / RANGE_REQUIRED_MEMBER -- `{"subject":"physical-quantity-si-unit--temperature","curriculumUnitId":"U202-LO2-AC1","commandVerbPerformanceType":"APPLY"}`

**CONFIDENCE:**
STRONG_INFERENCE

**RATIONALE:**
"Temperature" is an explicit member of the "(SI) Units of measurement for:" Range list under AC2.1. Performance type APPLY is inherited from the parent AC's own command verb (the Range table itself carries no separate verb per item) -- an inference from Range structure, not a second literal verb, hence STRONG_INFERENCE rather than EXPLICIT.

---

#### CE-035-U202-LO2-AC1-RANGE-physical-quantity-si-unit--velocity-APPLY

**SOURCE:**
src-cg-2365-02-handbook-v1-12 -- page 26, Unit 202, Range under AC2.1 ("(SI) Units of measurement for:")

**RAW:**
> Range: (SI) Units of measurement for: Velocity.

**PROPOSAL:**
CurriculumEvidence / RANGE_REQUIRED_MEMBER -- `{"subject":"physical-quantity-si-unit--velocity","curriculumUnitId":"U202-LO2-AC1","commandVerbPerformanceType":"APPLY"}`

**CONFIDENCE:**
STRONG_INFERENCE

**RATIONALE:**
"Velocity" is an explicit member of the "(SI) Units of measurement for:" Range list under AC2.1. Performance type APPLY is inherited from the parent AC's own command verb (the Range table itself carries no separate verb per item) -- an inference from Range structure, not a second literal verb, hence STRONG_INFERENCE rather than EXPLICIT.

---

#### FACTREQ-length-si-unit

**SOURCE:**
src-cg-2365-02-handbook-v1-12 -- page 26, AC2.1 ("identify and use internationally recognised base and derived (SI) units of measurement")

**RAW:**
> AC2.1: "identify and use internationally recognised base and derived (SI) units of measurement". Range item: "Length".

**PROPOSAL:**
CandidateFactRequirement -- `{"targetCandidateKey":"physical-quantity-si-unit--length::APPLY","claimKey":"length-si-unit","derivationStatus":"EXPLICIT_CURRICULUM_FACT"}`

**CONFIDENCE:**
EXPLICIT

**RATIONALE:**
AC2.1's own wording ("identify and use internationally recognised base and derived (SI) units of measurement") explicitly requires knowing the SI unit VALUE for each Range-named quantity, not merely that the quantity exists -- this is the "determine values of ... units" clause itself, satisfying task section 16's EXPLICIT_CURRICULUM_FACT bar (never AUTHORITATIVE_TECHNICAL_FACT, per the locked normalizationBasis rule).

---

#### FACTREQ-area-si-unit

**SOURCE:**
src-cg-2365-02-handbook-v1-12 -- page 26, AC2.1 ("identify and use internationally recognised base and derived (SI) units of measurement")

**RAW:**
> AC2.1: "identify and use internationally recognised base and derived (SI) units of measurement". Range item: "Area".

**PROPOSAL:**
CandidateFactRequirement -- `{"targetCandidateKey":"physical-quantity-si-unit--area::APPLY","claimKey":"area-si-unit","derivationStatus":"EXPLICIT_CURRICULUM_FACT"}`

**CONFIDENCE:**
EXPLICIT

**RATIONALE:**
AC2.1's own wording ("identify and use internationally recognised base and derived (SI) units of measurement") explicitly requires knowing the SI unit VALUE for each Range-named quantity, not merely that the quantity exists -- this is the "determine values of ... units" clause itself, satisfying task section 16's EXPLICIT_CURRICULUM_FACT bar (never AUTHORITATIVE_TECHNICAL_FACT, per the locked normalizationBasis rule).

---

#### FACTREQ-volume-si-unit

**SOURCE:**
src-cg-2365-02-handbook-v1-12 -- page 26, AC2.1 ("identify and use internationally recognised base and derived (SI) units of measurement")

**RAW:**
> AC2.1: "identify and use internationally recognised base and derived (SI) units of measurement". Range item: "Volume".

**PROPOSAL:**
CandidateFactRequirement -- `{"targetCandidateKey":"physical-quantity-si-unit--volume::APPLY","claimKey":"volume-si-unit","derivationStatus":"EXPLICIT_CURRICULUM_FACT"}`

**CONFIDENCE:**
EXPLICIT

**RATIONALE:**
AC2.1's own wording ("identify and use internationally recognised base and derived (SI) units of measurement") explicitly requires knowing the SI unit VALUE for each Range-named quantity, not merely that the quantity exists -- this is the "determine values of ... units" clause itself, satisfying task section 16's EXPLICIT_CURRICULUM_FACT bar (never AUTHORITATIVE_TECHNICAL_FACT, per the locked normalizationBasis rule).

---

#### FACTREQ-mass-si-unit

**SOURCE:**
src-cg-2365-02-handbook-v1-12 -- page 26, AC2.1 ("identify and use internationally recognised base and derived (SI) units of measurement")

**RAW:**
> AC2.1: "identify and use internationally recognised base and derived (SI) units of measurement". Range item: "Mass".

**PROPOSAL:**
CandidateFactRequirement -- `{"targetCandidateKey":"physical-quantity-si-unit--mass::APPLY","claimKey":"mass-si-unit","derivationStatus":"EXPLICIT_CURRICULUM_FACT"}`

**CONFIDENCE:**
EXPLICIT

**RATIONALE:**
AC2.1's own wording ("identify and use internationally recognised base and derived (SI) units of measurement") explicitly requires knowing the SI unit VALUE for each Range-named quantity, not merely that the quantity exists -- this is the "determine values of ... units" clause itself, satisfying task section 16's EXPLICIT_CURRICULUM_FACT bar (never AUTHORITATIVE_TECHNICAL_FACT, per the locked normalizationBasis rule).

---

#### FACTREQ-density-si-unit

**SOURCE:**
src-cg-2365-02-handbook-v1-12 -- page 26, AC2.1 ("identify and use internationally recognised base and derived (SI) units of measurement")

**RAW:**
> AC2.1: "identify and use internationally recognised base and derived (SI) units of measurement". Range item: "Density".

**PROPOSAL:**
CandidateFactRequirement -- `{"targetCandidateKey":"physical-quantity-si-unit--density::APPLY","claimKey":"density-si-unit","derivationStatus":"EXPLICIT_CURRICULUM_FACT"}`

**CONFIDENCE:**
EXPLICIT

**RATIONALE:**
AC2.1's own wording ("identify and use internationally recognised base and derived (SI) units of measurement") explicitly requires knowing the SI unit VALUE for each Range-named quantity, not merely that the quantity exists -- this is the "determine values of ... units" clause itself, satisfying task section 16's EXPLICIT_CURRICULUM_FACT bar (never AUTHORITATIVE_TECHNICAL_FACT, per the locked normalizationBasis rule).

---

#### FACTREQ-time-si-unit

**SOURCE:**
src-cg-2365-02-handbook-v1-12 -- page 26, AC2.1 ("identify and use internationally recognised base and derived (SI) units of measurement")

**RAW:**
> AC2.1: "identify and use internationally recognised base and derived (SI) units of measurement". Range item: "Time".

**PROPOSAL:**
CandidateFactRequirement -- `{"targetCandidateKey":"physical-quantity-si-unit--time::APPLY","claimKey":"time-si-unit","derivationStatus":"EXPLICIT_CURRICULUM_FACT"}`

**CONFIDENCE:**
EXPLICIT

**RATIONALE:**
AC2.1's own wording ("identify and use internationally recognised base and derived (SI) units of measurement") explicitly requires knowing the SI unit VALUE for each Range-named quantity, not merely that the quantity exists -- this is the "determine values of ... units" clause itself, satisfying task section 16's EXPLICIT_CURRICULUM_FACT bar (never AUTHORITATIVE_TECHNICAL_FACT, per the locked normalizationBasis rule).

---

#### FACTREQ-temperature-si-unit

**SOURCE:**
src-cg-2365-02-handbook-v1-12 -- page 26, AC2.1 ("identify and use internationally recognised base and derived (SI) units of measurement")

**RAW:**
> AC2.1: "identify and use internationally recognised base and derived (SI) units of measurement". Range item: "Temperature".

**PROPOSAL:**
CandidateFactRequirement -- `{"targetCandidateKey":"physical-quantity-si-unit--temperature::APPLY","claimKey":"temperature-si-unit","derivationStatus":"EXPLICIT_CURRICULUM_FACT"}`

**CONFIDENCE:**
EXPLICIT

**RATIONALE:**
AC2.1's own wording ("identify and use internationally recognised base and derived (SI) units of measurement") explicitly requires knowing the SI unit VALUE for each Range-named quantity, not merely that the quantity exists -- this is the "determine values of ... units" clause itself, satisfying task section 16's EXPLICIT_CURRICULUM_FACT bar (never AUTHORITATIVE_TECHNICAL_FACT, per the locked normalizationBasis rule).

---

#### FACTREQ-velocity-si-unit

**SOURCE:**
src-cg-2365-02-handbook-v1-12 -- page 26, AC2.1 ("identify and use internationally recognised base and derived (SI) units of measurement")

**RAW:**
> AC2.1: "identify and use internationally recognised base and derived (SI) units of measurement". Range item: "Velocity".

**PROPOSAL:**
CandidateFactRequirement -- `{"targetCandidateKey":"physical-quantity-si-unit--velocity::APPLY","claimKey":"velocity-si-unit","derivationStatus":"EXPLICIT_CURRICULUM_FACT"}`

**CONFIDENCE:**
EXPLICIT

**RATIONALE:**
AC2.1's own wording ("identify and use internationally recognised base and derived (SI) units of measurement") explicitly requires knowing the SI unit VALUE for each Range-named quantity, not merely that the quantity exists -- this is the "determine values of ... units" clause itself, satisfying task section 16's EXPLICIT_CURRICULUM_FACT bar (never AUTHORITATIVE_TECHNICAL_FACT, per the locked normalizationBasis rule).

---

### LO2.AC2

#### OCU-U202-LO2-AC2

**SOURCE:**
src-cg-2365-02-handbook-v1-12 -- page 26, Unit 202, Learning outcome 2, Assessment criteria 2

**RAW:**
> Learning outcome: The learner will: 2. Understand standard units of measurement used in electrical installation, maintenance and design work. Assessment criteria: The learner can: 2. identify and determine values of base and derived SI units which apply specifically to electrical quantities

**PROPOSAL:**
OfficialCurriculumUnit -- `{"curriculumUnitId":"U202-LO2-AC2","officialWording":"identify and determine values of base and derived SI units which apply specifically to electrical quantities"}`

**CONFIDENCE:**
EXPLICIT

**RATIONALE:**
Registry entry transcribed verbatim from the handbook's own Learning outcome / Assessment criteria table for Unit 202, page 26. curriculumUnitId is a CC-19A-assigned mapping key (U202-LO2-AC2), not itself official wording.

---

#### CE-037-U202-LO2-AC2-PRIMARY-IDENTIFY

**SOURCE:**
src-cg-2365-02-handbook-v1-12 -- page 26, Unit 202, AC2.2

**RAW:**
> The learner can: 2. identify and determine values of base and derived SI units which apply specifically to electrical quantities

**PROPOSAL:**
CurriculumEvidence / PRIMARY_REQUIREMENT -- `{"subject":"si-units-of-measurement-for-electrical-quantities","curriculumUnitId":"U202-LO2-AC2","commandVerbPerformanceType":"IDENTIFY"}`

**CONFIDENCE:**
EXPLICIT

**RATIONALE:**
AC2.2 reads "identify and determine values of base and derived SI units which apply specifically to electrical quantities" -- IDENTIFY is the first explicit verb.

---

#### CE-039-U202-LO2-AC2-PRIMARY-DEFINE

**SOURCE:**
src-cg-2365-02-handbook-v1-12 -- page 26, Unit 202, AC2.2

**RAW:**
> The learner can: 2. identify and determine values of base and derived SI units which apply specifically to electrical quantities

**PROPOSAL:**
CurriculumEvidence / PRIMARY_REQUIREMENT -- `{"subject":"si-units-of-measurement-for-electrical-quantities","curriculumUnitId":"U202-LO2-AC2","commandVerbPerformanceType":"DEFINE"}`

**CONFIDENCE:**
EXPLICIT

**RATIONALE:**
AC2.2's "determine values of ... units" is normalized to DEFINE: no arithmetic/circuit calculation is implied (contrast AC4.5/AC4.6's explicit "calculate"), this is knowing/stating what unit and symbol apply to each named electrical quantity.

---

#### CE-041-U202-LO2-AC2-RANGE-electrical-quantity-si-unit--resistance-DEFINE

**SOURCE:**
src-cg-2365-02-handbook-v1-12 -- page 26, Unit 202, Range under AC2.2 ("Electrical quantities (SI units):")

**RAW:**
> Range: Electrical quantities (SI units): Resistance.

**PROPOSAL:**
CurriculumEvidence / RANGE_REQUIRED_MEMBER -- `{"subject":"electrical-quantity-si-unit--resistance","curriculumUnitId":"U202-LO2-AC2","commandVerbPerformanceType":"DEFINE"}`

**CONFIDENCE:**
STRONG_INFERENCE

**RATIONALE:**
"Resistance" is an explicit member of the "Electrical quantities (SI units):" Range list under AC2.2. Performance type DEFINE inherited from the parent AC's "determine values of" verb.

---

#### CE-043-U202-LO2-AC2-RANGE-electrical-quantity-si-unit--resistivity-DEFINE

**SOURCE:**
src-cg-2365-02-handbook-v1-12 -- page 26, Unit 202, Range under AC2.2 ("Electrical quantities (SI units):")

**RAW:**
> Range: Electrical quantities (SI units): Resistivity.

**PROPOSAL:**
CurriculumEvidence / RANGE_REQUIRED_MEMBER -- `{"subject":"electrical-quantity-si-unit--resistivity","curriculumUnitId":"U202-LO2-AC2","commandVerbPerformanceType":"DEFINE"}`

**CONFIDENCE:**
STRONG_INFERENCE

**RATIONALE:**
"Resistivity" is an explicit member of the "Electrical quantities (SI units):" Range list under AC2.2. Performance type DEFINE inherited from the parent AC's "determine values of" verb.

---

#### CE-045-U202-LO2-AC2-RANGE-electrical-quantity-si-unit--power-DEFINE

**SOURCE:**
src-cg-2365-02-handbook-v1-12 -- page 26, Unit 202, Range under AC2.2 ("Electrical quantities (SI units):")

**RAW:**
> Range: Electrical quantities (SI units): Power.

**PROPOSAL:**
CurriculumEvidence / RANGE_REQUIRED_MEMBER -- `{"subject":"electrical-quantity-si-unit--power","curriculumUnitId":"U202-LO2-AC2","commandVerbPerformanceType":"DEFINE"}`

**CONFIDENCE:**
STRONG_INFERENCE

**RATIONALE:**
"Power" is an explicit member of the "Electrical quantities (SI units):" Range list under AC2.2. Performance type DEFINE inherited from the parent AC's "determine values of" verb.

---

#### CE-047-U202-LO2-AC2-RANGE-electrical-quantity-si-unit--frequency-DEFINE

**SOURCE:**
src-cg-2365-02-handbook-v1-12 -- page 26, Unit 202, Range under AC2.2 ("Electrical quantities (SI units):")

**RAW:**
> Range: Electrical quantities (SI units): Frequency.

**PROPOSAL:**
CurriculumEvidence / RANGE_REQUIRED_MEMBER -- `{"subject":"electrical-quantity-si-unit--frequency","curriculumUnitId":"U202-LO2-AC2","commandVerbPerformanceType":"DEFINE"}`

**CONFIDENCE:**
STRONG_INFERENCE

**RATIONALE:**
"Frequency" is an explicit member of the "Electrical quantities (SI units):" Range list under AC2.2. Performance type DEFINE inherited from the parent AC's "determine values of" verb.

---

#### CE-049-U202-LO2-AC2-RANGE-electrical-quantity-si-unit--current-DEFINE

**SOURCE:**
src-cg-2365-02-handbook-v1-12 -- page 26, Unit 202, Range under AC2.2 ("Electrical quantities (SI units):")

**RAW:**
> Range: Electrical quantities (SI units): Current.

**PROPOSAL:**
CurriculumEvidence / RANGE_REQUIRED_MEMBER -- `{"subject":"electrical-quantity-si-unit--current","curriculumUnitId":"U202-LO2-AC2","commandVerbPerformanceType":"DEFINE"}`

**CONFIDENCE:**
STRONG_INFERENCE

**RATIONALE:**
"Current" is an explicit member of the "Electrical quantities (SI units):" Range list under AC2.2. Performance type DEFINE inherited from the parent AC's "determine values of" verb.

---

#### CE-051-U202-LO2-AC2-RANGE-electrical-quantity-si-unit--voltage-DEFINE

**SOURCE:**
src-cg-2365-02-handbook-v1-12 -- page 26, Unit 202, Range under AC2.2 ("Electrical quantities (SI units):")

**RAW:**
> Range: Electrical quantities (SI units): Voltage.

**PROPOSAL:**
CurriculumEvidence / RANGE_REQUIRED_MEMBER -- `{"subject":"electrical-quantity-si-unit--voltage","curriculumUnitId":"U202-LO2-AC2","commandVerbPerformanceType":"DEFINE"}`

**CONFIDENCE:**
STRONG_INFERENCE

**RATIONALE:**
"Voltage" is an explicit member of the "Electrical quantities (SI units):" Range list under AC2.2. Performance type DEFINE inherited from the parent AC's "determine values of" verb.

---

#### CE-053-U202-LO2-AC2-RANGE-electrical-quantity-si-unit--energy-DEFINE

**SOURCE:**
src-cg-2365-02-handbook-v1-12 -- page 26, Unit 202, Range under AC2.2 ("Electrical quantities (SI units):")

**RAW:**
> Range: Electrical quantities (SI units): Energy.

**PROPOSAL:**
CurriculumEvidence / RANGE_REQUIRED_MEMBER -- `{"subject":"electrical-quantity-si-unit--energy","curriculumUnitId":"U202-LO2-AC2","commandVerbPerformanceType":"DEFINE"}`

**CONFIDENCE:**
STRONG_INFERENCE

**RATIONALE:**
"Energy" is an explicit member of the "Electrical quantities (SI units):" Range list under AC2.2. Performance type DEFINE inherited from the parent AC's "determine values of" verb.

---

#### CE-055-U202-LO2-AC2-RANGE-electrical-quantity-si-unit--impedance-DEFINE

**SOURCE:**
src-cg-2365-02-handbook-v1-12 -- page 26, Unit 202, Range under AC2.2 ("Electrical quantities (SI units):")

**RAW:**
> Range: Electrical quantities (SI units): Impedance.

**PROPOSAL:**
CurriculumEvidence / RANGE_REQUIRED_MEMBER -- `{"subject":"electrical-quantity-si-unit--impedance","curriculumUnitId":"U202-LO2-AC2","commandVerbPerformanceType":"DEFINE"}`

**CONFIDENCE:**
STRONG_INFERENCE

**RATIONALE:**
"Impedance" is an explicit member of the "Electrical quantities (SI units):" Range list under AC2.2. Performance type DEFINE inherited from the parent AC's "determine values of" verb.

---

#### CE-057-U202-LO2-AC2-RANGE-electrical-quantity-si-unit--inductance-DEFINE

**SOURCE:**
src-cg-2365-02-handbook-v1-12 -- page 26, Unit 202, Range under AC2.2 ("Electrical quantities (SI units):")

**RAW:**
> Range: Electrical quantities (SI units): Inductance.

**PROPOSAL:**
CurriculumEvidence / RANGE_REQUIRED_MEMBER -- `{"subject":"electrical-quantity-si-unit--inductance","curriculumUnitId":"U202-LO2-AC2","commandVerbPerformanceType":"DEFINE"}`

**CONFIDENCE:**
STRONG_INFERENCE

**RATIONALE:**
The handbook prints this Range line as a single bundled bullet ("Inductance and inductive reactance" / "Capacitance and capacitive reactance"). Split into two independent claim-bearing Range members ("Inductance" here) per the one-factual-dimension-per-claimKey rule -- both halves remain required, but are tracked as separate candidates.

---

#### CE-059-U202-LO2-AC2-RANGE-electrical-quantity-si-unit--inductive-reactance-DEFINE

**SOURCE:**
src-cg-2365-02-handbook-v1-12 -- page 26, Unit 202, Range under AC2.2 ("Electrical quantities (SI units):")

**RAW:**
> Range: Electrical quantities (SI units): Inductive reactance.

**PROPOSAL:**
CurriculumEvidence / RANGE_REQUIRED_MEMBER -- `{"subject":"electrical-quantity-si-unit--inductive-reactance","curriculumUnitId":"U202-LO2-AC2","commandVerbPerformanceType":"DEFINE"}`

**CONFIDENCE:**
STRONG_INFERENCE

**RATIONALE:**
The handbook prints this Range line as a single bundled bullet ("Inductance and inductive reactance" / "Capacitance and capacitive reactance"). Split into two independent claim-bearing Range members ("Inductive reactance" here) per the one-factual-dimension-per-claimKey rule -- both halves remain required, but are tracked as separate candidates.

---

#### CE-061-U202-LO2-AC2-RANGE-electrical-quantity-si-unit--capacitance-DEFINE

**SOURCE:**
src-cg-2365-02-handbook-v1-12 -- page 26, Unit 202, Range under AC2.2 ("Electrical quantities (SI units):")

**RAW:**
> Range: Electrical quantities (SI units): Capacitance.

**PROPOSAL:**
CurriculumEvidence / RANGE_REQUIRED_MEMBER -- `{"subject":"electrical-quantity-si-unit--capacitance","curriculumUnitId":"U202-LO2-AC2","commandVerbPerformanceType":"DEFINE"}`

**CONFIDENCE:**
STRONG_INFERENCE

**RATIONALE:**
The handbook prints this Range line as a single bundled bullet ("Inductance and inductive reactance" / "Capacitance and capacitive reactance"). Split into two independent claim-bearing Range members ("Capacitance" here) per the one-factual-dimension-per-claimKey rule -- both halves remain required, but are tracked as separate candidates.

---

#### CE-063-U202-LO2-AC2-RANGE-electrical-quantity-si-unit--capacitive-reactance-DEFINE

**SOURCE:**
src-cg-2365-02-handbook-v1-12 -- page 26, Unit 202, Range under AC2.2 ("Electrical quantities (SI units):")

**RAW:**
> Range: Electrical quantities (SI units): Capacitive reactance.

**PROPOSAL:**
CurriculumEvidence / RANGE_REQUIRED_MEMBER -- `{"subject":"electrical-quantity-si-unit--capacitive-reactance","curriculumUnitId":"U202-LO2-AC2","commandVerbPerformanceType":"DEFINE"}`

**CONFIDENCE:**
STRONG_INFERENCE

**RATIONALE:**
The handbook prints this Range line as a single bundled bullet ("Inductance and inductive reactance" / "Capacitance and capacitive reactance"). Split into two independent claim-bearing Range members ("Capacitive reactance" here) per the one-factual-dimension-per-claimKey rule -- both halves remain required, but are tracked as separate candidates.

---

#### CE-065-U202-LO2-AC2-RANGE-electrical-quantity-si-unit--power-factor-DEFINE

**SOURCE:**
src-cg-2365-02-handbook-v1-12 -- page 26, Unit 202, Range under AC2.2 ("Electrical quantities (SI units):")

**RAW:**
> Range: Electrical quantities (SI units): Power factor.

**PROPOSAL:**
CurriculumEvidence / RANGE_REQUIRED_MEMBER -- `{"subject":"electrical-quantity-si-unit--power-factor","curriculumUnitId":"U202-LO2-AC2","commandVerbPerformanceType":"DEFINE"}`

**CONFIDENCE:**
STRONG_INFERENCE

**RATIONALE:**
"Power factor" is an explicit member of the "Electrical quantities (SI units):" Range list under AC2.2. Performance type DEFINE inherited from the parent AC's "determine values of" verb.

---

#### FACTREQ-resistance-si-unit

**SOURCE:**
src-cg-2365-02-handbook-v1-12 -- page 26, AC2.2 ("identify and determine values of base and derived SI units which apply specifically to electrical quantities")

**RAW:**
> AC2.2: "identify and determine values of base and derived SI units which apply specifically to electrical quantities". Range item: "Resistance".

**PROPOSAL:**
CandidateFactRequirement -- `{"targetCandidateKey":"electrical-quantity-si-unit--resistance::DEFINE","claimKey":"resistance-si-unit","derivationStatus":"EXPLICIT_CURRICULUM_FACT"}`

**CONFIDENCE:**
EXPLICIT

**RATIONALE:**
AC2.2's own wording ("identify and determine values of base and derived SI units which apply specifically to electrical quantities") explicitly requires knowing the SI unit VALUE for each Range-named quantity, not merely that the quantity exists -- this is the "determine values of ... units" clause itself, satisfying task section 16's EXPLICIT_CURRICULUM_FACT bar (never AUTHORITATIVE_TECHNICAL_FACT, per the locked normalizationBasis rule).

---

#### FACTREQ-resistivity-si-unit

**SOURCE:**
src-cg-2365-02-handbook-v1-12 -- page 26, AC2.2 ("identify and determine values of base and derived SI units which apply specifically to electrical quantities")

**RAW:**
> AC2.2: "identify and determine values of base and derived SI units which apply specifically to electrical quantities". Range item: "Resistivity".

**PROPOSAL:**
CandidateFactRequirement -- `{"targetCandidateKey":"electrical-quantity-si-unit--resistivity::DEFINE","claimKey":"resistivity-si-unit","derivationStatus":"EXPLICIT_CURRICULUM_FACT"}`

**CONFIDENCE:**
EXPLICIT

**RATIONALE:**
AC2.2's own wording ("identify and determine values of base and derived SI units which apply specifically to electrical quantities") explicitly requires knowing the SI unit VALUE for each Range-named quantity, not merely that the quantity exists -- this is the "determine values of ... units" clause itself, satisfying task section 16's EXPLICIT_CURRICULUM_FACT bar (never AUTHORITATIVE_TECHNICAL_FACT, per the locked normalizationBasis rule).

---

#### FACTREQ-power-si-unit

**SOURCE:**
src-cg-2365-02-handbook-v1-12 -- page 26, AC2.2 ("identify and determine values of base and derived SI units which apply specifically to electrical quantities")

**RAW:**
> AC2.2: "identify and determine values of base and derived SI units which apply specifically to electrical quantities". Range item: "Power".

**PROPOSAL:**
CandidateFactRequirement -- `{"targetCandidateKey":"electrical-quantity-si-unit--power::DEFINE","claimKey":"power-si-unit","derivationStatus":"EXPLICIT_CURRICULUM_FACT"}`

**CONFIDENCE:**
EXPLICIT

**RATIONALE:**
AC2.2's own wording ("identify and determine values of base and derived SI units which apply specifically to electrical quantities") explicitly requires knowing the SI unit VALUE for each Range-named quantity, not merely that the quantity exists -- this is the "determine values of ... units" clause itself, satisfying task section 16's EXPLICIT_CURRICULUM_FACT bar (never AUTHORITATIVE_TECHNICAL_FACT, per the locked normalizationBasis rule).

---

#### FACTREQ-frequency-si-unit

**SOURCE:**
src-cg-2365-02-handbook-v1-12 -- page 26, AC2.2 ("identify and determine values of base and derived SI units which apply specifically to electrical quantities")

**RAW:**
> AC2.2: "identify and determine values of base and derived SI units which apply specifically to electrical quantities". Range item: "Frequency".

**PROPOSAL:**
CandidateFactRequirement -- `{"targetCandidateKey":"electrical-quantity-si-unit--frequency::DEFINE","claimKey":"frequency-si-unit","derivationStatus":"EXPLICIT_CURRICULUM_FACT"}`

**CONFIDENCE:**
EXPLICIT

**RATIONALE:**
AC2.2's own wording ("identify and determine values of base and derived SI units which apply specifically to electrical quantities") explicitly requires knowing the SI unit VALUE for each Range-named quantity, not merely that the quantity exists -- this is the "determine values of ... units" clause itself, satisfying task section 16's EXPLICIT_CURRICULUM_FACT bar (never AUTHORITATIVE_TECHNICAL_FACT, per the locked normalizationBasis rule).

---

#### FACTREQ-current-si-unit

**SOURCE:**
src-cg-2365-02-handbook-v1-12 -- page 26, AC2.2 ("identify and determine values of base and derived SI units which apply specifically to electrical quantities")

**RAW:**
> AC2.2: "identify and determine values of base and derived SI units which apply specifically to electrical quantities". Range item: "Current".

**PROPOSAL:**
CandidateFactRequirement -- `{"targetCandidateKey":"electrical-quantity-si-unit--current::DEFINE","claimKey":"current-si-unit","derivationStatus":"EXPLICIT_CURRICULUM_FACT"}`

**CONFIDENCE:**
EXPLICIT

**RATIONALE:**
AC2.2's own wording ("identify and determine values of base and derived SI units which apply specifically to electrical quantities") explicitly requires knowing the SI unit VALUE for each Range-named quantity, not merely that the quantity exists -- this is the "determine values of ... units" clause itself, satisfying task section 16's EXPLICIT_CURRICULUM_FACT bar (never AUTHORITATIVE_TECHNICAL_FACT, per the locked normalizationBasis rule).

---

#### FACTREQ-voltage-si-unit

**SOURCE:**
src-cg-2365-02-handbook-v1-12 -- page 26, AC2.2 ("identify and determine values of base and derived SI units which apply specifically to electrical quantities")

**RAW:**
> AC2.2: "identify and determine values of base and derived SI units which apply specifically to electrical quantities". Range item: "Voltage".

**PROPOSAL:**
CandidateFactRequirement -- `{"targetCandidateKey":"electrical-quantity-si-unit--voltage::DEFINE","claimKey":"voltage-si-unit","derivationStatus":"EXPLICIT_CURRICULUM_FACT"}`

**CONFIDENCE:**
EXPLICIT

**RATIONALE:**
AC2.2's own wording ("identify and determine values of base and derived SI units which apply specifically to electrical quantities") explicitly requires knowing the SI unit VALUE for each Range-named quantity, not merely that the quantity exists -- this is the "determine values of ... units" clause itself, satisfying task section 16's EXPLICIT_CURRICULUM_FACT bar (never AUTHORITATIVE_TECHNICAL_FACT, per the locked normalizationBasis rule).

---

#### FACTREQ-energy-si-unit

**SOURCE:**
src-cg-2365-02-handbook-v1-12 -- page 26, AC2.2 ("identify and determine values of base and derived SI units which apply specifically to electrical quantities")

**RAW:**
> AC2.2: "identify and determine values of base and derived SI units which apply specifically to electrical quantities". Range item: "Energy".

**PROPOSAL:**
CandidateFactRequirement -- `{"targetCandidateKey":"electrical-quantity-si-unit--energy::DEFINE","claimKey":"energy-si-unit","derivationStatus":"EXPLICIT_CURRICULUM_FACT"}`

**CONFIDENCE:**
EXPLICIT

**RATIONALE:**
AC2.2's own wording ("identify and determine values of base and derived SI units which apply specifically to electrical quantities") explicitly requires knowing the SI unit VALUE for each Range-named quantity, not merely that the quantity exists -- this is the "determine values of ... units" clause itself, satisfying task section 16's EXPLICIT_CURRICULUM_FACT bar (never AUTHORITATIVE_TECHNICAL_FACT, per the locked normalizationBasis rule).

---

#### FACTREQ-impedance-si-unit

**SOURCE:**
src-cg-2365-02-handbook-v1-12 -- page 26, AC2.2 ("identify and determine values of base and derived SI units which apply specifically to electrical quantities")

**RAW:**
> AC2.2: "identify and determine values of base and derived SI units which apply specifically to electrical quantities". Range item: "Impedance".

**PROPOSAL:**
CandidateFactRequirement -- `{"targetCandidateKey":"electrical-quantity-si-unit--impedance::DEFINE","claimKey":"impedance-si-unit","derivationStatus":"EXPLICIT_CURRICULUM_FACT"}`

**CONFIDENCE:**
EXPLICIT

**RATIONALE:**
AC2.2's own wording ("identify and determine values of base and derived SI units which apply specifically to electrical quantities") explicitly requires knowing the SI unit VALUE for each Range-named quantity, not merely that the quantity exists -- this is the "determine values of ... units" clause itself, satisfying task section 16's EXPLICIT_CURRICULUM_FACT bar (never AUTHORITATIVE_TECHNICAL_FACT, per the locked normalizationBasis rule).

---

#### FACTREQ-inductance-si-unit

**SOURCE:**
src-cg-2365-02-handbook-v1-12 -- page 26, AC2.2 ("identify and determine values of base and derived SI units which apply specifically to electrical quantities")

**RAW:**
> AC2.2: "identify and determine values of base and derived SI units which apply specifically to electrical quantities". Range item: "Inductance and inductive reactance (split; this claim covers the Inductance half)".

**PROPOSAL:**
CandidateFactRequirement -- `{"targetCandidateKey":"electrical-quantity-si-unit--inductance::DEFINE","claimKey":"inductance-si-unit","derivationStatus":"EXPLICIT_CURRICULUM_FACT"}`

**CONFIDENCE:**
EXPLICIT

**RATIONALE:**
AC2.2's own wording ("identify and determine values of base and derived SI units which apply specifically to electrical quantities") explicitly requires knowing the SI unit VALUE for each Range-named quantity, not merely that the quantity exists -- this is the "determine values of ... units" clause itself, satisfying task section 16's EXPLICIT_CURRICULUM_FACT bar (never AUTHORITATIVE_TECHNICAL_FACT, per the locked normalizationBasis rule).

---

#### FACTREQ-inductive-reactance-si-unit

**SOURCE:**
src-cg-2365-02-handbook-v1-12 -- page 26, AC2.2 ("identify and determine values of base and derived SI units which apply specifically to electrical quantities")

**RAW:**
> AC2.2: "identify and determine values of base and derived SI units which apply specifically to electrical quantities". Range item: "Inductance and inductive reactance (split; this claim covers the inductive-reactance half)".

**PROPOSAL:**
CandidateFactRequirement -- `{"targetCandidateKey":"electrical-quantity-si-unit--inductive-reactance::DEFINE","claimKey":"inductive-reactance-si-unit","derivationStatus":"EXPLICIT_CURRICULUM_FACT"}`

**CONFIDENCE:**
EXPLICIT

**RATIONALE:**
AC2.2's own wording ("identify and determine values of base and derived SI units which apply specifically to electrical quantities") explicitly requires knowing the SI unit VALUE for each Range-named quantity, not merely that the quantity exists -- this is the "determine values of ... units" clause itself, satisfying task section 16's EXPLICIT_CURRICULUM_FACT bar (never AUTHORITATIVE_TECHNICAL_FACT, per the locked normalizationBasis rule).

---

#### FACTREQ-capacitance-si-unit

**SOURCE:**
src-cg-2365-02-handbook-v1-12 -- page 26, AC2.2 ("identify and determine values of base and derived SI units which apply specifically to electrical quantities")

**RAW:**
> AC2.2: "identify and determine values of base and derived SI units which apply specifically to electrical quantities". Range item: "Capacitance and capacitive reactance (split; this claim covers the Capacitance half)".

**PROPOSAL:**
CandidateFactRequirement -- `{"targetCandidateKey":"electrical-quantity-si-unit--capacitance::DEFINE","claimKey":"capacitance-si-unit","derivationStatus":"EXPLICIT_CURRICULUM_FACT"}`

**CONFIDENCE:**
EXPLICIT

**RATIONALE:**
AC2.2's own wording ("identify and determine values of base and derived SI units which apply specifically to electrical quantities") explicitly requires knowing the SI unit VALUE for each Range-named quantity, not merely that the quantity exists -- this is the "determine values of ... units" clause itself, satisfying task section 16's EXPLICIT_CURRICULUM_FACT bar (never AUTHORITATIVE_TECHNICAL_FACT, per the locked normalizationBasis rule).

---

#### FACTREQ-capacitive-reactance-si-unit

**SOURCE:**
src-cg-2365-02-handbook-v1-12 -- page 26, AC2.2 ("identify and determine values of base and derived SI units which apply specifically to electrical quantities")

**RAW:**
> AC2.2: "identify and determine values of base and derived SI units which apply specifically to electrical quantities". Range item: "Capacitance and capacitive reactance (split; this claim covers the capacitive-reactance half)".

**PROPOSAL:**
CandidateFactRequirement -- `{"targetCandidateKey":"electrical-quantity-si-unit--capacitive-reactance::DEFINE","claimKey":"capacitive-reactance-si-unit","derivationStatus":"EXPLICIT_CURRICULUM_FACT"}`

**CONFIDENCE:**
EXPLICIT

**RATIONALE:**
AC2.2's own wording ("identify and determine values of base and derived SI units which apply specifically to electrical quantities") explicitly requires knowing the SI unit VALUE for each Range-named quantity, not merely that the quantity exists -- this is the "determine values of ... units" clause itself, satisfying task section 16's EXPLICIT_CURRICULUM_FACT bar (never AUTHORITATIVE_TECHNICAL_FACT, per the locked normalizationBasis rule).

---

#### FACTREQ-power-factor-si-unit

**SOURCE:**
src-cg-2365-02-handbook-v1-12 -- page 26, AC2.2 ("identify and determine values of base and derived SI units which apply specifically to electrical quantities")

**RAW:**
> AC2.2: "identify and determine values of base and derived SI units which apply specifically to electrical quantities". Range item: "Power factor".

**PROPOSAL:**
CandidateFactRequirement -- `{"targetCandidateKey":"electrical-quantity-si-unit--power-factor::DEFINE","claimKey":"power-factor-si-unit","derivationStatus":"EXPLICIT_CURRICULUM_FACT"}`

**CONFIDENCE:**
EXPLICIT

**RATIONALE:**
AC2.2's own wording ("identify and determine values of base and derived SI units which apply specifically to electrical quantities") explicitly requires knowing the SI unit VALUE for each Range-named quantity, not merely that the quantity exists -- this is the "determine values of ... units" clause itself, satisfying task section 16's EXPLICIT_CURRICULUM_FACT bar (never AUTHORITATIVE_TECHNICAL_FACT, per the locked normalizationBasis rule).

---

### LO2.AC3

#### OCU-U202-LO2-AC3

**SOURCE:**
src-cg-2365-02-handbook-v1-12 -- page 26, Unit 202, Learning outcome 2, Assessment criteria 3

**RAW:**
> Learning outcome: The learner will: 2. Understand standard units of measurement used in electrical installation, maintenance and design work. Assessment criteria: The learner can: 3. identify appropriate electrical instruments for the measurement of different electrical quantities

**PROPOSAL:**
OfficialCurriculumUnit -- `{"curriculumUnitId":"U202-LO2-AC3","officialWording":"identify appropriate electrical instruments for the measurement of different electrical quantities"}`

**CONFIDENCE:**
EXPLICIT

**RATIONALE:**
Registry entry transcribed verbatim from the handbook's own Learning outcome / Assessment criteria table for Unit 202, page 26. curriculumUnitId is a CC-19A-assigned mapping key (U202-LO2-AC3), not itself official wording.

---

#### CE-067-U202-LO2-AC3-PRIMARY-IDENTIFY

**SOURCE:**
src-cg-2365-02-handbook-v1-12 -- page 26, Unit 202, AC2.3

**RAW:**
> The learner can: 3. identify appropriate electrical instruments for the measurement of different electrical quantities

**PROPOSAL:**
CurriculumEvidence / PRIMARY_REQUIREMENT -- `{"subject":"electrical-instruments-for-measurement","curriculumUnitId":"U202-LO2-AC3","commandVerbPerformanceType":"IDENTIFY"}`

**CONFIDENCE:**
EXPLICIT

**RATIONALE:**
AC2.3 reads "identify appropriate electrical instruments for the measurement of different electrical quantities" -- single explicit verb IDENTIFY.

---

#### CE-069-U202-LO2-AC3-RANGE-electrical-instrument-for-measuring--resistance-IDENTIFY

**SOURCE:**
src-cg-2365-02-handbook-v1-12 -- page 26, Unit 202, Range under AC2.3 ("Electrical quantities (measurement):")

**RAW:**
> Range: Electrical quantities (measurement): Resistance.

**PROPOSAL:**
CurriculumEvidence / RANGE_REQUIRED_MEMBER -- `{"subject":"electrical-instrument-for-measuring--resistance","curriculumUnitId":"U202-LO2-AC3","commandVerbPerformanceType":"IDENTIFY"}`

**CONFIDENCE:**
STRONG_INFERENCE

**RATIONALE:**
"Resistance" is an explicit member of the "Electrical quantities (measurement):" Range list under AC2.3. Performance type IDENTIFY is inherited from the parent AC's own command verb (the Range table itself carries no separate verb per item) -- an inference from Range structure, not a second literal verb, hence STRONG_INFERENCE rather than EXPLICIT.

---

#### CE-071-U202-LO2-AC3-RANGE-electrical-instrument-for-measuring--power-IDENTIFY

**SOURCE:**
src-cg-2365-02-handbook-v1-12 -- page 26, Unit 202, Range under AC2.3 ("Electrical quantities (measurement):")

**RAW:**
> Range: Electrical quantities (measurement): Power.

**PROPOSAL:**
CurriculumEvidence / RANGE_REQUIRED_MEMBER -- `{"subject":"electrical-instrument-for-measuring--power","curriculumUnitId":"U202-LO2-AC3","commandVerbPerformanceType":"IDENTIFY"}`

**CONFIDENCE:**
STRONG_INFERENCE

**RATIONALE:**
"Power" is an explicit member of the "Electrical quantities (measurement):" Range list under AC2.3. Performance type IDENTIFY is inherited from the parent AC's own command verb (the Range table itself carries no separate verb per item) -- an inference from Range structure, not a second literal verb, hence STRONG_INFERENCE rather than EXPLICIT.

---

#### CE-073-U202-LO2-AC3-RANGE-electrical-instrument-for-measuring--current-IDENTIFY

**SOURCE:**
src-cg-2365-02-handbook-v1-12 -- page 26, Unit 202, Range under AC2.3 ("Electrical quantities (measurement):")

**RAW:**
> Range: Electrical quantities (measurement): Current.

**PROPOSAL:**
CurriculumEvidence / RANGE_REQUIRED_MEMBER -- `{"subject":"electrical-instrument-for-measuring--current","curriculumUnitId":"U202-LO2-AC3","commandVerbPerformanceType":"IDENTIFY"}`

**CONFIDENCE:**
STRONG_INFERENCE

**RATIONALE:**
"Current" is an explicit member of the "Electrical quantities (measurement):" Range list under AC2.3. Performance type IDENTIFY is inherited from the parent AC's own command verb (the Range table itself carries no separate verb per item) -- an inference from Range structure, not a second literal verb, hence STRONG_INFERENCE rather than EXPLICIT.

---

#### CE-075-U202-LO2-AC3-RANGE-electrical-instrument-for-measuring--voltage-IDENTIFY

**SOURCE:**
src-cg-2365-02-handbook-v1-12 -- page 26, Unit 202, Range under AC2.3 ("Electrical quantities (measurement):")

**RAW:**
> Range: Electrical quantities (measurement): Voltage.

**PROPOSAL:**
CurriculumEvidence / RANGE_REQUIRED_MEMBER -- `{"subject":"electrical-instrument-for-measuring--voltage","curriculumUnitId":"U202-LO2-AC3","commandVerbPerformanceType":"IDENTIFY"}`

**CONFIDENCE:**
STRONG_INFERENCE

**RATIONALE:**
"Voltage" is an explicit member of the "Electrical quantities (measurement):" Range list under AC2.3. Performance type IDENTIFY is inherited from the parent AC's own command verb (the Range table itself carries no separate verb per item) -- an inference from Range structure, not a second literal verb, hence STRONG_INFERENCE rather than EXPLICIT.

---

#### CE-077-U202-LO2-AC3-RANGE-electrical-instrument-for-measuring--energy-IDENTIFY

**SOURCE:**
src-cg-2365-02-handbook-v1-12 -- page 26, Unit 202, Range under AC2.3 ("Electrical quantities (measurement):")

**RAW:**
> Range: Electrical quantities (measurement): Energy.

**PROPOSAL:**
CurriculumEvidence / RANGE_REQUIRED_MEMBER -- `{"subject":"electrical-instrument-for-measuring--energy","curriculumUnitId":"U202-LO2-AC3","commandVerbPerformanceType":"IDENTIFY"}`

**CONFIDENCE:**
STRONG_INFERENCE

**RATIONALE:**
"Energy" is an explicit member of the "Electrical quantities (measurement):" Range list under AC2.3. Performance type IDENTIFY is inherited from the parent AC's own command verb (the Range table itself carries no separate verb per item) -- an inference from Range structure, not a second literal verb, hence STRONG_INFERENCE rather than EXPLICIT.

---

### LO3.AC1

#### OCU-U202-LO3-AC1

**SOURCE:**
src-cg-2365-02-handbook-v1-12 -- page 27, Unit 202, Learning outcome 3, Assessment criteria 1

**RAW:**
> Learning outcome: The learner will: 3. Understand basic mechanics and the relationship between force, work, energy and power. Assessment criteria: The learner can: 1. specify what is meant by mass and weight

**PROPOSAL:**
OfficialCurriculumUnit -- `{"curriculumUnitId":"U202-LO3-AC1","officialWording":"specify what is meant by mass and weight"}`

**CONFIDENCE:**
EXPLICIT

**RATIONALE:**
Registry entry transcribed verbatim from the handbook's own Learning outcome / Assessment criteria table for Unit 202, page 27. curriculumUnitId is a CC-19A-assigned mapping key (U202-LO3-AC1), not itself official wording.

---

#### CE-079-U202-LO3-AC1-PRIMARY-DEFINE

**SOURCE:**
src-cg-2365-02-handbook-v1-12 -- page 27, Unit 202, AC3.1

**RAW:**
> The learner can: 1. specify what is meant by mass and weight

**PROPOSAL:**
CurriculumEvidence / PRIMARY_REQUIREMENT -- `{"subject":"mass-and-weight","curriculumUnitId":"U202-LO3-AC1","commandVerbPerformanceType":"DEFINE"}`

**CONFIDENCE:**
EXPLICIT

**RATIONALE:**
AC3.1 reads "specify what is meant by mass and weight" -- "specify what is meant by" is normalized to DEFINE.

---

### LO3.AC2

#### OCU-U202-LO3-AC2

**SOURCE:**
src-cg-2365-02-handbook-v1-12 -- page 27, Unit 202, Learning outcome 3, Assessment criteria 2

**RAW:**
> Learning outcome: The learner will: 3. Understand basic mechanics and the relationship between force, work, energy and power. Assessment criteria: The learner can: 2. explain the principles of basic mechanics as they apply to levers, gears and pulleys

**PROPOSAL:**
OfficialCurriculumUnit -- `{"curriculumUnitId":"U202-LO3-AC2","officialWording":"explain the principles of basic mechanics as they apply to levers, gears and pulleys"}`

**CONFIDENCE:**
EXPLICIT

**RATIONALE:**
Registry entry transcribed verbatim from the handbook's own Learning outcome / Assessment criteria table for Unit 202, page 27. curriculumUnitId is a CC-19A-assigned mapping key (U202-LO3-AC2), not itself official wording.

---

#### CE-081-U202-LO3-AC2-PRIMARY-EXPLAIN

**SOURCE:**
src-cg-2365-02-handbook-v1-12 -- page 27, Unit 202, AC3.2

**RAW:**
> The learner can: 2. explain the principles of basic mechanics as they apply to levers, gears and pulleys

**PROPOSAL:**
CurriculumEvidence / PRIMARY_REQUIREMENT -- `{"subject":"basic-mechanics-of-levers-gears-and-pulleys","curriculumUnitId":"U202-LO3-AC2","commandVerbPerformanceType":"EXPLAIN"}`

**CONFIDENCE:**
EXPLICIT

**RATIONALE:**
AC3.2 reads "explain the principles of basic mechanics as they apply to levers, gears and pulleys" -- explicit verb EXPLAIN.

---

#### CE-083-U202-LO3-AC2-RANGE-lever-class--class-i-EXPLAIN

**SOURCE:**
src-cg-2365-02-handbook-v1-12 -- page 27, Unit 202, Range under AC3.2 ("Levers:")

**RAW:**
> Range: Levers: class I.

**PROPOSAL:**
CurriculumEvidence / RANGE_REQUIRED_MEMBER -- `{"subject":"lever-class--class-i","curriculumUnitId":"U202-LO3-AC2","commandVerbPerformanceType":"EXPLAIN"}`

**CONFIDENCE:**
STRONG_INFERENCE

**RATIONALE:**
"class I" is an explicit member of the "Levers:" Range list under AC3.2. Performance type EXPLAIN is inherited from the parent AC's own command verb (the Range table itself carries no separate verb per item) -- an inference from Range structure, not a second literal verb, hence STRONG_INFERENCE rather than EXPLICIT.

---

#### CE-085-U202-LO3-AC2-RANGE-lever-class--class-ii-EXPLAIN

**SOURCE:**
src-cg-2365-02-handbook-v1-12 -- page 27, Unit 202, Range under AC3.2 ("Levers:")

**RAW:**
> Range: Levers: class II.

**PROPOSAL:**
CurriculumEvidence / RANGE_REQUIRED_MEMBER -- `{"subject":"lever-class--class-ii","curriculumUnitId":"U202-LO3-AC2","commandVerbPerformanceType":"EXPLAIN"}`

**CONFIDENCE:**
STRONG_INFERENCE

**RATIONALE:**
"class II" is an explicit member of the "Levers:" Range list under AC3.2. Performance type EXPLAIN is inherited from the parent AC's own command verb (the Range table itself carries no separate verb per item) -- an inference from Range structure, not a second literal verb, hence STRONG_INFERENCE rather than EXPLICIT.

---

#### CE-087-U202-LO3-AC2-RANGE-lever-class--class-iii-EXPLAIN

**SOURCE:**
src-cg-2365-02-handbook-v1-12 -- page 27, Unit 202, Range under AC3.2 ("Levers:")

**RAW:**
> Range: Levers: class III.

**PROPOSAL:**
CurriculumEvidence / RANGE_REQUIRED_MEMBER -- `{"subject":"lever-class--class-iii","curriculumUnitId":"U202-LO3-AC2","commandVerbPerformanceType":"EXPLAIN"}`

**CONFIDENCE:**
STRONG_INFERENCE

**RATIONALE:**
"class III" is an explicit member of the "Levers:" Range list under AC3.2. Performance type EXPLAIN is inherited from the parent AC's own command verb (the Range table itself carries no separate verb per item) -- an inference from Range structure, not a second literal verb, hence STRONG_INFERENCE rather than EXPLICIT.

---

### LO3.AC3

#### OCU-U202-LO3-AC3

**SOURCE:**
src-cg-2365-02-handbook-v1-12 -- page 27, Unit 202, Learning outcome 3, Assessment criteria 3

**RAW:**
> Learning outcome: The learner will: 3. Understand basic mechanics and the relationship between force, work, energy and power. Assessment criteria: The learner can: 3. describe the main principles of the following and their inter-relationships: a. force b. work c. energy (kinetic and potential) d. power e. efficiency

**PROPOSAL:**
OfficialCurriculumUnit -- `{"curriculumUnitId":"U202-LO3-AC3","officialWording":"describe the main principles of the following and their inter-relationships: a. force b. work c. energy (kinetic and potential) d. power e. efficiency"}`

**CONFIDENCE:**
EXPLICIT

**RATIONALE:**
Registry entry transcribed verbatim from the handbook's own Learning outcome / Assessment criteria table for Unit 202, page 27. curriculumUnitId is a CC-19A-assigned mapping key (U202-LO3-AC3), not itself official wording.

---

#### CE-089-U202-LO3-AC3-PRIMARY-DESCRIBE

**SOURCE:**
src-cg-2365-02-handbook-v1-12 -- page 27, Unit 202, AC3.3

**RAW:**
> The learner can: 3. describe the main principles of the following and their inter-relationships: a. force b. work c. energy (kinetic and potential) d. power e. efficiency

**PROPOSAL:**
CurriculumEvidence / PRIMARY_REQUIREMENT -- `{"subject":"force-work-energy-power-efficiency-interrelationships","curriculumUnitId":"U202-LO3-AC3","commandVerbPerformanceType":"DESCRIBE"}`

**CONFIDENCE:**
EXPLICIT

**RATIONALE:**
AC3.3 reads "describe the main principles of the following and their inter-relationships" -- explicit verb DESCRIBE.

---

#### CE-091-U202-LO3-AC3-RANGE-mechanics-principle--force-DESCRIBE

**SOURCE:**
src-cg-2365-02-handbook-v1-12 -- page 27, Unit 202, Range under AC3.3 ("(AC3.3's own lettered sub-list, not a formal Range table)")

**RAW:**
> Range: (AC3.3's own lettered sub-list, not a formal Range table) force.

**PROPOSAL:**
CurriculumEvidence / RANGE_REQUIRED_MEMBER -- `{"subject":"mechanics-principle--force","curriculumUnitId":"U202-LO3-AC3","commandVerbPerformanceType":"DESCRIBE"}`

**CONFIDENCE:**
EXPLICIT

**RATIONALE:**
"force" is one of AC3.3's own literal lettered sub-clauses (a-e), not a separate formal "Range" box -- functionally equivalent to an explicit Range member (a named, individually assessable sub-topic of one AC), so normalized as RANGE_REQUIRED_MEMBER, but EXPLICIT confidence since the wording is verbatim AC text, not a Range-structure inference.

---

#### CE-093-U202-LO3-AC3-RANGE-mechanics-principle--work-DESCRIBE

**SOURCE:**
src-cg-2365-02-handbook-v1-12 -- page 27, Unit 202, Range under AC3.3 ("(AC3.3's own lettered sub-list, not a formal Range table)")

**RAW:**
> Range: (AC3.3's own lettered sub-list, not a formal Range table) work.

**PROPOSAL:**
CurriculumEvidence / RANGE_REQUIRED_MEMBER -- `{"subject":"mechanics-principle--work","curriculumUnitId":"U202-LO3-AC3","commandVerbPerformanceType":"DESCRIBE"}`

**CONFIDENCE:**
EXPLICIT

**RATIONALE:**
"work" is one of AC3.3's own literal lettered sub-clauses (a-e), not a separate formal "Range" box -- functionally equivalent to an explicit Range member (a named, individually assessable sub-topic of one AC), so normalized as RANGE_REQUIRED_MEMBER, but EXPLICIT confidence since the wording is verbatim AC text, not a Range-structure inference.

---

#### CE-095-U202-LO3-AC3-RANGE-mechanics-principle--energy-kinetic-and-potential-DESCRIBE

**SOURCE:**
src-cg-2365-02-handbook-v1-12 -- page 27, Unit 202, Range under AC3.3 ("(AC3.3's own lettered sub-list, not a formal Range table)")

**RAW:**
> Range: (AC3.3's own lettered sub-list, not a formal Range table) energy (kinetic and potential).

**PROPOSAL:**
CurriculumEvidence / RANGE_REQUIRED_MEMBER -- `{"subject":"mechanics-principle--energy-kinetic-and-potential","curriculumUnitId":"U202-LO3-AC3","commandVerbPerformanceType":"DESCRIBE"}`

**CONFIDENCE:**
EXPLICIT

**RATIONALE:**
"energy (kinetic and potential)" is one of AC3.3's own literal lettered sub-clauses (a-e), not a separate formal "Range" box -- functionally equivalent to an explicit Range member (a named, individually assessable sub-topic of one AC), so normalized as RANGE_REQUIRED_MEMBER, but EXPLICIT confidence since the wording is verbatim AC text, not a Range-structure inference.

---

#### CE-097-U202-LO3-AC3-RANGE-mechanics-principle--power-DESCRIBE

**SOURCE:**
src-cg-2365-02-handbook-v1-12 -- page 27, Unit 202, Range under AC3.3 ("(AC3.3's own lettered sub-list, not a formal Range table)")

**RAW:**
> Range: (AC3.3's own lettered sub-list, not a formal Range table) power.

**PROPOSAL:**
CurriculumEvidence / RANGE_REQUIRED_MEMBER -- `{"subject":"mechanics-principle--power","curriculumUnitId":"U202-LO3-AC3","commandVerbPerformanceType":"DESCRIBE"}`

**CONFIDENCE:**
EXPLICIT

**RATIONALE:**
"power" is one of AC3.3's own literal lettered sub-clauses (a-e), not a separate formal "Range" box -- functionally equivalent to an explicit Range member (a named, individually assessable sub-topic of one AC), so normalized as RANGE_REQUIRED_MEMBER, but EXPLICIT confidence since the wording is verbatim AC text, not a Range-structure inference.

---

#### CE-099-U202-LO3-AC3-RANGE-mechanics-principle--efficiency-DESCRIBE

**SOURCE:**
src-cg-2365-02-handbook-v1-12 -- page 27, Unit 202, Range under AC3.3 ("(AC3.3's own lettered sub-list, not a formal Range table)")

**RAW:**
> Range: (AC3.3's own lettered sub-list, not a formal Range table) efficiency.

**PROPOSAL:**
CurriculumEvidence / RANGE_REQUIRED_MEMBER -- `{"subject":"mechanics-principle--efficiency","curriculumUnitId":"U202-LO3-AC3","commandVerbPerformanceType":"DESCRIBE"}`

**CONFIDENCE:**
EXPLICIT

**RATIONALE:**
"efficiency" is one of AC3.3's own literal lettered sub-clauses (a-e), not a separate formal "Range" box -- functionally equivalent to an explicit Range member (a named, individually assessable sub-topic of one AC), so normalized as RANGE_REQUIRED_MEMBER, but EXPLICIT confidence since the wording is verbatim AC text, not a Range-structure inference.

---

### LO3.AC4

#### OCU-U202-LO3-AC4

**SOURCE:**
src-cg-2365-02-handbook-v1-12 -- page 27, Unit 202, Learning outcome 3, Assessment criteria 4

**RAW:**
> Learning outcome: The learner will: 3. Understand basic mechanics and the relationship between force, work, energy and power. Assessment criteria: The learner can: 4. calculate values of mechanical energy, power and efficiency

**PROPOSAL:**
OfficialCurriculumUnit -- `{"curriculumUnitId":"U202-LO3-AC4","officialWording":"calculate values of mechanical energy, power and efficiency"}`

**CONFIDENCE:**
EXPLICIT

**RATIONALE:**
Registry entry transcribed verbatim from the handbook's own Learning outcome / Assessment criteria table for Unit 202, page 27. curriculumUnitId is a CC-19A-assigned mapping key (U202-LO3-AC4), not itself official wording.

---

#### CE-101-U202-LO3-AC4-PRIMARY-CALCULATE

**SOURCE:**
src-cg-2365-02-handbook-v1-12 -- page 27, Unit 202, AC3.4

**RAW:**
> The learner can: 4. calculate values of mechanical energy, power and efficiency

**PROPOSAL:**
CurriculumEvidence / PRIMARY_REQUIREMENT -- `{"subject":"mechanical-energy-power-and-efficiency-calculation","curriculumUnitId":"U202-LO3-AC4","commandVerbPerformanceType":"CALCULATE"}`

**CONFIDENCE:**
EXPLICIT

**RATIONALE:**
AC3.4 reads "calculate values of mechanical energy, power and efficiency" -- explicit verb CALCULATE.

---

### LO4.AC1

#### OCU-U202-LO4-AC1

**SOURCE:**
src-cg-2365-02-handbook-v1-12 -- page 27, Unit 202, Learning outcome 4, Assessment criteria 1

**RAW:**
> Learning outcome: The learner will: 4. Understand the relationship between resistance, resistivity, voltage, current and power. Assessment criteria: The learner can: 1. describe the basic principles of electron theory

**PROPOSAL:**
OfficialCurriculumUnit -- `{"curriculumUnitId":"U202-LO4-AC1","officialWording":"describe the basic principles of electron theory"}`

**CONFIDENCE:**
EXPLICIT

**RATIONALE:**
Registry entry transcribed verbatim from the handbook's own Learning outcome / Assessment criteria table for Unit 202, page 27. curriculumUnitId is a CC-19A-assigned mapping key (U202-LO4-AC1), not itself official wording.

---

#### CE-103-U202-LO4-AC1-PRIMARY-DESCRIBE

**SOURCE:**
src-cg-2365-02-handbook-v1-12 -- page 27, Unit 202, AC4.1

**RAW:**
> The learner can: 1. describe the basic principles of electron theory

**PROPOSAL:**
CurriculumEvidence / PRIMARY_REQUIREMENT -- `{"subject":"electron-theory-basic-principles","curriculumUnitId":"U202-LO4-AC1","commandVerbPerformanceType":"DESCRIBE"}`

**CONFIDENCE:**
EXPLICIT

**RATIONALE:**
AC4.1 reads "describe the basic principles of electron theory".

---

### LO4.AC2

#### OCU-U202-LO4-AC2

**SOURCE:**
src-cg-2365-02-handbook-v1-12 -- page 27, Unit 202, Learning outcome 4, Assessment criteria 2

**RAW:**
> Learning outcome: The learner will: 4. Understand the relationship between resistance, resistivity, voltage, current and power. Assessment criteria: The learner can: 2. identify and distinguish between materials which are good conductors and insulators

**PROPOSAL:**
OfficialCurriculumUnit -- `{"curriculumUnitId":"U202-LO4-AC2","officialWording":"identify and distinguish between materials which are good conductors and insulators"}`

**CONFIDENCE:**
EXPLICIT

**RATIONALE:**
Registry entry transcribed verbatim from the handbook's own Learning outcome / Assessment criteria table for Unit 202, page 27. curriculumUnitId is a CC-19A-assigned mapping key (U202-LO4-AC2), not itself official wording.

---

#### CE-105-U202-LO4-AC2-PRIMARY-IDENTIFY

**SOURCE:**
src-cg-2365-02-handbook-v1-12 -- page 27, Unit 202, AC4.2

**RAW:**
> The learner can: 2. identify and distinguish between materials which are good conductors and insulators

**PROPOSAL:**
CurriculumEvidence / PRIMARY_REQUIREMENT -- `{"subject":"conductors-and-insulators","curriculumUnitId":"U202-LO4-AC2","commandVerbPerformanceType":"IDENTIFY"}`

**CONFIDENCE:**
EXPLICIT

**RATIONALE:**
AC4.2 reads "identify and distinguish between materials which are good conductors and insulators" -- IDENTIFY is the first explicit verb.

---

#### CE-107-U202-LO4-AC2-PRIMARY-DISTINGUISH

**SOURCE:**
src-cg-2365-02-handbook-v1-12 -- page 27, Unit 202, AC4.2

**RAW:**
> The learner can: 2. identify and distinguish between materials which are good conductors and insulators

**PROPOSAL:**
CurriculumEvidence / PRIMARY_REQUIREMENT -- `{"subject":"conductors-and-insulators","curriculumUnitId":"U202-LO4-AC2","commandVerbPerformanceType":"DISTINGUISH"}`

**CONFIDENCE:**
EXPLICIT

**RATIONALE:**
AC4.2's second explicit verb is DISTINGUISH ("distinguish between").

---

### LO4.AC3

#### OCU-U202-LO4-AC3

**SOURCE:**
src-cg-2365-02-handbook-v1-12 -- page 27, Unit 202, Learning outcome 4, Assessment criteria 3

**RAW:**
> Learning outcome: The learner will: 4. Understand the relationship between resistance, resistivity, voltage, current and power. Assessment criteria: The learner can: 3. describe what is meant by resistance and resistivity in relation to electrical circuits

**PROPOSAL:**
OfficialCurriculumUnit -- `{"curriculumUnitId":"U202-LO4-AC3","officialWording":"describe what is meant by resistance and resistivity in relation to electrical circuits"}`

**CONFIDENCE:**
EXPLICIT

**RATIONALE:**
Registry entry transcribed verbatim from the handbook's own Learning outcome / Assessment criteria table for Unit 202, page 27. curriculumUnitId is a CC-19A-assigned mapping key (U202-LO4-AC3), not itself official wording.

---

#### CE-109-U202-LO4-AC3-PRIMARY-DESCRIBE

**SOURCE:**
src-cg-2365-02-handbook-v1-12 -- page 27, Unit 202, AC4.3

**RAW:**
> The learner can: 3. describe what is meant by resistance and resistivity in relation to electrical circuits

**PROPOSAL:**
CurriculumEvidence / PRIMARY_REQUIREMENT -- `{"subject":"resistance-and-resistivity-in-electrical-circuits","curriculumUnitId":"U202-LO4-AC3","commandVerbPerformanceType":"DESCRIBE"}`

**CONFIDENCE:**
EXPLICIT

**RATIONALE:**
AC4.3 reads "describe what is meant by resistance and resistivity in relation to electrical circuits".

---

### LO4.AC4

#### OCU-U202-LO4-AC4

**SOURCE:**
src-cg-2365-02-handbook-v1-12 -- page 27, Unit 202, Learning outcome 4, Assessment criteria 4

**RAW:**
> Learning outcome: The learner will: 4. Understand the relationship between resistance, resistivity, voltage, current and power. Assessment criteria: The learner can: 4. explain the relationship between current, voltage and resistance in parallel and series D.C. circuits

**PROPOSAL:**
OfficialCurriculumUnit -- `{"curriculumUnitId":"U202-LO4-AC4","officialWording":"explain the relationship between current, voltage and resistance in parallel and series D.C. circuits"}`

**CONFIDENCE:**
EXPLICIT

**RATIONALE:**
Registry entry transcribed verbatim from the handbook's own Learning outcome / Assessment criteria table for Unit 202, page 27. curriculumUnitId is a CC-19A-assigned mapping key (U202-LO4-AC4), not itself official wording.

---

#### CE-111-U202-LO4-AC4-PRIMARY-EXPLAIN

**SOURCE:**
src-cg-2365-02-handbook-v1-12 -- page 27, Unit 202, AC4.4

**RAW:**
> The learner can: 4. explain the relationship between current, voltage and resistance in parallel and series D.C. circuits

**PROPOSAL:**
CurriculumEvidence / PRIMARY_REQUIREMENT -- `{"subject":"current-voltage-resistance-relationship-series-parallel-dc","curriculumUnitId":"U202-LO4-AC4","commandVerbPerformanceType":"EXPLAIN"}`

**CONFIDENCE:**
EXPLICIT

**RATIONALE:**
AC4.4 reads "explain the relationship between current, voltage and resistance in parallel and series D.C. circuits".

---

### LO4.AC5

#### OCU-U202-LO4-AC5

**SOURCE:**
src-cg-2365-02-handbook-v1-12 -- page 27, Unit 202, Learning outcome 4, Assessment criteria 5

**RAW:**
> Learning outcome: The learner will: 4. Understand the relationship between resistance, resistivity, voltage, current and power. Assessment criteria: The learner can: 5. calculate the values of current, voltage and resistance in parallel and series D.C. circuits

**PROPOSAL:**
OfficialCurriculumUnit -- `{"curriculumUnitId":"U202-LO4-AC5","officialWording":"calculate the values of current, voltage and resistance in parallel and series D.C. circuits"}`

**CONFIDENCE:**
EXPLICIT

**RATIONALE:**
Registry entry transcribed verbatim from the handbook's own Learning outcome / Assessment criteria table for Unit 202, page 27. curriculumUnitId is a CC-19A-assigned mapping key (U202-LO4-AC5), not itself official wording.

---

#### CE-113-U202-LO4-AC5-PRIMARY-CALCULATE

**SOURCE:**
src-cg-2365-02-handbook-v1-12 -- page 27, Unit 202, AC4.5

**RAW:**
> The learner can: 5. calculate the values of current, voltage and resistance in parallel and series D.C. circuits

**PROPOSAL:**
CurriculumEvidence / PRIMARY_REQUIREMENT -- `{"subject":"current-voltage-resistance-calculation-series-parallel-dc","curriculumUnitId":"U202-LO4-AC5","commandVerbPerformanceType":"CALCULATE"}`

**CONFIDENCE:**
EXPLICIT

**RATIONALE:**
AC4.5 reads "calculate the values of current, voltage and resistance in parallel and series D.C. circuits".

---

### LO4.AC6

#### OCU-U202-LO4-AC6

**SOURCE:**
src-cg-2365-02-handbook-v1-12 -- page 27, Unit 202, Learning outcome 4, Assessment criteria 6

**RAW:**
> Learning outcome: The learner will: 4. Understand the relationship between resistance, resistivity, voltage, current and power. Assessment criteria: The learner can: 6. calculate values of power in parallel and series D.C. circuits

**PROPOSAL:**
OfficialCurriculumUnit -- `{"curriculumUnitId":"U202-LO4-AC6","officialWording":"calculate values of power in parallel and series D.C. circuits"}`

**CONFIDENCE:**
EXPLICIT

**RATIONALE:**
Registry entry transcribed verbatim from the handbook's own Learning outcome / Assessment criteria table for Unit 202, page 27. curriculumUnitId is a CC-19A-assigned mapping key (U202-LO4-AC6), not itself official wording.

---

#### CE-115-U202-LO4-AC6-PRIMARY-CALCULATE

**SOURCE:**
src-cg-2365-02-handbook-v1-12 -- page 27, Unit 202, AC4.6

**RAW:**
> The learner can: 6. calculate values of power in parallel and series D.C. circuits

**PROPOSAL:**
CurriculumEvidence / PRIMARY_REQUIREMENT -- `{"subject":"power-calculation-series-parallel-dc","curriculumUnitId":"U202-LO4-AC6","commandVerbPerformanceType":"CALCULATE"}`

**CONFIDENCE:**
EXPLICIT

**RATIONALE:**
AC4.6 reads "calculate values of power in parallel and series D.C. circuits".

---

### LO4.AC7

#### OCU-U202-LO4-AC7

**SOURCE:**
src-cg-2365-02-handbook-v1-12 -- page 27, Unit 202, Learning outcome 4, Assessment criteria 7

**RAW:**
> Learning outcome: The learner will: 4. Understand the relationship between resistance, resistivity, voltage, current and power. Assessment criteria: The learner can: 7. state what is meant by the term voltage drop in relation to electrical circuits

**PROPOSAL:**
OfficialCurriculumUnit -- `{"curriculumUnitId":"U202-LO4-AC7","officialWording":"state what is meant by the term voltage drop in relation to electrical circuits"}`

**CONFIDENCE:**
EXPLICIT

**RATIONALE:**
Registry entry transcribed verbatim from the handbook's own Learning outcome / Assessment criteria table for Unit 202, page 27. curriculumUnitId is a CC-19A-assigned mapping key (U202-LO4-AC7), not itself official wording.

---

#### CE-117-U202-LO4-AC7-PRIMARY-STATE

**SOURCE:**
src-cg-2365-02-handbook-v1-12 -- page 27, Unit 202, AC4.7

**RAW:**
> The learner can: 7. state what is meant by the term voltage drop in relation to electrical circuits

**PROPOSAL:**
CurriculumEvidence / PRIMARY_REQUIREMENT -- `{"subject":"voltage-drop-meaning","curriculumUnitId":"U202-LO4-AC7","commandVerbPerformanceType":"STATE"}`

**CONFIDENCE:**
EXPLICIT

**RATIONALE:**
AC4.7 reads "state what is meant by the term voltage drop in relation to electrical circuits".

---

### LO4.AC8

#### OCU-U202-LO4-AC8

**SOURCE:**
src-cg-2365-02-handbook-v1-12 -- page 27, Unit 202, Learning outcome 4, Assessment criteria 8

**RAW:**
> Learning outcome: The learner will: 4. Understand the relationship between resistance, resistivity, voltage, current and power. Assessment criteria: The learner can: 8. describe the chemical and thermal effects of electric currents

**PROPOSAL:**
OfficialCurriculumUnit -- `{"curriculumUnitId":"U202-LO4-AC8","officialWording":"describe the chemical and thermal effects of electric currents"}`

**CONFIDENCE:**
EXPLICIT

**RATIONALE:**
Registry entry transcribed verbatim from the handbook's own Learning outcome / Assessment criteria table for Unit 202, page 27. curriculumUnitId is a CC-19A-assigned mapping key (U202-LO4-AC8), not itself official wording.

---

#### CE-119-U202-LO4-AC8-PRIMARY-DESCRIBE

**SOURCE:**
src-cg-2365-02-handbook-v1-12 -- page 27, Unit 202, AC4.8

**RAW:**
> The learner can: 8. describe the chemical and thermal effects of electric currents

**PROPOSAL:**
CurriculumEvidence / PRIMARY_REQUIREMENT -- `{"subject":"chemical-and-thermal-effects-of-electric-current","curriculumUnitId":"U202-LO4-AC8","commandVerbPerformanceType":"DESCRIBE"}`

**CONFIDENCE:**
EXPLICIT

**RATIONALE:**
AC4.8 reads "describe the chemical and thermal effects of electric currents".

---

### LO5.AC1

#### OCU-U202-LO5-AC1

**SOURCE:**
src-cg-2365-02-handbook-v1-12 -- page 28, Unit 202, Learning outcome 5, Assessment criteria 1

**RAW:**
> Learning outcome: The learner will: 5. Understand the fundamental principles which underpin the relationship between magnetism and electricity. Assessment criteria: The learner can: 1. describe the effects of magnetism in terms of attraction and repulsion

**PROPOSAL:**
OfficialCurriculumUnit -- `{"curriculumUnitId":"U202-LO5-AC1","officialWording":"describe the effects of magnetism in terms of attraction and repulsion"}`

**CONFIDENCE:**
EXPLICIT

**RATIONALE:**
Registry entry transcribed verbatim from the handbook's own Learning outcome / Assessment criteria table for Unit 202, page 28. curriculumUnitId is a CC-19A-assigned mapping key (U202-LO5-AC1), not itself official wording.

---

#### CE-121-U202-LO5-AC1-PRIMARY-DESCRIBE

**SOURCE:**
src-cg-2365-02-handbook-v1-12 -- page 28, Unit 202, AC5.1

**RAW:**
> The learner can: 1. describe the effects of magnetism in terms of attraction and repulsion

**PROPOSAL:**
CurriculumEvidence / PRIMARY_REQUIREMENT -- `{"subject":"magnetism-attraction-and-repulsion-effects","curriculumUnitId":"U202-LO5-AC1","commandVerbPerformanceType":"DESCRIBE"}`

**CONFIDENCE:**
EXPLICIT

**RATIONALE:**
AC5.1 reads "describe the effects of magnetism in terms of attraction and repulsion".

---

### LO5.AC2

#### OCU-U202-LO5-AC2

**SOURCE:**
src-cg-2365-02-handbook-v1-12 -- page 28, Unit 202, Learning outcome 5, Assessment criteria 2

**RAW:**
> Learning outcome: The learner will: 5. Understand the fundamental principles which underpin the relationship between magnetism and electricity. Assessment criteria: The learner can: 2. state the difference between magnetic flux and flux density

**PROPOSAL:**
OfficialCurriculumUnit -- `{"curriculumUnitId":"U202-LO5-AC2","officialWording":"state the difference between magnetic flux and flux density"}`

**CONFIDENCE:**
EXPLICIT

**RATIONALE:**
Registry entry transcribed verbatim from the handbook's own Learning outcome / Assessment criteria table for Unit 202, page 28. curriculumUnitId is a CC-19A-assigned mapping key (U202-LO5-AC2), not itself official wording.

---

#### CE-123-U202-LO5-AC2-PRIMARY-STATE

**SOURCE:**
src-cg-2365-02-handbook-v1-12 -- page 28, Unit 202, AC5.2

**RAW:**
> The learner can: 2. state the difference between magnetic flux and flux density

**PROPOSAL:**
CurriculumEvidence / PRIMARY_REQUIREMENT -- `{"subject":"magnetic-flux-vs-flux-density-difference","curriculumUnitId":"U202-LO5-AC2","commandVerbPerformanceType":"STATE"}`

**CONFIDENCE:**
EXPLICIT

**RATIONALE:**
AC5.2 reads "state the difference between magnetic flux and flux density" -- literal verb STATE.

---

### LO5.AC3

#### OCU-U202-LO5-AC3

**SOURCE:**
src-cg-2365-02-handbook-v1-12 -- page 28, Unit 202, Learning outcome 5, Assessment criteria 3

**RAW:**
> Learning outcome: The learner will: 5. Understand the fundamental principles which underpin the relationship between magnetism and electricity. Assessment criteria: The learner can: 3. describe the magnetic effects of electrical currents in terms of: a. production of a magnetic field b. force on a current-carrying conductor in a magnetic field c. electromagnetism d. electromotive force

**PROPOSAL:**
OfficialCurriculumUnit -- `{"curriculumUnitId":"U202-LO5-AC3","officialWording":"describe the magnetic effects of electrical currents in terms of: a. production of a magnetic field b. force on a current-carrying conductor in a magnetic field c. electromagnetism d. electromotive force"}`

**CONFIDENCE:**
EXPLICIT

**RATIONALE:**
Registry entry transcribed verbatim from the handbook's own Learning outcome / Assessment criteria table for Unit 202, page 28. curriculumUnitId is a CC-19A-assigned mapping key (U202-LO5-AC3), not itself official wording.

---

#### CE-125-U202-LO5-AC3-PRIMARY-DESCRIBE

**SOURCE:**
src-cg-2365-02-handbook-v1-12 -- page 28, Unit 202, AC5.3

**RAW:**
> The learner can: 3. describe the magnetic effects of electrical currents in terms of: a. production of a magnetic field b. force on a current-carrying conductor in a magnetic field c. electromagnetism d. electromotive force

**PROPOSAL:**
CurriculumEvidence / PRIMARY_REQUIREMENT -- `{"subject":"magnetic-effects-of-electrical-currents","curriculumUnitId":"U202-LO5-AC3","commandVerbPerformanceType":"DESCRIBE"}`

**CONFIDENCE:**
EXPLICIT

**RATIONALE:**
AC5.3 reads "describe the magnetic effects of electrical currents in terms of: ...".

---

#### CE-127-U202-LO5-AC3-RANGE-magnetic-effect--production-of-a-magnetic-field-DESCRIBE

**SOURCE:**
src-cg-2365-02-handbook-v1-12 -- page 28, Unit 202, Range under AC5.3 ("(AC5.3's own lettered sub-list a-d, not a formal Range table)")

**RAW:**
> Range: (AC5.3's own lettered sub-list a-d, not a formal Range table) production of a magnetic field.

**PROPOSAL:**
CurriculumEvidence / RANGE_REQUIRED_MEMBER -- `{"subject":"magnetic-effect--production-of-a-magnetic-field","curriculumUnitId":"U202-LO5-AC3","commandVerbPerformanceType":"DESCRIBE"}`

**CONFIDENCE:**
EXPLICIT

**RATIONALE:**
"production of a magnetic field" is one of AC5.3's own literal lettered sub-clauses (a-d) enumerating what "in terms of" covers -- treated as RANGE_REQUIRED_MEMBER (functionally a named required sub-topic), EXPLICIT confidence since verbatim AC text.

---

#### CE-129-U202-LO5-AC3-RANGE-magnetic-effect--force-on-a-current-carrying-conductor-in-a-magnetic-field-DESCRIBE

**SOURCE:**
src-cg-2365-02-handbook-v1-12 -- page 28, Unit 202, Range under AC5.3 ("(AC5.3's own lettered sub-list a-d, not a formal Range table)")

**RAW:**
> Range: (AC5.3's own lettered sub-list a-d, not a formal Range table) force on a current-carrying conductor in a magnetic field.

**PROPOSAL:**
CurriculumEvidence / RANGE_REQUIRED_MEMBER -- `{"subject":"magnetic-effect--force-on-a-current-carrying-conductor-in-a-magnetic-field","curriculumUnitId":"U202-LO5-AC3","commandVerbPerformanceType":"DESCRIBE"}`

**CONFIDENCE:**
EXPLICIT

**RATIONALE:**
"force on a current-carrying conductor in a magnetic field" is one of AC5.3's own literal lettered sub-clauses (a-d) enumerating what "in terms of" covers -- treated as RANGE_REQUIRED_MEMBER (functionally a named required sub-topic), EXPLICIT confidence since verbatim AC text.

---

#### CE-131-U202-LO5-AC3-RANGE-magnetic-effect--electromagnetism-DESCRIBE

**SOURCE:**
src-cg-2365-02-handbook-v1-12 -- page 28, Unit 202, Range under AC5.3 ("(AC5.3's own lettered sub-list a-d, not a formal Range table)")

**RAW:**
> Range: (AC5.3's own lettered sub-list a-d, not a formal Range table) electromagnetism.

**PROPOSAL:**
CurriculumEvidence / RANGE_REQUIRED_MEMBER -- `{"subject":"magnetic-effect--electromagnetism","curriculumUnitId":"U202-LO5-AC3","commandVerbPerformanceType":"DESCRIBE"}`

**CONFIDENCE:**
EXPLICIT

**RATIONALE:**
"electromagnetism" is one of AC5.3's own literal lettered sub-clauses (a-d) enumerating what "in terms of" covers -- treated as RANGE_REQUIRED_MEMBER (functionally a named required sub-topic), EXPLICIT confidence since verbatim AC text.

---

#### CE-133-U202-LO5-AC3-RANGE-magnetic-effect--electromotive-force-DESCRIBE

**SOURCE:**
src-cg-2365-02-handbook-v1-12 -- page 28, Unit 202, Range under AC5.3 ("(AC5.3's own lettered sub-list a-d, not a formal Range table)")

**RAW:**
> Range: (AC5.3's own lettered sub-list a-d, not a formal Range table) electromotive force.

**PROPOSAL:**
CurriculumEvidence / RANGE_REQUIRED_MEMBER -- `{"subject":"magnetic-effect--electromotive-force","curriculumUnitId":"U202-LO5-AC3","commandVerbPerformanceType":"DESCRIBE"}`

**CONFIDENCE:**
EXPLICIT

**RATIONALE:**
"electromotive force" is one of AC5.3's own literal lettered sub-clauses (a-d) enumerating what "in terms of" covers -- treated as RANGE_REQUIRED_MEMBER (functionally a named required sub-topic), EXPLICIT confidence since verbatim AC text.

---

### LO5.AC4

#### OCU-U202-LO5-AC4

**SOURCE:**
src-cg-2365-02-handbook-v1-12 -- page 28, Unit 202, Learning outcome 5, Assessment criteria 4

**RAW:**
> Learning outcome: The learner will: 5. Understand the fundamental principles which underpin the relationship between magnetism and electricity. Assessment criteria: The learner can: 4. describe the basic principles of generating an A.C. supply in terms of: a. a single-loop generator b. sine-wave c. frequency d. EMF e. magnetic flux

**PROPOSAL:**
OfficialCurriculumUnit -- `{"curriculumUnitId":"U202-LO5-AC4","officialWording":"describe the basic principles of generating an A.C. supply in terms of: a. a single-loop generator b. sine-wave c. frequency d. EMF e. magnetic flux"}`

**CONFIDENCE:**
EXPLICIT

**RATIONALE:**
Registry entry transcribed verbatim from the handbook's own Learning outcome / Assessment criteria table for Unit 202, page 28. curriculumUnitId is a CC-19A-assigned mapping key (U202-LO5-AC4), not itself official wording.

---

#### CE-135-U202-LO5-AC4-PRIMARY-DESCRIBE

**SOURCE:**
src-cg-2365-02-handbook-v1-12 -- page 28, Unit 202, AC5.4

**RAW:**
> The learner can: 4. describe the basic principles of generating an A.C. supply in terms of: a. a single-loop generator b. sine-wave c. frequency d. EMF e. magnetic flux

**PROPOSAL:**
CurriculumEvidence / PRIMARY_REQUIREMENT -- `{"subject":"basic-principles-of-generating-an-ac-supply","curriculumUnitId":"U202-LO5-AC4","commandVerbPerformanceType":"DESCRIBE"}`

**CONFIDENCE:**
EXPLICIT

**RATIONALE:**
AC5.4 reads "describe the basic principles of generating an A.C. supply in terms of: ...".

---

#### CE-137-U202-LO5-AC4-RANGE-ac-generation-principle--a-single-loop-generator-DESCRIBE

**SOURCE:**
src-cg-2365-02-handbook-v1-12 -- page 28, Unit 202, Range under AC5.4 ("(AC5.4's own lettered sub-list a-e, not a formal Range table)")

**RAW:**
> Range: (AC5.4's own lettered sub-list a-e, not a formal Range table) a single-loop generator.

**PROPOSAL:**
CurriculumEvidence / RANGE_REQUIRED_MEMBER -- `{"subject":"ac-generation-principle--a-single-loop-generator","curriculumUnitId":"U202-LO5-AC4","commandVerbPerformanceType":"DESCRIBE"}`

**CONFIDENCE:**
EXPLICIT

**RATIONALE:**
"a single-loop generator" is one of AC5.4's own literal lettered sub-clauses (a-e) -- RANGE_REQUIRED_MEMBER, EXPLICIT confidence since verbatim AC text.

---

#### CE-139-U202-LO5-AC4-RANGE-ac-generation-principle--sine-wave-DESCRIBE

**SOURCE:**
src-cg-2365-02-handbook-v1-12 -- page 28, Unit 202, Range under AC5.4 ("(AC5.4's own lettered sub-list a-e, not a formal Range table)")

**RAW:**
> Range: (AC5.4's own lettered sub-list a-e, not a formal Range table) sine-wave.

**PROPOSAL:**
CurriculumEvidence / RANGE_REQUIRED_MEMBER -- `{"subject":"ac-generation-principle--sine-wave","curriculumUnitId":"U202-LO5-AC4","commandVerbPerformanceType":"DESCRIBE"}`

**CONFIDENCE:**
EXPLICIT

**RATIONALE:**
"sine-wave" is one of AC5.4's own literal lettered sub-clauses (a-e) -- RANGE_REQUIRED_MEMBER, EXPLICIT confidence since verbatim AC text.

---

#### CE-141-U202-LO5-AC4-RANGE-ac-generation-principle--frequency-DESCRIBE

**SOURCE:**
src-cg-2365-02-handbook-v1-12 -- page 28, Unit 202, Range under AC5.4 ("(AC5.4's own lettered sub-list a-e, not a formal Range table)")

**RAW:**
> Range: (AC5.4's own lettered sub-list a-e, not a formal Range table) frequency.

**PROPOSAL:**
CurriculumEvidence / RANGE_REQUIRED_MEMBER -- `{"subject":"ac-generation-principle--frequency","curriculumUnitId":"U202-LO5-AC4","commandVerbPerformanceType":"DESCRIBE"}`

**CONFIDENCE:**
EXPLICIT

**RATIONALE:**
"frequency" is one of AC5.4's own literal lettered sub-clauses (a-e) -- RANGE_REQUIRED_MEMBER, EXPLICIT confidence since verbatim AC text.

---

#### CE-143-U202-LO5-AC4-RANGE-ac-generation-principle--emf-DESCRIBE

**SOURCE:**
src-cg-2365-02-handbook-v1-12 -- page 28, Unit 202, Range under AC5.4 ("(AC5.4's own lettered sub-list a-e, not a formal Range table)")

**RAW:**
> Range: (AC5.4's own lettered sub-list a-e, not a formal Range table) EMF.

**PROPOSAL:**
CurriculumEvidence / RANGE_REQUIRED_MEMBER -- `{"subject":"ac-generation-principle--emf","curriculumUnitId":"U202-LO5-AC4","commandVerbPerformanceType":"DESCRIBE"}`

**CONFIDENCE:**
EXPLICIT

**RATIONALE:**
"EMF" is one of AC5.4's own literal lettered sub-clauses (a-e) -- RANGE_REQUIRED_MEMBER, EXPLICIT confidence since verbatim AC text.

---

#### CE-145-U202-LO5-AC4-RANGE-ac-generation-principle--magnetic-flux-DESCRIBE

**SOURCE:**
src-cg-2365-02-handbook-v1-12 -- page 28, Unit 202, Range under AC5.4 ("(AC5.4's own lettered sub-list a-e, not a formal Range table)")

**RAW:**
> Range: (AC5.4's own lettered sub-list a-e, not a formal Range table) magnetic flux.

**PROPOSAL:**
CurriculumEvidence / RANGE_REQUIRED_MEMBER -- `{"subject":"ac-generation-principle--magnetic-flux","curriculumUnitId":"U202-LO5-AC4","commandVerbPerformanceType":"DESCRIBE"}`

**CONFIDENCE:**
EXPLICIT

**RATIONALE:**
"magnetic flux" is one of AC5.4's own literal lettered sub-clauses (a-e) -- RANGE_REQUIRED_MEMBER, EXPLICIT confidence since verbatim AC text.

---

### LO5.AC5

#### OCU-U202-LO5-AC5

**SOURCE:**
src-cg-2365-02-handbook-v1-12 -- page 28, Unit 202, Learning outcome 5, Assessment criteria 5

**RAW:**
> Learning outcome: The learner will: 5. Understand the fundamental principles which underpin the relationship between magnetism and electricity. Assessment criteria: The learner can: 5. identify the characteristics of sine-waves

**PROPOSAL:**
OfficialCurriculumUnit -- `{"curriculumUnitId":"U202-LO5-AC5","officialWording":"identify the characteristics of sine-waves"}`

**CONFIDENCE:**
EXPLICIT

**RATIONALE:**
Registry entry transcribed verbatim from the handbook's own Learning outcome / Assessment criteria table for Unit 202, page 28. curriculumUnitId is a CC-19A-assigned mapping key (U202-LO5-AC5), not itself official wording.

---

#### CE-147-U202-LO5-AC5-PRIMARY-IDENTIFY

**SOURCE:**
src-cg-2365-02-handbook-v1-12 -- page 28, Unit 202, AC5.5

**RAW:**
> The learner can: 5. identify the characteristics of sine-waves

**PROPOSAL:**
CurriculumEvidence / PRIMARY_REQUIREMENT -- `{"subject":"characteristics-of-sine-waves","curriculumUnitId":"U202-LO5-AC5","commandVerbPerformanceType":"IDENTIFY"}`

**CONFIDENCE:**
EXPLICIT

**RATIONALE:**
AC5.5 reads "identify the characteristics of sine-waves".

---

#### CE-149-U202-LO5-AC5-RANGE-sine-wave-characteristic--root-mean-square-rms-value-IDENTIFY

**SOURCE:**
src-cg-2365-02-handbook-v1-12 -- page 28, Unit 202, Range under AC5.5 ("Characteristics of a sine-wave:")

**RAW:**
> Range: Characteristics of a sine-wave: Root Mean Square (RMS) value.

**PROPOSAL:**
CurriculumEvidence / RANGE_REQUIRED_MEMBER -- `{"subject":"sine-wave-characteristic--root-mean-square-rms-value","curriculumUnitId":"U202-LO5-AC5","commandVerbPerformanceType":"IDENTIFY"}`

**CONFIDENCE:**
STRONG_INFERENCE

**RATIONALE:**
"Root Mean Square (RMS) value" is an explicit member of the "Characteristics of a sine-wave:" Range list under AC5.5. Performance type IDENTIFY is inherited from the parent AC's own command verb (the Range table itself carries no separate verb per item) -- an inference from Range structure, not a second literal verb, hence STRONG_INFERENCE rather than EXPLICIT.

---

#### CE-151-U202-LO5-AC5-RANGE-sine-wave-characteristic--average-value-IDENTIFY

**SOURCE:**
src-cg-2365-02-handbook-v1-12 -- page 28, Unit 202, Range under AC5.5 ("Characteristics of a sine-wave:")

**RAW:**
> Range: Characteristics of a sine-wave: Average value.

**PROPOSAL:**
CurriculumEvidence / RANGE_REQUIRED_MEMBER -- `{"subject":"sine-wave-characteristic--average-value","curriculumUnitId":"U202-LO5-AC5","commandVerbPerformanceType":"IDENTIFY"}`

**CONFIDENCE:**
STRONG_INFERENCE

**RATIONALE:**
"Average value" is an explicit member of the "Characteristics of a sine-wave:" Range list under AC5.5. Performance type IDENTIFY is inherited from the parent AC's own command verb (the Range table itself carries no separate verb per item) -- an inference from Range structure, not a second literal verb, hence STRONG_INFERENCE rather than EXPLICIT.

---

#### CE-153-U202-LO5-AC5-RANGE-sine-wave-characteristic--peak-to-peak-value-IDENTIFY

**SOURCE:**
src-cg-2365-02-handbook-v1-12 -- page 28, Unit 202, Range under AC5.5 ("Characteristics of a sine-wave:")

**RAW:**
> Range: Characteristics of a sine-wave: Peak to peak value.

**PROPOSAL:**
CurriculumEvidence / RANGE_REQUIRED_MEMBER -- `{"subject":"sine-wave-characteristic--peak-to-peak-value","curriculumUnitId":"U202-LO5-AC5","commandVerbPerformanceType":"IDENTIFY"}`

**CONFIDENCE:**
STRONG_INFERENCE

**RATIONALE:**
"Peak to peak value" is an explicit member of the "Characteristics of a sine-wave:" Range list under AC5.5. Performance type IDENTIFY is inherited from the parent AC's own command verb (the Range table itself carries no separate verb per item) -- an inference from Range structure, not a second literal verb, hence STRONG_INFERENCE rather than EXPLICIT.

---

#### CE-155-U202-LO5-AC5-RANGE-sine-wave-characteristic--periodic-time-IDENTIFY

**SOURCE:**
src-cg-2365-02-handbook-v1-12 -- page 28, Unit 202, Range under AC5.5 ("Characteristics of a sine-wave:")

**RAW:**
> Range: Characteristics of a sine-wave: Periodic time.

**PROPOSAL:**
CurriculumEvidence / RANGE_REQUIRED_MEMBER -- `{"subject":"sine-wave-characteristic--periodic-time","curriculumUnitId":"U202-LO5-AC5","commandVerbPerformanceType":"IDENTIFY"}`

**CONFIDENCE:**
STRONG_INFERENCE

**RATIONALE:**
"Periodic time" is an explicit member of the "Characteristics of a sine-wave:" Range list under AC5.5. Performance type IDENTIFY is inherited from the parent AC's own command verb (the Range table itself carries no separate verb per item) -- an inference from Range structure, not a second literal verb, hence STRONG_INFERENCE rather than EXPLICIT.

---

#### CE-157-U202-LO5-AC5-RANGE-sine-wave-characteristic--frequency-IDENTIFY

**SOURCE:**
src-cg-2365-02-handbook-v1-12 -- page 28, Unit 202, Range under AC5.5 ("Characteristics of a sine-wave:")

**RAW:**
> Range: Characteristics of a sine-wave: Frequency.

**PROPOSAL:**
CurriculumEvidence / RANGE_REQUIRED_MEMBER -- `{"subject":"sine-wave-characteristic--frequency","curriculumUnitId":"U202-LO5-AC5","commandVerbPerformanceType":"IDENTIFY"}`

**CONFIDENCE:**
STRONG_INFERENCE

**RATIONALE:**
"Frequency" is an explicit member of the "Characteristics of a sine-wave:" Range list under AC5.5. Performance type IDENTIFY is inherited from the parent AC's own command verb (the Range table itself carries no separate verb per item) -- an inference from Range structure, not a second literal verb, hence STRONG_INFERENCE rather than EXPLICIT.

---

#### CE-159-U202-LO5-AC5-RANGE-sine-wave-characteristic--amplitude-IDENTIFY

**SOURCE:**
src-cg-2365-02-handbook-v1-12 -- page 28, Unit 202, Range under AC5.5 ("Characteristics of a sine-wave:")

**RAW:**
> Range: Characteristics of a sine-wave: Amplitude.

**PROPOSAL:**
CurriculumEvidence / RANGE_REQUIRED_MEMBER -- `{"subject":"sine-wave-characteristic--amplitude","curriculumUnitId":"U202-LO5-AC5","commandVerbPerformanceType":"IDENTIFY"}`

**CONFIDENCE:**
STRONG_INFERENCE

**RATIONALE:**
"Amplitude" is an explicit member of the "Characteristics of a sine-wave:" Range list under AC5.5. Performance type IDENTIFY is inherited from the parent AC's own command verb (the Range table itself carries no separate verb per item) -- an inference from Range structure, not a second literal verb, hence STRONG_INFERENCE rather than EXPLICIT.

---

### LO6.AC1

#### OCU-U202-LO6-AC1

**SOURCE:**
src-cg-2365-02-handbook-v1-12 -- page 29, Unit 202, Learning outcome 6, Assessment criteria 1

**RAW:**
> Learning outcome: The learner will: 6. Understand the types, applications and limitations of electronic components in electrical systems and equipment. Assessment criteria: The learner can: 1. describe the function and application of electronic components that are used in electrical systems

**PROPOSAL:**
OfficialCurriculumUnit -- `{"curriculumUnitId":"U202-LO6-AC1","officialWording":"describe the function and application of electronic components that are used in electrical systems"}`

**CONFIDENCE:**
EXPLICIT

**RATIONALE:**
Registry entry transcribed verbatim from the handbook's own Learning outcome / Assessment criteria table for Unit 202, page 29. curriculumUnitId is a CC-19A-assigned mapping key (U202-LO6-AC1), not itself official wording.

---

#### CE-161-U202-LO6-AC1-PRIMARY-DESCRIBE

**SOURCE:**
src-cg-2365-02-handbook-v1-12 -- page 29, Unit 202, AC6.1

**RAW:**
> The learner can: 1. describe the function and application of electronic components that are used in electrical systems

**PROPOSAL:**
CurriculumEvidence / PRIMARY_REQUIREMENT -- `{"subject":"electronic-component-function-and-application-in-electrical-systems","curriculumUnitId":"U202-LO6-AC1","commandVerbPerformanceType":"DESCRIBE"}`

**CONFIDENCE:**
EXPLICIT

**RATIONALE:**
AC6.1 reads "describe the function and application of electronic components that are used in electrical systems".

---

#### CE-163-U202-LO6-AC1-RANGE-electrical-system-application--security-alarms-DESCRIBE

**SOURCE:**
src-cg-2365-02-handbook-v1-12 -- page 29, Unit 202, Range under AC6.1 ("Electrical systems:")

**RAW:**
> Range: Electrical systems: Security alarms.

**PROPOSAL:**
CurriculumEvidence / RANGE_REQUIRED_MEMBER -- `{"subject":"electrical-system-application--security-alarms","curriculumUnitId":"U202-LO6-AC1","commandVerbPerformanceType":"DESCRIBE"}`

**CONFIDENCE:**
STRONG_INFERENCE

**RATIONALE:**
"Security alarms" is an explicit member of the "Electrical systems:" Range list under AC6.1. Performance type DESCRIBE is inherited from the parent AC's own command verb (the Range table itself carries no separate verb per item) -- an inference from Range structure, not a second literal verb, hence STRONG_INFERENCE rather than EXPLICIT.

---

#### CE-165-U202-LO6-AC1-RANGE-electrical-system-application--telephones-DESCRIBE

**SOURCE:**
src-cg-2365-02-handbook-v1-12 -- page 29, Unit 202, Range under AC6.1 ("Electrical systems:")

**RAW:**
> Range: Electrical systems: Telephones.

**PROPOSAL:**
CurriculumEvidence / RANGE_REQUIRED_MEMBER -- `{"subject":"electrical-system-application--telephones","curriculumUnitId":"U202-LO6-AC1","commandVerbPerformanceType":"DESCRIBE"}`

**CONFIDENCE:**
STRONG_INFERENCE

**RATIONALE:**
"Telephones" is an explicit member of the "Electrical systems:" Range list under AC6.1. Performance type DESCRIBE is inherited from the parent AC's own command verb (the Range table itself carries no separate verb per item) -- an inference from Range structure, not a second literal verb, hence STRONG_INFERENCE rather than EXPLICIT.

---

#### CE-167-U202-LO6-AC1-RANGE-electrical-system-application--dimmer-switches-DESCRIBE

**SOURCE:**
src-cg-2365-02-handbook-v1-12 -- page 29, Unit 202, Range under AC6.1 ("Electrical systems:")

**RAW:**
> Range: Electrical systems: Dimmer switches.

**PROPOSAL:**
CurriculumEvidence / RANGE_REQUIRED_MEMBER -- `{"subject":"electrical-system-application--dimmer-switches","curriculumUnitId":"U202-LO6-AC1","commandVerbPerformanceType":"DESCRIBE"}`

**CONFIDENCE:**
STRONG_INFERENCE

**RATIONALE:**
"Dimmer switches" is an explicit member of the "Electrical systems:" Range list under AC6.1. Performance type DESCRIBE is inherited from the parent AC's own command verb (the Range table itself carries no separate verb per item) -- an inference from Range structure, not a second literal verb, hence STRONG_INFERENCE rather than EXPLICIT.

---

#### CE-169-U202-LO6-AC1-RANGE-electrical-system-application--heating-boiler-controls-DESCRIBE

**SOURCE:**
src-cg-2365-02-handbook-v1-12 -- page 29, Unit 202, Range under AC6.1 ("Electrical systems:")

**RAW:**
> Range: Electrical systems: Heating/boiler controls.

**PROPOSAL:**
CurriculumEvidence / RANGE_REQUIRED_MEMBER -- `{"subject":"electrical-system-application--heating-boiler-controls","curriculumUnitId":"U202-LO6-AC1","commandVerbPerformanceType":"DESCRIBE"}`

**CONFIDENCE:**
STRONG_INFERENCE

**RATIONALE:**
"Heating/boiler controls" is an explicit member of the "Electrical systems:" Range list under AC6.1. Performance type DESCRIBE is inherited from the parent AC's own command verb (the Range table itself carries no separate verb per item) -- an inference from Range structure, not a second literal verb, hence STRONG_INFERENCE rather than EXPLICIT.

---

#### CE-171-U202-LO6-AC1-RANGE-electrical-system-application--motor-control-DESCRIBE

**SOURCE:**
src-cg-2365-02-handbook-v1-12 -- page 29, Unit 202, Range under AC6.1 ("Electrical systems:")

**RAW:**
> Range: Electrical systems: Motor control.

**PROPOSAL:**
CurriculumEvidence / RANGE_REQUIRED_MEMBER -- `{"subject":"electrical-system-application--motor-control","curriculumUnitId":"U202-LO6-AC1","commandVerbPerformanceType":"DESCRIBE"}`

**CONFIDENCE:**
STRONG_INFERENCE

**RATIONALE:**
"Motor control" is an explicit member of the "Electrical systems:" Range list under AC6.1. Performance type DESCRIBE is inherited from the parent AC's own command verb (the Range table itself carries no separate verb per item) -- an inference from Range structure, not a second literal verb, hence STRONG_INFERENCE rather than EXPLICIT.

---

#### CE-173-U202-LO6-AC1-RANGE-electrical-system-application--wireless-control-systems-DESCRIBE

**SOURCE:**
src-cg-2365-02-handbook-v1-12 -- page 29, Unit 202, Range under AC6.1 ("Electrical systems:")

**RAW:**
> Range: Electrical systems: Wireless control systems.

**PROPOSAL:**
CurriculumEvidence / RANGE_REQUIRED_MEMBER -- `{"subject":"electrical-system-application--wireless-control-systems","curriculumUnitId":"U202-LO6-AC1","commandVerbPerformanceType":"DESCRIBE"}`

**CONFIDENCE:**
STRONG_INFERENCE

**RATIONALE:**
"Wireless control systems" is an explicit member of the "Electrical systems:" Range list under AC6.1. Performance type DESCRIBE is inherited from the parent AC's own command verb (the Range table itself carries no separate verb per item) -- an inference from Range structure, not a second literal verb, hence STRONG_INFERENCE rather than EXPLICIT.

---

### LO6.AC2

#### OCU-U202-LO6-AC2

**SOURCE:**
src-cg-2365-02-handbook-v1-12 -- page 29, Unit 202, Learning outcome 6, Assessment criteria 2

**RAW:**
> Learning outcome: The learner will: 6. Understand the types, applications and limitations of electronic components in electrical systems and equipment. Assessment criteria: The learner can: 2. state the basic operating principles of electronic components and devices

**PROPOSAL:**
OfficialCurriculumUnit -- `{"curriculumUnitId":"U202-LO6-AC2","officialWording":"state the basic operating principles of electronic components and devices"}`

**CONFIDENCE:**
EXPLICIT

**RATIONALE:**
Registry entry transcribed verbatim from the handbook's own Learning outcome / Assessment criteria table for Unit 202, page 29. curriculumUnitId is a CC-19A-assigned mapping key (U202-LO6-AC2), not itself official wording.

---

#### CE-175-U202-LO6-AC2-PRIMARY-STATE

**SOURCE:**
src-cg-2365-02-handbook-v1-12 -- page 29, Unit 202, AC6.2

**RAW:**
> The learner can: 2. state the basic operating principles of electronic components and devices

**PROPOSAL:**
CurriculumEvidence / PRIMARY_REQUIREMENT -- `{"subject":"electronic-component-basic-operating-principles","curriculumUnitId":"U202-LO6-AC2","commandVerbPerformanceType":"STATE"}`

**CONFIDENCE:**
EXPLICIT

**RATIONALE:**
AC6.2 reads "state the basic operating principles of electronic components and devices".

---

#### CE-177-U202-LO6-AC2-RANGE-electronic-component--capacitors-STATE

**SOURCE:**
src-cg-2365-02-handbook-v1-12 -- page 29, Unit 202, Range under AC6.2 ("Electronic components and devices:")

**RAW:**
> Range: Electronic components and devices: Capacitors.

**PROPOSAL:**
CurriculumEvidence / RANGE_REQUIRED_MEMBER -- `{"subject":"electronic-component--capacitors","curriculumUnitId":"U202-LO6-AC2","commandVerbPerformanceType":"STATE"}`

**CONFIDENCE:**
STRONG_INFERENCE

**RATIONALE:**
"Capacitors" is an explicit member of the "Electronic components and devices:" Range list under AC6.2.

---

#### CE-179-U202-LO6-AC2-RANGE-electronic-component--resistors-STATE

**SOURCE:**
src-cg-2365-02-handbook-v1-12 -- page 29, Unit 202, Range under AC6.2 ("Electronic components and devices:")

**RAW:**
> Range: Electronic components and devices: Resistors.

**PROPOSAL:**
CurriculumEvidence / RANGE_REQUIRED_MEMBER -- `{"subject":"electronic-component--resistors","curriculumUnitId":"U202-LO6-AC2","commandVerbPerformanceType":"STATE"}`

**CONFIDENCE:**
STRONG_INFERENCE

**RATIONALE:**
"Resistors" is an explicit member of the "Electronic components and devices:" Range list under AC6.2.

---

#### CE-181-U202-LO6-AC2-RANGE-electronic-component--rectifiers-STATE

**SOURCE:**
src-cg-2365-02-handbook-v1-12 -- page 29, Unit 202, Range under AC6.2 ("Electronic components and devices:")

**RAW:**
> Range: Electronic components and devices: Rectifiers.

**PROPOSAL:**
CurriculumEvidence / RANGE_REQUIRED_MEMBER -- `{"subject":"electronic-component--rectifiers","curriculumUnitId":"U202-LO6-AC2","commandVerbPerformanceType":"STATE"}`

**CONFIDENCE:**
STRONG_INFERENCE

**RATIONALE:**
"Rectifiers" is an explicit member of the "Electronic components and devices:" Range list under AC6.2.

---

#### CE-183-U202-LO6-AC2-RANGE-electronic-component--diodes-STATE

**SOURCE:**
src-cg-2365-02-handbook-v1-12 -- page 29, Unit 202, Range under AC6.2 ("Electronic components and devices:")

**RAW:**
> Range: Electronic components and devices: Diodes.

**PROPOSAL:**
CurriculumEvidence / RANGE_REQUIRED_MEMBER -- `{"subject":"electronic-component--diodes","curriculumUnitId":"U202-LO6-AC2","commandVerbPerformanceType":"STATE"}`

**CONFIDENCE:**
STRONG_INFERENCE

**RATIONALE:**
"Diodes" is an explicit member of the "Electronic components and devices:" Range list under AC6.2.

---

#### CE-185-U202-LO6-AC2-RANGE-electronic-component--thermistors-STATE

**SOURCE:**
src-cg-2365-02-handbook-v1-12 -- page 29, Unit 202, Range under AC6.2 ("Electronic components and devices:")

**RAW:**
> Range: Electronic components and devices: Thermistors.

**PROPOSAL:**
CurriculumEvidence / RANGE_REQUIRED_MEMBER -- `{"subject":"electronic-component--thermistors","curriculumUnitId":"U202-LO6-AC2","commandVerbPerformanceType":"STATE"}`

**CONFIDENCE:**
STRONG_INFERENCE

**RATIONALE:**
"Thermistors" is an explicit member of the "Electronic components and devices:" Range list under AC6.2.

---

#### CE-187-U202-LO6-AC2-RANGE-electronic-component--diacs-STATE

**SOURCE:**
src-cg-2365-02-handbook-v1-12 -- page 29, Unit 202, Range under AC6.2 ("Electronic components and devices:")

**RAW:**
> Range: Electronic components and devices: Diacs.

**PROPOSAL:**
CurriculumEvidence / RANGE_REQUIRED_MEMBER -- `{"subject":"electronic-component--diacs","curriculumUnitId":"U202-LO6-AC2","commandVerbPerformanceType":"STATE"}`

**CONFIDENCE:**
STRONG_INFERENCE

**RATIONALE:**
"Diacs" is an explicit member of the "Electronic components and devices:" Range list under AC6.2.

---

#### CE-189-U202-LO6-AC2-RANGE-electronic-component--triacs-STATE

**SOURCE:**
src-cg-2365-02-handbook-v1-12 -- page 29, Unit 202, Range under AC6.2 ("Electronic components and devices:")

**RAW:**
> Range: Electronic components and devices: Triacs.

**PROPOSAL:**
CurriculumEvidence / RANGE_REQUIRED_MEMBER -- `{"subject":"electronic-component--triacs","curriculumUnitId":"U202-LO6-AC2","commandVerbPerformanceType":"STATE"}`

**CONFIDENCE:**
STRONG_INFERENCE

**RATIONALE:**
"Triacs" is an explicit member of the "Electronic components and devices:" Range list under AC6.2.

---

#### CE-191-U202-LO6-AC2-RANGE-electronic-component--transistors-STATE

**SOURCE:**
src-cg-2365-02-handbook-v1-12 -- page 29, Unit 202, Range under AC6.2 ("Electronic components and devices:")

**RAW:**
> Range: Electronic components and devices: Transistors.

**PROPOSAL:**
CurriculumEvidence / RANGE_REQUIRED_MEMBER -- `{"subject":"electronic-component--transistors","curriculumUnitId":"U202-LO6-AC2","commandVerbPerformanceType":"STATE"}`

**CONFIDENCE:**
STRONG_INFERENCE

**RATIONALE:**
"Transistors" is an explicit member of the "Electronic components and devices:" Range list under AC6.2.

---

#### CE-193-U202-LO6-AC2-RANGE-electronic-component--thyristors-STATE

**SOURCE:**
src-cg-2365-02-handbook-v1-12 -- page 29, Unit 202, Range under AC6.2 ("Electronic components and devices:")

**RAW:**
> Range: Electronic components and devices: Thyristors.

**PROPOSAL:**
CurriculumEvidence / RANGE_REQUIRED_MEMBER -- `{"subject":"electronic-component--thyristors","curriculumUnitId":"U202-LO6-AC2","commandVerbPerformanceType":"STATE"}`

**CONFIDENCE:**
STRONG_INFERENCE

**RATIONALE:**
"Thyristors" is an explicit member of the "Electronic components and devices:" Range list under AC6.2.

---

#### CE-195-U202-LO6-AC2-RANGE-electronic-component--invertors-STATE

**SOURCE:**
src-cg-2365-02-handbook-v1-12 -- page 29, Unit 202, Range under AC6.2 ("Electronic components and devices:")

**RAW:**
> Range: Electronic components and devices: Invertors.

**PROPOSAL:**
CurriculumEvidence / RANGE_REQUIRED_MEMBER -- `{"subject":"electronic-component--invertors","curriculumUnitId":"U202-LO6-AC2","commandVerbPerformanceType":"STATE"}`

**CONFIDENCE:**
STRONG_INFERENCE

**RATIONALE:**
"Invertors" is an explicit member of the "Electronic components and devices:" Range list under AC6.2.

---

#### CE-197-U202-LO6-AC2-RANGE-electronic-component--diodes--zener-STATE

**SOURCE:**
src-cg-2365-02-handbook-v1-12 -- page 29, Unit 202, Range under AC6.2 ("Electronic components and devices:")

**RAW:**
> Range: Electronic components and devices: Zener.

**PROPOSAL:**
CurriculumEvidence / RANGE_REQUIRED_MEMBER -- `{"subject":"electronic-component--diodes--zener","curriculumUnitId":"U202-LO6-AC2","commandVerbPerformanceType":"STATE"}`

**CONFIDENCE:**
REVIEW_PROPOSED

**RATIONALE:**
"Zener" prints in the Range list immediately after "Diodes" at the same bullet indentation as every other top-level item. The most plausible reading is that it names a TYPE of diode ("Zener diode"/"Zenerdiode"), i.e. a nested member of "Diodes" rather than a freestanding component -- but the rendered source does not unambiguously show sub-bullet indentation, so this structural interpretation is NOT treated as EXPLICIT or even STRONG_INFERENCE; it is exported REVIEW_PROPOSED for the Project Architect to confirm against the original document layout before being treated as governing.

---

#### CE-199-U202-LO6-AC2-RANGE-electronic-component--diodes--photo-STATE

**SOURCE:**
src-cg-2365-02-handbook-v1-12 -- page 29, Unit 202, Range under AC6.2 ("Electronic components and devices:")

**RAW:**
> Range: Electronic components and devices: photo.

**PROPOSAL:**
CurriculumEvidence / RANGE_REQUIRED_MEMBER -- `{"subject":"electronic-component--diodes--photo","curriculumUnitId":"U202-LO6-AC2","commandVerbPerformanceType":"STATE"}`

**CONFIDENCE:**
REVIEW_PROPOSED

**RATIONALE:**
"photo" prints in the Range list immediately after "Diodes" at the same bullet indentation as every other top-level item. The most plausible reading is that it names a TYPE of diode ("photo diode"/"photodiode"), i.e. a nested member of "Diodes" rather than a freestanding component -- but the rendered source does not unambiguously show sub-bullet indentation, so this structural interpretation is NOT treated as EXPLICIT or even STRONG_INFERENCE; it is exported REVIEW_PROPOSED for the Project Architect to confirm against the original document layout before being treated as governing.

---

### UNGROUPED

#### CLAIM-length-si-unit

**SOURCE:**
src-bipm-si-brochure-9th-edition -- Table 2, page 126

**RAW:**
> length ... metre ... m

**PROPOSAL:**
SourceFactualClaim -- `{"subject":"physical-quantity-si-unit--length","claimKey":"length-si-unit","normalizedClaimValue":"metre (m)"}`

**CONFIDENCE:**
EXPLICIT

**RATIONALE:**
Attached ONLY after the CandidateFactRequirement above independently arose from AC2.1's own wording (task section 17). BIPM Table names this exact quantity with this exact unit/symbol.

---

#### CLAIM-area-si-unit

**SOURCE:**
src-bipm-si-brochure-9th-edition -- Table 5, page 135

**RAW:**
> area ... m2

**PROPOSAL:**
SourceFactualClaim -- `{"subject":"physical-quantity-si-unit--area","claimKey":"area-si-unit","normalizedClaimValue":"square metre (m²)"}`

**CONFIDENCE:**
EXPLICIT

**RATIONALE:**
Attached ONLY after the CandidateFactRequirement above independently arose from AC2.1's own wording (task section 17). BIPM Table names this exact quantity with this exact unit/symbol.

---

#### CLAIM-volume-si-unit

**SOURCE:**
src-bipm-si-brochure-9th-edition -- Table 5, page 135

**RAW:**
> volume ... m3

**PROPOSAL:**
SourceFactualClaim -- `{"subject":"physical-quantity-si-unit--volume","claimKey":"volume-si-unit","normalizedClaimValue":"cubic metre (m³)"}`

**CONFIDENCE:**
EXPLICIT

**RATIONALE:**
Attached ONLY after the CandidateFactRequirement above independently arose from AC2.1's own wording (task section 17). BIPM Table names this exact quantity with this exact unit/symbol.

---

#### CLAIM-mass-si-unit

**SOURCE:**
src-bipm-si-brochure-9th-edition -- Table 2, page 126

**RAW:**
> mass ... kilogram ... kg

**PROPOSAL:**
SourceFactualClaim -- `{"subject":"physical-quantity-si-unit--mass","claimKey":"mass-si-unit","normalizedClaimValue":"kilogram (kg)"}`

**CONFIDENCE:**
EXPLICIT

**RATIONALE:**
Attached ONLY after the CandidateFactRequirement above independently arose from AC2.1's own wording (task section 17). BIPM Table names this exact quantity with this exact unit/symbol.

---

#### CLAIM-density-si-unit

**SOURCE:**
src-bipm-si-brochure-9th-edition -- Table 5, page 135

**RAW:**
> density, mass density ... kg m-3

**PROPOSAL:**
SourceFactualClaim -- `{"subject":"physical-quantity-si-unit--density","claimKey":"density-si-unit","normalizedClaimValue":"kilogram per cubic metre (kg/m³)"}`

**CONFIDENCE:**
EXPLICIT

**RATIONALE:**
Attached ONLY after the CandidateFactRequirement above independently arose from AC2.1's own wording (task section 17). BIPM Table names this exact quantity with this exact unit/symbol.

---

#### CLAIM-time-si-unit

**SOURCE:**
src-bipm-si-brochure-9th-edition -- Table 2, page 126

**RAW:**
> time ... second ... s

**PROPOSAL:**
SourceFactualClaim -- `{"subject":"physical-quantity-si-unit--time","claimKey":"time-si-unit","normalizedClaimValue":"second (s)"}`

**CONFIDENCE:**
EXPLICIT

**RATIONALE:**
Attached ONLY after the CandidateFactRequirement above independently arose from AC2.1's own wording (task section 17). BIPM Table names this exact quantity with this exact unit/symbol.

---

#### CLAIM-temperature-si-unit

**SOURCE:**
src-bipm-si-brochure-9th-edition -- Table 2, page 126

**RAW:**
> thermodynamic temperature ... kelvin ... K

**PROPOSAL:**
SourceFactualClaim -- `{"subject":"physical-quantity-si-unit--temperature","claimKey":"temperature-si-unit","normalizedClaimValue":"kelvin (K)"}`

**CONFIDENCE:**
EXPLICIT

**RATIONALE:**
Attached ONLY after the CandidateFactRequirement above independently arose from AC2.1's own wording (task section 17). BIPM Table names this exact quantity with this exact unit/symbol.

---

#### CLAIM-velocity-si-unit

**SOURCE:**
src-bipm-si-brochure-9th-edition -- Table 5, page 135

**RAW:**
> speed, velocity ... m s-1

**PROPOSAL:**
SourceFactualClaim -- `{"subject":"physical-quantity-si-unit--velocity","claimKey":"velocity-si-unit","normalizedClaimValue":"metre per second (m/s)"}`

**CONFIDENCE:**
EXPLICIT

**RATIONALE:**
Attached ONLY after the CandidateFactRequirement above independently arose from AC2.1's own wording (task section 17). BIPM Table names this exact quantity with this exact unit/symbol.

---

#### CLAIM-resistance-si-unit

**SOURCE:**
src-bipm-si-brochure-9th-edition -- Table 4, page 133

**RAW:**
> electric resistance ... ohm ... Ω

**PROPOSAL:**
SourceFactualClaim -- `{"subject":"electrical-quantity-si-unit--resistance","claimKey":"resistance-si-unit","normalizedClaimValue":"ohm (Ω)"}`

**CONFIDENCE:**
EXPLICIT

**RATIONALE:**
Attached ONLY after the CandidateFactRequirement above independently arose from AC2.2's own wording (task section 17). BIPM Table names this exact quantity with this exact unit/symbol.

---

#### CLAIM-power-si-unit

**SOURCE:**
src-bipm-si-brochure-9th-edition -- Table 4, page 133

**RAW:**
> power, radiant flux ... watt ... W

**PROPOSAL:**
SourceFactualClaim -- `{"subject":"electrical-quantity-si-unit--power","claimKey":"power-si-unit","normalizedClaimValue":"watt (W)"}`

**CONFIDENCE:**
EXPLICIT

**RATIONALE:**
Attached ONLY after the CandidateFactRequirement above independently arose from AC2.2's own wording (task section 17). BIPM Table names this exact quantity with this exact unit/symbol.

---

#### CLAIM-frequency-si-unit

**SOURCE:**
src-bipm-si-brochure-9th-edition -- Table 4, page 133

**RAW:**
> frequency ... hertz ... Hz

**PROPOSAL:**
SourceFactualClaim -- `{"subject":"electrical-quantity-si-unit--frequency","claimKey":"frequency-si-unit","normalizedClaimValue":"hertz (Hz)"}`

**CONFIDENCE:**
EXPLICIT

**RATIONALE:**
Attached ONLY after the CandidateFactRequirement above independently arose from AC2.2's own wording (task section 17). BIPM Table names this exact quantity with this exact unit/symbol.

---

#### CLAIM-current-si-unit

**SOURCE:**
src-bipm-si-brochure-9th-edition -- Table 2, page 126

**RAW:**
> electric current ... ampere ... A

**PROPOSAL:**
SourceFactualClaim -- `{"subject":"electrical-quantity-si-unit--current","claimKey":"current-si-unit","normalizedClaimValue":"ampere (A)"}`

**CONFIDENCE:**
EXPLICIT

**RATIONALE:**
Attached ONLY after the CandidateFactRequirement above independently arose from AC2.2's own wording (task section 17). BIPM Table names this exact quantity with this exact unit/symbol.

---

#### CLAIM-voltage-si-unit

**SOURCE:**
src-bipm-si-brochure-9th-edition -- Table 4, page 133

**RAW:**
> electric potential difference ... volt ... V

**PROPOSAL:**
SourceFactualClaim -- `{"subject":"electrical-quantity-si-unit--voltage","claimKey":"voltage-si-unit","normalizedClaimValue":"volt (V)"}`

**CONFIDENCE:**
EXPLICIT

**RATIONALE:**
Attached ONLY after the CandidateFactRequirement above independently arose from AC2.2's own wording (task section 17). BIPM Table names this exact quantity with this exact unit/symbol.

---

#### CLAIM-energy-si-unit

**SOURCE:**
src-bipm-si-brochure-9th-edition -- Table 4, page 133

**RAW:**
> energy, work, amount of heat ... joule ... J

**PROPOSAL:**
SourceFactualClaim -- `{"subject":"electrical-quantity-si-unit--energy","claimKey":"energy-si-unit","normalizedClaimValue":"joule (J)"}`

**CONFIDENCE:**
EXPLICIT

**RATIONALE:**
Attached ONLY after the CandidateFactRequirement above independently arose from AC2.2's own wording (task section 17). BIPM Table names this exact quantity with this exact unit/symbol.

---

#### CLAIM-inductance-si-unit

**SOURCE:**
src-bipm-si-brochure-9th-edition -- Table 4, page 133

**RAW:**
> inductance ... henry ... H

**PROPOSAL:**
SourceFactualClaim -- `{"subject":"electrical-quantity-si-unit--inductance","claimKey":"inductance-si-unit","normalizedClaimValue":"henry (H)"}`

**CONFIDENCE:**
EXPLICIT

**RATIONALE:**
Attached ONLY after the CandidateFactRequirement above independently arose from AC2.2's own wording (task section 17). BIPM Table names this exact quantity with this exact unit/symbol.

---

#### CLAIM-capacitance-si-unit

**SOURCE:**
src-bipm-si-brochure-9th-edition -- Table 4, page 133

**RAW:**
> capacitance ... farad ... F

**PROPOSAL:**
SourceFactualClaim -- `{"subject":"electrical-quantity-si-unit--capacitance","claimKey":"capacitance-si-unit","normalizedClaimValue":"farad (F)"}`

**CONFIDENCE:**
EXPLICIT

**RATIONALE:**
Attached ONLY after the CandidateFactRequirement above independently arose from AC2.2's own wording (task section 17). BIPM Table names this exact quantity with this exact unit/symbol.

---

#### CLAIM-power-factor-si-unit

**SOURCE:**
src-bipm-si-brochure-9th-edition -- section 2.3.3, page 132

**RAW:**
> quantities Q for which the defining equation is such that all of the dimensional exponents in the equation for the dimension of Q are zero ... are simply numbers. The associated unit is the unit one, symbol 1

**PROPOSAL:**
SourceFactualClaim -- `{"subject":"electrical-quantity-si-unit--power-factor","claimKey":"power-factor-si-unit","normalizedClaimValue":"(none -- dimensionless ratio) (1)"}`

**CONFIDENCE:**
STRONG_INFERENCE

**RATIONALE:**
Attached ONLY after the CandidateFactRequirement above independently arose from AC2.2's own wording. BIPM does not name "power factor" directly, but section 2.3.3's general principle for dimensionless-ratio quantities applies directly (power factor = real power / apparent power, a ratio of two quantities of the same kind) -- STRONG_INFERENCE, not EXPLICIT, since the quantity is not named verbatim.

---

## Unmapped / not-yet-attached technical truth

- `resistivity-si-unit`: fact requirement proposed from AC2.2's curriculum wording; no SourceFactualClaim attached in CC-19A (the exact quantity name is not separately tabulated by the BIPM SI Brochure under that name -- never fabricated from memory). Left genuinely unresolved for a follow-up technical-verification pass.
- `impedance-si-unit`: fact requirement proposed from AC2.2's curriculum wording; no SourceFactualClaim attached in CC-19A (the exact quantity name is not separately tabulated by the BIPM SI Brochure under that name -- never fabricated from memory). Left genuinely unresolved for a follow-up technical-verification pass.
- `inductive-reactance-si-unit`: fact requirement proposed from AC2.2's curriculum wording; no SourceFactualClaim attached in CC-19A (the exact quantity name is not separately tabulated by the BIPM SI Brochure under that name -- never fabricated from memory). Left genuinely unresolved for a follow-up technical-verification pass.
- `capacitive-reactance-si-unit`: fact requirement proposed from AC2.2's curriculum wording; no SourceFactualClaim attached in CC-19A (the exact quantity name is not separately tabulated by the BIPM SI Brochure under that name -- never fabricated from memory). Left genuinely unresolved for a follow-up technical-verification pass.

## REVIEW_PROPOSED proposals

- CE-197-U202-LO6-AC2-RANGE-electronic-component--diodes--zener-STATE
- CE-199-U202-LO6-AC2-RANGE-electronic-component--diodes--photo-STATE
- PREREQ-1-algebraic-transposition-for-current-voltage-resistance-calculation-series-parallel-dc
- PREREQ-2-algebraic-transposition-for-power-calculation-series-parallel-dc
- PREREQ-3-algebraic-transposition-for-mechanical-energy-power-and-efficiency-calculation
- CAPREQ-1-algebraic-transposition-for-current-voltage-resistance-calculation-series-parallel-dc
- CAPREQ-2-algebraic-transposition-for-power-calculation-series-parallel-dc
- CAPREQ-3-algebraic-transposition-for-mechanical-energy-power-and-efficiency-calculation
