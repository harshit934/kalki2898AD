# Phase 6 Milestone 5C — Telugu ASR feasibility test

## Recommendation: FAIL

**Do not process the remaining candidates with this approach under the current test conditions.** Ten fixed clips were prepared, but **zero transcriptions completed**. The first generation attempt failed; the other nine were deliberately NOT RUN. This is an **execution-feasibility failure**, not evidence that the selected model's Telugu accuracy is poor. Recognition quality and reliability remain UNVERIFIED. No Telugu wording or confidence value has been invented to fill the missing results.

## Installed tools and previous failures

Installed versions: {"faster-whisper": "1.2.1", "openai-whisper": "20250625", "transformers": "5.17.0", "torch": "2.11.0+cu128", "torchaudio": "2.11.0+cu128", "ctranslate2": "4.8.2", "numpy": "2.3.4", "onnxruntime": "1.30.0", "psutil": "7.2.2", "av": "18.1.0"}. Accelerate 1.15.0 was also verified installed. The local cache originally contained generic Systran faster-whisper tiny/base/small checkpoints. No Telugu-fine-tuned checkpoint was previously cached.

Earlier generic base/small tests used CPU int8 and float32, explicit Telugu/automatic language detection, mono/center-channel main audio or alternate AAC, and float-array/PCM WAV input. They returned repeated syllables, wrong-script text and replacement characters. Those outputs remain rejected. The new approach uses **different, Telugu-fine-tuned weights, a different inference engine, and GPU execution**; it does not repeat the same failed generic-model configuration.

