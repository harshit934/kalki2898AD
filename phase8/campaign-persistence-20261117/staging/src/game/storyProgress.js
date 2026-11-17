import { create } from 'zustand'
import { getStoryMission } from './storyCampaign.js'

const KEY = 'kalki-story-adaptation-v1'
export const SCOUTING_FOCUS = Object.freeze({
  terrain: { label: 'Read the terrain', response: 'I will mark the approach and keep the return route in view. A shortcut is only useful if we can leave it again.' },
  threat: { label: 'Read the threat', response: 'Watch the wind-up, not just the weapon. Let the attack commit before you answer it.' },
})

function read() {
  const empty = { seenBriefings: [], scouting: {} }
  try {
    if (typeof window === 'undefined') return empty
    const saved = JSON.parse(window.localStorage.getItem(KEY) || '{}')
    return {
      seenBriefings: [...new Set((Array.isArray(saved.seenBriefings) ? saved.seenBriefings : []).filter(id => getStoryMission(id)?.playable))],
      scouting: Object.fromEntries(Object.entries(saved.scouting && typeof saved.scouting === 'object' ? saved.scouting : {})
        .filter(([id, focus]) => getStoryMission(id) && Object.hasOwn(SCOUTING_FOCUS, focus))),
    }
  } catch { return empty }
}

function persist(state) {
  try {
    if (typeof window !== 'undefined') window.localStorage.setItem(KEY, JSON.stringify({ seenBriefings: state.seenBriefings, scouting: state.scouting }))
  } catch { /* In-memory choices still work when storage is unavailable. */ }
}

export const useStoryProgress = create((set, get) => ({
  ...read(),
  chooseFocus(id, focus) {
    if (!getStoryMission(id)?.playable || !Object.hasOwn(SCOUTING_FOCUS, focus)) return false
    set({ scouting: { ...get().scouting, [id]: focus } })
    persist(get())
    return true
  },
  markBriefingSeen(id, reason) {
    if (!getStoryMission(id)?.playable || !['completed', 'skipped'].includes(reason)) return false
    set({ seenBriefings: [...new Set([...get().seenBriefings, id])] })
    persist(get())
    return true
  },
}))
