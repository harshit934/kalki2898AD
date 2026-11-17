# Phase 6 Milestone 5E — Original Bhairava Telugu dialogue drafts

15 November 2026 · Asia/Calcutta

**All 51 AI-generated Telugu drafts are UNVERIFIED. Language review status: PENDING for every entry.** Neither these drafts nor their English meanings have received fluent-speaker approval. They are review documents only, not installed game text, recordings, voice permissions or new triggers.

The source is the existing game's English assistant wording and its implemented state logic. No movie dialogue, movie subtitle candidate, audio recording or actor performance was used to compose these lines. The direction is an original, calm, confident, observant and supportive field assistant. Do not imitate a specific actor's voice, delivery, mannerisms or catchphrases.

## How to review

- Keep the English source, proposed Telugu and English meaning separate. The English meaning is an AI reading of the proposed Telugu, not a certified back-translation.
- “Verified game context” means the trigger/data condition exists in the inspected source and/or the recorded pure-function checks. It does not mean fresh gameplay testing or observed personal progress. All values remain placeholders or conditional statements.
- 26 entries preserve literal existing English; 25 are readable dynamic templates/rendered variants. The source file, line, exact code excerpt and hash in the CSV/JSON establish their provenance. Readable slot names are review notation, not new game API keys.
- Every `{slot}` must come from the described authoritative value. Do not insert example reward amounts, completed missions, boss identities or unlocks. Localized status/reward/list values still need review. These documents are not drop-in localization files.
- Check natural conversation, combat brevity, pronouns, terminology, plural/number agreement, list grammar and factual qualifiers. Keep unknown distinct from zero, completion distinct from a viewed briefing, and stored awards distinct from a wallet balance.
- Enter human corrections in the separate review fields. No reviewer identity, date, APPROVED status or recording clearance has been supplied. The existing game Telugu and earlier 202-entry review sheet remain unchanged.

## Coverage

- 1. Mission guidance: 3 entries.
- 2. Combat tips: 3 entries.
- 3. Objective explanations: 3 entries.
- 4. Story and event explanations: 3 entries.
- 5. Mission completion conversations: 3 entries.
- 6. Player progress summaries: 12 entries.
- 7. Tenth-mission retrospective briefings: 8 entries.
- 8. Boss encounter guidance: 4 entries.
- 9. Replay and previously completed missions: 3 entries.
- 10. Missing-information fallback responses: 9 entries.

The following state-derived lines are proposals for existing response branches or fact readouts. They are **not automatic spoken cues**. No assistant activation, dismissal, timing, combat, menu, save, control or audio behavior is changed.

## 1. Mission guidance

### BH6-5E-001

- **Trigger/context:** Mission 1; Start guidance prompt (topic=initial).
- **Original game English source:** Clear the patrols, face the Warden, then collect the relic. Crystals and relay scans are optional.
- **Source form:** EXACT EXISTING ENGLISH
- **AI Telugu draft — UNVERIFIED:** కాపలాదారుల్ని ఓడించు. తర్వాత వార్డెన్‌ను ఎదుర్కొని, అవశేషాన్ని సేకరించు. క్రిస్టల్స్ సేకరించడం, రిలేలను స్కాన్ చేయడం తప్పనిసరి కాదు.
- **English meaning of draft — AI, unverified:** Defeat the patrols, then face the Warden and collect the relic. Collecting crystals and scanning relays are not compulsory.
- **Tone/delivery:** Confident, measured briefing. Pause between the three steps; keep the optional qualifier clear.
- **Game context:** VERIFIED IN CURRENT SOURCE; no new live gameplay test or personal-state observation
- **Review flags:** UNVERIFIED terminology: patrols, Warden, relic, crystals and relays need an agreed Telugu glossary. Preserve the optional nature of both activities.
- **Slots/bindings:** No dynamic placeholders.
- **Source:** src/game/assistant/responses.js:19
- **Language review status:** PENDING
- **Human correction/comments:** ____________________

### BH6-5E-002

- **Trigger/context:** Mission 1 objective-style prompt; attempt not ended, relic not collected, boss not intro/active/defeated, patrols remain.
- **Original game English source:** Clear the remaining patrols, then approach the arena.
- **Source form:** EXACT EXISTING ENGLISH
- **AI Telugu draft — UNVERIFIED:** మిగిలిన కాపలాదారుల్ని ఓడించు. ఆ తర్వాత పోరాట ప్రాంగణం వైపు వెళ్లు.
- **English meaning of draft — AI, unverified:** Defeat the remaining patrols, then go towards the combat arena.
- **Tone/delivery:** Direct and calm; two short instructions.
- **Game context:** VERIFIED IN CURRENT SOURCE; no new live gameplay test or personal-state observation
- **Review flags:** Review whether పోరాట ప్రాంగణం is natural for the existing arena. Do not imply a new route or teleport.
- **Slots/bindings:** No dynamic placeholders.
- **Source:** src/game/assistant/responses.js:18
- **Language review status:** PENDING
- **Human correction/comments:** ____________________

### BH6-5E-003

- **Trigger/context:** Same objective branch, but no patrols remain and boss is not intro/active/defeated.
- **Original game English source:** Approach the arena for the Warden encounter.
- **Source form:** EXACT EXISTING ENGLISH
- **AI Telugu draft — UNVERIFIED:** వార్డెన్‌ను ఎదుర్కోవడానికి పోరాట ప్రాంగణం వైపు వెళ్లు.
- **English meaning of draft — AI, unverified:** Head towards the arena to face the Warden.
- **Tone/delivery:** Steady, confident; no victory claim.
- **Game context:** VERIFIED IN CURRENT SOURCE; no new live gameplay test or personal-state observation
- **Review flags:** Warden is the existing Mission 1 opponent label; not an arc-final story character.
- **Slots/bindings:** No dynamic placeholders.
- **Source:** src/game/assistant/responses.js:18
- **Language review status:** PENDING
- **Human correction/comments:** ____________________

## 2. Combat tips

### BH6-5E-004

- **Trigger/context:** Mission 1 combat prompt; health <=30. This branch has priority even if a boss is active.
- **Original game English source:** Health is low. Create distance and read the wind-up before countering.
- **Source form:** EXACT EXISTING ENGLISH
- **AI Telugu draft — UNVERIFIED:** ఆరోగ్యం తక్కువగా ఉంది. కాస్త దూరం ఉంచు. ఎదురుదాడికి ముందు శత్రువు దాడి మొదలుపెట్టే కదలికను గమనించు.
- **English meaning of draft — AI, unverified:** Health is low. Keep some distance. Before counterattacking, watch the movement with which the enemy starts an attack.
- **Tone/delivery:** Brief urgency without shouting. Do not sound cheerful.
- **Game context:** VERIFIED IN CURRENT SOURCE; no new live gameplay test or personal-state observation
- **Review flags:** Wind-up phrasing is UNVERIFIED and may be too long during combat. Distance is tactical advice, not automatic movement or healing.
- **Slots/bindings:** No dynamic placeholders.
- **Source:** src/game/assistant/responses.js:20
- **Language review status:** PENDING
- **Human correction/comments:** ____________________

### BH6-5E-005

- **Trigger/context:** Mission 1 combat prompt; health >30 and bossStatus=active.
- **Original game English source:** Read the Warden’s wind-up; evade or guard, then counter during recovery.
- **Source form:** EXACT EXISTING ENGLISH
- **AI Telugu draft — UNVERIFIED:** వార్డెన్ దాడికి సిద్ధమయ్యే కదలికను గమనించు. తప్పించుకో లేదా రక్షణగా నిలబడు. దాడి తర్వాత మళ్లీ సిద్ధమయ్యేలోపు ఎదురుదాడి చేయి.
- **English meaning of draft — AI, unverified:** Watch the Warden preparing an attack. Evade or defend, then counter before the Warden is ready again after attacking.
- **Tone/delivery:** Controlled, observant combat instruction; short pauses.
- **Game context:** VERIFIED IN CURRENT SOURCE; no new live gameplay test or personal-state observation
- **Review flags:** Review precise terms for guard, wind-up and recovery. Do not imply invulnerability, a guaranteed hit or a new guard mechanic.
- **Slots/bindings:** No dynamic placeholders.
- **Source:** src/game/assistant/responses.js:20
- **Language review status:** PENDING
- **Human correction/comments:** ____________________

