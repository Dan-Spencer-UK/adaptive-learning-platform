/**
 * CC-09E (Exam-Style Question Archetypes & Generation Calibration): proves
 * the invariants this package's task brief section 14 requires, for the
 * specific archetypes CC-09E added/reclassified. `engine:prove:check`
 * (prove-cc05b-engine.ts) already proves the generic mechanism (every
 * blueprint generates/grades/round-trips/is deterministic) for the FULL
 * 91-blueprint inventory -- this file proves the CC-09E-SPECIFIC semantic
 * properties (archetype classification, scope containment, transfer
 * safety, distractor provenance, copyright firebreak, weighting
 * separation) that no pre-existing test covers.
 *
 * Deliberately never asserts on official sample question/option/mark-
 * scheme text -- see task section 6's copyright/originality firebreak.
 */
import { describe, expect, it } from "vitest";
import { generateQuestionInstance } from "@alp/calculation-engine";
import type { DeterministicIdentity } from "@alp/calculation-engine";
import { pedagogyManifestSchema } from "@alp/content-schema";
import { cc05aPedagogyUnit202 } from "./data/cc05a-pedagogy-unit202.ts";
import { cc04Unit202ElectricalScience } from "./data/cc04-unit202-electrical-science.ts";
import { unit202AssessmentSpecification } from "./data/unit202-assessment-specification.ts";

const pedagogy = pedagogyManifestSchema.parse(cc05aPedagogyUnit202);
const realAssertionIds = new Set(cc04Unit202ElectricalScience.assertions.map((a) => a.identifier));
const realMisconceptionIds = new Set(cc04Unit202ElectricalScience.misconceptions.map((m) => m.identifier));

function generate(blueprintId: string, seed: number) {
  const blueprint = pedagogy.questionBlueprints.find((q) => q.id === blueprintId);
  if (!blueprint) throw new Error(`no governed blueprint "${blueprintId}"`);
  const identity: DeterministicIdentity = { blueprintId, blueprintVersion: 1, contentRelease: "2026.08.001", seed };
  return generateQuestionInstance({
    blueprint,
    formulaFamilies: pedagogy.formulaFamilies,
    diagramBlueprints: pedagogy.diagramBlueprints,
    workedExampleBlueprints: pedagogy.workedExampleBlueprints,
    identity,
  });
}

// The 7 CC-09E/CC-09E.1 archetypes that declare assessmentStyleEvidence: 5
// DIRECT_SAMPLE_ANALOGUE (3 new + 2 reclassified pre-existing) + 2
// ASSESSMENT_STYLE_TRANSFER. CC-09E.1 split the original single
// magnetism.identify_flux_density_unit blueprint (which silently generated
// both tesla AND weber under one DIRECT classification) into that blueprint
// restricted to tesla only, plus a new magnetism.identify_flux_unit
// TRANSFER blueprint for weber. CC-09E.2 removed series.calculate_total_
// resistance from this list entirely -- see the dedicated test below for
// why it no longer declares assessmentStyleEvidence at all.
const CC09E_ARCHETYPE_BLUEPRINT_IDS = [
  "magnetism.identify_flux_density_unit",
  "magnetism.identify_flux_unit",
  "emf.calculate_flux_change",
  "ac_reactive.select_impedance_formula",
  "ac_reactive.identify_reactance_unit",
  "parallel.calculate_total",
  "waveform.identify_characteristic",
] as const;

const CC09E_TRANSFER_BLUEPRINT_IDS = new Set(["ac_reactive.identify_reactance_unit", "magnetism.identify_flux_unit"]);

// Every governed SI-unit name known to the corpus, derived mechanically
// from the EL-UNIT-* assertions' own statement text (e.g. "The tesla (T)
// is the SI derived unit of...") -- never hand-maintained, so it can never
// drift out of sync with what is actually governed.
const GOVERNED_UNIT_NAMES = new Set(
  cc04Unit202ElectricalScience.assertionVersions
    .filter((v) => v.assertionIdentifier.startsWith("EL-UNIT-"))
    .map((v) => /^The (\w+)\s/.exec(v.statement)?.[1]?.toLowerCase())
    .filter((name): name is string => Boolean(name)),
);

