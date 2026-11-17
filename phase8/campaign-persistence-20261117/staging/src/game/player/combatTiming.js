export const DODGE_ACTIVE_MS = 260
export const DODGE_COOLDOWN_MS = 850

export const ATTACK_INPUT_BUFFER_MS = 100

export function resolveAttackInput(pending, queued, now, readyAt, allowed) {
  if (!allowed) return { pending: null, attack: null }
  const next = queued ? { type: queued, expiresAt: now + ATTACK_INPUT_BUFFER_MS } : pending
  if (!next || now > next.expiresAt) return { pending: null, attack: null }
  if (now < readyAt) return { pending: next, attack: null }
  return { pending: null, attack: next.type }
}
