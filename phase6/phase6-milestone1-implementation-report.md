# Phase 6 Milestone 1 — Text-first Bhairava assistant

14 November 2026 (Asia/Calcutta).

**Recommendation: PASS for this bounded text-first milestone, pending user review. Phase 6 is not complete.** Telugu fluency, physical-device testing and general performance stability remain explicitly UNVERIFIED. Phase 5 remains CONDITIONAL ACCEPT; Kashi remains opt-in. No campaign, voice or later-phase expansion was performed.

## Implemented

A compact **Bhairava · Help** button appears only during ordinary Mission 1 gameplay. Seven prompts cover initial guidance, current objective, remaining patrols/optional scans, combat advice, boss/relic, completion/rewards and replay. Opening/closing does not pause, alter gameplay or write saves. Escape closes the panel; focus returns to its button. Existing Escape pause behavior continues when the panel is closed. No shortcut was assigned over an existing control.

The read-only adapter samples existing campaign/gameplay/combat/boss/story stores on each question. Answers separate a **state facts** list from authored Telugu/English guidance. It reports actual recorded reward keys/values, previous completion versus current attempt, and does not infer rewards from a victory animation. Questions refresh snapshots; displayed answers do not continuously update. Gameplay continues while reading, as the interface states.

The pure Mission 10 recap function is exercised only as a fixture: it reports recorded completed routes and admits missing history. It is not new campaign content or a production recap rollout. An explicit default-route allowlist excludes planned chapters and paused Missions 21–24 even if the candidate query is enabled or those IDs appear in fixture history.

Text always works without audio. No audio manager, rights checks, recording, network model, TTS, microphone or dependency changed. Telugu text is an original **draft requiring fluent-speaker review**, clearly labelled in the interface. This is not approved final localization or a claimed licensed performance.

## Production changes and rollback

Only existing production file modified: `src/App.jsx` (import and Mission 1 rendering condition). Four new files:

- `src/game/assistant/context.js` — read-only store adapter.
- `src/game/assistant/responses.js` — pure facts/wording and test recap function.
- `src/game/assistant/BhairavaAssistant.jsx` — accessible prompt/answer interface.
- `src/game/assistant/assistant.css` — narrowly scoped responsive styles and reduced-motion-aware answer fade.

No existing audio, combat, mission, input, pause, movement, environment or persistence modules changed. Unlimited sprint and existing loading/bounds preparation remain intact. Test-only diagnostic exports exist solely in a separate generated test build.

Backup: `milestone1/rollback/src/App.jsx`; exact App diff and hashes: `milestone1/source-changes.patch`, `initial-integrity.json`, `final-integrity.json`. To roll back, stop the game, check for subsequent edits, restore only that App backup and rebuild. The four new assistant files can remain unused for preservation; do not restore a whole old tree, delete campaign files or touch saves. Generated `dist/` is rebuilt output, not a protected source replacement.

## Acceptance results

- **PASS — Mission1 initial/active/boss/relic/completion/replay facts:** 13 unit cases; live adapter four boss fixtures; natural ending/replay regressions. Initial/completion edge cases are fixture tests, not all natural UI runs.
- **PASS — No fabricated objective, completion, reward or unlock:** Responses derive facts from snapshots; unit assertions and actual saved 2500/750 values in browser tests. Authored advice is separated from the facts list.
- **PASS — Planned/paused candidates not represented as playable/completed:** Strict implementation allowlist excludes 11 and 21–24 even in injected recorded history. No campaign functions called.
- **PASS — Mission10 recap accuracy:** Fixture only: recorded 1/10 and unapproved21 yields only 1/10, eight missing chapters; no recorded10 gives no recap. No production Mission10 interface added.
- **PASS — Read-only campaign data:** Frozen-by-comparison fixture input and byte-identical disposable campaign storage after prompt use and transition/replay checks.
- **PASS — Voice-disabled/muted/missing-asset factual fallback:** Pure text engine requires no audio APIs/assets; muted/zero-volume browser contexts give answers with zero audio requests. No new voice path exists; successful voice playback is outside scope.
- **PASS — Keyboard and touch controls:** Three viewport UI runs; actual touch activation; held touch sprint, keyboard attacks/jump/dodge, relay interaction, blur cleanup and pause regression.
- **PASS — Desktop/portrait/landscape layout:** 1920x1080,430x932,932x430 screenshots inspected; panel contained, player and action controls visible after layout fixes. Internal vertical/horizontal scrolling is intentional.
- **PASS — Production build and lint:** Final build/lint exit0; same nine pre-existing lint warnings, no new warnings. Existing bundle-size warnings remain.
- **PASS — Mission1 ending and replay:** Controlled relic-state transition plays full ending to victory and restart; repeated full real-input run also passes natural ending (10492ms) and reward/reload checks. First full run failed by player defeat; preserved.
- **PASS — Representative boss regression:** Actual Mission20 fight: three phases, chain-hook/debt-circles, relic/rewards/reload. Functional pass is not performance acceptance.
- **PASS — Protected/campaign/personal baseline integrity:** 47 protected hashes,14 independent preserved campaign copies,11 baselined personal DB files match; personal profile never launched.
- **PASS — Original Telugu draft present:** Initial seven response topics include authored Telugu draft and English text; UI explicitly flags pending review.
- **UNVERIFIED — Fluent Telugu approval:** No fluent-speaker editorial approval obtained; do not call draft localization final.
- **UNVERIFIED — Physical phone usability/performance:** Chrome touch emulation only; no physical device available.
- **UNVERIFIED — Stable30FPS / causes of inherited hitches:** Not an acceptance gate added to this text milestone. Functional boss sample recorded seven >100ms gaps, max519.9ms; no clean matched performance certification or attribution.

