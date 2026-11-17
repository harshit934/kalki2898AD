# Milestone 5H.4 — Ninada Telugu verification

15 November 2026. **Overall: CONDITIONAL. Lightweight local feasibility is plausible; an expressive Bhairava replacement is not established. No installation or synthesis authorized.**

## Exact release and sources

- Model: `gnumanth/ninada`, **v5.1.2**, pinned revision **`25143ee2842dd7bd9e2955b94797d43590ca676e`**.
- Telugu male Studio: `onnx/te.onnx`, **29,281,720 bytes**. Telugu male Mobile: `onnx_mobile/te.onnx`, **22,737,098 bytes**. Sizes are repository metadata from 5H.3, not downloaded or loaded models. Frontend/runtime storage is additional. [Model source](https://huggingface.co/gnumanth/ninada).
- Official inference code: `hemanth/ninada`, inspected commit **`745b55633615cfacc636af81ac08450fd3ff35d3`**. Its package version and current PyPI release are **5.1.2**. This resolves the earlier research's 5.0.0 package/version uncertainty. [Repository](https://github.com/hemanth/ninada), [package metadata](https://pypi.org/project/ninada/5.1.2/).

Public documentation/source text was read remotely; no source checkout, wheel, model or audio downloaded to disk. Cached web views differed from the current source length, so code observations below refer to the explicit commit, not an unpinned cached page.

## Dependencies and compatibility

Actual `pyproject.toml`: Python **>=3.10**, no default dependencies; optional `neural` extra declares **ONNX Runtime >=1.18.0, NumPy >=1.24.0, soundfile >=0.12.1**. Training extras are not required for the intended inference comparison. [Pinned declaration](https://github.com/hemanth/ninada/blob/745b55633615cfacc636af81ac08450fd3ff35d3/pyproject.toml).

Current active Python 3.13.4 meets the declared version floor. Existing ONNX Runtime **1.30.0**, NumPy **2.3.4** satisfy the declared lower bounds. **Ninada, soundfile and onnx are absent**; huggingface-hub 1.31.0 and SciPy 1.17.1 exist. No installs or package changes made. Declaration compatibility does not prove Windows operator/graph compatibility.

Pinned `python/src/ninada/engine.py` uses CPUExecutionProvider, local filesystem paths and optional neural imports. No verified Windows end-to-end result exists on this laptop. Source includes graph-splitting work requiring `onnx`; absence of that optional path must not be mistaken for absence of monolithic inference. Exceptions can be caught and alternate paths used. The Python path inspected selects Studio filenames; do not assume the browser's advertised Mobile routing is automatically identical in Python.

## Important source findings

Source: [pinned engine](https://github.com/hemanth/ninada/blob/745b55633615cfacc636af81ac08450fd3ff35d3/python/src/ninada/engine.py).

- Lines **589–599** create CPU-only ONNX sessions; thread count is clamped to at least four. Setting the thread environment variable to two would not reproduce Tiny's two-thread benchmark.
- Lines **660–676** catch explicit model-load errors; session availability must be independently checked.
- Lines **731–736** can attempt Hugging Face downloads if files are not resolved locally. A later offline test must prevent this, not merely rely on a local filename argument.
- Lines **960–1022** expose `rate`, `noise`, `noise_duration`, tier/chunk parameters and voice. These influence pacing/stochastic sampling, not semantic emotion labels.
- Lines **1666–1713** return neural output when available, otherwise Klatt output with `tier=klatt_zero_dep`. A valid WAV alone can therefore give a **false neural-success conclusion**. A future test must verify the exact loaded graph/provider and output tier and fail on fallback.

These are source-code findings, not executed failures. No runtime or model code was run/imported.

## Actual RAM/VRAM — what can be established

Current available RAM check: **993,525,760 bytes (~947.5 MiB)**. Latest 5H.2 hardware baseline: Ryzen 5 5600H, 8-GiB RAM, GTX 1650 4 GiB. No hardware change inferred.

**Actual Ninada memory minimum/peak: UNVERIFIED.** Inference is forbidden in this task, so no truthful measured requirement can be supplied. A 21.7/27.9-MiB file does not establish RSS, temporary graph expansion, session-cache or utterance-buffer size. CPU path requires no dedicated GPU allocation in principle, but actual VRAM/system impact was not measured. The small artifact makes a future CPU trial plausible, not proven safe under current memory pressure.

Publisher browser/mobile speeds and quality scores are not Windows laptop measurements or evidence of Telugu emotion quality. No real-time claim or benchmark transfer.

## Expressive delivery assessment

**Urgency, intensity, warning delivery and triumph: UNVERIFIED.** No dedicated named control for those states was found in the inspected public Python interface. Rate/noise controls and punctuation-aware clause splitting do not prove intentional emotional prosody. Raising volume or changing stochasticity is not a validated substitute for acting.

The fixed male Telugu specialist supports a consistent identity strategy, but perceived identity and pronunciation require future evidence. A warning or victory sentence's meaning does not prove warning/triumphant vocal delivery. No test audio exists here and no subjective judgment is claimed.

## Comparison with Indic Tiny

- **Tiny:** existing `te_M` baseline, actual local WAVs and CPU timings; read delivery, speed control, no established emotion selector. Historical worker memory about 199–203 MiB, not a minimum specification.
- **Ninada:** substantially smaller individual weight file and documented local CPU interface, but no laptop generation, memory or pronunciation result. Rate/noise controls offer a hypothesis for variation, not a verified expressive advantage.
- **Identity:** both have fixed male choices; neither has demonstrated emotionally varied identity consistency here.
- **Rights:** both have permissive stated component licences, with separate attribution/provenance requirements. Ninada's initialization/data conditions are addressed in the licence audit; no final production clearance.

## Gate and test-plan status

**All checks have not passed.** Windows execution, actual memory, required expressive delivery and complete release-specific rights remain unverified. Therefore an executable/ready-to-run five-line test plan is **deferred**, not approved or created as though prerequisites passed.

If later authorized after resolving these gates, preserve the exact 5G.8 source IDs **BH6-5E-002, 004, 013, 037, 045**, wording and language status, and compare with preserved Tiny output. Such a later plan must include strict offline enforcement, exact graph/tier verification, bounded resources, no Klatt substitution and no claim that the five existing categories themselves test triumph. A new triumphant line is not authorized here.

**CONDITIONAL for future isolated feasibility review; no GO for expressive or production acceptance. Stop before acquisition or synthesis.**
