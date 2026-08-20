import { describe, expect, it } from "vitest";
import { assembleLessonInstance } from "./assembler.ts";
import { ASSEMBLY_POLICY_VERSION } from "./types.ts";
import type { AssemblyContext, LearnerEvidenceSnapshot } from "./types.ts";
import {
  SYNTHETIC_MAIN_LESSON,
  SYNTHETIC_PREREQ_LESSON,
  SYNTHETIC_PREREQ_LESSON_DUPLICATE,
  SYNTH_CORE_CAPABILITY,
  SYNTH_PREREQ_FAMILY,
} from "./test-fixtures.ts";
import { AmbiguousPrerequisiteCandidatesError } from "./types.ts";

function evidence(overrides: Partial<LearnerEvidenceSnapshot> = {}): LearnerEvidenceSnapshot {
  return {
    learnerId: "learner.001",
    capabilityStatus: new Map(),
    familyStatus: new Map(),
    misconceptionsEvidenced: new Set(),
    retrievalDueTags: new Set(),
    retrievalDueCapabilityIds: new Set(),
    ...overrides,
  };
}

function context(allLessons: readonly (typeof SYNTHETIC_MAIN_LESSON)[] = [SYNTHETIC_MAIN_LESSON]): AssemblyContext {
  return { assemblyPolicyVersion: ASSEMBLY_POLICY_VERSION, allLessons };
}

/** Required steps that are always present regardless of evidence, in canonical order. */
const ALWAYS_INCLUDED = ["orientation", "core_concept", "misconception_check", "transfer_step", "recap", "exit_completion"];

describe("assembleLessonInstance -- new learner (NOT_ASSESSED, no evidence)", () => {
  it("returns status 'ready' and includes every required step plus conditional_skip_if_mastered steps (never gates teaching behind a diagnostic, WP1.3 §39.1)", () => {
    const result = assembleLessonInstance(SYNTHETIC_MAIN_LESSON, evidence(), context());
    expect(result.status).toBe("ready");
    if (result.status !== "ready") return;
    for (const stepId of ALWAYS_INCLUDED) {
      expect(result.instance.includedStepIds).toContain(stepId);
    }
    expect(result.instance.includedStepIds).toContain("skip_if_mastered_practice");
    expect(result.instance.includedStepIds).not.toContain("remediation_step");
  });

  it("never includes a conditional_remediation_only step in the pre-session sequence", () => {
    const result = assembleLessonInstance(SYNTHETIC_MAIN_LESSON, evidence(), context());
    if (result.status !== "ready") throw new Error("expected ready");
    const remediationDecision = result.instance.stepDecisions.find((d) => d.stepId === "remediation_step");
    expect(remediationDecision).toEqual({
      stepId: "remediation_step",
      included: false,
      reason: "conditional_remediation_not_entered",
      detail: expect.any(String),
    });
  });
});

describe("assembleLessonInstance -- capability mastery skip", () => {
  it("skips a conditional_skip_if_mastered step when the capability is PROVISIONALLY_SECURE or TRANSFER_SECURE", () => {
    for (const status of ["PROVISIONALLY_SECURE", "TRANSFER_SECURE"] as const) {
      const result = assembleLessonInstance(
        SYNTHETIC_MAIN_LESSON,
        evidence({ capabilityStatus: new Map([[SYNTH_CORE_CAPABILITY, status]]) }),
        context(),
      );
      if (result.status !== "ready") throw new Error("expected ready");
      expect(result.instance.includedStepIds).not.toContain("skip_if_mastered_practice");
      const decision = result.instance.stepDecisions.find((d) => d.stepId === "skip_if_mastered_practice");
      expect(decision?.reason).toBe("capability_mastered_skip");
    }
  });

  it("includes a conditional_skip_if_mastered step for every non-mastered status, including WEAK/CONFLICTING/EMERGING/INSUFFICIENT_EVIDENCE", () => {
    for (const status of ["NOT_ASSESSED", "INSUFFICIENT_EVIDENCE", "EMERGING", "WEAK", "CONFLICTING"] as const) {
      const result = assembleLessonInstance(
        SYNTHETIC_MAIN_LESSON,
        evidence({ capabilityStatus: new Map([[SYNTH_CORE_CAPABILITY, status]]) }),
        context(),
      );
      if (result.status !== "ready") throw new Error("expected ready");
      expect(result.instance.includedStepIds).toContain("skip_if_mastered_practice");
    }
  });

  it("required steps are never skipped regardless of mastery", () => {
    const result = assembleLessonInstance(
      SYNTHETIC_MAIN_LESSON,
      evidence({ capabilityStatus: new Map([[SYNTH_CORE_CAPABILITY, "TRANSFER_SECURE"]]) }),
      context(),
    );
    if (result.status !== "ready") throw new Error("expected ready");
    for (const stepId of ALWAYS_INCLUDED) {
      expect(result.instance.includedStepIds).toContain(stepId);
    }
  });
});

