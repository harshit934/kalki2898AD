# Phase 6 Milestone 5H.36 — combat meme audio investigation and plan

15 November2026. **PLAN READY FOR REVIEW; MOVIE CLIP INTEGRATION BLOCKED.** This is a separate optional combat-banter feature from synthetic Bhairava assistant voice. No movie audio was extracted, copied, enabled or distributed by this milestone.

## Movie source and inspection limits

Located the full movie at:

`C:/Users/Hp/Downloads/Telegram Desktop/Toonflex - Kalki 2898 AD (2024) 720p AMZN WEB-DL x264 [T.mkv`

Fresh metadata probe:1,519,431,511bytes,02:55:45.376runtime,1280×528/24fps historical video reference. Current stream probe identifies Telugu-tagged EAC3/AAC audio and English/Tamil/Kannada/Malayalam subtitle tracks; no Telugu subtitle stream. Fresh SHA-256 **ccf2352ebe70b25e8163ffe6aa8d38fffc831830af9a3e93fbf3379428cd1399** matches the prior source, permitting reuse of its indexed evidence. `milestone5H36/source-verification.json` records actual metadata/hash. Literal-path probing was used because the filename contains `[`. No new subtitle/audio extraction.

Reviewed existing English-subtitle catalogue and provisional192-entry visual/context index, earlier movie-analysis limitations, two existing visual frames for0308/0385, and historical mixed-transient metadata. The images show Bhairava present, not synchronized proof he speaks the cue. **No continuous fresh audiovisual movie review or Telugu listening/transcription was performed.** Shortlist humour is an inference from translated-subtitle meaning/context, not a certified memorable Telugu line.

All candidate speaker assignments remain UNVERIFIED; the rival challenge candidate is deliberately not assumed to be Bhairava. Exact Telugu wording is left blank. English descriptions below are semantic summaries, not reconstructed Telugu or a full movie transcript. Existing [analysis](phase6-movie-dialogue-analysis-report.md) already documents failed ASR and ambiguous speakers; those failures were not repeated.

## Candidate bookmarks and event mapping

The10dialogue windows and2mixed-transient windows below are **review pointers, not extracted assets or approved edits**. Timestamp origin is the verified full movie. Subtitle intervals are not exact utterance boundaries. The full machine-readable map records source IDs, duration basis, speaker uncertainty, cooldowns, trigger conditions, rights blocks and original-alternative briefs.

- **MEME-REF-01 / heavy_attack** — 00:28:58.214–00:29:00.006 (1.792s reference interval),MOV-DLG-0335: Combat preparation / theatrical fight-mode setup. Speaker: Bhairava — prior provisional visual/context inference; attribution UNVERIFIED.
- **MEME-REF-02 / successful_combo** — 00:28:49.839–00:28:50.797 (0.958s reference interval),MOV-DLG-0332: Dismissive leave-it attitude after a gear complaint. Speaker: Bhairava — prior provisional visual/context inference; attribution UNVERIFIED.
- **MEME-REF-03 / enemy_defeat** — 00:31:42.881–00:31:44.672 (1.791s reference interval),MOV-DLG-0355: Bounty ownership / comic competitive swagger. Speaker: Bhairava — prior provisional visual/context inference; attribution UNVERIFIED.
- **MEME-REF-04 / multiple_enemy_defeat** — 00:27:20.547–00:27:22.422 (1.875s reference interval),MOV-DLG-0308: Outnumbered reaction, potentially ironic. Speaker: Bhairava — prior provisional visual/context inference; attribution UNVERIFIED.
- **MEME-REF-05 / player_damage** — 00:29:52.214–00:29:53.297 (1.083s reference interval),MOV-DLG-0338: Brief call toward companion during the fight; emotional sound not confirmed. Speaker: Bhairava — prior provisional visual/context inference; attribution UNVERIFIED.
- **MEME-REF-06 / low_health** — 00:34:40.756–00:34:42.631 (1.875s reference interval),MOV-DLG-0385: Exhaustion / inability-to-continue complaint. Speaker: Bhairava — prior provisional visual/context inference; attribution UNVERIFIED.
- **MEME-REF-07 / boss_encounter** — 00:28:17.589–00:28:19.547 (1.958s reference interval),MOV-DLG-0326: Reluctance to fight / early-in-the-day complaint. Speaker: Bhairava — prior provisional visual/context inference; attribution UNVERIFIED.
- **MEME-REF-08 / boss_defeat** — 01:55:38.214–01:55:40.714 (2.500s reference interval),MOV-DLG-1259: Enough/already-finished attitude during late action. Speaker: Bhairava — prior provisional visual/context inference; attribution UNVERIFIED.
- **MEME-REF-09 / rare_easter_egg** — 00:27:27.547–00:27:29.256 (1.709s reference interval),MOV-DLG-0311: Nice-dream complaint during bounty banter. Speaker: Bhairava — prior provisional visual/context inference; attribution UNVERIFIED.
- **MEME-REF-10 / boss_encounter_alternative** — 00:27:03.756–00:27:06.339 (2.583s reference interval),MOV-DLG-0305: Rival/group challenge about fighting before payment. Speaker: Unknown / possible rival-group speaker; not attributed to Bhairava; attribution UNVERIFIED.
- **MEME-REF-11 / heavy_attack_or_impact_sfx_review** — 00:33:06.200–00:33:11.200 (5.000s reference interval),SFX-01: Automatic loud-transient pointer in bounty fight; effect identity/clean isolation UNVERIFIED. Speaker: Unknown / not applicable to unverified transient; attribution UNVERIFIED.
- **MEME-REF-12 / heavy_attack_or_impact_sfx_review** — 00:34:42.200–00:34:47.200 (5.000s reference interval),SFX-02: Automatic loud-transient pointer in bounty fight; effect identity/clean isolation UNVERIFIED. Speaker: Unknown / not applicable to unverified transient; attribution UNVERIFIED.

