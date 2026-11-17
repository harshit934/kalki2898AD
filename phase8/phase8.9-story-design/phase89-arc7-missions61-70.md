# Phase8.9 — Arc 7: Kalki and the Horizon Keeper

Missions 61–70. Historical arc label: The cost of losing. New grouping purpose is proposed design, not a source-data rewrite.

## Design status and shared lifecycle

This is STORY DESIGN ONLY, dated 2026-11-17. Every task arrangement below is proposed ORIGINAL GAME CONTENT unless a specific approved anchor is identified. A complete design is not an implemented or accepted mission. Historical source data, runtime IDs, rewards, saves and staging builds are unchanged.

Each introduction uses the existing Phase7 cinematic-director architecture as a future dependency: mission-specific scene framing, title, objective and supported story context; Skip safely returns control; replay changes neither progress nor rewards; Continue resumes a valid active checkpoint without unnecessarily replaying the introduction; explicit Restart replays it. Narrative Skip may resolve its own presentation beat, never fabricate combat victory, prerequisite history or unrelated objectives. Restore gameplay camera and keyboard/mobile control, pause safely, and clean up on exit. No new controller or permanent save authority is proposed. Mission completion requires the explicit conditions below; future implementation must preserve existing reward authority and grant rewards only once.

All new spaces below are proposed subareas or reuse of existing location families, not claims of implemented environments. Cast lists are story-design roles, not claims that models, voices, animations or NPC interactions exist. Use text or approved non-voice presentation where necessary; no cloned voice or movie audio.


## Mission 61: A NOTICE AT THE GATE

1. **Number, ID and title:** 61; `mission-61`; A NOTICE AT THE GATE.
2. **Story arc:** 7 — Kalki and the Horizon Keeper.
3. **Location:** Desert settlement approach.
4. **Main playable character:** Kalki. No automatic mid-duel character switching.
5. **Characters involved:** Kalki; Bhairava; Bujji.
6. **Story purpose:** Establish Kalki's immediate responsibilities after introduction.
7. **Opening cinematic:** Rear tracking shot reveals a blocked settlement approach and sheltered destination. Display this mission's title and the objective below, then hand off to the existing third-person camera. Apply the shared Skip/Replay/Continue/Restart policy.
8. **Main objectives:** Survey the approach; open a safe crossing; guide a small protected party to shelter.
9. **Exploration or investigation:** Choose between exposed and covered approaches.
10. **Combat encounters:** Limited road guards, with retreat space.
11. **Boss encounter:** No arc-finale boss. Any local encounter explicitly listed above retains its existing identity; no extra boss is implied.
12. **Character development:** Kalki's role is shown through action rather than borrowed Karna memories.
13. **Consequences:** Supply needs give Bhairava an independent task.
14. **Completion condition:** Crossing opened and protected group reaches safety. Require legitimate prerequisite progression; Mission60 completion is the proposed sequential dependency. Save through existing campaign authority with idempotent rewards; no fabricated completion history.
15. **Next mission connection:** Mission62 — COUNT WHAT REMAINS. Keep Bhairava useful without displacing Kalki's central journey.
16. **Evidence and expansion classification:**
- ORIGINAL GAME CONTENT — the numbered mission objectives, route subdivision, dialogue-free staging and completion checks are proposed game expansion.
- USER-APPROVED GAME ADAPTATION — adult Kalki from Mission60, continued Bhairava power continuity and the later campaign conflict. Individual task and player-assignment choices remain proposals.

## Mission 62: COUNT WHAT REMAINS

