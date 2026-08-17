import { describe, expect, it } from "vitest";
import { resolveWithinSessionBranch } from "./branching.ts";
import { SYNTHETIC_MAIN_LESSON, SYNTH_MISCONCEPTION_ID } from "./test-fixtures.ts";

describe("resolveWithinSessionBranch", () => {
  it("routes to the destination step when the trigger and misconception identifier both match", () => {
    const destination = resolveWithinSessionBranch(SYNTHETIC_MAIN_LESSON, "misconception_check", {
      trigger: "misconception_detected",
      misconceptionIdentifier: SYNTH_MISCONCEPTION_ID,
    });
    expect(destination).toBe("remediation_step");
  });

  it("does NOT route on a wrong answer alone -- a different (or missing) misconception identifier never matches", () => {
    const differentMisconception = resolveWithinSessionBranch(SYNTHETIC_MAIN_LESSON, "misconception_check", {
      trigger: "misconception_detected",
      misconceptionIdentifier: "MIS-SYNTH-SOME-OTHER-001",
    });
    expect(differentMisconception).toBeNull();

    const noMisconceptionAtAll = resolveWithinSessionBranch(SYNTHETIC_MAIN_LESSON, "misconception_check", {
      trigger: "misconception_detected",
    });
    expect(noMisconceptionAtAll).toBeNull();
  });

  it("routes on remediation_cleared regardless of misconceptionIdentifier (non-misconception triggers don't require one)", () => {
    const destination = resolveWithinSessionBranch(SYNTHETIC_MAIN_LESSON, "remediation_step", {
      trigger: "remediation_cleared",
    });
    expect(destination).toBe("transfer_step");
  });

  it("returns null when the step has no matching branch route", () => {
    const destination = resolveWithinSessionBranch(SYNTHETIC_MAIN_LESSON, "orientation", {
      trigger: "below_tolerance",
    });
    expect(destination).toBeNull();
  });

  it("returns null when the completed step id does not exist in the lesson", () => {
    const destination = resolveWithinSessionBranch(SYNTHETIC_MAIN_LESSON, "no-such-step", {
      trigger: "misconception_detected",
      misconceptionIdentifier: SYNTH_MISCONCEPTION_ID,
    });
    expect(destination).toBeNull();
  });

  it("never reassembles the whole lesson -- it only ever returns a single step id or null", () => {
    const destination = resolveWithinSessionBranch(SYNTHETIC_MAIN_LESSON, "misconception_check", {
      trigger: "misconception_detected",
      misconceptionIdentifier: SYNTH_MISCONCEPTION_ID,
    });
    expect(typeof destination === "string" || destination === null).toBe(true);
  });
});
