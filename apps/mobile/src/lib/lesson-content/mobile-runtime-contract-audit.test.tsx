/**
 * CC-12H: the mobile-side half of the "mobile runtime ready" gate (task
 * brief §14) -- the completeness audit this package's own brief demands:
 * "For every production-referenced answer type, AnswerInputDispatch has a
 * registered native implementation," proven against the REAL bundled
 * production content release (`MOBILE_CONTENT_PROJECTION`), not a
 * hand-maintained fixture.
 *
 * Root cause of the package that authorized this file: `AnswerInputDispatch`
 * had no case for `diagram_region` (a real production answer type), so the
 * Lesson Player crashed the instant a learner reached the parallel-resistor
 * lesson's `guided_identify_topology` step. The underlying architectural
 * weakness was that nothing mechanically proved dispatch coverage against
 * real content -- a new answer type (or a new diagram-blueprint reference,
 * or a worked-example blueprint whose `knownVariables` drift out of sync
 * with its formula family, both also found live during this same package)
 * could ship and only be discovered by a learner hitting a crash screen.
 *
 * This file renders every step of every lesson in the CURRENT bundled
 * production release through the REAL top-level per-step component
 * (`LessonStepView`) -- the same component `lesson-player.tsx` mounts for
 * every step a learner sees -- so it exercises the answer-input dispatch,
 * the diagram renderer, and worked-example building all through their real
 * integration, not three separate hand-rolled checks that could each pass
 * in isolation while the real composition still throws.
 */
import { render } from "@testing-library/react-native";
import { evaluateAnswer } from "@alp/calculation-engine";

import { LessonStepView } from "@/components/lesson/LessonStepView";
import { SUPPORTED_ANSWER_TYPES, type AnswerType } from "./answer-input-dispatch";
import { generateLessonQuestion } from "./generate-lesson-question";
import { bundledContentReleaseId, getLocalLesson, getLocalReleaseLessons } from "./local-content-registry";
import { resolveLessonStep } from "./resolve-lesson-step";

const RELEASE = bundledContentReleaseId();
const LESSONS = getLocalReleaseLessons(RELEASE);
// Every lesson in one release shares the same bundled projection/lookup --
// any single lesson's own record carries it, so there is no need to
// re-resolve it per lesson.
const ANY_RECORD = getLocalLesson({ lessonId: LESSONS[0]!.id, contentRelease: RELEASE });
const LOOKUP = ANY_RECORD.lookup;

describe(`CC-12H mobile runtime contract audit -- production release "${RELEASE}"`, () => {
  it(`covers a non-trivial real production release (found ${LESSONS.length} lessons)`, () => {
    // A guard against this audit silently auditing nothing (e.g. an empty
    // release) and reporting false confidence -- must match the release's
    // real, current lesson count, not a smaller stale expectation.
    expect(LESSONS.length).toBeGreaterThanOrEqual(20);
  });

  describe("answer-type coverage: every answer type referenced by any production question blueprint has a registered native input", () => {
    const referencedTypes = [...new Set(LOOKUP.questionBlueprints.map((b) => b.answer.type))].sort();

    it("found at least one production-referenced answer type (guards against an empty/broken lookup)", () => {
      expect(referencedTypes.length).toBeGreaterThan(0);
    });

    it.each(referencedTypes)('answer type "%s" is PRODUCTION_REFERENCED and has native support', (type) => {
      expect(SUPPORTED_ANSWER_TYPES).toContain(type as AnswerType);
    });
  });

  for (const lesson of LESSONS) {
    describe(`lesson "${lesson.id}" (${lesson.steps.length} steps)`, () => {
      for (const step of lesson.steps) {
        const questionInstance = step.questionBlueprintId
          ? generateLessonQuestion({
              blueprint: LOOKUP.questionBlueprints.find((b) => b.id === step.questionBlueprintId)!,
              formulaFamilies: LOOKUP.formulaFamilies,
              diagramBlueprints: LOOKUP.diagramBlueprints,
              workedExampleBlueprints: LOOKUP.workedExampleBlueprints,
              contentRelease: RELEASE,
              blueprintVersion: ANY_RECORD.questionBlueprintVersion,
              instanceId: "runtime_audit",
              stepId: step.id,
            })
          : null;

        // One render per `it()` -- rendering more than once inside a
        // single `it()` block silently corrupts later renders in this
        // same test FILE under RNTL (a documented hazard distinct from
        // the "never fire a synthetic layout event" one), so every
        // render below gets its own test.
        it(`step "${step.id}" (${step.type}${step.questionBlueprintId ? `, blueprint "${step.questionBlueprintId}"` : ""}) renders its unanswered state without throwing`, async () => {
          const resolved = resolveLessonStep(lesson, step.id, LOOKUP);
          await render(
            <LessonStepView
              resolved={resolved}
              questionInstance={questionInstance}
              evaluation={null}
              revealCorrectAnswer={false}
              onSubmit={() => {}}
              onContinue={() => {}}
            />,
          );
        });

        // Assessable steps additionally get their post-submission feedback
        // render exercised -- catches a distinct class of defect (e.g. a
        // misconception-description lookup, or a reveal-dependent diagram
        // state) that only manifests after evaluation, never on the
        // unanswered render above.
        if (questionInstance) {
          it(`step "${step.id}" (blueprint "${step.questionBlueprintId}") renders its correct-answer feedback state without throwing`, async () => {
            const resolved = resolveLessonStep(lesson, step.id, LOOKUP);
            const evaluation = evaluateAnswer(questionInstance, questionInstance.expected.value);
            await render(
              <LessonStepView
                resolved={resolved}
                questionInstance={questionInstance}
                evaluation={evaluation}
                revealCorrectAnswer
                onSubmit={() => {}}
                onContinue={() => {}}
              />,
            );
          });
        }
      }
    });
  }
});
