# Milestone 5G.5A — Local Azure preflight verification

**Result: BLOCKED / UNVERIFIED. One-sample synthesis is not ready for approval.**

## Inspection and check results

Read the requested 5G.5 connection/readiness reports and 5G.4 preflight report. Rechecked local configuration rather than assuming it had been supplied.

- **PASS — secret-safe inspection:** examined names and presence booleans only for `AZURE_SPEECH_KEY`, `SPEECH_KEY`, `AZURE_SPEECH_REGION`, `SPEECH_REGION`, `AZURE_SPEECH_ENDPOINT`, `SPEECH_ENDPOINT`, `AZURE_SPEECH_RESOURCE_ID`, `AZURE_ACCESS_TOKEN`, `AZURE_CONFIG_DIR`. All absent in process, user and machine scopes. No credential value printed, copied or persisted.
- **FAIL — local prerequisites:** Azure CLI remains unavailable on PATH and the default Azure CLI profile file is absent. The existing helper has no configured resource ID or authentication path. This does not prove an Azure account/resource does not exist remotely or in another session.
- **UNVERIFIED — endpoint/region:** no configured target found; no endpoint or region guessed.
- **UNVERIFIED — authentication/resource response:** no credentials or resource target available; no real Azure request attempted. No authentication rejection or network outage inferred.
- **UNVERIFIED — F0 tier and eligibility:** no authenticated resource/subscription evidence available. Published free-tier availability is not account eligibility.
- **UNVERIFIED — remaining quota:** no accessible usage evidence. The helper's quota acknowledgement variable is not an independent quota measurement.
- **UNVERIFIED — regional `te-IN-MohanNeural`:** previous documentation evidence remains preserved, but no configured-region voice-list response exists. No pronunciation or language approval claimed.
- **PASS — paid-resource guard:** re-executed the existing helper against offline mocked S0 metadata, including its synthesis flag in the mock-only test. It refused the resource after exactly one mocked metadata read; no key retrieval, voice listing or synthesis followed. No real API requests occurred.
- **PASS — no silent paid fallback in inspected script:** the same live F0 validation precedes key retrieval; key comes from that resource, endpoint derives from its region, and the script has no resource-creation, tier-upgrade or alternate paid-provider branch. No automatic retry is implemented. This is source/offline evidence, not proof about concurrent external resource changes or future service billing policy. A resource tier must not be changed during any later evaluation.

## Exact missing configuration

For the **existing prepared helper**, the user must provide locally:

1. `AZURE_SPEECH_RESOURCE_ID`: the full resource ID of the existing eligible F0 Speech resource. In Azure portal, open that resource's Properties/JSON view and obtain its resource ID. Do not create or upgrade a resource as part of this task.
2. An authenticated management connection: an installed, signed-in Azure CLI available to this process, **or** a securely supplied short-lived `AZURE_ACCESS_TOKEN` for Azure Resource Manager. Appropriate permissions must allow reading resource metadata and listing that resource's keys. Do not paste the token/key into chat, project files or command arguments. CLI installation/sign-in was not performed.
3. Confirm in the resource's Pricing tier that it is **F0**, verify it is ready, and inspect current usage/quota before any synthesis approval. If quota is unavailable, report it as unverified; do not assert a remaining balance.

The helper derives region and endpoint from authenticated resource metadata; it does not require separate region/endpoint variables. A Speech key alone may allow voice-list access but cannot independently establish F0 SKU or remaining quota. `AZURE_SPEECH_F0_QUOTA_CONFIRMED=YES` is a later manual acknowledgement only, not a substitute for evidence; it is unnecessary for this preflight and was not set.

If configuration exists in another terminal, it may not be inherited by this Codex process. Make it available through a secure local session and rerun non-synthesizing preflight. No credentials were invented or searched for in unrelated files, browsers or personal profiles.

## Integrity and stop

The prepared `one_sample.py` hash matches the previous recorded check; no script changes. **357/357** recorded production/source/configuration files and **3/3** original dialogue-source files match their preserved baseline. No production, audio, drafts, saves or earlier evidence modified. Personal saves not accessed. No fresh independent 47-file/14-copy/11-save audit claimed.

Created the two requested reports and isolated evidence `phase6/azure-preflight5g5a/verification-results.json`. No real Azure API, paid request, audio generation, resource creation/upgrade, dependency installation or persistent configuration change performed. No evaluation WAV exists. No server or owned background process launched. Build/lint unnecessary for this audit.

**Stopped before synthesis. Required live checks remain blocked by missing local configuration.**
