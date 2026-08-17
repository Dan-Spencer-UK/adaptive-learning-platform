/**
 * CC-05D: real-provider scaffold for Anthropic/Claude vision semantic
 * review. Structurally complete (credential handling, identity,
 * interface conformance) but its two review methods are NOT yet wired
 * to a live API call -- see the "why" below and the CC-05D evidence
 * document's "Deferred items" section for exactly what remains.
 *
 * WHY THIS IS A STUB, NOT A LIVE INTEGRATION:
 * Anthropic's Messages API image content blocks accept raster formats
 * only (image/png, image/jpeg, image/gif, image/webp) -- not SVG. This
 * package's deterministic render-capture pipeline
 * (apps/mobile/src/lib/visual-governance/render-tree-to-svg.ts) produces
 * real, computed SVG artefacts (see the architecture doc §D for exactly
 * what that proves), not raster images. Rasterising SVG to PNG requires
 * either a native-binary-backed library (e.g. `sharp`, `resvg`) or a
 * headless browser (e.g. Puppeteer) -- both are non-trivial new
 * dependencies with their own security-audit-gate and build-environment
 * implications (see docs/security/SECURITY-BASELINE.md's supply-chain
 * rule). Adding one speculatively, in the same pass that could not
 * exercise it (no ANTHROPIC_API_KEY was available in this implementation
 * environment either), would be exactly the kind of unproportionate
 * change the task brief's "keep implementation proportionate" guidance
 * (§31) warns against. This file is written so that wiring a real call
 * is a small, contained follow-up: implement `rasteriseSvgToPng` below
 * using whichever library is chosen, then complete the two `throw`
 * bodies with the real `@anthropic-ai/sdk` call described in the
 * comments beside them.
 *
 * Per task-brief §15: no API key is embedded, no key is required for
 * normal unit tests (this class's constructor is the only code path that
 * reads `ANTHROPIC_API_KEY`, and only when actually constructed), and no
 * network call happens at import time or from any mock-provider test.
 */

import type { BlindObservation } from "@alp/content-schema";
import { MissingCredentialError, ProviderNotImplementedError } from "./provider.ts";
import type { PassBVerificationDraft, SemanticReviewProvider } from "./provider.ts";
import { MockSemanticReviewProvider } from "./mock-provider.ts";

export const ANTHROPIC_PROVIDER_IDENTITY_PREFIX = "anthropic:";
export const DEFAULT_ANTHROPIC_MODEL = "claude-opus-5";

export class AnthropicVisionProvider implements SemanticReviewProvider {
  readonly identity: string;

  /**
   * Validates the credential exists (fail fast, clear error) but does not
   * yet retain it -- nothing in this class reads it, since runPassA/
   * runPassB are not yet wired to a real call (see this file's header).
   * When that wiring lands, store it as a private field here and pass it
   * to the real SDK client constructed inside runPassA/runPassB.
   */
  constructor(modelId: string = DEFAULT_ANTHROPIC_MODEL, apiKeyOverride?: string) {
    const apiKey = apiKeyOverride ?? process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new MissingCredentialError(
        "AnthropicVisionProvider requires ANTHROPIC_API_KEY to be set in the environment. It is never read at import time, only when this class is actually constructed, so it never affects normal unit tests (which use MockSemanticReviewProvider).",
      );
    }
    this.identity = `${ANTHROPIC_PROVIDER_IDENTITY_PREFIX}${modelId}`;
  }

  /**
   * Real implementation, once wired:
   *   1. const png = await rasteriseSvgToPng(image.svg);
   *   2. const client = new Anthropic({ apiKey });
   *   3. const response = await client.messages.create({
   *        model: this.identity.slice(ANTHROPIC_PROVIDER_IDENTITY_PREFIX.length),
   *        messages: [{ role: "user", content: [
   *          { type: "image", source: { type: "base64", media_type: "image/png", data: png.toString("base64") } },
   *          { type: "text", text: buildPassAPrompt({ domain: context.domain, visualType: context.visualType }) },
   *        ] }],
   *      });
   *   4. return blindObservationSchema.parse(JSON.parse(extractJson(response)));
   */
  async runPassA(): Promise<BlindObservation> {
    throw new ProviderNotImplementedError(
      "AnthropicVisionProvider.runPassA is not yet wired to a live call -- see this file's header comment for exactly what remains (SVG->PNG rasterisation + @anthropic-ai/sdk call).",
    );
  }

  async runPassB(): Promise<PassBVerificationDraft> {
    throw new ProviderNotImplementedError(
      "AnthropicVisionProvider.runPassB is not yet wired to a live call -- see this file's header comment for exactly what remains.",
    );
  }
}

/**
 * Resolves which provider `run-semantic-audit.ts` should use. Defaults
 * to the mock provider (no network, no credential, safe for CI/local
 * dry runs); set VISUAL_GOVERNANCE_PROVIDER=anthropic and
 * ANTHROPIC_API_KEY to opt into the live path -- constructing
 * AnthropicVisionProvider succeeds (the credential exists), but its
 * review methods currently throw ProviderNotImplementedError until a
 * future pass wires SVG rasterisation, per this file's header.
 */
export function resolveSemanticReviewProvider(): SemanticReviewProvider {
  if (process.env.VISUAL_GOVERNANCE_PROVIDER === "anthropic") {
    return new AnthropicVisionProvider();
  }
  return new MockSemanticReviewProvider();
}
