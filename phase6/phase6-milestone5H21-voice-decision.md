# Phase 6 Milestone 5H.21 — Revised voice decision

Recorded 15 November 2026. Authority: the user's explicit revised decision in this chat. **CONDITIONAL temporary prototype acceptance of the existing Indic Tiny Telugu male `te_M` voice for all five categories.** This is a user-directed prototype choice, not an independent listening verdict.

## Category decisions

- Combat dialogue — **CONDITIONAL**, temporary prototype use.
- Boss warnings — **CONDITIONAL**, temporary prototype use.
- Victory dialogue — **CONDITIONAL**, temporary prototype use.
- Emotional delivery — **CONDITIONAL**, temporary prototype use.
- Calm Bhairava assistance — **CONDITIONAL**, temporary prototype use.

The revised user acceptance supersedes the missing-listening-review blocker solely for this temporary prototype selection. It does not supply ratings, certify pronunciation or emotional performance, resolve licensing, or authorize production integration. No subjective scores inferred from the user's decision.

## Required playback behavior for future authorized implementation

1. Display a clearly visible, accessible **Skip** button while dialogue plays, usable with keyboard and touch.
2. Skip must stop the current playback and advance or close the current dialogue cleanly according to its existing dialogue flow. It must not leave stale subtitles, active audio or a stuck dialogue state.
3. Skipping must preserve mission progression, gameplay events and dialogue triggers. Narrative/gameplay callbacks must follow their existing contract exactly once; skipping must neither lose required events nor duplicate rewards, completion or transitions.
4. Retain replay where appropriate. Players must not be forced to listen again to repeated dialogue; replay remains player-controlled and skippable.
5. Validate skip during playback, repeated skip input, replay, dialogue changes and relevant mission transitions using disposable data. Check keyboard/touch access, absence of overlapping audio and clean recovery.

These are recorded acceptance requirements only. **Skip is NOT implemented or tested by this milestone.** Existing behavior has not been changed. A later separately authorized implementation must inspect existing dialogue/event contracts before wiring Skip; do not simply force mission advancement.

## Evidence and retained limitations

The original5H.8 scorecard remains unchanged:10 rows, all `listened=NO`, all50 numeric rating fields blank and final judgments `PENDING REVIEW` at this check. Its SHA256 remains `0eba431c7f41d3b8ac8614f7d439fa0d2d3ea0c8019d5cd6e5fc2f5d578e91c1`. It has not been marked complete.

No independent verification of pronunciation, naturalness, emotional delivery or Bhairava suitability is claimed. Original Telugu drafts remain unverified and unchanged. Prior technical WAV checks establish file integrity only. The5H.13 rights and asset-packaging blockers remain open; no commercial rights clearance or production voice approval is granted. No rights enforcement is weakened.

## Scope and stop

Documentation update only. No new audio generation, audio edits, playback integration, production code/UI changes, save access or progression changes. No downloads, installation or tests launched. Existing samples and reports retained. Stop after recording this decision; await separate authorization for any implementation.
