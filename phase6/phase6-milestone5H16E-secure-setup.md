# Milestone5H.16E — Secure local Sarvam configuration

15 November2026, Asia/Calcutta. **Setup safeguards prepared; credential configuration MISSING. No API or synthesis started.** Existing20-request/10-credit authorization persists, but account/rights/cost prerequisites from5H.16D remain unresolved.

## Read-only presence inspection

Project-root `.env*` enumeration found **no environment files**. Current process variables with SARVAM/BULBUL in their names: **none**. No secret value was emitted or copied. No browser profile, OS credential store, private dashboard, global/user environment registry or unrelated config directory searched. This is evidence about project-root files/current process, not proof no key exists anywhere on the machine.

The isolated presence check uses canonical **SARVAM_API_KEY**. It does not validate a key format, expiry, account ownership, authentication, balance or permissions. Nonempty detection is not a working API credential PASS. Placeholder text would also be nonempty, so never represent this check as credential validity.

## Authorized changes

1. `.gitignore`: added only a comment and `.env` / `.env.*` patterns. All local environment variants, including .env.local and .env.production, are ignored. No example exception was added. Existing ignore rules retained.
2. New non-production helper: `phase6/sarvam-secure-setup/check-config.mjs`. Reads process presence only, emits configured boolean and unsafe VITE-name detection, never a key value; no network library/call. Exit2 indicates missing variable or unsafe client-prefixed name;0 means presence-only check passed.
3. The two requested documentation reports. No .env, key, runner or generated audio created; no production source/config other than the explicitly requested `.gitignore` protection changed.

There is **no `.git` repository** in this workspace. Exact ignore patterns were asserted, but a real repository's effective tracked-state/history could not be checked. Ignore rules do not remove already tracked secrets or protect files in archives, manual uploads or copied folders. If a repository is introduced later, verify ignore behavior and that no environment file is tracked before any commit. No repository created or commit performed.

## Local setup instructions — user action only

If you already have a Sarvam account, use your own authenticated official dashboard to locate its documented API-key management. If no key exists, create one there only if you choose to and the account permits it; this task has not authorized the assistant to create accounts/keys or accept terms. Do not generate speech, purchase/top up, edit billing or expose a key in chat. A locally configured key does not establish commercial entitlement or qualified credits.

In a private local editor, create the project-root `.env` file yourself. Add this variable using your actual key in place of the explanatory placeholder:

```dotenv
SARVAM_API_KEY=<your-local-secret>
```

The displayed string is **not a credential** and must not be used literally. Do not share the file, include it in a screenshot/log or put the key on a shell command line. Do not use VITE_SARVAM_API_KEY, import.meta.env, a public JSON/HTML file or application source; browser bundles cannot keep a service secret. Keep editor sync/backups/sharing exclusions and OS file permissions appropriate to private credentials. Environment files are plaintext, not encryption.

Alternatively configure the same variable securely for the local authoring process through a user-managed secret facility; no persistent machine/global environment change is required or performed here. Existing terminal processes may not inherit changes; start a new process when appropriate. Never print the environment to confirm it.

## Presence-only verification command

From `C:\Users\Hp\Downloads\kalki 2898AD`:

```powershell
node --env-file-if-exists=.env phase6/sarvam-secure-setup/check-config.mjs
```

Existing Node26 was used; no package install needed. Node loads only the explicitly named .env plus inherited environment; other .env variants are not automatically loaded by this command. Inherited environment may take precedence, so keep one deliberate source. Do not echo values to debug precedence.

Executed result:

```json
{"variable":"SARVAM_API_KEY","configured":false,"unsafeClientNamePresent":false,"authentication":"NOT TESTED — no API request","synthesis":"NOT STARTED"}
```

Node also reported that .env was absent; that message contains no key. Expected missing-configuration exit2 is a blocked readiness result, not a completed authentication test. No synthetic test key or environment file was created. No authenticated request, free balance lookup or paid generation occurred.

## Application boundary

The production React/Vite assistant remains **text-only**. It was deliberately not changed to read credentials. The isolated local authoring helper demonstrates environment-presence detection for future tooling, not browser integration or a complete TTS runner. Never change Vite envPrefix or define substitutions to expose this secret. No need to launch a development server or build to check a private authoring variable.

## Remaining gates and rollback

- Configure a real key locally without exposing it; rerun presence check and leave authentication UNVERIFIED until separately permitted.
- Provide nonsecret eligible-account/qualified-credit/balance/tax evidence and demonstrate a10-credit total cap. A key is not evidence of any of those.
- Preserve existing rights checks, packaging exclusions, drafts, WAVs, saves and5H.12 listening decision. No production voice approved.

Rollback: stop using the helper; remove only the added `.gitignore` comment/pattern block if explicitly desired, keeping all original rules. Removing ignore protection while a secret exists is not recommended. No production/audio/save restoration is necessary. No source backup, credential copy, commit, server or worker created.

**Stopped after local configuration check. Credential missing; synthesis remains blocked.**
