/**
 * CC-05A: mechanical validation/coverage report for the pedagogical
 * backfill (scripts/content/data/cc05a-pedagogy-unit202.ts) against the
 * real CC-04/CC-04A/CC-04B corpus manifest
 * (scripts/content/data/cc04-unit202-electrical-science.ts).
 *
 * This never trusts the pedagogy manifest's own claims about the corpus
 * -- every count below is independently recomputed from the two real
 * manifests, the same discipline the CC-04N-S/S1 security audit gate
 * uses for dependency-path drift (never trust a record's own field as
 * fact; recompute from the live source).
 *
 * Usage:
 *   node scripts/content/validate-pedagogy.ts            (print report)
 *   node scripts/content/validate-pedagogy.ts --check     (exit 1 if any
 *     gate metric is non-zero; used by `npm run content:pedagogy:check`)
 */

import { fileURLToPath } from "node:url";

import { knowledgeGraphManifestSchema, pedagogyManifestSchema } from "@alp/content-schema";

import { cc04Unit202ElectricalScience } from "./data/cc04-unit202-electrical-science.ts";
import { cc05aPedagogyUnit202 } from "./data/cc05a-pedagogy-unit202.ts";

interface CoverageReport {
  totalAssertionFamilies: number;
  totalMemberships: number;
  assertionsWithFamily: number;
  standaloneAssertions: number;
  totalCorpusAssertions: number;
  unclassifiedLearnerAssertions: string[];
  formulaFamilies: number;
  formulaFamiliesMissingRequiredForms: string[];
  familiesRequiringDiagrams: number;
  diagramBlueprints: number;
  unresolvedRequiredDiagramReferences: string[];
  learnerAssessableFamilies: number;
  teachingOnlyFamilies: number;
  questionBlueprints: number;
  assessableFamiliesWithZeroQuestionBlueprints: string[];
  requiredCapabilitiesWithoutCoverage: string[];
  capabilitiesMissingFromFamilyCompleteness: string[];
}

// CC-09G (task section 4): a general invariant, not a brittle Unit-202-
// only list -- "a capability representing REQUIRED curriculum/assessment
// knowledge must either (1) participate in the relevant family's mastery
// completeness, or (2) be explicitly marked non-required/optional with a
// governed rationale." Every governed Capability already declares its own
// familyId; a capability whose family never lists it in
// `completeness.requiredCapabilityIds` can silently reach a family-secure
// mastery state without that capability ever having been assessed --
// exactly the CC-09G-discovered defect shape (mechanics/magnetism/emf/
// ac_reactive each had a real, governed, evidence-backed capability
// omitted from completeness). The escape hatch for a genuinely optional
// capability is this explicit, individually-commented allow-list -- never
// silent exclusion. Empty as of CC-09G: every currently governed
// capability is required by its own family.
const NON_REQUIRED_CAPABILITY_IDS: ReadonlySet<string> = new Set([
  // e.g. "cap.example.optional_extra", // governed rationale: ...
]);