describe("assembleLessonInstance -- retrieval participation", () => {
  it("includes the retrieval_check step, with reason retrieval_due, when a relevant tag is due", () => {
    const result = assembleLessonInstance(SYNTHETIC_MAIN_LESSON, evidence({ retrievalDueTags: new Set(["synth.retrieval_tag"]) }), context());
    if (result.status !== "ready") throw new Error("expected ready");
    expect(result.instance.includedStepIds).toContain("retrieval_step");
    expect(result.instance.stepDecisions.find((d) => d.stepId === "retrieval_step")?.reason).toBe("retrieval_due");
  });

  it("omits the retrieval_check step, with reason retrieval_not_due, when nothing relevant is due", () => {
    const result = assembleLessonInstance(SYNTHETIC_MAIN_LESSON, evidence(), context());
    if (result.status !== "ready") throw new Error("expected ready");
    expect(result.instance.includedStepIds).not.toContain("retrieval_step");
    expect(result.instance.stepDecisions.find((d) => d.stepId === "retrieval_step")?.reason).toBe("retrieval_not_due");
  });

  it("also participates when a capability id (not just a retrievalTag) is due", () => {
    const result = assembleLessonInstance(SYNTHETIC_MAIN_LESSON, evidence({ retrievalDueCapabilityIds: new Set([SYNTH_CORE_CAPABILITY]) }), context());
    if (result.status !== "ready") throw new Error("expected ready");
    expect(result.instance.includedStepIds).toContain("retrieval_step");
  });
});

