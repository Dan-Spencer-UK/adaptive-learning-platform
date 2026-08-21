/**
 * CC-04: structured manifest schema for the minimum governed knowledge
 * graph (WP1.2 object family: domain, source/source-version/source-locator,
 * curriculum/curriculum-version/curriculum-node, assertion/assertion-version,
 * assertion relationship, assertion<->curriculum mapping, misconception).
 *
 * This schema is deliberately generic: it describes the SHAPE a governed
 * knowledge-graph content manifest must have, not any particular domain's
 * content. Ohm's Law / Electrical / Foundational Maths content lives in
 * scripts/content/data, not here. A later domain (e.g. Foundational
 * Physics, a second vocational vertical) reuses this same schema.
 *
 * Enum values mirror the CHECK constraints already committed in
 * supabase/migrations exactly. This schema does not define new semantics;
 * it validates manifest data against the already-approved database model
 * before any SQL is generated.
 */

import { z } from "zod";

// ---------------------------------------------------------------------
// Shared enums (must stay in sync with supabase/migrations CHECK
// constraints -- see knowledge_provenance_schema.sql and
// misconception_schema.sql).
// ---------------------------------------------------------------------

export const sourceVersionStatusSchema = z.enum([
  "CURRENT",
  "SUPERSEDED",
  "WITHDRAWN",
]);

// UNKNOWN is deliberately not a permitted value (WP1.2 SS25; CC-02
// migration comment): unresolved rights cannot be recorded as content.
export const rightsClassificationSchema = z.enum([
  "OPEN",
  "OFFICIAL_OGL",
  "PUBLIC_RESTRICTED",
  "PROPRIETARY_REFERENCE",
  "LICENSED",
  "ORIGINAL",
]);

export const curriculumVersionStatusSchema = z.enum([
  "CURRENT",
  "SUPERSEDED",
  "WITHDRAWN",
]);

export const curriculumNodeTypeSchema = z.enum([
  "QUALIFICATION",
  "UNIT",
  "LEARNING_OUTCOME",
  "ASSESSMENT_CRITERION",
  // CC-09A: an individual mandatory item within an official handbook
  // "Range" heading (e.g. a single named electrical quantity, a single
  // named electronic component) -- the smallest mechanically enumerable
  // official curriculum requirement below an Assessment Criterion. Its
  // parent is always the ASSESSMENT_CRITERION node the Range box belongs
  // to (never the LEARNING_OUTCOME directly), so a Range heading that
  // groups several items becomes several sibling RANGE_ITEM nodes rather
  // than one node with prose hiding the individual mandatory items.
  "RANGE_ITEM",
]);

// ADR-0002: whether a source version's own CONTENT (not any assertion
// extracted from it) has been independently confirmed against the actual
// authoritative source artefact by a verifier distinct from whatever
// model extracted/authored the governed content. Deliberately separate
// from assertionVersionStatusSchema's own pre-existing "VERIFIED" state
// (that is per-assertion; this is per-source-snapshot) -- an assertion
// should not reach its own VERIFIED status while the source it cites is
// still UNVERIFIED. Defaults to UNVERIFIED: verification must be an
// explicit, evidenced act, never assumed from extraction alone.
export const sourceVerificationStatusSchema = z.enum([
  "UNVERIFIED",
  "VERIFIED",
  "VERIFICATION_FAILED",
]);

export const assertionVersionStatusSchema = z.enum([
  "CANDIDATE",
  "SOURCE_LINKED",
  "VERIFIED",
  "APPROVED",
  "PUBLISHED",
  "SUPERSEDED",
  "WITHDRAWN",
]);

export const provenanceRoleSchema = z.enum([
  "AUTHORITATIVE_REQUIREMENT",
  "CURRICULUM_REQUIRES",
  "LEGAL_BASIS",
  "SUPPORTS",
  "INTERPRETS",
  "DEFINES",
  "EXEMPLIFIES",
]);

export const relationshipTypeSchema = z.enum([
  "PREREQUISITE_OF",
  "SUPPORTS",
  "APPLIES_IN",
  "DERIVED_FROM",
  "CONTRASTS_WITH",
  "EQUIVALENT_TO",
  "PART_OF",
]);

export const relationshipStrengthSchema = z.enum([
  "REQUIRED",
  "STRONG",
  "SUPPORTING",
]);

