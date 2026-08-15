# CC-04N Implementation Consistency Audit

Bounded follow-up to the CC-04M repository-wide staleness audit
([`CC-04M-STALE-ASSUMPTION-AUDIT.md`](CC-04M-STALE-ASSUMPTION-AUDIT.md)),
scoped specifically to statements invalidated by the fact that
`apps/mobile` now genuinely exists (CC-04N). This is **not** a repeat of
the original 47-finding repository-wide sweep. CC-04M's own evidence file
was left unedited to preserve historical accuracy, per the Documentation
Standard's historical-material rule (it accurately described the state
before CC-04N existed) — this is a new, separate evidence file for the
same reason CC-04M's own correction passes used separate/append-only
records rather than rewriting prior findings.

## Audit metadata

```yaml
audit_id: CC-04N
audit_date: 2026-08-15
scope: >
  Statements assuming apps/mobile does not yet exist, is only planned,
  or is hypothetical. Searched: tracked documentation (docs/, README.md,
  PROJECT-STATUS.md, apps/mobile/README.md), CI configuration
  (.github/workflows/ci.yml), and package topology descriptions.
concepts_searched:
  - "future mobile app"
  - "mobile app does not yet exist"
  - "planned apps/mobile"
  - "proposed mobile client"
  - "no native implementation"
  - "future Expo app"
  - CI statements implying only web exists
  - package topology diagrams showing mobile as hypothetical
  - README/setup instructions omitting the mobile workspace
```

## Findings

```yaml
findings:
  - finding_id: CC04N-AUD-001
    file: README.md
    locator: "Development setup section, 'Other root commands' line, apps/ description"
    matched_concept: "README/setup instructions omitting the mobile workspace"
    classification: STALE_UPDATE
    action: UPDATED
    before_summary: >
      Development setup only documented `npm run dev` (web) and web-only
      root commands; the apps/ description only named apps/web; no
      mention of apps/mobile existed anywhere in the file.
    after_summary: >
      Added a note that `npm run dev` starts the secondary web client
      specifically, listed the new mobile root commands
      (dev:mobile/mobile:android/mobile:ios/mobile:test/check:mobile-boundary),
      updated the apps/ description to name both apps/web (secondary) and
      apps/mobile (primary), and added a new "Local mobile app (CC-04N)"
      section with minimal setup commands, pointing to
      apps/mobile/README.md for the full workflow.
    rationale: >
      This was accurate when apps/mobile did not exist; now that it does,
      a reader following only the root README would not discover the
      primary learner client at all.

  - finding_id: CC04N-AUD-002
    file: docs/architecture/MOBILE-ARCHITECTURE.md
    locator: "§1 Client/backend topology, 'Conceptual target (not created by this document)'"
    matched_concept: "package topology diagrams showing mobile as hypothetical"
    classification: CURRENT
    action: NONE
    before_summary: >
      The target monorepo topology (apps/mobile, apps/web, packages list)
      is introduced as "Conceptual target (not created by this document)".
    after_summary: null
    rationale: >
      Re-read carefully: this is a true, self-referential scope statement
      about the ARCHITECTURE DOCUMENT itself ("this document" = the spec,
      which correctly never creates code) -- not a claim that apps/mobile
      does not exist in the repository. It remains accurate: MOBILE-ARCHITECTURE.md
      still does not create apps/mobile; CC-04N (a separate implementation
      task) did. Per the CC-04N task brief's own instruction ("Do not
      rewrite CC-04M architecture just because implementation details now
      exist. Architecture describes intended durable structure.
      Implementation documentation describes what actually exists now."),
      this is correctly left alone -- the "what actually exists now" fact
      belongs in PROJECT-STATUS.md and this evidence file, not in the
      architecture document.

  - finding_id: CC04N-AUD-003
    file: docs/architecture/MOBILE-ARCHITECTURE.md
    locator: "§1, packages/mobile-ui list entry"
    matched_concept: "package topology diagrams showing mobile as hypothetical"
    classification: CURRENT
    action: NONE
    before_summary: "packages/mobile-ui listed as 'likely future -- native component package for apps/mobile'."
    after_summary: null
    rationale: >
      Still accurate: CC-04N deliberately did not create packages/mobile-ui
      (native UI/design-token constants live directly in
      apps/mobile/src/lib/tokens.ts for this foundation-scale shell,
      explicitly labelled as not the final design system -- see
      CC-04N-MOBILE-FOUNDATION-EVIDENCE.md §6). No stale claim here.

  - finding_id: CC04N-AUD-004
    file: docs/architecture/MOBILE-ARCHITECTURE.md
    locator: "§Purpose, 'No mobile application, dependency, or build/release credential is created by this document.'"
    matched_concept: "no native implementation"
    classification: CURRENT
    action: NONE
    before_summary: "States the architecture document itself creates no mobile app/dependency/credential."
    after_summary: null
    rationale: >
      Still true of the document itself (self-referential, same reasoning
      as CC04N-AUD-002). apps/mobile now exists because of CC-04N's
      separate implementation work, not because this sentence became false.

  - finding_id: CC04N-AUD-005
    file: PROJECT-STATUS.md
    locator: "CC-04M closure section, 'No mobile app, dependency, or app-store/signing credential was created as part of CC-04M'"
    matched_concept: "no native implementation"
    classification: HISTORICAL_PRESERVE
    action: NONE
    before_summary: "Accurately records that CC-04M (specifically) created no mobile app."
    after_summary: null
    rationale: >
      Historically accurate statement about CC-04M's own scope, correctly
      scoped by name to that closed stage. Must not be rewritten as though
      it were a claim about current repository state -- CC-04N's own
      section (added separately) is where current state belongs.

  - finding_id: CC04N-AUD-006
    file: .github/workflows/ci.yml
    locator: "checks job"
    matched_concept: "CI statements implying only web exists"
    classification: STALE_UPDATE
    action: UPDATED
    before_summary: >
      The fast checks job ran typecheck/lint/unit-tests/build across the
      npm workspace (which would have silently included apps/mobile once
      it existed, via --workspaces --if-present, but performed no
      mobile-specific validation: no Jest run, no Expo config sanity
      check, no Metro bundle validation, no mobile/web boundary check).
    after_summary: >
      Added explicit steps: check:mobile-boundary, mobile:test (Jest),
      expo-doctor, and expo export for both platforms (Metro bundle
      validation, no native SDK required, ~15-25s each). No native
      cloud build (EAS) was added -- that remains a deliberately separate,
      manual, future tier per the task's cost/economics guidance.
    rationale: >
      Typecheck/lint were already workspace-wide and did cover apps/mobile
      mechanically, but nothing exercised the mobile-specific proofs
      (shared-package runtime proof, SQLite/outbox logic, component
      tests, Metro/Hermes bytecode compilation) that this task's Part 10/11
      identifies as the most important CC-04N acceptance evidence.

  - finding_id: CC04N-AUD-007
    file: docs/security/SECURITY-VERIFICATION-MATRIX.md
    locator: "whole file, prior to this task"
    matched_concept: "no native implementation"
    classification: STALE_UPDATE
    action: UPDATED
    before_summary: "No row existed covering native-client secrets, session storage, or the new mobile/web boundary control."
    after_summary: >
      Added SEC-M-010 (no privileged secret in mobile client), SEC-M-011
      (native session storage), SEC-M-012 (mobile/web UI boundary control),
      and SEC-M-006b (the image-size dependency-audit exception, disclosed
      honestly rather than silently worked around).
    rationale: >
      These are genuinely new evidence created by CC-04N implementation,
      not previously assessable because apps/mobile did not exist.
```

