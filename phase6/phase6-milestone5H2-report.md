# Milestone 5H.2 — Feasibility decision

15 November 2026. **NO-GO for installation or synthesis now.**

## Confirmed

- Exact model: `ai4bharat/indic-parler-tts@660bc53c64ae83150613264111708a0465211237`; 937,803,241 F32 parameters. Not the pretrained checkpoint or a community conversion.
- Official Telugu and expressive-control documentation confirmed. This is not tested emotional quality or a selected production speaker.
- Model and inference-code Apache-2.0 statements checked separately. Original data/access conditions remain incompletely verified; commercial release clearance is not established.
- Ryzen 5 5600H, 8-GiB installed RAM; currently only about **0.8–1.1 GiB available**.
- GTX 1650 4 GiB, approximately 3.84 GiB free; driver 592.82. Installed CUDA-enabled PyTorch detects capability 7.5 and includes sm_75. CUDA discovery is not an inference-fit test.
- Current active Python 3.13.4; launcher also lists 3.12 and 3.14. Parler not installed. Upstream requires Transformers **4.46.1**, incompatible with the installed **5.17.0** requirement-wise.
- C: approximately **23.65 GiB free**; storage alone does not block a planned acquisition.

## Why NO-GO

1. Current RAM headroom is below the model's roughly **3.49-GiB FP32 weight-only** lower bound. Do not rely on paging to make CPU inference practical.
2. GPU FP16 fit remains an untested possibility, not a guarantee; current dependencies and CPU loading headroom still block a safe run.
3. Installing upstream requirements into the current environment could disrupt working tools. No downgrade or package change authorized.
4. Dataset/access provenance and release attribution require resolution before a complete commercial suitability claim.

This does not reject Indic Parler permanently. The detailed feasibility report records conditions under which a separately approved, isolated short test could be reconsidered. Keep the measured, lightweight Indic Tiny baseline unchanged; neither voice is production-approved.

## Outputs and integrity

Created only:

- `phase6/phase6-milestone5H2-feasibility.md`
- `phase6/phase6-milestone5H2-license-audit.md`
- `phase6/phase6-milestone5H2-report.md`
- `phase6/phase6-milestone5H2-verification.json`

**357/357** recorded production/source/configuration hashes and **3/3** original dialogue-source hashes match. All **eight** existing original/tuned/5G.8 WAVs match their recorded hashes. Drafts and personal saves untouched; saves not accessed. No fresh independent 47-file/14-copy/11-save audit claimed.

Read-only public documentation/metadata and local hardware/dependency checks only. PyTorch CUDA enumeration ran without loading a model. No model download, dependency installation, synthesis, paid API, cloud inference, access-gate acceptance, environment edit or production change. No owned background process/server remains running. Build/lint unnecessary for research-only outputs.

**Stopped for review. Do not install or synthesize without separate approval.**
