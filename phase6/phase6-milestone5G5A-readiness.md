# Milestone 5G.5A — Readiness

**NOT READY. Live connection and F0 eligibility remain UNVERIFIED.**

- **PASS:** secret-safe configuration inspection; paid-resource guard retested offline; existing script unchanged; production and dialogue-source baseline comparisons pass.
- **FAIL:** local resource ID/authentication prerequisites missing. No Azure CLI/default profile found; all checked Speech/Azure environment settings absent.
- **UNVERIFIED:** endpoint, region, authentication, successful resource response, live F0 SKU/eligibility, remaining quota and exact regional voice availability.

The user must securely configure the existing `AZURE_SPEECH_RESOURCE_ID` and either an authenticated Azure CLI session or a short-lived ARM `AZURE_ACCESS_TOKEN` with resource-read/key-list permissions. Confirm F0 and available usage in the account/resource information. Do not provide secret values in chat or project files. No resource creation or paid-tier fallback is authorized.

After configuration, run **preflight only**:

```powershell
python -X utf8 "C:\Users\Hp\Downloads\kalki 2898AD\phase6\azure-preflight\one_sample.py"
```

Do **not** add `--synthesize`. This command checks live F0 resource metadata and the regional voice list when authentication is available. It does not independently measure monthly quota. A successful preflight still requires quota evidence and separate explicit approval before one evaluation-only sample.

Full evidence and exact blockers: `phase6/phase6-milestone5G5A-preflight-report.md`. No voice approved or Telugu-verified; no audio generated or personal saves accessed. **Stopped.**
