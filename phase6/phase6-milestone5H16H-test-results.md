# Milestone5H.16H — Local test results

**PASS19/19 mock-only checks. Real API calls0; real credits consumed0; generated audio0.**

[Raw machine-readable test results](sarvam-safety-controller/test-results.json).

1. **PASS — 20th and21st**: Request20 succeeds; request21 rejected;20 mock calls;664 paise and664 centi-credit simulated reservations, not actual spend.
2. **PASS — INR budget**: Rejected before second transport; run halted, no further calls.
3. **PASS — credit budget**: Separate local credit-estimate limit blocks next request.
4. **PASS — duplicates**
5. **PASS — retry**
6. **PASS — allowlist mutations**
7. **PASS — path escapes**
8. **PASS — overwrite**
9. **PASS — reserve before call**
10. **PASS — unknown transport/no retry**
11. **PASS — unexpected mock charge**
12. **PASS — persistent resume**
13. **PASS — interrupted reservation**
14. **PASS — invalid cost policies**
15. **PASS — concurrency lock**
16. **PASS — secret-safe errors**
17. **PASS — corrupt ledger**
18. **PASS — mock-only transport**
19. **PASS — matrix equivalence**: All20 frozen rows match original matrix settings.

Required boundaries demonstrated: twentieth request completes; twenty-first rejected without another transport invocation. Independent INR and hypothetical-credit exhaustion block before a further request; duplicate and explicit retry rejected. Mutated requests and path traversal/absolute/cross-ID output rejected before transport; existing output preserved. Ledger inspected from mock callback proves reservation exists before send. Unknown outcome retains reservation and halts; restart does not replay in-flight or used IDs. Exclusive lock rejects overlapping calls. Error-message sentinel absent from persisted ledger. Corrupt ledger not reset; nonmock transport rejected.

Full20-row run reserves**664 paise and664 simulated centi-credits**, not actual spend. Entire suite contains30 persisted mock reservation entries across independent boundary fixtures; no real account requests occurred. Fixture cost/unit mappings are synthetic policy tests, not verified provider accounting. No WAV files created in the mock root. No pronunciation or emotional rating entered.

No claim of real INR10 all-in guarantee, commercial entitlement, authenticated usage, API timeout behavior or physical filesystem attack testing. Existing audio remains unchanged. Production/browser/game regression unnecessary because no production code was modified; no build/lint or actual audio playback PASS invented.

**Tests finished; stopped.**
