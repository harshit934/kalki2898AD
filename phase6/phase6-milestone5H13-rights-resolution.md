# Milestone 5H.13 — Rights condition resolution

15 November2026. **Commercial production decision: NO-GO on the current release evidence.** This is a project clearance/readiness decision, not a conclusion that CC BY/MIT prohibit commercial use. No new permission, prohibition, approval or licence has been invented. Isolated evaluation remains the existing boundary; no audio packaged.

## Evidence reviewed and verification limits

Read5H.11 rights audit/integration plan, unchanged5H.12 decision,5G.7 attribution preparation, local model LICENSE.md/README, bundled MIT/upstream/frontend notices, and Milestone3 packaging report. Inspected current `vite.config.js`, `tools/voice-build-policy.mjs` and existing production audio rights architecture. Current official public model/dataset/licence pages were viewed read-only. No model, corpus, audio, runtime archive or package payload acquired; no gated agreement accepted and no rights-holder communication sent.

Pinned model: `sulabhkatiyar/indic-tiny-tts-telugu@fb552545f06d76d7b5d6365827b69c0bda465767`, stock male te_M, ID13. Vocoder pin: `charactr/vocos-mel-24khz@0feb3fdd929bcd6649e0e7c5a688cf7dd012ef21`. Local pinned evidence is distinct from current unpinned web cards, which are corroboration rather than proof of historical training bytes.

## Conditions, evidence needed and current resolution

### R01 Acoustic weight permission

- Classification: **RESOLVED IN DOCUMENTED SCOPE**.
- Existing evidence: Pinned local LICENSE.md explicitly covers acoustic weights and encoder/flow ONNX graphs under CC BY4.0; current official card agrees.
- Exact closure evidence/action: Preserve exact revision/hash, licence/link and appropriate credits; no separate commercial fee or noncommercial restriction is shown.
- Resolution today: Existing evidence provides publisher permission, not a guarantee of all other rights. No additional model licence invented.

### R02 Runtime and vendored code

- Classification: **RESOLVED IN DOCUMENTED SCOPE / INTERNAL COMPLIANCE**.
- Existing evidence: MIT runtime plus Matcha/Vocos/number-table notices are present; frontend notice adds lexicon/CMU obligations.
- Exact closure evidence/action: For actual software redistribution retain full applicable notices, upstream modifications and dependency notices; approve a software bill of materials.
- Resolution today: Existing evidence provides code permission; it does not make Python/model redistribution part of the proposed WAV-only package.

### R03 Vocoder weight scope

- Classification: **PARTIAL / EXTERNAL IF GREATER ASSURANCE REQUIRED**.
- Existing evidence: Publisher explicitly assigns MIT to pinned unchanged Vocos weights and ONNX conversion; upstream model card has MIT metadata, prose addresses code.
- Exact closure evidence/action: Keep both declarations and exact revision. If release review needs more than that publisher/metadata chain, obtain weight-specific confirmation from an authorized upstream holder.
- Resolution today: No demonstrated contrary restriction; absence of a separate confirmation is not itself proof that use is forbidden. No such extra confirmation located.

### R04 Telugu training subset provenance

- Classification: **PARTIAL / EXTERNALLY DEPENDENT**.
- Existing evidence: Model card says Telugu Rasa; mini dataset explicitly attributes te_M to Rasa; intermediate collection contains other differently licensed groups.
- Exact closure evidence/action: Publisher training manifest or attestation tying this pinned Telugu checkpoint to the declared Rasa te_M subset, if independent provenance assurance is required.
- Resolution today: Documentary subset chain exists; row-level training provenance was not independently audited. Do not demand downloading the corpus as the only resolution or label all mixed data CC BY.

### R05 Rasa gated conditions

