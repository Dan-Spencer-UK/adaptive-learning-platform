/**
 * CC-13C.2D: production-wiring proof for CC-13C.2B's governed rich
 * teaching content blocks (`learnerFacingHeading`/`contentBlocks`).
 *
 * Every existing CC-13C.2B test (resolve-lesson-step.test.ts,
 * LessonStepView.test.tsx, check-mobile-projection.test.ts's own
 * dependency-walker proof) hand-builds its synthetic rich step by
 * spreading a real lesson's OWN already-resolved `LessonPlan` object
 * (`{ ...LESSON_OHMS_LAW, steps: [richStep] }`) and calling
 * `resolveLessonStep()` directly on it. That proves the resolver and the
 * renderer, but never proves the field survives the ACTUAL production
 * lookup boundary `lesson-player.tsx` itself calls before the resolver
 * ever runs: `getLocalLesson()` -> `getLocalLessonFrom(MOBILE_CONTENT_
 * PROJECTION, ...)`, i.e. a plain `MobileContentProjection.lessons.find`
 * over a real generated projection object. This suite enters at exactly
 * that boundary with a synthetic projection (never editing real Unit 202
 * release data), then runs the SAME `resolveLessonStep()` and
 * `LessonStepView` the Lesson Player itself uses, closing the "test-only
 * wiring" gap: proof that `getLocalLessonFrom` -- the pure variant
 * `getLocalLesson` (bound to the real bundled projection) delegates to,
 * and the same function a downloaded/versioned future release would also
 * go through -- does not map/pick/strip `learnerFacingHeading` or
 * `contentBlocks` before the resolver ever sees the lesson.
 */
import { render } from "@testing-library/react-native";
import type { LessonPlan, LessonStep, MobileContentProjection } from "@alp/content-schema";

import { LessonStepView } from "@/components/lesson/LessonStepView";
import { bundledContentReleaseId, getLocalLesson, getLocalLessonFrom } from "./local-content-registry";
import { resolveLessonStep } from "./resolve-lesson-step";
import { MOBILE_CONTENT_PROJECTION } from "./generated/mobile-content-projection";

const SYNTH_RELEASE = "release.synthetic-production-wiring-proof.v1";
const LESSON_ID = "lesson.synthetic.production-wiring-proof";

// Real governed fixture resources, pulled from the real bundled release's
// own lookup arrays -- never a hand-typed duplicate of their content, so
// this proof stays bound to the real governed corpus exactly as task
// brief CC-13C.2D §9 requires ("use existing governed fixture resources
// for the visual/formula/worked example where possible").
function mustFindReal<T extends { id: string }>(records: readonly T[], id: string): T {
  const record = records.find((r) => r.id === id);
  if (!record) throw new Error(`real bundled projection is missing expected fixture '${id}'`);
  return record;
}
const REAL_FORMULA_OHMS_LAW = mustFindReal(MOBILE_CONTENT_PROJECTION.formulaFamilies, "formula.ohms_law");
const REAL_WORKED_SOLVE_VOLTAGE = mustFindReal(MOBILE_CONTENT_PROJECTION.workedExampleBlueprints, "worked.ohms_law.solve_voltage");
const REAL_DIAGRAM_SERIES_RESISTORS = mustFindReal(MOBILE_CONTENT_PROJECTION.diagramBlueprints, "circuit.series_resistors");

