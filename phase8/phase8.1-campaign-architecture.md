# Phase 8.1 campaign foundation

2026-11-16, Asia/Calcutta. Original game adaptation, not official film canon. **100 complete design records; 19 inherited combat/boss prototype routes; 81 planned slots. Zero new playable missions.**

## Model and source of truth

`src/game/campaign/foundationData.js` expands the existing100 chapter outlines while preserving IDs, titles, order and current staged arc sequence. It provides mission type, summary, location, objectives, character context, encounter plan, existing boss metadata, dependency, completion-reward design, next mission and bidirectional continuity. The final designed arc culminates in Bhairava receiving Karna’s powers and choosing protection; it does not grant an ability in the current game. Arc10 metadata and Missions97–100 describe this original game ending, not a claimed movie/sequel outcome.

`catalogue.js` supplies an immutable ID lookup and existing UI-compatible mission list. It validates100 unique definitions, ten ten-mission arcs, titles, required fields, graph cycles/missing IDs, next links, arc sizes and boss mappings. All ten original arc bosses remain at10,20,…100. Nine earlier local bosses are also documented, without replacing an encounter.

Designed summaries/objectives are separate from legacy runtime objective fields. Existing live mission titles, descriptions, markers, boss prerequisites and combat remain unchanged. Runtime status is explicitly `existing-prototype` or `planned`; every newly authored story record remains `designed-not-playable-story`. Opt-in candidates21–24 retain their source/activity logic but cannot be promoted through the old `batch54f=20-24` flag in this catalogue.

## Ten connected arcs and environment priorities

- **Arc 1, Missions 1–10: Kashi contracts.** Establish the hunter, his partner and the price of surviving Kashi. Location: Existing Kashi district. Existing city, ghats, market and Mission 1 arena; retain opt-in Kashi status. Status: existing-prototype. Arc-final: EXIT WARDEN. Characters: Bhairava, Bujji. Environment production priority: 1.
- **Arc 2, Missions 11–20: A partner, not a tool.** Make the partnership useful through scouting, repairs and negotiated routes. Location: Kashi outskirts / repair belt. Vehicle service courts, broken overpasses and alternate repair routes; no duplicated city layout. Status: new-environment-required. Arc-final: CHAIN COLLECTOR. Characters: Bhairava, Bujji. Environment production priority: 2.
- **Arc 3, Missions 21–30: The price above.** Expose resource inequality without inventing a victory over the Complex. Location: Complex freight rim. Suspended freight decks, gated logistics galleries and a distant view of privileged tiers. Status: new-environment-required. Arc-final: SOLAR ARCHITECT. Characters: Bhairava, Bujji, Yaskin (remote context). Environment production priority: 3.
- **Arc 4, Missions 31–40: A name on the wire.** Connect the local contracts to the pursuit of an escapee. Location: Kashi escape drainage. Peripheral channels, relay roofs and sheltered departure lanes connect the pursuit. Status: new-environment-required. Arc-final: MIRROR DUELIST. Characters: Bhairava, Bujji, Sumathi (story context), Kyra (story context). Environment production priority: 4.
- **Arc 5, Missions 41–50: Hunters in the dust.** Reach the pursued transport through an escalating chase. Location: Desert frontier. Braided dry channels, ridge crossings and ground chase corridors. Status: new-environment-required. Arc-final: MONSOON DRUMMER. Characters: Bhairava, Bujji, Rival hunters. Environment production priority: 5.
- **Arc 6, Missions 51–60: The immortal in the road.** Turn the pursuit into a confrontation with an overwhelmingly strong guardian. Location: Frontier transport / causeway. A bounded transport deck, refuge bays and a guardian confrontation route. Status: new-environment-required. Arc-final: DUNE COURIER. Characters: Bhairava, Bujji, Ashwatthama, Sumathi. Environment production priority: 6.
- **Arc 7, Missions 61–70: The cost of losing.** Make defeat alter the next contract without inventing redemption. Location: Kashi return / repair courts. A separate return-route repair court and guarded bargaining approach, not the Arc 1 map. Status: new-environment-required. Arc-final: BRONZE ADJUDICATOR. Characters: Bhairava, Bujji, Luke, Commander Manas. Environment production priority: 7.
- **Arc 8, Missions 71–80: The concealed road.** Reach the hidden settlement while retaining Bhairava’s unresolved motives. Location: Shambhala concealed approach. Hidden mountain access, river terraces, inhabited rock chambers and escorted paths. Status: new-environment-required. Arc-final: BASTION RAM. Characters: Bhairava, Bujji, Luke, Sumathi, Ashwatthama. Environment production priority: 8.
- **Arc 9, Missions 81–90: When the walls shake.** Stage the siege and competing objectives without inventing character deaths. Location: Shambhala siege perimeter. Outer-defense escarpments, evacuation branches and original assault-unit arenas. Status: new-environment-required. Arc-final: SIEGE ASTROLABE. Characters: Bhairava, Bujji, Ashwatthama, Sumathi, Complex forces. Environment production priority: 9.
- **Arc 10, Missions 91–100: Echoes of Karna.** Resolve the original adaptation with Bhairava receiving Karna’s powers and choosing to protect the departure. Location: Shambhala / ancient-memory threshold. Distinct memory staging plus a present-day final evacuation ridge and Horizon Keeper arena. Status: new-environment-required. Arc-final: HORIZON KEEPER. Characters: Bhairava, Bujji, Ashwatthama, Karna (revelation), Yaskin (closing threat). Environment production priority: 10.

