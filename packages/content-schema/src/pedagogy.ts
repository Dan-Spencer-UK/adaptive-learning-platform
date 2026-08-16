/**
 * CC-05A: structured schema for the pedagogical layer between governed
 * atomic assertions (./knowledge-graph.ts) and a future deterministic
 * question/calculation engine (CC-05B) -- assertion families, capabilities,
 * formula families, teaching/visual representations, diagram blueprints,
 * question blueprints and their answer/marking/evidence contracts.
 *
 * Design authority: docs/architecture/CC-05-PEDAGOGICAL-KNOWLEDGE-AND-
 * QUESTION-ARCHITECTURE.md (approved). This module formalises that
 * document's §30 "proposed core schema objects" as Zod schemas.
 *
 * Boundary rules this file exists to enforce structurally:
 *  - a formula's calculation semantics are a structured `FormulaExpression`
 *    tree over variable symbols, never a display string parsed at runtime
 *    (design doc §7.1, §8, §35);
 *  - diagram/formula *rendering* is a separate concern (blueprint +
 *    parameters) from calculation authority (design doc §8, §34, §35) --
 *    this file defines the blueprints only, not a renderer;
 *  - every schema here is plain serialisable data (no functions, no
 *    classes), so it is Hermes/mobile-runtime-safe by construction (design
 *    doc §33).
 *
 * This module does not know about any particular domain's content (Ohm's
 * law, parallel resistance, ...) -- that lives in scripts/content/data,
 * exactly as knowledge-graph.ts does not know about Unit 202.
 */

import { z } from "zod";

const stableId = z.string().min(1);

// ---------------------------------------------------------------------
// Shared enums
// ---------------------------------------------------------------------

export const familyMembershipRoleSchema = z.enum([
  "canonical_form",
  "rearranged_form",
  "prerequisite_concept",
  "consequence",
  "sanity_check",
  "misconception_guard",
  "contextual_application",
]);

export const capabilityOperationTypeSchema = z.enum([
  "recognise",
  "identify",
  "select_relationship",
  "calculate",
  "rearrange",
  "interpret_diagram",
  "compare",
  "predict",
  "check_plausibility",
  "diagnose_error",
  "apply_unit",
]);

export const representationRequirementLevelSchema = z.enum([
  "none",
  "optional",
  "recommended",
  "required",
]);

export const representationRoleSchema = z.enum([
  "decorative",
  "supporting",
  "essential",
]);

export const teachingRepresentationTypeSchema = z.enum([
  "display_formula",
  "formula_family",
  "variable_key",
  "worked_example",
  "mnemonic",
  "technical_diagram",
  "concept_card",
  "comparison",
  "step_sequence",
  "sanity_check",
  "misconception_warning",
  "interactive_visual",
]);

export const formulaOperationSchema = z.enum([
  "multiply",
  "divide",
  "add",
  "subtract",
  "square",
  "sqrt",
  "power",
  "reciprocal",
  "reciprocal_of_sum_of_reciprocals",
  "ratio_percentage",
]);

export const workedExampleStepSchema = z.enum([
  "show_formula",
  "show_rearrangement",
  "substitute_values",
  "calculate",
  "show_answer_with_unit",
  "sanity_check_result",
]);

export const diagramTypeSchema = z.enum([
  "electrical_circuit",
  "magnetic_field",
  "mnemonic",
  "graph",
  "instrument_connection",
  "waveform",
]);

export const diagramParameterKindSchema = z.enum([
  "enum",
  "boolean",
  "label_pattern",
  "number_range",
]);

export const answerTypeSchema = z.enum([
  "quantity",
  "integer",
  "decimal",
  "fraction",
  "multiple_choice",
  "multi_select",
  "direction",
  "ordering",
  "formula_selection",
  "diagram_region",
  "worked_error_classification",
]);

export const markingTypeSchema = z.enum([
  "exact",
  "numeric_tolerance",
  "equivalent_fraction",
  "unit_aware_numeric",
  "enum",
  "set_equality",
  "ordered_sequence",
  "direction_match",
  "structured_expression",
]);

