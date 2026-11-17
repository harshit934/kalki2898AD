# Phase8.9 — Arc 8: Routes toward the final war

Missions 71–80. Historical arc label: The concealed road. New grouping purpose is proposed design, not a source-data rewrite.

## Design status and shared lifecycle

This is STORY DESIGN ONLY, dated 2026-11-17. Every task arrangement below is proposed ORIGINAL GAME CONTENT unless a specific approved anchor is identified. A complete design is not an implemented or accepted mission. Historical source data, runtime IDs, rewards, saves and staging builds are unchanged.

Each introduction uses the existing Phase7 cinematic-director architecture as a future dependency: mission-specific scene framing, title, objective and supported story context; Skip safely returns control; replay changes neither progress nor rewards; Continue resumes a valid active checkpoint without unnecessarily replaying the introduction; explicit Restart replays it. Narrative Skip may resolve its own presentation beat, never fabricate combat victory, prerequisite history or unrelated objectives. Restore gameplay camera and keyboard/mobile control, pause safely, and clean up on exit. No new controller or permanent save authority is proposed. Mission completion requires the explicit conditions below; future implementation must preserve existing reward authority and grant rewards only once.

All new spaces below are proposed subareas or reuse of existing location families, not claims of implemented environments. Cast lists are story-design roles, not claims that models, voices, animations or NPC interactions exist. Use text or approved non-voice presentation where necessary; no cloned voice or movie audio.


## Mission 71: TRUST THE BEARING

1. **Number, ID and title:** 71; `mission-71`; TRUST THE BEARING.
2. **Story arc:** 8 — Routes toward the final war.
3. **Location:** Post-Keeper route overlook.
4. **Main playable character:** Kalki. No automatic mid-duel character switching.
5. **Characters involved:** Kalki; Bhairava; Ashwatthama.
6. **Story purpose:** Turn the victory into a concrete onward route rather than an ending.
7. **Opening cinematic:** Look back over the emptied arena, then reveal the distant approach road. Display this mission's title and the objective below, then hand off to the existing third-person camera. Apply the shared Skip/Replay/Continue/Restart policy.
8. **Main objectives:** Review the victory consequences; inspect the onward map; select the accessible passage.
9. **Exploration or investigation:** Identify a blocked direct route and viable alternative.
10. **Combat encounters:** Short exit obstruction encounter only if needed by the route.
11. **Boss encounter:** No arc-finale boss. Any local encounter explicitly listed above retains its existing identity; no extra boss is implied.
12. **Character development:** Kalki accepts that one victory did not resolve the larger conflict.
13. **Consequences:** Bhairava prepares supplies for the longer approach.
14. **Completion condition:** Route review and exit interaction. Require legitimate prerequisite progression; Mission70 completion is the proposed sequential dependency. Save through existing campaign authority with idempotent rewards; no fabricated completion history.
15. **Next mission connection:** Mission72 — NO VISIBLE GATE. Maintain the protected route behind Kalki.
16. **Evidence and expansion classification:**
- ORIGINAL GAME CONTENT — the numbered mission objectives, route subdivision, dialogue-free staging and completion checks are proposed game expansion.
- USER-APPROVED GAME ADAPTATION — adult Kalki from Mission60, continued Bhairava power continuity and the later campaign conflict. Individual task and player-assignment choices remain proposals.

## Mission 72: NO VISIBLE GATE