describe("assembleLessonInstance -- prerequisite resolution", () => {
  it("returns prerequisite_required with the prerequisite lesson's own assembled instance when exactly one candidate exists and the family is WEAK", () => {
    const result = assembleLessonInstance(
      SYNTHETIC_MAIN_LESSON,
      evidence({ familyStatus: new Map([[SYNTH_PREREQ_FAMILY, "WEAK"]]) }),
      context([SYNTHETIC_MAIN_LESSON, SYNTHETIC_PREREQ_LESSON]),
    );
    expect(result.status).toBe("prerequisite_required");
    if (result.status !== "prerequisite_required") return;
    expect(result.unmetFamilyId).toBe(SYNTH_PREREQ_FAMILY);
    expect(result.prerequisiteInstance.lessonId).toBe(SYNTHETIC_PREREQ_LESSON.id);
    expect(result.mainLessonPending.id).toBe(SYNTHETIC_MAIN_LESSON.id);
  });

  it("also gates on CONFLICTING prerequisite evidence", () => {
    const result = assembleLessonInstance(
      SYNTHETIC_MAIN_LESSON,
      evidence({ familyStatus: new Map([[SYNTH_PREREQ_FAMILY, "CONFLICTING"]]) }),
      context([SYNTHETIC_MAIN_LESSON, SYNTHETIC_PREREQ_LESSON]),
    );
    expect(result.status).toBe("prerequisite_required");
  });

  it("does NOT gate teaching on NOT_ASSESSED/INSUFFICIENT_EVIDENCE/EMERGING prerequisite status (WP1.3 §39.1)", () => {
    for (const status of ["NOT_ASSESSED", "INSUFFICIENT_EVIDENCE", "EMERGING"] as const) {
      const result = assembleLessonInstance(
        SYNTHETIC_MAIN_LESSON,
        evidence({ familyStatus: new Map([[SYNTH_PREREQ_FAMILY, status]]) }),
        context([SYNTHETIC_MAIN_LESSON, SYNTHETIC_PREREQ_LESSON]),
      );
      expect(result.status).toBe("ready");
    }
  });

  it("returns prerequisite_unresolved (never proceeds as if the weakness did not exist) when zero remediation candidates exist", () => {
    const result = assembleLessonInstance(
      SYNTHETIC_MAIN_LESSON,
      evidence({ familyStatus: new Map([[SYNTH_PREREQ_FAMILY, "WEAK"]]) }),
      context([SYNTHETIC_MAIN_LESSON]),
    );
    expect(result).toEqual({
      status: "prerequisite_unresolved",
      unresolved: [{ assertionFamilyId: SYNTH_PREREQ_FAMILY, reason: "no_candidate_lesson" }],
    });
  });

  it("throws (fails deterministically, never guesses) when multiple ambiguous remediation candidates exist", () => {
    expect(() =>
      assembleLessonInstance(
        SYNTHETIC_MAIN_LESSON,
        evidence({ familyStatus: new Map([[SYNTH_PREREQ_FAMILY, "WEAK"]]) }),
        context([SYNTHETIC_MAIN_LESSON, SYNTHETIC_PREREQ_LESSON, SYNTHETIC_PREREQ_LESSON_DUPLICATE]),
      ),
    ).toThrow(AmbiguousPrerequisiteCandidatesError);
  });
});

describe("assembleLessonInstance -- completion contract passthrough", () => {
  it("carries the canonical lesson's completionCriteria through unmodified", () => {
    const result = assembleLessonInstance(SYNTHETIC_MAIN_LESSON, evidence(), context());
    if (result.status !== "ready") throw new Error("expected ready");
    expect(result.instance.completionCriteria).toEqual(SYNTHETIC_MAIN_LESSON.completionCriteria);
  });
});

