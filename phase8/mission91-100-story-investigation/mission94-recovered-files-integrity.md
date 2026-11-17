# Recovered historical files — integrity

2026-11-16. **PARTIAL recovery; originals left untouched.**

## Mission91 result

Target: `phase8/phase8.8/mission1-guidance-cleanup/mission91-results.json`.

- Pre-overwrite expected: `47455d8b98c7b7c2c9a5d58bce20295d1226fdd67cdf82a503c6db834337f4fe`.
- Current overwritten target: `d88ae264ce847d1f796a5e057a6219a0bc539b163895c71a53527429d937e12a`.
- Bujji-fix source, independent Mission91 source and recovered4058-byte copy: all exactly equal to the pre-overwrite expected hash.
- Recovered path: `C:/Users/Hp/Downloads/kalki 2898AD/phase8/mission91-100-story-investigation/historical-test-recovery/recovered/mission91-results.json`.
- Content authenticity: **verified exact match**. Source last-write timestamp preserved; original target timestamp not reconstructable from available hash records. No in-place restoration performed.

## Combat result

Target: `phase8/phase8.8/mission1-guidance-cleanup/combat-results.json`.

- Pre-overwrite expected: `f28f6fbe5585f43d65ddc246d6bafa7e691ae3db559265c61186e8ab6a5186f9`.
- Current overwritten target: `199f539341824dbd1c18f573569d998f01a7bd29e49580f4681aaf220a468d6b`.
- No exact candidate among586 scanned files; no tracked/path-history Git recovery source found. No recovery copy was created for this target.
- Status: **unrecoverable from inspected available project sources**. Logs/hash evidence survive; full original JSON content does not have an authenticated recovery source. No fabricated reconstruction or rerun.

## Before/after protection

Recovery baseline: `historical-test-recovery/baseline.json`,8966 existing files, including Mission94 implementation, prior-stage result files as found and established production/protected path entries. End-of-investigation comparison:8966/8966 identical, zero changed existing files. The two target paths remain their overwritten hashes listed above.

Machine evidence: `historical-test-recovery/investigation-results.json`, `target-metadata.json`, `git-history.txt`, `git-index.txt`. Only new recovery evidence/copies and the two recovery reports were added during recovery. No source, gameplay, staging configuration, approved story, rollback or save was modified. No browser/server/test run. Mission94 implementation preserved; no Mission95 work.