1. **Number, ID and title:** 62; `mission-62`; COUNT WHAT REMAINS.
2. **Story arc:** 7 — Kalki and the Horizon Keeper.
3. **Location:** Supply salvage spur.
4. **Main playable character:** Bhairava. No automatic mid-duel character switching.
5. **Characters involved:** Bhairava; Bujji.
6. **Story purpose:** Keep Bhairava useful without displacing Kalki's central journey.
7. **Opening cinematic:** Pan from depleted stores to a recoverable supply spur and Bhairava's familiar weapon. Display this mission's title and the objective below, then hand off to the existing third-person camera. Apply the shared Skip/Replay/Continue/Restart policy.
8. **Main objectives:** Recover usable stores; inspect transport damage; return the load.
9. **Exploration or investigation:** Find a safe bypass rather than clearing every enemy.
10. **Combat encounters:** Heavy guard and ranged lookout protect the stores.
11. **Boss encounter:** No arc-finale boss. Any local encounter explicitly listed above retains its existing identity; no extra boss is implied.
12. **Character development:** Experienced control contrasts with early bounty motives.
13. **Consequences:** Recovered records reveal the next Complex-facing route.
14. **Completion condition:** Required stores delivered once. Require legitimate prerequisite progression; Mission61 completion is the proposed sequential dependency. Save through existing campaign authority with idempotent rewards; no fabricated completion history.
15. **Next mission connection:** Mission63 — A PLACE TO STOP. Explain the continuing Yaskin threat without inventing verified future movie scenes.
16. **Evidence and expansion classification:**
- ORIGINAL GAME CONTENT — the numbered mission objectives, route subdivision, dialogue-free staging and completion checks are proposed game expansion.
- USER-APPROVED GAME ADAPTATION — adult Kalki from Mission60, continued Bhairava power continuity and the later campaign conflict. Individual task and player-assignment choices remain proposals.

## Mission 63: A PLACE TO STOP

1. **Number, ID and title:** 63; `mission-63`; A PLACE TO STOP.
2. **Story arc:** 7 — Kalki and the Horizon Keeper.
3. **Location:** Public records shelter.
4. **Main playable character:** Kalki. No automatic mid-duel character switching.
5. **Characters involved:** Kalki; Ashwatthama; Bhairava.
6. **Story purpose:** Explain the continuing Yaskin threat without inventing verified future movie scenes.
7. **Opening cinematic:** Frame surviving records against Kalki listening; any movie stinger reference is labeled historical context. Display this mission's title and the objective below, then hand off to the existing third-person camera. Apply the shared Skip/Replay/Continue/Restart policy.
8. **Main objectives:** Inspect threat records; ask about known facts; mark unknown information separately.
9. **Exploration or investigation:** Compare observation reports and route maps.
10. **Combat encounters:** An optional bounded interception protects the records.
11. **Boss encounter:** No arc-finale boss. Any local encounter explicitly listed above retains its existing identity; no extra boss is implied.
12. **Character development:** Kalki learns to distinguish certainty from warning.
13. **Consequences:** A surveillance path must be checked before advancing.
14. **Completion condition:** Evidence review and next-route selection complete. Require legitimate prerequisite progression; Mission62 completion is the proposed sequential dependency. Save through existing campaign authority with idempotent rewards; no fabricated completion history.
15. **Next mission connection:** Mission64 — THE LOST CLAIM. Map a safe route for Kalki.
16. **Evidence and expansion classification:**
- ORIGINAL GAME CONTENT — the numbered mission objectives, route subdivision, dialogue-free staging and completion checks are proposed game expansion.
- USER-APPROVED GAME ADAPTATION — adult Kalki from Mission60, continued Bhairava power continuity and the later campaign conflict. Individual task and player-assignment choices remain proposals.

## Mission 64: THE LOST CLAIM

1. **Number, ID and title:** 64; `mission-64`; THE LOST CLAIM.
2. **Story arc:** 7 — Kalki and the Horizon Keeper.
3. **Location:** Rocky surveillance ridge.
4. **Main playable character:** Bhairava. No automatic mid-duel character switching.
5. **Characters involved:** Bhairava; Bujji.
6. **Story purpose:** Map a safe route for Kalki.
7. **Opening cinematic:** Long-lens-style ridge framing reveals patrol spacing and a distant gate. Display this mission's title and the objective below, then hand off to the existing third-person camera. Apply the shared Skip/Replay/Continue/Restart policy.
8. **Main objectives:** Observe patrol cycles; mark two crossings; disable the relevant lookout signal.
9. **Exploration or investigation:** Reach an overlook through a hidden side path.
10. **Combat encounters:** One elite lookout encounter, not repeated waves.
11. **Boss encounter:** No arc-finale boss. Any local encounter explicitly listed above retains its existing identity; no extra boss is implied.
12. **Character development:** Bhairava uses judgment rather than pursuing a bounty.
13. **Consequences:** Kalki can attempt the service crossing.
14. **Completion condition:** Crossing information delivered and lookout task resolved. Require legitimate prerequisite progression; Mission63 completion is the proposed sequential dependency. Save through existing campaign authority with idempotent rewards; no fabricated completion history.
15. **Next mission connection:** Mission65 — ONE HONEST REPAIR. Develop positioning with Kalki's proposed baseline weapon kit.
16. **Evidence and expansion classification:**
- ORIGINAL GAME CONTENT — the numbered mission objectives, route subdivision, dialogue-free staging and completion checks are proposed game expansion.
- USER-APPROVED GAME ADAPTATION — adult Kalki from Mission60, continued Bhairava power continuity and the later campaign conflict. Individual task and player-assignment choices remain proposals.

