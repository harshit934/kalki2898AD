# Phase 6 Milestone 5D — Telugu subtitle track investigation

## Conclusion

**No usable Telugu subtitle track was found in the supplied movie or the inspected external subtitle files.** Four embedded text tracks were extracted and their actual content inspected. They contain English, Tamil-script, Kannada-script and Malayalam-script subtitles, not Telugu-script original dialogue. Across the complete text of all four embedded tracks, Telugu-script letter count is **0**. Their metadata labels are consistent with inspected content; the conclusion does not rely on labels alone.

The existing **192 provisional Bhairava candidates have zero established Telugu subtitle matches**. The CSV records all 192 as `NO_USABLE_TELUGU_TRACK`, with unsupported Telugu text and track/cue fields intentionally blank. This is a negative-result ledger, not 192 matched dialogue lines.

No ASR model was loaded or downloaded, no Telugu wording was generated or back-translated, and no full transcription was begun.

## Source, tools and scope

- Actual source: `C:\Users\Hp\Downloads\Telegram Desktop\Toonflex - Kalki 2898 AD (2024) 720p AMZN WEB-DL x264 [T.mkv`. It was read in place; the source was not copied into production.
- Size: 1,519,431,511 bytes. SHA-256: `ccf2352ebe70b25e8163ffe6aa8d38fffc831830af9a3e93fbf3379428cd1399`. Matches the earlier source fingerprint: True.
- Container: matroska,webm; runtime 10545.376000 seconds.
- Tools: `ffprobe version 9.0.2-full_build-www.gyan.dev Copyright (c) 2007-2026 the FFmpeg developers` and `ffmpeg version 9.0.2-full_build-www.gyan.dev Copyright (c) 2000-2026 the FFmpeg developers`.
- Fresh inspection: ffprobe enumerated every stream and its codec/type/language/disposition metadata. FFmpeg extracted each subtitle stream by its **absolute stream index**, not a language-based assumption, into an isolated diagnostic SRT.
- The complete extracted text was scanned for Unicode script letters. Beginning/middle/end cue text and timestamps were retained and inspected to check actual content. Script detection identifies writing systems, not a fluent-speaker approval or exact linguistic audit of every line.
- Subtitle sidecar search: direct files beside the supplied MKV, and known project reference subtitles from the project subtitle-file inventory. It was not an exhaustive search of all drives, archives, nested download folders or other movie editions.

## All container streams

- Stream 0: video, codec `h264`, metadata language `eng`.
- Stream 1: audio, codec `eac3`, metadata language `tel`.
- Stream 2: audio, codec `aac`, metadata language `tel`.
- Stream 3: subtitle, codec `subrip`, metadata language `eng`.
- Stream 4: subtitle, codec `subrip`, metadata language `tam`.
- Stream 5: subtitle, codec `subrip`, metadata language `kan`.
- Stream 6: subtitle, codec `subrip`, metadata language `mal`.

The two `tel` labels belong to **audio streams**, not subtitles. Telugu audio metadata does not imply that Telugu subtitle text exists. No additional embedded subtitle streams were reported by ffprobe.

## Embedded subtitle extraction and actual text

All four are embedded `subrip` text streams in the MKV. Their `.srt` files below are **new extracted review copies**, not pre-existing external subtitle tracks. Original cue times/text are preserved in those files for inspection; none was added to the game.

### Stream 3 — `eng`

- Format: `subrip`; extraction: SUCCESS; cues: **1670**.
- Actual text dominant script: **Latin**. Script-letter counts: {"Telugu": 0, "Tamil": 0, "Kannada": 0, "Malayalam": 0, "Latin": 34644}.
- Extracted file: `phase6/milestone5d-subtitles-20261114/embedded-stream-3-eng.srt`.
- Extracted SHA-256: `01777852fd0b6d7815a1b776f6983421e761f06794279a146e0be5d580330116`.
- Text sample at 00:01:56,756 --> 00:01:58,256: "Ashwathama is dead."
- Text sample at 01:18:26,214 --> 01:18:28,547: "I messaged my people. They must be waiting."
- Text sample at 02:49:47,839 --> 02:49:49,922: "I will cause an earthquake!"
### Stream 4 — `tam`