### BH6-5E-006

- **Trigger/context:** Mission 1 combat prompt; health >30 and boss is not active.
- **Original game English source:** Watch the patrol’s wind-up, guard or evade, then counter. Advice does not change combat rules.
- **Source form:** EXACT EXISTING ENGLISH
- **AI Telugu draft — UNVERIFIED:** కాపలాదారు దాడికి సిద్ధమయ్యే కదలికను గమనించు. రక్షణగా నిలబడు లేదా తప్పించుకుని, తర్వాత ఎదురుదాడి చేయి. ఈ సలహాతో పోరాట నియమాలు మారవు.
- **English meaning of draft — AI, unverified:** Watch the patrol preparing to attack. Defend or evade and then counter. This advice does not alter combat rules.
- **Tone/delivery:** Direct, practical; final sentence factual rather than boastful.
- **Game context:** VERIFIED IN CURRENT SOURCE; no new live gameplay test or personal-state observation
- **Review flags:** Review conversational wording for the final technical qualifier; do not omit it from this source-faithful review draft.
- **Slots/bindings:** No dynamic placeholders.
- **Source:** src/game/assistant/responses.js:20
- **Language review status:** PENDING
- **Human correction/comments:** ____________________

## 3. Objective explanations

### BH6-5E-007

- **Trigger/context:** Mission 1 factual snapshot; used with initial, objective/remaining/boss and completion/replay answers.
- **Original game English source:** Patrols remaining: {patrol_count}. Boss state: {boss_state}. Relic: {relic_state}. Optional relays scanned: {relay_count}/3.
- **Source form:** READABLE TEMPLATE / RENDERED VARIANT OF EXISTING ENGLISH
- **AI Telugu draft — UNVERIFIED:** మిగిలిన కాపలాదారులు: {patrol_count}. బాస్ స్థితి: {boss_state}. అవశేషం: {relic_state}. తప్పనిసరి కాని రిలే స్కాన్‌లు: {relay_count}/3.
- **English meaning of draft — AI, unverified:** Remaining patrols, boss state, relic state and optional relay scans out of three are reported exactly as supplied.
- **Tone/delivery:** Observant status readout; pause at each field.
- **Game context:** VERIFIED IN CURRENT SOURCE; no new live gameplay test or personal-state observation
- **Review flags:** All state-value translations and spoken number forms need review. Keep zero distinct from unknown. The three relays are optional.
- **Slots/bindings:** patrol_count=c.enemiesRemaining.length; boss_state=c.bossStatus; relic_state=collected/not collected from c.relic; relay_count=c.scans. Labels/values are review placeholders, not new runtime keys.
- **Source:** src/game/assistant/responses.js:17
- **Language review status:** PENDING
- **Human correction/comments:** ____________________

### BH6-5E-008

- **Trigger/context:** Mission 1 combat answer factual snapshot.
- **Original game English source:** Current health: {health}.
- **Source form:** READABLE TEMPLATE / RENDERED VARIANT OF EXISTING ENGLISH
- **AI Telugu draft — UNVERIFIED:** ప్రస్తుత ఆరోగ్యం: {health}.
- **English meaning of draft — AI, unverified:** Current health: the provided health value.
- **Tone/delivery:** Calm numeric readout; no diagnosis or healing promise.
- **Game context:** VERIFIED IN CURRENT SOURCE; no new live gameplay test or personal-state observation
- **Review flags:** Check conversational register, grammar, word order and meaning with a fluent Telugu speaker.
- **Slots/bindings:** health=c.health. Keep the current numeric value; do not insert a percentage sign or change the maximum.
- **Source:** src/game/assistant/responses.js:20
- **Language review status:** PENDING
- **Human correction/comments:** ____________________

### BH6-5E-009

- **Trigger/context:** Mission 1 combat answer factual snapshot.
- **Original game English source:** Boss phase: {phase}.
- **Source form:** READABLE TEMPLATE / RENDERED VARIANT OF EXISTING ENGLISH
- **AI Telugu draft — UNVERIFIED:** బాస్ పోరాట దశ: {phase}.
- **English meaning of draft — AI, unverified:** Boss fight phase: the supplied phase number.
- **Tone/delivery:** Short and informative; no unrecorded attack advice.
- **Game context:** VERIFIED IN CURRENT SOURCE; no new live gameplay test or personal-state observation
- **Review flags:** Check conversational register, grammar, word order and meaning with a fluent Telugu speaker.
- **Slots/bindings:** phase=c.phase. A phase number does not establish a boss defeat.
- **Source:** src/game/assistant/responses.js:20
- **Language review status:** PENDING
- **Human correction/comments:** ____________________

## 4. Story and event explanations

### BH6-5E-010

- **Trigger/context:** Progress facts; only eligible seenBriefings IDs are listed.
- **Original game English source:** Briefings marked seen (completed or skipped, not mission completion): {seen_briefings}.
- **Source form:** READABLE TEMPLATE / RENDERED VARIANT OF EXISTING ENGLISH
- **AI Telugu draft — UNVERIFIED:** చూసినవిగా గుర్తించిన వివరణలు—పూర్తిగా చూసినవి లేదా దాటవేసినవి: {seen_briefings}. దీనర్థం ఆ మిషన్లు పూర్తయ్యాయని కాదు.
- **English meaning of draft — AI, unverified:** These briefings are marked seen, whether fully viewed or skipped. That does not mean the missions were completed.
- **Tone/delivery:** Serious, clear distinction; no invented viewing history.
- **Game context:** VERIFIED IN CURRENT SOURCE; no new live gameplay test or personal-state observation
- **Review flags:** Review briefing terminology and whether the dash should be a subtitle line break. Never equate seen with watched to completion.
- **Slots/bindings:** seen_briefings=list(p.seenBriefings), filtered to eligible routes. No chronology or cinematic playback receipt is available.
- **Source:** src/game/assistant/progress.js:51
- **Language review status:** PENDING
- **Human correction/comments:** ____________________

### BH6-5E-011

- **Trigger/context:** Accepted tenth-mission recap; explains missing event detail.
- **Original game English source:** The save does not record attack-by-attack events, story choices or cinematic viewing; those details cannot be verified from completion IDs.
- **Source form:** EXACT EXISTING ENGLISH
- **AI Telugu draft — UNVERIFIED:** సేవ్‌లో ప్రతి దాడి వివరాలు, కథలో చేసిన ఎంపికలు, కథా సన్నివేశాలు చూశావా లేదా అన్న సమాచారం ఉండదు. మిషన్ పూర్తయినట్టు నమోదైన వివరాలతో మాత్రమే వాటిని నిర్ధారించలేం.
- **English meaning of draft — AI, unverified:** The save lacks each attack, story choices and whether cinematics were watched. Completion records alone cannot verify those details.
- **Tone/delivery:** Serious and matter-of-fact; no invented recollections.
- **Game context:** VERIFIED IN CURRENT SOURCE; no new live gameplay test or personal-state observation
- **Review flags:** Review cinematic terminology. This explains absent data; it does not assert the player made story choices or watched any scene.
- **Slots/bindings:** No dynamic placeholders.
- **Source:** src/game/assistant/progress.js:69
- **Language review status:** PENDING
- **Human correction/comments:** ____________________

### BH6-5E-012

