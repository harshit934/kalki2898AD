# Cinematic opening — preservation and rollback

15 November 2026. **Production unchanged; isolated rollback preserved.**

## Locations

- New implementation: `phase6/cinematic-opening-staging/staging/`.
- Untouched initial copy: `phase6/cinematic-opening-staging/rollback/`.
- Initial source/protected/prior-stage hashes: `phase6/cinematic-opening-staging/before.json`.
- Final verification and exact six-file staging change list: `phase6/cinematic-opening-staging/integrity-results.json`.
- Browser attempts, screenshots, unit/build/lint logs and camera config remain in the new directory.
- Prior 5H.38, 5H.39 and 5H.40 directories remain untouched. No old rollback was reused as a writable working copy.

## Verification

Fresh checks match **47/47 protected**, **153/153 production source/config**, **157/157 new rollback**, **808/808 prior-stage snapshot**, **1,135/1,135 older bounded evidence** files. No generated/extracted/copied audio and no personal profile/save access. No .env copied or credentials read. No assets, models, packages or services acquired.

The new presentation marker is written only by the test game in disposable browser storage. Existing campaign key/schema/reward/unlock logic is unchanged. Natural completion/skip, reload and interrupted refresh were exercised without campaign seeds or setters; campaign records remained unchanged by the cinematic.

## Reversion

No production restore is needed. Stop any future owned launch helper/browser and leave the new evaluation path; run untouched production or an earlier accepted staging copy. Preserve the new evidence and rollback rather than deleting files. Do not copy staging source or its presentation marker into a personal save profile.

If further authorized staging work needs reversal, compare the six changed paths with the untouched rollback and restore only the new staging copy after review. New configuration/state modules are not present in that pre-edit source; retain them separately rather than automatically deleting them. Do not alter protected assets or unrelated work.

## Cleanup

All four browser attempts closed their disposable Chrome process and staging Vite server in finally. The final successful run records `processesStopped=true`; unit/build/lint/verification commands completed. The manual `launch.mjs` helper was created but not executed. No test server is intentionally left running.

Stop after reporting. No production integration or additional development authorization is inferred.
