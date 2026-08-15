---
id: ADR-0001
status: accepted
owner: project-architect
last_reviewed: 2026-08-15
---

# ADR-0001: Native Mobile Client Technology

## Status

Accepted — 2026-08-15. Drafted by the Implementation Engineer under a Project Architect-issued task brief; reviewed by the Project Architect and approved in substance subject to a bounded correction pass (CC-04M-C); the corrections were applied and the Product Owner / Project Architect then gave final approval, recorded here per [`DECISION-STANDARD.md`](../../governance/DECISION-STANDARD.md)'s ADR lifecycle (`Proposed → Accepted → optionally Superseded`). This status was set by the Implementation Engineer mechanically recording that already-granted approval, not self-authorised, per the authority rule ("The Implementation Engineer does not silently create architectural precedent").

## Context

The Product Owner has decided that native iOS and Android applications are the PRIMARY learner-facing product; the existing Next.js web application becomes SECONDARY (recorded in [`docs/governance/DECISION-LOG.md`](../../governance/DECISION-LOG.md), 2026-08-15, and [`docs/product/PRODUCT-PRINCIPLES.md`](../../product/PRODUCT-PRINCIPLES.md) principle 17). That decision explicitly deferred the specific mobile client technology to a future ADR (CC-04M). This is that ADR.

Constraints this decision must satisfy:

