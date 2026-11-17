# Phase 6 Milestone 5H.19 — Isolated installation plan

15 November 2026 (Asia/Calcutta). **NO-GO for installation now. Preparation only.** Read the complete 5H.18 feasibility report, comparison and summary. No environment created, package/model fetched, model imported or audio generated.

## Critical compatibility finding

`py -0p` lists only `C:/Python313/python.exe` (3.13.4). Misaki 0.9.4 explicitly declares `>=3.8,<3.13`. Therefore the publisher's dependency chain is incompatible with this interpreter, despite Mithi's general Python >=3.10 instruction. A venv made with Python3.13 would retain the problem. Do not use `--ignore-requires-python`, patch metadata, omit the documented frontend silently, or change the working Python3.13 installation.

Propose **separate 64-bit CPython3.12**, not yet present in the registered inventory. Provisioning that interpreter requires separate approval; it is not an action performed here. Exact supported patch/build and installer hash must be verified before acquisition. No assertion that every unregistered interpreter location was searched. Python3.12 satisfies the direct package constraints below; Windows wheel tags establish availability, not runtime success.

## Exact six missing direct dependency pins

- **soundfile==0.13.1**: Python requirement `not declared`; `soundfile-0.13.1-py2.py3-none-win_amd64.whl`, 1,019,162 bytes; published SHA-256 `1e70a05a0626524a69e9f0f4dd2ec174b4e9567f4d8b6c11d38b5c289be36ee9`. [Official release metadata](https://pypi.org/pypi/soundfile/0.13.1/json).
- **misaki==0.9.4**: Python requirement `<3.13,>=3.8`; `misaki-0.9.4-py3-none-any.whl`, 3,617,774 bytes; published SHA-256 `90e2eeb169786c014c429e5058d2ea6bcd02d651f2a24450ba6c9ffc0f8da15a`. [Official release metadata](https://pypi.org/pypi/misaki/0.9.4/json).
- **espeakng-loader==0.2.4**: Python requirement `>=3.6`; `espeakng_loader-0.2.4-py3-none-win_amd64.whl`, 9,437,292 bytes; published SHA-256 `41f1e08ac9deda2efd1ea9de0b81dab9f5ae3c4b24284f76533d0a7b1dd7abd7`. [Official release metadata](https://pypi.org/pypi/espeakng-loader/0.2.4/json).
- **phonemizer-fork==3.3.2**: Python requirement `>=3.8`; `phonemizer_fork-3.3.2-py3-none-any.whl`, 82,700 bytes; published SHA-256 `97305c76f4183b3825dae8f4c032265fe78c9946ce58c47d4b62161349264b74`. [Official release metadata](https://pypi.org/pypi/phonemizer-fork/3.3.2/json).
- **spacy==3.8.7**: Python requirement `<3.14,>=3.9`; `spacy-3.8.7-cp312-cp312-win_amd64.whl`, 13,918,682 bytes; published SHA-256 `25d7a68e445200c9e9dc0044f8b7278ec0ef01ccc7cb5a95d1de2bd8e3ed6be2`. [Official release metadata](https://pypi.org/pypi/spacy/3.8.7/json).
- **num2words==0.5.14**: Python requirement `not declared`; `num2words-0.5.14-py3-none-any.whl`, 163,525 bytes; published SHA-256 `1c8e5b00142fc2966fd8d685001e36c4a9911e070d1b120e1beb721fa1edb33d`. [Official release metadata](https://pypi.org/pypi/num2words/0.5.14/json).

Use `misaki[en]==0.9.4` to match the documented frontend extras, not only the base package. SoundFile's metadata does not declare Requires-Python: the cross-version wheel is evidence of packaging, not independent Python runtime validation. The extra pulls additional packages beyond these six.

Proposed core pins: torch==2.11.0, transformers==5.17.0, numpy==2.3.4, safetensors==0.8.0, sentencepiece==0.2.2. Published cp312 Windows or abi3/universal wheels were checked. These are new-environment pins, not permission to alter/reuse the installed CUDA torch. Explicit CPU device selection is required; do not claim PyPI wheel contents are a verified CPU-only build merely from its name.

Additional proposed compatibility constraints: **spaCy-curated-transformers==0.3.1**, **thinc==8.3.6**, **en_core_web_sm==3.8.0**. Latest curated2.1.2 requests Thinc>=9.0.0.dev4, while spaCy3.8.7 requires Thinc>=8.3.4,<8.4: unconstrained latest selection conflicts. Curated0.3.1 has no such Thinc9 requirement in metadata; Thinc8.3.6 accepts NumPy>=2,<3, matching2.3.4. English model metadata requires spaCy>=3.8,<3.9 and lists MIT. This is a plausible metadata-compatible set, **not a completed transitive lock or tested configuration**.

Other transitive packages include cffi, addict, regex, docopt, attrs, dlinfo, joblib, segments, typing-extensions, curated-transformers/tokenizers, Thinc native components and Transformers dependencies. Complete versions, Windows wheels and licences remain to be resolved. No pip resolver was run because it can fetch distribution metadata/binaries under these no-download restrictions. A future authorized resolution must reject source builds, unresolved conflicts and unpinned artefacts rather than quietly changing this plan.

Official sources: [Misaki0.9.4](https://pypi.org/project/misaki/0.9.4/), [spaCy3.8.7 metadata](https://pypi.org/pypi/spacy/3.8.7/json), [curated0.3.1 metadata](https://pypi.org/pypi/spacy-curated-transformers/0.3.1/json), [Thinc8.3.6 metadata](https://pypi.org/pypi/thinc/8.3.6/json), [English model metadata](https://github.com/explosion/spacy-models/blob/master/meta/en_core_web_sm-3.8.0.json). Release metadata, wheel sizes and published hashes are retained under `research5h19/`; no wheel bytes acquired or verified locally.

## Resource calculation and gates

Fresh read-only host snapshot: OS-visible RAM 7,883,304,960 bytes (7.34GiB); available **834,068,480 bytes (0.777GiB)**. C: free **19,019,776,000 bytes (17.714GiB)**. No process terminated. 5H.18 documents GTX1650 4GiB/compute7.5; GPU not re-queried in this milestone. CPU plan needs no VRAM and no native BF16. Stock Mithi FP32 execution is a source-inspected path, not a measured execution pass.

Documented sizes:

- Pinned Mithi non-demo repository: 208,480,441 bytes (198.82MiB), from official file metadata in5H18.
- Eleven selected direct wheels: 169,481,891 bytes (161.63MiB), sum of one compatible published wheel per pinned direct/core package. This omits all transitives, Python, English pipeline, unpacking and caches; **not total install size**.
- Known compressed subtotal: **377,962,332 bytes (360.45MiB)**. Future model actual hashes must match5H18.
- FP32 core tensor lower bound:99,079,134*4=396,316,536 bytes (377.96MiB); BF16 on-disk weights do not predict peak resident memory. Load staging, allocator, runtime, text frontend and activations are additional; no official peak RAM minimum is provided.

Retain previous **3–6GiB environment/cache/temporary-space planning allowance**, explicitly an estimate rather than documented measured requirement. With model payload plus a conservative6GiB allowance and10GiB post-setup reserve, required free space is **16.194GiB**. Present free space leaves ~1.52GiB margin over that planning gate. It is not an approved exact budget: a complete wheel/expanded-size inventory, Python allocation and disk recheck are mandatory before installation. If forecast exceeds this allowance, stop; do not delete evidence or share package directories to force a pass.

Carry forward minimum1GiB available-RAM gate; prefer **2GiB** at start for the future isolated worker. Current0.777GiB fails even the minimum. No RAM claim derived solely from weights. Runtime acceptance should monitor peak working set and available memory, stop worker below512MiB available, and impose an initial2GiB worker working-set ceiling and120s request timeout. Those are proposed safeguards, not tested minimums or guaranteed Windows hard quotas. Supervisor must be implemented/verified under later authorization. Do not run game and TTS simultaneously in the initial trial.

## Proposed layout and future commands — NOT EXECUTED

Keep everything within a newly created, nonexisting `phase6/mithi-evaluation/` directory: `.venv312/`, `wheelhouse/`, `model/`, `cache/`, `tmp/`, `outputs/`, `logs/`, `licenses/`. Fail on existing output paths. Keep runtime assets out of public/src/dist. This preserves source locations and rollback. Long eSpeak paths can cause its documented temporary data-copy workaround; keep temp/cache contained and check any copies remain under this root. Do not modify publisher code during preparation.

Only after explicit installation approval, a compatible interpreter, rights review and resource gates:

```powershell
# PLAN ONLY; do not execute during5H.19.
# Replace the placeholder with the separately approved, verified Python3.12 executable.
& '<verified-python312.exe>' -I -m venv '<project>/phase6/mithi-evaluation/.venv312'
& '<evaluation>/.venv312/Scripts/python.exe' -I -m pip install --no-index --find-links '<evaluation>/wheelhouse' --require-hashes -r '<evaluation>/requirements.lock'
& '<evaluation>/.venv312/Scripts/python.exe' -I -m pip check
```

The wheelhouse and hash-locked full requirements file **do not exist yet**; commands intentionally cannot install today. Future package acquisition/resolution is a separate approval step. Never use system-site-packages, global pip, an activation script that changes persistent PATH, user-site installs or copying existing site-packages. Use full executable paths, process-local cache/TEMP configuration and no persistent environment changes. Check `sys.prefix != sys.base_prefix`, isolated prefix, `pyvenv.cfg` include-system-site-packages=false, and every package path before imports. Retain pre/post metadata of the existing interpreter.

Model acquisition, if separately authorized, must pin `Oomni/mithi-v2-flash@1fc0dd68496a2483508ec764d310146c41ff90be`, omit demos, include every required tokenizer/mapping/config file and compare all sizes/LFS hashes with5H18. Verify run.py/config/LICENSE hashes too. No moving snapshot paths or model files into game assets. Use a reviewed supervisor with only local inference and network disabled after acquisition. No cloud credentials or project .env needed.

## Small Telugu male-voice test design

**Future test only, five synthesis requests total**: one identical unchanged Telugu line per `satvik`, `anirban`, `nakul`, `vasant`, `siddhant`, sequentially on CPU, two threads, seed0, stock inference config, default gap0.15. No emotion or actor reference. Use existing5G8 line **BH6-5E-037** exactly:

> వార్డెన్‌ను ఎదుర్కో. దాడికి సిద్ధమయ్యే కదలికను గమనించు.

English source: Face the Warden; watch its attack wind-up. Source: `phase6-milestone5G8-audio-inventory.csv`. Language status remains PENDING/UNVERIFIED. The existing matched Indic Tiny WAV is `local-tts-evaluation/milestone5G8/BH6-5E-037.wav`; preserve it byte-for-byte. This first test compares identities/technical feasibility, not all emotional categories or production readiness.

Use new `outputs/<voice>-BH6-5E-037.wav`, fail if exists; no retries/substitution. Log exact revision/settings, cold initialization, frontend and synthesis timing, total latency, process RSS, minimum available RAM, errors and output SHA256. Validate24000Hz mono, finite nonempty audio, positive plausible duration, clipping/truncation/silence and WAV readback. Compare durations/real-time factor with baseline, distinguishing cold and warm timings. No automatic rescaling or pitch edits to manufacture depth. Pronunciation, naturalness and suitability require actual listening; never convert technical WAV checks into a quality pass. Stop after five or first safety failure. Do not integrate samples or rights approvals.

## Rollback and preservation

Preparation requires no production rollback. Future abort: stop only the newly owned worker, preserve logs and partial files, restore process-local variables by ending that process. Existing Python3.13, game data, samples and saves must remain untouched. Removing an evaluation environment, if later requested, requires confirming resolved absolute paths are children of the exact evaluation root and avoiding links/reparse points; do not include a recursive deletion command now. No automatic cleanup or global cache deletion. Keep the separately approved Python installation if its removal is not authorized. Verify baseline hashes before/after future work; no personal-profile access.

## Installation decision

**NO-GO now:** incompatible only-registered interpreter; insufficient RAM; no full tested/hash-locked transitive environment; referenced notice and commercial-output provenance remain unresolved. Preparation is complete with blockers stated. Approval would need to cover separately provisioning Python3.12 and acquiring an isolated pinned dependency/model set after these gates pass. Stop here; this report grants neither action.
