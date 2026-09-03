/**
 * CC-21 section 2-8: a strictly mechanical schema-compatibility projection
 * from the frozen Unit-202 clean-room three-layer ledger onto the
 * CC-20B-hardened production `CurriculumEvidence.commandVerbPerformanceBasis`
 * field.
 *
 * This module performs NO renormalization and NO new judgement. It reads
 * ONLY the already-frozen `layerB.normalizationConfidence` value already
 * recorded on each ledger entry at clean-room freeze time, and maps it
 * through exactly the two rules the CC-21 task package authorises:
 *
 *   commandVerbPerformanceType populated AND normalizationConfidence === "EXPLICIT"
 *     -> commandVerbPerformanceBasis: "SOURCE_EXPLICIT"
 *   commandVerbPerformanceType populated AND normalizationConfidence === "STRONG_INFERENCE"
 *     -> commandVerbPerformanceBasis: "STRONG_INFERENCE"
 *   anything else (performance type absent, or a normalizationConfidence
 *   value other than the two above, e.g. "REVIEW_PROPOSED")
 *     -> left untouched (no commandVerbPerformanceBasis added at all --
 *        the pipeline's own conservative default then applies).
 *
 * It never reads subject text, command-verb text, AC numbers, model
 * judgement, calibration material, or the current Unit-202 matrix. It
 * never mutates the frozen ledger or its `normalizedRecord` objects --
 * every touched record is a NEW object (shallow-spread copy), never the
 * original ledger object.
 */
import { createHash } from "node:crypto";

import type { CurriculumEvidence, PerformanceEvidenceBasis, StandardPipelineInput } from "@alp/qualification-pipeline";

import type { LedgerEntry } from "../unit202-cleanroom/build-ledger.ts";

/** The only two normalizationConfidence values this projection ever consumes; any other value (including "REVIEW_PROPOSED") is deliberately left untouched. */
const AUTHORISED_SOURCE_CONFIDENCE = new Set(["EXPLICIT", "STRONG_INFERENCE"]);

function stableJson(value: unknown): string {
  const seen = new WeakSet();
  function sortKeys(v: unknown): unknown {
    if (v === null || typeof v !== "object") return v;
    if (seen.has(v as object)) throw new Error("stableJson: circular reference");
    seen.add(v as object);
    if (Array.isArray(v)) return v.map(sortKeys);
    const out: Record<string, unknown> = {};
    for (const k of Object.keys(v as Record<string, unknown>).sort()) out[k] = sortKeys((v as Record<string, unknown>)[k]);
    return out;
  }
  return JSON.stringify(sortKeys(value));
}

export function sha256Hex(value: unknown): string {
  return createHash("sha256").update(stableJson(value)).digest("hex");
}

export interface PerformanceBasisProjectionEntry {
  readonly proposalId: string;
  readonly evidenceId: string;
  readonly curriculumUnitId: string;
  readonly subject: string;
  /** The raw commandVerbPerformanceType value, or "(absent)" when the field was never populated. */
  readonly performanceType: string;
  readonly originalNormalizationConfidence: string;
  readonly projectedCommandVerbPerformanceBasis: PerformanceEvidenceBasis | null;
  readonly changed: boolean;
  readonly reasonUnchanged: string | null;
  readonly originalRecordHash: string;
  readonly projectedRecordHash: string;
}

export interface PerformanceBasisProjectionResult {
  readonly entries: readonly PerformanceBasisProjectionEntry[];
  readonly basisByEvidenceId: ReadonlyMap<string, PerformanceEvidenceBasis>;
  readonly counts: {
    readonly curriculumEvidenceTotal: number;
    readonly withPopulatedCommandVerbPerformanceType: number;
    readonly projectedSourceExplicit: number;
    readonly projectedStrongInference: number;
    readonly performanceFieldAbsent: number;
    readonly leftUntouchedOther: number;
  };
}

