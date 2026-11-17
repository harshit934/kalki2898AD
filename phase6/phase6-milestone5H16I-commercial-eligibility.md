# Milestone5H.16I — Commercial eligibility and billing audit

**15 November2026, Asia/Calcutta. Decision: NO-GO for synthesis.** Current public commercial permission is documented; this account's entitlement and an enforceable INR10 total cap are not established. No API/authentication calls, credit use or production modification.

## Evidence scope and user information

Read all5H.16A–5H.16H reports and inspected the existing matrix/cost evidence and mock-controller limitations. Current official pricing, commercial licensing, EULA, ToS, billing, platform FAQ and troubleshooting documentation were reviewed through public web pages, not authenticated APIs.

The current user message describes **this account's100 free credits**. Treat that as user-reported account information, not as if no information was provided. It is not a dated dashboard verification of current balance, verified-user credit type/conditions, outstanding usage, plan/organisation contract, tax treatment or auto-recharge state. No account session, receipt or additional nonsecret account document was explicitly supplied or inspected. Key presence was previously established; this audit did not reread .env or authenticate it. No secret requested, displayed, copied or transmitted.

## Requirement1 — These100 free credits' commercial qualification

**UNVERIFIED for this account. PASS for the public qualifying-credit policy.** Official commercial documentation expressly says verified-user free credits can license exported audio and that qualifying credit consumption counts as payment. This is not an evaluation-only restriction. But reported balance alone does not establish the exact credit grant or any overriding promotional/account conditions. Need dated nonsecret verification of verified-user status, grant type/current usable balance and applicable conditions. [Commercial Licensing, Production License and credits](https://docs.sarvam.ai/api/getting-started/commercial-licensing).

## Requirement2 — Verification and additional terms

**PASS: requirements identified. UNVERIFIED: this account satisfies them.** Public signup offer is for verified users; EULA/ToS compliance applies. Current ToS5.4 permits eligibility, usage and expiry conditions and revocation of complimentary access; it is not a promise that every promotional balance is permanent. No evidence requires a separate universal paid production tier for qualifying credit-funded audio; do not invent that prerequisite.

EULA last modified22 May2026; ToS Version2.0 effective29 July2026. Commercial policy has no displayed numerical version/effective date; checked15 November2026. The documentation's never-expire marketing claim must not override ToS/account-specific conditions. Actual account acceptance, amendments and verification status remain unknown. [ToS5.4 and tax provision](https://www.sarvam.ai/terms-of-service), [EULA](https://www.sarvam.ai/eula), [public credits description](https://docs.sarvam.ai/api/getting-started/pricing).

## Requirement3 — Commercial game distribution

**PASS for documented conditional permission; UNVERIFIED for future account-generated assets.** Official commercial policy explicitly lists paid-game audio use when generated on the account with qualifying credits consumed. EULA assigns output rights between parties, reserves provider IP and requires lawful input/use. No stock-voice ownership, exclusive copyright, actor-imitation permission or clearance for unrelated game IP is granted. No separate shubh/ratan exception was located in reviewed public terms, but a specific contract may differ. Need per-asset request/credit/text/output provenance before actual packaging approval. [Commercial policy, Common commercial use cases and rights after stopping](https://docs.sarvam.ai/api/getting-started/commercial-licensing), [EULA, Your Content and Output](https://www.sarvam.ai/eula).

## Requirement4 — Price, GST and other charges

**PASS: public rate and estimate. UNVERIFIED: account-specific tax and final charges.** Current official v3 pay-as-you-go/Pro/Growth rates are INR3/2.85/2.70 per1000 characters, excluding GST, with TTS nearest-character usage rounding. Plan charges are separate; no plan change is authorized. User's account plan and any custom rate unknown. Current20 rows/1740 code points at list rate yield INR5.22 ex-GST; local25% margin/upward per-request rounding reserves INR6.64 ex-GST. These sums were rechecked, not measured billing.

ToS requires applicable tax where charged. Reviewed Sarvam sources do not establish this user's GST percentage, whether it is applied at credit purchase or usage, any applicable extra fees or actual invoice rounding. Do not guess a tax rate or impose it twice. A search result for similarly named `sarvm.ai` is a different domain and was excluded. Absence of a documented extra per-call fee is not a universal zero-extra-charge guarantee. Need nonsecret account quote/tax/credit-unit evidence. [Pricing and billing notes](https://docs.sarvam.ai/api/getting-started/pricing), [ToS tax provision](https://www.sarvam.ai/terms-of-service).

## Requirement5 — Provider-enforced spending limit

**UNVERIFIED for an applicable INR10 Bulbul cap. FAIL for relying on a workspace budget as that mechanism.** Official billing states “no per-workspace budget or balance” and documents organisation-wide shared credits plus automatic top-ups. Platform FAQ recommends a separate organisation for hard spend separation. That means another workspace/key on a reported100-credit organisation does not establish a10-credit ceiling; no new organisation or settings change is authorized. [Billing: credit scope, auto-recharge and usage](https://docs.sarvam.ai/api/platform/billing), [Platform FAQ: billing separation](https://docs.sarvam.ai/api/platform/faq).

Exhausting prepaid organisation credits produces402, but this is not a confirmed INR10 stop on an account with100 credits, nor a guarantee of exact boundary enforcement during an in-flight call. A low-balance alert, rate limit or no-top-up instruction does not create a hard spend limit. Auto-recharge is documented; this account's setting is unknown and was not inspected or changed.

Troubleshooting mentions `seat_budget_exhausted_error` and `error.spend_limits`. That is evidence of a budget-related error somewhere on the platform, **not proof that a configurable seat/key budget is offered to this user or applies atomically to Bulbul v3 synthesis**. No setup/scope/rounding guarantee was found that closes this gate. Therefore do not assert Sarvam has no budget mechanism anywhere; exact applicable facility remains UNVERIFIED. [Troubleshooting, Common pitfalls](https://docs.sarvam.ai/api/getting-started/errors-troubleshooting).

Closure evidence: provider documentation or an existing account contract showing an available, configured and enforced cap applicable to this exact organisation/key/model, units/period, in-flight/overshoot behavior and no auto-top-up; confirm without billing changes/API calls. No support message sent. A separately supplied nonsecret account/provider confirmation could resolve this; it is not currently present.

## Requirement6 — Guaranteed INR10 total

**FAIL for treating the current local implementation as a guarantee; UNVERIFIED for any provider-backed guarantee.**5H.16H has19 passing mock tests and real useful local controls, but explicitly models ex-GST estimates and simulated credit mapping only. It has no live provider adapter or binding billing enforcement. A request's actual charge may only be learned after execution; stopping after an unexpected charge cannot retroactively guarantee a prior bound.

A nominalINR5.22 or reservedINR6.64 belowINR10 is an estimate, not proof against tax/unit discrepancies, account changes, concurrent organisation usage, retries outside this mock controller, automatic top-up or overshoot. No execution here, no challenge to its mock PASS, no weakened budget gate. Both approved ceilings—maximum10 credits and INR10 total—remain unverified in actual units/account conditions.

## Exact blocker and next evidence

1.Account: nonsecret dated verified-user/credit-grant/current-balance evidence and applicable contractual restrictions; user's100-credit statement alone is insufficient for all those dimensions.
2.Billing: actual rate/unit/tax/fees and conservative maximum attributable cost, not just published average price.
3.Enforcement: evidence of an applicable provider cap or a documented demonstrably bounded all-in mechanism satisfying the user's guarantee requirement. Existing mock safeguards alone do not meet it; no new synthesis/setting change to test it is permitted here.

Readiness permissions persist, but no additional user authorization can substitute for unknown factual guarantees under the current strict gate. If evidence cannot establish them, remain stopped rather than repeatedly attempting generation or changing the cap. This audit does not propose a new numbered milestone or automatic implementation.

## Preservation and decision

Only two requested reports created; exact before/after unchanged counts are in the companion report. Existing controller, audio,51 drafts, source/public files, rollback and prior5H.12/5H.16H decisions preserved. No save/profile or private dashboard accessed, no key check, API requests, purchases, payment details, synthesis, credits or settings changes. Public-documentation browsing only. No server/worker started.

**NO-GO for synthesis. Not a voice-quality judgment or production approval.**
