# Phase8.7 implementation

2026-11-16, Asia/Calcutta. **CONDITIONAL PASS for isolated power prototype and offline validation. Browser/visual acceptance BLOCKED; normal story unlock BLOCKED by unimplemented Arc10 lead-in.**

## Awakening and weapon

New isolated232-file baseline/rollback from8.6. Implemented a9s awakening configuration using the existing central cinematic director, existing world and cached Bhairava rig. Five ordered camera marks orbit/reframe the character, then use the existing smooth return. Existing Sword idle/guard/block clips provide the hand-raise/awakening gesture; these are reused animations, not a new bespoke motion-capture clip. Golden orbit/rising particles, aura ring, growing weapon scale, original English dialogue and title accompany the sequence. Existing Skip/return/input-hold lifecycle is reused. No environment, character or camera-system replacement. Actual composition/clipping/memorability/animation appearance remain unverified.

The existing socket sword gains a gold material/emissive variant and damped manifestation, with L/touch activation/deactivation. Existing basic/heavy attacks gain1.2/1.3 multipliers when the unlocked weapon is active; combos and Overdrive still apply through the original attack path. Existing trails/contact reactions and Phase7.6 pooled effects are reused. No new weapon model, movie prop, high-resolution texture, dynamic light or actor audio.

## Abilities and energy

- Divine Strike:25 energy,2.5s cooldown,65 damage,6m forward cone(dot>=.6),height difference<2.5m. Actual adapter checks fixed-world obstruction before damage.
- Divine Shield:35 energy,12s cooldown,4s duration;65% incoming damage reduction, not invulnerability. Existing guard/parry/dodge protections remain.
- Ultimate Awakening:full100 energy,20s cooldown,120 damage in7m area. Reuses a1.5s cinematic activation and existing return/Skip. Skip still applies the attack/cost when valid; interrupted/disposed/protected callbacks cannot spend or damage later.

Energy is clamped0–100. Actual enemy/boss health-loss receipts with new hit timestamps recover6 energy, at most once per500ms. Restoring health data alone cannot fabricate a hit. A hit from an ability can legitimately recover that bounded amount; e.g. ultimate cost100 followed by a hit may leave6. Powered normal attacks can recharge an empty meter. No new timer loop or paid service.

HUD displays energy,costs,availability,cooldown gates and feedback. Keyboard1/2/3 and touch buttons use the same queue; L/touch toggles weapon. J/K,Ctrl,Space,Q/Shift,F,H,E,B and pause are retained. Scalar availability masks refresh only at cooldown boundaries. Abilities reject locked/deactivated weapon,insufficient energy,cooldown,death,pause,game hold,exploration and incompatible attack/dodge/stun/heal states. Actual physical/touch/controller interaction and overlay layout remain unverified.

## Campaign and saves

Existing design places inheritance at Mission100. Current99 remains planned, while100 is a grandfathered boss prototype. The story trigger requires active100,actual99 completion and implemented99; it therefore refuses the current unbuilt lead-in, even if a test injects a99 completion ID. No Arc1 early unlock or planned mission promotion. Existing campaign map,completion,unlock and reward logic are unchanged. Natural story-boundary execution remains BLOCKED until authored lead-in content exists.

Added optional divine record through the existing normalized combat-save adapter and kalki-campaign-progress key:unlocked,milestone,awakeningSeen,weaponActive,energy. Older saves default locked/0; mere Mission100 prototype completion does not grant powers. Real previously recorded valid unlocks can reload without deleting progress. Health/healing/checkpoint,selected mission,completed/unlocked IDs,rewards and retained unknown fields remain. Cooldowns and active shields are transient and reset on exit/round/reload; saved unlock/energy/weapon state persists. No personal profile/save was accessed or migrated. Existing stable5286 Continue/checkpoint behavior is preserved with its8.6 limitations.

## Separate development route

Explicit --awakening-test build uses separate dev-build and a separate entry. It installs an in-memory localStorage facade before all dynamic game imports. The original storage getter is never read/copied/forwarded. Failure to install aborts before loading the game. It seeds only Mission1,zero completions and three healing charges. A visible DEVELOPMENT TEST / MEMORY SAVES ONLY banner offers Awakening/Replay and explicit TEST energy refill. All unlock writes stay in the facade and disappear on reload; no future mission completion is required or fabricated.

