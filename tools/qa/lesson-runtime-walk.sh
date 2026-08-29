#!/bin/bash
# CC-12H: full-completion runtime QA walker for the Unit 202 mobile lesson
# player, driven over adb against a real running emulator/device. Unlike
# the earlier CC-12H smoke pass (which only proved reachability + first
# steps -- see this directory's git history for the superseded root-level
# smoke_walk.sh), this script genuinely COMPLETES every lesson: it
# computes/reads the objectively correct answer for every graded step and
# submits it, using the correct native control for each of the seven
# governed answer types (quantity, multiple_choice, formula_selection,
# multi_select, worked_error_classification, diagram_region, direction).
#
# How it knows the correct answer, without reimplementing any marking or
# RNG-seeding logic offline: the Lesson Player's pre-existing dev-only
# debug overlay (apps/mobile/src/app/(app)/learn/lesson-player.tsx,
# gated by `__DEV__ && debugOverlayEnabled`, default OFF, toggled only
# from the __DEV__-only dev-lesson-qa screen -- never reachable by a real
# learner) was extended (CC-12H) to also render, for the current graded
# step, the real GeneratedQuestionInstance's `expected.value` and -- for
# every choice-based answer type -- the exact learner-facing label to
# tap, via `resolveDevDebugAnswer` in
# apps/mobile/src/lib/lesson-content/answer-input-dispatch.tsx (the SAME
# option/label construction the real answer-input renderers use). This
# script reads that ground truth directly off the live screen instead of
# trying to replicate learner-identity/instance-seed derivation offline.
#
# Branch/remediation walks: for the four lessons with diagnostic
# misconception branching, this script deliberately submits ONE incorrect
# answer at the designated diagnostic step (see BRANCH_WRONG_STEP below)
# instead of the debug-overlay-correct one, to exercise the remediation
# branch, then answers everything else (including the remediation step
# itself) correctly -- see @alp/learning-engine's `resolveWithinSessionBranch`
# and `submitStepAnswer` (apps/mobile/src/lib/lesson-session/lesson-controller.ts):
# ANY incorrect answer on a step whose own governed
# `evidence.misconceptionTargets[0]` has a matching `misconception_detected`
# branchRoute triggers that branch, regardless of which wrong option/value
# was chosen -- so no need to target a specific distractor.
#
# CRITICAL: never run two copies of this script (or any other adb-driving
# loop) against the same emulator at once -- concurrent adb streams
# silently corrupt uiautomator dumps/taps. Always check for stray
# processes first:
#   powershell.exe -Command "Get-CimInstance Win32_Process | Where-Object { \$_.CommandLine -match 'lesson-runtime-walk' } | Select-Object ProcessId, CommandLine"
set -u

REPO_ROOT="/d/Development/adaptive-learning-platform"
QA_DIR="$REPO_ROOT/tools/qa"
DUMP="$QA_DIR/.walk-dump.xml"
RESULTS="$QA_DIR/runtime-walk-results.txt"
NODE_HELPER="$QA_DIR/uia-dump.cjs"
PACKAGE="dev.alp.mobile.foundation"
LESSON_IDS_FILE="$QA_DIR/lesson-ids.txt"

CRASH_PATTERNS="Could not connect|isn.t responding|Render Error|no native input registered|missing binding|has no governed|declares no governed|Unhandled|RCTFatal|Encountered two children with the same key"

# Lessons known to have a diagnostic misconception branch worth exercising,
# mapped to the ONE step id this script deliberately answers incorrectly
# (see header comment: any wrong answer on that step's own diagnostic
# question triggers its governed misconception_detected branchRoute).
# Sourced from scripts/content/data/lesson-*.ts (grep for
# `misconceptionTargets` + `branchRoutes` on the step whose destination is
# a `conditional_remediation_only` step) -- see the CC-12H qualification
# report for the exact line references.
declare -A BRANCH_WRONG_STEP=(
  ["lesson.electrical.ohms-law"]="misconception_check_wrong_operation"
  ["lesson.electrical.resistors-parallel"]="misconception_check_reciprocal_error"
  ["lesson.magnetism.effects-of-current"]="guided_interpret_force_direction"
  ["lesson.waveforms.ac-dc-and-sine-wave-quantities"]="misconception_check_rated_value"
)
# lesson.magnetism.effects-of-current needs a SECOND deliberate wrong
# answer (the ambiguous ungoverned "incorrect_answer" fallback route lands
# on a genuine diagnostic step, which itself must also be answered wrong
# to reach the remediation branch -- see header comment and the
# qualification report for the full branch chain).
declare -A BRANCH_WRONG_STEP_2=(
  ["lesson.magnetism.effects-of-current"]="diagnose_force_direction_error"
)