export const evidenceStrengthSchema = z.enum([
  "direct",
  "suggestive",
  "generic",
]);

export const difficultyBandSchema = z.enum([
  "introductory",
  "intermediate",
  "advanced",
  "diagnostic",
]);

// ---------------------------------------------------------------------
// 1. Assertion families, membership, standalone classification
// ---------------------------------------------------------------------

export const familyCompletenessManifestSchema = z.object({
  requiredCapabilityIds: z.array(stableId).min(1),
});

export const assertionFamilyManifestSchema = z
  .object({
    id: stableId,
    title: z.string().min(1),
    learningIntent: z.string().min(1),
    teachFamilyTogether: z.boolean().default(true),
    completeness: familyCompletenessManifestSchema,
    // Section 21/29 exception mechanism: a family may be legitimately
    // teaching-only (e.g. reusable horizontal Foundational technique
    // knowledge assessed only in the context of the Electrical families
    // that consume it) rather than independently assessed. When
    // "teaching_only", the mechanical coverage gate does not require this
    // family's capabilities to have their own question-blueprint coverage
    // -- but a documented reason is mandatory, never a silent gap.
    assessmentRequirement: z.enum(["assessable", "teaching_only"]).default("assessable"),
    teachingOnlyReason: z.string().min(1).optional(),
  })
  .superRefine((family, ctx) => {
    if (family.assessmentRequirement === "teaching_only" && !family.teachingOnlyReason) {
      ctx.addIssue({
        code: "custom",
        message: `family ${family.id} is teaching_only but declares no teachingOnlyReason`,
        path: ["teachingOnlyReason"],
      });
    }
  });

export const assertionFamilyMembershipManifestSchema = z.object({
  familyId: stableId,
  assertionIdentifier: stableId,
  role: familyMembershipRoleSchema,
  sequence: z.number().int().positive().optional(),
});

export const standaloneAssertionManifestSchema = z.object({
  assertionIdentifier: stableId,
  reason: z.string().min(1),
});

// ---------------------------------------------------------------------
// 2. Capabilities
// ---------------------------------------------------------------------

export const capabilityManifestSchema = z.object({
  id: stableId,
  familyId: stableId,
  operationType: capabilityOperationTypeSchema,
  description: z.string().min(1),
});

// ---------------------------------------------------------------------
// 3. Formula families
// ---------------------------------------------------------------------

export const variableDefinitionManifestSchema = z.object({
  symbol: z.string().min(1),
  name: z.string().min(1),
  quantity: z.string().min(1),
  unitName: z.string().min(1),
  unitSymbol: z.string().min(1),
});

// A formula operand is a variable symbol (leaf), a numeric constant literal
// (leaf -- e.g. the "2" inside sqrt(2) when converting RMS<->peak; never a
// physical quantity, so never given a VariableDefinition/unit of its own),
// or a nested FormulaExpression -- this recursion is what lets a
// structured formula represent something like P = I^2 * R (a "square"
// expression nested inside a "multiply" expression) without ever falling
// back to a display string that would have to be parsed to recover
// calculation meaning (design doc §7.1: "a formula family must not rely
// on arbitrary text... as the calculation source of truth").
export type FormulaOperand = string | number | FormulaExpression;
export interface FormulaExpression {
  operation: z.infer<typeof formulaOperationSchema>;
  operands?: FormulaOperand[];
  operand?: FormulaOperand;
  numerator?: FormulaOperand;
  denominator?: FormulaOperand;
  exponent?: number;
}

const formulaOperandSchema: z.ZodType<FormulaOperand> = z.lazy(() =>
  z.union([z.string().min(1), z.number(), formulaExpressionSchema]),
);

const formulaExpressionSchema: z.ZodType<FormulaExpression> = z.lazy(() =>
  z.object({
    operation: formulaOperationSchema,
    operands: z.array(formulaOperandSchema).optional(),
    operand: formulaOperandSchema.optional(),
    numerator: formulaOperandSchema.optional(),
    denominator: formulaOperandSchema.optional(),
    exponent: z.number().optional(),
  }),
);

