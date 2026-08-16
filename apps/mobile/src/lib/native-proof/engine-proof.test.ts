/**
 * Tier 2 (native/Hermes-integration-flavoured) test for the CC-05B
 * engine: runs under jest-expo, the same Babel/module-resolution
 * pipeline a real Expo build uses (unlike the root Vitest suite, which
 * never touches RN-specific tooling). This does NOT prove on-device
 * Hermes execution (no emulator/device is available in this environment)
 * -- see docs/architecture/evidence/CC-05B-DETERMINISTIC-QUESTION-ENGINE.md
 * for the exact evidentiary tier this provides.
 */
import { runEngineProof } from "./engine-proof";

describe("runEngineProof", () => {
  it("resolves and executes the real @alp/calculation-engine generate/evaluate/evidence pipeline under the RN/Jest pipeline", () => {
    const results = runEngineProof();

    expect(results.length).toBeGreaterThanOrEqual(5);
    for (const result of results) {
      expect(result.pass).toBe(true);
    }
  });

  it("includes a genuine determinism proof, not just successful resolution", () => {
    const results = runEngineProof();
    const determinismResult = results.find((r) => r.step.includes("determinism"));

    expect(determinismResult).toBeDefined();
    expect(determinismResult?.pass).toBe(true);
  });
});
