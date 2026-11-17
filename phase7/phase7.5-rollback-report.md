# Phase 7.5 rollback

Current isolated candidate: `phase7/phase7.5/staging/`. Untouched baseline: `phase7/phase7.5/rollback/`, 181/181 files verified against before.json and unchanged Phase 7.4 staging.

Only retained source differences are modified `src/game/BujjiCompanion.jsx` and new `src/game/companionMath.js`. To abandon the optimization, use the existing Phase 7.4 staging/version; no production restoration, save reset or migration is required. Its browser acceptance remains BLOCKED.

For a physical restoration, make another new copy from this milestone's rollback, preserving both current candidate and evidence. Do not overwrite production, Phase 7.1–7.4, their rollback directories or personal browser storage. No assets or dependency environments need restoring.

The material-cache trial is preserved outside staging solely as evidence and was reverted; KashiEnvironment matches rollback. baseline-build and build are isolated compiled comparisons, not deployed games.

Fresh integrity: protected 47/47; production 153/153; Phase 7.4 181/181; Phase 7.3 178/178; Phase 7.2 174/174; Phase 7.1 173/173; Phase 6 171/171; rollback 181/181. Scout/Warden implementation files 7/7 and audio files 8/8 match inside the candidate. Personal saves were never accessed.

No browser or server launched. Test/build/lint processes finished; no task-owned background process was created. Production and previous phase reports were not edited.
