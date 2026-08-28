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

function instance(parameters: Record<string, number | string>, identityOverrides: Partial<GeneratedQuestionInstance["identity"]> = {}): GeneratedQuestionInstance {
  return {
    identity: { blueprintId: "qb.test", blueprintVersion: 1, contentRelease: "release.test", seed: 1, ...identityOverrides },
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

  // CC-12G: deterministic per-instance display-order randomisation.
  describe("with an instance -- deterministic shuffle", () => {
    const bp = blueprint({ answer: { type: "multiple_choice", options: ["a", "b", "c", "d", "e"] } });
    const presentedBp = blueprint({
      answer: { type: "multiple_choice", options: ["a", "b", "c", "d", "e"] },
      presentation: { promptLines: ["x"], answerOptionLabels: { a: "Option A", b: "Option B", c: "Option C", d: "Option D", e: "Option E" } },
    });

    // A. Stable within instance: same generated instance -> same order,
    // across independent calls (re-render/resume never reshuffles).
    it("A: the same instance always resolves the same option order", () => {
      const inst = instance({});
      const first = resolveAnswerOptions(presentedBp, inst);
      const second = resolveAnswerOptions(presentedBp, inst);
      expect(second).toEqual(first);
    });

    // B. Variable across instances: independently generated instances
    // are not pinned to one fixed order.
    it("B: independently generated instances produce more than one observed ordering", () => {
      const orderings = new Set(
        Array.from({ length: 6 }, (_, i) =>
          resolveAnswerOptions(presentedBp, instance({}, { seed: i + 1 }))
            .map((o) => o.value)
            .join(","),
        ),
      );
      expect(orderings.size).toBeGreaterThan(1);
    });

    // C. Correctness independent of position: the full set of option
    // values (what marking/evaluation actually compares against) is
    // unchanged by shuffling -- only display order moves.
    it("C: the resolved value set is unchanged by shuffling, only its order", () => {
      const shuffled = resolveAnswerOptions(presentedBp, instance({}));
      expect([...shuffled.map((o) => o.value)].sort()).toEqual([...bp.answer.options!].sort());
    });

    // D. Diagnostics remain valid: each option's value keeps its own
    // governed label regardless of where it lands -- a value-to-label
    // (and, in the real dispatch, value-to-evidence) mapping is never
    // built from array position.
    it("D: every option's label stays correctly paired with its own value regardless of order", () => {
      const shuffled = resolveAnswerOptions(presentedBp, instance({}));
      for (const option of shuffled) {
        expect(option.label).toBe(presentedBp.presentation!.answerOptionLabels![option.value]);
      }
    });

    it("omitting instance returns the governed authored order, unshuffled", () => {
      expect(resolveAnswerOptions(presentedBp)).toEqual([
        { value: "a", label: "Option A" },
        { value: "b", label: "Option B" },
        { value: "c", label: "Option C" },
        { value: "d", label: "Option D" },
        { value: "e", label: "Option E" },
      ]);
    });
  });
});

describe("determinism", () => {
  it("same blueprint + same instance parameters always render identical lines", () => {
    const a = resolvePromptLines(blueprint(), instance({ V: 7, R: 2, shown_I: 14 }));
    const b = resolvePromptLines(blueprint(), instance({ V: 7, R: 2, shown_I: 14 }));
    expect(a).toEqual(b);
  });
});
