/**
 * CC-15: structured manifest schema for TECHNICAL SOURCE VERIFICATION --
 * the next work package after CC-14's Source-Acquisition Manifest
 * (./source-acquisition-manifest.ts). CC-14 declared WHAT reusable
 * domain-knowledge clusters needed an authoritative external technical
 * source. This package's job is different and deliberately narrower:
 * given a Project-Architect-approved candidate source list (a "dossier"),
 * mechanically record source retrieval, exact-locator verification, and
 * per-proposition coverage -- never source SELECTION, which remains a
 * human Project Architect / Product Owner decision made outside this
 * schema and outside this repository's code.
 *
 * This schema reuses CC-04's existing generic source/sourceVersion/
 * sourceLocator entities (./knowledge-graph.ts) rather than inventing a
 * parallel registry -- a technical source registered here is the same
 * kind of object as any other governed source, just one this package
 * additionally tracks against a specific approved dossier and a specific
 * set of required propositions.
 *
 * Deliberately does NOT reference assertionIdentifier/assertionVersion or
 * any other part of the governed knowledge corpus: this package proves
 * source-to-PROPOSITION coverage against a Source-Acquisition Manifest's
 * own required-knowledge lists (factual propositions, relationships,
 * procedures, symbols/conventions, physical/component recognition
 * requirements), not source-to-ASSERTION coverage. Knowledge corpus
 * reconciliation (deciding whether/how an existing or new assertion is
 * actually backed by one of these verified propositions) is explicitly a
 * later, separately-reviewed package -- this schema carries no assertion
 * content and this package must not author or modify any assertion.
 *
 * Chain this schema makes mechanically checkable (see the top-level
 * superRefine below for the internal-graph-integrity half; cross-checking
 * requirementText/clusterKey against a real Source-Acquisition Manifest's
 * own required-knowledge arrays is necessarily manifest-specific and
 * therefore lives in the consuming validator script, not here):
 *
 *   APPROVED SOURCE (dossier candidate)
 *     -> RETRIEVED source/sourceVersion record
 *     -> EXACT sourceLocator
 *     -> PROPOSITION COVERAGE record (VERIFIED / SOURCE_GAP /
 *        CONDITIONAL_SOURCE_GAP)
 *     -> (a later, separate package) MANIFEST CLUSTER STATUS derived from
 *        proposition coverage, never authored directly here.
 */

import { z } from "zod";

import {
  sourceLocatorManifestSchema,
  sourceManifestSchema,
  sourceVersionManifestSchema,
} from "./knowledge-graph.ts";

const stableKey = z.string().min(1);

/**
 * Where one dossier-approved candidate source currently sits in the
 * retrieval/verification pipeline. Deliberately distinct from
 * knowledge-graph.ts's sourceVerificationStatusSchema (UNVERIFIED/
 * VERIFIED/VERIFICATION_FAILED), which is about a source SNAPSHOT's
 * content being independently confirmed -- this is about whether THIS
 * package's own retrieval-and-locate step succeeded for a dossier
 * candidate at all. A source can reach RETRIEVAL_FAILED here without ever
 * registering a sourceVersion/sourceLocator record.
 */
export const sourceApprovalStatusSchema = z.enum([
  "APPROVED_NOT_VERIFIED",
  "VERIFIED",
  "RETRIEVAL_FAILED",
]);
export type SourceApprovalStatus = z.infer<typeof sourceApprovalStatusSchema>;

/**
 * Whether one specific required proposition/relationship/procedure/
 * symbol/recognition item (drawn verbatim from a Source-Acquisition
 * Manifest cluster) currently has adequate verified factual-authority
 * evidence. CONDITIONAL_SOURCE_GAP is distinct from SOURCE_GAP: it marks
 * a gap the approved dossier itself flagged as contingent on what a
 * specific approved source turns out to actually support (e.g.
 * statistical range, neutron neutrality) -- SOURCE_GAP is used for a gap
 * the dossier declares outright (e.g. the telephone master-socket
 * anatomy, the security-alarm topology).
 */
