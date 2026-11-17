# Phase 5.4F Preparation Report

## Scope and constraints

This document is a preparation-only review for Phase 5.4F while Phase 5.4E remains in progress and the active worktree is intentionally not being modified or tested. The intention is to record the architecture, regression risks, coverage gaps and acceptance conditions before final 5.4F validation runs begin after the 5.4E implementation is frozen.

This review does not claim 5.4F is complete, does not change content, progression or saves, and does not integrate the experimental Kashi prototype work.

## Architecture audit

### 1) Mission archive and progression model

The campaign is defined in `src/game/storyCampaign.js` as a 100-entry archive, split into ten arcs of ten missions each. Each entry is a frozen object generated from a fixed title-pattern string and is assigned:

- a stable mission ID (`mission-1` ... `mission-100`)
- a numeric chapter number and arc
- a fixed region/arc label
- a playable flag
- a description and implementation note
- references and provenance metadata

Important logic:

- `STORY_MISSIONS` is created from `CHAPTERS.flatMap(...)` and frozen with `Object.freeze`.
- Mission entries are not “unlocked” by arbitrary runtime logic; they are gated by `CAMPAIGN_MISSIONS`, set in `src/game/campaignSystem.js`.
- `playable` is intentionally narrow: `number <= 10` or `number % 10 === 0`.
- That means the current build is intended to expose 19 playable combat chapters: `1-10` plus `20, 30, 40, 50, 60, 70, 80, 90, 100`.
- The other 81 entries are story-plan entries, not built gameplay chapters.

`src/game/campaignSystem.js` owns progression and save state:

- save key: `kalki-campaign-progress`
- current unlocks are seeded from `INITIAL_UNLOCKED_MISSIONS = ['mission-1']`
- unlocking logic adds earlier completed missions and the next sequential mission
- validation only accepts IDs that exist in `CAMPAIGN_MISSIONS`
- `selectedMissionId` is restored only if it still appears in the unlocked set

This is a strong progression model, but it is not a versioned migration system and it depends on a single opaque localStorage payload.

### 2) Arc-final boss model

Arc-final boss definitions are kept in `src/game/phase54e/arcBosses.js` and `src/game/missionExpansionContent.js`.

The intended boss set is:

- 10: Exit Warden
- 20: Chain Collector
- 30: Solar Architect
- 40: Mirror Duelist
- 50: Monsoon Drummer
- 60: Dune Courier
- 70: Bronze Adjudicator
- 80: Bastion Ram
- 90: Siege Astrolabe
- 100: Horizon Keeper

The boss runtime is modular and deterministic:

- `arcBossFor(missionId)` resolves a boss profile
- `createArcRuntime`, `beginArcAttack`, `stepArcRuntime`, `arcHazards` drive movement, attack timing, hazard geometry and phase transitions
- boss phases are tied to health thresholds and encounter state
- battle initiation logic sits in `bossSystem.js`, which also tracks health, phase, reward, relic and victory state

This architecture is useful for consistent boss logic, but it is only as safe as the mission trigger data and the save/replay state around it.

### 3) Combat and player state

Core runtime data is split between `src/game/gameplayStore.js`, `src/game/combatSystem.js`, `src/game/bossSystem.js`, and input stores.

`gameplayStore.js` manages:

- health, score and objective IDs
- crystal/pylon collection and overdrive charges
- round reset behavior for restarts
- player world position and damage events

Key risk: restart behavior is stateful and uses `roundId`, so a broken round-reset or stale state can produce duplicated rewards, unresponsive resets or inconsistent enemy positioning.

`bossSystem.js` also handles reward grants and save updates:

- `completeMission(missionId, 'boss', score)`
- `recordMissionReward(missionId, 'relic', reward)`
- mission completion is persisted immediately in save state

This means any bug in call order, mission ID mismatch, or battle state reset can create either duplicate rewards or locked progression.

### 4) UI and control stack

The user-facing flow is built as a set of modules:

