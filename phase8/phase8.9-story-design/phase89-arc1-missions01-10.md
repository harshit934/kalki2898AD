# Phase8.9 — Arc 1: Contracts and ambition

Missions 1–10. Historical arc label: Kashi contracts. New grouping purpose is proposed design, not a source-data rewrite.

## Design status and shared lifecycle

This is STORY DESIGN ONLY, dated 2026-11-17. Every task arrangement below is proposed ORIGINAL GAME CONTENT unless a specific approved anchor is identified. A complete design is not an implemented or accepted mission. Historical source data, runtime IDs, rewards, saves and staging builds are unchanged.

Each introduction uses the existing Phase7 cinematic-director architecture as a future dependency: mission-specific scene framing, title, objective and supported story context; Skip safely returns control; replay changes neither progress nor rewards; Continue resumes a valid active checkpoint without unnecessarily replaying the introduction; explicit Restart replays it. Narrative Skip may resolve its own presentation beat, never fabricate combat victory, prerequisite history or unrelated objectives. Restore gameplay camera and keyboard/mobile control, pause safely, and clean up on exit. No new controller or permanent save authority is proposed. Mission completion requires the explicit conditions below; future implementation must preserve existing reward authority and grant rewards only once.

All new spaces below are proposed subareas or reuse of existing location families, not claims of implemented environments. Cast lists are story-design roles, not claims that models, voices, animations or NPC interactions exist. Use text or approved non-voice presentation where necessary; no cloned voice or movie audio.


## Mission 1: A BOUNTY IN THE DUST

1. **Number, ID and title:** 1; `mission-1`; A BOUNTY IN THE DUST.
2. **Story arc:** 1 — Contracts and ambition.
3. **Location:** Kashi salvage road.
4. **Main playable character:** Bhairava. No automatic mid-duel character switching.
5. **Characters involved:** Bhairava; Bujji.
6. **Story purpose:** Establish a hunter who measures success in paid work.
7. **Opening cinematic:** Wide dusty road; Bujji points to three salvage glints. Display this mission's title and the objective below, then hand off to the existing third-person camera. Apply the shared Skip/Replay/Continue/Restart policy.
8. **Main objectives:** Accept the local contract; verify three crystals; clear the existing encounter and recover the relic.
9. **Exploration or investigation:** Compare the salvage relay with the marked claim.
10. **Combat encounters:** Existing patrol roles and local Warden; not an arc finale.
11. **Boss encounter:** No arc-finale boss. Any local encounter explicitly listed above retains its existing identity; no extra boss is implied.
12. **Character development:** Practical partnership, not early selfless redemption.
13. **Consequences:** Payment creates confidence to pursue better work.
14. **Completion condition:** Contract checks, real local boss defeat and relic recovery recorded once. Require legitimate prerequisite progression through the existing first-time flow. Save through existing campaign authority with idempotent rewards; no fabricated completion history.
15. **Next mission connection:** Mission2 — THE GLASS WASTES. Show that access and earnings require reading hostile infrastructure.
16. **Evidence and expansion classification:**
- ORIGINAL GAME CONTENT — the numbered mission objectives, route subdivision, dialogue-free staging and completion checks are proposed game expansion.
- USER-APPROVED GAME ADAPTATION — Bhairava remains the protagonist through the bounty/Complex/Shambhala journey, reaching his first full awakening at Mission50.
- UNVERIFIED — this early/mid-film arrangement is not independently established by the partial ending inspection; approved adaptation direction supplies the broad anchor, not continuous footage proof.

## Mission 2: THE GLASS WASTES

