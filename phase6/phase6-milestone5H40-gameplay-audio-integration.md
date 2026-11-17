# Phase 6 5H.40 — gameplay audio staging integration

15 November 2026. New staging: `phase6/milestone5H40/staging/`; rollback: `phase6/milestone5H40/rollback/`. Production, 5H.38 and 5H.39 remain unchanged.

## Implementation

Copied the complete 5H.38 staging source into a new directory, with a separate unmodified pre-edit rollback. Reused its actual damage, unique-death, mission-launch, arena/boss and exit/pause hooks. No combat values, progression, rewards, controls or save formats changed.

Four staging files changed relative to 5H.38:

- `src/audio/eventSlots.js`: scoped test mappings. Damage → original chime; defeat → original step/thud; entrance → existing original-text calm prototype; boss → existing boss prototype; music channel → original wind loop. Chime/step are **test reactions, not Telugu dialogue**. Wind is **ambience, not a soundtrack**. Victory and the separate original Kalki theme remain empty/blocked.
- `src/audio/eventRuntime.js`: bounded diagnostic receipts and one deferred entrance receipt. The mission-launch handler schedules the receipt after synchronous cinematic setup; protected cinematic ownership delays it until release. Exit/restart invalidate pending work. No render-loop trigger or mission-state mutation.
- `src/audio/eventWebAudio.js`: bounded native source start/stop/end records and downstream analysers, for actual game playback evidence. Core gain/source behavior is retained. No recorded output or new audio file.
- `src/game/gameplayStore.js`: emit once after every accepted health-loss update, instead of filtering only `enemy:`/`boss` source labels. This covers valid environmental and `arc-*` damage too. Existing immunity, blocking, health and damage logic remain unchanged. The final natural retest observed three health-loss receipts and three corresponding event requests.

The controller itself is unchanged from 5H.38. Cooldowns/priorities/dedup, independent buses, master mute, protected speech, pause and exit remain centralized. Generic arena entrance yields to the boss's higher-priority line. Asset paths are configurable without editing gameplay hooks.

The server serves only two explicit existing prototype WAV routes and the three original cinematic WAV paths; other public audio routes are denied. Assets are read-only references, not copies. The evaluation rights label covers the existing isolated prototype/original test scope only. No movie dialogue/theme or production clearance is implied.

## Actual gameplay evidence

Headed Chrome 157.0.8103.51, 1920×1080 disposable browser contexts, normal keyboard movement/attacks/blocking. Read-only observers guided navigation. No health/damage setters, teleports, direct damage calls, seeded completion or forced victory.

`attempt-1794754769450/raw-results.json` records a 50.133-second natural combat segment: scout, warrior and heavy enemies defeated through six heavy-attack inputs; natural boss entrance reached at 28 HP. Three unique defeat receipts occurred, two eligible reactions played and one was suppressed by cooldown. Four source-qualified enemy-damage requests produced three reactions and one cooldown result. Boss-priority native playback and pause/resume passed. The run stopped on a test locator error for menu exit, not a game error.

`attempt-1794754968376/raw-results.json` is the focused lifecycle follow-up: actual pause/resume, confirmed EXIT TO MAIN MENU, and menu-to-Mission1 relaunch with a new session and one new entrance passed. It did not repeat combat or manufacture another mission unlock.

`attempt-1794755126543/raw-results.json` is the final damage-only retest after widening source coverage. Three naturally occurring health losses, all labelled environment in this run, each emitted exactly one request; two played and one was cooldown-suppressed. This is not evidence of three enemy hits. Enemy-hit, multiple-defeat and boss behavior were observed in the earlier natural run; they were not repeated after this narrowly scoped emitter change. The damage-only run correctly marks its unattempted defeat/boss checks UNVERIFIED.

Across these runs, G01–G12 have actual gameplay PASS evidence, with scope/version qualifications above. This is not one uninterrupted complete-mission acceptance run. No mission completion, ending, rewards, Mission2 unlock or transition between different missions is claimed.

## Preserved unsuccessful attempts

- `attempt-1794754672700`: test sampled entrance signal too early; native source had started but the analyser still read zero. Retained FAIL, corrected with a bounded signal wait. No controller fix inferred from that timing assertion.
- Natural combat attempt's final harness step timed out looking for `EXIT TO MENU`; actual UI is `EXIT TO MAIN MENU` with confirmation. Corrected only the driver and ran a lifecycle-only follow-up. The successful combat evidence remains valid and the harness failure remains visible.

Three focused mocked entrance-coordinator checks separately passed: protected deferral, exit cancellation and stale-session rejection. They are not counted as natural gameplay. Staging build and lint pass with existing nine lint warnings and existing chunk-size warning. Prior 5H.39 real mute/volume evidence is reused, not advertised as a new full-game UI test.

## Remaining limits

No real soundtrack, movie clips, commercial voice clearance, subjective listening approval, physical/mobile-device check, full boss defeat/ending or distinct-mission transition acceptance. The two voice samples are existing prototype material, not verified movie reactions. No claim of stable FPS or full-game performance acceptance. Production integration remains prohibited.
