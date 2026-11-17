# Milestone5H.16A — Final controlled test matrix

**PREPARATION ONLY. No synthesis, credentials, account creation, purchase or voice approval.** Prepared15 November2026, Asia/Calcutta, using5H.15's feasibility audit and plan. No fresh entitlement/API check; their documentary terms are not an account-readiness PASS.

## Frozen scope

Model `bulbul:v3`; locale `te-IN`; stock voices **shubh** and **ratan** only. No cloning, actor material, reference recordings or fallback to v4. Five original project texts below; do not edit spelling, punctuation, whitespace, sentence order or insert SSML/emotion tags. Normalization is provider-managed and may differ from Tiny; no v2 preprocessing, pitch or loudness parameter. Every future request must explicitly select model/locale/speaker rather than depend on service defaults.

The user's preparation authorization permits selection of these existing test fixtures; it does **not** constitute human language review, rights clearance or approval to execute. Original51 drafts and previous decisions remain unchanged.

## Exact Telugu fixtures and Tiny comparison

### Calm assistance — BH6-5E-002

**Exact test input (unchanged):**

మిగిలిన కాపలాదారుల్ని ఓడించు. ఆ తర్వాత పోరాట ప్రాంగణం వైపు వెళ్లు.

English: Clear the remaining patrols, then approach the arena.

- Text SHA-256 (UTF-8, no added newline): `b6e46ca19483a4824e73443697efe3726c706ddb17c17fa8302689d68562257e`; 66 Unicode code points.
- Source context: Mission 1 objective-style prompt; attempt not ended, relic not collected, boss not intro/active/defeated, patrols remain.
- Tiny comparator: `local-tts-evaluation/milestone5G8/BH6-5E-002.wav`.
- Proposed category profile: pace0.95, temperature0.50, identical for shubh and ratan.
- Draft status remains `PENDING` / `UNVERIFIED`; approved only as the existing proposed evaluation fixture, not production content or linguistically certified text.

### Urgent warning — BH6-5E-004

**Exact test input (unchanged):**

ఆరోగ్యం తక్కువగా ఉంది. కాస్త దూరం ఉంచు. ఎదురుదాడికి ముందు శత్రువు దాడి మొదలుపెట్టే కదలికను గమనించు.

English: Health is low. Create distance and read the wind-up before countering.

- Text SHA-256 (UTF-8, no added newline): `25bf252dd0e6b89fe59d56ca917ff2566d61ef604898c987187b45eaafb6ef50`; 99 Unicode code points.
- Source context: Mission 1 combat prompt; health <=30. This branch has priority even if a boss is active.
- Tiny comparator: `local-tts-evaluation/milestone5G8/BH6-5E-004.wav`.
- Proposed category profile: pace1.10, temperature0.65, identical for shubh and ratan.
- Draft status remains `PENDING` / `UNVERIFIED`; approved only as the existing proposed evaluation fixture, not production content or linguistically certified text.

### Combat instruction — BH6-5E-001

**Exact test input (unchanged):**

కాపలాదారుల్ని ఓడించు. తర్వాత వార్డెన్‌ను ఎదుర్కొని, అవశేషాన్ని సేకరించు. క్రిస్టల్స్ సేకరించడం, రిలేలను స్కాన్ చేయడం తప్పనిసరి కాదు.

English: Clear the patrols, face the Warden, then collect the relic. Crystals and relay scans are optional.

- Text SHA-256 (UTF-8, no added newline): `b8289ccbf3842be452bff2cec0f9c3b10d1dfb128d3ea434efebe5de4597dd40`; 132 Unicode code points.
- Source context: Mission 1; Start guidance prompt (topic=initial).
- Tiny comparator: `local-tts-evaluation/indic-tiny-male-evaluation.wav`.
- Proposed category profile: pace1.05, temperature0.60, identical for shubh and ratan.
- Draft status remains `PENDING` / `UNVERIFIED`; approved only as the existing proposed evaluation fixture, not production content or linguistically certified text.

### Boss encounter — BH6-5E-037

**Exact test input (unchanged):**

వార్డెన్‌ను ఎదుర్కో. దాడికి సిద్ధమయ్యే కదలికను గమనించు.