1. **Number, ID and title:** 2; `mission-2`; THE GLASS WASTES.
2. **Story arc:** 1 — Contracts and ambition.
3. **Location:** Glass Wastes corridor.
4. **Main playable character:** Bhairava. No automatic mid-duel character switching.
5. **Characters involved:** Bhairava; Bujji.
6. **Story purpose:** Show that access and earnings require reading hostile infrastructure.
7. **Opening cinematic:** Travel along three dark pylons before revealing the hunter. Display this mission's title and the objective below, then hand off to the existing third-person camera. Apply the shared Skip/Replay/Continue/Restart policy.
8. **Main objectives:** Activate and verify three pylons; defeat sentinels; complete the Sovereign encounter.
9. **Exploration or investigation:** Trace the three frequencies instead of following a generic arrow.
10. **Combat encounters:** Existing five sentinels and Prism Sovereign route.
11. **Boss encounter:** No arc-finale boss. Any local encounter explicitly listed above retains its existing identity; no extra boss is implied.
12. **Character development:** Bujji's technical advice complements combat.
13. **Consequences:** The powered route brings the partners back toward paying markets.
14. **Completion condition:** All pylon checks and existing defeat/relic conditions resolved. Require legitimate prerequisite progression; Mission1 completion is the proposed sequential dependency. Save through existing campaign authority with idempotent rewards; no fabricated completion history.
15. **Next mission connection:** Mission3 — ONE MORE JOB. Distinguish a valid job from an unreliable posting.
16. **Evidence and expansion classification:**
- ORIGINAL GAME CONTENT — the numbered mission objectives, route subdivision, dialogue-free staging and completion checks are proposed game expansion.
- USER-APPROVED GAME ADAPTATION — Bhairava remains the protagonist through the bounty/Complex/Shambhala journey, reaching his first full awakening at Mission50.

## Mission 3: ONE MORE JOB

1. **Number, ID and title:** 3; `mission-3`; ONE MORE JOB.
2. **Story arc:** 1 — Contracts and ambition.
3. **Location:** Kashi market edges.
4. **Main playable character:** Bhairava. No automatic mid-duel character switching.
5. **Characters involved:** Bhairava; Bujji.
6. **Story purpose:** Distinguish a valid job from an unreliable posting.
7. **Opening cinematic:** Move from the crowded frontage to three contract beacons. Display this mission's title and the objective below, then hand off to the existing third-person camera. Apply the shared Skip/Replay/Continue/Restart policy.
8. **Main objectives:** Read three beacons; identify the valid contract; complete its encounter.
9. **Exploration or investigation:** Compare lower-tier and market-edge evidence.
10. **Combat encounters:** Preserve the existing bounded market patrol and boss concept.
11. **Boss encounter:** No arc-finale boss. Any local encounter explicitly listed above retains its existing identity; no extra boss is implied.
12. **Character development:** Bhairava learns to verify a claim before risking equipment.
13. **Consequences:** A verified payment is earmarked for the vehicle debt.
14. **Completion condition:** Correct evidence selected and existing encounter completed. Require legitimate prerequisite progression; Mission2 completion is the proposed sequential dependency. Save through existing campaign authority with idempotent rewards; no fabricated completion history.
15. **Next mission connection:** Mission4 — THE DRIVER’S DEBT. Make the cost of the partnership tangible through repair work.
16. **Evidence and expansion classification:**
- ORIGINAL GAME CONTENT — the numbered mission objectives, route subdivision, dialogue-free staging and completion checks are proposed game expansion.
- USER-APPROVED GAME ADAPTATION — Bhairava remains the protagonist through the bounty/Complex/Shambhala journey, reaching his first full awakening at Mission50.

## Mission 4: THE DRIVER’S DEBT

1. **Number, ID and title:** 4; `mission-4`; THE DRIVER’S DEBT.
2. **Story arc:** 1 — Contracts and ambition.
3. **Location:** Wreck recovery court.
4. **Main playable character:** Bhairava. No automatic mid-duel character switching.
5. **Characters involved:** Bhairava; Bujji.
6. **Story purpose:** Make the cost of the partnership tangible through repair work.
7. **Opening cinematic:** Reveal the damaged engine and Bhairava beside it. Display this mission's title and the objective below, then hand off to the existing third-person camera. Apply the shared Skip/Replay/Continue/Restart policy.
8. **Main objectives:** Recover the ignition core and other engine parts; hold stable calibration; finish the encounter.
9. **Exploration or investigation:** Read scorch marks to distinguish usable parts from debris.
10. **Combat encounters:** Existing pursuers and Convoy Breaker route, no new identity claim.
11. **Boss encounter:** No arc-finale boss. Any local encounter explicitly listed above retains its existing identity; no extra boss is implied.
12. **Character development:** He invests in Bujji because the partnership makes bigger jobs possible.
13. **Consequences:** Repair opens the tiered route to higher-value contracts.
14. **Completion condition:** All real parts registered, calibration held and encounter resolved. Require legitimate prerequisite progression; Mission3 completion is the proposed sequential dependency. Save through existing campaign authority with idempotent rewards; no fabricated completion history.
15. **Next mission connection:** Mission5 — A CITY OF TIERS. Expose the contrast between the city below and desired access above.
16. **Evidence and expansion classification:**
- ORIGINAL GAME CONTENT — the numbered mission objectives, route subdivision, dialogue-free staging and completion checks are proposed game expansion.
- USER-APPROVED GAME ADAPTATION — Bhairava remains the protagonist through the bounty/Complex/Shambhala journey, reaching his first full awakening at Mission50.

