/**
 * CC-23 §15/§21: generic local-input isolation utility tests. Fixtures use
 * a synthetic experiment id/paths -- no Unit-202 content.
 */

import { describe, expect, it } from "vitest";
import { LocalAccessGuard, LocalInputIntegrityError, UnauthorizedLocalReadError, hashContent } from "./access-guard.ts";
import type { LocalAccessGuardConfig } from "./types.ts";

function config(overrides: Partial<LocalAccessGuardConfig> = {}): LocalAccessGuardConfig {
  return {
    experimentId: "synthetic-experiment",
    allowedInputs: [
      { rule: "FROZEN_TARGET_MANIFEST", matchKind: "EXACT_PATH", pathOrGlob: "reports/synthetic/frozen-manifest.json", requiredHash: hashContent("frozen-content") },
      { rule: "GENERIC_CODE", matchKind: "GLOB", pathOrGlob: "packages/technical-evidence-engine/src/**" },
    ],
    ...overrides,
  };
}

describe("CC-23 §21 -- positive allowlist, default deny", () => {
  it("allows a read matching an EXACT_PATH rule with the correct hash", () => {
    const guard = new LocalAccessGuard(config());
    const record = guard.checkRead("reports/synthetic/frozen-manifest.json", "load frozen manifest", "frozen-content");
    expect(record.outcome).toBe("ALLOWED");
    expect(record.matchedRule).toBe("FROZEN_TARGET_MANIFEST");
  });

  it("allows a read matching a GLOB rule", () => {
    const guard = new LocalAccessGuard(config());
    const record = guard.checkRead("packages/technical-evidence-engine/src/planner.ts", "load generic code");
    expect(record.outcome).toBe("ALLOWED");
    expect(record.matchedRule).toBe("GENERIC_CODE");
  });

  it("denies, by hard throw, a read against a non-allowlisted path (default deny)", () => {
    const guard = new LocalAccessGuard(config());
    expect(() => guard.checkRead("reports/synthetic/some-other-file.json", "attempted read")).toThrow(UnauthorizedLocalReadError);
  });

  it("the audit log records the denied attempt even though it threw", () => {
    const guard = new LocalAccessGuard(config());
    try {
      guard.checkRead("reports/synthetic/some-other-file.json", "attempted read");
    } catch {
      // expected
    }
    const log = guard.getAuditLog();
    expect(log).toHaveLength(1);
    expect(log[0]!.outcome).toBe("DENIED");
    expect(log[0]!.matchedRule).toBeNull();
  });

  it("a missing denylist entry never grants access -- there is no denylist consulted here at all, only the positive allowlist", () => {
    // A path that would plausibly have been on a "denylist" (never enumerated here) is still denied,
    // because absence from the ALLOWLIST is what determines denial, not presence on any other list.
    const guard = new LocalAccessGuard(config());
    expect(() => guard.checkRead("reports/anything-never-considered.json", "probe")).toThrow(UnauthorizedLocalReadError);
  });

  it("fails safe on a hash mismatch against a hash-pinned rule -- never a soft warning", () => {
    const guard = new LocalAccessGuard(config());
    expect(() => guard.checkRead("reports/synthetic/frozen-manifest.json", "load frozen manifest", "tampered-content")).toThrow(LocalInputIntegrityError);
  });

  it("wouldAllow performs a non-throwing, non-auditing check", () => {
    const guard = new LocalAccessGuard(config());
    expect(guard.wouldAllow("packages/technical-evidence-engine/src/index.ts")).toBe(true);
    expect(guard.wouldAllow("reports/never-allowed.json")).toBe(false);
    expect(guard.getAuditLog()).toHaveLength(0);
  });

  it("every allowed read is captured in the access-audit contract's required fields (task §13)", () => {
    const guard = new LocalAccessGuard(config());
    const record = guard.checkRead("packages/technical-evidence-engine/src/planner.ts", "generic code read");
    expect(record.canonicalPath).toBe("packages/technical-evidence-engine/src/planner.ts");
    expect(record.reason).toBe("generic code read");
    expect(record.matchedRule).toBe("GENERIC_CODE");
    expect(typeof record.recordedAt).toBe("string");
  });
});
