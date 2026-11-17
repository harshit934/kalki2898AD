# Phase8.9 — Arc 9: The siege approach

Missions 81–90. Historical arc label: When the walls shake. New grouping purpose is proposed design, not a source-data rewrite.

## Design status and shared lifecycle

This is STORY DESIGN ONLY, dated 2026-11-17. Every task arrangement below is proposed ORIGINAL GAME CONTENT unless a specific approved anchor is identified. A complete design is not an implemented or accepted mission. Historical source data, runtime IDs, rewards, saves and staging builds are unchanged.

Each introduction uses the existing Phase7 cinematic-director architecture as a future dependency: mission-specific scene framing, title, objective and supported story context; Skip safely returns control; replay changes neither progress nor rewards; Continue resumes a valid active checkpoint without unnecessarily replaying the introduction; explicit Restart replays it. Narrative Skip may resolve its own presentation beat, never fabricate combat victory, prerequisite history or unrelated objectives. Restore gameplay camera and keyboard/mobile control, pause safely, and clean up on exit. No new controller or permanent save authority is proposed. Mission completion requires the explicit conditions below; future implementation must preserve existing reward authority and grant rewards only once.

All new spaces below are proposed subareas or reuse of existing location families, not claims of implemented environments. Cast lists are story-design roles, not claims that models, voices, animations or NPC interactions exist. Use text or approved non-voice presentation where necessary; no cloned voice or movie audio.


## Mission 81: ALARM ACROSS THE STONE

1. **Number, ID and title:** 81; `mission-81`; ALARM ACROSS THE STONE.
2. **Story arc:** 9 — The siege approach.
3. **Location:** Beyond-strongpoint overlook.
4. **Main playable character:** Kalki. No automatic mid-duel character switching.
5. **Characters involved:** Kalki; Ashwatthama.
6. **Story purpose:** Convert the breach into a coordinated final approach.
7. **Opening cinematic:** Rear wide shot frames the newly opened road and distant barriers. Display this mission's title and the objective below, then hand off to the existing third-person camera. Apply the shared Skip/Replay/Continue/Restart policy.
8. **Main objectives:** Survey three route points; compare danger; mark the supported approach.
9. **Exploration or investigation:** Find a sheltered observation ledge.
10. **Combat encounters:** A lone scouting pair can be avoided or defeated.
11. **Boss encounter:** No arc-finale boss. Any local encounter explicitly listed above retains its existing identity; no extra boss is implied.
12. **Character development:** Kalki weighs risk for those following.
13. **Consequences:** Bhairava must restore its supply link.
14. **Completion condition:** Route survey complete and approach selected. Require legitimate prerequisite progression; Mission80 completion is the proposed sequential dependency. Save through existing campaign authority with idempotent rewards; no fabricated completion history.
15. **Next mission connection:** Mission82 — A ROUTE THROUGH SMOKE. Keep the campaign's rear support connected.
16. **Evidence and expansion classification:**
- ORIGINAL GAME CONTENT — the numbered mission objectives, route subdivision, dialogue-free staging and completion checks are proposed game expansion.
- USER-APPROVED GAME ADAPTATION — adult Kalki from Mission60, continued Bhairava power continuity and the later campaign conflict. Individual task and player-assignment choices remain proposals.

## Mission 82: A ROUTE THROUGH SMOKE