CHROME_LABEL_PATTERN='^(Continue|Submit answer|Exit lesson|Previous lesson step|Next lesson step|Back to Learn|Navigate up)$'

mkdir -p "$QA_DIR"

log() { echo "$1" | tee -a "$RESULTS" >&2; }

dump() {
  # Retries a couple of times if the dump comes back empty/tiny (host CPU
  # load / compositing lag can produce a stale or truncated capture).
  local tries=0
  while [ "$tries" -lt 4 ]; do
    adb exec-out uiautomator dump /dev/tty >"$DUMP" 2>/dev/null </dev/null
    if [ -s "$DUMP" ] && grep -q "<hierarchy" "$DUMP"; then
      return 0
    fi
    tries=$((tries + 1))
    sleep 1
  done
  return 1
}

crash_detected() {
  grep -qE "$CRASH_PATTERNS" "$DUMP" 2>/dev/null
}

is_complete() {
  node "$NODE_HELPER" "$DUMP" list text 2>/dev/null | grep -qx "Lesson complete"
}

find_cd() {
  node "$NODE_HELPER" "$DUMP" find content-desc "$1" 2>/dev/null
}

find_cd_prefix() {
  node "$NODE_HELPER" "$DUMP" find-prefix content-desc "$1" 2>/dev/null
}

debug_step_id() {
  # The debug overlay's own root badge has no testID; its step id/type
  # line is the FIRST text line inside resource-id "lesson-debug-overlay".
  node "$NODE_HELPER" "$DUMP" list content-desc 2>/dev/null >/dev/null # no-op to keep helper warm
  node -e '
    const fs = require("fs");
    const xml = fs.readFileSync(process.argv[1], "utf8");
    const idx = xml.indexOf("resource-id=\"lesson-debug-overlay\"");
    if (idx === -1) { process.exit(1); }
    const after = xml.slice(idx, idx + 4000);
    const m = /text="([a-zA-Z0-9_]+ \([a-zA-Z_]+\))"/.exec(after);
    if (!m) process.exit(1);
    process.stdout.write(m[1] + "\n");
  ' "$DUMP" 2>/dev/null
}

debug_answer_text() {
  node "$NODE_HELPER" "$DUMP" text resource-id "lesson-debug-expected-answer" 2>/dev/null
}

tap_coords() {
  # CC-12H found live: a same-spot double-tap mitigation here initially
  # seemed safe ("every control either submits, becoming disabled, or
  # toggles a selection idempotently") but is NOT safe for the single-tap
  # auto-submitting answer types (multiple_choice/formula_selection/
  # diagram_region/worked_error_classification/direction/rotation -- the
  # tap itself both selects AND submits, with no separate Submit step): a
  # second tap 0.35s later can land on whatever now occupies that same
  # screen position after the feedback panel replaces the options,
  # corrupting the outcome (observed live: a single precise tap on the
  # objectively correct option submitted correctly every time; the SAME
  # coordinates with a same-spot double-tap intermittently produced an
  # incorrect submission). A single tap, with retry-from-scratch one layer
  # up (see the submit-loop in walk_lesson) if nothing visibly changed, is
  # both simpler and correct.
  local coords="$1"
  [ -z "$coords" ] && return 1
  local cx="${coords%,*}"
  local cy="${coords#*,}"
  # CC-12H found live: repeated dead-centre taps at the SAME exact pixel
  # occasionally never register on this emulator, for reasons that
  # resisted diagnosis (not a scroll/keyboard-overlay/coordinate-space
  # issue -- confirmed via screenshots and raw bounds cross-checks); a
  # small deterministic-but-varying offset off dead-centre (still well
  # inside any real button, which is well over minTouchTarget) measurably
  # helped when reproducing the issue by hand. Cheap, harmless insurance.
  local jx=$(( (RANDOM % 21) - 10 ))
  local jy=$(( (RANDOM % 21) - 10 ))
  adb shell input tap $((cx + jx)) $((cy + jy)) >/dev/null 2>&1 </dev/null
}