- Format: `subrip`; extraction: SUCCESS; cues: **1629**.
- Actual text dominant script: **Tamil**. Script-letter counts: {"Telugu": 0, "Tamil": 22836, "Kannada": 0, "Malayalam": 0, "Latin": 0}.
- Extracted file: `phase6/milestone5d-subtitles-20261114/embedded-stream-4-tam.srt`.
- Extracted SHA-256: `724fc2702679941b082e231d070ed284f104b756b898b7bce7f138ba287eeb55`.
- Text sample at 00:01:56,875 --> 00:01:59,875: "அசுவத்தாமன் மடிந்தான்.\n[மெதுவாக] களிரான அசுவத்தாமன்."
- Text sample at 01:18:41,730 --> 01:18:45,560: "என் கண்ணு முன்னாடியே எவ்வளவோ\nதப்பு நடந்தும் எதுவும் செய்ய முடியல."
- Text sample at 02:49:48,145 --> 02:49:50,435: "பூமியை நான் அதிர வைப்பேன்!"
### Stream 5 — `kan`

- Format: `subrip`; extraction: SUCCESS; cues: **1646**.
- Actual text dominant script: **Kannada**. Script-letter counts: {"Telugu": 0, "Tamil": 0, "Kannada": 19746, "Malayalam": 0, "Latin": 4}.
- Extracted file: `phase6/milestone5d-subtitles-20261114/embedded-stream-5-kan.srt`.
- Extracted SHA-256: `13eafa5e508fab496eed9f9acad655e4c7a1b522aacd78d7c236ba1d6387be04`.
- Text sample at 00:01:56,913 --> 00:02:00,163: "[ಸಂಸ್ಕೃತ] ಇನ್ನಿಲ್ಲ ಅಶ್ವತ್ಥಾಮ! (ಎಂಬ ಆನೆ)"
- Text sample at 01:19:16,870 --> 01:19:18,290: "ಕಾಂಪ್ಲೆಕ್ಸ್‌ನಲ್ಲಿರತ್ತೆ."
- Text sample at 02:49:47,920 --> 02:49:49,920: "ಭೂಕಂಪವನ್ನು ಸೃಷ್ಟಿಸುತ್ತೇನೆ!"
### Stream 6 — `mal`

- Format: `subrip`; extraction: SUCCESS; cues: **1629**.
- Actual text dominant script: **Malayalam**. Script-letter counts: {"Telugu": 0, "Tamil": 0, "Kannada": 0, "Malayalam": 22533, "Latin": 3}.
- Extracted file: `phase6/milestone5d-subtitles-20261114/embedded-stream-6-mal.srt`.
- Extracted SHA-256: `cd9cd7f9ff3fb732776d01858e2814c5bd95b2b93746f5cc4c19e01987529147`.
- Text sample at 00:01:56,910 --> 00:01:59,869: "അശ്വത്ഥാമാ ഹത കുഞ്ചരഹ!"
- Text sample at 01:19:19,340 --> 01:19:20,260: "അമൃതല്ലേ."
- Text sample at 02:49:44,050 --> 02:49:49,860: "ഭൂതലം വിറയ്ക്കട്ടെ!\nഭൂതലം വിറയ്ക്കട്ടെ!"

These samples show real text from the extracted streams. Tamil, Kannada and Malayalam translations cannot recover exact original Telugu wording. Back-translation would create a new translation and must not be represented as movie dialogue. English likewise remains a translated reference, not a Telugu transcript. No usable Telugu-language Romanized dialogue track was identified in the inspected English/text samples; sampled reading is not an exhaustive linguistic review of every Latin word.

## External subtitles