## Mission 5: A CITY OF TIERS

1. **Number, ID and title:** 5; `mission-5`; A CITY OF TIERS.
2. **Story arc:** 1 — Contracts and ambition.
3. **Location:** Kashi tier relay street.
4. **Main playable character:** Bhairava. No automatic mid-duel character switching.
5. **Characters involved:** Bhairava; Bujji.
6. **Story purpose:** Expose the contrast between the city below and desired access above.
7. **Opening cinematic:** Low street framing rises to the distant privileged skyline. Display this mission's title and the objective below, then hand off to the existing third-person camera. Apply the shared Skip/Replay/Continue/Restart policy.
8. **Main objectives:** Read lower and middle relays; confirm the district route; resolve existing combat.
9. **Exploration or investigation:** Observe which links actually connect between tiers.
10. **Combat encounters:** Existing tier defenders and boss encounter remain the gameplay basis.
11. **Boss encounter:** No arc-finale boss. Any local encounter explicitly listed above retains its existing identity; no extra boss is implied.
12. **Character development:** The Complex ambition acquires a visible spatial target.
13. **Consequences:** The new route returns him to a more competitive bounty board.
14. **Completion condition:** Relay chain and current completion requirements satisfied. Require legitimate prerequisite progression; Mission4 completion is the proposed sequential dependency. Save through existing campaign authority with idempotent rewards; no fabricated completion history.
15. **Next mission connection:** Mission6 — THE BOUNTY BOARD. Turn easy confidence into disciplined selection of a worthwhile claim.
16. **Evidence and expansion classification:**
- ORIGINAL GAME CONTENT — the numbered mission objectives, route subdivision, dialogue-free staging and completion checks are proposed game expansion.
- USER-APPROVED GAME ADAPTATION — Bhairava remains the protagonist through the bounty/Complex/Shambhala journey, reaching his first full awakening at Mission50.
- UNVERIFIED — this early/mid-film arrangement is not independently established by the partial ending inspection; approved adaptation direction supplies the broad anchor, not continuous footage proof.

## Mission 6: THE BOUNTY BOARD

1. **Number, ID and title:** 6; `mission-6`; THE BOUNTY BOARD.
2. **Story arc:** 1 — Contracts and ambition.
3. **Location:** Kashi bounty-board bazaar.
4. **Main playable character:** Bhairava. No automatic mid-duel character switching.
5. **Characters involved:** Bhairava; Bujji.
6. **Story purpose:** Turn easy confidence into disciplined selection of a worthwhile claim.
7. **Opening cinematic:** Orbit the hunter while competing notices fill the background. Display this mission's title and the objective below, then hand off to the existing third-person camera. Apply the shared Skip/Replay/Continue/Restart policy.
8. **Main objectives:** Read the original notice; reject a contradictory claim; verify the final posting.
9. **Exploration or investigation:** Compare notice provenance and dates, not invented film dialogue.
10. **Combat encounters:** Existing bounded rival-hunter encounter; no new named rival.
11. **Boss encounter:** No arc-finale boss. Any local encounter explicitly listed above retains its existing identity; no extra boss is implied.
12. **Character development:** He remains profit-driven but becomes harder to mislead.
13. **Consequences:** The chosen claim points to an alley pursuit.
14. **Completion condition:** Evidence-backed posting and existing encounter resolved. Require legitimate prerequisite progression; Mission5 completion is the proposed sequential dependency. Save through existing campaign authority with idempotent rewards; no fabricated completion history.
15. **Next mission connection:** Mission7 — THE MASKED PURSUIT. Teach pursuit through actual traces rather than omniscient knowledge.
16. **Evidence and expansion classification:**
- ORIGINAL GAME CONTENT — the numbered mission objectives, route subdivision, dialogue-free staging and completion checks are proposed game expansion.
- USER-APPROVED GAME ADAPTATION — Bhairava remains the protagonist through the bounty/Complex/Shambhala journey, reaching his first full awakening at Mission50.

