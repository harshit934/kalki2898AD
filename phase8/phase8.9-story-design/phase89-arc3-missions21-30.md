# Phase8.9 — Arc 3: The pursued woman and her guardian

Missions 21–30. Historical arc label: The price above. New grouping purpose is proposed design, not a source-data rewrite.

## Design status and shared lifecycle

This is STORY DESIGN ONLY, dated 2026-11-17. Every task arrangement below is proposed ORIGINAL GAME CONTENT unless a specific approved anchor is identified. A complete design is not an implemented or accepted mission. Historical source data, runtime IDs, rewards, saves and staging builds are unchanged.

Each introduction uses the existing Phase7 cinematic-director architecture as a future dependency: mission-specific scene framing, title, objective and supported story context; Skip safely returns control; replay changes neither progress nor rewards; Continue resumes a valid active checkpoint without unnecessarily replaying the introduction; explicit Restart replays it. Narrative Skip may resolve its own presentation beat, never fabricate combat victory, prerequisite history or unrelated objectives. Restore gameplay camera and keyboard/mobile control, pause safely, and clean up on exit. No new controller or permanent save authority is proposed. Mission completion requires the explicit conditions below; future implementation must preserve existing reward authority and grant rewards only once.

All new spaces below are proposed subareas or reuse of existing location families, not claims of implemented environments. Cast lists are story-design roles, not claims that models, voices, animations or NPC interactions exist. Use text or approved non-voice presentation where necessary; no cloned voice or movie audio.


## Mission 21: BELOW THE SHADOW

1. **Number, ID and title:** 21; `mission-21`; BELOW THE SHADOW.
2. **Story arc:** 3 — The pursued woman and her guardian.
3. **Location:** Kashi public bounty posting.
4. **Main playable character:** Bhairava. No automatic mid-duel character switching.
5. **Characters involved:** Bhairava; Bujji; Sumathi in audience cutaway.
6. **Story purpose:** Make the hunt for the escaped woman the next clear pursuit.
7. **Opening cinematic:** Show the public bounty, then the hunter's reaction. Display this mission's title and the objective below, then hand off to the existing third-person camera. Apply the shared Skip/Replay/Continue/Restart policy.
8. **Main objectives:** Read the wanted terms; identify the last public sighting; choose the outbound trail.
9. **Exploration or investigation:** Separate bounty claims from verified sightings.
10. **Combat encounters:** Brief rival pressure at the posting, not a new named villain.
11. **Boss encounter:** No arc-finale boss. Any local encounter explicitly listed above retains its existing identity; no extra boss is implied.
12. **Character development:** The jackpot motive now has a specific target.
13. **Consequences:** The trail leads to a damaged transport route.
14. **Completion condition:** Wanted terms and correct sighting recorded. Require legitimate prerequisite progression; Mission20 completion is the proposed sequential dependency. Save through existing campaign authority with idempotent rewards; no fabricated completion history.
15. **Next mission connection:** Mission22 — THE WATER QUEUE. Follow evidence while keeping the audience aware of the fugitive's danger.
16. **Evidence and expansion classification:**
- ORIGINAL GAME CONTENT — the numbered mission objectives, route subdivision, dialogue-free staging and completion checks are proposed game expansion.
- USER-APPROVED GAME ADAPTATION — Bhairava remains the protagonist through the bounty/Complex/Shambhala journey, reaching his first full awakening at Mission50.
- UNVERIFIED — this early/mid-film arrangement is not independently established by the partial ending inspection; approved adaptation direction supplies the broad anchor, not continuous footage proof.

## Mission 22: THE WATER QUEUE

