# Remaining movie ending and post-credit verification

2026-11-17, Asia/Calcutta. **Final status: PARTIAL.** Subtitles and sampled footage were inspected across the requested remaining interval; key ending events and the embedded Yaskin stinger have direct visual evidence. This is not continuous53-minute viewing, audio listening or full-film verification. A required final-tail check could not start; media processing stopped without retry.

## Scope, method and protection

Source: `C:/Users/Hp/Downloads/Telegram Desktop/Toonflex - Kalki 2898 AD (2024) 720p AMZN WEB-DL x264 [T.mkv`.

Verified container properties:02:55:45.376 duration,1280×528 H264 at24fps,1519431511bytes; Telugu EAC3/AAC audio; English/Tamil/Kannada/Malayalam embedded SubRip tracks. C: free space at preflight was13356560384bytes, approximately12.44GiB. Initial available physical RAM286.19MiB and reported commit headroom732.53MiB. The source was opened read-only; no source edit, clip integration or audio extraction.

Inspection starts at **02:02:16.006**, the old subtitle-output stopping point, not proof of an earlier completed viewing. Remaining nominal interval is **00:53:29.370**. Nothing before that point was reprocessed. All seven old reports were read; exact pre-edit copies and hashes are preserved in `ending-review-20261117/before/` and `before-hashes.json`.

One job at a time:

- Eleven independent subtitle stream-copy jobs, approximately5minutes each;364 cues read. Last subtitle segment is empty during credits. Output times are segment-relative; `remaining-cues.json` adds the recorded seek offset for absolute times. Boundary duplicate cues are not separate events.
- Eleven low-resolution keyframe overview pages,154 actual frames. Sampling intervals are at least20seconds, not continuous playback.
- A detailed02:38:00–02:43:00 pass:75 sampled frames at4-second intervals, five pages.
- A separate02:47:00–02:50:00 ending/stinger pass:60 sampled frames at3-second intervals, four pages.
- Sample frame timestamps come from decoder showinfo PTS plus each input seek offset, not a guessed grid for the irregular overview keyframes. `segments/frame-index.json` records each page/cell/time. No original-resolution video export or audio decoding/listening.

In overview resource logs, RAM before jobs ranged194.16–356.27MiB and commit579.50–1046.48MiB. Detailed-pass preflights recorded379.08/684.80MiB and262.43/747.99MiB physical/commit headroom. These are intermittent resource readings, not continuous peak-memory measurements or FPS. Each process released its resources on exit; no unknown process was killed.

## Evidence labels

- **MOVIE-CONFIRMED:** an event established from inspected supplied footage, without upgrading unobserved details.
- **DIRECTLY-OBSERVED:** a specifically visible action/frame.
- **SUBTITLE-SUPPORTED:** summarized extracted text not independently verified as spoken audio.
- **INFERRED:** interpretation, not an explicit depicted mechanism or motivation.
- **USER-APPROVED GAME ADAPTATION:** approved game direction, not automatically a film fact.
- **ORIGINAL GAME CONTENT:** project-original design, not a movie scene.
- **UNVERIFIED:** missing/insufficient evidence.
- **CONTRADICTION:** a claim conflicts with available evidence or approved game direction.

Each claim below has one label; separate visual, textual and interpretive claims are not interchangeable. Times identify observed frames/cues or bounded scene windows, not exact starts/ends of every shot.

**Subtitle timestamp limitation:** cue times below are reconstructed from each SRT output plus its requested seek offset. They have not been independently validated against original subtitle-packet PTS. Stream-copy boundary overlap/rebasing is observable: the first output repeats the old final cue. Therefore treat subtitle-only timestamps as approximate locators, not frame-accurate source times; decoder showinfo frame timestamps are the primary visual timing evidence. The naming timestamp agrees with an older project reference but that agreement does not remove the packet-timing limitation. No further media command was run to resolve it after the final-tail failure.

## Chronological findings

### E01 — Refuge and protection context

Characters: Sumathi, Ashwatthama and refuge inhabitants. Interval02:02:16–02:08:59.

