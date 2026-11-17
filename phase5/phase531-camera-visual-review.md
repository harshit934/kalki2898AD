# Phase 5.3.1 camera and visual review

Recorded 2026-11-12T13:19:52.177Z. Improvements are real geometry/material changes, but cinematic-reference quality is **not achieved**. Visual limitations require explicit user acceptance.

## Arena obstruction

Before, arena activation shortened the camera ray toward roughly 0.85–1.02 m and could jump between escape directions. The reproduced screenshot shows the player cut off and arena floor filling the frame. Corrected framing stages during the intro and keeps a wider, continuous clear route.

Before:

![Before arena entry](phase531-evidence/camera-before/mission-1-keyboard-warden-active.png)

After, actual saved-game replay:

![After arena entry](phase531-evidence/final-pass/replay-defensive/mission-1-keyboard-warden-active.png)

The latest deliberately interrupted introduction reported **STRESS PASS**, camera-to-pivot distance 6.5 m. This injected 3000 ms stall is a robustness fixture excluded from performance results. Earlier failed staging-only correction is preserved. The selected screenshots show different run positions; they are evidence of reproduced failure/correction, not pixel-identical comparisons. Camera visibility is improved; boss geometry can still partially occlude the player at very close attack range.

## Environment and character

![Current gameplay](phase531-evidence/after-selected/kashi-gameplay.png)

![Current opening](phase531-evidence/after-selected/kashi-opening.png)

Original riverbank GLB adds 153,912 triangles in a 765,176-byte asset; smooth rubble is instanced and uses textured weathering. Far-bank ghats/architecture extend the river composition. Distant geometry does not cast additional shadows. Existing layout/gameplay collision, protected Bhairava and Groom 17 assets remain.

Remaining visible defects: repeated facade/window and paving motifs; faceted cylindrical/mechanical props and boss; broad flat arena walls, sparse sky/background silhouettes and hard material transitions; dark player shading in some angles; animation/cloth/contact limitations; inconsistent fine surface detail and simplified Bujji/vehicles. Small costume additions do not make the character production quality. No claim of AAA quality or parity with the cinematic reference is made.

## Measured presentation

[Presentation evidence](phase531-evidence/after-selected/presentation-results.json) records 1920×1080 WebGL buffer, 1920×1080 CSS canvas, DPR approximately 1 and GTX 1650 renderer; the sampled scene rendered 2,675,042 triangles / 304 calls / 110 textures. This verifies output dimensions, not stable 1080p performance or perceived asset quality. Performance is reported separately.

![Portrait compact HUD](phase531-evidence/after-selected/portrait-hud-compact.png)

Desktop/portrait Full, Compact and Minimal HUD checks passed with readable health and a canvas at screen centre. Physical mobile hardware is untested. Loading/error fixture results are in [regression JSON](phase531-mission-regression-results.json); natural video endings are separately covered by three actual Mission 2 encounters. Existing legacy video/audio has not been newly rights-cleared for distribution; original Mission 1 missing voice lines remain unvoiced.
