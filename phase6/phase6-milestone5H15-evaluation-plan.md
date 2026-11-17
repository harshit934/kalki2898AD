# Milestone5H.15 — Controlled isolated evaluation plan

**PLAN ONLY. No execution approval.** Use existing original text, not movie dialogue, actor recordings, voice clones or newly invented events. Preserve18 existing WAVs and51 drafts unchanged. Intended future output directory: `phase6/sarvam-evaluation/milestone5H15/`; **not created by this task**.

## Preflight before any future authorized request

1.Obtain explicit permission for the bounded request count and credit spend. The user manages any account separately; do not create one or request/paste credentials in chat. Confirm available model/stock choices and applicable commercial terms without revealing secrets. No fallback to v4, alternate voice, paid plan or top-up.
2.Record original-source hash, selected strings, expected character estimate, price/date and request cap; check available disk/resources. Require credit allowance within the approved cap before each call. Missing configuration/entitlement is a stop, not permission to improvise.
3.Use exact `bulbul:v3`, te-IN, stock shubh/ratan and WAV24kHz. Source-native text unchanged. No SSML, pitch/loudness or v2 preprocessing flag. Retain provider normalization as an experimental difference versus Tiny, not a controlled identical frontend. Never mutate original text to fix a returned mispronunciation in this run.

## Bounded matrix

Five lines × two documented stock speakers × two settings = **maximum20 synthesis requests**. First generate neutral pace1.0/temperature.6 for both voices; then the five proposed category profiles for each voice. Stop after the first request if returned identity, billing conditions or output format conflict with the plan. No automatic retries, duplicate billed generation or expanded search. A failed row stays failed. Log request IDs without secrets.

These five exact texts total **435 Python Unicode code points** (not bytes or grapheme clusters).20 calls repeat that total four times: **1740 estimated characters**, nominal **INR5.22** at INR3/1000 before taxes/rounding. This is a local estimate, not provider billing evidence. Proposed hard ceiling **INR10 or20 calls, whichever first**; recheck actual billing units/account before execution and refuse if the cap cannot be enforced. No spend occurs now. Free credits, if available, still count as consumed account credits, not an unlimited audition.

For a tiny unchanged rerender2× default check would cost more; it is intentionally **not included**. No repeated-run latency statistics should be invented from one sample per condition.

## Five category fixtures

### Calm assistance — BH6-5E-002

- Exact unchanged Telugu: మిగిలిన కాపలాదారుల్ని ఓడించు. ఆ తర్వాత పోరాట ప్రాంగణం వైపు వెళ్లు.
- English reference: Clear the remaining patrols, then approach the arena.
- Proposed delivery profile: pace.95, temperature.50; intention only, no verified emotion label.
- Comparison: 5G.8 baseline and5H.7 calm/control available.
- Context guard: Mission 1 objective-style prompt; attempt not ended, relic not collected, boss not intro/active/defeated, patrols remain.
- Content/voice status: PENDING/UNVERIFIED; fixture only, not current personal progress.

### Urgent warning — BH6-5E-004

- Exact unchanged Telugu: ఆరోగ్యం తక్కువగా ఉంది. కాస్త దూరం ఉంచు. ఎదురుదాడికి ముందు శత్రువు దాడి మొదలుపెట్టే కదలికను గమనించు.
- English reference: Health is low. Create distance and read the wind-up before countering.
- Proposed delivery profile: pace1.10, temperature.65; intention only, no verified emotion label.
- Comparison: 5G.8 baseline and5H.7 urgency/control available.
- Context guard: Mission 1 combat prompt; health <=30. This branch has priority even if a boss is active.
- Content/voice status: PENDING/UNVERIFIED; fixture only, not current personal progress.

### Combat instruction — BH6-5E-001

- Exact unchanged Telugu: కాపలాదారుల్ని ఓడించు. తర్వాత వార్డెన్‌ను ఎదుర్కొని, అవశేషాన్ని సేకరించు. క్రిస్టల్స్ సేకరించడం, రిలేలను స్కాన్ చేయడం తప్పనిసరి కాదు.
- English reference: Clear the patrols, face the Warden, then collect the relic. Crystals and relay scans are optional.
- Proposed delivery profile: pace1.05, temperature.60; intention only, no verified emotion label.
- Comparison: Existing5G.6/5G.7 neutral original; not one of the five5G.8 lines.
- Context guard: Mission 1; Start guidance prompt (topic=initial).
- Content/voice status: PENDING/UNVERIFIED; fixture only, not current personal progress.

### Boss encounter — BH6-5E-037

- Exact unchanged Telugu: వార్డెన్‌ను ఎదుర్కో. దాడికి సిద్ధమయ్యే కదలికను గమనించు.
- English reference: Face the Warden; watch its attack wind-up.
- Proposed delivery profile: pace1.08, temperature.65; intention only, no verified emotion label.
- Comparison: 5G.8 baseline and5H.7 boss/control available.
- Context guard: Mission 1 objective-style answer; gameOver=false, relic=false, bossStatus=active.
- Content/voice status: PENDING/UNVERIFIED; fixture only, not current personal progress.

