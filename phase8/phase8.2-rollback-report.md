# Phase8.2 rollback

Isolated candidate: `phase8/phase8.2/staging/`; rollback: `phase8/phase8.2/rollback/`,199/199 files match baseline.json. Source is Phase8.1. All5141 recorded Phase7 files,559 Phase8.1 files and six prior Phase8 reports remain identical. Protected47/47 and production153/153 match. No personal save/profile access.

Eight existing staged files change and six Arc1 modules are new; exact list/hashes are in integrity-results.json. Existing boss and HUD files change only in readiness/presentation wrappers, verified by normalized full-source comparisons. Actor/weapon/world/controller/audio/ending implementations stay unchanged. No save restoration is needed.

To abandon8.2, use the existing8.1 launcher or make a new isolated copy from this rollback. Do not copy changes into production, delete snapshots, reset browser storage or overwrite a previous stage. Original overall roadmap/tracker contents are preserved as .before files under8.2. The original8.1 campaign map is retained;8.2 writes a separately named current map.

Sequential logs, Mission4’s initial assertion result and test-harness failures remain as evidence. No browser/server/monitor was started. All tests/builds exited. No next arc, production promotion, asset download or new audio.
