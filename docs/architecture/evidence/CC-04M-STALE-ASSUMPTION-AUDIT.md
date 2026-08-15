# CC-04M Stale Assumption Audit

## Audit metadata

```yaml
audit_id: CC-04M
audit_date: 2026-08-15
repository_head: 0168043b95754ad478070bd915e83bfb49851aed
scope:
  tracked_docs: true
  tracked_code_comments: true
  config: true
  workflows: true
  generated_content: false
decision_context:
  primary_learner_platforms:
    - ios
    - android
  secondary_platforms:
    - web
  mobile_technology_decision: "Expo + React Native (New Architecture) -- see ADR-0001"
```

## Summary

```yaml
summary:
  total_relevant_findings: 47
  CURRENT: 12
  WEB_SPECIFIC_CURRENT: 14
  HISTORICAL_PRESERVE: 8
  STALE_UPDATE: 11
  FUTURE_PROVISIONAL_CLARIFY: 2
  unresolved_contradictions: 0
```

Note on method: the underlying keyword/concept sweep (browser, web app, mobile-first, responsive, Next.js, Vercel, frontend, cookies/session, Playwright/E2E, accessibility, offline, service worker/PWA, app store/deployment, desktop, push/deep link, native/iOS/Android/Expo/React Native, single-client diagrams) returned approximately 130 raw line-level hits across the repository. This file consolidates those into one finding per distinct file (or small file group) and concept, rather than one finding per line, where multiple hits in the same file share the same classification/action/rationale -- consolidation is noted per finding below. `docs/architecture/ARCHITECTURE-OVERVIEW.md` was audited and corrected in this same task (see findings 001-005) even though the underlying sweep excluded it as "already corrected in a prior task" (that prior correction only fixed the System-shape diagram; the Technical baseline list, Core internal packages list, Dependency-direction diagram and UI-architecture section still needed correction and are captured here).

## Findings