// CC-09B.2 (source-first evidence hardening): classifies a DERIVED_FROM
// relationship's actual justification, so "the child assertion follows
// from its parents" cannot silently mean anything from "pure algebra" to
// "I assumed a real device works this way". Only MATHEMATICAL and
// LOGICAL_DEFINITIONAL derivations may substitute for the child having its
// own direct factual provenance -- deriving a new EMPIRICAL fact (a real
// device's construction, a specific application, an industry practice)
// from a mathematical/definitional parent is exactly the "reference-shaped
// decoration" failure mode this package exists to make structurally
// difficult to reintroduce. See docs/governance/DECISION-LOG.md.
export const derivationKindSchema = z.enum([
  /** A deductive, purely mathematical consequence of the parent(s) -- e.g. algebraic rearrangement or substitution (V = IR + I = V/R by rearrangement; P = VI + V = IR by substitution -> P = I^2R). */
  "MATHEMATICAL",
  /** A logical/definitional consequence that introduces no new empirical content -- e.g. "select the instrument matching the desired quantity" given each instrument's measured quantity is already independently established. */
  "LOGICAL_DEFINITIONAL",
  /** Introduces new empirical content (a real device's construction, a specific application/industry-practice claim) not entailed by the parent(s) alone -- NEVER sufficient on its own to satisfy factual provenance; the child needs its own direct source instead. */
  "EMPIRICAL_APPLICATION",
  /** The derivation's justification could not be established as sound; flagged for correction rather than silently treated as valid. */
  "INVALID_UNCLEAR",
]);

// CC-09B.2: whether a source locator's evidence, as actually inspected,
// supports the WHOLE material factual proposition of the assertion it is
// linked to (DIRECT) or only part of it (PARTIAL -- the assertion should
// be narrowed, split, or given an additional source). Deliberately does
// NOT include a "CURRICULUM_ONLY" value here: that case is already fully
// expressed by provenanceRoleSchema's own CURRICULUM_REQUIRES value, so
// adding a second, overlapping concept would duplicate rather than
// clarify (per the task's own "reuse existing provenanceRole semantics,
// do not create duplicate concepts" instruction). Optional and unset on
// most pre-existing links: this package audits/classifies the specific
// links it corrected or newly authored, not a retroactive re-audit of the
// entire pre-existing corpus (a tracked, honestly-reported backlog -- see
// PROJECT-STATUS.md CC-09B.2).
export const supportTypeSchema = z.enum(["DIRECT", "PARTIAL"]);

export const curriculumMappingTypeSchema = z.enum([
  "REQUIRED_FOR",
  "SUPPORTS",
  "EXEMPLIFIES",
  "ASSESSED_UNDER",
]);

// ---------------------------------------------------------------------
// Entity schemas
// ---------------------------------------------------------------------

const stableKey = z.string().min(1);

export const domainManifestSchema = z.object({
  code: stableKey,
  name: z.string().min(1),
  description: z.string().min(1).optional(),
});

export const sourceManifestSchema = z.object({
  key: stableKey,
  title: z.string().min(1),
  publisher: z.string().min(1).optional(),
  sourceFamily: z.string().min(1).optional(),
  sourceType: z.string().min(1).optional(),
  jurisdiction: z.string().min(1).optional(),
  canonicalReference: z.string().min(1).optional(),
  accessLocation: z.string().min(1).optional(),
});

