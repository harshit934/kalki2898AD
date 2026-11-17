# Phase 7.4 acceptance

## Offline combat verification and focused correction — 2026-11-16

**Offline verification: PASS after one focused Scout correction pass. Overall Phase 7.4: BLOCKED pending actual browser gameplay/visual acceptance.**

No browser, Playwright, development/static server or full game was launched. Node tests exercised CPU Three.js objects, actual loaded soldier animation clips, extracted component effect/frame bodies and disposable in-memory stores. These are not rendered-gameplay results. Earlier resource-blocked attempts remain below and are not relabelled as passes.

### Confirmed defects and correction

1. **Scout procedural bones were unbound.** The installed GLTFLoader sanitizes node names through PropertyBinding.sanitizeNodeName. The actual soldier asset loads `mixamorigRightArm`, `mixamorigSpine2` and `mixamorigLeftLeg`; the old colon-containing lookups returned null. This prevented the added arm/spine/knee offsets from reaching the loaded bones. Corrected only `phase7/phase7.4/staging/src/game/RiggedEnemy.jsx` (import and bone bindings, lines 6/47) to use the loader's normalization. Actual-loader regression failed before and passes afterward.
2. **Scout strike lunge mixed world and local X.** The visual model is a child of the translated physics body. Assigning current.x to its local position applied the world translation twice; a CPU scene graph reproduced parent -7 / local -7.24 / world -14.24 instead of world -7.24. Corrected `phase7/phase7.4/staging/src/game/CombatEnemies.jsx:641` so upgraded Scout uses only the existing bounded directional 0.24 offset. Physics, damage and attack times are untouched. The non-selected enemy expression is unchanged.

Both repairs were made in **one focused Scout connection/transform correction pass**, with no subsequent redesign or optimization cycle. Original affected files are preserved in `offline-verification-20261116/before/`; the original 178-file rollback is unchanged. [Before regressions](phase7.4/offline-verification-20261116/connections-before.json) retain two FAIL findings; [after regressions](phase7.4/offline-verification-20261116/connections-after.json) show all four PASS.

### Verified through code and automated tests

**Scout**

- Existing soldier GLB parses with the installed GLTFLoader on CPU. Geometry/skin hierarchy and real Idle, Walk, Run and TPose channels are present; there are no separately authored attack, hit, stagger or defeat clips. Embedded JPEG texture decoding was deliberately stubbed for this test.
- Actual RiggedEnemy effect/frame logic selects Idle/Walk/Run, uses Idle plus procedural attack offsets, applies confirmed-hit recoil/material flash and the bounded defeat knee pose. A 500-frame comparison against the same mixer with neutral offsets showed no cumulative pose drift in the tested case.
- Parent defeat code stops movement presentation, disables the wind-up ring and hides the model at its existing lifetime. This is procedural visual recoil/stagger, not a new gameplay stun mechanic. Armour geometry and 2.1-unit normalization settings remain unchanged; proportions/skin appearance were not visually approved.
- Owned material cleanup restores source references, disposes clones once and stops/uncaches mixer actions. The existing source maps remain shared rather than modified.

**Warden**

- Body, leg and weapon GLBs exist with valid geometry/material references and local Draco decoder files. They contain material-defined finishes, no embedded texture maps and no authored animation clips. Warden geometry decoding/rendering was not exercised.
- Actual MissionOneWarden frame logic connects existing attack telegraph timestamps to bracing, weapon strike/recovery, hit recoil, speed-driven leg stride and defeat joint collapse. Existing parent fall/shrink/defeat readiness logic remains unchanged.
- Actual CombatWardenPart clone/disposal logic was exercised on CPU mesh/material fixtures, including material arrays: owned clones disposed once, shared geometry/textures preserved. Warden implementation was not edited in this pass.
- Actual boss stores accept damage only after fight activation; health, hit timestamp, phase transition, effects, attack clearing and defeat state update correctly. GameHud source still reads authoritative boss/player health and values; pixel readability remains unverified.

**Integration and gameplay contracts**

