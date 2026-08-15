/**
 * Tier 2 (native/Hermes-integration-flavoured) test: runs under jest-expo,
 * which uses the same Babel/module-resolution pipeline as a real Expo
 * build (unlike the root Vitest suite, which never touches RN-specific
 * tooling at all). This does NOT prove on-device Hermes execution (no
 * emulator/device is available in this environment) -- see
 * docs/architecture/evidence/CC-04N-MOBILE-FOUNDATION-EVIDENCE.md for the
 * exact evidentiary tier this test provides versus what remains PENDING
 * real-device/emulator verification.
 */
import { runSharedPackageProof } from "./shared-packages";

describe("runSharedPackageProof", () => {
  it("resolves and executes every shared package's real exports under the RN/Jest pipeline", () => {
    const results = runSharedPackageProof();

    expect(results.length).toBeGreaterThanOrEqual(7);
    for (const result of results) {
      expect(result.pass).toBe(true);
    }
  });

  it("includes a genuine Zod-backed validation result, not just constant resolution", () => {
    const results = runSharedPackageProof();
    const zodResult = results.find((r) => r.package.includes("packageManifestSchema"));

    expect(zodResult).toBeDefined();
    expect(zodResult?.pass).toBe(true);
  });
});
