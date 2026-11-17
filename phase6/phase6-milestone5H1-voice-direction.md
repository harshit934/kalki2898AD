# Milestone 5H.1 — Bhairava voice direction

15 November 2026. Research and read-only sample inspection only.

## Conclusion

**Indic Tiny `te_M` remains a useful neutral prototype, but the required emotional range is not established.** Keep one consistent voice identity as the preferred direction. Do not approve a production voice or use a second voice to disguise missing expressivity.

The five 5G.8 WAVs were reopened, decoded and checked against their recorded SHA-256 values: **5/5 unchanged**, mono 24-kHz/16-bit PCM, complete declared frames. Durations: guidance 4.9287 s; combat 7.4253 s; completion 5.5793 s; boss 4.0007 s; fallback 5.0567 s. No new synthesis or listening/ASR assessment occurred. Earlier clipping checks are historical evidence, not a fresh perceptual evaluation.

## What the installed implementation actually supports

Exact files: `phase6/local-tts-evaluation/metadata/sulabhkatiyar--indic-tiny-tts-telugu/config.json`, `indic_tiny_tts/constants.py`, and `indic_tiny_tts/export/onnx_infer.py`.

- Released configuration uses `style=read` and exposes only `read: 0` in its style-ID mapping. All five samples used that same style.
- The constants file includes `read`, `conv`, `command`, `unknown`; their presence is not evidence that the released configuration offers a working emotion selector. Changing only `self.style` would not add a missing key to the configured mapping. No edits or experiments were performed.
- The synthesis API exposes speed/seed/noise, not named urgent/authoritative/cinematic controls. Speed changes length scaling; randomness changes are not reliable emotion control.
- The preserved publisher material states emotional recordings were excluded from this model's training selection. That limits evidence for emotion; it does not prove the model can never produce expressive prosody.

## Direction requirements and current status

- **Energetic:** require stronger rhythmic emphasis and dynamic intonation without rushed articulation. Current support **UNVERIFIED**; speed alone is inadequate evidence.
- **Urgent:** require prompt onset, clear key words and preserved negation under combat conditions. Current support **UNVERIFIED**. Greater volume does not establish urgency or intelligibility.
- **Authoritative:** require controlled emphasis, stable identity and deliberate phrasing without shouting. Current support **UNVERIFIED**; male metadata or low pitch cannot certify authority.
- **Cinematic:** require intentional pauses, emotional progression and consistency across lines. Current support **UNVERIFIED**; reverb, pitch shifting or compression would not establish acting quality and were not applied.

These are proposed evaluation criteria, not observations that the samples sound flat, aggressive, mature or incorrect. Text category is not vocal delivery: a combat instruction generated in read style is not proof of an urgent performance.

## One voice versus two

**One expressive identity — preferred.** Preserves who is speaking across exploration, combat and completion, simplifies subtitles and rights tracking, and avoids an unexplained identity change. Risks include style prompts altering timbre or pronunciation; future comparisons must hold speaker, text and baseline settings fixed.

**Two identities for one Bhairava — not recommended now.** A neutral narrator plus a different combat voice might provide contrast, but can make the character sound replaced, doubles pronunciation/rights validation and requires clear routing/interruption design. No evidence shows this would solve Telugu clarity. No new routing or second character is authorized by this report.

**Two roles** could be coherent only if separately authorized as distinct existing speakers with explicit labelling and independent permissions. Do not silently assign a new voice to Bujji or alter the current assistant to justify the split. Two engines claiming to be the same speaker also require an identity-consistency test; a shared name is insufficient.

## Recommended sequence — proposed, not authorized

1. Retain the five current samples and their pending language status as a neutral baseline.
2. Resolve the leading expressive candidate's licence/data access questions before any download. Indic Parler is the first research candidate; see the companion comparison for blockers. No fully cleared expressive replacement was established in this audit.
3. If separately approved, check RAM/disk/runtime compatibility, then render a bounded **offline** same-speaker/same-text style comparison. Do not run a heavy model alongside gameplay or add live synthesis to the game.
4. Assess urgency/energy/authority separately from clarity and identity; log unsupported prompts or unsuccessful delivery instead of inventing scores. Preserve punctuation and original wording for controlled comparisons.
5. Stop if licence, hardware or usable assessment remains unresolved; keep the current text fallback. No production integration or voice approval follows automatically from a successful WAV.

No human reviewer is required by this recommendation. Any later AI pronunciation result must be labelled AI-tested, not human-certified. This milestone used no local listening/ASR capability and therefore cannot establish subjective emotional delivery.
