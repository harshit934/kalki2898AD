# Phase8.6 performance/resource observations

Target hardware stated by user: Ryzen5 5600H,GTX1650 4GB,8GB RAM. No new package, texture, model, shader, audio or dynamic light. Existing enemy count preserved; role/timing changes use existing loop and meshes. New heal presentation is one24-segment ring,700ms lifetime, reused mounted mesh/material with normal R3F cleanup. Shared action state publishes dodge deadlines only when changed, not every frame. Debounced checkpoint writes avoid per-frame storage writes. Existing Phase7 companion-vector reuse remains.

Executed CPU microbenchmark:10000 batches of combo/healing/elite-role pure rules,5.2396ms; heap delta845248 bytes. Delta includes allocator/GC effects and is not retained RAM. See combat-results.json. Inherited optimization tests also execute real Three/vector/material disposal fixtures; they are not a game benchmark. Build time: 2.20s.

Initial available physical RAM377.24MiB,commit headroom3782.52MiB; final274.88MiB/2148.68MiB. Browser launch would exceed the safe physical margin relative to prior~572MiB observed overhead. No browser/server launched or repeatedly retried; no application terminated. No arbitrary2GB gate.

FPS,median/p95/p99 frame time,GPU/VRAM utilization,real CPU game load,shader stalls,animation smoothness,playability and mobile performance UNVERIFIED. Do not claim stable30/60FPS or enjoyable/fair Nightmare from these rules tests. Further graphical/combat acceptance remains BLOCKED until resources permit a disposable session.