- **DIRECTLY-OBSERVED:** overview01 shows a woman in white with Ashwatthama and inhabitants around the refuge/tree/steps.
- **SUBTITLE-SUPPORTED:**02:03:41–02:05:42 discusses the escaped lab woman, a bounty, danger from the Complex and protection;02:07:32–02:08:59 describes Shambala's welcome/tree. The film's English subtitles spell Shambala; project records use Shambhala. No location rename was applied.
- **UNVERIFIED:** earlier pregnancy/extraction events outside the scoped interval were not rechecked.

### E02 — Bhairava bargains, then enters the refuge

Characters: Bhairava, Commander/Complex personnel, Bujji and his local guide. Intervals02:09:41–02:12:49 and02:20:47–02:22:55.

- **SUBTITLE-SUPPORTED:** Bhairava is blacklisted/banned; later offers to retrieve the woman in exchange for entry to the Complex. The exchange is summarized from02:12:10–02:12:49, not attributed by voice listening.
- **DIRECTLY-OBSERVED:** overview02/03 shows Bhairava confronting armored personnel; overview04/05 shows his vehicle entering the concealed refuge and him among its inhabitants.
- **INFERRED:** these preparations support a bounty-driven agenda; they do not establish every unseen step of exposing the location. Exact betrayal/signaling mechanics remain unverified by this sample set.

### E03 — Final Bhairava/Ashwatthama confrontation

Characters: Bhairava, Ashwatthama and Bujji's vehicle. Observed frames02:23:42.125–02:28:42.917.

- **MOVIE-CONFIRMED:** a renewed confrontation occurs in the refuge, involving physical combat and Bhairava's vehicle. Overview05/06 provides visible opposing actions; subtitle02:25:29 describes coming prepared.
- **DIRECTLY-OBSERVED:**02:23:42.125 shows the two combatants;02:25:30.292 shows the blue-lit vehicle with Bhairava;02:27:16.708 shows Ashwatthama holding a large structure/vehicle overhead;02:28:42.917 shows Bhairava held against red-lit equipment.
- **UNVERIFIED:** every blow, exact incapacitation mechanism and all fight choreography are not established by sparse frames.

### E04 — Ashwatthama restrained; Sumathi held by the attackers

Characters: Ashwatthama, Sumathi, Manas/Complex attackers. Interval02:37:17–02:39:04.

- **DIRECTLY-OBSERVED:**02:37:17.000 and02:38:20/40/44 show Ashwatthama bound by red-lit restraints on the steps/courtyard.
- **DIRECTLY-OBSERVED:**02:38:00–02:38:32 shows Sumathi on the attacker's platform beside Manas; the later02:41:52–02:42:00 frames again show her on that platform.
- **SUBTITLE-SUPPORTED:**02:38:05–02:38:49 threatens her and her baby, references Supreme and taunts her protector.
- **UNVERIFIED:** the precise initial grabbing/restraint action is not fully reconstructed. This is capture/holding at the refuge, not proof that she had already been transported back into the Complex.

### E05 — Leaf-like object, weapon contact and gold activation

Characters: Bhairava and restrained Ashwatthama. Interval02:39:08–02:40:08.

- **DIRECTLY-OBSERVED:** detailed activation page02 cells2–5 show Bhairava's arm, a small leaf-like object near/on the rod, hand contact and gold sparks/glow by02:39:20.
- **DIRECTLY-OBSERVED:**02:39:48/52 shows eyes and a gold-lit weapon;02:40:08 shows Bhairava holding a gold-glowing long weapon.
- **SUBTITLE-SUPPORTED:** earlier in this remaining interval,02:15:15–02:17:05 describes the walking stick as an ancient warrior's weapon that works in its owner's hands;02:46:22 later names the ancient weapon as Vijaya Bow.
- **INFERRED:** connecting the small object's contact, the present rod and the power activation is a causal reading of the edit. The object's sacred status, precise identity/species and complete mechanism are not independently established here.
- **UNVERIFIED:** a literal full present-day gold-armor costume transformation is not certified; modern footage and ancient gold-armored imagery must not be merged. “First full awakening at50” is a separate approved game designation; the film before02:02:16 was not reviewed in this task.

### E06 — Bhairava overcomes Manas and takes Sumathi from the platform

Characters: Bhairava, Manas, Sumathi and Ashwatthama. Interval02:40:08–02:42:28.