/**
 * Recursively collects every leaf variable symbol referenced by a formula
 * expression tree. Numeric-literal leaves (e.g. the "2" in sqrt(2)) are
 * constants, not variables, and are deliberately not collected here --
 * they must never resolve against `variables`/`requiredTargets`.
 */
function collectFormulaOperandSymbols(operand: FormulaOperand, out: Set<string>): void {
  if (typeof operand === "number") return;
  if (typeof operand === "string") {
    out.add(operand);
    return;
  }
  operand.operands?.forEach((o) => collectFormulaOperandSymbols(o, out));
  if (operand.operand !== undefined) collectFormulaOperandSymbols(operand.operand, out);
  if (operand.numerator !== undefined) collectFormulaOperandSymbols(operand.numerator, out);
  if (operand.denominator !== undefined) collectFormulaOperandSymbols(operand.denominator, out);
}

export const formulaFormManifestSchema = z.object({
  target: z.string().min(1),
  expression: formulaExpressionSchema,
  instruction: z.string().min(1),
  requiresWorkedExample: z.boolean().default(true),
});

export const formulaFamilyManifestSchema = z.object({
  id: stableId,
  assertionFamilyId: stableId,
  canonicalTarget: z.string().min(1),
  variables: z.array(variableDefinitionManifestSchema).min(1),
  forms: z.array(formulaFormManifestSchema).min(1),
  // The subset of variable symbols that a lesson teaching this family MUST
  // present a form for (design doc §2.3/§7.2's "teach the whole family
  // together" rule). Not every variable needs a form -- e.g. a series/
  // parallel total-resistance formula's individual branch symbols (R1,
  // R2, ...) are not themselves required teaching targets; only the total
  // is. This is what scripts/content/validate-pedagogy.ts's "formula
  // families missing required forms" metric checks against.
  requiredTargets: z.array(z.string().min(1)).min(1),
  mnemonicId: stableId.optional(),
});

// ---------------------------------------------------------------------
// 4. Worked examples and visual/mnemonic aids
// ---------------------------------------------------------------------

export const workedExampleBlueprintManifestSchema = z.object({
  id: stableId,
  formulaFamilyId: stableId,
  target: z.string().min(1),
  knownVariables: z.array(z.string().min(1)).min(1),
  steps: z.array(workedExampleStepSchema).min(1),
});

export const visualAidBlueprintManifestSchema = z.object({
  id: stableId,
  type: z.literal("mnemonic"),
  formulaFamilyId: stableId,
  renderer: z.literal("svg"),
  regions: z.record(z.string().min(1), z.string().min(1)),
  accessibleDescription: z.string().min(1),
});

// ---------------------------------------------------------------------
// 5. Diagram blueprints and family/question-level representation
//    requirements
// ---------------------------------------------------------------------

export const diagramParameterManifestSchema = z.object({
  name: z.string().min(1),
  kind: diagramParameterKindSchema,
  allowed: z.array(z.union([z.string(), z.number(), z.boolean()])).optional(),
  min: z.number().optional(),
  max: z.number().optional(),
});

export const diagramAccessibilityManifestSchema = z.object({
  semanticDescriptionRequired: z.literal(true),
  colourOnlyEncodingProhibited: z.literal(true),
  identifierLabelPattern: z.string().min(1),
});

export const diagramBlueprintManifestSchema = z.object({
  id: stableId,
  type: diagramTypeSchema,
  renderer: z.literal("svg"),
  parameters: z.array(diagramParameterManifestSchema),
  accessibility: diagramAccessibilityManifestSchema,
  valueEmbedding: z.enum(["symbolic_only", "values_when_assessed"]).default("symbolic_only"),
});

export const familyTeachingRepresentationManifestSchema = z.object({
  familyId: stableId,
  representationType: teachingRepresentationTypeSchema,
  requirement: representationRequirementLevelSchema,
  role: representationRoleSchema.optional(),
  diagramBlueprintId: stableId.optional(),
});

// ---------------------------------------------------------------------
// 6. Question blueprints: variant dimensions, parameter generators,
//    answer/marking contracts, evidence targets, question blueprint
// ---------------------------------------------------------------------

