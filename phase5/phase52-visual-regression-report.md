# Phase 5.2.1 — critical visual regression investigation

11 November 2026. **Critical layout checks: PASS. Overall visual/performance acceptance remains CONDITIONAL. No Phase 5.3.**

## Brown band and clipping — observed cause

The old scrolling .main-menu used an absolutely positioned viewport-height canvas and a brown #927361 background. At 1366×768 the menu could scroll 29 pixels, moving the canvas top to -29 and exposing the underlying background. At 960×540 / DPR 2 it moved by 27 pixels. The portrait rule explicitly sized the fixed scene to only 70% of viewport height and 140% of viewport width: its canvas covered about 590.8 of 844 vertical CSS pixels. These are real canvas/container coverage defects, rather than a claim that every brown floor surface is a CSS bug.

The backdrop is now a separate full-viewport layer, while grid/flex content scrolls independently below the 72-pixel header boundary. Scrolled titles are clipped below that boundary, preventing them from passing through the logo; the 3D background is not clipped with the content. Primary actions fit all checked viewports, location/footer content remains reachable and horizontal overflow is prevented. The existing K:L brand remains separate from the KALKI title. The specific reported overlap was not reproduced in the original captured states; after checks show zero initial and visible scrolled overlap in all 12 combinations. No claim is made about an unavailable user screenshot.

## Actual 3D work

Kashi's distant placeholder boxes were rebuilt as detailed staggered buildings and chhatri rooflines in a new versioned GLB; the previous asset is retained byte-for-byte. Shambhala now contains carved sanctuary buildings, layered torana arches, turned columns, individual curved leaf geometry, tapered trunks/branches/roots and modeled mountain ridges. The Complex now has recessed facade cassettes, metallic sun-breakers, cantilevered balconies, corner piers, layered arch ribs, a stepped inverted citadel crown and modular stone paving. Edge chamfers, authored UVs, geometric AO, scanned normal/roughness/AO maps and differentiated metal/stone/foliage responses are real rendering inputs. A material albedo correction gives Complex concrete a restrained neutral response while retaining scanned surface detail.

Foreground/midground/background framing differs by preview. Existing local HDR reflections, filtered sun shadows and contact grounding remain; distance fog begins farther away rather than hiding the new detail. No full-scene blur or post-processing was added. Initial inspection found floating arch supports and poor crown framing in the first new asset pass; both were corrected and the initial captures are archived in phase521/visual/initial-after.

The same detailed frontage kit replaces the former decorative block/torus horizon beyond mission corridors, so ordinary gameplay and shared world cinematics gain architectural depth. The former 256-pixel painted ground pattern is replaced with local scanned albedo, normal, roughness and AO maps. Mission 1's plain visual monolith boxes are replaced with carved geometry while their original collider positions/sizes and gameplay logic remain intact. World reflection lighting is restrained. Protected character, animation, mission, reward, save and progression files are unchanged. Decorative frontage meshes do not introduce new navigation blockers or alter routes.

## Measured dimensions — all three previews

- Full desktop: CSS canvas **1920×1080**, DPR **1**, actual WebGL buffer **1920×1080**, complete PNG **1920×1080**.
- Smaller desktop: CSS/buffer/PNG **1366×768**, DPR **1**.
- Scaled desktop: CSS **960×540**, device DPR **2**, actual WebGL buffer and full PNG **1920×1080**.
- Portrait: CSS/buffer/PNG **390×844**, DPR **1**.

All 12 after states retain canvas top 0 and canvas bottom at the viewport bottom even when the menu scrolls. All primary actions are initially visible, all logo/title intersection areas are zero and no horizontal document overflow is recorded. Scaled desktop still scrolls 100 CSS pixels for secondary content; portrait 23 pixels. This is usable scrolling, not clipped inaccessible options. [Exact measurements](phase521/visual/after-results.json). Screenshots are complete game viewports with no clipping rectangle or post-crop. PNG header dimensions are independently recorded. These checks measure geometry/material rendering and actual buffers; viewport dimensions alone are never used as proof of 1080p.

## Before and after — complete 1920×1080 images

Kashi: [before](phase521/visual/before-1080p-kashi.png) · [after](phase521/visual/after-1080p-kashi.png).

Shambhala: [before](phase521/visual/before-1080p-shambhala.png) · [after](phase521/visual/after-1080p-shambhala.png).

The Complex: [before](phase521/visual/before-1080p-complex.png) · [after](phase521/visual/after-1080p-complex.png).

Portrait and scrolled variants for every location are in [evidence](phase521/visual/). Actual gameplay: [Mission 1](phase521/regression/mission-1-keyboard-mission2-100.png), [Mission 2](phase521/regression/mission-2-keyboard-mission2-100.png), [Bujji chase](phase521/regression/desktop-ground-chase.png). These are live game captures, not promotional renders. Mission reports include measured canvas dimensions; desktop gameplay runs use a real 1920×1080 drawing buffer.

## Validation and known remaining defects/limits

Navigation, settings/audio controls, saves/rewards, mission launching and all three HUD modes: **PASS**. Mission completion and chase results are in the [performance results](phase52-final-performance-results.json); they are not inferred from victory fixtures. Build/lint and preservation results are linked there too.

The described cinematic-reference qualities guide this work. The claimed uploaded Last Caretaker image was not available among this chat's readable attachments, so **direct image-to-image conformance is UNVERIFIED**. No exact visual-match claim is made.

Known remaining art limitations: the protected hero still has its existing stylized/faceted character presentation; procedural foliage and repeated paving/facade motifs need further artist polish; the lower city beneath the Complex and some distant/set-specific regions remain less developed; existing arena walls, traps, faceted crystals/rocks and the procedural companion/vehicle presentation remain below the cinematic reference standard. Dedicated cinematic set pieces have not all received production asset replacements. These are unfinished art areas, not assets being declared final. Shared architecture improves the worlds, but this is not a declaration that every mission and cinematic now meets a shipped commercial game's art standard. Other missions beyond the requested M1/M2/chase were not newly completed by automated playthrough. Physical mobile graphics/performance remain unverified.

Performance remains a separate acceptance gate. Native output and improved meshes do not prove stable gameplay: severe historical stalls and final-repeat status are explicit in the [performance report](phase52-final-performance-report.md). No resolution reduction or blur is used to manufacture a pass. [Protected hashes and source changes](phase52-final-changes-and-hashes.json).