scroll_down() {
  adb shell input swipe 540 1900 540 700 300 >/dev/null 2>&1 </dev/null
}

# Several remediation/guided steps carry more content (a worked example,
# a VIR-triangle visual aid) above the actual answer control than fits on
# one screen -- scrolls down and retries up to 5 times if the target
# isn't found on the first dump.
tap_cd() {
  local label="$1"
  local coords
  coords=$(find_cd "$label")
  local tries=0
  while [ -z "$coords" ] && [ "$tries" -lt 5 ]; do
    scroll_down
    sleep 1
    dump || return 1
    coords=$(find_cd "$label")
    tries=$((tries + 1))
  done
  if [ -z "$coords" ]; then return 1; fi
  tap_coords "$coords"
}

find_cd_prefix_scrolling() {
  local prefix="$1"
  local coords
  coords=$(find_cd_prefix "$prefix")
  local tries=0
  while [ -z "$coords" ] && [ "$tries" -lt 5 ]; do
    scroll_down
    sleep 1
    dump || return 1
    coords=$(find_cd_prefix "$prefix")
    tries=$((tries + 1))
  done
  echo "$coords"
}

# Picks a wrong (non-correct, non-chrome) content-desc to tap for a
# choice-based step, given the correct label to avoid. Restricted to
# clickable nodes only -- a non-interactive text node (e.g. a
# worked_error_classification step's "working shown" box) also carries an
# accessibility content-desc but is not a tappable answer option. Scrolls
# down and retries if no candidate is visible yet.
pick_wrong_cd() {
  local correct_label="$1"
  local pick=""
  local tries=0
  while [ -z "$pick" ] && [ "$tries" -lt 5 ]; do
    pick=$(node "$NODE_HELPER" "$DUMP" list-clickable content-desc 2>/dev/null | while IFS= read -r line; do
      [ -z "$line" ] && continue
      [ "$line" = "$correct_label" ] && continue
      if echo "$line" | grep -qE "$CHROME_LABEL_PATTERN"; then continue; fi
      echo "$line"
      break
    done)
    if [ -z "$pick" ]; then
      scroll_down
      sleep 1
      dump || return 1
      tries=$((tries + 1))
    fi
  done
  echo "$pick"
}

wait_for_screen() {
  # Waits (bounded) for the app to render SOMETHING recognisable after a
  # deep link / navigation -- lesson progress badge, debug overlay, or
  # completion screen.
  local tries=0
  while [ "$tries" -lt 20 ]; do
    dump || { sleep 1; tries=$((tries + 1)); continue; }
    if node "$NODE_HELPER" "$DUMP" find resource-id "lesson-progress" >/dev/null 2>&1; then return 0; fi
    if is_complete; then return 0; fi
    if crash_detected; then return 0; fi
    tries=$((tries + 1))
    sleep 1.5
  done
  return 1
}

