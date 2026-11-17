# Milestone5H.14 — Telugu TTS alternatives research

**Checked15 November2026, Asia/Calcutta. Research only; no voice or production approval.** Ranking combines documentary Telugu/male support, commercial-output clarity, expressive-control potential and laptop feasibility. It is not a listening-quality leaderboard. No pronunciation, depth, authority or cinematic performance was heard or verified. All candidates remain subject to exact voice/model/plan/account terms; open-source code is not automatic output clearance.

## Ranked comparison

| Rank | Candidate | Male voice evidence | Deployment | Commercial gate | Research verdict |
|---|---|---|---|---|---|
| 1 | Sarvam Bulbul v3 | shubh or ratan; official Telugu male recommendations | Cloud | Account/plan conditions | CONDITIONAL |
| 2 | Azure Speech MohanNeural | te-IN-MohanNeural; male | Cloud | Account/plan conditions | CONDITIONAL |
| 3 | ElevenLabs Eleven v3 | Official male stock catalogue includes Adam; exact current eligible voice ID not selected | Cloud | Account/plan conditions | CONDITIONAL |
| 4 | Google Cloud Chirp3 HD | te-IN-Chirp3-HD-Achird; male | Cloud | Account/plan conditions | CONDITIONAL |
| 5 | Oomni Mithi v1 Flash | Satvik / satvik; male | Local | Unresolved rights/hardware gates | CONDITIONAL |
| 6 | AI4Bharat Indic Parler TTS | Telugu names Prakash/Lalitha/Kiran; Prakash male candidate from prior research; confirm metadata before test | Local | Unresolved rights/hardware gates | CONDITIONAL |
| 7 | Ninada5.1.2 Telugu Studio | Pinned onnx/te.onnx male specialist | Local | Unresolved rights/hardware gates | CONDITIONAL |
| 8 | Indic Tiny Telugu baseline | te_M stock male ID13 | Local existing | Unresolved rights/hardware gates | CONDITIONAL |
| 9 | Meta MMS Telugu | Speaker gender not independently verified | Local excluded | Unresolved rights/hardware gates | NO-GO |

The [detailed CSV](phase6-milestone5H14-commercial-rights-comparison.csv) covers all10 requested dimensions, ownership/restrictions, attribution, separate code/model/data terms, costs, hardware, integration, risks, date and direct source links. NO-GO/CONDITIONAL here refers to further action or release evidence, not an audition score.

## Cloud findings and sources