export const propositionCoverageStateSchema = z.enum([
  "VERIFIED",
  "SOURCE_GAP",
  "CONDITIONAL_SOURCE_GAP",
]);
export type PropositionCoverageState = z.infer<
  typeof propositionCoverageStateSchema
>;

/**
 * Mirrors the five required-knowledge array names on
 * sourceAcquisitionClusterSchema (./source-acquisition-manifest.ts) --
 * every proposition coverage record names which of the five it is
 * covering, so cross-checking against the real cluster data can confirm
 * the requirement actually exists there, verbatim, rather than being
 * invented during this package's own authoring.
 */
export const propositionRequirementKindSchema = z.enum([
  "FACTUAL_PROPOSITION",
  "RELATIONSHIP_OR_MECHANISM",
  "PROCEDURE_OR_CALCULATION_RULE",
  "SYMBOL_OR_CONVENTION",
  "PHYSICAL_OR_COMPONENT_RECOGNITION",
]);
export type PropositionRequirementKind = z.infer<
  typeof propositionRequirementKindSchema
>;

/**
 * One dossier-approved candidate source's tracking record: its stable
 * dossier identity (e.g. "SRC-BIPM-SI-9E-V4.01", exactly as the approved
 * dossier names it -- never invented or renamed by this package), the
 * governed source/sourceVersion/sourceLocator key it resolves to once
 * registered (or reused from an existing governed source -- see this
 * module's header), the dossier's own stated approved role (free text,
 * e.g. "PRIMARY SI factual authority" -- carried forward, not
 * reinterpreted), and this package's own retrieval outcome.
 *
 * CC-15B: the approved DOSSIER is candidate-level governance, not
 * source-level -- several approved dossier candidates may legitimately
 * resolve to the same governed source object (e.g. several approved
 * sections of one OpenStax volume). A candidate's own success must never
 * be inferable merely because a DIFFERENT candidate sharing the same
 * sourceKey happens to be VERIFIED. `verifiedSourceLocatorKeys` makes this
 * explicit: the exact locator(s) THIS candidate was actually verified
 * against, never inherited from a sibling candidate on the same source.
 */
export const approvedTechnicalSourceSchema = z
  .object({
    dossierSourceId: stableKey,
    sourceKey: stableKey,
    approvedRole: z.string().min(1),
    status: sourceApprovalStatusSchema,
    /** Required whenever status is RETRIEVAL_FAILED -- the precise, honest reason (404, paywall, JS-rendered/empty content, PDF parse failure, unexpected redirect), never papered over. */
    retrievalNote: z.string().min(1).optional(),
    /**
     * CC-15B: the exact sourceLocator key(s) this specific dossier
     * candidate was actually verified against. Required (>=1) whenever
     * status is VERIFIED -- a VERIFIED candidate that names no locator it
     * was actually checked against is exactly the source-level-only
     * ambiguity this field exists to close. Must be empty whenever status
     * is RETRIEVAL_FAILED or APPROVED_NOT_VERIFIED -- a candidate that
     * never succeeded can never claim a verified locator, regardless of
     * what any other candidate on the same source claims.
     */
    verifiedSourceLocatorKeys: z.array(stableKey).default([]),
  })
  .superRefine((s, ctx) => {
    if (s.status === "RETRIEVAL_FAILED" && !s.retrievalNote) {
      ctx.addIssue({
        code: "custom",
        path: ["retrievalNote"],
        message: `approved source '${s.dossierSourceId}' has status RETRIEVAL_FAILED but no retrievalNote explaining why -- a failure must be recorded, never silently dropped`,
      });
    }
    if (s.status === "VERIFIED" && s.verifiedSourceLocatorKeys.length === 0) {
      ctx.addIssue({
        code: "custom",
        path: ["verifiedSourceLocatorKeys"],
        message: `approved source '${s.dossierSourceId}' has status VERIFIED but names no verifiedSourceLocatorKeys -- a VERIFIED dossier candidate must explicitly name the exact locator(s) it was actually verified against`,
      });
    }
    if (s.status !== "VERIFIED" && s.verifiedSourceLocatorKeys.length > 0) {
      ctx.addIssue({
        code: "custom",
        path: ["verifiedSourceLocatorKeys"],
        message: `approved source '${s.dossierSourceId}' has status '${s.status}' but claims ${s.verifiedSourceLocatorKeys.length} verifiedSourceLocatorKeys -- only a VERIFIED dossier candidate may claim a verified locator binding`,
      });
    }
  });
