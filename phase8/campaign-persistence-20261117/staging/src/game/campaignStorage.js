import { normalizeProgress } from './progressValidation.js'

export const CAMPAIGN_SAVE_KEY = 'kalki-campaign-progress'
export const CAMPAIGN_BACKUP_KEY = `${CAMPAIGN_SAVE_KEY}-backup`

// Read-only load; preserve unknown legacy fields. No browser profile is accessed by tests.
export function createCampaignPersistence(storage, missions) {
  let observed = null, document = {}, blocked = false
  const valid = raw => {
    if (!raw) return null
    const value = JSON.parse(raw)
    if (!value || typeof value !== 'object' || Array.isArray(value) ||
      !['completedMissionIds', 'unlockedMissionIds', 'rewards', 'selectedMissionId'].some(k => Object.hasOwn(value, k)) ||
      ['completedMissionIds', 'unlockedMissionIds'].some(k => Object.hasOwn(value, k) && !Array.isArray(value[k])) ||
      (Object.hasOwn(value, 'rewards') && (!value.rewards || typeof value.rewards !== 'object' || Array.isArray(value.rewards)))) {
      throw new Error('Campaign record is invalid')
    }
    return value
  }
  const parse = raw => { try { return valid(raw) } catch { return null } }
  const normalized = value => ({ ...value, ...normalizeProgress(value, missions) })
  function load() {
    try {
      observed = storage.getItem(CAMPAIGN_SAVE_KEY)
      const primary = parse(observed)
      const backup = parse(storage.getItem(CAMPAIGN_BACKUP_KEY))
      document = primary || backup || {}
      blocked = Boolean(observed && !primary && !backup)
      return { progress: normalized(document), status: blocked ? 'corrupt' : primary ? 'saved' : backup ? 'recovered' : 'new' }
    } catch {
      blocked = true
      return { progress: normalized({}), status: 'unavailable' }
    }
  }
  function commit(patch, fresh = false) {
    try {
      if (blocked && !fresh) return { ok: false, status: 'corrupt' }
      const current = storage.getItem(CAMPAIGN_SAVE_KEY)
      if (current !== observed) return { ok: false, status: 'conflict' }
      const old = parse(current)
      // Preserve corrupted originals or explicitly replaced campaigns under a new key.
      if (current && (!old || fresh)) {
        let key = `${CAMPAIGN_SAVE_KEY}-archive-${Date.now()}`, suffix = 0
        while (storage.getItem(key) !== null) key = `${CAMPAIGN_SAVE_KEY}-archive-${Date.now()}-${++suffix}`
        storage.setItem(key, current)
        if (storage.getItem(key) !== current) throw new Error('Archive verification failed')
      }
      if (old) storage.setItem(CAMPAIGN_BACKUP_KEY, current)
      const next = normalized(fresh ? patch : { ...document, ...patch })
      next.saveVersion = 2
      next.savedAt = new Date().toISOString()
      next.campaignScore = Object.values(next.rewards).reduce((sum, row) => sum + Object.values(row).reduce((a, n) => a + n, 0), 0)
      const raw = JSON.stringify(next)
      storage.setItem(CAMPAIGN_SAVE_KEY, raw)
      if (storage.getItem(CAMPAIGN_SAVE_KEY) !== raw) throw new Error('Save verification failed')
      document = next; observed = raw; blocked = false
      return { ok: true, status: 'saved', progress: next }
    } catch { return { ok: false, status: 'unavailable' } }
  }
  return { load, commit }
}