## Mission 7: THE MASKED PURSUIT

1. **Number, ID and title:** 7; `mission-7`; THE MASKED PURSUIT.
2. **Story arc:** 1 — Contracts and ambition.
3. **Location:** Kashi alley and roof-access route.
4. **Main playable character:** Bhairava. No automatic mid-duel character switching.
5. **Characters involved:** Bhairava; Bujji.
6. **Story purpose:** Teach pursuit through actual traces rather than omniscient knowledge.
7. **Opening cinematic:** Follow an alley sightline, then reveal the last visible trail. Display this mission's title and the objective below, then hand off to the existing third-person camera. Apply the shared Skip/Replay/Continue/Restart policy.
8. **Main objectives:** Check the alley trace; inspect roof access; verify the final sighting.
9. **Exploration or investigation:** Distinguish a genuine route from a dead-end marker.
10. **Combat encounters:** Existing interceptor/guard roles on the trail.
11. **Boss encounter:** No arc-finale boss. Any local encounter explicitly listed above retains its existing identity; no extra boss is implied.
12. **Character development:** He relies on observation as well as force.
13. **Consequences:** The trail leads into the established arena circuit.
14. **Completion condition:** All three trace checks and existing encounter conditions complete. Require legitimate prerequisite progression; Mission6 completion is the proposed sequential dependency. Save through existing campaign authority with idempotent rewards; no fabricated completion history.
15. **Next mission connection:** Mission8 — THE ARENA CIRCUIT. Test combat discipline before the arc-ending road duel.
16. **Evidence and expansion classification:**
- ORIGINAL GAME CONTENT — the numbered mission objectives, route subdivision, dialogue-free staging and completion checks are proposed game expansion.
- USER-APPROVED GAME ADAPTATION — Bhairava remains the protagonist through the bounty/Complex/Shambhala journey, reaching his first full awakening at Mission50.

## Mission 8: THE ARENA CIRCUIT

1. **Number, ID and title:** 8; `mission-8`; THE ARENA CIRCUIT.
2. **Story arc:** 1 — Contracts and ambition.
3. **Location:** Kashi arena circuit.
4. **Main playable character:** Bhairava. No automatic mid-duel character switching.
5. **Characters involved:** Bhairava; Bujji.
6. **Story purpose:** Test combat discipline before the arc-ending road duel.
7. **Opening cinematic:** Frame the arena entrance, its exits and Bhairava's weapon. Display this mission's title and the objective below, then hand off to the existing third-person camera. Apply the shared Skip/Replay/Continue/Restart policy.
8. **Main objectives:** Clear the first bout; clear the heavy-guard bout; verify the circuit.
9. **Exploration or investigation:** Inspect recovery openings and arena boundaries between bouts.
10. **Combat encounters:** Existing circuit fights; multiple enemies allowed because this is not the arc finale.
11. **Boss encounter:** No arc-finale boss. Any local encounter explicitly listed above retains its existing identity; no extra boss is implied.
12. **Character development:** Confidence is earned through spacing rather than invulnerability.
13. **Consequences:** Circuit earnings and the meeting account become the next job's evidence.
14. **Completion condition:** Required bouts and current champion/relic conditions complete. Require legitimate prerequisite progression; Mission7 completion is the proposed sequential dependency. Save through existing campaign authority with idempotent rewards; no fabricated completion history.
15. **Next mission connection:** Mission9 — A DEBT COLLECTED. Give the departure contract a trustworthy basis.
16. **Evidence and expansion classification:**
- ORIGINAL GAME CONTENT — the numbered mission objectives, route subdivision, dialogue-free staging and completion checks are proposed game expansion.
- USER-APPROVED GAME ADAPTATION — Bhairava remains the protagonist through the bounty/Complex/Shambhala journey, reaching his first full awakening at Mission50.

