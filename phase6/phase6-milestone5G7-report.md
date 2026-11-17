# Milestone 5G.7 — Evaluation summary

**Recommendation: suitable for further isolated prototype development; not approved for Bhairava production use.**

## Results

- **PASS — existing WAV technical integrity:** complete declared PCM frames decode; 9.3667 seconds, mono 24-kHz/16-bit; peak −7.63 dBFS; zero full-scale samples. No structural corruption found.
- **PASS — measurable pause/signal analysis:** threshold-specific quiet intervals and a coarse F0 estimate recorded. Longest internal ≥100-ms quiet interval is 320 ms at −45 dBFS. This is not word alignment or proof of natural prosody.
- **UNVERIFIED — pronunciation and spoken completeness:** no supported local listening/ASR assessment performed. Difficult written clusters, loanwords and negation risks documented without inventing mispronunciations. No human certification claimed.
- **UNVERIFIED — subjective suitability:** maturity, confidence, authority, non-aggressive delivery and clarity in a combat mix cannot be established by F0/PCM metrics alone.
- **PASS — optional local tuning:** two new WAVs, 0.92× and 1.08×, identical original text and stock voice. Including the existing baseline, exactly three settings examined. Both new files pass decoding/clipping checks. No subjective winner selected.
- **PASS — licence/attribution preparation:** model, vocoder, code and public dataset licences considered separately; ready-to-use credit block and full-notice checklist prepared.
- **UNVERIFIED — final commercial clearance:** individual speaker releases and any applicable separate rights not independently established. No blanket permission or approved voice status inferred from a licence tag.

## Samples

- Preserved original: `phase6/local-tts-evaluation/indic-tiny-male-evaluation.wav` — 1.00×, 9.3667 s.
- New: `phase6/local-tts-evaluation/indic-tiny-male-speed-092-5g7.wav` — 0.92×, 10.1560 s.
- New: `phase6/local-tts-evaluation/indic-tiny-male-speed-108-5g7.wav` — 1.08×, 8.6947 s.

No audio overwritten, normalized, pitch-shifted or integrated. Original hash remains `adb8c43a20faea1bea49f7e9acd21a7dcb06c5de2cdcab09fef0fcc116df4d0e`.

## Created files and validation

Created the three requested reports, `phase6/local-tts-evaluation/quality5g7.py`, `quality5g7-results.json`, the two new speed WAVs, and `quality5g7-frontend-NOTICE.txt` (a small public licence document). The frontend notice adds IndicXlit/CMU Dictionary conditions for any future frontend redistribution; it was missing from the earlier metadata capture. Previous evidence and attribution files unchanged. Measurements and SHA-256 values are in the JSON. No dependencies/models downloaded or installed; documentation lookup only, with local generation network-disabled. No Azure/cloud synthesis, payment, actor reference or cloning.

**357/357** recorded production/source/configuration hashes and **3/3** Milestone 5E inputs match. Original fifty-one drafts unchanged. Personal saves not accessed or modified. No fresh independent 47-file/14-copy/11-save check claimed. Build/lint unnecessary because no production source changed. Local analysis/synthesis completed successfully; no development server or owned background process remains running.

See `phase6-milestone5G7-quality-report.md` and `phase6-milestone5G7-license-attribution.md` for exact observations, limitations and sources. Keep all three samples for review. **Stopped before production integration or voice approval.**
