# Phase8.3 world architecture

2026-11-16, Asia/Calcutta. **One implemented Arc1 environment extension, with visual acceptance unverified.** The25 location records comprise15 inherited prototype bindings, one new extension and nine planned arc worlds. They are not25 newly built or accepted environments.

## Existing world inspection

The existing world uses a bounded exploration district (x[-8,8],z[-48,16]), original Kashi riverfront/riverbank models and a public Mission1 hub at(3,-.22,-10). Mission2 has the Glass Wastes/pylon corridor. Missions3/6 reuse market-type dressing,4/9/10 wreck courts,5/7/8 tiered street dressing. The architecture layer also reuses Kashi/Complex/Shambhala facade previews; a preview used in Arc1 is not an implemented later-arc world. Ten arc-final arenas exist as separate prototype encounter routes, with optional corrected GLBs. The opt-in high-detail Kashi mode remains opt-in and is not promoted.

## Connected location structure

`worldExpansion/locations.js` records IDs, arcs, all100 mission references, typed environment status, entry/exit connections and their implementation mode, exploration, enemy/boss suitability, asset references and planning constraints. Arc roots use the exact8.1 environment IDs. The four existing Arc1 variants and ten boss prototypes are explicit child/runtime bindings, not replacement locations. Existing mission selection/launch remains authoritative.

Nine future worlds link to preceding/following arc roots through **planned story transitions** with unauthored coordinates. Those links establish a campaign world graph, not playable open-world travel. Planned worlds have runtimeEnabled=false and the extension loader refuses them. Existing legacy scenes stay loaded through World/WorldArchitecture; the new lazy extension loader only accepts its implemented forecourt ID. Future location authors add an approved scene/loader/collision/interaction contract rather than enabling a blank placeholder.

## Implemented representative extension

`kashi-forecourt-passage` adds an eastern shrine forecourt and a screened western service passage within the existing district. It preserves the central travel lane, player spawn, mission hub, boundaries, original city and all mission maps. Main geometry: pointed stone gateway with inset moulding and capitals, worn paving and drain grilles, a stepped shrine/niche roof, record tablets, a bench, framed slatted screens, sagged canopy, utility lamp inserts and small reed planters. All are functioning Three meshes; no static image substitutes or external art.

East route: spawn → court approach → gateway → route record. West loop: spawn → around the screen’s north end → service passage → hidden maintenance record → central street → original hub. Two POIs have range/height-checked E/touch inspection and original English environmental text. No rewards, missions, permits or campaign completion are granted. Discovery/inspection is session-only; existing exploration-position persistence remains unchanged. Neither area is a new100-mission open world.

The extension renders only during default Mission1 exploration. It is disabled for combat, other missions, opt-in Kashi and legacy Kashi prototypes to avoid unreviewed overlaps. No established mission is relocated. The ordinary existing world remains visible while the extension/texture module loads; an error boundary can omit the extension if it fails.

## Render/resource contract

`passageResources.js` owns one resource set per mount: shared box/cylinder/leaf primitives, a bevelled extruded arch, tube moulding and sagged canopy; instanced architectural detail and vegetation; seven shared materials and four clones of existing stone textures. Source images are shared without mutating/discarding borrowed cached textures. Sun/fill, shadows, HDR and fog use the existing Phase7 environment, with no new dynamic lights, shader packages or post-processing. Dry wind/ambient dust is appropriate for this Kashi pocket; no rain/weather simulation or day/night system is invented.

The existing65-effect pool receives one deduplicated location-sweep cue on first session discovery. Its active guard now recognizes free roam even when campaign.isPlaying isfalse; previous code reset the collection in that state. Combat event logic and effect definitions are unchanged. No extra particle renderer is created. The reed group has one bounded wind transform; world observation runs at5Hz and publishes only changes.

Eleven additional render objects; desktop188 represented mesh instances/3,320 triangles, smaller/mobile182/3,308;17 owned geometry/material/texture resources and four texture clones. These are incremental CPU geometry/budget facts, not total game draw calls/VRAM, stable FPS or visual-quality proof. Six instanced objects release their instance buffers as well as the17 owned resources. Cleanup is idempotent; source textures survive. Real GPU cleanup remains unverified.

## Collision/interaction and compatibility

Eleven fixed simplified colliders support the raised court, gateway posts/crown, shrine, screens, canopy and bench. Existing player capsule/autostep/snap/camera code is untouched. CPU Rapier fixtures using the existing1.78m/.34m capsule and autostep settings traverse both authored routes through the **new collider set**. They do not include all existing meshes/colliders or prove continuous camera clearance in the full scene.

WorldExtension owns scene resources; WorldExplorationHud owns contextual readable text/buttons. Inspection gets first chance at the existing roaming Interact action, then falls back to the original hub action. No forced mission, teleport, combat change or extra keyboard listener. Environment state is volatile and clears on unmount; resource-only viewport rebuilds retain discoveries.

## Planning conflict and next world work

The preserved root environment/enemy requirements place Complex/Ashwatthama/Shambhala differently from the staged8.1 arc sequence. This extension is an Arc1 child and does not require resolving/remapping later arcs. Future repair-belt, Complex facility, drainage/underground, desert, causeway, return court, mountain sanctuary, siege and memory worlds remain planned. Resolve the conflicting later-arc assignments before building/activating them; distinct architecture/topology requirements are not satisfied by recolored Arc1 facades or by existing boss prototypes. No original roadmap or campaign mission location changed.
