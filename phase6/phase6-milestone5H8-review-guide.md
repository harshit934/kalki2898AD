# Milestone 5H.8 — Bhairava listening review guide

**Review preparation complete. Listening, pronunciation and voice suitability remain UNVERIFIED.** No audio was played or assessed by the assistant during this milestone. Ratings are deliberately blank, not zero. No production voice decision is made.

## Review materials

- [Listening scorecard](phase6-milestone5H8-listening-scorecard.csv): ten rows, two per category, with exact Telugu/English source, sample hashes, paths and separate control/variant scoring fields.
- [Existing comparison page](local-tts-evaluation/milestone5H7/playback.html): original5G.8, fresh matched control and delivery variant for each line. Score the **matched control and delivery variant**; original5G.8 is optional context and is byte-identical to its matched control.
- [5H.7 measurements and limitations](phase6-milestone5H7-expressive-evaluation.md).

Open the playback page directly from its existing directory; keep relative audio paths intact. There is no need to start the game or a server. The scorecard includes absolute paths for each sample and its comparison partner. Copying only the HTML elsewhere will break its relative links.

## Five comparisons

1. **Combat urgency — BH6-5E-004.** Compare matched control1.00×/0.15s pause with combat-urgency1.12×/0.08s. Does the low-health advice feel timely without becoming rushed or less intelligible?
2. **Boss encounter intensity — BH6-5E-037.** Compare control with boss-intensity1.08×/0.10s. Does the warning sound focused and authoritative without losing clarity?
3. **Victory/confidence — BH6-5E-013.** Compare control with victory-confidence1.04×/0.12s. Does the recorded-completion/rewards statement convey calm confidence? Its factual wording does not establish a triumphant performance test.
4. **Serious emotional delivery — BH6-5E-045.** Compare control with serious-delivery0.92×/0.28s. Does the missing-history fallback feel measured rather than slow or mechanical? It is not an emotional story scene, so do not generalize to dramatic storytelling.
5. **Calm AI assistance — BH6-5E-002.** Compare control with calm-assistance0.96×/0.22s. Is mission guidance clear, supportive and concise without sounding lethargic?

Every sample uses the same stock male te_M/read style. These labels describe intentions, not model emotion settings. Speed and sentence-pause changes do not by themselves prove emotional improvement. No actor imitation is requested or appropriate.

## Listening procedure

1. Use the same headphones/speakers and a comfortable fixed device volume for both samples. Record reviewer name, date and listening device. No need to install or generate anything.
2. Read the exact text and context. Listen to the full control and variant separately; alternate their order on a second comparison to reduce order bias. Use Stop all if needed. Do not judge by duration or louder playback alone; natural loudness differences can bias impressions.
3. Set `listened` to YES only after actually hearing that sample. Score each row independently, then record comparison preference on both paired rows: CONTROL, VARIANT, NO CLEAR DIFFERENCE or UNVERIFIED.
4. Note specific words, timestamps, syllables, rushed sections, awkward breaks, truncated endings, distortion or inconsistent identity. Do not invent missing words. If you cannot evaluate Telugu pronunciation, leave its rating blank and its status UNVERIFIED; English meaning alone cannot establish correct Telugu sounds.
5. After listening, a subjective field's status may be changed from UNVERIFIED to REVIEWED SUBJECTIVE. That is a listening opinion, not human-certified language approval. Keep `language_approval` UNVERIFIED unless separate documented linguistic approval exists. Keep `production_approval` NOT APPROVED throughout this review.

## Rating scale and criteria

Use whole-number **1–5** only for criteria actually reviewed. Blank means unreviewed or not assessable. Do not substitute a neutral3 for missing evidence or calculate an average across blank fields.

- **1 — Poor:** major distracting or intelligibility problems; unsuitable for this intended use.
- **2 — Weak:** noticeable recurring problems; improvement needed.
- **3 — Acceptable for prototype:** understandable/useful but clear limitations.
- **4 — Good:** convincing for the intended prototype category with minor issues.
- **5 — Excellent for this sample:** clear, natural and effective under these listening conditions; still not production or language certification.

Assess **pronunciation clarity** for distinguishable sounds/words and omissions; **naturalness** for rhythm, phrasing and pauses; **energy/emotional impact** against the specific intended category, not maximum excitement; **Bhairava suitability** for a mature, confident, observant and supportive original assistant identity. Add an overall1–5 judgment only if enough criteria were actually assessed, explaining any unverified dimensions.

After review use `final_judgment`: SUITABLE FOR FURTHER PROTOTYPE, NEEDS DELIVERY REVISION, UNSUITABLE FOR THIS CATEGORY or INCONCLUSIVE. Until then it remains PENDING REVIEW. A preference for a variant does not automatically approve that voice or text for a released game.

## Preservation and verification

- Ten unique review IDs; five requested categories; one matched control and one variant per category.
- All rating fields initially blank; all listening flags NO; every perceptual status UNVERIFIED; final judgments PENDING REVIEW.
- Exact sample metadata copied from5H.7 inventory; all ten referenced sample hashes verified.
- Twenty-four input files were snapshotted unchanged: all18 existing evaluation WAVs, the three5E dialogue files,5H.7 evaluation/inventory and playback page. Details: `local-tts-evaluation/milestone5H8/preservation.json`.
- No replacement audio, synthesis, package/model downloads, installation, production integration, save access or game-file changes. No server or background test process started. Existing playback page and previous reports preserved.

New artifacts: the requested CSV and guide, plus isolated preparation/verification helpers under `local-tts-evaluation/milestone5H8/`. No production rollback is needed. **Stopped for your listening review.**