- Solo founder + AI-assisted development (Claude Code); no dedicated mobile engineering team, no near-term hiring.
- Significant existing investment in framework-independent TypeScript "domain engine" packages (`@alp/domain`, `@alp/calculation-engine`, `@alp/evidence-engine`, `@alp/diagnostic-engine`, `@alp/learning-engine`) that are intended to be the shared, reusable core of deterministic learner-facing logic across clients (per [`ARCHITECTURE-OVERVIEW.md`](../ARCHITECTURE-OVERVIEW.md)'s dependency-direction principle). Verified 2026-08-15: none of these packages currently depend on React, Next.js, the DOM, or any Node built-in module (`fs`, `crypto`, etc.) — they are genuinely portable today, though `calculation-engine`/`evidence-engine`/`diagnostic-engine`/`learning-engine` are still skeleton packages (CC-05 has not started).
- Existing backend is Supabase (Postgres + Auth + RLS); this must be preserved.
- Target UX quality bar: "world-class consumer app" — smooth, native-feeling, gesture-rich, offline-capable, comparable in perceived polish (not visual identity) to leading consumer learning apps. See [`docs/product/MOBILE-UX-ENGINEERING-STANDARD.md`](../../product/MOBILE-UX-ENGINEERING-STANDARD.md).
- Must perform acceptably on cheap/mid-range Android hardware, not only recent flagship devices.
- Needs a practical app-store release pipeline (build, sign, submit, update) reachable by a solo founder without a dedicated release-engineering function.

## Decision

**Adopt Expo + React Native, on the React Native New Architecture, as the primary native mobile client technology.**

Clarifications on what is and is not decided:

- React Native renders native platform UI (`UIView`/`View` equivalents); this is not a WebView wrapper around the Next.js site.
- Expo is the development, build, and distribution tooling around the native application (Continuous Native Generation, EAS Build/Submit/Update), not a constraint on native capability. Custom native modules remain available via the Expo Modules API without "ejecting" — Expo's managed/bare-workflow distinction and "ejecting" are themselves deprecated concepts as of current Expo tooling; native code can be hand-maintained at any time.
- Native iOS/Android UX quality (per the Mobile UX Engineering Standard) is a hard requirement and takes priority over maximising shared code between web and mobile. Code sharing is pursued for domain/business logic, not forced into UI/navigation/gesture layers (see [`MOBILE-ARCHITECTURE.md`](../MOBILE-ARCHITECTURE.md) §Shared vs. native boundaries).
- This ADR does not select specific UI libraries, state-management approach, or exact package names — those are mobile-foundation implementation details, not architecture decisions.

## Alternatives considered

| Option | Rejected primarily because |
|---|---|
| **B. Flutter** | Zero reuse of the existing TypeScript domain engines — every deterministic calculation/evidence/diagnostic/sequencing rule would need reimplementation in Dart, creating a second permanent implementation to keep in parity with the web client, for a solo founder. Additionally, Flutter's Impeller renderer — its primary architectural answer to consistent frame-rate — explicitly falls back to the legacy OpenGL renderer on Android below API 29 / devices without Vulkan, which is a direct conflict with the explicit cheap/mid-range-Android requirement. Flutter 3.47's extraction of Material/Cupertino into independently-versioned packages is also recent structural churn. Weaker first-party offline-storage story (`sqflite` is community-maintained with no documented encryption path, versus Expo's first-party SQLCipher-backed `expo-sqlite`). |
| **C. Kotlin Multiplatform / Compose Multiplatform** | Same zero-TypeScript-reuse problem as Flutter (Kotlin-shared logic, not TypeScript-shared). Swift export for iOS interop is Alpha, with documented limitations (no cross-language inheritance, type-erased generics) and JetBrains' own roadmap still lists a stable Swift Export as a pending 2026 goal. The Kotlin Supabase SDK (`supabase-kt`) is explicitly community-maintained, not official, with a single primary maintainer — an unacceptable dependency-risk concentration for a solo founder on a critical integration. No managed build/release pipeline equivalent to EAS (self-assembled Gradle + Xcode + Fastlane) and no OTA update capability. |
| **D. Separate native (SwiftUI + Jetpack Compose)** | Highest native ceiling of any option, but doubles the reimplementation cost of the domain engines (once in Swift, once in Kotlin) rather than eliminating it, requires maintaining two full native codebases and two skill sets, and has no managed release pipeline. This is the highest-throughput-required option for exactly the profile (solo founder, AI-assisted, no mobile team) this decision must serve — the opposite of what is needed. |

Full comparison evidence (with primary-source citations gathered 2026-08-15) is retained as task evidence; this ADR states the decision and its rationale, not the full research transcript, per the Documentation Standard's duplication rule.

## Rationale

On every evaluated axis, Expo + React Native was either the strongest option or a credible non-differentiating tie — except that it is decisively the only option that reuses the existing TypeScript domain engines without reimplementation. Given the solo-founder/AI-assisted-development constraint, that axis is treated as dominant: every alternative implies either a second permanent codebase for deterministic learning logic (Flutter, KMP) or two (separate native), each with its own test suite and permanent parity risk against the web client. Combined with Expo's first-party, encryption-capable offline storage (`expo-sqlite` with SQLCipher), the most complete managed build/release pipeline of the four options (EAS Build/Submit/Update/Workflows, all GA), an officially Supabase-supported client for Expo/React Native, and the deepest documented native accessibility API surface, Expo + React Native best satisfies the constraints in context. The React Native New Architecture (Fabric + TurboModules) is no longer optional or a migration risk — it is the sole architecture as of current React Native/Expo releases, so this decision does not carry legacy-architecture technical debt.

## Consequences / trade-offs

- The domain-engine packages remain framework-independent (no React/Next.js/DOM/Node-builtin dependency) as an explicit ongoing constraint on CC-05 and later engine work — see [`MOBILE-ARCHITECTURE.md`](../MOBILE-ARCHITECTURE.md) §CC-05 impact.
- `packages/ui` (the existing web component package) is confirmed DOM/web-specific (renders HTML elements, uses Tailwind) and is not reusable by the native client as-is; a separate native UI package is expected during mobile-foundation implementation, not created by this ADR.
- Library-level New Architecture compatibility must be actively vetted per dependency added — some legacy React Native libraries remain incompletely migrated (e.g. `react-native-maps` was still stabilising on the New Architecture as of the research date). This is an ongoing engineering discipline, not a one-time check.
- Hermes (the RN JS engine) has had two consecutive point-release regressions during its V1 rollout (memory regression in one Expo SDK, fixed in a subsequent patch); patch-version discipline on the Expo SDK/React Native version is required rather than pinning indefinitely to an old version.
- **EAS Update technical capability vs. this project's release policy.** EAS Update is technically capable of delivering compatible over-the-air JavaScript/asset updates within the app's existing native binary and SDK version — it is not inherently limited to trivial changes; it can alter application behaviour within that boundary. What constrains its *production* use is App Store / Play Store policy, not a technical ceiling. Apple App Store Review Guideline 2.5.2 states apps "may not read or write data outside the designated container area, nor may they download, install, or execute code which introduces or changes features or functionality of the app, including other apps" (Apple Developer, App Store Review Guidelines). Given that, this project adopts a **conservative production OTA policy**: by default, production EAS Update rollouts are limited to safe, non-feature changes — bug fixes, copy, configuration, and presentation/styling changes — and behaviour-changing or new-feature delivery goes through a normal store-reviewed binary release, unless a specific future update is explicitly reviewed against current platform policy and determined compliant. This is a project governance choice, not a claim that EAS Update is technically unable to do more.
- No credible primary-source head-to-head performance benchmark exists comparing these frameworks on equivalent low-end Android hardware. This ADR is a reasoned decision from documented framework capabilities and the project's specific constraints, not from a verified performance benchmark. The mobile-foundation implementation package must establish real baseline measurements on the reference low-end-Android device class (see [`MOBILE-UX-ENGINEERING-STANDARD.md`](../../product/MOBILE-UX-ENGINEERING-STANDARD.md) §9) before any numeric performance target becomes a contractual acceptance threshold. If that early measurement reveals React Native cannot meet the UX quality bar on the reference device class, that is a trigger for review of this ADR (see Review triggers below), not a silent workaround.

## Security / privacy implications

- The mobile app is an untrusted client, identical in trust posture to the web client: Supabase RLS and server-side authorisation remain the sole authority; no service-role or privileged credential is ever bundled into the mobile app.
- Session/auth material on-device requires OS-provided secure storage (iOS Keychain / Android Keystore), not plain `AsyncStorage`. Supabase's documented pattern for Expo/React Native — an encryption key in secure storage plus an encrypted session blob in general storage — should be followed rather than an ad hoc scheme; see [`MOBILE-ARCHITECTURE.md`](../MOBILE-ARCHITECTURE.md) §Auth and session.
- Full detail is in `MOBILE-ARCHITECTURE.md` §Security integration; this ADR records that the mobile technology choice does not itself require any change to the existing RLS/authorisation model.

## Cost / operational implications

- EAS Build/Submit/Update has a hosted-service cost model (beyond free tier limits) that should be reviewed against [`PROJECT-CONSTITUTION.md`](../../governance/PROJECT-CONSTITUTION.md)'s commercial/cost-discipline principle once real usage volumes exist; not a blocking concern at this stage.
- Apple Developer Program and Google Play Console developer accounts are required operational costs for any native mobile release, native-technology-choice-independent.
- No new backend infrastructure is required by this decision; Supabase remains unchanged.

## Review triggers

Revisit this ADR if:

- Early mobile-foundation performance measurement on the reference low-end Android device class shows React Native cannot meet the Mobile UX Engineering Standard's responsiveness/frame-rate requirements even after reasonable optimisation.
- A required native capability proves unavailable via React Native/Expo and has no viable custom-native-module path.
- Expo's managed build/release tooling becomes materially unavailable, unreliable, or unacceptably costly at the project's actual usage scale.
- A future Product Owner decision changes the shared-TypeScript-logic strategy that makes this decision's dominant rationale (engine reuse) no longer applicable.

## Related documents

- [`docs/governance/DECISION-LOG.md`](../../governance/DECISION-LOG.md) — 2026-08-15 entry recording the native-primary/web-secondary product decision this ADR implements.
- [`docs/architecture/MOBILE-ARCHITECTURE.md`](../MOBILE-ARCHITECTURE.md) — client/server topology, offline/sync architecture, testing/build/release architecture, security integration, CC-05 constraints, and implementation sequencing built on this decision.
- [`docs/product/MOBILE-UX-ENGINEERING-STANDARD.md`](../../product/MOBILE-UX-ENGINEERING-STANDARD.md) — the UX quality bar this technology must deliver.
- [`docs/product/PRODUCT-PRINCIPLES.md`](../../product/PRODUCT-PRINCIPLES.md) principle 17 and [`docs/governance/PROJECT-CONSTITUTION.md`](../../governance/PROJECT-CONSTITUTION.md) "Client platform principle" — the product decision this ADR's technology choice serves.

## Supersession

None. This is the first ADR in the repository.