Selected alternative: **vasista22/whisper-telugu-base**, pinned revision `58520d69478a7ec42a6683c3f94fd5eab0b91366`, through installed Transformers/PyTorch. The author describes it as a Telugu-fine-tuned Whisper Base checkpoint. [Model card](https://huggingface.co/vasista22/whisper-telugu-base).

Another alternative, AI4Bharat IndicConformer, supports Telugu through a different architecture but its official setup requires AI4Bharat NeMo. That stack and its model were not installed; costs and performance for that option remain unmeasured. [Official setup](https://github.com/AI4Bharat/IndicConformerASR). Existing ONNX Runtime does not by itself supply a compatible Telugu ASR model. No cloud service was used and no movie audio was uploaded.

## Model download and costs

Before downloading, commentary reported approximately 292 MB of model/tokenizer files and estimated 1–2 GB working RAM. A subsequent range-resume step separately reported approximately 585 MB temporary staging space. Actual model files: **292,235,501 bytes**; current model/staging files: **582,692,100 bytes**. No Python package, driver, service or system setting was installed or changed.

The initial sandbox network lookup failed. An escalated download was approved, then a slow sequential transfer was interrupted and resumed using four exact byte-range requests from the same pinned revision. One automatic approval review timed out; the permitted single retry succeeded. The final weights' SHA-256 matches the source repository's LFS hash. Individual files, sizes and hashes are recorded in `model-download-manifest.json`. Only inference files and the README were fetched, not remote Python code, training-state files or JAX weights. Loading used `weights_only=True`, offline local files and no remote code.

Model/staging directory: `C:\Users\Hp\AppData\Local\Temp\kalki-m5c-whisper-telugu-base-20261114`. These files are outside game assets and are preserved; no project files were deleted to obtain space.

## Controlled sample design

Exactly ten IDs were selected from the 192-entry provisional shortlist before inference. Their extracted audio totals **38.167 seconds**, **1,223,344 bytes**. Selection targets include clear/conversational, fast, colloquial, noisy vehicle/action and adjacent-speaker contexts. These are scene-based selection targets, not human-certified acoustic labels.

The actual local movie was read at the recorded timestamps. EAC3 audio stream 1's center channel was decoded to mono 16 kHz signed-16-bit WAV, without denoising or source separation. Padding/context boundaries and all overlapping English subtitle cues are retained in the sample manifest. The fast-dialogue clip spans consecutive subtitle cues; the Roxie exchange includes adjacent speaker context. This does not establish simultaneous overlap or identify the voices.

The ten WAV files are under `phase6/milestone5c-asr-20261114/temporary-audio/`, outside `public`, `src`, game-audio folders and production output. Initial extracts in an ephemeral sandbox temp directory became unavailable between commands, so the same ten clips were re-extracted into this stable diagnostic folder. No extra candidate was selected or transcribed. Waveform checks found nonzero signal and zero clipped samples in all ten files; this does not establish speech clarity or absence of background sound.

## Configuration and failures

Intended inference configuration: {"engine": "Hugging Face Transformers", "device": "cuda:0", "dtype": "float16", "language": "te", "task": "transcribe", "numBeams": 3, "doSample": false, "maxNewTokens": 96, "maxTimePerSampleSeconds": 30, "useCache": true, "attention": "eager", "audio": "EAC3 stream 1 center channel -> mono PCM16 WAV 16kHz", "network": "offline inference; no audio uploaded", "subtitlePromptProvided": false}. No subtitle, expected wording or English translation was passed as a recognition prompt. The legacy checkpoint's language/task/no-timestamp metadata was completed **in memory**, using its own tokenizer IDs; model files were not edited.

1. **Initial host-staged loading failed before generation.** `from_pretrained(... dtype=float16 ...).to('cuda:0')` raised `DefaultCPUAllocator: not enough memory: you tried to allocate 524288 bytes`. No sample ran. Raw evidence: `initial-cpu-loading-failure.json`. This confirms a CPU allocation failure at loading; it does not establish the exact system-wide commit/paging cause.
2. **Direct-to-GPU loading succeeded.** Using the installed Accelerate support via `device_map='cuda:0'` loaded all 245 checkpoint tensors in 1.277 seconds, then generation began for MOV-DLG-0293. [Documented direct GPU loading](https://huggingface.co/docs/transformers/nvidia_gpu).
3. **First generation failed without text.** Console output included `fatal : Memory allocation failure`, followed by `torch.AcceleratorError: CUDA error: unknown error`. The traceback surfaces in beam-search processing at `torch.min(beam_scores, ...)`. CUDA errors may be reported asynchronously, so that line is **not proof of the originating kernel or a particular hardware/driver defect**. VRAM exhaustion, host allocation pressure or a runtime issue are not independently established. Evidence: the second traceback and resource samples in `raw-test-results.json`; observed console excerpt is recorded in this report.
4. **Stopped rather than continuing failures.** No transcript, token score, timed successful inference or language-quality result exists. The remaining nine clips were NOT RUN. No third loading configuration, model installation, driver investigation or full-catalogue run was attempted.

The script caught errors and saved status `ERROR` before exiting; a shell exit code of zero is not a passed test. Generation also warned that `output_scores` might be ignored by this installed stack. Therefore supported per-word or calibrated confidence was not demonstrated. All confidence fields are UNAVAILABLE.

## Measured resources and limitations

- Hardware query: NVIDIA GTX 1650, 4,096 MiB VRAM, driver 592.82. CUDA availability was measured. Before testing NVIDIA reported 0 MiB process-accounted usage and 3,935 MiB free; those readings are not a peak allocation trace.
- Physical RAM reported 7.34 GiB. Baseline available RAM was 1113.1 MiB. No user applications were closed or Windows settings changed.
- Initial failed process: 56.457 s including imports/loading; sampled peak RSS 627.5 MiB; sampled minimum system available RAM 375.0 MiB.
- Direct-GPU process: 42.349 s including imports/loading/failed generation; sampled peak RSS 1014.1 MiB; sampled minimum system available RAM 431.5 MiB. Sampling interval was 200 ms, so brief peaks may be missed.
- No valid per-sample inference speed, real-time factor, peak successful-inference VRAM or sustained CPU/GPU utilization measurement exists. Those fields remain unavailable rather than zero.
- The Windows paging/commit query via psutil failed with `PdhAddEnglishCounterW failed`; commit pressure and paging were not quantified. No broad Windows investigation was opened.
- Final NVIDIA query after the process exited returned 0 MiB usage and 3,935 MiB free. This supports context release, not absence of a transient fault.
- Free disk after report preparation: 15.03 GiB. Audio and model staging remain at the documented locations, outside production assets.

## Per-sample results

### M5C-01 — MOV-DLG-0293 — 00:26:35.714–00:26:38.172

- Intended condition: Clear/drowsy conversational speech candidate.
- Extracted interval: 1595.214–1598.672 seconds.
- English subtitle reference: "Hey, Bujji. Please. 5 minutes."
- Telugu draft: **UNAVAILABLE**. Generation attempted and failed; no transcript returned.
- Confidence: **UNAVAILABLE**. Unclear words: **all original wording UNVERIFIED**, because no draft exists.
- Overlapping speakers: **UNVERIFIED**. No diarization or simultaneous-overlap detector was used; multiple subtitle turns do not prove overlap. Speaker identity remains UNVERIFIED.
- Usability: **UNUSABLE as an available draft**. Linguistic quality **NOT EVALUATED**. No source-to-draft semantic comparison was possible.

### M5C-02 — MOV-DLG-0334 — 00:28:55.256–00:28:56.756

- Intended condition: Short command with music/action context.
- Extracted interval: 1734.756–1737.256 seconds.
- English subtitle reference: "Play a nice song."
- Telugu draft: **UNAVAILABLE**. NOT RUN after the first generation failure.
- Confidence: **UNAVAILABLE**. Unclear words: **all original wording UNVERIFIED**, because no draft exists.
- Overlapping speakers: **UNVERIFIED**. No diarization or simultaneous-overlap detector was used; multiple subtitle turns do not prove overlap. Speaker identity remains UNVERIFIED.
- Usability: **UNUSABLE as an available draft**. Linguistic quality **NOT EVALUATED**. No source-to-draft semantic comparison was possible.

### M5C-03 — MOV-DLG-0600 — 00:54:10.589–00:54:12.214

- Intended condition: Colloquial Telugu and code-switch/proper-name risk.
- Extracted interval: 3250.089–3252.714 seconds.
- English subtitle reference: "It's a real egg, Bujji."
- Telugu draft: **UNAVAILABLE**. NOT RUN after the first generation failure.
- Confidence: **UNAVAILABLE**. Unclear words: **all original wording UNVERIFIED**, because no draft exists.
- Overlapping speakers: **UNVERIFIED**. No diarization or simultaneous-overlap detector was used; multiple subtitle turns do not prove overlap. Speaker identity remains UNVERIFIED.
- Usability: **UNUSABLE as an available draft**. Linguistic quality **NOT EVALUATED**. No source-to-draft semantic comparison was possible.

### M5C-04 — MOV-DLG-0623 — 00:55:04.881–00:55:07.881

- Intended condition: Natural conversational/colloquial narrative.
- Extracted interval: 3304.381–3308.381 seconds.
- English subtitle reference: "I've fought on all sides, boss."
- Telugu draft: **UNAVAILABLE**. NOT RUN after the first generation failure.
- Confidence: **UNAVAILABLE**. Unclear words: **all original wording UNVERIFIED**, because no draft exists.
- Overlapping speakers: **UNVERIFIED**. No diarization or simultaneous-overlap detector was used; multiple subtitle turns do not prove overlap. Speaker identity remains UNVERIFIED.
- Usability: **UNUSABLE as an available draft**. Linguistic quality **NOT EVALUATED**. No source-to-draft semantic comparison was possible.

### M5C-05 — MOV-DLG-0718 — 01:01:16.839–01:01:19.589

- Intended condition: Adjacent speaker turns: Bhairava/Roxie context.
- Extracted interval: 3676.339–3681.589 seconds.
- English subtitle reference: "How could I forget, Roxie?"
- Telugu draft: **UNAVAILABLE**. NOT RUN after the first generation failure.
- Confidence: **UNAVAILABLE**. Unclear words: **all original wording UNVERIFIED**, because no draft exists.
- Overlapping speakers: **UNVERIFIED**. No diarization or simultaneous-overlap detector was used; multiple subtitle turns do not prove overlap. Speaker identity remains UNVERIFIED.
- Usability: **UNUSABLE as an available draft**. Linguistic quality **NOT EVALUATED**. No source-to-draft semantic comparison was possible.

### M5C-06 — MOV-DLG-1166 — 01:44:38.339–01:44:41.131

- Intended condition: Vehicle/engine background-noise context.
- Extracted interval: 6277.839–6281.631 seconds.
- English subtitle reference: "Bujji, can you clarify a doubt for me?"
- Telugu draft: **UNAVAILABLE**. NOT RUN after the first generation failure.
- Confidence: **UNAVAILABLE**. Unclear words: **all original wording UNVERIFIED**, because no draft exists.
- Overlapping speakers: **UNVERIFIED**. No diarization or simultaneous-overlap detector was used; multiple subtitle turns do not prove overlap. Speaker identity remains UNVERIFIED.
- Usability: **UNUSABLE as an available draft**. Linguistic quality **NOT EVALUATED**. No source-to-draft semantic comparison was possible.

### M5C-07 — MOV-DLG-1187 — 01:45:40.214–01:45:43.131

- Intended condition: Fast continuous dialogue spanning adjacent subtitle cues.
- Extracted interval: 6339.714–6347.131 seconds.
- English subtitle reference: "For once in life, just for today,"
- Telugu draft: **UNAVAILABLE**. NOT RUN after the first generation failure.
- Confidence: **UNAVAILABLE**. Unclear words: **all original wording UNVERIFIED**, because no draft exists.
- Overlapping speakers: **UNVERIFIED**. No diarization or simultaneous-overlap detector was used; multiple subtitle turns do not prove overlap. Speaker identity remains UNVERIFIED.
- Usability: **UNUSABLE as an available draft**. Linguistic quality **NOT EVALUATED**. No source-to-draft semantic comparison was possible.

### M5C-08 — MOV-DLG-1244 — 01:52:42.006–01:52:43.797

- Intended condition: Action/environmental-noise context.
- Extracted interval: 6761.506–6764.297 seconds.
- English subtitle reference: "I'll have a real egg in the Complex."
- Telugu draft: **UNAVAILABLE**. NOT RUN after the first generation failure.
- Confidence: **UNAVAILABLE**. Unclear words: **all original wording UNVERIFIED**, because no draft exists.
- Overlapping speakers: **UNVERIFIED**. No diarization or simultaneous-overlap detector was used; multiple subtitle turns do not prove overlap. Speaker identity remains UNVERIFIED.
- Usability: **UNUSABLE as an available draft**. Linguistic quality **NOT EVALUATED**. No source-to-draft semantic comparison was possible.

### M5C-09 — MOV-DLG-1396 — 02:10:29.797–02:10:31.797

- Intended condition: Quieter speech with a name and numeric amount.
- Extracted interval: 7829.297–7832.297 seconds.
- English subtitle reference: "Bujji, give him those 500 units."
- Telugu draft: **UNAVAILABLE**. NOT RUN after the first generation failure.
- Confidence: **UNAVAILABLE**. Unclear words: **all original wording UNVERIFIED**, because no draft exists.
- Overlapping speakers: **UNVERIFIED**. No diarization or simultaneous-overlap detector was used; multiple subtitle turns do not prove overlap. Speaker identity remains UNVERIFIED.
- Usability: **UNUSABLE as an available draft**. Linguistic quality **NOT EVALUATED**. No source-to-draft semantic comparison was possible.

### M5C-10 — MOV-DLG-1613 — 02:43:04.922–02:43:07.256

- Intended condition: Late battle/atmospheric background context.
- Extracted interval: 9784.422–9787.756 seconds.
- English subtitle reference: "Hey, girl from the labs."
- Telugu draft: **UNAVAILABLE**. NOT RUN after the first generation failure.
- Confidence: **UNAVAILABLE**. Unclear words: **all original wording UNVERIFIED**, because no draft exists.
- Overlapping speakers: **UNVERIFIED**. No diarization or simultaneous-overlap detector was used; multiple subtitle turns do not prove overlap. Speaker identity remains UNVERIFIED.
- Usability: **UNUSABLE as an available draft**. Linguistic quality **NOT EVALUATED**. No source-to-draft semantic comparison was possible.

## Interpretation and next action

The pre-inference evaluation plan required at least 8/10 usable drafts, including noisy and fast/colloquial material. **The gate was not reached: 0 completed drafts, 1 failed generation attempt and 9 not-run samples.** These counts must not be reported as ten inaccurate transcripts or ten completed recognition tests. English subtitles are available comparison references, not exact Telugu ground truth. WER/CER and linguistic approval remain UNVERIFIED.

The safest next action is to use an isolated ASR environment with sufficient host-memory headroom and a working CUDA/runtime path, then retry **these same ten fixed clips** before approving any remaining-candidate processing. A CPU-quantized Telugu-fine-tuned model could be assessed as an alternative only after its conversion/storage/memory needs are reviewed. This report does not authorize or begin that work. Do not buy hardware or change drivers based on this limited evidence alone.

## Integrity and stop status

- All **357 recorded production/source/configuration hashes match** the pre-test baseline. Input 192-candidate CSV unchanged: True.
- Personal saves and campaign data were not accessed or modified. No source, game audio, control, progression, rights-manifest or production build changes were made. This is not a new claim of historical 47-manifest or personal-save-content verification.
- No actor voice was cloned/imitated, no movie audio was uploaded, and no extracted audio was enabled or packaged. Model licence and movie/audio reuse rights are separate; distribution rights remain UNVERIFIED.
- No game server was launched. Both loading/inference processes exited; the model-download job completed. No full transcription or voice integration started. No packages were installed.
- Existing reports/evidence are preserved. New files consist of the two requested deliverables and supporting scripts, manifests, signal checks, fixed temporary WAVs and failed-run evidence in `phase6/milestone5c-asr-20261114/`; model/staging files are in the separately documented temporary directory.

**Final decision: FAIL — current execution feasibility, not a recognition-accuracy verdict.** Stop for review.
