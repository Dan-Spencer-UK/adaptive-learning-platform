---
id: PROD-003
status: approved
owner: project-architect
last_reviewed: 2026-08-23
---

# Mobile UX Engineering Standard

## Purpose

Native iOS and Android are the primary learner platforms (see [`PRODUCT-PRINCIPLES.md`](PRODUCT-PRINCIPLES.md) and [`docs/governance/PROJECT-CONSTITUTION.md`](../governance/PROJECT-CONSTITUTION.md)). "Native-mobile-first" is not satisfied by a responsive layout. This document is the durable, testable quality bar the native learner app must meet. It is an acceptance criterion, not aspirational polish to add later.

This document does not select a client framework; see [`docs/architecture/adr/ADR-0001-mobile-client-technology.md`](../architecture/adr/ADR-0001-mobile-client-technology.md) for that decision. It applies regardless of which framework implements it.

This document sets the measurable performance/polish bar; it does not define lesson *structure* or progression model. See [`docs/architecture/LESSON-PLAYER-AND-LESSON-PLAN-ARCHITECTURE.md`](../architecture/LESSON-PLAYER-AND-LESSON-PLAN-ARCHITECTURE.md) for the step-based lesson-progression architecture the future lesson player must implement while meeting this standard.

## Reference bar, not a copy target

