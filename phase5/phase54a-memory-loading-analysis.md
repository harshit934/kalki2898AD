# Phase 5.4A memory and loading analysis

## Memory evidence

Windows sampling uses GetPerformanceInfo and process GetProcessMemoryInfo plus PDH English counters. It records available physical RAM, system commit/limit, disk reads/read latency, CPU, system page-ins, owned Chrome working sets/private bytes/CPU and total faults. Process fault totals include soft faults; system page-ins are not owned-process hard faults. No hard-fault ownership or full kernel wait chain was captured.

Control combat3: minimum available19.1 MiB, peak commit26.60 GiB, peak system page-ins99,833/s. During the3878.1 ms gap, nearby1s samples show roughly369–396 MiB available,15–32% total CPU and70–206 ms average disk-read latency. The owned main renderer remains around183.14–183.17 CPU seconds across much of this wait, despite seconds passing. Its faults are mostly flat during part of that interval; paging elsewhere is not proof it caused this wait.

Profiled combat available minima340.5/812.0/6.2 MiB. High system paging also occurs in otherwise reasonably paced menu/combat periods. RAM pressure is real; correlation cannot establish it as the sole or primary cause of the severe event. NVIDIA global sampled memory and utilization per window are included in reproduction-results.json. Those readings are not a VRAM-allocation/residency trace;4GB VRAM exhaustion is not established.

The two cohorts retained the same build, actual 1920x1080 buffer, settings, input policy, order and7s settling. All recorded window power samples report AC online and Battery Saver off; battery percentage naturally changed. Background applications were left unchanged, but their workload, RAM residency, caches and Windows page-file growth were not controlled. Control-versus-profiled differences are not a causal RAM experiment or a measured optimization benefit.

## Loading versus gameplay

The30s nominal measured windows begin after scene readiness and7s settling. Navigation, menu selection, cinematic/start transition and initial loading are excluded. Aggregate setup wall times are in results; they include UI/automation and fixed waits and must not be labelled pure asset-load duration. Warm profiled windows recorded zero new Resource Timing fetch events. This excludes a coincident observed network fetch in those captures; it does not exclude GPU first use, paging, an already pending decode or unobserved local work.

The new seconds-long control gaps are inside an already active warm combat scenario, not merely an initial load screen. Shader first-use queries still occur after the combat window starts, despite current async warm-up. Existing textures/skinning data may be uploaded during ordinary rendering; texSubImage2D appearing in CPU profiles alone is not proof of asset loading. Largest timed menu texture upload7.6 ms,6400 bytes; no multi-second timed upload captured.

No comprehensive loading-only CPU trace or process-owned hard-fault trace was recorded. Exact per-asset decode cost, OS page ownership and driver queue wait remain unknown. Do not convert system paging observations into a verified primary cause.