1. **Number, ID and title:** 22; `mission-22`; THE WATER QUEUE.
2. **Story arc:** 3 — The pursued woman and her guardian.
3. **Location:** Kashi transport-edge trail.
4. **Main playable character:** Bhairava. No automatic mid-duel character switching.
5. **Characters involved:** Bhairava; Bujji; Sumathi in audience cutaway.
6. **Story purpose:** Follow evidence while keeping the audience aware of the fugitive's danger.
7. **Opening cinematic:** Frame scattered transport traces and the outbound landscape. Display this mission's title and the objective below, then hand off to the existing third-person camera. Apply the shared Skip/Replay/Continue/Restart policy.
8. **Main objectives:** Inspect two matching tracks; reject a false turn; reach the next sightline.
9. **Exploration or investigation:** Compare direction and age of visible tracks.
10. **Combat encounters:** A limited patrol interception with a bypass option.
11. **Boss encounter:** No arc-finale boss. Any local encounter explicitly listed above retains its existing identity; no extra boss is implied.
12. **Character development:** He pursues a person as a contract, not yet as someone to protect.
13. **Consequences:** A witness location becomes reachable.
14. **Completion condition:** Correct track chain and sightline reached. Require legitimate prerequisite progression; Mission21 completion is the proposed sequential dependency. Save through existing campaign authority with idempotent rewards; no fabricated completion history.
15. **Next mission connection:** Mission23 — A FREIGHT WINDOW. Let people resist reducing the fugitive to a reward.
16. **Evidence and expansion classification:**
- ORIGINAL GAME CONTENT — the numbered mission objectives, route subdivision, dialogue-free staging and completion checks are proposed game expansion.
- USER-APPROVED GAME ADAPTATION — Bhairava remains the protagonist through the bounty/Complex/Shambhala journey, reaching his first full awakening at Mission50.

## Mission 23: A FREIGHT WINDOW

1. **Number, ID and title:** 23; `mission-23`; A FREIGHT WINDOW.
2. **Story arc:** 3 — The pursued woman and her guardian.
3. **Location:** Kashi roadside shelter edge.
4. **Main playable character:** Bhairava. No automatic mid-duel character switching.
5. **Characters involved:** Bhairava; Bujji; unnamed witnesses.
6. **Story purpose:** Let people resist reducing the fugitive to a reward.
7. **Opening cinematic:** Hold the camera on empty space before revealing the guarded witness route. Display this mission's title and the objective below, then hand off to the existing third-person camera. Apply the shared Skip/Replay/Continue/Restart policy.
8. **Main objectives:** Inspect a sighting marker; question the available witness without authored dialogue; verify the account.
9. **Exploration or investigation:** Compare the witness account with ground evidence.
10. **Combat encounters:** Defend only the route interaction against a small interruption.
11. **Boss encounter:** No arc-finale boss. Any local encounter explicitly listed above retains its existing identity; no extra boss is implied.
12. **Character development:** His self-interest meets another person's reluctance.
13. **Consequences:** The account identifies a crossing rather than her final destination.
14. **Completion condition:** A consistent account selected, not an invented confession. Require legitimate prerequisite progression; Mission22 completion is the proposed sequential dependency. Save through existing campaign authority with idempotent rewards; no fabricated completion history.
15. **Next mission connection:** Mission24 — THE WRONG PERMIT. Turn the pursuit into a physical navigation problem.
16. **Evidence and expansion classification:**
- ORIGINAL GAME CONTENT — the numbered mission objectives, route subdivision, dialogue-free staging and completion checks are proposed game expansion.
- USER-APPROVED GAME ADAPTATION — Bhairava remains the protagonist through the bounty/Complex/Shambhala journey, reaching his first full awakening at Mission50.

## Mission 24: THE WRONG PERMIT

1. **Number, ID and title:** 24; `mission-24`; THE WRONG PERMIT.
2. **Story arc:** 3 — The pursued woman and her guardian.
3. **Location:** Wasteland crossing.
4. **Main playable character:** Bhairava. No automatic mid-duel character switching.
5. **Characters involved:** Bhairava; Bujji; Sumathi in audience cutaway.
6. **Story purpose:** Turn the pursuit into a physical navigation problem.
7. **Opening cinematic:** Reveal the crossing gap and two possible routes. Display this mission's title and the objective below, then hand off to the existing third-person camera. Apply the shared Skip/Replay/Continue/Restart policy.
8. **Main objectives:** Survey the crossing; activate the usable passage; follow the confirmed exit trail.
9. **Exploration or investigation:** Identify the safe approach from structural clues.
10. **Combat encounters:** One existing-role group controlling the crossing.
11. **Boss encounter:** No arc-finale boss. Any local encounter explicitly listed above retains its existing identity; no extra boss is implied.
12. **Character development:** Force cannot replace reading the terrain.
13. **Consequences:** The next lead approaches the protector's route.
14. **Completion condition:** Usable crossing and correct trail exit reached. Require legitimate prerequisite progression; Mission23 completion is the proposed sequential dependency. Save through existing campaign authority with idempotent rewards; no fabricated completion history.
15. **Next mission connection:** Mission25 — SCRAP FOR PASSAGE. Introduce the approved protector relationship without granting Bhairava hidden knowledge.
16. **Evidence and expansion classification:**
- ORIGINAL GAME CONTENT — the numbered mission objectives, route subdivision, dialogue-free staging and completion checks are proposed game expansion.
- USER-APPROVED GAME ADAPTATION — Bhairava remains the protagonist through the bounty/Complex/Shambhala journey, reaching his first full awakening at Mission50.