No subtitle sidecar was found directly beside the movie with any of these extensions: `.srt`, `.ass`, `.ssa`, `.vtt`, `.sub`, `.idx`, `.ttml`, `.dfxp`, `.smi`, `.sup`.

Three existing project reference SRT files were inspected:

- `phase4\movie-review-20261111\dialogue-english-subtitles.srt`: 1670 cues; script-letter counts {"Telugu": 0, "Tamil": 0, "Kannada": 0, "Malayalam": 0, "Latin": 34644}; SHA-256 `01777852fd0b6d7815a1b776f6983421e761f06794279a146e0be5d580330116`.
- `phase6\movie-dialogue-analysis-20261114\source-english-subtitles.srt`: 1670 cues; script-letter counts {"Telugu": 0, "Tamil": 0, "Kannada": 0, "Malayalam": 0, "Latin": 34644}; SHA-256 `01777852fd0b6d7815a1b776f6983421e761f06794279a146e0be5d580330116`.
- `phase5\phase53-evidence\reference-only\story-study.srt`: 1670 cues; script-letter counts {"Telugu": 0, "Tamil": 0, "Kannada": 0, "Malayalam": 0, "Latin": 34644}; SHA-256 `01777852fd0b6d7815a1b776f6983421e761f06794279a146e0be5d580330116`.

All three are byte-identical to the freshly extracted English track: True. They are duplicate reference copies, not independent Telugu sources. They were read only and preserved.

## Candidate alignment, gaps and attribution

- Input: `phase6/phase6-bhairava-ai-reviewed-dialogue.csv`, **192** provisional candidates, preserved unchanged.
- Output: `phase6/phase6-milestone5D-subtitle-candidates.csv`, **192 unique IDs**, each with its original candidate timestamp, existing English reference, explicit no-Telugu-track status and UNVERIFIED speaker attribution.
- No Telugu track/cue IDs or original Telugu text exist to populate a match. No apparent timestamp overlap with an English/Tamil/Kannada/Malayalam translation was promoted to a Telugu match.
- Telugu subtitle gaps, offset/drift, cue-boundary mismatches and exact utterance alignment are **NOT ASSESSABLE**, not “zero” or “passed.” There is no Telugu timeline to compare.
- Bhairava speaker identity remains **UNVERIFIED** from the prior provisional review. Subtitles and timestamps alone do not establish who speaks; neither translated wording nor a mention of Bhairava establishes attribution.

## Limitations

The result applies to this exact movie file and the explicitly inspected sidecars/reference files. A separate Telugu subtitle file elsewhere or a different edition is not ruled out. Video-burned text was not OCR-scanned; it is not an embedded subtitle text track. The movie was not uploaded or sent to an external service. No search/download of online subtitles, new ASR run, speech synthesis, voice imitation or audio extraction was performed.

## Integrity, evidence and stop status

- All **357 recorded production/source/configuration file hashes match** the investigation baseline. The source hash matches the preceding analysis, and the 192-candidate input CSV remains unchanged.
- Production files, game audio, rights permissions, campaign data and personal saves were not modified. Personal saves were not accessed. This is not a new claim of historical 47-manifest/save-baseline verification.
- No game build, gameplay test or development server was launched. The ffprobe/FFmpeg extraction commands completed; no ASR or long-running test process was started.
- New writes are the two requested deliverables and diagnostic metadata, four extracted SRT review files, inspection/CSV scripts and validation results under `phase6/milestone5d-subtitles-20261114/`. Existing evidence was not overwritten. All extractions are outside production asset directories.
- Evidence: `ffprobe-streams.json` (all metadata), `subtitle-inspection-results.json` (complete script counts, representative cue text, hashes, external search scope), extracted stream SRTs, `csv-inspection.txt`, and `final-validation.json`.

**Investigation complete. No usable Telugu subtitle source was found; original Telugu recovery remains unresolved.** Stop without full transcription or voice integration.