English: Face the Warden; watch its attack wind-up.

- Text SHA-256 (UTF-8, no added newline): `47ee905f878620c799bd9e20029019b4ee4032da0a60d0d07fe290c473842d94`; 55 Unicode code points.
- Source context: Mission 1 objective-style answer; gameOver=false, relic=false, bossStatus=active.
- Tiny comparator: `local-tts-evaluation/milestone5G8/BH6-5E-037.wav`.
- Proposed category profile: pace1.08, temperature0.65, identical for shubh and ratan.
- Draft status remains `PENDING` / `UNVERIFIED`; approved only as the existing proposed evaluation fixture, not production content or linguistically certified text.

### Emotional/triumphant proxy — BH6-5E-013

**Exact test input (unchanged):**

మిషన్ పూర్తయినట్టు నమోదుంది. వివరాల జాబితాలో సేవ్‌లో ఉన్న బహుమతులనే చూపిస్తున్నాను.

English: A completion is recorded. The facts list shows actual saved rewards.

- Text SHA-256 (UTF-8, no added newline): `b24a39251ee0e47d7f7e884e5b2a50a669688a42cc8c0956ca3aa98827747027`; 83 Unicode code points.
- Source context: Mission 1 completion/replay prompt; savedComplete=true and c.replay=false.
- Tiny comparator: `local-tts-evaluation/milestone5G8/BH6-5E-013.wav`.
- Proposed category profile: pace1.00, temperature0.70, identical for shubh and ratan.
- Draft status remains `PENDING` / `UNVERIFIED`; approved only as the existing proposed evaluation fixture, not production content or linguistically certified text.

Source51-entry CSV SHA-256: `28d0a313414eb8bb4ee99c4be65eaad3fd83da9867c7f8b8df5b43caf1f7bbab`. Before future execution verify that hash and each exact text hash; if they differ, stop for reconciliation rather than silently taking new text.

**Emotional coverage limitation:**013 states that completion/rewards were recorded. It can test measured confidence, not authentic dramatic triumph. No suitable approved dramatic text has been invented.001 already has a Tiny neutral WAV but was not one of the five5G.8 samples; it is intentionally used for actual combat instructions instead of misclassifying fallback045. All texts are fixtures, not personal campaign observations.

## Consistency and request order

Neutral is pace1.00/temperature.60 for every category and both voices. Profiles vary only by category as specified, identically across voices. Target WAV24,000Hz; hold all other documented settings constant/omit unsupported fields. No reproducible seed assumed because none was established by5H.15. Pace/temperature joint changes cannot isolate either control's causal contribution to perceived emotion. No normalization, gain/pitch effects or replacement Tiny synthesis.

| Request | Dialogue ID | Speaker | Condition | Pace | Temperature |
|---|---|---|---|---:|---:|
| S01 | BH6-5E-002 | shubh | NEUTRAL | 1.00 | 0.60 |
| S02 | BH6-5E-002 | ratan | NEUTRAL | 1.00 | 0.60 |
| S03 | BH6-5E-004 | shubh | NEUTRAL | 1.00 | 0.60 |
| S04 | BH6-5E-004 | ratan | NEUTRAL | 1.00 | 0.60 |
| S05 | BH6-5E-001 | shubh | NEUTRAL | 1.00 | 0.60 |
| S06 | BH6-5E-001 | ratan | NEUTRAL | 1.00 | 0.60 |
| S07 | BH6-5E-037 | shubh | NEUTRAL | 1.00 | 0.60 |
| S08 | BH6-5E-037 | ratan | NEUTRAL | 1.00 | 0.60 |
| S09 | BH6-5E-013 | shubh | NEUTRAL | 1.00 | 0.60 |
| S10 | BH6-5E-013 | ratan | NEUTRAL | 1.00 | 0.60 |
| S11 | BH6-5E-002 | shubh | PROFILE | 0.95 | 0.50 |
| S12 | BH6-5E-002 | ratan | PROFILE | 0.95 | 0.50 |
| S13 | BH6-5E-004 | shubh | PROFILE | 1.10 | 0.65 |
| S14 | BH6-5E-004 | ratan | PROFILE | 1.10 | 0.65 |
| S15 | BH6-5E-001 | shubh | PROFILE | 1.05 | 0.60 |
| S16 | BH6-5E-001 | ratan | PROFILE | 1.05 | 0.60 |
| S17 | BH6-5E-037 | shubh | PROFILE | 1.08 | 0.65 |
| S18 | BH6-5E-037 | ratan | PROFILE | 1.08 | 0.65 |
| S19 | BH6-5E-013 | shubh | PROFILE | 1.00 | 0.70 |
| S20 | BH6-5E-013 | ratan | PROFILE | 1.00 | 0.70 |

