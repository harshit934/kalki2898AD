# Milestone 5H.4 — Ninada licence audit

15 November 2026. Model revision `25143ee2842dd7bd9e2955b94797d43590ca676e`; code commit `745b55633615cfacc636af81ac08450fd3ff35d3`.

## Separate grants

**Model weights — PASS for publisher statement.** Public model metadata and its attribution section state **CC-BY-4.0** for weights/corpora. This is separate evidence from the code's MIT licence. Telugu male artifact identity is established; no weight bytes downloaded or embedded notices inspected. [Official model](https://huggingface.co/gnumanth/ninada).

**Code — PASS.** Actual root licence was inspected at the pinned code revision: MIT, copyright 2026 Hemanth HM. Preserve the full copyright/permission/disclaimer when redistributing applicable code. Package metadata agrees. No implication that MIT covers neural weights or source recordings. [Pinned licence](https://github.com/hemanth/ninada/blob/745b55633615cfacc636af81ac08450fd3ff35d3/LICENSE).

**Telugu training source — PASS public licence; PARTIAL provenance.** Ninada attributes Indic-language specialists to **AI4Bharat Rasa** and initialization priors to **IISc SPIRE SYSPIN**. English-only sources do not automatically describe the Telugu specialist. Exact Telugu training subsets, initialization checkpoint chain and individual releases were not independently inspected.

- Official Rasa card independently states CC-BY-4.0 and requests its citation; gated dataset conditions were not accepted. [Rasa](https://huggingface.co/datasets/ai4bharat/Rasa).
- **New evidence relative to 5H.3:** IISc's official SYSPIN page independently states CC-BY-4.0 and identifies industrial development as an intended use. Thus the public dataset licence is better supported than a downstream model assertion alone. [IISc SYSPIN](https://vaani.iisc.ac.in/dataset/syspindataset).
- SYSPIN's indexed terms describe CC-BY together with additional access terms. Direct PDF retrieval failed and the linked web terms page returned no usable body, so the complete conditions and their applicability to the actual initialization release remain **UNVERIFIED**. No presumption that they prohibit commercial use. [Terms document](https://ee.iisc.ac.in/limmitsdataset/SYSPIN-Dataset-Terms.pdf).

**Dependencies — PARTIAL.** Runtime optional neural dependencies keep separate licences; package metadata alone is not a complete redistribution notice audit. Hugging Face download helpers, NumPy, ONNX Runtime and any optional ONNX/soundfile components must be included in the actual shipping inventory if redistributed. No dependency was installed or packaged.

## Commercial use and attribution

CC BY and MIT are permissive copyright grants supporting commercial uses subject to their conditions. CC BY requires appropriate credit, licence link and relevant change indications; separate privacy/publicity/moral rights may remain. Dataset raw clips, model weights, runtime code and generated WAVs are different distribution cases. Do not automatically stamp generated WAVs MIT/CC-BY solely because a component has that licence. [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).

**Commercial game distribution: CONDITIONAL, not fully cleared.** Resolve the actual initialization/source conditions and any applicable speaker/output restrictions before production approval. No evidence of a noncommercial-only prohibition was established, and no unconditional output grant or individual voice release was fabricated.

## Proposed attribution record — not a clearance certificate

For any future authorized use, record at minimum:

> Ninada v5.1.2 by Hemanth HM; Telugu male specialist from `gnumanth/ninada`, revision `25143ee2842dd7bd9e2955b94797d43590ca676e`. Model weights: Creative Commons Attribution 4.0 International, https://creativecommons.org/licenses/by/4.0/ . Runtime code: MIT, copyright 2026 Hemanth HM. Model source: https://huggingface.co/gnumanth/ninada ; code: https://github.com/hemanth/ninada .
>
> Training-source credit: AI4Bharat Rasa — Praveen Srinivasa Varadhan, Ashwin Sankar, Giri Raju and Mitesh M. Khapra, *Rasa: Building Expressive Speech Synthesis Systems for Indian Languages in Low-resource Settings*, INTERSPEECH 2024; https://huggingface.co/datasets/ai4bharat/Rasa . Initialization provenance identified by the publisher: IISc SPIRE SYSPIN, CC-BY-4.0; https://vaani.iisc.ac.in/dataset/syspindataset . Include the applicable SYSPIN release citation and notices once that initialization chain is confirmed. No endorsement implied.

Do not label this a final complete notice: exact SYSPIN release/citation and any additional terms still need confirmation. If later changing/converting weights or editing generated files, record those changes accurately. No model or voice has been generated or changed in this milestone, so no change notice implying otherwise is appropriate.

For model/runtime redistribution, retain full CC-BY and MIT texts plus applicable dependency notices. For WAV-only use, assess output-specific obligations and provenance separately. The existing game rights manifest remains unchanged.

**Licence conclusion: permissive grants documented; release-specific commercial clearance remains CONDITIONAL.**
