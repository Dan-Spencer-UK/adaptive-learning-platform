import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  createRng,
  createRngForDomain,
  createRngFromIdentity,
  deriveSeed,
  fnv1a32,
  nextInt,
  pick,
  pickDistinctIndices,
  shuffleDeterministic,
  type DeterministicIdentity,
} from "./seed.ts";

const IDENTITY: DeterministicIdentity = {
  blueprintId: "ohms_law.solve_for_voltage",
  blueprintVersion: 1,
  contentRelease: "2026.08.001",
  seed: 12345,
};

describe("fnv1a32 / deriveSeed", () => {
  it("is a pure function of its input string", () => {
    expect(fnv1a32("hello")).toBe(fnv1a32("hello"));
  });

  it("produces different hashes for different strings", () => {
    expect(fnv1a32("hello")).not.toBe(fnv1a32("hellp"));
  });

  it("deriveSeed depends on every field of the identity tuple", () => {
    const base = deriveSeed(IDENTITY);
    expect(deriveSeed({ ...IDENTITY, blueprintId: "ohms_law.solve_for_current" })).not.toBe(base);
    expect(deriveSeed({ ...IDENTITY, blueprintVersion: 2 })).not.toBe(base);
    expect(deriveSeed({ ...IDENTITY, contentRelease: "2026.09.001" })).not.toBe(base);
    expect(deriveSeed({ ...IDENTITY, seed: 12346 })).not.toBe(base);
  });

  it("two different blueprints given the SAME raw seed number do not derive the same internal seed", () => {
    const a = deriveSeed({ ...IDENTITY, blueprintId: "ohms_law.solve_for_voltage" });
    const b = deriveSeed({ ...IDENTITY, blueprintId: "parallel.calculate_total" });
    expect(a).not.toBe(b);
  });
});

describe("createRng (mulberry32)", () => {
  it("same seed produces the exact same sequence", () => {
    const a = createRng(42);
    const b = createRng(42);
    const seqA = Array.from({ length: 20 }, () => a());
    const seqB = Array.from({ length: 20 }, () => b());
    expect(seqA).toEqual(seqB);
  });

  it("different seeds produce different sequences", () => {
    const a = createRng(1);
    const b = createRng(2);
    const seqA = Array.from({ length: 10 }, () => a());
    const seqB = Array.from({ length: 10 }, () => b());
    expect(seqA).not.toEqual(seqB);
  });

  it("always yields values in [0, 1)", () => {
    const rng = createRng(999);
    for (let i = 0; i < 1000; i++) {
      const value = rng();
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThan(1);
    }
  });

  it("createRngFromIdentity is deterministic end-to-end for a full identity tuple", () => {
    const seqA = Array.from({ length: 10 }, createRngFromIdentity(IDENTITY));
    const seqB = Array.from({ length: 10 }, createRngFromIdentity(IDENTITY));
    expect(seqA).toEqual(seqB);
  });
});

describe("nextInt", () => {
  it("is always within [min, max] inclusive", () => {
    const rng = createRng(7);
    for (let i = 0; i < 500; i++) {
      const value = nextInt(rng, 5, 10);
      expect(value).toBeGreaterThanOrEqual(5);
      expect(value).toBeLessThanOrEqual(10);
    }
  });

  it("handles a single-value range", () => {
    const rng = createRng(7);
    expect(nextInt(rng, 5, 5)).toBe(5);
  });

  it("throws when max < min", () => {
    const rng = createRng(7);
    expect(() => nextInt(rng, 10, 5)).toThrow(RangeError);
  });
});

describe("pick", () => {
  it("always returns a member of the input array", () => {
    const rng = createRng(3);
    const options = ["a", "b", "c"] as const;
    for (let i = 0; i < 50; i++) {
      expect(options).toContain(pick(rng, options));
    }
  });

  it("throws on an empty array", () => {
    const rng = createRng(3);
    expect(() => pick(rng, [])).toThrow(RangeError);
  });
});

describe("pickDistinctIndices", () => {
  it("returns the requested count of distinct, in-range, ascending indices", () => {
    const rng = createRng(11);
    const indices = pickDistinctIndices(rng, 10, 4);
    expect(indices).toHaveLength(4);
    expect(new Set(indices).size).toBe(4);
    for (const i of indices) {
      expect(i).toBeGreaterThanOrEqual(0);
      expect(i).toBeLessThan(10);
    }
    expect([...indices].sort((a, b) => a - b)).toEqual(indices);
  });

  it("throws when count exceeds size", () => {
    const rng = createRng(11);
    expect(() => pickDistinctIndices(rng, 3, 4)).toThrow(RangeError);
  });
});