- Classification: **UNKNOWN / EXTERNALLY DEPENDENT**.
- Existing evidence: Official Rasa card separately labels CC BY4.0 but file-access conditions are behind login.
- Exact closure evidence/action: Authorized access to relevant terms, or publisher/rights-holder clarification of their applicability to downstream stock-model/output use. Do not accept terms for the user or claim a gate is a blanket commercial ban.
- Resolution today: No gated terms or additional contract was inspected. The project has not obtained raw Rasa data in this audit.

### R06 Dataset permission versus speaker/voice identity

- Classification: **UNKNOWN / EXTERNALLY DEPENDENT**.
- Existing evidence: Rasa/LibriTTS copyright licences are documented, but no individual stock-speaker release or generated-voice use assurance was located.
- Exact closure evidence/action: Rights-holder statement covering authorized stock-voice synthesis/use or an appropriately documented review of whether additional privacy/publicity/personality permissions apply to intended territories/marketing.
- Resolution today: CC BY does not grant every non-copyright right. No actor-cloning assumption; no claim that every jurisdiction always requires an extra release.

### R07 Generated-output commercial scope

- Classification: **UNKNOWN / EXTERNALLY DEPENDENT OR DOCUMENTED RELEASE REVIEW**.
- Existing evidence: No separate explicit WAV-output permission/restriction provision was identified in the inspected model/code records.
- Exact closure evidence/action: Clarify with an authorized holder whether original-text stock-voice outputs may be shipped commercially and what terms apply, or document a supported release assessment of applicable rights and obligations.
- Resolution today: Missing a separate output licence is not proof a new licence is universally required. Model/code licences neither automatically license all outputs nor automatically prohibit them.

### R08 LibriTTS/vocoder data chain

- Classification: **PUBLIC LICENCE RESOLVED; UNDERLYING RECORDINGS UNVERIFIED**.
- Existing evidence: Official OpenSLR SLR60 independently identifies CC BY4.0; publisher says Vocos trained on LibriTTS.
- Exact closure evidence/action: Retain source citation/attribution where applicable. If release assurance requires deeper source-recording/voice review, seek provenance/permission evidence rather than assuming publisher copyright licence resolves personality rights.
- Resolution today: No raw corpus distributed; no per-recording verification or separate voice clearance claimed.

### R09 Original text and final recording ownership

- Classification: **PARTIAL / INTERNALLY RESOLVABLE**.
- Existing evidence: 51 drafts are traceable original project drafts and remain PENDING/UNVERIFIED; generation settings/hashes and original-text provenance are recorded.
- Exact closure evidence/action: Project-owner confirmation of authorized original text, final chosen exact line/text hash, no movie/actor material, per-file generation provenance and documented third-party obligations.
- Resolution today: No new dialogue introduced. AI-generated draft traceability is not guaranteed exclusive copyright or independent linguistic approval.

### R10 Attribution and distribution format

- Classification: **OPEN / INTERNALLY RESOLVABLE**.
- Existing evidence: 5G.7 supplies conservative notices; 5H.11 notes current additional speed/pause variants. No approved release asset list/distribution-specific notices provided.
- Exact closure evidence/action: Choose WAV-only versus shipping code/model; approve complete corresponding notices, links, creator/citation and modification disclosures. Review any DRM/additional restrictions on licensed material if redistributed.
- Resolution today: WAV-only suggested, not authorized. Software notices do not automatically govern standalone outputs; conservative credits and exact legal obligations must be distinguished.

### R11 Asset-specific runtime/build approval

- Classification: **OPEN / INTERNALLY RESOLVABLE AFTER RIGHTS EVIDENCE**.
- Existing evidence: Existing rights guard and Milestone3 exclusion policy cover catalogue entries; prototype files remain outside production.
- Exact closure evidence/action: Approve exact asset hashes, evidence IDs, scope and catalogue mappings; verify fail-closed runtime and fresh shipping package audit including uncatalogued/prototype and encoded content.
- Resolution today: Technical valid WAVs are not approved assets. Catalogue exclusion is not a universal voice allowlist; exact-byte fingerprints do not detect altered/transcoded equivalents.

### R12 Listening/content acceptance