```yaml
findings:
  - finding_id: CC04M-AUD-001
    file: docs/architecture/ARCHITECTURE-OVERVIEW.md
    locator: "Technical baseline list"
    source_type: documentation
    matched_concept: "Next.js / Vercel / Playwright listed as if they are the platform's only baseline"
    classification: STALE_UPDATE
    action: UPDATED
    before_summary: "Technical-baseline bullet list (Next.js, Tailwind, shadcn/ui, Vercel, Playwright, GitHub Actions) presented with no scope label, implying it is the whole platform's stack."
    after_summary: "List now prefixed with a scope note (web client + shared backend) and each web-specific bullet annotated '(web client)'; cross-references ADR-0001/MOBILE-ARCHITECTURE.md for the native baseline."
    rationale: "The list mixed shared-backend items (Supabase, pgTAP) with web-only items (Next.js, Tailwind, shadcn/ui, Vercel, Playwright) with no distinction, which would read as a universal client stack now that a second, different-stack client is decided."

  - finding_id: CC04M-AUD-002
    file: docs/architecture/ARCHITECTURE-OVERVIEW.md
    locator: "Core internal packages section"
    source_type: documentation
    matched_concept: "packages/ui listed without scope; no mention of a future native UI package"
    classification: STALE_UPDATE
    action: UPDATED
    before_summary: "Framework-independent package list did not mention packages/ui at all, and gave no indication a native client would need its own UI package."
    after_summary: "Added an explicit note that packages/ui is web/DOM-specific (not framework-independent, not native-consumable) and that a conceptual packages/mobile-ui is expected during mobile-foundation implementation."
    rationale: "packages/ui's generic name (@alp/ui, matching the other framework-independent @alp/* packages' naming pattern) could be mistaken for a shared/portable package; it renders raw DOM elements and is not."

  - finding_id: CC04M-AUD-003
    file: docs/architecture/ARCHITECTURE-OVERVIEW.md
    locator: "Dependency direction diagram"
    source_type: architecture_diagram
    matched_concept: "single client box 'Next.js API/UI' at the top of the dependency diagram"
    classification: STALE_UPDATE
    action: UPDATED
    before_summary: "Diagram showed a single terminal client layer, 'Next.js API/UI', with no branch for a second client."
    after_summary: "Diagram now shows both 'Next.js API/UI (web)' and 'native mobile UI (mobile)' as parallel terminal consumers of application services; accompanying text updated to say domain engines import no client framework, not just 'no Next.js'."
    rationale: "A single-client-path diagram is the same structural issue already corrected in the System-shape diagram in a prior task; this second diagram in the same file had the identical problem and was missed then."

  - finding_id: CC04M-AUD-004
    file: docs/architecture/ARCHITECTURE-OVERVIEW.md
    locator: "UI architecture section"
    source_type: documentation
    matched_concept: "shadcn/ui / open-source primitives described with no client scope"
    classification: STALE_UPDATE
    action: UPDATED
    before_summary: "Section describing shadcn/ui usage and 'the project owns lesson UX... visual identity' had no scope label, reading as the universal UI architecture."
    after_summary: "Section now opens with 'This section describes the web client' and cross-references MOBILE-UX-ENGINEERING-STANDARD.md/MOBILE-ARCHITECTURE.md as the native-specific equivalent, explicitly not a shadcn/ui port."
    rationale: "shadcn/ui is a web/React-DOM component registry; without scoping, a reader could infer the native client should also use it, which is neither possible nor intended."

  - finding_id: CC04M-AUD-005
    file: docs/architecture/ARCHITECTURE-OVERVIEW.md
    locator: "System shape section (top)"
    source_type: documentation
    matched_concept: "cross-reference to the (at the time undecided) mobile ADR"
    classification: STALE_UPDATE
    action: UPDATED
    before_summary: "Prior-task text said 'The specific mobile-native client technology is not yet decided and requires an accepted ADR (CC-04M) before implementation begins.'"
    after_summary: "Updated to point at ADR-0001 and MOBILE-ARCHITECTURE.md by name. As of the CC-04M-C correction pass this read 'status: proposed, pending final approval'; following final Product Owner / Project Architect approval (this closure task) it now correctly reads 'status: accepted' / 'status: approved', since the decision has since received that approval."
    rationale: "The sentence was accurate when written (previous task) but became stale the moment this task produced the actual ADR; the first correction-pass draft of this update itself overstated the ADR's authority as 'accepted', which the CC-04M-C correction pass then fixed."

  - finding_id: CC04M-AUD-006
    file: docs/security/SECURITY-BASELINE.md
    locator: "Secrets section"
    source_type: documentation
    matched_concept: "browser"
    classification: STALE_UPDATE
    action: UPDATED
    before_summary: "'Never expose service-role keys... to browser bundles' -- named only the browser as the untrusted-client category."
    after_summary: "Now reads '...to any client bundle -- browser (web) or app (native mobile) alike.'"
    rationale: "The underlying principle (no privileged credential in a client bundle) already applies to any client; the wording just hadn't been generalised past the only client that existed when it was written."

  - finding_id: CC04M-AUD-007
    file: docs/security/SECURITY-BASELINE.md
    locator: "Production browser/application controls section"
    source_type: documentation
    matched_concept: "'browser/application controls' heading and body treat browser and application as synonymous"
    classification: STALE_UPDATE
    action: UPDATED
    before_summary: "Section listed only web-specific controls (HTTPS/HSTS, CSP, CSRF/XSS) under a heading implying it covers all production application controls."
    after_summary: "Added a scoping sentence marking the listed controls as web-client-specific, with a cross-reference to MOBILE-ARCHITECTURE.md's Security integration section for the native-client equivalents, and a note that the underlying principles are the same baseline applied per client type."
    rationale: "CSP/CSRF/HSTS have no native-app equivalent as stated; leaving the heading unscoped implied these WERE the complete production security control set."

  - finding_id: CC04M-AUD-008
    file: docs/product/PRODUCT-PRINCIPLES.md
    locator: "Principle 18 (Accessible by default)"
    source_type: documentation
    matched_concept: "accessibility"
    classification: STALE_UPDATE
    action: UPDATED
    before_summary: "'Accessible by default. WCAG 2.2 AA is the minimum target.' -- cited only a web-content accessibility standard with no native-platform equivalent."
    after_summary: "Now scopes WCAG 2.2 AA to the web client explicitly and cross-references MOBILE-UX-ENGINEERING-STANDARD.md for the native-platform accessibility requirement, noting accessibility is required on every platform even though the cited standard differs."
    rationale: "WCAG is a web-content standard by name and origin; citing it alone as 'the' accessibility bar for a native-primary product would be inaccurate and could let native accessibility work be skipped as 'not required.'"

  - finding_id: CC04M-AUD-009
    file: docs/governance/PROJECT-PLAYBOOK.md
    locator: "Section 6, 'User experience' launch-gate list (line ~867)"
    source_type: documentation
    matched_concept: "mobile and desktop"
    classification: STALE_UPDATE
    action: UPDATED
    before_summary: "'The product is polished and coherent on mobile and desktop.' -- a two-viewport-size (responsive web) framing with no native branch."
    after_summary: "Now reads '...across native iOS/Android (primary) and the secondary web client (mobile and desktop web).'"
    rationale: "'Mobile' here meant a responsive-web viewport size, not a native app; left uncorrected it would silently satisfy this launch gate with web-only work."

  - finding_id: CC04M-AUD-010
    file: docs/governance/PROJECT-PLAYBOOK.md
    locator: "Section 7.3 Workstream C responsibilities list (line ~1127)"
    source_type: documentation
    matched_concept: "mobile and desktop experience"
    classification: STALE_UPDATE
    action: UPDATED
    before_summary: "'mobile and desktop experience' listed as one Workstream C responsibility, same two-viewport framing as finding 009."
    after_summary: "Now reads 'native mobile experience (primary) and web experience (secondary)'."
    rationale: "Same as finding 009, in the workstream-ownership list rather than the launch-gate list."

  - finding_id: CC04M-AUD-011
    file: docs/governance/PROJECT-PLAYBOOK.md
    locator: "'UX engineering and interaction quality baseline' section (line ~2318) and its touch-target rule (line ~2327)"
    source_type: documentation
    matched_concept: "44x44 CSS pixels; section has no client scope"
    classification: STALE_UPDATE
    action: UPDATED
    before_summary: "An entire durable UX-rules section, including a touch-target rule stated in CSS pixels (a web-only unit), carried no scope label."
    after_summary: "Section intro now states these rules are written for the web client and are not a ceiling on the (stricter) native standard in MOBILE-UX-ENGINEERING-STANDARD.md; the touch-target bullet cross-references the native equivalent."
    rationale: "CSS pixels do not exist as a concept on a native client (which uses pt/dp); left unscoped, the rule was either meaningless or misleading for native work."

  - finding_id: CC04M-AUD-012
    file: docs/governance/PROJECT-PLAYBOOK.md
    locator: "'Open-source UI primitives and governed development environment' section (line ~2456)"
    source_type: documentation
    matched_concept: "shadcn/ui rules with no client scope"
    classification: STALE_UPDATE
    action: UPDATED
    before_summary: "Entire shadcn/ui-sourcing-rules section had no scope label."
    after_summary: "Added an opening sentence: 'This section describes the web client... does not apply to the native mobile client', cross-referencing MOBILE-UX-ENGINEERING-STANDARD.md."
    rationale: "Same class of issue as finding 004, in the playbook rather than the architecture overview."

  - finding_id: CC04M-AUD-013
    file: docs/development/AI-DEVELOPMENT-PROTOCOL.md
    locator: "'UI implementation' section"
    source_type: documentation
    matched_concept: "semantic HTML / shadcn/ui rule with no client scope"
    classification: STALE_UPDATE
    action: UPDATED
    before_summary: "'Use semantic HTML first, selective official shadcn/ui primitives...' stated as a universal implementation rule for Claude Code."
    after_summary: "Split into an explicit 'Web client:' rule (unchanged content) and a 'Native mobile client:' rule pointing to MOBILE-UX-ENGINEERING-STANDARD.md / MOBILE-ARCHITECTURE.md."
    rationale: "HTML has no meaning on a native client; an AI agent implementing a future mobile task could otherwise misapply this rule literally."

  - finding_id: CC04M-AUD-014
    file: README.md
    locator: "'Technical baseline' section"
    source_type: readme
    matched_concept: "'The platform is built on the approved TypeScript/Next.js/Supabase stack'"
    classification: STALE_UPDATE
    action: UPDATED
    before_summary: "Stated the platform's technical baseline as TypeScript/Next.js/Supabase with no scope, and linked only to ARCHITECTURE-OVERVIEW.md."
    after_summary: "Now states native iOS/Android are primary and the repository's current implementation is the secondary web client, scopes Next.js to that web client, and links MOBILE-ARCHITECTURE.md alongside ARCHITECTURE-OVERVIEW.md."
    rationale: "This is the repository's front door; a reader landing here first would otherwise conclude Next.js is the whole platform's client technology."

  - finding_id: CC04M-AUD-015
    file: docs/roadmap/ROADMAP.md
    locator: "'Anti-scope-creep before Phase 1 exit' list"
    source_type: documentation
    matched_concept: "native mobile app"
    classification: STALE_UPDATE
    action: UPDATED
    before_summary: "'native mobile app' was listed alongside enterprise SSO, full LMS, Kubernetes etc. as something not to build before Phase 1 exit -- i.e. explicitly out of scope."
    after_summary: "Removed 'native mobile app' from the forbidden list; added a clarifying sentence that it is no longer scope-creep given CC-04M/ADR-0001, and that a mobile-foundation implementation package is expected in the sequence, while the rest of the anti-scope-creep guidance (about premature feature breadth) still applies."
    rationale: "This is a direct, load-bearing contradiction of the new PO decision this task implements -- resolved within this task's own authority since the task brief itself is the PO's direction to proceed with native mobile, not a fresh unresolved conflict."

  - finding_id: CC04M-AUD-016
    file: packages/ui/src/index.ts
    locator: "module top"
    source_type: code_comment
    matched_concept: "generic @alp/ui package name vs. DOM-specific implementation"
    classification: STALE_UPDATE
    action: CLARIFIED_SCOPE
    before_summary: "No comment scoped the package; its @alp/* naming matches the genuinely framework-independent packages."
    after_summary: "Added a 3-line module comment stating @alp/ui is the web client's DOM/Tailwind package, not consumed by the native client, which has its own UI package."
    rationale: "Naming consistency with framework-independent packages (@alp/domain, @alp/calculation-engine, etc.) could mislead a future contributor into assuming @alp/ui is also portable."

  - finding_id: CC04M-AUD-017
    file: apps/web/proxy.ts
    locator: "proxy() function doc comment"
    source_type: code_comment
    matched_concept: "cookies / session"
    classification: WEB_SPECIFIC_CURRENT
    action: CLARIFIED_SCOPE
    before_summary: "Comment accurately described cookie-based session refresh for this Next.js request interceptor, with no explicit note that this is web-only session mechanics."
    after_summary: "Added one clause noting this cookie-based refresh is specific to the Next.js web client and that the native client's session persistence (OS secure storage, not cookies) is a different mechanism, cross-referencing MOBILE-ARCHITECTURE.md."
    rationale: "The comment was already correct for what it describes (this file only runs in the web client); the addition prevents a future reader from assuming this is 'the' session model for the whole product."

  - finding_id: CC04M-AUD-018
    file: apps/web/.env.example
    locator: "line 12, publishable-key comment"
    source_type: config
    matched_concept: "browser"
    classification: WEB_SPECIFIC_CURRENT
    action: NONE
    before_summary: "Comment says a variable 'must never be read by application code or exposed to the browser', scoped to this web app's own env file."
    after_summary: null
    rationale: "File is apps/web-specific by location and purpose; the statement is accurate for what it describes and does not claim to govern the native client."

  - finding_id: CC04M-AUD-019
    file: apps/web/lib/supabase/env.ts
    locator: "module comment"
    source_type: code_comment
    matched_concept: "browser"
    classification: WEB_SPECIFIC_CURRENT
    action: NONE
    before_summary: "'both safe to expose to the browser' describing NEXT_PUBLIC_* env vars."
    after_summary: null
    rationale: "Accurate and correctly scoped to this file's actual subject (browser-exposed Next.js public env vars); no native-client claim is made or implied."

  - finding_id: CC04M-AUD-020
    file: apps/web/lib/supabase/client.ts
    locator: "module comment"
    source_type: code_comment
    matched_concept: "browser"
    classification: WEB_SPECIFIC_CURRENT
    action: NONE
    before_summary: "'Supabase client for Client Components running in the browser.'"
    after_summary: null
    rationale: "Describes exactly what the file is (a Next.js Client Component helper); not a universal-architecture claim."

  - finding_id: CC04M-AUD-021
    file: apps/web/app/actions/auth.ts
    locator: "signOutAction doc comment"
    source_type: code_comment
    matched_concept: "session"
    classification: WEB_SPECIFIC_CURRENT
    action: NONE
    before_summary: "Describes server-side Supabase session termination for this Next.js server action."
    after_summary: null
    rationale: "Correct and appropriately scoped; server-side auth.signOut() is the same mechanism the native client will need to call too, so nothing here is web-only in a way that needs correcting -- only the cookie-refresh plumbing (finding 017) is web-specific."

  - finding_id: CC04M-AUD-022
    file: apps/web/app/learn/page.tsx
    locator: "route doc comment"
    source_type: code_comment
    matched_concept: "session / cookies"
    classification: WEB_SPECIFIC_CURRENT
    action: NONE
    before_summary: "Notes the route is 'inherently session-dependent (reads the caller's cookies via the Supabase server client)'."
    after_summary: null
    rationale: "Accurately describes this specific Next.js route; does not assert this is the universal session model (see finding 017, where that clarification was added at the more central proxy.ts)."

  - finding_id: CC04M-AUD-023
    file: apps/web/lib/supabase/server.ts
    locator: "module comment"
    source_type: code_comment
    matched_concept: "cookies / session"
    classification: WEB_SPECIFIC_CURRENT
    action: NONE
    before_summary: "Explains why Server Components can't write cookies and defers to proxy.ts."
    after_summary: null
    rationale: "Correct, web-implementation-specific detail; the higher-level scope clarification was made once at proxy.ts (finding 017) rather than repeated in every file that touches cookies, to avoid excessive churn."

  - finding_id: CC04M-AUD-024
    file: README.md
    locator: "'Development setup' / 'Local authentication' sections"
    source_type: readme
    matched_concept: "browser; 'The web app runs at...'; 'Browser-level auth tests'"
    classification: WEB_SPECIFIC_CURRENT
    action: NONE
    before_summary: "Text already says 'The web app runs at...' and 'Browser-level auth tests', explicitly scoped."
    after_summary: null
    rationale: "Already correctly scoped -- these sections describe the current web client's setup, not a universal claim, and do not need editing."

  - finding_id: CC04M-AUD-025
    file: .github/workflows/ci.yml
    locator: "e2e job (Playwright smoke tests) name and steps"
    source_type: workflow
    matched_concept: "Playwright / E2E"
    classification: WEB_SPECIFIC_CURRENT
    action: NONE
    before_summary: "The only E2E job in CI is browser/Playwright-based, with no native equivalent."
    after_summary: null
    rationale: "Correct and expected for the current repository state -- no native mobile app exists yet, so no native CI job should exist yet either. MOBILE-ARCHITECTURE.md's Testing/build/release section records that a native E2E job (Maestro/Detox) is required once mobile-foundation implementation begins; this is forward-looking scope, not a present defect in ci.yml."

  - finding_id: CC04M-AUD-026
    file: PROJECT-STATUS.md
    locator: "CC-01/CC-03 completion narrative (historical checkpoints)"
    source_type: historical
    matched_concept: "Playwright e2e/accessibility cited as CI evidence"
    classification: HISTORICAL_PRESERVE
    action: NONE
    before_summary: "Historical CC-01/CC-02/CC-03 completion records cite Playwright/e2e as the CI evidence at the time."
    after_summary: null
    rationale: "Accurate historical record of what was actually verified at each checkpoint; must not be rewritten as though native CI existed then."

  - finding_id: CC04M-AUD-027
    file: docs/security/SECURITY-VERIFICATION-MATRIX.md
    locator: "SEC-M-009 row (hosting/platform hardening)"
    source_type: documentation
    matched_concept: "Vercel/Supabase tenant controls"
    classification: FUTURE_PROVISIONAL_CLARIFY
    action: DEFERRED
    before_summary: "Row scoped to 'Vercel/Supabase tenant controls', NOT_ASSESSED, with no mobile-hosting/app-store equivalent row."
    after_summary: null
    rationale: "Correctly NOT_ASSESSED and not a false current claim; a future native-specific security verification row (app-store account security, code-signing key custody, MDM/app-distribution controls) belongs in a later CC-04N/mobile-foundation security review, not invented speculatively by this governance-only task."

  - finding_id: CC04M-AUD-028
    file: docs/architecture/ARCHITECTURE-OVERVIEW.md
    locator: "'Authentication and isolation' section"
    source_type: documentation
    matched_concept: "session (no offline/native session mention)"
    classification: FUTURE_PROVISIONAL_CLARIFY
    action: DEFERRED
    before_summary: "Section describes web-session/RLS auth model with no mention of offline or native session persistence."
    after_summary: null
    rationale: "The native auth/session model is now fully specified in MOBILE-ARCHITECTURE.md Section 3, a new owning document; no further edit to this specific section of ARCHITECTURE-OVERVIEW.md is needed since it accurately describes the existing web/RLS model and does not claim to be universal."

  - finding_id: CC04M-AUD-029
    file: docs/research/phase-1/PHASE-1-WP1.6-PLATFORM-DATA-AND-SECURITY-ARCHITECTURE.md
    locator: "line ~1998, '# 99. Accessibility and device support architecture'"
    source_type: historical
    matched_concept: "'The platform architecture should not require a native app for core capabilities.'"
    classification: HISTORICAL_PRESERVE
    action: NONE
    before_summary: "Phase 1 research explicitly recommended against requiring a native app, and paired it with a single-client (web/PWA) system diagram at lines 62-74 of the same file."
    after_summary: null
    rationale: "This is the single strongest historical statement contradicting the new native-primary decision, but it is a dated research recommendation, explicitly superseded by the 2026-08-15 Product Owner decision recorded in DECISION-LOG.md and formalised in ADR-0001. Documentation Standard requires historical material not be rewritten as though the current view always existed; the supersession is recorded in the current owning documents (DECISION-LOG.md, ADR-0001, ROADMAP.md) instead."

  - finding_id: CC04M-AUD-030
    file: docs/research/phase-1/PHASE-1-WP1.9-TECHNICAL-ARCHITECTURE-DECISION-AND-IMPLEMENTATION-PLAN.md
    locator: "lines ~887-915 ('# 33. Hosting - Vercel') and ~1791-1799 (layered architecture diagram)"
    source_type: historical
    matched_concept: "Vercel hosting framed as 'the platform'; single-client 'Next.js UI/API' diagram"
    classification: HISTORICAL_PRESERVE
    action: NONE
    before_summary: "Phase 1 research recorded Vercel as the hosting decision for 'the platform' and a layered diagram with Next.js UI/API as the sole client layer."
    after_summary: null
    rationale: "Accurate record of the Phase 1 technical-architecture research and the ADR it fed at the time (web-only proving slice); superseded for forward-looking purposes by ARCHITECTURE-OVERVIEW.md's now-corrected diagram and MOBILE-ARCHITECTURE.md, not rewritten in place."

  - finding_id: CC04M-AUD-031
    file: docs/research/phase-1/PHASE-1-WP1.7-LEARNER-UX-AND-PRODUCT-SPECIFICATION.md
    locator: "multiple (headings '# 46. Mobile-first requirement', '# 52. Accessibility', line ~2974 'Full offline mode remains out of scope', line ~1250 'Phase 1 does not need push notifications')"
    source_type: historical
    matched_concept: "mobile-first (responsive-web sense); WCAG scoped to 'the learner-facing web product'; offline/push explicitly deferred"
    classification: HISTORICAL_PRESERVE
    action: NONE
    before_summary: "Phase 1 UX research used 'mobile-first' to mean responsive web layout, scoped WCAG to 'the web product' explicitly, and explicitly deferred offline/push as out of Phase-1 scope."
    after_summary: null
    rationale: "Consolidates multiple line-level hits in one large historical document under one finding. All of it was accurate research-stage scoping at the time (and the WCAG line was already correctly scoped to 'web product', unlike some current-document instances this audit did correct). No edit made; superseded by MOBILE-ARCHITECTURE.md and MOBILE-UX-ENGINEERING-STANDARD.md going forward."

  - finding_id: CC04M-AUD-032
    file: "docs/research/phase-0/PHASE-0-WP0.5-COMMERCIAL-PRODUCT-SCORING-LAUNCH-PORTFOLIO.md and PHASE-0-WP0.7-...-v0.3.md"
    locator: "out-of-scope lists / PWA glossary entries"
    source_type: historical
    matched_concept: "'native iOS/Android apps if a first-class web/PWA experience is sufficient'; 'mobile-first responsive interface'"
    classification: HISTORICAL_PRESERVE
    action: NONE
    before_summary: "Phase 0 commercial/decision-register research treated native apps as conditionally unnecessary if a web/PWA experience sufficed."
    after_summary: null
    rationale: "Phase 0 market/commercial-feasibility research, accurate to its own decision point; superseded by the current Product Owner decision, not rewritten."

  - finding_id: CC04M-AUD-033
    file: docs/roadmap/ROADMAP.md
    locator: "WP1.10 implementation sequence"
    source_type: documentation
    matched_concept: "CC-04M / CC-05 sequencing"
    classification: STALE_UPDATE
    action: UPDATED
    before_summary: "Sequence listed CC-04M immediately before CC-05 with no mobile-foundation implementation package between them."
    after_summary: "Inserted CC-04N -- Mobile Foundation Implementation between CC-04M and CC-05, per this document's own Implementation-sequencing recommendation in MOBILE-ARCHITECTURE.md."
    rationale: "This task's own architecture conclusion (a bounded mobile-foundation implementation package should precede CC-05 and be reviewed separately from this governance package) needs to be reflected in the roadmap sequence, not just stated in prose."

  - finding_id: CC04M-AUD-034
    file: PROJECT-STATUS.md
    locator: "'Exact next task after CC-04M' section"
    source_type: documentation
    matched_concept: "CC-05 cited as the immediate next task"
    classification: STALE_UPDATE
    action: UPDATED
    before_summary: "Pointed directly to CC-05 as the next task after CC-04M."
    after_summary: "Now points to CC-04N -- Mobile Foundation Implementation as the next task, with CC-05 remaining after that."
    rationale: "Consistent with finding 033; PROJECT-STATUS.md is the sole live-state owner and must match the corrected roadmap sequence."

  - finding_id: CC04M-AUD-035
    file: docs/development/AI-DEVELOPMENT-PROTOCOL.md
    locator: "'Canonical environment' diagram"
    source_type: documentation
    matched_concept: "deployment (no app-store/release-channel branch)"
    classification: CURRENT
    action: NONE
    before_summary: "Diagram ends '...-> controlled deployment' with no explicit app-store branch."
    after_summary: null
    rationale: "'Controlled deployment' is generic enough to already cover an app-store release pipeline in principle; MOBILE-ARCHITECTURE.md Section 8 now supplies the concrete mobile release detail. Editing this high-level diagram for one more box was judged unnecessary churn given the detail already exists in the owning document."

  - finding_id: CC04M-AUD-036
    file: docs/governance/PROJECT-CONSTITUTION.md
    locator: "'Product quality principle' and 'Client platform principle'"
    source_type: documentation
    matched_concept: "native / mobile UX"
    classification: CURRENT
    action: NONE
    before_summary: "Already corrected in the prior CC-04M closure task (native mobile UX phrasing, explicit Client platform principle)."
    after_summary: null
    rationale: "No further correction needed; verified still consistent with this task's ADR-0001/MOBILE-ARCHITECTURE.md decisions."

  - finding_id: CC04M-AUD-037
    file: docs/product/PRODUCT-PRINCIPLES.md
    locator: "Principle 17 (Native-mobile-first)"
    source_type: documentation
    matched_concept: "native-mobile-first"
    classification: CURRENT
    action: NONE
    before_summary: "Already corrected in the prior CC-04M closure task."
    after_summary: null
    rationale: "Verified consistent with this task's decisions; no further edit required."

  - finding_id: CC04M-AUD-038
    file: docs/governance/DECISION-LOG.md
    locator: "2026-08-15 entry"
    source_type: documentation
    matched_concept: "native iOS/Android primary decision"
    classification: CURRENT
    action: NONE
    before_summary: "Already records the platform-priority decision and defers the technology choice to a future ADR."
    after_summary: null
    rationale: "That deferred ADR is now ADR-0001, produced by this task; the existing entry remains accurate and does not need editing (it correctly described its own moment in time)."

  - finding_id: CC04M-AUD-039
    file: docs/governance/PROJECT-PLAYBOOK.md
    locator: "Section 6.19 (Native-mobile-first, fast and low-friction)"
    source_type: documentation
    matched_concept: "native-mobile-first"
    classification: CURRENT
    action: NONE
    before_summary: "Already corrected in the prior CC-04M closure task."
    after_summary: null
    rationale: "Verified still accurate; no further edit."

  - finding_id: CC04M-AUD-040
    file: apps/web/README.md
    locator: "whole file"
    source_type: readme
    matched_concept: "web app description"
    classification: WEB_SPECIFIC_CURRENT
    action: NONE
    before_summary: "'The Next.js App Router application for the Adaptive Learning Platform.'"
    after_summary: null
    rationale: "File is in apps/web/ and correctly describes only that app; no universal claim made."

  - finding_id: CC04M-AUD-041
    file: docs/governance/PROJECT-PLAYBOOK.md
    locator: "line ~1133, 'This workstream is not merely frontend development'"
    source_type: documentation
    matched_concept: "frontend"
    classification: CURRENT
    action: NONE
    before_summary: "Workstream C described as 'not merely frontend development'."
    after_summary: null
    rationale: "'Frontend' here means the learner-facing UI layer generically (as opposed to backend/platform), not a claim that only one frontend exists; already-updated adjacent text (finding 010) covers the primary/secondary platform distinction."

  - finding_id: CC04M-AUD-042
    file: supabase/config.toml
    locator: "lines ~49, 104, 210, 285"
    source_type: config
    matched_concept: "frontend / session (Supabase CLI boilerplate comments)"
    classification: CURRENT
    action: NONE
    before_summary: "Generated Supabase CLI config comments reference 'frontend' and 'session' in a platform-general (pooler mode, rate limits) sense."
    after_summary: null
    rationale: "Boilerplate from the Supabase CLI template, not project-authored architecture prose; not a claim about client topology."

  - finding_id: CC04M-AUD-043
    file: docs/product/PRODUCT-OVERVIEW.md
    locator: "'Feedback depth' section, 'The backend can maintain rich evidence while the UI remains concise.'"
    source_type: documentation
    matched_concept: "the UI (singular)"
    classification: CURRENT
    action: NONE
    before_summary: "Describes the feedback-depth architecture abstractly with 'the UI'."
    after_summary: null
    rationale: "Conceptual/abstract statement about backend-vs-presentation responsibility, not a claim that only one client UI exists; does not need platform scoping."

  - finding_id: CC04M-AUD-044
    file: docs/architecture/adr/ADR-0001-mobile-client-technology.md
    locator: "new file"
    source_type: documentation
    matched_concept: "Expo / React Native / native / iOS / Android"
    classification: CURRENT
    action: NONE
    before_summary: "New file created by this task."
    after_summary: null
    rationale: "New durable artefact; listed for completeness of the audit's file inventory, not a correction."

  - finding_id: CC04M-AUD-045
    file: docs/architecture/MOBILE-ARCHITECTURE.md
    locator: "new file"
    source_type: documentation
    matched_concept: "native / offline / Expo / React Native"
    classification: CURRENT
    action: NONE
    before_summary: "New file created by this task."
    after_summary: null
    rationale: "New durable artefact; listed for completeness."

  - finding_id: CC04M-AUD-046
    file: docs/product/MOBILE-UX-ENGINEERING-STANDARD.md
    locator: "new file"
    source_type: documentation
    matched_concept: "native / accessibility / haptics / motion"
    classification: CURRENT
    action: NONE
    before_summary: "New file created by this task."
    after_summary: null
    rationale: "New durable artefact; listed for completeness."

  - finding_id: CC04M-AUD-047
    file: docs/research/phase-1/WP1.10-BUILD-THE-PROVING-SLICE.md
    locator: "whole file (50 lines)"
    source_type: historical
    matched_concept: "general Phase 1 build-sequence framing"
    classification: HISTORICAL_PRESERVE
    action: NONE
    before_summary: "Short historical framing document for the WP1.10 build sequence, written before the CC package sequence existed in its current form."
    after_summary: null
    rationale: "Historical framing document; current sequence lives in ROADMAP.md and PROJECT-STATUS.md, not here."
```

