# Phase6 Milestone5H.24 — One-event staging integration

15November2026. **PASS for the bounded one-event desktop staging integration, with stated UNVERIFIED areas.** No production integration, release package or commercial voice approval.

## Exact staging location and isolation

`C:/Users/Hp/Downloads/kalki 2898AD/phase6/milestone5H24/staging/`

Copied the existing151-file src tree, index.html and package.json into this staging root. It is not a new campaign or rewritten game. The original `public/` assets and installed node_modules are shared read-only by the staging dev server, avoiding a large duplicate asset download/copy. Vite root/envDir/cacheDir point into milestone5H24, configFile=false, bound only to127.0.0.1 on an ephemeral port. No production .env, personal profile or save copied. Existing production audio is not removed/replaced. Rights enforcement remains unchanged.

Launch command from project root, for later review in a disposable browser profile:

```powershell
node phase6/milestone5H24/server.mjs
```

Open the printed staging URL, launch Mission1 and move after gameplay is ready. Stop with Ctrl+C. Server is stopped at delivery. README is `milestone5H24/staging/README.md`.

## Exactly one event and one sample

**Event ID:** `mission-1:<roundId>:first-movement-guidance`.

**Trigger:** first nonzero publication from the existing player movement-input store, after a user pointer/key gesture, during active Mission1 while not game-over, boss dormant and at least one patrol health value>0. Paused/loading/cinematic states are ineligible. Subsequent movement publications that round are suppressed by event identity. Restart begins a new round; it may trigger once again. No events connected for Missions2 onward.

**Existing sample:** BH6-5E-002 calm-assistance variant, unchanged SHA256 `a6d44747102fae70c738e57d5cf56a27e2a90a95db208d31fbf1b2c9b4d9dfbe`.

Original: `phase6/local-tts-evaluation/milestone5H7/BH6-5E-002-calm-assistance.wav`.

English: “Clear the remaining patrols, then approach the arena.” Exact existing Telugu retained in staging clip.json. Only this sample is exposed by the custom staging endpoint `/__stage24/calm.wav`. No new synthesis, audio copying into production or model acquisition.

This is a new staging-only observational binding to existing movement state, not a production mission callback change. The controller receives **no mission-completion/reward callbacks**. It never waits/holds the game, writes stores or changes objective/reward/unlock logic. Skip closes the current speech presentation; it does not advance a mission objective. Optional voice cannot gate progression because no mission logic awaits it.

## Implementation and changes

Only existing file changed within the copied baseline: **staging/src/App.jsx**, importing/mounting StagingVoice only when Mission1 is playing. Original App.jsx unchanged.

New staging-only directory `src/stagingVoice/` contains:

- `controller.mjs`: copied original5H22 controller, unchanged from standalone.
- `StagingVoice.jsx`: read-only store adapter, per-round lifecycle and small controls panel.
- `gate.mjs`: pure one-event eligibility/identity functions.
- `clip.json`: single approved-for-prototype sample/text/hash mapping.
- `stagingVoice.css`: scoped staging panel styling.

Existing audio settings are read/subscribed through the **staging copy** of audioManager; panel mute/volume use that copy's existing master setters. Writes affect only disposable staging-origin settings during tests. Existing spoken dialogue loading/playing preempts prototype voice; cinematic/pause/inactive state cancels it. Rejected/missing/timeout playback retains text. No unverified production recording enabled or rights flag relaxed.

Gesture capture unlocks only the staging controller, and native play errors remain handled. Skip, replay and text fallback reused. Pause cancels rather than resumes stale speech; restart disposes old controller; exit unmounts/cleans listeners and sources. Replay checks current eligibility so guidance cannot be explicitly replayed after patrol/boss context becomes invalid. Other categories remain available only in the standalone prototype, not connected to this game copy.

## Actual validation

- **9/9 pure event-gate tests PASS**, including valid Mission1, no Mission2/10, inactive/pause/cinematic, game-over, boss-active, no/missing patrol and round identity.
- **17/17 controller tests PASS** against the copied controller: Skip/races, rapid triggers, once-only handling, replay, mute/volume, missing/rejected playback and timeout/disposal.
- **12 desktop browser checkpoints PASS** in Chrome157.0.8103.51,1920x1080, disposable context. Real Mission1 launches/renders and responds to movement; sample playback begins from the selected event. Movement position changed from spawn to approximately z5.594 while narration worked. Skip, replay, keyboard action input and running game clock,40 movement publications/one event, mute/unmute, volume0.3, pause/resume, actual404 fallback, restart/new round and exit passed.
- Existing campaign rewards contract tested by **controlled calls on disposable staging state**: boss2500/relic750 retained; repeated boss reward idempotent. Voice controls/errors did not change campaign bytes before those explicit test calls; exit retained the test-created saved progress.
- Scoped adapter Oxlint and gate/controller syntax/execution PASS. One new ref-during-render warning was corrected in staging using useLayoutEffect; final scoped lint exit0/no output. No production build/lint run; no distribution build produced.

[Detailed classifications](phase6-milestone5H24-test-results.md), [gameplay screenshot](milestone5H24/mission1-voice.png), [raw browser results](milestone5H24/browser-results.json).

## Failed/incomplete attempts — preserved

1.First browser process ended before results, last Vite/THREE warning only: UNVERIFIED, cause unknown (`browser-attempt1.json`).
2.Initial movement test timed out120s waiting for playing.3.Diagnostic variant timed out60s; snapshot showed unlocked controller, no voice event and zero movement input (`browser-attempt2-timeout.json`, `browser-attempt3-no-event.json`, screenshot). Both were genuine failed test attempts, not counted as passes.
4.A readiness-patch assertion failed, and the accidentally launched unchanged harness was interrupted; no pass claimed (`browser-attempt4-interrupted.json`).
5.Final harness explicitly waited for the actual PlayerInput keyboard listener through read-only DevTools inspection before sending movement; all12 checkpoints passed. This corrects a missing test-readiness precondition. Early absence of an event is confirmed; precise scheduling details of the lost initial input were not traced, so no rendering/driver root cause is claimed. No gameplay/render-quality change was made to force the result.

## Preservation, limits and stop

**405/405 production/source/public/config/standalone-prototype/sample/draft/scorecard snapshot files unchanged**.151/151 source files match baseline rollback;26/26 standalone prototype files match its rollback copy. Only copied App.jsx differs from existing src; all mission/combat/reward/store implementations match original. This focused check is not a fresh independent47/14/11 historical-manifest audit. No personal save accessed; test-created staging localStorage is disposable and not existing player progress.

Original environment remains default; deferred Kashi and Phase5 conditional acceptance unchanged. Existing5H22 standalone and5H23 rollback preserved. No production rights, samples, dialogue drafts or listening scores altered.

**UNVERIFIED:** full natural Mission1 completion/ending/reward playthrough, actual enemy hit/boss defeat balancing, natural cinematic audio priority, physical mobile/audio output, pronunciation/emotional quality, performance/frame-rate stability and commercial output rights. The reward test is a store contract check, not a fabricated natural mission pass. Browser screenshot proves staging playback UI within actual gameplay, not AAA visual acceptance.

Browser/server closed in finally; read-only process check found0 node commands matching this staging test/server. Unit/gate workers exited. [Rollback/cleanup report](phase6-milestone5H24-rollback-report.md). **Stopped after one-event staging validation. No expansion or copy-back authorized.**
