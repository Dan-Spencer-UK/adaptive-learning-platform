import { describe, expect, it } from "vitest";
import type { QuestionBlueprint } from "@alp/content-schema";
import {
  MissingPresentationError,
  renderPresentationLine,
  resolveAnswerOptions,
  resolvePromptLines,
  resolveShownWorkingLines,
} from "./presentation.ts";
import type { GeneratedQuestionInstance } from "./types.ts";

function blueprint(overrides: Partial<QuestionBlueprint> = {}): QuestionBlueprint {
  return {
    id: "qb.test",
    assertionFamilyId: "fam.test",
    capabilityId: "cap.test",
    title: "Test",
    representation: {},
    variantDimensions: {},
    parameterGenerators: [],
    answer: { type: "multiple_choice", options: ["a", "b"] },
    marking: { type: "exact" },
    difficultyBand: "introductory",
    evidence: {
      primaryCapabilityId: "cap.test",
      familyId: "fam.test",
      assertionIdentifiers: ["A-1"],
      supportingCapabilityIds: [],
      representationDependency: [],
      misconceptionTargets: [],
    },
    presentation: { promptLines: ["V = {V} V", "R = {R} Ω"], shownWorkingLines: ["I = V x R = {shown_I} A"], answerOptionLabels: { a: "Option A", b: "Option B" } },
    ...overrides,
  };
}

function instance(parameters: Record<string, number | string>): GeneratedQuestionInstance {
  return {
    identity: { blueprintId: "qb.test", blueprintVersion: 1, contentRelease: "release.test", seed: 1 },
    assertionFamilyId: "fam.test",
    capabilityId: "cap.test",
    title: "Test",
    parameters,
    representation: {},
    expected: { answer: { type: "multiple_choice", options: ["a", "b"] }, value: "a" },
    marking: { type: "exact" },
    evidence: blueprint().evidence,
  };
}

describe("renderPresentationLine", () => {
  it("substitutes {param} placeholders deterministically", () => {
    expect(renderPresentationLine("V = {V} V", { V: 24 })).toBe("V = 24 V");
    expect(renderPresentationLine("V = {V} V", { V: 24 })).toBe("V = 24 V");
  });

  it("substitutes multiple and repeated placeholders", () => {
    expect(renderPresentationLine("{a} + {a} = {b}", { a: 1, b: 2 })).toBe("1 + 1 = 2");
  });

  it("fails loudly on a placeholder the instance does not carry -- never renders '{x}' silently", () => {
    expect(() => renderPresentationLine("V = {missing} V", { V: 24 })).toThrow(/missing/);
  });
});

describe("resolvePromptLines / resolveShownWorkingLines", () => {
  it("renders the blueprint's governed prompt lines with instance parameters", () => {
    expect(resolvePromptLines(blueprint(), instance({ V: 12, R: 3, shown_I: 36 }))).toEqual(["V = 12 V", "R = 3 Ω"]);
  });

  it("renders governed shown-working lines", () => {
    expect(resolveShownWorkingLines(blueprint(), instance({ V: 12, R: 3, shown_I: 36 }))).toEqual(["I = V x R = 36 A"]);
  });

  it("throws MissingPresentationError for a blueprint with no governed presentation", () => {
    const bare = blueprint({ presentation: undefined });
    expect(() => resolvePromptLines(bare, instance({}))).toThrow(MissingPresentationError);
  });
});

describe("resolveAnswerOptions", () => {
  it("returns governed option values labelled by the governed presentation, in governed order", () => {
    expect(resolveAnswerOptions(blueprint())).toEqual([
      { value: "a", label: "Option A" },
      { value: "b", label: "Option B" },
    ]);
  });

  it("throws when an option has no governed label", () => {
    const missing = blueprint({ presentation: { promptLines: ["x"], answerOptionLabels: { a: "Option A" } } });
    expect(() => resolveAnswerOptions(missing)).toThrow(/no learner-facing label/);
  });

  it("throws when the blueprint declares no answer options at all", () => {
    const noOptions = blueprint({ answer: { type: "quantity", quantity: "voltage", canonicalUnit: "volt" } });
    expect(() => resolveAnswerOptions(noOptions)).toThrow(/no governed answer.options/);
  });
});

describe("determinism", () => {
  it("same blueprint + same instance parameters always render identical lines", () => {
    const a = resolvePromptLines(blueprint(), instance({ V: 7, R: 2, shown_I: 14 }));
    const b = resolvePromptLines(blueprint(), instance({ V: 7, R: 2, shown_I: 14 }));
    expect(a).toEqual(b);
  });
});