[Dialogue/event map CSV](phase6-milestone5H36-dialogue-event-map.csv).

The multi-defeat/outnumbered reaction only makes contextual sense if several enemies still remain; it must be ineligible when the arena is empty. The low-health exhaustion joke must never replace useful retreat/heal guidance or imply controls have been disabled. The rival challenge could be enemy-side dialogue; no attribution to the player should be invented. Reuse of a movie's fictional units must not announce actual game rewards or alter progression.

The twoSFX entries are old RMS-onset candidates in the original film mix, **not clean impact effects**. Their requested source intervals are5s, while existing packet-aligned excerpts have different container durations (recorded separately in CSV). No new excerpt was made or auditioned. Dialogue/music/engine/impact identity and isolation remain UNVERIFIED. Never label a loud transient a standalone licensed effect.

## Current centralized audio architecture: source audit

Inspected `src/audio/audioManager.js`, `dialogueInventory.js`, `src/game/player/playerAudio.js`, `Player.jsx`, `combatSystem.js`, `gameplayStore.js`, `bossSystem.js`, `narrativeCueSystem.js`, cinematic controller and `tools/voice-build-policy.mjs`.

**Already present, inferred from current source:**

- `unlockAudio()` creates/resumes AudioContext after interaction. Master gain, persistent mute/volume and settings subscribers exist.
- Single `activePlayback` for catalogue dialogue; lower/equal priority returns busy and higher priority interrupts. Async playback identity is checked after loading. `loadClip` caches decoded buffers; failed clips are remembered.
- Random event-pool choice avoids the last successful same-event ID when the pool has multiple entries. Current event cooldown1800ms, clip cooldown5000ms; timestamps update after successful start.
- Runtime rejects catalogue dialogue lacking `distributionRights.verified===true` while the existing required-rights flag is enabled(default true). No flag or catalogue approval changed.
- Legacy `playerAttack`, `enemyDefeat`, `playerDamage`, bossIntroduction/defeat events map into dialogue pools. Current pools contain only automatic-enabled catalogue entries; explicit future eligibility should filter approved rights/context before random selection, not rely solely on a later rejection.
- Cinematic players have independent HTMLAudio channels and share master settings/global pause. Starting a cinematic stops catalogue dialogue. Existing narrative text has a separate6.2s cadence; do not confuse text quips with recorded movie voice.

**Gaps relevant to this proposal, not fixed here:**

