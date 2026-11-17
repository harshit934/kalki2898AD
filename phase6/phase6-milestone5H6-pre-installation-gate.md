# Milestone 5H.6 — Pre-installation gate

15 November 2026. **STOP — installation and evaluation not authorized.**

This report records the requested pre-installation checks only. No model, source code, package, or other payload was downloaded. No environment was created, no package installed, and no speech generated.

## Gate result

The required start threshold is at least 1 GiB of available system RAM. The live check found **835,140 KiB (about 816 MiB / 0.80 GiB)** available, below that threshold. Per the Milestone 5H.5 safety plan, do not start an inference run or extended test. Do not close applications automatically. Recheck resources later; proceed only if every prerequisite passes and the user explicitly approves.

Other live resource readings:

- System-reported physical memory: **7,883,304,960 bytes**.
- C: free space: **17,830,424,576 bytes (about 16.60 GiB)**, above the 10 GiB reserve.
- NVIDIA GeForce GTX 1650: **4096 MiB total, 3935 MiB free**, driver **592.82**, reported GPU utilization **0%**. The proposed evaluation remains CPU-only; no VRAM requirement is inferred from this snapshot.
- CPU: AMD Ryzen 5 5600H with Radeon Graphics.

## Pinned candidate and source verification

- Model: Ninada **v5.1.2**, official Hugging Face repository `gnumanth/ninada`, revision `25143ee2842dd7bd9e2955b94797d43590ca676e`.
- Candidate: Telugu Studio model `onnx/te.onnx` (male specialist), **29,281,720 bytes**. The pinned Hugging Face tree metadata declares LFS SHA-256 **`c81240880ee02af0fcb584c68c670b3139f78688b33c09b8e459eced84381902`**. This is an expected pre-download integrity value, not a hash computed from local bytes.
- Runtime: official `hemanth/ninada` source at commit `745b55633615cfacc636af81ac08450fd3ff35d3`; the pinned `pyproject.toml` declares version **5.1.2**, Python `>=3.10`, and neural extras `onnxruntime>=1.18.0`, `numpy>=1.24.0`, and `soundfile>=0.12.1`. Its pinned root licence is MIT.
- The candidate model metadata and README identify the weights as **CC-BY-4.0**. Model and runtime identities/version declarations were checked against their official pinned metadata/source. No model or runtime payload was fetched.
- Relevant official sources: [pinned model metadata](https://huggingface.co/gnumanth/ninada/tree/25143ee2842dd7bd9e2955b94797d43590ca676e), [pinned runtime source](https://github.com/hemanth/ninada/tree/745b55633615cfacc636af81ac08450fd3ff35d3), [pinned runtime declaration](https://github.com/hemanth/ninada/blob/745b55633615cfacc636af81ac08450fd3ff35d3/pyproject.toml), and [pinned runtime licence](https://github.com/hemanth/ninada/blob/745b55633615cfacc636af81ac08450fd3ff35d3/LICENSE).

## License and usage boundary

The model publisher declares CC-BY-4.0 for the weights and identifies AI4Bharat Rasa and IISc SYSPIN among the training/initialization sources. The official IISc SYSPIN page describes its corpus as CC-BY-4.0, but its linked terms page did not expose usable terms text during this check; the exact applicable initialization release and full provenance conditions remain unresolved. The Rasa card request was unavailable to this check (HTTP 401). The Milestone 5H.4 audit likewise records the commercial-clearance question as conditional.

Any later test must therefore be labeled **evaluation-only**. This is not commercial clearance or approval to ship the model, runtime, or generated voice/audio.

## Isolation and baseline checks

- Reserved directory `phase6/ninada-evaluation/isolated-5h5/` does **not** exist.
- The active interpreter remains `C:\Python313\python.exe`, Python **3.13.4**. Existing system-installed versions observed read-only: NumPy **2.3.4**, ONNX Runtime **1.30.0**, psutil **7.2.2**, setuptools **78.1.0**, huggingface-hub **1.31.0**, SciPy **1.17.1**. Ninada, soundfile, and wheel were not installed there.
- `PYTHONPATH` was empty at the check. No test virtual environment was created and no changes were made to the existing Python environment.
- The 5G.8 inventory contains the five planned dialogue IDs: **BH6-5E-002, BH6-5E-004, BH6-5E-013, BH6-5E-037, BH6-5E-045**. Tiny timings and hashes remain in the original inventory; its audio was not changed or regenerated.

## Decision and next step

**STOP at the RAM prerequisite.** No installation approval was requested or assumed. Resume only after a fresh check reports at least 1 GiB available RAM, disk/resource and isolation prerequisites still pass, remaining dependency/wheel integrity checks are completed without unverified substitutions, and the user explicitly approves acquisition and installation. If RAM remains below the threshold, do not install or run inference.

Because no inference ran, there are no Ninada load/generation timings, memory or utilization measurements, neural-only verification, WAV validation, stability results, or controlled audio comparison. No conclusion about audio quality or relative performance is supported.
