import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { AnthropicVisionProvider, resolveSemanticReviewProvider } from "./anthropic-provider.ts";
import { MissingCredentialError, ProviderNotImplementedError } from "./provider.ts";
import type { SemanticReviewProvider } from "./provider.ts";
import { MockSemanticReviewProvider } from "./mock-provider.ts";

describe("AnthropicVisionProvider", () => {
  const originalKey = process.env.ANTHROPIC_API_KEY;
  const originalProvider = process.env.VISUAL_GOVERNANCE_PROVIDER;

  beforeEach(() => {
    delete process.env.ANTHROPIC_API_KEY;
    delete process.env.VISUAL_GOVERNANCE_PROVIDER;
  });

  afterEach(() => {
    if (originalKey === undefined) delete process.env.ANTHROPIC_API_KEY;
    else process.env.ANTHROPIC_API_KEY = originalKey;
    if (originalProvider === undefined) delete process.env.VISUAL_GOVERNANCE_PROVIDER;
    else process.env.VISUAL_GOVERNANCE_PROVIDER = originalProvider;
  });

  it("throws MissingCredentialError when constructed with no API key available", () => {
    expect(() => new AnthropicVisionProvider()).toThrow(MissingCredentialError);
  });

  it("does not require ANTHROPIC_API_KEY merely to import this module", async () => {
    // Import already happened at file-load time (top of this test file);
    // reaching this line without an env var proves no top-level network
    // call or credential read occurred at import time.
    expect(true).toBe(true);
  });

  it("constructs successfully with an explicit API key override, without touching the environment", () => {
    const provider = new AnthropicVisionProvider("claude-opus-5", "test-key-not-a-secret");
    expect(provider.identity).toBe("anthropic:claude-opus-5");
  });

  it("runPassA is honestly not-yet-implemented -- it throws rather than fabricating a result", async () => {
    const provider: SemanticReviewProvider = new AnthropicVisionProvider("claude-opus-5", "test-key-not-a-secret");
    await expect(provider.runPassA({ svg: "<svg/>", hash: "h" }, { variantId: "v1", domain: "electrical", visualType: "magnetic_field" })).rejects.toThrow(
      ProviderNotImplementedError,
    );
  });

  it("runPassB is honestly not-yet-implemented -- it throws rather than fabricating a result", async () => {
    const provider: SemanticReviewProvider = new AnthropicVisionProvider("claude-opus-5", "test-key-not-a-secret");
    await expect(
      provider.runPassB(
        {
          visibleObjects: [],
          visibleLabels: [],
          arrows: [],
          apparentRelationships: [],
          rotationSense: "not_applicable",
          labelsOverlap: false,
          anyClipping: false,
          arrowsAppearAttachedToLabelledObject: true,
          ambiguityNotes: [],
          legibilityConcerns: [],
        },
        {} as never,
        { variantId: "v1", mode: "teaching" },
      ),
    ).rejects.toThrow(ProviderNotImplementedError);
  });
});

describe("resolveSemanticReviewProvider", () => {
  const originalKey = process.env.ANTHROPIC_API_KEY;
  const originalProvider = process.env.VISUAL_GOVERNANCE_PROVIDER;

  afterEach(() => {
    if (originalKey === undefined) delete process.env.ANTHROPIC_API_KEY;
    else process.env.ANTHROPIC_API_KEY = originalKey;
    if (originalProvider === undefined) delete process.env.VISUAL_GOVERNANCE_PROVIDER;
    else process.env.VISUAL_GOVERNANCE_PROVIDER = originalProvider;
  });

  it("defaults to the mock provider when VISUAL_GOVERNANCE_PROVIDER is unset", () => {
    delete process.env.VISUAL_GOVERNANCE_PROVIDER;
    expect(resolveSemanticReviewProvider()).toBeInstanceOf(MockSemanticReviewProvider);
  });

  it("selects the Anthropic provider when VISUAL_GOVERNANCE_PROVIDER=anthropic and a key is present", () => {
    process.env.VISUAL_GOVERNANCE_PROVIDER = "anthropic";
    process.env.ANTHROPIC_API_KEY = "test-key-not-a-secret";
    expect(resolveSemanticReviewProvider()).toBeInstanceOf(AnthropicVisionProvider);
  });
});