describe("assembleLessonInstance -- determinism and identity", () => {
  it("produces identical output for identical inputs (pure function)", () => {
    const e = evidence({ capabilityStatus: new Map([[SYNTH_CORE_CAPABILITY, "EMERGING"]]) });
    const first = assembleLessonInstance(SYNTHETIC_MAIN_LESSON, e, context());
    const second = assembleLessonInstance(SYNTHETIC_MAIN_LESSON, e, context());
    expect(first).toEqual(second);
  });

  it("produces the same instanceId when evidence Map/Set entries are constructed in a different order", () => {
    const evidenceA = evidence({
      capabilityStatus: new Map([
        [SYNTH_CORE_CAPABILITY, "EMERGING"],
        [SYNTH_PREREQ_FAMILY, "PROVISIONALLY_SECURE"],
      ]),
      retrievalDueTags: new Set(["a", "b"]),
      retrievalDueCapabilityIds: new Set(),
    });
    const evidenceB = evidence({
      capabilityStatus: new Map([
        [SYNTH_PREREQ_FAMILY, "PROVISIONALLY_SECURE"],
        [SYNTH_CORE_CAPABILITY, "EMERGING"],
      ]),
      retrievalDueTags: new Set(["b", "a"]),
      retrievalDueCapabilityIds: new Set(),
    });
    const resultA = assembleLessonInstance(SYNTHETIC_MAIN_LESSON, evidenceA, context());
    const resultB = assembleLessonInstance(SYNTHETIC_MAIN_LESSON, evidenceB, context());
    if (resultA.status !== "ready" || resultB.status !== "ready") throw new Error("expected ready");
    expect(resultA.instance.instanceId).toBe(resultB.instance.instanceId);
  });

  it("produces a different instanceId when evidence materially changes", () => {
    const resultA = assembleLessonInstance(SYNTHETIC_MAIN_LESSON, evidence(), context());
    const resultB = assembleLessonInstance(
      SYNTHETIC_MAIN_LESSON,
      evidence({ capabilityStatus: new Map([[SYNTH_CORE_CAPABILITY, "TRANSFER_SECURE"]]) }),
      context(),
    );
    if (resultA.status !== "ready" || resultB.status !== "ready") throw new Error("expected ready");
    expect(resultA.instance.instanceId).not.toBe(resultB.instance.instanceId);
    expect(resultA.instance.includedStepIds).not.toEqual(resultB.instance.includedStepIds);
  });

  it("produces a different instanceId for a different lesson version", () => {
    const versionedLesson = { ...SYNTHETIC_MAIN_LESSON, version: 2 };
    const resultA = assembleLessonInstance(SYNTHETIC_MAIN_LESSON, evidence(), context());
    const resultB = assembleLessonInstance(versionedLesson, evidence(), context([versionedLesson]));
    if (resultA.status !== "ready" || resultB.status !== "ready") throw new Error("expected ready");
    expect(resultA.instance.instanceId).not.toBe(resultB.instance.instanceId);
  });

  it("produces a different instanceId for a different assembly policy version", () => {
    const resultA = assembleLessonInstance(SYNTHETIC_MAIN_LESSON, evidence(), context());
    const resultB = assembleLessonInstance(SYNTHETIC_MAIN_LESSON, evidence(), { assemblyPolicyVersion: 2, allLessons: [SYNTHETIC_MAIN_LESSON] });
    if (resultA.status !== "ready" || resultB.status !== "ready") throw new Error("expected ready");
    expect(resultA.instance.instanceId).not.toBe(resultB.instance.instanceId);
  });

  it("does not mutate its canonical LessonPlan input", () => {
    const snapshot = JSON.parse(JSON.stringify(SYNTHETIC_MAIN_LESSON));
    assembleLessonInstance(SYNTHETIC_MAIN_LESSON, evidence({ capabilityStatus: new Map([[SYNTH_CORE_CAPABILITY, "TRANSFER_SECURE"]]) }), context());
    expect(SYNTHETIC_MAIN_LESSON).toEqual(snapshot);
  });

  it("does not mutate its evidence snapshot input", () => {
    const e = evidence({ capabilityStatus: new Map([[SYNTH_CORE_CAPABILITY, "EMERGING"]]) });
    const snapshotCapabilities = new Map(e.capabilityStatus);
    assembleLessonInstance(SYNTHETIC_MAIN_LESSON, e, context());
    expect(e.capabilityStatus).toEqual(snapshotCapabilities);
  });

  it("round-trips through JSON with no loss (plain serializable data, task brief §18)", () => {
    const result = assembleLessonInstance(SYNTHETIC_MAIN_LESSON, evidence({ retrievalDueTags: new Set(["synth.retrieval_tag"]) }), context());
    if (result.status !== "ready") throw new Error("expected ready");
    const roundTripped = JSON.parse(JSON.stringify(result.instance));
    expect(roundTripped).toEqual(result.instance);
  });
});

