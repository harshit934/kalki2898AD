# Milestone5H.20 — Python3.13 / Windows lightweight Telugu TTS research

Checked15November2026, Asia/Calcutta. **No suitable alternative satisfying all requirements is currently established.** Four genuine offline routes are compared with Indic Tiny and Mithi: Ninada, Hima Nano ONNX, Piper/Venkatesh and eSpeak NG. Meta MMS Telugu is additionally screened out for noncommercial model terms and unconfirmed male identity. No new listening result or production approval.

## Evidence and machine limits

This is documentary research. PASS means a specific declaration/artifact exists; it does not mean local inference or pronunciation passed. Last measured host context from5H19: Python3.13.4, Ryzen55600H, OS-visible7.34GiB RAM with0.777GiB available,17.714GiB free C:, GTX1650 4GiB from5H18. No fresh resource probe needed; availability may have changed. Preserve the failed1GiB start gate for Ninada, not reinterpret small files as proof that it passes now.

Official ONNX Runtime1.30.0 metadata has a `cp313-cp313-win_amd64` wheel (14,311,378 bytes) and Python>=3.11. This is a credible Python3.13 building block, not proof of every frontend/graph compatibility. Offline execution needs a complete local model/runtime set first. No package/model/audio acquisition occurred.

## Candidate comparison

### Ninada5.1.2 — CONDITIONAL research lead; remains on hold