export type ApprovedTechnicalSource = z.infer<
  typeof approvedTechnicalSourceSchema
>;

/**
 * One required proposition/relationship/procedure/symbol/recognition
 * item's coverage state, evidenced by zero or more source locators. A
 * VERIFIED record must cite at least one supporting locator (mechanical
 * proof that "VERIFIED" is never asserted without a source+locator
 * behind it); a gap record must state why.
 */
export const propositionCoverageRecordSchema = z
  .object({
    clusterKey: stableKey,
    requirementKind: propositionRequirementKindSchema,
    requirementText: z.string().min(1),
    coverageState: propositionCoverageStateSchema,
    supportingSourceLocatorKeys: z.array(stableKey).default([]),
    /** Required whenever coverageState is SOURCE_GAP or CONDITIONAL_SOURCE_GAP. */
    gapReason: z.string().min(1).optional(),
  })
  .superRefine((p, ctx) => {
    if (p.coverageState === "VERIFIED" && p.supportingSourceLocatorKeys.length === 0) {
      ctx.addIssue({
        code: "custom",
        path: ["supportingSourceLocatorKeys"],
        message: `proposition coverage for '${p.clusterKey}' ("${p.requirementText}") is VERIFIED but cites no supportingSourceLocatorKeys -- VERIFIED must never be asserted without at least one source locator as evidence`,
      });
    }
    if (
      (p.coverageState === "SOURCE_GAP" || p.coverageState === "CONDITIONAL_SOURCE_GAP") &&
      !p.gapReason
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["gapReason"],
        message: `proposition coverage for '${p.clusterKey}' ("${p.requirementText}") has coverageState ${p.coverageState} but no gapReason`,
      });
    }
  });
export type PropositionCoverageRecord = z.infer<
  typeof propositionCoverageRecordSchema
>;

