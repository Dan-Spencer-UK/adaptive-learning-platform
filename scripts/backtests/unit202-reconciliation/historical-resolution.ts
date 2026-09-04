/**
 * CC-23 section 19: the shared, pure historical-benchmark resolution
 * logic -- extracted out of build-benchmark.ts so both the sealed Unit-202
 * historical benchmark builder AND the new evidence-requirement-level
 * benchmark (scripts/backtests/unit202-evidence-acquisition-preflight/)
 * derive a PA proposition's historical state from EXACTLY the same rule,
 * never two independently-drifting copies.
 *
 * No top-level side effects: `validateHistoricalBenchmarkBindings` must be
 * called explicitly by a caller before relying on `historicalBenchmarkFor`
 * -- it throws loudly on any unresolvable/ambiguous/duplicate binding, or
 * on an `atomicSubclaimOverride` that cites a locator not actually
 * connected to its own binding's records (see historical-benchmark-
 * bindings.ts's own doc comment on that field).
 *
 * CC-23 section 19 correction (the reason this module exists as a
 * standalone, testable unit): an atomic PA proposition may NEVER simply
 * inherit a bound compound record's overall `coverageState` when that
 * record's own connected source locator demonstrably establishes this
 * specific atomic sub-claim while a genuinely different sub-claim (sharing
 * the same record) is what is actually gapped. `atomicSubclaimOverride` is
 * the sole, mechanically-validated escape hatch for that case -- it is
 * never a licence to hand-type a historical state from prose judgement
 * alone.
 */

import { unit202TechnicalSourceVerification } from "../../content/data/unit202-technical-source-verification.ts";
import { HISTORICAL_BENCHMARK_BINDINGS, type HistoricalBenchmarkBinding, type HistoricalRecordRef } from "./historical-benchmark-bindings.ts";
import { PA_TARGET, type PATargetProposition } from "./pa-target.ts";

export type HistoricalState = "HISTORICALLY_VERIFIED" | "HISTORICALLY_CONDITIONAL" | "HISTORICALLY_SOURCE_GAP" | "NO_HISTORICAL_BENCHMARK" | "NOT_APPLICABLE";

export type CoverageRecord = (typeof unit202TechnicalSourceVerification.propositionCoverage)[number];

const paByText = new Map(PA_TARGET.map((p) => [p.proposition, p]));

export function resolveRecord(r: HistoricalRecordRef): CoverageRecord {
  const matches = unit202TechnicalSourceVerification.propositionCoverage.filter((c) => c.clusterKey === r.clusterKey && c.requirementKind === r.requirementKind && c.requirementText === r.requirementText);
  if (matches.length === 0) throw new Error(`CC-22C validation failure: historical-benchmark-bindings.ts references a record that does not exist: ${r.clusterKey}::${r.requirementKind}::"${r.requirementText}"`);
  if (matches.length > 1) throw new Error(`CC-22C validation failure: historical-benchmark-bindings.ts record reference is ambiguous (${matches.length} matches): ${r.clusterKey}::${r.requirementKind}::"${r.requirementText}"`);
  return matches[0]!;
}

const bindingByText = new Map(HISTORICAL_BENCHMARK_BINDINGS.map((b) => [b.paPropositionText, b]));

/** Throws on any structural defect in HISTORICAL_BENCHMARK_BINDINGS. Callers must invoke this before trusting `historicalBenchmarkFor`. */
export function validateHistoricalBenchmarkBindings(): void {
  for (const b of HISTORICAL_BENCHMARK_BINDINGS) {
    if (!paByText.has(b.paPropositionText)) throw new Error(`CC-22C validation failure: historical-benchmark-bindings.ts references unknown PA proposition text "${b.paPropositionText}"`);
    if (b.records.length === 0) throw new Error(`CC-22C validation failure: binding for "${b.paPropositionText}" names zero records`);
    if (b.mappingBasis === "EXACT_EQUIVALENT" && b.records.length !== 1) throw new Error(`CC-22C validation failure: EXACT_EQUIVALENT binding for "${b.paPropositionText}" must name exactly one record`);

    if (b.atomicSubclaimOverride) {
      const locatorKey = b.atomicSubclaimOverride.verifiedAgainstLocatorKey;
      const locator = unit202TechnicalSourceVerification.sourceLocators.find((l) => l.key === locatorKey);
      if (!locator) throw new Error(`CC-23 validation failure: atomicSubclaimOverride for "${b.paPropositionText}" cites unknown locator key "${locatorKey}"`);
      const resolved = b.records.map(resolveRecord);
      const connected = resolved.some((r) => r.supportingSourceLocatorKeys.includes(locatorKey));
      if (!connected) {
        throw new Error(
          `CC-23 validation failure: atomicSubclaimOverride for "${b.paPropositionText}" cites locator "${locatorKey}", which is not in any bound record's own supportingSourceLocatorKeys -- an override can never cite a locator unconnected to the binding's own records.`,
        );
      }
    }
  }
  const bindingCountByText = new Map<string, number>();
  for (const b of HISTORICAL_BENCHMARK_BINDINGS) bindingCountByText.set(b.paPropositionText, (bindingCountByText.get(b.paPropositionText) ?? 0) + 1);
  const duplicateBindings = [...bindingCountByText.entries()].filter(([, n]) => n > 1);
  if (duplicateBindings.length > 0) throw new Error(`CC-22C validation failure: duplicate historical-benchmark-bindings.ts entries for: ${duplicateBindings.map(([t]) => t).join(" | ")}`);
}

