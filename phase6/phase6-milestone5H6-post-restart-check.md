# Milestone 5H.6 — Post-restart pre-installation check

**Decision: NO-GO. Available physical RAM fails the existing 1 GiB start gate. Stop before downloading or installing.**

Measured 15 November 2026 at **02:31:58 +05:30**. Read-only resource check; this report is the only file created. No synthesis, installation, download, environment modification or process termination occurred.

## Resource gates

- **Available physical RAM:** 516,120,576 bytes, approximately **492.2 MiB / 0.481 GiB**.
- **Total OS-visible physical RAM:** 7,883,304,960 bytes, approximately **7.34 GiB**. This is Windows-visible memory, not a new DIMM-capacity audit.
- Required available RAM: **1,073,741,824 bytes / 1 GiB**. Shortfall **557,621,248 bytes / 531.8 MiB**. **FAIL.** GPU VRAM does not substitute for system RAM.
- **C: free:** 17,863,389,184 bytes, approximately **16.64 GiB**. Capacity: 510,881,951,744 bytes, approximately **475.79 GiB**.
- Existing storage reserve: **10 GiB retained**, with up to **2 GiB acquisition/install cap**. Free space exceeds the reserve by about **6.64 GiB**; even the full planned cap would leave about **14.64 GiB**. **PASS for planned storage budget**, not a measured installation size.
- Windows reports last boot **15 November 2026 at 00:02:23.5 +05:30**, approximately 2h29m before this reading. This is the reported uptime baseline; the check cannot certify that a more recent restart occurred.

The earlier final check reported about777 MiB available. This snapshot is lower, not evidence that restarting recovered sufficient headroom. RAM fluctuates; no repeated polling or resource recovery was attempted.

## GPU availability

- **NVIDIA GeForce GTX 1650:** Windows status OK; NVIDIA driver **592.82** (Windows driver32.0.15.9282).
- `nvidia-smi`: **4096 MiB total, 3935 MiB free, 0 MiB used**, utilization0%. These are the tool's reported fields; free+used does not equal total, and the remainder must not be described as available allocation headroom.
- **AMD Radeon(TM) Graphics:** Windows status OK; driver31.0.21914.5002. Dedicated/available AMD memory was not measured by these queries.
- The proposed Ninada evaluation remains **CPU-only**. Adapter availability does not prove CUDA/runtime compatibility or neural inference success; none was tested.

## Largest observed process working sets

Snapshot from host `Get-Process`, ordered by working set; rounded MiB. No process was stopped or modified.

- Memory Compression — PID3720: **1342.4 MiB**.
- cloudcode_cli — PID3732: **1120.6 MiB**.
- chrome — PID23336: **384.7 MiB**.
- ChatGPT — PID7128: **144.8 MiB**.
- Grammarly.Desktop — PID17212: **134.5 MiB**.
- MsMpEng — PID7684: **122.8 MiB**.
- pwsh — PID16112: **100.8 MiB**.
- codex — PID21100: **89.0 MiB**.
- git — PID27440: **86.6 MiB**.
- chrome — PID14272: **82.0 MiB**.
- Code — PID12172: **72.3 MiB**.
- msedgewebview2 — PID19404: **70.9 MiB**.

Working sets may include shared pages; these are not additive unique memory or guaranteed reclaimable amounts. Memory Compression and Defender are OS/security-managed and were left untouched. Process names alone do not establish what can safely be closed.

## Pinned model/runtime reconfirmation

Reconciled the existing5H.5 plan and5H.6 gate/final-resource/recovery reports. They agree on the following pins. **No fresh remote metadata retrieval or model/source acquisition was performed in this check**, because the resource gate fails. The values below are existing recorded expected identities, not hashes of locally installed Ninada artifacts.

- Model: **Ninada v5.1.2**, repository `gnumanth/ninada`, pinned revision `25143ee2842dd7bd9e2955b94797d43590ca676e`.
- Candidate: Telugu Studio male, `onnx/te.onnx`, **29,281,720 bytes**.
- Expected model LFS SHA-256: `c81240880ee02af0fcb584c68c670b3139f78688b33c09b8e459eced84381902`.
- Runtime: `hemanth/ninada`, commit `745b55633615cfacc636af81ac08450fd3ff35d3`, declared version5.1.2.
- Recorded runtime Git tree: `770372692b6b5924b60eb3e66a0e8e2267ddf3da`.
- Recorded Git blob identities: `pyproject.toml` → `a6f976a1eaf5169beb9d0b3533ba2db0466ad279`; `python/src/ninada/engine.py` → `e5678dfa279574c4bc6f6c016801e5785b401010`; `python/src/ninada/g2p.py` → `1cc30e4004568bd73ef621b636b7df817d61c934`.

Git commit/tree/blob identities above are SHA-1 object IDs, not downloaded-file SHA-256 values. Existing reports record an unsigned commit. Wheel hash lock and local payload verification remain future authorized-acquisition gates. Licensing/provenance and commercial-use limitations remain as documented in5H.4/5H.5; no production voice clearance is granted here.

## Isolation and rollback

- Existing evidence directory: `C:\Users\Hp\Downloads\kalki 2898AD\phase6\ninada-evaluation\`. Present; no reparse-point attribute on this directory.
- Reserved future evaluation root: `C:\Users\Hp\Downloads\kalki 2898AD\phase6\ninada-evaluation\isolated-5h5\`. **Absent**, consistent with no installation. No venv, runtime or model was created here.
- [Installation plan](phase6-milestone5H5-installation-plan.md) and [rollback plan](phase6-milestone5H5-rollback-plan.md) remain present/readable.
- Current rollback-plan SHA-256: `93c573a2fb376ca9236849b5e7fc62c605751c11bb812e5b29bdbff0756d1db6`, matching the previously recorded value.
- The plan confines future work to the isolated root, disallows global package changes and persistent PATH changes, redirects caches/temp, and stops only owned workers on failure. Default rollback is to stop using that root and preserve evidence; deletion needs separate approval. No rollback action was necessary or executed.

## Measurement limitations and preservation

Initial sandbox CIM queries were denied and process enumeration exposed only sandbox processes. Those unavailable readings (including derived zero RAM fields) were **discarded**, not treated as real hardware values. The reported resource/process figures came from a successful read-only host query. No administrator settings, Windows services or hardware settings were changed.

No production files, existing audio, dialogue drafts, saves, packages or Python environments were modified. Personal save profiles were not opened. Existing reports were read, not overwritten. No fresh47-file/campaign/save integrity audit is claimed or needed to turn this failing resource gate into a pass. No server, background monitor or inference worker was launched.

## Final action

**NO-GO — stop.** At least1 GiB available physical RAM is required before a future passing preflight. This report does not authorize closing applications, downloading, installing or synthesizing. Any later acquisition/installation still requires explicit approval and the remaining verified-artifact/dependency checks. The machine is **not READY FOR EXPLICIT INSTALLATION APPROVAL** under the current gates.