- **Trigger/context:** Accepted tenth-mission recap; local challenge completed, broader story history not established.
- **Original game English source:** Current story position: the recorded local challenge is cleared. Missing chapters and intervening story events are not inferred.
- **Source form:** EXACT EXISTING ENGLISH
- **AI Telugu draft — UNVERIFIED:** కథలో ప్రస్తుత స్థితి: నమోదైన ఈ సవాలు పూర్తయింది. నమోదు లేని అధ్యాయాలూ, మధ్యలో జరిగే కథా సంఘటనలూ జరిగినట్టుగా ఊహించను.
- **English meaning of draft — AI, unverified:** Current story position is limited to the recorded cleared challenge. Unrecorded chapters and intervening story events are not assumed.
- **Tone/delivery:** Calm, serious; keep the limitation audible.
- **Game context:** VERIFIED IN CURRENT SOURCE; no new live gameplay test or personal-state observation
- **Review flags:** Local challenge is a game encounter, not the full story arc. Review సవాలు/అధ్యాయం terminology.
- **Slots/bindings:** No dynamic placeholders.
- **Source:** src/game/assistant/progress.js:70
- **Language review status:** PENDING
- **Human correction/comments:** ____________________

## 5. Mission completion conversations

### BH6-5E-013

- **Trigger/context:** Mission 1 completion/replay prompt; savedComplete=true and c.replay=false.
- **Original game English source:** A completion is recorded. The facts list shows actual saved rewards.
- **Source form:** EXACT EXISTING ENGLISH
- **AI Telugu draft — UNVERIFIED:** మిషన్ పూర్తయినట్టు నమోదుంది. వివరాల జాబితాలో సేవ్‌లో ఉన్న బహుమతులనే చూపిస్తున్నాను.
- **English meaning of draft — AI, unverified:** Completion is recorded. The facts list shows only the rewards present in the save.
- **Tone/delivery:** Restrained acknowledgement, then factual delivery.
- **Game context:** VERIFIED IN CURRENT SOURCE; no new live gameplay test or personal-state observation
- **Review flags:** Do not add congratulations for unseen events, a reward amount or an unlock promise.
- **Slots/bindings:** No dynamic placeholders.
- **Source:** src/game/assistant/responses.js:21
- **Language review status:** PENDING
- **Human correction/comments:** ____________________

### BH6-5E-014

- **Trigger/context:** Mission 1 completion/replay prompt; savedComplete=false, irrespective of visual boss state.
- **Original game English source:** No saved completion is recorded. Defeating the boss alone does not establish saved completion.
- **Source form:** EXACT EXISTING ENGLISH
- **AI Telugu draft — UNVERIFIED:** సేవ్‌లో మిషన్ పూర్తయినట్టు నమోదు లేదు. బాస్‌ను ఓడించానన్న ఒక్క విషయంతో సేవ్‌లో కూడా నమోదైందని అనుకోలేం.
- **English meaning of draft — AI, unverified:** The save has no completion record. A claim of defeating the boss alone does not prove a saved record exists.
- **Tone/delivery:** Firm but supportive; explain the evidence boundary.
- **Game context:** VERIFIED IN CURRENT SOURCE; no new live gameplay test or personal-state observation
- **Review flags:** SOURCE QUALIFICATION: bossSystem calls completeMission on defeat when its guards permit. This conditional line concerns a missing record, not a claim that boss defeat never saves completion. Do not strengthen it into that false rule.
- **Slots/bindings:** No dynamic placeholders.
- **Source:** src/game/assistant/responses.js:21
- **Language review status:** PENDING
- **Human correction/comments:** ____________________

### BH6-5E-015

- **Trigger/context:** Mission 1 completion/replay facts; uses current selected-route saved reward entries.
- **Original game English source:** Recorded rewards: {recorded_rewards}.
- **Source form:** READABLE TEMPLATE / RENDERED VARIANT OF EXISTING ENGLISH
- **AI Telugu draft — UNVERIFIED:** నమోదైన బహుమతులు: {recorded_rewards}.
- **English meaning of draft — AI, unverified:** Recorded rewards are the supplied saved entries.
- **Tone/delivery:** Neutral and precise; no new payout announcement.
- **Game context:** VERIFIED IN CURRENT SOURCE; no new live gameplay test or personal-state observation
- **Review flags:** Review reward-key terminology. The source fallback none means no valid entries shown, not a proven zero reward or zero wallet.
- **Slots/bindings:** recorded_rewards=entries of c.rewards filtered to finite nonnegative amounts; source fallback none. Do not invent missing keys or amounts.
- **Source:** src/game/assistant/responses.js:21
- **Language review status:** PENDING
- **Human correction/comments:** ____________________

## 6. Player progress summaries

### BH6-5E-016

- **Trigger/context:** Progress summary prompt on currently supported routes.
- **Original game English source:** Here is what your current campaign records actually establish. An unlocked chapter can still be unbuilt; a viewed briefing is not a completed mission.
- **Source form:** EXACT EXISTING ENGLISH
- **AI Telugu draft — UNVERIFIED:** నీ ప్రస్తుత క్యాంపెయిన్ రికార్డుల్లో ఉన్న వివరాలే చెబుతున్నాను. అన్‌లాక్ అయిన అధ్యాయం ఇంకా ఆడేలా సిద్ధం కాకపోవచ్చు. వివరణ చూసినంత మాత్రాన మిషన్ పూర్తయినట్టు కాదు.
- **English meaning of draft — AI, unverified:** I report what the current campaign records establish. An unlocked chapter may still be unbuilt, and viewing a briefing does not mean completing a mission.
- **Tone/delivery:** Calm, confident explanation; no developer-like sales pitch.
- **Game context:** VERIFIED IN CURRENT SOURCE; no new live gameplay test or personal-state observation
- **Review flags:** UNVERIFIED terminology: క్యాంపెయిన్ and briefing/explanation wording need a consistent game glossary. Unbuilt refers to implementation, not a fictional locked gate.
- **Slots/bindings:** No dynamic placeholders.
- **Source:** src/game/assistant/progress.js:58
- **Language review status:** PENDING
- **Human correction/comments:** ____________________

### BH6-5E-017

- **Trigger/context:** Progress fact; completed IDs intersect supported implemented/playable routes.
- **Original game English source:** Recorded completed playable missions ({completed_count}): {completed_missions}.
- **Source form:** READABLE TEMPLATE / RENDERED VARIANT OF EXISTING ENGLISH
- **AI Telugu draft — UNVERIFIED:** ఆడగలిగే మిషన్లలో పూర్తయినట్టు నమోదైనవి ({completed_count}): {completed_missions}.
- **English meaning of draft — AI, unverified:** Among playable missions, these are recorded complete, with the supplied count and list.
- **Tone/delivery:** Measured summary, not celebration of the whole campaign.
- **Game context:** VERIFIED IN CURRENT SOURCE; no new live gameplay test or personal-state observation
- **Review flags:** Check conversational register, grammar, word order and meaning with a fluent Telugu speaker.
- **Slots/bindings:** completed_count=p.completed.length; completed_missions=list(p.completed). Deduplicated supported records only; empty source list is none.
- **Source:** src/game/assistant/progress.js:45
- **Language review status:** PENDING
- **Human correction/comments:** ____________________

### BH6-5E-018

- **Trigger/context:** Progress fact; current route/status from buildProgress.
- **Original game English source:** Current mission: {current_mission} — {current_status}.
- **Source form:** READABLE TEMPLATE / RENDERED VARIANT OF EXISTING ENGLISH
- **AI Telugu draft — UNVERIFIED:** ప్రస్తుత మిషన్: {current_mission}. స్థితి: {current_status}.
- **English meaning of draft — AI, unverified:** Current mission and its supplied status.
- **Tone/delivery:** Clear two-part readout.
- **Game context:** VERIFIED IN CURRENT SOURCE; no new live gameplay test or personal-state observation
- **Review flags:** All current_status values need their own approved localized forms. This document does not install a status translator or mistake a paused implementation for the pause menu.
- **Slots/bindings:** current_mission=missionLabel(p.current.id); current_status=p.current.status, including active/replay/ended, locked, unavailable and not-running distinctions.
- **Source:** src/game/assistant/progress.js:46
- **Language review status:** PENDING
- **Human correction/comments:** ____________________

