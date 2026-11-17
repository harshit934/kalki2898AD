# Milestone 5H.3 — Lightweight Telugu alternatives

15 November 2026. **No lightweight candidate was established to satisfy all requirements, especially expressive Telugu delivery with a cleared, fixed male identity.** Two candidates are shortlisted below for different, limited purposes. No production selection.

## Evidence standard and hardware context

Exact revisions, links, dependencies, licences, attribution and memory qualifications for **seven candidates** are in the companion 21-column CSV. GO/CONDITIONAL are recommendations for separately approved prototype tests, not permission to install now or production approval. NO-GO means not selected for the next bounded test, not necessarily technically impossible forever.

The latest 5H.2 machine inspection remains the resource baseline: Ryzen 5 5600H, 8-GiB installed RAM, roughly 0.8–1.1 GiB available then, GTX 1650 4 GiB, active Python 3.13.4 and available 3.12/3.14. RAM availability changes. No repeated hardware probe or inference benchmark in this research pass.

**Minimum practical RAM/VRAM:** not published or independently measured for the new candidates. The CSV explicitly preserves UNKNOWN/NOT ESTABLISHED. Model-file size, parameter storage and browser compatibility are not process-memory minima. GPU memory is not needed for documented CPU paths; that does not imply zero system-RAM cost. Tiny's historical roughly 199–203 MiB worker readings are empirical observations, not a minimum machine specification.

## Ranked practical investigation order

This order filters for the actual laptop, fixed-voice requirement and permission evidence. It is **not a measured Telugu-quality leaderboard**.

### 1. Indic Tiny Telugu — GO, baseline only