- `MissionSelect.jsx` for archive viewing and unlocked mission status
- `SettingsPanel.jsx` for graphics/audio/HUD/touch preference changes
- `controlSettings.js` for touch control mode persistence
- `player/MobileControls.jsx` for virtual joystick and buttons
- `LoadingScreen.jsx` for scene readiness messaging
- `FrameMetrics.jsx` for optional per-frame metric logging

There are separate state stores for controls, HUD and visual quality, saved in localStorage. This is a strong UI architecture for a browser game, but it introduces save-locality and browser-storage defects and a higher chance of UI drift between desktop and mobile layouts.

### 5) Environment and scene composition

The environment layer intentionally separates the base world from the optional 5.4E prototype:

- `WorldArchitecture.jsx` selects or swaps a city environment depending on mission and environment flags
- `phase54e/cityAssets.js` gates the city preview and arena state
- `CorrectedCity.jsx` is used when the environment is enabled and the boss route is active

This is a good isolation pattern, but it means any environment toggle, camera or scene reset issue can create inconsistent combat, menu, or mission entry behavior without affecting the archive logic itself.

## Critical regression risks

| Risk | Area | Why it matters | Primary checks |
| --- | --- | --- | --- |
| Save payload drift | Campaign progression and settings | `localStorage` is the only persistence path; malformed or stale JSON can silently reset or unlock invalid states | Save validation, reload, replay, corrupted-localStorage tests |
| Unlock logic mismatch | Mission progression | Completed chapters unlock the next chapter; if any mission ID not in the list or save schema changes, the campaign can become impossible or over-open | Mission archive validation, unlock boundary checks |
| Mission definition mismatch | Story archive vs playability | 81 story-plan entries are intentionally non-playable, but any accidental unlock or UI leak would misrepresent the build | Archive card status, locked states, mission start gating |
| Arc boss encounter gating | Boss logic | Boss start requires objective and enemy states; if any objective list or spawn differs, boss never starts or starts early | Mission trigger conditions, boss intro, defeat/relic path |
| Reward duplication | Boss and relic completion | `completeMission` and `recordMissionReward` both write to saved progression | Replay, save reload, reward totals, duplicate reward prevention |
| State reset bugs | Restart / replay / pause | `roundId` and health resets are stateful; stale values can re-trigger boss or enemy logic | Restart mid-fight, reload mid-run, replay mission |
| Input or pointer capture bugs | Desktop/mobile controls |Virtual joystick and action buttons are pointer-driven; capture loss or touch-mode toggles can leave stuck movement or blocked input | Portrait/landscape, pointer cancel, mobile start/stop |
| UI overlap and hidden content | HUD/settings screens | There are multiple HUD modes, touch controls and fullscreen logic; CSS overlap and hidden element issues can block play | 1280×720, 1920×1080, mobile portrait/landscape |
| Performance stalls | Render loop, scene swap, city env, boss fights | The repo already includes performance evidence for menu/exploration/combat and long gaps; lag spikes can be hidden by toggles or browser conditions | Frame timing, memory, long-task detection |
| Asset/environment toggle safety | Opt-in prototype vs default production | The 5.4E city is intentionally opt-in; a bad default or stale environment flag can regress menu or gameplay visuals | Default scene, environment flag gating, re-entry after reload |
| Protected-file integrity issues | Save and asset integrity | Critical content should not be silently overwritten or mutated; save compatibility must be preserved across update paths | hashing/snapshot checks before/after save, file-integrity checks |

## Mission coverage plan

### All 100 mission entries

The mission archive is intentionally honest: the current build does not include 81 fully authored levels. The test plan still covers all mission catalog entries to ensure the archive is displayed, gated, and labeled correctly.

