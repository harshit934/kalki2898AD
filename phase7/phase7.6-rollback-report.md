# Phase 7.6 rollback

Candidate: `phase7/phase7.6/staging/`. Untouched combined baseline: `phase7/phase7.6/rollback/`, 182/182 files matching before.json. Baseline assembled from corrected Phase 7.4 plus exact Phase 7.5 companion files before effects were added. The parent stages themselves remain unchanged.

Only three existing source files changed (App, GameCanvas, PlayerSunlight), with five new presentation files; see implementation report and integrity JSON. No assets, dependencies, combat rules, saves, existing camera code or audio logic require restoration.

To abandon this candidate, use an existing earlier staging launcher or create a new copy from this combined rollback and compile there. Do not copy back to production, delete snapshots or reset campaign/browser storage. Current staging launch command, only when resources are safe: `node phase7/phase7.6/serve.mjs`; use its printed loopback URL in disposable storage. No launcher is currently running.

Preserved: protected 47/47; production 153/153; earlier source copies 7.1 173/173, 7.2 174/174, 7.3 178/178, 7.4 181/181, 7.5 182/182; original combined rollback 182/182. Fourteen actor/camera/companion files and eight audio files match.

Historical reports/test results are untouched. Only the new Phase 7 roadmap and progress tracker record the user-authorized administrative closure of 7.4 and the conditional 7.6 result. No personal saves/profile accessed.

Browser attempt stopped at the preemptive memory guard. Harness finally closed server/browser/monitor; owned Chrome PID 11656 checked absent. Test/build processes finished. No production promotion.