### BH6-5E-019

- **Trigger/context:** Progress fact; source intersection of saved unlock IDs and implemented/playable allowlist.
- **Original game English source:** Unlocked and available (including replays): {available_missions}.
- **Source form:** READABLE TEMPLATE / RENDERED VARIANT OF EXISTING ENGLISH
- **AI Telugu draft — UNVERIFIED:** అన్‌లాక్ అయి, ఇప్పుడు ఆడేందుకు అందుబాటులో ఉన్న మిషన్లు—మళ్లీ ఆడేవాటితో సహా: {available_missions}.
- **English meaning of draft — AI, unverified:** Unlocked missions available to play now, including replays.
- **Tone/delivery:** Helpful, precise; no automatic launch.
- **Game context:** VERIFIED IN CURRENT SOURCE; no new live gameplay test or personal-state observation
- **Review flags:** Check conversational register, grammar, word order and meaning with a fluent Telugu speaker.
- **Slots/bindings:** available_missions=list(p.unlockedAvailable). Do not include planned/paused catalogue entries.
- **Source:** src/game/assistant/progress.js:47
- **Language review status:** PENDING
- **Human correction/comments:** ____________________

### BH6-5E-020

- **Trigger/context:** Progress/accepted recap; p.next exists.
- **Original game English source:** Next unfinished available mission: {next_mission}.
- **Source form:** READABLE TEMPLATE / RENDERED VARIANT OF EXISTING ENGLISH
- **AI Telugu draft — UNVERIFIED:** ఇంకా పూర్తి చేయని, ఆడేందుకు అందుబాటులో ఉన్న తదుపరి మిషన్: {next_mission}.
- **English meaning of draft — AI, unverified:** The next available mission that has not yet been completed.
- **Tone/delivery:** Direct recommendation without promising a new unlock.
- **Game context:** VERIFIED IN CURRENT SOURCE; no new live gameplay test or personal-state observation
- **Review flags:** Check conversational register, grammar, word order and meaning with a fluent Telugu speaker.
- **Slots/bindings:** next_mission=missionLabel(p.next), the first unlocked eligible unfinished route in catalogue order, not necessarily current mission +1.
- **Source:** src/game/assistant/progress.js:48
- **Language review status:** PENDING
- **Human correction/comments:** ____________________

### BH6-5E-021

- **Trigger/context:** Progress basis fact; dynamic denominator is supported routes, not 100.
- **Original game English source:** Progress basis: {completed_count}/{supported_count} implemented routes have recorded completion; this is not completion of the full campaign.
- **Source form:** READABLE TEMPLATE / RENDERED VARIANT OF EXISTING ENGLISH
- **AI Telugu draft — UNVERIFIED:** అమలులో ఉన్న {supported_count} మిషన్ మార్గాల్లో {completed_count} పూర్తయినట్టు నమోదుంది. ఇది మొత్తం క్యాంపెయిన్ పూర్తయిందని కాదు.
- **English meaning of draft — AI, unverified:** Of the implemented supported routes, the provided count is recorded complete. This does not mean the full campaign is complete.
- **Tone/delivery:** Calm, explicit about scope.
- **Game context:** VERIFIED IN CURRENT SOURCE; no new live gameplay test or personal-state observation
- **Review flags:** Campaign/route wording requires review; do not read the fraction as progress through all 100 planned chapters.
- **Slots/bindings:** completed_count=p.completed.length; supported_count=p.supported.length. Values are live-state slots, not invented player progress.
- **Source:** src/game/assistant/progress.js:49
- **Language review status:** PENDING
- **Human correction/comments:** ____________________

### BH6-5E-022

- **Trigger/context:** Progress fact; excludes ineligible planned or paused routes.
- **Original game English source:** Planned or paused catalogue entries: {planned_count}; not treated as completed or playable.
- **Source form:** READABLE TEMPLATE / RENDERED VARIANT OF EXISTING ENGLISH
- **AI Telugu draft — UNVERIFIED:** ప్రణాళికలో ఉన్న లేదా అమలు నిలిపి ఉంచిన మిషన్లు: {planned_count}. వీటిని పూర్తయినవిగా గానీ, ఆడగలిగేవిగా గానీ లెక్కించను.
- **English meaning of draft — AI, unverified:** Planned or implementation-paused missions are counted separately and not treated as completed or playable.
- **Tone/delivery:** Matter-of-fact; no invented in-world explanation.
- **Game context:** VERIFIED IN CURRENT SOURCE; no new live gameplay test or personal-state observation
- **Review flags:** Paused means implementation paused, not gameplay pause. Review whether this technical notice should remain text-only in any future voice work.
- **Slots/bindings:** planned_count=p.plannedCount from catalogue eligibility filtering.
- **Source:** src/game/assistant/progress.js:50
- **Language review status:** PENDING
- **Human correction/comments:** ____________________

### BH6-5E-023

- **Trigger/context:** Progress or accepted recap; only recorded completed route reward entries.
- **Original game English source:** {mission} recorded rewards — {reward_entries}.
- **Source form:** READABLE TEMPLATE / RENDERED VARIANT OF EXISTING ENGLISH
- **AI Telugu draft — UNVERIFIED:** {mission} కోసం నమోదైన బహుమతులు: {reward_entries}.
- **English meaning of draft — AI, unverified:** Recorded rewards for the supplied mission.
- **Tone/delivery:** Neutral ledger reading; no payout sound or promise.
- **Game context:** VERIFIED IN CURRENT SOURCE; no new live gameplay test or personal-state observation
- **Review flags:** Check conversational register, grammar, word order and meaning with a fluent Telugu speaker.
- **Slots/bindings:** mission=missionLabel(id); reward_entries=rewardText(p.rewards[id] ?? {}). Missing values remain unknown, not zero.
- **Source:** src/game/assistant/progress.js:52
- **Language review status:** PENDING
- **Human correction/comments:** ____________________

### BH6-5E-024

- **Trigger/context:** Progress totals fact; valid recorded completion rewards grouped by saved key.
- **Original game English source:** Known totals by saved reward key: {reward_totals}. These are recorded awards, not a spendable balance.
- **Source form:** READABLE TEMPLATE / RENDERED VARIANT OF EXISTING ENGLISH
- **AI Telugu draft — UNVERIFIED:** సేవ్‌లోని బహుమతి రకాలవారీగా తెలిసిన మొత్తాలు: {reward_totals}. ఇవి నమోదైన బహుమతులు మాత్రమే; ప్రస్తుతం ఖర్చు చేయగల నిల్వ కాదు.
- **English meaning of draft — AI, unverified:** Known saved reward totals by type are recorded awards, not a current spendable balance.
- **Tone/delivery:** Precise, especially on the wallet distinction.
- **Game context:** VERIFIED IN CURRENT SOURCE; no new live gameplay test or personal-state observation
- **Review flags:** Check conversational register, grammar, word order and meaning with a fluent Telugu speaker.
- **Slots/bindings:** reward_totals=rewardText(p.totalsByKey). Preserve each key, zero and unknown; do not combine incompatible reward types.
- **Source:** src/game/assistant/progress.js:53
- **Language review status:** PENDING
- **Human correction/comments:** ____________________

### BH6-5E-025

