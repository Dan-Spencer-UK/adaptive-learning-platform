import { describe, expect, it } from "vitest";
import { learningPackageGateResultSchema, isPublicationReady, type LearningPackageGateResult } from "./learning-package-gate.ts";

function passResult(overrides: Partial<LearningPackageGateResult> = {}): LearningPackageGateResult {
  return { scopeId: "unit202", gate: "CURRICULUM", status: "PASS", checkedAt: "2026-08-29T09:00:00.000Z", evidenceRefs: [], failures: [], ...overrides };
}

describe("learningPackageGateResultSchema", () => {
  it("accepts a PASS result with no failures", () => {
    expect(learningPackageGateResultSchema.safeParse(passResult()).success).toBe(true);
  });

  it("rejects a FAIL result with no failures listed", () => {
    const result = learningPackageGateResultSchema.safeParse(passResult({ status: "FAIL" }));
    expect(result.success).toBe(false);
  });

  it("accepts a FAIL result that lists at least one failure", () => {
    expect(learningPackageGateResultSchema.safeParse(passResult({ status: "FAIL", failures: ["off-syllabus content detected"] })).success).toBe(true);
  });

  it("rejects a PASS result that still lists failures", () => {
    const result = learningPackageGateResultSchema.safeParse(passResult({ failures: ["stray failure"] }));
    expect(result.success).toBe(false);
  });

  it("rejects a WAIVED result with no waiver record", () => {
    const result = learningPackageGateResultSchema.safeParse(passResult({ status: "WAIVED" }));
    expect(result.success).toBe(false);
  });

  it("accepts a WAIVED result with a waiver record", () => {
    const result = learningPackageGateResultSchema.safeParse(
      passResult({ status: "WAIVED", waiver: { reason: "Known gap, tracked", owner: "product-owner" } }),
    );
    expect(result.success).toBe(true);
  });
});

describe("isPublicationReady", () => {
  it("is true when every mandatory gate is PASS", () => {
    const results = [passResult({ gate: "CURRICULUM" }), passResult({ gate: "PEDAGOGY" }), passResult({ gate: "VISUAL" })];
    expect(isPublicationReady(results, ["CURRICULUM", "PEDAGOGY", "VISUAL"])).toBe(true);
  });

  it("is true when a mandatory gate is WAIVED rather than PASS", () => {
    const results = [passResult({ gate: "CURRICULUM", status: "WAIVED", waiver: { reason: "r", owner: "o" }, failures: [] })];
    expect(isPublicationReady(results, ["CURRICULUM"])).toBe(true);
  });

  it("is false when a mandatory gate is missing entirely (NOT_RUN by omission)", () => {
    const results = [passResult({ gate: "CURRICULUM" })];
    expect(isPublicationReady(results, ["CURRICULUM", "VISUAL"])).toBe(false);
  });

  it("is false when a mandatory gate FAILed", () => {
    const results = [passResult({ gate: "CURRICULUM", status: "FAIL", failures: ["x"] })];
    expect(isPublicationReady(results, ["CURRICULUM"])).toBe(false);
  });

  it("ignores non-mandatory gates entirely", () => {
    const results = [passResult({ gate: "CURRICULUM" }), passResult({ gate: "GUIDED_REVISION", status: "FAIL", failures: ["irrelevant here"] })];
    expect(isPublicationReady(results, ["CURRICULUM"])).toBe(true);
  });
});
