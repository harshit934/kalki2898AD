# Milestone 5G.7 — Licence validation and commercial attribution preparation

## Scope and finding

**Evaluation permission documented. Commercial use is supported by the stated component licences subject to compliance; no final output/voice approval issued.** Attribution is not a substitute for permissions outside the licence scope. No dataset, model or voice was assumed cleared merely because it was downloadable.

The used snapshot is `sulabhkatiyar/indic-tiny-tts-telugu@fb552545f06d76d7b5d6365827b69c0bda465767`. Its actual `LICENSE.md`, supplied code notices, upstream records and current official cards were inspected.

## Components checked separately

- **Acoustic weights and ONNX encoder/flow graphs:** publisher explicitly assigns CC-BY-4.0, with credit to the model and Rasa. **PASS — stated permission and attribution requirements identified.** [Model card](https://huggingface.co/sulabhkatiyar/indic-tiny-tts-telugu), [pinned licence](https://huggingface.co/sulabhkatiyar/indic-tiny-tts-telugu/blob/fb552545f06d76d7b5d6365827b69c0bda465767/LICENSE.md).
- **Vocoder:** publisher states its weights are unchanged Vocos `charactr/vocos-mel-24khz@0feb3fdd929bcd6649e0e7c5a688cf7dd012ef21`, converted to ONNX, MIT. Upstream card has MIT metadata; its prose licence sentence expressly discusses code. Thus weight permission has publisher/upstream metadata support, not a separately inspected speaker-specific release. **PASS — stated MIT provenance; scope limitation recorded.** [Official Vocos card](https://huggingface.co/charactr/vocos-mel-24khz).
- **TTS/runtime code:** MIT, copyright 2026 Sulabh Katiyar. Vendored Matcha code: copyright 2023 Shivam Mehta; Vocos code: copyright 2023 Charactr Inc.; number tables: copyright 2022 AI4Bhārat. Full notices are preserved in the supplied licence files. **PASS.** Bundled components retain their own notices; one model credit does not replace them.
- **Acoustic training dataset:** official AI4Bharat Rasa card independently states CC-BY-4.0 and requests its four-author INTERSPEECH 2024 citation. Dataset files are gated; this audit did not accept access conditions or inspect individual speaker contracts. No raw Rasa audio is redistributed. **PASS — public dataset licence/citation; UNVERIFIED — individual releases/additional gated conditions.** [Official Rasa card](https://huggingface.co/datasets/ai4bharat/Rasa).
- **Vocoder training dataset:** OpenSLR's LibriTTS page independently identifies CC BY 4.0. No raw corpus downloaded or distributed. **PASS — public corpus licence; no claim of checking every source recording.** [LibriTTS](https://www.openslr.org/60/).

CC BY permits commercial sharing/adaptation subject to its conditions, including attribution, licence linking and change notices, while reserving the possibility of separate personality/privacy rights. No inference that every generated utterance is necessarily a derivative dataset recording. [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).

## Ready-to-use attribution text

This exact block is prepared for a future game's Credits / Third-Party Notices. It is conservative credit for the known used components, **not** a certificate that no further permission is needed:

> Telugu synthetic voice generated with **Indic Tiny TTS: Telugu** by **Sulabh Katiyar (2026)**, stock male preset `te_M`, model revision `fb552545f06d76d7b5d6365827b69c0bda465767`. Model: https://huggingface.co/sulabhkatiyar/indic-tiny-tts-telugu . Acoustic weights: **Creative Commons Attribution 4.0 International**, https://creativecommons.org/licenses/by/4.0/ .
>
> Acoustic training source: **AI4Bharat Rasa**, https://huggingface.co/datasets/ai4bharat/Rasa , **CC BY 4.0**. Credit: **Praveen Srinivasa Varadhan, Ashwin Sankar, Giri Raju and Mitesh M. Khapra**, *Rasa: Building Expressive Speech Synthesis Systems for Indian Languages in Low-resource Settings*, INTERSPEECH 2024.
>
> Vocoder: **Vocos** by **Hubert Siuzdak / Charactr Inc.**, https://huggingface.co/charactr/vocos-mel-24khz , MIT; underlying **LibriTTS** corpus, https://www.openslr.org/60/ , CC BY 4.0. Model architecture/code includes **Matcha-TTS**, https://github.com/shivammehta25/Matcha-TTS , MIT. Number-word tables derive from **AI4Bhārat indic-numtowords**, MIT.
>
> Inference code: **Copyright (c) 2026 Sulabh Katiyar**, MIT. Existing source/weight conversions and training-data processing were performed by the model publisher as documented in the supplied notices. This project did not change model weights; it generated new recordings from original project text. Evaluation variants use synthesis speeds 0.92, 1.00 and 1.08. No endorsement by the model authors, dataset authors or speakers is implied.

The code/corpus credits are useful provenance; the exact legally required distributed notice set depends on whether shipping only generated WAVs or also models/code. Do not assert a WAV-only licence obligation merely from the engine's software licence. Conversely, if shipping model/code, preserve full relevant copyright/permission/disclaimer texts, not just the block above.

## Full notice files to include if relevant material is shipped

All currently preserved under `phase6/local-tts-evaluation/metadata/sulabhkatiyar--indic-tiny-tts-telugu/`:

- `LICENSE.md`: acoustic licence, full TTS-code MIT notice, vocoder/data provenance.
- `indic_tiny_tts/vendor/matcha/LICENSE` and `UPSTREAM.txt`.
- `indic_tiny_tts/vendor/vocos/LICENSE` and `UPSTREAM.txt`.
- `indic_tiny_tts/textnorm/LICENSE-indic_numtowords`.
- Frontend notice was absent from the earlier local metadata capture. It was read at the pinned revision and preserved separately as `phase6/local-tts-evaluation/quality5g7-frontend-NOTICE.txt`; the old capture was not altered. It covers MIT transliteration code, generated lexicons derived from MIT AI4Bharat IndicXlit outputs, and CMU Pronouncing Dictionary-derived renderings. **Include this full notice if shipping the frontend/lexicons**, including its Carnegie Mellon copyright, conditions and disclaimer. This is an additional notice beyond the general TTS MIT file.

Existing licence materials were not replaced or shortened. The newly preserved frontend notice is documentary evidence, not a new model or installed dependency. NumPy/ONNX Runtime and other binaries would require their own applicable notices if redistributed. No engine/model is packaged into the game by this task.

If the frontend/lexicons are included, append this provenance credit to the block above and ship the full accompanying notice: **“Transliteration frontend/lexicons: Sulabh Katiyar (2026), MIT; AI4Bharat IndicXlit (2022), MIT; pronunciation renderings derived in part from the CMU Pronouncing Dictionary, Copyright (C) 1993–2015 Carnegie Mellon University. Full notices and disclaimers accompany this distribution.”** The short credit does not replace the full CMU conditions/disclaimer.

## Remaining distribution checks

1. Determine whether future distribution contains WAVs only or a runtime/model; assemble the corresponding licence files.
2. Preserve input-text ownership and exact generated-file provenance. Do not reuse movie dialogue/recordings or imply actor identity.
3. Resolve any applicable speaker/personality permissions not granted by the model/data copyright licences. No individual release was located or invented.
4. Revalidate the actual shipping asset list; this component review does not clear unrelated recordings, music or game assets.

**Attribution preparation PASS; unconditional commercial output clearance UNVERIFIED. No rights manifest changed and no voice approved.**
