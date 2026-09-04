/**
 * CC-22B section 21: mechanically proves the invariants task section 19
 * requires, against the committed outputs build-benchmark.ts produces
 * (reports/backtests/unit202-reconciliation/UNIT202-PA-PROPOSITION-
 * LEDGER.json, reports/backtests/unit202-evidence-acquisition-benchmark/
 * UNIT202-BLIND-ACQUISITION-TARGETS.json and
 * UNIT202-HISTORICAL-ACQUISITION-BENCHMARK.json) and the underlying
 * decision data files.
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { unit202SourceAcquisitionManifest } from "../../content/data/unit202-source-acquisition-manifest.ts";
import { CLAIM_DECISIONS } from "./claim-decisions.ts";
import { EXACT_CLAIM_BINDINGS } from "./exact-claim-bindings.ts";
import { PA_TARGET } from "./pa-target.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..", "..", "..");

function readJson<T>(relPath: string): T {
  return JSON.parse(readFileSync(path.join(repoRoot, relPath), "utf-8")) as T;
}

interface HistoricalResolvedRecord {
  clusterKey: string;
  requirementKind: string;
  requirementText: string;
  coverageState: string;
}

interface LedgerRow {
  id: string;
  ac: string;
  proposition: string;
  paClassification: string;
  isRepresentativeExemplar: boolean;
  technicalEvidenceState: string;
  historicalBenchmarkState: string;
  historicalResolvedRecords: HistoricalResolvedRecord[];
  acquisitionReplayRequirement: string;
  nextActions: string[];
}

const ledgerFile = readJson<{ summary: Record<string, unknown>; ledger: LedgerRow[] }>("reports/backtests/unit202-reconciliation/UNIT202-PA-PROPOSITION-LEDGER.json");
const ledger = ledgerFile.ledger;

const blindTargetsRaw = readFileSync(path.join(repoRoot, "reports/backtests/unit202-evidence-acquisition-benchmark/UNIT202-BLIND-ACQUISITION-TARGETS.json"), "utf-8");
const blindTargets = JSON.parse(blindTargetsRaw) as { targets: { acquisitionTargetId: string; ac: string; proposition: string; acquisitionReplayRequirement: string; isRepresentativeExemplar: boolean }[] };

const sealedBenchmark = readJson<{ BENCHMARK_ACCESS_POLICY: string; entries: { acquisitionTargetId: string; historicalCoverageState: string }[] }>("reports/backtests/unit202-evidence-acquisition-benchmark/UNIT202-HISTORICAL-ACQUISITION-BENCHMARK.json");
const denylist = readJson<{ deniedPaths: string[] }>("reports/backtests/unit202-evidence-acquisition-benchmark/UNIT202-BLIND-ACQUISITION-DENYLIST.json");

function findByText(text: string): LedgerRow {
  const row = ledger.find((r) => r.proposition === text);
  expect(row, `expected a PA_TARGET row for "${text}"`).toBeDefined();
  return row!;
}

describe("CC-22B section 19.1 -- Source-Acquisition-Manifest row count is NOT PA proposition count", () => {
  it("historical manifest proposition count differs from the final PA proposition count", () => {
    const historicalCount = unit202SourceAcquisitionManifest.clusters.reduce(
      (n, c) => n + c.factualPropositionsRequiringSupport.length + c.relationshipsOrMechanismsRequiringSupport.length + c.proceduresOrCalculationRulesRequiringSupport.length + c.symbolsOrConventionsRequiringSupport.length + c.physicalOrComponentRecognitionRequirements.length,
      0,
    );
    expect(historicalCount).not.toBe(PA_TARGET.length);
    expect(PA_TARGET.length).toBe(ledger.length);
  });
});

describe("CC-22B section 19.2 -- no source-manifest proposition automatically becomes REQUIRED_QUALIFICATION_KNOWLEDGE", () => {
  it("PA_TARGET classification is authored directly (contextual/out-of-scope rows exist that a naive manifest-derived ledger would have missed)", () => {
    const contextual = PA_TARGET.filter((p) => p.class === "CONTEXTUAL_TEACHING_SUPPORT");
    const outOfScope = PA_TARGET.filter((p) => p.class === "OUT_OF_SCOPE");
    expect(contextual.length).toBeGreaterThan(0);
    expect(outOfScope.length).toBeGreaterThan(0);
  });
});

describe("CC-22B section 19.3 -- fractional indices are not separate required mastery", () => {
  it("no REQUIRED_QUALIFICATION_KNOWLEDGE row mentions fractional indices, and the exclusion is explicit", () => {
    const requiredMentioningFractional = PA_TARGET.filter((p) => p.class === "REQUIRED_QUALIFICATION_KNOWLEDGE" && /fractional indices/i.test(p.proposition));
    expect(requiredMentioningFractional).toEqual([]);
    const row = findByText("Fractional indices as separate mastery.");
    expect(row.paClassification).toBe("OUT_OF_SCOPE");
  });
});

describe("CC-22B section 19.4 -- formal KVL/KCL terminology is not a separate mastery topic", () => {
  it("Kirchhoff's Voltage/Current Law headings are OUT_OF_SCOPE", () => {
    expect(findByText("Separate Kirchhoff's Voltage Law mastery heading.").paClassification).toBe("OUT_OF_SCOPE");
    expect(findByText("Separate Kirchhoff's Current Law mastery heading.").paClassification).toBe("OUT_OF_SCOPE");
  });
});

describe("CC-22B section 19.5/19.6/19.7/19.8 -- specific contextual classifications", () => {
  it("fuse operation is contextual", () => {
    expect(findByText("Fuse operation as an example of the thermal effect.").paClassification).toBe("CONTEXTUAL_TEACHING_SUPPORT");
  });
  it("relay and contactor are contextual", () => {
    expect(findByText("Relay.").paClassification).toBe("CONTEXTUAL_TEACHING_SUPPORT");
    expect(findByText("Contactor.").paClassification).toBe("CONTEXTUAL_TEACHING_SUPPORT");
  });
  it("telephone master-socket currency is contextual and non-blocking (optional acquisition context)", () => {
    const row = findByText("Telephone: master/secondary socket details.");
    expect(row.paClassification).toBe("CONTEXTUAL_TEACHING_SUPPORT");
    expect(row.acquisitionReplayRequirement).toBe("OPTIONAL_CONTEXT");
  });
  it("wireless advantages are contextual", () => {
    expect(findByText("Wireless: practical advantages/applications.").paClassification).toBe("CONTEXTUAL_TEACHING_SUPPORT");
  });
});

describe("CC-22B section 19.9 / 19.I -- AC5.5 has zero unresolved PA decisions", () => {
  it("no AC5.5 row carries a PROJECT_ARCHITECT_DECISION next action", () => {
    const ac55 = ledger.filter((r) => r.ac === "AC5.5");
    expect(ac55.length).toBeGreaterThan(0);
    for (const r of ac55) expect(r.nextActions).not.toContain("PROJECT_ARCHITECT_DECISION");
  });
  it("globally, zero PA decisions remain (task section 8/20)", () => {
    expect(ledgerFile.summary.projectArchitectDecisionRemaining).toBe(0);
  });
});

describe("CC-22B section 19.10/19.11/19.12 -- overdepth rejections remain in force", () => {
  it("V=V0sin(2*pi*f*t) remains rejected overdepth for all its targets", () => {
    const decisions = CLAIM_DECISIONS.filter((d) => d.claimKey === "unit202.review-fact.ac-sine-equation");
    expect(decisions.length).toBeGreaterThan(0);
    for (const d of decisions) expect(d.decision).toBe("REJECT_OVERDEPTH");
  });
  it("differential Faraday law remains rejected overdepth for all its targets", () => {
    const decisions = CLAIM_DECISIONS.filter((d) => d.claimKey === "unit202.review-fact.faradays-law");
    expect(decisions.length).toBeGreaterThan(0);
    for (const d of decisions) expect(d.decision).toBe("REJECT_OVERDEPTH");
  });
  it("vector F=Il x B remains rejected overdepth", () => {
    const decisions = CLAIM_DECISIONS.filter((d) => d.claimKey === "unit202.review-fact.force-on-conductor");
    expect(decisions.length).toBeGreaterThan(0);
    for (const d of decisions) expect(d.decision).toBe("REJECT_OVERDEPTH");
  });
});

describe("CC-22B section 19.13 / 7 -- every EXACT_CURRENT_FACTUAL_CLAIM has an explicit proposition->claim binding", () => {
  it("no row reaches EXACT_CURRENT_FACTUAL_CLAIM without a matching EXACT_CLAIM_BINDINGS entry", () => {
    const boundTexts = new Set(EXACT_CLAIM_BINDINGS.map((b) => b.propositionText));
    const exactRows = ledger.filter((r) => r.technicalEvidenceState === "EXACT_CURRENT_FACTUAL_CLAIM");
    expect(exactRows.length).toBeGreaterThan(0);
    for (const r of exactRows) expect(boundTexts.has(r.proposition), `"${r.proposition}" reached EXACT_CURRENT_FACTUAL_CLAIM with no explicit binding`).toBe(true);
  });
});

describe("CC-22B section 19.14 / 21.H -- nextActions supports multiple simultaneous actions", () => {
  it("at least one row carries more than one next action", () => {
    expect(ledger.some((r) => r.nextActions.length > 1)).toBe(true);
  });
});

describe("CC-22B section 19.15 / 21.A -- historically VERIFIED does not suppress acquisitionReplayRequirement=REQUIRED", () => {
  it("at least one historically VERIFIED row is still REQUIRED for acquisition replay", () => {
    const verifiedRequired = ledger.filter((r) => r.historicalBenchmarkState === "HISTORICALLY_VERIFIED" && r.acquisitionReplayRequirement === "REQUIRED");
    expect(verifiedRequired.length).toBeGreaterThan(0);
  });
});

describe("CC-22B section 19.16 / 21.B -- blind target manifest contains zero historical answer leakage", () => {
  it("no URL, historic source id, source title, locator, claim id, or verification-outcome token appears anywhere in the raw JSON", () => {
    const lower = blindTargetsRaw.toLowerCase();
    const forbidden = ["http://", "https://", "www.", "src-", ".pdf", "sourcelocator", "evidenceid", "ev-tec", "ev-cur", "approvedsource", "coveragestate", "verified", "source_gap", "sourcegap"];
    for (const token of forbidden) expect(lower.includes(token), `forbidden token "${token}" found in blind target manifest`).toBe(false);
  });
});

describe("CC-22B section 19.17 -- sealed benchmark contains the historical comparison data", () => {
  it("BENCHMARK_ACCESS_POLICY is POST_RUN_COMPARISON_ONLY and entries carry historical coverage state", () => {
    expect(sealedBenchmark.BENCHMARK_ACCESS_POLICY).toBe("POST_RUN_COMPARISON_ONLY");
    expect(sealedBenchmark.entries.length).toBeGreaterThan(0);
    for (const e of sealedBenchmark.entries) expect(["HISTORICALLY_VERIFIED", "HISTORICALLY_CONDITIONAL", "HISTORICALLY_SOURCE_GAP", "NO_HISTORICAL_BENCHMARK"]).toContain(e.historicalCoverageState);
  });
});

describe("CC-22B section 19.18 -- denylist covers all known historical Unit-202 technical-evidence leakage paths", () => {
  it("denies the canonical source-acquisition-manifest and technical-source-verification data files", () => {
    expect(denylist.deniedPaths).toContain("scripts/content/data/unit202-source-acquisition-manifest.ts");
    expect(denylist.deniedPaths).toContain("scripts/content/data/unit202-technical-source-verification.ts");
  });
});

describe("CC-22B section 21.C -- same PA proposition can map to multiple historic source-verification rows (CC-22C: via an explicit MULTIPLE_HISTORICAL_RECORDS_REQUIRED binding)", () => {
  it("at least one row has more than one bound historical record", () => {
    expect(ledger.some((r) => r.historicalResolvedRecords.length > 1)).toBe(true);
  });
});

describe("CC-22B section 21.D -- one historic source proposition can support multiple PA propositions (CC-22C: via explicit compound bindings)", () => {
  it("at least one bound historical record identity is shared by two distinct PA propositions", () => {
    const rowsByHistoricalMatch = new Map<string, Set<string>>();
    for (const r of ledger) {
      for (const rec of r.historicalResolvedRecords) {
        const key = `${rec.clusterKey}::${rec.requirementKind}::${rec.requirementText}`;
        const set = rowsByHistoricalMatch.get(key) ?? new Set<string>();
        set.add(r.proposition);
        rowsByHistoricalMatch.set(key, set);
      }
    }
    expect([...rowsByHistoricalMatch.values()].some((s) => s.size > 1)).toBe(true);
  });
});

describe("CC-22B section 21.E -- contextual propositions do not enter the primary required acquisition count", () => {
  it("no CONTEXTUAL_TEACHING_SUPPORT row has acquisitionReplayRequirement=REQUIRED", () => {
    const contextual = ledger.filter((r) => r.paClassification === "CONTEXTUAL_TEACHING_SUPPORT");
    expect(contextual.length).toBeGreaterThan(0);
    for (const r of contextual) expect(r.acquisitionReplayRequirement).toBe("OPTIONAL_CONTEXT");
  });
});

describe("CC-22B section 21.F -- OUT_OF_SCOPE propositions do not enter the acquisition target count", () => {
  it("no OUT_OF_SCOPE row appears in the blind acquisition target manifest", () => {
    const outOfScopeTexts = new Set(ledger.filter((r) => r.paClassification === "OUT_OF_SCOPE").map((r) => r.proposition));
    expect(outOfScopeTexts.size).toBeGreaterThan(0);
    for (const t of blindTargets.targets) expect(outOfScopeTexts.has(t.proposition)).toBe(false);
  });
});

describe("CC-22B section 21.G -- a representative exemplar may enter required acquisition replay while retaining exemplar semantics", () => {
  it("at least one representative-exemplar row is REQUIRED for acquisition replay and still flagged as an exemplar", () => {
    const exemplars = ledger.filter((r) => r.isRepresentativeExemplar);
    expect(exemplars.length).toBeGreaterThan(0);
    for (const r of exemplars) {
      expect(r.acquisitionReplayRequirement).toBe("REQUIRED");
      expect(r.isRepresentativeExemplar).toBe(true);
    }
    const targetExemplars = blindTargets.targets.filter((t) => t.isRepresentativeExemplar);
    expect(targetExemplars.length).toBe(exemplars.length);
  });
});
