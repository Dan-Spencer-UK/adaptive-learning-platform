import { describe, expect, it } from "vitest";
import { canonicalJson, composePromptVersion, computeContractHash, computeImageHash, isStale, sha256Hex } from "./audit-cache.ts";
import { visualSemanticContracts } from "./data/cc05d-visual-contracts-unit202.ts";
import type { SemanticVerification } from "@alp/content-schema";

describe("sha256Hex / canonicalJson", () => {
  it("produces a 64-character lowercase hex digest", () => {
    const hash = sha256Hex("hello");
    expect(hash).toMatch(/^[0-9a-f]{64}$/);
  });

  it("is order-independent for object key order (canonicalJson)", () => {
    const a = canonicalJson({ b: 1, a: 2 });
    const b = canonicalJson({ a: 2, b: 1 });
    expect(a).toBe(b);
  });

  it("differs for genuinely different content", () => {
    expect(sha256Hex("a")).not.toBe(sha256Hex("b"));
  });
});

describe("computeContractHash", () => {
  it("is deterministic for the same contract", () => {
    const contract = visualSemanticContracts[0]!;
    expect(computeContractHash(contract)).toBe(computeContractHash(contract));
  });

  it("differs when the contract's meaning changes (e.g. mustShow list edited)", () => {
    const contract = visualSemanticContracts[0]!;
    const changed = { ...contract, mustShow: [...contract.mustShow, "an extra required element"] };
    expect(computeContractHash(contract)).not.toBe(computeContractHash(changed));
  });

  it("is stable across every governed contract having a unique hash (no accidental collision)", () => {
    const hashes = visualSemanticContracts.map(computeContractHash);
    expect(new Set(hashes).size).toBe(hashes.length);
  });
});

describe("computeImageHash", () => {
  it("differs for different SVG content and matches for identical content", () => {
    expect(computeImageHash("<svg>A</svg>")).not.toBe(computeImageHash("<svg>B</svg>"));
    expect(computeImageHash("<svg>A</svg>")).toBe(computeImageHash("<svg>A</svg>"));
  });
});

describe("composePromptVersion", () => {
  it("combines both pass versions into one string", () => {
    expect(composePromptVersion("pass-a.v1", "pass-b.v1")).toBe("pass-a.v1+pass-b.v1");
  });
});

describe("isStale", () => {
  function verification(overrides: Partial<SemanticVerification> = {}): SemanticVerification {
    return {
      status: "pass",
      confidence: "high",
      issues: [],
      possibleLearnerMisunderstanding: false,
      answerLeakage: false,
      requiresHumanReview: false,
      reviewerIdentity: "mock-provider-v1",
      promptVersion: "pass-a.v1+pass-b.v1",
      schemaVersion: "semantic-verification.v1",
      timestamp: "2026-08-17T00:00:00.000Z",
      imageHash: "a".repeat(64),
      contractHash: "b".repeat(64),
      ...overrides,
    };
  }

  const currentIdentity = {
    imageHash: "a".repeat(64),
    contractHash: "b".repeat(64),
    promptVersion: "pass-a.v1+pass-b.v1",
    schemaVersion: "semantic-verification.v1",
    reviewerIdentity: "mock-provider-v1",
  };

  it("is not stale when every identity input matches exactly", () => {
    expect(isStale(verification(), currentIdentity)).toBe(false);
  });

  it("is stale when the image hash changed (the rendered artefact changed)", () => {
    expect(isStale(verification({ imageHash: "c".repeat(64) }), currentIdentity)).toBe(true);
  });

  it("is stale when the contract hash changed (the governed contract changed meaning)", () => {
    expect(isStale(verification({ contractHash: "c".repeat(64) }), currentIdentity)).toBe(true);
  });

  it("is stale when the prompt version changed (the audit prompt was edited)", () => {
    expect(isStale(verification({ promptVersion: "pass-a.v2+pass-b.v1" }), currentIdentity)).toBe(true);
  });

  it("is stale when the reviewer/provider identity changed", () => {
    expect(isStale(verification({ reviewerIdentity: "anthropic:claude-opus-5" }), currentIdentity)).toBe(true);
  });

  it("never treats a cached result for one image hash as evidence for a different image hash", () => {
    const cachedForOldImage = verification({ imageHash: "old-image-hash".padEnd(64, "0") });
    const newImageIdentity = { ...currentIdentity, imageHash: "new-image-hash".padEnd(64, "0") };
    expect(isStale(cachedForOldImage, newImageIdentity)).toBe(true);
  });
});
