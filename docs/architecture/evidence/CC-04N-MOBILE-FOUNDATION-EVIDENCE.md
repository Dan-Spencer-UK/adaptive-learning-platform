# CC-04N Mobile Foundation Evidence

Implementation evidence for CC-04N — Mobile Foundation Implementation, built on the architecture approved in CC-04M ([`ADR-0001`](../adr/ADR-0001-mobile-client-technology.md), [`MOBILE-ARCHITECTURE.md`](../MOBILE-ARCHITECTURE.md), [`MOBILE-UX-ENGINEERING-STANDARD.md`](../../product/MOBILE-UX-ENGINEERING-STANDARD.md)).

This document records exactly what was mechanically verified in this environment (a Windows development machine with no Java/JDK, no Android SDK/emulator, and no macOS/Xcode) versus what remains PENDING real-device/emulator/EAS-account qualification. **No result below is fabricated; every PASS is reproducible via the commands cited.**

**Overall result: FUNCTIONALLY COMPLETE, SECURITY RISK ACCEPTED, READY FOR COMMIT.** Every functional/architectural item in this document (§1–11) is complete and locally verified. CC-04N-S (the bounded security/dependency correction pass, 2026-08-15) confirmed that **no patched upstream release of `image-size` exists at all** for either of the two HIGH-severity advisories affecting Expo/Metro's own toolchain (`SEC-EXC-001`/`SEC-EXC-002` in `SECURITY-VERIFICATION-MATRIX.md` SEC-M-006b) — this corrected an earlier record in this document that had assumed `image-size@2.0.2` was a patched release; it is not. A governed audit-gate mechanism (`scripts/security/check-npm-audit.mjs`, tested with 15 fixture-based unit tests after CC-04N-S1's hardening pass) exists so CI fails on any *unexpected* HIGH/CRITICAL finding while cleanly identifying this specific, known, time-bounded exception. On 2026-08-15, Product Owner / Project Architect **explicitly accepted** both `SEC-EXC-001` and `SEC-EXC-002` through **2026-09-14** (not extended). `npm run security:audit` (NORMAL mode, what CI runs) now PASSES. **The underlying vulnerability itself remains present and is not resolved** — `image-size@1.2.1` is unchanged, and raw `npm audit --json` still reports the full, unfiltered finding set; only the governed gate's interpretation, scoped to these exact accepted tuples, has changed. CC-04N is ready to be committed and, pending green CI on the exact implementation commit, closed.

## Evidence summary

```yaml
cc_task: CC-04N
verification_date: 2026-08-15
environment:
  os: Windows
  node: v24.12.0
  npm: 11.6.2
  java_jdk: not installed
  android_sdk: not installed
  android_emulator: not available
  macos_xcode: not available
mobile_sdk:
  expo: "57.0.13"
  react_native: "0.86.2"
  react: "19.2.8"
  hermes: "default/mandatory since Expo SDK 55 (no opt-out exists); Hermes BYTECODE COMPILATION mechanically confirmed (not merely configured) -- see 'Metro/Hermes bundle compilation' below"
  new_architecture: true
navigation:
  technology: "Expo Router 57.0.13, Stack.Protected auth-boundary pattern (official current pattern, verified against docs.expo.dev 2026-08-15)"
shared_package_runtime_proof:
  domain: PASS
  calculation_engine: PASS
  evidence_engine: PASS
  diagnostic_engine: PASS
  learning_engine: PASS
  content_schema: PASS
native_targets:
  android:
    build: NOT_RUN            # no Android SDK / JDK / emulator in this environment
    runtime: NOT_RUN
    metro_hermes_bytecode_compilation: PASS   # see detail below -- distinct, real evidence
  ios:
    build: NOT_RUN             # no macOS / Xcode; Windows dev machine
    runtime: NOT_RUN
    metro_hermes_bytecode_compilation: PASS   # see detail below -- distinct, real evidence
local_storage:
  sqlite_open: PASS             # against a hand-rolled Jest mock, NOT the real native binding -- see detail
  persistence_restart: PASS     # logic-level, mocked
  schema_versioning: PASS       # logic-level, mocked
  outbox_foundation: PASS       # logic-level, mocked
  real_native_sqlite_binding: NOT_RUN   # confirmed unavailable under Jest -- see detail
auth:
  native_client: PASS
  persistence: PASS             # code + logic verified; real Keychain/Keystore behaviour NOT_RUN
  secure_storage: PASS          # documented Supabase pattern implemented faithfully; real OS storage NOT_RUN
offline_foundation:
  local_boot_or_restore: PASS   # architecture/logic demonstrated; real on-device boot NOT_RUN
testing:
  shared_vitest: PASS           # 38/38, existing suite, unaffected
  native_integration: PASS      # Jest logic-level proof + real Metro/Hermes bytecode compilation; NOT on-device Hermes execution
  native_e2e: NOT_RUN           # tool selected (Maestro), not installed/run -- no device to run against
performance:
  emulator_baseline: NOT_RUN
  physical_android: PENDING
  physical_ios: PENDING
  dev_machine_build_timing: RECORDED   # Metro bundle time only, not app runtime -- see §8
security:
  service_role_in_client: false
  privileged_secret_in_client: false
  known_dependency_exception: "image-size (transitive, via Expo/Metro toolchain), 2 advisories, ACCEPTED by Product Owner/Project Architect 2026-08-15, expires 2026-09-14 -- see SEC-M-006b in SECURITY-VERIFICATION-MATRIX.md and CC-04N-S/CC-04N-S1 completion reports"
```

