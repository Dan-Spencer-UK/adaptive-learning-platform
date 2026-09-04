/**
 * CC-22C section 18: proves the benchmark-integrity invariants that
 * distinguish this package from CC-22B's fuzzy/token-matched historical
 * benchmark -- no fuzzy matcher or manual override remains, every
 * non-NONE historical state is explicitly bound and mechanically
 * derived from real historical records, the blind target manifest is
 * byte-identical to its CC-22B-frozen hash, and the new positive
 * allowlist correctly default-denies arbitrary Unit-202 material while
 * never restricting public web research.
 */
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { unit202TechnicalSourceVerification } from "../../content/data/unit202-technical-source-verification.ts";
import { HISTORICAL_BENCHMARK_BINDINGS } from "./historical-benchmark-bindings.ts";
import { historicalBenchmarkFor, validateHistoricalBenchmarkBindings } from "./historical-resolution.ts";
import { PA_TARGET } from "./pa-target.ts";

validateHistoricalBenchmarkBindings();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..", "..", "..");

function readJson<T>(relPath: string): T {
  return JSON.parse(readFileSync(path.join(repoRoot, relPath), "utf-8")) as T;
}
function readText(relPath: string): string {
  return readFileSync(path.join(repoRoot, relPath), "utf-8");
}

interface LedgerRow {
  id: string;
  ac: string;
  proposition: string;
  paClassification: string;
  historicalBenchmarkState: string;
  historicalBindingBasis: string | null;
}

const ledgerFile = readJson<{ summary: Record<string, unknown>; ledger: LedgerRow[] }>("reports/backtests/unit202-reconciliation/UNIT202-PA-PROPOSITION-LEDGER.json");
const ledger = ledgerFile.ledger;

const buildScriptSource = readText("scripts/backtests/unit202-reconciliation/build-benchmark.ts");

const sealedBenchmark = readJson<{
  entries: { acquisitionTargetId: string; proposition: string; historicalCoverageState: string; mappingBasis: string | null; boundHistoricalRecords: { clusterKey: string; requirementKind: string; requirementText: string; coverageState: string }[]; reasonIfUnmapped: string | null }[];
}>("reports/backtests/unit202-evidence-acquisition-benchmark/UNIT202-HISTORICAL-ACQUISITION-BENCHMARK.json");

const allowlist = readJson<{
  guardConfig: { experimentId: string; allowedInputs: { rule: string; matchKind: string; pathOrGlob: string; requiredHash?: string }[] };
  defaultForUnlistedPaths: string;
  webResearchNote: string;
  accessAuditContract: { status: string; nonAllowlistedReadPolicy: { onAttempt: string; experimentValidity: string; continuation: string } };
}>("reports/backtests/unit202-evidence-acquisition-benchmark/UNIT202-BLIND-ACQUISITION-ALLOWLIST.json");

const denylist = readJson<{ DENYLIST_ROLE: string; deniedPaths: string[]; authoritativeAllowlist: string }>("reports/backtests/unit202-evidence-acquisition-benchmark/UNIT202-BLIND-ACQUISITION-DENYLIST.json");

const blindTargetsRaw = readText("reports/backtests/unit202-evidence-acquisition-benchmark/UNIT202-BLIND-ACQUISITION-TARGETS.json");

const EXPECTED_BLIND_TARGET_HASH = "3052aede77b472247fbdf7a9e04d62adb2e98bba3a2896dacd610267e4a754b4";

describe("CC-22C section 18.BA -- no fuzzy/token matcher participates in persisted historical status assignment", () => {
  it("the build script contains no token-overlap/fuzzy-matching machinery", () => {
    for (const forbidden of ["significantTokens", "STOPWORDS", "tokenOverlap", "editDistance", "embeddingSimilarity"]) {
      expect(buildScriptSource.includes(forbidden), `forbidden fuzzy-matching identifier "${forbidden}" found in build-benchmark.ts`).toBe(false);
    }
  });
});

