# Milestone 5H.1 — Expressive local Telugu alternatives

15 November 2026. Primary-source research only; no models downloaded, packages installed or audio generated. “Commercially usable” is assessed separately for code, weights and data; no unconditional production clearance is asserted.

## Current Indic Tiny Telugu — retain neutral baseline

The installed snapshot's acoustic graphs are CC-BY-4.0; inference code/Vocos weights are documented as MIT. Rasa and LibriTTS are publicly CC-BY-4.0; frontend IndicXlit/CMU notices remain separately relevant. Existing 5G.7 attribution findings and individual-release limitations stand. Its CPU path already ran locally; this milestone did not rerun inference.

Released settings provide read delivery and speed, with no verified emotional API. Useful for low-resource neutral prototypes; not an established energetic/urgent/cinematic solution. See the voice-direction report for exact local files and the distinction between style constants and exposed configuration.

## First expressive research candidate: AI4Bharat Indic Parler-TTS

**Capability:** local PyTorch CPU/CUDA inference; Telugu speaker entries Prakash, Lalitha and Kiran. Descriptive controls cover expressivity, pitch and speaking rate. Same named speaker with different descriptions is the relevant approach; gender and identity must not be inferred from names. Specific urgent/authoritative/cinematic success is untested. [Official model card](https://huggingface.co/ai4bharat/indic-parler-tts).

**Weights:** Apache-2.0 label; gated access conditions not accepted. Published checkpoint approximately **3.75 GB**, excluding dependencies. **Code:** Parler library Apache-2.0. [Files](https://huggingface.co/ai4bharat/indic-parler-tts/tree/main), [code licence](https://github.com/huggingface/parler-tts/blob/main/LICENSE).

**Data:** card lists GLOBE, IndicTTS, LIMMITS and Rasa. Its abbreviated GLOBE licence notation is ambiguous; upstream terms require reconciliation. Commercial model/code licensing does not independently clear every source dataset or speaker.

**Practical assessment:** preferred expressive-control investigation, **conditional on licence/access and hardware checks**. No Windows/Python compatibility, latency, Telugu quality or GTX 1650 fit measured. A 3.75-GB file is not a 3.75-GB total inference footprint; the known 4-GB GPU/8-GB system is constrained. Do not promise real-time use or recommend downloading yet.

## Reference-driven alternative: AI4Bharat IndicF5

**Capability:** local Telugu-capable model, about 0.4B parameters; official use takes reference audio plus transcript. Expressive reference conditioning is a possible direction, not a verified stock male emotional selector. Terms require permission to clone the referenced voice. **No approved reference or stock-male entitlement was established.** [Official card and terms](https://huggingface.co/ai4bharat/IndicF5).

**Weights:** card labels MIT. **Code:** inspected repository documents local inference, but requested root `LICENSE` URL returned 404; do not infer a code-wide grant solely from the weight label. Underlying implementation/vocoder licences require verification. [Official repository](https://github.com/AI4Bharat/IndicF5).

**Data:** Rasa, IndicTTS, LIMMITS and IndicVoices-R are named; release-specific conditions remain separate. **Decision:** not the next prototype: reference permissions and complete code/data provenance unresolved. No movie/actor input permitted. No Windows compatibility, memory footprint or model performance tested. A model download or supplied demo recording would not resolve rights.

## Watchlist: Bodhan AI Indic-Speak

**Capability:** Telugu and named library speakers; emotion-label/descriptive style input, but publisher explicitly calls style control inconsistent preview-quality. No voice cloning; library-only. Current card references both `indic-speak` and a preview-v2 loading example, so resolve exact checkpoint before any future test. [Official card](https://huggingface.co/bodhan-ai/indic-speak).

**Weights/code:** custom Indic Open Model licence, not Apache/MIT. Summary allows commercial self-hosted products with conditions; linked full licence returned 401, so complete code/weight terms are not independently verified. Upstream Llama, SNAC and fine-tuned Vocos obligations are additional.

**Data:** publisher asserts contracted/consenting speakers, but no contracts or full dataset licence inventory independently inspected. **Hardware:** card describes a 3.78B-parameter BF16 LM; weights alone are roughly 7.56 GB by arithmetic, excluding decoder/runtime. Unsuitable to recommend on this laptop without further footprint work; no quantized compatibility assumed. **Decision:** research watchlist, not an approved commercial or local-fit candidate.

## Dataset checks separate from model labels

- **Rasa:** existing official-card CC-BY-4.0/citation findings preserved; individual releases/gated conditions not independently inspected.
- **IndicVoices-R:** official dataset card states CC-BY-4.0. This is a dataset statement, not a voice-specific output licence. [Dataset](https://huggingface.co/datasets/ai4bharat/indicvoices_r).
- **IndicTTS:** original IITM licence PDF could not be fetched in this pass. Do not replace the actual EULA with a downstream table's CC-BY description. [Original licence location](https://www.iitm.ac.in/donlab/indictts/downloads/license.pdf).
- **LIMMITS:** official site identifies the corpus, but linked dataset host returned 502. Release-specific commercial terms remain unverified. [Official challenge](https://sites.google.com/view/limmits24/).
- **GLOBE annotated:** public dataset page did not expose a clear licence in retrieved text. No assumption that an abbreviated model-card entry means CC0 or unrestricted commercial use. [Dataset](https://huggingface.co/datasets/ai4b-hf/GLOBE-annotated).

A failed documentation fetch is not evidence of a restrictive licence; it means permission cannot be confirmed from this investigation. Dataset obligations do not automatically attach identically to generated WAVs, models and raw recordings; document the actual intended distribution and applicable grant.

## Recommendation

Keep **one identity** and the existing neutral prototype. Investigate **Indic Parler's licence/access conditions first**, because its documented controls most directly match the desired direction without needing actor reference audio. No alternative in this pass is both fully commercially cleared and demonstrated to deliver the required emotions on this machine. Do not select a production voice, download or test another model until separately approved.
