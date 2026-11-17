> CURRENT STATUS: Re-enabled by explicit user request: defeat all regular enemies, then enter the arena to fight the final boss. Crystals, pylons and relay/contract verification do not gate boss availability in Missions 1–10. Existing boss-only and story routes retain their authored rules. Port 5297 remains unchanged, so the browser origin is preserved. No saves were read or modified. Sixteen offline checks, build and lint passed; browser attack/gameplay validation remains unverified. Earlier disable notes and results are historical.
Implemented in a new isolated copy: `phase8/phase8.8/enemy-boss-flow/staging`.

For Missions 1–10, defeating every configured regular enemy immediately satisfies boss eligibility. Crystals, pylons and contract/story interactions no longer gate boss availability. Enter the existing arena to trigger the boss presentation and fight; Mission 3 preserves its existing immediate trigger. No teleport or new encounter was added. Mission 10's previous exclusion from the shared boss-start handler was removed.

The HUD announces that regular opponents are defeated and directs the player into the boss arena. Mission 1's previously suppressed Warden guidance is restored. Mission-specific non-boss objectives remain present; their completion is not fabricated. Boss damage, defeat, relic, rewards and save authority are unchanged.

Boss-only routes without regular enemies retain their existing objective entry conditions. Noncombat batch routes and Mission 91 are unchanged. This does not add bosses to story missions or implement planned missions.

## Launch

```powershell
Set-Location -LiteralPath 'C:\Users\Hp\Downloads\kalki 2898AD'
$env:KALKI_STAGING_PORT = '5297'
node .\phase8\phase8.8\enemy-boss-flow\serve.mjs
```

Open http://127.0.0.1:5297/. Expected response header: `X-Kalki-Staging-Milestone: 8.8-enemy-boss-flow`. Existing 5286/5296 servers were not stopped or changed. This new origin has separate browser storage: no personal saves were accessed or migrated. Keep the same URL/profile for this copy's progress. No browser was launched during this task.

## Validation and limits

16 offline checks PASS, including actual enemy store damage/defeat and boss lifecycle calls, ten real enemy rosters, incomplete-roster rejection and Mission1 guidance. These are not browser or natural-playthrough evidence. Build PASS; lint PASS with 12 existing warnings. Initial validation exposed incorrect test assumptions about empty enemy rosters and the store reset API; those initial results are retained in `initial-validation-results.json`. Boss-only fallback was preserved before the final passing run.

Browser gameplay is UNVERIFIED. No claim of visual or complete campaign acceptance. Remaining salvage/pylon text may still describe optional activities; the boss-ready banner takes precedence as the encounter cue. No campaign completion, unlock history or rewards were fabricated.

## Changed implementation

- New `src/game/bossUnlock.js`: shared nonempty-roster eligibility predicate.
- `BossEncounter.jsx`: enemy-only gate for existing regular-enemy encounters.
- `phase54e/ArcBossFight.jsx`: same policy including Mission10; preserve boss-only fallback.
- `arcOne/missionOneObjective.js`: ready-for-Warden status takes precedence after patrol defeats.
- `missionOneUiText.js`: restore previously suppressed encounter instructions.
- `GameHud.jsx`: shared boss-ready guidance.
- This copy's launcher identifies this milestone and defaults to port5297.

The `rollback/` directory preserves the complete pre-change source. `protected-before.json` and `results.json` verify all 610 previous staging/evidence hashes, 153 production hashes and 47 protected hashes unchanged. Personal saves and Mission91 were not edited. No new audio, packages, or paid assets. No production promotion.