describe("CC-22C section 18.BB -- no MANUAL_HISTORICAL_OVERRIDES state map exists", () => {
  it("the build script declares no manual-override lookup construct (a provenance mention of the removed CC-22B mechanism in prose is not itself the mechanism)", () => {
    expect(/const\s+MANUAL_HISTORICAL_OVERRIDES/.test(buildScriptSource)).toBe(false);
    expect(buildScriptSource.includes("MANUAL_HISTORICAL_OVERRIDES[")).toBe(false);
  });
});

describe("CC-22C section 18.BC/A -- every VERIFIED target resolves to explicit historical verification record(s), all genuinely VERIFIED", () => {
  it("every HISTORICALLY_VERIFIED row has >=1 bound record, all genuinely VERIFIED UNLESS an explicit, audited CC-23 section-19 atomic-subclaim override justifies the exception", () => {
    const verifiedRows = ledger.filter((r) => r.historicalBenchmarkState === "HISTORICALLY_VERIFIED");
    expect(verifiedRows.length).toBeGreaterThan(0);
    for (const row of verifiedRows) {
      const entry = sealedBenchmark.entries.find((e) => e.proposition === row.proposition) as { boundHistoricalRecords: { coverageState: string }[]; overrideNote?: string | null } | undefined;
      expect(entry, `no sealed-benchmark entry for "${row.proposition}"`).toBeDefined();
      expect(entry!.boundHistoricalRecords.length).toBeGreaterThan(0);
      if (entry!.overrideNote) continue; // section-19 override: the raw bound record(s) may legitimately NOT all be VERIFIED -- the override itself is separately proven auditable below.
      for (const rec of entry!.boundHistoricalRecords) expect(rec.coverageState, `"${row.proposition}" has no override yet a non-VERIFIED bound record -- would be an unaudited exception`).toBe("VERIFIED");
    }
  });
});

describe("CC-22C section 18.BD/B -- every CONDITIONAL target is mechanically derived from an actual CONDITIONAL_SOURCE_GAP record", () => {
  it("every HISTORICALLY_CONDITIONAL row has >=1 bound CONDITIONAL_SOURCE_GAP record and none SOURCE_GAP", () => {
    const conditionalRows = ledger.filter((r) => r.historicalBenchmarkState === "HISTORICALLY_CONDITIONAL");
    expect(conditionalRows.length).toBeGreaterThan(0);
    for (const row of conditionalRows) {
      const entry = sealedBenchmark.entries.find((e) => e.proposition === row.proposition)!;
      expect(entry.boundHistoricalRecords.some((r) => r.coverageState === "CONDITIONAL_SOURCE_GAP")).toBe(true);
      expect(entry.boundHistoricalRecords.every((r) => r.coverageState !== "SOURCE_GAP")).toBe(true);
    }
  });
});

describe("CC-22C section 18.BE/C -- every SOURCE_GAP target is mechanically derived from an actual SOURCE_GAP record", () => {
  it("every HISTORICALLY_SOURCE_GAP row has >=1 bound SOURCE_GAP record", () => {
    const gapRows = ledger.filter((r) => r.historicalBenchmarkState === "HISTORICALLY_SOURCE_GAP");
    expect(gapRows.length).toBeGreaterThan(0);
    for (const row of gapRows) {
      const entry = sealedBenchmark.entries.find((e) => e.proposition === row.proposition)!;
      expect(entry.boundHistoricalRecords.some((r) => r.coverageState === "SOURCE_GAP")).toBe(true);
    }
  });
});

describe("CC-22C section 18.D -- NO_HISTORICAL_BENCHMARK has no claimed hidden supporting record", () => {
  it("every NO_HISTORICAL_BENCHMARK row has zero bound records and a stated reason", () => {
    const unmappedRows = ledger.filter((r) => r.historicalBenchmarkState === "NO_HISTORICAL_BENCHMARK");
    expect(unmappedRows.length).toBeGreaterThan(0);
    for (const row of unmappedRows) {
      const entry = sealedBenchmark.entries.find((e) => e.proposition === row.proposition)!;
      expect(entry.boundHistoricalRecords).toEqual([]);
      expect(entry.reasonIfUnmapped).toBeTruthy();
    }
  });
});