1. **Number, ID and title:** 72; `mission-72`; NO VISIBLE GATE.
2. **Story arc:** 8 — Routes toward the final war.
3. **Location:** Supply corridor.
4. **Main playable character:** Bhairava. No automatic mid-duel character switching.
5. **Characters involved:** Bhairava; Bujji.
6. **Story purpose:** Maintain the protected route behind Kalki.
7. **Opening cinematic:** Follow a vulnerable supply load through alternating cover. Display this mission's title and the objective below, then hand off to the existing third-person camera. Apply the shared Skip/Replay/Continue/Restart policy.
8. **Main objectives:** Recover two missing supply bundles; escort the load between cover points.
9. **Exploration or investigation:** Choose a short exposed route or longer covered route.
10. **Combat encounters:** Ranged harassment with finite attackers.
11. **Boss encounter:** No arc-finale boss. Any local encounter explicitly listed above retains its existing identity; no extra boss is implied.
12. **Character development:** Mastery is expressed through measured protection.
13. **Consequences:** The approach can sustain the next investigation.
14. **Completion condition:** Load delivered with required supplies. Require legitimate prerequisite progression; Mission71 completion is the proposed sequential dependency. Save through existing campaign authority with idempotent rewards; no fabricated completion history.
15. **Next mission connection:** Mission73 — THE LAST TURN. Investigate entry options without inventing an authorized Complex interior asset.
16. **Evidence and expansion classification:**
- ORIGINAL GAME CONTENT — the numbered mission objectives, route subdivision, dialogue-free staging and completion checks are proposed game expansion.
- USER-APPROVED GAME ADAPTATION — adult Kalki from Mission60, continued Bhairava power continuity and the later campaign conflict. Individual task and player-assignment choices remain proposals.

## Mission 73: THE LAST TURN

1. **Number, ID and title:** 73; `mission-73`; THE LAST TURN.
2. **Story arc:** 8 — Routes toward the final war.
3. **Location:** Complex-facing observation district.
4. **Main playable character:** Kalki. No automatic mid-duel character switching.
5. **Characters involved:** Kalki; Ashwatthama.
6. **Story purpose:** Investigate entry options without inventing an authorized Complex interior asset.
7. **Opening cinematic:** Establish the external skyline, public barriers and observation point. Display this mission's title and the objective below, then hand off to the existing third-person camera. Apply the shared Skip/Replay/Continue/Restart policy.
8. **Main objectives:** Compare access records; inspect the perimeter; identify a service approach.
9. **Exploration or investigation:** Discover a maintenance route behind existing architecture.
10. **Combat encounters:** A patrol checks the observation point.
11. **Boss encounter:** No arc-finale boss. Any local encounter explicitly listed above retains its existing identity; no extra boss is implied.
12. **Character development:** Kalki seeks evidence before confrontation.
13. **Consequences:** The route contains a ranged hazard crossing.
14. **Completion condition:** Service approach documented and marker reached. Require legitimate prerequisite progression; Mission72 completion is the proposed sequential dependency. Save through existing campaign authority with idempotent rewards; no fabricated completion history.
15. **Next mission connection:** Mission74 — A DIFFERENT SKY. Make defensive movement a mission-specific challenge.
16. **Evidence and expansion classification:**
- ORIGINAL GAME CONTENT — the numbered mission objectives, route subdivision, dialogue-free staging and completion checks are proposed game expansion.
- USER-APPROVED GAME ADAPTATION — adult Kalki from Mission60, continued Bhairava power continuity and the later campaign conflict. Individual task and player-assignment choices remain proposals.

## Mission 74: A DIFFERENT SKY

1. **Number, ID and title:** 74; `mission-74`; A DIFFERENT SKY.
2. **Story arc:** 8 — Routes toward the final war.
3. **Location:** Exposed service causeway.
4. **Main playable character:** Kalki. No automatic mid-duel character switching.
5. **Characters involved:** Kalki; Bhairava.
6. **Story purpose:** Make defensive movement a mission-specific challenge.
7. **Opening cinematic:** Side tracking shows cover intervals and sightlines before rear camera return. Display this mission's title and the objective below, then hand off to the existing third-person camera. Apply the shared Skip/Replay/Continue/Restart policy.
8. **Main objectives:** Cross between cover; disable the active firing position; open the far gate.
9. **Exploration or investigation:** Find a lower approach that changes the sightline.
10. **Combat encounters:** A small ranged-and-heavy pairing; no unavoidable damage.
11. **Boss encounter:** No arc-finale boss. Any local encounter explicitly listed above retains its existing identity; no extra boss is implied.
12. **Character development:** Kalki learns patience under pressure.
13. **Consequences:** Bujji's support route can now be prepared.
14. **Completion condition:** Firing position resolved and gate opened. Require legitimate prerequisite progression; Mission73 completion is the proposed sequential dependency. Save through existing campaign authority with idempotent rewards; no fabricated completion history.
15. **Next mission connection:** Mission75 — THE FORMALITIES. Give Bujji a meaningful logistical interaction without assuming driving mechanics.
16. **Evidence and expansion classification:**
- ORIGINAL GAME CONTENT — the numbered mission objectives, route subdivision, dialogue-free staging and completion checks are proposed game expansion.
- USER-APPROVED GAME ADAPTATION — adult Kalki from Mission60, continued Bhairava power continuity and the later campaign conflict. Individual task and player-assignment choices remain proposals.