# Submits the debug-overlay-correct answer for the current graded step,
# or (if $2 = "wrong") a deliberately incorrect one.
submit_answer() {
  local answer_text="$1"
  local mode="${2:-correct}"

  if [[ "$answer_text" == expected:* ]]; then
    # quantity: free-text numeric entry.
    local expected="${answer_text#expected: }"
    local value="$expected"
    if [ "$mode" = "wrong" ]; then
      # A value guaranteed outside any plausible numeric_tolerance band.
      value=$(node -e "const e=Number(process.argv[1]); process.stdout.write(String(Number.isFinite(e) ? e + Math.max(Math.abs(e)*3, 1000) : 999999))" "$expected")
    fi
    local coords
    coords=$(find_cd_prefix_scrolling "Your answer, in")
    if [ -z "$coords" ]; then log "    ERROR: numeric input field not found"; return 1; fi
    tap_coords "$coords"
    sleep 0.7
    # Clear any pre-existing text (a retried submission re-taps the same
    # field -- `adb shell input text` appends at the cursor, it does not
    # replace) before typing the fresh value.
    adb shell input keyevent KEYCODE_MOVE_END >/dev/null 2>&1 </dev/null
    adb shell input keyevent $(printf 'KEYCODE_DEL %.0s' {1..20}) >/dev/null 2>&1 </dev/null
    adb shell input text "$value" >/dev/null 2>&1 </dev/null
    sleep 0.7
    dump || return 1
    if [ "${QA_TRACE:-0}" = "1" ]; then
      log "    [trace] numeric submit coords=[$(find_cd "Submit answer")]"
    fi
    if ! tap_cd "Submit answer"; then log "    ERROR: Submit answer control not found (numeric)"; return 1; fi
    return 0
  fi

  if [[ "$answer_text" == tap:* ]]; then
    local labels_raw="${answer_text#tap: }"
    if [[ "$labels_raw" == *" || "* ]]; then
      # multi_select: tap each row's label in turn, then Submit.
      IFS='|' read -ra parts <<<"${labels_raw// || /|}"
      for label in "${parts[@]}"; do
        dump || return 1
        local target="$label"
        if [ "$mode" = "wrong" ]; then
          target=$(pick_wrong_cd "$label")
        fi
        if ! tap_cd "$target"; then log "    ERROR: choice control not found for label [$target]"; return 1; fi
        sleep 0.7
      done
      dump || return 1
      if ! tap_cd "Submit answer"; then log "    ERROR: Submit answer control not found (multi_select)"; return 1; fi
      return 0
    fi

    # Single-tap choice types (multiple_choice / formula_selection /
    # diagram_region / worked_error_classification / direction /
    # rotation): the tap itself submits, no separate Submit button.
    local target="$labels_raw"
    if [ "$mode" = "wrong" ]; then
      target=$(pick_wrong_cd "$labels_raw")
    fi
    if ! tap_cd "$target"; then log "    ERROR: choice control not found for label [$target]"; return 1; fi
    return 0
  fi

  log "    ERROR: unrecognised debug answer text: [$answer_text]"
  return 1
}

