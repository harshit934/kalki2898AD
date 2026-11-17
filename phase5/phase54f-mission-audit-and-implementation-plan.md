# Phase 5.4F audit, inventory and controlled implementation plan

**Status: audit/design only for new content. Full Phase 5.4F is incomplete; release acceptance is REJECT at this checkpoint.** The 19 definitions have successful functional route evidence. That does not make them 19 finished production missions or establish a complete campaign. No planned entry was enabled by this audit.

## Baseline and preservation

- Authoritative archive: 100 stable IDs in ten arcs; 19 implemented gameplay definitions and 81 unbuilt story entries.
- A normal new campaign currently reaches Mission 10, then unlocks unbuilt Mission 11. Later arc duels were tested with disposable explicit unlock fixtures, not an uninterrupted 100-mission playthrough.
- All 139 files in the validated source snapshot are unchanged. One additional unimported draft catalog exists; it cannot alter runtime playability. Drafts for M13/M15/M18/M19 conflict with source goals and will not be enabled as written.
- 47/47 protected hashes and all 14 prior final-Kashi GLBs match. The original environment remains default, the revised Kashi stays opt-in, existing saves were not opened/reset, and sprint remains unlimited.
- The original Blender export is a new unintegrated candidate: 392,356 triangles, 26 mesh objects, 60,976,156 bytes. Those numbers do not establish visual quality. Its loading, memory, collision, LOD and visual costs are unaccepted.

[Source preservation](phase54f-stabilization-20261114/audit-source-preservation.json) | [Protected/change hashes](phase54f-stabilization-20261114/changes-and-hashes.json) | [Validated rollback checkpoint](phase54f-stabilization-20261114/validated-checkpoint.md)

## What the existing 19 actually complete

| Mission | Existing implemented route | Fresh evidence | Remaining production scope |
|---|---|---|---|
| M01 A BOUNTY IN THE DUST | Patrols, Warden, relic, optional scans, original natural ending | PASS: ordinary input, relic/reward/reload | Opt-in art rejected; residual ending gap; first-clear not repeated |
| M02 THE GLASS WASTES | Pylons, Sovereign; separate Bujji contract/duel/chase | PASS: ordinary input, relic/reward/reload | Story/art polish; completion MP4 skipped; no fresh route-specific 1080p benchmark |
| M03 ONE MORE JOB | 3 proximity objectives, 3 guards, boss and relic | PASS: ordinary input, relic/reward/reload | Story/art polish; completion MP4 skipped; no fresh route-specific 1080p benchmark |
| M04 THE DRIVER’S DEBT | 3 proximity objectives, 4 guards, boss and relic | PASS: ordinary input, relic/reward/reload | Story/art polish; completion MP4 skipped; no fresh route-specific 1080p benchmark |
| M05 A CITY OF TIERS | 3 proximity objectives, 4 guards, boss and relic | PASS: ordinary input, relic/reward/reload | Story/art polish; completion MP4 skipped; no fresh route-specific 1080p benchmark |
| M06 THE BOUNTY BOARD | 3 proximity objectives, 3 guards, boss and relic | PASS: ordinary input, relic/reward/reload | Story/art polish; completion MP4 skipped; no fresh route-specific 1080p benchmark |
| M07 THE MASKED PURSUIT | 3 proximity objectives, 3 guards, boss and relic | PASS: ordinary input, relic/reward/reload | Story/art polish; completion MP4 skipped; no fresh route-specific 1080p benchmark |
| M08 THE ARENA CIRCUIT | 3 proximity objectives, 4 guards, boss and relic | PASS: ordinary input, relic/reward/reload | Story/art polish; completion MP4 skipped; no fresh route-specific 1080p benchmark |
| M09 A DEBT COLLECTED | 3 proximity objectives, 4 guards, boss and relic | PASS: ordinary input, relic/reward/reload | Story/art polish; completion MP4 skipped; no fresh route-specific 1080p benchmark |
| M10 THE ROAD OUT | Exit objectives/four guards, then distinct arc duel | PASS: ordinary input, relic/reward/reload | Arena/character/cinematic polish; MP4 skipped |
| M20 THE SPARE ROUTE | CHAIN COLLECTOR isolated 1v1 duel | PASS: ordinary input, relic/reward/reload | Arena/character/cinematic polish; MP4 skipped; preceding chapters unbuilt |
| M30 A LARGER NUMBER | SOLAR ARCHITECT isolated 1v1 duel | PASS: ordinary input, relic/reward/reload | Arena/character/cinematic polish; MP4 skipped; preceding chapters unbuilt |
| M40 TOWARD THE DUST | MIRROR DUELIST isolated 1v1 duel | PASS: ordinary input, relic/reward/reload | Arena/character/cinematic polish; MP4 skipped; preceding chapters unbuilt |
| M50 SOMEONE IN THE ROAD | MONSOON DRUMMER isolated 1v1 duel | PASS: ordinary input, relic/reward/reload | Arena/character/cinematic polish; MP4 skipped; preceding chapters unbuilt |
| M60 NOT THIS TIME | DUNE COURIER isolated 1v1 duel | PASS: ordinary input, relic/reward/reload | Arena/character/cinematic polish; MP4 skipped; preceding chapters unbuilt |
| M70 A ROAD KEPT HIDDEN | BRONZE ADJUDICATOR isolated 1v1 duel | PASS: ordinary input, relic/reward/reload | Arena/character/cinematic polish; MP4 skipped; preceding chapters unbuilt |
| M80 THE TREE AHEAD | BASTION RAM isolated 1v1 duel | PASS: ordinary input, relic/reward/reload | Arena/character/cinematic polish; MP4 skipped; preceding chapters unbuilt |
| M90 THE WEAPON’S MOMENT | SIEGE ASTROLABE isolated 1v1 duel | PASS: ordinary input, relic/reward/reload | Arena/character/cinematic polish; MP4 skipped; preceding chapters unbuilt |
| M100 AT THE UNFINISHED HORIZON | HORIZON KEEPER isolated 1v1 duel | PASS: ordinary input, relic/reward/reload | Arena/character/cinematic polish; MP4 skipped; preceding chapters unbuilt |

