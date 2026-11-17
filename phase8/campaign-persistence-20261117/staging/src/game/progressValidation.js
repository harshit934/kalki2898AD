// Keep the existing storage schema and stable mission IDs. Reading never writes.
export function normalizeProgress(value, missions) {
  const saved = value && typeof value === 'object' && !Array.isArray(value) ? value : {}
  const ids = new Set(missions.map(m => m.id))
  const cleanIds = list => [...new Set(Array.isArray(list) ? list.filter(id => typeof id === 'string' && ids.has(id)) : [])]
  const completedMissionIds = cleanIds(saved.completedMissionIds)
  const unlocked = new Set(['mission-1', ...cleanIds(saved.unlockedMissionIds), ...completedMissionIds])
  for (const id of completedMissionIds) {
    const next = missions[missions.findIndex(m => m.id === id) + 1]
    if (next) unlocked.add(next.id)
  }
  const rewards = {}
  if (saved.rewards && typeof saved.rewards === 'object' && !Array.isArray(saved.rewards)) {
    for (const mission of missions) {
      const row = Object.hasOwn(saved.rewards, mission.id) ? saved.rewards[mission.id] : null
      if (!row || typeof row !== 'object' || Array.isArray(row)) continue
      const valid = Object.entries(row).filter(([key, amount]) => !['__proto__', 'constructor', 'prototype'].includes(key) && typeof amount === 'number' && Number.isFinite(amount) && amount >= 0)
      if (valid.length) rewards[mission.id] = Object.fromEntries(valid)
    }
  }
  const canResume = id => unlocked.has(id) && missions.some(m => m.id === id && m.playable)
  const selectedMissionId = canResume(saved.selectedMissionId) ? saved.selectedMissionId : [...unlocked].reverse().find(canResume) ?? 'mission-1'
  return { completedMissionIds, unlockedMissionIds: [...unlocked], rewards, selectedMissionId }
}
