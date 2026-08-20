/**
 * Mastery policy v1 test matrix (task brief §31, scenarios A-R) --
 * synthetic fixtures only; real-Ohm's-Law proof lives in
 * scripts/content/prove-evidence-derivation.ts.
 */
import { beforeEach, describe, expect, it } from "vitest";

import { deriveLearnerState, misconceptionDiscriminationBasis } from "./derivation.ts";
import { toLearnerEvidenceSnapshot } from "./snapshot.ts";
import {
  attempt,
  BP_CLASSIFY,
  BP_MCQ3,
  CAP_A,
  CAP_DIAG,
  CAP_SUPPORTING,
  FAMILY_TARGET,
  FAMILY_UNKNOWN,
  MIS_DIRECT_BINARY,
  MIS_DIRECT_CLASSIFY,
  MIS_DIRECT_MCQ3,
  MIS_SUGGESTIVE,
  resetAttemptClock,
  STEP_BINARY,
  STEP_CLASSIFY,
  STEP_GUIDED_A,
  STEP_INDEPENDENT_A1,
  STEP_INDEPENDENT_A2,
  STEP_INDEPENDENT_A3,
  STEP_INDEPENDENT_A4,
  STEP_INDEPENDENT_B1,
  STEP_INDEPENDENT_B2,
  STEP_MCQ3,
  STEP_TRANSFER_A,
  STEP_UNKNOWN_FAMILY,
  SYNTH_CONTENT,
  SYNTH_LEARNER,
} from "./test-fixtures.ts";
import { MASTERY_POLICY_VERSION, type LearnerAttemptRecord } from "./types.ts";

beforeEach(() => resetAttemptClock());

function derive(attempts: readonly LearnerAttemptRecord[]) {
  return deriveLearnerState({ learnerId: SYNTH_LEARNER, attempts, content: SYNTH_CONTENT });
}

function capabilityState(attempts: readonly LearnerAttemptRecord[], capabilityId: string) {
  return derive(attempts).capabilities.find((c) => c.capabilityId === capabilityId);
}

describe("A/B -- no evidence vs insufficient evidence", () => {
  it("A: no attempts derive an empty (NOT_ASSESSED-everywhere) state", () => {
    const derived = derive([]);
    expect(derived.capabilities).toEqual([]);
    expect(derived.families).toEqual([]);
    expect(derived.misconceptions).toEqual([]);
    const snapshot = toLearnerEvidenceSnapshot(derived);
    expect(snapshot.capabilityStatus.size).toBe(0);
    expect(snapshot.familyStatus.size).toBe(0);
    expect(snapshot.misconceptionsEvidenced.size).toBe(0);
  });

  it("B: a single scaffolded (guided) success is INSUFFICIENT_EVIDENCE, not EMERGING", () => {
    const cap = capabilityState([attempt({ stepId: STEP_GUIDED_A, correct: true })], CAP_A);
    expect(cap?.state).toBe("INSUFFICIENT_EVIDENCE");
    expect(cap?.counts.scaffoldedSuccesses).toBe(1);
  });

  it("B: a single meaningful failure is INSUFFICIENT_EVIDENCE, never WEAK (one wrong answer is not weakness)", () => {
    const cap = capabilityState([attempt({ stepId: STEP_INDEPENDENT_A1, correct: false })], CAP_A);
    expect(cap?.state).toBe("INSUFFICIENT_EVIDENCE");
    expect(cap?.counts.meaningfulFailures).toBe(1);
  });

  it("B: supporting-capability evidence alone is INSUFFICIENT_EVIDENCE (cautious positive prerequisite inference, WP1.3 §48)", () => {
    const derived = derive([attempt({ stepId: STEP_INDEPENDENT_A1, correct: true })]);
    const supporting = derived.capabilities.find((c) => c.capabilityId === CAP_SUPPORTING);
    expect(supporting?.state).toBe("INSUFFICIENT_EVIDENCE");
    expect(supporting?.counts.supportingSuccesses).toBe(1);
  });
});