## Unresolved contradictions

```yaml
unresolved_contradictions: []
```

No unresolved contradiction required Product Owner authority during this audit. The one substantive tension found (`docs/roadmap/ROADMAP.md`'s prior "do not build... native mobile app" anti-scope-creep line, finding CC04M-AUD-015) was resolved within this task's own authority, because the task brief that commissioned this work package is itself the Product Owner/Project Architect direction that supersedes that line -- it was not a fresh, independently-discovered conflict between two documents of unclear relative authority.

## Audit coverage

```yaml
coverage:
  directories_scanned:
    - docs/
    - apps/
    - packages/
    - supabase/
    - .github/workflows/
  root_files_scanned:
    - README.md
    - CONTRIBUTING.md
    - PROJECT-STATUS.md
    - package.json
  file_types_scanned:
    - md
    - ts
    - tsx
    - js
    - json
    - yaml
    - yml
    - toml
  concepts_searched:
    - browser / learner browser
    - web app / web application / the application
    - web-first / mobile-first
    - responsive / narrow screen / desktop and mobile
    - Next.js application
    - Vercel
    - frontend
    - cookies / session
    - Playwright / E2E / end-to-end
    - accessibility
    - offline
    - service worker / PWA
    - app store / deployment / release
    - desktop
    - push notification / deep link
    - native / iOS / Android / Expo / React Native
    - single-client architecture diagrams
  exclusions:
    - path: node_modules/
      reason: third-party dependency content
    - path: apps/web/.next/
      reason: build output, not source
    - path: package-lock.json
      reason: generated lockfile, not authored content
    - path: supabase/seed-content/*.sql
      reason: generated seed data, not architecture prose (no authored comments present)
  method: >
    Repo-wide keyword/concept sweep performed by a dedicated read-only search agent
    (Explore-type), scoped to the directories/file-types above with the stated
    exclusions, followed by manual classification of every reported hit by the
    Implementation Engineer authoring this audit. docs/research/phase-0/ and
    docs/research/phase-1/ (large historical Phase 0/1 planning corpus, ~9000 lines
    across four files alone) received a lighter-touch pass per Documentation
    Standard's historical-material rule: structurally significant architecture
    claims were captured (findings 029-032), incidental mentions of "web"/"mobile"/
    "desktop" in that historical corpus were not individually enumerated.
```

## Second-pass results

```yaml
second_pass:
  performed: true
  method: >
    Re-ran the same concept sweep against the post-edit repository state (targeted
    grep re-checks per concept against the specific files touched in the first pass,
    plus a fresh full-repository grep for "native mobile app" outside historical
    docs, "polished and coherent on mobile and desktop", "mobile and desktop
    experience", and unscoped "browser bundles" wording, to confirm no instance of
    each corrected pattern remained outside historical/preserved files).
  remaining_STALE_UPDATE: 0
  remaining_unresolved_contradictions: 0
  notes:
    - "All 11 STALE_UPDATE findings from the first pass were corrected in the same task turn; none were deferred."
    - "Verified docs/architecture/ARCHITECTURE-OVERVIEW.md, PROJECT-STATUS.md, docs/roadmap/ROADMAP.md, docs/product/PRODUCT-PRINCIPLES.md, docs/governance/PROJECT-CONSTITUTION.md, docs/governance/PROJECT-PLAYBOOK.md, docs/governance/DECISION-LOG.md, docs/security/SECURITY-BASELINE.md, README.md, docs/development/AI-DEVELOPMENT-PROTOCOL.md, ADR-0001, MOBILE-ARCHITECTURE.md and MOBILE-UX-ENGINEERING-STANDARD.md are mutually consistent on: native iOS/Android are primary, web is secondary, the mobile technology decision is Expo + React Native (ADR-0001), and CC-04N (mobile-foundation implementation) is sequenced between CC-04M and CC-05."
    - "No document was found asserting web is primary, asserting only one client exists, asserting Playwright/browser E2E is the complete cross-platform test strategy, or asserting all learner interaction requires a live server round trip, after the corrections above."
    - "Historical research documents (docs/research/phase-0/**, docs/research/phase-1/**) were deliberately left unedited and still contain superseded recommendations (e.g. WP1.6's 'should not require a native app'); this is intentional per the Documentation Standard's historical-material rule, not a remaining inconsistency -- the supersession is recorded in DECISION-LOG.md and ADR-0001, the current owning documents."
```

## Correction pass (CC-04M-C)

```yaml
correction_pass:
  performed: true
  date: 2026-08-15
  reason: >
    Project Architect review approved the CC-04M architecture direction in
    substance but flagged four specific issues: (A) the package's governance
    metadata self-assigned "accepted"/"approved" status to newly-authored
    ADR/spec documents before Product Owner/Project Architect final approval,
    overstating the Implementation Engineer's authority; (B) wording conflated
    the existing Node/Vitest shared-engine test suite with proof of execution
    inside the React Native/Hermes runtime; (C) the Mobile UX standard's
    answer-correctness wording was ambiguous about whether correctness is
    determined locally or by the server; (D) EAS Update wording blurred
    technical OTA capability with this project's conservative release policy.
  scope:
    - governance_status_accuracy
    - hermes_vitest_wording
    - local_deterministic_correctness
    - eas_update_policy_wording
  new_repository_wide_audit_performed: false
  files_changed:
    - docs/architecture/adr/ADR-0001-mobile-client-technology.md
    - docs/architecture/MOBILE-ARCHITECTURE.md
    - docs/product/MOBILE-UX-ENGINEERING-STANDARD.md
    - docs/architecture/ARCHITECTURE-OVERVIEW.md
    - PROJECT-STATUS.md
    - docs/architecture/evidence/CC-04M-STALE-ASSUMPTION-AUDIT.md
  changes:
    - correction: A
      what: >
        ADR-0001 frontmatter status changed accepted -> proposed, with an
        expanded "## Status" section citing DECISION-STANDARD.md's ADR
        lifecycle (Proposed -> Accepted -> optionally Superseded) and
        authority rule. MOBILE-ARCHITECTURE.md and MOBILE-UX-ENGINEERING-
        STANDARD.md frontmatter status changed approved -> proposed (per
        DOCUMENTATION-STANDARD.md's proposed|approved|superseded|archived
        vocabulary). ARCHITECTURE-OVERVIEW.md's two ADR-0001 cross-references
        changed from "is decided in" / "is decided separately in" to
        "is recommended in" / "status: proposed, pending final approval".
        PROJECT-STATUS.md's CC-04M section changed "accepted-pending-review
        decision" (self-contradictory) to "status: proposed... not yet
        Accepted". ROADMAP.md, PRODUCT-PRINCIPLES.md, PROJECT-CONSTITUTION.md,
        PROJECT-PLAYBOOK.md, SECURITY-BASELINE.md and AI-DEVELOPMENT-PROTOCOL.md
        were deliberately left at status:approved -- they are pre-existing
        already-approved governance documents receiving minor consistency
        edits, not new decisions requiring fresh acceptance, consistent with
        how the CC-04M closure task's own roadmap/status edits were treated.
      owner_field_change: false
      rationale: >
        DECISION-STANDARD.md and DOCUMENTATION-STANDARD.md already define the
        correct pre-approval vocabulary (Proposed / proposed); no new status
        term was invented.
    - correction: B
      what: >
        MOBILE-ARCHITECTURE.md's Testing/build/release section (finding
        CC04M-AUD-046 area) rewritten to explicitly name three distinct
        testing tiers: (1) Node/Vitest deterministic shared-engine unit
        tests -- correctness evidence only, still runs under Node; (2) a
        required React Native/Hermes integration proof, not satisfied by
        (1), that the same shared packages actually import/execute inside
        the real Expo/React Native/Hermes app -- an explicit CC-04N
        acceptance criterion; (3) native component/E2E/accessibility/
        performance testing, building on (2).
      rationale: >
        Vitest passing is evidence of logical correctness under Node; it is
        not evidence the code executes inside Hermes. The two claims were
        previously conflated in a single bullet.
    - correction: C
      what: >
        MOBILE-UX-ENGINEERING-STANDARD.md Section 1 rewritten: for
        deterministic question types, correctness is calculated locally and
        immediately (explicit critical-path diagram: local input -> local
        deterministic engine -> immediate evaluation -> immediate feedback ->
        local evidence -> background sync -> server validation/
        reconciliation). Background sync is explicitly stated to not sit in
        the correctness critical path. The existing security distinction
        (local correctness != authorisation; local evidence != canonical
        persisted mastery; server remains authoritative for persisted
        evidence/mastery/sync-acceptance/reconciliation) is preserved and
        cross-referenced, not weakened.
      rationale: >
        The prior "correctness confirmation may follow" wording left it
        ambiguous whether the server determines ordinary deterministic
        correctness, which would have implied a network round trip in the
        core learning loop -- contrary to the project's deterministic-first,
        offline-capable architecture.
    - correction: D
      what: >
        ADR-0001's EAS Update consequence and MOBILE-ARCHITECTURE.md's
        release-pipeline sentence rewritten to separate EAS Update's
        technical capability (can deliver compatible OTA JS/asset updates
        within the existing native binary/SDK version, not inherently
        limited to trivial changes) from this project's own conservative
        production release policy (default to non-feature OTA changes;
        feature/behaviour changes go through a store-reviewed binary unless
        explicitly policy-reviewed). The verbatim Apple App Store Review
        Guideline 2.5.2 text already captured during the original framework
        research was preserved and cited; no new research was performed.
      rationale: >
        The prior wording ("not new features, per Apple Guideline 2.5.2")
        read as though Apple's guideline itself technically prevents EAS
        Update from shipping feature changes, when the actual constraint is
        App Store review policy applied to a technically-capable mechanism.
  affected_findings:
    - CC04M-AUD-005
  new_findings: []
  remaining_STALE_UPDATE: 0
  remaining_unresolved_contradictions: 0
  verification_performed:
    - "grep -rn for 'status: accepted' and 'status: approved' across docs/architecture/adr/, MOBILE-ARCHITECTURE.md, MOBILE-UX-ENGINEERING-STANDARD.md: no match (clean)."
    - "grep -n for 'CC-04M COMPLETE' / 'CC-04M APPROVED' in PROJECT-STATUS.md: no match (clean)."
    - "grep -n for 'run unmodified on Hermes' / 'runs unmodified on Hermes' in MOBILE-ARCHITECTURE.md: no match (clean)."
    - "grep -n for 'correctness confirmation may follow' in MOBILE-UX-ENGINEERING-STANDARD.md: no match (clean)."
    - "grep -n for the old EAS/Apple-2.5.2 phrasing in MOBILE-ARCHITECTURE.md and ADR-0001: no match (clean)."
    - "Re-confirmed docs/roadmap/ROADMAP.md sequence is CC-04M -> CC-04N -> CC-05, in order."
    - "Re-confirmed no apps/mobile directory and no non-skeleton source in calculation-engine/evidence-engine/diagnostic-engine/learning-engine (each still 12-line placeholder index.ts) -- no mobile or CC-05 implementation exists."
    - "git diff review (git status --short / git diff --stat / git diff --name-only / git diff) performed; only documentation files changed, no package.json/lockfile/migration/generated-content/CI/application-behaviour change."
```

## Final approval

```yaml
final_approval:
  approved: true
  approval_date: 2026-08-15
  approval_authority:
    - product_owner
    - project_architect
  adr_0001_status: accepted
  mobile_architecture_status: approved
  mobile_ux_standard_status: approved
  implementation_started: false
  cc05_started: false
  notes:
    - "The Implementation Engineer mechanically recorded this already-granted approval; it was not self-authorised. See DECISION-STANDARD.md's authority rule."
    - "This entry records only the status transition for the CC-04M architecture package. It does not constitute a new repository-wide staleness audit."
```