describe("shuffleDeterministic (CC-12G answer-option randomisation)", () => {
  it("same rng state produces the exact same reordering, every time", () => {
    const items = ["a", "b", "c", "d", "e"];
    const a = shuffleDeterministic(createRng(42), items);
    const b = shuffleDeterministic(createRng(42), items);
    expect(a).toEqual(b);
  });

  it("does not mutate the input array", () => {
    const items = ["a", "b", "c", "d"];
    const copy = [...items];
    shuffleDeterministic(createRng(1), items);
    expect(items).toEqual(copy);
  });

  it("preserves the exact same set of elements, only reordered", () => {
    const items = ["a", "b", "c", "d", "e"];
    const shuffled = shuffleDeterministic(createRng(7), items);
    expect([...shuffled].sort()).toEqual([...items].sort());
  });

  it("different rng seeds produce at least one different ordering across several draws", () => {
    const items = ["a", "b", "c", "d", "e", "f"];
    const orderings = new Set(Array.from({ length: 8 }, (_, i) => shuffleDeterministic(createRng(i + 1), items).join(",")));
    expect(orderings.size).toBeGreaterThan(1);
  });

  it("a single-element (or empty) array is unaffected", () => {
    expect(shuffleDeterministic(createRng(1), ["only"])).toEqual(["only"]);
    expect(shuffleDeterministic(createRng(1), [])).toEqual([]);
  });
});

describe("createRngForDomain", () => {
  const IDENTITY_A: DeterministicIdentity = { blueprintId: "ohms_law.match_variables_units", blueprintVersion: 1, contentRelease: "release.test", seed: 1 };

  it("the same (identity, domain) pair always yields the same sequence", () => {
    const a = Array.from({ length: 10 }, createRngForDomain(IDENTITY_A, "answerOptions"));
    const b = Array.from({ length: 10 }, createRngForDomain(IDENTITY_A, "answerOptions"));
    expect(a).toEqual(b);
  });

  it("different domains against the SAME identity are independently seeded (uncorrelated sequences)", () => {
    const a = Array.from({ length: 10 }, createRngForDomain(IDENTITY_A, "answerOptions"));
    const b = Array.from({ length: 10 }, createRngForDomain(IDENTITY_A, "matchRows"));
    expect(a).not.toEqual(b);
  });

  it("a different identity (fresh generated instance) with the SAME domain can produce a different sequence", () => {
    const a = createRngForDomain(IDENTITY_A, "answerOptions");
    const b = createRngForDomain({ ...IDENTITY_A, seed: 2 }, "answerOptions");
    const seqA = Array.from({ length: 10 }, a);
    const seqB = Array.from({ length: 10 }, b);
    expect(seqA).not.toEqual(seqB);
  });
});

describe("no Math.random usage anywhere in the deterministic engine source", () => {
  function listSourceFiles(dir: string): string[] {
    const files: string[] = [];
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (entry.name === "node_modules") continue;
      const fullPath = join(dir, entry.name);
      if (entry.isDirectory()) {
        files.push(...listSourceFiles(fullPath));
      } else if (entry.name.endsWith(".ts") && !entry.name.endsWith(".test.ts")) {
        files.push(fullPath);
      }
    }
    return files;
  }

  /** Strips /* *\/ block comments and // line comments so doc comments that MENTION the forbidden APIs (to explain they are avoided) don't false-positive. */
  function stripComments(source: string): string {
    return source.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "");
  }

  it("grep-proves Math.random() / Date.now() are never CALLED in packages/calculation-engine/src (doc comments explaining the constraint are not code)", () => {
    const srcDir = join(import.meta.dirname, ".");
    const files = listSourceFiles(srcDir);
    expect(files.length).toBeGreaterThan(5);
    const offenders: string[] = [];
    for (const file of files) {
      const code = stripComments(readFileSync(file, "utf8"));
      if (/Math\.random\s*\(/.test(code) || /Date\.now\s*\(/.test(code)) {
        offenders.push(file);
      }
    }
    expect(offenders).toEqual([]);
  });
});
