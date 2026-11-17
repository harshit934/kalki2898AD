# Milestone 5H.5 — Environment audit

15 November 2026. **Preparation only; readiness CONDITIONAL.**

Read the 5H.4 verification, licence audit and decision reports. This pass used local read-only inspection and the existing pinned-source findings; no network retrieval was needed.

## Current machine

- Windows 11 Home Single Language, version **10.0.26300**.
- CPU **AMD Ryzen 5 5600H with Radeon Graphics**.
- Installed RAM **8,589,934,592 bytes (8 GiB)**. Available at hardware check **965,560 KiB (~943 MiB)**. Availability fluctuates and is not an inference-memory requirement.
- C: free **25,413,398,528 bytes (~23.67 GiB)**.
- NVIDIA GTX 1650: **4096 MiB total, 3935 MiB free**, driver **592.82**. Proposed test is CPU-only; no GPU model load planned.
- Active `python` is **3.13.4**, `C:\Python313\python.exe`. Launcher lists Python 3.12, 3.13 and 3.14; its default is now 3.14. Therefore commands must use an explicit interpreter, not bare `py`.

## Dependencies observed in active Python

- NumPy **2.3.4**, ONNX Runtime **1.30.0**, psutil **7.2.2**, setuptools **78.1.0**.
- huggingface-hub **1.31.0**, SciPy **1.17.1**.
- Ninada, soundfile, onnx and wheel **not installed** in this environment.

Recorded in `phase6/ninada-evaluation/phase5h5-audit-evidence.json`. No packages upgraded, downgraded, installed or imported from Ninada. No virtual environment created.

## Exact candidate and matching runtime

- Model **Ninada v5.1.2**, `gnumanth/ninada@25143ee2842dd7bd9e2955b94797d43590ca676e`.
- Runtime **5.1.2**, `hemanth/ninada@745b55633615cfacc636af81ac08450fd3ff35d3`.
- Initial proposed artifact: **Studio Telugu male `onnx/te.onnx`, 29,281,720 bytes**. Mobile `onnx_mobile/te.onnx`, 22,737,098 bytes, is not part of this first plan. Avoid entire-model-repository downloads and automatic tier selection.

Official source identities and declarations were verified in 5H.4: [model](https://huggingface.co/gnumanth/ninada), [pinned runtime](https://github.com/hemanth/ninada/tree/745b55633615cfacc636af81ac08450fd3ff35d3), [runtime declaration](https://github.com/hemanth/ninada/blob/745b55633615cfacc636af81ac08450fd3ff35d3/pyproject.toml). These links identify prior evidence; they were not fetched again here.

Python **>=3.10** is declared; neural extras specify ONNX Runtime >=1.18.0, NumPy >=1.24.0 and soundfile >=0.12.1. Active Python and installed NumPy/ORT meet the declared bounds. Actual Windows graph/operator compatibility remains **UNVERIFIED**. A separate environment is a preservation choice, not evidence that Python 3.13 is unsupported. No global dependency downgrade is indicated.

## Risks and outstanding gates

1. Actual Ninada RSS/VRAM and generation speed cannot be measured without a model/run. No file-size-to-memory assumption.
2. Source can try automatic downloads and fall back to Klatt speech. A later test must explicitly reject both outcomes.
3. CPU session code clamps threads to at least four; Tiny historical tests used two. Preserve that difference in comparisons rather than changing Tiny or upstream code.
4. Proposed start gate is **at least 1 GiB available system RAM**, a conservative test policy, not a published minimum. The current snapshot falls below it. Recheck before any authorized run; do not close other applications automatically.
5. Permissive stated weight/code grants are documented; initialization/data conditions and output/personality rights are not fully cleared. No commercial shipping approval.

## Integrity

**357/357** recorded production/source/configuration files and **3/3** original dialogue-source files match baseline. **8/8** existing WAVs match recorded hashes. Personal saves were not accessed; no production, drafts, audio or existing reports changed. No fresh independent 47-file/14-copy/11-save audit claimed.