export const variantDimensionManifestSchema = z.object({
  allowed: z.array(z.union([z.string(), z.number()])).min(1),
});

export const parameterGeneratorManifestSchema = z.object({
  variable: z.string().min(1),
  min: z.number().optional(),
  max: z.number().optional(),
  constraints: z.array(z.string().min(1)).default([]),
});

export const answerContractManifestSchema = z.object({
  type: answerTypeSchema,
  quantity: z.string().min(1).optional(),
  canonicalUnit: z.string().min(1).optional(),
  options: z.array(z.string().min(1)).optional(),
});

export const markingContractManifestSchema = z.object({
  type: markingTypeSchema,
  tolerancePercent: z.number().positive().optional(),
});

export const misconceptionMappingManifestSchema = z.object({
  misconceptionIdentifier: stableId,
  evidenceStrength: evidenceStrengthSchema,
});

export const questionRepresentationManifestSchema = z.object({
  diagram: z
    .object({
      required: z.boolean(),
      blueprintId: stableId.optional(),
    })
    .optional(),
  formula: z
    .object({
      required: z.boolean(),
      formulaFamilyId: stableId.optional(),
    })
    .optional(),
});

export const evidenceTargetManifestSchema = z.object({
  primaryCapabilityId: stableId,
  familyId: stableId,
  assertionIdentifiers: z.array(stableId).min(1),
  supportingCapabilityIds: z.array(stableId).default([]),
  representationDependency: z.array(z.string().min(1)).default([]),
  misconceptionTargets: z.array(misconceptionMappingManifestSchema).default([]),
});

export const questionBlueprintManifestSchema = z.object({
  id: stableId,
  assertionFamilyId: stableId,
  capabilityId: stableId,
  title: z.string().min(1),
  representation: questionRepresentationManifestSchema.default({}),
  variantDimensions: z.record(z.string().min(1), variantDimensionManifestSchema).default({}),
  parameterGenerators: z.array(parameterGeneratorManifestSchema).default([]),
  answer: answerContractManifestSchema,
  marking: markingContractManifestSchema,
  evidence: evidenceTargetManifestSchema,
  difficultyBand: difficultyBandSchema,
  normalisationNote: z.string().min(1).optional(),
});

// ---------------------------------------------------------------------
// 7. Generated question instance -- schema shape only (CC-05A does not
//    implement generation; CC-05B executes against this shape).
// ---------------------------------------------------------------------

export const generatedQuestionInstanceManifestSchema = z.object({
  blueprintId: stableId,
  blueprintVersion: z.number().int().positive(),
  seed: z.number().int(),
  contentRelease: z.string().min(1),
  parameters: z.record(z.string().min(1), z.union([z.number(), z.string()])),
  expected: z.record(z.string().min(1), z.union([z.number(), z.string()])),
});

// ---------------------------------------------------------------------
// Top-level manifest: structural shape plus cross-reference integrity
// within the pedagogy layer itself. This schema deliberately does NOT
// know whether a given assertionIdentifier/misconceptionIdentifier
// actually exists in a particular domain corpus (e.g. Unit 202) -- that
// cross-manifest check belongs to the content-authoring script that
// imports both this manifest and the knowledge-graph manifest (see
// scripts/content/validate-pedagogy.ts), exactly as generate-seed.ts /
// generate-corpus-review.ts already do for the knowledge graph itself.
// ---------------------------------------------------------------------

