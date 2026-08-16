/**
 * CC-05C: performance evidence for the proving slice's local generate ->
 * mark -> emit-evidence pipeline, measured under the real Jest/Hermes-
 * adjacent RN test environment this repo already uses for mobile
 * measurement (see lib/native-proof/performance.ts's header comment and
 * docs/product/MOBILE-UX-ENGINEERING-STANDARD.md §9 -- "no fabricated
 * numeric guarantees", measure don't invent). This is dev-machine/Jest
 * timing, not on-device timing -- see the CC-05C evidence document for
 * the full device-evidence caveat.
 */
import { emitProvingEvidence, generateProvingQuestion, markProvingAnswer } from "./proving-engine";
import { PROVING_FAMILIES } from "@/lib/proving-content/unit202-proving-fixture";

const ALL = PROVING_FAMILIES.flatMap((f) => f.questionBlueprints.map((q) => ({ familyId: f.id, blueprintId: q.id })));
const ITERATIONS = 50;

function now(): number {
  return performance?.now() ?? Date.now();
}

describe("proving-engine performance (dev-machine, Jest, informational)", () => {
  it("measures generate/mark/emit timing across every proving-slice blueprint", () => {
    let totalGenerateMs = 0;
    let totalMarkMs = 0;
    let totalEmitMs = 0;
    let worstGenerateMs = 0;
    let worstBlueprint = "";
    let ops = 0;

    for (const { familyId, blueprintId } of ALL) {
      for (let i = 0; i < ITERATIONS; i++) {
        const seed = i + 1;

        const t0 = now();
        const instance = generateProvingQuestion({ familyId, blueprintId, seed });
        const t1 = now();
        const evaluation = markProvingAnswer(instance, instance.expected.value);
        const t2 = now();
        emitProvingEvidence(instance, evaluation);
        const t3 = now();

        const generateMs = t1 - t0;
        totalGenerateMs += generateMs;
        totalMarkMs += t2 - t1;
        totalEmitMs += t3 - t2;
        ops++;
        if (generateMs > worstGenerateMs) {
          worstGenerateMs = generateMs;
          worstBlueprint = blueprintId;
        }
      }
    }

    const avgGenerateMs = totalGenerateMs / ops;
    const avgMarkMs = totalMarkMs / ops;
    const avgEmitMs = totalEmitMs / ops;

    console.log(
      [
        "CC-05C proving-engine performance (dev-machine, Jest, single-threaded)",
        `Blueprints measured: ${ALL.length}`,
        `Iterations per blueprint: ${ITERATIONS}`,
        `Total operations: ${ops}`,
        `Average generation time: ${avgGenerateMs.toFixed(4)}ms`,
        `Worst single generation time: ${worstGenerateMs.toFixed(4)}ms (${worstBlueprint})`,
        `Average marking time: ${avgMarkMs.toFixed(4)}ms`,
        `Average evidence-emission time: ${avgEmitMs.toFixed(4)}ms`,
      ].join("\n"),
    );

    // Directional-only sanity bound (Mobile UX Engineering Standard §9: no
    // fabricated numeric SLA) -- catches a gross regression, not a tuned budget.
    expect(avgGenerateMs).toBeLessThan(50);
  });
});
