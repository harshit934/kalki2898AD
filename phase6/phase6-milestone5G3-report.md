# Milestone 5G.3 — Zero-credit TTS investigation report

15 November 2026. **PASS — investigation completed; audio quality and synthesis remain NOT TESTED.**

## Verified findings

- Inspected all sixteen preserved male stock preset preview URLs with metadata-only HEAD requests. **16/16 HTTP 200**, `audio/mpeg`, immutable public caching and modification dates. They serve existing static media; original recording/synthesis provenance is unknown. No audio bodies requested, playback performed or generated.
- The first sandboxed network check encountered DNS resolution failures. A permitted network-enabled retry succeeded for all sixteen; the earlier local-network failure was not a provider outage. Successful exact per-voice headers/URLs are preserved in `milestone5g3-investigation/preview-head-results.json`.
- Existing preview metadata provides no Telugu locale, and none was inferred from a voice name. Static previews do not accept the project's text.
- Current connected `seed_audio` model read reports unlimited capability in principle, but its account notice says free-trial unlimited is not currently spendable. The zero remaining video-preset counter is not a usable TTS allowance. No spendable zero-credit custom-text path was established for these sixteen voices.
- The earlier 0.9-credit quote is sample-specific, not a universal minimum. No new synthesis/cost call submitted.
- Inspected current primary-source documentation for Azure, ElevenLabs, Google, Indic Parler, eSpeak NG and Edge TTS. Sources and qualifications are linked in the companion reports.

## Unverified and unresolved

- No Telugu pronunciation, fluency, maturity, cinematic emotional range or best-three ranking can be established without permitted audio assessment.
- No live gallery UI/custom-text/download behavior, new account eligibility, billing balance or commercial-output clearance independently verified.
- No way established to map the sixteen Higgsfield UUIDs onto alternative providers. Testing another provider is an alternative-voice feasibility test, not completion of the original sixteen-voice audition.
- No exact universal minimum synthesis charge found; no unsupported low-cost model substituted.

## Deliverables and changed files

Created only:

- `phase6/phase6-milestone5G3-tts-alternatives.md`
- `phase6/phase6-milestone5G3-cost-comparison.md`
- `phase6/phase6-milestone5G3-report.md`
- `phase6/milestone5g3-investigation/inspect_previews.py`
- `phase6/milestone5g3-investigation/preview-head-results.json`
- `phase6/milestone5g3-investigation/integrity-results.json`

The helper requests only HTTP headers, reads hashes and writes isolated evidence. No production audio/source/configuration, rights checks, drafts or existing report changed. **357/357** recorded production/source/configuration hashes and **3/3** original Milestone 5E inputs match the preserved baseline. All fifty-one drafts remain unchanged. No personal saves accessed. This is not a new independent 47-file/14-copy/11-save-baseline audit.

Build/lint unnecessary for isolated documentation and metadata investigation. No model/dependency installed or downloaded, no credits spent, purchase/subscription/account created, generation request sent, actor reference used, or test server launched. Shell checks completed; no owned process remains to stop. No rollback of production required.

## Recommended next action

After separate authorization to synthesize, test **one unchanged Telugu draft using Azure Speech F0 and stock `te-IN-MohanNeural`**, preserving evaluation-only output outside production. This avoids Higgsfield credits and offers a documented Telugu male baseline. Verify F0 eligibility first; stop rather than switch to paid billing. Static preview inspection can precede it, but cannot certify Telugu quality. Applicable commercial rights must be addressed separately before any integration.

**Stopped after investigation. No audio generated and no production voice chosen.**