[Individual 19-mission audit with exact coverage/gaps](phase54f-stabilized-mission-audit.json)

Missions 3-9 are functional combat prototypes with similar three-marker/guard/boss structures. Their distinct archive descriptions are not proof that the corresponding reconnaissance, social, tracking or preparation story mechanics are finished. New content will not use that similarity as a completion shortcut.

## Remaining 81 missions

The companion inventory contains each chapter’s existing objective/conflict/conclusion, a proposed multi-step gameplay loop, specific enemy plan, local environment, required art, reward proposal, predecessor/successor and batch. Every row remains **PLANNED / NOT PLAYABLE**. Proposed stages are design work, not test results.

[Complete 81-mission inventory](phase54f-mission-inventory.json) | [Batch manifest](phase54f-batch-plan.json)

| Mission | Proposed distinct loop | Enemy plan | Environment |
|---|---|---|
| M11 THE DIAGNOSTIC | diagnostic conversation: Ask Bujji to run the diagnostic; Compare three subsystem readings; Identify the damaged receiver bus | No combat | Workshop scanner bay |
| M12 THREE WAYS THROUGH | three-route survey: Traverse the narrow passage; Inspect the exposed ramp and blocked lift; Enter the service tunnel and select a verified route | One avoidable scout patrol | Three connected district crossings |
| M13 A BORROWED CHARGE | scrap negotiation: Recover the disputed scrap receipt; Compare two trader offers; Exchange selected salvage for a temporary power cell | No combat; negotiation has recoverable refusal | Workshop exchange stall |
| M14 SIGNAL IN THE RUBBLE | intermittent-signal navigation: Request a timed scan from Bujji; Follow changing bearing/strength readings; Expose and inspect the buried junction | No required combat | Rubble lane and buried utility junction |
| M15 HANDS OFF THE CONSOLE | console defensive duel: Start the repair-console job; Keep one scavenger away through wind-up/counter windows; Finish the protected diagnostic | Exactly one original scavenger; no added waves | Workshop service ring |
| M16 THE QUIET DETOUR | vehicle stealth escort: Read two rotating search cones; Guide Bujji between actual cover positions; Reach the unlit exit with recoverable alarm state | Two noncombat patrols; optional single pursuer after alarm | Dark service lane with vehicle-width clearance |
| M17 A MORE ACCURATE MAP | landmark reconnaissance: Compare ghat and roofline bearings; Confirm the service-gate position from a third vantage; Correct the local map with Bujji | No combat | Ghat/map overlook loop |
| M18 PARTS WITH A PAST | part inspection choice: Inspect mass and wear of two real components; Choose reliable heavy or unstable light hardware; Verify the selected part on the test fixture | No combat | Workshop inspection benches |
| M19 ONE DRIVER, TWO OPINIONS | ground vehicle trial: Board Bujji through the interaction prompt; Complete a bounded ground handling course; Return to the rendezvous without granting flight | No enemies; physical bollards/turns | Vehicle test loop |
| M21 BELOW THE SHADOW | vertical viewpoint exploration: Reach the lower-tier stair; Climb the permitted overlook; Inspect the Complex without entering it | Ambient guards outside the permitted route | Lower-tier overlook and monumental overhead structure |
| M22 THE WATER QUEUE | civilian ration-token recovery: Hear the resident's request; Find the dropped token by the water queue; Return it to the correct resident | No combat; distinguish civilians from targets | Water queue and ration kiosk |
| M23 A FREIGHT WINDOW | freight timing traversal: Read a visible freight schedule; Cross two moving traffic lanes during openings; Reach the worker refuge | No enemies; bounded freight collision hazards | Freight service yard |
| M24 THE WRONG PERMIT | permit investigation: Read the purchased permit; Compare seal/date against a checkpoint register; Return the invalid document with the mismatch identified | No combat | Permit office exterior |
| M25 SCRAP FOR PASSAGE | salvage barter choice: Inspect three salvage pieces; Choose a valid combination matching the passage fee; Complete the exchange without spending persistent rewards | No required enemies | Scrap sorting yard and toll stall |
| M26 EYES ON THE GANTRY | guard-rotation reconnaissance: Observe the gantry from cover; Mark two actual guard rotations; Return the observation without entering the Complex | Two surveillance patrols; alarm recovery route | Gantry and service catwalk |
| M27 THE TOLL KEEPER | nonlethal salvage duel: Present the disputed claim; Win one original toll-enforcer duel; Recover the salvage after a nonlethal defeat | One original elite enforcer; no film-character kill | Toll court |
| M28 NO INVITATION | character rendezvous: Return from the sealed access gate; Discuss the failed attempt with Bujji; Choose the next local scouting focus | No combat | Blocked gate and partner parking bay |
| M29 WHISPERS OF A TRANSFER | conflicting-notice investigation: Inspect three transfer notices; Compare time/vehicle evidence; Mark the supported lead and discard the conflicting report | One optional scout protecting a notice board | Notice exchange and dispatch booths |
| M31 A BROKEN NOTICE | damaged transmission reconstruction: Recover fragments from two receivers; Order three transmission segments; Locate the route named by the reconstructed bounty | No combat | Signal workshop |
| M32 EMPTY QUARTERS | abandoned-room search: Enter an accessible empty room; Inspect door wear and a dropped route marker; Leave by the verified departure passage | No enemies; traversal obstacles | Abandoned quarters with authored interior |
| M33 TWO WITNESSES | witness comparison: Hear two independent accounts; Check the disputed landmark on the ground; Select the supported transport direction | No combat; meaningful evidence comparison | Two civilian stalls and crossing |
| M34 THE SERVICE DOOR | service-door route puzzle: Trace fresh traffic to three service doors; Operate the matching latch sequence; Cross the actual opened exit | One avoidable watch patrol | Door/latch service maze |
| M35 A PAID RUMOR | rumor negotiation: Assess the seller's evidence; Buy the report with mission-local salvage or decline; Verify the lead before recording it as reliable | No required combat | Information broker's stall |
| M36 BOOTPRINTS AND WHEELS | tracks and wheelbase analysis: Inspect bootprints and wheel marks; Compare track widths at a junction; Follow only the transport trail to the exit | No required enemies | Tracked dirt lane and loading dock |
| M37 RIVAL ON THE WIRE | scanner-retention duel: Spot the rival's approach; Defend the scanner against a single opponent; Disengage after the rival drops the claim | One original scanner thief | Narrow dispatch court |
| M38 SIGNAL HANDOFF | line-of-sight relay puzzle: Activate the first relay; Maintain sight through moving screens while Bujji scans; Handoff to the final receiver | No enemies; timed visibility/cover obstacles | Relay alley with shutters |
| M39 THE EXIT ACCOUNT | departure preparation choice: Review the verified route; Choose terrain/enemy/resource scouting priority; Load the appropriate mission-local supply and depart | No combat | Bujji departure work bay |
| M41 TRACKS IN OPEN GROUND | exposed wheel-track navigation: Read drifted tracks at two crossings; Use terrain shelter to cross exposed ground; Reacquire the transport bearing | One avoidable dust scout | Eroded frontier trail |
| M42 LOW ON THE HORIZON | sensor-range vehicle pursuit: Board Bujji; Keep the transport inside a bounded sensor-distance band; Reach the pursuit checkpoint without an invented capture | No kill objective; moving route hazards | Frontier pursuit corridor |
| M43 THE CROSSING LINE | vehicle route choice: Inspect the wide bend and rough crossing; Choose one traversable route; Complete its distinct handling challenge | No required enemies; route-specific rough ground | Branching frontier road |
| M44 CLOSE ENOUGH TO SEE | cockpit identification scan: Reach a safe scan window; Hold the target in the sensor frame; Identify the transport from visible evidence | No combat | Cockpit scan overlook and moving convoy |
| M45 THE INTERCEPTOR | staged interceptor duel: Stop at the authored interception point; Repel one original interceptor; Rejoin Bujji after the nonlethal finish | One original interceptor | Roadside stopping court |
| M46 BUJJIâ€™S ESTIMATE | companion uncertainty decision: Compare Bujji's two low-confidence predictions; Choose a conservative or risky bearing; Verify/recover the route before recording it | No required enemies | Twin intercept approaches |
| M47 THE ROUGH DESCENT | broken-descent navigation: Inspect the broken descent; Guide the ground route through switchbacks; Reach the stable lower road | No required combat; cliffs and slow hazards | Fractured descent with safe recovery paths |
| M48 AN UNREADY MODE | bounded failed-flight cinematic: Check the unready mode with Bujji; Play the original staged failure; Regain ground control without unlocking flight | No combat; authored failure not a new ability | Launch patch and unstable landing ground |
| M49 BACK ON THE TRAIL | pursuit-bearing recovery: Find the last visible wheel mark; Request a new scan from higher ground; Reacquire the target direction | One optional frontier scout | Interrupted pursuit trail |
| M51 MEASURE THE STRANGER | guardian observation: Stay outside the guardian's telegraphed reach; Inspect stance and safe distances; Report observations to Bujji | Guardian is invincible and not a kill target | Protected transport approach |
| M52 A CONFIDENT APPROACH | guarded dialogue approach: Approach the transport as a hunter; Hear the refusal at the guarded threshold; Return to a controlled confrontation mark | No kill objective; guardian reaction staging | Transport threshold |
| M53 BEYOND REACH | survival against guardian: Read the first guarded exchange; Evade bounded attack patterns for the authored duration; Reach a safe recovery window | One invincible guardian; survival only | Transport-side duel space |
| M54 ACROSS THE DECK | evasive deck traversal: Board the permitted transport section; Cross between reach telegraphs; Reach the opposite deck refuge | Guardian hazards; no ordinary interference | Traversable transport deck |
| M55 A SHORT OPENING | bounded counter and disengage: Bait a telegraphed swing; Attempt one legal counter window; Disengage after the guardian answers | Invincible guardian; counter is not victory | Deck counter lane |
| M56 THE PASSENGERâ€™S DISTANCE | passenger-distance objective: Find an allowed vantage route; Reach the observation position while avoiding the guardian; Acknowledge the interrupted capture attempt | Guardian zones; no capture or death reward | Transport observation ledge |
| M57 BUJJI, ANOTHER ROUTE | Bujji retreat support: Ask Bujji for an alternate bearing; Clear a small local obstruction; Mark the actual retreat route | One original blocker if needed; guardian remains background | Transport escape access |
| M58 THE WEIGHT OF A BLOW | authored defeat and recovery: Survive the opening exchange; Play the bounded overwhelming counter; Recover control and reach cover without a fake win | Guardian cannot be killed; scripted loss preserves canon | Impact/recovery staging area |
| M59 THE EMPTY ROAD | aftermath rendezvous: Observe the departed transport's route; Reach Bujji on foot; Record the failed contract and repair needs | No combat | Empty frontier road and partner bay |
| M61 A NOTICE AT THE GATE | loss-of-access notice: Inspect the blacklist notice; Compare it with the earlier contract record; Discuss the access loss with Bujji | No combat | Kashi return checkpoint |
| M62 COUNT WHAT REMAINS | equipment audit: Inspect three visibly damaged systems; Prioritize a repair without fabricating permanent currency loss; Record the actual usable loadout | No combat | Return-route maintenance shelter |
| M63 A PLACE TO STOP | quiet repair-site search: Survey two unsafe repair sites; Find cover from the patrol route; Park Bujji at the verified work point | Two avoidable patrols | Backstreet repair approaches |
| M64 THE LOST CLAIM | claim investigation: Read the local claimant's ledger; Compare receipts against the failed bounty; Reject the inflated portion with evidence | No required combat | Claims office and public ledger |
| M65 ONE HONEST REPAIR | reliable scanner repair: Recover the two required parts; Fit the tested components in a meaningful order; Verify scanner readings before departure | One optional scrap guard | Scanner workshop with inspectable parts |
| M66 SOMEONE STILL ASKING | Luke dialogue encounter: Meet Luke at the original rendezvous; Hear the bounded request; Preserve Bhairava's established response without inventing allegiance | No combat | Sheltered meeting point; Luke asset required |
| M67 BEFORE THE COMMANDER | controlled commander approach: Follow the guards' allowed route; Stop at the inspection threshold; Reach the meeting staging point | Guards are interaction barriers, not kill objectives | Guarded command approach; Manas asset required |
| M68 THE OFFER REOPENED | renewed-offer negotiation: Hear the offer's terms; Confirm the dangerous retrieval direction; Record acceptance without inventing a new relationship | No combat | Command meeting set |
| M69 PREPARE, NOT CELEBRATE | departure systems check: Check scanner, route and ground-drive status; Resolve one tested fault; Depart equipped rather than celebrating | No required enemies | Bujji preparation bay |
| M71 TRUST THE BEARING | bearing comparison: Compare Luke's bearing with Bujji's sensor obstruction; Inspect a local confirmation point; Choose the bearing supported by the evidence | No combat | Concealed-road approach |
| M72 NO VISIBLE GATE | hidden-entrance exploration: Search two misleading openings; Observe the guided environmental cue; Find the concealed approach without exposing the settlement freely | No required enemies | Concealed rock/gate exterior |
| M73 THE LAST TURN | guided vehicle turn: Board Bujji; Follow the bounded instructed final turn; Enter the concealed approach without a flight mechanic | No combat; scripted ground route | Vehicle-width concealed turn |
| M74 A DIFFERENT SKY | sanctuary environment reveal: Cross the reveal threshold; Observe actual playable water/stone/canopy geometry; Reach the permitted arrival point | No combat | Shambhala arrival hub |
| M75 THE FORMALITIES | escorted entry formalities: Wait at the allowed checkpoint; Hear Luke's entry exchange; Proceed only after the escort signal | No combat; NPC escort/entry state | Sanctuary checkpoint |
| M76 STAY WITH THE VEHICLE | partner parking instruction: Inspect two possible parking bays; Give Bujji a valid parking/scouting instruction; Mark a practical rendezvous | No combat | Sanctuary vehicle court |
| M77 WATER AND STONE | permitted sanctuary exploration: Follow the allowed stone-and-water route; Inspect two environmental stories; Return without crossing restricted boundaries | No combat | Water courts and shaded stone paths |
| M78 THE ESCORTâ€™S PACE | social escort traversal: Keep an appropriate distance from the escort; Wait at a restricted crossing; Reach the meeting approach without breaking the route | No combat; escort and boundary logic | Occupied sanctuary lane |
| M79 AN UNFINISHED INTENTION | unresolved-motive character beat: Check in with Bujji; Review the active contract motive; Reach the next story staging mark without invented allegiance | No combat | Pre-meeting partner nook |
| M81 ALARM ACROSS THE STONE | alarm response: Read the first alarm; Identify blocked and safe local lanes; Reach a defensible staging point | Ambient siege forces; no unbounded crowd combat | Sanctuary alarm-state hub |
| M82 A ROUTE THROUGH SMOKE | smoke/debris navigation: Read visibility cues; Cross a timed debris opening; Reach the marked safe passage | Two bounded hazard cycles; no uncontrolled particles | Damaged sanctuary lane |
| M83 THE CONTRACT REMAINS | passenger-direction tracking: Compare two reports amid the assault; Reach a valid observation point; Mark the passenger's direction without completing capture | One avoidable original assault scout | Contested observation route |
| M84 ONE BLOCKING UNIT | original blocking-unit fight: Approach the chosen route; Defeat one original assault unit; Open the local passage without ending the siege | One original shield unit | Sanctuary breach court |
| M85 BUJJI AT THE TURN | changed rendezvous: Inspect the blocked original pickup; Contact Bujji for an alternate point; Reach the updated actual rendezvous | Two staged scouts in separate waves | Debris-diverted vehicle court |
| M86 A PASSAGE FOR OTHERS | optional evacuation passage: Choose whether to spend mission-local time opening a side passage; Operate its physical gate if chosen; Return to the main route either way | One optional original blocker | Evacuation side gate and main lane |
| M87 THE HEAVY STEP | heavy-unit survival: Read the heavy unit's tells; Survive until the route opens; Pass the blockade without claiming a film antagonist's death | One original heavy; survival/escape condition | Heavy-blockade lane |
| M88 WHERE THE LINES CROSS | convergence staging: Reach the three-sided encounter area; Observe the established guardian/passenger/hunter positions; Enter the revelation threshold | Bounded background threats; no invented betrayal | Convergence court with authored camera marks |
| M89 BEHIND THE BARRIER | barrier-route puzzle: Trace two accessible edges of the barrier; Open the valid service route; Reach the revelation approach without removing the confrontation | One optional original assault guard | Damaged barrier and maintenance path |
| M91 A FAMILIAR WEIGHT | weapon interaction staging: Approach the authored weapon turning point; Inspect the bounded interaction; Preserve recognition as a story event rather than a mastered power | No new kill objective | Weapon reveal court; original prop required |
| M92 A BREAK IN THE ASSAULT | bounded counterattack: Read the immediate assault opening; Repel two original local attackers; Return to the established confrontation | Two original opponents in two small waves | Immediate battle opening |
| M93 THE GUARDIAN LOOKS AGAIN | guardian recognition reaction: Reach a safe reaction mark; Play an original reaction scene; Return to the present without invented exposition | No combat | Guardian reaction set |
| M94 SUN ON THE BATTLEFIELD | ancient-memory transition: Enter the authored memory cue; Observe a bounded real-time ancient-war tableau; Reach the next memory observation mark | Background original silhouettes only | Ancient battlefield memory set |
| M95 THE ARCHERâ€™S SILHOUETTE | chariot/archer observation: Approach the chariot viewpoint; Observe the archer silhouette and weapon connection; Continue without adding unsupported biography | No combat | Original chariot and archer memory tableau |
| M96 THE NAME KARNA | Karna identification reveal: Complete the established visual connection; Present original bounded identification dialogue; Preserve the absence of a mastered ability tree | No combat | Memory reveal set |
| M97 BACK TO THE PURSUIT | return to present: Follow the cinematic return cue; Regain ordinary movement at the existing confrontation; Reach the departure path | One bounded original blocker if needed | Present-day return staging |
| M98 KEEP MOVING, BUJJI | bounded Bujji departure: Reach the partner's departure mark; Board and complete a short ground departure; Preserve the unresolved passenger trajectory | No kill objective; route hazards only | Departure lane and vehicle shot |
| M99 A THREAT STILL ABOVE | continuing-threat perspective: Reach the closing viewpoint; Observe the continuing threat above; Return to the unfinished-horizon staging without inventing a sequel outcome | No final Yaskin fight or death | Distant-threat vista and closing set |

