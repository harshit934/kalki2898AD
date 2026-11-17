# Phase 6 Milestone 5H.27 — final Bhairava staging acceptance audit

Date: 15 November 2026.

**Final decision: CONDITIONAL PASS.** Desktop acceptance is supported for the unchanged, isolated **single-event Mission 1 staging prototype**. This is not production integration approval, commercial rights clearance, physical-mobile approval, or acceptance of broader voice-event coverage.

## Candidate and evidence reviewed

Staging: `phase6/milestone5H24/staging/`, launched through the existing `phase6/milestone5H24/server.mjs`. The production environment remains unchanged; Kashi remains opt-in. No production source, audio, dialogue drafts, listening scorecards, rewards, progression logic or personal saves were modified.

Reviewed the 5H.22 implementation report, 5H.23 acceptance results, 5H.24 integration/rollback reports, 5H.25 natural-playthrough results and CSV, and 5H.26 bugfix, regression CSV and raw evidence. The exact five outstanding items are reconciled in `phase6-milestone5H27-acceptance-checklist.md`.

The authorized event remains `mission-1:<roundId>:first-movement-guidance`: first eligible movement after user interaction, while patrol guidance is current. Only the existing calm sample is attached. The standalone five-category prototype remains available and unchanged.

## Fresh tests

Chrome 157.0.8103.51, desktop 1920×1080, isolated loopback staging server and a new disposable persistent browser profile. No physical Android target was accessible.

Seven grouped browser checks passed: initialization after real interaction and no autoplay; Skip/replay; twenty rapid movement inputs deduplicated; mute/unmute and volume; actual missing-file/404 fallback; pause/resume cleanup; full browser-close/relaunch persistence. There were no recorded browser errors. Evidence: `milestone5H27/browser-results.json`; executable procedure: `milestone5H27/restart-persistence.mjs`.

The restart test initially imported the actual earned 5H.26 save **once** into the new disposable profile. Following full browser closure it reopened the same profile and origin without reseeding. Exact campaign JSON retained Mission 1 completion, Mission 1/2 unlocks and boss/relic rewards of 2,500/750. Audio settings retained volume 0.27 and muted=false. This resolves restart persistence; it does not claim a fresh natural completion in the restart-test profile.

## Natural Mission 1 and lifecycle evidence reused

Because staging and the controller remain unchanged, valid 5H.26 actual gameplay evidence was reused rather than repeating a full mission unnecessarily. `milestone5H26/raw-results.json` records ordinary-input exploration, three patrols, the 720-HP boss, relic collection and the unskipped natural ending `kashi-contract-return`, returning to victory. The recorded run reached the relic in 58.788 seconds, finishing with 56.1 HP, score 4,350 and three crystals. Actual rewards were boss 2,500 plus relic 750, with Mission 2 unlocked and persisted on reload.

The old 5H.25 stale-guidance defect is not counted as a current failure. The 5H.26 candidate removes obsolete patrol voice guidance when the context becomes invalid. Its actual victory evidence shows no stale panel/Replay and inactive voice while legitimate victory content remains. Source lifecycle and unchanged-candidate hashes support reuse. Evidence: `milestone5H26/mission-completion.png`, `ending-natural.png`, `raw-results.json`.

Restart, mission exit, unrelated Bujji HUD messaging and damage while dialogue plays are supported by `milestone5H26/raw-results.json` and `overlap-exit-results.json`. Controller 17/17 and gate 9/9 results are historical reviewed results, not newly executed unit suites. The unchanged controller's native 30-trigger test previously recorded a peak of one playing audio element; fresh staging movement deduplication also passed. No evidence is presented as newly run when reused.

## Results and remaining limitations

`phase6-milestone5H27-final-test-results.csv`: **17 PASS, 0 FAIL, 4 UNVERIFIED**, across 21 grouped assessment rows. Fresh browser, historical gameplay and integrity evidence are explicitly distinguished.

Remaining limitations:

- Physical Android/iOS audio and hardware behavior remain UNVERIFIED. No accessible device was found; emulation cannot substitute.
- Telugu pronunciation, expressive suitability and commercial distribution rights remain UNVERIFIED. Temporary prototype acceptance does not complete the original listening scorecard or establish rights.
- Boss/victory/emotional gameplay voice events remain unintegrated by design. The acceptance applies to one event, not a complete mission voice catalogue.
- Mission 2 runtime was not tested. Unlock persistence and eligibility isolation pass, but are not runtime evidence.

No new sustained-performance benchmark was performed. This bounded acceptance audit does not establish stable 30 FPS or resolve previously documented portrait or transition stutters. No new models, audio, packages, missions or events were introduced.

## Integrity and cleanup

Fresh SHA-256 verification: **47/47 protected files match before and after**. The existing 940-file audit snapshot is unchanged. All four inspected rollback sets match (151, 26, 26 and 159 files). See `phase6-milestone5H27-rollback-verification.md` and its JSON evidence.

Personal saves were not accessed; all browser writes occurred in the new disposable staging profile. Preservation by isolation is not a claim of independently inspecting personal-save contents.

Both test browser sessions and the staging server were closed. Final matching owned staging/test Node process count: zero. Existing samples, prior reports, raw logs, standalone prototype and rollback points remain preserved.

## Acceptance boundary and next action

Accept desktop one-event staging conditionally, retaining the four limitations above. There is no observed failed required desktop check in the reviewed candidate. Full unrestricted PASS is not supported. Review this report before any further authorization; no production integration or scope expansion has begun.

New files are limited to these four deliverables and `phase6/milestone5H27/` audit scripts, JSON evidence and the disposable test profile. No source rollback action is required. Stop after this report and await user review.