- The extracted existing player target-dispatch branch was tested with actual authoritative stores: basic damage routes to Scout only; heavy damage routes to Warden only; unknown targets and held gameplay do not generate a landed hit. This does not test live input, range/facing/LOS physics or blade contact.
- In-memory Scout defeat/score is idempotent. In-memory Warden defeat/relic fixtures retain **2,500 + 750** rewards, Mission 2 unlock and duplicate protection. No natural mission completion, ending playback, browser save write/reload or personal-save verification is inferred from these fixtures.
- Player controller, keyboard/mobile controls, combat state, boss rules, campaign/save schema, HUD and audio source are unchanged. Unlimited sprint remains; no stamina added.
- All **506 literal relative imports** resolve. Four target GLB references and local decoder files pass offline checks. Dynamic paths outside these targets and runtime decodes are not exhaustively validated.
- No native listener/interval/requestAnimationFrame registration was introduced in the inspected presentation components. The actual enemy controller mount/unmount effect balances creation/removal and runtime registration in repeated mocked-world lifecycle tests. React/R3F mount behavior itself was not run.

### Test/build results

**141/141 final automated checks PASS**: 109 existing regressions plus 32 focused connection, component, asset and event checks. No final test failure. The two pre-fix regression failures remain preserved as history.

- [Suite summary](phase7.4/offline-verification-20261116/summary.json)
- [CPU component results](phase7.4/offline-verification-20261116/component-results.json)
- [Combat event/store results](phase7.4/offline-verification-20261116/event-results.json)
- [Asset/import results](phase7.4/offline-verification-20261116/asset-results.json)
- [Command results](phase7.4/offline-verification-20261116/command-results.json)
- [Build log](phase7.4/offline-verification-20261116/build.log): PASS, existing large-chunk warning.
- [Lint comparison](phase7.4/offline-verification-20261116/lint-comparison.json): PASS, **12 existing warnings, zero new warnings/errors**.

The pre-fix compiled staging build is backed up in `offline-verification-20261116/before-build/`. A fresh offline build passed, then the isolated Phase 7.4 compiled candidate was refreshed; its index matches the validated build. Old raw test evidence was not overwritten. No production build or other staging was replaced.

### Still unverified / browser acceptance required

- Scout/Warden appearance, textures/materials under real lighting, silhouette/readability and skin/weapon alignment.
- Fluidity and timing as perceived during actual walking, running, attacks, recoil, stagger and defeat. GPU skinning, pose flashes, clipping and complete camera/arena presentation.
- Actual keyboard/touch movement, dodge, jump, input latency, hit range/facing/LOS and combat feel; live HUD readability across desktop/portrait/landscape.
- Natural encounter completion/ending, rewards persistence and reload in disposable browser data.
- Rendered frame times, GPU/CPU memory and whether the previous Windows resource blocker is improved. No FPS or memory improvement is claimed.
- GPU lifecycle remains UNVERIFIED: CPU tests do not create skeleton bone textures. RiggedEnemy cleanup has no explicit Skeleton.dispose call; potential GPU-resource lifetime needs separate verification, and no leak-free guarantee or causal connection to RAM failures is claimed.
- The inherited world/local lunge expression remains in non-selected enemy paths; this controlled correction did not expand to other opponents.

### Integrity and preservation

Fresh streamed SHA256 verification: **47/47 protected assets**, production **153/153**, original rollback **178/178**, Phase 7.1 **173/173**, Phase 7.2 **174/174**, Phase 7.3 **178/178** and Phase 7.5 **182/182** match. Within Phase 7.4, **179/181 source files match the pre-pass snapshot; only the two intended Scout connection files changed**. [Integrity record](phase7.4/offline-verification-20261116/integrity-results.json). Warden, assets, saves and all previous-phase code remain unchanged. Phase 7.5 was preserved and does not automatically inherit this later Phase 7.4 correction.

Personal profiles/saves were not opened, read, copied, hashed or modified. Test completion/reward records existed only in Node memory. All test/build/lint processes finished; no browser/server process was started in this pass. Stop after this report. **No full Phase 7.4 acceptance or production promotion.**

---


## Post-restart readiness check — 2026-11-16

**Final classification: BLOCKED at preflight. No browser or server launched.**

Read the latest acceptance and implementation records, confirmed the existing staging copy and rollback, and performed fresh read-only integrity verification. No Scout/Warden implementation file was edited, rebuilt or redesigned; no correction was attempted.

### Resource evidence and launch decision

Initial available physical RAM: **489 MiB** of 7,518 MiB; commit headroom: 6,674 MiB. Three subsequent read-only samples, around 09:25 IST, showed **266 → 230 → 522 MiB** available physical RAM, with commit headroom **6,375 → 6,385 → 6,735 MiB**.

