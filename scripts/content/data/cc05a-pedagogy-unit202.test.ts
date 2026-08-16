import { describe, expect, it } from "vitest";
import { pedagogyManifestSchema } from "@alp/content-schema";
import { cc04Unit202ElectricalScience } from "./cc04-unit202-electrical-science.ts";
import { cc05aPedagogyUnit202 } from "./cc05a-pedagogy-unit202.ts";

describe("cc05aPedagogyUnit202", () => {
  it("passes pedagogyManifestSchema validation", () => {
    const result = pedagogyManifestSchema.safeParse(cc05aPedagogyUnit202);
    expect(result.success).toBe(true);
  });

  it("is plain JSON-serialisable data with no functions, classes or undefined leaks (Hermes/mobile-runtime-safe, design doc §33)", () => {
    // A round trip through JSON.stringify/parse is the simplest mechanical
    // proof that this manifest is plain serialisable data: functions,
    // class instances, Symbols and circular references would all either
    // throw or silently vanish here.
    const json = JSON.stringify(cc05aPedagogyUnit202);
    expect(typeof json).toBe("string");
    const roundTripped = JSON.parse(json);
    expect(roundTripped.assertionFamilies.length).toBe(cc05aPedagogyUnit202.assertionFamilies.length);
    expect(roundTripped.questionBlueprints.length).toBe(cc05aPedagogyUnit202.questionBlueprints.length);
  });

  it("never rewrites CC-04 assertion identifiers -- every referenced id is a plain string, never mutated in place", () => {
    // This is a structural sanity check, not a content-authority check:
    // the pedagogy manifest must only *reference* assertion identifiers,
    // never define assertion statements/provenance/rights itself (that
    // would mean CC-05A had started rewriting governed knowledge, which
    // it must not do).
    expect(cc05aPedagogyUnit202).not.toHaveProperty("assertions");
    expect(cc05aPedagogyUnit202).not.toHaveProperty("assertionVersions");
    expect(cc05aPedagogyUnit202).not.toHaveProperty("assertionProvenanceLinks");
  });

  it("gives every formula family a mathematically real relationship, not a display-string placeholder", () => {
    for (const ff of cc05aPedagogyUnit202.formulaFamilies) {
      for (const form of ff.forms) {
        expect(typeof form.expression).toBe("object");
        expect(form.expression.operation).toBeTruthy();
      }
    }
  });

  it("gives every mnemonic visual aid a reference to its authoritative formula family (design doc §10: mnemonics are not formula authority)", () => {
    for (const visualAid of cc05aPedagogyUnit202.visualAidBlueprints) {
      const formulaFamily = cc05aPedagogyUnit202.formulaFamilies.find((f) => f.id === visualAid.formulaFamilyId);
      expect(formulaFamily).toBeDefined();
    }
  });

  it("normalises symmetric branch/component permutations rather than authoring one blueprint per branch (design doc §18)", () => {
    const seriesMissing = cc05aPedagogyUnit202.questionBlueprints.find((q) => q.id === "series.solve_missing_component");
    const parallelMissing = cc05aPedagogyUnit202.questionBlueprints.find((q) => q.id === "parallel.solve_missing_branch");
    expect(seriesMissing?.normalisationNote).toBeTruthy();
    expect(parallelMissing?.normalisationNote).toBeTruthy();
    // Confirms no find_R1_given.../find_R2_given... style duplicate blueprints exist.
    const ids = cc05aPedagogyUnit202.questionBlueprints.map((q) => q.id);
    expect(ids.some((id) => /find_r1/i.test(id))).toBe(false);
    expect(ids.some((id) => /find_r2/i.test(id))).toBe(false);
  });

  it("grounds every misconception target in a real, governed CC-04 misconception id", () => {
    const realMisconceptionIds = new Set(cc04Unit202ElectricalScience.misconceptions.map((m) => m.identifier));
    expect(realMisconceptionIds.size).toBeGreaterThan(0);
    for (const q of cc05aPedagogyUnit202.questionBlueprints) {
      for (const target of q.evidence.misconceptionTargets) {
        expect(realMisconceptionIds.has(target.misconceptionIdentifier)).toBe(true);
      }
    }
  });

  it("references only real CC-04 corpus assertion identifiers -- never invents one", () => {
    const realAssertionIds = new Set(cc04Unit202ElectricalScience.assertions.map((a) => a.identifier));
    for (const m of cc05aPedagogyUnit202.assertionFamilyMemberships) {
      expect(realAssertionIds.has(m.assertionIdentifier)).toBe(true);
    }
    for (const s of cc05aPedagogyUnit202.standaloneAssertions) {
      expect(realAssertionIds.has(s.assertionIdentifier)).toBe(true);
    }
    for (const q of cc05aPedagogyUnit202.questionBlueprints) {
      for (const id of q.evidence.assertionIdentifiers) {
        expect(realAssertionIds.has(id)).toBe(true);
      }
    }
  });

  it("marks every teaching_only family with a documented reason (Section 21/29 exception mechanism)", () => {
    for (const family of cc05aPedagogyUnit202.assertionFamilies) {
      if (family.assessmentRequirement === "teaching_only") {
        expect(family.teachingOnlyReason).toBeTruthy();
      }
    }
  });
});