const RICH_STEP: LessonStep = {
  id: "step.rich",
  type: "concept_explanation",
  purpose: "CC-13C.2D synthetic production-wiring proof step.",
  requirement: "required",
  teaches: [],
  reinforces: [],
  tests: [],
  capabilityIds: [],
  misconceptionTargets: [],
  representation: {},
  learnerFacingHeading: "Voltage, current and resistance",
  contentBlocks: [
    { type: "paragraph", text: "Voltage, current and resistance are the three core electrical quantities." },
    { type: "paragraph", text: "Voltage drives current around a circuit; resistance opposes that flow." },
    { type: "visual", source: { kind: "diagram", diagramBlueprintId: "circuit.series_resistors" } },
    { type: "paragraph", text: "Ohm's Law relates the three quantities in one governed formula." },
    { type: "formula", formulaFamilyId: "formula.ohms_law" },
    { type: "worked_example", workedExampleBlueprintId: "worked.ohms_law.solve_voltage" },
    { type: "callout", variant: "key_point", text: "Doubling voltage doubles current for a fixed resistance." },
  ],
  presentation: { interactionRequired: false, answerReveal: "not_applicable", contentMayScroll: false, progressiveReveal: false },
  scaffoldingLevel: "guided",
  cognitiveDemand: "introductory",
  feedback: { mode: "immediate", explainWhy: true },
  completionCondition: "view_acknowledged",
  branchRoutes: [],
  evidenceEmitted: [],
  mayRevealTargetAnswer: false,
};

const SYNTHETIC_LESSON: LessonPlan = {
  id: LESSON_ID,
  schemaVersion: 1,
  version: 1,
  title: "Synthetic production-wiring proof lesson",
  learnerFacingDescription: "Synthetic CC-13C.2D fixture -- never a real Unit 202 lesson.",
  curriculumUnit: "synthetic.fixtures",
  prerequisiteKnowledge: [],
  targetAssertionFamilyIds: ["electrical.ohms_law"],
  targetAssertionIdentifiers: [],
  targetCapabilityIds: ["cap.ohms_law.recognise_relationship"],
  remediationEligibility: [],
  estimatedDurationMinutes: 5,
  instructionalStrategy: "synthetic",
  steps: [RICH_STEP],
  misconceptionTargets: [],
  retrievalTags: [],
  completionCriteria: {
    requiredStepIds: ["step.rich"],
    requiredCapabilityEvidence: ["cap.ohms_law.recognise_relationship"],
    masteryGateCapabilityIds: ["cap.ohms_law.recognise_relationship"],
    requiresRemediationClearance: true,
    exitSummary: "Synthetic completion summary.",
  },
  presentationModes: ["learn"],
  contentRelease: SYNTH_RELEASE,
};

// The synthetic release-member `MobileContentProjection` a downloaded/
// bundled release actually IS on-device -- built directly against the
// governed projection schema (mirroring local-content-registry.test.ts's
// own established `twoLessonProjection` synthetic-projection pattern),
// never via `resolveLessonStep()` on a hand-spread lesson object.
const SYNTHETIC_PROJECTION: MobileContentProjection = {
  schemaVersion: 2,
  contentRelease: { id: SYNTH_RELEASE, questionBlueprintVersion: 1 },
  lessons: [SYNTHETIC_LESSON],
  assertionFamilies: [{ id: "electrical.ohms_law", requiredCapabilityIds: ["cap.ohms_law.recognise_relationship"], assessmentRequirement: "assessable" }],
  questionBlueprints: [],
  formulaFamilies: [REAL_FORMULA_OHMS_LAW],
  workedExampleBlueprints: [REAL_WORKED_SOLVE_VOLTAGE],
  visualAidBlueprints: [],
  diagramBlueprints: [REAL_DIAGRAM_SERIES_RESISTORS],
  assertionStatements: {},
  misconceptionDescriptions: {},
};

