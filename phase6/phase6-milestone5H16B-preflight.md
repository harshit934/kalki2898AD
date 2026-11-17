# Milestone5H.16B — Account and billing preflight

**Decision: NO-GO for executing the controlled test now.** Public capabilities and arithmetic check out; account entitlement/credits, actual billing applicability and execution authorization are unverified. This is not production approval.

Checked15 November2026, Asia/Calcutta. Read5H.15 and final5H.16A matrix and rechecked official public pricing, REST, voice/control and legal pages. Free documentation-only verification; no account session inspected, credential accessed, key requested, request sent or credit consumed.

## Official price and API limits — documented PASS

Current table: Bulbul v3 pay-as-you-go INR3/1000 characters, Pro2.85, Growth2.70; prices exclude GST and TTS usage rounds to nearest character. REST/HTTP-stream limits60/200/1000 requests/minute and WebSocket60/200/1000 concurrent for those plans. Public signup offer: INR100 credits for verified users. Account overrides, plan/balance/eligibility were not checked. Older Starter30/min figures are superseded by the current page.402 is insufficient credits;429 rate limit. [Official pricing/limits](https://docs.sarvam.ai/api/getting-started/pricing).

## Exact planned character and cost calculation

Re-read the unchanged source CSV and20-row matrix, including spaces and punctuation, without adding newlines. Count Unicode code points; all selected characters are in the BMP, so UTF-16 units equal that count. UTF-8 byte counts are recorded separately, never billed as characters. No input normalization performed locally. Provider-side normalization/billing-unit behavior beyond the published nearest-character statement remains to confirm for the actual account.

- BH6-5E-002:66 per request; four occurrences =264.
- BH6-5E-004:99 per request; four occurrences =396.
- BH6-5E-001:132 per request; four occurrences =528.
- BH6-5E-037:55 per request; four occurrences =220.
- BH6-5E-013:83 per request; four occurrences =332.
- **20 attempts /1740 exact input code points**, nominal base **INR5.22 excluding GST** at the pay-as-you-go price.
- Add a proposed **25% billing margin**, then round each request's reservation upwards to INR0.01. Summed reservation: **INR6.64 excluding GST**, leaving **INR3.36** below the INR10 cap for applicable tax/other confirmed differences. This is a conservative local reservation, not a provider spending limit, quote or proof that all unknown charges fit.

[Per-request calculation CSV](phase6-milestone5H16B-cost-calculation.csv) records exact text/hash, counts, parameters and Decimal-based costs for S01–S20. Source CSV SHA-256: `28d0a313414eb8bb4ee99c4be65eaad3fd83da9867c7f8b8df5b43caf1f7bbab`. Margin is not permission for extra requests or retries.

**Fits by published-rate estimate:** YES,20 planned calls and margin-inclusive ex-GST estimate below INR10. **Guaranteed total/account affordability:** UNVERIFIED.5H.16A's INR10 total ceiling including credit consumption/attributable charges remains authoritative; this task's ex-GST calculation does not silently relax it. Tax/billing-unit assumptions and available balance must support a conservative all-in bound before calls. If this cannot be demonstrated, stop.

## Account and credit checks — UNVERIFIED

No explicit permission to view the authenticated dashboard was provided. Existing login status was not inspected or assumed. No login/account creation, account identifiers, billing settings, key pages or secret storage accessed. No paid or free API verification call made. Public free-credit advertising does not prove the user's eligibility or balance.

Applicable credit-source policy: Sarvam's commercial page permits exported audio in sold games when generated on the user's account with qualifying credits consumed, including verified-user free credits. Output rights persist under its conditions; this does not prove this account/credit bucket qualifies. Need nonsecret confirmation of credit type, entitlement and any promotional/contract restrictions. [Commercial policy](https://docs.sarvam.ai/api/getting-started/commercial-licensing).

## Legal record versions

- **EULA:** public page marked Last Modified **22 May2026**; no separate numerical version displayed. Inspected Output/Production License restrictions; no newly accepted terms. [EULA](https://www.sarvam.ai/eula).
- **Terms of Service:** **Version2.0**, effective **29 July2026**. Actual user/organisation contract acceptance and any overriding agreement remain UNVERIFIED. [ToS](https://www.sarvam.ai/terms-of-service).
- **Commercial Licensing:** live documentation checked15 November2026; no explicit version/effective date displayed, so no version number invented. Record a dated copy/reference at future authorized execution and apply binding EULA/ToS/account terms, not a public summary alone. [Policy](https://docs.sarvam.ai/api/getting-started/commercial-licensing).

EULA assigns output rights between parties but reserves provider model/software ownership and retains misuse/input conditions. No exclusive copyright, actor likeness or blanket rights clearance inferred. No terms accepted on behalf of the user. Pronunciation/emotion remain UNVERIFIED;5H.12 unchanged.

## API compatibility — documented PASS, account/runtime UNVERIFIED

`bulbul:v3` lists both short speaker IDs `shubh` and `ratan`; Telugu te-IN male recommendations are explicit. Supported controls include pace0.5–2.0, temperature0.01–1.0, and WAV output via `output_audio_codec`, with24000Hz selectable through `speech_sample_rate`. Base64 response must later be validated as actual WAV. No pitch/loudness/SSML or v4 persona substitution. These are public schema checks, not successful authenticated voice/format tests. [REST schema](https://docs.sarvam.ai/api-reference/text-to-speech/convert), [Telugu voices/controls](https://docs.sarvam.ai/api/api-guides-tutorials/text-to-speech/bulbul-v3-best-practices).

## Exact manual account-verification steps

1.If you already have a logged-in Sarvam session, open the dashboard from the **Sarvam Dashboard/Billing** link on the official pricing page. If signed out or prompted to create/verify an account, stop this preflight; no account creation is authorized here.
2.View the current organisation's billing/usage overview only. Record nonsecret plan name, available INR credit amount, whether credits are promotional/free versus paid, whether the account is verified and any displayed expiry/restrictions. Do not open API Keys, reveal/copy a key, enter payment details or change settings.
3.Check displayed Bulbul v3 access/pricing/limits and whether shubh/ratan te-IN are available **without pressing Generate/Preview/Try API**. If the interface cannot confirm them without generation, leave account-specific availability UNVERIFIED.
4.Read any credit-specific or organisation contractual terms; confirm whether those existing credits carry the documented production-output permission. If unclear, report the uncertainty—do not contact support or accept new terms automatically.
5.Provide only nonsecret results (plan, balance, credit type and restrictions), or explicitly authorize read-only viewing of the already-authenticated dashboard for those fields. Do not send credentials, cookies, tokens or key-bearing screenshots. Merely opening a session is not authorization to inspect it.
6.Do not top up, subscribe, enable auto-recharge or alter billing. If available authorized credits or all-in price cannot be confirmed, preserve NO-GO and stop. No additional user interaction is required to finish the documentation produced here.

## Hard execution stop

Before any separately authorized test, require explicit20-attempt/INR10 authorization, eligible account/nonsecret balance proof, verified current price/credit terms, all-in cost reservation and a demonstrated no-retry ledger. Count every potentially billed attempt; uncertain timeout costs remain reserved and stop further calls. No purchase, top-up, auto-recharge, settings edit, hidden warm-up or substitute model/voice. Changed pricing/rights/account status,402/429/503, ambiguous billing, missing cap enforcement or secret exposure stops before another request. No runner implemented here, so no claim of an enforced provider-side cap.

**NO-GO until account/credit/billing gates and explicit execution approval are satisfied. Stop after this free preflight.**
