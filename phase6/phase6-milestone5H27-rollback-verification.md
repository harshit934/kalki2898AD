# 5H.27 rollback and integrity verification

Date: 15 November 2026. **PASS for the checked file sets.** No restoration was performed.

## Fresh verification

- Protected baseline: `phase5/phase54f-stabilization-20261114/changes-and-hashes.json`, `protected` entries, compared against their expected SHA-256 values. **47/47 before and 47/47 after match.** Detailed paths and values: `milestone5H27/protected-hashes.json`.
- Existing production source/assets, staging, prototype, rollback, samples and supporting records included in the audit snapshot: **940/940 unchanged**. Evidence: `milestone5H27/integrity-before.json` and `integrity-results.json`. This is a bounded snapshot, not a claim that every file on the machine was inventoried.
- 5H.24 original-source rollback versus production source: **151 files match**.
- 5H.24 standalone rollback versus standalone prototype: **26 files match**.
- 5H.23 standalone rollback versus standalone prototype: **26 files match**.
- 5H.26 rollback preserving the pre-fix 5H.25 staging state versus its recorded snapshot: **159 files match**.

Detailed rollback comparison: `milestone5H27/rollback-checks.json`. The pre-fix rollback is intentionally not substituted for the current corrected staging candidate.

## Preserved locations and rollback procedure

Current candidate: `phase6/milestone5H24/staging/`.
Standalone: `phase6/bhairava-voice-prototype5H22/`.
Original source rollback: `phase6/milestone5H24/rollback-src/`.
Standalone rollback: `phase6/milestone5H24/prototype-rollback/` and `phase6/milestone5H23/prototype-rollback/`.
Pre-guidance-fix staging rollback: `phase6/milestone5H26/rollback-staging/`.

No rollback is needed for this audit: no staging or production source was changed. If later restoration is authorized, stop staging first, preserve the current candidate, restore only the specifically authorized staging files from the selected rollback, then recheck hashes. Do not copy staging into production or overwrite personal profiles.

## Saves and cleanup

Personal profiles and production campaign saves were not opened or modified. This is preservation by isolation, not an independent audit of personal-save contents. The new disposable persistent profile is retained under `milestone5H27/disposable-profile/`; its campaign fixture came from the naturally earned prior test save.

Both browser sessions closed, staging server stopped, and the final process check found zero matching owned staging/test Node processes. Evidence: `milestone5H27/browser-results.json` and `cleanup-results.json`.
