# Phase 8.4 rollback and integrity

Working source: phase8/phase8.4/staging. Compiled output: phase8/phase8.4/build. Untouched rollback: phase8/phase8.4/rollback,215/215 baseline hashes matched. To abandon8.4, use the preserved8.3 launcher directly; do not copy changes into production or overwrite any prior stage. To inspect original8.4 input, compare staging against rollback. Keep both copies and all evidence. No deletion or restoration has been performed.

- production: 153/153 SHA256 match
- rollback: 215/215 SHA256 match
- historicalPhase8Reports: 18/18 SHA256 match
- phase7: 5141/5141 SHA256 match
- phase81: 559/559 SHA256 match
- phase82: 626/626 SHA256 match
- phase83: 587/587 SHA256 match
- protected: 47/47 SHA256 match
- unchangedStaging: 212/212 SHA256 match

Only the3 authorized staged existing files and6 new character files listed in the implementation report differ. Earlier stage sources, builds, rollbacks and historical reports were read, not rebuilt or edited in this task. Root roadmap/progress backups are preserved in8.4. Personal profiles/saves were not accessed or independently read-verified. No browser/server/monitor launched; all owned test/build processes exited. No production integration.