## Mission 75: THE FORMALITIES

1. **Number, ID and title:** 75; `mission-75`; THE FORMALITIES.
2. **Story arc:** 8 — Routes toward the final war.
3. **Location:** Bujji staging bay.
4. **Main playable character:** Bhairava. No automatic mid-duel character switching.
5. **Characters involved:** Bhairava; Bujji.
6. **Story purpose:** Give Bujji a meaningful logistical interaction without assuming driving mechanics.
7. **Opening cinematic:** Reveal existing vehicle silhouette, damaged bay fixtures and a clear departure lane. Display this mission's title and the objective below, then hand off to the existing third-person camera. Apply the shared Skip/Replay/Continue/Restart policy.
8. **Main objectives:** Inspect the bay; recover a repair component; assist Bujji's departure preparation.
9. **Exploration or investigation:** Locate the component by following damage evidence.
10. **Combat encounters:** One close-range interruption during retrieval.
11. **Boss encounter:** No arc-finale boss. Any local encounter explicitly listed above retains its existing identity; no extra boss is implied.
12. **Character development:** Partnership is practical and reciprocal.
13. **Consequences:** A relay must keep the next corridor coordinated.
14. **Completion condition:** Repair and departure checks complete. Require legitimate prerequisite progression; Mission74 completion is the proposed sequential dependency. Save through existing campaign authority with idempotent rewards; no fabricated completion history.
15. **Next mission connection:** Mission76 — STAY WITH THE VEHICLE. Protect communications through active interaction.
16. **Evidence and expansion classification:**
- ORIGINAL GAME CONTENT — the numbered mission objectives, route subdivision, dialogue-free staging and completion checks are proposed game expansion.
- USER-APPROVED GAME ADAPTATION — adult Kalki from Mission60, continued Bhairava power continuity and the later campaign conflict. Individual task and player-assignment choices remain proposals.

## Mission 76: STAY WITH THE VEHICLE

1. **Number, ID and title:** 76; `mission-76`; STAY WITH THE VEHICLE.
2. **Story arc:** 8 — Routes toward the final war.
3. **Location:** Relay courtyard.
4. **Main playable character:** Kalki. No automatic mid-duel character switching.
5. **Characters involved:** Kalki; Bujji remotely where supported.
6. **Story purpose:** Protect communications through active interaction.
7. **Opening cinematic:** Crane-like wide framing reveals relay, cover and two access lanes. Display this mission's title and the objective below, then hand off to the existing third-person camera. Apply the shared Skip/Replay/Continue/Restart policy.
8. **Main objectives:** Restore relay power; protect the repair interaction; confirm the route signal.
9. **Exploration or investigation:** Trace the disconnected line to its source.
10. **Combat encounters:** Finite attackers arrive from readable access points.
11. **Boss encounter:** No arc-finale boss. Any local encounter explicitly listed above retains its existing identity; no extra boss is implied.
12. **Character development:** Kalki protects coordination rather than chasing fleeing targets.
13. **Consequences:** Conflicting route information warrants investigation.
14. **Completion condition:** Relay restored and signal confirmed. Require legitimate prerequisite progression; Mission75 completion is the proposed sequential dependency. Save through existing campaign authority with idempotent rewards; no fabricated completion history.
15. **Next mission connection:** Mission77 — WATER AND STONE. Resolve conflicting intelligence without inventing a named betrayer.
16. **Evidence and expansion classification:**
- ORIGINAL GAME CONTENT — the numbered mission objectives, route subdivision, dialogue-free staging and completion checks are proposed game expansion.
- USER-APPROVED GAME ADAPTATION — adult Kalki from Mission60, continued Bhairava power continuity and the later campaign conflict. Individual task and player-assignment choices remain proposals.