describe("CC-22C section 18.F -- no MANUAL_HISTORICAL_OVERRIDES state-assignment mechanism remains (data-file check)", () => {
  it("historical-benchmark-bindings.ts never types a historical state directly -- only proposition/record/basis/rationale fields", () => {
    const src = readText("scripts/backtests/unit202-reconciliation/historical-benchmark-bindings.ts");
    expect(src.includes("historicalCoverageState:")).toBe(false);
    expect(src.includes('"HISTORICALLY_VERIFIED"')).toBe(false);
  });
});

describe("CC-22C section 18.G/H -- every referenced historical verification record resolves exactly and uniquely", () => {
  it("every binding's every record matches exactly one real propositionCoverage record", () => {
    expect(HISTORICAL_BENCHMARK_BINDINGS.length).toBeGreaterThan(0);
    for (const b of HISTORICAL_BENCHMARK_BINDINGS) {
      for (const r of b.records) {
        const matches = unit202TechnicalSourceVerification.propositionCoverage.filter((c) => c.clusterKey === r.clusterKey && c.requirementKind === r.requirementKind && c.requirementText === r.requirementText);
        expect(matches.length, `record for "${b.paPropositionText}" (${r.clusterKey}::${r.requirementKind}::"${r.requirementText}") did not resolve to exactly one record`).toBe(1);
      }
    }
  });
});

describe("CC-22C section 18.I / 21.BF -- one historical row may support multiple PA targets only through explicit bindings", () => {
  it("at least one (clusterKey, requirementKind, requirementText) identity is named by more than one binding", () => {
    const counts = new Map<string, number>();
    for (const b of HISTORICAL_BENCHMARK_BINDINGS) {
      for (const r of b.records) {
        const key = `${r.clusterKey}::${r.requirementKind}::${r.requirementText}`;
        counts.set(key, (counts.get(key) ?? 0) + 1);
      }
    }
    expect([...counts.values()].some((n) => n > 1)).toBe(true);
  });
});

describe("CC-22C section 18.J / 21.BG -- a PA target may require multiple historical records through explicit subclaims, deterministically and conservatively", () => {
  it("every MULTIPLE_HISTORICAL_RECORDS_REQUIRED binding's resulting state matches historical-resolution.ts's aggregation rule (including any section-19 atomic-subclaim override), recomputed independently via the shared module", () => {
    const multi = HISTORICAL_BENCHMARK_BINDINGS.filter((b) => b.mappingBasis === "MULTIPLE_HISTORICAL_RECORDS_REQUIRED");
    expect(multi.length).toBeGreaterThan(0);
    for (const b of multi) {
      const paRow = PA_TARGET.find((p) => p.proposition === b.paPropositionText)!;
      const expected = historicalBenchmarkFor(paRow);
      const row = ledger.find((r) => r.proposition === b.paPropositionText)!;
      expect(row.historicalBenchmarkState, `"${b.paPropositionText}" expected ${expected.state} (independently recomputed via historical-resolution.ts)`).toBe(expected.state);
    }
  });
});

