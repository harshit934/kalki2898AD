# Milestone 5G.6 — Local voice test results

**PASS — one isolated local stock-male WAV generated. Pronunciation and final voice suitability UNVERIFIED.**

## Exact successful test

- Model: `sulabhkatiyar/indic-tiny-tts-telugu`, revision `fb552545f06d76d7b5d6365827b69c0bda465767`.
- Preset: `male`, model speaker `te_M`, numeric speaker 13. No reference recording or cloned speaker.
- Runtime: ONNX Runtime 1.30.0, CPUExecutionProvider, two threads; seed 42, speed 1.0, configured read style.
- Text source: original, unchanged `BH6-5E-001`; 132 Unicode code points. Draft remains PENDING/UNVERIFIED.

> కాపలాదారుల్ని ఓడించు. తర్వాత వార్డెన్‌ను ఎదుర్కొని, అవశేషాన్ని సేకరించు. క్రిస్టల్స్ సేకరించడం, రిలేలను స్కాన్ చేయడం తప్పనిసరి కాదు.

Sample: `phase6/local-tts-evaluation/indic-tiny-male-evaluation.wav`.

## Measurements from this run

- Format/readback: **24,000 Hz, mono, 16-bit PCM WAV**, 224,800 frames.
- Audio duration: **9.3667 seconds**.
- Model load: **0.3649 seconds**.
- Synthesis: **0.8340 seconds**; real-time factor **0.0890** (about 11.2 times real time, this short run only).
- Supervisor total worker elapsed: **3.2188 seconds**.
- Sampled peak worker RSS: **208,322,560 bytes / 198.7 MiB**. End-of-worker self-reading: 213,172,224 bytes / 203.3 MiB; sampling may miss a brief peak. Not a claim of absolute peak allocation.
- Minimum available RAM sampled by supervisor: **1,175,875,584 bytes / 1.095 GiB**. System memory changed between initial audit and inference.
- Float waveform RMS: **0.04906**, absolute peak **0.41536**, fraction at/above 0.999: **0**. Nonempty and all values finite. These checks do not establish intelligibility or loudness suitability.
- WAV SHA-256: `adb8c43a20faea1bea49f7e9acd21a7dcb06c5de2cdcab09fef0fcc116df4d0e`.

## Safety and test coverage

- **PASS:** local path explicitly supplied; CPU provider explicitly selected; no cloud inference.
- **PASS:** Python audit hook refuses socket connection/address-resolution/bind during inference. Offline Hugging Face/Transformers flags set. No network synthesis path used.
- **PASS:** existing source SHA-256 verified before synthesis; output opened exclusively, no overwrite.
- **PASS:** WAV decoded by Python wave reader; correct rate/channels/width and nonzero frame count.
- **PASS:** no timeout or memory safeguard triggered. Supervisor limits: 120 seconds, 700 MiB sampled worker RSS, 160 MiB minimum available system RAM. Only the owned worker could be terminated; none was necessary. Worker exited 0 and stopped.
- **UNVERIFIED:** Telugu pronunciation, fluent delivery, truncation of spoken words, unnatural pauses, maturity and emotional quality. No listening or ASR transcript claimed; waveform checks alone cannot verify them. No human reviewer required or represented as having approved anything.
- **NOT TESTED:** multi-emotion delivery, long dialogue, repeated-run consistency and real-time gameplay integration. No gameplay integration authorized.

## Other requested male presets

- Hima **Srinivas**, **Karthik**, **Pranay**: no WAV; clear licence/evaluation permission not established. No quality failure inferred.
- Piper **Venkatesh**: no WAV; specific voice/output rights and installed compatible runtime not established. No quality failure inferred.
- Indic Tiny has one configured male preset; that preset was tested. Female preset excluded as requested. Thus no multiple successful voices exist for an identical-text perceptual comparison.

Raw evidence: `test-results.json`, `resource-results.json`, `synthesis.log`, `download-results.json`, `model-sizes.json`, `final-verification.json` under `phase6/local-tts-evaluation/`. Attribution and complete supplied notices preserved. This is a successful local feasibility test, not a final Bhairava voice decision.