## Mission 65: ONE HONEST REPAIR

1. **Number, ID and title:** 65; `mission-65`; ONE HONEST REPAIR.
2. **Story arc:** 7 — Kalki and the Horizon Keeper.
3. **Location:** Service bridge and maintenance ledge.
4. **Main playable character:** Kalki. No automatic mid-duel character switching.
5. **Characters involved:** Kalki; Bhairava.
6. **Story purpose:** Develop positioning with Kalki's proposed baseline weapon kit.
7. **Opening cinematic:** Track bridge width from side-on silhouette to rear playable framing. Display this mission's title and the objective below, then hand off to the existing third-person camera. Apply the shared Skip/Replay/Continue/Restart policy.
8. **Main objectives:** Cross the bridge; clear a damaged latch; defeat the blocking guard.
9. **Exploration or investigation:** Inspect maintenance footholds and safe landing space.
10. **Combat encounters:** A heavy opponent teaches spacing and recovery.
11. **Boss encounter:** No arc-finale boss. Any local encounter explicitly listed above retains its existing identity; no extra boss is implied.
12. **Character development:** Kalki acts on Bhairava's route intelligence.
13. **Consequences:** A cooperative route-opening task follows.
14. **Completion condition:** Bridge secured and latch opened. Require legitimate prerequisite progression; Mission64 completion is the proposed sequential dependency. Save through existing campaign authority with idempotent rewards; no fabricated completion history.
15. **Next mission connection:** Mission66 — SOMEONE STILL ASKING. Demonstrate complementary roles without simultaneous player control.
16. **Evidence and expansion classification:**
- ORIGINAL GAME CONTENT — the numbered mission objectives, route subdivision, dialogue-free staging and completion checks are proposed game expansion.
- USER-APPROVED GAME ADAPTATION — adult Kalki from Mission60, continued Bhairava power continuity and the later campaign conflict. Individual task and player-assignment choices remain proposals.

## Mission 66: SOMEONE STILL ASKING

1. **Number, ID and title:** 66; `mission-66`; SOMEONE STILL ASKING.
2. **Story arc:** 7 — Kalki and the Horizon Keeper.
3. **Location:** Paired passage mechanisms.
4. **Main playable character:** Bhairava. No automatic mid-duel character switching.
5. **Characters involved:** Bhairava; Bujji; Kalki outside active control.
6. **Story purpose:** Demonstrate complementary roles without simultaneous player control.
7. **Opening cinematic:** Two linked mechanisms share the frame, then the camera settles behind Bhairava. Display this mission's title and the objective below, then hand off to the existing third-person camera. Apply the shared Skip/Replay/Continue/Restart policy.
8. **Main objectives:** Restore the near mechanism; signal the established partner interaction; secure the corridor.
9. **Exploration or investigation:** Trace the mechanical connection before operating it.
10. **Combat encounters:** Small intercepting patrol at the mechanism.
11. **Boss encounter:** No arc-finale boss. Any local encounter explicitly listed above retains its existing identity; no extra boss is implied.
12. **Character development:** Divine power supports practical work rather than replacing it.
13. **Consequences:** Kalki takes the opened route toward the Keeper clues.
14. **Completion condition:** Both passage checks resolved through authored interactions. Require legitimate prerequisite progression; Mission65 completion is the proposed sequential dependency. Save through existing campaign authority with idempotent rewards; no fabricated completion history.
15. **Next mission connection:** Mission67 — BEFORE THE COMMANDER. Build readable knowledge of the original-game Horizon Keeper encounter.
16. **Evidence and expansion classification:**
- ORIGINAL GAME CONTENT — the numbered mission objectives, route subdivision, dialogue-free staging and completion checks are proposed game expansion.
- USER-APPROVED GAME ADAPTATION — adult Kalki from Mission60, continued Bhairava power continuity and the later campaign conflict. Individual task and player-assignment choices remain proposals.

