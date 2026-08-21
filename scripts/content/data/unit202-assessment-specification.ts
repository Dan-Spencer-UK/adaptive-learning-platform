/**
 * CC-09A: the official Unit 202 assessment specification (test 602), as
 * governed `AssessmentSpecification` data.
 *
 * Transcribed and verified directly from the same official handbook edition
 * as CV_KEY_R2 (City & Guilds 2365-02 Qualification Handbook, April 2026,
 * Version 1.12, fetched directly from cityandguilds.com), section "4.1 Test
 * Specifications" -- "Test: Unit 602 Principles of electrical science".
 *
 * This is official test STRUCTURE only (duration, question count,
 * per-Learning-Outcome allocation, permitted materials, pass boundary) --
 * never a mock paper, never a question. See
 * packages/content-schema/src/assessment-specification.ts's header
 * comment for the full scope boundary; `AssessmentBlueprint` (a future
 * deterministic mock-paper assembler consuming this data) is explicitly
 * deferred, not built here.
 */

import type { AssessmentSpecificationManifest } from "@alp/content-schema";

import { CV_KEY_R2, SV_CG, UNIT202_R2_LO_NODE_KEY_BY_NUMBER } from "./cc04-unit202-electrical-science.ts";

function loNodeKey(outcomeNumber: number): string {
  const key = UNIT202_R2_LO_NODE_KEY_BY_NUMBER.get(outcomeNumber);
  if (!key) {
    throw new Error(`unit202AssessmentSpecification: no CV_KEY_R2 Learning Outcome node built for LO${outcomeNumber}`);
  }
  return key;
}

export const unit202AssessmentSpecification: AssessmentSpecificationManifest = {
  specifications: [
    {
      id: "assessment-spec.2365-02.unit202.v1",
      schemaVersion: 1,
      curriculumVersionKey: CV_KEY_R2,
      qualificationCode: "2365-02",
      unitNumber: "202",
      unitTitle: "Principles of Electrical Science",
      assessmentNumber: "602",
      method: "ONLINE_MULTIPLE_CHOICE_TEST",
      durationMinutes: 90,
      totalQuestionCount: 40,
      permittedMaterials: { closedBook: true, calculator: "non_programmable" },
      approximatePassPercentage: 50,
      sourceVersionKey: SV_CG,
      outcomeAllocations: [
        { learningOutcomeNodeKey: loNodeKey(1), outcomeNumber: 1, questionCount: 2, questionPercentage: 5 },
        { learningOutcomeNodeKey: loNodeKey(2), outcomeNumber: 2, questionCount: 5, questionPercentage: 13 },
        { learningOutcomeNodeKey: loNodeKey(3), outcomeNumber: 3, questionCount: 7, questionPercentage: 18 },
        { learningOutcomeNodeKey: loNodeKey(4), outcomeNumber: 4, questionCount: 15, questionPercentage: 37 },
        { learningOutcomeNodeKey: loNodeKey(5), outcomeNumber: 5, questionCount: 7, questionPercentage: 17 },
        { learningOutcomeNodeKey: loNodeKey(6), outcomeNumber: 6, questionCount: 4, questionPercentage: 10 },
      ],
    },
  ],
};
