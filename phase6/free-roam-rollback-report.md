# Free-roam exploration — rollback and preservation

15 November 2026. **Saved safely; browser acceptance blocked by memory.**

- New working copy: `phase6/free-roam-staging/staging/`.
- Untouched pre-edit copy: `phase6/free-roam-staging/rollback/`.
- Initial hashes: `phase6/free-roam-staging/before.json`.
- Final comparisons/exact changed paths: `phase6/free-roam-staging/integrity-results.json`.
- Test status: `phase6/free-roam-test-results.json`.
- Browser startup failure: `phase6/free-roam-staging/attempt-1794759600009/startup-failure.json`.

Verified unchanged: 47 protected assets, 153 production source/config files, 159 rollback files, 1,271 prior 5H.38–40/cinematic stage files and 1,135 older bounded evidence files. No old reports, source audio, character assets, campaign copies or rollback points were overwritten. Personal saves were not accessed; no independent claim about their contents is made.

The browser process did not produce a check journal before the native allocator abort. The failure observation is preserved as such, not represented as recovered evidence. The Node test process exited with code 1; a subsequent unrestricted read-only process check found no temporary Playwright Chrome parent. No test server is intentionally running. Existing user applications were left alone.

No production restoration is needed. To set this experiment aside, retain the entire new directory and use untouched production or the previous cinematic staging copy. Do not copy experimental source, exploration keys or test profiles into production/personal data. If later reverting this new staging source, compare the recorded changed paths with its rollback; preserve new exploration modules separately instead of deleting them automatically.

Resume only after memory headroom is available. Review the existing scripts first. `node phase6/free-roam-staging/state.test.mjs` runs unit state checks; `node phase6/free-roam-staging/browser.test.mjs` is the pending actual UI/control/boundary/persistence test and must use a disposable profile. The launch helper is unexecuted; do not start it while resources remain insufficient. Native dependency optimization may need a lower-overhead test-server approach if the documented failure repeats, but none was silently substituted or claimed tested here.

Stop after preservation/reporting, as requested by the user's explicit response. No further browser launch, source development or production merge.
