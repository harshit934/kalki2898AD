# Phase 6 — Bhairava AI dialogue review report

## Result

**PARTIAL / UNVERIFIED.** The visual/context triage is complete for all 561 supplied candidates. The requested per-line, original-Telugu speech transcription and definitive speaker identification could not be completed reliably with the available local tools. No human verification, exact Telugu transcript, complete auditory review or cleared audio library is claimed.

The output shortlist contains **192 provisional AI Bhairava candidates**, all explicitly UNVERIFIED. There are zero confirmed speaker labels and zero usable original Telugu drafts. This shortlist is not ready for production dialogue integration.

## Source and timestamp matching

- Resolved source: `C:\Users\Hp\Downloads\Telegram Desktop\Toonflex - Kalki 2898 AD (2024) 720p AMZN WEB-DL x264 [T.mkv`. The supplied source is outside the game folder; it was read in place, not copied into production.
- Movie SHA-256: `ccf2352ebe70b25e8163ffe6aa8d38fffc831830af9a3e93fbf3379428cd1399`. It still matches the source used for the previous 561-entry index.
- Runtime 02:55:45.376. The file contains Telugu audio and English translated subtitles, but no Telugu subtitle stream.
- Input: `phase6/phase6-movie-dialogue-timestamps.csv`, 561 entries. Its source English extraction was previously byte-matched against the movie.
- Fresh local decoding: PyAV seeks backwards to a keyframe, then decodes forward to the first video frame at or after each subtitle interval's midpoint. All 561 requests succeeded. This matches each candidate to the local movie time rather than relying on a character-name keyword.
- AI inspected all 29 fresh contact sheets. These are timestamp stills, not continuous scene playback. Tiny or obscured faces, reaction shots and off-screen voices remain ambiguous.
- Thirteen selected candidates additionally have five frames spread across their cue: 0293, 0295, 0304, 0315, 0334, 0584, 0600, 0623, 0718, 1166, 1244, 1396 and 1613. Requested and actual frame times are in `motion-frame-times.json`. This strengthens visual/context evidence without establishing auditory identity or exact lip synchronization.

## Candidate dispositions

- RETAIN_PROVISIONAL: 192. Bhairava is visible and the surrounding subtitle/context suggests his turn; label remains UNVERIFIED.
- EXCLUDE_OTHER_CONTEXT: 291. AI evidence points to another character, a line addressing Bhairava or an unrelated intercut. These are excluded conservatively and are not proven auditory speaker labels.
- EXCLUDE_SONG: 26. Explicit lyric markers; not authenticated spoken Bhairava dialogue.
- EXCLUDE_UNCERTAIN: 52. Insufficient speaker evidence, possible mixed/off-screen speech. Excluded rather than silently assigned to Bhairava.
- Total: 561. The ledger retains all input IDs and reasons; only provisional candidates enter the requested CSV/Markdown shortlist. Inference-based exclusions may require correction during later continuous review.

## New speech-recognition work

No model, dependency or voice recording was downloaded, installed or uploaded. Only already-cached faster-whisper base/small models were used, CPU float32, with 16 kHz mono PCM WAV decoded in memory from the alternate Telugu AAC track. This deliberately changed the input representation and numeric mode from the previous int8/float-array attempts.

1. **00:26:35–00:26:50**, base model, Telugu transcription: invalid repeated Hindi-script text. Rejected.
2. Same audio, base model, English translation task: early phrases partially match the subtitle's request for five minutes and a reply, but later output diverges and repeats. It is not a reliable translation for the whole interval, and gives no authenticated speaker identity. The partial agreement does not rescue the Telugu transcription.
3. **00:27:34–00:27:41**, small model, Telugu transcription: repeated Telugu syllables and a replacement character. Rejected.
4. **00:54:08–00:54:17**, small model: similarly unusable repeated syllables. Rejected.
5. **01:52:40–01:52:49**, small model: similarly unusable repeated syllables. Rejected.

The sample quality gate failed across multiple scenes and two cached models. A full per-cue ASR run was therefore not performed: most candidates are explicitly **NOT TESTED by ASR**, not silently marked transcribed. Raw failed samples are retained separately in `float32-pilot.json` and `small-float32-pilot.json`; nonsense is not promoted into dialogue. Model confidence scores were not treated as proof. The precise technical cause of recognition failure remains unresolved.

## English translation and scene descriptions

The CSV preserves the existing embedded English translation for every retained candidate and labels its provenance. It does not present an independent English translation of unavailable Telugu. Scene descriptions were authored from inspected visual samples and adjacent subtitle context. They describe film events, not actual game objectives, rewards or player history. The failed ASR cannot support a word-by-word Telugu/subtitle comparison; that task remains incomplete.

## Task status

- Match all 561 timestamps to the movie: **PASS for frame sampling**, not a claim of full continuous scene review.
- Identify actual Bhairava speech: **PARTIAL / UNVERIFIED**. Provisional visual/context labels only; no definitive diarization.
- Generate usable Telugu transcription drafts: **FAIL with available models**. Failed raw model output preserved; no per-cue successful drafts.
- Compare original Telugu transcription with subtitles: **UNVERIFIED**, because no usable Telugu transcription exists. Partial English-ASR agreement in one interval is documented separately.
- English translation and scene context: **PARTIAL**. Source English translation and authored visual/context descriptions supplied; independent translation remains unverified.
- Mark uncertainty and exclude unrelated/background material: **PASS for explicit triage**, with AI-only attribution limitations stated.
- No invented wording or human verification: **PASS**.
- Production, audio permissions and saves: **PASS for non-modification within recorded checks**.

## Integrity and process status

- 357 recorded production/source/configuration file hashes compared: **0 differences**. Changed production paths: [].
- Source movie hash matches. Existing reports, 561-candidate CSV and earlier evidence were preserved.
- Personal saves were not accessed. No save, reward, unlock, mission, controls, voice-rights or production build configuration changes were made.
- No actor voice was cloned or imitated. No audio file was extracted to disk, packaged or enabled. Audio samples existed only in process memory for recognition.
- New writes are the three requested deliverables and supporting scripts, JPEG frame/contact evidence and JSON ledgers under `phase6/bhairava-ai-review-20261114/`.
- No development server or gameplay test was launched. Frame extraction, ASR and motion-sampling commands completed; no ongoing transcription job was launched.
- This is a source-file comparison, not a new historical 47-file protected-manifest or personal-save-content verification claim.
- Final CSV validation passed: 192 unique retained IDs, valid timestamp bounds, exact preservation of source English, existing image references, blank unsupported Telugu fields, UNVERIFIED speaker fields and false human-verification/audio-eligibility flags. All 561 inputs remain accounted for in the ledger. The production-file comparison was repeated after authoring with no differences. Results are recorded in `final-validation.json`.

## Conclusion

The earlier mixed 561-cue index has been narrowed into an auditable, explicitly provisional Bhairava shortlist. **It is not a completed Telugu transcript.** Reliable Telugu recognition and continuous audiovisual speaker verification remain necessary. A different demonstrably Telugu-capable recognition source could be tested against these same fixed samples before any large transcription run, but none was downloaded or represented as successful here. All original-language words and every speaker label remain UNVERIFIED. No material is cleared for game audio use.

Work stops with these files. No game implementation or voice-permission changes were made.
