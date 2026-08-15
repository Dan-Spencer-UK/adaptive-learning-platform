---
id: ARCH-002
status: approved
owner: project-architect
last_reviewed: 2026-08-15
---

# Mobile Architecture

## Purpose

Native iOS and Android are the primary learner platforms; web is secondary (see [`docs/product/PRODUCT-PRINCIPLES.md`](../product/PRODUCT-PRINCIPLES.md), [`docs/governance/PROJECT-CONSTITUTION.md`](../governance/PROJECT-CONSTITUTION.md), and [`ADR-0001`](adr/ADR-0001-mobile-client-technology.md) for the client-technology decision this document builds on). This document is the target system architecture for the native client: topology, offline/content-sync model, testing/build/release architecture, security integration, and the constraints this places on CC-05. It updates [`ARCHITECTURE-OVERVIEW.md`](ARCHITECTURE-OVERVIEW.md)'s system model rather than replacing it.

**This document is architecture, not implementation.** No mobile application, dependency, or build/release credential is created by this document. See §Implementation sequencing for what happens next.

## 1. Client / backend topology

```text
┌───────────────────┐   ┌───────────────────┐
│  Native mobile app │   │  Web client        │
│  (iOS + Android,   │   │  (Next.js — Phase 1│
│   PRIMARY)         │   │   proving-slice    │
│                     │   │   client, SECONDARY)│
└─────────┬──────────┘   └─────────┬──────────┘
          │                        │
          └──────────┬─────────────┘
                      ↓
           Application services
                      ↓
      ─────────────────────────────────
      Domain / deterministic engines
      (calculation, evidence, diagnosis,
       learning — framework-independent)
      ─────────────────────────────────
                      ↓
            Supabase PostgreSQL
                      ↓
           RLS / governed persistence
```

Both clients consume the same application services and the same deterministic domain engines; neither client re-implements business/learning logic. Divergence is expected — and correct — above the application-services line (navigation, screen composition, native gesture/animation handling), never below it.

### Target monorepo topology

Conceptual target (not created by this document):

```text
apps/
  mobile/        PRIMARY learner application (Expo/React Native)
  web/           SECONDARY learner-facing client + admin/desktop web (Next.js, existing)

packages/
  domain/                 existing — framework-independent
  calculation-engine/     existing — framework-independent
  evidence-engine/        existing — framework-independent
  diagnostic-engine/      existing — framework-independent
  learning-engine/        existing — framework-independent
  content-schema/         existing — framework-independent
  ui/                     existing — Next.js/DOM-specific web component package (confirmed
                           2026-08-15: renders HTML elements via Tailwind; not React Native-
                           compatible; kept as the web client's own UI package, not renamed
                           or repurposed)
  api-contracts/          likely future — shared request/response/DTO types between clients
                           and application services, if/when a dedicated API layer needs one
  design-tokens/          likely future — shared colour/spacing/type tokens where a genuine
                           token-level share is useful across native and web
  mobile-ui/               likely future — native component package for apps/mobile, mirroring
                           the role packages/ui plays for apps/web
```

None of these future packages are created by this document; they are created when the mobile-foundation implementation package (§Implementation sequencing) actually needs them.

### Shared vs. native boundaries

**Share:** domain types, deterministic calculations, evidence rules, diagnostic logic, learning-sequencing logic, content schemas/validation, API contracts, design tokens where genuinely useful across platforms.

**Do not force-share:** navigation, native layout/screen composition, platform input behaviour, animation, gestures, native system integrations (haptics, push, secure storage), accessibility implementation, native lifecycle behaviour.

**Governing principle: maximise shared product logic, not maximum percentage code reuse.** A native screen that reimplements its own layout using shared domain types is correct; a cross-platform layout abstraction that constrains native UX to satisfy web's DOM model is not (see [`MOBILE-UX-ENGINEERING-STANDARD.md`](../product/MOBILE-UX-ENGINEERING-STANDARD.md)).

## 2. Offline / content-delivery / sync architecture

The learner interaction loop must not depend on a server round trip for every action (see Mobile UX Engineering Standard §1). Target architecture:

### Content delivery

```text
Governed authoring/content model (existing CC-02/CC-04 schema:
  assertions, assertion_versions, provenance, curriculum mappings, misconceptions)
        ↓
validated/published learner-content release
        ↓
versioned learner-runtime content representation
        ↓
device cache / local database
        ↓
mobile session runtime
```