1. **Number, ID and title:** 82; `mission-82`; A ROUTE THROUGH SMOKE.
2. **Story arc:** 9 — The siege approach.
3. **Location:** Broken supply span.
4. **Main playable character:** Bhairava. No automatic mid-duel character switching.
5. **Characters involved:** Bhairava; Bujji.
6. **Story purpose:** Keep the campaign's rear support connected.
7. **Opening cinematic:** Follow the broken span down to a repair path rather than introducing a new world. Display this mission's title and the objective below, then hand off to the existing third-person camera. Apply the shared Skip/Replay/Continue/Restart policy.
8. **Main objectives:** Recover supports; operate the existing bridge mechanism; deliver route confirmation.
9. **Exploration or investigation:** Investigate a lower repair path.
10. **Combat encounters:** A heavy guard controls the mechanism.
11. **Boss encounter:** No arc-finale boss. Any local encounter explicitly listed above retains its existing identity; no extra boss is implied.
12. **Character development:** Mastered strength serves repair and protection.
13. **Consequences:** Kalki can investigate the forward control point.
14. **Completion condition:** Span operational and confirmation delivered. Require legitimate prerequisite progression; Mission81 completion is the proposed sequential dependency. Save through existing campaign authority with idempotent rewards; no fabricated completion history.
15. **Next mission connection:** Mission83 — THE CONTRACT REMAINS. Identify the final approach's control dependencies.
16. **Evidence and expansion classification:**
- ORIGINAL GAME CONTENT — the numbered mission objectives, route subdivision, dialogue-free staging and completion checks are proposed game expansion.
- USER-APPROVED GAME ADAPTATION — adult Kalki from Mission60, continued Bhairava power continuity and the later campaign conflict. Individual task and player-assignment choices remain proposals.

## Mission 83: THE CONTRACT REMAINS

1. **Number, ID and title:** 83; `mission-83`; THE CONTRACT REMAINS.
2. **Story arc:** 9 — The siege approach.
3. **Location:** Forward control-point exterior.
4. **Main playable character:** Kalki. No automatic mid-duel character switching.
5. **Characters involved:** Kalki; Bhairava.
6. **Story purpose:** Identify the final approach's control dependencies.
7. **Opening cinematic:** Pan between closed barriers and their visible control connections. Display this mission's title and the objective below, then hand off to the existing third-person camera. Apply the shared Skip/Replay/Continue/Restart policy.
8. **Main objectives:** Inspect control markings; retrieve the relevant access record; identify the next mechanism.
9. **Exploration or investigation:** Trace cables and physical access routes.
10. **Combat encounters:** Ranged lookout and ordinary guard protect the record.
11. **Boss encounter:** No arc-finale boss. Any local encounter explicitly listed above retains its existing identity; no extra boss is implied.
12. **Character development:** Kalki uses concrete information rather than unexplained access powers.
13. **Consequences:** A power-routing task can now be performed.
14. **Completion condition:** Record recovered and mechanism identified. Require legitimate prerequisite progression; Mission82 completion is the proposed sequential dependency. Save through existing campaign authority with idempotent rewards; no fabricated completion history.
15. **Next mission connection:** Mission84 — ONE BLOCKING UNIT. Create a spatial interaction challenge within the existing architecture.
16. **Evidence and expansion classification:**
- ORIGINAL GAME CONTENT — the numbered mission objectives, route subdivision, dialogue-free staging and completion checks are proposed game expansion.
- USER-APPROVED GAME ADAPTATION — adult Kalki from Mission60, continued Bhairava power continuity and the later campaign conflict. Individual task and player-assignment choices remain proposals.

## Mission 84: ONE BLOCKING UNIT

1. **Number, ID and title:** 84; `mission-84`; ONE BLOCKING UNIT.
2. **Story arc:** 9 — The siege approach.
3. **Location:** Power-routing terraces.
4. **Main playable character:** Kalki. No automatic mid-duel character switching.
5. **Characters involved:** Kalki; Bujji remotely where supported.
6. **Story purpose:** Create a spatial interaction challenge within the existing architecture.
7. **Opening cinematic:** Step the camera across linked terraces, ending on the route switch. Display this mission's title and the objective below, then hand off to the existing third-person camera. Apply the shared Skip/Replay/Continue/Restart policy.
8. **Main objectives:** Restore the required connections in sequence; open the service gate.
9. **Exploration or investigation:** Choose a safe terrace order and inspect inactive branches.
10. **Combat encounters:** A bounded interruption at the final switch.
11. **Boss encounter:** No arc-finale boss. Any local encounter explicitly listed above retains its existing identity; no extra boss is implied.
12. **Character development:** Patience and navigation matter alongside combat.
13. **Consequences:** Bhairava secures the newly exposed flank.
14. **Completion condition:** Valid routing sequence and gate-open check. Require legitimate prerequisite progression; Mission83 completion is the proposed sequential dependency. Save through existing campaign authority with idempotent rewards; no fabricated completion history.
15. **Next mission connection:** Mission85 — BUJJI AT THE TURN. Protect the route from being cut behind Kalki.
16. **Evidence and expansion classification:**
- ORIGINAL GAME CONTENT — the numbered mission objectives, route subdivision, dialogue-free staging and completion checks are proposed game expansion.
- USER-APPROVED GAME ADAPTATION — adult Kalki from Mission60, continued Bhairava power continuity and the later campaign conflict. Individual task and player-assignment choices remain proposals.

