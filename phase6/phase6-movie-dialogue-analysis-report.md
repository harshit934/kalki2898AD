# Phase 6 — Movie dialogue analysis report

## Outcome

**PARTIAL / NOT READY FOR DIALOGUE OR AUDIO INTEGRATION.** A timestamped review package is available, but the requested verified original Telugu dialogue catalogue is incomplete. Zero lines have verified original Telugu transcription; zero have confirmed per-cue Bhairava attribution. No missing words or dialogue were invented.

## Source and evidence

- Source file: `C:\Users\Hp\Downloads\Telegram Desktop\Toonflex - Kalki 2898 AD (2024) 720p AMZN WEB-DL x264 [T.mkv`; 1,519,431,511 bytes.
- SHA-256: `ccf2352ebe70b25e8163ffe6aa8d38fffc831830af9a3e93fbf3379428cd1399`. This matches the previous Phase 4 review's source hash, permitting reuse of its clearly attributed evidence.
- Runtime 02:55:45.376; encoded video 1280×528 at 24 fps. The filename's “720p” does not describe the encoded height.
- Telugu EAC3 5.1 and Telugu AAC audio tracks exist. English, Tamil, Kannada and Malayalam subtitles exist. **No Telugu subtitle track exists.**
- A fresh extraction of embedded English stream 3 byte-matches `phase4/movie-review-20261111/dialogue-english-subtitles.srt`. Fresh SRT SHA-256: `01777852fd0b6d7815a1b776f6983421e761f06794279a146e0be5d580330116`.
- Existing full-film index: 1670 English subtitle cues and 1,642 automated hard-cut intervals. Hard cuts do not establish character identity or semantic scenes.
- All six existing one-minute overview contact sheets were visually inspected. They sample the film; they do not constitute continuous manual viewing or lip-synchronized speaker verification. The 12 candidate windows retain sampled Bhairava appearances but include other speakers and intercuts. Coverage is not exhaustive.
- CSV: 561 subtitle-review candidates in those windows, with unique IDs, exact source English subtitle wording, timestamp fields, explicit uncertainty and rights fields. Unrelated cues outside the windows remain in the pre-existing full-film English index; they are not claimed as Bhairava dialogue.

## Telugu transcription attempts

Only already-cached offline models were used; nothing was installed or downloaded. Audio was decoded into memory for pilots, not written as new clips or distributed assets.

1. Small multilingual model, 26:50–27:25, main Telugu track downmixed to mono: repeated nonsensical Telugu syllables.
2. Same model, center-channel samples at 26:33–26:55 and 61:20–61:38: repeated nonsensical syllables again.
3. Base multilingual model, alternate AAC track at 27:20–27:40: mixed-script/repeated nonsense despite detecting Telugu.

All output was rejected. Model log probabilities and language confidence did not establish transcription correctness. The failure's underlying cause was not established; neither the soundtrack nor the model alone is proven responsible. These tests do not establish that the movie audio itself is unintelligible. No full-film ASR run was justified after the failed pilots. Rejected drafts remain in the diagnostic evidence folder solely for auditability, outside the catalogue and production assets.

## Task-by-task result

- Bhairava scene scan: **PARTIAL** — visual sample candidates, not exhaustive appearances.
- Dialogue detection/catalogue: **PARTIAL** — English subtitle review index; not diarized Telugu dialogue.
- Timestamps: **PASS for source subtitle intervals**, **UNVERIFIED for exact spoken utterance boundaries**.
- Original Telugu wording: **UNVERIFIED / INCOMPLETE** — blank fields are intentional, not missing invented content.
- English translation/context: **PARTIAL** — embedded translated subtitles preserved; independent translation and exact speaker/context review pending.
- Game suitability: **PARTIAL** — reference categories supplied, no cleared reusable line shortlist.
- Standalone SFX: **UNVERIFIED** — six mixed transient windows only; no clean effects established.
- Vocal reactions: **PARTIAL** — one subtitle-indicated exclamation review pointer; no verified performer or isolated reaction inventory.
- Structured IDs and CSV consistency: **PASS** — 561 rows; unique IDs, valid timestamps and exact source English preservation checked.

## Rights and game integration

Copyright/distribution permission for the film dialogue, performances, soundtrack and effects is **UNVERIFIED**. Possession of the movie and this reference analysis do not clear any reuse. No legal determination of clearance is made. No recording was enabled, packaged, cloned, generated, or represented as licensed. Existing rights checks remain unchanged. Reference suitability and linguistic accuracy are independent of rights clearance.

## Integrity and cleanup

- Compared 357 previously recorded production/source/configuration file hashes: 0 differences.
- Personal saves were not accessed or modified. No save-integrity claim beyond non-access is made.
- No game build, gameplay test, development server or new playback integration was needed or launched for this analysis.
- The four ASR pilot segments completed. No ongoing full-film transcription was launched.
- All three pilot jobs recorded exit code 0. A system-wide process inventory was unavailable because Windows denied CIM access; no successful global process inspection is claimed.
- Existing reports, source movie, rollback evidence and source assets were preserved. New files are confined to this report package and `phase6/movie-dialogue-analysis-20261114/` diagnostics/support files. No new extracted audio file was written.
- This comparison is a recorded production-file baseline comparison, not a fresh claim of the historical 47/47 protected-manifest verification.

## Remaining dependency and recommendation

Have a fluent Telugu reviewer perform continuous audiovisual review, exact transcription and speaker attribution using the CSV. Human review must also disambiguate intercuts, songs, overlapping speech, background voices and retrospective Karna material. Do not treat a visible face, subtitle mention, or translated line addressing Bhairava as proof that he speaks it. After verification, assess each individual line for factual relevance; mission progress and rewards must remain grounded in actual game data.

The package is suitable to organize that review now. It is **not** a completed exact Telugu/Bhairava transcript and **not** an approved audio asset library. No voice integration should proceed from it. Analysis stops here without changing Phase 6 implementation.

## Deliverables and supporting evidence

- `phase6/phase6-movie-dialogue-catalogue.md`
- `phase6/phase6-movie-dialogue-timestamps.csv`
- This report.
- `phase6/movie-dialogue-analysis-20261114/`: source metadata, fresh English subtitles, source/production baseline, rejected ASR pilot results/logs, candidate data and CSV validation.
- `phase4/movie-review-20261111/`: unchanged source-matched contact sheets, character samples, full English subtitle index, hard-cut index and mixed-SFX inventory.
