# Milestone 5H.5 — Isolated installation and test plan

**PLAN ONLY. No commands below were executed. No acquisition, installation or synthesis is approved by this document.**

## Isolation design

Reserved location: `C:\Users\Hp\Downloads\kalki 2898AD\phase6\ninada-evaluation\isolated-5h5\`.

This directory has **not** been created. Proposed contents: `.venv/`, `wheelhouse/`, `source/`, `model/`, `samples/`, `logs/`, `scratch/` and manifests. No symlinks into production, system-site-packages, global installs, persistent PATH edits or activation scripts. Always invoke `.venv\Scripts\python.exe` explicitly. All caches/temp output must be redirected into this root. Never launch the personal browser/save profile.

### Required acquisition inventory — before downloading

- One model file, pinned model revision: `onnx/te.onnx` (Studio male), **29,281,720 bytes**. Save as `model\te.onnx`; do not acquire female, Mobile, PyTorch, English or other-language weights, or example audio.
- Runtime text files at pinned code commit: `pyproject.toml`, `README.md`, `LICENSE`, and `python/src/ninada/{__init__.py,cli.py,engine.py,g2p.py,ipa_g2p.py,studio_g2p.py}`. Retain source licences and provenance. Review for any additional local-file imports before installation; stop rather than auto-fetch missing assets.
- Proposed wheel pins: **numpy==2.3.4, onnxruntime==1.30.0, soundfile==0.13.1, psutil==7.2.2, setuptools==78.1.0, wheel==0.45.1**, plus their resolved transitive wheels. Soundfile/wheel pins are proposed, not locally installed or wheel-availability-tested.
- No Torch, Transformers, GPU runtime, training extras, `onnx` graph tooling or huggingface-hub required by this initial monolithic/local-only design. Source's optional graph-splitting path may be unavailable; the run must still prove monolithic neural execution rather than accept a fallback. Any unexpected mandatory dependency requires review, not an automatic install.
- Before model transfer, obtain expected SHA-256/LFS object identity from **pinned public metadata** and record it beside expected size. That artifact hash is not established in the current local evidence. Never treat a hash computed only after download as independent integrity verification.

## Expected disk/resource budget

Known weight payload **~27.9 MiB**; code/frontend is additional. Planning allowance for isolated Python environment, unpacked packages, retained wheels, source, logs and five short WAVs: **0.5–1.5 GiB**, with a **2-GiB acquisition/install cap** and **at least 10 GiB free C: space retained**. These are estimates/policy limits, not measured install sizes. Check actual resolved wheel sizes before acquisition; no large source archives or duplicate HF cache.

CPU-only first run; batch one. Planned safety gates: >=1 GiB available RAM at start, stop if worker RSS exceeds 700 MiB or system available RAM falls below 200 MiB, total worker timeout 180 s and per-line timeout 45 s. Monitor/terminate only the owned worker process tree; keep partial evidence, do not retry automatically. These limits intentionally may reject a model that needs more memory; they are not published requirements.

## Exact installation command sequence — only after approval

Use a new PowerShell session. Initial commands reserve a new root and refuse any existing work; no deletion occurs:

```powershell
$testRoot = 'C:\Users\Hp\Downloads\kalki 2898AD\phase6\ninada-evaluation\isolated-5h5'
if (Test-Path -LiteralPath $testRoot) { throw 'Existing test directory: stop and inspect; do not overwrite.' }
New-Item -ItemType Directory -Path $testRoot | Out-Null
& 'C:\Python313\python.exe' -m venv "$testRoot\.venv"
$testPython = Join-Path $testRoot '.venv\Scripts\python.exe'
New-Item -ItemType Directory -Path "$testRoot\wheelhouse","$testRoot\source","$testRoot\model","$testRoot\samples","$testRoot\logs","$testRoot\scratch" | Out-Null
$env:PYTHONNOUSERSITE = '1'
$env:PYTHONPYCACHEPREFIX = "$testRoot\scratch\pycache"
$env:TEMP = "$testRoot\scratch"
$env:TMP = "$testRoot\scratch"
```

Activation is unnecessary. Verify `pyvenv.cfg` says `include-system-site-packages = false`, executable/prefix belongs to the reserved root, and no `PYTHONPATH` injection is present. Abort if any check fails; do not reuse or repair the global environment.

Only if acquisition is explicitly approved, the candidate binary-wheel resolution command is:

```powershell
& $testPython -m pip --isolated --require-virtualenv --disable-pip-version-check download --only-binary=:all: --dest "$testRoot\wheelhouse" 'numpy==2.3.4' 'onnxruntime==1.30.0' 'soundfile==0.13.1' 'psutil==7.2.2' 'setuptools==78.1.0' 'wheel==0.45.1'
```

This is a future package download, not a cloud inference service. If wheels are unavailable, stop; no source build, alternate version or global downgrade. Resolve every transitive version, record wheel hashes/source URLs, and freeze the full set in `requirements.lock.txt` with pip `--hash=sha256:...` entries **before installation**. That lock file cannot honestly be supplied with verified hashes before acquisition; generating/reviewing it is a mandatory future gate. Retaining the exact wheelhouse and hash lock makes the approved environment replayable.

Offline dependency installation, once the verified lock exists:

```powershell
& $testPython -m pip --isolated --require-virtualenv --disable-pip-version-check install --no-index --find-links "$testRoot\wheelhouse" --require-hashes -r "$testRoot\requirements.lock.txt"
```

Acquire only the runtime whitelist above from `https://raw.githubusercontent.com/hemanth/ninada/745b55633615cfacc636af81ac08450fd3ff35d3/` and the model from `https://huggingface.co/gnumanth/ninada/resolve/25143ee2842dd7bd9e2955b94797d43590ca676e/onnx/te.onnx`, after approval. Validate repository identity, expected size/hash and all source files; no broad clone or snapshot. The exact whitelisted transfers and artifact hashes must be approved/reviewed before execution, not improvised by a setup script.

