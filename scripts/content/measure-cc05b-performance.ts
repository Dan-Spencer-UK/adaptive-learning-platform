/**
 * CC-05B: development-machine timing evidence for question generation and
 * answer marking, run against the real CC-05A proving-slice blueprints.
 *
 * Per this task's own instruction ("do not invent arbitrary production
 * millisecond guarantees"), this records honest dev-machine/Node timing
 * only -- exactly the same "dev-machine-metro-jest"-equivalent honesty
 * standard CC-04N's performance.ts established (see
 * docs/architecture/evidence/CC-04N-MOBILE-FOUNDATION-EVIDENCE.md §8):
 * these numbers describe THIS toolchain's timing, not a claimed
 * on-device production guarantee. Real device timing remains PENDING
 * physical-device qualification, as it did for CC-04N.
 *
 * Usage: node scripts/content/measure-cc05b-performance.ts
 */

import { evaluateAnswer, generateQuestionInstance, type DeterministicIdentity } from "@alp/calculation-engine";
import { pedagogyManifestSchema } from "@alp/content-schema";
import { cc05aPedagogyUnit202 } from "./data/cc05a-pedagogy-unit202.ts";

const ITERATIONS_PER_BLUEPRINT = 200;

function main(): void {
  const pedagogy = pedagogyManifestSchema.parse(cc05aPedagogyUnit202);
  // CC-05B2: measured against every governed question blueprint (84), not
  // just the original 36-blueprint proving subset.
  const provingBlueprints = pedagogy.questionBlueprints;

  let totalGenerations = 0;
  let totalGenerateMs = 0;
  let totalEvaluateMs = 0;
  let worstGenerateMs = 0;
  let worstGenerateBlueprint = "";

  for (const blueprint of provingBlueprints) {
    for (let seed = 0; seed < ITERATIONS_PER_BLUEPRINT; seed++) {
      const identity: DeterministicIdentity = {
        blueprintId: blueprint.id,
        blueprintVersion: 1,
        contentRelease: "2026.08.001-perf",
        seed,
      };

      const generateStart = performance.now();
      const instance = generateQuestionInstance({
        blueprint,
        formulaFamilies: pedagogy.formulaFamilies,
        diagramBlueprints: pedagogy.diagramBlueprints,
        workedExampleBlueprints: pedagogy.workedExampleBlueprints,
        identity,
      });
      const generateMs = performance.now() - generateStart;

      const evaluateStart = performance.now();
      evaluateAnswer(instance, instance.expected.value);
      const evaluateMs = performance.now() - evaluateStart;

      totalGenerations++;
      totalGenerateMs += generateMs;
      totalEvaluateMs += evaluateMs;
      if (generateMs > worstGenerateMs) {
        worstGenerateMs = generateMs;
        worstGenerateBlueprint = blueprint.id;
      }
    }
  }

  const lines = [
    "CC-05B performance evidence (dev-machine, Node, single-threaded, cold Vitest/Node process -- NOT device timing)",
    "==================================================================================================================",
    `Governed blueprints measured: ${provingBlueprints.length}`,
    `Iterations per blueprint: ${ITERATIONS_PER_BLUEPRINT}`,
    `Total generate+evaluate operations: ${totalGenerations}`,
    `Total generation time: ${totalGenerateMs.toFixed(2)}ms`,
    `Average generation time: ${(totalGenerateMs / totalGenerations).toFixed(4)}ms`,
    `Worst single generation time: ${worstGenerateMs.toFixed(4)}ms (${worstGenerateBlueprint})`,
    `Total marking time: ${totalEvaluateMs.toFixed(2)}ms`,
    `Average marking time: ${(totalEvaluateMs / totalGenerations).toFixed(4)}ms`,
  ];
  console.log(lines.join("\n"));
}

main();
