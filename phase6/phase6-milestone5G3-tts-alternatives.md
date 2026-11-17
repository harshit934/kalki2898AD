# Milestone 5G.3 — Zero-credit TTS alternatives

Investigation date: 15 November 2026. No synthesis, playback, purchase, subscription, model download or installation performed. No candidate ranked by sound quality.

## What the sixteen existing previews actually offer

Read the preserved 5G catalogue and 5G.1/5G.2 findings. Every inspected male preset has a stable URL of the form `https://d1xarpci4ikg0w.cloudfront.net/audio_voice/<exact-voice-id>/preview-<hash>.mp3`. Exact names, IDs and URLs are retained in `milestone5g3-investigation/preview-head-results.json`.

Metadata-only HTTP HEAD requests returned **200 for all 16**. Each returned `audio/mpeg`, a content length, last-modified date and `public, max-age=31536000, immutable` cache policy. These are strong evidence of existing, cached audio objects, not per-request synthesis from editable text. Their original creation method—studio recording versus earlier TTS—is unknown. “Prerecorded” here means already-existing preview media, not a verified human performance.

No text parameter or generation endpoint was called. Retrieving these static resources does not submit a synthesis job; no account credential was required for HEAD. This supports zero-generation-credit metadata access. A billing dashboard was not inspected, and audio playback was not tested. No audio bodies were downloaded. Their spoken language, pronunciation and delivery remain unknown.

The previews can potentially shortlist timbre/depth after a later permitted listen. They cannot establish pronunciation of the project's identical Telugu text. No language/locale metadata exists on these sixteen catalogue records. No evidence supports substituting their preview URLs into an undocumented custom-text endpoint.

## Connected Higgsfield tool

Current read-only `seed_audio` metadata exposes voice ID/type, speed, pitch, loudness, format and sample rate, but no locale or free custom-text-preview parameter. It reports `supports_unlim=true`; accompanying account notice says free-trial unlimited is **not spendable right now**. A separate video-preset counter is zero and is not a speech allowance. This does not establish every possible web promotion or entitlement.

The prior 132-code-point Telugu sample was quoted at 0.9 credits and rejected for insufficient workspace credits. That is an observed sample price, **not a published minimum charge for all inputs/models**. No fresh cost or synthesis request was made. Public pricing did not expose a dependable speech-specific free quota/minimum in the retrieved page; account eligibility remains separate from advertised plan features. [Higgsfield pricing](https://higgsfield.ai/pricing).

## Cloud alternatives

### Microsoft Azure Speech — preferred first functional test

Microsoft's voice listing identifies `te-IN-MohanNeural` as male Telugu (India). This is an alternative voice, not an alias for any of the sixteen Higgsfield presets. [Voice support](https://learn.microsoft.com/azure/cognitive-services/speech-service/language-support?tabs=tts).

Microsoft documents a no-signup Voice Gallery and supports SDK/REST synthesis. Exact current gallery availability, custom-text allowance and download controls were not exercised. Use the official gallery for initial inspection; do not assume a demo exports files. [Quickstart](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/get-started-text-to-speech?tabs=windowsinstall).

A neural stock voice is a promising clarity baseline; cinematic emotion and Telugu quality remain untested. Do not assume the generic SSML emotional-style feature applies to Mohan. The official F0 route is the more reproducible choice when custom text/file output is required; it requires an eligible account/resource. See cost comparison for quota and rights caveats.

### ElevenLabs direct

Direct-provider allowances are independent of Higgsfield credits and UUIDs; no mapping of these sixteen IDs to native ElevenLabs IDs is established. Telugu is supported at model level by v3/v4, not Multilingual v2. Voice-native locale and pronunciation require checking the chosen stock voice. [Model documentation](https://elevenlabs.io/docs/overview/models/).

The product guide explicitly says custom-text voice preview consumes credits; unchanged website regenerations have narrow conditions and do not make a sixteen-voice audition free. Audio tags can influence emotion but do not guarantee it. [TTS guide](https://elevenlabs.io/docs/eleven-creative/playground/text-to-speech).

Native API and web access are documented. Existing multilingual previews can be available for some voices, but do not imply editable Telugu previews for this catalogue. Free-plan testing may cost no money while still consuming that provider's credits. Production rights require separate clearance.

### Google Cloud Text-to-Speech

The official list includes male `te-IN-Chirp3-HD-Algieba` and other Telugu voices. It is an alternative identity, not one of the existing sixteen. API and provider-hosted samples are available; quality, emotional range and actual account access were not tested. [Supported voices](https://docs.cloud.google.com/text-to-speech/docs/list-voices-and-types).

Free usage depends on model/tier and eligible billing setup. It is a practical second cloud option, but more setup than a gallery inspection. No account, billing link or API key was created. Output distribution permission and applicable account/service terms must be captured before game packaging; a public demo or free quota is not a rights grant.

## Local/offline alternatives

### AI4Bharat Indic Parler-TTS

The model card lists Telugu speakers Prakash, Lalitha and Kiran; speaker gender should be verified rather than inferred from names. It supports description-controlled voice/style and identifies Apache-2.0 licensing. Repository access requires accepting its conditions. [Model card](https://huggingface.co/ai4bharat/indic-parler-tts).

Potentially suitable for offline expressive experiments without an actor reference, but not a verified replacement for the sixteen stock voices. Downloads, dependencies, storage and inference memory would add substantial setup compared with a short cloud test. Exact footprint and speed on the GTX 1650/8 GB machine were not measured; no real-time or 4 GB-fit claim. Model licence, access conditions and any output restrictions must be retained separately. Not installed in the inspected Python environment.

### eSpeak NG

Supports Telugu `te` and runs offline with programmatic/CLI access. [Languages](https://github.com/espeak-ng/espeak-ng/blob/master/docs/languages.md). Its compact formant synthesis is explicitly less natural than larger recording-based synthesizers. Suitable for a low-resource text/pronunciation smoke test, not evidence of a mature cinematic stock male voice. Gender-like variants do not establish a natural stock speaker. [Project](https://github.com/espeak-ng/espeak-ng).

No executable found on PATH. Software distribution obligations and output rights differ; do not automatically apply the code licence to every generated file or assume no conditions. No installation performed.

### Edge TTS — online, not offline

Installed `edge-tts` version: 7.2.8. It accesses Edge's online service without an API key; local Python installation does not make synthesis offline. [Repository](https://github.com/rany2/edge-tts). A previous voice-list request hung; no retry/synthesis performed here. Third-party client licensing does not establish Microsoft service/output redistribution rights or a service-level guarantee. Not the preferred reliable/cleared testing route.

Piper executable/package and `parler-tts` package were not found in the checked environment. No Telugu Piper model was verified. No unsupported “offline neural Telugu male” capability is claimed.

## One recommendation

**Use the official Azure Speech F0 resource with stock `te-IN-MohanNeural` for one unchanged short draft, after separate permission to synthesize.** It avoids Higgsfield credits and has a named Telugu-India male voice plus a documented free allowance. If only listening is needed, inspect its official Voice Gallery first; custom-text/download access there remains unverified. Keep output isolated and evaluation-only. This establishes a Telugu baseline, not a ranking of the original sixteen, and does not authorize production distribution.
