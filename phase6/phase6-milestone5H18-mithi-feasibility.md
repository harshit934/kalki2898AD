# Milestone 5H.18 — Mithi v2 Flash feasibility

Checked 15 November 2026 (Asia/Calcutta). **CONDITIONAL for a future isolated evaluation; no installation, audio generation or production approval.** Current RAM headroom and missing dependencies prevent a ready-to-run finding. Indic Tiny remains the existing baseline.

## Exact identity and verification

Repository: [Oomni/mithi-v2-flash](https://huggingface.co/Oomni/mithi-v2-flash). Immutable revision: `1fc0dd68496a2483508ec764d310146c41ff90be`. Pinned config reports version `2.0.0`; the embedded package still declares `1.0.0` at run.py:34, so use the repository commit, not that internal string, as the identity.

[Official metadata API](https://huggingface.co/api/models/Oomni/mithi-v2-flash/revision/1fc0dd68496a2483508ec764d310146c41ff90be?blobs=true) supplied every file size and Git/LFS identifier. Evidence: `research5h18/repository-metadata.json`. These are published identifiers, not independent hashes of downloaded weights: no weights were fetched. Small text config, licence and runtime were read in memory and independently SHA-256 hashed:

- config.json: `d8fb1c38620ae5c334149fe62f82e39525ac3fbb7155d63fe6ff34a55f775f95`
- LICENSE: `c71d239df91726fc519c6eb72d318ec65820627232b2f796219e87dcf35d0ab4`
- run.py: `e36d7d5381d6e5b82f99cfadf05ee1848027dbcf503c6d2ca3443769f5e429ec`

- `.gitattributes` — 1,651 bytes; Git blob SHA-1 `b1f4b1bcd938f65d51a630a9a1e912df20585c27`
- `LICENSE` — 11,357 bytes; Git blob SHA-1 `261eeb9e9f8b2b4b0d119366dda99c6fd7d35c64`
- `README.md` — 6,308 bytes; Git blob SHA-1 `b6db35db2cae6def4e3735d0f6d71924f768d1af`
- `assets/mithi_express.mp4` — 27,861,445 bytes; published LFS SHA-256 `8cc2e0d42874b9c77387ca114f0fbe68f919f79545652f1a77b998ed1842ae41`
- `assets/mithi_express_thumbnail.png` — 150,760 bytes; published LFS SHA-256 `23b0227fda477073fa1787654e4f2fc857d09ae4f1e8b23ce2a22360cc2460ca`
- `config.json` — 3,812 bytes; Git blob SHA-1 `1a5bbe2833fc451ab4cc9f2938860641c32aca06`
- `decoder.safetensors` — 117,901,964 bytes; published LFS SHA-256 `ac23543e42b771a985dd835faff45549e798cdce6893675681f9f0a872478cf8`
- `indic_encoder/config.json` — 763 bytes; Git blob SHA-1 `0fe8fea31dd37b575dc1d86ce697ea37ee4da449`
- `indic_encoder/model.safetensors` — 42,628,896 bytes; published LFS SHA-256 `839472b327c09e1d68d235c654e20e1ebe9d0101f41b9bc22f31fe9032f6ff9c`
- `indic_encoder/old2new.npy` — 1,600,128 bytes; published LFS SHA-256 `5aafbba764e27ff63fad04dbb5a297cc00fb01cb63b29a0efcd4a532a8d3aa54`
- `indic_encoder/spiece.model` — 5,646,064 bytes; published LFS SHA-256 `3a1173c2b6e144a02c001e289a05b5dbefddf247c50d4dcf42633158b2968fcb`
- `run.py` — 356,050 bytes; Git blob SHA-1 `0fc0a113de96d16c9ba8ebb819029c150b970e60`
- `voices.safetensors` — 2,611,992 bytes; published LFS SHA-256 `8d0fac38a44762260e2177c188328659fc06c549bd3ff1064ea978d050c6c37f`
- `writer.safetensors` — 37,711,456 bytes; published LFS SHA-256 `b64ad7c92e8bfe66797f519ad508532a6a314edb51e2c1cc08003d84ea486562`

Never treat a Git blob SHA-1 as a file SHA-256. Recheck actual bytes against these pinned values before any future authorized execution. Demo media need not be downloaded.

## Current machine and installed environment

Fresh read-only Windows CIM and nvidia-smi inspection:

- Windows 11 Home Single Language, version `10.0.26300`; Ryzen 5 5600H.
- OS-visible physical RAM: 7,883,304,960 bytes (7.34 GiB); available 921,763,840 bytes (0.858 GiB). This is an instantaneous reading, not a permanent capacity limit.
- C: total 510,881,951,744 bytes (475.79 GiB); free 19,023,237,120 bytes (17.72 GiB).
- GTX 1650: 4096 MiB total; 3935 MiB free; driver 592.82; compute capability 7.5. GPU memory is not substitute system RAM.
- Current Python `C:/Python313/python.exe`, 3.13.4. Installed: torch 2.11.0+cu128, transformers 5.17.0, NumPy 2.3.4, safetensors 0.8.0, sentencepiece 0.2.2. No torch import, GPU tensor allocation or model load was needed.
- Required packages absent from this interpreter: soundfile, misaki, espeakng-loader, phonemizer-fork, spaCy and num2words. The English spaCy model prerequisite was not independently confirmed. Existing Indic Tiny uses a different ONNX path; its success does not establish these dependencies.

Version floors in the published instructions fit the installed core versions and Python >=3.10 requirement, but that is not proof that every Windows Python 3.13 dependency resolves or the full runtime works. No install/dry-run resolver or runtime import executed. [espeakng-loader](https://pypi.org/project/espeakng-loader/) explicitly publishes a Windows x86-64 wheel; the complete Mithi chain remains UNVERIFIED. Path handling in run.py:71–90 also works around long eSpeak data paths, potentially copying ~19 MB to a temporary shorter path during future inference. Use a short isolated path, not the production tree.

## BF16 storage versus execution

This distinction is confirmed by [pinned runtime source](https://huggingface.co/Oomni/mithi-v2-flash/blob/1fc0dd68496a2483508ec764d310146c41ff90be/run.py), not inferred from marketing tags:

- run.py:6238–6261 constructs default FP32 decoder/writer modules, loads state dictionaries without assigning BF16 module dtype, explicitly requests the Indic encoder in FP32 at line276 and converts voice packs with `.float()`.
- `.to(self.dev)` selects device, not BF16 precision. Thus the inspected stock path converts stored BF16 tensors for FP32 execution; native BF16 hardware is not mandatory for this path. This is source inference, not an execution pass.
- Local torch/cuda/__init__.py:183–203 treats compute capability major >=8 as native BF16 support. This GPU is 7.5: no native BF16 acceleration. Emulated tensor support would not establish efficient kernels; not tested.
- Explicit CPU selection is supported. Default selects CUDA when available, so a later CPU-only experiment must select CPU explicitly. Do not change installed packages or runtime now.

Core config counts sum to 99,079,134 parameters: FP32 arithmetic storage is ~396.3 MB (377.96 MiB), excluding voice packs, framework, activations, frontend and temporary loading copies. The ~199 MB BF16 storage claim is not peak RAM or VRAM.

## Storage and memory estimates

Metadata sum excluding demo assets: **208,480,441 bytes (198.82 MiB)**; complete repository including demo assets: 236,492,646 bytes. Extra tokenizer/mapping files explain why the download exceeds core weights. A future environment/dependency/cache allowance of **3–6 GiB** is a planning range, not a measured install size; a newly duplicated CUDA torch environment could exceed it. Preserve at least 10 GiB free disk after setup. Current disk can plausibly support a CPU-focused setup, subject to exact dependency resolution.

Reserve **1–2 GiB available RAM** before a bounded CPU test; this is a conservative proposed test gate, not an official minimum or measured peak. Current 0.858 GiB fails even its lower end and the previous 1 GiB investigation gate. Do not rely on paging or close processes without authorization. CUDA peak also unknown: allow roughly 1–2 GiB VRAM for planning only, including context and activations; 4 GiB total does not prove safety during the game. Short offline asset generation is the sensible future trial, not concurrent live gameplay TTS.

## Telugu, voices and expressive potential

The [model card](https://huggingface.co/Oomni/mithi-v2-flash) lists Telugu (`te`) and five male stock choices: Satvik (`satvik`), Anirban (`anirban`), Nakul (`nakul`), Vasant (`vasant`), Siddhant (`siddhant`); all voices are advertised across supported languages. Output is 24 kHz mono. No voice has been auditioned here.

Pinned config and runtime provide voice, language, deterministic seed, sentence gap, pitch-shift and sampling settings. No named calm/urgent/combat/emotional style selector is exposed. Temperature changes randomness, not a verified emotion control. Keep wording fixed in any future comparison. Embedded G2P aliases replace some unavailable Indic phones with nearest alternatives (run.py:61–62), a source-level pronunciation risk rather than an observed Telugu defect.

Publisher limitations include relatively flat emotion, rare-name/loanword errors, sentence-independent context and no published listening evaluation. Its EPYC 9554 estimate is ~3 seconds for a ~7-second sentence with four threads (~0.43 real-time factor), or ~8 seconds with one (~1.14). Neither predicts Ryzen laptop latency or any specific Telugu voice quality. Emotional range and pronunciation remain UNVERIFIED; no evidence it improves on Indic Tiny.

## Licensing and third-party obligations

The pinned [LICENSE](https://huggingface.co/Oomni/mithi-v2-flash/blob/1fc0dd68496a2483508ec764d310146c41ff90be/LICENSE) is Apache License 2.0. This permits commercial use of the licensed work subject to compliance; it does not certify every training source, speaker consent or generated output. Model/code permission is better documented than a blanket output-rights clearance. No production clearance granted.

[Apache section4](https://www.apache.org/licenses/LICENSE-2.0) requires licence delivery with redistributed copies, retention of relevant notices, marking modified files and preservation of applicable NOTICE attributions. No separate NOTICE exists in the pinned repository listing. Preserve publisher credits and collect upstream notices; no trademark endorsement is granted. A generated-WAV-only game and redistribution of the model/runtime are different packaging cases: do not assert model-source distribution duties automatically attach to every WAV.

Third-party checklist:

1. Maya2-native and Maya normalizer: publisher credits Apache2; [Maya official model](https://huggingface.co/maya-research/maya2-native) also lists Apache2. Preserve applicable upstream credits/licences if shipped. Exact training lineage and all source dataset permissions are not fully documented for these Mithi stock voices in inspected material.
2. Kokoro components: embedded runtime identifies copied code; [official Kokoro licence](https://github.com/hexgrad/kokoro/blob/main/LICENSE) is Apache2. Retain notices for redistributed derived code.
3. Indic-BERT: [official card](https://huggingface.co/ai4bharat/indic-bert/blob/main/README.md) lists MIT; retain copyright and permission notice in distributed copies/substantial portions. Exact upstream revision attribution should be pinned before packaging.
4. misaki: publisher lists Apache2; exact dependency version and notices must be resolved separately. Do not call every pip package Apache2.
5. eSpeak NG: [upstream COPYING](https://github.com/espeak-ng/espeak-ng/blob/master/COPYING) is GPLv3; shipping its binary/library entails its own notice/source compliance review. It is a frontend dependency even though the neural output is not an eSpeak fallback. Do not infer that GPL automatically licenses every generated WAV or the whole game.
6. **Concrete missing notice:** run.py:1816–1817 references `assamese_numbers.LICENSE` for copied AI4Bharat number data. That named file is absent from the pinned tree. [Upstream licence location](https://github.com/AI4Bharat/indic-numtowords/blob/master/LICENSE) does not by itself resolve whether every embedded subsection is covered. Obtain the exact referenced notice/licence and reconcile copied data before redistribution, even if testing Telugu only.
7. Other dependencies, spaCy model and their transitive native libraries need a pinned licence/notice inventory before packaging. No dependency resolution or full SBOM obtained in this audit.

**All third-party obligations are NOT fully verified.** Missing referenced notice, exact upstream revisions, training/source rights evidence and stock-voice/output conditions remain separate open items. Do not substitute a repository Apache tag for this evidence.

## Comparison and decision

Indic Tiny baseline is already runnable locally: selected ONNX payload 91,055,719 bytes; historical 5H7 worker peak RSS 262,316,032 bytes (~250.2 MiB), request generation 0.2445–0.9698 seconds. Its historical text/settings differ: this is feasibility context, not a fair speed/quality ranking. Evidence: `local-tts-evaluation/milestone5H7/resource-results.json`, 5G6 and 5H7 reports. No new baseline synthesis ran. Indic Tiny's pronunciation, emotional suitability and production rights are not promoted by this comparison.

**CONDITIONAL**: Mithi is a plausible small offline candidate with five male options and FP32 CPU execution. It is not ready to run now: free RAM is insufficient for the proposed test gate, dependencies are missing, Windows execution is unverified and notices/rights remain incomplete. No claim of expressive improvement.

Smallest future authorized step: resolve referenced notices and exact dependency plan; recheck >=1 GiB available RAM (prefer 2 GiB) and disk reserve; only then seek approval for a separate isolated CPU environment and pinned downloads. If authorized, compare the existing five original lines at fixed settings, log actual peak RAM/time, prohibit runtime network access and stop on low headroom/errors. No installation or synthesis authorized by this report. Production consideration would additionally need output/voice rights resolution and actual listening evidence.

## Preservation and stop

Audit reads only public metadata/text documents and local hardware/package metadata/historical reports. No model weights/media acquired, package changes, source execution, synthesis, secret/account access, personal-save access, build or gameplay launch. New files are the three requested deliverables plus documentation-only `research5h18/` evidence/helper files. Existing reports and audio retained. Integrity result is recorded in the companion report. No server/service started; commands exited. No rollback of production is required. Stop here.
