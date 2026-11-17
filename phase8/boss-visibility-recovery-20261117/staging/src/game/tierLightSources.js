export const BURN_SITES = [[-6.7, -15], [6.7, -34], [-6.7, -50]]
export const WINDOW_LIGHTS = [-1, 1].flatMap((side) => [-10, -26, -42, -56].map((z) => ({
  position: [side * 9.4, 3, z + (side < 0 ? 3 : -3)],
  color: '#ff9e62', intensity: 1.2,
})))
export const FIRE_LIGHTS = BURN_SITES.map(([x, z]) => ({ position: [x, 0.9, z], color: '#ff7028', intensity: 9 }))
export function nearestLightSources(sources, player, count = 4) {
  return sources.map((source) => ({ source, distance: Math.hypot(source.position[0] - player.x, source.position[2] - player.z) }))
    .sort((a, b) => a.distance - b.distance).slice(0, count).map(({ source }) => source)
}