The development helper is not imported by normal main.jsx and is absent from normal bundle assets. It additionally requires the compiled divine-test mode and memory-only marker. Default serving does not expose dev-build. The test launcher defaults5287; normal staging preserves5286. No test query flag enables early campaign powers. No server/browser was launched in this task.

## Validation and correction

319 automated checks:311 PASS,8 NOT APPLICABLE,0 final failures. Two extra fresh-process disposable save checks PASS, giving313 PASS/8 not applicable overall. Includes34 new core/integration checks plus285 inherited checks:15 regression programs,ten Arc1 programs,20 combat/healing checks,24 assistant checks and16 character checks. Actual director logic,combat/boss adapters,shield damage,multiplier/energy/cooldown behavior,LOS refusal,pool unsubscribe,CPU aura callback,existing GLB clip metadata,storage barrier and build separation are tested. Node/manual callback fixtures are not actual browser animation/camera/mobile acceptance.

Initial integration11/14 found duplicate pending ultimate,late callback after disposal and blocked energy recovery during attacks. The focused correction adds pending/generation/cancel gates,post-cinematic protection checks,actual-hit timestamp validation and recovery independent of attack busy state. Related availability/listener cleanup and lint findings were addressed in the same correction work. Original failures and initial lint are retained; final integration24/24 and core10/10 pass. Final lint has12 inherited warnings,zero new. Both builds pass; existing large-chunk advisory remains. No visual degradation or shader experiment.

Cinematic audio cue-array/integration slots remain prepared but empty. No awakening audio was activated or tested. Existing central audio,rights checks,voice samples and commercial-rights limitations are unchanged. No TTS,microphone,cloud,model/asset download,new dependency,purchase or movie media.

## Resources and limitations

Initial240.11MiB available RAM/1767.61MiB commit headroom; final212.74MiB/759.47MiB. Browser rendering would exceed the current margin relative to prior~572MiB overhead. No browser/server launched or repeatedly retried; no process terminated,no RAM upgrade required. Final work is reporting/integrity only. Actual1080p frame pacing,VRAM,visual impact,camera clearance,mobile layout,power balance and real browser refresh/restart remain UNVERIFIED/BLOCKED. Phase8.2 remains0/10 newly browser-accepted.

## Modified inherited staged files

- `phase8/phase8.7/staging/index.html`
- `phase8/phase8.7/staging/src/game/combat86/rules.js`
- `phase8/phase8.7/staging/src/game/GameHud.jsx`
- `phase8/phase8.7/staging/src/game/gameplayStore.js`
- `phase8/phase8.7/staging/src/game/player/BhairavaWeapon.jsx`
- `phase8/phase8.7/staging/src/game/player/Player.jsx`
- `phase8/phase8.7/staging/src/game/player/PlayerInput.jsx`
- `phase8/phase8.7/staging/src/game/player/RiggedBhairava.jsx`
- `phase8/phase8.7/staging/src/game/presentation/CollectionEffects.jsx`
- `phase8/phase8.7/staging/src/game/World.jsx`

## New staged files

- `phase8/phase8.7/staging/awakening-test.html`
- `phase8/phase8.7/staging/src/awakening-test-entry.js`
- `phase8/phase8.7/staging/src/game/divine87/awakeningCinematic.js`
- `phase8/phase8.7/staging/src/game/divine87/development.js`
- `phase8/phase8.7/staging/src/game/divine87/developmentStorage.js`
- `phase8/phase8.7/staging/src/game/divine87/divine.css`
- `phase8/phase8.7/staging/src/game/divine87/DivineBridge.jsx`
- `phase8/phase8.7/staging/src/game/divine87/DivineHud.jsx`
- `phase8/phase8.7/staging/src/game/divine87/DivinePresentation.jsx`
- `phase8/phase8.7/staging/src/game/divine87/effects.js`
- `phase8/phase8.7/staging/src/game/divine87/gameplay.js`
- `phase8/phase8.7/staging/src/game/divine87/rules.js`
- `phase8/phase8.7/staging/src/game/divine87/runtimeCore.js`
- `phase8/phase8.7/staging/src/game/divine87/state.js`

Other new files are isolated scripts,tests,build outputs,manifests,evidence and six requested reports. Phase8 tracking/project progress updates preserve backups. Protected47/47,production153/153,new rollback232/232 and prior-stage manifests match. No production promotion. All owned commands exited; no browser/server/monitor. No Phase8.8 work started.