## 1. Foundation summary

- **Path**: `apps/mobile/` (Expo + React Native, TypeScript strict).
- **Resolved versions**: Expo `57.0.13`, React Native `0.86.2`, React `19.2.8` (see §2 for why this differs from the template's default `19.2.3`), Expo Router `57.0.13`.
- **Confirmed via primary sources (2026-08-15)**: Expo SDK 57 remains the current stable line (`docs.expo.dev/versions/latest/` — no newer stable SDK exists; SDKs release three times a year and the next would be ~Q4 2026), matching ADR-0001's baseline exactly — no version drift, no STOP condition triggered.
- **What actually exists**: a bootstrap/splash boundary, a passwordless email-OTP sign-in screen, an authenticated home screen demonstrating local-state restoration, a dev-only diagnostics screen, a native Supabase client with secure session persistence, a versioned local SQLite schema with an outbox foundation, and a dev-only Hermes/shared-package runtime proof — all built and validated per the commands in this document. No lessons, questions, syllabus browser, progress UI, or CC-05 logic exists anywhere in this package.
- **Template cleanup**: the default `create-expo-app` tutorial scaffold (sample tab navigation, animated icon, hint rows, React/Expo logo assets, `reset-project.js`, `LICENSE`) was entirely removed before any foundation code was written — see `git diff --stat` for the file list.

## 2. Monorepo / package boundaries

- Root `npm install` from a single lockfile; **no separate lockfile exists inside `apps/mobile`** (confirmed: only `package-lock.json` at repo root).
- **Zero Metro customisation was needed.** Per current official guidance (`docs.expo.dev/guides/monorepos/`, verified 2026-08-15): "No manual changes required for SDK 52+" when using `expo/metro-config` (the SDK 57 default template's implicit config). No `metro.config.js` or `babel.config.js` file exists in `apps/mobile` at all — confirmed by directory listing before any file was added.
- **Shared packages consumed**: `@alp/domain`, `@alp/calculation-engine`, `@alp/evidence-engine`, `@alp/diagnostic-engine`, `@alp/learning-engine`, `@alp/content-schema` — all as real workspace dependencies (`"*"` version, npm workspace resolution), imported by real application code (`src/lib/native-proof/shared-packages.ts`), not stubbed.
- **`packages/ui` boundary**: confirmed NOT a dependency of `apps/mobile` (`apps/mobile/package.json` has no `@alp/ui` entry) and confirmed NOT imported by any file under `apps/mobile/src`. Enforced mechanically by `scripts/boundary-checks/check-mobile-web-boundary.ts`, run via `npm run check:mobile-boundary` (passes; wired into CI).
- **A real bug was found and fixed here**: the initial dependency set pinned `react@19.2.3` (the Expo template's declared version) while the root/web workspace already required `react@19.2.8`, and npm could not deduplicate an *exact* version pin against a different exact pin, producing **two physical copies of React** (`node_modules/react` and `apps/mobile/node_modules/react`) — exactly the failure mode Expo's own monorepo docs warn about ("Duplicate React versions in an app will cause runtime errors"). It manifested as `TypeError: Cannot read properties of null (reading 'useState')` when rendering a component test. Fixed by aligning `apps/mobile`'s `react` to `19.2.8` (matching the root/web pin exactly) and confirming via `npm ls react` that only one physical `react` package remains repository-wide. `expo-doctor`'s resulting "package should be updated" warning for this specific, deliberate deviation is suppressed via `"expo": {"install": {"exclude": ["react"]}}` in `apps/mobile/package.json` (the mechanism `expo-doctor` itself documents for intentional exceptions) — `npx expo-doctor` now reports 21/21 checks passed.

## 3. Native runtime proof

This is the most important CC-04N acceptance criterion, and the one most likely to be misreported, so the tiers are kept strictly separate:

**Tier 1 — Node/Vitest (unchanged, pre-existing).** The root Vitest suite (`npm run test:unit`) proves the shared packages' logical correctness under Node. This tier does **not** prove React Native/Hermes compatibility on its own, and was never claimed to.

**Tier 2a — Jest/jest-expo logic proof (real code, RN transform pipeline, Node-hosted).** `apps/mobile/src/lib/native-proof/shared-packages.ts` imports the *real* exports of all six shared packages — `packageId` from each engine package, and `packageManifestSchema` (a genuine Zod object schema) from `@alp/content-schema` — and exercises them (including a real `.safeParse()` call against valid and invalid input, not just a constant read). Run under `jest-expo` (the same Babel/module-resolution pipeline a real Expo build uses, unlike Vitest, which never touches RN tooling at all): **all 6 shared packages PASS** (`npm run mobile:test` → `src/lib/native-proof/shared-packages.test.ts`, 2/2 tests). This is real evidence that Metro-style module resolution and the RN Babel pipeline can load and execute this code — it does **not** by itself prove execution inside the actual Hermes VM, because Jest still runs in Node, not Hermes.

**Tier 2b — Metro/Hermes bytecode compilation proof (new, stronger, genuinely real).** `npx expo export --platform android` and `--platform ios` were run directly (no Android Studio/Xcode required — `expo export` is pure Metro/Node tooling). Both succeeded:

```
Android Bundled 13515ms node_modules\expo-router\entry.js (1823 modules)
› android bundles (1): _expo/static/js/android/entry-....hbc (5.1MB)

iOS Bundled 24421ms node_modules\expo-router\entry.js (1735 modules)
› ios bundles (1): _expo/static/js/ios/entry-....hbc (4.9MB)
```

The output files have the `.hbc` extension (Hermes Bytecode). This was independently confirmed, not just assumed from the extension: `file dist/_expo/static/js/android/*.hbc` reports **"Hermes JavaScript bytecode, version 98"**, and the file's first bytes (`c6 1f bc 03 ...`) match Hermes bytecode's known magic number. This means Metro successfully resolved, bundled, and **compiled to real Hermes bytecode** the entire application — 1823 (Android) / 1735 (iOS) modules, including every shared `@alp/*` package. This is meaningfully stronger evidence than Tier 2a alone: it proves the exact code path a real device would load is valid, Hermes-bytecode-compilable JavaScript, not merely "importable under Jest." The exported `dist/` directories were deleted after inspection (build output, already `.gitignore`'d, not part of the deliverable).

**Tier 2c — On-device/emulator Hermes execution.** **NOT_RUN.** No Android SDK, JDK, emulator, or physical device exists in this environment (confirmed by direct inspection — see §7); no macOS/Xcode exists for iOS. This is the one tier that genuinely cannot be produced here, and is not claimed. Running the compiled bundle on a real Hermes VM (device, emulator, or `expo run:android` with a connected device) is the exact, well-defined next verification step for whoever has that hardware — see §7 and §11.

**No `HermesInternal` global check was run outside Jest** (the dev-proof screen's `isHermesRuntime()` check exists in code and will report accurately once the app actually runs on-device, but could not itself be exercised without a runtime).

## 4. Auth / Supabase foundation

- **Client**: `apps/mobile/src/lib/supabase/client.ts` — a native-specific Supabase client, deliberately separate from `apps/web/lib/supabase/*` (different platform requirements: no cookies, no `@supabase/ssr`). Uses `@supabase/supabase-js` directly with `persistSession: true`, `autoRefreshToken: true`, `detectSessionInUrl: false` (no browser URL on native).
- **Session storage**: `LargeSecureStore` (`apps/mobile/src/lib/supabase/large-secure-store.ts`) reproduces Supabase's own current documented Expo/React Native pattern verbatim (verified against `supabase.com/docs/guides/getting-started/tutorials/with-expo-react-native`, 2026-08-15): a random AES-256 key in `expo-secure-store` (OS Keychain/Keystore) encrypting the session payload in `@react-native-async-storage/async-storage`, because SecureStore alone cannot hold values over 2048 bytes. This is **not bespoke cryptography** — it is the currently-recommended upstream pattern, reproduced faithfully, satisfying the CC-04M-C constraint that any encrypted-storage code must be a directly supported/approved current pattern.
- **Lifecycle**: `AppState`-driven `startAutoRefresh()`/`stopAutoRefresh()` registered exactly once (Supabase's own stated requirement — "make sure you register this only once"), verified against `supabase.com/docs/reference/javascript/auth-startautorefresh`.
- **Auth scope**: passwordless email-OTP only (`requestOtp`/`verifyOtp`/`signOut`), reusing the same local Supabase Auth mechanism already proven for the web client — no Apple/Google sign-in, MFA, or account management, per the task's explicit scope limit.
- **What was actually tested**: `apps/mobile/src/app/__tests__/sign-in.test.tsx` renders the real `SignInScreen` component (via `@testing-library/react-native`, with `useSession` mocked so no real network call happens), confirms the "Send code" button is correctly disabled until an email is entered, and confirms `requestOtp` is called with the entered email on press — 2/2 tests pass. **A real library-version bug was found and fixed here too**: `@testing-library/react-native@14`'s `render()` and `fireEvent.*` are asynchronous (return Promises) in this version, unlike earlier versions and unlike `@testing-library/react` (web); the test file was written and fixed to `await` both, confirmed empirically by running the test and observing the exact failure mode before the fix.
- **What remains PENDING**: real OS Keychain/Keystore write/read behaviour, real email-OTP round-trip against local Supabase (Mailpit), and real session persistence across an actual app process restart — all require a running app on a device/emulator.

## 5. SQLite / offline foundation

- **Schema** (`apps/mobile/src/lib/storage/db.ts`): two deliberately small foundation tables, `foundation_state` (key/value) and `foundation_outbox` (id/event_type/payload/status/created_at/synced_at) — not the future learner/content schema, not a mirror of any Supabase table, exactly as scoped.
- **Versioning**: `PRAGMA user_version`, the pattern Expo SQLite's own documentation recommends (verified 2026-08-15) — no separate migration framework was introduced.
- **A real, important finding**: `expo-sqlite`'s native module **cannot execute under Jest in this environment**. This was not assumed — it was empirically confirmed: `TypeError: _ExpoSQLite.default.NativeDatabase is not a constructor`, because there is no compiled native app/device/emulator for the native binding to attach to. This is itself honest, useful evidence of this environment's limits, not a bug to hide.
- **Response**: a small, clearly-labelled, hand-rolled in-memory mock (`apps/mobile/src/lib/storage/__mocks__/expo-sqlite-jest-mock.ts`) implements exactly the query shapes `db.ts`/`outbox.ts`/`foundation-state.ts` issue (not a general SQL engine). Its header comment states explicitly that it does **not** prove real SQLite semantics or real native-binding behaviour — it proves the migration/outbox **orchestration logic** in this repository is correct. Against this mock: schema creation, `user_version` migration, idempotent reopen, and the outbox `pending → synced` state transition (with idempotency-key uniqueness across two separate events) all **PASS** (`db.test.ts` 2/2, `outbox.test.ts` 3/3).
- **Outbox foundation** (`apps/mobile/src/lib/storage/outbox.ts`): proves exactly the five required properties — stable locally-generated idempotency id (`randomId()`, RFC-4122-shaped v4 UUID via `react-native-get-random-values`-polyfilled `crypto.getRandomValues`, not `expo-crypto`, to avoid an unnecessary extra dependency), survives process restart (via SQLite persistence, logic-proven), starts pending, is readable while pending, transitions to non-pending after a simulated acknowledgement. No production learner-evidence semantics, no mastery logic — the dev-proof screen's synthetic event is explicitly labelled `dev-proof.synthetic-event`.
- **What remains PENDING**: real on-device file persistence across an actual OS-level app restart (not just re-opening the JS module handle within one process, which is what "idempotent reopen" above actually tests).

## 6. Navigation / UX / accessibility foundation

- **Navigation**: Expo Router, current official `Stack.Protected` authentication pattern (`src/app/_layout.tsx`) — a root `Stack` with two mutually-exclusive protected branches (`(app)` when a session exists, `sign-in` when it doesn't), verified against `docs.expo.dev/router/advanced/authentication/` (2026-08-15). A `SplashScreenController`-equivalent keeps the native splash visible until session restoration resolves (`isLoading` from `SessionProvider`).
- **Shell**: bootstrap/loading boundary → sign-in (email/OTP) → authenticated home (session email, local-state-restoration proof) → dev-only diagnostics screen (`__DEV__`-gated, not reachable in production builds). No dashboard sprawl, no syllabus browser, no lessons/questions, no progress graphs, no gamification.
- **Accessibility**: explicit `accessibilityRole`/`accessibilityLabel`/`accessibilityState` on every interactive element in the sign-in and home screens; `minTouchTarget = 44` constant applied to every button/input; error text uses `accessibilityLiveRegion="polite"`; no colour-only signalling (error text is red **and** textual, success/fail rows in the dev-proof screen use colour **and** the word PASS/FAIL). Text scaling was not empirically verified (requires a running app with OS text-scaling applied) — recorded as PENDING, not claimed.
- **Motion/haptics**: a single restrained `Haptics.impactAsync(ImpactFeedbackStyle.Light)` proof exists on the dev-only diagnostics screen only — not in the production sign-in/home flow, and not a motion system. `react-native-reanimated`/`react-native-gesture-handler` were kept (not removed) because the SDK 57 default Expo Router template already ships and expects them (per the task's own carve-out for this exact situation); no Rive, no Skia, no decorative animation library was added.
- **Design tokens**: `apps/mobile/src/lib/tokens.ts` — a genuinely minimal local constants file (spacing/radius/colour/typography/motion-duration), explicitly commented as not the final design system and not a copy of the web client's Tailwind tokens.
- **Explicitly not implemented**: the final learner-facing design system, the governed motion-token system described in `MOBILE-UX-ENGINEERING-STANDARD.md` §3, and any haptic semantic beyond the single proof above.

## 7. Android / iOS verification

**Android:**
- Configuration: `app.json` Android block (adaptive icon, package identifier), `eas.json` Android build profiles (development/preview APK, production) — all present and valid.
- Build (compiled `.apk`/native binary): **NOT_RUN**. No Android SDK, no JDK, no `adb`, no emulator exist in this environment — confirmed by direct inspection (`java -version` → command not found; `ANDROID_HOME`/`ANDROID_SDK_ROOT` unset; `adb`/`emulator` not on `PATH`; no Android Studio install found under `Program Files` or the user's `AppData\Local`). Per the task's explicit instruction, no attempt was made to silently install Android Studio/SDK/JDK (a large, unapproved host-system change) to force this.
- Metro/Hermes bytecode compilation (a distinct, real, lesser proof — see §3 Tier 2b): **PASS**.
- Runtime: **NOT_RUN** (no device/emulator to run on).
- **ANDROID BUILD VERIFIED: NO. ANDROID CONFIGURATION + BYTECODE-COMPILATION ONLY VERIFIED: YES.**

**iOS:**
- Configuration: `app.json` iOS block (bundle identifier, `supportsTablet: false`), `eas.json` covers iOS implicitly (platform-agnostic profiles) — present and valid.
- Local simulator: genuinely impossible on Windows — not attempted, not claimed.
- Metro/Hermes bytecode compilation: **PASS** (see §3 Tier 2b — this step needs no Xcode).
- Cloud build via EAS: **NOT_RUN**. This requires an EAS account/login (`eas login`/`eas init`), which is not available in this environment. Per the task's explicit stop-boundary instruction, this was **not worked around** — no `extra.eas.projectId` placeholder was fabricated in `app.json` (a real GUID would be misleading config; Expo does not support a documented "safe placeholder" for this field). `eas.json`'s build profiles were created (they require no account), but `eas build` itself was not attempted.
- **iOS BUILD VERIFIED: NO. iOS CONFIGURATION + BYTECODE-COMPILATION ONLY VERIFIED: YES. External prerequisite: an EAS account (Product Owner action) before a real iOS build can be attempted.**

## 8. Performance baseline

Per `MOBILE-UX-ENGINEERING-STANDARD.md` §9, CC-04M deliberately invented no millisecond budgets; CC-04N's job is to establish the *first real baseline* and a *repeatable procedure*, not to fabricate device numbers.

**What was actually measured (dev-machine only, environment `dev-machine-metro-jest` in the code's own `PerformanceEnvironment` type):**

| Measurement | Value | What it actually measures |
|---|---|---|
| Metro bundle (Android, cold-ish) | 17903ms first run / 13515ms second run | Bundler compile time on this dev machine — **not** app runtime performance |
| Metro bundle (iOS) | 24421ms | Same, iOS target |
| Jest shared-package-proof execution | ~4ms (in-process) | Logic execution under Node/Jest — **not** on-device Hermes timing |
| Jest outbox-proof execution | sub-millisecond per operation (mocked SQLite) | Mock-backed logic timing — **not** real SQLite I/O latency |

None of these are claimed as "app performance" — they are dev-toolchain timing, recorded honestly because they are the only numbers this environment can actually produce.

**A repeatable instrumentation harness exists and is reusable on real hardware**: `apps/mobile/src/lib/native-proof/performance.ts`'s `measure()` function tags every sample with an explicit `PerformanceEnvironment` (`android-emulator` / `android-physical-device` / `ios-simulator` / `ios-physical-device` / `dev-machine-metro-jest`), so the exact same instrumentation used above can be pointed at cold-start, warm-start, local-state-restore, SQLite read/write, and navigation-interaction measurements the moment a device/emulator is available — no new harness needs to be built.

- **emulator_baseline: NOT_RUN** (no emulator).
- **physical_android: PENDING PRODUCT OWNER DEVICE QUALIFICATION.** Per the task's explicit instruction, the low/mid-range-Android requirement is **not lowered or waived**, and a flagship emulator was **not** substituted and called equivalent (none was available to substitute, in any case). Recommended reference-device class for later selection: a genuinely low/mid-range Android device from the last 2–3 years (e.g. widely-available sub-£200 class hardware, Android 12+, 4GB RAM) — a specific commercial device is deliberately **not** selected here, as that requires a Product Owner/governance decision.
- **physical_ios: PENDING** — requires Apple hardware and (for anything beyond the local simulator, which itself requires macOS) an EAS account.

## 9. Testing / CI / security

**Test tiers** (per `MOBILE-ARCHITECTURE.md` §8, kept strictly separate — see §3):

| Tier | Tool | Result |
|---|---|---|
| 1 — Shared-engine unit (existing) | Vitest, root | **PASS**, 53/53 tests, 7 suites (38 original + 15 for the CC-04N-S/CC-04N-S1 security audit-gate, `check-npm-audit.test.ts`) — unaffected by this change (verified after fixing a real regression, see below) |
| 2a — Native/Hermes logic proof | Jest (`jest-expo`) | **PASS**, `shared-packages.test.ts` 2/2 |
| 2b — Metro/Hermes bytecode compilation | `expo export` | **PASS**, both platforms (see §3) |
| 2c — On-device Hermes execution | — | **NOT_RUN** (no device) |
| 3 — Mobile component/application | `@testing-library/react-native` via Jest | **PASS**, `sign-in.test.tsx` 2/2 |
| 3 — SQLite/outbox logic (mocked) | Jest | **PASS**, `db.test.ts` 2/2, `outbox.test.ts` 3/3 |
| 4 — Native E2E | Maestro (selected, not yet installed) | **NOT_RUN** — see below |
| 5 — Manual/real-device qualification | — | **PENDING**, see §11 |

Mobile Jest total: **4 suites, 9/9 tests passing** (`npm run mobile:test`).

**Native E2E tooling decision**: `MOBILE-ARCHITECTURE.md` left Maestro vs. Detox open. **Maestro is selected** as the smallest justified choice: it is framework-agnostic (drives the compiled app via its own driver, no in-app test instrumentation to build into the release binary, unlike Detox's gray-box approach) and can run against a plain build artefact once one exists. **It was deliberately not installed or run in this task** — there is no device/emulator in this environment to run it against, and installing a CLI with nothing meaningful to execute would be configuration theatre, not evidence. This is recorded as a decision, not an omission.

**Two real regressions were found and fixed during validation** (both are evidence the validation was genuinely run, not assumed):
1. The root Vitest config's `include: ["apps/**/*.test.{ts,tsx}"]` pattern started sweeping up `apps/mobile`'s Jest-only test files, which use Jest globals and RN Flow-syntax source Vitest cannot parse. Fixed by excluding `apps/mobile/**` in `vitest.config.ts`, with a comment explaining why. Re-verified: `npm run test:unit` is back to the pre-existing 38/38 clean baseline.
2. Expo Router's file-based routing swept the colocated `src/app/sign-in.test.tsx` into the **production** route bundle (Metro tried to resolve `@testing-library/react-native`'s Node-only `console` import and failed hard during `expo export`). Fixed by moving the test into `src/app/__tests__/` (Router's conventional exclusion pattern), confirmed by re-running `expo export` successfully afterward.

**Web regression check** (Part 40): `npm run build --workspace apps/web` — **PASS**, clean production build, unchanged. Root `npm run typecheck` / `npm run lint` — **PASS** across every workspace (web, mobile, all `packages/*`, `scripts/content`, `scripts/boundary-checks`) with **zero errors and zero warnings** after cleanup (see §10 for what was cleaned up).

**Security** (Part 35, see also `SECURITY-VERIFICATION-MATRIX.md` SEC-M-010/011/012/006b):
- `service_role_in_client: false`, `privileged_secret_in_client: false` — confirmed by code review; only `EXPO_PUBLIC_SUPABASE_URL`/`EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY` exist in `apps/mobile`.
- **`image-size@1.2.1`** (transitive dependency of Metro/`@expo/metro`, itself a transitive dependency of `expo@57.0.13` — Expo SDK 57's own toolchain, not something this repository depends on directly) is affected by **two** independent HIGH-severity GHSA advisories (`GHSA-w3rx-r6r6-pgpr`, `GHSA-5p2g-fcmc-qvqq`; CVSS 3.1 7.5 each). `npm audit fix --force` would downgrade `react-native` to `0.72.17`, directly violating the accepted `ADR-0001` baseline — rejected. **Neither advisory has a patched release at all** (both GHSA records list "Patched versions: None"; `image-size@2.0.2` is npm's current `latest` tag and remains vulnerable to both) — a prior `overrides` pin to `2.0.2` was tested and reverted, both because `npm ls` reported it `invalid` against Metro's declared range and because it would not have fixed anything regardless. Metro's own maintainers attempted three separate migrations away from `image-size` (PRs #1859/#1853/#1852, all abandoned). CC-04N-S (2026-08-15, bounded security correction pass) confirmed no compatible upstream fix exists anywhere in the accepted Expo SDK 57 line and implemented a governed audit-gate mechanism instead: `scripts/security/check-npm-audit.mjs` fails on any unexpected HIGH/CRITICAL finding while recognising this exact, time-bounded, version- and dependency-path-pinned exception (`scripts/security/npm-audit-exceptions.json`, expires 2026-09-14). CC-04N-S1 (2026-08-15, follow-up hardening pass) closed two gaps: the gate now independently re-derives the actual dependency path from real `npm ls --json --all` data every run (drift, or an additional unexpected path, both fail), and `npm run security:audit` (NORMAL mode, the only mode CI ever calls) now permits ONLY `status: "accepted"` exceptions -- a `status: "proposed"` exception fails NORMAL mode outright. A separate, explicit `npm run security:audit:review` (REVIEW mode) exists solely to prove a still-proposed exception would work once accepted, without making CI green. Tested with 15 deterministic fixture-based unit tests. **On 2026-08-15, Product Owner / Project Architect explicitly ACCEPTED both exceptions through 2026-09-14** (not extended) — `scripts/security/npm-audit-exceptions.json` now records `status: "accepted"`, `acceptedBy: "product-owner / project-architect"`, `acceptedOn: "2026-08-15"` for both `SEC-EXC-001` and `SEC-EXC-002`. `npm run security:audit` (NORMAL mode, the only mode CI ever calls) now correctly PASSES; `npm run security:audit:review` also still PASSES. Raw `npm audit --json` remains completely unfiltered and unchanged by this acceptance (still the full 15-high/8-moderate finding set) — the acceptance affects only the governed gate's interpretation of these two exact tuples, never the underlying `npm audit` data or the vulnerability itself, which remains present in `image-size@1.2.1`. See `SECURITY-VERIFICATION-MATRIX.md` SEC-M-006b for the full accepted-exception record. It remains dev/build-toolchain-only exposure (malicious-image DoS during local/CI Metro bundling), never a runtime/production learner-facing attack surface.
- CI (`.github/workflows/ci.yml`): added, to the existing fast `checks` job (no new slow/costly job): `check:mobile-boundary`, `mobile:test` (Jest), `expo-doctor`, and `expo export` for both platforms (Metro bundle validation — no native SDK, ~15–25s each, no EAS/cloud cost). **No native cloud build (EAS) was added to CI** — per the task's explicit cost/economics guidance, that remains a separate, manual, future "native build/release qualification" tier, not run on every commit.

## 10. Documentation / consistency audit

**Durable documents reviewed/updated** (implementation detail only — CC-04M's architecture documents were not rewritten):
- `PROJECT-STATUS.md`, `docs/roadmap/ROADMAP.md` — CC-04N recorded as the active implementation checkpoint (see the separate governance-transition step, not part of this evidence file).
- `README.md` — mobile dev commands documented alongside the existing web commands.
- `apps/mobile/README.md` — full Windows developer workflow (Part 54).
- `docs/security/SECURITY-VERIFICATION-MATRIX.md` — SEC-M-010/011/012/006b added (this document, §9).
- `docs/architecture/evidence/CC-04N-IMPLEMENTATION-CONSISTENCY-AUDIT.md` — bounded staleness follow-up (see that file; CC-04M's own audit evidence was left unedited to preserve historical accuracy, per Documentation Standard).

**Cleanup during validation** (not architectural, purely mechanical): removed an unused `eslint-disable` directive, converted two `require()`-style Jest mock imports to ES imports (using Jest's `mock`-prefixed hoisting exemption), and reordered imports ahead of `jest.mock()` calls (safe because Babel hoists `jest.mock()` regardless of source position) — all to reach a genuinely clean `0 errors, 0 warnings` lint result rather than leaving avoidable warnings in place.

**Remaining contradictions**: none found. The repository consistently states native iOS/Android are primary, web is secondary, Expo + React Native is the accepted technology, and CC-04N is a foundation (not CC-05) throughout the documents touched.

## 11. Risks / deferred items (see also the completion report)

- **Low-end Android physical-device performance: PENDING PRODUCT OWNER DEVICE QUALIFICATION** — not waived, not simulated with a flagship substitute.
- **iOS physical-device/build: PENDING** — requires Apple hardware and an EAS account.
- **EAS account/credentials**: required before any real Android or iOS build/submission can proceed past configuration. Not created here (explicit non-goal).
- **`image-size` HIGH-severity advisories (x2)**: still open upstream (confirmed no patch exists for either), tracked in `SECURITY-VERIFICATION-MATRIX.md` SEC-M-006b with a governed, tested audit-gate mechanism (`npm run security:audit`). **Accepted** by Product Owner / Project Architect on 2026-08-15, expiring **2026-09-14** — a mandatory re-review is required at or before that date (see `SECURITY-VERIFICATION-MATRIX.md` SEC-M-006b and `PROJECT-STATUS.md`). This is a temporarily accepted risk, not a resolved vulnerability.
- **Native E2E (Maestro)**: tool selected, not installed/run — no device to validate against yet.
- **Published learner-runtime content projection**: still not implemented (correctly out of CC-04N scope, per `MOBILE-ARCHITECTURE.md` §2 and the task's explicit scope guard).
- **Production evidence sync / mastery reconciliation**: still not implemented (outbox is structural proof only, per the task's explicit scope guard).
- **Observability, push notifications, app-store release**: all still deferred, as intended.

## Dependency hygiene (Part 41)

Every dependency added to `apps/mobile`, with purpose and compatibility source:

| Package | Resolved version | Purpose | Core/optional | Compatibility source |
|---|---|---|---|---|
| `expo` | 57.0.13 | SDK baseline | Core | `npx create-expo-app --template default@sdk-57`; `npx expo install --check` |
| `expo-router` | 57.0.13 | Navigation | Core | Default template |
| `expo-constants`, `expo-linking`, `expo-splash-screen`, `expo-status-bar`, `expo-system-ui` | 57.x | Router/app-shell requirements | Core (template defaults) | Default template |
| `expo-device` | 57.0.1 | Device info for future low-end-device diagnostics | Core (small, kept from template) | Default template |
| `expo-secure-store` | 57.0.1 | OS Keychain/Keystore-backed session key storage | Core | `docs.expo.dev` SDK reference; `expo install --fix` |
| `expo-sqlite` | 57.0.1 | Local durable storage foundation | Core | `docs.expo.dev/versions/latest/sdk/sqlite/`; `expo install --fix` |
| `expo-haptics` | 57.0.1 | Single restrained haptic proof | Core (minimal) | `expo install --fix` |
| `react`, `react-native` | 19.2.8, 0.86.2 | Baseline | Core | Aligned to repo's existing React version to eliminate a duplicate-instance bug (§2) |
| `react-native-gesture-handler`, `react-native-reanimated`, `react-native-worklets`, `react-native-safe-area-context`, `react-native-screens` | template-pinned | Required/expected by Expo Router's default template | Core (kept, not added speculatively) | Default template |
| `@supabase/supabase-js` | ^2.112.3 | Backend client (same backend as web, different platform adapter) | Core | Matches web client's existing pin |
| `@react-native-async-storage/async-storage` | 2.2.0 | Session-payload storage (paired with SecureStore) | Core | Supabase's own documented Expo/RN pattern; `expo install --fix` |
| `aes-js` | ^3.1.2 | AES-256 encryption for `LargeSecureStore` | Core | Supabase's own documented pattern (not a bespoke choice) |
| `react-native-get-random-values` | ~1.11.0 | `crypto.getRandomValues` polyfill (required by `aes-js` and the outbox's UUID generator) | Core | Supabase's own documented pattern |
| `@testing-library/react-native` | ^14.0.1 | Component tests | Dev only | Current npm latest at implementation time |
| `jest`, `jest-expo`, `@types/jest` | 29.7.0 / 57.0.4 / 29.5.14 | Test runner + Expo preset | Dev only | `docs.expo.dev/develop/unit-testing/`; `expo install --fix` for exact peer versions |
| `eslint-config-expo` | ~57.0.1 | Official current Expo ESLint flat config | Dev only | `docs.expo.dev/guides/using-eslint/` |
| `typescript` | ~6.0.3 | Matches Expo SDK 57's own TS baseline | Dev only | Default template |

**Deliberately not added**: Redux/Zustand/MobX (no state-management need beyond React primitives at this stage), any analytics/monetisation SDK, Rive, React Native Skia, Prettier (repo doesn't use it elsewhere), any push-notification credential/SDK beyond what's already in the default template.
