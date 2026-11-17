# Phase 7.5 acceptance

**CONDITIONAL PASS — static/CPU optimization validated; browser-dependent behavior UNVERIFIED.**

The retained change removes confirmed temporary vector creation in the companion follow/beam loop without changing its numerical outputs, target selection, damage, cooldown, voice rules or interface. It does not redesign characters, environments, combat or cameras.

## PASS

- 123/123 automated checks, including 14 new optimization/equivalence/resource checks and 109 inherited regressions. [Raw optimization results](phase7.5/optimization-results.json); [test commands](phase7.5/test-command-results.json).
- Original and candidate follow output equivalent across 5,000 deterministic moving cases; beam direction/length/orientation, zero-distance behavior, owned-vector isolation and unchanged gameplay decision blocks checked.
- Measurable allocation reduction: 60,000 → 5 constructors for 20,000 follow samples; 40,000 → 5 for 20,000 beam samples, each including independent setup.
- Existing geometry/material/texture cleanup and ownership tested with CPU Three.js objects. No GPU resource lifecycle was introduced by the retained change.
- Before/after production-style builds PASS; lint PASS with 12 inherited warnings, zero new warnings/errors. No packages changed. [Lint comparison](phase7.5/lint-comparison.json).
- Bundle comparison recorded honestly: +269 raw and +110 gzip bytes. [Bundle records](phase7.5/bundle-results.json).
- Protected 47/47, production 153/153, Phase 7.4 181/181, Phase 7.3 178/178, Phase 7.2 174/174, Phase 7.1 173/173, Phase 6 171/171 and new rollback 181/181 match. Seven Scout/Warden files and eight audio files also match inside the new candidate. [Integrity](phase7.5/integrity-results.json).

## Not claimed / UNVERIFIED

- Live companion visuals/interaction across desktop/mobile, actual frame times, GPU usage, decoded memory and browser low-memory recovery. No browser/server was started, as instructed.
- Fix of Phase 7.4's resource blocker, historical stutters, full-game performance or production quality. Phase 7.4 remains BLOCKED.
- Personal-save content integrity is not independently inspected; no personal profiles/save data were accessed or modified. Save source/schema is unchanged.

No visual quality downgrade, protected-asset edit, audio-rights change, save migration or production promotion. The material cache was rejected after real asset inspection and is absent from working source. Existing prior acceptance limitations remain. Stop after this bounded optimization/report; no further phase or broad optimization cycle.
