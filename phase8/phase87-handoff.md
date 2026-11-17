# Phase8.7 handoff

**CONDITIONAL PASS for isolated power prototype and offline validation. Browser/visual acceptance BLOCKED; normal story unlock BLOCKED by unimplemented Arc10 lead-in.**

Source:phase8/phase8.7/staging. Normal build:phase8/phase8.7/build. Separate test build:phase8/phase8.7/dev-build. Untouched rollback:phase8/phase8.7/rollback. No production integration.

## Disposable awakening route —only when resources are safe

```powershell
Set-Location -LiteralPath 'C:\Users\Hp\Downloads\kalki 2898AD'
node .\phase8\phase8.7\serve.mjs --awakening-test
```

Open **http://127.0.0.1:5287/**. It must say DEVELOPMENT TEST / MEMORY SAVES ONLY. It starts the existing Mission1 test fixture,not a new campaign mission. Click Awakening / Replay. Complete or Skip using the existing overlay;the gold weapon,energy HUD and abilities become available in this memory-only fixture. Refill TEST energy explicitly when needed. Reload discards the entire test. Do not treat this as a natural campaign unlock or accepted visual playthrough. Native browser save storage is replaced before any game import;no personal save is read or written. No test server currently runs.

L or the HUD toggles the weapon;1/2/3 or the same touch buttons trigger Strike/Shield/Ultimate. Original attack,dodge,block/parry,heal,interact,Overdrive and pause mappings remain. Energy/costs/cooldowns are shown;powered attacks can recharge a depleted meter. Replay does not refill an already unlocked meter;use the explicit TEST refill button.

## Normal staging

Run node .\phase8\phase8.7\serve.mjs without the flag for **http://127.0.0.1:5286/**. This preserves the Phase8.6 staging origin and Continue behavior. Use the same exact host/port/profile for intended saved data;localhost versus127.0.0.1 or a different port is a different save origin. Personal profiles were not accessed for this task. Normal staging does not expose the development build or early unlock path.

The designed story awakening belongs at100,but99 is still planned. Natural unlocking is therefore blocked rather than granted in Arc1 or from the standalone100 boss prototype. No campaign expansion was introduced. Existing legitimate divine unlock/energy data can persist through the same save record;older saves default locked. No actual browser persistence test was performed.

## Review evidence and limits

313 PASS/8 not applicable including two fresh-process disposable save checks. Both builds/lint PASS,12 inherited warnings.47 protected hashes and232-file rollback match. No browser/visual/mobile or real sound acceptance. Cinematic sound cue hooks are prepared/empty;movie audio and commercial voice clearance remain unchanged/blocked. Cooldowns/shield are transient across exit/reload;unlock,weapon preference,seen flag and energy persist in normal save data.

Remaining dependencies before any Phase8.8 work:authored99→100 story boundary;safe actual camera/Skip/Replay/control and mobile layout review;power balance and1080p performance on target hardware;real browser Continue/refresh/server-restart acceptance;review of transient cooldown policy and8.6 checkpoint limitations. These are dependencies for user review,not new Phase8.8 implementation authorization.

All owned checks/builds stopped;no browser/server/monitor launched. Preserve prior phases and rollback. Stop here for review.
