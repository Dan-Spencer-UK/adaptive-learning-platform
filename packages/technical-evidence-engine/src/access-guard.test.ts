/**
 * CC-23 §15/§21; CC-24 §2: generic local-input isolation utility tests.
 * Fixtures use a synthetic experiment id/paths -- no Unit-202 content.
 */

import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { LocalAccessGuard, LocalInputIntegrityError, UnauthorizedLocalReadError, hashContent, normalizeCanonicalPath } from "./access-guard.ts";
import type { LocalAccessGuardConfig } from "./types.ts";

const repoRoot = path.resolve(import.meta.dirname, "..", "..", "..");

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

describe("CC-24 §2 -- normalizeCanonicalPath: genuine normalization, not a backslash swap", () => {
  it("resolves an intra-repo '../' sequence to the path's true location, rather than trusting the superficial prefix", () => {
    expect(normalizeCanonicalPath("packages/technical-evidence-engine/../../reports/forbidden.json")).toBe("reports/forbidden.json");
  });

  it("rejects a path whose '..' segments net-escape the root entirely", () => {
    expect(normalizeCanonicalPath("../../../etc/passwd")).toBeNull();
    expect(normalizeCanonicalPath("../secret.txt")).toBeNull();
  });

  it("rejects a POSIX absolute path", () => {
    expect(normalizeCanonicalPath("/etc/passwd")).toBeNull();
  });

  it("rejects a Windows drive-letter absolute path", () => {
    expect(normalizeCanonicalPath("C:\\Windows\\System32\\config")).toBeNull();
    expect(normalizeCanonicalPath("C:/Users/secret.txt")).toBeNull();
  });

  it("rejects a UNC path", () => {
    expect(normalizeCanonicalPath("//server/share/secret.txt")).toBeNull();
  });

  it("resolves Windows-style traversal (backslashes) identically to POSIX traversal", () => {
    expect(normalizeCanonicalPath("packages\\technical-evidence-engine\\..\\..\\reports\\forbidden.json")).toBe("reports/forbidden.json");
    expect(normalizeCanonicalPath("..\\..\\secret.txt")).toBeNull();
  });

  it("a clean relative path with no traversal round-trips unchanged", () => {
    expect(normalizeCanonicalPath("packages/technical-evidence-engine/src/planner.ts")).toBe("packages/technical-evidence-engine/src/planner.ts");
  });
});

describe("CC-24 §2 -- traversal and absolute paths are denied end-to-end through the guard, never matched against an allowed glob", () => {
  it("a '../' sequence that resolves OUTSIDE the allowed glob is denied, even though the raw string starts with an allowed prefix", () => {
    const guard = new LocalAccessGuard(config());
    expect(() => guard.checkRead("packages/technical-evidence-engine/src/../../../reports/synthetic/some-other-file.json", "probe")).toThrow(UnauthorizedLocalReadError);
  });

  it("an absolute path is denied outright, never matched against any rule", () => {
    const guard = new LocalAccessGuard(config());
    expect(() => guard.checkRead("/etc/passwd", "probe")).toThrow(UnauthorizedLocalReadError);
  });

  it("a Windows-style traversal path is denied identically to a POSIX one", () => {
    const guard = new LocalAccessGuard(config());
    expect(() => guard.checkRead("packages\\technical-evidence-engine\\..\\..\\..\\secret.txt", "probe")).toThrow(UnauthorizedLocalReadError);
  });

  it("wouldAllow also rejects traversal/absolute paths, never reporting them as allowed", () => {
    const guard = new LocalAccessGuard(config());
    expect(guard.wouldAllow("packages/technical-evidence-engine/src/../../../reports/forbidden.json")).toBe(false);
    expect(guard.wouldAllow("/etc/passwd")).toBe(false);
  });
});

describe("CC-24 §2 -- a hash-pinned rule never returns ALLOWED without a verified hash", () => {
  it("omitted content against a hash-pinned rule is DENIED (the CC-24 bug: previously fell through to ALLOWED)", () => {
    const guard = new LocalAccessGuard(config());
    expect(() => guard.checkRead("reports/synthetic/frozen-manifest.json", "probe" /* no content argument */)).toThrow(LocalInputIntegrityError);
  });

  it("the omitted-content denial is captured in the audit log as DENIED, matched rule still named for audit clarity", () => {
    const guard = new LocalAccessGuard(config());
    try {
      guard.checkRead("reports/synthetic/frozen-manifest.json", "probe");
    } catch {
      // expected
    }
    const log = guard.getAuditLog();
    expect(log).toHaveLength(1);
    expect(log[0]!.outcome).toBe("DENIED");
    expect(log[0]!.matchedRule).toBe("FROZEN_TARGET_MANIFEST");
  });

  it("wrong content hash against a hash-pinned rule is DENIED", () => {
    const guard = new LocalAccessGuard(config());
    expect(() => guard.checkRead("reports/synthetic/frozen-manifest.json", "probe", "wrong-content")).toThrow(LocalInputIntegrityError);
  });

  it("a rule with no requiredHash still allows a read with no content supplied", () => {
    const guard = new LocalAccessGuard(config());
    const record = guard.checkRead("packages/technical-evidence-engine/src/planner.ts", "probe");
    expect(record.outcome).toBe("ALLOWED");
  });
});