## Mission 67: BEFORE THE COMMANDER

1. **Number, ID and title:** 67; `mission-67`; BEFORE THE COMMANDER.
2. **Story arc:** 7 — Kalki and the Horizon Keeper.
3. **Location:** Horizon approach ruins.
4. **Main playable character:** Kalki. No automatic mid-duel character switching.
5. **Characters involved:** Kalki; Ashwatthama.
6. **Story purpose:** Build readable knowledge of the original-game Horizon Keeper encounter.
7. **Opening cinematic:** Wide ruin arches lead to traces of lotus-blade lanes; do not show an absent boss as a live actor. Display this mission's title and the objective below, then hand off to the existing third-person camera. Apply the shared Skip/Replay/Continue/Restart policy.
8. **Main objectives:** Inspect arena traces; locate access controls; identify a retreat point.
9. **Exploration or investigation:** Study safe gaps suggested by environmental markings.
10. **Combat encounters:** A single approach sentinel uses ordinary existing attacks.
11. **Boss encounter:** No arc-finale boss. Any local encounter explicitly listed above retains its existing identity; no extra boss is implied.
12. **Character development:** Kalki prepares through observation.
13. **Consequences:** Bhairava secures the rear route before the duel approach.
14. **Completion condition:** Access controls and arena observations recorded. Require legitimate prerequisite progression; Mission66 completion is the proposed sequential dependency. Save through existing campaign authority with idempotent rewards; no fabricated completion history.
15. **Next mission connection:** Mission68 — THE OFFER REOPENED. Secure a fallback without deciding the future duel for Kalki.
16. **Evidence and expansion classification:**
- ORIGINAL GAME CONTENT — the numbered mission objectives, route subdivision, dialogue-free staging and completion checks are proposed game expansion.
- USER-APPROVED GAME ADAPTATION — adult Kalki from Mission60, continued Bhairava power continuity and the later campaign conflict. Individual task and player-assignment choices remain proposals.

## Mission 68: THE OFFER REOPENED

1. **Number, ID and title:** 68; `mission-68`; THE OFFER REOPENED.
2. **Story arc:** 7 — Kalki and the Horizon Keeper.
3. **Location:** Rear evacuation junction.
4. **Main playable character:** Bhairava. No automatic mid-duel character switching.
5. **Characters involved:** Bhairava; Bujji.
6. **Story purpose:** Secure a fallback without deciding the future duel for Kalki.
7. **Opening cinematic:** Track a retreat route from blocked gate to an open side lane. Display this mission's title and the objective below, then hand off to the existing third-person camera. Apply the shared Skip/Replay/Continue/Restart policy.
8. **Main objectives:** Clear a physical obstruction; repair the signal; protect one departure preparation.
9. **Exploration or investigation:** Locate the alternate exit and usable cover.
10. **Combat encounters:** A brief mixed encounter ends when the route is secured.
11. **Boss encounter:** No arc-finale boss. Any local encounter explicitly listed above retains its existing identity; no extra boss is implied.
12. **Character development:** He protects others without taking Kalki's decisive fight.
13. **Consequences:** Kalki advances to the final approach.
14. **Completion condition:** Fallback route operational. Require legitimate prerequisite progression; Mission67 completion is the proposed sequential dependency. Save through existing campaign authority with idempotent rewards; no fabricated completion history.
15. **Next mission connection:** Mission69 — PREPARE, NOT CELEBRATE. Separate pre-encounter preparation from the solo boss duel.
16. **Evidence and expansion classification:**
- ORIGINAL GAME CONTENT — the numbered mission objectives, route subdivision, dialogue-free staging and completion checks are proposed game expansion.
- USER-APPROVED GAME ADAPTATION — adult Kalki from Mission60, continued Bhairava power continuity and the later campaign conflict. Individual task and player-assignment choices remain proposals.

## Mission 69: PREPARE, NOT CELEBRATE