/**
 * Computes the projection from the frozen ledger alone. Pure and read-only
 * -- never mutates `ledgerEntries` or any `normalizedRecord` within it.
 */
export function computePerformanceBasisProjection(ledgerEntries: readonly LedgerEntry[]): PerformanceBasisProjectionResult {
  const entries: PerformanceBasisProjectionEntry[] = [];
  const basisByEvidenceId = new Map<string, PerformanceEvidenceBasis>();

  let withPopulatedCommandVerbPerformanceType = 0;
  let projectedSourceExplicit = 0;
  let projectedStrongInference = 0;
  let performanceFieldAbsent = 0;
  let leftUntouchedOther = 0;
  let curriculumEvidenceTotal = 0;

  for (const entry of ledgerEntries) {
    if (entry.layerB.genericPipelineRecordType !== "CurriculumEvidence") continue;
    curriculumEvidenceTotal += 1;
    const rec = entry.layerB.normalizedRecord as CurriculumEvidence;
    const confidence = entry.layerB.normalizationConfidence;
    const hasPerformanceType = rec.commandVerbPerformanceType !== undefined;

    if (!hasPerformanceType) {
      performanceFieldAbsent += 1;
      entries.push({
        proposalId: entry.proposalId,
        evidenceId: rec.evidenceId,
        curriculumUnitId: rec.curriculumUnitId,
        subject: rec.subject,
        performanceType: "(absent)",
        originalNormalizationConfidence: confidence,
        projectedCommandVerbPerformanceBasis: null,
        changed: false,
        reasonUnchanged: "commandVerbPerformanceType is not populated on this record",
        originalRecordHash: sha256Hex(rec),
        projectedRecordHash: sha256Hex(rec),
      });
      continue;
    }

    withPopulatedCommandVerbPerformanceType += 1;

    if (!AUTHORISED_SOURCE_CONFIDENCE.has(confidence)) {
      leftUntouchedOther += 1;
      entries.push({
        proposalId: entry.proposalId,
        evidenceId: rec.evidenceId,
        curriculumUnitId: rec.curriculumUnitId,
        subject: rec.subject,
        performanceType: rec.commandVerbPerformanceType!,
        originalNormalizationConfidence: confidence,
        projectedCommandVerbPerformanceBasis: null,
        changed: false,
        reasonUnchanged: `normalizationConfidence "${confidence}" is not one of the two authorised source values (EXPLICIT, STRONG_INFERENCE) -- left untouched, never guessed`,
        originalRecordHash: sha256Hex(rec),
        projectedRecordHash: sha256Hex(rec),
      });
      continue;
    }

    const projected: PerformanceEvidenceBasis = confidence === "EXPLICIT" ? "SOURCE_EXPLICIT" : "STRONG_INFERENCE";
    if (projected === "SOURCE_EXPLICIT") projectedSourceExplicit += 1;
    else projectedStrongInference += 1;
    basisByEvidenceId.set(rec.evidenceId, projected);

    const projectedRecord: CurriculumEvidence = { ...rec, commandVerbPerformanceBasis: projected };
    entries.push({
      proposalId: entry.proposalId,
      evidenceId: rec.evidenceId,
      curriculumUnitId: rec.curriculumUnitId,
      subject: rec.subject,
      performanceType: rec.commandVerbPerformanceType!,
      originalNormalizationConfidence: confidence,
      projectedCommandVerbPerformanceBasis: projected,
      changed: true,
      reasonUnchanged: null,
      originalRecordHash: sha256Hex(rec),
      projectedRecordHash: sha256Hex(projectedRecord),
    });
  }

  return {
    entries,
    basisByEvidenceId,
    counts: {
      curriculumEvidenceTotal,
      withPopulatedCommandVerbPerformanceType,
      projectedSourceExplicit,
      projectedStrongInference,
      performanceFieldAbsent,
      leftUntouchedOther,
    },
  };
}