walk_lesson() {
  local lesson_id="$1"
  local wrong_step_1="${BRANCH_WRONG_STEP[$lesson_id]:-}"
  local wrong_step_2="${BRANCH_WRONG_STEP_2[$lesson_id]:-}"
  local branch_note="no"
  local triggered_1=0
  local triggered_2=0
  local steps_completed=0
  local max_steps=80

  adb shell am start -a android.intent.action.VIEW -d "alp-dev://learn/lesson-player?lessonId=${lesson_id}" "$PACKAGE" >/dev/null 2>&1 </dev/null

  if ! wait_for_screen; then
    log "${lesson_id} | FAIL | steps=0 | reason=screen never rendered after deep link"
    return 1
  fi

  local i=0
  while [ "$i" -lt "$max_steps" ]; do
    i=$((i + 1))
    dump || { log "${lesson_id} | FAIL | steps=${steps_completed} | reason=uiautomator dump failed"; return 1; }

    if crash_detected; then
      local matched
      matched=$(grep -oE "$CRASH_PATTERNS" "$DUMP" | head -1)
      log "${lesson_id} | FAIL | steps=${steps_completed} | reason=CRASH_DETECTED: ${matched}"
      return 1
    fi

    if is_complete; then
      log "${lesson_id} | PASS | steps=${steps_completed} | final=Lesson complete | branch=${branch_note}"
      return 0
    fi

    local step_id
    step_id=$(debug_step_id)
    local answer_text
    answer_text=$(debug_answer_text)
    if [ "${QA_TRACE:-0}" = "1" ]; then log "    [trace] step_id=[${step_id}] answer_text=[${answer_text}]"; fi

    if [ -n "$answer_text" ]; then
      local mode="correct"
      if [ -n "$wrong_step_1" ] && [ "$triggered_1" -eq 0 ] && [[ "$step_id" == "${wrong_step_1} "* ]]; then
        mode="wrong"; triggered_1=1; branch_note="yes (${wrong_step_1}"
      elif [ -n "$wrong_step_2" ] && [ "$triggered_2" -eq 0 ] && [[ "$step_id" == "${wrong_step_2} "* ]]; then
        mode="wrong"; triggered_2=1; branch_note="${branch_note} -> ${wrong_step_2}"
      fi
      # An individual `adb shell input tap` occasionally gets swallowed
      # (observed live during development -- an IME/focus transition
      # eating a touch). tap_coords already double-taps each spot as a
      # first mitigation; as a second layer, retry the WHOLE submit
      # (re-reading the still-current debug answer fresh) up to twice
      # more if Continue never appears afterwards, before failing the
      # lesson outright.
      local submit_ok=0
      local attempt=0
      while [ "$attempt" -lt 4 ]; do
        attempt=$((attempt + 1))
        dump || break
        # A PRIOR attempt in this same loop (or an earlier, interrupted
        # run of this script against the same still-open session) may
        # already have submitted successfully -- the answer input is then
        # replaced by a feedback panel + Continue, so re-driving
        # submit_answer would fail to find any answer control at all.
        # Check for that first. A single extra scroll-and-recheck (not the
        # full 5x tap_cd scroll budget, to keep the common "not yet
        # answered" case cheap) covers a content-heavy remediation step
        # whose Continue renders below the fold.
        local continue_coords
        continue_coords=$(find_cd "Continue")
        if [ -z "$continue_coords" ]; then
          scroll_down; sleep 1; dump || break
          continue_coords=$(find_cd "Continue")
        fi
        if [ -n "$continue_coords" ]; then
          tap_coords "$continue_coords"
          submit_ok=1
          break
        fi
        # A step with completionCondition "correct_answer_required" and no
        # matching branch HOLDS position on an incorrect answer and shows
        # "Try again" (not "Continue") -- e.g. a stray missed/duplicate tap
        # from tap_coords's own double-tap mitigation landing on the wrong
        # option. Tap it to restore the answer input, then loop round to
        # submit the (still correct, per the debug overlay) answer afresh.
        local retry_coords
        retry_coords=$(find_cd "Try again")
        if [ -n "$retry_coords" ]; then
          tap_coords "$retry_coords"
          sleep 1
          dump || break
          answer_text=$(debug_answer_text)
          continue
        fi
        if ! submit_answer "$answer_text" "$mode"; then
          sleep 0.8
          dump || break
          answer_text=$(debug_answer_text)
          continue
        fi
        sleep 2
        dump || { log "${lesson_id} | FAIL | steps=${steps_completed} | reason=uiautomator dump failed post-submit"; return 1; }
        if crash_detected; then
          local matched2
          matched2=$(grep -oE "$CRASH_PATTERNS" "$DUMP" | head -1)
          log "${lesson_id} | FAIL | steps=${steps_completed} | reason=CRASH_DETECTED post-submit: ${matched2}"
          return 1
        fi
        # Tap Continue to advance past the feedback panel (present for
        # both correct and incorrect submissions -- see
        # lesson-player.tsx handleContinue).
        if tap_cd "Continue"; then
          submit_ok=1
          break
        fi
        # Continue never appeared -- the submit likely never registered.
        # Re-read the current debug answer (still the same step) and
        # retry from scratch.
        dump || break
        answer_text=$(debug_answer_text)
        [ -z "$answer_text" ] && break
      done
      if [ "$submit_ok" -ne 1 ]; then
        log "${lesson_id} | FAIL | steps=${steps_completed} | reason=could not submit+advance at step [${step_id}] after ${attempt} attempt(s)"
        return 1
      fi
      steps_completed=$((steps_completed + 1))
      sleep 2
      continue
    fi

    # Non-graded step: just Continue.
    if tap_cd "Continue"; then
      steps_completed=$((steps_completed + 1))
      sleep 2
      continue
    fi

    log "${lesson_id} | FAIL | steps=${steps_completed} | reason=stuck at step [${step_id}] -- no graded control and no Continue"
    return 1
  done

  log "${lesson_id} | FAIL | steps=${steps_completed} | reason=exceeded ${max_steps} steps without reaching completion"
  return 1
}

main() {
  local ids=()
  if [ "$#" -gt 0 ]; then
    ids=("$@")
  else
    while IFS= read -r line; do
      [ -z "$line" ] && continue
      ids+=("$line")
    done <"$LESSON_IDS_FILE"
  fi

  for lesson_id in "${ids[@]}"; do
    log "--- walking ${lesson_id} ---"
    walk_lesson "$lesson_id"
  done

  echo "RUNTIME_WALK_COMPLETE"
}

main "$@"