## Mission 77: WATER AND STONE

1. **Number, ID and title:** 77; `mission-77`; WATER AND STONE.
2. **Story arc:** 8 — Routes toward the final war.
3. **Location:** Intercepted-records alcove.
4. **Main playable character:** Bhairava. No automatic mid-duel character switching.
5. **Characters involved:** Bhairava; Ashwatthama.
6. **Story purpose:** Resolve conflicting intelligence without inventing a named betrayer.
7. **Opening cinematic:** Close framing compares damaged records, then widens to the access route. Display this mission's title and the objective below, then hand off to the existing third-person camera. Apply the shared Skip/Replay/Continue/Restart policy.
8. **Main objectives:** Recover both records; compare their source markers; mark the supported route.
9. **Exploration or investigation:** Inspect tampering evidence without assigning an unsupported culprit.
10. **Combat encounters:** A single elite guard protects the alcove.
11. **Boss encounter:** No arc-finale boss. Any local encounter explicitly listed above retains its existing identity; no extra boss is implied.
12. **Character development:** Experience means admitting what the evidence cannot establish.
13. **Consequences:** Kalki can secure a civilian passage.
14. **Completion condition:** Supported route selected and uncertainty retained in briefing. Require legitimate prerequisite progression; Mission76 completion is the proposed sequential dependency. Save through existing campaign authority with idempotent rewards; no fabricated completion history.
15. **Next mission connection:** Mission78 — THE ESCORT’S PACE. Create an active protection mission rather than an unattended survival timer.
16. **Evidence and expansion classification:**
- ORIGINAL GAME CONTENT — the numbered mission objectives, route subdivision, dialogue-free staging and completion checks are proposed game expansion.
- USER-APPROVED GAME ADAPTATION — adult Kalki from Mission60, continued Bhairava power continuity and the later campaign conflict. Individual task and player-assignment choices remain proposals.

## Mission 78: THE ESCORT’S PACE

1. **Number, ID and title:** 78; `mission-78`; THE ESCORT’S PACE.
2. **Story arc:** 8 — Routes toward the final war.
3. **Location:** Sheltered passage.
4. **Main playable character:** Kalki. No automatic mid-duel character switching.
5. **Characters involved:** Kalki; Bhairava; protected group as proposed cast.
6. **Story purpose:** Create an active protection mission rather than an unattended survival timer.
7. **Opening cinematic:** Track from unsafe open ground to the sheltered exit. Display this mission's title and the objective below, then hand off to the existing third-person camera. Apply the shared Skip/Replay/Continue/Restart policy.
8. **Main objectives:** Open cover gates; interrupt attackers threatening the passage; escort the group through.
9. **Exploration or investigation:** Discover a side gate that shortens exposure.
10. **Combat encounters:** Small bounded encounters at distinct gates.
11. **Boss encounter:** No arc-finale boss. Any local encounter explicitly listed above retains its existing identity; no extra boss is implied.
12. **Character development:** Responsibility is demonstrated through route choices.
13. **Consequences:** The last approach to an outer strongpoint is available.
14. **Completion condition:** Protected group reaches the sheltered destination. Require legitimate prerequisite progression; Mission77 completion is the proposed sequential dependency. Save through existing campaign authority with idempotent rewards; no fabricated completion history.
15. **Next mission connection:** Mission79 — AN UNFINISHED INTENTION. Prepare the next arc duel with a clear arena boundary.
16. **Evidence and expansion classification:**
- ORIGINAL GAME CONTENT — the numbered mission objectives, route subdivision, dialogue-free staging and completion checks are proposed game expansion.
- USER-APPROVED GAME ADAPTATION — adult Kalki from Mission60, continued Bhairava power continuity and the later campaign conflict. Individual task and player-assignment choices remain proposals.