export const pedagogyManifestSchema = z
  .object({
    assertionFamilies: z.array(assertionFamilyManifestSchema),
    assertionFamilyMemberships: z.array(assertionFamilyMembershipManifestSchema),
    standaloneAssertions: z.array(standaloneAssertionManifestSchema),
    capabilities: z.array(capabilityManifestSchema),
    familyTeachingRepresentations: z.array(familyTeachingRepresentationManifestSchema),
    formulaFamilies: z.array(formulaFamilyManifestSchema),
    workedExampleBlueprints: z.array(workedExampleBlueprintManifestSchema),
    visualAidBlueprints: z.array(visualAidBlueprintManifestSchema),
    diagramBlueprints: z.array(diagramBlueprintManifestSchema),
    questionBlueprints: z.array(questionBlueprintManifestSchema),
  })
  .superRefine((manifest, ctx) => {
    const issue = (message: string, path: (string | number)[]) =>
      ctx.addIssue({ code: "custom", message, path });

    const familyIds = new Set(manifest.assertionFamilies.map((f) => f.id));
    const capabilityIds = new Set(manifest.capabilities.map((c) => c.id));
    const formulaFamilyIds = new Set(manifest.formulaFamilies.map((f) => f.id));
    const diagramBlueprintIds = new Set(manifest.diagramBlueprints.map((d) => d.id));

    // ---- duplicate stable-identifier checks -----------------------------
    const duplicateCheck = (label: string, values: readonly string[], path: string) => {
      const seen = new Set<string>();
      values.forEach((value, i) => {
        if (seen.has(value)) issue(`duplicate ${label} ${value}`, [path, i]);
        seen.add(value);
      });
    };
    duplicateCheck("assertion family id", manifest.assertionFamilies.map((f) => f.id), "assertionFamilies");
    duplicateCheck("capability id", manifest.capabilities.map((c) => c.id), "capabilities");
    duplicateCheck("formula family id", manifest.formulaFamilies.map((f) => f.id), "formulaFamilies");
    duplicateCheck("diagram blueprint id", manifest.diagramBlueprints.map((d) => d.id), "diagramBlueprints");
    duplicateCheck("question blueprint id", manifest.questionBlueprints.map((q) => q.id), "questionBlueprints");
    duplicateCheck(
      "worked example blueprint id",
      manifest.workedExampleBlueprints.map((w) => w.id),
      "workedExampleBlueprints",
    );
    duplicateCheck(
      "visual aid blueprint id",
      manifest.visualAidBlueprints.map((v) => v.id),
      "visualAidBlueprints",
    );

    // ---- family membership integrity -------------------------------------
    manifest.assertionFamilyMemberships.forEach((m, i) => {
      if (!familyIds.has(m.familyId)) {
        issue(`membership references unknown family ${m.familyId}`, [
          "assertionFamilyMemberships",
          i,
          "familyId",
        ]);
      }
    });

    const assertionsWithFamily = new Set(
      manifest.assertionFamilyMemberships.map((m) => m.assertionIdentifier),
    );
    const standaloneAssertionIds = new Set(
      manifest.standaloneAssertions.map((s) => s.assertionIdentifier),
    );
    manifest.standaloneAssertions.forEach((s, i) => {
      if (assertionsWithFamily.has(s.assertionIdentifier)) {
        issue(
          `${s.assertionIdentifier} is classified standalone but also has family membership`,
          ["standaloneAssertions", i, "assertionIdentifier"],
        );
      }
    });
    manifest.assertionFamilyMemberships.forEach((m, i) => {
      if (standaloneAssertionIds.has(m.assertionIdentifier)) {
        issue(
          `${m.assertionIdentifier} has family membership but is also classified standalone`,
          ["assertionFamilyMemberships", i, "assertionIdentifier"],
        );
      }
    });

    // ---- capability integrity ---------------------------------------------
    manifest.capabilities.forEach((c, i) => {
      if (!familyIds.has(c.familyId)) {
        issue(`capability ${c.id} references unknown family ${c.familyId}`, [
          "capabilities",
          i,
          "familyId",
        ]);
      }
    });

    manifest.assertionFamilies.forEach((f, i) => {
      f.completeness.requiredCapabilityIds.forEach((capId, j) => {
        if (!capabilityIds.has(capId)) {
          issue(
            `family ${f.id} completeness references unknown capability ${capId}`,
            ["assertionFamilies", i, "completeness", "requiredCapabilityIds", j],
          );
        }
      });
    });

    // ---- formula family integrity ------------------------------------------
    manifest.formulaFamilies.forEach((ff, i) => {
      if (!familyIds.has(ff.assertionFamilyId)) {
        issue(
          `formula family ${ff.id} references unknown assertion family ${ff.assertionFamilyId}`,
          ["formulaFamilies", i, "assertionFamilyId"],
        );
      }
      const symbols = new Set(ff.variables.map((v) => v.symbol));
      if (!symbols.has(ff.canonicalTarget)) {
        issue(
          `formula family ${ff.id} canonicalTarget ${ff.canonicalTarget} is not a defined variable`,
          ["formulaFamilies", i, "canonicalTarget"],
        );
      }
      const formTargets = new Set<string>();
      ff.forms.forEach((form, j) => {
        formTargets.add(form.target);
        if (!symbols.has(form.target)) {
          issue(
            `formula family ${ff.id} form target ${form.target} is not a defined variable`,
            ["formulaFamilies", i, "forms", j, "target"],
          );
        }
        const referenced = new Set<string>();
        collectFormulaOperandSymbols(form.expression, referenced);
        referenced.forEach((symbol) => {
          if (!symbols.has(symbol)) {
            issue(
              `formula family ${ff.id} form ${form.target} expression references undefined variable ${symbol}`,
              ["formulaFamilies", i, "forms", j, "expression"],
            );
          }
        });
      });
      // Every declared required teaching target must actually have a form
      // -- this is the structural check behind design-doc §2.3/§7.2's "all
      // required rearrangements taught together" rule.
      ff.requiredTargets.forEach((target, j) => {
        if (!symbols.has(target)) {
          issue(
            `formula family ${ff.id} requiredTargets[${j}] (${target}) is not a defined variable`,
            ["formulaFamilies", i, "requiredTargets", j],
          );
        } else if (!formTargets.has(target)) {
          issue(
            `formula family ${ff.id} requires teaching target ${target} but has no form solving for it`,
            ["formulaFamilies", i, "requiredTargets", j],
          );
        }
      });
      if (ff.mnemonicId && !manifest.visualAidBlueprints.some((v) => v.id === ff.mnemonicId)) {
        issue(`formula family ${ff.id} references unknown mnemonic ${ff.mnemonicId}`, [
          "formulaFamilies",
          i,
          "mnemonicId",
        ]);
      }
    });

    // ---- worked example / visual aid integrity ------------------------------
    manifest.workedExampleBlueprints.forEach((w, i) => {
      const ff = manifest.formulaFamilies.find((f) => f.id === w.formulaFamilyId);
      if (!ff) {
        issue(
          `worked example ${w.id} references unknown formula family ${w.formulaFamilyId}`,
          ["workedExampleBlueprints", i, "formulaFamilyId"],
        );
        return;
      }
      if (!ff.forms.some((form) => form.target === w.target)) {
        issue(
          `worked example ${w.id} targets ${w.target}, which formula family ${ff.id} has no form for`,
          ["workedExampleBlueprints", i, "target"],
        );
      }
    });

    manifest.visualAidBlueprints.forEach((v, i) => {
      if (!formulaFamilyIds.has(v.formulaFamilyId)) {
        issue(
          `visual aid ${v.id} references unknown formula family ${v.formulaFamilyId}`,
          ["visualAidBlueprints", i, "formulaFamilyId"],
        );
      }
    });

    // ---- family teaching representation integrity ----------------------------
    manifest.familyTeachingRepresentations.forEach((r, i) => {
      if (!familyIds.has(r.familyId)) {
        issue(
          `family teaching representation references unknown family ${r.familyId}`,
          ["familyTeachingRepresentations", i, "familyId"],
        );
      }
      if (r.diagramBlueprintId && !diagramBlueprintIds.has(r.diagramBlueprintId)) {
        issue(
          `family teaching representation for ${r.familyId} references unknown diagram blueprint ${r.diagramBlueprintId}`,
          ["familyTeachingRepresentations", i, "diagramBlueprintId"],
        );
      }
      if (r.requirement === "required" && !r.diagramBlueprintId && r.representationType === "technical_diagram") {
        issue(
          `family ${r.familyId} marks a technical_diagram representation required but names no diagram blueprint`,
          ["familyTeachingRepresentations", i, "diagramBlueprintId"],
        );
      }
    });

    // ---- question blueprint integrity ----------------------------------------
    manifest.questionBlueprints.forEach((q, i) => {
      if (!familyIds.has(q.assertionFamilyId)) {
        issue(`question blueprint ${q.id} references unknown family ${q.assertionFamilyId}`, [
          "questionBlueprints",
          i,
          "assertionFamilyId",
        ]);
      }
      if (!capabilityIds.has(q.capabilityId)) {
        issue(`question blueprint ${q.id} references unknown capability ${q.capabilityId}`, [
          "questionBlueprints",
          i,
          "capabilityId",
        ]);
      }
      if (q.representation.diagram?.required && !q.representation.diagram.blueprintId) {
        issue(`question blueprint ${q.id} requires a diagram but names no blueprint`, [
          "questionBlueprints",
          i,
          "representation",
          "diagram",
          "blueprintId",
        ]);
      }
      if (
        q.representation.diagram?.blueprintId &&
        !diagramBlueprintIds.has(q.representation.diagram.blueprintId)
      ) {
        issue(
          `question blueprint ${q.id} references unknown diagram blueprint ${q.representation.diagram.blueprintId}`,
          ["questionBlueprints", i, "representation", "diagram", "blueprintId"],
        );
      }
      if (
        q.representation.formula?.formulaFamilyId &&
        !formulaFamilyIds.has(q.representation.formula.formulaFamilyId)
      ) {
        issue(
          `question blueprint ${q.id} references unknown formula family ${q.representation.formula.formulaFamilyId}`,
          ["questionBlueprints", i, "representation", "formula", "formulaFamilyId"],
        );
      }
      if (q.evidence.familyId !== q.assertionFamilyId) {
        issue(
          `question blueprint ${q.id} evidence.familyId does not match its own assertionFamilyId`,
          ["questionBlueprints", i, "evidence", "familyId"],
        );
      }
      if (q.evidence.primaryCapabilityId !== q.capabilityId) {
        issue(
          `question blueprint ${q.id} evidence.primaryCapabilityId does not match its own capabilityId`,
          ["questionBlueprints", i, "evidence", "primaryCapabilityId"],
        );
      }
    });
  });

