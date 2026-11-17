# Phase 5.4F production-art inventory

**Current status: production art is incomplete.** Existing geometry, procedural detail or a successful GLB export is not visual acceptance. All new Kashi work stays isolated; the original environment remains default.

## Assets that can be reused with constraints

- Protected Bhairava rig, Groom 17, existing animation/morph resources and rollback assets: preserve all expected hashes. New animations/material presentation must be additive and separately reversible; do not overwrite the source models.
- Existing MakeHuman-derived merchant/porter civilian exports, Idle/Walk clips and notices: provenance is recorded in `public/environment/phase54c-revision/ASSET-CREDITS.md` and `ASSETS_LICENSE.txt`. They can supply background roles and temporary candidate interaction actors; their existence does not make close-up character quality accepted.
- Existing original district/quay/shrine/relay/salvage/barrier/Warden meshes: reusable for continuity and collision reference. Source generators and credits are retained. Reusing the identical corridor with a different objective label is insufficient.
- Existing Poly Haven surface/HDR files: local credits identify the sources in `public/environment/kashi/ASSET-CREDITS.txt`. Reuse mapped surfaces and correct scale; do not mistake a texture overlay for new architecture.
- Existing ten original boss profiles/attack geometry/defeat rules: preserve mechanics and active arena clearance. Their procedural presentation remains an art-polish requirement.
- Existing original cinematic accent and environmental sounds: preserve protected files. Two recorded voice clips lack verified distribution metadata and are blocked by the current runtime provenance gate. Do not infer media rights from unchanged hashes.

## Required playable environment production

| Asset family | Required authored output | Gameplay integration and validation |
|---|---|---|
| Kashi street block | Contiguous connected streets, varied inhabited facades, true recessed openings, balconies, jali, shop interiors, workshop/service spaces, stone/metal/cloth PBR detail | Normal follow-camera views; meaningful foreground composition; collision/foot alignment; no invisible walls blocking promised connections |
| Ghats and riverfront | Walkable descending steps, quay/shoreline transition, river edge, docks and connected side streets; temple/ghat silhouettes | Actual traversal and camera collision; shoreline depth without a flat visible boundary; keep the mission route intact |
| Temple/monument kit | Original curvilinear towers, carved gate/mandap modules, weathered mouldings and region-specific proportions | Readable silhouettes at gameplay distance; crisp near detail; meaningful LOD; avoid generic medieval decoration |
| Integrated future infrastructure | Structural transit deck/supports, service ducts, practical power/water systems, restrained advertisements, inhabited megastructure underside | Must be visible from normal gameplay cameras; physically connected construction, not random scattered props |
| Market/civilian activity | Several distinct licensed/original foreground civilian presentations, vendors, customers, cargo workers, restrained Idle/Walk/work gestures, contextual goods | Foreground quality reviewed close up; per-role/per-distance detail budget; no capsule people or needless skeleton updates |
| Vehicles and machinery | Bujji ground vehicle, freight/convoy transport, working carts, pumps, scanner/repair consoles | Visual meshes fit verified collision proxies; preserve handling; no flight mastery; no unapproved protected replacement |
| Complex approach | Monumental exterior/service modules, freight machinery, permits/checkpoints, maintenance gantry/lift/street connections | No invented free access to restricted interiors; genuinely different route layouts and viewpoints |
| Desert/frontier | Eroded traversable terrain, track decals/geometry, exposed shelters, broken descent, branch roads and convoy staging | Ground handling and camera clearance; bounded dust; no uncontrolled dynamic debris or particles |
| Transport confrontation | Traversable deck, guardian/passenger staging, recovery/retreat points and original readable hazard presentation | Preserve invincible-guardian/survival/scripted-loss outcomes; do not turn canon into an invented kill mission |
| Kashi return/repair | Damage/access-loss state, receipt/claim evidence props, reliable repair fixture, command approach | Visible changes carry story forward rather than repeating the opening district unchanged |
| Shambhala approach | Concealed entrance/turn, actual reveal geometry, original stone/water/canopy assets and vehicle-width approach | Entry/escort bounds and reveal camera; no flat backdrop used as playable proof |
| Sanctuary/siege | Lived-in sanctuary hub plus authored alarm/damage states, bounded debris routes, evacuation gate, rendezvous and breach court | Civilian/escort routes and combat lanes readable; no broad physics/destruction rewrite |
| Ancient-memory/closing sets | Original chariot/archer/weapon assets, bounded battlefield tableau, guardian reaction and present-day return | Original real-time staging; no extracted movie footage; no unsupported sequel resolution or automatic new player power |

