# Phase 5.3 — Visual evidence and limitations

## Actual asset work

The new riverfront district contains 682,468 triangles, 360,716 vertices and nine
material slots in a 4,372,172-byte GLB (see `phase53-evidence/district-geometry.json`).
This is district geometry, not a whole-frame count or a quality score. Four-sided
facades, turned columns, jali relief, balconies, layered cornices, ghat steps,
pavilions and an entrance landmark replace the previous repeated frontage.
New relay, salvage, barrier, boulder, precinct and articulated Warden assets are
retained alongside their generator scripts and editable Blender sources.

The lighting combines the existing warm shadow-casting sun and environment map
with a cooler sky/fill separation. Water uses an original procedural normal map.
Existing stone normal, roughness and AO surfaces remain in use. No new baked
ambient occlusion, ray tracing, planar reflections or screen-space AO is claimed.
Fog is not used to conceal the new architecture. No render-resolution downgrade
was introduced by this work.

## Before and after evidence

`phase53-evidence/before/` retains the old build's real opening, character and
playable captures. Intermediate `after`, `after-review2` and `after-final` folders
are iteration records, not final acceptance evidence. The selected final
presentation captures and their drawing-buffer/CSS/DPR record belong in
`phase53-evidence/after-selected/`. Full mission and Warden captures belong in
`phase53-evidence/regression-final/`. Screenshots are actual WebGL output, not
movie footage or promotional renders. Inspect each corresponding results JSON
for its source build, layout and capture context.

## Honest quality assessment

Geometry layering and architectural identity are improved, but triangle count
and a 1920×1080 buffer do not prove realistic or AAA quality. The protected base
character's topology and facial proportions remain unchanged. Its hairstyle,
cloth deformation and facial acting still require specialist art review. The
new Warden remains stylized mechanical art with comparatively simple material
variation. Repeated modular motifs, limited dirt/decal variation and limited
water reflection fidelity remain visible. Do not describe these as scanned
production assets or as matching The Last Caretaker reference.

Small legacy rubble still uses visibly faceted geometry, the river has a finite
surface with an abrupt distant boundary, and background coverage is sparse from
the river-facing camera. Some walls and Warden surfaces remain too uniform for
the requested realistic finish. These are remaining art defects, not evidence
of achieved production-quality realism. The new architecture improves the
previous repeated blockout, but the full cinematic-reference standard has not
been attained.

The first active-Warden capture in the final desktop test also caught a very
close camera view near arena geometry. Later combat captures show the normal
follow view. This transient obstruction is retained as evidence and must not be
hidden by selecting only flattering images; camera clearance near arena walls
needs explicit review before unconditional visual acceptance.

Portrait screenshots establish browser layout and touch-input behavior only.
They do not certify a physical phone's GPU, temperature, battery use or frame
rate. Full-resolution screenshot validation and real-time performance validation
are separate deliverables.

## Screenshot pairs

These are uncropped 1920×1080 game captures. Poses and capture instants can differ;
they are not pixel-aligned comparisons. The older combat image is retained
Phase 5.2.1 regression evidence; the other before images were recaptured from the
retained pre-Phase-5.3 build. All after images use the final Phase 5.3 test build.

Kashi, before:

![Kashi before](phase53-evidence/before/kashi-opening.png)

Kashi, after:

![Kashi after](phase53-evidence/after-selected/kashi-opening.png)

Bhairava, before:

![Bhairava before](phase53-evidence/before/bhairava-close.png)

Bhairava, after:

![Bhairava after](phase53-evidence/after-selected/bhairava-close.png)

Combat and Bujji companion, before:

![Combat and companion before](phase521/regression/mission-1-keyboard-mission2-100.png)

Combat and Bujji companion, after:

![Combat and companion after](phase53-evidence/regression-final/mission-1-keyboard-mission2-100.png)

Cinematic transition, before:

![Transition before](phase53-evidence/before/cinematic-transition.png)

Cinematic transition, after:

![Transition after](phase53-evidence/after-selected/cinematic-transition.png)

Normal playable camera after the handoff:

![Final playable Kashi](phase53-evidence/after-selected/kashi-gameplay.png)

The final HUD/relay captures are also copied into `after-selected` from the
completed HUD test. The original captures remain in `after-final`; those specific
HUD images use the latest build, while that folder's earlier cinematic poses are
superseded by `after-selected`.

## Resolution and memory evidence

The selected presentation run measured a WebGL buffer of 1920×1080, CSS canvas
1920×1080, DPR 1.0000000149011612 and an ANGLE GTX 1650 D3D11 renderer. Its sampled
frame reported 296 renderer calls, 2,487,530 rendered triangles and 104 texture
objects. These are one-frame renderer counters, not whole-scene unique geometry,
GPU residency bytes or OS-presented frame counts. The count includes rendering
passes and does not establish image quality. See the presentation JSON for the
actual captured values and the performance JSON for separately measured 720p
timing windows.