- **Trigger/context:** Progress; p.unlockedUnavailable has entries.
- **Original game English source:** Unlocked references that are unavailable: {unavailable_unlocked}; no launch is offered.
- **Source form:** READABLE TEMPLATE / RENDERED VARIANT OF EXISTING ENGLISH
- **AI Telugu draft — UNVERIFIED:** అన్‌లాక్ అయినట్టు నమోదున్నా, ఆడేందుకు అందుబాటులో లేనివి: {unavailable_unlocked}. వీటిని ప్రారంభించే ఎంపిక ఇవ్వను.
- **English meaning of draft — AI, unverified:** These are recorded as unlocked but unavailable; no launch is offered.
- **Tone/delivery:** Clear limitation without scolding.
- **Game context:** VERIFIED IN CURRENT SOURCE; no new live gameplay test or personal-state observation
- **Review flags:** Check conversational register, grammar, word order and meaning with a fluent Telugu speaker.
- **Slots/bindings:** unavailable_unlocked=list(p.unlockedUnavailable). This is not an unlock or launch action.
- **Source:** src/game/assistant/progress.js:54
- **Language review status:** PENDING
- **Human correction/comments:** ____________________

### BH6-5E-026

- **Trigger/context:** Progress; excluded saved completion references exist.
- **Original game English source:** Saved references excluded from completed gameplay: {excluded_missions} (unavailable or unknown).
- **Source form:** READABLE TEMPLATE / RENDERED VARIANT OF EXISTING ENGLISH
- **AI Telugu draft — UNVERIFIED:** అందుబాటులో లేనివి లేదా గుర్తించలేనివి కావడంతో, సేవ్‌లోని ఈ సూచనలను పూర్తయిన ఆటగా లెక్కించలేదు: {excluded_missions}.
- **English meaning of draft — AI, unverified:** Unavailable or unknown references in the save are excluded from completed gameplay counts.
- **Tone/delivery:** Careful and nonjudgmental; do not claim corruption.
- **Game context:** VERIFIED IN CURRENT SOURCE; no new live gameplay test or personal-state observation
- **Review flags:** Check conversational register, grammar, word order and meaning with a fluent Telugu speaker.
- **Slots/bindings:** excluded_missions=list(p.excludedCompletion). Source save is not rewritten or deleted.
- **Source:** src/game/assistant/progress.js:55
- **Language review status:** PENDING
- **Human correction/comments:** ____________________

### BH6-5E-027

- **Trigger/context:** Progress; an unattributed reward entry exists without accepted completion or on an unavailable route.
- **Original game English source:** Unattributed reward record for {mission} — {reward_entries}; {reason}, not credited to completion totals.
- **Source form:** READABLE TEMPLATE / RENDERED VARIANT OF EXISTING ENGLISH
- **AI Telugu draft — UNVERIFIED:** {mission} కోసం సరైన పూర్తి నమోదుతో జతకాని బహుమతి వివరాలు: {reward_entries}. కారణం: {reason}. పూర్తయిన మిషన్ల బహుమతుల మొత్తంలో వీటిని చేర్చలేదు.
- **English meaning of draft — AI, unverified:** This mission reward record cannot be associated with accepted completion for the stated reason, so it is excluded from completion totals.
- **Tone/delivery:** Serious evidence explanation, not accusation.
- **Game context:** VERIFIED IN CURRENT SOURCE; no new live gameplay test or personal-state observation
- **Review flags:** Review terminology for unattributed. The line describes read-only accounting; it must not suggest rewards were removed from a wallet.
- **Slots/bindings:** mission=missionLabel(r.id); reward_entries=rewardText(r.values); reason=no recorded completion or unavailable or unknown route. Reason values still need localized review.
- **Source:** src/game/assistant/progress.js:56
- **Language review status:** PENDING
- **Human correction/comments:** ____________________

## 7. Tenth-mission retrospective briefings

### BH6-5E-028

- **Trigger/context:** Recap request for supported milestone with an accepted completion record.
- **Original game English source:** Your {milestone} record confirms this encounter, not a complete history of the preceding chapters. Here are the recorded rewards and the gaps we must leave unknown.
- **Source form:** READABLE TEMPLATE / RENDERED VARIANT OF EXISTING ENGLISH
- **AI Telugu draft — UNVERIFIED:** నీ {milestone} నమోదు ఈ పోరు పూర్తయిందని మాత్రమే చెబుతుంది; ముందు అధ్యాయాలన్నింటి పూర్తి చరిత్రను కాదు. నమోదైన బహుమతుల్ని చెబుతాను. సమాచారం లేని చోట తెలియదనే ఉంచుతాను.
- **English meaning of draft — AI, unverified:** The milestone record confirms only that encounter, not every preceding chapter. Recorded rewards are reported and missing information remains unknown.
- **Tone/delivery:** Reflective and serious; no invented memories or spoilers.
- **Game context:** VERIFIED IN CURRENT SOURCE; no new live gameplay test or personal-state observation
- **Review flags:** Review whether పోరు covers the recorded local encounter without adding narrative victory claims.
- **Slots/bindings:** milestone=missionLabel(milestone.id). Only supported completed tenth-mission encounters; not a promise the preceding nine chapters exist or are complete.
- **Source:** src/game/assistant/progress.js:74
- **Language review status:** PENDING
- **Human correction/comments:** ____________________

### BH6-5E-029

- **Trigger/context:** Accepted recap fact; milestone.complete=true.
- **Original game English source:** {milestone} — recorded local encounter completion: {encounter_name}.
- **Source form:** READABLE TEMPLATE / RENDERED VARIANT OF EXISTING ENGLISH
- **AI Telugu draft — UNVERIFIED:** {milestone}: ఇక్కడి పోరు పూర్తయినట్టు నమోదుంది. పోరు పేరు: {encounter_name}.
- **English meaning of draft — AI, unverified:** The local encounter at the milestone is recorded complete; the existing encounter name is supplied.
- **Tone/delivery:** Restrained acknowledgement; retain the local scope.
- **Game context:** VERIFIED IN CURRENT SOURCE; no new live gameplay test or personal-state observation
- **Review flags:** Check conversational register, grammar, word order and meaning with a fluent Telugu speaker.
- **Slots/bindings:** milestone=missionLabel(milestone.id); encounter_name=milestone.name from existing ARC_BOSSES. Never introduce movie opponents or future outcomes.
- **Source:** src/game/assistant/progress.js:64
- **Language review status:** PENDING
- **Human correction/comments:** ____________________

### BH6-5E-030

- **Trigger/context:** Accepted recap; ten-mission range history intersection.
- **Original game English source:** Recorded history in this ten-mission range: {recorded_history}.
- **Source form:** READABLE TEMPLATE / RENDERED VARIANT OF EXISTING ENGLISH
- **AI Telugu draft — UNVERIFIED:** ఈ పది మిషన్ల పరిధిలో నమోదైన పూర్తి వివరాలు: {recorded_history}.
- **English meaning of draft — AI, unverified:** Recorded completion history within this ten-mission range.
- **Tone/delivery:** Measured recap; do not turn a list into invented chronology.
- **Game context:** VERIFIED IN CURRENT SOURCE; no new live gameplay test or personal-state observation
- **Review flags:** Review పూర్తి వివరాలు: it means completion records here, not a comprehensive account of every event.
- **Slots/bindings:** recorded_history=list(history), the range IDs that actually have accepted completion records.
- **Source:** src/game/assistant/progress.js:65
- **Language review status:** PENDING
- **Human correction/comments:** ____________________

### BH6-5E-031

- **Trigger/context:** Accepted recap; missing accepted completions in the range.
- **Original game English source:** No accepted completion history for: {missing_missions}.
- **Source form:** READABLE TEMPLATE / RENDERED VARIANT OF EXISTING ENGLISH
- **AI Telugu draft — UNVERIFIED:** ఈ మిషన్లు పూర్తయినవిగా లెక్కించే నమోదు లేదు: {missing_missions}.
- **English meaning of draft — AI, unverified:** These missions lack completion records accepted for the summary.
- **Tone/delivery:** Calm about uncertainty; not a claim of failure.
- **Game context:** VERIFIED IN CURRENT SOURCE; no new live gameplay test or personal-state observation
- **Review flags:** Check conversational register, grammar, word order and meaning with a fluent Telugu speaker.
- **Slots/bindings:** missing_missions=list(missing). Absence of accepted history is not proof of a specific player action.
- **Source:** src/game/assistant/progress.js:66
- **Language review status:** PENDING
- **Human correction/comments:** ____________________