describe("CC-24 §2 -- guardedReadUtf8: authorization strictly precedes the filesystem read", () => {
  function guardedConfig(): LocalAccessGuardConfig {
    return { experimentId: "synthetic-guarded-read", allowedInputs: [{ rule: "GENERIC_CODE", matchKind: "GLOB", pathOrGlob: "packages/technical-evidence-engine/src/**" }] };
  }

  it("reads a real, allowlisted file and returns its content plus an ALLOWED audit record", () => {
    const guard = new LocalAccessGuard(guardedConfig(), repoRoot);
    const { content, audit } = guard.guardedReadUtf8("packages/technical-evidence-engine/src/index.ts", "read generic index");
    expect(content).toContain("packageId");
    expect(audit.outcome).toBe("ALLOWED");
    expect(audit.contentHash).toBe(hashContent(content));
  });

  it("an unauthorized path is rejected before readFileSync is ever attempted -- no ENOENT-shaped error, only UnauthorizedLocalReadError", () => {
    const guard = new LocalAccessGuard(guardedConfig(), repoRoot);
    // A path that does not exist on disk AND is not allowlisted -- if the guard read first, this would throw an fs ENOENT error instead.
    expect(() => guard.guardedReadUtf8("reports/this-file-does-not-exist-anywhere.json", "probe")).toThrow(UnauthorizedLocalReadError);
  });

  it("a traversal path is rejected before any filesystem access is attempted", () => {
    const guard = new LocalAccessGuard(guardedConfig(), repoRoot);
    expect(() => guard.guardedReadUtf8("packages/technical-evidence-engine/src/../../../reports/does-not-exist.json", "probe")).toThrow(UnauthorizedLocalReadError);
  });

  it("throws a clear configuration error if used without repoRoot -- never silently reads from an ambiguous location", () => {
    const guard = new LocalAccessGuard(guardedConfig()); // no repoRoot supplied
    expect(() => guard.guardedReadUtf8("packages/technical-evidence-engine/src/index.ts", "probe")).toThrow(/repoRoot/);
  });

  it("a hash-pinned rule verifies content read from disk before returning it", () => {
    const realPath = path.join(repoRoot, "packages/technical-evidence-engine/src/index.ts");
    const realHash = hashContent(readFileSync(realPath, "utf-8"));
    const guard = new LocalAccessGuard({ experimentId: "synthetic-hash-pin", allowedInputs: [{ rule: "PINNED", matchKind: "EXACT_PATH", pathOrGlob: "packages/technical-evidence-engine/src/index.ts", requiredHash: realHash }] }, repoRoot);
    const { audit } = guard.guardedReadUtf8("packages/technical-evidence-engine/src/index.ts", "probe");
    expect(audit.outcome).toBe("ALLOWED");
  });

  it("a hash-pinned rule DENIES when the on-disk content does not match the pinned hash", () => {
    const guard = new LocalAccessGuard({ experimentId: "synthetic-hash-mismatch", allowedInputs: [{ rule: "PINNED", matchKind: "EXACT_PATH", pathOrGlob: "packages/technical-evidence-engine/src/index.ts", requiredHash: hashContent("definitely-not-the-real-file-content") }] }, repoRoot);
    expect(() => guard.guardedReadUtf8("packages/technical-evidence-engine/src/index.ts", "probe")).toThrow(LocalInputIntegrityError);
  });
});

describe("CC-24 §2 -- allReadsAllowed reflects a denial immediately", () => {
  it("returns true with zero attempts, false after any single denial, regardless of later allowed reads", () => {
    const guard = new LocalAccessGuard(config());
    expect(guard.allReadsAllowed()).toBe(true);
    guard.checkRead("packages/technical-evidence-engine/src/planner.ts", "probe");
    expect(guard.allReadsAllowed()).toBe(true);
    try {
      guard.checkRead("reports/never-allowed.json", "probe");
    } catch {
      // expected
    }
    expect(guard.allReadsAllowed()).toBe(false);
  });
});