Reward proposal: base `600 + 15 * mission number`, optional intel +100, awarded once per stable mission/key. These are estimates, not changes to saved scores. Existing boss/relic rewards remain untouched. Mission N requires N-1 and unlocks N+1. Decisions may use a separately versioned optional story-state key; the existing campaign format must remain compatible. Current Continue resumes the selected chapter from its start, not an exact in-run checkpoint.

## Ten preserved boss encounters

| Mission | Boss | Unique attacks | Phases / defeat | Persistent awards |
|---|---|---|---|---|
| M10 | EXIT WARDEN | gate-ram, shield-fan | 3 / kneel | boss 2500 + relic 750 |
| M20 | CHAIN COLLECTOR | chain-hook, debt-circles | 3 / unravel | boss 2500 + relic 750 |
| M30 | SOLAR ARCHITECT | solar-spokes, sunfall | 3 / eclipse | boss 2500 + relic 750 |
| M40 | MIRROR DUELIST | mirror-cross, echo-lunge | 3 / shatter | boss 2500 + relic 750 |
| M50 | MONSOON DRUMMER | drum-rings, thunder-grid | 3 / collapse | boss 2500 + relic 750 |
| M60 | DUNE COURIER | returning-ring, sand-cut | 3 / skid | boss 2500 + relic 750 |
| M70 | BRONZE ADJUDICATOR | judgment-marks, verdict-beams | 3 / bow | boss 2500 + relic 750 |
| M80 | BASTION RAM | bastion-charge, fault-lines | 3 / buckle | boss 2500 + relic 750 |
| M90 | SIEGE ASTROLABE | siege-grid, orbital-mortar | 3 / disarm | boss 2500 + relic 750 |
| M100 | HORIZON KEEPER | lotus-blades, horizon-reversal | 3 / lotus | boss 2500 + relic 750 |