| Arc | Mission range | Permissions / status | Coverage focus |
| --- | --- | --- | --- |
| Arc 1 | 01 A BOUNTY IN THE DUST; 02 THE GLASS WASTES; 03 ONE MORE JOB; 04 THE DRIVER’S DEBT; 05 A CITY OF TIERS; 06 THE BOUNTY BOARD; 07 THE MASKED PURSUIT; 08 THE ARENA CIRCUIT; 09 A DEBT COLLECTED; 10 THE ROAD OUT | 01-10 playable | Mission selection, progression unlocking, core combat, boss/start/replay, reward persistence |
| Arc 2 | 11 THE DIAGNOSTIC; 12 THREE WAYS THROUGH; 13 A BORROWED CHARGE; 14 SIGNAL IN THE RUBBLE; 15 HANDS OFF THE CONSOLE; 16 THE QUIET DETOUR; 17 A MORE ACCURATE MAP; 18 PARTS WITH A PAST; 19 ONE DRIVER, TWO OPINIONS; 20 THE SPARE ROUTE | 20 playable arc-final duel only | UI lock-state behavior, archive card status, no accidental unlock from story-plan chapters |
| Arc 3 | 21 BELOW THE SHADOW; 22 THE WATER QUEUE; 23 A FREIGHT WINDOW; 24 THE WRONG PERMIT; 25 SCRAP FOR PASSAGE; 26 EYES ON THE GANTRY; 27 THE TOLL KEEPER; 28 NO INVITATION; 29 WHISPERS OF A TRANSFER; 30 A LARGER NUMBER | 30 playable arc-final duel only | Story-plan non-playability, arc-final boss trigger and reward behavior |
| Arc 4 | 31 A BROKEN NOTICE; 32 EMPTY QUARTERS; 33 TWO WITNESSES; 34 THE SERVICE DOOR; 35 A PAID RUMOR; 36 BOOTPRINTS AND WHEELS; 37 RIVAL ON THE WIRE; 38 SIGNAL HANDOFF; 39 THE EXIT ACCOUNT; 40 TOWARD THE DUST | 40 playable arc-final duel only | Mission archive semantics, battle rewards, unlock step validation |
| Arc 5 | 41 TRACKS IN OPEN GROUND; 42 LOW ON THE HORIZON; 43 THE CROSSING LINE; 44 CLOSE ENOUGH TO SEE; 45 THE INTERCEPTOR; 46 BUJJI’S ESTIMATE; 47 THE ROUGH DESCENT; 48 AN UNREADY MODE; 49 BACK ON THE TRAIL; 50 SOMEONE IN THE ROAD | 50 playable arc-final duel only | Escape/pursuit staging, trigger integrity, no bypass of story-plan gaps |
| Arc 6 | 51 MEASURE THE STRANGER; 52 A CONFIDENT APPROACH; 53 BEYOND REACH; 54 ACROSS THE DECK; 55 A SHORT OPENING; 56 THE PASSENGER’S DISTANCE; 57 BUJJI, ANOTHER ROUTE; 58 THE WEIGHT OF A BLOW; 59 THE EMPTY ROAD; 60 NOT THIS TIME | 60 playable arc-final duel only | Defeat/aftermath sequencing, saved mission completion, no forced story progression |
| Arc 7 | 61 A NOTICE AT THE GATE; 62 COUNT WHAT REMAINS; 63 A PLACE TO STOP; 64 THE LOST CLAIM; 65 ONE HONEST REPAIR; 66 SOMEONE STILL ASKING; 67 BEFORE THE COMMANDER; 68 THE OFFER REOPENED; 69 PREPARE, NOT CELEBRATE; 70 A ROAD KEPT HIDDEN | 70 playable arc-final duel only | Recovery and negotiation-stage data accuracy, restart flow after arc transitions |
| Arc 8 | 71 TRUST THE BEARING; 72 NO VISIBLE GATE; 73 THE LAST TURN; 74 A DIFFERENT SKY; 75 THE FORMALITIES; 76 STAY WITH THE VEHICLE; 77 WATER AND STONE; 78 THE ESCORT’S PACE; 79 AN UNFINISHED INTENTION; 80 THE TREE AHEAD | 80 playable arc-final duel only | Concealed-route entry, environment gating, mission selection and bosses with environment variant checks |
| Arc 9 | 81 ALARM ACROSS THE STONE; 82 A ROUTE THROUGH SMOKE; 83 THE CONTRACT REMAINS; 84 ONE BLOCKING UNIT; 85 BUJJI AT THE TURN; 86 A PASSAGE FOR OTHERS; 87 THE HEAVY STEP; 88 WHERE THE LINES CROSS; 89 BEHIND THE BARRIER; 90 THE WEAPON’S MOMENT | 90 playable arc-final duel only | Siege-stage behavior, optional branching choice safety, boss arena entry |
| Arc 10 | 91 A FAMILIAR WEIGHT; 92 A BREAK IN THE ASSAULT; 93 THE GUARDIAN LOOKS AGAIN; 94 SUN ON THE BATTLEFIELD; 95 THE ARCHER’S SILHOUETTE; 96 THE NAME KARNA; 97 BACK TO THE PURSUIT; 98 KEEP MOVING, BUJJI; 99 A THREAT STILL ABOVE; 100 AT THE UNFINISHED HORIZON | 100 playable arc-final duel only | Final reveal, closing arc gating, duel completion, relic collection, no sequel overreach |

