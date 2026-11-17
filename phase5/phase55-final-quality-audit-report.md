# Phase 5.5 — Final quality audit

Audit time: 2026-11-14T14:48:03.969089+05:30 (Asia/Calcutta).

**Recommendation: REJECT final quality approval.** Phase 5.4F was not closed against the agreed full 100-mission scope. This audit does not restart it or implement corrective work. The existing 19-route stabilization is valuable, but does not establish a completed campaign or release readiness.
## Scope, provenance and roadmap

This is a source/evidence audit with fresh read-only lint, syntax and hash checks. No game launch, new gameplay benchmark, production rebuild, save migration or optimization was performed. Recorded gameplay tests below are historical evidence, not newly executed Phase 5.5 tests. Only this requested report was created; earlier evidence was preserved.

The original ten-phase roadmap was located in the user-provided [master development instruction](C:/Users/Hp/.codex/attachments/bf50c31d-658e-4534-9c13-320146c20baf/Pasted%20text.txt), section 14: project audit; graphics/environment; Bhairava/animation; movement/combat; enemy AI/bosses; AI assistant/voice; campaign; audio/cinematics; HUD/controls; testing/optimization/campaign completion. The current Phase 5 subphases overlap these original workstreams. Their numbering does not prove later roadmap requirements have been completed. This review does not reinterpret or replace that roadmap.

Reviewed current `README.md`, `DEVELOPMENT_CHECKLIST.md`, campaign/environment/enemy source requirements, the Phase 5.4E final acceptance report, Phase 5.4F preparation report, mission audit/implementation plan, 81-mission inventory, batch plan, production-art inventory, validated checkpoint and supporting evidence. The development checklist contains historical Phase 2 status; it is not an up-to-date closure certificate.

## Phase 5.4F closure verification — FAILED

- `phase5/phase54f-final-stabilization-report.md` is absent. The available preparation report is explicitly preparation-only, and `phase54f-stabilization-20261114/validated-checkpoint.md` explicitly says **IN PROGRESS**, not release-ready.
- Current `src/game/storyCampaign.js` still sets `playable: number <= 10 || number % 10 === 0`: **19 playable definitions / 100 archive entries**, with **81 unbuilt**. The 19 are Missions 1–10 and 20, 30, 40, 50, 60, 70, 80, 90, 100.
- Missions 11–15 have draft activity definitions/runtime, but no imports from the live game. The validated chapter set is empty. They are not implemented playable missions, and the drafts do not change the 19 count.
- Ordinary sequential campaign progression therefore stops after Mission 10 at the unbuilt Mission 11. Later boss fixture tests do not prove a legitimate 100-mission campaign path.
- No completed five-mission batch acceptance evidence or full-scope production-art acceptance was found. The later full-100-mission agreement was not satisfied by stabilizing the original 19 routes.

## Verified completed work and test boundaries

The following are supported by existing raw results, within their recorded scope:

