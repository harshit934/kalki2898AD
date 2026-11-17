# Mission 91–100 story continuity investigation

2026-11-16, Asia/Calcutta. Read-only investigation. This document changes no campaign data, gameplay, saves, implementation status or approval. The request received ends at “Do not invent major story”; the remaining instructions and exact deliverable filenames have been requested. This report covers the supplied scope.

## Finding

The intended **current game-adaptation ending is documented**: Bhairava chooses protection, reaches the inheritance threshold in Mission 99, and receives Karna's powers during Mission 100 before the Horizon Keeper confrontation. It is different from the earlier adaptation ending, which stops at the unresolved Karna connection.

The live story log has not caught up with that change. This is primarily a **version synchronization problem**, plus missing scene authoring and gameplay. It should not be described as proof that the current intended milestone is unknown. The preceding continuation report overstated the ambiguity of the ending itself. What remains unestablished is the detailed recognition/memory choreography, point of view and character presentation—not the later directive to include a power climax.

No version was silently selected or applied. Both are recorded below. The separate mission design explicitly proposes the later foundation version because it matches the user's Phase 8.1 and Phase 8.7 objectives. That proposal is not implementation, movie-canon verification or production approval.

## Source provenance and authority

**S1 — Earlier archived story foundation.** [Phase 4 README](<C:/Users/Hp/Downloads/kalki 2898AD/phase4/story-campaign-v1/README.md:15>) and [generated campaign design](<C:/Users/Hp/Downloads/kalki 2898AD/phase4/story-campaign-v1/campaign-design.json>) describe a 100-chapter adaptation ending at the film's unresolved horizon. The README says no Yaskin death, invented sequel resolution or mastered Karna power is authored in that increment. These are records of the older design; “in this increment” is not a perpetual ban on a later expressly requested game adaptation.

**S2 — Earlier design still used by live story presentation.** [storyCampaign.js](<C:/Users/Hp/Downloads/kalki 2898AD/phase8/phase8.8/integration/staging/src/game/storyCampaign.js:51>) retains that Arc 10 objective and the older Missions 97–100. [StoryJournal.jsx](<C:/Users/Hp/Downloads/kalki 2898AD/phase8/phase8.8/integration/staging/src/game/StoryJournal.jsx:2>) directly reads these records and displays their objectives, conflicts and conclusions. This is actual source wiring, not an inference from reports.

**S3 — Later Phase 8.1 campaign foundation.** [Campaign architecture](<C:/Users/Hp/Downloads/kalki 2898AD/phase8/phase8.1-campaign-architecture.md:7>) explicitly describes an original game ending with Karna's powers and protection. [foundationData.js](<C:/Users/Hp/Downloads/kalki 2898AD/phase8/phase8.8/integration/staging/src/game/campaign/foundationData.js:32>) supplies ending overrides for Missions 97–100 and a different Arc 10 objective/conclusion. The user's Phase 8.1 request explicitly calls for the protagonist to receive Karna's powers; subsequent Phase 8.7 and 8.8 requests require that system at the correct campaign milestone. These later instructions support the power-climax version as the current requested direction.

**S4 — Current runtime is split.** [catalogue.js](<C:/Users/Hp/Downloads/kalki 2898AD/phase8/phase8.8/integration/staging/src/game/campaign/catalogue.js:7>) preserves old UI-compatible mission fields and attaches the new foundation record underneath. Consumers can therefore read different objectives for the same ID. [Normal awakening integration](<C:/Users/Hp/Downloads/kalki 2898AD/phase8/phase8.8/integration/staging/src/game/divine87/gameplay.js:20>) and [eligibility rules](<C:/Users/Hp/Downloads/kalki 2898AD/phase8/phase8.8/integration/staging/src/game/divine87/rules.js:5>) already intend Mission 100 with Mission 99 completed and implemented. Mission 99 is still planned, so the gate currently refuses to unlock.

**S5 — Existing awakening presentation.** [awakeningCinematic.js](<C:/Users/Hp/Downloads/kalki 2898AD/phase8/phase8.8/integration/staging/src/game/divine87/awakeningCinematic.js>) presents a chosen responsibility and keeping a route open, using original game wording. It supports S3, not an assertion that the movie ends with this game mechanic. It has no activated audio cues. Its existence is not proof of normal campaign integration.

**Approval qualification.** The inspected archive contains generated designs, implementation reports and technical acceptance evidence. It does not contain a separately signed narrative approval establishing every ancient-memory detail. Phase 4 technical browser acceptance of a story-log UI is not approval of every future scene. “Original approved documentation” therefore has two meanings: the older recorded story plan supports the unresolved ending; the later explicit user requirements and Phase 8.1 design support the original power climax. Neither should be mislabeled as official film canon.

## Exact differences

