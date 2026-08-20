/**
 * Framework-independent package boundary.
 *
 * CC-05B: deterministic calculation/question engine. Owns quantities/
 * units, structured formula evaluation, deterministic parameter/variant
 * generation, answer marking, and evidence emission for the proving-slice
 * families this package's tests exercise against CC-05A's governed
 * blueprints (Ohm's law, series resistance, parallel resistance,
 * magnetism/electromagnetism). No React, no DOM, no Node-only runtime
 * dependency, no learner-runtime AI -- see ./engine.ts and the CC-05B
 * evidence document (docs/architecture/evidence/
 * CC-05B-DETERMINISTIC-QUESTION-ENGINE.md) for the full contract.
 */

export const packageId = "calculation-engine" as const;

export type PackageId = typeof packageId;

export * from "./seed.ts";
export * from "./formula-evaluator.ts";
export * from "./parameter-generation.ts";
export * from "./marking.ts";
export * from "./types.ts";
export * from "./engine.ts";
export * from "./presentation.ts";
export type { GenerationContext, QuestionExecutor } from "./families/shared.ts";