function buildReport(): CoverageReport {
  const corpus = knowledgeGraphManifestSchema.parse(cc04Unit202ElectricalScience);
  const pedagogy = pedagogyManifestSchema.parse(cc05aPedagogyUnit202);

  const corpusAssertionIds = new Set(corpus.assertions.map((a) => a.identifier));

  const membershipAssertionIds = new Set(pedagogy.assertionFamilyMemberships.map((m) => m.assertionIdentifier));
  const standaloneAssertionIds = new Set(pedagogy.standaloneAssertions.map((s) => s.assertionIdentifier));

  const unclassifiedLearnerAssertions = [...corpusAssertionIds].filter(
    (id) => !membershipAssertionIds.has(id) && !standaloneAssertionIds.has(id),
  );

  // Formula families: independently recompute "missing required forms"
  // rather than trusting the manifest's own internal consistency (the
  // Zod schema already enforces this structurally, but this script's job
  // is to prove it, not assume it).
  const formulaFamiliesMissingRequiredForms: string[] = [];
  for (const ff of pedagogy.formulaFamilies) {
    const formTargets = new Set(ff.forms.map((f) => f.target));
    const missing = ff.requiredTargets.filter((t) => !formTargets.has(t));
    if (missing.length > 0) {
      formulaFamiliesMissingRequiredForms.push(`${ff.id} missing forms for: ${missing.join(", ")}`);
    }
  }

  // Diagram requirements: recompute from familyTeachingRepresentations
  // (family-level, design doc §11.1) and questionBlueprints.representation
  // (question-level, §11.2) independently, cross-checked against the
  // real diagramBlueprints array.
  const diagramBlueprintIds = new Set(pedagogy.diagramBlueprints.map((d) => d.id));
  const unresolvedRequiredDiagramReferences: string[] = [];

  const familiesRequiringDiagramIds = new Set<string>();
  for (const rep of pedagogy.familyTeachingRepresentations) {
    if (rep.representationType !== "technical_diagram" || rep.requirement !== "required") continue;
    familiesRequiringDiagramIds.add(rep.familyId);
    if (!rep.diagramBlueprintId || !diagramBlueprintIds.has(rep.diagramBlueprintId)) {
      unresolvedRequiredDiagramReferences.push(
        `family teaching representation for ${rep.familyId} (required technical_diagram)`,
      );
    }
  }
  for (const q of pedagogy.questionBlueprints) {
    if (!q.representation.diagram?.required) continue;
    const blueprintId = q.representation.diagram.blueprintId;
    if (!blueprintId || !diagramBlueprintIds.has(blueprintId)) {
      unresolvedRequiredDiagramReferences.push(`question blueprint ${q.id} (required diagram)`);
    }
  }

  const assessableFamilies = pedagogy.assertionFamilies.filter((f) => f.assessmentRequirement === "assessable");
  const teachingOnlyFamilies = pedagogy.assertionFamilies.filter((f) => f.assessmentRequirement === "teaching_only");

  const blueprintsByFamily = new Map<string, number>();
  for (const q of pedagogy.questionBlueprints) {
    blueprintsByFamily.set(q.assertionFamilyId, (blueprintsByFamily.get(q.assertionFamilyId) ?? 0) + 1);
  }
  const assessableFamiliesWithZeroQuestionBlueprints = assessableFamilies
    .filter((f) => !blueprintsByFamily.get(f.id))
    .map((f) => f.id);

  // Required-capability coverage: a capability is "covered" if it is the
  // primary capability of at least one question blueprint, OR appears in
  // at least one blueprint's supportingCapabilityIds -- both are genuine
  // assessment paths (design doc §27's supporting-capability model).
  const coveredCapabilityIds = new Set<string>();
  for (const q of pedagogy.questionBlueprints) {
    coveredCapabilityIds.add(q.capabilityId);
    for (const supporting of q.evidence.supportingCapabilityIds) coveredCapabilityIds.add(supporting);
  }
  const requiredCapabilitiesWithoutCoverage: string[] = [];
  for (const family of assessableFamilies) {
    for (const capId of family.completeness.requiredCapabilityIds) {
      if (!coveredCapabilityIds.has(capId)) {
        requiredCapabilitiesWithoutCoverage.push(`${family.id}: ${capId}`);
      }
    }
  }

  // CC-09G (task section 4): the inverse direction -- every capability
  // must participate in its own family's completeness, or be explicitly
  // allow-listed above with a governed rationale. Applies to every family
  // (assessable AND teaching_only): a teaching-only family's completeness
  // still governs its family-mastery-security derivation (evidence-
  // engine), independent of whether question blueprints exist yet.
  const familiesById = new Map(pedagogy.assertionFamilies.map((f) => [f.id, f]));
  const capabilitiesMissingFromFamilyCompleteness: string[] = [];
  for (const capability of pedagogy.capabilities) {
    if (NON_REQUIRED_CAPABILITY_IDS.has(capability.id)) continue;
    const family = familiesById.get(capability.familyId);
    if (!family) continue; // dangling familyId is a separate schema-level concern
    if (!family.completeness.requiredCapabilityIds.includes(capability.id)) {
      capabilitiesMissingFromFamilyCompleteness.push(`${family.id}: ${capability.id}`);
    }
  }

  return {
    totalAssertionFamilies: pedagogy.assertionFamilies.length,
    totalMemberships: pedagogy.assertionFamilyMemberships.length,
    assertionsWithFamily: membershipAssertionIds.size,
    standaloneAssertions: standaloneAssertionIds.size,
    totalCorpusAssertions: corpusAssertionIds.size,
    unclassifiedLearnerAssertions,
    formulaFamilies: pedagogy.formulaFamilies.length,
    formulaFamiliesMissingRequiredForms,
    familiesRequiringDiagrams: familiesRequiringDiagramIds.size,
    diagramBlueprints: pedagogy.diagramBlueprints.length,
    unresolvedRequiredDiagramReferences,
    learnerAssessableFamilies: assessableFamilies.length,
    teachingOnlyFamilies: teachingOnlyFamilies.length,
    questionBlueprints: pedagogy.questionBlueprints.length,
    assessableFamiliesWithZeroQuestionBlueprints,
    requiredCapabilitiesWithoutCoverage,
    capabilitiesMissingFromFamilyCompleteness,
  };
}

