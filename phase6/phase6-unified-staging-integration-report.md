# Phase 6 unified staging integration

**Automated integration PASS; browser acceptance BLOCKED.** New implementation: `phase6/unified-staging/staging/`. New untouched rollback: `phase6/unified-staging/rollback/`. No production merge.

## Combined implementation

The free-roam copy already descends from the cinematic-opening copy, which descends from 5H.40. Used it as the base, retaining cinematic → bounded exploration → hub → Mission 1 and existing gameplay audio hooks. Added the expanded 5H.28 voice adapter naturally exercised in 5H.29. Previous standalone, accepted fallback and rollback copies remain unchanged. Reviewed the cinematic/free-roam reports, 5H.22/23 prototype acceptance, 5H.30 consolidation and 5H.38/39/40 controller evidence.

Compatibility issue: Bhairava previously created independent HTML audio while game dialogue used WebAudio. New sharedVoiceAudio adapter routes the existing prototype controller through the central dialogue bus, preserving text fallback, Skip and replay without a second audio player. Added five fixed evaluation-only voice slots, central Skip forwarding and active-event identity so stale cleanup cannot stop newer boss speech. Boss event priority 40 exceeds voice boss 35, combat 25 and other prototype categories 30. Existing cooldowns, duplicate guards, music continuity/ducking, cinematic ownership, mute and bus volumes remain.

App enables narration only in Mission 1 outside exploration/cinematics. Existing calm, low-health, boss and recorded-victory eligibility and stale-guidance cleanup are retained. The serious sample is available to the controller but has no invented automatic gameplay trigger. No campaign completion, reward, unlock, save schema or combat logic was changed.

## Executed validation

- **60/60 checks PASS:** 30 controller/actual-JavaScript-handler checks; 12 exploration state checks; 10 opening persistence/configuration checks; three deferred-entrance checks; five shared voice/controller checks. Fresh playback tests use mocks, not audible browser playback.
- Shared tests execute all five categories, Skip/replay, natural end, boss preemption, no overlap, music continuity, rapid duplicate events, pause/cinematic/exit cancellation, mute/volume and missing-file fallback.
- Build PASS: 734 modules. Public asset copying disabled; launcher serves existing assets read-only. Build directory is not a self-contained distribution. Existing large-chunk warning remains.
- Lint PASS: zero errors, nine existing warnings.
- Initial bridge tests exposed failed playback incorrectly labelled ended; corrected in this new adapter. Initial build/lint found duplicate imports from interrupted preparation; corrected in the new copy. First-attempt logs/results preserved; final outputs in `unified-staging/test-summary.json` and per-suite JSONs.

Browser preflight: 696,414,208 bytes available physical RAM; 5,877,977,088 bytes commit headroom. Below existing 2 GB physical RAM gate. **No browser/server launched.** No unified playthrough, visual, mobile, FPS or latency acceptance claimed. Earlier browser evidence remains historical, not proof of this merged build.

## Integrity and rollback

Fresh SHA-256: **47/47 protected**, **153/153 production source/config**, **475/475 selected production/prior-source snapshot files**, **163/163 new rollback files**, **5/5 source voice WAVs** match. Exact 12 new/modified staging paths and hashes: `unified-staging/integrity-results.json`. Production and previous snapshots were not edited. Personal profiles/saves not accessed; their contents are not independently certified.

Only new unified-staging files and this report created. No audio generated/copied/extracted, model/dependency installation, paid service, credential access or purchase. Rollback requires no production restoration: retain/leave this copy and use untouched prior staging. No copy-back authorized. All test/build/lint processes exited; no browser/server started.

## Remaining blockers

1. Actual unified browser run after RAM gate passes: opening/exploration/camera, hub launch, live audio lifecycle, reload, natural ending/rewards and representative performance.
2. Commercial voice/output rights and independent Telugu quality remain unresolved; temporary prototype acceptance only.
3. Kalki movie dialogue/theme remain BLOCKED. Original wind ambience tests the background channel; it is not a soundtrack.
4. Physical Android remains unverified; no new mission voice coverage or campaign expansion.

Launch and rollback instructions: `unified-staging/README.md`. Stop after isolated integration; no production approval.
