# Phase 5.4A rendering bottleneck analysis

## Established

- Historical audit sample3:8249.3 ms submission gap contains8237.6 ms renderer call. Exact native operation is still unassigned; do not retroactively use the new captures to assign it.
- New unprofiled combat3 reproduces severe gaps3878.1/3309.8/1535.3/1069.3 ms. The largest begins after a4.0 ms renderer call. The3309.8 ms gap overlaps a3259 ms long task; the3878.1 ms gap is a different event, largely outside recorded long tasks/rendering. Therefore a single rendering-operation explanation is insufficient.
- New profiled longest renderer call219.2 ms occurs inside a callback whose223.791 ms wall duration includes only18.219 ms thread CPU. None of the selected instrumented native calls spans that delay. Actual blocking operation/kernel wait is unresolved, rather than proven expensive AI, physics or shader computation.
- Shader queries are genuine smaller first-use stalls: getProgramInfoLog26.4/21.0/16.6 ms on basic variants in combat1 and depth variants11.3 ms in combat2,5.8 ms in combat3. Native program IDs and full cache keys are retained. Query duration can include compilation completion/IPC/descheduling; it is not isolated compiler CPU time. No large buffer/texture-upload call was observed in the selected native journal. Unwrapped GL APIs cannot be ruled out.
- At combat1 start the control renderer reported2,689,438 triangles,318 calls,147 geometries,110 textures,48 programs. These include actual renderer accounting, not just unique asset triangles. Dynamic shadows, skeleton/animation matrices and surface traversal contribute normal work; their precise savings from changes are not isolated by this experiment.

## Not established

No evidence supports a production change to collision, AI, physics, particles, React state, shadows or resolution as the repair for the severe wait. CPU sampled leaves frequently include updateMatrixWorld and animation evaluation; sampled wall weights do not establish an on-CPU bottleneck or a multi-second cause. No allocation-origin profile proves CombatEffect caused the GC event. No GPU queue/fence trace establishes AMD output, NVIDIA rendering or cross-adapter synchronization as the cause. No thermal/driver-failure claim.

RenderCadence still limits desktop submissions to30 Hz while other R3F updates continue at display cadence; mobile policy differs. Menu shadows freeze after initial frames; gameplay uses dynamic shadows. No policy was changed. Full implementation details and historical limitations remain in the seven initial audit deliverables.

## Decision

Stable 1080p/30 FPS and freedom from multi-second stalls remain unproven. A verified smaller shader-first-use opportunity exists; it is not an explanation or sufficient remedy for the primary blocker. Keep the accepted source unchanged until the blocking-chain evidence or a narrowly reviewed optimization experiment supports a change.