describe("C/D/E -- emerging, provisional, transfer security", () => {
  it("C: one genuine independent first-attempt success is EMERGING -- one correct answer is never mastery", () => {
    const cap = capabilityState([attempt({ stepId: STEP_INDEPENDENT_A1, correct: true })], CAP_A);
    expect(cap?.state).toBe("EMERGING");
  });

  it("D: two independent successes with no later failure are PROVISIONALLY_SECURE", () => {
    const cap = capabilityState(
      [attempt({ stepId: STEP_INDEPENDENT_A1, correct: true }), attempt({ stepId: STEP_INDEPENDENT_A2, correct: true })],
      CAP_A,
    );
    expect(cap?.state).toBe("PROVISIONALLY_SECURE");
    expect(cap?.ruleApplied).toBe("provisionally_secure.v1");
  });

  it("E: transfer evidence upgrades to TRANSFER_SECURE only alongside repeated independent success", () => {
    const onlyTransfer = capabilityState([attempt({ stepId: STEP_TRANSFER_A, correct: true })], CAP_A);
    expect(onlyTransfer?.state).toBe("EMERGING");

    const cap = capabilityState(
      [attempt({ stepId: STEP_INDEPENDENT_A1, correct: true }), attempt({ stepId: STEP_TRANSFER_A, correct: true })],
      CAP_A,
    );
    expect(cap?.state).toBe("TRANSFER_SECURE");
    expect(cap?.counts.transferSuccesses).toBe(1);
  });
});

describe("F/G -- weakness and conflict", () => {
  it("F: repeated meaningful failure with no independent success is WEAK", () => {
    const cap = capabilityState(
      [attempt({ stepId: STEP_INDEPENDENT_A1, correct: false }), attempt({ stepId: STEP_INDEPENDENT_A2, correct: false })],
      CAP_A,
    );
    expect(cap?.state).toBe("WEAK");
  });

  it("F: scaffolded success does not offset repeated independent failure", () => {
    const cap = capabilityState(
      [
        attempt({ stepId: STEP_GUIDED_A, correct: true }),
        attempt({ stepId: STEP_INDEPENDENT_A1, correct: false }),
        attempt({ stepId: STEP_INDEPENDENT_A2, correct: false }),
      ],
      CAP_A,
    );
    expect(cap?.state).toBe("WEAK");
  });

  it("G: strong success followed by repeated meaningful failure is CONFLICTING", () => {
    const cap = capabilityState(
      [
        attempt({ stepId: STEP_INDEPENDENT_A1, correct: true }),
        attempt({ stepId: STEP_INDEPENDENT_A2, correct: true }),
        attempt({ stepId: STEP_INDEPENDENT_A3, correct: false }),
        attempt({ stepId: STEP_INDEPENDENT_A4, correct: false }),
      ],
      CAP_A,
    );
    expect(cap?.state).toBe("CONFLICTING");
    expect(cap?.counts.failuresAfterFirstIndependentSuccess).toBe(2);
  });

  it("G-inverse: the same counts as an improving trajectory (failures BEFORE the successes) are PROVISIONALLY_SECURE, not CONFLICTING", () => {
    const cap = capabilityState(
      [
        attempt({ stepId: STEP_INDEPENDENT_A3, correct: false }),
        attempt({ stepId: STEP_INDEPENDENT_A4, correct: false }),
        attempt({ stepId: STEP_INDEPENDENT_A1, correct: true }),
        attempt({ stepId: STEP_INDEPENDENT_A2, correct: true }),
      ],
      CAP_A,
    );
    expect(cap?.state).toBe("PROVISIONALLY_SECURE");
    expect(cap?.counts.failuresAfterFirstIndependentSuccess).toBe(0);
  });

  it("a single failure after security downgrades to EMERGING (uncertainty), never straight to WEAK", () => {
    const cap = capabilityState(
      [
        attempt({ stepId: STEP_INDEPENDENT_A1, correct: true }),
        attempt({ stepId: STEP_INDEPENDENT_A2, correct: true }),
        attempt({ stepId: STEP_INDEPENDENT_A3, correct: false }),
      ],
      CAP_A,
    );
    expect(cap?.state).toBe("EMERGING");
  });
});