### Emotional or triumphant proxy — BH6-5E-013

- Exact unchanged Telugu: మిషన్ పూర్తయినట్టు నమోదుంది. వివరాల జాబితాలో సేవ్‌లో ఉన్న బహుమతులనే చూపిస్తున్నాను.
- English reference: A completion is recorded. The facts list shows actual saved rewards.
- Proposed delivery profile: pace1.00, temperature.70; intention only, no verified emotion label.
- Comparison: 5G.8 baseline and5H.7 victory/control available; factual completion, not dramatic triumph.
- Context guard: Mission 1 completion/replay prompt; savedComplete=true and c.replay=false.
- Content/voice status: PENDING/UNVERIFIED; fixture only, not current personal progress.


**Coverage limit:** there is no existing genuinely dramatic/triumphant emotional script in this selected baseline. The completion line is a confidence proxy only; cannot pass a full emotional-range gate.5G.8 fallback045 is deliberately not used as combat instruction.001 is an existing original instruction with preserved neutral audio, so no new Tiny synthesis is needed. Separate new text or stronger emotion coverage would require approval; do not fabricate it.

## Measurement and listening

For each request record model/voice/locale/settings, exact text/source hash, request ID, HTTP status, wall-clock start/end, header/first-byte/body/decode timings where measurable, billing estimate/actual receipt if accessible, byte count, WAV codec/rate/channels/depth/frame count/duration, peak/RMS/clipped samples, silence-proxy method, output SHA and error. No exact reproducibility seed assumed. Do not log key-bearing headers or full provider error dumps without redaction.

Base64 decode into a new file only, refuse overwrite. Test RIFF integrity and full sample readback, nonempty finite signal and no full-scale clipping.24kHz mono16-bit PCM is the preferred comparable format, but inspect the actual result. Preserve any original export before a separately approved conversion. Failed/mismatched files are failed; no unapproved transcoding to manufacture a pass. Use existing installed inspection tools only.

Create a future isolated no-autoplay comparison page with Tiny original, Sarvam neutral and Sarvam profile per voice. Prevent same-page overlap; show exact fixture text/settings and audible-error status. Raw comparisons retain their levels, with level differences noted as a listening confound; no silent normalization/pitch changes. Actual user listening rates1–5 clarity, naturalness, identity consistency, urgency, authority and calmness. Mark listened only after real listening. AI technical metrics cannot certify Telugu or emotional quality; unassessable dimensions remain UNVERIFIED.

## Comparison interpretation

Tiny is local CPU, te_M/read with known speed/inter-chunk pauses; Sarvam is cloud inference with internal normalization and temperature/pace. Same text and export target isolate some variables, not voice/model/frontend differences. The5H.7 controls reproduce prior originals exactly; compare only same-ID texts. Report differences in duration/levels and perceptual preference separately. Tiny worker synthesis time is not comparable to Sarvam network wall latency as pure model speed. No frontend, word-alignment or equal-emotion claim follows.

## Proposed prototype acceptance, not production gates

- Documentary identity/entitlement and spend guards pass before calls;0 secret exposure,0 automatic fallback/retry,0 production copies. Every row has explicit PASS/FAIL/UNVERIFIED evidence.
-20/20 requests is the plan cap, not a forced pass requirement. Report failures; a viable candidate needs five category-line neutral results for at least one fixed stock voice with complete metadata and technically valid files. Do not swap voices per emotion and claim one identity.
- Timing reported per request, maximum and error rate; no population p95 or real-time guarantee from this small heterogeneous matrix. Offline authoring can tolerate seconds, but blocked or incomplete results fail. No API call lies on gameplay frame path.
- At least one voice must be actually reviewed for intelligibility, consistent identity and calm/urgent suitability. Dramatic triumph remains outside supported fixture coverage. Ratings and language uncertainty must remain visible.
- Commercial project production still requires exact per-file rights/credit provenance, content approval, notices, packaging/lifecycle/browser/mobile acceptance and explicit authorization from5H.11/5H.13. A successful cloud audition does not overturn Indic Tiny's deferred listening decision.

## Security, rollback and stop

No account/key or source code is prepared now. Future approved runner secrets stay process-local; samples/logs/receipts only in isolated root; no personal saves or state. Preserve baseline hashes before/after, sanitize logs and leave failed evidence in place. On any mismatch stop owned requests/worker, do not retry/purchase/change provider. Rollback is to stop using isolated files; production remains text-only, no save or source restoration required. Any deletion needs separate approval.

**Stop after the planned20-call bound or earlier guard failure. Today stop after reports; no request authorized.**