## Mission 79: AN UNFINISHED INTENTION

1. **Number, ID and title:** 79; `mission-79`; AN UNFINISHED INTENTION.
2. **Story arc:** 8 — Routes toward the final war.
3. **Location:** Outer strongpoint access.
4. **Main playable character:** Kalki. No automatic mid-duel character switching.
5. **Characters involved:** Kalki; Bhairava.
6. **Story purpose:** Prepare the next arc duel with a clear arena boundary.
7. **Opening cinematic:** Wide fortification silhouette leads through a quiet preparation area to the duel entrance. Display this mission's title and the objective below, then hand off to the existing third-person camera. Apply the shared Skip/Replay/Continue/Restart policy.
8. **Main objectives:** Inspect the strongpoint; secure the access latch; choose the duel entrance deliberately.
9. **Exploration or investigation:** Find supplies and read charge-lane geometry.
10. **Combat encounters:** One pre-duel guard encounter outside the arena.
11. **Boss encounter:** No arc-finale boss. Any local encounter explicitly listed above retains its existing identity; no extra boss is implied.
12. **Character development:** Kalki prepares instead of stumbling into an untelegraphed boss.
13. **Consequences:** Mission80 isolates the proposed strongpoint boss.
14. **Completion condition:** Access secured and arena-entry interaction. Require legitimate prerequisite progression; Mission78 completion is the proposed sequential dependency. Save through existing campaign authority with idempotent rewards; no fabricated completion history.
15. **Next mission connection:** Mission80 — THE TREE AHEAD. Break a fortified obstruction through a proposed solo encounter.
16. **Evidence and expansion classification:**
- ORIGINAL GAME CONTENT — the numbered mission objectives, route subdivision, dialogue-free staging and completion checks are proposed game expansion.
- USER-APPROVED GAME ADAPTATION — adult Kalki from Mission60, continued Bhairava power continuity and the later campaign conflict. Individual task and player-assignment choices remain proposals.

## Mission 80: THE TREE AHEAD

1. **Number, ID and title:** 80; `mission-80`; THE TREE AHEAD.
2. **Story arc:** 8 — Routes toward the final war.
3. **Location:** Existing wasteland strongpoint adapted as duel court.
4. **Main playable character:** Kalki. No automatic mid-duel character switching.
5. **Characters involved:** Kalki; Proposed Bastion Ram.
6. **Story purpose:** Break a fortified obstruction through a proposed solo encounter.
7. **Opening cinematic:** Show charge scars, the boss silhouette and Kalki at opposing arena edges. Display this mission's title and the objective below, then hand off to the existing third-person camera. Apply the shared Skip/Replay/Continue/Restart policy.
8. **Main objectives:** Read charge telegraphs; exploit recovery; defeat the proposed boss.
9. **Exploration or investigation:** Inspect stable cover before beginning the duel.
10. **Combat encounters:** True 1-vs-1 Bastion Ram proposal; no mandatory adds.
11. **Boss encounter:** Bastion Ram — PROPOSED FOR REVIEW. Dedicated 1-vs-1 finale; see boss design for patterns, arena and victory checks.
12. **Character development:** Kalki wins through position and restraint.
13. **Consequences:** The victory exposes the next supply-and-siege approach.
14. **Completion condition:** Player defeats the boss and opens the route. Require legitimate prerequisite progression; Mission79 completion is the proposed sequential dependency. Save through existing campaign authority with idempotent rewards; no fabricated completion history.
15. **Next mission connection:** Mission81 — ALARM ACROSS THE STONE. Convert the breach into a coordinated final approach.
16. **Evidence and expansion classification:**
- ORIGINAL GAME CONTENT — the numbered mission objectives, route subdivision, dialogue-free staging and completion checks are proposed game expansion.
- USER-APPROVED GAME ADAPTATION — adult Kalki from Mission60, continued Bhairava power continuity and the later campaign conflict. Individual task and player-assignment choices remain proposals.