- Classification: **BLOCKED QUALITY GATE, NOT A LICENCE**.
- Existing evidence: 5H.12 decision remains review incomplete; no pronunciation/emotional approval.
- Exact closure evidence/action: Actual user listening evidence, selected approved lines/profiles and explicit content/voice acceptance; keep unresolved language dimensions UNVERIFIED.
- Resolution today: No change to 5H.12, scorecard or voice choice. Rights clearance alone cannot resolve this separate gate.

## Attribution and redistribution requirements

**Acoustic/model material:** preserve Indic Tiny creator/model link and Rasa credit/citation, CC BY4.0 licence link, supplied copyright/attribution/disclaimer information, and indication of modifications where required. Do not imply endorsement. CC BY permits commercial exercise of its licensed rights but reserves other rights and imposes conditions on sharing. Consult the actual legal code rather than treating a summary as the full grant. [CC BY4.0 legal code](https://creativecommons.org/licenses/by/4.0/legalcode.en).

**Runtime/code redistribution:** retain complete MIT copyright/permission notices for Sulabh Katiyar2026, Matcha/Shivam Mehta2023, Vocos/Charactr2023 and relevant AI4Bharat number tables. If including frontend/lexicons, retain the full preserved frontend/CMU conditions and disclaimer. If shipping NumPy/ORT/other binaries, audit their notices separately. These extra runtime components are not proposed for a WAV-only game package.

**Datasets independently:** Rasa's official card states CC BY4.0 and exposes a file-access gate; the mixed mini collection identifies Telugu male as Rasa and separates other-licence English data. Do not describe the entire collection as CC BY or infer the Telugu checkpoint trained on restricted English shards without evidence. [Rasa](https://huggingface.co/datasets/ai4bharat/Rasa), [mini dataset](https://huggingface.co/datasets/sulabhkatiyar/indic-tts-mini-24k).

**Vocoder:** publisher local licence expressly covers weights/conversion as MIT; upstream metadata corroborates MIT. That does not furnish individual speaker consent. LibriTTS has separate public CC BY evidence in the preserved5G.7 audit. [Official Vocos card](https://huggingface.co/charactr/vocos-mel-24khz).

**WAV-only outputs:** determine applicable output obligations; do not automatically transplant all software/model distribution terms onto generated speech or assume copyright ownership in AI output. Retain conservative provenance credits without claiming that a credit resolves missing permissions.5G.7's attribution block is preparatory; update selected actual speed/pause settings in any future approved notice, retaining old reports unchanged. [Official Indic Tiny model card](https://huggingface.co/sulabhkatiyar/indic-tiny-tts-telugu).

## Packaging-policy finding

Current filtered-copy policy is build-only; runtime rights rejection and physical exclusion are separate protections. It excludes unverified catalogue paths, full-byte-identical aliases and raw/base64 full matches. It is **not** a complete allowlist of every new voice file: uncatalogued recordings and transformed/transcoded equivalents are not proven detected. No defect repair is authorized here. Future approved build verification must cover prototype imports, hashed filenames, alternate URLs, source maps, encoded/transcoded copies and release archives explicitly. Do not rely on file extensions or name-only checks.

## Exactly what remains blocked

Rights resolution remains incomplete for R03 assurance scope if required, R04 independent subset assurance if required, R05 applicable gated terms, R06 stock-speaker/non-copyright permissions and R07 generated-output commercial scope. These require external clarification or a documented supported release assessment; this audit cannot invent the answers. R09 original-text/file provenance sign-off, R10 distribution-specific notices and R11 exact shipping approval/audit are internal actions after rights scope is established. R12 listening/content remains independently blocked by5H.12. R01/R02 licence declarations are resolved; R08 public corpus licence is established but does not resolve R06.

No need to obtain an unnecessary new licence for rights already granted; seek clarification only for actual unresolved scope. No final voice approval, language certification, broader Kalki IP clearance or production rights approval is issued. **NO-GO; stop after reporting.**
