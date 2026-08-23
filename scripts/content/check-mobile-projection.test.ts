/**
 * Currency + determinism proof for the generated mobile content
 * projection (CC-06D, Correction B). Replaces the retired
 * check-lesson-player-content-fixture.test.ts equality-mirror check:
 * the mobile projection is now DERIVED, so the gate is "regenerate and
 * compare with the committed artefact", exactly like `content:check`
 * for the seed SQL.
 *
 * SOURCE-OF-TRUTH ACCEPTANCE (task brief §22): if governed learner
 * content changes without regenerating the projection, the committed
 * module no longer matches the regenerated output and this suite (and
 * `npm run content:mobile:check` in CI) fails -- there is no manual
 * mobile fixture left to edit.
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";
import {
  contentReleaseManifestSchema,
  knowledgeGraphManifestSchema,
  lessonPlanManifestSchema,
  mobileContentProjectionSchema,
  pedagogyManifestSchema,
} from "@alp/content-schema";

import { cc04Unit202ElectricalScience } from "./data/cc04-unit202-electrical-science.ts";
import { cc05aPedagogyUnit202 } from "./data/cc05a-pedagogy-unit202.ts";
import { contentReleases, MOBILE_BUNDLED_RELEASE_ID } from "./data/content-releases.ts";
import { lessons } from "./data/lessons.ts";
import { buildMobileContentProjection, PROJECTION_OUTPUT_FILE, renderProjectionModule } from "./generate-mobile-projection.ts";

const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");

function realInputs() {
  const releaseManifest = contentReleaseManifestSchema.parse(contentReleases);
  const release = releaseManifest.releases.find((r) => r.id === MOBILE_BUNDLED_RELEASE_ID)!;
  return {
    release,
    allLessons: lessonPlanManifestSchema.parse({ lessons }).lessons,
    pedagogy: pedagogyManifestSchema.parse(cc05aPedagogyUnit202),
    knowledgeGraph: knowledgeGraphManifestSchema.parse(cc04Unit202ElectricalScience),
  };
}

describe("generated mobile content projection", () => {
  it("CURRENCY: the committed generated module is byte-identical to a fresh regeneration from the governed source", () => {
    const committed = readFileSync(join(REPO_ROOT, PROJECTION_OUTPUT_FILE), "utf8");
    const regenerated = renderProjectionModule(buildMobileContentProjection(realInputs()));
    expect(committed.replaceAll("\r\n", "\n")).toBe(regenerated.replaceAll("\r\n", "\n"));
  });

  it("DETERMINISM: generating twice produces byte-identical output", () => {
    const a = renderProjectionModule(buildMobileContentProjection(realInputs()));
    const b = renderProjectionModule(buildMobileContentProjection(realInputs()));
    expect(a).toBe(b);
  });

  it("STALENESS DETECTION: changing governed learner-facing content changes the generated output (so the check gate fails until regeneration)", () => {
    const inputs = realInputs();
    const current = renderProjectionModule(buildMobileContentProjection(inputs));
    const tamperedKnowledge = {
      ...inputs.knowledgeGraph,
      assertionVersions: inputs.knowledgeGraph.assertionVersions.map((v) =>
        v.assertionIdentifier === "EL-OHM-RELATIONSHIP-001" ? { ...v, statement: `${v.statement} (edited)` } : v,
      ),
    };
    const tampered = renderProjectionModule(buildMobileContentProjection({ ...inputs, knowledgeGraph: tamperedKnowledge }));
    expect(tampered).not.toBe(current);
  });

  it("carries the release identity and only release-member lessons", () => {
    const projection = buildMobileContentProjection(realInputs());
    expect(projection.contentRelease.id).toBe(MOBILE_BUNDLED_RELEASE_ID);
    // CC-08A: release.unit202.v1 (Ohm's Law only) and release.unit202.v2
    // (the CC-08 four-lesson adaptive vertical) both remain exact,
    // untouched immutable snapshots. CC-10's fifteen-lesson
    // release.unit202.v3 and CC-11's twenty-four-lesson
    // release.unit202.v4 (fifteen re-addressed v3 lessons plus nine
    // genuinely new LO3/LO5/LO6 lessons) each reuse the same underlying
    // lesson objects via release-scoped membership entries, never a
    // mutation -- v4 is what this projection now bundles.
    expect(projection.lessons.map((l) => l.id).sort()).toEqual(
      [
        "lesson.electrical.charge-and-current",
        "lesson.electrical.conductors-and-insulators",
        "lesson.electrical.core-quantities",
        "lesson.electrical.electronic-components-passive",
        "lesson.electrical.electronic-components-switching-control",
        "lesson.electrical.energy-and-efficiency",
        "lesson.electrical.fault-conditions-protection",
        "lesson.electrical.instrumentation",
        "lesson.electrical.ohms-law",
        "lesson.electrical.power",
        "lesson.electrical.resistivity",
        "lesson.electrical.resistors-parallel",
        "lesson.electrical.resistors-series",
        "lesson.electrical.series-vs-parallel-comparison",
        "lesson.electrical.si-units",
        "lesson.electrical.thermal-and-chemical-effects",
        "lesson.emf.ac-generation-principles",
        "lesson.foundation.maths.formula-rearrangement",
        "lesson.foundation.physics.mass-and-weight",
        "lesson.foundation.physics.mechanics-force-work-energy-power",
        "lesson.foundation.physics.simple-machines",
        "lesson.magnetism.effects-of-current",
        "lesson.magnetism.fundamentals",
        "lesson.waveforms.ac-dc-and-sine-wave-quantities",
      ].sort(),
    );
    for (const lesson of projection.lessons) {
      expect(lesson.contentRelease).toBe(MOBILE_BUNDLED_RELEASE_ID);
    }
  });

  it("carries exactly the 96 governed question blueprints the release's lessons reference (CC-11 expansion), each WITH governed presentation", () => {
    const projection = buildMobileContentProjection(realInputs());
    expect(projection.questionBlueprints.map((b) => b.id).sort()).toEqual(
      [
        "charge.calculate",
        "charge.recognise",
        "comparison.compare_current_voltage",
        "comparison.compare_power_energy",
        "comparison.compare_resistance",
        "comparison.identify_topology",
        "comparison.recognise_mixed_circuit",
        "comparison.trace_current_path",
        "conductors.classify_material",
        "conductors.recognise_breakdown",
        "core_quantities.diagnose_current_voltage_confusion",
        "core_quantities.recognise_from_definition",
        "electronics.identify_application",
        "electronics.recognise_capacitor_behaviour",
        "electronics.recognise_diode_family",
        "electronics.recognise_rectifier_type",
        "electronics.recognise_switching_family",
        "electronics.recognise_thermistor_type",
        "emf.calculate_flux_change",
        "emf.describe_ac_generation",
        "emf.distinguish_emf_terminal_voltage",
        "energy.calculate_efficiency",
        "energy.calculate_energy",
        "energy.calculate_energy_kwh",
        "energy.rearrange",
        "fault.compare_fuse_breaker",
        "fault.predict_short_effect",
        "fault.recognise_condition",
        "fault.select_protective_device",
        "foundational.rearrange_additive",
        "foundational.rearrange_multiplicative",
        "gears.recognise_ratio_tradeoff",
        "instrumentation.recognise_connection",
        "instrumentation.recognise_internal_resistance_property",
        "instrumentation.recognise_purpose",
        "instrumentation.select_instrument",
        "levers.calculate_effort_or_load",
        "levers.identify_class",
        "magnetism.compare_motor_generator",
        "magnetism.compare_permanent_electromagnet",
        "magnetism.identify_flux_density_unit",
        "magnetism.identify_flux_unit",
        "magnetism.interpret_field_direction",
        "magnetism.interpret_force_direction",
        "magnetism.recognise_concept",
        "mass_weight.recognise_relationship",
        "mechanics.calculate_efficiency",
        "mechanics.calculate_kinetic_energy",
        "mechanics.calculate_potential_energy",
        "mechanics.calculate_power",
        "mechanics.calculate_work",
        "mechanics.recognise_concept",
        "ohms_law.diagnose_rearrangement_error",
        "ohms_law.diagnose_wrong_operation",
        "ohms_law.match_variables_units",
        "ohms_law.plausibility_check",
        "ohms_law.select_rearrangement",
        "ohms_law.solve_for_current",
        "ohms_law.solve_for_resistance",
        "ohms_law.solve_for_voltage",
        "parallel.calculate_branch_current",
        "parallel.calculate_total",
        "parallel.detect_impossible_total",
        "parallel.diagnose_missing_final_inversion",
        "parallel.diagnose_reciprocal_error",
        "parallel.identify_topology",
        "parallel.solve_missing_branch",
        "power.calculate_from_ir",
        "power.calculate_from_vi",
        "power.calculate_from_vr",
        "power.calculate_total",
        "power.recognise_relationship",
        "power.select_form",
        "pulleys.recognise_force_distance_tradeoff",
        "resistivity.calculate_resistance",
        "resistivity.compare_materials",
        "resistivity.predict_area_effect",
        "resistivity.predict_length_effect",
        "resistivity.recognise",
        "series.calculate_supply_current",
        "series.calculate_total_resistance",
        "series.calculate_voltage_drop",
        "series.detect_incorrect_total",
        "series.interpret_diagram",
        "series.solve_missing_component",
        "si_units.diagnose_unit_confusion",
        "si_units.distinguish_base_derived",
        "si_units.identify_unit",
        "thermal_chemical.recognise_application",
        "thermal_chemical.recognise_effect",
        "waveform.calculate_frequency_from_period",
        "waveform.calculate_rms_from_peak",
        "waveform.compare_ac_dc_behaviour",
        "waveform.identify_characteristic",
        "waveform.interpret_rated_value",
        "waveform.recognise_ac_dc",
      ].sort(),
    );
    for (const blueprint of projection.questionBlueprints) {
      expect(blueprint.presentation?.promptLines.length ?? 0).toBeGreaterThan(0);
    }
  });

  it("CC-07: carries minimal assertion-family metadata (required capability sets) for on-device family derivation, never the authoring record", () => {
    const projection = buildMobileContentProjection(realInputs());
    const ohm = projection.assertionFamilies.find((f) => f.id === "electrical.ohms_law");
    expect(ohm).toBeDefined();
    expect(ohm!.requiredCapabilityIds.length).toBeGreaterThan(0);
    expect(ohm!.assessmentRequirement).toBe("assessable");
    // Prerequisite families the lesson references must be present too.
    for (const prereq of projection.lessons[0]!.prerequisiteKnowledge) {
      expect(projection.assertionFamilies.some((f) => f.id === prereq)).toBe(true);
    }
    // Authoring-only family fields never ship.
    const committed = readFileSync(join(REPO_ROOT, PROJECTION_OUTPUT_FILE), "utf8");
    expect(committed).not.toContain("learningIntent");
    expect(committed).not.toContain("teachingOnlyReason");
  });

  it("does not leak authoring/governance data: no provenance, sources, curricula or review metadata ship to mobile", () => {
    const committed = readFileSync(join(REPO_ROOT, PROJECTION_OUTPUT_FILE), "utf8");
    for (const forbidden of ["provenance", "sourceLocator", "curriculumNode", "accessLocation", "QUALIFICATION_HANDBOOK"]) {
      expect(committed).not.toContain(forbidden);
    }
  });

  it("MULTI-LESSON GENERICITY: a second synthetic lesson enters the projection through generation alone -- no manual mobile copy of its factual content", () => {
    const inputs = realInputs();
    // CC-08A: `inputs.allLessons` also carries release.unit202.v1's own
    // untouched Ohm's Law entry -- must pick the v2-tagged one that is
    // actually a member of the release under test here, not just the
    // first array element.
    const real = inputs.allLessons.find((l) => l.id === "lesson.electrical.ohms-law" && l.contentRelease === MOBILE_BUNDLED_RELEASE_ID);
    const second = {
      ...real!,
      id: "lesson.synthetic.second",
      title: "Synthetic second lesson",
    };
    const release = {
      ...inputs.release,
      lessons: [...inputs.release.lessons, { lessonId: second.id, lessonVersion: second.version }],
    };
    const projection = buildMobileContentProjection({ ...inputs, release, allLessons: [...inputs.allLessons, second] });
    expect(projection.lessons.map((l) => l.id).sort()).toEqual(
      [
        "lesson.electrical.charge-and-current",
        "lesson.electrical.conductors-and-insulators",
        "lesson.electrical.core-quantities",
        "lesson.electrical.electronic-components-passive",
        "lesson.electrical.electronic-components-switching-control",
        "lesson.electrical.energy-and-efficiency",
        "lesson.electrical.fault-conditions-protection",
        "lesson.electrical.instrumentation",
        "lesson.electrical.ohms-law",
        "lesson.electrical.power",
        "lesson.electrical.resistivity",
        "lesson.electrical.resistors-parallel",
        "lesson.electrical.resistors-series",
        "lesson.electrical.series-vs-parallel-comparison",
        "lesson.electrical.si-units",
        "lesson.electrical.thermal-and-chemical-effects",
        "lesson.emf.ac-generation-principles",
        "lesson.foundation.maths.formula-rearrangement",
        "lesson.foundation.physics.mass-and-weight",
        "lesson.foundation.physics.mechanics-force-work-energy-power",
        "lesson.foundation.physics.simple-machines",
        "lesson.magnetism.effects-of-current",
        "lesson.magnetism.fundamentals",
        "lesson.synthetic.second",
        "lesson.waveforms.ac-dc-and-sine-wave-quantities",
      ].sort(),
    );
    // The whole projection still validates against its governed schema.
    expect(() => mobileContentProjectionSchema.parse(projection)).not.toThrow();
  });

  it("FAILS LOUDLY when a release member references governed content that does not exist", () => {
    const inputs = realInputs();
    // CC-08A: mutate the v2-tagged Ohm's Law entry that is actually a
    // member of the release under test -- release.unit202.v1's own
    // untouched entry (also present in `inputs.allLessons`) is never a
    // member of this release and would silently be ignored instead.
    const real = inputs.allLessons.find((l) => l.id === "lesson.electrical.ohms-law" && l.contentRelease === MOBILE_BUNDLED_RELEASE_ID)!;
    const broken = {
      ...real,
      targetAssertionIdentifiers: [...real.targetAssertionIdentifiers, "EL-DOES-NOT-EXIST-999"],
    };
    const allLessons = inputs.allLessons.map((l) => (l === real ? broken : l));
    expect(() => buildMobileContentProjection({ ...inputs, allLessons })).toThrow(/EL-DOES-NOT-EXIST-999/);
  });
});
