// Role policies consume existing stats; no new model, spawn or damage authority.
export const ENEMY_ROLES = Object.freeze({
  melee: Object.freeze({ mode: 'close', attacks: Object.freeze(['melee']), preparedOnly: false }),
  heavy: Object.freeze({ mode: 'close', attacks: Object.freeze(['heavy']), preparedOnly: false }),
  fast: Object.freeze({ mode: 'close', attacks: Object.freeze(['quick']), preparedOnly: false }),
  ranged: Object.freeze({ mode: 'stand-off', attacks: Object.freeze(['ranged']), preparedOnly: false }),
  elite: Object.freeze({ mode: 'close', attacks: Object.freeze(['melee', 'heavy']), preparedOnly: false }),
})
export const EXISTING_ENEMY_ROLES = Object.freeze({ scout: 'fast', warrior: 'melee', heavy: 'heavy', glassStalker: 'fast', glassBrute: 'heavy', ranged: 'ranged', elite: 'elite' })

export function enemyIntent(role, stats, distance, playerAlive = true) {
  if (!ENEMY_ROLES[role]) throw new RangeError('Unknown enemy role')
  if (!Number.isFinite(distance) || distance < 0) throw new RangeError('Enemy distance must be a non-negative finite number.')
  if (!playerAlive || distance > stats.detectionRange) return 'patrol'
  if (role === 'ranged' && distance < stats.attackRange * .55) return 'retreat'
  return distance <= stats.attackRange ? 'attack' : 'chase'
}

export function validateEncounter(spawns, types) {
  const ids = new Set(), errors = [], roles = {}
  for (const spawn of spawns) {
    if (!spawn.id || ids.has(spawn.id)) errors.push('Missing/duplicate spawn ID')
    ids.add(spawn.id)
    if (!types[spawn.type]) errors.push(`Unknown enemy type: ${spawn.type}`)
    if (!Array.isArray(spawn.position) || spawn.position.length !== 3 || !spawn.position.every(Number.isFinite)) errors.push('Invalid spawn position')
    const role = EXISTING_ENEMY_ROLES[spawn.type] ?? 'unassigned'
    roles[role] = (roles[role] ?? 0) + 1
  }
  return { ok: errors.length === 0, errors, count: spawns.length, roles }
}

// A future pickup/potion adapter can use this without replacing the existing HUD,
// damage authority or campaign record. This does not grant/consume any inventory.
export function recoveryAvailability({ health, maxHealth, charges, now, readyAt = 0, defeated = false, blocked = false }) {
  if (![health, maxHealth, charges, now, readyAt].every(Number.isFinite) || maxHealth <= 0 || health < 0 || charges < 0) return 'invalid'
  if (defeated || health <= 0) return 'defeated'
  if (blocked) return 'incompatible-action'
  if (health >= maxHealth) return 'full-health'
  if (charges < 1) return 'empty'
  if (now < readyAt) return 'cooldown'
  return 'ready'
}