The campaign moves from local contracts and partnership, through access inequality and pursuit, to defeat, guarded cooperation, siege and the final responsibility/legacy choice. Individual missions retain unique authored purposes rather than100 generated combat waves. Enemy faction/role and difficulty progression are design data; future faction models, movesets, encounters and balancing require implementation. Existing shared enemy prototypes are not claimed to satisfy that production-art requirement.

## Dependencies, rewards and save compatibility

Mission1 has no prerequisite; each later slot depends on the preceding completion and points to the next slot. New completion uses this graph to add eligible successors while preserving every recorded unlock. An unlocked planned slot stays unplayable. Existing explicitly unlocked prototype routes are grandfathered even if old history has gaps; the query exposes `legacy-unlocked` and missing prerequisites. A strict dependency query is available for auditing. This avoids deleting historical progress or relocking previously available saves.

`campaignSystem.js` imports the catalogue, checks launch eligibility and delegates successor calculation. Existing completion/reward validation and idempotency logic remain unchanged. The storage key and schema remain `kalki-campaign-progress` with completedMissionIds, unlockedMissionIds, rewards and selectedMissionId. Reads do not migrate/write. Recorded historical unavailable-mission data is preserved, not narrated as newly implemented story.

Fixed existing boss+relic rewards remain3,250 points, or4,100 for Mission2; enemy/drop/run score is separate. Planned missions have clearly marked proposed completion points and story benefits. These values do not enter the reward system or grant powers. No economy, health, controller, unlock-history reset or new save system.

## Reusable objective framework and live connection

`missionFramework.js` implements pure typed objective state for exploration, combat, boss, escort, protection, survival, investigation and story events. It validates contracts, deduplicates item events, supports pause and terminal status, checks live escort/protection health, bounds time increments and distinguishes completed/skipped scenes from interruptions. All100 definitions instantiate in explicit simulation. Planned definitions cannot run as live missions through this API.

Implemented reducer support is not implemented world content: escort NPC movement, protection targets, survival encounters, investigation routes and new story cinematics still need authored world adapters/content.

`CampaignFoundationBridge.jsx` mounts once in App and subscribes to six existing authoritative stores. `runtimeBridge.js` feeds actual enemy-defeat and boss-status snapshots into the combat/boss objective engine, and exposes current objective counts, pause, relic state and recorded rewards through an ephemeral observer. The derived combat status can be satisfied without declaring mission completion. It never writes completion, awards, inputs or saves. Round/mission changes, menu/exploration and cleanup reset it. A confirmed staggered-reset bug was fixed by deriving the run key from the current authoritative enemy/boss snapshot.

## Assistant and cinematics

`assistantFoundationFacts` is a reserved read-only port for future guidance/context/progression. It separates recorded history, playable prototypes and planned IDs and exposes only actual runtime observation; it does not emit future-story summaries or fabricate events/rewards. Existing Bhairava UI/wording/voice behavior is unchanged. No external AI, paid API or new audio.

The accepted Phase7 camera/free-roam/Mission1+Mission10 intro and65-effect systems remain byte-identical. New story interactions/recaps/briefings in the map are design intentions, not additional rendered cinematics.

## Inherited planning conflict

`campaign-environment-requirements.json`, `campaign-enemy-requirements.json` and the historical root checklist describe an older arc map with Complex11–20 and Shambhala/Ashwatthama31–40. Current7.7 story data instead has repair/outskirts11–20 and Shambhala approach71–80. This foundation preserves the current staged ID/title/order/arc sequence and records that unresolved mismatch; it does not delete or silently reinterpret the earlier requirement. Parallel guardian context is designed for Arc4, but this is not proof that the older location/character requirement is fulfilled. Resolve the competing plans before producing the affected arc worlds/story content. The original Phase1–10 roadmap is not rewritten by this milestone’s work index.
