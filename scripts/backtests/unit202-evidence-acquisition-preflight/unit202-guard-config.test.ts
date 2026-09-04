/**
 * CC-23 section 21/28: the Unit-202 allowlist is a CONCRETE,
 * machine-evaluable `LocalAccessGuardConfig` -- these tests actually
 * instantiate a real `LocalAccessGuard` from the generated
 * UNIT202-BLIND-ACQUISITION-ALLOWLIST.json's `guardConfig` and exercise
 * it against real repository paths, proving the future acquisition
 * runner would be mechanically unable to read a non-allowlisted local
 * file -- not merely documented, executable.
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { LocalAccessGuard, LocalInputIntegrityError, UnauthorizedLocalReadError, type LocalAccessGuardConfig } from "@alp/technical-evidence-engine";
import { describe, expect, it } from "vitest";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..", "..", "..");

const allowlist = JSON.parse(readFileSync(path.join(repoRoot, "reports", "backtests", "unit202-evidence-acquisition-benchmark", "UNIT202-BLIND-ACQUISITION-ALLOWLIST.json"), "utf-8")) as { guardConfig: LocalAccessGuardConfig };

describe("CC-23 section 21 -- the Unit-202 allowlist is a real, loadable LocalAccessGuardConfig", () => {
  it("guardConfig round-trips through JSON and constructs a working LocalAccessGuard", () => {
    expect(() => new LocalAccessGuard(allowlist.guardConfig)).not.toThrow();
  });

  it("allows the exact frozen blind target manifest by its real, current content and hash", () => {
    const guard = new LocalAccessGuard(allowlist.guardConfig);
    const relPath = "reports/backtests/unit202-evidence-acquisition-benchmark/UNIT202-BLIND-ACQUISITION-TARGETS.json";
    const raw = readFileSync(path.join(repoRoot, relPath), "utf-8");
    const record = guard.checkRead(relPath, "test read", raw);
    expect(record.outcome).toBe("ALLOWED");
    expect(record.matchedRule).toBe("FROZEN_BLIND_TARGET_MANIFEST");
  });

  it("denies the frozen manifest path if the content does not match the pinned hash (fails safe, never a soft warning)", () => {
    const guard = new LocalAccessGuard(allowlist.guardConfig);
    const relPath = "reports/backtests/unit202-evidence-acquisition-benchmark/UNIT202-BLIND-ACQUISITION-TARGETS.json";
    expect(() => guard.checkRead(relPath, "test read", "tampered content")).toThrow(LocalInputIntegrityError);
  });

  it("denies an arbitrary, never-enumerated Unit-202 path outright -- default deny, no denylist consulted", () => {
    const guard = new LocalAccessGuard(allowlist.guardConfig);
    expect(() => guard.checkRead("scripts/content/data/unit202-completely-made-up-file.ts", "probe")).toThrow(UnauthorizedLocalReadError);
  });

  it("denies the sealed historical benchmark itself (the exact leakage this whole architecture exists to prevent)", () => {
    const guard = new LocalAccessGuard(allowlist.guardConfig);
    expect(() => guard.checkRead("reports/backtests/unit202-evidence-acquisition-benchmark/UNIT202-HISTORICAL-ACQUISITION-BENCHMARK.json", "probe")).toThrow(UnauthorizedLocalReadError);
  });

  it("denies pa-target.ts, historical-benchmark-bindings.ts, and the technical-source-verification dossier", () => {
    const guard = new LocalAccessGuard(allowlist.guardConfig);
    for (const p of ["scripts/backtests/unit202-reconciliation/pa-target.ts", "scripts/backtests/unit202-reconciliation/historical-benchmark-bindings.ts", "scripts/content/data/unit202-technical-source-verification.ts"]) {
      expect(() => guard.checkRead(p, "probe"), `expected "${p}" to be denied`).toThrow(UnauthorizedLocalReadError);
    }
  });

  it("allows generic @alp/technical-evidence-engine code -- the generic architecture is never itself restricted", () => {
    const guard = new LocalAccessGuard(allowlist.guardConfig);
    const relPath = "packages/technical-evidence-engine/src/planner.ts";
    const raw = readFileSync(path.join(repoRoot, relPath), "utf-8");
    const record = guard.checkRead(relPath, "load generic planner code", raw);
    expect(record.outcome).toBe("ALLOWED");
  });

  it("every allowed/denied attempt is captured in the audit log with the required fields (task §13)", () => {
    const guard = new LocalAccessGuard(allowlist.guardConfig);
    try {
      guard.checkRead("scripts/content/data/unit202-never-allowlisted.ts", "probe");
    } catch {
      // expected
    }
    const log = guard.getAuditLog();
    expect(log).toHaveLength(1);
    expect(log[0]!.outcome).toBe("DENIED");
    expect(log[0]!.reason).toBe("probe");
    expect(typeof log[0]!.recordedAt).toBe("string");
  });
});