Commit capacity improved after restart, but physical headroom remains low and variable. The previous minimal browser attempt lost about 389 MiB of available physical RAM while loading. The current low sample cannot cover that observed demand; even the final sample would leave only about 133 MiB under an equivalent loss, close to the existing emergency stop boundary and without a stable safety margin. This is a workload-specific safety judgment, not an arbitrary 2 GB rule or a claim that Windows has already crashed.

Per the user's instruction to stop before launching if memory is insufficient or unstable, **no browser/server was started and no repeated retry occurred**. Existing user applications were not terminated. No current-task test processes require cleanup. [Recorded preflight](phase7.4/post-restart-preflight-20261116/memory-preflight.json).

### Acceptance status

All requested Scout appearance/animation/contact/reaction/stagger/defeat checks remain **BLOCKED**. All Warden appearance/telegraph/contact/hit/health checks and live movement/attack/dodge/jump checks remain **BLOCKED**. No new gameplay images, listening judgments, visual approval or frame-rate results were produced. The prior 109 automated PASS results and prior build/lint results remain historical evidence only; they were not rerun or substituted for live validation.

### Fresh preservation verification

- Current candidate source: **181/181 unchanged** against the preserved pre-test manifest.
- Phase 7.4 rollback: **178/178 match**.
- Protected assets: **47/47 hashes match**.
- Production: **153/153 match**.
- Phase 7.1: **173/173**, Phase 7.2: **174/174**, Phase 7.3: **178/178 match**.
- Personal saves/profile: not accessed or modified. No production promotion.

[Fresh integrity evidence](phase7.4/post-restart-preflight-20261116/integrity-results.json). The previous acceptance report is preserved in the same evidence directory. Stop here; a safer memory state is needed before actual browser combat acceptance can resume.

---


## Resumed browser acceptance — 2026-11-16, Asia/Calcutta

**Final decision remains BLOCKED. No implementation correction was made.**

Read the existing implementation/acceptance reports and verified the preserved staging and rollback. A fresh source manifest captured all 181 candidate files before testing; all 181 still match afterward. No staging implementation file was modified.

### Single minimal browser attempt

Preflight: 516 MiB available physical RAM, 969 MiB commit headroom. One real Chrome instance, one disposable context/session and one local server at 1280×720 were used. Existing graphics settings were unchanged. Disposable opening/exploration presentation flags bypassed already-tested intro/free-roam loading; no mission completion/reward records or personal saves were seeded. A separate diagnostic build from the unchanged current source was compiled because the old diagnostic bundle predated the preserved defeat-pose update; no production build or implementation was rewritten.

The resource monitor started with 399.2 MiB available RAM. The minimum observed was **10.4 MiB**; the last sample was 13.5 MiB. Minimum commit headroom: 751.5 MiB. Three consecutive physical-memory samples were below 128 MiB, triggering the existing resource-aware safe stop. This was not a fixed 2 GB launch restriction. No further launch was attempted.

### Actual test results

- Scout appearance/contact/hit reaction/stagger/defeat: **BLOCKED**, not reached.
- Warden appearance/telegraphs/contact/hit and health feedback: **BLOCKED**, not reached.
- Live movement/dodge/jump/attack acceptance: **BLOCKED**, not reached.
- Screenshots or combat recording: **unavailable**; no combat scene was reached and no visual-quality judgment was made.
- Sustained performance/FPS: **unmeasured**; no attribution of memory pressure to the new visual code is justified.
- No gameplay implementation defect was established. The closed-page test error followed the monitor's browser shutdown; it is not classified as a combat failure. No correction/retest cycle was used.

Previous 109 automated PASS results, production-style build PASS and lint PASS with 12 inherited warnings remain historical evidence; they were not needlessly repeated and are not substituted for browser acceptance.

[Raw attempt](phase7.4/resume-evaluation/attempt-1794775818360/results.json), [memory samples](phase7.4/resume-evaluation/attempt-1794775818360/memory.jsonl), [summary](phase7.4/resume-evaluation/summary.json), [fresh integrity verification](phase7.4/resume-evaluation/integrity-results.json).

### Safety and preservation

