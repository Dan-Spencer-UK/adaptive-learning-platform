import { describe, expect, it } from "vitest";
import { canonicalJson, computeEvidenceDigest, computeInstanceIdentity } from "./identity.ts";
import type { LearnerEvidenceSnapshot } from "./types.ts";

function evidence(overrides: Partial<LearnerEvidenceSnapshot> = {}): LearnerEvidenceSnapshot {
  return {
    learnerId: "learner.001",
    capabilityStatus: new Map([["cap.a", "EMERGING"]]),
    misconceptionsEvidenced: new Set(),
    retrievalDue: new Set(),
    ...overrides,
  };
}

describe("canonicalJson", () => {
  it("produces identical output for objects with differently ordered keys", () => {
    const a = { z: 1, a: 2, m: { y: 1, x: 2 } };
    const b = { a: 2, m: { x: 2, y: 1 }, z: 1 };
    expect(canonicalJson(a)).toBe(canonicalJson(b));
  });

  it("produces different output for materially different objects", () => {
    expect(canonicalJson({ a: 1 })).not.toBe(canonicalJson({ a: 2 }));
  });
});

describe("computeEvidenceDigest", () => {
  it("is identical for equal snapshots regardless of Map/Set insertion order", () => {
    const snapshotA = evidence({
      capabilityStatus: new Map([
        ["cap.a", "EMERGING"],
        ["cap.b", "WEAK"],
      ]),
      misconceptionsEvidenced: new Set(["MIS-1", "MIS-2"]),
      retrievalDue: new Set(["tag.1", "tag.2"]),
    });
    const snapshotB = evidence({
      capabilityStatus: new Map([
        ["cap.b", "WEAK"],
        ["cap.a", "EMERGING"],
      ]),
      misconceptionsEvidenced: new Set(["MIS-2", "MIS-1"]),
      retrievalDue: new Set(["tag.2", "tag.1"]),
    });
    expect(computeEvidenceDigest(snapshotA)).toBe(computeEvidenceDigest(snapshotB));
  });

  it("changes when a capability status changes", () => {
    const base = evidence();
    const changed = evidence({ capabilityStatus: new Map([["cap.a", "TRANSFER_SECURE"]]) });
    expect(computeEvidenceDigest(base)).not.toBe(computeEvidenceDigest(changed));
  });

  it("changes when misconceptionsEvidenced changes but capabilityStatus is unchanged", () => {
    const base = evidence();
    const changed = evidence({ misconceptionsEvidenced: new Set(["MIS-X"]) });
    expect(computeEvidenceDigest(base)).not.toBe(computeEvidenceDigest(changed));
  });

  it("does not depend on learnerId (learnerId is not evidence)", () => {
    const a = evidence({ learnerId: "learner.001" });
    const b = evidence({ learnerId: "learner.002" });
    expect(computeEvidenceDigest(a)).toBe(computeEvidenceDigest(b));
  });
});

describe("computeInstanceIdentity", () => {
  const base = {
    lessonId: "lesson.synthetic.main",
    lessonVersion: 1,
    contentRelease: "synthetic-content-release.1",
    assemblyPolicyVersion: 1,
    learnerId: "learner.001",
    evidenceDigest: "abcd1234",
  };

  it("is identical for identical inputs", () => {
    expect(computeInstanceIdentity({ ...base })).toBe(computeInstanceIdentity({ ...base }));
  });

  it("changes when lessonVersion changes", () => {
    expect(computeInstanceIdentity(base)).not.toBe(computeInstanceIdentity({ ...base, lessonVersion: 2 }));
  });

  it("changes when contentRelease changes", () => {
    expect(computeInstanceIdentity(base)).not.toBe(computeInstanceIdentity({ ...base, contentRelease: "synthetic-content-release.2" }));
  });

  it("changes when assemblyPolicyVersion changes", () => {
    expect(computeInstanceIdentity(base)).not.toBe(computeInstanceIdentity({ ...base, assemblyPolicyVersion: 2 }));
  });

  it("changes when evidenceDigest changes", () => {
    expect(computeInstanceIdentity(base)).not.toBe(computeInstanceIdentity({ ...base, evidenceDigest: "different0" }));
  });

  it("changes when learnerId changes", () => {
    expect(computeInstanceIdentity(base)).not.toBe(computeInstanceIdentity({ ...base, learnerId: "learner.002" }));
  });
});
