import { describe, expect, it } from "vitest";

import { knowledgeGraphManifestSchema, type KnowledgeGraphManifest } from "./knowledge-graph";

function minimalValidManifest(): KnowledgeGraphManifest {
  return {
    domains: [{ code: "EL", name: "Electrical" }],
    sources: [{ key: "src-1", title: "Original Governed Statements" }],
    sourceVersions: [
      {
        key: "sv-1",
        sourceKey: "src-1",
        status: "CURRENT" as const,
        rightsClassification: "ORIGINAL" as const,
        verificationStatus: "UNVERIFIED" as const,
      },
    ],
    sourceLocators: [
      {
        key: "loc-1",
        sourceVersionKey: "sv-1",
        locatorSummary: "Electrical — Ohm's law",
      },
    ],
    curricula: [{ code: "2365-02", name: "City & Guilds 2365-02" }],
    curriculumVersions: [
      {
        key: "cv-1",
        curriculumCode: "2365-02",
        versionLabel: "proving-slice reference",
        status: "CURRENT" as const,
      },
    ],
    curriculumNodes: [
      {
        key: "node-qual",
        curriculumVersionKey: "cv-1",
        nodeType: "QUALIFICATION" as const,
        code: "2365-02",
        title: "City & Guilds 2365-02",
      },
      {
        key: "node-unit",
        curriculumVersionKey: "cv-1",
        parentKey: "node-qual",
        nodeType: "UNIT" as const,
        code: "UNIT-202",
        title: "Unit 202",
      },
    ],
    assertions: [{ identifier: "EL-OHM-RELATIONSHIP-001", domainCode: "EL" }],
    assertionVersions: [
      {
        assertionIdentifier: "EL-OHM-RELATIONSHIP-001",
        version: 1,
        statement: "V = I x R",
        status: "APPROVED" as const,
      },
    ],
    assertionProvenanceLinks: [
      {
        assertionIdentifier: "EL-OHM-RELATIONSHIP-001",
        assertionVersion: 1,
        sourceLocatorKey: "loc-1",
        provenanceRole: "DEFINES" as const,
      },
    ],
    assertionRelationships: [],
    assertionCurriculumMappings: [
      {
        assertionIdentifier: "EL-OHM-RELATIONSHIP-001",
        curriculumNodeKey: "node-unit",
        mappingType: "REQUIRED_FOR" as const,
      },
    ],
    misconceptions: [
      { identifier: "MIS-EL-OHM-001", description: "Treats V, I, R as unrelated." },
    ],
    misconceptionConflicts: [
      {
        misconceptionIdentifier: "MIS-EL-OHM-001",
        assertionIdentifier: "EL-OHM-RELATIONSHIP-001",
      },
    ],
  };
}