- **MOVIE-CONFIRMED:** the gold-weapon action overcomes Manas's vehicle/platform threat and Bhairava retrieves Sumathi. Detailed pages03–05 show the attack sequence, impact/fire and pickup.
- **DIRECTLY-OBSERVED:**02:41:32 shows Manas at the red-lit craft;02:41:40 shows gold energy around it;02:41:44–02:41:52 shows Bhairava at the platform with Sumathi;02:42:24–02:42:28 shows him carrying her away.
- **UNVERIFIED:** Manas's irreversible biological fate is not certified from these frames. Do not turn combat defeat into an invented death report.

### E07 — Recognition and Bhairava's immediate behavior

Characters: Bhairava, Ashwatthama, Sumathi and Bujji. Interval02:40:44–02:44:06.

- **DIRECTLY-OBSERVED:** Ashwatthama reacts with an intent/shocked expression at02:40:44/02:41:36 and watches Bhairava carry Sumathi at02:42:48–02:42:52.
- **SUBTITLE-SUPPORTED:**02:40:51 addresses the son of Acharya;02:43:33 and02:43:50 address Bhairava as brother.02:43:04–02:43:17 has Bhairava question the lab woman's presence and urge escape while the old man is trapped.02:43:27 asks not to be taken into the Complex.
- **INFERRED:** reaction, brother-address and the ancient crosscut support recognition of the Karna connection; they do not establish a narrated reincarnation mechanism or that Bhairava fully understands it then.
- **MOVIE-CONFIRMED:** Bhairava carries Sumathi and the sequence proceeds into vehicle departure/pursuit, rather than a completed peaceful evacuation of the protected community.
- **INFERRED:** renewed bounty/escape-oriented behavior is consistent with a return to his familiar personality, not proof of a permanent power loss or a fully formed protector conversion at that instant.

### E08 — Ancient-war imagery and the name Karna

Characters: ancient chariot/warrior figures; present-day recognition context. Visual frames02:44:51.375–02:46:39.375; naming cue02:46:45.672.

- **DIRECTLY-OBSERVED:** overview09 shows golden battlefield/chariot/archer imagery and a warrior drawing a bow, distinct from the modern courtyard and vehicle scene.
- **SUBTITLE-SUPPORTED:**02:45:37–02:46:45 compares the two chariots/warriors, identifies Vijaya Bow, and ends with the name Karna.
- **UNVERIFIED:** this does not verify that the final naming cue is spoken by present-day Ashwatthama. The cue occurs over the ancient sequence; no Telugu voice listening/definitive speaker validation occurred. Do not cite that timestamp as proof of a present-day Ashwatthama naming speech.
- **UNVERIFIED:** whose personal memory the ancient images represent, beyond their audience-visible presentation. No claim that Bhairava consciously remembers them is supplied by sampled shots alone.

### E09 — Embedded ending/post-credit stinger: the drop and injection

Characters: Supreme Yaskin and attendant. Separate detailed pass02:47:00–02:50:00.

- **MOVIE-CONFIRMED:** the Yaskin sequence is embedded in this same file, after brief filmmaker/producer credit cards and before the long rolling credits. It is not an inaccessible separate movie file.
- **DIRECTLY-OBSERVED:** stinger01 cells1–3 show credit cards at02:47:00/03/06; the next cell shows the attendant at02:47:09. A small vial/drop is presented around02:47:24–02:47:27; Yaskin handles a syringe and applies it at his neck around02:48:03.
- **SUBTITLE-SUPPORTED:**02:47:08–02:47:24 reports the woman's escape, formula carried for150days and a single extracted drop. This is not independent verification of earlier extraction scenes outside scope.
- **INFERRED:** the subtitle's150days wording should not be silently equated with exact pregnancy duration or used to overwrite the user's earlier six-month adaptation statement; those may describe different measurements and require contextual review.

### E10 — Yaskin's transformation and continuing threat

Characters: Yaskin and attendant. Interval02:48:15–02:49:45.