- **Mission 1:** ordinary-input replay, relic/rewards/reload and natural real-time ending, using opt-in Kashi at 1080p. A new-game first clear and current production-default natural ending are not thereby certified.
- **Missions 2–9:** eight PASS completions in `campaign-completions/results.json`, covering objectives, enemies, boss, relic, rewards and reload with keyboard at 720p. Their completion videos were skipped. Missions 3–9 retain similar marker/guard/boss prototype structure; authored story variety remains incomplete. Mission 3's guard elimination is not a required boss gate in current source.
- **Ten arc-final encounters:** Mission 10 has its own entry/objective/duel results; strict browser results contain nine PASS encounters for Missions 20–100. These cover phases, distinct attack patterns, defeat/relic and persistence. Later encounters were opened using disposable unlocked fixtures, not a completed campaign. Combat functionality does not establish final character/arena art quality.
- **First-unseen arc introductions:** `first-intro-browser-results.json` records nine PASS natural introductions, Missions 20–100, with empty error list. This supports the targeted `storyBriefing.js` fallback repair, not every cinematic/video path.
- **Bujji:** `chase/contract-live-results.json` supports touch contract/duel/chase and replay-intro checks. This does not prove every planned story interaction or the complete voiced assistant roadmap.
- **Controls/UI:** input, UI-stage, loading-recovery, tablet-ending-layout and server-restart/interact logs support keyboard/touch aggregation, focus-loss release, mobile Interact, three HUD modes, pause/navigation, retry/cancellation and save-safe exit. Sprint remains unlimited. Full Mission 1 touch completion and physical touchscreen performance were not certified.
- **Persistence:** `tests/browser-restart-observed-results.json` records PASS across actual Chrome restart using a synthetic dedicated profile; campaign selection, completion/rewards and preferences persist. Saves represent completion/selection/rewards, not exact in-run checkpoints.
- **Prior build:** `build-production-release.log` records a successful checkpoint production build, with bundle advisories. `tests/production-bundle-smoke.json` records default, final opt-in and prior-version route smoke evidence with actual 1920×1080 buffers and no test globals.

These are checkpoint results, not a blanket PASS for the latest worktree.

## Fresh checks and failures

**Current lint: FAIL (exit 1).** `npm run lint` reports a parser error at `src/game/chapters/chapterCatalog.js:24`: the single-quoted label `Hear the trader's exchange terms` contains an unescaped apostrophe. `node --check` independently reproduces the syntax failure. The catalog is currently unimported; this does not prove the existing bundled game crashes, but it prevents clean-source acceptance and must be corrected before candidate integration. Five existing immutability warnings remain (four MenuScene, one CorrectedCity).

`node --check src/game/chapters/chapterRuntime.js` passes syntax only. It does not prove mission runtime behavior. No production build was run during this read-only audit: historical build PASS must not be substituted for a clean current-source build.

The current worktree differs from the validated stabilization source snapshot at:
- `src/game/chapters/chapterCatalog.js`
- `src/game/chapters/chapterRuntime.js`
- `src/game/cinematics/storyBriefing.js`

Current `dist/` inspection: 54 files byte-match the saved `production-build/` checkpoint; 10 files differ or are missing from that comparison artifact. This is a file comparison, not source-to-build reproducibility certification. The latest briefing change was tested separately; a single final clean build and full acceptance manifest are absent.
## Performance evidence and test conditions

No new performance claim is made. Existing F tests ran on Ryzen 5 5600H / GTX 1650 4 GB, driver 592.82, Windows 11 build 26300, approximately 7.88 GB OS-reported usable physical RAM. Four 120-second samples used lightweight render journals without CPU profiling, browser tracing or GPU elapsed queries. The native memory/power series contains 569 samples, all AC online; available RAM ranged 4.29–605.13 MiB and memory load 91–99%. Memory pressure is observed; a cause for every gap is not established.

Desktop buffers were actually 1920×1080, CSS1920×1080/DPR1. Mobile samples were laptop Chrome emulation: portrait buffer860×1864/CSS430×932/DPR2; landscape1688×780/CSS844×390/DPR2. These are not physical phone benchmarks. Reported FPS is render-start cadence, not presentation/display FPS. The exploration sample is an idle exploration scene and guard-area samples are not sustained full boss combat.

Existing 120-second representative results (average FPS; median / p95 / p99 / maximum milliseconds):

- Desktop exploration: 30.00; 34.6 / 35.4 / 36.3 / 72.3.
- Desktop guard area: 29.98; 34.6 / 35.5 / 37.4 / 128.0.
- Portrait emulation: 73.87; 12.9 / 19.2 / 23.9 / 47.9.
- Landscape emulation: 61.51; 15.5 / 23.2 / 28.4 / 44.7.