1. **Number, ID and title:** 69; `mission-69`; PREPARE, NOT CELEBRATE.
2. **Story arc:** 7 — Kalki and the Horizon Keeper.
3. **Location:** Keeper outer court.
4. **Main playable character:** Kalki. No automatic mid-duel character switching.
5. **Characters involved:** Kalki; Bhairava; Ashwatthama.
6. **Story purpose:** Separate pre-encounter preparation from the solo boss duel.
7. **Opening cinematic:** Reveal the outer court, locked inner threshold and waiting arena beyond. Display this mission's title and the objective below, then hand off to the existing third-person camera. Apply the shared Skip/Replay/Continue/Restart policy.
8. **Main objectives:** Resolve outer guards; inspect the inner threshold; deliberately enter when ready.
9. **Exploration or investigation:** Find supplies and read arena access instructions.
10. **Combat encounters:** Finite ordinary guards outside the eventual duel arena.
11. **Boss encounter:** No arc-finale boss. Any local encounter explicitly listed above retains its existing identity; no extra boss is implied.
12. **Character development:** Kalki commits after preparation, not through a forced cutscene win.
13. **Consequences:** Mission70 begins the dedicated Horizon Keeper confrontation.
14. **Completion condition:** Outer court secured and intentional arena-entry interaction. Require legitimate prerequisite progression; Mission68 completion is the proposed sequential dependency. Save through existing campaign authority with idempotent rewards; no fabricated completion history.
15. **Next mission connection:** Mission70 — A ROAD KEPT HIDDEN. Deliver the approved Kalki victory over the Horizon Keeper.
16. **Evidence and expansion classification:**
- ORIGINAL GAME CONTENT — the numbered mission objectives, route subdivision, dialogue-free staging and completion checks are proposed game expansion.
- USER-APPROVED GAME ADAPTATION — adult Kalki from Mission60, continued Bhairava power continuity and the later campaign conflict. Individual task and player-assignment choices remain proposals.

## Mission 70: A ROAD KEPT HIDDEN

1. **Number, ID and title:** 70; `mission-70`; A ROAD KEPT HIDDEN.
2. **Story arc:** 7 — Kalki and the Horizon Keeper.
3. **Location:** Horizon Keeper arena.
4. **Main playable character:** Kalki. No automatic mid-duel character switching.
5. **Characters involved:** Kalki; Horizon Keeper; Bhairava and Ashwatthama outside duel.
6. **Story purpose:** Deliver the approved Kalki victory over the Horizon Keeper.
7. **Opening cinematic:** Arena establishing shot; lotus-blade silhouette; rear Kalki stance; encounter title. Display this mission's title and the objective below, then hand off to the existing third-person camera. Apply the shared Skip/Replay/Continue/Restart policy.
8. **Main objectives:** Enter the duel; read lotus-blade telegraphs; adapt to horizon-reversal; defeat the Keeper.
9. **Exploration or investigation:** Inspect arena edges before triggering combat.
10. **Combat encounters:** True 1-vs-1 Horizon Keeper duel; preserve both named mechanics.
11. **Boss encounter:** Horizon Keeper — APPROVED STORY IDENTITY AND SLOT. Dedicated 1-vs-1 finale; see boss design for patterns, arena and victory checks.
12. **Character development:** Kalki earns the victory through player-controlled action.
13. **Consequences:** The Keeper is not Yaskin; the continuing threat opens the next campaign movement.
14. **Completion condition:** Actual boss defeat and victory acknowledgment. Require legitimate prerequisite progression; Mission69 completion is the proposed sequential dependency. Save through existing campaign authority with idempotent rewards; no fabricated completion history.
15. **Next mission connection:** Mission71 — TRUST THE BEARING. Turn the victory into a concrete onward route rather than an ending.
16. **Evidence and expansion classification:**
- ORIGINAL GAME CONTENT — the numbered mission objectives, route subdivision, dialogue-free staging and completion checks are proposed game expansion.
- USER-APPROVED GAME ADAPTATION — adult Kalki from Mission60, continued Bhairava power continuity and the later campaign conflict. Individual task and player-assignment choices remain proposals.
- USER-APPROVED GAME ADAPTATION — Kalki defeats the Horizon Keeper at Mission70.

