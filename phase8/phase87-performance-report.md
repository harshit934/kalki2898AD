# Phase8.7 performance/resource record

Target(user supplied):Ryzen5 5600H,GTX1650 4GB,8GB RAM. Existing1080p presentation settings,world,rig,texture assets,shadows and Phase7 companion optimization retained. No new dynamic lights,shadow maps,high-resolution textures,rig asset download or physics bodies. Existing cached GLTF URL and cinematic actor infrastructure reused. No hardware upgrade or paid service required by the implementation.

New golden presentation:one torus,one low-segment wireframe sphere and one32-point batch. The96-float position buffer is reused. Shader materials are basic/unlit/additive;no expensive postprocessing. Existing socket blade geometry/material pipeline is reused for gold color/emission/scale. Existing65-effect pool receives bounded cues;it does not run65 effects simultaneously or create another pool. One Rapier ray is reused for fixed-world LOS;abilities use bounded current target lists. Availability uses a scalar mask instead of per-frame React updates.

Measured CPU fixture I20: 6.1949ms for fixture setup,120 executions of the actual presentation callback,pause/hide assertions and cleanup. This is not real frame time/FPS or a GPU measurement. Buffer identity/finite values verified. CPU fixtures manually release their Three resources;actual R3F/GPU unmount cleanup is not independently verified.

Normal build:955ms. Separate development build:848ms. Existing chunk-size advisory remains. Build directories retain prior unreferenced hashed outputs;latest HTML references current bundles. No cache/rollback/user data deleted.

RAM/commit headroom:240.11/1767.61MiB initially;212.74/759.47MiB at final preflight. Cause of the decrease was not measured. Relative to prior observed~572MiB rendering overhead,this is unsafe for a browser attempt. No fixed2GB gate. No browser/server,unsafe retries or process termination. No further heavy tests after final preflight.

Actual1080p FPS,p95/p99 spikes,GPU/VRAM use,full-game CPU load,mobile performance,camera smoothness,shader stalls and visual quality UNVERIFIED. Do not claim stable30/60FPS or full hardware acceptance.
