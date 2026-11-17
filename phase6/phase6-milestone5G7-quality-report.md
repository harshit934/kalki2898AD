# Milestone 5G.7 — Telugu male voice quality

## Decision

**Suitable for further isolated prototype development on technical evidence. Not approved as Bhairava's final voice.** Language quality, subjective performance and gameplay audibility remain unverified. No human certification claimed or required for this prototype.

## Original sample — measured observations

File: `phase6/local-tts-evaluation/indic-tiny-male-evaluation.wav`. Preserved SHA-256: `adb8c43a20faea1bea49f7e9acd21a7dcb06c5de2cdcab09fef0fcc116df4d0e`.

- **PASS — format/playability:** PCM WAV, mono, 24,000 Hz, 16-bit; all 224,800 frames decoded. Duration **9.3667 s**, 449,644-byte file. Declared PCM length exactly matches decoded 449,600 bytes. This verifies decoding, not playback through speakers.
- **PASS — clipping/signal integrity:** no full-scale samples, peak **0.41534 / −7.63 dBFS**, RMS **−26.19 dBFS**, DC mean approximately −0.0000114. No numerical corruption or missing declared frames detected. No claim of perceptually artifact-free speech.
- **Silence:** 20-ms RMS windows below −45 dBFS occupy **21.58%** of analyzed frames; below −50 dBFS **17.74%**. Includes low-energy phonemes, not just silence. Detection omits a final partial window; timing precision is about one window.
- At −45 dBFS, runs at least 100 ms: **0.00–0.22**, **1.50–1.82**, **3.44–3.68**, **5.10–5.30**, **6.52–6.78**, **8.24–8.42**, **8.52–8.62 s**. Longest internal run **320 ms**. No extended multi-second dropout detected at these thresholds. These intervals are not aligned to words and cannot be called incorrect pauses.
- First/last 5-ms peaks **0.000427 / 0.001587**. Low edge energy is compatible with quiet boundaries; it cannot establish that the final word is present.
- Coarse accepted-frame F0: median **150 Hz**, p10–p90 **117.65–205.13 Hz**, 225 accepted frames. Method: 40-ms autocorrelation, 20-ms hop, 60–350 Hz search, normalized correlation ≥0.6. Octave errors/voicing errors are possible. This does not identify age, emotion or a particular speaker.

## Exact text and pronunciation evaluation limits

Original draft `BH6-5E-001`, unchanged:

> కాపలాదారుల్ని ఓడించు. తర్వాత వార్డెన్‌ను ఎదుర్కొని, అవశేషాన్ని సేకరించు. క్రిస్టల్స్ సేకరించడం, రిలేలను స్కాన్ చేయడం తప్పనిసరి కాదు.

**Text-based risks, not observed mispronunciations:**

- `కాపలాదారుల్ని`: long word and final `ల్ని` consonant combination; check for dropped sounds.
- `వార్డెన్‌ను`: transliterated game name with suffix; ensure the name and suffix remain distinguishable.
- `ఎదుర్కొని`: internal consonant combination; check syllable continuity.
- `అవశేషాన్ని`, `సేకరించు`, `సేకరించడం`: long vowels and consonant distinctions; check vowel duration and endings.
- `క్రిస్టల్స్`: loanword with initial `క్ర` and final `ల్స్` clusters; possible insertion/deletion risk.
- `రిలేలను`, `స్కాన్`: borrowed terminology and vowel length; pronunciation convention itself remains unreviewed.
- `తప్పనిసరి కాదు`: preserve the final negation; dropping or masking it would reverse the optional-objective meaning.

No listening-capable local tool, installed usable ASR pass or forced alignment was used. **Missing/distorted phonemes: UNVERIFIED. Word completeness: UNVERIFIED. Unnatural pauses: UNVERIFIED.** No invented word-to-timestamp alignment or transcription. The source draft remains PENDING/UNVERIFIED; synthesizing it does not validate its Telugu wording. No new model or human reviewer was introduced.

## Optional tuning — exactly three settings including original

Identical original text, `male/te_M`, seed 42, two CPU threads, ONNX Runtime CPU provider; only supported synthesis speed changed. This is duration control inside the acoustic model, not actor imitation or postprocessed pitch shifting.

- **1.00× original:** 9.3667 s; peak −7.63 dBFS; RMS −26.19 dBFS; F0 estimate median 150 Hz. Original preserved.
- **0.92×:** `phase6/local-tts-evaluation/indic-tiny-male-speed-092-5g7.wav`; 10.1560 s; synthesis 0.5963 s; peak −5.39 dBFS; RMS −25.93 dBFS; F0 estimate median 151.90 Hz. Longest ≥100-ms internal quiet run at −45 dBFS: 340 ms.
- **1.08×:** `phase6/local-tts-evaluation/indic-tiny-male-speed-108-5g7.wav`; 8.6947 s; synthesis 0.4821 s; peak −8.27 dBFS; RMS −26.11 dBFS; F0 estimate median 152.38 Hz. Longest corresponding internal quiet run: 280 ms.

All three decode as mono 24-kHz 16-bit PCM, with no full-scale samples. F0 medians remaining close is compatible with pitch stability, not proof of identical perceived identity. Faster duration does not prove better clarity; slower delivery does not prove greater confidence. No setting selected as perceptually best. Retain 1.00× as the comparison baseline, not an approved production setting.

## Suitability assessment

- **Mature male assistant:** male stock preset is documented; measured F0 offers a plausible basis for testing an adult male character. Perceived maturity/depth is subjective and **UNVERIFIED**.
- **Calm/confident:** neutral `read` style and speed control support experiments; confidence and calmness were **not heard or scored**.
- **Authoritative without aggression:** no subjective rating supported. Speed changes do not establish authority or emotional control.
- **Clear during gameplay:** technical signal passes, but no combat mix, ducking, speaker/headphone, mobile playback or intelligibility test performed. RMS is not integrated LUFS; no loudness target was established. The absence of clipping does not establish sufficient gameplay audibility.
- **Speech consistency:** one sentence at three speeds is insufficient to establish multi-line identity consistency, pronunciation reliability or emotion range.

Conclusion: retain for further prototype work; do not approve linguistic quality, dramatic delivery or production suitability.

## Preservation/evidence

New analysis/tuning helper `phase6/local-tts-evaluation/quality5g7.py`; full metrics and hashes in `quality5g7-results.json`. Network access denied by audit hook during generation; existing local model/dependencies only. No new model download or installation, Azure/cloud synthesis, actor reference or production integration. Original WAV and draft hashes unchanged; 357 recorded production files and three original source inputs match the preserved baseline. No personal saves accessed. Worker completed and no server remains running.
