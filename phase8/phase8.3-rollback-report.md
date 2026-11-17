# Phase8.3 rollback

New source `phase8/phase8.3/staging/`; rollback `phase8/phase8.3/rollback/` contains205/205 original8.2 source files matching baseline.json. Four existing staged files change (HTML identity, App inspection route/HUD, World extension mount and CollectionEffects discovery/active guard); ten worldExpansion files are new. Strict normalized source checks cover the integration edits. Original player, combat, Arc1 contracts, world geometry, cameras, progression and saved-data code are unchanged.

To abandon the candidate, use the existing8.2 launcher or create a new isolated copy from this rollback. Do not merge into production, remove prior snapshots, reset browser storage or overwrite accepted stages. New discoveries are session-only; no save migration/restoration is required. Tracker before-copies are under8.3.

Fresh hashes match protected47/47, production153/153, Phase7 5141/5141,8.1 559/559,8.2 626/626 and12 historical Phase8 reports/maps. These snapshots exclude caches/node_modules/secrets.

Audit qualification: one accidental8.2 build command rebuilt its compiled files;626 content hashes stayed identical and no file was added, but modification times/cache may differ. No source or rollback edits/restoration occurred. Retain prior-build-check.json. The final8.3 build is separate. Personal saves/profile were never accessed. No browser/server/monitor launched; all checks/builds exited. No next phase.
