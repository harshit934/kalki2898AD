# Milestone 5G.4 — Azure Speech setup

15 November 2026. Preparation only. **No synthesis or Azure resource creation performed.**

## Readiness

Read the preceding 5G.1–5G.3 reports and original draft source. Azure CLI was not found on PATH; the default `~/.azure/azureProfile.json` file does not exist. Process, user and machine settings checked for `AZURE_SPEECH_KEY`, `SPEECH_KEY`, `AZURE_SPEECH_REGION`, `SPEECH_REGION`, `AZURE_SPEECH_RESOURCE_ID`, `AZURE_ACCESS_TOKEN`, `AZURE_TENANT_ID`, `AZURE_CLIENT_ID`: all absent. Values were not printed. No connected Azure management tool was identified.

This means **account/resource availability and F0 eligibility are UNVERIFIED**, not that the user has no Azure account or cannot obtain F0. Browser sessions, credential stores and personal profiles were not opened. No login, dependency install, subscription or resource was created.

## Voice, cost and rights

Microsoft's published support table lists stock male `te-IN-MohanNeural`, locale `te-IN`. **Documentation-confirmed; selected-resource live availability NOT VERIFIED.** The preparation script requires the live regional voice list to return the exact name, gender, locale and neural type. [Microsoft voice support](https://learn.microsoft.com/fr-fr/azure/ai-services/speech-service/language-support?tabs=pronunciation-assessment).

Published F0 neural allowance is **500,000 characters per month**. Expected cash impact is **$0 only if an eligible live F0 resource has sufficient allowance**. The existing draft contains 132 Unicode code points / 360 UTF-8 bytes; these are local measurements, not a confirmed Azure billable-character count. It uses no Higgsfield credits. No actual account balance, usage or billing impact was verified. [Azure Speech pricing](https://azure.microsoft.com/en-us/pricing/details/speech/?msockid=0b97892b36d8644200949fb9373565ed).

The script refuses S0/paid resources and has no paid fallback. F0 quota exhaustion must stop the test, not trigger an upgrade. Free evaluation output is not automatically licensed for game distribution: Microsoft's express commercial-use provision is for paid-tier prebuilt neural output. [Microsoft Product Terms](https://www.microsoft.com/licensing/terms/product/MicrosoftAzure/all).

## Isolated script and secure configuration

Script: `phase6/azure-preflight/one_sample.py`. Python standard library only; no SDK install required. It reads the unchanged original CSV and checks its preserved SHA-256. Output is fixed to `phase6/azure-preflight/evaluation-mohan.wav`, outside production assets. It imports no gameplay code.

Required configuration for a later authenticated preflight:

- `AZURE_SPEECH_RESOURCE_ID`: exact existing public-Azure Speech resource ID, in the form `/subscriptions/<subscription-id>/resourceGroups/<resource-group>/providers/Microsoft.CognitiveServices/accounts/<resource-name>`. Identifiers are placeholders, not a discovered resource.
- Authentication: either an already installed/signed-in Azure CLI session, or a short-lived `AZURE_ACCESS_TOKEN` scoped for `https://management.azure.com/`. No login or CLI installation has been performed by this task.
- `AZURE_SPEECH_F0_QUOTA_CONFIRMED=YES`: required only for a later approved synthesis. Set only after checking remaining F0 usage/eligibility. This acknowledgement is not an automated usage query.

The helper intentionally does **not** accept an arbitrary Speech key/region pair: a supplied key might belong to a paid resource. It reads the target's live ARM metadata, demands `kind=SpeechServices`, `sku.name=F0`, ready provisioning and a valid region, then retrieves that same resource's key in memory via `listKeys`. This requires account-read and list-keys permissions; Reader access alone may be insufficient. Local authentication must be available. No key is printed, written or placed on a command line.

`AZURE_SPEECH_KEY` / `SPEECH_KEY` and a region are common SDK settings, but are not used by this safer isolated helper. The region is derived from the verified resource, never guessed. ARM authorization and the resource key are sent only to fixed HTTPS Microsoft hosts; redirects are refused. Errors expose status/category only, not response bodies, tokens or credentials. Sovereign/private-endpoint configurations are outside this bounded script's scope and must stop rather than be guessed.

Do not paste keys/tokens into this chat, project `.env`, Vite `VITE_*` variables, reports, shell command arguments or browser code. Use a secure local sign-in/secret mechanism and process-scoped environment configuration. An ARM token is a secret even when short-lived. Nothing was added to persistent environment settings.

## Request lifecycle

Default execution is **preflight only**:

1. Verify original draft hash and fixed line `BH6-5E-001`.
2. Read live resource using ARM GET and verify F0/ready state.
3. Read that resource's keys using the documented management `listKeys` POST; this retrieves credentials, not audio, and does not create/rotate keys.
4. GET the regional voice list; verify the exact voice. No synthesis at this stage.
5. Only with explicit later `--synthesize` and quota acknowledgement, reserve a new output file and issue exactly one SSML synthesis POST. No retry or fallback. Existing output prevents another run. If failure leaves an empty reservation, inspect the outcome before any manual retry; do not assume the request never reached Azure.

The script uses documented API version `2024-10-01` for management. [Account GET](https://learn.microsoft.com/en-us/rest/api/aiservices/accountmanagement/accounts/get?view=rest-aiservices-accountmanagement-2024-10-01), [List keys](https://learn.microsoft.com/rest/api/cognitiveservices/accountmanagement/accounts/listkeys). Regional listing/synthesis paths and WAV output follow the [Speech REST reference](https://learn.microsoft.com/azure/ai-services/speech-service/rest-text-to-speech). A future live preflight may reveal endpoint, policy or permission constraints not covered by offline checks.

## Exact commands

Offline preparation already executed; no network or synthesis:

```powershell
python -X utf8 "C:\Users\Hp\Downloads\kalki 2898AD\phase6\azure-preflight\one_sample.py" --dry-run
```

After securely configuring an existing resource/authentication, read-only live preflight; no synthesis:

```powershell
python -X utf8 "C:\Users\Hp\Downloads\kalki 2898AD\phase6\azure-preflight\one_sample.py"
```

**Do not run until explicit synthesis approval is granted**, live preflight passes and adequate F0 quota has been checked:

```powershell
$env:AZURE_SPEECH_F0_QUOTA_CONFIRMED = 'YES'
python -X utf8 "C:\Users\Hp\Downloads\kalki 2898AD\phase6\azure-preflight\one_sample.py" --synthesize
```

No human language review is required for this preparation/test. Draft approval remains PENDING/UNVERIFIED; no actor reference, custom voice or imitation is involved. Future output is evaluation-only and must not be copied into production without separate clearance.