This fixed order runs10 neutrals then10 profiles. It balances text/settings between voices but always leads with shubh and has a stage-order confound; do not treat latency or subjective differences as randomized causal estimates. The later playback page should alternate listening order. No extra pilot: S01 is the first matrix request and counts toward20. Inspect it before continuing; never duplicate it as a free warm-up.

## Hard cost and request limits

- **20 HTTP synthesis attempts maximum**, including failed, timed-out or ambiguous attempts. Disable HTTP/client/SDK automatic retries. One request at a time; no external job, hidden polling generation, batch expansion or concurrent runner. A failed row stays failed; no substitute request, voice or text.
- **INR10 total maximum**, including consumed promotional/free account credits, generation charges and applicable taxes/rounding attributable to these calls. No purchase, top-up, subscription or resource creation authorized. Request count and spend ceilings stop independently, whichever occurs first.
- Five text lengths sum435 code points; repeated across voices/conditions gives1740 locally estimated billable characters. At5H.15's INR3/1000 pay-as-you-go rate, nominal base cost is **INR5.22** before billing-unit differences/taxes/rounding. Code points are not a guaranteed provider billing unit. Lower quota or free-credit status is not permission to extend the matrix.
- Before any call, verify actual current price, character accounting, selected-stock entitlement, applicable tax/rounding and available authorized credit. Reserve a conservative maximum charge for that call in a persistent nonsecret ledger, then reconcile documented actual usage. If authoritative charge/cap enforcement cannot be established, **do not start**. A local estimate alone cannot guarantee the provider-side ceiling.
- Use a dedicated run with no competing account generation so usage attribution is meaningful. Count uncertain requests as potentially charged; hold the full reservation and stop on unknown billing outcome. Never retry a network timeout to find out whether it was billed. Do not claim this cap is already implemented or guaranteed by the provider; a later approved runner must demonstrate it.
- Pricing, model/stock eligibility or rights changes from5H.15 trigger STOP before synthesis and a report for review—even if the new price appears lower. Do not silently accept new terms/plan or switch provider/version.402/429/503 stop this bounded run; no auto-top-up/backoff retry.

## Export and technical WAV checks

Propose existing REST interface with explicit WAV codec/rate, after verifying exact current field names. Decode returned base64 offline to a new isolated file; record request ID, status and nonsecret parameters. Require a valid RIFF/WAVE header, full declared frame readback, nonempty mono16-bit PCM24kHz, finite/nonzero signal, no full-scale clipping, exact duration and SHA-256. Codec mismatch or empty/corrupt output stops the run; preserve it as FAILED, do not transcode/resample/re-generate to disguise a mismatch.

Capture per-file generation/network/decode wall times, byte count, frames, duration, peak/RMS, method-labelled low-energy intervals and character/cost record. Mark missing telemetry UNVERIFIED. Waveform validity is not proof of word completeness, pronunciation or emotion. Output path must remain outside src/public/dist, proposed `phase6/sarvam-evaluation/milestone5H15/` from the approved planning baseline. Directory/runner not created here; refuse any pre-existing collision rather than overwrite.

Compare only same-ID Tiny originals:001 uses5G.6/5G.7 original;002/004/037/013 use5G.8 originals, with same-hash5H.7 controls where available. Optional prior Tiny profiles are supplementary and not parameter-matched: Tiny speed/pause are different controls from Sarvam pace/temperature. Preserve raw levels and note loudness bias; do not invent equal loudness or equal frontend conditions.

## Listening scorecard specification

A later isolated playback page offers both stock voices' neutral/profile and corresponding Tiny original, with no autoplay, single-sample playback, Stop all and visible errors. It must not access game saves. Listening ratings remain blank until actual listening, with reviewer/date/output device and exact file hash.

