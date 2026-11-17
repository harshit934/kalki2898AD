# Milestone5H.16H — Isolated synthesis safety controller

15 November2026, Asia/Calcutta. **PASS for mock-only local controller implementation/tests. NO-GO for real synthesis.** Commercial account/credit eligibility, actual tax/unit mapping, current per-account pricing and provider billing-cap enforcement remain separate unresolved gates. No claim that INR10 all-in is guaranteed.

## Isolation and changed files

New non-production folder `phase6/sarvam-safety-controller/` contains `safety_controller.py`, `test_controller.py`, immutable-test matrix copy `approved-matrix.json`, its pin `matrix-pin.txt`, before/after preservation evidence and raw `test-results.json`. No existing source module, .env, audio, text, save or billing file changed.

Mock outputs only: `phase6/sarvam-evaluation/milestone5H15/controller-mock-tests/<test-run>/`. They are JSON fixture metadata/ledgers/lock artifacts, **not generated speech or playable WAVs**. Existing matrix's isolated evaluation parent is now present because of authorized local mock testing; historical reports correctly recorded it absent at their earlier checkpoints. No new production path or audio inventory entry introduced.

## Implemented local safeguards

1. **Strict20 per-run attempts.** One fixed approved S01–S20 matrix; persisted reservation counts before any mock invocation. Attempt21 is rejected before transport. Resume retains used IDs and reservations; an existing run cannot silently be recreated. Independent mock test cases intentionally use separate ledgers to exercise boundaries; they are not extra authorized real requests.
2. **Two local budget counters:** integer paise≤1000 and simulated centi-credit≤1000. Rate3INR/1000 characters,25% margin and upward-per-call paise rounding; full matrix reservation664 paise. Credits-per-INR is explicitly a **mock policy**, marked provider mapping unverified. Invalid/nonfinite/increased cap or unexpected rate/margin rejects. Real taxes, provider rounding and unit conversion are not presumed covered by this ex-GST simulation. Lower budget fixtures exercise exhaustion independently.
3. **Durable reservation before call.** Exclusive per-run lock, JSON reservation, flush/fsync and atomic replace precede the single mock send. Output/error records expose only allowlisted metadata and fixed error codes, not dialogue payloads or raw exception strings. Costs remain reserved after failure/unknown outcome; no refund permits another call. A resumed in-flight reservation halts rather than retries.
4. **No retries or concurrency.** No HTTP client, SDK, endpoint or real adapter; the controller accepts only its concrete MockTransport. attempt must equal1, duplicate ID halts, any transport exception/unexpected mock charge/output failure halts, and occupied lock rejects without waiting/retrying. No auth or secret handling added. Real networking would require a separately reviewed implementation, not merely injecting a provider callback.
5. **Frozen allowlist.** SHA-256 matrix pin, exact field set and payload equality against approved model/locale/speaker/text/profile; tests compare every row with5H.16A settings. Unknown IDs, extra fields, other voices/models/text/pace reject. Matrix/pin are trusted local audit artifacts, not cryptographically protected against a malicious user editing both; no such tamper-resistance claim.
6. **Bounded output.** Run names contain only safe lowercase letters/digits/hyphens; root is fixed inside the existing approved evaluation path. Only `<approved-ID>.mock.json` permitted. Exclusive file creation refuses overwrite; path ancestors are checked for symlink/reparse attributes. Caller-supplied traversal, absolute path or other-ID filename rejects before transport. Recheck before writing. Actual Windows junction creation and hostile filesystem race attacks were not tested; no absolute protection against an administrator changing paths between checks is claimed.
7. **Stop on failed validation.** Fixed nonsecret Stop codes, persisted halt where a valid ledger can be written, no raw provider exception logging. Corrupt ledgers remain blocked rather than overwritten/reset. If persistence fails, the exception prevents transport; no automatic repair or cleanup. Test fixtures deliberately retain a corrupt ledger and existing-output sentinel for honest evidence.

## Mock test evidence

Run command from project root:

```powershell
python -B -X utf8 phase6/sarvam-safety-controller/test_controller.py
```

Executed once successfully after fixture preparation;19/19 tests passed. Socket audit hook rejects socket events in the test process; no real key/.env read. Existing fixture directories and test-results use exclusive creation. **Do not rerun over this evidence or delete it automatically**; a future isolated test run requires a reviewed new fixture namespace, not weakening create/no-overwrite rules.

The mock transport emits metadata only. No WAV encoder, text-to-speech model, external URL, installed package, fetched payload or actor material is involved. The sentinel used for redaction testing is a synthetic string, not the actual SARVAM_API_KEY.

## Critical limits — real synthesis remains NO-GO

- This is a tested **local-estimate guard**, not a provider-enforced monetary maximum. Unexpected external charges can only be detected after a real request, so no account-guarantee is made.
- Commercial account eligibility/qualified credit balance, actual price/tax/credit units and safe all-in charge bounds remain UNVERIFIED. Their absence still blocks real execution under5H.16D/G.
- No production/real transport, timeout/billing reconciliation adapter, real usage query or authenticated request implemented/tested. A real adapter must disable implicit network retries, preserve reservations and exclusive output semantics and pass further approved testing before connection.
- Restart/duplicate controls apply to an unchanged trusted run directory/ledger. They do not protect against manual ledger deletion, malicious edits or recreating a different run to evade a provider-wide quota. Evidence must be retained; exactly one approved real-test run would be required.
- Unit mock tests are not real-browser/playback or audio-quality acceptance.5H.12 listening and voice selection remain pending. No revised production rights or packaging status.

## Rollback and preservation

Rollback is to stop using the new isolated controller; game remains text-only. Keep mock evidence, matrix copy and original audio. No production restore needed. Do not delete project files or existing rollback points. Actual hashes and unchanged counts are in `preservation-after.json` and the report. No personal save profile/payload accessed. No server/background worker launched; all local test commands exited. No real API requests, purchases, generation or credits consumed.

**Stopped after tests. Local mock PASS; live synthesis NO-GO until separate factual gates pass.**