### BH6-5E-032

- **Trigger/context:** Accepted recap; range includes unsupported/paused routes.
- **Original game English source:** Unimplemented or paused chapters in this range: {unavailable_chapters}.
- **Source form:** READABLE TEMPLATE / RENDERED VARIANT OF EXISTING ENGLISH
- **AI Telugu draft — UNVERIFIED:** ఈ పరిధిలో ఇంకా అమలు కాని లేదా అమలు నిలిపి ఉంచిన అధ్యాయాలు: {unavailable_chapters}.
- **English meaning of draft — AI, unverified:** Chapters in the range that are unimplemented or whose implementation is paused.
- **Tone/delivery:** Factual limitation, no invented plot bridge.
- **Game context:** VERIFIED IN CURRENT SOURCE; no new live gameplay test or personal-state observation
- **Review flags:** Check conversational register, grammar, word order and meaning with a fluent Telugu speaker.
- **Slots/bindings:** unavailable_chapters=list(unavailable). Not gameplay pause and not a new chapter unlock.
- **Source:** src/game/assistant/progress.js:67
- **Language review status:** PENDING
- **Human correction/comments:** ____________________

### BH6-5E-033

- **Trigger/context:** Recap milestone=100 and accepted completion exists; extra warning.
- **Original game English source:** A Mission 100 record is not proof that all 100 chapters are complete. No later mission or sequel outcome is implied.
- **Source form:** EXACT EXISTING ENGLISH
- **AI Telugu draft — UNVERIFIED:** మిషన్ 100 నమోదు ఉన్నంత మాత్రాన వంద అధ్యాయాలూ పూర్తయ్యాయని కాదు. దీని తర్వాతి మిషన్ గురించి గానీ, కొనసాగింపు కథ ఫలితం గురించి గానీ ఏదీ చెప్పడం లేదు.
- **English meaning of draft — AI, unverified:** A Mission 100 record does not prove every chapter complete and implies no later mission or sequel outcome.
- **Tone/delivery:** Serious, definitive boundary; no triumphant campaign-ending claim.
- **Game context:** VERIFIED IN CURRENT SOURCE; no new live gameplay test or personal-state observation
- **Review flags:** UNVERIFIED phrasing for sequel outcome. This is a conditional review template, not an assertion the player completed Mission 100.
- **Slots/bindings:** No dynamic placeholders.
- **Source:** src/game/assistant/progress.js:72
- **Language review status:** PENDING
- **Human correction/comments:** ____________________

### BH6-5E-034

- **Trigger/context:** Supported milestone exists but milestone.complete=false.
- **Original game English source:** There is no completion recap to tell yet. Future encounters, events and rewards are not described.
- **Source form:** EXACT EXISTING ENGLISH
- **AI Telugu draft — UNVERIFIED:** పూర్తయిన మిషన్‌గా చెప్పేందుకు ఇంకా నమోదు లేదు. ముందున్న పోరాటాలు, సంఘటనలు, బహుమతుల గురించి చెప్పను.
- **English meaning of draft — AI, unverified:** There is no completion record on which to base a recap yet; future encounters, events and rewards are not described.
- **Tone/delivery:** Supportive restraint; no spoilers or invented anticipation.
- **Game context:** VERIFIED IN CURRENT SOURCE; no new live gameplay test or personal-state observation
- **Review flags:** The source means no completion recap, not that later content is necessarily implemented or available.
- **Slots/bindings:** No dynamic placeholders.
- **Source:** src/game/assistant/progress.js:62
- **Language review status:** PENDING
- **Human correction/comments:** ____________________

### BH6-5E-035

- **Trigger/context:** Defensive recap API branch: requested milestone absent from p.milestones; not a normal supported dropdown choice.
- **Original game English source:** No recap is available; no completion or future event is inferred.
- **Source form:** EXACT EXISTING ENGLISH
- **AI Telugu draft — UNVERIFIED:** ఈ సమీక్ష అందుబాటులో లేదు. మిషన్ పూర్తయిందనీ, తర్వాత ఏదో సంఘటన జరిగిందనీ ఊహించను.
- **English meaning of draft — AI, unverified:** No recap is available; completion or a future event is not inferred.
- **Tone/delivery:** Brief, composed fallback.
- **Game context:** VERIFIED IN CURRENT SOURCE; no new live gameplay test or personal-state observation
- **Review flags:** Review recap/సమీక్ష terminology. Defensive fallback only; do not add a new menu option or mission.
- **Slots/bindings:** No dynamic placeholders.
- **Source:** src/game/assistant/progress.js:61
- **Language review status:** PENDING
- **Human correction/comments:** ____________________

## 8. Boss encounter guidance

### BH6-5E-036

- **Trigger/context:** Mission 1 objective-style answer; gameOver=false, relic=false, bossStatus=intro.
- **Original game English source:** The boss introduction is underway.
- **Source form:** EXACT EXISTING ENGLISH
- **AI Telugu draft — UNVERIFIED:** బాస్ పరిచయ సన్నివేశం నడుస్తోంది.
- **English meaning of draft — AI, unverified:** The boss introduction scene is in progress.
- **Tone/delivery:** Quiet, concise; do not talk over a future cinematic performance.
- **Game context:** VERIFIED IN CURRENT SOURCE; no new live gameplay test or personal-state observation
- **Review flags:** No audio timing or interruption behavior is implemented by this draft. Review whether సన్నివేశం is necessary/natural for the existing intro.
- **Slots/bindings:** No dynamic placeholders.
- **Source:** src/game/assistant/responses.js:18
- **Language review status:** PENDING
- **Human correction/comments:** ____________________

### BH6-5E-037

- **Trigger/context:** Mission 1 objective-style answer; gameOver=false, relic=false, bossStatus=active.
- **Original game English source:** Face the Warden; watch its attack wind-up.
- **Source form:** EXACT EXISTING ENGLISH
- **AI Telugu draft — UNVERIFIED:** వార్డెన్‌ను ఎదుర్కో. దాడికి సిద్ధమయ్యే కదలికను గమనించు.
- **English meaning of draft — AI, unverified:** Face the Warden and watch the movement preparing its attack.
- **Tone/delivery:** Direct combat cue, without a catchphrase.
- **Game context:** VERIFIED IN CURRENT SOURCE; no new live gameplay test or personal-state observation
- **Review flags:** Review wind-up wording; do not claim a new attack indicator or guaranteed safe interval.
- **Slots/bindings:** No dynamic placeholders.
- **Source:** src/game/assistant/responses.js:18
- **Language review status:** PENDING
- **Human correction/comments:** ____________________

### BH6-5E-038

- **Trigger/context:** Mission 1 objective-style answer; gameOver=false, relic=false, bossStatus=defeated. Actual collection additionally requires victoryReady.
- **Original game English source:** Collect the relic after the encounter becomes ready.
- **Source form:** EXACT EXISTING ENGLISH
- **AI Telugu draft — UNVERIFIED:** పోరాటం తర్వాత అవశేషాన్ని తీసుకునే దశ సిద్ధమైనప్పుడు దాన్ని సేకరించు.
- **English meaning of draft — AI, unverified:** Collect the relic when the post-encounter collection stage becomes ready.
- **Tone/delivery:** Calm instruction; preserve the readiness condition.
- **Game context:** VERIFIED IN CURRENT SOURCE; no new live gameplay test or personal-state observation
- **Review flags:** Readiness is important: collectRelic requires defeated, victoryReady and not already collected. Do not instruct immediate collection during the defeat sequence.
- **Slots/bindings:** No dynamic placeholders.
- **Source:** src/game/assistant/responses.js:18
- **Language review status:** PENDING
- **Human correction/comments:** ____________________

