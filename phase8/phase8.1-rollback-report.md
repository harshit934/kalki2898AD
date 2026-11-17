# Phase 8.1 rollback

Candidate: `phase8/phase8.1/staging/`; rollback: `phase8/phase8.1/rollback/` (194/194 match `baseline.json`), from untouched Phase7.7. All5141 recorded Phase7 files, including previous staging/rollback/report files, match `phase7-before.json`. Protected47/47 and production153/153 match. No personal saves/profile accessed.

Only index.html, App.jsx and campaignSystem.js change in the new staging copy; five campaign modules are new. Existing source/assets remain available in7.7 and rollback. A pre-reset-correction copy of the new bridge is preserved separately; it is not the safe baseline and should not replace the fixed version.

To abandon this candidate, use the existing Phase7.7 launcher or create another isolated copy of this rollback. Do not copy into production, delete snapshots or reset browser storage. No personal-save restoration/migration is needed.

New overall `project-roadmap.md` and `project-progress-tracker.md` are authorized work indexes; they do not overwrite the original approved roadmap or historical checklist. They distinguish designed slots from playable prototypes. No earlier tracker/report changed. All test/build processes stopped; no browser/server launched.
