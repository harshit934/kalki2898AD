# Milestone 5G.2 — Telugu stock voice audition report

15 November 2026.

**FAIL / BLOCKED — audition and ranking could not be completed because synthesis was rejected for insufficient workspace credits.** No conclusion about voice quality is supported.

## Work executed

1. Read the Milestone 5G selection/test reports and 5G.1 investigation; preserved their evidence.
2. Retrieved all sixteen exact male `preset` ID/type pairs from the preserved provider catalogue. No IDs invented, no additional voices selected. The requested API selection was used directly; no manual picker selection was requested.
3. Chose unchanged original draft `BH6-5E-001` as identical test text for every candidate. All fifty-one original dialogue entries remain unchanged and unapproved.
4. Read connected generation documentation and project preference (`auto_create_project=false`); no remote project created.
5. Cost preflight: `seed_audio`, 0.9 credits per sample. No job submitted by preflight. Approximate set estimate: 14.4 credits, subject to provider pricing and execution conditions.
6. Submitted one actual synthesis request for the first catalogue candidate, Grady, exact ID `e2a2d2e6-9ed2-59cd-82af-feaa27f8a678`, type `preset`.
7. Provider rejected the request: `Out of credits on free (null) plan in Private workspace.` Structured error code: `INVALID_ARGUMENT`. No job ID, result URL or audio returned. No observed generation charge is claimed; account billing was not independently audited.
8. Stopped further submissions after the global credit failure. Fifteen entries are explicitly NOT SUBMITTED, not falsely recorded as synthesis failures or successful samples.

## Identical intended configuration

- Engine: `seed_audio`, the connected tool's documented default. No engine substitution was authorized or made. Engine/preset Telugu quality remains an audition question, not an established fact.
- Voice: each exact catalogue ID, `voice_type=preset`.
- Output: WAV, 24,000 Hz; count 1.
- Speech rate, loudness rate and pitch rate: 0 for all voices.
- No reference audio, custom voice element, actor imitation prompt or movie input.
- Text, exactly from the existing draft:

> కాపలాదారుల్ని ఓడించు. తర్వాత వార్డెన్‌ను ఎదుర్కొని, అవశేషాన్ని సేకరించు. క్రిస్టల్స్ సేకరించడం, రిలేలను స్కాన్ చేయడం తప్పనిసరి కాదు.

Source text remains PENDING / UNVERIFIED. It was sent to the connected external TTS provider as authorized for audition; no movie or personal-save data was sent.

## Results

- **PASS:** sixteen unique exact male stock preset pairs recorded; identical text and intended settings recorded for every entry.
- **FAIL / BLOCKED:** synthesis, local sample storage and comparison. Generated samples: **0/16**. Requests rejected before a job: **1**. Requests not submitted after shared blocker: **15**.
- **UNVERIFIED / NOT TESTED:** Telugu pronunciation, fluency, intelligibility, maturity/depth, emotional delivery and consistency. No fabricated AI listening or human verification.
- **NOT AVAILABLE:** best three; all candidates remain unranked. No production voice selected.
- **PASS:** source/draft preservation against the existing recorded baseline: **357/357** production/source/configuration hashes and **3/3** Milestone 5E source-input hashes match. Fifty-one draft entries remain available.
- No personal-save profile accessed, production gameplay/audio or rights checks modified. This narrow comparison is not a fresh independent 47-protected-file, 14-copy or 11-save-baseline audit.

## Deliverables and changed files

Created only these isolated report/preparation files:

- `phase6/phase6-milestone5G2-audition-results.csv` — sixteen entries, exact IDs, intended text/configuration, explicit failure/not-submitted statuses, empty sample paths and unranked quality fields.
- `phase6/phase6-milestone5G2-voice-ranking.md` — why no ranking can be supported.
- `phase6/phase6-milestone5G2-report.md` — this report.
- `phase6/voice-audition/audition-manifest.json` — exact intended configuration, catalogue records and captured error.
- `phase6/voice-audition/integrity-results.json` — recorded hash comparisons.
- `phase6/voice-audition/prepare_blocked_results.py` — local report-data preparation only; no generation code or production changes.

No audio file exists in the audition directory. Blank CSV sample paths mean no generated sample, not a missing successful download. No build/lint run was needed for isolated documentation/preparation. No browser, audio runtime, development server or test process was started; shell checks completed. Rollback requires no production restoration: these new reports/evidence can be removed later only if requested. Nothing was deleted.

## Stop and next prerequisite

Stopped at the documented account credit blocker. Restore sufficient connected-workspace generation capacity, then resume the same sixteen-voice audition after checking cost. Do not infer licensing clearance, language approval or production acceptance from a future technical generation success. No voice integration or subsequent milestone begun.