describe("assembleLessonInstance -- evidence namespace separation (CC-06D, Correction F)", () => {
  it("a prerequisite FAMILY id placed in capabilityStatus does NOT trigger prerequisite remediation (family ids cannot silently operate as capability ids)", () => {
    const result = assembleLessonInstance(
      SYNTHETIC_MAIN_LESSON,
      evidence({ capabilityStatus: new Map([[SYNTH_PREREQ_FAMILY, "WEAK"]]) }),
      context([SYNTHETIC_MAIN_LESSON, SYNTHETIC_PREREQ_LESSON]),
    );
    expect(result.status).toBe("ready");
  });

  it("a CAPABILITY id placed in familyStatus does NOT influence the conditional skip mastery gate", () => {
    const result = assembleLessonInstance(
      SYNTHETIC_MAIN_LESSON,
      evidence({ familyStatus: new Map([[SYNTH_CORE_CAPABILITY, "TRANSFER_SECURE"]]) }),
      context(),
    );
    if (result.status !== "ready") throw new Error("expected ready");
    expect(result.instance.includedStepIds).toContain("skip_if_mastered_practice");
  });

  it("a capability id placed in retrievalDueTags does NOT make a retrieval step due (tag and capability keyspaces are separate)", () => {
    const result = assembleLessonInstance(SYNTHETIC_MAIN_LESSON, evidence({ retrievalDueTags: new Set([SYNTH_CORE_CAPABILITY]) }), context());
    if (result.status !== "ready") throw new Error("expected ready");
    expect(result.instance.includedStepIds).not.toContain("retrieval_step");
  });

  it("a lesson retrieval tag placed in retrievalDueCapabilityIds does NOT make a retrieval step due", () => {
    const result = assembleLessonInstance(SYNTHETIC_MAIN_LESSON, evidence({ retrievalDueCapabilityIds: new Set(["synth.retrieval_tag"]) }), context());
    if (result.status !== "ready") throw new Error("expected ready");
    expect(result.instance.includedStepIds).not.toContain("retrieval_step");
  });

  it("mastery gating uses the explicit masteryGateCapabilityId, never authored array order", () => {
    // A skip step whose evidenceEmitted[0]/capabilityIds[0] name a DIFFERENT
    // (mastered) capability than the explicit gate: the step must still be
    // included, because only the declared gate capability controls the skip.
    const decoyCapability = "cap.synth.decoy_first_in_array";
    const lesson = {
      ...SYNTHETIC_MAIN_LESSON,
      steps: SYNTHETIC_MAIN_LESSON.steps.map((step) =>
        step.id === "skip_if_mastered_practice"
          ? { ...step, capabilityIds: [decoyCapability, SYNTH_CORE_CAPABILITY], evidenceEmitted: [decoyCapability, SYNTH_CORE_CAPABILITY] }
          : step,
      ),
    };
    const result = assembleLessonInstance(lesson, evidence({ capabilityStatus: new Map([[decoyCapability, "TRANSFER_SECURE"]]) }), {
      assemblyPolicyVersion: ASSEMBLY_POLICY_VERSION,
      allLessons: [lesson],
    });
    if (result.status !== "ready") throw new Error("expected ready");
    expect(result.instance.includedStepIds).toContain("skip_if_mastered_practice");

    // And when the DECLARED gate capability is mastered, the skip happens
    // even though it is not first in either authored array.
    const gateMastered = assembleLessonInstance(lesson, evidence({ capabilityStatus: new Map([[SYNTH_CORE_CAPABILITY, "TRANSFER_SECURE"]]) }), {
      assemblyPolicyVersion: ASSEMBLY_POLICY_VERSION,
      allLessons: [lesson],
    });
    if (gateMastered.status !== "ready") throw new Error("expected ready");
    expect(gateMastered.instance.includedStepIds).not.toContain("skip_if_mastered_practice");
  });

  it("fails loudly on a non-retrieval conditional_skip_if_mastered step with no masteryGateCapabilityId (defensive check behind the schema gate)", () => {
    const lesson = {
      ...SYNTHETIC_MAIN_LESSON,
      steps: SYNTHETIC_MAIN_LESSON.steps.map((step) => (step.id === "skip_if_mastered_practice" ? { ...step, masteryGateCapabilityId: undefined } : step)),
    };
    expect(() =>
      assembleLessonInstance(lesson, evidence(), { assemblyPolicyVersion: ASSEMBLY_POLICY_VERSION, allLessons: [lesson] }),
    ).toThrow(/masteryGateCapabilityId/);
  });
});