**Governed authoring data is not shipped directly to learner devices.** The existing governed schema deliberately carries provenance, source metadata, internal review/status fields and curriculum-governance metadata not required at runtime (and, per CC-02/CC-04, is RLS-denied to `anon`/`authenticated` entirely — there is currently no learner-facing read path to it at all). A **published learner-runtime projection** must be defined: a validated, versioned package or API response containing only what a lesson/question session needs (assertion statement text, question/lesson content once CC-05/CC-06 exist, curriculum position, misconception-linked distractors) with an explicit content-release version identity. This projection is a new artefact to design and build, not an existing one to expose. Building the publishing system itself is out of scope for this document (see §Implementation sequencing) — this document establishes that the separation must exist, not its implementation.

Each piece of learner evidence recorded against content must record the **content-version identity** it was recorded against, so that a later content revision does not silently reinterpret historical evidence.

### Local storage and session state

- Durable on-device storage for cached published content and in-progress/pending-sync learner state (Expo SQLite, per ADR-0001, optionally with SQLCipher encryption for anything sensitive).
- Likely-next lesson/session content is prefetched opportunistically so "continue" does not normally require a live request.
- In-progress lesson state (current question, partial answer, session position) persists locally so an interrupted session (backgrounding, call, OS termination) is resumable.

### Evidence sync

```text
learner activity
        ↓
local immediate state/evidence
        ↓
durable pending-sync queue
        ↓
background sync
        ↓
canonical server learner state
```

- The device is never the authority on mastery/evidence state — Supabase/Postgres remains authoritative, consistent with the existing "learner evidence is append-oriented, derived state should remain traceable/recomputable" principle in `ARCHITECTURE-OVERVIEW.md`.
- Local writes are optimistic (the learner sees immediate feedback) but are queued durably and are not considered final until synced and accepted server-side.
- Sync operations must be idempotent and safely retryable (a retried sync of the same local event must not double-count evidence) — this reuses the same idempotency discipline already established for content seeding (`ON CONFLICT DO NOTHING` patterns in the CC-04 content pipeline) rather than inventing a new pattern.
- Conflict strategy: server state wins for anything the server has already accepted; unsynced local evidence is replayed against current server state on reconnect, not silently discarded or silently overwritten client-side.
- A content release changing after a learner started a session offline must not corrupt an in-flight session; the session completes against the content version it started with, and evidence records that version explicitly (see above).

## 3. Auth and session architecture

