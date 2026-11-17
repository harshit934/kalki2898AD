# Milestone 5H.19 — Licence resolution

Checked15 November2026. **Documentary clarification achieved; full clearance NOT achieved.** No package/model acquisition, licence-file patching, redistribution or production change. Public small licence text and metadata were inspected as research, not installed.

## Confirmed permissions and obligations

1. **Mithi model/runtime, pinned5H18 revision:** Apache2 file hash and source identity unchanged. Commercial use is permitted for the licensed work subject to terms. Include Apache2, relevant copyright/credits and applicable NOTICE when redistributing work/derivatives; mark modifications. No trademark or identifiable actor rights granted. [Pinned LICENSE](https://huggingface.co/Oomni/mithi-v2-flash/blob/1fc0dd68496a2483508ec764d310146c41ff90be/LICENSE), [Apache2 terms](https://www.apache.org/licenses/LICENSE-2.0).
2. **misaki0.9.4:** release metadata includes Apache2; preserve applicable notices with distributed copies. Its English extra adds separately licensed components. [Exact release](https://pypi.org/project/misaki/0.9.4/).
3. **spaCy3.8.7:** MIT, keep licence and copyright with copies. **en_core_web_sm3.8.0:** upstream metadata lists MIT, compatible spaCy>=3.8,<3.9; its own data sources and notices still need inclusion from exact package. Do not infer runtime-code MIT covers every training dataset. [spaCy release](https://pypi.org/project/spacy/3.8.7/), [pipeline metadata](https://github.com/explosion/spacy-models/blob/master/meta/en_core_web_sm-3.8.0.json).
4. **SoundFile0.13.1:** metadata BSD3-Clause, retain notices/disclaimer; bundled libsndfile/native components have separate LGPL and possibly other library notices. Exact Windows wheel licence inventory not inspected because binaries were not downloaded. [Release](https://pypi.org/project/soundfile/0.13.1/), [upstream](https://github.com/bastibe/python-soundfile).
5. **espeakng-loader0.2.4:** upstream loader code MIT, copyright2025 thewh1teagle. Its PyPI metadata has no licence field; the upstream licence establishes loader-code terms, not every bundled binary. **eSpeak NG is GPLv3**. Preserve licence/source obligations if conveying that component. [Loader licence](https://github.com/thewh1teagle/espeakng-loader/blob/main/LICENSE), [eSpeak COPYING](https://github.com/espeak-ng/espeak-ng/blob/master/COPYING). Exact shipped eSpeak revision/notices must be recorded after separately authorized package acquisition.
6. **phonemizer-fork3.3.2:** GPL3-or-later, copyright2015–2021 Mathieu Bernard as stated in release documentation. Acknowledgement/citation to Bernard and Titeux2021 is requested; distinguish scholarly citation request from licence obligations. Distributing covered code/binaries requires GPL compliance, including applicable source provision. [Exact release and licence](https://pypi.org/project/phonemizer-fork/3.3.2/).
7. **num2words0.5.14:** release metadata LGPL; upstream COPYING is LGPL2.1. Retain licence/notices and allow applicable replacement/relinking/source rights when redistributing the library; verify the exact release's licence and per-file notices before packaging rather than silently assigning a later-version option. [Release](https://pypi.org/project/num2words/0.5.14/), [COPYING](https://github.com/savoirfairelinux/num2words/blob/master/COPYING).
8. **Maya/Kokoro/Indic-BERT lineage:** publisher identifies Apache2 for Maya/Kokoro and MIT for Indic-BERT. Prior5H18 inspected the upstream licence/card. Preserve those credits and licences if redistributed; exact copied upstream revisions and all embedded normalizer sections still need reconciliation. [Maya](https://huggingface.co/maya-research/maya2-native), [Kokoro](https://github.com/hexgrad/kokoro/blob/main/LICENSE), [Indic-BERT](https://huggingface.co/ai4bharat/indic-bert).

Offline private evaluation does not itself convey the runtime to game players. Runtime redistribution and shipping only generated WAVs are different analyses. Do not claim GPL automatically makes generated WAVs or the game GPL; equally, do not package a linked/copied GPL stack under an Apache-only notice. No production runtime packaging is authorized.

## Missing Assamese notice: what was resolved

Pinned run.py:1816–1817 names AI4Bharat's `indic_numtowords/asm/data/nums.py` and a local `assamese_numbers.LICENSE` absent from the Mithi tree. This audit opened the actual referenced upstream number-data source and root licence:

- [Number data source](https://github.com/AI4Bharat/indic-numtowords/blob/master/indic_numtowords/asm/data/nums.py).
- [Root MIT licence](https://github.com/AI4Bharat/indic-numtowords/blob/master/LICENSE), copyright(c)2022 AI4Bhārat.

The root MIT notice is concrete upstream evidence for the referenced material. It permits commercial copying subject to retaining its copyright/permission notice. A future notice bundle should contain this full upstream MIT text and identify the number-data source; do not reconstruct licence wording from a summary.

**Still unresolved:** the exact named local notice is not supplied by Mithi; no maintainer clarification was obtained, no exact source-revision/full embedded-data comparison completed and no evidence excludes all other notices in that embedded normalizer. Root MIT clarification narrows the problem but does not make Mithi's missing referenced file magically present. Do not create/patch that file in production or claim redistribution readiness. The maintainer may provide the missing notice, or a documented exact provenance comparison may substantiate an external notice bundle. External contact is not authorized/performed.

## Attribution bundle plan — not created in production

Before distributing a runtime, produce a pinned component manifest and licences directory with:

- Oomni Mithi revision, Apache2 and publisher credits.
- Maya/Maya normalizer, Kokoro, Misaki Apache notices and modified-file notices if any.
- Indic-BERT and AI4Bhārat number-data MIT copyright/permission notices.
- spaCy, pipeline, loader and every dependency's exact-version notices.
- SoundFile BSD notice plus bundled native-library notices and licence/source compliance.
- eSpeak and phonemizer GPL licence/notices, corresponding-source/compliance plan; num2words LGPL obligations.
- Torch, NumPy, Transformers, tokenizer/safetensors, curated frontend and all transitive/native dependencies from the final lock/wheels. Never assume their dependencies share a top-level licence.

Proposed descriptive credit (not a substitute for full notices): “Speech evaluation uses Mithi v2 Flash by Oomni, with components credited to Maya Research, hexgrad/Kokoro and Misaki, AI4Bharat Indic-BERT and number-data contributors; each component retains its own licence.” Preserve actual upstream copyright names/text rather than treating this wording as exact required attribution.

## External/unknown conditions and decision

- Mithi's model/code grant is explicit; complete training-data provenance, stock-speaker consent and application-specific generated-output permissions are not independently established by the inspected Apache file. No evidence here expressly prohibits them, but no blanket commercial-output assurance is invented.
- Exact package archive notices and full transitive SBOM unavailable without later authorized acquisition. Metadata does not establish completeness of bundled notices.
- Missing normalizer reference requires provenance reconciliation. Original51 drafts remain PENDING language review; licensing and pronunciation are separate.

**NO-GO for commercial production clearance.** Future private evaluation is potentially viable after technical gates and explicit authorization; do not treat these uncertainties as resolved. Research evidence is in `research5h19/licence-and-transitive-metadata.json` (includes exact inspected-text SHA256) and `package-metadata.json`. Live upstream links checked15November2026 may change; their fetched-text hashes identify what was actually inspected. No final voice rights manifest or enforcement changed.
