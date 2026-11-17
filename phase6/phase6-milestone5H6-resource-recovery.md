# Milestone 5H.6 — Recovery and resource recheck

Checked 15 November 2026 at 02:26:29 +05:30. **STOP — do not download or install Ninada.**

This is a read-only recovery report. No process was terminated, no package or model was downloaded, no environment was created, and no audio was generated.

## Current resource snapshot

- Available physical RAM: **982,640 KiB (about 960 MiB / 0.94 GiB)**. The safety gate requires at least **1 GiB (1,048,576 KiB)**, so this snapshot is still about **64 MiB below** the minimum. The previous check recorded 835,140 KiB; availability has improved, but remains insufficient and can fluctuate.
- System-reported physical memory: **7,883,304,960 bytes**.
- C: free space: **17,830,305,792 bytes (about 16.60 GiB)**, above the 10 GiB reserve.
- NVIDIA GeForce GTX 1650: **4096 MiB total, 3935 MiB free**, driver **592.82**, reported GPU utilization **0%**. The planned inference is CPU-only; VRAM does not satisfy the system-RAM gate.
- Reserved evaluation root `phase6/ninada-evaluation/isolated-5h5/`: **not present**.

## Observed memory pressure and safe recovery

The read-only process snapshot showed these larger working sets:

- Windows **Memory Compression**: about **826 MiB**. This is OS-managed memory compression, not a process to kill or disable as a recovery shortcut.
- `cloudcode_cli`: about **550 MiB**.
- `Code` (multiple processes): about **346 MiB** for the largest listed process.
- `copilot-runtime`: about **220 MiB**.
- `MsMpEng` (Microsoft Defender): about **185 MiB**.
- `chrome`: about **107 MiB** for the largest listed process.

These are point-in-time per-process working sets; they can include shared pages and must not be added together as an exact RAM total. The snapshot suggests memory pressure across the OS and active development/browser workloads, but does not establish that any particular application is safe to close.

Safe options, only if you choose them:

1. Save work, then close unused browser tabs/windows and applications through their normal UI.
2. Save work and close redundant editor windows or idle development sessions through the editor; let active builds, downloads, or other work finish first.
3. Avoid starting other memory-heavy workloads while preparing for a future check.
4. If convenient, save everything and perform a normal Windows restart, then wait for startup activity to settle before rechecking.
5. Recheck RAM immediately before any separately authorized test. Because availability fluctuates, aim to have more than the bare 1 GiB threshold.

Do not terminate processes by PID, stop Memory Compression, disable Defender, or stop Windows services. Free disk space alone will not increase available RAM.

## Pinned model and runtime hash recheck

Official metadata was rechecked without retrieving the model or runtime payload:

- **Model:** Ninada v5.1.2, `gnumanth/ninada`, revision `25143ee2842dd7bd9e2955b94797d43590ca676e`; artifact `onnx/te.onnx` (Telugu Studio male), **29,281,720 bytes**. The pinned Hugging Face tree metadata again reports LFS SHA-256 **`c81240880ee02af0fcb584c68c670b3139f78688b33c09b8e459eced84381902`**.
- **Runtime:** `hemanth/ninada`, pinned Git commit **`745b55633615cfacc636af81ac08450fd3ff35d3`** (Git commit object ID, SHA-1 format). GitHub resolves this commit to tree `770372692b6b5924b60eb3e66a0e8e2267ddf3da`. The pinned tree metadata reports Git blob IDs: `pyproject.toml` **`a6f976a1eaf5169beb9d0b3533ba2db0466ad279`**, `python/src/ninada/engine.py` **`e5678dfa279574c4bc6f6c016801e5785b401010`**, and `python/src/ninada/g2p.py` **`1cc30e4004568bd73ef621b636b7df817d61c934`**. These are Git object IDs, not SHA-256 hashes of downloaded file bytes. GitHub reports the commit signature as **unsigned**.
- The runtime source pin remains version **5.1.2** according to the previously checked pinned `pyproject.toml`.

Sources: [pinned model tree metadata](https://huggingface.co/gnumanth/ninada/tree/25143ee2842dd7bd9e2955b94797d43590ca676e), [pinned runtime commit](https://github.com/hemanth/ninada/commit/745b55633615cfacc636af81ac08450fd3ff35d3), and [pinned runtime Git tree](https://api.github.com/repos/hemanth/ninada/git/trees/745b55633615cfacc636af81ac08450fd3ff35d3?recursive=1).

## Preservation and decision

Existing production, dialogue, audio, report, and environment files were not edited by this recheck. The existing Python environment was not changed; no new environment was created. Only this recovery report was added.

**Gate remains blocked.** Do not install or run inference. Stop here and wait for the user's approval after they decide whether to take any optional recovery action. A future resource recheck and explicit approval are both required before acquisition or installation.
