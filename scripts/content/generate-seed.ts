/**
 * CC-04: deterministic SQL generator for the governed knowledge-graph
 * content manifest(s) under scripts/content/data.
 *
 * Usage:
 *   node scripts/content/generate-seed.ts
 *   npm run content:generate
 *
 * Each manifest is validated against `knowledgeGraphManifestSchema`
 * (structural shape + cross-reference integrity -- every relationship,
 * provenance link and curriculum mapping must resolve to a defined
 * entity within the manifest) before any SQL is written. Every row uses
 * a deterministic UUIDv5-derived primary key (see lib/deterministic-uuid)
 * and an `ON CONFLICT (id) DO NOTHING` clause, so the generated file is
 * safe to execute more than once without creating duplicate rows, and
 * `supabase db reset` reconstructs byte-identical content every time.
 *
 * The generated .sql file is committed to the repository (the same
 * pattern already used for packages/domain/src/database.types.ts): run
 * this command again and diff the result to prove the checked-in file is
 * still an accurate, up-to-date compilation of the manifest
 * (`npm run content:check`).
 */

import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { knowledgeGraphManifestSchema, type KnowledgeGraphManifest } from "@alp/content-schema";

import { cc04Unit202ElectricalScience } from "./data/cc04-unit202-electrical-science.ts";
import { deterministicUuid } from "./lib/deterministic-uuid.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, "..", "..");

type Manifest = {
  readonly name: string;
  readonly outputFile: string;
  readonly data: KnowledgeGraphManifest;
};

const MANIFESTS: readonly Manifest[] = [
  {
    name: "CC-04A Unit 202 proving-slice knowledge corpus",
    outputFile: "supabase/seed-content/cc04-unit202-electrical-science.sql",
    data: cc04Unit202ElectricalScience,
  },
];

function sqlString(value: string | undefined | null): string {
  if (value === undefined || value === null) return "null";
  return `'${value.replace(/'/g, "''")}'`;
}

function sqlInt(value: number | undefined | null): string {
  if (value === undefined || value === null) return "null";
  return String(value);
}

function insert(
  table: string,
  columns: readonly string[],
  rows: readonly (readonly (string | number | null)[])[],
): string {
  if (rows.length === 0) return "";
  const values = rows
    .map((row) => `  (${row.map((v) => (v === null ? "null" : v)).join(", ")})`)
    .join(",\n");
  return `insert into public.${table} (${columns.join(", ")})\nvalues\n${values}\non conflict (id) do nothing;\n`;
}