## Ten arena presentation requirements

1. M10 Exit Warden: fortified departure gate with shield/road-control architecture.
2. M20 Chain Collector: debt/archive exchange court with tether/collection apparatus.
3. M30 Solar Architect: solar-measurement/optical architecture and readable spoke space.
4. M40 Mirror Duelist: layered reflective screens and solid/echo silhouette contrast; controlled reflection cost.
5. M50 Monsoon Drummer: rainwater/ritual-industrial drainage and resonant architecture.
6. M60 Dune Courier: eroded frontier stop with courier/transport history.
7. M70 Bronze Adjudicator: tribunal scales, inspection galleries and civic-industrial composition.
8. M80 Bastion Ram: structural breach/bastion buttresses with visible fault-line staging.
9. M90 Siege Astrolabe: siege-observation instruments, artillery context and readable bombardment lanes.
10. M100 Horizon Keeper: distinct concluding original challenge at the unresolved horizon; not a film-antagonist death.

Keep gameplay floor bounds, 1v1 isolation, hitboxes, damage rules and telegraph visibility intact. Environment art goes outside active hazard clearance unless explicitly tested. Ten differently colored empty courts are not finished arena art.

## Story actors, animation and audio needs

Distinct presentation is required for relevant civilians/traders, Luke, Manas, the guardian/passenger and ancient-memory figures where the storyboard actually shows them. Do not silently substitute a terminal for a required character interaction or use a generic enemy as an approved final hero model. New original/licensed models must have provenance, UV/PBR materials, bounded geometry and suitable rigs.

Additional animation needs include inspect/diagnose, repair, carry/exchange, talk/listen, vehicle enter/exit, escort signaling, deck evasion, bounded counter, scripted recovery and reaction. Existing protected animation sources stay untouched; added clips must preserve rig naming, grip, feet and root-motion/collision behavior.

Telugu dialogue is original text with proofreading and timed subtitles. Recordings are used only with verified original/licensed provenance. Missing lines stay unvoiced; no copied movie dialogue/music/footage is allowed as a shortcut.

## Captures and UI artwork

Refresh menu and mission images only from the implemented rendered environments. Record source build, mission, camera pose, buffer/CSS dimensions and actual playability. Clearly label diagnostic cameras, fixture screens and cinematics. Provide matched player/world positions for art comparisons; identify deliberate camera-composition changes instead of presenting them as identical-camera evidence.

## Current new Blender candidate

`public/environment/phase54f-authored/street-core.glb` was exported without protected inputs; source and manifest are under `phase5/phase54f-stabilization-20261114/authored-assets/`. It is **not referenced by the current game**. It contains 392,356 triangles across 26 mesh objects and is 60,976,156 bytes. It still needs actual gameplay review, texture/geometry transport and resident-memory budgeting, correct traversal/camera collisions, distant-detail strategy, material/shadow review and repeated 1080p timing. No quality or performance pass is claimed.

The verified Blender 4.5.16 portable tool is isolated under `tools/third-party/`; official source/checksum records are retained. It does not authorize changing protected assets.

## Production gates

- Foreground assets must hold up at normal gameplay distance and preserve character silhouettes.
- Reuse small material/texture sets and real geometry intelligently; measure actual draw calls, triangles, resident memory and loading rather than approving counts alone.
- Keep high-detail geometry close to the player; validate LOD transitions and avoid downloading unused detail. Preserve animation/costume culling coverage.
- Separate loading delays from active gameplay stalls. Retain every >100ms gap and p95/p99/max alongside averages; measure 1080p drawing buffers, not just viewport labels.
- New Kashi stays opt-in until visual and performance gates pass. Existing default, accepted controls, mission logic and all 47 protected files remain available for rollback.