Install reviewed source from the local directory only:

```powershell
& $testPython -m pip --isolated --require-virtualenv --disable-pip-version-check install --no-index --no-deps --no-build-isolation "$testRoot\source"
& $testPython -m pip --isolated --require-virtualenv --disable-pip-version-check check
& $testPython -m pip --isolated --require-virtualenv --disable-pip-version-check freeze
```

Review build configuration before this command; a local package build executes source. Capture the installed manifest and compare with the approved lock. No environment or runtime has been created in this milestone.

## Neural-only execution safeguards — design, not an implemented runner

A later separately reviewed runner must:

1. Refuse any model hash/path other than the pinned local `model\te.onnx`; pass explicit Telugu/male and exact local file. Log source/model hashes and provider.
2. Block socket networking in the worker and children, set offline flags and redirect caches/temp. Constructor must never resolve an absent file by downloading it.
3. Assert ONNX session exists, provider is CPUExecutionProvider, loaded graph path is exact, and expected neural graph inputs/outputs are present. Log inputs/provider, not merely a package version or WAV length.
4. Inspect returned metadata/chunks for neural tier. Fail on `klatt_zero_dep`, missing/mixed/unexpected tiers, alternate speaker, missing model/session, load errors or room-tone-only output. Do not monkeypatch production code or silence the failure. A neural tier label alone must not replace checking the loaded session.
5. Capture import/process startup, constructor/session load, first-frame and per-line generation times separately. Pin **four** ORT threads because current code clamps its minimum to four; record Tiny's historical two-thread difference rather than claiming matched CPU conditions.
6. Record process RSS and, where available, USS/peak working set, system available RAM, CPU utilization and model/session count. Sample NVIDIA VRAM before/during/after with timestamps. Global VRAM changes are not automatically worker attribution; mark unavailable per-process telemetry clearly. No GPU provider planned.
7. Preserve output/error/timeout logs. Write new WAVs exclusively under the isolated root, one file per ID, no overwrite or automatic retry. Verify mono/rate/PCM frames, finite signal, clipping and hashes. A playable WAV does not establish correct words or emotion.

## Five-line comparison and acceptance

Use exact original 5G.8 source IDs **BH6-5E-002, BH6-5E-004, BH6-5E-013, BH6-5E-037, BH6-5E-045**, from the unchanged CSV, with fixture labels. Read the existing Tiny files; do not copy over or regenerate them. No placeholders, live save data or new triumphant text.

Initial Ninada conditions: fixed Telugu male, rate 1.0, default Telugu noise 0.40 and duration noise 0.0 as source-defined; document lack of guaranteed identical stochastic draws across runs. These are a neutral comparison, not emotion labels. Keep text and settings identical across that set. The source does not expose a verified urgency/triumph switch.

Technical acceptance: 5/5 neural-only results with complete logs, no unauthorized networking, no fallback, within safety limits, readable PCM files, unchanged originals/drafts and no production modifications. Pronunciation, voice identity and expressive improvement require separately supported assessment; no forced success from waveform metrics. Existing lines do not establish a full emotional-range test.

## Licensing gate

Preserve separate CC-BY-4.0 weight, MIT code and Rasa/SYSPIN provenance records from 5H.4. Full applicable initialization/source terms and any voice/output rights remain unresolved. Evaluation authorization must explicitly acknowledge the remaining evidence limits; production commercial clearance is not implied. Retain licences/attribution without changing the game's rights manifest.

**Plan readiness: CONDITIONAL.** Proposed pins/wheels, artifact hashes, local Windows neural behavior, memory envelope and permission gates must be verified in an explicitly authorized acquisition/test step. No synthesis command or auto-running installer created.