All ten passing profiles remain in place. Ordinary enemies must be absent during each arc-final arena fight; M10 clears its approach guards before the arena. Later-arc reachability is restored by completing the intervening story missions, not by unlocking/skipping them automatically. Guardian survival/canonical defeat chapters cannot be presented as killing Ashwatthama, Manas or Yaskin. The original final challenge remains distinct from an invented film/sequel ending.

## Reuse without repeated missions

Reuse stable input, kinematic movement/camera, animation rig, pause/audio handling, campaign/save validation, health/HUD components, existing enemy behavior and ten boss profiles. Reuse geometry/material libraries and environment kits; do not reuse the same route and swap mission text.

Each new chapter needs its own authored layout/stage sequence, success and recoverable failure rules, character purpose and visible world change. Diagnostic investigation, route surveying, negotiation, intermittent scanning and console defense are different activities in Batch 1. Later mechanics include nonlethal duels, evidence comparison, grounded vehicle tasks, patrol observation, escorting, bounded survival, scripted defeat, environmental puzzles and original memory staging. No new stamina resource or flight mastery is introduced.

Required new shared systems are conditional to new chapter IDs: objective runtime, contextual E/touch interaction, choice/repair widgets, staged enemy activation, evidence/mission-local inventory, narrative outcome persistence and non-boss chapter completion. They must not rewrite the passing boss/combat/control systems.

