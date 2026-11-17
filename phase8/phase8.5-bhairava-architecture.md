# Phase8.5 Bhairava architecture

2026-11-16, Asia/Calcutta. CONDITIONAL PASS for local deterministic implementation and offline validation. Browser gameplay acceptance BLOCKED; natural voice unavailable.

## Read-only data flow

Existing authoritative stores → campaignContext → pure campaignAnswers / existing progressAnswer → CampaignAssistant. No network AI, autonomous agent, mission mutation or new persistent save format. The player remains the existing Bhairava character; this adds field guidance, not a duplicate NPC or a claim of a fully functional general AI companion.

- campaignSystem, campaign/catalogue/foundationData: IDs, playable status, actual unlock/completion/reward records, prerequisites, next relationships, design-reference location. Ten arcs/100 designs remain19 prototype routes plus81 planned. Later worlds/story assets are not made playable by querying them.
- arcOne/contracts and contractState: current actual stage, verified steps, interaction coordinates, requirements, holds and round identity for Missions1–10. Out-of-sync contracts report synchronization rather than reuse a previous objective.
- gameplayStore: health, crystal collection, pylon/objective IDs, Overdrive charges/activity and attempt death. combatSystem: actual configured spawns, remaining IDs, scaled stats and runtime positions when available. Fallback spawn coordinates are explicitly labeled. Boss store/profiles: actual phase/health/state/relic and supported attack IDs.
- exploration/worldExpansion: hub, active extension, two real inspection records, discovered/inspected session IDs. Hidden paths are bounded side routes, not a new open world. Character registry: current mission role references; designed identities remain designed.
- assistant/progress reused byte-identically: actual history, explicit missing chapters, available prototypes, rewards and supported tenth-mission recaps. A viewed briefing is not completion. Future story events, unavailable missions, Karna powers and absent items are not narrated as implemented.

## Answers and interface

Twelve deterministic contextual topics plus bounded English keyword routing. Authored linking wording is separated from facts arrays sourced above. Unknown requests return explicit fallbacks. Rich interaction guidance covers the actual Arc1 stages; later prototype duels receive the actual available boss/progress data, not invented full story missions. No pathfinding is claimed: coordinates identify an interaction/spawn/runtime reference and do not prove obstacle-free reachability.

Health help describes only implemented healing: Mission2 first pylon activation up to20/cap150, Mission3 new objective up to25/cap150. Crystals/charges are not a general equipment inventory or currency. No skill tree, potion system, elemental weakness, weapon-upgrade economy or spendable stamina meter is invented. Guard/dodge/basic/heavy/Overdrive and unlimited sprint remain existing mechanics.

The existing warm UI style is retained. Help opens a region with suggestions, typed English requests, current facts, Close/Escape/focus restoration and optional settings. It never pauses or captures movement. Current answers recompute on meaningful store notifications while open; subscriptions detach on close/unmount. Mission/round/exploration React keys discard old sessions. History is twelve in-memory snapshots marked by mission; it resets on unmount/pause/exit and is never written into saves. The old Mission1 component and all Telugu/answer/progress source remain byte-identical; a preserved text-set selector exposes existing responses. Telugu remains unreviewed.

## Optional voice boundary

voicePort is an unconnected dependency-injection contract, default adapter=null. It implements temporary enable/mute/volume/Skip preferences, a single active handle, abort/epoch protection against late loading, safe failure and clip/handle disposal. Tests inject mocks only. Protected gameplay gate rejects active missions/combat, pause/holds and current central audio ownership. Existing audio manager, event controller, staging samples, licences and rights checks are untouched.

No microphone, recognizer, browser speech service, TTS, provider, recording or network endpoint is connected. te-IN input metadata explicitly reports unavailable. Output also reports unavailable while text remains. Real production voice arbitration, lifecycle integration with every audio path, approved assets/rights and actual Telugu listening evaluation remain prerequisites. Local preferences are scoped to the assistant mount and reset after pause/exit; they are separate from existing game mute/volume settings. No commercial clearance or naturalness claim.
