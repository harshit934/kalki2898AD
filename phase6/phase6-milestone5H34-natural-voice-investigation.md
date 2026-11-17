# Phase 6 Milestone 5H.34 — natural Telugu voice investigation

Checked15 November2026. **Research only: no demonstrated naturalness improvement, no new synthesis and no production approval.**

## Decision and authority

The user's current message records5H.33 as **ACCEPT WITH ISSUES**, chiefly robotic/unnatural delivery. No separate5H.33 report was found by the filename check; this assessment records the decision as supplied by the user, without inventing per-line listening ratings or rewriting the old scorecard. Existing temporary prototype use and all rollback copies remain intact. Android testing and existing commercial clearance remain BLOCKED.

**Recommendation:** first authorize a small offline, same-voice Indic Tiny pacing/phrase-flow comparison, using the installed model and isolated copies only. Expect limited improvement, not a new expressive actor. If still unsatisfactory, Piper/Venkatesh is a conditional CPU technical audition lead after confirming the voice's male identity and applicable model/output terms. No alternative is currently established as a tested, commercially cleared naturalness upgrade on this machine.

Detailed alternatives, licences and direct sources: [comparison](phase6-milestone5H34-alternatives-and-licensing.md). All quality comparisons for untested models are possibilities, not audition results.

## Actual hardware and software

Fresh successful read-only Windows query at2026-11-15T13:01:58.5831436Z:

- Windows11HomeSingleLanguage,build26300; Ryzen55600H.
- OS-visible RAM7.342GiB; **available0.681GiB**. This is a fluctuating snapshot, not a total-memory shortfall measurement or guaranteed future headroom.
- C:free **16.633GiB**. Existing10GiB storage reserve leaves6.633GiB before any new environment/model payload. Reserve is project policy, not a vendor requirement.
- GTX1650:4096MiB total,3935MiB reported free,driver592.82,compute capability7.5. Free VRAM does not cure low system RAM. No CUDA inference or model load was tested.
- Registered Python: `C:/Python313/python.exe`,version3.13.4.
- Installed global distribution metadata: torch2.11.0+cu128,transformers5.17.0,onnxruntime1.30.0,numpy2.3.4. SoundFile,Piper,Misaki,Ninada and Parler distributions were not found in this interpreter's metadata. Vendored/local runtime files are separate; this is not an exhaustive search of unregistered interpreters.

No package was imported for inference or modified. An initial sandbox CIM probe was denied; its null/zero fields were discarded, not reported as actual RAM/storage. The successful elevated read supplies the figures above. `milestone5H34/machine-assessment.json` records them.

Ninada's existing **1GiB available-RAM start gate still fails**; it remains on hold. Tiny historically peaked around250.2MiB worker RSS; its old350MiB start/200MiB system-floor rules are not a vendor promise and must be rechecked before any future test. Do not run new TTS alongside the memory-constrained game. No apps/processes were stopped to manufacture headroom.

GTX1650's7.5 capability lacks native BF16 support expected at8.0+. A BF16 checkpoint may have a legitimate FP32/FP16 path, but must not be assumed to run natively in BF16. [NVIDIA type requirements](https://docs.nvidia.com/cuda/archive/13.2.1/cuda-programming-guide/05-appendices/mathematical-functions.html).

## Confirmed current Indic Tiny configuration

Local source of truth: `phase6/local-tts-evaluation/metadata/sulabhkatiyar--indic-tiny-tts-telugu/` and `phase6/local-tts-evaluation/milestone5H7/evaluate.py`.

- Speaker explicitly set to male `te_M`,ID13; no accidental default-female inference shown by the inspected generation code.
- CPUExecutionProvider,two threads,seed42;24kHz output. The runtime handles the two trained voices; there is no inspected catalogue of several deeper male variants within this checkpoint.
- Pinned config exposes **only read:0**, `style=read`,temperature0.667,n_timesteps4,te_M length_scale1.0022.
- Generic source enums include conv/command, but this checkpoint's exposed IDs contain only read. An enum string is not proof of a supported, trained conversational/emotional switch. Do not silently force style IDs or labels.
- Normalized text is segmented at sentence-ending punctuation; each chunk is synthesized independently and joined with zero-valued fixed gaps. Local source: `indic_tiny_tts/frontend/textproc.py` and `export/onnx_infer.py`.
- Existing same-wording variants: calm0.96×/0.22s gap; combat1.12×/0.08s; boss1.08×/0.10s; victory1.04×/0.12s; serious0.92×/0.28s. Matched control1.00×/0.15s. These are pacing settings, not semantic emotions.

