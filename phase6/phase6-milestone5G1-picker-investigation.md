# Milestone 5G.1 — Voice picker capability investigation

15 November 2026. Investigation only; no voice selected or audio generated.

## Conclusion and correction to Milestone 5G

The API supports stock-voice selection through an exact `voice_id` and `voice_type: "preset"`. A separate selection-commit endpoint is unnecessary. The previous report's wording about an unavailable agent-operated commit action was too broad: the limitation concerns the connected tool's documented picker workflow, not the generation API's ability to accept a voice.

When the pair is missing, the connected tool instructions require `list_voices` to open its picker and obtain the user's selected pair in a new user turn. No selection was made during this investigation. Per-voice Telugu pronunciation, native locale, depth and performance suitability remain unverified.

## Evidence and scope

- Preserved catalogue: `phase6/milestone5g-voice-selection-20261115/voice-picker-evidence.json`. First page: 50 records, 16 male stock presets; `has_more=true`, next cursor `:49`. These are not necessarily every available male voice.
- Available connected-tool documentation: `list_voices`, `generate_audio` and read-only model schema lookup. Fresh schemas saved in `phase6/milestone5g1-picker-20261115/model-schemas.json`.
- Derived catalogue and integrity checks: `phase6/milestone5g1-picker-20261115/verification-results.json`.
- Catalogue evidence was reused rather than reopening a generation-oriented picker. Native picker layout and button labels were not observed. No claim that the client cannot render a picker is justified.

## Selection interfaces

**UI:** tool documentation describes a picker returning the selected ID/type in a subsequent user message. Its actual appearance and exact button labels are unverified here. `selection_action: "generate_pending_audio"` in catalogue data is an action indicator, not proof of selection or synthesis.

**API and IDs:** `generate_audio.params` exposes `model`, `voice_id` and `voice_type`; model-specific requirements still apply. `seed_audio` accepts the pair; `text2speech_v2` requires it alongside a provider `variant`. For `elevenlabs_v4`, each required `dialogue` item contains `text`, `voice_type` and `voice_id`. Selecting the engine alone does not select a voice. Custom `element` voices are distinct from stock `preset` voices and are outside this stock-voice task.

**Configuration:** the exact pair can be retained in a future isolated prototype request/configuration. No standalone global voice-selector or persistent voice-setting endpoint is documented in the inspected tools. No configuration was changed.

**Pagination:** `list_voices` takes optional `size` and `cursor`. Follow returned cursors for more entries. No language or gender filter is exposed by its request schema; inspect returned fields instead.

## The 16 inspected male stock presets

All have `voice_type=preset`, `gender=male` and a `preview_url`. All have **UNVERIFIED voice-specific Telugu/India locale and pronunciation**:

- Grady — `e2a2d2e6-9ed2-59cd-82af-feaa27f8a678`
- Holden — `3c9d6053-6334-592c-8997-4e325286af3f`
- Arthur — `30fc8796-ceb6-4a66-b3a7-4a145ef7f346`
- Archie — `bd072316-f77c-588b-b6e5-e46b9b03d008`
- Fraser — `6705e465-7b52-5915-a1d8-b1222885e01d`
- Benji — `e6f9b893-51b1-51d3-afe9-9e0482cb7ac1`
- Cillian — `d8ba9f14-8a24-44db-932b-99e16c45bd32`
- Dylan — `b847bc29-f184-583a-8ad9-d1f1e16d1a60`
- Reid — `66469f5a-10db-586a-bab1-72f6ee66ba69`
- Emmett — `3c7d32be-0182-5c5e-aa6a-663409bfbb26`
- Desmond — `563f728c-e249-5a85-97ab-8461e8c09da6`
- Cody — `1ffcdbb3-078b-5491-959d-359e3021e917`
- Ian — `472a562a-4c33-5114-8210-d6ffa1e4e2c5`
- Evan — `f7a46aa0-183a-5327-b554-e71d8c0071bb`
- Jasper — `a7b8abe9-47f1-553e-a9df-87945a7e5bc8`
- Alden — `fec5acae-d801-5761-8d2c-4c2c75db3e2a`

Returned fields are `voice_id`, `voice_type`, `name`, `gender`, `preview_url`, `logo_url`. There is no language, locale, accent, pitch, maturity, emotion or model-binding metadata. Names provide no evidence of language or actor identity. None can presently be certified as a Telugu-native stock voice; that does not establish that they cannot synthesize Telugu.

## Telugu support and previews

Official model documentation lists Telugu (`te`) for Eleven v4. Its Multilingual v2 language list omits Telugu. This confirms engine-level capability only, not any catalogue preset's pronunciation or native locale. [ElevenLabs model documentation](https://elevenlabs.io/docs/overview/models/).

The connector's `elevenlabs_v4` schema exposes dialogue voice pairs but no locale/language override. Do not invent a `te-IN` parameter. `text2speech_v2` with `variant=elevenlabs` does not identify the underlying model version, so that alias alone cannot establish Telugu compatibility. `seed_audio` metadata inspected here does not establish Telugu support.

All 16 presets expose pre-existing preview URLs before synthesis. Exact URLs remain in the preserved catalogue and derived inventory. They were not fetched or auditioned; availability of a URL is not proof of reachability, Telugu preview content, pronunciation quality or suitability. No synthesis is necessary to inspect those metadata fields.

## Exact next selection steps — future authorization only

1. In a separately authorized prototype turn, call `list_voices` alone to present the documented picker. Keep selection restricted to stock male `preset` entries; paginate if needed.
2. The user previews and chooses a stock voice through the picker choice control, returning the exact `voice_id` and `voice_type` in a new message. No specific button label is asserted because the rendered UI was not observed.
3. If the client shows only catalogue text, explicitly return a choice in chat: `Use stock voice [catalogue name], voice_type=preset, voice_id=[exact catalogue ID]`. This is a voice choice, not a request for human linguistic review. No particular preset is recommended without audition evidence.
4. Retain that exact pair in the isolated prototype. Use an explicitly Telugu-capable engine, subject to its current schema and availability; for v4 place the pair in the dialogue item. Do not silently substitute a voice or infer compatibility from its name.
5. Only after authorization for synthesis and the applicable cost workflow, test one unchanged existing Telugu draft. Assess sample completeness and audio quality; language remains unverified unless supported by evidence. Do not mark drafts approved or integrate into gameplay.

No user action is required to finish this investigation. A returned stock-voice choice is required by the connected workflow before a later synthesis test. No suitable individual Telugu voice has yet been verified.

## Preservation and stop

357/357 recorded production/source/configuration hashes and all three Milestone 5E input hashes match the preserved baseline. No personal save was accessed. This is not a new independent 47-file manifest or save-baseline verification. No production, asset, rights, draft or configuration changes; no generation job, credit use, browser, test server or audio process launched. Existing 5G reports and evidence remain preserved. Build/lint were unnecessary for this documentation-only investigation.
