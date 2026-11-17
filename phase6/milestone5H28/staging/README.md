# Mission1 one-event voice staging

Do not deploy or copy into production. Temporary prototype voice only; rights and pronunciation not approved.

Run from project root: `node phase6/milestone5H24/server.mjs`. Open the printed ephemeral loopback URL in a fresh disposable browser profile/context. No personal-profile copying or existing save import. Vite dev server uses this staging/src and staging cache/env directory; public assets are served from production/public read-only, installed dependencies are shared read-only. No .env copied. Review server must be stopped with Ctrl+C.

Launch Mission1 normally. After gameplay/keyboard readiness, first movement with remaining patrols and dormant boss plays existing BH6-5E-002 calm guidance once that round. Skip voice, Replay voice, Mute and Volume appear in the staging-only panel. Pause cancels; resume never automatically resumes cancelled narration. Restart creates a new round; exit unmounts/disposes. Nothing connected in Missions2 onward. No mission state/callback writes by the adapter.

Rollback-src and prototype-rollback reside alongside staging. Production needs no restoration because it was untouched. Do not copy staging changes back, delete old audio or overwrite any save. Test evidence and limitations are in the three5H24 reports.