- **DIRECTLY-OBSERVED:** stinger02/03 shows the previously gaunt body enlarging/muscling and rising; gold objects/weapon move, followed by a large raised bow-like weapon and blue electrical effects in stinger04.
- **SUBTITLE-SUPPORTED:**02:49:01–02:49:12 connects the drop's power to the attendant's offer to retrieve the woman, followed by Yaskin saying he will go himself.
- **MOVIE-CONFIRMED:** this inspected ending leaves Yaskin active and empowered; it does not show Kalki defeating him in a final duel.
- **USER-APPROVED GAME ADAPTATION:** adult Kalki at60, Horizon Keeper70 and player-controlled Kalki's Yaskin victory100 remain approved expanded game direction, not facts established by this movie ending. No approved game decision was changed.

### E11 — Long credits and final-tail limitation

- **DIRECTLY-OBSERVED:** stinger04 shows a continuation title at about02:49:48 and rolling credits from02:49:51. Overview10/11 samples continue to02:55:21, showing credits.
- **UNVERIFIED:** absence of another narrative beat in unsampled gaps or after the last inspected frame. The attempted focused02:55:20–02:55:45.376 check failed to start with PowerShell **ResourceUnavailable**; no FFmpeg frames were produced for that pass. The precise startup-failure cause was not established and no retry was made.
- **UNVERIFIED:** final24.376seconds after the last actual inspected frame. This is why complete ending/post-credit coverage is not certified, even though the embedded Yaskin stinger itself has direct visual verification.

## Documentation comparison, without changing approved direction

- **CONTRADICTION:** treating the earlier02:02:16 subtitle truncation as completed visual review conflicts with the original reports' explicit no-viewing statement. Full-film review remains incomplete.
- **CONTRADICTION:** calling the game100 Kalki/Yaskin victory the supplied movie's shown ending conflicts with the inspected Yaskin stinger. The game ending remains approved as expansion; it is not removed.
- **CONTRADICTION:** describing a completed protective/hopeful community evacuation as the film's immediate post-activation ending conflicts with the inspected carrying/pursuit sequence and active Yaskin stinger. It remains a separately approved game treatment where the user places it.
- **UNVERIFIED:** old present-day speaker attribution for the02:46:45 naming cue; approval of Ashwatthama's game role is not film voice evidence.
- **ORIGINAL GAME CONTENT:**100 numbered mission slots, Horizon Keeper's project-original boss design and the game's formal1-vs-1 arc framework are game structures, not film events.

No other finale names are proposed on incomplete film review, and no movie canon is inferred from a source filename or old roadmap.

## Acceptance and remaining work

PASS: file metadata/range; remaining subtitle access; timestamped sampled frames; key restraint/activation/Manas/retrieval/recognition-context/ancient-identity evidence; separate embedded stinger inspection; old-report backups.

PARTIAL: scoped video coverage is sampled, with no audio listening; leaf's sacred identity/causality, precise speaker attribution and some rapid actions remain unverified.

BLOCKED: focused final-tail pass failed at process start; no retry. No full-film or final-frame coverage claim. Remaining subtitles alone are not visual proof. No further media processing after that failure.

The seven earlier reports receive a dated current-evidence amendment above preserved historical content, each using only relevant findings and pointing here. Existing campaign approvals are unchanged. No gameplay, cinematic, character, boss, ability, save, checkpoint, production, staging or rollback implementation changed. No browser/player/server was launched and no unknown process terminated. Stop after documentation and integrity checks; wait for explicit story approval before implementation.

## Final integrity and validation results

`ending-review-20261117/integrity-results.json`:3,166 targeted production/prior-staging/rollback/Mission94 source and historical-story paths unchanged;153/153 established production and47/47 protected hashes match, zero differences. All seven pre-edit report backups match their recorded hashes and their historical text is retained in the updated reports. Compiled builds and all media were not exhaustively rehashed; no write targeted them. This task did not access personal save storage or repair/change the prior test-result incident.

Created this report and new ending-review evidence (subtitle segments, low-resolution reference sheets, timestamps/logs, resource measurements and integrity records). Updated only the seven requested reports with current scoped evidence above preserved history. No approved campaign decision changed.

Final acceptance checklist: duration/rangePASS; start near02:02:16PASS; chronological ending key-event evidencePARTIAL; embedded Yaskin stinger visual inspectionPASS; absolute subtitle packet timingUNVERIFIED; full remaining continuous audiovisual coverageUNVERIFIED; final-tail checkBLOCKED; seven-report preservation/consistencyPASS; stated protected integrity checksPASS. **OverallPARTIAL**, not COMPLETE. No full-film verification claim.
