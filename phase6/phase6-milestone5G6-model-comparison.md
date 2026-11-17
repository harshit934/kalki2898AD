# Milestone 5G.6 — Local Telugu model comparison

## Selection

**Best supported evaluation candidate: Indic Tiny TTS Telugu, stock `male` / `te_M`.** It ran locally with existing NumPy/ONNX Runtime and explicit licence files. This is a technical/licensing preference, not a perceptual ranking or final Bhairava approval.

Only public documentation and static repository files were requested online. No Azure, hosted inference, cloud speech API or paid service was used. No movie/actor reference, cloning or random-speaker generation used.

## Machine inspected before weights or installation

- Windows 11 Home Single Language, version `10.0.26300`, build 26300.
- Python `3.13.4`, executable `C:\Python313\python.exe`; the Python launcher listed only this installation. Project `.venv`/`venv` directories were not found in the checked locations. An existing Blender portable directory is present; its bundled Python was not used. This was not an exhaustive whole-disk environment search.
- CPU: AMD Ryzen 5 5600H with Radeon Graphics.
- Installed module: **8 GiB**, 3200 MT/s. Windows reported 7,883,304,960 bytes usable physical memory; initial available memory approximately 0.89 GiB, so a small CPU model was selected and bounded.
- C: free before weights: **25,523,073,024 bytes**, approximately 23.77 GiB. Only C: plus its Temp alias appeared in the inspected filesystem drives.
- NVIDIA GTX 1650: **4096 MiB total / 3935 MiB free** at inspection. GPU not used.
- Existing packages: NumPy 2.3.4, ONNX Runtime 1.30.0, PyTorch 2.11.0+cu128, Transformers 5.17.0, huggingface-hub 1.31.0, SciPy 1.17.1, psutil 7.2.2, edge-tts 7.2.8. `soundfile` and `piper-tts` not installed in the inspected environment. No new dependencies installed.

## Hima TTS Nano Telugu ONNX

Repository `Prahaladha/hima-tts-nano-te-ONNX`, pinned revision `8fd92e3956163815892f6adcf7e3aae91e70272b`.

- Publisher lists **Srinivas, Karthik, Pranay** as male presets and Windows CPU ONNX support with Telugu-script input. No GPU required by that path. These were not generated or auditioned.
- Selected-path theoretical files: INT8 voice graphs 60,187,299 bytes, decoder 23,482,392, prefix 18,020,039, tokenizer 618,690 and presets 50,688: **102,359,108 bytes**, excluding small config/code. Downloading the entire repository would unnecessarily duplicate base/voice and FP32/INT8 graphs. [Model card](https://huggingface.co/Prahaladha/hima-tts-nano-te-ONNX).
- Runtime requires NumPy, ONNX Runtime, safetensors, SentencePiece, PyYAML; saving through its supplied helper uses soundfile. Windows/Python 3.13 dependency combination not executed. Publisher benchmark/ASR claims are not measurements on this laptop or proof of cinematic emotion.
- **Licence blocker:** conversion and upstream cards label the licence `other`; the inspected conversion file inventory has no licence grant or linked licence text. No clear model, preset or code permission was established. Evaluation permission and commercial game-output permission therefore remain **UNVERIFIED**. Public download access is not sufficient. Metadata/source inspection only; no Hima weights downloaded or inference run.

## Indic Tiny TTS Telugu

Repository `sulabhkatiyar/indic-tiny-tts-telugu`, pinned revision `fb552545f06d76d7b5d6365827b69c0bda465767`.

- Telugu-script model with `male: te_M` and `female: te_F`; only the male preset was requested/tested. Configuration binds `te_M` to speaker ID **13**, language ID 6, `read` style 0. No personal speaker identity inferred.
- ONNX graphs: encoder **17,692,254**, flow decoder **19,169,253**, vocoder **54,150,036 bytes**: **91,011,543 bytes** total. Small Telugu text table added 44,176 bytes. Downloaded weights/text table total **91,055,719 bytes**. No PyTorch weight copies downloaded.
- **Windows CPU compatibility actually passed** on Python 3.13.4 / ONNX Runtime 1.30.0. Two CPU threads, no GPU or runtime install. Sample generation and memory figures are in the test report. [Model card](https://huggingface.co/sulabhkatiyar/indic-tiny-tts-telugu).
- **Licence evidence:** saved `LICENSE.md` explicitly covers acoustic weights and ONNX conversions as CC-BY-4.0, inference code as MIT, and Vocos weights as MIT with LibriTTS attribution. It requests credit to this model and AI4Bharat Rasa. Full notices and revision retained locally; evaluation permitted. [Pinned licence file](https://huggingface.co/sulabhkatiyar/indic-tiny-tts-telugu/blob/fb552545f06d76d7b5d6365827b69c0bda465767/LICENSE.md).
- **Commercial assessment:** these explicit licences allow commercial use subject to attribution/notices; no noncommercial restriction found in that licence file. A complete output-specific speaker/personality-rights grant was not independently verified. Keep attribution and licence evidence for any later distribution review; this report does not approve production audio. CC BY itself warns that other rights can remain. [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
- `read` style is the inspected configuration; five emotions were not tested or invented. Pronunciation, colloquial phrasing, game names and sentence completeness remain unverified perceptually.

## Piper Telugu Venkatesh

Repository `rhasspy/piper-voices`, revision `6b9cfaacb4fb2e02a9621227e3c1a48bec9710c3`; path `te/te_IN/venkatesh/medium/`.

- Actual ONNX package/config found: **63,516,050-byte model**, 22,050 Hz, one speaker, `te_IN`, eSpeak phoneme frontend `te`. The requested Venkatesh identity is treated as the package name, not evidence of a legal speaker identity. [Model card](https://huggingface.co/rhasspy/piper-voices/blob/6b9cfaacb4fb2e02a9621227e3c1a48bec9710c3/te/te_IN/venkatesh/medium/MODEL_CARD).
- Requires a compatible Piper/eSpeak frontend, not just ONNX Runtime. Piper not installed; current Windows/Python 3.13 runtime compatibility untested. CPU-oriented package; GPU unnecessary for the proposed path, but no performance measured.
- Dataset card names IndicVoices-R and CC-BY-4.0; the inspected voice card does not separately articulate the model/output licence. Repository-wide metadata says MIT, which cannot safely replace voice-specific verification. **Commercial output clearance remains UNVERIFIED.** Current Piper engine is GPL-3.0; this permits commercial use with obligations, rather than being a noncommercial prohibition. Engine and voice licences are separate. [Current engine](https://github.com/OHF-Voice/piper1-gpl).
- Not selected or downloaded as weights. No need to install an extra runtime when the selected explicit-license CPU candidate works. Voice quality/emotion not tested.

## Decision boundary

Indic Tiny is the only executed candidate. Hima's three male presets are **BLOCKED BY UNCLEAR PERMISSION**; Piper is **NOT TESTED / LICENCE AND RUNTIME READINESS UNVERIFIED**. No cross-model listening ranking is supported. Preserve the generated sample for review; no production approval or integration.
