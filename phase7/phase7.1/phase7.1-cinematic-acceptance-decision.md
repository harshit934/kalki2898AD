# Phase 7.1 cinematic view acceptance decision

16 November 2026 (Asia/Calcutta).

**CONDITIONAL ACCEPTANCE: CINEMATIC VIEW APPROVED FOR THE GAME.**

Approved version: the original `phase7/phase7.1/staging/` implementation and its existing compiled `build/`, launched by `phase7/phase7.1/serve.mjs`. **The failed `stutter-work` performance candidate is excluded and must not replace it.** This records acceptance of the cinematic view under the user's revised criteria; it does not authorize a production merge or declare performance limitations fixed.

## Assessment of the six requested areas

1. **Appearance and suitability — approved conditionally.** The warm sandstone/Indian-architecture setting, protagonist staging and progression from environmental scale to personal framing provide a coherent opening suitable for the current Kalki game prototype. This is not movie-level/AAA visual approval: sparse horizons, repeated façades and the visible mission-hub label remain limitations.
2. **Four shots — visually effective.** Actual original-build screenshots show a broad establishing view, moving character reveal, readable face/torso/weapon close-up and rear framing that leads toward gameplay. These are playable-render captures, not concepts or mockups.
3. **Character reveal — acceptable.** The protagonist remains readable and the walking-to-guard presentation fits the scene in the inspected captures. No failed-candidate unposed-actor frame is included in this decision. Continuous animation smoothness is qualified by the retained timing interruptions.
4. **Free-roam handoff — functional and visually coherent, with a smoothness limitation.** Browser evidence confirms natural completion, released cinematic hold, free-roam activation and movement without reload/recovery. The rear composition prepares the third-person view. Perfectly seamless, frame-by-frame handoff continuity has not been proven and is not claimed.
5. **Skip, Replay and gameplay camera — verified functional.** Original-build browser results passed Skip to free roam, Settings Replay, post-cinematic movement and camera rotation/reset. Refresh/Continue also skipped the acknowledged opening without changing campaign progress.
6. **Freezes/flashes/clipping — accepted with explicit reservations.** Severe 2,275.4 ms and 3,683.8 ms callback interruptions were recorded and remain a future optimization issue. Their frequency across repeated production-like runs is not established; they are not described as proven rare or harmless. No black screen or distracting unposed-actor flash was observed in the inspected original-build captures. No obvious major camera intersection appears in those frames; full continuous no-clipping coverage remains unverified.

## Evidence and acceptance boundary

Reviewed the original visual-verification report, individual results and actual screenshots under `visual-verification/20261116-000322/`, particularly `cinematic-016s.png`, `cinematic-020s.png`, `cinematic-028s.png` and `cinematic-036s.png`. Functional evidence is `results.json` for New Game, natural completion, movement, camera controls, Replay, Skip and refresh. No new browser session or benchmark was needed for this decision review.

The earlier full visual/performance FAIL and raw measurements remain historical evidence, unchanged. This document supersedes rejection of the **original cinematic view as a whole** under the user's newly stated conditional-acceptance policy. It does not relabel failed smoothness checks as PASS. The failed optimization candidate remains rejected, including its readiness-release flash and incomplete post-fix regression checks.

## Conditions retained

- Preserve all four original shots, existing assets and visual quality; do not reduce quality to improve benchmark numbers.
- Keep the documented interruptions, continuous clipping/handoff limitations and unverified portrait/mobile coverage visible in future acceptance/release assessments.
- Any future optimization requires an isolated change and evidence that it preserves composition, character presentation, controls and progression. Do not use the rejected candidate automatically.
- No broad rewrite, production merge, additional testing cycle or Phase 7.2 work is initiated by this record.

## Integrity and availability

Fresh SHA-256 verification: **47/47 protected files, 153/153 production source/config, 173/173 original Phase 7.1 source, 171/171 original rollback, 173/173 stutter-work rollback and 171/171 Phase 6 baseline unchanged**. Evidence: `cinematic-acceptance-integrity.json`. No production/assets/audio/campaign/save edits; personal profiles/saves not accessed. No browser/server launched.

Existing launch command from the project root:

```powershell
node phase7/phase7.1/serve.mjs
```

Use the printed loopback URL in a disposable profile for staging review. The approval is recorded; stop here. **Phase 7.2 has not started.**