- Heavy attacks use generic `playerAttack`; this does not mean a heavy hit landed. Player.jsx exposes `attackType`, attack sequence and the actual `landed` return from damageEnemy/damageBoss. A future meme hook belongs after a confirmed hit, not every input or swing.
- No dedicated successful-combo or multi-defeat meme detector was found in inspected combat paths. Proposed hit/kill aggregators are missing observational work, not already implemented mechanics. They must not change damage, rewards or mission state.
- Near-death is an inventory event, not proof of a current automatic threshold-crossing trigger in the inspected sources. A future read-only health transition needs hysteresis/debounce.
- Catalogue single-player ownership does **not** serialize every cinematic player or the separate synthetic prototype controller. Cinematic `play(cue)` accepts cue.src independently of the catalogue rights gate; do not route unapproved movie clips through it. A protected speech reservation/bridge is required for this feature, not a claim the current manager is globally overlap-safe.
- Source catch/status ordering after an interrupted pending load deserves a targeted stale-status race test; no runtime defect is claimed from inspection alone.
- Decoded cache is not a new bounded meme-cache policy. Runtime movie decoding/extraction or eager full-library decoding is unacceptable given documented RAM/frame-time pressure.
- Build policy excludes unapproved catalogue paths/byte-identical aliases and scans raw/base64 copies. It is not a universal detector of uncatalogued or transformed film audio. A future shipping audit must verify the exact approved asset set, not assume the current filter grants permission.

## Proposed event adapter — design only

Keep mission/combat authoritative and narration optional. Emit observational records `{missionId,roundId,eventId,targetId,attackSequence,healthBefore,healthAfter,occurredAt}` only after confirmed gameplay outcomes. Never let audio completion, Skip, errors or random selection settle an objective or reward.

- Heavy hit: confirmed landed && attackType heavy; deduplicate attack sequence/target. Drop stale requests after250ms.
- Combo: proposed3confirmed hits in3s with no intervening player damage. No combo buff/reward or claim it already exists. Drop if evidence incomplete.
- Enemy defeat: one alive→dead transition per unique enemy/round; use existing confirmed death path. No repeated health-zero polling bark.
- Multiple defeat: proposed2unique deaths within1.5s; coalesce to one utterance rather than single-death plus multi bark. Apply each candidate's semantic restrictions.
- Damage: actual applied health decrease, not invulnerable collision or blocked zero damage. Suppress spam, game-over, required warnings and cinematic state.
- Low health: propose crossing<=35% with re-arm only after>45%; jokes disabled by default here. Never preempt factual critical advice. Those thresholds are proposed audio eligibility, not new health rules.
- Boss encounter/defeat: use existing real state transitions, but reserve essential boss/mission audio first. Optional movie humour is only eligible after protected speech finishes; otherwise drop, never force it into an intro/ending.
- Easter egg: propose2%of otherwise eligible safe-lull events, at most once per mission and120s between chances. No selection while stealth/briefing/cinematic/low-health/boss-critical speech is active. No claim this chance is implemented or tested.

Use a pool of **rights-cleared and context-valid** IDs. Exclude the last3selected clips globally when enough alternatives exist; if none remain, silence is valid. Add global meme cooldown20s and per-event cooldowns from CSV(18–90s/once-per-encounter), plus a10minute clip re-use gap where pool size allows. These are conservative proposed tuning values, not measured optimums. Keep the existing gameplay audio behavior unchanged until an isolated implementation is separately authorized.

## Speech priority, lifecycle and controls

Reuse the existing manager rather than adding an independent unmanaged Audio element per hit. Proposed ordering: essential cinematic/mission speech >boss introduction/defeat/tactical warnings >urgent assistant guidance >normal assistant guidance >optional meme >rare Easter egg. A meme attached to a boss event does not inherit boss-story priority.

Before playback require an explicit speech reservation across catalogue, cinematic voice and any separately approved assistant integration. If another owner is active/unknown, drop the meme. No backlog queue: a late joke is worse than silence. Allow at most one spoken line, cancel on pause/restart/exit/game-over/cinematic/background transition, release reservations on end/error/Skip, and never resume old meme speech after unmute/return. Existing settings remain authoritative; a future optional meme toggle/gain must not reset campaign or audio settings. No UI/settings change implemented here.

Initialize only after real user gesture with `unlockAudio`; failed unlock remains text/silence without retries blocking gameplay. Mobile AudioContext suspension, interrupted promises, orientation, audio focus and background behavior need real-device validation. Desktop historical success does not establish these: [5H.31](phase6-milestone5H31-report.md) physical Android is still BLOCKED.

Keep captions distinct from mission facts and preserve a visible dismissal path for any approved speech presentation. Do not imitate the actor with TTS; the movie feature is separate from existing synthetic voice.

