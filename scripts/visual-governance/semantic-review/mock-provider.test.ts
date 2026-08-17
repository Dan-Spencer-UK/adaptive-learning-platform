import { describe, expect, it } from "vitest";
import { blindObservationSchema } from "@alp/content-schema";
import { MockSemanticReviewProvider, MOCK_PROVIDER_IDENTITY, isSimulatedReviewerIdentity } from "./mock-provider.ts";
import type { PassAContext, PassBContext } from "./provider.ts";

const passAContext: PassAContext = { variantId: "v1", domain: "electrical", visualType: "magnetic_field" };
const passBContext: PassBContext = { variantId: "v1", mode: "teaching" };

describe("MockSemanticReviewProvider", () => {
  it("has an identity that is mechanically distinguishable from a real provider", () => {
    expect(new MockSemanticReviewProvider().identity).toBe(MOCK_PROVIDER_IDENTITY);
  });

  it("returns a schema-valid default observation for an unconfigured variant", async () => {
    const provider = new MockSemanticReviewProvider();
    const observation = await provider.runPassA({ svg: "<svg/>", hash: "h" }, passAContext);
    expect(blindObservationSchema.safeParse(observation).success).toBe(true);
    expect(observation.labelsOverlap).toBe(false);
  });

  it("returns a default pass/high-confidence/no-issues verification for an unconfigured variant", async () => {
    const provider = new MockSemanticReviewProvider();
    const verification = await provider.runPassB(
      { ...(await provider.runPassA({ svg: "<svg/>", hash: "h" }, passAContext)) },
      {} as never,
      passBContext,
    );
    expect(verification.status).toBe("pass");
    expect(verification.confidence).toBe("high");
    expect(verification.issues).toEqual([]);
  });

  it("returns a configured fixture observation/verification for a scripted variant id", async () => {
    const provider = new MockSemanticReviewProvider({
      v1: {
        observation: { labelsOverlap: true, legibilityConcerns: ["Field label overlaps thumb caption"] },
        verification: {
          status: "fail",
          confidence: "high",
          requiresHumanReview: true,
          issues: [
            {
              code: "label_collision",
              severity: "medium",
              expected: "labels do not overlap",
              observed: "Field label overlaps the thumb caption",
              explanation: "scripted fixture for testing",
            },
          ],
        },
      },
    });

    const observation = await provider.runPassA({ svg: "<svg/>", hash: "h" }, passAContext);
    expect(observation.labelsOverlap).toBe(true);

    const verification = await provider.runPassB(observation, {} as never, passBContext);
    expect(verification.status).toBe("fail");
    expect(verification.requiresHumanReview).toBe(true);
    expect(verification.issues).toHaveLength(1);
  });

  it("is deterministic -- repeated calls for the same variant produce identical output", async () => {
    const provider = new MockSemanticReviewProvider();
    const a = await provider.runPassA({ svg: "<svg/>", hash: "h" }, passAContext);
    const b = await provider.runPassA({ svg: "<svg/>", hash: "h" }, passAContext);
    expect(a).toEqual(b);
  });
});

describe("isSimulatedReviewerIdentity", () => {
  it("is true for the mock provider's own identity", () => {
    expect(isSimulatedReviewerIdentity(MOCK_PROVIDER_IDENTITY)).toBe(true);
  });

  it("is true for any identity starting with 'mock' (future mock/fixture providers caught without a code change)", () => {
    expect(isSimulatedReviewerIdentity("mock-provider-v2")).toBe(true);
    expect(isSimulatedReviewerIdentity("mock-fixture-devtest")).toBe(true);
  });

  it("is false for a real provider identity", () => {
    expect(isSimulatedReviewerIdentity("anthropic:claude-opus-5")).toBe(false);
  });

  it("is false for a human/manual reviewer identity", () => {
    expect(isSimulatedReviewerIdentity("claude-code-manual")).toBe(false);
  });
});
