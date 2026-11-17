# Milestone 5H.5 — Rollback and safe stop plan

**No rollback is currently needed:** this milestone created documentation/evidence only. No environment, model or package acquired; no existing source/audio/save changed.

## Boundaries for future approved work

Only the reserved `phase6/ninada-evaluation/isolated-5h5/` root may contain new environment/source/model/cache/samples/logs. Do not put that directory on persistent PATH, use system-site-packages or install into the global Python. Preserve all existing `phase6/local-tts-evaluation/` WAVs and 51 source drafts.

## Safe stop on any failure

1. Stop launching work. Stop only the owned worker/process tree and its monitors, recording PIDs and exit status. Do not terminate other Python, Chrome, game or Windows processes.
2. Preserve partial logs, model/source manifests, wheel hashes and failure evidence. Mark partial or fallback WAVs failed; do not overwrite/relabel them as successful neural results.
3. Leave the isolated directory in place. Failed tests do not authorize cleanup of existing project files, caches, rollback assets or saves.
4. Recheck original eight WAV hashes and source/production baseline. Report discrepancies before resuming. Do not silently restore or overwrite a personal save.
5. Close the separate PowerShell session to discard its process-scoped settings. No permanent environment restoration should be needed because no persistent settings are to be changed.

## Removal only with later approval

Default rollback is **stop using the isolated environment**, which leaves the project operational. Deleting the directory is optional and requires approval; no deletion performed here.

Before any approved removal, resolve its absolute literal path and verify it equals the reserved root and stays under the expected project `phase6/ninada-evaluation/` directory. Inspect for junctions/reparse points and stop if present. Do not enumerate paths in one shell and pass them to another shell for deletion. Use native PowerShell literal-path operations only after verification, and preserve requested evidence first. Never target `phase6/`, the game root, `.venv` outside this test root, existing audio folders or rollback files.

No uninstall/downgrade of global packages is needed or authorized. Never use cleanup to hide an installation outside the boundary; report such an error instead.

## Current preservation evidence

The environment audit recorded **357/357** production/source/configuration and **3/3** dialogue-source baseline matches; **8/8** original WAV hashes match. Personal saves not accessed. Evidence: `phase6/ninada-evaluation/phase5h5-audit-evidence.json`. This is not a new independent 47-file/14-copy/11-save audit.

Existing reports, models, samples and rights checks remain intact. No owned server or background process launched by this preparation task.
