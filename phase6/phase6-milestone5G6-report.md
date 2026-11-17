# Milestone 5G.6 — Local Telugu TTS evaluation

## Result

**PASS — local generation feasibility. UNVERIFIED — pronunciation/cinematic suitability and final production clearance.**

Best supported test candidate: **Indic Tiny TTS Telugu, male `te_M`**. It produced a 9.37-second WAV in 0.83 seconds on the existing CPU runtime, with no new dependency installation. This selection is based on observed compatibility, explicit licence evidence and low measured resources, not a listening ranking of untested voices.

## Work completed

1. Inspected Windows/Python, CPU, installed/available RAM, disk, GPU/VRAM and existing dependencies before downloading weights. Initial CIM inspection was sandbox-restricted; authorized read-only hardware inspection succeeded. No hardware assumptions substituted.
2. Fetched only public static cards, licences, metadata and inference source for the three candidates. Recorded exact repository revisions and file sizes before selecting weights.
3. Selected the clearly documented CC-BY/MIT candidate; downloaded only three ONNX graphs and the small Telugu frontend table, **91,055,719 bytes**, into the new isolated directory. Downloaded LFS files matched their published size and SHA-256. No full duplicate PyTorch model or existing audio samples downloaded.
4. Inspected the ONNX inference path; used existing NumPy/ONNX Runtime with no PyTorch import or installation. Enforced local-only synthesis and bounded resources. Generated exactly one short stock-male sample, no actor reference.
5. Verified PCM WAV structure, finite/nonempty samples and absence of full-scale clipping. Logged generation timing and memory, then stopped the worker. No fluent-language or perceptual approval fabricated.

## Deliverables

- `phase6/phase6-milestone5G6-model-comparison.md` — hardware, all three candidates, exact sizes, licence evidence and blockers.
- `phase6/phase6-milestone5G6-voice-test-results.md` — exact configuration, sample path, measurements and unverified quality items.
- `phase6/phase6-milestone5G6-report.md` — this report.
- `phase6/local-tts-evaluation/indic-tiny-male-evaluation.wav` — the only generated audio.
- Isolated scripts: `inspect_models.py`, `inspect_sizes.py`, `download_selected.py`, `run_local_test.py`, `supervise_test.py`.
- Isolated evidence: repository cards/source/licences under `metadata/`; `model-sizes.json`, `download-results.json`, `test-results.json`, `resource-results.json`, `synthesis.log`, `final-verification.json` and `ATTRIBUTION.md`.

All new files are documentation or isolated evaluation materials. No production source/configuration, rights manifest, original dialogue/audio, existing reports, game assets or saves changed. No voice enabled, approved or packaged.

## Integrity and resources

**357/357** recorded production/source/configuration hashes and **3/3** original Milestone 5E inputs match. Original fifty-one drafts remain unchanged. Personal saves were not accessed. No fresh independent 47-file/14-copy/11-save-baseline audit claimed.

Evaluation directory size at final measurement: **92,612,670 bytes** (before these final Markdown reports). C: free after test: **25,423,990,784 bytes**, approximately 23.68 GiB. No project files deleted to free storage. All source assets and rollback evidence retained. No dependency installation or persistent environment change. No Azure, cloud synthesis, paid request, subscription or voice actor used. Web requests were solely documentation/static downloads, not speech generation.

Build/lint unnecessary: no production code change. Isolated test exited 0 and WAV readback passed. No owned worker, development server or model service remains running. Rollback requires no production restoration; isolated materials can remain for review. Do not delete them without approval.

## Blockers and stop

Hima Srinivas/Karthik/Pranay were not run because the inspected repositories did not establish a clear licence grant. Piper Venkatesh remains untested because voice-specific/output permission and a compatible runtime were not established. No claim that those voices are technically unusable.

Indic Tiny's explicit licences support evaluation and commercial use subject to their terms, but generated-output/personality rights and application-specific distribution compliance are not fully independently cleared. Attribution has been prepared. Pronunciation and dramatic suitability remain unverified; the model's configured read style does not establish calm/aggressive/humorous versatility.

**Recommendation:** retain this local male sample as the best verified technical candidate for the next review. Do not designate it the final Bhairava voice, change rights checks, or integrate it into gameplay without separate approval. **Stopped after evaluation.**