- Same Supabase identity/backend as the web client; no separate identity system.
- Native session/token persistence uses OS-provided secure storage (iOS Keychain / Android Keystore via `expo-secure-store`), not the web client's cookie model, which does not apply to a native app. Given `expo-secure-store`'s documented per-item size limit, the Supabase-documented pattern of an encryption key in secure storage plus an encrypted session blob in general local storage should be followed rather than an ad hoc scheme.
- No service-role or privileged Supabase credential is ever bundled into the mobile app — identical trust boundary to the web client (browser bundle vs. mobile app bundle are equivalent "untrusted client" categories; see [`SECURITY-BASELINE.md`](../security/SECURITY-BASELINE.md)).
- Deep links (notification → lesson, auth callback) must validate their target rather than trusting the link payload; an auth callback deep link must be verified the same way the existing web OTP flow is (server-verified, not client-trusted).
- Mobile session expiry/revocation must behave consistently with the existing web session model — signing out terminates the session server-side (as the web client's `signOutAction` already does via `auth.signOut()`), not merely local state.
- Native OAuth/Apple/Google sign-in is a plausible future addition (per `PROJECT-PLAYBOOK.md`'s passwordless-first direction, which permits later methods) but is not decided or required by this document.

## 4. App lifecycle

- Foreground/background/process-termination transitions must not lose in-progress lesson state (§2, local storage).
- On resume, the app must reconcile local pending-sync state against current server state before presenting the learner with potentially-stale information.
- A killed app with an unsynced evidence queue must retry sync on next launch, not silently drop the queue.

## 5. Push notifications, deep links

- Push notifications are a supported capability (useful for spaced-retrieval reminders per the existing product spaced-retrieval principle), gated on explicit user permission, and must not become manipulative/engagement-bait notification design (consistent with `PRODUCT-PRINCIPLES.md`'s calm-tone/no-unnecessary-gamification principles).
- Initial implementation may use Expo's push-notification abstraction over APNs/FCM; the architecture must not preclude moving to direct platform providers later if needed (no hard dependency on Expo's push service specifically).
- Deep links route notification taps and auth callbacks to a specific in-app destination; link targets are validated, not trusted blindly (§3).

## 6. Observability

Mobile observability requirements (vendor selection deferred, not decided here):

- Crash reporting.
- Startup/interaction performance tracking against the budgets in `MOBILE-UX-ENGINEERING-STANDARD.md` §9.
- Failed-sync and failed-content-download visibility.
- Native app version / build and device/OS distribution visibility, to know what the installed base is actually running.
- Performance-regression detection across releases.

No paid vendor is selected by this document. Privacy: mobile analytics/telemetry follows the same privacy principle already established in `SECURITY-BASELINE.md` ("collect only what supports the product... avoid unnecessary sensitive data") — this is not a new privacy standard, it is the existing one applied to a new client.

## 7. Security integration

This section confirms the mobile decision does not weaken the existing security model (`SECURITY-BASELINE.md`, `SECURITY-VERIFICATION-MATRIX.md`); it does not change either.

- Service-role/privileged credentials never ship to the mobile client — identical rule to the existing "never expose... to browser bundles" rule, now understood to apply to any client bundle, mobile included.
- The mobile app is an untrusted client. RLS and server-side authorisation remain the sole authority; no client-side check (mobile or web) is ever treated as access control.
- Local device storage is a cache/queue, never an authority boundary — a compromised or tampered local database must not be able to grant access to data the server would otherwise deny, or make evidence appear synced when it was not server-accepted.
- Sensitive auth/session material uses OS-provided secure storage (§3), not plain local storage.
- The published learner-runtime content projection (§2) is a deliberate boundary: governed authoring/provenance/review-state data is not exposed to the device merely because it is easy to; only the validated runtime-necessary subset is.
- Offline-recorded evidence is re-validated server-side when synced — a client cannot manufacture accepted evidence purely by writing to its local queue; the server applies the same validation it would to a live request.
- Deterministic client-side calculation (e.g. an answer-correctness check performed locally for instant feedback) is a UX optimisation, not an authorisation or scoring decision — the server remains authoritative for anything that affects mastery/evidence state, exactly as the existing "deterministic-first" principle already implies for the web client.
- Deep-link targets and notification payloads are validated before navigation; a notification payload must not carry unnecessary sensitive learner data.

No security-control implementation change is required by this document; if the mobile-foundation implementation package later reveals that the published-content-projection boundary needs a new database object/policy, that is a normal implementation-time RLS/schema decision made under the existing security baseline, not a new security principle.

## 8. Testing / build / release architecture

Existing web CI (`.github/workflows/ci.yml`) remains valid for the web client and is unaffected by this document. Target mobile test/release architecture (not implemented here):

Mobile testing has three distinct tiers, which must not be collapsed into one:

1. **Node/Vitest — deterministic shared-engine unit tests.** The existing Vitest suites for `domain`/`calculation-engine`/`evidence-engine`/`diagnostic-engine`/`learning-engine` remain the primary correctness evidence for that logic, and continue to run under Node, as they do today. The engine code is *designed* to be Hermes-portable (framework-independent TypeScript, no DOM/Node-builtin dependency — see ADR-0001 and §9 below), but Vitest passing is evidence of logical correctness, not evidence that the code actually executes inside the React Native/Hermes runtime. These are not the same claim.
2. **React Native/Hermes integration proof.** A distinct, required check — not satisfied by (1) — that the same shared packages actually import and execute correctly inside the real Expo/React Native/Hermes app. This is a mobile-foundation implementation package (CC-04N) acceptance criterion, not something this architecture document or the existing Vitest suite already proves.
3. **Native component / E2E / accessibility / performance testing** — verifies the application layer (screens, navigation, gestures), building on top of (2), not a substitute for it.

- **Mobile component tests** (tier 3) — native-component-level tests analogous in spirit to the web client's Testing-Library component tests.
- **Native E2E** (tier 3) — a framework-agnostic tool (e.g. Maestro) or an in-app-instrumentation tool (e.g. Detox) run against real iOS/Android builds; this is additive to, not a replacement for, tiers 1 and 2.
- **Accessibility testing** — platform screen-reader verification (VoiceOver/TalkBack), per `MOBILE-UX-ENGINEERING-STANDARD.md` §7; the web client's `axe`/Playwright accessibility job is not a substitute, since native accessibility trees are not DOM/ARIA-based.
- **Screenshot / visual-regression testing** — to catch unintended visual drift across releases.
- **Performance checks** — automated tracking against the budgets in `MOBILE-UX-ENGINEERING-STANDARD.md` §9 once a real baseline exists.
- **Real-device / manual release qualification** — including the explicit low-end-Android device requirement (`MOBILE-UX-ENGINEERING-STANDARD.md` §8); simulator/emulator-only qualification is not sufficient for release sign-off.
- **Build/signing validation** — EAS Build handles iOS/Android signing; validated as part of the release pipeline, not ad hoc.

Release pipeline direction (per ADR-0001): EAS Build for compiled app binaries, EAS Submit for App Store/Play Store submission, EAS Update for over-the-air JS-only updates, EAS Workflows for CI orchestration. Preview/internal distribution builds precede production release channels. A rollback/update strategy (halting or reverting an EAS Update rollout) must exist before production release, not be improvised during an incident. See ADR-0001 consequences for the distinction between what EAS Update is technically capable of and this project's conservative production OTA release policy.

No CI workflow is added by this document, no app-store account/credential/signing certificate is created, and no push-notification credential is created — all deferred to the mobile-foundation implementation package.

## 9. CC-05 impact and constraints

CC-05 (Deterministic Calculation/Question Engine) has not started. This document does not implement it, but the mobile-native-first decision imposes constraints CC-05 must obey so that later mobile consumption does not require rework:

- The engine core must remain framework-independent TypeScript: no DOM dependency, no Node-builtin dependency, no React dependency inside the calculation/evidence/diagnostic/sequencing logic itself (React may wrap it for UI in either client, but the engine does not depend on React).
- Deterministic: identical inputs (including any random-seed input) produce identical outputs regardless of which client/runtime calls it.
- Inputs and outputs must be serialisable (plain data, no client-runtime-specific objects) so the same engine call can run identically inside Hermes (mobile), a browser/Node runtime (web/server), and a test runner.
- No assumption of round-trip server latency inside the engine's own logic — it must be safely callable from an offline mobile session (§2), not only from a server request handler.
- Question/evidence outputs must be compatible with the versioned published-content model (§2) — an engine result must be attributable to a specific content-release version.
- No mobile-UI logic, native navigation, or presentation concerns belong inside the calculation engine; it produces data, not screens.

Roadmap/task-brief wording for CC-05 should reflect these constraints so a future CC-05 task cannot silently reintroduce web-first or server-round-trip assumptions; see `docs/roadmap/ROADMAP.md`'s CC-05 entry.

## 10. Implementation sequencing

Recommended sequence after this architecture package (CC-04M) is approved:

```text
CC-04M architecture/governance (this package)
        ↓
Mobile foundation implementation package
  — Expo/React Native app boots (iOS + Android)
  — Supabase native auth/session proven end-to-end
  — shared package (@alp/domain etc.) consumption proven from the mobile app
  — local persistence (Expo SQLite) proven
  — basic native navigation proven
  — CI/build pipeline (EAS) proven
  — baseline performance measurements taken on the reference low-end-Android
    device class, calibrating MOBILE-UX-ENGINEERING-STANDARD.md §9's
    acceptance thresholds
        ↓
CC-05 Deterministic Calculation/Question Engine
        ↓
Mobile-first proving-slice integration
```

**Recommendation: insert a new roadmap package for the mobile-foundation implementation, sequenced between CC-04M and CC-05, rather than treating it as CC-04M's own exit activity.** CC-04M is architecture/governance; the mobile-foundation implementation is a genuine bounded implementation task (installs dependencies, creates `apps/mobile`, produces working builds) with its own acceptance criteria and its own review/approval cycle, consistent with the repository's "one bounded task, one coherent change" development-workflow rule. Collapsing it into CC-04M would mix a governance-only task with the first real mobile implementation commit, which conflicts with this task's own explicit non-goals. See `docs/roadmap/ROADMAP.md` and `PROJECT-STATUS.md` for the encoded sequence.

This document does not begin that implementation package.