## Unresolved contradictions

```yaml
unresolved_contradictions: []
```

None found. No document was found asserting apps/mobile does not exist, is purely hypothetical, or that only the web client exists, after the corrections above (CC04N-AUD-001, 006, 007). The remaining "no mobile app created" statements (CC04N-AUD-002/003/004/005) are correctly scoped self-referential or historical statements, not blanket current-state claims, and were deliberately left unedited.

## Coverage

```yaml
coverage:
  files_checked:
    - README.md
    - PROJECT-STATUS.md
    - docs/architecture/MOBILE-ARCHITECTURE.md
    - docs/architecture/ARCHITECTURE-OVERVIEW.md (grepped, no relevant hits beyond CC-04M's own prior corrections)
    - docs/architecture/adr/ADR-0001-mobile-client-technology.md (grepped, no relevant hits)
    - docs/product/MOBILE-UX-ENGINEERING-STANDARD.md (grepped, no relevant hits)
    - docs/development/DEVELOPMENT-WORKFLOW.md (grepped, no web/mobile-specific content at all)
    - docs/development/AI-DEVELOPMENT-PROTOCOL.md (already correctly split web/native by CC-04M; re-checked, still accurate)
    - docs/security/SECURITY-VERIFICATION-MATRIX.md
    - .github/workflows/ci.yml
    - apps/mobile/README.md (new document, not a staleness target)
  method: >
    Targeted grep for the concept list above across the files most likely
    to make client-existence claims, followed by manual read-in-context
    classification of every hit. Not a repository-wide re-sweep of the
    original CC-04M audit's ~130 raw keyword hits.
```
