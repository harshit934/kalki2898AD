# Contract replay repair

12 Nov 2026, 10:37:06 pm IST. Current requested validation recommendation: **PASS**; see the complete acceptance report.

## Reproduced cause

The settled original-source replay required 23989.0 ms from click request to duel. Maximum synchronous render call 8601.9 ms; roughly 14479.2 ms in captured slow native calls, dominated by getProgramInfoLog. Actors were ready and the cinematic was not paused; the main thread was blocked by first-use shader/program queries, rather than an established encounter or actor-readiness deadlock. No video belongs to this intro; the authored in-engine actors/camera/subtitles/chime remain.

Visible point lights changed from 23 while idle to 21 at intro: hiding Bujji removed three lights and mounting the contract added one. That invalidated already-linked lighting variants. Earlier probes also allowed entry before the renderer/real player was ready. The first two isolated light candidates failed their desktop deadline and were not applied as working fixes.

## Smallest applied repair

- GameCanvas keeps the contract point-light slot at zero while idle; three zero-intensity placeholders replace the hidden Bujji light slots only during a contract. Visible point-light count stays 24 across idle/intro/return/duel. Real light colour, intensity, range and world-origin transform are retained.
- App offers/starts a contract only after GameCanvas confirms the real avatar has rendered; readiness resets for a new round. No guessed timeout, teleport, scene reload or forced cinematic skip.
- Removed the now-duplicate contract-session light. No combat/AI/physics/damage/save/reward logic or protected assets changed. Shader error checks remain enabled. Backups and exact three-file hashes are recorded.

## Repeated actual results

- desktop, availability wait 6.0 ms: natural intro to duel 9790.0 ms; max renderer call 607.6 ms; slow shader-status calls >=4 ms: 0; Passed.
- portrait, availability wait 26.0 ms: natural intro to duel 9880.0 ms; max renderer call 584.4 ms; slow shader-status calls >=4 ms: 0; Passed.
- desktop, availability wait 38423.0 ms: natural intro to duel 10035.0 ms; max renderer call 626.3 ms; slow shader-status calls >=4 ms: 0; Passed.
- portrait, availability wait 2871.0 ms: natural intro to duel 10135.0 ms; max renderer call 588.9 ms; slow shader-status calls >=4 ms: 0; Passed.

All four fresh-context probes include full natural intros. Actual completed duel/chase/outro saves were then reloaded and their replay intros played naturally into duel on both desktop and portrait. Pause, leave and intended skip functionality were also exercised separately; skip was not the repair.

Residual first-use renderer hitches and the first desktop 38.4-second pre-availability asset wait remain disclosed. A successful timeout fix is not a zero-stutter/instant-load claim. GPU shader caches were not deleted; baseline/after diagnostic instrumentation differs. [Measurements and limitations](phase53-focused-performance-results.json).