**1. Sarvam Bulbul v3 — best next evaluation.** Official best-practice documentation identifies Telugu te-IN male shubh/ratan and pace/temperature controls. These can vary delivery but are not proven emotion selectors or evidence of deep cinematic timbre. Current docs also introduce v4 Flash; its persona IDs differ, so this shortlist intentionally uses the explicitly documented v3 pair instead of silently substituting the newest model. [Voice/control guidance](https://docs.sarvam.ai/api/api-guides-tutorials/text-to-speech/bulbul-v3-best-practices), [model versions](https://docs.sarvam.ai/api/api-guides-tutorials/models/bulbul).

Sarvam explicitly permits credited-account exports in sold games, including eligible verified-user free credits; output rights persist under its conditions. EULA assigns output but not model/voice ownership and prohibits impersonation and competing-model training. Listed v3 cost is INR3/1000 characters, with INR100 verified-user credits; account eligibility not checked. No unconditional attribution waiver inferred from silence. [Commercial policy](https://docs.sarvam.ai/api/getting-started/commercial-licensing), [EULA](https://www.sarvam.ai/eula), [service terms](https://www.sarvam.ai/terms-of-service).

**2. Azure MohanNeural — strongest conservative fixed-voice cloud fallback.** Official catalogue lists male te-IN-MohanNeural; its style column does not document named emotions. SSML prosody/breaks are pacing controls, not proof of acting. Microsoft expressly grants commercial prebuilt output use to **paid-tier customers only** in the inspected Product Terms. This corrects any assumption that the earlier F0 preflight itself established shipping rights; earlier reports are not edited. F0 lists0.5M neural characters/month, but resource eligibility/current quota are unverified. S0 rate varies by region/currency; no guessed flat quote supplied. [Voice catalogue](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/language-support), [binding output clause](https://www.microsoft.com/licensing/terms/product/MicrosoftAzure/all), [pricing](https://azure.microsoft.com/en-in/pricing/details/speech/).

**3. ElevenLabs Eleven v3 — strongest cinematic potential, conditional.** Telugu and voice-dependent audio tags/punctuation are documented; official catalogue includes male stock Adam, but no exact current eligible voice ID is selected. Do not infer native Telugu performance from an English-accent stock identity. V4 is now advertised; this research does not assume that newer model has identical Telugu/voice/contract eligibility. [v3 languages](https://elevenlabs.io/v3), [prompting](https://elevenlabs.io/docs/overview/capabilities/text-to-speech/best-practices), [official stock catalogue](https://elevenlabs.io/docs/eleven-creative/voices/voice-library/).

Paid non-Beta generations have a commercial route; free and Beta outputs do not. Selected-voice restrictions and agreement-based attribution still need verification. Terms retain output rights as between parties, with content-use and nonuniqueness conditions. Pricing currently lists StarterUSD6/month,30k credits; USD5 is annual-equivalent, not the monthly plan. Free10k credits are noncommercial. Promotional first-month banners are not assumed valid. [Commercial help](https://elevenlabs.io/docs/help-center/legal/can-i-publish-the-content-i-generate-on-the-platform), [terms](https://elevenlabs.io/terms-of-use), [pricing](https://elevenlabs.io/pricing).

**4. Google Chirp3 HD — documented Telugu male API, conditional output review.** Catalogue lists te-IN-Chirp3-HD-Achird male. Current Chirp3 docs support advanced controls; verify exact locale/method support rather than reuse obsolete blanket no-SSML assumptions. No Telugu named dramatic-emotion switch is established here. Official basics permits generated files in applications/media under Cloud terms, but it is not an exclusive-output ownership promise or specific voice-level waiver. The attempted FAQ URL returned404; no missing grant was invented. [Voices](https://docs.cloud.google.com/text-to-speech/docs/list-voices-and-types), [Chirp3](https://docs.cloud.google.com/text-to-speech/docs/chirp3-hd), [application-use statement](https://docs.cloud.google.com/text-to-speech/docs/basics), [Cloud agreement](https://cloud.google.com/terms).

Pricing lists the first1M Chirp3 HD characters free and USD30/1M thereafter; billing/account conditions apply and free allowance is not a hard spend cap. [Pricing](https://cloud.google.com/text-to-speech/pricing).

Cloud vendors do not transfer proprietary model/dataset licences merely by permitting exported output. Their published service grants are a clearer output-use basis than an unexplained open-weight licence, but not an endorsement, exclusive copyright guarantee or clearance for unauthorized input/actor material. Training-dataset rights were not independently inspectable for these services. Account-specific stock restrictions, termination, use policy, data processing and final export terms need recording before generation. No account, resources or credits were created/used.

## Local/offline findings

**5. Oomni Mithi v1 Flash / Satvik — strongest NEW lightweight local candidate for a future feasibility review.** Publisher documents Telugu male, CPU operation,99.1M parameters/197MB weights, and commercial Apache model/code use. It also admits flatter emotional delivery and possible rare-name/loanword errors; it is not a demonstrated expressive upgrade. Dependencies include eSpeak tooling with separate obligations; do not label every dependency Apache. Teacher-model/synthetic-data/output/personality provenance remains incomplete. Windows inference, process RAM and bf16 CPU behavior on this laptop are untested; file size is not a memory minimum. [Official card/licence/component statement](https://huggingface.co/Oomni/mithi-v1-flash).

**6. Indic Parler — strongest local expressive RESEARCH potential, not practical to install now.** Caption control and Telugu named speakers are documented, but gender/identity of the exact selected preset should be verified before audition. Apache model and runtime statements are separate from unresolved GLOBE/IndicTTS/LIMMITS/Rasa conditions. Prior pinned checkpoint audit measured937.8M FP32 parameters (~3.49GiB weight-only); current8GB RAM/4GB GPU and prior dependency conflict make safe Windows inference unestablished. No GPU-fit promise or minimum inferred. [Model](https://huggingface.co/ai4bharat/indic-parler-tts), [code licence](https://github.com/huggingface/parler-tts/blob/main/LICENSE), [existing hardware audit](phase6-milestone5H2-feasibility.md), [separate dataset audit](phase6-milestone5H2-license-audit.md).

**7. Ninada — remains ON HOLD.** Exact prior pins and small29.3MB Studio male weight do not establish process memory or expressiveness. Existing1GiB available-RAM start gate failed; no install/run recommended. Current model-page retrieval failed, so earlier verified pin evidence is explicitly historical. [Source](https://huggingface.co/gnumanth/ninada), [runtime](https://github.com/hemanth/ninada), [last gate](phase6-milestone5H6-post-restart-check.md).

**8. Indic Tiny — retain existing baseline only.** It is the only locally tested prototype in this comparison; current5H.13 commercial NO-GO and5H.12 incomplete listening remain unchanged. It has read/speed/pause controls, not validated dramatic acting. No replacement or new generation proposed. [Model](https://huggingface.co/sulabhkatiyar/indic-tiny-tts-telugu).

**9. Meta MMS Telugu — excluded.** Official checkpoint is CC BY-NC4.0. An open runtime does not remove that noncommercial limitation. No separate commercial grant or verified male identity was found; it is not recommended as a rights workaround. [Checkpoint](https://huggingface.co/facebook/mms-tts-tel).

## Decisions and next isolated prototype proposal

- **Best next candidate:** Sarvam Bulbul v3, stock shubh/ratan, subject to account/credit and exact terms confirmation. Clearest inspected game-output wording and low local hardware cost.
- **Strongest NEW local option for feasibility:** Mithi Satvik, conditional on dependency/voice/data/output review and a fresh resource gate. **Strongest already-running offline baseline:** Indic Tiny. No researched local option is currently demonstrated as both commercially cleared and more expressive on this machine.
- **Strongest expressive cinematic potential:** Eleven v3 with an eligible non-Beta stock male voice and paid generation; no perceived-quality winner without audition. Parler is the local research counterpart but presently hardware-blocked.

Proposed next step, requiring separate approval: one bounded Sarvam isolated audition, same unchanged five5G.8 lines, shubh then ratan, fixed recorded model/voice/settings and spend cap. Verify account credit licensing first; keep secrets outside production; no actor reference or new text. Validate PCM/hash/timing and compare through a local playback page; listening results remain separate. Do not silently switch to v4 or purchase a subscription if the documented v3 account/voice is unavailable. If cloud is declined, do only Mithi dependency/licence preflight, not an install. Nothing in this report authorizes execution.

Use authoring-time exports rather than a cloud API inside gameplay: no player-data upload, no API key in browser/game assets, no network dependence for prerecorded dialogue. Final integration still requires lifecycle/mute/priority, dynamic factual-text policy, packaging allowlist, exact line approval and browser/mobile tests from5H.11/5H.13. Voice metadata changes, regional outages, cancellation and provider data-use terms are unresolved operational risks; game IP/actor permissions remain separate.

## Preservation

Only research artifacts and requested reports/CSV were created. No account creation, credits, purchase, audio request, model/package download, environment edit, prototype overwrite or save access. Current public-documentation viewing only; no payload acquisition. Final preservation comparison is recorded in the summary. No production approval, listening certification or implementation.