Exact model revision remains `gnumanth/ninada@25143ee2842dd7bd9e2955b94797d43590ca676e`; source `hemanth/ninada@745b55633615cfacc636af81ac08450fd3ff35d3`. Telugu male Studio `onnx/te.onnx` is29,281,720 bytes; Mobile version22,737,098 bytes from prior metadata, not RSS. Pinned Python project declares>=3.10 with optional ONNX Runtime/NumPy/SoundFile. Browser/JS routes can bypass Python, but are not a verified standalone Windows executable. [Pinned project](https://github.com/hemanth/ninada/blob/745b55633615cfacc636af81ac08450fd3ff35d3/pyproject.toml), [model](https://huggingface.co/gnumanth/ninada).

The previous5H4 source audit found CPU sessions, rate/noise settings and automatic non-neural Klatt fallback. A WAV can exist without neural success; future testing must assert graph/provider/output tier and prevent implicit network fetches. No demonstrated urgency/triumph/emotional style selector. Small weights and publisher benchmarks establish neither actual memory safety nor an expressive upgrade.

Code MIT, model publisher CC-BY4, Rasa/SYSPIN initialization/source conditions separately recorded in5H4. Attribution must name exact code/model, retain MIT, provide CC-BY source credits/licence/change indications and resolve release-specific source/output questions. No commercial game clearance. [Pinned code licence](https://github.com/hemanth/ninada/blob/745b55633615cfacc636af81ac08450fd3ff35d3/LICENSE), [Rasa](https://huggingface.co/datasets/ai4bharat/Rasa), [SYSPIN](https://vaani.iisc.ac.in/dataset/syspindataset). Do not install or run it while its RAM hold remains.

### Piper1.8.0 / Venkatesh medium — improved compatibility evidence, CONDITIONAL

Current official package lists Python>=3.9, Python3.13 classifier and `piper_tts-1.8.0-cp39-abi3-win_amd64.whl` (34,119,688 bytes). Stable ABI tag is compatible with ordinary CPython3.13 Windows x64; it is not a local execution test. Dependencies include ONNX Runtime<2 and pathvalidate<4; no PyTorch inference dependency required. GPL3-or-later code. [Official release](https://pypi.org/project/piper-tts/1.8.0/).

Official Venkatesh Telugu file metadata confirms63,516,050-byte ONNX plus4,973-byte config. Card identifies one speaker and22050Hz; prior project inventory calls it male, while the inspected tiny card itself has **no explicit gender field**. Therefore male identity is historical attribution, not newly independently established from that card. Config exposes length_scale1, noise_scale0.667, noise_w0.8 and Telugu eSpeak frontend. No semantic emotional styles or cinematic energy demonstrated. [Voice directory](https://huggingface.co/rhasspy/piper-voices/tree/main/te/te_IN/venkatesh/medium), [config](https://huggingface.co/rhasspy/piper-voices/blob/main/te/te_IN/venkatesh/medium/te_IN-venkatesh-medium.onnx.json).

The card's CC-BY4 entry is specifically under **Dataset**, linking IndicVoices-R; it is not an unambiguous separate generated-output or weight grant. Dataset card independently lists CC-BY4 but gated access terms were not accepted. Runtime GPL permits commercial use with compliance; it cannot clear the voice. Preserve runtime/source obligations if shipped, dataset credits/licence/change notices and obtain weight/voice/output clarification before production. [Exact card](https://huggingface.co/rhasspy/piper-voices/blob/main/te/te_IN/venkatesh/medium/MODEL_CARD), [dataset](https://huggingface.co/datasets/ai4bharat/indicvoices_r). Current RSS and pronunciation UNVERIFIED. Potential technical alternative, not selection.

### Hima Nano Telugu ONNX int8 — NO-GO on rights

Repository `Prahaladha/hima-tts-nano-te-ONNX@8fd92e3956163815892f6adcf7e3aae91e70272b` declares Telugu built-ins Srinivas/Karthik/Pranay male, Windows CPU and an84MB int8 voice-set payload. Its M4 Pro speed and recognizer tests are publisher results, not Ryzen measurements/listening approval. Requirements list ONNX Runtime, NumPy, safetensors, SentencePiece, SoundFile and PyYAML; no Misaki<3.13 blocker is listed, but complete Python3.13 execution remains untested. [Official model and implementation](https://huggingface.co/Prahaladha/hima-tts-nano-te-ONNX).

Seed and stock-voice choice do not establish emotion control. Use of reference voice cloning exists in the wider model but is irrelevant and unauthorized here. Current metadata says licence `other`; inspected tree has no LICENSE file. No sufficient explicit model/code/commercial grant established. Small size and free access cannot remedy this. Do not synthesize before permission evidence is supplied. Pronunciation, RSS and emotion remain UNVERIFIED.

### eSpeak NG Telugu / male3 — real standalone fallback, NO-GO for cinematic target

Official Windows CLI/DLL is independent of Python. Telugu language file exists and is marked **testing**. Variant `male3` explicitly declares gender male; CLI grammar supports `<language>+<variant>`, so `te+m3` is a documented configuration path, not an auditioned stock neural actor. Native synthesis is formant-based; no neural model weights. [Windows guide](https://github.com/espeak-ng/espeak-ng/blob/master/docs/guide.md), [Telugu file](https://github.com/espeak-ng/espeak-ng/blob/master/espeak-ng-data/lang/dra/te), [male variant](https://github.com/espeak-ng/espeak-ng/blob/master/espeak-ng-data/voices/!v/m3).

CLI supports pitch/range, rate, gaps, WAV output and partial SSML. Those mechanical controls do not prove emotional performance. Upstream explicitly describes less natural/smooth output than recording-based synthesizers and a small program/data footprint; no measured RSS was obtained. [README](https://github.com/espeak-ng/espeak-ng), [CLI source manual](https://github.com/espeak-ng/espeak-ng/blob/master/src/espeak-ng.1.ronn).

GPLv3 code permits commercial use subject to compliance when conveying covered code/binaries; retain notices and satisfy source requirements. Generated audio and runtime distribution are different cases; do not infer GPL automatically applies to every WAV or grants all unrelated asset rights. Do not add MBROLA packages: they have separate voices/licences. [COPYING](https://github.com/espeak-ng/espeak-ng/blob/master/COPYING). No account/API credit cost. Technical fallback only; not established to meet the requested cinematic male assistant target.

### Meta MMS-TTS Telugu — explicit screened exclusion

`facebook/mms-tts-tel` is a real Telugu36.3M-parameter F32 VITS model with a Transformers route. Card uses CC-BY-NC4. No separate commercial permission identified; cannot recommend for commercial game assets under the published model terms. Male speaker identity is also not established by inspected card. Rhythm randomness is not named emotional acting. Included transparently as an exclusion, not counted as a verified male candidate or an alternative cleared for use. [Official model](https://huggingface.co/facebook/mms-tts-tel).

## Against existing baselines

**Indic Tiny te_M:** already executed on the existing local Python/ONNX route, five original samples and speed variants retained. Prior5H7 RSS262,316,032 bytes (~250.2MiB), payload91,055,719 bytes. It has the strongest local technical evidence, but no established actor-like emotional range; pronunciation/listening decision is not changed here. Existing model/code/dataset/output questions remain as5H13. No new audio or subjective ratings.

**Mithi v2 Flash:** five male presets and Telugu declared; Apache2 model/runtime with separately licensed frontend. Documented Misaki0.9.4 requires Python<3.13; no verified standalone Windows runtime supplied. Thus it does not meet this milestone's current compatibility gate. Its199MB storage claim understates FP32 runtime memory;5H19 missing notices and resource gates remain. Not rehabilitated through an untested frontend rewrite. [Publisher](https://huggingface.co/Oomni/mithi-v2-flash), local5H18/19 reports.

## Decision and practical ranking

**No suitable alternative is currently established across all seven requirements.** None has both verified low-memory execution on this current machine and demonstrated expressive Telugu with sufficiently complete commercial-output evidence.

For research prioritization only: Ninada and Piper are conditional lightweight leads; Hima fails permission evidence; eSpeak is a possible non-cinematic fallback; MMS fails published commercial-model terms. Tiny stays the baseline. This is not a voice-quality ranking, and no new test is recommended while RAM/rights gates remain unresolved. Ninada's existing hold is preserved. Do not repeat earlier synthesis/install attempts or acquire new software automatically.

All documented local paths avoid paid subscriptions/API credits once lawfully acquired. Free inference does not resolve licences, identity consent, expressive suitability or memory headroom. Naturalness, authority, pronunciation, urgency and emotional impact remain untested for the alternatives.

## Research record and stop

Official text/metadata inspected15November2026; saved excerpts/metadata under `research5h20/official-metadata.json` and `additional-official-metadata.json`. Some browser raw pages failed, so official small text/metadata endpoints were read instead; binaries were never fetched. No downloaded packages/weights/audio, installs, synthesis, purchases, external inference calls, production/environment/save changes or process termination. Requested reports/CSV and documentation-only support evidence are the only new files. No server or background worker started. Stop after research.
