# Milestone 5G.4 — Azure preflight report

15 November 2026. **Preparation PASS; live account readiness BLOCKED / UNVERIFIED. Not ready to synthesize yet.**

## Requested conclusions

- **Account readiness — UNVERIFIED:** no Azure CLI on PATH, default CLI profile or checked Azure/Speech environment configuration. No authenticated account/resource inspection possible with the discovered interfaces. This does not prove absence of a remote account. No credentials requested in chat or exposed.
- **Free-tier eligibility — UNVERIFIED:** no subscription or existing resource identified, no account-specific F0 entitlement or remaining quota confirmed. General F0 availability is not a grant to this account.
- **Voice availability — documentation verified; resource-specific UNVERIFIED:** Microsoft lists `te-IN-MohanNeural`, male, Telugu India. No authenticated regional voice-list call performed. No pronunciation or listening claim.
- **Expected cost — conditional $0:** one short evaluation within an eligible F0 allowance; no Higgsfield credit consumption. Local source length: 132 code points, 360 UTF-8 bytes. Exact billable character count/account usage unverified. Paid resources are refused by the script.
- **One-sample command prepared:** see below; **not executed**.

Documentation sources and secure setup details are in `phase6-milestone5G4-azure-setup.md`.

## Offline validation actually executed

`phase6/azure-preflight/validate_offline.py` ran five checks:

1. **PASS:** Python syntax, without creating bytecode cache.
2. **PASS:** preserved source hash, exact original line and fixed Telugu voice in SSML.
3. **PASS:** valid F0 metadata accepted; paid, wrong-kind, malformed-region and unready resource fixtures rejected. These are offline fixtures, not live account results.
4. **PASS:** missing resource ID blocks before network authentication.
5. **PASS:** offline dry run completes without network/synthesis.

Also ran the standalone `--dry-run`. Live ARM metadata, key retrieval, voice listing, quota check, synthesis, WAV decoding and pronunciation are **NOT TESTED**. No actual Azure API call, paid API request, generation, resource/subscription creation, purchase or installation occurred.

The default helper performs authenticated preflight only. It has a separately gated future synthesis branch, verifies the same F0 resource before retrieving its key, refuses redirects and existing outputs, sends at most one synthesis request, and never retries automatically. Offline tests cannot prove live service correctness or account eligibility.

## Integrity and files

Created only:

- `phase6/phase6-milestone5G4-azure-setup.md`
- `phase6/phase6-milestone5G4-preflight-report.md`
- `phase6/azure-preflight/one_sample.py`
- `phase6/azure-preflight/validate_offline.py`
- `phase6/azure-preflight/validation-results.json`

**357/357** recorded production/source/configuration hashes match, and **3/3** original Milestone 5E inputs match. The fifty-one drafts remain unchanged. No personal saves accessed or modified; production audio, gameplay, rights checks and previous reports unchanged. This is not a fresh independent 47-file/14-copy/11-save-baseline check. No audio file created. Build/lint unnecessary for isolated standard-library scripts; focused script checks recorded instead. No server or owned background process remains running. No production rollback required.

## Next prerequisite and stop

Provide access locally to an existing Speech resource through secure Azure authentication and its resource ID; no keys/tokens in chat. Run the non-synthesizing preflight to verify live F0 and exact voice availability. If no resource exists or F0 is unavailable, stop and report rather than create a paid resource or switch tiers. Resource creation/CLI installation was not performed or assumed authorized.

After explicit approval and verified F0 quota, the exact future command is:

```powershell
$env:AZURE_SPEECH_F0_QUOTA_CONFIRMED = 'YES'
python -X utf8 "C:\Users\Hp\Downloads\kalki 2898AD\phase6\azure-preflight\one_sample.py" --synthesize
```

**Stopped awaiting explicit approval before synthesis.** Account setup/eligibility remains unresolved; neither technical audio quality nor production rights is approved.