function formatReport(report: CoverageReport): string {
  const lines: string[] = [];
  lines.push("CC-05A pedagogical backfill coverage report");
  lines.push("=============================================");
  lines.push(`Total assertion families: ${report.totalAssertionFamilies} (${report.learnerAssessableFamilies} assessable, ${report.teachingOnlyFamilies} teaching-only)`);
  lines.push(`Total family memberships: ${report.totalMemberships}`);
  lines.push(`Corpus assertions: ${report.totalCorpusAssertions}`);
  lines.push(`  - with family membership: ${report.assertionsWithFamily}`);
  lines.push(`  - standalone by design: ${report.standaloneAssertions}`);
  lines.push(`  - UNCLASSIFIED (target 0): ${report.unclassifiedLearnerAssertions.length}`);
  if (report.unclassifiedLearnerAssertions.length) lines.push(`    ${report.unclassifiedLearnerAssertions.join(", ")}`);
  lines.push(`Formula families: ${report.formulaFamilies}`);
  lines.push(`  - missing required forms (target 0): ${report.formulaFamiliesMissingRequiredForms.length}`);
  if (report.formulaFamiliesMissingRequiredForms.length) lines.push(`    ${report.formulaFamiliesMissingRequiredForms.join("; ")}`);
  lines.push(`Families requiring a diagram: ${report.familiesRequiringDiagrams}`);
  lines.push(`Diagram blueprints: ${report.diagramBlueprints}`);
  lines.push(`  - unresolved required diagram references (target 0): ${report.unresolvedRequiredDiagramReferences.length}`);
  if (report.unresolvedRequiredDiagramReferences.length) lines.push(`    ${report.unresolvedRequiredDiagramReferences.join("; ")}`);
  lines.push(`Question blueprints: ${report.questionBlueprints}`);
  lines.push(`  - assessable families with zero blueprints (target 0): ${report.assessableFamiliesWithZeroQuestionBlueprints.length}`);
  if (report.assessableFamiliesWithZeroQuestionBlueprints.length) lines.push(`    ${report.assessableFamiliesWithZeroQuestionBlueprints.join(", ")}`);
  lines.push(`  - required capabilities without assessment coverage (target 0): ${report.requiredCapabilitiesWithoutCoverage.length}`);
  if (report.requiredCapabilitiesWithoutCoverage.length) lines.push(`    ${report.requiredCapabilitiesWithoutCoverage.join("; ")}`);
  lines.push(`  - capabilities missing from their own family's completeness (target 0): ${report.capabilitiesMissingFromFamilyCompleteness.length}`);
  if (report.capabilitiesMissingFromFamilyCompleteness.length) lines.push(`    ${report.capabilitiesMissingFromFamilyCompleteness.join("; ")}`);
  return lines.join("\n");
}

export function isReportClean(report: CoverageReport): boolean {
  return (
    report.unclassifiedLearnerAssertions.length === 0 &&
    report.formulaFamiliesMissingRequiredForms.length === 0 &&
    report.unresolvedRequiredDiagramReferences.length === 0 &&
    report.assessableFamiliesWithZeroQuestionBlueprints.length === 0 &&
    report.requiredCapabilitiesWithoutCoverage.length === 0 &&
    report.capabilitiesMissingFromFamilyCompleteness.length === 0
  );
}

export { buildReport, formatReport };
export type { CoverageReport };

function isMainModule(): boolean {
  const entryPoint = process.argv[1];
  if (!entryPoint) return false;
  return fileURLToPath(import.meta.url) === entryPoint;
}

if (isMainModule()) {
  const report = buildReport();
  console.log(formatReport(report));
  const clean = isReportClean(report);
  console.log("");
  console.log(clean ? "PASS: all coverage gates are zero." : "FAIL: one or more coverage gates are non-zero.");
  if (process.argv.includes("--check") && !clean) {
    process.exit(1);
  }
}