## Mission 25: SCRAP FOR PASSAGE

1. **Number, ID and title:** 25; `mission-25`; SCRAP FOR PASSAGE.
2. **Story arc:** 3 — The pursued woman and her guardian.
3. **Location:** Wasteland signal ridge.
4. **Main playable character:** Bhairava. No automatic mid-duel character switching.
5. **Characters involved:** Bhairava; Bujji; Ashwatthama and Sumathi in cutaway.
6. **Story purpose:** Introduce the approved protector relationship without granting Bhairava hidden knowledge.
7. **Opening cinematic:** Separate the hunter's ridge survey from the audience's protector image. Display this mission's title and the objective below, then hand off to the existing third-person camera. Apply the shared Skip/Replay/Continue/Restart policy.
8. **Main objectives:** Inspect a discarded signal trace; verify its direction; reach the next overlook.
9. **Exploration or investigation:** Distinguish the signal's route from its unknown owner.
10. **Combat encounters:** A short ranged-pressure encounter on the ridge.
11. **Boss encounter:** No arc-finale boss. Any local encounter explicitly listed above retains its existing identity; no extra boss is implied.
12. **Character development:** He senses a difficult job but does not yet understand its stakes.
13. **Consequences:** A guarded path suggests someone is helping the target.
14. **Completion condition:** Signal direction confirmed and overlook reached. Require legitimate prerequisite progression; Mission24 completion is the proposed sequential dependency. Save through existing campaign authority with idempotent rewards; no fabricated completion history.
15. **Next mission connection:** Mission26 — EYES ON THE GANTRY. Show that the target has a capable protector.
16. **Evidence and expansion classification:**
- ORIGINAL GAME CONTENT — the numbered mission objectives, route subdivision, dialogue-free staging and completion checks are proposed game expansion.
- USER-APPROVED GAME ADAPTATION — Bhairava remains the protagonist through the bounty/Complex/Shambhala journey, reaching his first full awakening at Mission50.
- UNVERIFIED — this early/mid-film arrangement is not independently established by the partial ending inspection; approved adaptation direction supplies the broad anchor, not continuous footage proof.

## Mission 26: EYES ON THE GANTRY

1. **Number, ID and title:** 26; `mission-26`; EYES ON THE GANTRY.
2. **Story arc:** 3 — The pursued woman and her guardian.
3. **Location:** Transport approach lanes.
4. **Main playable character:** Bhairava. No automatic mid-duel character switching.
5. **Characters involved:** Bhairava; Bujji.
6. **Story purpose:** Show that the target has a capable protector.
7. **Opening cinematic:** Track a blocked lane and a second viable approach. Display this mission's title and the objective below, then hand off to the existing third-person camera. Apply the shared Skip/Replay/Continue/Restart policy.
8. **Main objectives:** Read the damaged approach; choose an alternate lane; confirm the moving trail.
9. **Exploration or investigation:** Infer route access, not a new power or biography.
10. **Combat encounters:** Bounded ordinary guards; no disposable clone of Ashwatthama.
11. **Boss encounter:** No arc-finale boss. Any local encounter explicitly listed above retains its existing identity; no extra boss is implied.
12. **Character development:** He begins to respect resistance as a real obstacle.
13. **Consequences:** The hunter reaches the edge of a direct confrontation.
14. **Completion condition:** Alternate approach and trail verified. Require legitimate prerequisite progression; Mission25 completion is the proposed sequential dependency. Save through existing campaign authority with idempotent rewards; no fabricated completion history.
15. **Next mission connection:** Mission27 — THE TOLL KEEPER. Prepare the conflict between a bounty claim and protection.
16. **Evidence and expansion classification:**
- ORIGINAL GAME CONTENT — the numbered mission objectives, route subdivision, dialogue-free staging and completion checks are proposed game expansion.
- USER-APPROVED GAME ADAPTATION — Bhairava remains the protagonist through the bounty/Complex/Shambhala journey, reaching his first full awakening at Mission50.
- UNVERIFIED — this early/mid-film arrangement is not independently established by the partial ending inspection; approved adaptation direction supplies the broad anchor, not continuous footage proof.