describe("CC-23 section 19 -- atomic subclaims never inherit a sibling sub-claim's gap from a shared compound record", () => {
  it("Mean/Median/Mode read HISTORICALLY_VERIFIED even though their bound compound records carry CONDITIONAL_SOURCE_GAP, because the override is verified against the connected locator's own recorded coverage", () => {
    for (const proposition of ["Mean.", "Median.", "Mode."]) {
      const row = ledger.find((r) => r.proposition === proposition)!;
      expect(row.historicalBenchmarkState, `"${proposition}" must not inherit the sibling "Statistical range." sub-claim's gap`).toBe("HISTORICALLY_VERIFIED");
    }
  });

  it("Statistical range. correctly keeps its own genuine gap -- the override applies ONLY to the sub-claims the locator actually supports", () => {
    const row = ledger.find((r) => r.proposition === "Statistical range.")!;
    expect(row.historicalBenchmarkState).toBe("HISTORICALLY_CONDITIONAL");
  });

  it("the sealed benchmark records a transparent overrideNote for every subclaim-override-affected entry -- never a silent substitution", () => {
    for (const proposition of ["Mean.", "Median.", "Mode."]) {
      const entry = sealedBenchmark.entries.find((e) => e.proposition === proposition) as { overrideNote?: string | null } | undefined;
      expect(entry?.overrideNote, `"${proposition}" sealed entry must carry an overrideNote`).toBeTruthy();
    }
  });

  it("Dimmer: DIAC triggering. reads its atomic fact's own real VERIFIED record, not the full dimmer chain's SOURCE_GAP", () => {
    const row = ledger.find((r) => r.proposition === "Dimmer: DIAC triggering.")!;
    expect(row.historicalBenchmarkState).toBe("HISTORICALLY_VERIFIED");
  });

  it("Dimmer: TRIAC AC switching/control. still correctly reads the full chain's genuine SOURCE_GAP -- the DIAC rebinding did not mask a real gap elsewhere", () => {
    const row = ledger.find((r) => r.proposition === "Dimmer: TRIAC AC switching/control.")!;
    expect(row.historicalBenchmarkState).toBe("HISTORICALLY_SOURCE_GAP");
  });

  it("an atomicSubclaimOverride can only ever cite a locator connected to its own binding's records (mechanically validated at build time)", () => {
    const overridden = HISTORICAL_BENCHMARK_BINDINGS.filter((b) => b.atomicSubclaimOverride);
    expect(overridden.length).toBeGreaterThan(0);
    for (const b of overridden) {
      const locatorKey = b.atomicSubclaimOverride!.verifiedAgainstLocatorKey;
      const locator = unit202TechnicalSourceVerification.sourceLocators.find((l) => l.key === locatorKey);
      expect(locator, `override locator "${locatorKey}" for "${b.paPropositionText}" must be a real sourceLocators entry`).toBeDefined();
      const resolvedRecords = b.records.map((r) => unit202TechnicalSourceVerification.propositionCoverage.find((c) => c.clusterKey === r.clusterKey && c.requirementKind === r.requirementKind && c.requirementText === r.requirementText)!);
      expect(resolvedRecords.some((r) => r.supportingSourceLocatorKeys.includes(locatorKey)), `override locator "${locatorKey}" for "${b.paPropositionText}" must be connected to at least one of its own bound records`).toBe(true);
    }
  });
});

describe("CC-22C section 18.BH / 15 -- blind target manifest hash is unchanged exactly", () => {
  it("matches the CC-22B-frozen hash byte-for-byte", () => {
    const actual = createHash("sha256").update(blindTargetsRaw).digest("hex");
    expect(actual).toBe(EXPECTED_BLIND_TARGET_HASH);
  });
});

describe("CC-22C section 18.BI -- allowlist defaults to deny for arbitrary Unit-202 paths", () => {
  it("defaultForUnlistedPaths is DENY and an arbitrary made-up unit202 path is not in guardConfig.allowedInputs", () => {
    expect(allowlist.defaultForUnlistedPaths).toBe("DENY");
    const arbitraryPath = "scripts/content/data/unit202-completely-made-up-file.ts";
    expect(allowlist.guardConfig.allowedInputs.some((a) => a.pathOrGlob === arbitraryPath)).toBe(false);
  });
});

describe("CC-22C section 18.BJ -- exact blind-target path+hash is allowed", () => {
  it("the FROZEN_BLIND_TARGET_MANIFEST rule names the real path and the real, current hash", () => {
    const rule = allowlist.guardConfig.allowedInputs.find((a) => a.rule === "FROZEN_BLIND_TARGET_MANIFEST");
    expect(rule).toBeDefined();
    expect(rule!.matchKind).toBe("EXACT_PATH");
    expect(rule!.pathOrGlob).toBe("reports/backtests/unit202-evidence-acquisition-benchmark/UNIT202-BLIND-ACQUISITION-TARGETS.json");
    expect(rule!.requiredHash).toBe(EXPECTED_BLIND_TARGET_HASH);
  });
});