## Implementation order and batch gates

1. Freeze the tested 19-mission snapshot and validate new catalogs/schemas without enabling entries.
2. Implement only the activity systems needed for M11-15, together with their workshop/route assets. Keep candidate art and mission previews isolated.
3. Test each of those five from actual launch through completion, rewards, unlock, reload and replay. Test desktop keyboard and touch emulation; record physical-device absence.
4. Run affected legacy regressions, particularly M1, M2, Bujji, M10 and the M10-to-M11 boundary. Run boss logic/profile checks, build/lint and 47 protected hashes.
5. Count/enable a new mission only after real implementation and evidence. Functional readiness and production art acceptance are separate gates; no placeholder is labeled finished.
6. Proceed chronologically to the next five new missions. Existing boss-boundary encounters are regression checks, not replacement slots. Batch 2 is M16-19 and M21, with M20 progression/duel verification between them.
7. Finish all 81 new entries in sixteen five-mission batches and one final one-mission batch; then run an uninterrupted new-game unlock chain and full release regression. No new numbered phase is created.

| Batch | Five new missions (last batch has one) | Existing boss-boundary checks | Content-only hours |
|---|---|---|---|
| 1 | mission-11, mission-12, mission-13, mission-14, mission-15 | mission-10 | 20-40 |
| 2 | mission-16, mission-17, mission-18, mission-19, mission-21 | mission-20 | 20-40 |
| 3 | mission-22, mission-23, mission-24, mission-25, mission-26 | As affected | 20-40 |
| 4 | mission-27, mission-28, mission-29, mission-31, mission-32 | mission-30 | 20-40 |
| 5 | mission-33, mission-34, mission-35, mission-36, mission-37 | As affected | 20-40 |
| 6 | mission-38, mission-39, mission-41, mission-42, mission-43 | mission-40 | 20-40 |
| 7 | mission-44, mission-45, mission-46, mission-47, mission-48 | As affected | 20-40 |
| 8 | mission-49, mission-51, mission-52, mission-53, mission-54 | mission-50 | 20-40 |
| 9 | mission-55, mission-56, mission-57, mission-58, mission-59 | mission-60 | 20-40 |
| 10 | mission-61, mission-62, mission-63, mission-64, mission-65 | mission-60 | 20-40 |
| 11 | mission-66, mission-67, mission-68, mission-69, mission-71 | mission-70 | 20-40 |
| 12 | mission-72, mission-73, mission-74, mission-75, mission-76 | As affected | 20-40 |
| 13 | mission-77, mission-78, mission-79, mission-81, mission-82 | mission-80 | 20-40 |
| 14 | mission-83, mission-84, mission-85, mission-86, mission-87 | As affected | 20-40 |
| 15 | mission-88, mission-89, mission-91, mission-92, mission-93 | mission-90 | 20-40 |
| 16 | mission-94, mission-95, mission-96, mission-97, mission-98 | As affected | 20-40 |
| 17 | mission-99 | mission-100 | 4-8 |