The current official card describes a calm reading voice and says emotional recordings were omitted; it also identifies read/conversation/command source data. That disclosure must not be reduced to the inaccurate claim that all source material was only read speech. [Official Indic Tiny card](https://huggingface.co/sulabhkatiyar/indic-tiny-tts-telugu).

## Why it may sound robotic: facts versus hypotheses

**Confirmed limitations:** no exposed verified emotion control in this pinned setup; only one stock male identity; separate sentence synthesis plus uniform inserted gaps; speed labels do not change the intended emotion.5H.32 found valid PCM/hash matches and no full-scale rail samples, so file corruption/clipping is not an established explanation for the user's complaint.

**Plausible contributors, not proven per-sample causes:** a reading-oriented voice with limited prosodic variety; sentence-by-sentence resets and fixed gaps reducing continuity;1.12× rushing consonants or0.92× stretching an already flat cadence; formal informational wording feeling less conversational. None has been isolated by a new controlled listening comparison. No claim that compression, ONNX, low RAM or the GPU caused the voice timbre is supported.

**Audible ending uncertainty:**5H.32 measured essentially no quiet tail for the boss clip and a very short tail for combat. That flags last-word listening, not proof of truncation. Complete WAV frames cannot certify complete speech. Conversely, recognizer CER and publisher speed scores do not measure naturalness, maturity, authority or cinematic suitability.

The serious sample is a missing-history explanation, not a dramatic emotional scene; victory is a recorded-completion/rewards statement. Existing wording limits what emotional range these auditions can demonstrate. No dialogue was rewritten in this investigation.

## What supported controls can realistically change

- **Voice selection:** maintain te_M for identity consistency. Switching to the female voice violates the target. Other models' documented stock males may offer a different timbre, but medium-low/deep, mature and natural cannot be certified from a voice name or licence. No actor references/cloning.
- **Speed and pauses:** can alter rhythm with small changes. They cannot supply reliably acted urgency, confidence or sadness. Increasing/decreasing speed indiscriminately may make naturalness worse.
- **Segmentation:** preserve coherent phrases and ordinary punctuation; avoid word-level chopping or extra artificial breaks. Current runtime still lacks cross-sentence context. Any proposed punctuation/segmentation experiment must be isolated and preserve original drafts/meaning.
- **Seed/temperature:** documented stochastic controls, not emotion labels. Changing them may vary noise/timing; no proof they solve robotic speech or preserve all pronunciation.
- **ODE steps:** code exposes a step count, but more steps are not a verified naturalness fix and cost additional computation. Not the first recommended trial.
- **Pitch/deepness tricks:** no verified stock Tiny pitch/emotion API was established. Lowering playback sample rate or forcing bass/pitch is not a demonstrated path to natural mature Telugu; do not mistake it for a new voice identity.

## Smallest future test, only after separate authorization

1. Preserve all current WAVs/drafts and make no production change. Use three already-existing original-text lines covering calm, low-health and boss/victory; identify each by current dialogue ID.
2. Reuse existing1.00×/0.15s controls. Propose at most two new same-wording profiles per selected line:1.00×/0.10s and0.98×/0.16s,read style,te_M,seed42. This is a proposed bounded experiment, **not an instruction executed here**. Do not change line meaning or use SSML the runtime has not implemented.
3. Keep neural execution offline and bounded under the existing Tiny resource safeguards; recheck available RAM immediately beforehand. No live synthesis in active gameplay. Stop on low-memory guard, decoding error, missing output or unsupported control.
4. Preserve English/Telugu sources and compare exact matched clips. Record actual user preference for naturalness, word clarity, phrase flow and male identity. No external reviewer is required, and blank feedback remains unverified.
5. Accept a change only if the user actually prefers it without unacceptable pronunciation/end cutoff or identity drift. Otherwise retain current ACCEPT WITH ISSUES fallback rather than continue an unbounded tuning loop.
6. Only then consider a separately authorized isolated Piper trial, conditional on the voice/gender and rights questions in the comparison. No Python/PyTorch/Transformers downgrade, bypassed Python requirements or automatic installation.

A successful pacing audition would not settle commercial rights or Android behavior. Neither gate is relaxed by this research.

## Research limits, integrity and stop

No new audio, model-weight/package download, dependency installation/change, CUDA test, paid/cloud synthesis, account, key access or external reviewer. Only small public documentation/licence/package-metadata responses were read and stored under `phase6/milestone5H34/`. One source response exceeded the262144-byte text cap and was not retained/retried; unavailable sources are listed in `source-index.json`. No source code from the web was executed.

Fresh47/47 protected expected hashes match;1135/1135 files in the established existing snapshot remain unchanged.121existing local-evaluation files were additionally fingerprinted for preservation; they were not regenerated or edited. Evidence: `milestone5H34/preservation.json`. Personal profiles/saves were not accessed. No game/staging/audio/draft/scorecard or Python environment changes, no rollback restore and no background server/worker launched. The metadata-inspection commands completed; no test process remains from this investigation.

**Conclusion:** modest flow improvements are plausible within Tiny's supported pacing controls, but a genuinely more natural expressive male Telugu voice is not established under the present RAM, compatibility and rights constraints. Stop after investigation; no improvement or production acceptance claimed.