Score1–5:1 poor,2 weak,3 acceptable prototype,4 good,5 excellent for this sample. Blank means unassessed; never fill missing evidence with3.

- **Pronunciation:** distinct syllables, Telugu vowels/consonants, loanwords, names, negation and endings. Note exact word/time; keep UNVERIFIED when unable to assess. Do not infer correctness from the English gloss.
- **Naturalness:** rhythm, phrase breaks, word connection, sentence endings and absence of mechanical/rushed phrasing.
- **Clarity:** understandability at comfortable fixed volume; missing/truncated speech, distortion or masked low-energy words. Technical clipping tests are separate.
- **Emotional intensity:** appropriateness for calm/urgent/instruction/boss/confidence context, not maximum loudness. Note whether a profile improves over its same-voice neutral or merely speeds up.
- **Identity/suitability:** one consistent stock voice across categories, confidence and authority without actor imitation. Record per-pair preference and limitations. Do not mix best voices per category and claim a single consistent identity.

Proposed follow-up interpretation: sufficient actual ratings at≥3 clarity/naturalness and no meaning-reversing omissions for all five neutral lines in one fixed voice; assess category profiles independently. Unreviewed dimensions remain UNVERIFIED, and emotional/triumphant proxy cannot establish full dramatic range. These are prototype selection criteria, not production acceptance or a demand for a human-certified linguist.

## Latency scoring (separate from listening)

Record wall time from send to full response and decode separately; first-byte timing only where available. For offline authoring, proposed diagnostic5-point bands:5≤1s,4>1–2s,3>2–5s,2>5–15s,1>15–30s. A30s request timeout is failure/unknown charge and stops the run, not an automatic scored successful response. These bands are project preferences, not provider promises or live-game budgets.

Only one observation per exact condition: report individual times, min/median/max and request success count; label heterogeneous aggregation. Do not claim meaningful repeated-condition p95, steady-state speed or real-time suitability. Network roundtrip is not pure model inference time. No network call is proposed on the combat frame path; final approved exports would play offline.

## Credential, input and lifecycle security

No key requested, exposed, checked or provisioned now. Future user-managed secret should be consumed only in an approved authoring process from a secure/local process environment, never printed or stored in HTML/source/manifests, VITE variables, URLs, output audio metadata or logs. Redact authorization headers, error dumps and personal account fields; record only nonsecret entitlement/cost confirmations. No credentials in chat.

Use HTTPS direct official endpoint only after explicit approval. No SDK/package installation needed by this preparation; later tooling must be reviewed before execution. Send only frozen original fixture text, never personal saves, dynamic player data, movie material or voice references. Leave text-first production untouched and preserve runtime/build rights guards. No voice grant extends to provider software/model ownership.

## Additional stops, preservation and approval

Stop for missing authorization/configuration, unsupported exact voice/model/locale, unverified commercial eligibility, unexpected attribution/rights conditions, changed input hashes, unavailable resources, response/codec mismatch, request/cost cap, ambiguous billing, key exposure or any preservation mismatch. Preserve partial logs/results without secret data. No automatic alternative model, voice, text, plan, retry or conversion.

Before future approved execution snapshot WAV/draft/report/source hashes, keep the existing rollback path, and verify again afterwards. Terminate only an owned runner on failure. Do not touch personal saves or delete samples to free storage. Default rollback is stop using isolated output; there is no authorized production integration to undo.

**Exact separate approval required:**

> I authorize a single isolated Sarvam Bulbul v3 evaluation using only this20-row matrix, stock shubh/ratan and the five frozen Telugu texts. You may send at most20 synthesis requests and consume no more thanINR10 total in existing account credits/charges, subject to verified current pricing, billing and commercial eligibility. No purchases, account creation, installations, retries, substitutions or production integration. Stop on any failed gate and preserve evidence.

That approval must be accompanied by readiness of a user-managed eligible account with sufficient authorized existing credits; secret values must not be supplied in chat. It does not pre-approve generated audio, pronunciation, rights for hypothetical assets or production voice choice. If safe billing/eligibility cannot be verified, a general proceed instruction is insufficient to bypass the gate. **Stopped after preparation.**
