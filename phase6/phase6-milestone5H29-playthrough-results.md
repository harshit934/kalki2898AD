# Phase 6 Milestone 5H.29 — natural playthrough results

15 November 2026. **PASS for the bounded desktop Mission1 natural-playthrough and expanded voice-event validation.** No production integration or commercial approval.

## Build, profile and method

Used the **unchanged expanded copy** `phase6/milestone5H28/staging/`, through its existing isolated server. Accepted `milestone5H24/staging/`, all earlier rollback points and standalone prototype remain untouched. New evidence is under `phase6/milestone5H29/attempt-1/`.

Chrome157.0.8103.51, headless desktop1920×1080 viewport, a new temporary browser profile/disposable context. This was a fresh new-player run:100HP, no completed missions or saved rewards. No save seed, fixture, direct state setter, teleport, health assignment, damage call, forced boss defeat or completion call was used by the harness. All changes to gameplay state came from normal game mechanics driven by keyboard movement, Fguard, Kattacks and BOverdrive. Read-only state assisted automated navigation; this is not a claim of human manual play.

To exercise the health-specific wording, the test deliberately allowed normal incoming hits until the existing warning became eligible, then defended and counterattacked. It did not weaken enemies or restore health. No new samples, model downloads, package installation or production assets were involved.

Procedure: `milestone5H29/playthrough.mjs`. Raw evidence: `milestone5H29/attempt-1/raw-results.json`; compact cross-checked summary: `milestone5H29/natural-completion-summary.json`.

## Actual outcome

- All three patrols cleared through ordinary gameplay; Warden720HP naturally reduced to0 and normal defeat readiness reached.
- Relic collected through player approach and existing game logic.
- Ending `kashi-contract-return` started at **12:30:13.500UTC**, entered returning at12:30:24.213 with **reason=completed**, then idle at **12:30:25.059**. Observed ending time reached10.5seconds. No ending-skip input was sent.
- Victory voice event at **12:30:25.388UTC**, **329ms after cinematic idle**; its authoritative context was cinematic=false, boss defeated, relic collected, completion recorded and saved rewards present. Native playback was observed.
- Final health **12.1/100**, score **4,650**, six crystals. Score reconciles800 patrol points +600 crystal points +2,500 boss +750 relic. Run score is not the fixed saved mission payout.
- Saved rewards exactly `{boss:2500,relic:750}`; completedMissionIds exactly mission-1; mission-2 unlocked. Mission2 was not launched.
- Exact naturally earned campaign JSON survived a page reload with no reseeding or manual storage write. Full browser restart was not newly tested here;5H.27 has separate historical restart evidence.

The post-control-check gameplay segment took **91.651seconds** to relic, including deliberate low-health exposure; opening/setup and ending are excluded.25 heavy attack inputs were sent. These are functional timings/input counts, **not performance benchmarks** or before/after frame-rate comparisons. Detailed observer snapshots and disk writes may affect scheduling; no stable30FPS claim is made.

## Voice checks

1. **PASS — calm/movement:** first eligible movement naturally triggered BH6-5E-002 at100HP. “Movement” is the trigger for calm guidance, not a separate fifth recording.
2. **PASS — combat:** BH6-5E-004 triggered naturally at31HP while patrols remained. Native playback occurred; movement and enemy health changes during playing status establish continued gameplay.
3. **PASS — boss:** BH6-5E-037 triggered with the Warden active at22playerHP and played technically. No generic mapping to other bosses was introduced.
4. **PASS — victory:** BH6-5E-013 followed natural ending completion and displayed actual saved reward facts. No victory fixture was used.
5. **PASS — Skip/replay:** actual gameplay Skip stops voice and explicit replay starts it. Victory Skip/replay preserved the visible completion UI and exact saved reward bytes.
6. **PASS — mute/volume:** mute cancels active narration; unmute alone does not restart it; explicit replay uses volume0.35.
7. **PASS — interruption:** real pause interrupts voice; resume remains responsive. The boss clip had already ended before the ending cinematic, so forcibly preempting a still-playing clip with the cinematic is **UNVERIFIED in this natural run**.
8. **PASS — event identities:** calm, combat, boss and victory each recorded once for the round. Replays did not add completion events or rewards. Technical playback does not establish spoken-language accuracy or expressive quality.

The serious/missing-history sample remains intentionally unmapped in normal Mission1. No emotional content, new audio, additional missions or wider event expansion was added.

## Evidence images

- `milestone5H29/attempt-1/calm.png`
- `milestone5H29/attempt-1/combat-warning.png`
- `milestone5H29/attempt-1/boss-warning.png`
- `milestone5H29/attempt-1/ending-natural.png`
- `milestone5H29/attempt-1/victory-natural.png`

The actual victory screenshot was inspected: score04650, Mission01complete/Mission02unlocked/relic1/1, legitimate Continue/Selection/Restart actions and the new saved-reward narration panel. These are real game captures, not fixture or concept images. This is not a general visual-quality approval.

## Results and limitations

`phase6-milestone5H29-test-results.csv`: **30 grouped checks:24PASS,1FAIL,5UNVERIFIED**. The sole FAIL is explicitly the **historical5H.28 defeat**, retained for traceability. The new natural run has no failed check or page exception. Five unverified items: exact historical final-hit attribution, active-clip cinematic preemption, physical Android, independent language/expressive approval and commercial clearance.

No new production build/lint or broad performance investigation: game source was unchanged. Physical Android remains a separate unverified requirement; no emulation was substituted. Commercial clearance remains blocked. Prior rights enforcement and5H.21 temporary prototype conditions remain intact.

## Integrity and stop

**47/47 protected expected SHA-256 hashes match before and after. 1,135/1,135 existing snapshot files remain unchanged**, including both staging copies, prior rollback/prototype/evidence and production files in that snapshot. `milestone5H29/integrity-results.json` and `protected-hashes.json` contain the results. Personal profiles/saves were not accessed; their contents were not independently audited.

Only new test/evidence files under milestone5H29 and the four requested deliverables were created. No game-source correction or rollback restore was necessary. Both browser and isolated staging server were closed in finally; final matching owned Node process count0. Preserve all evidence and continue no further work without approval.