Natural Mission 1 opt-in replay: 29.91 FPS; p95 35.3 ms, p99 36.1 ms, maximum141.5 ms. Normalization was0.2 ms. Repeated operation trials reduced that measured bounds/normalization block from378.9–435 ms to0–2.9 ms. This supports the opt-in loading-gate repair, not elimination of every ending delay. The default production ending path was not given the same fresh natural-ending validation.

Every retained unprofiled F gap above100 ms in the aggregated record:
- 2026-11-14T06:08:04.020Z | natural-ending | **141.5 ms** | classification `retained fix / full replay`; source `natural-ending/mission1-natural-diagnostic-frame-journal.json`.
- 2026-11-14T05:51:48.123Z | after-0 | **280.5 ms** | classification `retained bounds fix / diagnostic`; source `after-operation/results.json`.
- 2026-11-14T05:52:08.575Z | after-1 | **422.6 ms** | classification `retained bounds fix / diagnostic`; source `after-operation/results.json`.
- 2026-11-14T05:52:08.867Z | after-1 | **291.8 ms** | classification `retained bounds fix / diagnostic`; source `after-operation/results.json`.
- 2026-11-14T05:52:09.161Z | after-1 | **294.3 ms** | classification `retained bounds fix / diagnostic`; source `after-operation/results.json`.
- 2026-11-14T05:52:09.305Z | after-1 | **144.4 ms** | classification `retained bounds fix / diagnostic`; source `after-operation/results.json`.
- 2026-11-14T05:52:14.227Z | after-2 | **240.0 ms** | classification `retained bounds fix / diagnostic`; source `after-operation/results.json`.
- 2026-11-14T05:52:14.472Z | after-2 | **245.0 ms** | classification `retained bounds fix / diagnostic`; source `after-operation/results.json`.
- 2026-11-14T05:52:14.853Z | after-2 | **381.4 ms** | classification `retained bounds fix / diagnostic`; source `after-operation/results.json`.
- 2026-11-14T05:52:15.127Z | after-2 | **273.3 ms** | classification `retained bounds fix / diagnostic`; source `after-operation/results.json`.
- 2026-11-14T06:09:09.637Z | after-gpu-calls-0 | **273.1 ms** | classification `retained bounds fix / diagnostic`; source `after-gpu-calls-operation/results.json`.
- 2026-11-14T05:58:28.869Z | boss-40 | **214.9 ms** | classification `retained gameplay`; source `tests/boss-browser-strict-results.json`.
- 2026-11-14T05:58:29.109Z | boss-40 | **240.0 ms** | classification `retained gameplay`; source `tests/boss-browser-strict-results.json`.
- 2026-11-14T06:03:50.602Z | boss-90 | **126.1 ms** | classification `retained gameplay`; source `tests/boss-browser-strict-results.json`.
- 2026-11-14T06:56:49.914Z | desktop/near-street-guard | **128.0 ms** | classification `retained final sample`; source `performance/results.json`.

One separately instrumented ending trial recorded a215.7 ms `getProgramInfoLog` call inside a273.1 ms frame interval. This establishes a synchronous shader-status query delay at that call site. It does not identify the complete driver/Windows dependency or prove the same cause for M40, M90 or historical stalls. Captured “Aged brass” shader text does not establish an exact asset owner. Additional warm-up/light-slot candidates regressed to4441 ms and1305 ms and were rolled back; they are not retained gameplay results. Historical239.1 ms,533.6 ms,4051.2 ms and other reported stalls remain unresolved observations, not silently marked fixed. Original 54E also recorded445.4 ms boss60,464.1/429.5/198.4 ms ending and515.4 ms exploration intervals under its conditions.

**Stable1080p/30 FPS is not established.** Typical near30 averages coexist with visible stalls and p95 intervals above33.3 ms. Existing records have different paths/durations; they do not prove a general controlled improvement percentage.

## Visual quality and remaining roadmap items

Directly inspected actual rendered screenshots: 54E final `after-street-spawn.png`, `after-arena-40.png`, `after-menu.png`, and F `tests/boss-10-intro.png`. These are existing captures, not new captures or concept renders.

