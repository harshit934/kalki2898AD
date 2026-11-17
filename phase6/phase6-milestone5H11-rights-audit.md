# Milestone 5H.11 — Rights audit

15 November 2026. **CONDITIONAL component-licence feasibility; unconditional commercial game/output clearance UNVERIFIED. No voice approval.** Audit and planning only. Read preserved5H.7–5H.10 findings and current source licences. Public documentation pages were viewed for rights verification; no model, dataset, source package, recording or installer payload was downloaded or stored, and no gated access conditions were accepted.

## Exact component identities and permissions

1. **Acoustic model/graphs:** `sulabhkatiyar/indic-tiny-tts-telugu@fb552545f06d76d7b5d6365827b69c0bda465767`; local `LICENSE.md` explicitly assigns **CC BY 4.0** to `model.safetensors`, `onnx/text_encoder.onnx` and `onnx/flow_decoder.onnx`. Male stock speaker `te_M`, ID13. The preserved model card identifies Telugu Rasa-derived training. PASS: explicit publisher licence declaration inspected locally. Commercial use is permitted within that licence's scope and conditions, not every possible personality/voice claim. The pinned web licence page was unavailable to the browsing tool in this check; local preserved bytes remain the evidence, rather than pretending a fresh remote pin check succeeded. [Pinned licence](https://huggingface.co/sulabhkatiyar/indic-tiny-tts-telugu/blob/fb552545f06d76d7b5d6365827b69c0bda465767/LICENSE.md).

2. **Inference/runtime code:** local `indic_tiny_tts/` licence is **MIT**, copyright2026 Sulabh Katiyar. Commercial use/distribution permitted subject to retaining copyright/permission notices in copies/substantial portions. Vendored Matcha-TTS is MIT, copyright2023 Shivam Mehta; Vocos code MIT, copyright2023 Charactr Inc.; number tables MIT, AI4Bharat2022. Local full notices and UPSTREAM files are preserved. PASS: code permissions identified; not a blanket model/data licence.

3. **Vocoder weights:** `charactr/vocos-mel-24khz@0feb3fdd929bcd6649e0e7c5a688cf7dd012ef21`; local publisher licence identifies unchanged weights/ONNX conversion as MIT. Upstream current card also declares MIT, while prose discusses code. CONDITIONAL: publisher declaration plus upstream metadata support weight permission; no independent per-speaker consent is supplied by these statements. [Vocos card](https://huggingface.co/charactr/vocos-mel-24khz).

4. **Acoustic upstream dataset:** the official **AI4Bharat Rasa** card independently states **CC BY 4.0**. Its gated files require accepting access conditions; no gated terms or individual speaker contracts were accepted/verified here. PASS: public licence declaration; UNVERIFIED: any extra applicable access/voice permissions. [Rasa card](https://huggingface.co/datasets/ai4bharat/Rasa).

5. **Intermediate dataset provenance matters:** `sulabhkatiyar/indic-tts-mini-24k` and `indic-tts-multilingual-prepared` are mixed-licence collections. The mini card specifically attributes Telugu te_F/te_M to Rasa, while separate English subsets have IndicTTS/IIT Madras terms; the prepared card traces Rasa revision `632f55c7ac590219d41cd7adffce5b440e4604f5`. This supports the declared Telugu subset chain; it is not independent row-level verification of the actual training run. Do not label the entire collection CC BY or automatically import unrelated English restrictions into the declared Telugu subset. No training shards/checkpoints were examined. [Mini dataset](https://huggingface.co/datasets/sulabhkatiyar/indic-tts-mini-24k), [prepared dataset](https://huggingface.co/datasets/sulabhkatiyar/indic-tts-multilingual-prepared).

6. **Vocoder training data:** OpenSLR's official **LibriTTS SLR60** page separately declares **CC BY 4.0**. PASS: corpus declaration; no raw corpus redistribution or individual-recording clearance review. [LibriTTS](https://www.openslr.org/60/).

7. **Frontend/lexicons:** preserved `quality5g7-frontend-NOTICE.txt` includes MIT transliteration code, MIT IndicXlit-derived lexicons and CMU Pronouncing Dictionary-derived materials with separate notice/conditions/disclaimer. If distributing that frontend, retain the full notice rather than reducing everything to MIT. No frontend is proposed for the game runtime.

## Commercial use conclusion

CC BY 4.0 allows commercial sharing/adaptation with attribution, licence link and indication of changes; it does not guarantee publicity/privacy or other permissions. The MIT code licence permits commercial use with notice retention. These support **conditional component use**, not an unrestricted licence for every generated utterance, stock voice identity or other Kalki-related intellectual property. Nothing here clears movie dialogue, footage, actor imitation, music or unrelated game assets. [CC BY terms and limits](https://creativecommons.org/licenses/by/4.0/).

No separate generated-audio commercial licence or speaker release was found in inspected evidence. Absence is an unresolved clearance question, not proof of a prohibition or proof that a specific release is legally mandatory in every jurisdiction. Rights-holder clarification or an appropriately documented distribution decision remains needed before approved game packaging. Do not mark assets VERIFIED merely because technical synthesis succeeded.

## Attribution preparation

Reuse the full conservative credit block and full notice list in [5G.7 attribution preparation](phase6-milestone5G7-license-attribution.md); it is not an approval certificate. Credit the exact Indic Tiny model/author/revision and Rasa, link CC BY4.0, preserve applicable notices and identify changes. Rasa citation: Praveen Srinivasa Varadhan, Ashwin Sankar, Giri Raju and Mitesh M. Khapra, *Rasa: Building Expressive Speech Synthesis Systems for Indian Languages in Low-resource Settings*, INTERSPEECH2024. Credit Vocos/Charactr and relevant code dependencies if shipped. Do not imply endorsement.

**Update needed if future notices are approved:** the older5G.7 block lists only speeds0.92/1.00/1.08; current5H.7 evaluation additionally used0.96/1.04/1.12 and per-sentence pause adjustments. Record those actual synthesis settings and original project text; model weights were not modified. This is a planning correction, not an edit to the old notice.

For **WAV-only distribution**, distinguish conservative provenance credits from licence obligations actually applicable to that output; software licences do not automatically govern generated content. For **model/runtime redistribution**, include complete relevant CC/MIT/frontend and dependency notices and verify weight/data terms. Recommended plan is approved prerecorded WAVs only, never a Python TTS stack or training corpus in the browser build. Neither distribution option is approved by this audit.

## Remaining rights blockers

- Resolve output/voice-use scope and any applicable speaker/personality conditions; preserve written evidence rather than inventing consent.
- Establish the exact relevant Telugu subset provenance and any gated terms still applicable; mixed-dataset metadata alone is insufficient.
- Approve a shipping asset list, exact hashes, text provenance and distribution format; retain original unapproved assets blocked/excluded.
- Review current51 original drafts separately for language/content accuracy. Subjective pronunciation and emotional suitability remain UNVERIFIED; rights review cannot substitute for listening.

**No rights manifest, licence, audio, source or draft changed. Stop; no production clearance granted.**
