# Milestone 5H.7 — Indic Tiny delivery evaluation

15 November 2026. **PASS: bounded local delivery-control experiment and technical WAV validation. UNVERIFIED: emotional effectiveness, pronunciation, human language approval and production suitability.** Ninada remains on hold; it was not installed, imported or run.

## Verified controls and limits

Inspected the existing local `indic_tiny_tts/export/onnx_infer.py`, `frontend/textproc.py`, `constants.py` and model `config.json`, plus the preserved5G.8 generator/inventory. The ONNX synthesize API supports `text`, `voice`, `speed`, `seed` and an optional noise callable. Speed divides the predicted duration scale, rather than resampling an existing WAV. Frontend speed bounds are0.25–4.0; this experiment uses only0.92–1.12.

The runtime instance initializes `pause_s` from `synthesis.sentence_pause_s`, default0.15s. Synthesis inserts zeros of that duration between normalized sentence chunks. The isolated instance's `pause_s` was adjusted in memory; no config file changed. Frontend splits existing sentence punctuation and long chunks. No wording, punctuation, sentence order or normalization override was changed. Pause/speed combinations are intentionally joint profiles; this experiment cannot isolate their individual effects on perceived urgency.

Although generic constants list `read`, `conv`, `command` and `unknown`, **this released Telugu model's own styles table contains only `read:0`**. It is not evidence for command/emotion inference. `temperature`, flow steps and noise influence synthesis but are not verified emotion controls; they remain unchanged. There is no verified angry, triumphant, serious or calm style switch, SSML emotion interface or actor-reference conditioning used here.

## Exact baseline and experiment

Existing model `sulabhkatiyar/indic-tiny-tts-telugu`, revision `fb552545f06d76d7b5d6365827b69c0bda465767`; stock male `te_M`, speaker13. CPUExecutionProvider, two threads, seed42 reset for each call, read style. Model/config/table bytes were verified against the existing download manifest before loading. Offline flags and a socket audit hook blocked networking. No packages, models or audio were downloaded.

Five existing5G.8 lines were used verbatim, with one fresh speed1.00/pause0.15 control and one variant per ID. Controls matched all five original WAV hashes exactly. This establishes technical baseline reproducibility under these settings, not language accuracy. Each row preserves original English, Telugu, ID and pending status.

- **BH6-5E-002 — calm-assistance**: speed0.96×, pause0.22s; audio **5.2013s** versus control4.9287s (delta+0.2727s). Generation0.3867s versus control0.9698s. Peak-6.63dBFS; RMS-24.24dBFS; 2 sentence chunks. Exact Telugu and full metrics are in the CSV.
- **BH6-5E-004 — combat-urgency**: speed1.12×, pause0.08s; audio **6.5173s** versus control7.4253s (delta-0.9080s). Generation0.4626s versus control0.5499s. Peak-8.99dBFS; RMS-28.98dBFS; 3 sentence chunks. Exact Telugu and full metrics are in the CSV.
- **BH6-5E-013 — victory-confidence**: speed1.04×, pause0.12s; audio **5.3360s** versus control5.5793s (delta-0.2433s). Generation0.3817s versus control0.3938s. Peak-9.59dBFS; RMS-25.03dBFS; 2 sentence chunks. Exact Telugu and full metrics are in the CSV.
- **BH6-5E-037 — boss-intensity**: speed1.08×, pause0.10s; audio **3.6627s** versus control4.0007s (delta-0.3380s). Generation0.2445s versus control0.2795s. Peak-5.73dBFS; RMS-24.32dBFS; 2 sentence chunks. Exact Telugu and full metrics are in the CSV.
- **BH6-5E-045 — serious-delivery**: speed0.92×, pause0.28s; audio **5.6133s** versus control5.0567s (delta+0.5567s). Generation0.3431s versus control0.3512s. Peak-8.66dBFS; RMS-26.11dBFS; 2 sentence chunks. Exact Telugu and full metrics are in the CSV.

The victory/confidence test uses the existing recorded-completion/rewards statement; it is not newly invented celebratory dialogue. The serious test uses the existing missing-history fallback, not a newly invented emotional story scene. Calm uses initial guidance, urgency uses low-health advice, and boss intensity uses Warden guidance. Therefore emotional-range/content coverage is limited by the supplied original wording.

## Measurements and interpretation

All10 outputs: mono24kHz16-bit PCM, finite/nonempty inference output, correct WAV frame/data lengths, successful full PCM readback and zero full-scale samples. No normalization, gain boost, pitch shift or sound effects were applied. Inventory includes SHA-256, duration, generation time, real-time factor, peak/RMS, below−50dB sample fraction, inserted-pause duration and baseline/control deltas. Low-level sample fraction is a threshold metric, not a linguistic pause or silence detector. Header/finite checks cannot certify missing words, sentence completeness, naturalness or intelligibility.

Every variant changes bytes and duration versus its same-text control. Pace/pause changes are verified; emotional improvement is **UNVERIFIED**, not assumed from labels or shorter durations. Generation times are single samples, sequential with controls first; cache/warm-up and OS scheduling confound comparisons. They are not a speed benchmark or gameplay performance measurement.

Model load: 0.6061s. Supervised wall time12.679s; peak worker working set250.2MiB; minimum reported available RAM258.4MiB.

The existing Tiny bounded approach required350MiB available at start, checked200MiB before requests, and supervised a200MiB system floor,700MiB worker RSS cap and120s timeout. No guard tripped. These are Tiny experiment safeguards, not a relaxation of Ninada's separate1GiB gate. Measurements are whole-worker/system snapshots, not GPU attribution or isolated model-only memory.

## Playback comparison

Open [isolated playback page](local-tts-evaluation/milestone5H7/playback.html) directly. It offers original5G.8, matched control and delivery variant side by side for each line;15 audio players total. Starting one pauses others, Stop all resets every player, no autoplay or game storage. Keep the relative directories intact. Licence/attribution limitations remain linked.

Executed checks:15 local audio links resolve; simulated DOM tests pass single-playback, stop/reset and error feedback; no external script/network/storage/autoplay found. **Actual browser rendering, speakers, physical-device playback and listening were not tested**. Preventing overlapping playback is demonstrated by event-logic simulation, not an acoustic recording.

## Preservation and rollback

95/95 prior evaluation files,353/353 source/public files and3/3 original5E dialogue files match before/after hashes. This includes all eight old WAVs and existing model/runtime files. Personal profiles/saves were not accessed; no game production files or Python environment changed. No new independent47-protected/14-campaign/11-save audit is claimed.

All new scripts, logs,10 WAVs, results, integrity snapshots and playback page are confined to `phase6/local-tts-evaluation/milestone5H7/`; three requested deliverables are under `phase6/`. Rollback means stop using these isolated samples; no game rollback is needed. Do not delete or overwrite prior samples. Worker exited normally and no server was started.

## Recommendation

Indic Tiny supports **controlled pacing**, not demonstrated expressive emotion. Keep these profiles as evaluation candidates only. Compare playback before choosing any delivery; retain English/text fallback and all rights checks. Existing licensing/provenance limitations in5G.7 remain; no new commercial clearance, human Telugu approval or production readiness is granted. Stop here for review.