The street has recognizable arches, a connected lane, civilians and some elevated infrastructure. The menu has coherent warm gold/teal panels and clear hierarchy; the prominent labelled boss bar is visible in gameplay. However, repeated façade bays, sparse street life, simple props/boss silhouette, uniform surface treatment and weak distant layering remain evident. The arena40 capture is largely a repeated enclosed court. These do not demonstrate the supplied reference's dense layered city, monumental varied architecture, detailed civilians or cinematic surface/lighting quality. The street camera includes strong dark foregrounds and only limited readable skyline. No new screenshot proves the later authored block integrated or accepted.

54E's final report explicitly rejected production integration/visual-performance acceptance. That rejection was not superseded by an art acceptance record. Original production remains default; Kashi is opt-in in `cityAssets.js`. F's new61 MB Blender-exported street block remains unreferenced and unaccepted; geometry counts are not a quality pass. Ten functional boss profiles do not prove ten production-finished arenas, models and defeat cinematics.

Original roadmap items still lacking final acceptance include authored story activities for81 chapters, non-repetitive regional environments/enemy rosters, full character/presentation polish, complete original/licensed Telugu voice coverage, complete contextual assistant/arc recaps, and campaign-wide cinematic/compatibility/performance coverage. Missing voices are intentionally unvoiced rather than replaced with unlicensed film recordings. Existing protected footage/audio being intact does not certify distribution rights. No replacement roadmap or new feature scope is introduced here.

## Save preservation and protected-file integrity

User browser saves were deliberately not opened, exported, reset or written. Existing dedicated-profile tests demonstrate persistence behavior; they cannot certify the contents or health of the user's current personal save. Therefore **personal-save integrity is NOT VERIFIED**, rather than a fabricated PASS. No audit action accessed localStorage or launched a browser profile. Existing source preserves the campaign storage key and read normalization, but a release still needs a consented backed-up real-save migration/reload check or an explicit waiver of that coverage.

Fresh SHA-256 check against `initial-baseline.json`: **47/47 protected files match**. Prior final-Kashi asset check: **14/14 match**. No protected file was changed.

## Ranked approval blockers and exact corrective work

1. **Critical — incomplete agreed campaign/closure:**81 unbuilt missions and no F final completion report. Complete and test the agreed content in controlled existing-scope batches, recording real objectives/completion/rewards/unlocks/reload and no-placeholder status. Alternatively obtain an explicit user-approved reduced release scope; do not silently redefine the full100-mission agreement. This audit starts no development work.
2. **High — current lint fails:** repair only the malformed draft strings, validate all chapter syntax/runtime and prove drafts cannot appear playable before validation. Produce current build/lint evidence; identify historical warnings separately.
3. **High — performance not accepted:** retain the measured opt-in bounds repair, preserve raw gaps and rollback paths, and evaluate remaining intervals with bounded evidence. Validate repeated representative1080p combat and natural transitions with median/p95/p99/max and every>100 ms gap. Target approximately30 FPS/33.3 ms nominal budget; unexplained multi-second interruptions or recurring severe active-gameplay gaps block final approval. Any remaining visible stalls require explicit acceptance, not averages alone. No speculative quality reduction is proposed.
4. **High — visual acceptance remains rejected:** finish and visually review the promised playable art/arenas at ordinary cameras, with matched captures and measured resource/performance costs. Keep Kashi opt-in until accepted. An unintegrated61 MB export is not evidence of completion.
5. **High — incomplete end-to-end and compatibility coverage:** prove legitimate sequential unlocks, full campaign/replay and natural cinematic transitions on a single release candidate; recheck keyboard/touch, pause/retry, three HUD modes and portrait/landscape. Physical mobile remains unavailable by user confirmation; obtain real-device evidence or explicitly constrain supported devices. Do not convert desktop emulation into physical compatibility claims.
6. **High — release provenance/saves:** assemble a current release build/source/hash manifest and F closure evidence; verify backed-up save compatibility without resets. Resolve media/model distribution provenance where unverified. Preserve all47 protected hashes and original fallback.
7. **Medium — presentation/coverage gaps:** complete or explicitly defer unvoiced lines, character/animation polish, full assistant/story coverage and historical warnings. Acceptance must name each limitation and scope; passing builds alone do not approve them.