### BH6-5E-039

- **Trigger/context:** Mission 1 objective-style answer; not gameOver and relicCollected=true.
- **Original game English source:** The relic is collected. Allow the ending and completion presentation to finish.
- **Source form:** EXACT EXISTING ENGLISH
- **AI Telugu draft — UNVERIFIED:** అవశేషాన్ని సేకరించావు. ముగింపు సన్నివేశం, మిషన్ పూర్తి వివరాలు పూర్తిగా ముగిసే వరకు ఆగు.
- **English meaning of draft — AI, unverified:** You have collected the relic. Wait for the ending scene and completion presentation to finish.
- **Tone/delivery:** Steady and understated; no additional reward promise.
- **Game context:** VERIFIED IN CURRENT SOURCE; no new live gameplay test or personal-state observation
- **Review flags:** The second-person wording applies only under the collected-relic condition. Review pronoun choice and completion-presentation terminology; do not imply a new companion action.
- **Slots/bindings:** No dynamic placeholders.
- **Source:** src/game/assistant/responses.js:18
- **Language review status:** PENDING
- **Human correction/comments:** ____________________

## 9. Replay and previously completed missions

### BH6-5E-040

- **Trigger/context:** Mission 1 completion/replay prompt; savedComplete=true and replay=true.
- **Original game English source:** A previous completion is recorded. This is a replay; the saved rewards are not a promise of another payout.
- **Source form:** EXACT EXISTING ENGLISH
- **AI Telugu draft — UNVERIFIED:** ఇంతకుముందే పూర్తి చేసినట్టు నమోదుంది. ఇది మళ్లీ ఆడుతున్న మిషన్. సేవ్‌లో కనిపించే బహుమతుల్ని చూసి, అవే మళ్లీ వస్తాయని అనుకోకు.
- **English meaning of draft — AI, unverified:** A prior completion is recorded and this is a replay. The displayed saved rewards are not a promise of receiving them again.
- **Tone/delivery:** Friendly but firm about rewards; no scolding.
- **Game context:** VERIFIED IN CURRENT SOURCE; no new live gameplay test or personal-state observation
- **Review flags:** Review replay wording and payout distinction. No reward, completion or save state is changed.
- **Slots/bindings:** No dynamic placeholders.
- **Source:** src/game/assistant/responses.js:21
- **Language review status:** PENDING
- **Human correction/comments:** ____________________

### BH6-5E-041

- **Trigger/context:** Mission 1 factual snapshot; c.replay=true.
- **Original game English source:** Current attempt: replay.
- **Source form:** READABLE TEMPLATE / RENDERED VARIANT OF EXISTING ENGLISH
- **AI Telugu draft — UNVERIFIED:** ప్రస్తుత ప్రయత్నం: మళ్లీ ఆడుతున్న మిషన్.
- **English meaning of draft — AI, unverified:** The current attempt is a replay.
- **Tone/delivery:** Short status statement.
- **Game context:** VERIFIED IN CURRENT SOURCE; no new live gameplay test or personal-state observation
- **Review flags:** Rendered branch of the existing dynamic fact, not a new trigger. Review whether రీప్లే is preferable to the descriptive phrase.
- **Slots/bindings:** No dynamic placeholders.
- **Source:** src/game/assistant/responses.js:15
- **Language review status:** PENDING
- **Human correction/comments:** ____________________

### BH6-5E-042

- **Trigger/context:** Progress current.status when route is implemented, unlocked, savedComplete=true and playing=false.
- **Original game English source:** completion recorded; not running
- **Source form:** EXACT EXISTING ENGLISH
- **AI Telugu draft — UNVERIFIED:** పూర్తయినట్టు నమోదుంది. ప్రస్తుతం మిషన్ నడవడం లేదు.
- **English meaning of draft — AI, unverified:** Completion is recorded; the mission is not currently running.
- **Tone/delivery:** Neutral state label; can follow the current mission label.
- **Game context:** VERIFIED IN CURRENT SOURCE; no new live gameplay test or personal-state observation
- **Review flags:** Existing status-value fragment, not a standalone newly wired response. Review line length when joined to a mission label.
- **Slots/bindings:** No dynamic placeholders.
- **Source:** src/game/assistant/progress.js:35
- **Language review status:** PENDING
- **Human correction/comments:** ____________________

## 10. Missing-information fallback responses

### BH6-5E-043

- **Trigger/context:** Legacy guidance answer invoked outside Mission 1 or for an unavailable route; not the progress/recap prompt.
- **Original game English source:** Select an existing Mission 1 route to ask for guidance.
- **Source form:** EXACT EXISTING ENGLISH
- **AI Telugu draft — UNVERIFIED:** మార్గదర్శనం అడగడానికి, అమలులో ఉన్న మిషన్ 1ను ఎంచుకో.
- **English meaning of draft — AI, unverified:** Select an implemented Mission 1 route to ask for guidance.
- **Tone/delivery:** Helpful, brief redirection.
- **Game context:** VERIFIED IN CURRENT SOURCE; no new live gameplay test or personal-state observation
- **Review flags:** Guidance scope only: progress/recap support elsewhere must not be described as unavailable. Review implementation/route terminology.
- **Slots/bindings:** No dynamic placeholders.
- **Source:** src/game/assistant/responses.js:14
- **Language review status:** PENDING
- **Human correction/comments:** ____________________

### BH6-5E-044

- **Trigger/context:** Mission 1 objective-style prompt; gameOver=true takes priority over all later objective branches.
- **Original game English source:** This attempt ended. Use the existing restart control.
- **Source form:** EXACT EXISTING ENGLISH
- **AI Telugu draft — UNVERIFIED:** ఈ ప్రయత్నం ముగిసింది. మళ్లీ మొదలుపెట్టడానికి ఉన్న రీస్టార్ట్ నియంత్రణను వాడు.
- **English meaning of draft — AI, unverified:** This attempt has ended; use the existing restart control.
- **Tone/delivery:** Calm and supportive, not celebratory.
- **Game context:** VERIFIED IN CURRENT SOURCE; no new live gameplay test or personal-state observation
- **Review flags:** Review natural wording for restart control; do not invent a new button label, auto-restart or erase-progress action.
- **Slots/bindings:** No dynamic placeholders.
- **Source:** src/game/assistant/responses.js:18
- **Language review status:** PENDING
- **Human correction/comments:** ____________________

### BH6-5E-045

- **Trigger/context:** buildProgress warning: completedMissionIds is not an array.
- **Original game English source:** Completion history is missing; no completed mission is inferred.
- **Source form:** EXACT EXISTING ENGLISH
- **AI Telugu draft — UNVERIFIED:** పూర్తయిన మిషన్ల చరిత్ర అందుబాటులో లేదు. ఏ మిషన్‌నీ పూర్తయినట్టుగా ఊహించను.
- **English meaning of draft — AI, unverified:** Completion history is unavailable; no completed mission is assumed.
- **Tone/delivery:** Reassuring but precise; no accusation of corrupted saves.
- **Game context:** VERIFIED IN CURRENT SOURCE; no new live gameplay test or personal-state observation
- **Review flags:** Check conversational register, grammar, word order and meaning with a fluent Telugu speaker.
- **Slots/bindings:** No dynamic placeholders.
- **Source:** src/game/assistant/progress.js:20
- **Language review status:** PENDING
- **Human correction/comments:** ____________________

### BH6-5E-046