The machine-readable matrix is `milestone1/acceptance-results.json`. No assertion that a test passed rests on build success alone.

## Failed attempts and corrections

The first UI harness attempt bound its preview host differently from its IPv4 URL and failed connection; this was a test-server correction. The first real UI movement check exposed an assistant keyboard handler swallowing movement keys when a button had focus. Only that new handler was narrowed to Enter/Space activation and Escape dismissal; the final movement/pause checks pass. Earlier screenshot review caught portrait health overlap and landscape player obstruction. The launcher/panel were repositioned; portrait/landscape prompts use horizontal scrolling and answers/facts use bounded vertical scrolling. Their content is scrollable rather than lost below the viewport. Final screenshots were manually inspected for player/health/control visibility at the tested spawn camera; arbitrary gameplay camera positions were not exhaustively visually certified.

The first ordinary-input Mission 1 full run failed because the player died during the Warden fight (boss still alive); there were no reported browser/asset errors. It remains in `milestone1/natural/`. An unchanged-driver repeat in `natural-repeat/` passed patrols, Warden, relic, natural ending without skip (10.492s), victory and reload. Saved replay rewards remained unchanged. A separate controlled pre-relic fixture verified the live adapter across four boss states and the normal relic-state effect → full ending → victory → restart path. Fixture state injection is limited to disposable tests and is not represented as a natural combat victory.

## Performance limitations retained

The assistant has no frame loop, polling, asset downloads or audio decode; it samples state when asked. This does not establish zero performance cost or stable 30 FPS. No broad performance investigation or speculative optimization was undertaken.

The actual Mission 20 functional test lasted 27.375 seconds in a scoped diagnostic build: average render cadence 28.06 FPS, median34.6/p9536.1/p9970.9/max519.9 ms, **seven gaps >100 ms** (204.9,230.2,215.1,519.9,122.0,278.8,314.4). Full timestamped rows are in `observed-frame-summary.json` and the raw boss record. The renderer duration on the 519.9-ms row was2.4 ms; that alone does not identify what consumed the preceding interval. The assistant is not rendered on Mission20, but this is not proof of a specific browser/OS/GPU cause. Root cause and visible presentation/input latency were not established. No clean matched before/after performance comparison is claimed.

Previously documented portrait stutters, transition gaps and historical interruptions remain limitations of the conditionally accepted baseline. The current functional pass does not reopen Phase5 or declare those issues fixed. Physical mobile remains untested. No production-ready voice coverage or fluent Telugu quality is claimed.

## Evidence and screenshots

All are genuine in-game browser captures in disposable contexts, not mockups:

- [Desktop assistant](milestone1/desktop-assistant.png)
- [Portrait assistant](milestone1/portrait-assistant.png)
- [Landscape assistant](milestone1/landscape-assistant.png)
- [Controlled ending fixture victory](milestone1/ending-fixture.png)
- [Natural ending actor — successful full run](milestone1/natural-repeat/natural-ending-actor.png)

Focused evidence: `unit-results.json` (13 PASS cases), `browser-results.json` (three viewport PASS runs, zero page errors/audio requests), `transition-results.json`, `tests/input-browser-results.json`, `natural-repeat/mission-natural-diagnostic-results.json`, `boss20/boss-browser-strict-results.json`; final build/lint logs and exit files. Prior layout captures and failed-run logs are preserved. These paths are under `phase6/milestone1/`.

## Integrity and stop status

Fresh final comparison: **47/47 protected hashes**, **14/14 preserved campaign copies**, **11/11 personal-save baseline file hashes** match. All baseline public assets are byte-identical; only App changed among the existing source/public baseline. Personal profile was never launched; checksum reads do not prove historical integrity before the baseline, and the previously unbaselined LOCK file is outside that claim. All destructive/state-fixture tests used disposable Chrome contexts.

Final production build and lint pass; lint retains the same nine existing warnings (MenuScene/CorrectedCity immutability, paused campaign immutability/import warnings), no new warnings/errors. Existing build chunk-size warnings remain distinct from lint.

Cleanup queries succeeded: no owned milestone Node drivers or listeners remained on test ports5558,5560,5564,5590,5592. No unrelated processes stopped. Reports, screenshots, test sources, raw data and rollback copies are preserved. **Stopped here for approval. No voice integration, broader assistant coverage or subsequent phase has begun.**