Cross-boundary tests do not grant artificial production unlocks. Tests may use clearly labeled disposable prerequisites, but a separate real sequential progression test must confirm no gap or reward duplication. A failed mission stays a candidate and does not advance the completed count.

## Estimated hours and calendar assumptions

These are **developer-equivalent planning ranges**, not measured completion time or a guaranteed agent wall-clock deadline. They assume a polished game on the existing engine, modular original/licensed assets, subtitles when approved voices are missing, 40 productive hours per week, and timely visual review. Exact film-quality actor/architecture work or substantially longer missions can exceed the ranges. No physical mobile device is currently available.

| Workstream | Estimated hours | One-person calendar at 40 h/week | Dependency |
|---|---|---|---|
| Shared objective/interaction/wave/save integration | 48-80 | 1.2-2.0 weeks | First batch; branch/repair/diagnostic/navigation/defense logic and test harness. Conditional to new mission IDs; existing 19 unchanged. |
| 81 individually authored mission implementations | 324-648 | 8.1-16.2 weeks | 4-8 hours per mission after framework; includes unique goals, staging, failure/recovery and progression. Not a five-marker generator. |
| Original story staging, cinematics and Telugu text QA | 80-160 | 2.0-4.0 weeks | Original dialogue, actor/camera beats and canon boundaries; no movie audio/footage extraction. Voice recording excluded unless legally supplied. |
| Playable Kashi production art | 160-320 | 4.0-8.0 weeks | Authored foreground/ghats/connected streets, skyline, crowds, vehicles, PBR/LOD/collision and actual gameplay visual review. |
| Other regional environments and ten arena art passes | 160-320 | 4.0-8.0 weeks | Complex exterior, desert/transport, Shambhala/siege, ancient-memory set; reuse kits with distinct authored compositions. |
| Boss/character presentation and extra animations | 60-120 | 1.5-3.0 weeks | Preserve ten passing mechanics; improve silhouettes/animation/defeat staging using new approved assets and additive clips. |
| Measured performance and loading optimization | 60-120 | 1.5-3.0 weeks | New-evidence bottlenecks, memory/asset budgets and repeatable distributions; no guarantee that driver/OS waits can be repaired in source. |
| Batch and final regression / device compatibility | 100-180 | 2.5-4.5 weeks | Actual completions, unlock chain, replay, restart, save compatibility, controls, 1080p/720p and mobile. Physical hardware still unavailable. |
| Release packaging, provenance review and handoff | 16-32 | 0.4-0.8 weeks | Clean owned processes, protected hashes, asset/license manifest, reproducible build, known issues and honest acceptance. |