export const technicalSourceVerificationManifestSchema = z
  .object({
    /** Identifies the approved dossier this package ingested (title/date/approver), never a knowledge assertion itself. */
    approvedDossierIdentity: z.string().min(1),
    sources: z.array(sourceManifestSchema),
    sourceVersions: z.array(sourceVersionManifestSchema),
    sourceLocators: z.array(sourceLocatorManifestSchema),
    approvedSources: z.array(approvedTechnicalSourceSchema).min(1),
    propositionCoverage: z.array(propositionCoverageRecordSchema).min(1),
  })
  .superRefine((manifest, ctx) => {
    const issue = (message: string, path: (string | number)[]) =>
      ctx.addIssue({ code: "custom", message, path });

    const sourceKeys = new Set(manifest.sources.map((s) => s.key));
    const sourceVersionKeys = new Set(manifest.sourceVersions.map((sv) => sv.key));
    const sourceLocatorKeys = new Set(manifest.sourceLocators.map((sl) => sl.key));

    const duplicateCheck = (label: string, values: readonly string[], path: string) => {
      const seen = new Set<string>();
      values.forEach((value, i) => {
        if (seen.has(value)) issue(`duplicate ${label} ${value}`, [path, i]);
        seen.add(value);
      });
    };
    duplicateCheck("source key", manifest.sources.map((s) => s.key), "sources");
    duplicateCheck("source version key", manifest.sourceVersions.map((sv) => sv.key), "sourceVersions");
    duplicateCheck("source locator key", manifest.sourceLocators.map((sl) => sl.key), "sourceLocators");
    duplicateCheck(
      "dossierSourceId",
      manifest.approvedSources.map((s) => s.dossierSourceId),
      "approvedSources",
    );

    manifest.sourceVersions.forEach((sv, i) => {
      if (!sourceKeys.has(sv.sourceKey)) {
        issue(`source version '${sv.key}' references unknown source ${sv.sourceKey}`, [
          "sourceVersions",
          i,
          "sourceKey",
        ]);
      }
    });

    manifest.sourceLocators.forEach((sl, i) => {
      if (!sourceVersionKeys.has(sl.sourceVersionKey)) {
        issue(
          `source locator '${sl.key}' references unknown source version ${sl.sourceVersionKey}`,
          ["sourceLocators", i, "sourceVersionKey"],
        );
      }
    });

    // This registry exists to establish FACTUAL_AUTHORITY evidence only --
    // never a curriculum-scope or assessment-evidence role. A source
    // registered here without that role (or with a different role) would
    // mean an awarding-body/curriculum source is being smuggled in as
    // technical factual authority, which the approved dossier explicitly
    // forbids (dossier section 2, "source-role separation").
    manifest.sources.forEach((s, i) => {
      if (s.sourceRole !== "FACTUAL_AUTHORITY") {
        issue(
          `source '${s.key}' in the technical-source-verification registry must carry sourceRole FACTUAL_AUTHORITY, found ${s.sourceRole ?? "unset"} -- this registry is not the place for NORMATIVE_CURRICULUM/OFFICIAL_ASSESSMENT/other-role sources`,
          ["sources", i, "sourceRole"],
        );
      }
    });

    manifest.approvedSources.forEach((s, i) => {
      if (!sourceKeys.has(s.sourceKey)) {
        issue(
          `approved source '${s.dossierSourceId}' references unknown source key ${s.sourceKey}`,
          ["approvedSources", i, "sourceKey"],
        );
      }
    });

    manifest.propositionCoverage.forEach((p, i) => {
      p.supportingSourceLocatorKeys.forEach((key, j) => {
        if (!sourceLocatorKeys.has(key)) {
          issue(
            `proposition coverage record (${p.clusterKey}: "${p.requirementText}") references unknown source locator ${key}`,
            ["propositionCoverage", i, "supportingSourceLocatorKeys", j],
          );
        }
      });
    });

    // VERIFIED-proposition trust chain (Project-Architect-mandated
    // hardening, refined to CANDIDATE level in CC-15B): a VERIFIED coverage
    // record citing a locator must never be trustable unless that EXACT
    // locator is explicitly bound, by an explicit verifiedSourceLocatorKeys
    // entry, to a dossier CANDIDATE whose own status is VERIFIED -- never
    // merely because SOME approved candidate on the same underlying source
    // happens to be VERIFIED (source-level trust, CC-15A's now-superseded
    // rule, was insufficiently precise: several approved candidates may
    // share one governed source, and a successful candidate for one section
    // must never launder a different, failed/unverified candidate's
    // locator). Generic (no Unit-202-specific IDs) -- a property of the
    // schema, not of any one dataset.
    const sourceVersionByKey = new Map(manifest.sourceVersions.map((sv) => [sv.key, sv]));
    const sourceLocatorByKey = new Map(manifest.sourceLocators.map((sl) => [sl.key, sl]));

    // Step 1: validate every VERIFIED candidate's own verifiedSourceLocatorKeys
    // bindings, and collect only the locators that survive full validation
    // into `candidateVerifiedLocatorKeys` -- the only locators a VERIFIED
    // proposition may ever cite as evidence.
    const candidateVerifiedLocatorKeys = new Set<string>();
    manifest.approvedSources.forEach((candidate, i) => {
      if (candidate.status !== "VERIFIED") return; // non-VERIFIED candidates are schema-enforced to have zero entries here
      candidate.verifiedSourceLocatorKeys.forEach((locatorKey, j) => {
        const path = ["approvedSources", i, "verifiedSourceLocatorKeys", j];
        const locator = sourceLocatorByKey.get(locatorKey);
        if (!locator) {
          issue(
            `approved source '${candidate.dossierSourceId}' verifiedSourceLocatorKeys references unknown source locator '${locatorKey}'`,
            path,
          );
          return;
        }
        const sourceVersion = sourceVersionByKey.get(locator.sourceVersionKey);
        if (!sourceVersion) return; // already reported as an unknown-sourceVersion issue above

        if (sourceVersion.verificationStatus !== "VERIFIED") {
          issue(
            `approved source '${candidate.dossierSourceId}' verifiedSourceLocatorKeys includes '${locatorKey}', whose source version '${sourceVersion.key}' has verificationStatus '${sourceVersion.verificationStatus}', not VERIFIED`,
            path,
          );
          return;
        }
        if (sourceVersion.sourceKey !== candidate.sourceKey) {
          issue(
            `approved source '${candidate.dossierSourceId}' declares sourceKey '${candidate.sourceKey}' but verifiedSourceLocatorKeys includes '${locatorKey}', which resolves through source version '${sourceVersion.key}' to a DIFFERENT source '${sourceVersion.sourceKey}' -- a candidate may only bind locators belonging to its own declared source`,
            path,
          );
          return;
        }
        candidateVerifiedLocatorKeys.add(locatorKey);
      });
    });

    // Step 2: every VERIFIED proposition's cited locator must be one of the
    // locators that survived step 1 -- explicitly bound to a VERIFIED
    // candidate, chain and all, never merely structurally present.
    manifest.propositionCoverage.forEach((p, i) => {
      if (p.coverageState !== "VERIFIED") return;
      p.supportingSourceLocatorKeys.forEach((locatorKey, j) => {
        if (candidateVerifiedLocatorKeys.has(locatorKey)) return;
        const path = ["propositionCoverage", i, "supportingSourceLocatorKeys", j];
        const locator = sourceLocatorByKey.get(locatorKey);
        if (!locator) return; // already reported as an unknown-locator issue above

        const boundCandidates = manifest.approvedSources.filter((s) => s.verifiedSourceLocatorKeys.includes(locatorKey));
        if (boundCandidates.length === 0) {
          issue(
            `VERIFIED proposition (${p.clusterKey}: "${p.requirementText}") cites locator '${locatorKey}', which is not bound (via verifiedSourceLocatorKeys) to ANY dossier candidate -- a structurally valid locator with no verified dossier-candidate binding can never back a VERIFIED proposition`,
            path,
          );
          return;
        }
        const nonVerifiedBinders = boundCandidates.filter((s) => s.status !== "VERIFIED");
        issue(
          nonVerifiedBinders.length > 0
            ? `VERIFIED proposition (${p.clusterKey}: "${p.requirementText}") cites locator '${locatorKey}', which is bound only to dossier candidate(s) with non-VERIFIED status (${nonVerifiedBinders.map((s) => `${s.dossierSourceId}=${s.status}`).join(", ")}) -- a RETRIEVAL_FAILED or APPROVED_NOT_VERIFIED candidate can never back a VERIFIED proposition, even if a different candidate on the same source is VERIFIED`
            : `VERIFIED proposition (${p.clusterKey}: "${p.requirementText}") cites locator '${locatorKey}', whose binding to a VERIFIED candidate failed chain validation (see the approvedSources-level issue reported above for this locator)`,
          path,
        );
      });
    });

    // A second record for the same clusterKey+requirementText would
    // silently overwrite the first in any Map-keyed consumer (e.g. the
    // validator's own coverageByKey index) -- catch it here rather than
    // let a duplicate coverage record silently mask a dropped requirement
    // or a smuggled-in second, more favourable coverageState.
    const seenRequirementKeys = new Set<string>();
    manifest.propositionCoverage.forEach((p, i) => {
      const key = `${p.clusterKey}::${p.requirementText}`;
      if (seenRequirementKeys.has(key)) {
        issue(
          `duplicate proposition coverage record for '${p.clusterKey}': "${p.requirementText}" -- a second record for the same requirement is never valid`,
          ["propositionCoverage", i],
        );
      }
      seenRequirementKeys.add(key);
    });
  });
export type TechnicalSourceVerificationManifest = z.infer<
  typeof technicalSourceVerificationManifestSchema
>;