### Available playable missions and required validation set

Playable missions are explicitly the ones with a real combat prototype or an implemented arc-final duel. The 5.4F test set must cover all of the following:

- 01 A BOUNTY IN THE DUST
- 02 THE GLASS WASTES
- 03 ONE MORE JOB
- 04 THE DRIVER’S DEBT
- 05 A CITY OF TIERS
- 06 THE BOUNTY BOARD
- 07 THE MASKED PURSUIT
- 08 THE ARENA CIRCUIT
- 09 A DEBT COLLECTED
- 10 THE ROAD OUT
- 20 THE SPARE ROUTE
- 30 A LARGER NUMBER
- 40 TOWARD THE DUST
- 50 SOMEONE IN THE ROAD
- 60 NOT THIS TIME
- 70 A ROAD KEPT HIDDEN
- 80 THE TREE AHEAD
- 90 THE WEAPON’S MOMENT
- 100 AT THE UNFINISHED HORIZON

For each mission, validate at least:

- the mission is listed with correct title and status
- it unlocks when the unlock rule requires it
- the mission starts only when allowed
- the scene loads without a crash or blank screen
- the player can reach the objective or boss arena
- combat or duel logic behaves as designed
- reward is granted once and persisted after reload
- replay works without duplicate progression or inconsistent unlocks

## Combat and boss test plan

### 1) Ordinary enemy combat

Focus areas:

- mission-specific enemy scaling and damage curves
- objective completion and health restoration logic in `gameplayStore.js`
- health, score and overdrive resets after restart/reload
- boss encounter start conditions and phase transitions

Required cases:

- kill and objective completion counters increment once per entity/id
- overdrive charges accumulate and are capped at `MAX_OVERDRIVE_CHARGES = 3`
- environmental damage is reduced while blocking, but blocked damage remains within expected ranges
- enemy and boss damage does not trigger after a mission reset or reload
- combat does not auto-continue after a completed mission if the state is re-entered

### 2) Arc-final boss encounters

The test set must include all ten encounters, with unique pass criteria for each profile.

| Mission | Boss | Test focus |
| --- | --- | --- |
| 10 | Exit Warden | gate-ram, shield-fan, pursuit movement, kneeling defeat pose |
| 20 | Chain Collector | chain-hook, debt-circles, retreat, unravel defeat |
| 30 | Solar Architect | solar-spokes, sunfall, orbiting movement, eclipse defeat |
| 40 | Mirror Duelist | mirror-cross, echo-lunge, sidestep, shatter defeat |
| 50 | Monsoon Drummer | drum-rings, thunder-grid, anchor movement, collapse defeat |
| 60 | Dune Courier | returning-ring, sand-cut, strafe, skid defeat |
| 70 | Bronze Adjudicator | judgment-marks, verdict-beams, retreat movement, bow defeat |
| 80 | Bastion Ram | bastion-charge, fault-lines, pursuit, buckle defeat |
| 90 | Siege Astrolabe | siege-grid, orbital-mortar, anchor movement, disarm defeat |
| 100 | Horizon Keeper | lotus-blades, horizon-reversal, orbit movement, lotus defeat |

Boss validation includes:

- start entrance and intro state
- boss health transitions, threshold phases, attack warning geometry
- damage application while player is in valid attack range only
- hazard collision is consistent with the runtime geometry (`hazardContains`, `hazardVisualPose`)
- defeat sequence triggers relic and completion reward exactly once
- replay and reload preserve prior state without duplicate mission completion or relic count