## Mission 85: BUJJI AT THE TURN

1. **Number, ID and title:** 85; `mission-85`; BUJJI AT THE TURN.
2. **Story arc:** 9 — The siege approach.
3. **Location:** Exposed flank passage.
4. **Main playable character:** Bhairava. No automatic mid-duel character switching.
5. **Characters involved:** Bhairava; Ashwatthama.
6. **Story purpose:** Protect the route from being cut behind Kalki.
7. **Opening cinematic:** Frame vulnerable passage supports and safe cover from a low rear angle. Display this mission's title and the objective below, then hand off to the existing third-person camera. Apply the shared Skip/Replay/Continue/Restart policy.
8. **Main objectives:** Locate the sabotage point; stop the finite attackers; stabilize the support.
9. **Exploration or investigation:** Find the actual weak point through visible damage.
10. **Combat encounters:** Elite-and-ranged pair with readable recovery.
11. **Boss encounter:** No arc-finale boss. Any local encounter explicitly listed above retains its existing identity; no extra boss is implied.
12. **Character development:** Bhairava refuses to abandon the people using the route.
13. **Consequences:** Kalki advances to the inspection zone.
14. **Completion condition:** Support stabilized and attackers resolved. Require legitimate prerequisite progression; Mission84 completion is the proposed sequential dependency. Save through existing campaign authority with idempotent rewards; no fabricated completion history.
15. **Next mission connection:** Mission86 — A PASSAGE FOR OTHERS. Reveal what must be done before the final siege route opens.
16. **Evidence and expansion classification:**
- ORIGINAL GAME CONTENT — the numbered mission objectives, route subdivision, dialogue-free staging and completion checks are proposed game expansion.
- USER-APPROVED GAME ADAPTATION — adult Kalki from Mission60, continued Bhairava power continuity and the later campaign conflict. Individual task and player-assignment choices remain proposals.

## Mission 86: A PASSAGE FOR OTHERS

1. **Number, ID and title:** 86; `mission-86`; A PASSAGE FOR OTHERS.
2. **Story arc:** 9 — The siege approach.
3. **Location:** Inspection zone and sealed threshold.
4. **Main playable character:** Kalki. No automatic mid-duel character switching.
5. **Characters involved:** Kalki; Bhairava.
6. **Story purpose:** Reveal what must be done before the final siege route opens.
7. **Opening cinematic:** Slow side move across sealed threshold, evidence board and playable approach. Display this mission's title and the objective below, then hand off to the existing third-person camera. Apply the shared Skip/Replay/Continue/Restart policy.
8. **Main objectives:** Inspect the threshold; recover a missing control element; verify the safe opening sequence.
9. **Exploration or investigation:** Search a bounded service alcove.
10. **Combat encounters:** One guarded retrieval, not a repeated arena wave.
11. **Boss encounter:** No arc-finale boss. Any local encounter explicitly listed above retains its existing identity; no extra boss is implied.
12. **Character development:** Kalki learns the cost of a reckless breach.
13. **Consequences:** A support diversion can create an opening.
14. **Completion condition:** Control element installed and safe sequence confirmed. Require legitimate prerequisite progression; Mission85 completion is the proposed sequential dependency. Save through existing campaign authority with idempotent rewards; no fabricated completion history.
15. **Next mission connection:** Mission87 — THE HEAVY STEP. Create a bounded diversion without inventing a new story betrayal.
16. **Evidence and expansion classification:**
- ORIGINAL GAME CONTENT — the numbered mission objectives, route subdivision, dialogue-free staging and completion checks are proposed game expansion.
- USER-APPROVED GAME ADAPTATION — adult Kalki from Mission60, continued Bhairava power continuity and the later campaign conflict. Individual task and player-assignment choices remain proposals.