Protected hashes **47/47**, candidate source **181/181**, rollback **178/178**, production **153/153**, Phase 7.1 **173/173**, Phase 7.2 **174/174** and Phase 7.3 **178/178** match. Hashing used sequential 64 KiB streams rather than loading large protected assets into memory. Personal profiles/saves were not opened, copied, hashed or modified. Existing working implementation, prior evidence and rollback snapshots are preserved.

Harness finally-cleanup records the test browser, local server and resource monitor stopped. No unrelated application or manually launched server was terminated. No production promotion or additional enemy/boss work. The blocker remains insufficient memory headroom during actual scene initialization; user-side resource relief is needed before another browser test can be considered.

---


**BLOCKED — not passed or conditionally accepted.** The isolated implementation exists, but required actual enemy/boss gameplay and visual acceptance could not be completed safely.

## Evidence

- [Automated results](phase7.4/combat-visual-results.json): 13 new presentation checks PASS; 96 inherited regression checks PASS. They verify bounded pose/contact timing, no fabricated hit flash, recovery/defeat envelopes and unchanged gameplay contracts. They do not establish appearance, animation quality or actual hit detection.
- [Build](phase7.4/build.log): PASS; existing large-chunk advisory. [Lint](phase7.4/lint.log): PASS with 12 inherited warnings, zero new errors/warnings; matched against rollback.
- [Actual browser attempt](phase7.4/browser-evaluation/attempt-1794775184732/results.json): BLOCKED before combat. No mocked test is presented as actual gameplay proof. No new combat screenshots exist.

## Exact resource blocker

Read-only preflight before browser preparation observed about 594 MiB available physical RAM and 1,350 MiB commit headroom. At monitor start available RAM was 405.9 MiB. It fell to **60.5 MiB**; three consecutive samples were below 128 MiB. Minimum observed commit headroom was 848.5 MiB. The monitor triggered: **Available physical RAM below 128 MiB for three samples**. [Resource samples](phase7.4/resource-results.json).

This was a resource-aware execution stop, not a fixed 2 GB launch gate and not evidence that the visual changes caused the pressure. The browser/server were closed safely. No retry, process killing of user apps, cache deletion or dependency change was attempted. No Windows-crash claim or unmeasured FPS claim.

## Required live checks still blocked

1. Scout and Warden appearance in normal gameplay cameras.
2. Player basic/heavy attacks connecting; nonfatal hit reactions and damage confirmation.
3. Readable anticipation, execution and recovery in motion; visual stagger/defeat timing.
4. Boss damage/phase/defeat presentation and arena composition.
5. Health HUD readability plus keyboard/touch movement, dodge, jump and attack regression. Unlimited sprint is preserved in source; there is no stamina mechanic to validate.
6. Desktop and portrait/landscape clipping/occlusion, including existing staging voice overlays.
7. Actual rendered-frame distributions, severe gaps, draw-call/memory costs and responsive combat.

The browser harness includes actual keyboard attacks and an explicitly labelled disposable prerequisite fixture for the two non-selected patrols. Because execution stopped before that stage, none of its combat assertions ran. No natural Mission 1 completion, reward/unlock or personal-save validation is claimed.

## Remaining implementation/quality risks

- Existing soldier has no authored attack/hit/stagger clips. Procedural offsets need in-motion review for shoulder/weapon alignment and animation blending.
- Existing Warden remains an assembled mechanical design; material/panel changes do not prove target-quality production art. No actor or environment replacements.
- Feedback is attached to confirmed target damage, not precise blade-surface intersection. Existing gameplay hit/LOS timing is unchanged.
- Existing character fall/shrink presentation remains beneath the added defeat pose. Its final composition is unverified.
- Arena improvements are bounded material/composition refinements, not a world redesign.
- Existing performance and prototype-audio/commercial limitations remain open; no movie media was added.

## Integrity and decision

47/47 protected hashes match. Production 153/153, Phase 7.1 173/173, Phase 7.2 174/174, Phase 7.3 178/178, Phase 6 baseline 171/171, and new rollback 178/178 match. All eight staging audio implementation files match. Personal saves/profile were not accessed or modified; their content is not independently verified.

Owned test Chrome PID 15996 is absent; harness server and memory monitor stopped. All test/build/lint processes completed. No source or assets promoted. Stop here with staging preserved; resume required combat checks only when resources are safe. No further enemy/boss expansion.