## Mission 27: THE TOLL KEEPER

1. **Number, ID and title:** 27; `mission-27`; THE TOLL KEEPER.
2. **Story arc:** 3 — The pursued woman and her guardian.
3. **Location:** Transport roadside observation point.
4. **Main playable character:** Bhairava. No automatic mid-duel character switching.
5. **Characters involved:** Bhairava; Bujji; Ashwatthama; Sumathi in context.
6. **Story purpose:** Prepare the conflict between a bounty claim and protection.
7. **Opening cinematic:** Use a long view that reveals the protector before the hunter advances. Display this mission's title and the objective below, then hand off to the existing third-person camera. Apply the shared Skip/Replay/Continue/Restart policy.
8. **Main objectives:** Approach the observation point; inspect the blocked route; identify a safe withdrawal path.
9. **Exploration or investigation:** Read defensive positioning and noncombatant space.
10. **Combat encounters:** Avoid premature mandatory combat; only route guards if authored.
11. **Boss encounter:** No arc-finale boss. Any local encounter explicitly listed above retains its existing identity; no extra boss is implied.
12. **Character development:** His confidence is challenged by the defender's composure.
13. **Consequences:** He needs a stronger approach before challenging the protector.
14. **Completion condition:** Observation and withdrawal route marked. Require legitimate prerequisite progression; Mission26 completion is the proposed sequential dependency. Save through existing campaign authority with idempotent rewards; no fabricated completion history.
15. **Next mission connection:** Mission28 — NO INVITATION. Make the pursuit depend on preparation, not unexplained strength.
16. **Evidence and expansion classification:**
- ORIGINAL GAME CONTENT — the numbered mission objectives, route subdivision, dialogue-free staging and completion checks are proposed game expansion.
- USER-APPROVED GAME ADAPTATION — Bhairava remains the protagonist through the bounty/Complex/Shambhala journey, reaching his first full awakening at Mission50.
- UNVERIFIED — this early/mid-film arrangement is not independently established by the partial ending inspection; approved adaptation direction supplies the broad anchor, not continuous footage proof.

## Mission 28: NO INVITATION

1. **Number, ID and title:** 28; `mission-28`; NO INVITATION.
2. **Story arc:** 3 — The pursued woman and her guardian.
3. **Location:** Wasteland equipment stop.
4. **Main playable character:** Bhairava. No automatic mid-duel character switching.
5. **Characters involved:** Bhairava; Bujji.
6. **Story purpose:** Make the pursuit depend on preparation, not unexplained strength.
7. **Opening cinematic:** Reveal worn equipment beside a difficult forward route. Display this mission's title and the objective below, then hand off to the existing third-person camera. Apply the shared Skip/Replay/Continue/Restart policy.
8. **Main objectives:** Repair a damaged link; verify the weapon carrier; test movement access.
9. **Exploration or investigation:** Inspect the actual fault rather than buy a magical upgrade.
10. **Combat encounters:** Protect the work from a single bounded raid.
11. **Boss encounter:** No arc-finale boss. Any local encounter explicitly listed above retains its existing identity; no extra boss is implied.
12. **Character development:** He invests in skill and equipment while remaining reward-driven.
13. **Consequences:** The prepared approach leads to an observation barrier.
14. **Completion condition:** Both checks and a short movement test pass. Require legitimate prerequisite progression; Mission27 completion is the proposed sequential dependency. Save through existing campaign authority with idempotent rewards; no fabricated completion history.
15. **Next mission connection:** Mission29 — WHISPERS OF A TRANSFER. Make the next duel serve a specific route purpose.
16. **Evidence and expansion classification:**
- ORIGINAL GAME CONTENT — the numbered mission objectives, route subdivision, dialogue-free staging and completion checks are proposed game expansion.
- USER-APPROVED GAME ADAPTATION — Bhairava remains the protagonist through the bounty/Complex/Shambhala journey, reaching his first full awakening at Mission50.

