# 5H.38 isolated event-audio controller

Staging source: `phase6/milestone5H38/staging/`. Unmodified pre-edit copy: `rollback/`; source/config hashes and protected manifest: `baseline.json`.

No movie recording, theme, generated audio or production change. Five dialogue slots and one music slot in staging `src/audio/eventSlots.js` have `src:null` and unverified rights. All real movie/theme playback is BLOCKED. Test fixtures use `mock-only:` identities, not real recordings or permissions. Do not set rights metadata merely to make playback work.

From the project root:

```powershell
node phase6/milestone5H38/controller.test.mjs
node phase6/milestone5H38/build.mjs
./node_modules/.bin/oxlint.cmd phase6/milestone5H38/staging/src
```

The build outputs only to this milestone's `build/`, with public asset copying disabled and no project .env loaded. It is a compile check, not a distributable playable package. Production dist is untouched.

Optional untested manual launch helper: `node phase6/milestone5H38/server.mjs`. It uses a separate ephemeral localhost origin, staging envDir/cache and no copied .env. Always use a disposable browser profile. The helper was not launched by this milestone; it blocks public audio routes and serves existing non-audio game assets read-only. Game videos retain existing behavior; no claim is made that this is a release packaging or all-media rights scanner. Stop the foreground helper with Ctrl+C after any future review.

Independent channel sliders are in the existing sound settings in staging only. They are memory-only; existing master controls retain their old settings path on the disposable origin. No new persistence schema. Changing bus gains does not approve media.

Handler tests run Node without a browser/window/localStorage and exercise actual damage, defeat, boss and campaign launch functions against mocked audio. They are not natural gameplay or listening tests. No personal save profile is accessed. Keep the previously preserved 14 campaign files and every old staging/rollback unchanged.

Rollback: stop only owned staging/test processes, retain evidence and abandon this staging path. No production restoration or copy-back is needed. Do not overwrite old snapshots or delete assets to free disk space. A later authorized asset must be independently cleared and inventoried before its configurable slot is enabled; production integration remains separately gated.
