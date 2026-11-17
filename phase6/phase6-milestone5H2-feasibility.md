# Milestone 5H.2 — Indic Parler local feasibility

15 November 2026. **NO-GO for installation/synthesis in the current environment.** This is not a finding that the model is intrinsically unusable.

## Exact candidate

The 5H.1 recommendation refers to **`ai4bharat/indic-parler-tts`**, the fine-tuned Indic Parler release, **not** `indic-parler-tts-pretrained`, a community quantization or Indic-Speak. Current public API revision: **`660bc53c64ae83150613264111708a0465211237`**, last modified 6 October 2026. No numbered model release was established; use this commit to identify the reviewed snapshot. API metadata reports **937,803,241 F32 parameters**, and automatic gated access. No gate accepted. [Official model](https://huggingface.co/ai4bharat/indic-parler-tts), [revision metadata](https://huggingface.co/api/models/ai4bharat/indic-parler-tts).

**Documentation-confirmed:** Telugu support and descriptive control of expressivity, pitch and speaking rate; named Telugu speaker entries include Prakash, Lalitha and Kiran. This supports an expressive research direction, not a guarantee of urgent, authoritative or cinematic Telugu delivery, male identity or consistent character performance. No voice selected or auditioned.

## Current machine — measured

- Windows 11 Home Single Language, `10.0.26300`.
- AMD Ryzen 5 5600H with Radeon Graphics.
- Installed RAM **8 GiB**; Windows-visible memory **7,698,540 KiB**, approximately 7.34 GiB. Available RAM varied **875,036,672 bytes (~0.815 GiB)** to **1,129,024 KiB (~1.077 GiB)** across checks. Do not treat installed RAM as inference headroom.
- GTX 1650, **4096 MiB total / 3935 MiB free**, driver **592.82** at inspection.
- PyTorch **2.11.0+cu128**, bundled CUDA **12.8**: `cuda.is_available()` true; device capability **7.5**; build architecture list includes **sm_75**. CUDA discovery passed, but no model/kernel benchmark or reduced-precision inference was performed.
- C: free **25,398,046,720 bytes (~23.65 GiB)**. Storage is not the current primary blocker.
- Active `python`: **3.13.4**. Launcher now lists Python **3.12, 3.13 and 3.14**; this current observation supersedes older launcher inventories. No environment changed. Installed Transformers **5.17.0**, ONNX Runtime **1.30.0**, Parler library absent.

## Compatibility and resource assessment

**Confirmed dependency mismatch:** reviewed upstream `parler_tts` identifies itself as **0.2.2**, and `setup.py` pins **Transformers exactly 4.46.1**. The current installed 5.17.0 does not satisfy it. Additional dependencies include SentencePiece, Descript audio codec/audiotools and protobuf. Do not downgrade the working global environment. A separately approved isolated Python 3.12 environment is a candidate for compatibility evaluation, not an already-tested solution. [Upstream setup](https://raw.githubusercontent.com/huggingface/parler-tts/main/setup.py), [version source](https://raw.githubusercontent.com/huggingface/parler-tts/main/parler_tts/__init__.py).

**CPU memory — NO-GO currently:** parameter arithmetic gives **3,751,212,964 bytes (~3.49 GiB)** for F32 weights alone, before load-time copies, tokenizer/text encoder/runtime allocations, audio buffers and OS demand. Current free RAM is below that lower bound. Paging could make a run appear to work while causing severe delays. No speed estimate in seconds is justified without testing.

**GPU — possible future experiment, not verified fit:** half-precision parameter arithmetic is **1,875,606,482 bytes (~1.75 GiB)**. That is a theoretical weight size, not an available downloaded FP16 checkpoint, measured VRAM requirement or guarantee of safe conversion/loading. Activations, caches, codec, text processing and loading can exceed remaining headroom. CPU RAM and dependency blockers still apply. No quantization/offload/architecture rewrite is proposed or assumed supported.

**Disk — adequate for planning:** published F32 weight file is about 3.75 GB, plus tokenizers and dependencies. [Official file listing](https://huggingface.co/ai4bharat/indic-parler-tts/tree/main). Avoid duplicate caches/checkpoints; preserve at least 10 GiB testing headroom as a proposed safeguard. Exact install/cache footprint has not been measured; no packages downloaded.

## Comparison with the existing Indic Tiny baseline

- **Telugu:** both documented; Tiny already produced five local project samples, whereas Parler has not been tested here.
- **Expressivity:** Tiny release uses read style/speed without a verified emotion selector. Parler has relevant description controls, but actual Bhairava delivery remains unverified.
- **Consistency:** Tiny uses fixed `te_M`; five valid WAVs do not prove perceived identity. A fixed named Parler speaker is a testable strategy, not a consistency guarantee under style changes.
- **Speed:** historical Tiny 5G.8 synthesis took **0.2455–0.3869 s** for **4.0007–7.4253 s** clips on CPU. No matched Parler measurement exists. Its much larger autoregressive workload is expected to be more demanding; no numerical speed ratio or real-time claim.
- **Resources:** Tiny's three downloaded ONNX graphs total **91,011,543 bytes**; 5G.6 sampled worker RSS was roughly **199 MiB**, with a later self-reading around 203 MiB. These measurements are not directly comparable with Parler's theoretical weight lower bounds.
- **Licensing:** Tiny has explicit component licences and prepared attribution, with separate output/personality-rights limits. Parler's commercial model/code permissions are documented, but data/access provenance remains incomplete. Neither is automatically an approved game voice.

## Conditions for reconsidering GO

Resolve gated terms and data/attribution questions first; obtain separate approval for a pinned isolated environment and bounded download. Establish substantially greater available RAM than the weight-only lower bound and an explicit memory/time limit; recheck disk/VRAM immediately before any run. Use short batch-one offline generation with the game closed, never live synthesis integrated into gameplay. Validate dependency resolution and same-speaker Telugu style behavior before broader work.

**Final decision: NO-GO now.** Preserve Tiny and existing samples; no installation, download or synthesis authorized by this report.