**Total planning range: 1008-1980 hours, approximately 25.2-49.5 working weeks at 40 productive hours/week for one developer-equivalent stream.** Two genuinely available parallel engineering/art streams can shorten elapsed time, but story/framework/QA dependencies prevent simply promising half the duration. No external team has been assigned.

The earlier 6-12-week estimate was not supported by this work breakdown for the full requested production scope. It must not be treated as a delivery promise. A fast prototype made from repeated templates is not the target. Batch 1 will record actual design, implementation, asset, debugging and test time and recalibrate the remaining estimate before any tighter date is promised.

Batch 1 initial allowance: shared new-mission framework 48-80h, five mission implementations 20-40h, focused regression 8-16h, plus the applicable share of production art/story work. This is a dependency-heavy first batch; later content-only batches reuse the verified systems. Calendar depends on active capacity and review availability rather than continuous unattended execution.

## Measured risks and acceptance

Coverage limits: the fresh M1 natural-ending and representative 1080p samples used final opt-in Kashi. The default production ending retains its uncached bounds path and was not naturally benchmarked in this pass. M2-9 fresh full ordinary routes were keyboard/720p; mobile checks cover UI/shared actions and the actual M2 contract/chase. M3 guard defeat is not required by its prototype gate. These limits must not be summarized as complete production/per-device certification.