describe("H/I/J -- reveal, retry, scaffolding honesty", () => {
  it("H: a correct answer after the answer was revealed never establishes mastery (INSUFFICIENT_EVIDENCE, visit discounted)", () => {
    const cap = capabilityState(
      [attempt({ stepId: STEP_INDEPENDENT_A1, correct: true, answerRevealedBeforeAttempt: true, attemptIndex: 2 })],
      CAP_A,
    );
    expect(cap?.state).toBe("INSUFFICIENT_EVIDENCE");
    expect(cap?.counts.discountedRevealedOutcomes).toBe(1);
    expect(cap?.counts.independentSuccesses).toBe(0);
  });

  it("H: many post-reveal successes still never reach EMERGING or better", () => {
    const cap = capabilityState(
      [
        attempt({ stepId: STEP_INDEPENDENT_A1, correct: true, answerRevealedBeforeAttempt: true }),
        attempt({ stepId: STEP_INDEPENDENT_A2, correct: true, answerRevealedBeforeAttempt: true }),
        attempt({ stepId: STEP_INDEPENDENT_A3, correct: true, answerRevealedBeforeAttempt: true }),
      ],
      CAP_A,
    );
    expect(cap?.state).toBe("INSUFFICIENT_EVIDENCE");
  });

  it("I: one un-revealed retry success is genuine but weaker evidence (INSUFFICIENT_EVIDENCE alone; two reach EMERGING)", () => {
    const oneRetry = capabilityState(
      [attempt({ stepId: STEP_INDEPENDENT_A1, correct: false }), attempt({ stepId: STEP_INDEPENDENT_A1, correct: true, attemptIndex: 2 })],
      CAP_A,
    );
    expect(oneRetry?.state).toBe("INSUFFICIENT_EVIDENCE");
    expect(oneRetry?.counts.retrySuccesses).toBe(1);
    // The failed first attempt inside a recovered visit is NOT a separate meaningful failure.
    expect(oneRetry?.counts.meaningfulFailures).toBe(0);

    const twoRetries = capabilityState(
      [
        attempt({ stepId: STEP_INDEPENDENT_A1, correct: false }),
        attempt({ stepId: STEP_INDEPENDENT_A1, correct: true, attemptIndex: 2 }),
        attempt({ stepId: STEP_INDEPENDENT_A2, correct: false }),
        attempt({ stepId: STEP_INDEPENDENT_A2, correct: true, attemptIndex: 2 }),
      ],
      CAP_A,
    );
    expect(twoRetries?.state).toBe("EMERGING");
  });

  it("I: a retry success is distinguishable from a first-attempt success (different counters, different resulting state)", () => {
    const firstAttempt = capabilityState([attempt({ stepId: STEP_INDEPENDENT_A1, correct: true })], CAP_A);
    const retry = capabilityState(
      [attempt({ stepId: STEP_INDEPENDENT_A1, correct: false }), attempt({ stepId: STEP_INDEPENDENT_A1, correct: true, attemptIndex: 2 })],
      CAP_A,
    );
    expect(firstAttempt?.counts.independentSuccesses).toBe(1);
    expect(retry?.counts.independentSuccesses).toBe(0);
    expect(firstAttempt?.state).not.toBe(retry?.state);
  });

  it("J: scaffolded successes never produce a secure state, however many", () => {
    const cap = capabilityState(
      [
        attempt({ stepId: STEP_GUIDED_A, correct: true }),
        attempt({ stepId: STEP_GUIDED_A, correct: true, sessionKey: "sess-2" }),
        attempt({ stepId: STEP_GUIDED_A, correct: true, sessionKey: "sess-3" }),
      ],
      CAP_A,
    );
    expect(cap?.state).toBe("EMERGING");
    expect(cap?.counts.independentSuccesses).toBe(0);
  });

  it("J: repeated non-transfer independent success is PROVISIONALLY_SECURE, never TRANSFER_SECURE", () => {
    const cap = capabilityState(
      [
        attempt({ stepId: STEP_INDEPENDENT_A1, correct: true }),
        attempt({ stepId: STEP_INDEPENDENT_A2, correct: true }),
        attempt({ stepId: STEP_INDEPENDENT_A3, correct: true }),
      ],
      CAP_A,
    );
    expect(cap?.state).toBe("PROVISIONALLY_SECURE");
  });
});