## Mission 9: A DEBT COLLECTED

1. **Number, ID and title:** 9; `mission-9`; A DEBT COLLECTED.
2. **Story arc:** 1 — Contracts and ambition.
3. **Location:** Kashi claim meeting court.
4. **Main playable character:** Bhairava. No automatic mid-duel character switching.
5. **Characters involved:** Bhairava; Bujji.
6. **Story purpose:** Give the departure contract a trustworthy basis.
7. **Opening cinematic:** Show the meeting account and competing routes before the player. Display this mission's title and the objective below, then hand off to the existing third-person camera. Apply the shared Skip/Replay/Continue/Restart policy.
8. **Main objectives:** Read the account; select its evidence-backed interpretation; confirm collection.
9. **Exploration or investigation:** Compare payments already earned, without fabricated history.
10. **Combat encounters:** Existing collection-point encounter only.
11. **Boss encounter:** No arc-finale boss. Any local encounter explicitly listed above retains its existing identity; no extra boss is implied.
12. **Character development:** He recognizes that a reliable partner matters more than a false claim.
13. **Consequences:** The collected account funds an attempted departure.
14. **Completion condition:** Correct account and existing mission completion conditions resolved. Require legitimate prerequisite progression; Mission8 completion is the proposed sequential dependency. Save through existing campaign authority with idempotent rewards; no fabricated completion history.
15. **Next mission connection:** Mission10 — THE ROAD OUT. End the local contract arc with a focused road-opening contest.
16. **Evidence and expansion classification:**
- ORIGINAL GAME CONTENT — the numbered mission objectives, route subdivision, dialogue-free staging and completion checks are proposed game expansion.
- USER-APPROVED GAME ADAPTATION — Bhairava remains the protagonist through the bounty/Complex/Shambhala journey, reaching his first full awakening at Mission50.

## Mission 10: THE ROAD OUT

1. **Number, ID and title:** 10; `mission-10`; THE ROAD OUT.
2. **Story arc:** 1 — Contracts and ambition.
3. **Location:** Kashi outer-road arena.
4. **Main playable character:** Bhairava. No automatic mid-duel character switching.
5. **Characters involved:** Bhairava; Bujji outside duel.
6. **Story purpose:** End the local contract arc with a focused road-opening contest.
7. **Opening cinematic:** Establish the barricaded road, then introduce the Exit Warden proposal. Display this mission's title and the objective below, then hand off to the existing third-person camera. Apply the shared Skip/Replay/Continue/Restart policy.
8. **Main objectives:** Inspect the barricade; hold the departure signal; win the one-principal duel.
9. **Exploration or investigation:** Read the arena lanes before committing the signal.
10. **Combat encounters:** Proposed Exit Warden duel only; no mandatory adds.
11. **Boss encounter:** Exit Warden — PROPOSED FOR REVIEW. Dedicated 1-vs-1 finale; see boss design for patterns, arena and victory checks.
12. **Character development:** A local success increases his appetite for the Complex jackpot.
13. **Consequences:** The road opens toward the Complex's outer service economy.
14. **Completion condition:** Actual boss defeat and playable road-opening victory; one reward. Require legitimate prerequisite progression; Mission9 completion is the proposed sequential dependency. Save through existing campaign authority with idempotent rewards; no fabricated completion history.
15. **Next mission connection:** Mission11 — THE DIAGNOSTIC. Make the jackpot dream confront the reality of exclusion.
16. **Evidence and expansion classification:**
- ORIGINAL GAME CONTENT — the numbered mission objectives, route subdivision, dialogue-free staging and completion checks are proposed game expansion.
- USER-APPROVED GAME ADAPTATION — Bhairava remains the protagonist through the bounty/Complex/Shambhala journey, reaching his first full awakening at Mission50.