## Performance and validation plan, not measured results

Only approved short clips should be prepared outside active combat. Example future cap:6clips×3s×24,000samples/s×4bytes≈1.73MB decoded PCM, with a4MiB optional-meme memory allowance including margin; actual WebAudio overhead must be measured. Target0.5–2.5s spoken barks without chopping words; reject candidates that need mutilation or contain inseparable score. Never load the full film in-game or perform online separation/decoding during an attack.

A future isolated test should measure warm trigger→audible-start latency(target<=150ms desktop, unverified), decode/loading separately and frame gaps/observer overhead, with all protected gameplay audio enabled. Validate cooldown/seeded randomness, unique event IDs, empty/missing/unapproved pools, no fetch for blocked rights, multiple rapid hits/deaths, priority collisions, load cancellation, mute/zero volume, pause/exit/background and missing/corrupt media. Audio must never hold movement/combat, saves or natural ending/rewards. Check real mobile separately; no performance or overlap PASS is claimed by this planning milestone.

## Copyright and distribution decision

**All12reference windows require rights review; current reuse/packaging is BLOCKED.** The film soundtrack/performances/dialogue and any embedded music/effects can involve separate rights. Local file possession does not establish game-distribution permission; a humorous/meme label or short duration does not supply permission. No identified rights holder or grant is invented.

For an intended shipping clip obtain documented authorization covering the exact recording/segment, editing, interactive game use, territories/platforms, commercial distribution and any attribution/term/revocation conditions; ensure relevant embedded music/performance/underlying rights are covered. A licensed clean stem is preferable when the mix contains score/dialogue. This plan does not assert a separate licence is universally necessary where a supported legal exception actually applies; none has been established for this project.

Official references checked15November2026: India's [Copyright Act ChapterIII](https://copyright.gov.in/Copyright_Act_1957/chapter_iii.html) distinguishes film/recording and underlying works; [ChapterXI/Section52](https://copyright.gov.in/Copyright_Act_1957/chapter_xi.html) contains specific exceptions. This research is not a finding that interactive commercial meme use falls within one. The US Copyright Office likewise explains there is [no fixed safe amount](https://www.copyright.gov/fair-use/more-info.html); that US guidance is not a determination of Indian or worldwide legality.

Until cleared, keep the full movie, old review excerpts and reference catalogue outside public/src imports, dist and release archives. Do not enable automatic playback or weaken existing rights checks. No movie segments were added to any asset catalogue/build in this milestone, and no release build was run or certified.

## Original alternatives

The CSV provides original commissioning briefs for every event: owned gear/impact Foley, newly authored dry reactions, light rhythmic accents and original tactical lines. They are **briefs, not newly recorded/generated assets or translations of movie quotes**. Use appropriately licensed effects or an authorized original performance with documented permitted use; existing synthetic voice rights are not automatically cleared either. Reproduce neither the movie actor's identity/delivery nor a distinctive line without permission. Critical low-health/boss assistance should remain clear and useful rather than become mandatory comedy.

## Results, preservation and stop

- PASS: full source located, fresh metadata/hash matches prior source; candidate IDs/timestamp intervals traceable; current audio/event/build architecture inspected.
- PARTIAL: funny/combat-suitable shortlist based on existing translated subtitles/context and limited existing images, not verified Telugu audition.
- UNVERIFIED: exact Telugu words, exact audio cuts, per-cue speaker identity, clean SFX separation, subjective humour and future desktop/mobile runtime behavior.
- BLOCKED: film audio production reuse/distribution. No documentary permission found in the inspected records.

Fresh1135/1135existing snapshot files remain unchanged; selected catalogue/audio-code/evidence hashes and old mixed-excerpt fingerprints are recorded in `milestone5H36/preservation.json`. Full movie hash matches the previous source. This is not a new47/14/11audit. Production source/audio, saves, staging and rollback copies were not modified. Existing old extracts were not regenerated, promoted or distributed. No new audio/video extraction, downloads/installations, synthesis, actor cloning, paid service, browser/game server or personal-profile access. ffprobe/read-only inspection commands completed; no ongoing test process.

Only the three requested deliverables and `phase6/milestone5H36/` metadata/map/report-support files were created. **Stop after investigation and wait for approval. No implementation authorized or performed.**