## Decision and stop boundary

**REJECT final release/final-quality approval.** This is an incomplete development build with valuable verified stabilization, not a completed100-mission release. Conditional acceptance of a limited internal prototype would be a separate explicit scope decision and would not close the agreed full Phase5.4F.

No corrective changes, Phase5.4F restart, optimization or new roadmap work was undertaken. Stop here for user review. The next authorized action must specify completion versus a deliberately reduced release scope; preserve the present implementation and evidence until that decision.

## Evidence index

- `phase54f-mission-audit-and-implementation-plan.md`, `phase54f-stabilized-mission-audit.json`, `phase54f-mission-inventory.json`, `phase54f-batch-plan.json`, `phase54f-production-art-inventory.md`.
- `phase54f-stabilization-20261114/validated-checkpoint.md`, `initial-baseline.json`, `validated-changes-and-hashes.json`.
- Same evidence directory: `performance-summary.json`, `memory-summary.json`, `hardware.json`, `performance/results.json`, `campaign-completions/results.json`, `natural-ending/mission-natural-diagnostic-results.json`, `chase/contract-live-results.json`, `first-intro-browser-results.json`.
- Its `tests/`: `boss-browser-strict-results.json`, `mission10-browser-results.json`, `input-browser-results.json`, `ui-visual-stage-results.json`, `loading-recovery-results.json`, `browser-restart-observed-results.json`, `server-restart-interact-results.json`, `production-bundle-smoke.json`, `tablet-ending-layout-results.json`.
- `phase54e-final-acceptance-report.md` and `phase54e-final-20261114/captures/`.

## Protected SHA-256 appendix

Each actual digest below matched its recorded expected digest at audit time:

- `C:\Users\Hp\Downloads\kalki 2898AD\phase3\likeness-sculpt\artist-work\candidates\bhairava-grooming-v02\rollback-v04-base.blend` — MATCH; SHA-256 `02b546cee0fdd01ce3c32a743628d732288c23f9fc9618744120c588623c4110`.

- `C:\Users\Hp\Downloads\kalki 2898AD\phase3\likeness-sculpt\artist-work\candidates\bhairava-grooming-v03\rollback-v02-base.blend` — MATCH; SHA-256 `5c049d97acab281d475b9a3643b0e3ff2112634678bb854c791842603f191775`.

- `C:\Users\Hp\Downloads\kalki 2898AD\phase3\likeness-sculpt\artist-work\candidates\bhairava-grooming-v04\rollback-facial-v04-base.blend` — MATCH; SHA-256 `02b546cee0fdd01ce3c32a743628d732288c23f9fc9618744120c588623c4110`.

- `C:\Users\Hp\Downloads\kalki 2898AD\phase3\likeness-sculpt\artist-work\candidates\bhairava-grooming-v04\rollback-hashes.json` — MATCH; SHA-256 `d866536c59893b13545aaf8b1476f932e49114985b30e1d9fac462019efdbceb`.

- `C:\Users\Hp\Downloads\kalki 2898AD\phase3\likeness-sculpt\artist-work\candidates\bhairava-grooming-v04\rollback-v03-base.blend` — MATCH; SHA-256 `fa17577ccd7bb774805c420e667db9ef1b52491fbc4b49289bdb680cac0a9046`.

- `C:\Users\Hp\Downloads\kalki 2898AD\phase3\likeness-sculpt\artist-work\candidates\bhairava-grooming-v04\rollback-v03-base.blend1` — MATCH; SHA-256 `fa17577ccd7bb774805c420e667db9ef1b52491fbc4b49289bdb680cac0a9046`.

