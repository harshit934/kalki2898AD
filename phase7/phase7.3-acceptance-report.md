# Phase 7.3 acceptance

**CONDITIONAL PASS — isolated representative introductions work; not full production or visual/performance approval.**

## Actual evidence

Latest browser evidence: [raw results](phase7.3/browser-evaluation/attempt-1794773091020/results.json). One real Chrome session and local server, disposable context; desktop 960×540, portrait 430×932 and landscape 932×430 emulation. Normal activation was actual movement to/interacting with the hub. Boss activation used existing Mission 10 with explicitly fixture-satisfied prerequisites, followed by actual keyboard movement to its entrance, clicking its marker, cinematic playback, Skip and live combat movement. This does not prove natural boss completion or campaign progression.

Verified in this run: distant E rejected; normal marker starts one intro; held movement; duplicate prevention; cinematic Pause/Resume; delayed briefing fits portrait; natural normal completion releases hold; forward movement after handoff; restart does not reuse receipt; named boss intro; boss held before combat; late Skip releases combat and boss HUD; movement after Skip; mission exit cleanup; zero uncaught page errors. 96 unit/store/mock regressions pass. Build and lint pass (nine existing warnings).

Earlier short lateral-motion assertion failed; longer forward-motion tests passed. Exact cause of the first assertion is unresolved, not labelled fixed. Earlier boss placement fixture failed to move the player from spawn; the subsequent actual-movement route passed. Both failed attempts remain in the CSV/raw evidence. No gameplay values were reduced to force success. The earlier normal early-Skip test passed before the shot-order extension; latest-path early Skip is not represented as a fresh pass.

## Captured playable frames

![City establishing](<C:/Users/Hp/Downloads/kalki 2898AD/phase7/phase7.3/browser-evaluation/attempt-1794773091020/reference-city.png>)
![Rear player framing](<C:/Users/Hp/Downloads/kalki 2898AD/phase7/phase7.3/browser-evaluation/attempt-1794773091020/reference-rear.png>)
![Orbit](<C:/Users/Hp/Downloads/kalki 2898AD/phase7/phase7.3/browser-evaluation/attempt-1794773091020/reference-orbit.png>)
![Front character](<C:/Users/Hp/Downloads/kalki 2898AD/phase7/phase7.3/browser-evaluation/attempt-1794773091020/reference-front.png>)
![Side character](<C:/Users/Hp/Downloads/kalki 2898AD/phase7/phase7.3/browser-evaluation/attempt-1794773091020/reference-side.png>)
![Existing weapon](<C:/Users/Hp/Downloads/kalki 2898AD/phase7/phase7.3/browser-evaluation/attempt-1794773091020/reference-weapon.png>)
![World wide](<C:/Users/Hp/Downloads/kalki 2898AD/phase7/phase7.3/browser-evaluation/attempt-1794773091020/reference-world.png>)
![Deferred briefing](<C:/Users/Hp/Downloads/kalki 2898AD/phase7/phase7.3/browser-evaluation/attempt-1794773091020/reference-briefing.png>)
![Boss reveal](<C:/Users/Hp/Downloads/kalki 2898AD/phase7/phase7.3/browser-evaluation/attempt-1794773091020/boss-reveal.png>)
![Boss combat handoff](<C:/Users/Hp/Downloads/kalki 2898AD/phase7/phase7.3/browser-evaluation/attempt-1794773091020/boss-combat.png>)

Selected frames were visually inspected: existing character/weapon are visible, card leaves the centre clearer than the first version, and boss reveal uses the real existing arena opponent. Existing environment/model limitations remain visible (sparse foreground, simplified boss geometry, bright/sparse distant skyline); assets were deliberately preserved. Front/side shots frame the existing character, not newly authored facial animation. No direct video comparison, continuous no-flash/no-clipping guarantee or independently approved visual quality is claimed.

## Performance and memory

Read [performance records](phase7.3/performance-results.json) for every observed callback gap above 100 ms. Latest normal-presentation test window: 2916 rAF intervals, mean 8.7 ms, median 6.9 ms, p95 7.1 ms, p99 62.5 ms, max 319.0 ms; 19 intervals over 100 ms. This window includes deliberate pause, screenshots and responsive resizing. Overall run: median 6.9, p95 7.1, p99 34.8, max 8449.7 ms, 46 gaps over 100 ms, including loading/test actions.

These are browser callback intervals, **not rendered FPS or GPU timings**. Render cadence can differ from rAF; no stable FPS claim or shader/GC/GPU/OS root cause is established. Earlier all-stage maxima reached 12,098.9 ms; these are retained and not silently called gameplay stalls or fixed. The latest normal observation window had no multi-second callback gap, but its 319 ms maximum remains a limitation.

Latest minimum available RAM 248.1 MiB; minimum commit headroom 1602.7 MiB. No fixed 2 GB gate. Each session used a resource monitor and cleanup. Earlier runs had isolated very low available-memory samples (minimum 13.25 MiB); no OS stability claim is inferred from a passing feature test. No further browser launches are warranted for this milestone. All owned Chrome PIDs were checked absent afterward.

## Remaining checks / conditions

- Fresh natural Mission 1/Mission 10 completion, ending, reward/unlock and reload tests: **UNVERIFIED** in this task. Reward/save/combat source retained; a fixture is not completion evidence.
- Latest expanded-path early Skip; browser exit while actively playing; free-roam camera after natural completion/mission exit: **UNVERIFIED**. Existing exit behavior returns to menu; no new automatic return-to-city feature was added.
- Real audio playback/mute/volume during the new sequences: **UNVERIFIED**; lifecycle mocks pass and 8/8 audio source hashes match. No commercial clearance is implied.
- Physical mobile, complete-route collision/pose-flash inspection, sustained rendered-frame performance: **UNVERIFIED**.
- Actual 38-second recording review: **BLOCKED** by unavailable media; user authorized written order instead.

These limitations prevent a full PASS. Core normal and boss introduction paths are reviewable in staging. Do not promote or start Phase 7.4 without review.

Integrity: protected **47/47**, production **153/153**, accepted Phase 7.1 **173/173**, accepted Phase 7.2 **174/174**, Phase 6 baseline **171/171**, new rollback **174/174** match. Personal saves were not accessed or modified; their contents were not independently verified.
