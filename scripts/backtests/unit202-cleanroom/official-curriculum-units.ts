/**
 * CC-19R1 DEFECT-A fix: the generic pipeline's `StandardPipelineInput`
 * requires an `officialCurriculumUnits: readonly OfficialCurriculumUnit[]`
 * registry -- CC-19R omitted it entirely. This is mechanical registry
 * construction from data ALREADY in curriculum-data.ts (LO/AC ids and
 * verbatim wording); it introduces no new semantic interpretation of
 * Unit 202 content.
 *
 * One entry per Learning Outcome (no parent) and one per Assessment
 * Criterion (parentCurriculumUnitId = its LO). `officialWording` is
 * verbatim -- see curriculum-data.ts's own module doc for provenance.
 */
import type { OfficialCurriculumUnit } from "@alp/qualification-pipeline";

import { ASSESSMENT_CRITERIA, LEARNING_OUTCOMES, HANDBOOK_SOURCE_REF, UNIT_202_HEADER } from "./curriculum-data.ts";

const QUALIFICATION_ID = "2365-02";

function loLocator(loId: string): string {
  const lo = LEARNING_OUTCOMES.find((l) => l.id === loId);
  if (!lo) throw new Error(`Unknown learning outcome id ${loId}`);
  return `Page ${lo.pageRef}, ${UNIT_202_HEADER.unitId} ${loId}`;
}

function acLocator(acId: string): string {
  const ac = ASSESSMENT_CRITERIA.find((a) => a.id === acId);
  if (!ac) throw new Error(`Unknown AC id ${acId}`);
  return `Page ${ac.pageRef}, ${acId}`;
}

export const OFFICIAL_CURRICULUM_UNITS: readonly OfficialCurriculumUnit[] = [
  ...LEARNING_OUTCOMES.map(
    (lo): OfficialCurriculumUnit => ({
      curriculumUnitId: lo.id,
      qualificationId: QUALIFICATION_ID,
      sourceRef: HANDBOOK_SOURCE_REF,
      sourceLocator: loLocator(lo.id),
      officialWording: lo.wording,
    }),
  ),
  ...ASSESSMENT_CRITERIA.map(
    (ac): OfficialCurriculumUnit => ({
      curriculumUnitId: ac.id,
      qualificationId: QUALIFICATION_ID,
      sourceRef: HANDBOOK_SOURCE_REF,
      sourceLocator: acLocator(ac.id),
      officialWording: ac.wording,
      learningOutcomeId: ac.loId,
      parentCurriculumUnitId: ac.loId,
    }),
  ),
];
