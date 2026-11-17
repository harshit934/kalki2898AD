# 5H.27 acceptance checklist

Date: 15 November 2026. Decision: **CONDITIONAL PASS — desktop, one-event staging only.**

## Five previously UNVERIFIED checks

1. **Physical Android/iOS playback — UNVERIFIED.** Fresh host inspection found no accessible Android target or ADB in the checked locations. No physical-device test was performed. Browser emulation does not resolve this item. Evidence: `milestone5H27/device-availability.json`.
2. **Pronunciation, emotional suitability and commercial rights — UNVERIFIED.** No new listening or documentary rights evidence. The user's temporary prototype acceptance remains applicable; it does not establish independent language verification or production distribution permission.
3. **Full browser-restart persistence without reseeding — PASS, newly resolved.** A new disposable persistent Chrome profile was seeded once from the actual earned 5H.26 Mission 1 test save. The browser was fully closed, then relaunched against the same origin/profile with no reseeding or storage writes after relaunch. Campaign JSON and audio settings matched exactly. This tests restart persistence, not a new natural playthrough in that profile. Evidence: `milestone5H27/browser-results.json` and `restart-persistence.mjs`.
4. **Broader boss/victory/emotional voice-event coverage — UNVERIFIED / not integrated by design.** Only the authorized first-movement Mission 1 event is connected. Standalone five-category playback is not proof of five-category gameplay integration. Adding events would exceed this audit.
5. **Mission 2 runtime regression — UNVERIFIED.** Mission 2 was not launched. Mission 2 unlock persistence and source/gate isolation are verified; neither proves Mission 2 runtime behavior.

## Required desktop staging checks

Fresh browser checks PASS: gesture initialization with no autoplay, Skip, replay, twenty rapid movement inputs retaining one event identity, mute/unmute, volume, actual HTTP 404 fallback, pause/resume, and full browser restart persistence.

Reviewed and reused unchanged-candidate evidence PASS: natural Mission 1 patrol/boss/relic/ending sequence; rewards 2,500 + 750; Mission 2 unlock and page reload; restart and exit; unrelated Bujji HUD preservation; victory guidance cleanup; 17 controller tests; 9 eligibility tests; native rapid-trigger overlap guard.

The final CSV records **21 assessment rows: 17 PASS, 0 FAIL, 4 UNVERIFIED**. These are grouped assessment rows, not 21 new gameplay runs. Every row identifies fresh versus reused evidence and its limits.

Integrity PASS: 47 protected hashes before and after, 940 existing snapshot files unchanged, four rollback comparisons matching. Personal save profiles were not accessed. See the rollback verification report.
