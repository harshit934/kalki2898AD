# Phase 5.3 â€” Mission 1 implementation and validation

This phase extends the existing React/R3F game. It does not replace the engine,
create additional placeholder missions, or authorize another development phase.
Final test status is recorded in `phase53-gameplay-test-results.json`; frame-time
measurements are recorded separately in `phase53-performance-results.json`.

## Implemented mission

Mission 1 opens with a 26.5-second in-engine riverfront arrival. Its original
Telugu and English subtitle exchange introduces the route and Bujji. The same
playable world remains behind the cinematic, and control returns to the existing
player controller. Pause, resume and skip remain available.

The route includes exploration, three existing patrol encounters, moving hazards,
crystals and three optional Bujji relay interactions. Relays require proximity and
an R-key or touch-button action; they reject duplicate and remote scans. They are
optional intelligence, not invented mandatory rewards. The Warden encounter now
requires defeating all three patrols. Its established damage, phases, guard,
dodge, defeat and relic rules remain in use. Collecting the relic starts an
original 10.5-second in-engine closing sequence before the victory interface.
Completion survives the HUD's cinematic unmount through transient story state.
Campaign rewards retain their existing persistence format.

## Milestones

- A: Authored riverfront architecture, four-sided facades, ghats, shrine, entrance
  torana, pavilions, vegetation, utility details and water; existing PBR surfaces
  and real shadow rendering retained.
- B: Reversible presentation layers on the cloned Bhairava model: curved segmented
  costume, procedural surface relief, hair strands and restrained facial posing.
  Existing walk/run/jump/hit clips remain; dodge and attack body accents extend
  the existing controller. This is not a new facial performance capture or groom.
- C: Rigged presentation for all patrols, readable wind-up indicators, patrol
  completion gate, authored Warden body/legs/weapon and arena relief architecture.
  Existing functional light/heavy/combo/defensive systems remain authoritative.
- D: Original layered mechanical companion model, reactive optics and orientation,
  proximity relays and temporary briefings. Existing Mission 2 chase preserved.
- E: Original in-engine opening and ending; subtitle timing and camera keyframes.
- F: Existing relic, victory, reward and save integration, with new story state
  kept outside persistent campaign data.
- G: Production build, lint, protected hashes, ordinary-input regression and
  repeated frame-time measurements, with limitations reported rather than hidden.

## Voice and reference handling

The user explicitly chose to leave missing lines unvoiced unless original or
licensed recordings are verified. New Mission 1 dialogue is therefore subtitled.
Mission 1 blocks legacy voice recordings without verified distribution metadata.
No movie audio or footage was added to the playable mission. Selected movie
stills and subtitle timing were studied privately; this was not a complete film
or Telugu vocal-performance analysis. The private `reference-only` directory is
outside `public` and must be excluded from distribution and evidence packages.
Pre-existing protected media elsewhere in the project remains unchanged; this
report does not claim whole-project distribution clearance.

## Acceptance boundaries

An end-to-end functional pass does not establish cinematic-reference visual
parity or stable 1080p performance. See the visual report for remaining artistic
limitations and the performance JSON for every measured maximum and censored
boundary. Physical mobile performance is unverified. Severe historical stalls
remain an open platform risk unless explicitly reproduced and resolved by
timestamp-correlated evidence; no such root-cause repair is claimed here.

The five requested reports, screenshot pairs, fresh 47-file verification and
final regression results are delivered. No next phase or automatic diagnostic
phase is started. Functional validation has passed; visual and performance
acceptance remains conditional on the limitations documented here.

## Evidence and handoff

- [Functional tests and raw result records](phase53-gameplay-test-results.json)
- [Repeated before/after timing measurements](phase53-performance-results.json)
- [Visual review and screenshot pairs](phase53-visual-quality-report.md)
- [Source changes, new assets and protected hashes](phase53-changes-and-hashes.json)

All four final mission runs passed with keyboard or emulated touch input,
including relic collection, saved completion and reload. An additional complete
Mission 1 run scanned all three optional relays. A genuine completed test save
was restored into an isolated context to verify the replay menu action, reset
patrol/relay state and preservation of earned rewards. The two-layout Bujji
contract/chase regression passed. Both layouts exercised Full, Compact and
Minimal HUD modes; separate display-only health/score/boss fixtures are clearly
identified in the results and are not counted as real combat completion.

Recommend reviewing the new playable mission and screenshot pairs before
granting art acceptance. Do not label the game stable 1080p or cinematic-reference
quality. The transient arena-entry camera obstruction and remaining material,
groom and facial-animation limitations need further focused polishing for that
standard. The historical Windows/browser/GPU blocking chain remains unresolved;
this implementation phase does not claim to repair it.

## Final measured performance comparison
All figures below are pooled completed render intervals from three windows per route. Per-repeat values, all maxima and censored boundaries remain in the performance JSON.
- Before, m1-exploration: 30.00 average FPS; p50 34.6 ms; p95 35.3 ms; p99 35.9 ms; maximum 41.8 ms; largest censored boundary 25.5 ms.
- Before, m1-combat: 30.00 average FPS; p50 34.5 ms; p95 39.9 ms; p99 48.0 ms; maximum 63.2 ms; largest censored boundary 22.7 ms.
- After, m1-exploration: 30.00 average FPS; p50 34.6 ms; p95 35.4 ms; p99 36.0 ms; maximum 39.8 ms; largest censored boundary 22.7 ms.
- After, m1-combat: 29.96 average FPS; p50 34.6 ms; p95 40.6 ms; p99 47.5 ms; maximum 75.5 ms; largest censored boundary 30.8 ms.

These measurements do not resolve the historic blocked-wait chain. Conditional review is appropriate; unconditional production-quality or stable-1080p acceptance is not claimed. The original earlier baseline also contained a 2,427.3 ms combat stall and remains in the JSON. No next phase is started.
