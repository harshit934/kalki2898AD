// Millisecond game-clock timing shared by the renderer and offline simulation.
export function attackTiming(role, spec, sequence = 0) {
  const heavy = role === 'heavy' || (role === 'elite' && sequence % 2 === 1)
  return { windup: Math.max(heavy ? 650 : role === 'ranged' ? 600 : 350, spec.attackCooldown * (heavy ? .42 : .28)), recovery: heavy ? 850 : role === 'fast' ? 300 : 480, damageScale: role === 'elite' ? heavy ? 1.35 : .85 : 1 }
}
export function stepEnemyAttack(state, role, spec, now, inRange) {
  if (state.phase === 'idle' && inRange && now >= (state.nextAt ?? 0)) {
    state.sequence ??= 0
    Object.assign(state, attackTiming(role, spec, state.sequence), { phase: 'windup', startedAt: now })
    state.strikeAt = now + state.windup
    state.recoverAt = state.strikeAt + state.recovery
    state.damageApplied = false
  }
  if (state.phase === 'windup' && !inRange) {
    state.phase = 'recover'; state.recoverAt = now + 220
  }
  if (state.phase === 'windup' && now >= state.strikeAt) state.phase = 'strike'
  const strike = state.phase === 'strike' && !state.damageApplied
  if (strike) { state.damageApplied = true; state.phase = 'recover' }
  if (state.phase === 'recover' && now >= state.recoverAt) {
    state.phase = 'idle'; state.sequence = (state.sequence ?? 0) + 1
    state.nextAt = now + spec.attackCooldown * .55
  }
  return strike
}
export function advanceProjectile(p, delta, player, obstructionDistance = Infinity) {
  const dt = Math.min(.05, Math.max(0, delta)), dx = p.vx * dt, dz = p.vz * dt
  const lengthSq = dx * dx + dz * dz
  const t = lengthSq ? Math.max(0, Math.min(1, ((player.x-p.x)*dx+(player.z-p.z)*dz)/lengthSq)) : 0
  const perpendicular = Math.hypot(player.x-(p.x+dx*t),player.z-(p.z+dz*t))
  const hit = perpendicular < .65 && Math.abs(player.y+1-p.y)<1
  const travel = Math.sqrt(lengthSq)
  const along = travel ? ((player.x-p.x)*dx+(player.z-p.z)*dz)/travel : 0
  const perpendicularSq = Math.max(0,(player.x-p.x)**2+(player.z-p.z)**2-along*along)
  const contact = hit ? Math.max(0,along-Math.sqrt(Math.max(0,.65*.65-perpendicularSq))) : Infinity
  p.x += dx; p.z += dz; p.life -= dt
  return obstructionDistance <= travel && obstructionDistance <= contact ? 'blocked' : hit ? 'hit' : p.life <= 0 ? 'expired' : 'flying'
}