- `C:\Users\Hp\Downloads\kalki 2898AD\phase3\likeness-sculpt\facial-expressions-v01\bhairava-v04-expression-rollback.glb` — MATCH; SHA-256 `874a87091a2d09ffa63a61f8838e80d2cf224801a02149ddf2b34056110af967`.

- `C:\Users\Hp\Downloads\kalki 2898AD\phase3\likeness-sculpt\facial-v04-displacement-test-2\bhairava-live-face-rollback.glb` — MATCH; SHA-256 `8ef51bc31f7e70620d4ba0d7f4cbac587189c698b6759e6b25fb2a762cb408ce`.

- `C:\Users\Hp\Downloads\kalki 2898AD\phase3\likeness-sculpt\facial-v04-production-integration\bhairava-production-rollback.glb` — MATCH; SHA-256 `8ef51bc31f7e70620d4ba0d7f4cbac587189c698b6759e6b25fb2a762cb408ce`.

- `C:\Users\Hp\Downloads\kalki 2898AD\phase3\likeness-sculpt\facial-v04-transfer-test\bhairava-live-face-rollback.glb` — MATCH; SHA-256 `8ef51bc31f7e70620d4ba0d7f4cbac587189c698b6759e6b25fb2a762cb408ce`.

- `C:\Users\Hp\Downloads\kalki 2898AD\phase3\likeness-sculpt\grooming-v04-investigation\V04_Recovery\Grooming_V04_Recovery_Groom_17.blend` — MATCH; SHA-256 `cced980e7e247b07b3c7757a5393339d6872cf2e0d08aafdcc18e5251061ff43`.

- `C:\Users\Hp\Downloads\kalki 2898AD\phase3\likeness-sculpt\shoulder-deformation-repair-test\production-rollback.glb` — MATCH; SHA-256 `874a87091a2d09ffa63a61f8838e80d2cf224801a02149ddf2b34056110af967`.

- `C:\Users\Hp\Downloads\kalki 2898AD\public\audio\cinematics\kashi-step.wav` — MATCH; SHA-256 `68fa0097cbffa9ff49967385422588ed6a0df35fdedfdaa634cfa2a169ad3e20`.

- `C:\Users\Hp\Downloads\kalki 2898AD\public\audio\cinematics\kashi-wind.wav` — MATCH; SHA-256 `66e2cb87efb254c66e79fea365d126b0c4b73273e49d604fe8ea0078c1b3c27d`.

- `C:\Users\Hp\Downloads\kalki 2898AD\public\audio\cinematics\phase41-chime.wav` — MATCH; SHA-256 `deecd67ac6e1ea66557547cfe087a033b4eff4ff985a5d2b9254062bdde5f043`.

- `C:\Users\Hp\Downloads\kalki 2898AD\public\audio\kalki\bhairava\overdrive-voice.ogg` — MATCH; SHA-256 `2a4ea78e143410482583df694d6e0c64ff3762cd71dc8aac0ddf5ef5ad06ac96`.

- `C:\Users\Hp\Downloads\kalki 2898AD\public\audio\kalki\bujji\support-voice.ogg` — MATCH; SHA-256 `8f81cf87b74aff66c041eaa992b40d6119d31b83fa710c3c05f14441328d4207`.

- `C:\Users\Hp\Downloads\kalki 2898AD\public\audio\kalki\README.md` — MATCH; SHA-256 `b601062419e1fd898fd5bf40eecce79b4978f3ef1537f25efbe83bc464f44490`.

- `C:\Users\Hp\Downloads\kalki 2898AD\public\favicon.png` — MATCH; SHA-256 `44f3bf202a68d952117dc0d4da1bf259ce105c65a1b1101044bf2075d6d8848f`.

