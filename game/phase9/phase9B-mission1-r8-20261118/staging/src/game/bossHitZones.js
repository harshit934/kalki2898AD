// Shared by damage checks and the telegraph, so the warning is authoritative.
export const BOSS_MELEE_RADIUS = 3.8
export function bossMeleeContains(player, origin) {
  return Math.hypot(player.x - origin.x, player.z - origin.z) <= BOSS_MELEE_RADIUS
}
