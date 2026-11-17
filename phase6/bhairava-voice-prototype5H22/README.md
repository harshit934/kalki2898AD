# Isolated Bhairava voice prototype5H.22

Temporary prototype acceptance only. No commercial rights/production voice approval. This is an interactive dialogue/event fixture, not a playable campaign mission, and it never imports game stores or writes saves.

From the project directory run:

```powershell
node phase6/bhairava-voice-prototype5H22/server.mjs
```

Open the printed `http://127.0.0.1:<port>/` URL. It serves only allowlisted prototype files and the five existing5H7 WAVs. Do not open index.html directly: browser module/manifest loading needs HTTP. Stop the foreground server with Ctrl+C after review. No production dev server needed.

Choose a category; its click/tap is the user gesture for audio. Enable audio is optional preparation. Use Skip or Escape to dismiss, Replay to hear the last line again, and mute/volume for control. Same fixture event is committed once and never auto-repeats. Reload resets this disposable in-memory fixture; no localStorage/sessionStorage writes. Simulate cinematic interruption cancels current audio; it does not launch a real cinematic. Missing files retain text and settle safely. Narration uses fixed sample context, not live campaign facts.

All five existing variants are referenced at their original locations via the allowlisted server; no audio is copied into public/dist or generated. The serious fallback and completion statement do not demonstrate dramatic emotional acting or triumph. Original dialogue/scorecard status remains unchanged.

Tests: `node phase6/bhairava-voice-prototype5H22/controller.test.mjs`; browser harness requires the already installed Playwright-core at its documented local absolute path and Chrome. It uses disposable headless browser contexts and stops its server. Reports record results and limitations. No installation needed for this machine's existing tools.

Rollback: no production restoration needed; stop the owned server/browser, retain this directory and all prior samples. Do not delete or move old WAVs. Any later removal is a separate deliberate cleanup, not an automatic action. No feature flag, save/schema, rights manifest or environment variable changed.