Exact installed `te_M` snapshot remains the only locally generated technical baseline. Its eight existing WAVs are preserved; five project-line samples decoded correctly in earlier testing. No audible pronunciation score or expressive acting validation exists. Read style/speed does not establish energetic emotion. Existing CC-BY acoustic, MIT code/vocoder and separate dataset/frontend notices remain applicable. [Official model](https://huggingface.co/sulabhkatiyar/indic-tiny-tts-telugu).

**Shortlist purpose:** retain a consistent comparison baseline and text fallback. GO does not mean its emotional range is sufficient.

### 2. Ninada v5.1.2 Telugu male — CONDITIONAL

Pinned model `gnumanth/ninada@25143ee2842dd7bd9e2955b94797d43590ca676e`; male files `onnx_mobile/te.onnx` **22,737,098 bytes**, `onnx/te.onnx` **29,281,720 bytes**, excluding frontend. Public metadata identifies a fixed male specialist, not a reference-cloning workflow. Code is MIT; publisher states CC-BY weights/data, with Rasa Telugu and SYSPIN initialization provenance. Emotion control is not established. [Model](https://huggingface.co/gnumanth/ninada), [official runtime](https://github.com/hemanth/ninada).

**Shortlist condition:** reconcile initialization/attribution, exact model/runtime-version pairing and Windows CPU operator/frontend support first. Then, only after approval, one bounded offline comparison. Its small file is promising for resources, not proof of an expressive upgrade. Python package 5.0.0 and model 5.1.2 must not be assumed identical versions. [Package metadata](https://pypi.org/project/ninada/5.0.0/).

### 3. Mithi v1 Flash — NO-GO for next test

Use the publisher-linked **Oomni** repository rather than an author-account copy. It offers Satvik male, Telugu and CPU support; actual Apache licence text was inspected. Requirements fit newer Transformers in principle but add uninstalled frontend/audio packages. Publisher acknowledges flatter emotion and lacks published evaluation. Training-source and output permissions need separate review. [Official card](https://huggingface.co/Oomni/mithi-v1-flash).

It is a credible compact fallback to research later, but no evidence warrants another neutral-voice test ahead of the two shortlisted options. Licence labels for teacher/component models do not independently clear a synthetic training corpus. Do not assume eSpeak-related dependencies inherit Apache.

### 4. Piper Venkatesh medium — NO-GO for next test

Existing pinned package metadata from 5G.6 establishes Telugu ONNX plus an eSpeak frontend. It lacks demonstrated expressive controls here; selected voice/output grant and Windows runtime compatibility remain unresolved. Current Piper code GPL permits commercial use with compliance; it neither automatically prohibits commercial games nor independently licenses a voice. [Voice package](https://huggingface.co/rhasspy/piper-voices/tree/main/te/te_IN/venkatesh/medium), [current runtime](https://github.com/OHF-Voice/piper1-gpl).

### 5. Hima Nano Telugu ONNX — NO-GO

Prior pinned inspection identifies three male presets and CPU support, but no clear weight/code grant and no demonstrated emotional selector. Sampling or preset choice is not proof of controlled expression. Do not run it solely because the model is public and compact. [Official card](https://huggingface.co/Prahaladha/hima-tts-nano-te-ONNX). No new claim that its licence has changed since the preserved inspection.

### 6. Telugu Chatterbox fine-tune — NO-GO on this next lightweight test

Explicit Telugu adaptation and base expressive-conditioning potential make it relevant conceptually. It is much heavier and needs an authorized reference/fixed-stock identity. The derivative card states CC-BY for its fine-tune/data and MIT for unchanged base components. [Fine-tune](https://huggingface.co/shankarpandala/chatterbox-telugu).

Current upstream dependency pins conflict with the installed environment; exact fine-tune compatibility cannot be assumed from the latest base release. No global downgrade, arbitrary reference or actor input is acceptable. [Upstream requirements](https://github.com/resemble-ai/chatterbox/blob/master/pyproject.toml). FLEURS and IndicVoices-R public dataset cards independently state CC-BY; these do not grant permission to clone an unrelated speaker. [FLEURS](https://huggingface.co/datasets/google/fleurs), [IndicVoices-R](https://huggingface.co/datasets/ai4bharat/indicvoices_r).

### 7. Lyric Telugu V1 — NO-GO for this objective

One voice, Ahana, without a male preset established; read-aloud prosody and more-emotive delivery described as future work. Custom commercial conditions include revenue/service-use limits; no user eligibility or separate data clearance verified. Do not silently equate a fixed voice name with male identity. [Official model and conditions](https://huggingface.co/10X-Technologies/lyric-voice-v1-te).

## Ranking against the five requested criteria

1. **Telugu quality potential:** no defensible perceptual ordering. Tiny has project technical evidence; all alternatives have language claims or publisher results, not matched pronunciation tests. Mark pronunciation UNVERIFIED for all.
2. **Expressiveness:** reference-driven Chatterbox has a more relevant expressive mechanism, but fails this next-test resource/stock-reference gate. None of the compact fixed male candidates has demonstrated the required energetic performance. Mithi's stated limitation is negative evidence; unreported control in Ninada is an unknown, not superiority.
3. **Hardware feasibility:** Tiny is first by actual execution. Ninada is the leading new file-size/CPU lead. Other CPU candidates remain unmeasured; do not rank resident memory by file size. Chatterbox is a substantially heavier path.
4. **Commercial clarity:** Tiny has the most complete local component audit; Ninada/Mithi have promising stated grants with provenance/dependency gaps. Chatterbox has explicit derivative grants but unresolved reference and upstream obligations. Piper voice grant and Lyric conditions require resolution; Hima lacks an established grant. No universal commercial clearance issued.
5. **Voice consistency:** fixed Tiny/Ninada/Mithi/Piper presets and a single chosen Hima preset are structurally suitable strategies, not perceptual proof. Chatterbox needs a consistently authorized conditioning identity. Switching speakers to fake emotion is not recommended.

## Boundaries and next action

**At most two recommendations: Indic Tiny GO (retain baseline); Ninada CONDITIONAL (bounded future feasibility test only).** Neither is established as the final expressive Bhairava voice. First settle Ninada's attribution/runtime questions and an explicit resource budget; obtain separate approval before any acquisition or synthesis. Do not reopen the heavy Indic Parler path rejected under current conditions in 5H.2, or treat a quantized conversion as automatically compatible/licensed.

All research used public documentation/metadata only. No model/audio/package downloads, access-gate acceptance, installations, synthesis, paid APIs, cloud inference, package changes or production modifications.
