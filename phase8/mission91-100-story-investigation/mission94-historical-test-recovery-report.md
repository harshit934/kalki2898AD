# Mission94 historical test recovery — PARTIAL

2026-11-16, Asia/Calcutta. Recovery only; no gameplay changes.

## Exact targets and ownership

1. `phase8/phase8.8/mission1-guidance-cleanup/combat-results.json`: the Mission1 guidance-cleanup staging's own rerun of inherited Phase8.6 combat/difficulty/healing/save tests. Original historical log records20PASS/0FAIL. It is not interchangeable with earlier combat result files because per-run performance measurements differ.
2. `phase8/phase8.8/mission1-guidance-cleanup/mission91-results.json`: the same cleanup milestone's inherited Mission91 campaign/inspection/cinematic/checkpoint regression results. Content originated in Mission91 validation and was identically preserved in the Bujji-fix and cleanup runs. Original log and authentic recovered file both show25PASS/0FAIL.

Their ownership/provenance is supported by the cleanup `run-checks.mjs`, test scripts, retained `.test.log` files, earlier Bujji-fix results, and pre-incident hash manifests. The current files were overwritten by copied Mission94 legacy tests retaining hard-coded output paths. Their contents were not replaced during this recovery.

Observed filesystem times:

- Combat: created2026-11-16T14:42:21.4245073Z; last write2026-11-16T16:35:30.2895853Z (**22:05:30.2895853 IST**).
- Mission91: created2026-11-16T14:42:21.1714686Z; last write2026-11-16T16:35:31.3569458Z (**22:05:31.3569458 IST**).

These last-write times are consistent with the recorded overwrite run, not independently immutable forensic timestamps. Exact original pre-overwrite last-write times of the cleanup files were not preserved in the hash-only manifests.

## Recovery outcome

**Mission91 results: authentic content recovered, high confidence.**

- Selected source: `phase8/phase8.8/bujji-contract-fix/mission91-results.json`.
- Independent corroboration: `phase8/phase8.8/mission91/mission91-results.json`.
- Both match the cleanup target's pre-overwrite SHA256 exactly: `47455d8b98c7b7c2c9a5d58bce20295d1226fdd67cdf82a503c6db834337f4fe`.
- Separate recovery copy: `phase8/mission91-100-story-investigation/historical-test-recovery/recovered/mission91-results.json`,4058bytes, hash verified.
- Recovered last-write time preserves the selected source's2026-11-16T14:22:17.289Z timestamp. Creation time is new. This is not claimed to reproduce the cleanup file's unknown original last-write time.
- Pre-incident corroborating manifests: `enemy-boss-flow/protected-before.json`, `mission94/protected-before.json`, cleanup `integration-before.json`; cleanup launch snapshot independently records the Mission91 source hash.

**Combat results: not recovered.**

- Required original SHA256: `f28f6fbe5585f43d65ddc246d6bafa7e691ae3db559265c61186e8ab6a5186f9`.
-586 candidate JSON/backup-format files under Phase8 were hashed. No candidate matched this exact value. All named combat candidates are enumerated with hashes in `historical-test-recovery/investigation-results.json`.
- Source rollback directories contain source, not an authentic copy of this run's output JSON. Earlier Phase8.6,8.7,integration,Mission91 and Bujji combat results have different hashes and were rejected as replacements.
- Project has no local.git directory. Read-only queries against the parent repository atC:/Users/Hp returned no commits and no index entries for either exact target path. Evidence: `git-history.txt`, `git-index.txt` in the recovery directory, both empty with successful query exits. No checkout/reset was used.
- The old cleanup `combat.test.log` retains the historical20PASS summary and benchmark evidence, and old manifests retain the original hash. These were left intact. They are supporting evidence, not a byte-for-byte original JSON and were not used to reconstruct one.
- No external authentic backup was supplied. Unavailable OS/version-history/cloud backups were not guessed or claimed inspected. An external backup matching the expected hash would be needed for complete recovery.

## Protection and stop

Separate working directory: `phase8/mission91-100-story-investigation/historical-test-recovery/`. Baseline8966 existing project files recorded before recovery verification. Comparison found8966 unchanged, zero differences. Current overwritten files remain exactly as found; neither restored in place. Production, Mission94 source/build/rollback, prior staging, approved story and personal saves were not modified by recovery.

One authentic content recovery of two targets is complete. Overall recovery remains incomplete because the original combat JSON is unavailable in inspected sources. Stop recovery here; do not regenerate historical tests, substitute another run or proceed with Mission94 implementation. The incident is not resolved as a full integrity restoration.
