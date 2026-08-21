/**
 * CC-04A/CC-04B: generates a human-reviewable inventory of the Unit 202
 * proving-slice corpus -- one entry per assertion with its statement,
 * version/status, direct prerequisites, curriculum mapping(s) and
 * provenance, plus any misconception links -- and summary sections
 * (Electrical coverage per Learning Outcome/Assessment Criterion,
 * Foundational Maths/Physics used-vs-not-currently-used, provenance
 * source/rights distribution, graph health, OpenStax licence evidence).
 * This is development/review evidence (not a learner-facing artefact),
 * generated deterministically from the same manifest
 * scripts/content/generate-seed.ts compiles to SQL, so it never drifts
 * from the actual seeded content.
 *
 * Usage: node scripts/content/generate-corpus-review.ts
 */

import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { knowledgeGraphManifestSchema, type KnowledgeGraphManifest } from "@alp/content-schema";

import { cc04Unit202ElectricalScience } from "./data/cc04-unit202-electrical-science.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, "..", "..");
const OUTPUT_FILE = "scripts/content/evidence/cc04-unit202-corpus-review.md";

function buildReport(manifest: KnowledgeGraphManifest): string {
  const sourceTitleBySourceKey = new Map(manifest.sources.map((s) => [s.key, s.title]));
  const sourceKeyBySourceVersionKey = new Map(
    manifest.sourceVersions.map((sv) => [sv.key, sv.sourceKey]),
  );
  const sourceVersionKeyByLocatorKey = new Map(
    manifest.sourceLocators.map((sl) => [sl.key, sl.sourceVersionKey]),
  );
  const locatorSummaryByKey = new Map(
    manifest.sourceLocators.map((sl) => [sl.key, sl.locatorSummary]),
  );
  const nodeTitleByKey = new Map(manifest.curriculumNodes.map((n) => [n.key, n.title]));

  const sourceTitleForLocator = (locatorKey: string): string => {
    const svKey = sourceVersionKeyByLocatorKey.get(locatorKey);
    const srcKey = svKey ? sourceKeyBySourceVersionKey.get(svKey) : undefined;
    return (srcKey ? sourceTitleBySourceKey.get(srcKey) : undefined) ?? "(unknown source)";
  };

  const prereqsOf = new Map<string, string[]>();
  const dependentsOf = new Map<string, string[]>();
  for (const r of manifest.assertionRelationships) {
    if (r.relationshipType === "PREREQUISITE_OF") {
      const list = prereqsOf.get(r.toIdentifier) ?? [];
      list.push(`${r.fromIdentifier}${r.strength ? ` (${r.strength})` : ""}`);
      prereqsOf.set(r.toIdentifier, list);

      const dep = dependentsOf.get(r.fromIdentifier) ?? [];
      dep.push(r.toIdentifier);
      dependentsOf.set(r.fromIdentifier, dep);
    }
  }

  const mappingsFor = new Map<string, string[]>();
  for (const m of manifest.assertionCurriculumMappings) {
    const list = mappingsFor.get(m.assertionIdentifier) ?? [];
    list.push(`${nodeTitleByKey.get(m.curriculumNodeKey) ?? m.curriculumNodeKey} (${m.mappingType})`);
    mappingsFor.set(m.assertionIdentifier, list);
  }

  const provenanceFor = new Map<string, string[]>();
  for (const p of manifest.assertionProvenanceLinks) {
    const list = provenanceFor.get(p.assertionIdentifier) ?? [];
    list.push(`${sourceTitleForLocator(p.sourceLocatorKey)} — ${locatorSummaryByKey.get(p.sourceLocatorKey) ?? p.sourceLocatorKey} [${p.provenanceRole}]`);
    provenanceFor.set(p.assertionIdentifier, list);
  }

  const misconceptionsFor = new Map<string, string[]>();
  for (const c of manifest.misconceptionConflicts) {
    const list = misconceptionsFor.get(c.assertionIdentifier) ?? [];
    list.push(c.misconceptionIdentifier);
    misconceptionsFor.set(c.assertionIdentifier, list);
  }

  const versionFor = new Map(
    manifest.assertionVersions.map((v) => [v.assertionIdentifier, v]),
  );
  const domainFor = new Map(manifest.assertions.map((a) => [a.identifier, a.domainCode]));

  // Downstream reachability (via PREREQUISITE_OF only) -- used to report
  // which Foundational Maths/Physics assertions currently reach an
  // Electrical target versus remain retained for future reuse (CC-04B:
  // this is informational, not a defect, per explicit Product Owner
  // direction).
  const reachesElectrical = (start: string): boolean => {
    const seen = new Set<string>();
    const stack = [start];
    while (stack.length) {
      const current = stack.pop()!;
      for (const r of manifest.assertionRelationships) {
        if (r.relationshipType !== "PREREQUISITE_OF" || r.fromIdentifier !== current) continue;
        if (domainFor.get(r.toIdentifier) === "EL") return true;
        if (!seen.has(r.toIdentifier)) {
          seen.add(r.toIdentifier);
          stack.push(r.toIdentifier);
        }
      }
    }
    return false;
  };

  const nodeByKey = new Map(manifest.curriculumNodes.map((n) => [n.key, n]));
  const acCoverage = new Map<string, number>();
  for (const m of manifest.assertionCurriculumMappings) {
    if (domainFor.get(m.assertionIdentifier) !== "EL") continue;
    const node = nodeByKey.get(m.curriculumNodeKey);
    if (!node) continue;
    acCoverage.set(node.title, (acCoverage.get(node.title) ?? 0) + 1);
  }

  const relTypeCounts = new Map<string, number>();
  for (const r of manifest.assertionRelationships) {
    relTypeCounts.set(r.relationshipType, (relTypeCounts.get(r.relationshipType) ?? 0) + 1);
  }

  const rightsDistribution = new Map<string, number>();
  for (const sv of manifest.sourceVersions) {
    rightsDistribution.set(sv.rightsClassification, (rightsDistribution.get(sv.rightsClassification) ?? 0) + 1);
  }

  const usedFoundational: string[] = [];
  const unusedFoundational: string[] = [];
  for (const a of manifest.assertions) {
    if (a.domainCode !== "FM" && a.domainCode !== "FP") continue;
    (reachesElectrical(a.identifier) ? usedFoundational : unusedFoundational).push(a.identifier);
  }

  const lines: string[] = [];
  lines.push("# CC-04B Unit 202 proving-slice corpus review");
  lines.push("");
  lines.push("Generated deterministically by `scripts/content/generate-corpus-review.ts` from");
  lines.push("`scripts/content/data/cc04-unit202-electrical-science.ts` -- the same manifest");
  lines.push("`scripts/content/generate-seed.ts` compiles to SQL. Development/review evidence");
  lines.push("only, never rendered to learners. Regenerate with:");
  lines.push("`node scripts/content/generate-corpus-review.ts`.");
  lines.push("");
  lines.push(`Total assertions: ${manifest.assertions.length}`);
  for (const d of manifest.domains) {
    const count = manifest.assertions.filter((a) => a.domainCode === d.code).length;
    lines.push(`- ${d.name} (${d.code}): ${count}`);
  }
  lines.push("");
  lines.push(
    "The Electrical count is the CC-04B Product-Owner-approved target (140-160, ~150). " +
      "Foundational Maths/Physics are additional reusable horizontal knowledge and do not " +
      "count toward that target.",
  );
  lines.push("");

  lines.push("## Electrical coverage per Assessment Criterion");
  lines.push("");
  lines.push("| Assessment Criterion | Mapped Electrical assertions |");
  lines.push("|---|---|");
  for (const [title, count] of [...acCoverage.entries()].sort()) {
    lines.push(`| ${title} | ${count} |`);
  }
  lines.push("");

  lines.push("## Foundational Maths/Physics: used vs currently-unused-but-retained");
  lines.push("");
  lines.push(
    `${usedFoundational.length} of ${usedFoundational.length + unusedFoundational.length} Foundational ` +
      "assertions currently reach an Electrical target via PREREQUISITE_OF; the remainder are " +
      "retained as coherent, atomic, properly-sourced, non-speculative reusable horizontal " +
      "knowledge for future Unit 202 expansion, other electrical qualifications, or other " +
      "vocational verticals -- per explicit Product Owner direction, this is not treated as a defect.",
  );
  lines.push("");
  lines.push(`**Currently used (${usedFoundational.length}):** ${usedFoundational.sort().join(", ")}`);
  lines.push("");
  lines.push(`**Currently unused but retained (${unusedFoundational.length}):** ${unusedFoundational.sort().join(", ")}`);
  lines.push("");

  lines.push("## Provenance source / rights distribution");
  lines.push("");
  lines.push(
    "Verification columns per ADR-0002 -- Verified/By/Fingerprint reflect the governed " +
      "`sourceVersion` record mechanically, never hand-typed here. UNVERIFIED means exactly " +
      "that: identifiable and usable as an authoring source, but not yet independently " +
      "confirmed against the actual artefact by a verifier distinct from the authoring model.",
  );
  lines.push("");
  lines.push("| Source | Rights classification | Verification | Verified by | Fingerprint |");
  lines.push("|---|---|---|---|---|");
  for (const s of manifest.sources) {
    const sv = manifest.sourceVersions.find((v) => v.sourceKey === s.key);
    lines.push(
      `| ${s.title} | ${sv?.rightsClassification ?? "(unknown)"} | ${sv?.verificationStatus ?? "UNVERIFIED"} | ${sv?.verifiedBy ?? "(none)"} | ${sv?.contentFingerprintSha256 ? "present" : "absent"} |`,
    );
  }
  lines.push("");
  lines.push("Rights distribution: " + [...rightsDistribution.entries()].map(([k, v]) => `${k}: ${v}`).join(", "));
  lines.push("");

  lines.push("## OpenStax exact-book licence evidence (CC-04B hard requirement)");
  lines.push("");
  lines.push(
    "Re-verified directly from each book's own copyright page (not assumed from a generic " +
      "OpenStax licensing page, a search summary, or the other volume):",
  );
  lines.push("");
  lines.push("| Book | Edition/date | Licence (verbatim, on-page) | Commercial use | ShareAlike | Attribution | Final classification |");
  lines.push("|---|---|---|---|---|---|---|");
  lines.push(
    "| University Physics Volume 1 (Moebs/Ling/Sanny) | 1st edition, 19 Sept 2016 | " +
      '"This book uses the Creative Commons Attribution-NonCommercial-ShareAlike License" ' +
      "(licence URL http://creativecommons.org/licenses/by-nc-sa/4.0/ confirmed on-page) | " +
      "No (NonCommercial) | Yes | Yes | PUBLIC_RESTRICTED |",
  );
  lines.push(
    "| University Physics Volume 2 (OpenStax/Rice University) | 1st edition, 6 Oct 2016 | " +
      '"Creative Commons Attribution-NonCommercial-ShareAlike License" (CC BY-NC-SA 4.0), ' +
      "independently re-confirmed on a second fetch | No (NonCommercial) | Yes | Yes | PUBLIC_RESTRICTED |",
  );
  lines.push("");

  lines.push("## Graph health");
  lines.push("");
  lines.push(`- Total relationships: ${manifest.assertionRelationships.length}`);
  for (const [type, count] of [...relTypeCounts.entries()].sort()) {
    lines.push(`  - ${type}: ${count}`);
  }
  lines.push(`- Misconceptions: ${manifest.misconceptions.length}; conflict links: ${manifest.misconceptionConflicts.length}`);
  lines.push(`- Curriculum mappings: ${manifest.assertionCurriculumMappings.length}`);
  lines.push(
    "- Self edges, duplicate edges, unintended prerequisite cycles, broken relationship " +
      "targets, unmapped Electrical assertions and approved-versions-without-provenance: all " +
      "mechanically proven 0 -- see supabase/tests/database/10_unit202_knowledge_graph.sql " +
      "and the CC-04B completion report for the live query evidence.",
  );
  lines.push("");

  for (const domain of manifest.domains) {
    lines.push(`## ${domain.name} (${domain.code})`);
    lines.push("");
    for (const a of manifest.assertions.filter((x) => x.domainCode === domain.code)) {
      const v = versionFor.get(a.identifier)!;
      lines.push(`### ${a.identifier}`);
      lines.push("");
      lines.push(`**Statement (v${v.version}, ${v.status}):** ${v.statement}`);
      lines.push("");
      const prereqs = prereqsOf.get(a.identifier) ?? [];
      lines.push(`**Direct prerequisites:** ${prereqs.length ? prereqs.join("; ") : "(none — root assertion)"}`);
      const deps = dependentsOf.get(a.identifier) ?? [];
      lines.push(`**Direct dependents:** ${deps.length ? deps.join("; ") : "(none — leaf capability)"}`);
      const mappings = mappingsFor.get(a.identifier) ?? [];
      if (mappings.length) lines.push(`**Curriculum mapping(s):** ${mappings.join("; ")}`);
      const prov = provenanceFor.get(a.identifier) ?? [];
      lines.push(`**Provenance:** ${prov.join(" | ")}`);
      const mis = misconceptionsFor.get(a.identifier) ?? [];
      if (mis.length) lines.push(`**Misconceptions targeting this assertion:** ${mis.join(", ")}`);
      lines.push("");
    }
  }

  lines.push("## Misconceptions");
  lines.push("");
  for (const m of manifest.misconceptions) {
    const conflicts = manifest.misconceptionConflicts
      .filter((c) => c.misconceptionIdentifier === m.identifier)
      .map((c) => c.assertionIdentifier);
    lines.push(`### ${m.identifier}`);
    lines.push("");
    lines.push(m.description);
    lines.push("");
    lines.push(`**Conflicts with:** ${conflicts.join(", ")}`);
    lines.push("");
  }

  return lines.join("\n") + "\n";
}

const result = knowledgeGraphManifestSchema.safeParse(cc04Unit202ElectricalScience);
if (!result.success) {
  throw new Error(`manifest failed validation: ${result.error.message}`);
}

const outputPath = join(REPO_ROOT, OUTPUT_FILE);
writeFileSync(outputPath, buildReport(result.data), "utf8");
console.log(`Generated ${OUTPUT_FILE}`);
