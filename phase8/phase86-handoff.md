# Phase8.6 handoff

**CONDITIONAL PASS for implementation and offline tests. Full gameplay, visual/balance and browser persistence acceptance BLOCKED.**

Isolated source: phase8/phase8.6/staging. Build: phase8/phase8.6/build. Rollback: phase8/phase8.6/rollback. Never copy to production or overwrite earlier stages.

When resources safely permit, open PowerShell:

```powershell
Set-Location -LiteralPath 'C:\Users\Hp\Downloads\kalki 2898AD'
node .\phase8\phase8.6\serve.mjs
```

Use **http://127.0.0.1:5286/** consistently, in the same intended browser profile. It deliberately does not choose a random free port. A different hostname/port/profile is a different browser save origin; no personal save migration was performed. If the port is occupied, stop and resolve the conflict rather than silently switch addresses. No server is currently running.

Continue resumes selected recorded mission and a compatible new run checkpoint; old campaign-only records retain existing completion/unlocks/rewards but cannot recover previously unsaved health. Existing New Game requires an explicit confirmation to start a new Mission1 run, keeping campaign history. No automatic campaign reset.

Controls: WASD/stick; Ctrl/touch Sprint(unlimited); Space/Jump; Q/Shift/Dodge; J/Attack light three-chain; K/Heavy; F/Block(timed first180ms parry); H/Heal or Heal touch/HUD. Settings before mission launch select one of five difficulties. Three limited persistent healing charges restore35 each with5s cooldown. No automatic restart refill.

Evidence:279 PASS/8 not applicable including2 fresh-process save checks; build/lint PASS with12 existing warnings;47 protected hashes match. Browser acceptance BLOCKED; no actual combat/playability, natural balance, touch layout, resumed ending or browser-refresh/server-restart claim. Check phase86-test-report.md and phase86-performance-report.md.

Remaining limitations: no new resupply mechanic; ranged attack is a telegraphed locked-target strike; existing art reused; no general equipment/skills implementation; saved unknown upgrade fields preserved but no invented upgrade mechanics. AI patrol positions/clocks,camera view and Mission2 auxiliary chase are not fully serialized. Never erase old saves to test. Use disposable profiles/fixtures. Existing Phase8.2 browser acceptance remains pending. No new voice/audio rights or production approval.

All owned test/build commands stopped; no browser/server was launched. Stop after handoff; do not proceed automatically.