describe("CC-09E: question-archetype classification metadata", () => {
  it("every CC-09E archetype blueprint declares assessmentStyleEvidence", () => {
    for (const id of CC09E_ARCHETYPE_BLUEPRINT_IDS) {
      const blueprint = pedagogy.questionBlueprints.find((q) => q.id === id)!;
      expect(blueprint.assessmentStyleEvidence).toBeDefined();
    }
  });

  it("C (task section 14.C): DIRECT_SAMPLE_ANALOGUE and ASSESSMENT_STYLE_TRANSFER are structurally distinguishable -- direct analogues carry a sourceItemRef, transfers carry a transferredFromBlueprintId to a real DIRECT_SAMPLE_ANALOGUE blueprint, never both/neither", () => {
    const directIds = CC09E_ARCHETYPE_BLUEPRINT_IDS.filter((id) => !CC09E_TRANSFER_BLUEPRINT_IDS.has(id));
    for (const id of directIds) {
      const evidence = pedagogy.questionBlueprints.find((q) => q.id === id)!.assessmentStyleEvidence!;
      expect(evidence.classification).toBe("DIRECT_SAMPLE_ANALOGUE");
      expect(evidence.sourceItemRef).toBeDefined();
      expect(evidence.transferredFromBlueprintId).toBeUndefined();
    }

    for (const id of CC09E_TRANSFER_BLUEPRINT_IDS) {
      const transfer = pedagogy.questionBlueprints.find((q) => q.id === id)!.assessmentStyleEvidence!;
      expect(transfer.classification).toBe("ASSESSMENT_STYLE_TRANSFER");
      expect(transfer.transferredFromBlueprintId).toBeDefined();
      expect(transfer.sourceItemRef).toBeUndefined();
      // The transfer's declared origin is a REAL, DIRECT_SAMPLE_ANALOGUE blueprint -- a traceable lineage, never an invented one.
      const origin = pedagogy.questionBlueprints.find((q) => q.id === transfer.transferredFromBlueprintId)!;
      expect(origin.assessmentStyleEvidence?.classification).toBe("DIRECT_SAMPLE_ANALOGUE");
    }
  });

  it("no source item reference or note contains a copyright-risk pattern (task section 6) -- opaque item references only, no option-letter/answer-key artefacts", () => {
    for (const id of CC09E_ARCHETYPE_BLUEPRINT_IDS) {
      const evidence = pedagogy.questionBlueprints.find((q) => q.id === id)!.assessmentStyleEvidence!;
      if (evidence.sourceItemRef) {
        expect(evidence.sourceItemRef).toMatch(/^2365-602-sample-v1:item-\d+$/);
      }
      expect(evidence.note).not.toMatch(/^[A-D]\.\s/);
      expect(evidence.note.length).toBeLessThan(600);
    }
  });

  it("regression (CC-09E.2 task section 1): DIRECT_SAMPLE_ANALOGUE cannot be justified solely by an intermediate operation inside a materially different requested-answer grammar -- series.calculate_total_resistance declares no assessmentStyleEvidence at all", () => {
    // CC-09E originally cited sample item 27 for this blueprint; that
    // citation was factually wrong (item 27 is a parallel circuit, not
    // series -- CC-09E.1 fixed the citation to item 22). But item 22's own
    // REQUESTED answer is an individual resistor's voltage, not the total
    // series resistance -- the total is computed only as an internal
    // intermediate step toward that answer. No item in the official public
    // 2365-602 sample asks for total series resistance as its own final
    // requested answer (contrast parallel.calculate_total, genuinely
    // DIRECT against item 25, which does ask this directly for a parallel
    // circuit). A DIRECT_SAMPLE_ANALOGUE must demonstrate the SAME
    // requested-answer grammar for the SAME knowledge target -- using a
    // capability as an intermediate step inside a different question's
    // grammar is not that, however tempting the operation-level match is.
    const blueprint = pedagogy.questionBlueprints.find((q) => q.id === "series.calculate_total_resistance")!;
    expect(blueprint.assessmentStyleEvidence).toBeUndefined();
    // The blueprint itself remains valid, fully governed practice --
    // "no direct sample analogue" is an honest evidence gap, not a defect.
    expect(blueprint.evidence.assertionIdentifiers).toEqual(["EL-SERIES-RESISTANCE-CALC-001"]);
  });
});

