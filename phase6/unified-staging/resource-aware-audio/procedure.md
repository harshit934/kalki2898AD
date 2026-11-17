# Resource-aware in-game audio playback procedure

Supersedes the former fixed 2 GB available physical RAM gate for this task. The old gate was a written test restriction in the README/reports and preflight decisions, not part of gameplay/audio code. Historical measurements and blocked results remain unchanged.

1. Identify leftover owned Phase 6 test processes. Stop only known test processes, never unrelated user applications. No such leftover was found in the current preflight.
2. Record physical RAM, commit usage/limit and remaining commit headroom. Do not reject solely for less than 2 GB available physical RAM.
3. Start one local static server and one disposable Chrome context/tab. Use existing compiled staging modules plus read-only diagnostic exports, avoiding Vite dependency optimization while testing. Use a 960×540 viewport for this functional audio check; no performance/resolution acceptance implied.
4. Monitor Windows memory every two seconds. Record values and the test stage. Stop on browser crash, system/resource errors, exhausted commit, commit usage ≥98.5%, or remaining commit below 256 MiB. Also stop if available physical RAM remains below 128 MiB for three consecutive samples. These are pressure safeguards, not an available-RAM eligibility threshold. Absence of those signals is not a guarantee of OS health; stop on other observed instability.
5. Check one actual gameplay event at a time. Use ordinary UI/keyboard gameplay, read-only state and native WebAudio source/analyser records. Never substitute mocked audio or force health/defeat setters for natural gameplay evidence. Record unexecuted cases as BLOCKED.
6. Use only existing original Foley/ambience and previously accepted evaluation voice samples. Wind validates the background channel, not a soundtrack; movie audio remains excluded. Synthetic commercial clearance remains separate.
7. Always close the owned browser/context, server and memory monitor. Preserve original staging source, production, personal saves, rollback and prior evidence. A playback defect requires a new staging copy before any fix.
