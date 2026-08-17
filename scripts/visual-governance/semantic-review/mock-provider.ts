/**
 * CC-05D: deterministic, no-network semantic-review provider. This is
 * the provider every automated test uses, and the provider a developer
 * without an ANTHROPIC_API_KEY uses to exercise the full audit pipeline
 * end-to-end. Its results are never presented as a real AI review --
 * `identity` is always exactly "mock-provider-v1", making it
 * mechanically distinguishable from a live-provider or manual-review
 * identity anywhere it appears in evidence output.
 */

import type { BlindObservation, VisualSemanticContract } from "@alp/content-schema";
import type { ImageArtifact, PassAContext, PassBContext, PassBVerificationDraft, SemanticReviewProvider } from "./provider.ts";

export const MOCK_PROVIDER_IDENTITY = "mock-provider-v1";

/**
 * True for any reviewer identity produced by a simulated/mock provider
 * (currently only `MOCK_PROVIDER_IDENTITY`, matched by prefix so a
 * future second mock/fixture provider is also caught without a code
 * change here). This is the single source of truth
 * report/evidence-generation code uses to decide whether a semantic
 * result must be presented as "SIMULATED SEMANTIC" rather than "REAL AI
 * REVIEW" -- see docs/architecture/CC-05D-INSTRUCTIONAL-VISUAL-
 * GOVERNANCE-AND-SEMANTIC-QA.md's truthfulness-correction addendum. Never
 * infer this from a UI label; always recompute from the recorded
 * `reviewerIdentity` string.
 */
export function isSimulatedReviewerIdentity(reviewerIdentity: string): boolean {
  return reviewerIdentity.startsWith("mock");
}

export interface MockFixture {
  readonly observation?: Partial<BlindObservation>;
  readonly verification?: Partial<PassBVerificationDraft>;
}

const DEFAULT_OBSERVATION: BlindObservation = {
  visibleObjects: ["diagram element"],
  visibleLabels: [],
  arrows: [],
  apparentRelationships: [],
  rotationSense: "not_applicable",
  labelsOverlap: false,
  anyClipping: false,
  arrowsAppearAttachedToLabelledObject: true,
  ambiguityNotes: [],
  legibilityConcerns: [],
};

const DEFAULT_VERIFICATION: PassBVerificationDraft = {
  status: "pass",
  confidence: "high",
  issues: [],
  possibleLearnerMisunderstanding: false,
  answerLeakage: false,
  requiresHumanReview: false,
};

/**
 * `fixtures` is keyed by `variantId` so tests can script specific
 * outcomes (e.g. "this variant should come back FAIL with a
 * label_collision issue") without needing to know the SVG's hash.
 * Anything not present in `fixtures` gets the honest, unremarkable
 * default: a clean pass, high confidence, no issues -- so a full
 * pipeline dry run against real contracts produces plausible-looking
 * but clearly mock-labelled evidence rather than crashing.
 */
export class MockSemanticReviewProvider implements SemanticReviewProvider {
  readonly identity = MOCK_PROVIDER_IDENTITY;
  private readonly fixtures: Record<string, MockFixture>;

  constructor(fixtures: Record<string, MockFixture> = {}) {
    this.fixtures = fixtures;
  }

  async runPassA(_image: ImageArtifact, context: PassAContext): Promise<BlindObservation> {
    const override = this.fixtures[context.variantId]?.observation;
    return { ...DEFAULT_OBSERVATION, ...override };
  }

  async runPassB(
    _observation: BlindObservation,
    _contract: VisualSemanticContract,
    context: PassBContext,
  ): Promise<PassBVerificationDraft> {
    const override = this.fixtures[context.variantId]?.verification;
    return { ...DEFAULT_VERIFICATION, ...override };
  }
}
