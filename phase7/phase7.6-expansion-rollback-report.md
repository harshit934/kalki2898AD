# Phase 7.6 expansion rollback

Isolated candidate: `phase7/phase7.6-expansion/staging/`. Pre-expansion copy: `phase7/phase7.6-expansion/rollback/`, 187/187 files match `phase7/phase7.6-expansion/baseline.json`. Original `phase7/phase7.6/staging/` remains187/187 identical, and its182-file rollback remains intact.

No source was copied back to production or previous stages. To abandon this extension, launch the unchanged original7.6 staging, or create another isolated copy from this expansion rollback. Do not overwrite a working stage, delete rollback data or reset browser storage. The seven new modules and two presentation wiring changes are confined to the expansion copy.

When resources are safe, launch this candidate from the project folder with `node .\phase7\phase7.6-expansion\serve.mjs` and use the printed loopback URL in a disposable profile. The server identifies itself as **Phase7.6 EXPANSION —65 effects**. Its compiled output is already built. No server currently runs.

Protected47/47 and production153/153 match, as do all recorded7.1–7.5 source hashes and Phase7.5 companion files. Personal saves, dialogues, existing audio, older reports and rollback files were not modified. No browser/server was started; all test/build processes exited. Raw tests and first-run comparison failure are retained under the expansion directory.
