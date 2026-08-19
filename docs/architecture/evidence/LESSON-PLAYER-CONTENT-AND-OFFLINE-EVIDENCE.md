# Lesson Player — Content & Offline Evidence

Evidence for the first production-intent native Lesson Player slice's
local-content-library and offline-execution contracts (task brief §25,
§41, §43). Mirrors `docs/architecture/evidence/CC-05C-NATIVE-LEARNER-PROVING-SLICE.md`'s
discipline: distinguishes what was actually run/verified from what
remains outstanding, and never claims Android qualification without an
actual device/emulator run.

## 1. Active content release

`lesson.electrical.ohms-law` v1, content release **`lesson-plan-pilot-v1`**
(the real governed content release identity — not a synthetic proving-slice
placeholder; see `scripts/content/data/lesson-ohms-law.ts`).

## 2. Dependency manifest (`computeLessonContentDependencies`, real content)

Mechanically computed from the real governed `LessonPlan` — not hand-counted:

| Category | Count | Ids |
|---|---|---|
| Assertion families | 6 | `electrical.core_quantities`, `electrical.ohms_law`, `electrical.si_units`, `foundational.algebraic_technique`, `foundational.arithmetic_technique`, `foundational.proportion_and_units` |
| Assertion statements | 10 | `EL-CONCEPT-{CURRENT,RESISTANCE,VOLTAGE}-001`, `EL-OHM-{PROPORTIONALITY,REARRANGE,RELATIONSHIP,SELECT-RELATIONSHIP,SOLVE-I,SOLVE-R,SOLVE-V}-001` |
| Capabilities | 10 | `cap.ohms_law.{apply_correct_unit,apply_substitution,check_plausibility,diagnose_rearrangement_error,diagnose_wrong_operation,recognise_relationship,select_rearrangement,solve_for_current,solve_for_resistance,solve_for_voltage}` |
| Question blueprints | 8 | `ohms_law.{diagnose_rearrangement_error,diagnose_wrong_operation,match_variables_units,plausibility_check,select_rearrangement,solve_for_current,solve_for_resistance,solve_for_voltage}` |
| Formula families | 1 | `formula.ohms_law` |
| Worked-example blueprints | 3 | `worked.ohms_law.{solve_current,solve_resistance,solve_voltage}` |
| Visual-aid blueprints | 1 | `mnemonic.vir_triangle` |
| Diagram blueprints | 0 | (none — Ohm's Law has no diagram-blueprint step) |
| Misconceptions | 3 | `MIS-EL-OHM-{REARRANGE-ERROR,UNRELATED-SYMBOLS,WRONG-OPERATION}-001` |

## 3. LOCAL READY status

`prepareLessonContent()` validates this manifest against
`OHMS_LAW_LOCAL_CONTENT_INVENTORY` (the bundled "PROVING-SLICE LOCAL
SEEDING" payload, `apps/mobile/src/lib/lesson-content/lesson-ohms-law-content-fixture.ts`)
and records the result in the `local_lesson_content` SQLite table.

- **Result with the real bundled inventory: `ready`, 0 missing dependencies**
  (proven by `packages/learning-engine/src/content-dependencies.test.ts`,
  `apps/mobile/src/lib/lesson-content/content-availability.test.ts`, and
  the Lesson Player screen's own mount-time `prepareLessonContent` call,
  exercised in every `lesson-player-screen.test.tsx` integration test).

## 4. Missing-dependency example (mechanism proof)

`apps/mobile/src/lib/lesson-content/local-content-store.test.ts`'s
`"marks a lesson invalid, with the missing dependencies listed, when the
inventory is incomplete"` test proves the real (not fabricated) failure
path: given a manifest requiring `qb.a` against an empty inventory, the
store records `status: "invalid"`, `missingDependencies: [{ category:
"questionBlueprint", id: "qb.a" }]`, and `preparedAt: null`. The dev-only
QA route (`(app)/dev-lesson-qa.tsx`) exposes a "Simulate missing content"
action that reproduces this against the real manifest interactively.

## 5. Active-session content-release stability

`LessonSessionState.contentRelease` is set once, at `startSession`, from
the assembled `LessonInstance.contentRelease`, and is never reassigned
by any subsequent `advanceSession`/`submitStepAnswer`/`acknowledgeStep`
call (see `apps/mobile/src/lib/lesson-session/lesson-session-controller.ts` —
`advanceSession` only ever spreads `...state`, mutating `stepSequence`/
`currentIndex`/`completedStepIds`, never `contentRelease`). Session
resumption (`loadLessonSession`) reads the persisted state verbatim, so a
resumed session continues against the exact content release it started
with even if a newer release were prepared in the background in the
meantime — proven by `lesson-player-screen.test.tsx`'s
`"persists an active session that a fresh screen instance resumes from
the same step"` test.

## 6. Offline execution — code-level proof

Every operation task brief §25K lists as required to run with zero
network access is exercised, end to end, by the Jest-mocked-SQLite
integration tests (`lesson-player-screen.test.tsx`,
`lesson-player-branch.test.tsx`) with `expo-sqlite`/`expo-haptics`
mocked and **no network client of any kind constructed or mocked** —
the Lesson Player screen never imports or calls the Supabase client:
assembly, step resolution, question generation, evaluation, feedback,
within-session branching, local progress persistence, local evidence
queuing, and session restoration all run through this path with no
network dependency in the import graph.

## 7. Real Android device/emulator qualification

**RUN.** `npx expo run:android` built and installed `dev.alp.mobile.foundation` on a
running Android emulator (`emulator-5554`, AVD `ALP_Current`) under JDK 17
(Android Studio's bundled JDK 25 fails the native build — see engagement notes).
The real email/session sign-in was already established from a prior session and
persisted across every relaunch below via the existing CC-04N SQLite-backed
session store. Every interaction described was driven by real `adb input
tap`/`adb shell uiautomator dump` against the actual rendered app under real
Hermes — not simulated, not a Jest re-implementation.

| Tier | Result |
|---|---|
| Node/Vitest (learning-engine content-dependencies) | pass (see §2) |
| React Native/Jest (component + session + integration) | pass (see package summary in completion report) |
| **Android emulator — happy path** | **RUN.** Orientation → activate-prior-knowledge → concept explanation (real `EL-OHM-RELATIONSHIP-001` statement) → formula + VIR-triangle representation (real accessibility description text) → `match_variables_units` graded question, answered correctly, real "Correct" feedback → worked example (`V = 4 × 6`, `V = 24 V`) → `solve_for_current` graded question (`I = 24/6`), answered correctly. |
| **Android emulator — real governed misconception branch (task brief §20)** | **RUN.** At `misconception_check_wrong_operation` a deliberately wrong classification (`rearrangement_error` instead of the correct `wrong_operation`) was submitted; the real `MIS-EL-OHM-WRONG-OPERATION-001` misconception message rendered ("This looks like the wrong operation was used…"); the app spliced `remediation_rearrangement` into the session immediately after the current step (progress `7/15` → `8/16`), matching the documented splice-vs-jump branch semantics. The remediation step's own embedded question (`solve_for_resistance`, `R = 248/8 = 31`) was answered correctly, clearing remediation; the app then jumped the pointer *directly* to `plausibility_check_transfer` (`9/16`), skipping `independent_question_resistance`/`select_rearrangement_transfer`/`misconception_check_rearrangement` entirely on this path — proving the "already in `stepSequence`, pointer jump" half of the branch design on real hardware, not just in Jest. |
| **Android emulator — completion** | **RUN.** `plausibility_check_transfer` (216 V actual vs 6 V reported → "Too low", correct) → `retrieval_check` (`solve_for_voltage`, `V = 9 × 5 = 45`, correct) → `recap` → `exit_completion` (real `completionCriteria.exitSummary` text rendered, never `LessonStep.purpose`) → the actual completion screen: "Lesson complete", "Ohm's Law", "~20 min" (real `estimatedDurationMinutes`), the real exit summary, and a single truthful "Continue learning" button — no XP/streak/score/gamification (task brief §36). |
| **Android emulator — session persistence across a full process kill** | **RUN.** `adb shell am force-stop` followed by a cold relaunch (while online, so Metro could re-serve the dev-client JS bundle — see gap below) landed back on Foundation home with the auth session intact and the pre-existing CC-05C "local-state restoration proof" widget confirming SQLite state survived the kill. |
| **Android emulator — LOCAL READY (task brief §25)** | **RUN.** The dev-only QA route (`dev-lesson-qa`) showed `Local content status: ready`, the real computed manifest counts (8 question blueprints, 1 formula family, 3 worked examples, 1 visual aid, 10 assertion statements, 3 misconception descriptions), and `Active session: No active session` after the prior session completed. |
| **Android emulator — offline execution of an already-running session (task brief §25/§41)** | **RUN.** With the lesson already open, connectivity was cut (`adb shell svc wifi disable && adb shell svc data disable`; status bar confirmed no signal/wifi icon throughout). The session advanced through orientation → concept → VIR-triangle steps and reached the `match_variables_units` graded question entirely offline; the question was answered, evaluated, and returned real "Correct" feedback with **zero network connectivity** — the core LOCAL READY claim, proven on real hardware, not only in Jest. |
| **Android emulator — offline interruption/restoration (task brief §41)** | **RUN, within one honest constraint (see below).** The app was backgrounded (`adb shell input keyevent 3`) and brought back to the foreground (`adb shell am start`) while still fully offline; the Lesson Player resumed at the exact same step with the same feedback state visible, with no crash and no network dependency. Connectivity was then restored (`adb shell svc wifi enable && adb shell svc data enable`), confirmed via the status bar (5G icon returned). |
| iOS Simulator | **NOT_RUN** — not available on Windows |
| Physical device (either platform) | **NOT_RUN** — no physical device available in this environment |

**Honest gap — full process kill while offline was not achievable in this rig.**
This build is an Expo **dev-client** (not a production release APK), which does
not embed its JS bundle in the APK; on every full process cold start it must
reach Metro to load `index.android.bundle`. Attempting `adb shell am
force-stop` followed by a relaunch *while offline* produced a genuine React
Native red-box ("Unable to load script… make sure you're running Metro"),
confirmed on two independent attempts. This is a constraint of the **dev-client
tooling used for this proving slice**, not of the Lesson Player's own
architecture: the screen's own code makes zero network calls in its import
graph (proven independently in §6 by inspection and by the Jest integration
tests, which mock no network client because none is constructed). A production
release build with an embedded bundle would not exhibit this limitation. Given
this, the achievable and actually-performed proof of §41's
interruption/restoration requirement was background/foreground of the running
process while offline (above), which exercises the same
persistence/restoration code path (`loadLessonSession`/`getActiveLessonInstanceId`)
without requiring a fresh bundle load — the one difference is that the JS
engine itself was never destroyed, only backgrounded.

**Also observed, not a product defect:** while offline, the Metro dev-client's
own LogBox surfaced an "Open debugger to view warnings" toast that visually
sits near the bottom of the screen and was found to intercept touches on
elements underneath it even where the toast is not verbatim covering them
(the same overlay z-order quirk affected a button on the `dev-lesson-qa`
screen and, briefly, the in-lesson "Continue" button). This is a Metro
dev-tooling artifact that only appears in dev-client builds while disconnected
from Metro — it does not exist in a production build and is not part of the
Lesson Player's own UI.

**A genuine, on-device defect was found and fixed during this qualification:**
the Lesson Player's header (progress indicator + Exit button) rendered under
the status bar on first on-device inspection — `SafeAreaView`'s `edges` prop
was `["bottom"]` only, omitting the top inset. Fixed to `["top", "bottom"]` in
`apps/mobile/src/app/(app)/learn/lesson-player.tsx`; re-verified fixed via
Metro fast-refresh on the same running emulator (screenshot comparison:
header clipped under the status bar before the fix, clear of it after).

## 8. Screenshots

Following this engagement's established convention (`CC-05C-NATIVE-LEARNER-PROVING-SLICE.md`
§13), screenshot binaries are not committed to the repository. The full,
chronologically-ordered set of ~45 screenshots captured during this
qualification (device launch through the offline sequence and connectivity
restoration) exists locally in the session's scratchpad directory, named
`screen10.png` … `screen56.png` (raw sequence) with several also saved under
descriptive names (`10-lesson-player-open.png`, `24-remediation.png`,
`34-completion-screen.png`, `54-offline-answered.png`,
`55-offline-restored.png`, etc.). These are ephemeral working artifacts of
this session, not durable repository evidence — the narrative in §7 is the
durable record of what was verified.