function generate(manifest: Manifest): { sql: string; counts: Record<string, number> } {
  const result = knowledgeGraphManifestSchema.safeParse(manifest.data);
  if (!result.success) {
    const details = result.error.issues
      .map((i) => `  - ${i.path.join(".")}: ${i.message}`)
      .join("\n");
    throw new Error(`${manifest.name}: manifest failed validation:\n${details}`);
  }
  const data = result.data;

  const domainId = new Map(data.domains.map((d) => [d.code, deterministicUuid(`domain:${d.code}`)]));
  const sourceId = new Map(data.sources.map((s) => [s.key, deterministicUuid(`source:${s.key}`)]));
  const sourceVersionId = new Map(
    data.sourceVersions.map((sv) => [sv.key, deterministicUuid(`source_version:${sv.key}`)]),
  );
  const sourceLocatorId = new Map(
    data.sourceLocators.map((sl) => [sl.key, deterministicUuid(`source_locator:${sl.key}`)]),
  );
  const curriculumId = new Map(
    data.curricula.map((c) => [c.code, deterministicUuid(`curriculum:${c.code}`)]),
  );
  const curriculumVersionId = new Map(
    data.curriculumVersions.map((cv) => [cv.key, deterministicUuid(`curriculum_version:${cv.key}`)]),
  );
  const curriculumNodeId = new Map(
    data.curriculumNodes.map((n) => [n.key, deterministicUuid(`curriculum_node:${n.key}`)]),
  );
  const assertionId = new Map(
    data.assertions.map((a) => [a.identifier, deterministicUuid(`assertion:${a.identifier}`)]),
  );
  const assertionVersionId = new Map(
    data.assertionVersions.map((v) => [
      `${v.assertionIdentifier}@${v.version}`,
      deterministicUuid(`assertion_version:${v.assertionIdentifier}@${v.version}`),
    ]),
  );
  const misconceptionId = new Map(
    data.misconceptions.map((m) => [m.identifier, deterministicUuid(`misconception:${m.identifier}`)]),
  );

  const sections: string[] = [];

  sections.push(
    insert(
      "domains",
      ["id", "code", "name", "description"],
      data.domains.map((d) => [
        sqlString(domainId.get(d.code)!),
        sqlString(d.code),
        sqlString(d.name),
        sqlString(d.description),
      ]),
    ),
  );

  sections.push(
    insert(
      "sources",
      ["id", "title", "publisher", "source_family", "source_type", "jurisdiction", "canonical_reference", "access_location", "source_role"],
      data.sources.map((s) => [
        sqlString(sourceId.get(s.key)!),
        sqlString(s.title),
        sqlString(s.publisher),
        sqlString(s.sourceFamily),
        sqlString(s.sourceType),
        sqlString(s.jurisdiction),
        sqlString(s.canonicalReference),
        sqlString(s.accessLocation),
        sqlString(s.sourceRole),
      ]),
    ),
  );

  sections.push(
    insert(
      "source_versions",
      [
        "id",
        "source_id",
        "edition",
        "revision",
        "publication_date",
        "effective_date",
        "status",
        "rights_classification",
        "retrieved_date",
        "content_fingerprint_sha256",
        "verification_status",
        "verified_by",
        "last_currency_check_date",
      ],
      data.sourceVersions.map((sv) => [
        sqlString(sourceVersionId.get(sv.key)!),
        sqlString(sourceId.get(sv.sourceKey)!),
        sqlString(sv.edition),
        sqlString(sv.revision),
        sqlString(sv.publicationDate),
        sqlString(sv.effectiveDate),
        sqlString(sv.status),
        sqlString(sv.rightsClassification),
        sqlString(sv.retrievedDate),
        sqlString(sv.contentFingerprintSha256),
        sqlString(sv.verificationStatus),
        sqlString(sv.verifiedBy),
        sqlString(sv.lastCurrencyCheckDate),
      ]),
    ),
  );

  sections.push(
    insert(
      "source_locators",
      ["id", "source_version_id", "part", "chapter", "section", "subsection", "clause", "paragraph", "table_reference", "figure_reference", "page", "web_anchor", "locator_summary"],
      data.sourceLocators.map((sl) => [
        sqlString(sourceLocatorId.get(sl.key)!),
        sqlString(sourceVersionId.get(sl.sourceVersionKey)!),
        sqlString(sl.part),
        sqlString(sl.chapter),
        sqlString(sl.section),
        sqlString(sl.subsection),
        sqlString(sl.clause),
        sqlString(sl.paragraph),
        sqlString(sl.tableReference),
        sqlString(sl.figureReference),
        sqlString(sl.page),
        sqlString(sl.webAnchor),
        sqlString(sl.locatorSummary),
      ]),
    ),
  );

  sections.push(
    insert(
      "curricula",
      ["id", "code", "name", "awarding_body"],
      data.curricula.map((c) => [
        sqlString(curriculumId.get(c.code)!),
        sqlString(c.code),
        sqlString(c.name),
        sqlString(c.awardingBody),
      ]),
    ),
  );

  sections.push(
    insert(
      "curriculum_versions",
      ["id", "curriculum_id", "version_label", "effective_date", "status"],
      data.curriculumVersions.map((cv) => [
        sqlString(curriculumVersionId.get(cv.key)!),
        sqlString(curriculumId.get(cv.curriculumCode)!),
        sqlString(cv.versionLabel),
        sqlString(cv.effectiveDate),
        sqlString(cv.status),
      ]),
    ),
  );

  // Curriculum nodes must be inserted in parent-before-child order for
  // readability (the FK does not require it since all ids are computed
  // up-front, but a topological ordering keeps the generated file
  // reviewable).
  const orderedNodes = [...data.curriculumNodes].sort((a, b) => {
    if (a.parentKey === undefined && b.parentKey !== undefined) return -1;
    if (a.parentKey !== undefined && b.parentKey === undefined) return 1;
    return 0;
  });
  sections.push(
    insert(
      "curriculum_nodes",
      ["id", "curriculum_version_id", "parent_node_id", "node_type", "code", "title", "sequence_order"],
      orderedNodes.map((n) => [
        sqlString(curriculumNodeId.get(n.key)!),
        sqlString(curriculumVersionId.get(n.curriculumVersionKey)!),
        n.parentKey ? sqlString(curriculumNodeId.get(n.parentKey)!) : "null",
        sqlString(n.nodeType),
        sqlString(n.code),
        sqlString(n.title),
        sqlInt(n.sequenceOrder),
      ]),
    ),
  );

  sections.push(
    insert(
      "assertions",
      ["id", "identifier", "domain_id"],
      data.assertions.map((a) => [
        sqlString(assertionId.get(a.identifier)!),
        sqlString(a.identifier),
        sqlString(domainId.get(a.domainCode)!),
      ]),
    ),
  );

  sections.push(
    insert(
      "assertion_versions",
      ["id", "assertion_id", "version", "statement", "status"],
      data.assertionVersions.map((v) => [
        sqlString(assertionVersionId.get(`${v.assertionIdentifier}@${v.version}`)!),
        sqlString(assertionId.get(v.assertionIdentifier)!),
        sqlInt(v.version),
        sqlString(v.statement),
        sqlString(v.status),
      ]),
    ),
  );

  sections.push(
    insert(
      "assertion_provenance_links",
      ["id", "assertion_version_id", "source_locator_id", "provenance_role"],
      data.assertionProvenanceLinks.map((p) => [
        sqlString(
          deterministicUuid(
            `assertion_provenance_link:${p.assertionIdentifier}@${p.assertionVersion}:${p.sourceLocatorKey}:${p.provenanceRole}`,
          ),
        ),
        sqlString(assertionVersionId.get(`${p.assertionIdentifier}@${p.assertionVersion}`)!),
        sqlString(sourceLocatorId.get(p.sourceLocatorKey)!),
        sqlString(p.provenanceRole),
      ]),
    ),
  );

  sections.push(
    insert(
      "assertion_relationships",
      ["id", "from_assertion_id", "to_assertion_id", "relationship_type", "strength"],
      data.assertionRelationships.map((r) => [
        sqlString(
          deterministicUuid(`assertion_relationship:${r.fromIdentifier}->${r.toIdentifier}:${r.relationshipType}`),
        ),
        sqlString(assertionId.get(r.fromIdentifier)!),
        sqlString(assertionId.get(r.toIdentifier)!),
        sqlString(r.relationshipType),
        sqlString(r.strength),
      ]),
    ),
  );

  sections.push(
    insert(
      "assertion_curriculum_mappings",
      ["id", "assertion_id", "curriculum_node_id", "mapping_type"],
      data.assertionCurriculumMappings.map((m) => [
        sqlString(
          deterministicUuid(`assertion_curriculum_mapping:${m.assertionIdentifier}:${m.curriculumNodeKey}:${m.mappingType}`),
        ),
        sqlString(assertionId.get(m.assertionIdentifier)!),
        sqlString(curriculumNodeId.get(m.curriculumNodeKey)!),
        sqlString(m.mappingType),
      ]),
    ),
  );

  sections.push(
    insert(
      "misconceptions",
      ["id", "identifier", "description"],
      data.misconceptions.map((m) => [
        sqlString(misconceptionId.get(m.identifier)!),
        sqlString(m.identifier),
        sqlString(m.description),
      ]),
    ),
  );

  sections.push(
    insert(
      "misconception_assertion_conflicts",
      ["id", "misconception_id", "assertion_id"],
      data.misconceptionConflicts.map((c) => [
        sqlString(
          deterministicUuid(`misconception_assertion_conflict:${c.misconceptionIdentifier}:${c.assertionIdentifier}`),
        ),
        sqlString(misconceptionId.get(c.misconceptionIdentifier)!),
        sqlString(assertionId.get(c.assertionIdentifier)!),
      ]),
    ),
  );

  const header = `-- GENERATED FILE -- DO NOT EDIT BY HAND.
--
-- Compiled by scripts/content/generate-seed.ts from
-- scripts/content/data -- specifically ${manifest.name}.
-- Regenerate with: npm run content:generate
-- Verify up to date with: npm run content:check
--
-- Every row uses a deterministic UUIDv5-derived id (see
-- scripts/content/lib/deterministic-uuid.ts) and ON CONFLICT (id) DO
-- NOTHING, so this file reconstructs the same logical content every
-- \`supabase db reset\` and is safe to execute more than once.
--
-- This is real governed proving-slice content (WP1.2/WP1.9 CC-04), not a
-- synthetic structural fixture -- see supabase/seed.sql for those.

`;

  return {
    sql: header + sections.filter(Boolean).join("\n"),
    counts: {
      domains: data.domains.length,
      sources: data.sources.length,
      sourceVersions: data.sourceVersions.length,
      sourceLocators: data.sourceLocators.length,
      curricula: data.curricula.length,
      curriculumVersions: data.curriculumVersions.length,
      curriculumNodes: data.curriculumNodes.length,
      assertions: data.assertions.length,
      assertionVersions: data.assertionVersions.length,
      assertionProvenanceLinks: data.assertionProvenanceLinks.length,
      assertionRelationships: data.assertionRelationships.length,
      assertionCurriculumMappings: data.assertionCurriculumMappings.length,
      misconceptions: data.misconceptions.length,
      misconceptionConflicts: data.misconceptionConflicts.length,
    },
  };
}

for (const manifest of MANIFESTS) {
  const { sql, counts } = generate(manifest);
  const outputPath = join(REPO_ROOT, manifest.outputFile);
  writeFileSync(outputPath, sql, "utf8");
  console.log(`Generated ${manifest.outputFile}`);
  for (const [key, value] of Object.entries(counts)) {
    console.log(`  ${key}: ${value}`);
  }
}
