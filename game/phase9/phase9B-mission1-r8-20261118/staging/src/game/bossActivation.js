// A rejected start is retryable. Consume the arena trigger only after success.
export function tryStartBoss(triggerRef, reached, begin) {
  if(triggerRef.current || !reached)return false
  if(begin()!==true)return false
  triggerRef.current=true
  return true
}

// Enter from inside the arena: a side road beyond its Z threshold is not entry.
export function arenaEntryReached(player,arena,ready){
  return Boolean(ready&&Number.isFinite(player.x)&&Number.isFinite(player.z)&&player.x>=arena.minX&&player.x<=arena.maxX&&player.z>=arena.minZ&&player.z<=arena.entranceZ)
}
export function wardenAttackType(phase,sequence){return phase===1?'melee':phase===2?(sequence%2===0?'shockwave':'bolt'):['melee','shockwave','bolt'][sequence%3]}