export interface ResolvedHistoricalRecord {
  readonly clusterKey: string;
  readonly requirementKind: string;
  readonly requirementText: string;
  readonly coverageState: string;
  readonly supportingSourceLocatorKeys: readonly string[];
  readonly gapReason: string | null;
}

export interface HistoricalResolution {
  readonly state: HistoricalState;
  readonly bindingBasis: string | null;
  readonly resolvedRecords: readonly ResolvedHistoricalRecord[];
  readonly reasonIfUnmapped: string | null;
  /** Non-null only when an `atomicSubclaimOverride` actually changed the result away from the raw record-level aggregation (task section 19) -- full transparency, never a silent substitution. */
  readonly overrideNote: string | null;
}

function aggregateStates(resolved: readonly CoverageRecord[]): HistoricalState {
  const states = new Set(resolved.map((r) => r.coverageState));
  return states.has("SOURCE_GAP") ? "HISTORICALLY_SOURCE_GAP" : states.has("CONDITIONAL_SOURCE_GAP") ? "HISTORICALLY_CONDITIONAL" : "HISTORICALLY_VERIFIED";
}

function overrideStateToHistoricalState(state: NonNullable<HistoricalBenchmarkBinding["atomicSubclaimOverride"]>["state"]): HistoricalState {
  return state === "SOURCE_GAP" ? "HISTORICALLY_SOURCE_GAP" : state === "CONDITIONAL_SOURCE_GAP" ? "HISTORICALLY_CONDITIONAL" : "HISTORICALLY_VERIFIED";
}

/** Task section 6's aggregation rule (SOURCE_GAP dominates > CONDITIONAL_SOURCE_GAP dominates > else VERIFIED), with the section-19 atomic-subclaim override applied on top when the binding declares one. */
export function historicalBenchmarkFor(p: PATargetProposition): HistoricalResolution {
  if (p.class === "OUT_OF_SCOPE") return { state: "NOT_APPLICABLE", bindingBasis: null, resolvedRecords: [], reasonIfUnmapped: null, overrideNote: null };
  const binding = bindingByText.get(p.proposition);
  if (!binding) {
    return {
      state: "NO_HISTORICAL_BENCHMARK",
      bindingBasis: null,
      resolvedRecords: [],
      reasonIfUnmapped:
        "No explicit historical-benchmark-bindings.ts entry exists for this proposition -- either no historical record states it, or equivalence to a plausible-looking historical row was not judged safe (task section 4/9).",
      overrideNote: null,
    };
  }
  const resolved = binding.records.map(resolveRecord);
  const rawState = aggregateStates(resolved);
  const resolvedRecords: ResolvedHistoricalRecord[] = resolved.map((r) => ({
    clusterKey: r.clusterKey,
    requirementKind: r.requirementKind,
    requirementText: r.requirementText,
    coverageState: r.coverageState,
    supportingSourceLocatorKeys: r.supportingSourceLocatorKeys,
    gapReason: r.gapReason ?? null,
  }));

  if (!binding.atomicSubclaimOverride) {
    return { state: rawState, bindingBasis: binding.mappingBasis, resolvedRecords, reasonIfUnmapped: null, overrideNote: null };
  }

  const overrideState = overrideStateToHistoricalState(binding.atomicSubclaimOverride.state);
  return {
    state: overrideState,
    bindingBasis: binding.mappingBasis,
    resolvedRecords,
    reasonIfUnmapped: null,
    overrideNote:
      overrideState === rawState
        ? null
        : `CC-23 section 19 atomic-subclaim override applied: raw record-level aggregation would read ${rawState}, but ${binding.atomicSubclaimOverride.verifiedAgainstLocatorKey}'s own locator record establishes this specific atomic proposition independently. ${binding.atomicSubclaimOverride.overrideRationale}`,
  };
}