## Save compatibility and protected-file integrity review

### Requirements

The project stores critical campaign and control state in browser-local persisted storage. The acceptance plan must enforce:

- versioned key names and schema validation
- strong type checks before trusting `completedMissionIds`, `unlockedMissionIds`, `rewards`, `selectedMissionId`
- stale or malformed localStorage values must fall back to a safe default, not partially corrupt the campaign
- no invalid mission ID may enter the unlocked-progress set
- no repeated rewards may be issued in replay or reload scenarios
- protected files and assets must not be silently rewritten during 5.4E testing or 5.4F validation
- environment toggle values must not break the default production build and must remain opt-in unless explicitly approved

### Save compatibility checkpoints

- Load a valid saved campaign from an earlier known-good state and verify no unlocks disappear or duplicate
- Inject malformed JSON and verify the app falls back cleanly without crash
- Corrupt a single field in the payload and verify invalid values are rejected while valid mission history remains usable
- Reload after mission completion and verify reward keys and unlocked-next-mission state are not duplicated
- Ensure that `mission-20`, `mission-30`, ... `mission-100` can appear as valid saved boss encounters without false unlocks for unimplemented intermediate missions

### Protected-file integrity

This project includes a large protected asset set and multiple separated environment variants. 5.4F must ensure:

- no production asset is directly edited by the final acceptance flow
- no “experimental Kashi” changes are merged into the working scene by testing or QA automation
- any archive or save snapshot used in a verification run must be recorded and compared to pre-run hashes or manifests
- the default production environment remains the default unless a deliberate environment toggle is active and explicit

## Desktop and mobile testing coverage

### Desktop coverage

Minimum target operating matrix:

- Chrome (latest stable) on Windows desktop
- Chrome (latest stable) on macOS or Linux desktop if available
- 1920×1080 full-screen and windowed operations
- 1440×900 and 1280×720 fallback resolutions
- keyboard + mouse/trackpad controls
- pause/resume, mission select and settings interactions

Required desktop checks:

- inventory/reward screen and mission archive layout
- full HUD, compact HUD and minimal HUD modes
- fullscreen toggle and reduced-motion preference
- keyboard movement: W/A/S/D, arrows, Shift, Space, J, K, F, Q, E, Esc
- mission selection navigation and two-step launch flow
- boss bars, health values and phase labels remain readable at all target resolutions
- menu, combat and environment transitions remain responsive after resizing and reload

### Mobile coverage

Minimum target mobile matrix:

- iOS Safari and Android Chrome
- portrait and landscape orientation
- DPR and viewport scaling checks
- touch joystick and action buttons
- safe-area and cutout handling
- focus loss and page visibility events

Required mobile checks:

- joystick drag direction is accurate and remains centered when released
- block, dodge, sprint, jump, attack and heavy attack buttons are not stuck on pointer cancel
- action button tappability and overlap are acceptable in full, compact and minimal HUD modes
- portrait and landscape layout remain usable without covering boss health or mission control areas
- no pointer capture left in a bad state after the app is paused or backgrounded

## Performance-testing requirements

### Required metrics

The performance plan must measure, not merely quote, the following:

- per-frame time distribution: median, p95, p99 and worst milliseconds
- percentage of frames above 16.7 ms and above 33.3 ms
- count of long tasks and severe stalls above 100 ms
- memory footprint growth during menu, exploration and combat loops
- loading duration and first-interactive time for mission launches
- representation of severe stalls and frame-time outliers with timestamps and preceding render work

### Required campaign scenarios

At minimum, test these state transitions and load patterns:

- menu open / arc select / mission card scroll
- mission load into playable content
- ordinary combat loop in mission 1 and mission 2
- mission 10 boss encounter and final reward sequence
- an arc-final boss at 20/30/40/.../100
- replay of a completed mission
- reload with a saved progression state
- transition from menu to gameplay to pause/resume to exit

### Acceptance thresholds for preparation

Use these as preparation thresholds for Phase 5.4F review, not final acceptance claims:

