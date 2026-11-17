# Minimal source-encoding recovery

14 November 2026 (Asia/Calcutta). **Recovery complete; campaign expansion remains paused.** The original Phase1–10 roadmap remains authoritative. No mission or feature development was continued.

## Exact repair

Affected file: `src/game/storyCampaign.js`, byte offset25875 in the pre-repair file. Its paused integration label contained one Windows-1252 `0x97` em dash in an otherwise UTF-8 source file. The interrupted integration script used Windows default text encoding. The malformed byte was introduced during that integration, not by the baseline.

The pre-batch backup `phase54f-batch20-24/source-before/src/game/storyCampaign.js` was verified against its recorded SHA-256. Comparison established that the damaged file matched the backup plus exactly the three previously recorded integration edits (candidate import, playability expression, candidate status text), allowing only CRLF/LF differences.

Repair changed **only that malformed byte to UTF-8 `E2 80 94`**. Those existing edits and all activity logic remain preserved. Only one source file changed during recovery; no source files were added, removed or otherwise edited. This was an encoding repair, not approval or implementation of campaign content.

Before SHA-256: `d239cea94c68d16609d9cbfda0172baac2e26c3dc7321e7fceb4567669dc517d`.

After SHA-256: `06c9a5c7c7068a2147f79d63fc081b6885433fbf9ce06b350f4a37d211e1228e`.

The pre-repair bytes are retained in `phase54f-batch20-24/encoding-recovery/storyCampaign.before.bin`; do not restore those bytes into active source without correcting the encoding.

## Validation

- `node --check src/game/storyCampaign.js`: PASS.
- `npm run build`: PASS, exit0. Production `dist/` was regenerated as requested. Existing bundle-size/plugin advisories remain. This is build validation, not gameplay acceptance.
- `npm run lint`: PASS exit0, **9 warnings**, no errors. Five historical warnings (four MenuScene, one CorrectedCity); four paused integration warnings (two unused MissionSelect imports, two Batch20Gameplay immutability warnings). No unrelated warning cleanup was attempted.
- Protected files: **47/47 SHA-256 matches** against the verified baseline.
- Preserved campaign copies: all14 file hashes match the paused state.
- No browser, gameplay test, diagnostic or development server was started. Build/lint processes completed.

## Preserved campaign work and final state

The9 modified and5 new campaign-related source files remain in place, exactly as paused apart from the single encoding repair. A complete independent copy of those14 pre-repair files is retained under:

`phase5/phase54f-batch20-24/encoding-recovery/paused-campaign-source/src/`

The verified pre-batch141-file source snapshot remains under:

`phase5/phase54f-batch20-24/source-before/src/`

The exact14-file list/digests remain in `phase54f-batch20-24/paused-changes-and-hashes.json`; recovery comparison and integrity details are in `encoding-recovery/repair-evidence.json` and `encoding-recovery/final-verification.json`. No existing report or rollback file was overwritten.

Missions21–24 remain unvalidated candidates; no mission has been marked complete. Their existing candidate gate/integration was preserved rather than expanded or removed. The compiled build therefore retains that paused opt-in code; build success does not authorize its use or promotion. Production-default mission availability is still based on the existing19-route rule without the candidate query. No gameplay validation or personal-save preservation claim is inferred from compilation.

Personal saves remained untouched by this task: no personal browser profile, localStorage or campaign payload was accessed, reset or written. Their historical contents were not independently inspected. No save-schema change was made.

**Stopped after recovery.** No further development, rollback, mission implementation or phase work is authorized or started.
