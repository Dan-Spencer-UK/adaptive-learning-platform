/**
 * Minimal, repeatable performance-measurement harness for the CC-04N
 * foundation. See docs/product/MOBILE-UX-ENGINEERING-STANDARD.md §9:
 * CC-04N establishes the FIRST REAL BASELINE, not invented millisecond
 * targets. Every measurement produced here must be labelled with the
 * environment it was collected on (emulator/dev-machine vs physical
 * device) -- see docs/architecture/evidence/CC-04N-MOBILE-FOUNDATION-EVIDENCE.md.
 */
import { Platform } from "react-native";

export type PerformanceEnvironment =
  | "dev-machine-metro-jest" // Jest run on the development machine; no device/emulator involved
  | "android-emulator"
  | "android-physical-device"
  | "ios-simulator"
  | "ios-physical-device";

export type PerformanceSample = {
  readonly label: string;
  readonly durationMs: number;
  readonly environment: PerformanceEnvironment;
  readonly platform: string;
  readonly collectedAt: string;
};

const samples: PerformanceSample[] = [];

/**
 * Times a synchronous or async operation and records the sample. Call
 * `getPerformanceSamples()` / `resetPerformanceSamples()` to inspect or
 * clear the in-memory log (foundation-only; not persisted or transmitted).
 */
export async function measure<T>(
  label: string,
  environment: PerformanceEnvironment,
  fn: () => T | Promise<T>,
): Promise<T> {
  const start = performance?.now() ?? Date.now();
  const result = await fn();
  const end = performance?.now() ?? Date.now();

  samples.push({
    label,
    durationMs: Math.round((end - start) * 100) / 100,
    environment,
    platform: Platform.OS,
    collectedAt: new Date().toISOString(),
  });

  return result;
}

export function getPerformanceSamples(): readonly PerformanceSample[] {
  return samples;
}

export function resetPerformanceSamples(): void {
  samples.length = 0;
}