- `C:\Users\Hp\Downloads\kalki 2898AD\public\favicon.svg` — MATCH; SHA-256 `61bc9a161de58248288e6905425d7180f0624c2865007b97d763fdac12043a66`.

- `C:\Users\Hp\Downloads\kalki 2898AD\public\icons.svg` — MATCH; SHA-256 `b45fa506195cfcdef406ba9f0c77b36ddc1a7c224040926ec70abc2fdea7b93a`.

- `C:\Users\Hp\Downloads\kalki 2898AD\public\models\bhairava-ASSETS-LICENSE.txt` — MATCH; SHA-256 `a162297c51455256fc4fe5685cd821fcedda2f85e4a360417cf5613bf57312e0`.

- `C:\Users\Hp\Downloads\kalki 2898AD\public\models\bhairava-free-rig.glb` — MATCH; SHA-256 `874a87091a2d09ffa63a61f8838e80d2cf224801a02149ddf2b34056110af967`.

- `C:\Users\Hp\Downloads\kalki 2898AD\public\models\bhairava-fullbody-reference.png` — MATCH; SHA-256 `48cd8e385c200a3dc3796e282c50ad82fc7613e62b804226b336244fe85b393a`.

- `C:\Users\Hp\Downloads\kalki 2898AD\public\models\bhairava-PROVENANCE.txt` — MATCH; SHA-256 `639638f6ec38540ee833467f95dd418384e4914acb8b42bc9c346b435cff3243`.

- `C:\Users\Hp\Downloads\kalki 2898AD\public\models\human-base-candidate.glb` — MATCH; SHA-256 `976e91ac65ce066bbf05683514ba648382cf08dbcb9f340289ab1a8c14dacd94`.

- `C:\Users\Hp\Downloads\kalki 2898AD\public\models\soldier-source.glb` — MATCH; SHA-256 `dfb230fc1f942f259dd00281a1186953ad602fc5d69067ce63e24b2aa439736b`.

- `C:\Users\Hp\Downloads\kalki 2898AD\public\models\threejs-LICENSE.txt` — MATCH; SHA-256 `8b378ebe60e2fe500158cb0ac71cb5e8b7d92953c2abcc63a0eb90499653b5bc`.

- `C:\Users\Hp\Downloads\kalki 2898AD\public\videos\.mission-entry-preview.png` — MATCH; SHA-256 `537476e90e010c4b1a853ab6d5e1f3f71aca964df530e39525a39eabda4321d6`.

- `C:\Users\Hp\Downloads\kalki 2898AD\public\videos\mission-complete.mp4` — MATCH; SHA-256 `5195e527deab6d0224f286e898e77ce4eeecd54698d639ce69bdbfd2e6153bb7`.

- `C:\Users\Hp\Downloads\kalki 2898AD\public\videos\mission-entry.mp4` — MATCH; SHA-256 `54ad388c194d4af035a6d705fabaca87ab96acf404274ddb3d70736543697f7a`.

- `C:\Users\Hp\Downloads\kalki 2898AD\public\videos\supreme-yaskin-entry.mp4` — MATCH; SHA-256 `81f19ebd2c7cca6cd0cf3bba0ccbc13d27846f32ca68869517630f46407200f1`.

- `C:\Users\Hp\Downloads\kalki 2898AD\phase3\likeness-sculpt\rollback\original-bhairava.glb` — MATCH; SHA-256 `71a91e3576920e758139df15814fb3b8371f0bb2f7b5f3e9cb7e7d916dc76314`.

- `C:\Users\Hp\Downloads\kalki 2898AD\phase3\likeness-sculpt\rollback\previous-preservation-check.json` — MATCH; SHA-256 `6502ab932a43d981ab85f2737a0434dc734b05b0a2ca5e0378d21e0ca1bc6ef7`.

