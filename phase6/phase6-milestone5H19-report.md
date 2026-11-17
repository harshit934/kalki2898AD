# Milestone5H.19 — Preparation report

15November2026. **Final decision: NO-GO for installation readiness.** Plan prepared; no download/installation/synthesis authorization implied.

## Completed preparation

- Read full5H18 feasibility report, supporting comparison and summary.
- Identified six exact proposed pins: SoundFile0.13.1, Misaki0.9.4, espeakng-loader0.2.4, phonemizer-fork3.3.2, spaCy3.8.7 and num2words0.5.14. Official version metadata, Windows/universal wheels and published SHA256 captured.
- Confirmed **Misaki excludes Python3.13**. Only registered local interpreter is3.13.4. Plan requires separately approved Python3.12, preserving existing Python.
- Found latest curated frontend/Thinc mismatch; documented candidate curated0.3.1/Thinc8.3.6 constraints. Complete transitive lock and execution remain UNVERIFIED.
- Clarified MIT upstream number-data evidence, loader MIT vs bundled eSpeak GPL, phonemizer GPL and num2words LGPL. Missing referenced notice, exact bundled attributions and output/provenance questions remain open; no blanket rights clearance.
- Defined isolated environment, disk/RAM gates, rollback and five-request fixed-text male-preset comparison. No environment or audio test created.

## Gates

- Interpreter: **FAIL now** — current3.13 cannot satisfy Misaki0.9.4.
- RAM: **FAIL now** —834,068,480 bytes available (0.777GiB), below1GiB minimum and2GiB preferred planning gate. No processes stopped.
- Storage: **CONDITIONAL** —17.714GiB free; known compressed subtotal360.45MiB; conservative model+6GiB setup allowance+10GiB reserve requires16.194GiB. ~1.52GiB margin, but expanded/transitive/Python totals unverified.
- Windows direct wheel availability: **PASS documentary** for proposed3.12 pins; full runtime compatibility **UNVERIFIED**.
- Full licence/attribution resolution and commercial-output clearance: **UNVERIFIED**; no production approval.

## Files and integrity

Requested deliverables:

1. [Installation, test and rollback plan](phase6-milestone5H19-installation-plan.md).
2. [Licence resolution and remaining evidence](phase6-milestone5H19-license-resolution.md).
3. This report.

New research-only evidence: `research5h19/package-metadata.json`, `licence-and-transitive-metadata.json`, `transitive-proposed-pins.json`, `curated-compatibility.json`, `integrity-before.json`, `integrity-result.json`. No existing reports overwritten. Some exploratory candidate version endpoints returned404; nonexistent versions were excluded, not represented as available pins.

**374/374 existing snapshotted source/public/WAV/original5E files unchanged** by SHA256. This focused check is not a fresh independent47/14/11 audit. Personal saves and secrets were not accessed. No production/config changes, package/model/archive acquisition, installations, audio generation, model imports, existing-environment changes, process termination or gameplay tests. Public metadata and small text licence/source documents were inspected only. No servers/background workers started; foreground checks exited. Build/lint unnecessary for documentation-only preparation.

## Exact remaining prerequisites

Separately approve a compatible Python3.12 interpreter and isolated acquisition only after RAM improves without unauthorized process termination; recheck disk reserve; resolve/hash-lock complete dependency wheels and reconcile missing notices. Execution remains a separate gate. Current plan is a bounded candidate configuration, not a verified install lock. Preserve Indic Tiny and all samples. **Stopped after preparation.**
