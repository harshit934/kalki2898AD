# Milestone5H.15 — Sarvam Bulbul v3 feasibility gate

**Checked15 November2026, Asia/Calcutta. Decision: CONDITIONAL for a separately authorized isolated prototype. Not production approval or authorization to synthesize.** Only public documentation and existing project evidence inspected. No account, credentials, API generation or tooling setup performed.

## Verified capability and limits

**Telugu/male voices — documented PASS, pronunciation UNVERIFIED.** v3 supports te-IN; official recommendations identify male `shubh` and `ratan`. Use exact short IDs, not v4 persona names. Both are candidates, not selected voices; depth, authority and native Telugu sound were not heard. Public catalogues do not establish account availability. [v3 guidance](https://docs.sarvam.ai/api/api-guides-tutorials/text-to-speech/bulbul-v3-best-practices), [voice catalogue](https://docs.sarvam.ai/api/api-guides-tutorials/text-to-speech/voices).

**Expressiveness — CONDITIONAL potential.** Pace0.5–2.0 and temperature0.01–1.0 are documented, defaults1.0/.6. Temperature changes variability/expressiveness, not guaranteed anger, urgency or triumph. No named emotion switch established. Pitch/loudness unsupported; no SSML. Punctuation/native sentence boundaries can influence delivery but no precise pause-time guarantee. No adjective or emotion tag should be inserted into spoken source text as if it were a supported control. [Controls](https://docs.sarvam.ai/api/api-guides-tutorials/text-to-speech/bulbul-v3-best-practices), [model limitations](https://docs.sarvam.ai/api/api-guides-tutorials/models/bulbul).

**Normalization — documented, accuracy UNVERIFIED.** v3 preprocesses automatically; language selection guides normalization. `enable_preprocessing` is not a v3 toggle despite appearing in the shared schema. Native Telugu script is preferred; Romanised Indic input can degrade quality. Loanwords, character names, suffixes, negation and numbers require actual audio/text comparison. No phoneme lexicon override or correctness guarantee was verified. [Model](https://docs.sarvam.ai/api/api-guides-tutorials/models/bulbul), [REST schema](https://docs.sarvam.ai/api-reference/text-to-speech/convert).

**API/export — documented feasibility, actual files UNVERIFIED.** Explicit model `bulbul:v3`, language_code `te-IN`, stock speaker and speech_sample_rate24000; choose WAV codec. REST returns base64 audio to decode, not a URL or already validated PCM. The current schema offers24kHz and other rates, defaults22050Hz, and v3 has2500-character REST limit. Opus appears in schema but docs warn it is rejected. Inspect actual RIFF/codec/channels/depth after generation; do not assume every export matches Tiny's mono16-bit24kHz merely from a WAV extension. [REST reference](https://docs.sarvam.ai/api-reference/text-to-speech/convert).

## Commercial game and output rights

Official commercial documentation expressly permits game/app exports generated on the user's account with credits consumed, including eligible verified-user INR100 free credits. It states retained commercial rights for exported output subject to terms. This is a substantially clearer output route than the current open-model evidence, not an approval of hypothetical assets. [Commercial policy](https://docs.sarvam.ai/api/getting-started/commercial-licensing).

The EULA assigns output rights as between parties, reserves software/model/voice ownership, disallows impersonation/deepfake misuse and competing-model training, and makes the user responsible for inputs/accuracy. Stock generation requires no user-supplied actor reference; use no clone. No special shubh/ratan prohibition or mandatory WAV-credit requirement was found in inspected public provisions. That absence is not an unconditional attribution waiver: inspect the actual selected voice/organisation agreement at evaluation time. Model/code/dataset licences are not transferred to the game by exported-output permission. Proprietary training provenance was not independently audited. No claim of exclusive copyright in every AI output. [EULA](https://www.sarvam.ai/eula), [Terms](https://www.sarvam.ai/terms-of-service).

**Production rights gate remains pending:** record applicable account/credit transaction, exact model/stock voice, selected input/output hashes, contract/date and export provenance; retain any applicable notices/restrictions. No account-specific entitlement verified. Model availability, undocumented voice-specific terms or account exceptions require clarification before shipping; no support message sent. Existing Indic Tiny5H.12/5H.13 decisions unchanged.

## Pricing, quotas and free-credit limits

Current official pricing lists v3 pay-as-you-go **INR3/1000 characters**, Pro2.85 and Growth2.70. Current REST/HTTP streaming limits are60/200/1000 requests/minute and WebSocket60/200/1000 concurrent respectively. Earlier Starter30/min evidence is historical; use the current page and later account limits.402 means insufficient credits;429 is throttling;503 can be backend load. No automatic top-up/retry is proposed. Account credit eligibility/balance, taxes, billing-unit handling and quotas are UNVERIFIED. Free credits are documented, not guaranteed to this user. [Pricing and limits](https://docs.sarvam.ai/api/getting-started/pricing), [free-credit commercial conditions](https://docs.sarvam.ai/api/getting-started/commercial-licensing).

## Latency and gameplay suitability

REST returns a whole file; streaming transports are documented for lower conversational latency. No actual latency measurement, regional round trip, load performance or SLA-based success is established. Published claims are not gameplay measurements. **Recommend authoring-time REST exports plus offline asset playback**, not a live network call for combat warnings. Keep text visible immediately, drop stale speech and reuse shared mute/priority/lifecycle design in5H.11 if later authorized. Streaming/live dynamic narration is outside this prototype and would require a separately approved backend/security/reliability design. [Transport guidance](https://docs.sarvam.ai/api/api-guides-tutorials/text-to-speech/bulbul-v3-best-practices).

## Security, offline and integration gates

- No credentials inspected, requested, printed or stored in this milestone. A later authorized tool uses a process-local secret/secure store and HTTPS header, never browser JS, public config, VITE-prefixed environment variables, HTML, URLs or committed files. Log only nonsecret settings/status, redact headers/errors. Do not put secrets or account personal data in the evidence package.
- No SDK needed in principle: an isolated authoring script could use existing HTTP/stdlib tools after approval. Never install a package silently. No account creation or billing change inferred from this plan.
- Game/offline playback distributes only separately approved static assets, never API keys or models. Validate no network request for offline speech; cache/path failures retain factual text. Do not package the current prototypes.
- No personal player state uploaded; test texts are original fixtures. Fixed recordings must not narrate invented dynamic rewards, health or completion. Underlying Telugu drafts remain PENDING/UNVERIFIED.

## Gate conclusion

**CONDITIONAL:** documentary feasibility supports a small test. Missing: explicit execution/credit authorization, eligible user-managed account, selected-stock/contract entitlement confirmation, actual WAV/latency results and actual listening. No deeper local inference RAM prerequisite is needed merely to research/export files, but future decode/storage resource checks remain sensible; no current hardware-fit or account readiness PASS asserted. No install, download, audio request or production action follows automatically. Stop after planning.
