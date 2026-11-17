# Milestone 5H.2 — Indic Parler licence audit

15 November 2026. Candidate revision `660bc53c64ae83150613264111708a0465211237`.

## Model weights — publisher grant identified

**PASS — stated licence:** official model card explicitly states Apache-2.0; the public API agrees. This is model-specific evidence, separate from library licensing. The inspected repository file inventory contains no standalone LICENSE/NOTICE file. Gated access terms have not been accepted or fully inspected, so no claim of account access or unconditional clearance. [Official model licence statement](https://huggingface.co/ai4bharat/indic-parler-tts).

## Inference code — verified separately

**PASS — code licence:** the official Hugging Face Parler inference repository publishes the Apache License 2.0 text. Commercial reproduction/distribution is supported subject to its conditions: supply the licence, preserve applicable notices, identify modifications and retain any relevant NOTICE contents. This does not grant trademarks or unrelated speaker rights. [Actual code licence](https://raw.githubusercontent.com/huggingface/parler-tts/main/LICENSE).

The inspected library version is 0.2.2; no code package installed or copied into production. Dependency licences, including audio codec and audiotools components, must be inventoried before shipping a runtime. The root library licence does not replace their notices. Dependency compatibility is assessed separately in the feasibility report.

## Training data — unresolved conditions remain

The model card names **GLOBE, IndicTTS, LIMMITS and Rasa**. It labels the latter three CC-BY-4.0 and abbreviates GLOBE's entry as `CC V1`. That abbreviation cannot be safely expanded into CC0 or another grant. A downstream training table is not a substitute for original release terms. [Training disclosure](https://huggingface.co/ai4bharat/indic-parler-tts).

- **Rasa — PASS for public statement:** official AI4Bharat dataset card independently lists CC-BY-4.0 and its citation. Gated conditions and individual releases were not inspected. [Dataset](https://huggingface.co/datasets/ai4bharat/Rasa).
- **IndicTTS — UNVERIFIED original conditions:** direct original IITM licence PDF fetch timed out again; alternate original path was unavailable. Do not assert that the licence prohibits commercial use, or that the downstream CC-BY label clears everything. [Original licence location](https://www.iitm.ac.in/donlab/indictts/downloads/license.pdf).
- **LIMMITS — UNVERIFIED release terms:** its official challenge identifies the dataset; linked IISc dataset endpoint returned 502. No original licence document confirmed in this pass. [Official source](https://sites.google.com/view/limmits24/), [dataset endpoint](https://ee.iisc.ac.in/limmitsdataset/).
- **GLOBE annotated — UNVERIFIED:** retrieved public page lacks an explicit identifiable licence grant. Need original provenance, recording sources and any separate annotation permissions reconciled. [Dataset](https://huggingface.co/datasets/ai4b-hf/GLOBE-annotated).

No datasets downloaded, no access gate accepted and no speaker contracts invented. Documentation retrieval failures establish missing evidence, not infringement. Dataset terms do not automatically attach identically to raw recordings, trained weights and new synthesized WAVs; the intended distribution must be assessed specifically.

## Commercial game distribution assessment

**CONDITIONAL / UNVERIFIED overall.** Published Apache model/code permissions support commercial use in principle. This investigation cannot certify complete access/data/output provenance or any separate personality rights. Do not equate the open-source library licence with clearance for every weight, training recording or speaker identity.

For future **WAV-only distribution**, record the selected speaker's permitted use, exact generation/source-text provenance and any applicable output conditions. Do not automatically treat WAV output as Apache-licensed merely because the inference code is Apache.

For future **model/runtime distribution**, additionally retain the full model/code/dependency licence set, applicable NOTICE files and change records. Do not accept gates on the user's behalf or silently alter the current rights manifest.

## Attribution package to prepare before distribution

1. Model identification: AI4Bharat / Hugging Face, **Indic Parler-TTS**, exact revision and official URL; retain the Apache-2.0 licence statement and gate terms applicable to that snapshot.
2. Code identification: **Parler-TTS**, Hugging Face, chosen code commit/version, full Apache-2.0 text and relevant notices if code is distributed.
3. Scholarly credits requested by the model card: the **Rasmalai (INTERSPEECH 2025)** work and original **Natural language guidance of high-fidelity text-to-speech with synthetic annotations** work. Record full citations from the pinned release before publishing; scholarly citation is distinct from contractual attribution.
4. Dataset attribution: fulfil verified release-specific attribution, licence links, notices and change descriptions for actual relevant materials. Rasa's credit is known; GLOBE/IndicTTS/LIMMITS remain unresolved. No complete “all rights cleared” attribution notice can honestly be finalized yet.
5. Codec/tokenizer/dependency notices where distributed; do not assume the top-level Apache file covers them.

**Licence audit result:** model/code grants identified; complete commercial release clearance **UNVERIFIED**. Resolve these questions before approving acquisition or production use.