describe("knowledgeGraphManifestSchema", () => {
  it("accepts a minimal internally-consistent manifest", () => {
    const result = knowledgeGraphManifestSchema.safeParse(minimalValidManifest());
    expect(result.success).toBe(true);
  });

  it("accepts a RANGE_ITEM node parented under an ASSESSMENT_CRITERION node (CC-09A)", () => {
    const manifest = minimalValidManifest();
    manifest.curriculumNodes.push(
      {
        key: "node-lo",
        curriculumVersionKey: "cv-1",
        parentKey: "node-unit",
        nodeType: "LEARNING_OUTCOME",
        code: "202-LO1",
        title: "Sample Learning Outcome",
      },
      {
        key: "node-ac",
        curriculumVersionKey: "cv-1",
        parentKey: "node-lo",
        nodeType: "ASSESSMENT_CRITERION",
        code: "202-LO1-AC1.1",
        title: "Sample Assessment Criterion",
      },
      {
        key: "node-range-item",
        curriculumVersionKey: "cv-1",
        parentKey: "node-ac",
        nodeType: "RANGE_ITEM",
        code: "202-LO1-AC1.1-RANGE-SAMPLE",
        title: "Sample Range: item",
      },
    );

    const result = knowledgeGraphManifestSchema.safeParse(manifest);

    expect(result.success).toBe(true);
  });

  it("rejects an assertion referencing an unknown domain", () => {
    const manifest = minimalValidManifest();
    manifest.assertions[0]!.domainCode = "MISSING";

    const result = knowledgeGraphManifestSchema.safeParse(manifest);

    expect(result.success).toBe(false);
    expect(result.error?.issues.some((i) => i.message.includes("unknown domain"))).toBe(true);
  });

  it("rejects a relationship referencing an unknown assertion", () => {
    const manifest = minimalValidManifest();
    manifest.assertionRelationships = [
      {
        fromIdentifier: "EL-OHM-RELATIONSHIP-001",
        toIdentifier: "DOES-NOT-EXIST",
        relationshipType: "PREREQUISITE_OF",
      },
    ];

    const result = knowledgeGraphManifestSchema.safeParse(manifest);

    expect(result.success).toBe(false);
    expect(
      result.error?.issues.some((i) => i.message.includes("unknown assertion DOES-NOT-EXIST")),
    ).toBe(true);
  });

  it("rejects a self-referencing relationship", () => {
    const manifest = minimalValidManifest();
    manifest.assertionRelationships = [
      {
        fromIdentifier: "EL-OHM-RELATIONSHIP-001",
        toIdentifier: "EL-OHM-RELATIONSHIP-001",
        relationshipType: "PREREQUISITE_OF",
      },
    ];

    const result = knowledgeGraphManifestSchema.safeParse(manifest);

    expect(result.success).toBe(false);
    expect(result.error?.issues.some((i) => i.message.includes("self-references"))).toBe(true);
  });

  it("rejects a provenance link referencing an unknown assertion version", () => {
    const manifest = minimalValidManifest();
    manifest.assertionProvenanceLinks[0]!.assertionVersion = 99;

    const result = knowledgeGraphManifestSchema.safeParse(manifest);

    expect(result.success).toBe(false);
    expect(
      result.error?.issues.some((i) => i.message.includes("unknown assertion version")),
    ).toBe(true);
  });

  it("rejects a curriculum mapping referencing an unknown curriculum node", () => {
    const manifest = minimalValidManifest();
    manifest.assertionCurriculumMappings[0]!.curriculumNodeKey = "missing-node";

    const result = knowledgeGraphManifestSchema.safeParse(manifest);

    expect(result.success).toBe(false);
    expect(
      result.error?.issues.some((i) => i.message.includes("unknown curriculum node")),
    ).toBe(true);
  });

  it("rejects a curriculum node whose parent belongs to a different curriculum version", () => {
    const manifest = minimalValidManifest();
    manifest.curriculumVersions.push({
      key: "cv-2",
      curriculumCode: "2365-02",
      versionLabel: "another version",
      status: "CURRENT",
    });
    manifest.curriculumNodes.push({
      key: "node-other-version",
      curriculumVersionKey: "cv-2",
      parentKey: "node-unit",
      nodeType: "LEARNING_OUTCOME",
      code: "LO1",
      title: "Learning outcome 1",
    });

    const result = knowledgeGraphManifestSchema.safeParse(manifest);

    expect(result.success).toBe(false);
    expect(
      result.error?.issues.some((i) => i.message.includes("different curriculum versions")),
    ).toBe(true);
  });

  it("rejects a misconception conflict referencing an unknown misconception", () => {
    const manifest = minimalValidManifest();
    manifest.misconceptionConflicts[0]!.misconceptionIdentifier = "MISSING-MIS";

    const result = knowledgeGraphManifestSchema.safeParse(manifest);

    expect(result.success).toBe(false);
    expect(
      result.error?.issues.some((i) => i.message.includes("unknown misconception")),
    ).toBe(true);
  });

  it("rejects a source_versions.rightsClassification value of UNKNOWN", () => {
    const manifest = minimalValidManifest();
    // @ts-expect-error -- UNKNOWN is deliberately not part of the permitted enum
    manifest.sourceVersions[0]!.rightsClassification = "UNKNOWN";

    const result = knowledgeGraphManifestSchema.safeParse(manifest);

    expect(result.success).toBe(false);
  });

  it("rejects a duplicate assertion version", () => {
    const manifest = minimalValidManifest();
    manifest.assertionVersions.push({ ...manifest.assertionVersions[0]! });

    const result = knowledgeGraphManifestSchema.safeParse(manifest);

    expect(result.success).toBe(false);
    expect(result.error?.issues.some((i) => i.message.includes("duplicate assertion version"))).toBe(
      true,
    );
  });

  it("rejects a duplicate stable assertion identifier", () => {
    const manifest = minimalValidManifest();
    manifest.assertions.push({ ...manifest.assertions[0]! });

    const result = knowledgeGraphManifestSchema.safeParse(manifest);

    expect(result.success).toBe(false);
    expect(
      result.error?.issues.some((i) => i.message.includes("duplicate assertion identifier")),
    ).toBe(true);
  });

  it("rejects an APPROVED assertion version with no provenance link", () => {
    const manifest = minimalValidManifest();
    manifest.assertionProvenanceLinks = [];

    const result = knowledgeGraphManifestSchema.safeParse(manifest);

    expect(result.success).toBe(false);
    expect(result.error?.issues.some((i) => i.message.includes("has no provenance link"))).toBe(
      true,
    );
  });

  it("accepts a CANDIDATE assertion version with no provenance link", () => {
    const manifest = minimalValidManifest();
    manifest.assertionProvenanceLinks = [];
    manifest.assertionVersions[0]!.status = "CANDIDATE";

    const result = knowledgeGraphManifestSchema.safeParse(manifest);

    expect(result.success).toBe(true);
  });

  it("rejects a CURRENT source version whose edition looks like an unconfirmed placeholder", () => {
    const manifest = minimalValidManifest();
    manifest.sourceVersions[0]!.edition = "edition unconfirmed";

    const result = knowledgeGraphManifestSchema.safeParse(manifest);

    expect(result.success).toBe(false);
    expect(
      result.error?.issues.some((i) => i.message.includes("unconfirmed placeholder")),
    ).toBe(true);
  });

  it("ADR-0002: rejects a source version claiming VERIFIED with no verifiedBy attribution", () => {
    const manifest = minimalValidManifest();
    manifest.sourceVersions[0]!.verificationStatus = "VERIFIED";

    const result = knowledgeGraphManifestSchema.safeParse(manifest);

    expect(result.success).toBe(false);
    expect(result.error?.issues.some((i) => i.message.includes("no verifiedBy"))).toBe(true);
  });

  it("ADR-0002: accepts a source version marked VERIFIED with an attributed independent verifier", () => {
    const manifest = minimalValidManifest();
    manifest.sourceVersions[0]!.verificationStatus = "VERIFIED";
    manifest.sourceVersions[0]!.verifiedBy = "project-architect";

    const result = knowledgeGraphManifestSchema.safeParse(manifest);

    expect(result.success).toBe(true);
  });

  it("ADR-0002: rejects a malformed content fingerprint (not 64 lowercase hex characters)", () => {
    const manifest = minimalValidManifest();
    manifest.sourceVersions[0]!.contentFingerprintSha256 = "not-a-real-hash";

    const result = knowledgeGraphManifestSchema.safeParse(manifest);

    expect(result.success).toBe(false);
  });

  it("ADR-0002: accepts a real-shaped SHA-256 content fingerprint", () => {
    const manifest = minimalValidManifest();
    manifest.sourceVersions[0]!.contentFingerprintSha256 = "f6bc7a6c76e37a60a9d9830f873ab1079d230015d1ad95f458d69caa82dc9515";

    const result = knowledgeGraphManifestSchema.safeParse(manifest);

    expect(result.success).toBe(true);
  });

  it("CC-09B.2: rejects a DERIVED_FROM relationship with no derivationKind", () => {
    const manifest = minimalValidManifest();
    manifest.assertions.push({ identifier: "EL-OHM-SOLVE-I-001", domainCode: "EL" });
    manifest.assertionVersions.push({
      assertionIdentifier: "EL-OHM-SOLVE-I-001",
      version: 1,
      statement: "I = V / R",
      status: "APPROVED",
    });
    manifest.assertionProvenanceLinks.push({
      assertionIdentifier: "EL-OHM-SOLVE-I-001",
      assertionVersion: 1,
      sourceLocatorKey: "loc-1",
      provenanceRole: "SUPPORTS",
    });
    manifest.assertionRelationships.push({
      fromIdentifier: "EL-OHM-SOLVE-I-001",
      toIdentifier: "EL-OHM-RELATIONSHIP-001",
      relationshipType: "DERIVED_FROM",
    });

    const result = knowledgeGraphManifestSchema.safeParse(manifest);

    expect(result.success).toBe(false);
    expect(result.error?.issues.some((i) => i.message.includes("must declare a derivationKind"))).toBe(true);
  });

  it("CC-09B.2: accepts a DERIVED_FROM relationship with a declared derivationKind", () => {
    const manifest = minimalValidManifest();
    manifest.assertions.push({ identifier: "EL-OHM-SOLVE-I-001", domainCode: "EL" });
    manifest.assertionVersions.push({
      assertionIdentifier: "EL-OHM-SOLVE-I-001",
      version: 1,
      statement: "I = V / R",
      status: "APPROVED",
    });
    manifest.assertionProvenanceLinks.push({
      assertionIdentifier: "EL-OHM-SOLVE-I-001",
      assertionVersion: 1,
      sourceLocatorKey: "loc-1",
      provenanceRole: "SUPPORTS",
    });
    manifest.assertionRelationships.push({
      fromIdentifier: "EL-OHM-SOLVE-I-001",
      toIdentifier: "EL-OHM-RELATIONSHIP-001",
      relationshipType: "DERIVED_FROM",
      derivationKind: "MATHEMATICAL",
    });

    const result = knowledgeGraphManifestSchema.safeParse(manifest);

    expect(result.success).toBe(true);
  });

  it("CC-09B.2: derivationKind is optional on non-DERIVED_FROM relationships (PREREQUISITE_OF etc. never require it)", () => {
    const manifest = minimalValidManifest();
    manifest.assertions.push({ identifier: "EL-OHM-SOLVE-I-001", domainCode: "EL" });
    manifest.assertionVersions.push({
      assertionIdentifier: "EL-OHM-SOLVE-I-001",
      version: 1,
      statement: "I = V / R",
      status: "APPROVED",
    });
    manifest.assertionProvenanceLinks.push({
      assertionIdentifier: "EL-OHM-SOLVE-I-001",
      assertionVersion: 1,
      sourceLocatorKey: "loc-1",
      provenanceRole: "SUPPORTS",
    });
    manifest.assertionRelationships.push({
      fromIdentifier: "EL-OHM-RELATIONSHIP-001",
      toIdentifier: "EL-OHM-SOLVE-I-001",
      relationshipType: "PREREQUISITE_OF",
    });

    const result = knowledgeGraphManifestSchema.safeParse(manifest);

    expect(result.success).toBe(true);
  });

  it("CC-09B.2: accepts a provenance link carrying an explicit supportType (DIRECT/PARTIAL)", () => {
    const manifest = minimalValidManifest();
    manifest.assertionProvenanceLinks[0]!.supportType = "PARTIAL";

    const result = knowledgeGraphManifestSchema.safeParse(manifest);

    expect(result.success).toBe(true);
  });

  it("rejects a CURRENT curriculum version whose label looks like a placeholder", () => {
    const manifest = minimalValidManifest();
    manifest.curriculumVersions[0]!.versionLabel = "proving-slice reference (edition unconfirmed)";

    const result = knowledgeGraphManifestSchema.safeParse(manifest);

    expect(result.success).toBe(false);
    expect(
      result.error?.issues.some((i) => i.message.includes("unconfirmed placeholder")),
    ).toBe(true);
  });

  it("accepts a CURRENT curriculum version with a real confirmed edition label", () => {
    const manifest = minimalValidManifest();
    manifest.curriculumVersions[0]!.versionLabel = "Version 1.12 (April 2026)";

    const result = knowledgeGraphManifestSchema.safeParse(manifest);

    expect(result.success).toBe(true);
  });
});