export const sourceVersionManifestSchema = z.object({
  key: stableKey,
  sourceKey: stableKey,
  edition: z.string().min(1).optional(),
  revision: z.string().min(1).optional(),
  publicationDate: z.string().date().optional(),
  effectiveDate: z.string().date().optional(),
  status: sourceVersionStatusSchema.default("CURRENT"),
  rightsClassification: rightsClassificationSchema,
  // ADR-0002 (source-snapshot identity + independent-verification
  // evidence -- the smallest fields that make "same URL/edition label,
  // changed bytes" detectable and make verification an evidenced act
  // rather than an assumption). All optional/defaulted: only load-bearing
  // external sources need populate them, and existing manifests remain
  // valid without any migration of their own data.
  /** The date this exact source artefact was actually fetched/inspected for this snapshot (distinct from publicationDate/effectiveDate, which the publisher controls). */
  retrievedDate: z.string().date().optional(),
  /** SHA-256 (64 lowercase hex chars) of the actual fetched source artefact's bytes. Never fabricated -- omit entirely when not actually computed from real source bytes, rather than inventing a placeholder. */
  contentFingerprintSha256: z
    .string()
    .regex(/^[0-9a-f]{64}$/, "must be a lowercase 64-character hex SHA-256 digest")
    .optional(),
  /** Whether this source snapshot's own content has been independently confirmed against the authoritative artefact by a verifier distinct from whatever model extracted/authored the governed content citing it (see sourceVerificationStatusSchema and ADR-0002). */
  verificationStatus: sourceVerificationStatusSchema.default("UNVERIFIED"),
  /** Role/identity of the independent verifier (e.g. "project-architect"), populated only once verificationStatus leaves UNVERIFIED. Never the same identity as the model that authored/extracted the governed content citing this source. */
  verifiedBy: z.string().min(1).optional(),
  /** Most recent date this source was checked for upstream changes -- may be later than a full re-verification (a lightweight currency recheck confirming "still the same" is not itself a full independent verification). */
  lastCurrencyCheckDate: z.string().date().optional(),
})
  .superRefine((sv, ctx) => {
    if (sv.verificationStatus !== "UNVERIFIED" && !sv.verifiedBy) {
      ctx.addIssue({
        code: "custom",
        path: ["verifiedBy"],
        message: `source version '${sv.key}' has verificationStatus '${sv.verificationStatus}' but no verifiedBy -- verification must be attributed to an identified independent verifier, never asserted anonymously`,
      });
    }
  });

export const sourceLocatorManifestSchema = z.object({
  key: stableKey,
  sourceVersionKey: stableKey,
  part: z.string().min(1).optional(),
  chapter: z.string().min(1).optional(),
  section: z.string().min(1).optional(),
  subsection: z.string().min(1).optional(),
  clause: z.string().min(1).optional(),
  paragraph: z.string().min(1).optional(),
  tableReference: z.string().min(1).optional(),
  figureReference: z.string().min(1).optional(),
  // Semantic locator is primary; page is deliberately optional and must
  // never be fabricated where the exact page is not actually known.
  page: z.string().min(1).optional(),
  webAnchor: z.string().min(1).optional(),
  locatorSummary: z.string().min(1),
});

export const curriculumManifestSchema = z.object({
  code: stableKey,
  name: z.string().min(1),
  awardingBody: z.string().min(1).optional(),
});

export const curriculumVersionManifestSchema = z.object({
  key: stableKey,
  curriculumCode: stableKey,
  versionLabel: z.string().min(1),
  effectiveDate: z.string().date().optional(),
  status: curriculumVersionStatusSchema.default("CURRENT"),
});

export const curriculumNodeManifestSchema = z.object({
  key: stableKey,
  curriculumVersionKey: stableKey,
  parentKey: stableKey.optional(),
  nodeType: curriculumNodeTypeSchema,
  code: z.string().min(1),
  title: z.string().min(1),
  sequenceOrder: z.number().int().positive().optional(),
});

export const assertionManifestSchema = z.object({
  identifier: stableKey,
  domainCode: stableKey,
});

export const assertionVersionManifestSchema = z.object({
  assertionIdentifier: stableKey,
  version: z.number().int().positive(),
  statement: z.string().min(1),
  status: assertionVersionStatusSchema,
});

export const assertionProvenanceLinkManifestSchema = z.object({
  assertionIdentifier: stableKey,
  assertionVersion: z.number().int().positive(),
  sourceLocatorKey: stableKey,
  provenanceRole: provenanceRoleSchema,
  /** CC-09B.2: whether the locator's actual evidence supports the assertion's whole proposition (DIRECT) or only part of it (PARTIAL). See supportTypeSchema. */
  supportType: supportTypeSchema.optional(),
});

export const assertionRelationshipManifestSchema = z
  .object({
    fromIdentifier: stableKey,
    toIdentifier: stableKey,
    relationshipType: relationshipTypeSchema,
    strength: relationshipStrengthSchema.optional(),
    /** CC-09B.2: required whenever relationshipType is DERIVED_FROM (see superRefine below) -- see derivationKindSchema. */
    derivationKind: derivationKindSchema.optional(),
  })
  .superRefine((r, ctx) => {
    if (r.relationshipType === "DERIVED_FROM" && !r.derivationKind) {
      ctx.addIssue({
        code: "custom",
        path: ["derivationKind"],
        message: `DERIVED_FROM relationship ${r.fromIdentifier} -> ${r.toIdentifier} must declare a derivationKind -- a derivation can never silently stand in for the child assertion's own factual provenance without stating whether it is mathematical/definitional (valid) or introduces new empirical content (invalid as provenance)`,
      });
    }
  });

