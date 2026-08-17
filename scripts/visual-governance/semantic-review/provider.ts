/**
 * CC-05D: provider boundary for two-pass semantic visual review. The
 * core platform never couples to one vendor -- see docs/architecture/
 * CC-05D-INSTRUCTIONAL-VISUAL-GOVERNANCE-AND-SEMANTIC-QA.md §F/§N.
 * Implementations: ./mock-provider.ts (deterministic, no network, used
 * by every automated test and available for full-pipeline dry runs) and
 * ./anthropic-provider.ts (real-SDK-shaped scaffold; see its own header
 * for exactly what remains before it can make a live call).
 */

import type { BlindObservation, SemanticVerification, VisualSemanticContract, VisualMode } from "@alp/content-schema";

export interface ImageArtifact {
  readonly svg: string;
  readonly hash: string;
}

export interface PassAContext {
  readonly variantId: string;
  readonly domain: string;
  readonly visualType: string;
}

export interface PassBContext {
  readonly variantId: string;
  readonly mode: VisualMode;
}

/** Pass B's output minus the bookkeeping fields the orchestrator (not the provider) is responsible for filling in. */
export type PassBVerificationDraft = Omit<
  SemanticVerification,
  "reviewerIdentity" | "promptVersion" | "schemaVersion" | "timestamp" | "imageHash" | "contractHash"
>;

export interface SemanticReviewProvider {
  readonly identity: string;
  runPassA(image: ImageArtifact, context: PassAContext): Promise<BlindObservation>;
  runPassB(observation: BlindObservation, contract: VisualSemanticContract, context: PassBContext): Promise<PassBVerificationDraft>;
}

export class ProviderNotImplementedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ProviderNotImplementedError";
  }
}

export class MissingCredentialError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "MissingCredentialError";
  }
}