- **Trigger/context:** buildProgress warning: unlockedMissionIds is not an array.
- **Original game English source:** Unlock history is missing; availability is not inferred from briefing or reward data.
- **Source form:** EXACT EXISTING ENGLISH
- **AI Telugu draft — UNVERIFIED:** అన్‌లాక్ వివరాలు అందుబాటులో లేవు. వివరణలు లేదా బహుమతుల వివరాల్ని బట్టి మిషన్ ఆడగలమని ఊహించను.
- **English meaning of draft — AI, unverified:** Unlock information is unavailable, and playability is not inferred from briefings or reward records.
- **Tone/delivery:** Clear and factual; no automatic repair promise.
- **Game context:** VERIFIED IN CURRENT SOURCE; no new live gameplay test or personal-state observation
- **Review flags:** Review availability versus playability wording. Unlock and implemented/playable remain separate checks.
- **Slots/bindings:** No dynamic placeholders.
- **Source:** src/game/assistant/progress.js:21
- **Language review status:** PENDING
- **Human correction/comments:** ____________________

### BH6-5E-047

- **Trigger/context:** buildProgress warning: campaign.rewards is not a record object.
- **Original game English source:** Reward history is missing; amounts are unknown, not zero.
- **Source form:** EXACT EXISTING ENGLISH
- **AI Telugu draft — UNVERIFIED:** బహుమతుల చరిత్ర అందుబాటులో లేదు. మొత్తాలు తెలియవు; సున్నా అని కాదు.
- **English meaning of draft — AI, unverified:** Reward history is unavailable; the amounts are unknown rather than zero.
- **Tone/delivery:** Emphasize unknown versus zero, without alarm.
- **Game context:** VERIFIED IN CURRENT SOURCE; no new live gameplay test or personal-state observation
- **Review flags:** Check conversational register, grammar, word order and meaning with a fluent Telugu speaker.
- **Slots/bindings:** No dynamic placeholders.
- **Source:** src/game/assistant/progress.js:22
- **Language review status:** PENDING
- **Human correction/comments:** ____________________

### BH6-5E-048

- **Trigger/context:** buildProgress warning: invalid/incomplete reward record or invalid entries filtered.
- **Original game English source:** Invalid or incomplete reward data for {mission}; invalid values ignored.
- **Source form:** READABLE TEMPLATE / RENDERED VARIANT OF EXISTING ENGLISH
- **AI Telugu draft — UNVERIFIED:** {mission} బహుమతి వివరాలు సరిగా లేవు లేదా అసంపూర్ణంగా ఉన్నాయి. చెల్లని విలువల్ని లెక్కలోకి తీసుకోలేదు.
- **English meaning of draft — AI, unverified:** The mission reward data is invalid or incomplete; invalid values are not counted.
- **Tone/delivery:** Careful, nonjudgmental reporting.
- **Game context:** VERIFIED IN CURRENT SOURCE; no new live gameplay test or personal-state observation
- **Review flags:** Ignored means excluded from this summary, not deleted from the save. Do not claim the data was repaired.
- **Slots/bindings:** mission=missionLabel(id). The adapter filters invalid values but does not write the save.
- **Source:** src/game/assistant/progress.js:26
- **Language review status:** PENDING
- **Human correction/comments:** ____________________

### BH6-5E-049

- **Trigger/context:** buildProgress warning: completed route has no reward entry.
- **Original game English source:** No reward entry for recorded {mission}; amounts unknown.
- **Source form:** READABLE TEMPLATE / RENDERED VARIANT OF EXISTING ENGLISH
- **AI Telugu draft — UNVERIFIED:** పూర్తయినట్టు నమోదైన {mission}కి బహుమతుల నమోదు లేదు. మొత్తాలు తెలియవు.
- **English meaning of draft — AI, unverified:** This recorded completed mission has no reward entry; amounts are unknown.
- **Tone/delivery:** Matter-of-fact uncertainty; no guessed compensation.
- **Game context:** VERIFIED IN CURRENT SOURCE; no new live gameplay test or personal-state observation
- **Review flags:** Check conversational register, grammar, word order and meaning with a fluent Telugu speaker.
- **Slots/bindings:** mission=missionLabel(id), an accepted completed route. Do not replace missing with zero or promise a payout.
- **Source:** src/game/assistant/progress.js:32
- **Language review status:** PENDING
- **Human correction/comments:** ____________________

### BH6-5E-050

- **Trigger/context:** rewardText helper receives no valid reward entries; a fragment used inside progress/recap facts.
- **Original game English source:** amounts unknown (no valid reward entry)
- **Source form:** EXACT EXISTING ENGLISH
- **AI Telugu draft — UNVERIFIED:** మొత్తాలు తెలియవు; చెల్లుబాటయ్యే బహుమతి నమోదు లేదు.
- **English meaning of draft — AI, unverified:** Amounts are unknown because there is no valid reward entry.
- **Tone/delivery:** Short explanatory fragment; pause before the reason.
- **Game context:** VERIFIED IN CURRENT SOURCE; no new live gameplay test or personal-state observation
- **Review flags:** Existing helper fragment, not a new assistant prompt. Review how it joins with the surrounding reward label.
- **Slots/bindings:** No dynamic placeholders.
- **Source:** src/game/assistant/progress.js:6
- **Language review status:** PENDING
- **Human correction/comments:** ____________________

### BH6-5E-051

- **Trigger/context:** Progress/accepted recap; p.next is null.
- **Original game English source:** Next unfinished available mission: none currently unlocked and implemented.
- **Source form:** READABLE TEMPLATE / RENDERED VARIANT OF EXISTING ENGLISH
- **AI Telugu draft — UNVERIFIED:** ఇంకా పూర్తి చేయని తదుపరి మిషన్‌గా చూపడానికి, ప్రస్తుతం అన్‌లాక్ అయి అమలులో ఉన్నది ఏదీ లేదు.
- **English meaning of draft — AI, unverified:** There is currently no unlocked, implemented unfinished mission to show as next.
- **Tone/delivery:** Calm boundary; no new chapter promise.
- **Game context:** VERIFIED IN CURRENT SOURCE; no new live gameplay test or personal-state observation
- **Review flags:** Rendered fallback of the existing template. It does not claim the whole campaign is complete or no implemented missions exist at all.
- **Slots/bindings:** No dynamic placeholders.
- **Source:** src/game/assistant/progress.js:48
- **Language review status:** PENDING
- **Human correction/comments:** ____________________

## Excluded or deferred material

Seven context families are excluded from new drafts; they are not seven game defects:

1. Mission-specific guidance, events and conclusions for planned/paused or unfinished campaign chapters, including paused activities 21–24. No unbuilt mission is treated as available.
2. Claims that all 100 chapters are complete, sequel outcomes, or a movie/canonical story arc has been completed by the player. The conditional Mission 100 warning preserves the opposite distinction.
3. New attack-specific coaching for ten arc-final bosses. Their encounters exist, but the assistant currently supplies detailed tactical guidance only for Mission 1; drafting new automatic tactics would add unsupported assistant coverage.
4. A standalone greeting or new character conversation with no existing English response/trigger. The current Help activation is not invented as a voiced greeting.
5. Bujji relay dialogue, other characters' lines, cinematic scripts and catalogue captions retagged as Bhairava assistant speech. These are separate speaker/systems, not this milestone's new lines.
6. Voice-enabled, microphone, network-AI or TTS interactions; none is added or portrayed as enabled assistant behavior.
7. The legacy broad fact “This milestone supports Mission 1 only” as a new unqualified Phase 6 statement: it would be ambiguous now that progress/recap coverage is broader. The narrower existing English guidance fallback is drafted instead. Production source remains unchanged.

## Important source qualification

The missing-completion response concerns absence of a saved completion record. `bossSystem.js` already calls `completeMission` on defeat when its guards allow it; relic collection separately records its unique reward. Do not translate that missing-record response into a false rule that boss defeat never records completion, that the relic is required before any save record can exist, or that replay promises another payout.

No movie reference/recognition work or voice integration follows this package. Fluent-speaker review and any later implementation require separate review/authorization.