export const assertionCurriculumMappingManifestSchema = z.object({
  assertionIdentifier: stableKey,
  curriculumNodeKey: stableKey,
  mappingType: curriculumMappingTypeSchema,
});

export const misconceptionManifestSchema = z.object({
  identifier: stableKey,
  description: z.string().min(1),
});

export const misconceptionConflictManifestSchema = z.object({
  misconceptionIdentifier: stableKey,
  assertionIdentifier: stableKey,
});

// ---------------------------------------------------------------------
// Top-level manifest: structural shape plus cross-reference integrity.
//
// Zod validates the shape of each entity; superRefine below additionally
// proves the manifest is internally coherent as a graph -- every foreign
// reference in the manifest resolves to a defined entity, and no edge
// duplicates or self-references where prohibited -- before any SQL is
// generated. This mirrors the FK/UNIQUE/CHECK constraints already
// enforced by Postgres, so invalid content fails fast in a fast Vitest
// process rather than as an opaque database error.
// ---------------------------------------------------------------------

export const knowledgeGraphManifestSchema = z
  .object({
    domains: z.array(domainManifestSchema),
    sources: z.array(sourceManifestSchema),
    sourceVersions: z.array(sourceVersionManifestSchema),
    sourceLocators: z.array(sourceLocatorManifestSchema),
    curricula: z.array(curriculumManifestSchema),
    curriculumVersions: z.array(curriculumVersionManifestSchema),
    curriculumNodes: z.array(curriculumNodeManifestSchema),
    assertions: z.array(assertionManifestSchema),
    assertionVersions: z.array(assertionVersionManifestSchema),
    assertionProvenanceLinks: z.array(assertionProvenanceLinkManifestSchema),
    assertionRelationships: z.array(assertionRelationshipManifestSchema),
    assertionCurriculumMappings: z.array(
      assertionCurriculumMappingManifestSchema,
    ),
    misconceptions: z.array(misconceptionManifestSchema),
    misconceptionConflicts: z.array(misconceptionConflictManifestSchema),
  })
  .superRefine((manifest, ctx) => {
    const issue = (message: string, path: (string | number)[]) =>
      ctx.addIssue({ code: "custom", message, path });

    const domainCodes = new Set(manifest.domains.map((d) => d.code));
    const sourceKeys = new Set(manifest.sources.map((s) => s.key));
    const sourceVersionKeys = new Set(
      manifest.sourceVersions.map((sv) => sv.key),
    );
    const sourceLocatorKeys = new Set(
      manifest.sourceLocators.map((sl) => sl.key),
    );
    const curriculumCodes = new Set(manifest.curricula.map((c) => c.code));
    const curriculumVersionKeys = new Set(
      manifest.curriculumVersions.map((cv) => cv.key),
    );
    const curriculumNodeKeys = new Set(
      manifest.curriculumNodes.map((n) => n.key),
    );
    const assertionIdentifiers = new Set(
      manifest.assertions.map((a) => a.identifier),
    );
    const misconceptionIdentifiers = new Set(
      manifest.misconceptions.map((m) => m.identifier),
    );

    manifest.assertions.forEach((a, i) => {
      if (!domainCodes.has(a.domainCode)) {
        issue(
          `assertion ${a.identifier} references unknown domain ${a.domainCode}`,
          ["assertions", i, "domainCode"],
        );
      }
    });

    const assertionVersionKey = new Set<string>();
    manifest.assertionVersions.forEach((v, i) => {
      if (!assertionIdentifiers.has(v.assertionIdentifier)) {
        issue(
          `assertion version references unknown assertion ${v.assertionIdentifier}`,
          ["assertionVersions", i, "assertionIdentifier"],
        );
      }
      const key = `${v.assertionIdentifier}@${v.version}`;
      if (assertionVersionKey.has(key)) {
        issue(`duplicate assertion version ${key}`, [
          "assertionVersions",
          i,
          "version",
        ]);
      }
      assertionVersionKey.add(key);
    });

    manifest.sourceVersions.forEach((sv, i) => {
      if (!sourceKeys.has(sv.sourceKey)) {
        issue(`source version references unknown source ${sv.sourceKey}`, [
          "sourceVersions",
          i,
          "sourceKey",
        ]);
      }
    });

    manifest.sourceLocators.forEach((sl, i) => {
      if (!sourceVersionKeys.has(sl.sourceVersionKey)) {
        issue(
          `source locator references unknown source version ${sl.sourceVersionKey}`,
          ["sourceLocators", i, "sourceVersionKey"],
        );
      }
    });

    manifest.assertionProvenanceLinks.forEach((p, i) => {
      if (!assertionVersionKey.has(`${p.assertionIdentifier}@${p.assertionVersion}`)) {
        issue(
          `provenance link references unknown assertion version ${p.assertionIdentifier}@${p.assertionVersion}`,
          ["assertionProvenanceLinks", i, "assertionVersion"],
        );
      }
      if (!sourceLocatorKeys.has(p.sourceLocatorKey)) {
        issue(
          `provenance link references unknown source locator ${p.sourceLocatorKey}`,
          ["assertionProvenanceLinks", i, "sourceLocatorKey"],
        );
      }
    });

    const relationshipEdgeKey = new Set<string>();
    manifest.assertionRelationships.forEach((r, i) => {
      if (!assertionIdentifiers.has(r.fromIdentifier)) {
        issue(`relationship references unknown assertion ${r.fromIdentifier}`, [
          "assertionRelationships",
          i,
          "fromIdentifier",
        ]);
      }
      if (!assertionIdentifiers.has(r.toIdentifier)) {
        issue(`relationship references unknown assertion ${r.toIdentifier}`, [
          "assertionRelationships",
          i,
          "toIdentifier",
        ]);
      }
      if (r.fromIdentifier === r.toIdentifier) {
        issue(`relationship self-references ${r.fromIdentifier}`, [
          "assertionRelationships",
          i,
        ]);
      }
      const edgeKey = `${r.fromIdentifier}->${r.toIdentifier}:${r.relationshipType}`;
      if (relationshipEdgeKey.has(edgeKey)) {
        issue(`duplicate relationship ${edgeKey}`, ["assertionRelationships", i]);
      }
      relationshipEdgeKey.add(edgeKey);
    });

    manifest.curriculumVersions.forEach((cv, i) => {
      if (!curriculumCodes.has(cv.curriculumCode)) {
        issue(
          `curriculum version references unknown curriculum ${cv.curriculumCode}`,
          ["curriculumVersions", i, "curriculumCode"],
        );
      }
    });

    const nodeByKey = new Map(manifest.curriculumNodes.map((n) => [n.key, n]));
    manifest.curriculumNodes.forEach((n, i) => {
      if (!curriculumVersionKeys.has(n.curriculumVersionKey)) {
        issue(
          `curriculum node references unknown curriculum version ${n.curriculumVersionKey}`,
          ["curriculumNodes", i, "curriculumVersionKey"],
        );
      }
      if (n.parentKey !== undefined) {
        if (n.parentKey === n.key) {
          issue(`curriculum node ${n.key} references itself as parent`, [
            "curriculumNodes",
            i,
            "parentKey",
          ]);
        }
        const parent = nodeByKey.get(n.parentKey);
        if (!parent) {
          issue(
            `curriculum node references unknown parent ${n.parentKey}`,
            ["curriculumNodes", i, "parentKey"],
          );
        } else if (parent.curriculumVersionKey !== n.curriculumVersionKey) {
          issue(
            `curriculum node ${n.key} and its parent ${n.parentKey} belong to different curriculum versions`,
            ["curriculumNodes", i, "parentKey"],
          );
        }
      }
    });

    const mappingKey = new Set<string>();
    manifest.assertionCurriculumMappings.forEach((m, i) => {
      if (!assertionIdentifiers.has(m.assertionIdentifier)) {
        issue(
          `curriculum mapping references unknown assertion ${m.assertionIdentifier}`,
          ["assertionCurriculumMappings", i, "assertionIdentifier"],
        );
      }
      if (!curriculumNodeKeys.has(m.curriculumNodeKey)) {
        issue(
          `curriculum mapping references unknown curriculum node ${m.curriculumNodeKey}`,
          ["assertionCurriculumMappings", i, "curriculumNodeKey"],
        );
      }
      const key = `${m.assertionIdentifier}:${m.curriculumNodeKey}:${m.mappingType}`;
      if (mappingKey.has(key)) {
        issue(`duplicate curriculum mapping ${key}`, [
          "assertionCurriculumMappings",
          i,
        ]);
      }
      mappingKey.add(key);
    });

    const conflictKey = new Set<string>();
    manifest.misconceptionConflicts.forEach((c, i) => {
      if (!misconceptionIdentifiers.has(c.misconceptionIdentifier)) {
        issue(
          `misconception conflict references unknown misconception ${c.misconceptionIdentifier}`,
          ["misconceptionConflicts", i, "misconceptionIdentifier"],
        );
      }
      if (!assertionIdentifiers.has(c.assertionIdentifier)) {
        issue(
          `misconception conflict references unknown assertion ${c.assertionIdentifier}`,
          ["misconceptionConflicts", i, "assertionIdentifier"],
        );
      }
      const key = `${c.misconceptionIdentifier}:${c.assertionIdentifier}`;
      if (conflictKey.has(key)) {
        issue(`duplicate misconception conflict ${key}`, [
          "misconceptionConflicts",
          i,
        ]);
      }
      conflictKey.add(key);
    });

    // Duplicate stable-identifier checks. Foreign-key resolution above
    // already treats these as sets (so a silent duplicate would not itself
    // break referential-integrity checks); this loop makes a duplicate
    // stable identifier a hard validation failure in its own right, since
    // it would otherwise only surface later as an opaque UNIQUE-constraint
    // error from Postgres.
    const duplicateCheck = (
      label: string,
      values: readonly string[],
      path: string,
    ) => {
      const seen = new Set<string>();
      values.forEach((value, i) => {
        if (seen.has(value)) {
          issue(`duplicate ${label} ${value}`, [path, i]);
        }
        seen.add(value);
      });
    };
    duplicateCheck("domain code", manifest.domains.map((d) => d.code), "domains");
    duplicateCheck("source key", manifest.sources.map((s) => s.key), "sources");
    duplicateCheck("curriculum code", manifest.curricula.map((c) => c.code), "curricula");
    duplicateCheck(
      "curriculum node key",
      manifest.curriculumNodes.map((n) => n.key),
      "curriculumNodes",
    );
    duplicateCheck(
      "assertion identifier",
      manifest.assertions.map((a) => a.identifier),
      "assertions",
    );
    duplicateCheck(
      "misconception identifier",
      manifest.misconceptions.map((m) => m.identifier),
      "misconceptions",
    );

    // Governance defect: an APPROVED/PUBLISHED assertion version with no
    // supporting provenance link would mean the knowledge graph asserts a
    // fact with no traceable evidence -- catch this at manifest-validation
    // time rather than as a downstream pgTAP/database surprise.
    const versionsWithProvenance = new Set(
      manifest.assertionProvenanceLinks.map(
        (p) => `${p.assertionIdentifier}@${p.assertionVersion}`,
      ),
    );
    manifest.assertionVersions.forEach((v, i) => {
      if (
        (v.status === "APPROVED" || v.status === "PUBLISHED") &&
        !versionsWithProvenance.has(`${v.assertionIdentifier}@${v.version}`)
      ) {
        issue(
          `${v.assertionIdentifier}@${v.version} is ${v.status} but has no provenance link`,
          ["assertionVersions", i, "status"],
        );
      }
    });

    // Governance defect: a CURRENT source/curriculum version whose own
    // edition/version label admits it is a placeholder or unconfirmed
    // stand-in is a contradiction -- CURRENT should mean "this is the
    // record we stand behind now", not "this is provisional". This is a
    // generic content-quality guard, not domain-specific: it exists
    // because CC-04's first pass used exactly this pattern (a curriculum
    // version labelled "edition unconfirmed") before CC-04A replaced it
    // with the real confirmed City & Guilds edition.
    const placeholderPattern = /unconfirmed|placeholder|\btbd\b|\btodo\b|\bdraft\b|\bguessed\b|\bassumed\b/i;
    manifest.sourceVersions.forEach((sv, i) => {
      if (sv.status === "CURRENT" && sv.edition && placeholderPattern.test(sv.edition)) {
        issue(
          `source version ${sv.key} is CURRENT but its edition label looks like an unconfirmed placeholder: "${sv.edition}"`,
          ["sourceVersions", i, "edition"],
        );
      }
    });
    manifest.curriculumVersions.forEach((cv, i) => {
      if (cv.status === "CURRENT" && placeholderPattern.test(cv.versionLabel)) {
        issue(
          `curriculum version ${cv.key} is CURRENT but its version label looks like an unconfirmed placeholder: "${cv.versionLabel}"`,
          ["curriculumVersions", i, "versionLabel"],
        );
      }
    });
  });

export type KnowledgeGraphManifest = z.infer<typeof knowledgeGraphManifestSchema>;