## Mission 87: THE HEAVY STEP

1. **Number, ID and title:** 87; `mission-87`; THE HEAVY STEP.
2. **Story arc:** 9 — The siege approach.
3. **Location:** Secondary access yard.
4. **Main playable character:** Bhairava. No automatic mid-duel character switching.
5. **Characters involved:** Bhairava; Bujji.
6. **Story purpose:** Create a bounded diversion without inventing a new story betrayal.
7. **Opening cinematic:** Establish a secondary signal post and the primary route in the distance. Display this mission's title and the objective below, then hand off to the existing third-person camera. Apply the shared Skip/Replay/Continue/Restart policy.
8. **Main objectives:** Operate the decoy signal; hold the escape lane; leave once the route confirmation arrives.
9. **Exploration or investigation:** Locate cover and a reliable withdrawal path.
10. **Combat encounters:** Finite patrol response; completion requires withdrawal, not endless kills.
11. **Boss encounter:** No arc-finale boss. Any local encounter explicitly listed above retains its existing identity; no extra boss is implied.
12. **Character development:** He supports Kalki without replacing him.
13. **Consequences:** Kalki exploits the resulting service opening.
14. **Completion condition:** Signal task and safe withdrawal complete. Require legitimate prerequisite progression; Mission86 completion is the proposed sequential dependency. Save through existing campaign authority with idempotent rewards; no fabricated completion history.
15. **Next mission connection:** Mission88 — WHERE THE LINES CROSS. Turn support work into tangible forward movement.
16. **Evidence and expansion classification:**
- ORIGINAL GAME CONTENT — the numbered mission objectives, route subdivision, dialogue-free staging and completion checks are proposed game expansion.
- USER-APPROVED GAME ADAPTATION — adult Kalki from Mission60, continued Bhairava power continuity and the later campaign conflict. Individual task and player-assignment choices remain proposals.

## Mission 88: WHERE THE LINES CROSS

1. **Number, ID and title:** 88; `mission-88`; WHERE THE LINES CROSS.
2. **Story arc:** 9 — The siege approach.
3. **Location:** Service opening and siege approach.
4. **Main playable character:** Kalki. No automatic mid-duel character switching.
5. **Characters involved:** Kalki; Ashwatthama.
6. **Story purpose:** Turn support work into tangible forward movement.
7. **Opening cinematic:** Track through the opened service route to the siege structure beyond. Display this mission's title and the objective below, then hand off to the existing third-person camera. Apply the shared Skip/Replay/Continue/Restart policy.
8. **Main objectives:** Traverse the opening; clear a physical obstruction; mark the siege arena entrance.
9. **Exploration or investigation:** Find an optional supply recess.
10. **Combat encounters:** A small pre-arena encounter with retreat room.
11. **Boss encounter:** No arc-finale boss. Any local encounter explicitly listed above retains its existing identity; no extra boss is implied.
12. **Character development:** Kalki acknowledges the support that made the route possible.
13. **Consequences:** The siege threat can be studied before engagement.
14. **Completion condition:** Obstruction cleared and entrance reached. Require legitimate prerequisite progression; Mission87 completion is the proposed sequential dependency. Save through existing campaign authority with idempotent rewards; no fabricated completion history.
15. **Next mission connection:** Mission89 — BEHIND THE BARRIER. Teach the next boss's geometry before the solo duel.
16. **Evidence and expansion classification:**
- ORIGINAL GAME CONTENT — the numbered mission objectives, route subdivision, dialogue-free staging and completion checks are proposed game expansion.
- USER-APPROVED GAME ADAPTATION — adult Kalki from Mission60, continued Bhairava power continuity and the later campaign conflict. Individual task and player-assignment choices remain proposals.