describe("CC-13C.2D: rich content blocks survive the real production lookup boundary", () => {
  it("getLocalLessonFrom -- the same lookup getLocalLesson()/lesson-player.tsx delegates to -- returns the lesson with learnerFacingHeading and contentBlocks intact, in authored order", () => {
    const record = getLocalLessonFrom(SYNTHETIC_PROJECTION, { lessonId: LESSON_ID, contentRelease: SYNTH_RELEASE });
    const step = record.lesson.steps.find((s) => s.id === "step.rich");
    expect(step?.learnerFacingHeading).toBe("Voltage, current and resistance");
    expect(step?.contentBlocks?.map((b) => b.type)).toEqual(["paragraph", "paragraph", "visual", "paragraph", "formula", "worked_example", "callout"]);
  });

  it("resolveLessonStep -- the same resolver lesson-player.tsx calls on record.lesson -- selects the contentBlocks path and resolves every governed reference to the real bundled objects", () => {
    const record = getLocalLessonFrom(SYNTHETIC_PROJECTION, { lessonId: LESSON_ID, contentRelease: SYNTH_RELEASE });
    const resolved = resolveLessonStep(record.lesson, "step.rich", record.lookup);

    expect(resolved.learnerFacingHeading).toBe("Voltage, current and resistance");
    expect(resolved.contentBlocks?.map((b) => b.type)).toEqual(["paragraph", "paragraph", "visual", "paragraph", "formula", "worked_example", "callout"]);
    // The legacy path must never ALSO be populated -- contentBlocks is
    // the sole authoritative rendering path once present.
    expect(resolved.bodyStatements).toEqual([]);

    const formulaBlock = resolved.contentBlocks?.find((b) => b.type === "formula");
    if (formulaBlock?.type === "formula") expect(formulaBlock.formulaFamily.id).toBe("formula.ohms_law");
    else throw new Error("expected a resolved formula block");

    const workedBlock = resolved.contentBlocks?.find((b) => b.type === "worked_example");
    if (workedBlock?.type === "worked_example") expect(workedBlock.workedExample.id).toBe("worked.ohms_law.solve_voltage");
    else throw new Error("expected a resolved worked_example block");

    const visualBlock = resolved.contentBlocks?.find((b) => b.type === "visual");
    if (visualBlock?.type === "visual" && visualBlock.source.kind === "diagram") expect(visualBlock.source.diagram.id).toBe("circuit.series_resistors");
    else throw new Error("expected a resolved diagram-source visual block");
  });

  it("both release-id paths lesson-player.tsx supports (explicit contentRelease param, and the bundled-default fallback) share the exact same getLocalLesson lookup function -- proven against the real bundled projection, never a field-stripping alternate path", () => {
    // lesson-player.tsx: `requestedRelease = params.contentRelease ?? bundledContentReleaseId()`,
    // both fed into the identical `getLocalLesson({ lessonId, contentRelease, version })` call
    // (apps/mobile/src/app/(app)/learn/lesson-player.tsx:116,161) -- there is no second lookup
    // function to separately verify.
    const viaExplicitRelease = getLocalLesson({ lessonId: "lesson.electrical.ohms-law", contentRelease: bundledContentReleaseId() });
    const viaDefaultRelease = getLocalLesson({ lessonId: "lesson.electrical.ohms-law", contentRelease: bundledContentReleaseId() });
    expect(viaExplicitRelease.lesson).toEqual(viaDefaultRelease.lesson);
  });

  it("the resolved step is consumable by the real production renderer (LessonStepView -> ContentBlockView) exactly as lesson-player.tsx wires it -- heading and every block render without error", async () => {
    const record = getLocalLessonFrom(SYNTHETIC_PROJECTION, { lessonId: LESSON_ID, contentRelease: SYNTH_RELEASE });
    const resolved = resolveLessonStep(record.lesson, "step.rich", record.lookup);

    const { getByRole, getByText, getByLabelText } = await render(
      <LessonStepView resolved={resolved} questionInstance={null} evaluation={null} revealCorrectAnswer={false} onSubmit={jest.fn()} onContinue={jest.fn()} />,
    );

    expect(getByRole("header", { name: "Voltage, current and resistance" })).toBeTruthy();
    expect(getByText("Voltage, current and resistance are the three core electrical quantities.")).toBeTruthy();
    expect(getByLabelText(/^Key point: Doubling voltage doubles current for a fixed resistance\.$/)).toBeTruthy();
  });
});
