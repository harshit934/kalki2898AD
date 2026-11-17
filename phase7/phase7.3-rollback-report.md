# Phase 7.3 rollback and integrity

Production was never changed. Do not copy staging into production.

- Baseline/rollback: `phase7/phase7.3/rollback/`, 174/174 source/config hashes match `phase7/phase7.3/before.json` and accepted Phase 7.2 staging.
- Additional preserved tested shorter introduction: `phase7/phase7.3/pre-reference-order/`. This remains separate from both baseline and current candidate.
- Current candidate: `phase7/phase7.3/staging/`; five modified and four created source files listed in the implementation report and integrity JSON.
- Existing Phase 7.1/7.2 and Phase 6 staging/rollback copies were not edited.

To abandon the candidate, stop its launcher and use `node phase7/phase7.2/serve.mjs`. To rebuild baseline safely, create another new directory from this milestone's rollback copy; never overwrite current or earlier evidence. To restore only the pre-reference-order candidate for comparison, similarly use a new copy and keep its original snapshot intact. No save migration/reset is required. Disposable browser data is separate from personal profiles.

[SHA256 verification](phase7.3/integrity-results.json): 47 protected assets, 153 production files, 173 Phase 7.1 files, 174 Phase 7.2 files, 171 Phase 6 baseline files and 174 rollback files all match. Eight audio source files also match. No personal profile opened or save file read/copied/hashed.

All browser harnesses close their own server/browser and memory monitor in finally blocks. Latest raw results record cleanup; all five owned browser PIDs were independently checked absent. No test servers are intentionally left running. Build/lint/test processes finished.