describe("K/L -- misconception evidence trust contract (task brief §7/§33)", () => {
  it("K: a generic wrong numeric answer NEVER creates specific misconception evidence, even when the blueprint declares a (suggestive) target", () => {
    const derived = derive([attempt({ stepId: STEP_INDEPENDENT_A1, correct: false })]);
    expect(derived.misconceptions.find((m) => m.misconceptionId === MIS_SUGGESTIVE)).toBeUndefined();
    expect(derived.misconceptions).toEqual([]);
    // The failure still contributes generic capability evidence.
    expect(derived.capabilities.find((c) => c.capabilityId === CAP_A)?.counts.meaningfulFailures).toBe(1);
  });

  it("K: a wrong answer on a 3-option MCQ with a direct target is NOT admissible (the wrong option is not necessarily the misconception distractor)", () => {
    const derived = derive([attempt({ stepId: STEP_MCQ3, correct: false })]);
    expect(derived.misconceptions.find((m) => m.misconceptionId === MIS_DIRECT_MCQ3)).toBeUndefined();
    expect(misconceptionDiscriminationBasis(BP_MCQ3)).toBeNull();
  });

  it("L: an incorrect governed error-classification interaction creates specific misconception evidence with an explicit basis", () => {
    const derived = derive([attempt({ stepId: STEP_CLASSIFY, correct: false })]);
    const mis = derived.misconceptions.find((m) => m.misconceptionId === MIS_DIRECT_CLASSIFY);
    expect(mis?.currentlyEvidenced).toBe(true);
    expect(mis?.events[0]?.basis).toBe("error_classification_incorrect");
    expect(mis?.events[0]?.strength).toBe("direct");
    expect(misconceptionDiscriminationBasis(BP_CLASSIFY)).toBe("error_classification_incorrect");
  });

  it("L: an incorrect two-option discriminator creates specific misconception evidence with the binary basis", () => {
    const derived = derive([attempt({ stepId: STEP_BINARY, correct: false })]);
    const mis = derived.misconceptions.find((m) => m.misconceptionId === MIS_DIRECT_BINARY);
    expect(mis?.currentlyEvidenced).toBe(true);
    expect(mis?.events[0]?.basis).toBe("binary_discriminator_incorrect");
  });

  it("L: a later correct discriminating interaction clears currency without erasing the historical evidence", () => {
    const derived = derive([
      attempt({ stepId: STEP_CLASSIFY, correct: false }),
      attempt({ stepId: STEP_CLASSIFY, correct: true, attemptIndex: 2 }),
    ]);
    const mis = derived.misconceptions.find((m) => m.misconceptionId === MIS_DIRECT_CLASSIFY);
    expect(mis?.currentlyEvidenced).toBe(false);
    expect(mis?.latestDiscriminatingOutcome).toBe("correct");
    expect(mis?.events.length).toBe(1);
    expect(toLearnerEvidenceSnapshot(derived).misconceptionsEvidenced.has(MIS_DIRECT_CLASSIFY)).toBe(false);
  });

  it("L: a post-reveal discriminating interaction neither creates nor clears misconception evidence", () => {
    const derived = derive([
      attempt({ stepId: STEP_CLASSIFY, correct: false }),
      attempt({ stepId: STEP_CLASSIFY, correct: true, attemptIndex: 2, answerRevealedBeforeAttempt: true }),
    ]);
    const mis = derived.misconceptions.find((m) => m.misconceptionId === MIS_DIRECT_CLASSIFY);
    expect(mis?.currentlyEvidenced).toBe(true);
  });
});