export type AssertionFamily = z.infer<typeof assertionFamilyManifestSchema>;
export type AssertionFamilyMembership = z.infer<typeof assertionFamilyMembershipManifestSchema>;
export type StandaloneAssertion = z.infer<typeof standaloneAssertionManifestSchema>;
export type Capability = z.infer<typeof capabilityManifestSchema>;
export type FormulaFamily = z.infer<typeof formulaFamilyManifestSchema>;
export type FormulaForm = z.infer<typeof formulaFormManifestSchema>;
export type VariableDefinition = z.infer<typeof variableDefinitionManifestSchema>;
export type WorkedExampleBlueprint = z.infer<typeof workedExampleBlueprintManifestSchema>;
export type VisualAidBlueprint = z.infer<typeof visualAidBlueprintManifestSchema>;
export type DiagramBlueprint = z.infer<typeof diagramBlueprintManifestSchema>;
export type FamilyTeachingRepresentation = z.infer<typeof familyTeachingRepresentationManifestSchema>;
export type QuestionBlueprint = z.infer<typeof questionBlueprintManifestSchema>;
export type VariantDimension = z.infer<typeof variantDimensionManifestSchema>;
export type ParameterGenerator = z.infer<typeof parameterGeneratorManifestSchema>;
export type AnswerContract = z.infer<typeof answerContractManifestSchema>;
export type MarkingContract = z.infer<typeof markingContractManifestSchema>;
export type MisconceptionMapping = z.infer<typeof misconceptionMappingManifestSchema>;
export type EvidenceTarget = z.infer<typeof evidenceTargetManifestSchema>;
export type GeneratedQuestionInstance = z.infer<typeof generatedQuestionInstanceManifestSchema>;
export type PedagogyManifest = z.infer<typeof pedagogyManifestSchema>;