## Mission 89: BEHIND THE BARRIER

1. **Number, ID and title:** 89; `mission-89`; BEHIND THE BARRIER.
2. **Story arc:** 9 — The siege approach.
3. **Location:** Siege observation platform.
4. **Main playable character:** Kalki. No automatic mid-duel character switching.
5. **Characters involved:** Kalki; Bhairava.
6. **Story purpose:** Teach the next boss's geometry before the solo duel.
7. **Opening cinematic:** High wide shot shows bombardment lanes and safe arcs, then returns to the character. Display this mission's title and the objective below, then hand off to the existing third-person camera. Apply the shared Skip/Replay/Continue/Restart policy.
8. **Main objectives:** Inspect impact marks; disable the outer alarm; deliberately enter the arena.
9. **Exploration or investigation:** Read safe gaps from existing terrain.
10. **Combat encounters:** One outer guard; no adds carried into the duel.
11. **Boss encounter:** No arc-finale boss. Any local encounter explicitly listed above retains its existing identity; no extra boss is implied.
12. **Character development:** Preparation replaces blind aggression.
13. **Consequences:** Mission90 begins the proposed siege duel.
14. **Completion condition:** Alarm resolved and arena-entry interaction. Require legitimate prerequisite progression; Mission88 completion is the proposed sequential dependency. Save through existing campaign authority with idempotent rewards; no fabricated completion history.
15. **Next mission connection:** Mission90 — THE WEAPON’S MOMENT. Resolve the last original-game arc obstacle before the final story arc.
16. **Evidence and expansion classification:**
- ORIGINAL GAME CONTENT — the numbered mission objectives, route subdivision, dialogue-free staging and completion checks are proposed game expansion.
- USER-APPROVED GAME ADAPTATION — adult Kalki from Mission60, continued Bhairava power continuity and the later campaign conflict. Individual task and player-assignment choices remain proposals.

## Mission 90: THE WEAPON’S MOMENT

1. **Number, ID and title:** 90; `mission-90`; THE WEAPON’S MOMENT.
2. **Story arc:** 9 — The siege approach.
3. **Location:** Existing rocky siege platform adapted as arena.
4. **Main playable character:** Kalki. No automatic mid-duel character switching.
5. **Characters involved:** Kalki; Proposed Siege Astrolabe.
6. **Story purpose:** Resolve the last original-game arc obstacle before the final story arc.
7. **Opening cinematic:** Reveal rotating siege silhouette, marked impact lanes and Kalki's approach. Display this mission's title and the objective below, then hand off to the existing third-person camera. Apply the shared Skip/Replay/Continue/Restart policy.
8. **Main objectives:** Avoid marked bombardment; exploit rotation recovery; defeat the proposed boss.
9. **Exploration or investigation:** Inspect the platform boundary before activation.
10. **Combat encounters:** True 1-vs-1 Siege Astrolabe proposal; no mandatory waves.
11. **Boss encounter:** Siege Astrolabe — PROPOSED FOR REVIEW. Dedicated 1-vs-1 finale; see boss design for patterns, arena and victory checks.
12. **Character development:** Kalki earns access to the final approach.
13. **Consequences:** Bhairava investigates a familiar object without losing existing powers.
14. **Completion condition:** Player defeat of the boss and route-open acknowledgment. Require legitimate prerequisite progression; Mission89 completion is the proposed sequential dependency. Save through existing campaign authority with idempotent rewards; no fabricated completion history.
15. **Next mission connection:** Mission91 — A FAMILIAR WEIGHT. Retain intentional weapon inspection while proposing a meaning compatible with an already-known legacy.
16. **Evidence and expansion classification:**
- ORIGINAL GAME CONTENT — the numbered mission objectives, route subdivision, dialogue-free staging and completion checks are proposed game expansion.
- USER-APPROVED GAME ADAPTATION — adult Kalki from Mission60, continued Bhairava power continuity and the later campaign conflict. Individual task and player-assignment choices remain proposals.

