# Phase 6 Milestone 5H.34 — alternatives and licensing comparison

Official text/metadata checked15 November2026. This ranks **research/test feasibility**, not heard naturalness. No candidate was auditioned, installed or cleared for commercial game shipping. The latest machine snapshot is0.681GiB available RAM/Python3.13.4/GTX1650 4GiB; model payload is never treated as peak working memory.

## Indic Tiny te_M — retain baseline; CONDITIONAL tuning candidate

Already runs locally via CPU ONNX; existing5H.7 measured about250.2MiB peak worker RSS and roughly91MB downloaded payload. Local generation code offers speed/fixed gaps, not proven emotions. Existing model-weight CC BY4.0/runtime MIT declarations and separate vocoder/Rasa obligations remain as5H.13; voice/output clearance is not newly resolved. Read-only config evidence and the existing samples are stronger local compatibility evidence than claims about untested rivals. No ranking as “more natural” is justified.

Sources: [model card](https://huggingface.co/sulabhkatiyar/indic-tiny-tts-telugu), [existing rights resolution](phase6-milestone5H13-rights-resolution.md), [5H.7 local measurements](phase6-milestone5H7-expressive-evaluation.md).

## Piper1.8.0 / te_IN-venkatesh-medium — CONDITIONAL technical audition lead

Telugu one-speaker ONNX:63,516,050bytes,22050Hz. Card lacks explicit gender; historical male attribution is not independent current voice verification. Runtime has a Python3.13-compatible cp39-abi3 Windows x64 wheel and CPU path. No Torch/Transformers downgrade needed. RAM is unmeasured; propose at least1GiB available before an isolated trial, a conservative project gate, not vendor minimum. Current headroom fails that proposed gate.

Length/noise controls are not named emotions; no evidence this voice is more natural. Code GPL3-or-later; card's CC BY4.0 statement is under Dataset(IndicVoices-R), not a clear separate weight/output grant. Dataset gate/voice-output scope and redistribution format need clarification. Keep full GPL notices/source obligations if conveying runtime; distinguish WAV-only distribution. No commercial clearance.

Sources: [official package/wheel](https://pypi.org/project/piper-tts/1.8.0/), [voice card](https://huggingface.co/rhasspy/piper-voices/resolve/main/te/te_IN/venkatesh/medium/MODEL_CARD), [config](https://huggingface.co/rhasspy/piper-voices/blob/main/te/te_IN/venkatesh/medium/te_IN-venkatesh-medium.onnx.json), [controls](https://github.com/OHF-Voice/piper1-gpl/blob/main/src/piper/config.py), [code licence](https://github.com/OHF-Voice/piper1-gpl/blob/main/COPYING), [dataset](https://huggingface.co/datasets/ai4bharat/indicvoices_r). Captured exact metadata/card in milestone5H34.

## Ninada5.1.2 Telugu male — CONDITIONAL research lead; NO-GO now

Dedicated male Telugu CPU ONNX specialists; prior pinned artifact29,281,720bytes Studio or22,737,098bytes Mobile. Python metadata>=3.10; installed ORT/NumPy satisfy broad declarations, not full runtime proof. SoundFile absent; no package installed. Prior audit found non-neural fallback: future trials must assert actual neural tier and avoid silent fetches. The existing1GiB start gate still fails; no attempt authorized.

No verified semantic emotion selector or naturalness advantage. Runtime MIT, model card separately declares CC BY4.0 weights/corpora and Rasa/SYSPIN sources. Credit exact model/data and retain applicable notices; initialization/subset and voice/output scope are not independently cleared. A missing standalone LICENSE response does not negate the publisher declaration or create a new permission. Not commercially production-approved.

Sources: [official model card](https://huggingface.co/gnumanth/ninada), [runtime metadata](https://github.com/hemanth/ninada/blob/main/pyproject.toml), [MIT](https://github.com/hemanth/ninada/blob/main/LICENSE), [Rasa](https://huggingface.co/datasets/ai4bharat/Rasa), [earlier pinned audit](phase6-milestone5H4-license-audit.md). Current source/licence text captured; old exact model pin remains25143ee2842dd7bd9e2955b94797d43590ca676e, not newly downloaded weights.

## Hima Nano Telugu ONNX — NO-GO pending permission evidence

Official card advertises Windows CPU,84MB int8 voice-set payload and three stock males:Srinivas,Karthik,Pranay. Selection offers different candidate identities; naturalness/depth/emotion remain untested. No demonstrated semantic emotional API in inspected material. Full Python3.13 dependency compatibility/RSS unmeasured; int8 size is not a RAM guarantee.

Metadata at8fd92e3956163815892f6adcf7e3aae91e70272b still says license other; inspected root tree supplies no LICENSE. No sufficient code/weight/stock-voice/dataset commercial grant established. Do not synthesize or recommend production on free-download access. Actor/reference cloning routes are excluded.

Sources: [ONNX publisher](https://huggingface.co/Prahaladha/hima-tts-nano-te-ONNX), [base publisher](https://huggingface.co/Prahaladha/hima-tts-nano-te), captured API metadata `milestone5H34/hima-metadata.txt`.

## Mithi v2 Flash — NO-GO on current Python; no proven expressive upgrade

Telugu and five stock males(Satvik,Anirban,Nakul,Vasant,Siddhant);99.1M/199MB BF16. Published emotion is explicitly flatter than human speech. Misaki0.9.4 still excludes Python3.13, blocking the documented frontend. Do not downgrade or bypass its requirement. Prior pinned inspection found FP32 runtime paths; approximately396MB core FP32 weights exclude loading/activation overhead. Proposed1–2GiB RAM allowance fails now; not a vendor minimum.

Publisher Apache2.0 licence grants model/code commercial use with notices; dependencies retain their own licences. Upstream acknowledgements are not independent proof of every training/voice/output condition. Exact selected-asset clearance remains incomplete. No guaranteed naturalness improvement.

Sources: [model/licence statement](https://huggingface.co/Oomni/mithi-v2-flash), [actual licence text](https://huggingface.co/Oomni/mithi-v2-flash/blob/main/LICENSE), [Misaki constraint](https://pypi.org/project/misaki/0.9.4/), [prior resource assessment](phase6-milestone5H18-mithi-feasibility.md), [dependency audit](phase6-milestone5H19-installation-plan.md).

## Indic Parler — expressive potential; NO-GO on current resources

Telugu stock names include Prakash,Lalitha,Kiran; exact male identity/pitch suitability must be verified rather than inferred from names. Text descriptions control delivery, but not a local listening result. Roughly0.9B parameters; FP32 weights alone about3.6GB before overhead, versus0.681GiB free host RAM. FP16 still requires working memory and tested kernels; not a validated4GB-GPU fit. Prior runtime/version issues remain; no dependency changes proposed.

Model Apache2.0; inference runtime/dependencies separate. Training disclosure names GLOBE,IndicTTS,LIMMITS,Rasa with conditions not all independently resolved. Do not expand GLOBE's abbreviated “CC V1” into an assumed grant. No voice/output commercial clearance.

Sources: [official card, controls, speakers and dataset table](https://huggingface.co/ai4bharat/indic-parler-tts), [existing separate licence audit](phase6-milestone5H2-license-audit.md). Publisher recommends newer Indic-Speak; that does not establish lightweight suitability.

## Indic-Speak — current documented successor; NO-GO for this machine

`bodhan-ai/indic-speak`:Telugu,Vamsi/Sravani stock names,3B BF16 parameters. About6GB weight storage alone exceeds4GB VRAM, before decoder/activations;0.681GiB free RAM also unsuitable. Quantized derivatives were not evaluated. Publisher says style/emotion control is preview-quality/inconsistent; no audition here.

Indic Open Model License v1.0, not Apache2.0. Model terms require attention to upstream Llama/SNAC/Vocos conditions and distribution/service restrictions; exact text/selected use must be reviewed before commercial recommendation. Publisher states consenting contracted artists, which is useful evidence, not blanket release clearance from this audit. No lightweight Windows/Python inference success established.

Source: [official current model card/licence links](https://huggingface.co/bodhan-ai/indic-speak). Its local-hardware and licensing mismatch is why it is screened out rather than silently replacing Parler.

## Resource and licence interpretation

Disk availability permits some small payloads with a reserve; system RAM is the immediate limiting resource. Proposed audition gates above are conservative test policy, not published model minimums. No alternative RSS/VRAM/latency or Telugu pronunciation was measured. GPU-free ONNX routes are preferable for a future offline small audition, not concurrent runtime game synthesis.

Model weights, runtime code, stock voice/data terms and generated audio are different evidence layers. Permissive copyright licences support commercial exercise of the granted rights with conditions; they do not automatically resolve other applicable rights. Conversely, absence of a separate output licence is not proof commercial WAV use is forbidden. Preserve the project's documented clearance gates and seek specific evidence, not invented bans or permissions.

Ranking for future bounded work: **(1) installedTiny pacing experiment; (2) conditionalPiper audition after male/rights/resource gates; (3)Ninada only after its existing gates resolve.** Hima permissions, Mithi dependency mismatch and larger-model memory requirements prevent recommending them now. This is feasibility ordering, not a voice-quality ranking. No installation or synthesis authorization follows.