- `C:\Users\Hp\Downloads\kalki 2898AD\phase3\likeness-sculpt\rollback\source-sha256.json` — MATCH; SHA-256 `e76ced0e95adc0c56ef5daa7f2a3661d21de8f23d4f474e3fc31bb8c0b6f5746`.

- `C:\Users\Hp\Downloads\kalki 2898AD\phase3\likeness-sculpt\rollback\v01-bhairava-clay-candidate.glb` — MATCH; SHA-256 `a997781461650ad8bc30a3315d2bf2b4a8580c804bf3d6d927011ef8e421eb72`.

- `C:\Users\Hp\Downloads\kalki 2898AD\phase3\likeness-sculpt\rollback\v01-bhairava-head-working-copy.glb` — MATCH; SHA-256 `043caf80e211536bd5d75700a2bb93ad26392dd8e2d65c82a3b1dfabd78e7cd5`.

- `C:\Users\Hp\Downloads\kalki 2898AD\phase3\likeness-sculpt\rollback\v01-sculpt-v01.json` — MATCH; SHA-256 `8f838b64d5c62bd3877adbf680bbea9afd1cd72b99c374799df500dc6ff20101`.

- `C:\Users\Hp\Downloads\kalki 2898AD\phase3\likeness-sculpt\rollback\v02-bhairava-clay-candidate.glb` — MATCH; SHA-256 `9d8e79efb7070cc13bbe5fd0dc998dbe36342009bc9264ef86fd5b99ec248034`.

- `C:\Users\Hp\Downloads\kalki 2898AD\phase3\likeness-sculpt\rollback\v02-bhairava-head-working-copy.glb` — MATCH; SHA-256 `a65838f8dd11d092ef573746e259177d018782ffc85fe783c97b47d91a9c6a8a`.

- `C:\Users\Hp\Downloads\kalki 2898AD\phase3\likeness-sculpt\rollback\v02-reviewed-context-copy.glb` — MATCH; SHA-256 `9d8e79efb7070cc13bbe5fd0dc998dbe36342009bc9264ef86fd5b99ec248034`.

- `C:\Users\Hp\Downloads\kalki 2898AD\phase3\likeness-sculpt\rollback\v02-reviewed-head-copy.glb` — MATCH; SHA-256 `a65838f8dd11d092ef573746e259177d018782ffc85fe783c97b47d91a9c6a8a`.

- `C:\Users\Hp\Downloads\kalki 2898AD\phase3\likeness-sculpt\rollback\v02-sculpt-report.json` — MATCH; SHA-256 `ff0d0062b0257387ef77ecef2904f0474e80dd5466089923b7694b5464ef48b5`.

- `C:\Users\Hp\Downloads\kalki 2898AD\phase3\likeness-sculpt\v07\rollback\v06-source-bhairava.glb` — MATCH; SHA-256 `f59b01ef9d55846260f135a505621c5f1bea39d9e1ef2d10254d204194253204`.

- `C:\Users\Hp\Downloads\kalki 2898AD\phase3\likeness-sculpt\v06\rollback\v05-source-bhairava.glb` — MATCH; SHA-256 `6ecd0fb267ca11b98e046468c00dac9e96d00c4bb1e2242acffd2900ac65afd4`.

- `C:\Users\Hp\Downloads\kalki 2898AD\phase3\likeness-sculpt\v05\rollback\v04-source-bhairava.glb` — MATCH; SHA-256 `f4872754fd0332f3fac5723053ef715f8dc4a347aa5339a5e99a65e8a15665fe`.

- `C:\Users\Hp\Downloads\kalki 2898AD\phase3\likeness-sculpt\v04\rollback\v03-source-bhairava.glb` — MATCH; SHA-256 `b40d9cbca34a0d10dca7901ae0d808b585d9dbf5b14ea357b9df560763bca2c2`.

Audit boundary verification: all 141 source-file bytes remained unchanged during report preparation; all47 protected files were rehashed without change. Current free space: 35.72 GB decimal. No test server or diagnostic process was started by this audit.
