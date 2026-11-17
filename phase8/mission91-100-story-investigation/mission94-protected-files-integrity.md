# Mission94 protected-file integrity

**FAIL — mandatory stop triggered.** Date2026-11-16.

Before implementation, `phase8/phase8.8/mission94/protected-before.json` recorded2162 expected hashes covering production/protected records, the source enemy-boss-flow copy and its evidence/build, Mission91, mission1-guidance-cleanup and approved story. Full pre-change source copied into `phase8/phase8.8/mission94/rollback`.

Initial focused validation matched2162/2162. After copied legacy regressions, a read-only comparison identified **2160/2162 unchanged; two changed historical result files**. No gameplay source, production, approved story, personal-save store or rollback change was identified.

Changed file1: `phase8/phase8.8/mission1-guidance-cleanup/combat-results.json`

- Expected SHA256: `f28f6fbe5585f43d65ddc246d6bafa7e691ae3db559265c61186e8ab6a5186f9`
- Actual SHA256: `199f539341824dbd1c18f573569d998f01a7bd29e49580f4681aaf220a468d6b`

Changed file2: `phase8/phase8.8/mission1-guidance-cleanup/mission91-results.json`

- Expected SHA256: `47455d8b98c7b7c2c9a5d58bce20295d1226fdd67cdf82a503c6db834337f4fe`
- Actual SHA256: `d88ae264ce847d1f796a5e057a6219a0bc539b163895c71a53527429d937e12a`

Exact machine evidence: `phase8/phase8.8/mission94/protection-failure.json`. The copied test files contain hard-coded prior-stage output paths; these caused the writes. No processes were stopped or existing servers reconfigured.

Production153 and protected47 entries are within the checked manifest and did not differ. Mission91 source, divine implementation, original approved story and existing rollback sources did not differ. Personal browser storage was never opened. This is not a blanket integrity PASS: two prior-stage result records were unexpectedly overwritten.

No speculative reconstruction or silent restoration was attempted. Recover these two files only from an authentic copy matching their expected hashes, then recheck the entire manifest. Do not weaken baseline expectations to make the check pass. New implementation remains preserved for review, not promoted or accepted.