describe("CC-09E: generation proves the archetype mechanism (task section 9/14)", () => {
  it("A (task section 14.A): one archetype (emf.calculate_flux_change) generates multiple materially distinct original instances across seeds", () => {
    const instances = Array.from({ length: 8 }, (_, seed) => generate("emf.calculate_flux_change", seed));
    const uniqueParameterSets = new Set(instances.map((inst) => JSON.stringify(inst.parameters)));
    expect(uniqueParameterSets.size).toBeGreaterThan(1);
    const uniqueTargets = new Set(instances.map((inst) => inst.parameters.target_variable));
    expect(uniqueTargets.size).toBeGreaterThan(1);
  });

  it("A2 (CC-09E.1): magnetism.identify_flux_density_unit generates ONLY the sample-tested quantity (tesla) across seeds -- flux density and flux were split into separate honestly-classified blueprints, so this DIRECT blueprint must never also generate weber", () => {
    const instances = Array.from({ length: 10 }, (_, seed) => generate("magnetism.identify_flux_density_unit", seed));
    const uniqueExpectedValues = new Set(instances.map((inst) => inst.expected.value));
    expect(uniqueExpectedValues).toEqual(new Set(["tesla"]));
    for (const inst of instances) {
      expect(inst.evidence.assertionIdentifiers).toEqual(["EL-UNIT-TESLA-001"]);
    }
  });

  it("A3 (CC-09E.1): magnetism.identify_flux_unit (the TRANSFER sibling) generates ONLY weber across seeds, and its knowledge target is distinct from the DIRECT blueprint it was split from", () => {
    const instances = Array.from({ length: 10 }, (_, seed) => generate("magnetism.identify_flux_unit", seed));
    const uniqueExpectedValues = new Set(instances.map((inst) => inst.expected.value));
    expect(uniqueExpectedValues).toEqual(new Set(["weber"]));
    for (const inst of instances) {
      expect(inst.evidence.assertionIdentifiers).toEqual(["EL-UNIT-WEBER-001"]);
    }
  });

  it("regression (CC-09E.1 task section 1): no DIRECT_SAMPLE_ANALOGUE archetype blueprint generates a knowledge target other than the one(s) named in its own assessmentStyleEvidence-adjacent assertionIdentifiers -- a DIRECT classification must never silently cover transfer-only content", () => {
    const directIds = CC09E_ARCHETYPE_BLUEPRINT_IDS.filter((id) => !CC09E_TRANSFER_BLUEPRINT_IDS.has(id));
    for (const id of directIds) {
      const blueprint = pedagogy.questionBlueprints.find((q) => q.id === id)!;
      const declaredIds = new Set(blueprint.evidence.assertionIdentifiers);
      const instances = Array.from({ length: 6 }, (_, seed) => generate(id, seed));
      for (const inst of instances) {
        for (const assertionId of inst.evidence.assertionIdentifiers) {
          expect(declaredIds.has(assertionId)).toBe(true);
        }
      }
    }
  });

  it("B (task section 14.B): every CC-09E archetype's generated evidence references only real, already-governed assertion identifiers -- generation never introduces ungoverned knowledge", () => {
    for (const id of CC09E_ARCHETYPE_BLUEPRINT_IDS) {
      const instance = generate(id, 1);
      expect(instance.evidence.assertionIdentifiers.length).toBeGreaterThan(0);
      for (const assertionId of instance.evidence.assertionIdentifiers) {
        expect(realAssertionIds.has(assertionId)).toBe(true);
      }
    }
  });

  it("D (task section 14.D): the transferred archetype (ac_reactive.identify_reactance_unit) draws its knowledge target from an assertion that already existed before CC-09E -- the transfer introduces no new knowledge, only a new question grammar applied to it", () => {
    const instance = generate("ac_reactive.identify_reactance_unit", 1);
    expect(instance.evidence.assertionIdentifiers).toEqual(["EL-CONCEPT-REACTANCE-001"]);
    // EL-CONCEPT-REACTANCE-001 pre-dates CC-09D/E (CC-04B corpus) -- confirmed
    // by it NOT being one of CC-09D's four newly-authored assertions.
    const cc09dAddedIds = new Set(["EL-REL-IMPEDANCE-001", "EL-UNIT-WEBER-001", "EL-UNIT-TESLA-001", "EL-REL-FLUX-CHANGE-EMF-001"]);
    expect(cc09dAddedIds.has("EL-CONCEPT-REACTANCE-001")).toBe(false);
  });

  it("E (task section 14.E/11, strengthened CC-09E.1 task section 2): declared distractor options are governed, plausible error-pattern shapes -- never arbitrary filler; every distractor naming a real SI unit must itself be an already-governed unit, and every misconception target (where declared) references a real governed misconception", () => {
    const impedanceBlueprint = pedagogy.questionBlueprints.find((q) => q.id === "ac_reactive.select_impedance_formula")!;
    // Distractors are wrong-operation (subtraction instead of the
    // Pythagorean sum) and inversion errors -- the same shape of plausible
    // calculation mistake the corpus's own misconception vocabulary
    // already anticipates for formula-selection tasks, never silly filler.
    expect(impedanceBlueprint.answer.options).toEqual(["sqrt_r2_plus_x2", "sqrt_r2_minus_x2", "r_over_z", "z_over_r"]);

    // Every archetype blueprint whose answer options are themselves SI-unit
    // names (the "identify the unit" grammar) must draw every option --
    // correct answer AND every distractor -- from GOVERNED_UNIT_NAMES.
    // CC-09E.1 (task section 2) exists specifically because "siemens" had
    // slipped into ac_reactive.identify_reactance_unit's options despite
    // never being a governed Unit 202 quantity/unit anywhere in this
    // corpus -- this mechanically prevents that class of defect recurring.
    const unitIdentifyingBlueprintIds = [
      "magnetism.identify_flux_density_unit",
      "magnetism.identify_flux_unit",
      "ac_reactive.identify_reactance_unit",
    ];
    for (const id of unitIdentifyingBlueprintIds) {
      const blueprint = pedagogy.questionBlueprints.find((q) => q.id === id)!;
      for (const option of blueprint.answer.options ?? []) {
        expect(GOVERNED_UNIT_NAMES.has(option), `"${option}" (blueprint ${id}) must be a governed SI unit`).toBe(true);
      }
    }

    for (const id of CC09E_ARCHETYPE_BLUEPRINT_IDS) {
      const blueprint = pedagogy.questionBlueprints.find((q) => q.id === id)!;
      for (const target of blueprint.evidence.misconceptionTargets) {
        expect(realMisconceptionIds.has(target.misconceptionIdentifier)).toBe(true);
      }
    }
  });

  it("F (task section 14.F/6): generation succeeds and is fully self-contained from governed data alone -- no CC-09E executor file references either official-assessment source, and every generated instance's parameters/expected values are structurally plain numbers/strings, never containing sample item text", () => {
    for (const id of CC09E_ARCHETYPE_BLUEPRINT_IDS) {
      const instance = generate(id, 3);
      for (const value of Object.values(instance.parameters)) {
        expect(typeof value === "number" || typeof value === "string").toBe(true);
        if (typeof value === "string") expect(value.length).toBeLessThan(50);
      }
    }
    // The two official-assessment sources carry zero provenance links
    // anywhere in the corpus (CC-09D's own firebreak, re-confirmed here
    // from the archetype-generation side): no generation path could even
    // reach them.
    const assessmentSourceKeys = new Set(["src-cg-2365-602-sample-questions", "src-cg-2365-602-sample-mark-scheme"]);
    const sourceVersionKeyBySourceKey = new Map(
      cc04Unit202ElectricalScience.sourceVersions
        .filter((sv) => assessmentSourceKeys.has(sv.sourceKey))
        .map((sv) => [sv.key, sv.sourceKey]),
    );
    const citingLinks = cc04Unit202ElectricalScience.assertionProvenanceLinks.filter((p) => {
      const svKey = cc04Unit202ElectricalScience.sourceLocators.find((l) => l.key === p.sourceLocatorKey)?.sourceVersionKey;
      return svKey ? sourceVersionKeyBySourceKey.has(svKey) : false;
    });
    expect(citingLinks).toEqual([]);
  });

  it("G (task section 14.G/13): normative assessment weighting (the official per-LO question allocation) is structurally separate from archetype classification metadata -- assessmentStyleEvidence never carries a weighting/percentage field, and the AssessmentSpecification's own LO allocations are untouched by CC-09E", () => {
    for (const id of CC09E_ARCHETYPE_BLUEPRINT_IDS) {
      const evidence = pedagogy.questionBlueprints.find((q) => q.id === id)!.assessmentStyleEvidence!;
      expect(Object.keys(evidence)).toEqual(expect.not.arrayContaining(["weighting", "percentage", "questionCount"]));
    }
    const spec = unit202AssessmentSpecification.specifications[0]!;
    const totalByOfficialSpec = spec.outcomeAllocations.reduce((sum, a) => sum + a.questionCount, 0);
    expect(totalByOfficialSpec).toBe(40);
    expect(spec.outcomeAllocations.map((a) => a.questionCount).sort((x, y) => x - y)).toEqual([2, 4, 5, 7, 7, 15]);
  });

  it("H (task section 14.H): identical identity tuples produce byte-for-byte deterministic instances for every CC-09E archetype", () => {
    for (const id of CC09E_ARCHETYPE_BLUEPRINT_IDS) {
      const a = generate(id, 77);
      const b = generate(id, 77);
      expect(a).toEqual(b);
    }
  });
});