## Mission 29: WHISPERS OF A TRANSFER

1. **Number, ID and title:** 29; `mission-29`; WHISPERS OF A TRANSFER.
2. **Story arc:** 3 — The pursued woman and her guardian.
3. **Location:** Transport observation barrier.
4. **Main playable character:** Bhairava. No automatic mid-duel character switching.
5. **Characters involved:** Bhairava; Bujji.
6. **Story purpose:** Make the next duel serve a specific route purpose.
7. **Opening cinematic:** Sweep the blocked overlook and the arena access beneath it. Display this mission's title and the objective below, then hand off to the existing third-person camera. Apply the shared Skip/Replay/Continue/Restart policy.
8. **Main objectives:** Trace the barrier control; disable its exterior lock; enter the duel approach.
9. **Exploration or investigation:** Locate the physical control through cover and sightlines.
10. **Combat encounters:** A limited guard obstruction before the duel, not during it.
11. **Boss encounter:** No arc-finale boss. Any local encounter explicitly listed above retains its existing identity; no extra boss is implied.
12. **Character development:** He chooses a deliberate opening instead of charging blindly.
13. **Consequences:** The Solar Architect proposal holds the observation route.
14. **Completion condition:** Control and approach completed. Require legitimate prerequisite progression; Mission28 completion is the proposed sequential dependency. Save through existing campaign authority with idempotent rewards; no fabricated completion history.
15. **Next mission connection:** Mission30 — A LARGER NUMBER. Earn a vantage point for the protector confrontation.
16. **Evidence and expansion classification:**
- ORIGINAL GAME CONTENT — the numbered mission objectives, route subdivision, dialogue-free staging and completion checks are proposed game expansion.
- USER-APPROVED GAME ADAPTATION — Bhairava remains the protagonist through the bounty/Complex/Shambhala journey, reaching his first full awakening at Mission50.

## Mission 30: A LARGER NUMBER

1. **Number, ID and title:** 30; `mission-30`; A LARGER NUMBER.
2. **Story arc:** 3 — The pursued woman and her guardian.
3. **Location:** Wasteland observation duel arena.
4. **Main playable character:** Bhairava. No automatic mid-duel character switching.
5. **Characters involved:** Bhairava; Bujji outside duel.
6. **Story purpose:** Earn a vantage point for the protector confrontation.
7. **Opening cinematic:** Reveal a radial arena and the single Solar Architect proposal. Display this mission's title and the objective below, then hand off to the existing third-person camera. Apply the shared Skip/Replay/Continue/Restart policy.
8. **Main objectives:** Read the rotating attack lanes; defeat the principal opponent; claim the view.
9. **Exploration or investigation:** Inspect safe sectors before initiating the duel.
10. **Combat encounters:** Proposed Solar Architect 1-vs-1 with readable radial patterns.
11. **Boss encounter:** Solar Architect — PROPOSED FOR REVIEW. Dedicated 1-vs-1 finale; see boss design for patterns, arena and victory checks.
12. **Character development:** Bhairava learns that apparently overwhelming attacks have openings.
13. **Consequences:** The lookout provides a direct route toward Ashwatthama.
14. **Completion condition:** Actual boss defeat and playable access to the overlook. Require legitimate prerequisite progression; Mission29 completion is the proposed sequential dependency. Save through existing campaign authority with idempotent rewards; no fabricated completion history.
15. **Next mission connection:** Mission31 — A BROKEN NOTICE. Move from tracing a bounty to confronting its protector.
16. **Evidence and expansion classification:**
- ORIGINAL GAME CONTENT — the numbered mission objectives, route subdivision, dialogue-free staging and completion checks are proposed game expansion.
- USER-APPROVED GAME ADAPTATION — Bhairava remains the protagonist through the bounty/Complex/Shambhala journey, reaching his first full awakening at Mission50.

