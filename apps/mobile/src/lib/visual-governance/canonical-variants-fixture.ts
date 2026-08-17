/**
 * CC-05D: governed-content mirror of
 * scripts/visual-governance/data/canonical-variants.ts's output for the 4
 * rendered diagram blueprints -- apps/mobile must never import
 * scripts/visual-governance directly (the same content-authoring-tooling
 * boundary rule scripts/content/README.md already states, mirrored
 * identically here, and the same pattern
 * apps/mobile/src/lib/proving-content/unit202-proving-fixture.ts already
 * established for CC-05C's governed content).
 *
 * Every entry here is mechanically cross-checked byte-for-byte against
 * the real builder output by
 * scripts/visual-governance/check-mobile-canonical-variants-fixture.test.ts
 * (content-authoring tooling, permitted to import both sides). If the
 * real canonical-variant data changes, that test fails until this file
 * is updated to match -- it cannot silently drift.
 */

import type { CanonicalVariant } from "@alp/content-schema";

export const CC05D_CONTENT_RELEASE = "cc05d-visual-governance-pilot-v1";

export const CANONICAL_VARIANTS: readonly CanonicalVariant[] = [
  {
    variantId: "visual-contract.series-circuit-current-direction@1::component_count=2,mode=both,show_current_arrow=true,show_values=false::both",
    contractId: "visual-contract.series-circuit-current-direction",
    contractVersion: 1,
    diagramBlueprintId: "circuit.series_resistors",
    mode: "both",
    parameters: { component_count: 2, show_values: false, show_current_arrow: true },
    labels: ["R1", "R2"],
    revealProps: {},
  },
  {
    variantId: "visual-contract.series-circuit-current-direction@1::component_count=3,mode=both,show_current_arrow=true,show_values=false::both",
    contractId: "visual-contract.series-circuit-current-direction",
    contractVersion: 1,
    diagramBlueprintId: "circuit.series_resistors",
    mode: "both",
    parameters: { component_count: 3, show_values: false, show_current_arrow: true },
    labels: ["R1", "R2", "R3"],
    revealProps: {},
  },
  {
    variantId: "visual-contract.series-circuit-current-direction@1::component_count=4,mode=both,show_current_arrow=true,show_values=false::both",
    contractId: "visual-contract.series-circuit-current-direction",
    contractVersion: 1,
    diagramBlueprintId: "circuit.series_resistors",
    mode: "both",
    parameters: { component_count: 4, show_values: false, show_current_arrow: true },
    labels: ["R1", "R2", "R3", "R4"],
    revealProps: {},
  },
  {
    variantId: "visual-contract.parallel-circuit-branches@1::branch_count=2,mode=both,show_branch_current_arrows=true,show_values=false::both",
    contractId: "visual-contract.parallel-circuit-branches",
    contractVersion: 1,
    diagramBlueprintId: "circuit.parallel_resistors",
    mode: "both",
    parameters: { branch_count: 2, show_values: false, show_branch_current_arrows: true },
    labels: ["R1", "R2"],
    revealProps: {},
  },
  {
    variantId: "visual-contract.parallel-circuit-branches@1::branch_count=3,mode=both,show_branch_current_arrows=true,show_values=false::both",
    contractId: "visual-contract.parallel-circuit-branches",
    contractVersion: 1,
    diagramBlueprintId: "circuit.parallel_resistors",
    mode: "both",
    parameters: { branch_count: 3, show_values: false, show_branch_current_arrows: true },
    labels: ["R1", "R2", "R3"],
    revealProps: {},
  },
  {
    variantId: "visual-contract.parallel-circuit-branches@1::branch_count=4,mode=both,show_branch_current_arrows=true,show_values=false::both",
    contractId: "visual-contract.parallel-circuit-branches",
    contractVersion: 1,
    diagramBlueprintId: "circuit.parallel_resistors",
    mode: "both",
    parameters: { branch_count: 4, show_values: false, show_branch_current_arrows: true },
    labels: ["R1", "R2", "R3", "R4"],
    revealProps: {},
  },
  {
    variantId:
      "visual-contract.right-hand-grip-rule@1::current_direction=into_page,field_rotation=clockwise,mode=teaching,show_field_arrows=true::teaching",
    contractId: "visual-contract.right-hand-grip-rule",
    contractVersion: 1,
    diagramBlueprintId: "magnetic.field_conductor_direction",
    mode: "teaching",
    parameters: { current_direction: "into_page", show_field_arrows: true },
    labels: ["conductor"],
    revealProps: { field_rotation: "clockwise" },
  },
  {
    variantId: "visual-contract.right-hand-grip-rule@1::current_direction=into_page,mode=assessment,show_field_arrows=true::assessment",
    contractId: "visual-contract.right-hand-grip-rule",
    contractVersion: 1,
    diagramBlueprintId: "magnetic.field_conductor_direction",
    mode: "assessment",
    parameters: { current_direction: "into_page", show_field_arrows: true },
    labels: ["conductor"],
    revealProps: {},
  },
  {
    variantId:
      "visual-contract.right-hand-grip-rule@1::current_direction=out_of_page,field_rotation=counterclockwise,mode=teaching,show_field_arrows=true::teaching",
    contractId: "visual-contract.right-hand-grip-rule",
    contractVersion: 1,
    diagramBlueprintId: "magnetic.field_conductor_direction",
    mode: "teaching",
    parameters: { current_direction: "out_of_page", show_field_arrows: true },
    labels: ["conductor"],
    revealProps: { field_rotation: "counterclockwise" },
  },
  {
    variantId: "visual-contract.right-hand-grip-rule@1::current_direction=out_of_page,mode=assessment,show_field_arrows=true::assessment",
    contractId: "visual-contract.right-hand-grip-rule",
    contractVersion: 1,
    diagramBlueprintId: "magnetic.field_conductor_direction",
    mode: "assessment",
    parameters: { current_direction: "out_of_page", show_field_arrows: true },
    labels: ["conductor"],
    revealProps: {},
  },
  {
    variantId:
      "visual-contract.motor-principle-force@1::current_direction=into_page,force_direction=down,mode=teaching,pole_labels=N_S_horizontal,show_force_arrow=true::teaching",
    contractId: "visual-contract.motor-principle-force",
    contractVersion: 1,
    diagramBlueprintId: "motor.force_field_current",
    mode: "teaching",
    parameters: { pole_labels: "N_S_horizontal", current_direction: "into_page", show_force_arrow: true },
    labels: ["conductor"],
    revealProps: { force_direction: "down" },
  },
  {
    variantId:
      "visual-contract.motor-principle-force@1::current_direction=into_page,mode=assessment,pole_labels=N_S_horizontal,show_force_arrow=true::assessment",
    contractId: "visual-contract.motor-principle-force",
    contractVersion: 1,
    diagramBlueprintId: "motor.force_field_current",
    mode: "assessment",
    parameters: { pole_labels: "N_S_horizontal", current_direction: "into_page", show_force_arrow: true },
    labels: ["conductor"],
    revealProps: {},
  },
  {
    variantId:
      "visual-contract.motor-principle-force@1::current_direction=out_of_page,force_direction=up,mode=teaching,pole_labels=N_S_horizontal,show_force_arrow=true::teaching",
    contractId: "visual-contract.motor-principle-force",
    contractVersion: 1,
    diagramBlueprintId: "motor.force_field_current",
    mode: "teaching",
    parameters: { pole_labels: "N_S_horizontal", current_direction: "out_of_page", show_force_arrow: true },
    labels: ["conductor"],
    revealProps: { force_direction: "up" },
  },
  {
    variantId:
      "visual-contract.motor-principle-force@1::current_direction=out_of_page,mode=assessment,pole_labels=N_S_horizontal,show_force_arrow=true::assessment",
    contractId: "visual-contract.motor-principle-force",
    contractVersion: 1,
    diagramBlueprintId: "motor.force_field_current",
    mode: "assessment",
    parameters: { pole_labels: "N_S_horizontal", current_direction: "out_of_page", show_force_arrow: true },
    labels: ["conductor"],
    revealProps: {},
  },
  {
    variantId:
      "visual-contract.motor-principle-force@1::current_direction=into_page,force_direction=left,mode=teaching,pole_labels=N_S_vertical,show_force_arrow=true::teaching",
    contractId: "visual-contract.motor-principle-force",
    contractVersion: 1,
    diagramBlueprintId: "motor.force_field_current",
    mode: "teaching",
    parameters: { pole_labels: "N_S_vertical", current_direction: "into_page", show_force_arrow: true },
    labels: ["conductor"],
    revealProps: { force_direction: "left" },
  },
  {
    variantId:
      "visual-contract.motor-principle-force@1::current_direction=into_page,mode=assessment,pole_labels=N_S_vertical,show_force_arrow=true::assessment",
    contractId: "visual-contract.motor-principle-force",
    contractVersion: 1,
    diagramBlueprintId: "motor.force_field_current",
    mode: "assessment",
    parameters: { pole_labels: "N_S_vertical", current_direction: "into_page", show_force_arrow: true },
    labels: ["conductor"],
    revealProps: {},
  },
  {
    variantId:
      "visual-contract.motor-principle-force@1::current_direction=out_of_page,force_direction=right,mode=teaching,pole_labels=N_S_vertical,show_force_arrow=true::teaching",
    contractId: "visual-contract.motor-principle-force",
    contractVersion: 1,
    diagramBlueprintId: "motor.force_field_current",
    mode: "teaching",
    parameters: { pole_labels: "N_S_vertical", current_direction: "out_of_page", show_force_arrow: true },
    labels: ["conductor"],
    revealProps: { force_direction: "right" },
  },
  {
    variantId:
      "visual-contract.motor-principle-force@1::current_direction=out_of_page,mode=assessment,pole_labels=N_S_vertical,show_force_arrow=true::assessment",
    contractId: "visual-contract.motor-principle-force",
    contractVersion: 1,
    diagramBlueprintId: "motor.force_field_current",
    mode: "assessment",
    parameters: { pole_labels: "N_S_vertical", current_direction: "out_of_page", show_force_arrow: true },
    labels: ["conductor"],
    revealProps: {},
  },
];
