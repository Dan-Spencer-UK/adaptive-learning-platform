# mobile

The Expo + React Native application for the Adaptive Learning Platform --
the **primary** learner client (see
[`docs/architecture/adr/ADR-0001-mobile-client-technology.md`](../../docs/architecture/adr/ADR-0001-mobile-client-technology.md)
and [`docs/architecture/MOBILE-ARCHITECTURE.md`](../../docs/architecture/MOBILE-ARCHITECTURE.md)).
[`apps/web`](../web) remains the secondary web client.

This is the **CC-04N foundation**: it proves the architecture works, not a
learner-facing product yet. See
[`docs/architecture/evidence/CC-04N-MOBILE-FOUNDATION-EVIDENCE.md`](../../docs/architecture/evidence/CC-04N-MOBILE-FOUNDATION-EVIDENCE.md)
for exactly what was verified and what remains pending real-device
qualification.

Run all commands from the repository root unless noted otherwise -- see the
root [`README.md`](../../README.md) and
[`docs/development/DEVELOPMENT-WORKFLOW.md`](../../docs/development/DEVELOPMENT-WORKFLOW.md).

## Windows developer workflow

1. **Start local Supabase** (shared with the web client -- one instance serves both):
   ```bash
   npm run db:start
   ```
2. **Configure environment**: copy [`.env.example`](.env.example) to `.env.local` in
   this directory and fill in the values from `npx supabase status`. See the
   comments in `.env.example` for the Android-emulator-vs-physical-device URL
   difference (`10.0.2.2` vs your LAN IP) -- do not hard-code a LAN IP into any
   committed file.
3. **Start the native app**:
   ```bash
   npm run dev:mobile
   ```
   This runs `expo start` and prints a QR code / terminal menu.
4. **Run on Android**:
   - **Emulator**: open Android Studio's Device Manager and start a virtual
     device first, then press `a` in the `expo start` terminal (or run
     `npm run mobile:android`).
   - **Physical device**: enable USB debugging, connect via USB (or the same
     Wi-Fi network for wireless debugging), then press `a` the same way.
   - Requires the Android SDK, a JDK and `adb` to be installed and on `PATH` --
     see [`docs/architecture/evidence/CC-04N-MOBILE-FOUNDATION-EVIDENCE.md`](../../docs/architecture/evidence/CC-04N-MOBILE-FOUNDATION-EVIDENCE.md)
     for this machine's current tooling status.
5. **iOS**: no local simulator is available on Windows. iOS validation on this
   machine is limited to TypeScript/shared-logic checks and (once an EAS
   account exists) cloud builds via `eas build --platform ios --profile
   development`. See the evidence document for the exact external
   prerequisite.
6. **Run mobile tests**:
   ```bash
   npm run mobile:test
   ```
7. **Run the web client separately** (unaffected by any of the above):
   ```bash
   npm run dev
   ```
8. **Logs**: Metro/JS logs appear in the `expo start` terminal; native
   Android logs are visible via `adb logcat` (Android SDK required) or in
   Android Studio's Logcat panel when running on an emulator/device.
9. **Stop services**: `Ctrl+C` the `expo start` terminal; `npm run db:stop`
   to stop local Supabase when done.

## Foundation diagnostics screen

A dev-only "Foundation diagnostics" screen (reachable from the home screen,
only in development builds -- see `src/app/(app)/index.tsx`'s `__DEV__`
guard) shows the live results of the shared-package runtime proof, the
SQLite outbox proof, and any performance samples collected this session.
This is the fastest way to manually confirm the foundation is working after
a change -- see
[`docs/architecture/evidence/CC-04N-MOBILE-FOUNDATION-EVIDENCE.md`](../../docs/architecture/evidence/CC-04N-MOBILE-FOUNDATION-EVIDENCE.md)
§Manual checkpoint for the full Product Owner review checklist.

## What this is not (yet)

No lessons, questions, syllabus browser, progress UI, push notifications,
production content projection, production sync, or app-store release
credentials exist in this package. See
[`PROJECT-STATUS.md`](../../PROJECT-STATUS.md) and
[`docs/roadmap/ROADMAP.md`](../../docs/roadmap/ROADMAP.md) for what comes
next (CC-05 and later).