1. **Arc ending.** S2 ends with the known Karna connection and continuing threat. S3 completes a local protective escape after the power inheritance and Horizon Keeper defeat. Both keep Yaskin as a continuing threat; both can leave the larger world unresolved. “Yaskin remains alive” is not a contradiction between the versions.
2. **Mission 97 — BACK TO THE PURSUIT.** S2 returns to the present with motives unresolved. S3 makes Bhairava choose the evacuation corridor over collecting the passenger, with guarded Ashwatthama guidance. This changes agency and the local objective, not merely camera framing.
3. **Mission 98 — KEEP MOVING, BUJJI.** S2 stages bounded vehicle departure without defining the passenger's future. S3 protects Bujji's departure preparation and the passage for Sumathi/refugees. It adds a concrete protection objective; it does not establish a driving mechanic or later passenger outcome.
4. **Mission 99 — A THREAT STILL ABOVE.** S2 is a closing perspective on Yaskin. S3 is preparation at the inheritance threshold. These are different completion purposes. A perspective shot alone cannot count as completion of the newer threshold objective.
5. **Mission 100 — AT THE UNFINISHED HORIZON.** S2 closes an open film-adaptation outline. S3 grants Karna powers and resolves the original Horizon Keeper protective stand. The existing original boss is not Yaskin. His defeat cannot be described as defeating Yaskin or ending the entire war.
6. **Recognition versus mastery.** Missions 91–96 intentionally withhold mastered present-day powers. That can coexist with a later Mission 100 unlock. It becomes contradictory only if the live text continues claiming the entire campaign has no power climax after the newer ending is adopted.
7. **Character metadata.** Foundation Mission 98/100 summaries mention Sumathi/refugees, while the inherited Arc 10 character array lists Bhairava, Bujji, Ashwatthama, Karna and Yaskin. The registry derives participation from that array. It does not currently prove a staged Sumathi/refugee role. This is a metadata/presentation gap, not permission to add an undocumented fate.

## What Missions 93–96 establish—and do not establish

**Mission 93:** Ashwatthama reacts to a connection. The source does not establish that Bhairava already understands it or that Ashwatthama delivers a particular speech.

**Mission 94:** A bounded ancient-war image is presented. Its point of view is unspecified. Treating it as the audience's cinematic revelation is a design option; claiming it is Bhairava's detailed personal memory would add unverified narrative content.

**Mission 95:** Chariot and archer imagery prepares the connection. This does not establish the weapon's proper name, a historical battle identity, companions, victories or a new Karna biography. No new named ancient characters are justified by these records.

**Mission 96:** The Karna connection is identified. The exact identification wording, speaker, mechanism and Bhairava's degree of understanding are not authored. A separate moment of recognition is not automatic command of every power.

**Minimum supported progression:** weapon-related suggestion → Ashwatthama's reaction → brief, clearly separated ancient imagery → archer/chariot association → Karna connection identified → return to present → documented original protective choice → inheritance at 100. The ordering is supported; final shot choreography and dialogue are design work requiring review, not recovered movie content.

## Reference evidence limitations

The old arc record cites CHAR-04 and CINE-01 and a 02:40:51–02:49:11 overview range. It explicitly says full reveal review is required. The naming-subtitle timestamp 02:46:45.672 is a claim recorded in the earlier project evidence; it was not independently rechecked against the movie in this investigation.

[CHAR-04 metadata](<C:/Users/Hp/Downloads/kalki 2898AD/phase4/movie-review-20261111/phase4-review-decisions.csv>) records modern vehicle imagery transitioning into gold-lit chariots, archery and a warrior reveal. Its requested 02:44:50–02:45:20 excerpt does not contain the later naming subtitle. It was rejected for the narrow Mission 2 encounter scope; that does not establish a campaign-wide ban on Karna. It remains a contextual reference, not a full scene script.

The same decisions record CINE-01 as approved for framing only. It does not approve late-film plot, extra character staging or movie-media distribution. [CINE-01 metadata](<C:/Users/Hp/Downloads/kalki 2898AD/phase4/movie-review-20261111/candidates/late_bhairava_closeup/CINE-01_024250-024320.mkv.json>) is also limited to a short contextual framing sample. No movie was played, extracted, copied or transcribed here. No scene or actor attribution was newly upgraded to verified.

## Connection to the existing early campaign

[Arc 1 contracts](<C:/Users/Hp/Downloads/kalki 2898AD/phase8/phase8.8/integration/staging/src/game/arcOne/contracts.js>) establish salvage, units/contracts, Bujji cooperation, competing claims and departure from Kashi. They do not already establish a selfless guardian or Karna mastery. The later foundation's protective choice must be earned through the designed pursuit, defeat, guarded cooperation and evacuation stakes. The [permanent Ashwatthama requirement](<C:/Users/Hp/Downloads/kalki 2898AD/DEVELOPMENT_CHECKLIST.md:30>) similarly asks for tension and earned respect, with gradual disclosure—not an exposition dump or disposable quest giver.

That original checklist places Ashwatthama's introduction in Arc 4, while the newer staged arc map places the transport confrontation in Arc 6 and Shambhala approach in Arc 8. Phase 8.1 already records that earlier mapping conflict. Do not silently solve it by moving characters or rewriting completed missions in this read-only task. It remains an earlier-campaign dependency for making the final relationship convincing.

## Recommendation, without applying a version

Use the later original-adaptation ending as the **recommended design basis**, because it follows the later explicit user objectives and already prepared power system. Preserve the older ending as provenance rather than presenting both as simultaneous live truth. In a separately authorized implementation, reconcile the story log, catalogue-facing objectives, foundation summaries, character participation and boss context to the selected basis.

Do not call the final plot undecidable merely because the old UI is stale. Conversely, do not treat broad outlines as a completed screenplay, claim full ancient-memory verification, or count generic interaction markers as finished recognition scenes. The accompanying mission design proposes bounded completion semantics and exposes missing presentation decisions. Nothing in this investigation grants abilities, enables missions, changes rewards or completes Phase 8.8 acceptance.