- median frame time should stay close to the 33.3 ms target for 60 FPS desktop rendering, but the real acceptance should be evaluated against p95 and tail behavior rather than a single average
- p95 must remain bounded for both menu and gameplay for the target platform; any repeated 100 ms+ stalls are a critical failure condition
- memory growth must remain stable across repeated mission loads and replays; no unbounded heap growth across a session
- loading should never produce a blank screen beyond the expected ready-state interval; any indefinite hang is a BLOCKED condition
- severe stalls over 100 ms or 500 ms must be traced to a specific frame/render period with timestamps and evidence before passing

## Gaps in automated test coverage

The current project is strongest in a few directed gameplay and visual checks, but there are still gaps that would block a full 5.4F acceptance if left untested.

### Current gaps

- No end-to-end validation of all 100 mission archive entries in one run
- No automated mission-selection lock/unlock validation across every mission threshold
- No automated test for 19 playable missions covering launch, combat and replay across all route conditions
- No automated layer validating each of the 10 arc bosses in their unique movement/attack patterns under real player input
- No kill/reset/retry coverage across the full mission archive and save state
- No robust save-schema compatibility suite covering corrupt JSON, older saves and partial-progress data
- No complete mobile input suite for pointer capture, safe-area resizing and portrait/landscape transitions
- No exhaustive long-session memory/performance suite for menu + combat + boss + reload loops
- No protected-file integrity checker for environment toggles and asset manifests
- No deterministic automation for UI overlap at all HUD modes and target screen sizes

### Required automation additions before final acceptance

- a mission catalog validator that asserts all 100 IDs, titles and statuses
- a save-state validator that checks unlocks, completion and rewards after reload
- a boss combat harness for all ten arc bosses
- a desktop/mobile UI regression harness with screenshot assertions
- a performance trace collector and long-stall summarizer

## Phase 5.4F acceptance checklist

This checklist is meant to be used only once Phase 5.4E is frozen. It is intentionally explicit to avoid ambiguous signoff.

### PASS

A Phase 5.4F validation item passes only if the evidence is direct, reproducible and recorded. Examples:

- All 100 mission archive entries render with correct title, arc grouping, status and lock semantics.
- All 19 playable missions can launch, run and complete or reach the valid boss gate as intended.
- All ten arc bosses begin, follow correct phase logic, produce attack hazards, and end with a valid defeat/relic state.
- Combat, rewards and mission progression are stable across save/reload and replay.
- Keyboard and touch controls behave correctly across supported desktop and mobile layouts.
- UI layout remains readable and hittable in full, compact and minimal HUD modes.
- Environment default and opt-in toggles preserve correct production behavior.
- Performance trace evidence shows bounded frame-time tails and no severe untracked stalls.
- Protected asset/save integrity checks remain clean and no critical files are modified.

### FAIL

Any of the following should be recorded as FAIL:

- mission archive or progression lock state is incorrect
- a playable mission cannot start or immediately crashes
- a boss cannot begin or does not transition properly through phases
- rewards are duplicated or progression resets after reload
- touch or keyboard inputs become stuck or unusable in any supported mode
- the UI overlaps important controls or hides the button/objective state
- the default environment changes unintentionally or environment toggles break production flow
- performance evidence shows repeated severe stalls or memory leak behavior
- save compatibility breaks an existing valid campaign state

### BLOCKED

A Phase 5.4F validation item is BLOCKED if:

- the underlying 5.4E implementation is still changing or not frozen
- a required mission or boss remains intentionally unimplemented
- the game cannot reach the later arc boss because intermediate story chapters are unbuilt
- the save form or protected assets are not stable enough to load and compare
- critical environment or visual-proof evidence is absent or incomplete
- performance or memory traces cannot be collected with reliable timestamps

### Required signoff language

Before any final signoff, the project must explicitly state:

- whether the validation was run on a frozen implementation
- which mission data was covered and which items were intentionally not playable
- whether the environment toggle and production default remained preserved
- whether saves and protected files remained intact
- whether the evidence includes direct metrics, screenshots and logs for each failure/pass condition

This report is a preparation artifact only. It is not a certification that Phase 5.4F is complete.