describe("CC-22C section 18.BK -- historical benchmark itself is denied", () => {
  it("UNIT202-HISTORICAL-ACQUISITION-BENCHMARK.json is in the denylist", () => {
    expect(denylist.deniedPaths).toContain("reports/backtests/unit202-evidence-acquisition-benchmark/UNIT202-HISTORICAL-ACQUISITION-BENCHMARK.json");
  });
});

describe("CC-22C section 18.BL -- canonical source-acquisition and technical-source-verification files are denied", () => {
  it("both canonical historical data files are in the denylist", () => {
    expect(denylist.deniedPaths).toContain("scripts/content/data/unit202-source-acquisition-manifest.ts");
    expect(denylist.deniedPaths).toContain("scripts/content/data/unit202-technical-source-verification.ts");
  });
});

describe("CC-22C section 18.BM -- reconciliation/cleanroom/post-hardening Unit-202 paths are denied", () => {
  it("cleanroom and post-hardening globs and reconciliation ledger files are in the denylist", () => {
    expect(denylist.deniedPaths).toContain("reports/backtests/unit202-cleanroom/**");
    expect(denylist.deniedPaths).toContain("scripts/backtests/unit202-cleanroom/**");
    expect(denylist.deniedPaths).toContain("reports/backtests/unit202-post-hardening/**");
    expect(denylist.deniedPaths).toContain("scripts/backtests/unit202-post-hardening/**");
    expect(denylist.deniedPaths).toContain("reports/backtests/unit202-reconciliation/UNIT202-PA-PROPOSITION-LEDGER.json");
  });
});

describe("CC-22C section 18.BN -- an unknown newly-created unit202-* file is denied automatically", () => {
  it("a path never seen by the denylist author is still denied by the allowlist's default-deny (never needs an explicit denylist entry)", () => {
    const neverSeenPath = "scripts/content/data/unit202-freshly-created-after-this-package.ts";
    expect(denylist.deniedPaths).not.toContain(neverSeenPath); // proves it was never enumerated
    expect(allowlist.guardConfig.allowedInputs.some((a) => a.pathOrGlob === neverSeenPath)).toBe(false); // yet still denied, via default-deny
    expect(allowlist.defaultForUnlistedPaths).toBe("DENY");
  });
});

describe("CC-22C section 18.BO -- future file-read audit contract rejects any non-allowlisted local read (defined, not executed)", () => {
  it("the access-audit contract specifies immediate hard failure and invalid/non-continuable experiment status", () => {
    expect(allowlist.accessAuditContract.status).toBe("DEFINED_NOT_EXECUTED");
    expect(allowlist.accessAuditContract.nonAllowlistedReadPolicy.onAttempt).toBe("IMMEDIATE_HARD_FAILURE");
    expect(allowlist.accessAuditContract.nonAllowlistedReadPolicy.experimentValidity).toBe("INVALID");
    expect(allowlist.accessAuditContract.nonAllowlistedReadPolicy.continuation).toBe("NONE");
  });
});

describe("CC-22C section 18.BP -- public-web discovery is not rejected by the local-file isolation policy", () => {
  it("the allowlist explicitly documents that web research is ungoverned by local-file rules", () => {
    expect(allowlist.webResearchNote.toLowerCase()).toContain("web");
    expect(allowlist.webResearchNote.toLowerCase()).toContain("independent discovery");
  });
});

describe("CC-22C -- denylist is explicitly defence-in-depth only; allowlist is authoritative", () => {
  it("denylist self-identifies as DEFENCE_IN_DEPTH_ONLY and names the allowlist as authoritative", () => {
    expect(denylist.DENYLIST_ROLE).toBe("DEFENCE_IN_DEPTH_ONLY");
    expect(denylist.authoritativeAllowlist).toBe("UNIT202-BLIND-ACQUISITION-ALLOWLIST.json");
  });
});