/**
 * Applies the projection to a COPY of an assembled StandardPipelineInput.
 * Never mutates `input` -- every returned array/object is new. The ONLY
 * field this ever adds is `commandVerbPerformanceBasis` on a `curriculum`
 * entry whose `evidenceId` is present in `basisByEvidenceId`; every other
 * field, on every record of every kind, is passed through unchanged.
 */
export function applyPerformanceBasisProjection(input: StandardPipelineInput, basisByEvidenceId: ReadonlyMap<string, PerformanceEvidenceBasis>): StandardPipelineInput {
  return {
    ...input,
    curriculum: input.curriculum.map((c) => {
      const basis = basisByEvidenceId.get(c.evidenceId);
      return basis === undefined ? c : { ...c, commandVerbPerformanceBasis: basis };
    }),
  };
}

export interface ProjectionVerificationResult {
  readonly ok: boolean;
  readonly violations: readonly string[];
}

/**
 * Mechanically proves that `projected` differs from `base` ONLY by the
 * addition of an authorised `commandVerbPerformanceBasis` value on zero or
 * more `curriculum` entries -- no field deletion, no changed existing
 * field, no top-level field added or removed, on ANY record of ANY kind
 * (curriculum or otherwise). Read-only; never mutates either input.
 */
export function verifyOnlyPerformanceBasisAdded(base: StandardPipelineInput, projected: StandardPipelineInput): ProjectionVerificationResult {
  const violations: string[] = [];

  const baseKeys = new Set(Object.keys(base));
  const projectedKeys = new Set(Object.keys(projected));
  for (const k of projectedKeys) if (!baseKeys.has(k)) violations.push(`unexpected new top-level StandardPipelineInput field "${k}"`);
  for (const k of baseKeys) if (!projectedKeys.has(k)) violations.push(`top-level StandardPipelineInput field "${k}" was removed`);

  for (const key of baseKeys) {
    if (key === "curriculum") continue;
    const k = key as keyof StandardPipelineInput;
    if (stableJson(base[k]) !== stableJson(projected[k])) violations.push(`non-curriculum field "${key}" changed`);
  }

  if (base.curriculum.length !== projected.curriculum.length) {
    violations.push(`curriculum array length changed: ${base.curriculum.length} -> ${projected.curriculum.length}`);
    return { ok: false, violations };
  }

  for (let i = 0; i < base.curriculum.length; i++) {
    const b = base.curriculum[i]! as unknown as Record<string, unknown>;
    const p = projected.curriculum[i]! as unknown as Record<string, unknown>;
    const evidenceId = String(b.evidenceId);
    const bKeys = new Set(Object.keys(b));
    const pKeys = new Set(Object.keys(p));
    const addedKeys = [...pKeys].filter((k) => !bKeys.has(k));
    const removedKeys = [...bKeys].filter((k) => !pKeys.has(k));

    if (removedKeys.length > 0) violations.push(`curriculum[${i}] (${evidenceId}) removed field(s): ${removedKeys.join(", ")}`);
    if (addedKeys.length > 1 || (addedKeys.length === 1 && addedKeys[0] !== "commandVerbPerformanceBasis")) {
      violations.push(`curriculum[${i}] (${evidenceId}) added unauthorised field(s): ${addedKeys.join(", ")}`);
    }
    if (addedKeys.includes("commandVerbPerformanceBasis")) {
      const val = p.commandVerbPerformanceBasis;
      if (val !== "SOURCE_EXPLICIT" && val !== "STRONG_INFERENCE") violations.push(`curriculum[${i}] (${evidenceId}) has unauthorised commandVerbPerformanceBasis value ${JSON.stringify(val)}`);
    }
    for (const k of bKeys) {
      if (k === "commandVerbPerformanceBasis") continue;
      if (stableJson(b[k]) !== stableJson(p[k])) violations.push(`curriculum[${i}] (${evidenceId}) existing field "${k}" changed`);
    }
  }

  return { ok: violations.length === 0, violations };
}