describe("M/N/O/P -- determinism, idempotency, isolation", () => {
  function scenario(): LearnerAttemptRecord[] {
    resetAttemptClock();
    return [
      attempt({ stepId: STEP_INDEPENDENT_A1, correct: true }),
      attempt({ stepId: STEP_INDEPENDENT_A2, correct: false }),
      attempt({ stepId: STEP_INDEPENDENT_A2, correct: true, attemptIndex: 2 }),
      attempt({ stepId: STEP_CLASSIFY, correct: false }),
      attempt({ stepId: STEP_TRANSFER_A, correct: true }),
      attempt({ stepId: STEP_GUIDED_A, correct: true }),
      attempt({ stepId: STEP_INDEPENDENT_B1, correct: false }),
    ];
  }

  it("M: insertion order does not change the derived result when chronology is unchanged", () => {
    const original = scenario();
    const shuffled = [original[4]!, original[0]!, original[6]!, original[2]!, original[5]!, original[1]!, original[3]!];
    expect(JSON.stringify(derive(shuffled))).toBe(JSON.stringify(derive(original)));
  });

  it("N: a duplicated canonical event identity is ignored and does not change the result", () => {
    const original = scenario();
    const withDuplicate = [...original, { ...original[0]! }];
    const derived = derive(withDuplicate);
    expect(derived.ignoredAttempts.some((i) => i.reason === "duplicate_event_identity")).toBe(true);
    expect(derived.attemptsConsidered).toBe(original.length);
    expect(JSON.stringify({ ...derived, ignoredAttempts: [] })).toBe(JSON.stringify({ ...derive(original), ignoredAttempts: [] }));
  });

  it("O: same evidence + same policy version => byte-equivalent result", () => {
    expect(JSON.stringify(derive(scenario()))).toBe(JSON.stringify(derive(scenario())));
  });

  it("P: another learner's attempts never contaminate the derivation subject", () => {
    const own = scenario();
    const foreign = [
      attempt({ stepId: STEP_INDEPENDENT_A3, correct: false, learnerId: "learner-2" }),
      attempt({ stepId: STEP_INDEPENDENT_A4, correct: false, learnerId: "learner-2" }),
    ];
    const derived = derive([...own, ...foreign]);
    expect(derived.ignoredAttempts.filter((i) => i.reason === "different_learner").length).toBe(2);
    expect(JSON.stringify({ ...derived, ignoredAttempts: [] })).toBe(JSON.stringify({ ...derive(own), ignoredAttempts: [] }));
  });

  it("content the context cannot resolve is ignored explicitly, never reinterpreted (task brief §26)", () => {
    const derived = derive([attempt({ stepId: STEP_INDEPENDENT_A1, correct: true, contentRelease: "some-other-release.9" })]);
    expect(derived.capabilities).toEqual([]);
    expect(derived.ignoredAttempts[0]?.reason).toBe("content_unresolved");
  });
});

describe("Q/R -- namespaces and policy identity", () => {
  it("Q: capability and family namespaces remain distinct in the snapshot", () => {
    const derived = derive([attempt({ stepId: STEP_INDEPENDENT_A1, correct: true })]);
    const snapshot = toLearnerEvidenceSnapshot(derived);
    expect(snapshot.capabilityStatus.has(CAP_A)).toBe(true);
    expect(snapshot.capabilityStatus.has(FAMILY_TARGET)).toBe(false);
    expect(snapshot.familyStatus.has(FAMILY_TARGET)).toBe(true);
    expect(snapshot.familyStatus.has(CAP_A)).toBe(false);
  });

  it("R: the derived state carries the mastery policy version and never mutates the raw attempt history", () => {
    const attempts = [attempt({ stepId: STEP_INDEPENDENT_A1, correct: true })];
    const frozen = JSON.stringify(attempts);
    const derived = derive(attempts);
    expect(derived.masteryPolicyVersion).toBe(MASTERY_POLICY_VERSION);
    expect(JSON.stringify(attempts)).toBe(frozen);
  });
});

