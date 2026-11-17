# Milestone 5H.6 — Final resource recheck

Checked 15 November 2026 at 02:29:17 +05:30. **NO-GO — RAM gate fails.**

Read-only recheck only. No process was terminated, no model/runtime payload or package was downloaded, no environment was created, and no inference or audio generation was run.

## Resource readings and gate comparison

- **Available physical RAM:** 795,324 KiB (about **777 MiB / 0.76 GiB**).
- **Total physical RAM:** 7,883,304,960 bytes (about **7.34 GiB**).
- **RAM gate:** minimum **1 GiB = 1,048,576 KiB** available. Current reading is **253,252 KiB (about 247 MiB) below** the gate. **FAIL.**
- **Free C: storage:** 17,829,584,896 bytes (about **16.60 GiB**).
- **Storage reserve:** minimum **10 GiB** free. Current reading is about **6.60 GiB above** the reserve. **PASS.**
- **GPU:** NVIDIA GeForce GTX 1650, **4096 MiB total / 3935 MiB free**, driver 592.82, reported utilization 0%. The evaluation plan is CPU-only; GPU memory does not satisfy the system-RAM requirement.
- CPU: AMD Ryzen 5 5600H with Radeon Graphics.

## Observed top working sets

Read-only `Get-Process` snapshot, rounded MiB:

| Process name | Working set |
|---|---:|
| Memory Compression | 636 MiB |
| cloudcode_cli | 610 MiB |
| Code | 252 MiB |
| MsMpEng | 136 MiB |
| node | 123 MiB |
| copilot-runtime | 111 MiB |
| ChatGPT | 104 MiB |
| Code | 102 MiB |
| pwsh | 85 MiB |
| powershell | 84 MiB |

This is a point-in-time working-set snapshot, not an attribution of reclaimable memory; shared pages can make these values non-additive. Memory Compression and MsMpEng are OS/security-managed processes and were not touched. No process was stopped or modified.

## Pinned Ninada identifiers and hashes

Official metadata was rechecked; no model or runtime file bytes were retrieved:

- **Model:** Ninada v5.1.2, Hugging Face `gnumanth/ninada`, revision `25143ee2842dd7bd9e2955b94797d43590ca676e`. Telugu Studio male artifact `onnx/te.onnx`, **29,281,720 bytes**. Expected LFS **SHA-256:** `c81240880ee02af0fcb584c68c670b3139f78688b33c09b8e459eced84381902`.
- **Runtime:** `hemanth/ninada`, pinned Git commit **`745b55633615cfacc636af81ac08450fd3ff35d3`** (Git SHA-1 commit ID); declared package version **5.1.2**. GitHub reports the commit is unsigned. Pinned Git blob IDs (SHA-1): `pyproject.toml` **`a6f976a1eaf5169beb9d0b3533ba2db0466ad279`** and `python/src/ninada/engine.py` **`e5678dfa279574c4bc6f6c016801e5785b401010`**. These are source identity pins, not SHA-256 hashes of locally downloaded bytes.

Sources: [pinned model metadata](https://huggingface.co/gnumanth/ninada/tree/25143ee2842dd7bd9e2955b94797d43590ca676e), [pinned runtime commit](https://github.com/hemanth/ninada/commit/745b55633615cfacc636af81ac08450fd3ff35d3), and [pinned runtime tree metadata](https://api.github.com/repos/hemanth/ninada/git/trees/745b55633615cfacc636af81ac08450fd3ff35d3?recursive=1).

## Isolation and rollback preservation

- Reserved isolated evaluation directory `phase6/ninada-evaluation/isolated-5h5/` remains **absent**, consistent with the earlier no-install checks. No virtual environment was created.
- Existing rollback plan `phase6-milestone5H5-rollback-plan.md` is present and readable (**2,868 bytes**). Its current SHA-256 is **`93C573A2FB376CA9236849B5E7FC62C605751C11BB812E5B29BDBFF0756D1DB6`**. It was read only and not modified in this recheck.
- Production files, existing WAVs, dialogue drafts, personal saves, packages, and existing Python environments were not accessed for modification.

## Decision

**NO-GO.** Storage passes, but available RAM is below the required 1 GiB threshold. Preserve the current setup and stop here. Recheck only after any user-directed resource recovery; no installation or inference may proceed without a fresh passing check and the user's explicit approval.