- The 515.4ms historical gap is not established as fixed. Fresh retained-code unprofiled gaps include 240.0ms/214.9ms in M40, 126.1ms in M90, 141.5ms in the natural M1 ending and 128.0ms in the guard-area sample.
- One normalization cost is verified and repaired for the final opt-in route: 378.9-435ms before versus 0-2.9ms after. A separate 215.7ms WebGL program-info query overlaps a 273.1ms diagnostic interval; its lower-level wait chain remains unresolved. Rejected warm-up/light-slot candidates and their 4441ms/1305ms regressions were rolled back and preserved.
- Four final representative windows lasted 120 seconds each. Desktop buffers were 1920x1080; mobile was emulation on the GTX1650 at actual 860x1864 and 1688x780 buffers. This is not physical-phone certification.
- Available RAM fell as low as 4.29MiB and memory load reached 99% in the recorded system samples. This establishes pressure, not causation for every stall. New assets must be budgeted/measured accordingly.
- Nominal desktop target remains 1080p/30FPS (33.3ms). Record median/p95/p99/max and every >100ms active gap; loading is separated, and a good average cannot hide an unexplained interruption.
- Build and lint pass with five unchanged warnings. All final baseline snapshots and raw measurements are retained.

[Performance summary and all recorded gaps](phase54f-stabilization-20261114/performance-summary.json) | [Memory/power evidence](phase54f-stabilization-20261114/memory-summary.json) | [Raw benchmark](phase54f-stabilization-20261114/performance/results.json)

## Immediate next action

Proceed with implementation of **M11-15 only**, following this inventory’s objectives rather than the incompatible early draft. Keep all other planned chapters disabled, retain the validated rollback snapshot, and report test evidence and remaining art/performance limitations after the five-mission batch. Full Phase5.4F remains open; no release-ready claim is made.

Production assets: [detailed art/reuse inventory](phase54f-production-art-inventory.md).