describe("family-level derivation (task brief §17)", () => {
  it("a family never becomes secure because one narrow required capability passed", () => {
    const derived = derive([
      attempt({ stepId: STEP_INDEPENDENT_A1, correct: true }),
      attempt({ stepId: STEP_INDEPENDENT_A2, correct: true }),
    ]);
    const family = derived.families.find((f) => f.assertionFamilyId === FAMILY_TARGET);
    expect(derived.capabilities.find((c) => c.capabilityId === CAP_A)?.state).toBe("PROVISIONALLY_SECURE");
    expect(family?.state).toBe("EMERGING");
    expect(family?.ruleApplied).toBe("family_emerging.v1");
  });

  it("a family is PROVISIONALLY_SECURE only when every required capability is at least provisionally secure", () => {
    const derived = derive([
      attempt({ stepId: STEP_INDEPENDENT_A1, correct: true }),
      attempt({ stepId: STEP_INDEPENDENT_A2, correct: true }),
      attempt({ stepId: STEP_INDEPENDENT_B1, correct: true }),
      attempt({ stepId: STEP_INDEPENDENT_B2, correct: true }),
    ]);
    expect(derived.families.find((f) => f.assertionFamilyId === FAMILY_TARGET)?.state).toBe("PROVISIONALLY_SECURE");
  });

  it("any WEAK member makes the family WEAK; any CONFLICTING member wins over WEAK", () => {
    const weak = derive([
      attempt({ stepId: STEP_INDEPENDENT_A1, correct: false }),
      attempt({ stepId: STEP_INDEPENDENT_A2, correct: false }),
      attempt({ stepId: STEP_INDEPENDENT_B1, correct: true }),
    ]);
    expect(weak.families.find((f) => f.assertionFamilyId === FAMILY_TARGET)?.state).toBe("WEAK");

    const conflicting = derive([
      attempt({ stepId: STEP_INDEPENDENT_A1, correct: true }),
      attempt({ stepId: STEP_INDEPENDENT_A2, correct: true }),
      attempt({ stepId: STEP_INDEPENDENT_A3, correct: false }),
      attempt({ stepId: STEP_INDEPENDENT_A4, correct: false }),
      attempt({ stepId: STEP_INDEPENDENT_B1, correct: false }),
      attempt({ stepId: STEP_INDEPENDENT_B2, correct: false }),
    ]);
    expect(conflicting.families.find((f) => f.assertionFamilyId === FAMILY_TARGET)?.state).toBe("CONFLICTING");
  });

  it("CAP_DIAG evidence counts toward the family as a non-required member and cannot make it secure", () => {
    const derived = derive([attempt({ stepId: STEP_CLASSIFY, correct: true }), attempt({ stepId: STEP_CLASSIFY, correct: true, sessionKey: "sess-2" })]);
    const family = derived.families.find((f) => f.assertionFamilyId === FAMILY_TARGET);
    expect(derived.capabilities.find((c) => c.capabilityId === CAP_DIAG)?.state).toBe("PROVISIONALLY_SECURE");
    expect(family?.state).toBe("EMERGING");
    expect(family?.capabilityStates.find((m) => m.capabilityId === CAP_DIAG)?.required).toBe(false);
  });

  it("a family with unknown governed completeness is capped at EMERGING and never secure", () => {
    const derived = derive([
      attempt({ stepId: STEP_UNKNOWN_FAMILY, correct: true }),
      attempt({ stepId: STEP_UNKNOWN_FAMILY, correct: true, sessionKey: "sess-2" }),
    ]);
    const family = derived.families.find((f) => f.assertionFamilyId === FAMILY_UNKNOWN);
    expect(family?.state).toBe("EMERGING");
    expect(family?.ruleApplied).toBe("family_unknown_completeness.v1");
    expect(family?.requiredCapabilityIds).toBeNull();
  });
});

describe("explainability (task brief §22)", () => {
  it("every derived capability/family/misconception carries a rule id, counts and a human-readable explanation", () => {
    const derived = derive([
      attempt({ stepId: STEP_INDEPENDENT_A1, correct: true }),
      attempt({ stepId: STEP_CLASSIFY, correct: false }),
    ]);
    for (const cap of derived.capabilities) {
      expect(cap.ruleApplied).toMatch(/\.v1$/);
      expect(cap.explanation.length).toBeGreaterThan(0);
      expect(cap.consideredOutcomeKeys.length + cap.counts.supportingSuccesses).toBeGreaterThan(0);
    }
    for (const family of derived.families) {
      expect(family.ruleApplied).toMatch(/\.v1$/);
      expect(family.explanation).toContain(family.state);
    }
    for (const mis of derived.misconceptions) {
      expect(mis.explanation).toContain("discriminating");
    }
  });

  it("replayed sessions of the same deterministic instance are separate step visits (sessionKey discriminates)", () => {
    const cap = capabilityState(
      [attempt({ stepId: STEP_INDEPENDENT_A1, correct: true }), attempt({ stepId: STEP_INDEPENDENT_A1, correct: true, sessionKey: "sess-2" })],
      CAP_A,
    );
    expect(cap?.counts.independentSuccesses).toBe(2);
    expect(cap?.state).toBe("PROVISIONALLY_SECURE");
  });
});