The quality reference is leading consumer learning apps (e.g. Duolingo) for **perceived polish and responsiveness**, not their visual identity, mechanics or interaction model. Product visual identity, motion language and information design remain project-owned (consistent with [`PROJECT-CONSTITUTION.md`](../governance/PROJECT-CONSTITUTION.md)'s product-quality principle and [`PRODUCT-PRINCIPLES.md`](PRODUCT-PRINCIPLES.md) 20–21 on tone/gamification).

## 1. Perceived responsiveness

- Tap/press feedback begins on the same frame as the input event, never after a network round trip.
- **For deterministic question types, correctness is calculated locally and feedback begins immediately** — the learner never waits on a network round trip to find out whether a deterministic answer (e.g. a calculation result) is correct. The critical-path evaluation loop is:

  ```text
  learner input
        ↓
  local deterministic engine
        ↓
  immediate correct/incorrect evaluation
        ↓
  immediate feedback/motion/haptic response
        ↓
  local evidence/session state
        ↓
  background sync
        ↓
  server validation/persistence/reconciliation
  ```

  Background server synchronisation persists and reconciles learner evidence/mastery (see [`MOBILE-ARCHITECTURE.md`](../architecture/MOBILE-ARCHITECTURE.md) §2, Evidence sync); it does not sit in the critical path of ordinary answer correctness, and the UI must never appear to wait on the server to tell the learner whether a deterministic answer was right. This does not weaken the existing security/authority model: local correctness is not authorisation, and local evidence is not canonical persisted mastery — the server remains authoritative for persisted evidence, mastery state, sync acceptance and cross-device reconciliation (see `MOBILE-ARCHITECTURE.md` §7, Security integration). A future server-authoritative question category (if one is ever introduced) would be an explicit, separately documented exception to this rule, not the default.
- The likely next screen/question is prefetched or already resident locally (see [`MOBILE-ARCHITECTURE.md`](../architecture/MOBILE-ARCHITECTURE.md) offline/content architecture) so "continue" does not normally wait on a network request.
- Loading spinners are an exception-handling state (slow/cold network, first launch), not a routine transition between screens.
- Layout must not shift after initial paint of a screen (no content "popping in" once dimensions are known).
- No interaction is blocked behind a full-screen transition animation; the learner can always keep moving.
- With the device offline, an in-progress lesson session must remain usable; see the offline architecture in `MOBILE-ARCHITECTURE.md`.

## 2. Frame and motion quality

- Target a sustained 60fps baseline on the reference low-end device class (§7); use higher refresh rates opportunistically on devices that support them, without making a higher rate a functional requirement.
- Animation and gesture handling must run off the JS thread where the chosen framework supports it, so an interaction remains smooth even while other work is happening (e.g. background sync, prefetch).
- Every material animation/gesture must be verified on a real low-end Android device before it is accepted as done — simulator/emulator smoothness is not sufficient evidence.
- Decorative animation is never allowed to delay or block a learner action; if a conflict exists, responsiveness wins over decoration.

## 3. Motion system

Motion is a governed design-system layer, not a per-screen improvisation. At minimum, define shared motion tokens/behaviours for:

- press / tap
- selection (choosing an answer option, a menu item)
- answer accepted (submission acknowledged)
- correct
- incorrect
- progress (advancing through a lesson/session)
- screen transition (push/pop/modal/sheet)
- milestone (lesson complete, streak, mastery gained)
- celebration (reserved for genuinely earned moments — see §restraint below)

Each token defines timing, easing and the semantic situations it is used in. Screens consume tokens; they do not invent bespoke motion ad hoc. This keeps the app feeling coherent and makes a later framework or design refresh a token-level change rather than a screen-by-screen rewrite.

**Restraint:** per [`PRODUCT-PRINCIPLES.md`](PRODUCT-PRINCIPLES.md) 20–21 (no unnecessary gamification, calm adult tone), celebration/milestone motion must be used sparingly and must never substitute for genuine learning value or make an incorrect answer feel like a failure event.

## 4. Haptics

Haptic feedback is part of the interaction language, on platforms/devices that support it, and must degrade silently where unsupported. Minimum semantic categories, mirroring the motion tokens:

- selection
- confirmation (submission accepted)
- correct
- incorrect
- milestone

Haptics must be used consistently (the same semantic event always produces the same haptic) and sparingly — never on every routine tap, only on meaningful state changes. A learner must be able to disable haptics via platform/system settings without losing any functionality.

## 5. Design system

The learner-facing UI is a bespoke, project-owned design system, consistent with the existing "do not import a wholesale SaaS theme" rule in [`ARCHITECTURE-OVERVIEW.md`](../architecture/ARCHITECTURE-OVERVIEW.md). Third-party low-level primitives (gesture handling, base animation engines, accessible building blocks) may be used; the visible product identity, layout language and component behaviour are project-owned.

At minimum, expect first-class learner components (exact composition to be defined during mobile-foundation implementation, not this document):

- question prompt
- answer card / answer grid
- equation / numeric input
- lesson progress indicator
- feedback panel / sheet
- concept card
- mastery / progress indicator
- native numeric keypad / input
- primary/continue action
- diagram / interactive visual primitive

This is an expected minimum set, not an exhaustive or final component inventory.

The "diagram / interactive visual primitive" item is itself governed by a dedicated instructional-visual architecture, not this general UI design system: see [`docs/architecture/CC-05D-INSTRUCTIONAL-VISUAL-GOVERNANCE-AND-SEMANTIC-QA.md`](../architecture/CC-05D-INSTRUCTIONAL-VISUAL-GOVERNANCE-AND-SEMANTIC-QA.md) for how a visual is validated and [`docs/architecture/PREMIUM-INSTRUCTIONAL-VISUAL-PRODUCTION-PIPELINE.md`](../architecture/PREMIUM-INSTRUCTIONAL-VISUAL-PRODUCTION-PIPELINE.md) for how one is produced, including the future instructional-visual style guide's line hierarchy, colour roles, arrow/motion grammar and dark-theme behaviour — a narrower, visual-specific companion to this document's own general design-system scope.

## 6. Navigation

Navigation must follow native platform convention on each OS rather than a single cross-platform look:

- native stack push/pop behaviour and transitions per platform;
- platform-correct system back-gesture/back-button behaviour;
- modals and sheets used where a platform user would expect them (not as a substitute for all navigation);
- deep links resolve directly to the correct in-app destination (specific lesson, review session, auth callback) without forcing the learner through the app's default entry screen;
- app state restoration after backgrounding/termination returns the learner to where they were, including mid-lesson (see offline/session-recovery requirements in `MOBILE-ARCHITECTURE.md`);
- an interrupted session (call, notification, app switch, OS termination) must be resumable without data loss.

## 7. Accessibility

Accessibility is an acceptance criterion, not a follow-up pass, and applies in addition to (not instead of) the existing WCAG 2.2 AA requirement recorded in [`PRODUCT-PRINCIPLES.md`](PRODUCT-PRINCIPLES.md) 18 and `PROJECT-STATUS.md`. Native mobile accessibility additionally requires:

- support for OS-level text scaling / Dynamic Type without breaking layout;
- full screen-reader support (VoiceOver on iOS, TalkBack on Android) with correct semantic labels and reading order;
- logical, predictable focus order for assistive navigation;
- minimum touch-target sizing per platform accessibility guidance;
- information must never be conveyed by colour alone;
- a "reduce motion" system preference must be respected — the app must remain fully usable and legible with motion minimised;
- haptic-independent feedback path for learners who disable haptics or use a device without haptic support;
- correct use of native accessibility traits/roles per platform (not a single generic ARIA-style layer copied unmodified from the web client);
- iOS and Android accessibility behaviour must each be verified independently — passing on one platform does not imply the other passes.

## 8. Low-end device performance

Cheap and mid-range Android hardware is an explicit product requirement, not an edge case. The app must not be tuned and tested only against recent flagship iPhones/Android devices.

- Representative real-device testing must include at least one current-generation low/mid-range Android device (not only emulators/simulators).
- Memory and battery behaviour must be evaluated on that device class, not just high-end hardware.
- Any feature that materially degrades on low-end hardware (e.g. a heavy animation, an expensive diagram renderer) must degrade gracefully rather than becoming unusable.

## 9. Startup and interaction performance budgets

Architecture must measure, at minimum:

- cold start → usable home screen
- warm start
- lesson tap → first interactive question
- answer tap → visible response
- continue → next question ready
- frame drops / jank during core lesson interaction
- memory behaviour during an extended session
- offline lesson-start latency

**No fabricated numeric guarantees.** This document intentionally does not assert specific millisecond thresholds, because no baseline measurement yet exists on the target stack/devices. Instead:

- **Initial target (directional, not contractual):** cold start to a usable home screen and lesson-tap to first interactive question should each feel instantaneous to a learner on the reference low-end device — i.e. materially faster than a typical web page load, consistent with a native app rather than a wrapped website.
- **Measured acceptance threshold (to be calibrated):** the mobile-foundation implementation package (see `MOBILE-ARCHITECTURE.md`, sequencing) must establish real baseline measurements on the reference device class for each budget above, and those measured baselines — not this document — become the enforced acceptance thresholds, reviewed and only tightened or relaxed by explicit decision, not silently.

## 10. Verification

- Motion, gesture and haptic behaviour must be checked on real iOS and Android hardware, not only simulators/emulators, before acceptance.
- Accessibility must be checked with the platform's own screen reader, not assumed from the web client's WCAG compliance.
- Performance budgets (§9) must be measured, not estimated, once the mobile-foundation implementation exists.
- See [`MOBILE-ARCHITECTURE.md`](../architecture/MOBILE-ARCHITECTURE.md) for the corresponding testing/CI/release architecture that enforces this standard mechanically where practical.
